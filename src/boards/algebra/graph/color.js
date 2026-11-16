import { Board, V } from '../../../lib/board.js';

/* 图的着色与匹配：贪心染色给出上界，最大匹配按回溯数一遍。
   三角形要三色，五边形也要三色，完全二分图两色就够且存在完美匹配。 */
const COL = ['#ffd166', '#5cadff', '#ff7b8a', '#4ade80'];
const PRESETS = [
  { n: '三角形 K₃', pos: [[310, 110], [510, 110], [410, 320]], edges: [[0, 1], [1, 2], [2, 0]] },
  { n: '五边形 C₅', pos: [[410, 80], [640, 240], [550, 420], [270, 420], [180, 240]], edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0]] },
  { n: '完全二分图 K₃,₃', pos: [[240, 120], [240, 230], [240, 340], [600, 120], [600, 230], [600, 340]], edges: [[0, 3], [0, 4], [0, 5], [1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]] },
];

function maxMatch(N, edges) {
  const adj = [...Array(N).keys()].map(() => []);
  edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  let best = 0;
  const used = Array(N).fill(false);
  const go = (v, cnt) => {
    if (v === N) { best = Math.max(best, cnt); return; }
    go(v + 1, cnt);
    if (!used[v]) for (const u of adj[v]) if (u > v && !used[u]) { used[v] = used[u] = true; go(v + 1, cnt + 1); used[v] = used[u] = false; }
  };
  go(0, 0);
  return best;
}

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { p: 2 };
  const cC = B.chipM('色数');
  const cW = B.chipM('团数');
  const cM = B.chipM('最大匹配');

  B.renderFn = () => {
    const g = PRESETS[st.p], N = g.pos.length;
    const color = Array(N).fill(-1);
    for (let v = 0; v < N; v++) {
      const bad = new Set(g.edges.filter(([a, b]) => a === v || b === v).map(([a, b]) => color[a === v ? b : a]));
      let c = 0; while (bad.has(c)) c++;
      color[v] = c;
    }
    const chi = Math.max(...color) + 1;
    let clique = 1;
    for (let mask = 1; mask < (1 << N); mask++) {
      const vs = [...Array(N).keys()].filter(i => mask & (1 << i));
      if (vs.length <= clique) continue;
      if (vs.every(a => vs.every(b => a === b || g.edges.some(([x, y]) => (x === a && y === b) || (x === b && y === a))))) clique = vs.length;
    }
    const mm = maxMatch(N, g.edges);
    const matchEdges = [];
    if (st.p === 2) [[0, 3], [1, 4], [2, 5]].forEach(e => matchEdges.push(e));

    B.textM(V(410, 30), `${g.n}：顶点染成相邻不同色`, { 'font-size': 15, fill: '#8fa3bd' });
    g.edges.forEach(([a, b]) => {
      const m = matchEdges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
      B.seg(V(...g.pos[a]), V(...g.pos[b]), { stroke: m ? '#4ade80' : 'rgba(143,163,189,.55)', 'stroke-width': m ? 3.4 : 1.6 });
    });
    g.pos.forEach(([x, y], i) => {
      B.dot(V(x, y), 17, { fill: COL[color[i]], stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.text(V(x, y + 5), `${i + 1}`, { 'font-size': 12, fill: '#0a0d14', 'text-anchor': 'middle' });
    });
    B.tex(V(410, 392), `贪心染出 ${chi} 色；团数为 ${clique}，因此色数不低于 ${clique}`, { size: 13, color: '#ffd166', anchor: 'mid', w: 620 });
    B.tex(V(410, 424), st.p === 2 ? '绿色三条边两两不共端点：这是完美匹配，霍尔条件成立' : '匹配是两两不共端点的边集；色数与匹配没有直接换算公式', { size: 12, color: '#8fa3bd', anchor: 'mid', w: 660 });

    cC(`${chi}`);
    cW(`${clique}`);
    cM(`${mm}`);
  };

  PRESETS.forEach((g, i) => B.btn(g.n, () => { st.p = i; B.render(); }));
  B.hint('三角形三色、二分图两色；绿色粗边是给出的匹配');
  B.render();
  return B;
}
