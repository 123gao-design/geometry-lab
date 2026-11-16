/* 图 4 · 扫描出极线：调和共轭点的轨迹 */
import { Board, mk, V, add, sub, mul, dist, harmFourth, crOn, polarLine, lineFromEq, lineConic, TAU, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 540;
  const B = new Board(root, W, H);
  const CIR = { cx: 400, cy: 270, a: 130, b: 130 }, R = 130;
  const st = { P: V(330, 300), theta: 0.4, trail: [], showPolar: false, scanning: false };
  st.P.clamp = p => {
    p.x = Math.max(20, Math.min(W - 20, p.x)); p.y = Math.max(20, Math.min(H - 20, p.y));
    const d = dist(p, V(CIR.cx, CIR.cy));
    if (d < 16) { const u = norm2(sub(p, V(CIR.cx, CIR.cy))); return add(V(CIR.cx, CIR.cy), mul(u, 16)); }
    return p;
  };
  function norm2(v) { const l = Math.hypot(v.x, v.y) || 1; return V(v.x / l, v.y / l); }

  B.handle({ get: () => st.P, set: p => { st.P = st.P.clamp(p); st.trail.length = 0; }, color: '#fff', r: 8, label: 'P', lo: [11, -12] });
  B.handle({ get: () => add(st.P, mul(V(Math.cos(st.theta), Math.sin(st.theta)), 80)),
    set: p => { const d = sub(p, st.P); if (dist(d, V(0, 0)) > 18) st.theta = Math.atan2(d.y, d.x); },
    color: '#ff9e4a', r: 6, thin: true, lo: [10, -10] });

  B.btn('开始扫描', () => {
    B.cancelRaf();
    const t0 = st.theta; st.scanning = true;
    (function step() {
      st.theta += 0.035;
      const g = currentGeometry();
      if (g && g.Q && Math.abs(g.Q.x) < 2500 && Math.abs(g.Q.y) < 2500) st.trail.push(g.Q);
      if (st.theta >= t0 + TAU) {
        st.theta = t0; st.scanning = false; B.render(); return;
      }
      B.render(); B.raf(step);
    })();
  }, { pri: true });
  B.btn('清除轨迹', () => { st.trail.length = 0; B.render(); });
  B.toggleBtn('显示理论极线', st.showPolar, v => { st.showPolar = v; B.render(); });
  const chip1 = B.chip('P 的位置'), chip2 = B.chipM("$(U,V;P,Q')$"), chip3 = B.chipM("$d\\cdot d'/r^2$");

  function currentGeometry() { // 当前割线方向下的 U, V, Q′
    const dir = V(Math.cos(st.theta), Math.sin(st.theta));
    const uv = lineConic(CIR, sub(st.P, mul(dir, 700)), add(st.P, mul(dir, 700)));
    if (!uv) return null;
    const Q = harmFourth(uv[0], uv[1], st.P);
    return { uv, Q };
  }

  B.renderFn = () => {
    const O = V(CIR.cx, CIR.cy);
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'rgba(92,173,255,.05)', stroke: '#3f5f8f', 'stroke-width': 2 }, B.dyn);
    B.dot(O, 3.5, { fill: '#5c6a80' }); B.text(V(O.x, O.y - 8), 'O', { fill: '#93a1b5', 'font-size': 12 });
    const d = dist(st.P, O), dp = R * R / d;
    const inside = d < R - 3, on = d > R - 3 && d < R + 3;
    chip1(inside ? '圆内 —— 极线在圆外（每条割线都有效）' : on ? '圆上 —— 极线退化为切线' : '圆外 —— 极线穿过圆内', inside ? '' : 'ok');
    const g = currentGeometry();
    if (g) {
      const dir = V(Math.cos(st.theta), Math.sin(st.theta));
      B.seg(sub(st.P, mul(dir, 700)), add(st.P, mul(dir, 700)), { stroke: '#7a5a30', 'stroke-width': 1, opacity: .7 });
      const [u, v] = g.uv;
      B.dot(u, 5, { fill: '#4ade80', stroke: '#fff', 'stroke-width': 1.6 });
      B.dot(v, 5, { fill: '#4ade80', stroke: '#fff', 'stroke-width': 1.6 });
      B.text(V(u.x, u.y - 11), 'U', { fill: '#4ade80', 'font-size': 11.5, 'font-weight': 700 });
      B.text(V(v.x, v.y - 11), 'V', { fill: '#4ade80', 'font-size': 11.5, 'font-weight': 700 });
      if (g.Q) {
        B.dot(g.Q, 6.5, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
        B.text(V(g.Q.x, g.Q.y - 13), 'P′', { fill: '#ffd166', 'font-size': 12.5, 'font-weight': 700 });
        const cr = crOn(u, v, st.P, g.Q);
        chip2(fmt(cr, 3), Math.abs(cr + 1) < 0.01 ? 'ok' : 'warn');
      } else chip2('P 在 UV 中点 —— Q′ 在无穷远', 'warn');
    } else chip2('该方向与圆不相交（虚割线）', 'warn');
    if (st.trail.length) {
      const pts = st.trail.map(p => `${fmt(p.x, 1)},${fmt(p.y, 1)}`).join(' ');
      mk('polyline', { points: pts, fill: 'none', stroke: 'rgba(255,209,102,.55)', 'stroke-width': 1.6 }, B.dyn);
    }
    if (st.scanning) B.hint('扫描中：割线绕 P 旋转，黄色调和共轭点 P′ 正在落下…');
    else if (st.trail.length > 40) B.hint('P′ 的轨迹连成了直线 —— 这就是 P 的极线。打开「显示理论极线」对照');
    else B.hint('拖动橙色把手选割线方向，或点「开始扫描」');
    const L = polarLine(CIR, st.P);
    if (st.showPolar) {
      const [a, b] = lineFromEq(L.A, L.B, L.D);
      B.inf(a, b, { stroke: '#5cadff', 'stroke-width': 2, 'stroke-dasharray': '9 6' });
      const Ps = add(O, mul(sub(st.P, O), R * R / (d * d)));
      B.dot(Ps, 5, { fill: '#5cadff' }); B.text(V(Ps.x, Ps.y + 18), 'P* (反演像)', { fill: '#5cadff', 'font-size': 11 });
    }
    chip3(fmt(d * dp / (R * R), 4), Math.abs(d * dp / (R * R) - 1) < 0.001 ? 'ok' : 'warn');
  };
  B.render();
  return B;
}