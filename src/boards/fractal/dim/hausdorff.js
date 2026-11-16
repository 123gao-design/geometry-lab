/* 图 维4 · 豪斯多夫测度机
   左图把康托集逐层搭出来：第 j 层是 2^j 条长 3^{-j} 的区间，当前层涂金，正是它被拿来当覆盖。
   右图画 F_k(s) = Σ(直径)^s = 2^k·3^{-ks} 的对数曲线：每条是一条直线，全部穿过 (log2/log3, 1)。
   s 小于维数时曲线往上飞，大于维数时往下掉，只有临界指数上测度既不零也不无穷——这个指数就是豪斯多夫维数。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const D = Math.log(2) / Math.log(3);
const intervalsAt = j => {
  let a = [[0, 1]];
  for (let t = 0; t < j; t++) {
    const n = [];
    for (const [p, q] of a) { const L = (q - p) / 3; n.push([p, p + L], [q - L, q]); }
    a = n;
  }
  return a;
};

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 4, s: 0.63 };
  const cK = B.chipM('层数 $k$'), cN = B.chipM('覆盖数 $N$'), cDe = B.chipM('直径 $\\delta$'),
    cF = B.chipM('$\\sum\\delta^{s}$'), cD = B.chipM('维数估计');
  const L = [24, 20, 380, 392], R = [420, 20, 376, 392];
  const mR = B.mapFit(0.2, 1.2, -3.2, 3.2, R, 30);

  B.renderFn = () => {
    const k = st.k, s = st.s;
    const x0 = L[0] + 30, x1 = L[0] + L[2] - 30;
    const px = x => x0 + x * (x1 - x0);
    const y0 = L[1] + 26, rowH = (L[3] - 60) / Math.max(k + 1, 3);

    // 左：逐层的康托构造
    for (let j = 0; j <= k; j++) {
      const y = y0 + (j + .5) * rowH, iv = intervalsAt(j), cur = j === k;
      for (const [a, b] of iv)
        B.seg(V(px(a), y), V(px(b), y), { stroke: cur ? '#ffd166' : '#67e8f9', 'stroke-width': cur ? 7 : 3, 'stroke-opacity': cur ? 1 : .45, 'stroke-linecap': 'round' });
      B.text(V(x0 - 12, y + 4), String(j), { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'end' });
    }
    B.tex(V(x0, y0 + (k + .5) * rowH + rowH + 6), '$k$ 层的区间当作直径 $\\delta=3^{-k}$ 的覆盖', { size: 12, color: '#93a1b5', w: 320 });

    // 右：F_k(s) 的对数曲线
    B.grid({ ...mR, sx: 0.2, sy: 1, lx: .2, ly: 1, axLab: 's', ayLab: 'lg F' });
    B.seg(V(mR.px(mR.X0), mR.py(0)), V(mR.px(mR.X1), mR.py(0)), { stroke: '#8fa3bd', 'stroke-width': 1.1, 'stroke-opacity': .65 });
    const yOf = (j, ss) => j * Math.log10(2) - j * ss * Math.log10(3);
    for (let j = 1; j <= k; j++) {
      const cur = j === k;
      const yy = yOf(j, mR.X0), yz = yOf(j, mR.X1);
      B.seg(V(mR.px(mR.X0), mR.py(Math.max(-3.2, Math.min(3.2, yy)))), V(mR.px(mR.X1), mR.py(Math.max(-3.2, Math.min(3.2, yz)))),
        { stroke: cur ? '#67e8f9' : '#67e8f9', 'stroke-width': cur ? 2.4 : 1.1, 'stroke-opacity': cur ? 1 : .3 });
    }
    // 临界指数竖线与当前 (s, F) 点
    B.seg(V(mR.px(D), mR.py(-3.2)), V(mR.px(D), mR.py(3.2)), { stroke: '#ff7b8a', 'stroke-width': 1.2, 'stroke-dasharray': '4 5', 'stroke-opacity': .8 });
    B.tex(V(mR.px(D) + 6, mR.py(3.2) + 16), '$\\log2/\\log3$', { size: 11, color: '#ff7b8a', w: 90 });
    const yv = Math.max(-3.2, Math.min(3.2, yOf(k, s)));
    B.dot(V(mR.px(s), mR.py(yv)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.tex(V(mR.px(s) + 10, mR.py(yv) - 14), '$F_{' + k + '}=' + fmt(Math.pow(10, yv), 3) + '$', { size: 11, color: '#ffd166', w: 120 });

    cK(`$${k}$`, '');
    cN(`$${Math.pow(2, k)}$`, '');
    cDe(`$${fmt(Math.pow(3, -k), 4)}$`, '');
    cF(`$${fmt(Math.pow(10, yv), 3)}$`, yv > 0 ? 'bad' : 'good');
    cD(`$${fmt(D, 4)}$`, 'good');
    B.hintM(s < D - .01 ? '$s$ 小于维数：$F_k$ 随 $k$ 猛涨，$s$ 维测度无穷' : s > D + .01 ? '$s$ 大于维数：$F_k$ 迅速衰减，$s$ 维测度为零' : '正好卡在临界指数上：每一层都满足 $F_k=1$，测度既不零也不无穷');
  };

  B.slider('层数 k', 1, 7, 1, st.k, v => { st.k = Math.round(v); B.render(); }, 'k');
  B.slider('指数 s', 0.2, 1.2, 0.01, st.s, v => { st.s = v; B.render(); }, 's');

  B.render();
  return B;
}
