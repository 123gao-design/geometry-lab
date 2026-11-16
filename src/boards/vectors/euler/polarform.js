/* 图 欧1 · 三角形式与辐角
   复数 z 还可以用模 r 与辐角 θ 表示：z=r(cosθ+i sinθ)。
   横坐标是 r cosθ、纵坐标是 r sinθ，俯角 θ 从实轴正方向逆时针量起。
   拖动 Z 同时改 r 与 θ，虚线圆标出模，橙色弧标出辐角。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { r: 2, deg: 60, grid: true, labs: true };
  const PRE = [
    { nm: '① 60°', r: 2, deg: 60 },
    { nm: '② 135°', r: 2.2, deg: 135 },
    { nm: '③ 210°', r: 2.4, deg: 210 },
    { nm: '④ 300°', r: 1.8, deg: 300 },
  ];
  const m = B.isoFit(-3.4, 3.4, -2.9, 2.9, [40, 34, 620, 380], 10);
  const cT = B.chipM('三角形式'), cR = B.chipM('模与辐角'), cC = B.chipM('坐标'), cJ = B.chipM('判读');

  const zt = (a, b) => Math.abs(b) < 1e-9 ? fmt(a, 2)
    : `${fmt(a, 2)}${b < 0 ? '-' : '+'}${fmt(Math.abs(b), 2)}\\mathrm{i}`;

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'Re', ayLab: 'Im', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const th = st.deg * Math.PI / 180;
    const a = st.r * Math.cos(th), b = st.r * Math.sin(th);
    const Z = V(m.px(a), m.py(b));

    // 模的虚线圆
    const N = 72;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(V(O.x + st.r * m.s * Math.cos(a1), O.y - st.r * m.s * Math.sin(a1)),
        V(O.x + st.r * m.s * Math.cos(a2), O.y - st.r * m.s * Math.sin(a2)),
        { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-opacity': .35 });
    }
    // 到两轴的投影
    B.seg(Z, V(m.px(a), m.py(0)), { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .7 });
    B.seg(Z, V(m.px(0), m.py(b)), { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .7 });
    // 辐角弧
    if (st.deg > 1) {
      const rr = Math.min(56, st.r * m.s * 0.32);
      const K = 32;
      for (let i = 0; i < K; i++) {
        const a1 = th * i / K, a2 = th * (i + 1) / K;
        B.seg(V(O.x + rr * Math.cos(a1), O.y - rr * Math.sin(a1)),
          V(O.x + rr * Math.cos(a2), O.y - rr * Math.sin(a2)),
          { stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-opacity': .9 });
      }
      const am = th / 2;
      B.tex(V(O.x + (rr + 20) * Math.cos(am), O.y - (rr + 20) * Math.sin(am)),
        `$\\theta=${st.deg}^\\circ$`, { size: 12, anchor: 'mid', color: '#ff9e4a', w: 80 });
    }
    // 向量
    if (st.r > 1e-9) B.arrow(O, Z, { stroke: '#ffd166', 'stroke-width': 2.6, head: 13, wide: 6 });
    B.tex(V(Z.x + 8, Z.y - 12), '$z$', { size: 14, anchor: 'start', color: '#ffd166', w: 26 });
    B.dot(Z, 4.4, { fill: '#ffd166' });
    B.dot(O, 3.2, { fill: '#e8eefc' });

    // 徽章
    cT(`$z=${fmt(st.r, 2)}(\\cos${st.deg}^\\circ+\\mathrm{i}\\sin${st.deg}^\\circ)$`);
    cR(`$r=|z|=${fmt(st.r, 2)},\\quad \\theta=${st.deg}^\\circ$`);
    cC(`$a=r\\cos\\theta=${fmt(a, 2)},\\quad b=r\\sin\\theta=${fmt(b, 2)}$`);
    cJ(st.deg === 0 ? 'θ=0：落在实轴正半轴，虚部为 0'
      : st.deg === 90 ? 'θ=90°：落在虚轴正半轴，实部为 0'
        : st.deg === 180 ? 'θ=180°：落在实轴负半轴，虚部为 0'
          : st.deg === 270 ? 'θ=270°：落在虚轴负半轴，实部为 0'
            : st.deg < 90 ? '第一象限：余弦、正弦都为正'
              : st.deg < 180 ? '第二象限：余弦为负、正弦为正'
                : st.deg < 270 ? '第三象限：余弦、正弦都为负'
                  : '第四象限：余弦为正、正弦为负');
  };

  const clr = v => Math.max(0.5, Math.min(3.2, Math.round(v * 10) / 10));
  B.handle({
    color: '#ffd166', r: 7,
    get: () => V(m.px(st.r * Math.cos(st.deg * Math.PI / 180)), m.py(st.r * Math.sin(st.deg * Math.PI / 180))),
    set: p => {
      const dx = (p.x - m.px(0)) / m.s, dy = (m.py(0) - p.y) / m.s;
      st.r = clr(Math.hypot(dx, dy));
      let d = Math.atan2(dy, dx) * 180 / Math.PI;
      if (d < 0) d += 360;
      st.deg = Math.round(d) % 360;
    },
  });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.r = p.r; st.deg = p.deg;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动 Z：模 r 是虚线圆的半径，辐角 θ 是橙色弧从实轴正方向量起的角');
  B.render();
  return B;
}
