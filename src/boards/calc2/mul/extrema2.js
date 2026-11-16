/* 图 微5 · 多元函数极值机
   等值线地图上把梯度画成一小簇箭头，箭头都指离驻点的方向；
   原点处梯度为零，用海塞矩阵判它是极小、极大还是鞍点。
   四个预设：① 极小 ② 极大 ③ 鞍点 ④ AC−B²=0 判别式失效。
   拖 P 看梯度：P 处的金色箭头总是把点往「上坡」方向推。 */
import { Board, V, fmt } from '../../../lib/board.js';
import { heat, isocurves } from '../../../lib/field2d.js';

const P = [
  { n: '① $f=x^2+y^2$', f: (x, y) => x * x + y * y, g: (x, y) => [2 * x, 2 * y],
    A: 2, B: 0, C: 2, lv: [0.3, 0.7, 1.2, 1.9, 2.7], v: '$AC-B^2=4>0$ 且 $A>0$：极小值 $0$' },
  { n: '② $f=2-x^2-y^2$', f: (x, y) => 2 - x * x - y * y, g: (x, y) => [-2 * x, -2 * y],
    A: -2, B: 0, C: -2, lv: [0.3, 0.8, 1.3, 1.8], v: '$AC-B^2=4>0$ 且 $A<0$：极大值 $2$' },
  { n: '③ $f=x^2-y^2$', f: (x, y) => x * x - y * y, g: (x, y) => [2 * x, -2 * y],
    A: 2, B: 0, C: -2, lv: [-1.6, -0.7, 0, 0.7, 1.6], v: '$AC-B^2=-4<0$：鞍点，原点不是极值点' },
  { n: '④ $f=x^2+y^4$', f: (x, y) => x * x + y ** 4, g: (x, y) => [2 * x, 4 * y ** 3],
    A: 2, B: 0, C: 0, lv: [0.2, 0.55, 1.0, 1.6, 2.4], v: '$AC-B^2=0$：判别式失效；但 $f\\ge0$ 且 $f(0,0)=0$，仍取极小值' },
];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, x0: 0.7, y0: 0.5 };
  const cA = B.chipM('$A=f_{xx}$'), cB = B.chipM('$B=f_{xy}$'), cC = B.chipM('$C=f_{yy}$'), cD = B.chipM('$AC-B^2$'), cJ = B.chipM('判读');
  const m = B.isoFit(-1.75, 1.75, -1.35, 1.35, [34, 24, 500, 350], 18);

  B.renderFn = () => {
    const S = P[st.k];
    B.grid({ ...m, sx: 0.5, sy: 0.5, lx: 0.5, ly: 0.5 });
    heat(B, S.f, m, { scale: 2.6 });
    isocurves(B, S.f, m, S.lv, { stroke: '#93a1b5', w: 1.1, op: .45 });

    // 一小簇梯度箭头
    for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) {
      const x = -1.4 + 2.8 * i / 5, y = -1.05 + 2.1 * j / 4;
      const [gx, gy] = S.g(x, y), l = Math.hypot(gx, gy);
      if (l < 0.02) continue;
      const k = 0.16 + 0.1 * Math.min(1, l);
      B.arrow(V(m.px(x), m.py(y)), V(m.px(x + gx / l * k), m.py(y + gy / l * k)),
        { stroke: '#8fa3bd', 'stroke-width': 1.2, head: 7, wide: 3.4 });
    }

    // 驻点与可拖的 P
    B.dot(V(m.px(0), m.py(0)), 6, { fill: '#ff7b8a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.tex(V(m.px(0) + 10, m.py(0) - 12), '驻点', { size: 11.5, color: '#ff7b8a', w: 46 });
    const { x0, y0 } = st;
    const [gx, gy] = S.g(x0, y0), gl = Math.hypot(gx, gy) || 1;
    B.dot(V(m.px(x0), m.py(y0)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.arrow(V(m.px(x0), m.py(y0)), V(m.px(x0 + gx / gl * 0.55), m.py(y0 + gy / gl * 0.55)), { stroke: '#ffd166', 'stroke-width': 2.2 });

    cA(`$${fmt(S.A, 1)}$`);
    cB(`$${fmt(S.B, 1)}$`);
    cC(`$${fmt(S.C, 1)}$`);
    cD(`$${fmt(S.A * S.C - S.B * S.B, 1)}$`);
    cJ(S.v, st.k === 2 ? 'warn' : st.k === 3 ? 'warn' : 'ok');
  };

  const bts = P.map((S, i) => B.btnM(S.n, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('x₀', -1.5, 1.5, 0.05, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.slider('y₀', -1.1, 1.1, 0.05, st.y0, v => { st.y0 = v; B.render(); }, 'y0');
  B.hintM('拖 P 看金色箭头：它把点推向上升方向，只在驻点处缩成一个点；再按 $AC-B^2$ 与 $A$ 的符号读类型');
  B.render();
  return B;
}
