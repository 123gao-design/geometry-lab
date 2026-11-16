/* 图 项2 · 杨辉三角与系数性质
   每一行的第 k 个数是 C(n,k)，两端都是 1，中间每个数等于肩上两数之和。
   同一行里 C(n,k)=C(n,n−k) 成对相等，系数从两端向中间先增后减，中间一项（或两项）最大；
   整行系数相加得 2^n。画布把 0..6 行并排铺开，选中项与它的对称项分别标成金色与蓝色。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { n: 5, k: 1 };
  const cR = B.chipM('本行'), cK = B.chipM('选中项'), cS = B.chipM('对称项'), cJ = B.chipM('判读');

  const CN = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };

  B.renderFn = () => {
    const { n, k } = st, kk2 = n - k;
    for (let row = 0; row <= 6; row++) {
      const y = 84 + row * 46;
      for (let c = 0; c <= row; c++) {
        const x = 410 + (c - row / 2) * 56;
        const on = row === n && (c === k || c === kk2);
        if (on) {
          B.dyn.appendChild(mk('circle', {
            cx: x, cy: y - 4, r: 13,
            fill: c === k ? 'rgba(255,209,102,.55)' : 'rgba(92,173,255,.05)',
            'fill-opacity': c === k ? .5 : 1,
            stroke: c === k ? '#ffd166' : '#5cadff', 'stroke-width': 1.5,
          }, B.dyn));
        }
        B.text(V(x, y), `${CN(row, c)}`, {
          fill: on ? (c === k ? '#ffd166' : '#5cadff') : row === n ? '#c8d4e4' : '#5c6a80',
          'font-size': on ? 13.5 : 12, 'font-weight': on ? 700 : 400,
        });
      }
    }

    const rowSum = 2 ** n;
    cR(`第 ${n} 行共 ${n + 1} 项，和 $2^{${n}}=${rowSum}$`);
    cK(`$\\mathrm{C}_{${n}}^{${k}}=${CN(n, k)}$`);
    cS(`$\\mathrm{C}_{${n}}^{${kk2}}=${CN(n, kk2)}$`);
    cJ(n % 2 ? 'n 为奇数：正中间两项并列最大，两端的 1 最小，系数先增后减'
      : 'n 为偶数：正中间一项最大，向两端逐项减小，两端都是 1');
  };

  const kS = B.slider('第几个系数 k', 0, 6, 1, st.k, v => { st.k = Math.min(v, st.n); if (v > st.n) kS.sync(st.n); B.render(); }, 'k');
  const nS = B.slider('行号 n', 0, 6, 1, st.n, v => { st.n = v; if (st.k > v) { st.k = v; kS.sync(v); } B.render(); }, 'n');

  B.hint('选中一项：与它对称的那一项相等，整行系数相加是 2 的 n 次方');
  B.render();
  return B;
}
