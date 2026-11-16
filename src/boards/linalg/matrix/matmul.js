/* 图 矩2 · 矩阵乘法与转置
   C=AB 的第 (i,j) 个元素是「A 的第 i 行」与「B 的第 j 列」逐项相乘再相加。
   拖 k 轴扫过四个元素：被选中的行、列各染一色，落点在 C 里被框出来。
   下方同时算出 BA——同一对矩阵换个顺序，结果通常不同，所以 AB≠BA。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const CW = 54, CH = 42;

export function createBoard(root) {
  const W = 860, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, mode: 0 };
  const SET = [
    { A: [[2, 1], [-1, 3]], B: [[1, 4], [2, 1]] },
    { A: [[1, 1], [0, 1]], B: [[1, 2], [0, 1]] },
    { A: [[2, 1], [-1, 3]], B: [[1, 0], [0, 1]] },
  ];

  const chipK = B.chipM('当前元素'), chipV = B.chipM('乘积之和'), chipC = B.chipM('$AB\\ne BA$'), chipJ = B.chipM('判读');

  const mul = (X, Y) => {
    const R = [[0, 0], [0, 0]];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) R[i][j] = X[i][0] * Y[0][j] + X[i][1] * Y[1][j];
    return R;
  };

  const grid = (x0, y0, M, color, tag, hi) => {
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const x = x0 + j * CW, y = y0 + i * CH;
      B.dyn.appendChild(mk('rect', { x, y, width: CW, height: CH, fill: color, 'fill-opacity': .07, stroke: color, 'stroke-width': 1, 'stroke-opacity': .35 }, B.dyn));
      B.text(V(x + CW / 2, y + CH / 2 + 5), fmt(M[i][j], 1), { 'font-size': 14, fill: '#aebdd2' });
      if (hi && hi(i, j)) {
        B.dyn.appendChild(mk('rect', { x, y, width: CW, height: CH, fill: color, 'fill-opacity': .22, stroke: color, 'stroke-width': 1.8, 'stroke-opacity': .95 }, B.dyn));
      }
    }
    const x1 = x0 + 2 * CW, y1 = y0, y2 = y0 + 2 * CH;
    [[x0 - 9, 1], [x1 + 9, -1]].forEach(([x, s]) => {
      B.seg(V(x, y1 - 5), V(x, y2 + 5), { stroke: color, 'stroke-width': 1.5, 'stroke-opacity': .7 });
      B.seg(V(x, y1 - 5), V(x + s * 8, y1 - 5), { stroke: color, 'stroke-width': 1.5, 'stroke-opacity': .7 });
      B.seg(V(x, y2 + 5), V(x + s * 8, y2 + 5), { stroke: color, 'stroke-width': 1.5, 'stroke-opacity': .7 });
    });
    B.textM(V(x0 + CW, y1 - 20), tag, { 'font-size': 15, fill: color });
  };

  B.renderFn = () => {
    const { A, B: Bx } = SET[st.mode];
    const C = mul(A, Bx), BA = mul(Bx, A);
    const i = Math.floor(st.k / 2), j = st.k % 2;

    grid(60, 118, A, '#5cadff', '$A$', (r, c) => r === i);
    B.textM(V(196, 140), '$\\times$', { 'font-size': 18, fill: '#aebdd2' });
    grid(222, 118, Bx, '#ff9e4a', '$B$', (r, c) => c === j);
    B.textM(V(360, 140), '$=$', { 'font-size': 18, fill: '#aebdd2' });
    grid(386, 118, C, '#4ade80', '$C=AB$', (r, c) => r === i && c === j);

    // 算式
    const X = 560;
    B.textM(V(X, 72), `$c_{${i + 1}${j + 1}}=a_{${i + 1}1}b_{1${j + 1}}+a_{${i + 1}2}b_{2${j + 1}}$`, { 'font-size': 13.5, fill: '#c084fc', 'text-anchor': 'start' });
    B.textM(V(X, 104), `$=${fmt(A[i][0], 1)}\\times${fmt(Bx[0][j], 1)}+${fmt(A[i][1], 1)}\\times${fmt(Bx[1][j], 1)}$`, { 'font-size': 13, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 142), `$c_{${i + 1}${j + 1}}=${fmt(C[i][j], 2)}$`, { 'font-size': 16, fill: '#4ade80', 'text-anchor': 'start' });
    B.textM(V(X, 186), '乘法规则', { 'font-size': 12, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(X, 210), '行乘列，逐项相加', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 232), '$A$ 的列数 = $B$ 的行数', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 268), '$(AB)^{T}=B^{T}A^{T}$', { 'font-size': 12.5, fill: '#ffd166', 'text-anchor': 'start' });

    // 下方：同一对矩阵换个顺序乘
    const Y = 292;
    grid(120, Y, BA, '#c084fc', '$BA$', null);
    const same = C.every((r, ii) => r.every((v, jj) => Math.abs(v - BA[ii][jj]) < 1e-9));
    B.textM(V(300, Y + 44), same ? '与 $AB$ 相同：这对矩阵可交换' : '与 $AB$ 不同：乘法不满足交换律', { 'font-size': 12.5, fill: same ? '#4ade80' : '#ff7b8a', 'text-anchor': 'start' });

    chipK(`$c_{${i + 1}${j + 1}}$`);
    chipV(`$${fmt(A[i][0], 1)}\\times${fmt(Bx[0][j], 1)}+${fmt(A[i][1], 1)}\\times${fmt(Bx[1][j], 1)}=${fmt(C[i][j], 2)}$`);
    chipC(`${fmt(C[0][0], 1)} 对 ${fmt(BA[0][0], 1)}`, same ? 'ok' : 'warn');
    chipJ(same ? '这一对矩阵恰好可交换：AB=BA，但可交换是特例不是通例'
      : st.mode === 0 ? '拖 k 扫过四个元素：每次取 A 的一行、B 的一列，结果落在交叉处'
        : '这对矩阵的可交换性是巧合之外的特例；一般情形下换个顺序答案就变');
  };

  const btns = [
    B.btn('① 一般', () => { st.mode = 0; sync(); }),
    B.btn('② 可交换', () => { st.mode = 1; sync(); }),
    B.btn('③ 单位阵', () => { st.mode = 2; sync(); }),
  ];
  const sync = () => { btns.forEach((b, i) => b.classList.toggle('on', st.mode === i)); B.render(); };
  sync();

  B.slider('扫描 k', 0, 3, 1, st.k, v => { st.k = v; B.render(); }, 'k');

  B.hint('拖 k 扫过四个元素：A 的一行乘 B 的一列，结果落在交叉处');
  B.render();
  return B;
}
