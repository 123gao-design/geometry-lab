/* 图 P5 · 蒙日圆机：椭圆两条互相垂直的切线的交点轨迹
   局部坐标（中心为原点，v 向下为正）：椭圆 u²/a²+v²/b²=1。
   M 在外 → 极线(polarLine)=切点弦 → lineConic 求两切点 T1,T2 → 切线 M–T1、M–T2；
   垂直 ⟺ 切线方向向量点积为 0 ⟺ |OM|² = a²+b²（蒙日圆）——两块读数必须一起翻绿。 */
import { mk, V, sub, norm, dot, len, fmt, polarLine, lineFromEq, lineConic } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = createConicLab(root, W, H);
  const C = V(430, 245);
  const st = { a: 175, b: 110, M: V(540, 82), run: false, phi: -0.9 };

  const cK = B.chip('切线夹角'), cR = B.chip('半径判定'), cP = B.chip('M 的位置');

  B.slider('半长轴 a', 130, 180, 1, 175, v => { st.a = +v; B.render(); });
  B.slider('半短轴 b', 80, 120, 1, 110, v => { st.b = +v; B.render(); });
  B.btn('▶ 沿蒙日圆巡游', () => { st.run = !st.run; if (st.run) go(); });

  function go() {
    if (!st.run) return;
    st.phi += 0.014;
    const R = Math.hypot(st.a, st.b);
    st.M = V(C.x + R * Math.cos(st.phi), C.y + R * Math.sin(st.phi));
    B.render();
    B.raf(go);
  }

  B.renderFn = () => {
    const a = st.a, b = st.b, E = { cx: C.x, cy: C.y, a, b };
    // 轴与椭圆
    B.seg(V(20, C.y), V(W - 20, C.y), { stroke: plotInk.axis, 'stroke-width': 1.2 });
    B.seg(V(C.x, 16), V(C.x, H - 16), { stroke: plotInk.axis, 'stroke-width': 1.2 });
    const pts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03)
      pts.push(`${(C.x + a * Math.cos(t)).toFixed(1)},${(C.y + b * Math.sin(t)).toFixed(1)}`);
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.2 }, B.dyn);
    // 蒙日圆
    const R = Math.hypot(a, b);
    mk('circle', { cx: C.x, cy: C.y, r: R, fill: 'none', stroke: plotInk.amber, 'stroke-width': 1.6, 'stroke-dasharray': '7 6' }, B.dyn);
    B.textM(V(C.x + R * 0.72, C.y - R * 0.72), '蒙日圆 $x^2+y^2=a^2+b^2$', { fill: plotInk.amber, 'font-size': 12, 'text-anchor': 'end' });
    B.dot(C, 3.5, { fill: plotInk.guide });
    // M 的位置与切线
    const m = st.M, u = m.x - C.x, v = m.y - C.y, F = u * u / (a * a) + v * v / (b * b) - 1;
    const OM2 = u * u + v * v;
    if (F < -0.004) {
      cP(`M 在椭圆内（F(M)=${fmt(F, 2)}）：无实切线`, 'warn');
      cK('—', ''); cR('—', '');
    } else {
      const L = polarLine(E, m), [q1, q2] = lineFromEq(L.A, L.B, L.D);
      B.inf(q1, q2, { stroke: Math.abs(F) < 0.004 ? plotInk.rose : plotInk.green, 'stroke-width': 1.4, 'stroke-dasharray': '5 5' });
      B.text(V((q1.x + q2.x) / 2, (q1.y + q2.y) / 2 - 8), Math.abs(F) < 0.004 ? '切线（极线退化）' : '切点弦=极线', { fill: plotInk.green, 'font-size': 11 });
      if (Math.abs(F) < 0.004) {
        cP(`M 在曲线上（F(M)=0）：极线退化为 M 处切线（L3）`, '');
        cK('—', ''); cR(`|OM|²=${fmt(OM2, 0)} vs a²+b²=${fmt(a * a + b * b, 0)}`, '');
      } else {
        cP(`M 在椭圆外（F(M)=${fmt(F, 2)}）：两条切线`, '');
        const hits = lineConic(E, q1, q2);
        if (hits) {
          const [T1, T2] = hits;
          B.inf(m, T1, { stroke: plotInk.copper, 'stroke-width': 2 });
          B.inf(m, T2, { stroke: plotInk.copper, 'stroke-width': 2 });
          B.dot(T1, 4.5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 1.4 });
          B.dot(T2, 4.5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 1.4 });
          const d1 = sub(T1, m), d2 = sub(T2, m);
          const cosAng = Math.abs(dot(d1, d2)) / (len(d1) * len(d2) || 1);
          const perp = cosAng < 0.03;
          cK(`切线方向点积/|…| = ${fmt(cosAng, 3)}${perp ? ' → 垂直！' : ''}`, perp ? 'ok' : '');
          cR(`|OM|² = ${fmt(OM2, 0)} vs a²+b² = ${fmt(a * a + b * b, 0)}`,
            Math.abs(OM2 - (a * a + b * b)) / (a * a + b * b) < 0.02 ? 'ok' : '');
          if (perp) { // M 处直角标记
            const e1 = norm(d1), e2 = norm(d2), s = 10;
            const mp = `M${(m.x + s * e1.x).toFixed(1)},${(m.y + s * e1.y).toFixed(1)}L${(m.x + s * (e1.x + e2.x)).toFixed(1)},${(m.y + s * (e1.y + e2.y)).toFixed(1)}L${(m.x + s * e2.x).toFixed(1)},${(m.y + s * e2.y).toFixed(1)}`;
            mk('path', { d: mp, fill: 'none', stroke: plotInk.green, 'stroke-width': 1.6 }, B.dyn);
          }
        }
      }
    }
    B.hint('把 M 拖到金色圆上 —— 两切线恰好成直角；按「巡游」让 M 贴圆走一圈，垂直关系纹丝不动');
  };

  B.handle({ get: () => st.M, set: q => { st.M = V(q.x, q.y); }, color: plotInk.rose, r: 8, label: 'M', lo: [10, -12] });

  B.render();
  return B;
}
