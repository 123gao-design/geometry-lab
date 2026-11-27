import { mk, V } from '../../../lib/board.js';
import { InequalityBoard } from '../inequality-board.js';

// 每幅图内部使用固定比例尺，所以拖动滑块前后的长度可以直接比较。
const left = 78, right = 544, span = right - left;
const blue = '#5cadff', gold = '#ffd166', green = '#4ade80', guide = '#93a1b5';

function bar(B, x, end, y, height, color, opacity) {
  mk('rect', { x, y, width: end - x, height, fill: color, 'fill-opacity': opacity }, B.dyn);
}
function label(B, x, y, text, color, anchor = 'mid') {
  B.tex(V(x, y), text, { size: 15, anchor, color });
}
function nSlider(B, min, initial, update) {
  return B.slider('n', min, 20, 1, initial, update, 'n', (_, v) => `$n=${v}$`);
}

export function createTelescope(root) {
  const B = new InequalityBoard(root, 616, 285);
  let n = 5;
  nSlider(B, 2, n, v => { n = v; B.render(); });
  const term = B.readout('末项放大'), sum = B.readout('部分和', 'mint'), bound = B.chipM('相消后的上界');
  const x = v => left + span * v;
  B.renderFn = () => {
    // 将第 n 段局部放大，在同一对端点间比较原项与替代项。
    label(B, left, 33, `第 $${n}$ 段放大`, guide, 'start');
    label(B, right, 33, '$1/[n(n-1)]$', blue, 'end');
    bar(B, left, right, 60, 21, blue, .22);
    const fraction = (n - 1) / n;
    bar(B, left, x(fraction), 60, 21, gold, .76);
    B.mark(V(x(fraction), 71), gold);
    label(B, left, 102, '$1/n^2$', gold, 'start');

    label(B, left, 152, '相邻分数之间的长度', guide, 'start');
    B.seg(V(left, 196), V(right, 196), { stroke: guide, 'stroke-width': 1.2 });
    let total = 1;
    for (let k = 2; k <= n; k++) {
      total += 1 / (k * k);
      const start = x(1 / k), end = x(1 / (k - 1));
      bar(B, start, end, 182, 27, blue, k % 2 ? .25 : .4);
      bar(B, start, x(1 / k + 1 / (k * k)), 190, 10, gold, .83);
      B.seg(V(start, 179), V(start, 214), { stroke: blue, 'stroke-width': 1 });
    }
    B.mark(V(x(1 / n), 196), blue);
    label(B, left, 246, '$0$', guide);
    label(B, x(1 / n), 227, `$1/${n}$`, blue);
    label(B, right, 227, '$1$', guide);
    term(`$1/${n * n}<1/${n * (n - 1)}$`);
    sum(`$S_{${n}}\\approx ${total.toFixed(4)}$`);
    bound(`首项 $1$ 加上蓝段的总长 $1-1/${n}$，得到 $S_{${n}}<2-1/${n}<2$。`);
  };
  B.render();
  return B;
}

