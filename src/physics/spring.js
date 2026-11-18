/* 弹簧振子：滑块挂在弹簧上，回复力由实验框架每步交给刚体（Rapier 只负责积分）。
   右下的位移—时间曲线随参数实时重画，能直接看出周期、阻尼与临界阻尼的差别。 */
import { camera2d, grid2d, arrow, label, fmt, clamp, objScale, showInfo, holdFor } from './gfx.js';

const WALL = -4.6;       // 墙的位置
const L0 = 2.4;          // 弹簧自然长度（2026-11-18 用户「弹簧不用画那么宽」：从 3.0 收到 2.4）
const XEQ = WALL + L0;   // 平衡位置；x0 的取值 −1.5..1.5，滑块推到两头也在取景内
const HB0 = 0.2;         // 滑块半边基准值，再乘「物体」滑块的倍率

export async function create(st) {
  const RAPIER = await st.get2D();
  const p = st.params;

  let sc = objScale(st.ui);
  let HB = HB0 * sc;       // 滑块半边：密度按边长现算，倍率一改就要重搭

  let world = null, body = null;
  let trace = [];
  let clock = 0;
  let last = { ...p };

  function reset() {
    if (world) world.free();
    world = new RAPIER.World({ x: 0, y: 0 });
    trace = [];
    clock = 0;
    body = world.createRigidBody(
      RAPIER.RigidBodyDesc.dynamic()
        .setTranslation(XEQ + p.x0, 0)
        .setLinearDamping(0)
    );
    world.createCollider(
      RAPIER.ColliderDesc.cuboid(HB, HB).setDensity(p.m / (4 * HB * HB)),
      body
    );
  }

  reset();

  const omega = () => Math.sqrt(p.k / p.m);
  const zeta = () => p.c / (2 * Math.sqrt(p.k * p.m));
  const period = () => {
    const z = zeta();
    return z < 1 ? (2 * Math.PI) / (omega() * Math.sqrt(1 - z * z)) : NaN;
  };

  return {
    reset,
    frame(dt) {
      // 改质量或初始位移要重搭刚体，其余参数即时生效；物体倍率变了同样重搭（密度按边长算）
      const kk = objScale(st.ui);
      if (kk !== sc) { sc = kk; HB = HB0 * kk; reset(); }
      if (p.m !== last.m || p.x0 !== last.x0) reset();
      last = { ...p };

      // 这一栏的相机带 18/12 px 的偏移，取景要先摆好：悬停判定和绘制都要它
      const { w, h } = st;
      const AX = 18, AY = 12, AW = w - 36, AH = h * 0.60 - 12;
      const c0 = camera2d(AW, AH, -7.8, 2.6, -1.5, 1.5, 0.02);
      const X = px => c0.X(px) + AX;
      const Y = py => c0.Y(py) + AY;

      const t = body.translation();
      const v = body.linvel();
      const dx = t.x - XEQ;
      const F = -p.k * dx - p.c * v.x;

      // 悬停定格：指针换算回世界坐标时先减掉面板边距（AX/AY），别把偏移算进位移
      const overB = !!st.ui && st.ui.in &&
        Math.hypot(c0.wx(st.ui.x - AX) - t.x, c0.wy(st.ui.y - AY)) <= HB * 2;
      const held = holdFor(st.ui, overB);
      // dt = 0 只重画（暂停后拖动画面 / 缩放走这条），施力与步进一起停
      const step = !held && dt > 0 ? clamp(dt, 1 / 240, 1 / 30) : 0;
      if (step) {
        body.resetForces(true);
        body.addForce({ x: F, y: 0 }, true);
        world.timestep = step;
        world.step();
        clock += step;
      } else {
        body.resetForces(true);
      }

      const t2 = body.translation();
      const v2 = body.linvel();
      if (step) {
        trace.push({ t: clock, x: t2.x - XEQ });
        while (trace.length && trace[0].t < clock - 8) trace.shift();
      }

      const x = t2.x - XEQ;
      const E = 0.5 * p.m * v2.x * v2.x + 0.5 * p.k * x * x;
      const T = period();
      st.readout([
        ['位移 x', `${fmt(x)} m`],
        ['速度 v', `${fmt(v2.x)} m/s`],
        ['加速度 a', `${fmt((-p.k * x - p.c * v2.x) / p.m)} m/s²`],
        ['周期 T', Number.isFinite(T) ? `${fmt(T)} s` : '过阻尼'],
        ['阻尼比 ζ', fmt(zeta())],
        ['机械能 E', `${fmt(E)} J`],
      ]);

      /* ---------- 绘制 ---------- */
      const ctx = st.ctx;
      ctx.clearRect(0, 0, w, h);
      const pal = st.pal;

      // 平衡位置虚线
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(X(XEQ), Y(1.3));
      ctx.lineTo(X(XEQ), Y(-1.3));
      ctx.strokeStyle = 'rgba(160,180,210,.45)';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      // 墙
      ctx.beginPath();
      ctx.moveTo(X(WALL - 0.18), Y(-1.35));
      ctx.lineTo(X(WALL - 0.18), Y(1.35));
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 3;
      ctx.stroke();
      for (let y = -1.3; y <= 1.3; y += 0.22) {
        ctx.beginPath();
        ctx.moveTo(X(WALL - 0.18), Y(y));
        ctx.lineTo(X(WALL - 0.42), Y(y - 0.18));
        ctx.strokeStyle = 'rgba(160,180,210,.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 弹簧：折线，圈数固定，随长度拉伸；整条折线的上下幅度取滑块高度的 65%
      // （2026-11-18 用户「振幅太大，和 65% 的物块高度一致就行」），
      // 峰到峰即 0.65·2HB，半边幅度 0.65·HB，随「物体」倍率一起变
      const amp = 0.65 * HB;
      const xr = t2.x - HB;
      const x0 = WALL - 0.18;
      const coils = 9;
      ctx.beginPath();
      for (let i = 0; i <= coils * 2; i++) {
        const u = i / (coils * 2);
        const px = x0 + (xr - x0) * u;
        const py = i === 0 || i === coils * 2 ? 0 : (i % 2 ? amp : -amp);
        if (i === 0) ctx.moveTo(X(px), Y(py));
        else ctx.lineTo(X(px), Y(py));
      }
      ctx.strokeStyle = pal.cyan;
      ctx.lineWidth = 2.0;
      ctx.stroke();

      // 滑块
      const bx = X(t2.x), by = Y(0), hb = HB * c0.s;
      ctx.beginPath();
      ctx.roundRect(bx - hb, by - hb, hb * 2, hb * 2, 6);
      ctx.fillStyle = 'rgba(255,158,74,.88)';
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 2;
      ctx.fill(); ctx.stroke();

      // 受力分析：开关常显，或指针停在滑块上
      if (showInfo(st.ui, overB)) {
        const Fs = -p.k * x;        // 弹簧力：总指向平衡位置
        const Fd = -p.c * v2.x;     // 阻尼力：逆着速度
        const Fref = Math.max(p.k * 1.2, 1e-6);   // 标尺取 1.2 m 形变时的弹力
        const slack = 1.4 / Fref;
        // up 为真时读数挂在箭头上方，否则挂在下方。F弹 在滑块上面、F阻 在下面，
        // 两条读数都落进各自那半边空出来的地方，不会压回滑块。
        const drawF = (F, yy, color, tag, up) => {
          if (Math.abs(F) < 1e-3) return;
          const L = Math.abs(F) * slack * c0.s;
          if (L < 3) return;
          const dir = Math.sign(F);
          arrow(ctx, bx, yy, bx + dir * L, yy, color, 2.5);
          label(ctx, `${tag}=${fmt(Math.abs(F))} N`, bx + dir * (L + 8), yy + (up ? -13 : 13),
            color, dir > 0 ? 'left' : 'right', 15);
        };
        drawF(Fs, by - hb - 16, pal.green, 'F弹', true);
        drawF(Fd, by + hb + 16, pal.pink, 'F阻', false);
        label(ctx, `v=${fmt(v2.x)} m/s`, bx, by - hb - 54, pal.cyan, 'center', 15);
      }

      /* ---------- 位移—时间曲线 ---------- */
      const TX = 40, TY = h * 0.63, TW = w - 60, TH = h * 0.63 >= h ? 0 : h * 0.30;
      if (TH > 40) {
        ctx.beginPath();
        ctx.moveTo(TX, TY + TH / 2);
        ctx.lineTo(TX + TW, TY + TH / 2);
        ctx.strokeStyle = 'rgba(160,180,210,.35)';
        ctx.lineWidth = 1;
        ctx.stroke();

        const t1 = Math.max(clock, 6);
        const t0 = t1 - 6;
        const sx = v => TX + ((v - t0) / 6) * TW;
        const sy = v => TY + TH / 2 - (clamp(v, -3, 3) / 3) * (TH / 2 - 6);
        ctx.beginPath();
        let started = false;
        for (const q of trace) {
          if (q.t < t0) continue;
          const px = sx(q.t), py = sy(q.x);
          if (!started) { ctx.moveTo(px, py); started = true; }
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = pal.cyan;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        label(ctx, '位移 x（后 6 秒）', TX, TY - 2, pal.faint, 'left', 13);
        label(ctx, '+', TX - 12, sy(2), pal.faint, 'center', 13);
        label(ctx, '−', TX - 12, sy(-2), pal.faint, 'center', 13);
        // 当前点
        if (trace.length) {
          const q = trace[trace.length - 1];
          ctx.beginPath();
          ctx.arc(sx(q.t), sy(q.x), 3.5, 0, Math.PI * 2);
          ctx.fillStyle = pal.orange;
          ctx.fill();
        }
      }
    },
    dispose() { if (world) { world.free(); world = null; } },
  };
}
