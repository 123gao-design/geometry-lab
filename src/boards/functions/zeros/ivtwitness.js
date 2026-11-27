import { mk, V } from '../../../lib/board.js';
import { glowDot } from '../../../lib/conic-diagram.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

const examples = [
  { name: '连续且异号', short: '连续异号', formula: '$x^3-3x+1$', f: x => x ** 3 - 3*x + 1,
    box: [-2.5, 2.5, -3.6, 3.6], limits: [-2.1, 2.1], ends: [-2, 2],
    roots: [8, 14, 2].map(k => 2 * Math.cos(k * Math.PI / 9)) },
  { name: '同号也有根', short: '同号有根', formula: '$x^2$', f: x => x*x,
    box: [-3, 3, -1, 4.6], limits: [-2.1, 2.1], ends: [-2, 2], roots: [0] },
  { name: '跳跃反例', short: '跳跃反例', formula: '分段函数', f: x => x < .5 ? x + 1 : x - 2,
    box: [-1.6, 2.6, -3, 2.4], limits: [-1.6, 2.6], ends: [0, 1.5], roots: [-1, 2], jump: .5 },
  { name: '严格单调', short: '单调唯一', formula: '$x^3+x-1$', f: x => x ** 3 + x - 1,
    box: [-1.8, 1.8, -7, 7], limits: [-1.6, 1.6], ends: [-1.5, 1.5], roots: [0.6823278038280193], strict: true },
];

export function createBoard(root) {
  const B = new FunctionBoard(root, 780, 440);
  root.classList.add('zero-theorem');
  const maps = examples.map(p => B.isoFit(...p.box));
  const st = { p: 0, grid: true, labs: true };
  const xs = [...examples[0].ends];
  const values = [B.readout('$f(a)$', 'gold'), B.readout('$f(b)$', 'mint')];
  const product = B.readout('乘积', 'mint'), count = B.readout('闭区间零点', 'violet'), verdict = B.chipM('定理判读');
  const sliders = ['a', 'b'].map((label, i) =>
    B.slider(label, ...examples[0].limits, .01, xs[i], x => { xs[i] = x; B.render(); }, label, n => `$${label}=${n}$`));
  for (const [i, label] of ['a', 'b'].entries()) {
    B.handle({
      label, lo: [i ? 12 : -14, -13], color: i ? '#67e8f9' : '#ffd166',
      get: () => V(maps[st.p].px(xs[i]), maps[st.p].py(examples[st.p].f(xs[i]))),
      set: point => {
        const m = maps[st.p];
        const x = Math.round((point.x - m.px(0)) / m.s * 100) / 100;
        const [lo, hi] = examples[st.p].limits;
        xs[i] = Math.max(lo, Math.min(hi, x));
        sliders[i].sync(xs[i]);
      },
    });
  }

  B.renderFn = () => {
    const p = examples[st.p], m = maps[st.p];
    const { px, py, X0, X1, Y0, Y1 } = m;
    const { gold, mint, blue, green, guide, paper } = B.diagramColors;
    const lo = Math.min(...xs), hi = Math.max(...xs);
    B.grid({ ...m, grid: st.grid, labs: st.labs });
    mk('rect', { x: px(lo), y: py(Y1), width: px(hi) - px(lo), height: py(Y0) - py(Y1), fill: green, 'fill-opacity': .07 }, B.dyn);
    B.seg(V(px(lo), py(0)), V(px(hi), py(0)), { stroke: green, 'stroke-width': 4, 'stroke-opacity': .55 });
    const line = { stroke: blue, 'stroke-width': 2.3 };
    if (p.jump === undefined) {
      B.plot(p.f, m, { ...line, anchors: p.roots });
      B.note('当前函数 ' + p.formula, '#93a1b5');
    } else {
      B.plot(x => x + 1, m, { ...line, x0: X0, x1: p.jump });
      B.plot(x => x - 2, m, { ...line, x0: p.jump, x1: X1 });
      B.dot(V(px(p.jump), py(1.5)), 4.5, { fill: paper, stroke: blue, 'stroke-width': 1.6 });
      if (!xs.includes(p.jump)) glowDot(B, V(px(p.jump), py(-1.5)), blue, 7, 3.5);
      B.note('$x<0.5$ 时 $f(x)=x+1$；$x\\ge0.5$ 时 $f(x)=x-2$', '#93a1b5');
    }
    const inside = p.roots.filter(z => z >= lo && z <= hi);
    for (const z of p.roots) {
      if (xs.includes(z)) continue;
      if (inside.includes(z)) glowDot(B, V(px(z), py(0)), gold, 7, 3.5);
      else B.dot(V(px(z), py(0)), 3, { fill: guide });
    }
    const ys = xs.map(p.f);
    xs.forEach((x, i) => {
      const y = ys[i], display = i === 0 && lo === hi ? 'none' : '';
      const handle = B.handles[i];
      handle.c.style.display = handle.lbl.style.display = display;
      B.seg(V(px(x), py(y)), V(px(x), py(0)), { stroke: i ? mint : gold, 'stroke-dasharray': '3 5', 'stroke-opacity': .7 });
      const rounded = Number(y.toFixed(6));
      values[i](`$f(${x})=${rounded}$`);
    });
    count(inside.length ? inside.map(z => Number.isInteger(z) ? `$${z}$` : `$\\approx ${z.toFixed(4)}$`).join('、') + `（${inside.length} 个）` : '$0$ 个');
    const endpointProduct = ys[0] * ys[1];
    const sign = Math.sign(endpointProduct);
    const magnitude = endpointProduct.toLocaleString('en-US', { useGrouping: false, maximumSignificantDigits: 5 });
    product(sign === 0 ? '$f(a)f(b)=0$' : `$f(a)f(b)\\approx ${magnitude} ${sign < 0 ? '<' : '>'} 0$`);
    if (lo === hi) verdict('端点重合，开区间为空。');
    else if (sign === 0) verdict('端点取零，已找到一个闭区间端点根。', 'ok');
    else if (sign > 0) verdict('端点同号，需另判区间内部。');
    else if (lo < p.jump && p.jump <= hi) verdict('区间包含跳跃，端点异号不足以保证有根。', 'warn');
    else verdict(p.strict ? '连续且端点异号，严格单调保证零点唯一。' : '连续且端点异号，开区间内至少有一个零点。', 'ok');
  };
  B.graphToggles(st, ['grid', 'labs']);
  presetRow(B.ctrl, '选择存在性定理例题', examples, i => {
    st.p = i;
    sliders.forEach((slider, j) => {
      const p = examples[i];
      [slider.min, slider.max] = p.limits;
      xs[j] = p.ends[j];
      slider.sync(xs[j]);
    });
    B.render();
  });
  B.render();
  return B;
}
