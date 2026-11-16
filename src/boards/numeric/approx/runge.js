/* 图 逼2 · 插值多项式与龙格现象
   f(x)=1/(1+25x²) 在 [−1,1] 上光滑，但用等距节点的插值多项式去追它，节点加密以后两端反而越抖越凶。
   这是龙格现象：高次多项式在等距节点上并不收敛。改用切比雪夫节点（向两端变密），抖动立刻压下去。 */
import { Board, V, mk } from '../../../lib/board.js';

const f = x => 1 / (1 + 25 * x * x);

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { n: 6, cheb: false };
  const cE = B.chipM('节点数'), cM = B.chipM('最大偏离'), cX = B.chipM('偏差最大的位置'), cJ = B.chipM('判读');

  const m = B.mapFit(-1.08, 1.08, -1.2, 3.0, [56, 52, 640, 300], 16);

  const nodes = n => {
    const N = n + 1;
    return Array.from({ length: N }, (_, i) => (st.cheb
      ? Math.cos((2 * i + 1) * Math.PI / (2 * N))
      : -1 + 2 * i / n));
  };
  const lagrange = (xs, ys, x) => {
    let s = 0;
    for (let i = 0; i < xs.length; i++) {
      let t = ys[i];
      for (let j = 0; j < xs.length; j++) if (j !== i) t *= (x - xs[j]) / (xs[i] - xs[j]);
      s += t;
    }
    return s;
  };

  B.renderFn = () => {
    const xs = nodes(st.n), ys = xs.map(f);
    const P = x => lagrange(xs, ys, x);
    B.grid({ ...m, sx: .25, sy: .5, lx: .25, ly: .5 });
    B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.plot(P, m, { stroke: '#ffd166', 'stroke-width': 1.8 });

    // 节点：落在曲线上的小圈
    xs.forEach((x, i) => {
      B.dot(V(m.px(x), m.py(ys[i])), 3.6, { fill: '#0a0d14', stroke: '#c084fc', 'stroke-width': 1.6 });
    });

    // 采样找最大偏离
    let mx = 0, ax = 0;
    for (let i = 0; i <= 600; i++) {
      const x = -1 + 2 * i / 600, d = Math.abs(P(x) - f(x));
      if (d > mx) { mx = d; ax = x; }
    }
    const yy = P(ax);
    if (Math.abs(yy) <= m.Y1) {
      B.dyn.appendChild(mk('line', { x1: m.px(ax), y1: m.py(f(ax)), x2: m.px(ax), y2: m.py(yy), stroke: '#ff7b8a', 'stroke-width': 2 }, B.dyn));
      B.dot(V(m.px(ax), m.py(yy)), 4.5, { fill: '#ff7b8a' });
      B.textM(V(m.px(ax), m.py(yy) - 10), '偏离最大', { 'font-size': 11, fill: '#ff7b8a' });
    }

    // 右栏
    B.textM(V(720, 70), st.cheb ? '切比雪夫节点' : '等距节点', { 'font-size': 13, fill: '#c084fc', 'text-anchor': 'start' });
    B.textM(V(720, 98), `节点 $n+1=${st.n + 1}$`, { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(720, 140), '$f$ 蓝曲线', { 'font-size': 13, fill: '#5cadff', 'text-anchor': 'start' });
    B.textM(V(720, 168), '$P_n$ 金曲线', { 'font-size': 13, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(720, 212), '节点处两线相交', { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(720, 230), '节点间看多项式', { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'start' });

    cE(`$${st.n + 1}$`);
    cM(`$${mx.toFixed(3)}$`);
    cX(`$${ax.toFixed(2)}$`);
    cJ(st.cheb
      ? '节点向两端加密，两端的抖动被压住，整条多项式跟着曲线走'
      : st.n >= 8 ? '节点加密，两端反而抖得更凶——高次等距插值不收敛，这是龙格现象'
        : '节点还稀，多项式在两端已经露出上翘的苗头');
  };

  B.slider('区间份数 n', 2, 12, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.toggleBtn('切比雪夫节点', false, on => { st.cheb = on; B.render(); });

  B.hint('间隔数从 4 推到 12：金线两端翘得更高；打开切比雪夫节点，抖动立刻收住');
  B.render();
  return B;
}
