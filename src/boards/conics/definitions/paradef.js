/* 图 D3 · 抛物线定义：|PF| = d(P, 准线 l)（等距平衡实验台） */
import { Board, mk, V, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 500;
  const B = new Board(root, W, H);
  const st = { vx: 330, cy: 250, p: 150, t: 150, latus: false }; // P = (vx + t²/2p, cy + t)

  const pt = t => V(st.vx + t * t / (2 * st.p), st.cy + t);
  const F = () => V(st.vx + st.p / 2, st.cy), LX = () => st.vx - st.p / 2;

  const cPF = B.chip('|PF|'), cPQ = B.chip('|PQ|（到准线）'), cEq = B.chip('|PF| − |PQ|');
  B.slider('焦参数 p', 70, 210, 1, st.p, v => { st.p = v; B.render(); });
  const tg = B.toggleBtn('显示通径', false, on => { st.latus = on; B.render(); });

  B.renderFn = () => {
    const { vx, cy, p } = st, f = F(), lx = LX(), P = pt(st.t), Q = V(lx, P.y);
    // 轴与准线
    B.seg(V(24, cy), V(W - 24, cy), { stroke: '#22314a', 'stroke-width': 1.5 });
    B.seg(V(lx, 18), V(lx, H - 18), { stroke: '#67e8f9', 'stroke-width': 1.8, 'stroke-dasharray': '8 6' });
    B.text(V(lx, 32), '准线 l', { fill: '#67e8f9', 'font-size': 12.5 });
    // 抛物线 y² = 2p(x − vx)
    const pts = [];
    for (let t = -235; t <= 235; t += 4) { const q = pt(t); pts.push(`${q.x.toFixed(1)},${q.y.toFixed(1)}`); }
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.6 }, B.dyn);
    // 顶点与焦点
    B.dot(V(vx, cy), 5, { fill: '#fff' });
    B.text(V(vx, cy + 20), 'O（顶点）', { fill: '#93a1b5', 'font-size': 12 });
    B.dot(f, 6, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(f.x, f.y + 20), `F(${fmt(p / 2, 0)}, 0)`, { fill: '#ffd166', 'font-size': 12.5, 'font-weight': 700 });
    // 通径：过 F 垂直于轴的弦，长 2p
    if (st.latus) {
      const u1 = V(f.x, cy - p), u2 = V(f.x, cy + p);
      B.seg(u1, u2, { stroke: '#4ade80', 'stroke-width': 3 });
      for (const u of [u1, u2]) B.dot(u, 5, { fill: '#4ade80', stroke: '#fff', 'stroke-width': 1.5 });
      B.text(V(f.x + 10, cy - p + 4), `通径 = 2p = ${fmt(2 * p, 0)}`, { fill: '#4ade80', 'font-size': 12, 'text-anchor': 'start' });
    }
    // 等距双线：PF 与 PQ
    B.seg(P, f, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
    B.seg(P, Q, { stroke: '#5cadff', 'stroke-width': 2.4 });
    // Q 处直角标记
    B.seg(V(Q.x + 12, Q.y), V(Q.x + 12, Q.y - 12), { stroke: '#5cadff', 'stroke-width': 1.4 });
    B.seg(V(Q.x + 12, Q.y - 12), V(Q.x, Q.y - 12), { stroke: '#5cadff', 'stroke-width': 1.4 });
    B.dot(Q, 4.5, { fill: '#5cadff' });
    B.text(V(Q.x - 14, Q.y + 4), 'Q', { fill: '#5cadff', 'font-size': 12.5, 'font-weight': 700 });
    B.dot(P, 6.5, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(P.x, P.y - 14), 'P', { fill: '#67e8f9', 'font-size': 13, 'font-weight': 700 });
    const pf = dist(P, f), pq = dist(P, Q);
    cPF(fmt(pf, 1)); cPQ(fmt(pq, 1));
    cEq(fmt(pf - pq, 2), Math.abs(pf - pq) < 0.4 ? 'ok' : 'warn');
    B.hint('拖动 P：橙线 |PF| 与蓝线 |PQ| 永远一样长 —— 抛物线是"到焦点与到准线等距"的点的轨迹');
  };

  B.handle({
    get: () => pt(st.t),
    set: p => { st.t = Math.max(-235, Math.min(235, p.y - st.cy)); },
    color: '#67e8f9', r: 9, label: 'P', lo: [10, -12],
  });

  B.render();
  return B;
}
