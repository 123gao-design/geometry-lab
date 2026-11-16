/* 图 复2 · 复数的运算与几何意义
   三档运算共用两支蓝橙向量 z₁、z₂：
   加法按平行四边形合成，是平移的叠加；
   乘法把 z₁ 的模乘上 z₂ 的模、辐角加上 z₂ 的辐角，等于把 z₁ 旋转并伸缩；
   除法反过来，模相除、辐角相减。
   拖动 z₁、z₂ 的终点，运算结果金色一支随之移动。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: 2, ay: 1, bx: 1, by: 2, mode: 'add', grid: true, labs: true };
  const PRE = [
    { nm: '① 和', a: [2, 1], b: [1, 2], mode: 'add' },
    { nm: '② 乘 i', a: [3, 1], b: [0, 1], mode: 'mul' },
    { nm: '③ 共轭乘', a: [2, 1], b: [2, -1], mode: 'mul' },
    { nm: '④ 商为 i', a: [2, 1], b: [1, -2], mode: 'div' },
  ];
  const m = B.isoFit(-6.8, 6.8, -4.8, 4.8, [40, 30, 780, 400], 10);
  const cR = B.chipM('结果'), cG = B.chipM('几何'), cJ = B.chipM('判读');

  const zs = (a, b) => Math.abs(b) < 1e-9 ? fmt(a, 2)
    : `${fmt(a, 2)}${b < 0 ? '-' : '+'}${fmt(Math.abs(b), 2)}\\mathrm{i}`;

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'Re', ayLab: 'Im', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const P = (x, y) => V(m.px(x), m.py(y));
    const A = P(st.ax, st.ay), Bp = P(st.bx, st.by);
    const a = st.ax, b = st.ay, c = st.bx, d = st.by;
    const n2 = c * c + d * d;
    let rx, ry, ok = true;
    if (st.mode === 'add') { rx = a + c; ry = b + d; }
    else if (st.mode === 'mul') { rx = a * c - b * d; ry = a * d + b * c; }
    else {
      if (n2 < 1e-9) { ok = false; rx = 0; ry = 0; }
      else { rx = (a * c + b * d) / n2; ry = (b * c - a * d) / n2; }
    }
    const R = P(rx, ry);

    // 加法补出平行四边形两条虚线边
    if (st.mode === 'add') {
      B.seg(Bp, R, { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .8 });
      B.seg(A, R, { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .8 });
    }
    // 两支输入
    B.arrow(O, A, { stroke: '#5cadff', 'stroke-width': 2.4, head: 12, wide: 5.5 });
    B.arrow(O, Bp, { stroke: '#ff9e4a', 'stroke-width': 2.4, head: 12, wide: 5.5 });
    B.tex(V(A.x + 7, A.y - 12), '$z_1$', { size: 14, anchor: 'start', color: '#5cadff', w: 40 });
    B.tex(V(Bp.x + 7, Bp.y - 12), '$z_2$', { size: 14, anchor: 'start', color: '#ff9e4a', w: 40 });
    // 结果
    if (ok && Math.hypot(rx, ry) > 1e-9) {
      B.arrow(O, R, { stroke: '#ffd166', 'stroke-width': 2.8, head: 14, wide: 6.5 });
      const lab = st.mode === 'add' ? 'z_1+z_2' : st.mode === 'mul' ? 'z_1z_2' : '\\dfrac{z_1}{z_2}';
      B.tex(V(R.x + 8, R.y - 12), `$${lab}$`, { size: 14, anchor: 'start', color: '#ffd166', w: 80 });
      B.dot(R, 4, { fill: '#ffd166' });
    }
    B.dot(O, 3.2, { fill: '#e8eefc' });

    // 徽章
    const op = st.mode === 'add' ? '+' : st.mode === 'mul' ? '\\times ' : '\\div ';
    cR(ok ? `$z_1${op}z_2=${zs(rx, ry)}$` : '$z_2=0$：除数不能为零，商不存在');
    if (!ok) {
      cG('除法要乘分母的共轭，分母为零时共轭也是零，通分这一步无法进行');
    } else if (st.mode === 'add') {
      cG(`$(a+c)+(b+d)\\mathrm{i}=(${fmt(a, 1)}+${fmt(c, 1)})+(${fmt(b, 1)}+${fmt(d, 1)})\\mathrm{i}$`);
    } else if (st.mode === 'mul') {
      const l1 = Math.hypot(a, b), l2 = Math.hypot(c, d);
      cG(`$|z_1z_2|=${fmt(l1 * l2, 2)}=${fmt(l1, 2)}\\times${fmt(l2, 2)}$，辐角相加`);
    } else {
      const l1 = Math.hypot(a, b), l2 = Math.hypot(c, d);
      cG(`$\\left|\\dfrac{z_1}{z_2}\\right|=${fmt(l1 / l2, 2)}=${fmt(l1, 2)}\\div${fmt(l2, 2)}$，辐角相减`);
    }
    cJ(!ok ? '除数为零，运算中止'
      : st.mode === 'add' ? '加法就是向量加法：平行四边形对角线，两个平移叠加'
        : st.mode === 'mul' ? (Math.abs(Math.hypot(c, d) - 1) < 1e-9
          ? 'z₂ 的模为 1：乘法只把 z₁ 旋转 z₂ 的辐角，长度不变'
          : '乘法把 z₁ 按 |z₂| 伸缩，再转 z₂ 的辐角')
          : '除法把 z₁ 按 |z₂| 反向伸缩，再转 z₂ 辐角的相反数');
  };

  const cl = v => Math.max(-3, Math.min(3, Math.round(v * 2) / 2));
  B.handle({
    color: '#5cadff', r: 7,
    get: () => V(m.px(st.ax), m.py(st.ay)),
    set: p => { st.ax = cl((p.x - m.px(0)) / m.s); st.ay = cl((m.py(0) - p.y) / m.s); },
  });
  B.handle({
    color: '#ff9e4a', r: 7,
    get: () => V(m.px(st.bx), m.py(st.by)),
    set: p => { st.bx = cl((p.x - m.px(0)) / m.s); st.by = cl((m.py(0) - p.y) / m.s); },
  });

  const M = [
    { nm: '加法', mode: 'add' },
    { nm: '乘法', mode: 'mul' },
    { nm: '除法', mode: 'div' },
  ];
  const mbs = M.map((o, i) => B.btn(o.nm, () => {
    st.mode = o.mode;
    mbs.forEach((x, j) => x.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    [st.ax, st.ay] = p.a; [st.bx, st.by] = p.b; st.mode = p.mode;
    mbs.forEach((x, j) => x.classList.toggle('on', M[j].mode === p.mode));
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('三档运算共用同一组 z₁、z₂：加法看平行四边形，乘法看旋转与伸缩，除法反过来');
  B.render();
  return B;
}
