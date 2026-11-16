/* 图 级3 · 交错级数机：正负相间的项把部分和压进一对上下界之间
   三档：Σ(−1)^{n−1}/n（趋于 ln2）、Σ(−1)^{n−1}/n²（趋于 π²/12）、
   Σ(−1)^{n−1}(n+1)/n（通项不趋于零，两支界不靠拢）。
   橙点是奇数项部分和，紫点是偶数项部分和，绿虚线是极限。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const F = [
  { t: '$\\sum\\dfrac{(-1)^{n-1}}{n}$', a: n => Math.pow(-1, n - 1) / n, lim: Math.log(2), read: '项在变小、正负相间，两支部分和夹着极限来回收拢' },
  { t: '$\\sum\\dfrac{(-1)^{n-1}}{n^2}$', a: n => Math.pow(-1, n - 1) / (n * n), lim: Math.PI * Math.PI / 12, read: '平方让项缩得更快，两支界靠得更紧' },
  { t: '$\\sum(-1)^{n-1}\\dfrac{n+1}{n}$', a: n => Math.pow(-1, n - 1) * (n + 1) / n, lim: null, read: '通项趋于 1 而不趋于零，正负两支各停在一处，谁也不向谁靠' },
];
const N = 30;

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, n: 10 };
  const cO = B.chipM('奇项和'), cE = B.chipM('偶项和'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k];
    const m = B.mapFit(0, N + 1, 0, 2.4, [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 5, sy: 0.5, lx: 5, ly: 0.5, xt: [5, 10, 15, 20, 25], yt: [0.5, 1, 1.5, 2] });
    let sum = 0;
    const pts = [];
    for (let n = 1; n <= N; n++) { sum += S.a(n); pts.push([n, sum]); }
    mk('polyline', {
      points: pts.map(p => `${m.px(p[0]).toFixed(1)},${m.py(Math.max(0, Math.min(2.4, p[1]))).toFixed(1)}`).join(' '),
      fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.2, 'stroke-opacity': .5,
    }, B.dyn);
    pts.forEach(([n, v]) => {
      if (v < 0 || v > 2.4) return;
      mk('circle', { cx: m.px(n).toFixed(1), cy: m.py(v).toFixed(1), r: 3, fill: n % 2 ? '#ff9e4a' : '#c084fc' }, B.dyn);
    });
    if (S.lim !== null) {
      B.seg(V(m.px(0), m.py(S.lim)), V(m.px(N + 1), m.py(S.lim)), { stroke: '#4ade80', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
      B.textM(V(m.px(N + 1) - 4, m.py(S.lim) - 9), '极限', { 'font-size': 11, fill: '#4ade80', 'text-anchor': 'end' });
    }
    const odd = st.n % 2 ? pts[st.n - 1][1] : pts[st.n - 2][1];
    const even = st.n % 2 ? pts[st.n - 2][1] : pts[st.n - 1][1];
    B.dot(V(m.px(st.n), m.py(Math.max(0, Math.min(2.4, pts[st.n - 1][1])))), 5.2, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });

    B.textM(V(636, 84), '交错级数', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 124), S.t, { size: 12.5, color: '#aebdd2', anchor: 'start', w: 250 });
    B.tex(V(636, 176), `$n=${st.n}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.tex(V(636, 216), `$S_{2k-1}=${fmt(odd, 4)}$`, { size: 12, color: '#ff9e4a', anchor: 'start' });
    B.tex(V(636, 252), `$S_{2k}=${fmt(even, 4)}$`, { size: 12, color: '#c084fc', anchor: 'start' });
    B.tex(V(636, 292), S.lim !== null ? `$|S-S_n|\\le a_{n+1}=${fmt(Math.abs(S.a(st.n + 1)), 3)}$` : `$a_n=\\dfrac{n+1}{n}\\to1\\ne0$`, { size: 12, color: '#ffd166', anchor: 'start', w: 250 });
    B.textM(V(636, 336), S.read, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start', w: 215 });

    cO(`$=${fmt(odd, 4)}$`);
    cE(`$=${fmt(even, 4)}$`);
    if (S.lim !== null) cJ('通项递减且趋于零：两支部分和互相靠拢，级数收敛，截断误差不超过下一项', 'ok');
    else cJ('通项不趋于零，两支部分和停在相距一段的地方 —— 必要条件不满足，级数发散');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('n =', 2, N, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.hintM('拖 $n$：两支部分和互相靠拢就收敛；各停一处、距离不变，说明级数发散');
  B.render();
  return B;
}
