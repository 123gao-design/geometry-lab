/* 图 积4a · 向量积的几何意义（二维）
   a=(x₁,y₁)、b=(x₂,y₂) 张成平行四边形，面积 = |a||b|sinθ = |x₁y₂−x₂y₁|。
   x₁y₂−x₂y₁ 的符号记录从 a 转到 b 的方向：逆时针为正、顺时针为负，共线为零。
   拖动两支箭头的终点：面积色块随夹角变化，颜色随旋转方向在蓝、橙之间翻转。 */
import { Board, V, fmt, mk, arcPts, angDiff } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: 2.6, ay: 0.7, bx: 0.4, by: 2.4, grid: true, labs: true };
  const PRE = [
    { nm: '① 一般位置', a: [2.6, 0.7], b: [0.4, 2.4] },
    { nm: '② 互相垂直', a: [2.4, 0], b: [0, 2.4] },
    { nm: '③ 共线', a: [2.4, 1.2], b: [1.2, 0.6] },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cA = B.chipM('有向面积'), cB = B.chipM('面积'), cC = B.chipM('夹角'), cD = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const A = V(m.px(st.ax), m.py(st.ay));
    const Bp = V(m.px(st.bx), m.py(st.by));
    const C = V(m.px(st.ax + st.bx), m.py(st.ay + st.by));

    const det = st.ax * st.by - st.ay * st.bx;         // 有向面积，也是二维向量积的 z 分量
    const area = Math.abs(det);
    const la = Math.hypot(st.ax, st.ay), lb = Math.hypot(st.bx, st.by);
    const sin = la > 1e-9 && lb > 1e-9 ? Math.min(1, area / (la * lb)) : 0;
    const ang = Math.asin(Math.max(-1, Math.min(1, sin))) * 180 / Math.PI;
    const zero = la < 1e-9 || lb < 1e-9;

    // 平行四边形：正面积蓝、负面积橙，方向一换颜色就翻
    if (area > 1e-9) {
      B.dyn.appendChild(mk('polygon', {
        points: [O, A, C, Bp].map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
        fill: det > 0 ? '#5cadff' : '#ff9e4a', 'fill-opacity': .14, stroke: 'none',
      }, B.dyn));
    }
    // 两条对边
    B.seg(A, C, { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .65 });
    B.seg(Bp, C, { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .65 });
    // 两支向量
    B.arrow(O, A, { stroke: '#5cadff', 'stroke-width': 2.3, head: 12, wide: 5.5 });
    B.arrow(O, Bp, { stroke: '#ff9e4a', 'stroke-width': 2.3, head: 12, wide: 5.5 });
    B.tex(V(A.x + 7, A.y + 4), '$\\vec a$', { size: 13.5, anchor: 'start', color: '#5cadff', w: 30 });
    B.tex(V(Bp.x + 7, Bp.y - 22), '$\\vec b$', { size: 13.5, anchor: 'start', color: '#ff9e4a', w: 30 });
    B.dot(O, 3.4, { fill: '#e8eefc' });

    // 从 a 转到 b 的短弧，末端补一枚箭头指示转向
    if (!zero && area > 1e-9) {
      const a1 = Math.atan2(-st.ay, st.ax), a2 = Math.atan2(-st.by, st.bx);
      const d = angDiff(a2, a1), rp = 0.86 * m.s;
      B.dyn.appendChild(mk('path', {
        d: arcPts(O, a1, a1 + d, rp, 22), fill: 'none',
        stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-opacity': .9,
      }, B.dyn));
      const ae = a1 + d, E = { x: O.x + rp * Math.cos(ae), y: O.y + rp * Math.sin(ae) };
      const sg = Math.sign(d) || 1;
      const tx = -Math.sin(ae) * sg, ty = Math.cos(ae) * sg, nx = -ty, ny = tx;
      B.dyn.appendChild(mk('polygon', {
        points: [E, { x: E.x - 9 * tx + 4.2 * nx, y: E.y - 9 * ty + 4.2 * ny },
          { x: E.x - 9 * tx - 4.2 * nx, y: E.y - 9 * ty - 4.2 * ny }]
          .map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
        fill: '#ffd166', stroke: 'none',
      }, B.dyn));
      B.tex(V(O.x + 1.12 * rp * Math.cos(a1 + d / 2), O.y + 1.12 * rp * Math.sin(a1 + d / 2)),
        '$\\theta$', { size: 13, anchor: 'mid', color: '#ffd166', w: 24 });
    }

    cA(`$x_1y_2-x_2y_1=${fmt(det, 2)}$`);
    cB(`$|\\vec a||\\vec b|\\sin\\theta=${fmt(la, 2)}\\times${fmt(lb, 2)}\\times${fmt(sin, 3)}=${fmt(area, 2)}$`);
    cC(`$\\theta=${fmt(ang, 1)}^\\circ$`);
    cD(zero ? '含零向量：平行四边形退化成一条线段，向量积为零'
      : area < 1e-6 ? '两支共线：平行四边形压成一条线段，有向面积为零'
        : det > 0 ? '从 a 逆时针转到 b：有向面积为正，二维向量积取正号'
          : '从 a 顺时针转到 b：有向面积为负，二维向量积取负号');
  };

  const cl = v => Math.max(-4, Math.min(4, Math.round(v * 10) / 10));
  B.handle({
    color: '#5cadff', r: 7,
    get: () => V(m.px(st.ax), m.py(st.ay)),
    set: p => { st.ax = cl((p.x - m.px(0)) / m.s); st.ay = cl((m.py(0) - p.y) / m.s); },
  });
  B.handle({
    color: '#ff9e4a', r: 7,
    get: () => V(m.px(st.bx), m.py(st.by)),
    set: p => { st.bx = cl((p.x - m.px(0)) / m.s); st.by = cl((m.py(0) - p.y) / m.s); },
  });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    [st.ax, st.ay] = p.a; [st.bx, st.by] = p.b;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动两支箭头的终点：面积 = |a||b|sinθ，正负号由转向决定');
  B.render();
  return B;
}
