/* 图 解2 · 柯西-黎曼方程机
   左半张复平面画出 u 的等值线（蓝）与 v 的等值线（橙）；拖点 z0，看两族曲线在这一点怎样相交。
   蓝箭头是 ∇u，橙箭头是 ∇v：柯西-黎曼方程成立时，两支梯度等长且互相垂直，等值线因此正交。
   三个预设：① f=z²（处处满足 CR）；② f=z̄（u_x=1, v_y=-1，两族等值线一边密一边疏）；
             ③ f=e^z（到处满足 CR，梯度长度 e^x 随点变）。 */
import { Board, V, fmt, mk, marchSegs } from '../../../lib/board.js';

const P = [
  { n: '① $f=z^2$', u: (x, y) => x * x - y * y, v: (x, y) => 2 * x * y,
    du: (x, y) => [2 * x, -2 * y], dv: (x, y) => [2 * y, 2 * x],
    ok: true, w: 'u=x²−y²，v=2xy：u_x=2x=v_y，u_y=−2y=−v_x，处处满足' },
  { n: '② $f=\\bar z$', u: (x, y) => x, v: (x, y) => -y,
    du: () => [1, 0], dv: () => [0, -1],
    ok: false, w: 'u=x，v=−y：u_x=1、v_y=−1，两式对不上，复平面上处处不可导' },
  { n: '③ $f=e^z$', u: (x, y) => Math.exp(x) * Math.cos(y), v: (x, y) => Math.exp(x) * Math.sin(y),
    du: (x, y) => [Math.exp(x) * Math.cos(y), -Math.exp(x) * Math.sin(y)], dv: (x, y) => [Math.exp(x) * Math.sin(y), Math.exp(x) * Math.cos(y)],
    ok: true, w: 'u=e^x cos y，v=e^x sin y：两式恒等，处处可导，梯度长度都等于 e^x' },
];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, z0: V(1, 1), lv: true };
  const m = B.isoFit(-2.5, 2.5, -2.05, 2.05, [56, 16, 706, 392], 26);
  const cUX = B.chipM('$u_x$'), cUY = B.chipM('$u_y$'), cVX = B.chipM('$v_x$'), cVY = B.chipM('$v_y$'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = P[st.k], x0 = st.z0.x, y0 = st.z0.y;
    B.grid({ ...m, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });

    if (st.lv) {
      // u 的等值线：蓝；v 的等值线：橙（marching squares 直接给出数学坐标的线段）
      for (let c = -4; c <= 4 + 1e-9; c += 1) {
        const su = marchSegs((x, y) => S.u(x, y) - c, m.X0, m.Y0, m.X1, m.Y1, 48, 48);
        if (su.length) B.dyn.appendChild(mk('path', { d: su.map(([a, b]) => `M${m.px(a.x).toFixed(1)},${m.py(a.y).toFixed(1)}L${m.px(b.x).toFixed(1)},${m.py(b.y).toFixed(1)}`).join(''), fill: 'none', stroke: '#5cadff', 'stroke-width': 1.1, 'stroke-opacity': .42 }, B.dyn));
        const sv = marchSegs((x, y) => S.v(x, y) - c, m.X0, m.Y0, m.X1, m.Y1, 48, 48);
        if (sv.length) B.dyn.appendChild(mk('path', { d: sv.map(([a, b]) => `M${m.px(a.x).toFixed(1)},${m.py(a.y).toFixed(1)}L${m.px(b.x).toFixed(1)},${m.py(b.y).toFixed(1)}`).join(''), fill: 'none', stroke: '#ff9e4a', 'stroke-width': 1.1, 'stroke-opacity': .5 }, B.dyn));
      }
    }

    // 两支梯度：同一比例尺，CR 成立时等长垂直
    const gu = S.du(x0, y0), gv = S.dv(x0, y0);
    const L = Math.max(Math.hypot(gu[0], gu[1]), Math.hypot(gv[0], gv[1]), 1e-6);
    const k = 1.15 / L;
    const Z0 = V(m.px(x0), m.py(y0));
    B.arrow(Z0, V(m.px(x0 + gu[0] * k), m.py(y0 + gu[1] * k)), { stroke: '#5cadff', 'stroke-width': 2.4 });
    B.arrow(Z0, V(m.px(x0 + gv[0] * k), m.py(y0 + gv[1] * k)), { stroke: '#ff9e4a', 'stroke-width': 2.4 });
    B.dot(Z0, 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.6 });
    B.tex(V(Z0.x + 14, Z0.y - 10), '$z_0$', { size: 13, color: '#ffd166', w: 30 });
    B.tex(V(m.px(m.X0) + 8, m.py(m.Y1) + 14), '蓝：$u$ 的等值线　橙：$v$ 的等值线　箭头：两支梯度', { size: 11.5, color: '#93a1b5', w: 360 });

    cUX(`$${fmt(gu[0], 2)}$`, '');
    cUY(`$${fmt(gu[1], 2)}$`, '');
    cVX(`$${fmt(gv[0], 2)}$`, '');
    cVY(`$${fmt(gv[1], 2)}$`, '');
    const ok = Math.abs(gu[0] - gv[1]) < 5e-3 && Math.abs(gu[1] + gv[0]) < 5e-3;
    cJ(ok ? '$u_x=v_y$ 且 $u_y=-v_x$，柯西-黎曼方程成立' : '$u_x\\ne v_y$ 或 $u_y\\ne -v_x$，柯西-黎曼方程不成立', ok ? 'good' : 'bad');
    B.hintM(S.w);
  };

  B.handle({
    get: () => V(m.px(st.z0.x), m.py(st.z0.y)),
    set: p => { st.z0 = V((p.x - m.px(0)) / m.s, (m.py(0) - p.y) / m.s); },
    clamp: p => V(Math.max(m.px(m.X0) + 8, Math.min(m.px(m.X1) - 8, p.x)), Math.max(m.py(m.Y1) + 8, Math.min(m.py(m.Y0) - 8, p.y))),
    color: '#ffd166', r: 8,
    drag: () => B.render(),
  });

  const bts = P.map((p, i) => B.btnM(p.n, () => {
    st.k = i;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.toggleBtn('等值线', true, on => { st.lv = on; B.render(); });

  B.render();
  return B;
}
