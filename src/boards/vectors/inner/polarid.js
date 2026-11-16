/* 图 积3 · 极化恒等式机
   平行四边形 OACB 中，两条对角线分别是 a+b 与 a−b。
   恒等式 |a+b|²−|a−b|²=4a·b 与 |a+b|²+|a−b|²=2(|a|²+|b|²) 都在两条对角线上读出来。
   拖动两支箭头的终点：两支垂直时两条对角线等长，就是矩形。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: 2.5, ay: 1, bx: 0.5, by: 2, grid: true, labs: true };
  const PRE = [
    { nm: '① 一般位置', a: [2.5, 1], b: [0.5, 2] },
    { nm: '② 互相垂直', a: [2, 0], b: [0, 2] },
    { nm: '③ 共线同向', a: [2, 1], b: [2, 1] },
    { nm: '④ 共线反向', a: [2, 1], b: [-2, -1] },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cI = B.chipM('恒等式'), cE = B.chipM('对角'), cP = B.chipM('参数'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const A = V(m.px(st.ax), m.py(st.ay));
    const Bp = V(m.px(st.bx), m.py(st.by));
    const sx = st.ax + st.bx, sy = st.ay + st.by;
    const dx = st.ax - st.bx, dy = st.ay - st.by;
    const C = V(m.px(sx), m.py(sy));
    const D = V(m.px(dx), m.py(dy));
    const la2 = st.ax * st.ax + st.ay * st.ay, lb2 = st.bx * st.bx + st.by * st.by;
    const dot = st.ax * st.bx + st.ay * st.by;
    const sp = Math.hypot(sx, sy), sm = Math.hypot(dx, dy);
    const perp = Math.abs(dot) < 1e-6 && la2 > 1e-12 && lb2 > 1e-12;
    const coll = Math.abs(st.ax * st.by - st.ay * st.bx) < 1e-6;

    // 平行四边形的两条邻边
    B.seg(A, C, { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .7 });
    B.seg(Bp, C, { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .7 });
    // 两条对角线
    B.seg(O, C, { stroke: '#ffd166', 'stroke-width': 2.6, 'stroke-opacity': .95 });
    B.seg(Bp, A, { stroke: '#c084fc', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    // 两支向量
    B.arrow(O, A, { stroke: '#5cadff', 'stroke-width': 2.2, head: 12, wide: 5.5 });
    B.arrow(O, Bp, { stroke: '#ff9e4a', 'stroke-width': 2.2, head: 12, wide: 5.5 });
    B.tex(V(A.x + 7, A.y + 4), '$\\vec a$', { size: 13.5, anchor: 'start', color: '#5cadff', w: 30 });
    B.tex(V(Bp.x + 7, Bp.y - 24), '$\\vec b$', { size: 13.5, anchor: 'start', color: '#ff9e4a', w: 30 });
    if (sx !== 0 || sy !== 0) B.tex(V(C.x + 7, C.y - 13), '$\\vec a+\\vec b$', { size: 12.5, anchor: 'start', color: '#ffd166', w: 80 });
    if (dx !== 0 || dy !== 0) B.tex(V(D.x + 7, D.y + 16), '$\\vec a-\\vec b$', { size: 12.5, anchor: 'start', color: '#c084fc', w: 80 });
    B.dot(O, 3.4, { fill: '#e8eefc' });

    // 徽章
    cI(`$|\\vec a+\\vec b|^2-|\\vec a-\\vec b|^2=${fmt(sp * sp, 2)}-${fmt(sm * sm, 2)}=${fmt(sp * sp - sm * sm, 2)}$`);
    cE(`$|\\vec a+\\vec b|=${fmt(sp, 2)},\\quad |\\vec a-\\vec b|=${fmt(sm, 2)}$`);
    cP(`$\\vec a\\cdot\\vec b=${fmt(dot, 2)},\\quad 4\\vec a\\cdot\\vec b=${fmt(4 * dot, 2)}$`);
    cJ(la2 < 1e-12 || lb2 < 1e-12 ? '含零向量：平行四边形退化成一条线段，两个恒等式仍然成立'
      : coll ? (dot > 0
        ? (sm < 1e-6 ? '共线同向且等长：两支重合，差向量缩成零，只剩一条对角线' : '共线同向：平行四边形压成一条线段，差向量是两条邻边之差')
        : (sp < 1e-6 ? '共线反向且等长：两支抵消，和向量为零，只剩另一条对角线' : '共线反向：平行四边形压成一条线段，和向量是两条邻边之差'))
        : perp ? '两支垂直：两条对角线等长，平行四边形是矩形'
          : dot > 0 ? '夹角为锐角：a+b 比 a−b 长'
            : '夹角为钝角：a−b 比 a+b 长');
  };

  const cl = v => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
  B.handle({
    color: '#5cadff', r: 7,
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

  B.hint('拖动两支箭头的终点：金、紫两条对角线分别是 a+b 与 a−b');
  B.render();
  return B;
}
