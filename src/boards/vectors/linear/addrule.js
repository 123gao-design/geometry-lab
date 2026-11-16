/* 图 向2 · 加法法则机
   两个向量同起点 O 时：三角形法则把 b 平移到 a 的终点，平行四边形法则把两条边补成平行四边形，对角线同为 a+b。
   第三档取差向量 a−b，就是由 b 的终点指向 a 的终点的有向线段。
   拖动两个终点 A、B 改向量；蓝色是 a，橙色是 b，绿色是运算结果。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: 3, ay: 1, bx: 1, by: 2.5, mode: 0, grid: true, labs: true };
  const PRE = [
    { nm: '① 三角形法则', m: 0 },
    { nm: '② 平行四边形法则', m: 1 },
    { nm: '③ 差向量 a−b', m: 2 },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cR = B.chipM('运算结果'), cM = B.chipM('模'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const A = V(m.px(st.ax), m.py(st.ay));
    const Bp = V(m.px(st.bx), m.py(st.by));
    const sx = st.ax + st.bx, sy = st.ay + st.by;
    const S = V(m.px(sx), m.py(sy));
    const dot = st.ax * st.bx + st.ay * st.by;
    const cross = st.ax * st.by - st.ay * st.bx;

    // 平行四边形：两条平移边
    if (st.mode === 1) {
      B.seg(A, S, { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-opacity': .55, 'stroke-dasharray': '5 5' });
      B.seg(Bp, S, { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-opacity': .55, 'stroke-dasharray': '5 5' });
    }
    // 三角形法则：把 b 平移到 a 的终点
    if (st.mode === 0) {
      const TB = V(m.px(st.ax + st.bx), m.py(st.ay + st.by));
      B.arrow(A, TB, { stroke: '#ff9e4a', 'stroke-width': 1.8, head: 10, wide: 5, 'stroke-opacity': .85 });
      B.tex(V((A.x + TB.x) / 2, (A.y + TB.y) / 2 - 13), '$\\vec b$', { size: 13.5, anchor: 'mid', color: '#ff9e4a', w: 40 });
    }
    // 两条原始向量
    B.arrow(O, A, { stroke: '#5cadff', 'stroke-width': 2.2, head: 12, wide: 5.5 });
    B.arrow(O, Bp, { stroke: '#ff9e4a', 'stroke-width': 2.2, head: 12, wide: 5.5 });
    B.tex(V((O.x + A.x) / 2 + 6, (O.y + A.y) / 2 - 13), '$\\vec a$', { size: 14, anchor: 'start', color: '#5cadff', w: 40 });
    B.tex(V((O.x + Bp.x) / 2 - 8, (O.y + Bp.y) / 2 - 13), '$\\vec b$', { size: 14, anchor: 'end', color: '#ff9e4a', w: 40 });
    // 结果
    if (st.mode < 2) {
      B.arrow(O, S, { stroke: '#4ade80', 'stroke-width': 2.4, head: 13, wide: 6 });
      B.tex(V((O.x + S.x) / 2 + 8, (O.y + S.y) / 2 + 16), '$\\vec a+\\vec b$', { size: 14, anchor: 'start', color: '#4ade80', w: 70 });
    } else {
      B.arrow(Bp, A, { stroke: '#4ade80', 'stroke-width': 2.4, head: 13, wide: 6 });
      B.tex(V((A.x + Bp.x) / 2, (A.y + Bp.y) / 2 - 14), '$\\vec a-\\vec b$', { size: 14, anchor: 'mid', color: '#4ade80', w: 70 });
    }
    B.dot(O, 3.4, { fill: '#e8eefc' });

    // 徽章
    if (st.mode < 2) {
      cR(`$\\vec a+\\vec b=(${fmt(sx, 1)},\\ ${fmt(sy, 1)})$`);
      cM(`$|\\vec a+\\vec b|=${fmt(Math.hypot(sx, sy), 2)}$`);
      cJ(Math.abs(cross) < 1e-9
        ? (dot > 0 ? '共线同向：对角线长度等于两边之和' : '共线反向：对角线长度等于两边之差')
        : Math.abs(dot) < 1e-9 ? '两向量垂直：平行四边形是矩形，对角线与边构成直角三角形'
          : '一般情形：对角线长度介于两边之差与两边之和之间');
    } else {
      cR(`$\\vec a-\\vec b=(${fmt(st.ax - st.bx, 1)},\\ ${fmt(st.ay - st.by, 1)})$`);
      cM(`$|\\vec a-\\vec b|=${fmt(Math.hypot(st.ax - st.bx, st.ay - st.by), 2)}$`);
      cJ(Math.abs(cross) < 1e-9
        ? (dot >= 0 ? '共线同向：差向量与两向量同线，长度是两边之差' : '共线反向：差向量落在两向量所在直线上')
        : Math.abs(dot) < 1e-9 ? '两向量垂直：差向量与和向量长度相等' : '一般情形：差向量由 b 的终点指向 a 的终点');
    }
  };

  const cl = (v, k) => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
  B.handle({
    color: '#5cadff', r: 7,
    get: () => V(m.px(st.ax), m.py(st.ay)),
    set: p => { st.ax = cl((p.x - m.px(0)) / m.s, 4); st.ay = cl((m.py(0) - p.y) / m.s, 3); },
  });
  B.handle({
    color: '#ff9e4a', r: 7,
    get: () => V(m.px(st.bx), m.py(st.by)),
    set: p => { st.bx = cl((p.x - m.px(0)) / m.s, 4); st.by = cl((m.py(0) - p.y) / m.s, 3); },
  });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.mode = p.m;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动 A、B 两个终点：蓝色是 a，橙色是 b，绿色是运算结果，切换三档看同一条结果的三种画法');
  B.render();
  return B;
}
