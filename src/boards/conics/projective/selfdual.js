import { V, mk } from '../../../lib/board.js';
import { createConicLab, plotInk as tone, plotWindow } from '../../../lib/conic-diagram.js';
import { ellipsePoint, polarHexagons } from '../../../lib/projective/conjugate.js';
import { drawLine, lineStyle, toCanvas, toLocal } from '../../../lib/projective/diagram.js';
import { atInfinity, dot3, infinityLine, unitPolar } from '../../../lib/projective/homogeneous.js';

const initialAxes = [1.24, .76];
const initialAngles = [3.99, 2.09, 1.66, .12, 1.27, 2.82];
const symmetricAngles = [.2, 1.23, 2.25, .2 + Math.PI, 1.23 + Math.PI, 2.25 + Math.PI];
const numbers = '₁₂₃₄₅₆';
const pairTones = [tone.blue, tone.amber, tone.teal];

function label(board, x, y, value, color, size) {
  board.text(V(x, y), value, {
    style: `fill:${color};font-size:max(var(--bd-fs, 12px), ${size}px + var(--selfdual-label-boost, 0px))`,
    'font-weight': 700,
  });
}

function ellipse(board, frame, a, b, color, dash = '') {
  mk('ellipse', { cx: frame.cx, cy: frame.cy, rx: frame.a * a, ry: frame.b * b,
    fill: 'none', ...lineStyle(color, dash ? 1.5 : 2.2, dash) }, board.dyn);
}

function axes(board, frame) {
  drawLine(board, frame, [1, 0, 0], lineStyle(tone.axis, 1));
  drawLine(board, frame, [0, 1, 0], lineStyle(tone.axis, 1));
}

function within(point, box, inset = 7) {
  return point && point.x > box.x + inset && point.x < box.x + box.width - inset &&
    point.y > box.y + inset && point.y < box.y + box.height - inset;
}

function pointMark(board, box, point, name, color, dx = 0, dy = -11) {
  if (!within(point, box)) return;
  board.dot(point, 4.2, { fill: color, stroke: tone.paper, 'stroke-width': 1.35 });
  const x = Math.max(box.x + 17, Math.min(box.x + box.width - 17, point.x + dx));
  const y = Math.max(box.y + 19, Math.min(box.y + box.height - 10, point.y + dy));
  label(board, x, y, name, color, 17);
}

function pointLocation(point, frame, box) {
  if (!point) return '未确定';
  if (atInfinity(point)) return '无穷远';
  return within(toCanvas(frame, point), box) ? '视窗内' : '视窗外';
}

export function createSelfdual(root) {
  const B = createConicLab(root, 758, 372);
  const left = { x: 10, y: 37, width: 357, height: 325 };
  const right = { ...left, x: 391 };
  const frame = box => ({ cx: box.x + box.width / 2, cy: box.y + box.height / 2, a: 77, b: 77 });
  const L = frame(left), R = frame(right);
  const showLeft = plotWindow(B, left, 'inscribed');
  const showRight = plotWindow(B, right, 'circumscribed');
  let angles = [...initialAngles], pair = 0, classic = false, displaced = false;
  const radii = () => classic ? [1, 1] : initialAxes;
  const pointAt = i => {
    const factor = displaced && i === 5 ? .64 : 1;
    const [a, b] = radii();
    return ellipsePoint(a * factor, b * factor, angles[i]);
  };

  angles.forEach((_, i) => B.handle({
    get: () => toCanvas(L, pointAt(i)),
    set: p => {
      const [x, y] = toLocal(L, p), [a, b] = radii();
      if (Math.hypot(x, y) > .01) angles[i] = Math.atan2(y / b, x / a);
    },
    color: tone.rose,
  }));

  const axisStatus = B.chip('左 · 对边交点');
  const centerStatus = B.chip('右 · 主对角线');
  const pairStatus = B.chip('当前配对');
  const pairButtons = Array.from({ length: 3 }, (_, index) => B.btn(`第${'一二三'[index]}对`, () => {
    pair = index;
    B.render();
  }));
  const classical = B.toggleBtn('经典构型 E = D = C', false, value => { classic = value; B.render(); });
  const move = B.toggleBtn('令 P₆ 离开 D', false, value => { displaced = value; B.render(); });
  B.btn('中心对称', () => { angles = [...symmetricAngles]; move.set(false); });
  B.btn('复位', () => {
    angles = [...initialAngles];
    pair = 0;
    if (classic) classical.set(false);
    if (displaced) move.set(false);
    B.render();
  });

  B.renderFn = () => {
    const [a, b] = radii();
    const points = angles.map((_, i) => pointAt(i));
    const { edges, polars, vertices, intersections, diagonals, axis, center, collinear, concurrent } = polarHexagons(points);
    const prominent = pairTones[pair];
    pairButtons.forEach((button, i) => {
      button.classList.toggle('on', i === pair);
      button.setAttribute('aria-pressed', String(i === pair));
    });

    label(B, L.cx, 25, displaced ? '顶点六边形' : '内接六边形 · D', tone.ink, 19);
    label(B, R.cx, 25, displaced ? '配极六边形' : '外切六边形 · C', tone.ink, 19);
    showLeft(() => {
      axes(B, L);
      if (!classic) ellipse(B, L, 1, 1, tone.guide, '3 6');
      ellipse(B, L, a, b, tone.violet);
      if (collinear) drawLine(B, L, axis, lineStyle(tone.ink, 2.15));
      edges.forEach((line, i) => {
        const active = i % 3 === pair;
        if (active) drawLine(B, L, line, lineStyle(prominent, 1.5, '5 6'));
        B.seg(toCanvas(L, points[i]), toCanvas(L, points[(i + 1) % 6]),
          lineStyle(active ? prominent : tone.rule, active ? 2.8 : 1.55));
      });
      intersections.forEach((point, i) => pointMark(B, left, toCanvas(L, point), `X${numbers[i]}`, pairTones[i]));
      points.forEach((point, i) => {
        const p = toCanvas(L, point), ux = (p.x - L.cx) / L.a, uy = (p.y - L.cy) / L.b;
        label(B, p.x + 17 * ux / a, p.y + 5 + 16 * uy / b, `P${numbers[i]}`, tone.rose, 17);
      });
    });

    showRight(() => {
      axes(B, R);
      if (!classic) ellipse(B, R, 1, 1, tone.guide, '3 6');
      if (!displaced) ellipse(B, R, 1 / a, 1 / b, tone.violet);
      polars.forEach(line => drawLine(B, R, line, lineStyle(tone.rule, 1.35, '4 6')));
      vertices.forEach((point, i) => {
        const p = toCanvas(R, point), q = toCanvas(R, vertices[(i + 1) % 6]);
        if (p && q) B.seg(p, q, lineStyle(tone.guide, 1.45));
      });
      diagonals.forEach((line, i) => {
        if (i !== pair) drawLine(B, R, line, { ...lineStyle(pairTones[i], 1.45, '5 6'), opacity: .66 });
      });
      drawLine(B, R, diagonals[pair], lineStyle(prominent, 2.6));
      vertices.forEach((point, i) => pointMark(B, right, toCanvas(R, point), `A${numbers[i]}`,
        i % 3 === pair ? prominent : tone.guide, i === 4 ? -15 : 13, i === 1 ? 17 : -10));
      if (concurrent) pointMark(B, right, toCanvas(R, center), 'B', tone.ink, 13, 17);
    });

    const complete = axis && center && intersections.every(Boolean) && diagonals.every(Boolean);
    axisStatus(complete ? (collinear ? (infinityLine(axis) ? '共线于无穷远直线' : '三个交点共线') : '三个交点不共线') : '构造未确定', collinear ? 'ok' : 'warn');
    centerStatus(complete ? (concurrent ? `三线共点 · ${pointLocation(center, R, right)}` : '三线不共点') : '构造未确定', concurrent ? 'ok' : 'warn');
    pairStatus(`X${numbers[pair]}（${pointLocation(intersections[pair], L, left)}） ↔ A${numbers[pair]}A${numbers[pair + 3]}`);
  };
  B.render();
  return B;
}

