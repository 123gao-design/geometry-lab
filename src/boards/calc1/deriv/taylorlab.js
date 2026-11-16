/* 图 微6 · 泰勒公式机：多项式逐阶对齐导数
   P_n 是 f 在 0 处的 n 阶泰勒多项式，系数由 f 及其各阶导数在该点的值定出。
   蓝线是 f，金线是 P_n；拖 n 看拟合区间变宽，拖 x 看点处的余项 R_n=f(x)-P_n(x)。
   版面：坐标系 46..600 × 58..382，右栏 620 起；n 与 x 两枚滑块。 */
import { Board, V, fmt } from '../../../lib/board.js';

const fact = n => { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; };

const F = [
  {
    t: '① $\\sin x$', name: 'sin x', f: Math.sin,
    pn: (x, n) => { let s = 0; for (let j = 0; 2 * j + 1 <= n; j++) s += (j % 2 ? -1 : 1) * Math.pow(x, 2 * j + 1) / fact(2 * j + 1); return s; },
    xr: [-3.4, 3.4], yr: [-2.4, 2.4], xt: [-3, -2, -1, 1, 2, 3], yt: [-2, -1, 1, 2], xp: 2.4,
  },
  {
    t: '② $\\mathrm{e}^x$', name: 'eˣ', f: Math.exp,
    pn: (x, n) => { let s = 0; for (let j = 0; j <= n; j++) s += Math.pow(x, j) / fact(j); return s; },
    xr: [-1.9, 1.35], yr: [-0.6, 4.2], xt: [-1, 1], yt: [1, 2, 3, 4], xp: 1.0,
  },
  {
    t: '③ $\\ln(1+x)$', name: 'ln(1+x)', f: x => Math.log(1 + x),
    pn: (x, n) => { let s = 0; for (let j = 1; j <= n; j++) s += (j % 2 ? 1 : -1) * Math.pow(x, j) / j; return s; },
    xr: [-0.85, 1.12], yr: [-2.8, 1.4], xt: [1], yt: [-2, -1, 1], xp: 0.9,
  },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, n: 3, xp: 2.4 };
  const cF = B.chipM('f(x)'), cP = B.chipM('Pₙ(x)'), cR = B.chipM('余项'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k], n = Math.round(st.n);
    const xp = Math.min(Math.max(st.xp, S.xr[0] + 0.12), S.xr[1] - 0.12);
    const m = B.mapFit(S.xr[0], S.xr[1], S.yr[0], S.yr[1], [46, 58, 554, 300], 12);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: S.xt, yt: S.yt, axLab: 'x', ayLab: 'y' });

    const dom = x => st.k !== 2 || x > -0.98;
    B.plot(S.f, m, { stroke: '#5cadff', 'stroke-width': 2.2, x0: S.xr[0], x1: S.xr[1], dom });
    // 多项式在两端可能冲出视野，B.plot 的 pad 会抬笔
    B.plot(x => S.pn(x, n), m, { stroke: '#ffd166', 'stroke-width': 2, x0: S.xr[0], x1: S.xr[1], pad: 1.4 });

    const yf = S.f(xp), yp = S.pn(xp, n), R = yf - yp;
    const P = V(m.px(xp), m.py(yf)), Q = V(m.px(xp), m.py(yp));
    B.seg(P, Q, { stroke: '#4ade80', 'stroke-width': 3 });
    B.seg(P, V(P.x, m.py(0)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .65 });
    B.dot(P, 5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.dot(Q, 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.tex(V(P.x + 10, (P.y + Q.y) / 2), `$R_{${n}}$`, { size: 11.5, anchor: 'start', color: '#4ade80' });
    B.tex(V(m.px(0), m.py(0) + 16), '$0$', { size: 11, anchor: 'mid', color: '#93a1b5' });

    // 右栏
    B.textM(V(622, 86), S.name, { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    const rows = [
      ['$n$', String(n), '#93a1b5'],
      ['$x$', fmt(xp, 3), '#93a1b5'],
      ['$f(x)$', fmt(yf, 4), '#5cadff'],
      ['$P_n(x)$', fmt(yp, 4), '#ffd166'],
      ['$R_n(x)$', fmt(R, 4), '#4ade80'],
    ];
    rows.forEach((r, i) => {
      B.tex(V(622, 126 + i * 32), r[0], { size: 12.5, color: r[2], anchor: 'start' });
      B.textM(V(858, 126 + i * 32), r[1], { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'end' });
    });
    B.tex(V(622, 304), '$P_n(x)=\\sum_{k=0}^{n}\\dfrac{f^{(k)}(0)}{k!}x^k$', { size: 12.5, color: '#aebdd2', anchor: 'start' });
    B.tex(V(622, 348), `$R_n(x)=\\dfrac{f^{(n+1)}(\\xi)}{(n+1)!}x^{n+1}$`, { size: 12.5, color: '#8fa3bd', anchor: 'start' });

    cF(`$=${fmt(yf, 4)}$`);
    cP(`$=${fmt(yp, 4)}$`);
    cR(`$=${fmt(R, 4)}$`);
    if (Math.abs(R) < 0.02) cJ('金线在这里几乎压住蓝线：阶数够高时，多项式在这一点附近可以代替原函数', 'ok');
    else cJ(`把 $n$ 调大或把 $x$ 移近 0：金线会贴上来，余项按 $x^{n+1}$ 的量级缩小`);
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; st.xp = S.xp; B.render();
    slp.min = S.xr[0] + 0.12; slp.max = S.xr[1] - 0.12; slp.sync(st.xp);
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
  }, { on: i === 0 }));
  B.slider('n =', 1, 9, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  const slp = B.slider('x =', F[0].xr[0] + 0.12, F[0].xr[1] - 0.12, 0.01, st.xp, v => { st.xp = v; B.render(); }, 'xp');
  B.hintM('拖 $n$：每加一阶，金线在 $0$ 附近多贴合一段；误差按 $x$ 的 $n+1$ 次方缩');
  B.render();
  return B;
}
