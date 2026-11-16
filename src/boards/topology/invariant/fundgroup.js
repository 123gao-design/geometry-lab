/* 图 不2 · 基本群：圆周上的绕数
   圆周上的闭环路，只看它绕了几圈、朝哪边绕。
   绕数 n 相同的两条路，能在圆周上连续变形，互相同伦；
   所以圆周的基本群就是整数加法群，n 就是那个整数。
   滑块把 n 调到 0：路缩成贴着基点的小圈，能直接收成一点。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const C = V(330, 224), R = 130;
  const st = { n: 1 };

  const cP = B.chipM('绕数'), cJ = B.chipM('同伦类');

  const at = (t, r) => V(C.x + r * Math.cos(t), C.y + r * Math.sin(t));

  B.renderFn = () => {
    // 圆周与基点
    mk('circle', { cx: C.x, cy: C.y, r: R, fill: '#5cadff', 'fill-opacity': .06, stroke: '#5cadff', 'stroke-width': 2 }, B.dyn);
    B.dot(V(C.x + R, C.y), 6, { fill: '#ffd166', stroke: '#12161f', 'stroke-width': 1.5 });
    B.tex(V(C.x + R + 10, C.y + 22), '基点', { size: 12, color: '#ffd166', w: 60 });

    const n = st.n;
    if (n === 0) {
      // 贴着基点的小圈，可缩成一点
      const r = 46, cx = C.x + R - r;
      mk('circle', { cx, cy: C.y, r, fill: 'none', stroke: '#4ade80', 'stroke-width': 3 }, B.dyn);
      B.arrow(V(cx + r * .7, C.y - r * .7), V(cx + r * .78, C.y - r * .6), { stroke: '#4ade80', fill: '#4ade80', 'stroke-width': 2, head: 12, wide: 5, line: false });
      B.tex(V(cx, C.y + 20), '可缩', { size: 12, color: '#4ade80', anchor: 'mid', w: 50 });
      B.tex(V(W / 2, H - 90), '绕数 $0$：这条小圈没兜住圆心，可以一直缩到一点', { size: 12.5, color: '#4ade80', w: 560, anchor: 'mid' });
      cP('$0$', 'ok'); cJ('单位元', 'ok');
    } else {
      // 螺旋：绕 |n| 圈，半径一点点外扩，收尾处留一条接缝
      const r0 = .34 * R, r1 = .8 * R;
      const T = Math.abs(n) * Math.PI * 2;
      const dir = n > 0 ? 1 : -1;
      const N = Math.max(60, Math.abs(n) * 90);
      let d = '';
      for (let i = 0; i <= N; i++) {
        const s = i / N, th = dir * T * s, r = r0 + (r1 - r0) * s;
        const p = at(th, r);
        d += (i ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1) + ' ';
      }
      mk('path', { d, fill: 'none', stroke: '#ff9e4a', 'stroke-width': 3, 'stroke-linecap': 'round' }, B.dyn);
      // 接缝：起点到终点
      B.seg(at(0, r0), at(0, r1), { stroke: '#8fa3bd', 'stroke-width': 1.4, 'stroke-dasharray': '5 5' });
      // 方向箭头
      const a1 = dir * T * .06, a2 = dir * T * .1;
      B.arrow(at(a1, r0 + (r1 - r0) * .06), at(a2, r0 + (r1 - r0) * .1), { stroke: '#ff9e4a', fill: '#ff9e4a', 'stroke-width': 2, head: 12, wide: 5, line: false });
      B.tex(V(C.x - 24, C.y + 8), `$n=${n}$`, { size: 18, color: '#ff9e4a', anchor: 'mid', w: 70 });

      B.tex(V(W / 2, H - 90), n > 0 ? '逆时针绕了 ' + n + ' 圈，起点与终点只差一条接缝' : '顺时针绕了 ' + (-n) + ' 圈，绕数取负', { size: 12.5, color: '#8fa3bd', w: 560, anchor: 'mid' });
      cP(`$${n}$`, 'ok'); cJ(`$\\pi_1(S^1)$ 中的 $${n}$`, 'ok');
    }
  };

  B.slider('绕数 n', -3, 3, 1, st.n, v => { st.n = v; B.render(); });
  B.hintM('把 $n$ 一层层加：每加一圈就多绕一圈，接缝始终留着；归零时路缩回基点');
  B.render();
  return B;
}
