/* 演示：挂到弹簧下面的物块（重力与弹力）。
   物块从原长位置放下，弹力随伸长量线性增加；伸长到 x = mg/k 时弹力与重力相等，
   物块停在这一位置。右图把 F = kx 这条直线画出来，动点一路走到与重力虚线相交处。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const G0 = 9.8;

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const k = clamp(Number(p.k) || 60, 20, 160);
    const m = clamp(Number(p.m) || 0.8, 0.2, 2);
    const key = [k, m].join('|');
    if (key !== last) { last = key; reset(); }

    if (dt > 0) {
      t += dt;
      if (t > 4.6) t = 0;
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const G = m * G0;
    const xEq = G / k;                       // 平衡时的伸长量
    const s = Math.min(t / 1.5, 1);          // 挂上去的过程
    const ease = s * s * (3 - 2 * s);
    const xNow = xEq * ease;
    const fNow = k * xNow;

    /* ── 左：悬挂示意图 ── */
    const lw = Math.min(w * 0.40, 340);
    const cx = 24 + lw / 2;
    const yTop = 44;
    const L0 = h * 0.26;
    const pxPerM = (h * 0.20) / 0.95;
    const yEnd = yTop + L0 + xNow * pxPerM;

    // 天花板
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - 78, yTop + 0.5);
    ctx.lineTo(cx + 78, yTop + 0.5);
    ctx.stroke();
    ctx.lineWidth = 1;
    for (let i = -76; i < 76; i += 12) {
      ctx.beginPath();
      ctx.moveTo(cx + i, yTop + 1);
      ctx.lineTo(cx + i + 8, yTop - 7);
      ctx.stroke();
    }
    ctx.restore();

    // 弹簧
    const coils = 10;
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    const ya = yTop + 4;
    ctx.moveTo(cx, ya);
    for (let i = 1; i <= coils * 2; i++) {
      const yy = ya + ((yEnd - ya) * i) / (coils * 2);
      ctx.lineTo(cx + (i % 2 ? 12 : -12), yy);
    }
    ctx.lineTo(cx, yEnd);
    ctx.stroke();
    ctx.restore();

    // 物块
    const bw = 50;
    const bh = 28;
    const by = yEnd;
    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.fillStyle = pal.orange;
    ctx.fillRect(cx - bw / 2, by, bw, bh);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - bw / 2, by, bw, bh);
    ctx.restore();

    // 原长位置
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 92, yTop + L0 + 0.5);
    ctx.lineTo(cx + 92, yTop + L0 + 0.5);
    ctx.stroke();
    ctx.restore();
    label(ctx, '原长位置', cx + 96, yTop + L0, pal.faint, 'left', 12);

    // 伸长量 x
    if (xNow * pxPerM > 8) {
      const bx = cx - 66;
      arrow(ctx, bx, yTop + L0, bx, yEnd, pal.green, 1.4);
      arrow(ctx, bx, yEnd, bx, yTop + L0, pal.green, 1.4);
      label(ctx, 'x = ' + fmt(xNow, 3) + ' m', bx - 8, (yTop + L0 + yEnd) / 2, pal.green, 'right', 12);
    }

    // 两个力：从物块中心出发
    const pcx = cx;
    const pcy = by + bh / 2;
    const fpx = (h * 0.15) / 22;
    arrow(ctx, pcx, pcy, pcx, pcy + G * fpx, pal.pink, 2.4);
    label(ctx, 'G = ' + fmt(G, 1) + ' N', pcx + 10, pcy + G * fpx + 4, pal.pink, 'left', 13);
    if (fNow > 0.02) {
      arrow(ctx, pcx, pcy, pcx, pcy - fNow * fpx, pal.blue, 2.4);
      label(ctx, 'F = ' + fmt(fNow, 1) + ' N', pcx + 10, pcy - fNow * fpx - 4, pal.blue, 'left', 13);
    }

    /* ── 右：F-x 图 ── */
    const gr = { x: Math.max(cx + 110, w * 0.50), y: 28, w: w - Math.max(cx + 110, w * 0.50) - 24, h: h - 92 };
    const xMax = Math.max(1.0, xEq * 1.2);
    const yMax = Math.max(20, G * 1.2);
    const g = panel(ctx, gr, [0, xMax], [0, yMax], pal, { xlab: 'x / m', ylab: 'F / N', nx: 5, ny: 4 });

    // F = kx（出顶就停在顶边）
    const xCut = Math.min(xMax, yMax / k);
    poly(ctx, g.X, g.Y, [[0, 0], [xCut, k * xCut]], pal.blue, 2.2);
    label(ctx, 'F = kx', g.X(xCut) - 6, g.Y(k * xCut) + 16, pal.blue, 'right', 13);

    // 重力虚线
    poly(ctx, g.X, g.Y, [[0, G], [xMax, G]], pal.pink, 1.6, [5, 5]);
    label(ctx, 'mg', g.X(xMax) - 6, g.Y(G) - 10, pal.pink, 'right', 13);

    // 平衡点与动点
    if (xEq <= xMax) {
      spot(ctx, g.X(xEq), g.Y(G), 5, pal.green, pal.bg2);
    }
    spot(ctx, g.X(xNow), g.Y(fNow), 5, pal.orange, pal.bg2);

    if (s >= 1) {
      label(ctx, '弹力与重力相等', g.X(xEq) + 8, g.Y(G) - 26, pal.green, 'left', 12);
    }

    st.readout([
      ['质量 m', fmt(m, 2) + ' kg'],
      ['重力 G = mg', fmt(G, 1) + ' N'],
      ['伸长量 x', fmt(xNow, 3) + ' m'],
      ['弹力 F = kx', fmt(fNow, 1) + ' N'],
      ['平衡时 x = G ÷ k', fmt(xEq, 3) + ' m'],
    ]);
  }

  return { frame, reset };
}
