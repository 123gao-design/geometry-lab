/* 电12 法拉第电磁感应定律：匀强磁场垂直穿过 n 匝线圈，磁感应强度按三角波
   匀速升降。磁场增强时感应电流逆时针、减弱时顺时针，大小只由变化率决定；
   磁场到顶回头的那一刻变化率为零，电流跟着归零。
   右栏是总磁通量 nΦ 随时间的折线，斜率就是感应电动势：升段、降段斜率等大反号。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const BM = 1.2;    // 磁感应强度的最大值 T
const S = 0.02;    // 线圈面积 m²

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const kap = clamp(fn(q.kap, 0.4), 0.15, 1.2);
    const n = Math.round(clamp(fn(q.n, 100), 10, 200));
    const Rl = clamp(fn(q.R, 2), 0.5, 20);
    const key = [kap, n, Rl].join('|');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const tramp = BM / kap;                 // 升（或降）一趟用多久
    const per = 2 * tramp;
    if (T >= per) T %= per;                 // 一个来回正好是右栏折线的横轴长度
    const ph = T;
    const rising = ph < tramp;
    const B = rising ? kap * ph : BM - kap * (ph - tramp);
    const dB = rising ? kap : -kap;

    const phi1 = B * S;                     // 每匝磁通量 Wb
    const phiT = n * phi1;                  // 总磁通量 Wb
    const rate = n * S * dB;                // ΔΦ/Δt，Wb/s
    const E = Math.abs(rate);               // V
    const I = E / Rl;                       // A
    const dirI = dB > 0 ? 1 : -1;           // +1：逆时针（从纸面外看）

    ctx.clearRect(0, 0, w, h);

    /* ── 左栏：垂直纸面的磁场与 n 匝线圈 ──────────── */
    const cx = w * 0.28;
    const cy = h * 0.47;
    const Rr = Math.min(w * 0.155, h * 0.30);

    // 磁场：叉号，疏密与大小随 B 变
    const step = 34;
    for (let x = cx - Rr; x <= cx + Rr; x += step) {
      for (let y = cy - Rr; y <= cy + Rr; y += step) {
        if (Math.hypot(x - cx, y - cy) > Rr - 8) continue;
        const s = 4 + 5 * (B / BM);
        ctx.save();
        ctx.strokeStyle = pal.cyan;
        ctx.globalAlpha = 0.25 + 0.7 * (B / BM);
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x - s, y - s);
        ctx.lineTo(x + s, y + s);
        ctx.moveTo(x + s, y - s);
        ctx.lineTo(x - s, y + s);
        ctx.stroke();
        ctx.restore();
      }
    }
    label(ctx, '磁场垂直纸面向里', cx, cy - Rr - 16, pal.cyan, 'mid', 14);

    // 线圈：三匝同心圆
    for (let i = 0; i < 3; i++) {
      ctx.save();
      ctx.strokeStyle = pal.blue;
      ctx.lineWidth = i === 1 ? 2.8 : 2.2;
      ctx.beginPath();
      ctx.arc(cx, cy, Rr - i * 7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    label(ctx, `n = ${n} 匝`, cx, cy + Rr + 18, pal.blue, 'mid', 14);

    // 感应电流：圆周上的四个绕行箭头
    for (let i = 0; i < 4; i++) {
      const a = (i * Math.PI) / 2 + Math.PI / 4;
      const px = cx + (Rr - 7) * Math.cos(a);
      const py = cy + (Rr - 7) * Math.sin(a);
      let tx = Math.sin(a);
      let ty = -Math.cos(a);
      tx *= dirI;
      ty *= dirI;
      arrow(ctx, px - tx * 9, py - ty * 9, px + tx * 9, py + ty * 9, pal.green, 2);
    }
    label(ctx, `感应电流：${dirI > 0 ? '逆' : '顺'}时针`, cx, h * 0.90, pal.green, 'mid', 14);
    label(ctx, rising ? '磁场增强：感应磁场向外' : '磁场减弱：感应磁场向里', cx, h * 0.90 + 20,
      rising ? pal.orange : pal.cyan, 'mid', 14);

    // 灵敏电流计：指针按电流大小与方向偏转
    const gx = w * 0.47;
    const gy = h * 0.76;
    const gr = 30;
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(gx, gy, gr - 6, Math.PI * 0.68, Math.PI * 0.32, true);
    ctx.stroke();
    const amp = clamp(I / 1.2, 0.05, 1) * 1.0;
    const na = -Math.PI / 2 + dirI * amp;
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx + Math.cos(na) * (gr - 9), gy + Math.sin(na) * (gr - 9));
    ctx.stroke();
    ctx.restore();
    label(ctx, '灵敏电流计', gx, gy + gr + 16, pal.faint, 'mid', 13);

    /* ── 右栏：总磁通量 nΦ 的折线 ─────────────────── */
    const rc = { x: w * 0.66, y: h * 0.17, w: w * 0.29, h: h * 0.60 };
    const top = n * BM * S * 1.05;
    const g = panel(ctx, rc, [0, per], [0, top], pal, { xlab: 't/s', ylab: 'nΦ/Wb', nx: 4, ny: 4 });
    poly(ctx, g.X, g.Y, [[0, 0], [tramp, n * BM * S]], pal.orange, 2.4);
    poly(ctx, g.X, g.Y, [[tramp, n * BM * S], [per, 0]], pal.cyan, 2.4);
    spot(ctx, g.X(ph), g.Y(phiT), 5.5, pal.orange, pal.bg2);
    label(ctx, '斜率 = nS·ΔB/Δt', rc.x + 6, rc.y + 14, pal.faint, 'left', 13);
    label(ctx, '橙：增强　青：减弱', rc.x + 6, rc.y + 32, pal.faint, 'left', 13);

    st.readout([
      ['磁感应强度 B', fmt(B, 2) + ' T'],
      ['磁场变化率 ΔB/Δt', fmt(dB, 2) + ' T/s'],
      ['单匝磁通量 Φ = BS', fmt(phi1 * 1000, 1) + ' mWb'],
      ['总磁通量 nΦ', fmt(phiT, 2) + ' Wb'],
      ['感应电动势 E = nSΔB/Δt', fmt(E, 2) + ' V'],
      ['回路电阻 R', fmt(Rl, 1) + ' Ω'],
      ['感应电流 I = E/R', fmt(I, 2) + ' A'],
      ['电流方向', dirI > 0 ? '逆时针' : '顺时针'],
    ]);
  }

  return { frame };
}
