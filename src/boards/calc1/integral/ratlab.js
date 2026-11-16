/* 图 积4 · 有理函数积分机：部分分式拆开再逐项积
   ① 1/(x²−1) = ½[1/(x−1) − 1/(x+1)]，右支；
   ② 1/(x(x+1)) = 1/x − 1/(x+1)；
   ③ (x²+1)/(x−1) = x+1 + 2/(x−1)（假分式先除）。
   蓝线是原式，橙、紫是拆出来的每一项；每一项叠加回去与原式严丝合缝。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt } from '../../../lib/board.js';

const P = [
  {
    t: '① $\\frac{1}{x^2-1}$', name: '$\\dfrac{1}{x^2-1}$',
    f: x => 1 / (x * x - 1), terms: [x => 0.5 / (x - 1), x => -0.5 / (x + 1)],
    dec: '$=\\dfrac{1/2}{x-1}-\\dfrac{1/2}{x+1}$',
    ans: '$\\dfrac12\\ln\\left|\\dfrac{x-1}{x+1}\\right|+C$',
    xs: [1.34, 3.2], yr: [-0.62, 1.22], gap: [1.34, 3.2],
  },
  {
    t: '② $\\frac{1}{x(x+1)}$', name: '$\\dfrac{1}{x(x+1)}$',
    f: x => 1 / (x * (x + 1)), terms: [x => 1 / x, x => -1 / (x + 1)],
    dec: '$=\\dfrac1x-\\dfrac1{x+1}$',
    ans: '$\\ln\\dfrac{x}{x+1}+C$',
    xs: [0.46, 3.4], yr: [-0.52, 1.42], gap: [0.46, 3.4],
  },
  {
    t: '③ $\\frac{x^2+1}{x-1}$', name: '$\\dfrac{x^2+1}{x-1}$',
    f: x => (x * x + 1) / (x - 1), terms: [x => x + 1, x => 2 / (x - 1)],
    dec: '$=x+1+\\dfrac{2}{x-1}$',
    ans: '$\\dfrac{x^2}{2}+x+2\\ln|x-1|+C$',
    xs: [1.3, 3.4], yr: [-1.2, 7], gap: [1.3, 3.4],
  },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, x0: 2.0, on: true };
  const cA = B.chipM('原式'), cB = B.chipM('逐项和'), cD = B.chipM('差值'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = P[st.k], x0 = st.x0;
    const m = B.mapFit(S.xs[0] - 0.12, S.xs[1], S.yr[0], S.yr[1], [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1 });
    // 每条拆出来的项单独画（超出视野自动抬笔）
    S.terms.forEach((t, i) => B.plot(t, m, { stroke: i ? '#c084fc' : '#ff9e4a', 'stroke-width': 1.5, 'stroke-dasharray': '6 4', pad: 4 }));
    B.plot(S.f, m, { stroke: '#5cadff', 'stroke-width': 2.4, anchors: [x0] });

    const y = S.f(x0);
    const ya = S.terms[0](x0), yb = S.terms[1] ? S.terms[1](x0) : 0;
    B.dot(V(m.px(x0), m.py(y)), 5.2, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.seg(V(m.px(x0), m.py(0)), V(m.px(x0), m.py(y)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '3 4' });
    B.tex(V(m.px(x0) + 6, m.py(y) - 12), `$${fmt(y, 3)}$`, { size: 11.5, anchor: 'start', color: '#ffd166' });

    B.textM(V(636, 84), '把分式拆成最简分式之和', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 124), S.name, { size: 13, color: '#5cadff', anchor: 'start' });
    B.tex(V(636, 178), S.dec, { size: 11.5, color: '#ff9e4a', anchor: 'start', w: 240 });
    B.tex(V(636, 226), S.ans, { size: 11.5, color: '#aebdd2', anchor: 'start', w: 240 });
    B.textM(V(636, 268), '每项积出来都是 ln 或幂', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 306), `$x_0=${fmt(x0, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.tex(V(636, 340), `$\\sum=${fmt(ya + yb, 3)}$`, { size: 12, color: '#c084fc', anchor: 'start' });
    B.tex(V(636, 372), `$\\int=${fmt(integ(S, x0), 3)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });

    cA(`$=${fmt(y, 3)}$`);
    cB(`$=${fmt(ya + yb, 3)}$`);
    cD(`$=${fmt(y - ya - yb, 3)}$`);
    if (Math.abs(y - ya - yb) < 1e-9) cJ('蓝线始终压在两条虚线之和上：拆开前后是同一个函数', 'ok');
    else cJ('拆分前后数值对不上，检查通分');
  };

  // 数值积分（辛普森），仅在右栏作示意
  const integ = (S, x) => {
    const a = S.xs[0] + 0.02, n = 200, h = (x - a) / n;
    let s = S.f(a) + S.f(x);
    for (let i = 1; i < n; i++) s += S.f(a + i * h) * (i % 2 ? 4 : 2);
    return s * h / 3;
  };

  const bts = P.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('x₀ =', 1.3, 3.1, 0.01, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.hintM('蓝线是原式，橙紫虚线是拆出来的每一项：两项相加逐点回到蓝线');
  B.render();
  return B;
}
