import { Board, mk, TAU, V } from '../../../lib/board.js';
import { angleTex, unitCoordinates } from '../trig-board.js';
import { ChordProof } from './chord-proof.js';

import { ProofBoard } from '../proof-board.js';

const GOLD = '#ffd166';
const BLUE = '#5cadff';
const ORANGE = '#ff9e4a';
const MINT = '#67e8f9';
const DEGREE = TAU / 360;
const snap = value => Math.round(value / DEGREE) * Math.PI / 180;

export function createBoard(root) {
  const B = new ProofBoard(root, 500, 430);
  root.classList.add('chord-board');
  B.svg.setAttribute('aria-label', '单位圆及弦 PQ');
  const O = V(250, 215), R = 160;
  const state = { a: 60 * DEGREE, b: 30 * DEGREE };
  const point = (angle, radius = R) => {
    const { x, y } = unitCoordinates(angle);
    return V(O.x + radius * x, O.y - radius * y);
  };

  const sliders = {};
  for (const [key, letter] of [['a', 'alpha'], ['b', 'beta']]) {
    sliders[key] = B.slider(key === 'a' ? '角 α' : '角 β', 0, TAU, 'any', state[key],
      value => {
        state[key] = snap(value);
        sliders[key].sync(state[key]);
        B.render();
      }, undefined,
      (_, angle) => '$\\' + letter + '=' + angleTex(angle) + '$');
  }
  function applyAngles(a, b) {
    state.a = a;
    state.b = b;
    sliders.a.sync(a);
    sliders.b.sync(b);
    B.render();
  }
  B.btnM('$\\alpha\\leftrightarrow\\beta$', () => applyAngles(state.b, state.a));
  B.btnM('$\\alpha=\\beta=45^\\circ$', () => applyAngles(Math.PI / 4, Math.PI / 4));

  const getHandle = (key, label, color) => {
    const handle = B.handle({
      color,
      get: () => point(state[key]),
      set: p => {
        const angle = (Math.atan2(O.y - p.y, p.x - O.x) + TAU) % TAU;
        state[key] = snap(angle);
        sliders[key].sync(state[key]);
      },
    });
    handle.setAttribute('aria-label', '可移动点 ' + label);
    return handle;
  };
  const pHandle = getHandle('a', 'P', GOLD);
  const qHandle = getHandle('b', 'Q', BLUE);
  const proof = new ChordProof(B);

  function label(p, name, color) {
    const node = Board.prototype.text.call(B, p, name, { fill: color });
    node.style.fill = node.getAttribute('fill');
  }

  function drawAxes() {
    const { axis, guide } = B.diagramColors;
    B.seg(V(44, O.y), V(456, O.y), { stroke: guide, 'stroke-width': 1, 'stroke-opacity': .7 });
    B.seg(V(O.x, 411), V(O.x, 18), { stroke: guide, 'stroke-width': 1, 'stroke-opacity': .7 });
    mk('path', { d: 'M448 212 L456 215 L448 218 M247 26 L250 18 L253 26', fill: 'none',
      stroke: guide, 'stroke-width': 1 }, B.dyn);
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none',
      stroke: guide, 'stroke-opacity': .17, 'stroke-width': 5 }, B.dyn);
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none',
      stroke: guide, 'stroke-width': 1.4 }, B.dyn);
    for (const a of [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2]) {
      B.seg(point(a, R - 4), point(a, R + 4), { stroke: axis, 'stroke-width': 1.5 });
    }
    label(V(454, O.y + 19), 'x', guide);
    label(V(O.x + 17, 25), 'y', guide);
    label(V(O.x - 13, O.y + 18), 'O', guide);
  }

  function drawProjection(P, Q) {
    const corner = V(Q.x, P.y);
    const dx = P.x - Q.x, dy = Q.y - P.y;
    if (Math.abs(dx) < 1 || Math.abs(dy) < 1) return;
    const guide = { stroke: MINT, 'stroke-width': 1.3, 'stroke-dasharray': '5 5' };
    B.seg(P, corner, guide);
    B.seg(corner, Q, guide);
    const side = Math.min(9, Math.abs(dx) / 3, Math.abs(dy) / 3);
    const x = side * Math.sign(dx), y = side * Math.sign(dy);
    mk('path', { d: 'M' + (corner.x + x) + ' ' + corner.y + ' v' + y + ' h' + (-x),
      stroke: MINT, fill: 'none' }, B.dyn);
  }

  function drawAngle(a, b, turn) {
    const n = Math.max(2, Math.ceil(Math.abs(turn) / .06));
    const radius = 48;
    const vertices = [];
    for (let i = 0; i <= n; i++) {
      const p = point(b + turn * i / n, radius);
      vertices.push(p.x + ',' + p.y);
    }
    mk('polyline', { points: vertices.join(' '), fill: 'none', stroke: MINT, 'stroke-width': 2 }, B.dyn);
    const p = point(a - turn / 2, radius + 19);
    if (Math.abs(turn) >= .2) label(V(p.x, p.y + 4), 'θ', MINT);
  }

  function pointLabel(angle, offset, name, color) {
    const p = point(angle + offset, R + 22);
    // 贴近坐标轴时将文字移到轴旁，两个点相邻时沿圆周错开。
    if (Math.abs(p.y - O.y) < 11) p.y += p.y <= O.y ? -13 : 13;
    if (Math.abs(p.x - O.x) < 11) p.x += p.x <= O.x ? -17 : 17;
    label(V(p.x, p.y + 4), name, color);
  }

  B.renderFn = () => {
    const { a, b } = state;
    const P = point(a), Q = point(b);
    const turn = Math.atan2(Math.sin(a - b), Math.cos(a - b));
    const close = Math.hypot(P.x - Q.x, P.y - Q.y) < 1;
    const keepQ = qHandle.classList.contains('drag') ||
      (!pHandle.classList.contains('drag') && document.activeElement === qHandle);
    pHandle.style.display = close && keepQ ? 'none' : '';
    qHandle.style.display = close && !keepQ ? 'none' : '';

    drawAxes();
    if (!close && proof.step === 0) drawProjection(P, Q);
    if (!close && proof.step === 1) drawAngle(a, b, turn);
    if (!close || !keepQ) B.seg(O, P, { stroke: GOLD, 'stroke-width': 2 });
    if (!close || keepQ) B.seg(O, Q, { stroke: BLUE, 'stroke-width': 2 });
    if (!close) {
      B.seg(P, Q, { stroke: ORANGE, 'stroke-width': 2.5, 'stroke-linecap': 'round' });
      if (Math.abs(turn) > .18) {
        const chordRadius = R * Math.cos(turn / 2);
        const inner = Math.max(22, chordRadius - 22);
        const labelRadius = proof.step === 1 && Math.abs(inner - 67) < 17 ? chordRadius + 20 : inner;
        const p = point(b + turn / 2, labelRadius);
        label(V(p.x, p.y + 4), 'd', ORANGE);
      }
    }

    const spread = !close && Math.abs(turn) < .16 ? .1 * Math.sign(turn) : 0;
    pointLabel(a, spread, close ? 'P=Q' : 'P', close && keepQ ? BLUE : GOLD);
    if (!close) pointLabel(b, -spread, 'Q', BLUE);
    proof.update(a, b, Math.abs(turn));
  };
  B.render();
  return B;
}
