/* 图 微3 · 微分机：增量的线性主部
   曲线上取 P(x₀, f(x₀))，走 dx 到 x₀+dx：真的增量是 Δy=f(x₀+dx)−f(x₀)（橙），
   沿切线走同样横距得到的增量是 dy=f′(x₀)dx（蓝）。两者之差是 dx² 量级的小尾巴（绿）。
   右侧列出 dy、Δy、误差与二阶导数 f″(x₀)——误差的系数正是它。
   版面：坐标系 46..606 × 58..382，右栏 630 起。 */
import { Board, V, fmt } from '../../../lib/board.js';

const F = [
  { t: '① $y=x^2$', f: x => x * x, df: x => 2 * x, d2: () => 2, name: 'y=x^2' },
  { t: '② $y=x^3$', f: x => x * x * x, df: x => 3 * x * x, d2: x => 6 * x, name: 'y=x^3' },
  { t: '③ $y=1/x$', f: x => 1 / x, df: x => -1 / (x * x), d2: x => 2 / (x * x * x), name: 'y=1/x' },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, x0: 1.2, dx: 0.6 };
  const cDY = B.chipM('dy'), cAy = B.chipM('Δy'), cEr = B.chipM('误差'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k], x0 = st.x0, dx = st.dx;
    const m = B.mapFit(-0.4, 3.3, -1.8, 10.8, [46, 58, 560, 300], 14);
    B.grid({ ...m, sx: 1, sy: 2, lx: 1, ly: 2, xt: [1, 2, 3], yt: [2, 4, 6, 8, 10] });
    B.plot(S.f, m, { stroke: '#5cadff', 'stroke-width': 2.2, x0: -0.45, x1: 3.3, anchors: [x0, x0 + dx], dom: x => st.k !== 2 || x > 0.12 });

    const y0 = S.f(x0), k = S.df(x0);
    const yT = y0 + k * dx;             // 切线上的增量：dy
    const yQ = S.f(x0 + dx);            // 曲线上的增量：Δy
    const dy = yT - y0, D = yQ - y0;

    // 切线（按视野上下边截断）
    let ax = m.X0, bx = m.X1;
    if (Math.abs(k) > 1e-9) {
      const xA = x0 + (m.Y0 - y0) / k, xB = x0 + (m.Y1 - y0) / k;
      ax = Math.max(ax, Math.min(xA, xB)); bx = Math.min(bx, Math.max(xA, xB));
    }
    B.seg(V(m.px(ax), m.py(y0 + k * (ax - x0))), V(m.px(bx), m.py(y0 + k * (bx - x0))),
      { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '7 5' });

    const X1 = m.px(x0 + dx), XP = m.px(x0), YP = m.py(y0);
    // 两条增量：水平辅助线 + 竖段
    B.seg(V(XP, YP), V(X1, YP), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4' });
    B.seg(V(X1, YP), V(X1, m.py(yT)), { stroke: '#5cadff', 'stroke-width': 3 });
    B.seg(V(X1 + 5, YP), V(X1 + 5, m.py(yQ)), { stroke: '#ff9e4a', 'stroke-width': 1.6, 'stroke-dasharray': '4 3' });
    // 误差那段：切线段终点到曲线点
    if (Math.abs(yQ - yT) > 1e-6) {
      B.seg(V(X1, m.py(yT)), V(X1, m.py(yQ)), { stroke: '#4ade80', 'stroke-width': 3 });
      B.tex(V(X1 + 12, m.py((yT + yQ) / 2) + 10), `$\\Delta y-dy$`, { size: 11.5, anchor: 'start', color: '#4ade80' });
    }

    B.dot(V(XP, YP), 5.2, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(XP - 10, YP - 10), '$P$', { size: 12.5, anchor: 'end', color: '#ffd166' });
    B.dot(V(X1, m.py(yQ)), 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(X1 + 10, m.py(yQ) - 8), '$Q$', { size: 12.5, anchor: 'start', color: '#ff9e4a' });
    B.tex(V((XP + X1) / 2, YP + 16), `$dx=${fmt(dx, 2)}$`, { size: 11.5, anchor: 'mid', color: '#93a1b5' });

    // 右栏
    B.textM(V(632, 88), '增量分两份', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    const rows = [
      ['$dy=f\'(x_0)\\,dx$', fmt(dy, 4), '#5cadff'],
      ['$\\Delta y=f(x_0+dx)-f(x_0)$', fmt(D, 4), '#ff9e4a'],
      ['$\\Delta y-dy$', fmt(D - dy, 4), '#4ade80'],
      ['$f\'\'(x_0)$', fmt(S.d2(x0), 4), '#c084fc'],
    ];
    rows.forEach((r, i) => {
      B.tex(V(632, 128 + i * 36), r[0], { size: 12.5, color: r[2], anchor: 'start' });
      B.textM(V(858, 128 + i * 36), r[1], { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'end' });
    });
    B.tex(V(632, 300), '$\\Delta y=dy+\\tfrac12 f\'\'(\\xi)\\,dx^2$', { size: 13, color: '#aebdd2', anchor: 'start' });
    B.tex(V(632, 344), '$dx\\to0$ 时误差是 $dx$ 的高阶无穷小', { size: 12, color: '#8fa3bd', anchor: 'start' });

    cDY(`$=${fmt(dy, 4)}$`);
    cAy(`$=${fmt(D, 4)}$`);
    cEr(`$=${fmt(D - dy, 4)}$`);
    if (Math.abs(dx) < 0.12) cJ('$dx$ 越小，绿段越短：曲线与切线在局部几乎重合，增量可以用 $dy$ 代替', 'ok');
    else cJ(`把 $dx$ 拖小：绿段按 $dx^2$ 缩，比蓝段退得快 —— 微分是增量的线性主部`);
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.slider('x₀ =', 0.45, 2.6, 0.01, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.slider('dx =', 0.05, 1.4, 0.01, st.dx, v => { st.dx = v; B.render(); }, 'dx');
  B.hintM('蓝段沿切线量，橙段沿曲线量：把 $dx$ 拖小，两段之差按 $dx^2$ 退成绿线');
  B.render();
  return B;
}
