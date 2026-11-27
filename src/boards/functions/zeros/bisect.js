/* 图 R3 · 二分显微镜：二分法 —— 只要「连续 + 端点异号」，区间对半，误差每步减半
   左栏全景（金带 = 当前异号区间），右栏显微镜（自动放大当前区间，看中点 m 与 f(m) 的符号判定）。
   ① 二分求出 √2（x²−2，区间 [1,2]）；② R1 ② 的无理根（x³−3x+1）；③ R2 ④ 的唯一零点（x³+x−1）。
   ▶ 二分一步 / ⏩ 连续二分 / ⟲ 重来 / 精度 ε 滑块 —— n 步后宽 = 初始宽 × 2⁻ⁿ（对数收敛，稳但不快）。
   图象规范：双面板各传各的 rect 给 B.isoFit；公式一律 B.tex/btnM/chipM；网格 / 轴标注 两开关；端点与零点为必采锚点。 */
import { V } from '../../../lib/board.js';
import { glowDot } from '../../../lib/conic-diagram.js';
import { presetRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);

  root.classList.add('zero-bisection');

  // a/b 初始异号区间；zero 真零点（灰点，显微镜里看金中点怎么贴近它）
  const PRESETS = [
    { name: '求平方根', short: '平方根', formula: '$x^2-2$', eq: '目标：二分求出 $\\sqrt{2}$ —— $f(x)=x^2-2$，区间 $[1,2]$',
      f: x => x * x - 2, a: 1, b: 2, zero: Math.SQRT2, box: [-0.4, 2.8, -1.4, 3.2] },
    { name: '三次函数', short: '三次函数', formula: '$x^3-3x+1$', eq: 'R1 ② 的无理根：$f(x)=x^3-3x+1$，区间 $[0,1]$',
      f: x => x * x * x - 3 * x + 1, a: 0, b: 1, zero: 2 * Math.cos(14 * Math.PI / 9), box: [-0.5, 1.5, -1.5, 1.5] },
    { name: '唯一零点', short: '唯一零点', formula: '$x^3+x-1$', eq: 'R2 ④ 的唯一零点：$f(x)=x^3+x-1$，区间 $[0,1]$',
      f: x => x * x * x + x - 1, a: 0, b: 1, zero: 0.6823278038280193, box: [-0.5, 1.5, -1.4, 1.4] },
  ];
  const LMAPS = PRESETS.map(P => B.isoFit(...P.box, [20, 45, 390, 455], 20));
  const st = { p: 0, a: 1, b: 2, n: 0, last: null, hit: null, eps: 0.05, grid: true, labs: true };
  const cI = B.readout('当前区间'), cM = B.readout('中点判定', 'gold'), cN = B.readout('步数', 'mint'), cV = B.chipM('判定');

  /** 放大镜网格步长：跨度/6 向上取「好数」 */
  const nice = span => {
    const t = span / 6;
    for (const s of [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1, 2, 5]) if (s >= t) return s;
    return 10;
  };

  /** 二分一步：中点判定，保留含变号的那半 */
  function doStep() {
    const P = PRESETS[st.p];
    const m = (st.a + st.b) / 2, fm = P.f(m), fa = P.f(st.a);
    let keep;
    if (m === st.a || m === st.b) return;
    if (fm === 0) { st.hit = m; keep = 'H'; }
    else if (fa * fm < 0) { st.b = m; keep = 'L'; }
    else { st.a = m; keep = 'R'; }
    st.n++;
    st.last = { m, fm, keep };
  }
  function reset() { const P = PRESETS[st.p]; st.a = P.a; st.b = P.b; st.n = 0; st.last = null; st.hit = null; }

  /** 必采锚点：真零点、当前区间端点、上一步中点 */
  const anc = () => { const P = PRESETS[st.p];
    return [P.zero, st.a, st.b, st.last ? st.last.m : null].filter(u => u != null); };

  B.renderFn = () => {
    const P = PRESETS[st.p], M = LMAPS[st.p];
    const px = x => M.px(x), py = y => M.py(y);
    const w = st.b - st.a;
    B.seg(V(430, 30), V(430, 500), { stroke: '#2e3d57', 'stroke-width': 1.2 });
    B.text(V(35, 29), '原图区间', { 'text-anchor': 'start', fill: '#93a1b5' });
    B.text(V(465, 29), '当前区间放大', { 'text-anchor': 'start', fill: '#93a1b5' });
    // ── 左栏：全景 ──
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.note(P.eq, '#93a1b5');
    B.plot(P.f, M, { anchors: anc(), n: 140, stroke: '#5cadff', 'stroke-width': 2.2 });
    B.seg(V(px(st.a), py(0)), V(px(st.b), py(0)), { stroke: '#ffd166', 'stroke-width': 5, 'stroke-opacity': .55, 'stroke-linecap': 'butt' });
    glowDot(B, V(px(P.zero), py(0)), B.diagramColors.mint, 7, 3.2);
    // ── 右栏：显微镜（放大当前区间）──
    const pad = Math.max(.00005, w * .5);
    const xa = st.a - pad, xb = st.b + pad;
    let ymin = 1e9, ymax = -1e9;
    for (let i = 0; i <= 40; i++) { const y = P.f(xa + (xb - xa) * i / 40); ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); }
    const ypad = Math.max((ymax - ymin) * .18, .00005);
    const R = B.mapFit(xa, xb, ymin - ypad, ymax + ypad, [450, 45, 390, 455], 20);
    const rx = x => R.px(x), ry = y => R.py(y);
    B.grid({ ...R, sx: nice(xb - xa), sy: nice(ymax - ymin + 2 * ypad), grid: st.grid, labs: st.labs });
    B.plot(P.f, R, { dom: x => x >= xa - 1e-9 && x <= xb + 1e-9, anchors: anc(), n: 140, stroke: '#5cadff', 'stroke-width': 2.2 });
    B.seg(V(rx(st.a), ry(0)), V(rx(st.b), ry(0)), { stroke: B.diagramColors.gold, 'stroke-width': 4, 'stroke-opacity': .6 });
    const m = (st.a + st.b) / 2;
    const checkX = st.last ? st.last.m : m;
    const checkY = P.f(checkX);
    for (const x of [st.a, st.b]) {
      B.seg(V(rx(x), ry(R.Y0)), V(rx(x), ry(R.Y1)), { stroke: B.diagramColors.rule, 'stroke-dasharray': '3 5' });
      if (x !== checkX) B.dot(V(rx(x), ry(P.f(x))), 3.4, { fill: B.diagramColors.blue });
    }
    B.seg(V(rx(checkX), ry(R.Y0)), V(rx(checkX), ry(R.Y1)), { stroke: B.diagramColors.gold, 'stroke-dasharray': '6 5' });
    if (Math.hypot(rx(P.zero)-rx(checkX), ry(0)-ry(checkY)) > 1)
      glowDot(B, V(rx(P.zero), ry(0)), B.diagramColors.mint, 7, 3.2);
    glowDot(B, V(rx(checkX), ry(checkY)), B.diagramColors.gold, 8, 3.8);

    const need = Math.max(0, Math.ceil(Math.log2(w / st.eps)));
    const display = v => {
      const rounded = Number(v.toPrecision(7));
      return (rounded === v ? '=' : '\\approx ') + rounded;
    };
    cI(`$a${display(st.a)}$，$b${display(st.b)}$`);
    const mid = `$m${display(checkX)}$，$f(m)${checkY === 0 ? '=' : checkY < 0 ? '<' : '>'}0$`;
    cM(st.last ? mid + ({ L: '，保留左半。', R: '，保留右半。', H: '，命中零点。' })[st.last.keep] : mid + '，等待二分。');
    cN(`$n=${st.n}$，区间宽 $w${display(w)}$，还需 $${need}$ 步。`);
    if (st.hit !== null) cV(`$f(m)=0$，零点为 $m${display(st.hit)}$。`, 'ok');
    else if (w <= st.eps) cV(`$w\\le\\varepsilon$。取当前中点 $c${display(m)}$，误差至多 $w/2$。`, 'ok');
    else cV(st.n ? '保留区间的端点仍异号，继续二分。' : '初始区间上函数连续，且 $f(a)f(b)<0$。');
  };

  let generation = 0;
  const auto = B.toggleBtn('连续二分', false, on => {
    const run = ++generation;
    if (!on) return;
    let next = performance.now() + 400;
    const tick = () => {
      if (run !== generation) return;
      if (st.hit !== null || st.b - st.a <= st.eps) { auto.set(false); return; }
      if (performance.now() >= next) {
        doStep(); B.render();
        next = performance.now() + 400;
      }
      B.raf(tick);
    };
    B.raf(tick);
  });
  B.btn('二分一步', () => { auto.set(false); if (st.hit === null) doStep(); B.render(); }, { pri: true });
  B.btn('重来', () => { auto.set(false); reset(); B.render(); });
  B.slider('精度 ε', .005, .4, .005, .05, v => { st.eps = v; B.render(); }, undefined, n => `精度 $\\varepsilon=${n}$`);
  B.graphToggles(st, ['grid', 'labs']);
  presetRow(B.ctrl, '选择二分法例题', PRESETS, i => {
    auto.set(false); st.p = i; reset(); B.render();
  });
  B.render();
  return B;
}
