/* 图 微1 · 二重极限与连续机
   平面域里四条路径同时向原点收拢（r 滑块控制离原点的远近）：
   右侧把「沿每条路径的 f 值」画成 r 的函数，曲线各自趋近的高度就是这条路径上的极限。
   三个预设：① 四条路径都趋于 0 且 f(0,0)=0，连续；② 沿 y=kx 趋于 k/(1+k²)，高度各不相同；
   ③ 三条直线都趋于 0，沿抛物线 y=x² 却趋于 1/2 —— 只走直线看不出，换一条路才暴露。
   版面：左域 34..504，右图 520..790。 */
import { Board, V, fmt } from '../../../lib/board.js';

const SAFE = (x, y) => x * x + y * y < 1e-8;

const P = [
  { n: '① $f=\\dfrac{x^2y}{x^2+y^2}$', f: (x, y) => SAFE(x, y) ? 0 : x * x * y / (x * x + y * y),
    v: '四条路径上的函数值都趋于 $0$，又 $f(0,0)=0$，三者在原点接上，函数在原点连续' },
  { n: '② $f=\\dfrac{xy}{x^2+y^2}$', f: (x, y) => SAFE(x, y) ? 0 : x * y / (x * x + y * y),
    v: '沿 $y=x$ 趋于 $0.5$，沿 $y=2x$ 趋于 $0.4$ —— 两条路的高度不同，二重极限不存在' },
  { n: '③ $f=\\dfrac{x^2y}{x^4+y^2}$', f: (x, y) => x * x + y * y < 1e-8 || x ** 4 + y * y < 1e-10 ? 0 : x * x * y / (x ** 4 + y * y),
    v: '三条直线都趋于 $0$，沿抛物线 $y=x^2$ 却趋于 $0.5$ —— 只查直线不够，二重极限不存在' },
];

const PATHS = [
  { c: '#5cadff', lab: '$y=0$', pt: t => [t, 0] },
  { c: '#4ade80', lab: '$y=x$', pt: t => [t, t] },
  { c: '#ff9e4a', lab: '$y=2x$', pt: t => [t, 2 * t] },
  { c: '#c084fc', lab: '$y=x^2$', pt: t => [t, t * t] },
];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, r: 0.85 };
  const c1 = B.chipM('$y=0$'), c2 = B.chipM('$y=x$'), c3 = B.chipM('$y=2x$'), c4 = B.chipM('$y=x^2$');
  const cJ = B.chipM('判读');
  const mL = B.isoFit(-1.4, 1.4, -1.4, 1.4, [34, 26, 470, 366], 22);
  const mR = B.mapFit(0, 1.32, -0.25, 0.78, [520, 66, 270, 292], 22);
  const chips = [c1, c2, c3, c4];

  B.renderFn = () => {
    const S = P[st.k], r = st.r;
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });

    // 四条路径：整条画出来，只在原点附近读值
    PATHS.forEach(p => {
      const pts = [];
      for (let t = 0; t <= 1.36; t += 0.04) { const [x, y] = p.pt(t); pts.push(V(mL.px(x), mL.py(y))); }
      for (let i = 1; i < pts.length; i++) B.seg(pts[i - 1], pts[i], { stroke: p.c, 'stroke-width': 2, 'stroke-opacity': .85 });
      const [ex, ey] = p.pt(1.3);
      B.tex(V(mL.px(ex) + 4, mL.py(ey) - 8), p.lab, { size: 11.5, color: p.c, w: 70 });
    });

    // 原点与四条路径上的动点
    B.dot(V(mL.px(0), mL.py(0)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
    PATHS.forEach((p, i) => {
      const [x, y] = p.pt(r);
      B.dot(V(mL.px(x), mL.py(y)), 5, { fill: p.c, stroke: '#0a0d14', 'stroke-width': 1.2 });
      chips[i](`$${fmt(S.f(x, y), 3)}$`, '');
    });

    // 右图：沿每条路径的 f 值随 r 的变化
    B.grid({ ...mR, sx: 0.25, sy: 0.2, lx: 0.5, ly: 0.2, axLab: 'r', ayLab: 'f' });
    PATHS.forEach(p => {
      B.plot(t => S.f(...p.pt(t)), mR, { stroke: p.c, 'stroke-width': 2, x0: 0.01, x1: 1.3, n: 140 });
      const [x, y] = p.pt(r);
      B.dot(V(mR.px(r), mR.py(S.f(x, y))), 4.5, { fill: p.c, stroke: '#0a0d14', 'stroke-width': 1.1 });
      B.seg(V(mR.px(r), mR.py(mR.Y0)), V(mR.px(r), mR.py(mR.Y1)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 6', 'stroke-opacity': .7 });
    });
    B.tex(V(mR.px(0.02) + 6, mR.py(0.7)), '沿各路径的值随 $r$ 的变化', { size: 11.5, color: '#93a1b5', w: 210 });
    B.dot(V(mL.px(0), mL.py(0)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.tex(V(mL.px(0) + 9, mL.py(0) - 10), '$O$', { size: 12, color: '#ffd166', w: 30 });

    cJ(S.v, '');
  };

  const bts = P.map((S, i) => B.btnM(S.n, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('离原点的距离 r', 0.04, 1.25, 0.01, st.r, v => { st.r = v; B.render(); }, 'r');
  B.hintM('拖小 $r$：四条路径上的点同时收向原点，右侧曲线各自趋近的高度都相同，二重极限才存在');
  B.render();
  return B;
}
