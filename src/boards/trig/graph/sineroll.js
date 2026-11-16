/* 图 W1 正弦滚动展开机：左单位圆、右坐标纸，两幅共用同一比例尺（圆半径 = 纸的比例尺）——
   拖 P 或 ⏵ 滚动，纵坐标 MP 沿水平金虚线被逐点「摊」到右纸上，(α, sin α) 连成正弦波。
   五点法骨架：五点一档「升、峰、降、谷、升」；网格/标注/五点三开关。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  // 右幅先取景：x∈[0,2π]、y∈[−1.7,1.7]；左圆半径 R=比例尺、圆心与纸的零线等高 → P 与曲线上点恒等高
  const m = B.isoFit(0, TAU, -1.7, 1.7, [320, 40, 500, 440]);
  const R = m.s, O = V(150, m.py(0));
  const st = { a: Math.PI / 6, anim: false, five: true, grid: true, labs: true };

  const cA = B.chip('角 α'), cS = B.chipM('sin α'), cF = B.chip('五点判读');
  B.btn('⏵ 滚动', () => { st.anim = !st.anim; st.anim && tick(); });
  function tick() {
    if (!st.anim) return;
    st.a += 0.013;
    if (st.a > TAU) st.a -= TAU;
    B.render();
    B.raf(tick);
  }
  B.toggleBtn('五点', true, v => { st.five = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  [['π/6', Math.PI / 6], ['π/3', Math.PI / 3], ['π/2', Math.PI / 2]]
    .forEach(([lab, v]) => B.btn(lab, () => { st.a = v; B.render(); }));

  /** π/2 整数倍 → '0 / π/2 / π / 3π/2 / 2π …'（π 刻度用） */
  function piLab(v) {
    const k = Math.round(v / (Math.PI / 2));
    if (k === 0) return '0';
    const n = Math.abs(k), s = k % 2 ? (n === 1 ? 'π/2' : n + 'π/2') : (n === 2 ? 'π' : (n / 2) + 'π');
    return (k < 0 ? '-' : '') + s;
  }
  /** [x0,x1] 等分 n 段采样 + π/2 倍数锚点，映射到屏幕坐标 */
  function sam(x0, x1, n) {
    const xs = [];
    for (let i = 0; i <= n; i++) xs.push(x0 + (x1 - x0) * i / n);
    for (let k = 1; k <= 3; k++) { const v = k * Math.PI / 2; if (v > x0 && v < x1) xs.push(v); }
    xs.sort((a, b) => a - b);
    return xs.map(x => `${m.px(x).toFixed(1)},${m.py(Math.sin(x)).toFixed(1)}`);
  }
  function poly(pts, color, w, op) {
    if (pts.length < 2) return;
    const at = { points: pts.join(' '), fill: 'none', stroke: color, 'stroke-width': w };
    if (op) at['stroke-opacity'] = op;
    mk('polyline', at, B.dyn);
  }

  B.handle({
    get: () => V(O.x + R * Math.cos(st.a), O.y - R * Math.sin(st.a)),
    set: p => {
      const ang = Math.atan2(-(p.y - O.y), p.x - O.x);
      st.a = ((ang % TAU) + TAU) % TAU;   // 展开只讲 [0,2π] 一圈
      st.anim = false;
    },
    color: '#5cadff', r: 8, label: 'P', lo: [10, -10],
  });

  B.renderFn = () => {
    const a = st.a, sy = Math.sin(a);
    // ── 左：单位圆 + 半径 OP + 纵坐标 MP + 角 α 标记弧
    B.seg(V(30, O.y), V(305, O.y), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    B.seg(V(O.x, O.y - R - 26), V(O.x, O.y + R + 26), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#22314a', 'stroke-width': 1.8 }, B.dyn);
    const P = V(O.x + R * Math.cos(a), O.y - R * sy), Mp = V(P.x, O.y);
    mk('path', { d: `M${O.x + 26},${O.y} A26,26 0 ${a > Math.PI ? 1 : 0} 0 ${(O.x + 26 * Math.cos(a)).toFixed(1)},${(O.y - 26 * sy).toFixed(1)}`,
      fill: 'none', stroke: '#5c6a80', 'stroke-width': 1.4 }, B.dyn);
    B.text(V(O.x + 42 * Math.cos(a / 2), O.y - 42 * Math.sin(a / 2)), 'α', { 'font-size': 13, fill: '#93a1b5' });
    B.seg(O, P, { stroke: '#ffd166', 'stroke-width': 2.4 });
    B.seg(Mp, P, { stroke: '#5cadff', 'stroke-width': 3 });
    B.dot(P, 5.5, { fill: '#5cadff' });
    B.textM(V(P.x + (Math.cos(a) >= 0 ? 9 : -9), (P.y + Mp.y) / 2 + 4), '$MP=\\sin\\alpha$',
      { 'font-size': 11, fill: '#5cadff', 'text-anchor': Math.cos(a) >= 0 ? 'start' : 'end' });
    // ── 右：网格 + π 刻度（grid 印不了 π，自绘）+ 曲线
    B.grid({ ...m, sx: Math.PI / 2, sy: 0.5, ly: 0.5, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = 0; k <= 4; k++)
      B.text(V(m.px(k * Math.PI / 2), m.py(0) + 15), piLab(k * Math.PI / 2), { 'font-size': 11, fill: '#5c6a80' });
    poly(sam(0, TAU, 260), '#93a1b5', 1.6, .55);                       // 整条正弦（虚线）
    poly(sam(0, a, Math.max(30, Math.round(260 * a / TAU))), '#ffd166', 2.6);  // 已转过的一段（金色轨迹）
    if (st.five) for (let k = 0; k <= 4; k++) {                          // 五点骨架
      const fx = k * Math.PI / 2, fy = Math.sin(fx);
      B.seg(V(m.px(fx), m.py(0)), V(m.px(fx), m.py(fy)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4' });
      B.dot(V(m.px(fx), m.py(fy)), 3.4, { fill: '#ffd166' });
      if (st.labs) B.text(V(m.px(fx), m.py(fy) + (fy > 0.5 ? -12 : fy < -0.5 ? 18 : 16)),
        `(${piLab(fx)}, ${fy > 0.5 ? '1' : fy < -0.5 ? '-1' : '0'})`, { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' });
    }
    B.tex(V(m.px(m.X0) + 12, m.py(1.62)), '$y=\\sin x$', { size: 14, color: '#ffd166', anchor: 'start', w: 130 });
    // 摊平连线：P 与曲线上点 (α, sin α) 恒等高（左右幅共用比例尺）
    const Q = V(m.px(a), m.py(sy));
    B.seg(P, Q, { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .85 });
    B.dot(Q, 5, { fill: '#ffd166' });
    // chips
    cA(`${fmt(a, 3)} rad ≈ ${fmt(a * 180 / Math.PI, 1)}°`);
    cS(`$\\sin\\alpha=${fmt(sy, 3)}$`);
    cF(a <= Math.PI / 2 ? '本档 0→π/2：上坡（升）→ 峰 (π/2, 1)'
      : a <= Math.PI ? '本档 π/2→π：峰后下坡（降）→ 零点 (π, 0)'
      : a <= 3 * Math.PI / 2 ? '本档 π→3π/2：继续降 → 谷 (3π/2, −1)'
      : '本档 3π/2→2π：谷后上坡（升）→ 回到 (2π, 0)');
  };
  B.render();
  B.hintM('⏵ 滚动或拖 P：纵坐标 MP 被逐点摊到右纸 —— $(\\alpha,\\ \\sin\\alpha)$ 连成正弦波；五点一档，升峰降谷升');
  return B;
}
