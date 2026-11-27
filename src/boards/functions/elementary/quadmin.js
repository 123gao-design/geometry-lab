import { mk, V } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

const examples = [
  { name: '定轴动区间', short: '动区间', formula: '$x^2$', a: 1, t: 0, h: 0, ends: [-1, 2],
    range: [-3, 3.2], box: [-3.2, 3.4, -.8, 10.4] },
  { name: '动轴定区间', short: '动轴', formula: '$\\tfrac14(x-t)^2$', a: .25, t: 1.8, h: 0, ends: [1, 4],
    box: [-.6, 5.4, -.6, 5.2] },
  { name: '开口向下', short: '向下', formula: '$1-(x-1)^2$', a: -1, t: 1, h: 1, ends: [.5, 2.5],
    range: [-1, 3], box: [-1.2, 3.2, -3.2, 1.6] },
];
const clean = v => Number(v.toFixed(6));

export function createBoard(root) {
  const B = new FunctionBoard(root, 860, 480);
  root.classList.add('fn-study-board');
  const st = { grid: true, labs: true };
  let P = examples[0], M = B.isoFit(...P.box), t = P.t, [p, q] = P.ends;
  const cI = B.readout('区间'), cV = B.readout('顶点', 'violet'), cMin = B.readout('最小值', 'mint'), cMax = B.readout('最大值', 'gold'), cJ = B.chipM('判定');
  function moveEnd(index, value) {
    const x = Math.round(value * 20) / 20;
    if (index === 0) p = clean(Math.max(P.range[0], Math.min(x, q - .4)));
    else q = clean(Math.min(P.range[1], Math.max(x, p + .4)));
    endSliders[index].sync(index === 0 ? p : q);
  }
  const endSliders = ['p', 'q'].map((key, i) => B.slider(key, ...P.range, .05, P.ends[i], v => {
    if (P.range) moveEnd(i, v);
    B.render();
  }, key, v => `$${key}=${v}$`));
  const slT = B.slider('顶点 t', 0, 5.2, .05, t, v => { if (!P.range) t = v; B.render(); }, 't', v => `轴 $x=${v}$`);
  const handles = ['p', 'q'].map((label, i) => B.handle({
    get: () => V(M.px(i === 0 ? p : q), M.py(0)),
    set: pt => { if (P.range) moveEnd(i, M.X0 + pt.x / M.s); },
    color: '#ff9e4a', label, lo: i === 0 ? [8, 16] : [-16, 16],
  }));

  B.renderFn = () => {
    const f = x => clean(P.a * (x - t) ** 2 + P.h);
    const nearest = Math.max(p, Math.min(t, q));
    const equal = Math.abs(p + q - 2 * t) < 1e-9;
    const farthest = equal ? [p, q] : [Math.abs(p - t) > Math.abs(q - t) ? p : q];
    const [min, max] = P.a > 0 ? [[nearest], farthest] : [farthest, [nearest]];
    const ink = B.diagramColors, point = x => V(M.px(x), M.py(f(x)));
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    mk('rect', { x: M.px(p), y: 0, width: M.px(q) - M.px(p), height: B.h, fill: ink.blue, 'fill-opacity': .06 }, B.dyn);
    for (const x of [p, q]) B.seg(V(M.px(x), 0), V(M.px(x), B.h), { stroke: ink.orange, 'stroke-dasharray': '4 6', 'stroke-opacity': .6 });
    B.seg(V(M.px(t), 0), V(M.px(t), B.h), { stroke: ink.gold, 'stroke-dasharray': '3 5', 'stroke-opacity': .7 });
    B.plot(f, M, { anchors: [t, p, q], stroke: ink.blue, 'stroke-width': 2 });
    B.plot(f, M, { x0: p, x1: q, anchors: [t], stroke: ink.blue, 'stroke-width': 3.2 });
    const marks = [];
    for (const [locations, color] of [[min, ink.green], [max, ink.red]]) {
      for (const x of locations) marks.push([point(x), color]);
    }
    // 端点恰落在横轴时，把手本身也承担最值点的颜色。
    B.handles.forEach(({ st }, i) => {
      const x = i === 0 ? p : q;
      st.color = f(x) === 0 && min.includes(x) ? '#4ade80' : f(x) === 0 && max.includes(x) ? '#ff7b8a' : '#ff9e4a';
    });
    B.glowPoints([...marks, [point(t), ink.gold], [point(p), ink.orange], [point(q), ink.orange]]);
    B.note('$f(x)=' + P.formula.slice(1), '#5cadff');
    B.note('对称轴', '#ffd166'); B.note('最小值点', '#4ade80'); B.note('最大值点', '#ff7b8a');
    cI(`$[${p},\\,${q}]$`);
    cV(`$(${t},\\,${P.h})$`);
    const extremum = xs => `$${xs.map(x => 'f(' + x + ')').join('=')}=${f(xs[0])}$`;
    cMin(extremum(min)); cMax(extremum(max));
    const where = t === p || t === q ? '轴经过区间端点' : t < p || t > q ? '轴在区间外' : '轴在区间内';
    cJ(`${where}，${equal ? '两端等高，同时取得' + (P.a > 0 ? '最大值' : '最小值') : '距轴越远，函数值越' + (P.a > 0 ? '大' : '小')}。`);
  };

  function select(i) {
    P = examples[i]; M = B.isoFit(...P.box); t = P.t; [p, q] = P.ends;
    endSliders.forEach((slider, j) => {
      slider.parentElement.style.display = P.range ? '' : 'none';
      if (P.range) {
        [slider.min, slider.max] = P.range;
        slider.sync(P.ends[j]);
      }
      handles[j].style.display = B.handles[j].lbl.style.display = P.range ? '' : 'none';
    });
    slT.parentElement.style.display = P.range ? 'none' : '';
    slT.sync(t);
    B.render();
  }
  B.graphToggles(st, ['grid', 'labs']);
  presetRow(B.ctrl, '选择区间最值例题', examples, select);
  select(0);
  return B;
}
