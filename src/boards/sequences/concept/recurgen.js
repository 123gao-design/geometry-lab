/* 图 数2 · 递推生成机
   递推公式 = 初始项 + 相邻项之间的关系。点「下一步」向右推出一项：
   参与运算的已知项以橙框标出，刚推出的一项以金框标出，其余卡片为蓝框。
   四种预设：等差型、等比型、斐波那契（二阶）、累加型；各预先把前 8 项算好，逐项显示。
   局部坐标：8 张卡片，卡片宽 78、间距 25.6，起点 x=34，纵向 y∈[112,176]。 */
import { Board, mk, V } from '../../../lib/board.js';

const IDX = ['₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈'];

export function createBoard(root) {
  const W = 860, H = 380;
  const B = new Board(root, W, H);
  const st = { mode: 0, cnt: 3 };
  const PRE = [
    { nm: '① $a_1=1,\\ a_{n+1}=a_n+2$', ex: '$a_1=1,\\ a_{n+1}=a_n+2$', T: [1, 3, 5, 7, 9, 11, 13, 15], ord: 1,
      eq: (k, A) => `$a_{${k}}=a_{${k - 1}}+2=${A[k - 2]}+2=${A[k - 1]}$`, jd: '每一项比前一项多 2' },
    { nm: '② $a_1=1,\\ a_{n+1}=2a_n$', ex: '$a_1=1,\\ a_{n+1}=2a_n$', T: [1, 2, 4, 8, 16, 32, 64, 128], ord: 1,
      eq: (k, A) => `$a_{${k}}=2a_{${k - 1}}=2\\times${A[k - 2]}=${A[k - 1]}$`, jd: '每一项是前一项的 2 倍' },
    { nm: '③ $a_1=a_2=1,\\ a_{n+1}=a_n+a_{n-1}$', ex: '$a_1=a_2=1,\\ a_{n+1}=a_n+a_{n-1}$',
      T: [1, 1, 2, 3, 5, 8, 13, 21], ord: 2,
      eq: (k, A) => `$a_{${k}}=a_{${k - 1}}+a_{${k - 2}}=${A[k - 2]}+${A[k - 3]}=${A[k - 1]}$`, jd: '每一项是前两项之和' },
    { nm: '④ $a_1=1,\\ a_{n+1}=a_n+n$', ex: '$a_1=1,\\ a_{n+1}=a_n+n$', T: [1, 2, 4, 7, 11, 16, 22, 29], ord: 1,
      eq: (k, A) => `$a_{${k}}=a_{${k - 1}}+${k - 1}=${A[k - 2]}+${k - 1}=${A[k - 1]}$`, jd: '每次加上的数依次为 1, 2, 3, …' },
  ];
  const X0 = 34, CW = 78, STEP = 103.6, CY0 = 112, CH = 64;
  const cx = i => X0 + i * STEP + CW / 2;
  const cR = B.chipM('递推式'), cV = B.chipM('第 n 项'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const p = PRE[st.mode], n = st.cnt, A = p.T.slice(0, n);
    B.tex(V(W / 2, 30), p.nm, { size: 15.5, anchor: 'mid', w: 660 });
    // 卡片
    for (let i = 0; i < n; i++) {
      const isNew = i === n - 1;
      const isSrc = i === n - 2 || (p.ord === 2 && i === n - 3);
      const x = X0 + i * STEP;
      mk('rect', {
        x, y: CY0, width: CW, height: CH, rx: 10,
        fill: isNew ? '#ffd166' : '#5cadff', 'fill-opacity': isNew ? .16 : .08,
        stroke: isNew ? '#ffd166' : isSrc ? '#ff9e4a' : '#5cadff',
        'stroke-width': isNew ? 2.6 : isSrc ? 2.2 : 1.4,
      }, B.dyn);
      B.text(V(cx(i), CY0 - 12), `a${IDX[i]}`, { 'font-size': 12, fill: '#93a1b5' });
      B.text(V(cx(i), CY0 + 40), String(A[i]), { 'font-size': 18, 'font-weight': 700, fill: isNew ? '#ffd166' : '#5cadff' });
    }
    // 一阶递推：相邻两项之间的箭头
    if (p.ord === 1) for (let i = 0; i < n - 1; i++)
      B.arrow(V(X0 + i * STEP + CW + 2, CY0 + CH / 2), V(X0 + (i + 1) * STEP - 2, CY0 + CH / 2),
        { stroke: '#4ade80', 'stroke-width': 1.6, head: 8, wide: 4.5 });
    // 生成式（数值代入）
    if (n >= (p.ord === 2 ? 3 : 2)) B.tex(V(W / 2, 222), p.eq(n, A), { size: 15, anchor: 'mid', w: 560, color: '#ffd166' });
    else B.tex(V(W / 2, 222), p.ord === 2 ? '前两项由题目给出，从第 3 项起才能用递推式' : '首项由题目给出，从第 2 项起才能用递推式',
      { size: 14, anchor: 'mid', w: 660, color: '#93a1b5' });
    cR(p.ex);
    cV(`$a_{${n}}=${A[n - 1]}$`);
    cJ(p.jd + (n < 8 ? '' : '（已推到第 8 项）'));
  };

  const btns = PRE.map((p, i) => B.btnM(p.nm, () => {
    st.mode = i; st.cnt = 3;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.btn('下一步 ▶', () => { if (st.cnt < 8) st.cnt++; B.render(); });
  B.btn('重置', () => { st.cnt = 3; B.render(); });

  B.hint('点「下一步」再推出一项：橙框是参与运算的已知项，金框是刚得出的一项');
  B.render();
  return B;
}
