/* 图 特2 · 对角化 A = P D P⁻¹
   以特征向量为列拼出 P，矩阵就被拆成三段：换到特征基（P⁻¹）、沿两轴缩放（D）、换回标准基（P）。
   在特征基里，任意点 x 的坐标就是它在两条特征方向上的投影长度 c₁ c₂，变换后同一对坐标乘上 λ₁ λ₂。
   对称矩阵的 P 是正交阵，换基不改变长度，所以椭圆的两条轴正好落在特征方向上。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { l1: 1.7, l2: .5, th: .35, x: { x: 1.5, y: 1.1 } };
  const PRE = [
    { nm: '① 两轴都伸长', l1: 1.7, l2: .55, th: .35 },
    { nm: '② 一正一负', l1: 1.3, l2: -.6, th: .5 },
    { nm: '③ 二重根', l1: 1.1, l2: 1.1, th: 0 },
    { nm: '④ 一个为零', l1: 1.5, l2: 0, th: .8 },
  ];
  const m = B.isoFit(-3.4, 3.4, -2.7, 2.7, [36, 42, 480, 380], 0);
  const cL = B.chipM('特征值'), cD = B.chipM('对角阵 D'), cC = B.chipM('x 的坐标'), cJ = B.chipM('判读');
  const SP = (x, y) => V(m.px(x), m.py(y));

  const basis = () => {
    const c = Math.cos(st.th), s = Math.sin(st.th);
    return { v1: [c, s], v2: [-s, c], c, s };
  };
  const matA = () => {
    const { c, s } = basis();
    const a = st.l1 * c * c + st.l2 * s * s;
    const b = (st.l1 - st.l2) * c * s;
    const d = st.l1 * s * s + st.l2 * c * c;
    return [[a, b], [b, d]];
  };

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, grid: true, labs: true });
    const { v1, v2, c, s } = basis();
    const A = matA();
    const ap = (x, y) => [A[0][0] * x + A[0][1] * y, A[1][0] * x + A[1][1] * y];

    // 单位圆与它的像
    let g = '', e2 = '';
    for (let i = 0; i <= 140; i++) {
      const t = i / 140 * Math.PI * 2;
      const q = SP(Math.cos(t), Math.sin(t));
      g += `${i ? 'L' : 'M'}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
      const [X, Y] = ap(Math.cos(t), Math.sin(t));
      const r = SP(X, Y);
      e2 += `${i ? 'L' : 'M'}${r.x.toFixed(1)} ${r.y.toFixed(1)}`;
    }
    B.dyn.appendChild(mk('path', { d: g, fill: 'none', stroke: '#5c6a80', 'stroke-width': 1.1, 'stroke-dasharray': '5 4', 'stroke-opacity': .6 }, B.dyn));
    B.dyn.appendChild(mk('path', { d: e2 + 'Z', fill: '#5cadff', 'fill-opacity': .08, stroke: '#5cadff', 'stroke-width': 1.9 }, B.dyn));

    // 特征方向
    const ray = (vx, vy, col) => {
      let t = 3.4;
      if (Math.abs(vx) > 1e-9) t = Math.min(t, 3.5 / Math.abs(vx));
      if (Math.abs(vy) > 1e-9) t = Math.min(t, 2.8 / Math.abs(vy));
      B.seg(SP(vx * t, vy * t), SP(-vx * t, -vy * t), { stroke: col, 'stroke-width': 1.4, 'stroke-dasharray': '7 5', 'stroke-opacity': .75 });
    };
    ray(v1[0], v1[1], '#ffd166');
    ray(v2[0], v2[1], '#c084fc');

    // 原像与像
    const X0 = st.x;
    const c1 = X0.x * v1[0] + X0.y * v1[1], c2 = X0.x * v2[0] + X0.y * v2[1];
    const Y1 = [c1 * st.l1 * v1[0] + c2 * st.l2 * v2[0], c1 * st.l1 * v1[1] + c2 * st.l2 * v2[1]];
    const O = SP(0, 0);

    // 沿两条特征方向的分解折线
    const P1 = SP(c1 * v1[0], c1 * v1[1]);
    B.seg(O, P1, { stroke: '#ffd166', 'stroke-width': 2.6, 'stroke-opacity': .9 });
    B.seg(P1, SP(X0.x, X0.y), { stroke: '#c084fc', 'stroke-width': 2.6, 'stroke-opacity': .9 });
    const Q1 = SP(c1 * st.l1 * v1[0], c1 * st.l1 * v1[1]);
    B.seg(O, Q1, { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-opacity': .45, 'stroke-dasharray': '5 4' });
    B.seg(Q1, SP(Y1[0], Y1[1]), { stroke: '#c084fc', 'stroke-width': 1.6, 'stroke-opacity': .45, 'stroke-dasharray': '5 4' });

    B.arrow(O, SP(X0.x, X0.y), { stroke: '#ff9e4a', 'stroke-width': 2.4, head: 11, wide: 5 });
    B.arrow(O, SP(Y1[0], Y1[1]), { stroke: '#4ade80', 'stroke-width': 2.4, head: 11, wide: 5 });
    B.tex(SP(X0.x + .12, X0.y + .18), '$x$', { size: 13, anchor: 'start', color: '#ff9e4a' });
    B.tex(SP(Y1[0] + .14, Y1[1] + .2), '$Ax$', { size: 13, anchor: 'start', color: '#4ade80' });
    B.dot(O, 3.2, { fill: '#aebdd2' });

    // 右栏
    const X = 548;
    B.textM(V(X, 72), `$P=\\begin{bmatrix}${fmt(c, 2)}&${fmt(-s, 2)}\\\\${fmt(s, 2)}&${fmt(c, 2)}\\end{bmatrix}$`, { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 132), `$D=\\begin{bmatrix}${fmt(st.l1, 2)}&0\\\\0&${fmt(st.l2, 2)}\\end{bmatrix}$`, { 'font-size': 12.5, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(X, 192), `$A=PDP^{T}=\\begin{bmatrix}${fmt(A[0][0], 2)}&${fmt(A[0][1], 2)}\\\\${fmt(A[1][0], 2)}&${fmt(A[1][1], 2)}\\end{bmatrix}$`, { 'font-size': 12, fill: '#5cadff', 'text-anchor': 'start' });
    B.textM(V(X, 254), `$x$ 的坐标 $(c_1,c_2)=(${fmt(c1, 2)},\\,${fmt(c2, 2)})$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 276), `$Ax$ 的坐标 $(${fmt(c1 * st.l1, 2)},\\,${fmt(c2 * st.l2, 2)})$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 308), '特征基下只看对角阵：', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 328), '两个坐标各自乘 λ，互不干扰', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 364), Math.abs(st.l1 - st.l2) < 1e-6 ? '二重根：任何方向都是特征方向，D 是纯量阵' : Math.abs(st.l1 * st.l2) < 1e-6 ? '有一个特征值为零：像压成一条直线，A 不可逆' : '两个特征值不同：特征方向唯一确定，P 可逆', { 'font-size': 12, fill: '#c084fc', 'text-anchor': 'start' });

    cL(`$(${fmt(st.l1, 2)},\\ ${fmt(st.l2, 2)})$`);
    cD(`$\\mathrm{diag}(${fmt(st.l1, 2)},\\ ${fmt(st.l2, 2)})$`);
    cC(`$(${fmt(c1, 2)},\\ ${fmt(c2, 2)})$`);
    cJ(Math.abs(st.l1 - st.l2) < 1e-6 ? '两轴倍数相同：椭圆退成圆，特征方向不唯一，任意正交阵都能当 P'
      : Math.abs(st.l1 * st.l2) < 1e-6 ? '一个倍数取零：这一轴的像被压到原点，椭圆退成线段'
        : '金色段与紫色段是 x 沿两条特征方向的分量：换基后变换只是分别乘两个系数');
  };

  B.handle({
    color: '#ff9e4a', r: 7,
    get: () => V(m.px(st.x.x), m.py(st.x.y)),
    set: p => { st.x.x = Math.max(-3.2, Math.min(3.2, (p.x - m.px(0)) / m.s)); st.x.y = Math.max(-2.6, Math.min(2.6, (m.py(0) - p.y) / m.s)); },
  });

  const pre = PRE.map((p, i) => B.btnM(p.nm, () => {
    st.l1 = p.l1; st.l2 = p.l2; st.th = p.th;
    pre.forEach((b, j) => b.classList.toggle('on', j === i));
    sliders.forEach((s, j) => s.sync(j < 2 ? (j ? p.l2 : p.l1) : p.th * 180 / Math.PI));
    B.render();
  }));

  const sliders = [
    B.slider('λ₁', -1.5, 2, .05, st.l1, v => { st.l1 = v; B.render(); }, 'l1'),
    B.slider('λ₂', -1.5, 2, .05, st.l2, v => { st.l2 = v; B.render(); }, 'l2'),
    B.slider('特征基方向', 0, 90, 1, st.th * 180 / Math.PI, v => { st.th = v * Math.PI / 180; B.render(); }, 'th'),
  ];

  B.hint('金紫两条虚线是特征方向；x 沿它们分解，变换只是把两段分别乘 λ');
  B.render();
  return B;
}
