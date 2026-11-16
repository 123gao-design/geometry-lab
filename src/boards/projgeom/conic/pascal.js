import { Board, V, mk } from '../../../lib/board.js';

/* 帕斯卡与布里安雄：椭圆上六个点决定一个内接六边形，三组对边的交点共线；
   对偶地把六个切线交点连成外切六边形，三条对角线共点。两幅图共用同一组角度。 */
function inter(p1, p2, p3, p4) {
  const d1 = V(p2.x - p1.x, p2.y - p1.y), d2 = V(p4.x - p3.x, p4.y - p3.y);
  const den = d1.x * d2.y - d1.y * d2.x;
  if (Math.abs(den) < 1e-9) return null;
  const t = ((p3.x - p1.x) * d2.y - (p3.y - p1.y) * d2.x) / den;
  return V(p1.x + t * d1.x, p1.y + t * d1.y);
}

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const A = 2.1, Bb = 1.25;
  const st = { mode: 0, angs: [20, 80, 140, 200, 260, 320] };
  const cM = B.chipM('模式');
  const cR = B.chipM('结论');

  B.renderFn = () => {
    const m = B.isoFit(-2.7, 2.7, -1.85, 1.85, [140, 46, 540, 350], 0);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, labs: false });
    mk('ellipse', { cx: m.px(0), cy: m.py(0), rx: A * m.s, ry: Bb * m.s, fill: 'none', stroke: 'rgba(103,232,249,.55)', 'stroke-width': 1.6 }, B.dyn);
    const P = st.angs.map(d => V(A * Math.cos(d * Math.PI / 180), Bb * Math.sin(d * Math.PI / 180)));
    const line = (p, q, at) => B.seg(V(m.px(p.x), m.py(p.y)), V(m.px(q.x), m.py(q.y)), at);
    if (st.mode === 0) {
      for (let i = 0; i < 6; i++) line(P[i], P[(i + 1) % 6], { stroke: 'rgba(92,173,255,.65)', 'stroke-width': 1.2 });
      for (let i = 0; i < 6; i++) {
        B.dot(V(m.px(P[i].x), m.py(P[i].y)), 4.6, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.2 });
        B.text(V(m.px(P[i].x) + 8, m.py(P[i].y) - 7), `P${i + 1}`, { 'font-size': 11, fill: '#5cadff', 'text-anchor': 'start' });
      }
      const X = inter(P[0], P[1], P[3], P[4]);
      const Y = inter(P[1], P[2], P[4], P[5]);
      const Z = inter(P[2], P[3], P[5], P[0]);
      for (const Q of [X, Y, Z]) if (Q) B.dot(V(m.px(Q.x), m.py(Q.y)), 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
      if (X && Y) {
        const dx = Y.x - X.x, dy = Y.y - X.y;
        B.seg(V(m.px(X.x - 6 * dx), m.py(X.y - 6 * dy)), V(m.px(X.x + 6 * dx), m.py(X.y + 6 * dy)), { stroke: '#ffd166', 'stroke-width': 2 });
        B.textM(V(m.px(X.x + 1.6 * dx), m.py(X.y + 1.6 * dy)), '帕斯卡线', { 'font-size': 12, fill: '#ffd166' });
      }
      cR('三点共线');
    } else {
      const T = P.map((p, i) => ({ p, d: V(-A * Math.sin(st.angs[i] * Math.PI / 180), Bb * Math.cos(st.angs[i] * Math.PI / 180)) }));
      for (const t of T) B.seg(V(m.px(t.p.x - 4 * t.d.x), m.py(t.p.y - 4 * t.d.y)), V(m.px(t.p.x + 4 * t.d.x), m.py(t.p.y + 4 * t.d.y)), { stroke: 'rgba(192,132,252,.45)', 'stroke-width': 1.1 });
      const Vx = [];
      for (let i = 0; i < 6; i++) {
        const t1 = T[i], t2 = T[(i + 1) % 6];
        const q = inter(t1.p, V(t1.p.x + t1.d.x, t1.p.y + t1.d.y), t2.p, V(t2.p.x + t2.d.x, t2.p.y + t2.d.y));
        Vx.push(q);
        if (q) B.dot(V(m.px(q.x), m.py(q.y)), 4.2, { fill: '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.1 });
      }
      for (const [i, j] of [[0, 3], [1, 4], [2, 5]]) {
        if (Vx[i] && Vx[j]) line(Vx[i], Vx[j], { stroke: 'rgba(255,158,74,.8)', 'stroke-width': 1.5 });
      }
      const Q = (Vx[0] && Vx[3] && Vx[1] && Vx[4]) ? inter(Vx[0], Vx[3], Vx[1], Vx[4]) : null;
      if (Q) B.dot(V(m.px(Q.x), m.py(Q.y)), 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
      cR('三线共点');
    }
    B.tex(V(410, 28), st.mode === 0 ? '帕斯卡：内接六边形三组对边的交点共线' : '布里安雄：外切六边形三条对角线共点', { size: 16, anchor: 'mid', w: 600 });
    cM(st.mode === 0 ? '帕斯卡' : '布里安雄');
  };

  B.toggleBtn('布里安雄对偶', false, on => { st.mode = on ? 1 : 0; B.render(); });
  const angS = st.angs.map((v, i) => B.slider(`角 ${i + 1}`, 0, 355, 5, v, val => { st.angs[i] = val; B.render(); }));
  B.btn('均匀排布', () => {
    st.angs = [20, 80, 140, 200, 260, 320];
    angS.forEach((s, i) => s.sync(st.angs[i]));
    B.render();
  });
  B.hintM('六点动，帕斯卡线跟着动，第三个交点始终落在线上 —— 这就是定理');
  B.render();
  return B;
}
