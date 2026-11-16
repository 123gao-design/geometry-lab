/* 图 比1 · 等比序列机
   a_n=a_1q^{n-1}：项的绝对值按公比缩放，q>0 时落在指数曲线上，q<0 时正负交替、没有实曲线。
   下栏把相邻两项的比画成一排点，全部停在 y=q 的水平线上 —— 比恒定是定义。
   局部坐标：上栏 rect=[64,52,726,238]，下栏 rect=[64,322,726,88]，x 视野 [−0.3, 12.6]。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { a1: 2, q: 2, n: 5, grid: true, labs: true };
  const PRE = [
    { nm: '① q=2', a1: 1, q: 2, jd: '$q>1$，各项同号递增' },
    { nm: '② q=0.5', a1: 8, q: 0.5, jd: '$0<q<1$，各项递减、趋近 0' },
    { nm: '③ q=−1.5', a1: 2, q: -1.5, jd: '$q<0$，正负交替，绝对值变大' },
    { nm: '④ q=1', a1: 3, q: 1, jd: '$q=1$，各项相等' },
  ];
  const A = () => Array.from({ length: 12 }, (_, i) => st.a1 * st.q ** i);
  const nice = v => { const p = 10 ** Math.floor(Math.log10(v)); const r = v / p; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p; };
  const cT = B.chipM('通项'), cQ = B.chipM('公比'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const a = A(), n = st.n;
    const lo = Math.min(0, Math.min(...a) - 1), hi = Math.max(0, Math.max(...a) + 1);
    const m = B.mapFit(-0.3, 12.6, lo, hi, [64, 52, 726, 238], 0);
    const step = nice((hi - lo) / 5);
    B.grid({ ...m, sx: 1, sy: step, lx: 1, ly: step, xt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      axLab: 'n', ayLab: 'a', grid: st.grid, labs: st.labs });
    // q>0 时通项可放宽为实曲线；q<0 只连折线
    if (st.q > 0) {
      B.plot(x => st.a1 * st.q ** (x - 1), m, { stroke: '#ffd166', 'stroke-width': 1.5, 'stroke-dasharray': '7 6', x0: 0.4, x1: 12.4, n: 160 });
    } else {
      for (let k = 1; k < 12; k++)
        B.seg(V(m.px(k), m.py(a[k - 1])), V(m.px(k + 1), m.py(a[k])), { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '4 5', 'stroke-opacity': .75 });
    }
    for (let k = 1; k <= 12; k++) B.dot(V(m.px(k), m.py(a[k - 1])), k === n ? 5 : 4, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.1 });
    B.probe(V(n, a[n - 1]), m, { r: 5.2 });
    const right = n <= 8;
    B.tex(V(m.px(n) + (right ? 10 : -10), m.py(a[n - 1]) - 18), `$(${n},\\ ${fmt(a[n - 1], 2)})$`,
      { size: 12.5, anchor: right ? 'start' : 'end', color: '#ffd166', w: 120 });
    // 下栏：相邻项的比
    B.tex(V(64, 310), '相邻两项的比 $a_{k+1}/a_k$：全部落在同一条水平线上', { size: 13.5, anchor: 'start', color: '#93a1b5', w: 560 });
    const q = st.q;
    const m2 = B.mapFit(1.4, 12.6, Math.min(0, q) - 0.9, Math.max(0, q) + 0.9, [64, 322, 726, 88], 6);
    B.grid({ ...m2, sx: 1, sy: 1, lx: 1, ly: Math.abs(q) >= 1 ? 1 : 0.5, xt: [], axLab: 'k', ayLab: '', grid: st.grid, labs: st.labs });
    B.seg(V(m2.px(1.4), m2.py(q)), V(m2.px(12.6), m2.py(q)), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' });
    for (let k = 2; k <= 12; k++) B.dot(V(m2.px(k), m2.py(q)), 3.6, { fill: '#4ade80', stroke: '#0a0d14', 'stroke-width': 1 });
    B.tex(V(m2.px(1.4) + 4, m2.py(q) - 15), `$q=${fmt(q, 1)}$`, { size: 12, anchor: 'start', color: '#4ade80', w: 90 });
    // 徽章
    cT(`$a_n=${fmt(st.a1, 1)}\\times${fmt(st.q, 1)}^{\\,n-1}$`);
    cQ(`$\\dfrac{a_{${n + 1}}}{a_{${n}}}=${fmt(st.q, 2)}$`);
    cJ(PRE.find(p => p.a1 === st.a1 && p.q === st.q)?.jd
      ?? (st.q > 1 ? '$|q|>1$，各项的绝对值越来越大' : st.q > 0 && st.q < 1 ? '$0<q<1$，各项的绝对值越来越小'
        : st.q === 1 ? '$q=1$，各项相等' : st.q === 0 ? '$q=0$，从第二项起全为 0' : '$q<0$，正负交替'));
  };

  const slA = B.slider('首项 a₁', -2, 6, 1, 2, v => { st.a1 = v; B.render(); });
  const slQ = B.slider('公比 q', -2, 3, 0.5, 2, v => { st.q = v; B.render(); });
  B.slider('n =', 1, 12, 1, 5, v => { st.n = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.a1 = p.a1; st.q = p.q;
    slA.sync(st.a1); slQ.sync(st.q);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖 q 越过 0 与 1：正负交替、逐渐归零、越乘越大三种走向');
  B.render();
  return B;
}
