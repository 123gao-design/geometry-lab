/* 图 W3 正切断口机：tan=sin/cos（U2 商数关系）—— cos=0 处排除成断口（竖直渐近线 B.asym）、断笔成支永不连线；
   每支 −∞→+∞ 单调升；相邻两支平移 π 完全重合 —— 周期只有 π（I1 的 π+α 组：tan(π+α)=tan α）。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { x0: Math.PI / 6, per: true, asy: true, grid: true, labs: true };
  B.toggleBtn('周期 π', true, v => { st.per = v; B.render(); });
  B.graphToggles(st, ['asy', 'grid', 'labs']);
  const xSl = B.slider('x₀', -4.8, 4.8, 0.01, st.x0, v => { st.x0 = v; B.render(); });
  const cX = B.chip('x₀'), cT = B.chipM('tan x₀'), cP = B.chipM('周期核验'), cV = B.chip('判读');

  /** π/2 整数倍 → '-3π/2 / -π / -π/2 / 0 / π/2 / π / 3π/2 / 2π / 5π/2…' */
  function piLab(v) {
    const k = Math.round(v / (Math.PI / 2));
    if (k === 0) return '0';
    const n = Math.abs(k), s = k % 2 ? (n === 1 ? 'π/2' : n + 'π/2') : (n === 2 ? 'π' : (n / 2) + 'π');
    return (k < 0 ? '-' : '') + s;
  }
  /** tan 曲线：线性 + π/2 倍数锚点，无定义或出框处断笔成支（渐近线两侧各成一支） */
  function plotTan(m, color, w) {
    const xs = [];
    const N = 560, dx = (m.X1 - m.X0) / N;
    for (let i = 0; i <= N; i++) xs.push(m.X0 + i * dx);
    for (let k = -3; k <= 5; k++) { const v = k * Math.PI / 2; if (v > m.X0 && v < m.X1) xs.push(v); }
    xs.sort((a, b) => a - b);
    let run = [];
    const flush = () => { if (run.length > 1) mk('polyline', { points: run.join(' '), fill: 'none', stroke: color, 'stroke-width': w }, B.dyn); run = []; };
    for (const x of xs) {
      const y = Math.tan(x);
      if (Number.isFinite(y) && Math.abs(y) <= m.Y1 + 1.2) run.push(`${m.px(x).toFixed(1)},${m.py(y).toFixed(1)}`);
      else flush();
    }
    flush();
  }

  B.renderFn = () => {
    const x0 = st.x0, c = Math.cos(x0), t = c === 0 ? Infinity : Math.sin(x0) / c;
    const m = B.isoFit(-3 * Math.PI / 2, 5 * Math.PI / 2, -4, 4);
    B.grid({ ...m, sx: Math.PI / 2, sy: 1, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = -3; k <= 5; k++)
      B.text(V(m.px(k * Math.PI / 2), m.py(0) + 15), piLab(k * Math.PI / 2), { 'font-size': 11, fill: '#5c6a80' });
    if (st.asy) { // 断口 = 竖直渐近线：x = π/2 + kπ（cos=0 排除处）
      const asy = [];
      for (let k = -2; k <= 2; k++) { const v = Math.PI / 2 + k * Math.PI; if (v > m.X0 + 1e-9 && v < m.X1 - 1e-9) asy.push({ v, t: 'x=' + piLab(v) }); }
      B.asym(m, asy);
    }
    plotTan(m, '#67e8f9', 2.2);
    for (let k = -1; k <= 2; k++) B.dot(V(m.px(k * Math.PI), m.py(0)), 3, { fill: '#ffd166' }); // 零点 kπ
    B.tex(V(m.px(m.X0) + 12, m.py(3.7)), '$y=\\tan x$', { size: 14, color: '#67e8f9', anchor: 'start', w: 150 });
    if (st.per && Number.isFinite(t) && Math.abs(t) <= m.Y1 + 1.2) { // 周期 π：两点恒等高（平移验收）
      const p1 = V(m.px(x0), m.py(t)), p2 = V(m.px(x0 + Math.PI), m.py(t));
      B.seg(p1, p2, { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '6 5' });
      B.dot(p1, 4.5, { fill: '#ffd166' });
      B.dot(p2, 4.5, { fill: '#ffd166' });
      B.text(V((p1.x + p2.x) / 2, p1.y - 10), '平移 π：完全重合', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'middle' });
    }
    // 探针
    B.seg(V(m.px(x0), m.py(m.Y0)), V(m.px(x0), m.py(m.Y1)), { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });
    if (Number.isFinite(t) && Math.abs(t) <= m.Y1 + 1.2) B.dot(V(m.px(x0), m.py(t)), 5, { fill: '#67e8f9' });
    // chips
    cX(`${fmt(x0, 3)} rad ≈ ${fmt(x0 * 180 / Math.PI, 1)}°`);
    if (Math.abs(c) < 1e-9) { cT('无定义（cos x₀ = 0 —— 断口）', 'warn'); cP('断口处周期无法核验', 'warn'); }
    else if (Math.abs(t) > 999) { cT('溢出（→∞）—— 逼近断口', 'warn'); cP('两侧各自冲向 ±∞', 'warn'); }
    else {
      cT(`$\\tan x_0=${fmt(t, 3)}$`);
      cP(`$\\tan(x_0+\\pi)=${fmt(Math.tan(x0 + Math.PI), 3)}=\\tan x_0$`, Math.abs(Math.tan(x0 + Math.PI) - t) < 1e-6 ? 'ok' : 'warn');
    }
    cV(Math.abs(c) < 0.04
      ? '逼近断口：左右两支各自奔向 −∞ 与 +∞，中间永不连线'
      : '断口 x=π/2+kπ（cos=0 排除处）；每支 −∞→+∞ 单调升；相邻两支平移 π 全同 —— 周期 π；奇函数：绕原点转半圈重合');
  };
  B.render();
  B.hintM('拖 $x_0$：两金点恒等高 —— $\\tan(x_0+\\pi)=\\tan x_0$ 周期 $\\pi$；断口处断笔成支，永不连线');
  return B;
}
