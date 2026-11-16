/* 图 放3 · 夹逼放缩机：证明式最后一步的三件工具
   模式一「裂项凑项」：Σ 1/k² 不易求，用 1/k² < 1/(k−1)k = 1/(k−1) − 1/k 逐项放大，
       错位相消后整列恰为 1 + (1−1/n) = 2 − 1/n，于是 Σ1/k² < 2−1/n < 2。
   模式二「逐项夹逼」：S_n = Σ k/(n²+k)，每项夹在 k/(n²+n) ≤ · ≤ k/n²，
       求和得 ½ ≤ S_n ≤ ½+1/(2n)，两端同时贴住 ½，夹逼出极限 ½。
   模式三「二项舍项」：(1+1/n)ⁿ 按二项定理展开，舍去 k≥2 的非负项得下界 2；
       k=2 项 C(n,2)/n² 严格为正，故 n≥2 时严格大于 2，极限即 e。
   三法都含等号检验：取等位置（或极限处）须单独交代。
   局部坐标约定：柱底基线 y=340（模式一/三），量程分别 0..2、0..2.9；模式二用水平夹条
   x∈[90,790] 代表累积和值 0..0.9。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 440;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { p: 0, n: 5, labs: true };
  const cS = B.chipM('读数'), cT = B.chipM('界'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const n = st.n;
    if (st.p === 0) {
      /* ---------- 模式一 裂项凑项 ---------- */
      const y0 = 340, S = 130, spanW = 744, x0 = 88;
      const X = k => x0 + (k - 1) * (spanW / (Math.max(n - 1, 1)));
      const w = Math.max(8, Math.min(46, spanW / (Math.max(n - 1, 1)) - 6));
      let sum = 0;
      for (let k = 1; k <= n; k++) sum += 1 / (k * k);
      const ub = 2 - 1 / n;
      for (let k = 1; k <= n; k++) {
        const g = 1 / (k * k), b = k >= 2 ? 1 / (k * (k - 1)) : 0;
        mk('rect', { x: X(k) - w / 2, y: y0 - g * S, width: w, height: g * S, fill: '#ffd166', 'fill-opacity': .9 }, B.dyn);
        if (b > 1e-4) mk('rect', { x: X(k) - w / 2, y: y0 - b * S, width: w, height: b * S, fill: '#5cadff', 'fill-opacity': .3 }, B.dyn);
      }
      if (st.labs) {
        B.seg(V(x0 - 2, y0 - ub * S), V(858, y0 - ub * S), { stroke: '#ff7b8a', 'stroke-width': 1.3, 'stroke-dasharray': '6 4' });
        B.seg(V(x0 - 2, y0 - 2 * S), V(858, y0 - 2 * S), { stroke: '#c084fc', 'stroke-width': 1.3, 'stroke-dasharray': '6 4' });
        B.text(V(848, y0 - ub * S - 7), '上界 2−1/n = ' + f1(ub), { 'font-size': 12, fill: '#ff7b8a', 'text-anchor': 'end' });
        B.text(V(848, y0 - 2 * S + 17), '极限 2', { 'font-size': 12, fill: '#c084fc', 'text-anchor': 'end' });
        B.textM(V(x0, y0 + 18), '金柱：$1/k^2$   蓝柱：$1/(k(k-1))$', { 'font-size': 12, fill: '#93a1b5' });
      }
      B.tex(V(430, 34), `$S_n=\\sum_{k=1}^{n}\\tfrac{1}{k^2}$（金柱）逐项小于 $1+\\sum_{k=2}^{n}\\tfrac{1}{k(k-1)}$（蓝柱）`, { size: 14, anchor: 'mid' });
      B.textM(V(430, 60), '$k\\ge2$ 时 $1/k^2<1/(k-1)k$，错位相消后蓝列恰为 $2-1/n$ —— 放大列是显式可求和的', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
      cS(`$S_n=${f1(sum)}$`);
      cT(`$2-\\tfrac1n=${f1(ub)}$`);
      cJ(`逐项放大 $\\tfrac1{k^2}<\\tfrac1{k(k-1)}$（$k\\ge2$）后错位相消：$S_n<2-\\tfrac1n<2$，放大严格取不到等号，$n\\to\\infty$ 时上界趋于 $\\zeta(2)=2$ 型下 2`);
    } else if (st.p === 1) {
      /* ---------- 模式二 逐项夹逼：水平夹条 ---------- */
      const scale = .9, X = v => 90 + v / scale * 700;
      let s = 0; for (let k = 1; k <= n; k++) s += k / (n * n + k);
      const ub = 1 / 2 + 1 / (2 * n);
      mk('rect', { x: X(0), y: 208, width: X(s) - X(0), height: 32, fill: '#ffd166', 'fill-opacity': .85 }, B.dyn);
      if (st.labs) {
        let acc = 0;
        for (let k = 1; k <= n; k++) { acc += k / (n * n + k); B.seg(V(X(acc), 202), V(X(acc), 246), { stroke: '#7a5a30', 'stroke-width': .9 }); }
        B.seg(V(X(.5), 196), V(X(.5), 258), { stroke: '#4ade80', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' });
        B.seg(V(X(ub), 196), V(X(ub), 258), { stroke: '#ff7b8a', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' });
        B.text(V(X(.5), 186), '下界 ½', { 'font-size': 12, fill: '#4ade80', 'text-anchor': 'middle' });
        B.text(V(X(ub) - 6, 286), '上界 ½+1/(2n) = ' + f1(ub), { 'font-size': 12, fill: '#ff7b8a', 'text-anchor': 'end' });
      }
      B.tex(V(430, 34), `$S_n=\\sum_{k=1}^{n}\\dfrac{k}{n^2+k}$（金条长）夹在 ½ 与 $\\tfrac12+\\tfrac1{2n}$ 两线之间`, { size: 14, anchor: 'mid' });
      B.textM(V(430, 60), '每项 $k/(n^2+n)\\le k/(n^2+k)\\le k/n^2$，累加后用 $1+2+\\cdots+n=n(n+1)/2$ 求和，两端同时贴住 $\\tfrac{1}{2}$', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
      cS(`$S_n=${f1(s)}$`);
      cT(`$\\tfrac12+\\tfrac1{2n}=${f1(ub)}$`);
      cJ(`$\\tfrac{n(n+1)}{2(n^2+n)}=\\tfrac12\\le S_n\\le\\tfrac{n(n+1)}{2n^2}=\\tfrac12+\\tfrac1{2n}$，下界恰好等于 $\\tfrac12$，上界随 $n$ 增大压向 $\\tfrac12$：$\\lim S_n=\\tfrac12$`);
    } else {
      /* ---------- 模式三 二项舍项 ---------- */
      const y0 = 340, S = 92;
      const w = Math.max(8, Math.min(52, 700 / (n + 1)));
      const X = k => 96 + k * w + w / 2;
      const C = (a, b) => {
        let r = 1; for (let i = 0; i < b; i++) r = r * (a - i) / (i + 1); return r;
      };
      const terms = [];
      for (let k = 0; k <= n; k++) terms.push(C(n, k) / Math.pow(n, k));
      const val = Math.pow(1 + 1 / n, n);
      for (let k = 0; k <= n; k++) {
        const v = terms[k];
        const col = k <= 1 ? '#ff9e4a' : '#5cadff';
        mk('rect', { x: X(k) - w / 2, y: y0 - v * S, width: w, height: v * S, fill: col, 'fill-opacity': k <= 1 ? .95 : .3 }, B.dyn);
        if (st.labs && k <= 1) B.tex(V(X(k), y0 - v * S - 12), '$1$', { size: 13, anchor: 'mid', color: '#ff9e4a' });
      }
      if (st.labs) {
        B.seg(V(86, y0 - 2 * S), V(858, y0 - 2 * S), { stroke: '#4ade80', 'stroke-width': 1.4, 'stroke-dasharray': '6 4' });
        B.seg(V(86, y0 - val * S), V(858, y0 - val * S), { stroke: '#c084fc', 'stroke-width': 1.3, 'stroke-dasharray': '6 4' });
        B.text(V(848, y0 - 2 * S + 16), '下界 = 首两项 = 2（绿线）', { 'font-size': 12, fill: '#4ade80', 'text-anchor': 'end' });
        B.text(V(848, y0 - val * S - 7), '完整展开和（紫线）', { 'font-size': 12, fill: '#c084fc', 'text-anchor': 'end' });
        B.text(V(96, y0 + 18), '橙柱：k=0、1 项（各 1）；蓝柱：k≥2 的非负项', { 'font-size': 12, fill: '#93a1b5' });
      }
      B.tex(V(430, 34), `$\\left(1+\\tfrac1n\\right)^n = \\sum_{k=0}^{n} \\binom{n}{k}\\tfrac{1}{n^k}$ 的各项`, { size: 14, anchor: 'mid' });
      B.textM(V(430, 60), '舍去 $k\\ge2$ 的非负项只剩首两项 $1+1=2$ —— 下界；完整和更高，差正是被舍各项之和', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
      cS(`$\\left(1+\\tfrac1n\\right)^n=${f1(val)}$`);
      cT('$1+1=$首两项之和 $2$');
      cJ(`舍掉 $k\\ge2$ 的非负项得下界 $2$；$\\binom{n}2\\tfrac1{n^2}=\\tfrac{n-1}{2n}>0$（$n\\ge2$），故严格大于 $2$；$n=1$ 时 $(1+1)^1=2$ 取等`);
    }
  };

  const modeBtns = ['裂项凑项', '逐项夹逼', '二项舍项'].map((name, i) => B.btnM(name, () => {
    st.p = i; modeBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['labs']);
  const sN = B.slider('n =', 2, 20, 1, 5, v => { st.n = v; B.render(); });

  B.hint('放大列逐项包住原列、上下两线夹住和、舍去非负项得下界 —— 三法都别漏等号检验');
  B.render();
  return B;
}