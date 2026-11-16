/* 图 迭2 · 牛顿迭代
   在当前点作切线，切线与 x 轴的交点就是下一个近似值。
   根附近每迭代一次有效数字大约翻倍，所以比二分法快得多；但初值离根太远、或落在切线水平的地方，也会跑飞。 */
import { Board, V, mk } from '../../../lib/board.js';

const f = x => x * x * x - x - 1;
const df = x => 3 * x * x - 1;
const ROOT = 1.324717957244746;
const MAX = 8;

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { x0: 2.0, xs: [2.0] };
  const cX = B.chipM('当前 $x_n$'), cF = B.chipM('函数值'), cN = B.chipM('下一个 $x_{n+1}$'), cJ = B.chipM('判读');

  const m = B.mapFit(1.0, 2.25, -1.6, 5.4, [46, 56, 480, 300], 18);

  const nextOf = x => { const d = df(x); return Math.abs(d) < 1e-6 ? NaN : x - f(x) / d; };

  B.renderFn = () => {
    const xn = st.xs[st.xs.length - 1];
    const yn = f(xn), k = df(xn), xn1 = nextOf(xn);

    B.grid({ ...m, sx: .25, sy: 1, lx: .5, ly: 1 });
    B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.2 });

    // 已走过的点：x 轴上的小点
    st.xs.forEach((x, i) => {
      B.dot(V(m.px(x), m.py(0)), i === st.xs.length - 1 ? 5.5 : 3.5, {
        fill: i === st.xs.length - 1 ? '#ffd166' : '#8fa3bd', 'fill-opacity': .9,
      });
    });

    // 当前点、切线、交点
    B.dyn.appendChild(mk('line', { x1: m.px(xn), y1: m.py(yn), x2: m.px(xn), y2: m.py(0), stroke: '#c084fc', 'stroke-width': 1.3, 'stroke-dasharray': '4 3' }, B.dyn));
    // 切线过 P：从与 x 轴的交点出发，穿过 P 再往前延一小段
    const tn = x => yn + k * (x - xn);
    const lo = Math.max((isFinite(xn1) ? Math.min(xn1, xn) : xn - 0.7) - 0.05, 1.0);
    let hi = Math.min((isFinite(xn1) ? Math.max(xn1, xn) : xn) + 0.12, 2.24);
    if (k > 1e-6) hi = Math.min(hi, xn + (5.1 - yn) / k);
    if (hi > lo) {
      B.dyn.appendChild(mk('line', {
        x1: m.px(lo), y1: m.py(tn(lo)), x2: m.px(hi), y2: m.py(tn(hi)),
        stroke: '#ffd166', 'stroke-width': 1.8,
      }, B.dyn));
    }
    B.dot(V(m.px(xn), m.py(yn)), 6, { fill: '#ffd166' });
    if (isFinite(xn1)) {
      B.dot(V(m.px(xn1), m.py(0)), 5.5, { fill: '#5cadff' });
      B.textM(V(m.px(xn1) + 10, m.py(0) - 14), '$x_{n+1}$', { 'font-size': 12, fill: '#5cadff', 'text-anchor': 'start' });
    }

    // 右栏：迭代表
    B.textM(V(566, 84), '迭代序列', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    ['n', 'xₙ', '|xₙ−真根|'].forEach((s, i) => B.textM(V([574, 630, 712][i], 112), `$${s}$`, { 'font-size': 11.5, fill: '#5c6a80', 'text-anchor': 'start' }));
    st.xs.slice(-7).forEach((x, i) => {
      const y = 138 + i * 24;
      const e = Math.abs(x - ROOT);
      const ee = e > 0 ? Math.floor(Math.log10(e)) : 0;
      const em = e > 0 ? e / Math.pow(10, ee) : 0;
      B.textM(V(574, y), `$${i}$`, { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.textM(V(630, y), `$${x.toFixed(4)}$`, { 'font-size': 11, fill: '#aebdd2', 'text-anchor': 'start' });
      B.textM(V(712, y), e > 0 ? `$${em.toFixed(1)}\\times10^{${ee}}$` : '$0$', { 'font-size': 11, fill: '#4ade80', 'text-anchor': 'start' });
    });

    cX(`$${xn.toFixed(4)}$`);
    cF(`$${yn.toFixed(4)}$`);
    cN(isFinite(xn1) ? `$${xn1.toFixed(4)}$` : '切线水平，这一步无定义');
    cJ(!isFinite(xn1) ? '切线几乎水平，交点跑到无穷远，换个初值再来'
      : Math.abs(xn1 - xn) > 2 ? '这一步跨得太远，迭代已经跑飞，说明初值取得不好'
        : Math.abs(yn) < 1e-3 ? '函数值已经很小，再走一步有效数字还会再翻一倍'
          : '切线与 x 轴的交点比当前点更靠近根，误差每次大致按平方缩小');
  };

  B.btn('迭代一步', () => {
    const xn = st.xs[st.xs.length - 1];
    const nn = nextOf(xn);
    if (!isFinite(nn) || st.xs.length > MAX) return;
    st.xs.push(nn);
    B.render();
  }, { pri: true });
  B.btn('重置', () => { st.xs = [st.x0]; B.render(); });

  B.handle({
    color: '#ffd166', r: 8, label: 'P',
    get: () => {
      const x = st.xs[st.xs.length - 1];
      return V(m.px(x), m.py(f(x)));
    },
    set: p => {
      const u = m.px(1) - m.px(0);
      st.x0 = Math.min(Math.max((p.x - m.px(0)) / u, 1.05), 2.2);
      st.xs = [st.x0];
    },
  });

  B.hint('拖动金点换初值，再一步步入：根附近每步有效数字大约翻倍');
  B.render();
  return B;
}
