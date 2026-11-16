/* 图 矩3 · 初等变换与高斯消元
   把增广矩阵 (A|b) 用三种初等行变换化成行阶梯形：换行、某行乘非零数、某行的倍数加到另一行。
   每按一次「下一步」走一步，主元格标金，正在被改的那一行标蓝。
   末态的秩决定解的个数：秩 (A) 与秩 (A|b) 不等则无解，相等且小于 3 则无穷多解，等于 3 则唯一。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const CW = 62, CH = 44;
const SETS = [
  { nm: '① 唯一解', M: [[1, 1, 1, 6], [2, -1, 1, 3], [1, 2, -1, 2]] },
  { nm: '② 无穷多解', M: [[1, 1, 1, 3], [1, -1, 2, 2], [2, 0, 3, 5]] },
  { nm: '③ 无解', M: [[1, 1, 1, 3], [1, -1, 2, 2], [2, 0, 3, 6]] },
];

const cp = M => M.map(r => r.slice());

export function createBoard(root) {
  const W = 860, H = 430;
  const B = new Board(root, W, H);
  const st = { set: 0, step: 0 };

  const chipR = B.chipM('秩 (A)'), chipQ = B.chipM('秩 (A|b)'), chipS = B.chipM('解的个数'), chipJ = B.chipM('判读');

  const build = M0 => {
    const M = cp(M0);
    const steps = [{ txt: '增广矩阵 (A|b)：把系数与常数排在一张表里', M: cp(M), piv: [], row: -1 }];
    const piv = [];
    let r = 0;
    for (let c = 0; c < 3 && r < 3; c++) {
      let p = -1, best = 1e-9;
      for (let i = r; i < 3; i++) if (Math.abs(M[i][c]) > best) { best = Math.abs(M[i][c]); p = i; }
      if (p < 0) continue;
      if (p !== r) {
        [M[p], M[r]] = [M[r], M[p]];
        steps.push({ txt: `r_${r + 1} ↔ r_${p + 1}：换行，把非零主元提到第 ${r + 1} 行`, M: cp(M), piv: piv.slice(), row: r });
      }
      const pv = M[r][c];
      piv.push([r, c]);
      for (let i = r + 1; i < 3; i++) {
        const k = M[i][c] / pv;
        if (Math.abs(k) < 1e-9) continue;
        for (let j = c; j < 4; j++) M[i][j] -= k * M[r][j];
        for (let j = 0; j < 4; j++) if (Math.abs(M[i][j]) < 1e-10) M[i][j] = 0;
        steps.push({ txt: `r_${i + 1} ← r_${i + 1} − (${fmt(k, 2)})·r_${r + 1}：消去第 ${c + 1} 列下方`, M: cp(M), piv: piv.slice(), row: i });
      }
      r++;
    }
    // 判型：系数部分全零而常数非零的行意味着矛盾
    let bad = -1;
    for (let i = 0; i < 3; i++) {
      if (Math.abs(M[i][0]) < 1e-9 && Math.abs(M[i][1]) < 1e-9 && Math.abs(M[i][2]) < 1e-9 && Math.abs(M[i][3]) > 1e-9) bad = i;
    }
    const rankA = piv.length, rankB = bad >= 0 ? rankA + 1 : rankA;
    steps.push({ txt: bad >= 0 ? `末行 0=非零：方程组矛盾，无解` : rankA === 3 ? '已化成上三角形：三个主元，唯一解' : `只剩 ${rankA} 个主元：有 ${3 - rankA} 个自由未知量，无穷多解`, M: cp(M), piv: piv.slice(), row: -1 });
    return { steps, rankA, rankB: bad >= 0 ? rankA + 1 : rankA, bad };
  };

  B.renderFn = () => {
    const data = build(SETS[st.set].M);
    const idx = Math.min(st.step, data.steps.length - 1);
    const S = data.steps[idx];
    const x0 = 90, y0 = 132;

    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) {
      const x = x0 + j * CW + (j === 3 ? 16 : 0), y = y0 + i * CH;
      const isPiv = S.piv.some(([ii, jj]) => ii === i && jj === j);
      const isRow = S.row === i;
      B.dyn.appendChild(mk('rect', {
        x, y, width: CW, height: CH,
        fill: isPiv ? '#ffd166' : isRow ? '#5cadff' : '#8fa3bd',
        'fill-opacity': isPiv ? .24 : isRow ? .12 : .05,
        stroke: isPiv ? '#ffd166' : isRow ? '#5cadff' : '#5c6a80',
        'stroke-width': isPiv || isRow ? 1.5 : .8, 'stroke-opacity': isPiv || isRow ? .9 : .4,
      }, B.dyn));
      const v = S.M[i][j];
      B.text(V(x + CW / 2, y + CH / 2 + 6), Math.abs(v) < 1e-9 ? '0' : fmt(v, 2), { 'font-size': 14.5, fill: '#aebdd2' });
    }
    // 增广竖线与两侧方括号
    const yb = y0 - 6, ye = y0 + 3 * CH + 6;
    B.seg(V(x0 + 3 * CW + 8, yb), V(x0 + 3 * CW + 8, ye), { stroke: '#8fa3bd', 'stroke-width': 1.1, 'stroke-dasharray': '5 4', 'stroke-opacity': .6 });
    [[x0 - 12, 1], [x0 + 4 * CW + 16 + 12, -1]].forEach(([x, s]) => {
      B.seg(V(x, yb), V(x, ye), { stroke: '#8fa3bd', 'stroke-width': 1.6, 'stroke-opacity': .75 });
      B.seg(V(x, yb), V(x + s * 9, yb), { stroke: '#8fa3bd', 'stroke-width': 1.6, 'stroke-opacity': .75 });
      B.seg(V(x, ye), V(x + s * 9, ye), { stroke: '#8fa3bd', 'stroke-width': 1.6, 'stroke-opacity': .75 });
    });

    // 步骤说明
    B.textM(V(x0 - 14, 366), `第 ${idx} 步：${S.txt}`, { 'font-size': 13, fill: idx === data.steps.length - 1 ? '#4ade80' : '#c084fc', 'text-anchor': 'start' });

    // 右栏
    const X = 410;
    B.textM(V(X, 96), '三种初等行变换', { 'font-size': 13, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(X, 124), '① 交换两行', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 148), '② 某行乘非零数', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 172), '③ 某行的倍数加到另一行', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 210), '三者都不改变解的集合', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(X, 252), '行阶梯形：主元逐行右移', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(X, 276), '主元个数即矩阵的秩', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    const num = data.bad >= 0 ? '无解' : data.rankA === 3 ? '唯一解' : '无穷多解';
    B.textM(V(X, 316), `解的个数：${num}`, { 'font-size': 15, fill: data.bad >= 0 ? '#ff7b8a' : data.rankA === 3 ? '#4ade80' : '#ffd166', 'text-anchor': 'start' });
    if (data.rankA < 3 && data.bad < 0) B.textM(V(X, 344), `自由未知量 ${3 - data.rankA} 个`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    chipR(`$${data.rankA}$`);
    chipQ(`$${data.rankB}$`);
    chipS(num, data.bad >= 0 ? 'warn' : data.rankA === 3 ? 'ok' : '');
    chipJ(data.bad >= 0 ? '系数全零而常数非零：这一行要求 0 等于一个非零数，方程组无解'
      : data.rankA === 3 ? '秩等于未知量个数：三个主元各自定住一个未知量，解唯一'
        : '秩小于未知量个数：存在自由未知量，解构成一条或一个面');
  };

  const btns = [
    B.btn('下一步', () => { st.step = Math.min(st.step + 1, 99); B.render(); }),
    B.btn('重置', () => { st.step = 0; B.render(); }),
  ];
  const pre = SETS.map((s, i) => B.btn(s.nm, () => {
    st.set = i; st.step = 0;
    pre.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.hint('按「下一步」逐步消元：主元标金，正在改的行标蓝');
  B.render();
  return B;
}
