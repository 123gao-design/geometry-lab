/* 实6 用单摆测重力加速度：摆长 L 用米尺量、周期 T 用多次全振动计时算。
   单摆周期 T = 2π√(L/g)，两边平方得 T² = (4π²/g)·L：T² 与 L 成正比，
   图线是过原点的直线，斜率 4π²/g，由此反推 g。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

const G0 = 9.8;
const TH0 = (10 * Math.PI) / 180;  // 摆角 10°，小角近似成立
const SWEEP = 30;                   // 计 30 次全振动

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const L = clamp(fn(q.L, 1.0), 0.3, 2.0);

    const key = String(L);
    if (key !== last) { last = key; T = 0; }
    T = dt > 0 ? T + dt : T;

    ctx.clearRect(0, 0, w, h);

    const per = 2 * Math.PI * Math.sqrt(L / G0);
    const omega = (2 * Math.PI) / per;
    const th = TH0 * Math.cos(omega * T);

    // 支架与悬点
    const px = w * 0.25, py = h * 0.12;
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px - 46, py);
    ctx.lineTo(px + 46, py);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = pal.mut;
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 摆长按 L 画长画短
    const R = clamp(h * (0.22 + 0.38 * ((L - 0.3) / 1.7)), h * 0.19, h * 0.60);
    const bx = px + R * Math.sin(th);
    const by = py + R * Math.cos(th);

    // 竖直参考线与最大摆角
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, py + R + 16);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px + R * Math.sin(TH0), py + R * Math.cos(TH0));
    ctx.lineTo(px - R * Math.sin(TH0), py + R * Math.cos(TH0));
    ctx.stroke();
    ctx.restore();

    // 摆角弧
    const ar = Math.max(0.30 * R, 34);
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(px, py, ar, Math.PI / 2 - TH0, Math.PI / 2 - th, th > 0);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'θ₀ = 10°', px + ar * 0.72, py + ar * 0.92, pal.orange, 'left', 12);

    // 摆线
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();

    // 摆球
    const br = Math.max(10, h * 0.022);
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.beginPath();
    ctx.arc(bx, by, br, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // L 标注（悬点到球心）
    const lx = px - 16;
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(lx, py);
    ctx.lineTo(lx, by);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(lx - 4, py);
    ctx.lineTo(lx + 4, py);
    ctx.moveTo(lx - 4, by);
    ctx.lineTo(lx + 4, by);
    ctx.stroke();
    ctx.restore();
    label(ctx, `L = ${fmt(L, 2)} m`, lx - 8, (py + by) / 2, pal.green, 'right', 12);

    // 秒表框
    const run = T % (SWEEP * per);
    const sbx = w * 0.06, sby = h * 0.875, sbw = w * 0.40, sbh = h * 0.095;
    ctx.save();
    ctx.fillStyle = pal.bg2;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(sbx, sby, sbw, sbh, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, '计时 · 30 次全振动', sbx + 12, sby + sbh * 0.32, pal.mut, 'left', 12);
    label(ctx, `${fmt(run, 2)} s`, sbx + 12, sby + sbh * 0.74, pal.ink, 'left', 15);
    label(ctx, `共 ${fmt(SWEEP * per, 1)} s`, sbx + sbw - 12, sby + sbh * 0.74, pal.orange, 'right', 13);

    // 右栏 T²–L
    const rect = { x: w * 0.60, y: h * 0.16, w: w * 0.36, h: h * 0.66 };
    const g = panel(ctx, rect, [0, 2.1], [0, 8.6], pal, { xlab: 'L/m', ylab: 'T²/s²', nx: 3, ny: 4 });

    const kTheory = (4 * Math.PI * Math.PI) / G0;
    poly(ctx, g.X, g.Y, [[0, 0], [2.1, kTheory * 2.1]], pal.green, 1.8, [6, 4]);

    const mp = [];
    for (let i = 0; i < 9; i++) {
      const lv = 0.3 + i * 0.2;
      const jit = 1 + 0.004 * Math.sin(i * 2.7);
      mp.push([lv, kTheory * lv * jit]);
    }
    for (const p of mp) {
      ctx.save();
      ctx.fillStyle = pal.blue;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(g.X(p[0]), g.Y(p[1]), 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    // 当前这点
    const t2 = kTheory * L;
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(g.X(L), g.Y(t2), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(g.X(L), g.Y(0));
    ctx.lineTo(g.X(L), g.Y(t2));
    ctx.lineTo(g.X(0), g.Y(t2));
    ctx.stroke();
    ctx.restore();
    label(ctx, `斜率 4π²/g = ${fmt(kTheory, 2)}`, rect.x + 4, rect.y - 12, pal.mut, 'left', 12);

    const gMeas = (4 * Math.PI * Math.PI) / kTheory;

    st.readout([
      ['摆长 L（悬点到球心）', fmt(L, 2) + ' m'],
      ['周期 T = 2π√(L/g)', fmt(per, 3) + ' s'],
      ['30 次全振动总时间', fmt(SWEEP * per, 2) + ' s'],
      ['由 L 与 T 反推 g', fmt(gMeas, 2) + ' m/s²'],
      ['T²', fmt(t2, 3) + ' s²'],
      ['T²/L', fmt(t2 / L, 3) + ' s²/m'],
      ['图线斜率 4π²/g', fmt(kTheory, 3) + ' s²/m'],
      ['与当地 g = 9.8 的差', fmt(gMeas - G0, 2) + ' m/s²'],
    ]);
  }

  return { frame };
}
