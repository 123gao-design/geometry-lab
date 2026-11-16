/* 图 I1 对称镜像机：诱导公式的镜像五组 —— α+2kπ（旋转整圈）、−α（x 轴镜）、π−α（y 轴镜）、π+α（原点镜）、2π−α（x 轴镜）。
   P′ 的坐标只变号、不改名 —— 诱导公式就是镜像的坐标关系：函数名不变，符号看新角 β 的象限。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const O = V(430, 258), R = 170;
  const st = { a: Math.PI / 6, m: 1 };
  const MODES = [
    { btn: '① α+2kπ', b: a => a + TAU, mir: null,
      st: '\\sin(\\alpha+2k\\pi)=\\sin\\alpha', ct: '\\cos(\\alpha+2k\\pi)=\\cos\\alpha',
      say: '旋转整圈：终边回原位 —— 函数名、符号、值全不动（图示 k=1）' },
    { btn: '② −α', b: a => -a, mir: 'x',
      st: '\\sin(-\\alpha)=-\\sin\\alpha', ct: '\\cos(-\\alpha)=\\cos\\alpha',
      say: 'x 轴镜像：横坐标不变、纵坐标变号 —— sin 变号、cos 不动' },
    { btn: '③ π−α', b: a => Math.PI - a, mir: 'y',
      st: '\\sin(\\pi-\\alpha)=\\sin\\alpha', ct: '\\cos(\\pi-\\alpha)=-\\cos\\alpha',
      say: 'y 轴镜像：横坐标变号、纵坐标不变 —— sin 不动、cos 变号' },
    { btn: '④ π+α', b: a => Math.PI + a, mir: 'o',
      st: '\\sin(\\pi+\\alpha)=-\\sin\\alpha', ct: '\\cos(\\pi+\\alpha)=-\\cos\\alpha',
      say: '原点镜像：横纵坐标同时变号 —— sin、cos 双变号' },
    { btn: '⑤ 2π−α', b: a => TAU - a, mir: 'x',
      st: '\\sin(2\\pi-\\alpha)=-\\sin\\alpha', ct: '\\cos(2\\pi-\\alpha)=\\cos\\alpha',
      say: '还是 x 轴那面镜子：2π−α ≡ −α（mod 2π）—— 负角的正角写法' },
  ];
  const cA = B.chip('角'), cP = B.chip('P 坐标'), cQ = B.chipM("$P'$ 坐标"),
    cS = B.chipM('sin 核验'), cC = B.chipM('cos 核验'), cM = B.chip('对称判读');
  const mBtns = MODES.map((m, i) => B.btn(m.btn, () => { st.m = i; syncBtns(); B.render(); }, { on: i === st.m }));
  function syncBtns() { mBtns.forEach((b, i) => b.classList.toggle('on', i === st.m)); }
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

  /** 0 → to 的短弧（数学系角度，采样画免弧旗标）；arr=true 时终点带箭头 */
  function arc(to, r, color, w, arr) {
    if (Math.abs(to) < 1e-6) return;
    const n = Math.max(14, Math.ceil(Math.abs(to) / 0.05)), pts = [];
    for (let i = 0; i <= n; i++) {
      const th = to * i / n;
      pts.push(`${(O.x + r * Math.cos(th)).toFixed(1)},${(O.y - r * Math.sin(th)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: color, 'stroke-width': w }, B.dyn);
    if (!arr) return;
    const ex = O.x + r * Math.cos(to), ey = O.y - r * Math.sin(to);
    const ux = -Math.sin(to), uy = -Math.cos(to), px = -uy, py = ux;
    mk('polygon', { points: `${ex + 11 * ux},${ey + 11 * uy} ${ex + 4.5 * px},${ey + 4.5 * py} ${ex - 4.5 * px},${ey - 4.5 * py}`, fill: color }, B.dyn);
  }
  /** 整圈演示弧：从角 a 出发绕一整圈（半径略小，别压住圆） */
  function lapArc(a) {
    const n = 72, pts = [];
    for (let i = 0; i <= n; i++) {
      const th = a + TAU * i / n;
      pts.push(`${(O.x + (R - 14) * Math.cos(th)).toFixed(1)},${(O.y - (R - 14) * Math.sin(th)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 2.2 }, B.dyn);
    const th = a + TAU, ex = O.x + (R - 14) * Math.cos(th), ey = O.y - (R - 14) * Math.sin(th);
    const ux = -Math.sin(th), uy = -Math.cos(th), px = -uy, py = ux;
    mk('polygon', { points: `${ex + 11 * ux},${ey + 11 * uy} ${ex + 4.5 * px},${ey + 4.5 * py} ${ex - 4.5 * px},${ey - 4.5 * py}`, fill: '#ffd166' }, B.dyn);
  }

  B.renderFn = () => {
    const m = MODES[st.m], a = st.a, b = m.b(a);
    const x = Math.cos(a), y = Math.sin(a), x2 = Math.cos(b), y2 = Math.sin(b);
    const P = V(O.x + R * x, O.y - R * y), Q = V(O.x + R * x2, O.y - R * y2);
    // 坐标轴 + 单位圆
    B.seg(V(238, O.y), V(666, O.y), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    B.seg(V(O.x, 56), V(O.x, 466), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `666,${O.y} 657,${O.y - 4.5} 657,${O.y + 4.5}`, fill: '#8fa3bd' }, B.dyn);
    mk('polygon', { points: `${O.x},56 ${O.x - 4.5},65 ${O.x + 4.5},65`, fill: '#8fa3bd' }, B.dyn);
    B.text(V(660, O.y - 12), 'x', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    B.text(V(O.x + 12, 68), 'y', { 'font-size': 13, fill: '#8fa3bd', 'font-style': 'italic' });
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#22314a', 'stroke-width': 1.8 }, B.dyn);
    // 镜面（金虚线）
    const MR = R + 26;
    if (m.mir === 'x') {
      B.seg(V(O.x - MR, O.y), V(O.x + MR, O.y), { stroke: '#ffd166', 'stroke-width': 2, 'stroke-dasharray': '7 6', 'stroke-opacity': .9 });
      B.text(V(O.x + MR - 8, O.y - 10), '镜面：x 轴', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'end' });
    } else if (m.mir === 'y') {
      B.seg(V(O.x, O.y - MR), V(O.x, O.y + MR), { stroke: '#ffd166', 'stroke-width': 2, 'stroke-dasharray': '7 6', 'stroke-opacity': .9 });
      B.text(V(O.x + 10, O.y - MR + 16), '镜面：y 轴', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'start' });
    } else if (m.mir === 'o') {
      B.dot(O, 4.5, { fill: '#ffd166' });
      B.text(V(O.x - 14, O.y + 26), '镜心：原点', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'end' });
    }
    // 连线 P–P′（虚线，镜像的垂直平分关系肉眼可查）
    if (m.mir) {
      B.seg(P, Q, { stroke: '#93a1b5', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
      B.dot(V((P.x + Q.x) / 2, (P.y + Q.y) / 2), 2.4, { fill: '#93a1b5' });
    }
    // 角弧：α（蓝）、β（金）；整圈模式另画一圈演示弧
    arc(a, 30, '#5cadff', 1.8, false);
    B.text(V(O.x + 46 * Math.cos(a / 2), O.y - 46 * Math.sin(a / 2)), 'α', { 'font-size': 14, fill: '#5cadff', 'font-style': 'italic' });
    if (st.m === 0) lapArc(a);
    else {
      arc(b, 48, '#ffd166', 1.8, false);
      B.text(V(O.x + 64 * Math.cos(b / 2), O.y - 64 * Math.sin(b / 2)), 'β', { 'font-size': 14, fill: '#ffd166', 'font-style': 'italic' });
    }
    // 半径与点（P′ 与 P 重合时画空心环：整圈/半圈回到原位）
    B.seg(O, P, { stroke: '#fff', 'stroke-width': 2.2 });
    B.seg(O, Q, { stroke: '#ffd166', 'stroke-width': 2.2, 'stroke-opacity': .9 });
    B.dot(P, 5.5, { fill: '#5cadff' });
    if (Math.hypot(Q.x - P.x, Q.y - P.y) < 7) mk('circle', { cx: Q.x, cy: Q.y, r: 10, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.4 }, B.dyn);
    else B.dot(Q, 5.5, { fill: '#ffd166' });
    B.text(V(P.x + 12, P.y - 14), `(${fmt(x, 3)}, ${fmt(y, 3)})`, { 'font-size': 12, fill: '#5cadff', 'text-anchor': 'start' });
    B.text(V(Q.x + 12, Q.y + 24), `(${fmt(x2, 3)}, ${fmt(y2, 3)})`, { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'start' });
    B.text(V(Q.x - 10, Q.y - 12), 'P′', { 'font-size': 13, fill: '#ffd166', 'font-weight': 700, 'text-anchor': 'end' });
    // chips
    const deg = a * 180 / Math.PI, deg2 = b * 180 / Math.PI;
    cA(`α ${fmt(deg, 1)}° · β ${fmt(deg2, 1)}°`);
    cP(`(${fmt(x, 3)}, ${fmt(y, 3)})`);
    cQ(`(${fmt(x2, 3)}, ${fmt(y2, 3)})`);
    cS(`$${m.st}=${fmt(Math.sin(b), 3)}$`, 'ok');
    cC(`$${m.ct}=${fmt(Math.cos(b), 3)}$`, 'ok');
    cM(m.say);
  };
  B.render();
  B.hint('点 ①..⑤ 换镜子、拖 P 换角：P′ 坐标只变号不改名 —— 诱导公式就是镜像的坐标关系');
  return B;
}
