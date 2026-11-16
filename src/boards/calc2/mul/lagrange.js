/* 图 微6 · 拉格朗日乘数法机
   目标函数 f 的等值线（暖橙陡、冷蓝低）与约束曲线（金色）；切点处两条曲线相切，
   也就是 ∇f 与 ∇g 平行：∇f=λ∇g。拖动约束参数，切点沿约束曲线移动，λ 随之改变。
   三个预设：① 圆约束下的 xy　② 椭圆上到 (3,0) 的距离平方　③ 直线上 x²+y² 的最小值。 */
import { Board, V, fmt } from '../../../lib/board.js';
import { heat, isocurves } from '../../../lib/field2d.js';

const P = [
  {
    n: '① $f=xy$，$x^2+y^2=R^2$', view: [-1.95, 1.95, -1.6, 1.6], sc: 1.8, lv: [-1.2, -0.5, 0.5, 1.2],
    f: (x, y) => x * y, gf: (x, y) => [y, x], gg: (x, y) => [2 * x, 2 * y],
    curve: R => circle(0, 0, R, 1, 1),
    sols: R => [{ x: R / Math.SQRT2, y: R / Math.SQRT2, t: '最大' }, { x: -R / Math.SQRT2, y: -R / Math.SQRT2, t: '最小' }],
    v: '最大值 $R^2/2$ 在 $(R/\\sqrt2,R/\\sqrt2)$，最小值 $-R^2/2$ 在对径点；两处梯度都平行于半径',
  },
  {
    n: '② $f=(x-3)^2+y^2$，$\\dfrac{x^2}{a^2}+y^2=1$', view: [-3.5, 3.9, -2.2, 2.2], sc: 20, lv: [1, 4, 9, 16, 25],
    f: (x, y) => (x - 3) ** 2 + y * y, gf: (x, y) => [2 * (x - 3), 2 * y], gg: (x, y) => [2 * x, 2 * y],
    curve: a => circle(0, 0, a, 1, 1),
    sols: a => [{ x: a, y: 0, t: '最小' }, { x: -a, y: 0, t: '最大' }],
    v: '椭圆上离 $(3,0)$ 最近的是 $(a,0)$，距离平方 $(a-3)^2$；最远的是 $(-a,0)$',
  },
  {
    n: '③ $f=x^2+y^2$，$x+y=c$', view: [-0.8, 4.9, -0.8, 4.4], sc: 12, lv: [1, 4, 8, 13, 18],
    f: (x, y) => x * x + y * y, gf: (x, y) => [2 * x, 2 * y], gg: () => [1, 1],
    curve: c => [[c, 0], [0, c]],
    sols: c => [{ x: c / 2, y: c / 2, t: '最小' }],
    v: '直线约束下 $x^2+y^2$ 的最小值在 $(c/2,c/2)$ 取到，等于 $c^2/2$',
  },
];

function circle(cx, cy, rx, ry, n = 96) {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = i / n * Math.PI * 2; out.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); }
  return out;
}

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, c: 1.0 };
  const cFx = B.chipM('$f_x$'), cFy = B.chipM('$f_y$'), cGx = B.chipM('$g_x$'), cGy = B.chipM('$g_y$'), cL = B.chipM('$\\lambda$'), cJ = B.chipM('判读');
  const RANGE = [[0.6, 1.4, 1.0], [1.4, 2.6, 1.8], [2, 4, 3]];
  let slp = null;

  B.renderFn = () => {
    const S = P[st.k], c = st.c;
    const m = B.isoFit(S.view[0], S.view[1], S.view[2], S.view[3], [34, 24, 500, 350], 18);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1 });
    heat(B, S.f, m, { scale: S.sc });
    isocurves(B, S.f, m, S.lv, { stroke: '#93a1b5', w: 1.1, op: .42 });

    // 约束曲线
    const cv = S.curve(c);
    for (let i = 1; i < cv.length; i++) B.seg(V(m.px(cv[i - 1][0]), m.py(cv[i - 1][1])), V(m.px(cv[i][0]), m.py(cv[i][1])), { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });

    // 各切点：目标函数的等值线（绿）与切线
    const sols = S.sols(c);
    sols.forEach((s, i) => {
      isocurves(B, S.f, m, [S.f(s.x, s.y)], { stroke: '#4ade80', w: 1.5, op: .8 });
      const [gx, gy] = S.gg(s.x, s.y), gl = Math.hypot(gx, gy) || 1;
      B.seg(V(m.px(s.x - gy / gl * 0.7), m.py(s.y + gx / gl * 0.7)), V(m.px(s.x + gy / gl * 0.7), m.py(s.y - gx / gl * 0.7)),
        { stroke: '#c084fc', 'stroke-width': 1.6, 'stroke-dasharray': '5 4', 'stroke-opacity': .9 });
      B.dot(V(m.px(s.x), m.py(s.y)), i === 0 ? 5.5 : 4.5, { fill: i === 0 ? '#ff7b8a' : '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.tex(V(m.px(s.x) + 9, m.py(s.y) - 11), s.t, { size: 11, color: i === 0 ? '#ff7b8a' : '#c084fc', w: 40 });
    });

    // 主切点处的两条梯度
    const s0 = sols[0];
    const [fx, fy] = S.gf(s0.x, s0.y), [gx, gy] = S.gg(s0.x, s0.y);
    const fl = Math.hypot(fx, fy) || 1, gl = Math.hypot(gx, gy) || 1;
    const p0 = V(m.px(s0.x), m.py(s0.y));
    B.arrow(p0, V(m.px(s0.x + fx / fl * 0.75), m.py(s0.y + fy / fl * 0.75)), { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.arrow(p0, V(m.px(s0.x + gx / gl * 0.55), m.py(s0.y + gy / gl * 0.55)), { stroke: '#67e8f9', 'stroke-width': 2 });
    B.tex(V(m.px(S.view[0]) + 14, m.py(S.view[3]) - 6), '蓝：$\\nabla f$　青：$\\nabla g$', { size: 11.5, color: '#93a1b5', w: 260 });

    const lam = gx ? fx / gx : fy / gy;
    cFx(`$${fmt(fx, 2)}$`);
    cFy(`$${fmt(fy, 2)}$`);
    cGx(`$${fmt(gx, 2)}$`);
    cGy(`$${fmt(gy, 2)}$`);
    cL(`$${fmt(lam, 2)}$`);
    cJ(S.v, 'ok');
  };

  const bts = P.map((S, i) => B.btnM(S.n, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i));
    const [lo, hi, v0] = RANGE[i]; st.c = v0;
    if (slp) { slp.min = lo; slp.max = hi; slp.sync(v0); }
    B.render();
  }, { on: i === 0 }));
  slp = B.slider('约束参数', RANGE[0][0], RANGE[0][1], 0.01, st.c, v => { st.c = v; B.render(); }, 'c');
  B.hintM('拖约束参数：红点是切点，绿线是与它相切的目标等值线；切点处蓝、青两支梯度总在同一直线上');
  B.render();
  return B;
}
