/* 图 分4 · 卡方分布
   k 个相互独立的标准正态变量的平方和服从自由度为 k 的卡方分布，密度右偏、随 k 增大逐渐对称。
   滑块改自由度 k 与分位点 x₀，金色阴影是上侧面积 P(χ²>x₀)，即检验中的 p 值所在的那条尾巴。
   独立性检验用的临界值就查这张表：上侧面积小于显著性水平时拒绝原假设。 */
import { Board, V, mk } from '../../../lib/board.js';

// 对数伽马（Lanczos）
const lgamma = x => {
  const g = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, .1208650973866179e-2, -.5395239384953e-5];
  let y = x, t = x + 5.5;
  t -= (x + .5) * Math.log(t);
  let s = 1.000000000190015;
  for (let j = 0; j < 6; j++) s += g[j] / ++y;
  return -t + Math.log(2.5066282746310005 * s / x);
};
// 正则化伽马 Q(a,x) = 上侧面积
const gser = (a, x) => {
  let ap = a, sum = 1 / a, del = sum;
  for (let n = 0; n < 500; n++) {
    ap += 1; del *= x / ap; sum += del;
    if (Math.abs(del) < Math.abs(sum) * 1e-12) break;
  }
  return sum * Math.exp(-x + a * Math.log(x) - lgamma(a));
};
const gcf = (a, x) => {
  let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
  for (let i = 1; i <= 500; i++) {
    const an = -i * (i - a);
    b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300;
    c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300;
    d = 1 / d;
    const del = d * c; h *= del;
    if (Math.abs(del - 1) < 1e-12) break;
  }
  return Math.exp(-x + a * Math.log(x) - lgamma(a)) * h;
};
const chisqQ = (k, x) => {
  if (x <= 0) return 1;
  const a = k / 2, z = x / 2;
  return z < a + 1 ? 1 - gser(a, z) : gcf(a, z);
};

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { k: 4, x0: 6 };
  const cQ = B.chipM('上侧面积'), cM = B.chipM('均值与峰'), cJ = B.chipM('判读');

  const dens = x => x <= 0 ? 0
    : Math.exp((st.k / 2 - 1) * Math.log(x) - x / 2 - (st.k / 2) * Math.LN2 - lgamma(st.k / 2));

  B.renderFn = () => {
    const { k, x0 } = st;
    const m = B.mapFit(0, 16, -.03, .55, [96, 62, 656, 262]);
    B.grid({ ...m, sx: 2, sy: .1, lx: 2, ly: .1, axLab: 'x', ayLab: 'f(x)' });

    // 上侧阴影
    const seg = [];
    for (let i = 0; i <= 80; i++) {
      const x = x0 + (16 - x0) * i / 80;
      seg.push([m.px(x), m.py(Math.min(dens(x), .55))]);
    }
    const dpath = `M ${m.px(x0)} ${m.py(0)} ` + seg.map(([px, py]) => `L ${px} ${py}`).join(' ') + ` L ${m.px(16)} ${m.py(0)} Z`;
    B.dyn.appendChild(mk('path', { d: dpath, fill: 'rgba(255,209,102,.55)', stroke: 'none' }, B.dyn));

    B.plot(dens, m, { stroke: '#5cadff', 'stroke-width': 2.2, x0: .02, pad: .6 });

    B.dyn.appendChild(mk('line', { x1: m.px(x0), y1: m.py(0), x2: m.px(x0), y2: m.py(.55), stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }, B.dyn));
    B.textM(V(m.px(x0), m.py(0) + 34), `$x_0=${x0.toFixed(1)}$`, { 'font-size': 12, fill: '#ff9e4a' });

    const mean = k, mode = Math.max(k - 2, 0);
    B.dyn.appendChild(mk('line', { x1: m.px(mean), y1: m.py(0), x2: m.px(mean), y2: m.py(0) - 9, stroke: '#67e8f9', 'stroke-width': 2 }, B.dyn));
    B.textM(V(m.px(mean), 84), `$E\\chi^2=${k}$`, { 'font-size': 11.5, fill: '#67e8f9' });

    const q = chisqQ(k, x0);
    cQ(`$${q.toFixed(4)}$`);
    cM(`$\\mu=${mean},\\ k_0=${mode}$`);
    cJ(k === 1 ? '自由度为 1 时密度在原点附近趋于无穷，平方和只含一个平方项'
      : k <= 3 ? '自由度还小，曲线严重右偏，峰挤在左端'
        : q < .05 ? '上侧面积已不足 0.05，χ² 落到这条尾巴里属于小概率事件'
          : '自由度越大曲线越对称，峰在 k−2，中心在 k');
  };

  B.slider('自由度 k', 1, 12, 1, st.k, v => { st.k = v; B.render(); }, 'k');
  B.slider('分位点 x0', 0, 16, .2, st.x0, v => { st.x0 = v; B.render(); }, 'x0');

  B.hint('尾巴越往右越薄；自由度 k 越大，整条曲线越往右挪、越对称');
  B.render();
  return B;
}
