import { Board, V } from '../../../lib/board.js';

/* 图的基本概念：六个顶点、一组预设边，逐条加边看两端度数同时加一。
   握手定理：所有顶点的度数之和等于边数的两倍，奇数度的顶点必为偶数个。 */
const POS = [[410, 70], [650, 170], [650, 330], [410, 408], [170, 330], [170, 170]];
const EDGES = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [0, 3], [1, 4]];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { m: 6 };
  const cV = B.chipM('顶点数');
  const cE = B.chipM('边数');
  const cD = B.chipM('度数和');

  B.renderFn = () => {
    const m = st.m, deg = [...Array(6).keys()].map(() => 0);
    EDGES.slice(0, m).forEach(([a, b]) => { deg[a]++; deg[b]++; });
    B.textM(V(410, 32), '顶点与边：度数是与顶点相连的边的条数', { 'font-size': 15, fill: '#8fa3bd' });
    EDGES.slice(0, m).forEach(([a, b]) => {
      const p = V(...POS[a]), q = V(...POS[b]);
      B.seg(p, q, { stroke: 'rgba(92,173,255,.75)', 'stroke-width': 2 });
    });
    POS.forEach(([x, y], i) => {
      const odd = deg[i] % 2 === 1;
      B.dot(V(x, y), 19, { fill: odd ? 'rgba(255,158,74,.16)' : 'rgba(92,173,255,.14)', stroke: odd ? '#ff9e4a' : '#5cadff', 'stroke-width': 1.8 });
      B.text(V(x, y + 5), `${deg[i]}`, { 'font-size': 14, fill: odd ? '#ff9e4a' : '#5cadff', 'text-anchor': 'middle' });
      B.text(V(x, y - 28), `v${i + 1}`, { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'middle' });
    });
    const sum = deg.reduce((s, d) => s + d, 0), oddN = deg.filter(d => d % 2 === 1).length;
    B.tex(V(410, 440), `Σdeg = ${sum} = 2 × ${m}；奇数度顶点 ${oddN} 个（必为偶数），橙圈即奇数度`, { size: 12, color: '#4ade80', anchor: 'mid', w: 620 });

    cV('6');
    cE(`${m}`);
    cD(`${sum}`);
  };

  B.slider('边数 m', 0, EDGES.length, 1, st.m, v => { st.m = v; B.render(); });
  B.hint('每加一条边，两端圆里的度数各加 1，度数和总是加 2');
  B.render();
  return B;
}
