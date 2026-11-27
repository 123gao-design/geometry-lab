import { SynthBoard } from './synth-board.js';
import { mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new SynthBoard(root, '从曲线读周期、振幅和最值');
  const st = { mode: 0, A: 3, T: 12, t0: 3, k: 5, a: 1, b: 1, c: 0 };
  const cP = B.readout('参数核验', 'blue'), cQ = B.readout('峰值核验', 'gold'), cR = B.readout('谷值核验', 'orange'), cS = B.chipM('方法判读');
  const ASl = B.slider('振幅 A', 0.5, 6, 0.05, st.A, v => { st.A = v; B.render(); }, 'A', n => `振幅 $A=${n}$`);
  const TSl = B.slider('周期 T', 6, 24, 0.5, st.T, v => { st.T = v; B.render(); }, 'Tp', n => `周期 $T=${n}$`);
  const zSl = B.slider('上穿中线 x₀', 0, 12, 0.25, st.t0, v => { st.t0 = v; B.render(); }, 't0', n => `上穿中线 $x_0=${n}$`);
  const kSl = B.slider('中线 k', 0, 8, 0.1, st.k, v => { st.k = v; B.render(); }, 'km', n => `中线 $k=${n}$`);
  const aSl = B.slider('系数 a', 0, 3, 0.1, st.a, v => { st.a = v; B.render(); }, 'a', n => `系数 $a=${n}$`);
  const bSl = B.slider('系数 b', 0, 4, 0.1, st.b, v => { st.b = v; B.render(); }, 'b', n => `系数 $b=${n}$`);
  const cSl = B.slider('中线 c', -3, 3, 0.1, st.c, v => { st.c = v; B.render(); }, 'c', n => `中线 $c=${n}$`);
  const rowOf = s => s.parent || s.parentElement;
  B.choiceRow('选择模式', ['潮汐建模', '合成波最值'].map(name => ({ name })), () => st.mode, setMode);
  const examples = [
    { name: '潮汐拟合', values: { mode: 0, A: 3, T: 12, t0: 3, k: 5 } },
    { name: '半周期错配', values: { mode: 0, A: 3, T: 12, t0: 9, k: 5 } },
    { name: '合成振幅 $\\sqrt{2}$', values: { mode: 1, a: 1, b: 1, c: 0 } },
    { name: '合成振幅 $5$', values: { mode: 1, a: 3, b: 4, c: 2 } },
  ];
  B.examples('选择例题', examples, st, values => {
    Object.assign(st, values);
    ASl.sync(st.A); TSl.sync(st.T); zSl.sync(st.t0); kSl.sync(st.k);
    aSl.sync(st.a); bSl.sync(st.b); cSl.sync(st.c); setMode(st.mode);
  });
  function setMode(m) {
    st.mode = m;
    for (const s2 of m === 0 ? [aSl, bSl, cSl] : [ASl, TSl, zSl, kSl]) rowOf(s2).style.display = 'none';
    for (const s2 of m === 0 ? [ASl, TSl, zSl, kSl] : [aSl, bSl, cSl]) rowOf(s2).style.display = '';
    B.render();
  }
  for (const s2 of [aSl, bSl, cSl]) rowOf(s2).style.display = 'none';   // 初始模式一（renderFn 未就位，只藏行）
  // 潮汐数据（真值 5+3sin(2π(x−3)/12) + 固定微噪 17 点）
  const NZ = [0.08, -0.12, 0.05, 0.1, -0.06, 0.12, -0.09, 0.07, 0.13, -0.08, 0.06, -0.11, 0.09, 0.12, -0.05, 0.1, -0.07];
  const dpts = Array.from({ length: 17 }, (_, i) => V(i * 1.5, 5 + 3 * Math.sin(TAU * (i * 1.5 - 3) / 12) + NZ[i]));
  const fit = x => st.k + st.A * Math.sin(TAU * (x - st.t0) / st.T);
  const peak = Math.max(...dpts.map(p => p.y)), low = Math.min(...dpts.map(p => p.y));
  function midline(m, level) {
    B.seg(V(m.px(0), m.py(level)), V(m.px(m.X1), m.py(level)), { stroke: '#93a1b5', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
  }
  function point(m, x, y, label, color, offset) {
    B.mark(V(m.px(x), m.py(y)), color);
    const markerLabel = B.tex(V(Math.max(68, Math.min(B.w - 64, m.px(x))), m.py(y) + offset), label, { size: 14, color, anchor: 'mid', w: 98 });
    markerLabel.firstElementChild.style.fontFamily = B.legendFont;
  }
  function triangle(card, a, b) {
    const svg = mk('svg', { viewBox: '0 0 168 76', class: 'synth-triangle', role: 'img', 'aria-label': '两直角边为 a 和 b，斜边为合成振幅 R' }, card);
    const scale = Math.min(108 / a, 49 / b);
    const left = (160 - scale * a) / 2, right = left + scale * a, top = 58 - scale * b;
    mk('path', { d: 'M' + left + ' 58H' + right + 'V' + top, fill: 'none', stroke: B.diagramColors.blue, 'stroke-width': 2 }, svg);
    mk('line', { x1: left, y1: 58, x2: right, y2: top, stroke: B.diagramColors.gold, 'stroke-width': 2.3 }, svg);
    for (const [x, y, name] of [[(left + right) / 2, 68, 'a'], [right + 10, (58 + top) / 2, 'b'], [(left + right) / 2 - 9, (58 + top) / 2 - 8, 'R']]) {
      B.tex(V(x, y), '$' + name + '$', { root: svg, w: 24, size: 12, anchor: 'mid', color: B.diagramColors.ink });
    }
  }
  B.renderFn = () => {
    B.proof.replaceChildren();
    if (st.mode === 0) {
      const m = B.axes(24, Math.min(0, st.k - st.A - 0.8), Math.max(9.6, st.k + st.A + 1), 2);
      midline(m, st.k);
      B.plot(fit, m, { stroke: '#ffd166', 'stroke-width': 2.4 });
      for (const p of dpts) {
        B.mark(V(m.px(p.x), m.py(p.y)), Math.abs(fit(p.x) - p.y) < 0.35 ? '#67e8f9' : '#ff7b8a');
      }
      point(m, st.t0, st.k, '上穿中线', '#5cadff', -16);
      const pk = st.t0 + st.T / 4, valley = st.t0 + 3 * st.T / 4;
      point(m, pk, st.k + st.A, '峰', '#ffd166', -14);
      point(m, valley > 24 ? valley - st.T : valley, st.k - st.A, '谷', '#ff9e4a', 15);
      B.note('拟合曲线', '#ffd166');
      B.note('中线', '#93a1b5', 'dashed');
      B.note('偏差小', '#67e8f9');
      B.note('偏差大', '#ff7b8a');

      B.reading('横向看周期', ['约在 $6$ 时和 $18$ 时出现高潮，两峰相距约 $12$ 小时。']);
      B.reading('纵向看潮差', ['水深约为 $2$ 至 $8$ 米。中点是 $5$ 米，潮差的一半是 $3$ 米。'], 'gold');
      const rms = Math.sqrt(dpts.reduce((sum, p) => sum + (fit(p.x) - p.y) ** 2, 0) / dpts.length);
      cP('均方根误差 $' + fmt(rms, 2) + '\\,\\mathrm m$', rms < .35 ? 'ok' : 'warn');
      cQ('拟合 $' + fmt(st.k + st.A, 2) + '$，观测 $' + fmt(peak, 2) + '$', Math.abs(st.k + st.A - peak) < .5 ? 'ok' : 'warn');
      cR('拟合 $' + fmt(st.k - st.A, 2) + '$，观测 $' + fmt(low, 2) + '$', Math.abs(st.k - st.A - low) < .5 ? 'ok' : 'warn');
      cS('调 $x_0$，让曲线上升时穿过中线的位置对准观测点。点与曲线的竖直距离越小，拟合越好。');
    } else {
      const R = Math.hypot(st.a, st.b), phi = Math.atan2(st.b, st.a);
      const yM = Math.max(3, Math.abs(st.c) + R + 1);
      const m = B.axes(TAU, -yM, yM, yM > 5 ? 2 : 1);
      const f = x => st.c + st.a * Math.sin(x) + st.b * Math.cos(x);
      const pk = Math.PI / 2 - phi, valley = pk + Math.PI;
      midline(m, st.c);
      B.plot(f, m, { anchors: [pk, valley], stroke: '#5cadff', 'stroke-width': 2.5 });
      if (R > 0) {
        point(m, pk, st.c + R, '$c+R$', '#ffd166', -16);
        point(m, valley, st.c - R, '$c-R$', '#ff9e4a', 16);
      }
      B.note('$a\\sin x+b\\cos x+c$', '#5cadff');
      B.note('中线 $y=c$', '#93a1b5', 'dashed');
      const amplitude = ['$R=\\sqrt{a^2+b^2}$'];
      if (!st.a && st.b) amplitude.push('只剩余弦项，振幅为 $|b|$。');
      if (st.a && !st.b) amplitude.push('只剩正弦项，振幅为 $|a|$。');
      const card = B.reading('合成振幅', amplitude);
      if (st.a && st.b) triangle(card, st.a, st.b);
      B.reading('从中线读峰谷', R > 0 ? ['中线在 $y=' + fmt(st.c, 1) + '$，向上或向下各走一个振幅。',
        '最高 $' + fmt(st.c + R, 2) + '$，最低 $' + fmt(st.c - R, 2) + '$。'] : ['振幅为零，整条曲线都在中线上。'], 'gold');
      const samples = Array.from({ length: 481 }, (_, i) => f(TAU * i / 480));
      cP('$R\\approx ' + fmt(R, 2) + '$');
      cQ('理论 $' + fmt(st.c + R, 2) + '$，采样 $' + fmt(Math.max(...samples), 2) + '$');
      cR('理论 $' + fmt(st.c - R, 2) + '$，采样 $' + fmt(Math.min(...samples), 2) + '$');
      cS(R > 0 ? '写成 $R\\sin(x+\\varphi)+c$，第一个波峰在 $x=\\pi/2-\\varphi$，再走半个周期到达波谷。'
        : '$a=b=0$，每个 $x$ 都同时取得最大值和最小值。');
    }
  };
  B.render();
  B.hint('切换例题比较潮汐的峰谷时刻，或改变系数，观察合成波的中线与振幅。');
  return B;
}
