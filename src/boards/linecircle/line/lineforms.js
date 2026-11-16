/* 图 直2 · 直线方程的五种形式
   同一条直线由两点 A、B 确定。拖动 A、B，五种形式同步改写：
   点斜式、斜截式、两点式、截距式、一般式。
   截距式要求两个截距都存在且非零；竖直、水平与过原点的直线各自缺少某种形式。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { mode: 0, ax: 1, ay: 1, bx: 3, by: 2, grid: true, labs: true };
  const m = B.isoFit(-2.2, 5.2, -1.6, 4.6, [44, 30, 760, 390], 10);
  const cAB = B.chipM('两点坐标'), cK = B.chipM('斜率与倾斜角'), cE = B.chipM('当前形式'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const near = v => Math.abs(v) < 5e-3;
  const vert = () => Math.abs(st.bx - st.ax) < 1e-9;
  const horiz = () => Math.abs(st.by - st.ay) < 1e-9;
  const kOf = () => (st.by - st.ay) / (st.bx - st.ax);
  const bOf = () => st.ay - kOf() * st.ax;
  const aOf = () => st.ax - st.ay / kOf();
  const add = (base, v) => near(v) ? base : `${base}${v > 0 ? '+' : '-'}${fz(Math.abs(v))}`;
  const kStr = () => kOf() === 1 ? '' : kOf() === -1 ? '-' : fz(kOf());

  const genStr = () => {
    let A = st.ay - st.by, Bc = st.bx - st.ax, C = st.ax * st.by - st.bx * st.ay;
    if (A < -1e-9 || (near(A) && Bc < -1e-9)) { A = -A; Bc = -Bc; C = -C; }
    const parts = [];
    const push = (v, name) => {
      if (near(v)) return;
      const av = Math.abs(v);
      parts.push({ s: v < 0 ? '-' : '+', txt: (Math.abs(av - 1) < 1e-9 && name ? '' : fz(av)) + name });
    };
    push(A, 'x'); push(Bc, 'y'); push(C, '');
    return '$' + parts.map((p, i) => (i === 0 ? (p.s === '-' ? '-' : '') + p.txt : p.s + p.txt)).join('') + '=0$';
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const Ap = V(m.px(st.ax), m.py(st.ay)), Bp = V(m.px(st.bx), m.py(st.by));
    const dx = st.bx - st.ax, dy = st.by - st.ay;
    if (Math.hypot(dx, dy) > 1e-6) {
      B.inf(V(m.px(st.ax - 4 * dx), m.py(st.ay - 4 * dy)), V(m.px(st.ax + 4 * dx), m.py(st.ay + 4 * dy)),
        { stroke: '#ffd166', 'stroke-width': 2.3, 'stroke-opacity': .95 });
    }
    B.seg(Ap, Bp, { stroke: '#ffd166', 'stroke-width': 3, 'stroke-opacity': .5 });
    B.dot(Ap, 5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.dot(Bp, 5, { fill: '#7ee787', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(Ap.x - 12, Ap.y - 12), 'A', { 'font-size': 13, 'font-weight': 700, fill: '#5cadff' });
    B.text(V(Bp.x + 10, Bp.y - 12), 'B', { 'font-size': 13, 'font-weight': 700, fill: '#7ee787' });

    if (st.mode === 3 && !vert() && !horiz() && !near(aOf()) && !near(bOf())) {
      const Xp = V(m.px(aOf()), m.py(0)), Yp = V(m.px(0), m.py(bOf()));
      B.dot(Xp, 4.5, { fill: '#ff9e4a' }); B.dot(Yp, 4.5, { fill: '#ff9e4a' });
      B.text(V(Xp.x + 8, Xp.y - 9), `a=${fz(aOf())}`, { 'font-size': 11.5, fill: '#ff9e4a' });
      B.text(V(Yp.x + 9, Yp.y - 9), `b=${fz(bOf())}`, { 'font-size': 11.5, fill: '#ff9e4a' });
    }

    cAB(`$A(${fz(st.ax)},\\ ${fz(st.ay)})$，$B(${fz(st.bx)},\\ ${fz(st.by)})$`);
    if (vert()) {
      cK('$x_A=x_B$，斜率不存在，$\\alpha=90^\\circ$');
    } else {
      const k = kOf();
      cK(`$k=\\dfrac{${fz(st.by)}-${fz(st.ay)}}{${fz(st.bx)}-${fz(st.ax)}}=${fz(k)}$，$\\alpha=${fmt(Math.atan(k) * 180 / Math.PI, 2)}^\\circ$`);
    }

    let eq = '', note = '';
    if (st.mode === 0) {
      eq = vert() ? `$x=${fz(st.ax)}$` : `$${add('y', -st.ay)}=${kStr()}(x${add('', -st.ax)})$`;
      note = vert() ? '竖直直线没有点斜式，只能写成 x=x₀' : '点斜式：定点 A 与斜率 k 各占一处，竖直直线不能用';
    } else if (st.mode === 1) {
      eq = vert() ? `$x=${fz(st.ax)}$` : `$y=${kStr()}x${near(bOf()) ? '' : (bOf() > 0 ? '+' : '-') + fz(Math.abs(bOf()))}$`;
      note = vert() ? '竖直直线没有斜截式' : `斜截式：b=${fz(bOf())} 是直线与 y 轴交点的纵坐标`;
    } else if (st.mode === 2) {
      eq = vert() ? `$x=${fz(st.ax)}$` : horiz() ? `$y=${fz(st.ay)}$`
        : `$\\dfrac{${add('y', -st.ay)}}{${fz(st.by - st.ay)}}=\\dfrac{x${add('', -st.ax)}}{${fz(st.bx - st.ax)}}$`;
      note = '两点式：分母是两点坐标之差；竖直与水平直线要单独写';
    } else if (st.mode === 3) {
      if (vert() || horiz()) {
        eq = vert() ? `$x=${fz(st.ax)}$` : `$y=${fz(st.ay)}$`;
        note = '截距式要求两个截距都存在：竖直直线没有 y 轴截距，水平直线没有 x 轴截距';
      } else if (near(aOf()) || near(bOf())) {
        eq = '$\\text{截距式不适用}$';
        note = '直线过原点时两个截距都是 0，不能写成 x/a+y/b=1';
      } else {
        eq = `$\\dfrac{x}{${fz(aOf())}}+\\dfrac{y}{${fz(bOf())}}=1$`;
        note = `截距式：a=${fz(aOf())}、b=${fz(bOf())} 是两个截距，可为负`;
      }
    } else {
      eq = genStr();
      note = '一般式：A、B 不同时为 0；B≠0 时可解出斜率 k=−A/B';
    }
    cE(eq);
    cJ(note);
  };

  const MODES = ['① 点斜式', '② 斜截式', '③ 两点式', '④ 截距式', '⑤ 一般式'];
  const btns = MODES.map((nm, i) => B.btn(nm, () => {
    st.mode = i;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  const clamp = p => ({
    x: Math.max(m.px(-2), Math.min(m.px(5), p.x)),
    y: Math.max(m.py(4.4), Math.min(m.py(-1.4), p.y)),
  });
  B.handle({
    color: '#5cadff', r: 7, label: 'A', lo: [-9, -9],
    get: () => V(m.px(st.ax), m.py(st.ay)),
    set: p => {
      const q = clamp(p);
      st.ax = Math.round((q.x - m.px(0)) / m.s * 2) / 2;
      st.ay = Math.round((m.py(0) - q.y) / m.s * 2) / 2;
      if (Math.hypot(st.ax - st.bx, st.ay - st.by) < 0.3) st.ay += 0.5;
    },
  });
  B.handle({
    color: '#7ee787', r: 7, label: 'B', lo: [9, -9],
    get: () => V(m.px(st.bx), m.py(st.by)),
    set: p => {
      const q = clamp(p);
      st.bx = Math.round((q.x - m.px(0)) / m.s * 2) / 2;
      st.by = Math.round((m.py(0) - q.y) / m.s * 2) / 2;
      if (Math.hypot(st.ax - st.bx, st.ay - st.by) < 0.3) st.by += 0.5;
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动 A 或 B 改变直线：五种形式同步改写，竖直、水平与过原点的直线会让某些形式失效');
  B.render();
  return B;
}
