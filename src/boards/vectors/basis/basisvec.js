/* 图 基1 · 平面向量基本定理机
   平面内取两个不共线的向量 e₁、e₂ 作基底，任一向量 p 都能唯一写成 p = x e₁ + y e₂。
   拖动三支箭头的终点：金色折线 O→x e₁→p 就是分解路径；把 e₂ 拖到 e₁ 的延长线上，分解立刻失效。
   局部坐标：x∈[−7.6,7.6]，y∈[−3.4,3.4]，原点在画框中心。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { e1x: 1, e1y: 0, e2x: 0, e2y: 1, px: 2, py: 1.5, grid: true, labs: true };
  const PRE = [
    { nm: '① 标准基底', e1: [1, 0], e2: [0, 1], p: [2, 1.5] },
    { nm: '② 斜基底', e1: [2.5, 0], e2: [0.8, 2.2], p: [2.2, 1.4] },
    { nm: '③ 共线基', e1: [2, 1], e2: [4, 2], p: [2, 1.4] },
    { nm: '④ 反向基', e1: [2, 1], e2: [-1, 2], p: [1.5, 2] },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cC = B.chipM('系数'), cD = B.chipM('分解'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const E1 = V(m.px(st.e1x), m.py(st.e1y));
    const E2 = V(m.px(st.e2x), m.py(st.e2y));
    const P = V(m.px(st.px), m.py(st.py));
    const det = st.e1x * st.e2y - st.e1y * st.e2x;
    const ok = Math.abs(det) > 0.12;
    let x = 0, y = 0;
    if (ok) {
      x = (st.px * st.e2y - st.py * st.e2x) / det;
      y = (st.e1x * st.py - st.e1y * st.px) / det;
    }
    // 基底
    B.arrow(O, E1, { stroke: '#5cadff', 'stroke-width': 2.2, head: 12, wide: 5.5 });
    B.arrow(O, E2, { stroke: '#ff9e4a', 'stroke-width': 2.2, head: 12, wide: 5.5 });
    B.tex(V(E1.x + 6, E1.y - 10), '$\\vec e_1$', { size: 13.5, anchor: 'start', color: '#5cadff', w: 50 });
    B.tex(V(E2.x + 6, E2.y - 10), '$\\vec e_2$', { size: 13.5, anchor: 'start', color: '#ff9e4a', w: 50 });
    // 分解折线
    if (ok) {
      const Q = V(m.px(x * st.e1x), m.py(x * st.e1y));          // 沿 e₁ 走 x 步
      const R = V(m.px(y * st.e2x), m.py(y * st.e2y));          // 沿 e₂ 走 y 步
      B.seg(O, Q, { stroke: '#ffd166', 'stroke-width': 1.3, 'stroke-dasharray': '5 4', 'stroke-opacity': .9 });
      B.seg(Q, P, { stroke: '#ffd166', 'stroke-width': 1.3, 'stroke-dasharray': '5 4', 'stroke-opacity': .9 });
      B.seg(O, R, { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '3 5', 'stroke-opacity': .45 });
      B.seg(R, P, { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '3 5', 'stroke-opacity': .45 });
      B.dot(Q, 4, { fill: '#ffd166' });
      B.dot(R, 4, { fill: '#ffd166' });
    }
    // 目标向量
    B.arrow(O, P, { stroke: '#4ade80', 'stroke-width': 2.4, head: 13, wide: 6 });
    B.tex(V(P.x + 7, P.y - 12), '$\\vec p$', { size: 14, anchor: 'start', color: '#4ade80', w: 30 });
    B.dot(O, 3.4, { fill: '#e8eefc' });

    // 徽章
    if (ok) {
      const t1 = `${x < 0 ? '-' : ''}${fmt(Math.abs(x), 2)}\\vec e_1`;
      const t2 = `${y < 0 ? '-' : '+'}${fmt(Math.abs(y), 2)}\\vec e_2`;
      cC(`$\\vec p=${t1}${t2}$`);
      cD(`$x=${fmt(x, 2)},\\quad y=${fmt(y, 2)}$`);
      cJ(Math.hypot(st.px, st.py) < 1e-9
        ? '零向量在任何基底下的坐标都是 (0, 0)，表示法仍然唯一'
        : '两基向量不共线，系数 (x, y) 是唯一的一对');
    } else {
      cC(`$\\vec e_1\\parallel\\vec e_2$`);
      cD('$x$、$y$ 解不出');
      cJ('两基向量共线，张成的只有一条直线，不能作基底');
    }
  };

  const cl = v => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
  const mkHandle = (color, get, set) => B.handle({ color, r: 7, get, set });
  mkHandle('#5cadff', () => V(m.px(st.e1x), m.py(st.e1y)),
    p => { st.e1x = cl((p.x - m.px(0)) / m.s); st.e1y = cl((m.py(0) - p.y) / m.s); });
  mkHandle('#ff9e4a', () => V(m.px(st.e2x), m.py(st.e2y)),
    p => { st.e2x = cl((p.x - m.px(0)) / m.s); st.e2y = cl((m.py(0) - p.y) / m.s); });
  mkHandle('#4ade80', () => V(m.px(st.px), m.py(st.py)),
    p => { st.px = cl((p.x - m.px(0)) / m.s); st.py = cl((m.py(0) - p.y) / m.s); });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    [st.e1x, st.e1y] = p.e1; [st.e2x, st.e2y] = p.e2; [st.px, st.py] = p.p;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动三支箭头的终点：金色折线给出 p 沿两条基向量的分解路径；两基共线时分解失效');
  B.render();
  return B;
}
