/* 图 微4 · 中值定理机：弦与切线的斜率相等
   在 [a, b] 上取曲线 y=f(x)，连 P(a,f(a))、Q(b,f(b)) 得弦 PQ（金虚线）。
   在区间内扫描 f'(x)-k 的零点（k 为弦斜率），得到 ξ；该点切线（橙）与弦平行。
   罗尔定理是弦水平（f(a)=f(b)）的特例，此时 k=0，切线水平。
   版面：坐标系 44..564 × 58..382，右栏 600 起；两枚定理切换。 */
import { Board, V, fmt } from '../../../lib/board.js';

const F = [
  {
    t: '① 罗尔', name: '罗尔定理', a: 0, b: 2,
    f: x => x * x - 2 * x + 2, df: x => 2 * x - 2,
    xr: [-0.7, 2.7], yr: [-1.2, 3.8], xt: [1, 2], yt: [1, 2, 3],
  },
  {
    t: '② 拉格朗日', name: '拉格朗日中值定理', a: -2, b: 2,
    f: x => x * x * x - 3 * x + 2, df: x => 3 * x * x - 3,
    xr: [-2.7, 2.7], yr: [-2.2, 6.4], xt: [-2, -1, 1, 2], yt: [2, 4, 6],
  },
];

/* 在 [a,b] 上扫出 f'(x)=k 的全部根（先按步长变号定位，再二分收窄） */
function rootsOf(S, k) {
  const out = [];
  const N = 600, lo0 = S.a, hi0 = S.b;
  let px = lo0, pv = S.df(lo0) - k;
  for (let i = 1; i <= N; i++) {
    const x = lo0 + (hi0 - lo0) * i / N, v = S.df(x) - k;
    if (pv === 0 && !out.some(r => Math.abs(r - px) < 1e-3)) out.push(px);
    if (pv * v < 0) {
      let x1 = px, x2 = x;
      for (let j = 0; j < 48; j++) {
        const xm = (x1 + x2) / 2;
        if ((S.df(x1) - k) * (S.df(xm) - k) <= 0) x2 = xm;
        else x1 = xm;
      }
      out.push((x1 + x2) / 2);
    }
    px = x; pv = v;
  }
  return out;
}

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0 };
  const cK = B.chipM('弦斜率'), cD = B.chipM('f′(ξ)'), cE = B.chipM('差'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k];
    const m = B.mapFit(S.xr[0], S.xr[1], S.yr[0], S.yr[1], [44, 58, 520, 300], 12);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 2, xt: S.xt, yt: S.yt });
    B.plot(S.f, m, { stroke: '#5cadff', 'stroke-width': 2.2, x0: S.xr[0], x1: S.xr[1] });

    const ya = S.f(S.a), yb = S.f(S.b);
    const k = (yb - ya) / (S.b - S.a);
    const PA = V(m.px(S.a), m.py(ya)), PB = V(m.px(S.b), m.py(yb));

    // 弦
    B.seg(PA, PB, { stroke: '#ffd166', 'stroke-width': 1.8, 'stroke-dasharray': '8 5' });
    B.dot(PA, 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.dot(PB, 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(PA.x - 9, PA.y - 10), '$P$', { size: 12, anchor: 'end', color: '#ffd166' });
    B.tex(V(PB.x + 9, PB.y - 10), '$Q$', { size: 12, anchor: 'start', color: '#ffd166' });
    // 端点的竖直虚线，标出区间
    B.seg(V(PA.x, PA.y), V(PA.x, m.py(0)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .7 });
    B.seg(V(PB.x, PB.y), V(PB.x, m.py(0)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .7 });
    B.tex(V((PA.x + PB.x) / 2, m.py(m.Y1) + 18), `$a=${fmt(S.a, 1)},\\ b=${fmt(S.b, 1)}$`, { size: 11, anchor: 'mid', color: '#93a1b5' });

    // 平行切线：按视野上下边截断
    const tans = rootsOf(S, k);
    tans.forEach((xi, i) => {
      const yi = S.f(xi);
      let ax = m.X0, bx = m.X1;
      if (Math.abs(k) > 1e-9) {
        const xA = xi + (m.Y0 - yi) / k, xB = xi + (m.Y1 - yi) / k;
        ax = Math.max(ax, Math.min(xA, xB)); bx = Math.min(bx, Math.max(xA, xB));
      }
      if (Math.abs(k) < 1e-9) { ax = m.X0; bx = m.X1; }
      B.seg(V(m.px(ax), m.py(yi + k * (ax - xi))), V(m.px(bx), m.py(yi + k * (bx - xi))),
        { stroke: '#ff9e4a', 'stroke-width': 1.8 });
      const TP = V(m.px(xi), m.py(yi));
      B.seg(TP, V(TP.x, m.py(0)), { stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .75 });
      B.dot(TP, 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
      B.tex(V(TP.x, m.py(0) + 34), `$\\xi_{${i + 1}}=${fmt(xi, 2)}$`, { size: 11.5, anchor: 'mid', color: '#ff9e4a' });
    });

    // 右栏
    B.textM(V(604, 86), S.name, { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    const rows = [
      ['$f(a)$', fmt(ya, 4), '#93a1b5'],
      ['$f(b)$', fmt(yb, 4), '#93a1b5'],
      ['弦斜率 $k$', fmt(k, 4), '#ffd166'],
      ['$f\'(\\xi)$', fmt(S.df(tans.length ? tans[0] : S.a), 4), '#ff9e4a'],
      ['$f\'(\\xi)-k$', fmt(S.df(tans.length ? tans[0] : S.a) - k, 4), '#4ade80'],
    ];
    rows.forEach((r, i) => {
      B.tex(V(604, 124 + i * 32), r[0], { size: 12.5, color: r[2], anchor: 'start' });
      B.textM(V(858, 124 + i * 32), r[1], { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'end' });
    });
    B.tex(V(604, 306), '$k=\\dfrac{f(b)-f(a)}{b-a}$', { size: 13, color: '#aebdd2', anchor: 'start' });
    B.tex(V(604, 352), `切线 ${tans.length} 条，都与弦平行`, { size: 12, color: '#8fa3bd', anchor: 'start' });

    cK(`$=${fmt(k, 4)}$`);
    cD(`$=${fmt(S.df(tans.length ? tans[0] : S.a), 4)}$`);
    cE(`$=${fmt(S.df(tans.length ? tans[0] : S.a) - k, 4)}$`);
    if (st.k === 0) cJ('$f(a)=f(b)$，弦水平：区间内必有一点切线也水平——这就是罗尔定理', 'ok');
    else if (tans.length >= 2) cJ('弦斜率非零，区间内有两点切线都与它平行：平行切线的位置不必唯一', 'ok');
    else cJ('把弦 PQ 平推：它总有与曲线相切的一刻，切点横坐标就是中值 ξ', 'ok');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.hintM('黄线与橙色切线始终平行：区间内至少有一个切点，切线方向恰等于两端连线的方向');
  B.render();
  return B;
}
