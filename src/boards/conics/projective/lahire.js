/* 图 7 · La Hire 定理：Q ∈ p ⟺ P ∈ q */
import { Board, mk, V, add, sub, mul, norm, dist, interLL, polarLine, plEval, lineFromEq, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 800, 460);
  const CIR = { cx: 400, cy: 230, a: 140, b: 140 };
  const st = { P: V(180, 110), Q: V(640, 320), showM: false };
  const clampP = p => { const o = V(CIR.cx, CIR.cy), d = dist(p, o);
    if (d < 18) { const u = norm(sub(p, o)); return add(o, mul(u, 18)); }
    p.x = Math.max(20, Math.min(780, p.x)); p.y = Math.max(20, Math.min(440, p.y)); return p; };
  B.handle({ get: () => st.P, set: p => { st.P = clampP(p); }, color: '#5cadff', r: 8, label: 'P', lo: [-14, -12] });
  B.handle({ get: () => st.Q, set: p => { st.Q = clampP(p); }, color: '#ffd166', r: 8, label: 'Q', lo: [11, -12] });
  B.toggleBtn('显示 M = p∩q 的极线', st.showM, v => { st.showM = v; B.render(); });
  const chip1 = B.chip('Q ∈ p ?'), chip2 = B.chip('P ∈ q ?'), chip3 = B.chip('La Hire');
  B.renderFn = () => {
    mk('circle', { cx: CIR.cx, cy: CIR.cy, r: CIR.a, fill: 'rgba(92,173,255,.05)', stroke: '#3f5f8f', 'stroke-width': 2 }, B.dyn);
    const lp = polarLine(CIR, st.P), lq = polarLine(CIR, st.Q);
    { const [a, b] = lineFromEq(lp.A, lp.B, lp.D); B.inf(a, b, { stroke: '#5cadff', 'stroke-width': 2, 'stroke-dasharray': '8 5' }); }
    { const [a, b] = lineFromEq(lq.A, lq.B, lq.D); B.inf(a, b, { stroke: '#ffd166', 'stroke-width': 2, 'stroke-dasharray': '8 5' }); }
    B.text(V(st.P.x + 40, st.P.y - 38), 'p (P 的极线)', { fill: '#5cadff', 'font-size': 11.5 });
    B.text(V(st.Q.x + 46, st.Q.y - 38), 'q (Q 的极线)', { fill: '#ffd166', 'font-size': 11.5 });
    const e1 = Math.abs(plEval(lp, st.Q)), e2 = Math.abs(plEval(lq, st.P));
    chip1(`${fmt(e1, 2)} px → 在`, 'ok'); chip2(`${fmt(e2, 2)} px → 在`, 'ok');
    chip3('两个判定永远同时成立：Q∈p ⟺ P∈q', 'ok');
    const M = interLL(...lineFromEq(lp.A, lp.B, lp.D), ...lineFromEq(lq.A, lq.B, lq.D));
    if (M && st.showM) {
      B.dot(M, 5, { fill: '#fff' }); B.text(V(M.x + 4, M.y - 10), 'M', { fill: '#fff', 'font-size': 11.5, 'font-weight': 700 });
      const lm = polarLine(CIR, M), [a, b] = lineFromEq(lm.A, lm.B, lm.D);
      B.inf(a, b, { stroke: '#4ade80', 'stroke-width': 2.4 });
      // M 的极线应恰好过 P,Q
      const ok = Math.abs(plEval(lm, st.P)) < 0.6 && Math.abs(plEval(lm, st.Q)) < 0.6;
      B.text(V((st.P.x + st.Q.x) / 2, (st.P.y + st.Q.y) / 2 + 16), 'M 的极线 = 直线 PQ', { fill: ok ? '#4ade80' : '#ff7b8a', 'font-size': 12, 'font-weight': 700 });
    }
    B.hint(st.showM ? '交点 M 的极线恰好穿过 P 和 Q —— 「点的极线 ⟷ 线的极点」在此合流' : 'La Hire：把 P、Q 拖到任何地方，两个判定框永远同时通过');
  };
  B.render();
  return B;
}
