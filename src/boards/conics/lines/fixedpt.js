/* 图 L5 · 定点机：顶点斜率积定值 → 弦恒过定点
   局部坐标（中心为原点，v 向下为正）：椭圆 u²/a²+v²/b²=1（a=180,b=112 固定），顶点 V=(a,0)。
   约束 k_VA·k_VB = K（K<0）：用离心角半角参数 —— 顶点到点 (a cos t, b sin t) 的斜率 = −(b/a)cot(t/2)，
   约束化成 cot u·cot v = K'（u=t₁/2, v=t₂/2, K'=K a²/b²）→ 弦与 x 轴交点 x_T = a(K'+1)/(K'−1) 与弦位置无关。
   特殊刻度：K=0→左顶点；K=−b²/a²→中心（直径，D5）；K*=−(b²/a²)(1+e)/(1−e)→右焦点。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = createConicLab(root, W, H);
  const C = V(430, 245), a = 180, b = 112;
  const aa = a * a, bb = b * b, cc = aa - bb;
  const e = Math.sqrt(1 - bb / aa);
  const Kstar = -(bb / aa) * (1 + e) / (1 - e);   // 定点=右焦点时的 K
  const st = { K: -3.18, u: 40, run: false, dir: 1 };

  const cT = B.chip('定点判读'), cK = B.chip('约束参数'), cM = B.chip('斜率积实测');

  const sK = B.slider('斜率积 K', -6, -0.2, 0.02, -3.18, v => { st.K = v; B.render(); });
  const sU = B.slider('弦位置 u°', 15, 80, 1, 40, v => { st.u = v; B.render(); });
  B.btn('▶ 扫弦', () => { st.run = !st.run; if (st.run) go(); });

  function go() {
    if (!st.run) return;
    st.u += st.dir * 0.25;
    if (st.u >= 80) { st.u = 80; st.dir = -1; }
    if (st.u <= 15) { st.u = 15; st.dir = 1; }
    sU.sync(st.u); B.render();
    B.raf(go);
  }

  const chord = u => {          // 给定半角 u，返回 {P, Q}（约束下另一端；勿命名为 A/B —— 会遮蔽画板 B）
    const Kp = st.K * aa / bb;
    const t1 = 2 * u * Math.PI / 180;
    const t2 = 2 * Math.atan(1 / (Kp * Math.tan(t1 / 2)));   // cot v = K'·tan u
    return { P: V(C.x + a * Math.cos(t1), C.y + b * Math.sin(t1)), Q: V(C.x + a * Math.cos(t2), C.y + b * Math.sin(t2)) };
  };

  B.renderFn = () => {
    // 椭圆、轴、顶点、焦点
    B.seg(V(20, C.y), V(W - 20, C.y), { stroke: plotInk.axis, 'stroke-width': 1.1 });
    B.seg(V(C.x, 16), V(C.x, H - 16), { stroke: plotInk.axis, 'stroke-width': 1.1 });
    const pts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03) pts.push(`${(C.x + a * Math.cos(t)).toFixed(1)},${(C.y + b * Math.sin(t)).toFixed(1)}`);
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.2 }, B.dyn);
    const Vp = V(C.x + a, C.y);
    B.dot(Vp, 4.5, { fill: plotInk.copper, stroke: plotInk.ink, 'stroke-width': 1.4 });
    B.text(V(Vp.x - 4, Vp.y - 14), '顶点 V(a,0)', { fill: plotInk.copper, 'font-size': 11.5, 'text-anchor': 'end' });
    const F2 = V(C.x + Math.sqrt(cc), C.y);
    B.dot(F2, 4, { fill: plotInk.rose });
    B.text(V(F2.x, F2.y + 17), '右焦点', { fill: plotInk.rose, 'font-size': 11 });
    // 定点 T（理论）
    const Kp = st.K * aa / bb, xT = a * (Kp + 1) / (Kp - 1);
    const T = V(C.x + xT, C.y);
    B.dot(T, 6, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.6 });
    B.text(V(T.x, T.y + 19), '定点 T', { fill: plotInk.amber, 'font-size': 12, 'font-weight': 700 });
    // 弦扇（约束下的一族弦，全过 T）
    for (const uf of [15, 27, 39, 51, 63, 75]) {
      if (Math.abs(uf - st.u) < 4) continue;
      const { P, Q } = chord(uf);
      B.inf(P, Q, { stroke: plotInk.rule, 'stroke-width': 1, opacity: 0.5 });
    }
    // 当前弦
    const { P, Q } = chord(st.u);
    B.inf(P, Q, { stroke: plotInk.copper, 'stroke-width': 2.4 });
    [P, Q].forEach((p, i) => {
      B.dot(p, 5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 1.5 });
      B.text(V(p.x, p.y - 12), i ? 'B' : 'A', { fill: plotInk.teal, 'font-size': 12.5, 'font-weight': 700 });
    });
    // 实测：弦与 x 轴交点 + 斜率积
    const la = P.y - C.y, lb = Q.y - C.y;
    const xm = Math.abs(lb - la) < 1e-6 ? P.x : (P.x * lb - Q.x * la) / (lb - la);
    cT(`理论 x_T = a(K'+1)/(K'−1) = ${fmt(xT, 1)} px｜实测弦截距 = ${fmt(xm - C.x, 1)} px`, Math.abs(xm - C.x - xT) < 2 ? 'ok' : 'warn');
    const k1 = (P.y - C.y) / (P.x - Vp.x), k2 = (Q.y - C.y) / (Q.x - Vp.x);
    cM(`k_VA·k_VB = ${fmt(k1, 3)}×${fmt(k2, 3)} = ${fmt(k1 * k2, 3)} vs K = ${fmt(st.K, 2)}`, Math.abs(k1 * k2 - st.K) < 0.02 ? 'ok' : 'warn');
    let tag = '';
    if (Math.abs(st.K + bb / aa) < 0.02) tag = ' ← K=−b²/a²：T=中心，弦都是直径（D5 第三定义）';
    else if (Math.abs(st.K - Kstar) < 0.03) tag = ' ← K=K*：T=右焦点（焦点弦家族）';
    else if (st.K > -0.24) tag = ' ← K→0⁻：T 滑向左顶点';
    cK(`K = ${fmt(st.K, 2)}，K' = K a²/b² = ${fmt(Kp, 3)}${tag}`, '');
    B.hint('橙弦绕椭圆转，但所有弦都过金色定点 T；滑 K —— 定点沿 x 轴滑过左顶点、中心、右焦点');
  };

  B.render();
  return B;
}
