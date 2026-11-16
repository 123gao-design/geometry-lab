/* 图 复3 · 模与共轭的性质
   两支复向量 z₁、z₂ 相乘得金色积向量。紫色箭头是积的共轭：把金色箭头的终点关于实轴翻下来；
   绿色圆环是先各自共轭再相乘的结果。两者始终重合，这就是 z₁z₂ 的共轭等于共轭之积。
   模也一并读出：|z₁z₂|=|z₁||z₂|。拖动两支终点，两个结论同时跟着变。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: 2, ay: 1, bx: 2, by: -1, grid: true, labs: true };
  const PRE = [
    { nm: '① 共轭相乘', a: [2, 1], b: [2, -1] },
    { nm: '② 乘 i', a: [3, 1], b: [0, 1] },
    { nm: '③ 一般', a: [2, 1], b: [1.5, 2] },
  ];
  const m = B.isoFit(-6.8, 6.8, -4.8, 4.8, [40, 30, 780, 400], 10);
  const cP = B.chipM('乘积'), cM = B.chipM('模乘积'), cC = B.chipM('共轭'), cJ = B.chipM('判读');

  const zs = (a, b) => Math.abs(b) < 1e-9 ? fmt(a, 2)
    : `${fmt(a, 2)}${b < 0 ? '-' : '+'}${fmt(Math.abs(b), 2)}\\mathrm{i}`;

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'Re', ayLab: 'Im', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const P = (x, y) => V(m.px(x), m.py(y));
    const A = P(st.ax, st.ay), Bp = P(st.bx, st.by);
    const a = st.ax, b = st.ay, c = st.bx, d = st.by;
    const px = a * c - b * d, py = a * d + b * c;
    const R = P(px, py), Rc = P(px, -py);

    B.arrow(O, A, { stroke: '#5cadff', 'stroke-width': 2.4, head: 12, wide: 5.5 });
    B.arrow(O, Bp, { stroke: '#ff9e4a', 'stroke-width': 2.4, head: 12, wide: 5.5 });
    B.tex(V(A.x + 7, A.y - 12), '$z_1$', { size: 14, anchor: 'start', color: '#5cadff', w: 40 });
    B.tex(V(Bp.x + 7, Bp.y - 12), '$z_2$', { size: 14, anchor: 'start', color: '#ff9e4a', w: 40 });
    // 积向量
    if (Math.hypot(px, py) > 1e-9) {
      B.arrow(O, R, { stroke: '#ffd166', 'stroke-width': 2.8, head: 14, wide: 6.5 });
      B.tex(V(R.x + 8, R.y - 12), '$z_1z_2$', { size: 14, anchor: 'start', color: '#ffd166', w: 70 });
      // 积的共轭：关于实轴镜像
      B.seg(R, Rc, { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .8 });
      B.arrow(O, Rc, { stroke: '#c084fc', 'stroke-width': 2, head: 11, wide: 5, 'stroke-dasharray': '6 4' });
      // 先共轭再相乘：圆环标出，与上图终点重合
      B.dot(Rc, 9, { fill: 'none', stroke: '#4ade80', 'stroke-width': 1.8, 'stroke-opacity': .95 });
      B.text(V(Rc.x + 12, Rc.y + 18), 'z̄₁z̄₂', { 'font-size': 12, fill: '#4ade80' });
    }
    B.dot(O, 3.2, { fill: '#e8eefc' });
    B.dot(R, 4, { fill: '#ffd166' });

    // 徽章
    cP(`$z_1z_2=${zs(px, py)}$`);
    const l1 = Math.hypot(a, b), l2 = Math.hypot(c, d);
    cM(`$|z_1z_2|=${fmt(l1 * l2, 2)}=${fmt(l1, 2)}\\times${fmt(l2, 2)}$`);
    cC(`$\\overline{z_1z_2}=${zs(px, -py)}$`);
    cJ(Math.abs(py) < 1e-9 ? '积的虚部为零：乘积落在实轴上，紫色箭头与金色箭头重合'
      : '共轭积与先共轭再相乘两点重合：紫色箭头终点正是绿色圆环');
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

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    [st.ax, st.ay] = p.a; [st.bx, st.by] = p.b;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('金色是 z₁z₂，紫色是它的共轭，绿色圆环是 z̄₁z̄₂ —— 两者始终落在同一点');
  B.render();
  return B;
}
