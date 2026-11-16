/* 图 定5 · 莫比乌斯反演机
   左图是 n 的除数双曲线：横轴取 d、纵轴取 n/d，曲线 d·e=n 上的整点正好是全部除数对，
   每个点按莫比乌斯函数 μ(d) 上色（+1 绿、−1 红、0 灰）。
   右图把 n 的全部除数排成一列，柱高就是 μ(d)，柱顶的纸条给出从 1 到 d 的部分和。
   两个读数合起来说的是一件事：n>1 时「除数上的 μ 之和」恒为 0，n=1 时才等于 1——反演公式的全部内容。 */
import { Board, V, mk } from '../../../lib/board.js';

const MU = [0];
function mu(n) {
  if (n <= 0) return 0;
  if (n === 1) return 1;
  let k = 0;
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) {
      n /= p;
      if (n % p === 0) return 0;
      k++;
    }
  }
  if (n > 1) k++;
  return k % 2 ? -1 : 1;
}
for (let n = 1; n <= 96; n++) MU[n] = mu(n);

const divs = n => { const a = []; for (let d = 1; d * d <= n; d++) if (n % d === 0) { a.push(d); if (d * d !== n) a.push(n / d); } return a.sort((p, q) => p - q); };
const tau = n => divs(n).length;
const sigma = n => divs(n).reduce((s, d) => s + d, 0);
const phi = n => { let c = 0; for (let k = 1; k <= n; k++) { let a = k, b = n; while (b) { const t = a % b; a = b; b = t; } if (a === 1) c++; } return c; };
const colOf = v => v > 0 ? '#4ade80' : v < 0 ? '#ff7b8a' : '#93a1b5';

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { n: 12 };
  const cT1 = B.chipM('$\\tau(n)$'), cS1 = B.chipM('$\\sigma(n)$'), cP1 = B.chipM('$\\varphi(n)$'), cM = B.chipM('除数上的 $\\mu$ 和');

  B.renderFn = () => {
    const n = st.n, D = divs(n);
    const m = B.isoFit(0, n + 1, 0, n + 1, [24, 20, 380, 392], 26);
    B.grid({ ...m, sx: n <= 12 ? 2 : n <= 24 ? 4 : 8, sy: n <= 12 ? 2 : n <= 24 ? 4 : 8, axLab: 'd', ayLab: 'n/d' });

    // 双曲线 d·e = n（整点就是除数对）
    B.plot(d => n / d, m, { x0: n / (n + 1), x1: n + 1, n: 200, stroke: '#67e8f9', 'stroke-width': 1.6, 'stroke-opacity': .55 });
    for (const d of D) {
      const e = n / d, Q = V(m.px(d), m.py(e)), v = MU[d] ?? mu(d);
      B.dot(Q, 6, { fill: colOf(v), stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.text(V(Q.x, Q.y - 11), String(v), { 'font-size': 11, fill: colOf(v) });
    }
    B.tex(V(m.px(m.X0) + 6, m.py(m.Y1) + 14), `$d\\cdot e=${n}$ 上的整点：$\\mu(d)$ 一正一负地成对抵掉`, { size: 12, color: '#93a1b5', w: 320 });

    // 右图：除数列表上的 μ 柱
    const mR = B.mapFit(-0.5, D.length - 0.5, -1.2, 1.2, [420, 20, 376, 392], 26);
    const bw = 0.34;
    let run = 0;
    D.forEach((d, i) => {
      const v = MU[d] ?? mu(d);
      run += v;
      const x0 = mR.px(i - bw), x1 = mR.px(i + bw);
      B.dyn.appendChild(mk('rect', { x: Math.min(x0, x1), y: Math.min(mR.py(0), mR.py(v)),
        width: Math.abs(x1 - x0), height: Math.abs(mR.py(v) - mR.py(0)) || 1.5,
        fill: colOf(v), 'fill-opacity': .8, stroke: colOf(v) }, B.dyn));
      B.text(V(mR.px(i), mR.py(0) + (v >= 0 ? 16 : -8)), String(d), { 'font-size': 11, fill: '#8fa3bd' });
      // 部分和：柱上方的短横线，一眼看出总和落回 0
      B.text(V(mR.px(i), mR.py(run) - (run >= 0 ? 6 : -14)), String(run), { 'font-size': 10, fill: '#ffd166' });
    });
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 14), '除数 $d$ 上的 $\\mu(d)$：和为 $[n=1]$', { size: 12, color: '#93a1b5', w: 260 });

    const s = D.reduce((a, d) => a + (MU[d] ?? mu(d)), 0);
    cT1(`$${tau(n)}$`, '');
    cS1(`$${sigma(n)}$`, '');
    cP1(`$${phi(n)}$`, '');
    cM(`$${s}$`, s === (n === 1 ? 1 : 0) ? 'good' : 'bad');
    B.hintM(n === 1
      ? '只有 $n=1$ 时除数只有它自己，$\\mu(1)=1$，和才等于 $1$'
      : `$n=${n}$ 的除数两两配对，正负相消，和落回 $0$`);
  };

  const P = [[1, '① $n=1$'], [12, '② $n=12$'], [36, '③ $n=36$']];
  let SL;
  const bts = P.map(([n, lab], i) => B.btnM(lab, () => {
    st.n = n;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    if (SL) SL.sync(n);
    B.render();
  }, { on: i === 1 }));
  SL = B.slider('整数 n', 1, 48, 1, st.n, v => { st.n = Math.round(v); B.render(); }, 'n');

  B.render();
  return B;
}
