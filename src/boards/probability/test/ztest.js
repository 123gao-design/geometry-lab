/* 图 检3 · 正态分布下的均值检验
   样本均值 x̄ 在 H₀ 成立时服从 N(μ₀, σ²/n)，标准化后 z = (x̄−μ₀)/(σ/√n) ~ N(0,1)。
   上图按检验方式画出拒绝域，下图把观测到的 z 之外的那部分面积涂成 p 值。 */
import { Board, V, mk } from '../../../lib/board.js';

function erf(x) {
  const s = Math.sign(x); x = Math.abs(x);
  const t = 1 / (1 + .3275911 * x);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - .284496736) * t + .254829592) * t) * Math.exp(-x * x);
  return s * y;
}
const Phi = x => .5 * (1 + erf(x / Math.SQRT2));
const dens = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { xb: .5, n: 16, mode: 0 };
  const cZ = B.chipM('z 的观测值'), cP = B.chipM('p 值'), cJ = B.chipM('判读');

  const X0 = 110, XW = 640, za = -4.4, zb = 4.4;
  const px = z => X0 + (z - za) / (zb - za) * XW;
  const py = (d, base) => base - d * 250;

  const shade = (a, b, base, color, op) => {
    const pts = [];
    for (let z = a; z <= b + 1e-9; z += .03) pts.push(`${px(z)},${py(dens(z), base)}`);
    B.dyn.appendChild(mk('path', {
      d: `M ${px(a)},${base} L ${pts.join(' L ')} L ${px(b)},${base} Z`,
      fill: color, 'fill-opacity': op, stroke: 'none',
    }, B.dyn));
  };
  const curveAt = base => {
    const pts = [];
    for (let z = za; z <= zb + 1e-9; z += .03) pts.push(`${px(z)},${py(dens(z), base)}`);
    B.dyn.appendChild(mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 2.1 }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: X0 - 10, y1: base, x2: X0 + XW + 10, y2: base, stroke: '#aebdd2', 'stroke-width': 1.3 }, B.dyn));
    for (let z = -4; z <= 4; z += 1) {
      B.dyn.appendChild(mk('line', { x1: px(z), y1: base, x2: px(z), y2: base + 5, stroke: '#aebdd2', 'stroke-width': 1 }, B.dyn));
      B.textM(V(px(z), base + 17), `$${z}$`, { 'font-size': 9.5, fill: '#5c6a80' });
    }
  };

  B.renderFn = () => {
    const se = 1 / Math.sqrt(st.n);
    const z = st.xb / se;
    const twoTail = st.mode === 0;
    const crit = st.mode === 0 ? 1.96 : 1.645;

    // 上图：拒绝域
    curveAt(196);
    B.text(V(110, 92), '拒绝域（α = 0.05）', { fill: '#ff7b8a', 'font-size': 11.5, 'text-anchor': 'start' });
    if (twoTail) {
      shade(za, -crit, 196, '#ff7b8a', .3);
      shade(crit, zb, 196, '#ff7b8a', .3);
      [-crit, crit].forEach(cv => {
        B.dyn.appendChild(mk('line', { x1: px(cv), y1: 104, x2: px(cv), y2: 196, stroke: '#ff7b8a', 'stroke-width': 1.4, 'stroke-dasharray': '4 3' }, B.dyn));
        B.textM(V(px(cv), 100), `$${cv < 0 ? '-' : ''}1.96$`, { 'font-size': 10, fill: '#ff7b8a' });
      });
    } else if (st.mode === 1) {
      shade(crit, zb, 196, '#ff7b8a', .3);
      B.dyn.appendChild(mk('line', { x1: px(crit), y1: 104, x2: px(crit), y2: 196, stroke: '#ff7b8a', 'stroke-width': 1.4, 'stroke-dasharray': '4 3' }, B.dyn));
      B.textM(V(px(crit), 100), '$1.645$', { 'font-size': 10, fill: '#ff7b8a' });
    } else {
      shade(za, -crit, 196, '#ff7b8a', .3);
      B.dyn.appendChild(mk('line', { x1: px(-crit), y1: 104, x2: px(-crit), y2: 196, stroke: '#ff7b8a', 'stroke-width': 1.4, 'stroke-dasharray': '4 3' }, B.dyn));
      B.textM(V(px(-crit), 100), '$-1.645$', { 'font-size': 10, fill: '#ff7b8a' });
    }

    // 下图：p 值
    curveAt(386);
    B.text(V(110, 282), 'p 值：观测值之外的概率', { fill: '#ffd166', 'font-size': 11.5, 'text-anchor': 'start' });
    const zc = Math.max(za, Math.min(zb, z));
    if (twoTail) {
      if (zc >= 0) { shade(zc, zb, 386, '#ffd166', .34); shade(za, -zc, 386, '#ffd166', .34); }
      else { shade(za, zc, 386, '#ffd166', .34); shade(-zc, zb, 386, '#ffd166', .34); }
    } else if (st.mode === 1) shade(zc, zb, 386, '#ffd166', .34);
    else shade(za, zc, 386, '#ffd166', .34);
    B.dyn.appendChild(mk('line', { x1: px(zc), y1: 290, x2: px(zc), y2: 386, stroke: '#ff9e4a', 'stroke-width': 1.8 }, B.dyn));
    B.textM(V(px(zc), 306), `$z=${z.toFixed(2)}$`, { 'font-size': 11, fill: '#ff9e4a' });

    const p = twoTail ? 2 * (1 - Phi(Math.abs(z))) : st.mode === 1 ? 1 - Phi(z) : Phi(z);
    cZ(`$${z.toFixed(2)}$`);
    cP(`$${p.toFixed(4)}$`);
    cJ(p < .01 ? 'p 值不足 0.01，观测结果几乎不可能由随机波动造成，拒绝 H₀ 很有把握'
      : p < .05 ? 'p 值小于 0.05，落在拒绝域内，拒绝 H₀'
        : 'p 值大于 0.05，没有落在拒绝域内，不能拒绝 H₀');
  };

  B.btn('双侧', () => { st.mode = 0; B.render(); }, { on: () => st.mode === 0 });
  B.btn('右侧', () => { st.mode = 1; B.render(); }, { on: () => st.mode === 1 });
  B.btn('左侧', () => { st.mode = 2; B.render(); }, { on: () => st.mode === 2 });
  B.slider('样本均值 x̄', -1, 1, .02, st.xb, v => { st.xb = v; B.render(); }, 'xb');
  B.slider('样本量 n', 4, 64, 4, st.n, v => { st.n = v; B.render(); }, 'nt');

  B.hint('样本量越大标准误越小，同样的 x̄ 更适合拒绝原假设');
  B.render();
  return B;
}
