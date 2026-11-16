/* 图 不1 · 欧拉示性数：顶点减棱加面
   同一张曲面切成有限块，V−E+F 永远是同一个数。
   四面体、长方体都是球面，算出 2；环面用一张四边形剖分，
   四个角粘成一点、两条边各是一整条圈，V−E+F=0；
   双环面 −2。规律只有一条：χ=2−2g，g 是洞的个数。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const TETRA = {
  vs: [[190, 86], [86, 334], [302, 334], [196, 238]],
  es: [[0, 1], [1, 2], [2, 0], [0, 3], [1, 3], [2, 3]],
  fs: [[0, 1, 3], [1, 2, 3], [2, 0, 3]],
};
const CUBE = {
  vs: [[150, 104], [372, 104], [372, 326], [150, 326], [214, 158], [308, 158], [308, 272], [214, 272]],
  es: [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]],
  fs: [[4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]],
};

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { mode: 'tetra' };

  const cV = B.chipM('$V$'), cE = B.chipM('$E$'), cF = B.chipM('$F$'), cX = B.chipM('$V-E+F$');

  function drawGraph(g) {
    // 面：交替两色，先铺色再画棱
    g.fs.forEach((f, i) => {
      mk('polygon', {
        points: f.map(k => g.vs[k].join(',')).join(' '),
        fill: i % 2 ? '#5cadff' : '#ff9e4a', 'fill-opacity': .09,
      }, B.dyn);
    });
    for (const [a, b] of g.es) B.seg(V(...g.vs[a]), V(...g.vs[b]), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    for (const p of g.vs) B.dot(V(...p), 4.6, { fill: '#ffd166', stroke: '#12161f', 'stroke-width': 1.3 });
  }

  function drawTorusSquare() {
    const A = V(96, 110), Bp = V(336, 110), C = V(336, 350), D = V(96, 350);
    B.seg(A, Bp, { stroke: '#5cadff', 'stroke-width': 2 });
    B.seg(Bp, C, { stroke: '#5cadff', 'stroke-width': 2 });
    B.seg(C, D, { stroke: '#5cadff', 'stroke-width': 2 });
    B.seg(D, A, { stroke: '#5cadff', 'stroke-width': 2 });
    B.tex(V(216, 90), '$a$', { size: 13, color: '#5cadff', anchor: 'mid', w: 30 });
    B.tex(V(216, 372), '$a$', { size: 13, color: '#5cadff', anchor: 'mid', w: 30 });
    B.tex(V(74, 230), '$b$', { size: 13, color: '#ff9e4a', anchor: 'mid', w: 30 });
    B.tex(V(358, 230), '$b$', { size: 13, color: '#ff9e4a', anchor: 'mid', w: 30 });
    for (const p of [A, Bp, C, D]) B.dot(p, 5.4, { fill: '#ffd166', stroke: '#12161f', 'stroke-width': 1.4 });
    B.tex(V(216, 230), '四个角粘成一点', { size: 12, color: '#8fa3bd', anchor: 'mid', w: 150 });
    B.tex(V(216, 256), '两条边各成一圈', { size: 12, color: '#8fa3bd', anchor: 'mid', w: 150 });

    // 右边的环面示意：V−E+F 只要一个点、两条圈、一块面
    mk('ellipse', { cx: 596, cy: 224, rx: 104, ry: 62, fill: '#5cadff', 'fill-opacity': .08, stroke: '#5cadff', 'stroke-width': 1.8 }, B.dyn);
    mk('ellipse', { cx: 596, cy: 224, rx: 40, ry: 22, fill: '#0a0d14', stroke: '#5cadff', 'stroke-width': 1.4 }, B.dyn);
    B.tex(V(596, 316), '一个顶点、两条棱、一块面', { size: 12, color: '#5cadff', anchor: 'mid', w: 210 });
  }

  function drawDouble() {
    const donut = (cx, cy, rx, ry, hrx, hry) => {
      mk('ellipse', { cx, cy, rx, ry, fill: '#ff9e4a', 'fill-opacity': .08, stroke: '#ff9e4a', 'stroke-width': 1.8 }, B.dyn);
      mk('ellipse', { cx, cy, rx: hrx, ry: hry, fill: '#0a0d14', stroke: '#ff9e4a', 'stroke-width': 1.3 }, B.dyn);
    };
    donut(212, 228, 92, 56, 34, 18);
    donut(432, 228, 92, 56, 34, 18);
    B.tex(V(322, 228), '管', { size: 11.5, color: '#ff9e4a', anchor: 'mid', w: 40 });
    B.tex(V(322, 330), '两个洞 $g=2$', { size: 13, color: '#ff9e4a', anchor: 'mid', w: 130 });
  }

  B.renderFn = () => {
    if (st.mode === 'tetra') {
      drawGraph(TETRA);
      B.tex(V(W / 2, H - 86), '$V=4$，$E=6$，$F=4$（含外面那块）', { size: 13, color: '#8fa3bd', w: 460, anchor: 'mid' });
      cV('4', 'ok'); cE('6', 'ok'); cF('4', 'ok'); cX('2', 'ok');
    } else if (st.mode === 'cube') {
      drawGraph(CUBE);
      B.tex(V(W / 2, H - 86), '$V=8$，$E=12$，$F=6$：怎么切都还是 2', { size: 13, color: '#8fa3bd', w: 460, anchor: 'mid' });
      cV('8', 'ok'); cE('12', 'ok'); cF('6', 'ok'); cX('2', 'ok');
    } else if (st.mode === 'torus') {
      drawTorusSquare();
      B.tex(V(W / 2, H - 86), '$V=1$，$E=2$，$F=1$：$1-2+1=0$', { size: 13, color: '#8fa3bd', w: 460, anchor: 'mid' });
      cV('1', 'ok'); cE('2', 'ok'); cF('1', 'ok'); cX('0', 'ok');
    } else {
      drawDouble();
      B.tex(V(W / 2, H - 86), '两个洞：$\\chi=2-2\\times 2=-2$', { size: 13, color: '#8fa3bd', w: 460, anchor: 'mid' });
      cV('—', ''); cE('—', ''); cF('—', ''); cX('$-2$', 'warn');
    }
  };

  B.btn('四面体', () => { st.mode = 'tetra'; B.render(); }, { pri: true });
  B.btn('长方体', () => { st.mode = 'cube'; B.render(); });
  B.btn('环面', () => { st.mode = 'torus'; B.render(); });
  B.btn('双环面', () => { st.mode = 'double'; B.render(); });
  B.hintM('四面体和长方体切法完全不同，$V-E+F$ 却都是 2；换成环面，这个数掉到 0');
  B.render();
  return B;
}
