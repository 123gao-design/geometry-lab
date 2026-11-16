import { Board, V } from '../../../lib/board.js';

/* 同态与同构：φ: Z_12 → Z_m，x ↦ x mod m。
   核是被压到 0 的那些元素，模型是每个像点下的原像条；m=12 时映射成为同构。 */
const MS = [2, 3, 4, 6, 12];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { m: 3 };
  const cK = B.chipM('核');
  const cI = B.chipM('像');
  const cJ = B.chipM('同构');

  B.renderFn = () => {
    const m = st.m, N = 12;
    const xL = 120, xR = 700, yT = 128, yB = 300;
    const px = i => xL + (xR - xL) * i / (N - 1);
    const qx = j => xL + (xR - xL) * j / (m - 1);
    B.textM(V(410, 30), `φ: $\\mathbb{Z}_{12}\\to\\mathbb{Z}_{${m}}$，φ(x) = x mod ${m}`, { 'font-size': 15, fill: '#8fa3bd' });
    B.text(V(xL - 34, yT + 4), '定义域', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'end' });
    B.text(V(xL - 34, yB + 4), '陪域', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'end' });

    for (let x = 0; x < N; x++) {
      const y = x % m, ker = y === 0;
      B.seg(V(px(x), yT + 12), V(qx(y), yB - 12), { stroke: ker ? 'rgba(255,209,102,.75)' : 'rgba(92,173,255,.35)', 'stroke-width': ker ? 2 : 1 });
    }
    for (let x = 0; x < N; x++) {
      const ker = x % m === 0;
      B.dot(V(px(x), yT), 6.5, { fill: ker ? '#ffd166' : '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.text(V(px(x), yT - 18), `${x}`, { 'font-size': 12, fill: ker ? '#ffd166' : '#8fa3bd', 'text-anchor': 'middle' });
    }
    for (let j = 0; j < m; j++) {
      B.dot(V(qx(j), yB), 8, { fill: '#4ade80', stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.text(V(qx(j), yB + 24), `${j}`, { 'font-size': 13, fill: '#4ade80', 'text-anchor': 'middle' });
    }

    const ker = [...Array(N).keys()].filter(x => x % m === 0);
    B.tex(V(410, 372), `核 ker φ = {${ker.join(', ')}}，共 ${ker.length} 个元素`, { size: 13, color: '#ffd166', anchor: 'mid', w: 520 });
    const iso = m === N;
    B.tex(V(410, 402), iso ? 'm = 12：φ 是双射，故为同构，Z_12 ≅ Z_12' : `核非平凡，φ 不是单射；商群 Z_12/ker φ ≅ Z_${m}`, { size: 13, color: iso ? '#4ade80' : '#c084fc', anchor: 'mid', w: 600 });

    cK(ker.length === 1 ? '{0}' : `{${ker.join(',')}}`);
    cI(`Z_${m}`);
    cJ(iso ? '是' : '否');
  };

  MS.forEach(m => B.btn(`m = ${m}`, () => { st.m = m; B.render(); }));
  B.hint('核的大小 = 12 ÷ m，每个像点的原像恰好这么多个');
  B.render();
  return B;
}
