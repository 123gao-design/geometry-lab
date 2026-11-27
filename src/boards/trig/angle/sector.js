/* 图 B2 弧长展开机：弧度制 α = s/r。扇形可整体「摊平」成直尺 —— 每格恰一个半径，
   格数就是弧度数；s=αr、S=½αr² 实时记录。坐标：C 为圆心，α 关于 +x 轴对称张角。 */
import { TrigBoard, angleTex } from '../trig-board.js';
import { mk, V, fmt, lerp } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigBoard(root, 860, 470);
  const C = V(430, 173), S = 62;              // 每单位长度的像素数
  const st = { r: 1, deg: 90, t: 0, tt: 0, say: '' }; // t 展开进度 → tt 目标
  B.groupReadings('弧度与扇形');
  B.chipRow.dataset.readingStyle = 'info';
  const cAng = B.readout('圆心角', 'gold'), cRatio = B.readout('弧长与半径之比', 'mint');
  const cArc = B.readout('弧长', 'blue'), cArea = B.readout('扇形面积', 'orange');
  const cSay = B.chipM('判读');

  const rSl = B.slider('半径 r', 1, 2, 0.05, st.r, v => { st.r = v; st.say = ''; B.render(); }, undefined, (_, v) => `$r=${fmt(v, 2)}$`);
  const aSl = B.slider('圆心角 α°', 15, 330, 5, st.deg, v => { st.deg = v; st.say = ''; B.render(); }, undefined, (_, v) => `$\\alpha=${v}^\\circ$`);
  B.angleRow([60, 90, 180, 270], () => st.deg * Math.PI / 180, a => setDeg(Math.round(a * 180 / Math.PI)), true);
  B.btn('取半径 2', () => {
    const old = st.r; st.r = 2; rSl.sync(st.r);
    st.say = `半径从 $${fmt(old,2)}$ 变为 $${fmt(st.r,2)}$，圆心角与比值 $s/r$ 保持不变。`;
    B.render();
  });
  let moving = false;
  B.btn('⏩ 展开 / 卷回', () => { st.tt = st.tt ? 0 : 1; if (!moving) tick(); });

  function setDeg(d) { st.deg = d; st.say = ''; aSl.sync(d); B.render(); }
  function tick() {
    if (Math.abs(st.t - st.tt) < 0.005) { st.t = st.tt; moving = false; B.render(); return; }
    moving = true;
    st.t += (st.tt - st.t) * .10;
    B.render(); B.raf(tick);
  }

  B.renderFn = () => {
    const A = st.deg * Math.PI / 180, r = st.r, rp = r * S, sp = A * rp; // rp 半径像素、sp 弧长像素
    const e = st.t * st.t * (3 - 2 * st.t);                              // smoothstep
    // 整圆（淡）+ 扇形 + 弧（摊平动画：弧上采样点从圆上插值到直尺上）
    mk('circle', { cx: C.x, cy: C.y, r: rp, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.4, 'stroke-opacity': .7 }, B.dyn);
    const M = 40, pts = [], ends = [];
    // 逐渐减小曲率；用弧中点的切向和弦长定位，使整个展开过程等弧长。
    const start = (B.w - Math.ceil(A) * rp) / 2;
    const mid = lerp(V(C.x + rp, C.y), V(start + sp / 2, 418), e);
    mid.y += .34 * sp * e * (1 - e); // 展开大扇形时为外弧留出上边距
    const tangent = -(1 - e) * Math.PI / 2;
    for (let i = 0; i <= M; i++) {
      const u = i / M - .5, halfTurn = -u * A * (1 - e) / 2;
      const chord = u * sp * (Math.abs(halfTurn) < 1e-9 ? 1 : Math.sin(halfTurn) / halfTurn);
      const p = V(mid.x + chord * Math.cos(tangent + halfTurn), mid.y + chord * Math.sin(tangent + halfTurn));
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      if (i === 0 || i === M) ends.push(p);
    }
    if (e < 0.02) mk('path', { d: `M${C.x},${C.y}L${pts.join('L')}Z`, fill: '#5cadff', 'fill-opacity': .08 }, B.dyn);
    if (e < .001) B.seg(C, ends[0], { stroke: '#ff9e4a', 'stroke-width': 1.8 });
    if (e < .001) B.seg(C, ends[1], { stroke: '#ff9e4a', 'stroke-width': 1.8 });
    if (e < .001) B.text(V((C.x + ends[0].x) / 2 + 16, (C.y + ends[0].y) / 2 + 4), `r=${fmt(r, 2)}`, { 'font-size': 12, fill: '#ff9e4a' });
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, B.dyn);
    // 直尺虚线基准 + 每格一个半径的刻度
    B.mark(ends[0], '#5cadff'); B.mark(ends[1], '#5cadff');
    const rulerEnd = start + Math.ceil(A) * rp;
    B.seg(V(start, 418), V(rulerEnd, 418), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '4 5' });
    for (let j = 0; j <= Math.ceil(A); j++) {
      const x = start + rp * j;
      B.text(V(x, 445), j === 0 ? '0' : j === 1 ? 'r' : j + 'r', { fill: '#93a1b5', 'font-size': 13 });
      B.seg(V(x, 412), V(x, 424), { stroke: '#93a1b5', 'stroke-width': 1.4 });
    }
    cAng(`$${st.deg}^\\circ=${angleTex(A)}\\,\\mathrm{rad}$`);
    cArc(`$s=r\\alpha\\approx${fmt(A*r, 3)}$`);
    cArea(`$S=sr/2\\approx${fmt(.5*A*r*r, 3)}$`);
    cRatio(`$s/r=${angleTex(A)}$`);
    cSay(st.say || '直尺每格长 $r$，弧展开后占据的格数就是圆心角的弧度数。');
  };
  B.render();
  return B;
}
