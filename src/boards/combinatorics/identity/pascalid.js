/* 图 恒1 · 网格路径与帕斯卡恒等式
   从 (0,0) 走到 (m,n)，每步只能向右或向上，共 m+n 步，其中 m 步向右，
   路径数就是 C(m+n,m)。每个格点上的数等于它左边与下边两个数之和——
   这正是帕斯卡恒等式 C(n,k)=C(n−1,k−1)+C(n−1,k) 的网格版本。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { m: 2, n: 3 };
  const cP = B.chipM('路径数'), cR = B.chipM('递推'), cJ = B.chipM('判读');

  const CN = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return Math.round(r); };

  B.renderFn = () => {
    const { m, n } = st;
    const s = Math.min(560 / m, 300 / n, 76);
    const gx0 = 410 - m * s / 2, gy1 = 356;
    const P = (i, j) => V(gx0 + i * s, gy1 - j * s);

    for (let i = 0; i <= m; i++) {
      const a = P(i, 0), b = P(i, n);
      B.dyn.appendChild(mk('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn));
    }
    for (let j = 0; j <= n; j++) {
      const a = P(0, j), b = P(m, j);
      B.dyn.appendChild(mk('line', { x1: a.x, y1: a.y, x2: b.x, y2: b.y, stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn));
    }

    // 一条具体的走法：先横后竖交替
    const pts = [], end = P(m, n);
    let i = 0, j = 0;
    pts.push(P(0, 0));
    while (i < m || j < n) {
      if (j >= n || (i < m && (i + j) % 2 === 0)) i++; else j++;
      pts.push(P(i, j));
    }
    B.dyn.appendChild(mk('polyline', {
      points: pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
      fill: 'none', stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95,
    }, B.dyn));

    // 格点上的路径数
    for (let a = 0; a <= m; a++) {
      for (let b = 0; b <= n; b++) {
        const p = P(a, b);
        const isEnd = a === m && b === n;
        const near = (a === m - 1 && b === n) || (a === m && b === n - 1);
        if (isEnd || near) {
          B.dyn.appendChild(mk('circle', {
            cx: p.x, cy: p.y, r: 13,
            fill: isEnd ? 'rgba(255,209,102,.55)' : 'rgba(92,173,255,.05)',
            'fill-opacity': isEnd ? .4 : 1,
            stroke: isEnd ? '#ffd166' : '#5cadff', 'stroke-width': 1.5,
          }, B.dyn));
        }
        B.text(V(p.x, p.y + 4), `${CN(a + b, a)}`, {
          fill: isEnd ? '#ffd166' : near ? '#5cadff' : '#8fa3bd',
          'font-size': isEnd || near ? 13 : 10.5, 'font-weight': isEnd || near ? 700 : 400,
        });
      }
    }

    B.text(V(P(m, 0).x + 12, gy1 + 5), 'm', { fill: '#8fa3bd', 'font-size': 12 });
    B.text(V(gx0 - 14, P(0, n).y + 4), 'n', { fill: '#8fa3bd', 'font-size': 12 });
    B.text(V(end.x - 16, end.y - 22), '终点', { fill: '#aebdd2', 'font-size': 12 });

    const A = CN(m + n - 1, m - 1), Bv = CN(m + n - 1, m);
    cP(`$\\mathrm{C}_{${m + n}}^{${m}}=${CN(m + n, m)}$`);
    cR(`$${CN(m + n, m)}=${A}+${Bv}$`);
    cJ(`共 ${m + n} 步，向右的 ${m} 步位置任选，共 ${CN(m + n, m)} 条；终点的数由左边与下边两数相加得到`);
  };

  B.slider('横向 m', 1, 5, 1, st.m, v => { st.m = v; B.render(); }, 'm');
  B.slider('纵向 n', 1, 5, 1, st.n, v => { st.n = v; B.render(); }, 'n');

  B.hint('每个格点的数 = 左边 + 下边：网格上的加法就是帕斯卡恒等式');
  B.render();
  return B;
}
