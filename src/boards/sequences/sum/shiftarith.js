/* 图 和2 · 等差乘等比机
   a_k=kq^{k−1}。S_n 与 qS_n 逐列摆在同一基线上：第 j 列左边是 a_j（蓝），右边是 q a_{j−1}（橙），
   两者高度差恰好是 q^{j−1}（绿色竖段）。相减后这些差拼成一段等比数列，末列再减去 nq^n。
   局部坐标：柱区 x∈[90,630]，基线 y=380，柱高上限 250。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { q: 2, n: 4 };
  const PRE = [{ nm: '① q=2', q: 2 }, { nm: '② q=3', q: 3 }];
  const cA = B.chipM('通项'), cD = B.chipM('相减结果'), cS = B.chipM('Sₙ');

  B.renderFn = () => {
    const q = st.q, n = st.n;
    const a = k => k * q ** (k - 1);
    const S = ((q ** n - 1) / (q - 1) - n * q ** n) / (1 - q);
    const maxV = Math.max(a(n), n * q ** n);
    const X0 = 90, BW = 540, cw = BW / (n + 1);
    const yB = 380, HH = 250;
    const sc = HH / maxV;
    B.seg(V(X0, yB), V(X0 + BW, yB), { stroke: '#2b4260', 'stroke-width': 1.4 });
    const bar = (x, w, v, col, op, stroke, dash) => mk('rect',
      { x, y: yB - v * sc, width: w, height: Math.max(v * sc, 1.2), fill: col, 'fill-opacity': op,
        stroke, 'stroke-width': 1.2, ...(dash ? { 'stroke-dasharray': dash } : {}) }, B.dyn);
    for (let j = 1; j <= n + 1; j++) {
      const xc = X0 + (j - 1) * cw;
      if (j <= n) {
        const w = cw * .34;
        bar(xc + cw * .1, w, a(j), '#5cadff', .36, '#5cadff');
        if (j === 1) B.tex(V(xc + cw * .27, yB - a(1) * sc - 12), `$a_1=${fmt(a(1), 0)}$`, { size: 10.5, anchor: 'mid', color: '#ffd166', w: 90 });
        if (j > 1) {
          // 绿色竖段：本列相减的剩余量
          const v2 = q * a(j - 1);
          const y1 = yB - v2 * sc, y0 = yB - a(j) * sc;
          if (y1 - y0 > 6)
            B.seg(V(xc + cw * .62, y0), V(xc + cw * .62, y1), { stroke: '#4ade80', 'stroke-width': 3 });
        }
      }
      if (j >= 2) {
        const w = cw * .34, v = q * a(j - 1);
        bar(xc + cw * .56, w, v, '#ff9e4a', .32, j === n + 1 ? '#ff7b8a' : '#ff9e4a', j === n + 1 ? '5 4' : '');
        if (j === n + 1) B.tex(V(xc + cw * .73, yB - v * sc - 12), `$-${n}q^{${n}}$`, { size: 10.5, anchor: 'mid', color: '#ff7b8a', w: 100 });
      }
      B.text(V(xc + cw / 2, yB + 18), String(j), { 'font-size': 11.5, fill: '#93a1b5' });
    }
    // 行名与图例
    B.tex(V(X0 - 8, yB - 30), '$S_n$', { size: 13, anchor: 'end', color: '#5cadff' });
    B.tex(V(X0 - 8, 70), '$qS_n$', { size: 13, anchor: 'end', color: '#ff9e4a' });
    B.text(V(X0, 60), '左柱：Sₙ 的项　右柱：qSₙ 的项（错后一列）', { 'font-size': 11.5, fill: '#93a1b5' });
    B.text(V(X0, 420), '绿色竖段是每一列相减后剩下的 q^(k−1)', { 'font-size': 12, fill: '#4ade80' });
    // 右栏
    const XR = 668;
    B.seg(V(XR - 16, 76), V(XR - 16, 420), { stroke: '#2b4260', 'stroke-width': 1 });
    B.tex(V(XR, 100), '$S_n=1+2q+\\dots+nq^{n-1}$', { size: 11.5, anchor: 'start', w: 180 });
    B.tex(V(XR, 140), '$qS_n=q+2q^2+\\dots+nq^{n}$', { size: 11.5, anchor: 'start', color: '#ff9e4a', w: 180 });
    B.text(V(XR, 180), '相减', { 'font-size': 12, fill: '#93a1b5' });
    B.tex(V(XR, 216), '$S_n-qS_n=1+q+\\dots+q^{n-1}-nq^n$', { size: 11, anchor: 'start', w: 180 });
    B.tex(V(XR, 262), '$=\\dfrac{q^{n}-1}{q-1}-nq^{n}$', { size: 11.5, anchor: 'start', w: 180 });
    B.tex(V(XR, 318), '$S_n=\\dfrac{1}{1-q}\\left[\\dfrac{q^{n}-1}{q-1}-nq^{n}\\right]$', { size: 11, anchor: 'start', w: 180 });
    B.tex(V(XR, 372), `$=${fmt(S, 1)}$`, { size: 13, anchor: 'start', color: '#ffd166', w: 180 });
    // 标题
    B.tex(V(60, 30), '等差乘等比：错位相减后，剩下的是一小段等比数列', { size: 14, anchor: 'start', w: 760 });
    // 徽章
    cA(`$a_k=k\\cdot${fmt(q, 0)}^{\\,k-1}$`);
    cD(`$S_n-qS_n=\\dfrac{${fmt(q, 0)}^{${n}}-1}{${fmt(q, 0)}-1}-${n}\\cdot${fmt(q, 0)}^{${n}}=${fmt((q ** n - 1) / (q - 1) - n * q ** n, 0)}$`);
    cS(`$S_{${n}}=${fmt(S, 1)}$`);
  };

  const slQ = B.slider('公比 q', 2, 3, 0.5, 2, v => { st.q = v; B.render(); });
  B.slider('n =', 2, 6, 1, 4, v => { st.n = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.q = p.q;
    slQ.sync(st.q);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('每列左右两根柱子的高差是 q^(k−1)，全部加起来就是相减后的等比段');
  B.render();
  return B;
}
