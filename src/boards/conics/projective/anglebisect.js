/* 图 3b · 内外角平分线：三角形的角平分线把对边分成调和点列 */
import { Board, V, sub, add, mul, norm, dist, interLL, crOn, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 470;
  const B = new Board(root, W, H);
  const st = { A: V(400, 110), B: V(180, 390), C: V(620, 350) };
  for (const [k, col] of [['A', '#5cadff'], ['B', '#fff'], ['C', '#fff']])
    B.handle({ get: () => st[k], set: p => { st[k] = p; }, color: col, r: 8, label: k, lo: [10, -12] });

  const chip1 = B.chip('(B,C;D,E)'), chip2 = B.chip('内分比 / 外分比'), chip3 = B.chip('AB : AC');

  function arc(c, r, a1, a2, color) { // 短弧（屏幕坐标系）
    let d = a2 - a1;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    const p1 = V(c.x + r * Math.cos(a1), c.y + r * Math.sin(a1));
    const p2 = V(c.x + r * Math.cos(a2), c.y + r * Math.sin(a2));
    mk('path', { d: `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 ${d > 0 ? 1 : 0} ${p2.x} ${p2.y}`,
      fill: 'none', stroke: color, 'stroke-width': 1.6 }, B.dyn);
  }

  B.renderFn = () => {
    const { A, B: C0, C } = st; // C0 即顶点 B
    B.inf(C0, C, { stroke: '#3a4a63', 'stroke-width': 2 });
    B.seg(A, C0, { stroke: '#2e3d57', 'stroke-width': 1.4 }); B.seg(A, C, { stroke: '#2e3d57', 'stroke-width': 1.4 });
    const uB = norm(sub(C0, A)), uC = norm(sub(C, A));
    const sum = add(uB, uC), dif = sub(uB, uC);
    const degenerate = dist(A, C0) < 25 || dist(A, C) < 25 || dist(sum, V(0, 0)) < 0.02;
    if (degenerate) {
      B.hint('∠A 接近 0° 或 180°：内外角平分线退化 —— 把 A 拖离 BC 线一点');
      chip1('—'); chip2('—'); chip3('—'); return;
    }
    const dirIn = norm(sum), dirOut = norm(dif);
    const D = interLL(A, add(A, mul(dirIn, 900)), C0, C);   // 内分点
    const E = interLL(A, add(A, mul(dirOut, 900)), C0, C);  // 外分点
    // 平分线
    B.inf(A, add(A, mul(dirIn, 60)), { stroke: '#4ade80', 'stroke-width': 1.8 });
    B.inf(A, add(A, mul(dirOut, 60)), { stroke: '#ffd166', 'stroke-width': 1.5, 'stroke-dasharray': '7 5' });
    // 等角弧标记（内角两侧）
    const aB = Math.atan2(uB.y, uB.x), aI = Math.atan2(dirIn.y, dirIn.x), aC = Math.atan2(uC.y, uC.x);
    arc(A, 46, aB, aI, '#67e8f9'); arc(A, 46, aI, aC, '#67e8f9');
    const aO = Math.atan2(dirOut.y, dirOut.x);
    arc(A, 62, aB, aO, '#a06226'); arc(A, 62, aO, aC, '#a06226');
    if (D && E) {
      B.dot(D, 7, { fill: '#4ade80', stroke: '#fff', 'stroke-width': 2 });
      B.dot(E, 7, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
      B.text(V(D.x, D.y - 14), 'D（内分）', { fill: '#4ade80', 'font-size': 11.5, 'font-weight': 700 });
      if (E.x > -50 && E.x < W + 50) B.text(V(E.x, E.y - 14), 'E（外分）', { fill: '#ffd166', 'font-size': 11.5, 'font-weight': 700 });
      const cr = crOn(C0, C, D, E);
      const rIn = Math.abs(dist(D, C0) / dist(D, C)), rOut = Math.abs(dist(E, C0) / dist(E, C));
      chip1(fmt(cr, 3), Math.abs(cr + 1) < 0.01 ? 'ok' : 'warn');
      chip2(`BD:DC = ${fmt(rIn, 3)} ／ BE:EC = ${fmt(rOut, 3)}（相等）`, 'ok');
      chip3(fmt(dist(A, C0) / dist(A, C), 3), 'ok');
      B.hint('内角平分线定理 + 外角平分线定理 ⟹ D 与 E 调和分割 BC —— 两个比值都等于 AB : AC');
    } else { chip1('E 在无穷远（∠A 平分后与 BC 平行）', 'warn'); chip2('—'); chip3('—'); }
  };
  B.render();
  return B;
}
