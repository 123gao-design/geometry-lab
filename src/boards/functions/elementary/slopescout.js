import { V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

const examples = [
  { name: '陡增', short: '陡增', formula: '$k=1.5$', k: 1.5, b: -1 },
  { name: '缓增', short: '缓增', formula: '$k=0.5$', k: 0.5, b: 1 },
  { name: '水平', short: '水平', formula: '$k=0$', k: 0, b: 1 },
  { name: '递减', short: '递减', formula: '$k=-1.2$', k: -1.2, b: 0.5 },
];

export function createBoard(root) {
  const B = new FunctionBoard(root, 860, 480);
  root.classList.add('fn-study-board');
  const st = { k: 1.5, b: -1, x: 1, grid: true, labs: true };
  const cK = B.readout('斜率'), cB = B.readout('截距与零点', 'gold'), cM = B.chipM('单调性'), cD = B.readout('导数', 'mint');
  B.renderFn = () => {
    const { k, b, x } = st;
    const f = u => k * u + b;
    // 保留单位比例，移动探针时三角形的两条直角边都在视野内。
    const M = B.isoFit(-4.6, 4.9, Math.min(-2.6, f(x) - .4, f(x + 1) - .4), Math.max(2.6, f(x) + .4, f(x + 1) + .4));
    const point = (x, y) => V(M.px(x), M.py(y));
    const ink = B.diagramColors;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.plot(f, M, { anchors: [x, x + 1, 0], stroke: ink.blue, 'stroke-width': 2.3 });
    const probe = point(x, f(x)), corner = point(x + 1, f(x));
    B.seg(probe, corner, { stroke: ink.gold, 'stroke-width': 2 });
    B.seg(corner, point(x + 1, f(x + 1)), { stroke: ink.gold, 'stroke-width': 2 });
    const marks = [[probe, ink.orange], [point(0, b), ink.gold]];
    if (k !== 0) marks.push([point(-b / k, 0), ink.mint]);
    B.glowPoints(marks);
    const term = k === 0 ? '' : k === 1 ? 'x' : k === -1 ? '-x' : k + 'x';
    const constant = b === 0 && term ? '' : b > 0 && term ? '+' + b : String(b);
    B.note(`$f(x)=${term}${constant}$`, '#5cadff');
    B.note('探针', '#ff9e4a');
    B.note('纵截距', '#ffd166');
    if (k !== 0) B.note('零点', '#67e8f9');
    B.note(`$\\Delta x=1$，$\\Delta y=${k}$`);
    cK(`$k=\\tfrac{\\Delta y}{\\Delta x}=${k}$`);
    let zero = '无零点';
    if (k !== 0) {
      const r = -b / k;
      zero = `$x_0${Math.abs(r - Number(r.toFixed(2))) < 1e-10 ? '=' : '\\approx'}${fmt(r, 2)}$`;
    } else if (b === 0) zero = '零点集 $\\mathbb R$';
    cB(`$b=${b}$，${zero}`);
    cM(k === 0 ? '常值函数' : k > 0 ? '严格递增' : '严格递减');
    cD(`$f'(x)=${k}$`);
  };

  const sliders = {};
  for (const key of ['k', 'b']) {
    sliders[key] = B.slider(key, -2, 2, .1, st[key], v => {
      st[key] = v;
      setSelected(examples.findIndex(p => p.k === st.k && p.b === st.b));
      B.render();
    }, key, v => `$${key}=${v}$`);
  }
  B.slider('探针 x', -3.5, 3.5, .05, st.x, v => { st.x = v; B.render(); }, 'x', v => `探针 $x=${v}$`);
  B.graphToggles(st, ['grid', 'labs']);
  const setSelected = presetRow(B.ctrl, '选择直线', examples, i => {
    const { k, b } = examples[i];
    Object.assign(st, { k, b });
    sliders.k.sync(k);
    sliders.b.sync(b);
    B.render();
  });
  B.render();
  return B;
}
