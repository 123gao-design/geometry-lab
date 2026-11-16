import { Board, V, mk, fmt } from '../../../lib/board.js';

/* 朱利亚集与曼德博集：同一套迭代 z↦z²+c 的两种切片。
   朱利亚图固定 c、让起点 z 跑遍画框；曼德博图固定起点 0、让参数 c 跑遍画框。
   按逃逸所需步数上色，深色是留在有界区域里的点。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { mandel: false, re: -0.4, im: 0.6 };
  const cC = B.chipM('参数 $c$');
  const cK = B.chipM('迭代上限');
  const cJ = B.chipM('连通性');
  const MAX = 40;

  function escape(cr, ci, zr0, zi0, max) {
    let zr = zr0, zi = zi0;
    for (let n = 0; n < max; n++) {
      const r2 = zr * zr - zi * zi + cr, i2 = 2 * zr * zi + ci;
      zr = r2; zi = i2;
      if (zr * zr + zi * zi > 4) return n + 1;
    }
    return -1;
  }
  function inM(cr, ci) {
    let zr = 0, zi = 0;
    for (let n = 0; n < 120; n++) {
      const r2 = zr * zr - zi * zi + cr, i2 = 2 * zr * zi + ci;
      zr = r2; zi = i2;
      if (zr * zr + zi * zi > 4) return false;
    }
    return true;
  }
  const PAL = ['#5cadff', '#67e8f9', '#4ade80', '#ffd166', '#ff9e4a'];

  B.renderFn = () => {
    const cr = st.re, ci = st.im;
    const x0 = 170, y0 = 48, GW = 480, GH = 360, COLS = 96, ROWS = 72;
    const re0 = st.mandel ? -2.1 : -1.7, re1 = st.mandel ? .7 : 1.7;
    const im0 = -1.3, im1 = 1.3;
    B.tex(V(410, 26), st.mandel ? '曼德博集：起点固定 $z_0=0$，参数 $c$ 跑遍画框'
      : '朱利亚集：参数固定，起点 $z_0$ 跑遍画框', { size: 16, anchor: 'mid', w: 600 });
    const cw = GW / COLS, chh = GH / ROWS;
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const x = re0 + (i + .5) / COLS * (re1 - re0);
        const y = im1 - (j + .5) / ROWS * (im1 - im0);
        const n = st.mandel ? escape(x, y, 0, 0, MAX) : escape(cr, ci, x, y, MAX);
        const fill = n < 0 ? '#1f2a3a' : PAL[Math.min(4, Math.floor(Math.log2(n + 1)))];
        mk('rect', { x: x0 + i * cw, y: y0 + j * chh, width: cw + .4, height: chh + .4, fill }, B.dyn);
      }
    }
    mk('rect', { x: x0, y: y0, width: GW, height: GH, fill: 'none', stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn);
    if (st.mandel) {
      const cx = x0 + (cr - re0) / (re1 - re0) * GW, cy = y0 + (im1 - ci) / (im1 - im0) * GH;
      B.seg(V(cx - 10, cy), V(cx + 10, cy), { stroke: '#ff7b8a', 'stroke-width': 1.6 });
      B.seg(V(cx, cy - 10), V(cx, cy + 10), { stroke: '#ff7b8a', 'stroke-width': 1.6 });
      B.text(V(cx + 14, cy - 8), 'c', { 'font-size': 13, fill: '#ff7b8a', 'text-anchor': 'start' });
    }
    B.textM(V(410, 404), st.mandel ? '红叉是当前滑块给出的 $c$；它落在集内，朱利亚集就连成一片'
      : '当前 $c$ 决定整幅图；深色区域是有界轨道，彩色是逃逸点', { 'font-size': 12, fill: '#8fa3bd' });
    cC(`$${fmt(cr, 2)}${ci >= 0 ? '+' : '-'}${fmt(Math.abs(ci), 2)}i$`);
    cK(`${MAX}`);
    cJ(st.mandel ? '—' : (inM(cr, ci) ? '连通' : '尘埃状'), st.mandel ? '' : (inM(cr, ci) ? 'ok' : 'warn'));
  };

  B.toggleBtn('曼德博视角', false, on => { st.mandel = on; B.render(); });
  B.slider('c 实部', -1.5, .5, .01, st.re, v => { st.re = v; B.render(); });
  B.slider('c 虚部', -1, 1, .01, st.im, v => { st.im = v; B.render(); });
  B.hintM('拖动 $c$：在曼德博集内，朱利亚集连成一片；跑到集外，碎成尘埃');
  B.render();
  return B;
}
