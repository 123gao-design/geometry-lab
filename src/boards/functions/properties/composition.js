import { V } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from './preset-row.js';

const presets = [
  { name: '内增 · 外增', short: '增增', innerUp: true, outerUp: true },
  { name: '内增 · 外减', short: '增减', innerUp: true, outerUp: false },
  { name: '内减 · 外增', short: '减增', innerUp: false, outerUp: true },
  { name: '内减 · 外减', short: '减减', innerUp: false, outerUp: false },
];
export function createBoard(root) {
  const B = new FunctionBoard(root, 800, 420);
  root.classList.add('fn-study-board', 'fn-wrap-legend');
  let p = presets[0];
  const xs = [.5, 1.5], st = { grid: true, labs: true };
  const M = B.mapFit(-.15, 2.25, -.45, 4.35);
  const input = B.readout('输入', 'mint'), inner = B.readout('内层输出'), outer = B.readout('外层输出', 'orange'), result = B.chipM('复合函数');
  B.renderFn = () => {
    const g = x => p.innerUp ? x : 2 - x;
    const f = u => p.outerUp ? u ** 2 : (2 - u) ** 2;
    const h = x => f(g(x));
    const ink = B.diagramColors, pos = (x, y) => V(M.px(x), M.py(y));
    B.grid({ ...M, sx: .5, grid: st.grid, labs: st.labs });
    const segment = { x0: 0, x1: 2, anchors: xs };
    B.plot(g, M, { ...segment, stroke: ink.blue, 'stroke-width': 1.8, 'stroke-dasharray': '6 4' });
    B.plot(h, M, { ...segment, stroke: ink.orange, 'stroke-width': 2.7 });
    const marks = [];
    for (const [i, x] of xs.entries()) {
      B.seg(pos(x, 0), pos(x, Math.max(g(x), h(x))), { stroke: ink.guide, 'stroke-dasharray': '3 5' });
      B.text(pos(x, -.25), i === 0 ? 'x₁' : 'x₂', { fill: ink.guide });
      marks.push([pos(x, h(x)), ink.orange], [pos(x, g(x)), ink.blue]);
    }
    B.glowPoints(marks);
    const innerExpr = p.innerUp ? 'x' : '2-x', outerExpr = p.outerUp ? 'u^2' : '(2-u)^2';
    B.note(`$g(x)=${innerExpr}$`, '#5cadff');
    B.note(`$h(x)=${p.innerUp === p.outerUp ? 'x^2' : '(2-x)^2'}$`, '#ff9e4a');
    const compare = (a, b) => `$${Number(a.toFixed(4))}${a < b ? '<' : '>'}${Number(b.toFixed(4))}$`;
    input(compare(...xs)); inner(compare(...xs.map(g))); outer(`$f(u)=${outerExpr}$，${compare(...xs.map(h))}`);
    result(p.innerUp === p.outerUp ? '在 $[0,2]$ 上严格递增' : '在 $[0,2]$ 上严格递减');
  };
  const sliders = xs.map((x, i) => B.slider(`x${i + 1}`, i ? .05 : 0, i ? 2 : 1.95, .05, x, v => {
    xs[i] = v;
    if (xs[0] >= xs[1]) {
      xs[1 - i] = Number((i ? v - .05 : v + .05).toFixed(2));
      sliders[1 - i].sync(xs[1 - i]);
    }
    B.render();
  }, `x${i + 1}`, v => `$x_{${i + 1}}=${v}$`));
  B.graphToggles(st, ['grid', 'labs']);
  presetRow(B.ctrl, '选择内层和外层的单调方向', presets, i => { p = presets[i]; B.render(); });
  B.render();
  return B;
}
