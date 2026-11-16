import { Board, V, mk } from '../../../lib/board.js';

/* 谢尔宾斯基三角与地毯：每一步把每个保留块按固定的挖法再挖一次。
   三角挖中间倒三角（留 3 个，边长减半）；地毯挖中心方格（留 8 个，边长三等分）。
   红色是当前层挖掉的部分，最终保留块涂蓝。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { carpet: false, n: 2 };
  const cC = B.chipM('保留块数');
  const cA = B.chipM('面积占比');
  const cD = B.chipM('维数');

  function tri(a, b, c, lv) {
    if (lv === 0) {
      mk('polygon', { points: `${a.x},${a.y} ${b.x},${b.y} ${c.x},${c.y}`, fill: 'rgba(92,173,255,.34)', stroke: '#5cadff', 'stroke-width': .7 }, B.dyn);
      return;
    }
    const ab = V((a.x + b.x) / 2, (a.y + b.y) / 2), bc = V((b.x + c.x) / 2, (b.y + c.y) / 2), ca = V((c.x + a.x) / 2, (c.y + a.y) / 2);
    mk('polygon', { points: `${ab.x},${ab.y} ${bc.x},${bc.y} ${ca.x},${ca.y}`, fill: 'rgba(255,123,138,.18)', stroke: 'none' }, B.dyn);
    tri(a, ab, ca, lv - 1); tri(ab, b, bc, lv - 1); tri(ca, bc, c, lv - 1);
  }
  function sq(x, y, s, lv) {
    if (lv === 0) {
      mk('rect', { x, y, width: s, height: s, fill: 'rgba(92,173,255,.32)', stroke: '#5cadff', 'stroke-width': .5 }, B.dyn);
      return;
    }
    const d = s / 3;
    mk('rect', { x: x + d, y: y + d, width: d, height: d, fill: 'rgba(255,123,138,.2)', stroke: 'none' }, B.dyn);
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (i !== 1 || j !== 1) sq(x + j * d, y + i * d, d, lv - 1);
  }

  B.renderFn = () => {
    const n = st.n;
    if (!st.carpet) {
      const S = 330, x0 = 245, y0 = 72;
      const A = V(x0, y0 + S), Bv = V(x0 + S, y0 + S), C = V(x0 + S / 2, y0 + S - S * Math.sqrt(3) / 2);
      tri(A, Bv, C, n);
      B.textM(V(410, 410), `第 ${n} 层：${Math.pow(3, n)} 个正三角，面积剩 $(3/4)^{${n}}$，周长为 $(3/2)^{${n}}$ 倍`, { 'font-size': 12, fill: '#8fa3bd' });
    } else {
      const S = 330, x0 = 245, y0 = 64;
      sq(x0, y0, S, n);
      B.textM(V(410, 410), `第 ${n} 层：${Math.pow(8, n)} 个小正方块，面积剩 $(8/9)^{${n}}$`, { 'font-size': 12, fill: '#8fa3bd' });
    }
    B.tex(V(410, 30), st.carpet ? '地毯：每个方块挖掉中心九分之一' : '三角：每个三角挖掉中心倒三角', { size: 16, anchor: 'mid', w: 500 });
    B.text(V(410, 428), '面积趋于 0，边界却越挖越长', { 'font-size': 12, fill: '#5c6a80' });
    cC(`${Math.pow(st.carpet ? 8 : 3, n)}`);
    cA(`$${Math.pow(st.carpet ? 8 / 9 : 3 / 4, n).toFixed(3)}$`);
    cD(st.carpet ? '$1.893$' : '$1.585$');
  };

  B.toggleBtn('画地毯', false, on => { st.carpet = on; B.render(); });
  B.slider('层数 n', 0, 4, 1, st.n, v => { st.n = v; B.render(); });
  B.hintM('保留块数每层乘 3 或 8 —— 个数增长快过面积收缩，维数落在 1 与 2 之间');
  B.render();
  return B;
}
