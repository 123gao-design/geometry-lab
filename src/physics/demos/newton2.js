/* 演示：牛顿第二定律。
   小车在光滑水平面上由静止被恒力拉动：左边看车与两根箭头（橙 = 拉力 F，绿 = 加速度 a），
   右边是 v-t 图，图线过原点、斜率就是 a = F/m。
   把 F 加倍，斜率加倍；把 m 加倍，斜率减半。读数栏同时给出 F/m、ma 与 2x/t² 三路算法，
   数值一致，F = ma 就在眼前。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const XEND = 4.6;   // 小车走到这里就重放

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const F = clamp(Number(p.F) || 4, 0.5, 10);
    const m = clamp(Number(p.m) || 2, 0.5, 5);
    const a = F / m;
    const key = F + '|' + m;
    if (key !== last) { last = key; reset(); }

    const T = Math.sqrt((2 * XEND) / a);   // 走到右端用时
    if (dt > 0) {
      t += dt;
      if (t > T) t = 0;
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const x = Math.min(0.5 * a * t * t, XEND);
    const v = a * t;

    /* ── 左：光滑水平面上的小车 ── */
    const narrow = w < 640;
    const sw = narrow ? w * 0.44 : w * 0.5;
    const gy = h - 54;
    const x0 = 30;
    const x1 = sw - 6;
    const SX = u => x0 + (u / XEND) * (x1 - x0 - 80);

    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0 - 12, gy + 0.5);
    ctx.lineTo(x1 + 10, gy + 0.5);
    ctx.stroke();
    ctx.restore();

    /* 地面刻度：每 1 m 一道 */
    for (let u = 1; u < XEND; u++) {
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(SX(u), gy + 2);
      ctx.lineTo(SX(u), gy + 8);
      ctx.stroke();
      label(ctx, String(u), SX(u), gy + 18, pal.faint, 'center', 12);
    }
    label(ctx, '光滑水平面', (x0 + x1) / 2, gy + 34, pal.mut, 'center', 12);

    /* 小车：车身 + 两只轮子 */
    const bx = SX(x);
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.rect(bx - 26, gy - 40, 52, 30);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = pal.ink;
    for (const dx of [-13, 13]) {
      ctx.beginPath();
      ctx.arc(bx + dx, gy - 8, 6.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    /* 拉力与加速度：两根箭头都从车身左端出发，长度分别正比于 F 与 a；
       量值各自压在箭头上方一行，两行拉开，字不压线，也不会被车头推着挤出左边这块 */
    const fLen = clamp(F * 10, 18, x1 - bx - 4);
    arrow(ctx, bx, gy - 58, bx + fLen, gy - 58, pal.orange, 2.4);
    label(ctx, 'F = ' + fmt(F, 1) + ' N', bx + 4, gy - 72, pal.orange, 'left', 13);
    const aLen = clamp(a * 9, 14, x1 - bx - 4);
    arrow(ctx, bx, gy - 98, bx + aLen, gy - 98, pal.green, 2.2);
    label(ctx, 'a = ' + fmt(a, 2), bx + 4, gy - 112, pal.green, 'left', 13);

    /* ── 右：v-t 图 ── */
    const px0 = sw + 24;
    const pw = Math.max(140, w - px0 - 20);
    const r = { x: px0, y: 22, w: pw, h: Math.max(90, h - 22 - 46) };
    const vTop = Math.max(a * T * 1.12, 0.4);
    const g = panel(ctx, r, [0, T * 1.06], [0, vTop], pal, {
      xlab: 't / s',
      ylab: 'v / (m/s)',
      nx: 6,
      ny: 4,
    });

    /* 面积 = 位移（与力2 那个演示同一条口径） */
    if (t > 0.02) {
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = pal.blue;
      ctx.beginPath();
      ctx.moveTo(g.X(0), g.Y(0));
      ctx.lineTo(g.X(t), g.Y(v));
      ctx.lineTo(g.X(t), g.Y(0));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    poly(ctx, g.X, g.Y, [[0, 0], [T, a * T]], pal.blue, 2.4);

    /* 斜率三角形：取靠后的一小段 */
    const t1 = T * 0.62;
    const v1 = a * t1;
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(g.X(t1), g.Y(v1));
    ctx.lineTo(g.X(T), g.Y(v1));
    ctx.lineTo(g.X(T), g.Y(a * T));
    ctx.stroke();
    ctx.restore();
    label(ctx, 'Δt', (g.X(t1) + g.X(T)) / 2, g.Y(v1) + 13, pal.orange, 'center', 12);
    label(ctx, 'Δv', g.X(T) - 7, (g.Y(v1) + g.Y(a * T)) / 2, pal.orange, 'right', 12);
    label(ctx, '斜率 = a = ' + fmt(a, 2) + ' m/s²', r.x + r.w - 12, r.y + 15, pal.green, 'right', 12);

    spot(ctx, g.X(Math.min(t, T)), g.Y(Math.min(v, a * T)), 4.5, pal.blue, pal.bg2);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['速度 v = at', fmt(v, 2) + ' m/s'],
      ['位移 x = ½at²', fmt(x, 2) + ' m'],
      ['力 F', fmt(F, 1) + ' N'],
      ['质量 m', fmt(m, 1) + ' kg'],
      ['加速度 F/m', fmt(a, 2) + ' m/s²'],
      ['2x/t²', t > 0.2 ? fmt((2 * x) / (t * t), 2) + ' m/s²' : '—'],
    ]);
  }

  return { frame, reset };
}
