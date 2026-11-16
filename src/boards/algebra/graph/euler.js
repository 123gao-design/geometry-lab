import { Board, V, mk } from '../../../lib/board.js';

/* 欧拉回路与哈密顿回路：奇点个数决定能否一笔画。
   柯尼斯堡七桥有四个奇点，走不通；五边形全是偶点，一笔画得回起点。 */
const PRESETS = [
  { n: '柯尼斯堡七桥', pos: [[200, 110], [620, 110], [620, 340], [200, 340]], edges: [[0, 1], [0, 1], [0, 2], [0, 2], [0, 3], [1, 2], [2, 3]] },
  { n: '五边形回路', pos: [[410, 80], [640, 240], [550, 420], [270, 420], [180, 240]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { p: 0 };
  const cO = B.chipM('奇点个数');
  const cE = B.chipM('欧拉回路');
  const cP = B.chipM('欧拉通路');
  const cH = B.chipM('哈密顿回路');

  B.renderFn = () => {
    const g = PRESETS[st.p], N = g.pos.length;
    const deg = Array(N).fill(0);
    const seen = {};
    B.textM(V(410, 30), `${g.n}：每条边恰好走一次`, { 'font-size': 15, fill: '#8fa3bd' });
    g.edges.forEach(([a, b]) => {
      deg[a]++; deg[b]++;
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      const k = seen[key] = (seen[key] || 0) + 1;
      const p = V(...g.pos[a]), q = V(...g.pos[b]);
      if (k === 1) B.seg(p, q, { stroke: 'rgba(92,173,255,.7)', 'stroke-width': 2.4 });
      else {
        const mx = (p.x + q.x) / 2 + (k === 2 ? 16 : -16), my = (p.y + q.y) / 2 + (k === 2 ? -22 : 22);
        mk('path', { d: `M${p.x},${p.y} Q${mx},${my} ${q.x},${q.y}`, fill: 'none', stroke: 'rgba(92,173,255,.7)', 'stroke-width': 2.4 }, B.dyn);
      }
    });
    g.pos.forEach(([x, y], i) => {
      const odd = deg[i] % 2 === 1;
      B.dot(V(x, y), 20, { fill: odd ? 'rgba(255,123,138,.16)' : 'rgba(74,222,128,.14)', stroke: odd ? '#ff7b8a' : '#4ade80', 'stroke-width': 2 });
      B.text(V(x, y + 5), `${deg[i]}`, { 'font-size': 13, fill: odd ? '#ff7b8a' : '#4ade80', 'text-anchor': 'middle' });
    });
    const odd = deg.filter(d => d % 2 === 1).length;
    const circuit = odd === 0, trail = odd === 0 || odd === 2;
    B.tex(V(410, 384), odd === 0 ? '没有奇点：从任一点出发都能一笔画回起点（欧拉回路）' : odd === 2 ? '两个奇点：一笔画可走，但起点与终点是这两个奇点' : `${odd} 个奇点：既不能一笔画回起点，也不能一笔画走完`, { size: 13, color: circuit ? '#4ade80' : odd === 2 ? '#ff9e4a' : '#ff7b8a', anchor: 'mid', w: 660 });
    B.tex(V(410, 418), '哈密顿回路要求经过每个顶点各一次，奇点判据对它不适用', { size: 12, color: '#8fa3bd', anchor: 'mid', w: 660 });

    cO(`${odd}`);
    cE(circuit ? '有' : '无');
    cP(trail ? '有' : '无');
    cH(st.p === 1 ? '有' : '另判');
  };

  PRESETS.forEach((g, i) => B.btn(g.n, () => { st.p = i; B.render(); }));
  B.hint('红色圆是奇点：七桥四个，五边形一个也没有');
  B.render();
  return B;
}
