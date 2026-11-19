/* 实4 研究平抛运动：钢球从斜槽末端水平飞出。
   水平方向匀速 x = v₀t，竖直方向自由落体 y = ½gt²，消去 t 得
   y = g x² / (2v₀²)：y 与 x² 成正比，图线是一条过原点的直线。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

const G = 9.8;
const HMAX = 1.2;

export function create(st) {
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const H = clamp(fn(q.H, 0.8), 0.2, HMAX);
    const v0 = clamp(fn(q.v0, 1.5), 0.5, 3);

    const key = H + ',' + v0;
    if (key !== last) last = key;

    ctx.clearRect(0, 0, w, h);

    const tFall = Math.sqrt((2 * H) / G);
    const range = v0 * tFall;

    // 画框
    const x0 = w * 0.13, x1 = w * 0.55;
    const yTop = h * 0.16, yBot = h * 0.80;
    const sy = (yBot - yTop) / HMAX;
    const sx = (x1 - x0) / Math.max(range, 0.15);
    const X = m => x0 + m * sx;
    const Yf = m => yBot - m * sy;

    // 台面与地面
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.06, Yf(H));
    ctx.lineTo(x0, Yf(H));
    ctx.stroke();
    ctx.restore();
    label(ctx, '斜槽末端', w * 0.06, Yf(H) - 10, pal.mut, 'left', 12);

    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0 - 10, yBot);
    ctx.lineTo(x1 + 20, yBot);
    ctx.stroke();
    ctx.restore();
    label(ctx, '地面', x1 + 10, yBot + 18, pal.mut, 'right', 12);

    // 竖直标尺
    for (let z = 0; z <= H + 1e-9; z += 0.2) {
      const y = yBot - z * sy;
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x0 - 8, y);
      ctx.lineTo(x0 - 3, y);
      ctx.stroke();
      ctx.restore();
    }
    // 高度标注
    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.3;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(w * 0.10, Yf(H));
    ctx.lineTo(w * 0.10, yBot);
    ctx.stroke();
    ctx.restore();
    label(ctx, `H = ${fmt(H, 2)} m`, w * 0.10, (Yf(H) + yBot) / 2, pal.blue, 'right', 12);

    // 轨迹
    const pts = [];
    const NP = 40;
    for (let i = 0; i <= NP; i++) {
      const t = (tFall * i) / NP;
      pts.push([v0 * t, 0.5 * G * t * t]);
    }
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = 0.35 + 0.65 * (i / NP);
      ctx.beginPath();
      ctx.arc(X(p[0]), yBot - p[1] * sy, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    label(ctx, '平抛轨迹', X(range * 0.42), yBot - 0.5 * G * Math.pow(tFall * 0.65, 2) * sy - 14, pal.orange, 'left', 12);

    // 初速度箭头
    const ax = X(0), ay = Yf(H);
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(ax + 46, ay);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ax + 46, ay);
    ctx.lineTo(ax + 38, ay - 5);
    ctx.lineTo(ax + 38, ay + 5);
    ctx.closePath();
    ctx.fillStyle = pal.green;
    ctx.fill();
    ctx.restore();
    label(ctx, `v₀ = ${fmt(v0, 1)} m/s`, ax + 26, ay - 12, pal.green, 'center', 12);

    // 落点
    const lx = X(range), ly = yBot;
    ctx.save();
    ctx.fillStyle = pal.pink;
    ctx.beginPath();
    ctx.arc(lx, ly, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.pink;
    ctx.lineWidth = 1.3;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.lineTo(lx, Yf(H));
    ctx.stroke();
    ctx.restore();
    label(ctx, `x = ${fmt(range, 2)} m`, lx + 6, (ly + Yf(H)) / 2, pal.pink, 'left', 12);

    // 右栏 y–x²
    const rect = { x: w * 0.62, y: h * 0.16, w: w * 0.34, h: h * 0.66 };
    const x2v = Math.pow(range, 2);
    const g = panel(ctx, rect, [0, x2v || 1], [0, H], pal, { xlab: 'x²/m²', ylab: 'y/m', nx: 3, ny: 4 });

    const kTheory = G / (2 * v0 * v0);
    poly(ctx, g.X, g.Y, [[0, 0], [x2v, kTheory * x2v]], pal.green, 1.8, [6, 4]);

    const mpts = [];
    for (let i = 1; i <= 8; i++) {
      const xv = (range * i) / 8;
      const jit = 1 + 0.008 * Math.sin(i * 2.3);
      mpts.push([xv * xv, (kTheory * xv * xv) * jit]);
    }
    for (const p of mpts) {
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.beginPath();
      ctx.arc(g.X(p[0]), g.Y(p[1]), 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    label(ctx, `斜率 k = g/(2v₀²) = ${fmt(kTheory, 3)}`, rect.x + 10, rect.y + 38, pal.mut, 'left', 12);

    const vBack = Math.sqrt(G / (2 * kTheory));

    st.readout([
      ['抛出高度 H', fmt(H, 2) + ' m'],
      ['初速度 v₀', fmt(v0, 2) + ' m/s'],
      ['飞行时间 t = √(2H/g)', fmt(tFall, 3) + ' s'],
      ['水平射程 x = v₀t', fmt(range, 2) + ' m'],
      ['落地竖直速度 v_y = gt', fmt(G * tFall, 2) + ' m/s'],
      ['直线斜率 k', fmt(kTheory, 3) + ' s²/m'],
      ['由斜率反推 v₀', fmt(vBack, 2) + ' m/s'],
      ['判读', 'y 与 x² 成正比，图线过原点'],
    ]);
  }

  return { frame };
}
