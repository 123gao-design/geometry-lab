import { Board, V, mk } from '../../../lib/board.js';

/* 无穷远线位置机：同一条射影圆锥曲线，换一条无穷远线就换一种仿射类型。
   无穷远线与曲线不相交 → 椭圆；相切 → 抛物线；交于两点 → 双曲线。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { h: 1.35 };
  const cH = B.chipM('无穷远线 $y=h$');
  const cN = B.chipM('交点个数');
  const cT = B.chipM('仿射类型');

  B.renderFn = () => {
    const h = st.h;
    const m = B.isoFit(-2.4, 2.4, -1.5, 1.9, [150, 50, 520, 340], 0);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, labs: false });
    B.dot(V(m.px(0), m.py(0)), m.s, { fill: 'none', stroke: '#67e8f9', 'stroke-width': 2 });
    B.seg(V(m.px(-2.3), m.py(h)), V(m.px(2.3), m.py(h)), { stroke: '#ff7b8a', 'stroke-width': 2 });
    B.textM(V(m.px(2.3) - 6, m.py(h) - 10), '无穷远线', { 'font-size': 12, fill: '#ff7b8a', 'text-anchor': 'end' });
    let n = 0;
    if (Math.abs(h) < 1) {
      n = 2;
      const x = Math.sqrt(1 - h * h);
      B.dot(V(m.px(x), m.py(h)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
      B.dot(V(m.px(-x), m.py(h)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
    } else if (Math.abs(Math.abs(h) - 1) < .03) {
      n = 1;
      B.dot(V(m.px(0), m.py(h)), 6, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
    }
    B.tex(V(410, 28), '一条固定的射影圆锥曲线，换一条无穷远线', { size: 16, anchor: 'mid', w: 560 });
    B.textM(V(410, 426), '仿射几何 = 射影几何 + 一条选定的无穷远线', { 'font-size': 12, fill: '#8fa3bd' });
    cH(`$${h.toFixed(2)}$`);
    cN(`$${n}$`);
    cT(n === 2 ? '双曲线' : n === 1 ? '抛物线' : '椭圆');
  };

  B.slider('无穷远线高度 h', -1.4, 1.5, .05, st.h, v => { st.h = v; B.render(); });
  B.hintM('把无穷远线从曲线外移到曲线内：椭圆先变成抛物线，再变成双曲线');
  B.render();
  return B;
}
