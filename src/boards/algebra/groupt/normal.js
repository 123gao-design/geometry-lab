import { Board, V } from '../../../lib/board.js';

/* 正规子群：S_3 里取 H = ⟨(12)⟩ 或 A_3，逐行比较左陪集 gH 与右陪集 Hg。
   两者处处相同才算正规；A_3 是符号同态的核，因此正规，商群阶为 2。 */
const PERM = [[1, 2, 3], [2, 1, 3], [3, 2, 1], [1, 3, 2], [2, 3, 1], [3, 1, 2]];
const NAMES = ['e', '(12)', '(13)', '(23)', '(123)', '(132)'];
const comp = (i, j) => {
  const r = PERM[j].map(k => PERM[i][k - 1]);
  return PERM.findIndex(p => p[0] === r[0] && p[1] === r[1] && p[2] === r[2]);
};
const SUB = [
  { n: 'H = ⟨(12)⟩', idx: [0, 1] },
  { n: 'H = A₃', idx: [0, 4, 5] },
];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { s: 0 };
  const cO = B.chipM('阶 |H|');
  const cN = B.chipM('正规');
  const cQ = B.chipM('商群阶');

  B.renderFn = () => {
    const H = SUB[st.s].idx, n = H.length;
    const left = [], right = [], seenL = new Set(), seenR = new Set();
    for (let g = 0; g < 6; g++) {
      const L = [...new Set(H.map(h => comp(g, h)))].sort((a, b) => a - b);
      const R = [...new Set(H.map(h => comp(h, g)))].sort((a, b) => a - b);
      const kL = L.join(','), kR = R.join(',');
      if (!seenL.has(kL)) { seenL.add(kL); left.push({ g, set: L }); }
      if (!seenR.has(kR)) { seenR.add(kR); right.push({ g, set: R }); }
    }
    const normal = left.length === right.length && left.every((l, i) => l.set.join(',') === right[i].set.join(','));

    B.textM(V(410, 32), '左陪集 gH 与右陪集 Hg 逐行对照', { 'font-size': 15, fill: '#8fa3bd' });
    B.text(V(236, 78), '左陪集 gH', { 'font-size': 13, fill: '#67e8f9', 'text-anchor': 'middle' });
    B.text(V(596, 78), '右陪集 Hg', { 'font-size': 13, fill: '#c084fc', 'text-anchor': 'middle' });
    left.forEach((it, i) => { B.tex(V(90, 118 + i * 48), `${NAMES[it.g]}H = {${it.set.map(k => NAMES[k]).join(', ')}}`, { size: 13, color: '#67e8f9', w: 300 }); });
    right.forEach((it, i) => { B.tex(V(460, 118 + i * 48), `H${NAMES[it.g]} = {${it.set.map(k => NAMES[k]).join(', ')}}`, { size: 13, color: '#c084fc', w: 320 }); });
    if (normal) {
      left.forEach((_, i) => B.text(V(430, 114 + i * 48), '=', { 'font-size': 15, fill: '#4ade80', 'text-anchor': 'middle' }));
    } else {
      left.forEach((it, i) => {
        const r = right[i];
        const same = r && it.set.join(',') === r.set.join(',');
        B.text(V(430, 114 + i * 48), same ? '=' : '≠', { 'font-size': 15, fill: same ? '#4ade80' : '#ff7b8a', 'text-anchor': 'middle' });
      });
    }
    B.tex(V(410, 310), normal ? `gH = Hg 处处成立：H 是正规子群，S_3/H 阶为 ${6 / n}` : '有 g 使 gH ≠ Hg：H 不是正规子群，商集不能继承群运算', { size: 13, color: normal ? '#4ade80' : '#ff7b8a', anchor: 'mid', w: 620 });
    B.tex(V(410, 350), normal ? '符号同态的核 ker(sgn) = A₃，核总是正规的' : '共轭 gHg⁻¹ 把 H 搬到另一个子群，陪集结构被破坏', { size: 12, color: '#8fa3bd', anchor: 'mid', w: 620 });
    B.tex(V(410, 392), '正规的判据：对每个 g，gH = Hg；等价于 gHg⁻¹ = H', { size: 12, color: '#c084fc', anchor: 'mid', w: 620 });

    cO(`${n}`);
    cN(normal ? '是' : '否');
    cQ(normal ? `${6 / n}` : '—');
  };

  SUB.forEach((s, i) => B.btn(s.n, () => { st.s = i; B.render(); }));
  B.hint('⟨(12)⟩ 的左右陪集对不上；换成 A₃，两列逐行相等');
  B.render();
  return B;
}
