/* 实11 用双缝干涉测波长：
   单色光经双缝分成两束相干光，在屏上叠出等间距的明暗条纹。
   条纹间距 Δx = λL/d 把波长、缝距与屏距连在一起：量出 Δx、d、L，就能反求 λ。
   左栏是俯视的光路与屏上的条纹，右栏是屏上光强随位置的分布——亮纹等间距，
   间距只与 λ、L 成正比、与 d 成反比。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

export function create(st) {
  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const lam = clamp(fn(q.lam, 550), 400, 700);     // 波长，nm
    const dmm = clamp(fn(q.d, 0.2), 0.1, 0.6);       // 双缝间距，mm
    const L = clamp(fn(q.L, 1), 0.5, 2);             // 屏到双缝的距离，m

    ctx.clearRect(0, 0, w, h);

    const dx = (lam * 1e-3 * L) / dmm;               // 条纹间距，mm
    const YMAX = 12;                                 // 屏上视场的半高，mm

    // ———— 左栏：俯视的光路 ————
    const xs = w * 0.08;
    const xb = w * 0.32;
    const xsc = w * 0.52;
    const yc = h * 0.48;
    const scrHalf = h * 0.32;
    const barTop = yc - scrHalf, barBot = yc + scrHalf;
    const sep = clamp(h * 0.11, 28, 62);
    const y1 = yc - sep / 2, y2 = yc + sep / 2;
    const gap = 5;

    // 屏
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(xsc - 7, barTop, 14, scrHalf * 2, 3);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 屏上的明暗条纹
    const NSEG = 200;
    const mapY = ym => yc - (ym / YMAX) * scrHalf;
    ctx.save();
    ctx.fillStyle = pal.orange;
    for (let i = 0; i < NSEG; i++) {
      const ym0 = -YMAX + (2 * YMAX * i) / NSEG;
      const ym1 = -YMAX + (2 * YMAX * (i + 1)) / NSEG;
      const inten = Math.cos((Math.PI * (ym0 + ym1)) / 2 / dx) ** 2;
      ctx.globalAlpha = 0.08 + 0.92 * inten;
      const pa = mapY(ym0), pb = mapY(ym1);
      ctx.fillRect(xsc - 6, Math.min(pa, pb), 12, Math.abs(pb - pa) + 0.6);
    }
    ctx.restore();

    // 双缝挡板
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 3;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(xb, barTop);
    ctx.lineTo(xb, y1 - gap);
    ctx.moveTo(xb, y1 + gap);
    ctx.lineTo(xb, y2 - gap);
    ctx.moveTo(xb, y2 + gap);
    ctx.lineTo(xb, barBot);
    ctx.stroke();
    ctx.restore();

    // 光源到两条缝
    for (const ys of [y1, y2]) {
      ctx.save();
      ctx.strokeStyle = pal.cyan;
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(xs + 7, yc);
      ctx.lineTo(xb, ys);
      ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.fillStyle = pal.purple;
    ctx.beginPath();
    ctx.arc(xs, yc, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, '单色光源', xs, barTop - 12, pal.mut, 'center', 12);
    label(ctx, '双缝', xb, barTop - 12, pal.mut, 'center', 12);
    label(ctx, '屏', xsc, barTop - 12, pal.mut, 'center', 12);

    // 缝距 d
    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(xb - 18, y1);
    ctx.lineTo(xb - 18, y2);
    ctx.moveTo(xb - 24, y1);
    ctx.lineTo(xb - 12, y1);
    ctx.moveTo(xb - 24, y2);
    ctx.lineTo(xb - 12, y2);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'd', xb - 18, y1 - 10, pal.purple, 'center', 12);

    // 屏距 L
    const yL = barBot + h * 0.08;
    arrow(ctx, xb, yL, xsc - 7, yL, pal.mut, 1.3);
    arrow(ctx, xsc - 7, yL, xb, yL, pal.mut, 1.3);
    label(ctx, `L = ${fmt(L, 2)} m`, (xb + xsc) / 2, yL - 8, pal.mut, 'center', 12);

    // 两条缝到屏上 P 点
    const kP = Math.min(3, Math.floor((YMAX * 0.85) / dx));
    const ymP = kP > 0 ? kP * dx : 0;
    const yP = mapY(ymP);
    for (const ys of [y1, y2]) {
      ctx.save();
      ctx.strokeStyle = pal.orange;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(xb, ys);
      ctx.lineTo(xsc - 7, yP);
      ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(xsc, yP, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, 'P', xsc + 12, yP + 4, pal.orange, 'left', 12);

    // 屏上相邻两条亮纹的距离
    const dxPx = (Math.min(dx, YMAX) / YMAX) * scrHalf;
    if (dx <= YMAX * 0.9 && dxPx > 16) {
      const bx = xsc + 18;
      const p0 = yc, p1 = mapY(-dx);
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(bx - 5, p0);
      ctx.lineTo(bx + 5, p0);
      ctx.moveTo(bx - 5, p1);
      ctx.lineTo(bx + 5, p1);
      ctx.moveTo(bx, p0);
      ctx.lineTo(bx, p1);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'Δx', bx + 8, (p0 + p1) / 2 + 4, pal.purple, 'left', 11);
    }

    // ———— 右栏：光强分布 ————
    const rect = { x: w * 0.62, y: h * 0.14, w: w * 0.34, h: h * 0.68 };
    const g = panel(ctx, rect, [0, 1.1], [-YMAX, YMAX], pal, { xlab: 'I / I₀', ylab: 'y / mm', nx: 3, ny: 6 });

    const pts = [];
    for (let i = 0; i <= 240; i++) {
      const ym = -YMAX + (2 * YMAX * i) / 240;
      pts.push([Math.cos((Math.PI * ym) / dx) ** 2, ym]);
    }
    poly(ctx, g.X, g.Y, pts, pal.orange, 1.8);

    // 亮纹位置
    const kB = Math.floor(YMAX / dx);
    if (kB <= 40) {
      ctx.save();
      ctx.fillStyle = pal.green;
      for (let k = -kB; k <= kB; k++) {
        ctx.beginPath();
        ctx.arc(g.X(1), g.Y(k * dx), 2.8, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    label(ctx, `Δx = λL/d = ${fmt(dx, 2)} mm`, rect.x + 10, rect.y + 42, pal.mut, 'left', 12);

    st.readout([
      ['波长 λ', fmt(lam, 0) + ' nm'],
      ['双缝间距 d', fmt(dmm, 2) + ' mm'],
      ['屏到双缝的距离 L', fmt(L, 2) + ' m'],
      ['条纹间距 Δx = λL/d', fmt(dx, 2) + ' mm'],
      ['±12 mm 内的亮纹数', String(2 * Math.floor(YMAX / dx) + 1)],
      ['反算 λ = Δx·d/L', fmt((dx * dmm * 1000) / L, 0) + ' nm'],
      ['光的频率 f = c/λ', fmt(3e8 / (lam * 1e-9) / 1e14, 2) + '×10¹⁴ Hz'],
      ['判读', '亮纹等间距，间距与 d 反比、与 L 正比'],
    ]);
  }

  return { frame };
}
