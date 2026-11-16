/* 图 5 · 完全四点形造极线：旋转割线，极线纹丝不动 */
import { Board, mk, V, add, sub, mul, len, dist, lineConic, interLL, polarLine, plEval, lineFromEq, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 800, 540);
  const E = { cx: 400, cy: 270, a: 170, b: 115 };
  const st = { P: V(610, 120), t1: 2.6, t2: 1.05, showPolar: true };
  B.handle({ get: () => st.P, set: p => { st.P = p; }, color: '#fff', r: 8, label: 'P', lo: [11, -12] });
  for (const k of ['t1', 't2'])
    B.handle({ get: () => add(st.P, mul(V(Math.cos(st[k]), Math.sin(st[k])), 85)),
      set: p => { const d = sub(p, st.P); if (len(d) > 18) st[k] = Math.atan2(d.y, d.x); },
      color: '#ff9e4a', r: 6, thin: true, lo: [10, -10] });
  B.toggleBtn('显示公式极线（对照）', st.showPolar, v => { st.showPolar = v; B.render(); });
  const chip1 = B.chip('割线'), chip2 = B.chip('|QR − 公式极线|');
  const cut = th => { const dir = V(Math.cos(th), Math.sin(th));
    return lineConic(E, sub(st.P, mul(dir, 800)), add(st.P, mul(dir, 800))); };
  B.renderFn = () => {
    mk('ellipse', { cx: E.cx, cy: E.cy, rx: E.a, ry: E.b, fill: 'rgba(92,173,255,.05)', stroke: '#3f5f8f', 'stroke-width': 2 }, B.dyn);
    const c1 = cut(st.t1), c2 = cut(st.t2);
    const Lp = polarLine(E, st.P);
    const bad = (!c1 || !c2 || Math.abs(Math.sin(st.t1 - st.t2)) < 0.04);
    if (bad) { chip1('割线退化（相切 / 两线重合 / 虚割线）—— 转动橙色把手即可', 'warn'); chip2('—'); }
    else {
      const [A, Bl] = c1, [C, Dd] = c2;
      chip1('两条实割线：交出 A, B 与 C, D', 'ok');
      // 四条“交叉”连线
      const q = interLL(A, C, Bl, Dd), r = interLL(A, Dd, Bl, C);
      for (const [p1, p2] of [[A, C], [Bl, Dd], [A, Dd], [Bl, C]]) {
        if (p1 && p2 && q && r && dist(p1, p2) > 0) B.inf(p1, p2, { stroke: '#8a6a3a', 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: .6 });
      }
      // 割线
      const d1 = V(Math.cos(st.t1), Math.sin(st.t1)), d2 = V(Math.cos(st.t2), Math.sin(st.t2));
      B.seg(sub(st.P, mul(d1, 800)), add(st.P, mul(d1, 800)), { stroke: '#7a5a30', 'stroke-width': 1, opacity: .55 });
      B.seg(sub(st.P, mul(d2, 800)), add(st.P, mul(d2, 800)), { stroke: '#7a5a30', 'stroke-width': 1, opacity: .55 });
      // A,B,C,D
      const lab = ['A', 'B', 'C', 'D'], pts = [A, Bl, C, Dd];
      pts.forEach((p, i) => { B.dot(p, 4.5, { fill: '#8fa3bd', stroke: '#fff', 'stroke-width': 1.4 });
        B.text(V(p.x, p.y - 10), lab[i], { fill: '#93a1b5', 'font-size': 11, 'font-weight': 700 }); });
      // Q, R 与 QR
      if (q && r) {
        B.inf(q, r, { stroke: '#ff7b8a', 'stroke-width': 2.8 });
        for (const [pt, nm] of [[q, 'Q'], [r, 'R']]) {
          if (Math.abs(pt.x) < 800 && Math.abs(pt.y) < 600) { B.dot(pt, 5.5, { fill: '#ff7b8a', stroke: '#fff', 'stroke-width': 2 });
            B.text(V(pt.x, pt.y - 12), nm, { fill: '#ff7b8a', 'font-size': 12, 'font-weight': 700 }); } }
        const dev = Math.max(Math.abs(plEval(Lp, q)), Math.abs(plEval(Lp, r)));
        chip2(`${fmt(dev, 2)} px（理论为 0）`, dev < 0.5 ? 'ok' : 'warn');
      }
      B.hint('拖动两个橙色把手旋转割线 —— 粉线 QR（P 的极线）纹丝不动；拖动 P 本身，它才移动');
    }
    if (st.showPolar) { const [a, b] = lineFromEq(Lp.A, Lp.B, Lp.D);
      B.inf(a, b, { stroke: '#5cadff', 'stroke-width': 1.6, 'stroke-dasharray': '9 6' }); }
  };
  B.render();
  return B;
}
