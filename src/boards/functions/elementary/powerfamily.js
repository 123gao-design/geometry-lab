import { V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

// 每档是 1/12，按整档约分，避免用近似小数判断负半轴的定义域。
function exponent(tick) {
  const divisor = [12, 6, 4, 3, 2, 1].find(n => tick % n === 0);
  const p = tick / divisor, q = 12 / divisor;
  const value = p / q;
  const tex = q === 1 ? String(p) : (p < 0 ? '-' : '') + `\\tfrac{${Math.abs(p)}}{${q}}`;
  const decimal = fmt(value, 2);
  const reading = `\\alpha${Number(decimal) === value ? '=' : '\\approx'}${decimal}`;
  return { p, q, value, tex, reading };
}
function power(x, { p, q, value }) {
  if (x === 0) return p > 0 ? 0 : NaN;
  if (x > 0) return x ** value;
  if (q % 2 === 0) return NaN;
  return (p % 2 === 0 ? 1 : -1) * Math.abs(x) ** value;
}

const presets = [
  { tick: 24, name: '平方', formula: '$x^2$' },
  { tick: 36, name: '立方', formula: '$x^3$' },
  { tick: 6, name: '平方根', formula: '$\\sqrt{x}$' },
  { tick: 4, name: '立方根', formula: '$\\sqrt[3]{x}$' },
  { tick: -12, name: '倒数', formula: '$1/x$' },
].map(p => ({ ...p, short: p.name }));
const tones = new Map([[-24, '#c084fc'], [-12, '#ff7b8a'], [-6, '#67e8f9'], [4, '#ff9e4a'],
  [6, '#ffd166'], [12, '#93a1b5'], [24, '#5cadff'], [36, '#4ade80']]);
const anchors = [-1, 0, 1];
for (let i = 1; i <= 12; i++) anchors.push(10 ** -i, -(10 ** -i));

export function createBoard(root) {
  const B = new FunctionBoard(root, 860, 480);
  root.classList.add('fn-study-board');
  const M = B.isoFit(-4.2, 4.2, -4.2, 4.2);
  const st = { tick: 24, grid: true, labs: true, asym: true, ghosts: true };
  const cA = B.readout('当前指数'), cD = B.readout('定义域', 'mint'), cM = B.chipM('正半轴'), cV = B.readout('公共点', 'gold');
  B.renderFn = () => {
    const a = exponent(st.tick), { p, q } = a, ink = B.diagramColors;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym && p < 0) B.asym(M, [{ v: 0 }, { h: 0 }]);
    function draw(tick, active) {
      const exp = exponent(tick);
      B.plot(x => power(x, exp), M, { anchors, n: 360, stroke: tones.get(tick) || ink.blue,
        'stroke-width': active ? 2.8 : 1.3, 'stroke-opacity': active ? 1 : .38 });
    }
    if (st.ghosts) for (const tick of tones.keys()) if (tick !== st.tick) draw(tick, false);
    draw(st.tick, true);
    const point = (x, y) => V(M.px(x), M.py(y));
    const marks = [[point(1, 1), ink.gold]];
    if (p > 0) marks.push([point(0, 0), ink.mint]);
    B.glowPoints(marks);
    if (p === 0) B.dot(point(0, 1), 4.5, { fill: ink.paper, stroke: ink.blue, 'stroke-width': 1.6 });
    B.note(`$y=x^{${a.tex}}$`, tones.get(st.tick) || '#5cadff');
    B.note('$(1,1)$', '#ffd166');
    if (p > 0) B.note('$(0,0)$', '#67e8f9');
    if (p === 0) B.note('空心点 $(0,1)$');
    const domain = q % 2 === 1
      ? (p > 0 ? '\\mathbb R' : '\\mathbb R\\setminus\\{0\\}')
      : (p > 0 ? '[0,+\\infty)' : '(0,+\\infty)');
    cA(`$${a.reading}$`);
    cD(`$D=${domain}$`);
    cM(p === 0 ? '恒为 $1$' : p < 0 ? '严格递减，趋近于 $0$' :
      a.value === 1 ? '直线，斜率为 $1$' : a.value > 1 ? '严格递增，斜率增大' : '严格递增，斜率减小');
    cV(p > 0 ? '过 $(1,1)$ 和 $(0,0)$' : '过 $(1,1)$');
  };
  const slA = B.slider('α', -3, 3, 1 / 12, 2, v => {
    st.tick = Math.round(v * 12);
    setSelected(presets.findIndex(p => p.tick === st.tick));
    B.render();
  }, undefined, v => `$${exponent(Math.round(Number(v) * 12)).reading}$`);
  B.graphToggles(st);
  B.toggleBtn('曲线族', true, on => { st.ghosts = on; B.render(); });
  const setSelected = presetRow(B.ctrl, '选择幂函数', presets, i => {
    st.tick = presets[i].tick;
    slA.sync(st.tick / 12);
    B.render();
  });
  B.render();
  return B;
}
