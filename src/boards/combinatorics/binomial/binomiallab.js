/* 图 项1 · 展开式与通项
   (a+b)^n 是 n 个 (a+b) 相乘。每个括号里取 a 或 b，取到 k 个 b 的取法有 C(n,k) 种，
   所以含 a^(n−k)b^k 的项共 C(n,k) 个，这就是通项 T(k+1)=C(n,k)a^(n−k)b^k。
   画布把 n 对括号并排画出：金色是每个括号里真正取走的那一个，前 k 个取 b、其余取 a。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { n: 5, k: 2 };
  const cT = B.chipM('通项'), cC = B.chipM('系数'), cJ = B.chipM('判读');

  const CN = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };

  B.renderFn = () => {
    const { n, k } = st;
    const C = CN(n, k);

    B.tex(V(410, 56), `$(a+b)^{${n}}$`, { size: 16, anchor: 'mid', color: '#e8eef7', w: 200 });

    const sp = 84, x0 = 410 - (n - 1) * sp / 2;
    for (let i = 0; i < n; i++) {
      const x = x0 + i * sp, takeB = i < k;
      B.text(V(x - 25, 176), '(', { fill: '#5c6a80', 'font-size': 34 });
      B.text(V(x + 25, 176), ')', { fill: '#5c6a80', 'font-size': 34 });
      const box = (y, on, color, ch) => {
        B.dyn.appendChild(mk('rect', {
          x: x - 20, y, width: 40, height: 32, rx: 8,
          fill: on ? color : 'rgba(139,163,189,.05)', 'fill-opacity': on ? .22 : 1,
          stroke: on ? color : '#3f5f8f', 'stroke-width': on ? 1.7 : 1,
        }, B.dyn));
        B.text(V(x, y + 23), ch, { fill: on ? color : '#5c6a80', 'font-size': 15, 'font-weight': on ? 700 : 400 });
      };
      box(124, !takeB, '#5cadff', 'a');
      box(166, takeB, '#ffd166', 'b');
    }

    B.text(V(410, 250), `金色是每个括号里取走的那一个：${k} 个 b、${n - k} 个 a`, { fill: '#8fa3bd', 'font-size': 12.5 });
    B.tex(V(410, 292), `$\\mathrm{C}_{${n}}^{${k}}=${C}$ 种取法，合并成一项`, { size: 14, anchor: 'mid', color: '#ffd166', w: 420 });

    cT(`$T_{${k + 1}}=\\mathrm{C}_{${n}}^{${k}}a^{${n - k}}b^{${k}}=${C}a^{${n - k}}b^{${k}}$`);
    cC(`$\\mathrm{C}_{${n}}^{${k}}=${C}$`);
    cJ(`从 ${n} 个括号里挑 ${k} 个取 b，剩下的取 a，共 ${C} 种挑法，同类项合并后系数为 ${C}`);
  };

  const kS = B.slider('取 b 的个数 k', 0, 6, 1, st.k, v => { st.k = Math.min(v, st.n); if (v > st.n) kS.sync(st.n); B.render(); }, 'k');
  const nS = B.slider('指数 n', 2, 6, 1, st.n, v => { st.n = v; if (st.k > v) { st.k = v; kS.sync(v); } B.render(); }, 'n');

  const PRE = [
    { nm: '① $n=5$，$k=2$', n: 5, k: 2 },
    { nm: '② 末项 $n=6$，$k=6$', n: 6, k: 6 },
    { nm: '③ 首项 $k=0$', n: 5, k: 0 },
  ];
  const btns = PRE.map((p, i) => B.btnM(p.nm, () => {
    st.n = p.n; st.k = p.k;
    nS.sync(p.n); kS.sync(p.k);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('每对括号必取一个字母：数一数取到的 b 有几个，就锁定通项的下标');
  B.render();
  return B;
}
