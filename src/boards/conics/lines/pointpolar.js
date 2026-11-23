/* 图 L3 · 点位机：点与椭圆的位置关系 + 极线的三个角色
   椭圆 C（u²/a²+v²/b²=1）。拖动 M：
   · F(M) = u₀²/a²+v₀²/b²−1 定内（<0）/上（=0）/外（>0）—— 过 M 切线的条数 0/1/2 与之同步；
   · 极线 l：u·u₀/a² + v·v₀/b² = 1（T1 的极线公式）。M 在外：两切点连线（切点弦）与 l 逐字相同（La Hire）；
     M 在上：l 退化为切线本身；M 在内：切线不存在，但 l 仍然是一条实实在在的直线（虚切点弦）。
   M 在中心时极线跑向无穷远。 */
import { mk, V, add, dist, fmt, polarLine, lineFromEq, lineConic } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = createConicLab(root, W, H);
  const C = { cx: 430, cy: 245, a: 185, b: 112 };
  const st = { M: V(640, 105) };

  const cF = B.chip('点位 F(M)'), cP = B.chip('极线方程'), cT = B.chip('切线 · 切点弦');

  B.renderFn = () => {
    const m = st.M, aa = C.a * C.a, bb = C.b * C.b;
    const u0 = m.x - C.cx, v0 = m.y - C.cy;
    // 轴与椭圆
    B.seg(V(20, C.cy), V(W - 20, C.cy), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    B.seg(V(C.cx, 16), V(C.cx, H - 16), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    const pts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03)
      pts.push(`${(C.cx + C.a * Math.cos(t)).toFixed(1)},${(C.cy + C.b * Math.sin(t)).toFixed(1)}`);
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.4 }, B.dyn);
    // 点位
    const F = u0 * u0 / aa + v0 * v0 / bb - 1;
    cF(`F(M) = ${fmt(F, 3)} → ${F < -0.004 ? '内（过 M 无切线）' : F < 0.004 ? '上（恰一条切线）' : '外（恰两条切线）'}`,
      F < -0.004 ? '' : 'ok');
    // 极线
    if (Math.abs(u0) < 0.5 && Math.abs(v0) < 0.5) {
      cP('M = 中心：极线在无穷远处', 'warn');
      cT('中心没有实切线，也没有有限极线', '');
    } else {
      const L = polarLine(C, m);
      const [q1, q2] = lineFromEq(L.A, L.B, L.D);
      const onCurve = Math.abs(F) < 0.004;
      B.inf(q1, q2, { stroke: plotInk.amber, 'stroke-width': onCurve ? 2.2 : 1.4, 'stroke-dasharray': onCurve ? '' : '7 5' });
      cP(`u·(${fmt(u0 / aa, 5)}) + v·(${fmt(v0 / bb, 5)}) = 1`, '');
      // 切点 / 切点弦
      const hits = lineConic(C, q1, q2);
      if (F > 0.004 && hits) {
        for (const [i, T] of hits.entries()) {
          B.seg(m, T, { stroke: plotInk.rose, 'stroke-width': 2 });
          B.dot(T, 5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 1.8 });
          B.text(V(T.x + (i ? 10 : -10), T.y - 10), `T${i + 1}`, { fill: plotInk.teal, 'font-size': 12, 'font-weight': 700, 'text-anchor': i ? 'start' : 'end' });
        }
        cT('两切点的连线（切点弦）＝ 极线 l（La Hire）', 'ok');
      } else if (onCurve) {
        cT('M 在曲线上：极线退化为 M 处的切线', 'ok');
      } else {
        cT('M 在椭圆内：无实切线，但极线 l 仍然存在（虚切点弦）', '');
      }
    }
    B.dot(m, 6.5, { fill: plotInk.copper, stroke: plotInk.ink, 'stroke-width': 2 });
    B.hint('拖 M 任意走：F(M) 一秒判内外；M 在外两条切线现身 —— 切点弦与极线逐字相同；M 落到曲线上，极线塌成切线');
  };

  B.handle({
    get: () => st.M,
    set: q => { st.M = V(q.x, q.y); },
    color: plotInk.copper, r: 9, label: 'M', lo: [12, -13],
  });

  B.render();
  return B;
}
