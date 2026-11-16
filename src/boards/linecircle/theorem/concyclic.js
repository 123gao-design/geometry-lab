/* 图 弦4 · 四点共圆与圆内接四边形
   圆 O 半径 R=3，A、B、C 是圆上三点（手柄贴着圆周走），D 可在平面上任意拖动。
   圆内接四边形对角互补：∠A+∠C=180°、∠B+∠D=180°；外角等于内对角。
   D 被拖离圆周时两个和同时偏离 180°，拖回圆周（过 A、B、C 的圆）时和复原。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const R = 3;
  const st = { a: 110 * Math.PI / 180, b: 190 * Math.PI / 180, c: 300 * Math.PI / 180, dx: R * Math.cos(40 * Math.PI / 180), dy: R * Math.sin(40 * Math.PI / 180), grid: true, labs: true };
  const m = B.isoFit(-4.3, 4.3, -3.3, 3.3, [44, 30, 760, 390], 10);
  const cA = B.chipM('对角 A 与 C'), cB = B.chipM('对角 B 与 D'), cE = B.chipM('外角'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const deg = rad => rad * 180 / Math.PI;
  const pt = p => V(m.px(p.x), m.py(p.y));
  const P = a => V(R * Math.cos(a), R * Math.sin(a));
  const norm = a => { while (a < 0) a += 2 * Math.PI; while (a >= 2 * Math.PI) a -= 2 * Math.PI; return a; };
  const angAt = (X, Y, Z) => {
    const v1 = V(Y.x - X.x, Y.y - X.y), v2 = V(Z.x - X.x, Z.y - X.y);
    const l1 = Math.hypot(v1.x, v1.y), l2 = Math.hypot(v2.x, v2.y);
    if (l1 < 0.05 || l2 < 0.05) return NaN;
    const c = (v1.x * v2.x + v1.y * v2.y) / (l1 * l2);
    return Math.acos(Math.max(-1, Math.min(1, c)));
  };
  const arcPath = (cx, cy, rad, a1, a2, N = 26) => {
    const d = norm(a2 - a1);
    const dd = d > Math.PI ? d - 2 * Math.PI : d;
    const out = [];
    for (let i = 0; i <= N; i++) {
      const t = a1 + dd * i / N;
      const p = V(m.px(cx + rad * Math.cos(t)), m.py(cy + rad * Math.sin(t)));
      out.push((i ? 'L' : 'M') + p.x.toFixed(2) + ' ' + p.y.toFixed(2));
    }
    return out.join(' ');
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(pt(V(R * Math.cos(a1), R * Math.sin(a1))), pt(V(R * Math.cos(a2), R * Math.sin(a2))),
        { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    }
    const A = P(st.a), Bp = P(st.b), C = P(st.c), D = V(st.dx, st.dy);
    const quad = [A, Bp, C, D];
    for (let i = 0; i < 4; i++) {
      B.seg(pt(quad[i]), pt(quad[(i + 1) % 4]), { stroke: '#ff9e4a', 'stroke-width': 2.3, 'stroke-opacity': .95 });
    }
    // 对角线（证明相似时用）
    B.seg(pt(A), pt(C), { stroke: '#8fa3bd', 'stroke-width': 1.1, 'stroke-dasharray': '5 4', 'stroke-opacity': .7 });
    B.seg(pt(Bp), pt(D), { stroke: '#8fa3bd', 'stroke-width': 1.1, 'stroke-dasharray': '5 4', 'stroke-opacity': .7 });

    // 四个顶角的小弧
    mkArc(A, Bp, D, '#ff9e4a');
    mkArc(Bp, A, C, '#7ee787');
    mkArc(C, Bp, D, '#5cadff');
    mkArc(D, A, C, '#c084fc');

    const nd = [[A, 'A', '#ff9e4a', 9, -8], [Bp, 'B', '#7ee787', -14, -8], [C, 'C', '#5cadff', 9, -8], [D, 'D', '#c084fc', 9, -8]];
    for (const [p, s, col, dx, dy] of nd) {
      B.dot(pt(p), 4.6, { fill: col, stroke: '#0a0d14', 'stroke-width': 1 });
      B.text(V(pt(p).x + dx, pt(p).y + dy), s, { 'font-size': 13, 'font-weight': 700, fill: col });
    }
    B.dot(pt(V(0, 0)), 4.2, { fill: '#5cadff' });

    const aA = angAt(A, Bp, D), aB = angAt(Bp, A, C), aC = angAt(C, Bp, D), aD = angAt(D, A, C);
    if ([aA, aB, aC, aD].some(Number.isNaN)) {
      cA('有顶点重合'); cB('有顶点重合'); cE('有顶点重合');
      cJ('两点重合时角无定义，把顶点拖开再读数', 'warn');
      return;
    }
    const s1 = aA + aC, s2 = aB + aD;
    const onC = Math.abs(Math.hypot(D.x, D.y) - R) < 0.06;
    cA(`$\\angle A=${fmt(deg(aA), 1)}^\\circ$，$\\angle C=${fmt(deg(aC), 1)}^\\circ$，和 $${fmt(deg(s1), 1)}^\\circ$`);
    cB(`$\\angle B=${fmt(deg(aB), 1)}^\\circ$，$\\angle D=${fmt(deg(aD), 1)}^\\circ$，和 $${fmt(deg(s2), 1)}^\\circ$`);
    cE(`$D$ 处外角 $${fmt(180 - deg(aD), 1)}^\\circ$，内对角 $\\angle B=${fmt(deg(aB), 1)}^\\circ$`);
    if (onC) {
      cJ('D 落在过 A、B、C 的圆上：两组对角分别互补', 'ok');
    } else {
      cJ(`D 偏离圆周 ${fz(Math.abs(Math.hypot(D.x, D.y) - R))}，两组对角之和都不再是 $180^\\circ$`, 'warn');
    }
  };

  function mkArc(X, Y, Z, color) {
    const a1 = Math.atan2(Y.y - X.y, Y.x - X.x), a2 = Math.atan2(Z.y - X.y, Z.x - X.x);
    mk('path', { d: arcPath(X.x, X.y, 0.5, a1, a2), fill: 'none', stroke: color, 'stroke-width': 1.9, 'stroke-opacity': .95 }, B.dyn);
  }

  const PRE = [
    { nm: '① 顶点在圆上', v: [110, 190, 300, 40, 1] },
    { nm: '② D 拖到圆内', v: [110, 190, 300, 40, 0.55] },
    { nm: '③ D 拖到圆外', v: [110, 190, 300, 40, 1.35] },
  ];
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.a, st.b, st.c] = o.v.slice(0, 3).map(d => d * Math.PI / 180);
    const ang = o.v[3] * Math.PI / 180, rr = R * o.v[4];
    st.dx = rr * Math.cos(ang); st.dy = rr * Math.sin(ang);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  const cirHandle = (key, color, label) => B.handle({
    color, r: 7, label, lo: [10, -10],
    get: () => pt(P(st[key])),
    set: p => { st[key] = norm(Math.atan2((m.py(0) - p.y) / m.s, (p.x - m.px(0)) / m.s)); },
  });
  cirHandle('a', '#ff9e4a', 'A');
  cirHandle('b', '#7ee787', 'B');
  cirHandle('c', '#5cadff', 'C');
  B.handle({
    color: '#c084fc', r: 7.5, label: 'D', lo: [10, -10],
    get: () => pt(V(st.dx, st.dy)),
    set: p => {
      const x = (p.x - m.px(0)) / m.s, y = (m.py(0) - p.y) / m.s;
      const L = Math.hypot(x, y);
      if (L > 4.1) { st.dx = x / L * 4.1; st.dy = y / L * 4.1; } else { st.dx = x; st.dy = y; }
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖 A、B、C 沿圆周走，拖 D 进出圆周：两组对角之和同为 180° 时 D 必在圆上');
  B.render();
  return B;
}
