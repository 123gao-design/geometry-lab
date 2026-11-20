/* 抛体运动：给初速度与仰角，看轨迹、射程与落地后的弹跳。
   重力、空气阻力与地面弹性都是滑块。取景按预测射程自动缩放。 */
import { camera2d, grid2d, label, fmt, clamp, objScale, vec, hover, showInfo, holdFor } from './gfx.js';

const DEG = Math.PI / 180;
const R0 = 0.1;   // 小球半径基准值（用户 2026-11-18：原来 0.18 太大），再乘「物体」滑块的倍率

export async function create(st) {
  const RAPIER = await st.get2D();
  const p = st.params;
  let sc = objScale(st.ui);
  let R = R0 * sc;

  let world = null, ball = null;
  let trail = [];
  let maxY = 0, landX = 0, landed = false, t = 0;

  const predict = () => {
    const th = p.ang * DEG;
    return {
      range: (p.v0 * p.v0 * Math.sin(2 * th)) / p.g,
      height: (p.v0 * Math.sin(th)) ** 2 / (2 * p.g),
    };
  };

  function reset() {
    if (world) world.free();
    world = new RAPIER.World({ x: 0, y: -p.g });
    trail = []; maxY = 0; landX = 0; landed = false; t = 0;

    const ground = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(12, -0.5));
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(30, 0.5).setFriction(0.4).setRestitution(p.e),
      ground
    );
    ball = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(0.4, R)
        .setLinearDamping(p.drag)
        .setCcdEnabled(true)
    );
    world.createCollider(
      RAPIER.ColliderDesc.ball(R).setRestitution(p.e).setFriction(0.35).setDensity(1),
      ball
    );
    const th = p.ang * DEG;
    ball.setLinvel({ x: p.v0 * Math.cos(th), y: p.v0 * Math.sin(th) }, true);
  }

  reset();
  let last = { ...p };

  let view = { xmax: 20, ymax: 8 };

  return {
    reset,
    frame(dt) {
      // 物体倍率改了要重搭：半径同时进碰撞体与质量
      const kk = objScale(st.ui);
      if (kk !== sc) { sc = kk; R = R0 * kk; reset(); last = { ...p }; }
      if (p.v0 !== last.v0 || p.ang !== last.ang || p.g !== last.g || p.drag !== last.drag || p.e !== last.e) {
        reset();
        last = { ...p };
      }
      // dt = 0 只重画（暂停后拖动画面 / 缩放走这条）
      const pr = predict();
      view.xmax = Math.max(10, pr.range * 1.12 + 1.5);
      view.ymax = Math.max(6, pr.height * 1.45 + 1);

      const { w, h } = st;
      const cam = camera2d(w, h, -1, view.xmax, -1, view.ymax, 0.08);
      // 悬停定格：先按上一帧的位置判指针，命中就把这一帧的步长置零
      const tb0 = ball.translation();
      const onBall = hover(st.ui, cam, tb0.x, tb0.y, Math.max(R * 2.4, 0.25));
      const held = holdFor(st.ui, onBall);
      const step = !held && dt > 0 ? clamp(dt, 1 / 240, 1 / 30) : 0;
      if (step) {
        world.timestep = step;
        world.step();
        t += step;
      }

      const tg = ball.translation();
      const v = ball.linvel();
      if (step) {
        trail.push({ x: tg.x, y: tg.y });
        if (trail.length > 900) trail.shift();
        if (tg.y > maxY) maxY = tg.y;
        if (!landed && v.y > 0 && tg.y < 2 * R + 0.05 && t > 0.2) {
          landed = true;
          landX = tg.x;
        }
        if (tg.x > 60 || tg.x < -5 || tg.y < -3) reset();
      }

      st.readout([
        ['飞行时间', `${fmt(t)} s`],
        ['当前高度', `${fmt(tg.y)} m`],
        ['当前速度', `${fmt(Math.hypot(v.x, v.y))} m/s`],
        ['最高点', `${fmt(maxY)} m`],
        ['第一次落地', landed ? `${fmt(landX)} m` : '—'],
        ['理论射程', `${fmt(pr.range)} m`],
      ]);

      /* ---------- 绘制 ---------- */
      const ctx = st.ctx;
      const pal = st.pal;
      ctx.clearRect(0, 0, w, h);
      grid2d(ctx, cam, w, h, 2, pal.grid);

      // 地面
      ctx.beginPath();
      ctx.moveTo(0, cam.Y(0));
      ctx.lineTo(w, cam.Y(0));
      ctx.strokeStyle = pal.graphite;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 理论抛物线（虚线）
      const th = p.ang * DEG;
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      const n = 120;
      const Tf = (2 * p.v0 * Math.sin(th)) / p.g;
      for (let i = 0; i <= n; i++) {
        const tt = (i / n) * Tf;
        const x = 0.4 + p.v0 * Math.cos(th) * tt;
        const y = R + p.v0 * Math.sin(th) * tt - 0.5 * p.g * tt * tt;
        if (i === 0) ctx.moveTo(cam.X(x), cam.Y(y));
        else ctx.lineTo(cam.X(x), cam.Y(y));
      }
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      // 轨迹
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const q = trail[i];
        if (i === 0) ctx.moveTo(cam.X(q.x), cam.Y(q.y));
        else ctx.lineTo(cam.X(q.x), cam.Y(q.y));
      }
      ctx.strokeStyle = pal.sienna;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 小球
      ctx.beginPath();
      ctx.arc(cam.X(tg.x), cam.Y(tg.y), R * cam.s, 0, Math.PI * 2);
      ctx.fillStyle = pal.sienna;
      ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,.3)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 速度箭头。末端留给下面的读数：切线以上的那一侧是空的（抛物线总在切线下方），
      // 读数挂到箭尖的右上方就不会压在轨迹与理论虚线上。
      const sp = Math.hypot(v.x, v.y);
      const vTip = sp > 0.2 ? vec(ctx, cam, tg.x, tg.y, v.x, v.y, 0.2, pal.indigo, 2.5) : null;

      // 受力分析：开关常显，或指针停在小球上
      if (showInfo(st.ui, onBall)) {
        const mB = (4 / 3) * Math.PI * R * R * R;   // 碰撞体密度按 1 设的
        const mg = mB * p.g;
        const kF = 1.25 / mg;
        const tG = vec(ctx, cam, tg.x, tg.y, 0, -mg, kF, pal.graphite, 2.5);
        label(ctx, 'mg', tG.x + 10, tG.y + 13, pal.graphite, 'left', 15);
        if (p.drag > 0 && sp > 0.05) {
          // Rapier 的线性阻尼等价于加速度 −k v，也就是阻力 −k m v
          const Fd = p.drag * mB * sp;
          const tD = vec(ctx, cam, tg.x, tg.y, -v.x / sp * Fd, -v.y / sp * Fd, kF, pal.alert, 2.5);
          label(ctx, 'kv', tD.x + 10, tD.y - 12, pal.alert, 'left', 15);
        }
        const vt = vTip || { x: cam.X(tg.x), y: cam.Y(tg.y) - R * cam.s - 16 };
        label(ctx, `v=${fmt(sp)} m/s`, vt.x + 10, vt.y - 14, pal.indigo, 'left', 15);
      }

      // 理论射程标记
      const prr = predict().range;
      const mx = 0.4 + prr;
      ctx.beginPath();
      ctx.setLineDash([3, 4]);
      ctx.moveTo(cam.X(mx), cam.Y(0));
      ctx.lineTo(cam.X(mx), cam.Y(predict().height * 0.5));
      ctx.strokeStyle = pal.graphite;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      label(ctx, `理论射程 ${fmt(prr, 1)} m`, cam.X(mx), cam.Y(-0.55), pal.graphite, 'center', 15);
    },
    dispose() { if (world) { world.free(); world = null; } },
  };
}
