import { Board, V, mk } from '../../../lib/board.js';

/* 透视机：变换 (x,y)↦(x,y)/(1+kx) 是射影变换的一种。
   网格线仍是直线；原来平行的横线一起挤向灭点 x=-1/k，矩形变成一般的四边形。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { k: .55 };
  const cK = B.chipM('透视强度 $k$');
  const cV = B.chipM('灭点');
  const cL = B.chipM('直线');

  B.renderFn = () => {
    const k = st.k;
    const m = B.isoFit(-2, 2.2, -1.1, 1.1, [150, 60, 540, 330], 0);
    const T = p => {
      const d = 1 + k * p.x;
      return V(p.x / d, p.y / d);
    };
    B.seg(V(m.px(m.X0), m.py(0)), V(m.px(m.X1), m.py(0)), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
    B.seg(V(m.px(0), m.py(m.Y0)), V(m.px(0), m.py(m.Y1)), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
    // 原网格（淡）
    for (let i = 0; i <= 6; i++) {
      const u = i / 6;
      B.seg(V(m.px(u), m.py(0)), V(m.px(u), m.py(1)), { stroke: 'rgba(143,163,189,.22)', 'stroke-width': 1 });
      B.seg(V(m.px(0), m.py(u)), V(m.px(1), m.py(u)), { stroke: 'rgba(143,163,189,.22)', 'stroke-width': 1 });
    }
    // 变换后的网格（橙）
    for (let i = 0; i <= 6; i++) {
      const u = i / 6;
      const a = T(V(u, 0)), b = T(V(u, 1));
      B.seg(V(m.px(a.x), m.py(a.y)), V(m.px(b.x), m.py(b.y)), { stroke: 'rgba(255,158,74,.55)', 'stroke-width': 1.1 });
      const c = T(V(0, u)), d = T(V(20, u));
      B.seg(V(m.px(c.x), m.py(c.y)), V(m.px(d.x), m.py(d.y)), { stroke: 'rgba(255,158,74,.55)', 'stroke-width': 1.1 });
    }
    // 单位正方形与它的像
    const q = [V(0, 0), V(.6, 0), V(.6, .6), V(0, .6)].map(T);
    mk('polygon', { points: q.map(p => `${m.px(p.x)},${m.py(p.y)}`).join(' '), fill: 'rgba(92,173,255,.16)', stroke: '#5cadff', 'stroke-width': 2 }, B.dyn);
    if (k > .02) {
      const vx = 1 / k;
      if (vx < m.X1) {
        B.dot(V(m.px(vx), m.py(0)), 5, { fill: '#ff7b8a', stroke: '#0a0d14', 'stroke-width': 1.3 });
        B.textM(V(m.px(vx) + 9, m.py(0) - 9), '$V$', { 'font-size': 13, fill: '#ff7b8a', 'text-anchor': 'start' });
      }
      cV(`$${vx.toFixed(2)}$`);
    } else {
      cV('远处');
    }
    B.tex(V(410, 28), '射影变换把直线映成直线，平行线不再平行', { size: 16, anchor: 'mid', w: 520 });
    B.textM(V(410, 424), '$x\\mapsto\\dfrac{x}{1+kx},\\quad y\\mapsto\\dfrac{y}{1+kx}$：分母在 $x=-1/k$ 处为零', { 'font-size': 13, fill: '#8fa3bd' });
    cK(`$${k.toFixed(2)}$`);
    cL('仍是直线');
  };

  B.slider('透视强度 k', 0, .8, .05, st.k, v => { st.k = v; B.render(); });
  B.hintM('射影变换保持共线：网格弯不了，只能整体透视');
  B.render();
  return B;
}
