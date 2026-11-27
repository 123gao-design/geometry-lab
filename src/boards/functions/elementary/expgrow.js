import { V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';
import { presetRow } from '../properties/preset-row.js';

const presets = [
  { a: 2, name: '翻倍增长', short: '翻倍', formula: '$a=2$', tone: '#67e8f9', dash: '7 4' },
  { a: .5, name: '逐次减半', short: '减半', formula: '$a=\\tfrac12$', tone: '#c084fc', dash: '3 4' },
  { a: 3, name: '三倍增长', short: '三倍', formula: '$a=3$', tone: '#ff9e4a', dash: '10 4 2 4' },
  { a: 1, name: '常值边界', short: '常值', formula: '$a=1$' },
];
const baseTex = a => a === .5 ? '\\left(\\tfrac12\\right)' : String(a);

export function createBoard(root) {
  const B = new FunctionBoard(root, 860, 480);
  root.classList.add('fn-study-board');
  const st = { a: 2, x: 0, grid: true, labs: true, asym: true, compare: true };
  const cA = B.readout('当前曲线'), cF = B.readout('探针读数'), cD = B.readout('切线斜率', 'gold');
  const cR = B.readout('相对变化率', 'mint'), cV = B.chipM('曲线高低');

  B.renderFn = () => {
    const { a, x } = st, y = a ** x, rate = Math.log(a), ink = B.diagramColors;
    // 同一探针位置下，各个底数共用量程，移动底数时不会因画面缩放而误判增速。
    const top = Math.max(7, 3 ** x, .3 ** x);
    const M = B.mapFit(-4, 4, -.12 * top, top);
    const point = (u, v) => V(M.px(u), M.py(v));
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym && a !== 1) B.asym(M, [{ h: 0 }]);
    const anchors = [0, 1, x];
    B.note(`当前 $y=${a === 1 ? '1' : baseTex(a) + '^x'}$`, '#5cadff');
    if (st.compare) {
      for (const ref of presets) {
        if (!ref.dash || ref.a === a) continue;
        B.plot(u => ref.a ** u, M, { anchors, stroke: ref.tone, 'stroke-width': 1.9,
          'stroke-dasharray': ref.dash, 'stroke-opacity': .78 });
        B.dot(point(1, ref.a), 2.6, { fill: ref.tone });
        B.note(`$y=${baseTex(ref.a)}^x$`, ref.tone);
      }
    }
    B.plot(u => a ** u, M, { anchors, stroke: ink.blue, 'stroke-width': 2.8 });
    const projection = { stroke: ink.orange, 'stroke-width': 1.1, 'stroke-dasharray': '3 5', 'stroke-opacity': .75 };
    B.seg(point(x, 0), point(x, y), projection);
    B.seg(point(0, y), point(x, y), projection);
    B.glowPoints([[point(0, 1), ink.gold], [point(x, y), ink.orange], [point(1, a), ink.blue]]);
    cA(`$a=${fmt(a, 2)}$，${a === 1 ? '常值函数' : a > 1 ? '严格递增' : '严格递减'}`, a === 1 ? 'warn' : '');
    cF(`$x=${fmt(x, 2)}$，$f(x)\\approx${fmt(y, 3)}$`);
    cD(`$f'(x)\\approx${fmt(y * rate, 3)}$`);
    cR(`$\\tfrac{f'(x)}{f(x)}=\\ln a\\approx${fmt(rate, 3)}$`);
    cV(x === 0 ? '$x=0$ 时，各底数的曲线都经过 $(0,1)$。' :
      x > 0 ? '在 $x>0$ 处，底数越大，曲线越高。' : '在 $x<0$ 处，底数越大，曲线越低。');
  };
  const slA = B.slider('底数 a', .3, 3, .05, st.a, v => {
    st.a = v;
    setSelected(presets.findIndex(p => p.a === v));
    B.render();
  }, undefined, v => `底数 $a=${v}$`);
  B.slider('探针 x', -2.3, 3.8, .05, st.x, v => { st.x = v; B.render(); }, undefined, v => `探针 $x=${v}$`);
  B.graphToggles(st);
  B.toggleBtn('对照曲线', st.compare, on => { st.compare = on; B.render(); });
  const setSelected = presetRow(B.ctrl, '选择指数函数底数', presets, i => {
    st.a = presets[i].a;
    slA.sync(st.a);
    B.render();
  });
  B.render();
  return B;
}
