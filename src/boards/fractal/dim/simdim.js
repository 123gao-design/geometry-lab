import { Board, V, mk } from '../../../lib/board.js';

/* 相似维数机：把单位正方形每边分成 m 份，保留 N 个 1/m 小方块（示意），
   由 N·r^D=1 解出 D=ln N/ln(1/r)。预设摆出四种常见自相似集的 (N,m) 组合。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { m: 2, N: 4 };
  const cN = B.chipM('副本数 $N$');
  const cR = B.chipM('比例 $r$');
  const cD = B.chipM('维数 $D$');
  const cE = B.chipM('校验 $Nr^{D}$');

  function fit() { if (st.N > st.m * st.m) st.N = st.m * st.m; }

  B.renderFn = () => {
    const m = st.m, N = st.N, r = 1 / m;
    const D = Math.log(N) / Math.log(m);
    const S = 320, x0 = 250, y0 = 80, cell = S / m;
    B.tex(V(410, 32), '每边分 $m$ 份，保留其中 $N$ 格（示意）', { size: 16, anchor: 'mid', w: 520 });
    mk('rect', { x: x0, y: y0, width: S, height: S, fill: 'rgba(10,13,20,.25)', stroke: '#ffd166', 'stroke-width': 1.6 }, B.dyn);
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < m; j++) {
        const on = i * m + j < N;
        mk('rect', { x: x0 + j * cell + 1.5, y: y0 + i * cell + 1.5, width: cell - 3, height: cell - 3,
          fill: !on ? 'none' : (i === 0 && j === 0 ? 'rgba(255,158,74,.32)' : 'rgba(92,173,255,.2)'),
          stroke: !on ? 'rgba(143,163,189,.22)' : (i === 0 && j === 0 ? '#ff9e4a' : '#5cadff'),
          'stroke-width': on ? 1.4 : 1, 'stroke-dasharray': on ? '' : '3 5' }, B.dyn);
      }
    }
    B.tex(V(410, 392), `$N\\,r^{D}=${N}\\cdot\\left(\\frac1{${m}}\\right)^{${D.toFixed(3)}}\\approx 1$`, { size: 15, anchor: 'mid', w: 420 });
    B.text(V(410, 416), D < 1 - 1e-9 ? '维数小于 1：比曲线还稀疏'
      : Math.abs(D - 1) < 1e-9 ? '维数等于 1：与曲线同量级'
        : D < 2 - 1e-9 ? '维数介于 1 与 2：比曲线密、比平面稀'
          : '维数等于 2：铺满整个正方形', { 'font-size': 12, fill: '#8fa3bd' });
    cN(`${N}`);
    cR(`$\\frac1{${m}}$`);
    cD(`$${D.toFixed(3)}$`);
    cE('$1.000$');
  };

  const mS = B.slider('每边份数 m', 2, 6, 1, st.m, v => { st.m = v; fit(); nS.sync(st.N); B.render(); });
  const nS = B.slider('保留格数 N', 2, 36, 1, st.N, v => { st.N = Math.min(v, st.m * st.m); if (st.N !== v) nS.sync(st.N); B.render(); });
  B.btnM('正方形 $N=4$, $m=2$', () => { st.N = 4; st.m = 2; mS.sync(2); nS.sync(4); B.render(); });
  B.btnM('三分康托 $N=2$, $m=3$', () => { st.N = 2; st.m = 3; mS.sync(3); nS.sync(2); B.render(); });
  B.btnM('科赫 $N=4$, $m=3$', () => { st.N = 4; st.m = 3; mS.sync(3); nS.sync(4); B.render(); });
  B.btnM('谢尔宾斯基 $N=3$, $m=2$', () => { st.N = 3; st.m = 2; mS.sync(2); nS.sync(3); B.render(); });
  B.hintM('维数不必是整数：$D=\\dfrac{\\ln N}{\\ln(1/r)}$ 由副本数与缩放比共同决定');
  B.render();
  return B;
}
