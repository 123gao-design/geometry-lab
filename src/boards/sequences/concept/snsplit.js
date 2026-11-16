/* 图 数3 · 前 n 项和机
   上栏画每一项 aₖ 的条，下栏画前 k 项和 Sₖ 的折线，两栏的 n 严格对齐（共用 x 映射）。
   金色竖虚线是第 n 项的位置：上栏读 aₙ；下栏读 Sₙ 与 Sₙ₋₁ 之间的橙色竖段 —— 段高与上栏的条等高，
   这正是 aₙ = Sₙ − Sₙ₋₁。三种预设：aₖ=2k−1（Sₙ=n²）、aₖ=2^{k−1}（Sₙ=2ⁿ−1）、aₖ=k（Sₙ=n(n+1)/2）。
   局部坐标：上栏 rect=[80,42,700,150]、下栏 rect=[80,244,700,164]，x 视野 [−0.25, 10.7]。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { mode: 0, n: 5, grid: true, labs: true };
  const PRE = [
    { nm: '① $a_k=2k-1$', a: k => 2 * k - 1, S: k => k * k, sf: '$S_n=n^2$' },
    { nm: '② $a_k=2^{k-1}$', a: k => 2 ** (k - 1), S: k => 2 ** k - 1, sf: '$S_n=2^n-1$' },
    { nm: '③ $a_k=k$', a: k => k, S: k => k * (k + 1) / 2, sf: '$S_n=\\dfrac{n(n+1)}{2}$' },
  ];
  const nice = v => { const p = 10 ** Math.floor(Math.log10(v)); const r = v / p; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p; };
  const P = () => PRE[st.mode];
  const arr = () => { const a = []; for (let k = 1; k <= 10; k++) a.push(P().a(k)); return a; };
  const sums = () => { const s = [0]; for (let k = 1; k <= 10; k++) s.push(P().S(k)); return s; };
  const fitT = () => B.mapFit(-0.25, 10.7, 0, Math.max(1, arr()[9] * 1.16), [80, 42, 700, 150], 0);
  const fitB = () => B.mapFit(-0.25, 10.7, 0, sums()[10] * 1.06, [80, 244, 700, 164], 0);
  const cT = B.chipM('通项'), cS = B.chipM('前 n 项和'), cD = B.chipM('作差'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const mT = fitT(), mB = fitB(), A = arr(), S = sums(), n = st.n;
    const syT = nice(mT.Y1 / 4), syB = nice(mB.Y1 / 4);
    B.grid({ ...mT, sx: 1, sy: syT, lx: 1, ly: syT, xt: [], axLab: '', ayLab: 'a', grid: st.grid, labs: st.labs });
    B.grid({ ...mB, sx: 1, sy: syB, lx: 1, ly: syB, axLab: 'n', ayLab: 'S', grid: st.grid, labs: st.labs });
    // 上栏：每一项的条
    for (let k = 1; k <= 10; k++) {
      const x0 = mT.px(k - 0.32), x1 = mT.px(k + 0.32);
      mk('rect', {
        x: x0, y: mT.py(A[k - 1]), width: x1 - x0, height: mT.py(0) - mT.py(A[k - 1]),
        fill: '#5cadff', 'fill-opacity': k === n ? .55 : .26, stroke: '#5cadff', 'stroke-width': 1.1,
      }, B.dyn);
    }
    // 下栏：前 k 项和的折线
    let d = '';
    for (let k = 1; k <= 10; k++) d += (k === 1 ? 'M' : 'L') + mB.px(k).toFixed(1) + ' ' + mB.py(S[k]).toFixed(1) + ' ';
    mk('path', { d, fill: 'none', stroke: '#ffd166', 'stroke-width': 2 }, B.dyn);
    for (let k = 1; k <= 10; k++) B.dot(V(mB.px(k), mB.py(S[k])), 3.2, { fill: '#ffd166' });
    // 第 n 项：竖向贯通虚线 + 两栏读数
    const xp = mT.px(n);
    B.seg(V(xp, mT.py(mT.Y1)), V(xp, mB.py(0)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 5', 'stroke-opacity': .85 });
    B.dot(V(xp, mT.py(A[n - 1])), 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    // 下栏：Sₙ 比 Sₙ₋₁ 高出的一段 = aₙ
    B.seg(V(mB.px(n), mB.py(S[n - 1])), V(mB.px(n), mB.py(S[n])), { stroke: '#ff9e4a', 'stroke-width': 4, 'stroke-linecap': 'round' });
    B.dot(V(mB.px(n), mB.py(S[n - 1])), 3.6, { fill: 'none', stroke: '#ff9e4a', 'stroke-width': 1.6 });
    const right = n <= 8, my = (mB.py(S[n - 1]) + mB.py(S[n])) / 2;
    B.tex(V(mB.px(n) + (right ? 10 : -10), my), `$a_{${n}}=${fmt(A[n - 1], 0)}$`,
      { size: 12.5, anchor: right ? 'start' : 'end', color: '#ff9e4a', w: 120 });
    // 栏目标题与通项、求和公式
    B.tex(V(80, 28), '每一项 $a_k$', { size: 13, anchor: 'start', color: '#93a1b5', w: 220 });
    B.tex(V(80, 236), '前 k 项和 $S_k$', { size: 13, anchor: 'start', color: '#93a1b5', w: 220 });
    B.tex(V(826, 28), P().sf, { size: 14, anchor: 'end', color: '#ffd166', w: 240 });
    // 徽章
    cT(P().nm);
    cS(`$S_{${n}}=${fmt(S[n], 0)}$`);
    cD(`$S_{${n}}-S_{${n - 1}}=${fmt(S[n] - S[n - 1], 0)}$`);
    cJ(n === 1 ? '第 1 项没有前一项可作差，只能单独取 $a_1=S_1$' : '橙色段与上栏第 n 条等高：$a_n=S_n-S_{n-1}$');
  };

  const btns = PRE.map((p, i) => B.btnM(p.nm, () => {
    st.mode = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);
  B.slider('n =', 1, 10, 1, 5, v => { st.n = v; B.render(); });

  B.hint('拖 n：上栏读第 n 项，下栏读前 n 项和；橙段的高度就是第 n 项');
  B.render();
  return B;
}
