/* 图 V7 · 平方和积分机：从 Σk² 到 ∫x²dx —— 离散金字塔 ÷n³ 变连续矩形和。
   上栏（像素区 y≤291）：离散平方塔，第 k 根条高 ∝ k²，基线 y=262、条区 x∈[120,800]；
   下栏（y≥327）：[0,1] 上的 y=x²，右端点矩形宽 1/n、高 (k/n)² —— 与上栏同一轮廓、逐列对齐。
   两栏共用列位（k 格同 x），缩比关系一眼可见：R_n=(1/n³)Σk²=(n+1)(2n+1)/(6n²)=1/3+1/(2n)+1/(6n²)→1/3。
   下栏映射：px=120+680x、py=540−190y（各向比例尺，量纲不同的双面板先例 C4）；绿区=精确面积 1/3，金矩形=黎曼和（右端点高估）。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { parameterRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 560;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');
  const st = { n: 8, grid: true, labs: true };

  // 上栏离散平方塔
  const TOP_BASE = 262, TOP_H = 190, X_L = 120, X_R = 800;
  // 下栏 [0,1] 映射
  const px = x => X_L + (X_R - X_L) * x, py = y => 540 - 190 * y;
  const M = { px, py, X0: -0.176, X1: 1.06, Y0: -0.10, Y1: 1.12 };

  const cF = B.readout('平方和'), cR = B.readout('黎曼和', 'gold');
  const cE = B.readout('精确积分', 'green'), cL = B.readout('黎曼和与积分之差', 'violet');
  const cZ = B.chipM('极限判读');

  B.renderFn = () => {
    syncPreset();
    const n = st.n, slot = (X_R - X_L) / n;
    // 上栏
    B.note('上图 $k^2$', '#5cadff');
    B.seg(V(X_L - 10, TOP_BASE), V(X_R + 10, TOP_BASE), { stroke: '#8fa3bd', 'stroke-width': 1.8 });
    let S = 0;
    for (let k = 1; k <= n; k++) {
      S += k * k;
      const h = TOP_H * (k / n) * (k / n), xL = X_L + (k - 1) * slot, w = Math.max(Math.min(52, slot * 0.82), 2);
      mk('rect', { x: xL + (slot - w) / 2, y: TOP_BASE - h, width: w, height: h, fill: '#5cadff', 'fill-opacity': .38, stroke: '#5cadff', 'stroke-width': 1.2 }, B.dyn);
      if (st.labs) {
        if (n <= 12 || k % 5 === 0) B.text(V(xL + slot / 2, TOP_BASE + 16), String(k), { 'font-size': 10.5, fill: '#5c6a80', 'text-anchor': 'middle' });
        if (n <= 8) B.text(V(xL + slot / 2, TOP_BASE - h - 9), String(k * k), { fill: '#5cadff' });
      }
    }
    // 下栏
    B.note('下图右端点矩形', '#ffd166');
    B.grid({ ...M, grid: st.grid, labs: st.labs, sx: 0.25, sy: 0.25, lx: 0.5, ly: 0.5, axLab: 'x', ayLab: 'y' });
    // 绿区：曲线下精确面积 1/3
    const xs = [];
    for (let x = 0; x <= 1.001; x += 0.02) xs.push(x);
    let d = `M ${px(0)} ${py(0)} `;
    for (const x of xs) d += `L ${px(x).toFixed(1)} ${py(x * x).toFixed(1)} `;
    d += `L ${px(1)} ${py(0)} Z`;
    mk('path', { d, fill: '#4ade80', 'fill-opacity': .3, stroke: 'none' }, B.dyn);
    // 金矩形：右端点黎曼和（高估，多出的金边就是 1/(2n)+1/(6n²)）
    for (let k = 1; k <= n; k++) {
      const h = (k / n) * (k / n);
      mk('rect', { x: px((k - 1) / n), y: py(h), width: (X_R - X_L) / n, height: 190 * h, fill: '#ffd166', 'fill-opacity': .22, stroke: '#ffd166', 'stroke-width': 1.3 }, B.dyn);
    }
    // 曲线 y=x²（蓝）
    let dc = `M ${px(0)} ${py(0)} `;
    for (const x of xs) dc += `L ${px(x).toFixed(1)} ${py(x * x).toFixed(1)} `;
    mk('path', { d: dc, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    // 右端点采样点（橙）
    if (st.labs && n <= 24) for (let k = 1; k <= n; k++)
      B.dot(V(px(k / n), py((k / n) * (k / n))), 2.4, { fill: B.diagramColors.orange });

    // 徽章
    const R = (n + 1) * (2 * n + 1) / (6 * n * n), diff = R - 1 / 3;
    B.glowPoints([[V(px(1), py(1)), B.diagramColors.gold]]);
    cF(`$S_n=\\sum_{k=1}^{n}k^2=${S}$`);
    cZ('$R_n=S_n/n^3$，右端点和从上方逼近积分。');
    cR(`$R_n\\approx${fmt(R, 4)}$`);
    cL(`$R_n-1/3\\approx${fmt(diff, 4)}$`);
    cE('$\\int_0^1x^2\\,dx=1/3$');
  };

  let autoOn = false, autoBtn = null, fr = 0;
  const tick = () => {
    if (!autoOn) return;
    fr++;
    if (fr % 16 === 0) {
      st.n = Math.min(st.n * 2, 60);
      sl.sync(st.n); B.render();
      if (st.n >= 60) { autoOn = false; autoBtn.set(false); }
    }
    if (autoOn) B.raf(tick);
  };
  autoBtn = B.toggleBtn('⏩ n 逐级翻倍', false, on => { autoOn = on; fr = 0; if (on) B.raf(tick); else B.cancelRaf(); });
  const sl = B.slider('份数 n', 1, 60, 1, 8, v => { st.n = Math.round(v); B.render(); }, undefined, v => `$n=${Number(v)}$`);
  B.graphToggles(st, ['grid', 'labs']);
  const syncPreset = parameterRow(B, '选择分割份数', [
    { name: '手算', formula: '$n=4$', values: { n: 4 } },
    { name: '比较', formula: '$n=8$', values: { n: 8 } },
    { name: '细分', formula: '$n=60$', values: { n: 60 } },
  ], st, { n: sl });
  B.render();
  return B;
}
