/* 斜面与摩擦：一块木块放在斜面上，改倾角与摩擦因数看它滑不滑、滑多快。
   Rapier 只管刚体与接触求解，绘制全部手画。

   版式（2026-11-18 改）：坡做成一块压在 y = 0 地面上的直角楔形，坡底顶点 A 在右边，
   坡面向左上抬起，楔形的背面竖直落回地面。倾角弧画在 A 处——夹在「地面向左」与
   「坡面向左上」两条边之间，不再画在坡的中间；坡长按取景宽度的六成取，四周留白，
   不顶满画框。 */
import { camera2d, grid2d, label, fmt, clamp, objScale, vec, hover, showInfo, holdFor } from './gfx.js';

const DEG = Math.PI / 180;

export async function create(st) {
  const RAPIER = await st.get2D();
  const p = st.params;
  const G = 9.81;
  const SL = 6.2;              // 坡长（沿坡面）
  const TH = 0.14;             // 坡板半厚
  const HB0 = 0.28;            // 木块半边基准值（2026-11-18 用户说物体太大，从 0.4 收小），再乘「物体」滑块的倍率
  const A = { x: 4.5, y: 0 };  // 坡底顶点：楔形的尖，压在 y = 0 的地面上
  const D0 = 4.3;              // 木块起点离坡底的距离（沿坡）

  let sc = objScale(st.ui);
  let HB = HB0 * sc;           // 木块半边：碰撞体与密度都按它现算，倍率一改就要重搭

  let world = null;
  let body = null;
  let x0 = 0, y0 = 0;

  const th = () => p.angle * DEG;
  const dn = () => ({ x: Math.cos(th()), y: -Math.sin(th()) });  // 沿坡向下
  const nm = () => ({ x: Math.sin(th()), y: Math.cos(th()) });   // 垂直坡面向上

  function reset() {
    if (world) world.free();
    world = new RAPIER.World({ x: 0, y: -G });
    const d = dn(), n = nm();

    // 地面：顶面在 y = 0，木块滑到坡底后接着在地面上滑，停下来就是「摩擦吃掉全部动能」的样子
    const floor = world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(0, -1)
    );
    world.createCollider(RAPIER.ColliderDesc.cuboid(9, 1).setFriction(p.mu), floor);

    // 坡：沿坡放的板，顶面就是坡面（从 A 起沿坡向上 SL），板心在顶面下方 TH
    const cx = A.x - d.x * (SL / 2) - n.x * TH;
    const cy = A.y - d.y * (SL / 2) - n.y * TH;
    const ramp = world.createRigidBody(
      RAPIER.RigidBodyDesc.fixed().setTranslation(cx, cy).setRotation(-th())
    );
    world.createCollider(RAPIER.ColliderDesc.cuboid(SL / 2, TH).setFriction(p.mu), ramp);

    x0 = A.x - d.x * D0 + n.x * HB;
    y0 = A.y - d.y * D0 + n.y * HB;
    body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(x0, y0)
        .setRotation(-th())
        .setLinearDamping(0.02)
    );
    const area = (HB * 2) * (HB * 2);
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(HB, HB)
        .setFriction(p.mu)
        .setDensity(p.mass / area),
      body
    );
    body.setLinvel({ x: d.x * p.v0, y: d.y * p.v0 }, true);
  }

  reset();
  let last = { ...p };

  return {
    reset,
    frame(dt) {
      // 物体倍率改了要重搭：木块边长进碰撞体与密度
      const kk = objScale(st.ui);
      if (kk !== sc) { sc = kk; HB = HB0 * kk; reset(); last = { ...p }; }
      // 四个滑块都改的是场景本身（倾角、摩擦、质量、初速），动了就重搭一次
      if (p.angle !== last.angle || p.mu !== last.mu || p.mass !== last.mass || p.v0 !== last.v0) {
        reset();
        last = { ...p };
      }
      // dt = 0 只重画（暂停后拖动画面 / 缩放走这条），世界不前进
      const { w, h } = st;
      const cam = camera2d(w, h, -4.6, 6.6, -1.3, 5.6, 0.05);
      // 悬停定格：先按上一帧的位置判指针，命中就把这一帧的步长置零
      const tb0 = body.translation();
      const onBlock = hover(st.ui, cam, tb0.x, tb0.y, Math.max(HB * 1.8, 0.55));
      const held = holdFor(st.ui, onBlock);
      const step = !held && dt > 0 ? clamp(dt, 1 / 240, 1 / 30) : 0;
      if (step) {
        world.timestep = step;
        world.step();
      }

      const t = body.translation();
      const v = body.linvel();
      const speed = Math.hypot(v.x, v.y);
      const s = Math.hypot(t.x - x0, t.y - y0);
      // 滑出画面就重来
      if (t.y < -3 || t.x > 8.5) reset();

      const a = th();
      const slide = Math.tan(a) > p.mu;
      const state = speed < 0.03 ? '静止' : (slide ? '加速下滑' : '减速下滑');
      st.readout([
        ['速度', `${fmt(speed)} m/s`],
        ['已滑', `${fmt(s)} m`],
        ['状态', state],
        ['摩擦力', `${fmt(p.mu * p.mass * G * Math.cos(a))} N`],
        ['重力分量', `${fmt(p.mass * G * Math.sin(a))} N`],
      ]);

      /* ---------- 绘制 ---------- */
      const ctx = st.ctx;
      ctx.clearRect(0, 0, w, h);
      grid2d(ctx, cam, w, h, 1, 'rgba(140,160,190,.13)');
      const pal = st.pal;

      const d = dn(), n = nm();
      const T = { x: A.x - d.x * SL, y: A.y - d.y * SL };  // 坡顶
      const ax = cam.X(A.x), ay = cam.Y(A.y);

      // 地面：横贯画面的一条线，下面补一排斜阴影
      ctx.beginPath();
      ctx.moveTo(0, ay);
      ctx.lineTo(w, ay);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.stroke();
      const hstep = cam.len(16);
      ctx.beginPath();
      for (let x = cam.wx(0) - hstep; x < cam.wx(w) + hstep; x += hstep) {
        ctx.moveTo(cam.X(x), ay + 1);
        ctx.lineTo(cam.X(x) - 7, ay + 11);
      }
      ctx.strokeStyle = 'rgba(140,160,190,.35)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // 坡：直角楔形（坡底顶点 → 坡顶 → 坡顶正下方的地面点）
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(cam.X(T.x), cam.Y(T.y));
      ctx.lineTo(cam.X(T.x), ay);
      ctx.closePath();
      ctx.fillStyle = 'rgba(92,173,255,.15)';
      ctx.fill();
      ctx.strokeStyle = pal.blue;
      ctx.lineWidth = 2;
      ctx.stroke();

      // 倾角：顶点在坡底，从「地面向左」扫到「坡面向左上」。
      // 画布 y 朝下，屏幕角度沿正方向增大就是顺时针，所以从 π 扫到 π + θ 正是这两条边夹的那一角。
      const R = 1.15;
      ctx.beginPath();
      ctx.arc(ax, ay, R * cam.s, Math.PI, Math.PI + a, false);
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.6;
      ctx.stroke();
      // 标签放在顶点的右上方、楔形外面：角的内部整块是楔形的填充，沿角平分线无论放多远
      // 都落在这块填充上，字号一大就和图形黏在一起。顶点右边是空地，木块滑到坡底时也只
      // 贴着地面走，抬到 54px 高就不会被它压住。
      label(ctx, `θ=${p.angle}°`, ax + 12, ay - 54, pal.orange, 'left', 15);

      // 木块：按刚体自己的转角画。滑到坡底后它会绕坡脚转平，照坡角硬画的话
      // 前角会扎进地面线以下，看着就是「方块嵌进地里」。
      const t2 = body.translation();
      ctx.save();
      ctx.translate(cam.X(t2.x), cam.Y(t2.y));
      ctx.rotate(-body.rotation());
      const halfPx = HB * cam.s;
      ctx.fillStyle = 'rgba(255,158,74,.85)';
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-halfPx, -halfPx, halfPx * 2, halfPx * 2, 4);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // 速度箭头。箭头末端留给下面的读数用：数值挂在箭尖外侧，离木块和力箭头都远一格。
      const sp = Math.hypot(v.x, v.y);
      const vTip = sp > 0.15 ? vec(ctx, cam, t2.x, t2.y, v.x, v.y, 0.28, pal.green, 2.5) : null;

      // 受力分析：开关常显，或指针停在木块上。三根箭头共用一个标尺（以重力为准），
      // 看的正是各力之间的比例，不随质量滑块跳动。
      if (showInfo(st.ui, onBlock)) {
        const mg = p.mass * G;
        const onRamp = t2.x < A.x - 0.02 && t2.y > 0.03;
        const N = onRamp ? mg * Math.cos(a) : mg;
        let fx = 0, fy = 0;
        if (onRamp && sp < 0.05) {
          // 静止：静摩擦恰好抵消重力沿坡的分量（不够用时才滑）
          const fs = Math.min(mg * Math.sin(a), p.mu * N);
          fx = -fs * Math.cos(a);
          fy = fs * Math.sin(a);          // 沿坡向上就是 −d
        } else if (sp > 0.05) {
          // 滑动摩擦永远逆着速度
          fx = -p.mu * N * v.x / sp;
          fy = -p.mu * N * v.y / sp;
        }
        const kF = 1.6 / mg;
        const nn = onRamp ? n : { x: 0, y: 1 };
        const tN = vec(ctx, cam, t2.x, t2.y, nn.x * N, nn.y * N, kF, pal.blue, 2.5);
        label(ctx, `N=${fmt(N, 1)} N`, tN.x + 10, tN.y - 12, pal.blue, 'left', 15);
        const tG = vec(ctx, cam, t2.x, t2.y, 0, -mg, kF, pal.pink, 2.5);
        label(ctx, `G=${fmt(mg, 1)} N`, tG.x + 10, tG.y + 14, pal.pink, 'left', 15);
        const ff = Math.hypot(fx, fy);
        if (ff > 0.05) {
          const tF = vec(ctx, cam, t2.x, t2.y, fx, fy, kF, pal.orange, 2.5);
          label(ctx, `f=${fmt(ff, 1)} N`, tF.x + 10, tF.y - 12, pal.orange, 'left', 15);
        }
        // 没有速度箭头（静止）时退到木块的右上方
        const vt = vTip || { x: cam.X(t2.x) + halfPx, y: cam.Y(t2.y) - halfPx - 16 };
        label(ctx, `v=${fmt(sp)} m/s`, vt.x + 10, vt.y, pal.cyan, 'left', 15);
      }
    },
    dispose() { if (world) { world.free(); world = null; } },
  };
}
