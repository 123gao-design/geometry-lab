import { Board, V, mk } from '../../../lib/board.js';

/* 二次曲线的射影分类：看它与无穷远线有几个实交点。
   0 个是椭圆，1 个（切点）是抛物线，2 个是双曲线。三种标准形并排切换，参数滑块改变开口大小。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { kind: 0, p: 1.4 };
  const cT = B.chipM('类型');
  const cI = B.chipM('无穷远交点');
  const cE = B.chipM('方程');

  B.renderFn = () => {
    const m = B.isoFit(-2.8, 2.8, -1.9, 1.9, [140, 46, 540, 350], 0);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1 });
    const A = st.p;
    B.tex(V(410, 28), ['椭圆：与无穷远线不相交', '双曲线：与无穷远线交于两点', '抛物线：与无穷远线相切'][st.kind], { size: 16, anchor: 'mid', w: 560 });
    if (st.kind === 0) {
      let d = '';
      for (let i = 0; i <= 120; i++) {
        const t = i / 120 * 2 * Math.PI;
        const x = A * Math.cos(t), y = 1.1 * Math.sin(t);
        d += (i ? 'L' : 'M') + m.px(x) + ' ' + m.py(y) + ' ';
      }
      mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    } else if (st.kind === 1) {
      for (const s of [-1, 1]) {
        let d = '';
        for (let i = 0; i <= 120; i++) {
          const y = -3 + i / 120 * 6;
          const x = s * A * Math.sqrt(1 + y * y);
          d += (i ? 'L' : 'M') + m.px(x) + ' ' + m.py(y) + ' ';
        }
        mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
      }
    } else {
      let d = '';
      for (let i = 0; i <= 120; i++) {
        const y = -3 + i / 120 * 6;
        const x = y * y / (2 * A);
        d += (i ? 'L' : 'M') + m.px(x) + ' ' + m.py(y) + ' ';
      }
      mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    }
    B.textM(V(410, 424), st.kind === 0 ? `$\\dfrac{x^2}{${A.toFixed(1)}^2}+\\dfrac{y^2}{1.1^2}=1$`
      : st.kind === 1 ? `$\\dfrac{x^2}{${A.toFixed(1)}^2}-\\dfrac{y^2}{1^2}=1$`
        : `$y^2=2\\cdot ${A.toFixed(1)}x$`, { 'font-size': 14, fill: '#8fa3bd' });
    cT(['椭圆', '双曲线', '抛物线'][st.kind]);
    cI(['$0$', '$2$', '$1$（切点）'][st.kind]);
    cE(st.kind === 2 ? '$y^2=2px$' : '$\\dfrac{x^2}{a^2}\\pm\\dfrac{y^2}{b^2}=1$');
  };

  B.btn('椭圆', () => { st.kind = 0; B.render(); });
  B.btn('双曲线', () => { st.kind = 1; B.render(); });
  B.btn('抛物线', () => { st.kind = 2; B.render(); });
  B.slider('开口参数', .8, 2.2, .1, st.p, v => { st.p = v; B.render(); });
  B.hintM('射影分类只看无穷远处：交 0 点、1 点（相切）还是 2 点');
  B.render();
  return B;
}
