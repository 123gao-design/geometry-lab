/* 图 8 · 共线点的极线束，包含平行的极线束 */
import { V, sub, dot, lerp } from '../../../lib/board.js';
import { atInfinity, cross3, dot3, unitPolar } from '../../../lib/projective/homogeneous.js';
import { blue, gold, ink, mint, pink, lineStyle, createDiagram, drawEllipse, drawLine, mark, pointStatus, toCanvas, toLocal } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = createDiagram(root, 720, 426, '拖动直线的端点或沿线滑动四点，观察它们的极线束');
  const frame = { cx: 342, cy: 239, a: 144, b: 104 };
  const normal = [V(95, 81), V(648, 154)], through = [V(95, 239), V(648, 239)];
  let [a, b] = normal;
  const fractions = [.12, .3, .62, .85], colors = [blue, gold, mint, pink], subs = '₁₂₃₄';
  B.handle({ get: () => a, set: p => { a = p; }, color: ink, thin: true });
  B.handle({ get: () => b, set: p => { b = p; }, color: ink, thin: true });
  fractions.forEach((_, i) => B.handle({
    get: () => lerp(a, b, fractions[i]),
    set: p => {
      const d = sub(b, a), n = dot(d, d);
      if (n) fractions[i] = Math.max(.04, Math.min(.96, dot(sub(p, a), d) / n));
    },
    color: colors[i], label: 'P' + subs[i], lo: [11, -11],
  }));
  B.btn('一般位置', () => { [a, b] = normal; B.render(); });
  B.btn('过椭圆中心', () => { [a, b] = through; B.render(); }, { pri: true });
  const pole = B.chip('极点 L'), check = B.chip('关联检验');
  B.renderFn = () => {
    drawEllipse(B, frame);
    const l = cross3(toLocal(frame, a), toLocal(frame, b));
    if (!l) {
      pole('两把手重合'); check('拖开以确定 l', 'warn');
      return;
    }
    drawLine(B, frame, l, lineStyle(ink, 1.6, '5 6'), 'l');
    const L = unitPolar(l);
    const polars = fractions.map(t => unitPolar(toLocal(frame, lerp(a, b, t))));
    polars.forEach((p, i) => drawLine(B, frame, p, lineStyle(colors[i], 1.8)));
    mark(B, toCanvas(frame, L), 'L', ink, 17, 19);
    pole(pointStatus(B, frame, L));
    const residual = Math.max(...polars.map(p => Math.abs(dot3(p, L))));
    check(residual < 1e-9 ? (atInfinity(L) ? '极线束在同一无穷远点相交' : '四条极线都经过 L') : '构型接近退化', residual < 1e-9 ? 'ok' : 'warn');
  };
  B.render();
  return B;
}
