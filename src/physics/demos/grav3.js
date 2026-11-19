/* 演示：人造卫星与宇宙速度。
   左栏地球在正中，橙色卫星沿虚线圆轨道运行，青色虚线是轨道半径 r，绿箭头是线速度。
   距地球越远，轨道半径越大，走一圈越慢——把「轨道半径 r」拖大，卫星立刻慢下来。
   右栏画周期随轨道半径的变化 T = 2π√(r³/GM)：绿色横线是同步卫星的 24 小时，
   它与曲线的交点落在 r ≈ 6.6 个地球半径处。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const TAU = Math.PI * 2;
const V1 = 7.905;            // km/s，r = R 时的圆轨道速度，即第一宇宙速度
const T1 = 84.4;             // 分钟，r = R 时的周期
const RE = 6371;             // km，地球半径

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const rr = clamp(nn(p.r, 2), 1.05, 8);
    const key = String(rr);
    if (key !== last) { last = key; reset(); }

    /* 一圈的时长按 rr^0.75 拉长：越往高处绕得越慢，但不至于慢到看不下去 */
    if (dt > 0) t += dt / (2.6 * Math.pow(rr / 1.05, 0.75));
    const th = t * TAU;

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const dual = w >= 640;
    const sw = dual ? w * 0.56 : w - 16;
    const cx = sw * 0.5;
    const cy = h * 0.5;
    const U = Math.min((sw * 0.42) / 8, (h * 0.40) / 8);   // 每个地球半径的像素
    const R = rr * U;

    /* 轨道 */
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, TAU);
    ctx.stroke();
    ctx.restore();

    /* 轨道半径：从地心画到卫星 */
    const sx = cx + R * Math.cos(th);
    const sy = cy + R * Math.sin(th);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.cyan;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(sx, sy);
    ctx.stroke();
    ctx.restore();

    /* 地球 */
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, U, 0, TAU);
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.30;
    ctx.fill();
    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();
    label(ctx, '地球', cx, cy + 1, pal.blue, 'center', 13);

    label(ctx, 'r', cx + (sx - cx) * 0.62, cy + (sy - cy) * 0.62 - 11,
      pal.cyan, 'center', 13);

    /* 速度：沿轨道切线，越大越短 */
    const vk = V1 / Math.sqrt(rr);
    const L = clamp(46 / Math.sqrt(rr), 18, 46);
    const ux = -Math.sin(th);
    const uy = Math.cos(th);
    arrow(ctx, sx, sy, sx + ux * L, sy + uy * L, pal.green, 2.4);
    label(ctx, 'v', sx + ux * (L + 12), sy + uy * (L + 12), pal.green, 'center', 13);

    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(sx, sy, 5, 0, TAU);
    ctx.fill();
    ctx.restore();

    /* ── 右：周期随轨道半径 —— 右 */
    if (dual) {
      const px0 = sw + 20;
      const pw = w - px0 - 20;
      const ph = Math.min(300, Math.max(120, h - 150));
      const rect = {
        x: px0 + 26,
        y: Math.max(46, (h - ph) / 2),
        w: Math.max(120, pw - 40),
        h: ph,
      };
      const g = panel(ctx, rect, [1, 8.2], [0, 34], pal,
        { xlab: 'r / R', ylab: 'T / 小时', nx: 4, ny: 4 });

      const pts = [];
      for (let i = 0; i <= 140; i++) {
        const rv = 1 + (7.2 * i) / 140;
        pts.push([rv, (T1 * Math.pow(rv, 1.5)) / 60]);
      }
      poly(ctx, g.X, g.Y, pts, pal.orange, 2.2);

      /* 同步卫星：T = 24 h，对应 r ≈ 6.6 R */
      const y24 = g.Y(24);
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(g.ax, y24);
      ctx.lineTo(rect.x + rect.w, y24);
      ctx.moveTo(g.X(6.6), g.ay);
      ctx.lineTo(g.X(6.6), y24);
      ctx.stroke();
      ctx.restore();
      label(ctx, '同步轨道 24 小时', rect.x + 10, y24 - 10, pal.green, 'left', 13);
      spot(ctx, g.X(6.6), y24, 4, pal.green, pal.bg2);

      /* 当前轨道 */
      const Tn = (T1 * Math.pow(rr, 1.5)) / 60;
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.X(rr), g.ay);
      ctx.lineTo(g.X(rr), g.Y(Tn));
      ctx.lineTo(g.ax, g.Y(Tn));
      ctx.stroke();
      ctx.restore();
      spot(ctx, g.X(rr), g.Y(Tn), 4.6, pal.orange, pal.bg2);
    }

    const Tm = T1 * Math.pow(rr, 1.5);
    st.readout([
      ['轨道半径 r', fmt(rr, 2) + ' R'],
      ['离地高度 h', fmt((rr - 1) * RE, 0) + ' km'],
      ['线速度 v', fmt(vk, 2) + ' km/s'],
      ['周期 T', Tm < 120 ? fmt(Tm, 1) + ' 分钟' : fmt(Tm / 60, 2) + ' 小时'],
      ['向心加速度 a', fmt(9.8 / (rr * rr), 2) + ' m/s²'],
    ]);
  }

  return { frame, reset };
}
