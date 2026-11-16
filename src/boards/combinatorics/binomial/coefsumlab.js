/* 图 项3 · 赋值法与系数和
   在 (1+x)^n = C(n,0)+C(n,1)x+…+C(n,n)x^n 里令 x=1，得到全部系数之和 2^n；
   令 x=−1，得到偶次项与奇次项之差 0，两项之和各占一半，都是 2^(n−1)。
   画布把各项系数画成柱：偶次项蓝色、奇次项金色，两半的柱子高矮交错。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { n: 5 };
  const cS = B.chipM('系数和'), cE = B.chipM('偶次项和'), cO = B.chipM('奇次项和'), cJ = B.chipM('判读');

  const CN = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };

  B.renderFn = () => {
    const { n } = st;
    const cs = Array.from({ length: n + 1 }, (_, k) => CN(n, k));
    const maxC = Math.max(...cs), base = 300, sc = 168 / maxC;
    const pitch = 660 / (n + 1), bw = Math.min(56, pitch * .62), x0 = 410 - (n + 1) * pitch / 2 + pitch / 2;

    let even = 0, odd = 0;
    for (let k = 0; k <= n; k++) {
      const x = x0 + k * pitch, h = cs[k] * sc, on = k % 2 === 0;
      if (on) even += cs[k]; else odd += cs[k];
      B.dyn.appendChild(mk('rect', {
        x: x - bw / 2, y: base - h, width: bw, height: h, rx: 4,
        fill: on ? '#5cadff' : '#ffd166', 'fill-opacity': .22,
        stroke: on ? '#5cadff' : '#ffd166', 'stroke-width': 1.3,
      }, B.dyn));
      B.text(V(x, base - h - 9), `${cs[k]}`, { fill: on ? '#5cadff' : '#ffd166', 'font-size': 12 });
      B.tex(V(x, base + 21), `$x^{${k}}$`, { size: 11.5, anchor: 'mid', color: '#8fa3bd', w: 60 });
    }
    B.dyn.appendChild(mk('line', { x1: 60, y1: base, x2: 760, y2: base, stroke: '#5c6a80', 'stroke-width': 1.2 }, B.dyn));

    B.text(V(200, 352), `令 x=1：偶次项 ${even} + 奇次项 ${odd} = ${even + odd}`, { fill: '#aebdd2', 'font-size': 12.5 });
    B.text(V(200, 378), '令 x=−1：偶次项 − 奇次项 = 0', { fill: '#aebdd2', 'font-size': 12.5 });

    cS(`$2^{${n}}=${2 ** n}$`);
    cE(`$${even}=2^{${n - 1}}$`);
    cO(`$${odd}=2^{${n - 1}}$`);
    cJ('两式相加再除以 2 得偶次项和，相减再除以 2 得奇次项和，两半各占一半');
  };

  B.slider('指数 n', 2, 6, 1, st.n, v => { st.n = v; B.render(); }, 'n');

  B.hint('令 x=1 取全部系数和，令 x=−1 取交错和，两式合并就分出奇偶两半');
  B.render();
  return B;
}
