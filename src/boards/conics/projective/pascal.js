/* 图 9 · Pascal 定理：三对对边交点共线（相邻点重合退化为切线） */
import { Board, mk, V, conicPt, polarLine, lineFromEq, interLL, plEval, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 800, 560);
  const E = { cx: 400, cy: 280, a: 185, b: 140 };
  const st = { t: [0.6, 1.65, 2.75, 3.85, 4.75, 5.8], dance: false };
  const tdiff = (a, b) => { let d = (a - b) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };
  for (let i = 0; i < 6; i++)
    B.handle({ get: () => conicPt(E, st.t[i]),
      set: p => { st.t[i] = Math.atan2((p.y - E.cy) / E.b, (p.x - E.cx) / E.a); },
      color: ['#c084fc', '#ff7b8a', '#5cadff', '#4ade80', '#ff9e4a', '#ffd166'][i], r: 7,
      label: '123456'[i], lo: [9, -10] });
  B.btn('打乱六点', () => { for (let i = 0; i < 6; i++) st.t[i] += (Math.random() - 0.5) * 1.6; B.render(); }, { pri: true });
  B.toggleBtn('让点舞动', st.dance, v => { st.dance = v;
    if (v) { const sp = st.t.map((_, i) => 0.0035 * (i % 2 ? 1 : -1) * (1 + i * 0.13));
      (function loop() { if (!st.dance) return;
        for (let i = 0; i < 6; i++) st.t[i] += sp[i]; B.render(); B.raf(loop); })(); }
    else B.cancelRaf(); });
  const chipX = B.chip('X=(12)∩(45)'), chipY = B.chip('Y=(23)∩(56)'), chipZ = B.chip('Z=(34)∩(61)'), chipD = B.chip('Z 到 XY 距离');
  function edge(i, j) { // 第 i,j 点连成的“直线”（相邻重合时退化为切线）
    const d = Math.abs(tdiff(st.t[i], st.t[j]));
    if (d < 0.055) { const mid = st.t[i] + tdiff(st.t[j], st.t[i]) / 2;
      const L = polarLine(E, conicPt(E, mid)); return { pts: lineFromEq(L.A, L.B, L.D), tan: true }; }
    return { pts: [conicPt(E, st.t[i]), conicPt(E, st.t[j])], tan: false };
  }
  B.renderFn = () => {
    mk('ellipse', { cx: E.cx, cy: E.cy, rx: E.a, ry: E.b, fill: 'rgba(92,173,255,.05)', stroke: '#3f5f8f', 'stroke-width': 2 }, B.dyn);
    const P = st.t.map(t => conicPt(E, t));
    // 六边形淡轮廓
    mk('polygon', { points: P.map(p => `${p.x},${p.y}`).join(' '), fill: 'rgba(139,163,189,.05)', stroke: 'rgba(139,163,189,.35)', 'stroke-width': 1 }, B.dyn);
    // 六条边（切线化时高亮）
    for (let i = 0; i < 6; i++) { const e = edge(i, (i + 1) % 6);
      B.inf(...e.pts, { stroke: e.tan ? '#ffd166' : '#2e3d57', 'stroke-width': e.tan ? 1.6 : 1.3 }); }
    const pairs = [[0, 1, 3, 4, 'X', '#c084fc'], [1, 2, 4, 5, 'Y', '#4ade80'], [2, 3, 5, 0, 'Z', '#ff9e4a']];
    const pt = {};
    for (const [i, j, k, l, nm] of pairs) {
      const e1 = edge(i, j), e2 = edge(k, l);
      const m = interLL(...e1.pts, ...e2.pts);
      pt[nm] = m;
    }
    const show = (nm, m, col) => {
      if (!m) return '在无穷远（对边平行）';
      B.dot(m, 6.5, { fill: col, stroke: '#fff', 'stroke-width': 2 });
      B.text(V(m.x, m.y - 14), nm, { fill: col, 'font-size': 13, 'font-weight': 700 });
      return fmt(Math.min(999, Math.hypot(m.x - E.cx, m.y - E.cy)), 0) + ' px 处';
    };
    chipX(show('X', pt.X, '#c084fc')); chipY(show('Y', pt.Y, '#4ade80')); chipZ(show('Z', pt.Z, '#ff9e4a'));
    const xs = pt.X && pt.Y, xy = xs ? { A: pt.Y.y - pt.X.y, B: pt.X.x - pt.Y.x, D: pt.X.y * pt.Y.x - pt.Y.y * pt.X.x } : null;
    if (xy) {
      const [a, b] = lineFromEq(xy.A, xy.B, xy.D);
      B.inf(a, b, { stroke: '#fff', 'stroke-width': 2 });
      B.text(V((pt.X.x + pt.Y.x) / 2, (pt.X.y + pt.Y.y) / 2 - 14), 'Pascal 线', { fill: '#fff', 'font-size': 12.5, 'font-weight': 700 });
      const dev = pt.Z ? Math.abs(plEval(xy, pt.Z)) : NaN;
      chipD(fmt(dev, 2) + ' px（理论为 0）', dev < 0.6 ? 'ok' : 'warn');
      B.hint(pt.Z ? '三个交点永远趴在同一条白色直线（Pascal 线）上' : '');
    } else { chipD('—'); B.hint('X 或 Y 在无穷远处：暂时画不出 Pascal 线 —— 把六点稍微错开一点'); }
  };
  B.render();
  return B;
}
