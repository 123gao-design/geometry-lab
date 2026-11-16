/* 图 J2 附板 · 描述法描述平面点集：代表元换成点 (x,y)、前置集合换成 ℝ²
   三个并列的小坐标平面，各示范一类描述法：直线（等式约束）、圆盘（不等式约束）、
   上半平面（不等号不带等号 —— 边界空心）。无探针：静态示意，读懂三部件如何落到平面上。
   局部坐标约定：u∈[0,860] 向右、v∈[0,360] 向下；三段坐标平面中心 u=150/430/710、v=158，
   单位 50px，范围 ±2.2。 */
import { Board, mk, V } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 360;
  const B = new Board(root, W, H);
  const CENT = [150, 430, 710], CX = 158, UNIT = 50;
  const x = (c, t) => c + t * UNIT, y = t => CX - t * UNIT;

  B.renderFn = () => {
    B.text(V(430, 26), '描述法同样描述平面上的点集 —— 代表元换成点 (x,y)、前置集合换成 ℝ²',
      { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'middle' });
    CENT.forEach(c => {
      // 小坐标平面：轴 + 刻度
      B.seg(V(c - 2.3 * UNIT, y(0)), V(c + 2.3 * UNIT, y(0)), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
      B.seg(V(c, y(2.3)), V(c, y(-2.3)), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
      for (const t of [-2, -1, 1, 2]) {
        B.seg(V(c + t * UNIT, y(0) - 4), V(c + t * UNIT, y(0) + 4), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
        B.text(V(c + t * UNIT, y(0) + 18), String(t), { 'font-size': 10, fill: '#5c6a80' });
        B.seg(V(c - 3, y(t)), V(c + 3, y(t)), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
        B.text(V(c - 12, y(t)), String(t), { 'font-size': 10, fill: '#5c6a80' });
      }
      B.text(V(c + 2.3 * UNIT + 18, y(0) - 4), 'x', { 'font-size': 12, fill: '#8fa3bd', 'font-style': 'italic' });
      B.text(V(c + 12, y(2.3) - 10), 'y', { 'font-size': 12, fill: '#8fa3bd', 'font-style': 'italic' });
    });
    // 段 1：直线 y=x 上的点（等式约束）
    const c0 = CENT[0];
    B.seg(V(c0 - 2.3 * UNIT, y(-2.3)), V(c0 + 2.3 * UNIT, y(2.3)), { stroke: '#5cadff', 'stroke-width': 2.2 });
    for (const t of [-2, -1, 0, 1, 2]) B.dot(V(c0 + t * UNIT, y(t)), 3.6, { fill: '#5cadff' });
    B.text(V(c0, 300), '直线 y=x 上的点：横纵坐标相等', { 'font-size': 11.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 段 2：单位圆盘（不等式约束，含边界）
    const c1 = CENT[1];
    mk('circle', { cx: c1, cy: y(0), r: UNIT, fill: '#5cadff', 'fill-opacity': .3, stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    B.text(V(c1, 300), '单位圆盘：到原点距离不超过 1', { 'font-size': 11.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 段 3：上半平面（不等号不带等号，边界空心）
    const c2 = CENT[2];
    mk('rect', { x: c2 - 2.3 * UNIT, y: y(2.3), width: 4.6 * UNIT, height: 2.3 * UNIT, fill: '#67e8f9', 'fill-opacity': .3, stroke: '#67e8f9', 'stroke-width': 2.2 }, B.dyn);
    B.text(V(c2, 300), '上半平面：纵坐标大于 0（不含边界）', { 'font-size': 11.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 每段描述法原文
    B.tex(V(150, 332), '$\\{(x,y)\\in\\mathbb{R}^{2}\\mid y=x\\}$', { size: 14, anchor: 'mid' });
    B.tex(V(430, 332), '$\\{(x,y)\\in\\mathbb{R}^{2}\\mid x^{2}+y^{2}\\le 1\\}$', { size: 14, anchor: 'mid' });
    B.tex(V(710, 332), '$\\{(x,y)\\in\\mathbb{R}^{2}\\mid y>0\\}$', { size: 14, anchor: 'mid' });
  };

  B.render();
  return B;
}