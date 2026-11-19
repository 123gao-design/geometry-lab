/* 演示：万有引力定律。
   左栏两球相互吸引：两支箭头沿连线指向对方，长度随引力大小一起变，永远等长反向——
   引力是作用力与反作用力。右栏画引力随距离的曲线 F = Gm₁m₂/r²：
   距离翻一倍，纵坐标落到四分之一，图上直接标出这一点。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const TAU = Math.PI * 2;
const G = 6.674e-11;         // N·m²/kg²

export function create(st) {
  let last = '';
  const reset = () => {};

  function frame(dt) {
    const p = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const m1 = clamp(nn(p.m1, 60), 10, 100);
    const m2 = clamp(nn(p.m2, 40), 10, 100);
    const r = clamp(nn(p.r, 2), 1, 4);
    const key = m1 + '|' + m2 + '|' + r;
    if (key !== last) { last = key; reset(); }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const Fn = ((G * m1 * m2) / (r * r)) * 1e9;   // 牛顿换成纳牛

    /* ── 左：两球与一对引力 ── */
    const dual = w >= 640;
    const sw = dual ? w * 0.56 : w - 16;
    const cx = sw * 0.5;
    const cy = h * 0.5;

    const R1 = 10 + 8 * Math.cbrt(m1 / 100);
    const R2 = 10 + 8 * Math.cbrt(m2 / 100);
    const s = (sw * 0.56) / 4;              // 每米像素，4 m 正好六成宽
    const D = r * s;
    const x1 = cx - D / 2;
    const x2 = cx + D / 2;

    /* 连线 */
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, cy);
    ctx.lineTo(x2, cy);
    ctx.stroke();
    ctx.restore();

    /* 一对引力：从各自表面出发，指向对方 */
    const gap = Math.max(6, D - R1 - R2);
    const L = clamp(12 + 52 * Math.sqrt(Fn / 600), 12, Math.min(70, gap * 0.45));
    arrow(ctx, x1 + R1, cy, x1 + R1 + L, cy, pal.orange, 2.4);
    arrow(ctx, x2 - R2, cy, x2 - R2 - L, cy, pal.purple, 2.4);
    label(ctx, 'F', x1 + R1 + L * 0.5, cy - 12, pal.orange, 'center', 13);
    label(ctx, 'F', x2 - R2 - L * 0.5, cy - 12, pal.purple, 'center', 13);

    /* 两球 */
    const ball = (x, R, col, name) => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, cy, R, 0, TAU);
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.20;
      ctx.fill();
      ctx.globalAlpha = 0.95;
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.8;
      ctx.stroke();
      ctx.restore();
      label(ctx, name, x, cy - R - 14, col, 'center', 13);
    };
    ball(x1, R1, pal.blue, 'm₁');
    ball(x2, R2, pal.blue, 'm₂');

    /* 球心距：一条带端线的尺寸线 */
    const dy = cy + Math.max(R1, R2) + 44;
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x1, dy);
    ctx.lineTo(x2, dy);
    ctx.moveTo(x1, dy - 5);
    ctx.lineTo(x1, dy + 5);
    ctx.moveTo(x2, dy - 5);
    ctx.lineTo(x2, dy + 5);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'r', cx, dy - 12, pal.mut, 'center', 13);
    /* 球心到尺寸线的虚线，说明 r 量的是球心距 */
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([2, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, cy + R1);
    ctx.lineTo(x1, dy - 5);
    ctx.moveTo(x2, cy + R2);
    ctx.lineTo(x2, dy - 5);
    ctx.stroke();
    ctx.restore();

    /* ── 右：F 随 r 的曲线 ── */
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
      const Fmax = ((G * m1 * m2) / 1) * 1e9;      // r = 1 m 处的值，曲线最高的地方
      const g = panel(ctx, rect, [0.8, 4.2], [0, Fmax * 1.7], pal,
        { xlab: 'r / m', ylab: 'F / nN', nx: 4, ny: 4 });

      const pts = [];
      for (let i = 0; i <= 140; i++) {
        const rv = 0.8 + (3.4 * i) / 140;
        pts.push([rv, ((G * m1 * m2) / (rv * rv)) * 1e9]);
      }
      poly(ctx, g.X, g.Y, pts, pal.orange, 2.2);
      label(ctx, 'F = Gm₁m₂/r²', rect.x + rect.w - 12, rect.y + 16, pal.mut, 'right', 13);

      /* 当前距离 */
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.X(r), g.ay);
      ctx.lineTo(g.X(r), g.Y(Fn));
      ctx.lineTo(g.ax, g.Y(Fn));
      ctx.stroke();
      ctx.restore();
      spot(ctx, g.X(r), g.Y(Fn), 4.6, pal.orange, pal.bg2);

      /* 距离翻倍，引力只剩四分之一 */
      if (2 * r <= 4.1) {
        const X2 = g.X(2 * r);
        const Y2 = g.Y(Fn / 4);
        ctx.save();
        ctx.setLineDash([2, 4]);
        ctx.strokeStyle = pal.faint;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(X2, g.ay);
        ctx.lineTo(X2, Y2);
        ctx.stroke();
        ctx.restore();
        spot(ctx, X2, Y2, 4, pal.green, pal.bg2);
        const rightSide = X2 < rect.x + rect.w * 0.55;
        label(ctx, '2r：F/4', X2 + (rightSide ? 9 : -9), Y2 - 10,
          pal.green, rightSide ? 'left' : 'right', 13);
      }
    }

    st.readout([
      ['m₁', fmt(m1, 0) + ' kg'],
      ['m₂', fmt(m2, 0) + ' kg'],
      ['球心距 r', fmt(r, 2) + ' m'],
      ['引力 F', fmt(Fn, 1) + ' nN'],
      ['F·r²', fmt(Fn * r * r, 0) + ' nN·m²'],
    ]);
  }

  return { frame, reset };
}
