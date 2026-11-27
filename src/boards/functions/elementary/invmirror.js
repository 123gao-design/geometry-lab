import { V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

const presets = [
  { a: 2, name: '同增', short: '同增', formula: '$a=2$', tex: '2' },
  { a: .5, name: '同减', short: '同减', formula: '$a=1/2$', tex: '1/2' },
  { a: Math.SQRT2, name: '两个不动点', short: '不动点', formula: '$a=\\sqrt2$', tex: '\\sqrt2' },
];

export function createBoard(root) {
  const B = new FunctionBoard(root, 860, 490);
  root.classList.add('fn-study-board', 'fn-wrap-legend');
  const st = { grid: true, labs: true, asym: true };
  let base = presets[0], t = 1, M;
  function mapping() {
    const hi = Math.max(5.2, base.a ** t + .25);
    return B.isoFit(-2.2, hi, -2.2, hi);
  }
  M = mapping();
  const pos = (x, y) => V(M.px(x), M.py(y));
  const current = B.readout('底数'), back = B.readout('回代', 'mint'), original = B.readout('指数上的 $P$'), mirror = B.readout("对数上的 $P'$", 'gold');
  const probe = B.slider('探针 t', -1.9, 4, .05, t, v => { t = v; B.render(); }, 't', v => `探针 $t=${v}$`);
  B.handle({
    get: () => pos(t, base.a ** t),
    set: point => {
      t = Math.max(-1.9, Math.min(4, Math.round((M.X0 + point.x / M.s) * 20) / 20));
      probe.sync(t);
    }, color: '#ffd166', label: 'P', lo: [9, -9],
  });
  B.renderFn = () => {
    const { a, tex } = base, y = a ** t, ink = B.diagramColors;
    M = mapping();
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym) B.asym(M, [{ v: 0 }, { h: 0 }]);
    B.seg(pos(M.X0, M.X0), pos(M.X1, M.X1), { stroke: ink.gold, 'stroke-dasharray': '7 6' });
    B.plot(x => a ** x, M, { anchors: [0, t, 2, 4], stroke: ink.blue, 'stroke-width': 2.5 });
    const start = a ** (a > 1 ? M.Y0 : M.Y1);
    const end = Math.min(M.X1, a ** (a > 1 ? M.Y1 : M.Y0));
    B.plot(x => Math.log(x) / Math.log(a), M, { x0: start, x1: end, pad: .001, anchors: [1, y, 2, 4], stroke: ink.orange, 'stroke-width': 2.5 });
    B.seg(pos(t, y), pos(y, t), { stroke: ink.guide, 'stroke-dasharray': '4 4' });
    const marks = [[pos(y, t), ink.orange]];
    if (a === Math.SQRT2) marks.push([pos(2, 2), ink.mint], [pos(4, 4), ink.mint]);
    B.glowPoints(marks);
    for (const [u, v] of [[0, 1], [1, 0]]) {
      if (!(t === u && y === v) && !(y === u && t === v)) B.dot(pos(u, v), 2.7, { fill: ink.guide });
    }
    B.note(`$y=${a === 2 ? '2' : '(' + tex + ')'}^x$`, '#5cadff');
    B.note(`$y=\\log_{${tex}}x$`, '#ff9e4a'); B.note('$y=x$', '#ffd166');
    current(`$a=${tex}$，两者均${a > 1 ? '递增' : '递减'}`);
    back(`$\\log_a(a^t)=t=${fmt(t, 2)}$`);
    original(`$(t,a^t)\\approx(${fmt(t, 2)},${fmt(y, 2)})$`);
    mirror(`$(a^t,t)\\approx(${fmt(y, 2)},${fmt(t, 2)})$`);
  };
  B.graphToggles(st);
  presetRow(B.ctrl, '选择反函数底数', presets, i => { base = presets[i]; B.render(); });
  B.render();
  return B;
}
