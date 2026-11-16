/* 图 复1 · 复平面与共轭
   复数 z=a+bi 与复平面上的点 Z(a,b) 一一对应，也对应向量 OZ。
   a 是横坐标（实部），b 是纵坐标（虚部），|z| 是原点到 Z 的距离；
   把 b 换成 −b 得到共轭复数，对应点关于实轴镜像。
   拖动 Z：坐标、模与共轭同步改写，落在两轴上的情形各自成判读。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { a: 3, b: 2, grid: true, labs: true };
  const PRE = [
    { nm: '① 一般复数', a: 3, b: 2 },
    { nm: '② 纯虚数', a: 0, b: 2.5 },
    { nm: '③ 实数', a: -3.5, b: 0 },
    { nm: '④ 零', a: 0, b: 0 },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cZ = B.chipM('复数'), cM = B.chipM('模'), cC = B.chipM('共轭'), cJ = B.chipM('判读');

  const zt = (a, b) => Math.abs(b) < 1e-9 ? fmt(a, 1)
    : `${fmt(a, 1)}${b < 0 ? '-' : '+'}${fmt(Math.abs(b), 1)}\\mathrm{i}`;

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'Re', ayLab: 'Im', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const Z = V(m.px(st.a), m.py(st.b));
    const Zc = V(m.px(st.a), m.py(-st.b));
    const r = Math.hypot(st.a, st.b);

    // 实轴上的共轭镜像虚线
    if (st.b !== 0) {
      B.seg(Z, Zc, { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .8 });
    }
    // 到两轴的投影
    B.seg(Z, V(m.px(st.a), m.py(0)), { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .7 });
    B.seg(Z, V(m.px(0), m.py(st.b)), { stroke: '#8fa3bd', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .7 });
    // 向量 OZ 与模
    if (r > 1e-9) B.arrow(O, Z, { stroke: '#ffd166', 'stroke-width': 2.6, head: 13, wide: 6 });
    // 共轭点与向量
    if (st.b !== 0) {
      B.arrow(O, Zc, { stroke: '#c084fc', 'stroke-width': 2, head: 11, wide: 5, 'stroke-opacity': .9 });
      B.dot(Zc, 4.2, { fill: '#c084fc' });
      B.text(V(Zc.x + 10, Zc.y + 16), 'z̄', { 'font-size': 13, fill: '#c084fc' });
    }
    B.dot(Z, 4.6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(Z.x + 10, Z.y - 12), 'Z', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });
    B.dot(O, 3.2, { fill: '#e8eefc' });

    // 徽章
    cZ(`$z=${zt(st.a, st.b)}$`);
    cM(`$|z|=\\sqrt{${fmt(st.a * st.a, 2)}+${fmt(st.b * st.b, 2)}}=${fmt(r, 2)}$`);
    cC(`$\\bar z=${zt(st.a, -st.b)}$`);
    cJ(st.a === 0 && st.b === 0 ? '原点：z=0，实部与虚部都是 0，方向没有意义'
      : st.a === 0 ? '实部为 0：纯虚数，点落在虚轴上'
        : st.b === 0 ? '虚部为 0：实数，点落在实轴上，与自身的共轭重合'
          : '实部、虚部都不为 0：一般复数，共轭点关于实轴上下对称');
  };

  const cl = v => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
  B.handle({
    color: '#ffd166', r: 7,
    get: () => V(m.px(st.a), m.py(st.b)),
    set: p => { st.a = cl((p.x - m.px(0)) / m.s); st.b = cl((m.py(0) - p.y) / m.s); },
  });

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.a = p.a; st.b = p.b;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动复平面上的点 Z：实部、虚部、模与共轭一起改，紫色一点是共轭复数');
  B.render();
  return B;
}
