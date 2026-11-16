/* 图 等1 · 等差序列机
   等差数列的项落在一条直线上：a_n = a_1 + (n−1)d，斜率就是公差。
   下栏把相邻两项的差画成一排点，它们全部落在同一条水平线上 —— 差分恒定是定义。
   局部坐标：上栏 rect=[64,52,726,238]，下栏 rect=[64,322,726,88]，x 视野 [−0.3, 12.6]。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { a1: 1, d: 2, n: 5, grid: true, labs: true };
  const PRE = [
    { nm: '① 递增', a1: 1, d: 2, jd: '公差 $d>0$，每一项比前一项大' },
    { nm: '② 递减', a1: 10, d: -2, jd: '公差 $d<0$，每一项比前一项小' },
    { nm: '③ 常数列', a1: 3, d: 0, jd: '公差 $d=0$，每一项都相等' },
  ];
  const A = () => Array.from({ length: 12 }, (_, i) => st.a1 + i * st.d);
  const nice = v => { const p = 10 ** Math.floor(Math.log10(v)); const r = v / p; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p; };
  const cT = B.chipM('通项'), cD = B.chipM('公差'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const a = A(), n = st.n;
    const lo = Math.min(0, Math.min(...a) - 1), hi = Math.max(0, Math.max(...a) + 1);
    const m = B.mapFit(-0.3, 12.6, lo, hi, [64, 52, 726, 238], 0);
    const step = nice((hi - lo) / 5);
    B.grid({ ...m, sx: 1, sy: step, lx: 1, ly: step, xt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      axLab: 'n', ayLab: 'a', grid: st.grid, labs: st.labs });
    // 通项放宽到实数：一条直线，斜率 = d
    B.plot(x => st.a1 + (x - 1) * st.d, m, { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '7 6', x0: 0.3, x1: 12.6, n: 8 });
    for (let k = 1; k <= 12; k++) B.dot(V(m.px(k), m.py(a[k - 1])), k === n ? 5 : 4, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.1 });
    // 探针：向两轴作投影垂线
    B.probe(V(n, a[n - 1]), m, { r: 5.2 });
    const right = n <= 8;
    B.tex(V(m.px(n) + (right ? 10 : -10), m.py(a[n - 1]) - 18), `$(${n},\\ ${fmt(a[n - 1], 0)})$`,
      { size: 12.5, anchor: right ? 'start' : 'end', color: '#ffd166', w: 110 });
    // 上下栏之间的标题
    B.tex(V(64, 310), '差分 $a_{k+1}-a_k$：全部落在同一条水平线上', { size: 13.5, anchor: 'start', color: '#93a1b5', w: 500 });
    // 下栏：差分
    const d = st.d;
    const m2 = B.mapFit(1.4, 12.6, Math.min(0, d) - 0.9, Math.max(0, d) + 0.9, [64, 322, 726, 88], 6);
    B.grid({ ...m2, sx: 1, sy: 1, lx: 1, ly: Math.abs(d) >= 1 ? 1 : 0.5, xt: [], axLab: 'k', ayLab: '', grid: st.grid, labs: st.labs });
    B.seg(V(m2.px(1.4), m2.py(d)), V(m2.px(12.6), m2.py(d)), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' });
    for (let k = 2; k <= 12; k++) B.dot(V(m2.px(k), m2.py(d)), 3.6, { fill: '#4ade80', stroke: '#0a0d14', 'stroke-width': 1 });
    B.tex(V(m2.px(1.4) + 4, m2.py(d) - 15), `$d=${fmt(d, 1)}$`, { size: 12, anchor: 'start', color: '#4ade80', w: 90 });
    // 徽章
    cT(`$a_n=${fmt(st.a1, 1)}+(n-1)\\times${fmt(d, 1)}$`);
    cD(`$a_{${n + 1}}-a_{${n}}=${fmt(d, 1)}$`);
    cJ(PRE.find(p => p.a1 === st.a1 && p.d === d)?.jd
      ?? (d > 0 ? '公差为正，数列递增' : d < 0 ? '公差为负，数列递减' : '公差为零，数列是常数列'));
  };

  const slA = B.slider('首项 a₁', -4, 10, 1, 1, v => { st.a1 = v; B.render(); });
  const slD = B.slider('公差 d', -3, 3, 0.5, 2, v => { st.d = v; B.render(); });
  B.slider('n =', 1, 12, 1, 5, v => { st.n = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.a1 = p.a1; st.d = p.d;
    slA.sync(st.a1); slD.sync(st.d);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖 d 看直线转成什么坡度：任意两项的差都等于同一个 d');
  B.render();
  return B;
}