export function createConjugate(root) {
  const B = createConicLab(root, 642, 376);
  const box = { x: 10, y: 10, width: 622, height: 356 };
  const draw = plotWindow(B, box, 'envelope');
  const F = { cx: 321, cy: 187, a: 113, b: 113 };
  const initialAngle = .53;
  let a = 1.36, b = .74, angle = initialAngle, showEnvelope = false;
  const pAt = (t = angle) => ellipsePoint(a, b, t);
  const pLine = B.chip('P 的极线');
  const qLine = B.chip('Q 的极线');
  const aSlider = B.slider('a', .72, 1.43, .01, a, value => { a = value; B.render(); });
  const bSlider = B.slider('b', .72, 1.43, .01, b, value => { b = value; B.render(); });
  const envelope = B.toggleBtn('显示切线族', false, value => { showEnvelope = value; B.render(); });
  const setAxes = (u, v) => { a = u; b = v; aSlider.sync(u); bSlider.sync(v); B.render(); };
  B.btn('三曲线重合', () => setAxes(1, 1));
  B.btn('复位', () => {
    angle = initialAngle;
    if (showEnvelope) envelope.set(false);
    setAxes(1.36, .74);
  });

  B.handle({ get: () => toCanvas(F, pAt()), set: p => {
    const [x, y] = toLocal(F, p);
    if (Math.hypot(x, y) > .01) angle = Math.atan2(y / b, x / a);
  }, color: tone.blue });

  B.renderFn = () => {
    const P = pAt(), Q = ellipsePoint(1 / a, 1 / b, angle);
    const p = unitPolar(P), q = unitPolar(Q);
    const samePoint = Math.hypot(P[0] - Q[0], P[1] - Q[1]) < 1e-8;
    draw(() => {
      axes(B, F);
      if (showEnvelope) {
        for (let i = 0; i < 16; i++) {
          drawLine(B, F, unitPolar(pAt(i * Math.PI / 8)), { ...lineStyle(tone.teal, 1), opacity: .23 });
        }
      }
      ellipse(B, F, 1, 1, tone.guide, '3 6');
      ellipse(B, F, a, b, tone.blue);
      ellipse(B, F, 1 / a, 1 / b, tone.teal, '7 5');
      drawLine(B, F, q, lineStyle(tone.blue, 2.4, '8 5'));
      drawLine(B, F, p, lineStyle(tone.teal, samePoint ? 1.1 : 2.55));
      if (!samePoint) pointMark(B, box, toCanvas(F, Q), 'Q', tone.teal, -15, -12);
      const screenP = toCanvas(F, P);
      label(B, screenP.x + (samePoint ? 24 : 14), screenP.y + 17, samePoint ? 'P = Q' : 'P', tone.blue, 19);
    });
    const onTangents = Math.abs(dot3(p, Q)) < 1e-8 && Math.abs(dot3(q, P)) < 1e-8;
    pLine('过 Q，与 C 相切', onTangents ? 'ok' : 'warn');
    qLine('过 P，与 D 相切', onTangents ? 'ok' : 'warn');
  };
  B.render();
  return B;
}
