/* 图 A1 · 伸缩变换机：T_k: (x,y)→(x, k·y) 把圆 x²+y²=a² 压成椭圆 x²/a²+y²/b²=1 (b=ka)
   左面板圆及其切线，右面板像椭圆及其切线 —— 圆的切线 x·cosθ + y·sinθ = a 被变换到
   x·cosθ + y·sinθ/k = a，与椭圆切线公式逐字吻合：相切是仿射不变的。 */
import { Board, mk, V, add, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 440;
  const B = new Board(root, W, H);
  const R = 140, O1 = V(215, 225), O2 = V(645, 225);
  const st = { k: 0.7, t: 0.7, run: false };

  const bOf = () => R * st.k;
  const Q = () => V(O1.x + R * Math.cos(st.t), O1.y + R * Math.sin(st.t));          // 圆上
  const Qg = () => V(O2.x + R * Math.cos(st.t), O2.y + R * Math.sin(st.t));         // 像面板上的"圆位置"虚线
  const Qp = () => V(O2.x + R * Math.cos(st.t), O2.y + bOf() * Math.sin(st.t));     // 椭圆上的像

  const cK = B.chip('压缩比'), cEq1 = B.chip('圆切线（局部）'), cEq2 = B.chip('像切线（局部）'), cArea = B.chip('面积');
  B.slider('k = b/a', 0.25, 1.5, 0.01, st.k, v => { st.k = v; B.render(); });
  B.toggleBtn('▶ 同步扫描', false, on => { st.run = on; });

  B.renderFn = () => {
    const k = st.k, b = bOf(), q = Q(), qg = Qg(), qp = Qp();
    // 两块面板的十字轴
    for (const O of [O1, O2]) {
      B.seg(V(O.x - 165, O.y), V(O.x + 165, O.y), { stroke: '#22314a', 'stroke-width': 1.2 });
      B.seg(V(O.x, O.y - 165), V(O.x, O.y + 165), { stroke: '#22314a', 'stroke-width': 1.2 });
    }
    B.textM(V(O1.x, 40), '圆  $x^2 + y^2 = a^2$', { fill: '#5cadff', 'font-size': 13, 'font-weight': 700 });
    B.textM(V(O2.x, 40), `像：椭圆 $x^2/a^2 + y^2/(ka)^2 = 1$`, { fill: '#67e8f9', 'font-size': 13, 'font-weight': 700 });
    // 曲线
    const cpts = [], epts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03) {
      cpts.push(`${(O1.x + R * Math.cos(t)).toFixed(1)},${(O1.y + R * Math.sin(t)).toFixed(1)}`);
      epts.push(`${(O2.x + R * Math.cos(t)).toFixed(1)},${(O2.y + b * Math.sin(t)).toFixed(1)}`);
    }
    mk('polyline', { points: cpts.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    mk('polyline', { points: epts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.2 }, B.dyn);
    // 面板间的对应虚线（同一 θ 的圆点 → 像点，被"压"下去）
    B.seg(q, qp, { stroke: 'rgba(139,163,189,.35)', 'stroke-width': 1.2, 'stroke-dasharray': '4 5' });
    // 右面板：未压缩的虚线点 + 压缩箭头
    B.dot(qg, 4, { fill: '#3f5f8f' });
    B.seg(qg, qp, { stroke: '#ff9e4a', 'stroke-width': 2, 'stroke-dasharray': '5 4' });
    // 半径 OQ / OQ'
    B.seg(O1, q, { stroke: '#5cadff', 'stroke-width': 1.6 });
    B.seg(O2, qp, { stroke: '#67e8f9', 'stroke-width': 1.6 });
    // 切线：圆切线方向 (−sinθ, cosθ)；像切线方向 (−a sinθ, b cosθ)
    B.inf(q, add(q, V(-Math.sin(st.t), Math.cos(st.t))), { stroke: '#fff', 'stroke-width': 1.8 });
    B.inf(qp, add(qp, V(-R * Math.sin(st.t), b * Math.cos(st.t))), { stroke: '#fff', 'stroke-width': 1.8 });
    B.text(V(q.x + 22, q.y - 22), '切线', { fill: '#fff', 'font-size': 11 });
    B.text(V(qp.x + 22, qp.y - 22), '像切线', { fill: '#fff', 'font-size': 11 });
    // 点
    B.dot(O1, 3, { fill: '#93a1b5' }); B.dot(O2, 3, { fill: '#93a1b5' });
    B.dot(q, 6, { fill: '#5cadff', stroke: '#fff', 'stroke-width': 2 });
    B.dot(qp, 6, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(q.x - 4, q.y - 13), 'Q', { fill: '#5cadff', 'font-size': 12.5, 'font-weight': 700 });
    B.textM(V(qp.x - 4, qp.y - 13), "$Q' = T_k(Q)$", { fill: '#67e8f9', 'font-size': 12.5, 'font-weight': 700 });
    // 读数：圆切线 cosθ·u+sinθ·v=a 与像切线 cosθ·u+(sinθ/k)·v=a 逐字对应
    const c = Math.cos(st.t), s = Math.sin(st.t);
    cK(`k = ${fmt(k, 2)}，b = k·a = ${fmt(b, 1)}`);
    cEq1(`${fmt(c, 2)}·u + ${fmt(s, 2)}·v = a`, 'ok');
    cEq2(`${fmt(c, 2)}·u + ${fmt(s / k, 2)}·v = a（把 sinθ 换成 sinθ/k）`, 'ok');
    cArea(`πa² → πab：面积比 = k = ${fmt(k, 2)}`, 'ok');
    B.hint('不变的：相切、平行、共线、线段比例、中点、面积比（恒为 k）；变的：长度、角度、垂直 —— 圆变椭圆');
  };

  const step = () => { if (st.run) { st.t += 0.02; if (st.t > Math.PI) st.t -= 2 * Math.PI; B.render(); } B.raf(step); };
  B.handle({
    get: Q,
    set: p => { st.t = Math.atan2(p.y - O1.y, p.x - O1.x); },
    color: '#5cadff', r: 8, label: 'Q', lo: [9, -11],
  });

  B.render();
  B.raf(step);
  return B;
}
