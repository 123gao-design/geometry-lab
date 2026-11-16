/* 图 A2 · 平行弦中点机：一族方向角为 α 的平行弦，中点全部落在过中心的"共轭直径"上
   圆（虚线对照）：中点直径与弦方向垂直 —— 垂径定理，k_弦·k_径 = −1
   椭圆（实线）：斜率被压扁，k_弦·k_径 = −b²/a² —— 这就是点差法，也正是 D5 第三定义 */
import { Board, mk, V, add, mul, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const C = V(430, 240), a = 190, b = 115;
  const st = { alpha: 35, run: false, sweep: null, trace: [], showCircle: true };

  const rad = () => st.alpha * Math.PI / 180;
  const dir = () => V(Math.cos(rad()), Math.sin(rad()));
  // 椭圆内：方向 dir、离中心法向偏移 h 的弦与椭圆相交 → 参数 s 的两个根；中点在 s = −B/A
  const chordAt = (h, A_, B_) => {
    const d = dir(), n = V(-d.y, d.x);
    const aa = (d.x / A_) ** 2 + (d.y / B_) ** 2;
    const bb = h * (d.x * n.x / (A_ * A_) + d.y * n.y / (B_ * B_));
    const cc = (h * h) * ((n.x / A_) ** 2 + (n.y / B_) ** 2) - 1;
    const disc = bb * bb - aa * cc;
    if (disc <= 1e-9) return null;
    const s1 = (-bb - Math.sqrt(disc)) / aa, s2 = (-bb + Math.sqrt(disc)) / aa;
    const P1 = add(add(C, mul(n, h)), mul(d, s1)), P2 = add(add(C, mul(n, h)), mul(d, s2));
    const M = mul(add(P1, P2), 0.5);
    return { P1, P2, M };
  };
  const hMax = (A_, B_) => {
    const d = dir(), n = V(-d.y, d.x);
    return Math.sqrt(A_ * A_ * n.x * n.x + B_ * B_ * n.y * n.y); // 与方向平行的切线的法向偏移
  };

  const cCircle = B.chip('圆（对照）'), cEll = B.chip('椭圆'), cAng = B.chip('夹角（弦方向 vs 中点直径）');
  B.slider('弦方向 α', 0, 180, 1, st.alpha, v => { st.alpha = v; st.trace = []; B.render(); });
  B.toggleBtn('显示对照圆', true, on => { st.showCircle = on; B.render(); });
  B.toggleBtn('▶ 扫描一条弦', false, on => {
    st.run = on;
    if (on) { st.trace = []; st.sweep = -1; }
  });

  B.renderFn = () => {
    const d = dir(), kChord = d.y / d.x;
    // 轴
    B.seg(V(20, C.y), V(W - 20, C.y), { stroke: '#22314a', 'stroke-width': 1.2 });
    B.seg(V(C.x, 20), V(C.x, H - 20), { stroke: '#22314a', 'stroke-width': 1.2 });
    // 椭圆 + 对照圆
    const epts = [], cpts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03) {
      epts.push(`${(C.x + a * Math.cos(t)).toFixed(1)},${(C.y + b * Math.sin(t)).toFixed(1)}`);
      if (st.showCircle) cpts.push(`${(C.x + a * Math.cos(t)).toFixed(1)},${(C.y + a * Math.sin(t)).toFixed(1)}`);
    }
    mk('polyline', { points: epts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.2 }, B.dyn);
    if (st.showCircle) mk('polyline', { points: cpts.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 1.4, 'stroke-dasharray': '7 6', opacity: 0.55 }, B.dyn);
    // 平行弦族（椭圆）
    const hE = hMax(a, b);
    for (const f of [-0.75, -0.5, -0.25, 0, 0.25, 0.5, 0.75]) {
      const ch = chordAt(f * hE, a, b);
      if (!ch) continue;
      B.seg(ch.P1, ch.P2, { stroke: '#ff7b8a', 'stroke-width': f === 0 ? 2 : 1.3, opacity: f === 0 ? 1 : 0.7 });
      B.dot(ch.M, 3, { fill: '#ffd166' });
    }
    // 对照圆上的平行弦族（细）与其中点
    if (st.showCircle) {
      const hC = hMax(a, a);
      for (const f of [-0.6, -0.3, 0, 0.3, 0.6]) {
        const ch = chordAt(f * hC, a, a);
        if (!ch) continue;
        B.seg(ch.P1, ch.P2, { stroke: '#3f5f8f', 'stroke-width': f === 0 ? 1.6 : 0.9, opacity: 0.65 });
        B.dot(ch.M, 2.6, { fill: '#8fa3bd' });
      }
    }
    // 中点直径：椭圆 dm = (a² sinα, −b² cosα)；圆 = 垂直方向 (sinα, −cosα)
    const dmE = V(a * a * Math.sin(rad()), -b * b * Math.cos(rad()));
    const dmC = V(Math.sin(rad()), -Math.cos(rad()));
    B.inf(C, add(C, dmE), { stroke: '#ffd166', 'stroke-width': 2, 'stroke-dasharray': '9 6' });
    if (st.showCircle) B.inf(C, add(C, dmC), { stroke: '#8fa3bd', 'stroke-width': 1.3, 'stroke-dasharray': '3 6' });
    B.text(add(C, mul(mul(dmE, 1 / Math.hypot(dmE.x, dmE.y)), 105)), '中点轨迹（共轭直径）', { fill: '#ffd166', 'font-size': 11.5, 'font-weight': 700 });
    // 圆心处的直角标记（垂径定理）
    if (st.showCircle) {
      const u1 = mul(d, 16), u2 = mul(dmC, -16);
      mk('path', { d: `M${(C.x + u1.x).toFixed(1)},${(C.y + u1.y).toFixed(1)}L${(C.x + u1.x + u2.x).toFixed(1)},${(C.y + u1.y + u2.y).toFixed(1)}L${(C.x + u2.x).toFixed(1)},${(C.y + u2.y).toFixed(1)}`, fill: 'none', stroke: '#8fa3bd', 'stroke-width': 1.2 }, B.dyn);
    }
    // 扫描动画：一条弦从一侧滑到另一侧，中点沿直径爬行
    if (st.run && st.sweep !== null) {
      st.sweep += 0.03;
      if (st.sweep > 1) { st.sweep = -1; }
      const ch = chordAt(st.sweep * hE * 0.98, a, b);
      if (ch) {
        B.seg(ch.P1, ch.P2, { stroke: '#ff9e4a', 'stroke-width': 2.6 });
        B.dot(ch.M, 5, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 1.6 });
        const last = st.trace[st.trace.length - 1];
        if (!last || dist(last, ch.M) < 80) st.trace.push(ch.M);
      }
    }
    if (st.trace.length > 1) {
      mk('polyline', { points: st.trace.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '), fill: 'none', stroke: 'rgba(255,209,102,.55)', 'stroke-width': 6 }, B.dyn);
    }
    B.dot(C, 3, { fill: '#93a1b5' });
    // 读数
    const kDiamE = dmE.y / dmE.x, kDiamC = dmC.y / dmC.x;
    const vertE = Math.abs(d.x) < 1e-6 || Math.abs(dmE.x) < 1e-6;
    const vertC = Math.abs(d.x) < 1e-6 || Math.abs(dmC.x) < 1e-6;
    const pE = vertE ? -(b * b) / (a * a) : kChord * kDiamE;
    const pC = vertC ? -1 : kChord * kDiamC;
    cCircle(`k_弦·k_径 = ${fmt(pC, 3)}（= −1，垂直 ✓）`, Math.abs(pC + 1) < 0.01 ? 'ok' : 'warn');
    cEll(`k_弦·k_径 = ${fmt(pE, 3)}（= −b²/a² = ${fmt(-(b * b) / (a * a), 3)}）`, Math.abs(pE + (b * b) / (a * a)) < 0.01 ? 'ok' : 'warn');
    const ang = Math.abs(Math.atan2(d.x * dmE.y - d.y * dmE.x, d.x * dmE.x + d.y * dmE.y)) * 180 / Math.PI;
    cAng(`椭圆 ${fmt(ang, 1)}°｜圆 90°（弦沿对称轴时椭圆恰好也垂直）`);
    B.hint('压扁前中点直径⊥弦；压扁后垂直丢了，中点共线与斜率积定值留下 —— 点差法是垂径定理的仿射遗言');
  };

  const step = () => { if (st.run) B.render(); B.raf(step); };
  B.render();
  B.raf(step);
  return B;
}
