/* 图 迭1 · 二分法
   f(x)=x³−x−1 在 [1,2] 两端异号，取中点算 f 的符号，把不含根的那一半扔掉。
   每折一次区间长度减半，所以 n 步之后误差一定不超过 (b−a)/2ⁿ 的一半，与函数形状无关。 */
import { Board, V, mk } from '../../../lib/board.js';

const f = x => x * x * x - x - 1;
const ROOT = 1.324717957244746;

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { a: 1, b: 2, n: 0, k: 3, hist: [] };
  const cI = B.chipM('当前区间'), cM = B.chipM('中点'), cB = B.chipM('误差上界'), cJ = B.chipM('判读');

  const m = B.mapFit(0.7, 2.3, -2.4, 5.6, [46, 56, 500, 300], 20);

  const step = () => {
    const { a, b } = st;
    const eps = Math.pow(10, -st.k);
    if ((b - a) / 2 <= eps * (1 + 1e-12)) return;
    const mid = (a + b) / 2, fm = f(mid);
    const sgn = fm > 0 ? 1 : -1;
    st.hist.push({ a, b, mid, sgn, n: st.n + 1 });
    if (st.hist.length > 12) st.hist.shift();
    if (sgn === (f(a) > 0 ? 1 : -1)) st.a = mid; else st.b = mid;
    st.n += 1;
    B.render();
  };

  B.renderFn = () => {
    const { a, b } = st, mid = (a + b) / 2, fm = f(mid);
    const eps = Math.pow(10, -st.k);
    const done = (b - a) / 2 <= eps * (1 + 1e-12);

    B.grid({ ...m, sx: .25, sy: 1, lx: .5, ly: 1 });
    B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.2 });

    // 保留区间的竖带
    B.dyn.appendChild(mk('rect', {
      x: m.px(a), y: m.py(m.Y1), width: Math.max(m.px(b) - m.px(a), 1.5), height: m.py(m.Y0) - m.py(m.Y1),
      fill: '#5cadff', 'fill-opacity': .1,
    }, B.dyn));

    // 真根（折过两次之后才标出）
    if (st.n >= 2) {
      B.dyn.appendChild(mk('line', { x1: m.px(ROOT), y1: m.py(m.Y1), x2: m.px(ROOT), y2: m.py(0), stroke: '#4ade80', 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }, B.dyn));
      B.textM(V(m.px(ROOT) + 6, m.py(0) - 10), '真根', { 'font-size': 11, fill: '#4ade80', 'text-anchor': 'start' });
    }

    // 端点竖线（画在轴上方，避免压住刻度数字）
    [[a, 'a'], [b, 'b']].forEach(([x, t]) => {
      B.dyn.appendChild(mk('line', { x1: m.px(x), y1: m.py(0) - 26, x2: m.px(x), y2: m.py(0) - 2, stroke: '#ff9e4a', 'stroke-width': 2.2 }, B.dyn));
      B.textM(V(m.px(x), m.py(0) - 36), `$${t}$`, { 'font-size': 12.5, fill: '#ff9e4a' });
    });

    // 中点
    B.dyn.appendChild(mk('line', { x1: m.px(mid), y1: m.py(0), x2: m.px(mid), y2: m.py(fm), stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-dasharray': '4 3' }, B.dyn));
    B.dot(V(m.px(mid), m.py(0)), 5.5, { fill: '#c084fc' });
    B.dot(V(m.px(mid), m.py(fm)), 4, { fill: '#c084fc', 'fill-opacity': .8 });
    B.textM(V(m.px(mid), m.py(0) + 44), '$m$', { 'font-size': 12.5, fill: '#c084fc' });

    // 右栏：迭代表
    B.textM(V(596, 86), '第 $n$ 步后的区间', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    ['n', 'a', 'b', '中点'].forEach((t, i) => {
      B.textM(V([600, 650, 710, 766][i], 116), `$${t}$`, { 'font-size': 11.5, fill: '#5c6a80', 'text-anchor': i === 0 ? 'start' : 'middle' });
    });
    st.hist.slice(-7).forEach((r, i) => {
      const y = 140 + i * 24;
      B.textM(V(600, y), `$${r.n}$`, { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.textM(V(650, y), `$${r.a.toFixed(3)}$`, { 'font-size': 11, fill: '#aebdd2' });
      B.textM(V(710, y), `$${r.b.toFixed(3)}$`, { 'font-size': 11, fill: '#aebdd2' });
      B.textM(V(766, y), `$${r.mid.toFixed(3)}$`, { 'font-size': 11, fill: '#c084fc' });
    });

    cI(`$[${a.toFixed(3)},\\ ${b.toFixed(3)}]$`);
    cM(`$m=${mid.toFixed(3)}$，$f(m)${fm > 0 ? '>0' : '<0'}$`);
    cB(`$\\dfrac{b-a}{2}=${((b - a) / 2).toFixed(4)}$`);
    cJ(done
      ? `区间半长已不超过 ${eps}，中点 ${mid.toFixed(4)} 就是满足精度的近似根`
      : '看 f(m) 与 f(a) 是否同号：同号说明根在右半，异号说明根在左半');
  };

  B.btn('折半一次', step, { pri: true });
  B.btn('重新开始', () => { st.a = 1; st.b = 2; st.n = 0; st.hist = []; B.render(); });
  B.slider('精度 10^-k', 1, 6, 1, st.k, v => { st.k = v; B.render(); }, 'k');

  B.hint('每点一次区间就短一半，误差上界与 f 的形状无关，只由初始区间和步数决定');
  B.render();
  return B;
}
