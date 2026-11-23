import { TAU, angDiff } from '../board.js';
import { contact, unitChord } from './homogeneous.js';
import { blue, gold, mint, pink, createDiagram, drawEllipse, lineStyle, mark, toCanvas, toLocal } from './diagram.js';

export const pairColors = [blue, gold, mint];
export const sub = '₁₂₃₄₅₆';
const general = [1.88, 6.08, 4.56, 4.06, 5.05, 2.66];
const symmetric = [0, 1, 2, Math.PI, 1 + Math.PI, 2 + Math.PI];

export function hexagon(root, label, paint) {
  const B = createDiagram(root, 720, 440, label);
  const frame = { cx: 360, cy: 213, a: 142, b: 98 };
  let angles = [...general];
  const coordinate = t => toCanvas(frame, contact(t));
  angles.forEach((_, i) => B.handle({
    get: () => coordinate(angles[i]),
    set: p => {
      const [x, y] = toLocal(frame, p);
      if (Math.hypot(x, y) > .01) angles[i] = Math.atan2(y, x);
    },
    color: pink, label: String(i + 1), lo: [10, -11],
  }));
  const motion = B.toggleBtn('连续转动', false, active => {
    B.cancelRaf();
    if (!active) return;
    let last;
    const tick = now => {
      const dt = last == null ? 0 : Math.min(40, now - last);
      last = now;
      angles = angles.map((t, i) => (t + dt * (i % 2 ? 1 : -1) * (.0002 + .000027 * i)) % TAU);
      B.render();
      B.raf(tick);
    };
    B.raf(tick);
  });
  const select = (label, values) => B.btn(label, () => {
    motion.set(false);
    angles = [...values];
    B.render();
  });
  select('交叉六边形', general);
  select('凸六边形', [.2, 1.25, 2.31, 3.49, 4.5, 5.67]);
  select('一组对边平行', [.01, .38, .95, 5.23, .01 + .38 - 5.23 + TAU, 2.22]);
  select('中心对称', symmetric);
  select('让 6 和 1 重合', [.2, 3.6, 2.4, 5.3, 4.2, .2]);
  B.btn('打乱六点', () => {
    motion.set(false);
    angles = general.map(t => t + (Math.random() - .5) * 2);
    B.render();
  });
  B.renderFn = () => {
    drawEllipse(B, frame);
    const points = angles.map(contact);
    const edges = angles.map((t, i) => unitChord(t, t + angDiff(angles[(i + 1) % 6], t)));
    const tangent = angles.map((t, i) => Math.abs(angDiff(angles[(i + 1) % 6], t)) < 1e-10);
    paint(B, frame, { points, edges, tangent });
    // 合并把手仍画在同一位置，图内补上被遮住的编号。
    tangent.forEach((isTangent, i) => {
      if (isTangent) mark(B, coordinate(angles[i]), `${i + 1}=${(i + 1) % 6 + 1}`, pink, -23, 21);
    });
  };
  return B;
}

export function drawHexagonEdges(B, frame, points, colors, tangent) {
  points.forEach((p, i) => {
    if (tangent[i]) return;
    B.seg(toCanvas(frame, p), toCanvas(frame, points[(i + 1) % 6]), lineStyle(colors[i % 3], 2.8));
  });
}
