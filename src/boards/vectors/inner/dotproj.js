/* 图 积1 · 数量积与投影
   两个向量 a、b 的夹角为 θ，数量积 a·b = |a||b|cosθ，几何上是 |a| 乘上 b 在 a 方向上的投影。
   拖动两支箭头的终点：金色线段是 b 在 a 方向上的投影，紫色虚线是 b 的终点到投影垂足的高。
   局部坐标：x∈[−4.6,4.6]，y∈[−3.4,3.4]，原点在画框中心。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: 3, ay: 1, bx: 1, by: 2.2, grid: true, labs: true };
  const PRE = [
    { nm: '① 一般夹角', a: [3, 1], b: [1, 2.2] },
    { nm: '② 垂直', a: [3, 1], b: [-1, 3] },
    { nm: '③ 钝角', a: [3, 1], b: [-2, 1.5] },
    { nm: '④ 反向', a: [3, 1], b: [-3, -1] },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cD = B.chipM('数量积'), cP = B.chipM('投影'), cA = B.chipM('夹角'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const A = V(m.px(st.ax), m.py(st.ay));
    const Bp = V(m.px(st.bx), m.py(st.by));
    const la = Math.hypot(st.ax, st.ay), lb = Math.hypot(st.bx, st.by);
    const dot = st.ax * st.bx + st.ay * st.by;
    const cos = la > 1e-9 && lb > 1e-9 ? dot / (la * lb) : 0;
    const ang = Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
    // b 在 a 方向上的投影长度与垂足
    const proj = la > 1e-9 ? dot / la : 0;
    const ux = la > 1e-9 ? st.ax / la : 1, uy = la > 1e-9 ? st.ay / la : 0;
    const Q = V(m.px(proj * ux), m.py(proj * uy));

    // 投影与垂线
    if (la > 1e-9) {
      B.seg(O, Q, { stroke: '#ffd166', 'stroke-width': 4, 'stroke-opacity': .85 });
      if (Math.hypot(st.bx - proj * ux, st.by - proj * uy) > 1e-6) {
        B.seg(Q, Bp, { stroke: '#c084fc', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .8 });
      }
    }
    // 两支向量
    B.arrow(O, A, { stroke: '#5cadff', 'stroke-width': 2.4, head: 13, wide: 6 });
    B.arrow(O, Bp, { stroke: '#ff9e4a', 'stroke-width': 2.4, head: 13, wide: 6 });
    B.tex(V(A.x + 7, A.y - 12), '$\\vec a$', { size: 14, anchor: 'start', color: '#5cadff', w: 30 });
    B.tex(V(Bp.x + 7, Bp.y - 12), '$\\vec b$', { size: 14, anchor: 'start', color: '#ff9e4a', w: 30 });
    B.dot(O, 3.4, { fill: '#e8eefc' });
    if (la > 1e-9) B.dot(Q, 3.6, { fill: '#ffd166' });

    // 徽章
    cD(`$\\vec a\\cdot\\vec b=|\\vec a||\\vec b|\\cos\\theta=${fmt(dot, 2)}$`);
    cP(proj < 0
      ? `$|\\vec b|\\cos\\theta=${fmt(proj, 2)}$（投影落在 $\\vec a$ 的反方向）`
      : `$|\\vec b|\\cos\\theta=${fmt(proj, 2)}$`);
    cA(`$\\theta=${fmt(ang, 1)}^\\circ,\\quad \\cos\\theta=${fmt(cos, 2)}$`);
    cJ(la < 1e-9 || lb < 1e-9 ? '含零向量：数量积为 0，夹角没有定义'
      : Math.abs(cos - 1) < 1e-6 ? '同向：cosθ=1，数量积等于两个模之积'
        : Math.abs(cos + 1) < 1e-6 ? '反向：cosθ=−1，数量积等于两个模之积的相反数'
          : Math.abs(dot) < 1e-6 ? '垂直：cosθ=0，数量积为 0'
            : dot > 0 ? '锐角：cosθ>0，数量积为正'
              : '钝角：cosθ<0，数量积为负');
  };

  const cl = v => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
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
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动两支箭头的终点：金色线段是 b 在 a 上的投影，长度带符号');
  B.render();
  return B;
}
