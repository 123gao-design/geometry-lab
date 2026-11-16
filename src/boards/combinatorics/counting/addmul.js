/* 图 计1 · 分类加法与分步乘法计数原理
   分类：从甲地到乙地，m 种火车与 n 种飞机互不重叠，任选其一即可到达，总数 m+n。
   分步：先到中转站再到底站，第一段 m 条、第二段 n 条，两段依次选定，总数 m×n。
   蓝为第一类 / 第一步，橙为第二类 / 第二步。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { mode: 0, m: 3, n: 2 };
  const cN = B.chipM('计数结果'), cP = B.chipM('原理式'), cJ = B.chipM('判读');

  const head = (P, ang, color, s = 8) => {
    const tx = Math.cos(ang), ty = Math.sin(ang), nx = -ty, ny = tx;
    B.dyn.appendChild(mk('polygon', {
      points: [P, { x: P.x - s * tx + s * .42 * nx, y: P.y - s * ty + s * .42 * ny },
        { x: P.x - s * tx - s * .42 * nx, y: P.y - s * ty - s * .42 * ny }]
        .map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
      fill: color, stroke: 'none',
    }, B.dyn));
  };
  const arc = (S, K, E, color, wd = 1.9, op = .9) => B.dyn.appendChild(mk('path', {
    d: `M ${S.x.toFixed(1)} ${S.y.toFixed(1)} Q ${K.x.toFixed(1)} ${K.y.toFixed(1)} ${E.x.toFixed(1)} ${E.y.toFixed(1)}`,
    fill: 'none', stroke: color, 'stroke-width': wd, 'stroke-opacity': op,
  }, B.dyn));

  B.renderFn = () => {
    const m = st.m, n = st.n;
    if (st.mode === 0) {
      const A = V(92, 240), C = V(728, 240);
      for (let k = 0; k < m; k++) {
        const K = V(410, 240 - 84 - k * 46);
        arc(A, K, C, '#5cadff');
        head(C, Math.atan2(C.y - K.y, C.x - K.x), '#5cadff');
      }
      for (let k = 0; k < n; k++) {
        const K = V(410, 240 + 84 + k * 46);
        arc(A, K, C, '#ff9e4a');
        head(C, Math.atan2(C.y - K.y, C.x - K.x), '#ff9e4a');
      }
      B.dot(A, 4, { fill: '#aebdd2' });
      B.dot(C, 4, { fill: '#aebdd2' });
      B.text(V(A.x, A.y - 28), '甲地', { fill: '#aebdd2', 'font-size': 13 });
      B.text(V(C.x, C.y - 28), '乙地', { fill: '#aebdd2', 'font-size': 13 });
      B.text(V(410, 198 - 23 * (m - 1) - 26), `火车 ${m} 种`, { fill: '#5cadff', 'font-size': 13 });
      B.text(V(410, 282 + 23 * (n - 1) + 30), `飞机 ${n} 种`, { fill: '#ff9e4a', 'font-size': 13 });

      cN(`$${m}+${n}=${m + n}$ 种走法`);
      cP('$N=m+n$');
      cJ(`火车 ${m} 种与飞机 ${n} 种互不重叠，任选一种就能到乙地，共 ${m + n} 种`);
    } else {
      const A = V(88, 250), M = V(410, 250), C = V(732, 250);
      for (let k = 0; k < m; k++) {
        const K1 = V(249, 250 - 70 - k * 40);
        const gold = k === 0;
        arc(A, K1, M, gold ? '#ffd166' : '#5cadff', gold ? 3.2 : 1.9, gold ? 1 : .9);
        head(M, Math.atan2(M.y - K1.y, M.x - K1.x), gold ? '#ffd166' : '#5cadff');
      }
      for (let k = 0; k < n; k++) {
        const K2 = V(571, 250 - 70 - k * 40);
        const gold = k === 0;
        arc(M, K2, C, gold ? '#ffd166' : '#ff9e4a', gold ? 3.2 : 1.9, gold ? 1 : .9);
        head(C, Math.atan2(C.y - K2.y, C.x - K2.x), gold ? '#ffd166' : '#ff9e4a');
      }
      B.dot(A, 4, { fill: '#aebdd2' });
      B.dot(M, 4, { fill: '#aebdd2' });
      B.dot(C, 4, { fill: '#aebdd2' });
      B.text(V(A.x, A.y + 30), '甲地', { fill: '#aebdd2', 'font-size': 13 });
      B.text(V(M.x, M.y + 30), '中转站', { fill: '#aebdd2', 'font-size': 13 });
      B.text(V(C.x, C.y + 30), '乙地', { fill: '#aebdd2', 'font-size': 13 });
      B.text(V(249, 250 - 70 - 20 * (m - 1) - 44), `第一步 ${m} 条`, { fill: '#5cadff', 'font-size': 13 });
      B.text(V(571, 250 - 70 - 20 * (n - 1) - 44), `第二步 ${n} 条`, { fill: '#ff9e4a', 'font-size': 13 });

      cN(`$${m}\\times${n}=${m * n}$ 种走法`);
      cP('$N=m\\times n$');
      cJ(`第一段 ${m} 条各配第二段 ${n} 条，两段都选定才到乙地，共 ${m * n} 种`);
    }
  };

  B.slider('第一组 m', 1, 4, 1, st.m, v => { st.m = v; B.render(); }, 'm');
  B.slider('第二组 n', 1, 4, 1, st.n, v => { st.n = v; B.render(); }, 'n');

  const btns = [
    ['① 分类，用加法', 0], ['② 分步，用乘法', 1],
  ].map(([nm, md], i) => B.btn(nm, () => {
    st.mode = md;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('拖滑块改条数：各类互不重叠就相加，各步依次进行就相乘');
  B.render();
  return B;
}
