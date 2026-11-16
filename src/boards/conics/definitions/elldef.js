/* 图 D1 · 椭圆第一定义：|PF₁| + |PF₂| = 2a（绳尺作图实验台） */
import { Board, mk, V, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 500;
  const B = new Board(root, W, H);
  const st = { cx: 400, cy: 246, a: 170, c: 96, t: 0.9, trace: -10 }; // trace < -4：未在作图

  const bOf = () => Math.sqrt(st.a * st.a - st.c * st.c);
  const pt = t => V(st.cx + st.a * Math.cos(t), st.cy + bOf() * Math.sin(t));
  const F1 = () => V(st.cx - st.c, st.cy), F2 = () => V(st.cx + st.c, st.cy);

  const cSum = B.chipM('$|PF_1|+|PF_2|$'), cPar = B.chip('参数'), cE = B.chip('离心率');

  // a、c 需保持 c ≤ a − 25（否则 b 虚了）
  const syncSliders = () => {
    if (+sA.value !== st.a) { sA.value = st.a; sA.dispatchEvent(new Event('input')); }
    if (+sC.value !== st.c) { sC.value = st.c; sC.dispatchEvent(new Event('input')); }
  };
  const sA = B.slider('长半轴 a', 120, 200, 1, st.a, v => { st.a = v; if (st.c > st.a - 25) st.c = st.a - 25; syncSliders(); B.render(); });
  const sC = B.slider('半焦距 c', 30, 175, 1, st.c, v => { st.c = Math.min(v, st.a - 25); syncSliders(); B.render(); });

  const tick = () => { // 绳尺作图：笔尖从 −π 扫到 π
    st.trace += 0.022;
    st.t = st.trace;
    if (st.trace >= Math.PI) { st.trace = -10; B.render(); return; }
    B.render(); B.raf(tick);
  };
  B.btn('🖊 绳尺作图', () => { if (st.trace < -4) { B.cancelRaf(); st.trace = -Math.PI; B.raf(tick); } }, { pri: true });

  const drawEll = (t0, t1, at) => {
    const pts = [], n = Math.max(2, Math.ceil(Math.abs(t1 - t0) / 0.035));
    for (let i = 0; i <= n; i++) { const p = pt(t0 + (t1 - t0) * i / n); pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`); }
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };

  B.renderFn = () => {
    const { cx, cy, a, c } = st, b = bOf(), f1 = F1(), f2 = F2(), P = pt(st.t);
    const tracing = st.trace > -4;
    // 坐标轴
    B.seg(V(24, cy), V(W - 24, cy), { stroke: '#22314a', 'stroke-width': 1.5 });
    B.seg(V(cx, 18), V(cx, H - 18), { stroke: '#22314a', 'stroke-width': 1.5 });
    // 椭圆（作图动画中：已画部分实线、未画部分虚线预告）
    if (tracing) {
      drawEll(-Math.PI, Math.PI, { stroke: '#2e3d57', 'stroke-width': 1.6, 'stroke-dasharray': '5 5' });
      drawEll(-Math.PI, st.trace, { stroke: '#67e8f9', 'stroke-width': 3 });
    } else drawEll(-Math.PI, Math.PI, { stroke: '#67e8f9', 'stroke-width': 2.6 });
    // 四个顶点
    for (const [p, nm] of [[V(cx - a, cy), 'A₁'], [V(cx + a, cy), 'A₂'], [V(cx, cy - b), 'B₁'], [V(cx, cy + b), 'B₂']])
      B.text(V(p.x + (p.x === cx ? 0 : (p.x < cx ? -4 : 4)), p.y + (p.x === cx ? (p.y < cy ? -8 : 16) : 18)), nm,
        { fill: '#5c6a80', 'font-size': 12 });
    // 焦点
    for (const [f, nm] of [[f1, 'F₁'], [f2, 'F₂']]) {
      B.dot(f, 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
      B.text(V(f.x, f.y + 20), nm, { fill: '#ffd166', 'font-size': 13, 'font-weight': 700 });
    }
    // 绳子：F₁ → P → F₂
    B.seg(f1, P, { stroke: '#5cadff', 'stroke-width': 2.4 });
    B.seg(P, f2, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
    B.dot(P, 6.5, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(P.x, P.y - 14), 'P', { fill: '#67e8f9', 'font-size': 13, 'font-weight': 700 });
    const r1 = dist(P, f1), r2 = dist(P, f2);
    // 长度条：两段绳长首尾相接，总长恒为 2a
    const x0 = 88, y0 = H - 44, k = 240 / (2 * a);
    B.text(V(x0 - 8, y0 + 11), '绳长', { fill: '#93a1b5', 'font-size': 11.5, 'text-anchor': 'end' });
    mk('rect', { x: x0, y: y0, width: 2 * a * k, height: 12, fill: '#22314a' }, B.dyn);
    mk('rect', { x: x0, y: y0, width: r1 * k, height: 12, fill: '#5cadff' }, B.dyn);
    mk('rect', { x: x0 + r1 * k, y: y0, width: r2 * k, height: 12, fill: '#ff9e4a' }, B.dyn);
    B.textM(V(x0 + a * k, y0 + 30), `蓝 $|PF_1|$ + 橙 $|PF_2|$ = $2a = ${fmt(2 * a, 0)}$（恒定）`, { fill: '#93a1b5', 'font-size': 11.5 });
    cSum(`${fmt(r1, 1)} + ${fmt(r2, 1)} = ${fmt(r1 + r2, 1)}`, Math.abs(r1 + r2 - 2 * a) < 0.6 ? 'ok' : 'warn');
    cPar(`2a = ${fmt(2 * a, 0)}，2c = ${fmt(2 * c, 0)}，b = √(a²−c²) = ${fmt(b, 1)}`);
    cE(`e = c/a = ${fmt(c / a, 3)} < 1`, 'ok');
    B.hint(tracing ? '笔尖把绳子绷紧 —— 无论转到哪，两段绳长之和都是绳全长 2a' : '拖动 P 沿椭圆走一圈：蓝橙两段之和纹丝不动。调节 a、c 重塑椭圆');
  };

  B.handle({
    get: () => pt(st.t),
    set: p => { st.t = Math.atan2((p.y - st.cy) / bOf(), (p.x - st.cx) / st.a); st.trace = -10; B.cancelRaf(); },
    color: '#67e8f9', r: 9, label: 'P', lo: [10, -12],
  });

  B.render();
  return B;
}
