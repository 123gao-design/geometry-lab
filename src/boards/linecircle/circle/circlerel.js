/* 图 圆3 · 圆与圆的位置关系
   圆 C₁ 固定以原点为心，半径 r₁；圆 C₂ 的圆心可拖动，半径 r₂。
   比较圆心距 d 与 r₁+r₂、|r₁−r₂|：外离、外切、相交、内切、内含。
   相交时标出两个交点与公共弦；外切、内切时标出唯一公共点。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { cx: 2, cy: 0, r1: 2, r2: 1.5, grid: true, labs: true };
  const m = B.isoFit(-4.8, 5, -3.8, 3.8, [44, 30, 760, 390], 10);
  const cE = B.chipM('两圆方程'), cD = B.chipM('圆心距与半径'), cR = B.chipM('位置关系'), cJ = B.chipM('交点与公共弦');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const dOf = () => Math.hypot(st.cx, st.cy);
  const relOf = () => {
    const d = dOf(), s = st.r1 + st.r2, t = Math.abs(st.r1 - st.r2);
    if (d < 1e-9 && Math.abs(st.r1 - st.r2) < 1e-9) return '重合';
    if (Math.abs(d - s) < 1e-6) return '外切';
    if (Math.abs(d - t) < 1e-6) return '内切';
    if (d > s) return '外离';
    if (d < t) return '内含';
    return '相交';
  };
  const circle = (cx, cy, r, color) => {
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(V(m.px(cx + r * Math.cos(a1)), m.py(cy + r * Math.sin(a1))),
        V(m.px(cx + r * Math.cos(a2)), m.py(cy + r * Math.sin(a2))),
        { stroke: color, 'stroke-width': 2.3, 'stroke-opacity': .95 });
    }
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    circle(0, 0, st.r1, '#ffd166');
    circle(st.cx, st.cy, st.r2, '#7ee787');
    const O1 = V(m.px(0), m.py(0)), O2 = V(m.px(st.cx), m.py(st.cy));
    B.dot(O1, 4.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1 });
    B.dot(O2, 4.5, { fill: '#7ee787', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(O1.x - 10, O1.y + 17), 'C₁', { 'font-size': 12.5, 'font-weight': 700, fill: '#ffd166' });
    B.text(V(O2.x + 9, O2.y - 10), 'C₂', { 'font-size': 12.5, 'font-weight': 700, fill: '#7ee787' });
    B.seg(O1, O2, { stroke: '#8fa3bd', 'stroke-width': 1.4, 'stroke-dasharray': '5 4', 'stroke-opacity': .85 });

    const d = dOf(), rel = relOf();
    if (rel === '相交' && d > 1e-9) {
      const a = (st.r1 * st.r1 - st.r2 * st.r2 + d * d) / (2 * d);
      const h = Math.sqrt(Math.max(0, st.r1 * st.r1 - a * a));
      const px = st.cx * a / d, py = st.cy * a / d;
      const ux = -st.cy / d, uy = st.cx / d;
      const P1 = V(px + h * ux, py + h * uy), P2 = V(px - h * ux, py - h * uy);
      B.seg(O1, V(m.px(P1.x), m.py(P1.y)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-opacity': .65 });
      B.seg(O2, V(m.px(P1.x), m.py(P1.y)), { stroke: '#7ee787', 'stroke-width': 1.2, 'stroke-opacity': .65 });
      B.seg(V(m.px(P1.x), m.py(P1.y)), V(m.px(P2.x), m.py(P2.y)), { stroke: '#ff9e4a', 'stroke-width': 3, 'stroke-opacity': .95 });
      B.dot(V(m.px(P1.x), m.py(P1.y)), 4.5, { fill: '#ff9e4a' });
      B.dot(V(m.px(P2.x), m.py(P2.y)), 4.5, { fill: '#ff9e4a' });
      cJ(`两交点 $(${fz(P1.x)},\\ ${fz(P1.y)})$、$(${fz(P2.x)},\\ ${fz(P2.y)})$，公共弦长 ${fz(2 * h)}`);
    } else if (rel === '外切' || rel === '内切') {
      const t = st.r1 / d;
      const X = V(st.cx * t, st.cy * t);
      B.dot(V(m.px(X.x), m.py(X.y)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.1 });
      cJ(`唯一公共点 $(${fz(X.x)},\\ ${fz(X.y)})$`);
    } else if (rel === '外离') {
      cJ(`两圆无公共点；圆心距比半径和多 ${fz(d - st.r1 - st.r2)}`);
    } else if (rel === '内含') {
      cJ(`小圆落在大圆内部，无公共点；圆心距比半径差少 ${fz(Math.abs(st.r1 - st.r2) - d)}`);
    } else {
      cJ('两圆重合，公共点无穷多');
    }

    cE(`$x^2+y^2=${fz(st.r1 * st.r1)}$，$(x${st.cx >= 0 ? '-' : '+'}${fz(Math.abs(st.cx))})^2+(y${st.cy >= 0 ? '-' : '+'}${fz(Math.abs(st.cy))})^2=${fz(st.r2 * st.r2)}$`);
    cD(`$d=|C_1C_2|=${fz(d)}$，$r_1+r_2=${fz(st.r1 + st.r2)}$，$|r_1-r_2|=${fz(Math.abs(st.r1 - st.r2))}$`);
    cR(rel);
  };

  const PRE = [
    { nm: '① 相交', v: [2, 0, 2, 1.5] },
    { nm: '② 外切', v: [3.5, 0, 2, 1.5] },
    { nm: '③ 内切', v: [0.5, 0, 2, 1.5] },
    { nm: '④ 外离', v: [4.5, 0, 2, 1.5] },
  ];
  let sR1, sR2;
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.cx, st.cy, st.r1, st.r2] = o.v;
    sR1.sync(st.r1); sR2.sync(st.r2);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.handle({
    color: '#7ee787', r: 7, label: 'C₂', lo: [9, -9],
    get: () => V(m.px(st.cx), m.py(st.cy)),
    set: p => {
      st.cx = Math.round((p.x - m.px(0)) / m.s * 2) / 2;
      st.cy = Math.round((m.py(0) - p.y) / m.s * 2) / 2;
    },
  });

  sR1 = B.slider('半径 r₁', 1, 3, 0.1, st.r1, v => { st.r1 = v; B.render(); }, 'r1');
  sR2 = B.slider('半径 r₂', 0.5, 3, 0.1, st.r2, v => { st.r2 = v; B.render(); }, 'r2');

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动 C₂ 或改半径：圆心距与 r₁+r₂、|r₁−r₂| 的大小关系决定五种位置');
  B.render();
  return B;
}
