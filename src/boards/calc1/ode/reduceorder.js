/* 图 方4 · 降阶机：缺什么就换什么
   ① 缺 y 的 y''=6x：连积两次，得 y=x³+C₁x+C₂，两个常数由两个初始条件定；
   ② 缺 x 的 y''=2y'：令 p=y'，方程化为一阶 p'=2p，解回来 y=C₁+C₂e^(2x)/2。
   滑块给 C₁、C₂，右栏同步列出 y、y'、y'' 三条读数。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt } from '../../../lib/board.js';

const F = [
  { t: "① $y''=6x$（缺 $y$）", y: (x, c1, c2) => x * x * x + c1 * x + c2, dy: (x, c1) => 3 * x * x + c1, d2: x => 6 * x,
    step: '$y\'=3x^2+C_1,\\quad y=x^3+C_1x+C_2$', xr: [-1.6, 1.6], yr: [-4, 4], xt: [-1, 1], yt: [-2, 2] },
  { t: "② $y''=2y'$（缺 $x$）", y: (x, c1, c2) => c1 + c2 * Math.exp(2 * x) / 2, dy: (x, c1, c2) => c2 * Math.exp(2 * x), d2: (x, c1, c2) => 2 * c2 * Math.exp(2 * x),
    step: '$p=2p\'\\Rightarrow p=C_2\\mathrm{e}^{2x}$', xr: [-1.4, 1.4], yr: [-2.6, 4.4], xt: [-1, 1], yt: [2, 4] },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, c1: 1.0, c2: -1.0, x0: 0.8 };
  const cY = B.chipM('y(x₀)'), cD = B.chipM("y'(x₀)"), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k], c1 = st.c1, c2 = st.c2, x0 = st.x0;
    const m = B.mapFit(S.xr[0], S.xr[1], S.yr[0], S.yr[1], [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: S.xt, yt: S.yt });
    B.plot(x => S.y(x, c1, c2), m, { stroke: '#5cadff', 'stroke-width': 2.4, anchors: [x0], pad: 10 });
    B.plot(x => S.dy(x, c1, c2), m, { stroke: '#4ade80', 'stroke-width': 1.4, 'stroke-dasharray': '6 5', pad: 10 });
    const yv = S.y(x0, c1, c2), dv = S.dy(x0, c1, c2);
    B.dot(V(m.px(x0), m.py(yv)), 5.3, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.tex(V(m.px(x0) + 8, m.py(yv) - 12), `$y=${fmt(yv, 3)}$`, { size: 11.5, anchor: 'start', color: '#ffd166' });
    B.textM(V(636, 84), '降一阶再解', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 124), S.step, { size: 11.5, color: '#aebdd2', anchor: 'start', w: 240 });
    B.tex(V(636, 168), `$y''=${S.d2(x0, c1, c2) ? fmt(S.d2(x0, c1, c2), 3) : 0}$`, { size: 12, color: '#c084fc', anchor: 'start' });
    B.tex(V(636, 208), `$C_1=${fmt(c1, 2)},\\ C_2=${fmt(c2, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.textM(V(636, 250), '每积一次多一个任意常数', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(636, 292), '二阶方程的通解带两个常数', { 'font-size': 11.5, fill: '#6b7c93', 'text-anchor': 'start' });

    cY(Number.isFinite(yv) ? `$=${fmt(yv, 3)}$` : '无定义');
    cD(Number.isFinite(dv) ? `$=${fmt(dv, 3)}$` : '无定义');
    cJ(st.k === 0 ? '缺 $y$：直接把 $y\'\'$ 积两次，两个常数留给初始条件' : '缺 $x$：令 $p=y\'$ 降成一阶，解出 $p$ 再积一次');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('C₁ =', -2, 2, 0.01, st.c1, v => { st.c1 = v; B.render(); }, 'c1');
  B.slider('C₂ =', -2, 2, 0.01, st.c2, v => { st.c2 = v; B.render(); }, 'c2');
  B.slider('x₀ =', -1, 1.6, 0.01, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.hintM('方程里缺哪个字母，就把哪个当自变量省掉：缺 $y$ 直接积，缺 $x$ 令 $p=y\'$');
  B.render();
  return B;
}
