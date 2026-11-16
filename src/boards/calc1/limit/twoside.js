/* 图 极2 · 函数极限与左右极限机
   x 从左侧（绿点）与右侧（紫点）同时逼近 x₀，读两条曲线各自的落点：
   两个单侧极限都存在且相等，双侧极限才存在；相等之后再看 f(x₀) 取什么，才轮到连续。
   三个预设：连续（曲线与函数值接上）、可去（左右极限相等、函数值另给）、跳跃（左右极限不等）。
   空心圈画在曲线端点（该点不属于曲线），实心点画 f(x₀)。版面 46..746 × 58..358。 */
import { Board, V, fmt } from '../../../lib/board.js';

const P = [
  { n: '① $f(x)=x^2+1$', L: x => x * x + 1, lh: null, rh: null, fv: 2, kind: '连续',
    limL: 2, limR: 2, why: '左极限、右极限、函数值三者相等，曲线在 $x_0$ 处接上' },
  { n: '② $f(x)=\\dfrac{x^2-1}{x-1}$', L: x => x + 1, lh: 2, rh: 2, fv: 3, kind: '可去间断',
    limL: 2, limR: 2, why: '左右极限都等于 $2$，但 $f(1)=3$：曲线在 $(1,2)$ 处留一个洞，补上或改掉这个值就连续' },
  { n: '③ 分段：$x<1$ 取 $x+1$，$x>1$ 取 $x+3$', L: x => x + 1, R: x => x + 3, lh: 2, rh: 4, fv: 2.5, kind: '跳跃间断',
    limL: 2, limR: 4, why: '左右极限分别是 $2$ 与 $4$，不相等 —— 双侧极限不存在，差 $2$ 就是跳的高度' },
];
const X0 = 1;

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, d: 0.35 };
  const c1 = B.chipM('左极限'), c2 = B.chipM('右极限'), c3 = B.chipM('函数值'), cJ = B.chipM('判读');
  const m = B.mapFit(0.15, 2.25, -0.4, 5.4, [46, 58, 700, 300], 18);

  B.renderFn = () => {
    const S = P[st.k], d = st.d;
    B.grid({ ...m, sx: 1, sy: 1, lx: 0.5, ly: 1, xt: [0.5, 1, 1.5, 2] });

    // 曲线：左支 / 右支分开画，接缝处的洞由空心圈表示
    if (S.R) {
      B.plot(S.L, m, { dom: x => x < X0, stroke: '#5cadff', 'stroke-width': 2.2 });
      B.plot(S.R, m, { dom: x => x > X0, stroke: '#ff9e4a', 'stroke-width': 2.2 });
    } else {
      B.plot(S.L, m, { stroke: '#5cadff', 'stroke-width': 2.2 });
    }

    // 两个逼近点：绿点在左支、紫点在右支
    const xl = X0 - d, xr = X0 + d;
    const yl = S.L(xl), yr = (S.R || S.L)(xr);
    B.seg(V(m.px(xl), m.py(yl)), V(m.px(xl), m.py(0)), { stroke: '#4ade80', 'stroke-width': 1.2, 'stroke-dasharray': '4 3' });
    B.dot(V(m.px(xl), m.py(yl)), 5.5, { fill: '#4ade80', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.seg(V(m.px(xr), m.py(yr)), V(m.px(xr), m.py(0)), { stroke: '#c084fc', 'stroke-width': 1.2, 'stroke-dasharray': '4 3' });
    B.dot(V(m.px(xr), m.py(yr)), 5.5, { fill: '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(m.px(xl), m.py(0) + 34), `$x\\to 1^-$`, { size: 11.5, anchor: 'mid', color: '#4ade80' });
    B.tex(V(m.px(xr), m.py(0) + 34), `$x\\to 1^+$`, { size: 11.5, anchor: 'mid', color: '#c084fc' });

    // x₀ 的竖线与求值点：空心圈是曲线端点，实心点是 f(x₀)
    B.seg(V(m.px(X0), m.py(m.Y0)), V(m.px(X0), m.py(m.Y1)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 5', 'stroke-opacity': .7 });
    B.tex(V(m.px(X0), m.py(m.Y0) - 8), '$x_0=1$', { size: 12, anchor: 'mid', color: '#93a1b5' });
    if (S.lh !== null) B.dot(V(m.px(X0), m.py(S.lh)), 5, { fill: '#0a0d14', stroke: '#5cadff', 'stroke-width': 2 });
    if (S.rh !== null) B.dot(V(m.px(X0), m.py(S.rh)), 5, { fill: '#0a0d14', stroke: '#ff9e4a', 'stroke-width': 2 });
    B.dot(V(m.px(X0), m.py(S.fv)), 4.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(m.px(X0) + 11, m.py(S.fv) + 4), '$f(1)$', { size: 11.5, anchor: 'start', color: '#ffd166' });

    // 左右极限在 y 轴方向上各画一条短横，读数值
    B.seg(V(m.px(0.86), m.py(S.limL)), V(m.px(X0), m.py(S.limL)), { stroke: '#4ade80', 'stroke-width': 1.1, 'stroke-dasharray': '2 4', 'stroke-opacity': .75 });
    B.seg(V(m.px(X0), m.py(S.limR)), V(m.px(1.14), m.py(S.limR)), { stroke: '#c084fc', 'stroke-width': 1.1, 'stroke-dasharray': '2 4', 'stroke-opacity': .75 });

    c1(`$f(${fmt(xl, 2)})=${fmt(yl, 3)}\\to${fmt(S.limL, 0)}$`);
    c2(`$f(${fmt(xr, 2)})=${fmt(yr, 3)}\\to${fmt(S.limR, 0)}$`);
    c3(`$f(1)=${fmt(S.fv, 1)}$`);
    cJ(S.why, S.lh === S.rh && S.fv === S.lh ? 'ok' : '');
  };

  const bts = P.map((S, i) => B.btnM(S.n, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('离 x₀ 的距离 δ', 0.03, 0.85, 0.01, st.d, v => { st.d = v; B.render(); }, 'd');

  B.hintM('拖小 δ：两个彩色点从两侧滑向 $x_0$；极限看的是它们靠近的那两个高度，与实心点 $f(1)$ 无关');
  B.render();
  return B;
}
