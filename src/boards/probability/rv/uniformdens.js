/* 图 分3a · 连续型随机变量与密度曲线
   连续型随机变量不再列分布列，改用密度曲线：曲线与 x 轴围出的面积就是概率。
   这里取 [a,b] 上的均匀分布，密度在区间内是常数 1/(b−a)、区间外为零。
   拖动 c、d，金色面积等于 P(c≤X≤d)，恰好是区间长度占比。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { a: 2, b: 8, c: 3.2, d: 5.6 };
  const cH = B.chipM('密度高度'), cP = B.chipM('区间概率'), cT = B.chipM('总面积'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const { a, b } = st;
    const c = Math.min(st.c, st.d - .2), d = Math.max(st.d, st.c + .2);
    const h = 1 / (b - a);

    const m = B.mapFit(0, 10, -.06, 1.34, [96, 62, 656, 258]);
    B.grid({ ...m, sx: 1, sy: .2, lx: 1, ly: .2, axLab: 'x', ayLab: 'y' });

    // 密度曲线下的整块面积
    B.dyn.appendChild(mk('rect', {
      x: m.px(a), y: m.py(h), width: m.px(b) - m.px(a), height: m.py(0) - m.py(h),
      fill: 'rgba(92,173,255,.14)', stroke: 'none',
    }, B.dyn));
    // 阴影区间
    const c1 = Math.max(c, a), d1 = Math.min(d, b);
    if (d1 > c1) {
      B.dyn.appendChild(mk('rect', {
        x: m.px(c1), y: m.py(h), width: m.px(d1) - m.px(c1), height: m.py(0) - m.py(h),
        fill: 'rgba(255,209,102,.38)', stroke: 'none',
      }, B.dyn));
    }
    // 曲线：区间内高为 h，区间外为 0
    const path = [
      `M ${m.px(0)} ${m.py(0)}`, `L ${m.px(a)} ${m.py(0)}`, `L ${m.px(a)} ${m.py(h)}`,
      `L ${m.px(b)} ${m.py(h)}`, `L ${m.px(b)} ${m.py(0)}`, `L ${m.px(10)} ${m.py(0)}`,
    ].join(' ');
    B.dyn.appendChild(mk('path', { d: path, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn));
    [a, b].forEach(x => B.dyn.appendChild(mk('line', {
      x1: m.px(x), y1: m.py(0), x2: m.px(x), y2: m.py(h), stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4',
    }, B.dyn)));
    B.textM(V(m.px((a + b) / 2), m.py(h) - 12), `$f(x)=\\dfrac{1}{b-a}$`, { 'font-size': 12, fill: '#5cadff' });
    [c, d].forEach(x => {
      if (x < 0 || x > 10) return;
      B.dyn.appendChild(mk('line', { x1: m.px(x), y1: m.py(0), x2: m.px(x), y2: m.py(0) - 8, stroke: '#ffd166', 'stroke-width': 2 }, B.dyn));
    });

    cH(`$${h.toFixed(3)}$`);
    cP(`$${((d1 - c1) / (b - a)).toFixed(3)}$`);
    cT('$1$');
    cJ(d1 <= c1
      ? '阴影区间落在分布区间之外，这段的概率为 0'
      : Math.abs(d1 - c1 - (b - a)) < 1e-9
        ? '阴影盖满整个分布区间，概率为 1，与总面积相等'
        : `阴影占整块面积的比例就是概率；单个点的宽度为零，$P(X=x_0)=0$`);
  };

  B.slider('左端 a', 0, 4.5, .1, st.a, v => { st.a = v; B.render(); }, 'a');
  B.slider('右端 b', 5.5, 10, .1, st.b, v => { st.b = v; B.render(); }, 'b');
  B.slider('区间左 c', 0, 9.5, .1, st.c, v => {
    st.c = v; if (st.d <= v + .2) st.d = Math.min(10, v + .2); B.render();
  }, 'c');
  B.slider('区间右 d', .2, 10, .1, st.d, v => {
    st.d = v; if (st.c >= v - .2) st.c = Math.max(0, v - .2); B.render();
  }, 'd');

  B.hint('概率是曲线下的面积；均匀分布的密度高度由区间长度决定');
  B.render();
  return B;
}
