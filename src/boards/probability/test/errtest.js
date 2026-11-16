/* 图 检1 · 假设检验与两类错误
   原假设 H₀：总体均值为 0；备择假设 H₁：均值为 δ。两种情形各画一条正态密度的钟形曲线，
   竖直的橙色线是临界值 c，右侧是拒绝域。α 是 H₀ 成立时误落拒绝域的概率，β 是 H₁ 成立时没能落进拒绝域的概率。
   把 c 往右移，α 变小而 β 变大 —— 两类错误此消彼长。 */
import { Board, V, mk } from '../../../lib/board.js';

function erf(x) {
  const s = Math.sign(x); x = Math.abs(x);
  const t = 1 / (1 + .3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - .284496736) * t + .254829592) * t) * Math.exp(-x * x);
  return s * y;
}
const Phi = x => .5 * (1 + erf(x / Math.SQRT2));
const dens = (x, mu) => Math.exp(-((x - mu) ** 2) / 2) / Math.sqrt(2 * Math.PI);

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { c: 1.6, d: 1.5 };
  const cA = B.chipM('α 第一类错误'), cB = B.chipM('β 第二类错误'), cJ = B.chipM('判读');

  const X0 = 88, XW = 700, YB = 330, xa = -2.2, xb = 6.2;
  const px = x => X0 + (x - xa) / (xb - xa) * XW;
  const S = 470;
  const py = d => YB - d * S;

  const shade = (mu, a, b, color, op) => {
    const pts = [];
    for (let x = a; x <= b + 1e-9; x += .04) pts.push(`${px(x)},${py(dens(x, mu))}`);
    const path = `M ${px(a)},${YB} L ${pts.join(' L ')} L ${px(b)},${YB} Z`;
    B.dyn.appendChild(mk('path', { d: path, fill: color, 'fill-opacity': op, stroke: 'none' }, B.dyn));
  };
  const curve = (mu, color) => {
    const pts = [];
    for (let x = xa; x <= xb + 1e-9; x += .02) pts.push(`${px(x)},${py(dens(x, mu))}`);
    B.dyn.appendChild(mk('polyline', { points: pts.join(' '), fill: 'none', stroke: color, 'stroke-width': 2.2 }, B.dyn));
  };

  B.renderFn = () => {
    const c = st.c, d = st.d;
    const alpha = 1 - Phi(c), beta = Phi(c - d);

    // 地面与横轴
    B.dyn.appendChild(mk('line', { x1: X0 - 10, y1: YB, x2: X0 + XW + 16, y2: YB, stroke: '#aebdd2', 'stroke-width': 1.4 }, B.dyn));
    for (let x = -2; x <= 6; x += 1) {
      B.dyn.appendChild(mk('line', { x1: px(x), y1: YB, x2: px(x), y2: YB + 5, stroke: '#aebdd2', 'stroke-width': 1 }, B.dyn));
      B.textM(V(px(x), YB + 19), `$${x}$`, { 'font-size': 10, fill: '#8fa3bd' });
    }

    shade(0, c, xb, '#ff7b8a', .32);       // α
    shade(d, xa, c, '#67e8f9', .28);       // β
    curve(d, '#4ade80');
    curve(0, '#5cadff');

    // 临界线
    B.dyn.appendChild(mk('line', { x1: px(c), y1: 74, x2: px(c), y2: YB, stroke: '#ff9e4a', 'stroke-width': 1.8 }, B.dyn));
    B.textM(V(px(c), 62), `$c=${c.toFixed(2)}$`, { 'font-size': 12.5, fill: '#ff9e4a' });

    B.textM(V(px(0), py(dens(0, 0)) - 14), '$H_0$', { 'font-size': 13, fill: '#5cadff' });
    B.textM(V(px(d), py(dens(0, d)) - 14), '$H_1$', { 'font-size': 13, fill: '#4ade80' });

    // 拒绝域标识
    B.text(V((px(c) + px(xb)) / 2, 92), '拒绝域', { fill: '#ff7b8a', 'font-size': 12 });
    B.textM(V(px(0) - 40, YB - 6), '$\\mu_0=0$', { 'font-size': 10.5, fill: '#5cadff', 'text-anchor': 'end' });
    B.textM(V(px(d) + 4, YB - 6), `$\\mu_1=\\delta$`, { 'font-size': 10.5, fill: '#4ade80', 'text-anchor': 'start' });

    cA(`$${(alpha * 100).toFixed(2)}\\%$`);
    cB(`$${(beta * 100).toFixed(2)}\\%$`);
    cJ(alpha < .01 ? '临界值偏右：几乎不冤枉 H₀，可 H₁ 成立时也常常发现不了'
      : beta < .05 ? '临界值偏左：对 H₁ 很敏感，代价是 H₀ 成立时也常被误判'
        : '两类错误各占一部分：往右移 c 压住 α，β 就跟着涨，反之亦然');
  };

  B.slider('临界值 c', .6, 4.4, .05, st.c, v => { st.c = v; B.render(); }, 'c');
  B.slider('偏移 δ', .4, 3, .1, st.d, v => { st.d = v; B.render(); }, 'd');

  B.hint('把临界值往右移，红色面积 α 缩小、青色面积 β 增大，两类错误此消彼长');
  B.render();
  return B;
}
