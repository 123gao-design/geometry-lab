import { Board, V, mk } from '../../../lib/board.js';

/* 群同态基本定理：φ: Z → Z_n，φ(x) = x mod n。
   核是全部倍数（nZ），把每个整数沿箭头送到商群 Z_n 的一个元素；
   Z/ker φ 与像 Z_n 一一对应，这就是同构。 */
const CL = ['#ffd166', '#5cadff', '#4ade80', '#c084fc', '#ff9e4a', '#67e8f9'];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { n: 3 };
  const cK = B.chipM('核');
  const cI = B.chipM('像');
  const cQ = B.chipM('商群');

  B.renderFn = () => {
    const n = st.n, xs = [...Array(15).keys()].map(i => i - 7);
    const xL = 96, xR = 724, yT = 150, yB = 320;
    const px = i => xL + (xR - xL) * i / (xs.length - 1);
    const qx = j => 210 + 400 * (n === 1 ? 0 : j / (n - 1));
    B.textM(V(410, 30), `φ: $\\mathbb{Z}\\to\\mathbb{Z}_{${n}}$，φ(x) = x mod ${n}`, { 'font-size': 15, fill: '#8fa3bd' });
    B.seg(V(xL - 30, yT), V(xR + 30, yT), { stroke: 'rgba(143,163,189,.5)', 'stroke-width': 1.4 });
    B.text(V(xL - 40, yT + 4), 'Z', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'end' });
    B.text(V(410, yB - 44), 'Zₙ（商群 Z / nZ）', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'middle' });

    xs.forEach((x, i) => {
      const r = ((x % n) + n) % n, ker = r === 0, p = V(px(i), yT);
      B.seg(p, V(qx(r), yB - 12), { stroke: CL[r], 'stroke-opacity': .28, 'stroke-width': 1 });
      B.dot(p, ker ? 7.5 : 5.5, { fill: CL[r], stroke: ker ? '#ffd166' : '#0a0d14', 'stroke-width': ker ? 2 : 1.2 });
      B.text(V(p.x, yT - 16), `${x}`, { 'font-size': 11, fill: ker ? '#ffd166' : '#8fa3bd', 'text-anchor': 'middle' });
    });
    for (let j = 0; j < n; j++) {
      B.dot(V(qx(j), yB), 10, { fill: CL[j], stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.text(V(qx(j), yB + 4), `${j}`, { 'font-size': 13, fill: '#0a0d14', 'text-anchor': 'middle' });
    }
    B.text(V(410, yB + 34), '同态的像：0 到 n−1 全部取到', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'middle' });

    B.tex(V(410, 388), `ker φ = ${n}Z = {…, −${n}, 0, ${n}, ${2 * n}, …}，是 Z 的正规子群`, { size: 13, color: '#ffd166', anchor: 'mid', w: 640 });
    B.tex(V(410, 420), `Z / ker φ ≅ im φ = Z_${n}，商群阶为 ${n}`, { size: 13, color: '#4ade80', anchor: 'mid', w: 560 });

    cK(`${n}Z`);
    cI(`Z_${n}`);
    cQ(`${n}`);
  };

  B.slider('模数 n', 2, 6, 1, st.n, v => { st.n = v; B.render(); });
  B.hint('金色整数是核，它们全被压到 0；其余整数按余数分到各列');
  B.render();
  return B;
}
