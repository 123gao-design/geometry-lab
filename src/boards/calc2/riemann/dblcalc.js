/* 图 重2 · 二重积分的计算机
   区域 D 由 y=x² 与 y=2−x² 围成，被积函数 f=x²+y。
   ① 先对 y 后对 x：竖条从下边界扫到上边界，内层积分只含 x；
   ② 先对 x 后对 y：横条在 y=1 处换一次宽度，同一个区域要拆成两块。
   拖动条的位置，徽章读该条上的内层积分，右侧徽章给出两层积分合起来的结果。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const F = (x, y) => x * x + y;
const BOT = x => x * x, TOP = x => 2 - x * x;
const TOTAL = 3.2;

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { m: 0, s: 0.45 };
  const cIn = B.chipM('内层积分'), cOut = B.chipM('两层合计'), cJ = B.chipM('判读');
  const m = B.isoFit(-1.32, 1.32, -0.35, 2.35, [40, 24, 520, 342], 20);

  const Aof = x => 2 - 2 * x ** 4;                              // ∫_{x²}^{2−x²} (x²+y) dy
  const Bof = y => { const a = Math.sqrt(y < 1 ? y : 2 - y); return 2 * a ** 3 / 3 + 2 * a * y; };

  B.renderFn = () => {
    B.grid({ ...m, sx: 0.5, sy: 0.5, lx: 0.5, ly: 0.5, axLab: 'x', ayLab: 'y' });

    // 区域
    const poly = [];
    for (let i = 0; i <= 80; i++) { const x = -1 + 2 * i / 80; poly.push(V(m.px(x), m.py(BOT(x)))); }
    for (let i = 80; i >= 0; i--) { const x = -1 + 2 * i / 80; poly.push(V(m.px(x), m.py(TOP(x)))); }
    B.dyn.appendChild(mkPoly(poly, '#5cadff'));
    B.plot(BOT, m, { stroke: '#5cadff', 'stroke-width': 2, x0: -1.02, x1: 1.02 });
    B.plot(TOP, m, { stroke: '#5cadff', 'stroke-width': 2, x0: -1.02, x1: 1.02 });
    B.tex(V(m.px(0), m.py(1) + 4), '$D$', { size: 14, color: '#5cadff', w: 26, anchor: 'mid' });

    if (st.m === 0) {
      const x0 = st.s;
      B.seg(V(m.px(x0), m.py(BOT(x0))), V(m.px(x0), m.py(TOP(x0))), { stroke: '#ffd166', 'stroke-width': 2.6 });
      B.dot(V(m.px(x0), m.py(BOT(x0))), 4, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.1 });
      B.dot(V(m.px(x0), m.py(TOP(x0))), 4, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.1 });
      B.tex(V(m.px(x0) + 8, m.py(1) + 26), `$x=${fmt(x0, 2)}$`, { size: 11.5, color: '#ffd166', w: 86 });
      cIn(`$\\int_{${fmt(BOT(x0), 2)}}^{${fmt(TOP(x0), 2)}}(x^2+y)\\,dy=${fmt(Aof(x0), 3)}$`);
      cOut(`$\\int_{-1}^{1}A(x)\\,dx=${fmt(TOTAL, 2)}$`);
      cJ('竖条只碰到上下两条边界，内层积分一次写完；它的值随 x 变化，外层再对 x 积一遍', 'ok');
    } else {
      const y0 = st.s;
      const a = Math.sqrt(y0 < 1 ? y0 : 2 - y0);
      B.seg(V(m.px(-a), m.py(y0)), V(m.px(a), m.py(y0)), { stroke: '#ffd166', 'stroke-width': 2.6 });
      B.dot(V(m.px(-a), m.py(y0)), 4, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.1 });
      B.dot(V(m.px(a), m.py(y0)), 4, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.1 });
      B.seg(V(m.px(m.X0), m.py(1)), V(m.px(m.X1), m.py(1)), { stroke: '#c084fc', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .8 });
      B.tex(V(m.px(m.X0) + 8, m.py(1) - 8), '$y=1$：横条在这里换宽度', { size: 11.5, color: '#c084fc', w: 210 });
      cIn(`$\\int_{${fmt(-a, 2)}}^{${fmt(a, 2)}}(x^2+y)\\,dx=${fmt(Bof(y0), 3)}$`);
      cOut(`$\\int_{0}^{2}B(y)\\,dy=${fmt(TOTAL, 2)}$`);
      cJ('横条的上端在 y=1 处由抛物线换成另一支，整个区域要拆成 0≤y≤1 与 1≤y≤2 两块', 'warn');
    }
  };

  const bts = ['① 先 $y$ 后 $x$', '② 先 $x$ 后 $y$'].map((lab, i) => B.btnM(lab, () => {
    st.m = i; bts.forEach((b, j) => b.classList.toggle('on', j === i));
    st.s = i === 0 ? 0.45 : 0.5;
    if (slp) { slp.min = i === 0 ? -0.9 : 0.1; slp.max = i === 0 ? 0.9 : 1.9; slp.sync(st.s); }
    B.render();
  }, { on: i === 0 }));
  const slp = B.slider('条的位置', -0.9, 0.9, 0.01, st.s, v => { st.s = v; B.render(); }, 's');
  B.hintM('拖条的位置：竖条的两端由 $y=x^2$ 与 $y=2-x^2$ 给出；换成横条后，$y=1$ 以上的那一半换了一对边界');
  B.render();
  return B;
}

/* 区域填充：直接拼多边形（与画板同一套像素坐标） */
function mkPoly(pts, fill) {
  return mk('polygon', {
    points: pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
    fill, 'fill-opacity': .14, stroke: 'none',
  }, null);
}
