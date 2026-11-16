/* 图 D4c · 离心率塑形机：e 如何决定同族曲线的胖瘦
   椭圆：b/a = √(1−e²)（e=0 为圆，e→1 成针）；双曲线：b/a = √(e²−1)（渐近线张口） */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 460;
  const B = new Board(root, W, H);
  const st = { mode: 'e', cx: 400, cy: 240, aE: 205, eE: 0.5, aH: 95, eH: 1.6 };
  const isE = () => st.mode === 'e';

  const cE = B.chip('离心率 e'), cBA = B.chip('b / a'), cShape = B.chip('形状判词');
  const sEE = B.slider('e（椭圆）', 0, 0.97, 0.01, st.eE, v => { st.eE = v; B.render(); });
  const sEH = B.slider('e（双曲线）', 1.05, 2.8, 0.01, st.eH, v => { st.eH = v; B.render(); });
  const syncSliders = () => {
    sEE.parentElement.style.display = isE() ? '' : 'none';
    sEH.parentElement.style.display = isE() ? 'none' : '';
  };
  B.toggleBtn('双曲线模式', false, on => { st.mode = on ? 'h' : 'e'; syncSliders(); B.render(); });
  syncSliders();

  const shapeWordE = e => e < 0.2 ? '几乎是个圆' : e < 0.55 ? '圆润的椭圆' : e < 0.85 ? '明显压扁' : '细长得像根针';
  const shapeWordH = e => e < 1.3 ? '窄口急转弯' : e < 2 ? '开口渐宽' : '张口极大，近乎两条直线';

  B.renderFn = () => {
    const { cx, cy } = st;
    B.seg(V(24, cy), V(W - 24, cy), { stroke: '#22314a', 'stroke-width': 1.5 });
    B.seg(V(cx, 18), V(cx, H - 18), { stroke: '#22314a', 'stroke-width': 1.5 });

    if (isE()) {
      const a = st.aE, e = st.eE, c = a * e, b = a * Math.sqrt(1 - e * e);
      // 参照圆（e = 0 的形状）
      mk('circle', { cx, cy, r: a, fill: 'none', stroke: '#3a4a63', 'stroke-width': 1.4, 'stroke-dasharray': '6 6' }, B.dyn);
      // 椭圆
      const pts = [];
      for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03)
        pts.push(`${(cx + a * Math.cos(t)).toFixed(1)},${(cy + b * Math.sin(t)).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.6 }, B.dyn);
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
      cE(`e = ${fmt(e, 2)}${e === 0 ? '（圆！）' : ''}`, 'ok');
      cBA(`√(1−e²) = ${fmt(Math.sqrt(1 - e * e), 3)}`);
      cShape(shapeWordE(e), e > 0.85 ? 'warn' : 'ok');
      B.hint('a 固定，只调 e：e → 0 椭圆贴合虚线圆（焦点挤向中心）；e → 1 焦点奔向两端，椭圆被拉成针');
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
        mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.6 }, B.dyn);
      }
      // 顶点、焦点
      for (const s of [-1, 1]) {
        B.dot(V(cx + s * a, cy), 4.5, { fill: '#fff' });
        B.text(V(cx + s * a, cy + 18), s < 0 ? 'A₁' : 'A₂', { fill: '#93a1b5', 'font-size': 12 });
        B.dot(V(cx + s * c, cy), 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
        B.text(V(cx + s * c, cy + (s < 0 ? -12 : 20)), s < 0 ? 'F₁' : 'F₂', { fill: '#ffd166', 'font-size': 12.5, 'font-weight': 700 });
      }
      B.text(V(cx - a - 6, cy - b + 14), '特征矩形：2a × 2b', { fill: '#93a1b5', 'font-size': 11.5, 'text-anchor': 'end' });
      const half = Math.atan(b / a) * 180 / Math.PI;
      cE(`e = ${fmt(e, 2)}`, 'ok');
      cBA(`√(e²−1) = ${fmt(Math.sqrt(e * e - 1), 3)}`);
      cShape(`渐近线张口 2·arctan(b/a) = ${fmt(2 * half, 1)}°　·　${shapeWordH(e)}`, '');
      B.hintM('a 固定，只调 e：$e \\to 1^+$ 时矩形极扁、张口极小；e 越大，焦点越远，张口越开 —— 渐近线就是特征矩形的对角线');
    }
  };

  B.render();
  return B;
}
