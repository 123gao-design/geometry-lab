/* 图 定2 · 变上限积分机：面积函数与它的导数
   Φ(x)=∫_a^x f(t)dt 把「累计到 x 的一块面积」看成 x 的函数。
   在 x 处给 Φ 画切线：斜率恰好等于蓝线在 x 的高度 f(x) —— 这就是微积分基本定理。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const F = [
  { t: '① $f=\\cos t$', f: Math.cos, P: x => Math.sin(x), a: 0, x1: 6.28, yr: [-1.4, 1.4], xt: [1, 2, 3, 4, 5, 6], yt: [-1, 1] },
  { t: '② $f=\\mathrm{e}^{-t}$', f: x => Math.exp(-x), P: x => 1 - Math.exp(-x), a: 0, x1: 3.2, yr: [-0.2, 1.1], xt: [1, 2, 3], yt: [1] },
  { t: '③ $f=1/t$', f: x => 1 / x, P: x => Math.log(x), a: 1, x1: 3.6, yr: [-0.2, 1.7], xt: [2, 3], yt: [1] },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, x: 2.0 };
  const cA = B.chipM('Φ(x)'), cD = B.chipM("Φ'(x)"), cF = B.chipM('f(x)'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k], x = st.x;
    const m = B.mapFit(S.a - 0.15, S.x1, S.yr[0], S.yr[1], [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: S.xt, yt: S.yt });
    // 面积：f 在 [a,x] 上的一块
    let d = `M${m.px(S.a)} ${m.py(0)} `;
    const N = 80;
    for (let i = 0; i <= N; i++) {
      const t = S.a + (x - S.a) * i / N;
      d += `L${m.px(t).toFixed(1)} ${m.py(S.f(t)).toFixed(1)} `;
    }
    d += `L${m.px(x)} ${m.py(0)} Z`;
    mk('path', { d, fill: '#4ade80', 'fill-opacity': .16, stroke: 'none' }, B.dyn);
    B.plot(S.f, m, { stroke: '#5cadff', 'stroke-width': 2, x0: S.a, x1: S.x1, anchors: [x] });
    B.plot(S.P, m, { stroke: '#ff9e4a', 'stroke-width': 2.2, x0: S.a, x1: S.x1, anchors: [x] });

    const yp = S.P(x), k = S.f(x);
    B.dot(V(m.px(x), m.py(yp)), 5.4, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    const hw = 0.42;
    B.seg(V(m.px(x - hw), m.py(yp - k * hw)), V(m.px(x + hw), m.py(yp + k * hw)),
      { stroke: '#ffd166', 'stroke-width': 1.7, 'stroke-dasharray': '6 4' });
    B.seg(V(m.px(x), m.py(0)), V(m.px(x), m.py(S.f(x))), { stroke: '#5cadff', 'stroke-width': 1.4, 'stroke-dasharray': '4 4' });
    B.tex(V(m.px(x) + 8, m.py(yp) - 12), `$\\Phi(x)$`, { size: 12, anchor: 'start', color: '#ff9e4a' });
    B.tex(V(m.px(x) + 8, m.py(S.f(x)) + 14), `$f(x)$`, { size: 12, anchor: 'start', color: '#5cadff' });
    B.textM(V(636, 84), '累计面积就是原函数', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 122), `$\\Phi(x)=\\int_a^x f(t)\\,\\mathrm{d}t$`, { size: 12.5, color: '#ff9e4a', anchor: 'start' });
    B.tex(V(636, 164), `$\\Phi'(x)=f(x)$`, { size: 13, color: '#ffd166', anchor: 'start' });
    B.tex(V(636, 206), `$\\Phi(${fmt(x, 2)})=${fmt(yp, 4)}$`, { size: 12, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 242), `$f(${fmt(x, 2)})=${fmt(k, 4)}$`, { size: 12, color: '#5cadff', anchor: 'start' });
    B.textM(V(636, 284), '橙线的切线斜率 = 蓝线的高度', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    cA(`$=${fmt(yp, 4)}$`);
    cD(`$=${fmt(k, 4)}$`);
    cF(`$=${fmt(k, 4)}$`);
    cJ('把 $x$ 往右拖：多出来的一小条面积高 $f(x)$、宽 $\\mathrm{d}x$，所以 $\\Phi$ 的斜率就是 $f(x)$');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i;
    // ③ 的积分下限是 1，滑块下界随之抬起来，免得 x<1 时 ln x 无定义
    const lo = S.a > 0.5 ? S.a + 0.06 : 0.4;
    sX.min = lo; sX.setAttribute('min', String(lo));
    if (st.x < lo) { st.x = lo; sX.sync(st.x); }
    bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const sX = B.slider('x =', 0.4, 3.4, 0.01, st.x, v => { st.x = v; B.render(); }, 'x');
  B.hintM('橙线是累计面积，蓝线是它的导数：拖 $x$，两张图的读数始终对得上');
  B.render();
  return B;
}
