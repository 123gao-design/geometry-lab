/* 图 级4a · 幂级数收敛半径机：数轴上标出收敛区间，再取一点看部分和靠不靠得住
   四档：Σxⁿ/n（R=1）、Σxⁿ/n!（R=∞）、Σn!xⁿ（R=0）、Σxⁿ（R=1）。
   上条是数轴与收敛带，下框画部分和随 n 的变化。滑块的 x 是取点，金点为当前点。
   版面：数轴 46..610 × 64..144，图象 46..610 × 168..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const fact = n => { let s = 1; for (let i = 2; i <= n; i++) s *= i; return s; };

const F = [
  { t: '$\\sum\\dfrac{x^n}{n}$', term: (x, n) => Math.pow(x, n) / n, R: 1, xr: [-3, 3], rad: '收敛半径 $R=1$', read: '端点上 x=±1 各看一支：一边是交错调和级数，一边是调和级数' },
  { t: '$\\sum\\dfrac{x^n}{n!}$', term: (x, n) => Math.pow(x, n) / fact(n), R: Infinity, xr: [-3, 3], rad: '收敛半径 $R=\\infty$', read: '阶乘在分母，任取多大的 x 都追得上，整条数轴都收敛' },
  { t: '$\\sum n!\\,x^n$', term: (x, n) => fact(n) * Math.pow(x, n), R: 0, xr: [-3, 3], rad: '收敛半径 $R=0$', read: '够小的 x 也会被 n! 拖垮，只有 x=0 这一点的项恒为零' },
  { t: '$\\sum x^n$', term: (x, n) => Math.pow(x, n), R: 1, xr: [-3, 3], rad: '收敛半径 $R=1$', read: '等比级数，|x|<1 收敛；端点上通项不趋于零，两级数都发散' },
];
const N = 30;

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, x: 0.6 };
  const cR = B.chipM('收敛半径'), cD = B.chipM('收敛域'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k];
    // 数轴与收敛带
    const m1 = B.mapFit(S.xr[0], S.xr[1], -1, 1, [46, 64, 564, 80], 4);
    const yA = 104;
    if (isFinite(S.R)) {
      const lo = Math.max(S.xr[0], -S.R), hi = Math.min(S.xr[1], S.R);
      mk('rect', { x: m1.px(lo), y: yA - 12, width: Math.max(2, m1.px(hi) - m1.px(lo)), height: 24, fill: '#4ade80', 'fill-opacity': .16, stroke: '#4ade80', 'stroke-opacity': .5, rx: 5 }, B.dyn);
      [-S.R, S.R].forEach((r, i) => {
        mk('circle', { cx: m1.px(r), cy: yA, r: 3.4, fill: 'none', stroke: '#4ade80', 'stroke-width': 1.4 }, B.dyn);
      });
    } else if (S.R === Infinity) {
      mk('rect', { x: m1.px(S.xr[0]) + 4, y: yA - 12, width: m1.px(S.xr[1]) - m1.px(S.xr[0]) - 8, height: 24, fill: '#4ade80', 'fill-opacity': .16, stroke: '#4ade80', 'stroke-opacity': .5, rx: 5 }, B.dyn);
    } else {
      mk('circle', { cx: m1.px(0), cy: yA, r: 4.5, fill: '#ff9e4a' }, B.dyn);
    }
    B.seg(V(m1.px(S.xr[0]), yA), V(m1.px(S.xr[1]), yA), { stroke: '#93a1b5', 'stroke-width': 1.1 });
    [S.xr[0] + 0.5, 0, S.xr[1] - 0.5].forEach(t => {
      B.textM(V(m1.px(t), yA + 20), fmt(t, 0), { 'font-size': 10.5, fill: '#6b7c93', 'text-anchor': 'middle' });
    });
    B.textM(V(m1.px(S.xr[1]) , yA - 22), '收敛域', { 'font-size': 11, fill: '#4ade80', 'text-anchor': 'end' });
    B.dot(V(m1.px(st.x), yA), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });

    // 部分和
    const m = B.mapFit(0, N + 1, -4, 4, [46, 168, 564, 214], 12);
    B.grid({ ...m, sx: 5, sy: 1, lx: 5, ly: 2, xt: [5, 10, 15, 20, 25], yt: [-2, 2] });
    let s = 0;
    const pts = [];
    for (let n = 1; n <= N; n++) { s += S.term(st.x, n); pts.push([n, s]); }
    pts.forEach(([n, v]) => {
      if (!(v >= -4) || v > 4) return;
      mk('circle', { cx: m.px(n).toFixed(1), cy: m.py(v).toFixed(1), r: 2.6, fill: '#5cadff' }, B.dyn);
    });
    const inside = pts.filter(([, v]) => v >= -4 && v <= 4);
    if (inside.length > 1) mk('polyline', {
      points: inside.map(p => `${m.px(p[0]).toFixed(1)},${m.py(p[1]).toFixed(1)}`).join(' '),
      fill: 'none', stroke: '#5cadff', 'stroke-width': 1.4, 'stroke-opacity': .55,
    }, B.dyn);
    const last = pts[pts.length - 1][1];
    const tail = pts.slice(-6).map(p => p[1]);
    const steady = Math.max(...tail) - Math.min(...tail) < 0.02;

    cR(isFinite(S.R) ? `$=${S.R}$` : '$=\\infty$');
    cD(S.R === 0 ? '$x=0$' : isFinite(S.R) ? `$|x|<${S.R}$` : '$(-\\infty,+\\infty)$');
    if (S.R === Infinity) cJ('整条数轴都收敛，取多大的 x 都行', 'ok');
    else if (S.R === 0) cJ('只有 x=0 一项非零，离开原点立刻发散');
    else if (Math.abs(st.x) < S.R) cJ('x 落在收敛区间内：部分和越来越稳', 'ok');
    else cJ('x 落在收敛区间外：部分和越算越大，级数发散');

    B.textM(V(636, 84), '幂级数', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 124), S.t, { size: 13, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 172), S.rad, { size: 12, color: '#4ade80', anchor: 'start', w: 250 });
    B.tex(V(636, 214), `$x=${fmt(st.x, 2)}$`, { size: 12.5, color: '#ffd166', anchor: 'start' });
    B.tex(V(636, 256), `$S_{30}=${fmt(last, 4)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.textM(V(636, 300), S.read, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start', w: 215 });
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('x =', -3, 3, 0.05, st.x, v => { st.x = v; B.render(); }, 'x');
  B.hintM('拖 $x$ 走进或走出收敛带：带内部分和稳住，带外一路发散');
  B.render();
  return B;
}
