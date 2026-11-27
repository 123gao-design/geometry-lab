import { Board, fmt, hEl, mk, TAU, texMix, V } from '../../../lib/board.js';
import { ProofBoard } from '../proof-board.js';
import { angleTex, unitCoordinates } from '../trig-board.js';
import './doublelab.css';
import proofCSS from './doublelab.css?inline';

function addProof(board) {
  const panel = hEl('aside', { class: 'double-proof', 'aria-label': '倍角公式推导' });
  board.root.insertBefore(panel, board.chipRow);
  board.proof = panel;
  board.proofCSS = proofCSS;
  const coords = hEl('div', { class: 'double-proof-coords' }, panel);
  for (const coordinate of ['$P(\\cos\\alpha,\\sin\\alpha)$', '$Q(\\cos 2\\alpha,\\sin 2\\alpha)$', "$P'(-\\cos\\alpha,\\sin\\alpha)$"]) {
    hEl('div', {}, coords).innerHTML = texMix(coordinate);
  }
  hEl('strong', {}, panel).innerHTML = texMix('将 $\\beta=\\alpha$ 代入和差公式');
  for (const [name, formulas] of [
    ['正弦', ['$\\sin 2\\alpha=\\sin(\\alpha+\\alpha)$', '$=2\\sin\\alpha\\cos\\alpha$']],
    ['余弦', ['$\\cos 2\\alpha=\\cos^2\\alpha-\\sin^2\\alpha$',
      '$=2\\cos^2\\alpha-1=1-2\\sin^2\\alpha$']],
    ['正切', ['$\\tan 2\\alpha=\\dfrac{\\tan\\alpha+\\tan\\alpha}{1-\\tan\\alpha\\tan\\alpha}$',
      '$=\\dfrac{2\\tan\\alpha}{1-\\tan^2\\alpha}$']],
    ['矩形面积', ['$S=2\\cos\\alpha\\cdot\\sin\\alpha=\\sin 2\\alpha$', '$0<\\alpha<\\pi/2$']],
  ]) {
    const group = hEl('div', { class: 'double-proof-group' }, panel);
    hEl('b', {}, group).textContent = name;
    for (const formula of formulas) hEl('div', {}, group).innerHTML = texMix(formula);
  }
}

function checkGroup(board, parent, title, tone, labels) {
  const group = hEl('section', { class: 'double-check', 'aria-label': title.split(' · ')[0] }, parent);
  group.style.setProperty('--check-tone', 'var(--pj-' + tone + ')');
  hEl('strong', {}, group).innerHTML = texMix(title);
  return labels.map(label => {
    const update = board.chipM(label);
    group.appendChild(update.el);
    return (value, status = '') => update(typeof value === 'number' ? '$' + fmt(value, 3) + '$' : value, status);
  });
}

