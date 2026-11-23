/* 图 6 · 极点位置、极线与切点弦 */
import { V, fmt } from '../../../lib/board.js';
import { dot3, unitPolar } from '../../../lib/projective/homogeneous.js';
import { blue, gold, guide, ink, lineStyle, createDiagram, drawEllipse, drawLine, mark, toCanvas, toLocal } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = createDiagram(root, 720, 420, '拖动极点 P，观察它的极线和切点');
  const frame = { cx: 310, cy: 209, a: 174, b: 112 };
  const initial = [1.58, .85, 1];
  let P = toCanvas(frame, initial);
  B.handle({ get: () => P, set: p => { P = p; }, color: ink, label: 'P', lo: [14, 19] });
  for (const [label, point] of [
    ['外点', initial], ['曲线上', [.8, .6, 1]], ['内点', [.7, .2, 1]], ['中心', [0, 0, 1]],
  ]) {
    B.btn(label, () => { P = toCanvas(frame, point); B.render(); });
  }
  B.toggleBtn('切换到圆', false, round => {
    frame.b = round ? frame.a : 112;
    B.render();
  });
  const location = B.chip('P 的位置'), tangent = B.chip('实切线'), equation = B.chip('极线 p');
  B.renderFn = () => {
    const point = toLocal(frame, P), p = unitPolar(point);
    const [u, v] = point;
    const level = dot3(point, p);
    const on = Math.abs(level) <= 1e-10;
    drawEllipse(B, frame);
    mark(B, V(frame.cx, frame.cy), 'O', guide, -14, 18);
    const drawn = drawLine(B, frame, p, lineStyle(blue, 2.6), 'p');
    equation(Math.hypot(u, v) <= 1e-10
      ? 'w = 0（无穷远直线）'
      : `(${fmt(u, 2)})u + (${fmt(v, 2)})v = 1${drawn ? '' : ' · 视窗外'}`);
    if (level > 1e-10) {
      const r2 = level + 1, k = Math.sqrt(level) / r2;
      const ends = [[u / r2 - v * k, v / r2 + u * k, 1], [u / r2 + v * k, v / r2 - u * k, 1]];
      ends.forEach((end, i) => {
        const T = toCanvas(frame, end);
        B.seg(P, T, lineStyle(gold, 2));
        mark(B, T, i ? 'T₂' : 'T₁', gold, i ? 14 : -15, i ? 20 : -13);
      });
    }
    location(on ? '曲线上' : level > 0 ? '曲线外' : '曲线内');
    tangent(on ? '1 条 · p 就是 P 处切线' : level > 0 ? '2 条 · p 经过 T₁、T₂' : '0 条', 'ok');
  };
  B.render();
  return B;
}
