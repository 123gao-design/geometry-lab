/* 图 放2 · 柯西不等式机：(a²+b²)(c²+d²) ≥ (ac+bd)²
   把四个数两两配成向量 u=(a,b)、v=(c,d)：内积 u·v=ac+bd，模长平方 a²+b²、c²+d²。
   几何面：v 在 u 方向上的投影长 |u·v|/|u| 不超过 |v|（|cosθ|≤1），两边平方即柯西；
   代数面：恒等式 (a²+b²)(c²+d²)−(ac+bd)²=(ad−bc)² 中，(ad−bc) 恰是 u、v 张成的
   平行四边形带符号面积 —— 非负部分由一平方承担，取等当且仅当 ad=bc，即 u∥v 共线。
   局部坐标约定：原点 O=(430,240)，每单位 55px（px=430+55x，py=240−55y，y 向上），
   两向量终点落在网格 x,y∈[−6,6] 内。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { a: 1, b: 2, c: 3, d: 4, grid: true, labs: true };
  const cA = B.chipM('|u|²'), cB = B.chipM('|v|²'), cD = B.chipM('内积'), cJ = B.chipM('判读');
  const px = x => 430 + 55 * x, py = y => 240 - 55 * y;
  const O = V(430, 240);

  B.renderFn = () => {
    const { a, b, c, d } = st;
    const u2 = a * a + b * b, v2 = c * c + d * d;
    const dot = a * c + b * d, gap = a * d - b * c;
    const R = u2 * v2, dot2 = dot * dot, gap2 = gap * gap;
    const U = V(px(a), py(b)), Vv = V(px(c), py(d)), W = V(px(a + c), py(b + d));
    const m = {
      px, py, X0: -6, X1: 6, Y0: -6, Y1: 6,
      sx: 2, sy: 2, lx: 2, ly: 2, axLab: '$x$', ayLab: '$y$',
      grid: st.grid, labs: st.labs,
    };
    B.grid(m);
    // 平行四边形：u、v、u+v 三顶点围成，面积 |ad−bc|
    mk('polygon', { points: `${O.x},${O.y} ${U.x},${U.y} ${W.x},${W.y} ${Vv.x},${Vv.y}`, fill: '#ff7b8a', 'fill-opacity': .13, stroke: '#ff7b8a', 'stroke-width': 1.1, 'stroke-dasharray': '5 4' }, B.dyn);
    // v 在 u 方向上的投影
    if (u2 > 1e-9 && st.labs) {
      const t = dot / u2;
      B.dot(V(px(a * t), py(b * t)), 4, { fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.4 });
      B.seg(O, V(px(a * t), py(b * t)), { stroke: '#67e8f9', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
      B.text(V(px((a + a * t) / 2) + 8, py((b + b * t) / 2) + 4), '投影', { 'font-size': 12, fill: '#67e8f9' });
    }
    // 两向量：线先画、箭头后补（B.arrow line:false）—— 共线时 v 的线恰穿 u 的箭头，箭头须压线
    B.seg(O, U, { stroke: '#5cadff', 'stroke-width': 2.8 });
    B.seg(O, Vv, { stroke: '#ff9e4a', 'stroke-width': 2.8 });
    B.arrow(O, U, { fill: '#5cadff', head: 14, wide: 6.5, line: false });
    B.arrow(O, Vv, { fill: '#ff9e4a', head: 14, wide: 6.5, line: false });
    if (u2 > 1e-9 && v2 > 1e-9 && st.labs) {
      const a1 = Math.atan2(b, a), a2 = Math.atan2(d, c);
      let dA = (a2 - a1 + Math.PI * 3) % (Math.PI * 2) - Math.PI;
      const AP = [];
      for (let i = 0; i <= 14; i++) { const t = a1 + dA * i / 14; AP.push(`${O.x + 42 * Math.cos(t)},${O.y - 42 * Math.sin(t)}`); }
      mk('polyline', { points: AP.join(' '), fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.1 }, B.dyn);
      B.tex(V(O.x + 54, O.y - 34), '$\\theta$', { size: 13, anchor: 'mid', color: '#93a1b5' });
      B.text(V(px(a) + 10, py(b) - 8), 'u=(a,b)', { 'font-size': 12, fill: '#5cadff' });
      B.text(V(px(c) + 10, py(d) + 14), 'v=(c,d)', { 'font-size': 12, fill: '#ff9e4a' });
    }
    B.tex(V(430, 34), `$\\vec u=(a,b)$，$\\vec v=(c,d)$　　内积 $\\vec u\\cdot\\vec v=ac+bd$`, { size: 15, anchor: 'mid' });
    B.textM(V(430, 62), '投影长 $|v|\\cdot|\\cos\\theta|$ 不超过 $|v|$：$|\\cos\\theta|\\le1$ 两边平方，即柯西不等式', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 恒等式
    B.tex(V(430, 430), `$(a^2+b^2)(c^2+d^2)\\ =(ac+bd)^2+(ad-bc)^2$，其中 $ad-bc$ 是 $\\vec u,\\vec v$ 张开的带符号面积`, { size: 13, anchor: 'mid' });
    // 徽章
    cA(`$a^2+b^2=${f1(u2)}$`);
    cB(`$c^2+d^2=${f1(v2)}$`);
    cD(`$ac+bd=${f1(dot)}$`);
    if (u2 < 1e-9 || v2 < 1e-9)
      cJ('有一向量为零：内积与左侧同为零，取等', 'ok');
    else if (Math.abs(gap) < 1e-9)
      cJ(`$ad-bc=0$：$\\vec u\\parallel\\vec v$，$(ac+bd)^2=(a^2+b^2)(c^2+d^2)$，达到等号`, 'ok');
    else
      cJ(`$|\\cos\\theta|=${f1(Math.abs(dot / Math.sqrt(R)))}<1$：$(ac+bd)^2=${f1(dot2)}$，差 $(ad-bc)^2=${f1(gap2)}$ —— 未取等`);
  };

  const PRE = [
    { a: 1, b: 2, c: 3, d: 4, n: '① 一般例' },
    { a: 1, b: 2, c: -4, d: 2, n: '② 正交例' },
    { a: 1, b: 2, c: 2, d: 4, n: '③ 共线取等' },
    { a: 0, b: 2, c: 3, d: 4, n: '④ 平行轴例' },
  ];
  PRE.forEach(P => B.btnM(P.n, () => {
    st.a = P.a; st.b = P.b; st.c = P.c; st.d = P.d;
    sA.sync(P.a); sB.sync(P.b); sC.sync(P.c); sD.sync(P.d);
    B.render();
  }, { on: false }));
  B.graphToggles(st, ['grid', 'labs']);

  const sA = B.slider('a =', -5, 5, .1, 1, v => { st.a = v; B.render(); });
  const sB = B.slider('b =', -5, 5, .1, 2, v => { st.b = v; B.render(); });
  const sC = B.slider('c =', -5, 5, .1, 3, v => { st.c = v; B.render(); });
  const sD = B.slider('d =', -5, 5, .1, 4, v => { st.d = v; B.render(); });

  B.hint('拖四数或点预设：平行四边形面积 |ad−bc| 合拢到 0（共线）时取等');
  B.render();
  return B;
}