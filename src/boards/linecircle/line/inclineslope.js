/* 图 直1 · 倾斜角与斜率
   一条过原点的直线，倾斜角 α 取 [0°,180°)。拖动单位圆上的方向点，直线随之转动，
   斜率 k=tanα 同步读出；α=90° 时直线竖直，斜率不存在。
   斜率三角形：横走 1 个单位、竖走 k 个单位，(1,k) 落在直线上。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { deg: 45, grid: true, labs: true };
  const m = B.isoFit(-3.4, 3.4, -2.7, 2.7, [44, 30, 760, 390], 10);
  const cA = B.chipM('倾斜角'), cK = B.chipM('斜率'), cL = B.chipM('直线方程'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const rad = () => st.deg * Math.PI / 180;
  const vertical = () => st.deg === 90;
  const kOf = () => Math.tan(rad());

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const c = Math.cos(rad()), s = Math.sin(rad());
    const O = V(m.px(0), m.py(0));
    const Q = V(m.px(-5 * c), m.py(-5 * s)), R = V(m.px(5 * c), m.py(5 * s));
    B.inf(Q, R, { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    // 倾斜角弧
    const arc = [];
    const n = 40;
    for (let i = 0; i <= n; i++) {
      const a = rad() * i / n;
      arc.push(`${i ? 'L' : 'M'}${m.px(1.15 * Math.cos(a))} ${m.py(1.15 * Math.sin(a))}`);
    }
    B.dyn.appendChild(mk('path', { d: arc.join(' '), fill: 'none', stroke: '#ff9e4a', 'stroke-width': 2, 'stroke-opacity': .95 }, B.dyn));
    B.text(V(m.px(1.45 * Math.cos(rad() / 2)), m.py(1.45 * Math.sin(rad() / 2))), 'α', { 'font-size': 13, 'font-weight': 700, fill: '#ff9e4a', 'text-anchor': 'middle' });
    // 斜率三角形
    if (!vertical()) {
      const k = kOf();
      if (Math.abs(k) <= 2.4) {
        B.seg(V(m.px(0), m.py(0)), V(m.px(1), m.py(0)), { stroke: '#5cadff', 'stroke-width': 1.6, 'stroke-dasharray': '4 4' });
        B.seg(V(m.px(1), m.py(0)), V(m.px(1), m.py(k)), { stroke: '#7ee787', 'stroke-width': 1.6, 'stroke-dasharray': '4 4' });
        B.text(V(m.px(.5), m.py(0) + 15), '1', { 'font-size': 11.5, fill: '#5cadff', 'text-anchor': 'middle' });
        B.text(V(m.px(1) + 10, m.py(k / 2)), `k=${fz(k)}`, { 'font-size': 11.5, fill: '#7ee787' });
      }
    }
    const Pp = V(m.px(c), m.py(s));
    B.dot(O, 4, { fill: '#8fa3bd' });
    B.dot(Pp, 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });

    cA(`$\\alpha=${st.deg}^\\circ$`);
    if (vertical()) {
      cK('$k=\\tan 90^\\circ$ 不存在');
      cL('$x=0$（竖直直线，不能写成 $y=kx$）');
      cJ('α=90°：直线垂直于 x 轴，斜率不存在；倾斜角照样存在，仍是 90°');
    } else {
      const k = kOf();
      cK(`$k=\\tan\\alpha=${fz(k)}$`);
      cL(k === 0 ? '$y=0$' : `$y=${fz(k)}x$`);
      cJ(st.deg === 0 ? 'α=0°：直线与 x 轴重合，k=0'
        : st.deg < 90 ? '0°<α<90°：直线从左下到右上，k>0'
          : '90°<α<180°：直线从左上到右下，k<0');
    }
  };

  const PRE = [{ nm: '① 0°', deg: 0 }, { nm: '② 30°', deg: 30 }, { nm: '③ 45°', deg: 45 }, { nm: '④ 90°', deg: 90 }, { nm: '⑤ 135°', deg: 135 }];
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    st.deg = o.deg;
    sA.sync(st.deg);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 2 }));
  const sA = B.slider('倾斜角 α (°)', 0, 179, 1, st.deg, v => { st.deg = v; B.render(); }, 'inc');

  B.handle({
    color: '#ffd166', r: 7,
    get: () => V(m.px(Math.cos(rad())), m.py(Math.sin(rad()))),
    set: p => {
      const dx = (p.x - m.px(0)) / m.s, dy = (m.py(0) - p.y) / m.s;
      let d = Math.atan2(dy, dx) * 180 / Math.PI;
      if (d < 0) d += 180;
      st.deg = Math.round(d) % 180;
      sA.sync(st.deg);
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动金色方向点：直线绕原点转动，α 与 k 同步变化；α=90° 时斜率不存在');
  B.render();
  return B;
}
