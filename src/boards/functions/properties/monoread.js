// 图 S1 · 用弦比较一对取样点，并与整个函数的单调区间对照。
import { V } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { functionPicker } from '../concept/function-picker.js';

const presets = [
  { formula: '$x^2$', f: x => x * x, box: [-2.8, 2.8, -1.2, 5.2], limit: 2.25,
    initial: [-2, 2], marks: [[0, 0]], intervals: '减 (−∞, 0]　增 [0, +∞)' },
  { formula: '$x^3-3x$', f: x => x * x * x - 3 * x, box: [-2.9, 2.9, -2.9, 2.9], limit: 2.1,
    initial: [-2, 1], marks: [[-1, 2], [1, -2]], intervals: '增 (−∞, −1]　减 [−1, 1]　增 [1, +∞)' },
  { formula: '$\\dfrac{1}{x}$', f: x => 1 / x, box: [-2.4, 2.4, -2.4, 2.4], limit: 2.4,
    initial: [-1, 1], marks: [], gap: 0, intervals: '(−∞, 0) 与 (0, +∞) 上分别递减' },
];

function valueText(x, y) {
  if (!Number.isFinite(y)) return `$f(${x})$ 无定义`;
  const rounded = Number(y.toFixed(4));
  const sign = Math.abs(y - rounded) < 1e-12 ? '=' : '\\approx ';
  return `$f(${x})${sign}${rounded}$`;
}

export function createBoard(root) {
  const W = 650, H = 410;
  const B = new FunctionBoard(root, W, H, 'monotonicity');
  root.classList.add('mono-read');
  const maps = presets.map(p => B.isoFit(...p.box));
  let selected = 0;
  const xs = [...presets[0].initial];
  const st = { grid: true, labs: true, asym: true };
  const values = [B.readout('$f(x_1)$', 'gold'), B.readout('$f(x_2)$', 'mint')];
  const chord = B.readout('弦斜率', 'gold'), compare = B.chip('两点比较'), intervals = B.chip('单调区间');
  const sliders = ['x₁', 'x₂'].map((label, i) =>
    B.slider(label, -presets[0].limit, presets[0].limit, 0.05, xs[i], x => {
      xs[i] = x;
      B.render();
    }, 'x' + (i + 1)));
  const [, , asym] = B.graphToggles(st);

  const colors = ['#ffd166', '#67e8f9'];
  for (const [i, color] of colors.entries()) {
    B.handle({
      color, label: i === 0 ? 'x₁' : 'x₂', lo: [i === 0 ? -15 : 15, -13],
      get: () => {
        const m = maps[selected], y = presets[selected].f(xs[i]);
        return V(m.px(xs[i]), m.py(Number.isFinite(y) ? y : 0));
      },
      set: point => {
        const p = presets[selected], m = maps[selected];
        let x = Math.max(-p.limit, Math.min(p.limit, (point.x - m.px(0)) / m.s));
        // 拖动时让点留在图内，滑块仍可精确取到零或观察图外的值。
        if (p.gap === 0 && Math.abs(x) < 0.4) x = x < 0 ? -0.4 : 0.4;
        sliders[i].sync(Math.round(x * 20) / 20);
        xs[i] = Number(sliders[i].value);
      },
    });
  }

  B.renderFn = () => {
    const p = presets[selected], m = maps[selected];
    const { px, py } = m;
    B.grid({ ...m, grid: st.grid, labs: st.labs });
    asym.button.hidden = p.gap === undefined;
    if (p.gap !== undefined && st.asym) B.asym(m, [{ v: p.gap }, { h: 0 }]);
    B.plot(p.f, m, { anchors: [...p.marks.map(([x]) => x), p.gap], stroke: B.diagramColors.blue, 'stroke-width': 2.2 });
    for (const [x, y] of p.marks) B.dot(V(px(x), py(y)), 3, { fill: B.diagramColors.guide });

    const ys = xs.map(p.f);
    const visible = ys.map(y => y >= m.Y0 && y <= m.Y1);
    const [x1, x2] = xs, [y1, y2] = ys;
    if (visible.every(Boolean) && x1 !== x2) {
      B.seg(V(px(x1), py(y1)), V(px(x2), py(y2)), { stroke: B.diagramColors.gold, 'stroke-width': 1.7, 'stroke-dasharray': '6 4' });
    }
    xs.forEach((x, i) => {
      const y = ys[i], valid = Number.isFinite(y);
      const { c, lbl } = B.handles[i];
      c.style.display = lbl.style.display = visible[i] ? '' : 'none';
      if (valid) {
        const tip = Math.max(10, Math.min(H - 10, py(y)));
        const guide = { stroke: colors[i], 'stroke-width': 1.2, 'stroke-dasharray': '3 5', 'stroke-opacity': .7 };
        B.seg(V(px(x), py(0)), V(px(x), tip), guide);
        if (!visible[i]) B.text(V(px(x) + 10, tip + (y > 0 ? 14 : -4)), y > 0 ? '↑' : '↓', { fill: colors[i] });
      }
      values[i](valueText(x, y) + (valid && !visible[i] ? '（图外）' : ''), valid ? '' : 'warn');
    });

    intervals(p.intervals);
    if (!ys.every(Number.isFinite)) {
      chord('无定义', 'warn');
      compare('零处无函数值', 'warn');
    } else if (x1 === x2) {
      chord('无定义', 'warn');
      compare('两点重合，请分开取点');
    } else {
      const k = (y2 - y1) / (x2 - x1);
      chord(`$${Number(k.toFixed(4))}$`);
      if (p.gap !== undefined && Math.min(x1, x2) < p.gap && p.gap < Math.max(x1, x2)) compare('跨过 x = 0，须分区间判断', 'warn');
      else if (Math.abs(k) < 1e-12) compare('两点等高');
      else compare(k > 0 ? '从左到右，函数值增大' : '从左到右，函数值减小');
    }
  };

  functionPicker(root, presets.map(p => p.formula), i => {
    selected = i;
    const p = presets[i];
    sliders.forEach((slider, j) => {
      xs[j] = p.initial[j];
      slider.min = -p.limit;
      slider.max = p.limit;
      slider.sync(xs[j]);
    });
    B.render();
  });
  B.render();
  return B;
}
