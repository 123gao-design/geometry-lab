/* 图 T4 · 双曲线散光机：从近焦点射向曲面的光，反射后反向延长线恰过另一焦点（虚焦点成像）
   几何内核：切线平分两焦半径夹角的"内角"（与椭圆恰好互补） */
import { mk, V, add, sub, mul, dist, lerp, norm, angDiff, acuteAng, arcPts, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 800, H = 500;
  const B = createConicLab(root, W, H);
  const st = { cx: 400, cy: 250, a: 90, c: 150, t: 0.55, s: 1, pulse: 0, run: true };

  const bOf = () => Math.sqrt(st.c * st.c - st.a * st.a);
  const P = () => V(st.cx + st.s * st.a / Math.cos(st.t), st.cy + bOf() * Math.tan(st.t));
  const F1 = () => V(st.cx - st.c, st.cy), F2 = () => V(st.cx + st.c, st.cy);

  const cIn = B.chip('∠入射（对切线）'), cOut = B.chip('∠反射（对切线）'), cD = B.chip('反向延长线');
  B.toggleBtn('光脉冲', true, on => { st.run = on; });

  B.renderFn = () => {
    const { cx, cy, a, c } = st, b = bOf(), p = P(), f1 = F1(), f2 = F2();
    const near = st.s > 0 ? f2 : f1, far = st.s > 0 ? f1 : f2;
    B.seg(V(24, cy), V(W - 24, cy), { stroke: plotInk.axis, 'stroke-width': 1.5 });
    // 渐近线 + 双支
    for (const dir of [V(a, b), V(a, -b)])
      B.inf(V(cx, cy), V(cx + dir.x, cy + dir.y), { stroke: plotInk.rule, 'stroke-width': 1.2, 'stroke-dasharray': '6 6' });
    for (const s of [1, -1]) {
      const pts = [];
      for (let t = -1.35; t <= 1.35 + 1e-9; t += 0.03)
        pts.push(`${(cx + s * a / Math.cos(t)).toFixed(1)},${(cy + b * Math.tan(t)).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.4 }, B.dyn);
    }
    // 切线（平分内角）
    const u0 = p.x - cx, v0 = p.y - cy;
    const d = V(a * a * v0, b * b * u0);
    B.inf(p, add(p, d), { stroke: plotInk.ink, 'stroke-width': 1.7 });
    // 焦点
    for (const [f, nm] of [[f1, 'F₁'], [f2, 'F₂']]) {
      B.dot(f, 6, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 2 });
      B.text(V(f.x, f.y + 20), nm, { fill: plotInk.amber, 'font-size': 13, 'font-weight': 700 });
    }
    // 光路：near → P，反射方向 = 远离 far（反向延长线过 far）
    const out = norm(sub(p, far)), q2 = add(p, mul(out, 330));
    B.seg(near, p, { stroke: plotInk.copper, 'stroke-width': 2.6 });
    B.seg(p, q2, { stroke: plotInk.green, 'stroke-width': 2.6 });
    B.inf(far, p, { stroke: plotInk.guide, 'stroke-width': 1.3, 'stroke-dasharray': '5 5' });
    B.text(V(p.x + mul(out, 150).x, p.y + mul(out, 150).y - 8), '反向延长线过另一焦点', { fill: plotInk.guide, 'font-size': 11 });
    // 角度弧：切线两侧入射角 / 反射角
    const aT = Math.atan2(d.y, d.x);
    const aNear = Math.atan2(near.y - p.y, near.x - p.x), aFar = Math.atan2(far.y - p.y, far.x - p.x);
    mk('path', { d: arcPts(p, aNear, aNear + angDiff(aT, aNear), 22), fill: 'none', stroke: plotInk.amber, 'stroke-width': 1.8 }, B.dyn);
    mk('path', { d: arcPts(p, aFar, aFar + angDiff(aT, aFar), 30), fill: 'none', stroke: plotInk.amber, 'stroke-width': 1.8 }, B.dyn);
    const din = acuteAng(aNear, aT) * 180 / Math.PI, dout = acuteAng(aFar, aT) * 180 / Math.PI;
    cIn(`${fmt(din, 1)}°`);
    cOut(`${fmt(dout, 1)}°`, Math.abs(din - dout) < 0.05 ? 'ok' : 'warn');
    cD(`反射线与"过 ${st.s > 0 ? 'F₁' : 'F₂'} 的直线"共线`, 'ok');
    // 脉冲
    if (st.run) {
      const r1 = dist(near, p), total = r1 + 330, s = st.pulse % total;
      const g = s < r1 ? lerp(near, p, s / r1) : lerp(p, q2, (s - r1) / 330);
      mk('circle', { cx: g.x, cy: g.y, r: 9, fill: plotInk.pulse }, B.dyn);
      B.dot(g, 4, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.2 });
    }
    B.dot(p, 6.5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 2 });
    B.hint('从近焦点射向曲面的光被弹开，但反向延长线恰过另一焦点 —— 观察者会"看见"光从虚焦点发出：双曲反射镜的成像原理');
  };

  const step = () => { if (st.run) { st.pulse += 2.6; B.render(); } B.raf(step); };
  B.handle({
    get: P,
    set: q => {
      st.s = q.x >= st.cx ? 1 : -1;
      st.t = Math.max(-1.3, Math.min(1.3, Math.atan((q.y - st.cy) / bOf())));
    },
    color: plotInk.teal, r: 9, label: 'P', lo: [10, -12],
  });

  B.render();
  B.raf(step);
  return B;
}
