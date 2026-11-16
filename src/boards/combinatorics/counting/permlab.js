/* 图 计2 · 排列数与分步相乘
   n 个不同元素里依次取出 m 个排成一列：第 1 位有 n 种选法，第 2 位剩 n−1 种……
   共 m 个因子相乘，即 A(n,m)=n(n−1)…(n−m+1)=n!/(n−m)!。
   上方 m 个格子按位列出可选数，下方 n 个圆片是元素池，金色虚线连出其中一种排法。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 400;
  const B = new Board(root, W, H);
  const st = { n: 5, m: 3 };
  const cA = B.chipM('排列数'), cF = B.chipM('阶乘式'), cJ = B.chipM('判读');

  const boxX = k => 410 + (k - (st.m - 1) / 2) * 76;
  const poolX = j => 410 + (j - (st.n - 1) / 2) * 60;

  B.renderFn = () => {
    const { n, m } = st;
    const N = Array.from({ length: m }, (_, k) => n - k).reduce((a, b) => a * b, 1);

    // 元素池与格子的连线（金色虚线，一种具体排法：第 k+1 位取第 k+1 号元素）
    for (let k = 0; k < m; k++) {
      B.dyn.appendChild(mk('path', {
        d: `M ${poolX(k).toFixed(1)} 269 Q ${((poolX(k) + boxX(k)) / 2).toFixed(1)} 190 ${boxX(k).toFixed(1)} 124`,
        fill: 'none', stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-opacity': .38,
        'stroke-dasharray': '5 4',
      }, B.dyn));
    }

    // 上方格子
    for (let k = 0; k < m; k++) {
      const x = boxX(k);
      B.dyn.appendChild(mk('rect', {
        x: x - 31, y: 60, width: 62, height: 64, rx: 11,
        fill: 'rgba(92,173,255,.05)', stroke: '#5cadff', 'stroke-width': 1.4,
      }, B.dyn));
      B.text(V(x, 100), `${k + 1}`, { fill: '#ffd166', 'font-size': 22, 'font-weight': 700 });
      B.text(V(x, 148), `${n - k} 种`, { fill: '#5cadff', 'font-size': 12 });
      if (k < m - 1) B.text(V(x + 38, 148), '×', { fill: '#93a1b5', 'font-size': 13 });
    }

    // 下方元素池
    for (let j = 0; j < n; j++) {
      const x = poolX(j), on = j < m;
      B.dyn.appendChild(mk('circle', {
        cx: x, cy: 286, r: 17,
        fill: on ? 'rgba(255,209,102,.55)' : 'rgba(139,163,189,.05)',
        stroke: on ? '#ffd166' : '#5c6a80', 'stroke-width': on ? 1.8 : 1.1,
      }, B.dyn));
      B.text(V(x, 291), `${j + 1}`, { fill: on ? '#ffd166' : '#aebdd2', 'font-size': 13 });
    }
    B.text(V(410, 332), `共 ${n} 个不同的元素，依次取出 ${m} 个排成一列`, { fill: '#8fa3bd', 'font-size': 12.5 });

    const factors = Array.from({ length: m }, (_, k) => n - k);
    cA(`$\\mathrm{A}_{${n}}^{${m}}=${factors.join('\\times')}=${N}$`);
    cF(`$\\dfrac{${n}!}{${n - m}!}=${N}$`);
    cJ(m === n ? `全排列：${n} 个元素全部取出，每位选法依次减 1 直到 1，结果是 ${n}! = ${N}`
      : m === 1 ? '只取一个元素排成一列，选法就是元素的个数本身'
        : `第 1 位有 ${n} 种选法，排定一位后少一个元素可选，共 ${m} 个因子连乘`);
  };

  const mS = B.slider('取出个数 m', 1, 6, 1, st.m, v => {
    st.m = Math.min(v, st.n);
    if (v > st.n) mS.sync(st.n);
    B.render();
  }, 'm');
  const nS = B.slider('元素个数 n', 3, 6, 1, st.n, v => {
    st.n = v;
    if (st.m > v) { st.m = v; mS.sync(v); }
    B.render();
  }, 'n');

  const PRE = [
    { nm: '① $\\mathrm{A}_5^3$', n: 5, m: 3 },
    { nm: '② $\\mathrm{A}_4^4$ 全排列', n: 4, m: 4 },
  ];
  const btns = PRE.map((p, i) => B.btnM(p.nm, () => {
    st.n = p.n; st.m = p.m;
    nS.sync(p.n); mS.sync(p.m);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('每位可选数依次减 1，格下的因子连乘就是排列数');
  B.render();
  return B;
}
