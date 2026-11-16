/* 图 U1 单位圆坐标机：任意角三角函数的坐标定义 —— P(cos α, sin α)，tan α = 纵/横 = 正切线 AT。
   三条有向线段 MP（正弦）、OM（余弦）、AT（正切）实时联动；转到坐标轴附近看 tan 的无定义。 */
import { Board, mk, V, fmt, angDiff } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const O = V(450, 272), R = 165, MAXT = 6 * Math.PI;
  const st = { a: Math.PI / 6, anim: false, exact: 0 }; // exact：预设角索引，0 表示非特殊角
  let prev = angDiff(st.a, 0);
  // 预设角：[角值, 按钮标签, 精确值 LaTeX（不含中文）, 中文备注]
  const PRE = [
    [Math.PI / 6, '$\\pi/6$', '\\sin\\frac{\\pi}{6}=\\frac{1}{2},\\ \\cos\\frac{\\pi}{6}=\\frac{\\sqrt{3}}{2},\\ \\tan\\frac{\\pi}{6}=\\frac{\\sqrt{3}}{3}', ''],
    [Math.PI / 4, '$\\pi/4$', '\\sin\\frac{\\pi}{4}=\\cos\\frac{\\pi}{4}=\\frac{\\sqrt{2}}{2},\\ \\tan\\frac{\\pi}{4}=1', ''],
    [Math.PI / 3, '$\\pi/3$', '\\sin\\frac{\\pi}{3}=\\frac{\\sqrt{3}}{2},\\ \\cos\\frac{\\pi}{3}=\\frac{1}{2},\\ \\tan\\frac{\\pi}{3}=\\sqrt{3}', ''],
    [Math.PI / 2, '$\\pi/2$', '\\sin\\frac{\\pi}{2}=1,\\ \\cos\\frac{\\pi}{2}=0', 'tan 不存在'],
    [2 * Math.PI / 3, '$2\\pi/3$', '\\sin\\frac{2\\pi}{3}=\\frac{\\sqrt{3}}{2},\\ \\cos\\frac{2\\pi}{3}=-\\frac{1}{2},\\ \\tan\\frac{2\\pi}{3}=-\\sqrt{3}', ''],
    [Math.PI, '$\\pi$', '\\sin\\pi=0,\\ \\cos\\pi=-1,\\ \\tan\\pi=0', ''],
    [3 * Math.PI / 2, '$3\\pi/2$', '\\sin\\frac{3\\pi}{2}=-1,\\ \\cos\\frac{3\\pi}{2}=0', 'tan 不存在'],
  ];

  const cA = B.chip('α'), cSin = B.chipM('$\\sin\\alpha$'), cCos = B.chipM('$\\cos\\alpha$'),
    cTan = B.chipM('$\\tan\\alpha$'), cQuad = B.chip('象限判读'), cEx = B.chipM('特殊值');
  PRE.forEach(([v, lab], i) => B.btnM(lab, () => set(v, i + 1)));
  B.btn('⏩ 巡游', () => { st.anim = !st.anim; st.anim && tick(); });
  function set(a, ex) { st.a = a; st.exact = ex || 0; prev = angDiff(a, 0); B.render(); }
  function tick() { if (!st.anim) return; st.a = (st.a + 0.02) % (4 * Math.PI); B.render(); B.raf(tick); }

  B.handle({
    get: () => V(O.x + R * Math.cos(st.a), O.y - R * Math.sin(st.a)),
    set: p => {
      const ang = Math.atan2(-(p.y - O.y), p.x - O.x);
      st.a = Math.max(-MAXT, Math.min(MAXT, st.a + angDiff(ang, prev)));
      prev = ang; st.exact = 0;
    },
    color: '#5cadff', r: 8, label: 'P', lo: [10, -10],
  });

  B.renderFn = () => {
    const a = st.a, x = Math.cos(a), y = Math.sin(a);
    const P = V(O.x + R * x, O.y - R * y), M = V(P.x, O.y), A = V(O.x + R, O.y);
    const deg = a * 180 / Math.PI;
    // 坐标轴 + ±1 刻度
    B.seg(V(230, O.y), V(672, O.y), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    B.seg(V(O.x, 62), V(O.x, 482), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `672,${O.y} 663,${O.y - 4.5} 663,${O.y + 4.5}`, fill: '#8fa3bd' }, B.dyn);
    mk('polygon', { points: `${O.x},62 ${O.x - 4.5},71 ${O.x + 4.5},71`, fill: '#8fa3bd' }, B.dyn);
    B.text(V(668, O.y - 12), 'x', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    B.text(V(O.x + 12, 74), 'y', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    B.text(V(A.x + 5, O.y + 16), '1', { 'font-size': 11, fill: '#5c6a80' });
    B.text(V(O.x - R - 5, O.y + 16), '-1', { 'font-size': 11, fill: '#5c6a80' });
    // 单位圆 + A 点与切线（x=1 处竖直虚线）
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#22314a', 'stroke-width': 1.8 }, B.dyn);
    B.dot(A, 3.2, { fill: '#93a1b5' });
    B.text(V(A.x, O.y + 30), 'A(1, 0)', { 'font-size': 12, fill: '#93a1b5' });
    B.seg(V(A.x, O.y - 195), V(A.x, O.y + 195), { stroke: '#3f5f8f', 'stroke-width': 1.2, 'stroke-dasharray': '5 5' });
    // 余弦线 OM（橙，横）与正弦线 MP（蓝，纵）
    B.seg(O, M, { stroke: '#ff9e4a', 'stroke-width': 3.5 });
    B.seg(M, P, { stroke: '#5cadff', 'stroke-width': 3.5 });
    B.textM(V((O.x + M.x) / 2, O.y + (x >= 0 ? 17 : -12)), `$OM=\\cos\\alpha=${fmt(x, 3)}`, { 'font-size': 12, fill: '#ff9e4a' });
    B.textM(V(M.x + 8, (P.y + M.y) / 2 + 4), `$MP=\\sin\\alpha=${fmt(y, 3)}`, { 'font-size': 12, fill: '#5cadff' });
    // 半径 OP 与 P
    B.seg(O, P, { stroke: '#fff', 'stroke-width': 2.2 });
    B.dot(P, 5.5, { fill: '#5cadff' });
    // 正切线 AT（绿）：直线 OP 与 x=1 的交点
    if (Math.abs(x) > 1e-6) {
      const tv = y / x, tBig = Math.abs(tv) > 3.4;
      const Td = V(A.x, O.y - R * (tBig ? Math.sign(tv) * 3.4 : tv));
      B.seg(O, Td, { stroke: '#2b4260', 'stroke-width': 1, 'stroke-dasharray': '2 4', 'stroke-opacity': .6 });
      B.seg(A, Td, { stroke: '#4ade80', 'stroke-width': 3.5 });
      B.textM(V(A.x + 8, (A.y + Td.y) / 2 + 4), tBig ? '$AT=\\tan\\alpha$（溢出显示）' : `$AT=\\tan\\alpha=${fmt(tv, 3)}`, { 'font-size': 12, fill: '#4ade80' });
    }
    // 角标记 α 的小弧（0 → a 的短弧，采样画，免记弧旗标）
    const an = angDiff(a, 0), arc = [];
    for (let i = 0; i <= 14; i++) {
      const th = an * i / 14;
      arc.push(`${(O.x + 42 * Math.cos(th)).toFixed(1)},${(O.y - 42 * Math.sin(th)).toFixed(1)}`);
    }
    mk('polyline', { points: arc.join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 1.6 }, B.dyn);
    B.text(V(O.x + 62 * Math.cos(an / 2), O.y - 62 * Math.sin(an / 2)), 'α', { 'font-size': 14, fill: '#ffd166', 'font-style': 'italic' });
    // chips
    cA(`${fmt(deg, 1)}° · ${fmt(a, 3)} rad`);
    cSin(fmt(y, 3)); cCos(fmt(x, 3));
    if (Math.abs(x) > 1e-6) {
      const t = y / x;
      cTan(Math.abs(t) > 999 ? '溢出（→∞）' : fmt(t, 3));
    } else cTan('无定义（cos α = 0）', 'warn');
    const d0 = ((deg % 360) + 360) % 360;
    cQuad(d0 === 0 || d0 === 90 || d0 === 180 || d0 === 270
      ? '终边在坐标轴上 —— 函数线退化为 0 或 ±1'
      : `第 ${d0 < 90 ? 'I' : d0 < 180 ? 'II' : d0 < 270 ? 'III' : 'IV'} 象限：sin ${y >= 0 ? '+' : '-'}、cos ${x >= 0 ? '+' : '-'}、tan ${y * x >= 0 ? '+' : '-'}`);
    const pe = st.exact ? PRE[st.exact - 1] : null;
    cEx(pe ? `$${pe[2]}$${pe[3] ? '，' + pe[3] : ''}` : '非特殊角 —— 点预设角看精确值');
  };
  B.render();
  B.hint('拖 P 转圈：蓝线 MP=sin、橙线 OM=cos、绿线 AT=tan；转到 90° 看 tan 的无定义与符号翻转');
  return B;
}
