/* 图 H2 周期折叠机：arcsin(sin θ) 的判读现场 —— sin θ 的水平线同高的角不止一个，
   arcsin 只认主值窗 [−π/2, π/2] 内的那个；窗外的角按镜像/整圈改判，折叠波把正弦压成三角波。 */
import { TrigLegendBoard, angleTex } from '../trig-board.js';
import { mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 860, 520);
  B.groupReadings('公式与数值');
  const st = { th: Math.PI / 3, fold: true, grid: true, labs: true };
  // 主值窗内改判：先把 θ 的正弦折回 (−π, π]，再镜像进 [−π/2, π/2]
  const fold = th => { const r = ((th + Math.PI / 2) % TAU + TAU) % TAU - Math.PI / 2; return r > Math.PI / 2 ? Math.PI - r : r; };
  const sT = B.slider('角 θ', 0, TAU, 0.01, st.th, v => { st.th = v; B.render(); }, undefined, (_, v) => `角 $\\theta=${angleTex(v)}$`);
  B.angleRow([30, 120, 210, 300], () => st.th, a => { st.th = a; sT.sync(a); B.render(); });
  B.toggleBtn('折叠波', true, v => { st.fold = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  const cS = B.readout('$\\sin\\theta$', 'blue'), cF = B.readout('$\\arcsin(\\sin\\theta)$', 'gold'), cJ = B.chipM('判读');

  const poly = (ptsPx, at) => mk('polyline', { points: ptsPx.map(p => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' '), fill: 'none', ...at }, B.dyn);
  const sam = (xa, xb, anchors, n = 280) => {
    const xs = [...(anchors || [])];
    for (let i = 0; i <= n; i++) xs.push(xa + (xb - xa) * i / n);
    xs.sort((a, b) => a - b);
    return xs;
  };

  B.renderFn = () => {
    const th = st.th, s = Math.sin(th), fd = fold(th);
    const m = B.isoFit(-1.75, TAU + 0.6, -1.95, 1.95, B.plotRect);
    B.grid({ ...m, sx: Math.PI / 4, sy: 0.5, xt: [], yt: [], grid: st.grid, labs: st.labs });
    if (st.labs) {
      const PIx = [[0, '0'], [Math.PI / 2, 'π/2'], [Math.PI, 'π'], [3 * Math.PI / 2, '3π/2'], [TAU, '2π']];
      for (const [v, s2] of PIx) B.text(V(m.px(v), m.py(0) + 15), s2, { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' });
      for (const [v, s2] of [[-1, '-1'], [1, '1']]) B.text(V(m.px(0) - 9, m.py(v) + 4), s2, { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'end' });
    }
    // 输出窗沿：arcsin 的值域 [−π/2, π/2] 压在图上（金虚线）
    for (const w of [Math.PI / 2, -Math.PI / 2]) {
      B.seg(V(m.px(m.X0), m.py(w)), V(m.px(m.X1), m.py(w)), { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '6 5', 'stroke-opacity': .65 });
      B.text(V(m.px(m.X1) - 6, m.py(w) - 6), (w > 0 ? 'π/2' : '−π/2'), { 'font-size': 11, fill: '#ffd166', 'text-anchor': 'end' });
    }
    // 正弦波（蓝）+ 折叠波 y=arcsin(sin x)（金，三角波）
    poly(sam(m.X0, m.X1, [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, TAU]).map(x => [m.px(x), m.py(Math.sin(x))]), { stroke: '#5cadff', 'stroke-width': 2.2 });
    if (st.fold) poly(sam(m.X0, m.X1, [m.X0, 0, Math.PI / 2, 3 * Math.PI / 2, TAU, m.X1]).map(x => [m.px(x), m.py(fold(x))]), { stroke: '#ffd166', 'stroke-width': 2.2, 'stroke-opacity': .9 });
    // 探针：竖线 θ + 横线 y=sin θ；同高诸角 —— 主值金点、其余空心；θ 本身青点
    B.seg(V(m.px(th), m.py(m.Y0)), V(m.px(th), m.py(m.Y1)), { stroke: '#67e8f9', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
    B.seg(V(m.px(m.X0), m.py(s)), V(m.px(m.X1), m.py(s)), { stroke: '#67e8f9', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
    const a = Math.asin(s), cand = [];
    for (const k of [-1, 0, 1]) { cand.push(a + k * TAU, Math.PI - a + k * TAU); }
    cand.sort((p, q) => p - q);
    const hits = [];
    for (const x of cand) if (x >= m.X0 - 1e-9 && x <= m.X1 + 1e-9 && (!hits.length || x - hits[hits.length - 1] > 1e-6)) hits.push(x);
    for (const x of hits) {
      if (Math.abs(x - fd) < 1e-6) continue;
      B.dot(V(m.px(x), m.py(s)), 4, { fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.5 });
    }
    if (Math.abs(th - fd) > 1e-6) B.mark(V(m.px(th), m.py(s)), '#67e8f9');
    B.seg(V(m.px(fd), m.py(0)), V(m.px(fd), m.py(s)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
    B.mark(V(m.px(fd), m.py(s)), '#ffd166');
    B.tex(V(m.px(fd), m.py(s) - 16), `$\\arcsin(\\sin\\theta)=${fmt(fd, 3)}$`, { size: 13, color: '#ffd166', anchor: 'mid', w: 200 });
    B.note('$y=\\sin x$', '#5cadff');
    if (st.fold) B.note('$y=\\arcsin(\\sin x)$', '#ffd166');
    // chips
    cS(`$\\sin\\theta=${fmt(s, 3)}$`, 'ok');
    cF(`$\\arcsin(\\sin\\theta)=${fmt(fd, 3)}$`, 'ok');
    if (th <= Math.PI / 2 + 1e-9) cJ(`θ 在主值窗内 —— 原样返回：$\\arcsin(\\sin\\theta)=\\theta$`, 'ok');
    else if (th <= Math.PI + 1e-9) cJ(`同高改判：$\\sin\\theta=\\sin(\\pi-\\theta)$，镜像取 $\\pi-\\theta=${fmt(Math.PI - th, 3)}$`, '');
    else if (th <= 3 * Math.PI / 2 + 1e-9) cJ(`下半岸同高：$\\pi-\\theta=${fmt(Math.PI - th, 3)}$ 落回窗内`, '');
    else cJ(`减整圈改判：$\\theta-2\\pi=${fmt(th - TAU, 3)}$ 落回窗内`, '');
  };
  B.render();
  B.hint('同高的角不止一个 —— arcsin 只认主值窗 [−π/2, π/2] 内的那个；金点即改判落点');
  return B;
}
