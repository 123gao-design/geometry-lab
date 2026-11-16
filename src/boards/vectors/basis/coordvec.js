/* 图 基2 · 向量坐标机
   以原点为起点的向量，坐标就是终点的坐标；起点不在原点时，向量坐标 = 终点坐标 − 起点坐标。
   拖动 A、B 两点：蓝色是 AB，橙色一支把 AB 平移到原点，读出的坐标与蓝色完全一致。
   局部坐标：x∈[−7.6,7.6]，y∈[−3.4,3.4]，原点在画框中心。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: -2, ay: -1, bx: 2, by: 2, grid: true, labs: true };
  const PRE = [
    { nm: '① 一般位置', a: [-2, -1], b: [2, 2] },
    { nm: '② 水平向量', a: [-2, 1], b: [3, 1] },
    { nm: '③ 竖直向量', a: [1, -2], b: [1, 2] },
    { nm: '④ A 在原点', a: [0, 0], b: [2, 2] },
    { nm: '⑤ 零向量', a: [1, 1], b: [1, 1] },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cV = B.chipM('向量坐标'), cM = B.chipM('模'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const A = V(m.px(st.ax), m.py(st.ay));
    const Bp = V(m.px(st.bx), m.py(st.by));
    const dx = st.bx - st.ax, dy = st.by - st.ay;
    const L = Math.hypot(dx, dy);
    const G = V(m.px(dx), m.py(dy));

    // 平移支：把 AB 搬到原点
    if (L > 0.01) {
      B.arrow(O, G, { stroke: '#ff9e4a', 'stroke-width': 2, head: 11, wide: 5, 'stroke-dasharray': '6 4' });
      B.tex(V(G.x + 7, G.y - 12), '$\\overrightarrow{AB}$', { size: 13, anchor: 'start', color: '#ff9e4a', w: 60 });
      B.seg(A, O, { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .5 });
      B.seg(Bp, G, { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .5 });
    }
    // 端点与向量
    B.arrow(A, Bp, { stroke: '#5cadff', 'stroke-width': 2.4, head: 13, wide: 6 });
    B.dot(A, 4.5, { fill: '#4ade80' });
    B.dot(Bp, 4.5, { fill: '#ff9e4a' });
    B.text(V(A.x - 12, A.y + 16), 'A', { 'font-size': 12.5, fill: '#4ade80' });
    B.text(V(Bp.x + 8, Bp.y - 10), 'B', { 'font-size': 12.5, fill: '#ff9e4a' });
    B.dot(O, 3.4, { fill: '#e8eefc' });

    // 徽章
    const nf = v => (v < 0 ? `(${fmt(v, 1)})` : fmt(v, 1));
    cV(`$\\overrightarrow{AB}=(${nf(st.bx)}-${nf(st.ax)},\\ ${nf(st.by)}-${nf(st.ay)})=(${fmt(dx, 1)},\\ ${fmt(dy, 1)})$`);
    cM(`$|\\overrightarrow{AB}|=\\sqrt{${fmt(dx * dx + dy * dy, 2)}}=${fmt(L, 2)}$`);
    cJ(L < 1e-9 ? 'A 与 B 重合：零向量，坐标是 (0, 0)'
      : Math.abs(dy) < 1e-9 ? '水平向量：纵坐标为 0，方向只由横坐标的正负决定'
        : Math.abs(dx) < 1e-9 ? '竖直向量：横坐标为 0，方向只由纵坐标的正负决定'
          : '向量坐标由终点减起点得到，与 A 放在哪里无关');
  };

  const cl = v => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
  B.handle({
    color: '#4ade80', r: 7,
    get: () => V(m.px(st.ax), m.py(st.ay)),
    set: p => { st.ax = cl((p.x - m.px(0)) / m.s); st.ay = cl((m.py(0) - p.y) / m.s); },
  });
  B.handle({
    color: '#ff9e4a', r: 7,
    get: () => V(m.px(st.bx), m.py(st.by)),
    set: p => { st.bx = cl((p.x - m.px(0)) / m.s); st.by = cl((m.py(0) - p.y) / m.s); },
  });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    [st.ax, st.ay] = p.a; [st.bx, st.by] = p.b;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动 A、B 两点：橙色一支是平移到原点的 AB，两支箭头坐标相同');
  B.render();
  return B;
}
