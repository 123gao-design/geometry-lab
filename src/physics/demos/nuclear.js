/* 原5 核反应与核能。
   两档：比结合能档按半经验公式铺出 E/A 随质量数 A 的曲线，拖 A 读这一种核的比结合能、
   总结合能与质量亏损，裂变与聚变都朝铁峰爬升；链式反应档按增殖系数 k 画出逐代增殖的中子树，
   同时给出累计裂变次数与放出的能量。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

const U_EV = 931.5;          // 1 u 的质量亏损对应 931.5 MeV
const A_MIN = 2, A_MAX = 240;
const GEN = 9;               // 链式反应最多画到第 9 代
const GEN_T = 0.75;          // 每一代用 0.75 s 长出来
const HOLD = 2.2;            // 长满后停一会儿再重放
const E_PER = 200;           // 一次铀核裂变约放出 200 MeV

/** 稳定核的电荷数近似：Z = A / (2 + 0.015 A^(2/3)) */
const zOf = A => A / (2 + 0.015 * Math.pow(A, 2 / 3));

/** 比结合能（MeV）：Bethe–Weizsäcker 公式除以 A，只留体积、表面、库仑、对称四项 */
function bpa(A) {
  const Z = zOf(A);
  const vol = 15.75;
  const surf = 17.8 * Math.pow(A, -1 / 3);
  const coul = 0.711 * Z * Z / Math.pow(A, 4 / 3);
  const asym = 23.7 * Math.pow(A - 2 * Z, 2) / (A * A);
  return vol - surf - coul - asym;
}

/** 曲线的峰（铁峰附近），模块加载时算一次 */
let PEAK = { A: PEAK_A(), B: 0 };
function PEAK_A() {
  let best = { A: 56, B: 0 };
  for (let a = 2; a <= A_MAX; a++) {
    const b = bpa(a);
    if (b > best.B) best = { A: a, B: b };
  }
  return best.A;
}
PEAK = { A: PEAK_A(), B: bpa(PEAK_A()) };

/** 大数的可读写法 */
function big(v) {
  if (v < 1e4) return String(Math.round(v));
  return v.toExponential(2);
}

