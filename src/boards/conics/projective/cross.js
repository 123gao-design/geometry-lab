/* 图 2 · 交叉比不变性：中心投影保交叉比 */
import { Board, V, dist, interLL, crOn, harmFourth, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 800, 470);
  const LY = 100; // 上线高度
  const clampX = p => { p.y = LY; p.x = Math.max(50, Math.min(750, p.x)); return p; };
  const st = {
    A: V(140, LY), B: V(660, LY), C: V(300, LY), D: V(460, LY),
    S: V(400, 260), l2a: V(120, 410), l2b: V(680, 395),
  };
  const COL = { A: '#c084fc', B: '#ff7b8a', C: '#5cadff', D: '#ffd166' };
  for (const k of ['A', 'B', 'C', 'D'])
    B.handle({ get: () => st[k], set: p => { st[k] = clampX(p); }, color: COL[k], r: 8, label: k, lo: [8, -10] });
  B.handle({ get: () => st.S, set: p => { st.S = p; }, color: '#fff', r: 8, label: 'S', lo: [10, -12] });
  for (const k of ['l2a', 'l2b'])
    B.handle({ get: () => st[k], set: p => { st[k] = p; }, color: '#67e8f9', r: 7, thin: true });

  B.btn('调成调和', () => { // D → 调和共轭位置（动画）
    const tgt = harmFourth(st.A, st.B, st.C);
    if (!tgt) { B.hint('C 恰为 AB 中点：D 的调和共轭位置在无穷远处'); return; }
    let f = 0; B.cancelRaf();
    const x0 = st.D.x, x1 = tgt.x;
    (function step() {
      f += 0.06; st.D.x = x0 + (x1 - x0) * Math.min(1, f);
      if (f < 1) B.raf(step); B.render();
    })();
  }, { pri: true });
  B.btn('随手打乱', () => {
    const rnd = (a, b) => a + Math.random() * (b - a);
    st.A.x = rnd(60, 220); st.B.x = rnd(560, 740);
    st.C.x = rnd(st.A.x + 60, st.B.x - 60); st.D.x = rnd(st.C.x + 40, 720); B.render();
  });
  const chip1 = B.chipM('$(A,B;C,D)$'), chip2 = B.chipM("$(A',B';C',D')$"), chip3 = B.chip('判定');

  B.renderFn = () => {
    B.hint('');
    // 两条线
    B.seg(V(30, LY), V(770, LY), { stroke: '#3a4a63', 'stroke-width': 2 });
    const [l2a, l2b] = [st.l2a, st.l2b];
    if (dist(l2a, l2b) < 20) l2b.x = l2a.x + 40;
    B.inf(l2a, l2b, { stroke: '#3a4a63', 'stroke-width': 2 });
    B.text(V(28, LY - 14), '上线 l₁', { 'text-anchor': 'start', fill: '#93a1b5', 'font-size': 12.5 });
    B.text(V(l2a.x - 10, l2a.y + 24), '下线 l₂', { 'text-anchor': 'start', fill: '#93a1b5', 'font-size': 12.5 });
    // 中心投影
    const img = {}; let ok = true;
    for (const k of ['A', 'B', 'C', 'D']) {
      const m = interLL(st.S, st[k], l2a, l2b);
      if (!m) { ok = false; continue; }
      img[k] = m;
      B.seg(st.S, st[k], { stroke: COL[k], 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: .55 });
      B.seg(st[k], m, { stroke: COL[k], 'stroke-width': 1, 'stroke-dasharray': '4 4', opacity: .55 });
      B.dot(m, 6, { fill: '#0a0d14', stroke: COL[k], 'stroke-width': 2.5 });
      B.text(V(m.x, m.y + 18), k + '′', { fill: COL[k], 'font-size': 11, 'font-weight': 700 });
    }
    B.dot(st.S, 4, { fill: '#0a0d14', stroke: '#fff', 'stroke-width': 2 });
    if (!ok) { chip1('—'); chip2('—'); chip3('某条投射线与 l₂ 平行：该点像在无穷远', 'warn'); return; }
    const cr1 = crOn(st.A, st.B, st.C, st.D),
          cr2 = crOn(img.A, img.B, img.C, img.D);
    chip1(fmt(cr1, 4)); chip2(fmt(cr2, 4));
    const eq = Math.abs(cr1 - cr2) < 1e-9 * Math.max(1, Math.abs(cr1));
    const isHarm = Math.abs(cr1 + 1) < 0.002;
    const text = eq ? (isHarm ? '逐位相等 · 且为 −1：调和点列' : '逐位相等 —— 中心投影保持交叉比') : '（数值异常）';
    chip3(text, eq ? 'ok' : 'warn');
    if (isHarm) B.hint('金色点 D 恰好站在调和位置：拖动 C 到 AB 中点，看 D 趋向何处');
  };
  B.render();
  return B;
}
