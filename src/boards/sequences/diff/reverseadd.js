/* 图 等3 · 倒序相加机
   左：n 列，每列下方是 a_k（蓝），上方是 a_{n+1−k}（橙）—— 正序与倒序并排放置；
   同一列的上下两段高度之和恒为 a_1+a_n，所以所有列等高。
   右：两式相加得 2S_n = n(a_1+a_n)，除以 2 即求和公式。
   局部坐标：柱区 x∈[50,650]、基线 y=380；右侧推导栏 x∈[660,845]。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);
  const st = { a1: 1, d: 1, n: 6, k: 2 };
  const PRE = [
    { nm: '① 从 1 起', a1: 1, d: 1 },
    { nm: '② 公差 2', a1: 2, d: 2 },
    { nm: '③ 大首项', a1: 5, d: 1 },
  ];
  const val = k => st.a1 + (k - 1) * st.d;
  const cK = B.chipM('配对列'), cT = B.chipM('两列总和'), cS = B.chipM('前 n 项和');

  B.renderFn = () => {
    const n = st.n, k = st.k;
    const a1 = st.a1, an = val(n), s = a1 + an;
    const S = n * s / 2;
    const X0 = 50, BW = 600, yB = 380, yT = 70;
    const sc = (yB - yT) / Math.max(s, 1);
    const cw = BW / n, bw = cw * 0.72;
    // 列
    for (let i = 1; i <= n; i++) {
      const x = X0 + (i - 1) * cw + (cw - bw) / 2;
      const lo = val(i), hi = val(n + 1 - i);
      const h1 = lo * sc, h2 = hi * sc;
      const on = i === k;
      mk('rect', { x, y: yB - h1, width: bw, height: h1, fill: '#5cadff', 'fill-opacity': on ? .55 : .30,
        stroke: on ? '#ffd166' : '#5cadff', 'stroke-width': on ? 2.4 : 1.1 }, B.dyn);
      mk('rect', { x, y: yB - h1 - h2, width: bw, height: h2, fill: '#ff9e4a', 'fill-opacity': on ? .5 : .26,
        stroke: on ? '#ffd166' : '#ff9e4a', 'stroke-width': on ? 2.4 : 1.1 }, B.dyn);
      if (h1 > 17) B.text(V(x + bw / 2, yB - h1 / 2 + 4), String(lo), { 'font-size': 11.5, fill: '#fff', 'font-weight': 700 });
      if (h2 > 17) B.text(V(x + bw / 2, yB - h1 - h2 / 2 + 4), String(hi), { 'font-size': 11.5, fill: '#fff', 'font-weight': 700 });
      B.text(V(x + bw / 2, yB + 20), String(i), { 'font-size': 12, fill: on ? '#ffd166' : '#93a1b5', 'font-weight': on ? 700 : 400 });
    }
    // 等高线：每一列的总高度
    B.seg(V(X0, yB - s * sc), V(X0 + BW, yB - s * sc), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' });
    B.tex(V(X0 + 4, yB - s * sc - 16), '$a_1+a_n$', { size: 12, anchor: 'start', color: '#ffd166', w: 110 });
    // 右侧推导
    B.seg(V(656, 70), V(656, 400), { stroke: '#2b4260', 'stroke-width': 1 });
    B.tex(V(666, 92), '正序相加', { size: 12, anchor: 'start', color: '#93a1b5', w: 170 });
    B.tex(V(666, 118), '$S_n=a_1+a_2+\dots+a_n$', { size: 12.5, anchor: 'start', w: 180 });
    B.tex(V(666, 172), '倒序再写一遍', { size: 12, anchor: 'start', color: '#93a1b5', w: 170 });
    B.tex(V(666, 198), '$S_n=a_n+a_{n-1}+\dots+a_1$', { size: 12.5, anchor: 'start', w: 180 });
    B.tex(V(666, 252), '两式逐列相加', { size: 12, anchor: 'start', color: '#93a1b5', w: 170 });
    B.tex(V(666, 286), '$2S_n=n(a_1+a_n)$', { size: 13.5, anchor: 'start', color: '#ffd166', w: 180 });
    B.tex(V(666, 348), '$S_n=\\dfrac{n(a_1+a_n)}{2}$', { size: 14, anchor: 'start', color: '#ffd166', w: 180 });
    // 标题
    B.tex(V(50, 30), '同一列上下拼起来，高度都是 $a_1+a_n$', { size: 14.5, anchor: 'start', w: 600 });
    // 徽章
    cK(`$a_{${k}}+a_{${n + 1 - k}}=${fmt(val(k), 0)}+${fmt(val(n + 1 - k), 0)}=${fmt(s, 0)}$`);
    cT(`$n(a_1+a_n)=${n}\\times${fmt(s, 0)}=${fmt(2 * S, 0)}$`);
    cS(`$S_n=${fmt(S, 0)}$`);
  };

  const slA = B.slider('首项 a₁', 1, 8, 1, 1, v => { st.a1 = v; B.render(); });
  const slD = B.slider('公差 d', 0, 2, 1, 1, v => { st.d = v; B.render(); });
  const slK = B.slider('第 k 列', 1, 6, 1, 2, v => { st.k = v; B.render(); });
  const slN = B.slider('n =', 2, 10, 1, 6, v => {
    st.n = v; st.k = Math.min(st.k, v);
    slK.setAttribute('max', v); slK.sync(st.k);
    B.render();
  });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.a1 = p.a1; st.d = p.d;
    slA.sync(st.a1); slD.sync(st.d);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('拖「第 k 列」：上下两段始终接成同一条等高线');
  B.render();
  return B;
}
