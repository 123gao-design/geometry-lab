/* 图 整4 · 一次同余方程机
   ax ≡ b (mod m) 的解是表盘上让 ax 落到 b 那一格的 x。
   d = gcd(a,m)：d 不整除 b 时一个解也没有；d | b 时恰有 d 个解，
   它们是同一个剩余类 x ≡ x₀ (mod m/d) 在 0..m-1 里的 d 个代表。
   三个滑块：a（1..12）、b（0..11）、m（2..12）。 */
import { Board, V, mk } from '../../../lib/board.js';

const gcd = (x, y) => { while (y) { const t = x % y; x = y; y = t; } return x; };

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { a: 4, b: 8, m: 12 };
  const CX = 272, CY = 238, R = 152;

  const cD = B.chipM('$d=\\gcd(a,m)$'), cN = B.chipM('解个数'), cS = B.chipM('解集'), cJ = B.chipM('判读');
  const ang = (k, m) => -Math.PI / 2 - k * Math.PI * 2 / m;
  const at = (k, m, r = R) => V(CX + r * Math.cos(ang(k, m)), CY + r * Math.sin(ang(k, m)));

  B.renderFn = () => {
    const { a, m } = st;
    const b = ((st.b % m) + m) % m;
    const d = gcd(a, m);
    const sols = [];
    for (let x = 0; x < m; x++) if ((a * x - b) % m === 0) sols.push(x);

    B.dyn.appendChild(mk('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: '#8fa3bd', 'stroke-width': 1.5, 'stroke-dasharray': '5 6' }, B.dyn));
    for (let x = 0; x < m; x++) {
      const hit = sols.includes(x);
      const p = at(x, m);
      B.seg(V(CX, CY), p, { stroke: hit ? '#ffd166' : '#93a1b5', 'stroke-width': hit ? 2 : 1, 'stroke-opacity': hit ? 1 : .35 });
      B.dot(p, hit ? 6 : 3.6, { fill: hit ? '#ffd166' : '#93a1b5', stroke: '#0a0d14', 'stroke-width': hit ? 1.5 : .8, 'fill-opacity': hit ? 1 : .8 });
      B.tex(at(x, m, R + 24), `$${x}$`, { size: 12.5, color: hit ? '#ffd166' : '#93a1b5', w: 26, anchor: 'mid' });
    }
    B.dot(V(CX, CY), 4, { fill: '#93a1b5' });
    B.tex(V(CX, CY - 24), `$x$`, { size: 12, color: '#93a1b5', w: 20, anchor: 'mid' });

    const RX = 552;
    B.tex(V(RX, 52), `$${a}x\\equiv ${b}\\ (\\mathrm{mod}\\ ${m})$`, { size: 17, color: '#ffd166', w: 260 });
    B.tex(V(RX, 92), `$d=\\gcd(${a},${m})=${d}$`, { size: 14.5, color: '#aebdd2', w: 240 });
    if (sols.length) {
      B.tex(V(RX, 130), `$d\\mid b$，有 $d=${d}$ 个解`, { size: 14, color: '#4ade80', w: 250 });
      B.tex(V(RX, 172), `$x\\equiv ${sols[0]}\\ (\\mathrm{mod}\\ ${m / d})$`, { size: 15, color: '#4ade80', w: 250 });
      B.tex(V(RX, 210), `$x=${sols.join(',\\ ')}$`, { size: 14.5, color: '#ffd166', w: 260 });
      B.tex(V(RX, 254), `通解 $x=${sols[0]}+${m / d}k$`, { size: 13.5, color: '#aebdd2', w: 260 });
      B.tex(V(RX, 292), '解在表盘上等间隔排开', { size: 12.5, color: '#93a1b5', w: 260 });
    } else {
      B.tex(V(RX, 132), `$d\\nmid b$，无解`, { size: 15, color: '#ff7b8a', w: 240 });
      B.tex(V(RX, 172), `$\\gcd(${a},${m})=${d}$ 不整除 $b=${b}$`, { size: 13.5, color: '#ff7b8a', w: 260 });
      B.tex(V(RX, 212), '无论 $x$ 取什么，$ax$ 都落不到 $b$ 这一格', { size: 13, color: '#aebdd2', w: 260 });
    }
    B.tex(V(W / 2, 424), '金色刻度即解：$ax$ 与 $b$ 落在模 $m$ 的同一格时，$x$ 才算解', { size: 12.5, color: '#93a1b5', w: 620, anchor: 'mid' });

    cD(`$d=${d}$`, '');
    cN(`${sols.length} 个`, sols.length ? 'ok' : 'warn');
    cS(sols.length ? `$x=${sols.join(',\\ ')}$` : '空集', '');
    cJ(sols.length ? `$d\\mid b$` : `$d\\nmid b$`, sols.length ? 'ok' : 'warn');
  };

  B.slider('系数 a', 1, 12, 1, st.a, s => { st.a = Math.round(s); B.render(); });
  B.slider('右端 b', 0, 11, 1, st.b, s => { st.b = Math.round(s); B.render(); });
  B.slider('模 m', 2, 12, 1, st.m, s => { st.m = Math.round(s); B.render(); });
  B.hintM('先看 $d=\\gcd(a,m)$：$d\\nmid b$ 无解，$d\\mid b$ 时表盘上恰有 $d$ 个金色刻度');
  B.render();
  return B;
}
