/* 图 T2 · 椭圆聚光机：从 F₁ 射向曲面的光必反射进 F₂（切线平分焦半径外角，法线平分内角） */
import { mk, V, add, sub, dist, lerp, angDiff, acuteAng, arcPts, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 800, H = 500;
  const B = createConicLab(root, W, H);
  const st = { cx: 400, cy: 252, a: 175, c: 100, t: 0.75, pulse: 0, run: true };

  const bOf = () => Math.sqrt(st.a * st.a - st.c * st.c);
  const P = () => V(st.cx + st.a * Math.cos(st.t), st.cy + bOf() * Math.sin(st.t));
  const F1 = () => V(st.cx - st.c, st.cy), F2 = () => V(st.cx + st.c, st.cy);

  const cIn = B.chip('∠入射（对切线）'), cOut = B.chip('∠反射（对切线）'), cPath = B.chip('光程 F₁→P→F₂');

  B.toggleBtn('光脉冲', true, on => { st.run = on; });

  B.renderFn = () => {
    const { cx, cy, a, c } = st, b = bOf(), p = P(), f1 = F1(), f2 = F2();
    B.seg(V(24, cy), V(W - 24, cy), { stroke: plotInk.axis, 'stroke-width': 1.5 });
    B.seg(V(cx, 18), V(cx, H - 18), { stroke: plotInk.axis, 'stroke-width': 1.5 });
    // 椭圆
    const pts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03)
      pts.push(`${(cx + a * Math.cos(t)).toFixed(1)},${(cy + b * Math.sin(t)).toFixed(1)}`);
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.6 }, B.dyn);
    // 切线（平分外角的那条）
    const u0 = p.x - cx, v0 = p.y - cy;
    const d = V(-a * a * v0, b * b * u0);
    B.inf(p, add(p, d), { stroke: plotInk.ink, 'stroke-width': 1.7 });
    // 焦点
    for (const [f, nm] of [[f1, 'F₁'], [f2, 'F₂']]) {
      B.dot(f, 6, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 2 });
      B.text(V(f.x, f.y + 20), nm, { fill: plotInk.amber, 'font-size': 13, 'font-weight': 700 });
    }
    // 入射 / 反射光路
    B.seg(f1, p, { stroke: plotInk.copper, 'stroke-width': 2.4 });
    B.seg(p, f2, { stroke: plotInk.green, 'stroke-width': 2.4 });
    B.dot(p, 6.5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 2 });
    // 角度弧：切线两侧的入射角与反射角
    const aT = Math.atan2(d.y, d.x);
    const aF1 = Math.atan2(f1.y - p.y, f1.x - p.x), aF2 = Math.atan2(f2.y - p.y, f2.x - p.x);
    mk('path', { d: arcPts(p, aF1, aF1 + angDiff(aT, aF1), 22), fill: 'none', stroke: plotInk.amber, 'stroke-width': 1.8 }, B.dyn);
    mk('path', { d: arcPts(p, aF2, aF2 + angDiff(aT, aF2), 30), fill: 'none', stroke: plotInk.amber, 'stroke-width': 1.8 }, B.dyn);
    const din = acuteAng(aF1, aT) * 180 / Math.PI, dout = acuteAng(aF2, aT) * 180 / Math.PI;
    cIn(`${fmt(din, 1)}°`);
    cOut(`${fmt(dout, 1)}°`, Math.abs(din - dout) < 0.05 ? 'ok' : 'warn');
    const r1 = dist(p, f1), r2 = dist(p, f2);
    cPath(`${fmt(r1 + r2, 1)} = 2a（任意 P 处等光程 → 等时反射）`, Math.abs(r1 + r2 - 2 * a) < 0.6 ? 'ok' : 'warn');
    // 光脉冲
    if (st.run) {
      const s = st.pulse % (r1 + r2);
      const q = s < r1 ? lerp(f1, p, s / r1) : lerp(p, f2, (s - r1) / r2);
      mk('circle', { cx: q.x, cy: q.y, r: 9, fill: plotInk.pulse }, B.dyn);
      B.dot(q, 4, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.2 });
    }
    B.hint('拖动 P：无论打到曲面哪一点，从 F₁ 射出的光都精准折进 F₂ —— 切线平分外角，法线平分内角，入射角恒等于反射角');
  };

  const step = () => { if (st.run) { st.pulse += 2.6; B.render(); } B.raf(step); };
  B.handle({
    get: P,
    set: q => { st.t = Math.atan2((q.y - st.cy) / bOf(), (q.x - st.cx) / st.a); },
    color: plotInk.teal, r: 9, label: 'P', lo: [10, -12],
  });

  B.render();
  B.raf(step);
  return B;
}
