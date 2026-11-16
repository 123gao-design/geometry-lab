import { Board, V, mk } from '../../../lib/board.js';

/* 子群与陪集：Z_12 里由 k 生成的循环子群 H = <k>，把十二个元素按相差一个 H 元素分组。
   同一颜色即同一个陪集，各陪集大小都等于 |H|，所以 |H| 一定整除 12。 */
const CL = ['#ffd166', '#5cadff', '#4ade80', '#c084fc', '#ff9e4a', '#67e8f9'];
function gcd(a, b) { while (b) { const t = a % b; a = b; b = t; } return a; }

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 3 };
  const cH = B.chipM('子群 H');
  const cO = B.chipM('阶 |H|');
  const cN = B.chipM('陪集数');

  B.renderFn = () => {
    const k = st.k, N = 12, d = gcd(k, N), size = N / d;
    const H = [...Array(size).keys()].map(i => (i * k) % N);
    const cx = 330, cy = 236, R = 132;
    const pos = x => V(cx + R * Math.sin(2 * Math.PI * x / N), cy - R * Math.cos(2 * Math.PI * x / N));
    B.dot(V(cx, cy), 3, { fill: 'rgba(143,163,189,.5)' });
    for (let c = 0; c < d; c++) {
      const col = CL[c % CL.length];
      const pts = [...Array(size).keys()].map(i => pos((c + i * k) % N));
      mk('polygon', { points: pts.map(p => `${p.x},${p.y}`).join(' '), fill: col, 'fill-opacity': 0.07, stroke: col, 'stroke-opacity': .5, 'stroke-width': 1.4 }, B.dyn);
    }
    for (let x = 0; x < N; x++) {
      const p = pos(x), inH = H.includes(x);
      B.dot(p, inH ? 9 : 7, { fill: inH ? 'rgba(255,209,102,.9)' : 'rgba(92,173,255,.25)', stroke: CL[x % d], 'stroke-width': 2 });
      B.text(V(p.x, p.y + 4), `${x}`, { 'font-size': 12, fill: '#e6eefc', 'text-anchor': 'middle' });
    }
    B.text(V(cx, cy - 6), 'Z₁₂', { 'font-size': 13, fill: '#8fa3bd', 'text-anchor': 'middle' });
    B.text(V(cx, cy + 14), '模 12 加法', { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'middle' });

    B.tex(V(410, 34), `H = ⟨${k}⟩ = {${H.join(', ')}}`, { size: 15, color: '#ffd166', anchor: 'mid', w: 500 });
    const rx = 560;
    B.tex(V(rx, 120), '子群：自身成群，且运算与 Z₁₂ 一致', { size: 12, color: '#4ade80', w: 240 });
    B.tex(V(rx, 168), `|H| = ${size}`, { size: 14, color: '#ffd166', w: 240 });
    B.tex(V(rx, 212), `陪集数 = 12 ÷ ${size} = ${d}`, { size: 14, color: '#c084fc', w: 240 });
    B.tex(V(rx, 256), `12 = ${size} × ${d}`, { size: 13, color: '#8fa3bd', w: 240 });
    B.tex(V(rx, 300), `拉格朗日定理：|H| 整除 |G|`, { size: 12, color: '#4ade80', w: 250 });
    B.tex(V(rx, 356), d === 1 ? 'k 与 12 互素，H 就是整个群（平凡情形）' : d === 12 ? 'k=0，H 只含幺元' : '每个陪集大小相同，两两不交，合起来是整个群', { size: 11, color: '#8fa3bd', w: 250 });

    cH(`$\\{${H.join(',')}\\}$`);
    cO(`${size}`);
    cN(`${d}`);
  };

  B.slider('生成元 k', 0, 11, 1, st.k, v => { st.k = v; B.render(); });
  B.hint('k 取 3 时四个陪集各三个元素；取 5（与 12 互素）只剩一个陪集');
  B.render();
  return B;
}
