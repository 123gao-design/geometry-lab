/* 图 级2 · 比值判别机：相邻两项的比值有没有极限，极限落在 1 的哪一侧
   四档通项：1/n²（ρ=1 失效）、2ⁿ/n!（ρ=0）、n!/10ⁿ（ρ=∞）、n/2ⁿ（ρ=1/2）。
   蓝点是比值数列，红线 y=1 是分界，绿虚线是极限。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const fact = n => { let s = 1; for (let i = 2; i <= n; i++) s *= i; return s; };

const F = [
  { t: '$\\sum\\dfrac{1}{n^2}$', a: n => 1 / (n * n), rho: 1, read: '比值趋于 1，判别法在这条线上失效，须改用 p 级数的结论（p=2 收敛）' },
  { t: '$\\sum\\dfrac{2^n}{n!}$', a: n => Math.pow(2, n) / fact(n), rho: 0, read: '阶乘涨得比指数快，比值一路压到零，级数收敛' },
  { t: '$\\sum\\dfrac{n!}{10^n}$', a: n => fact(n) / Math.pow(10, n), rho: Infinity, read: '分母的指数追不上阶乘，比值无限增大，级数发散' },
  { t: '$\\sum\\dfrac{n}{2^n}$', a: n => n / Math.pow(2, n), rho: 0.5, read: '比值趋于 1/2，落在 1 的左侧，级数收敛' },
];
const N = 30;

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, n: 6 };
  const cR = B.chipM('比值'), cL = B.chipM('极限 ρ'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k];
    const m = B.mapFit(0, N + 1, 0, 3, [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 5, sy: 1, lx: 5, ly: 1, xt: [5, 10, 15, 20, 25], yt: [1, 2] });
    B.seg(V(m.px(0), m.py(1)), V(m.px(N + 1), m.py(1)), { stroke: '#ff6b6b', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' });
    B.textM(V(m.px(N + 1) - 4, m.py(1) - 10), 'ρ=1 分界', { 'font-size': 11, fill: '#ff6b6b', 'text-anchor': 'end' });

    const rs = [];
    for (let n = 1; n <= N; n++) rs.push([n, S.a(n + 1) / S.a(n)]);
    rs.forEach(([n, r]) => {
      if (!(r >= 0) || r > 3) return;
      mk('circle', { cx: m.px(n).toFixed(1), cy: m.py(r).toFixed(1), r: 3, fill: '#5cadff' }, B.dyn);
    });
    const pts = rs.filter(([, r]) => r >= 0 && r <= 3);
    if (pts.length > 1) mk('polyline', {
      points: pts.map(p => `${m.px(p[0]).toFixed(1)},${m.py(p[1]).toFixed(1)}`).join(' '),
      fill: 'none', stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-opacity': .45,
    }, B.dyn);
    if (isFinite(S.rho) && S.rho <= 3) {
      B.seg(V(m.px(0), m.py(S.rho)), V(m.px(N + 1), m.py(S.rho)), { stroke: '#4ade80', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
      B.textM(V(m.px(N + 1) - 4, m.py(S.rho) + 14), 'ρ', { 'font-size': 11.5, fill: '#4ade80', 'text-anchor': 'end' });
    }
    const cur = rs[st.n - 1][1];
    const vis = cur >= 0 && cur <= 3;
    B.dot(V(m.px(st.n), m.py(vis ? cur : 3)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.tex(V(m.px(st.n) + 8, m.py(vis ? cur : 3) - 12), `$${fmt(cur, 3)}$`, { size: 11.5, anchor: 'start', color: '#ffd166' });

    B.textM(V(636, 84), '相邻两项之比', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 124), S.t, { size: 13, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 176), `$\\dfrac{a_{n+1}}{a_n}=${fmt(cur, 3)}$`, { size: 12.5, color: '#ffd166', anchor: 'start', w: 250 });
    B.tex(V(636, 224), `$\\rho=${isFinite(S.rho) ? fmt(S.rho, 2) : '\\infty'}$`, { size: 12.5, color: '#4ade80', anchor: 'start' });
    B.tex(V(636, 262), `$n=${st.n}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.textM(V(636, 304), S.read, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start', w: 215 });

    cR(`$=${fmt(cur, 3)}$`);
    cL(isFinite(S.rho) ? `$=${fmt(S.rho, 2)}$` : '$=\\infty$');
    if (S.rho < 1) cJ('极限比值小于 1：越往后项缩得越快，级数收敛', 'ok');
    else if (S.rho > 1) cJ('极限比值大于 1：后项不比前项小，级数发散');
    else cJ('极限比值恰为 1：这条判别法给不出结论，要换别的办法');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('n =', 1, N, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.hintM('拖 $n$：比值的极限落在 $1$ 的左侧就收敛，右侧就发散，正落在 $1$ 上判别法失效');
  B.render();
  return B;
}
