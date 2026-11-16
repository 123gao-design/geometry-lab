/* 图 参2b · 圆的参数方程
   圆心 C(x0,y0)、半径 r 的圆：x=x0+r cosθ，y=y0+r sinθ。
   参数 θ 是圆心角：从 C 出发平行于 x 轴的正方向量起，逆时针为正。
   拖动 P 沿圆周走，圆心 C 固定，半径由滑块控制；θ 与半径同看。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { r: 1.5, deg: 60, grid: true, labs: true };
  const m = B.isoFit(-3.6, 3.6, -2.9, 2.9, [44, 30, 780, 390], 10);
  const cE = B.chipM('参数方程'), cN = B.chipM('普通方程'), cT = B.chipM('圆心角'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const C = V(1, 1);
  const th = () => st.deg * Math.PI / 180;
  const P = () => V(C.x + st.r * Math.cos(th()), C.y + st.r * Math.sin(th()));

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const c = V(m.px(C.x), m.py(C.y));
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(V(m.px(C.x + st.r * Math.cos(a1)), m.py(C.y + st.r * Math.sin(a1))),
        V(m.px(C.x + st.r * Math.cos(a2)), m.py(C.y + st.r * Math.sin(a2))),
        { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    }
    const Pw = P(), Pp = V(m.px(Pw.x), m.py(Pw.y));
    B.seg(c, Pp, { stroke: '#5cadff', 'stroke-width': 1.5, 'stroke-opacity': .8, 'stroke-dasharray': '5 5' });
    const ar = Math.min(st.r * m.s * 0.45, 56), K = 34;
    for (let i = 0; i < K; i++) {
      const a1 = th() * i / K, a2 = th() * (i + 1) / K;
      B.seg(V(c.x + ar * Math.cos(a1), c.y - ar * Math.sin(a1)),
        V(c.x + ar * Math.cos(a2), c.y - ar * Math.sin(a2)),
        { stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-opacity': .9 });
    }
    if (st.deg > 2) {
      B.tex(V(c.x + (ar + 19) * Math.cos(th() / 2), c.y - (ar + 19) * Math.sin(th() / 2)),
        `$\\theta=${st.deg}^\\circ$`, { size: 12, anchor: 'mid', color: '#ff9e4a', w: 100 });
    }
    B.dot(c, 3.8, { fill: '#5cadff' });
    B.text(V(c.x + 9, c.y + 17), 'C', { 'font-size': 12.5, 'font-weight': 700, fill: '#5cadff' });
    B.dot(Pp, 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(Pp.x + 10, Pp.y - 12), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });

    cE(`$x=1+${fz(st.r)}\\cos\\theta,\\quad y=1+${fz(st.r)}\\sin\\theta$`);
    cN(`$(x-1)^2+(y-1)^2=${fz(st.r * st.r)}$`);
    cT(`$\\theta=${st.deg}^\\circ,\\quad P(${fz(Pw.x)},\\ ${fz(Pw.y)})$`);
    cJ(st.deg === 0 ? 'θ=0：P 在圆心右侧，与圆心相距 r'
      : st.deg === 90 ? 'θ=90°：P 在圆心正上方'
        : st.deg === 180 ? 'θ=180°：P 在圆心左侧'
          : st.deg === 270 ? 'θ=270°：P 在圆心正下方'
            : 'θ 是圆心角，从圆心指向右侧的方向逆时针量起；θ 转满 360° 回到原处');
  };

  const PRE = [
    { nm: '① 0°', deg: 0 }, { nm: '② 90°', deg: 90 }, { nm: '③ 180°', deg: 180 },
  ];
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    st.deg = o.deg;
    sA.sync(st.deg);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.slider('r', 0.5, 2.5, 0.1, st.r, v => { st.r = v; B.render(); }, 'pcr');
  const sA = B.slider('θ (°)', 0, 360, 5, st.deg, v => { st.deg = v; B.render(); }, 'pct');

  B.handle({
    color: '#ffd166', r: 7,
    get: () => { const p = P(); return V(m.px(p.x), m.py(p.y)); },
    set: p => {
      const dx = (p.x - m.px(C.x)) / m.s, dy = (m.py(C.y) - p.y) / m.s;
      let d = Math.atan2(dy, dx) * 180 / Math.PI;
      if (d < 0) d += 360;
      st.deg = Math.round(d) % 360;
      sA.sync(st.deg);
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动 P：圆心 C 与半径 r 定住圆，参数 θ 是圆心角，转一圈回到原处');
  B.render();
  return B;
}
