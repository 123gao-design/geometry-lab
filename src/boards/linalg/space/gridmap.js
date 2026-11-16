/* 图 空1 · 矩阵与二维线性变换
   矩阵 [[a,b],[c,d]] 把 e₁ 送到第一列、把 e₂ 送到第二列，于是整张整数格网被拉成另一张平行四边形格网。
   金色是原来的单位正方形，蓝色是它的像；两列的落点就是 (a,c) 与 (b,d)。
   四个滑块随手改一个元素，格网的歪斜方向跟着变，行列式（面积倍数）同步读出。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { a: 1, b: .5, c: .3, d: 1.1 };
  const PRE = [
    { nm: '① 恒等', m: [1, 0, 0, 1] },
    { nm: '② 旋转 $30^\\circ$', m: [Math.cos(Math.PI / 6), -Math.sin(Math.PI / 6), Math.sin(Math.PI / 6), Math.cos(Math.PI / 6)] },
    { nm: '③ 剪切', m: [1, 1.1, 0, 1] },
    { nm: '④ 投影', m: [1, 0, 0, 0] },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.6, 3.6, [40, 44, 460, 360], 0);
  const cM = B.chipM('矩阵'), cD = B.chipM('行列式'), cS = B.chipM('面积倍数'), cJ = B.chipM('判读');

  const tp = (x, y) => [st.a * x + st.b * y, st.c * x + st.d * y];

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, grid: true, labs: true });
    const O = V(m.px(0), m.py(0));
    const det = st.a * st.d - st.b * st.c;

    // 原格网：灰色虚线，作为对照
    for (let k = -4; k <= 4; k++) {
      B.dyn.appendChild(mk('line', { x1: m.px(k), y1: m.py(-3.6), x2: m.px(k), y2: m.py(3.6), stroke: '#5c6a80', 'stroke-width': .8, 'stroke-dasharray': '4 5', 'stroke-opacity': .45 }, B.dyn));
      B.dyn.appendChild(mk('line', { x1: m.px(-4.6), y1: m.py(k), x2: m.px(4.6), y2: m.py(k), stroke: '#5c6a80', 'stroke-width': .8, 'stroke-dasharray': '4 5', 'stroke-opacity': .45 }, B.dyn));
    }

    // 像格网：整条直线变换后仍是直线，取两端点连一段即可
    const seg = (p, q, col, op) => {
      const [x1, y1] = tp(p[0], p[1]), [x2, y2] = tp(q[0], q[1]);
      B.seg(V(m.px(x1), m.py(y1)), V(m.px(x2), m.py(y2)), { stroke: col, 'stroke-width': 1, 'stroke-opacity': op });
    };
    for (let k = -4; k <= 4; k++) {
      seg([k, -4], [k, 4], '#5cadff', .38);
      seg([-4, k], [4, k], '#67e8f9', .38);
    }

    // 单位正方形的像
    const img = [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => tp(x, y));
    B.dyn.appendChild(mk('polygon', {
      points: img.map(([x, y]) => `${m.px(x).toFixed(1)},${m.py(y).toFixed(1)}`).join(' '),
      fill: det < 0 ? '#ff9e4a' : '#5cadff', 'fill-opacity': .18, stroke: '#5cadff', 'stroke-width': 1.3, 'stroke-opacity': .8,
    }, B.dyn));
    B.dyn.appendChild(mk('polygon', {
      points: [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, y]) => `${m.px(x).toFixed(1)},${m.py(y).toFixed(1)}`).join(' '),
      fill: 'none', stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '5 4', 'stroke-opacity': .85,
    }, B.dyn));

    // 基向量的像
    const E1 = V(m.px(st.a), m.py(st.c)), E2 = V(m.px(st.b), m.py(st.d));
    B.arrow(O, E1, { stroke: '#5cadff', 'stroke-width': 2.3, head: 11, wide: 5 });
    B.arrow(O, E2, { stroke: '#ff9e4a', 'stroke-width': 2.3, head: 11, wide: 5 });
    B.tex(V(E1.x + 7, E1.y + 16), `$e_1\\mapsto(${fmt(st.a, 2)},\\,${fmt(st.c, 2)})$`, { size: 12, anchor: 'start', color: '#5cadff', w: 132 });
    B.tex(V(E2.x + 7, E2.y - 14), `$e_2\\mapsto(${fmt(st.b, 2)},\\,${fmt(st.d, 2)})$`, { size: 12, anchor: 'start', color: '#ff9e4a', w: 132 });
    B.dot(O, 3.2, { fill: '#aebdd2' });

    // 右栏
    const X = 536;
    B.textM(V(X, 76), '$A=\\begin{bmatrix}a&b\\\\c&d\\end{bmatrix}$', { 'font-size': 15, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(X, 116), `$=\\begin{bmatrix}${fmt(st.a, 2)}&${fmt(st.b, 2)}\\\\${fmt(st.c, 2)}&${fmt(st.d, 2)}\\end{bmatrix}$`, { 'font-size': 14, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 162), `$\\det A=${fmt(det, 3)}$`, { 'font-size': 16, fill: Math.abs(det) < 1e-6 ? '#ff7b8a' : det > 0 ? '#5cadff' : '#ff9e4a', 'text-anchor': 'start' });
    B.textM(V(X, 194), `面积倍数 $|\\det A|=${fmt(Math.abs(det), 3)}$`, { 'font-size': 12.5, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(X, 232), '第一列 = $e_1$ 的像', { 'font-size': 12, fill: '#5cadff', 'text-anchor': 'start' });
    B.textM(V(X, 254), '第二列 = $e_2$ 的像', { 'font-size': 12, fill: '#ff9e4a', 'text-anchor': 'start' });
    B.textM(V(X, 292), Math.abs(det) < 1e-6 ? '像压成一条直线：不可逆' : Math.abs(det) < 1 ? '网格被挤紧：面积缩小' : '网格被拉开：面积放大', { 'font-size': 12.5, fill: '#c084fc', 'text-anchor': 'start' });
    B.textM(V(X, 330), det < 0 ? '行列式为负：整个平面翻了面' : '行列式为正：定向没有改变', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    cM(`$\\begin{bmatrix}${fmt(st.a, 1)}&${fmt(st.b, 1)}\\\\${fmt(st.c, 1)}&${fmt(st.d, 1)}\\end{bmatrix}$`);
    cD(`$${fmt(det, 3)}$`);
    cS(`$${fmt(Math.abs(det), 3)}$`);
    cJ(Math.abs(det) < 1e-6 ? '两列共线：像格网退化成一条直线，变换不可逆'
      : st.a === 1 && st.b === 0 && st.c === 0 && st.d === 1 ? '单位阵：格网原地不动'
        : det < 0 ? '两列一左一右：格网被翻面，面积倍数取绝对值'
          : '原点不动，两条基向量各走各的，其余点由线性性跟上');
  };

  const pre = PRE.map((p, i) => B.btnM(p.nm, () => {
    [st.a, st.b, st.c, st.d] = p.m;
    pre.forEach((b, j) => b.classList.toggle('on', j === i));
    sliders.forEach((s, j) => s.sync(p.m[j]));
    B.render();
  }));

  const sliders = [
    B.slider('a', -2, 2, .1, st.a, v => { st.a = v; B.render(); }, 'a'),
    B.slider('b', -2, 2, .1, st.b, v => { st.b = v; B.render(); }, 'b'),
    B.slider('c', -2, 2, .1, st.c, v => { st.c = v; B.render(); }, 'c'),
    B.slider('d', -2, 2, .1, st.d, v => { st.d = v; B.render(); }, 'd'),
  ];

  B.hint('拖动滑块改矩阵：格网被拉成平行四边形，面积倍数 = |det|');
  // 出口：把当前矩阵和单位正方形一起带过去，GeoGebra 里能看到同一个变换
  B.ggbOutlet(() => [
    `a=${fmt(st.a, 2)}`, `b=${fmt(st.b, 2)}`, `c=${fmt(st.c, 2)}`, `d=${fmt(st.d, 2)}`,
    'A=(0,0)', 'B=(1,0)', 'C=(1,1)', 'D=(0,1)', 'q=Polygon(A,B,C,D)',
    `M={{${fmt(st.a, 2)},${fmt(st.b, 2)}},{${fmt(st.c, 2)},${fmt(st.d, 2)}}}`,
    'q2=ApplyMatrix(M,q)',
  ]);
  B.render();
  return B;
}
