/* 图 微1 · 切线斜率机：差商的极限就是导数
   曲线上取定点 P(x₀, f(x₀))，再取动点 Q(x₀+h, f(x₀+h))；PQ 是割线，斜率即差商。
   把 h 拖小，割线绕 P 转，最后贴到金色切线上——斜率收向 f′(x₀)。
   右栏逐行列出 f(x₀+h)、f(x₀)、差商、f′(x₀) 与两者之差。
   版面：左坐标系 46..596 × 58..382，右栏文字 620 起；h 与 x₀ 两枚滑块。 */
import { Board, V, fmt } from '../../../lib/board.js';

const F = [
  { t: '① $y=x^2$', f: x => x * x, df: x => 2 * x, name: 'y=x^2' },
  { t: '② $y=x^3$', f: x => x * x * x, df: x => 3 * x * x, name: 'y=x^3' },
  { t: '③ $y=1/x$', f: x => 1 / x, df: x => -1 / (x * x), name: 'y=1/x' },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, x0: 1.2, h: 0.9 };
  const cK = B.chipM('差商'), cD = B.chipM('导数'), cE = B.chipM('还差'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k], x0 = st.x0, h = st.h;
    const m = B.mapFit(-0.4, 3.25, -1.4, 10.8, [46, 58, 550, 300], 14);
    B.grid({ ...m, sx: 1, sy: 2, lx: 1, ly: 2, xt: [1, 2, 3], yt: [2, 4, 6, 8, 10] });

    // 曲线：1/x 只画右支
    B.plot(S.f, m, { stroke: '#5cadff', 'stroke-width': 2.2, anchors: [x0, x0 + h], x0: -0.45, x1: 3.3, dom: x => st.k !== 2 || x > 0.12 });

    const y0 = S.f(x0), y1 = S.f(x0 + h);
    const k = (y1 - y0) / h, kt = S.df(x0);
    const P = V(m.px(x0), m.py(y0)), Q = V(m.px(x0 + h), m.py(y1));

    // 割线与切线：按视野的上下边截断，斜率再陡也不会画到坐标系外面去
    const lineOf = (kk, at) => {
      let ax = m.X0, bx = m.X1;
      if (Math.abs(kk) > 1e-9) {
        const xA = x0 + (m.Y0 - y0) / kk, xB = x0 + (m.Y1 - y0) / kk;
        ax = Math.max(ax, Math.min(xA, xB));
        bx = Math.min(bx, Math.max(xA, xB));
      }
      return B.seg(V(m.px(ax), m.py(y0 + kk * (ax - x0))), V(m.px(bx), m.py(y0 + kk * (bx - x0))), at);
    };
    lineOf(kt, { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '7 5' });
    lineOf(k, { stroke: '#ff9e4a', 'stroke-width': 2 });

    // 增量的直角三角：横 h、纵 Δy
    B.seg(V(m.px(x0), m.py(y0)), V(m.px(x0 + h), m.py(y0)), { stroke: '#ff9e4a', 'stroke-width': 1.1, 'stroke-dasharray': '3 4', 'stroke-opacity': .8 });
    B.seg(V(m.px(x0 + h), m.py(y0)), Q, { stroke: '#ff9e4a', 'stroke-width': 1.1, 'stroke-dasharray': '3 4', 'stroke-opacity': .8 });
    B.tex(V(m.px(x0 + h / 2), m.py(y0) + 16), `$h=${fmt(h, 2)}$`, { size: 11.5, anchor: 'mid', color: '#a06226' });
    B.tex(V(Q.x + 12, (P.y + Q.y) / 2 + 6), `$\\Delta y$`, { size: 12, anchor: 'start', color: '#a06226' });

    B.dot(P, 5.2, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.dot(Q, 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(P.x - 10, P.y - 10), '$P$', { size: 12.5, anchor: 'end', color: '#ffd166' });
    B.tex(V(Q.x + 9, Q.y - 12), '$Q$', { size: 12.5, anchor: 'start', color: '#ff9e4a' });

    // 右栏
    B.textM(V(622, 88), '割线斜率随 h 变化', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    const rows = [
      ['$f(x_0+h)$', fmt(y1, 4), '#93a1b5'],
      ['$f(x_0)$', fmt(y0, 4), '#93a1b5'],
      ['差商 $k$', fmt(k, 4), '#ff9e4a'],
      ['$f\'(x_0)$', fmt(kt, 4), '#ffd166'],
      ['$k-f\'(x_0)$', fmt(k - kt, 4), '#4ade80'],
    ];
    rows.forEach((r, i) => {
      B.tex(V(622, 124 + i * 30), r[0], { size: 12.5, color: r[2], anchor: 'start' });
      B.textM(V(858, 124 + i * 30), r[1], { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'end' });
    });
    B.tex(V(622, 300), `$k=\\dfrac{f(x_0+h)-f(x_0)}{h}$`, { size: 13, color: '#aebdd2', anchor: 'start' });
    B.tex(V(622, 350), `$h\\to0$ 时 $k\\to f'(x_0)$`, { size: 13, color: '#ffd166', anchor: 'start' });

    cK(`$=\\dfrac{${fmt(y1, 3)}-${fmt(y0, 3)}}{${fmt(h, 2)}}=${fmt(k, 4)}$`);
    cD(`$=${fmt(kt, 4)}$`);
    cE(`$=${fmt(Math.abs(k - kt), 4)}$`);
    if (Math.abs(k - kt) < 0.02) cJ('$h$ 再小也只有更贴近：割线贴住切线，差商以导数为极限', 'ok');
    else cJ(`把 $h$ 拖小：割线绕 $P$ 转，还差 ${fmt(Math.abs(k - kt), 3)}，切线的斜率才是导数`);
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));

  B.slider('x₀ =', 0.45, 2.6, 0.01, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.slider('h =', 0.01, 1.6, 0.01, st.h, v => { st.h = v; B.render(); }, 'h');
  B.hintM('把 $h$ 一路拖小：橙色割线绕 $P$ 转向金色切线，差商就收向该点的导数');
  B.render();
  return B;
}
