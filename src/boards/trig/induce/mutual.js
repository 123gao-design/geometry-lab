/* 图 I2 诱导总机：k·π/2 ± α 各组公式一屏拨完 —— k 拨 0..4，−α 族走镜像（镜面倾斜 k·π/4）、+α 族走旋转（k 个直角）。
   k 偶归 I1 镜像五组（函数名不变）、k 奇换名（sin↔cos、tan↔cot）；符号一律看 β 的象限 —— 奇变偶不变，符号看象限。 */
import { TrigLegendBoard, unitCoordinates } from '../trig-board.js';
import { angleComparison } from './comparison.js';
import { mk, V, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 680, 520);
  root.classList.add('mutual-board');
  const O = V(340, 260), R = 170;
  const st = { a: Math.PI / 6, k: 1, plus: false };
  const LINE = ['x 轴', 'y=x', 'y 轴', 'y=−x', 'x 轴'];
  const compare = angleComparison(B);
  const cB = B.readout('变换式', 'gold'), cR = B.chipM('换名规则');
  const cS = B.readout('正弦公式', 'blue'), cC = B.readout('余弦公式', 'orange'), cT = B.readout('正切公式', 'mint');
  B.slider('直角数 k', 0, 4, 1, 1, v => { st.k = Math.round(v); B.render(); }, undefined, (_, v) => `$k=${v}$`);
  B.choiceRow('选择变换', [{ name: '镜像', formula: '$k\\pi/2-\\alpha$' }, { name: '旋转', formula: '$k\\pi/2+\\alpha$' }],
    () => Number(st.plus), i => { st.plus = Boolean(i); B.render(); });
  B.angleRow([30, 45, 60, 90], () => st.a, v => { st.a = v; B.render(); });
  B.handle({
    get: () => V(O.x + R * Math.cos(st.a), O.y - R * Math.sin(st.a)),
    set: p => {
      let ang = Math.atan2(-(p.y - O.y), p.x - O.x);
      if (ang < 0) ang += TAU;
      st.a = ang;
    },
    color: '#5cadff', r: 8, label: 'P', lo: [10, -10],
  });

  /** 0 → to 的短弧（无箭头，角弧用） */
  function smallArc(to, r, color) {
    if (Math.abs(to) < 1e-6) return;
    const n = Math.max(14, Math.ceil(Math.abs(to) / 0.05)), pts = [];
    for (let i = 0; i <= n; i++) {
      const th = to * i / n;
      pts.push(`${(O.x + r * Math.cos(th)).toFixed(1)},${(O.y - r * Math.sin(th)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: color, 'stroke-width': 1.8 }, B.dyn);
  }
  /** 沿圆周的金弧 from → to（旋转族的转程，带箭头） */
  function rotArc(from, to) {
    if (to - from < 1e-6) return;
    const n = Math.max(14, Math.ceil((to - from) / 0.05)), pts = [];
    for (let i = 0; i <= n; i++) {
      const th = from + (to - from) * i / n;
      pts.push(`${(O.x + R * Math.cos(th)).toFixed(1)},${(O.y - R * Math.sin(th)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 2.4 }, B.dyn);
    const th = to, ex = O.x + R * Math.cos(th), ey = O.y - R * Math.sin(th);
    const ux = -Math.sin(th), uy = -Math.cos(th), px = -uy, py = ux;
    mk('polygon', { points: `${ex + 12 * ux},${ey + 12 * uy} ${ex + 4.5 * px},${ey + 4.5 * py} ${ex - 4.5 * px},${ey - 4.5 * py}`, fill: '#ffd166' }, B.dyn);
  }

  B.renderFn = () => {
    const a = st.a, k = st.k, b = k * Math.PI / 2 + (st.plus ? a : -a);
    const source = unitCoordinates(a), image = unitCoordinates(b);
    const P = V(O.x + R * source.x, O.y - R * source.y), Q = V(O.x + R * image.x, O.y - R * image.y);
    const odd = k % 2 === 1;
    // 坐标轴 + 单位圆
    B.seg(V(O.x - 202, O.y), V(O.x + 236, O.y), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    B.seg(V(O.x, 58), V(O.x, 468), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `${O.x + 236},${O.y} ${O.x + 227},${O.y - 4.5} ${O.x + 227},${O.y + 4.5}`, fill: '#8fa3bd' }, B.dyn);
    mk('polygon', { points: `${O.x},58 ${O.x - 4.5},67 ${O.x + 4.5},67`, fill: '#8fa3bd' }, B.dyn);
    B.text(V(O.x + 230, O.y - 12), 'x', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    B.text(V(O.x + 12, 70), 'y', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.8 }, B.dyn);
    if (!st.plus) { // 镜像族：倾斜 k·π/4 的镜面
      const phi = k * Math.PI / 4, MR = R + 26;
      const dx = Math.cos(phi), dy = -Math.sin(phi);
      B.seg(V(O.x - MR * dx, O.y - MR * dy), V(O.x + MR * dx, O.y + MR * dy), { stroke: '#ffd166', 'stroke-width': 2, 'stroke-dasharray': '7 6', 'stroke-opacity': .9 });
      const flat = k === 0 || k === 4;
      // 标签放在镜面远离点的那一截上：水平镜摆左端、斜镜继续沿射线往外推，
      // 右上那一截正是 P、P′ 与坐标读数常驻的地方，贴上去必叠
      const lp = flat ? V(O.x - MR + 8, O.y + 18) : V(O.x - (MR + 26) * dx, O.y - (MR + 26) * dy + 12);
      B.text(lp, `镜面：${LINE[k]}`, { 'font-size': 12, fill: '#ffd166', 'text-anchor': flat ? 'start' : 'end' });
      B.seg(P, Q, { stroke: '#93a1b5', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
      B.dot(V((P.x + Q.x) / 2, (P.y + Q.y) / 2), 2.4, { fill: '#93a1b5' });
    } else if (k > 0) rotArc(a, a + k * Math.PI / 2); // 旋转族：金弧转程
    // 角弧：α（蓝）、β（金；β=α 的恒等情形不重复画）
    smallArc(a, 30, '#5cadff');
    B.text(V(O.x + 46 * Math.cos(a / 2), O.y - 46 * Math.sin(a / 2)), 'α', { 'font-size': 14, fill: '#5cadff', 'font-style': 'italic' });
    if (!(st.plus && k === 0)) {
      smallArc(b, 48, '#ffd166');
      B.text(V(O.x + 64 * Math.cos(b / 2), O.y - 64 * Math.sin(b / 2)), 'β', { 'font-size': 14, fill: '#ffd166', 'font-style': 'italic' });
    }
    // 半径与点（重合时共用把手）
    B.seg(O, P, { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.seg(O, Q, { stroke: '#ffd166', 'stroke-width': 2.2, 'stroke-opacity': .9 });
    B.mark(Q, '#ffd166');
    if (Math.hypot(Q.x - P.x, Q.y - P.y) >= 1) {
      B.text(V(Q.x + 10, Q.y - 10), 'P′', { fill: '#ffd166' });
      B.note('原角 $\\alpha$ · $P$', '#5cadff');
      B.note('变换角 $\\beta$ · $P^{\\prime}$', '#ffd166');
    } else B.note('$P=P^{\\prime}$', '#ffd166');
    compare(a, b, source, image);
    const quadrant = image.onAxis ? '轴线角' : '第' + (image.y > 0 ? (image.x > 0 ? '一' : '二') : (image.x < 0 ? '三' : '四')) + '象限';
    const turn = ['', '\\pi/2', '\\pi', '3\\pi/2', '2\\pi'][k];
    const operator = st.plus ? (k === 0 ? '' : '+') : '-';
    cB(`$\\beta=${turn}${operator}\\alpha$，${quadrant}`);
    const sign = st.plus ? 1 : -1;
    const sinSigns = [sign, 1, -sign, -1, sign];
    const cosSigns = [1, -sign, -1, sign, 1];
    const rhs = (s, name) => (s < 0 ? '-' : '') + name + '\\alpha';
    cS(`$\\sin\\beta=${rhs(sinSigns[k], odd ? '\\cos' : '\\sin')}$`, 'ok');
    cC(`$\\cos\\beta=${rhs(cosSigns[k], odd ? '\\sin' : '\\cos')}$`, 'ok');
    if (image.x === 0) cT('$\\cos\\beta=0$，正切无定义。', 'warn');
    else cT(`$\\tan\\beta=${rhs(sinSigns[k] * cosSigns[k], odd ? '\\cot' : '\\tan')}$`);
    cR(odd ? '$k$ 为奇数，正余弦互换。' : '$k$ 为偶数，函数名不变。');

  };
  B.render();
  return B;
}
