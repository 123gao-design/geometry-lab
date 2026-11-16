/* 图 整1 · 整除与带余除法机
   把 a 个点按每 m 个一组排开：满组染蓝、最后一组不足的余数染橙，
   下一条数轴上把 m 的倍数标出来，直观看到 a 落在哪个间隔里。
   两个滑块：被除数 a（0..60）、除数 m（2..12）。恒有 a = mq + r、0 ≤ r < m。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { a: 47, m: 7 };

  const cQ = B.chipM('商 $q$'), cR = B.chipM('余数 $r$'), cJ = B.chipM('判读');
  const u = 10.4, X0 = 58, GAP = 7;

  B.renderFn = () => {
    const { a, m } = st;
    const q = Math.floor(a / m), r = a - q * m;

    // 顶部：按 m 分组排开的 a 个点
    let x = X0;
    const y = 96, hh = 46;
    for (let g = 0; g < q; g++) {
      B.dyn.appendChild(mk('rect', { x, y, width: m * u, height: hh, rx: 5, fill: '#5cadff', 'fill-opacity': .14, stroke: '#5cadff', 'stroke-width': 1.6 }, B.dyn));
      B.tex(V(x + m * u / 2, y + hh + 18), `$${m}$`, { size: 12, color: '#5cadff', w: 40, anchor: 'mid' });
      x += m * u + GAP;
    }
    if (r > 0) {
      B.dyn.appendChild(mk('rect', { x, y, width: r * u, height: hh, rx: 5, fill: '#ff9e4a', 'fill-opacity': .2, stroke: '#ff9e4a', 'stroke-width': 1.8 }, B.dyn));
      B.tex(V(x + r * u / 2, y + hh + 18), `$${r}$`, { size: 12, color: '#ff9e4a', w: 40, anchor: 'mid' });
    }
    if (a === 0) B.tex(V(X0 + 8, y + hh / 2), '空', { size: 13, color: '#93a1b5', w: 30 });

    // 算式
    B.tex(V(W / 2, 196), `$${a}=${m}\\times ${q}+${r}$`, { size: 20, color: '#ffd166', w: 300, anchor: 'mid' });

    // 数轴
    const NY = 300, s = 10.4, AX0 = 58;
    B.seg(V(AX0 - 14, NY), V(AX0 + 60 * s + 16, NY), { stroke: '#93a1b5', 'stroke-width': 1.4 });
    if (q > 0) B.seg(V(AX0, NY), V(AX0 + q * m * s, NY), { stroke: '#5cadff', 'stroke-width': 4, 'stroke-opacity': .5 });
    if (r > 0) B.seg(V(AX0 + q * m * s, NY), V(AX0 + a * s, NY), { stroke: '#ff9e4a', 'stroke-width': 5, 'stroke-opacity': .85 });

    const stepLab = Math.max(1, Math.ceil(m / 2));
    for (let k = 0; k * m <= 60; k++) {
      const px = AX0 + k * m * s;
      B.seg(V(px, NY - 7), V(px, NY + 7), { stroke: '#5cadff', 'stroke-width': 1.6, 'stroke-opacity': .85 });
      if (k % stepLab === 0) B.text(V(px, NY + 24), String(k * m), { size: 11, fill: '#93a1b5', 'text-anchor': 'middle' });
    }
    for (let k = 0; k <= 60; k += 10) {
      const px = AX0 + k * s;
      B.seg(V(px, NY - 4), V(px, NY + 4), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-opacity': .6 });
    }
    B.dot(V(AX0 + a * s, NY), 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.6 });
    B.tex(V(AX0 + a * s, NY - 18), `$a=${a}$`, { size: 13, color: '#ffd166', w: 70, anchor: 'mid' });
    // 余数区间
    if (r > 0) B.tex(V(AX0 + (q * m + a) / 2 * s, NY + 46), `$r=${r}$`, { size: 12, color: '#ff9e4a', w: 50, anchor: 'mid' });

    B.tex(V(W / 2, 392), '蓝段是满组 $m$，橙段是余数 $r$；绿色竖线是 $m$ 的倍数，$a$ 落在哪两线之间，$r$ 就是它到左线的距离', { size: 12.5, color: '#93a1b5', w: 700, anchor: 'mid' });

    cQ(`$q=${q}$`, '');
    cR(`$r=${r}$`, '');
    cJ(r === 0 ? `$r=0$，整除` : `$0\\le r=${r}<${m}$`, r === 0 ? 'ok' : (r < m ? 'ok' : 'warn'));
  };

  B.slider('被除数 a', 0, 60, 1, st.a, s => { st.a = Math.round(s); B.render(); });
  B.slider('除数 m', 2, 12, 1, st.m, s => { st.m = Math.round(s); B.render(); });
  B.hintM('拖动滑块：满组数就是商 $q$，剩下的一截就是余数 $r$，$r$ 永远比 $m$ 小');
  B.render();
  return B;
}
