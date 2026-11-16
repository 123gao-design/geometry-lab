/* 图 比3a · 错位相减机
   S_n=a_1+a_1q+…+a_1q^{n-1}；qS_n 的每一项整体右移一列。两排按列对齐后，
   第 2..n 列上下等高、正好相消，只剩第 1 列的 a_1 与第 n+1 列的 a_{n+1}。
   局部坐标：柱区 x∈[96,656]，上排基线 y=250，下排基线 y=430，柱高上限 168。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);
  const st = { a1: 1, q: 2, n: 5 };
  const PRE = [{ nm: '① a₁=1, q=2', a1: 1, q: 2 }, { nm: '② a₁=2, q=3', a1: 2, q: 3 }];
  const cS = B.chipM('和式'), cD = B.chipM('相减值'), cV = B.chipM('Sₙ');

  B.renderFn = () => {
    const n = st.n, a1 = st.a1, q = st.q;
    const a = k => a1 * q ** (k - 1);
    const an1 = a(n + 1), S = a1 * (1 - q ** n) / (1 - q);
    const top = Math.max(a1, an1);
    const X0 = 96, BW = 560;
    const cw = BW / (n + 1);
    const yT = 250, yB = 430, HH = 168;
    const hOf = v => Math.max(2, HH * v / top);
    // 列底纹：绿 = 上下等高相消，金 = 只剩一条
    for (let k = 2; k <= n; k++)
      mk('rect', { x: X0 + (k - 1) * cw, y: 74, width: cw, height: yB - 74, fill: '#4ade80', 'fill-opacity': .1 }, B.dyn);
    for (const k of [1, n + 1])
      mk('rect', { x: X0 + (k - 1) * cw, y: 74, width: cw, height: yB - 74, fill: '#ffd166', 'fill-opacity': .12 }, B.dyn);
    // 上排 S_n
    for (let k = 1; k <= n; k++) {
      const x = X0 + (k - 1) * cw + cw * .16, w = cw * .68, v = a(k), h = hOf(v);
      mk('rect', { x, y: yT - h, width: w, height: h, fill: '#5cadff', 'fill-opacity': .35,
        stroke: '#5cadff', 'stroke-width': 1.2 }, B.dyn);
      B.tex(V(x + w / 2, yT - h - 11), `$${fmt(v, 0)}$`, { size: 10.5, anchor: 'mid', color: '#5cadff', w: 60 });
    }
    // 下排 qS_n，整体右移一列
    for (let k = 2; k <= n + 1; k++) {
      const x = X0 + (k - 1) * cw + cw * .16, w = cw * .68, v = a(k - 1), h = hOf(v);
      mk('rect', { x, y: yB - h, width: w, height: h, fill: '#ff9e4a', 'fill-opacity': .32,
        stroke: '#ff9e4a', 'stroke-width': 1.2 }, B.dyn);
      if (k === n + 1) B.tex(V(x + w / 2, yB - h - 11), `$${fmt(v, 0)}$`, { size: 10.5, anchor: 'mid', color: '#ff9e4a', w: 60 });
    }
    // 两条基线
    B.seg(V(X0, yT), V(X0 + BW, yT), { stroke: '#2b4260', 'stroke-width': 1.2 });
    B.seg(V(X0, yB), V(X0 + BW, yB), { stroke: '#2b4260', 'stroke-width': 1.2 });
    // 列号
    for (let k = 1; k <= n + 1; k++)
      B.text(V(X0 + (k - 1) * cw + cw / 2, yB + 18), String(k), { 'font-size': 11.5, fill: '#93a1b5' });
    // 行名
    B.tex(V(X0 - 10, yT - 30), '$S_n$', { size: 14, anchor: 'end' });
    B.tex(V(X0 - 10, yB - 30), '$qS_n$', { size: 14, anchor: 'end' });
    // 相消与剩余的标注
    if (n >= 2)
      B.tex(V(X0 + cw, 66), `中间 ${n - 1} 列上下等高，相减为零`, { size: 12, anchor: 'start', color: '#4ade80', w: 300 });
    B.tex(V(X0 + cw * .84, yT + 44), '$a_1$ 留着', { size: 11.5, anchor: 'mid', color: '#ffd166', w: 90 });
    B.tex(V(X0 + n * cw + cw * .5, yB - 44), '$-a_{n+1}$ 留着', { size: 11.5, anchor: 'mid', color: '#ffd166', w: 110 });
    // 标题
    B.tex(V(60, 30), '把 $qS_n$ 错后一列，同列相减：中间全部消掉', { size: 14, anchor: 'start', w: 760 });
    // 右栏推导
    const XR = 700;
    B.seg(V(XR - 16, 76), V(XR - 16, yB), { stroke: '#2b4260', 'stroke-width': 1 });
    const lines = [
      ['$S_n=a_1+a_1q+\\dots+a_1q^{n-1}$', '#e8eefc'],
      ['$qS_n=a_1q+\\dots+a_1q^{n}$', '#ff9e4a'],
    ];
    lines.forEach(([s, c], i) => B.tex(V(XR, 118 + i * 34), s, { size: 11.5, anchor: 'start', color: c, w: 170 }));
    B.text(V(XR, 190), '同列相减，中间消去', { 'font-size': 12, fill: '#4ade80' });
    B.tex(V(XR, 228), '$S_n-qS_n=a_1-a_{n+1}$', { size: 11.5, anchor: 'start', w: 170 });
    B.tex(V(XR, 286), '$S_n=\\dfrac{a_1(1-q^n)}{1-q}$', { size: 12.5, anchor: 'start', w: 170 });
    B.tex(V(XR, 340), `$=\\dfrac{${fmt(a1, 0)}\\times(1-${fmt(q, 0)}^{${n}})}{1-${fmt(q, 0)}}=${fmt(S, 0)}$`,
      { size: 11.5, anchor: 'start', color: '#ffd166', w: 170 });
    B.text(V(XR, 388), 'q≠1 才能除', { 'font-size': 11, fill: '#93a1b5' });
    // 徽章
    cS(`$S_n=\\dfrac{${fmt(a1, 0)}(1-${fmt(q, 0)}^{${n}})}{1-${fmt(q, 0)}}=${fmt(S, 0)}$`);
    cD(`$a_1-a_{${n + 1}}=${fmt(a1, 0)}-${fmt(an1, 0)}=${fmt(a1 - an1, 0)}$`);
    cV(`$S_n=${fmt(S, 0)}$`);
  };

  const slA = B.slider('首项 a₁', 1, 4, 1, 1, v => { st.a1 = v; B.render(); });
  const slQ = B.slider('公比 q', 1.5, 3, 0.5, 2, v => { st.q = v; B.render(); });
  B.slider('n =', 2, 8, 1, 5, v => { st.n = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.a1 = p.a1; st.q = p.q;
    slA.sync(st.a1); slQ.sync(st.q);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('列 1 只剩 a₁，列 n+1 只剩 aₙ₊₁，中间各列等高相消');
  B.render();
  return B;
}
