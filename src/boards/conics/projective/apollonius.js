/* 图 3c · 阿波罗尼奥斯圆：比值圆的直径端点调和分割基点 */
import { Board, mk, V, add, sub, mul, norm, dist, lerp, crOn, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 800, H = 480;
  const B = new Board(root, W, H);
  const st = { B: V(230, 240), C: V(570, 240), k: 1.8, ang: -1.1 };
  for (const k of ['B', 'C'])
    B.handle({ get: () => st[k], set: p => { st[k] = p; }, color: '#fff', r: 8, label: k, lo: [9, -12] });

  const chip1 = B.chip('|PB| : |PC|'), chip2 = B.chip('(B,C;D,E)'), chip3 = B.chip('状态');
  const kSlider = B.slider('比值 k', 0.35, 5, 0.05, 1.8, v => { st.k = v; B.render(); });
  B.btn('随机换 k', () => { st.k = +(0.5 + Math.random() * 2.5).toFixed(2); kSlider.sync(st.k); B.render(); });

  const apollo = () => { // Apollonius 圆（k ≠ 1）
    const t1 = st.k / (1 + st.k), t2 = st.k / (st.k - 1);
    const D = lerp(st.B, st.C, t1), E = lerp(st.B, st.C, t2);
    return { D, E, O: lerp(D, E, 0.5), R: dist(D, E) / 2 };
  };

  B.renderFn = () => {
    const { B: bp, C: cp, k } = st;
    B.inf(bp, cp, { stroke: '#3a4a63', 'stroke-width': 2 });
    const near1 = Math.abs(k - 1) < 0.03;
    if (near1) { // k=1：圆退化为垂直平分线，E 退化为无穷远点
      const M = lerp(bp, cp, 0.5), d = norm(sub(cp, bp));
      B.inf(V(M.x - d.y * 400, M.y + d.x * 400), V(M.x + d.y * 400, M.y - d.x * 400),
        { stroke: '#67e8f9', 'stroke-width': 2, 'stroke-dasharray': '8 6' });
      B.dot(M, 7, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
      B.text(V(M.x, M.y - 14), 'D = BC 中点（E 已退向无穷远）', { fill: '#ffd166', 'font-size': 12, 'font-weight': 700 });
      chip1('k = 1', 'warn'); chip2('(B,C;D,P∞) = −1 —— 正是中点的调和公式', 'ok');
      chip3('圆半径 → ∞：Apollonius 圆拉直成垂直平分线', 'warn');
      B.hint('k = 1：直径端点 E 趋向无穷远，调和公式回到"中点 ⟷ 无穷远点"');
      return;
    }
    const { D, E, O, R } = apollo();
    // 圆
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'rgba(103,232,249,.05)', stroke: '#67e8f9', 'stroke-width': 2 }, B.dyn);
    // P 在圆上
    const P = V(O.x + R * Math.cos(st.ang), O.y + R * Math.sin(st.ang));
    // 直径端点
    for (const [p, nm, col] of [[D, 'D', '#ffd166'], [E, 'E', '#ffd166']]) {
      const inb = p.x > 4 && p.x < W - 4 && p.y > 4 && p.y < H - 4;
      if (inb) { B.dot(p, 7, { fill: col, stroke: '#fff', 'stroke-width': 2 });
        B.text(V(p.x, p.y - 14), nm, { fill: col, 'font-size': 12.5, 'font-weight': 700 }); }
    }
    B.seg(D, E, { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 5', opacity: .8 }); // 直径
    // P 连线
    B.seg(P, bp, { stroke: '#c084fc', 'stroke-width': 1.4 }); B.seg(P, cp, { stroke: '#ff7b8a', 'stroke-width': 1.4 });
    B.dot(P, 6, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 2 });
    B.text(V(P.x, P.y - 13), 'P', { fill: '#67e8f9', 'font-size': 12.5, 'font-weight': 700 });
    // 数值
    const ratio = dist(P, bp) / dist(P, cp);
    chip1(`${fmt(ratio, 3)}（P 沿圆走时恒等于 k）`, Math.abs(ratio - k) < 0.01 ? 'ok' : 'warn');
    const cr = crOn(bp, cp, D, E);
    chip2(fmt(cr, 3), Math.abs(cr + 1) < 0.01 ? 'ok' : 'warn');
    const Rin = dist(D, bp) / dist(D, cp);
    chip3(`D、E 恰是圆与直线 BC 的交点（直径端点），且 BD:DC = ${fmt(Rin, 3)} = k`, 'ok');
    B.hint('结论：比值 k 的 Apollonius 圆，其直径两端点 D、E 调和分割 B、C —— 反之亦然');
  };

  // P 沿圆拖动：拖动把手即在圆上滑动（圆由 k 与 B、C 决定，P 不改变它）
  B.handle({
    get: () => { const { O, R } = apollo(); return V(O.x + R * Math.cos(st.ang), O.y + R * Math.sin(st.ang)); },
    set: p => { const { O } = apollo(); st.ang = Math.atan2(p.y - O.y, p.x - O.x); },
    color: '#67e8f9', r: 8, label: 'P', lo: [9, -13],
  });
  B.render();
  return B;
}
