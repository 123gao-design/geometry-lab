/* 演示：冲量与动量定理。
   小球在光滑水平面上以 v₀ 向右运动，被恒力 F 推了 T 秒。
   上图是 F–t 曲线，力曲线下方的矩形面积就是冲量 I = F·T；
   下图是 p–t 曲线，同一段时间里动量的抬升正好等于这块面积。
   两张图共用一条时间轴，一条竖虚线贯穿，读数栏的 I 与 Δp 始终相等。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

export function create(st) {
  let last = '';
  let t = 0;
  let hold = 0;
  const reset = () => { t = 0; hold = 0; };

  function frame(dt) {
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const m = clamp(nn(q.m, 1), 0.5, 3);
    const v0 = clamp(nn(q.v0, 0), 0, 4);
    const F = clamp(nn(q.F, 8), 2, 20);
    const T = clamp(nn(q.T, 1.2), 0.5, 3);

    const a = F / m;
    const tail = 0.45;
    const tEnd = T + tail;
    const p0 = m * v0;
    const pEnd = p0 + F * T;
    const v1 = v0 + a * T;

    const key = [m, v0, F, T].join('|');
    if (key !== last) { last = key; reset(); }

    if (dt > 0) {
      if (t < tEnd) t = Math.min(tEnd, t + dt);
      else {
        hold += dt;
        if (hold > 0.85) reset();
      }
    }

    const tP = Math.min(t, T);          // 推力还在作用的时长
    const vNow = v0 + a * tP;
    const pNow = m * vNow;
    const I = F * tP;

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    /* ── 上半：小球与推力 ── */
    const gy = h * 0.29;
    const rB = Math.min(13, h * 0.030);
    const xAtT = v0 * T + 0.5 * a * T * T;
    const xTot = xAtT + v1 * tail;
    const xa = w * 0.10;
    const xb = w * 0.80;
    const sc = (xb - xa) / Math.max(0.05, xTot);
    const xNow = t > T ? xAtT + v1 * (t - T) : v0 * t + 0.5 * a * t * t;
    const bx = xa + clamp(xNow, 0, xTot) * sc;

    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(w * 0.06, gy);
    ctx.lineTo(w * 0.94, gy);
    ctx.stroke();
    ctx.restore();

    if (t < T) {
      arrow(ctx, bx - rB * 2.6, gy - rB, bx - rB * 1.05, gy - rB, pal.orange, 2.4);
      label(ctx, 'F = ' + fmt(F, 1) + ' N', bx - rB * 2.7, gy - rB - 9, pal.orange, 'right', 13);
    }

    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.beginPath();
    ctx.arc(bx, gy - rB, rB, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    if (vNow > 0.02) {
      const al = 16 + 34 * clamp(vNow / Math.max(0.01, v1), 0, 1);
      const ax2 = Math.min(w * 0.93, bx + rB + al);
      arrow(ctx, bx + rB + 3, gy - rB, ax2, gy - rB, pal.green, 2.4);
      label(ctx, 'v = ' + fmt(vNow, 2) + ' m/s', bx + rB + 8, gy - rB - 13, pal.green, 'left', 13);
    }

    /* ── 下半：两张共用时间轴的图 ── */
    const rx = w * 0.15;
    const rw = w * 0.77;
    const rh = h * 0.225;
    const r1 = { x: rx, y: h * 0.41, w: rw, h: rh };
    const r2 = { x: rx, y: h * 0.71, w: rw, h: rh };
    const xr = [0, tEnd];

    const P1 = panel(ctx, r1, xr, [0, F * 1.45], pal, { ylab: 'F / N', nx: 5, ny: 3 });
    const P2 = panel(ctx, r2, xr, [0, Math.max(pEnd, 0.1) * 1.28], pal, { xlab: 't / s', ylab: 'p', nx: 5, ny: 3 });

    /* 冲量的面积：0 到此刻，力曲线下方那块矩形 */
    if (tP > 1e-6) {
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = 0.24;
      ctx.beginPath();
      ctx.moveTo(P1.X(0), P1.Y(0));
      ctx.lineTo(P1.X(tP), P1.Y(0));
      ctx.lineTo(P1.X(tP), P1.Y(F));
      ctx.lineTo(P1.X(0), P1.Y(F));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    /* F–t：恒力持续 T 秒，之后归零 */
    poly(ctx, P1.X, P1.Y, [[0, F], [T, F], [T, 0], [tEnd, 0]], pal.orange, 2.2);
    label(ctx, '面积 = 冲量 I', P1.X(T * 0.5), P1.Y(F) + 22, pal.orange, 'center', 13);
    label(ctx, 'T = ' + fmt(T, 2) + ' s', P1.X(T), P1.Y(0) + 15, pal.orange, 'center', 13);

    /* p–t：斜率等于合力 F */
    poly(ctx, P2.X, P2.Y, [[0, p0], [T, pEnd], [tEnd, pEnd]], pal.blue, 2.2);
    label(ctx, '斜率 = 合力 F', P2.X(T * 0.55), P2.Y(p0 + (pEnd - p0) * 0.58) - 14, pal.blue, 'center', 13);

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.cyan;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(P2.X(0), P2.Y(p0));
    ctx.lineTo(P2.X(tEnd), P2.Y(p0));
    ctx.stroke();
    ctx.restore();
    if (p0 > 0.02) label(ctx, 'p₁ = ' + fmt(p0, 2), P2.X(0) + 6, P2.Y(p0) - 9, pal.cyan, 'left', 13);

    /* 动量的抬升 Δp：从 p₁ 竖着量到 p₂ */
    const xD = T + tail * 0.62;
    if (pEnd - p0 > 1e-6) {
      arrow(ctx, P2.X(xD), P2.Y(p0), P2.X(xD), P2.Y(pEnd) - 2, pal.purple, 1.8);
      arrow(ctx, P2.X(xD), P2.Y(pEnd), P2.X(xD), P2.Y(p0) + 2, pal.purple, 1.8);
      label(ctx, 'Δp = ' + fmt(pEnd - p0, 2), P2.X(xD) + 7, P2.Y((p0 + pEnd) / 2), pal.purple, 'left', 13);
    }
    label(ctx, 'p₂ = ' + fmt(pEnd, 2), P2.X(tEnd) - 4, P2.Y(pEnd) - 10, pal.cyan, 'right', 13);

    /* 贯穿两图的时刻游标 */
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(P1.X(t), r1.y);
    ctx.lineTo(P1.X(t), r1.y + r1.h);
    ctx.moveTo(P2.X(t), r2.y);
    ctx.lineTo(P2.X(t), r2.y + r2.h);
    ctx.stroke();
    ctx.restore();
    if (t <= T) spot(ctx, P1.X(t), P1.Y(F), 4.2, pal.orange, pal.bg2);
    spot(ctx, P2.X(t), P2.Y(pNow), 4.2, pal.blue, pal.bg2);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['速度 v', fmt(vNow, 2) + ' m/s'],
      ['动量 p', fmt(pNow, 2) + ' kg·m/s'],
      ['冲量 I = Ft', fmt(I, 2) + ' N·s'],
      ['动量变化 Δp', fmt(pNow - p0, 2) + ' kg·m/s'],
      ['I − Δp', fmt(I - (pNow - p0), 2)],
    ]);
  }

  return { frame, reset };
}
