/* 图 线3 · 格林公式机
   正向边界 L（逆时针）围成平面区域 D，格林公式把边界上的第二类曲线积分
   换成正区域上的二重积分：∮_L P dx+Q dy = ∬_D (Q_x−P_y) dσ。
   三个预设：① 圆域 + 旋转场 F=(−y,x)，两边都等于 2πR²；
   ② 正方形域 + 同一个场，两边都等于 8a²（区域形状不影响公式）；
   ③ 圆域 + 保守场 F=(y,x)，Q_x−P_y=0，两边同时为零。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const P = [
  { n: '① 圆域 · 旋转场', F: (x, y) => [-y, x], curl: () => 2 },
  { n: '② 方域 · 同一个场', F: (x, y) => [-y, x], curl: () => 2 },
  { n: '③ 圆域 · 保守场', F: (x, y) => [y, x], curl: () => 0 },
];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, s: 1.3 };
  const cS = B.chipM('区域面积'), cL = B.chipM('环流 $\\oint_L$'), cD = B.chipM('二重积分 $\\iint_D$'), cJ = B.chipM('判读');
  const mL = B.isoFit(-2.15, 2.15, -2.15, 2.15, [26, 18, 424, 404], 16);
  const mR = B.mapFit(0, 2.6, 0, 21, [512, 58, 286, 306], 20);

  const isCircle = () => st.k !== 1;
  const area = () => isCircle() ? Math.PI * st.s ** 2 : 4 * st.s ** 2;
  const circ = () => P[st.k].curl() * area();
  const dbl = () => P[st.k].curl() * area();

  const bndPt = (u, s) => isCircle() ? [s * Math.cos(2 * Math.PI * u), s * Math.sin(2 * Math.PI * u)]
    : (() => {
      const q = u * 4 % 4, side = Math.floor(q), f = q - side;
      const corners = [[s, -s], [s, s], [-s, s], [-s, -s]];
      const a = corners[side], b = corners[(side + 1) % 4];
      return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
    })();

  B.renderFn = () => {
    const s = st.s;
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 0.5, ly: 0.5 });

    // 区域填充
    const poly = [];
    const N = 160;
    for (let i = 0; i <= N; i++) { const [x, y] = bndPt(i / N, s); poly.push(V(mL.px(x), mL.py(y))); }
    mk('polygon', { points: poly.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '), fill: '#5cadff', 'fill-opacity': .13, stroke: 'none' }, B.dyn);

    // 场箭头（区域内）
    for (let gx = -1.8; gx <= 1.81; gx += 0.6) {
      for (let gy = -1.8; gy <= 1.81; gy += 0.6) {
        const inside = isCircle() ? (gx * gx + gy * gy <= s * s * 1.02) : (Math.abs(gx) <= s && Math.abs(gy) <= s);
        if (!inside) continue;
        const [fx, fy] = P[st.k].F(gx, gy), l = Math.hypot(fx, fy) || 1;
        const k = 0.34;
        B.arrow(V(mL.px(gx), mL.py(gy)), V(mL.px(gx + k * fx / l), mL.py(gy + k * fy / l)),
          { stroke: '#3f5f8f', 'stroke-width': 1.1, 'stroke-opacity': .8, head: 7, wide: 3.2 });
      }
    }

    // 边界与走向箭头
    for (let i = 1; i < poly.length; i++) B.seg(poly[i - 1], poly[i], { stroke: '#4ade80', 'stroke-width': 2.8 });
    for (let i = 0; i < 8; i++) {
      const u0 = i / 8, u1 = u0 + 0.012;
      const [x0, y0] = bndPt(u0, s), [x1, y1] = bndPt(u1, s);
      B.arrow(V(mL.px(x0), mL.py(y0)), V(mL.px(x1), mL.py(y1)), { stroke: '#4ade80', 'stroke-width': 1.6, head: 9, wide: 4 });
    }
    B.tex(V(mL.px(s) + 14, mL.py(0)), 'L', { size: 13, color: '#4ade80', w: 18 });

    // 右栏：两条等高柱
    B.grid({ ...mR, sx: 0.5, sy: 2, lx: 0.5, ly: 2, axLab: '项', ayLab: '值' });
    const v1 = circ(), v2 = dbl(), top = Math.max(v1, v2, 1e-6);
    const bw = 54;
    const bar = (cx, v, c, lab) => {
      mk('rect', { x: mR.px(cx) - bw / 2, y: mR.py(v), width: bw, height: Math.max(1, mR.py(0) - mR.py(v)), fill: c, 'fill-opacity': .75, stroke: c, 'stroke-width': 1.2 }, B.dyn);
      B.tex(V(mR.px(cx), mR.py(v) - 14), `$${fmt(v, 2)}$`, { size: 12, color: c, w: 84, anchor: 'mid' });
      B.tex(V(mR.px(cx), mR.py(0) + 16), lab, { size: 11, color: c, w: 110, anchor: 'mid' });
    };
    bar(0.75, v1, '#5cadff', '环流 $\\oint_L$');
    bar(1.75, v2, '#ff9e4a', '二重积分 $\\iint_D$');

    cS(`$${fmt(area(), 3)}$`);
    cL(`$${fmt(v1, 3)}$`);
    cD(`$${fmt(v2, 3)}$`, Math.abs(v1 - v2) < 1e-9 ? 'ok' : 'warn');
    if (st.k === 2) cJ('$Q_x-P_y=1-1=0$：边界上的环流为零，与「保守场绕闭合回路不做功」一致', 'ok');
    else cJ('边界是逆时针的正向；换成顺时针，两边同时变号，等式仍然成立');
  };

  const bts = P.map((S, i) => B.btnM(S.n, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('区域大小', 0.8, 1.8, 0.02, st.s, v => { st.s = v; B.render(); }, 'a');
  B.hintM('绿色是正向边界（逆时针），蓝色箭头是场；右栏两根柱永远等高，这就是格林公式');
  B.render();
  return B;
}
