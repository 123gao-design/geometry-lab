/* 图 拓1 · 开集与开球机
   平面上给一块圆盘 A = {|CP| < R}，P 可拖、球的半径 r 可调。
   「开集」的判据就一条：A 里每一点都能塞进一颗完全落在 A 内的球。
   画板上另标一枚边界点 Q：它属于 A 的边界，任何小球都会跨出去，
   所以边界点不在 A 里，A 也就不是闭集。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const C = V(400, 218), R = 152;
  const st = { p: V(330, 252), r: 58 };

  const cD = B.chipM('$|CP|$'), cR = B.chipM('球半径 $r$'), cJ = B.chipM('判读');

  const insideBall = () => Math.hypot(st.p.x - C.x, st.p.y - C.y) + st.r <= R + 1e-9;

  B.renderFn = () => {
    // 淡网格：给平面一点尺度感
    for (let x = 30; x < W; x += 42) B.seg(V(x, 26), V(x, H - 58), { stroke: '#2b3b53', 'stroke-width': .7, 'stroke-opacity': .4 });
    for (let y = 26; y < H - 58; y += 42) B.seg(V(30, y), V(W - 30, y), { stroke: '#2b3b53', 'stroke-width': .7, 'stroke-opacity': .4 });

    // A 的色块与边界
    mk('circle', { cx: C.x, cy: C.y, r: R, fill: '#5cadff', 'fill-opacity': .1, stroke: '#5cadff', 'stroke-width': 1.8 }, B.dyn);
    B.tex(V(C.x, C.y - R - 18), '$A$', { size: 16, color: '#5cadff', w: 40, anchor: 'mid' });
    B.tex(V(C.x + R * Math.cos(-0.6) + 26, C.y + R * Math.sin(-0.6) - 12), '边界', { size: 12, color: '#8fa3bd', w: 40 });

    // P 处的球
    const ok = insideBall();
    const col = ok ? '#ffd166' : '#ff7b8a';
    mk('circle', { cx: st.p.x, cy: st.p.y, r: st.r, fill: col, 'fill-opacity': .13, stroke: col, 'stroke-width': 1.9 }, B.dyn);
    B.tex(V(st.p.x, st.p.y), '$P$', { size: 13, color: col, w: 26, anchor: 'mid' });

    // 边界点 Q：任何球都跨出去
    const ang = 0.55;
    const Q = V(C.x + R * Math.cos(ang), C.y + R * Math.sin(ang));
    const qr = 30;
    mk('circle', { cx: Q.x, cy: Q.y, r: qr, fill: 'none', stroke: '#ff7b8a', 'stroke-width': 1.4, 'stroke-dasharray': '5 5' }, B.dyn);
    B.dot(Q, 5, { fill: '#ff7b8a', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(Q.x + 34, Q.y + 24), '边界点：任何球都跨出 $A$', { size: 12, color: '#ff7b8a', w: 220 });

    // 判读
    const d = Math.hypot(st.p.x - C.x, st.p.y - C.y);
    B.tex(V(W / 2, H - 92), ok ? '$B(P,r)\\subset A$，$P$ 是 $A$ 的内点' : '$B(P,r)\\not\\subset A$，球越出 $A$', { size: 13, color: ok ? '#4ade80' : '#ff7b8a', w: 420, anchor: 'mid' });

    cD(`$${fmt(d, 1)}$`, d + st.r <= R + 1e-9 ? 'ok' : 'warn');
    cR(`$${fmt(st.r, 0)}$`, '');
    cJ(ok ? '$P$ 能塞进整颗球' : '$P$ 的球已出界', ok ? 'ok' : 'warn');
  };

  B.handle({
    get: () => st.p,
    set: q => { st.p = q; },
    color: '#ffd166', r: 7, label: 'P',
    clamp: q => V(Math.max(36, Math.min(W - 36, q.x)), Math.max(36, Math.min(H - 90, q.y))),
  });
  B.slider('球半径 r', 12, 118, 1, st.r, v => { st.r = v; B.render(); });
  B.hintM('把 $P$ 拖到圆周附近：只要 $P$ 在内部，球小一点就整颗落在 $A$ 里；拖到边界上，再小的球也会跨出去');
  B.render();
  return B;
}
