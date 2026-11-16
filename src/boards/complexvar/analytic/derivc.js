/* 图 解1 · 复变函数的导数机
   左图 z 平面：从 z0 出发取一个小位移 h，红色沿实轴、橙色沿方向角 θ。
   右图 w 平面：把差商 (f(z0+h)-f(z0))/h 画成点，并让 h 的方向角转一整圈 —— 差商扫出的轨迹就叫「差商曲线」。
   三个预设：① f=z²（差商恒为 2z0+h，轨迹是一个点，导数存在）；
             ② f=z̄（差商是 e^{-2iθ}，轨迹是单位圆，方向一变值就变，导数不存在）；
             ③ f=|z|²（差商轨迹是半径 |z0| 的圆，只有 z0=0 时缩成一点）。 */
import { Board, V, fmt, mk, TAU } from '../../../lib/board.js';

const cadd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cdiv = (a, b) => { const d = b[0] * b[0] + b[1] * b[1] || 1e-12; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; };
const cabs = a => Math.hypot(a[0], a[1]);

const P = [
  { n: '① $f=z^2$', f: z => [z[0] * z[0] - z[1] * z[1], 2 * z[0] * z[1]], der: z => [2 * z[0], 2 * z[1]],
    v: '差商恒等于 $2z_0+h$，与方向无关；$h\\to0$ 时它趋于 $2z_0$ —— 导数存在' },
  { n: '② $f=\\bar z$', f: z => [z[0], -z[1]], der: null,
    v: '差商是 $e^{-2i\\theta}$，轨迹是整个单位圆；换个方向值就变，极限不存在' },
  { n: '③ $f=|z|^2$', f: z => [z[0] * z[0] + z[1] * z[1], 0], der: z => (cabs(z) < 1e-9 ? [0, 0] : null),
    v: '差商轨迹是半径 $|z_0|$ 的圆，只有 $z_0=0$ 时缩成一点；除原点外都不可导' },
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
  const st = { k: 0, z0: V(1, 1), th: 1.0, rho: 0.22 };
  const mL = B.isoFit(-2.4, 2.4, -1.95, 1.95, [22, 16, 372, 392], 24);
  const mR = B.isoFit(-2.4, 2.4, -1.95, 1.95, [424, 16, 372, 392], 24);
  const cA = B.chipM('沿实轴'), cB = B.chipM('沿 $\\theta$ 方向'), cD = B.chipM('导数'), cJ = B.chipM('判读');

  const Q = (z0, phi, rho) => {
    const h = [rho * Math.cos(phi), rho * Math.sin(phi)];
    const S = P[st.k];
    return cdiv(csub(S.f(cadd(z0, h)), S.f(z0)), h);
  };

  B.renderFn = () => {
    const S = P[st.k], z0 = [st.z0.x, st.z0.y];
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });
    B.grid({ ...mR, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'u', ayLab: 'v' });

    // 左图：z0 与两个位移
    const Z0 = V(mL.px(z0[0]), mL.py(z0[1]));
    const h1 = [st.rho, 0], h2 = [st.rho * Math.cos(st.th), st.rho * Math.sin(st.th)];
    B.arrow(Z0, V(mL.px(z0[0] + h1[0]), mL.py(z0[1] + h1[1])), { stroke: '#ff6b6b', 'stroke-width': 2.2 });
    B.arrow(Z0, V(mL.px(z0[0] + h2[0]), mL.py(z0[1] + h2[1])), { stroke: '#ff9e4a', 'stroke-width': 2.2 });
    B.dot(Z0, 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.6 });
    B.tex(V(Z0.x + 14, Z0.y - 10), '$z_0$', { size: 13, color: '#ffd166', w: 30 });
    B.tex(V(mL.px(mL.X0) + 6, mR.py(mR.Y1) + 13), '$z$ 平面', { size: 12.5, color: '#93a1b5', w: 70 });

    // 右图：差商随方向角转一整圈的轨迹
    let d = '';
    for (let i = 0; i <= 180; i++) {
      const q = Q(z0, i / 180 * TAU, st.rho);
      d += (i ? 'L' : 'M') + mR.px(q[0]).toFixed(1) + ' ' + mR.py(q[1]).toFixed(1) + ' ';
    }
    B.dyn.appendChild(mk('path', { d: d + 'Z', fill: 'none', stroke: '#5cadff', 'stroke-width': 1.8, 'stroke-opacity': .85 }, B.dyn));

    const q1 = Q(z0, 0, st.rho), q2 = Q(z0, st.th, st.rho);
    B.dot(V(mR.px(q1[0]), mR.py(q1[1])), 5, { fill: '#ff6b6b', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.dot(V(mR.px(q2[0]), mR.py(q2[1])), 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 13), '$w$ 平面：差商的轨迹', { size: 12.5, color: '#93a1b5', w: 190 });

    const der = S.der ? S.der(z0) : null;
    cA(`$${cn(q1[0], q1[1])}$`, '');
    cB(`$${cn(q2[0], q2[1])}$`, '');
    cD(der ? `$f'(z_0)=${cn(der[0], der[1])}$` : '$f\'(z_0)$ 不存在', '');
    const flat = Math.hypot(q1[0] - q2[0], q1[1] - q2[1]);
    cJ(der ? '两个方向读到同一个值，差商轨迹缩成一点' : (flat > 2e-3 ? '两个方向读出不同的值，极限与方向有关，导数不存在' : '这一点的两个方向碰巧相同，换个方向再看'), der ? 'good' : 'bad');
    B.hintM(S.v);
  };

  B.handle({
    get: () => V(mL.px(st.z0.x), mL.py(st.z0.y)),
    set: p => { st.z0 = V((p.x - mL.px(0)) / mL.s, (mL.py(0) - p.y) / mL.s); },
    clamp: p => V(Math.max(mL.px(mL.X0) + 8, Math.min(mL.px(mL.X1) - 8, p.x)), Math.max(mL.py(mL.Y1) + 8, Math.min(mL.py(mL.Y0) - 8, p.y))),
    color: '#ffd166', r: 8,
    drag: () => B.render(),
  });

  const bts = P.map((p, i) => B.btnM(p.n, () => {
    st.k = i;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.slider('方向角 θ', 0, 6.28, 0.02, st.th, v => { st.th = v; B.render(); }, 'th');
  B.slider('位移大小 |h|', 0.04, 0.6, 0.01, st.rho, v => { st.rho = v; B.render(); }, 'h');

  B.render();
  return B;
}
