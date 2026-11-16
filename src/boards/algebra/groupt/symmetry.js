import { Board, V, mk } from '../../../lib/board.js';

/* 群与对称：正 n 边形的对称变换把顶点重排，n 个旋转加 n 个反射共 2n 个。
   滑块选旋转次数与是否反射，灰影是原位置，蓝形是变换后的位置。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { n: 5, k: 1, s: 0 };
  const cG = B.chipM('群');
  const cO = B.chipM('群阶');
  const cF = B.chipM('不动点');

  B.renderFn = () => {
    const n = st.n, k = st.k, refl = st.s === 1;
    const cx = 300, cy = 232, R = 118;
    const base = [...Array(n).keys()].map(i => i * 2 * Math.PI / n);
    const ang = base.map(t => {
      const a = t + 2 * Math.PI * k / n;
      return refl ? 2 * Math.PI / n - a : a;
    });
    const toP = t => V(cx + R * Math.sin(t), cy - R * Math.cos(t));
    const poly = (pts, o) => mk('polygon', { points: pts.map(p => `${p.x},${p.y}`).join(' '), fill: o.fill, stroke: o.stroke, 'stroke-width': o.w }, B.dyn);
    poly(base.map(toP), { fill: 'rgba(143,163,189,.06)', stroke: 'rgba(143,163,189,.55)', w: 1.4 });
    poly(ang.map(toP), { fill: 'rgba(92,173,255,.18)', stroke: '#5cadff', w: 2 });
    for (let i = 0; i < n; i++) {
      const a = toP(base[i]), b = toP(ang[i]);
      B.seg(a, b, { stroke: 'rgba(255,209,102,.5)', 'stroke-width': 1, 'stroke-dasharray': '4 4' });
      B.dot(b, 4.5, { fill: '#ffd166' });
    }
    B.text(V(410, 30), `正 ${n} 边形的对称：${n} 个旋转 × ${n} 个反射 = ${2 * n} 个变换`, { 'font-size': 15, fill: '#8fa3bd' });
    B.text(V(cx, cy - 6), refl ? '反射' : k === 0 ? '恒等' : `旋转 ${k} 格`, { 'font-size': 13, fill: '#5cadff', 'text-anchor': 'middle' });
    B.text(V(cx, cy + 16), `转角 ${k * 360 / n}°`, { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'middle' });
    const rx = 500;
    B.tex(V(rx, 120), '旋转：绕中心转 2πk/n，保持方向', { size: 12, color: '#5cadff', w: 290 });
    B.tex(V(rx, 168), '反射：关于经过中心与顶点（或边中点）的轴翻转', { size: 12, color: '#c084fc', w: 290 });
    B.tex(V(rx, 224), '旋转与反射复合仍是反射，两个反射复合是旋转', { size: 12, color: '#4ade80', w: 290 });
    B.tex(V(rx, 280), refl ? '反射轴上的点不动，其余点成对交换' : '只有中心在旋转下不动（中心不是顶点）', { size: 12, color: '#ff9e4a', w: 290 });
    B.tex(V(rx, 340), '正 n 边形的平面内对称群在平面内共 2n 个元素', { size: 12, color: '#8fa3bd', w: 290 });
    B.tex(V(410, 402), '对称群刻画形状：群越大，图形越对称；正方形的 8 个远多于一般三角形', { size: 12, color: '#8fa3bd', anchor: 'mid', w: 660 });

    cG(`正 ${n} 边形`);
    cO(`${2 * n}`);
    cF(refl ? (n % 2 === 1 ? '1 个顶点与 1 条边中点' : '2 个顶点或 2 条边中点') : n % 2 === 0 && k === n / 2 ? '中心与两对顶点' : '仅中心');
  };

  B.slider('边数 n', 3, 8, 1, st.n, v => { st.n = v; st.k = 0; B.render(); });
  B.slider('旋转格数 k', 0, 7, 1, st.k, v => { st.k = Math.min(v, st.n - 1); B.render(); });
  B.toggleBtn('反射', false, on => { st.s = on ? 1 : 0; B.render(); });
  B.hint('反射开着时蓝色图形翻到轴的另一侧，阴影与它的差就是这次对称');
  B.render();
  return B;
}
