import { V, dist, mk } from '../board.js';
import { atInfinity, infinityLine } from './homogeneous.js';

export const ink = 'var(--pj-ink)', blue = 'var(--pj-blue)', gold = 'var(--pj-gold)';
export const mint = 'var(--pj-mint)', pink = 'var(--pj-pink)', guide = 'var(--pj-guide)';
export const paper = 'var(--pj-paper)';
export const conicStyle = { fill: blue, 'fill-opacity': .055, stroke: guide, 'stroke-width': 2.15 };
export const lineStyle = (stroke, width = 2, dashed = '') => ({
  stroke, 'stroke-width': width, 'stroke-linecap': 'round', ...(dashed && { 'stroke-dasharray': dashed }),
});

export { createDiagram } from '../conic-diagram.js';

export function drawEllipse(B, { cx, cy, a, b }) {
  mk('ellipse', { cx, cy, rx: a, ry: b, ...conicStyle }, B.dyn);
}

export const toLocal = ({ cx, cy, a, b }, p) => [(p.x - cx) / a, (cy - p.y) / b, 1];
export const toCanvas = ({ cx, cy, a, b }, p) =>
  p && !atInfinity(p) ? V(cx + a * p[0] / p[2], cy - b * p[1] / p[2]) : null;

export function visible(B, p, pad = 12) {
  return p && p.x >= pad && p.x <= B.w - pad && p.y >= pad && p.y <= B.h - pad;
}

export function drawLine(B, { cx, cy, a, b }, line, attrs, label = '') {
  if (!line || infinityLine(line)) return false;
  const [u, v, w] = line;
  const A = u / a, D = -v / b, C = w - A * cx - D * cy;
  const ends = [];
  const inset = 6;
  for (const x of [inset, B.w - inset]) {
    const y = -(A * x + C) / D;
    if (y >= inset && y <= B.h - inset) ends.push(V(x, y));
  }
  for (const y of [inset, B.h - inset]) {
    const x = -(D * y + C) / A;
    const candidate = V(x, y);
    if (x >= inset && x <= B.w - inset && ends.every(p => dist(p, candidate) > 1e-7)) ends.push(candidate);
  }
  if (ends.length < 2) return false;
  B.seg(ends[0], ends[1], attrs);
  if (label) {
    const point = V(ends[0].x * .19 + ends[1].x * .81, ends[0].y * .19 + ends[1].y * .81);
    B.text(V(Math.max(20, Math.min(B.w - 20, point.x + 13)),
      Math.max(24, Math.min(B.h - 14, point.y - 8))), label, {
      fill: attrs.stroke, 'font-size': 19, 'font-weight': 700,
    });
  }
  return true;
}

export function mark(B, p, label, color, dx = 12, dy = -12) {
  if (!visible(B, p, 6)) return;
  B.dot(p, 4, { fill: color, stroke: paper, 'stroke-width': 1.25 });
  if (label) B.text(V(Math.max(16, Math.min(B.w - 16, p.x + dx)), Math.max(18, Math.min(B.h - 12, p.y + dy))), label, {
    fill: color, 'font-size': 18, 'font-weight': 700,
  });
}

export function pointStatus(B, frame, p) {
  if (!p) return '构造未确定';
  if (atInfinity(p)) return '无穷远方向';
  return visible(B, toCanvas(frame, p), 6) ? '视窗内' : '视窗外';
}
