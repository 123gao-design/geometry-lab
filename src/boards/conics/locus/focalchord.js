/* 图 P3 · 焦点弦实验机：过焦点 F 的弦 P₁P₂，L = |P₁P₂| = 2ed/(1−e²cos²θ)
   θ=90° 是通径 L=2ed（三种曲线中最短的焦点弦）；θ→0 时 L→2a。
   以焦点弦为直径的圆 vs 准线：d(M, l) = L/(2e) vs 半径 L/2 → e<1 相离 / e=1 相切 / e>1 相交。 */
import { mk, V, dist, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = createConicLab(root, W, H);
  const F = V(330, 240), LX = 450, d = LX - F.x;
  const st = { e: 0.55, th: 1.05, pulse: 0, run: true };

  const ed = () => st.e * d;
  const maxC = () => st.e > 1 ? 0.97 / st.e : (st.e > 0.995 ? 0.97 : 1);  // 同支弦允许的 |cosθ|
  const clampTh = () => {
    const c = Math.cos(st.th);
    if (Math.abs(c) > maxC()) {
      const m = maxC();
      st.th = st.th <= Math.PI / 2 ? Math.acos(m) : Math.acos(-m);
    }
  };
  // 焦点弦两端：r = ed/(1±e·cosθ)；同支要求两个分母都为正
  const r1 = () => { const q = 1 + st.e * Math.cos(st.th); return q > 0.02 ? ed() / q : null; };
  const r2 = () => { const q = 1 - st.e * Math.cos(st.th); return q > 0.02 ? ed() / q : null; };

  const cType = B.chip('θ（与轴的夹角）'), cL = B.chip('弦长 L'), cLat = B.chip('通径'), cCirc = B.chip('圆（直径=P₁P₂）vs 准线');
  const sE = B.slider('离心率 e', 0.4, 1.8, 0.01, st.e, v => {
    st.e = v; clampTh();
    sT.value = st.th * 180 / Math.PI; sT.dispatchEvent(new Event('input'));
  });
  const sT = B.slider('θ', 0, 180, 1, st.th * 180 / Math.PI, v => { st.th = v * Math.PI / 180; clampTh(); B.render(); });
  for (const [lab, v] of [['e=0.55 · 椭圆', 0.55], ['e=1 · 抛物线', 1], ['e=1.6 · 双曲线', 1.6]])
    B.btn(lab, () => { st.e = v; sE.value = v; sE.dispatchEvent(new Event('input')); });
  B.btn('⊥ 对准通径', () => { st.th = Math.PI / 2; sT.value = 90; sT.dispatchEvent(new Event('input')); });
  B.toggleBtn('光脉冲', true, on => { st.run = on; });

  // 整条曲线（near 支全画；e>1 时 far 支画虚线作背景）
  const traceSide = side => {
    const paths = []; let cur = [];
    for (let t = 0; t <= 2 * Math.PI + 1e-9; t += 0.006) {
      const c = Math.cos(t), s = Math.sin(t);
      let r = null;
      if (side === 0) { const q = 1 + st.e * c; if (q > 0.004) r = ed() / q; }
      else { const q = st.e * c - 1; if (st.e > 1 && q > 0.004) r = ed() / q; }
      if (r !== null && r < 900) cur.push(`${(F.x + r * c).toFixed(1)},${(F.y + r * s).toFixed(1)}`);
      else if (cur.length) { paths.push(cur); cur = []; }
    }
    if (cur.length) paths.push(cur);
    return paths;
  };

  B.renderFn = () => {
    // 轴与准线
    B.seg(V(20, F.y), V(W - 20, F.y), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    B.seg(V(LX, 18), V(LX, H - 18), { stroke: plotInk.teal, 'stroke-width': 1.8, 'stroke-dasharray': '8 6' });
    B.text(V(LX, 32), '准线 l', { fill: plotInk.teal, 'font-size': 12.5 });
    // 曲线
    for (const path of traceSide(0))
      if (path.length > 1) mk('polyline', { points: path.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.4 }, B.dyn);
    for (const path of traceSide(1))
      if (path.length > 1) mk('polyline', { points: path.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 1.2, 'stroke-dasharray': '5 5', opacity: 0.5 }, B.dyn);
    B.dot(F, 6, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 2 });
    B.text(V(F.x, F.y + 20), 'F', { fill: plotInk.amber, 'font-size': 13, 'font-weight': 700 });
    // 焦点弦
    const R1 = r1(), R2 = r2();
    if (R1 !== null && R2 !== null) {
      const c = Math.cos(st.th), s = Math.sin(st.th);
      const P1 = V(F.x + R1 * c, F.y + R1 * s), P2 = V(F.x - R2 * c, F.y - R2 * s);
      const L = R1 + R2, M = V((P1.x + P2.x) / 2, (P1.y + P2.y) / 2);
      B.seg(P1, P2, { stroke: plotInk.ink, 'stroke-width': 2 });
      // 以焦点弦为直径的圆
      mk('circle', { cx: M.x, cy: M.y, r: L / 2, fill: plotInk.goldWash, stroke: plotInk.amber, 'stroke-width': 1.6 }, B.dyn);
      B.dot(M, 3.5, { fill: plotInk.amber });
      B.text(V(M.x, M.y - 12), 'M（中点）', { fill: plotInk.amber, 'font-size': 11 });
      // M 到准线的距离（虚线 + 直角标记）
      const foot = V(LX, M.y);
      B.seg(M, foot, { stroke: plotInk.rose, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
      const ux = M.x < LX ? -1 : 1;
      mk('path', { d: `M${foot.x + ux * 9},${foot.y}L${foot.x + ux * 9},${foot.y - 9}L${foot.x},${foot.y - 9}`, fill: 'none', stroke: plotInk.rose, 'stroke-width': 1.1 }, B.dyn);
      // 弦端
      for (const [p, nm] of [[P1, 'P₁'], [P2, 'P₂']]) {
        B.dot(p, 5.5, { fill: plotInk.ink, stroke: plotInk.blue, 'stroke-width': 1.6 });
        B.text(V(p.x + 10, p.y - 8), nm, { fill: plotInk.ink, 'font-size': 11.5, 'font-weight': 700 });
      }
      // 光脉冲沿弦穿过 F
      if (st.run) {
        const t = st.pulse % L;
        const q = t < R1 ? V(F.x + (R1 - t) * c, F.y + (R1 - t) * s) : V(F.x - (t - R1) * c, F.y - (t - R1) * s);
        mk('circle', { cx: q.x, cy: q.y, r: 8, fill: plotInk.pulse }, B.dyn);
      }
      // 读数
      const Lf = 2 * ed() / (1 - st.e * st.e * Math.cos(st.th) ** 2);
      cL(`|P₁P₂| = ${fmt(L, 1)} = 2ed/(1−e²cos²θ) = ${fmt(Lf, 1)}`, Math.abs(L - Lf) < 0.5 ? 'ok' : 'warn');
      const dM = Math.abs(LX - M.x), half = L / 2;
      const verdict = Math.abs(st.e - 1) < 0.005 ? '相切' : st.e < 1 ? '相离（d(M,l) > L/2）' : '相交（d(M,l) < L/2）';
      cCirc(`R = L/2 = ${fmt(half, 1)}，d(M, l) = L/2e = ${fmt(dM, 1)} → ${verdict}`,
        Math.abs(dM - half / st.e) < 0.8 ? 'ok' : 'warn');
    } else {
      cL('θ 靠近 0：另一端跑向无穷（弦趋于长轴/实轴）', 'warn');
      cCirc('θ 靠近 0：圆也涨到无穷，拖回来看');
    }
    cType(`θ = ${fmt(st.th * 180 / Math.PI, 1)}°${st.e > 1 ? '（双曲线：同支弦限 |cosθ| < 1/e）' : ''}`);
    cLat(`θ=90° 时 L = 2ed = ${fmt(2 * ed(), 1)}（当前同支范围内最短）`, 'ok');
    B.hint(Math.abs(st.e - 1) < 0.005
      ? 'e = 1：圆恰好与准线相切 —— 抛物线经典题；按「⊥ 对准通径」看最短弦 2p'
      : '转动 θ、滑动 e：金圆与准线的关系只由 e 的三段取值决定 —— 相离（椭圆）/ 相切（抛物线）/ 相交（双曲线）');
  };

  const step = () => { if (st.run) { st.pulse += 3; B.render(); } B.raf(step); };
  // 拖 P₁：沿 near 支找最近的合法点
  B.handle({
    get: () => {
      const R = r1();
      return R === null ? F : V(F.x + R * Math.cos(st.th), F.y + R * Math.sin(st.th));
    },
    set: p => {
      let t = Math.atan2(p.y - F.y, p.x - F.x);
      if (t < 0) t += Math.PI;                     // 弦角取 [0, π]
      st.th = t; clampTh();
      sT.value = st.th * 180 / Math.PI; sT.dispatchEvent(new Event('input'));
    },
    color: plotInk.ink, r: 8, label: 'P₁', lo: [10, -12],
  });

  B.render();
  B.raf(step);
  return B;
}
