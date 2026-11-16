/* 图 N2 升降幂验证机：sin²x 与降幂写法 (1−cos2x)/2 是同一条曲线的两种记法 ——
   换写法不换数值，但周期折半（sin²x 周期 π）；半角公式的 ± 由 x₀/2 的象限判定。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { x0: Math.PI / 3, ghost: true, grid: true, labs: true };
  const sX = B.slider('探针 x₀', -0.5, TAU + 0.5, 0.01, st.x0, v => { st.x0 = v; B.render(); });
  B.toggleBtn('母波 sin x', true, v => { st.ghost = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  const cS = B.chipM('sin²x₀'), cH = B.chipM('降幂式'), cV = B.chipM('核验'), cP = B.chipM('平方关系'), cG = B.chipM('半角 ±');
  B.chipM('判读')('$\\sin^2x$ 周期 $\\pi$（平移 $\\pi$ 完全重合）· 值域 $[0,1]$（平方非负）· 谷在 $k\\pi$（sin 过零处）');

  const m = B.isoFit(-0.3, TAU + 0.3, -1.35, 1.35);
  const sam = (f, extra = []) => {
    const xs = [];
    for (let i = 0; i <= 420; i++) xs.push(m.X0 + (m.X1 - m.X0) * i / 420);
    for (let k = -2; k <= 8; k++) { xs.push(k * Math.PI / 2, k * Math.PI); }
    extra.forEach(x => xs.push(x));
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
    const x0 = st.x0;
    B.grid({ ...m, sx: Math.PI / 2, sy: 0.5, lx: Math.PI / 2, ly: 0.5, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) piLab();
    // 母波 sin x 灰虚对照 → 平方把负半波翻上来
    if (st.ghost) poly(sam(Math.sin), '#93a1b5', 1.4, .45, '5 5');
    // sin²x 蓝实 + 降幂式 (1−cos2x)/2 金虚 —— 完全重合
    poly(sam(x => Math.sin(x) ** 2), '#5cadff', 2.2);
    poly(sam(x => (1 - Math.cos(2 * x)) / 2), '#ffd166', 1.6, .9, '8 6');
    // 探针：两写法在同一点等高（蓝点金点叠影即恒等）
    const s2 = Math.sin(x0) ** 2, h = (1 - Math.cos(2 * x0)) / 2;
    if (x0 >= m.X0 && x0 <= m.X1) {
      B.seg(V(m.px(x0), m.py(0)), V(m.px(x0), m.py(s2)), { stroke: '#67e8f9', 'stroke-width': 1.2, 'stroke-dasharray': '4 3' });
      B.dot(V(m.px(x0), m.py(s2)), 3.6, { fill: '#5cadff' });
      B.dot(V(m.px(x0), m.py(h)), 3.6, { fill: '#ffd166' });
    }
    // 周期验收：x₀+π 处等高（空心点）—— sin² 周期 π
    const x1 = x0 + Math.PI;
    if (x1 <= m.X1) {
      B.seg(V(m.px(x0), m.py(s2)), V(m.px(x1), m.py(s2)), { stroke: '#67e8f9', 'stroke-width': 1, opacity: .55, 'stroke-dasharray': '3 3' });
      B.seg(V(m.px(x1), m.py(0)), V(m.px(x1), m.py(s2)), { stroke: '#67e8f9', 'stroke-width': 1, opacity: .6, 'stroke-dasharray': '4 3' });
      B.dot(V(m.px(x1), m.py(s2)), 3, { fill: 'none', stroke: '#5cadff', 'stroke-width': 1.5 });
    }
    // chips
    cS(`$\\sin^2 x_0=${fmt(s2, 3)}$`);
    cH(`$\\frac{1-\\cos2x_0}{2}=${fmt(h, 3)}$`);
    cV(Math.abs(s2 - h) < 1e-9 ? '恒等：降幂只改写法与周期，不改数值' : '偏差！', Math.abs(s2 - h) < 1e-9 ? 'ok' : 'warn');
    const c2v = Math.cos(x0) ** 2;
    cP(`$\\sin^2+\\cos^2=${fmt(s2 + c2v, 3)}=1$`, Math.abs(s2 + c2v - 1) < 1e-9 ? 'ok' : 'warn');
    // 半角：sin(x₀/2) = ±√((1−cos x₀)/2)，± 由 x₀/2 象限判定（沿用 U2 的开方判定）
    const sh = Math.sin(x0 / 2), rhs = Math.sqrt(Math.max(0, (1 - Math.cos(x0)) / 2));
    const hq = ((x0 / 2) % TAU + TAU) % TAU;
    const q = hq < Math.PI / 2 ? 1 : hq < Math.PI ? 2 : hq < 3 * Math.PI / 2 ? 3 : 4;
    const sign = sh >= 0 ? '+' : '-';
    cG(`$\\sin\\frac{x_0}{2}=${fmt(sh, 3)},\\ \\sqrt{\\frac{1-\\cos x_0}{2}}=${fmt(rhs, 3)}$ → 取「${sign}」（x₀/2 第${q}象限）`, Math.abs(Math.abs(sh) - rhs) < 1e-9 ? 'ok' : 'warn');
  };
  B.render();
  B.hintM('金虚线（降幂写法）与蓝实线（平方写法）完全重合：换写法不换数值；平方把负半波翻上来 —— $\\sin^2x$ 周期只有 $\\pi$');
  return B;
}
