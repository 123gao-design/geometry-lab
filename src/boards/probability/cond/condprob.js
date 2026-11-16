/* 图 独1 · 条件概率与乘法公式
   已知 A 发生，样本空间从整个 Ω 缩到圆 A 内部，概率改成「A 内 B 占多少」。
   右侧两根横条把 P(B) 与 P(B|A) 并排比较：两者相等即 A、B 独立，差得远就不独立。
   点阵与 概1 同一套等可能样本点。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { rA: 92, rB: 92, d: 96 };
  const cB = B.chipM('P(B)'), cAB = B.chipM('P(A∩B)'), cBA = B.chipM('P(B|A)'), cJ = B.chipM('判读');

  const pts = [];
  for (let j = 0; j < 9; j++) for (let i = 0; i < 13; i++) pts.push(V(70 + i * 30, 80 + j * 30));
  const N = pts.length;

  B.renderFn = () => {
    const OA = V(185, 200), OB = V(185 + st.d, 200);
    B.dyn.appendChild(mk('rect', {
      x: 50, y: 56, width: 420, height: 288, rx: 10,
      fill: 'rgba(139,163,189,.05)', stroke: '#3f5f8f', 'stroke-width': 1,
    }, B.dyn));
    B.text(V(66, 78), 'Ω', { fill: '#8fa3bd', 'font-size': 13 });

    B.dyn.appendChild(mk('circle', {
      cx: OB.x, cy: OB.y, r: st.rB, fill: 'rgba(255,158,74,.07)', stroke: '#ff9e4a', 'stroke-width': 1.6, 'stroke-opacity': .85,
    }, B.dyn));
    B.dyn.appendChild(mk('circle', {
      cx: OA.x, cy: OA.y, r: st.rA, fill: 'rgba(92,173,255,.09)', stroke: '#5cadff', 'stroke-width': 2.6,
    }, B.dyn));
    B.text(V(OA.x, OA.y - st.rA - 9), 'A（新的样本空间）', { fill: '#5cadff', 'font-size': 11.5 });
    B.text(V(OB.x, OB.y - st.rB - 9), 'B', { fill: '#ff9e4a', 'font-size': 12.5 });

    let nA = 0, nB = 0, nAB = 0;
    pts.forEach(p => {
      const inA = Math.hypot(p.x - OA.x, p.y - OA.y) <= st.rA;
      const inB = Math.hypot(p.x - OB.x, p.y - OB.y) <= st.rB;
      if (inA) nA++;
      if (inB) nB++;
      if (inA && inB) nAB++;
      const col = inA && inB ? '#c084fc' : inA ? '#5cadff' : inB ? '#ff9e4a' : '#3f5f8f';
      B.dot(p, inA ? 3.4 : 2.1, { fill: col, 'fill-opacity': inA ? .95 : .18 });
    });

    // 右侧两根横条：P(B) 与 P(B|A)
    const pB = nB / N, pBA = nA ? nAB / nA : 0;
    const BX = 560, BW = 220;
    B.text(V(500, 74), '全体里看 B 与 A 内看 B', { fill: '#8fa3bd', 'font-size': 12, 'text-anchor': 'start' });
    [['全体中的 P(B)', pB, '#ff9e4a', 120], ['A 之中的 P(B|A)', pBA, '#c084fc', 210]].forEach(([nm, v, c, y]) => {
      B.text(V(BX, y - 10), nm, { fill: '#8fa3bd', 'font-size': 11.5, 'text-anchor': 'start' });
      B.dyn.appendChild(mk('rect', { x: BX, y, width: BW, height: 22, rx: 5, fill: 'rgba(139,163,189,.05)', stroke: '#3f5f8f', 'stroke-width': 1 }, B.dyn));
      B.dyn.appendChild(mk('rect', { x: BX, y, width: Math.max(2, BW * v), height: 22, rx: 5, fill: c, 'fill-opacity': .55, stroke: c, 'stroke-width': 1.2 }, B.dyn));
      B.text(V(BX + BW + 26, y + 15), `${v.toFixed(3)}`, { fill: c, 'font-size': 11.5, 'text-anchor': 'start' });
    });
    B.dyn.appendChild(mk('line', { x1: BX, y1: 92, x2: BX, y2: 240, stroke: '#5c6a80', 'stroke-width': 1, 'stroke-dasharray': '4 5' }, B.dyn));

    cB(`$\\dfrac{${nB}}{${N}}=${pB.toFixed(3)}$`);
    cAB(`$\\dfrac{${nAB}}{${N}}=${(nAB / N).toFixed(3)}$`);
    cBA(nA ? `$\\dfrac{${nAB}}{${nA}}=${pBA.toFixed(3)}$` : '$A$ 内没有样本点');
    cJ(!nA ? 'A 内没有样本点，条件概率无定义'
      : nAB === 0 ? 'A 与 B 没有公共点，A 发生时 B 必不发生，条件概率为 0'
        : Math.abs(pBA - pB) < .02 ? '两个比例几乎相等，A 发不发生不影响 B 的概率，两事件接近独立'
          : `A 内 B 的比例${pBA > pB ? '高于' : '低于'}全体中的比例，A 发生改变了 B 的概率，两事件不独立`);
  };

  B.slider('半径 r_A', 50, 120, 2, st.rA, v => { st.rA = v; B.render(); }, 'rA');
  B.slider('半径 r_B', 50, 120, 2, st.rB, v => { st.rB = v; B.render(); }, 'rB');
  B.slider('圆心距 d', 30, 190, 2, st.d, v => { st.d = v; B.render(); }, 'd');

  B.hint('条件概率的分母是 A 内的点数，不是全体点数');
  B.render();
  return B;
}
