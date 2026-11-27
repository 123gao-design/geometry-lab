// 图 S4 · 用水平线检验上、下界，用端点的开闭区分确界与最值。
import { V } from '../../../lib/board.js';
import { glowDot } from '../../../lib/conic-diagram.js';
import { functionPicker } from '../concept/function-picker.js';
import { FunctionBoard } from '../function-board.js';

const presets = [
  { label: '$x^2,\\;[-2,2]$', f: x => x * x, domain: [-2, 2],
    box: [-2.8, 2.8, -1.6, 5.6], wall: [-1.5, 5.5], initial: 2.5,
    sup: 4, inf: 0, supTex: '$4$', infTex: '$0$',
    max: '$f(-2)=f(2)=4$', min: '$f(0)=0$',
    ends: [[-2, 4, true], [2, 4, true], [0, 0, true]],
    witness: up => up ? 2 : 0 },
  { label: '$x,\\;(0,1)$', f: x => x, domain: [0, 1],
    box: [-.6, 1.6, -.6, 1.6], wall: [-.5, 1.5], initial: .5,
    sup: 1, inf: 0, supTex: '$1$', infTex: '$0$',
    max: '不存在，$x<1$', min: '不存在，$x>0$',
    ends: [[0, 0, false], [1, 1, false]],
    witness: (up, m) => up ? (1 + Math.max(0, m)) / 2 : Math.min(1, m) / 2 },
  { label: '$\\dfrac{1}{x^2},\\;(0,2]$', f: x => 1 / (x * x), domain: [0, 2],
    box: [-.7, 2.7, -1.1, 6.3], wall: [-1, 5.4], initial: 2,
    sup: Infinity, inf: .25, supTex: '无有限上界', infTex: '$\\tfrac14$',
    max: '不存在，$f(x)\\to+\\infty\\ (x\\to0^+)$', min: '$f(2)=\\tfrac14$',
    ends: [[2, .25, true]], asym: [{ v: 0 }],
    // 选一个便于在图上读出的两位小数，使 f(x) 大于界线高度。
    witness: (up, m) => up ? Math.floor(100 / Math.sqrt(Math.max(1, m + .5))) / 100 : 2 },
];

export function createBoard(root) {
  const B = new FunctionBoard(root, 650, 410, 'bounds');
  root.classList.add('bound-wall');
  const maps = presets.map(p => B.isoFit(...p.box));
  const st = { p: 0, M: presets[0].initial, up: true, grid: true, labs: true, asym: true, sup: false };
  const cSup = B.readout('上确界', 'gold'), cInf = B.readout('下确界', 'mint');
  const cMax = B.readout('最大值', 'gold'), cMin = B.readout('最小值', 'mint');
  const cTest = B.chipM('界的检验');

  B.renderFn = () => {
    const p = presets[st.p], map = maps[st.p], { px, py, X0, X1 } = map;
    const { blue, gold, green, mint, red, paper } = B.diagramColors;
    B.grid({ ...map, grid: st.grid, labs: st.labs });
    if (st.asym && p.asym) B.asym(map, p.asym);
    const [a, b] = p.domain;
    B.seg(V(px(a), py(0)), V(px(b), py(0)), { stroke: green, 'stroke-width': 5, 'stroke-opacity': .55 });
    // 开端点处画到单侧极限，最后叠上空心圈。
    B.plot(p.f, map, { x0: a, x1: b, anchors: p.ends.map(([x]) => x), stroke: blue, 'stroke-width': 2.3 });
    B.seg(V(px(X0), py(st.M)), V(px(X1), py(st.M)), { stroke: gold, 'stroke-width': 2 });
    if (st.sup) {
      for (const limit of [p.inf, p.sup]) {
        if (Number.isFinite(limit)) B.seg(V(px(X0), py(limit)), V(px(X1), py(limit)), {
          stroke: mint, 'stroke-width': 1.6, 'stroke-dasharray': '7 6',
        });
      }
    }

    const bound = st.up ? st.M >= p.sup : st.M <= p.inf;
    const testName = st.up ? '上界' : '下界';
    const x = bound ? null : Number(p.witness(st.up, st.M).toFixed(3));
    if (bound) {
      cTest(`$M=${st.M}$ 是${testName}，对任意 $x\\in D$，$f(x)${st.up ? '\\le' : '\\ge'} M$。`, 'ok');
    } else {
      B.seg(V(px(x), py(st.M)), V(px(x), py(p.f(x))), { stroke: red, 'stroke-width': 1.4, 'stroke-dasharray': '4 4' });
      cTest(`$M=${st.M}$ 不是${testName}，反例为 $f(${x})${st.up ? '>' : '<'}${st.M}$。`, 'warn');
    }
    for (const [ex, ey, closed] of p.ends) {
      if (!closed) B.dot(V(px(ex), py(ey)), 4.5, { fill: paper, stroke: blue, 'stroke-width': 1.8 });
      else if (ex !== x) B.dot(V(px(ex), py(ey)), 3.8, { fill: gold });
    }
    if (!bound) glowDot(B, V(px(x), py(p.f(x))), red, 8, 3.8);
    cSup(p.supTex); cInf(p.infTex); cMax(p.max); cMin(p.min);
  };

  const sl = B.slider('界线 M', presets[0].wall[0], presets[0].wall[1], .05, st.M, v => { st.M = v; B.render(); }, 'M');
  const mode = B.btn('改查下界', () => {
    st.up = !st.up;
    mode.textContent = st.up ? '改查下界' : '改查上界';
    B.render();
  });
  const [, , asym] = B.graphToggles(st);
  asym.button.hidden = true;
  B.toggleBtn('确界线', false, on => { st.sup = on; B.render(); });
  functionPicker(root, presets.map(p => p.label), i => {
    const p = presets[i];
    st.p = i; st.M = p.initial;
    sl.min = p.wall[0]; sl.max = p.wall[1]; sl.sync(st.M);
    asym.button.hidden = !p.asym;
    B.render();
  });
  B.render();
  return B;
}
