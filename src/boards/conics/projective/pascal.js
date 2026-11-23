/* 图 9 · Pascal 线，包括平行对边与切线极限 */
import { cross3, dot3, infinityLine } from '../../../lib/projective/homogeneous.js';
import { ink, lineStyle, drawLine, mark, pointStatus, toCanvas } from '../../../lib/projective/diagram.js';
import { drawHexagonEdges, hexagon, pairColors } from '../../../lib/projective/hexagon.js';

export function createBoard(root) {
  let statuses, verdict;
  const B = hexagon(root, '拖动椭圆上的六个顶点，观察对边交点与 Pascal 线', (board, frame, { points, edges, tangent }) => {
    edges.forEach((e, i) => drawLine(board, frame, e, {
      ...lineStyle(pairColors[i % 3], tangent[i] ? 2.5 : 1.2, tangent[i] ? '' : '5 6'),
      opacity: tangent[i] ? 1 : .56,
    }));
    drawHexagonEdges(board, frame, points, pairColors, tangent);
    const intersections = edges.slice(0, 3).map((e, i) => cross3(e, edges[i + 3]));
    const [X, Y, Z] = intersections;
    const line = cross3(X, Y) || cross3(Y, Z) || cross3(Z, X);
    const drawn = drawLine(board, frame, line, lineStyle(ink, 2.4), 'p');
    intersections.forEach((p, i) => {
      mark(board, toCanvas(frame, p), 'XYZ'[i], pairColors[i], 10, -13);
      statuses[i](pointStatus(board, frame, p));
    });
    if (!line || intersections.some(p => !p)) {
      verdict('移开重合的边或交点以确定构造', 'warn');
    } else if (intersections.every(p => Math.abs(dot3(p, line)) < 1e-8)) {
      verdict(infinityLine(line) ? 'p = 无穷远直线' : drawn ? 'X、Y、Z 共线' : 'p 在视窗外 · 三点仍共线', 'ok');
    } else {
      verdict('构型接近退化', 'warn');
    }
  });
  statuses = ['X', 'Y', 'Z'].map(label => B.chip(label));
  verdict = B.chip('Pascal 线 p');
  B.render();
  return B;
}
