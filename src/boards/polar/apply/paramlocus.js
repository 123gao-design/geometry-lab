/* 图 轨2 · 参数方程与轨迹
   P 在以原点为心、半径 2 的圆上，写成 P(2cosθ, 2sinθ)；A 固定 (4,0)，M 是 AP 的中点。
   M=((2cosθ+4)/2, (2sinθ+0)/2)=(2+cosθ, sinθ)。
   拖动 P 走一圈，M 画出以 (2,0) 为心、半径 1 的圆——消去 θ 即 (x−2)²+y²=1。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { deg: 60, grid: true, labs: true };
  const m = B.isoFit(-3.2, 4.6, -2.8, 2.8, [44, 30, 760, 390], 10);
  const cE = B.chipM('点 P 的参数式'), cM = B.chipM('中点 M'), cL = B.chipM('M 的轨迹'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const th = () => st.deg * Math.PI / 180;
  const P = () => V(2 * Math.cos(th()), 2 * Math.sin(th()));
  const A = V(4, 0);

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    // 原圆
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(V(m.px(2 * Math.cos(a1)), m.py(2 * Math.sin(a1))),
        V(m.px(2 * Math.cos(a2)), m.py(2 * Math.sin(a2))),
        { stroke: '#ffd166', 'stroke-width': 2.2, 'stroke-opacity': .9 });
    }
    // 轨迹圆：圆心 (2,0)、半径 1
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(V(m.px(2 + Math.cos(a1)), m.py(Math.sin(a1))),
        V(m.px(2 + Math.cos(a2)), m.py(Math.sin(a2))),
        { stroke: '#7ee787', 'stroke-width': 2.2, 'stroke-opacity': .9, 'stroke-dasharray': '7 5' });
    }
    const Pw = P(), Pp = V(m.px(Pw.x), m.py(Pw.y));
    const Ap = V(m.px(A.x), m.py(A.y));
    const Mw = V((Pw.x + A.x) / 2, (Pw.y + A.y) / 2);
    const Mp = V(m.px(Mw.x), m.py(Mw.y));
    B.seg(Ap, Pp, { stroke: '#8fa3bd', 'stroke-width': 1.8, 'stroke-opacity': .9 });
    B.dot(Ap, 4.5, { fill: '#5cadff' });
    B.text(V(Ap.x + 9, Ap.y + 18), 'A', { 'font-size': 13, 'font-weight': 700, fill: '#5cadff' });
    B.dot(Pp, 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(Pp.x + 10, Pp.y - 12), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });
    B.dot(Mp, 5, { fill: '#7ee787', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(Mp.x + 10, Mp.y + 16), 'M', { 'font-size': 13, 'font-weight': 700, fill: '#7ee787' });
    B.dot(V(m.px(2), m.py(0)), 3.5, { fill: '#7ee787', 'fill-opacity': .5 });
    B.text(V(m.px(2) + 8, m.py(0) + 18), 'C', { 'font-size': 12, 'font-weight': 700, fill: '#7ee787' });

    cE(`$P(${fz(Pw.x)},\\ ${fz(Pw.y)})$，$P$ 在 $x^2+y^2=4$ 上，$\\theta=${fmt(st.deg, 0)}^\\circ$`);
    cM(`$M\\left(\\dfrac{${fz(Pw.x)}+4}{2},\\ \\dfrac{${fz(Pw.y)}+0}{2}\\right)=(${fz(Mw.x)},\\ ${fz(Mw.y)})$`);
    cL('$x=2+\\cos\\theta,\\ y=\\sin\\theta\\ \\Longrightarrow\\ (x-2)^2+y^2=1$');
    cJ(st.deg === 0 ? 'θ=0：P=(2,0)，M 在 (3,0)——轨迹圆的最右点'
      : st.deg === 180 ? 'θ=180°：P=(−2,0)，M 在 (1,0)——轨迹圆的最左点'
        : 'M 是 AP 的中点，A 不动；M 随 P 作圆周运动，圆心是 OA 的中点、半径是原圆的一半');
  };

  const PRE = [{ nm: '① θ=0', deg: 0 }, { nm: '② θ=90°', deg: 90 }, { nm: '③ θ=180°', deg: 180 }];
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    st.deg = o.deg;
    sA.sync(st.deg);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const sA = B.slider('θ (°)', 0, 360, 5, st.deg, v => { st.deg = v; B.render(); }, 'glc');

  B.handle({
    color: '#ffd166', r: 7,
    get: () => { const p = P(); return V(m.px(p.x), m.py(p.y)); },
    set: p => {
      const dx = (p.x - m.px(0)) / m.s, dy = (m.py(0) - p.y) / m.s;
      let d = Math.atan2(dy, dx) * 180 / Math.PI;
      if (d < 0) d += 360;
      st.deg = Math.round(d) % 360;
      sA.sync(st.deg);
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动 P：M 恒为 AP 的中点，绿色虚线是 M 走出的整条轨迹');
  B.render();
  return B;
}
