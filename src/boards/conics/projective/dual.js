/* 图 8 · 共线 → 共点翻译机：配极原则 */
import { Board, mk, V, add, sub, dot, lerp, polarPoint, polarLine, plEval, lineFromEq, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 800, 540);
  const E = { cx: 400, cy: 270, a: 170, b: 115 };
  const st = { l1: V(160, 150), l2: V(660, 430), ts: [0.22, 0.42, 0.62, 0.85] };
  const COL = ['#c084fc', '#ff7b8a', '#5cadff', '#ffd166'], NAMES = ['P₁', 'P₂', 'P₃', 'P₄'];
  B.handle({ get: () => st.l1, set: p => { st.l1 = p; }, color: '#67e8f9', r: 7, thin: true, lo: [11, -11] });
  B.handle({ get: () => st.l2, set: p => { st.l2 = p; }, color: '#67e8f9', r: 7, thin: true, lo: [11, -11] });
  st.ts.forEach((t, i) => {
    B.handle({ get: () => lerp(st.l1, st.l2, t),
      set: p => { // 投影到直线 l 上
        const v = sub(st.l2, st.l1), L2 = dot(v, v) || 1;
        st.ts[i] = Math.max(0.03, Math.min(0.97, dot(sub(p, st.l1), v) / L2)); },
      color: COL[i], r: 7, label: NAMES[i], lo: [9, -11] });
  });
  const chip1 = B.chip('四条极线'), chip2 = B.chip('极点 L');
  B.renderFn = () => {
    mk('ellipse', { cx: E.cx, cy: E.cy, rx: E.a, ry: E.b, fill: 'rgba(92,173,255,.05)', stroke: '#3f5f8f', 'stroke-width': 2 }, B.dyn);
    // 直线 l
    B.inf(st.l1, st.l2, { stroke: '#67e8f9', 'stroke-width': 1.6, 'stroke-dasharray': '2 5', opacity: .8 });
    B.text(add(st.l1, V(-30, -8)), 'l', { 'text-anchor': 'end', fill: '#67e8f9', 'font-size': 13, 'font-weight': 700 });
    const leq = { A: st.l1.y - st.l2.y, B: st.l2.x - st.l1.x, D: st.l1.y * st.l2.x - st.l2.y * st.l1.x };
    let L = polarPoint(E, leq), degen = false;
    if (!isFinite(L.x) || !isFinite(L.y) || Math.abs(leq.D - leq.A * E.cx - leq.B * E.cy) < 1e-6) degen = true;
    st.ts.forEach((t, i) => {
      const p = lerp(st.l1, st.l2, t), Lp = polarLine(E, p), [a, b] = lineFromEq(Lp.A, Lp.B, Lp.D);
      B.inf(a, b, { stroke: COL[i], 'stroke-width': 1.3, opacity: .85 });
    });
    if (degen) {
      chip1('l 穿过椭圆中心：极点在无穷远（四条极线互相平行）', 'warn'); chip2('—');
      B.hint('直线 l 恰好穿过中心：它的极点是无穷远点 —— 四条极线此刻互相平行');
    } else {
      let maxDev = 0;
      st.ts.forEach((t, i) => {
        const p = lerp(st.l1, st.l2, t), Lp = polarLine(E, p);
        maxDev = Math.max(maxDev, Math.abs(plEval(Lp, L)));
      });
      B.dot(L, 8, { fill: '#fff', stroke: '#ff9e4a', 'stroke-width': 2.5 });
      B.text(V(L.x, L.y - 16), 'L = l 的极点', { fill: '#fff', 'font-size': 12.5, 'font-weight': 700 });
      chip1(`到 L 的最大偏差 ${fmt(maxDev, 2)} px（理论为 0）`, maxDev < 0.6 ? 'ok' : 'warn');
      chip2('l 上任何点的极线都过 L —— 共线 ⟿ 极线共点', 'ok');
      B.hint('拖动直线 l 或沿 l 滑动四个点：四条彩色极线永远共点于 L —— 这就是配极原则');
    }
  };
  B.render();
  return B;
}
