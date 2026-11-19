/* 演示：开普勒三定律。
   左栏是一颗沿椭圆轨道绕日运行的行星，太阳落在椭圆的一个焦点上。
   轨道被等时间切成八块扇形：八块形状各异，面积却相同，这就是面积定律；
   行星身后那截绿色拖尾按固定时长取，近日点附近明显更长，说明那里走得快。
   右栏把 T² 与 a³ 画进同一张图：四颗内行星与当前轨道都落在 y = x 这条直线上。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, spot } from './axes.js';

const TAU = Math.PI * 2;
const AMAX = 2;              // 取景按最大半长轴定，滑块一拖轨道就看得见地涨缩
const ANIM = 9;              // 一圈约 9 秒（外壳另乘速度倍率）
const KM = 4.7405;           // 1 AU/年 ≈ 4.74 km/s

/* 四颗内行星：a 以天文单位、T 以年计，T² 与 a³ 恰好相等 */
const PLANETS = [
  { a: 0.387, T: 0.241, tag: '' },
  { a: 0.723, T: 0.615, tag: '' },
  { a: 1.0, T: 1.0, tag: '地球' },
  { a: 1.524, T: 1.881, tag: '火星' },
];

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  /* 开普勒方程 E − e sin E = M，用牛顿法解出偏近点角 */
  function eccAnom(M, e) {
    let E = M + e * Math.sin(M);
    for (let k = 0; k < 6; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
    return E;
  }
  /* 偏近点角 → 真近点角（从近日点量起的极角） */
  const trueAnom = (E, e) =>
    2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));

  function frame(dt) {
    const p = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const a = clamp(nn(p.a, 1), 0.5, 2);
    const e = clamp(nn(p.e, 0.35), 0, 0.7);
    const key = a + '|' + e;
    if (key !== last) { last = key; reset(); }
    if (dt > 0) t += dt;

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
    const s = (sw * 0.60) / (2 * AMAX);   // 像素 / AU，主图形约占画框六成宽

    const p0 = a * (1 - e * e);           // 半通径
    const radOf = f => p0 / (1 + e * Math.cos(f));
    const phiOf = tau => trueAnom(eccAnom(TAU * (tau - Math.floor(tau)), e), e);
    /* 太阳在原点，椭圆中心在 (−ae, 0)，屏幕上按椭圆中心摆放 */
    const SX = x => cx + (x + a * e) * s;
    const SY = y => cy + y * s;
    const sunX = SX(0);
    const sunY = SY(0);

    const tau = (t / ANIM) % 1;
    const T = Math.pow(a, 1.5);

    /* ── 八块等时间扇形：每块的面积都是 πab/8 ── */
    const phis = [];
    for (let k = 0; k <= 8; k++) phis.push(phiOf(k / 8));
    const now = Math.min(7, Math.floor(tau * 8));

    for (let k = 0; k < 8; k++) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      for (let j = 0; j <= 8; j++) {
        const f = phis[k] + (phis[k + 1] - phis[k]) * (j / 8);
        const rr = radOf(f);
        ctx.lineTo(SX(rr * Math.cos(f)), SY(rr * Math.sin(f)));
      }
      ctx.closePath();
      ctx.fillStyle = k === now ? pal.orange : (k % 2 ? pal.blue : pal.purple);
      ctx.globalAlpha = k === now ? 0.20 : 0.075;
      ctx.fill();
      ctx.restore();
    }

    /* 分界的八条半径 */
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1;
    for (let k = 0; k < 8; k++) {
      const f = phis[k];
      const rr = radOf(f);
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(SX(rr * Math.cos(f)), SY(rr * Math.sin(f)));
      ctx.stroke();
    }
    ctx.restore();

    /* 长轴：两个焦点都在这条线上 */
    ctx.save();
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(SX(-a * (1 + e)), cy);
    ctx.lineTo(SX(a * (1 - e)), cy);
    ctx.stroke();
    ctx.restore();

    /* 椭圆轨道 */
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.mut;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    for (let j = 0; j <= 160; j++) {
      const f = (TAU * j) / 160;
      const rr = radOf(f);
      const X = SX(rr * Math.cos(f));
      const Y = SY(rr * Math.sin(f));
      if (j) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    /* 太阳与另一个（空的）焦点 */
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(sunX, sunY, 6.5, 0, TAU);
    ctx.fill();
    ctx.restore();
    label(ctx, '太阳', sunX + 10, cy - 16, pal.orange, 'left', 13);

    const fx2 = SX(-2 * a * e);
    if (Math.abs(sunX - fx2) > 14) {
      ctx.save();
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(fx2, cy, 3.6, 0, TAU);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'F′', fx2, cy + 20, pal.mut, 'center', 13);
    }

    label(ctx, '近日点', SX(a * (1 - e)), cy + 20, pal.mut, 'center', 13);
    label(ctx, '远日点', SX(-a * (1 + e)), cy + 20, pal.mut, 'center', 13);

    /* ── 行星：半径、拖尾、速度 ── */
    const phi = phiOf(tau);
    const rr = radOf(phi);
    const px = SX(rr * Math.cos(phi));
    const py = SY(rr * Math.sin(phi));

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.cyan;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(sunX, sunY);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'r', sunX + (px - sunX) * 0.55, sunY + (py - sunY) * 0.55 - 11, pal.cyan, 'center', 13);

    /* 拖尾：固定 0.1 个周期走过的弧，近日点附近那一段明显更长 */
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.globalAlpha = 0.9;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    for (let j = 0; j <= 24; j++) {
      const f = phiOf(tau - 0.1 * (1 - j / 24));
      const rj = radOf(f);
      const X = SX(rj * Math.cos(f));
      const Y = SY(rj * Math.sin(f));
      if (j) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
    }
    ctx.stroke();
    ctx.restore();

    /* 速度沿轨道切线，大小 v = 2π√(2/r − 1/a) */
    const drd = (p0 * e * Math.sin(phi)) / Math.pow(1 + e * Math.cos(phi), 2);
    const vx = drd * Math.cos(phi) - rr * Math.sin(phi);
    const vy = drd * Math.sin(phi) + rr * Math.cos(phi);
    const vn = Math.hypot(vx, vy) || 1;
    const vAU = TAU * Math.sqrt(Math.max(0, 2 / rr - 1 / a));
    const Lv = clamp(vAU * 5.2, 22, 68);
    arrow(ctx, px, py, px + (vx / vn) * Lv, py + (vy / vn) * Lv, pal.green, 2.4);
    label(ctx, 'v', px + (vx / vn) * (Lv + 12), py + (vy / vn) * (Lv + 12), pal.green, 'center', 13);

    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, TAU);
    ctx.fill();
    ctx.restore();

    /* ── 右：T² 与 a³ 成正比 ── */
    if (dual) {
      const px0 = sw + 20;
      const pw = w - px0 - 20;
      const side = Math.min(pw, h - 100);
      const r = { x: px0 + (pw - side) / 2, y: 42, w: side, h: side };
      const g = panel(ctx, r, [0, 8], [0, 8], pal, { xlab: 'a³ / AU³', ylab: 'T² / 年²', nx: 4, ny: 4 });

      ctx.save();
      ctx.strokeStyle = pal.orange;
      ctx.globalAlpha = 0.85;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(g.X(0), g.Y(0));
      ctx.lineTo(g.X(8), g.Y(8));
      ctx.stroke();
      ctx.restore();
      label(ctx, 'T² = a³', r.x + r.w - 12, r.y + 15, pal.mut, 'right', 13);

      PLANETS.forEach(q => {
        const X = g.X(Math.pow(q.a, 3));
        const Y = g.Y(q.T * q.T);
        spot(ctx, X, Y, q.tag ? 4 : 3.2, pal.mut);
        if (q.tag) label(ctx, q.tag, X + 8, Y - 10, pal.mut, 'left', 13);
      });

      const a3 = Math.pow(a, 3);
      const T2 = T * T;
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.X(0), g.Y(T2));
      ctx.lineTo(g.X(a3), g.Y(T2));
      ctx.lineTo(g.X(a3), g.Y(0));
      ctx.stroke();
      ctx.restore();
      const right = g.X(a3) < r.x + r.w * 0.62;
      spot(ctx, g.X(a3), g.Y(T2), 5, pal.orange, pal.bg2);
      label(ctx, '当前轨道', g.X(a3) + (right ? 9 : -9), g.Y(T2) + 15,
        pal.orange, right ? 'left' : 'right', 13);
    }

    st.readout([
      ['半长轴 a', fmt(a, 2) + ' AU'],
      ['离心率 e', fmt(e, 2)],
      ['周期 T', fmt(T, 2) + ' 年'],
      ['T² / a³', fmt((T * T) / (a * a * a), 3)],
      ['当前距离 r', fmt(rr, 2) + ' AU'],
      ['当前速率 v', fmt(vAU * KM, 1) + ' km/s'],
    ]);
  }

  return { frame, reset };
}
