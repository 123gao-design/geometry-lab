/* 图 F2 变序分波机：从 sin x 到 sin(2x+π/3) 的两条路 —— 甲「先压缩后平移」（压缩到 1/2 后平移 π/6）、
   乙「先平移后压缩」（平移 π/3 后压缩到 1/2）。t 演算双路同时走：t=1 中间产物分离（甲 sin2x、乙 sin(x+π/3)）、
   t=2 两路得出同一结果 —— 顺序不同、平移量不同、终点相同。
   由图反演模式：🎯 出题给金线，峰高定 A、峰距定 T、升段零点定 φ（G3 orderlab 的三角版）。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const m = B.isoFit(-1.0, TAU + 0.6, -2.6, 2.6);
  const POOL = [
    { A: 2, w: 2, f: Math.PI / 3, ans: '2\\sin\\bigl(2x+\\tfrac{\\pi}{3}\\bigr)' },
    { A: 1, w: 1, f: -Math.PI / 2, ans: '\\sin\\bigl(x-\\tfrac{\\pi}{2}\\bigr)' },
    { A: 1.5, w: 2, f: 0, ans: '1.5\\sin 2x' },
    { A: 1, w: 2, f: -Math.PI / 3, ans: '\\sin\\bigl(2x-\\tfrac{\\pi}{3}\\bigr)' },
  ];
  const st = { mode: 0, t: 0, anim: false, qi: 0, A: 1, w: 1, f: 0, grid: true, labs: true };
  const mBtns = [
    B.btnM('顺序分离', () => { st.mode = 0; st.anim = false; syncM(); syncVis(); B.render(); }, { on: true }),
    B.btnM('由图反演', () => { st.mode = 1; st.anim = false; syncM(); syncVis(); B.render(); }),
  ];
  function syncM() { mBtns.forEach((b, i) => b.classList.toggle('on', i === st.mode)); }
  const bPlay = B.btn('⏵ 演算', () => {
    if (st.anim) st.anim = false;
    else { if (st.t >= 1.999) st.t = 0; st.anim = true; tick(); }
  });
  B.graphToggles(st, ['grid', 'labs']);
  const bQuiz = B.btn('🎯 出题', () => { st.qi = (st.qi + 1) % POOL.length; B.render(); });
  const sT = B.slider('演算 t', 0, 2, 0.01, 0, v => { st.t = v; st.anim = false; B.render(); });
  const sA = B.slider('振幅 A', 0.5, 2, 0.25, 1, v => { st.A = v; B.render(); });
  const sw = B.slider('角频率 ω', 0.5, 2, 0.5, 1, v => { st.w = v; B.render(); });
  const sf = B.slider('相位 φ', -Math.PI, Math.PI, Math.PI / 12, 0, v => { st.f = v; B.render(); });
  const rowOf = s => s.parent || s.parentElement;   // 滑块行（label）：mock 走 .parent、DOM 走 .parentElement
  function syncVis() {
    rowOf(sT).style.display = st.mode === 0 ? '' : 'none';
    bPlay.style.display = st.mode === 0 ? '' : 'none';
    [sA, sw, sf].forEach(s => { rowOf(s).style.display = st.mode === 1 ? '' : 'none'; });
    bQuiz.style.display = st.mode === 1 ? '' : 'none';
  }
  syncVis();
  const cA = B.chipM('甲当前式'), cE = B.chipM('乙当前式'), cV = B.chipM('核验'), cTip = B.chip('提示');

  function piLab(v) {
    const k = Math.round(v / (Math.PI / 2));
    if (k === 0) return '0';
    const n = Math.abs(k), s = k % 2 ? (n === 1 ? 'π/2' : n + 'π/2') : (n === 2 ? 'π' : (n / 2) + 'π');
    return (k < 0 ? '-' : '') + s;
  }
  function sam(f, x0, x1, n) {
    const xs = [];
    for (let i = 0; i <= n; i++) xs.push(x0 + (x1 - x0) * i / n);
    for (let k = -2; k <= 6; k++) { const v = k * Math.PI / 2; if (v > x0 && v < x1) xs.push(v); }
    xs.sort((a, b) => a - b);
    return xs.map(x => `${m.px(x).toFixed(1)},${m.py(f(x)).toFixed(1)}`);
  }
  function poly(pts, color, w, op, dash) {
    if (pts.length < 2) return;
    const at = { points: pts.join(' '), fill: 'none', stroke: color, 'stroke-width': w };
    if (op) at['stroke-opacity'] = op;
    if (dash) at['stroke-dasharray'] = dash;
    mk('polyline', at, B.dyn);
  }
  const texS = f => Math.abs(f) < 1e-9 ? '' : (f > 0 ? '+' : '-') + fmt(Math.abs(f), 2);

  function tick() {
    if (!st.anim) return;
    st.t = Math.min(2, st.t + 0.01);
    if (st.t >= 2) st.anim = false;
    sT.sync(st.t);
    B.render();
    if (st.t < 2) B.raf(tick);
  }

  B.renderFn = () => {
    B.grid({ ...m, sx: Math.PI / 2, sy: 1, lx: Math.PI / 2, ly: 1, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = -2; k <= 6; k++) {
      const v = k * Math.PI / 2;
      if (v > m.X0 + 0.01 && v < m.X1 - 0.01) B.text(V(m.px(v), m.py(0) + 16), piLab(v), { 'font-size': 11, fill: '#5c6a80' });
    }
    if (st.mode === 0) {
      const t = st.t;
      const w1 = 1 + Math.min(t, 1), f1 = Math.max(0, t - 1) * (Math.PI / 3);   // 甲：先压（ω:1→2）后平移（φ:0→π/3，实际平移 π/6）
      const f2 = Math.min(t, 1) * (Math.PI / 3), w2 = 1 + Math.max(0, t - 1);   // 乙：先平移（φ:0→π/3）后压缩（ω:1→2）
      poly(sam(Math.sin, m.X0, m.X1, 420), '#93a1b5', 1.5, .45, '5 5');                       // 母波
      poly(sam(x => Math.sin(w1 * x + f1), m.X0, m.X1, 420), '#5cadff', 2.2);                 // 甲（蓝）
      poly(sam(x => Math.sin(w2 * x + f2), m.X0, m.X1, 420), '#ff9e4a', 2.2);                 // 乙（橙）
      poly(sam(x => Math.sin(2 * x + Math.PI / 3), m.X0, m.X1, 420), '#ffd166', 1.6, .85, '8 6'); // 目标（金虚）
      B.tex(V(m.px(m.X0) + 12, m.py(2.32)), '$y=\\sin\\bigl(2x+\\tfrac{\\pi}{3}\\bigr)$', { size: 14, color: '#ffd166', anchor: 'start', w: 260 });
      B.text(V(m.px(m.X0) + 14, m.py(1.98)), '甲 先压缩后平移：压缩后只平移 π/6', { 'font-size': 12, fill: '#5cadff', 'text-anchor': 'start' });
      B.text(V(m.px(m.X0) + 14, m.py(1.66)), '乙 先平移后压缩：先平移 π/3 再压缩', { 'font-size': 12, fill: '#ff9e4a', 'text-anchor': 'start' });
      cA(`$y=\\sin(${fmt(w1, 2)}x${texS(f1)})$`);
      cE(`$y=\\sin(${fmt(w2, 2)}x${texS(f2)})$`);
      if (t >= 1.98) cV(`两路得出同一结果：$\\sin\\bigl(2x+\\tfrac{\\pi}{3}\\bigr)$`, 'ok');
      else if (Math.abs(t - 1) < 0.02) cV('t=1 中间形态分离：甲停在 $\\sin 2x$、乙停在 $\\sin\\bigl(x+\\tfrac{\\pi}{3}\\bigr)$');
      else cV(`t=${fmt(t, 2)}：两路各自演算中`);
      cTip('甲先压缩后平移 π/6，乙先平移后压缩 π/3 —— 顺序不同、平移量不同、终点相同');
    } else {
      const q = POOL[st.qi];
      poly(sam(x => q.A * Math.sin(q.w * x + q.f), m.X0, m.X1, 420), '#ffd166', 2.2);          // 目标（金）
      poly(sam(x => st.A * Math.sin(st.w * x + st.f), m.X0, m.X1, 420), '#5cadff', 2.0, .85);   // 玩家（蓝）
      let d = 0;
      for (let i = 0; i <= 60; i++) {
        const u = m.X0 + (m.X1 - m.X0) * i / 60;
        d = Math.max(d, Math.abs(q.A * Math.sin(q.w * u + q.f) - st.A * Math.sin(st.w * u + st.f)));
      }
      B.text(V(m.px(m.X0) + 14, m.py(2.32)), `由图反演 · 第 ${st.qi + 1} 题（共 ${POOL.length} 题）：把蓝线贴上金线`, { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start' });
      cA('—');
      cE('—');
      if (d < 0.06) cV(`求解！$y=${q.ans}$`, 'ok');
      else cV(`最大偏差 ${fmt(d, 2)} —— 继续调整`, 'warn');
      cTip('① 峰高定 A；② 相邻峰距定 T → ω=2π/T；③ 升段过零点 x₀ → φ=−ωx₀');
    }
  };
  B.render();
  B.hint('⏵ 演算比较两条路径的中间结果与最终结果；切「由图反演」拖三滑块求解 —— 平移量全部显示在图上');
  return B;
}
