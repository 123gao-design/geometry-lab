/* 图 参2a · 直线的参数方程
   过定点 P0(x0,y0)、倾斜角为 α 的直线：x=x0+t cosα，y=y0+t sinα。
   参数 t 的绝对值等于 P0 到 P 的有向距离：t>0 沿 α 方向，t<0 沿反向。
   拖动 P 沿直线走，P0 固定，方向由 α 滑块控制。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { alpha: 30, t: 2.4, grid: true, labs: true };
  const m = B.isoFit(-4.2, 4.2, -3.2, 3.2, [44, 30, 780, 390], 10);
  const cE = B.chipM('参数方程'), cN = B.chipM('普通方程'), cT = B.chipM('t 的几何意义'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const al = () => st.alpha * Math.PI / 180;
  const P0 = V(1, 1);
  const P = () => V(P0.x + st.t * Math.cos(al()), P0.y + st.t * Math.sin(al()));

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const d = V(Math.cos(al()), Math.sin(al()));
    const A = V(P0.x - 5 * d.x, P0.y - 5 * d.y), Bp = V(P0.x + 5 * d.x, P0.y + 5 * d.y);
    B.seg(V(m.px(A.x), m.py(A.y)), V(m.px(Bp.x), m.py(Bp.y)), { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .9 });

    const p0 = V(m.px(P0.x), m.py(P0.y));
    const Pw = P(), Pp = V(m.px(Pw.x), m.py(Pw.y));
    // 方向角弧
    const ar = 38, K = 26;
    for (let i = 0; i < K; i++) {
      const a1 = al() * i / K, a2 = al() * (i + 1) / K;
      B.seg(V(p0.x + ar * Math.cos(a1), p0.y - ar * Math.sin(a1)),
        V(p0.x + ar * Math.cos(a2), p0.y - ar * Math.sin(a2)),
        { stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-opacity': .9 });
    }
    B.tex(V(p0.x + 54 * Math.cos(al() / 2), p0.y - 54 * Math.sin(al() / 2)),
      `$\\alpha=${st.alpha}^\\circ$`, { size: 12, anchor: 'mid', color: '#ff9e4a', w: 100 });
    B.arrow(p0, Pp, { stroke: st.t >= 0 ? '#ffd166' : '#ff7b72', 'stroke-width': 2.6, head: 13, wide: 6 });
    B.dot(p0, 4.2, { fill: '#5cadff' });
    B.tex(V(p0.x - 9, p0.y + 19), '$P_0$', { size: 12.5, anchor: 'end', color: '#5cadff', w: 60 });
    B.dot(Pp, 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(Pp.x + 10, Pp.y - 12), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });
    B.tex(V(Pp.x + 10, Pp.y + 18), `$t=${fz(st.t)}$`, { size: 12, anchor: 'start', color: '#ff9e4a', w: 90 });

    cE(`$x=1+t\\cos{${st.alpha}}^\\circ,\\quad y=1+t\\sin{${st.alpha}}^\\circ$`);
    cN(Math.abs(Math.cos(al())) < 1e-6 ? '$x=1$'
      : `$y-1=${fz(Math.tan(al()))}(x-1)$`);
    cT(`$|t|=${fz(Math.abs(st.t))}$，方向 $(${fz(Math.cos(al()))},\\ ${fz(Math.sin(al()))})$`);
    cJ(Math.abs(st.t) < 2e-2 ? '$t=0$：P 回到定点 $P_0$'
      : st.t > 0 ? '$t>0$：P 在 $P_0$ 的 $\\alpha$ 方向一侧，$t$ 就是 $P_0P$ 的有向长度'
        : '$t<0$：P 落在反向延长线上，$|t|$ 仍等于 $P_0P$ 的长度');
  };

  const PRE = [
    { nm: '① 30°', alpha: 30, t: 2.4 }, { nm: '② 90°', alpha: 90, t: 1.8 },
    { nm: '③ 135°', alpha: 135, t: 2.2 },
  ];
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    st.alpha = o.alpha; st.t = o.t;
    sA.sync(st.alpha); sT.sync(st.t);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  const sA = B.slider('α (°)', 0, 180, 5, st.alpha, v => { st.alpha = v; B.render(); }, 'pla');
  const sT = B.slider('t', -3.4, 3.4, 0.1, st.t, v => { st.t = v; B.render(); }, 'plt');

  B.handle({
    color: '#ffd166', r: 7,
    get: () => { const p = P(); return V(m.px(p.x), m.py(p.y)); },
    set: p => {
      const dx = (p.x - m.px(P0.x)) / m.s, dy = (m.py(P0.y) - p.y) / m.s;
      st.t = Math.max(-3.4, Math.min(3.4, dx * Math.cos(al()) + dy * Math.sin(al())));
      sT.sync(st.t);
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动 P：直线过定点 P0，方向由倾斜角 α 定，参数 t 是有向距离，正负表示在 P0 的哪一侧');
  B.render();
  return B;
}
