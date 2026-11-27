import { V } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

const examples = [
  { name: '逼近平方根', short: '平方根', formula: '$x^2-2$', derivative: '$2x$',
    f: x => x * x - 2, fp: x => 2 * x, start: 2, pair: [1, 2], root: Math.SQRT2, bracket: [1, 2],
    box: [-.3, 2.6, -1.5, 2.6] },
  { name: '三次函数的正根', short: '正根', formula: '$x^3-3x+1$', derivative: '$3x^2-3$',
    f: x => x ** 3 - 3 * x + 1, fp: x => 3 * x * x - 3, start: 1.6, pair: [1.3, 1.6],
    root: 2 * Math.cos(2 * Math.PI / 9), bracket: [1.3, 1.8], box: [.2, 2.2, -1.2, 1.8] },
  { name: '循环反例', short: '循环', formula: '$x^3-2x+2$', derivative: '$3x^2-2$',
    f: x => x ** 3 - 2 * x + 2, fp: x => 3 * x * x - 2, start: 0, pair: [1, 2],
    root: -1.7692923542386314, bracket: [-2, -1.5], box: [-2.4, 2.4, -3, 6.6] },
];
const residualLimit = 1e-12;
function numberTex(value) {
  if (value !== 0 && Math.abs(value) < .001) {
    const [m, e] = value.toExponential(2).split('e');
    return `${m}\\times10^{${Number(e)}}`;
  }
  return String(Number(value.toFixed(6)));
}

export function createBoard(root) {
  const B = new FunctionBoard(root, 860, 480);
  root.classList.add('fn-study-board');
  const st = { grid: true, labs: true };
  let example = examples[0], nt, sc, badN, badS;
  const cN = B.readout('牛顿法', 'gold'), cS = B.readout('弦截法', 'orange');
  const errN = B.readout('牛顿误差', 'gold'), errS = B.readout('弦截误差', 'orange'), verdict = B.chipM('判读');
  function reset() {
    nt = [example.start];
    sc = [...example.pair];
    badN = badS = '';
  }
  function stepNewton() {
    const x = nt.at(-1), y = example.f(x), slope = example.fp(x);
    if (badN || Math.abs(y) < residualLimit) return;
    if (Math.abs(slope) < 1e-12) { badN = '切线近水平'; return; }
    const next = x - y / slope;
    if (!Number.isFinite(next) || Math.abs(next) > 60) { badN = '迭代超出演示范围'; return; }
    if (nt.includes(next)) badN = '迭代回到旧点，形成循环';
    nt.push(next);
  }
  function stepSecant() {
    const a = sc.at(-2), b = sc.at(-1), fa = example.f(a), fb = example.f(b);
    if (badS || Math.abs(fb) < residualLimit) return;
    if (Math.abs(fb - fa) < 1e-12) { badS = '两点近乎等高'; return; }
    const next = b - fb * (b - a) / (fb - fa);
    if (!Number.isFinite(next) || Math.abs(next) > 60) { badS = '迭代超出演示范围'; return; }
    if (sc.some((x, i) => i > 0 && x === next && sc[i - 1] === b)) badS = '迭代点对重复，形成循环';
    sc.push(next);
  }

  B.renderFn = () => {
    const P = example, M = B.isoFit(...P.box), ink = B.diagramColors;
    const point = (x, y) => V(M.px(x), M.py(y));
    const curve = x => point(x, P.f(x));
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.plot(P.f, M, { anchors: [P.root, ...nt, ...sc], stroke: ink.blue, 'stroke-width': 2.3 });
    B.dot(point(P.root, 0), 3, { fill: ink.guide });
    for (let i = 1; i < nt.length; i++) {
      const a = nt[i - 1], b = nt[i], current = i === nt.length - 1;
      B.seg(curve(a), point(b, 0), { stroke: ink.gold, 'stroke-width': current ? 2.4 : 1.3, 'stroke-opacity': current ? 1 : .42 });
      B.seg(point(b, 0), curve(b), { stroke: ink.gold, 'stroke-dasharray': '3 5', 'stroke-opacity': current ? .85 : .35 });
    }
    for (let i = 2; i < sc.length; i++) {
      const a = sc[i - 2], b = sc[i - 1], next = sc[i], current = i === sc.length - 1;
      // 即使截距落在两点之间，弦线也应覆盖两个已知曲线点。
      const ends = [a, b, next].sort((u, v) => u - v);
      const end = x => x === next ? point(x, 0) : curve(x);
      B.seg(end(ends[0]), end(ends[2]), { stroke: ink.orange, 'stroke-width': current ? 2 : 1.3,
        'stroke-dasharray': '7 4', 'stroke-opacity': current ? 1 : .42 });
      if (current) B.seg(point(next, 0), curve(next), { stroke: ink.orange, 'stroke-dasharray': '2 5', 'stroke-opacity': .65 });
    }
    for (const [path, color] of [[nt, ink.gold], [sc, ink.orange]]) {
      for (const x of path.slice(0, -1)) B.dot(curve(x), 2.5, { fill: color });
    }
    const n = nt.at(-1), s = sc.at(-1);
    const marks = [[curve(n), ink.gold], [curve(s), ink.orange]];
    if (nt.length > 1) marks.push([point(n, 0), ink.gold]);
    if (sc.length > 2) marks.push([point(s, 0), ink.orange]);
    B.glowPoints(marks);
    B.note(`$f(x)=${P.formula.slice(1, -1)}$`, '#5cadff');
    B.note(`$f'(x)=${P.derivative.slice(1, -1)}$`);
    B.note('切线 · 实线', '#ffd166');
    B.note('弦线 · 虚线', '#ff9e4a');
    const show = (chip, errChip, path, steps, bad) => {
      const x = path.at(-1), fx = P.f(x), err = Math.abs(x - P.root);
      const done = Math.abs(fx) < residualLimit;
      chip(`第 $${steps}$ 步，$x\\approx${numberTex(x)}$，$f(x)\\approx${numberTex(fx)}$`, bad ? 'warn' : done ? 'ok' : '');
      errChip(err < 1e-14 ? '$|x-r|<10^{-14}$' : `$|x-r|\\approx${numberTex(err)}$`);
    };
    show(cN, errN, nt, nt.length - 1, badN);
    show(cS, errS, sc, sc.length - 2, badS);
    const [a, b] = P.bracket;
    const doneN = Math.abs(P.f(n)) < residualLimit, doneS = Math.abs(P.f(s)) < residualLimit;
    if (badN || badS) verdict([badN && '牛顿法' + badN, badS && '弦截法' + badS].filter(Boolean).join('；'), 'warn');
    else if (doneN || doneS) verdict(`${doneN && doneS ? '两法' : doneN ? '牛顿法' : '弦截法'}已满足 $|f(x)|<10^{-12}$`, 'ok');
    else verdict(`同一根用二分法，从 $[${a},${b}]$ 开始，$m$ 步后中点误差至多 $${(b - a).toFixed(1)} / 2^{m+1}$。`);
  };
  B.btnM('切线一步', () => { stepNewton(); B.render(); }, { pri: true });
  B.btnM('弦截一步', () => { stepSecant(); B.render(); });
  B.btnM('重来', () => { reset(); B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  presetRow(B.ctrl, '选择迭代例题', examples, i => { example = examples[i]; reset(); B.render(); });
  reset();
  B.render();
  return B;
}
