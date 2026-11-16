import { Board, V, mk } from '../../../lib/board.js';

/* 自相似机：整体由 N 个缩到 r 倍的自身副本拼成。
   线段 → 每段分 k 份，得 N=k 个 1/k 长的小段；正方形 → 每边分 k 份，得 N=k² 个 1/k 边长的小方块。
   层数 n 逐层替换，颜色按顶层副本编号分配，一眼看出「每个小副本都是整体的缩印」。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { sq: true, k: 3, n: 2 };
  const cK = B.chipM('每边份数 $k$');
  const cN = B.chipM('副本数 $N$');
  const cD = B.chipM('维数 $D$');
  const COL = ['#5cadff', '#67e8f9', '#4ade80', '#ffd166', '#c084fc'];

  function square(x, y, s, lv, ci) {
    if (lv === 0) {
      mk('rect', { x, y, width: s, height: s, rx: 1,
        fill: ci === 0 ? 'rgba(255,158,74,.26)' : 'rgba(92,173,255,.14)',
        stroke: COL[ci % COL.length], 'stroke-width': 1.1 }, B.dyn);
      return;
    }
    const d = s / st.k;
    for (let i = 0; i < st.k; i++) {
      for (let j = 0; j < st.k; j++) {
        square(x + j * d, y + i * d, d, lv - 1, lv === st.n ? i * st.k + j : ci);
      }
    }
  }

  function segLine(a, b, lv) {
    if (lv === 0) {
      B.seg(V(a, 235), V(b, 235), { stroke: '#5cadff', 'stroke-width': 4, 'stroke-linecap': 'round' });
      return;
    }
    const d = (b - a) / st.k;
    for (let i = 0; i < st.k; i++) segLine(a + i * d, a + (i + 1) * d, lv - 1);
  }

  B.renderFn = () => {
    const k = st.k, n = st.n;
    const N = st.sq ? k * k : k;
    const D = st.sq ? 2 : 1;
    B.tex(V(410, 34), st.sq
      ? '整体 = $N$ 个边长缩到 $r=\\frac1k$ 的自身'
      : '整体 = $N$ 个长度缩到 $r=\\frac1k$ 的自身', { size: 16, anchor: 'mid', w: 600 });
    if (st.sq) {
      const S = 320, x0 = 250, y0 = 84;
      mk('rect', { x: x0 - 9, y: y0 - 9, width: S + 18, height: S + 18, rx: 4,
        fill: 'none', stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '6 5' }, B.dyn);
      square(x0, y0, S, n, 0);
      B.text(V(x0 - 16, y0 + S + 26), `大正方形边长 1，小方块边长 1/${k}，一共 ${N} 个`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.text(V(410, 428), n === 0 ? '第 0 层：整体本身' : `第 ${n} 层：${N} 个副本，每个都是整体的缩印`,
        { 'font-size': 12, fill: '#5c6a80' });
    } else {
      B.seg(V(100, 235), V(720, 235), { stroke: '#3f5f8f', 'stroke-width': 1, 'stroke-dasharray': '4 6' });
      segLine(100, 720, n);
      B.text(V(410, 300), `单位线段均分 ${k} 份，每份长 1/${k}，共 ${N} 份`, { 'font-size': 12, fill: '#8fa3bd' });
      B.text(V(410, 428), n === 0 ? '第 0 层：整体本身' : `第 ${n} 层：${N} 条小段，每条都是整体的缩印`,
        { 'font-size': 12, fill: '#5c6a80' });
    }
    cK(`${k}`);
    cN(`${N}`);
    cD(`$${D}$`);
  };

  B.toggleBtn('画正方形', true, on => { st.sq = on; B.render(); });
  B.slider('每边份数 k', 2, 4, 1, st.k, v => { st.k = v; B.render(); });
  const nS = B.slider('层数 n', 0, 3, 1, st.n, v => { st.n = v; B.render(); });
  B.hintM('整体与每个副本形状相同、只差一个缩放 —— 这就是自相似');
  B.render();
  return B;
}
