/* 图 比3b · 线段填充机（0<q<1 的面积证明）
   把一条长为 L=a_1/(1−q) 的线段依次截下 a_1, a_1q, a_1q², …：第 k 段是第 k−1 段的 q 倍。
   截完 n 段后余下的空档恰为 L·qⁿ，所以 S_n=L−Lqⁿ=a_1(1−qⁿ)/(1−q)。
   局部坐标：线段 x∈[80,800]，基线 y=240。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 430;
  const B = new Board(root, W, H);
  const st = { a1: 4, q: 0.6, n: 4 };
  const PRE = [
    { nm: '① a₁=4, q=0.6', a1: 4, q: 0.6 },
    { nm: '② a₁=2, q=0.5', a1: 2, q: 0.5 },
    { nm: '③ a₁=6, q=0.7', a1: 6, q: 0.7 },
  ];
  const cA = B.chipM('通项'), cR = B.chipM('剩余'), cL = B.chipM('极限和');

  B.renderFn = () => {
    const { a1, q, n } = st;
    const L = a1 / (1 - q);
    const X0 = 80, XW = 720, y0 = 240, BH = 56;
    const px = u => X0 + XW * u / L;
    // 底板与极限端点
    mk('rect', { x: X0, y: y0 - BH, width: XW, height: BH, fill: '#93a1b5', 'fill-opacity': .08 }, B.dyn);
    B.seg(V(X0, y0), V(X0 + XW, y0), { stroke: '#2b4260', 'stroke-width': 1.4 });
    // 逐段填充
    let s = 0;
    for (let k = 1; k <= n; k++) {
      const v = a1 * q ** (k - 1), x = px(s), w = px(s + v) - x;
      const col = k % 2 ? '#5cadff' : '#ff9e4a';
      mk('rect', { x, y: y0 - BH, width: Math.max(w, 1.2), height: BH, fill: col, 'fill-opacity': .34,
        stroke: col, 'stroke-width': 1.1 }, B.dyn);
      if (w > 34) B.tex(V(x + w / 2, y0 - BH - 15), `$${fmt(v, 2)}$`, { size: 11, anchor: 'mid', color: col, w: 70 });
      s += v;
    }
    // 剩余空档
    const xg = px(s), wg = X0 + XW - xg;
    mk('rect', { x: xg, y: y0 - BH, width: wg, height: BH, fill: '#ff7b8a', 'fill-opacity': .16,
      stroke: '#ff7b8a', 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, B.dyn);
    if (wg > 40) B.tex(V(xg + wg / 2, y0 - BH - 15), `$${fmt(L * q ** n, 2)}$`, { size: 11, anchor: 'mid', color: '#ff7b8a', w: 80 });
    // 极限端点
    B.seg(V(X0 + XW, y0 - BH - 46), V(X0 + XW, y0 + 26), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' });
    B.tex(V(X0 + XW - 6, y0 - BH - 58), `$L=\\dfrac{a_1}{1-q}=${fmt(L, 2)}$`, { size: 12.5, anchor: 'end', color: '#ffd166', w: 200 });
    // 已填读数
    B.tex(V(X0 + 4, y0 + 42), `已填 $S_{${n}}=${fmt(s, 2)}$`, { size: 12.5, anchor: 'start', color: '#5cadff', w: 200 });
    B.tex(V(xg + wg / 2, y0 + 42), `空档 $Lq^{${n}}=${fmt(L * q ** n, 2)}$`, { size: 11.5, anchor: 'mid', color: '#ff7b8a', w: 220 });
    // 每段是前一段的 q 倍
    B.tex(V(X0, y0 - BH - 96), '每一段的长度都是前一段的 $q$ 倍，首段为 $a_1$', { size: 13, anchor: 'start', color: '#93a1b5', w: 620 });
    B.tex(V(60, 30), '线段一段段截下去：截完 $n$ 段，余下的空档是 $Lq^n$', { size: 14, anchor: 'start', w: 760 });
    // 底部推导
    B.tex(V(X0, 352), '$S_n=L-Lq^{\\,n}=\\dfrac{a_1}{1-q}(1-q^{\\,n})=\\dfrac{a_1(1-q^{\\,n})}{1-q}$',
      { size: 14, anchor: 'start', color: '#ffd166', w: 700 });
    B.text(V(X0, 392), '正项等比且 0<q<1 时，这段极限位置才在线段内', { 'font-size': 12, fill: '#93a1b5' });
    // 徽章
    cA(`$a_k=${fmt(a1, 0)}\\times${fmt(q, 1)}^{\\,k-1}$`);
    cR(`$Lq^{${n}}=${fmt(L * q ** n, 3)}$`);
    cL(`$L=\\dfrac{a_1}{1-q}=${fmt(L, 2)}$`);
  };

  const slA = B.slider('首项 a₁', 2, 8, 1, 4, v => { st.a1 = v; B.render(); });
  const slQ = B.slider('公比 q', 0.3, 0.8, 0.1, 0.6, v => { st.q = v; B.render(); });
  B.slider('n =', 1, 8, 1, 4, v => { st.n = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.a1 = p.a1; st.q = p.q;
    slA.sync(st.a1); slQ.sync(st.q);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('空档长度是极限和 L 的 qⁿ 倍：n 每加一，空档缩到 q 倍');
  B.render();
  return B;
}
