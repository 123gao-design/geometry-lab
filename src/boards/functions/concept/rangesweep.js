/* 图 C3 · 值域扫描机：定义域把关 + 扫描线投影出值域
   四个预设各带一种定义域限制（无 / 根号 / 分母 / 渐近缺口），扫描线扫过定义域，把 f(x) 投影到 y 轴上刷出「已取到的值」色带。
   图象规范：各预设 B.isoFit 等单位取景；绿带压 x 轴=定义域、金带压 y 轴=值域投影；特殊点（顶点/起点/最大点）金点标注；
   网格 / 轴标注 / 渐近线 三开关可隐藏。 */
import { mk, V } from '../../../lib/board.js';
import { functionPicker } from './function-picker.js';
import { glowDot } from '../../../lib/conic-diagram.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 650, H = 410;
  const B = new FunctionBoard(root, W, H, 'range');
  root.classList.add('range-sweep');

  // 预设：box 取景框 [xa,xb,ya,yb]、[s0,s1] 扫描区间；f 解析式、d 定义域判定、rt 理论值域、how 求法
  // marks 特殊点 [x,y,标签]；asy 渐近线
  const PRESETS = [
    { formula: '$x^2-2x+3$', box: [-1.8, 4.2, -0.6, 8.8], s0: -3.2, s1: 5.2, f: x => x * x - 2 * x + 3, d: () => true,
      rt: '[2,+\\infty)', how: '配方法：$(x-1)^2+2\\ge 2$',
      marks: [[1, 2, '顶点 (1,2)']] },
    { formula: '$\\sqrt{x+2}$', box: [-2.3, 7.5, -0.9, 3.4], s0: -2, s1: 7.4, f: x => Math.sqrt(x + 2), d: x => x >= -2 - 1e-9,
      rt: '[0,+\\infty)', how: '根式非负，在 $x=-2$ 取零',
      marks: [[-2, 0, '起点 (−2,0)']] },
    { formula: '$\\dfrac{1}{x^2+1}$', box: [-3.5, 3.5, -0.5, 1.7], s0: -3.7, s1: 3.7, f: x => 1 / (x * x + 1), d: () => true,
      rt: '(0,1]', how: '观察法：分母 $\\ge 1$ → $0<y\\le 1$',
      marks: [[0, 1, '(0,1) 最大']], asy: [{ h: 0 }] },
    { formula: '$\\dfrac{1}{x-1}$', box: [-2.2, 4.2, -4.6, 4.6], s0: -3.4, s1: 5.4, f: x => 1 / (x - 1), d: x => Math.abs(x - 1) > 1e-6,
      rt: '\\mathbb R\\setminus\\{0\\}', how: '反解 $x=1+\\dfrac{1}{y}$ → $y\\ne 0$',
      marks: [], asy: [{ v: 1 }, { h: 0 }] },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, x: PRESETS[0].s0, grid: true, labs: true, asym: true };
  const cVal = B.readout('函数值'), cRg = B.readout('值域', 'gold'), cHow = B.chipM('求法');

  // 连续分支上的投影由两端和已越过的极值点决定，分母为零处须分开投影。
  function projections(P) {
    const pole = P.asy?.find(a => a.v !== undefined)?.v;
    const start = P.f(P.s0);
    if (pole !== undefined && st.x >= pole) {
      const parts = [[-Infinity, start]];
      if (P.d(st.x)) parts.push([P.f(st.x), Infinity]);
      return parts;
    }
    const values = [start, P.f(st.x)];
    for (const [x, y] of P.marks) if (x >= P.s0 && x <= st.x) values.push(y);
    return [[Math.min(...values), Math.max(...values)]];
  }

  /** 采样画曲线：定义域断开 / 出屏处自动抬笔；特殊点 x 值为必采锚点（② 的起点 (−2,0)、③ 的最高点 (0,1) 要精确采到） */
  function plot(P, at, upTo) {
    const M = MAPS[st.p];
    const lim = Math.min(upTo ?? M.X1, M.X1);
    const left = upTo === undefined ? M.X0 : Math.max(M.X0, P.s0);
    if (left > lim) return;
    const xs = [lim];
    for (const { v } of P.asy ?? []) if (v >= left && v <= lim) xs.push(v);
    for (let x = left; x < lim; x += 0.05) xs.push(x);
    for (const [mx] of P.marks) if (mx >= left && mx <= lim) xs.push(mx);
    xs.sort((p, q) => p - q);
    let d = '', pen = false;
    for (const x of xs) {
      if (P.d(x)) {
        const y = P.f(x);
        if (y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + M.px(x).toFixed(1) + ' ' + M.py(y).toFixed(1) + ' '; pen = true; continue; }
      }
      pen = false;
    }
    mk('path', { d, fill: 'none', ...at }, B.dyn);
  }
  /** 已扫过的一段曲线加粗重画（金） */
  const swept = P => plot(P, { stroke: '#ffd166', 'stroke-width': 2.6, 'stroke-opacity': .9 }, st.x);
  /** 定义域在 x 轴上的绿带（自动跳过断点）：直接压在 x 轴上 */
  function domBand(P) {
    const M = MAPS[st.p];
    const left = P.d(M.X0) ? M.X0 : P.s0;
    B.seg(V(M.px(left), M.py(0)), V(M.px(M.X1), M.py(0)), { stroke: '#4ade80', 'stroke-width': 8, 'stroke-opacity': .8 });
    for (const { v } of P.asy ?? []) {
      if (v !== undefined) B.dot(V(M.px(v), M.py(0)), 4.5, { fill: '#0a0d14', stroke: '#4ade80', 'stroke-width': 1.6 });
    }
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { px, py, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym && P.asy) B.asym(M, P.asy);
    domBand(P);
    for (const [a, b] of projections(P)) {
      const lo = Math.max(Y0, a), hi = Math.min(Y1, b);
      if (lo < hi) B.seg(V(px(0), py(lo)), V(px(0), py(hi)), { stroke: '#ffd166', 'stroke-width': 7, 'stroke-opacity': .8 });
    }
    // 曲线：未扫部分淡蓝，已扫部分金色叠上；特殊点金点 + 小标
    plot(P, { stroke: '#5cadff', 'stroke-width': 2, 'stroke-opacity': .55 });
    swept(P);
    for (const [mx, my, mt] of P.marks) {
      if (mx !== st.x) glowDot(B, V(px(mx), py(my)), B.diagramColors.gold, 8, 3.5);
      B.text(V(px(mx) + 12, py(my) - 10), mt, { 'text-anchor': 'start', fill: '#ffd166' });
    }
    // 扫描线 + 扫描点 + 投影虚线
    if (P.d(st.x)) {
      const y = P.f(st.x);
      B.seg(V(px(st.x), py(Y1)), V(px(st.x), py(Y0)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .8 });
      if (y > Y0 && y < Y1) {
        B.seg(V(px(st.x), py(y)), V(px(0), py(y)), { stroke: '#ffd166', 'stroke-dasharray': '4 4', 'stroke-opacity': .7 });
        if (st.x !== 0) glowDot(B, V(px(0), py(y)), B.diagramColors.gold, 6, 2.8);
        glowDot(B, V(px(st.x), py(y)), B.diagramColors.mint, 9, 4);
      }
    }
    // 徽章
    cVal(P.d(st.x) ? `$f(${st.x.toFixed(2)})\\approx ${P.f(st.x).toFixed(3)}$` : `$x=${st.x.toFixed(2)}$ 时无函数值`, P.d(st.x) ? '' : 'warn');
    cRg(`$${P.rt}$`, 'ok');
    cHow(P.how, '');
  };

  let scanRun = 0;
  const sl = B.slider('扫描 x', PRESETS[0].s0, PRESETS[0].s1, 0.02, st.x, v => {
    if (autoBtn.button.getAttribute('aria-pressed') === 'true') autoBtn.set(false);
    st.x = v;
    B.render();
  });
  const autoBtn = B.toggleBtn('▶ 自动扫描', false, on => {
    const run = ++scanRun;
    if (!on) return;
    const P = PRESETS[st.p], t0 = performance.now();
    const step = () => {
      if (run !== scanRun) return;
      const t = Math.min((performance.now() - t0) / 6000, 1);
      const stepCount = Math.round((P.s1 - P.s0) * t / Number(sl.step));
      sl.sync(Number((P.s0 + stepCount * Number(sl.step)).toFixed(2)));
      st.x = Number(sl.value);
      if (t >= 1) autoBtn.set(false);
      else B.raf(step);
      B.render();
    };
    B.raf(step);
  });
  B.graphToggles(st);
  functionPicker(root, PRESETS.map(p => p.formula), i => {
    autoBtn.set(false);
    st.p = i;
    const P = PRESETS[i];
    sl.min = P.s0; sl.max = P.s1;
    sl.sync(P.s0);
    st.x = P.s0;
    B.render();
  });
  B.render();
  return B;
}
