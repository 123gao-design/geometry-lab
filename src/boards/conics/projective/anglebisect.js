/* 图 3b · 内外角平分线交对边为调和点列 */
import { V, add, sub, mul, norm, len, lerp, cross, arcPts, fmt, mk } from '../../../lib/board.js';
import { projectiveCrossRatio } from '../../../lib/projective/homogeneous.js';
import { gold, guide, ink, mint, lineStyle, createDiagram, mark, visible } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = createDiagram(root, 720, 410, '拖动三角形顶点，比较内角和外角平分线的分点');
  const initial = [V(216, 201), V(246, 348), V(562, 348)];
  let points = [...initial];
  points.forEach((_, i) => B.handle({
    get: () => points[i], set: p => { points[i] = p; }, color: ink, label: 'ABC'[i],
  }));
  B.btn('等腰三角形', () => { points = [V(360, 105), V(170, 320), V(550, 320)]; B.render(); }, { pri: true });
  B.btn('一般三角形', () => { points = [...initial]; B.render(); });
  const ratio = B.chip('距离比 AB / AC'), check = B.chip('(B,C;D,E)'), location = B.chip('E 的位置');
  B.renderFn = () => {
    const [A, Bp, C] = points;
    const AB = sub(Bp, A), AC = sub(C, A);
    const a = len(AB), b = len(AC), u = norm(AB), v = norm(AC);
    B.inf(Bp, C, lineStyle(guide, 1.4, '5 6'));
    B.seg(Bp, C, lineStyle(guide, 2.2));
    B.seg(A, Bp, lineStyle(guide, 2.2));
    B.seg(A, C, lineStyle(guide, 2.2));
    if (Math.min(a, b) < 1 || Math.abs(cross(u, v)) < 1e-6) {
      check('—'); ratio('—'); location('需要三个不共线的顶点', 'warn');
      return;
    }
    const d = a / (a + b), e = Math.abs(a - b) < 1e-8 ? null : a / (a - b);
    const D = lerp(Bp, C, d), E = e == null ? null : lerp(Bp, C, e);
    const inner = norm(add(u, v)), outer = norm(sub(u, v));
    B.inf(A, add(A, outer), lineStyle(gold, 2, '7 5'));
    B.seg(A, D, lineStyle(mint, 2.5));
    const angle = p => Math.atan2(p.y, p.x), t = angle(inner);
    for (const [from, to] of [[angle(u), t], [t, angle(v)]]) {
      mk('path', { d: arcPts(A, from, to, 29), fill: 'none', ...lineStyle(mint, 1.4) }, B.dyn);
    }
    mark(B, D, 'D', mint, 10, -12);
    mark(B, E, 'E', gold, 10, -12);
    ratio(fmt(a / b, 3));
    const cr = projectiveCrossRatio([0, 1], [1, 1], [d, 1], e == null ? [1, 0] : [e, 1]);
    check(cr == null ? '—' : fmt(cr, 3), cr == null ? '' : 'ok');
    location(!E ? '无穷远 · 外角平分线平行于 BC' : visible(B, E) ? '视窗内' : '视窗外');
  };
  B.render();
  return B;
}
