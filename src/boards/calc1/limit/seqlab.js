/* 图 极1 · 数列极限机：ε-N 定义的可视化
   一条水平带 [L−ε, L+ε]，蓝点是落在带内的项、橙点是带外的项；N 取「最后一个落在带外」的序号，
   过了 N 之后所有点都进带。ε 越小，带越窄，N 越大——量词顺序（先 ε 后 N）就是这样落在图上的。
   预设里三条收敛、一条发散（(−1)^n 在 ±1 之间来回跳，无论带多宽都永远有一半在外面）。
   版面：左侧坐标系 46..718 × 58..358，右侧只留图例文字；坐标约定 u 向右、v 向下。 */
import { Board, V, mk, fmt } from '../../../lib/board.js';

const SEQ = [
  { t: '① $a_n=1+\\dfrac{(-1)^n}{n}$', f: n => 1 + (n % 2 ? -1 : 1) / n, L: 1, note: '交替收敛' },
  { t: '② $a_n=2-\\dfrac1n$', f: n => 2 - 1 / n, L: 2, note: '单调收敛' },
  { t: '③ $a_n=(n+1)/n+\\dfrac{\\sin n}{3}$', f: n => (n + 1) / n + Math.sin(n) / 3, L: 1, note: '摆动收敛' },
  { t: '④ $a_n=(-1)^n$', f: n => (n % 2 ? -1 : 1), L: null, note: '发散' },
];
const NMAX = 24;

export function createBoard(root) {
  const W = 880, H = 430;
  const B = new Board(root, W, H);
  const st = { k: 0, eps: 0.3 };
  const cA = B.chipM('通项'), cL = B.chipM('极限'), cN = B.chipM('N(ε)'), cJ = B.chipM('判读');
  const m = B.mapFit(0.4, 25.4, -1.5, 3.1, [46, 58, 672, 300], 18);

  B.renderFn = () => {
    const S = SEQ[st.k], eps = st.eps, L = S.L;
    B.grid({ ...m, sx: 5, sy: 1, lx: 5, ly: 1, xt: [5, 10, 15, 20, 25], yt: [-1, 0, 1, 2, 3] });

    // ε 带：只有收敛的数列才有中心 L
    // 序号 → 像素：n 从 1 起，横轴用连续坐标表示
    const px = n => m.px(n), py = y => m.py(y);
    if (L !== null) {
      mk('rect', { x: m.px(m.X0), y: py(L + eps), width: m.px(m.X1) - m.px(m.X0),
        height: py(L - eps) - py(L + eps), fill: '#ffd166', 'fill-opacity': .1 }, B.dyn);
      B.seg(V(m.px(m.X0), py(L)), V(m.px(m.X1), py(L)), { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '6 4' });
      B.tex(V(m.px(m.X0) + 8, py(L + eps) - 8), `$L+\\varepsilon$`, { size: 11.5, anchor: 'start', color: '#a06226' });
      B.tex(V(m.px(m.X0) + 8, py(L - eps) + 16), `$L-\\varepsilon$`, { size: 11.5, anchor: 'start', color: '#a06226' });
      B.tex(V(m.px(m.X1) - 8, py(L) - 16), `$L=${fmt(L, 0)}$`, { size: 12.5, anchor: 'end', color: '#ffd166' });
    }

    // 相邻项之间连一条淡线，帮眼睛按序号读；落在带外的项一律橙色
    let d = '';
    for (let n = 1; n <= NMAX; n++) d += (n === 1 ? 'M' : 'L') + px(n).toFixed(1) + ' ' + py(S.f(n)).toFixed(1) + ' ';
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 1, 'stroke-opacity': .28 }, B.dyn);

    let N = 0;
    for (let n = 1; n <= NMAX; n++) {
      const y = S.f(n);
      const inside = L !== null && Math.abs(y - L) < eps;
      if (!inside) N = n;
      B.dot(V(px(n), py(y)), 4.4, { fill: inside ? '#5cadff' : '#ff9e4a', stroke: inside ? '#0a0d14' : '#0a0d14', 'stroke-width': 1 });
    }

    if (L !== null) {
      // N 的竖线：最后一条落在带外的项
      if (N > 0 && N < NMAX) {
        B.seg(V(px(N) + 5, py(m.Y1)), V(px(N) + 5, py(m.Y0)), { stroke: '#c084fc', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
        B.tex(V(px(N) + 10, py(m.Y1) + 18), `$N=${N}$`, { size: 12, anchor: 'start', color: '#c084fc' });
      }
    }

    // 右侧图例：当前 ε 与带外点数
    let out = 0;
    for (let n = 1; n <= NMAX; n++) if (L === null || Math.abs(S.f(n) - L) >= eps) out++;
    B.textM(V(744, 84), S.note, { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'start' });
    B.textM(V(744, 116), `沿横轴逐个看第 $n$ 项`, { 'font-size': 11.5, fill: '#93a1b5', 'text-anchor': 'start' });
    B.textM(V(744, 140), `带外还有 ${out} 项`, { 'font-size': 11.5, fill: '#ff9e4a', 'text-anchor': 'start' });

    cA(S.t.replace('① ', '').replace('② ', '').replace('③ ', '').replace('④ ', ''));
    cL(L === null ? '不存在：在两个值之间来回跳' : `$L=${fmt(L, 0)}$`);
    if (L === null) cN('没有这样的 $N$：带再怎么放宽也总有一半在外面');
    else cN(N === 0 ? '所有项都已经在带内（$N$ 可取 0）' : `$N=${N}$：$n>${N}$ 的项全部落在带内`, 'ok');
    if (L === null) cJ('$(-1)^n$ 的项在 $1$ 与 $-1$ 之间摆动，不趋于任何数 —— 无界之外还有这种「有界但不收敛」');
    else if (Math.abs(st.eps - 0.3) < 1e-9) cJ('把 ε 调小：带变窄，橙点往右退，$N$ 随之变大');
    else cJ(`$\\varepsilon=${fmt(eps, 2)}$：带内是蓝点，带外是橙点；$n>N$ 之后一个橙点都不剩`, 'ok');
  };

  const bts = SEQ.map((S, i) => B.btnM(S.t, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('ε =', 0.05, 0.6, 0.05, st.eps, v => { st.eps = v; B.render(); }, 'e');

  B.hintM('横轴是序号 $n$，纵轴是项的值；金带是 $|a_n-L|<\\varepsilon$ 的窗口，$n>N$ 之后所有点都进带');
  B.render();
  return B;
}
