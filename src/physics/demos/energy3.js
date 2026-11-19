/* 演示：机械能守恒。
   单摆从初角 θ₀ 由静止放开，摆球沿圆弧来回摆。
   速率由能量守恒给出：½mv² = mgL(1−cosθ₀) − mgL(1−cosθ)。
   右栏两根竖条分别是动能与重力势能，青色横线是两者的和——摆到哪，两根条的长短怎么换，
   横线始终不动，这就是机械能守恒。 */

import { label, arrow, clamp, fmt } from '../gfx.js';

const G = 9.8;
const DEG = Math.PI / 180;

export function create(st) {
  let last = '';
  let th = 50 * DEG;     // 与竖直方向的夹角
  let om = 0;            // 角速度
  let th0 = 50 * DEG;    // 本次的初角
  const reset = () => { th = th0; om = 0; };

  function frame(dt) {
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const m = clamp(nn(q.m, 1), 0.5, 3);
    const L = clamp(nn(q.L, 1), 0.4, 1.6);
    const t0 = clamp(nn(q.t0, 50), 10, 80) * DEG;
    const key = [m, L, t0].join('|');
    if (key !== last) { last = key; th0 = t0; reset(); }
    th0 = t0;

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    /* 步进：θ″ = −(g/L)sinθ，半隐式欧拉；每帧末按能量守恒重定速率，免去数值漂移 */
    if (dt > 0) {
      const n = Math.min(24, Math.max(1, Math.ceil(dt / 0.004)));
      const hh = dt / n;
      for (let i = 0; i < n; i++) {
        om += -(G / L) * Math.sin(th) * hh;
        th += om * hh;
      }
      const hNow0 = L * (1 - Math.cos(th));
      const hTop = L * (1 - Math.cos(th0));
      const vm = Math.sqrt(Math.max(0, 2 * G * (hTop - hNow0)));
      om = (om >= 0 ? 1 : -1) * vm / L;
    }

    const hNow = L * (1 - Math.cos(th));            // 相对最低点的高度
    const hTop = L * (1 - Math.cos(th0));           // 最高点高度
    const v = Math.sqrt(Math.max(0, 2 * G * (hTop - hNow)));
    const Ek = 0.5 * m * v * v;
    const Ep = m * G * hNow;
    const E = Ek + Ep;

    const dual = w >= 640;
    const sw = dual ? w * 0.56 : w - 16;

    const px = sw * 0.44;                            // 悬点
    const py = h * 0.17;
    const Lp = Math.min(sw * 0.26, h * 0.44);
    const refY = py + Lp;                            // 最低点，即 h = 0

    /* 摆动范围的虚线弧（画布 y 向下，角度取 π/2 − φ） */
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(px, py, Lp, Math.PI / 2 + t0, Math.PI / 2 - t0, true);
    ctx.stroke();
    ctx.restore();

    /* 悬点与竖直线 */
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, refY + 6);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = pal.mut;
    ctx.beginPath();
    ctx.arc(px, py, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* 参考线 h = 0 */
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = pal.cyan;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(sw * 0.10, refY);
    ctx.lineTo(sw * 0.86, refY);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'h = 0', sw * 0.88, refY + 4, pal.cyan, 'left', 13);

    /* 摆球位置 */
    const bx = px + Lp * Math.sin(th);
    const by = py + Lp * Math.cos(th);

    /* 摆线 */
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();

    /* 高度虚线 */
    if (hNow > 0.02) {
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = pal.cyan;
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bx, refY);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'h', bx + 9, (by + refY) * 0.5, pal.cyan, 'left', 13);
    }

    /* θ 角弧：从竖直方向扫到摆线 */
    if (Math.abs(th) > 0.06) {
      ctx.save();
      ctx.strokeStyle = pal.orange;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(px, py, 36, Math.PI / 2, Math.PI / 2 - th, th > 0);
      ctx.stroke();
      ctx.restore();
      const mid = th * 0.5;
      label(ctx, 'θ', px + 48 * Math.sin(mid), py + 48 * Math.cos(mid), pal.orange, 'center', 13);
    }

    /* 摆球 */
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(bx, by, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, 'm', bx, by + 4, pal.bg2, 'center', 13);

    /* 速度箭头：沿切线，方向随运动方向 */
    if (v > 0.05) {
      const dir = th === th0 && Math.abs(om) < 1e-6 ? 1 : Math.sign(om) || 1;
      const ux = Math.cos(th) * dir;
      const uy = -Math.sin(th) * dir;
      const Lv = 18 + 42 * (v / Math.sqrt(Math.max(1e-6, 2 * G * hTop)));
      arrow(ctx, bx, by, bx + ux * Lv, by + uy * Lv, pal.green, 2.4);
      label(ctx, 'v = ' + fmt(v, 2) + ' m/s', bx + ux * (Lv + 12), by + uy * (Lv + 12) + 4,
        pal.green, 'center', 13);
    }

    /* ── 右：两根能量条与总和 ── */
    if (dual) {
      const px0 = sw + 20;
      const pw = w - px0 - 20;
      const baseY = h * 0.76;
      const topY = h * 0.14;
      const Emax = Math.max(E, 1e-6);
      const sc = (baseY - topY) / (Emax * 1.10);
      const bw = Math.min(54, pw * 0.22);
      const cx1 = px0 + pw * 0.30;
      const cx2 = px0 + pw * 0.68;

      ctx.save();
      ctx.strokeStyle = pal.line;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px0 + pw * 0.06, baseY);
      ctx.lineTo(px0 + pw * 0.94, baseY);
      ctx.stroke();
      ctx.restore();

      /* 动能条 */
      const hE = Math.max(1.5, Ek * sc);
      ctx.save();
      ctx.fillStyle = pal.green;
      ctx.globalAlpha = 0.32;
      ctx.fillRect(cx1 - bw / 2, baseY - hE, bw, hE);
      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(cx1 - bw / 2, baseY - hE, bw, hE);
      ctx.restore();
      label(ctx, 'Ek', cx1, baseY + 18, pal.green, 'center', 13);
      label(ctx, fmt(Ek, 1) + ' J', cx1, baseY - hE - 9, pal.green, 'center', 13);

      /* 势能条 */
      const hP = Math.max(hNow > 0.005 ? 1.5 : 0, Ep * sc);
      if (hP > 0) {
        ctx.save();
        ctx.fillStyle = pal.orange;
        ctx.globalAlpha = 0.32;
        ctx.fillRect(cx2 - bw / 2, baseY - hP, bw, hP);
        ctx.globalAlpha = 0.95;
        ctx.strokeStyle = pal.orange;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(cx2 - bw / 2, baseY - hP, bw, hP);
        ctx.restore();
      }
      label(ctx, 'Ep', cx2, baseY + 18, pal.orange, 'center', 13);
      label(ctx, fmt(Ep, 1) + ' J', cx2, baseY - hP - 9, pal.orange, 'center', 13);

      /* 机械能总和：一条不动的横线 */
      const ey = baseY - E * sc;
      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = pal.cyan;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(px0 + pw * 0.04, ey);
      ctx.lineTo(px0 + pw * 0.96, ey);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'E = ' + fmt(E, 1) + ' J', px0 + pw * 0.96, ey - 9, pal.cyan, 'right', 13);
    }

    st.readout([
      ['速率 v', fmt(v, 2) + ' m/s'],
      ['高度 h', fmt(hNow, 2) + ' m'],
      ['动能 Ek', fmt(Ek, 1) + ' J'],
      ['重力势能 Ep', fmt(Ep, 1) + ' J'],
      ['机械能 E', fmt(E, 1) + ' J'],
    ]);
  }

  return { frame, reset };
}
