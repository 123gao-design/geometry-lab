/* 图 直4b · 同解变形机
   三档：① 平方：y=√(4−x²)（上半圆）两边平方得 x²+y²=4（整圆），下半圆是增根；
        ② 同乘含零因式：x−1=0 两边乘 (y−2)，多出直线 y=2；
        ③ 同除含零因式：x(x−1)=0 两边除以 x，只剩 x=1，丢掉直线 x=0。
   拖动 Q：逐式判定成立与否，判读给出同解、增根或失根。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { mode: 0, qx: 1.2, qy: 1.6, grid: true, labs: true };
  const m = B.isoFit(-4.2, 4.2, -3.0, 3.0, [44, 30, 760, 392], 10);
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const cA = B.chipM('点 Q'), cB = B.chipM('原方程'), cC = B.chipM('变形后'), cD = B.chipM('判读');

  const qh = B.handle({
    color: '#c084fc', r: 7, label: 'Q', lo: [10, -9],
    get: () => V(m.px(st.qx), m.py(st.qy)),
    set: p => { st.qx = (p.x - m.px(0)) / m.s; st.qy = (m.py(0) - p.y) / m.s; },
    clamp: p => ({ x: Math.min(m.px(4), Math.max(m.px(-4), p.x)),
      y: Math.min(m.py(-2.8), Math.max(m.py(2.8), p.y)) }),
  });

  const onCircle = p => Math.abs(Math.hypot(p.x, p.y) - 2) < 0.12;
  const onUp = p => onCircle(p) && p.y > -1e-9;
  const on1o = p => Math.abs(p.x - 1) < 0.1;             // x−1=0
  const on1d = p => Math.min(Math.abs(p.x - 1), Math.abs(p.y - 2)) < 0.1; // (x−1)(y−2)=0
  const on2o = p => Math.min(Math.abs(p.x), Math.abs(p.x - 1)) < 0.1; // x(x−1)=0
  const on2d = p => Math.abs(p.x - 1) < 0.1;             // x−1=0

  const vline = (x, at, lab, labAt) => {
    B.seg(V(m.px(x), m.py(m.Y0)), V(m.px(x), m.py(m.Y1)), at);
    if (lab) B.textM(V(m.px(x) + labAt[0], m.py(labAt[1])), lab, { 'font-size': 11.5, fill: at.stroke, 'text-anchor': 'start' });
  };
  const hline = (y, at, lab, labAt) => {
    B.seg(V(m.px(m.X0), m.py(y)), V(m.px(m.X1), m.py(y)), at);
    if (lab) B.textM(V(m.px(labAt[0]), m.py(y) - 9), lab, { 'font-size': 11.5, fill: at.stroke, 'text-anchor': 'start' });
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const q = V(st.qx, st.qy);

    if (st.mode === 0) {
      // 变形后：整圆
      mk('circle', { cx: m.px(0), cy: m.py(0), r: 2 * m.s, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.1, 'stroke-opacity': .9 }, B.dyn);
      // 增根：下半圆
      B.plot(x => -Math.sqrt(Math.max(0, 4 - x * x)), m, {
        x0: -2, x1: 2, dom: x => Math.abs(x) <= 2, anchors: [-2, 0, 2],
        stroke: '#ff7b8a', 'stroke-width': 2.2, 'stroke-dasharray': '6 5',
      });
      // 原方程：上半圆
      B.plot(x => Math.sqrt(Math.max(0, 4 - x * x)), m, {
        x0: -2, x1: 2, dom: x => Math.abs(x) <= 2, anchors: [-2, 0, 2],
        stroke: '#5cadff', 'stroke-width': 2.6,
      });
      B.textM(V(m.px(1.55), m.py(1.75)), '原方程', { 'font-size': 11.5, fill: '#5cadff' });
      B.textM(V(m.px(1.55), m.py(-1.75)), '增根', { 'font-size': 11.5, fill: '#ff7b8a' });
      cB(`$y=\\sqrt{4-x^2}$：${onUp(q) ? '成立' : '不成立'}`);
      cC(`$x^2+y^2=4$：${onCircle(q) ? '成立' : '不成立'}`);
      cD(onCircle(q) && q.y < -0.02 ? 'Q 落在下半圆：平方之后才出现，原方程不成立 —— 增根'
        : onUp(q) ? '两边都非负，平方前后解集相同'
        : 'Q 不在两条曲线上，两种写法都不成立');
    } else if (st.mode === 1) {
      // 原方程：x=1
      vline(1, { stroke: '#5cadff', 'stroke-width': 2.6 }, '$x=1$', [8, 2.4]);
      // 增根：y=2
      hline(2, { stroke: '#ff7b8a', 'stroke-width': 2.2, 'stroke-dasharray': '6 5' }, '$y=2$（增根）', [2.1, 0]);
      cB(`$x-1=0$：${on1o(q) ? '成立' : '不成立'}`);
      cC(`$(x-1)(y-2)=0$：${on1d(q) ? '成立' : '不成立'}`);
      cD(on1d(q) && !on1o(q) ? 'Q 落在 y=2 上：乘出的因式带来的增根'
        : on1o(q) ? '原方程的解仍是变形后的解'
        : 'Q 不在两条直线上，两种写法都不成立');
    } else {
      // 变形后：x=1；失根：x=0
      vline(1, { stroke: '#5cadff', 'stroke-width': 2.6 }, '$x=1$', [8, 2.4]);
      vline(0, { stroke: '#ff7b8a', 'stroke-width': 2.2, 'stroke-dasharray': '6 5' }, '$x=0$（失根）', [8, 2.4]);
      cB(`$x(x-1)=0$：${on2o(q) ? '成立' : '不成立'}`);
      cC(`$x-1=0$：${on2d(q) ? '成立' : '不成立'}`);
      cD(on2o(q) && !on2d(q) ? 'Q 落在 x=0 上：除以 x 把这一支丢掉了 —— 失根'
        : on2d(q) ? '原方程的解在变形后仍在'
        : 'Q 不在两条直线上，两种写法都不成立');
    }
    cA(`$Q(${fz(st.qx)},\\ ${fz(st.qy)})$`);
  };

  const DEMO = [[1.2, 1.6], [1.6, 2], [0, 1.5]];
  let btns;
  const setMode = i => {
    st.mode = i;
    [st.qx, st.qy] = DEMO[i];
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  };
  btns = [
    B.btn('① 平方', () => setMode(0), { on: true }),
    B.btn('② 同乘含零因式', () => setMode(1)),
    B.btn('③ 同除含零因式', () => setMode(2)),
  ];

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖 Q：蓝线是原方程的解集，红虚线是平方、乘除含零因式后多出或丢掉的那一支');
  B.render();
  return B;
}
