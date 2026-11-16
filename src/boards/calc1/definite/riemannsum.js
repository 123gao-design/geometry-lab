/* 图 定1 · 分割求和机：一堆矩形逼近一块面积
   在 [0,X] 上把区间切成 n 段，每段按左端点、右端点或中点取高，画出一个阶梯。
   n 一变大，阶梯的台阶变细，和数与真值之差按 1/n 缩小。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const F = [
  { t: '① $y=x^2$', f: x => x * x, a: 0, b: 1, I: 1 / 3, yr: [-0.05, 1.15], xt: [0.5, 1] },
  { t: '② $y=\\sin x$', f: Math.sin, a: 0, b: Math.PI, I: 2, yr: [-0.1, 1.15], xt: [1, 2, 3] },
  { t: '③ $y=\\mathrm{e}^x$', f: Math.exp, a: 0, b: 1, I: Math.E - 1, yr: [-0.1, 2.9], xt: [0.5, 1], yt: [1, 2] },
];
const RULE = ['左端点', '右端点', '中点'];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, n: 6, r: 0 };
  const cS = B.chipM('和 Sₙ'), cI = B.chipM('精确值'), cE = B.chipM('误差'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k], n = Math.round(st.n), rule = st.r;
    const m = B.mapFit(S.a - 0.08, S.b + 0.08, S.yr[0], S.yr[1], [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: S.xt, yt: S.yt });
    B.plot(S.f, m, { stroke: '#5cadff', 'stroke-width': 2.2, x0: S.a, x1: S.b, anchors: [S.a, S.b] });
    const dx = (S.b - S.a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const l = S.a + i * dx, r = l + dx;
      const t = rule === 0 ? l : rule === 1 ? r : (l + r) / 2;
      const h = S.f(t);
      sum += h * dx;
      const x0 = m.px(l), x1 = m.px(r), y0 = m.py(0), y1 = m.py(h);
      mk('path', { d: `M${x0} ${y0} L${x0} ${y1} L${x1} ${y1} L${x1} ${y0} Z`,
        fill: '#4ade80', 'fill-opacity': .14, stroke: '#4ade80', 'stroke-width': .9, 'stroke-opacity': .55 }, B.dyn);
    }
    B.tex(V(636, 84), `$n=${n}$，取${RULE[rule]}`, { size: 12, color: '#8fa3bd', anchor: 'start' });
    B.tex(V(636, 124), `$\\sum_{k=1}^{n}f(\\xi_k)\\Delta x=${fmt(sum, 5)}$`, { size: 12, color: '#4ade80', anchor: 'start' });
    B.tex(V(636, 168), `$\\int_a^b f\\,\\mathrm{d}x=${fmt(S.I, 5)}$`, { size: 12, color: '#5cadff', anchor: 'start' });
    B.tex(V(636, 210), `$|S_n-I|=${fmt(Math.abs(sum - S.I), 5)}$`, { size: 12, color: '#ff9e4a', anchor: 'start' });
    B.textM(V(636, 254), `每份宽 Δx = ${fmt(dx, 4)}`, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 300), `$\\int_0^1 x^2\\mathrm{d}x=\\tfrac13$`, { size: 11.5, color: '#6b7c93', anchor: 'start' });

    cS(`$=${fmt(sum, 5)}$`);
    cI(`$=${fmt(S.I, 5)}$`);
    cE(`$=${fmt(Math.abs(sum - S.I), 5)}$`);
    if (Math.abs(sum - S.I) < 4e-3) cJ('台阶已经贴住曲线：和数与定积分几乎相等，这就是「取极限」', 'ok');
    else if (rule === 0) cJ('左端点取高：曲线上升时每一块都矮了一点，和数偏小');
    else if (rule === 1) cJ('右端点取高：曲线上升时每一块都高了一点，和数偏大');
    else cJ('中点取高：每块有高有低，误差比左右端点两侧都小');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const rb = RULE.map((t, i) => B.btnM('取' + t, () => {
    st.r = i; rb.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('n =', 1, 60, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.hintM('把 $n$ 往右拖：台阶越来越细，和数向定积分靠拢 —— 分割、近似、求和、取极限');
  B.render();
  return B;
}
