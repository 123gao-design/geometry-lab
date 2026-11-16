/* 图 特1 · 特征方向与特征值
   单位圆被 2×2 矩阵映成椭圆。椭圆上有点的位置与原来的方向重合——
   那些方向就是特征方向：只被伸长或缩短 λ 倍，不被转向。
   拖动 a b c d 改矩阵；当矩阵是旋转时，椭圆与圆同心同形，一个实特征方向也没有。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { a: 1.4, b: .6, c: .6, d: .8 };
  const PRE = [
    { nm: '① 对角伸缩', m: [1.7, 0, 0, .6] },
    { nm: '② 一般矩阵', m: [1.2, .75, .75, .8] },
    { nm: '③ 剪切', m: [1, 1, 0, 1] },
    { nm: '④ 旋转 $90^\\circ$', m: [0, -1, 1, 0] },
  ];
  const m = B.isoFit(-3.4, 3.4, -2.7, 2.7, [36, 42, 480, 380], 0);
  const cM = B.chipM('矩阵'), cV = B.chipM('迹与行列式'), cL = B.chipM('特征值'), cJ = B.chipM('判读');

  const ap = (x, y) => [st.a * x + st.b * y, st.c * x + st.d * y];
  const SP = (x, y) => V(m.px(x), m.py(y));

  const eigen = () => {
    const tr = st.a + st.d, det = st.a * st.d - st.b * st.c;
    const disc = tr * tr - 4 * det;
    if (disc < -1e-9) return { tr, det, disc, none: true };
    const sq = Math.sqrt(Math.max(0, disc));
    const l1 = (tr + sq) / 2, l2 = (tr - sq) / 2;
    const vec = l => {
      let x = st.b, y = l - st.a;
      if (Math.hypot(x, y) < 1e-9) { x = l - st.d; y = st.c; }
      if (Math.hypot(x, y) < 1e-9) return Math.abs(l - st.a) < 1e-9 ? [1, 0] : [0, 1];
      const n = Math.hypot(x, y);
      return [x / n, y / n];
    };
    return { tr, det, disc, l1, l2, v1: vec(l1), v2: vec(l2) };
  };

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, grid: true, labs: true });
    const E = eigen();

    // 单位圆（原像）
    let d1 = '';
    for (let i = 0; i <= 120; i++) {
      const t = i / 120 * Math.PI * 2;
      const p = SP(Math.cos(t), Math.sin(t));
      d1 += `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
    B.dyn.appendChild(mk('path', { d: d1, fill: 'none', stroke: '#5c6a80', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .7 }, B.dyn));

    // 单位圆的像：椭圆
    let d2 = '';
    for (let i = 0; i <= 160; i++) {
      const t = i / 160 * Math.PI * 2;
      const [x, y] = ap(Math.cos(t), Math.sin(t));
      const p = SP(x, y);
      d2 += `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`;
    }
    B.dyn.appendChild(mk('path', { d: d2 + 'Z', fill: '#5cadff', 'fill-opacity': .09, stroke: '#5cadff', 'stroke-width': 2.1 }, B.dyn));

    // 特征方向：整条直线 + 单位向量与其像的箭头
    const lineThrough = (vx, vy, col) => {
      let t = 1;
      if (Math.abs(vx) > 1e-9) t = Math.min(t, 3.5 / Math.abs(vx));
      if (Math.abs(vy) > 1e-9) t = Math.min(t, 2.8 / Math.abs(vy));
      const P1 = SP(vx * t, vy * t), P2 = SP(-vx * t, -vy * t);
      B.seg(P1, P2, { stroke: col, 'stroke-width': 1.5, 'stroke-dasharray': '7 5', 'stroke-opacity': .8 });
    };

    if (!E.none) {
      lineThrough(E.v1[0], E.v1[1], '#ffd166');
      if (E.disc > 1e-6) lineThrough(E.v2[0], E.v2[1], '#c084fc');

      const O = SP(0, 0);
      B.arrow(O, SP(E.v1[0], E.v1[1]), { stroke: '#ffd166', 'stroke-width': 1.6, head: 9, wide: 4.5 });
      B.arrow(O, SP(E.l1 * E.v1[0], E.l1 * E.v1[1]), { stroke: '#ffd166', 'stroke-width': 2.6, head: 12, wide: 5.5 });
      if (E.disc > 1e-6) {
        B.arrow(O, SP(E.v2[0], E.v2[1]), { stroke: '#c084fc', 'stroke-width': 1.6, head: 9, wide: 4.5 });
        B.arrow(O, SP(E.l2 * E.v2[0], E.l2 * E.v2[1]), { stroke: '#c084fc', 'stroke-width': 2.6, head: 12, wide: 5.5 });
      }
    }
    B.dot(SP(0, 0), 3.2, { fill: '#aebdd2' });

    // 右栏
    const X = 548;
    B.textM(V(X, 74), '$A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$', { 'font-size': 14, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(X, 112), `$=\\begin{bmatrix}${fmt(st.a, 2)}&${fmt(st.b, 2)}\\\\${fmt(st.c, 2)}&${fmt(st.d, 2)}\\end{bmatrix}$`, { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 152), `$\\mathrm{tr}\\,A=${fmt(E.tr, 2)},\\quad \\det A=${fmt(E.det, 2)}$`, { 'font-size': 12.5, fill: '#67e8f9', 'text-anchor': 'start' });
    B.textM(V(X, 186), `$\\Delta=\\mathrm{tr}^2-4\\det=${fmt(E.tr * E.tr - 4 * E.det, 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    if (E.none) {
      B.textM(V(X, 224), '没有实特征值', { 'font-size': 13.5, fill: '#ff7b8a', 'text-anchor': 'start' });
      B.textM(V(X, 258), '每个方向都被转过一个角', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.textM(V(X, 280), '圆被映成同心的椭圆', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    } else {
      B.textM(V(X, 224), `$\\lambda_1=${fmt(E.l1, 2)}$`, { 'font-size': 13, fill: '#ffd166', 'text-anchor': 'start' });
      B.textM(V(X, 250), `$\\lambda_2=${fmt(E.l2, 2)}$`, { 'font-size': 13, fill: '#c084fc', 'text-anchor': 'start' });
      B.textM(V(X, 284), `$v_1=(${fmt(E.v1[0], 2)},\\,${fmt(E.v1[1], 2)})$`, { 'font-size': 11.5, fill: '#ffd166', 'text-anchor': 'start' });
      if (E.disc > 1e-6) B.textM(V(X, 306), `$v_2=(${fmt(E.v2[0], 2)},\\,${fmt(E.v2[1], 2)})$`, { 'font-size': 11.5, fill: '#c084fc', 'text-anchor': 'start' });
      else B.textM(V(X, 306), '二重根：一个特征方向', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.textM(V(X, 344), `$A v_i=\\lambda_i v_i$：方向不变，长度乘 ${fmt(E.l1, 2)}`, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    }
    B.textM(V(X, 376), '椭圆的两条轴正好沿特征方向', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 400), '轴的半长就是两个特征值的绝对值', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    cM(`$\\begin{bmatrix}${fmt(st.a, 1)}&${fmt(st.b, 1)}\\\\${fmt(st.c, 1)}&${fmt(st.d, 1)}\\end{bmatrix}$`);
    cV(`$\\mathrm{tr}=${fmt(E.tr, 2)},\\ \\det=${fmt(E.det, 2)}$`);
    cL(E.none ? '无实特征值' : `$\\lambda=(${fmt(E.l1, 2)},\\ ${fmt(E.l2, 2)})$`, E.none ? 'warn' : '');
    cJ(E.none ? '判别式小于零：矩阵把每个方向都转了一个角，找不到不动方向'
      : E.disc < 1e-6 ? `二重特征值 ${fmt(E.l1, 2)}：只有一条不动线，其余方向仍被转向`
        : '金紫两条虚线是特征方向：沿它们的向量只伸缩，不转向');
  };

  const pre = PRE.map((p, i) => B.btnM(p.nm, () => {
    [st.a, st.b, st.c, st.d] = p.m;
    pre.forEach((b, j) => b.classList.toggle('on', j === i));
    sliders.forEach((s, j) => s.sync(p.m[j]));
    B.render();
  }));

  const sliders = [
    B.slider('a', -1.5, 2, .05, st.a, v => { st.a = v; B.render(); }, 'a'),
    B.slider('b', -1.5, 2, .05, st.b, v => { st.b = v; B.render(); }, 'b'),
    B.slider('c', -1.5, 2, .05, st.c, v => { st.c = v; B.render(); }, 'c'),
    B.slider('d', -1.5, 2, .05, st.d, v => { st.d = v; B.render(); }, 'd'),
  ];

  B.hint('单位圆映成椭圆：金紫两条虚线方向只伸缩，长度乘 λ');
  B.render();
  return B;
}
