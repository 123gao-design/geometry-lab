import { SynthBoard } from './synth-board.js';
import { angleTex } from '../trig-board.js';
import { V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new SynthBoard(root, '从交点读出方程的解');
  const st = { mode: 0, t: 0.5, tt: 1 };
  const cN = B.chipM('解数判读'), cV = B.readout('特解回代', 'gold'), cG = B.readout('通解集', 'blue');
  const tS = B.slider('值 t', -1.5, 1.5, 0.05, st.t, v => { st.t = v; B.render(); }, 't', n => `值 $t=${n}$`);
  const tT = B.slider('值 t', -4, 4, 0.1, st.tt, v => { st.tt = v; B.render(); }, 'T', n => `值 $t=${n}$`);
  const rowOf = s => s.parent || s.parentElement;
  B.choiceRow('选择模式', ['$\\sin x=t$', '$\\cos x=t$', '$\\tan x=t$'].map(name => ({ name })), () => st.mode, setMode);
  const examples = [
    { name: '$\\sin x=1/2$', values: { mode: 0, t: 0.5 } },
    { name: '$\\sin x=1$', values: { mode: 0, t: 1 } },
    { name: '$\\cos x=-1/2$', values: { mode: 1, t: -0.5 } },
    { name: '$\\tan x=1$', values: { mode: 2, tt: 1 } },
  ];
  B.examples('选择例题', examples, st, values => {
    Object.assign(st, values); tS.sync(st.t); tT.sync(st.tt); setMode(st.mode);
  });
  function setMode(m) {
    st.mode = m;
    rowOf(m === 2 ? tS : tT).style.display = 'none';
    rowOf(m === 2 ? tT : tS).style.display = '';
    B.render();
  }
  rowOf(tT).style.display = 'none';   // 初始 sin 模式（renderFn 未就位，只藏行不渲染）
  const solsOf = () => {               // 特解解析生成（比扫描稳）：两支候选 + mod 2π + 排序去重
    const out = [];
    if (st.mode < 2) {
      if (Math.abs(st.t) > 1 + 1e-9) return out;
      const tc = Math.max(-1, Math.min(1, st.t));
      const a = st.mode === 0 ? Math.asin(tc) : Math.acos(tc);
      (st.mode === 0 ? [a, Math.PI - a] : [a, -a]).forEach(x => out.push(((x % TAU) + TAU) % TAU));
    } else for (let k = 0; k < 3; k++) out.push((((Math.atan(st.tt) + k * Math.PI) % TAU) + TAU) % TAU);
    out.sort((p, q) => p - q);
    return out.filter((x, i) => i === 0 || x - out[i - 1] > 1e-6);
  };

  B.renderFn = () => {
    const tv = st.mode === 2 ? st.tt : st.t;
    const f = st.mode === 0 ? Math.sin : st.mode === 1 ? Math.cos : Math.tan;
    const yMax = st.mode === 2 ? 4.6 : 1.7;
    const bad = st.mode < 2 && Math.abs(st.t) > 1 + 1e-9;
    const sols = solsOf();
    // 将角度刻度放在水平线的另一侧，过零时交点名与刻度也分居轴两侧。
    const m = B.axes(TAU, -yMax, yMax, st.mode === 2 ? 2 : 0.5, tv < 0 ? 'above' : 'below');
    const col = ['#5cadff', '#67e8f9', '#c084fc'][st.mode];
    B.plot(f, m, { anchors: sols, stroke: col, 'stroke-width': 2.6 });
    B.seg(V(m.px(0), m.py(tv)), V(m.px(TAU), m.py(tv)), { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '6 4' });
    B.dot(V(m.px(TAU), m.py(f(TAU))), 3.5, { fill: B.diagramColors.paper, stroke: col, 'stroke-width': 1.7 });
    sols.forEach((x, i) => {
      B.mark(V(m.px(x), m.py(tv)), '#ffd166');
      B.tex(V(m.px(x) + (x === 0 ? 12 : 0), m.py(tv) + (tv >= 0 ? -16 : 17)), '$x_{' + (i + 1) + '}$',
        { size: 14, color: '#ffd166', anchor: 'mid', w: 38 });
    });
    const fn = ['\\sin', '\\cos', '\\tan'][st.mode];
    B.note('$y=' + fn + ' x$', col);
    B.note('$y=' + fmt(tv, 2) + '$', '#ffd166', 'dashed');

    B.proof.replaceChildren();
    const roots = sols.map((x, i) => {
      const deg = x * 180 / Math.PI;
      const exact = Math.abs(deg - Math.round(deg)) < 1e-7;
      return '$x_{' + (i + 1) + '}' + (exact ? '=' : '\\approx ') + angleTex(x) + '$'
        + ' $(' + (exact ? Math.round(deg) : fmt(deg, 1)) + '^\\circ)$';
    });
    B.reading('窗内特解 $[0,2\\pi)$', bad ? ['水平线与曲线没有交点。'] : roots);
    const period = st.mode === 2 ? '\\pi' : '2\\pi';
    B.reading('沿横轴重复', bad ? ['正弦和余弦的值都在 $[-1,1]$ 内。']
      : ['相同的函数值每隔 $' + period + '$ 重现。', sols.length === 1 ? '水平线恰好碰到一个峰或谷。'
        : st.mode === 2 ? '两个交点相隔一个周期，属于同一支解。' : '两个交点各给出一支解。'], 'gold');
    const inverse = ['\\arcsin', '\\arccos', '\\arctan'][st.mode];
    if (bad) cN('水平线超出了值域，方程无实数解。', 'warn');
    else if (sols.length === 1) cN('水平线与曲线相切，两支解在这里合并。', 'ok');
    else cN('取 $\\alpha=' + inverse + ' t$，$k\\in\\mathbb Z$。');
    cV(bad ? '无特解可回代' : '$f(x_1)=' + fmt(tv, 2) + '=t$', bad ? 'warn' : 'ok');
    if (bad) cG('$\\varnothing$', 'warn');
    else if (sols.length === 1) cG('$x=' + (sols[0] ? angleTex(sols[0]) + '+' : '') + '2k\\pi,\\quad k\\in\\mathbb Z$');
    else if (st.mode === 0) cG('$x=\\alpha+2k\\pi$ 或 $x=\\pi-\\alpha+2k\\pi$');
    else cG(st.mode === 1 ? '$x=\\pm\\alpha+2k\\pi$' : '$x=\\alpha+k\\pi$');
  };
  B.render();
  B.hint('拖动滑块改变水平线的高度，读出交点的横坐标。右端点与起点相隔一个整周期，计数时只取左端点。');
  return B;
}
