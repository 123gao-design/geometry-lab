/* 图 R3 · 二分显微镜：二分法 —— 只要「连续 + 端点异号」，区间对半，误差每步减半
   左栏全景（金带 = 当前异号区间），右栏显微镜（自动放大当前区间，看中点 m 与 f(m) 的符号判定）。
   ① 二分求出 √2（x²−2，区间 [1,2]）；② R1 ② 的无理根（x³−3x+1）；③ R2 ④ 的唯一零点（x³+x−1）。
   ▶ 二分一步 / ⏩ 连续二分 / ⟲ 重来 / 精度 ε 滑块 —— n 步后宽 = 初始宽 × 2⁻ⁿ（对数收敛，稳但不快）。
   图象规范：双面板各传各的 rect 给 B.isoFit；公式一律 B.tex/btnM/chipM；网格 / 轴标注 两开关；端点与零点为必采锚点。 */
import { V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);

  // a/b 初始异号区间；zero 真零点（灰点，显微镜里看金中点怎么贴近它）
  const PRESETS = [
    { name: '① $x^2-2$ 求根号2', eq: '目标：二分求出 $\\sqrt{2}$ —— $f(x)=x^2-2$，区间 $[1,2]$',
      f: x => x * x - 2, a: 1, b: 2, zero: Math.SQRT2, box: [-0.4, 2.8, -1.4, 3.2] },
    { name: '② $x^3-3x+1$', eq: 'R1 ② 的无理根：$f(x)=x^3-3x+1$，区间 $[0,1]$',
      f: x => x * x * x - 3 * x + 1, a: 0, b: 1, zero: 0.34729636, box: [-0.5, 1.5, -1.5, 1.5] },
    { name: '③ $x^3+x-1$', eq: 'R2 ④ 的唯一零点：$f(x)=x^3+x-1$，区间 $[0,1]$',
      f: x => x * x * x + x - 1, a: 0, b: 1, zero: 0.68232780, box: [-0.5, 1.5, -1.4, 1.4] },
  ];
  const LMAPS = PRESETS.map(P => B.isoFit(...P.box, [20, 45, 390, 455], 20));
  const st = { p: 0, a: 1, b: 2, n: 0, last: null, hit: null, eps: 0.05, grid: true, labs: true };
  const cI = B.chipM('当前区间'), cM = B.chipM('中点判定'), cN = B.chipM('步数'), cV = B.chipM('判定');

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
    if (Math.abs(fm) < 1e-12) { st.hit = m; keep = 'H'; }
    else if (fa * fm < 0) { st.b = m; keep = 'L'; }
    else { st.a = m; keep = 'R'; }
    st.n++;
    st.last = { m, fm, keep, same: fa * fm > 0 };
  }
  function reset() { const P = PRESETS[st.p]; st.a = P.a; st.b = P.b; st.n = 0; st.last = null; st.hit = null; }

  /** 必采锚点：真零点、当前区间端点、上一步中点 */
  const anc = () => { const P = PRESETS[st.p];
    return [P.zero, st.a, st.b, st.last ? st.last.m : null].filter(u => u != null); };

  B.renderFn = () => {
    const P = PRESETS[st.p], M = LMAPS[st.p];
    const px = x => M.px(x), py = y => M.py(y);
    const w = st.b - st.a, w0 = P.b - P.a;
    B.seg(V(430, 30), V(430, 500), { stroke: '#2e3d57', 'stroke-width': 1.2 });
    B.text(V(35, 29), '原图区间', { 'text-anchor': 'start', fill: '#93a1b5' });
    B.text(V(465, 29), '当前区间放大', { 'text-anchor': 'start', fill: '#93a1b5' });
    // ── 左栏：全景 ──
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.note(P.eq, '#93a1b5');
    B.plot(P.f, M, { anchors: anc(), n: 140, stroke: '#5cadff', 'stroke-width': 2.2 });
    B.dot(V(px(P.zero), py(0)), 4, { fill: '#93a1b5' });
    B.seg(V(px(st.a), py(0)), V(px(st.b), py(0)), { stroke: '#ffd166', 'stroke-width': 5, 'stroke-opacity': .55, 'stroke-linecap': 'butt' });
    B.note('左图 · 完整区间，金线标出保留范围', '#ffd166');
    // ── 右栏：显微镜（放大当前区间）──
    const pad = Math.max(0.08, w * 0.5);
    const xa = st.a - pad, xb = st.b + pad;
    let ymin = 1e9, ymax = -1e9;
    for (let i = 0; i <= 40; i++) { const y = P.f(xa + (xb - xa) * i / 40); ymin = Math.min(ymin, y); ymax = Math.max(ymax, y); }
    const ypad = Math.max((ymax - ymin) * 0.18, 0.12);
    const R = B.mapFit(xa, xb, ymin - ypad, ymax + ypad, [450, 45, 390, 455], 20);
    const rx = x => R.px(x), ry = y => R.py(y);
    B.grid({ ...R, sx: nice(xb - xa), sy: nice(ymax - ymin + 2 * ypad), grid: st.grid, labs: st.labs });
    B.note('右图 · 当前区间放大', '#5cadff');
    B.plot(P.f, R, { dom: x => x >= xa - 1e-9 && x <= xb + 1e-9, anchors: anc(), n: 140, stroke: '#5cadff', 'stroke-width': 2.2 });
    B.dot(V(rx(P.zero), ry(0)), 4, { fill: '#93a1b5' });
    B.seg(V(rx(st.a), ry(R.Y0)), V(rx(st.a), ry(R.Y1)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .6 });
    B.seg(V(rx(st.b), ry(R.Y0)), V(rx(st.b), ry(R.Y1)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .6 });
    if (st.last) {
      const { m, fm } = st.last;
      B.seg(V(rx(m), ry(R.Y0)), V(rx(m), ry(R.Y1)), { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '6 5' });
      if (fm > R.Y0 && fm < R.Y1) {
        B.dot(V(rx(m), ry(fm)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
      }
    }
    // 徽章
    const need = w > st.eps ? Math.ceil(Math.log2(w / st.eps)) : 0;
    cI(`[$${fmt(st.a, 4)}$, ${fmt(st.b, 4)}$]`, '');
    cM(st.last ? `m=${fmt(st.last.m, 4)}，$f(m)=${fmt(st.last.fm, 4)}$ —— ${st.last.keep === 'H' ? '恰好命中，零点就是 m'
      : st.last.same ? '与 f(a) 同号 → 零点在右半，留 [m, b]'
      : '与 f(a) 异号 → 零点在左半，留 [a, m]'}` : '按「二分一步」开始判定', st.last && st.last.keep === 'H' ? 'ok' : '');
    cN(`第 ${st.n} 步：宽 $${fmt(w0, 2)}\\times 2^{-${st.n}}=${fmt(w, 4)}$（ε=${fmt(st.eps, 3)}，还差约 ${need} 步）`, '');
    if (st.hit != null) cV(`恰好命中：$f(m)=0$，零点就是 $m=${fmt(st.hit, 4)}$`, 'ok');
    else if (w <= st.eps) cV(`达标：宽 ≤ ε —— 取中点当零点 $m=${fmt((st.a + st.b) / 2, 4)}$，误差 ≤ 宽/2 $=${fmt(w / 2, 4)}$`, 'ok');
    else if (st.n === 0) cV('开局先验异号：$f(a)f(b)<0$ 才能进行 —— R2 的定理提供了这一保证', '');
    else cV('继续二分 —— 右栏显微镜正放大当前区间，金线（中点）一步步逼近灰点（真零点）', '');
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i; reset();
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.btnM('二分一步', () => { if (st.hit == null) { doStep(); B.render(); } }, { pri: true });
  B.btnM('⟲ 重来', () => { reset(); B.render(); });
  let autoOn = false, tick = 0;
  const autoBtn = B.toggleBtn('⏩ 连续二分', false, on => { autoOn = on; if (on) B.raf(autoTick); });
  const autoTick = () => {
    if (!autoOn) return;
    if (++tick % 25 === 0) {
      if (st.hit == null && st.b - st.a > st.eps) doStep();
      else { autoOn = false; autoBtn.set(false); }
      B.render();
    }
    B.raf(autoTick);
  };
  B.slider('精度 ε', 0.005, 0.4, 0.005, 0.05, v => { st.eps = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint("点「二分一步」，比较每次保留的区间和中点的符号。");
  B.render();
  return B;
}
