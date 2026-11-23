/* 图 P4 · 极坐标机：以焦点为极点的圆锥曲线统一方程
   局部坐标：极点=焦点 F（画布坐标），极轴水平向右（u 右为正），准线是竖直直线 u=−d。
   带符号极径满足 ρ(1−e cosθ)=ed；实际距离仍取绝对值。
   带符号 ρ 采样（双曲线第二支自动齐活）；θ 扫描动画 + 实时验证 |PF|/d(P,l)=e。 */
import { mk, V, add, mul, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = createConicLab(root, W, H);
  const F = V(565, 245);            // 极点 = 焦点
  const st = { e: 0.65, d: 120, th: 35 };

  const cE = B.chip('实际距离比'), cV = B.chip('顶点与半轴'), cL = B.chip('有符号极径');
  const relation = B.chip('焦点直线'), reciprocal = B.chip('倒数和');

  B.slider('离心率 e', 0.15, 2.4, 0.01, 0.65, v => { st.e = v; B.render(); });
  B.slider('焦准距 d', 60, 170, 2, 120, v => { st.d = v; B.render(); });
  const sTh = B.slider('极角 θ°', 0, 180, 1, 35, v => { sweep.set(false); st.th = v; B.render(); });
  function setAngle(value) { sweep.set(false); st.th = value; sTh.sync(value); B.render(); }
  B.btn('沿极轴', () => setAngle(0));
  B.btn('通径方向', () => setAngle(90));
  const infinity = B.btn('对准无穷远方向', () => { if (st.e >= 1) setAngle(Math.acos(1 / st.e) * 180 / Math.PI); });
  const sweep = B.toggleBtn('θ 扫描', false, active => {
    B.cancelRaf();
    if (!active) return;
    let last;
    const tick = now => {
      if (last != null) st.th = (st.th + Math.min(now - last, 40) * .05) % 180;
      last = now;
      sTh.sync(st.th); B.render(); B.raf(tick);
    };
    B.raf(tick);
  });

  B.renderFn = () => {
    const { e, d } = st, th = st.th * Math.PI / 180, ed = e * d;
    const rho = a => ed / (1 - e * Math.cos(a));
    infinity.disabled = e < 1;
    // 极轴与准线
    B.seg(V(20, F.y), V(W - 20, F.y), { stroke: plotInk.axis, 'stroke-width': 1.2 });
    B.seg(V(F.x - d, 16), V(F.x - d, H - 16), { stroke: plotInk.guide, 'stroke-width': 1.6, 'stroke-dasharray': '6 6' });
    B.text(V(F.x - d, 30), '准线 x=−d', { fill: plotInk.guide, 'font-size': 12 });
    B.seg(F, V(F.x - d, F.y), { stroke: plotInk.guide, 'stroke-width': 1.2, 'stroke-dasharray': '3 4' });
    B.text(V(F.x - d / 2 - 4, F.y - 8), 'd', { fill: plotInk.guide, 'font-size': 12 });
    // 中心与第二焦点（e→1 时中心跑向无穷远）
    if (Math.abs(1 - e * e) > 0.04) {
      const c0 = e * e * d / (1 - e * e);
      if (Math.abs(c0) < 850) {
        const O = V(F.x + c0, F.y), F2 = V(F.x + 2 * c0, F.y);
        B.dot(O, 3.5, { fill: plotInk.amber });
        B.text(V(O.x, O.y - 10), '中心', { fill: plotInk.amber, 'font-size': 11 });
        B.dot(F2, 3.5, { fill: plotInk.rose });
        B.text(V(F2.x, F2.y + 18), 'F₂', { fill: plotInk.rose, 'font-size': 11 });
      }
    }
    B.dot(F, 5, { fill: plotInk.rose, stroke: plotInk.ink, 'stroke-width': 1.5 });
    B.text(V(F.x + 6, F.y + 18), '极点=焦点 F', { fill: plotInk.rose, 'font-size': 12, 'font-weight': 700 });
    // 曲线：带符号 ρ 采样，笔断处理无穷远与渐近线
    const polys = []; let cur = null, px = 0, py = 0;
    for (let k = 0; k <= 1256; k++) {
      const a = k * Math.PI / 628;
      if (Math.abs(1 - e * Math.cos(a)) < 1e-3) { cur = null; continue; }
      const r = rho(a), x = F.x + r * Math.cos(a), y = F.y + r * Math.sin(a);
      if (x < -170 || x > W + 170 || y < -170 || y > H + 170) { cur = null; continue; }
      if (cur && Math.abs(x - px) + Math.abs(y - py) > 60) cur = null;
      const s = `${x.toFixed(1)},${y.toFixed(1)}`;
      if (cur) cur.push(s); else { cur = [s]; polys.push(cur); }
      px = x; py = y;
    }
    polys.forEach(pts => mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.4 }, B.dyn));
    const dir = V(Math.cos(th), Math.sin(th));
    const denominators = [1 - e * dir.x, 1 + e * dir.x];
    const radii = denominators.map(q => Math.abs(q) < 1e-10 ? null : ed / q);
    const drawEndpoint = (r, side, label, color) => {
      if (r == null) return null;
      const p = add(F, mul(dir, side * r));
      const screenLength = Math.min(W * 2, Math.abs(r)) * Math.sign(r);
      B.seg(F, add(F, mul(dir, side * screenLength)), { stroke: color,
        'stroke-width': side > 0 ? 2.4 : 1.65, 'stroke-dasharray': side > 0 ? '' : '5 5' });
      if (p.x > 12 && p.x < W - 12 && p.y > 12 && p.y < H - 12) {
        B.dot(p, 5, { fill: color, stroke: plotInk.ink });
        B.text(V(p.x + 9, p.y - 12), label, { 'text-anchor': 'start' });
      }
      return p;
    };
    B.inf(F, add(F, dir), { stroke: plotInk.rule, 'stroke-width': 1.25, 'stroke-dasharray': '3 6' });
    B.arrow(add(F, mul(dir, 27)), add(F, mul(dir, 47)), { stroke: plotInk.guide, head: 8, wide: 3 });
    const P = drawEndpoint(radii[0], 1, radii[0] < 0 ? 'P（反向）' : 'P', plotInk.blue);
    drawEndpoint(radii[1], -1, radii[1] < 0 ? 'Q（反向）' : 'Q', plotInk.green);
    if (P && P.x > 18 && P.x < W - 18 && P.y > 18 && P.y < H - 18) {
      B.seg(P, V(F.x - d, P.y), { stroke: plotInk.copper, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' });
      B.text(V((F.x - d + P.x) / 2, P.y + 15), 'd(P,ℓ)');
    }
    if (P) {
      const distance = Math.abs(P.x - F.x + d);
      const ratio = Math.abs(radii[0]) / distance;
      cE('|PF|/d(P,ℓ) = ' + fmt(ratio, 3) + ' · e = ' + fmt(e, 2), 'ok');
    } else cE('P 在无穷远处，当前只读 Q');
    const gap = 1 - e * e;
    cV(e === 1 ? '顶点在距 F 向左 d/2，通径 2ed = ' + fmt(2 * ed, 0)
      : 'a = ' + fmt(ed / Math.abs(gap), 0) + ' · b = ' + fmt(ed / Math.sqrt(Math.abs(gap)), 0));
    cL(radii.map((r, i) => 'ρ' + '₁₂'[i] + ' = ' + (r == null ? '无穷远' : fmt(r, 1))).join(' · '));
    const finite = radii.every(r => r != null);
    relation(!finite ? '一个端点在无穷远处' : radii.some(r => r < 0) ? '端点分属双曲线两支' : '焦点在两个端点之间',
      finite ? 'ok' : 'warn');
    reciprocal(finite ? '1/ρ₁ + 1/ρ₂ = ' + fmt(denominators.reduce((a, b) => a + b, 0) / ed, 4) + ' = 2/(ed)'
      : '取极限时，无穷远端的倒数为 0');
  };

  B.render();
  return B;
}
