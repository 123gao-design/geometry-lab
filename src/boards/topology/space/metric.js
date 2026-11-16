/* 图 拓5 · 度量球与序列机
   左图是 p-范数下的单位球：p=1 是菱形，p=2 是圆，p 越大越贴近正方形，最极端是最大范数的方框。
   右图把同一套范数搬到收敛上：点列 z_n = (1+1/n, sin(2.2n)/n) 趋于 (1,0)，
   绿点落在以极限为心、半径 ε 的球内，橙点还在球外；换 p 只换尺子，球变了形，进入球的项数跟着变。
   拖 p 与 ε 看两件事同时发生：球的形状随 p 变，补上的尾巴随 ε 收。 */
import { Board, V, fmt, mk, TAU } from '../../../lib/board.js';

const norm = (dx, dy, p) => p >= 99 ? Math.max(Math.abs(dx), Math.abs(dy))
  : Math.pow(Math.pow(Math.abs(dx), p) + Math.pow(Math.abs(dy), p), 1 / p);
const radAt = (a, p) => {
  const c = Math.abs(Math.cos(a)), s = Math.abs(Math.sin(a));
  if (p >= 99) return 1 / Math.max(c, s);
  return Math.pow(Math.pow(c, p) + Math.pow(s, p), -1 / p);
};

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { p: 2, eps: 0.4 };
  const zs = n => [1 + 1 / n, Math.sin(2.2 * n) / n];
  const NMAX = 30;
  const mL = B.isoFit(-1.7, 1.7, -1.7, 1.7, [24, 20, 380, 392], 26);
  const mR = B.isoFit(-0.12, 2.44, -1.26, 1.26, [420, 20, 376, 392], 26);
  const cE = B.chipM('半径 $\\varepsilon$'), cN = B.chipM('阈值 $n_0$'), cK = B.chipM('球内 / 总数'), cD = B.chipM('尾项最大距离'), cP = B.chipM('范数');

  B.renderFn = () => {
    const p = st.p, eps = st.eps;
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });
    B.grid({ ...mR, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });

    // 左：单位球边界
    const ball = (cx, cy, R, mm, col, w) => {
      let d = '';
      for (let i = 0; i <= 240; i++) {
        const a = i / 240 * TAU, r = R * radAt(a, p);
        const X = mm.px(cx + r * Math.cos(a)), Y = mm.py(cy + r * Math.sin(a));
        d += (i ? 'L' : 'M') + X.toFixed(1) + ' ' + Y.toFixed(1) + ' ';
      }
      B.dyn.appendChild(mk('path', { d, fill: col, 'fill-opacity': .07, stroke: col, 'stroke-width': w || 2.2 }, B.dyn));
    };
    ball(0, 0, 1, mL, '#67e8f9');
    B.dot(V(mL.px(0), mL.py(0)), 3.5, { fill: '#93a1b5' });
    B.tex(V(mL.px(mL.X0) + 6, mL.py(mL.Y1) + 40), p >= 99 ? '最大范数：单位球是方框' : `$p=${fmt(p, 1)}$：单位球边界 $|x|^{p}+|y|^{p}=1$`, { size: 12, color: '#93a1b5', w: 300 });

    // 右：点列与 ε 球
    let n0 = 0, inside = 0, tailMax = 0;
    const z = zs(NMAX);
    for (let n = 1; n <= NMAX; n++) {
      const [x, y] = zs(n), dist = norm(x - z[0], y - z[1], p);
      if (dist >= eps) n0 = n;
      if (dist < eps) inside++;
      if (dist < 0.2) tailMax = Math.max(tailMax, dist);
    }
    ball(z[0], z[1], eps, mR, '#ffd166', 2);
    B.dot(V(mR.px(z[0]), mR.py(z[1])), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.tex(V(mR.px(z[0]) + 10, mR.py(z[1]) - 10), '$z^{*}=(1,0)$', { size: 11, color: '#ffd166', w: 70 });
    for (let n = NMAX; n >= 1; n--) {
      const [x, y] = zs(n), dist = norm(x - z[0], y - z[1], p), inB = dist < eps;
      B.dot(V(mR.px(x), mR.py(y)), n > 12 ? 3 : 4.5, { fill: inB ? '#4ade80' : '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1 });
      if (n <= 6) B.text(V(mR.px(x) + 9, mR.py(y) + 4), 'z' + n, { 'font-size': 10, fill: inB ? '#4ade80' : '#ff9e4a', 'text-anchor': 'start' });
    }
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 40), '从某项起全部落进 $\\varepsilon$ 球，才算收敛', { size: 12, color: '#93a1b5', w: 320 });

    cE(`$${fmt(eps, 2)}$`, '');
    cN(n0 ? `$${n0 + 1}$` : '$1$', n0 < NMAX ? 'good' : 'bad');
    cK(`$${inside}/${NMAX}$`, inside > NMAX * .7 ? 'good' : '');
    cD(`$${fmt(tailMax, 3)}$`, '');
    cP(p >= 99 ? '$\\|\\cdot\\|_{\\infty}$' : `$\\|\\cdot\\|_{${fmt(p, 1)}}$`, p >= 99 ? 'good' : '');
    B.hintM(p >= 99
      ? '最大范数下单位球是方框：坐标都不超过 $1$ 才算在里面'
      : `$p=${fmt(p, 1)}$：球越接近方形，同样的 $\\varepsilon$ 装下的点越多还是越少，看右栏计数`);
  };

  let SL;
  const bts = [
    [1, '① $p=1$'], [2, '② $p=2$'], [99, '③ $p=\\infty$'],
  ].map(([p, lab], i) => B.btnM(lab, () => {
    st.p = p;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    if (SL) SL.sync(Math.min(p, 6));
    B.render();
  }, { on: i === 1 }));
  SL = B.slider('p 值', 1, 6, 0.1, st.p, v => { st.p = v; B.render(); }, 'p');
  B.slider('ε', 0.05, 0.9, 0.01, st.eps, v => { st.eps = v; B.render(); }, 'eps');

  B.render();
  return B;
}
