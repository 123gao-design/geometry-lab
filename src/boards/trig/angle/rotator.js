/* 图 B1 终边转针机：任意角 = 旋转量（可正可负、可超 2π）。把手累积圈数，螺旋扫痕记录，
   终边相同角 α₀+2kπ 实时读数。坐标：O 为圆心，数学角 α 逆时针为正（SVG y 向下，取负号换算）。 */
import { TrigBoard, angleTex } from '../trig-board.js';
import { mk, V, fmt, angDiff, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigBoard(root, 860, 500);
  const O = V(430, 255), R = 155, STEP = 13, MAXT = 6 * Math.PI; // 每圈螺旋半径内缩 13
  const st = { a: Math.PI / 6, dir: 1, anim: false };

  const cDeg = a => a * 180 / Math.PI;
  const quad = d0 => { // d0 ∈ [0,360)
    if (d0 === 0 || d0 === 90 || d0 === 180 || d0 === 270) return '终边落在坐标轴上（轴线角，不属于任何象限）';
    return d0 < 90 ? '第 I 象限' : d0 < 180 ? '第 II 象限' : d0 < 270 ? '第 III 象限' : '第 IV 象限';
  };

  B.groupReadings('当前转角');
  B.chipRow.dataset.readingStyle = 'info';
  B.chipRow.classList.add('paired-notes');
  const cDegu = B.readout('角度', 'gold'), cRad = B.readout('弧度', 'blue'), cAcc = B.readout('转角分解', 'mint');
  const cSame = B.chipM('终边相同角'), cQuad = B.chipM('象限归属');
  B.angleRow([30, 390, -330, 750], () => st.a, set, true);
  const goBtn = B.btn('⏩ 连转', () => { st.anim = !st.anim; if (st.anim) tick(); else B.render(); });
  function set(a) { st.anim = false; st.a = a; B.render(); }
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
      st.a = Math.max(-MAXT, Math.min(MAXT, st.a + angDiff(ang, st.a)));
      st.anim = false;
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
    // 象限编号：SVG 的 y 轴朝下，第 I 象限在右上方（x>0、y>0），顺时针数 II、III、IV
    [[668, 155, 'I'], [190, 155, 'II'], [190, 352, 'III'], [668, 352, 'IV']].forEach(([x, y, s]) =>
      B.text(V(x, y), s, { 'font-size': 15, fill: '#3f5f8f', 'font-weight': 700 }));
    // 圆 + 始边
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.6 }, B.dyn);
    B.seg(O, V(O.x + R, O.y), { stroke: '#5c6a80', 'stroke-width': 2.2 });
    mk('polygon', { points: `${O.x + R},${O.y} ${O.x + R - 10},${O.y - 4.5} ${O.x + R - 10},${O.y + 4.5}`, fill: '#5c6a80' }, B.dyn);
    B.text(V(O.x + R - 22, O.y + 18), '始边', { 'font-size': 12, fill: '#5c6a80' });
    // 螺旋扫痕：从 0 累积到 a，半径随转过的角连续内缩（转满一圈缩 STEP）。
    // 半径不能按整圈取整——取整时第一圈恰好恒在圆周上，一跨过 2π，箭尖、角度读数与螺旋末端就整块弹进 13px，
    // 每次跨圈都跳一下；改成连续内缩后，箭尖与读数随转角匀速向内滑，不再有跳变
    const rOf = th => R - STEP * Math.abs(th) / TAU;
    const pts = [];
    const nStep = Math.max(2, Math.ceil(Math.abs(a) / 0.06));
    for (let i = 0; i <= nStep; i++) {
      const th = a * i / nStep, r = rOf(th);
      pts.push(`${(O.x + r * Math.cos(th)).toFixed(1)},${(O.y - r * Math.sin(th)).toFixed(1)}`);
    }
    const rr = rOf(a);
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 3, 'stroke-opacity': .8 }, B.dyn);
    const prev = a * (nStep - 1) / nStep;
    if (Math.abs(a) > .01) B.arrow(V(O.x + rOf(prev) * Math.cos(prev), O.y - rOf(prev) * Math.sin(prev)),
      V(O.x + rr * Math.cos(a), O.y - rr * Math.sin(a)), { line: false, stroke: '#ffd166', head: 10, wide: 4 });
    B.text(V(O.x + (rr + 16) * Math.cos(a / 2), O.y - (rr + 16) * Math.sin(a / 2)), `${fmt(deg, 1)}°`, { 'font-size': 14, fill: '#ffd166' });
    // 终边
    B.seg(O, V(O.x + R * Math.cos(a), O.y - R * Math.sin(a)), { stroke: '#93a1b5', 'stroke-width': 2.6 });
    // 标签沿射线内侧落位，再沿法线让开 12px：既避开圆上的把手 P，也避开 (a/2) 处的角度读数
    const lr = R * 0.72, lx = O.x + lr * Math.cos(a) - 12 * Math.sin(a), ly = O.y - lr * Math.sin(a) - 12 * Math.cos(a);
    B.text(V(lx, ly), '终边', { 'font-size': 12, fill: '#93a1b5' });
    // chips
    goBtn.classList.toggle('on', st.anim);
    cDegu(`$${fmt(deg, 1)}^\\circ$`);
    cRad(`$${angleTex(a)}\\,\\mathrm{rad}$`);
    cAcc(`$${fmt(deg, 1)}^\\circ=${k}\\times360^\\circ+${fmt(d0, 1)}^\\circ$`);
    cSame(`$\\beta=${fmt(d0, 1)}^\\circ+k\\cdot360^\\circ$，$k\\in\\mathbb Z$`);
    cQuad(quad(d0));
  };
  B.render();
  return B;
}
