/* 图 定3 · 费马小定理与欧拉定理机
   模 m 的表盘上，从 1 出发反复乘 a：1, a, a², … 落成一串点。
   若 gcd(a,m)=1，这串点终会回到 1，回到 1 所需的步数就是 a 的阶；
   费马小定理（m 为素数时 a^{m−1}≡1）与欧拉定理（a^{φ(m)}≡1）说的都是「一定回得来」。
   两个滑块：模 m（3..12）、底数 a（2..11）。 */
import { Board, V, mk } from '../../../lib/board.js';

const gcd = (x, y) => { while (y) { const t = x % y; x = y; y = t; } return x; };
function phi(n) {
  let r = n, x = n;
  for (let p = 2; p * p <= x; p++) if (x % p === 0) { while (x % p === 0) x /= p; r = r / p * (p - 1); }
  if (x > 1) r = r / x * (x - 1);
  return r;
}
const isPrime = n => { if (n < 2) return false; for (let k = 2; k * k <= n; k++) if (n % k === 0) return false; return true; };

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { m: 7, a: 3 };
  const CX = 250, CY = 236, R = 148;

  const cOrd = B.chipM('阶'), cPow = B.chipM('$a^{\\varphi(m)}\\bmod m$'), cJ = B.chipM('判读');
  const ang = (k, m) => -Math.PI / 2 - k * Math.PI * 2 / m;
  const at = (k, m, r = R) => V(CX + r * Math.cos(ang(k, m)), CY + r * Math.sin(ang(k, m)));

  B.renderFn = () => {
    const m = st.m, a = ((st.a % m) + m) % m;
    const cop = gcd(a, m) === 1;
    const ph = phi(m);

    // 幂序列：互素时走到回到 1 为止；不互素时走到首次重复
    let order = -1;
    if (cop) {
      let v = 1 % m;
      for (let k = 1; k <= ph; k++) { v = v * a % m; if (v === 1) { order = k; break; } }
    }
    const seq = [1 % m];
    const seen = new Set([seq[0]]);
    for (let k = 1; k <= m + 2; k++) {
      const v = (seq[k - 1] * a) % m;
      if (seen.has(v)) break;
      seen.add(v); seq.push(v);
    }

    B.dyn.appendChild(mk('circle', { cx: CX, cy: CY, r: R, fill: 'none', stroke: '#8fa3bd', 'stroke-width': 1.4, 'stroke-dasharray': '5 6' }, B.dyn));
    for (let k = 0; k < m; k++) {
      B.seg(at(k, m, R - 6), at(k, m, R + 8), { stroke: '#93a1b5', 'stroke-width': 1.3, 'stroke-opacity': .7 });
      B.tex(at(k, m, R + 23), `$${k}$`, { size: 12, color: '#aebdd2', w: 24, anchor: 'mid' });
    }
    // 轨道：相邻两次幂用细线连起来，起点染金
    for (let i = 1; i < seq.length; i++) {
      const p = at(seq[i - 1], m), q = at(seq[i], m);
      B.seg(p, q, { stroke: '#67e8f9', 'stroke-width': 1.5, 'stroke-opacity': .55 });
    }
    seq.forEach((v, i) => {
      const p = at(v, m);
      const gold = v === 1;
      B.dot(p, gold ? 6.5 : 4.8, { fill: gold ? '#ffd166' : '#67e8f9', stroke: '#0a0d14', 'stroke-width': 1.3 });
      if (i <= 6) B.tex(V(p.x, p.y - 14), `$${i}$`, { size: 10.5, color: gold ? '#ffd166' : '#67e8f9', w: 20, anchor: 'mid' });
    });
    B.tex(V(CX, CY + R + 48), cop ? '从 1 出发，乘 a 的幂最终回到 1' : '$a$ 与 $m$ 不互素，幂回不到 1', { size: 13, color: cop ? '#4ade80' : '#ff7b8a', w: 320, anchor: 'mid' });

    const RX = 520;
    B.tex(V(RX, 58), `$m=${m},\\ a=${a}$`, { size: 15, color: '#ffd166', w: 220 });
    B.tex(V(RX, 96), '幂序列 $(\\mathrm{mod}\\ m)$', { size: 13, color: '#93a1b5', w: 250 });
    const list = seq.slice(0, 12).map((v, i) => `${a}^{${i}}\\!\\equiv\\!${v}`).join(',\\ ');
    B.tex(V(RX, 130), `$${list}$`, { size: 13, color: '#aebdd2', w: 300 });
    B.tex(V(RX, 176), cop ? `阶 $=${order}$` : '阶不存在', { size: 15, color: cop ? '#4ade80' : '#ff7b8a', w: 240 });
    B.tex(V(RX, 212), `$\\varphi(${m})=${ph}$`, { size: 14, color: '#aebdd2', w: 220 });
    B.tex(V(RX, 248), `$${a}^{${ph}}\\bmod ${m}=${cop ? 1 : Math.pow(a, ph) % m}$`, { size: 15, color: cop ? '#4ade80' : '#ff7b8a', w: 250 });
    if (isPrime(m)) B.tex(V(RX, 292), `$m=${m}$ 是素数：$a^{${m - 1}}\\equiv1$（费马小定理）`, { size: 12.5, color: '#c084fc', w: 300 });
    else B.tex(V(RX, 292), `${m} 不是素数，用欧拉定理 $a^{\\varphi(m)}\\equiv1$`, { size: 12.5, color: '#c084fc', w: 300 });

    B.tex(V(W / 2, 430), '两枚定理说的是同一件事：互素时乘 a 的幂必然回到 1，且回到 1 的步数整除 $\\varphi(m)$', { size: 12.5, color: '#93a1b5', w: 720, anchor: 'mid' });

    cOrd(cop ? `$\\operatorname{ord}=${order}$` : '不存在', cop ? 'ok' : 'warn');
    cPow(`$${Math.pow(a, ph) % m}$`, cop ? 'ok' : 'warn');
    cJ(cop ? (order > 0 && ph % order === 0 ? '$\\operatorname{ord}\\mid\\varphi(m)$' : '核对') : '$\\gcd(a,m)>1$', cop ? 'ok' : 'warn');
  };

  B.slider('模 m', 3, 12, 1, st.m, s => { st.m = Math.round(s); B.render(); });
  B.slider('底数 a', 2, 11, 1, st.a, s => { st.a = Math.round(s); B.render(); });
  B.hintM('从 1 出发反复乘 $a$：互素时轨道一定回到 1，步数就是 $a$ 的阶');
  B.render();
  return B;
}
