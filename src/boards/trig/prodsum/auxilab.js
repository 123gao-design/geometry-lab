/* 图 Q2 辅助角机：a sin x + b cos x = R sin(x+φ)，R=√(a²+b²)、φ=atan2(b,a) ——
   两列波叠成一列纯 sin；右上直角三角形读出 R 与 φ（F1 三旋钮的结论：R 管峰高、φ 管起点）。 */
import { TrigLegendBoard } from '../trig-board.js';
import { mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 860, 520);
  B.groupReadings('公式与数值');
  const st = { a: 1, b: 1, x0: Math.PI / 6, grid: true, labs: true };
  const sA = B.slider('系数 a', -2, 2, 0.25, st.a, v => { st.a = v; B.render(); }, undefined, n => `系数 $a=${n}$`);
  const sB = B.slider('系数 b', -2, 2, 0.25, st.b, v => { st.b = v; B.render(); }, undefined, n => `系数 $b=${n}$`);
  B.slider('探针 x₀', -0.5, TAU + 0.5, 0.01, st.x0, v => { st.x0 = v; B.render(); }, undefined, n => `探针 $x_0=${n}$`);
  B.graphToggles(st, ['grid', 'labs']);
  const examples = [
    { name: '$\\sin x+\\cos x$', a: 1, b: 1 },
    { name: '$\\sin x-\\cos x$', a: 1, b: -1 },
  ];
  B.choiceRow('选择例题', examples, () => examples.findIndex(e => e.a === st.a && e.b === st.b), i => {
    st.a = examples[i].a; st.b = examples[i].b;
    sA.sync(st.a); sB.sync(st.b); B.render();
  });
  const cR = B.readout('$R$', 'gold'), cP = B.readout('$\\varphi$', 'mint'), cV = B.readout('探针核验', 'blue'), cJ = B.chipM('判读');

  const m = B.isoFit(-0.3, TAU + 0.3, -3, 3, B.plotRect);
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
      B.mark(V(m.px(x0), m.py(L)), '#5cadff');
    }
    // 右上直角三角形：横腿 a、竖腿 b、斜边 R、夹角 φ —— a、b 带符号，腿自动翻向
    const T0 = V(664, 128), S = 30;
    const A2 = V(T0.x + a * S, T0.y), B2 = V(T0.x + a * S, T0.y - b * S);
    if (R > 0.04) {
      B.seg(T0, A2, { stroke: '#5cadff', 'stroke-width': 2 });
      B.seg(A2, B2, { stroke: '#5cadff', 'stroke-width': 2 });
      B.seg(T0, B2, { stroke: '#ffd166', 'stroke-width': 2 });
      B.text(V((T0.x + A2.x) / 2, T0.y + (b >= 0 ? 16 : -10)), `a=${fmt(a, 2)}`, { 'font-size': 11, fill: '#5cadff' });
      const bOut = a > 0.05 ? 1 : -1;   // b 标在竖腿外侧：竖腿与 T0 之间是三角形内部，另一侧才是空处
      B.text(V(A2.x + bOut * 10, (A2.y + B2.y) / 2), `b=${fmt(b, 2)}`, { 'font-size': 11, fill: '#5cadff', 'text-anchor': bOut > 0 ? 'start' : 'end' });
      // R 标在斜边外侧：法向朝三角形内时翻向，短标签不压 b、φ
      const legDx = B2.x - T0.x, legDy = B2.y - T0.y, legL = Math.hypot(legDx, legDy) || 1;
      let nx = legDy / legL, ny = -legDx / legL;
      if (nx * (A2.x - (T0.x + B2.x) / 2) + ny * (A2.y - (T0.y + B2.y) / 2) > 0) { nx = -nx; ny = -ny; }
      B.tex(V((T0.x + B2.x) / 2 + nx * 20, (T0.y + B2.y) / 2 + ny * 20), '$R$', { size: 12, color: '#ffd166', anchor: 'mid', w: 30 });
      if (Math.abs(ph) > 0.03) {
        const n = 24, pts = [];
        for (let i = 0; i <= n; i++) { const t = ph * i / n; pts.push(`${(T0.x + 16 * Math.cos(t)).toFixed(1)},${(T0.y - 16 * Math.sin(t)).toFixed(1)}`); }
        mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.4 }, B.dyn);
        B.tex(V(T0.x + 24 * Math.cos(ph / 2), T0.y - 24 * Math.sin(ph / 2)), '$\\varphi$', { size: 11, color: '#67e8f9', anchor: 'mid', w: 24 });
      }
      B.dot(T0, 2.6, { fill: '#93a1b5' });
    }
    B.note('$a\\sin x+b\\cos x$', '#5cadff');
    if (R > 1e-9) B.note('$R\\sin(x+\\varphi)$', '#ffd166', 'dashed');
    // chips
    cR(`$R=\\sqrt{a^2+b^2}=${fmt(R, 3)}$`);
    cP(R > 1e-9 ? `$\\varphi\\approx ${fmt(ph, 3)}\\,\\mathrm{rad}$，约 $${fmt(ph * 180 / Math.PI, 1)}^\\circ$` : '相位任意');
    cV(`原式 $${fmt(L, 3)}$，辅助角式 $${fmt(Rv, 3)}$`, Math.abs(L - Rv) < 1e-9 ? 'ok' : 'warn');
    if (R < 1e-9) cJ('$a=b=0$ 时函数恒为零，任意相位都得到同一条水平线。');
    else cJ(`振幅 $R=\\sqrt{a^2+b^2}$。由 $\\cos\\varphi=a/R$、$\\sin\\varphi=b/R$ 同时确定相位的终边。`);
  };
  B.render();
  B.hint('拖 a、b：蓝实（原始叠加）与金虚（辅助角写法）恒重合 —— 两列波叠成一列，峰高 R、起点 φ 全在直角三角形上读');
  return B;
}
