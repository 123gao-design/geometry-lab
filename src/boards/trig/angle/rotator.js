/* 图 B1 终边转针机：任意角 = 旋转量（可正可负、可超 2π）。把手累积圈数，螺旋扫痕记录，
   终边相同角 α₀+2kπ 实时读数。坐标：O 为圆心，数学角 α 逆时针为正（SVG y 向下，取负号换算）。 */
import { Board, mk, V, fmt, angDiff, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 500);
  const O = V(430, 255), R = 155, STEP = 13, MAXT = 6 * Math.PI; // 每圈螺旋半径内缩 13
  const st = { a: Math.PI / 6, dir: 1, anim: false };
  let prev = angDiff(st.a, 0);

  const cDeg = a => a * 180 / Math.PI;
  const quad = d0 => { // d0 ∈ [0,360)
    if (d0 === 0 || d0 === 90 || d0 === 180 || d0 === 270) return '终边落在坐标轴上（轴线角，不属于任何象限）';
    return d0 < 90 ? '第 I 象限' : d0 < 180 ? '第 II 象限' : d0 < 270 ? '第 III 象限' : '第 IV 象限';
  };

  // chips
  const cDegu = B.chip('α（度）'), cRad = B.chip('α（弧度）'), cAcc = B.chip('转角读数'),
    cSame = B.chip('终边相同角'), cQuad = B.chip('象限归属');
  B.btn('① 30°', () => set(Math.PI / 6));
  B.btn('② 390°', () => set(13 * Math.PI / 6));
  B.btn('③ −330°', () => set(-11 * Math.PI / 6));
  B.btn('④ 750°', () => set(25 * Math.PI / 6));
  const goBtn = B.btn('⏩ 连转', () => { st.anim = !st.anim; st.anim && tick(); });
  function set(a) { st.a = a; prev = angDiff(a, 0); B.render(); }
  function tick() {
    if (!st.anim) return;
    st.a += st.dir * 0.045;
    if (st.a > MAXT) { st.a = MAXT; st.dir = -1; }
    if (st.a < -MAXT) { st.a = -MAXT; st.dir = 1; }
    B.render();
    B.raf(tick);
  }

  B.handle({
    get: () => V(O.x + R * Math.cos(st.a), O.y - R * Math.sin(st.a)),
    set: p => {
      const ang = Math.atan2(-(p.y - O.y), p.x - O.x);
      st.a = Math.max(-MAXT, Math.min(MAXT, st.a + angDiff(ang, prev)));
      prev = ang;
    },
    color: '#ffd166', r: 8, label: 'P', lo: [10, -10],
  });

  B.renderFn = () => {
    const a = st.a, deg = cDeg(a), k = Math.floor(deg / 360), d0 = deg - 360 * k;
    // 坐标轴 + 象限编号
    B.seg(V(60, O.y), V(800, O.y), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    B.seg(V(O.x, 40), V(O.x, 470), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `800,${O.y} 791,${O.y - 4.5} 791,${O.y + 4.5}`, fill: '#8fa3bd' }, B.dyn);
    mk('polygon', { points: `${O.x},40 ${O.x - 4.5},49 ${O.x + 4.5},49`, fill: '#8fa3bd' }, B.dyn);
    B.text(V(795, O.y - 12), 'x', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    B.text(V(O.x + 12, 55), 'y', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    [[190, 155, 'I'], [668, 155, 'II'], [668, 352, 'III'], [190, 352, 'IV']].forEach(([x, y, s]) =>
      B.text(V(x, y), s, { 'font-size': 15, fill: '#3f5f8f', 'font-weight': 700 }));
    // 圆 + 始边
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#22314a', 'stroke-width': 1.6 }, B.dyn);
    B.seg(O, V(O.x + R, O.y), { stroke: '#5c6a80', 'stroke-width': 2.2 });
    mk('polygon', { points: `${O.x + R},${O.y} ${O.x + R - 10},${O.y - 4.5} ${O.x + R - 10},${O.y + 4.5}`, fill: '#5c6a80' }, B.dyn);
    B.text(V(O.x + R - 22, O.y + 18), '始边', { 'font-size': 12, fill: '#5c6a80' });
    // 螺旋扫痕：从 0 累积到 a，每满一圈半径内缩一步
    const pts = [];
    const nStep = Math.max(2, Math.ceil(Math.abs(a) / 0.06));
    for (let i = 0; i <= nStep; i++) {
      const th = a * i / nStep, r = R - STEP * Math.floor(Math.abs(th) / TAU + 1e-9);
      pts.push(`${(O.x + r * Math.cos(th)).toFixed(1)},${(O.y - r * Math.sin(th)).toFixed(1)}`);
    }
    const rr = R - STEP * Math.floor(Math.abs(a) / TAU + 1e-9);
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 3, 'stroke-opacity': .8 }, B.dyn);
    mk('polygon', { points: `${O.x + rr * Math.cos(a)},${O.y - rr * Math.sin(a)} ${O.x + (rr - 12) * Math.cos(a - .05)},${O.y - (rr - 12) * Math.sin(a - .05)} ${O.x + (rr - 12) * Math.cos(a + .05)},${O.y - (rr - 12) * Math.sin(a + .05)}`, fill: '#ffd166' }, B.dyn);
    B.text(V(O.x + (rr + 16) * Math.cos(a / 2), O.y - (rr + 16) * Math.sin(a / 2)), `${fmt(deg, 1)}°`, { 'font-size': 14, fill: '#ffd166' });
    // 终边
    B.seg(O, V(O.x + R * Math.cos(a), O.y - R * Math.sin(a)), { stroke: '#fff', 'stroke-width': 2.6 });
    B.text(V(O.x + (R + 26) * Math.cos(a), O.y - (R + 26) * Math.sin(a)), '终边', { 'font-size': 12, fill: '#aebdd2' });
    // chips
    cDegu(`${fmt(deg, 1)}°`);
    cRad(`${fmt(a, 3)} rad ≈ ${fmt(a / Math.PI, 3)}π`);
    cAcc(k === 0
      ? `不足一圈：余 ${fmt(d0, 1)}°（${a >= 0 ? '正' : '负'}向）`
      : `${k} 整圈（${k > 0 ? '正' : '负'}向）+ 余 ${fmt(d0, 1)}°`);
    cSame(`β = ${fmt(d0, 1)}° + k·360°（k∈ℤ，此刻 k=${k}）`);
    cQuad(quad(d0));
  };
  B.render();
  B.hint('拖动圆上把手旋转：转过一圈角度继续累加 —— 390° 与 30° 终边重合、角度不同；⏩ 自动连转');
  return B;
}
