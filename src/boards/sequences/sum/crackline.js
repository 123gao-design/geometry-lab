/* 图 和1b · 裂项相消机
   a_k=1/(k(k+1))=1/k−1/(k+1)。把 1, 1/2, 1/3, … 依次标在数轴上，相邻两个刻度之间那一段的长度
   恰好是 a_k。这些段首尾相接从 1 排到 1/(n+1)，总和就是 1−1/(n+1)。
   局部坐标：数轴 x∈[70,800]，基线 y=230。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 400;
  const B = new Board(root, W, H);
  const st = { n: 4 };
  const PRE = [{ nm: '① n=3', n: 3 }, { nm: '② n=6', n: 6 }];
  const cA = B.chipM('通项'), cC = B.chipM('相消'), cS = B.chipM('前 n 项和');

  B.renderFn = () => {
    const n = st.n;
    const X0 = 70, XW = 730, y = 230, BH = 46;
    const px = u => X0 + XW * u;
    B.seg(V(X0, y), V(X0 + XW, y), { stroke: '#2b4260', 'stroke-width': 1.4 });
    // 剩余段 [0, 1/(n+1)]
    const left = 1 / (n + 1);
    mk('rect', { x: px(0), y: y - BH, width: Math.max(px(left) - px(0), 2), height: BH,
      fill: '#ff7b8a', 'fill-opacity': .14, stroke: '#ff7b8a', 'stroke-width': 1.1, 'stroke-dasharray': '5 4' }, B.dyn);
    if (px(left) - px(0) > 46)
      B.tex(V(px(left / 2), y - BH - 14), `$\\dfrac{1}{${n + 1}}$`, { size: 11, anchor: 'mid', color: '#ff7b8a', w: 70 });
    // 各段
    for (let k = 1; k <= n; k++) {
      const u0 = 1 / (k + 1), u1 = 1 / k, x = px(u0), w = px(u1) - x;
      const col = k % 2 ? '#5cadff' : '#ff9e4a';
      mk('rect', { x, y: y - BH, width: Math.max(w, 1.5), height: BH, fill: col, 'fill-opacity': .3,
        stroke: col, 'stroke-width': 1.1 }, B.dyn);
      if (w > 30) B.tex(V(x + w / 2, y - BH - 14), `$\\dfrac{1}{${k * (k + 1)}}$`, { size: 10.5, anchor: 'mid', color: col, w: 70 });
    }
    // 刻度与标签
    for (let k = 1; k <= n + 1; k++) {
      const u = 1 / k, x = px(u);
      B.seg(V(x, y - 6), V(x, y + 8), { stroke: '#93a1b5', 'stroke-width': 1.2 });
      B.tex(V(x, y + 26), `$\\dfrac{1}{${k}}$`, { size: 11, anchor: 'mid', color: '#93a1b5', w: 60 });
    }
    B.text(V(px(0) - 6, y + 26), '0', { 'font-size': 11.5, fill: '#93a1b5' });
    B.text(V(px(1) + 8, y + 26), '1', { 'font-size': 11.5, fill: '#93a1b5' });
    // 结论
    B.tex(V(X0, 322), `$S_{${n}}=1-\\dfrac{1}{${n + 1}}=${fmt(1 - 1 / (n + 1), 4)}$`,
      { size: 14, anchor: 'start', color: '#ffd166', w: 420 });
    B.text(V(X0 + 430, 322), '红色一段始终是 1/(n+1)，其余全部抵掉', { 'font-size': 12, fill: '#93a1b5' });
    // 标题
    B.tex(V(60, 30), '每一项都是两个相邻分数之差：$\\dfrac{1}{k(k+1)}=\\dfrac{1}{k}-\\dfrac{1}{k+1}$', { size: 14, anchor: 'start', w: 760 });
    // 徽章
    cA('$\\dfrac{1}{k(k+1)}=\\dfrac{1}{k}-\\dfrac{1}{k+1}$');
    cC(`$\\dfrac{1}{1}-\\dfrac{1}{${n + 1}}$`);
    cS(`$S_{${n}}=1-\\dfrac{1}{${n + 1}}=${fmt(1 - 1 / (n + 1), 3)}$`);
  };

  B.slider('n =', 1, 6, 1, 4, v => { st.n = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.n = p.n;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('相邻两项的尾巴与前一项的尾巴拼成一段，首尾相消只剩 1 与 1/(n+1)');
  B.render();
  return B;
}
