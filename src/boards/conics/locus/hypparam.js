/* 图 P1b · 双曲线参数机：P = (a·sec t, b·tan t)
   局部坐标 u 向右、v 向下为正（与 P1 椭圆机同一约定）。sec/tan 的几何身份：
   E = (a·sec t, 0) 在辅助圆 x²+y²=a² 的圆外，OE 是割线长，从 E 作圆的切线，
   切点恰为 T = (a·cos t, a·sin t)，切线长 |ET| = a·tan t —— secant/tangent 由此得名。
   竖直线过 E、水平线过 G=(0, b·tan t)（切线长乘 b/a）交出双曲线上的 P。
   t → ±90°：sec、tan 同时无定义，P 沿渐近线方向趋向无穷 —— 参数在渐近方向失效。 */
import { mk, V, dist, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = createConicLab(root, W, H);
  const C = V(430, 245), a = 150, b = 100;
  const TCAP = 1.15;                       // 画布内 |t| 上限（sec ≤ 2.24，E 不出画）
  const st = { t: 0.62, s: 1, run: true, dir: 1 };

  const sec = () => 1 / Math.cos(st.t), tan = () => Math.tan(st.t);
  const E = () => V(C.x + st.s * a * sec(), C.y);
  const G = () => V(C.x, C.y + b * tan());
  const P = () => V(E().x, G().y);
  const T = () => V(C.x + st.s * a * Math.cos(st.t), C.y + a * Math.sin(st.t));

  const cP = B.chipM('$P=(a\\sec t,\\ b\\tan t)$'), cV = B.chip('消参验证'), cEt = B.chip('割线 · 切线');
  B.toggleBtn('▶ 扫描 t', true, on => { st.run = on; });
  const sT = B.slider('t（参数角°）', -66, 66, 0.5, st.t * 180 / Math.PI, v => { st.t = v * Math.PI / 180; B.render(); });

  B.renderFn = () => {
    const e = E(), g = G(), p = P(), t = T();
    // 轴与渐近线
    B.seg(V(20, C.y), V(W - 20, C.y), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    B.seg(V(C.x, 20), V(C.x, H - 20), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    B.inf(C, V(C.x + a, C.y + b), { stroke: plotInk.guide, 'stroke-width': 1.2, 'stroke-dasharray': '7 6', opacity: 0.6 });
    B.inf(C, V(C.x + a, C.y - b), { stroke: plotInk.guide, 'stroke-width': 1.2, 'stroke-dasharray': '7 6', opacity: 0.6 });
    B.textM(V(C.x + 168, C.y - 100), '渐近线 $y=\\pm(b/a)x$', { fill: plotInk.guide, 'font-size': 11 });
    // 辅助圆 r=a（E 永远在它外面）
    const cpts = [];
    for (let w = -Math.PI; w <= Math.PI + 1e-9; w += 0.04)
      cpts.push(`${(C.x + a * Math.cos(w)).toFixed(1)},${(C.y + a * Math.sin(w)).toFixed(1)}`);
    mk('polyline', { points: cpts.join(' '), fill: 'none', stroke: plotInk.blue, 'stroke-width': 1.3, 'stroke-dasharray': '7 6', opacity: 0.55 }, B.dyn);
    B.textM(V(C.x - a + 26, C.y + a - 6), '辅助圆 $x^2+y^2=a^2$', { fill: plotInk.blue, 'font-size': 11 });
    // 双曲线两支：逐支采样 t∈(−90°,90°)，绝不跨 cos t=0（否则画出伪弦）
    for (const s2 of [1, -1]) {
      const pts = [];
      for (let w = -1.35; w <= 1.35 + 1e-9; w += 0.03)
        pts.push(`${(C.x + s2 * a / Math.cos(w)).toFixed(1)},${(C.y + b * Math.tan(w)).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.6 }, B.dyn);
    }
    B.textM(V(C.x + a + 44, C.y - 8), '$x^2/a^2 - y^2/b^2 = 1$', { fill: plotInk.teal, 'font-size': 11.5 });
    // 割线 OE（橙色，盖在轴上）与切线 ET（金色）
    B.seg(C, e, { stroke: plotInk.copper, 'stroke-width': 3 });
    B.seg(e, t, { stroke: plotInk.amber, 'stroke-width': 2 });
    // 构造虚线：过 E 竖直、过 G 水平，交出 P
    B.seg(e, p, { stroke: plotInk.copper, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
    B.seg(g, p, { stroke: plotInk.green, 'stroke-width': 1.6, 'stroke-dasharray': '5 4' });
    B.seg(C, g, { stroke: plotInk.green, 'stroke-width': 1.4 });
    // 点与标注
    B.dot(C, 3, { fill: plotInk.guide });
    B.dot(e, 5.5, { fill: plotInk.copper, stroke: plotInk.ink, 'stroke-width': 1.8 });
    B.dot(g, 5, { fill: plotInk.green, stroke: plotInk.ink, 'stroke-width': 1.8 });
    B.dot(t, 4.5, { fill: plotInk.blue, stroke: plotInk.ink, 'stroke-width': 1.8 });
    B.dot(p, 6.5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 2 });
    B.text(V(e.x + st.s * 8, C.y + 19), 'E（割线端）', { fill: plotInk.copper, 'font-size': 11.5, 'font-weight': 700, 'text-anchor': st.s > 0 ? 'start' : 'end' });
    B.text(V(C.x - 10, g.y - 8), 'G', { fill: plotInk.green, 'font-size': 12.5, 'font-weight': 700, 'text-anchor': 'end' });
    B.text(V(t.x + st.s * 10, t.y - 10), 'T（切点）', { fill: plotInk.blue, 'font-size': 11.5, 'font-weight': 700 });
    // 读数
    const u = st.s * a * sec(), v = b * tan();
    const val = u * u / (a * a) - v * v / (b * b);
    cP(`P = (${fmt(u, 1)}, ${fmt(v, 1)}) 局部`);
    cV(`u²/a² − v²/b² = ${fmt(val, 3)}（sec²−tan²≡1）`, Math.abs(val - 1) < 0.005 ? 'ok' : 'warn');
    const dET = dist(e, t);
    cEt(`割线 OE = ${fmt(a * sec(), 1)}，切线 |ET| = ${fmt(dET, 1)} = a·|tan t|（sec/tan 词源）`,
      Math.abs(dET - a * Math.abs(tan())) < 0.6 ? 'ok' : 'warn');
    B.hintM('拖动 P（越过中心可换支）：OE 是割线、ET 是切线；t 逼近 $\\pm 90^\\circ$，P 沿渐近线趋向无穷');
  };

  const step = () => {
    if (st.run) {
      st.t += 0.011 * st.dir;
      if (st.t > TCAP) { st.t = TCAP; st.dir = -1; }
      if (st.t < -TCAP) { st.t = -TCAP; st.dir = 1; }
      sT.sync(st.t * 180 / Math.PI);
      B.render();
    }
    B.raf(step);
  };
  B.handle({
    get: P,
    set: q => {
      st.s = q.x >= C.x ? 1 : -1;
      let w = Math.atan((q.y - C.y) / b);
      st.t = Math.max(-TCAP, Math.min(TCAP, w));
    },
    color: plotInk.teal, r: 8, label: 'P', lo: [10, -12],
  });

  B.render();
  B.raf(step);
  return B;
}
