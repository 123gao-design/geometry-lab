/* 图 分2b · 超几何分布
   袋中 N 个球里有 M 个红球，从中一次抽出 n 个（不放回），红球个数 X 的分布列是
   C(M,k)C(N−M,n−k)/C(N,n)。三个滑块改 N、M、n，柱高随之改写。
   与二项分布的区别只在「不放回」：抽走一个红球，剩下的红球比例就变了。 */
import { Board, V, mk } from '../../../lib/board.js';

const comb = (n, k) => {
  if (k < 0 || k > n || n < 0) return 0;
  let r = 1;
  for (let i = 1; i <= k; i++) r = r * (n - k + i) / i;
  return Math.round(r);
};

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { N: 10, M: 4, n: 4, k: 2 };
  const cK = B.chipM('P(X=k)'), cR = B.chipM('可能取值'), cS = B.chipM('分布列和'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const N = st.N, M = Math.min(st.M, N - 1), n = Math.min(st.n, N);
    const lo = Math.max(0, n - (N - M)), hi = Math.min(n, M);
    const k = Math.min(Math.max(st.k, lo), hi);

    const ps = [];
    let sum = 0;
    for (let i = lo; i <= hi; i++) {
      const v = comb(M, i) * comb(N - M, n - i) / comb(N, n);
      ps.push([i, v]);
      sum += v;
    }
    const mx = Math.max(...ps.map(d => d[1]));

    const X0 = 96, X1 = 762, YB = 346, HT = 160;
    const cnt = ps.length;
    const step = (X1 - X0) / Math.max(cnt, 1);
    const bw = Math.min(72, Math.max(18, step * .6));
    const scale = HT / Math.max(mx, .01);

    B.dyn.appendChild(mk('rect', {
      x: 64, y: 52, width: 724, height: 330, rx: 12,
      fill: 'rgba(139,163,189,.04)', stroke: '#3f5f8f', 'stroke-width': 1,
    }, B.dyn));
    B.textM(V(84, 76), `$${N}$ 个球中 ${M} 个红球，抽出 ${n} 个`, { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(770, 76), `$P(X=k)=\\dfrac{\\binom{M}{k}\\binom{N-M}{n-k}}{\\binom{N}{n}}$`, { 'font-size': 13, fill: '#67e8f9', 'text-anchor': 'end' });

    // 左上方画出球的分组示意
    for (let i = 0; i < N; i++) {
      const col = i % 10, row = Math.floor(i / 10);
      B.dot(V(90 + col * 27, 106 + row * 24), 8.5, {
        fill: i < M ? '#ff7b8a' : '#5cadff', 'fill-opacity': .7,
      });
    }
    B.text(V(380, 112), '红球', { fill: '#ff7b8a', 'font-size': 11, 'text-anchor': 'start' });
    B.text(V(380, 136), '蓝球', { fill: '#5cadff', 'font-size': 11, 'text-anchor': 'start' });

    ps.forEach(([i, v], j) => {
      const x = X0 + j * step + (step - bw) / 2;
      const h = Math.max(2, v * scale);
      const on = i === k;
      B.dyn.appendChild(mk('rect', {
        x, y: YB - h, width: bw, height: h, rx: 4,
        fill: on ? '#ffd166' : '#c084fc', 'fill-opacity': on ? .85 : .45,
        stroke: on ? '#ffd166' : '#c084fc', 'stroke-width': on ? 2 : 1.2,
      }, B.dyn));
      B.textM(V(x + bw / 2, YB - h - 14), `$${v.toFixed(3)}$`, { 'font-size': 11.5, fill: on ? '#ffd166' : '#aebdd2' });
      B.textM(V(x + bw / 2, YB + 20), `$${i}$`, { 'font-size': 12, fill: on ? '#ffd166' : '#8fa3bd' });
    });
    B.dyn.appendChild(mk('line', { x1: X0, y1: YB, x2: X1, y2: YB, stroke: '#aebdd2', 'stroke-width': 1.4 }, B.dyn));

    const pk = (ps.find(d => d[0] === k) || [, 0])[1];
    cK(`$\\dfrac{\\binom{${M}}{${k}}\\binom{${N - M}}{${n - k}}}{\\binom{${N}}{${n}}}=${pk.toFixed(4)}$`);
    cR(lo === hi ? `$${lo}$` : `$${lo}$ 到 $${hi}$`);
    cS(`$${sum.toFixed(3)}$`);
    cJ(n > M
      ? '抽到的红球数达不到 n，取值上限是袋中的红球总数，两端各有一个取不到的死角'
      : `每次抽出红球后袋中比例改变，所以概率不等于二项分布；抽完不放回时取值从 ${lo} 到 ${hi}`);
  };

  B.slider('总数 N', 6, 20, 1, st.N, v => {
    st.N = v;
    st.M = Math.min(st.M, v - 1);
    st.n = Math.min(st.n, v);
    st.k = Math.min(st.k, st.n);
    B.render();
  }, 'N');
  B.slider('红球 M', 1, 19, 1, st.M, v => { st.M = v; B.render(); }, 'M');
  B.slider('抽取 n', 1, 8, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.slider('观察 k', 0, 8, 1, st.k, v => { st.k = v; B.render(); }, 'k');

  B.hint('不放回地抽，k 的两端被红球数与蓝球数同时卡住');
  B.render();
  return B;
}
