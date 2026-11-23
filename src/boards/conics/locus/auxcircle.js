/* 图 P1 · 辅助圆与离心角：P = (a cos t, b sin t)
   t 不是极角！它是大辅助圆上 Q 的旋转角（离心角）。构造：Q 竖直投影 + 小辅助圆水平投影交出 P。
   焦半径回收 D1：|PF₁| = a + c·cos t，|PF₂| = a − c·cos t（与 a ± ex₀ 逐字一致）。 */
import { mk, V, add, sub, dist, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = createConicLab(root, W, H);
  const C = V(430, 245), a = 195, b = 118;
  const c = Math.sqrt(a * a - b * b);
  const st = { t: 0.9, run: true };

  const Q = () => V(C.x + a * Math.cos(st.t), C.y + a * Math.sin(st.t));   // 大圆
  const R = () => V(C.x + b * Math.cos(st.t), C.y + b * Math.sin(st.t));   // 小圆
  const P = () => V(C.x + a * Math.cos(st.t), C.y + b * Math.sin(st.t));   // 椭圆上

  const cT = B.chip('离心角 t'), cPhi = B.chip('极角 φ'), cR1 = B.chipM('$|PF_1|=a+c\\cos t$'), cR2 = B.chipM('$|PF_2|=a-c\\cos t$');
  B.toggleBtn('▶ 转动 t', true, on => { st.run = on; });

  B.renderFn = () => {
    const q = Q(), r = R(), p = P();
    // 轴
    B.seg(V(20, C.y), V(W - 20, C.y), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    B.seg(V(C.x, 20), V(C.x, H - 20), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    // 大小辅助圆（虚线）
    for (const [rr, col, lab] of [[a, plotInk.blue, '大辅助圆 r=a'], [b, plotInk.green, '小辅助圆 r=b']]) {
      const pts = [];
      for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.04)
        pts.push(`${(C.x + rr * Math.cos(t)).toFixed(1)},${(C.y + rr * Math.sin(t)).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', stroke: col, 'stroke-width': 1.3, 'stroke-dasharray': '7 6', opacity: 0.55 }, B.dyn);
    }
    B.text(V(C.x - a + 52, C.y - a + 16), '大辅助圆 r=a', { fill: plotInk.blue, 'font-size': 11.5 });
    B.text(V(C.x + b - 66, C.y - b + 22), '小辅助圆 r=b', { fill: plotInk.green, 'font-size': 11.5 });
    // 椭圆
    const epts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03)
      epts.push(`${(C.x + a * Math.cos(t)).toFixed(1)},${(C.y + b * Math.sin(t)).toFixed(1)}`);
    mk('polyline', { points: epts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.6 }, B.dyn);
    // 半径 OQ 与 OQ 的像
    B.seg(C, q, { stroke: plotInk.blue, 'stroke-width': 1.6 });
    B.seg(C, r, { stroke: plotInk.green, 'stroke-width': 1.3 });
    // 构造：Q 竖直下落、R 水平推进，交出 P
    B.seg(q, p, { stroke: plotInk.copper, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
    B.seg(r, p, { stroke: plotInk.copper, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
    // 焦点与焦半径
    const f1 = V(C.x - c, C.y), f2 = V(C.x + c, C.y);
    for (const [f, nm] of [[f1, 'F₁'], [f2, 'F₂']]) {
      B.dot(f, 5.5, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.8 });
      B.text(V(f.x, f.y + 19), nm, { fill: plotInk.amber, 'font-size': 12, 'font-weight': 700 });
    }
    B.seg(f1, p, { stroke: plotInk.rose, 'stroke-width': 2.2 });
    B.seg(f2, p, { stroke: plotInk.rose, 'stroke-width': 2.2 });
    // 点
    B.dot(C, 3, { fill: plotInk.guide });
    B.dot(q, 5.5, { fill: plotInk.blue, stroke: plotInk.ink, 'stroke-width': 1.8 });
    B.dot(r, 5, { fill: plotInk.green, stroke: plotInk.ink, 'stroke-width': 1.8 });
    B.dot(p, 6.5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 2 });
    B.text(V(r.x + 12, r.y + 16), 'R', { fill: plotInk.green, 'font-size': 12.5, 'font-weight': 700 });
    B.text(V(p.x - 14, p.y + 22), 'P', { fill: plotInk.teal, 'font-size': 13, 'font-weight': 700 });
    // 读数：t 是离心角，φ 是真正的极角 —— 数值上就不同
    const phi = Math.atan2(p.y - C.y, p.x - C.x);
    cT(`${fmt(st.t * 180 / Math.PI, 1)}°（Q 的旋转角）`);
    cPhi(`${fmt(phi * 180 / Math.PI, 1)}°（= OP 与 x 轴夹角，≠ t）`, Math.abs(phi - st.t) < 0.005 ? '' : 'ok');
    const r1 = dist(p, f1), r2 = dist(p, f2);
    cR1(`${fmt(r1, 1)} = a + c·cos t = ${fmt(a + c * Math.cos(st.t), 1)}`, Math.abs(r1 - (a + c * Math.cos(st.t))) < 0.6 ? 'ok' : 'warn');
    cR2(`${fmt(r2, 1)} = a − c·cos t = ${fmt(a - c * Math.cos(st.t), 1)}`, Math.abs(r2 - (a - c * Math.cos(st.t))) < 0.6 ? 'ok' : 'warn');
    B.hint('拖动 Q：Q 竖直落、R 水平推，交点 P 沿椭圆跑 —— t 是离心角（辅助圆上的旋转角），不是 OP 的极角');
  };

  const step = () => { if (st.run) { st.t += 0.012; if (st.t > Math.PI) st.t -= 2 * Math.PI; B.render(); } B.raf(step); };
  B.handle({
    get: Q,
    set: p => { st.t = Math.atan2(p.y - C.y, p.x - C.x); },
    color: plotInk.blue, r: 8, label: 'Q', lo: [9, -11],
  });

  B.render();
  B.raf(step);
  return B;
}
