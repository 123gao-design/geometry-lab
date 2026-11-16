/* 图 数2 · 方差与标准差
   取值固定为 0..4，权重按「离中心 2 越远越轻」分配，集中程度由一个滑块控制。
   柱高是概率，金带是 μ±σ：分布越集中，带越窄，方差与标准差越小。
   方差是「偏离期望的平方」按概率加权求平均，标准差取它的算术平方根。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { c: .7 };
  const cE = B.chipM('E(X)'), cD = B.chipM('D(X)'), cS = B.chipM('σ(X)'), cJ = B.chipM('判读');

  const f3 = v => v.toFixed(3);

  B.renderFn = () => {
    const ws = [0, 1, 2, 3, 4].map(i => Math.exp(-st.c * Math.abs(i - 2)));
    const S = ws.reduce((a, b) => a + b, 0);
    const ps = ws.map(w => w / S);
    const E = ps.reduce((a, p, i) => a + i * p, 0);
    const D = ps.reduce((a, p, i) => a + (i - E) ** 2 * p, 0);
    const sd = Math.sqrt(D);

    const YB = 336, HT = 250, PX = i => 150 + i * 125;
    const X2 = PX(2);

    // μ±σ 带
    const xl = PX(E - sd), xr = PX(E + sd);
    B.dyn.appendChild(mk('rect', { x: xl, y: 66, width: xr - xl, height: YB - 66, fill: 'rgba(255,209,102,.55)', stroke: 'none' }, B.dyn));
    B.dyn.appendChild(mk('line', { x1: PX(E), y1: 66, x2: PX(E), y2: YB, stroke: '#67e8f9', 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }, B.dyn));

    ps.forEach((p, i) => {
      const h = Math.max(2, p * HT);
      B.dyn.appendChild(mk('rect', {
        x: PX(i) - 32, y: YB - h, width: 64, height: h, rx: 4,
        fill: '#5cadff', 'fill-opacity': .45, stroke: '#5cadff', 'stroke-width': 1.4,
      }, B.dyn));
      B.textM(V(PX(i), YB - h - 12), `$${f3(p)}$`, { 'font-size': 10.5, fill: '#aebdd2' });
      B.textM(V(PX(i), YB + 20), `$${i}$`, { 'font-size': 12.5, fill: '#8fa3bd' });
    });
    B.dyn.appendChild(mk('line', { x1: 110, y1: YB, x2: 690, y2: YB, stroke: '#aebdd2', 'stroke-width': 1.4 }, B.dyn));

    // σ 括号
    B.dyn.appendChild(mk('line', { x1: xl, y1: 92, x2: xr, y2: 92, stroke: '#ff9e4a', 'stroke-width': 1.4 }, B.dyn));
    [xl, xr].forEach(x => B.dyn.appendChild(mk('line', { x1: x, y1: 84, x2: x, y2: 100, stroke: '#ff9e4a', 'stroke-width': 1.4 }, B.dyn)));
    B.textM(V(xr + 10, 96), '$\\mu\\pm\\sigma$', { 'font-size': 12, fill: '#ff9e4a', 'text-anchor': 'start' });
    B.textM(V(PX(E), 56), `$E(X)=${f3(E)}$`, { 'font-size': 12, fill: '#67e8f9' });

    cE(`$${f3(E)}$`);
    cD(`$\\sum(x_i-E)^2p_i=${f3(D)}$`);
    cS(`$\\sqrt{${f3(D)}}=${f3(sd)}$`);
    cJ(st.c < .15 ? '权重几乎均匀，分布最分散，方差与标准差不小'
      : st.c > 1.2 ? '概率几乎全压在中心 2 上，σ 很小，数据高度集中'
        : '外侧权重减小，柱形向中心收拢，σ 随之变窄');
  };

  B.slider('集中程度 c', 0, 1.8, .1, st.c, v => { st.c = v; B.render(); }, 'c');

  B.hint('分布越集中，金色 μ±σ 带越窄，方差与标准差就越小');
  B.render();
  return B;
}
