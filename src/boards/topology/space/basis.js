/* 图 拓2 · 基与子空间
   左半：一块 L 形的开集 A，网格点处铺满半径可调的基球。
   整颗落在 A 内的球涂蓝，跨到边界的球只留虚边——
   A 里任一点都落在某颗蓝球里，这就是「基生成拓扑」的可视版。
   再按「子空间」一张：取一条直线 Y，球与 Y 的交是一段区间，
   Y 中的相对开集正由这些交生成。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const POLY = [[250, 66], [566, 66], [566, 200], [430, 200], [430, 362], [250, 362]];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { r: 26, sub: false, y: 250 };

  const cN = B.chipM('基球'), cJ = B.chipM('判读');

  function inPoly(x, y) {
    let ins = false;
    for (let i = 0, j = POLY.length - 1; i < POLY.length; j = i++) {
      const xi = POLY[i][0], yi = POLY[i][1], xj = POLY[j][0], yj = POLY[j][1];
      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ins = !ins;
    }
    return ins;
  }
  // 整颗球都在 A 里：圆周上取 24 个样点逐个查
  function ballIn(cx, cy, r) {
    if (!inPoly(cx, cy)) return false;
    for (let k = 0; k < 24; k++) {
      const a = k * Math.PI / 12;
      if (!inPoly(cx + r * Math.cos(a), cy + r * Math.sin(a))) return false;
    }
    return true;
  }

  B.renderFn = () => {
    if (!st.sub) {
      // A 的轮廓
      mk('polygon', {
        points: POLY.map(p => p.join(',')).join(' '),
        fill: '#5cadff', 'fill-opacity': .09, stroke: '#5cadff', 'stroke-width': 1.8,
      }, B.dyn);
      B.tex(V(272, 88), '$A$', { size: 16, color: '#5cadff', w: 30 });

      // 网格点上的基球
      let full = 0, tot = 0;
      for (let x = 260; x <= 560; x += 44) {
        for (let y = 80; y <= 360; y += 44) {
          tot++;
          const ok = ballIn(x, y, st.r);
          const hit = inPoly(x, y);
          if (!hit) continue;
          if (ok) full++;
          mk('circle', {
            cx: x, cy: y, r: st.r,
            fill: ok ? '#67e8f9' : 'none', 'fill-opacity': .1,
            stroke: ok ? '#67e8f9' : '#8fa3bd',
            'stroke-width': ok ? 1.3 : 1, 'stroke-opacity': ok ? .85 : .45,
            'stroke-dasharray': ok ? '' : '3 4',
          }, B.dyn);
          if (ok) B.dot(V(x, y), 2.4, { fill: '#67e8f9' });
        }
      }
      B.tex(V(W / 2, H - 88), '蓝球整颗落在 $A$ 里，虚球跨出了边界', { size: 12.5, color: '#8fa3bd', w: 460, anchor: 'mid' });
      cN(`$${full}$ / ${tot}`, full > 0 ? 'ok' : 'warn');
      cJ('$A$ 内每点都落进一颗蓝球', 'ok');
    } else {
      // 子空间视角：Y 是一条直线，球与它的交是开区间
      const y0 = st.y;
      B.seg(V(60, y0), V(760, y0), { stroke: '#ffd166', 'stroke-width': 2.2 });
      B.tex(V(766, y0 - 14), '$Y$', { size: 14, color: '#ffd166', w: 30 });
      const cy = y0 - 34;
      let cnt = 0;
      for (let x = 220; x <= 560; x += 120) {
        mk('circle', { cx: x, cy, r: st.r, fill: '#5cadff', 'fill-opacity': .09, stroke: '#5cadff', 'stroke-width': 1.4, 'stroke-dasharray': '4 4' }, B.dyn);
        B.text(V(x, cy), '$U$', { fill: '#5cadff', 'font-size': 12, 'text-anchor': 'middle' });
        if (st.r > 34) {
          const h = Math.sqrt(st.r * st.r - 34 * 34);
          B.seg(V(x - h, y0), V(x + h, y0), { stroke: '#4ade80', 'stroke-width': 6, 'stroke-opacity': .7, 'stroke-linecap': 'round' });
          B.dot(V(x - h, y0), 3.4, { fill: '#4ade80' });
          B.dot(V(x + h, y0), 3.4, { fill: '#4ade80' });
          cnt++;
        }
      }
      B.tex(V(W / 2, H - 88), '绿段是 $U\\cap Y$：它在 $Y$ 里算开集，端点不算', { size: 12.5, color: '#8fa3bd', w: 460, anchor: 'mid' });
      cN(`$U\\cap Y$：${cnt} 段`, cnt ? 'ok' : 'warn');
      cJ('相对开集由交生成', 'ok');
    }
  };

  B.slider('基球半径', 12, 60, 1, st.r, v => { st.r = v; B.render(); });
  B.toggleBtn('子空间视角', false, v => { st.sub = v; B.render(); });
  B.hintM('先把半径调小，看蓝球一颗颗贴回 $A$ 的内部；再切到子空间视角，球与 $Y$ 的交就是 $Y$ 里的开集');
  B.render();
  return B;
}
