/* 图 统3 · 一元线性回归
   平面上的散点由一条直线去贴近，最小二乘法让「竖直残差的平方和」最小，这条直线的斜率与截距就唯一确定。
   金色点可以拖动：拖动它，回归直线整体跟着转动，右侧读出斜率、相关系数与残差平方和。 */
import { Board, V, mk } from '../../../lib/board.js';

const PTS = [[1, 1.2], [2, 1.7], [3, 2.5], [4, 3.0], [5, 4.3], [6, 4.6], [7, 5.5], [8, 6.3]];

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { x: 2.5, y: 4.2 };
  const cE = B.chipM('回归方程'), cR = B.chipM('相关系数'), cS = B.chipM('残差平方和'), cJ = B.chipM('判读');

  const m = B.mapFit(0, 10, 0, 10, [96, 70, 560, 280], 0);

  B.renderFn = () => {
    const pts = [...PTS, [st.x, st.y]];
    const n = pts.length;
    const mx = pts.reduce((a, p) => a + p[0], 0) / n;
    const my = pts.reduce((a, p) => a + p[1], 0) / n;
    const sxy = pts.reduce((a, p) => a + (p[0] - mx) * (p[1] - my), 0);
    const sxx = pts.reduce((a, p) => a + (p[0] - mx) ** 2, 0);
    const syy = pts.reduce((a, p) => a + (p[1] - my) ** 2, 0);
    const b = sxy / sxx, a = my - b * mx;
    const r = sxy / Math.sqrt(sxx * syy);
    const sse = pts.reduce((s, p) => s + (p[1] - (a + b * p[0])) ** 2, 0);

    B.dyn.appendChild(mk('rect', { x: 96, y: 70, width: 560, height: 280, fill: 'rgba(139,163,189,.04)', stroke: 'none' }, B.dyn));
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEach(i => {
      B.dyn.appendChild(mk('line', { x1: m.px(i), y1: 70, x2: m.px(i), y2: 350, stroke: '#3f5f8f', 'stroke-width': 1, 'stroke-opacity': .45 }, B.dyn));
      B.dyn.appendChild(mk('line', { x1: 96, y1: m.py(i), x2: 656, y2: m.py(i), stroke: '#3f5f8f', 'stroke-width': 1, 'stroke-opacity': .45 }, B.dyn));
      B.textM(V(m.px(i), 366), `$${i}$`, { 'font-size': 10, fill: '#5c6a80' });
      B.textM(V(84, m.py(i) + 3), `$${i}$`, { 'font-size': 10, fill: '#5c6a80', 'text-anchor': 'end' });
    });
    B.text(V(676, 366), 'x', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'start' });
    B.text(V(96, 52), 'y', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'start' });

    // 回归直线：取视野内两端
    const x0 = 0, x1 = 10;
    B.dyn.appendChild(mk('line', {
      x1: m.px(x0), y1: m.py(a + b * x0), x2: m.px(x1), y2: m.py(a + b * x1),
      stroke: '#ffd166', 'stroke-width': 2.2,
    }, B.dyn));

    // 残差段
    pts.forEach(([x, y]) => {
      const yh = a + b * x;
      B.dyn.appendChild(mk('line', { x1: m.px(x), y1: m.py(y), x2: m.px(x), y2: m.py(yh), stroke: '#ff7b8a', 'stroke-width': 1.6, 'stroke-dasharray': '3 3', 'stroke-opacity': .9 }, B.dyn));
    });
    pts.forEach(([x, y], i) => B.dot(V(m.px(x), m.py(y)), 4.8, {
      fill: i === pts.length - 1 ? '#ffd166' : '#5cadff', 'fill-opacity': .95,
    }));

    // 均值点
    B.dot(V(m.px(mx), m.py(my)), 3.4, { fill: '#67e8f9' });

    cE(`$\\hat y=${a.toFixed(2)}${b >= 0 ? '+' : '-'}${Math.abs(b).toFixed(2)}x$`);
    cR(`$r=${r.toFixed(3)}$`);
    cS(`$\\sum(y_i-\\hat y_i)^2=${sse.toFixed(2)}$`);
    cJ(Math.abs(sse) < 4 ? '点都贴在直线附近，残差很小，线性拟合得不错'
      : st.y > a + b * st.x + 1.4 ? '把金色点往上拖：直线被拉向它，残差平方和变大'
        : st.y < a + b * st.x - 1.4 ? '把金色点往下拖：直线被拉向它，残差平方和变大'
          : '拖动金色点改变它的位置，直线整体跟着转动，残差平方和随之变化');
  };

  B.handle({
    color: '#ffd166', r: 8, label: 'P',
    get: () => V(m.px(st.x), m.py(st.y)),
    set: p => {
      st.x = Math.max(0, Math.min(10, (p.x - m.px(0)) / (m.px(1) - m.px(0))));
      st.y = Math.max(0, Math.min(10, (m.py(0) - p.y) / (m.py(0) - m.py(1))));
    },
  });

  B.hint('回归直线过均值点，拖动金色点看直线的转动与残差平方和的变化');
  B.render();
  return B;
}
