import { V, TAU, hEl } from '../../../lib/board.js';
import { ProofBoard } from '../proof-board.js';
import { angleTex, piTick, unitCoordinates } from '../trig-board.js';
import { angleReadings } from '../unit/angle-readings.js';
import './powlab.css';
import infoCSS from '../../info-readings.css?inline';
import proofCSS from './powlab.css?inline';

const square = x => Math.sin(x) ** 2;
const reduced = x => (1 - Math.cos(2 * x)) / 2;

function halfPosition({ x, y }) {
  if (y === 0) return x > 0 ? '正横轴' : '负横轴';
  if (x === 0) return y > 0 ? '正纵轴' : '负纵轴';
  return (y > 0 ? (x > 0 ? '第一' : '第二') : (x < 0 ? '第三' : '第四')) + '象限';
}

export function createBoard(root) {
  const B = new ProofBoard(root, 620, 350);
  root.classList.add('half-angle-board');
  B.svg.setAttribute('aria-label', '正弦平方曲线、降幂曲线及相隔一个周期的探针');
  const min = -0.5, max = TAU + 0.5;
  const st = { x0: Math.PI / 3, ghost: true, grid: true, labs: true };
  const slider = B.slider('探针 x₀', min, max, 'any', st.x0, x => {
    const axis = Math.round(x / Math.PI) * Math.PI;
    setProbe(Math.abs(x - axis) < 1e-14 ? axis : x);
    B.render();
  }, undefined, (_, x) => '$x_0=' + angleTex(x) + '$');
  function setProbe(x) {
    st.x0 = Math.max(min, Math.min(max, x));
    slider.sync(st.x0);
  }
  B.toggleBtnM('母波 $\\sin x$', true, on => { st.ghost = on; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.angleRow([-15, 60, 180, 240, 360], () => st.x0, x => { setProbe(x); B.render(); });

  const readings = angleReadings(B, '半角 $x_0/2$', '降幂与半角读数');
  B.proof = root.querySelector('.unit-readings');
  B.proof.classList.add('half-angle-readings');
  B.proofCSS = proofCSS + infoCSS;
  B.exportCheckHeight = 76;
  B.exportSize.height = 484;
  const values = B.proof.querySelector('.unit-function-values');
  hEl('div', { class: 'half-reading-heading' }, values).textContent = '平方曲线';
  const squared = readings.number('$\\sin^2 x_0$', 'blue');
  const power = readings.number('$\\tfrac{1-\\cos 2x_0}{2}$', 'gold');
  readings.field('最小正周期', 'blue')('$\\pi$');
  readings.field('值域', 'blue')('$[0,1]$');
  hEl('div', { class: 'half-reading-heading' }, values).textContent = '半角与平方根';
  const halfSin = readings.number('$\\sin(x_0/2)$', 'mint');
  const halfCos = readings.number('$\\cos(x_0/2)$', 'violet');
  const sinRoot = readings.number('$\\sqrt{\\tfrac{1-\\cos x_0}{2}}$', 'mint');
  const cosRoot = readings.number('$\\sqrt{\\tfrac{1+\\cos x_0}{2}}$', 'violet');
  B.chipRow.dataset.readingStyle = 'info';
  const sign = B.chipM('半角取号');

  const m = B.mapFit(min, max, -1.12, 1.2);
  const ticks = [0, 1, 2, 3, 4].map(k => k * Math.PI / 2);
  B.handle({
    color: '#ffd166', get: () => V(m.px(st.x0), m.py(square(st.x0))),
    set: p => setProbe((p.x - m.px(0)) / m.s),
  }).setAttribute('aria-label', '拖动平方曲线上的探针');

  B.renderFn = () => {
    const x = st.x0, y = square(x);
    B.grid({ ...m, sx: Math.PI / 2, sy: .5, xt: [], yt: [-1, -.5, .5, 1], grid: st.grid, labs: st.labs });
    if (st.labs) for (const t of ticks)
      B.text(V(m.px(t), m.py(0) + 17), piTick(t), { fill: '#93a1b5' });
    const options = { anchors: ticks, x0: min - .12, x1: max + .12 };
    if (st.ghost) B.plot(Math.sin, m, { ...options, stroke: '#93a1b5', 'stroke-width': 1.6, 'stroke-dasharray': '5 5', opacity: .7 });
    B.plot(square, m, { ...options, stroke: '#5cadff', 'stroke-width': 3.1 });
    B.plot(reduced, m, { ...options, stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '7 6' });

    const forward = x + Math.PI <= max;
    const other = x + (forward ? Math.PI : -Math.PI);
    const P = V(m.px(x), m.py(y)), Q = V(m.px(other), P.y);
    const guide = { stroke: '#67e8f9', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', opacity: .75 };
    B.seg(P, V(P.x, m.py(0)), guide);
    B.seg(Q, V(Q.x, m.py(0)), guide);
    B.seg(P, Q, guide);
    B.dot(Q, 3.4, { fill: 'none', stroke: '#5cadff', 'stroke-width': 1.5 });
    if (st.labs) {
      B.text(V(P.x, P.y - 14), 'x₀', { fill: '#ffd166' });
      B.text(V(Q.x, Q.y - 14), forward ? 'x₀+π' : 'x₀−π', { fill: '#5cadff' });
    }

    const half = unitCoordinates(x / 2), full = unitCoordinates(x);
    readings.angle(x / 2);
    squared(y); power(reduced(x));
    halfSin(half.y); halfCos(half.x);
    sinRoot(Math.sqrt((1 - full.x) / 2)); cosRoot(Math.sqrt((1 + full.x) / 2));
    const signOf = v => v > 0 ? '>0' : v < 0 ? '<0' : '=0';
    sign(`半角位于${halfPosition(half)}，$\\sin(x_0/2)${signOf(half.y)}$，$\\cos(x_0/2)${signOf(half.x)}$。`);
  };
  B.render();
  return B;
}
