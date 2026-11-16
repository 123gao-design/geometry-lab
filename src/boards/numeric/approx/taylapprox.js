/* 图 逼1 · 泰勒多项式与余项界
   以 0 为中心把 cos x 展开成 n 阶麦克劳林多项式 Pₙ，上图画 f 与 Pₙ，下图画两者的差。
   差曲线被紫线 |x|^{n+1}/(n+1)! 压住——这就是拉格朗日余项给出的上界。
   每加两项，贴合区间就向外扩一段；离 0 越远，同一阶的多项式越不顶用。 */
import { Board, V, mk } from '../../../lib/board.js';

const f = Math.cos;
const fact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };
const P = (x, n) => {
  let s = 0;
  for (let k = 0; k <= Math.floor(n / 2); k++) s += Math.pow(-1, k) * Math.pow(x, 2 * k) / fact(2 * k);
  return s;
};

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { n: 2, showBound: true };
  const cN = B.chipM('阶数 $n$'), cA = B.chipM('$P_n(2)$'), cF = B.chipM('$\\cos 2$'), cB = B.chipM('余项上界 $x=2$'), cJ = B.chipM('判读');

  const mT = B.mapFit(-4.3, 4.3, -2.3, 2.3, [70, 48, 660, 166], 12);
  const mB = B.mapFit(-4.3, 4.3, 0, 1.9, [70, 244, 660, 104], 10);

  B.renderFn = () => {
    const n = st.n;
    B.grid({ ...mT, sx: 1, sy: 1, lx: 1, ly: 1 });
    B.plot(f, mT, { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.plot(x => P(x, n), mT, { stroke: '#ffd166', 'stroke-width': 2.2 });

    // 误差面板
    B.grid({ ...mB, sx: 1, sy: .5, lx: 1, ly: .5 });
    const e = x => Math.abs(f(x) - P(x, n));
    B.plot(e, mB, { stroke: '#ff7b8a', 'stroke-width': 2 });
    if (st.showBound) {
      B.plot(x => Math.pow(Math.abs(x), n + 1) / fact(n + 1), mB, { stroke: '#c084fc', 'stroke-width': 1.6, 'stroke-dasharray': '6 4' });
    }

    // 探针 x=2：上下两板同一条竖线
    const x0 = 2, yf = f(x0), yp = P(x0, n);
    B.dyn.appendChild(mk('line', { x1: mT.px(x0), y1: mT.py(mT.Y0), x2: mT.px(x0), y2: mB.py(0), stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '4 5', 'stroke-opacity': .6 }, B.dyn));
    B.dot(V(mT.px(x0), mT.py(yf)), 5, { fill: '#5cadff' });
    B.dot(V(mT.px(x0), mT.py(yp)), 5, { fill: '#ffd166' });
    B.dot(V(mB.px(x0), mB.py(e(x0))), 4.5, { fill: '#ff7b8a' });

    // 面板标题
    B.textM(V(80, 62), '曲线与多项式', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(80, 258), '差的绝对值', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(730, 62), '$\\cos x$', { 'font-size': 15, fill: '#5cadff', 'text-anchor': 'start' });
    B.textM(V(730, 86), `$P_{${n}}(x)$`, { 'font-size': 15, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(80, 376), '$|\\cos x-P_n(x)|$：曲线与多项式之差', { 'font-size': 12, fill: '#ff7b8a', 'text-anchor': 'start' });
    B.textM(V(470, 376), '$|x|^{n+1}/(n+1)!$：余项上界', { 'font-size': 12, fill: '#c084fc', 'text-anchor': 'start' });

    const bb = Math.pow(2, n + 1) / fact(n + 1);
    cN(`$${n}$`);
    cA(`$${yp.toFixed(4)}$`);
    cF(`$${yf.toFixed(4)}$`);
    cB(`$${bb.toFixed(4)}$`);
    cJ(e(2) < 1e-3 ? '在 x=2 处多项式与曲线已经重合到小数点后三位，误差比上界小得多'
      : n < 4 ? '阶数低，只在 0 附近一小段贴合，往外差得很快'
        : '加阶数就是往 0 附近不断对齐导数，越靠近 0 误差越小，远处仍靠上界说话');
  };

  B.slider('阶数 n', 0, 10, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.toggleBtn('余项界', true, on => { st.showBound = on; B.render(); });

  B.hint('拖动阶数：金色多项式每贴近一次曲线，下面的红差就被压得更低');
  B.render();
  return B;
}
