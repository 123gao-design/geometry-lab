/* 图 热1b：分子间的作用力与分子势能。
   左栏两只分子按 r = RC + A·sin(2πT/9) 的节律一近一远地振动：r < r₀ 时斥力占优
   （橙箭头向外），r > r₀ 时引力占优（蓝箭头向内），r = r₀ 时两力相抵、合力为零。
   右栏把两条曲线摊开——上图分子力 F–r 在 r₀ 处穿过零点、在 r ≈ 1.09 r₀ 处有最大引力；
   下图分子势能 Ep–r 在 r₀ 处落到最低（F = −dEp/dr，谷底正对力的零点），零点约定取在 r → ∞。
   模型取 F = (r₀/r)^13 − (r₀/r)^7、Ep = (r₀/r)^12/12 − (r₀/r)^6/6，显示时分别乘 5 与 10，
   于是读数落成 10⁻¹² N 与 10⁻²¹ J 的量级。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const RC = 1.3;          // 振动的中心间距（r₀ 单位）
const PERIOD = 9;        // 一个来回的时长，秒
const XR0 = 0.85, XR1 = 3.2;
const YR1 = [-1.6, 8.4]; // 分子力面板的纵轴范围（10⁻¹² N）
const YR2 = [-1.4, 1.6]; // 分子势能面板的纵轴范围（10⁻²¹ J）

const Fof = r => (1 / r) ** 13 - (1 / r) ** 7;              // 力的模型式，r = 1 处为零
const Eof = r => (1 / r) ** 12 / 12 - (1 / r) ** 6 / 6;     // 势能的模型式，r = 1 处取最低 −1/12

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const amp = clamp(fn(q.amp, 0.35), 0.05, 0.45);
    const key = String(amp);
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const r = RC + amp * Math.sin((2 * Math.PI * T) / PERIOD);
    const fv = 5 * Fof(r);      // 显示单位：10⁻¹² N
    const ev = 10 * Eof(r);     // 显示单位：10⁻²¹ J

    ctx.clearRect(0, 0, w, h);

    /* ── 左栏：两只分子 ───────────────────── */
    const cx = w * 0.235;
    const y0 = h * 0.30;
    const Rm = Math.min(w * 0.030, h * 0.062);
    const S = w * 0.135;                       // 每 r₀ 折合的像素长
    const sep = r * S;
    const xa = cx - sep / 2;
    const xb = cx + sep / 2;
    const gap = sep - 2 * Rm;

    spot(ctx, xa, y0, Rm, pal.purple, pal.bg2);
    spot(ctx, xb, y0, Rm, pal.purple, pal.bg2);
    label(ctx, 'A', xa, y0, pal.bg2, 'center', 15);
    label(ctx, 'B', xb, y0, pal.bg2, 'center', 15);

    // 合力箭头：斥力向外（橙）、引力向内（蓝）；极端处（r 离 r₀ 很近）不画
    if (Math.abs(fv) >= 0.05) {
      const Lp = clamp(14 + 22 * Math.min(Math.abs(fv), 2.2), 14, 46);
      if (fv > 0) {
        const Lf = Lp;
        arrow(ctx, xa - Rm, y0, xa - Rm - Lf, y0, pal.orange, 2.5);
        arrow(ctx, xb + Rm, y0, xb + Rm + Lf, y0, pal.orange, 2.5);
      } else {
        const Lf = Math.min(Lp, Math.max(10, gap * 0.45));
        arrow(ctx, xa + Rm, y0, xa + Rm + Lf, y0, pal.blue, 2.5);
        arrow(ctx, xb - Rm, y0, xb - Rm - Lf, y0, pal.blue, 2.5);
      }
    }

    // 间距 r：从圆心垂下来的两条细虚线 + 一支双向箭头
    const yd = y0 + Rm + 26;
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(xa, y0 + Rm);
    ctx.lineTo(xa, yd);
    ctx.moveTo(xb, y0 + Rm);
    ctx.lineTo(xb, yd);
    ctx.stroke();
    ctx.restore();
    const mid = (xa + xb) / 2;
    arrow(ctx, mid, yd, xa, yd, pal.mut, 1.6);
    arrow(ctx, mid, yd, xb, yd, pal.mut, 1.6);
    label(ctx, `r = ${fmt(r, 2)} r₀`, mid, yd + 15, pal.mut, 'center', 13);

    // 此刻的关系：斥力、引力还是相抵
    const near = Math.abs(fv) < 0.06;
    const stat = near
      ? 'r ≈ r₀：引力与斥力相抵，合力为零'
      : fv > 0
        ? 'r < r₀：斥力大于引力，分子相互推开'
        : 'r > r₀：引力大于斥力，分子相互拉近';
    label(ctx, stat, cx, h * 0.50, near ? pal.green : pal.ink, 'center', 14);

    const notes = [
      '① r = r₀ 处合力为零，分子势能落到最低；',
      '② 势能零点约定取在 r → ∞ 处；',
      '③ r₀ 约 3.8 × 10⁻¹⁰ m，只有分子直径的量级。',
    ];
    notes.forEach((s, i) => label(ctx, s, w * 0.05, h * 0.60 + i * 23, pal.mut, 'left', 13));

    /* ── 右栏：F–r 与 Ep–r ───────────────── */
    const rc1 = { x: w * 0.46, y: h * 0.10, w: w * 0.50, h: h * 0.36 };
    const rc2 = { x: w * 0.46, y: h * 0.60, w: w * 0.50, h: h * 0.32 };
    const g1 = panel(ctx, rc1, [XR0, XR1], YR1, pal, { ylab: 'F/10⁻¹² N', nx: 5, ny: 5 });
    const g2 = panel(ctx, rc2, [XR0, XR1], YR2, pal, { xlab: 'r/r₀', ylab: 'Ep/10⁻²¹ J', nx: 5, ny: 5 });
    label(ctx, '分子间作用力 F–r（橙 斥力 / 蓝 引力）', rc1.x + 2, rc1.y - 14, pal.mut, 'left', 13);
    label(ctx, '分子势能 Ep–r（零点取在 r → ∞）', rc2.x + 2, rc2.y - 14, pal.mut, 'left', 13);

    const N = 360;
    // 分子力：r < r₀ 的斥力支画橙、r > r₀ 的引力支画蓝
    const repPts = [], attPts = [];
    for (let i = 0; i <= N; i++) {
      const rr = XR0 + ((1 - XR0) * i) / N;
      repPts.push([rr, 5 * Fof(rr)]);
    }
    for (let i = 0; i <= N; i++) {
      const rr = 1 + ((XR1 - 1) * i) / N;
      attPts.push([rr, 5 * Fof(rr)]);
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(rc1.x, rc1.y, rc1.w, rc1.h);
    ctx.clip();
    poly(ctx, g1.X, g1.Y, repPts, pal.orange, 2.2);
    poly(ctx, g1.X, g1.Y, attPts, pal.blue, 2.2);
    ctx.restore();

    // 分子势能
    const epPts = [];
    for (let i = 0; i <= N; i++) {
      const rr = XR0 + ((XR1 - XR0) * i) / N;
      epPts.push([rr, 10 * Eof(rr)]);
    }
    ctx.save();
    ctx.beginPath();
    ctx.rect(rc2.x, rc2.y, rc2.w, rc2.h);
    ctx.clip();
    poly(ctx, g2.X, g2.Y, epPts, pal.purple, 2.2);
    ctx.restore();

    // r₀ 处的竖直参考线，两条小字标在轴上方、线的右侧
    [
      [g1, rc1],
      [g2, rc2],
    ].forEach(([g, rc]) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(rc.x, rc.y, rc.w, rc.h);
      ctx.clip();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.X(1), rc.y);
      ctx.lineTo(g.X(1), rc.y + rc.h);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'r₀', g.X(1) + 7, g.ay - 14, pal.mut, 'left', 13);
    });

    // 两个特殊点：最大引力（空心蓝圈）与势能最低（空心紫圈）
    const rmin = Math.pow(13 / 7, 1 / 6);      // ≈ 1.0886 r₀
    const ring = (g, rc, x, yv, color) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(rc.x, rc.y, rc.w, rc.h);
      ctx.clip();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(g.X(x), g.Y(yv), 4.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };
    ring(g1, rc1, rmin, 5 * Fof(rmin), pal.blue);
    ring(g2, rc2, 1, 10 * Eof(1), pal.purple);
    label(ctx, '势能最低', g2.X(1) - 10, g2.Y(-0.95), pal.purple, 'right', 13);

    // 当前间距：绿色竖虚线 + 两枚跟着走的点
    const live = (g, rc, val, yr, color) => {
      if (r < XR0 || r > XR1) return;
      ctx.save();
      ctx.beginPath();
      ctx.rect(rc.x, rc.y, rc.w, rc.h);
      ctx.clip();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = pal.green;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(g.X(r), rc.y);
      ctx.lineTo(g.X(r), rc.y + rc.h);
      ctx.stroke();
      ctx.restore();
      if (val > yr[1] || val < yr[0]) return;
      spot(ctx, g.X(r), g.Y(val), 4.6, color, pal.bg2);
    };
    live(g1, rc1, fv, YR1, pal.orange);
    live(g2, rc2, ev, YR2, pal.purple);

    /* ── 读数 ───────────────────────────────── */
    st.readout([
      ['分子间距 r', fmt(r, 2) + ' r₀'],
      ['平衡距离 r₀', '≈ 3.8 × 10⁻¹⁰ m'],
      ['此刻分子力', near ? 'r ≈ r₀，为零' : fv > 0 ? '斥力（r < r₀）' : '引力（r > r₀）'],
      ['分子力 F', fmt(fv, 2) + ' × 10⁻¹² N'],
      ['最大引力', '≈ 1.12 × 10⁻¹² N（r ≈ 1.09 r₀）'],
      ['分子势能 Ep', fmt(ev, 2) + ' × 10⁻²¹ J'],
      ['Ep 最低点', '−0.83 × 10⁻²¹ J（r = r₀）'],
      ['势能零点', '取在 r → ∞ 处'],
    ]);
  }

  return { frame };
}
