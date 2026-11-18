/* 演示：位移与路程。物体以速率 v 向右走 T 秒，再原路返回到起点。
   位移只看起点与终点（绿色箭头），路程一直累加；下半个面板同时画 x-t 图。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot, niceStep, num } from './axes.js';

export function create(st) {
  let t = 0;
  let last = '';

  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const v = clamp(Number(p.v) || 1.5, 0.2, 10);
    const T = clamp(Number(p.T) || 3, 0.5, 20);
    const key = v + '|' + T;
    if (key !== last) { last = key; reset(); }

    if (dt > 0) {
      t += dt;
      if (t > 2 * T + 1.4) t = 0;
    }

    const x = t <= T ? v * t : t <= 2 * T ? v * T - v * (t - T) : 0;
    const s = t <= T ? v * t : t <= 2 * T ? v * T + v * (t - T) : 2 * v * T;

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    /* ── 上：位置标尺 ── */
    const yT = Math.round(h * 0.30) + 0.5;
    const L = Math.max(v * T, 0.6);
    const x0 = 54;
    const x1 = w - 40;
    const TX = u => x0 + (u / L) * (x1 - x0);

    arrow(ctx, x0, yT, x1 + 8, yT, pal.mut, 1.4);
    const step = niceStep(L, 5);
    for (let u = 0; u <= L + 1e-9; u += step) {
      const px = TX(u);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, yT - 4);
      ctx.lineTo(px, yT + 4);
      ctx.stroke();
      label(ctx, num(u), px, yT + 16, pal.faint, 'center', 12);
    }
    label(ctx, 'x / m', x1 + 8, yT - 15, pal.mut, 'right', 13);
    label(ctx, '起点 O', TX(0), yT - 20, pal.faint, 'center', 12);

    /* 折返点 */
    const xr = v * T;
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(TX(xr), yT - 54);
    ctx.lineTo(TX(xr), yT + 6);
    ctx.stroke();
    ctx.restore();
    label(ctx, '折返点', TX(xr), yT - 62, pal.faint, 'center', 12);

    /* 位移箭头（只看起点与终点） */
    if (Math.abs(x) > 0.02) {
      arrow(ctx, TX(0), yT - 32, TX(x), yT - 32, pal.green, 2.4);
      label(
        ctx,
        '位移 Δx = ' + fmt(x, 2) + ' m',
        (TX(0) + TX(x)) / 2,
        yT - 46,
        pal.green,
        'center',
        13,
      );
    } else {
      label(ctx, '位移 Δx = 0', TX(0), yT - 44, pal.green, 'center', 13);
    }

    /* 物体 */
    dotObj(ctx, TX(x), yT, pal);

    /* ── 下：x-t 图 ── */
    const rect = { x: 58, y: h * 0.54, w: w - 96, h: h * 0.36 };
    const xmax = 2 * T + 1.4;
    const ymax = Math.max(v * T * 1.12, 0.4);
    const g = panel(ctx, rect, [0, xmax], [0, ymax], pal, {
      xlab: 't / s',
      ylab: 'x / m',
      nx: 6,
      ny: 4,
    });

    poly(ctx, g.X, g.Y, [[0, 0], [T, v * T], [2 * T, 0], [xmax, 0]], pal.blue, 2.2);

    /* 当前点的两条投影虚线 */
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(g.X(0), g.Y(x));
    ctx.lineTo(g.X(t), g.Y(x));
    ctx.lineTo(g.X(t), g.Y(0));
    ctx.stroke();
    ctx.restore();
    spot(ctx, g.X(t), g.Y(x), 5, pal.orange, pal.bg2);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['位置 x', fmt(x, 2) + ' m'],
      ['位移 Δx', fmt(x, 2) + ' m'],
      ['路程 s', fmt(s, 2) + ' m'],
    ]);
  }

  function dotObj(ctx, x, y, pal) {
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fillStyle = pal.bg2;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, 8, 0, Math.PI * 2);
    ctx.fillStyle = pal.orange;
    ctx.fill();
  }

  return { frame, reset };
}
