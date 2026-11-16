/* 图 方2 · 可分离变量机：把 x 与 y 各归一边，再两边积分
   ① y'=2xy → y=Ce^(x²)；② y'=y² → y=1/(C−x)；③ y'=y(1−y) → 逻辑斯蒂曲线。
   C 由滑块给，几条陪衬曲线展示同一族；右栏列出分离后的两步积分。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt } from '../../../lib/board.js';

const F = [
  { t: "① $y'=2xy$", y: (x, C) => C * Math.exp(x * x), dec: '$\\dfrac{\\mathrm{d}y}{y}=2x\\,\\mathrm{d}x$', res: '$\\ln|y|=x^2+C_1$', sol: '$y=C\\mathrm{e}^{x^2}$', xr: [-1.4, 1.4], yr: [-1.2, 3.6], xt: [-1, 1], yt: [1, 2, 3] },
  { t: "② $y'=y^2$", y: (x, C) => 1 / (C - x), dec: '$\\dfrac{\\mathrm{d}y}{y^2}=\\mathrm{d}x$', res: '$-\\dfrac1y=x+C_1$', sol: '$y=\\dfrac{1}{C-x}$', xr: [-2.4, 2.4], yr: [-3.4, 3.4], xt: [-2, 2], yt: [-2, 2] },
  { t: "③ $y'=y(1-y)$", y: (x, C) => 1 / (1 + C * Math.exp(-x)), dec: '$\\dfrac{\\mathrm{d}y}{y(1-y)}=\\mathrm{d}x$', res: '$\\ln\\left|\\dfrac{y}{1-y}\\right|=x+C_1$', sol: '$y=\\dfrac{1}{1+C\\mathrm{e}^{-x}}$', xr: [-3, 3], yr: [-0.5, 1.6], xt: [-2, 2], yt: [1] },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, C: 1.0, x0: 0.4 };
  const cC = B.chipM('常数 C'), cY = B.chipM('解在 x₀'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k], C = st.C, x0 = st.x0;
    const m = B.mapFit(S.xr[0], S.xr[1], S.yr[0], S.yr[1], [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: S.xt, yt: S.yt });
    [0.4, 0.7, 1.5, 2.4].forEach((c, i) => {
      if (Math.abs(c - C) < 1e-6) return;
      B.plot(x => S.y(x, c), m, { stroke: '#ff9e4a', 'stroke-width': 1.1, 'stroke-opacity': .22, pad: 6 });
    });
    B.plot(x => S.y(x, C), m, { stroke: '#5cadff', 'stroke-width': 2.3, anchors: [x0], pad: 6 });
    const y = S.y(x0, C);
    if (isFinite(y)) {
      B.dot(V(m.px(x0), m.py(y)), 5.3, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
      B.tex(V(m.px(x0) + 8, m.py(y) - 12), `$y=${fmt(y, 3)}$`, { size: 11.5, anchor: 'start', color: '#ffd166' });
    }

    B.textM(V(636, 84), '分离变量', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 122), S.dec, { size: 12, color: '#ff9e4a', anchor: 'start', w: 240 });
    B.tex(V(636, 164), S.res, { size: 12, color: '#aebdd2', anchor: 'start', w: 240 });
    B.tex(V(636, 206), S.sol, { size: 12.5, color: '#5cadff', anchor: 'start', w: 240 });
    B.textM(V(636, 250), '两边积分后由 C 定出具体一条', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 292), `$C=${fmt(C, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });

    cC(`$=${fmt(C, 2)}$`);
    cY(Number.isFinite(y) ? `$=${fmt(y, 3)}$` : '无定义');
    cJ('拖动 $C$：整族曲线换高度；拖动 $x_0$：同一条曲线上换一点读数，方程给出的斜率始终对得上');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('C =', 0.3, 2.6, 0.01, st.C, v => { st.C = v; B.render(); }, 'C');
  B.slider('x₀ =', -2, 2, 0.01, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.hintM('把 $\\mathrm{d}y$ 与 $y$ 归一边、$\\mathrm{d}x$ 与 $x$ 归一边，两边各积一次即得通解');
  B.render();
  return B;
}
