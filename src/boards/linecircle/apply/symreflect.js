/* 图 综1a · 对称与折线最短
   x 轴上有动点 P，另有定点 A、B。A、B 在 x 轴同侧时，作 A 关于 x 轴的对称点 A′，
   折线 A→P→B 的长度 |PA|+|PB| 不小于 |A′B|，取等时 P 恰好是 A′B 与 x 轴的交点；
   A、B 分居两侧时不必作对称点，直接连 AB，|PA|+|PB| 不小于 |AB|。
   拖动 A、B 让 B 越过 x 轴，可以看到两种情形互相转化。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: 1, ay: 1.6, bx: 6.2, by: 2.2, px: 2.4, grid: true, labs: true };
  const m = B.isoFit(-0.8, 9.2, -2.7, 3.3, [44, 28, 760, 392], 10);
  const cD = B.chipM('两段距离'), cL = B.chipM('下界'), cR = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const P2 = (x, y) => V(m.px(x), m.py(y));

  const optX = () => {
    const same = st.ay * st.by > 0;
    if (same) return (st.ax * st.by + st.bx * st.ay) / (st.ay + st.by);
    return st.ax + (st.ay / (st.ay - st.by)) * (st.bx - st.ax);
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const Ax = P2(st.ax, st.ay), Bx = P2(st.bx, st.by), Px = P2(st.px, 0);
    const same = st.ay * st.by > 0;

    B.seg(Ax, Px, { stroke: '#ffd166', 'stroke-width': 2, 'stroke-opacity': .9 });
    B.seg(Px, Bx, { stroke: '#7ee787', 'stroke-width': 2, 'stroke-opacity': .9 });

    if (same) {
      const Ap = P2(st.ax, -st.ay);
      B.seg(Ax, Ap, { stroke: '#c084fc', 'stroke-width': 1.3, 'stroke-dasharray': '5 4', 'stroke-opacity': .8 });
      B.seg(Ap, Bx, { stroke: '#c084fc', 'stroke-width': 2, 'stroke-dasharray': '7 5', 'stroke-opacity': .95 });
      B.dot(Ap, 4.5, { fill: '#c084fc', stroke: '#0a0d14', 'stroke-width': 1 });
      B.text(V(Ap.x - 4, Ap.y + 18), 'A′', { 'font-size': 12.5, 'font-weight': 700, fill: '#c084fc' });
    } else {
      B.seg(Ax, Bx, { stroke: '#c084fc', 'stroke-width': 2, 'stroke-dasharray': '7 5', 'stroke-opacity': .95 });
    }

    const ox = optX();
    const O = P2(ox, 0);
    B.dot(O, 5.5, { fill: 'none', stroke: '#ff9e4a', 'stroke-width': 2 });
    B.dot(Px, 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1 });

    B.dot(Ax, 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1 });
    B.dot(Bx, 5, { fill: '#7ee787', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(Ax.x - 10, Ax.y - 10), 'A', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });
    B.text(V(Bx.x + 10, Bx.y - 10), 'B', { 'font-size': 13, 'font-weight': 700, fill: '#7ee787' });
    B.text(V(Px.x + 2, Px.y + 20), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ff9e4a' });

    const pa = Math.hypot(st.ax - st.px, st.ay), pb = Math.hypot(st.bx - st.px, st.by);
    const low = same
      ? Math.hypot(st.bx - st.ax, st.by + st.ay)
      : Math.hypot(st.bx - st.ax, st.by - st.ay);
    cD(`$|PA|+|PB|=${fz(pa)}+${fz(pb)}=${fz(pa + pb)}$`);
    cL(same ? `$|A'B|=${fz(low)}$` : `$|AB|=${fz(low)}$`);
    const gap = Math.abs(st.px - ox);
    if (gap < 0.06) cR(same ? 'P 落在 A′B 与 x 轴的交点，折线长度取到最小值' : 'P 落在 AB 与 x 轴的交点，折线长度取到最小值', 'ok');
    else if (same) cR(`A、B 同侧：作 A 的对称点 A′，把折线拉直；P 再向交点靠 ${fz(gap)}`, 'warn');
    else cR(`A、B 分居两侧：直接连 AB 即最短；P 再向交点靠 ${fz(gap)}`, 'warn');
  };

  const PRE = [
    { nm: '① 同侧', v: [1, 1.6, 6.2, 2.2, 2.4] },
    { nm: '② 异侧', v: [1, 1.7, 6.4, -1.5, 2.2] },
    { nm: '③ 等高', v: [1, 1.5, 6.2, 1.5, 5.2] },
  ];
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.ax, st.ay, st.bx, st.by, st.px] = o.v;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  const clampA = p => {
    const x = Math.max(m.X0 + .3, Math.min(m.X1 - .3, (p.x - m.px(0)) / m.s));
    let y = (m.py(0) - p.y) / m.s;
    y = Math.max(-2.2, Math.min(2.9, y));
    if (Math.abs(y) < .4) y = y >= 0 ? .4 : -.4;
    return V(x, y);
  };
  B.handle({
    color: '#ffd166', r: 7, label: 'A', lo: [-18, -8],
    get: () => P2(st.ax, st.ay),
    set: p => { const q = clampA(p); st.ax = q.x; st.ay = q.y; },
  });
  B.handle({
    color: '#7ee787', r: 7, label: 'B', lo: [10, -8],
    get: () => P2(st.bx, st.by),
    set: p => { const q = clampA(p); st.bx = q.x; st.by = q.y; },
  });
  B.handle({
    color: '#ff9e4a', r: 7, label: 'P', lo: [2, 18],
    get: () => P2(st.px, 0),
    set: p => { st.px = Math.max(m.X0 + .2, Math.min(m.X1 - .2, (p.x - m.px(0)) / m.s)); },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖 A、B 换位置，拖 P 在 x 轴上走：空心圈是长度取最小的位置');
  B.render();
  return B;
}
