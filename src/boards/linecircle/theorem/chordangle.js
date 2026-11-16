/* 图 弦1 · 垂径定理与圆周角
   圆 O 半径 R=3，弦 AB 水平置于 y=h（h 滑块 0..2.6）。
   过 O 作 AB 的垂线，垂足 M 即弦中点（垂径定理）；AM=MB=√(R²−h²)，OM=h。
   P 沿大弧拖动：圆周角 ∠APB 恒等于它所对的圆心角 ∠AOB 的一半。
   h=0 时 AB 为直径，∠APB=90°。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const R = 3;
  const st = { h: 1.6, pa: 1.5 * Math.PI, grid: true, labs: true };
  const m = B.isoFit(-3.7, 3.7, -3.0, 3.0, [44, 30, 760, 390], 10);
  const cH = B.chipM('垂径定理'), cC = B.chipM('圆心角'), cI = B.chipM('圆周角'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const deg = rad => rad * 180 / Math.PI;
  const pt = p => V(m.px(p.x), m.py(p.y));
  const chord = () => {
    const s = Math.sqrt(Math.max(0, R * R - st.h * st.h));
    return { s, A: V(-s, st.h), Bp: V(s, st.h), M: V(0, st.h) };
  };
  // P 只在大弧上走：从 A（角度 π−f）逆时针绕过下方到 B（角度 2π+f）
  const band = () => {
    const { s } = chord();
    const f = Math.atan2(st.h, Math.max(1e-6, s));
    return [Math.PI - f + 0.14, 2 * Math.PI + f - 0.14];
  };
  const arcPath = (cx, cy, rad, a1, a2, N = 40) => {
    const out = [];
    for (let i = 0; i <= N; i++) {
      const t = a1 + (a2 - a1) * i / N;
      const p = pt(V(cx + rad * Math.cos(t), cy + rad * Math.sin(t)));
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
    const { s, A, Bp, M } = chord();
    const O = V(0, 0);
    const [lo, hi] = band();
    if (st.pa < lo) st.pa = lo;
    if (st.pa > hi) st.pa = hi;
    const P = V(R * Math.cos(st.pa), R * Math.sin(st.pa));

    // 过圆心的竖直直径（垂直于弦 AB）
    B.seg(pt(V(0, -R)), pt(V(0, R)), { stroke: '#5cadff', 'stroke-width': 1.3, 'stroke-dasharray': '6 5', 'stroke-opacity': .8 });
    // 弦 AB
    B.seg(pt(A), pt(Bp), { stroke: '#ff9e4a', 'stroke-width': 3.2, 'stroke-opacity': .95 });
    // 半径 OA、OB 与 OP
    B.seg(pt(O), pt(A), { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .75 });
    B.seg(pt(O), pt(Bp), { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .75 });
    B.seg(pt(P), pt(A), { stroke: '#7ee787', 'stroke-width': 1.6, 'stroke-opacity': .95 });
    B.seg(pt(P), pt(Bp), { stroke: '#7ee787', 'stroke-width': 1.6, 'stroke-opacity': .95 });

    // 直角标记（M 处）
    const mu = 0.22;
    B.seg(pt(V(M.x, M.y)), pt(V(M.x, M.y + mu)), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
    B.seg(pt(V(M.x, M.y + mu)), pt(V(M.x + mu, M.y + mu)), { stroke: '#8fa3bd', 'stroke-width': 1.2 });

    // 等长刻度（AM、MB 中点各一道）
    for (const mx of [(A.x + M.x) / 2, (M.x + Bp.x) / 2]) {
      const t1 = pt(V(mx, M.y - 0.16)), t2 = pt(V(mx, M.y + 0.16));
      B.seg(t1, t2, { stroke: '#ff9e4a', 'stroke-width': 1.4 });
    }

    // 圆心角弧（O 处，扫过弦上方）
    const aA = Math.atan2(st.h, A.x), aB = Math.atan2(st.h, Bp.x);
    mk('path', { d: arcPath(0, 0, 0.72, aB, aA), fill: 'none', stroke: '#ff9e4a', 'stroke-width': 2, 'stroke-opacity': .95 }, B.dyn);
    // 圆周角弧（P 处）
    let tA = Math.atan2(A.y - P.y, A.x - P.x), tB = Math.atan2(Bp.y - P.y, Bp.x - P.x);
    let dlt = tB - tA;
    while (dlt > Math.PI) dlt -= 2 * Math.PI;
    while (dlt < -Math.PI) dlt += 2 * Math.PI;
    mk('path', { d: arcPath(P.x, P.y, 0.62, tA, tA + dlt), fill: 'none', stroke: '#7ee787', 'stroke-width': 2, 'stroke-opacity': .95 }, B.dyn);

    // 点与字母
    B.dot(pt(O), 4.5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(pt(O).x + 8, pt(O).y + 15), 'O', { 'font-size': 13, 'font-weight': 700, fill: '#5cadff' });
    B.dot(pt(M), 4, { fill: '#ff9e4a' });
    B.text(V(pt(M).x + 8, pt(M).y + 15), 'M', { 'font-size': 12.5, 'font-weight': 700, fill: '#ff9e4a' });
    B.dot(pt(A), 4.5, { fill: '#ff9e4a' });
    B.dot(pt(Bp), 4.5, { fill: '#ff9e4a' });
    B.text(V(pt(A).x - 16, pt(A).y - 8), 'A', { 'font-size': 13, 'font-weight': 700, fill: '#ff9e4a' });
    B.text(V(pt(Bp).x + 8, pt(Bp).y - 8), 'B', { 'font-size': 13, 'font-weight': 700, fill: '#ff9e4a' });
    B.dot(pt(P), 5, { fill: '#7ee787', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(pt(P).x + 9, pt(P).y + 16), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#7ee787' });

    // 读数
    const vA = V(A.x - P.x, A.y - P.y), vB = V(Bp.x - P.x, Bp.y - P.y);
    const angP = Math.acos(Math.max(-1, Math.min(1, (vA.x * vB.x + vA.y * vB.y) / (Math.hypot(vA.x, vA.y) * Math.hypot(vB.x, vB.y)))));
    const angO = 2 * Math.acos(Math.min(1, Math.abs(st.h) / R));
    cH(`$OM\\perp AB$，$AM=MB=${fz(s)}$，$OM=${fz(st.h)}$，$r=${fz(R)}$`);
    cC(`$\\angle AOB=${fmt(deg(angO), 1)}^\\circ$`);
    cI(`$\\angle APB=${fmt(deg(angP), 1)}^\\circ$`);
    if (Math.abs(st.h) < 5e-3) {
      cJ(`$AB$ 为直径，$\\angle APB=90^\\circ$，这是圆周角定理的特例`);
    } else {
      cJ(`$\\angle APB=\\dfrac12\\angle AOB$，比值 $${fz(angP / angO)}$ 不随 $h$ 与 $P$ 改变`);
    }
  };

  const PRE = [
    { nm: '① 弦居中', v: [1.6, 1.5 * Math.PI] },
    { nm: '② 短弦贴顶', v: [2.6, 1.5 * Math.PI] },
    { nm: '③ 弦即直径', v: [0, 1.5 * Math.PI] },
  ];
  let sH;
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.h, st.pa] = o.v;
    sH.sync(st.h);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.handle({
    color: '#7ee787', r: 7, label: 'P', lo: [9, -9],
    get: () => V(m.px(R * Math.cos(st.pa)), m.py(R * Math.sin(st.pa))),
    set: p => {
      let a = Math.atan2((m.py(0) - p.y) / m.s, (p.x - m.px(0)) / m.s);
      if (a < 0) a += 2 * Math.PI;
      st.pa = a;
    },
  });

  sH = B.slider('弦高 h', 0, 2.6, 0.05, st.h, v => { st.h = v; B.render(); }, 'ch');

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖 P 沿大弧滑动、拖 h 改弦的位置：圆周角始终是圆心角的一半，弦越靠近圆心圆心角越大');
  B.render();
  return B;
}
