/* 图 圆2 · 直线与圆的位置关系
   圆 x²+y²=r² 与直线 y=kx+b。圆心到直线的距离 d=|b|/√(1+k²)，与半径 r 比较：
   d<r 相交（弦长 2√(r²−d²)）、d=r 相切、d>r 相离。
   相交时画出垂足、垂线段与整条弦；相切时标出切点。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { k: 0.5, b: 0.5, r: 2, grid: true, labs: true };
  const m = B.isoFit(-3.8, 3.8, -3.3, 3.3, [44, 30, 760, 390], 10);
  const cL = B.chipM('直线方程'), cD = B.chipM('圆心到直线距离'), cR = B.chipM('位置关系'), cC = B.chipM('弦长与切点');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const dist = () => Math.abs(st.b) / Math.sqrt(1 + st.k * st.k);
  const eq = () => `$y=${fz(st.k)}x${Math.abs(st.b) < 5e-3 ? '' : (st.b > 0 ? '+' : '-') + fz(Math.abs(st.b))}$`;

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(V(m.px(st.r * Math.cos(a1)), m.py(st.r * Math.sin(a1))),
        V(m.px(st.r * Math.cos(a2)), m.py(st.r * Math.sin(a2))),
        { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    }
    const x0 = m.X0 - 1, x1 = m.X1 + 1;
    B.seg(V(m.px(x0), m.py(st.k * x0 + st.b)), V(m.px(x1), m.py(st.k * x1 + st.b)),
      { stroke: '#7ee787', 'stroke-width': 2.3, 'stroke-opacity': .95 });

    const d = dist(), r = st.r;
    const den = 1 + st.k * st.k;
    const F = V(-st.b * st.k / den, st.b / den);
    const Fp = V(m.px(F.x), m.py(F.y));
    B.seg(V(m.px(0), m.py(0)), Fp, { stroke: '#5cadff', 'stroke-width': 1.7, 'stroke-dasharray': '5 4', 'stroke-opacity': .9 });
    B.dot(Fp, 4, { fill: '#5cadff' });
    B.text(V(Fp.x + 8, Fp.y + 16), 'H', { 'font-size': 12, 'font-weight': 700, fill: '#5cadff' });

    if (d < r - 1e-6) {
      const half = Math.sqrt(Math.max(0, r * r - d * d));
      const ux = 1 / Math.sqrt(den), uy = st.k / Math.sqrt(den);
      const A = V(F.x + half * ux, F.y + half * uy), Bp = V(F.x - half * ux, F.y - half * uy);
      B.seg(V(m.px(A.x), m.py(A.y)), V(m.px(Bp.x), m.py(Bp.y)), { stroke: '#ff9e4a', 'stroke-width': 3.4, 'stroke-opacity': .95 });
      B.dot(V(m.px(A.x), m.py(A.y)), 4, { fill: '#ff9e4a' });
      B.dot(V(m.px(Bp.x), m.py(Bp.y)), 4, { fill: '#ff9e4a' });
      cC(`弦长 $=2\\sqrt{r^2-d^2}=2\\sqrt{${fz(r * r)}-${fz(d * d)}}=${fz(2 * half)}$`);
    } else if (Math.abs(d - r) <= 1e-6) {
      B.dot(Fp, 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.1 });
      cC(`切点 $H(${fz(F.x)},\\ ${fz(F.y)})$`);
    } else {
      cC('直线与圆没有公共点');
    }

    cL(eq());
    cD(`$d=\\dfrac{|b|}{\\sqrt{1+k^2}}=\\dfrac{${fz(Math.abs(st.b))}}{\\sqrt{1+${fz(st.k * st.k)}}}=${fz(d)}$，$r=${fz(r)}$`);
    const rel = d < r - 1e-6 ? '相交' : Math.abs(d - r) <= 1e-6 ? '相切' : '相离';
    cR(rel);
  };

  const PRE = [
    { nm: '① 相交', v: [0.5, 0.5, 2] },
    { nm: '② 相切', v: [0, 2, 2] },
    { nm: '③ 相离', v: [0, 3, 2] },
  ];
  let sK, sB, sR;
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.k, st.b, st.r] = o.v;
    sK.sync(st.k); sB.sync(st.b); sR.sync(st.r);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  sK = B.slider('斜率 k', -2, 2, 0.1, st.k, v => { st.k = v; B.render(); }, 'lck');
  sB = B.slider('截距 b', -3, 3, 0.1, st.b, v => { st.b = v; B.render(); }, 'lcb');
  sR = B.slider('半径 r', 1, 3, 0.1, st.r, v => { st.r = v; B.render(); }, 'lcr');

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖 k、b 平移或转动直线：d 与 r 的大小关系决定相交、相切、相离；相交时橙色段是整条弦');
  B.render();
  return B;
}
