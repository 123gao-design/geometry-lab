/* 电1／电2 共用：多个电荷的叠加。
   两个场源电荷 A（q₁）、B（q₂）固定在一水平线上，考察点 P 在连线的中垂线上，
   离连线的高度由滑块 hp 给。
   ① 库仑力的合成档：P 上放一个试探电荷 q₀，两支库仑力 F₁ = q₀E₁、F₂ = q₀E₂ 与它们的合力 F；
   ② 场强的合成档：A、B 各自在 P 点产生的场强 E₁、E₂ 与合场强 E。
   左栏画出两个电荷与 P 点上的三支矢量，右栏把三支矢量平移到同一起点作平行四边形；
   读数栏给出两支分量、夹角与合成量，最后一行把「矢量直接相加」与「余弦定理」两算法相减，
   滑到哪儿都为零——叠加原理的算术核对。 */
import { label, clamp, fmt, arrow } from '../gfx.js';

const K = 9e9;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = n => String(n).split('').map(c => (c === '-' ? '⁻' : SUP[+c])).join('');

function sci(v) {
  if (!Number.isFinite(v) || v === 0) return '0';
  const [mb, ex] = v.toExponential(1).split('e');
  return mb + '×10' + sup(Number(ex));
}

export function create(st) {
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'force' ? 'force' : 'field';
    const q1 = clamp(fn(q.q1, 3), -5, 5);
    const q2 = clamp(fn(q.q2, 3), -5, 5);
    const d = clamp(fn(q.d, 0.3), 0.2, 0.6);
    const hp = clamp(fn(q.hp, 0.2), 0.1, 0.4);
    const q0 = clamp(fn(q.q0, 1), -5, 5);

    const key = [mode, q1, q2, d, hp, q0].join('|');
    if (key !== last) last = key;

    ctx.clearRect(0, 0, w, h);

    // P 点相对中点的坐标（m）：A = (−d/2, 0)、B = (+d/2, 0)、P = (0, hp)
    const r1 = Math.hypot(d / 2, hp);
    const r2 = r1;
    const P = [0, hp];
    const A = [-d / 2, 0];
    const Bp = [d / 2, 0];

    // 每个电荷在 P 点的场强矢量（N/C）：E = k q (P − r)/|P − r|³
    const ev = (Q, S) => {
      const dx = P[0] - S[0];
      const dy = P[1] - S[1];
      const r = Math.hypot(dx, dy) || 1e-6;
      const kk = (K * Q * 1e-6) / (r * r * r);
      return [kk * dx, kk * dy];
    };
    const E1 = ev(q1, A);
    const E2 = ev(q2, Bp);
    const Es = [E1[0] + E2[0], E1[1] + E2[1]];
    // 力的合成档把场强乘上试探电荷与它的电荷量
    const sc = mode === 'force' ? q0 * 1e-6 : 1;
    const V1 = [E1[0] * sc, E1[1] * sc];
    const V2 = [E2[0] * sc, E2[1] * sc];
    const Vs = [Es[0] * sc, Es[1] * sc];
    const M1 = Math.hypot(V1[0], V1[1]);
    const M2 = Math.hypot(V2[0], V2[1]);
    const Ms = Math.hypot(Vs[0], Vs[1]);
    const isF = mode === 'force';
    const unit = isF ? 'N' : 'N/C';
    const name = isF ? 'F' : 'E';
    const sub1 = name + '₁';
    const sub2 = name + '₂';

    // 夹角与余弦定理核对
    let cosT = 1;
    if (M1 > 1e-30 && M2 > 1e-30) {
      cosT = (V1[0] * V2[0] + V1[1] * V2[1]) / (M1 * M2);
      cosT = clamp(cosT, -1, 1);
    }
    const theta = (Math.acos(cosT) * 180) / Math.PI;
    const theo = Math.sqrt(Math.max(0, M1 * M1 + M2 * M2 + 2 * M1 * M2 * cosT));
    const rms = Math.max(Ms, theo, 1e-30);
    const resid = Math.abs(Ms - theo) / rms;

    /* ── 左栏：两个电荷与 P 点上的三支矢量 ───────────────── */
    const ox = w * 0.24;
    const oy = h * 0.72;
    const perM = w * 0.42; // 每米多少像素
    const ax = ox + A[0] * perM;
    const bx = ox + Bp[0] * perM;
    const px = ox + P[0] * perM;
    const py = oy - P[1] * perM;
    const CR = Math.min(w * 0.028, h * 0.055);

    // 连线与中垂线
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(ax, oy);
    ctx.lineTo(bx, oy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    const charge = (x, y, v, name) => {
      ctx.beginPath();
      ctx.arc(x, y, CR, 0, Math.PI * 2);
      ctx.fillStyle = v >= 0 ? pal.orange : pal.blue;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      label(ctx, v >= 0 ? '+' : '−', x, y, pal.ink, 'center', Math.round(CR * 1.05));
      label(ctx, `${name} = ${fmt(v, 1)} μC`, x, y - CR - 14, pal.ink, 'center', 14);
    };
    charge(ax, oy, q1, 'q₁');
    charge(bx, oy, q2, 'q₂');

    label(ctx, `d = ${fmt(d * 100, 0)} cm`, ox, oy + 22, pal.mut, 'center', 14);
    label(ctx, `h = ${fmt(hp * 100, 0)} cm`, ox - 12, (oy + py) / 2, pal.mut, 'right', 14);

    // P 点与三支矢量（长度按最大一支归到 78 px）
    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(px, py, 5.5, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'P', px + 10, py - 12, pal.purple, 'left', 14);

    const mx = Math.max(M1, M2, Ms, 1e-30);
    const Lp = 78 / mx;
    if (M1 > 1e-30) {
      arrow(ctx, px, py, px + V1[0] * Lp, py - V1[1] * Lp, pal.orange, 2.2);
      label(ctx, sub1, px + V1[0] * Lp * 1.12, py - V1[1] * Lp * 1.12 - 8, pal.orange, 'center', 14);
    }
    if (M2 > 1e-30) {
      arrow(ctx, px, py, px + V2[0] * Lp, py - V2[1] * Lp, pal.cyan, 2.2);
      label(ctx, sub2, px + V2[0] * Lp * 1.12, py - V2[1] * Lp * 1.12 + 14, pal.cyan, 'center', 14);
    }
    if (Ms > 1e-30) {
      arrow(ctx, px, py, px + Vs[0] * Lp, py - Vs[1] * Lp, pal.purple, 2.8);
      label(ctx, isF ? 'F' : 'E', px + Vs[0] * Lp * 1.12, py - Vs[1] * Lp * 1.12, pal.purple, 'center', 16);
    }

    label(
      ctx,
      isF ? '力是矢量：两支库仑力按平行四边形合成，不能把大小直接相加' : '场强是矢量：两电荷在 P 点的场强按平行四边形合成',
      w * 0.04,
      h * 0.13,
      pal.mut,
      'left',
      14,
    );
    if (isF && Math.abs(q0) < 1e-9) {
      label(ctx, 'q₀ = 0：不受库仑力，没有可合成的矢量', w * 0.04, h * 0.13 + 22, pal.faint, 'left', 13);
    }

    /* ── 右栏：平移到同一起点的平行四边形 ───────────────── */
    const cx = w * 0.72;
    const cy = h * 0.60;
    const Lq = 94 / mx;
    if (M1 > 1e-30) arrow(ctx, cx, cy, cx + V1[0] * Lq, cy - V1[1] * Lq, pal.orange, 2.2);
    if (M2 > 1e-30) arrow(ctx, cx, cy, cx + V2[0] * Lq, cy - V2[1] * Lq, pal.cyan, 2.2);
    if (Ms > 1e-30) {
      // 平行四边形的两条补边（虚线）与对角线
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(cx + V1[0] * Lq, cy - V1[1] * Lq);
      ctx.lineTo(cx + Vs[0] * Lq, cy - Vs[1] * Lq);
      ctx.moveTo(cx + V2[0] * Lq, cy - V2[1] * Lq);
      ctx.lineTo(cx + Vs[0] * Lq, cy - Vs[1] * Lq);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      arrow(ctx, cx, cy, cx + Vs[0] * Lq, cy - Vs[1] * Lq, pal.purple, 2.8);
      label(ctx, isF ? 'F = F₁ + F₂' : 'E = E₁ + E₂', cx + Vs[0] * Lq * 1.1, cy - Vs[1] * Lq * 1.1 - 10, pal.purple, 'center', 15);
    }
    // 夹角弧
    if (M1 > 1e-30 && M2 > 1e-30) {
      const a1 = Math.atan2(-V1[1], V1[0]);
      const a2 = Math.atan2(-V2[1], V2[0]);
      let s0 = a1;
      let s1 = a2;
      if (s1 < s0) {
        const t = s0;
        s0 = s1;
        s1 = t;
      }
      const ccw = s1 - s0 > Math.PI;
      ctx.save();
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(cx, cy, 34, s0, s1, ccw);
      ctx.stroke();
      ctx.restore();
      const am = ccw ? s1 + (s0 + Math.PI * 2 - s1) / 2 : (s0 + s1) / 2;
      label(ctx, `θ = ${fmt(theta, 0)}°`, cx + Math.cos(am) * 50, cy + Math.sin(am) * 50, pal.green, 'center', 14);
    }
    label(ctx, '平移到同一起点：补成平行四边形，对角线就是合矢量', cx, cy + 128, pal.faint, 'center', 13);

    st.readout([
      ['场源电荷 q₁', fmt(q1, 1) + ' μC'],
      ['场源电荷 q₂', fmt(q2, 1) + ' μC'],
      ['两电荷间距 d', fmt(d * 100, 1) + ' cm'],
      ['P 到 q₁ 距离 r₁', fmt(r1 * 100, 1) + ' cm'],
      ['P 到 q₂ 距离 r₂', fmt(r2 * 100, 1) + ' cm'],
      [isF ? '试探电荷 q₀' : 'P 点位置', isF ? fmt(q0, 1) + ' μC' : `h = ${fmt(hp * 100, 1)} cm`],
      [sub1, sci(M1) + ' ' + unit],
      [sub2, sci(M2) + ' ' + unit],
      [isF ? '合力 F' : '合场强 E', sci(Ms) + ' ' + unit],
      ['两矢量夹角 θ', fmt(theta, 1) + '°'],
      ['余弦定理合成', sci(theo) + ' ' + unit],
      ['两种算法之差', resid < 1e-9 ? '0' : sci(resid)],
    ]);
  }

  return { frame };
}
