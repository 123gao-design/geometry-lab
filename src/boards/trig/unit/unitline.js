/* 图 U1 单位圆坐标机：任意角三角函数的坐标定义 —— P(cos α, sin α)，tan α = 纵/横 = 正切线 AT。
   三条有向线段 MP（正弦）、OM（余弦）、AT（正切）实时联动；转到坐标轴附近看 tan 的无定义。 */
import { TrigLegendBoard, unitCoordinates } from '../trig-board.js';
import { mk, V, fmt, angDiff } from '../../../lib/board.js';
import { angleReadings } from './angle-readings.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 860, 510, 90);
  const O = V(450, 272), R = 165, MAXT = 6 * Math.PI;
  const st = { a: Math.PI / 6, anim: false }; // exact：预设角索引，0 表示非特殊角
  // 预设角：[角值, 按钮标签, 精确值 LaTeX（不含中文）, 中文备注]
  const PRE = [
    [Math.PI / 6, '$\\pi/6$', '\\sin\\frac{\\pi}{6}=\\frac{1}{2},\\ \\cos\\frac{\\pi}{6}=\\frac{\\sqrt{3}}{2},\\ \\tan\\frac{\\pi}{6}=\\frac{\\sqrt{3}}{3}', ''],
    [Math.PI / 4, '$\\pi/4$', '\\sin\\frac{\\pi}{4}=\\cos\\frac{\\pi}{4}=\\frac{\\sqrt{2}}{2},\\ \\tan\\frac{\\pi}{4}=1', ''],
    [Math.PI / 3, '$\\pi/3$', '\\sin\\frac{\\pi}{3}=\\frac{\\sqrt{3}}{2},\\ \\cos\\frac{\\pi}{3}=\\frac{1}{2},\\ \\tan\\frac{\\pi}{3}=\\sqrt{3}', ''],
    [Math.PI / 2, '$\\pi/2$', '\\sin\\frac{\\pi}{2}=1,\\ \\cos\\frac{\\pi}{2}=0', '正切无定义'],
    [2 * Math.PI / 3, '$2\\pi/3$', '\\sin\\frac{2\\pi}{3}=\\frac{\\sqrt{3}}{2},\\ \\cos\\frac{2\\pi}{3}=-\\frac{1}{2},\\ \\tan\\frac{2\\pi}{3}=-\\sqrt{3}', ''],
    [Math.PI, '$\\pi$', '\\sin\\pi=0,\\ \\cos\\pi=-1,\\ \\tan\\pi=0', ''],
    [3 * Math.PI / 2, '$3\\pi/2$', '\\sin\\frac{3\\pi}{2}=-1,\\ \\cos\\frac{3\\pi}{2}=0', '正切无定义'],
  ];

  const panel = angleReadings(B, '当前角 $\\alpha$', '角度与六个三角函数值');
  const reading = (name, tone) => panel.number(`$\\${name}\\alpha$`, tone);
  const cSin = reading('sin', 'blue'), cCsc = reading('csc', 'blue');
  const cCos = reading('cos', 'orange'), cSec = reading('sec', 'orange');
  const cTan = reading('tan', 'green'), cCot = reading('cot', 'green');
  B.chipRow.dataset.readingStyle = 'info';
  B.chipRow.classList.add('paired-notes');
  const cQuad = B.chipM('象限判读'), cEx = B.chipM('特殊值');
  const selected = () => PRE.findIndex(([a]) => Math.abs(a - st.a) < 1e-8);
  B.angleRow([30,45,60,90,120,180,270], () => st.a, a => { st.anim = false; st.a = a; B.render(); });
  const play = B.btn('⏩ 巡游', () => { st.anim = !st.anim; if (st.anim) tick(); else B.render(); });
  function tick() { if (!st.anim) return; st.a = (st.a + 0.02) % (4 * Math.PI); B.render(); B.raf(tick); }

  B.handle({
    get: () => V(O.x + R * Math.cos(st.a), O.y - R * Math.sin(st.a)),
    set: p => {
      const ang = Math.atan2(-(p.y - O.y), p.x - O.x);
      st.a = Math.max(-MAXT, Math.min(MAXT, st.a + angDiff(ang, st.a)));
      st.anim = false;
    },
    color: '#5cadff', r: 8, label: 'P', lo: [10, -10],
  });

  // 名称与有向值分两行。引线始终指向线段中点，退化时指向重合的端点。
  function lineLabel(point, label, anchor, name, formula, color) {
    const size = Math.max(15, Math.min(24, B.labelFontSize()));
    const gap = size * .75, toward = anchor === 'start' ? -1 : 1;
    if (point) B.seg(point, V(label.x + toward * 5, label.y),
      { stroke: color, 'stroke-width': 1, 'stroke-opacity': .65, 'stroke-dasharray': '3 4' });
    const options = { size, color, anchor, w: 205 };
    B.tex(V(label.x, label.y - gap), name, options).style.pointerEvents = 'none';
    B.tex(V(label.x, label.y + gap), formula, options).style.pointerEvents = 'none';
  }

  B.renderFn = () => {
    const a = st.a, { x, y, onAxis } = unitCoordinates(a);
    const tan = x === 0 ? null : y / x;
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
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.8 }, B.dyn);
    B.dot(A, 3.2, { fill: '#93a1b5' });
    B.text(V(A.x, O.y + 30), 'A(1, 0)', { 'font-size': 12, fill: '#93a1b5' });
    B.seg(V(A.x, O.y - 195), V(A.x, O.y + 195), { stroke: '#3f5f8f', 'stroke-width': 1.2, 'stroke-dasharray': '5 5' });
    // 半径 OP 与 P
    B.seg(O, P, { stroke: '#93a1b5', 'stroke-width': 2.2 });
    // 正切线 AT（绿）：直线 OP 与 x=1 的交点
    if (tan !== null) {
      const tv = tan, limit = 1.3;
      const visible = Math.abs(tv) <= limit;
      const clipped = Math.max(-limit, Math.min(limit, tv));
      const Td = V(A.x, O.y - R * clipped);
      const end = visible ? Td : V(O.x + R * clipped / tv, Td.y);
      B.seg(O, end, { stroke: '#93a1b5', 'stroke-dasharray': '3 4' });
      if (visible) {
        B.seg(A, Td, { stroke: '#4ade80', 'stroke-width': 3 });
        B.mark(Td, '#4ade80');
        B.text(V(Td.x + 8, Td.y - 9), 'T');
      } else B.arrow(A, Td, { stroke: '#4ade80', 'stroke-width': 2.5 });
      const mid = V(A.x, (A.y + Td.y) / 2);
      const tangentLabel = Math.abs(tv) < 100 ? `$\\tan\\alpha\\approx${fmt(tv, 3)}$` : '交点 $T$ 在图外';
      lineLabel(mid, V(A.x + 32, O.y - (tv < 0 ? -1 : 1) * Math.max(62, Math.abs(mid.y - O.y))),
        'start', '正切线 $AT$', tangentLabel, '#4ade80');
    } else lineLabel(null, V(A.x + 32, O.y - 78), 'start', '正切无定义', '$\\cos\\alpha=0$', '#4ade80');

    // 轴线角时函数线与半径重合，优先显示函数线的颜色。
    B.seg(O, M, { stroke: '#ff9e4a', 'stroke-width': 3.5 });
    B.seg(M, P, { stroke: '#5cadff', 'stroke-width': 3.5 });
    B.mark(M, '#ff9e4a');
    const side = y < -1e-10 ? 1 : -1;
    const cosMid = V((O.x + M.x) / 2, O.y);
    lineLabel(cosMid, V(O.x + (x < 0 ? -20 : 20), O.y - side * 62), x < 0 ? 'end' : 'start',
      '余弦线 $OM$', `$\\cos\\alpha\\approx${fmt(x, 3)}$`, '#ff9e4a');
    lineLabel(V(M.x, (M.y + P.y) / 2), V(M.x - 44, O.y + side * Math.max(64, Math.abs(P.y - O.y) + 32)), 'end',
      '正弦线 $MP$', `$\\sin\\alpha\\approx${fmt(y, 3)}$`, '#5cadff');
    // 角标记 α 的小弧（0 → a 的短弧，采样画，免记弧旗标）
    const an = angDiff(a, 0), arc = [];
    for (let i = 0; i <= 14; i++) {
      const th = an * i / 14;
      arc.push(`${(O.x + 42 * Math.cos(th)).toFixed(1)},${(O.y - 42 * Math.sin(th)).toFixed(1)}`);
    }
    mk('polyline', { points: arc.join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 1.6 }, B.dyn);
    B.text(V(O.x + 62 * Math.cos(an / 2), O.y - 62 * Math.sin(an / 2)), 'α', { 'font-size': 14, fill: '#ffd166', 'font-style': 'italic' });
    B.note('横坐标 $x_P=\\cos\\alpha$', '#ff9e4a');
    B.note('纵坐标 $y_P=\\sin\\alpha$', '#5cadff');
    B.note('切线纵坐标 $y_T=\\tan\\alpha$', '#4ade80');
    // chips
    play.classList.toggle('on', st.anim);
    panel.angle(a);
    cSin(y); cCsc(y === 0 ? null : 1 / y);
    cCos(x); cSec(x === 0 ? null : 1 / x);
    cTan(tan); cCot(y === 0 ? null : x / y);
    const d0 = ((deg % 360) + 360) % 360;
    cQuad(onAxis
      ? (x === 0 ? '终边在纵轴上，正切和正割无定义。' : '终边在横轴上，余切和余割无定义。')
      : `第 ${d0 < 90 ? 'I' : d0 < 180 ? 'II' : d0 < 270 ? 'III' : 'IV'} 象限：sin ${y >= 0 ? '+' : '-'}、cos ${x >= 0 ? '+' : '-'}、tan ${y * x >= 0 ? '+' : '-'}`);
    const pe = PRE[selected()];
    cEx(pe ? `$${pe[2].split(',\\ ').join('$，$')}$${pe[3] ? '，' + pe[3] : ''}` : '选择上方的预设角可查看精确值。');
  };
  B.render();
  return B;
}
