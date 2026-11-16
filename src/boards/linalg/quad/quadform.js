/* 图 型1 · 二次型与它的曲线
   ax² + bxy + cy² = 1 是一个二次型取值为 1 的等高线。把它写成 xᵀAx（A 对称，交叉项系数减半），
   曲线的形状只由 A 的两个特征值的符号决定：都正 → 椭圆，一正一负 → 双曲线，
   都负 → 空集，有一个为零 → 两条平行直线（或空集）。 */
import { Board, V, mk, fmt, marchSegs } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { a: 1, b: 1.2, c: 1.4 };
  const PRE = [
    { nm: '① 斜椭圆', v: [1, 1.2, 1.4] },
    { nm: '② 圆', v: [1, 0, 1] },
    { nm: '③ 双曲线', v: [1, 0, -1] },
    { nm: '④ 两条平行线', v: [1, 2, 1] },
    { nm: '⑤ 空集', v: [-1, 0, -1] },
  ];
  const m = B.isoFit(-3.1, 3.1, -2.6, 2.6, [36, 40, 460, 386], 0);
  const cM = B.chipM('二次型矩阵'), cD = B.chipM('判别式'), cT = B.chipM('曲线类型'), cJ = B.chipM('判读');
  const SP = (x, y) => V(m.px(x), m.py(y));

  const form = (x, y) => st.a * x * x + st.b * x * y + st.c * y * y - 1;

  const eig = () => {
    const tr = st.a + st.c, det = st.a * st.c - st.b * st.b / 4;
    const disc = (st.a - st.c) * (st.a - st.c) + st.b * st.b;
    const sq = Math.sqrt(disc);
    const l1 = (tr + sq) / 2, l2 = (tr - sq) / 2;
    const v = l => {
      let x = st.b / 2, y = l - st.a;
      if (Math.hypot(x, y) < 1e-9) { x = l - st.c; y = st.b / 2; }
      if (Math.hypot(x, y) < 1e-9) return Math.abs(l - st.a) < 1e-9 ? [1, 0] : [0, 1];
      const n = Math.hypot(x, y); return [x / n, y / n];
    };
    return { tr, det, l1, l2, v1: v(l1), v2: v(l2) };
  };

  const kindOf = E => {
    const eps = 1e-6;
    if (Math.abs(E.det) < eps) return E.tr > eps ? 'degen2' : E.tr < -eps ? 'empty' : 'empty';
    if (E.det > 0) return E.tr > 0 ? 'ellipse' : 'empty';
    return 'hyperbola';
  };

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, grid: true, labs: true });
    const E = eig();
    const kind = kindOf(E);

    // 曲线：隐函数零等值线
    const segs = marchSegs(form, -3.1, -2.6, 3.1, 2.6, 132, 110);
    let d = '';
    segs.forEach(([p, q]) => {
      d += `M${m.px(p.x).toFixed(1)},${m.py(p.y).toFixed(1)}L${m.px(q.x).toFixed(1)},${m.py(q.y).toFixed(1)}`;
    });
    if (d) B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.3, 'stroke-linecap': 'round' }, B.dyn));

    // 特征方向与半轴
    const axis = (v, l, col) => {
      const t = Math.abs(l) > 1e-6 ? 1 / Math.sqrt(Math.abs(l)) : 2.6;
      const tt = Math.min(t, 2.9);
      B.seg(SP(v[0] * tt, v[1] * tt), SP(-v[0] * tt, -v[1] * tt), { stroke: col, 'stroke-width': 1.5, 'stroke-dasharray': '7 5', 'stroke-opacity': .85 });
      if (l > 1e-6) {
        B.dot(SP(v[0] * t, v[1] * t), 4.5, { fill: col });
        B.dot(SP(-v[0] * t, -v[1] * t), 4.5, { fill: col });
      }
    };
    if (kind === 'ellipse' || kind === 'hyperbola') {
      axis(E.v1, E.l1, '#ffd166');
      axis(E.v2, E.l2, '#c084fc');
    } else if (kind === 'degen2') {
      axis(E.v1, E.l1, '#ffd166');
    }
    B.dot(SP(0, 0), 3.2, { fill: '#aebdd2' });

    // 右栏
    const X = 528;
    B.textM(V(X, 66), '$ax^2+bxy+cy^2=1$', { 'font-size': 14, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(X, 98), `$A=\\begin{bmatrix}${fmt(st.a, 1)}&${fmt(st.b / 2, 1)}\\\\${fmt(st.b / 2, 1)}&${fmt(st.c, 1)}\\end{bmatrix}$`, { 'font-size': 13, fill: '#5cadff', 'text-anchor': 'start' });
    B.textM(V(X, 148), `$\\lambda=(${fmt(E.l1, 2)},\\ ${fmt(E.l2, 2)})$`, { 'font-size': 12.5, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(X, 172), `$\\det A=${fmt(E.det, 2)},\\quad \\mathrm{tr}\\,A=${fmt(E.tr, 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    const name = { ellipse: '椭圆', hyperbola: '双曲线', degen2: '两条平行直线', empty: '空集（无实曲线）' }[kind];
    B.textM(V(X, 210), name, { 'font-size': 15, fill: kind === 'ellipse' ? '#5cadff' : kind === 'hyperbola' ? '#4ade80' : '#ff7b8a', 'text-anchor': 'start' });

    const ax = kind === 'ellipse' ? Math.sqrt(1 / Math.abs(E.l1)) : 0;
    const bx = kind === 'ellipse' ? Math.sqrt(1 / Math.abs(E.l2)) : 0;
    if (kind === 'ellipse') {
      B.textM(V(X, 244), `$a^2=1/\\lambda_1=${fmt(1 / E.l1, 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.textM(V(X, 266), `$b^2=1/\\lambda_2=${fmt(1 / E.l2, 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.textM(V(X, 288), `半轴 $${fmt(ax, 2)},\\ ${fmt(bx, 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    } else if (kind === 'hyperbola') {
      const p = Math.abs(E.l1) > Math.abs(E.l2) ? E.l1 : E.l2, q = p === E.l1 ? E.l2 : E.l1;
      B.textM(V(X, 244), `$x'^2/a^2-y'^2/b^2=1$，$a^2=1/${fmt(p, 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.textM(V(X, 266), `$b^2=1/${fmt(Math.abs(q), 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    }

    B.textM(V(X, 322), kind === 'ellipse' ? '两个特征值同正：二次型正定，等值线是闭合椭圆'
      : kind === 'hyperbola' ? '两个特征值异号：二次型不定，等值线是两支曲线'
        : kind === 'degen2' ? '有一个特征值为零：二次型退化成一个完全平方'
          : '两个特征值同负：左边永远为负，等号右边是 1，没有实数解', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    cM(`$\\begin{bmatrix}${fmt(st.a, 1)}&${fmt(st.b / 2, 1)}\\\\${fmt(st.b / 2, 1)}&${fmt(st.c, 1)}\\end{bmatrix}$`);
    cD(`$${fmt(E.det, 2)}$`);
    cT(name, kind === 'ellipse' ? 'ok' : kind === 'hyperbola' ? 'ok' : 'warn');
    cJ(kind === 'ellipse' ? '正定：λ₁ λ₂ 同为正，曲线被夹在两轴之间'
      : kind === 'hyperbola' ? '不定：λ₁ λ₂ 一正一负，两个方向一个放大一个翻转'
        : kind === 'degen2' ? '半正定：有一个 λ 为零，二次型只剩一个方向'
          : '负定：任何非零向量代进去都是负数，凑不出 1');
  };

  const pre = PRE.map((p, i) => B.btnM(p.nm, () => {
    [st.a, st.b, st.c] = p.v;
    pre.forEach((b, j) => b.classList.toggle('on', j === i));
    sliders.forEach((s, j) => s.sync(p.v[j]));
    B.render();
  }));

  const sliders = [
    B.slider('a', -2, 2, .1, st.a, v => { st.a = v; B.render(); }, 'a'),
    B.slider('b', -2, 2, .1, st.b, v => { st.b = v; B.render(); }, 'b'),
    B.slider('c', -2, 2, .1, st.c, v => { st.c = v; B.render(); }, 'c'),
  ];

  B.hint('交叉项系数取一半进矩阵：曲线的类型只看两个特征值的符号');
  // 出口：把当前 a b c 带到自由画板，隐式方程与矩阵一起给出
  // 特征向量不送过去：Eigenvectors / Eigenvalues 在 GeoGebra 里只有 CAS 视图能用，图形计算器会弹错误框
  B.ggbOutlet(() => [
    `a=${fmt(st.a, 2)}`, `b=${fmt(st.b, 2)}`, `c=${fmt(st.c, 2)}`,
    'eq:a x^2+b x y+c y^2=1',
    `M={{${fmt(st.a, 2)},${fmt(st.b / 2, 2)}},{${fmt(st.b / 2, 2)},${fmt(st.c, 2)}}}`,
  ]);
  B.render();
  return B;
}
