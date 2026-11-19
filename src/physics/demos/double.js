/* 光4 光的干涉。
   杨氏双缝：两缝间距 d、屏距 L，屏上离中心 y 处的光程差 Δr ≈ dy/L。
   Δr = kλ 处加强，Δr = (k+½)λ 处减弱，条纹间距 Δx = Lλ/d。
   左栏是光路示意（缝距按可见比例放大），右栏是屏上的强度曲线与彩色条纹本身。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

/** 波长 → 画面上用的颜色（近似可见光谱） */
function wlColor(wl) {
  let r = 0, g = 0, b = 0;
  if (wl < 440) { r = (440 - wl) / 60; b = 1; }
  else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
  else if (wl < 510) { g = 1; b = (510 - wl) / 20; }
  else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
  else if (wl < 645) { r = 1; g = (645 - wl) / 65; }
  else { r = 1; }
  const q = v => Math.round(255 * clamp(v, 0, 1));
  return [q(r), q(g), q(b)];
}

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const lamN = clamp(fn(q.lam, 550), 400, 700);       // nm
    const dmm = clamp(fn(q.d, 0.5), 0.1, 1);            // mm
    const Lm = clamp(fn(q.L, 1), 0.5, 3);               // m
    const ymm = clamp(fn(q.y, 1.1), -6, 6);             // mm
    const key = [lamN, dmm, Lm, ymm].join('|');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const lam = lamN * 1e-9;
    const dd = dmm * 1e-3;
    const dy = ymm * 1e-3;
    const dxm = (Lm * lam) / dd;                        // 条纹间距，m
    const dr = (dd * dy) / Lm;                          // 光程差，m
    const ord = dr / lam;                               // 级次
    const Iof = y => Math.cos((Math.PI * dd * y) / (Lm * lam)) ** 2;

    ctx.clearRect(0, 0, w, h);

    /* ── 左栏：双缝到屏的光路 ───────────────────── */
    const xb = w * 0.26;
    const xs = w * 0.46;
    const cy = h * 0.50;
    const sd = h * 0.045 + ((dmm - 0.1) / 0.9) * h * 0.115;   // 缝的半间距（示意放大）
    const yPix = clamp((ymm / 6) * h * 0.34, -h * 0.38, h * 0.38);

    // 挡板与两条缝
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(xb, h * 0.10);
    ctx.lineTo(xb, cy - sd - 5);
    ctx.moveTo(xb, cy - sd + 5);
    ctx.lineTo(xb, cy + sd - 5);
    ctx.moveTo(xb, cy + sd + 5);
    ctx.lineTo(xb, h * 0.90);
    ctx.stroke();
    ctx.restore();
    label(ctx, '双缝', xb, h * 0.10 - 10, pal.mut, 'center', 13);

    // 屏
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xs, h * 0.06);
    ctx.lineTo(xs, h * 0.94);
    ctx.stroke();
    ctx.restore();
    label(ctx, '屏', xs + 6, h * 0.06 + 4, pal.mut, 'left', 13);

    // 光轴
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(xb - w * 0.20, cy);
    ctx.lineTo(xs, cy);
    ctx.stroke();
    ctx.restore();

    // 两束光到 P
    const S1 = [xb, cy - sd], S2 = [xb, cy + sd];
    const P = [xs, cy - yPix];
    ctx.save();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = pal.blue;
    ctx.beginPath(); ctx.moveTo(S1[0], S1[1]); ctx.lineTo(P[0], P[1]); ctx.stroke();
    ctx.strokeStyle = pal.green;
    ctx.beginPath(); ctx.moveTo(S2[0], S2[1]); ctx.lineTo(P[0], P[1]); ctx.stroke();
    ctx.restore();
    spot(ctx, S1[0], S1[1], 3.4, pal.blue, pal.bg2);
    spot(ctx, S2[0], S2[1], 3.4, pal.green, pal.bg2);
    label(ctx, 'S₁', S1[0] - 8, S1[1] - 8, pal.blue, 'right', 13);
    label(ctx, 'S₂', S2[0] - 8, S2[1] + 16, pal.green, 'right', 13);
    spot(ctx, P[0], P[1], 4.6, pal.orange, pal.bg2);
    label(ctx, 'P', P[0] + 8, P[1] - 8, pal.orange, 'left', 14);

    // 缝距与屏距的标注
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(xb - 26, S1[1]);
    ctx.lineTo(xb - 26, S2[1]);
    ctx.stroke();
    ctx.restore();
    label(ctx, `d = ${fmt(dmm, 2)} mm`, xb - 32, cy, pal.mut, 'right', 12);
    label(ctx, `L = ${fmt(Lm, 2)} m`, (xb + xs) / 2, h * 0.90 + 16, pal.mut, 'center', 12);

    /* ── 右栏：屏上的强度与条纹 ─────────────────── */
    const Ymax = Math.max(0.5, (dxm * 1000) * 3.2);       // mm
    const rc = { x: w * 0.545, y: h * 0.10, w: w * 0.42, h: h * 0.48 };
    const g = panel(ctx, rc, [-Ymax, Ymax], [0, 1.08], pal, { xlab: 'y/mm', ylab: 'I/I₀', nx: 4, ny: 3 });

    const pts = [];
    for (let i = 0; i <= 400; i++) {
      const yy = -Ymax + (2 * Ymax * i) / 400;
      pts.push([yy, Iof(yy * 1e-3)]);
    }
    poly(ctx, g.X, g.Y, pts, pal.orange, 2);

    // 当前观察点的竖虚线与圆点
    if (Math.abs(ymm) <= Ymax) {
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(g.X(ymm), rc.y);
      ctx.lineTo(g.X(ymm), rc.y + rc.h);
      ctx.stroke();
      ctx.restore();
      spot(ctx, g.X(ymm), g.Y(Iof(dy)), 4.2, pal.orange, pal.bg2);
    }
    label(ctx, '屏上光强分布', rc.x + 2, rc.y - 14, pal.mut, 'left', 13);

    // 条纹本身：一格一格按光强上色
    const srec = { x: rc.x, y: rc.y + rc.h + 30, w: rc.w, h: 24 };
    const [cr, cg, cb] = wlColor(lamN);
    for (let px = 0; px < srec.w; px += 2) {
      const yy = -Ymax + (2 * Ymax * px) / srec.w;
      const I = Iof(yy * 1e-3);
      ctx.fillStyle = `rgba(${cr},${cg},${cb},${(0.06 + 0.94 * I).toFixed(3)})`;
      ctx.fillRect(srec.x + px, srec.y, 2, srec.h);
    }
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.strokeRect(srec.x + 0.5, srec.y + 0.5, srec.w, srec.h);
    ctx.restore();
    label(ctx, '屏上的条纹', srec.x + 2, srec.y + srec.h + 16, pal.mut, 'left', 12);
    if (Math.abs(ymm) <= Ymax) {
      ctx.save();
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(g.X(ymm), srec.y - 4);
      ctx.lineTo(g.X(ymm), srec.y + srec.h + 4);
      ctx.stroke();
      ctx.restore();
    }

    /* ── 读数 ───────────────────────────────────── */
    const bright = Math.abs(ord - Math.round(ord)) < 0.05;
    const dark = Math.abs(Math.abs(ord - Math.round(ord)) - 0.5) < 0.05;
    st.readout([
      ['波长 λ', fmt(lamN, 0) + ' nm'],
      ['双缝间距 d', fmt(dmm, 2) + ' mm'],
      ['屏距 L', fmt(Lm, 2) + ' m'],
      ['条纹间距 Δx = Lλ/d', fmt(dxm * 1000, 3) + ' mm'],
      ['观察点位置 y', fmt(ymm, 2) + ' mm'],
      ['光程差 Δr = dy/L', fmt(dr * 1e9, 1) + ' nm'],
      ['级次 Δr/λ', fmt(ord, 3)],
      ['该处', bright ? '亮纹（Δr = kλ）' : dark ? '暗纹（Δr = (k+½)λ）' : '介于亮暗之间'],
      ['第一级亮纹 sinθ = λ/d', fmt(lam / dd, 4)],
      ['Δx·d/L（即 λ）', fmt((dxm * dd / Lm) * 1e9, 1) + ' nm'],
    ]);
  }

  return { frame };
}
