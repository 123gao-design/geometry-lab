/* 图 综2a · 过定点的弦中点轨迹
   圆 O 半径为 r，A 是圆外 x 轴上一点，过 A 的直线与圆交于 M、N，P 是 MN 的中点。
   弦的中点就是圆心到弦的垂足，所以 OP⊥AP，∠OPA=90°；由圆周角定理的逆命题，
   P 落在以 OA 为直径的圆上。轨迹是该圆落在原圆内部的那段弧（绿色虚线）。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { d: 4, r: 2, th: 20, grid: true, labs: true };
  const m = B.isoFit(-2.8, 6.6, -3.3, 3.3, [44, 28, 760, 392], 10);
  const cM = B.chipM('弦端点'), cC = B.chipM('中点'), cT = B.chipM('直角与轨迹'), cR = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const P2 = (x, y) => V(m.px(x), m.py(y));
  const circle = (cx, cy, r, color, dash) => {
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(P2(cx + r * Math.cos(a1), cy + r * Math.sin(a1)), P2(cx + r * Math.cos(a2), cy + r * Math.sin(a2)),
        { stroke: color, 'stroke-width': dash ? 1.8 : 2.3, 'stroke-opacity': .95, ...(dash ? { 'stroke-dasharray': '6 5' } : {}) });
    }
  };
  const data = () => {
    const th = st.th * Math.PI / 180;
    const ux = Math.cos(th), uy = Math.sin(th);
    const b = st.d * ux;
    const disc = st.r * st.r - st.d * st.d * uy * uy;
    if (disc < 0) return { ok: false };
    const h = Math.sqrt(disc);
    const M = V(st.d + (-b - h) * ux, (-b - h) * uy);
    const N = V(st.d + (-b + h) * ux, (-b + h) * uy);
    const P = V((M.x + N.x) / 2, (M.y + N.y) / 2);
    return { ok: true, M, N, P, ux, uy };
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    circle(0, 0, st.r, '#ffd166');
    const A = P2(st.d, 0);
    B.dot(A, 5.5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(A.x + 4, A.y - 10), 'A', { 'font-size': 13, 'font-weight': 700, fill: '#5cadff' });
    B.text(V(P2(0, 0).x - 10, P2(0, 0).y - 9), 'O', { 'font-size': 12.5, 'font-weight': 700, fill: '#ffd166' });
    B.dot(P2(0, 0), 4, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1 });

    // 轨迹弧：以 OA 为直径的圆落在原圆内部的部分
    const t0 = Math.acos(Math.max(-1, Math.min(1, 2 * st.r * st.r / (st.d * st.d) - 1)));
    const NARC = 72;
    for (let i = 0; i < NARC; i++) {
      const a1 = t0 + (2 * Math.PI - 2 * t0) * i / NARC, a2 = t0 + (2 * Math.PI - 2 * t0) * (i + 1) / NARC;
      B.seg(P2(st.d / 2 + st.d / 2 * Math.cos(a1), st.d / 2 * Math.sin(a1)),
        P2(st.d / 2 + st.d / 2 * Math.cos(a2), st.d / 2 * Math.sin(a2)),
        { stroke: '#7ee787', 'stroke-width': 1.8, 'stroke-dasharray': '6 5', 'stroke-opacity': .8 });
    }

    const q = data();
    if (!q.ok) {
      cM('直线与圆没有公共点');
      cC('—');
      cT('—');
      cR('这条直线够不到圆，把角度调小一点', 'warn');
      return;
    }
    const { M, N, P } = q;
    B.seg(A, P2(N.x, N.y), { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .7 });
    B.seg(P2(M.x, M.y), P2(N.x, N.y), { stroke: '#ff9e4a', 'stroke-width': 3.2, 'stroke-opacity': .95 });
    B.dot(P2(M.x, M.y), 4.5, { fill: '#ff9e4a' });
    B.dot(P2(N.x, N.y), 4.5, { fill: '#ff9e4a' });
    B.text(V(P2(M.x, M.y).x - 12, P2(M.x, M.y).y + 4), 'M', { 'font-size': 12.5, 'font-weight': 700, fill: '#ff9e4a' });
    B.text(V(P2(N.x, N.y).x + 12, P2(N.x, N.y).y + 4), 'N', { 'font-size': 12.5, 'font-weight': 700, fill: '#ff9e4a' });
    B.seg(P2(0, 0), P2(P.x, P.y), { stroke: '#7ee787', 'stroke-width': 1.6, 'stroke-opacity': .9 });
    B.seg(P2(P.x, P.y), A, { stroke: '#7ee787', 'stroke-width': 1.6, 'stroke-opacity': .9 });
    B.dot(P2(P.x, P.y), 5.5, { fill: '#7ee787', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(P2(P.x, P.y).x + 11, P2(P.x, P.y).y - 9), 'P', { 'font-size': 12.5, 'font-weight': 700, fill: '#7ee787' });

    // P 处的直角标记（PO 与 PA）
    const Pp = P2(P.x, P.y), Op = P2(0, 0), Ap = A;
    const u1x = Op.x - Pp.x, u1y = Op.y - Pp.y, L1 = Math.hypot(u1x, u1y) || 1;
    const u2x = Ap.x - Pp.x, u2y = Ap.y - Pp.y, L2 = Math.hypot(u2x, u2y) || 1;
    const s = 9;
    const k1 = V(Pp.x + s * u1x / L1, Pp.y + s * u1y / L1), k2 = V(Pp.x + s * u2x / L2, Pp.y + s * u2y / L2);
    B.seg(k1, V(k1.x + k2.x - Pp.x, k1.y + k2.y - Pp.y), { stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-opacity': .95 });
    B.seg(k2, V(k1.x + k2.x - Pp.x, k1.y + k2.y - Pp.y), { stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-opacity': .95 });

    cM(`$M(${fz(M.x)},\\ ${fz(M.y)})$，$N(${fz(N.x)},\\ ${fz(N.y)})$`);
    cC(`$P(${fz(P.x)},\\ ${fz(P.y)})$，$|OP|=${fz(Math.hypot(P.x, P.y))}$`);
    cT(`$\\angle OPA=90^\\circ$，轨迹 $(x-${fz(st.d / 2)})^2+y^2=${fz(st.d * st.d / 4)}$`);
    cR(Math.abs(st.th) < 1e-9 ? '直线过圆心，弦是直径，中点就是 O' : 'OP 是弦心距，P 沿绿色虚弧随直线转动');
  };

  const PRE = [
    { nm: '① 一般', v: [4, 2, 20] },
    { nm: '② 过圆心', v: [4, 2, 0] },
    { nm: '③ 远离', v: [5.6, 1.6, 12] },
  ];
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.d, st.r, st.th] = o.v;
    sD.sync(st.d); sR.sync(st.r); sT.sync(st.th);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.handle({
    color: '#5cadff', r: 7, label: 'A', lo: [8, -8],
    get: () => P2(st.d, 0),
    set: p => {
      st.d = Math.max(st.r + .6, Math.min(6, (p.x - m.px(0)) / m.s));
      sD.sync(st.d);
    },
  });

  const sD = B.slider('定点距离 d', 3, 6, 0.1, st.d, v => { st.d = Math.max(v, st.r + .6); sD.sync(st.d); B.render(); }, 'd');
  const sR = B.slider('半径 r', 1.2, 2.4, 0.1, st.r, v => { st.r = v; if (st.d < v + .6) { st.d = v + .6; sD.sync(st.d); } B.render(); }, 'r');
  const sT = B.slider('角度 θ', -28, 28, 1, st.th, v => { st.th = v; B.render(); }, 'th');

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖 A 或改角度：弦的中点 P 始终落在以 OA 为直径的圆弧上');
  B.render();
  return B;
}
