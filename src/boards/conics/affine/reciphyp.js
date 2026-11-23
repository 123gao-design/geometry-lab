/* 图 A4 · 反比例母机：一切中心双曲线都是 y=1/x 的仿射像
   母本（左，v 向上为正）：uv=1，两条渐近线就是坐标轴，点 Q=(u, 1/u) 与两轴围出
   面积恒为 |uv|=1 的矩形。仿射映射 T(u,v) = ( a(u+v)/2, b(u−v)/2 )（可逆线性）把
   母本变换到右面板（局部 u 右、v 下）：X²/a² − Y²/b² = (u+v)²/4 − (u−v)²/4 = uv = 1，
   P=T(Q) 必落在目标双曲线上；两条坐标轴被变换成渐近线方向 (a,±b)；矩形变平行四边形。
   a=b 时 T 退化为「旋转45°+放缩」（相似），渐近线夹角回到 90°、e=√2。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = createConicLab(root, W, H);
  const O1 = V(225, 245), S = 55;          // 母本中心与比例（px/单位）
  const O2 = V(645, 245);                  // 目标双曲线中心
  const st = { u: 0.9, a: 120, b: 85, run: false, tau: 0 };

  const v = () => 1 / st.u;
  const Q = () => V(O1.x + S * st.u, O1.y - S * v());                 // 母本上（v 向上）
  const P = () => V(O2.x + st.a * (st.u + v()) / 2, O2.y + st.b * (st.u - v()) / 2);
  const Up = () => V(O2.x + st.a * st.u / 2, O2.y + st.b * st.u / 2); // u 轴上的点 → 渐近线₁
  const Vp = () => V(O2.x + st.a * v() / 2, O2.y - st.b * v() / 2);   // v 轴上的点 → 渐近线₂

  const cR = B.chip('矩形面积 |uv|'), cP = B.chip('P 落在双曲线上'), cE = B.chip('渐近线夹角 · e'), cEq = B.chip('a=b 特判');
  B.btn('换支', () => { st.u = -st.u; B.render(); });
  B.toggleBtn('▶ 同步扫描', false, on => { st.run = on; });

  B.renderFn = () => {
    const q = Q(), p = P(), up = Up(), vp = Vp();
    // 母本：坐标轴（=渐近线）+ 双曲线 y=1/x
    B.seg(V(20, O1.y), V(O1.x + S * 3.6, O1.y), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    B.seg(V(O1.x, 20), V(O1.x, H - 20), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    for (const s2 of [1, -1]) {
      const pts = [];
      for (let uu = 0.24 * s2; s2 > 0 ? uu <= 3.3 : uu >= -3.3; uu += 0.06 * s2)
        pts.push(`${(O1.x + S * uu).toFixed(1)},${(O1.y - S / uu).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.green, 'stroke-width': 2.4 }, B.dyn);
    }
    B.text(V(28, 30), '母本 · y = 1/x（反比例函数）', { fill: plotInk.green, 'font-size': 12.5, 'font-weight': 700 });
    B.text(V(28, H - 14), '母本的渐近线 = 坐标轴', { fill: plotInk.guide, 'font-size': 11 });
    // 矩形 O-U-Q-V（面积 |uv| 恒为 1）
    mk('polygon', {
      points: `${O1.x},${O1.y} ${O1.x + S * st.u},${O1.y} ${O1.x + S * st.u},${O1.y - S * v()} ${O1.x},${O1.y - S * v()}`,
      fill: plotInk.amber, opacity: 0.12, stroke: plotInk.amber, 'stroke-width': 1.1, 'stroke-dasharray': '4 3',
    }, B.dyn);
    B.text(V(O1.x + S * st.u, O1.y + 15), 'u', { fill: plotInk.amber, 'font-size': 12, 'font-weight': 700, 'text-anchor': 'middle' });
    B.text(V(O1.x - 10, O1.y - S * v()), 'v', { fill: plotInk.amber, 'font-size': 12, 'font-weight': 700, 'text-anchor': 'end' });
    B.dot(O1, 3, { fill: plotInk.guide });
    B.dot(q, 5.5, { fill: plotInk.green, stroke: plotInk.ink, 'stroke-width': 1.8 });
    // 目标：渐近线（轴的像）+ 双曲线两支
    B.inf(O2, V(O2.x + st.a, O2.y + st.b), { stroke: plotInk.guide, 'stroke-width': 1.2, 'stroke-dasharray': '7 6', opacity: 0.6 });
    B.inf(O2, V(O2.x + st.a, O2.y - st.b), { stroke: plotInk.guide, 'stroke-width': 1.2, 'stroke-dasharray': '7 6', opacity: 0.6 });
    for (const s2 of [1, -1]) {
      const pts = [];
      for (let w = -1.35; w <= 1.35 + 1e-9; w += 0.03)
        pts.push(`${(O2.x + s2 * st.a / Math.cos(w)).toFixed(1)},${(O2.y + st.b * Math.tan(w)).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.4 }, B.dyn);
    }
    B.textM(V(478, 30), '像 · $x^2/a^2 - y^2/b^2 = 1$', { fill: plotInk.teal, 'font-size': 12.5, 'font-weight': 700 });
    B.text(V(478, H - 14), '渐近线方向 (a, ±b) = 坐标轴的像', { fill: plotInk.guide, 'font-size': 11 });
    // 平行四边形 O₂-U′-P-V′（矩形的像）
    mk('polygon', {
      points: `${O2.x},${O2.y} ${up.x},${up.y} ${p.x},${p.y} ${vp.x},${vp.y}`,
      fill: plotInk.amber, opacity: 0.12, stroke: plotInk.amber, 'stroke-width': 1.1, 'stroke-dasharray': '4 3',
    }, B.dyn);
    B.dot(O2, 3, { fill: plotInk.guide });
    B.dot(up, 4, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.6 });
    B.dot(vp, 4, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.6 });
    B.text(V(up.x + 8, up.y - 8), 'U′', { fill: plotInk.amber, 'font-size': 11, 'font-weight': 700 });
    B.text(V(vp.x + 8, vp.y - 8), 'V′', { fill: plotInk.amber, 'font-size': 11, 'font-weight': 700 });
    B.dot(p, 6.5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 2 });
    B.text(V(p.x + 10, p.y - 10), 'P = T(Q)', { fill: plotInk.teal, 'font-size': 12.5, 'font-weight': 700 });
    // 对应关系虚线
    B.seg(q, p, { stroke: plotInk.guide, 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: 0.45 });
    // 读数
    const X = p.x - O2.x, Y = p.y - O2.y;
    const val = X * X / (st.a * st.a) - Y * Y / (st.b * st.b);
    cR(`|u·v| = ${fmt(Math.abs(st.u * v()), 3)} —— 矩形面积恒 1`, 'ok');
    cP(`X²/a² − Y²/b² = ${fmt(val, 3)} —— P 必在双曲线上`, Math.abs(val - 1) < 0.02 ? 'ok' : 'warn');
    const cosA = (st.a * st.a - st.b * st.b) / (st.a * st.a + st.b * st.b);
    const ang = Math.acos(Math.max(-1, Math.min(1, cosA))) * 180 / Math.PI;
    const e = Math.sqrt(st.a * st.a + st.b * st.b) / st.a;
    cE(`渐近线夹角 ${fmt(ang, 1)}°，e = √(a²+b²)/a = ${fmt(e, 3)}`);
    if (Math.abs(st.a - st.b) <= 3)
      cEq('a=b：夹角 90°、e=√2 —— 只差旋转/翻折+放缩（相似）', 'ok');
    else
      cEq('a≠b：夹角 ≠ 90° —— 必须真仿射（斜切），不是相似', '');
    B.hint('拖 Q 沿 y=1/x 跑：|uv|=1 的矩形被变换成平行四边形、坐标轴被变换成渐近线；把 a 拖到与 b 相等，回到相似');
  };

  const step = () => {
    if (st.run) {
      st.tau += 0.02;
      const mag = 0.25 + 3.0 * (0.5 - 0.5 * Math.cos(st.tau));
      st.u = Math.sign(st.u) * mag;
      B.render();
    }
    B.raf(step);
  };
  B.handle({
    get: Q,
    set: q => {
      const uu = (q.x - O1.x) / S;
      st.u = (uu >= 0 ? 1 : -1) * Math.min(3.3, Math.max(0.24, Math.abs(uu)));
    },
    color: plotInk.green, r: 8, label: 'Q', lo: [10, -12],
  });
  B.slider('a（半实轴）', 50, 170, 1, st.a, w => { st.a = w; B.render(); });
  B.slider('b（半虚轴）', 50, 170, 1, st.b, w => { st.b = w; B.render(); });

  B.render();
  B.raf(step);
  return B;
}
