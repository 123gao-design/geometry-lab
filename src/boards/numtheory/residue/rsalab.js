/* 图 剩4 · RSA 加密与解密机
   取两个素数 p、q，公钥 (n=pq, e)、私钥 d 满足 ed≡1 (mod φ(n))。
   加密 c≡m^e (mod n)，解密 c^d≡m (mod n)——两条式子成立靠的是欧拉定理。
   报文 m 先用滑块取一个小整数，整个往返在一张图上走完。
   四个滑块：素数 p、素数 q、公钥指数 e、报文 m。 */
import { Board, V, mk } from '../../../lib/board.js';

const PR = [5, 7, 11, 13];
const gcd = (x, y) => { while (y) { const t = x % y; x = y; y = t; } return x; };
const pw = (b, e, m) => { let r = 1 % m; b %= m; while (e > 0) { if (e & 1) r = r * b % m; b = b * b % m; e >>= 1; } return r; };
function inv(a, m) {
  let [r0, r1] = [a % m, m], [s0, s1] = [1, 0];
  while (r1) { const q = Math.floor(r0 / r1); [r0, r1] = [r1, r0 - q * r1]; [s0, s1] = [s1, s0 - q * s1]; }
  return ((s0 % m) + m) % m;
}

export function createBoard(root) {
  const W = 840, H = 470;
  const B = new Board(root, W, H);
  const st = { pi: 0, qi: 1, e: 3, m: 7 };

  const cPub = B.chipM('公钥 $(n,e)$'), cC = B.chipM('密文 $c$'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const p = PR[st.pi], q = PR[st.qi];
    const n = p * q, ph = (p - 1) * (q - 1);
    // e 必须与 φ(n) 互素：不满足时向上取到最近的互素值
    let e = st.e;
    for (let k = 0; k < ph; k++) { if (e > 1 && e < ph && gcd(e, ph) === 1) break; e = e + 1 >= ph ? 3 : e + 1; }
    const d = inv(e, ph);
    const m = st.m % n;
    const c = pw(m, e, n);
    const back = pw(c, d, n);
    const ok = back === m;

    const box = (x, y, w, h, color, head, val, sub) => {
      B.dyn.appendChild(mk('rect', { x, y, width: w, height: h, rx: 12, fill: color, 'fill-opacity': .07, stroke: color, 'stroke-opacity': .55, 'stroke-width': 1.4 }, B.dyn));
      B.tex(V(x + w / 2, y - 16), head, { size: 13.5, color, w: w + 20, anchor: 'mid' });
      B.tex(V(x + w / 2, y + h / 2 - 8), val, { size: 26, color, w: w, anchor: 'mid' });
      B.tex(V(x + w / 2, y + h - 18), sub, { size: 11.5, color: '#93a1b5', w: w + 30, anchor: 'mid' });
    };
    box(58, 96, 176, 116, '#ffd166', '明文 $m$', `$${m}$`, '要发送的报文');
    box(332, 96, 176, 116, '#c084fc', '密文 $c\\equiv m^{e}$', `$${c}$`, '可以公开传输');
    box(606, 96, 176, 116, '#4ade80', '还原 $c^{d}$', `$${back}$`, ok ? '与原文相同' : '与原文不符');
    B.arrow(V(240, 154), V(326, 154), { stroke: '#8fa3bd', 'stroke-width': 1.8, head: 11 });
    B.arrow(V(514, 154), V(600, 154), { stroke: '#8fa3bd', 'stroke-width': 1.8, head: 11 });
    B.tex(V(282, 136), '加密 $c=m^{e}\\bmod n$', { size: 12, color: '#93a1b5', w: 110, anchor: 'mid' });

    // 密钥一行
    B.dyn.appendChild(mk('rect', { x: 58, y: 250, width: 724, height: 88, rx: 10, fill: '#8fa3bd', 'fill-opacity': .05, stroke: '#8fa3bd', 'stroke-opacity': .28 }, B.dyn));
    B.tex(V(80, 278), `$n=pq=${p}\\cdot${q}=${n}$`, { size: 14, color: '#5cadff', w: 240 });
    B.tex(V(80, 312), `$\\varphi(n)=(${p}-1)(${q}-1)=${ph}$`, { size: 14, color: '#aebdd2', w: 300 });
    B.tex(V(430, 278), `$e=${e}$，$\\gcd(e,\\varphi)=1$`, { size: 14, color: '#ffd166', w: 220 });
    B.tex(V(430, 312), `$d=${d}$，$ed\\equiv1\\ (\\mathrm{mod}\\ ${ph})$`, { size: 14, color: '#4ade80', w: 260 });

    B.tex(V(80, 372), '公钥 $(' + n + ',' + e + ')$ 公开，私钥 $d$ 保密', { size: 13, color: '#93a1b5', w: 420 });
    B.tex(V(80, 400), `校验：$(${c})^{${d}}\\bmod ${n}=${back}$，$(${m})^{${e}}\\bmod ${n}=${c}$`, { size: 12.5, color: '#aebdd2', w: 620 });

    B.tex(V(W / 2, 444), '加密与解密互为逆运算，靠的是 $ed\\equiv1\\ (\\mathrm{mod}\\ \\varphi(n))$，而 $\\varphi(n)$ 只有知道 $p,q$ 才算得出', { size: 12.5, color: '#93a1b5', w: 780, anchor: 'mid' });

    cPub(`$(${n},${e})$`, '');
    cC(`$${c}$`, '');
    cJ(ok ? '往返还原成功' : '核对失败', ok ? 'ok' : 'warn');
  };

  B.slider('素数 p', 0, 3, 1, st.pi, s => { st.pi = Math.round(s); B.render(); });
  B.slider('素数 q', 0, 3, 1, st.qi, s => { st.qi = Math.round(s); B.render(); });
  B.slider('公钥 e', 3, 12, 1, st.e, s => { st.e = Math.round(s); B.render(); });
  B.slider('报文 m', 0, 40, 1, st.m, s => { st.m = Math.round(s); B.render(); });
  B.hintM('报文先进紫色框、再进绿色框：两段各取一次模幂，绿色框里的数与原文完全一致');
  B.render();
  return B;
}