export function createSqueeze(root) {
  const B = new InequalityBoard(root, 616, 308);
  let n = 5;
  nSlider(B, 1, n, v => { n = v; B.render(); });
  const value = B.readout('当前和'), width = B.readout('两界间距', 'gold'), conclusion = B.chipM('夹逼');
  const x = k => left + (k - 1) / 19 * span;
  const y = v => 239 - (v - .5) * 376;
  const lower = .5;
  const samples = Array.from({ length: 20 }, (_, index) => {
    const k = index + 1;
    let s = 0;
    for (let j = 1; j <= k; j++) s += j / (k * k + j);
    return { k, s, upper: lower + 1 / (2 * k) };
  });
  B.renderFn = () => {
    const top = samples.map(p => `${x(p.k)},${y(p.upper)}`).join(' ');
    mk('polygon', { points: `${left},${y(lower)} ${top} ${right},${y(lower)}`, fill: blue, 'fill-opacity': .1 }, B.dyn);
    mk('polyline', { points: top, fill: 'none', stroke: blue, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, B.dyn);
    B.seg(V(left, y(lower)), V(right, y(lower)), { stroke: green, 'stroke-width': 1.8 });
    for (const tick of [.5, .75, 1]) label(B, left - 11, y(tick), `$${tick}$`, guide, 'end');
    for (const tick of [1, 5, 10, 15, 20]) label(B, x(tick), 263, `$${tick}$`, guide);
    label(B, right + 22, 263, '$n$', guide);
    for (const p of samples) {
      B.dot(V(x(p.k), y(p.s)), 2.6, { fill: gold });
      B.dot(V(x(p.k), y(p.upper)), 2, { fill: blue });
    }
    const p = samples[n - 1];
    B.seg(V(x(n), y(lower)), V(x(n), y(p.upper)), { stroke: blue, 'stroke-width': 2 });
    B.mark(V(x(n), y(p.s)), gold);
    B.mark(V(x(n), y(p.upper)), blue);
    B.note('原和 $S_n$', gold);
    B.note('上界 $1/2+1/(2n)$', blue);
    B.note('下界 $1/2$', green);
    value(`$S_{${n}}\\approx ${p.s.toFixed(4)}$`);
    width(`$U_{${n}}-L_{${n}}=1/${2 * n}$`);
    conclusion(n === 1 ? '$S_1=1/2$，第一个点恰在下界上。' :
      '$0<S_n-1/2<1/(2n)$。当 $n$ 增大，两界间距趋于零。');
  };
  B.render();
  return B;
}

export function createBinomial(root) {
  const B = new InequalityBoard(root, 616, 255);
  let n = 5, m = 1;
  nSlider(B, 1, n, v => {
    n = v;
    m = Math.min(m, n);
    order.max = n;
    order.sync(m);
    B.render();
  });
  const order = B.slider('保留至 m 次', 1, 20, 1, m, v => { m = v; B.render(); }, 'm', (_, v) => `$m=${v}$`);
  order.max = n;
  const retained = B.readout('保留项之和'), omitted = B.readout('余项之和', 'gold'), conclusion = B.chipM('下界');
  const x = v => left + v / 2.8 * span;
  B.renderFn = () => {
    let total = 0, partial = 0, rest = 0, term = 1;
    label(B, left, 34, '完整展开', guide, 'start');
    label(B, left, 119, `保留到 $k=${m}$`, guide, 'start');
    for (let k = 0; k <= n; k++) {
      if (k > 0) term *= (n - k + 1) / (k * n);
      const next = total + term;
      const included = k <= m;
      const color = included ? gold : blue;
      const opacity = k % 2 ? .54 : .83;
      bar(B, x(total), x(next), 57, 26, color, opacity);
      if (included) {
        bar(B, x(total), x(next), 145, 26, color, opacity);
        partial = next;
      } else rest += term;
      total = next;
    }
    B.seg(V(x(partial), 85), V(x(partial), 145), { stroke: gold, 'stroke-dasharray': '4 4' });
    B.mark(V(x(partial), 158), gold);
    B.seg(V(left, 197), V(x(2.8), 197), { stroke: guide, 'stroke-width': 1 });
    for (const tick of [0, 1, 2, 2.5]) label(B, x(tick), 219, `$${tick}$`, guide);
    const restTex = rest.toPrecision(4).split('e');
    retained(`$T_{${m}}\\approx ${partial.toFixed(4)}$`);
    omitted(rest === 0 ? '$R_m=0$' : `$R_m\\approx ${restTex[0]}${restTex.length > 1 ? '\\times10^{' + Number(restTex[1]) + '}' : ''}$`);
    conclusion(m === n ? '所有项均已保留，下界取等。' :
      `舍去的 ${n - m} 项都为正，$T_{${m}}<(1+1/n)^n$。`);
  };
  B.render();
  return B;
}
