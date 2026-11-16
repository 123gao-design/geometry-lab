/* 图 定1 · 素数与算术基本定理机
   1..n 排成十列的格阵：素数是金色，合数转暗，「1」单独标灰。
   埃拉托色尼筛法的效果就在这张图上——素数没有被更小的数筛掉，合数一定被筛掉。
   右栏把 n 本身拆成质因数连乘，展示分解的唯一写法。
   滑块：上界 n（10..60）。 */
import { Board, V, mk } from '../../../lib/board.js';

const isPrime = n => { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };
function factor(n) {
  const out = [];
  let x = n;
  for (let p = 2; p * p <= x; p++) {
    let e = 0;
    while (x % p === 0) { x /= p; e++; }
    if (e) out.push([p, e]);
  }
  if (x > 1) out.push([x, 1]);
  return out;
}

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { n: 60 };

  const cP = B.chipM('素数个数'), cL = B.chipM('最后一个素数'), cF = B.chipM('$n$ 的分解'), cJ = B.chipM('判读');
  const cw = 46, ch = 42, X0 = 52, Y0 = 56;

  B.renderFn = () => {
    const n = st.n;
    const primes = [];
    for (let k = 1; k <= n; k++) {
      const p = isPrime(k);
      if (p) primes.push(k);
      const c = (k - 1) % 10, r = Math.floor((k - 1) / 10);
      const x = X0 + c * cw, y = Y0 + r * ch;
      const gold = p, one = k === 1;
      B.dyn.appendChild(mk('rect', {
        x, y, width: cw - 4, height: ch - 4, rx: 6,
        fill: gold ? '#ffd166' : '#8fa3bd', 'fill-opacity': gold ? .2 : .06,
        stroke: gold ? '#ffd166' : '#8fa3bd', 'stroke-opacity': gold ? .95 : .3, 'stroke-width': gold ? 1.5 : 1,
      }, B.dyn));
      B.tex(V(x + (cw - 4) / 2, y + (ch - 4) / 2), `$${k}$`, { size: 13.5, color: one ? '#93a1b5' : (gold ? '#ffd166' : '#aebdd2'), w: 34, anchor: 'mid' });
    }

    const fac = factor(n);
    const facTex = fac.length ? fac.map(([p, e]) => e > 1 ? `${p}^{${e}}` : `${p}`).join('\\times') : '1';
    const RX = 560;
    B.tex(V(RX, 62), `$\\pi(${n})=${primes.length}$`, { size: 17, color: '#4ade80', w: 240 });
    B.tex(V(RX, 100), `最后一个素数 $${primes[primes.length - 1]}$`, { size: 13.5, color: '#ffd166', w: 240 });
    B.tex(V(RX, 146), '分解 $n=p_1^{a_1}\\cdots p_k^{a_k}$', { size: 13.5, color: '#c084fc', w: 250 });
    B.tex(V(RX, 184), `$${n}=${facTex}$`, { size: 17, color: '#c084fc', w: 260 });
    B.tex(V(RX, 226), `素因子 ${fac.length} 个`, { size: 13, color: '#aebdd2', w: 220 });
    B.tex(V(RX, 276), '金色格是素数', { size: 13, color: '#ffd166', w: 220 });
    B.tex(V(RX, 304), '灰格是合数，都被某个更小的素数整除', { size: 12, color: '#93a1b5', w: 240 });
    B.tex(V(RX, 332), '「1」既不是素数也不是合数', { size: 12, color: '#93a1b5', w: 240 });

    B.tex(V(W / 2, 426), '筛法：划去 2、3、5… 的倍数，剩下的就是素数；合数一定被最小的素因子划掉', { size: 12.5, color: '#93a1b5', w: 700, anchor: 'mid' });

    cP(`$\\pi(${n})=${primes.length}$`, '');
    cL(`$p=${primes[primes.length - 1]}$`, '');
    cF(`$${n}=${facTex}$`, '');
    cJ(isPrime(n) ? `${n} 是素数` : `${n} 是合数`, isPrime(n) ? 'ok' : '');
  };

  B.slider('上界 n', 10, 60, 1, st.n, s => { st.n = Math.round(s); B.render(); });
  B.hintM('金色是素数，灰格是合数；把 $n$ 调大，新露出的格子里仍只有素数被染金');
  B.render();
  return B;
}
