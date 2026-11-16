/* 图 微5 · 洛必达法则机：两个比值的极限相同
   左图把 f（蓝）与 g（绿）同画，二者都在 x→0⁺ 时趋于 0，直接作商得 0/0。
   右图改成画两条比值曲线：f/g（橙）与 f'/g'（紫），它们从右侧逼近同一个数 L（金虚线）。
   版面：左 36..286、右 320..570（各 270 高），右栏文字 600 起；x 一枚滑块。 */
import { Board, V, fmt } from '../../../lib/board.js';

const F = [
  {
    t: '① $\\dfrac{\\sin x}{x}$', name: 'sin x / x', L: 1,
    f: x => Math.sin(x), g: x => x, df: x => Math.cos(x), dg: () => 1,
  },
  {
    t: '② $\\dfrac{1-\\cos x}{x^2}$', name: '(1−cos x) / x²', L: 0.5,
    f: x => 1 - Math.cos(x), g: x => x * x, df: x => Math.sin(x), dg: x => 2 * x,
  },
  {
    t: '③ $\\dfrac{\\mathrm{e}^x-1-x}{x^2}$', name: '(eˣ−1−x) / x²', L: 0.5,
    f: x => Math.exp(x) - 1 - x, g: x => x * x, df: x => Math.exp(x) - 1, dg: x => 2 * x,
  },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, x: 0.55 };
  const cR = B.chipM('比值'), cD = B.chipM('导数比'), cL = B.chipM('极限'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k], x = st.x;
    const mL = B.mapFit(-0.08, 1.5, -0.12, 2.2, [36, 74, 250, 268], 10);
    const mR = B.mapFit(0, 1.5, -0.1, 2.0, [320, 74, 250, 268], 10);
    B.grid({ ...mL, sx: 1, sy: 1, lx: 1, ly: 1, xt: [1], yt: [1, 2], labs: true });
    B.grid({ ...mR, sx: 1, sy: 1, lx: 1, ly: 1, xt: [1], yt: [1, 2], labs: true });

    // 左图：f 与 g 都趋于 0
    B.plot(S.f, mL, { stroke: '#5cadff', 'stroke-width': 2.1, x0: 0, x1: 1.45 });
    B.plot(S.g, mL, { stroke: '#4ade80', 'stroke-width': 2.1, x0: 0, x1: 1.45 });
    const Pf = V(mL.px(x), mL.py(S.f(x))), Pg = V(mL.px(x), mL.py(S.g(x)));
    B.seg(Pf, V(Pf.x, mL.py(0)), { stroke: '#5cadff', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .7 });
    B.seg(Pg, V(Pg.x, mL.py(0)), { stroke: '#4ade80', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .7 });
    B.dot(Pf, 4.6, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.dot(Pg, 4.6, { fill: '#4ade80', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(Pf.x - 8, Pf.y - 10), '$f$', { size: 12, anchor: 'end', color: '#5cadff' });
    B.tex(V(Pg.x + 8, Pg.y + 12), '$g$', { size: 12, anchor: 'start', color: '#4ade80' });
    B.tex(V(mL.px(0) - 6, mL.py(0) + 16), '$0$', { size: 11, anchor: 'end', color: '#93a1b5' });
    B.textM(V(36, 58), '分子与分母都趋于 0', { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'start' });

    // 右图：两条比值曲线
    const k1 = u => S.f(u) / S.g(u);
    const k2 = u => S.df(u) / S.dg(u);
    B.seg(V(mR.px(0), mR.py(S.L)), V(mR.px(1.5), mR.py(S.L)), { stroke: '#ffd166', 'stroke-width': 1.5, 'stroke-dasharray': '7 5' });
    B.plot(k1, mR, { stroke: '#ff9e4a', 'stroke-width': 2.1, x0: 0.01, x1: 1.45 });
    B.plot(k2, mR, { stroke: '#c084fc', 'stroke-width': 2.1, x0: 0.01, x1: 1.45 });
    const R1 = V(mR.px(x), mR.py(k1(x))), R2 = V(mR.px(x), mR.py(k2(x)));
    B.dot(R1, 4.6, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.dot(R2, 4.6, { fill: '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.seg(V(mR.px(x), mR.py(-0.1)), V(mR.px(x), mR.py(2.0)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .6 });
    B.tex(V(mR.px(1.5) - 4, mR.py(S.L) - 12), `$L=${fmt(S.L, 2)}$`, { size: 11.5, anchor: 'end', color: '#ffd166' });
    B.textM(V(320, 58), '两个比值贴着同一条水平线', { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'start' });

    // 右栏
    const q = k1(x), q2 = k2(x);
    B.textM(V(602, 86), S.name, { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    const rows = [
      ['$f(x)$', fmt(S.f(x), 4), '#5cadff'],
      ['$g(x)$', fmt(S.g(x), 4), '#4ade80'],
      ['$f(x)/g(x)$', fmt(q, 4), '#ff9e4a'],
      ['$f\'(x)/g\'(x)$', fmt(q2, 4), '#c084fc'],
      ['$L$', fmt(S.L, 4), '#ffd166'],
    ];
    rows.forEach((r, i) => {
      B.tex(V(602, 128 + i * 32), r[0], { size: 12.5, color: r[2], anchor: 'start' });
      B.textM(V(858, 128 + i * 32), r[1], { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'end' });
    });
    B.tex(V(602, 314), '$\\lim\\dfrac{f(x)}{g(x)}=\\lim\\dfrac{f\'(x)}{g\'(x)}$', { size: 12.5, color: '#aebdd2', anchor: 'start' });
    B.tex(V(602, 352), '两式都要求右侧极限存在', { size: 11, color: '#8fa3bd', anchor: 'start' });

    cR(`$=${fmt(q, 4)}$`);
    cD(`$=${fmt(q2, 4)}$`);
    cL(`$=${fmt(S.L, 2)}$`);
    if (x < 0.16) cJ('$x$ 越小，两条比值曲线越贴近 $L$：0/0 型的极限由导数之比给出', 'ok');
    else cJ(`把 $x$ 拖向 0：橙、紫两条曲线一起靠向水平线 $L=${fmt(S.L, 2)}$`);
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('x =', 0.06, 1.4, 0.01, st.x, v => { st.x = v; B.render(); }, 'x');
  B.hintM('橙色是原式的比，紫色是求导后的比：$x\\to0$ 时两条曲线收向同一个数');
  B.render();
  return B;
}
