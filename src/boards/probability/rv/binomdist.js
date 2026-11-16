/* 图 分2a · 二项分布
   n 次独立重复试验，每次成功概率 p，成功次数 X 的分布列是 C(n,k)p^k(1−p)^{n−k}。
   滑块改 n 与 p，柱高实时改写；金色柱是当前观察的 k，最高柱给出最可能的成功次数。
   p=0.5 时分布关于 n/2 对称，p 偏离 0.5 后峰向一侧偏。 */
import { Board, V, mk } from '../../../lib/board.js';

const comb = (n, k) => {
  let r = 1;
  for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
  return Math.round(r);
};

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { n: 8, p: .5, k: 4 };
  const cK = B.chipM('P(X=k)'), cM = B.chipM('峰值'), cS = B.chipM('分布列和'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const { n, p } = st;
    const k = Math.min(st.k, n);
    const ps = [];
    for (let i = 0; i <= n; i++) ps.push(comb(n, i) * p ** i * (1 - p) ** (n - i));
    const mx = Math.max(...ps);
    const peak = ps.indexOf(mx);
    const sum = ps.reduce((a, b) => a + b, 0);

    const X0 = 96, X1 = 762, YB = 332, HT = 216;
    const step = (X1 - X0) / (n + 1);
    const bw = Math.max(12, step * .62);
    const scale = HT / Math.max(mx, .01);

    B.dyn.appendChild(mk('rect', {
      x: 64, y: 56, width: 724, height: 326, rx: 12,
      fill: 'rgba(139,163,189,.04)', stroke: '#3f5f8f', 'stroke-width': 1,
    }, B.dyn));
    B.textM(V(84, 80), `$n=${n}$ 次试验，每次成功概率 $p=${p.toFixed(2)}$`, { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    ps.forEach((v, i) => {
      const x = X0 + i * step + (step - bw) / 2;
      const h = Math.max(1.5, v * scale);
      const on = i === k, top = i === peak;
      B.dyn.appendChild(mk('rect', {
        x, y: YB - h, width: bw, height: h, rx: 3,
        fill: on ? '#ffd166' : '#5cadff',
        'fill-opacity': on ? .8 : .42,
        stroke: top ? '#67e8f9' : (on ? '#ffd166' : '#5cadff'),
        'stroke-width': top ? 2 : 1.2,
      }, B.dyn));
      if (n <= 8 || i % 2 === 0 || on || top) {
        B.textM(V(x + bw / 2, YB + 18), `$${i}$`, { 'font-size': 11, fill: on ? '#ffd166' : '#8fa3bd' });
      }
    });
    B.dyn.appendChild(mk('line', { x1: X0, y1: YB, x2: X1, y2: YB, stroke: '#aebdd2', 'stroke-width': 1.4 }, B.dyn));
    B.text(V(X1, 84), '成功次数 k', { fill: '#8fa3bd', 'font-size': 11.5, 'text-anchor': 'end' });

    const pk = ps[k];
    cK(`$\\binom{${n}}{${k}}${p.toFixed(2)}^{${k}}${(1 - p).toFixed(2)}^{${n - k}}=${pk.toFixed(4)}$`);
    cM(`$k=${peak}$`);
    cS(`$${sum.toFixed(3)}$`);
    cJ(Math.abs(p - .5) < 1e-9
      ? 'p=0.5 时分布关于 n/2 对称，峰落在正中；n 越大，柱越集中'
      : p < .5 ? '每次成功的概率小，峰偏向左边，k 大时概率迅速变小'
        : '每次成功的概率大，峰偏向右边，k 小时概率迅速变小');
  };

  B.slider('试验次数 n', 1, 12, 1, st.n, v => { st.n = v; st.k = Math.min(st.k, v); B.render(); }, 'n');
  B.slider('单次概率 p', .05, .95, .05, st.p, v => { st.p = v; B.render(); }, 'p');
  B.slider('观察 k', 0, 12, 1, st.k, v => { st.k = v; B.render(); }, 'k');

  B.hint('n 越大柱越密；p=0.5 时分布对称，偏离 0.5 就往一侧偏');
  B.render();
  return B;
}
