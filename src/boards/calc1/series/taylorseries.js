/* 图 级4b · 泰勒逼近机：把函数展开成幂级数，截到第 n 项看它离原函数多远
   四档：sin x、e^x、ln(1+x)、1/(1−x)。蓝线是原函数，橙虚线是 n 项多项式，
   金点与竖直虚线段给出当前 x 处的偏差。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt } from '../../../lib/board.js';

const fact = n => { let s = 1; for (let i = 2; i <= n; i++) s *= i; return s; };

const F = [
  {
    t: '$\\sin x$', f: Math.sin, xr: [-6.6, 6.6], yr: [-2, 2], xt: [-6, -3, 3, 6], yt: [-1, 1], win: 6.6,
    P: (x, n) => { let s = 0; for (let k = 0; k < n; k++) s += Math.pow(-1, k) * Math.pow(x, 2 * k + 1) / fact(2 * k + 1); return s; },
    form: '$\\sin x=x-\\dfrac{x^3}{3!}+\\dfrac{x^5}{5!}-\\cdots$', read: '每多取一项，贴合的范围就往两边延伸一段；离原点越远，要的项越多',
  },
  {
    t: '$\\mathrm{e}^x$', f: Math.exp, xr: [-2.4, 2.4], yr: [-1, 11], xt: [-2, -1, 1, 2], yt: [2, 4, 6, 8],
    P: (x, n) => { let s = 0; for (let k = 0; k < n; k++) s += Math.pow(x, k) / fact(k); return s; },
    form: '$\\mathrm{e}^x=1+x+\\dfrac{x^2}{2!}+\\dfrac{x^3}{3!}+\\cdots$', read: '整条数轴都收敛，但在负半轴同样项数能贴住，正半轴需要更多项',
  },
  {
    t: '$\\ln(1+x)$', f: x => Math.log(1 + x), xr: [-0.92, 2.6], yr: [-3, 1.4], xt: [-0.5, 1, 2], yt: [-2, -1, 1],
    P: (x, n) => { let s = 0; for (let k = 1; k <= n; k++) s += Math.pow(-1, k + 1) * Math.pow(x, k) / k; return s; },
    form: '$\\ln(1+x)=x-\\dfrac{x^2}{2}+\\dfrac{x^3}{3}-\\cdots$', read: '只在 (−1,1] 上有效；x>1 时多项式根本不跟过来',
  },
  {
    t: '$\\dfrac{1}{1-x}$', f: x => 1 / (1 - x), xr: [-2.2, 2.2], yr: [-5, 5], xt: [-2, -1, 1, 2], yt: [-4, -2, 2, 4],
    P: (x, n) => { let s = 0; for (let k = 0; k < n; k++) s += Math.pow(x, k); return s; },
    form: '$\\dfrac{1}{1-x}=1+x+x^2+x^3+\\cdots$', read: '等比级数，|x|<1 有效；x=1 处函数本身断开，展开式也在那里失效',
  },
];

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, n: 3, x: 1.2 };
  const cN = B.chipM('阶数'), cE = B.chipM('截断误差'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = F[st.k];
    const m = B.mapFit(S.xr[0], S.xr[1], S.yr[0], S.yr[1], [46, 58, 564, 300], 14);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: S.xt, yt: S.yt });
    B.plot(S.f, m, { stroke: '#5cadff', 'stroke-width': 2.4, pad: 4, dom: x => Math.abs(x - 1) > 0.06 || st.k !== 3 });
    B.plot(x => S.P(x, st.n), m, { stroke: '#ff9e4a', 'stroke-width': 1.8, 'stroke-dasharray': '6 5', pad: 4 });
    const x0 = Math.max(S.xr[0] + 0.06, Math.min(S.xr[1] - 0.06, st.x));
    const yf = S.f(x0), yp = S.P(x0, st.n);
    if (isFinite(yf) && isFinite(yp)) {
      B.seg(V(m.px(x0), m.py(yf)), V(m.px(x0), m.py(yp)), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '3 4' });
      B.dot(V(m.px(x0), m.py(yf)), 5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.3 });
      B.dot(V(m.px(x0), m.py(yp)), 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
    }

    B.textM(V(636, 84), '蓝：原函数　橙：截断多项式', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 122), S.t, { size: 13, color: '#aebdd2', anchor: 'start' });
    B.tex(V(636, 166), S.form, { size: 11, color: '#ff9e4a', anchor: 'start', w: 250 });
    B.tex(V(636, 218), `$n=${st.n}$`, { size: 12.5, color: '#c084fc', anchor: 'start' });
    B.tex(V(636, 258), `$x=${fmt(x0, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
    B.textM(V(636, 302), S.read, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start', w: 215 });

    const err = Math.abs(yf - yp);
    cN(`$n=${st.n}$`);
    cE(Number.isFinite(err) ? `$=${err < 0.0005 ? '0.000' : fmt(err, 4)}$` : '无定义');
    if (!Number.isFinite(yf)) cJ('这一点已经在函数的定义域之外，展开式无从比较');
    else if (err < 0.0005) cJ('这一点的偏差已经小到读不出来，多项式与原函数在图上重合', 'ok');
    else cJ('橙线在这一点偏离蓝线：项数不够，或者这一点已在收敛区间之外');
  };

  const bts = F.map((S, i) => B.btnM(S.t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i));
    st.x = Math.min(S.xr[1] - 0.08, Math.max(S.xr[0] + 0.08, st.x)); B.render();
  }, { on: i === 0 }));
  B.slider('项数 n =', 1, 12, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.slider('x =', -2.2, 2.2, 0.02, st.x, v => { st.x = v; B.render(); }, 'x');
  B.hintM('拖 $n$：橙线一段段贴上蓝线；拖 $x$：看这一点还要几项才贴得住');
  B.render();
  return B;
}
