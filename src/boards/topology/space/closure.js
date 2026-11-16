/* 图 拓3 · 内部、边界与闭包
   A = 开圆盘 ∪ 一枚孤立点 Q。P 可拖，判读跟着换：
   圆盘里是内点，圆周上是边界点，圆外是外点；
   单独的 Q 也落在边界上——任何小球都同时碰到 A 与它的补集。
   开关切换「只看内部」与「加上闭包」，闭包 = A ∪ ∂A。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const C = V(310, 222), R = 118;
  const Q = V(628, 112);
  const st = { p: V(230, 250), show: 'both' };

  const cD = B.chipM('到 $A$ 的距离'), cJ = B.chipM('判读'), cS = B.chipM('集合');

  function distToA(p) {
    const d = Math.hypot(p.x - C.x, p.y - C.y);
    const toDisk = Math.max(0, d - R);
    const toQ = Math.hypot(p.x - Q.x, p.y - Q.y);
    return Math.min(toDisk, toQ);
  }
  function kindOf(p) {
    const d = Math.hypot(p.x - C.x, p.y - C.y);
    const toQ = Math.hypot(p.x - Q.x, p.y - Q.y);
    if (d < R - 1.5) return 'int';
    if (Math.abs(d - R) <= 5) return 'bdy';
    if (toQ <= 10) return 'bdy';   // 孤立点也在边界上
    return 'out';
  }

  B.renderFn = () => {
    // 淡网格
    for (let x = 30; x < W; x += 46) B.seg(V(x, 26), V(x, H - 64), { stroke: '#2b3b53', 'stroke-width': .7, 'stroke-opacity': .35 });

    const withClosure = st.show !== 'int';
    const withInt = st.show !== 'clo';

    // 闭包：整个闭圆盘
    if (withClosure) {
      mk('circle', { cx: C.x, cy: C.y, r: R, fill: '#4ade80', 'fill-opacity': .05, stroke: '#4ade80', 'stroke-width': 2.6, 'stroke-opacity': .55 }, B.dyn);
      B.tex(V(C.x - R * .72, C.y + R * .78), '闭包', { size: 12, color: '#4ade80', w: 50 });
    }
    // 内部：开圆盘
    if (withInt) {
      mk('circle', { cx: C.x, cy: C.y, r: R, fill: '#5cadff', 'fill-opacity': .12, stroke: '#5cadff', 'stroke-width': 1.8 }, B.dyn);
    }
    mk('circle', { cx: C.x, cy: C.y, r: R, fill: 'none', stroke: withClosure ? '#8fa3bd' : '#5cadff', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' }, B.dyn);
    B.tex(V(C.x, C.y - R - 16), withInt ? '$A$ 的开圆盘' : '$A$ 的闭圆盘', { size: 13, color: withInt ? '#5cadff' : '#4ade80', anchor: 'mid', w: 200 });

    // 孤立点 Q
    B.dot(Q, 6, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.6 });
    B.tex(V(Q.x + 14, Q.y - 12), '$Q$（孤立点）', { size: 12.5, color: '#ff9e4a', w: 120 });

    // P 与它的球
    const k = kindOf(st.p);
    const col = k === 'int' ? '#67e8f9' : k === 'bdy' ? '#ff7b8a' : '#8fa3bd';
    const rr = 26;
    mk('circle', { cx: st.p.x, cy: st.p.y, r: rr, fill: col, 'fill-opacity': .12, stroke: col, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, B.dyn);
    B.dot(st.p, 5.5, { fill: col, stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.tex(V(st.p.x + 12, st.p.y + 20), '$P$', { size: 13, color: col, w: 26 });

    const label = k === 'int' ? '$P$ 是内点' : k === 'bdy' ? '$P$ 是边界点' : '$P$ 是外点';
    B.tex(V(W / 2, H - 96), label + '：任何球同时碰到 $A$ 与 $A$ 的补集，就落在边界上', { size: 12.5, color: col, w: 620, anchor: 'mid' });

    cD(`$${fmt(distToA(st.p), 1)}$`, distToA(st.p) < .5 ? 'ok' : '');
    cJ(label, k === 'int' ? 'ok' : k === 'bdy' ? 'warn' : '');
    cS(st.show === 'int' ? '只看内部' : st.show === 'clo' ? '只看闭包' : '内部与闭包', '');
  };

  B.handle({
    get: () => st.p,
    set: q => { st.p = q; },
    color: '#ffd166', r: 7, label: 'P',
    clamp: q => V(Math.max(30, Math.min(W - 30, q.x)), Math.max(30, Math.min(H - 96, q.y))),
  });
  B.toggleBtn('显示闭包', true, v => { st.show = v ? (st.show === 'int' ? 'both' : 'both') : 'int'; B.render(); });
  B.toggleBtn('显示内部', true, v => { st.show = v ? 'both' : 'clo'; B.render(); });
  B.hintM('把 $P$ 拖过圆周：判定从内点跳到边界点再到外点。再拖到 $Q$ 上——孤立点属于 $A$，却仍算边界点');
  B.render();
  return B;
}
