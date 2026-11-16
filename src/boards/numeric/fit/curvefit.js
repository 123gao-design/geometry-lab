/* 图 拟2 · 非线性拟合与线性化
   指数型 y=A·e^{bx} 的数据，纵坐标取对数后变成直线 ln y = ln A + b·x；
   幂函数 y=A·x^b 的数据，两个坐标都取对数变成直线 ln y = ln A + b·ln x。
   直线用最小二乘拟合，再把截距还原成 A。左图是原坐标里的贴合情况，右图是取对数后的直线。 */
import { Board, V, mk } from '../../../lib/board.js';

const XS = [0.5, 0.9, 1.3, 1.7, 2.1, 2.5];
const rnd = i => {
  const t = Math.sin((i + 1) * 12.9898 + 4.1) * 43758.5453;
  return (t - Math.floor(t)) * 2 - 1;
};

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { mode: 0, A: 1.2, b: 0.55 };
  const cA = B.chipM('回代得 $A$'), cB = B.chipM('回代得 $b$'), cR = B.chipM('变换后残差'), cJ = B.chipM('判读');

  const model = (x, A, b) => (st.mode === 0 ? A * Math.exp(b * x) : A * Math.pow(x, b));
  const data = () => XS.map((x, i) => {
    const y = model(x, st.A, st.b) * (1 + 0.045 * rnd(i));
    return { x, y };
  });

  const mL = B.mapFit(0, 2.85, 0, 15.5, [44, 58, 340, 298], 20);

  B.renderFn = () => {
    const D = data();
    const mL = B.mapFit(0, 2.85, 0, st.mode === 0 ? 17 : 4.8, [44, 58, 340, 298], 20);
    // 变换后的坐标
    const T = D.map(p => (st.mode === 0 ? { u: p.x, v: Math.log(p.y) } : { u: Math.log(p.x), v: Math.log(p.y) }));
    const n = T.length;
    const ub = T.reduce((s, p) => s + p.u, 0) / n, vb = T.reduce((s, p) => s + p.v, 0) / n;
    const suv = T.reduce((s, p) => s + (p.u - ub) * (p.v - vb), 0);
    const suu = T.reduce((s, p) => s + (p.u - ub) * (p.u - ub), 0);
    const k = suv / suu, c = vb - k * ub;          // v = k·u + c
    const A = Math.exp(c), b = k;
    const res = T.reduce((s, p) => { const d = p.v - (k * p.u + c); return s + d * d; }, 0);

    // —— 左图：原坐标 ——
    B.grid({ ...mL, sx: .5, sy: st.mode === 0 ? 2 : 1, lx: .5, ly: st.mode === 0 ? 2 : 1 });
    B.plot(x => model(x, A, b), mL, { stroke: '#ffd166', 'stroke-width': 2.4, x0: 0.05, x1: 2.85 });
    D.forEach(p => B.dot(V(mL.px(p.x), mL.py(p.y)), 4.8, { fill: '#5cadff' }));
    B.textM(V(mL.px(2.8), mL.py(0) - 8), '原坐标', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'end' });

    // —— 右图：变换后的直线 ——
    const us = T.map(p => p.u), vs = T.map(p => p.v);
    const u0 = Math.min(...us) - 0.25, u1 = Math.max(...us) + 0.25;
    const v0 = Math.min(...vs) - 0.4, v1 = Math.max(...vs) + 0.4;
    const mR = B.mapFit(u0, u1, v0, v1, [452, 58, 322, 298], 20);
    B.grid({ ...mR, sx: .5, sy: 1, lx: .5, ly: 1 });
    B.plot(u => k * u + c, mR, { stroke: '#ffd166', 'stroke-width': 2.2 });
    T.forEach(p => B.dot(V(mR.px(p.u), mR.py(p.v)), 4.8, { fill: '#c084fc' }));
    B.textM(V(mR.px(u1) + 2, mR.py(v1) + 22), st.mode === 0 ? '$x$' : '$\\ln x$', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'end' });
    B.textM(V(mR.px(u0) + 4, mR.py(v1) - 2), '$\\ln y$', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(mR.px((u0 + u1) / 2), 392), st.mode === 0 ? '横轴是 $x$，纵轴是 $\\ln y$' : '两轴都取了对数', { 'font-size': 11.5, fill: '#8fa3bd' });

    // 左图上方留白处放读数，右图只画点与直线
    B.textM(V(70, 96), st.mode === 0 ? '$\\ln y=\\ln A+b\\,x$' : '$\\ln y=\\ln A+b\\ln x$', { 'font-size': 15, fill: '#c084fc', 'text-anchor': 'start' });
    B.textM(V(70, 136), `$\\ln A\\approx${c.toFixed(3)},\\quad b\\approx${k.toFixed(3)}$`, { 'font-size': 13, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM(V(70, 178), `$\\hat A=${A.toFixed(3)}$`, { 'font-size': 15, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(70, 214), `$\\sum(v-\\hat v)^2=${res.toFixed(4)}$`, { 'font-size': 12.5, fill: '#ff7b8a', 'text-anchor': 'start' });
    B.textM(V(70, 250), `真实 $A_0=${st.A.toFixed(2)},\\ b_0=${st.b.toFixed(2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    cA(`$${A.toFixed(3)}$`);
    cB(`$${k.toFixed(3)}$`);
    cR(`$${res.toFixed(4)}$`);
    cJ(st.mode === 0
      ? '紫点在右图排成一条直线：纵轴取对数就把指数曲线拉直了，斜率就是 b，截距的指数就是 A'
      : '两轴都取对数后幂函数才变成直线；只对 y 取对数得到的是对数函数，不是幂函数');
  };

  const pre = [];
  const mark = () => pre.forEach((x, i) => x.classList.toggle('on', st.mode === i));
  ['指数型 $y=Ae^{bx}$', '幂函数 $y=Ax^{b}$'].forEach((t, i) => pre.push(B.btnM(t, () => { st.mode = i; mark(); B.render(); })));
  mark();

  B.slider('真实 A₀', 0.6, 2.0, 0.1, st.A, v => { st.A = v; B.render(); }, 'A');
  B.slider('真实 b₀', 0.25, 0.85, 0.05, st.b, v => { st.b = v; B.render(); }, 'b');

  B.hint('把 b₀ 调大：原图越翘，右图的直线越陡，斜率读数跟着变');
  B.render();
  return B;
}
