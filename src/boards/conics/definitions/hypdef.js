/* 图 D2 · 双曲线第一定义：||PF₁| − |PF₂|| = 2a（含渐近线） */
import { Board, mk, V, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 500;
  const B = new Board(root, W, H);
  const st = { cx: 400, cy: 250, a: 88, c: 150, t: 0.55, s: 1 }; // s=±1：右/左支

  const bOf = () => Math.sqrt(st.c * st.c - st.a * st.a);
  const pt = (s, t) => V(st.cx + s * st.a / Math.cos(t), st.cy + bOf() * Math.tan(t));
  const F1 = () => V(st.cx - st.c, st.cy), F2 = () => V(st.cx + st.c, st.cy);

  const cDif = B.chipM('$|PF_1|-|PF_2|$'), cPar = B.chip('参数'), cE = B.chip('离心率');

  const syncSliders = () => {
    if (+sA.value !== st.a) { sA.value = st.a; sA.dispatchEvent(new Event('input')); }
    if (+sC.value !== st.c) { sC.value = st.c; sC.dispatchEvent(new Event('input')); }
  };
  const sA = B.slider('实半轴 a', 55, 130, 1, st.a, v => { st.a = v; if (st.c < st.a + 25) st.c = st.a + 25; syncSliders(); B.render(); });
  const sC = B.slider('半焦距 c', 100, 230, 1, st.c, v => { st.c = Math.max(v, st.a + 25); syncSliders(); B.render(); });

  const drawBranch = (s, at) => {
    const pts = [];
    for (let t = -1.32; t <= 1.32 + 1e-9; t += 0.03) { const p = pt(s, t); pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`); }
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };

  B.renderFn = () => {
    const { cx, cy, a, c } = st, b = bOf(), f1 = F1(), f2 = F2(), P = pt(st.s, st.t);
    // 坐标轴
    B.seg(V(24, cy), V(W - 24, cy), { stroke: '#22314a', 'stroke-width': 1.5 });
    B.seg(V(cx, 18), V(cx, H - 18), { stroke: '#22314a', 'stroke-width': 1.5 });
    // 渐近线 y = ±(b/a)(x − cx)
    for (const dir of [V(a, b), V(a, -b)])
      B.inf(V(cx, cy), V(cx + dir.x, cy + dir.y), { stroke: '#3a4a63', 'stroke-width': 1.4, 'stroke-dasharray': '7 6' });
    const tA = Math.min(W - 36 - cx, (cy - 30) * a / b); // 渐近线标签：沿线上移到顶边附近
    B.text(V(cx + tA, cy - b / a * tA - 8), '渐近线', { fill: '#5c6a80', 'font-size': 11.5 });
    // 双支
    drawBranch(1, { stroke: '#67e8f9', 'stroke-width': 2.6 });
    drawBranch(-1, { stroke: '#67e8f9', 'stroke-width': 2.6 });
    // 顶点
    for (const [p, nm] of [[V(cx - a, cy), 'A₁'], [V(cx + a, cy), 'A₂']]) {
      B.dot(p, 4, { fill: '#5c6a80' });
      B.text(V(p.x, p.y + 18), nm, { fill: '#5c6a80', 'font-size': 12 });
    }
    // 焦点
    for (const [f, nm] of [[f1, 'F₁'], [f2, 'F₂']]) {
      B.dot(f, 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
      B.text(V(f.x, f.y + 20), nm, { fill: '#ffd166', 'font-size': 13, 'font-weight': 700 });
    }
    // 两条焦半径
    B.seg(f1, P, { stroke: '#5cadff', 'stroke-width': 2.4 });
    B.seg(P, f2, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
    B.dot(P, 6.5, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(P.x, P.y - 14), 'P', { fill: '#67e8f9', 'font-size': 13, 'font-weight': 700 });
    const r1 = dist(P, f1), r2 = dist(P, f2), dif = r1 - r2;
    // 长度条：两条从同一原点出发，端点间距即 |差| = 2a
    const x0 = 88, k = 300 / Math.max(r1, r2, 2 * c);
    const y1 = H - 58, y2 = H - 36;
    B.text(V(x0 - 8, y1 + 10), '|PF₁|', { fill: '#5cadff', 'font-size': 11.5, 'text-anchor': 'end' });
    B.text(V(x0 - 8, y2 + 10), '|PF₂|', { fill: '#ff9e4a', 'font-size': 11.5, 'text-anchor': 'end' });
    mk('rect', { x: x0, y: y1, width: r1 * k, height: 11, fill: '#5cadff' }, B.dyn);
    mk('rect', { x: x0, y: y2, width: r2 * k, height: 11, fill: '#ff9e4a' }, B.dyn);
    const lo = Math.min(r1, r2), hi = Math.max(r1, r2);
    for (const xx of [lo, hi])
      B.seg(V(x0 + xx * k, y1 - 4), V(x0 + xx * k, y2 + 15), { stroke: '#5c6a80', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
    B.text(V(x0 + (lo + hi) / 2 * k, y1 - 9), `端点差 = 2a = ${fmt(2 * a, 0)}`, { fill: '#93a1b5', 'font-size': 11.5 });
    cDif(`${fmt(r1, 1)} − ${fmt(r2, 1)} = ${fmt(dif, 1)}　（${st.s > 0 ? '右支：+2a' : '左支：−2a'}）`, Math.abs(Math.abs(dif) - 2 * a) < 0.6 ? 'ok' : 'warn');
    cPar(`2a = ${fmt(2 * a, 0)}，2c = ${fmt(2 * c, 0)}，b = √(c²−a²) = ${fmt(b, 1)}`);
    cE(`e = c/a = ${fmt(c / a, 3)} > 1`, 'ok');
    B.hintM('拖动 P（可换支）：距离之差恒为 $\\pm 2a$；P 走远时曲线贴向渐近线 —— 这正是渐近线的由来');
  };

  B.handle({
    get: () => pt(st.s, st.t),
    set: p => {
      st.s = p.x >= st.cx ? 1 : -1;
      st.t = Math.max(-1.3, Math.min(1.3, Math.atan((p.y - st.cy) / bOf())));
    },
    color: '#67e8f9', r: 9, label: 'P', lo: [10, -12],
  });

  B.render();
  return B;
}
