import { V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

const presets = [
  { a: 2, name: '以二为底', short: '底数二', formula: '$a=2$', tone: '#67e8f9', dash: '7 4' },
  { a: .5, name: '倒数底', short: '倒数底', formula: '$a=\\tfrac12$', tone: '#c084fc', dash: '3 4' },
  { a: Math.E, name: '自然对数', short: '自然对数', formula: '$a=e$', tone: '#ff9e4a', dash: '10 4 2 4' },
  { a: 1, name: '底数边界', short: '边界', formula: '$a=1$' },
];
const logTex = a => a === Math.E ? '\\ln x' : `\\log_{${a === .5 ? '1/2' : a}} x`;
// 保留原有的 0.05 档位，并让预设和分享链接能携带精确的自然底数。
const snapBase = a => Math.abs(a - Math.E) < 1e-12 ? Math.E : Math.round(a * 20) / 20;
const baseLabel = a => a === Math.E ? 'a=e\\approx2.72' : `a=${fmt(a, 2)}`;

export function createBoard(root) {
  const B = new FunctionBoard(root, 860, 480);
  root.classList.add('fn-study-board', 'log-board');
  const st = { a: 2, x: 1, grid: true, labs: true, asym: true, compare: true };
  const current = B.readout('当前底数'), probe = B.readout('探针读数'), slope = B.readout('切线斜率', 'gold');
  const trend = B.chipM('变化趋势'), order = B.chipM('曲线高低');

  B.renderFn = () => {
    const { a, x } = st, valid = a !== 1, ink = B.diagramColors;
    const refs = st.compare ? presets.filter(p => p.dash && p.a !== a) : [];
    const y = valid ? Math.log(x) / Math.log(a) : 0;
    const M = B.mapFit(-.45, 8, Math.min(-4, y), Math.max(4, y));
    const point = (u, v) => V(M.px(u), M.py(v));
    const gridStep = Math.max(1, Math.ceil((M.Y1 - M.Y0) / 12));
    B.grid({ ...M, sy: gridStep, grid: st.grid, labs: st.labs });
    if (st.asym && (valid || refs.length)) B.asym(M, [{ v: 0 }]);

    function draw(base, style) {
      const ln = Math.log(base);
      // 在靠近渐近线的一端加密采样，并精确采到曲线穿出画框的位置。
      const left = base ** (ln > 0 ? M.Y0 : M.Y1);
      const right = Math.min(M.X1, base ** (ln > 0 ? M.Y1 : M.Y0));
      const anchors = [1, base, x];
      for (let u = left; u < 1; u *= 1.25) anchors.push(u);
      B.plot(u => Math.log(u) / ln, M, { x0: left, x1: right, pad: .001, anchors, ...style });
    }
    if (valid) B.note(`当前 $y=${logTex(a)}$`, '#5cadff');
    for (const ref of refs) {
      draw(ref.a, { stroke: ref.tone, 'stroke-width': 1.9, 'stroke-dasharray': ref.dash, 'stroke-opacity': .78 });
      B.dot(point(ref.a, 1), 2.6, { fill: ref.tone });
      B.note(`对照 $y=${logTex(ref.a)}$`, ref.tone);
    }
    if (!valid) {
      if (refs.length) B.glowPoints([[point(1, 0), ink.gold]]);
      current('$a=1$，底数无效', 'warn');
      probe('函数值未定义'); slope('导数未定义');
      trend('$1^y$ 恒等于 $1$');
      order('底数为 $1$ 时无法定义对数函数。', 'warn');
      return;
    }

    draw(a, { stroke: ink.blue, 'stroke-width': 2.8 });
    const projection = { stroke: ink.orange, 'stroke-width': 1.1, 'stroke-dasharray': '3 5', 'stroke-opacity': .75 };
    B.seg(point(x, 0), point(x, y), projection);
    B.seg(point(0, y), point(x, y), projection);
    B.glowPoints([[point(1, 0), ink.gold], [point(x, y), ink.orange], [point(a, 1), ink.blue]]);
    current(`$${baseLabel(a)}$，${a > 1 ? '严格递增' : '严格递减'}`);
    probe(`$x=${fmt(x, 2)}$，$f(x)\\approx${fmt(y, 3)}$`);
    slope(`$f'(x)\\approx${fmt(1 / (x * Math.log(a)), 3)}$`);
    trend(a > 1 ? '探针右移，正斜率逐渐减小。' : '探针右移，负斜率逐渐趋近 $0$。');
    order(x === 1 ? '$x=1$ 时，所有对数曲线都经过 $(1,0)$。' :
      `底数同在 $1$ 的一侧时，固定 $${x > 1 ? 'x>1' : '0<x<1'}$，底数越大，曲线越${x > 1 ? '低' : '高'}。`);
  };

  const slA = B.slider('底数 a', .3, 3, 'any', st.a, v => {
    st.a = snapBase(v);
    slA.sync(st.a);
    setSelected(presets.findIndex(p => p.a === st.a));
    B.render();
  }, undefined, (_, raw) => `底数 $${baseLabel(snapBase(raw))}$`);
  B.slider('探针 x', .05, 7.8, .05, st.x, v => { st.x = v; B.render(); }, undefined, v => `探针 $x=${v}$`);
  B.graphToggles(st);
  B.toggleBtn('对照曲线', st.compare, on => { st.compare = on; B.render(); });
  const setSelected = presetRow(B.ctrl, '选择对数函数底数', presets, i => {
    st.a = presets[i].a;
    slA.sync(st.a);
    B.render();
  });
  B.render();
  return B;
}
