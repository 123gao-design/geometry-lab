/* 图 分3b · 正态分布
   密度曲线 f(x)=1/(σ√(2π))·e^{−(x−μ)²/(2σ²)}，μ 定中心、σ 定胖瘦。
   金色阴影取 μ±kσ（k=1,2,3 三档），面积与 68.27%、95.45%、99.73% 逐一对应。
   σ 越小曲线越尖越高，但曲线下的总面积始终是 1。 */
import { Board, V, mk } from '../../../lib/board.js';

const erf = x => { // Abramowitz–Stegun 7.1.26，误差 < 1.5e-7
  const s = Math.sign(x), a = Math.abs(x);
  const t = 1 / (1 + .3275911 * a);
  const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - .284496736) * t + .254829592) * t * Math.exp(-a * a);
  return s * y;
};

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { mu: 0, sig: 1, k: 1 };
  const cP = B.chipM('覆盖概率'), cR = B.chipM('区间'), cF = B.chipM('峰值密度'), cJ = B.chipM('判读');

  const dens = x => Math.exp(-((x - st.mu) ** 2) / (2 * st.sig ** 2)) / (st.sig * Math.sqrt(2 * Math.PI));

  B.renderFn = () => {
    const { mu, sig, k } = st;
    const m = B.mapFit(-6, 6, -.05, 1.12, [96, 62, 656, 262]);
    B.grid({ ...m, sx: 1, sy: .2, lx: 1, ly: .2, axLab: 'x', ayLab: 'y' });

    const x0 = mu - k * sig, x1 = mu + k * sig;
    // 曲线下阴影
    const seg = [];
    for (let i = 0; i <= 60; i++) {
      const x = x0 + (x1 - x0) * i / 60;
      seg.push([m.px(x), m.py(dens(x))]);
    }
    const dpath = `M ${m.px(x0)} ${m.py(0)} ` + seg.map(([px, py]) => `L ${px} ${py}`).join(' ') + ` L ${m.px(x1)} ${m.py(0)} Z`;
    B.dyn.appendChild(mk('path', { d: dpath, fill: 'rgba(255,209,102,.55)', stroke: 'none' }, B.dyn));

    B.plot(dens, m, { stroke: '#5cadff', 'stroke-width': 2.2, anchors: [mu, mu - sig, mu + sig] });

    // 中心线、σ 刻度
    B.dyn.appendChild(mk('line', { x1: m.px(mu), y1: m.py(0), x2: m.px(mu), y2: m.py(dens(mu)), stroke: '#67e8f9', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' }, B.dyn));
    [mu - k * sig, mu + k * sig].forEach(x => {
      B.dyn.appendChild(mk('line', { x1: m.px(x), y1: m.py(0), x2: m.px(x), y2: m.py(dens(x)), stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' }, B.dyn));
    });
    B.textM(V(m.px(mu), m.py(0) + 34), `$\\mu=${(Math.abs(mu) < .05 ? 0 : mu).toFixed(1)}$`, { 'font-size': 12.5, fill: '#67e8f9' });

    const p = erf(k / Math.SQRT2);
    cP(`$${(p * 100).toFixed(2)}\\%$`);
    cR(`$[${(mu - k * sig).toFixed(2)},\\ ${(mu + k * sig).toFixed(2)}]$`);
    cF(`$${dens(mu).toFixed(3)}$`);
    cJ(k === 1 ? '约三分之二的数据落在 μ±σ 内，这是三条经验里最常用的一条'
      : k === 2 ? '约 95% 的数据落在 μ±2σ 内，超出这条线已经算少见'
        : '约 99.7% 的数据落在 μ±3σ 内，超出者极为罕见，异常值的判据常取这一条');
  };

  B.slider('均值 μ', -2, 2, .1, st.mu, v => { st.mu = v; B.render(); }, 'mu');
  B.slider('标准差 σ', .4, 2, .05, st.sig, v => { st.sig = v; B.render(); }, 'sig');

  const btns = [1, 2, 3].map((k, i) => B.btnM(i === 0 ? '$\\pm\\sigma$' : `$\\pm${k}\\sigma$`, () => {
    st.k = k;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('σ 变小曲线变尖变高，但阴影总面积仍按 68.27%、95.45%、99.73% 走');
  B.render();
  return B;
}
