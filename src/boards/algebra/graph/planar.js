import { Board, V, mk } from '../../../lib/board.js';

/* 平面图与欧拉公式：V − E + F = 2。
   四面体的平面图画法与正 n 边形的扇形三角剖分，两种给法算出同一个 2。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { n: 5 };
  const cV = B.chipM('V');
  const cE = B.chipM('E');
  const cF = B.chipM('F');

  B.renderFn = () => {
    const N = st.n;
    const cx = 410, cy = 230, R = 150;
    const pos = i => V(cx + R * Math.sin(2 * Math.PI * i / N), cy - R * Math.cos(2 * Math.PI * i / N));
    B.textM(V(410, 30), `正 ${N} 边形的扇形三角剖分：V = ${N}，E = ${2 * N - 3}，F = ${N - 1}`, { 'font-size': 15, fill: '#8fa3bd' });
    for (let i = 1; i < N - 1; i++) {
      const P = [pos(0), pos(i), pos(i + 1)];
      const hue = ['rgba(92,173,255,.10)', 'rgba(192,132,252,.10)', 'rgba(74,222,128,.10)', 'rgba(255,209,102,.10)', 'rgba(255,158,74,.10)', 'rgba(103,232,249,.10)'];
      mk('polygon', { points: P.map(p => `${p.x},${p.y}`).join(' '), fill: hue[(i - 1) % hue.length], stroke: 'none' }, B.dyn);
    }
    for (let i = 0; i < N; i++) {
      B.seg(pos(i), pos((i + 1) % N), { stroke: '#5cadff', 'stroke-width': 2.2 });
      if (i > 0 && i < N - 2) B.seg(pos(0), pos(i + 1), { stroke: 'rgba(92,173,255,.55)', 'stroke-width': 1.4 });
    }
    for (let i = 0; i < N; i++) {
      B.dot(pos(i), 15, { fill: 'rgba(92,173,255,.16)', stroke: '#5cadff', 'stroke-width': 1.6 });
      B.text(V(pos(i).x, pos(i).y + 5), `${i + 1}`, { 'font-size': 11, fill: '#5cadff', 'text-anchor': 'middle' });
    }
    const Vn = N, En = 2 * N - 3, Fn = N - 1;
    B.tex(V(410, 404), `V − E + F = ${Vn} − ${En} + ${Fn} = 2`, { size: 15, color: '#ffd166', anchor: 'mid', w: 420 });
    B.tex(V(410, 434), '外部无界区域也算一个面；平面连通图的欧拉公式恒成立', { size: 12, color: '#8fa3bd', anchor: 'mid', w: 620 });

    cV(`${Vn}`);
    cE(`${En}`);
    cF(`${Fn}`);
  };

  B.slider('边数 n', 4, 8, 1, st.n, v => { st.n = v; B.render(); });
  B.hint('加一个顶点与两条边，V 增 1、E 增 2、F 增 1，差值始终是 2');
  B.render();
  return B;
}
