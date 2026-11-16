/* 图 应1 · 三角形中线与重心
   以 A 为公共起点，记 AB=a、AC=b。三条中线的交点与中线上的定比都用基向量表示：
   BC 的中点 M=(a+b)/2，重心 G=(a+b)/3，即 AG:GM=2:1。
   拖动 B、C 两个顶点：三线始终交于一点，比值不随形状改变。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { bx: 3, by: -1, cx: 1, cy: 2, grid: true, labs: true };
  const PRE = [
    { nm: '① 一般三角形', b: [3, -1], c: [1, 2] },
    { nm: '② 等腰直角', b: [3, 0], c: [0, 3] },
    { nm: '③ 锐角三角形', b: [3, 0], c: [0.5, 2.5] },
    { nm: '④ 三点共线', b: [2, 1], c: [-2, -1] },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cM = B.chipM('中线'), cG = B.chipM('重心'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const P = (x, y) => V(m.px(x), m.py(y));
    const A = O, Bp = P(st.bx, st.by), Cp = P(st.cx, st.cy);
    const M = P((st.bx + st.cx) / 2, (st.by + st.cy) / 2);   // BC 中点
    const N = P(st.cx / 2, st.cy / 2);                       // AC 中点
    const L = P(st.bx / 2, st.by / 2);                       // AB 中点
    const gx = (st.bx + st.cx) / 3, gy = (st.by + st.cy) / 3;
    const G = P(gx, gy);
    const coll = Math.abs(st.bx * st.cy - st.by * st.cx) < 1e-6;

    // 三角形三边
    B.seg(Bp, Cp, { stroke: '#8fa3bd', 'stroke-width': 1.6, 'stroke-opacity': .8 });
    B.seg(A, Bp, { stroke: '#8fa3bd', 'stroke-width': 1.6, 'stroke-opacity': .8 });
    B.seg(A, Cp, { stroke: '#8fa3bd', 'stroke-width': 1.6, 'stroke-opacity': .8 });
    // 三条中线
    B.seg(A, M, { stroke: '#ffd166', 'stroke-width': 1.8, 'stroke-dasharray': '6 4' });
    B.seg(Bp, N, { stroke: '#c084fc', 'stroke-width': 1.6, 'stroke-dasharray': '6 4' });
    B.seg(Cp, L, { stroke: '#67e8f9', 'stroke-width': 1.6, 'stroke-dasharray': '6 4' });
    // 顶点与中点
    [Bp, Cp].forEach((p, i) => B.dot(p, 5, { fill: i ? '#ff9e4a' : '#5cadff' }));
    B.dot(A, 5, { fill: '#4ade80' });
    B.text(V(A.x - 14, A.y + 14), 'A', { 'font-size': 13, 'font-weight': 700, fill: '#4ade80' });
    B.text(V(Bp.x + 8, Bp.y + 14), 'B', { 'font-size': 13, 'font-weight': 700, fill: '#5cadff' });
    B.text(V(Cp.x + 8, Cp.y + 14), 'C', { 'font-size': 13, 'font-weight': 700, fill: '#ff9e4a' });
    B.text(V(M.x + 8, M.y + 16), 'M', { 'font-size': 12, fill: '#ffd166' });
    if (!coll) {
      B.dot(G, 6, { fill: '#ff7b8a', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.text(V(G.x + 9, G.y - 11), 'G', { 'font-size': 13, 'font-weight': 700, fill: '#ff7b8a' });
    }

    // 徽章
    cM(`$\\overrightarrow{AM}=\\dfrac12(\\vec a+\\vec b)=(${fmt((st.bx + st.cx) / 2, 2)},\\ ${fmt((st.by + st.cy) / 2, 2)})$`);
    cG(`$\\overrightarrow{AG}=\\dfrac13(\\vec a+\\vec b)=(${fmt(gx, 2)},\\ ${fmt(gy, 2)})$`);
    cJ(coll ? '三点共线：三角形退化成一条线段，中线重合，重心无从谈起'
      : '三条中线交于一点，且 G 把每条中线按 2:1 分开：AG:GM=2:1');
  };

  const cl = v => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
  B.handle({
    color: '#5cadff', r: 7,
    get: () => V(m.px(st.bx), m.py(st.by)),
    set: p => { st.bx = cl((p.x - m.px(0)) / m.s); st.by = cl((m.py(0) - p.y) / m.s); },
  });
  B.handle({
    color: '#ff9e4a', r: 7,
    get: () => V(m.px(st.cx), m.py(st.cy)),
    set: p => { st.cx = cl((p.x - m.px(0)) / m.s); st.cy = cl((m.py(0) - p.y) / m.s); },
  });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    [st.bx, st.by] = p.b; [st.cx, st.cy] = p.c;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动顶点 B、C：三条中线始终交于一点 G，且 AG:GM=2:1');
  B.render();
  return B;
}
