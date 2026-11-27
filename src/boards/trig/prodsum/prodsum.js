import { angleTex } from '../trig-board.js';
import { LegendProofBoard } from '../proof-board.js';
import { hEl, mk, texMix, V, fmt, TAU } from '../../../lib/board.js';
import '../unit/angle-readings.css';
import '../solve/theorem-frames.css';
import '../../light-readings.css';
import lightCSS from '../../light-readings.css?inline';
import './prodsum.css';
import frameCSS from '../solve/theorem-frames.css?inline';
import panelCSS from './prodsum.css?inline';
import infoCSS from '../../info-readings.css?inline';

export function createBoard(root) {
  const B = new LegendProofBoard(root, 512, 349, 42);
  root.classList.add('trig-side-board', 'trig-theorem-board', 'trig-compact-choices', 'prodsum-board');
  B.proof = hEl('section', { class: 'trig-theorem-panel prodsum-proof', 'aria-label': '从和差公式推导积化和差' });
  root.insertBefore(B.proof, B.chipRow);
  B.exportCheckHeight = 130;
  B.exportSize = { width: 930, height: B.h + B.exportCheckHeight };
  B.proofCSS = frameCSS + lightCSS + panelCSS + infoCSS;
  B.groupReadings('公式与数值');
  const st = { k: 0, a: Math.PI / 3, b: Math.PI / 6 };
  B.slider('角 α', 0, TAU, Math.PI / 12, st.a, v => { st.a = v; B.render(); }, undefined, (_, v) => `角 $\\alpha=${angleTex(v)}$`);
  B.slider('角 β', 0, TAU, Math.PI / 12, st.b, v => { st.b = v; B.render(); }, undefined, (_, v) => `角 $\\beta=${angleTex(v)}$`);
  const ROW_S = ['$\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$', '$\\sin(\\alpha-\\beta)=\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$'];
  const ROW_C = ['$\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$', '$\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$'];
  const MODES = [
    { lab: '$\\sin\\alpha\\cos\\beta$', rows: ROW_S, opTxt: '两式相加，消去 $\\cos\\alpha\\sin\\beta$。',
      mid: '$2\\sin\\alpha\\cos\\beta=\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)$',
      res: '$\\sin\\alpha\\cos\\beta=\\tfrac{1}{2}\\bigl[\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)\\bigr]$',
      lhs: (a, b) => Math.sin(a) * Math.cos(b), rhs: (a, b) => 0.5 * (Math.sin(a + b) + Math.sin(a - b)) },
    { lab: '$\\cos\\alpha\\sin\\beta$', rows: ROW_S, opTxt: '第一式减第二式，保留 $\\cos\\alpha\\sin\\beta$',
      mid: '$2\\cos\\alpha\\sin\\beta=\\sin(\\alpha+\\beta)-\\sin(\\alpha-\\beta)$',
      res: '$\\cos\\alpha\\sin\\beta=\\tfrac{1}{2}\\bigl[\\sin(\\alpha+\\beta)-\\sin(\\alpha-\\beta)\\bigr]$',
      lhs: (a, b) => Math.cos(a) * Math.sin(b), rhs: (a, b) => 0.5 * (Math.sin(a + b) - Math.sin(a - b)) },
    { lab: '$\\cos\\alpha\\cos\\beta$', rows: ROW_C, opTxt: '两式相加，$\\sin\\alpha\\sin\\beta$ 对消',
      mid: '$2\\cos\\alpha\\cos\\beta=\\cos(\\alpha+\\beta)+\\cos(\\alpha-\\beta)$',
      res: '$\\cos\\alpha\\cos\\beta=\\tfrac{1}{2}\\bigl[\\cos(\\alpha+\\beta)+\\cos(\\alpha-\\beta)\\bigr]$',
      lhs: (a, b) => Math.cos(a) * Math.cos(b), rhs: (a, b) => 0.5 * (Math.cos(a + b) + Math.cos(a - b)) },
    { lab: '$\\sin\\alpha\\sin\\beta$', rows: ROW_C, opTxt: '第二式减第一式，保留 $\\sin\\alpha\\sin\\beta$',
      mid: '$2\\sin\\alpha\\sin\\beta=\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta)$',
      res: '$\\sin\\alpha\\sin\\beta=\\tfrac{1}{2}\\bigl[\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta)\\bigr]$',
      lhs: (a, b) => Math.sin(a) * Math.sin(b), rhs: (a, b) => 0.5 * (Math.cos(a - b) - Math.cos(a + b)) },
  ];
  B.choiceRow('选择乘积', MODES.map(md => ({ name: md.lab })), () => st.k, i => { st.k = i; B.render(); });
  const cL = B.readout('左边', 'blue'), cR = B.readout('右边', 'gold'), cV = B.chipM('核验');
  const O = V(256, 177), RC = 132;
  let lastMode;
  function equation(parent, source, tag) {
    const row = hEl('div', { class: 'prodsum-equation' }, parent);
    const [left, right] = source.slice(1, -1).split('=');
    hEl('span', {}, row).innerHTML = texMix('$' + (tag ? '(' + tag + ')\\;' : '') + left + '$');
    hEl('span', {}, row).innerHTML = texMix('$=' + right + '$');
  }
  function showDerivation(md) {
    B.proof.replaceChildren();
    const start = hEl('div', { 'data-reading-style': 'light' }, B.proof);
    hEl('h4', {}, start).textContent = md.rows === ROW_S ? '正弦和差公式' : '余弦和差公式';
    md.rows.forEach((row, i) => equation(start, row, i + 1));
    const step = hEl('div', { class: 'prodsum-eliminate' }, B.proof);
    hEl('p', {}, step).innerHTML = texMix(md.opTxt);
    equation(step, md.mid);
    const result = hEl('div', { 'data-reading-style': 'light', 'data-tone': 'gold' }, B.proof);
    hEl('p', {}, result).innerHTML = texMix('两边同除以 $2$');
    equation(result, md.res);
  }
  const arcPts = (t0, t1, r) => {
    const pts = [], n = 40;
    for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; pts.push(`${(O.x + r * Math.cos(t)).toFixed(1)},${(O.y - r * Math.sin(t)).toFixed(1)}`); }
    return pts.join(' ');
  };

  B.renderFn = () => {
    const md = MODES[st.k], { a, b } = st;
    if (lastMode !== md) {
      showDerivation(md);
      lastMode = md;
    }
    const extent = RC + 20, axis = { stroke: B.diagramColors.guide, 'stroke-width': 1.1, head: 7, wide: 3 };
    B.arrow(V(O.x - extent, O.y), V(O.x + extent, O.y), axis);
    B.arrow(V(O.x, O.y + extent), V(O.x, O.y - extent), axis);
    B.tex(V(O.x + extent + 9, O.y + 9), '$x$', { size: 14, w: 20 });
    B.tex(V(O.x + 13, O.y - extent + 1), '$y$', { size: 14, w: 20 });
    mk('circle', { cx: O.x, cy: O.y, r: RC, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.5 }, B.dyn);
    const P = V(O.x + RC * Math.cos(a), O.y - RC * Math.sin(a)), Q = V(O.x + RC * Math.cos(b), O.y - RC * Math.sin(b));
    B.seg(O, P, { stroke: '#ffd166', 'stroke-width': 2.2 });
    B.seg(O, Q, { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.mark(P, '#ffd166');
    B.mark(Q, '#5cadff');
    for (const [theta, radius, name, color] of [[a, 50, '\\alpha', '#ffd166'], [b, 28, '\\beta', '#5cadff']]) {
      if (theta === 0) continue;
      mk('polyline', { points: arcPts(0, theta, radius), fill: 'none', stroke: color, 'stroke-width': 1.6 }, B.dyn);
      // 从弧内取离两条终边和坐标轴最远的方向，避免角名正压在另一条射线上。
      const clearance = t => Math.min(Math.abs(Math.sin(t)), Math.abs(Math.cos(t)),
        ...[a, b].map(ray => Math.cos(t - ray) <= 0 ? 1 : Math.abs(Math.sin(t - ray))));
      const direction = [.5, .3, .7].map(f => f * theta).reduce((best, t) => clearance(t) > clearance(best) ? t : best);
      const r = radius + 11;
      B.tex(V(O.x + r * Math.cos(direction), O.y - r * Math.sin(direction)), '$' + name + '$',
        { size: 14, color, anchor: 'mid', w: 26 });
    }
    B.note('$\\alpha=' + angleTex(a) + '$', '#ffd166');
    B.note('$\\beta=' + angleTex(b) + '$', '#5cadff');
    // chips
    const L = md.lhs(a, b), Rv = md.rhs(a, b);
    cL(`$\\text{LHS}=${fmt(L, 3)}$`);
    cR(`$\\text{RHS}=${fmt(Rv, 3)}$`);
    cV(Math.abs(L - Rv) < 1e-9 ? '两行公式相加或相减后，目标乘积的系数为 $2$。两边同除以 $2$ 即得恒等式。' : '偏差！', Math.abs(L - Rv) < 1e-9 ? 'ok' : 'warn');
  };
  B.render();
  B.hint('选择乘积查看对应的消元步骤。拖动角度滑块，对照单位圆上的终边与等式两边的数值。');
  return B;
}
