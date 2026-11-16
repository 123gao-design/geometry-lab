/* 图 拟1 · 最小二乘与线性拟合
   七个样本点先按一条直线排开，再叠加一点起伏。拟合直线由「残差平方和最小」唯一确定：
   斜率为 Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)²，截距为 ȳ−a·x̄——直线必过样本中心 (x̄,ȳ)。
   拖动任意一点（竖直方向）看直线如何被拽动，残差平方和随之涨落。 */
import { Board, V, mk } from '../../../lib/board.js';

const XS = [-2.4, -1.6, -0.8, 0, 0.8, 1.6, 2.4];
const rnd = (i, s) => {
  const t = Math.sin((i + 1) * 12.9898 + s * 78.233) * 43758.5453;
  return (t - Math.floor(t)) * 2 - 1;
};

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { amp: 0.7, seed: 1, ys: [], showRes: true, sel0x: 0 };
  const cA = B.chipM('斜率 $a$'), cB = B.chipM('截距 $b$'), cS = B.chipM('残差平方和'), cJ = B.chipM('判读');

  const regen = () => { st.ys = XS.map((x, i) => 0.8 * x + 0.4 + st.amp * rnd(i, st.seed)); };
  regen();

  const m = B.mapFit(-3.1, 3.1, -3.4, 3.4, [50, 56, 500, 300], 22);

  const fit = () => {
    const n = XS.length;
    const xb = XS.reduce((s, x) => s + x, 0) / n;
    const yb = st.ys.reduce((s, y) => s + y, 0) / n;
    const sxy = XS.reduce((s, x, i) => s + (x - xb) * (st.ys[i] - yb), 0);
    const sxx = XS.reduce((s, x) => s + (x - xb) * (x - xb), 0);
    const a = sxy / sxx, b = yb - a * xb;
    const S = XS.reduce((s, x, i) => { const d = st.ys[i] - a * x - b; return s + d * d; }, 0);
    const S0 = st.ys.reduce((s, y) => s + (y - yb) * (y - yb), 0);
    return { xb, yb, a, b, S, S0 };
  };

  B.renderFn = () => {
    const { xb, yb, a, b, S, S0 } = fit();
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1 });
    B.plot(x => a * x + b, m, { stroke: '#ffd166', 'stroke-width': 2.4 });

    // 残差：样本点到直线的竖直线段
    if (st.showRes) {
      XS.forEach((x, i) => {
        const yl = a * x + b;
        B.dyn.appendChild(mk('line', {
          x1: m.px(x), y1: m.py(st.ys[i]), x2: m.px(x), y2: m.py(yl),
          stroke: '#ff7b8a', 'stroke-width': 1.4, 'stroke-dasharray': '3 3', 'stroke-opacity': .85,
        }, B.dyn));
      });
    }

    // 样本中心：十字线
    B.dyn.appendChild(mk('line', { x1: m.px(xb), y1: m.py(m.Y0), x2: m.px(xb), y2: m.py(m.Y1), stroke: '#67e8f9', 'stroke-width': 1.1, 'stroke-dasharray': '5 5', 'stroke-opacity': .7 }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: m.px(m.X0), y1: m.py(yb), x2: m.px(m.X1), y2: m.py(yb), stroke: '#67e8f9', 'stroke-width': 1.1, 'stroke-dasharray': '5 5', 'stroke-opacity': .7 }, B.dyn));

    // 样本点
    XS.forEach((x, i) => B.dot(V(m.px(x), m.py(st.ys[i])), 5, { fill: '#5cadff' }));
    B.dot(V(m.px(xb), m.py(yb)), 6.5, { fill: '#67e8f9' });

    // 残差小方块：边长就是残差大小，贴在残差线段的旁边，面积之和即被最小化的量
    XS.forEach((x, i) => {
      const yl = a * x + b, d = Math.abs(st.ys[i] - yl);
      if (d < 1e-3) return;
      const s = Math.min(d * m.s, 44);
      const yLo = Math.max(m.py(st.ys[i]), m.py(yl));
      B.dyn.appendChild(mk('rect', { x: m.px(x) + 7, y: yLo - s, width: s, height: s, fill: '#ff7b8a', 'fill-opacity': .18, stroke: '#ff7b8a', 'stroke-width': .8, 'stroke-opacity': .5 }, B.dyn));
    });

    // 右栏
    B.textM(V(596, 96), `$\\hat y=${a.toFixed(3)}x${b >= 0 ? '+' : '-'}${Math.abs(b).toFixed(3)}$`, { 'font-size': 16, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM(V(596, 140), `$\\bar x=${xb.toFixed(2)},\\quad \\bar y=${yb.toFixed(2)}$`, { 'font-size': 13, fill: '#67e8f9', 'text-anchor': 'start' });
    B.textM(V(596, 182), `$S=\\sum(y_i-\\hat y_i)^2=${S.toFixed(3)}$`, { 'font-size': 13, fill: '#ff7b8a', 'text-anchor': 'start' });
    B.textM(V(596, 216), `$S_0=\\sum(y_i-\\bar y)^2=${S0.toFixed(3)}$`, { 'font-size': 13, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(596, 258), '只用水平线时的残差平方和', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(596, 306), `$1-\\dfrac{S}{S_0}=${(1 - S / Math.max(S0, 1e-12)).toFixed(3)}$`, { 'font-size': 15, fill: '#4ade80', 'text-anchor': 'start' });
    B.textM(V(596, 334), '直线解释了这部分起伏', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    cA(`$${a.toFixed(3)}$`);
    cB(`$${b.toFixed(3)}$`);
    cS(`$${S.toFixed(3)}$`);
    cJ(S0 - S < 1e-6 ? '样本几乎落在一条水平线上，斜率接近 0，直线没有比水平线更省'
      : st.amp > 1.2 ? '起伏很大，直线只能吃到总体走向，残差仍成片'
        : '金色直线穿过青色样本中心，红虚线是各点的残差，小方块面积之和就是 S');
  };

  const pre = [];
  const mark = () => pre.forEach((x, i) => x.classList.toggle('on', st.seed === [1, 2, 3][i]));
  [1, 2, 3].forEach((s, i) => pre.push(B.btn(`第 ${i + 1} 组`, () => { st.seed = s; regen(); mark(); B.render(); })));
  mark();

  B.toggleBtn('残差', true, on => { st.showRes = on; B.render(); });

  B.slider('起伏幅度', 0, 1.6, 0.1, st.amp, v => { st.amp = v; regen(); B.render(); }, 'amp');

  B.handle({
    color: '#5cadff', r: 8, label: '样本',
    get: () => {
      let k = 0, best = 1e9;
      XS.forEach((x, i) => { const d = Math.abs(x - st.sel0x); if (d < best) { best = d; k = i; } });
      return V(m.px(XS[k]), m.py(st.ys[k]));
    },
    set: p => {
      let k = 0, best = 1e9;
      XS.forEach((x, i) => { const d = Math.abs(m.px(x) - p.x); if (d < best) { best = d; k = i; } });
      st.sel0x = XS[k];
      const yy = (m.py(0) - p.y) / (m.py(0) - m.py(1));
      st.ys[k] = Math.max(Math.min(yy, 3.3), -3.3);
    },
  });

  B.hint('上下拖任意一点：直线跟着重新算，残差平方和只在最小值处停住');
  B.render();
  return B;
}
