/* 图 误2 · 误差的传播与条件数
   输入 x₀ 带着误差 Δx，经过 y=f(x) 之后输出误差由斜率放大：|Δy|≈|f'(x₀)|·Δx。
   蓝色竖带是输入的误差范围，右侧红条是它被函数放大（或压缩）后落到 y 轴上的范围。
   各函数形状不同，同样的输入误差换来的输出误差可以差得很远。 */
import { Board, V, mk } from '../../../lib/board.js';

const PRE = [
  { n: 'x²', t: 'x^2', f: x => x * x, df: x => 2 * x, xv: [0.2, 3.2], yv: [-1, 9.5], C: () => 2 },
  { n: '√x', t: '\\sqrt x', f: Math.sqrt, df: x => 1 / (2 * Math.sqrt(x)), xv: [0.2, 3.2], yv: [-0.5, 2.1], C: () => .5 },
  { n: '1/x', t: '\\dfrac1x', f: x => 1 / x, df: x => -1 / (x * x), xv: [0.35, 3.2], yv: [-0.5, 3.6], C: () => 1 },
  { n: 'x−1', t: 'x-1', f: x => x - 1, df: () => 1, xv: [0.2, 3.2], yv: [-1.4, 2.6], C: (x, y) => Math.abs(x / y) },
];

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { p: 0, x0: 1.6, h: 0.1 };
  const cX = B.chipM('输入误差'), cY = B.chipM('输出误差'), cC = B.chipM('条件数'), cJ = B.chipM('判读');
  let cur = null;

  B.renderFn = () => {
    const P = PRE[st.p];
    const lo = Math.max(P.xv[0], 1e-6);
    const x0 = Math.min(Math.max(st.x0, lo + 2 * st.h), P.xv[1] - 2 * st.h);
    const h = st.h;
    const xa = Math.max(x0 - h, lo), xb = x0 + h;
    const y0 = P.f(x0), ya = P.f(xa), yb = P.f(xb);
    const dy = Math.abs(yb - ya);
    const k = P.df(x0);
    const C = Math.abs(x0 * k / y0);
    const relX = h / x0, relY = dy / Math.abs(y0);

    const m = B.mapFit(P.xv[0], P.xv[1], P.yv[0], P.yv[1], [50, 56, 500, 300], 22);
    B.grid({ ...m, sx: .5, sy: .5, lx: 1, ly: 1 });
    B.plot(P.f, m, { stroke: '#5cadff', 'stroke-width': 2.2 });

    // 输入的误差竖带
    B.dyn.appendChild(mk('rect', {
      x: m.px(xa), y: m.py(m.Y1), width: Math.max(m.px(xb) - m.px(xa), 1), height: m.py(m.Y0) - m.py(m.Y1),
      fill: '#5cadff', 'fill-opacity': .12,
    }, B.dyn));

    // 切线（橙色虚线）与 x₀ 竖线
    const tan = x => y0 + k * (x - x0);
    B.dyn.appendChild(mk('line', {
      x1: m.px(x0 - 3.5 * h), y1: m.py(tan(x0 - 3.5 * h)), x2: m.px(x0 + 3.5 * h), y2: m.py(tan(x0 + 3.5 * h)),
      stroke: '#ff9e4a', 'stroke-width': 2, 'stroke-dasharray': '7 4',
    }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: m.px(x0), y1: m.py(y0), x2: m.px(x0), y2: m.py(m.Y0), stroke: '#c084fc', 'stroke-width': 1.2, 'stroke-dasharray': '3 4' }, B.dyn));

    // 输入范围落在 x 轴上的一段
    B.dyn.appendChild(mk('line', { x1: m.px(xa), y1: m.py(0), x2: m.px(xb), y2: m.py(0), stroke: '#5cadff', 'stroke-width': 5, 'stroke-opacity': .85, 'stroke-linecap': 'round' }, B.dyn));
    B.textM(V(m.px(x0), m.py(0) - 22), '$\\Delta x$', { 'font-size': 12, fill: '#5cadff' });

    // 输出范围画成右侧竖条
    const bx = Math.max(m.px(xb), m.px(xa)) + 18;
    B.dyn.appendChild(mk('line', { x1: bx, y1: m.py(Math.min(ya, yb)), x2: bx, y2: m.py(Math.max(ya, yb)), stroke: '#ff7b8a', 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-opacity': .9 }, B.dyn));
    B.textM(V(bx + 16, m.py((ya + yb) / 2)), '$\\Delta y$', { 'font-size': 12, fill: '#ff7b8a', 'text-anchor': 'start' });

    // 当前点由手柄画在独立层上，这里只记下映射供手柄换算
    cur = { m, x: x0, y: y0, lo: lo + 2 * h, hi: P.xv[1] - 2 * h };
    [xa, xb].forEach((x, i) => B.dot(V(m.px(x), m.py(i === 0 ? ya : yb)), 4, { fill: '#5cadff' }));

    // 右栏
    B.textM(V(596, 104), `$y=${P.t}$`, { 'font-size': 18, fill: '#5cadff', 'text-anchor': 'start' });
    B.textM(V(596, 150), `$f'(x_0)=${k.toFixed(2)}$`, { 'font-size': 14, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(596, 194), `$|\\Delta y|\\approx|f'(x_0)|\\,\\Delta x=${(Math.abs(k) * h).toFixed(3)}$`, { 'font-size': 13, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(596, 238), `$\\dfrac{|\\Delta y/y_0|}{|\\Delta x/x_0|}\\approx${isFinite(C) ? C.toFixed(2) : '\\infty'}$`, { 'font-size': 14, fill: '#c084fc', 'text-anchor': 'start' });
    B.textM(V(596, 286), `输入 $${(relX * 100).toFixed(1)}\\%$ 的误差`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(596, 312), `换到输出是 $${(relY * 100).toFixed(1)}\\%$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    cX(`$\\Delta x=${h.toFixed(2)}$`);
    cY(`$\\Delta y=${dy.toFixed(3)}$`);
    cC(`$${isFinite(C) ? C.toFixed(2) : '\\infty'}$`);
    cJ(st.p === 0 ? '乘方把相对误差翻倍：输入错 1%，输出就错 2%'
      : st.p === 1 ? '开方把相对误差压到一半：输入错 1%，输出只错 0.5%'
        : st.p === 2 ? '取倒数不放大相对误差，但 x₀ 越小，同一条 Δx 换来的 Δy 越大'
          : Math.abs(y0) < 0.35 ? '接近减法的相消：y₀ 很小，绝对误差没变，相对误差却被放得很大'
            : '减去 1 之后 y₀ 变小，相对误差按 x₀/y₀ 的倍数放大');
  };

  const pre = [];
  const mark = () => pre.forEach((b, i) => b.classList.toggle('on', st.p === i));
  PRE.forEach((p, i) => pre.push(B.btn(p.n, () => { st.p = i; mark(); B.render(); })));
  mark();

  B.slider('x₀', 0.4, 3.0, 0.05, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.slider('输入误差 Δx', 0.01, 0.2, 0.01, st.h, v => { st.h = v; B.render(); }, 'dx');

  B.handle({
    color: '#ffd166', r: 8, label: 'P',
    get: () => (cur ? V(cur.m.px(cur.x), cur.m.py(cur.y)) : V(-20, -20)),
    set: p => {
      if (!cur) return;
      const u = cur.m.px(1) - cur.m.px(0);
      st.x0 = Math.min(Math.max((p.x - cur.m.px(0)) / u, cur.lo), cur.hi);
    },
  });

  B.hint('换个函数同一份 Δx 得到不同的 Δy；切线越陡，输出误差越大');
  B.render();
  return B;
}
