/* 图 微2b · 链式法则机：两段速率相乘
   复合运算分两层：内层 u=g(x)、外层 y=f(u)。左边画 u 对 x 的切线斜率 du/dx，
   右边画 y 对 u 的切线斜率 dy/du；x 走 1 个单位，u 走 du/dx 个单位，y 再走 dy/du 倍，
   所以 y 对新变量的变化率是两段斜率相乘。右栏用差分数值复核这个乘积。
   版面：左图 44..384 × 74..324，右图 470..810 × 74..324，底部一行链式算式。 */
import { Board, V, fmt } from '../../../lib/board.js';

const F = [
  { t: '① $y=\\sqrt{u}$', f: u => Math.sqrt(u), df: u => 0.5 / Math.sqrt(u), yv: [0.6, 3.2], name: '\\sqrt{u}' },
  { t: '② $y=\\ln u$', f: u => Math.log(u), df: u => 1 / u, yv: [-0.1, 2.2], name: '\\ln u' },
  { t: '③ $y=u^2$', f: u => u * u, df: u => 2 * u, yv: [0, 54], name: 'u^2' },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, x: 1.4 };
  const cU = B.chipM('du/dx'), cY = B.chipM('dy/du'), cP = B.chipM('乘积'), cN = B.chipM('复核');

  B.renderFn = () => {
    const S = F[st.k], x0 = st.x, u0 = x0 * x0 + 1;
    const du = 2 * x0, dy = S.df(u0), prod = du * dy;

    /* ---------- 左图：u = x²+1 对 x ---------- */
    const mL = B.isoFit(0, 2.8, 0.4, 8.4, [44, 74, 340, 250], 12);
    B.grid({ ...mL, sx: 1, sy: 2, lx: 1, ly: 2, xt: [1, 2], yt: [2, 4, 6, 8], axLab: 'x', ayLab: 'u' });
    B.plot(x => x * x + 1, mL, { stroke: '#5cadff', 'stroke-width': 2.2, x0: 0.1, x1: 2.85, anchors: [x0] });
    B.tex(V(60, 58), '$u=g(x)=x^2+1$', { size: 12.5, color: '#5cadff', anchor: 'start' });

    const clipSeg = (m, px0, py0, kk, at) => {
      let ax = m.X0, bx = m.X1;
      if (Math.abs(kk) > 1e-9) {
        const xA = px0 + (m.Y0 - py0) / kk, xB = px0 + (m.Y1 - py0) / kk;
        ax = Math.max(ax, Math.min(xA, xB));
        bx = Math.min(bx, Math.max(xA, xB));
      }
      return B.seg(V(m.px(ax), m.py(py0 + kk * (ax - px0))), V(m.px(bx), m.py(py0 + kk * (bx - px0))), at);
    };
    clipSeg(mL, x0, u0, du, { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '7 5' });
    B.dot(V(mL.px(x0), mL.py(u0)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(mL.px(x0) + 10, mL.py(u0) - 10), `斜率 $${fmt(du, 3)}$`, { size: 11.5, color: '#a06226', anchor: 'start' });

    /* ---------- 右图：y = f(u) ---------- */
    const mR = B.mapFit(0.4, 8.4, S.yv[0], S.yv[1], [470, 74, 340, 250], 12);
    B.grid({ ...mR, sx: 1, sy: 100, lx: 2, ly: 100, xt: [2, 4, 6, 8], yt: [], axLab: 'u', ayLab: 'y' });
    B.plot(S.f, mR, { stroke: '#4ade80', 'stroke-width': 2.2, x0: 0.45, x1: 8.4, anchors: [u0] });
    B.tex(V(486, 58), `$y=f(u)=${S.name}$`, { size: 12.5, color: '#4ade80', anchor: 'start' });
    clipSeg(mR, u0, S.f(u0), dy, { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '7 5' });
    B.dot(V(mR.px(u0), mR.py(S.f(u0))), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(mR.px(u0) + 10, mR.py(S.f(u0)) - 10), `斜率 $${fmt(dy, 3)}$`, { size: 11.5, color: '#a06226', anchor: 'start' });

    // 两幅图之间的引导箭头：x → u → y
    B.tex(V(426, 190), '$x$', { size: 12.5, color: '#93a1b5' });
    B.tex(V(426, 216), '$\\to$', { size: 13, color: '#93a1b5' });
    B.tex(V(426, 242), '$u$', { size: 12.5, color: '#93a1b5' });
    B.tex(V(426, 290), '$\\to$', { size: 13, color: '#93a1b5' });
    B.tex(V(426, 316), '$y$', { size: 12.5, color: '#93a1b5' });

    // 底部：链式算式与数值
    B.tex(V(44, 372), `$\\dfrac{dy}{dx}=\\dfrac{dy}{du}\\cdot\\dfrac{du}{dx}=${fmt(dy, 3)}\\times${fmt(du, 3)}=${fmt(prod, 4)}$`,
      { size: 14, color: '#aebdd2', anchor: 'start' });
    B.tex(V(44, 410), `$u_0=g(x_0)=${fmt(u0, 3)}$，其中 $x_0=${fmt(x0, 2)}$`, { size: 12.5, color: '#93a1b5', anchor: 'start' });

    cU(`$=g'(${fmt(x0, 2)})=${fmt(du, 4)}$`);
    cY(`$=f'(${fmt(u0, 3)})=${fmt(dy, 4)}$`);
    cP(`$=${fmt(prod, 4)}$`);
    // 复核：直接对复合函数作中心差分
    const eps = 1e-4, G = x => S.f(x * x + 1);
    const num = (G(x0 + eps) - G(x0 - eps)) / (2 * eps);
    cN(`数值 ${fmt(num, 4)}，差 ${fmt(Math.abs(num - prod), 6)}`, 'ok');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('x₀ =', 0.45, 2.5, 0.01, st.x, v => { st.x = v; B.render(); }, 'x');
  B.hintM('两段放大的倍数相乘：横轴每走 1，$u$ 走 $du/dx$；$u$ 再走 $dy/du$ 倍就是 $y$ 的增量');
  B.render();
  return B;
}
