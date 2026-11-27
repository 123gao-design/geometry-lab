import { V } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

const presets = [
  { name: '过原点的抛物线', short: '抛物线', formula: '$x^2-2x$', f: x => x * x - 2 * x, roots: [0, 2], sample: 1, box: [-3.2, 3.2, -1.6, 5.2] },
  { name: '平方函数平移', short: '平移', formula: '$(x-1)^2$', f: x => (x - 1) ** 2, roots: [1], sample: 0, box: [-3.2, 3.2, -.9, 5.2] },
  { name: '直线', short: '直线', formula: '$x-1$', f: x => x - 1, roots: [1], sample: 0, box: [-3.4, 4.2, -3.2, 3.2] },
  { name: '指数函数平移', short: '指数', formula: '$e^x-2$', f: x => Math.exp(x) - 2, roots: [Math.LN2], sample: 0, box: [-3.2, 4.2, -2.6, 5.2] },
];
const modes = [
  { tex: 'f(x)', name: '原图' }, { tex: '|f(x)|', name: '外层绝对值' },
  { tex: 'f(|x|)', name: '内层绝对值' }, { tex: '|f(|x|)|', name: '两层绝对值' },
];
const rootTex = x => Math.abs(x) === Math.LN2 ? (x < 0 ? '-' : '') + '\\ln 2' : String(x);
export function createBoard(root) {
  const B = new FunctionBoard(root, 860, 480);
  root.classList.add('fn-study-board', 'fn-wrap-legend');
  const st = { grid: true, labs: true };
  let p = presets[0], mode = 1, t = 1;
  const phase = B.chipM('当前步骤'), symmetry = B.chipM('成图对称性');
  const before = B.readout('原图零点'), after = B.readout('成图零点', 'gold');
  B.renderFn = () => {
    const M = B.isoFit(...p.box), ink = B.diagramColors;
    const inner = mode >= 2, outer = mode === 1 || mode === 3;
    const u = inner ? (mode === 3 ? Math.min(1, 2 * t) : t) : 0;
    const v = outer ? (mode === 3 ? Math.max(0, 2 * t - 1) : t) : 0;
    const folded = x => {
      const y = x < 0 && u > 0 ? (1 - u) * p.f(x) + u * p.f(-x) : p.f(x);
      return y < 0 ? (1 - 2 * v) * y : y;
    };
    const roots = inner ? [...new Set(p.roots.filter(z => z >= 0).flatMap(z => [-z, z]))].sort((a, b) => a - b) : p.roots;
    const anchors = [0, -1, 1, ...p.roots, ...roots];
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    const guide = { stroke: ink.gold, 'stroke-dasharray': '6 5', 'stroke-opacity': .75 };
    if (inner) B.seg(V(M.px(0), 0), V(M.px(0), B.h), guide);
    if (outer) B.seg(V(0, M.py(0)), V(B.w, M.py(0)), guide);
    if (mode !== 0 && t > 0) B.plot(p.f, M, { anchors, stroke: ink.blue, 'stroke-dasharray': '6 5', 'stroke-width': 1.5 });
    B.plot(folded, M, { anchors, stroke: mode ? ink.orange : ink.blue, 'stroke-width': 2.6 });
    // 过渡图可能有整段贴轴，只在原图或成图上标记其精确零点。
    const visibleRoots = mode === 0 || t === 0 ? p.roots : t === 1 ? roots : [];
    const marks = visibleRoots.map(z => [V(M.px(z), M.py(0)), ink.gold]);
    if (mode && t > 0 && t < 1) {
      const x = inner && u < 1 ? -1 : p.sample;
      const source = V(M.px(x), M.py(p.f(x))), image = V(M.px(x), M.py(folded(x)));
      B.seg(source, image, { stroke: ink.guide, 'stroke-dasharray': '3 4' });
      marks.push([image, ink.orange], [source, ink.blue]);
    }
    B.glowPoints(marks);
    B.note('$f(x)=' + p.formula.slice(1), '#5cadff');
    if (mode) B.note(`目标 $y=${modes[mode].tex}$`, '#ff9e4a');
    phase(!mode || t === 0 ? '原图' : t === 1 ? modes[mode].name + '已完成' :
      inner && u < 1 ? '将右半支镜像到左侧' : '将横轴下方翻到上方');
    symmetry(inner ? '偶函数，图象关于纵轴对称。' : '本例成图关于纵轴不对称。');
    const set = zs => `$\\{${zs.map(rootTex).join(',\\,')}\\}$`;
    before(set(p.roots)); after(set(roots));
  };
  const slider = B.slider('折叠 t', 0, 1, .01, t, v => { t = v; B.render(); }, 't', v => `进度 $t=${v}$`);
  B.graphToggles(st, ['grid', 'labs']);
  const buttons = modes.map((m, i) => B.btnM(`$${m.tex}$`, () => {
    mode = i; slider.disabled = mode === 0;
    buttons.forEach((b, j) => { b.classList.toggle('on', j === i); b.setAttribute('aria-pressed', String(j === i)); });
    B.render();
  }, { on: i === mode }));
  buttons.forEach((b, i) => b.setAttribute('aria-pressed', String(i === mode)));
  presetRow(B.ctrl, '选择原函数', presets, i => { p = presets[i]; B.render(); });
  B.render();
  return B;
}
