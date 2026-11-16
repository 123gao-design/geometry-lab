/* 图 矩1 · 矩阵的线性运算
   同型矩阵逐元素相加、相减，数乘是每个元素同乘一个数。
   左栏 A 与 B 同型（都是 2×2），对应位置之间用细虚线连起来——
   线性运算的全部内容就是「格子对格子」；转置则是把整张表沿对角线翻过去。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const CW = 56, CH = 44;

export function createBoard(root) {
  const W = 860, H = 400;
  const B = new Board(root, W, H);
  const st = { mode: 0, lam: 2, a11: 2, b21: -1 };
  const A = () => [[st.a11, -1], [3, 2]];
  const Bm = () => [[1, 4], [st.b21, 0]];

  const chipOp = B.chipM('运算'), chipR = B.chipM('结果'), chipT = B.chipM('转置对照'), chipJ = B.chipM('判读');

  const grid = (x0, y0, M, color, tag) => {
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      B.dyn.appendChild(mk('rect', {
        x: x0 + j * CW, y: y0 + i * CH, width: CW, height: CH,
        fill: color, 'fill-opacity': .08, stroke: color, 'stroke-width': 1, 'stroke-opacity': .38,
      }, B.dyn));
      B.text(V(x0 + j * CW + CW / 2, y0 + i * CH + CH / 2 + 6), fmt(M[i][j], 2), { 'font-size': 15, fill: '#aebdd2', 'font-weight': 600 });
    }
    // 左右两枚方括号
    const x1 = x0 + 2 * CW, y1 = y0, y2 = y0 + 2 * CH;
    [[x0 - 9, 1], [x1 + 9, -1]].forEach(([x, s]) => {
      B.seg(V(x, y1 - 5), V(x, y2 + 5), { stroke: color, 'stroke-width': 1.6, 'stroke-opacity': .75 });
      B.seg(V(x, y1 - 5), V(x + s * 8, y1 - 5), { stroke: color, 'stroke-width': 1.6, 'stroke-opacity': .75 });
      B.seg(V(x, y2 + 5), V(x + s * 8, y2 + 5), { stroke: color, 'stroke-width': 1.6, 'stroke-opacity': .75 });
    });
    B.textM(V(x0 + CW, y1 - 22), tag, { 'font-size': 15, fill: color });
  };

  B.renderFn = () => {
    const a = A(), b = Bm();
    const lam = st.lam;
    let R, opTxt;
    if (st.mode === 0) { R = [[a[0][0] + b[0][0], a[0][1] + b[0][1]], [a[1][0] + b[1][0], a[1][1] + b[1][1]]]; opTxt = '$A+B$'; }
    else if (st.mode === 1) { R = [[a[0][0] - b[0][0], a[0][1] - b[0][1]], [a[1][0] - b[1][0], a[1][1] - b[1][1]]]; opTxt = '$A-B$'; }
    else if (st.mode === 2) { R = a.map(r => r.map(v => v * lam)); opTxt = `$${fmt(lam, 1)}A$`; }
    else { R = [[a[0][0], a[1][0]], [a[0][1], a[1][1]]]; opTxt = '$A^{T}$'; }

    grid(96, 130, a, '#5cadff', '$A$');
    grid(300, 130, b, '#ff9e4a', '$B$');
    B.textM(V(254, 156), opTxt, { 'font-size': 20, fill: '#aebdd2' });
    B.textM(V(470, 156), '$=$', { 'font-size': 20, fill: '#aebdd2' });
    grid(520, 130, R, '#4ade80', '$R$');

    // 对应元素之间拉细虚线：线性运算只动格子里的数，不动位置
    if (st.mode !== 3) {
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
        const ya = 130 + i * CH + CH / 2, yb = 130 + i * CH + CH / 2;
        B.dyn.appendChild(mk('line', { x1: 96 + j * CW + CW / 2 + 26, y1: ya, x2: 300 + j * CW + CW / 2 - 26, y2: yb, stroke: '#5c6a80', 'stroke-width': .8, 'stroke-dasharray': '3 4', 'stroke-opacity': .55 }, B.dyn));
      }
    } else {
      // 转置：把 A 的 (i,j) 与 R 的 (j,i) 连起来
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
        B.dyn.appendChild(mk('line', {
          x1: 96 + j * CW + CW / 2 + 26, y1: 130 + i * CH + CH / 2,
          x2: 520 + i * CW + CW / 2 - 26, y2: 130 + j * CH + CH / 2,
          stroke: '#4ade80', 'stroke-width': .9, 'stroke-dasharray': '4 4', 'stroke-opacity': .6,
        }, B.dyn));
      }
    }

    // 右栏说明
    const X = 690;
    B.textM(V(X, 76), '同型矩阵才能相加减', { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 104), '对应元素逐个相加减', { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 148), st.mode === 3 ? '转置：行写成列'
      : st.mode === 2 ? `$r_{ij}=${fmt(lam, 1)}\\,a_{ij}$`
        : st.mode === 0 ? '$r_{ij}=a_{ij}+b_{ij}$' : '$r_{ij}=a_{ij}-b_{ij}$', { 'font-size': 14, fill: '#c084fc', 'text-anchor': 'start' });
    B.textM(V(X, 190), '两条基本性质', { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(X, 216), '$A+B=B+A$', { 'font-size': 13, fill: '#ffd166', 'text-anchor': 'start' });
    // 长式子拆两行，右栏只有 170 px 宽
    B.textM(V(X, 242), '$(A+B)+C$', { 'font-size': 13, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(X, 264), '$=A+(B+C)$', { 'font-size': 13, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(X, 300), `$A^{T}$ 的第 $i$ 行即 $A$ 的第 $i$ 列`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 322), '$(A^{T})^{T}=A$', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    chipOp(st.mode === 0 ? '$A+B$' : st.mode === 1 ? '$A-B$' : st.mode === 2 ? `$${fmt(lam, 1)}A$` : '$A^{T}$');
    chipR(`$\\begin{bmatrix}${fmt(R[0][0], 1)}&${fmt(R[0][1], 1)}\\\\${fmt(R[1][0], 1)}&${fmt(R[1][1], 1)}\\end{bmatrix}$`);
    chipT(st.mode === 3 ? `$a_{12}=${fmt(a[0][1], 1)}$ 搬到第 2 行第 1 列` : '切到 $A^{T}$ 看行列互换');
    chipJ(st.mode === 3 ? '转置不改变元素个数，只把行列对调；两次转置回到原矩阵'
      : st.mode === 2 ? `数乘是整张表乘同一个数，${fmt(lam, 1)}<0 时每个元素连符号一起翻`
        : st.mode === 1 ? '相减仍是逐元素相减，顺序不能颠倒'
          : '相加与顺序无关，逐格对上即可');
  };

  const MARK = () => names.forEach((b, i) => b.classList.toggle('on', st.mode === i));
  const names = [
    B.btnM('$A+B$', () => { st.mode = 0; MARK(); B.render(); }),
    B.btnM('$A-B$', () => { st.mode = 1; MARK(); B.render(); }),
    B.btnM('$\\lambda A$', () => { st.mode = 2; MARK(); B.render(); }),
    B.btnM('$A^{T}$', () => { st.mode = 3; MARK(); B.render(); }),
  ];
  MARK();

  B.slider('λ', -2, 3, .5, st.lam, v => { st.lam = v; B.render(); }, 'la');
  B.slider('a₁₁', -3, 3, .5, st.a11, v => { st.a11 = v; B.render(); }, 'a11');
  B.slider('b₂₁', -3, 3, .5, st.b21, v => { st.b21 = v; B.render(); }, 'b21');

  B.hint('切换四种运算：加减逐格对位，数乘整表同倍，转置把行列对调');
  B.render();
  return B;
}
