/* 电13 自感与涡流。
   两档：
   ① 自感现象——电源经开关分给并联的电感 L 与电阻 R。合上开关，L 中的电流按
      i = i₀(1 − e^{−Rt/L}) 增大，自感电动势阻碍它增大；断开开关，L 与 R 自成回路，
      L 中的电流方向不变、按 i = i₀e^{−Rt/L} 衰减，R 中的电流随之反向（灯会闪一下）。
      时间常数 τ = L/R 决定快慢：L 越大、R 越小，电流变化越慢。
   ② 涡流——铜摆在磁极前摆过，摆片进入磁场的那一段切割磁感线的面积变化最快，
      片内感生出涡流，涡流受安培力反过来阻碍摆动（电磁阻尼）。阻尼档越大衰减越快；
      紫色虚线是同初始角、不带阻尼的理想摆，两者一对照就见分晓。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';
import { flowPath } from './circuit.js';

const E0 = 6;        // 电源电动势 V
const GP = 9.8;      // 重力加速度
const LP = 0.45;     // 摆长 m（只用来定周期）
const TH0 = 0.70;    // 初始摆角 rad

export function create(st) {
  let T = 0;
  let last = '';
  let th = TH0;
  let om = 0;
  let hist = [];
  let dead = 0;

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'eddy' ? 'eddy' : 'rl';
    const L = clamp(fn(q.L, 2), 0.5, 6);
    const R = clamp(fn(q.R, 6), 1, 20);
    const b = clamp(fn(q.b, 0.4), 0, 1.5);
    const key = [mode, L, R, b].join('|');
    if (key !== last) {
      last = key;
      T = 0;
      th = TH0;
      om = 0;
      hist = [];
      dead = 0;
    }
    if (dt > 0) T += dt;
    ctx.clearRect(0, 0, w, h);
    if (mode === 'rl') drawRL(dt, T, L, R, w, h, pal, ctx);
    else drawEddy(dt, T, b, w, h, pal, ctx);
  }

  /* ── ① 自感现象 ─────────────────────────────── */
  function drawRL(dt, t, L, R, w, h, pal, ctx) {
    const tau = L / R;                       // 时间常数
    const i0 = E0 / R;
    const Tc = clamp(4 * tau, 0.9, 5);       // 合闸段时长
    const Td = clamp(4 * tau, 0.9, 4);       // 断闸段时长
    const cyc = Tc + Td;
    const ph = t % cyc;
    const on = ph < Tc;
    const tp = on ? ph : ph - Tc;
    const iL = on ? i0 * (1 - Math.exp(-tp / tau)) : i0 * Math.exp(-tp / tau);
    const didt = (i0 / tau) * Math.exp(-tp / tau);
    const eL = L * didt;

    const x0 = w * 0.10, xm = w * 0.28, x1 = w * 0.47;
    const yT = h * 0.30, yB = h * 0.72;
    const yc = (yT + yB) / 2;

    const wire = pts => {
      ctx.save();
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.stroke();
      ctx.restore();
    };

    // 外框：左边电源、右边电阻、上下两条横线
    wire([[x0, yB], [x0, yT]]);
    wire([[x0, yT], [xm - 14, yT]]);
    wire([[xm + 14, yT], [x1, yT]]);
    wire([[x1, yT], [x1, yB]]);
    wire([[x1, yB], [x0, yB]]);
    wire([[xm, yT], [xm, yc - 40]]);
    wire([[xm, yc + 40], [xm, yB]]);

    // 电感：一串向右鼓出的小半圆
    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < 4; i++) {
      const yy = yc - 36 + i * 18;
      ctx.moveTo(xm, yy);
      ctx.arc(xm, yy + 9, 9, -Math.PI / 2, Math.PI / 2, false);
    }
    ctx.stroke();
    ctx.restore();
    label(ctx, 'L', xm + 20, yc - 2, pal.blue, 'left', 15);

    // 电阻
    ctx.save();
    ctx.fillStyle = pal.bg2;
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.rect(x1 - 11, yc - 26, 22, 52);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, 'R', x1 + 18, yc - 2, pal.orange, 'left', 15);

    // 电源：长板（正）在上
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 3.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0 - 15, yc - 8);
    ctx.lineTo(x0 + 15, yc - 8);
    ctx.moveTo(x0 - 8, yc + 8);
    ctx.lineTo(x0 + 8, yc + 8);
    ctx.stroke();
    ctx.restore();
    label(ctx, '+', x0 - 22, yc - 14, pal.green, 'mid', 14);
    label(ctx, 'ε', x0 + 26, yc - 8, pal.green, 'left', 15);

    // 开关：合闸时横平，断开时抬起
    const swX = (x0 + xm) / 2;
    ctx.save();
    ctx.fillStyle = pal.ink;
    ctx.beginPath();
    ctx.arc(swX - 14, yT, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = on ? pal.ink : pal.orange;
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(swX - 14, yT);
    ctx.lineTo(on ? swX + 14 : swX + 10, on ? yT : yT - 26);
    ctx.stroke();
    ctx.fillStyle = on ? pal.ink : pal.orange;
    ctx.beginPath();
    ctx.arc(swX + 14, yT, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, 'S', swX, yT - 34, pal.faint, 'mid', 14);

    // 电流小点
    const spd = clamp(20 + iL * 46, 18, 150);
    if (on) {
      flowPath(ctx, [[x0, yB], [x0, yT], [x1, yT], [x1, yB], [x0, yB]], pal.green, spd, t, 34, 2.5);
      flowPath(ctx, [[xm, yT], [xm, yB]], pal.blue, spd, t, 26, 2.5);
    } else if (iL > i0 * 0.004) {
      flowPath(ctx, [[xm, yT], [xm, yB], [x1, yB], [x1, yT], [xm, yT]], pal.blue, spd, t, 34, 2.5);
    }

    // 状态说明
    label(ctx, on ? '合上开关：L 中的电流增大，自感电动势阻碍增大'
      : '断开开关：L 维持电流，R 中的电流反向', w * 0.10, h * 0.86,
      on ? pal.orange : pal.purple, 'left', 14);
    label(ctx, `L 中电流 ${fmt(iL, 2)} A，自感电动势 ${fmt(eL, 2)} V`, w * 0.10, h * 0.86 + 22,
      pal.faint, 'left', 14);

    /* 右栏：i–t 曲线 */
    const rc = { x: w * 0.60, y: h * 0.16, w: w * 0.34, h: h * 0.62 };
    const g = panel(ctx, rc, [0, cyc], [0, i0 * 1.08], pal, { xlab: 't/s', ylab: 'i/A', nx: 4, ny: 4 });
    const chg = [], dec = [];
    for (let i = 0; i <= 60; i++) {
      const tt = (Tc * i) / 60;
      chg.push([tt, i0 * (1 - Math.exp(-tt / tau))]);
      const td = (Td * i) / 60;
      dec.push([Tc + td, i0 * Math.exp(-td / tau)]);
    }
    poly(ctx, g.X, g.Y, chg, pal.orange, 2.4);
    poly(ctx, g.X, g.Y, dec, pal.cyan, 2.4);
    // 63% 与 τ
    if (tau < Tc * 0.92) {
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(g.X(tau), g.Y(0));
      ctx.lineTo(g.X(tau), g.Y(i0 * 0.632));
      ctx.lineTo(g.X(0), g.Y(i0 * 0.632));
      ctx.stroke();
      ctx.restore();
      label(ctx, '63%', rc.x - 34, g.Y(i0 * 0.632) - 6, pal.purple, 'left', 13);
      label(ctx, 'τ', g.X(tau), rc.y + rc.h + 26, pal.purple, 'mid', 13);
    }
    spot(ctx, g.X(ph), g.Y(iL), 5.5, pal.green, pal.bg2);
    label(ctx, '橙：合闸　青：断闸', rc.x + rc.w - 6, rc.y + 16, pal.faint, 'right', 13);

    st.readout([
      ['自感系数 L', fmt(L, 1) + ' H'],
      ['回路电阻 R', fmt(R, 1) + ' Ω'],
      ['时间常数 τ = L/R', fmt(tau, 2) + ' s'],
      ['电源电动势 ε', fmt(E0, 1) + ' V'],
      ['合闸 / 断闸', on ? '刚合上 ' + fmt(tp, 2) + ' s' : '刚断开 ' + fmt(tp, 2) + ' s'],
      ['L 中电流 i', fmt(iL, 2) + ' A'],
      ['i / i₀', fmt((iL / i0) * 100, 1) + '%'],
      ['|di/dt|', fmt(didt, 2) + ' A/s'],
      ['自感电动势 ε_L = L|di/dt|', fmt(eL, 2) + ' V'],
      ['自感的作用', on ? '阻碍电流增大' : '阻碍电流减小'],
      ['R 中电流方向', on ? '与电源同向' : '与电源反向'],
    ]);
  }

  /* ── ② 涡流（电磁阻尼） ─────────────────────── */
  function drawEddy(dt, t, b, w, h, pal, ctx) {
    const px = w * 0.24;
    const py = h * 0.11;
    const ld = h * 0.56;                     // 摆长（像素）

    if (dt > 0) {
      const step = clamp(dt, 1 / 240, 1 / 30);
      const sub = 4;
      const hs = step / sub;
      for (let k = 0; k < sub; k++) {
        const bx0 = px + ld * Math.sin(th);
        const inF = Math.abs(bx0 - px) < 34;
        const acc = -(GP / LP) * Math.sin(th) - (inF ? b : 0) * om;
        om += acc * hs;
        th += om * hs;
      }
      if (T > 32) th = clamp(th, -1.5, 1.5);
      const quiet = Math.abs(th) < 0.02 && Math.abs(om) < 0.06;      dead = quiet ? dead + dt : 0;
      if (dead > 0.6) {
        th = TH0;
        om = 0;
        hist = [];
        dead = 0;
      }
      hist.push([t, th]);
      if (hist.length > 2400) hist.splice(0, hist.length - 2400);
    }

    const bx = px + ld * Math.sin(th);
    const by = py + ld * Math.cos(th);
    const inF = Math.abs(bx - px) < 34;
    const gy = py + ld;                      // 最低点

    // 磁场区：两块磁极面对面
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(px - 34, gy - 52, 68, 104);
    ctx.restore();
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(px - 62, gy - 44, 26, 88);
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = pal.cyan;
    ctx.fillRect(px + 36, gy - 44, 26, 88);
    ctx.restore();
    label(ctx, 'N', px - 49, gy + 5, pal.bg2, 'mid', 15);
    label(ctx, 'S', px + 49, gy + 5, pal.bg2, 'mid', 15);

    // 支架
    ctx.save();
    ctx.fillStyle = pal.faint;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 理想摆（无阻尼）的对照：紫色虚线
    const gth = TH0 * Math.cos(Math.sqrt(GP / LP) * t);
    const gx = px + ld * Math.sin(gth);
    const gy2 = py + ld * Math.cos(gth);
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(gx, gy2);
    ctx.stroke();
    ctx.restore();

    // 摆杆与摆片
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.translate(bx, by);
    ctx.rotate(th);
    ctx.fillStyle = inF ? pal.orange : 'rgba(150,150,150,0.45)';
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = inF ? pal.orange : pal.faint;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-13, -32, 26, 64);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, '铜片', bx + 20, by - 6, pal.faint, 'left', 14);

    // 涡流：片内两圈小漩涡
    if (inF) {
      for (let i = 0; i < 2; i++) {
        const ox = bx + (i ? 8 : -8) * Math.cos(th) - (i ? -22 : 22) * Math.sin(th);
        const oy = by + (i ? 8 : -8) * Math.sin(th) + (i ? -22 : 22) * Math.cos(th);
        const r = 9;
        ctx.save();
        ctx.strokeStyle = pal.purple;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(ox, oy, r, 0.4, Math.PI * 1.7);
        ctx.stroke();
        const a = Math.PI * 1.7;
        const tx = ox + Math.cos(a) * r;
        const ty = oy + Math.sin(a) * r;
        arrow(ctx, tx - Math.cos(a) * 6, ty - Math.sin(a) * 6, tx + 1.5, ty + 1.5, pal.purple, 1.6);
        ctx.restore();
      }
      label(ctx, '涡流', bx - 46, by - 40, pal.purple, 'left', 14);
    }

    // 磁极之间的说明
    label(ctx, inF ? '摆片正在切割磁感线：涡流受安培力，阻碍摆动'
      : '摆片在磁场外：没有涡流，照常摆动', w * 0.10, h * 0.90,
      inF ? pal.orange : pal.faint, 'left', 14);

    /* 右栏：θ–t 曲线与理想摆 */
    const rc = { x: w * 0.58, y: h * 0.14, w: w * 0.36, h: h * 0.66 };
    const WIN = 8;
    const t0 = Math.max(0, t - WIN);
    const g2 = panel(ctx, rc, [0, WIN], [-0.82, 0.82], pal, { xlab: 't/s', ylab: 'θ/rad', nx: 4, ny: 4 });
    // 理想摆
    const gd = [];
    for (let i = 0; i <= 90; i++) {
      const tt = t0 + (WIN * i) / 90;
      gd.push([tt - t0, TH0 * Math.cos(Math.sqrt(GP / LP) * tt)]);
    }
    poly(ctx, g2.X, g2.Y, gd, pal.purple, 1.8, [6, 5]);
    // 实际摆
    if (hist.length > 1) {
      const rd = hist.filter(p => p[0] >= t0).map(p => [p[0] - t0, p[1]]);
      if (rd.length > 1) poly(ctx, g2.X, g2.Y, rd, pal.orange, 2.4);
    }
    spot(ctx, g2.X(t - t0), g2.Y(th), 5.5, pal.orange, pal.bg2);
    label(ctx, '橙：带涡流阻尼　紫：理想摆', rc.x + rc.w - 6, rc.y + 16, pal.faint, 'right', 13);

    // 机械能（取 m = 1 kg）
    const Ek = 0.5 * LP * LP * om * om;
    const Ep = GP * LP * (1 - Math.cos(th));
    st.readout([
      ['摆角 θ', fmt(th, 3) + ' rad'],
      ['角速度 ω', fmt(om, 2) + ' rad/s'],
      ['摆片线速度 v = ωl', fmt(Math.abs(om) * LP, 2) + ' m/s'],
      ['是否在磁场中', inF ? '在（有涡流）' : '不在'],
      ['阻尼系数 b', fmt(b, 2) + ' s⁻¹'],
      ['摆长 l', fmt(LP, 2) + ' m'],
      ['理想摆周期 T₀ = 2π√(l/g)', fmt(2 * Math.PI * Math.sqrt(LP / GP), 2) + ' s'],
      ['动能 ½ml²ω²', fmt(Ek, 3) + ' J'],
      ['势能 mgl(1−cosθ)', fmt(Ep, 3) + ' J'],
      ['机械能 E', fmt(Ek + Ep, 3) + ' J'],
    ]);
  }

  return { frame };
}
