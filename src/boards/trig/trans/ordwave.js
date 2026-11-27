/* 图 F2 变序分波机：从 sin x 到 sin(2x+π/3) 的两条路 —— 甲「先压缩后平移」（压缩到 1/2 后平移 π/6）、
   乙「先平移后压缩」（平移 π/3 后压缩到 1/2）。t 演算双路同时走：t=1 中间产物分离（甲 sin2x、乙 sin(x+π/3)）、
   t=2 两路得出同一结果 —— 顺序不同、平移量不同、终点相同。
   由图反演模式：🎯 出题给金线，峰高定 A、峰距定 T、升段零点定 φ（G3 orderlab 的三角版）。 */
import { TrigLegendBoard, angleTex, piTick } from '../trig-board.js';
import { V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 860, 520, 90);
  const m = B.isoFit(-1.0, TAU + 0.6, -2.6, 2.6, B.plotRect);
  const POOL = [
    { A: 2, w: 2, f: Math.PI / 3, ans: '2\\sin\\bigl(2x+\\tfrac{\\pi}{3}\\bigr)' },
    { A: 1, w: 1, f: -Math.PI / 2, ans: '\\sin\\bigl(x-\\tfrac{\\pi}{2}\\bigr)' },
    { A: 1.5, w: 2, f: 0, ans: '1.5\\sin 2x' },
    { A: 1, w: 2, f: -Math.PI / 3, ans: '\\sin\\bigl(2x-\\tfrac{\\pi}{3}\\bigr)' },
  ];
  const st = { mode: 0, t: 0, anim: false, qi: 0, A: 1, w: 1, f: 0, grid: true, labs: true };
  B.choiceRow('显示方式', [{ name: '顺序分离' }, { name: '由图反演' }], () => st.mode, i => {
    st.mode = i; st.anim = false; syncVis(); B.render();
  });
  const bPlay = B.btn('⏵ 演算', () => {
    if (st.anim) { st.anim = false; B.render(); }
    else { if (st.t >= 1.999) st.t = 0; st.anim = true; tick(); }
  });
  B.graphToggles(st, ['grid', 'labs']);
  const bQuiz = B.btn('换一题', () => { st.qi = (st.qi + 1) % POOL.length; B.render(); });
  const sT = B.slider('演算 t', 0, 2, 0.01, 0, v => { st.t = v; st.anim = false; B.render(); }, undefined, (_, v) => `$t=${fmt(v, 2)}$`);
  const sA = B.slider('振幅 A', 0.5, 2, 0.25, 1, v => { st.A = v; B.render(); }, undefined, (_, v) => `$A=${fmt(v, 2)}$`);
  const sw = B.slider('角频率 ω', 0.5, 2, 0.5, 1, v => { st.w = v; B.render(); }, undefined, (_, v) => `$\\omega=${fmt(v, 2)}$`);
  const sf = B.slider('相位 φ', -Math.PI, Math.PI, Math.PI / 12, 0, v => { st.f = v; B.render(); }, undefined, (_, v) => `$\\varphi=${angleTex(v)}$`);
  const rowOf = s => s.parent || s.parentElement;   // 滑块行（label）：mock 走 .parent、DOM 走 .parentElement
  function syncVis() {
    rowOf(sT).style.display = st.mode === 0 ? '' : 'none';
    bPlay.style.display = st.mode === 0 ? '' : 'none';
    [sA, sw, sf].forEach(s => { rowOf(s).style.display = st.mode === 1 ? '' : 'none'; });
    bQuiz.style.display = st.mode === 1 ? '' : 'none';
  }
  syncVis();
  const cA = B.readout('实线', 'blue'), cE = B.readout('对照', 'gold'), cV = B.chipM('核验'), cTip = B.chipM('提示');

  function wave(A, w, f, color, dash = '') {
    const x0 = -f / w, step = Math.PI / (2 * w), anchors = [];
    for (let k = Math.ceil((m.X0 - x0) / step); x0 + k * step <= m.X1; k++) anchors.push(x0 + k * step);
    B.plot(x => A * Math.sin(w * x + f), m, { n: 420, anchors, stroke: color, 'stroke-width': 2.2, 'stroke-dasharray': dash });
  }
  const texS = f => Math.abs(f) < 1e-7 ? '' : (f > 0 ? '+' : '-') + angleTex(Math.abs(f));
  function tick() {
    if (!st.anim) return;
    st.t = Math.min(2, st.t + 0.01);
    if (st.t >= 2) st.anim = false;
    sT.sync(st.t);
    B.render();
    if (st.t < 2) B.raf(tick);
  }

  B.renderFn = () => {
    bPlay.classList.toggle('on', st.anim);
    B.grid({ ...m, sx: Math.PI / 2, sy: 1, lx: Math.PI / 2, ly: 1, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = -2; k <= 6; k++) {
      const v = k * Math.PI / 2;
      if (v > m.X0 + 0.01 && v < m.X1 - 0.01) B.text(V(m.px(v), m.py(0) + 16), piTick(v), { 'font-size': 11, fill: '#5c6a80' });
    }
    if (st.mode === 0) {
      const t = st.t;
      const w1 = 1 + Math.min(t, 1), f1 = Math.max(0, t - 1) * (Math.PI / 3);   // 甲：先压（ω:1→2）后平移（φ:0→π/3，实际平移 π/6）
      const f2 = Math.min(t, 1) * (Math.PI / 3), w2 = 1 + Math.max(0, t - 1);   // 乙：先平移（φ:0→π/3）后压缩（ω:1→2）
      wave(1, 1, 0, '#93a1b5', '3 5');
      wave(1, 2, Math.PI / 3, '#ffd166', '2 6');
      wave(1, w1, f1, '#5cadff');
      wave(1, w2, f2, '#ff9e4a', '8 6');
      B.mark(V(m.px(-f1 / w1), m.py(0)), '#5cadff');
      B.mark(V(m.px(-f2 / w2), m.py(0)), '#ff9e4a');
      B.note('母波 $\\sin x$', '#93a1b5', 'dashed');
      B.note('甲 · 先压缩', '#5cadff');
      B.note('乙 · 先平移', '#ff9e4a', 'dashed');
      B.note('目标 $\\sin(2x+\\pi/3)$', '#ffd166', 'dotted');
      cA(`$y=\\sin(${fmt(w1, 2)}x${texS(f1)})$`);
      cE(`$y=\\sin(${fmt(w2, 2)}x${texS(f2)})$`);
      if (t === 2) cV(`两路得出同一结果：$\\sin\\bigl(2x+\\tfrac{\\pi}{3}\\bigr)$`, 'ok');
      else if (Math.abs(t - 1) < 1e-8) cV('$t=1$ 时中间形态分离：甲停在 $\\sin 2x$、乙停在 $\\sin\\bigl(x+\\tfrac{\\pi}{3}\\bigr)$');
      else cV(`$t=${fmt(t, 2)}$：两路各自演算中`);
      cTip('甲压缩后向左移 $\\pi/6$。乙先向左移 $\\pi/3$，压缩时这段位移也减半。');
    } else {
      const q = POOL[st.qi];
      wave(q.A, q.w, q.f, '#ffd166', '8 6');
      wave(st.A, st.w, st.f, '#5cadff');
      B.mark(V(m.px((Math.PI / 2 - st.f) / st.w), m.py(st.A)), '#5cadff');
      B.mark(V(m.px((Math.PI / 2 - q.f) / q.w), m.py(q.A)), '#ffd166');
      B.note('试配曲线', '#5cadff'); B.note('题目曲线', '#ffd166', 'dashed');
      let d = 0;
      for (let i = 0; i <= 60; i++) {
        const u = m.X0 + (m.X1 - m.X0) * i / 60;
        d = Math.max(d, Math.abs(q.A * Math.sin(q.w * u + q.f) - st.A * Math.sin(st.w * u + st.f)));
      }
      cA(`$y=${+fmt(st.A,2) === 1 ? '' : +fmt(st.A,2)}\\sin(${st.w === 1 ? '' : st.w}x${texS(st.f)})$`);
      cE(`第 ${st.qi + 1} / ${POOL.length} 题`);
      const match = Math.abs(st.A - q.A) < 1e-7 && Math.abs(st.w - q.w) < 1e-7 && Math.abs(Math.sin((st.f - q.f) / 2)) < 1e-7;
      if (match) cV(`两条曲线重合，$y=${q.ans}$`, 'ok');
      else cV(`采样点的最大高度差约为 $${fmt(d, 2)}$`);
      cTip('读峰高定 $A$，量相邻峰距定周期 $T$，再用上升零点确定相位。');
    }
  };
  B.render();
  return B;
}