export function create(st) {
  let T = 0, last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);

    const chain = (q.mode || 'curve') === 'chain';
    const A = clamp(Math.round(fn(q.A, 56)), A_MIN, A_MAX);
    const k = clamp(fn(q.k, 2.5), 0.6, 3);

    const key = [chain ? 'c' : 'k', chain ? k : A].join(',');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    ctx.clearRect(0, 0, w, h);

    /* ══ 比结合能曲线 ═════════════════════════════════ */
    if (!chain) {
      const rect = { x: w * 0.115, y: h * 0.14, w: w * 0.845, h: h * 0.68 };
      const g = panel(ctx, rect, [0, A_MAX], [0, 10], pal, { xlab: 'A', ylab: 'E/A  MeV', nx: 6, ny: 5 });

      // 曲线本体
      const pts = [];
      for (let a = A_MIN; a <= A_MAX; a++) pts.push([a, bpa(a)]);
      poly(ctx, g.X, g.Y, pts, pal.blue, 2.2);

      // 铁峰
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(g.X(PEAK.A), g.Y(0));
      ctx.lineTo(g.X(PEAK.A), g.Y(PEAK.B));
      ctx.stroke();
      ctx.restore();
      label(ctx, `铁峰 A≈${PEAK.A}`, g.X(PEAK.A), g.Y(PEAK.B) - 12, pal.mut, 'center', 12);

      // 两侧向峰爬升的两支箭头
      arrow(ctx, g.X(8), g.Y(3.4), g.X(40), g.Y(8.3), pal.green, 1.8);
      label(ctx, '轻核聚变放能', g.X(6), g.Y(2.9), pal.green, 'left', 12);
      arrow(ctx, g.X(234), g.Y(7.3), g.X(130), g.Y(8.55), pal.orange, 1.8);
      label(ctx, '重核裂变放能', g.X(238), g.Y(8.95), pal.orange, 'right', 12);

      // 当前核
      const bx = bpa(A), bt = bx * A;
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.moveTo(g.X(A), g.Y(0));
      ctx.lineTo(g.X(A), g.Y(bx));
      ctx.moveTo(g.X(0), g.Y(bx));
      ctx.lineTo(g.X(A), g.Y(bx));
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.beginPath();
      ctx.arc(g.X(A), g.Y(bx), 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      label(ctx, `A = ${A}`, g.X(A), g.Y(0) - 8, pal.orange, 'center', 12);

      // 区块判读
      const zone = A < 30 ? '轻核区' : A < 100 ? '中等核（靠近铁峰）' : '重核区';

      st.readout([
        ['质量数 A', String(A)],
        ['核电荷数 Z（稳定核近似）', fmt(zOf(A), 1)],
        ['比结合能 E/A', fmt(bx, 2) + ' MeV'],
        ['总结合能 E', fmt(bt, 1) + ' MeV'],
        ['对应质量亏损 Δm = E/c²', fmt(bt / U_EV, 3) + ' u'],
        ['铁峰比结合能', fmt(PEAK.B, 2) + ' MeV（A≈' + PEAK.A + '）'],
        ['离铁峰还差', fmt(PEAK.B - bx, 2) + ' MeV / 每核子'],
        ['所在区块', zone],
      ]);
      return;
    }

    /* ══ 链式反应 ═════════════════════════════════════ */
    const gens = [1];
    for (let g = 1; g <= GEN; g++) {
      const nx = Math.floor(gens[g - 1] * k + 1e-9);
      gens.push(Math.max(0, nx));
    }

    const cycle = GEN * GEN_T + HOLD;
    const tt = dt > 0 ? T % cycle : Math.min(T, GEN * GEN_T);
    const cur = Math.min(GEN, Math.floor(tt / GEN_T + 1e-9));

    const x0 = w * 0.13, x1 = w * 0.87;
    const y0 = h * 0.13, y1 = h * 0.85;
    const dy = (y1 - y0) / GEN;
    const cx = (x0 + x1) / 2;
    const CAP = 40;                       // 每一代最多画这么多点

    // 先画连线
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    for (let g = 1; g <= cur; g++) {
      const m = gens[g], pm = gens[g - 1];
      const d = Math.min(m, CAP), pd = Math.min(pm, CAP);
      const stepC = Math.min((x1 - x0) / Math.max(d, 1), 56);
      const stepP = Math.min((x1 - x0) / Math.max(pd, 1), 56);
      for (let i = 0; i < d; i++) {
        const px = cx + (Math.floor((i * pd) / d) - (pd - 1) / 2) * stepP;
        const py = y0 + (g - 1) * dy;
        const qx = cx + (i - (d - 1) / 2) * stepC;
        const qy = y0 + g * dy;
        ctx.beginPath();
        ctx.moveTo(px, py + 4);
        ctx.lineTo(qx, qy - 4);
        ctx.stroke();
      }
    }
    ctx.restore();

    // 再画中子
    for (let g = 0; g <= cur; g++) {
      const m = gens[g];
      const d = Math.min(m, CAP);
      const step = Math.min((x1 - x0) / Math.max(d, 1), 56);
      const y = y0 + g * dy;
      const hot = g === cur && tt - cur * GEN_T < 0.28;
      for (let i = 0; i < d; i++) {
        const x = cx + (i - (d - 1) / 2) * step;
        ctx.save();
        ctx.fillStyle = g === 0 ? pal.orange : pal.blue;
        if (hot) ctx.globalAlpha = 0.75 + 0.25 * Math.sin((tt - cur * GEN_T) * 40);
        ctx.beginPath();
        ctx.arc(x, y, g === 0 ? 5 : 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // 行标
      const tag = m > d ? `第 ${g} 代 · ${big(m)} 个${d < m ? '（只画前 ' + d + '）' : ''}` : `第 ${g} 代 · ${big(m)} 个`;
      label(ctx, tag, x0 - 10, y + 4, g === cur ? pal.orange : pal.mut, 'right', 12);
    }

    // 首行标注中子源
    label(ctx, '中子', cx, y0 - 14, pal.orange, 'center', 12);
    label(ctx, '每一次裂变放出若干个中子，中子又去引发下一次裂变', w * 0.5, h * 0.94, pal.mut, 'center', 12);

    let cum = 0;
    for (let g = 0; g < cur; g++) cum += gens[g];
    const total = cum + gens[cur];
    const judge = k > 1.001 ? 'k > 1，链式反应持续' : k > 0.999 ? 'k = 1，恰好临界' : 'k < 1，反应逐渐熄灭';

    st.readout([
      ['增殖系数 k', fmt(k, 1)],
      ['已到第几代', String(cur)],
      ['这一代中子数', big(gens[cur])],
      ['累计裂变次数', big(cum)],
      ['累计放出能量', big(cum * E_PER) + ' MeV'],
      ['折合焦耳', cum > 0 ? big(cum * E_PER * 1.602e-13) + ' J' : '—'],
      ['判读', judge],
    ]);
  }

  return { frame };
}
