/* 实1 测速度与加速度：打点计时器纸带。
   纸带每 0.02 s 打一个点，每五个点取一个计数点（0.1 s）。相邻计数点位移之差
   恒为 aT₀²，据此用逐差法求加速度；v-t 图右下画同一组数据。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

const TICK = 0.02;   // 打点周期
const T0 = 0.1;      // 计数点间隔（五个点）
const N = 6;         // 计数点间隔段数

export function create(st) {
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const a = clamp(fn(q.a, 1), 0.2, 2);
    const v0 = clamp(fn(q.v0, 0.3), 0.1, 1);

    const key = a + ',' + v0;
    if (key !== last) last = key;

    ctx.clearRect(0, 0, w, h);

    const tEnd = T0 * N;
    const sMax = v0 * tEnd + 0.5 * a * tEnd * tEnd;
    const x0 = w * 0.17, x1 = w * 0.50;
    const scale = (x1 - x0) / Math.max(sMax, 0.2);
    const tapeY = h * 0.30;
    const tapeH = 34;
    const posOf = t => x0 + (v0 * t + 0.5 * a * t * t) * scale;

    // 计时器
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(x0 - w * 0.10, tapeY - 26, w * 0.075, 86, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, '计时器', x0 - w * 0.0625, tapeY - 36, pal.mut, 'center', 12);
    label(ctx, '50 Hz', x0 - w * 0.0625, tapeY + 46, pal.mut, 'center', 11);

    // 纸带
    ctx.save();
    ctx.fillStyle = pal.bg2;
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(x0 - 8, tapeY - tapeH / 2, x1 - x0 + 60, tapeH);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 原始打点
    for (let t = 0; t <= tEnd + 1e-9; t += TICK) {
      const x = posOf(t);
      ctx.save();
      ctx.fillStyle = pal.mut;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(x, tapeY, 1.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 计数点
    const s = [];
    for (let k = 0; k <= N; k++) s.push(posOf(k * T0));
    for (let k = 0; k <= N; k++) {
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.beginPath();
      ctx.arc(s[k], tapeY, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      label(ctx, String(k), s[k], tapeY - 20, pal.mut, 'center', 11);
    }

    // 段长标注
    const seg = [];
    for (let k = 1; k <= N; k++) {
      seg.push(v0 * T0 + 0.5 * a * T0 * T0 * (2 * k - 1));
    }
    for (let k = 1; k <= N; k++) {
      const xa = s[k - 1], xb = s[k];
      ctx.save();
      ctx.strokeStyle = pal.blue;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(xa, tapeY + tapeH / 2 + 8);
      ctx.lineTo(xb, tapeY + tapeH / 2 + 8);
      ctx.moveTo(xa, tapeY + tapeH / 2 + 4);
      ctx.lineTo(xa, tapeY + tapeH / 2 + 12);
      ctx.moveTo(xb, tapeY + tapeH / 2 + 4);
      ctx.lineTo(xb, tapeY + tapeH / 2 + 12);
      ctx.stroke();
      ctx.restore();
      label(ctx, fmt(seg[k - 1] * 100, 1), (xa + xb) / 2, tapeY + tapeH / 2 + 26, pal.blue, 'center', 11);
    }
    label(ctx, '各段位移 / cm', x0, tapeY + tapeH / 2 + 46, pal.mut, 'left', 12);

    // v-t 图
    const rect = { x: w * 0.60, y: h * 0.18, w: w * 0.35, h: h * 0.62 };
    const vTop = (v0 + a * tEnd) * 1.2;
    const g = panel(ctx, rect, [0, tEnd + 0.05], [0, vTop], pal, { xlab: 't/s', ylab: 'v/(m·s⁻¹)', nx: 3, ny: 4 });

    const pts = [];
    for (let k = 0; k <= N; k++) pts.push([k * T0, v0 + a * k * T0]);
    poly(ctx, g.X, g.Y, pts, pal.blue, 2);
    for (const p of pts) {
      ctx.save();
      ctx.fillStyle = pal.blue;
      ctx.beginPath();
      ctx.arc(g.X(p[0]), g.Y(p[1]), 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // 斜率三角形
    const tA = 0.1, tB = 0.4;
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(g.X(tA), g.Y(v0 + a * tA));
    ctx.lineTo(g.X(tB), g.Y(v0 + a * tA));
    ctx.lineTo(g.X(tB), g.Y(v0 + a * tB));
    ctx.stroke();
    ctx.restore();
    label(ctx, '斜率 = a', g.X((tA + tB) / 2), g.Y(v0 + a * tA) + 16, pal.orange, 'center', 12);

    const aMeas = ((seg[3] + seg[4] + seg[5]) - (seg[0] + seg[1] + seg[2])) / (9 * T0 * T0);
    const vMid = (seg[2] + seg[3]) / (2 * T0);

    st.readout([
      ['打点周期', '0.02 s'],
      ['计数点间隔 T₀', '0.10 s'],
      ['第一段 s₁', fmt(seg[0] * 100, 1) + ' cm'],
      ['第六段 s₆', fmt(seg[5] * 100, 1) + ' cm'],
      ['相邻差 Δx = aT₀²', fmt(a * T0 * T0 * 1000, 1) + ' mm'],
      ['逐差法得 a', fmt(aMeas, 2) + ' m/s²'],
      ['中间时刻速度 v₃', fmt(vMid, 2) + ' m/s'],
      ['设定的 a、v₀', fmt(a, 2) + ' m/s²、' + fmt(v0, 2) + ' m/s'],
    ]);
  }

  return { frame };
}
