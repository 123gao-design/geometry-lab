import { Board, V, mk } from '../../../lib/board.js';

/* 对偶机：左边四点两两连线（完全四边形），右边四线两两相交（完全四边形），
   点与线互换、连线与交点互换。选中第 k 组，两边同时高亮对应的一对。 */
const PAIRS = [['A', 'B'], ['A', 'C'], ['A', 'D'], ['B', 'C'], ['B', 'D'], ['C', 'D']];
const PTS = { A: V(-1.5, -.5), B: V(1.5, -.6), C: V(1.15, 1.25), D: V(-1.25, 1.5) };
const LINES = [
  { p: V(0, 0), q: V(1, 0) },
  { p: V(0, 0), q: V(0, 1) },
  { p: V(0, 1), q: V(1, 2) },
  { p: V(0, 2), q: V(1, 1) },
];
function inter(l1, l2) {
  const a1 = l1.q.y - l1.p.y, b1 = l1.p.x - l1.q.x, c1 = a1 * l1.p.x + b1 * l1.p.y;
  const a2 = l2.q.y - l2.p.y, b2 = l2.p.x - l2.q.x, c2 = a2 * l2.p.x + b2 * l2.p.y;
  const d = a1 * b2 - a2 * b1;
  if (Math.abs(d) < 1e-9) return null;
  return V((c1 * b2 - c2 * b1) / d, (a1 * c2 - a2 * c1) / d);
}

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0 };
  const cS = B.chipM('选中');
  const cD = B.chipM('对偶');

  B.renderFn = () => {
    const k = st.k, pair = PAIRS[k];
    const i1 = 'ABCD'.indexOf(pair[0]), i2 = 'ABCD'.indexOf(pair[1]);
    const mL = B.isoFit(-2, 2, -1.8, 1.9, [45, 66, 350, 320], 0);
    const mR = B.isoFit(-2, 2, -1.8, 1.9, [430, 66, 350, 320], 0);
    B.tex(V(410, 30), '点 ↔ 线：连线的交点，换成交点的连线', { size: 16, anchor: 'mid', w: 560 });
    B.text(V(220, 404), '四点与六条连线', { 'font-size': 12, fill: '#8fa3bd' });
    B.text(V(605, 404), '四线与六个交点', { 'font-size': 12, fill: '#8fa3bd' });
    B.seg(V(410, 80), V(410, 380), { stroke: 'rgba(143,163,189,.3)', 'stroke-width': 1, 'stroke-dasharray': '4 6' });

    const names = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const a = PTS[names[i]], b = PTS[names[j]];
        const on = (i === i1 && j === i2);
        B.seg(V(mL.px(a.x), mL.py(a.y)), V(mL.px(b.x), mL.py(b.y)),
          { stroke: on ? '#ff9e4a' : 'rgba(92,173,255,.35)', 'stroke-width': on ? 2.4 : 1 });
      }
    }
    for (const n of names) {
      const p = PTS[n];
      B.dot(V(mL.px(p.x), mL.py(p.y)), 5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.3 });
      B.text(V(mL.px(p.x) + 8, mL.py(p.y) - 8), n, { 'font-size': 13, fill: '#5cadff', 'text-anchor': 'start' });
    }

    for (let i = 0; i < 4; i++) {
      const L = LINES[i], dx = L.q.x - L.p.x, dy = L.q.y - L.p.y;
      B.seg(V(mR.px(L.p.x - 3 * dx), mR.py(L.p.y - 3 * dy)), V(mR.px(L.p.x + 3 * dx), mR.py(L.p.y + 3 * dy)),
        { stroke: 'rgba(192,132,252,.4)', 'stroke-width': 1.2 });
    }
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const p = inter(LINES[i], LINES[j]);
        if (!p) continue;
        const on = (i === i1 && j === i2);
        B.dot(V(mR.px(p.x), mR.py(p.y)), on ? 6 : 3.6, { fill: on ? '#ff9e4a' : '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.2 });
      }
    }
    cS(`$\\{${pair[0]},${pair[1]}\\}$`);
    cD(`$${pair[0]}${pair[1]}\\ \\leftrightarrow\\ l_{${i1 + 1}}\\cap l_{${i2 + 1}}$`);
  };

  B.slider('对应元素', 0, 5, 1, st.k, v => { st.k = v; B.render(); });
  B.hintM('把「点」与「线」对调，「共线」与「共点」也随对调 —— 命题成对出现');
  B.render();
  return B;
}
