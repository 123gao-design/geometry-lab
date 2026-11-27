// 图 S7 · 在同一幅图上比较奇偶、周期、单调和最值。
import { V } from '../../../lib/board.js';
import { glowDot } from '../../../lib/conic-diagram.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from './preset-row.js';

const presets = [
  { name: '三次函数', short: '三次函数', formula: '$x^3-3x$',
    f: x => x * x * x - 3 * x, box: [-2.6, 2.6, -3.6, 3.6],
    turns: [-1, 1], parity: '奇函数，$f(-x)=-f(x)$', period: 0, bounds: [],
    mono: '增 $(-\\infty,-1]$、$[1,+\\infty)$；减 $[-1,1]$。',
    range: '值域 $\\mathbb R$，无最大值和最小值。' },
  { name: '有界分式', short: '有界分式', formula: '$\\dfrac{1}{x^2+1}$',
    f: x => 1 / (x * x + 1), box: [-3.4, 3.4, -0.4, 1.4],
    turns: [0], parity: '偶函数，$f(-x)=f(x)$', period: 0, bounds: [0, 1],
    mono: '增 $(-\\infty,0]$；减 $[0,+\\infty)$。',
    range: '值域 $(0,1]$，$f(0)=1$ 为最大值，无最小值。' },
  { name: '双轴周期函数', short: '双轴函数', formula: '$f(x+4)=f(x)$',
    f: x => {
      const r = ((x + 1) % 4 + 4) % 4 - 1;
      const t = r <= 1 ? 2 - r : r;
      return .5 * (t - 1) * (t - 3) + .3 * (t - 2);
    },
    box: [-1, 7, -.9, .7], turns: [1, 1.7, 3, 4.3],
    parity: '非奇非偶', period: 4, bounds: [-.545, .3],
    mono: '在 $[1,5]$ 内，减 $[1,1.7]$、$[3,4.3]$；增 $[1.7,3]$、$[4.3,5]$。',
    range: '最大值 $0.3$，最小值 $-0.545$。' },
];

export function createBoard(root) {
  const B = new FunctionBoard(root, 780, 440);
  root.classList.add('properties-checkup');
  const maps = presets.map(p => B.isoFit(...p.box));
  const st = { p: 0, T: 4, mono: true, mirror: false, shift: false, bound: false, grid: true, labs: true };
  const parity = B.chipM('奇偶性'), period = B.readout('周期性');
  const monotonicity = B.chipM('单调区间'), range = B.readout('界与最值', 'gold');

  B.renderFn = () => {
    const p = presets[st.p], m = maps[st.p];
    const { X0, X1, Y0, Y1, px, py } = m;
    const { gold, blue, green, red, orange, violet, mint } = B.diagramColors;
    B.grid({ ...m, grid: st.grid, labs: st.labs });
    const turns = [];
    if (p.period) {
      for (let k = Math.floor((X0 - 5) / p.period); 1 + k * p.period <= X1; k++) {
        for (const x of p.turns) {
          const t = x + k * p.period;
          if (t >= X0 && t <= X1) turns.push(t);
        }
      }
      for (let x = 1 + 2 * Math.ceil((X0 - 1) / 2); x <= X1; x += 2)
        B.seg(V(px(x), py(Y0)), V(px(x), py(Y1)), { stroke: gold, 'stroke-width': 1.2, 'stroke-dasharray': '6 6' });
    } else turns.push(...p.turns);
    if (st.mono) {
      const cuts = [X0, ...turns.filter(x => x > X0 && x < X1), X1];
      for (let i = 1; i < cuts.length; i++) {
        const a = cuts[i - 1], b = cuts[i];
        B.plot(p.f, m, { x0: a, x1: b, step: .03, stroke: p.f(b) > p.f(a) ? green : red, 'stroke-width': 2.3 });
      }
    } else B.plot(p.f, m, { anchors: turns, stroke: blue, 'stroke-width': 2.3 });

    if (st.bound) {
      for (const y of p.bounds) B.seg(V(px(X0), py(y)), V(px(X1), py(y)), {
        stroke: mint, 'stroke-width': 1.5, 'stroke-dasharray': '7 6',
      });
    }
    const dots = new Map();
    function mark(x, y, color, radius = 8) {
      if (x < X0 || x > X1 || y < Y0 || y > Y1) return;
      const point = V(px(x), py(y));
      dots.set(point.x.toFixed(2) + ',' + point.y.toFixed(2), { point, color, radius });
    }
    for (const x of turns) mark(x, p.f(x), gold, 7);
    // 误差只描述当前视窗内的采样；性质判定来自预设的解析式。
    function sampledError(image) {
      let error = 0;
      for (let x = X0; x <= X1; x += .05) error = Math.max(error, Math.abs(image(x) - p.f(x)));
      return Number(error.toFixed(2));
    }
    let parityText = p.parity;
    if (st.mirror) {
      B.plot(x => p.f(-x), m, { anchors: turns.map(x => -x), stroke: gold, 'stroke-width': 2, 'stroke-dasharray': '7 5' });
      B.plot(x => -p.f(-x), m, { anchors: turns.map(x => -x), stroke: orange, 'stroke-width': 2, 'stroke-dasharray': '3 5' });
      B.note(`轴对称像 $f(-x)$，采样最大差 $${sampledError(x => p.f(-x))}$`, '#ffd166');
      B.note(`中心对称像 $-f(-x)$，采样最大差 $${sampledError(x => -p.f(-x))}$`, '#ff9e4a');
      const y = p.f(.5);
      mark(.5, y, blue);
      mark(-.5, p.f(-.5), blue);
      mark(-.5, y, gold);
      mark(-.5, -y, orange);
      if (p.period) parityText += '，$f(0.5)=-0.525$，$f(-0.5)=-0.225$。';
    }
    parity(parityText, st.mirror ? (p.period ? 'warn' : 'ok') : '');
    let periodText = p.period ? '最小正周期 $4$' : '无周期';
    if (st.shift) {
      B.plot(x => p.f(x - st.T), m, { anchors: turns.map(x => x + st.T), stroke: violet, 'stroke-width': 2, 'stroke-dasharray': '7 5' });
      B.note(`平移像 $f(x-${st.T})$，采样最大差 $${sampledError(x => p.f(x - st.T))}$`, '#c084fc');
      const x = p.turns[0];
      mark(x, p.f(x), gold);
      mark(x + st.T, p.f(x), violet);
      const matches = p.period > 0 && st.T % p.period === 0;
      periodText += `，$T=${st.T}$ 时${matches ? '重合' : '错位'}。`;
      period(periodText, matches ? 'ok' : 'warn');
    } else period(periodText);
    monotonicity(p.mono);
    range(p.range);
    for (const { point, color, radius } of dots.values()) glowDot(B, point, color, radius, 3.5);
  };

  B.slider('候选 T', .5, 5, .1, 4, v => { st.T = v; B.render(); });
  B.toggleBtn('单调分段', true, on => { st.mono = on; B.render(); });
  B.toggleBtn('奇偶镜像', false, on => { st.mirror = on; B.render(); });
  B.toggleBtn('周期平移', false, on => { st.shift = on; B.render(); });
  B.toggleBtn('确界线', false, on => { st.bound = on; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  presetRow(B.ctrl, '选择性质综合阅读例题', presets, i => { st.p = i; B.render(); });
  B.render();
  return B;
}
