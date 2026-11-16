import { Board, V, fmt } from '../../../lib/board.js';

/* 齐次坐标机：仿射点 P 的一组坐标 (x,y) 补上 z=1 成为 [x:y:1]，
   三个分量同乘 λ 表示同一点；z=0 时落不到仿射平面上，对应一个方向上的无穷远点。 */
export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { inf: false, a: 1.2, b: .9, lam: 1, th: 35 };
  const cH = B.chipM('齐次坐标');
  const cA = B.chipM('仿射坐标');
  const cZ = B.chipM('$z$');

  B.renderFn = () => {
    const m = B.isoFit(-3, 3, -2.4, 2.4, [70, 46, 480, 356], 0);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1 });
    B.tex(V(410, 26), st.inf ? '方向给一个无穷远点：$[\\cos\\theta:\\sin\\theta:0]$'
      : '仿射点补上 $z=1$，同乘 $\\lambda$ 仍是同一点', { size: 16, anchor: 'mid', w: 620 });
    if (!st.inf) {
      const a = st.a, b = st.b, P = V(m.px(a), m.py(b));
      B.seg(V(m.px(a), m.py(b)), V(m.px(a), m.py(0)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 5' });
      B.seg(V(m.px(a), m.py(b)), V(m.px(0), m.py(b)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 5' });
      B.dot(P, 6.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
      B.textM(V(P.x + 12, P.y - 10), `$P=(${fmt(a, 2)},\\ ${fmt(b, 2)})$`, { 'font-size': 13, fill: '#ff9e4a', 'text-anchor': 'start' });
      B.textM(V(410, 420), `$[${fmt(a, 2)}:${fmt(b, 2)}:1]\\sim[${fmt(a * st.lam, 2)}:${fmt(b * st.lam, 2)}:${fmt(st.lam, 2)}]$`, { 'font-size': 14, fill: '#8fa3bd' });
      cH(`$[${fmt(a, 2)}:${fmt(b, 2)}:1]$`);
      cA(`$(${fmt(a, 2)},\\ ${fmt(b, 2)})$`);
      cZ('$1$');
    } else {
      const th = st.th * Math.PI / 180, dx = Math.cos(th), dy = Math.sin(th), off = .8;
      if (Math.abs(dx) < 1e-6) {
        for (const s of [-1, 1]) B.seg(V(m.px(s * off), m.py(-2.4)), V(m.px(s * off), m.py(2.4)), { stroke: 'rgba(92,173,255,.75)', 'stroke-width': 1.6 });
        B.arrow(V(m.px(0), m.py(-1.2)), V(m.px(0), m.py(1.9)), { stroke: '#ff9e4a', 'stroke-width': 2 });
        B.textM(V(m.px(0) + 10, m.py(1.9) - 6), '$P_\\infty$', { 'font-size': 13, fill: '#ff9e4a', 'text-anchor': 'start' });
      } else {
        const k = dy / dx;
        for (const s of [-1, 1]) {
          B.seg(V(m.px(-3), m.py(s * off - 3 * k)), V(m.px(3), m.py(s * off + 3 * k)), { stroke: 'rgba(92,173,255,.75)', 'stroke-width': 1.6 });
        }
        const ax = dx > 0 ? 2.4 : -2.4;
        B.arrow(V(m.px(ax * .55), m.py(ax * .55 * k)), V(m.px(ax), m.py(ax * k)), { stroke: '#ff9e4a', 'stroke-width': 2 });
        B.textM(V(m.px(ax), m.py(ax * k) + (dy >= 0 ? -12 : 16)), '$P_\\infty$', { 'font-size': 13, fill: '#ff9e4a', 'text-anchor': 'mid' });
      }
      B.textM(V(410, 420), `$[\\cos ${st.th}^\\circ:\\sin ${st.th}^\\circ:0]$：两条平行线在这个方向上汇合`, { 'font-size': 14, fill: '#8fa3bd' });
      cH(`$[${fmt(dx, 2)}:${fmt(dy, 2)}:0]$`);
      cA('无');
      cZ('$0$');
    }
  };

  B.toggleBtn('落到无穷远', false, on => { st.inf = on; B.render(); });
  B.slider('x 坐标', -2.5, 2.5, .1, st.a, v => { st.a = v; B.render(); });
  B.slider('y 坐标', -2, 2, .1, st.b, v => { st.b = v; B.render(); });
  B.slider('缩放 λ', .5, 2, .1, st.lam, v => { st.lam = v; B.render(); });
  B.slider('方向 θ', 5, 175, 5, st.th, v => { st.th = v; B.render(); });
  B.hintM('齐次坐标只认比例：$[x:y:z]$ 与 $[\\lambda x:\\lambda y:\\lambda z]$ 是同一个点');
  B.render();
  return B;
}
