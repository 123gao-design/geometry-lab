import { V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

const presets = [
  { name: '基本对勾', short: '基本型', formula: '$x+1/x$', a: 1, b: 1, c: 3 },
  { name: '改变倒数项', short: '倒数项', formula: '$x+4/x$', a: 1, b: 4, c: 5 },
  { name: '改变一次项', short: '一次项', formula: '$3x+1/x$', a: 3, b: 1, c: 4.5 },
];

export function createBoard(root) {
  const B = new FunctionBoard(root, 860, 500);
  root.classList.add('fn-study-board', 'fn-wrap-legend');
  const st = { a: 1, b: 1, c: 3, grid: true, labs: true, asym: true };
  const deriv = B.chipM('导数判据'), amgm = B.chipM('均值不等式');
  const turns = B.readout('两支极值', 'mint'), mono = B.chipM('单调性'), count = B.readout('水平线交点', 'gold');
  B.renderFn = () => {
    const { a, b, c } = st, ink = B.diagramColors;
    const r = Math.sqrt(b / a), h = 2 * Math.sqrt(a * b), D = c * c - 4 * a * b;
    const tangent = Math.abs(D) < 1e-9;
    const roots = tangent ? [c / (2 * a)] : D < 0 ? [] :
      [(c - Math.sqrt(D)) / (2 * a), (c + Math.sqrt(D)) / (2 * a)];
    const extent = Math.max(4, ...roots.map(Math.abs));
    const M = B.mapFit(-extent, extent, -8, 8);
    const pos = (x, y) => V(M.px(x), M.py(y));
    const f = x => a * x + b / x;
    B.grid({ ...M, sx: Math.max(1, Math.ceil(extent / 6)), grid: st.grid, labs: st.labs });
    if (st.asym) {
      B.asym(M, [{ v: 0 }]);
      B.seg(pos(M.X0, a * M.X0), pos(M.X1, a * M.X1), { stroke: ink.violet, 'stroke-dasharray': '7 6' });
      B.note(`$y=${a === 1 ? '' : a}x$`, '#c084fc');
    }
    // 正支与画框上沿的较小交点。负支在相反的横坐标区间单独采样。
    const near = 2 * b / (M.Y1 + Math.sqrt(M.Y1 ** 2 - 4 * a * b));
    for (const [x0, x1] of [[M.X0, -near], [near, M.X1]]) {
      B.plot(f, M, { x0, x1, anchors: [-r, r, ...roots], pad: .001, stroke: ink.blue, 'stroke-width': 2.6 });
    }
    B.seg(pos(M.X0, c), pos(M.X1, c), { stroke: ink.orange, 'stroke-width': 1.6, 'stroke-dasharray': '7 5' });
    B.glowPoints([[pos(r, h), ink.gold], [pos(-r, -h), ink.gold], ...roots.map(x => [pos(x, c), ink.orange])]);
    B.note(`$f(x)=${a === 1 ? '' : a}x+${b}/x$`, '#5cadff');
    B.note('极值点', '#ffd166'); B.note(`$y=${c}$`, '#ff9e4a');
    deriv("$f'(x)=a-b/x^2$，驻点 $x=\\pm r$");
    amgm('当 $x>0$，$f(x)\\ge 2\\sqrt{ab}$，等号在 $x=r$ 取得。');
    turns(`$r=\\sqrt{b/a}\\approx${fmt(r, 2)}$，右支最小值约 $${fmt(h, 2)}$，左支最大值约 $${fmt(-h, 2)}$。`);
    mono('增 $(-\\infty,-r]$、$[r,+\\infty)$；减 $[-r,0)$、$(0,r]$。');
    const delta = `$\\Delta=${Number(D.toFixed(4))}$`;
    if (!roots.length) count(`${delta}，无交点。`);
    else if (tangent) count(`${delta}，与${c > 0 ? '右支最低点' : '左支最高点'}相切，$x\\approx${fmt(roots[0], 2)}$。`);
    else count(`${delta}，${c > 0 ? '右' : '左'}支两交点，$x_1\\approx${fmt(roots[0], 2)}$，$x_2\\approx${fmt(roots[1], 2)}$。`);
  };
  const sliders = {};
  for (const [key, min, max] of [['a', .5, 3], ['b', .5, 4], ['c', -6, 8]]) {
    sliders[key] = B.slider(key, min, max, .1, st[key], v => {
      st[key] = v;
      setSelected(presets.findIndex(p => p.a === st.a && p.b === st.b));
      B.render();
    }, key, v => key === 'c' ? `水平线 $c=${v}$` : `$${key}=${v}$`);
  }
  B.graphToggles(st);
  const setSelected = presetRow(B.ctrl, '选择对勾函数', presets, i => {
    for (const key of ['a', 'b', 'c']) { st[key] = presets[i][key]; sliders[key].sync(st[key]); }
    B.render();
  });
  B.render();
  return B;
}
