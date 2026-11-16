/* 图 P4 · 极坐标机：以焦点为极点的圆锥曲线统一方程
   局部坐标：极点=焦点 F（画布坐标），极轴水平向右（u 右为正），准线是竖直直线 u=−d。
   统一定义的极坐标直译：|PF|=ρ, d(P,l)=ρcosθ+d → ρ(1−e cosθ)=ed。
   带符号 ρ 采样（双曲线第二支自动齐活）；θ 扫描动画 + 实时验证 |PF|/d(P,l)=e。 */
import { Board, mk, V, add, mul, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const F = V(565, 245);            // 极点 = 焦点
  const st = { e: 0.65, d: 120, th: 35 };

  const cE = B.chip('统一定义 |PF|/d'), cV = B.chip('顶点与半轴'), cL = B.chip('通径与倒数和');

  const sE = B.slider('离心率 e', 0.15, 2.4, 0.01, 0.65, v => { st.e = v; B.render(); });
  B.slider('焦准距 d', 60, 170, 2, 120, v => { st.d = v; B.render(); });
  const sTh = B.slider('极角 θ°', 0, 180, 1, 35, v => { st.th = v; B.render(); });
  let run = false;
  B.btn('▶ θ 扫描', () => { run = !run; if (run) sweep(); });
  function sweep() {
    if (!run) return;
    st.th = st.th >= 180 ? 0 : st.th + 0.7;
    sTh.sync(st.th); B.render();
    B.raf(sweep);
  }

  B.renderFn = () => {
    const { e, d } = st, th = st.th * Math.PI / 180, ed = e * d;
    const rho = a => ed / (1 - e * Math.cos(a));
    // 极轴与准线
    B.seg(V(20, F.y), V(W - 20, F.y), { stroke: '#22314a', 'stroke-width': 1.2 });
    B.seg(V(F.x - d, 16), V(F.x - d, H - 16), { stroke: '#93a1b5', 'stroke-width': 1.6, 'stroke-dasharray': '6 6' });
    B.text(V(F.x - d, 30), '准线 x=−d', { fill: '#93a1b5', 'font-size': 12 });
    B.seg(F, V(F.x - d, F.y), { stroke: '#93a1b5', 'stroke-width': 1.2, 'stroke-dasharray': '3 4' });
    B.text(V(F.x - d / 2 - 4, F.y - 8), 'd', { fill: '#93a1b5', 'font-size': 12 });
    // 中心与第二焦点（e→1 时中心跑向无穷远）
    if (Math.abs(1 - e * e) > 0.04) {
      const c0 = e * e * d / (1 - e * e);
      if (Math.abs(c0) < 850) {
        const O = V(F.x + c0, F.y), F2 = V(F.x + 2 * c0, F.y);
        B.dot(O, 3.5, { fill: '#ffd166' });
        B.text(V(O.x, O.y - 10), '中心', { fill: '#ffd166', 'font-size': 11 });
        B.dot(F2, 3.5, { fill: '#ff7b8a' });
        B.text(V(F2.x, F2.y + 18), 'F₂', { fill: '#ff7b8a', 'font-size': 11 });
      }
    }
    B.dot(F, 5, { fill: '#ff7b8a', stroke: '#fff', 'stroke-width': 1.5 });
    B.text(V(F.x + 6, F.y + 18), '极点=焦点 F', { fill: '#ff7b8a', 'font-size': 12, 'font-weight': 700 });
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
    polys.forEach(pts => mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.4 }, B.dyn));
    // 当前射线：P（θ 方向，带符号 ρ）与对径点 Q（θ+π）
    const dir = V(Math.cos(th), Math.sin(th));
    const r1 = rho(th), r2 = rho(th + Math.PI);
    const P = add(F, mul(dir, r1)), Q = add(F, mul(V(-dir.x, -dir.y), r2));
    B.inf(F, add(F, dir), { stroke: '#3a4a63', 'stroke-width': 1.2 });
    B.seg(F, P, { stroke: '#5cadff', 'stroke-width': 2.6 });
    B.dot(P, 5.5, { fill: '#5cadff', stroke: '#fff', 'stroke-width': 1.6 });
    B.text(V(P.x + 9, P.y - 9), 'P', { fill: '#5cadff', 'font-size': 12.5, 'font-weight': 700, 'text-anchor': 'start' });
    B.seg(F, Q, { stroke: '#4ade80', 'stroke-width': 1.6, 'stroke-dasharray': '4 4' });
    B.dot(Q, 4, { fill: '#4ade80' });
    B.text(V(Q.x + 8, Q.y - 8), 'Q（θ+π）', { fill: '#4ade80', 'font-size': 11, 'text-anchor': 'start' });
    // P 到准线的垂线段（统一定义的右边）
    B.seg(P, V(F.x - d, P.y), { stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-dasharray': '4 4' });
    B.text(V((F.x - d + P.x) / 2, P.y + 15), 'd(P,l)', { fill: '#ff9e4a', 'font-size': 11 });
    // 读数
    const dPl = Math.abs((P.x - F.x) + d), ratio = dist(F, P) / dPl;
    cE(`|PF|/d(P,l) = ${fmt(dist(F, P), 0)}/${fmt(dPl, 0)} = ${fmt(ratio, 3)} vs e = ${fmt(e, 2)}`, Math.abs(ratio - e) < 0.01 ? 'ok' : 'warn');
    const aS = ed / Math.abs(1 - e * e), bS = ed / Math.sqrt(Math.abs(1 - e * e));
    cV(`ρ(0)=ed/(1−e)=${fmt(rho(0), 0)}｜ρ(π)=ed/(1+e)=${fmt(rho(Math.PI), 0)}｜a=${fmt(aS, 0)} b=${fmt(bS, 0)}`, '');
    cL(`通径=2ed=${fmt(2 * ed, 0)}｜1/ρ₁+1/ρ₂=${fmt(1 / r1 + 1 / r2, 4)} vs 2/(ed)=${fmt(2 / ed, 4)}`,
      Math.abs(1 / r1 + 1 / r2 - 2 / ed) < 1e-4 ? 'ok' : 'warn');
    B.hint('拖 θ：比值固定为 e；滑 e 穿过 1，椭圆 → 抛物线 → 双曲线连续变形；对径点 Q 与 P 构成焦点弦');
  };

  B.render();
  return B;
}
