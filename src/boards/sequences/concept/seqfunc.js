/* 图 数1 · 数列散点机
   数列 aₙ = f(n) 定义在正整数集上，图象是 (n, aₙ) 的一串孤立点；把通项放宽到实数，
   点就沿一条曲线排开（金色虚线）。五种预设的 y 量级相差很大（1/n 到 2ⁿ），横纵各用各的比例尺。
   局部坐标：图区 rect = [56, 58, 770, 292]，x 视野固定 [−0.25, 12.7]。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 430;
  const B = new Board(root, W, H);
  const st = { mode: 0, n: 3, curve: true, grid: true, labs: true };
  const PRE = [
    { nm: '① $a_n=2n-1$', ex: '$a_n=2n-1$', f: n => 2 * n - 1, ya: -2, yb: 26, N: 12, jd: '递增，没有上界' },
    { nm: '② $a_n=n^2$', ex: '$a_n=n^2$', f: n => n * n, ya: -6, yb: 97, N: 12, jd: '递增，增长越来越快' },
    { nm: '③ $a_n=2^n$', ex: '$a_n=2^n$', f: n => 2 ** n, ya: -22, yb: 300, N: 8, jd: '递增，每项是前一项的两倍' },
    { nm: '④ $a_n=\\dfrac{1}{n}$', ex: '$a_n=\\dfrac{1}{n}$', f: n => 1 / n, ya: -0.12, yb: 1.06, N: 12, jd: '递减，有上界 1，趋近于 0' },
    { nm: '⑤ $a_n=(-1)^n\\dfrac{1}{n}$', ex: '$a_n=(-1)^n\\dfrac{1}{n}$', f: n => (n % 2 ? -1 : 1) / n, ya: -0.62, yb: 0.62, N: 12, jd: '正负交替，趋近于 0' },
  ];
  const nice = v => { const p = 10 ** Math.floor(Math.log10(v)); const r = v / p; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p; };
  const fit = () => { const p = PRE[st.mode]; return B.mapFit(-0.25, 12.7, p.ya, p.yb, [56, 58, 770, 292], 0); };
  const cT = B.chipM('通项'), cV = B.chipM('第 n 项'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const p = PRE[st.mode], m = fit();
    const n = Math.min(st.n, p.N);          // 预设的点只画到 N，探针与滑块一并夹回
    const step = nice((p.yb - p.ya) / 6);
    B.grid({ ...m, sx: 1, sy: step, lx: 1, ly: step, xt: Array.from({ length: p.N }, (_, i) => i + 1),
      grid: st.grid, labs: st.labs });
    // 放宽定义域后的曲线
    if (st.curve && st.mode !== 4)
      B.plot(p.f, m, { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '7 6', x0: 0.25, x1: 12.6, n: 220, pad: 8 });
    // 孤立点
    for (let k = 1; k <= p.N; k++)
      B.dot(V(m.px(k), m.py(p.f(k))), 4.6, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.1 });
    // 探针：向两轴作投影垂线直读坐标
    const yv = p.f(n);
    B.probe(V(n, yv), m, { r: 5.2 });
    const right = n <= 8;
    B.tex(V(m.px(n) + (right ? 10 : -10), m.py(yv) - 18), `$(${n},\\ ${fmt(yv, 2)})$`,
      { size: 12.5, anchor: right ? 'start' : 'end', color: '#ffd166', w: 130 });
    // 标题
    B.tex(V(56, 24), p.nm, { size: 15.5, anchor: 'start', w: 260 });
    B.tex(V(826, 24), st.mode === 4 ? '正负交替：$(-1)^n$ 只在整数序号处有定义'
      : st.curve ? '金色虚线：把通项放宽到实数后连成的曲线' : '点集 $\\{(n,a_n)\\}$',
      { size: 12.5, anchor: 'end', color: '#93a1b5', w: 330 });
    // 徽章
    cT(p.ex);
    cV(`$a_{${n}}=${fmt(yv, 2)}$`);
    cJ(p.jd);
  };

  const btns = PRE.map((p, i) => B.btnM(p.nm, () => {
    st.mode = i; st.n = Math.min(st.n, p.N);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    togCurve.set(i !== 4);
    sl.setAttribute('max', p.N);
    sl.sync(st.n);
    B.render();
  }, { on: i === 0 }));
  const togCurve = B.toggleBtnM('曲线', true, on => { st.curve = on; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);

  const sl = B.slider('n =', 1, 12, 1, 3, v => { st.n = v; B.render(); });

  B.hint('拖 n 沿点列移动：每个 n 只对应一个点，相邻两个点之间没有定义');
  B.render();
  return B;
}
