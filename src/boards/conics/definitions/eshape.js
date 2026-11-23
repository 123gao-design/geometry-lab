/* 图 D4c · 离心率塑形机：e 如何决定同族曲线的胖瘦
   椭圆：b/a = √(1−e²)（e=0 为圆，e→1 成针）；双曲线：b/a = √(e²−1)（渐近线张口） */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 460;
  const B = new Board(root, W, H);
  const st = { mode: 'e', compare: false, cx: 400, cy: 228, aE: 180, eE: 0.5, aH: 74, eH: 1.6 };
  const isE = () => st.mode === 'e';

  const cE = B.chip('离心率 e'), cBA = B.chip('b / a'), cShape = B.chip('几何特征');
  const sEE = B.slider('e（椭圆）', 0, 0.99, 0.01, st.eE, v => { st.eE = v; B.render(); });
  const sEH = B.slider('e（双曲线）', 1.05, 2.8, 0.01, st.eH, v => { st.eH = v; B.render(); });
  const compareSlider = B.slider('趋近 1 的 e', 0.9, 0.999, 0.001, 0.97, () => B.render());
  const syncSliders = () => {
    sEE.parentElement.style.display = isE() && !st.compare ? '' : 'none';
    sEH.parentElement.style.display = !isE() && !st.compare ? '' : 'none';
    compareSlider.parentElement.style.display = st.compare ? '' : 'none';
    hyperBtn.button.hidden = st.compare;
  };
  const hyperBtn = B.toggleBtn('双曲线模式', false, on => { st.mode = on ? 'h' : 'e'; syncSliders(); B.render(); });
  B.toggleBtn('对照 e → 1', false, on => { st.compare = on; syncSliders(); B.render(); });
  syncSliders();

  function drawComparison() {
    const e = Number(compareSlider.value);
    const d = 44, a = 128, xF = 242, xO = 596, y0 = 241;
    const scale = Math.sqrt(1 - e * e);
    const current = [], limit = [];
    const guide = { stroke: '#5c6a80', 'stroke-width': 1.5, 'stroke-dasharray': '6 6' };
    const curve = { fill: 'none', stroke: '#5cadff', 'stroke-width': 3 };
    B.seg(V(400, 55), V(400, 384), { stroke: '#22314a' });
    B.text(V(200, 66), '固定焦点与准线', { fill: '#aebdd2', 'font-weight': 700 });
    B.text(V(xO, 66), '固定椭圆长半轴 a', { fill: '#aebdd2', 'font-weight': 700 });
    B.seg(V(37, y0), V(367, y0), { stroke: '#22314a' });
    B.seg(V(434, y0), V(761, y0), { stroke: '#22314a' });
    for (let dy = -84; dy <= 84; dy += 2) {
      const q = dy * dy - (e * d) ** 2;
      const linear = e * e * d;
      const x = -q / (linear + Math.sqrt(linear * linear - scale * scale * q));
      current.push(`${xF + x},${y0 + dy}`);
      limit.push(`${xF + (d * d - dy * dy) / (2 * d)},${y0 + dy}`);
    }
    mk('polyline', { points: limit.join(' '), fill: 'none', ...guide }, B.dyn);
    mk('polyline', { points: current.join(' '), ...curve }, B.dyn);
    B.seg(V(xF + d, 129), V(xF + d, 354), guide);
    B.dot(V(xF, y0), 4, { fill: '#ffd166' });
    B.text(V(xF - 10, y0 + 19), 'F', { fill: '#ffd166' });
    B.text(V(xF + d + 12, 128), 'ℓ', { fill: '#93a1b5' });
    mk('ellipse', { cx: xO, cy: y0, rx: a, ry: a * scale, ...curve }, B.dyn);
    B.seg(V(xO - a, y0), V(xO + a, y0), guide);
    B.text(V(200, 385), '虚线表示极限抛物线', { fill: '#93a1b5' });
    B.text(V(xO, 385), '虚线表示极限线段', { fill: '#93a1b5' });
    cE(fmt(e, 3), 'ok');
    cBA(fmt(scale, 3));
    cShape('左图显示固定视窗内的近侧曲线');
    B.hint('两图取同一个 e，固定量决定极限形状');
  }

  B.renderFn = () => {
    if (st.compare) { drawComparison(); return; }
    const { cx, cy } = st;
    B.seg(V(24, cy), V(W - 24, cy), { stroke: '#22314a', 'stroke-width': 1.5 });
    B.seg(V(cx, 18), V(cx, H - 18), { stroke: '#22314a', 'stroke-width': 1.5 });

    if (isE()) {
      const a = st.aE, e = st.eE, c = a * e, b = a * Math.sqrt(1 - e * e);
      // 参照圆（e = 0 的形状）
      mk('circle', { cx, cy, r: a, fill: 'none', stroke: '#3a4a63', 'stroke-width': 1.4, 'stroke-dasharray': '6 6' }, B.dyn);
      // 椭圆
      mk('ellipse', { cx, cy, rx: a, ry: b, fill: '#5cadff', 'fill-opacity': .05,
        stroke: '#5cadff', 'stroke-width': 3 }, B.dyn);
      // 半轴 a、b 与焦点
      B.seg(V(cx, cy), V(cx + a, cy), { stroke: '#5c6a80', 'stroke-width': 2 });
      B.text(V(cx + a / 2, cy + 16), 'a（固定）', { fill: '#93a1b5', 'font-size': 12 });
      B.seg(V(cx, cy), V(cx, cy - b), { stroke: '#4ade80', 'stroke-width': 2.6 });
      B.text(V(cx + 12, cy - b / 2), 'b', { fill: '#4ade80', 'font-size': 13, 'text-anchor': 'start' });
      for (const s of [-1, 1]) {
        B.dot(V(cx + s * c, cy), 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
        B.text(V(cx + s * c, cy + (s < 0 ? -12 : 20)), s < 0 ? 'F₁' : 'F₂', { fill: '#ffd166', 'font-size': 12.5, 'font-weight': 700 });
      }
      B.dot(V(cx, cy), 3.5, { fill: '#93a1b5' });
      cE(`e = ${fmt(e, 2)}`, 'ok');
      cBA(`√(1−e²) = ${fmt(Math.sqrt(1 - e * e), 3)}`);
      cShape(e === 0 ? '两焦点重合于圆心' : '长半轴 a 固定');
      B.hint('a 固定时，e 越接近 1，短半轴 b 越小');
    } else {
      const a = st.aH, e = st.eH, c = a * e, b = a * Math.sqrt(e * e - 1);
      // 特征矩形（2a × 2b）与其对角线 = 渐近线
      mk('rect', { x: cx - a, y: cy - b, width: 2 * a, height: 2 * b, fill: 'none', stroke: '#5c6a80', 'stroke-width': 1.3, 'stroke-dasharray': '5 5' }, B.dyn);
      for (const dir of [V(a, b), V(a, -b)])
        B.inf(V(cx, cy), V(cx + dir.x, cy + dir.y), { stroke: '#3a4a63', 'stroke-width': 1.5, 'stroke-dasharray': '7 6' });
      // 双支
      for (const s of [1, -1]) {
        const pts = [];
        for (let t = -1.35; t <= 1.35 + 1e-9; t += 0.03)
          pts.push(`${(cx + s * a / Math.cos(t)).toFixed(1)},${(cy + b * Math.tan(t)).toFixed(1)}`);
        mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 3 }, B.dyn);
      }
      // 顶点、焦点
      for (const s of [-1, 1]) {
        B.dot(V(cx + s * a, cy), 4.5, { fill: '#fff' });
        B.text(V(cx + s * a, cy + 18), s < 0 ? 'A₁' : 'A₂', { fill: '#93a1b5', 'font-size': 12 });
        B.dot(V(cx + s * c, cy), 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
        B.text(V(cx + s * c, cy + (s < 0 ? -12 : 20)), s < 0 ? 'F₁' : 'F₂', { fill: '#ffd166', 'font-size': 12.5, 'font-weight': 700 });
      }
      B.text(V(cx - a - 6, cy - b + 14), '特征矩形：2a × 2b', { fill: '#93a1b5', 'font-size': 11.5, 'text-anchor': 'end' });
      const half = Math.atan(b / a);
      const dx = 49 * Math.cos(half), dy = 49 * Math.sin(half);
      mk('path', { d: `M${cx + dx} ${cy - dy} A49 49 0 0 1 ${cx + dx} ${cy + dy}`,
        fill: 'none', stroke: '#ff9e4a', 'stroke-width': 2.5 }, B.dyn);
      B.text(V(cx + 57, cy + 5), 'α', { fill: '#ff9e4a' });
      cE(`e = ${fmt(e, 2)}`, 'ok');
      cBA(`√(e²−1) = ${fmt(Math.sqrt(e * e - 1), 3)}`);
      cShape(`α = 2·arctan(b/a) = ${fmt(2 * half * 180 / Math.PI, 1)}°`);
      B.hint('橙色圆弧标出右支两条渐近射线之间的张口角');
    }
  };

  B.render();
  return B;
}
