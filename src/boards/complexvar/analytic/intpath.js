/* 图 解3 · 复积分与柯西定理机
   左图 z 平面画一条逆时针圆路，半径由滑块给；右图 w 平面画「积分走到哪」的累计曲线：
   沿路上每走一小步，就把 f(z)Δz 加进累计和，右图的点跟着挪。
   三个预设：① f=z²（解析，累计曲线绕一圈又回到原点，闭路积分 0）；
             ② f=1/z（圆内有奇点，累计曲线恰好绕一圈，终点是 2πi）；
             ③ f=z̄（非解析，累计曲线不闭合，终点是 2πiR²，半径一变数就变）。 */
import { Board, V, fmt, mk, TAU } from '../../../lib/board.js';

const P = [
  { n: '① $f=z^2$', f: (x, y) => [x * x - y * y, 2 * x * y], an: false,
    v: '解析函数沿闭路的积分为 $0$：右图的累计曲线走满一圈又落回起点' },
  { n: '② $f=\\dfrac1z$', f: (x, y) => { const r2 = x * x + y * y || 1e-12; return [x / r2, -y / r2]; }, an: true,
    v: '圆内有奇点 $z=0$：积分等于 $2\\pi i$，与半径完全无关' },
  { n: '③ $f=\\bar z$', f: (x, y) => [x, -y], an: false,
    v: '非解析：积分等于 $2\\pi iR^2$，拖半径就看它跟着变' },
];

const cn = (a, b, n = 3) => {
  const A = Math.abs(a) < 5e-4 ? 0 : a, B = Math.abs(b) < 5e-4 ? 0 : b;
  const bs = Math.abs(B) === 1 ? '' : fmt(Math.abs(B), n);
  if (B === 0) return fmt(A, n);
  if (A === 0) return (B < 0 ? '-' : '') + bs + 'i';
  return fmt(A, n) + (B < 0 ? '-' : '+') + bs + 'i';
};

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, R: 1 };
  const mL = B.isoFit(-2.3, 2.3, -2.0, 2.0, [26, 16, 340, 392], 22);
  const cI = B.chipM('积分值'), cRe = B.chipM('实部'), cIm = B.chipM('虚部'), cJ = B.chipM('判读');
  const N = 240;

  // 沿逆时针圆路累计积分，返回累计点（复数对）
  function trail(S) {
    const R = st.R, pts = [];
    let s = [0, 0];
    pts.push(s);
    for (let i = 0; i < N; i++) {
      const b = (i + 1) / N * TAU, a = b - Math.PI / N, p = b - TAU / N; // a 中点求 f，弦从 p 到 b（中点法，误差 O(h²)）
      const za = [R * Math.cos(a), R * Math.sin(a)];
      const dz = [R * Math.cos(b) - R * Math.cos(p), R * Math.sin(b) - R * Math.sin(p)];
      const fv = S.f(za[0], za[1]);
      s = [s[0] + fv[0] * dz[0] - fv[1] * dz[1], s[1] + fv[0] * dz[1] + fv[1] * dz[0]];
      pts.push(s);
    }
    return pts;
  }

  B.renderFn = () => {
    const S = P[st.k], R = st.R;
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });

    // 左图：圆路与方向箭头
    const O = V(mL.px(0), mL.py(0));
    const rr = R * mL.s;
    B.dyn.appendChild(mk('circle', { cx: O.x, cy: O.y, r: rr, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.2 }, B.dyn));
    const tip = V(O.x + rr * Math.cos(-0.35), O.y + rr * Math.sin(-0.35));
    B.arrow(V(tip.x + 14, tip.y - 6), tip, { stroke: '#ffd166', 'stroke-width': 2.2 });
    B.tex(V(O.x + 6, O.y + 18), '$O$', { size: 12.5, color: '#93a1b5', w: 26 });
    if (st.k === 1) B.dot(O, 5, { fill: '#ff6b6b', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(mL.px(mL.X0) + 6, mL.py(mL.Y1) + 14), '$z$ 平面：逆时针圆路', { size: 12, color: '#93a1b5', w: 200 });

    // 右图：累计曲线的取景随数据走
    const pts = trail(S);
    let x0 = 0, x1 = 0, y0 = 0, y1 = 0;
    for (const p of pts) { x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]); y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
    const padx = Math.max(0.6, (x1 - x0) * .25), pady = Math.max(0.6, (y1 - y0) * .25);
    const mR = B.isoFit(x0 - padx, x1 + padx, y0 - pady, y1 + pady, [402, 16, 396, 392], 24);
    B.grid({ ...mR, sx: 1, sy: 1, lx: 2, ly: 2, axLab: 'u', ayLab: 'v' });
    let d = '';
    pts.forEach((p, i) => { d += (i ? 'L' : 'M') + mR.px(p[0]).toFixed(1) + ' ' + mR.py(p[1]).toFixed(1) + ' '; });
    B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: '#67e8f9', 'stroke-width': 2 }, B.dyn));
    const end = pts[pts.length - 1];
    B.dot(V(mR.px(0), mR.py(0)), 4, { fill: '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1 });
    B.dot(V(mR.px(end[0]), mR.py(end[1])), 6, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 14), '$w$ 平面：累计和走出的路径', { size: 12, color: '#93a1b5', w: 220 });

    const an = Math.hypot(end[0], end[1]) < 2e-3;
    cI(`$${cn(end[0], end[1])}$`, '');
    cRe(`$${fmt(end[0], 3)}$`, '');
    cIm(`$${fmt(end[1], 3)}$`, '');
    cJ(st.k === 1 ? '$2\\pi i\\approx6.283i$，与半径无关' : st.k === 0 ? '闭路积分为 $0$，累计曲线闭合' : `$${fmt(2 * Math.PI * R * R, 3)}i$，随 $R^2$ 增长`, an ? 'good' : 'bad');
    B.hintM(S.v);
  };

  const bts = P.map((p, i) => B.btnM(p.n, () => {
    st.k = i;
    bts.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.slider('半径 R', 0.4, 1.9, 0.05, st.R, v => { st.R = v; B.render(); }, 'R');

  B.render();
  return B;
}
