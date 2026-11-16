/* 图 微3b · 隐函数求导机
   曲线由 F(x,y)=0 给出（两个预设都是圆），P 沿曲线走：蓝箭头是 F 的梯度（曲线的法向），
   橙线是曲线在 P 处的切线，斜率 dy/dx=−F_x/F_y。
   ② 是过原点的圆，走到 x 轴上时 F_y=0，切线竖直，y 在这一点附近写不成 x 的函数。 */
import { Board, V, fmt } from '../../../lib/board.js';

const P = [
  { n: '① $x^2+y^2=4$', cx: 0, cy: 0, r: 2, xr: [-2.8, 2.8], yr: [-2.4, 2.4] },
  { n: '② $(x-1)^2+y^2=1$', cx: 1, cy: 0, r: 1, xr: [-1.2, 3.2], yr: [-2.0, 2.0] },
];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, th: 55 };
  const cFx = B.chipM('$F_x$'), cFy = B.chipM('$F_y$'), cK = B.chipM('$dy/dx$'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const S = P[st.k];
    const m = B.isoFit(S.xr[0], S.xr[1], S.yr[0], S.yr[1], [40, 24, 500, 348], 20);
    B.grid({ ...m, sx: 0.5, sy: 0.5, lx: 1, ly: 1 });

    // 曲线与 P
    const th = st.th * Math.PI / 180;
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const a = i / 120 * Math.PI * 2;
      pts.push(V(m.px(S.cx + S.r * Math.cos(a)), m.py(S.cy + S.r * Math.sin(a))));
    }
    for (let i = 1; i < pts.length; i++) B.seg(pts[i - 1], pts[i], { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });

    const x0 = S.cx + S.r * Math.cos(th), y0 = S.cy + S.r * Math.sin(th);
    const p0 = V(m.px(x0), m.py(y0));
    B.dot(p0, 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });

    // F 的梯度（法向）与切线
    const Fx = 2 * (x0 - S.cx), Fy = 2 * y0;
    const nl = Math.hypot(Fx, Fy) || 1;
    B.arrow(p0, V(m.px(x0 + Fx / nl * 0.55), m.py(y0 + Fy / nl * 0.55)), { stroke: '#5cadff', 'stroke-width': 2.2 });
    const tx = -Fy, ty = Fx, tl = Math.hypot(tx, ty) || 1;
    B.seg(V(m.px(x0 - tx / tl * 1.5), m.py(y0 - ty / tl * 1.5)), V(m.px(x0 + tx / tl * 1.5), m.py(y0 + ty / tl * 1.5)),
      { stroke: '#4ade80', 'stroke-width': 2, 'stroke-opacity': .9 });
    B.tex(V(m.px(x0) + 10, m.py(y0) - 14), '$P$', { size: 12, color: '#ff9e4a', w: 24 });

    const fail = Math.abs(Fy) < 0.08;
    const k = fail ? null : -Fx / Fy;
    cFx(`$${fmt(Fx, 2)}$`);
    cFy(`$${fmt(Fy, 2)}$`);
    cK(fail ? '$\\infty$' : `$${fmt(k, 3)}$`);
    cJ(fail ? '此时 $F_y=0$，切线竖直：$y$ 写不成 $x$ 的函数，隐函数定理在这一条上暂时失效'
      : '此时 $F_y\\ne0$，曲线在这一段上可以写成 $y=y(x)$，斜率就是 $-F_x/F_y$', fail ? 'warn' : 'ok');
  };

  const bts = P.map((S, i) => B.btnM(S.n, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('P 的极角', 0, 360, 5, st.th, v => { st.th = v; B.render(); }, 'th');
  B.hintM('拖极角绕圆走：蓝箭头始终垂直于切线，它的斜率倒数取负号就是 $dy/dx$；② 走到 $x$ 轴上时切线竖直');
  B.render();
  return B;
}
