/* 图 微4 · 方向导数与梯度机
   山地底图（暖橙陡、冷蓝低）+ 等值线；P 处蓝色是梯度、橙色是任取的方向 l，
   绿色是梯度在 l 上的投影，长度就是方向导数 D_l=|∇f|·cosθ。
   方向与梯度同向时取最大 |∇f|，垂直时 D_l=0（正沿着等值线走）。 */
import { Board, V, fmt } from '../../../lib/board.js';
import { heat, isocurves } from '../../../lib/field2d.js';

const P = [
  { n: '① $f=4-x^2-y^2$', f: (x, y) => 4 - x * x - y * y, g: (x, y) => [-2 * x, -2 * y], sc: 3.2, lv: [0.6, 1.6, 2.6, 3.4] },
  { n: '② $f=x^2-y^2$', f: (x, y) => x * x - y * y, g: (x, y) => [2 * x, -2 * y], sc: 2.4, lv: [-1.6, -0.6, 0.6, 1.6] },
  { n: '③ $f=x^2+4y^2$', f: (x, y) => x * x + 4 * y * y, g: (x, y) => [2 * x, 8 * y], sc: 3.0, lv: [0.8, 1.8, 2.8, 3.8] },
];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, x0: 0.9, y0: 0.6, ph: 30 };
  const cG = B.chipM('$|\\nabla f|$'), cC = B.chipM('$\\cos\\theta$'), cD = B.chipM('$D_l$'), cJ = B.chipM('判读');
  const m = B.isoFit(-2.2, 2.2, -1.65, 1.65, [34, 24, 500, 350], 18);

  B.renderFn = () => {
    const S = P[st.k];
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1 });
    heat(B, S.f, m, { scale: S.sc });
    isocurves(B, S.f, m, S.lv, { stroke: '#93a1b5', w: 1.1, op: .45 });

    const { x0, y0 } = st, ph = st.ph * Math.PI / 180;
    const [gx, gy] = S.g(x0, y0), gl = Math.hypot(gx, gy) || 1;
    const lx = Math.cos(ph), ly = Math.sin(ph);
    const p0 = V(m.px(x0), m.py(y0));

    // 过 P 的等值线（绿）
    isocurves(B, S.f, m, [S.f(x0, y0)], { stroke: '#4ade80', w: 1.6, op: .85 });

    B.arrow(p0, V(m.px(x0 + gx / gl * 0.85), m.py(y0 + gy / gl * 0.85)), { stroke: '#5cadff', 'stroke-width': 2.4 });
    B.arrow(p0, V(m.px(x0 + lx * 1.15), m.py(y0 + ly * 1.15)), { stroke: '#ff9e4a', 'stroke-width': 2.2 });

    const D = gx * lx + gy * ly;
    const k = D / gl;
    const q = V(m.px(x0 + gx / gl * 0.85 * k), m.py(y0 + gy / gl * 0.85 * k));
    B.seg(p0, q, { stroke: '#4ade80', 'stroke-width': 3.6, 'stroke-opacity': .95 });
    B.dot(p0, 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(p0.x + 12, p0.y - 12), '$P$', { size: 12, color: '#ffd166', w: 22 });
    B.tex(V(m.px(0) + 8, m.py(1.55)), '蓝：梯度　橙：方向 $l$　绿：$D_l$', { size: 12, color: '#93a1b5', w: 300 });

    const cos = gl ? (gx * lx + gy * ly) / gl : 0;
    cG(`$${fmt(gl, 3)}$`);
    cC(`$${fmt(cos, 3)}$`);
    cD(`$${fmt(D, 3)}$`);
    cJ(Math.abs(1 - cos) < 0.05 ? '方向与梯度同向：$D_l$ 取到最大值 $|\\nabla f|$'
      : Math.abs(cos) < 0.05 ? '方向与梯度垂直：正沿等值线走，$D_l=0$'
        : D < 0 ? '方向偏到梯度背后：函数沿这个方向在减小' : '方向偏在梯度一侧：$D_l$ 比 $|\\nabla f|$ 小',
    Math.abs(1 - cos) < 0.05 ? 'ok' : Math.abs(cos) < 0.05 ? 'ok' : '');
  };

  const bts = P.map((S, i) => B.btnM(S.n, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('x₀', -1.7, 1.7, 0.05, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.slider('y₀', -1.2, 1.2, 0.05, st.y0, v => { st.y0 = v; B.render(); }, 'y0');
  B.slider('方向角 φ', 0, 360, 5, st.ph, v => { st.ph = v; B.render(); }, 'ph');
  B.hintM('拖方向角：橙箭头转到与蓝箭头同向时绿段最长，转到与等值线相切时绿段缩到零');
  B.render();
  return B;
}
