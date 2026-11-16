/* 图 解4 · 柯西积分公式机
   左图 z 平面画一条以原点为心、半径 R 的逆时针圆路，点 z0 可以拖到任何地方。
   右图 w 平面画出 f 在这条圆路上的取值围成的曲线，并用金色点标出 f(z0)。
   公式说：z0 在圆内时，1/(2πi)∮f(z)/(z-z0)dz 就等于 f(z0)；z0 在圆外时这个积分是 0。
   两个预设：① f=e^z（处处解析，边界值绕一圈，中心点恰好是 f(z0)）
             ② f=z²（同上，边界取值更简单地围成一个圈）。 */
import { Board, V, fmt, mk, TAU } from '../../../lib/board.js';

const P = [
  { n: '① $f=e^z$', f: (x, y) => [Math.exp(x) * Math.cos(y), Math.exp(x) * Math.sin(y)],
    v: '把 $z_0$ 拖进圆内：右图金色点落在边界曲线围出的地方，积分值等于 $f(z_0)$' },
  { n: '② $f=z^2$', f: (x, y) => [x * x - y * y, 2 * x * y],
    v: '换一个解析函数，结论不变：圆内任一点的值，由整条边界上的值一次算定' },
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
  const st = { k: 0, R: 1.2, z0: V(0.4, 0.3) };
  const mL = B.isoFit(-2.3, 2.3, -2.0, 2.0, [26, 16, 340, 392], 22);
  const cF = B.chipM('$f(z_0)$'), cI = B.chipM('边界积分'), cD = B.chipM('差'), cJ = B.chipM('判读');
  const N = 240;

  // 1/(2πi)∮ f(z)/(z-z0) dz —— 逆时针圆路，每段取中点求 f、取弦作 dz（中点法，误差 O(h²)）
  function contour(F) {
    const R = st.R, x0 = st.z0.x, y0 = st.z0.y, h = TAU / N;
    let re = 0, im = 0;
    for (let i = 0; i < N; i++) {
      const b = (i + 1) / N * TAU, a = b - h / 2;
      const xa = R * Math.cos(a), ya = R * Math.sin(a);
      const dx = R * Math.cos(b) - R * Math.cos(b - h), dy = R * Math.sin(b) - R * Math.sin(b - h);
      const fv = P[st.k].f(xa, ya);
      const wx = xa - x0, wy = ya - y0, d2 = wx * wx + wy * wy || 1e-12;
      // f(z)/(z-z0)
      const qr = (fv[0] * wx + fv[1] * wy) / d2, qi = (fv[1] * wx - fv[0] * wy) / d2;
      re += qr * dx - qi * dy;
      im += qr * dy + qi * dx;
    }
    return [im / TAU, -re / TAU]; // 除以 2πi 等价于乘 -i/(2π)
  }

  B.renderFn = () => {
    const S = P[st.k], R = st.R, z0 = st.z0;
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });

    // 左图：圆路、z0 与「内部/外部」提示
    const O = V(mL.px(0), mL.py(0)), rr = R * mL.s;
    B.dyn.appendChild(mk('circle', { cx: O.x, cy: O.y, r: rr, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.2 }, B.dyn));
    const inside = Math.hypot(z0.x, z0.y) < R - 1e-6;
    const Z0 = V(mL.px(z0.x), mL.py(z0.y));
    B.dot(Z0, 6, { fill: inside ? '#ff9e4a' : '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.tex(V(Z0.x + 14, Z0.y - 10), '$z_0$', { size: 13, color: inside ? '#ff9e4a' : '#93a1b5', w: 30 });
    B.tex(V(mL.px(mL.X0) + 6, mL.py(mL.Y1) + 14), inside ? '$z_0$ 在圆内：积分读 $f(z_0)$' : '$z_0$ 在圆外：积分为 $0$', { size: 12, color: '#93a1b5', w: 240 });

    // 右图：f 在边界上的取值围成的曲线
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const a = i / N * TAU;
      pts.push(S.f(R * Math.cos(a), R * Math.sin(a)));
    }
    let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
    for (const p of pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    const fz = S.f(z0.x, z0.y);
    x0 = Math.min(x0, fz[0]); x1 = Math.max(x1, fz[0]); y0 = Math.min(y0, fz[1]); y1 = Math.max(y1, fz[1]);
    const padx = Math.max(0.7, (x1 - x0) * .2), pady = Math.max(0.7, (y1 - y0) * .2);
    const mR = B.isoFit(x0 - padx, x1 + padx, y0 - pady, y1 + pady, [402, 16, 396, 392], 24);
    B.grid({ ...mR, sx: 1, sy: 1, lx: 2, ly: 2, axLab: 'u', ayLab: 'v' });
    let d = '';
    pts.forEach((p, i) => { d += (i ? 'L' : 'M') + mR.px(p[0]).toFixed(1) + ' ' + mR.py(p[1]).toFixed(1) + ' '; });
    B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: '#67e8f9', 'stroke-width': 2 }, B.dyn));
    B.dot(V(mR.px(fz[0]), mR.py(fz[1])), 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 14), '$w$ 平面：边界值的像与 $f(z_0)$', { size: 12, color: '#93a1b5', w: 230 });

    const val = inside ? fz : [0, 0];
    const iv = contour(S.f);
    cF(`$${cn(val[0], val[1])}$`, '');
    cI(`$${cn(iv[0], iv[1])}$`, '');
    cD(`$${fmt(Math.hypot(iv[0] - val[0], iv[1] - val[1]), 3)}$`, '');
    cJ(inside ? '圆内：积分值 $=f(z_0)$' : '圆外：积分值 $=0$，而 $f(z_0)$ 不必为零', inside ? 'good' : 'bad');
    B.hintM(S.v);
  };

  B.handle({
    get: () => V(mL.px(st.z0.x), mL.py(st.z0.y)),
    set: p => { st.z0 = V((p.x - mL.px(0)) / mL.s, (mL.py(0) - p.y) / mL.s); },
    clamp: p => V(Math.max(mL.px(mL.X0) + 8, Math.min(mL.px(mL.X1) - 8, p.x)), Math.max(mL.py(mL.Y1) + 8, Math.min(mL.py(mL.Y0) - 8, p.y))),
    color: '#ff9e4a', r: 8,
    drag: () => B.render(),
  });

  const bts = P.map((p, i) => B.btnM(p.n, () => {
    st.k = i;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.slider('半径 R', 0.6, 1.8, 0.05, st.R, v => { st.R = v; B.render(); }, 'R');

  B.render();
  return B;
}
