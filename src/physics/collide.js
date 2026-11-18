/* 弹性碰撞：两辆小车在无摩擦轨道上对撞，弹性系数 e 从 1（完全弹性）调到 0（完全非弹性）。
   Rapier 做接触求解，碰前 / 碰后的速度与动量、动能由实验框架自己读。 */
import { camera2d, grid2d, arrow, label, fmt, clamp, objScale, hover, showInfo, holdFor } from './gfx.js';

export async function create(st) {
  const RAPIER = await st.get2D();
  const p = st.params;

  // 车宽随质量变，两个方向再乘「物体」滑块的倍率；密度按同一个框现算
  let sc = objScale(st.ui);
  const halfW = m => (0.2 + 0.1 * Math.cbrt(m)) * sc;
  let HH = 0.3 * sc;               // 车高减下来，画面里的车不再顶到半屏（文字反而更清楚）
  let world = null, a = null, b = null, queue = null;
  let pre = { v1: 0, v2: 0 };
  let hit = null;      // 第一次接触时的碰前速度
  let t = 0;

  function reset() {
    if (world) world.free();
    world = new RAPIER.World({ x: 0, y: 0 });
    queue = new RAPIER.EventQueue(true);
    t = 0;
    hit = null;

    const mk = (m, x, v) => {
      const body = world.createRigidBody(
        RAPIER.RigidBodyDesc.dynamic().setTranslation(x, 0)
      );
      world.createCollider(
        RAPIER.ColliderDesc.cuboid(halfW(m), HH)
          .setRestitution(p.e)
          .setFriction(0)
          .setDensity(m / (halfW(m) * 2 * HH * 2))
          .setActiveEvents(RAPIER.ActiveEvents.COLLISION_EVENTS),
        body
      );
      body.setLinvel({ x: v, y: 0 }, true);
      return body;
    };
    a = mk(p.m1, -2.2 - halfW(p.m1), p.v1);
    b = mk(p.m2, 2.0 + halfW(p.m2), p.v2);
    pre = { v1: p.v1, v2: p.v2 };
  }

  reset();
  let last = { ...p };

  const theory = () => {
    const { m1, m2, v1, v2, e } = p;
    const M = m1 + m2;
    return {
      v1: ((m1 - e * m2) * v1 + (1 + e) * m2 * v2) / M,
      v2: ((m2 - e * m1) * v2 + (1 + e) * m1 * v1) / M,
    };
  };

  return {
    reset,
    frame(dt) {
      // 物体倍率改了要重搭：车宽车高进碰撞体与密度
      const kk = objScale(st.ui);
      if (kk !== sc) { sc = kk; HH = 0.3 * kk; reset(); last = { ...p }; }
      if (p.m1 !== last.m1 || p.m2 !== last.m2 || p.v1 !== last.v1 || p.v2 !== last.v2 || p.e !== last.e) {
        reset();
        last = { ...p };
      }
      // dt = 0 只重画（暂停后拖动画面 / 缩放走这条）
      // 取景先算：悬停判定与绘制都要它
      const { w, h } = st;
      const cam = camera2d(w, h, -8, 8, -3, 3, 0.1);
      // 悬停定格：先按上一帧的两车位置判指针，命中任一车就把这一帧的步长置零
      const ta0 = a.translation(), tb0 = b.translation();
      const hovA = hover(st.ui, cam, ta0.x, 0, Math.max(halfW(p.m1) * 1.8, HH * 1.6));
      const hovB = hover(st.ui, cam, tb0.x, 0, Math.max(halfW(p.m2) * 1.8, HH * 1.6));
      const held = holdFor(st.ui, hovA || hovB);
      const step = !held && dt > 0 ? clamp(dt, 1 / 240, 1 / 30) : 0;
      if (step) {
        world.timestep = step;
        // 记下本步之前的速度，接触事件里就是「碰前」
        const before = { v1: a.linvel().x, v2: b.linvel().x };
        world.step(queue);
        queue.drainCollisionEvents((h1, h2, started) => {
          if (started && !hit) hit = { ...before };
        });
        t += step;
        if (a.translation().x < -9 || b.translation().x > 9 || t > 14) reset();
      }

      const va = a.linvel().x;
      const vb = b.linvel().x;

      const P = p.m1 * va + p.m2 * vb;
      const K = 0.5 * p.m1 * va * va + 0.5 * p.m2 * vb * vb;
      const th = theory();
      st.readout([
        ['碰前 v₁ / v₂', hit ? `${fmt(hit.v1)} / ${fmt(hit.v2)}` : '—'],
        ['当前 v₁ / v₂', `${fmt(va)} / ${fmt(vb)}`],
        ['理论碰后', `${fmt(th.v1)} / ${fmt(th.v2)}`],
        ['总动量', `${fmt(P)} kg·m/s`],
        ['总动能', `${fmt(K)} J`],
      ]);

      /* ---------- 绘制 ---------- */
      const ctx = st.ctx;
      ctx.clearRect(0, 0, w, h);
      grid2d(ctx, cam, w, h, 1, 'rgba(140,160,190,.12)');
      const pal = st.pal;

      // 轨道
      ctx.beginPath();
      ctx.moveTo(0, cam.Y(0) + HH * cam.s);
      ctx.lineTo(w, cam.Y(0) + HH * cam.s);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 2;
      ctx.stroke();

      const cart = (body, m, color, tag, hot) => {
        const x = body.translation().x;
        const hw = halfW(m) * cam.s;
        const hh = HH * cam.s;
        const cx = cam.X(x), cy = cam.Y(0);
        ctx.beginPath();
        ctx.roundRect(cx - hw, cy - hh, hw * 2, hh * 2, 6);
        ctx.fillStyle = color;
        ctx.strokeStyle = 'rgba(0,0,0,.25)';
        ctx.lineWidth = 1.5;
        ctx.fill(); ctx.stroke();
        label(ctx, tag, cx, cy, '#1b2330', 'center', 14);
        const v = body.linvel().x;
        if (Math.abs(v) > 0.05) {
          const k = 0.22;
          arrow(ctx, cx, cy - hh - 14, cx + v * k * cam.s, cy - hh - 14, pal.green, 2.5);
        }
        // 分析：指针停在这辆车上（或在常显档）就把速度与动量写出来。
        // 轨道光滑，碰撞前后各是一段匀速，这里没有别的力可画。
        if (showInfo(st.ui, hot)) {
          label(ctx, `v=${fmt(v)} m/s`, cx, cy - hh - 34, color, 'center', 15);
          label(ctx, `p=${fmt(m * v)} kg·m/s`, cx, cy + hh + 18, color, 'center', 15);
        }
      };
      cart(a, p.m1, pal.blue, `m₁=${fmt(p.m1, 1)}`, hovA);
      cart(b, p.m2, pal.orange, `m₂=${fmt(p.m2, 1)}`, hovB);

      // 说明排在轨道下方居中、碰撞提示排顶端居中：左上角与右上角是外壳的标题条和读数框。
      // 轨道说明要让开分析档挂在车底下的 p= 读数，落得比车身低两格。
      label(ctx, '光滑轨道（无摩擦）', w / 2, cam.Y(0) + HH * cam.s + 44, pal.faint, 'center', 14);
      if (hit) {
        label(ctx, '已碰撞', w / 2, 26, pal.pink, 'center', 14);
      }
    },
    dispose() { if (world) { world.free(); world = null; } },
  };
}
