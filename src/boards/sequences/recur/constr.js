/* 图 递2 · 构造法机
   a_{n+1}=p a_n+q 的平衡点是 x=q/(1−p)（解方程 x=px+q）。把数列整体平移 x：
   b_n=a_n−x，则 b_{n+1}=p b_n —— 上下两栏的点形状完全相同，只是竖直位置差一个常数 x。
   数列的走向（收敛、发散、摆动）由 p 的绝对值决定。
   局部坐标：上栏 rect=[64,56,700,140]，下栏 rect=[64,246,700,140]。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { p: 2, q: 1, a1: 1, grid: true, labs: true };
  const PRE = [
    { nm: '① p=2', p: 2, q: 1, a1: 1 },
    { nm: '② p=1/2', p: 0.5, q: 1, a1: 1 },
    { nm: '③ p=−1', p: -1, q: 4, a1: 1 },
  ];
  const nice = v => { const p = 10 ** Math.floor(Math.log10(v)); const r = v / p; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p; };
  const seqOf = () => {
    const a = [st.a1];
    for (let k = 1; k < 8; k++) a.push(st.p * a[k - 1] + st.q);
    return a;
  };
  const fixed = () => (Math.abs(1 - st.p) < 1e-9 ? null : st.q / (1 - st.p));
  const cRec = B.chipM('递推式'), cFix = B.chipM('不动点'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const a = seqOf(), x = fixed();
    // 上栏：a_n
    const lo1 = Math.min(0, ...a), hi1 = Math.max(0, ...a), p1 = (hi1 - lo1) * .1 + .5;
    const m1 = B.mapFit(0.4, 8.6, lo1 - p1, hi1 + p1, [64, 56, 700, 140], 0);
    B.grid({ ...m1, sx: 1, sy: nice((hi1 - lo1) / 4), lx: 1, ly: nice((hi1 - lo1) / 4),
      xt: [1, 2, 3, 4, 5, 6, 7, 8], axLab: 'n', ayLab: 'a', grid: st.grid, labs: st.labs });
    if (x !== null) {
      B.seg(V(m1.px(0.4), m1.py(x)), V(m1.px(8.6), m1.py(x)), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' });
      B.tex(V(64, m1.py(x) - 14), `$x=${fmt(x, 2)}$`, { size: 12, anchor: 'start', color: '#ffd166', w: 100 });
    }
    for (let k = 1; k <= 8; k++) {
      B.seg(V(m1.px(k), m1.py(0)), V(m1.px(k), m1.py(a[k - 1])), { stroke: '#5cadff', 'stroke-width': 1.1, 'stroke-opacity': .35 });
      B.dot(V(m1.px(k), m1.py(a[k - 1])), 4.2, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1 });
    }
    B.tex(V(64, 210), '原数列 $a_n$：点的高矮被 $x$ 抬着', { size: 11.5, anchor: 'start', color: '#93a1b5', w: 320 });
    // 下栏：b_n = a_n − x
    if (x === null) {
      B.tex(V(64, 310), '$p=1$ 时方程无唯一平衡点，构造法退化为等差数列：', { size: 12.5, anchor: 'start', color: '#ff7b8a', w: 600 });
      B.tex(V(64, 336), '$a_n=a_1+(n-1)q$', { size: 13, anchor: 'start', w: 300 });
    } else {
      const b = a.map(v => v - x);
      const lo2 = Math.min(0, ...b), hi2 = Math.max(0, ...b), p2 = (hi2 - lo2) * .12 + .4;
      const m2 = B.mapFit(0.4, 8.6, lo2 - p2, hi2 + p2, [64, 246, 700, 140], 0);
      B.grid({ ...m2, sx: 1, sy: nice((hi2 - lo2) / 3), lx: 1, ly: nice((hi2 - lo2) / 3),
        xt: [1, 2, 3, 4, 5, 6, 7, 8], axLab: 'n', ayLab: 'b', grid: st.grid, labs: st.labs });
      B.seg(V(m2.px(0.4), m2.py(0)), V(m2.px(8.6), m2.py(0)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 5' });
      for (let k = 1; k <= 8; k++)
        B.dot(V(m2.px(k), m2.py(b[k - 1])), 4.2, { fill: '#4ade80', stroke: '#0a0d14', 'stroke-width': 1 });
      // 等比的水平虚线
      for (let k = 1; k <= 8; k++)
        B.seg(V(m2.px(k), m2.py(0)), V(m2.px(k), m2.py(b[k - 1])), { stroke: '#4ade80', 'stroke-width': 1, 'stroke-opacity': .3 });
      B.tex(V(64, 400), '平移后的 $b_n=a_n-x$：点的形状不变、只落到 $x$ 轴两侧，比恒为 $p$', { size: 11.5, anchor: 'start', color: '#93a1b5', w: 600 });
    }
    // 标题
    B.tex(V(64, 30), '把数列整体平移 $x$：$a_{n+1}=pa_n+q$ 变成 $b_{n+1}=pb_n$', { size: 14, anchor: 'start', w: 720 });
    // 徽章
    const qs = st.q >= 0 ? `+${fmt(st.q, 1)}` : `-${fmt(-st.q, 1)}`;
    cRec(`$a_{n+1}=${fmt(st.p, 1)}a_n${qs}$`);
    cFix(x === null ? '$p=1$：无不动点' : `$x=\\dfrac{q}{1-p}=${fmt(x, 2)}$`);
    cJ(x === null ? '退化为等差数列'
      : Math.abs(st.p) < 1 ? '|p|<1：数列趋近不动点'
        : Math.abs(st.p) > 1 ? '|p|>1：数列远离不动点'
          : '|p|=1：不动，或来回摆动');
  };

  const slP = B.slider('p =', -2, 3, 0.5, 2, v => { st.p = v; B.render(); });
  const slQ = B.slider('q =', -3, 3, 0.5, 1, v => { st.q = v; B.render(); });
  B.slider('首项 a₁', -2, 6, 1, 1, v => { st.a1 = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.p = p.p; st.q = p.q; st.a1 = p.a1;
    slP.sync(st.p); slQ.sync(st.q);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('比 |p| 与 1 的大小，决定平移后的点越走越远还是越走越近');
  B.render();
  return B;
}
