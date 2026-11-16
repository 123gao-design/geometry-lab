/* 图 定3 · 对称区间机：奇偶性先把一半抹掉
   在 [-a,a] 上左右各画一块有向面积：蓝块 [-a,0]、橙块 [0,a]。
   奇函数两块一正一负、大小相等，合起来为零；偶函数两块完全一样，合起来是两倍的右半。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const F = [
  { t: '① $\\sin x$（奇）', f: Math.sin, odd: true, xr: [-2.4, 2.4], yr: [-1.4, 1.4], xt: [-2, -1, 1, 2], yt: [-1, 1] },
  { t: '② $x^3$（奇）', f: x => x * x * x, odd: true, xr: [-1.4, 1.4], yr: [-2.6, 2.6], xt: [-1, 1], yt: [-2, 2] },
  { t: '③ $\\cos x$（偶）', f: Math.cos, odd: false, xr: [-2.4, 2.4], yr: [-1.4, 1.4], xt: [-2, -1, 1, 2], yt: [-1, 1] },
  { t: '④ $x^2$（偶）', f: x => x * x, odd: false, xr: [-2.2, 2.2], yr: [-0.4, 4.8], xt: [-2, -1, 1, 2], yt: [2, 4] },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, a: 1.4 };
  const cL = B.chipM('左半'), cR = B.chipM('右半'), cT = B.chipM('合计'), cJ = B.chipM('判读');

  const fillArea = (S, m, lo, hi, col) => {
    let d = `M${m.px(lo)} ${m.py(0)} `;
    const N = 70;
    for (let i = 0; i <= N; i++) {
      const x = lo + (hi - lo) * i / N;
      d += `L${m.px(x).toFixed(1)} ${m.py(S.f(x)).toFixed(1)} `;
    }
    d += `L${m.px(hi)} ${m.py(0)} Z`;
    mk('path', { d, fill: col, 'fill-opacity': .2, stroke: 'none' }, B.dyn);
  };

  B.renderFn = () => {
    const S = F[st.k], a = st.a;
    const m = B.mapFit(S.xr[0], S.xr[1], S.yr[0], S.yr[1], [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: S.xt, yt: S.yt });
    fillArea(S, m, -a, 0, '#5cadff');
    fillArea(S, m, 0, a, '#ff9e4a');
    B.plot(S.f, m, { stroke: '#c084fc', 'stroke-width': 2.2, anchors: [-a, a] });
    [-a, 0, a].forEach(t => B.seg(V(m.px(t), m.py(0)), V(m.px(t), m.py(S.f(t))), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4' }));
    B.tex(V(m.px(-a) - 6, m.py(0) + 16), `$-a$`, { size: 11.5, anchor: 'end', color: '#93a1b5' });
    B.tex(V(m.px(a) + 6, m.py(0) + 16), `$a$`, { size: 11.5, anchor: 'start', color: '#93a1b5' });

    const IL = areaSimp(S.f, -a, 0);
    const IR = areaSimp(S.f, 0, a);
    B.textM(V(636, 84), S.odd ? '奇函数：两块一正一负' : '偶函数：两块完全一样', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 122), `$\\int_{-a}^{0}f=${fmt(IL, 4)}$`, { size: 12, color: '#5cadff', anchor: 'start' });
    B.tex(V(636, 158), `$\\int_{0}^{a}f=${fmt(IR, 4)}$`, { size: 12, color: '#ff9e4a', anchor: 'start' });
    B.tex(V(636, 198), `$\\int_{-a}^{a}f=${fmt(IL + IR, 4)}$`, { size: 13, color: '#c084fc', anchor: 'start' });
    B.tex(V(636, 248), S.odd ? `$\\int_{-a}^{a}f\\,\\mathrm{d}x=0$` : `$\\int_{-a}^{a}f\\,\\mathrm{d}x=2\\int_0^a f\\,\\mathrm{d}x$`, { size: 12.5, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 292), `$a=${fmt(a, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });

    cL(`$=${fmt(IL, 4)}$`);
    cR(`$=${fmt(IR, 4)}$`);
    cT(`$=${fmt(IL + IR, 4)}$`);
    if (S.odd) cJ('把 $a$ 拖大拖小：两块始终一正一负、大小相等，合计恒为零', 'ok');
    else cJ('把 $a$ 拖大拖小：两块始终一样大，合计恰好是右半的两倍', 'ok');
  };

  const areaSimp = (f, lo, hi) => {
    const N = 200, h = (hi - lo) / N;
    let S = f(lo) + f(hi);
    for (let i = 1; i < N; i++) S += f(lo + i * h) * (i % 2 ? 4 : 2);
    return S * h / 3;
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('a =', 0.3, 2.2, 0.01, st.a, v => { st.a = v; B.render(); }, 'a');
  B.hintM('对称区间先看奇偶：奇函数积分直接为零，偶函数只算一半再乘二');
  B.render();
  return B;
}
