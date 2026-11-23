/* 图 定1 · 用有向矩形展示黎曼和及其与定积分的误差。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const F = [
  { t: '$y=x^2$', exact: '\\int_0^1 x^2\\,\\mathrm{d}x=\\tfrac13',
    f: x => x * x, a: 0, b: 1, I: 1 / 3, yr: [-0.16, 1.12], xt: [0.25, 0.5, 0.75, 1], yt: [0.5, 1] },
  { t: '$y=\\sin x$', exact: '\\int_0^\\pi \\sin x\\,\\mathrm{d}x=2',
    f: Math.sin, a: 0, b: Math.PI, I: 2, yr: [-0.16, 1.12], xt: [1, 2, 3], yt: [0.5, 1] },
  { t: '$y=\\mathrm{e}^x$', exact: '\\int_0^1 \\mathrm{e}^x\\,\\mathrm{d}x=\\mathrm{e}-1',
    f: Math.exp, a: 0, b: 1, I: Math.E - 1, yr: [-0.38, 2.9], xt: [0.25, 0.5, 0.75, 1], yt: [1, 2] },
  { t: '有向面积 $y=x$', exact: '\\int_{-1}^1 x\\,\\mathrm{d}x=0',
    f: x => x, a: -1, b: 1, I: 0, yr: [-1.2, 1.2], xt: [-1, -0.5, 0.5, 1], yt: [-1, -0.5, 0.5, 1] },
];
const RULE = ['左端点', '右端点', '中点'];

export function createBoard(root) {
  const W = 800, H = 408;
  const B = new Board(root, W, H);
  const st = { k: 0, n: 6, r: 0 };
  const cS = B.chipM('近似值 $S_n$'), cI = B.chipM('精确值 $I$'), cE = B.chipM('误差 $S_n-I$');
  const cAreas = B.chipM('有向面积');

  B.renderFn = () => {
    const S = F[st.k], n = Math.round(st.n), rule = st.r;
    const m = B.mapFit(S.a - 0.08, S.b + 0.08, S.yr[0], S.yr[1], [47, 48, 706, 296], 16);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: S.xt, yt: S.yt });
    const dx = (S.b - S.a) / n;
    let positive = 0, negative = 0, sample;
    for (let i = 0; i < n; i++) {
      const l = S.a + i * dx, r = l + dx;
      const t = rule === 0 ? l : rule === 1 ? r : (l + r) / 2;
      const h = S.f(t);
      if (h < 0) negative += h * dx;
      else positive += h * dx;
      const color = h < 0 ? '#ff9e4a' : '#4ade80';
      const x0 = m.px(l), x1 = m.px(r), y0 = m.py(0), y1 = m.py(h);
      mk('path', { d: `M${x0} ${y0} L${x0} ${y1} L${x1} ${y1} L${x1} ${y0} Z`,
        fill: color, 'fill-opacity': .16, stroke: color, 'stroke-width': .95, 'stroke-opacity': .65,
        'stroke-dasharray': h < 0 ? '4 3' : 'none' }, B.dyn);
      if (i === Math.floor((n - 1) / 2)) sample = { x0, x1, xt: m.px(t), y1 };
    }
    B.plot(S.f, m, { stroke: '#5cadff', 'stroke-width': 3.2, x0: S.a, x1: S.b, anchors: [0, S.a, S.b] });
    B.dot(V(sample.xt, sample.y1), 5, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 1.5 });
    B.text(V(sample.xt + (sample.xt > W - 130 ? -16 : 16), sample.y1 - 12), 'ξₖ', { fill: '#ffd166' });
    const ruler = { stroke: '#93a1b5', 'stroke-width': 1.4 };
    B.seg(V(sample.x0, 354), V(sample.x1, 354), ruler);
    B.seg(V(sample.x0, 350), V(sample.x0, 358), ruler);
    B.seg(V(sample.x1, 350), V(sample.x1, 358), ruler);
    B.text(V((sample.x0 + sample.x1) / 2, 374), `Δx = ${fmt(dx, 4)}`, { fill: '#93a1b5' });
    B.tex(V(38, 26), `$${S.exact}$`, { size: 16, color: '#5cadff', anchor: 'start' });
    B.text(V(760, 30), `n = ${n} · ${RULE[rule]}`, { fill: '#93a1b5', 'text-anchor': 'end' });
    if (S.a < 0) {
      B.text(V(120, 305), '− 轴下', { fill: '#ff9e4a' });
      B.text(V(680, 95), '+ 轴上', { fill: '#4ade80' });
    }

    const sum = positive + negative;
    const error = sum - S.I;
    const near = Math.abs(error) < 5e-6;
    cS(`$${fmt(sum, 5)}$`);
    cI(`$${fmt(S.I, 5)}$`);
    cE(`$${fmt(near ? 0 : error, 5)}$ · ${near ? '精度内相等' : error < 0 ? '偏小' : '偏大'}`, near ? 'ok' : '');
    cAreas(`$+${fmt(positive, 5)}$ 与 $${negative < 0 ? '−' : ''}${fmt(Math.abs(negative), 5)}$`);
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const rb = RULE.map((t, i) => B.btnM('取' + t, () => {
    st.r = i; rb.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('n =', 1, 60, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.render();
  return B;
}
