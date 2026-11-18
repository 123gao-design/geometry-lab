/* 带电粒子在电磁场中：匀强磁场 B 垂直纸面，匀强电场 E 竖直。
   运动的积分走解析解（见 frame 里的推导），刚体只当容器用，不用 Rapier 的欧拉积分。 */
import { camera2d, grid2d, label, fmt, clamp, objScale, vec, hover, showInfo, holdFor } from './gfx.js';

export async function create(st) {
  const RAPIER = await st.get2D();
  const p = st.params;
  const MASS = 1;
  const R0 = 0.085;            // 粒子半径基准值，再乘「物体」滑块的倍率
  let sc = objScale(st.ui);
  let R = R0 * sc;

  let world = null, body = null;
  let trail = [];
  let clock = 0;
  let last = { ...p };

  // 从原点沿 +x 射入
  function reset() {
    if (world) world.free();
    world = new RAPIER.World({ x: 0, y: 0 });
    trail = [];
    clock = 0;
    body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic().setTranslation(0, 0).setLinearDamping(0)
    );
    world.createCollider(
      RAPIER.ColliderDesc.ball(R).setDensity(MASS / (Math.PI * R * R)),
      body
    );
    body.setLinvel({ x: Math.abs(p.v0), y: 0 }, true);
  }

  reset();

  return {
    reset,
    frame(dt) {
      // 物体倍率改了要重搭：碰撞体半径与密度都按 R 现算
      const kk = objScale(st.ui);
      if (kk !== sc) { sc = kk; R = R0 * kk; reset(); }
      if (p.v0 !== last.v0 || p.q !== last.q || p.B !== last.B) reset();
      last = { ...p };

      const q = Math.round(p.q);

      /* 积分走解析解，一步一步都落在真解上：
         记 ω = qB/m，v_d = (E/B, 0) 是 E×B 漂移，u = v − v_d。B 指向纸外时
         u 以角速度 ω 匀速旋转，位置增量就是 ∫u dt = ((u_y − u'_y)/ω, (u'_x − u_x)/ω)；
         ω → 0 时退化成匀加速直线。位矢按上式直接写回刚体，而不是让 Rapier 做 x += v_new·h
         ——那一步在圆弧上每步都欠一截，转几圈就露出螺旋。 */
      /* 取景先算：轨迹、悬停判定和读数都要它。轨道跑出画面两个单位就重来，
         否则加了 E 之后粒子沿着漂移方向一直往画外走，屏幕上只剩空板。 */
      const { w, h } = st;
      const span = 7;
      const cam = camera2d(w, h, -span, span, -span * 0.75, span * 0.75, 0.06);
      // 悬停定格：先按上一帧的位置判指针，命中就把这一帧的步长置零
      const tb0 = body.translation();
      const onP = hover(st.ui, cam, tb0.x, tb0.y, Math.max(R * 3, 0.3));
      const held = holdFor(st.ui, onP);
      const hs = !held && dt > 0 ? clamp(dt, 1 / 240, 1 / 60) : 0;
      const m = body.mass() || MASS;
      const omega = (q * p.B) / m;                 // 回旋角速度，正负即转向
      const aE = (q * p.E) / m;
      if (hs > 0) {
        const t0 = body.translation();
        const v0 = body.linvel();
        let vx, vy, nx, ny;
        if (Math.abs(omega) < 1e-9) {
          vx = v0.x; vy = v0.y + aE * hs;
          nx = t0.x + v0.x * hs;
          ny = t0.y + v0.y * hs + 0.5 * aE * hs * hs;
        } else {
          const vd = aE / omega;                   // 漂移速度 = E/B
          const th = omega * hs;
          const cs = Math.cos(th), sn = Math.sin(th);
          const ux = v0.x - vd, uy = v0.y;
          const px = cs * ux + sn * uy;            // u 转 θ
          const py = -sn * ux + cs * uy;
          vx = vd + px; vy = py;
          nx = t0.x + vd * hs + (uy - py) / omega;
          ny = t0.y + (px - ux) / omega;
        }
        body.resetForces(true);
        body.setLinvel({ x: vx, y: vy }, true);
        world.timestep = hs;
        world.step();
        body.setTranslation({ x: nx, y: ny }, true);
        clock += hs;
      }

      const t = body.translation();
      const v2 = body.linvel();
      const Fx = q * (v2.y * p.B);
      const Fy = q * (p.E - v2.x * p.B);

      /* 轨迹跑出画面两个单位就重来，否则加了 E 之后粒子沿着漂移方向一直往画外走，
         屏幕上只剩空板。 */
      if (hs > 0) {
        trail.push({ x: t.x, y: t.y });
        if (trail.length > 1600) trail.shift();
        const x0 = cam.wx(0), x1 = cam.wx(w), y1 = cam.wy(0), y0 = cam.wy(h);
        if (t.x < x0 - 2 || t.x > x1 + 2 || t.y < y0 - 2 || t.y > y1 + 2) reset();
      }

      /* 回旋半径按「去掉漂移后的速度」算：(v − v_d)/|ω|。
         E = 0 时它就是 |v|/|ω|；E ≠ 0 时它是摆线生成圆的半径，拿总速率去除会把漂移也算进去。 */
      const vd = omega ? (q * p.E) / m / omega : 0;
      const uu = Math.hypot(v2.x - vd, v2.y);
      const speed = Math.hypot(v2.x, v2.y);
      const radius = omega ? uu / Math.abs(omega) : Infinity;
      st.readout([
        ['速率', `${fmt(speed)} m/s`],
        ['轨道半径 r', `${fmt(radius)} m`],
        ['回旋周期 T', `${fmt((2 * Math.PI) / Math.abs(omega))} s`],
        ['洛伦兹力', `${fmt(Math.abs(q) * speed * Math.abs(p.B))} N`],
        ['绕向', q === 0 ? '不受力' : (omega === 0 ? '不偏转' : (omega > 0 ? '顺时针' : '逆时针'))],
      ]);

      /* ---------- 绘制 ---------- */
      const ctx = st.ctx;
      ctx.clearRect(0, 0, w, h);
      grid2d(ctx, cam, w, h, 1, 'rgba(140,160,190,.10)');
      const pal = st.pal;

      // 磁场符号：出纸面画点，入纸面画叉
      const out = p.B >= 0;
      const stepPx = cam.s * 1.5;
      ctx.strokeStyle = 'rgba(120,150,200,.28)';
      ctx.fillStyle = 'rgba(120,150,200,.35)';
      ctx.lineWidth = 1.4;
      for (let px = stepPx / 2; px < w; px += stepPx) {
        for (let py = stepPx / 2; py < h; py += stepPx) {
          ctx.beginPath();
          if (out) {
            ctx.arc(px, py, 1.6, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.moveTo(px - 4, py - 4); ctx.lineTo(px + 4, py + 4);
            ctx.moveTo(px + 4, py - 4); ctx.lineTo(px - 4, py + 4);
            ctx.stroke();
          }
        }
      }
      // 说明放顶端居中：左上角是外壳的标题条，压上去既看不见也看不清
      label(ctx, out ? '磁场 B ⊙ 指向纸外' : '磁场 B ⊗ 指向纸内', w / 2, 26, pal.faint, 'center', 14);

      // 理想圆（无电场时）：圆心在 x + (v_y/ω, −v_x/ω)，半径 |v|/|ω|，与轨迹重合
      if (p.E === 0 && omega && radius < 40) {
        const ccx = t.x + v2.y / omega;
        const ccy = t.y - v2.x / omega;
        ctx.beginPath();
        ctx.setLineDash([4, 5]);
        ctx.arc(cam.X(ccx), cam.Y(ccy), radius * cam.s, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(160,180,210,.45)';
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 轨迹
      ctx.beginPath();
      for (let i = 0; i < trail.length; i++) {
        const q2 = trail[i];
        if (i === 0) ctx.moveTo(cam.X(q2.x), cam.Y(q2.y));
        else ctx.lineTo(cam.X(q2.x), cam.Y(q2.y));
      }
      ctx.strokeStyle = pal.cyan;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 粒子
      ctx.beginPath();
      ctx.arc(cam.X(t.x), cam.Y(t.y), R * cam.s, 0, Math.PI * 2);
      ctx.fillStyle = q >= 0 ? pal.pink : pal.blue;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,.5)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // 速度箭头常画。分析档把读数挂在箭尖外侧（切线前方是空地），平时只在箭尖点一个 'v'
      const sp = Math.hypot(v2.x, v2.y);
      const vTip = sp > 0.1 ? vec(ctx, cam, t.x, t.y, v2.x, v2.y, 0.22, pal.green, 2.5) : null;
      const infoOn = showInfo(st.ui, onP);
      if (vTip && !infoOn) label(ctx, 'v', vTip.x + 8, vTip.y - 13, pal.green, 'left', 15);

      // 受力分析：开关常显，或指针停在粒子上。F = q(E + v×B)，E 那一项竖直，单独画出来对照。
      if (infoOn) {
        const Fref = Math.abs(q) * (Math.abs(p.v0) * Math.abs(p.B) + p.E) || 1;
        const kF = 1.5 / Fref;
        const fl = Math.hypot(Fx, Fy);
        if (fl > 1e-6) {
          const tF = vec(ctx, cam, t.x, t.y, Fx, Fy, kF, pal.orange, 2.5);
          label(ctx, `F=${fmt(fl)} N`, tF.x + 9, tF.y - 11, pal.orange, 'left', 15);
        }
        if (q !== 0 && p.E > 0) {
          const Fe = q * p.E;
          const tE = vec(ctx, cam, t.x, t.y, 0, Fe, kF, pal.purple, 2.2);
          label(ctx, 'qE', tE.x + 9, tE.y + 11, pal.purple, 'left', 15);
        }
        // 没有速度箭头（近静止）时退到粒子右上方
        const vt = vTip || { x: cam.X(t.x) + R * cam.s, y: cam.Y(t.y) - R * cam.s - 16 };
        label(ctx, `v=${fmt(sp)} m/s`, vt.x + 10, vt.y - 16, pal.green, 'left', 15);
      }
    },
    dispose() { if (world) { world.free(); world = null; } },
  };
}
