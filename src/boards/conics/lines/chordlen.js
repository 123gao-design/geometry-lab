/* 图 L2 · 弦长机：韦达定理与弦长公式（椭圆 u²/a²+v²/b²=1）
   直线过把手 P0、方向角 α，单位参数化 P(t) = P0 + t·d，代入椭圆得 A t² + B t + C = 0：
   t₁+t₂ = −B/A、t₁t₂ = C/A、|t₁−t₂| = √Δ/|A| —— 弦长 L = √(1+k²)·|x₁−x₂| 正是它的化身。
   中点 M = (P(t₁)+P(t₂))/2 落在共轭直径方向上：k_chord·k_OM = −b²/a²（A2 点差法 live）。 */
import { mk, V, add, mul, dist, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = createConicLab(root, W, H);
  const C = V(430, 245), a = 190, b = 112;
  const st = { alpha: 38 * Math.PI / 180, P0: V(318, 150) };

  const dir = () => V(Math.cos(st.alpha), Math.sin(st.alpha));
  const cV = B.chip('韦达（沿线参数）'), cL = B.chip('弦长'), cM = B.chip('中点与共轭');

  B.slider('直线倾角°', 0, 180, 1, 38, v => { st.alpha = v * Math.PI / 180; B.render(); });

  B.renderFn = () => {
    const d = dir(), aa = a * a, bb = b * b;
    // 轴与椭圆
    B.seg(V(20, C.y), V(W - 20, C.y), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    B.seg(V(C.x, 16), V(C.x, H - 16), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    const pts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03)
      pts.push(`${(C.x + a * Math.cos(t)).toFixed(1)},${(C.y + b * Math.sin(t)).toFixed(1)}`);
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.4 }, B.dyn);
    // 联立（d 为单位向量）
    const pl = V(st.P0.x - C.x, st.P0.y - C.y);
    const A2 = d.x * d.x / aa + d.y * d.y / bb;
    const Bq = 2 * (pl.x * d.x / aa + pl.y * d.y / bb);
    const Cq = pl.x * pl.x / aa + pl.y * pl.y / bb - 1;
    const D = Bq * Bq - 4 * A2 * Cq;
    B.inf(st.P0, add(st.P0, d), { stroke: plotInk.guide, 'stroke-width': 1.2, opacity: 0.5 });
    cV(`t₁+t₂ = −B/A = ${fmt(-Bq / A2, 2)}，t₁t₂ = C/A = ${fmt(Cq / A2, 2)}`, '');
    if (D > 1e-9) {
      const s = Math.sqrt(D);
      const p1 = add(st.P0, mul(d, (-Bq - s) / (2 * A2)));
      const p2 = add(st.P0, mul(d, (-Bq + s) / (2 * A2)));
      const t1 = (-Bq - s) / (2 * A2), t2 = (-Bq + s) / (2 * A2);
      // 弦
      B.seg(p1, p2, { stroke: plotInk.amber, 'stroke-width': 3.5 });
      const mid = V((p1.x + p2.x) / 2, (p1.y + p2.y) / 2);
      B.seg(C, mid, { stroke: plotInk.green, 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
      for (const [p, nm, ax] of [[p1, 'A', 'end'], [p2, 'B', 'start']]) {
        B.dot(p, 5.5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 1.8 });
        B.text(V(p.x + (ax === 'start' ? 9 : -9), p.y - 10), nm, { fill: plotInk.teal, 'font-size': 12.5, 'font-weight': 700, 'text-anchor': ax });
      }
      B.dot(mid, 4.5, { fill: plotInk.green, stroke: plotInk.ink, 'stroke-width': 1.6 });
      B.text(V(mid.x, mid.y - 13), 'M', { fill: plotInk.green, 'font-size': 12, 'font-weight': 700 });
      // 弦长：沿线 |t₁−t₂| = √Δ/|A|（d 单位）＝ √(1+k²)|x₁−x₂|
      const Lm = dist(p1, p2), Lf = s / A2;
      cL(`L(实测) = ${fmt(Lm, 1)} = √Δ/|A| = ${fmt(Lf, 1)} = √(1+k²)·|x₁−x₂|`, Math.abs(Lm - Lf) < 0.5 ? 'ok' : 'warn');
      // 中点与共轭：k_chord·k_OM = −b²/a²
      const dvx = d.x, dvy = d.y;
      if (Math.abs(dvx) < 0.02) {
        cM(`竖直弦：M 在长轴上（k_OM = 0），|M| 最近 = 通径方向`, 'ok');
      } else {
        const kc = dvy / dvx;
        const kom = Math.abs(mid.x - C.x) < 0.5 ? Infinity : (mid.y - C.y) / (mid.x - C.x);
        if (!isFinite(kom)) cM(`k_chord·k_OM = ${fmt(kc, 2)}·∞（M 在短轴上 → kc = ∞）`, Math.abs(Math.abs(st.alpha - Math.PI / 2) % Math.PI) < 0.03 ? 'ok' : '');
        else {
          const prod = kc * kom, ref = -bb / aa;
          cM(`k_chord·k_OM = ${fmt(prod, 3)} ≈ −b²/a² = ${fmt(ref, 3)}`, Math.abs(prod - ref) < 0.02 ? 'ok' : 'warn');
        }
      }
    } else {
      cL(D > -1e-9 ? 'Δ=0：相切，弦长退化为 0' : 'Δ<0：相离，无弦可量', D > -1e-9 ? 'ok' : 'warn');
      cM('把直线拖进椭圆再读中点', '');
    }
    B.hintM('两条弦长公式是同一公式的两件外衣；中点 M 永远落在共轭直径上 —— $k_{chord}\\cdot k_{OM} = -b^2/a^2$');
  };

  B.handle({
    get: () => st.P0,
    set: q => { st.P0 = V(q.x, q.y); },
    color: plotInk.copper, r: 9, label: '拖我', lo: [12, -14],
  });

  B.render();
  return B;
}
