/* 图 递1 · 累加累乘机
   一阶递推 a_{n+1} = a_n + f(n) 把每步的增量竖着叠起来：左图的绿色竖段就是各步的 f(k)，
   上下相接正好凑成 a_{n+1}−a_1；取和即得通项。累乘同理，把加换成乘、竖段换成比值。
   局部坐标：图区 rect=[56,64,460,272]，右栏 x∈[536,844]。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 450;
  const B = new Board(root, W, H);
  const st = { mode: 0, a1: 1, n: 6, grid: true, labs: true };
  const MODES = [
    {
      nm: '① 差为 k', kind: 'add',
      term: k => st.a1 + (k - 1) * k / 2,
      step: k => k,
      rate: k => `f(${k})=${k}`,
      sumTxt: n => `$1+2+\\dots+${n}=\\dfrac{${n}\\times${n + 1}}{2}=${n * (n + 1) / 2}$`,
      gen: '$a_n=a_1+\\dfrac{(n-1)n}{2}$',
    },
    {
      nm: '② 差为 2k−1', kind: 'add',
      term: k => st.a1 + (k - 1) ** 2,
      step: k => 2 * k - 1,
      rate: k => `f(${k})=${2 * k - 1}`,
      sumTxt: n => `$1+3+\\dots+${2 * n - 1}=${n}^2=${n * n}$`,
      gen: '$a_n=a_1+(n-1)^2$',
    },
    {
      nm: '③ 比为 (k+1)/k', kind: 'mul',
      term: k => st.a1 * k,
      step: k => (k + 1) / k,
      rate: k => `g(${k})=\\dfrac{${k + 1}}{${k}}`,
      sumTxt: n => `$\\dfrac{2}{1}\\cdot\\dfrac{3}{2}\\cdots\\dfrac{${n + 1}}{${n}}=${n + 1}$`,
      gen: '$a_n=a_1\\cdot n$',
    },
  ];
  const M = () => MODES[st.mode];
  const nice = v => { const p = 10 ** Math.floor(Math.log10(v)); const r = v / p; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p; };
  const cRec = B.chipM('递推式'), cSum = B.chipM('求和'), cGen = B.chipM('通项');

  B.renderFn = () => {
    const md = M(), n = st.n;
    const pts = Array.from({ length: 9 }, (_, i) => md.term(i + 1));
    const lo = Math.min(0, Math.min(...pts)), hi = Math.max(...pts);
    const m = B.mapFit(0.4, 9.6, lo - (hi - lo) * .1 - .5, hi + (hi - lo) * .1 + .5, [56, 64, 460, 272], 0);
    B.grid({ ...m, sx: 1, sy: nice((hi - lo) / 5), lx: 1, ly: nice((hi - lo) / 5),
      xt: [1, 2, 3, 4, 5, 6, 7, 8, 9], axLab: 'k', ayLab: 'a', grid: st.grid, labs: st.labs });
    // 各步的增量（绿竖段）或比值
    for (let k = 1; k <= 8; k++) {
      B.seg(V(m.px(k + 1), m.py(md.term(k))), V(m.px(k + 1), m.py(md.term(k + 1))),
        { stroke: '#4ade80', 'stroke-width': 2, 'stroke-opacity': .85 });
    }
    // 折线与点
    for (let k = 1; k <= 8; k++)
      B.seg(V(m.px(k), m.py(pts[k - 1])), V(m.px(k + 1), m.py(pts[k])), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '5 5', 'stroke-opacity': .8 });
    for (let k = 1; k <= 9; k++) B.dot(V(m.px(k), m.py(pts[k - 1])), k === n + 1 ? 5 : 3.8, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1 });
    // 首项与第 n+1 项的高度差
    if (n + 1 <= 9) {
      B.seg(V(m.px(1), m.py(pts[0])), V(m.px(n + 1), m.py(pts[0])), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4' });
      B.tex(V(m.px(n + 1) + 6, m.py((pts[0] + pts[n]) / 2)), `$${fmt(pts[n] - pts[0], 2)}$`,
        { size: 11.5, anchor: 'start', color: '#ffd166', w: 80 });
    }
    B.tex(V(56, 360), md.kind === 'add' ? '绿竖段 = 每一步的差；首尾相接即总增量' : '绿竖段 = 每一步的比；连乘即第 n+1 项与首项之比',
      { size: 11.5, anchor: 'start', color: '#93a1b5', w: 450 });
    // 标题
    B.tex(V(56, 32), md.kind === 'add' ? '把每一步的差加起来：中间各项两两相消' : '把每一步的比乘起来：分子分母错位相消',
      { size: 14.5, anchor: 'start', w: 460 });
    // 右栏
    const L = (y, s, o = {}) => B.tex(V(536, y), s, { size: o.size || 12, anchor: 'start', w: 300, color: o.color });
    if (md.kind === 'add') {
      L(80, '递推式逐项写出：', { color: '#93a1b5', size: 11.5 });
      L(106, '$a_2-a_1=f(1)$');
      L(130, '$a_3-a_2=f(2)$');
      L(154, '$\\vdots$');
      L(178, '$a_{n+1}-a_n=f(n)$');
      L(212, '全部相加，中间两两相消，', { size: 11.5 });
      L(236, '左边只剩 $a_{n+1}-a_1$');
      L(266, '$a_{n+1}=a_1+\\sum_{k=1}^{n}f(k)$', { color: '#ffd166', size: 12.5 });
      L(298, md.sumTxt(n), { size: 11.5 });
      L(330, md.gen, { size: 13, color: '#ffd166' });
    } else {
      L(80, '递推式逐项写出：', { color: '#93a1b5', size: 11.5 });
      L(106, '$a_2/a_1=g(1)$');
      L(130, '$a_3/a_2=g(2)$');
      L(154, '$\\vdots$');
      L(178, '$a_{n+1}/a_n=g(n)$');
      L(212, '全部相乘，分子分母错位相消，', { size: 11.5 });
      L(236, '左边只剩 $a_{n+1}/a_1$');
      L(266, '$a_{n+1}=a_1\\prod_{k=1}^{n}g(k)$', { color: '#ffd166', size: 12.5 });
      L(298, md.sumTxt(n), { size: 11.5 });
      L(330, md.gen, { size: 13, color: '#ffd166' });
    }
    // 徽章
    cRec(md.kind === 'add' ? `$a_{n+1}-a_n=${st.mode === 0 ? 'n' : '2n-1'}$` : '$\\dfrac{a_{n+1}}{a_n}=\\dfrac{n+1}{n}$');
    cSum(md.sumTxt(n));
    cGen(md.gen);
  };

  const slA = B.slider('首项 a₁', -3, 6, 1, 1, v => { st.a1 = v; B.render(); });
  B.slider('n =', 1, 8, 1, 6, v => { st.n = v; B.render(); });
  const btns = MODES.map((mo, i) => B.btn(mo.nm, () => {
    st.mode = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('换三种递推式：中间项相加（乘）都相消，只剩下首末两端');
  B.render();
  return B;
}
