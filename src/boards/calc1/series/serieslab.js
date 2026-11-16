/* 图 级1 · 部分和机：级数收敛与否，只看部分和数列有没有极限
   四档通项：1/n²、1/n、1/2ⁿ、1/(n(n+1))。蓝点连成部分和曲线，绿虚线是它的极限。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const F = [
  { t: '$\\sum\\dfrac{1}{n^2}$', a: n => 1 / (n * n), lim: Math.PI * Math.PI / 6, name: 'p 级数 p=2', read: '部分和越加越挤，最后停在 π²/6 附近' },
  { t: '$\\sum\\dfrac{1}{n}$', a: n => 1 / n, lim: null, name: '调和级数', read: '每一项都趋于零，部分和却按 ln n 一路往上爬' },
  { t: '$\\sum\\dfrac{1}{2^n}$', a: n => Math.pow(0.5, n), lim: 1, name: '等比级数 q=1/2', read: '首项 1/2、公比 1/2，部分和逼近 1' },
  { t: '$\\sum\\dfrac{1}{n(n+1)}$', a: n => 1 / (n * (n + 1)), lim: 1, name: '裂项级数', read: '通项拆成 1/n−1/(n+1)，中间项全部抵消，和恰为 1' },
];
const N = 40;

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, n: 12 };
  const cS = B.chipM('部分和'), cA = B.chipM('通项'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k];
    const m = B.mapFit(0, 42, 0, 5, [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 5, sy: 1, lx: 10, ly: 1, xt: [10, 20, 30, 40], yt: [1, 2, 3, 4] });
    let sum = 0;
    const pts = [];
    for (let n = 1; n <= N; n++) { sum += S.a(n); pts.push([n, sum]); }
    mk('polyline', {
      points: pts.map(p => `${m.px(p[0]).toFixed(1)},${m.py(p[1]).toFixed(1)}`).join(' '),
      fill: 'none', stroke: '#5cadff', 'stroke-width': 1.6, 'stroke-opacity': .5,
    }, B.dyn);
    pts.forEach(p => {
      if (p[0] > 12 && p[0] % 2) return;
      mk('circle', { cx: m.px(p[0]).toFixed(1), cy: m.py(p[1]).toFixed(1), r: 2.3, fill: '#5cadff' }, B.dyn);
    });
    if (S.lim !== null) {
      B.seg(V(m.px(0), m.py(S.lim)), V(m.px(42), m.py(S.lim)), { stroke: '#4ade80', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
      B.textM(V(m.px(41), m.py(S.lim) - 9), '极限', { 'font-size': 11, fill: '#4ade80', 'text-anchor': 'end' });
    }
    const cur = pts[st.n - 1][1];
    B.dot(V(m.px(st.n), m.py(cur)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.seg(V(m.px(st.n), m.py(0)), V(m.px(st.n), m.py(cur)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '3 4' });
    B.tex(V(m.px(st.n) + 8, m.py(cur) - 12), `$S_n=${fmt(cur, 3)}$`, { size: 11.5, anchor: 'start', color: '#ffd166' });

    B.textM(V(636, 84), '通项与部分和', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 124), S.t, { size: 13, color: '#aebdd2', anchor: 'start' });
    B.textM(V(636, 166), S.name, { 'font-size': 12, fill: '#c084fc', 'text-anchor': 'start' });
    B.tex(V(636, 206), `$n=${st.n}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.tex(V(636, 246), `$S_n=${fmt(cur, 4)}$`, { size: 12.5, color: '#ffd166', anchor: 'start' });
    B.tex(V(636, 286), S.lim !== null ? `$S=\\lim_{n\\to\\infty}S_n=${fmt(S.lim, 4)}$` : '$\\lim S_n=+\\infty$', { size: 12, color: S.lim !== null ? '#4ade80' : '#ff9e4a', anchor: 'start', w: 250 });
    B.textM(V(636, 330), S.read, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start', w: 210 });

    cS(`$=${fmt(cur, 4)}$`);
    cA(`$a_n=${fmt(S.a(st.n), 4)}$`);
    if (S.lim !== null) cJ('部分和数列有极限，级数收敛，和就是那个极限；通项趋于零只是收敛的必要条件', 'ok');
    else cJ('每一项都在变小，部分和却一直往上涨 —— 通项趋于零不足以保证收敛');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('n =', 1, N, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.hintM('拖 $n$：看部分和停在哪 —— 停住就有极限，一直涨就没有');
  B.render();
  return B;
}
