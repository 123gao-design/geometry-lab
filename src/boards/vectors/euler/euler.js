/* 图 欧2 · 欧拉公式与单位根
   单位圆上的点写成 e^{iθ}=cosθ+i sinθ：θ 是辐角，横纵投影正是余弦与正弦。
   把圆周 n 等分，各分点就是方程 z^n=1 的 n 个根 ζ_k=e^{2πki/n}，连起来是正 n 边形。
   拖动圆周上的 P 读欧拉公式；滑块调 n，等分点数与相邻夹角同时改。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { n: 6, deg: 60, grid: true, labs: true };
  const PRE = [
    { nm: '① 四等分', n: 4, deg: 90 },
    { nm: '② 六等分', n: 6, deg: 60 },
    { nm: '③ 三等分', n: 3, deg: 120 },
  ];
  const m = B.isoFit(-1.65, 1.65, -1.45, 1.45, [40, 30, 560, 388], 10);
  const cE = B.chipM('欧拉'), cR = B.chipM('单位根'), cS = B.chipM('求和'), cJ = B.chipM('判读');

  const zs = (a, b) => Math.abs(b) < 1e-9 ? fmt(a, 2)
    : `${fmt(a, 2)}${b < 0 ? '-' : '+'}${fmt(Math.abs(b), 2)}\\mathrm{i}`;

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'Re', ayLab: 'Im', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const rr = m.s;
    const n = Math.round(st.n);

    // 单位圆
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(V(O.x + rr * Math.cos(a1), O.y - rr * Math.sin(a1)),
        V(O.x + rr * Math.cos(a2), O.y - rr * Math.sin(a2)),
        { stroke: '#8fa3bd', 'stroke-width': 1.4, 'stroke-opacity': .75 });
    }
    // n 个根的连边形与根点
    const roots = [];
    for (let k = 0; k < n; k++) {
      const ang = 2 * Math.PI * k / n;
      roots.push(V(O.x + rr * Math.cos(ang), O.y - rr * Math.sin(ang)));
    }
    for (let k = 0; k < n; k++) {
      const p1 = roots[k], p2 = roots[(k + 1) % n];
      B.seg(p1, p2, { stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-opacity': .8 });
    }
    roots.forEach((p, k) => {
      B.dot(p, 3.8, { fill: '#ffd166' });
      if (n <= 6) {
        const ang = 2 * Math.PI * k / n;
        B.text(V(O.x + (rr + 17) * Math.cos(ang), O.y - (rr + 17) * Math.sin(ang)),
          `${k}`, { 'font-size': 10.5, fill: '#ffd166', 'text-anchor': 'middle' });
      }
    });

    // 圆周上的 P 与投影
    const th = st.deg * Math.PI / 180;
    const ca = Math.cos(th), sa = Math.sin(th);
    const P = V(O.x + rr * ca, O.y - rr * sa);
    B.seg(P, V(m.px(ca), m.py(0)), { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .75 });
    B.seg(P, V(m.px(0), m.py(sa)), { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .75 });
    B.seg(O, P, { stroke: '#5cadff', 'stroke-width': 2.2 });
    // 辐角弧
    if (st.deg > 1) {
      const ar = Math.min(44, rr * 0.3), K = 30;
      for (let i = 0; i < K; i++) {
        const a1 = th * i / K, a2 = th * (i + 1) / K;
        B.seg(V(O.x + ar * Math.cos(a1), O.y - ar * Math.sin(a1)),
          V(O.x + ar * Math.cos(a2), O.y - ar * Math.sin(a2)),
          { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-opacity': .9 });
      }
      const am = th / 2;
      B.tex(V(O.x + (ar + 19) * Math.cos(am), O.y - (ar + 19) * Math.sin(am)),
        `$\\theta=${st.deg}^\\circ$`, { size: 11.5, anchor: 'mid', color: '#ff9e4a', w: 80 });
    }
    B.dot(P, 4.6, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.1 });
    B.tex(V(P.x + 10, P.y - 12), '$\\mathrm{e}^{\\mathrm{i}\\theta}$', { size: 12, anchor: 'start', color: '#5cadff', w: 70 });
    B.dot(O, 3, { fill: '#e8eefc' });

    // 徽章
    cE(`$\\mathrm{e}^{\\mathrm{i}\\theta}=\\cos${st.deg}^\\circ+\\mathrm{i}\\sin${st.deg}^\\circ=${zs(ca, sa)}$`);
    cR(`$\\zeta_k=\\mathrm{e}^{2\\pi k\\mathrm{i}/${n}},\\quad k=0,1,\\dots,${n - 1}$`);
    cS(`$1+\\zeta+\\zeta^2+\\cdots+\\zeta^{${n - 1}}=0$`);
    let hit = -1;
    for (let k = 0; k < n; k++) {
      let d = Math.abs(st.deg - 360 * k / n) % 360;
      if (d > 180) d = 360 - d;
      if (d < 0.5 / n + 0.2) { hit = k; break; }
    }
    cJ(hit >= 0 ? `P 正落在第 ${hit} 个根上：此时 $\\mathrm{e}^{\\mathrm{i}\\theta}$ 是 $z^{${n}}=1$ 的一个根`
      : `${n} 个根均匀排在圆周上，相邻两根的夹角为 $\\dfrac{2\\pi}{${n}}=${fmt(360 / n, 1)}^\\circ$`);
  };

  B.handle({
    color: '#5cadff', r: 7,
    get: () => V(m.px(Math.cos(st.deg * Math.PI / 180)), m.py(Math.sin(st.deg * Math.PI / 180))),
    set: p => {
      const dx = (p.x - m.px(0)), dy = (m.py(0) - p.y);
      let d = Math.atan2(dy, dx) * 180 / Math.PI;
      if (d < 0) d += 360;
      st.deg = Math.round(d) % 360;
    },
  });

  const sl = B.slider('n', 2, 8, 1, st.n, v => { st.n = v; sl.sync(v); B.render(); }, 'n');
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.n = p.n; st.deg = p.deg;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    sl.sync(p.n);
    B.render();
  }, { on: i === 1 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动 P 读 e^{iθ} 的坐标；滑块改 n，圆周被等分成 n 份，分点即 z^n=1 的根');
  B.render();
  return B;
}
