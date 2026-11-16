/* 图 方3 · 一阶线性方程机：齐次解 + 一个特解
   y'+P(x)y=Q(x) 的通解 = 齐次通解 Ce^(−∫P) + 一个特解。
   三条曲线并排：紫线是齐次解，橙线是特解，蓝线是两者相加的通解。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt } from '../../../lib/board.js';

const F = [
  {
    t: "① $y'+y=1$", P: '1', Q: '1', xr: [-0.6, 4.2], yr: [-1.6, 3.4], xt: [1, 2, 3, 4], yt: [1, 2, 3],
    par: x => 1, hom: (x, C) => C * Math.exp(-x), y: (x, C) => 1 + C * Math.exp(-x),
    sol: '$y=1+C\\mathrm{e}^{-x}$', mu: '$\\mu=\\mathrm{e}^{x}$',
  },
  {
    t: "② $y'-y=\\mathrm{e}^{2x}$", P: '-1', Q: '$\\mathrm{e}^{2x}$', xr: [-1.2, 1.4], yr: [-1.4, 4.6], xt: [-1, 1], yt: [1, 2, 3, 4],
    par: x => Math.exp(2 * x), hom: (x, C) => C * Math.exp(x), y: (x, C) => Math.exp(2 * x) + C * Math.exp(x),
    sol: '$y=\\mathrm{e}^{2x}+C\\mathrm{e}^{x}$', mu: '$\\mu=\\mathrm{e}^{-x}$',
  },
  {
    t: "③ $y'+\\frac{y}{x}=1$", P: '$1/x$', Q: '1', xr: [0.2, 4.4], yr: [-1.6, 3.6], xt: [1, 2, 3, 4], yt: [1, 2, 3],
    par: x => x / 2, hom: (x, C) => C / x, y: (x, C) => x / 2 + C / x,
    sol: '$y=\\dfrac{x}{2}+\\dfrac{C}{x}$', mu: '$\\mu=x$',
  },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, C: 1.2, x0: 1.2 };
  const cY = B.chipM('通解在 x₀'), cH = B.chipM('齐次解'), cP = B.chipM('特解'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k], C = st.C, x0 = st.x0;
    const m = B.mapFit(S.xr[0], S.xr[1], S.yr[0], S.yr[1], [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: S.xt, yt: S.yt });
    B.plot(x => S.hom(x, C), m, { stroke: '#c084fc', 'stroke-width': 1.8, 'stroke-dasharray': '6 4', pad: 8 });
    B.plot(S.par, m, { stroke: '#ff9e4a', 'stroke-width': 1.8, 'stroke-dasharray': '6 4', pad: 8 });
    B.plot(x => S.y(x, C), m, { stroke: '#5cadff', 'stroke-width': 2.4, anchors: [x0], pad: 8 });
    const yv = S.y(x0, C), yh = S.hom(x0, C), yp = S.par(x0);
    B.dot(V(m.px(x0), m.py(yv)), 5.3, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.seg(V(m.px(x0), m.py(0)), V(m.px(x0), m.py(yv)), { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });

    B.textM(V(636, 84), '通解 = 齐次解 + 特解', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 122), `$y'+P(x)y=Q(x)$`, { size: 12, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 158), `$P=${S.P},\\ Q=${S.Q}$`, { size: 12, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 196), `$\\mu=${S.mu}$`, { size: 12, color: '#c084fc', anchor: 'start' });
    B.tex(V(636, 236), S.sol, { size: 12.5, color: '#5cadff', anchor: 'start', w: 240 });
    B.textM(V(636, 278), '紫：齐次　橙：特解　蓝：相加', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 318), `$x_0=${fmt(x0, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });

    cY(Number.isFinite(yv) ? `$=${fmt(yv, 3)}$` : '无定义');
    cH(Number.isFinite(yh) ? `$=${fmt(yh, 3)}$` : '无定义');
    cP(Number.isFinite(yp) ? `$=${fmt(yp, 3)}$` : '无定义');
    cJ('拖 $C$：紫线随之换一条，蓝线跟着平移同样的量 —— 这就是「齐次通解加一个特解」');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('C =', -2, 3, 0.01, st.C, v => { st.C = v; B.render(); }, 'C');
  B.slider('x₀ =', 0.4, 3, 0.01, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.hintM('先解齐次方程得紫线，再猜一个特解得橙线，两者相加就是通解');
  B.render();
  return B;
}
