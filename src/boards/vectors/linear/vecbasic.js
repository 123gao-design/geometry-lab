/* 图 向1 · 向量表示机
   向量是既有大小又有方向的量，用有向线段表示：起点、方向、长度三件齐备。
   拖动终点 P 同时改变方向与长度；绿色一支是把起点平移后得到的相等向量（同向、等长）。
   局部坐标：x∈[−7.6,7.6]，y∈[−3.4,3.4]，原点在画框中心。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { x: 3, y: 2, grid: true, labs: true };
  const PRE = [
    { nm: '① (3, 2)', x: 3, y: 2 },
    { nm: '② (0, 3)', x: 0, y: 3 },
    { nm: '③ (−2, −2)', x: -2, y: -2 },
    { nm: '④ 零向量', x: 0, y: 0 },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cV = B.chipM('坐标'), cM = B.chipM('模'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const x = st.x, y = st.y, L = Math.hypot(x, y);
    const O = V(m.px(0), m.py(0)), P = V(m.px(x), m.py(y));
    // 相等向量：整支平移到 a 的左侧法向一段距离，方向与长度不变，两端始终落在画框内
    if (L > 0.01) {
      const ux = -y / L, uy = x / L;                       // a 的左法向单位向量
      const qx = ux - x / 2, qy = uy - y / 2;
      const Q = V(m.px(qx), m.py(qy)), R = V(m.px(qx + x), m.py(qy + y));
      B.arrow(Q, R, { stroke: '#4ade80', 'stroke-width': 1.8, head: 10, wide: 5, 'stroke-dasharray': '6 4' });
      B.tex(V(m.px(ux), m.py(uy) - 13), '相等向量', { size: 11.5, anchor: 'mid', color: '#4ade80', w: 100 });
    }
    // 终点向两轴作投影，直读横纵坐标
    B.seg(V(P.x, P.y), V(P.x, O.y), { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '4 5', 'stroke-opacity': .7 });
    B.seg(V(P.x, P.y), V(O.x, P.y), { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '4 5', 'stroke-opacity': .7 });
    if (L > 0.01) {
      B.arrow(O, P, { stroke: '#5cadff', 'stroke-width': 2.4, head: 13, wide: 6 });
      B.tex(V((O.x + P.x) / 2 + 10, (O.y + P.y) / 2 - 14), '$\\vec a$', { size: 15, anchor: 'start', color: '#5cadff', w: 40 });
    } else B.dot(O, 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.dot(O, 3.4, { fill: '#e8eefc' });
    // 徽章
    cV(`$\\vec a=(${fmt(x, 1)},\\ ${fmt(y, 1)})$`);
    cM(`$|\\vec a|=\\sqrt{${fmt(x * x + y * y, 2)}}=${fmt(L, 2)}$`);
    cJ(L < 1e-9 ? '零向量：方向任意，模为 0'
      : Math.abs(L - 1) < 1e-9 ? '单位向量：模为 1'
        : x === 0 ? '与 $y$ 轴平行' : y === 0 ? '与 $x$ 轴平行'
          : '一般向量：方向由两个分量的正负定出');
  };

  const clamp = v => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
  B.handle({
    color: '#ffd166', r: 7,
    get: () => V(m.px(st.x), m.py(st.y)),
    set: p => { st.x = clamp((p.x - m.px(0)) / m.s); st.y = clamp((m.py(0) - p.y) / m.s); },
  });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.x = p.x; st.y = p.y;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动终点 P：方向与长度一起变化，绿色一支是平移后的相等向量');
  B.render();
  return B;
}
