/* 图 排1 · 组合数与排列数的比
   从 n 个不同元素里取 m 个，不计顺序，叫一种组合。把每种取法内部的 m 个元素任意排，
   恰好铺出 m! 个排列，所以 A(n,m)=C(n,m)·m!。
   画布把 A(n,m) 个排列排成一格一格：同一列里的 m! 个只差元素顺序，算同一种取法，列数就是组合数。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 420;
  const B = new Board(root, W, H);
  const st = { n: 5, m: 2 };
  const cC = B.chipM('组合数'), cA = B.chipM('排列数'), cJ = B.chipM('判读');

  const fact = k => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; };
  const CN = (n, m) => { let r = 1; for (let i = 0; i < m; i++) r = r * (n - i) / (i + 1); return Math.round(r); };

  B.renderFn = () => {
    const { n, m } = st;
    const mf = fact(m), cols = CN(n, m), rows = mf;

    // 元素池：前 m 个是这次取出的
    const px = j => 410 + (j - (n - 1) / 2) * 48;
    for (let j = 0; j < n; j++) {
      const on = j < m;
      B.dyn.appendChild(mk('circle', {
        cx: px(j), cy: 52, r: 16,
        fill: on ? 'rgba(255,209,102,.55)' : 'rgba(139,163,189,.05)',
        stroke: on ? '#ffd166' : '#5c6a80', 'stroke-width': on ? 1.8 : 1.1,
      }, B.dyn));
      B.text(V(px(j), 57), `${j + 1}`, { fill: on ? '#ffd166' : '#aebdd2', 'font-size': 13 });
    }
    B.text(V(410, 88), `元素池 ${n} 个，金色 ${m} 个是一种取法`, { fill: '#8fa3bd', 'font-size': 12 });

    // 排列格子：每列一种取法
    const cw = 16, ch = 16, gh = rows * ch;
    const x0 = 410 - cols * cw / 2, y0 = 128;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        B.dyn.appendChild(mk('rect', {
          x: x0 + c * cw + 1, y: y0 + r * ch + 1, width: 13, height: 13, rx: 3,
          fill: c === 0 ? '#ffd166' : 'rgba(92,173,255,.05)',
          stroke: c === 0 ? '#ffd166' : '#3f5f8f', 'stroke-width': 1,
          'fill-opacity': c === 0 ? .85 : 1,
        }, B.dyn));
      }
    }
    B.tex(V(x0, y0 - 12), `共 $${cols}$ 列`, { size: 12.5, anchor: 'mid', color: '#5cadff', w: 120 });
    B.tex(V(x0 - 14, y0 + gh / 2), `$${m}!=${mf}$`, { size: 12.5, anchor: 'end', color: '#ffd166', w: 120 });
    B.text(V(410, y0 + gh + 26), `一列 ${mf} 格只差顺序，算同一种取法；${cols} 列就是 ${cols} 种`, { fill: '#8fa3bd', 'font-size': 12.5 });

    cC(`$\\mathrm{C}_{${n}}^{${m}}=${cols}$`);
    cA(`$\\mathrm{A}_{${n}}^{${m}}=${cols}\\times${mf}=${cols * mf}$`);
    cJ(m === 1 ? '取 1 个时无所谓顺序，组合数与排列数相等'
      : `每种取法内部可排出 ${mf} 种顺序，排列数除以 ${mf} 才回到 ${cols} 种取法`);
  };

  B.slider('取出个数 m', 1, 3, 1, st.m, v => { st.m = v; B.render(); }, 'm');
  B.slider('元素个数 n', 4, 6, 1, st.n, v => { st.n = v; B.render(); }, 'n');

  B.hint('同一列 m! 个格子只差元素顺序：排列数除以 m! 就是组合数');
  B.render();
  return B;
}
