/* 图 直3 · 两条直线的位置关系
   两条直线 y=k₁x+b₁ 与 y=k₂x+b₂，四个滑块分别改斜率与截距。
   k₁=k₂ 时平行（b 也相等则重合），k₁k₂=−1 时垂直，其余情形相交。
   平行时读出两线间距离；相交时标出交点并给出夹角。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { k1: 1, b1: 1, k2: -1, b2: 2, grid: true, labs: true };
  const m = B.isoFit(-4.4, 4.4, -3.4, 3.4, [44, 30, 760, 395], 10);
  const cE = B.chipM('两直线方程'), cR = B.chipM('位置关系'), cP = B.chipM('交点'), cD = B.chipM('距离与夹角');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const eqStr = (k, b) => `$y=${fz(k)}x${Math.abs(b) < 5e-3 ? '' : (b > 0 ? '+' : '-') + fz(Math.abs(b))}$`;
  const parallel = () => Math.abs(st.k1 - st.k2) < 1e-9;
  const same = () => parallel() && Math.abs(st.b1 - st.b2) < 1e-9;
  const perp = () => Math.abs(st.k1 * st.k2 + 1) < 1e-9;

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const x0 = m.X0 - 1, x1 = m.X1 + 1;
    B.seg(V(m.px(x0), m.py(st.k1 * x0 + st.b1)), V(m.px(x1), m.py(st.k1 * x1 + st.b1)),
      { stroke: '#ffd166', 'stroke-width': 2.3, 'stroke-opacity': .95 });
    B.seg(V(m.px(x0), m.py(st.k2 * x0 + st.b2)), V(m.px(x1), m.py(st.k2 * x1 + st.b2)),
      { stroke: '#7ee787', 'stroke-width': 2.3, 'stroke-opacity': .95 });
    B.text(V(m.px(m.X1 - 0.35), m.py(st.k1 * (m.X1 - 0.35) + st.b1) - 10), 'l₁', { 'font-size': 12, 'font-weight': 700, fill: '#ffd166' });
    B.text(V(m.px(m.X1 - 0.35), m.py(st.k2 * (m.X1 - 0.35) + st.b2) - 10), 'l₂', { 'font-size': 12, 'font-weight': 700, fill: '#7ee787' });

    let rel = '相交';
    if (same()) rel = '重合';
    else if (parallel()) rel = '平行';
    else if (perp()) rel = '垂直';

    if (!parallel()) {
      const xi = (st.b2 - st.b1) / (st.k1 - st.k2);
      const yi = st.k1 * xi + st.b1;
      const Ip = V(m.px(xi), m.py(yi));
      B.dot(Ip, 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.seg(V(Ip.x, Ip.y), V(Ip.x, m.py(0)), { stroke: '#8fa3bd', 'stroke-width': 1.1, 'stroke-dasharray': '4 4', 'stroke-opacity': .8 });
      B.seg(V(Ip.x, Ip.y), V(m.px(0), Ip.y), { stroke: '#8fa3bd', 'stroke-width': 1.1, 'stroke-dasharray': '4 4', 'stroke-opacity': .8 });
      B.text(V(Ip.x + 9, Ip.y - 10), 'P', { 'font-size': 12, 'font-weight': 700, fill: '#ff9e4a' });
      if (perp()) {
        const u = 9;
        B.seg(V(Ip.x + u, Ip.y), V(Ip.x + u, Ip.y + u), { stroke: '#ff9e4a', 'stroke-width': 1.4 });
        B.seg(V(Ip.x + u, Ip.y + u), V(Ip.x, Ip.y + u), { stroke: '#ff9e4a', 'stroke-width': 1.4 });
      }
      const den = 1 + st.k1 * st.k2;
      const ang = Math.abs(den) < 1e-9 ? 90 : Math.atan(Math.abs((st.k2 - st.k1) / den)) * 180 / Math.PI;
      cD(`$\\theta=${fmt(ang, 2)}^\\circ$（夹角取锐角或直角）`);
      cP(`$P(${fz(xi)},\\ ${fz(yi)})$`);
    } else {
      cD(same() ? '两线处处重合，距离为 0' : `$d=\\dfrac{|b_1-b_2|}{\\sqrt{1+k^2}}=\\dfrac{${fz(Math.abs(st.b1 - st.b2))}}{\\sqrt{1+${fz(st.k1 * st.k1)}}}=${fz(Math.abs(st.b1 - st.b2) / Math.sqrt(1 + st.k1 * st.k1))}$`);
      cP('平行或重合时没有唯一交点');
    }

    cE(`${eqStr(st.k1, st.b1)}，${eqStr(st.k2, st.b2)}`);
    cR(rel);
  };

  const PRE = [
    { nm: '① 相交', v: [1, 1, -1, 2] },
    { nm: '② 平行', v: [1, 1, 1, -1] },
    { nm: '③ 垂直', v: [1, 0, -1, 1] },
    { nm: '④ 重合', v: [1, 1, 1, 1] },
  ];
  let sK1, sK2, sB1, sB2;
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.k1, st.b1, st.k2, st.b2] = o.v;
    sK1.sync(st.k1); sK2.sync(st.k2); sB1.sync(st.b1); sB2.sync(st.b2);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  sK1 = B.slider('k₁', -3, 3, 0.5, st.k1, v => { st.k1 = v; B.render(); }, 'k1');
  sB1 = B.slider('b₁', -3, 3, 0.5, st.b1, v => { st.b1 = v; B.render(); }, 'b1');
  sK2 = B.slider('k₂', -3, 3, 0.5, st.k2, v => { st.k2 = v; B.render(); }, 'k2');
  sB2 = B.slider('b₂', -3, 3, 0.5, st.b2, v => { st.b2 = v; B.render(); }, 'b2');

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动四个滑块：先看 k 判断平行或垂直，再看 b 判断相交还是重合');
  B.render();
  return B;
}
