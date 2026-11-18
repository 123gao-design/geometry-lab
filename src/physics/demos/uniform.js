/* 演示：匀变速直线运动的 x-t 图。图线是抛物线，某点切线的斜率就是那一刻的速度；
   读数栏把三个基本式逐项算给同一组数看（x 与 v²−v0² 两项对照）。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot, niceStep, num } from './axes.js';

export function create(st) {
  let t = 0;
  let last = '';

  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const v0 = clamp(Number(p.v0) || 0, -2, 12);
    const a = clamp(Number(p.a) || 0, -4, 6);
    const key = v0 + '|' + a;
    if (key !== last) { last = key; reset(); }

    if (dt > 0) {
      t += dt;
      if (t > 6) t = 0;
    }

    const X = tt => v0 * tt + 0.5 * a * tt * tt;
    const V = tt => v0 + a * tt;
    const x = X(t);
    const v = V(t);

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    /* ── 上：x-t 图 ── */
    const cand = [0, X(6)];
    if (a !== 0) {
      const tv = -v0 / a;
      if (tv > 0 && tv < 6) cand.push(X(tv));
    }
    let ylo = Math.min(...cand);
    let yhi = Math.max(...cand);
    const ypad = Math.max((yhi - ylo) * 0.2, 0.8);
    ylo -= ypad;
    yhi += ypad;

    const rect = { x: 62, y: 18, w: w - 100, h: h * 0.5 };
    const g = panel(ctx, rect, [0, 6], [ylo, yhi], pal, {
      xlab: 't / s',
      ylab: 'x / m',
      nx: 6,
      ny: 4,
    });

    const pts = [];
    for (let i = 0; i <= 180; i++) {
      const tt = (i / 180) * 6;
      pts.push([tt, X(tt)]);
    }
    poly(ctx, g.X, g.Y, pts, pal.blue, 2.2);

    /* 切线：斜率即当前速度 */
    const span = 1.35;
    poly(ctx, g.X, g.Y, [[t - span, x - v * span], [t + span, x + v * span]], pal.orange, 1.5, [6, 4]);
    label(ctx, '切线斜率 = v', g.X(Math.min(5.8, t + 0.28)), g.Y(x + v * 0.28) - 16, pal.orange, 'left', 12);

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
    spot(ctx, g.X(t), g.Y(x), 5.5, pal.orange, pal.bg2);

    /* ── 下：物体 ── */
    const yT = Math.round(h * 0.80) + 0.5;
    let xlo = Math.min(0, ylo);
    let xhi = Math.max(0, yhi);
    const TX = u => 58 + ((u - xlo) / (xhi - xlo)) * (w - 96);

    arrow(ctx, 50, yT, w - 30, yT, pal.mut, 1.4);
    const stp = niceStep(xhi - xlo, 6);
    for (let u = Math.ceil(xlo / stp) * stp; u <= xhi + 1e-9; u += stp) {
      const px = TX(u);
      if (px < 52 || px > w - 34) continue;
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, yT - 4);
      ctx.lineTo(px, yT + 4);
      ctx.stroke();
      label(ctx, num(u), px, yT + 16, pal.faint, 'center', 12);
    }
    label(ctx, 'x / m', w - 30, yT - 15, pal.mut, 'right', 13);

    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(TX(0), yT - 44);
    ctx.lineTo(TX(0), yT + 6);
    ctx.stroke();
    ctx.restore();
    label(ctx, '起点', TX(0), yT - 52, pal.faint, 'center', 12);

    arrow(ctx, TX(0), yT - 28, TX(x), yT - 28, pal.green, 2.2);
    label(ctx, 'x = ' + fmt(x, 2) + ' m', TX(x), yT - 42, pal.green, 'center', 13);

    ctx.beginPath();
    ctx.arc(TX(x), yT, 11, 0, Math.PI * 2);
    ctx.fillStyle = pal.bg2;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(TX(x), yT, 8, 0, Math.PI * 2);
    ctx.fillStyle = pal.orange;
    ctx.fill();

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['速度 v', fmt(v, 2) + ' m/s'],
      ['位移 x', fmt(v0 * t + 0.5 * a * t * t, 2) + ' m'],
      ['v² − v0²', fmt(v * v - v0 * v0, 2)],
      ['2ax', fmt(2 * a * (v0 * t + 0.5 * a * t * t), 2)],
    ]);
  }

  return { frame, reset };
}
