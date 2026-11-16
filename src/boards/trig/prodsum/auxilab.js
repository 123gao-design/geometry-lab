/* 图 Q2 辅助角机：a sin x + b cos x = R sin(x+φ)，R=√(a²+b²)、φ=atan2(b,a) ——
   两列波叠成一列纯 sin；右上直角三角形读出 R 与 φ（F1 三旋钮的结论：R 管峰高、φ 管起点）。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { a: 1, b: 1, x0: Math.PI / 6, grid: true, labs: true };
  const sA = B.slider('系数 a', -2, 2, 0.25, st.a, v => { st.a = v; B.render(); });
  const sB = B.slider('系数 b', -2, 2, 0.25, st.b, v => { st.b = v; B.render(); });
  const sX = B.slider('探针 x₀', -0.5, TAU + 0.5, 0.01, st.x0, v => { st.x0 = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  const pre = (a, b) => () => { st.a = a; st.b = b; sA.sync(a); sB.sync(b); B.render(); };
  B.btnM('$\\sin x+\\cos x$', pre(1, 1));
  B.btnM('$\\sin x-\\cos x$', pre(1, -1));
  const cR = B.chipM('R'), cP = B.chipM('φ'), cV = B.chipM('探针核验'), cJ = B.chipM('判读');

  const m = B.isoFit(-0.3, TAU + 0.3, -3, 3);
  const sam = f => {
    const xs = [];
    for (let i = 0; i <= 420; i++) xs.push(m.X0 + (m.X1 - m.X0) * i / 420);
    for (let k = -2; k <= 8; k++) { xs.push(k * Math.PI / 2, k * Math.PI); }
    xs.sort((p, q) => p - q);
    return xs.filter(x => x >= m.X0 - 1e-9 && x <= m.X1 + 1e-9).map(x => `${m.px(x).toFixed(1)},${m.py(f(x)).toFixed(1)}`);
  };
  const poly = (pts, color, w, op = 1, dash) => mk('polyline', {
    points: pts.join(' '), fill: 'none', stroke: color, 'stroke-width': w, opacity: op, ...(dash ? { 'stroke-dasharray': dash } : {}),
  }, B.dyn);
  const piLab = () => {
    const labs = ['0', 'π/2', 'π', '3π/2', '2π'];
    for (let k = 0; k <= 4; k++) {
      const x = k * Math.PI / 2;
      if (x < m.X0 + 0.05 || x > m.X1 - 0.05) continue;
      B.text(V(m.px(x), m.py(0) + 17), labs[k], { 'font-size': 11, fill: '#5c6a80' });
      B.seg(V(m.px(x), m.py(0) - 4), V(m.px(x), m.py(0) + 4), { stroke: '#5c6a80', 'stroke-width': 1 });
    }
  };

  B.renderFn = () => {
    const { a, b, x0 } = st;
    const R = Math.hypot(a, b), ph = Math.atan2(b, a);
    B.grid({ ...m, sx: Math.PI / 2, sy: 1, lx: Math.PI / 2, ly: 1, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) piLab();
    // 蓝实：原始叠加 a sinx + b cosx；金虚：辅助角写法 R sin(x+φ) —— 恒重合
    poly(sam(x => a * Math.sin(x) + b * Math.cos(x)), '#5cadff', 2.2);
    if (R > 1e-9) poly(sam(x => R * Math.sin(x + ph)), '#ffd166', 1.6, .9, '8 6');
    // 探针
    const L = a * Math.sin(x0) + b * Math.cos(x0), Rv = R * Math.sin(x0 + ph);
    if (x0 >= m.X0 && x0 <= m.X1) {
      B.seg(V(m.px(x0), m.py(0)), V(m.px(x0), m.py(L)), { stroke: '#67e8f9', 'stroke-width': 1.2, 'stroke-dasharray': '4 3' });
      B.dot(V(m.px(x0), m.py(L)), 3.6, { fill: '#5cadff' });
      B.dot(V(m.px(x0), m.py(Rv)), 3.6, { fill: '#ffd166' });
    }
    // 右上直角三角形：横腿 a、竖腿 b、斜边 R、夹角 φ —— a、b 带符号，腿自动翻向
    const T0 = V(664, 128), S = 30;
    const A2 = V(T0.x + a * S, T0.y), B2 = V(T0.x + a * S, T0.y - b * S);
    if (R > 0.04) {
      B.seg(T0, A2, { stroke: '#5cadff', 'stroke-width': 2 });
      B.seg(A2, B2, { stroke: '#5cadff', 'stroke-width': 2 });
      B.seg(T0, B2, { stroke: '#ffd166', 'stroke-width': 2 });
      B.text(V((T0.x + A2.x) / 2, T0.y + 16), `a=${fmt(a, 2)}`, { 'font-size': 11, fill: '#5cadff' });
      B.text(V(A2.x + (b >= 0 ? 14 : -14), (A2.y + B2.y) / 2), `b=${fmt(b, 2)}`, { 'font-size': 11, fill: '#5cadff', 'text-anchor': b >= 0 ? 'start' : 'end' });
      B.tex(V((T0.x + B2.x) / 2 + (a >= 0 ? 10 : -10), (T0.y + B2.y) / 2 - 10), `$R=\\sqrt{a^2+b^2}$`, { size: 12, color: '#ffd166', anchor: a >= 0 ? 'start' : 'end', w: 130 });
      if (Math.abs(ph) > 0.03) {
        const n = 24, pts = [];
        for (let i = 0; i <= n; i++) { const t = ph * i / n; pts.push(`${(T0.x + 16 * Math.cos(t)).toFixed(1)},${(T0.y - 16 * Math.sin(t)).toFixed(1)}`); }
        mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.4 }, B.dyn);
        B.tex(V(T0.x + 30 * Math.cos(ph / 2), T0.y - 30 * Math.sin(ph / 2)), '$\\varphi$', { size: 12, color: '#67e8f9', w: 40 });
      }
      B.dot(T0, 2.6, { fill: '#93a1b5' });
    }
    // chips
    cR(`$R=\\sqrt{a^2+b^2}=${fmt(R, 3)}$`);
    cP(`$\\varphi=${fmt(ph, 3)}\\approx${fmt(ph * 180 / Math.PI, 1)}°$（按 (a,b) 定象限）`);
    cV(`$a\\sin x_0+b\\cos x_0=${fmt(L, 3)}=R\\sin(x_0+\\varphi)=${fmt(Rv, 3)}$`, Math.abs(L - Rv) < 1e-9 ? 'ok' : 'warn');
    if (R < 1e-9) cJ('全零排除：a=b=0 时 R=0、恒为 0 —— 不表示任何波形', 'warn');
    else if (Math.abs(b) < 1e-9) cJ('纯 sin 波：φ=0，辅助角不出现（F1 的 A=a）', '');
    else if (Math.abs(a) < 1e-9) cJ('纯 cos 波：φ=π/2 —— W2 的 cos x=sin(x+π/2) 的同一情形', '');
    else cJ(`两波叠成一列纯 sin：R=${fmt(R, 2)} 管峰高、φ=${fmt(ph, 2)} 管起点（F1 三旋钮的结论）`, '');
  };
  B.render();
  B.hint('拖 a、b：蓝实（原始叠加）与金虚（辅助角写法）恒重合 —— 两列波叠成一列，峰高 R、起点 φ 全在直角三角形上读');
  return B;
}
