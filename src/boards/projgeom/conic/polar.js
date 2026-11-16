import { Board, V } from '../../../lib/board.js';

/* 配极机：单位圆给每一点 P 配一条极线 p: ax+by=1。
   点在圆外时，极线就是两条切线的切点连线；点在圆内时极线跑到圆外，切线变为虚的。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { a: 1.6, b: 1.1 };
  const cP = B.chipM('极点 $P$');
  const cL = B.chipM('极线 $p$');
  const cS = B.chipM('位置');

  B.renderFn = () => {
    const a = st.a, b = st.b, r2 = a * a + b * b;
    const m = B.isoFit(-2.6, 2.6, -1.9, 1.9, [160, 46, 500, 350], 0);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, labs: false });
    B.dot(V(m.px(0), m.py(0)), 4, { fill: '#8fa3bd' });
    B.dot(V(m.px(0), m.py(0)), m.s, { fill: 'none', stroke: '#67e8f9', 'stroke-width': 2 });
    B.text(V(m.px(0) + 8, m.py(1) - 6), '单位圆', { 'font-size': 12, fill: '#67e8f9', 'text-anchor': 'start' });
    const P = V(m.px(a), m.py(b));
    B.dot(P, 6.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.textM(V(P.x + 10, P.y - 9), `$P=(${a.toFixed(2)},\\ ${b.toFixed(2)})$`, { 'font-size': 12, fill: '#ff9e4a', 'text-anchor': 'start' });
    // 极线 ax+by=1：过 q=(a,b)/r2，方向 (-b,a)
    const q = V(a / r2, b / r2), d = V(-b, a);
    B.seg(V(m.px(q.x - 4 * d.x), m.py(q.y - 4 * d.y)), V(m.px(q.x + 4 * d.x), m.py(q.y + 4 * d.y)),
      { stroke: '#ffd166', 'stroke-width': 2 });
    B.textM(V(m.px(q.x + 2.0 * d.x), m.py(q.y + 2.0 * d.y)), '$p$', { 'font-size': 14, fill: '#ffd166', 'text-anchor': 'start' });
    if (r2 > 1.0001) {
      const qn = Math.hypot(q.x, q.y), h = Math.sqrt(Math.max(0, 1 - qn * qn));
      const ux = -q.y / qn, uy = q.x / qn;
      for (const s of [-1, 1]) {
        const T = V(q.x + s * h * ux, q.y + s * h * uy);
        B.seg(P, V(m.px(T.x), m.py(T.y)), { stroke: 'rgba(192,132,252,.85)', 'stroke-width': 1.4, 'stroke-dasharray': '6 4' });
        B.dot(V(m.px(T.x), m.py(T.y)), 4.5, { fill: '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.2 });
      }
    }
    const pos = r2 > 1.0001 ? '圆外：极线与圆相交' : r2 < .9999 ? '圆内：极线与圆相离' : '圆上：极线是切线';
    B.tex(V(410, 418), `极线方程 $${a.toFixed(2)}x+${b.toFixed(2)}y=1$`, { size: 14, anchor: 'mid', w: 380 });
    cP(`$(${a.toFixed(2)},\\ ${b.toFixed(2)})$`);
    cL('$ax+by=1$');
    cS(pos);
  };

  B.slider('P 的 x 坐标', -2, 2, .1, st.a, v => { st.a = v; B.render(); });
  B.slider('P 的 y 坐标', -2, 2, .1, st.b, v => { st.b = v; B.render(); });
  B.hintM('P 在圆外时，极线穿过两条切线的切点；P 移到圆上，极线就成了切线');
  B.render();
  return B;
}
