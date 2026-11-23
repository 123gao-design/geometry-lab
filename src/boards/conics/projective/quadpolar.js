/* 图 5 · 两条割线构造自配极三角形 */
import { V, add, sub, len, mul, dist, lineConic, fmt } from '../../../lib/board.js';
import { cross3, dot3, infinityLine, unitPolar } from '../../../lib/projective/homogeneous.js';
import { blue, gold, guide, ink, pink, lineStyle, createDiagram, drawEllipse, drawLine, mark, pointStatus, toCanvas, toLocal } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = createDiagram(root, 720, 440, '旋转两条割线，观察 Q、R 确定的极线');
  const frame = { cx: 345, cy: 220, a: 153, b: 108 };
  const initial = V(547, 169);
  let P = initial, angles = [2.3, 2.78], show = true;
  const direction = t => V(Math.cos(t), Math.sin(t));
  B.handle({ get: () => P, set: p => { P = p; }, color: ink, label: 'P', lo: [12, 19] });
  angles.forEach((_, i) => B.handle({ get: () => add(P, mul(direction(angles[i]), 61)),
    set: p => {
      const d = sub(p, P);
      if (len(d) > 12) angles[i] = Math.atan2(d.y, d.x);
    }, color: gold, thin: true }));
  const reset = (point, t) => { P = point; angles = t; B.render(); };
  B.btn('外点构造', () => reset(initial, [2.3, 2.78]));
  B.btn('中心构造', () => reset(V(frame.cx, frame.cy), [2.3, 2.78]));
  B.toggleBtn('叠加公式极线', show, value => { show = value; B.render(); });
  const status = B.chip('对角点'), check = B.chip('构造线 QR');

  B.renderFn = () => {
    drawEllipse(B, frame);
    const d = angles.map(direction);
    const cuts = d.map(dir => lineConic(frame, P, add(P, dir)));
    d.forEach(dir => {
      B.inf(P, add(P, dir), { ...lineStyle(gold, 1.25, '4 7'), opacity: .66 });
      B.seg(P, add(P, mul(dir, 61)), lineStyle(gold, 2));
    });
    const p = unitPolar(toLocal(frame, P));
    if (show) drawLine(B, frame, p, lineStyle(blue, 2.2, '7 6'));
    if (cuts.some(pair => !pair || dist(...pair) < 1e-4)
      || Math.abs(Math.sin(angles[1] - angles[0])) < 1e-6
      || Math.abs(dot3(toLocal(frame, P), p)) < 1e-10) {
      status('需要两条不同的实割线及四个不同的交点', 'warn');
      check('请调整割线或移动 P');
      return;
    }
    const canvasPoints = cuts.flat(), [a, b, c, dPoint] = canvasPoints.map(point => toLocal(frame, point));
    const sides = [[a, c], [b, dPoint], [a, dPoint], [b, c]].map(pair => cross3(...pair));
    sides.forEach(l => drawLine(B, frame, l, { ...lineStyle(guide, 1.3), opacity: .58 }));
    const q = cross3(sides[0], sides[1]), r = cross3(sides[2], sides[3]);
    const qr = cross3(q, r);
    const drawn = drawLine(B, frame, qr, lineStyle(pink, 2.6), 'QR');
    if (show && drawn) drawLine(B, frame, p, lineStyle(blue, 1.6, '7 6'));
    canvasPoints.forEach((point, i) => mark(B, point, 'ABCD'[i], gold, i % 2 ? 13 : -12, -12));
    mark(B, toCanvas(frame, q), 'Q', pink);
    mark(B, toCanvas(frame, r), 'R', pink, 13, 19);
    status(`Q ${pointStatus(B, frame, q)} · R ${pointStatus(B, frame, r)}`);
    if (!qr) check('构造未确定', 'warn');
    else {
      const e = Math.max(Math.abs(dot3(q, p)), Math.abs(dot3(r, p)));
      check(`${infinityLine(qr) ? '无穷远直线' : drawn ? '与理论极线重合' : '极线在视窗外'} · 残差 ${fmt(e, 6)}`, e < 1e-8 ? 'ok' : 'warn');
    }
  };
  B.render();
  return B;
}
