/* 图 行1 · 二阶行列式与面积
   a=(a₁,a₂)、b=(b₁,b₂) 张成平行四边形，D=a₁b₂−a₂b₁ 就是它的有向面积。
   以 a、b 为两列的矩阵把单位正方形 [[1,0],[0,1]] 映过去，正好落在同一个平行四边形上——
   二阶行列式于是等于「面积放大倍数」，正负号记录 a 转到 b 的转向。 */
import { Board, V, fmt, mk, arcPts, angDiff } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { a1: 2.2, a2: .6, b1: .5, b2: 1.9, grid: true, labs: true };
  const PRE = [
    { nm: '① 单位阵', a: [1, 0], b: [0, 1] },
    { nm: '② 旋转 $30^\\circ$', a: [Math.cos(Math.PI / 6), Math.sin(Math.PI / 6)], b: [-Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)] },
    { nm: '③ 剪切', a: [1, 0], b: [1.2, 1] },
    { nm: '④ 退化', a: [2, 1], b: [1, .5] },
  ];
  const m = B.isoFit(-3.9, 3.9, -3.0, 3.0, [40, 42, 484, 372], 0);
  const cD = B.chipM('行列式 $D$'), cS = B.chipM('有向面积'), cU = B.chipM('单位正方形的像'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const A = V(m.px(st.a1), m.py(st.a2));
    const Bp = V(m.px(st.b1), m.py(st.b2));
    const C = V(m.px(st.a1 + st.b1), m.py(st.a2 + st.b2));

    const D = st.a1 * st.b2 - st.a2 * st.b1;
    const area = Math.abs(D);
    const zero = Math.hypot(st.a1, st.a2) < 1e-9 || Math.hypot(st.b1, st.b2) < 1e-9;

    // 原来的单位正方形：金虚线，四条边分别映成平行四边形的四条边
    const sq = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => `${m.px(x).toFixed(1)},${m.py(y).toFixed(1)}`).join(' ');
    B.dyn.appendChild(mk('polygon', { points: sq, fill: '#ffd166', 'fill-opacity': .07, stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '5 4', 'stroke-opacity': .55 }, B.dyn));

    // 平行四边形：正面积蓝、负面积橙
    if (!zero) {
      B.dyn.appendChild(mk('polygon', {
        points: [O, A, C, Bp].map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
        fill: D > 0 ? '#5cadff' : '#ff9e4a', 'fill-opacity': .15, stroke: 'none',
      }, B.dyn));
    }
    B.seg(A, C, { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .7 });
    B.seg(Bp, C, { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .7 });
    B.arrow(O, A, { stroke: '#5cadff', 'stroke-width': 2.3, head: 12, wide: 5.5 });
    B.arrow(O, Bp, { stroke: '#ff9e4a', 'stroke-width': 2.3, head: 12, wide: 5.5 });
    B.tex(V(A.x + 8, A.y + 5), '$a$', { size: 13.5, anchor: 'start', color: '#5cadff', w: 26 });
    B.tex(V(Bp.x + 8, Bp.y - 18), '$b$', { size: 13.5, anchor: 'start', color: '#ff9e4a', w: 26 });
    B.dot(O, 3.4, { fill: '#e8eefc' });

    // 从 a 转到 b 的短弧与转向箭头
    if (!zero) {
      const a1 = Math.atan2(-st.a2, st.a1), a2 = Math.atan2(-st.b2, st.b1);
      const dd = angDiff(a2, a1), rp = .8 * m.s;
      if (Math.abs(dd) > 1e-3) {
        B.dyn.appendChild(mk('path', { d: arcPts(O, a1, a1 + dd, rp, 22), fill: 'none', stroke: '#ffd166', 'stroke-width': 1.5, 'stroke-opacity': .9 }, B.dyn));
        const ae = a1 + dd, E = { x: O.x + rp * Math.cos(ae), y: O.y + rp * Math.sin(ae) };
        const sg = Math.sign(dd) || 1, tx = -Math.sin(ae) * sg, ty = Math.cos(ae) * sg, nx = -ty, ny = tx;
        B.dyn.appendChild(mk('polygon', { points: [E, { x: E.x - 9 * tx + 4 * nx, y: E.y - 9 * ty + 4 * ny }, { x: E.x - 9 * tx - 4 * nx, y: E.y - 9 * ty - 4 * ny }].map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '), fill: '#ffd166', stroke: 'none' }, B.dyn));
      }
    }

    // 右栏：矩阵与读数
    const X = 560;
    B.textM(V(X, 76), '$\\begin{bmatrix}a_1&b_1\\\\a_2&b_2\\end{bmatrix}$', { 'font-size': 17, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(X, 120), `$=\\begin{bmatrix}${fmt(st.a1, 2)}&${fmt(st.b1, 2)}\\\\${fmt(st.a2, 2)}&${fmt(st.b2, 2)}\\end{bmatrix}$`, { 'font-size': 14, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 176), `$D=${fmt(st.a1, 2)}\\times${fmt(st.b2, 2)}-${fmt(st.a2, 2)}\\times${fmt(st.b1, 2)}$`, { 'font-size': 13, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 210), `$D=${fmt(D, 3)}$`, { 'font-size': 17, fill: D > 0 ? '#5cadff' : D < 0 ? '#ff9e4a' : '#ff7b8a', 'text-anchor': 'start' });
    B.textM(V(X, 252), `$S=|D|=${fmt(area, 3)}$`, { 'font-size': 15, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(X, 292), '单位正方形面积 1', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 314), `$\\to$ 面积放大 ${fmt(area, 3)} 倍`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 356), zero ? '含零向量：像压成一条线段' : Math.abs(D) < 1e-6 ? '$D=0$：两列共线，像退化' : D > 0 ? '逆时针：像与原像同向' : '顺时针：像被翻了个面', { 'font-size': 12.5, fill: '#c084fc', 'text-anchor': 'start' });

    cD(`$${fmt(D, 3)}$`);
    cS(`$${fmt(area, 3)}$`);
    cU(area > 1e-9 ? `面积 $${fmt(area, 3)}$ 的平行四边形` : '退化成线段');
    cJ(zero ? '有一列是零向量：平行四边形压坍，行列式必为零'
      : area < 1e-6 ? '两列成比例：平行四边形压成一条线段，行列式为零'
        : D > 0 ? '从 a 逆时针转到 b：面积带正号'
          : '从 a 顺时针转到 b：面积带负号，绝对值才是面积');
  };

  const cl = v => Math.max(-3.2, Math.min(3.2, Math.round(v * 20) / 20));
  B.handle({ color: '#5cadff', r: 7, get: () => V(m.px(st.a1), m.py(st.a2)), set: p => { st.a1 = cl((p.x - m.px(0)) / m.s); st.a2 = cl((m.py(0) - p.y) / m.s); } });
  B.handle({ color: '#ff9e4a', r: 7, get: () => V(m.px(st.b1), m.py(st.b2)), set: p => { st.b1 = cl((p.x - m.px(0)) / m.s); st.b2 = cl((m.py(0) - p.y) / m.s); } });

  const btns = PRE.map((p, i) => B.btnM(p.nm, () => {
    [st.a1, st.a2] = p.a; [st.b1, st.b2] = p.b;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动两支列向量：平行四边形就是单位正方形的像，面积 = |D|');
  B.render();
  return B;
}
