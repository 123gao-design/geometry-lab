/* 图 6 · 极点极线全景实验台：内、上、外三区域与切点弦 */
import { Board, mk, V, polarLine, lineFromEq, lineConic, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 800, 540);
  const st = { P: V(620, 150), curv: 'ellipse' };
  const E = () => st.curv === 'circle' ? { cx: 400, cy: 270, a: 135, b: 135 } : { cx: 400, cy: 270, a: 170, b: 115 };
  B.handle({ get: () => st.P, set: p => { st.P = p; }, color: '#fff', r: 8, label: 'P', lo: [11, -12] });
  B.btn('切换：椭圆 / 圆', () => { st.curv = st.curv === 'circle' ? 'ellipse' : 'circle'; B.render(); });
  const chip1 = B.chip('P 的位置'), chip2 = B.chip('极线方程（局部坐标）'), chip3 = B.chip('切点数');
  B.renderFn = () => {
    const C = E(), L = polarLine(C, st.P);
    mk(st.curv === 'circle' ? 'circle' : 'ellipse',
       { cx: C.cx, cy: C.cy, ...(st.curv === 'circle' ? { r: C.a } : { rx: C.a, ry: C.b }),
         fill: 'rgba(92,173,255,.05)', stroke: '#3f5f8f', 'stroke-width': 2 }, B.dyn);
    // 极线
    const [a, b] = lineFromEq(L.A, L.B, L.D);
    B.inf(a, b, { stroke: '#5cadff', 'stroke-width': 2.8 });
    // 切点：极线与曲线的交点
    const tan = lineConic(C, a, b);
    const px = st.P.x - C.cx, py = st.P.y - C.cy;
    chip2(`x′·(${fmt(px, 0)})/a² + y′·(${fmt(py, 0)})/b² = 1`, 'ok');
    if (tan && Math.abs(tan[0].x - tan[1].x) + Math.abs(tan[0].y - tan[1].y) > 4) { // 两个不同切点
      const [T1, T2] = tan;
      B.seg(st.P, T1, { stroke: '#ffd166', 'stroke-width': 1.6 }); B.seg(st.P, T2, { stroke: '#ffd166', 'stroke-width': 1.6 });
      B.dot(T1, 5.5, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 }); B.dot(T2, 5.5, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 2 });
      B.text(V(T1.x, T1.y - 11), 'T₁', { fill: '#ffd166', 'font-size': 11.5, 'font-weight': 700 });
      B.text(V(T2.x, T2.y - 11), 'T₂', { fill: '#ffd166', 'font-size': 11.5, 'font-weight': 700 });
      B.text(V((T1.x + T2.x) / 2, (T1.y + T2.y) / 2 + 16), '极线 = 切点弦 T₁T₂', { fill: '#5cadff', 'font-size': 12 });
      chip1('曲线外', 'ok'); chip3('2 条实切线 —— 极线就是切点弦', 'ok');
      B.hint('极线 = 切点弦 T₁T₂：这是极点极线最常见的应用形式');
    } else if (tan) { // 一个交点（P 在曲线上）
      chip1('曲线上', 'warn'); chip3('切线 1 条 —— 极线退化为该点切线', 'warn');
      B.hint('P 恰好落在曲线上：极线就是 P 处的切线');
    } else { // 无实切点
      chip1('曲线内', ''); chip3('0 条实切线（虚切线）—— 但极线依然真实', 'warn');
      B.hint('过 P 的切线不存在（判别式 < 0），但极线照常存在：调和定义不需要切线');
    }
    if (Math.hypot(px, py) < 40) B.hint('P 越接近中心，极线逃得越远 —— 中心的极线是无穷远直线');
  };
  B.render();
  return B;
}
