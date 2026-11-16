/* 图 10 · Brianchon 定理：外切六边形三对角线共点 */
import { Board, mk, V, conicPt, polarLine, lineFromEq, interLL, plEval, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 800, 560);
  const E = { cx: 400, cy: 280, a: 185, b: 140 };
  const st = { t: [0.2, 1.1, 2.2, 3.35, 4.25, 5.4], dance: false };
  const SUB = '₁₂₃₄₅₆';
  for (let i = 0; i < 6; i++)
    B.handle({ get: () => conicPt(E, st.t[i]),
      set: p => { st.t[i] = Math.atan2((p.y - E.cy) / E.b, (p.x - E.cx) / E.a); },
      color: '#67e8f9', r: 7, label: '123456'[i], lo: [9, -10] });
  B.btn('打乱切点', () => { for (let i = 0; i < 6; i++) st.t[i] += (Math.random() - 0.5) * 1.6; B.render(); }, { pri: true });
  B.toggleBtn('让切点舞动', st.dance, v => { st.dance = v;
    if (v) { const sp = st.t.map((_, i) => 0.004 * (i % 2 ? 1 : -1) * (1 + i * 0.11));
      (function loop() { if (!st.dance) return;
        for (let i = 0; i < 6; i++) st.t[i] += sp[i]; B.render(); B.raf(loop); })(); }
    else B.cancelRaf(); });
  const chip1 = B.chip('三对角线'), chip2 = B.chip('Brianchon 点检验');
  const tline = i => { const L = polarLine(E, conicPt(E, st.t[i])); return lineFromEq(L.A, L.B, L.D); };
  B.renderFn = () => {
    mk('ellipse', { cx: E.cx, cy: E.cy, rx: E.a, ry: E.b, fill: 'rgba(92,173,255,.05)', stroke: '#3f5f8f', 'stroke-width': 2 }, B.dyn);
    const TL = st.t.map((_, i) => tline(i));
    for (const t of TL) B.inf(...t, { stroke: '#67e8f9', 'stroke-width': 1.1, opacity: .8 });
    // 顶点 A_i = 切线 i ∩ 切线 i+1
    const A = TL.map((t, i) => interLL(...t, ...TL[(i + 1) % 6]));
    if (A.some(a => !a)) { chip1('有顶点在无穷远（相邻切线平行）—— 微调切点', 'warn'); chip2('—');
      B.hint('相邻切线平行时六边形顶点跑到无穷远处，把切点稍微错开即可'); return; }
    mk('polygon', { points: A.map(p => `${p.x},${p.y}`).join(' '), fill: 'rgba(103,232,249,.045)', stroke: 'none' }, B.dyn);
    A.forEach((p, i) => { B.dot(p, 4, { fill: '#aebdd2' });
      if (p.x > 10 && p.x < 790 && p.y > 10 && p.y < 550) B.text(V(p.x, p.y - 9), 'A' + SUB[i], { fill: '#aebdd2', 'font-size': 10.5 }); });
    // 三条对角线
    const diag = [[0, 3], [1, 4], [2, 5]];
    const bp = interLL(A[0], A[3], A[1], A[4]);
    for (const [i, j] of diag) B.inf(A[i], A[j], { stroke: '#fff', 'stroke-width': 1.7 });
    chip1('A₁A₄、A₂A₅、A₃A₆ 三线', 'ok');
    if (bp && bp.x > -500 && bp.x < 1300 && bp.y > -500 && bp.y < 1100) {
      B.dot(bp, 9, { fill: '#fff', stroke: '#ff9e4a', 'stroke-width': 2.5 });
      const L34 = { A: A[2].y - A[5].y, B: A[5].x - A[2].x, D: A[2].y * A[5].x - A[5].y * A[2].x };
      const dev = Math.abs(plEval(L34, bp));
      const ok = bp.x > 4 && bp.x < 796 && bp.y > 4 && bp.y < 556;
      if (ok) B.text(V(bp.x, bp.y - 17), 'Brianchon 点', { fill: '#fff', 'font-size': 12.5, 'font-weight': 700 });
      chip2(`第三条线到该点距离 ${fmt(dev, 2)} px`, dev < 0.6 ? 'ok' : 'warn');
      B.hint('无论切点如何舞动，三条白色对角线恒共点 —— Pascal 的对偶：配极原则的又一次胜利');
    } else { chip2('—'); B.hint('对角线几乎平行（Brianchon 点在远处）—— 调整切点'); }
  };
  B.render();
  return B;
}
