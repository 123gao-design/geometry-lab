// 同一个横坐标，用函数值、方程与图象三种方式检查。
import { V, fmt } from '../../../lib/board.js';
import { glowDot } from '../../../lib/conic-diagram.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

const presets = [
  { name: '两个整数根', short: '整数根', formula: '$x^2-2x-3$', f: x => (x + 1) * (x - 3),
    box: [-3.5, 4.5, -5.4, 5.4], zeros: [-1, 3], initial: 2, limits: [-3.3, 4.3],
    verdict: '在 $x=-1$ 和 $x=3$ 处穿过横轴，两侧函数值异号。' },
  { name: '三个无理根', short: '无理根', formula: '$x^3-3x+1$', f: x => x * x * x - 3 * x + 1,
    box: [-2.5, 2.5, -3.6, 3.6], zeros: [8, 14, 2].map(k => 2 * Math.cos(k * Math.PI / 9)),
    initial: 1.2, limits: [-2.3, 2.3], verdict: '三处交点都穿过横轴，零点清单列出近似值。' },
  { name: '无零点', short: '无零点', formula: '$\\dfrac{1}{x}$', f: x => 1 / x,
    box: [-3, 3, -4, 4], zeros: [], initial: 1.5, limits: [-2.8, 2.8], poles: [0],
    verdict: '两支在 $x=0$ 处断开。对每个非零输入，都有 $1/x\\ne0$。' },
  { name: '二重零点', short: '二重根', formula: '$x^2$', f: x => x * x,
    box: [-3, 3, -1, 4.6], zeros: [0], initial: 1.5, limits: [-2.8, 2.8],
    verdict: '在原点接触横轴。$x=0$ 是二重零点，两侧均有 $f(x)>0$。' },
];

export function createBoard(root) {
  const B = new FunctionBoard(root, 780, 440);
  root.classList.add('zero-language');
  const maps = presets.map(p => B.isoFit(...p.box));
  const st = { p: 0, x: 2, grid: true, labs: true, asym: true };
  const roots = B.readout('零点清单'), value = B.readout('数值语言', 'gold'), equation = B.chipM('方程语言');
  const graph = B.chipM('图象语言'), verdict = B.chipM('判定');

  B.renderFn = () => {
    const p = presets[st.p], m = maps[st.p], { px, py, X0, X1, Y0, Y1 } = m;
    const { gold, mint, green, red, rule } = B.diagramColors;
    B.grid({ ...m, grid: st.grid, labs: st.labs });
    B.note('当前函数 ' + p.formula, '#93a1b5');
    if (p.poles && st.asym) B.asym(m, [{ v: 0 }, { h: 0 }]);

    const cuts = [X0, ...p.zeros, ...(p.poles || []), X1];
    for (let i = 1; i < cuts.length; i++) {
      const a = cuts[i - 1], b = cuts[i];
      B.plot(p.f, m, { x0: a, x1: b, step: .03, stroke: p.f((a + b) / 2) > 0 ? green : red, 'stroke-width': 2.3 });
    }
    const x = st.x, y = p.f(x), input = fmt(x, 2);
    const atRoot = y === 0;
    for (const z of p.zeros) {
      if (z !== x) glowDot(B, V(px(z), py(0)), gold, 7, 3.5);
    }
    if (Number.isFinite(y)) {
      B.seg(V(px(x), py(Y0)), V(px(x), py(Y1)), { stroke: rule, 'stroke-dasharray': '4 6', 'stroke-opacity': .7 });
      if (y > Y0 && y < Y1) glowDot(B, V(px(x), py(y)), mint, 9, 4);
    }
    roots(p.zeros.length ? p.zeros.map(z => Number.isInteger(z) ? `$${z}$` : `$\\approx ${fmt(z, 4)}$`).join('、') : '无实零点');
    if (!Number.isFinite(y)) {
      value('$f(0)$ 无定义', 'warn');
      equation('$x=0$ 在定义域外', 'warn');
      graph('$x=0$ 处没有图象上的点', 'warn');
    } else {
      const output = atRoot ? '0' : Math.abs(y) < .05 ? String(Number(y.toFixed(6))) : fmt(y, 2);
      const exact = Math.abs(Number(output) - y) < 1e-12;
      value(`$f(${input})${exact ? '=' : '\\approx '}${output}$`, atRoot ? 'ok' : '');
      equation(atRoot ? `$x=${input}$ 是根` : `$f(${input})\\ne0$`, atRoot ? 'ok' : '');
      graph(`$(${input},\\,${output})$${atRoot ? ' 在横轴上' : y > 0 ? ' 在横轴上方' : ' 在横轴下方'}`, atRoot ? 'ok' : '');
    }
    const nearby = p.zeros.find(z => Math.abs(z - x) < .07);
    if (!atRoot && nearby !== undefined) {
      const root = Number.isInteger(nearby) ? `c=${nearby}` : `c\\approx ${fmt(nearby, 4)}`;
      verdict(`探针接近零点 $${root}$，当前仍有 $f(x)\\ne0$。`);
    } else verdict(p.verdict);
  };

  const slider = B.slider('探针 x', -3.3, 4.3, .01, 2, x => { st.x = x; B.render(); }, 'x', n => `探针 $x=${n}$`);
  const [, , asym] = B.graphToggles(st);
  asym.button.hidden = true;
  presetRow(B.ctrl, '选择零点例题', presets, i => {
    const p = presets[i];
    st.p = i;
    slider.min = p.limits[0]; slider.max = p.limits[1];
    if (st.x < slider.min || st.x > slider.max) st.x = p.initial;
    slider.sync(st.x);
    asym.button.hidden = !p.poles;
    B.render();
  });
  B.render();
  return B;
}
