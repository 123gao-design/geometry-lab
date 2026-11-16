/* 图 连1 · 连通与分割
   两块圆盘拼成空间 X。没有走廊时，左盘 U 与右盘 V 各自在 X 里开、
   互不相交，X = U ∪ V 就是一份分割——这时 X 不连通。
   合上走廊，任何一块开集都拆不开 X，连通。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { gap: 120, bridge: false };
  const y0 = 238, r = 68;

  const cG = B.chipM('间距'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const L = V(268, y0), R = V(268 + 2 * r + st.gap, y0);

    if (st.bridge) {
      mk('rect', { x: L.x, y: y0 - 17, width: R.x - L.x, height: 34, fill: '#ffd166', 'fill-opacity': .16, stroke: '#ffd166', 'stroke-width': 1.6 }, B.dyn);
      B.tex(V((L.x + R.x) / 2, y0 + 4), '走廊', { size: 12, color: '#ffd166', anchor: 'mid', w: 60 });
    }

    mk('circle', { cx: L.x, cy: L.y, r, fill: st.bridge ? '#ffd166' : '#5cadff', 'fill-opacity': .14, stroke: st.bridge ? '#ffd166' : '#5cadff', 'stroke-width': 1.8 }, B.dyn);
    mk('circle', { cx: R.x, cy: R.y, r, fill: st.bridge ? '#ffd166' : '#ff9e4a', 'fill-opacity': .13, stroke: st.bridge ? '#ffd166' : '#ff9e4a', 'stroke-width': 1.8 }, B.dyn);
    B.tex(V(L.x, L.y + 5), st.bridge ? '$X$' : '$U$', { size: 15, color: st.bridge ? '#ffd166' : '#5cadff', anchor: 'mid', w: 40 });
    B.tex(V(R.x, R.y + 5), st.bridge ? '$X$' : '$V$', { size: 15, color: st.bridge ? '#ffd166' : '#ff9e4a', anchor: 'mid', w: 40 });

    B.tex(V(W / 2, H - 96), st.bridge ? '$X$ 拆不成两块不交的开集' : '$X=U\\cup V$，$U$、$V$ 都开且不交，是一份分割', { size: 13, color: st.bridge ? '#4ade80' : '#ff7b8a', w: 560, anchor: 'mid' });

    cG(`$${fmt(st.gap, 0)}$`, '');
    cJ(st.bridge ? '连通' : '不连通', st.bridge ? 'ok' : 'warn');
  };

  B.slider('两盘间距', 12, 240, 2, st.gap, v => { st.gap = v; B.render(); });
  B.toggleBtn('加一条走廊', false, v => { st.bridge = v; B.render(); });
  B.hintM('先把走廊关掉：两块各自成一块开集，空间被劈成两半；再打开走廊，任何开集都拆不开了');
  B.render();
  return B;
}
