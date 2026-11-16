/* 图 C3 · 值域扫描机：定义域把关 + 扫描线投影出值域
   四个预设各带一种定义域限制（无 / 根号 / 分母 / 渐近缺口），扫描线扫过定义域，把 f(x) 投影到 y 轴上刷出「已取到的值」色带。
   图象规范：各预设 B.isoFit 等单位取景；绿带压 x 轴=定义域、金带压 y 轴=值域投影；特殊点（顶点/起点/最大点）金点标注；
   网格 / 轴标注 / 渐近线 三开关可隐藏。 */
import { Board, mk, V } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 500;
  const B = new Board(root, W, H);

  // 预设：box 取景框 [xa,xb,ya,yb]、[s0,s1] 扫描区间；f 解析式、d 定义域判定、dt/rt 定义域值域文本、how 求法、end 扫完点评
  // marks 特殊点 [x,y,标签]；asy 渐近线
  const PRESETS = [
    { name: '① $x^2-2x+3$', box: [-1.8, 4.2, -0.6, 8.8], s0: -3.2, s1: 5.2, f: x => x * x - 2 * x + 3, d: () => true,
      dt: 'R', rt: '[2, +∞)', how: '配方法：$(x-1)^2+2\\ge 2$',
      end: '顶点 (1, 2) 是最低点 —— 配方法直接算出下界，扫描只负责验证',
      marks: [[1, 2, '顶点 (1,2)']] },
    { name: '② $\\sqrt{x+2}$', box: [-2.3, 7.5, -0.9, 3.4], s0: -2, s1: 7.4, f: x => Math.sqrt(x + 2), d: x => x >= -2 - 1e-9,
      dt: '[−2, +∞)', rt: '[0, +∞)', how: '根号管定义域下界，根号值 $\\ge 0$ 管值域下界',
      end: 'x 从 −2 出发：根号同时限定了定义域与值域的下界',
      marks: [[-2, 0, '起点 (−2,0)']] },
    { name: '③ $\\dfrac{1}{x^2+1}$', box: [-3.5, 3.5, -0.5, 1.7], s0: -3.7, s1: 3.7, f: x => 1 / (x * x + 1), d: () => true,
      dt: 'R', rt: '(0, 1]', how: '观察法：分母 $\\ge 1$ → $0<y\\le 1$',
      end: '金带始终刷不到 0 —— 值域的下界可以无限接近、却始终取不到',
      marks: [[0, 1, '(0,1) 最大']], asy: [{ h: 0 }] },
    { name: '④ $\\dfrac{1}{x-1}$', box: [-2.2, 4.2, -4.6, 4.6], s0: -3.4, s1: 5.4, f: x => 1 / (x - 1), d: x => Math.abs(x - 1) > 1e-6,
      dt: '{x | x ≠ 1}', rt: '{y | y ≠ 0}', how: '分母管定义域；反解 $x=1+\\dfrac{1}{y}$ → $y\\ne 0$',
      end: 'x 越过 1 时扫描点从 −∞ 侧跳到 +∞ 侧 —— 0 恰是整个值域唯一的缺口',
      marks: [], asy: [{ v: 1 }, { h: 0 }] },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, x: PRESETS[0].s0, min: Infinity, max: -Infinity, done: false, auto: false, grid: true, labs: true, asym: true };
  const cDom = B.chip('定义域'), cVal = B.chip('f(x)'), cRg = B.chip('值域'), cHow = B.chipM('求法');

  /** 采样画曲线：定义域断开 / 出屏处自动抬笔；特殊点 x 值为必采锚点（② 的起点 (−2,0)、③ 的最高点 (0,1) 要精确采到） */
  function plot(P, at, upTo) {
    const M = MAPS[st.p];
    const lim = upTo ?? M.X1;
    const xs = [];
    for (let x = M.X0; x <= lim + 0.001; x += 0.05) xs.push(x);
    for (const [mx] of P.marks) if (mx > M.X0 && mx <= lim) xs.push(mx);
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
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.05) xs.push(x);
    for (const [mx] of P.marks) if (mx > M.X0 && mx < M.X1) xs.push(mx);
    xs.sort((p, q) => p - q);
    const segs = []; let run = null, prev = null;
    for (const x of xs) {
      const ok = x <= M.X1 && P.d(x);
      if (ok && run == null) run = x;
      else if (!ok && run != null) { segs.push([run, prev]); run = null; }
      prev = x;
    }
    if (run != null) segs.push([run, M.X1]);
    for (const [a, b] of segs) B.seg(V(M.px(a), M.py(0)), V(M.px(b), M.py(0)), { stroke: '#4ade80', 'stroke-width': 8, 'stroke-opacity': .8 });
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { px, py, X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym && P.asy) B.asym(M, P.asy);
    domBand(P);
    // 值域金带：压在 y 轴上，从已见 min 刷到 max —— 值域的投影就住在 y 轴上
    if (st.min < st.max) {
      const lo = Math.max(Y0, st.min), hi = Math.min(Y1, st.max);
      if (lo < hi) B.seg(V(px(0), py(lo)), V(px(0), py(hi)), { stroke: '#ffd166', 'stroke-width': 8, 'stroke-opacity': .8 });
    }
    // 曲线：未扫部分淡蓝，已扫部分金色叠上；特殊点金点 + 小标
    plot(P, { stroke: '#5cadff', 'stroke-width': 2, 'stroke-opacity': .55 });
    swept(P);
    for (const [mx, my, mt] of P.marks) {
      B.dot(V(px(mx), py(my)), 4.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.text(V(px(mx) + 14, py(my) - 10), mt, { 'font-size': 11, fill: '#ffd166', 'text-anchor': 'start' });
    }
    // 扫描线 + 扫描点 + 投影虚线
    if (P.d(st.x)) {
      const y = P.f(st.x);
      B.seg(V(px(st.x), py(Y1)), V(px(st.x), py(Y0)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .8 });
      if (y > Y0 && y < Y1) {
        B.dot(V(px(st.x), py(y)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
        B.seg(V(px(st.x), py(y)), V(px(0), py(y)), { stroke: '#ffd166', 'stroke-dasharray': '4 4', 'stroke-opacity': .7 });
        B.dot(V(px(0), py(y)), 4, { fill: '#ffd166' });
        B.text(V(px(st.x), py(y) - 12), `(${st.x.toFixed(1)}, ${y.toFixed(2)})`, { 'font-size': 11, fill: '#ffd166' });
      }
    }
    // 徽章
    cDom(P.dt, 'ok');
    const inView = P.d(st.x) && P.f(st.x) > Y0 && P.f(st.x) < Y1;
    cVal(inView ? `f(${st.x.toFixed(2)}) = ${P.f(st.x).toFixed(3)}` : (P.d(st.x) ? `f(${st.x.toFixed(2)}) 越出视野` : `x=${st.x.toFixed(2)} 不在定义域内`), P.d(st.x) ? '' : 'warn');
    cRg(st.done ? `理论值域 ${P.rt}` : (st.min < st.max ? `已扫出 y∈[${Math.max(Y0, st.min).toFixed(2)}, ${Math.min(Y1, st.max).toFixed(2)}]（屏内所见）` : '拖「扫描 x」或按 ▶ 自动扫描'), st.done ? 'ok' : '');
    cHow(P.how, '');
    if (st.done) B.text(V(70, 76), '· 扫描点评：' + P.end, { 'font-size': 12.5, fill: '#4ade80', 'text-anchor': 'start' });
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i; st.min = Infinity; st.max = -Infinity; st.done = false;
    st.x = p.d(p.s0) ? p.s0 : p.s0 + 0.1;   // ② 从定义域起点 −2 出发
    sl.setAttribute('min', p.s0); sl.setAttribute('max', p.s1); sl.sync(st.x);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const sl = B.slider('扫描 x', PRESETS[0].s0, PRESETS[0].s1, 0.02, PRESETS[0].s0, v => {
    st.x = v;
    const P = PRESETS[st.p];
    if (P.d(v)) { const y = P.f(v); st.min = Math.min(st.min, y); st.max = Math.max(st.max, y); }
    if (v >= P.s1 - 0.02) st.done = true;
    B.render();
  });
  let autoBtn = null;
  autoBtn = B.toggleBtn('▶ 自动扫描', false, on => {
    st.auto = on;
    if (!on) return;
    const P = PRESETS[st.p], t0 = performance.now();
    const step = () => {
      if (!st.auto) return;
      const t = (performance.now() - t0) / 6000;               // 6 秒扫完一轮
      const v = P.s0 + (P.s1 - P.s0) * Math.min(t, 1);
      sl.sync(v);
      st.x = v;
      for (let u = Math.max(P.s0, v - 0.06); u <= v; u += 0.02) if (P.d(u)) { const y = P.f(u); st.min = Math.min(st.min, y); st.max = Math.max(st.max, y); }
      if (t >= 1) { st.auto = false; st.done = true; autoBtn.set(false); B.render(); return; }
      B.render();
      B.raf(step);
    };
    B.raf(step);
  });
  B.graphToggles(st);
  B.hint('拖「扫描 x」或按 ▶ 自动扫描：扫描点把 f(x) 投影到 y 轴，读出已取到的值域');
  B.render();
  return B;
}
