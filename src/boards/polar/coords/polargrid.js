/* 图 极1 · 极坐标系与点的极坐标
   极坐标系由极点 O 与极轴（从 O 出发的一条射线）确定。
   点 P 的极坐标写成 (ρ,θ)：ρ 是 OP 的长，θ 是从极轴逆时针转到 OP 的角。
   同一枚点有无穷多组极坐标：(ρ,θ+2kπ)，以及负径约定下的 (−ρ,θ+π)。
   拖动 P 同时改 ρ 与 θ；极轴、同心圆与等分射线给出读数的参照。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { r: 2, deg: 60, grid: true, labs: true };
  const PRE = [
    { nm: '① 60°', r: 2, deg: 60 },
    { nm: '② 120°', r: 3, deg: 120 },
    { nm: '③ 240°', r: 1.5, deg: 240 },
    { nm: '④ 0°', r: 2.5, deg: 0 },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [44, 30, 780, 390], 10);
  const cA = B.chipM('极坐标'), cR = B.chipM('极径'), cE = B.chipM('等价表示'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const O = V(m.px(0), m.py(0));
    const th = st.deg * Math.PI / 180;
    const P = V(m.px(st.r * Math.cos(th)), m.py(st.r * Math.sin(th)));

    // 极坐标网格：同心圆与等分射线
    if (st.grid) {
      for (let rr = 1; rr <= 3; rr++) {
        const N = 64;
        for (let i = 0; i < N; i++) {
          const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
          B.seg(V(O.x + rr * m.s * Math.cos(a1), O.y - rr * m.s * Math.sin(a1)),
            V(O.x + rr * m.s * Math.cos(a2), O.y - rr * m.s * Math.sin(a2)),
            { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-opacity': .22 });
        }
      }
      for (let a = 30; a < 360; a += 30) {
        const rad = a * Math.PI / 180;
        B.seg(O, V(O.x + 4.4 * m.s * Math.cos(rad), O.y - 4.4 * m.s * Math.sin(rad)),
          { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-opacity': .16 });
      }
    }
    // 极轴
    B.arrow(O, V(O.x + 4.45 * m.s, O.y), { stroke: '#5cadff', 'stroke-width': 1.8, head: 11, wide: 5 });
    if (st.labs) {
      B.text(V(O.x + 4.55 * m.s, O.y + 17), '极轴', { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
      for (let rr = 1; rr <= 3; rr++) {
        B.text(V(O.x - 4, O.y - rr * m.s + 14), `${rr}`, { 'font-size': 10.5, fill: '#8fa3bd', 'text-anchor': 'end' });
      }
    }

    // 极角弧
    if (st.deg > 0.5) {
      // 弧半径取定值：P 滑动时只改张角，弧不长不短
      const ar = 46, K = 34;
      for (let i = 0; i < K; i++) {
        const a1 = th * i / K, a2 = th * (i + 1) / K;
        B.seg(V(O.x + ar * Math.cos(a1), O.y - ar * Math.sin(a1)),
          V(O.x + ar * Math.cos(a2), O.y - ar * Math.sin(a2)),
          { stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-opacity': .9 });
      }
      const am = th / 2;
      B.tex(V(O.x + (ar + 21) * Math.cos(am), O.y - (ar + 21) * Math.sin(am)),
        `$\\theta=${st.deg}^\\circ$`, { size: 12, anchor: 'mid', color: '#ff9e4a', w: 90 });
    }

    // 极径 OP
    if (st.r > 1e-9) B.arrow(O, P, { stroke: '#ffd166', 'stroke-width': 2.6, head: 13, wide: 6 });
    B.dot(O, 3.6, { fill: '#12161f' });
    B.dot(P, 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(P.x + 10, P.y - 12), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });
    B.text(V(O.x - 4, O.y + 20), 'O', { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'end' });

    // 徽章
    cA(`$P(\\rho,\\theta)=(${fmt(st.r, 2)},\\ ${st.deg}^\\circ)$`);
    cR(`$\\rho=|OP|=${fmt(st.r, 2)}$`);
    cE(`$(${fmt(st.r, 2)},\\ ${st.deg + 360}^\\circ)$ 与 $(-${fmt(st.r, 2)},\\ ${(st.deg + 180) % 360}^\\circ)$ 表示同一点`);
    cJ(st.deg === 0 ? 'θ=0：点落在极轴上'
      : st.deg === 90 ? 'θ=90°：点落在过极点、垂直于极轴的射线上'
        : st.deg === 180 ? 'θ=180°：点落在极轴的反向延长线上'
          : st.deg === 270 ? 'θ=270°：点落在垂直射线的反向延长线上'
            : st.deg < 90 ? '第一象限：极角在 0° 与 90° 之间'
              : st.deg < 180 ? '第二象限：极角在 90° 与 180° 之间'
                : st.deg < 270 ? '第三象限：极角在 180° 与 270° 之间'
                  : '第四象限：极角在 270° 与 360° 之间');
  };

  const cl = v => Math.max(0.5, Math.min(4, Math.round(v * 10) / 10));
  B.handle({
    color: '#ffd166', r: 7,
    get: () => V(m.px(st.r * Math.cos(st.deg * Math.PI / 180)), m.py(st.r * Math.sin(st.deg * Math.PI / 180))),
    set: p => {
      const dx = (p.x - m.px(0)) / m.s, dy = (m.py(0) - p.y) / m.s;
      st.r = cl(Math.hypot(dx, dy));
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

  B.hint('拖动 P：极径 ρ 是 OP 的长，极角 θ 从极轴逆时针量起，同一枚点对应无穷多组极坐标');
  B.render();
  return B;
}
