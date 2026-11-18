/* 演示：追及与相遇。前车匀速，后车从原点由静止加速。
   两车的 x-t 图线相交即相遇；速度相等的时刻两线斜率相同，间距在这一刻最大。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

export function create(st) {
  let t = 0;
  let last = '';

  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const v1 = clamp(Number(p.v1) || 6, 1, 12);
    const v2 = clamp(Number(p.v2) || 0, 0, 12);
    const a = clamp(Number(p.a) || 2, 0.5, 6);
    const d0 = clamp(Number(p.d0) || 12, 2, 40);
    const key = [v1, v2, a, d0].join('|');
    if (key !== last) { last = key; reset(); }

    const rel = v1 - v2;
    const tm = (rel + Math.sqrt(rel * rel + 2 * a * d0)) / a;
    const tq = rel / a;
    const dmax = d0 + (rel > 0 ? (rel * rel) / (2 * a) : 0);
    const tmax = Math.min(tm + 1.4, 18);

    if (dt > 0) {
      t += dt;
      if (t > tmax) t = 0;
    }

    const x1 = tt => d0 + v1 * tt;
    const x2 = tt => v2 * tt + 0.5 * a * tt * tt;
    const gap = x1(t) - x2(t);

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const xhi = Math.max(x1(tmax), x2(tmax)) * 1.06;

    /* ── 上：两车的 x-t 图 ── */
    const rect = { x: 64, y: 20, w: w - 104, h: h * 0.56 };
    const g = panel(ctx, rect, [0, tmax], [0, xhi], pal, {
      xlab: 't / s',
      ylab: 'x / m',
      nx: 6,
      ny: 5,
    });

    poly(ctx, g.X, g.Y, [[0, d0], [tmax, x1(tmax)]], pal.blue, 2.2);
    const pts = [];
    for (let i = 0; i <= 160; i++) {
      const tt = (i / 160) * tmax;
      pts.push([tt, x2(tt)]);
    }
    poly(ctx, g.X, g.Y, pts, pal.orange, 2.2);

    /* 相遇点 */
    spot(ctx, g.X(tm), g.Y(x1(tm)), 5.5, pal.green, pal.bg2);
    label(ctx, '相遇', g.X(tm) + 8, g.Y(x1(tm)) - 10, pal.green, 'left', 13);

    /* 速度相等时刻 */
    if (tq > 0 && tq < tmax) {
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.X(tq), g.Y(0));
      ctx.lineTo(g.X(tq), g.Y(x1(tq)));
      ctx.stroke();
      ctx.restore();
      spot(ctx, g.X(tq), g.Y(x1(tq)), 4, pal.purple, pal.bg2);
      label(ctx, '速度相等', g.X(tq) + 6, g.Y(x1(tq)) + 14, pal.purple, 'left', 12);
    }

    /* 当前时刻的两点 */
    spot(ctx, g.X(t), g.Y(x1(t)), 4.5, pal.blue, pal.bg2);
    spot(ctx, g.X(t), g.Y(x2(t)), 4.5, pal.orange, pal.bg2);

    /* ── 下：两辆车 ── */
    const yT = Math.round(h * 0.85) + 0.5;
    const TX = u => 64 + (u / xhi) * (w - 108);
    arrow(ctx, 56, yT, w - 36, yT, pal.mut, 1.4);
    label(ctx, 'x / m', w - 36, yT - 14, pal.mut, 'right', 13);

    const p1 = TX(x1(t));
    const p2 = TX(x2(t));
    car(ctx, p1, yT, pal.blue, pal.bg2);
    car(ctx, p2, yT, pal.orange, pal.bg2);
    label(ctx, '前车', p1, yT - 26, pal.blue, 'center', 12);
    label(ctx, '后车', p2, yT - 26, pal.orange, 'center', 12);

    /* 间距 */
    if (Math.abs(p1 - p2) > 8) {
      arrow(ctx, p2, yT + 26, p1, yT + 26, pal.faint, 1.4);
      arrow(ctx, p1, yT + 26, p2, yT + 26, pal.faint, 1.4);
      label(ctx, 'Δx = ' + fmt(gap, 1) + ' m', (p1 + p2) / 2, yT + 40, pal.mut, 'center', 12);
    }

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['两车间距', fmt(gap, 2) + ' m'],
      ['速度相等', tq > 0 ? fmt(tq, 2) + ' s' : '后车一开始就比前车快'],
      ['最大间距', fmt(dmax, 2) + ' m'],
      ['相遇时刻', fmt(tm, 2) + ' s'],
    ]);
  }

  function car(ctx, x, base, fill, ring) {
    const wq = 30;
    ctx.fillStyle = ring;
    ctx.fillRect(x - wq / 2 - 3, base - 18, wq + 6, 18);
    ctx.fillStyle = fill;
    ctx.fillRect(x - wq / 2, base - 15, wq, 12);
    ctx.beginPath();
    ctx.arc(x - 8, base, 3.2, 0, Math.PI * 2);
    ctx.arc(x + 8, base, 3.2, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  }

  return { frame, reset };
}
