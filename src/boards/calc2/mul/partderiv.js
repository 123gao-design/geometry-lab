/* 图 微2 · 偏导数与全微分机
   曲面 z=f(x,y) 上取一点 P₀(x₀,y₀)，过它作两张竖直截面 y=y₀ 与 x=x₀，
   截面曲线在 P₀ 处的切线斜率就是两个偏导数；两条切线张成的平面是切平面，
   全微分 dz=f_x·Δx+f_y·Δy 是切平面在 (Δx,Δy) 处的高度，紫点是真实曲面的高度，红线是两者的差。
   两个预设：① 抛物面（曲面在上方，切平面贴合）；② 鞍面（一条切线朝上、一条朝下）。 */
import { Board, V, fmt } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit } from '../../../lib/solid3d.js';

const P = [
  { n: '① $f=4-x^2-y^2$', f: (x, y) => 4 - x * x - y * y, fx: x => -2 * x, fy: y => -2 * y, cz: 1.5 },
  { n: '② $f=x^2-y^2$', f: (x, y) => x * x - y * y, fx: x => 2 * x, fy: y => -2 * y, cz: 0 },
];

const CAM0 = { yaw: 0.82, pitch: 0.30, s: 66, cx: 420, cy: 268, cz: 1.5 };

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, x0: 0.55, y0: 0.4, dx: 0.5, dy: 0.4 };
  const cam = makeCam({ ...CAM0 });
  const cFx = B.chipM('$f_x$'), cFy = B.chipM('$f_y$'), cDz = B.chipM('全微分 dz'), cAz = B.chipM('实际增量'), cEr = B.chipM('误差');

  const resetBtn = B.btn('重置视角', () => { Object.assign(cam, CAM0, { cz: P[st.k].cz }); B.render(); });
  orbit(B, cam, () => B.render());

  B.renderFn = () => {
    const S = P[st.k];
    const { x0, y0, dx, dy } = st;
    const cs = new Scene(B, cam);
    const f0 = S.f(x0, y0), fx0 = S.fx(x0), fy0 = S.fy(y0);

    // 曲面网格：两个方向的坐标曲线
    for (let i = 0; i <= 9; i++) {
      const y = -1.45 + 2.9 * i / 9;
      const px = [], py = [];
      for (let j = 0; j <= 28; j++) {
        const x = -1.45 + 2.9 * j / 28;
        px.push(v3(x, y, S.f(x, y)));
        py.push(v3(y, x, S.f(y, x)));
      }
      cs.path(px, { stroke: '#5cadff', w: 1.1, op: .34 });
      cs.path(py, { stroke: '#67e8f9', w: 1.1, op: .28 });
    }

    // 两张竖直截面上的曲线
    const cx = [], cy = [];
    for (let j = 0; j <= 40; j++) {
      const x = -1.45 + 2.9 * j / 40;
      cx.push(v3(x, y0, S.f(x, y0)));
      cy.push(v3(x0, x, S.f(x0, x)));
    }
    cs.path(cx, { stroke: '#4ade80', w: 2.4, op: .95 });
    cs.path(cy, { stroke: '#ff9e4a', w: 2.4, op: .95 });

    // 切平面多边形
    const T = (a, b) => v3(a, b, f0 + fx0 * (a - x0) + fy0 * (b - y0));
    cs.poly([T(x0 - .62, y0 - .62), T(x0 + .62, y0 - .62), T(x0 + .62, y0 + .62), T(x0 - .62, y0 + .62)],
      { fill: '#ffd166', op: .15, stroke: '#ffd166', w: 1.2, lineOp: .7 });

    // 两条切线（偏导数的几何意义）
    cs.line(v3(x0 - .62, y0, f0 - .62 * fx0), v3(x0 + .62, y0, f0 + .62 * fx0), { stroke: '#4ade80', w: 2, op: .95 });
    cs.line(v3(x0, y0 - .62, f0 - .62 * fy0), v3(x0, y0 + .62, f0 + .62 * fy0), { stroke: '#ff9e4a', w: 2, op: .95 });

    // 切点、切平面上的点、曲面上的点、误差线段
    cs.dot(v3(x0, y0, f0), 5.5, { fill: '#ffd166' });
    const xq = x0 + dx, yq = y0 + dy;
    const dz = fx0 * dx + fy0 * dy;
    const tq = v3(xq, yq, f0 + dz), q = v3(xq, yq, S.f(xq, yq));
    cs.dot(tq, 4.5, { fill: '#4ade80' });
    cs.dot(q, 4.5, { fill: '#c084fc' });
    cs.line(tq, q, { stroke: '#ff7b8a', w: 2, op: .95 });

    // 坐标轴
    cs.line(v3(-1.7, 0, 0), v3(1.85, 0, 0), { stroke: '#8fa3bd', w: 1.4, op: .8 });
    cs.line(v3(0, -1.7, 0), v3(0, 1.85, 0), { stroke: '#8fa3bd', w: 1.4, op: .8 });
    cs.line(v3(0, 0, S.cz - 1.9), v3(0, 0, S.cz + 2.0), { stroke: '#8fa3bd', w: 1.4, op: .8 });
    cs.label(v3(1.9, 0, 0), 'x', { size: 12, fill: '#8fa3bd', dx: 6 });
    cs.label(v3(0, 1.9, 0), 'y', { size: 12, fill: '#8fa3bd', dx: 6 });
    cs.label(v3(0, 0, S.cz + 2.1), 'z', { size: 12, fill: '#8fa3bd', dy: -8 });
    cs.label(v3(x0, y0, f0), 'P₀', { size: 12, fill: '#ffd166', dx: -14, dy: -8 });
    cs.label(q, 'Q', { size: 12, fill: '#c084fc', dx: 10, dy: -4 });
    cs.flush();

    cFx(`$${fmt(fx0, 2)}$`);
    cFy(`$${fmt(fy0, 2)}$`);
    cDz(`$${fmt(dz, 3)}$`);
    cAz(`$${fmt(S.f(xq, yq) - f0, 3)}$`);
    cEr(`$${fmt(Math.abs(S.f(xq, yq) - f0 - dz), 3)}$`);
  };

  const bts = P.map((S, i) => B.btnM(S.n, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i));
    cam.cz = S.cz; B.render();
  }, { on: i === 0 }));
  B.slider('x₀', -1.1, 1.1, 0.05, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  B.slider('y₀', -1.1, 1.1, 0.05, st.y0, v => { st.y0 = v; B.render(); }, 'y0');
  B.slider('Δx', 0.1, 0.8, 0.05, st.dx, v => { st.dx = v; B.render(); }, 'dx');
  B.slider('Δy', 0.1, 0.8, 0.05, st.dy, v => { st.dy = v; B.render(); }, 'dy');
  B.hintM('拖 $x_0$、$y_0$ 移动切点：绿色的斜率是 $f_x$、橙色的斜率是 $f_y$；拖 $\\Delta x$、$\\Delta y$ 看紫点与绿点差多少');
  B.render();
  return B;
}
