import { Board, V } from '../../../lib/board.js';

/* 路径与连通性：九个顶点的图分成两片，从 v1 出发做广度优先搜索。
   逐层染色给出最短路，另一片永远点不亮 —— 连通分量就是走不到的那几块。 */
const POS = [[130, 120], [250, 78], [250, 186], [380, 120], [380, 232], [520, 150], [660, 92], [660, 210], [760, 320]];
const EDGES = [[0, 1], [0, 2], [1, 3], [2, 3], [1, 2], [3, 4], [3, 5], [4, 5], [5, 6], [7, 8]];
const LV = ['#ffd166', '#ff9e4a', '#ff7b8a', '#c084fc', '#67e8f9'];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { t: 7 };
  const cS = B.chipM('最短路');
  const cP = B.chipM('路径长');
  const cC = B.chipM('连通分量');

  B.renderFn = () => {
    const N = POS.length, adj = [...Array(N).keys()].map(() => []);
    EDGES.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
    const dist = Array(N).fill(-1), pre = Array(N).fill(-1), q = [0];
    dist[0] = 0;
    while (q.length) {
      const u = q.shift();
      for (const v of adj[u]) if (dist[v] < 0) { dist[v] = dist[u] + 1; pre[v] = u; q.push(v); }
    }
    const target = st.t;
    const path = [];
    if (dist[target] >= 0) for (let v = target; v >= 0; v = pre[v]) { path.unshift(v); if (v === 0) break; }
    const pathSet = new Set(path);
    const onPath = (a, b) => pathSet.has(a) && pathSet.has(b) && Math.abs(path.indexOf(a) - path.indexOf(b)) === 1;

    B.textM(V(410, 32), '从 v1 出发的广度优先搜索：同层逐圈向外', { 'font-size': 15, fill: '#8fa3bd' });
    EDGES.forEach(([a, b]) => {
      const p = V(...POS[a]), q2 = V(...POS[b]);
      B.seg(p, q2, onPath(a, b) ? { stroke: '#ffd166', 'stroke-width': 3.4 } : { stroke: 'rgba(92,173,255,.4)', 'stroke-width': 1.6 });
    });
    POS.forEach(([x, y], i) => {
      const d = dist[i], reached = d >= 0;
      const col = reached ? LV[Math.min(d, LV.length - 1)] : '#8fa3bd';
      B.dot(V(x, y), 16, { fill: reached ? 'rgba(92,173,255,.12)' : 'rgba(143,163,189,.10)', stroke: col, 'stroke-width': i === 0 || i === target ? 2.6 : 1.6 });
      B.text(V(x, y + 5), `v${i + 1}`, { 'font-size': 11, fill: col, 'text-anchor': 'middle' });
      B.text(V(x, y - 24), reached ? `${d}` : '∞', { 'font-size': 11, fill: col, 'text-anchor': 'middle' });
    });
    const unreach = [...Array(N).keys()].filter(i => dist[i] < 0);
    B.tex(V(410, 430), unreach.length ? `v${unreach.map(i => i + 1).join('、v')} 走不到：边不跨过去，图分成两个连通分量` : '所有顶点都连通', { size: 12, color: unreach.length ? '#ff7b8a' : '#4ade80', anchor: 'mid', w: 620 });

    cS(path.length ? path.map(i => `v${i + 1}`).join('→') : '不存在');
    cP(path.length ? `${path.length - 1}` : '∞');
    cC(unreach.length ? '2 个' : '1 个');
  };

  B.slider('目标顶点', 1, POS.length - 1, 1, st.t, v => { st.t = v; B.render(); });
  B.hint('目标换到 v8 或 v9，距离显示 ∞：没有一条边跨过右侧那片');
  B.render();
  return B;
}
