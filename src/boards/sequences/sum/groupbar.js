/* 图 和1a · 分组求和机
   a_k=k+2^{k−1} 拆成两组：等差部分 k（蓝）与等比部分 2^{k−1}（橙），柱子把两部分叠起来画。
   左边逐列相加是「原数列的和」，右边分别算两组再合并，两条路径给出同一个 S_n。
   局部坐标：柱区 x∈[80,600]，基线 y=390。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 450;
  const B = new Board(root, W, H);
  const st = { n: 4 };
  const PRE = [{ nm: '① n=4', n: 4 }, { nm: '② n=6', n: 6 }, { nm: '③ n=8', n: 8 }];
  const cA = B.chipM('拆分'), cB = B.chipM('两个和'), cS = B.chipM('Sₙ');

  B.renderFn = () => {
    const n = st.n;
    const lin = k => k, geo = k => 2 ** (k - 1);
    const A = n * (n + 1) / 2, G = 2 ** n - 1, S = A + G;
    const top = lin(n) + geo(n);
    const X0 = 80, BW = 520, cw = BW / n, yB = 390, HH = 290;
    const sc = HH / top;
    // 基线
    B.seg(V(X0, yB), V(X0 + BW, yB), { stroke: '#2b4260', 'stroke-width': 1.4 });
    for (let k = 1; k <= n; k++) {
      const x = X0 + (k - 1) * cw + cw * .14, w = cw * .72;
      const h1 = lin(k) * sc, h2 = geo(k) * sc;
      mk('rect', { x, y: yB - h1, width: w, height: h1, fill: '#5cadff', 'fill-opacity': .34,
        stroke: '#5cadff', 'stroke-width': 1.1 }, B.dyn);
      mk('rect', { x, y: yB - h1 - h2, width: w, height: h2, fill: '#ff9e4a', 'fill-opacity': .34,
        stroke: '#ff9e4a', 'stroke-width': 1.1 }, B.dyn);
      B.text(V(x + w / 2, yB + 18), String(k), { 'font-size': 12, fill: '#93a1b5' });
      B.tex(V(x + w / 2, yB - h1 - h2 - 12), `$${fmt(lin(k) + geo(k), 0)}$`, { size: 10.5, anchor: 'mid', color: '#e8eefc', w: 60 });
    }
    // 图例
    B.text(V(X0, yB + 44), '蓝：等差部分 k', { 'font-size': 12, fill: '#5cadff' });
    B.text(V(X0 + 130, yB + 44), '橙：等比部分 2^(k−1)', { 'font-size': 12, fill: '#ff9e4a' });
    // 右栏
    const XR = 640;
    B.seg(V(XR - 18, 76), V(XR - 18, yB), { stroke: '#2b4260', 'stroke-width': 1 });
    B.text(V(XR, 92), '两组分别求和', { 'font-size': 13, fill: '#93a1b5' });
    B.tex(V(XR, 138), '$\\sum_{k=1}^{n}k=\\dfrac{n(n+1)}{2}$', { size: 13, anchor: 'start', w: 210 });
    B.tex(V(XR, 172), `$=${fmt(A, 0)}$`, { size: 13, anchor: 'start', color: '#5cadff', w: 210 });
    B.tex(V(XR, 224), '$\\sum_{k=1}^{n}2^{k-1}=2^{n}-1$', { size: 13, anchor: 'start', w: 210 });
    B.tex(V(XR, 258), `$=${fmt(G, 0)}$`, { size: 13, anchor: 'start', color: '#ff9e4a', w: 210 });
    B.seg(V(XR, 292), V(XR + 190, 292), { stroke: '#2b4260', 'stroke-width': 1 });
    B.tex(V(XR, 330), `$S_{${n}}=${fmt(A, 0)}+${fmt(G, 0)}=${fmt(S, 0)}$`, { size: 14, anchor: 'start', color: '#ffd166', w: 210 });
    // 标题
    B.tex(V(60, 30), '一项拆成两段：等差部分与等比部分各算各的', { size: 14, anchor: 'start', w: 760 });
    // 徽章
    cA('$a_k=k+2^{k-1}$');
    cB(`$\\sum k=${fmt(A, 0)}$，$\\sum 2^{k-1}=${fmt(G, 0)}$`);
    cS(`$S_{${n}}=${fmt(S, 0)}$`);
  };

  B.slider('n =', 1, 8, 1, 4, v => { st.n = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.n = p.n;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('柱子的蓝段照等差数列加，橙段照等比数列加，两段合起来就是 aₖ');
  B.render();
  return B;
}
