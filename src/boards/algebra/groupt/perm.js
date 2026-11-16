import { Board, V, mk } from '../../../lib/board.js';

/* 置换群与凯莱定理：把 S_3 的六个置换画成 1,2,3 之间的箭头图。
   轮换写法、置换的阶与复合次数一起给出；凯莱定理说任何有限群都这样嵌入置换群。 */
const PERM = [[1, 2, 3], [2, 1, 3], [3, 2, 1], [1, 3, 2], [2, 3, 1], [3, 1, 2]];
const CYC = ['e', '(1 2)', '(1 3)', '(2 3)', '(1 2 3)', '(1 3 2)'];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { p: 4, k: 1 };
  const cP = B.chipM('置换');
  const cC = B.chipM('轮换');
  const cO = B.chipM('阶');

  B.renderFn = () => {
    const p = st.p, k = st.k;
    let arr = [1, 2, 3];
    for (let t = 0; t < k; t++) arr = PERM[p].map(v => arr[v - 1]);
    const x = [270, 410, 550], yT = 130, yB = 290;
    B.textM(V(410, 30), `置换 ${CYC[p]} 及其 ${k} 次复合`, { 'font-size': 15, fill: '#8fa3bd' });
    B.text(V(410, 78), '原位置', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'middle' });
    B.text(V(410, 350), '像的位置', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'middle' });
    for (let i = 0; i < 3; i++) {
      B.dot(V(x[i], yT), 16, { fill: 'rgba(92,173,255,.14)', stroke: '#5cadff', 'stroke-width': 1.6 });
      B.text(V(x[i], yT + 5), `${i + 1}`, { 'font-size': 14, fill: '#5cadff', 'text-anchor': 'middle' });
      B.dot(V(x[i], yB), 16, { fill: 'rgba(255,209,102,.14)', stroke: '#ffd166', 'stroke-width': 1.6 });
      B.text(V(x[i], yB + 5), `${arr[i]}`, { 'font-size': 14, fill: '#ffd166', 'text-anchor': 'middle' });
    }
    const col = ['#ffd166', '#ff9e4a', '#c084fc'];
    for (let i = 0; i < 3; i++) {
      const j = arr[i] - 1;
      const x1 = x[i], x2 = x[j], y1 = yT + 18, y2 = yB - 18;
      const mx = (x1 + x2) / 2 + (x1 === x2 ? 26 : 0);
      mk('path', { d: `M${x1},${y1} Q${mx},${(y1 + y2) / 2} ${x2},${y2}`, fill: 'none', stroke: col[i], 'stroke-width': 2.2, 'marker-end': 'none' }, B.dyn);
      for (const t of [0.2, 0.8]) {
        const bx = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * mx + t * t * x2;
        const by = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * ((y1 + y2) / 2) + t * t * y2;
        B.dot(V(bx, by), 3.4, { fill: col[i] });
      }
    }
    const orbit = [1];
    let cur = PERM[p][0];
    while (cur !== 1) { orbit.push(cur); cur = PERM[p][cur - 1]; }
    const order = orbit.length;
    B.tex(V(660, 150), `置换的阶：连续复合 ${order} 次回到恒等`, { size: 12, color: '#4ade80', w: 150 });
    B.tex(V(660, 210), k % order === 0 ? '当前恰回到恒等' : `还差 ${order - (k % order)} 次`, { size: 12, color: k % order === 0 ? '#ffd166' : '#8fa3bd', w: 150 });
    B.tex(V(410, 394), '六个置换对复合封闭，构成 S_3，阶为 6', { size: 13, color: '#c084fc', anchor: 'mid', w: 560 });
    B.tex(V(410, 426), '凯莱定理：每个有限群都同构于某个置换群', { size: 12, color: '#8fa3bd', anchor: 'mid', w: 560 });

    cP(CYC[p]);
    cC(`$${CYC[p]}$`);
    cO(`${order}`);
  };

  CYC.forEach((c, i) => B.btnM(`$${c}$`, () => { st.p = i; B.render(); }));
  B.slider('复合次数 k', 1, 6, 1, st.k, v => { st.k = v; B.render(); });
  B.hint('k 走到置换的阶时，右下角的 1,2,3 回到原位');
  B.render();
  return B;
}
