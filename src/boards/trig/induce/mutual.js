/* 图 I2 诱导总机：k·π/2 ± α 各组公式一屏拨完 —— k 拨 0..4，−α 族走镜像（镜面倾斜 k·π/4）、+α 族走旋转（k 个直角）。
   k 偶归 I1 镜像五组（函数名不变）、k 奇换名（sin↔cos、tan↔cot）；符号一律看 β 的象限 —— 奇变偶不变，符号看象限。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const O = V(430, 260), R = 170;
  const st = { a: Math.PI / 6, k: 1, plus: false };
  const LINE = ['x 轴', 'y=x', 'y 轴', 'y=−x', 'x 轴'];
  const cB = B.chipM('β'), cP = B.chip('P 坐标'), cQ = B.chip('P′ 坐标'), cS = B.chipM('sin 核验'), cC = B.chipM('cos 核验'),
    cT = B.chipM('$\\tan\\beta$'), cR = B.chip('奇变偶不变'), cG = B.chip('几何判读');
  const kSl = B.slider('半圈数 k', 0, 4, 1, 1, v => { st.k = Math.round(v); B.render(); });
  const sBtns = [
    B.btnM('$\\beta=k\\frac{\\pi}{2}-\\alpha$', () => { st.plus = false; syncS(); B.render(); }, { on: true }),
    B.btnM('$\\beta=k\\frac{\\pi}{2}+\\alpha$', () => { st.plus = true; syncS(); B.render(); }),
  ];
  function syncS() { sBtns[0].classList.toggle('on', !st.plus); sBtns[1].classList.toggle('on', st.plus); }
  [['π/6', Math.PI / 6], ['π/4', Math.PI / 4], ['π/3', Math.PI / 3], ['π/2', Math.PI / 2]]
    .forEach(([lab, v]) => B.btn(lab, () => { st.a = v; B.render(); }));
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
    const x = Math.cos(a), y = Math.sin(a), x2 = Math.cos(b), y2 = Math.sin(b);
    const P = V(O.x + R * x, O.y - R * y), Q = V(O.x + R * x2, O.y - R * y2);
    const odd = k % 2 === 1;
    // 坐标轴 + 单位圆
    B.seg(V(238, O.y), V(666, O.y), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    B.seg(V(O.x, 58), V(O.x, 468), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `666,${O.y} 657,${O.y - 4.5} 657,${O.y + 4.5}`, fill: '#8fa3bd' }, B.dyn);
    mk('polygon', { points: `${O.x},58 ${O.x - 4.5},67 ${O.x + 4.5},67`, fill: '#8fa3bd' }, B.dyn);
    B.text(V(660, O.y - 12), 'x', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    B.text(V(O.x + 12, 70), 'y', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#22314a', 'stroke-width': 1.8 }, B.dyn);
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
    // 半径与点（重合时 P′ 画空心环）
    B.seg(O, P, { stroke: '#fff', 'stroke-width': 2.2 });
    B.seg(O, Q, { stroke: '#ffd166', 'stroke-width': 2.2, 'stroke-opacity': .9 });
    B.dot(P, 5.5, { fill: '#5cadff' });
    if (Math.hypot(Q.x - P.x, Q.y - P.y) < 7) mk('circle', { cx: Q.x, cy: Q.y, r: 10, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.4 }, B.dyn);
    else B.dot(Q, 5.5, { fill: '#ffd166' });
    // 坐标读数：P 贴点下方、P′ 贴点上方，各让开把手标签 P 与点标 P′；
    // 左半圆改右对齐，读数朝圆外张开，不压圆心一侧的角弧
    const pR = P.x >= O.x, qR = Q.x >= O.x;
    B.text(V(P.x + (pR ? 16 : -16), P.y + 30), `(${fmt(x, 3)}, ${fmt(y, 3)})`,
      { 'font-size': 12, fill: '#5cadff', 'text-anchor': pR ? 'start' : 'end' });
    B.text(V(Q.x + (qR ? 16 : -16), Q.y - 30), `(${fmt(x2, 3)}, ${fmt(y2, 3)})`,
      { 'font-size': 12, fill: '#ffd166', 'text-anchor': qR ? 'start' : 'end' });
    B.text(V(Q.x - 10, Q.y + 22), 'P′', { 'font-size': 13, fill: '#ffd166', 'font-weight': 700, 'text-anchor': 'end' });
    // chips：β 的名字由 k 奇偶定、符号由 β 象限定 —— 口诀的机器化
    const sv = Math.sin(b), cv = Math.cos(b);
    const tv = Math.abs(cv) > 1e-9 ? sv / cv : null;
    const degB = b * 180 / Math.PI, d0 = ((degB % 360) + 360) % 360;
    const quad = (d0 === 0 || d0 === 90 || d0 === 180 || d0 === 270) ? null
      : d0 < 90 ? 'I' : d0 < 180 ? 'II' : d0 < 270 ? 'III' : 'IV';
    const texB = k === 0
      ? (st.plus ? '\\beta=\\alpha' : '\\beta=-\\alpha')
      : `\\beta=${k === 1 ? '' : k + '\\cdot'}\\frac{\\pi}{2}${st.plus ? '+' : '-'}\\alpha`;
    cB(`$${texB}$ = ${fmt(degB, 1)}°${quad ? ' · 第 ' + quad + ' 象限' : ' · 轴线角'}`);
    cP(`(${fmt(x, 3)}, ${fmt(y, 3)})`);
    cQ(`(${fmt(x2, 3)}, ${fmt(y2, 3)})`);
    const rhs = (v, oddName, evenName) => Math.abs(v) < 1e-9
      ? `=${fmt(v, 3)}`
      : `=${v < 0 ? '-' : ''}${odd ? oddName : evenName}\\alpha=${fmt(v, 3)}`;
    cS(`$\\sin\\beta${rhs(sv, '\\cos', '\\sin')}$`, 'ok');
    cC(`$\\cos\\beta${rhs(cv, '\\sin', '\\cos')}$`, 'ok');
    if (tv == null) cT('无定义（cos β = 0）', 'warn');
    else cT(Math.abs(tv) > 999 ? '溢出（→∞）' : `${fmt(tv, 3)}${odd ? '（= ±1/tan α：tan 换名 cot）' : ''}`);
    cR(`k=${k}${odd ? ' 奇 —— 函数名换：sin↔cos（tan↔cot）' : ' 偶 —— 函数名不变'}；符号看 β ${quad ? '第 ' + quad + ' 象限' : '（轴线角 → 0 或 ±1）'}`);
    if (!st.plus) cG(`镜像：P′ 与 P 关于「${LINE[k]}」对称${odd ? ' —— 坐标对调（换名的几何出处）' : ' —— 坐标只变号不改名'}`);
    else cG(k === 0 ? '旋转 0°：β = α 恒等 —— 第 0 组（什么都不用做）' : `旋转：逆时针 ${k * 90}°（k 个直角）—— 坐标轮换 (x, y)→(−y, x)`);
  };
  B.render();
  B.hint('拨 k、切 ±、拖 P：sin β 的名字跟 k 的奇偶走，符号跟 β 的象限走 —— 奇变偶不变，符号看象限');
  return B;
}
