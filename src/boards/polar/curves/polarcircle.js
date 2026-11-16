/* 图 曲1 · 圆的极坐标方程
   圆心在极点：ρ=a。
   圆心在 (a,0)、过极点：ρ=2a cosθ，直径 OA 的两端为极点与 A(2a,0)，P 在圆上时 ∠OPA=90°。
   圆心在 (0,a)、过极点：ρ=2a sinθ。
   P 沿圆周滑动，橙色弧读极角，徽章分别给出方程、圆心半径与点 P 的极坐标。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { mode: 'cos', a: 1.5, phi: Math.PI / 2, grid: true, labs: true };
  const m = B.isoFit(-3.9, 3.9, -3.1, 3.1, [44, 30, 780, 390], 10);
  const cE = B.chipM('方程'), cC = B.chipM('圆心与半径'), cP = B.chipM('点 P'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);

  const geom = () => {
    const a = st.a;
    const c = st.mode === 'cos' ? V(a, 0) : st.mode === 'sin' ? V(0, a) : V(0, 0);
    const A = st.mode === 'cos' ? V(2 * a, 0) : st.mode === 'sin' ? V(0, 2 * a) : null;
    const P = V(c.x + a * Math.cos(st.phi), c.y + a * Math.sin(st.phi));
    return { a, c, A, P };
  };

  B.renderFn = () => {
    const { a, c, A, P } = geom();
    const O = V(m.px(0), m.py(0));
    // P 是数学坐标，画到画布上要逐点投影；直接丢给 B.seg/B.dot 会落到画布左上角
    const Pp = V(m.px(P.x), m.py(P.y));

    if (st.grid) {
      for (let rr = 1; rr <= 3; rr++) {
        const N = 64;
        for (let i = 0; i < N; i++) {
          const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
          B.seg(V(O.x + rr * m.s * Math.cos(a1), O.y - rr * m.s * Math.sin(a1)),
            V(O.x + rr * m.s * Math.cos(a2), O.y - rr * m.s * Math.sin(a2)),
            { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-opacity': .2 });
        }
      }
      for (let d = 30; d < 360; d += 30) {
        const rad = d * Math.PI / 180;
        B.seg(O, V(O.x + 3.7 * m.s * Math.cos(rad), O.y - 3.7 * m.s * Math.sin(rad)),
          { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-opacity': .14 });
      }
    }
    B.arrow(O, V(O.x + 3.78 * m.s, O.y), { stroke: '#5cadff', 'stroke-width': 1.8, head: 11, wide: 5 });
    if (st.labs) {
      B.text(V(O.x + 3.88 * m.s, O.y + 17), '极轴', { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
      for (let rr = 1; rr <= 3; rr++) {
        B.text(V(O.x - 4, O.y - rr * m.s + 14), `${rr}`, { 'font-size': 10.5, fill: '#8fa3bd', 'text-anchor': 'end' });
      }
    }

    // 圆
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(V(m.px(c.x + a * Math.cos(a1)), m.py(c.y + a * Math.sin(a1))),
        V(m.px(c.x + a * Math.cos(a2)), m.py(c.y + a * Math.sin(a2))),
        { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    }

    // 直径 OA 与圆周角 ∠OPA
    if (A) {
      const Ap = V(m.px(A.x), m.py(A.y));
      B.seg(O, Ap, { stroke: '#5cadff', 'stroke-width': 1.4, 'stroke-opacity': .45, 'stroke-dasharray': '5 5' });
      B.seg(O, Pp, { stroke: '#5cadff', 'stroke-width': 1.4, 'stroke-opacity': .55, 'stroke-dasharray': '5 5' });
      B.seg(Pp, Ap, { stroke: '#5cadff', 'stroke-width': 1.4, 'stroke-opacity': .55, 'stroke-dasharray': '5 5' });
      B.dot(Ap, 4, { fill: '#5cadff' });
      B.text(V(Ap.x + (st.mode === 'cos' ? 8 : 0), Ap.y + (st.mode === 'cos' ? 18 : -10)), 'A',
        { 'font-size': 12.5, 'font-weight': 700, fill: '#5cadff', 'text-anchor': st.mode === 'cos' ? 'start' : 'middle' });
      // 直角标记
      const dO = Math.hypot(O.x - Pp.x, O.y - Pp.y), dA = Math.hypot(Ap.x - Pp.x, Ap.y - Pp.y);
      if (dO > 9 && dA > 9) {
        const u1 = { x: (O.x - Pp.x) / dO, y: (O.y - Pp.y) / dO };
        const u2 = { x: (Ap.x - Pp.x) / dA, y: (Ap.y - Pp.y) / dA };
        const q1 = V(Pp.x + u1.x * 9, Pp.y + u1.y * 9);
        const q2 = V(Pp.x + u2.x * 9, Pp.y + u2.y * 9);
        const q3 = V(q1.x + u2.x * 9, q1.y + u2.y * 9);
        B.seg(q1, q3, { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-opacity': .8 });
        B.seg(q2, q3, { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-opacity': .8 });
      }
    }

    // 圆心
    const Cp = V(m.px(c.x), m.py(c.y));
    B.dot(Cp, 3.2, { fill: '#5cadff' });
    B.text(V(Cp.x + 8, Cp.y + 16), 'C', { 'font-size': 12.5, 'font-weight': 700, fill: '#5cadff' });

    // 极角弧与 OP
    let deg = Math.atan2(P.y, P.x) * 180 / Math.PI;
    if (deg < 0) deg += 360;
    const rhoAct = Math.hypot(P.x, P.y);
    if (rhoAct > 1e-6) {
      // 弧半径取定值：P 滑动时只改张角，弧不长不短
      const ar = 46, K = 34;
      const th = deg * Math.PI / 180;
      for (let i = 0; i < K; i++) {
        const a1 = th * i / K, a2 = th * (i + 1) / K;
        B.seg(V(O.x + ar * Math.cos(a1), O.y - ar * Math.sin(a1)),
          V(O.x + ar * Math.cos(a2), O.y - ar * Math.sin(a2)),
          { stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-opacity': .9 });
      }
      const am = th / 2;
      B.tex(V(O.x + (ar + 20) * Math.cos(am), O.y - (ar + 20) * Math.sin(am)),
        `$\\theta=${Math.round(deg)}^\\circ$`, { size: 12, anchor: 'mid', color: '#ff9e4a', w: 92 });
      B.arrow(O, Pp, { stroke: '#ffd166', 'stroke-width': 2.2, head: 12, wide: 5.5 });
    }

    B.dot(O, 3.6, { fill: '#12161f' });
    B.dot(Pp, 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(Pp.x + 10, Pp.y - 12), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });
    B.text(V(O.x - 4, O.y + 20), 'O', { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'end' });

    const eq = st.mode === 'cos' ? 2 * a * Math.cos(deg * Math.PI / 180)
      : st.mode === 'sin' ? 2 * a * Math.sin(deg * Math.PI / 180) : a;
    cE(st.mode === 'cos' ? `$\\rho=2a\\cos\\theta=${fz(2 * a)}\\cos\\theta$`
      : st.mode === 'sin' ? `$\\rho=2a\\sin\\theta=${fz(2 * a)}\\sin\\theta$`
        : `$\\rho=a=${fz(a)}$`);
    cC(st.mode === 'circ' ? `圆心在极点，半径 ${fz(a)}`
      : `圆心 $(${fz(st.mode === 'cos' ? a : 0)},\\ ${fz(st.mode === 'sin' ? a : 0)})$，半径 ${fz(a)}`);
    cP(rhoAct < 2e-2 ? '极点 $O$，$\\rho=0$' : `$P(\\rho,\\theta)=(${fz(rhoAct)},\\ ${Math.round(deg)}^\\circ)$`);
    if (st.mode === 'circ') {
      cJ(`圆心在极点，圆周上每一点到极点的距离都等于 ${fz(a)}，方程与 $\\theta$ 无关`);
    } else if (rhoAct < 2e-2) {
      cJ(`P 落在极点：$\\rho=0$，$\\theta$ 任意；方程在 $\\theta=${st.mode === 'cos' ? '\\pm90' : '0,180'}^\\circ$ 处也取 0`);
    } else if (Math.abs(eq - rhoAct) < 2e-2) {
      cJ(st.mode === 'cos'
        ? `$\\theta$ 在第一、四象限时 $\\cos\\theta>0$，方程给 $\\rho=${fz(eq)}$，与 $|OP|$ 相等`
        : `$\\theta$ 在第一、二象限时 $\\sin\\theta>0$，方程给 $\\rho=${fz(eq)}$，与 $|OP|$ 相等`);
    } else {
      cJ(`$\\theta$ 使 ${st.mode === 'cos' ? '\\cos\\theta' : '\\sin\\theta'}<0，方程给 $\\rho=${fz(eq)}$；改按正径写为 $(${fz(rhoAct)},\\ ${Math.round((deg + 180) % 360)}^\\circ)$`);
    }
  };

  const MODES = [
    { key: 'cos', nm: '① 圆心 (a,0)', phi: Math.PI / 2 },
    { key: 'sin', nm: '② 圆心 (0,a)', phi: 0 },
    { key: 'circ', nm: '③ 圆心在极点', phi: Math.PI / 4 },
  ];
  const btns = MODES.map((o, i) => B.btn(o.nm, () => {
    st.mode = o.key; st.phi = o.phi;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.slider('a', 0.5, 1.8, 0.1, st.a, v => { st.a = v; B.render(); }, 'ca');

  B.handle({
    color: '#ffd166', r: 7,
    get: () => { const g = geom(); return V(m.px(g.P.x), m.py(g.P.y)); },
    set: p => {
      const g = geom();
      const dx = (p.x - m.px(g.c.x)) / m.s, dy = (m.py(g.c.y) - p.y) / m.s;
      if (Math.hypot(dx, dy) > 1e-6) st.phi = Math.atan2(dy, dx);
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动 P 沿圆周走：圆心定住，方程 ρ=2a cosθ 或 ρ=2a sinθ 把圆周上每一点的极径写成极角的函数');
  B.render();
  return B;
}
