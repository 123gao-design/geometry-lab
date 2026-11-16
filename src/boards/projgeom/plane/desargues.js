/* 图 射5 · 德萨格与帕普斯机
   左图：两个三角形 A B C 与 A'B'C'，后者由中心 O 按比例 t 放大，对应顶点连线都过 O。
   三组对应边的交点画成金色，它们一律落在一条直线上（德萨格轴）。拖 O 或任一顶点，轴随之移动。
   右图：两条直线上的三点 A1 A2 A3 与 B1 B2 B3，交叉连线产生三个交点，帕普斯定理说它们共线。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const lineOf = (p, q) => cross3([p.x, p.y, 1], [q.x, q.y, 1]);
const meet = (l1, l2) => {
  const c = cross3(l1, l2);
  if (Math.abs(c[2]) < 1e-8) return null;
  return V(c[0] / c[2], c[1] / c[2]);
};

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const O0 = V(0.2, 0.1);
  const st = { O: O0, A: V(-2.6, -1.6), B: V(2.2, -1.9), C: V(-0.2, 2.0), t: 1.7, b2: 0.45 };
  const mL = B.isoFit(-4.2, 4.2, -3.1, 3.1, [24, 20, 380, 392], 22);
  const mR = B.isoFit(-4.2, 4.2, -2.0, 2.0, [420, 20, 376, 392], 22);
  const cT = B.chipM('比例 $t$'), cCol = B.chipM('共线行列式'), cAxis = B.chipM('帕普斯线');

  B.renderFn = () => {
    const { O, A, B: Bv, C, t } = st;
    const s = p => V(O.x + t * (p.x - O.x), O.y + t * (p.y - O.y));
    const A2 = s(A), B2 = s(Bv), C2 = s(C);

    B.grid({ ...mL, sx: 1, sy: 1, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });
    B.grid({ ...mR, sx: 1, sy: 1, lx: 1, ly: 1, axLab: 'x', ayLab: 'y' });

    // 左图：两三角形、中心连线
    const tri = (p, q, r, col, w) => {
      const d = `M${mL.px(p.x)} ${mL.py(p.y)} L${mL.px(q.x)} ${mL.py(q.y)} L${mL.px(r.x)} ${mL.py(r.y)} Z`;
      B.dyn.appendChild(mk('path', { d, fill: col, 'fill-opacity': .08, stroke: col, 'stroke-width': w || 2 }, B.dyn));
    };
    tri(A, Bv, C, '#67e8f9');
    tri(A2, B2, C2, '#c084fc');
    for (const q of [A2, B2, C2]) {
      B.seg(V(mL.px(O.x), mL.py(O.y)), V(mL.px(q.x), mL.py(q.y)), { stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-dasharray': '4 5', 'stroke-opacity': .55 });
    }
    // 三组对应边的交点与轴
    const p1 = meet(lineOf(A, Bv), lineOf(A2, B2));
    const p2 = meet(lineOf(Bv, C), lineOf(B2, C2));
    const p3 = meet(lineOf(C, A), lineOf(C2, A2));
    const P = [p1, p2, p3].filter(Boolean);
    if (P.length === 3) {
      const d = `M${mL.px(P[0].x)} ${mL.py(P[0].y)} L${mL.px(P[1].x)} ${mL.py(P[1].y)} L${mL.px(P[2].x)} ${mL.py(P[2].y)}`;
      B.dyn.appendChild(mk('path', { d, fill: 'none', stroke: '#4ade80', 'stroke-width': 2.2 }, B.dyn));
    }
    for (const p of P) B.dot(V(mL.px(p.x), mL.py(p.y)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    // 顶点标签
    for (const [p, s1] of [[A, 'A'], [Bv, 'B'], [C, 'C'], [A2, 'A′'], [B2, 'B′'], [C2, 'C′']])
      B.text(V(mL.px(p.x) + 10, mL.py(p.y) - 8), s1, { 'font-size': 12, fill: '#8fa3bd' });
    B.dot(V(mL.px(O.x), mL.py(O.y)), 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.text(V(mL.px(O.x) + 10, mL.py(O.y) + 14), 'O', { 'font-size': 12, fill: '#ff9e4a' });
    B.tex(V(mL.px(mL.X0) + 6, mL.py(mL.Y1) - 20), '金色三点始终共线，这条线叫德萨格轴', { size: 12, color: '#93a1b5', w: 300 });

    // 右图：帕普斯构形
    const yA = 1.25, yB = -1.25;
    const pa1 = V(-3.0, yA), pa2 = V(-0.4, yA), pa3 = V(2.2, yA);
    const pb1 = V(-2.2, yB), pb2 = V(st.b2, yB), pb3 = V(2.9, yB);
    B.seg(V(mR.px(-4.0), mR.py(yA)), V(mR.px(4.0), mR.py(yA)), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    B.seg(V(mR.px(-4.0), mR.py(yB)), V(mR.px(4.0), mR.py(yB)), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    const dash = { stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-dasharray': '4 5', 'stroke-opacity': .5 };
    const joins = [[pa1, pb2], [pa2, pb1], [pa1, pb3], [pa3, pb1], [pa2, pb3], [pa3, pb2]];
    for (const [p, q] of joins) B.seg(V(mR.px(p.x), mR.py(p.y)), V(mR.px(q.x), mR.py(q.y)), dash);
    const q1 = meet(lineOf(pa1, pb2), lineOf(pa2, pb1));
    const q2 = meet(lineOf(pa1, pb3), lineOf(pa3, pb1));
    const q3 = meet(lineOf(pa2, pb3), lineOf(pa3, pb2));
    const Q = [q1, q2, q3].filter(Boolean);
    if (Q.length === 3) {
      B.dyn.appendChild(mk('path', { d: `M${mR.px(Q[0].x)} ${mR.py(Q[0].y)} L${mR.px(Q[2].x)} ${mR.py(Q[2].y)}`,
        fill: 'none', stroke: '#4ade80', 'stroke-width': 2.2 }, B.dyn));
    }
    for (const p of Q) B.dot(V(mR.px(p.x), mR.py(p.y)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    for (const [p, s1] of [[pa1, 'A₁'], [pa2, 'A₂'], [pa3, 'A₃'], [pb1, 'B₁'], [pb2, 'B₂'], [pb3, 'B₃']])
      B.text(V(mR.px(p.x), mR.py(p.y) + (p.y > 0 ? -9 : 17)), s1, { 'font-size': 11, fill: '#8fa3bd' });
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) - 20), '交叉六线定出三点，帕普斯线把它们串起来', { size: 12, color: '#93a1b5', w: 300 });

    // 共线校验：帕普斯三点的行列式
    let det = NaN, dir = '';
    if (Q.length === 3) {
      det = q1.x * (q2.y - q3.y) + q2.x * (q3.y - q1.y) + q3.x * (q1.y - q2.y);
      dir = `${fmt(Math.atan2(q3.y - q1.y, q3.x - q1.x) * 180 / Math.PI, 1)}°`;
    }
    cT(`$${fmt(t, 2)}$`, '');
    cCol(`$${fmt(det, 6)}$`, Math.abs(det) < 1e-6 ? 'good' : 'bad');
    cAxis(dir, '');
    B.hintM('拖左图的顶点或中心 O：对应顶点连线仍共点，对应边交点仍共线；拖右图的 B₂，帕普斯线跟着转，三点照样共线');
  };

  // 左图四个把手
  const drag = { drag: () => B.render() };
  B.handle({ ...drag, get: () => V(mL.px(st.O.x), mL.py(st.O.y)),
    set: p => { st.O = V((p.x - mL.px(0)) / mL.s, (mL.py(0) - p.y) / mL.s); },
    color: '#ff9e4a', r: 8 });
  for (const key of ['A', 'B', 'C']) {
    B.handle({ ...drag, get: () => V(mL.px(st[key].x), mL.py(st[key].y)),
      set: p => { st[key] = V((p.x - mL.px(0)) / mL.s, (mL.py(0) - p.y) / mL.s); },
      color: '#67e8f9', r: 7 });
  }
  B.slider('比例 t', 1.25, 2.2, 0.01, st.t, v => { st.t = v; B.render(); }, 't');
  // 右图：B₂ 只能沿下面那条线滑动
  B.handle({ ...drag, get: () => V(mR.px(st.b2), mR.py(-1.25)),
    set: p => { st.b2 = Math.max(-3.4, Math.min(3.6, (p.x - mR.px(0)) / mR.s)); },
    clamp: p => V(Math.max(mR.px(-3.4), Math.min(mR.px(3.6), p.x)), mR.py(-1.25)),
    color: '#c084fc', r: 7 });

  B.render();
  return B;
}
