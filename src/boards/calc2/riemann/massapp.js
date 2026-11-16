/* 图 重6 · 重积分的应用机
   半圆薄片 D：x²+y²≤R²、y≥0，面密度 ρ(x,y)=1+y（越靠上越重）。
   质量、质心与转动惯量都是密度加权的积分：M=∬ρ dA，ȳ=∬yρ dA / M，I_O=∬(x²+y²)ρ dA。
   拖半径 R，三个读数一起变；质心随密度上移，始终在对称轴上。 */
import { Board, V, fmt } from '../../../lib/board.js';
import { heat } from '../../../lib/field2d.js';

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { R: 2 };
  const cM = B.chipM('质量 $M$'), cY = B.chipM('质心'), cI = B.chipM('$I_O$'), cJ = B.chipM('判读');
  const m = B.isoFit(-2.7, 2.7, -0.6, 2.7, [40, 24, 470, 350], 20);

  B.renderFn = () => {
    const R = st.R;
    B.grid({ ...m, sx: 0.5, sy: 0.5, lx: 1, ly: 1 });
    heat(B, (x, y) => (x * x + y * y <= R * R && y >= 0 ? 1 + y : NaN), m, { scale: 3.2 });

    // 区域边界
    const arc = [];
    for (let i = 0; i <= 120; i++) { const t = Math.PI * i / 120; arc.push(V(m.px(R * Math.cos(t)), m.py(R * Math.sin(t)))); }
    for (let i = 1; i < arc.length; i++) B.seg(arc[i - 1], arc[i], { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.seg(V(m.px(-R), m.py(0)), V(m.px(R), m.py(0)), { stroke: '#5cadff', 'stroke-width': 2.2 });

    const M = Math.PI * R * R / 2 + 2 * R ** 3 / 3;
    const ybar = (2 * R ** 3 / 3 + Math.PI * R ** 4 / 8) / M;
    const I = Math.PI * R ** 4 / 4 + 2 * R ** 5 / 5;

    // 质心与对称轴
    B.seg(V(m.px(0), m.py(0)), V(m.px(0), m.py(m.Y1)), { stroke: '#c084fc', 'stroke-width': 1.2, 'stroke-dasharray': '6 5', 'stroke-opacity': .8 });
    B.dot(V(m.px(0), m.py(ybar)), 6, { fill: '#ff7b8a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.tex(V(m.px(0) + 10, m.py(ybar) - 12), '$C$', { size: 12, color: '#ff7b8a', w: 24 });
    B.seg(V(m.px(0), m.py(ybar)), V(m.px(-1.05), m.py(ybar)), { stroke: '#ff7b8a', 'stroke-width': 1.3, 'stroke-dasharray': '4 4' });

    cM(`$${fmt(M, 3)}$`);
    cY(`$(0,\\ ${fmt(ybar, 3)})$`);
    cI(`$${fmt(I, 3)}$`);
    cJ(`密度向上变大，质心被抬到 $\\bar y=${fmt(ybar, 2)}$，比均匀半圆的 $\\dfrac{4R}{3\\pi}=${fmt(4 * R / (3 * Math.PI), 2)}$ 高`, 'ok');
  };

  B.slider('半圆半径 R', 1, 2.4, 0.02, st.R, v => { st.R = v; B.render(); }, 'R');
  B.hintM('拖半径：红点是质心，始终落在紫色对称轴上；质量、质心与转动惯量都随 $R$ 按不同次数增长');
  B.render();
  return B;
}
