/* 演示：牛顿第三定律与受力分析。
   上面是两个挤在一起的物块 A、B，被推力 F 一起推着向右加速；
   下面把两块分开画成受力图（隔离体）：A 受推力与 B 对它的力，B 只受 A 对它的力。
   两个接触力等大反向、分别作用在两块上，所以不会抵消；
   A 的合力是 F − N，B 的合力是 N，两块加速度相同，都是 a = F /(m_A + m_B)。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';

const XEND = 3.4;   // 两块走出这么远就重放

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const F = clamp(Number(p.F) || 8, 2, 20);
    const mA = clamp(Number(p.mA) || 2, 0.5, 4);
    const mB = clamp(Number(p.mB) || 1, 0.5, 4);
    const key = F + '|' + mA + '|' + mB;
    if (key !== last) { last = key; reset(); }

    const a = F / (mA + mB);      // 整体法：先求共同的加速度
    const N = mB * a;             // 隔离 B：A 对 B 的力
    const netA = F - N;           // 隔离 A：合力

    const T = Math.sqrt((2 * XEND) / a);
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

    /* ── 上半：两个物块 ── */
    const gy = Math.min(h * 0.46, h - 150);
    const x0 = 118;
    const x1 = w - 24;
    const wA = 40 + mA * 9;
    const wB = 40 + mB * 9;
    const SX = u => x0 + (u / XEND) * Math.max(60, x1 - x0 - wA - wB - 26);
    const ax = SX(x);              // A 的左边界
    const bx = ax + wA + 1;        // B 的左边界（两块贴住）
    const top = gy - 44;

    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(20, gy + 0.5);
    ctx.lineTo(x1, gy + 0.5);
    ctx.stroke();
    ctx.restore();
    label(ctx, '光滑水平面', w / 2, gy + 20, pal.mut, 'center', 12);

    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(ax, top, wA, 44);
    ctx.fillStyle = pal.orange;
    ctx.fillRect(bx, top, wB, 44);
    ctx.restore();
    label(ctx, 'A', ax + wA / 2, top + 22, pal.bg2, 'center', 15);
    label(ctx, 'B', bx + wB / 2, top + 22, pal.bg2, 'center', 15);

    /* 推力 F：从左边顶在 A 上 */
    const fLen = clamp(F * 5, 22, 96);
    arrow(ctx, ax - 6 - fLen, top + 22, ax - 6, top + 22, pal.orange, 2.4);
    label(ctx, 'F = ' + fmt(F, 1) + ' N', ax - 10 - fLen, top + 6, pal.orange, 'left', 13);

    /* 一对接触力：等长，方向相反，分别落在两块上 */
    const nLen = clamp(N * 5, 16, 120);
    arrow(ctx, bx, top - 16, bx - nLen, top - 16, pal.purple, 2.2);
    label(ctx, 'B 对 A', bx - 6, top - 30, pal.purple, 'right', 12);
    arrow(ctx, bx, top - 40, bx + nLen, top - 40, pal.pink, 2.2);
    label(ctx, 'A 对 B', bx + 6, top - 54, pal.pink, 'left', 12);

    /* ── 下半：两张受力图 ── */
    const fy = h * 0.56;
    const bh = h - fy - 16;
    const half = (w - 40) / 2;
    const boxes = [
      { x: 20, w: half - 10, title: 'A 的受力', m: mA, side: 'A' },
      { x: 20 + half, w: half - 10, title: 'B 的受力', m: mB, side: 'B' },
    ];
    for (const b of boxes) {
      ctx.save();
      ctx.strokeStyle = pal.line;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.rect(b.x + 0.5, fy + 0.5, b.w, bh);
      ctx.stroke();
      ctx.restore();
      label(ctx, b.title, b.x + 12, fy + 16, pal.mut, 'left', 12);

      const cx = b.x + 44;
      const cy = fy + bh * 0.44;
      ctx.save();
      ctx.fillStyle = b.side === 'A' ? pal.blue : pal.orange;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(cx - 15, cy - 15, 30, 30);
      ctx.restore();
      label(ctx, b.side, cx, cy, pal.bg2, 'center', 15);

      /* 箭头一律从物块右侧出发或回到它，文字挂在箭头末端，
         都在框内：块的左边留给出框的余量 */
      const ex = cx + 18;
      const sc = Math.min(6, (b.w - 150) / Math.max(F, 1));
      if (b.side === 'A') {
        arrow(ctx, ex, cy - 14, ex + F * sc, cy - 14, pal.orange, 2.2);
        label(ctx, 'F = ' + fmt(F, 1) + ' N', ex + 4, cy - 30, pal.orange, 'left', 12);
        arrow(ctx, ex + N * sc, cy + 10, ex, cy + 10, pal.purple, 2.2);
        label(ctx, 'B 对 A = ' + fmt(N, 1) + ' N', ex + N * sc + 6, cy + 10, pal.purple, 'left', 12);
        /* 合力：F 与 B 对 A 的力相减 */
        arrow(ctx, ex, cy + 48, ex + netA * sc, cy + 48, pal.green, 2.2);
        label(ctx, '合力 = ' + fmt(netA, 1) + ' N', ex + netA * sc + 6, cy + 48, pal.green, 'left', 12);
      } else {
        arrow(ctx, ex, cy - 14, ex + N * sc, cy - 14, pal.pink, 2.2);
        label(ctx, 'A 对 B = ' + fmt(N, 1) + ' N', ex + 4, cy - 30, pal.pink, 'left', 12);
        arrow(ctx, ex, cy + 22, ex + N * sc, cy + 22, pal.green, 2.2);
        label(ctx, '合力 = ' + fmt(N, 1) + ' N', ex + N * sc + 6, cy + 22, pal.green, 'left', 12);
      }
    }

    spot(ctx, ax + wA + 0.5, top + 22, 3, pal.card, pal.ink);

    st.readout([
      ['加速度 a', fmt(a, 2) + ' m/s²'],
      ['A 对 B 的力', fmt(N, 2) + ' N'],
      ['B 对 A 的力', fmt(N, 2) + ' N'],
      ['两力之差', fmt(N - N, 2) + ' N'],
      ['推力 F', fmt(F, 1) + ' N'],
      ['质量 mA + mB', fmt(mA + mB, 1) + ' kg'],
    ]);
  }

  return { frame, reset };
}
