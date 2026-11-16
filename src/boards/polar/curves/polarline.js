/* 图 曲2 · 直线与射线的极坐标方程
   过极点、极角为 α 的直线：θ=α，ρ 可取正负，负径给出反向射线。
   垂直于极轴、与极点相距 a 的直线：ρcosθ=a。
   平行于极轴、与极点相距 b 的直线：ρsinθ=b。
   拖动 P 沿当前直线滑动，橙色弧读极角，虚线是极点到直线的垂线段。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { mode: 'ang', alpha: 45, a: 1.5, b: 1, t: 2, py: 1.2, px: 1.2, grid: true, labs: true };
  const m = B.isoFit(-3.6, 3.6, -2.9, 2.9, [44, 30, 780, 390], 10);
  const cE = B.chipM('方程'), cC = B.chipM('直角坐标方程'), cP = B.chipM('点 P'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const al = () => st.alpha * Math.PI / 180;

  const point = () => {
    if (st.mode === 'ang') return V(st.t * Math.cos(al()), st.t * Math.sin(al()));
    if (st.mode === 'cos') return V(st.a, st.py);
    return V(st.px, st.b);
  };

  B.renderFn = () => {
    const O = V(m.px(0), m.py(0));
    const P = point();
    // P 是数学坐标，落到画布上先投影（直接丢给 B.seg/B.dot 会画到画布左上角）
    const Pp = V(m.px(P.x), m.py(P.y));

    if (st.grid) {
      for (let rr = 1; rr <= 3; rr++) {
        const N = 64;
        for (let i = 0; i < N; i++) {
          const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
          B.seg(V(O.x + rr * m.s * Math.cos(a1), O.y - rr * m.s * Math.sin(a1)),
            V(O.x + rr * m.s * Math.cos(a2), O.y - rr * m.s * Math.sin(a2)),
            { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-opacity': .2 });
        }
      }
      for (let d = 30; d < 360; d += 30) {
        const rad = d * Math.PI / 180;
        B.seg(O, V(O.x + 3.5 * m.s * Math.cos(rad), O.y - 3.5 * m.s * Math.sin(rad)),
          { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-opacity': .14 });
      }
    }
    B.arrow(O, V(O.x + 3.58 * m.s, O.y), { stroke: '#5cadff', 'stroke-width': 1.8, head: 11, wide: 5 });
    if (st.labs) {
      B.text(V(O.x + 3.68 * m.s, O.y + 17), '极轴', { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
      for (let rr = 1; rr <= 3; rr++) {
        B.text(V(O.x - 4, O.y - rr * m.s + 14), `${rr}`, { 'font-size': 10.5, fill: '#8fa3bd', 'text-anchor': 'end' });
      }
    }

    // 当前直线
    if (st.mode === 'ang') {
      const d = V(Math.cos(al()), Math.sin(al()));
      B.seg(V(m.px(-8 * d.x), m.py(-8 * d.y)), V(m.px(8 * d.x), m.py(8 * d.y)),
        { stroke: '#ffd166', 'stroke-width': 2.6, 'stroke-opacity': .95 });
      // 方程标签放远一些，免得压住 P 的手柄与名牌
      const L = V(m.px(2.7 * d.x), m.py(2.7 * d.y));
      B.tex(V(L.x + 12, L.y - 12), `$\\theta=${st.alpha}^\\circ$`, { size: 13, anchor: 'start', color: '#ffd166', w: 100 });
    } else if (st.mode === 'cos') {
      B.seg(V(m.px(st.a), m.py(-8)), V(m.px(st.a), m.py(8)),
        { stroke: '#ffd166', 'stroke-width': 2.6, 'stroke-opacity': .95 });
      B.tex(V(m.px(st.a) + 10, m.py(2.45)), `$x=${fz(st.a)}$`, { size: 13, anchor: 'start', color: '#ffd166', w: 100 });
    } else {
      B.seg(V(m.px(-8), m.py(st.b)), V(m.px(8), m.py(st.b)),
        { stroke: '#ffd166', 'stroke-width': 2.6, 'stroke-opacity': .95 });
      B.tex(V(m.px(3.05), m.py(st.b) - 10), `$y=${fz(st.b)}$`, { size: 13, anchor: 'end', color: '#ffd166', w: 100 });
    }

    // 极点到直线的垂线段
    if (st.mode !== 'ang') {
      const H = V(st.mode === 'cos' ? st.a : 0, st.mode === 'cos' ? 0 : st.b);
      const Hp = V(m.px(H.x), m.py(H.y));
      B.seg(O, Hp, { stroke: '#5cadff', 'stroke-width': 1.5, 'stroke-opacity': .7, 'stroke-dasharray': '5 5' });
      B.dot(Hp, 3.6, { fill: '#5cadff' });
      if (Math.hypot(H.x, H.y) > 1e-6) {
        const dO = Math.hypot(O.x - Hp.x, O.y - Hp.y);
        // 直角标记的第二条边沿直线方向：垂直极轴的线走竖直，平行极轴的线走水平
        const toward = st.mode === 'cos'
          ? V(0, st.py >= 0 ? 1 : -1)
          : V(st.px >= 0 ? 1 : -1, 0);
        const u1 = { x: (O.x - Hp.x) / dO, y: (O.y - Hp.y) / dO };
        const u2 = toward;
        const q1 = V(Hp.x + u1.x * 9, Hp.y + u1.y * 9);
        const q2 = V(Hp.x + u2.x * 9, Hp.y + u2.y * 9);
        const q3 = V(q1.x + u2.x * 9, q1.y + u2.y * 9);
        B.seg(q1, q3, { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-opacity': .8 });
        B.seg(q2, q3, { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-opacity': .8 });
      }
      B.text(V(Hp.x + 8, Hp.y + (st.mode === 'cos' ? 17 : -9)), 'H',
        { 'font-size': 12, 'font-weight': 700, fill: '#5cadff' });
    }

    // 极角弧与 OP
    let deg = Math.atan2(P.y, P.x) * 180 / Math.PI;
    if (deg < 0) deg += 360;
    const rho = Math.hypot(P.x, P.y);
    if (rho > 1e-6) {
      // 弧半径取定值：P 沿直线滑时张角在变，弧不长不短
      const ar = 46, K = 34;
      const th = deg * Math.PI / 180;
      for (let i = 0; i < K; i++) {
        const a1 = th * i / K, a2 = th * (i + 1) / K;
        B.seg(V(O.x + ar * Math.cos(a1), O.y - ar * Math.sin(a1)),
          V(O.x + ar * Math.cos(a2), O.y - ar * Math.sin(a2)),
          { stroke: '#ff9e4a', 'stroke-width': 1.5, 'stroke-opacity': .9 });
      }
      const am = th / 2;
      B.tex(V(O.x + (ar + 20) * Math.cos(am), O.y - (ar + 20) * Math.sin(am)),
        `$\\theta=${Math.round(deg)}^\\circ$`, { size: 12, anchor: 'mid', color: '#ff9e4a', w: 92 });
      B.arrow(O, Pp, { stroke: '#ffd166', 'stroke-width': 2.2, head: 12, wide: 5.5 });
    }

    B.dot(O, 3.6, { fill: '#12161f' });
    B.dot(Pp, 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(Pp.x + 10, Pp.y - 12), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });
    B.text(V(O.x - 4, O.y + 20), 'O', { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'end' });

    cE(st.mode === 'ang' ? `$\\theta=${st.alpha}^\\circ$（$\\rho\\in\\mathbb{R}$）`
      : st.mode === 'cos' ? `$\\rho\\cos\\theta=${fz(st.a)}$` : `$\\rho\\sin\\theta=${fz(st.b)}$`);
    if (st.mode === 'ang') {
      cC(Math.abs(Math.cos(al())) < 1e-6 ? '$x=0$（$y$ 轴）'
        : `$y=${fz(Math.tan(al()))}x$`);
    } else if (st.mode === 'cos') {
      cC(`$x=${fz(st.a)}$`);
    } else {
      cC(`$y=${fz(st.b)}$`);
    }
    cP(rho < 2e-2 ? '极点 $O$，$\\rho=0$' : `$P(\\rho,\\theta)=(${fz(rho)},\\ ${Math.round(deg)}^\\circ)$`);
    if (st.mode === 'ang') {
      cJ(`过极点的直线：$\\rho>0$ 一半是 $\\alpha$ 方向的射线，$\\rho<0$ 一半是反向射线；P 此时在${st.t >= 0 ? '正向' : '反向'}射线上`);
    } else if (Math.abs(st.a) < 1e-6) {
      cJ('$a=0$：直线过极点，就是 $y$ 轴，极坐标方程退化为 $\\theta=90^\\circ$');
    } else if (Math.abs(st.b) < 1e-6) {
      cJ('$b=0$：直线过极点，就是 $x$ 轴，极坐标方程退化为 $\\theta=0^\\circ$');
    } else if (st.mode === 'cos') {
      cJ(`直线垂直于极轴，在极点${st.a > 0 ? '右' : '左'}侧，到极点的距离为 ${fz(Math.abs(st.a))}；$\\theta$ 在 $(-90^\\circ,90^\\circ)$ 内时 $\\rho>0$`);
    } else {
      cJ(`直线平行于极轴，在极轴${st.b > 0 ? '上' : '下'}方，到极轴的距离为 ${fz(Math.abs(st.b))}；$\\theta$ 在 $(0^\\circ,180^\\circ)$ 内时 $\\rho>0$`);
    }
  };

  const MODES = [
    { key: 'ang', nm: '① 过极点 θ=α' },
    { key: 'cos', nm: '② 垂直极轴' },
    { key: 'sin', nm: '③ 平行极轴' },
  ];
  const btns = MODES.map((o, i) => B.btn(o.nm, () => {
    st.mode = o.key;
    if (o.key === 'ang') st.t = 2;
    if (o.key === 'cos') st.py = 1.2;
    if (o.key === 'sin') st.px = 1.2;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.slider('α (°)', 0, 180, 5, st.alpha, v => { st.alpha = v; B.render(); }, 'al');
  B.slider('a', -2, 2, 0.5, st.a, v => { st.a = v; B.render(); }, 'la');
  B.slider('b', -2, 2, 0.5, st.b, v => { st.b = v; B.render(); }, 'lb');

  B.handle({
    color: '#ffd166', r: 7,
    get: () => { const p = point(); return V(m.px(p.x), m.py(p.y)); },
    set: p => {
      const dx = (p.x - m.px(0)) / m.s, dy = (m.py(0) - p.y) / m.s;
      if (st.mode === 'ang') {
        st.t = Math.max(-3.4, Math.min(3.4, dx * Math.cos(al()) + dy * Math.sin(al())));
      } else if (st.mode === 'cos') {
        st.py = Math.max(-2.7, Math.min(2.7, dy));
      } else {
        st.px = Math.max(-3.4, Math.min(3.4, dx));
      }
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动 P 沿直线滑：过极点的直线写成 θ=α，垂直于极轴的写成 ρcosθ=a，平行于极轴的写成 ρsinθ=b');
  B.render();
  return B;
}
