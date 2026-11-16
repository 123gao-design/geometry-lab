/* 图 级5 · 留数算实积分机
   左图 z 平面画上半圆回路：实轴段 [−R, R] 加半圆弧，上半平面的极点落在回路内（橙），
   下半平面的极点在回路外（灰）。右图画实轴上的被积函数，阴影是截断积分 ∫_{-R}^{R}。
   三组预设对应三种最常见的实积分：
     ① ∫dx/(1+x²) = π ② ∫dx/(1+x²)² = π/2 ③ ∫cos x/(1+x²)dx = π/e。
   拖 R 看两件事同时发生：回路始终只框住上半平面的极点，而截断积分向留数给出的值收拢。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const E = Math.E;
const P = [
  { n: '① $\\frac{1}{1+x^{2}}$', g: x => 1 / (1 + x * x),
    poles: [{ c: [0, 1], r: [0, -.5] }, { c: [0, -1], r: [0, .5] }],
    val: Math.PI,
    v: '上半平面只有 $z=i$ 一个极点，留数 $-\\frac{i}{2}$；回路积分 $2\\pi i$ 乘上去恰好是 $\\pi$' },
  { n: '② $\\frac{1}{(1+x^{2})^{2}}$', g: x => 1 / ((1 + x * x) * (1 + x * x)),
    poles: [{ c: [0, 1], r: [0, -.25] }, { c: [0, -1], r: [0, .25] }],
    val: Math.PI / 2,
    v: '二阶极点按 $\\frac{1}{(n-1)!}$ 求导：$(z-i)^{2}f$ 在 $i$ 处求一次导，留数 $-\\frac{i}{4}$' },
  { n: '③ $\\frac{\\cos x}{1+x^{2}}$', g: x => Math.cos(x) / (1 + x * x),
    poles: [{ c: [0, 1], r: [0, -1 / (2 * E)] }, { c: [0, -1], r: [0, 1 / (2 * E)] }],
    val: Math.PI / E,
    v: '把 $\\cos x$ 换成 $e^{iz}$ 再取实部；上半平面极点的留数带上 $e^{-1}$，结果是 $\\pi/e$' },
];

const cn = (a, b, n = 3) => {
  const A = Math.abs(a) < 5e-4 ? 0 : a, B = Math.abs(b) < 5e-4 ? 0 : b;
  const bs = Math.abs(B) === 1 ? '' : fmt(Math.abs(B), n);
  if (B === 0) return fmt(A, n);
  if (A === 0) return (B < 0 ? '-' : '') + bs + 'i';
  return fmt(A, n) + (B < 0 ? '-' : '+') + bs + 'i';
};

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, R: 2.4 };
  const mL = B.isoFit(-10.7, 10.7, -0.9, 10.8, [24, 18, 372, 390], 22);
  const mR = B.mapFit(-10.7, 10.7, -0.3, 1.25, [416, 18, 380, 390], 24);
  const cS = B.chipM('留数和'), cC = B.chipM('回路积分'), cR = B.chipM('实轴截断'), cD = B.chipM('差');

  // 复合辛普森：截断到 [−R, R] 的实积分
  function simpson(g, R) {
    const N = 600, h = 2 * R / N;
    let s = g(-R) + g(R);
    for (let i = 1; i < N; i++) s += g(-R + i * h) * (i % 2 ? 4 : 2);
    return s * h / 3;
  }

  B.renderFn = () => {
    const S = P[st.k], R = st.R;
    B.grid({ ...mL, sx: 2, sy: 2, lx: 2, ly: 2, axLab: 'x', ayLab: 'y' });

    // 左图：实轴段 [−R, R] + 上半圆弧（逆时针）
    const O = V(mL.px(0), mL.py(0));
    B.seg(V(mL.px(-R), O.y), V(mL.px(R), O.y), { stroke: '#ffd166', 'stroke-width': 2.4 });
    let d = '';
    for (let i = 0; i <= 120; i++) {
      const a = i / 120 * Math.PI;
      const p = V(R * Math.cos(a), R * Math.sin(a));
      d += (i ? 'L' : 'M') + mL.px(p.x).toFixed(1) + ' ' + mL.py(p.y).toFixed(1) + ' ';
    }
    B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.4 }, B.dyn));
    // 弧顶的逆时针箭头
    const at = V(mL.px(-R * 0.7), mL.py(R * 0.714));
    mk('polygon', { points: `${at.x},${at.y} ${at.x + 11},${at.y - 2} ${at.x + 7},${at.y + 8}`, fill: '#ffd166' }, B.dyn);

    // 极点：上半平面在回路内，下半平面在外
    for (const p of S.poles) {
      const inside = p.c[1] > 0;
      const Q = V(mL.px(p.c[0]), mL.py(p.c[1]));
      B.dot(Q, 6, { fill: inside ? '#ff9e4a' : '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.tex(V(Q.x + 12, Q.y - 12), inside ? '$z=i$' : '$z=-i$', { size: 12, color: inside ? '#ff9e4a' : '#93a1b5', w: 40 });
      if (inside) B.tex(V(Q.x + 12, Q.y + 8), '$\\mathrm{Res}=' + cn(p.r[0], p.r[1]) + '$', { size: 12, color: '#ff9e4a', w: 130 });
    }
    B.tex(V(mL.px(mL.X0) + 6, mL.py(mL.Y1) + 14), '$|z|=R$ 上的半圆随 $R$ 长大，只框住上半平面', { size: 12, color: '#93a1b5', w: 300 });

    // 右图：被积函数与截断积分阴影
    B.grid({ ...mR, sx: 2, sy: 0.25, lx: 2, ly: 0.5, axLab: 'x', ayLab: 'y' });
    let fd = '', pd = '';
    const n = 320;
    for (let i = 0; i <= n; i++) {
      const x = -R + 2 * R * i / n, y = S.g(x);
      fd += (i ? 'L' : 'M') + mR.px(x).toFixed(1) + ' ' + mR.py(y).toFixed(1) + ' ';
      pd += (i ? 'L' : 'M') + mR.px(x).toFixed(1) + ' ' + mR.py(y).toFixed(1) + ' ';
    }
    pd += `L${mR.px(R).toFixed(1)} ${mR.py(0).toFixed(1)} L${mR.px(-R).toFixed(1)} ${mR.py(0).toFixed(1)} Z`;
    B.dyn.appendChild(mk('path', { d: pd, fill: '#67e8f9', 'fill-opacity': .16, stroke: 'none' }, B.dyn));
    B.dyn.appendChild(mk('path', { d: fd, fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.2 }, B.dyn));
    // 截断端点
    B.seg(V(mR.px(-R), mR.py(-0.3)), V(mR.px(-R), mR.py(1.25)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '3 5', 'stroke-opacity': .55 });
    B.seg(V(mR.px(R), mR.py(-0.3)), V(mR.px(R), mR.py(1.25)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '3 5', 'stroke-opacity': .55 });
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 14), '阴影面积 $=\\int_{-R}^{R}f(x)\\,dx$', { size: 12, color: '#93a1b5', w: 230 });

    const sum = S.poles.filter(p => p.c[1] > 0).reduce((a, p) => [a[0] + p.r[0], a[1] + p.r[1]], [0, 0]);
    const I = simpson(S.g, R);
    cS(`$${cn(sum[0], sum[1])}$`, '');
    cC(`$${fmt(S.val, 4)}$`, 'good');
    cR(`$${fmt(I, 4)}$`, '');
    cD(`$${fmt(Math.abs(I - S.val), 4)}$`, Math.abs(I - S.val) < 0.02 ? 'good' : '');
    B.hintM(S.v);
  };

  const bts = P.map((p, i) => B.btnM(p.n, () => {
    st.k = i;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.slider('半径 R', 1.6, 10, 0.1, st.R, v => { st.R = v; B.render(); }, 'R');

  B.render();
  return B;
}
