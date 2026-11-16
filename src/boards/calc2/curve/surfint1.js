/* 图 线4 · 第一类曲面积分机（对面积）
   曲面 S：z=1−(x²+y²)/2，取在单位圆盘 x²+y²≤1 上方的那一片。
   面积元 dS=√(1+z_x²+z_y²) dxdy，其中 z_x=−x、z_y=−y，所以 dS=√(1+x²+y²) dxdy：
   离轴越远，曲面越倾斜，同一块投影面积摊出的曲面面积越大。
   橙色小片是 P 附近的一块，淡蓝虚线框是它在 xOy 面上的投影。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, circle3 } from '../../../lib/solid3d.js';

const F = (x, y) => 1 - (x * x + y * y) / 2;
const CAM0 = { yaw: 0.74, pitch: 0.36, s: 152, cx: 400, cy: 244, cz: 0.55 };

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { r: 0.62, th: 40 };
  const cam = makeCam({ ...CAM0 });
  const cA = B.chipM('投影 $\\Delta A$'), cK = B.chipM('放大因子'), cS = B.chipM('曲面 $\\Delta S$'), cT = B.chipM('总面积');
  B.btn('重置视角', () => { Object.assign(cam, CAM0); B.render(); });

  const ex = v3(1, 0, 0), ey = v3(0, 1, 0);

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    // 曲面：环带拼成，半透明
    const NR = 6, NT = 20;
    for (let i = 0; i < NR; i++) {
      for (let j = 0; j < NT; j++) {
        const r0 = i / NR, r1 = (i + 1) / NR, t0 = 2 * Math.PI * j / NT, t1 = 2 * Math.PI * (j + 1) / NT;
        const q = [[r0, t0], [r1, t0], [r1, t1], [r0, t1]].map(([r, t]) => {
          const x = r * Math.cos(t), y = r * Math.sin(t);
          return v3(x, y, F(x, y));
        });
        cs.poly(q, { fill: '#5cadff', op: .07, stroke: '#5cadff', w: .8, lineOp: .3 });
      }
    }
    cs.path(circle3(v3(0, 0, F(1, 0)), ex, ey, 1), { stroke: '#5cadff', w: 2, op: .95 });

    // 投影圆盘
    cs.poly(circle3(v3(0, 0, 0), ex, ey, 1), { fill: '#8fa3bd', op: .07, stroke: '#8fa3bd', w: 1.2, lineOp: .6 });
    cs.line(v3(-1.25, 0, 0), v3(1.25, 0, 0), { stroke: '#8fa3bd', w: 1, op: .55 });
    cs.line(v3(0, -1.25, 0), v3(0, 1.25, 0), { stroke: '#8fa3bd', w: 1, op: .55 });
    cs.line(v3(0, 0, -0.25), v3(0, 0, 1.5), { stroke: '#8fa3bd', w: 1, op: .55 });
    cs.label(v3(1.3, 0, 0), 'x', { size: 11, fill: '#8fa3bd' });
    cs.label(v3(0, 1.3, 0), 'y', { size: 11, fill: '#8fa3bd' });
    cs.label(v3(0, 0, 1.62), 'z', { size: 11, fill: '#8fa3bd' });

    // P 处的小片 h=0.14
    const t = st.th * Math.PI / 180, r = st.r, h = 0.14;
    const x0 = r * Math.cos(t), y0 = r * Math.sin(t);
    const quad = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([dx, dy]) => v3(x0 + dx, y0 + dy, F(x0 + dx, y0 + dy)));
    const proj = [[-h, -h], [h, -h], [h, h], [-h, h]].map(([dx, dy]) => v3(x0 + dx, y0 + dy, 0));
    cs.poly(quad, { fill: '#ff9e4a', op: .6, stroke: '#ff9e4a', w: 1.6, lineOp: .95 });
    cs.line(v3(x0, y0, F(x0, y0)), v3(x0, y0, 0), { stroke: '#8fa3bd', w: 1.1, op: .8, dash: '4 4' });
    for (const q of quad) cs.line(q, v3(q.x, q.y, 0), { stroke: '#67e8f9', w: 1, op: .8, dash: '4 4' });
    for (let i = 0; i < 4; i++) cs.line(proj[i], proj[(i + 1) % 4], { stroke: '#67e8f9', w: 1.4, op: .95, dash: '6 4' });
    // 法向
    const k = Math.sqrt(1 + r * r);
    cs.line(v3(x0, y0, F(x0, y0)), v3(x0 + 0.42 * x0 / k, y0 + 0.42 * y0 / k, F(x0, y0) + 0.42 / k), { stroke: '#c084fc', w: 2, op: .95 });
    cs.dot(v3(x0, y0, F(x0, y0)), 4.5, { fill: '#ffd166' });
    cs.label(v3(x0, y0, F(x0, y0)), 'P', { size: 11, fill: '#ffd166', dx: 10, dy: -4 });
    cs.flush();

    const dA = (2 * h) ** 2;
    const total = 2 * Math.PI * (Math.pow(2, 1.5) - 1) / 3;
    cA(`$${fmt(dA, 3)}$`);
    cK(`$\\sqrt{1+x^2+y^2}=${fmt(k, 3)}$`);
    cS(`$${fmt(dA * k, 3)}$`);
    cT(`$\\iint_S dS=${fmt(total, 3)}$`, 'ok');
  };

  B.slider('小片到轴的距离 r', 0.1, 0.88, 0.02, st.r, v => { st.r = v; B.render(); }, 'r');
  B.slider('小片的方位角 θ', 0, 355, 5, st.th, v => { st.th = v; B.render(); }, 'th');
  orbit(B, cam, () => B.render());
  B.hintM('把 r 拖大：小片越来越斜，同样的投影面积摊出的曲面面积越来越大');
  B.render();
  return B;
}
