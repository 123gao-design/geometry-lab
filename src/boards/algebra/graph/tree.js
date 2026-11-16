import { Board, V } from '../../../lib/board.js';

/* 树：n 个顶点按链排开，边数滑块从 n−2 走到 n。
   n−1 条边且连通、无圈才是树；少一条断开，多一条出圈。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { n: 6, m: 5 };
  const cE = B.chipM('边数');
  const cC = B.chipM('连通');
  const cY = B.chipM('无圈');

  B.renderFn = () => {
    const n = st.n, m = Math.min(st.m, n), cx = 410, cy = 226, R = 140;
    const pos = i => V(cx + R * Math.sin(2 * Math.PI * i / n), cy - R * Math.cos(2 * Math.PI * i / n));
    const chain = [...Array(Math.max(0, n - 1)).keys()].map(i => [i, i + 1]);
    const edges = [...chain, [0, 2]].slice(0, m);
    const par = [...Array(n).keys()];
    const find = x => par[x] === x ? x : (par[x] = find(par[x]));
    let cyc = false;
    edges.forEach(([a, b]) => {
      const ra = find(a), rb = find(b);
      if (ra === rb) cyc = true; else par[ra] = rb;
    });
    const comp = new Set([...Array(n).keys()].map(i => find(i))).size;
    B.textM(V(410, 32), `${n} 个顶点、${m} 条边的图：树要求恰好 ${n - 1} 条边`, { 'font-size': 15, fill: '#8fa3bd' });
    edges.forEach(([a, b], i) => {
      const chord = i >= n - 1;
      B.seg(pos(a), pos(b), { stroke: chord ? '#ff7b8a' : 'rgba(92,173,255,.75)', 'stroke-width': chord ? 2.6 : 2 });
    });
    for (let i = 0; i < n; i++) {
      B.dot(pos(i), 16, { fill: 'rgba(92,173,255,.12)', stroke: '#5cadff', 'stroke-width': 1.6 });
      B.text(V(pos(i).x, pos(i).y + 5), `${i + 1}`, { 'font-size': 12, fill: '#5cadff', 'text-anchor': 'middle' });
    }
    const isTree = cyc === false && comp === 1 && m === n - 1;
    B.tex(V(410, 392), cyc ? '红色弦连接了已有的同一条通路，出现圈' : comp > 1 ? '有顶点孤在外面，图不连通' : '连通、无圈、边数为 n−1：这是一棵树', { size: 13, color: isTree ? '#4ade80' : '#ff7b8a', anchor: 'mid', w: 620 });
    B.tex(V(410, 424), '树的任一顶点到另一顶点恰有一条路径；删一条边就断开，加一条边就成圈', { size: 12, color: '#8fa3bd', anchor: 'mid', w: 660 });

    cE(`${m}`);
    cC(comp === 1 ? '是' : `${comp} 块`);
    cY(cyc ? '有圈' : '无圈');
  };

  B.slider('顶点数 n', 3, 8, 1, st.n, v => { st.n = v; st.m = v - 1; B.render(); });
  B.slider('边数 m', 1, 8, 1, st.m, v => { st.m = v; B.render(); });
  B.hint('m 停在 n−1 时是树；少一条就断开，多一条就出现一个圈');
  B.render();
  return B;
}