export function createBoard(root) {
  const B = new ProofBoard(root, 500, 430);
  root.classList.add('double-board');
  B.exportCheckHeight = 188;
  B.exportSize.height = 692;
  B.svg.setAttribute('aria-label', '单位圆上的单角终边 OP、倍角终边 OQ 和矩形');
  const O = V(250, 215), R = 152;
  const state = { a: Math.PI / 6, rect: true, arc: true };
  const slider = B.slider('角 α', 0, TAU, 'any', state.a,
    v => setAngle(Math.round(v * 180 / Math.PI) * Math.PI / 180), undefined,
    (_, a) => '$\\alpha=' + angleTex(a) + '$');
  function setAngle(a) {
    state.a = a;
    slider.sync(a);
    B.render();
  }
  B.toggleBtn('矩形', true, on => { state.rect = on; B.render(); });
  B.toggleBtnM('$2\\alpha$ 弧', true, on => { state.arc = on; B.render(); });
  B.angleRow([30, 45, 60], () => state.a, setAngle);
  addProof(B);
  const checks = hEl('div', { class: 'double-checks' }, B.chipRow);
  const [area, ordinate] = checkGroup(B, checks, '面积核验', 'blue', ['宽 × 高', '$Q$ 的纵坐标']);
  const [sinDirect, sinFormula] = checkGroup(B, checks, '正弦核验', 'gold', ['$\\sin 2\\alpha$', '$2\\sin\\alpha\\cos\\alpha$']);
  const [tanDirect, tanFormula] = checkGroup(B, checks, '正切核验', 'mint', ['$\\tan 2\\alpha$', '倍角分式']);
  const cosineChecks = checkGroup(B, checks, '余弦三式 · $\\cos 2\\alpha$', 'violet', [
    '$\\cos^2\\alpha-\\sin^2\\alpha$', '$2\\cos^2\\alpha-1$', '$1-2\\sin^2\\alpha$',
  ]);

  const point = (t, r = R) => V(O.x + r * Math.cos(t), O.y - r * Math.sin(t));
  function label(p, text, color) {
    const el = Board.prototype.text.call(B, p, text, { fill: color });
    el.style.fill = el.getAttribute('fill');
  }
  function arc(from, to, radius, color) {
    const points = [];
    const n = Math.ceil((to - from) / .06);
    if (!n) return;
    for (let i = 0; i <= n; i++) {
      const p = point(from + (to - from) * i / n, radius);
      points.push(p.x + ',' + p.y);
    }
    mk('polyline', { points: points.join(' '), fill: 'none', stroke: color, 'stroke-width': 1.7 }, B.dyn);
  }
  function ray(t, color) {
    const tip = point(t, R + 16), back = point(t, R + 8);
    const dx = 3.5 * Math.sin(t), dy = 3.5 * Math.cos(t);
    B.seg(O, tip, { stroke: color, 'stroke-width': 2 });
    mk('polygon', { points: [tip.x + ',' + tip.y, (back.x + dx) + ',' + (back.y + dy),
      (back.x - dx) + ',' + (back.y - dy)].join(' '), fill: color }, B.dyn);
  }
  B.handle({ color: '#67e8f9', get: () => point(state.a), set: p => {
    const a = (Math.atan2(O.y - p.y, p.x - O.x) + TAU) % TAU;
    state.a = Math.round(a * 180 / Math.PI) * Math.PI / 180;
    slider.sync(state.a);
  } }).setAttribute('aria-label', '拖动单角终边上的 P 点');

  B.renderFn = () => {
    const a = state.a, twice = 2 * a;
    const { x: c, y: s } = unitCoordinates(a), { x: c2, y: s2 } = unitCoordinates(twice);
    const P = point(a), Q = point(twice), mirror = V(2 * O.x - P.x, P.y);
    const { guide, axis, blue, gold, mint, soft } = B.diagramColors;
    const same = Math.hypot(P.x - Q.x, P.y - Q.y) < 1;
    const acute = a > 0 && a < Math.PI / 2, showRect = acute && state.rect;
    const atCorner = showRect && Math.hypot(mirror.x - Q.x, mirror.y - Q.y) < 1;

    B.seg(V(26, 31), V(48, 31), { stroke: mint, 'stroke-width': 2 });
    B.tex(V(55, 31), '$OP\\;:\\;\\alpha$', { w: 82, size: 15, color: mint });
    B.seg(V(353, 31), V(375, 31), { stroke: gold, 'stroke-width': 2 });
    B.tex(V(382, 31), '$OQ\\;:\\;2\\alpha$', { w: 92, size: 15, color: gold });
    B.seg(V(34, O.y), V(464, O.y), { stroke: axis });
    B.seg(V(O.x, 411), V(O.x, 19), { stroke: axis });
    label(V(459, O.y + 18), 'x', guide);
    label(V(O.x + 17, 24), 'y', guide);
    label(V(O.x - 12, O.y + 16), 'O', guide);
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: guide, 'stroke-width': 1.5 }, B.dyn);
    if (showRect) {
      mk('rect', { x: mirror.x, y: P.y, width: P.x - mirror.x, height: O.y - P.y,
        fill: soft, stroke: blue, 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }, B.dyn);
      if (!atCorner) { B.mark(mirror, blue); label(V(mirror.x - 14, mirror.y - 9), 'P′', blue); }
      if (c > .3) label(V(O.x, O.y + 27), '2cos α', blue);
      if (s > .3) label(V(P.x + 31, (P.y + O.y) / 2 + 4), 'sin α', blue);
    }
    if (s2 !== 0 && c2 !== 0) B.seg(Q, V(Q.x, O.y), { stroke: gold, 'stroke-opacity': .55, 'stroke-dasharray': '3 5' });
    if (!same) ray(a, mint);
    ray(twice, gold);
    arc(0, a, 29, mint);
    if (state.arc) {
      arc(0, Math.min(TAU, twice), 58, gold);
      if (twice > TAU) arc(TAU, twice, 70, gold);
    }
    const pName = point(a, R + 33), qName = point(twice, R + 33);
    const near = Math.hypot(pName.x - qName.x, pName.y - qName.y) < 32;
    if (!same) label(V(pName.x, pName.y + (near ? 17 : -4)), 'P', mint);
    label(V(qName.x, qName.y + (near ? -10 : 6)), same ? 'P=Q' : atCorner ? 'Q=P′' : 'Q', gold);
    B.mark(Q, gold);

    const matches = (actual, expected) => Math.abs(actual - expected) < 1e-9 * (1 + Math.abs(expected));
    const widthTimesHeight = 2 * c * s;
    const status = matches(widthTimesHeight, s2) ? '' : 'warn';
    area(acute ? widthTimesHeight : '限锐角', acute ? status : 'muted');
    ordinate(s2);
    sinDirect(s2);
    sinFormula(widthTimesHeight, status);
    const forms = [c * c - s * s, 2 * c * c - 1, 1 - 2 * s * s];
    forms.forEach((value, i) => cosineChecks[i](value, matches(value, c2) ? '' : 'warn'));
    tanDirect(c2 === 0 ? '无定义' : s2 / c2, c2 === 0 ? 'warn' : '');
    if (c2 === 0) tanFormula('分母为零', 'warn');
    else if (c === 0) tanFormula('$\\tan\\alpha$ 无定义', 'warn');
    else {
      const t = s / c;
      const expanded = 2 * t / (1 - t * t);
      tanFormula(expanded, matches(expanded, s2 / c2) ? '' : 'warn');
    }
  };
  B.render();
  return B;
}
