/* 图 P1c · 抛物线参数机：P = (2pt², 2pt)（y² = 2px，顶点为原点、开口向右）
   局部坐标 u 向右、v 向下为正。t 的几何身份是「时间」：竖直方向 y = 2pt 匀速走（时钟），
   水平位移 x = 2pt² 按时间平方膨胀（匀加速）—— 等时间隔的落点在轴上按 1:3:5:7 拉开，
   这正是伽利略斜面实验的奇数定律：抛物线就是匀加速运动的轨迹。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const C = V(240, 245);                    // 抛物线顶点（局部原点）
  const st = { t: 0.42, p: 105, run: true, dir: 1 };

  const tCap = () => Math.min(1.35, Math.sqrt((W - 30 - C.x) / (2 * st.p)), (H / 2 - 28) / (2 * st.p));
  const clampT = w => Math.max(-tCap(), Math.min(tCap(), w));
  const P = () => V(C.x + 2 * st.p * st.t * st.t, C.y + 2 * st.p * st.t);
  const E = () => V(P().x, C.y);            // 轴上落点 x = 2pt²
  const G = () => V(C.x, P().y);            // 时钟读数 y = 2pt

  const cP = B.chipM('$P=(2pt^2,\\ 2pt)$'), cV = B.chip('消参验证'), cGal = B.chip('伽利略落点');
  B.toggleBtn('▶ 走时间 t', true, on => { st.run = on; });
  const sT = B.slider('t（时间）', -1.35, 1.35, 0.01, st.t, v => { st.t = clampT(v); B.render(); });
  B.slider('p（焦距）', 80, 150, 1, st.p, v => { st.p = v; st.t = clampT(st.t); B.render(); });

  B.renderFn = () => {
    const p = P(), e = E(), g = G();
    // 轴（水平 = 对称轴；竖直 = 顶点切线，兼作「时钟」）
    B.seg(V(20, C.y), V(W - 20, C.y), { stroke: '#22314a', 'stroke-width': 1.3 });
    B.seg(V(C.x, 20), V(C.x, H - 20), { stroke: '#22314a', 'stroke-width': 1.3 });
    B.text(V(C.x + 10, 36), '时钟 y = 2pt（匀速）', { fill: '#4ade80', 'font-size': 11 });
    B.textM(V(C.x + 196, C.y - 12), '位移 $x = 2pt^2$（平方）', { fill: '#ff9e4a', 'font-size': 11 });
    // 抛物线 y² = 2px
    const cap = tCap(), pts = [];
    for (let y = -2 * st.p * cap * 1.02; y <= 2 * st.p * cap * 1.02; y += 3)
      pts.push(`${(C.x + y * y / (2 * st.p)).toFixed(1)},${(C.y + y).toFixed(1)}`);
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.6 }, B.dyn);
    B.textM(V(C.x + 2 * st.p * cap * cap * 0.55, C.y - 2 * st.p * cap - 14), '$y^2 = 2px$', { fill: '#67e8f9', 'font-size': 11.5 });
    // 伽利略落点：t = Δ, 2Δ, …, 6Δ 的等时间隔标记，轴上间距 1:3:5:7:9:11
    const d = cap / 6;
    let ePrev = C.x;
    for (let i = 1; i <= 6; i++) {
      const ti = i * d, ex = C.x + 2 * st.p * ti * ti;
      B.seg(V(ex, C.y - 5), V(ex, C.y + 5), { stroke: '#ffd166', 'stroke-width': 2 });
      if (i <= 4) B.text(V((ePrev + ex) / 2, C.y - 12), `${2 * i - 1}`, { fill: '#ffd166', 'font-size': 11.5, 'font-weight': 700, 'text-anchor': 'middle' });
      ePrev = ex;
    }
    // 构造：过 E 竖直、过 G 水平，交出 P
    B.seg(e, p, { stroke: '#ff9e4a', 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
    B.seg(g, p, { stroke: '#4ade80', 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
    // 点
    B.dot(C, 3, { fill: '#93a1b5' });
    B.dot(e, 5.5, { fill: '#ff9e4a', stroke: '#fff', 'stroke-width': 1.8 });
    B.dot(g, 5, { fill: '#4ade80', stroke: '#fff', 'stroke-width': 1.8 });
    B.dot(p, 6.5, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(e.x + 8, C.y + 20), 'E', { fill: '#ff9e4a', 'font-size': 12, 'font-weight': 700 });
    B.text(V(C.x - 12, g.y - 8), 'G', { fill: '#4ade80', 'font-size': 12, 'font-weight': 700, 'text-anchor': 'end' });
    B.text(V(p.x + 12, p.y + 5), 'P', { fill: '#67e8f9', 'font-size': 13, 'font-weight': 700 });
    // 读数（v 从屏幕实测，避免恒等式自证）
    const uu = p.x - C.x, vv = p.y - C.y;
    const val = vv * vv - 2 * st.p * uu;
    cP(`P = (2pt², 2pt) = (${fmt(uu, 1)}, ${fmt(vv, 1)}) 局部`);
    cV(`y² − 2px = ${fmt(val, 1)}`, Math.abs(val) < Math.max(0.8, vv * vv * 0.004) ? 'ok' : 'warn');
    cGal(`Δt 相等 → 落点间距 ${fmt(2 * st.p * d * d, 0)} : ${fmt(6 * st.p * d * d, 0)} : ${fmt(10 * st.p * d * d, 0)} : ${fmt(14 * st.p * d * d, 0)} = 1:3:5:7`);
    B.hintM('把竖直线当时钟：$y = 2pt$ 匀速、$x = 2pt^2$ 按平方膨胀 —— 金色刻度按 $1{:}3{:}5{:}7$ 拉开');
  };

  const step = () => {
    if (st.run) {
      st.t += 0.008 * st.dir;
      if (st.t > tCap()) { st.t = tCap(); st.dir = -1; }
      if (st.t < -tCap()) { st.t = -tCap(); st.dir = 1; }
      sT.sync(st.t);
      B.render();
    }
    B.raf(step);
  };
  B.handle({
    get: P,
    set: q => { st.t = clampT((q.y - C.y) / (2 * st.p)); },
    color: '#67e8f9', r: 8, label: 'P', lo: [12, 6],
  });

  B.render();
  B.raf(step);
  return B;
}
