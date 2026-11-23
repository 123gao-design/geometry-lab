/* 图 10 · Brianchon 点，包括无穷远顶点与切线极限 */
import { atInfinity, cross3, dot3, unitPolar } from '../../../lib/projective/homogeneous.js';
import { guide, ink, lineStyle, drawLine, mark, pointStatus, toCanvas, visible } from '../../../lib/projective/diagram.js';
import { hexagon, pairColors, sub } from '../../../lib/projective/hexagon.js';

export function createBoard(root) {
  let verdict, corners;
  const B = hexagon(root, '拖动切点，观察切线六边形的三条主对角线', (board, frame, { points, edges, tangent }) => {
    points.forEach(p => drawLine(board, frame, unitPolar(p), { ...lineStyle(guide, 1.4), opacity: .68 }));
    // 每条弦的极点是邻切线交点。邻切线重合时，弦的切线极限给出该切点。
    const vertices = edges.map(unitPolar);
    const ap = vertices.map(p => toCanvas(frame, p));
    ap.forEach((p, i) => {
      const next = ap[(i + 1) % 6];
      if (visible(board, p, 0) && visible(board, next, 0)) board.seg(p, next, lineStyle(guide, 2.2));
    });
    const diagonals = vertices.slice(0, 3).map((p, i) => cross3(p, vertices[i + 3]));
    const [a, b, c] = diagonals;
    const meet = cross3(a, b) || cross3(b, c) || cross3(c, a);
    diagonals.forEach((line, i) => drawLine(board, frame, line, lineStyle(pairColors[i], 2.1)));
    ap.forEach((p, i) => mark(board, p, 'A' + sub[i], guide, i % 2 ? -17 : 14, i % 2 ? 19 : -11));
    mark(board, toCanvas(frame, meet), 'B', ink, 13, 17);

    const far = vertices.flatMap((p, i) => atInfinity(p) ? ['A' + sub[i]] : []);
    const limiting = tangent.flatMap((t, i) => t ? ['A' + sub[i]] : []);
    if (!meet || diagonals.some(l => !l)) {
      verdict('移开重合的顶点以确定对角线', 'warn');
    } else if (diagonals.every(l => Math.abs(dot3(l, meet)) < 1e-8)) {
      verdict(`三线共点 · B ${pointStatus(board, frame, meet)}`, 'ok');
    } else {
      verdict('构型接近退化', 'warn');
    }
    corners([
      far.length ? `${far.join('、')} 在无穷远` : '顶点均为有限点',
      limiting.length ? `${limiting.join('、')} 取切点极限` : '',
    ].filter(Boolean).join(' · '));
  });
  verdict = B.chip('Brianchon 点 B');
  corners = B.chip('切线顶点');
  B.render();
  return B;
}
