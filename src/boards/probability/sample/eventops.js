/* 图 概1 · 随机事件的关系与运算
   Ω 里撒 170 个等可能的样本点，A、B 两个圆由两个半径与圆心距三个滑块开合、挪近。
   并事件取蓝点与橙点，交事件只取紫点，A 的对立事件取圆外全部。
   概率按点数占比读数，直接验证 P(A∪B)=P(A)+P(B)−P(A∩B)。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { mode: 0, rA: 96, rB: 96, d: 128 };
  const cA = B.chipM('P(A)'), cB = B.chipM('P(B)'), cAB = B.chipM('P(A∩B)');
  const cU = B.chipM('P(A∪B)'), cJ = B.chipM('判读');

  // 样本点：17×10 的等距点阵，每个点算作 Ω 的一份等可能样本
  const pts = [];
  for (let j = 0; j < 10; j++) for (let i = 0; i < 17; i++) pts.push(V(88 + i * 38, 66 + j * 27));
  const N = pts.length;
  const dist = (p, q) => Math.hypot(p.x - q.x, p.y - q.y);
  const f3 = v => v.toFixed(3);

  B.renderFn = () => {
    const OA = V(335, 192), OB = V(335 + st.d, 192);
    B.dyn.appendChild(mk('rect', {
      x: 60, y: 52, width: 700, height: 280, rx: 10,
      fill: 'rgba(139,163,189,.05)', stroke: '#3f5f8f', 'stroke-width': 1,
    }, B.dyn));
    B.text(V(78, 74), 'Ω', { fill: '#8fa3bd', 'font-size': 14 });

    // 两个事件的区域
    [['#5cadff', OA, st.rA, 'rgba(92,173,255,.05)'], ['#ff9e4a', OB, st.rB, 'rgba(255,158,74,.07)']]
      .forEach(([c, O, r, bg]) => {
        B.dyn.appendChild(mk('circle', {
          cx: O.x, cy: O.y, r, fill: bg, stroke: c, 'stroke-width': 1.8, 'stroke-opacity': .9,
        }, B.dyn));
      });
    B.text(V(OA.x, OA.y - st.rA - 10), 'A', { fill: '#5cadff', 'font-size': 13 });
    B.text(V(OB.x, OB.y - st.rB - 10), 'B', { fill: '#ff9e4a', 'font-size': 13 });

    let nA = 0, nB = 0, nAB = 0;
    pts.forEach(p => {
      const inA = dist(p, OA) <= st.rA, inB = dist(p, OB) <= st.rB;
      if (inA) nA++;
      if (inB) nB++;
      if (inA && inB) nAB++;
      const on = st.mode === 0 ? (inA || inB) : st.mode === 1 ? (inA && inB) : !inA;
      const col = inA && inB ? '#c084fc' : inA ? '#5cadff' : inB ? '#ff9e4a' : '#3f5f8f';
      B.dot(p, on ? 3.4 : 2.1, { fill: col, 'fill-opacity': on ? .95 : .22 });
    });

    const pA = nA / N, pB = nB / N, pAB = nAB / N, pU = (nA + nB - nAB) / N;
    cA(`$\\dfrac{${nA}}{${N}}=${f3(pA)}$`);
    cB(`$\\dfrac{${nB}}{${N}}=${f3(pB)}$`);
    cAB(`$\\dfrac{${nAB}}{${N}}=${f3(pAB)}$`);
    cU(`$\\dfrac{${nA + nB - nAB}}{${N}}=${f3(pU)}$`);
    cJ(nAB === 0
      ? '两圆没有公共样本点，A 与 B 互斥，此时并的概率恰好等于两概率之和'
      : nA === nAB ? 'A 的样本点全落在 B 内，交事件就是 A，并事件就是 B'
        : nB === nAB ? 'B 的样本点全落在 A 内，交事件就是 B，并事件就是 A'
          : `两事件共享 ${nAB} 个样本点，并的概率比两概率之和少 ${f3(pAB)}`);
  };

  B.slider('半径 r_A', 40, 130, 2, st.rA, v => { st.rA = v; B.render(); }, 'rA');
  B.slider('半径 r_B', 40, 130, 2, st.rB, v => { st.rB = v; B.render(); }, 'rB');
  B.slider('圆心距 d', 40, 260, 2, st.d, v => { st.d = v; B.render(); }, 'd');

  const btns = [
    ['① 并事件 A∪B', 0], ['② 交事件 A∩B', 1], ['③ A 的对立事件', 2],
  ].map(([nm, md], i) => B.btn(nm, () => {
    st.mode = md;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('圆一分开就互斥；重叠越多，并的概率越小于两概率之和');
  B.render();
  return B;
}
