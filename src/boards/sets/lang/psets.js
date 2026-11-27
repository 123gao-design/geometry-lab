/* 图 J2 附板 · 描述法描述平面点集：代表元换成点 (x,y)、前置集合换成 ℝ²
   三个并列的小坐标平面，各示范一类描述法：直线（等式约束）、圆盘（不等式约束）、
   上半平面（不等号不带等号 —— 边界用虚线，空心）。无探针：静态示意，读懂三部件如何落到平面上。
   视觉走 conic-diagram 的纸面色板：整板柔光 / 细网格两档背景、细内框、主客体分层。
   局部坐标约定：u∈[0,860] 向右、v∈[0,360] 向下；三段坐标平面中心 u=150/430/710、v=158，
   单位 50px，范围 ±2.2。 */
import { mk, V } from '../../../lib/board.js';
import { createDiagram, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 360;
  root.classList.add('psets-board');
  const B = createDiagram(root, W, H, '描述法描述平面点集：直线、圆盘与上半平面');
  const CENT = [150, 430, 710], CX = 158, UNIT = 50;
  const x = (c, t) => c + t * UNIT, y = t => CX - t * UNIT;

  B.setAppearanceBackground(['光晕', '细网格'], grid => { root.dataset.texture = grid ? 'grid' : 'halo'; });

  B.renderFn = () => {
    // 细内框：图区自己收边（底色与光晕在板根上）
    mk('rect', { x: 12, y: 14, width: W - 24, height: H - 24, rx: 12, fill: 'none', stroke: plotInk.axis }, B.dyn);

    CENT.forEach(c => {
      // 小坐标平面：轴 + 刻度
      B.seg(V(c - 2.3 * UNIT, y(0)), V(c + 2.3 * UNIT, y(0)), { stroke: plotInk.axis, 'stroke-width': 1.3 });
      B.seg(V(c, y(2.3)), V(c, y(-2.3)), { stroke: plotInk.axis, 'stroke-width': 1.3 });
      for (const t of [-2, -1, 1, 2]) {
        B.seg(V(c + t * UNIT, y(0) - 4), V(c + t * UNIT, y(0) + 4), { stroke: plotInk.guide, 'stroke-width': 1.1 });
        B.text(V(c + t * UNIT, y(0) + 18), String(t), { 'font-size': 10, fill: plotInk.guide, class: 'ps-tick' });
        B.seg(V(c - 3, y(t)), V(c + 3, y(t)), { stroke: plotInk.guide, 'stroke-width': 1.1 });
        B.text(V(c - 12, y(t)), String(t), { 'font-size': 10, fill: plotInk.guide, class: 'ps-tick' });
      }
      B.text(V(c + 2.3 * UNIT + 16, y(0) - 4), 'x', { 'font-size': 12, fill: plotInk.guide, class: 'ps-tick' });
      B.text(V(c + 12, y(2.3) - 8), 'y', { 'font-size': 12, fill: plotInk.guide, class: 'ps-tick' });
    });

    // 段 1：直线 y=x 上的点（等式约束）
    const c0 = CENT[0];
    B.seg(V(c0 - 2.3 * UNIT, y(-2.3)), V(c0 + 2.3 * UNIT, y(2.3)), { stroke: plotInk.blue, 'stroke-width': 2.2 });
    for (const t of [-2, -1, 0, 1, 2]) B.dot(V(c0 + t * UNIT, y(t)), 3.6, { fill: plotInk.blue });

    // 段 2：单位圆盘（不等式约束，含边界）
    const c1 = CENT[1];
    mk('circle', {
      cx: c1, cy: y(0), r: UNIT,
      fill: plotInk.blue, 'fill-opacity': .22,
      stroke: plotInk.blue, 'stroke-width': 2.2,
    }, B.dyn);

    // 段 3：上半平面（不等号不带等号，边界虚线 = 不含边界）
    const c2 = CENT[2];
    mk('rect', {
      x: c2 - 2.3 * UNIT, y: y(2.3), width: 4.6 * UNIT, height: 2.3 * UNIT,
      fill: plotInk.teal, 'fill-opacity': .16, stroke: 'none',
    }, B.dyn);
    B.seg(V(c2 - 2.3 * UNIT, y(0)), V(c2 + 2.3 * UNIT, y(0)),
      { stroke: plotInk.teal, 'stroke-width': 2, 'stroke-dasharray': '6 5' });

    // 每段描述法原文
    B.tex(V(150, 330), '$\\{(x,y)\\in\\mathbb{R}^{2}\\mid y=x\\}$', { size: 14, anchor: 'mid' });
    B.tex(V(430, 330), '$\\{(x,y)\\in\\mathbb{R}^{2}\\mid x^{2}+y^{2}\\le 1\\}$', { size: 14, anchor: 'mid' });
    B.tex(V(710, 330), '$\\{(x,y)\\in\\mathbb{R}^{2}\\mid y>0\\}$', { size: 14, anchor: 'mid' });
  };

  B.render();
  return B;
}
