/* 图 T3 · 抛物面天线：平行于轴的入射光反射后全部汇聚于焦点
   切线平分"轴向平行线与焦点线"的夹角 —— tan(2θ) = 2tanθ/(1−tan²θ) 在此得到验证 */
import { Board, mk, V, add, sub, dist, lerp, angDiff, acuteAng, arcPts, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 500;
  const B = new Board(root, W, H);
  const st = { vx: 240, cy: 250, p: 170, u: 55, pulse: 0, run: true };
  const RAYS = [-185, -110, 110, 185]; // 静态平行光束（u = y 偏移）

  const ptOf = u => V(st.vx + u * u / (2 * st.p), st.cy + u);
  const F = () => V(st.vx + st.p / 2, st.cy);

  const cIn = B.chip('∠入射（对切线）'), cOut = B.chip('∠反射（对切线）'), cF = B.chip('焦点');
  B.slider('焦参数 p', 120, 200, 1, st.p, v => { st.p = v; B.render(); });
  B.toggleBtn('光脉冲', true, on => { st.run = on; });

  const pathLen = p => (W - 16 - p.x) + dist(p, F());

  B.renderFn = () => {
    const { vx, cy, p: pp } = st, f = F(), P = ptOf(st.u), lx = vx - pp / 2;
    B.seg(V(24, cy), V(W - 24, cy), { stroke: '#22314a', 'stroke-width': 1.5 });
    // 准线（对照：到焦点与到准线等距的定义还立在原地）
    B.seg(V(lx, 18), V(lx, H - 18), { stroke: '#67e8f9', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
    // 抛物线
    const pts = [];
    for (let u = -230; u <= 230; u += 4) pts.push(`${(vx + u * u / (2 * pp)).toFixed(1)},${(cy + u).toFixed(1)}`);
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.6 }, B.dyn);
    // 静态平行光束（含脉冲）
    RAYS.forEach((u0, i) => {
      const q = ptOf(u0);
      if (q.x > W - 20) return;
      B.seg(V(W - 16, q.y), q, { stroke: '#3f5f8f', 'stroke-width': 1.5 });
      B.seg(q, f, { stroke: '#2b6f7f', 'stroke-width': 1.5 });
      if (st.run) {
        const total = pathLen(q), s = (st.pulse + i * 60) % total;
        const g = s < W - 16 - q.x ? lerp(V(W - 16, q.y), q, s / (W - 16 - q.x)) : lerp(q, f, (s - (W - 16 - q.x)) / dist(q, f));
        mk('circle', { cx: g.x, cy: g.y, r: 5.5, fill: 'rgba(255,209,102,.5)' }, B.dyn);
      }
    });
    // 可拖光束的切线与角度弧
    const d = V(P.y - cy, pp); // 切线方向 (v₀, p)
    B.inf(P, add(P, d), { stroke: '#fff', 'stroke-width': 1.7 });
    B.seg(V(W - 16, P.y), P, { stroke: '#ff9e4a', 'stroke-width': 2.6 });
    B.seg(P, f, { stroke: '#4ade80', 'stroke-width': 2.6 });
    const aT = Math.atan2(d.y, d.x), aF = Math.atan2(f.y - P.y, f.x - P.x);
    mk('path', { d: arcPts(P, 0, angDiff(aT, 0), 22), fill: 'none', stroke: '#ffd166', 'stroke-width': 1.8 }, B.dyn);
    mk('path', { d: arcPts(P, aF, aF + angDiff(aT, aF), 30), fill: 'none', stroke: '#ffd166', 'stroke-width': 1.8 }, B.dyn);
    const din = acuteAng(0, aT) * 180 / Math.PI, dout = acuteAng(aF, aT) * 180 / Math.PI;
    cIn(`${fmt(din, 1)}°`);
    cOut(`${fmt(dout, 1)}°`, Math.abs(din - dout) < 0.05 ? 'ok' : 'warn');
    cF(`F = (${fmt(pp / 2, 0)}, 0) —— 每条反射线都穿过它`, 'ok');
    // 可拖光束的脉冲
    if (st.run) {
      const total = pathLen(P), s = st.pulse % total;
      const g = s < W - 16 - P.x ? lerp(V(W - 16, P.y), P, s / (W - 16 - P.x)) : lerp(P, f, (s - (W - 16 - P.x)) / dist(P, f));
      mk('circle', { cx: g.x, cy: g.y, r: 9, fill: 'rgba(255,209,102,.55)' }, B.dyn);
      B.dot(g, 4, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 1.2 });
    }
    B.dot(f, 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(f.x, f.y + 20), 'F（馈源）', { fill: '#ffd166', 'font-size': 12.5, 'font-weight': 700 });
    B.dot(P, 6.5, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(P.x, P.y - 14), 'P', { fill: '#67e8f9', 'font-size': 13, 'font-weight': 700 });
    B.hint('拖动 P（或调 p）：水平射入的光束无论打在锅面哪一点，反射后都汇于焦点 —— 卫星天线、探照灯、太阳灶的几何原理');
  };

  const step = () => { if (st.run) { st.pulse += 2.6; B.render(); } B.raf(step); };
  B.handle({
    get: () => ptOf(st.u),
    set: q => { st.u = Math.max(-230, Math.min(230, q.y - st.cy)); },
    color: '#67e8f9', r: 9, label: 'P', lo: [10, -12],
  });

  B.render();
  B.raf(step);
  return B;
}
