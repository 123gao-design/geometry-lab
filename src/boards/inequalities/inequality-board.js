import '../info-readings.css';
import { StudyBoard } from '../study-board.js';

export class InequalityBoard extends StudyBoard {
  constructor(root, width, height, readingStyle = 'triangle') {
    super(root, width, height);
    root.classList.add('ineq-board');
    this.groupReadings('不等式读数');
    this.readingGroup.dataset.readingStyle = readingStyle;
    this.chipRow.dataset.readingStyle = 'info';
  }
}

// 返回直线 Ax + By + C = 0 在坐标网格内可见的线段（SVG 坐标）。
export function visibleLine(m, a, b, c) {
  const points = [];
  function add(x, y) {
    if (x < m.X0 - 1e-9 || x > m.X1 + 1e-9 || y < m.Y0 - 1e-9 || y > m.Y1 + 1e-9) return;
    const p = { x: m.px(x), y: m.py(y) };
    if (!points.some(q => Math.hypot(q.x - p.x, q.y - p.y) < 1e-7)) points.push(p);
  }
  if (Math.abs(b) > 1e-9) for (const x of [m.X0, m.X1]) add(x, (-c - a * x) / b);
  if (Math.abs(a) > 1e-9) for (const y of [m.Y0, m.Y1]) add((-c - b * y) / a, y);
  return points.length >= 2 ? points : null;
}
