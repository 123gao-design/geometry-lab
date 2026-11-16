/* 图 连4 · 商空间：把正方形的边粘起来
   左边一张正方形，箭头标出哪两条边粘、朝哪个方向粘；
   右边把粘完的结果画成示意。
   两对边同向粘 → 环面；一对同向、一对反向 → 克莱因瓶；
   只粘一对且反向 → 莫比乌斯带。
   同一张正方形，换箭头方向就换出一个新曲面。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { mode: 'torus' };

  const cM = B.chipM('粘法'), cO = B.chipM('定向'), cE = B.chipM('三维');

  const A = V(92, 104), Bp = V(332, 104), C = V(332, 344), D = V(92, 344);

  function edge(p, q, col, lab, labAt) {
    B.arrow(p, q, { stroke: col, fill: col, 'stroke-width': 2, head: 11, wide: 5 });
    B.tex(V(labAt[0], labAt[1]), lab, { size: 14, color: col, anchor: 'mid', w: 30 });
  }

  function drawSquare() {
    B.seg(A, Bp, { stroke: '#5c6a80', 'stroke-width': 1.6 });
    B.seg(Bp, C, { stroke: '#5c6a80', 'stroke-width': 1.6 });
    B.seg(C, D, { stroke: '#5c6a80', 'stroke-width': 1.6 });
    B.seg(D, A, { stroke: '#5c6a80', 'stroke-width': 1.6 });

    if (st.mode === 'torus') {
      edge(V(112, 104), V(312, 104), '#5cadff', '$a$', [212, 88]);
      edge(V(112, 344), V(312, 344), '#5cadff', '$a$', [212, 372]);
      edge(V(92, 324), V(92, 124), '#ff9e4a', '$b$', [70, 224]);
      edge(V(332, 324), V(332, 124), '#ff9e4a', '$b$', [356, 224]);
    } else if (st.mode === 'klein') {
      edge(V(112, 104), V(312, 104), '#5cadff', '$a$', [212, 88]);
      edge(V(112, 344), V(312, 344), '#5cadff', '$a$', [212, 372]);
      edge(V(92, 324), V(92, 124), '#ff9e4a', '$b$', [70, 224]);
      edge(V(332, 124), V(332, 324), '#ff7b8a', '$b^{-1}$', [378, 224]);
    } else {
      edge(V(112, 104), V(312, 104), '#5cadff', '$a$', [212, 88]);
      edge(V(312, 344), V(112, 344), '#ff7b8a', '$a^{-1}$', [212, 372]);
      B.seg(V(92, 124), V(92, 324), { stroke: '#5c6a80', 'stroke-width': 1.4, 'stroke-dasharray': '5 5' });
      B.seg(V(332, 124), V(332, 324), { stroke: '#5c6a80', 'stroke-width': 1.4, 'stroke-dasharray': '5 5' });
      B.tex(V(66, 224), '不粘', { size: 11, color: '#5c6a80', anchor: 'mid', w: 40 });
      B.tex(V(360, 224), '不粘', { size: 11, color: '#5c6a80', anchor: 'mid', w: 40 });
    }
    B.tex(V(212, 224), '一张正方形', { size: 12.5, color: '#8fa3bd', anchor: 'mid', w: 120 });
  }

  function drawTorus(cx, cy) {
    mk('ellipse', { cx, cy, rx: 112, ry: 64, fill: '#5cadff', 'fill-opacity': .1, stroke: '#5cadff', 'stroke-width': 2 }, B.dyn);
    mk('ellipse', { cx, cy, rx: 44, ry: 24, fill: '#0a0d14', stroke: '#5cadff', 'stroke-width': 1.6 }, B.dyn);
    B.tex(V(cx, cy + 96), '环面', { size: 13, color: '#5cadff', anchor: 'mid', w: 60 });
  }
  function drawKlein(cx, cy) {
    mk('ellipse', { cx, cy: cy + 34, rx: 96, ry: 60, fill: '#ff7b8a', 'fill-opacity': .1, stroke: '#ff7b8a', 'stroke-width': 2 }, B.dyn);
    mk('circle', { cx: cx - 34, cy: cy - 66, r: 27, fill: 'none', stroke: '#ff7b8a', 'stroke-width': 2 }, B.dyn);
    mk('path', {
      d: `M ${cx - 52} ${cy - 44} C ${cx - 108} ${cy - 8} ${cx - 104} ${cy + 34} ${cx - 52} ${cy + 46}`,
      fill: 'none', stroke: '#ff7b8a', 'stroke-width': 2,
    }, B.dyn);
    B.tex(V(cx + 8, cy + 20), '颈穿过瓶身', { size: 11, color: '#ff7b8a', w: 110 });
    B.tex(V(cx, cy + 108), '克莱因瓶', { size: 13, color: '#ff7b8a', anchor: 'mid', w: 90 });
  }
  function drawMob(cx, cy) {
    mk('polygon', {
      points: `${cx - 96},${cy - 26} ${cx - 46},${cy - 70} ${cx + 72},${cy - 44} ${cx + 104},${cy + 6} ${cx + 52},${cy + 52} ${cx - 60},${cy + 24}`,
      fill: '#4ade80', 'fill-opacity': .1, stroke: '#4ade80', 'stroke-width': 2,
    }, B.dyn);
    mk('path', {
      d: `M ${cx - 96} ${cy - 26} C ${cx - 40} ${cy + 6} ${cx + 44} ${cy + 2} ${cx + 104} ${cy + 6}`,
      fill: 'none', stroke: '#4ade80', 'stroke-width': 1.6, 'stroke-dasharray': '5 5',
    }, B.dyn);
    B.tex(V(cx, cy + 96), '莫比乌斯带（半圈扭转）', { size: 12.5, color: '#4ade80', anchor: 'mid', w: 220 });
  }

  B.renderFn = () => {
    drawSquare();
    if (st.mode === 'torus') {
      drawTorus(596, 224);
      B.tex(V(W / 2, H - 84), '两对边各自同向粘合：两个方向都成了圈，闭合成环面，没有边界', { size: 12.5, color: '#8fa3bd', w: 620, anchor: 'mid' });
      cM('两对同向', 'ok'); cO('可定向', 'ok'); cE('能放进三维', 'ok');
    } else if (st.mode === 'klein') {
      drawKlein(596, 214);
      B.tex(V(W / 2, H - 84), '一对同向、一对反向：局部看还是平面，整体只有一个面，没有里外', { size: 12.5, color: '#8fa3bd', w: 620, anchor: 'mid' });
      cM('一对反向', 'warn'); cO('不可定向', 'warn'); cE('必自交', 'warn');
    } else {
      drawMob(596, 210);
      B.tex(V(W / 2, H - 84), '只粘一对、还反着粘：接口处转了半圈，走过一圈就翻到背面', { size: 12.5, color: '#8fa3bd', w: 620, anchor: 'mid' });
      cM('一对反向', 'warn'); cO('不可定向', 'warn'); cE('能放进三维', 'ok');
    }
  };

  B.btn('环面', () => { st.mode = 'torus'; B.render(); }, { pri: true });
  B.btn('克莱因瓶', () => { st.mode = 'klein'; B.render(); });
  B.btn('莫比乌斯带', () => { st.mode = 'mob'; B.render(); });
  B.hintM('盯着 $a$、$b$ 的箭头：同向粘还是反向粘，只差分毫，曲面却换了里外');
  B.render();
  return B;
}
