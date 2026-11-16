/* 图 B2 弧长展开机：弧度制 α = s/r。扇形可整体「摊平」成直尺 —— 每格恰一个半径，
   格数就是弧度数；s=αr、S=½αr² 实时记录。坐标：C 为圆心，α 关于 +x 轴对称张角。 */
import { Board, mk, V, fmt, lerp, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 470);
  const C = V(218, 232), S = 55;              // 55 px / 单位长
  const st = { r: 1.2, deg: 90, t: 0, tt: 0, say: '' }; // t 展开进度 → tt 目标
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const radStr = d => {                       // 度 → π 分数（15 的倍数给精确分数）
    if (d % 15 !== 0) return `${fmt(d * Math.PI / 180, 3)} rad`;
    const g = gcd(d / 15, 12), p = d / 15 / g, q = 12 / g;
    return (p === 1 ? '' : p) + 'π' + (q === 1 ? '' : '/' + q);
  };

  const cAng = B.chip('圆心角'), cArc = B.chip('弧长 s'), cArea = B.chip('扇形面积 S'),
    cRatio = B.chip('s ÷ r'), cSay = B.chip('判读');

  const rSl = B.slider('半径 r', 1, 2, 0.05, st.r, v => { st.r = v; st.say = ''; B.render(); });
  const aSl = B.slider('圆心角 α°', 15, 330, 5, st.deg, v => { st.deg = v; st.say = ''; B.render(); });
  B.btn('① 60°', () => setDeg(60));
  B.btn('② 90°', () => setDeg(90));
  B.btn('③ 180°', () => setDeg(180));
  B.btn('④ 270°', () => setDeg(270));
  B.btn('r×2', () => {
    st.r = Math.min(2, st.r * 2); rSl.sync(st.r);
    st.say = '弧长随 r 加倍、α 不变：s/r 恒为弧度数 —— 弧度与半径无关';
    B.render();
  });
  B.btn('⏩ 展开 / 卷回', () => { st.tt = st.tt ? 0 : 1; tick(); });

  function setDeg(d) { st.deg = d; st.say = ''; aSl.sync(d); B.render(); }
  function tick() {
    if (Math.abs(st.t - st.tt) < 0.005) { st.t = st.tt; B.render(); return; }
    st.t += (st.tt - st.t) * 0.06 + (st.tt > st.t ? 0.004 : -0.004);
    B.render(); B.raf(tick);
  }

  B.renderFn = () => {
    const A = st.deg * Math.PI / 180, r = st.r, rp = r * S, sp = A * rp; // rp 半径像素、sp 弧长像素
    const e = st.t * st.t * (3 - 2 * st.t);                              // smoothstep
    // 整圆（淡）+ 扇形 + 弧（摊平动画：弧上采样点从圆上插值到直尺上）
    mk('circle', { cx: C.x, cy: C.y, r: rp, fill: 'none', stroke: '#22314a', 'stroke-width': 1.4, 'stroke-opacity': .7 }, B.dyn);
    const M = 40, pts = [], ends = [];
    for (let i = 0; i <= M; i++) {
      const ang = -A / 2 + A * i / M;
      const pc = V(C.x + rp * Math.cos(ang), C.y - rp * Math.sin(ang));
      const p = lerp(pc, V(120 + sp * i / M, 418), e);
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      if (i === 0 || i === M) ends.push(p);
    }
    if (e < 0.02) mk('path', { d: `M${C.x},${C.y}L${pts.join('L')}Z`, fill: 'rgba(92,173,255,.05)' }, B.dyn);
    B.seg(C, ends[0], { stroke: '#ff9e4a', 'stroke-width': 1.8 });
    B.seg(C, ends[1], { stroke: '#ff9e4a', 'stroke-width': 1.8 });
    B.text(V((C.x + ends[0].x) / 2 + 16, (C.y + ends[0].y) / 2 + 4), `r=${fmt(r, 2)}`, { 'font-size': 12, fill: '#ff9e4a' });
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 4.5, 'stroke-linecap': 'round' }, B.dyn);
    // 直尺虚线基准 + 每格一个半径的刻度
    B.seg(V(120, 418), V(120 + sp, 418), { stroke: '#3f5f8f', 'stroke-width': 1, 'stroke-dasharray': '4 5' });
    for (let j = 0; j <= Math.floor(A + 1e-9); j++) {
      const x = 120 + rp * j;
      if (x > 120 + sp + 1) break;
      B.seg(V(x, 412), V(x, 424), { stroke: '#3f5f8f', 'stroke-width': 1.4 });
    }
    B.tex(V(120 + sp / 2, 446), `$s=\\alpha r$：摊平后 $s$ = ${fmt(A, 2)} 个半径长`, { anchor: 'mid', w: 560 });
    B.text(V(C.x, C.y + 14), `${fmt(st.deg, 0)}°`, { 'font-size': 14, fill: '#93a1b5' });
    // chips
    cAng(`${fmt(st.deg, 0)}° = ${radStr(st.deg)}`);
    cArc(`s = αr = ${fmt(A, 3)} × ${fmt(r, 2)} = ${fmt(A * r, 2)}`);
    cArea(`S = ½αr² = ½sr = ${fmt(.5 * A * r * r, 2)}`);
    cRatio(`${fmt(A * r, 2)} ÷ ${fmt(r, 2)} = ${fmt(A, 2)}（恒为弧度数）`);
    cSay(st.say || 'α 用弧度时公式最干净：s=αr、S=½αr² —— 角度制都得先乘 π/180');
  };
  B.render();
  B.hint('拖 α 与 r：弧长、面积实时记录；⏩ 把弧摊平成直尺 —— 每格恰一个半径，格数就是弧度数');
  return B;
}
