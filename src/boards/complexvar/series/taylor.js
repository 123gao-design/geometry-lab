/* 图 级1 · 复级数与泰勒级数机
   左图 z 平面：金色虚线圈是收敛圆（椭圆内为收敛域），红点是函数的奇点，点 z 可拖。
   右图 w 平面：把部分和 S_0, S_1, …, S_N 依次连成一条折线——它走近 f(z) 还是越走越远，
   就是级数收敛与发散的样子。三个预设：① 1/(1−z) ② e^z ③ 1/(1+z²)。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const P = [
  { n: '① $\\dfrac1{1-z}$', R: 1, sing: [[1, 0]],
    f: (x, y) => { const d = (1 - x) * (1 - x) + y * y; return [(1 - x) / d, y / d]; },
    coef: () => 1,
    v: '$|z|<1$ 时部分和向 $\\dfrac1{1-z}$ 收拢；越过金圈，部分和越走越远' },
  { n: '② $e^z$', R: Infinity, sing: [],
    f: (x, y) => [Math.exp(x) * Math.cos(y), Math.exp(x) * Math.sin(y)],
    coef: k => { let r = 1; for (let i = 2; i <= k; i++) r /= i; return r; },
    v: '$e^z$ 在全平面解析，收敛半径无穷：无论点在哪里，级数都收敛' },
  { n: '③ $\\dfrac1{1+z^2}$', R: 1, sing: [[0, 1], [0, -1]],
    f: (x, y) => { const a = 1 + x * x - y * y, b = 2 * x * y, d = a * a + b * b || 1e-12; return [a / d, -b / d]; },
    coef: k => (k % 2 ? 0 : (k % 4 === 0 ? 1 : -1)),
    v: '奇点在 $\\pm i$，离原点的距离是 $1$，收敛半径就是 $1$' },
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
  const st = { k: 0, N: 12, z: [0.55, 0.4] };
  const mL = B.isoFit(-2.5, 2.5, -2.1, 2.1, [26, 16, 340, 392], 22);
  const cZ = B.chipM('$|z|$'), cS = B.chipM('部分和'), cF = B.chipM('$f(z)$'), cE = B.chipM('误差'), cJ = B.chipM('判读');

  function sums(S) {
    const [x, y] = st.z, pts = [];
    for (let n = 0; n <= st.N; n++) {
      // Horner：S = a_0 + a_1 z + … + a_n z^n
      let sr = 0, si = 0;
      for (let k = n; k >= 0; k--) {
        const nr = sr * x - si * y + S.coef(k), ni = sr * y + si * x;
        sr = nr; si = ni;
      }
      pts.push([sr, si]);
    }
    return pts;
  }

  B.renderFn = () => {
    const S = P[st.k];
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });

    // 左图：收敛圆、奇点、可拖的点
    const O = V(mL.px(0), mL.py(0));
    if (S.R < Infinity) {
      B.dyn.appendChild(mk('circle', { cx: O.x, cy: O.y, r: S.R * mL.s, fill: 'none', stroke: '#ffd166', 'stroke-width': 2, 'stroke-dasharray': '6 5' }, B.dyn));
      B.tex(V(O.x + 10, O.y - S.R * mL.s - 12), '$|z|=R$', { size: 12, color: '#ffd166', w: 70 });
    }
    for (const [sx, sy] of S.sing) {
      const sp = V(mL.px(sx), mL.py(sy));
      B.dot(sp, 4.5, { fill: '#ff6b6b', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.tex(V(sp.x + 8, sp.y - 9), '$' + cn(sx, sy, 1) + '$', { size: 11.5, color: '#ff6b6b', w: 46 });
    }
    const Z = V(mL.px(st.z[0]), mL.py(st.z[1]));
    B.dot(Z, 6, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.tex(V(Z.x + 13, Z.y - 10), '$z$', { size: 13, color: '#ff9e4a', w: 24 });
    B.tex(V(mL.px(mL.X0) + 6, mL.py(mL.Y1) + 14), '$z$ 平面：收敛圆与奇点', { size: 12, color: '#93a1b5', w: 210 });

    // 右图：部分和折线
    const pts = sums(S);
    const fz = S.f(st.z[0], st.z[1]);
    let Rv = Math.max(2.3, Math.hypot(fz[0], fz[1]) * 1.4);
    for (const p of pts) if (Math.hypot(p[0], p[1]) < 40) Rv = Math.max(Rv, Math.hypot(p[0], p[1]) * 1.15);
    Rv = Math.min(Rv, 30);
    const mR = B.isoFit(-Rv, Rv, -Rv, Rv, [402, 16, 396, 392], 20);
    B.grid({ ...mR, sx: 1, sy: 1, lx: 1, ly: 1, axLab: 'u', ayLab: 'v' });
    let d = '';
    let drawn = 0;
    for (const p of pts) {
      if (Math.hypot(p[0], p[1]) > 60) break;   // 远离视野就不画，免得线条拉出画框
      d += (drawn ? 'L' : 'M') + mR.px(p[0]).toFixed(1) + ' ' + mR.py(p[1]).toFixed(1) + ' ';
      drawn++;
    }
    if (drawn) B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.9 }, B.dyn));
    for (let i = 0; i < Math.min(pts.length, drawn); i++) {
      const p = pts[i];
      if (Math.hypot(p[0], p[1]) > 60) break;
      B.dot(V(mR.px(p[0]), mR.py(p[1])), i === drawn - 1 ? 5.5 : 2.4, { fill: i === drawn - 1 ? '#ff9e4a' : '#67e8f9', stroke: '#0a0d14', 'stroke-width': i === drawn - 1 ? 1.4 : 0.6 });
    }
    B.dot(V(mR.px(fz[0]), mR.py(fz[1])), 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 14), '$w$ 平面：部分和走向 $f(z)$', { size: 12, color: '#93a1b5', w: 230 });

    const zAbs = Math.hypot(st.z[0], st.z[1]);
    const last = pts[pts.length - 1];
    const err = Math.hypot(last[0] - fz[0], last[1] - fz[1]);
    const conv = S.R === Infinity || zAbs < S.R - 1e-9;
    cZ(`$${fmt(zAbs, 3)}$`, '');
    cS(`$${cn(last[0], last[1])}$`, '');
    cF(`$${cn(fz[0], fz[1])}$`, '');
    cE(`$${fmt(err, 3)}$`, err < 1e-2 ? 'ok' : 'warn');
    cJ(conv ? '在收敛圆内：部分和逼近 $f(z)$' : '在收敛圆外：部分和远离 $f(z)$', conv ? 'good' : 'bad');
    B.hintM(S.v);
  };

  B.handle({
    get: () => V(mL.px(st.z[0]), mL.py(st.z[1])),
    set: p => { st.z = [(p.x - mL.px(0)) / mL.s, (mL.py(0) - p.y) / mL.s]; },
    clamp: p => V(Math.max(mL.px(-2.3), Math.min(mL.px(2.3), p.x)), Math.max(mL.py(1.9), Math.min(mL.py(-1.9), p.y))),
    color: '#ff9e4a', r: 8,
    drag: () => B.render(),
  });

  const bts = P.map((p, i) => B.btnM(p.n, () => {
    st.k = i;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.slider('项数 N', 0, 30, 1, st.N, v => { st.N = v; B.render(); }, 'N');

  B.render();
  return B;
}
