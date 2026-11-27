/* 图 V3 · 极值最值判定机：f′=0 找驻点、两侧变号定极值、闭区间把端点并入候选点集。
   曲线按 f′ 符号染色（S2 复用：绿=增、红=减）；驻点变号→金点，驻点不变号→红点排除；
   区间 [p,q] 虚线围栏，候选点 = 极值点 ∪ 端点，逐个比较得最大最小。按端点函数值取景。 */
import { V, fmt } from '../../../lib/board.js';
import { presetRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');

  const PRESETS = [
    { name: '两极值', formula: '$f=x^3-3x$', f: x => x * x * x - 3 * x, fp: x => 3 * x * x - 3, crits: [-1, 1], xa: -2.6, xb: 2.6, ya: -4.4, yb: 4.4 },
    { name: '平稳穿过', formula: '$f=x^3$', f: x => x * x * x, fp: x => 3 * x * x, crits: [0], xa: -1.9, xb: 1.9, ya: -7.4, yb: 7.4 },
    { name: '三驻点', formula: '$f=x^4-2x^2$', f: x => x * x * x * x - 2 * x * x, fp: x => 4 * x * x * x - 4 * x, crits: [-1, 0, 1], xa: -2.2, xb: 2.2, ya: -1.6, yb: 2.6 },
  ];
  const st = { p: 0, a: -1.8, b: 1.8, grid: true, labs: true };

  const cC = B.readout('驻点核验'), cE = B.chipM('极值判读'), cM = B.readout('区间最大值', 'gold'), cS = B.readout('区间最小值', 'mint');

  B.renderFn = () => {
    const marks = [];
    const P = PRESETS[st.p];
    const ends = [P.f(st.a), P.f(st.b)];
    const M = B.mapFit(P.xa, P.xb, Math.min(P.ya, ...ends), Math.max(P.yb, ...ends));
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    const cuts = [M.X0, ...P.crits, M.X1];
    for (let i = 1; i < cuts.length; i++) {
      const x0 = cuts[i - 1], x1 = cuts[i];
      const rising = P.fp((x0 + x1) / 2) > 0;
      B.plot(P.f, M, { x0, x1, anchors: [st.a, st.b], stroke: rising ? '#4ade80' : '#ff7b8a', 'stroke-width': 2.2 });
    }

    // 驻点分类：两侧 fp 符号变号→极值（金实心），同号→非极值（红点）
    const exts = [];
    for (const c of P.crits) {
      const sl = Math.sign(P.fp(c - 0.02)), sr = Math.sign(P.fp(c + 0.02));
      const y = P.f(c);
      const kind = sl === sr ? 'flat' : sl > 0 ? 'max' : 'min';
      exts.push({ x: c, y, kind });
      if (c > M.X0 && c < M.X1 && y > M.Y0 && y < M.Y1) {
        if (kind === 'flat') marks.push([V(M.px(c), M.py(y)), B.diagramColors.red]);
        else marks.push([V(M.px(c), M.py(y)), B.diagramColors.gold]);
      }
    }
    // 区间围栏 + 端点（实心=闭，规范⑧）
    for (const e of [st.a, st.b]) {
      B.seg(V(M.px(e), 0), V(M.px(e), H), { stroke: '#3f5f8f', 'stroke-dasharray': '4 5', 'stroke-opacity': .85 });
      const y = P.f(e);
      if (y > M.Y0 && y < M.Y1) marks.push([V(M.px(e), M.py(y)), B.diagramColors.guide]);
    }
    // 候选点比较：极值点（在区间内）+ 两端点
    const candidates = [...new Set([st.a, st.b, ...P.crits.filter(x => x > st.a && x < st.b)])];
    const values = candidates.map(P.f);
    const lo = Math.min(...values), hi = Math.max(...values);
    const locations = y => candidates.filter((_, i) => Math.abs(values[i] - y) < 1e-9).sort((a,b) => a-b);
    const describe = y => `$${fmt(y, 3)}$，取于 $x=${locations(y).join(',\\,')}$`;
    cC(P.crits.map(x => `$x=${x}$`).join('、'));
    cE(exts.map(e => `$x=${e.x}$ ${e.kind === 'flat' ? '两侧同增' : e.kind === 'max' ? '极大' : '极小'}`).join('；'));
    cM(describe(hi)); cS(describe(lo));
    for (const x of locations(hi)) marks.unshift([V(M.px(x), M.py(hi)), B.diagramColors.orange]);
    for (const x of locations(lo)) marks.unshift([V(M.px(x), M.py(lo)), B.diagramColors.mint]);
    B.glowPoints(marks);
  };

  const slP = B.slider('区间左端 p', -2.45, -0.05, 0.05, -1.8, v2 => { st.a = v2; B.render(); }, undefined, v => `$p=${v}$`);
  const slQ = B.slider('区间右端 q', 0.05, 2.45, 0.05, 1.8, v2 => { st.b = v2; B.render(); }, undefined, v => `$q=${v}$`);
  B.graphToggles(st, ['grid', 'labs']);
  presetRow(B.ctrl, '选择例题', PRESETS, i => {
    const p = PRESETS[i];
    st.p = i;
    const lo = +(p.xa + 0.15).toFixed(2), hi = +(p.xb - 0.15).toFixed(2);
    st.a = Math.max(lo, Math.min(-0.05, st.a)); st.b = Math.max(0.05, Math.min(hi, st.b));
    slP.setAttribute('min', lo); slP.sync(st.a);
    slQ.setAttribute('max', hi); slQ.sync(st.b);
    B.render();
  });
  B.render();
  return B;
}
