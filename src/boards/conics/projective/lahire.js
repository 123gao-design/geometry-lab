/* 图 7 · La Hire 互易与连线、交点的对偶 */
import { fmt } from '../../../lib/board.js';
import { cross3, dot3, infinityLine, unitPolar } from '../../../lib/projective/homogeneous.js';
import { blue, gold, mint, lineStyle, createDiagram, drawEllipse, drawLine, mark, pointStatus, toCanvas, toLocal } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = createDiagram(root, 720, 420, '分别拖动 P、Q，通过读数验证 La Hire 互易');
  const frame = { cx: 355, cy: 209, a: 132, b: 132 };
  const p0 = [-1.8, .82, 1], q0 = [1.64, -.76, 1];
  let P = toCanvas(frame, p0), Q = toCanvas(frame, q0), showM = false;
  for (const [label, get, set, color] of [
    ['P', () => P, p => { P = p; }, blue], ['Q', () => Q, p => { Q = p; }, gold],
  ]) B.handle({ get, set, label, color, lo: [13, 20] });
  function preset(point, other) {
    P = toCanvas(frame, point);
    Q = toCanvas(frame, other);
    B.render();
  }
  B.btn('共轭点对', () => preset([-2, 0, 1], [-.5, 1.30, 1]), { pri: true });
  B.btn('非共轭点对', () => preset(p0, q0));
  B.btn('两极线平行', () => preset([-1.65, 0, 1], [1.7, 0, 1]));
  B.toggleBtn('显示 M 与 PQ', showM, value => { showM = value; B.render(); });
  const incQ = B.chip('Q ∈ p'), incP = B.chip('P ∈ q'), value = B.chip('双线性式'), where = B.chip('M = p ∩ q');
  B.renderFn = () => {
    const p = toLocal(frame, P), q = toLocal(frame, Q);
    const lp = unitPolar(p), lq = unitPolar(q);
    drawEllipse(B, frame);
    const pDrawn = drawLine(B, frame, lp, lineStyle(blue, 2.5), 'p');
    const qDrawn = drawLine(B, frame, lq, lineStyle(gold, 2.4, '8 6'), 'q');
    const evaluate = dot3(q, lp), reciprocal = dot3(p, lq);
    const zero = n => Math.abs(n) < 1e-9;
    const verdict = n => zero(n) ? '成立' : '不成立';
    const display = n => zero(n) ? '0' : Math.abs(n) < .0001 ? n.toExponential(2) : fmt(n, 4);
    incQ(verdict(evaluate), zero(evaluate) ? 'ok' : '');
    incP(verdict(reciprocal), zero(reciprocal) ? 'ok' : '');
    value(`${display(evaluate)} = ${display(reciprocal)}`);
    const intersection = cross3(lp, lq);
    where(intersection ? pointStatus(B, frame, intersection) : 'p 与 q 重合');
    if (showM && intersection) {
      drawLine(B, frame, unitPolar(intersection), lineStyle(mint, 2.4, '3 5'), '');
      mark(B, toCanvas(frame, intersection), 'M', mint, 13, 19);
    }
    const outside = [[lp, pDrawn, 'p'], [lq, qDrawn, 'q']]
      .filter(([, drawn]) => !drawn)
      .map(([line, , label]) => `${label}${infinityLine(line) ? ' 是无穷远直线' : ' 在视窗外'}`);
    B.hint(outside.join(' · '));
  };
  B.render();
  return B;
}
