/* 图 定2 · 欧拉函数机
   把 1..n 排成格阵：与 n 互素的数染绿，共享因子的数转灰。
   绿色格子的个数就是 φ(n)；右侧按 n 的质因数分解套公式 n(1−1/p₁)(1−1/p₂)… 逐项算出同一个数。
   滑块：n（6..36）。 */
import { Board, V, mk } from '../../../lib/board.js';

const gcd = (x, y) => { while (y) { const t = x % y; x = y; y = t; } return x; };
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
  const st = { n: 24 };

  const cPhi = B.chipM('$\\varphi(n)$'), cF = B.chipM('按质因数算'), cJ = B.chipM('判读');
  const cw = 42, ch = 36, X0 = 50, Y0 = 52, COLS = 8;

  B.renderFn = () => {
    const n = st.n;
    const cop = [];
    for (let k = 1; k <= n; k++) if (gcd(k, n) === 1) cop.push(k);
    const fac = factor(n);
    let phi = n;
    fac.forEach(([p]) => { phi = phi / p * (p - 1); });

    for (let k = 1; k <= n; k++) {
      const c = (k - 1) % COLS, r = Math.floor((k - 1) / COLS);
      const x = X0 + c * cw, y = Y0 + r * ch;
      const ok = gcd(k, n) === 1;
      B.dyn.appendChild(mk('rect', {
        x, y, width: cw - 4, height: ch - 4, rx: 6,
        fill: ok ? '#4ade80' : '#8fa3bd', 'fill-opacity': ok ? .18 : .05,
        stroke: ok ? '#4ade80' : '#8fa3bd', 'stroke-opacity': ok ? .9 : .22, 'stroke-width': ok ? 1.4 : 1,
      }, B.dyn));
      B.tex(V(x + (cw - 4) / 2, y + (ch - 4) / 2), `$${k}$`, { size: 12.5, color: ok ? '#4ade80' : '#93a1b5', w: 30, anchor: 'mid' });
    }

    const RX = 500;
    const facTex = fac.map(([p, e]) => e > 1 ? `${p}^{${e}}` : `${p}`).join('\\times');
    B.tex(V(RX, 62), `$n=${n}=${facTex}$`, { size: 15, color: '#c084fc', w: 280 });
    B.tex(V(RX, 104), `$\\varphi(${n})=${n}\\times${fac.map(([p]) => `\\left(1-\\dfrac1{${p}}\\right)`).join('\\times')}$`, { size: 13.5, color: '#aebdd2', w: 320 });
    B.tex(V(RX, 158), `$\\varphi(${n})=${phi}$`, { size: 18, color: '#4ade80', w: 260 });
    B.tex(V(RX, 200), '绿色格子数 = 列表里互素的个数', { size: 12.5, color: '#4ade80', w: 300 });
    B.tex(V(RX, 238), `与 ${n} 互素的数：`, { size: 12.5, color: '#93a1b5', w: 300 });
    const list = cop.slice(0, 18).join('\\,');
    B.tex(V(RX, 268), `$${list}${cop.length > 18 ? '\\cdots' : ''}$`, { size: 12.5, color: '#aebdd2', w: 300 });
    B.tex(V(RX, 322), '公式：每个素因子 p 划去 1/p 的比例', { size: 12, color: '#93a1b5', w: 310 });

    B.tex(V(W / 2, 426), '绿色是与 n 互素的数：个数按质因子逐个打折，n 与 p 无关的部分原样保留', { size: 12.5, color: '#93a1b5', w: 700, anchor: 'mid' });

    cPhi(`$\\varphi(${n})=${phi}$`, '');
    cF(`$${n}\\prod\\left(1-\\dfrac1p\\right)=${phi}$`, '');
    cJ(cop.length === phi ? '两种算法一致' : '核对失败', cop.length === phi ? 'ok' : 'warn');
  };

  B.slider('n', 6, 36, 1, st.n, s => { st.n = Math.round(s); B.render(); });
  B.hintM('绿色格子是与 $n$ 互素的数；拖动 $n$，格子数与公式算出的 $\\varphi(n)$ 总相等');
  B.render();
  return B;
}
