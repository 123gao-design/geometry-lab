/* 图 积2 · 坐标数量积与夹角机
   a=(x₁,y₁)、b=(x₂,y₂)，则 a·b=x₁x₂+y₁y₂，cosθ=(a·b)/(|a||b|)。
   拖动两支箭头的终点：点积的符号决定夹角是锐角、直角还是钝角。
   局部坐标：x∈[−4.6,4.6]，y∈[−3.4,3.4]，原点在画框中心。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: 3, ay: 1, bx: 1, by: 2, grid: true, labs: true };
  const PRE = [
    { nm: '① 一般夹角', a: [3, 1], b: [1, 2] },
    { nm: '② 垂直', a: [3, 1], b: [-1, 3] },
    { nm: '③ 同向平行', a: [2, 1], b: [4, 2] },
    { nm: '④ 钝角', a: [2, 1], b: [-3, 1] },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cD = B.chipM('点积'), cM = B.chipM('模长'), cA = B.chipM('夹角'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const A = V(m.px(st.ax), m.py(st.ay));
    const Bp = V(m.px(st.bx), m.py(st.by));
    const la = Math.hypot(st.ax, st.ay), lb = Math.hypot(st.bx, st.by);
    const dot = st.ax * st.bx + st.ay * st.by;
    const cross = st.ax * st.by - st.ay * st.bx;
    const cos = la > 1e-9 && lb > 1e-9 ? dot / (la * lb) : 0;
    const ang = Math.acos(Math.max(-1, Math.min(1, cos))) * 180 / Math.PI;
    const perp = Math.abs(dot) < 1e-6 && la > 1e-9 && lb > 1e-9;

    B.arrow(O, A, { stroke: '#5cadff', 'stroke-width': 2.4, head: 13, wide: 6 });
    B.arrow(O, Bp, { stroke: '#ff9e4a', 'stroke-width': 2.4, head: 13, wide: 6 });
    B.tex(V(A.x + 7, A.y - 12), '$\\vec a=(x_1,y_1)$', { size: 13, anchor: 'start', color: '#5cadff', w: 120 });
    B.tex(V(Bp.x + 7, Bp.y - 12), '$\\vec b=(x_2,y_2)$', { size: 13, anchor: 'start', color: '#ff9e4a', w: 120 });
    B.dot(O, 3.4, { fill: '#e8eefc' });
    // 直角标记
    if (perp) {
      const ux = st.ax / la, uy = st.ay / la, vx = st.bx / lb, vy = st.by / lb;
      const q = 0.42;
      const p1 = V(m.px(ux * q), m.py(uy * q));
      const p2 = V(m.px((ux + vx) * q), m.py((uy + vy) * q));
      const p3 = V(m.px(vx * q), m.py(vy * q));
      B.seg(p1, p2, { stroke: '#ffd166', 'stroke-width': 1.4 });
      B.seg(p2, p3, { stroke: '#ffd166', 'stroke-width': 1.4 });
    }

    // 徽章
    const nf = v => (v < 0 ? `(${fmt(v, 1)})` : fmt(v, 1));
    cD(`$\\vec a\\cdot\\vec b=${nf(st.ax)}\\times${nf(st.bx)}+${nf(st.ay)}\\times${nf(st.by)}=${fmt(dot, 2)}$`);
    cM(`$|\\vec a|=${fmt(la, 2)},\\quad |\\vec b|=${fmt(lb, 2)}$`);
    cA(`$\\cos\\theta=\\dfrac{${fmt(dot, 2)}}{${fmt(la, 2)}\\times${fmt(lb, 2)}}=${fmt(cos, 2)},\\quad \\theta=${fmt(ang, 1)}^\\circ$`);
    cJ(la < 1e-9 || lb < 1e-9 ? '含零向量：数量积为 0，夹角没有定义'
      : Math.abs(cross) < 1e-6 ? (dot > 0 ? '平行同向：两向量共线，cosθ=1' : '平行反向：两向量共线，cosθ=−1')
        : perp ? '垂直：点积为 0，夹角为 90°'
          : dot > 0 ? '锐角：点积为正'
            : '钝角：点积为负');
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

  B.hint('拖动两支箭头的终点：点积为正夹角为锐角，为零垂直，为负钝角');
  B.render();
  return B;
}
