/* 图 曲1 · 柱面与锥面机
   ① 柱面：准线是 xOy 平面上的椭圆，母线沿 z 方向平移，一根根母线连成柱面；
   ② 锥面：顶点在原点，准线是高度 h 处的椭圆，母线从原点射向准线上的点。
   准线画成金色闭环，母线以细线铺开，曲面的方程由准线的两个半轴与母线方向直接读出。 */
import { Board } from '../../../lib/board.js';
import { v3, mul3, makeCam, Scene, arrow3, orbit } from '../../../lib/solid3d.js';

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 410, cy: 250, s: 68 });
  const st = { m: 0, a: 1.35, b: 0.95, h: 1.8 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cG = B.chipM('准线'), cM = B.chipM('母线'), cE = B.chipM('曲面方程'), cJ = B.chipM('判读');

  const axis = (cs, to, col, lab) => {
    cs.line(mul3(to, -0.3), to, { stroke: col, w: 1.0, op: 0.7 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.7 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, l = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / l * 16, dy: dy / l * 16 + 4, size: 12, fill: col });
  };
  // 高度 z 处的准线椭圆
  const ring = (z, a, b, n = 64) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = i / n * Math.PI * 2;
      pts.push(v3(a * Math.cos(t), b * Math.sin(t), z));
    }
    pts.push(pts[0]);
    return pts;
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0;
    const L = 3.0;
    axis(cs, v3(L, 0, 0), '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), '#ffd166', 'z');
    cs.label(v3(0, 0, 0), 'O', { dx: -13, dy: 14, size: 12, fill: '#8fa3bd' });
    const { a, b, h } = st;

    if (st.m === 0) {
      const z0 = -2.1, z1 = 2.1;
      for (let i = 0; i < 28; i++) {
        const t = i / 28 * Math.PI * 2;
        const px = a * Math.cos(t), py = b * Math.sin(t);
        cs.line(v3(px, py, z0), v3(px, py, z1), { stroke: '#5cadff', w: 0.9, op: 0.26 });
      }
      for (const z of [z0, -0.7, 0.7, z1]) cs.path(ring(z, a, b), { stroke: '#5cadff', w: 0.9, op: z === z1 || z === z0 ? 0.5 : 0.22 });
      cs.path(ring(z0, a, b), { stroke: '#ffd166', w: 2.0, op: 0.95 });
      cs.label(v3(a, 0, z0), '准线', { dx: 12, dy: 14, size: 12, fill: '#ffd166' });
      cG(`$\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1,\\ z=0$，$a=${fz(a)},\\ b=${fz(b)}$`);
      cM('沿 $z$ 轴方向平移');
      cE(`$\\frac{x^2}{${fz(a * a)}}+\\frac{y^2}{${fz(b * b)}}=1$`);
      cJ('方程里缺 $z$，取任意高度截得的截面都与准线全等');
    } else {
      const dirTop = ring(h, a, b, 56);
      for (let i = 0; i < 44; i++) {
        const p = dirTop[i < 28 ? i * 2 : Math.floor(i * 56 / 44)];
        cs.line(v3(0, 0, 0), p, { stroke: '#5cadff', w: 0.9, op: 0.24 });
        if (p.z > 0.1) cs.line(v3(0, 0, 0), v3(p.x, p.y, -h), { stroke: '#5cadff', w: 0.7, op: 0.1 });
      }
      cs.path(dirTop, { stroke: '#ffd166', w: 2.0, op: 0.95 });
      cs.dot(v3(0, 0, 0), 4.6, { fill: '#ff9e4a' });
      cs.label(v3(0, 0, 0), '顶点', { dx: -34, dy: 16, size: 12, fill: '#ff9e4a' });
      cG(`$\\frac{x^2}{a^2}+\\frac{y^2}{b^2}=1,\\ z=${fz(h)}$，$a=${fz(a)},\\ b=${fz(b)}$`);
      cM('过顶点的射线');
      cE(`$\\frac{x^2}{${fz(a * a)}}+\\frac{y^2}{${fz(b * b)}}=\\frac{z^2}{${fz(h * h)}}$`);
      cJ('方程只含 $x,y$ 的二次齐次式与 $z^2$，截得的两支对顶点对称');
    }
    cs.flush();
  };

  const show = (el, on) => { const q = el && (el.parentNode || el.parent); if (q) q.style.display = on ? '' : 'none'; };
  const upd = () => B.render();
  const sA = B.slider('准线半轴 a', 0.6, 2.0, 0.05, st.a, v => { st.a = v; upd(); }, 'sa');
  const sB = B.slider('准线半轴 b', 0.5, 1.8, 0.05, st.b, v => { st.b = v; upd(); }, 'sb');
  const sH = B.slider('准线高度 h', 0.8, 2.4, 0.05, st.h, v => { st.h = v; upd(); }, 'sh');
  const sliders = [sA, sB, sH];
  const layout = m => sliders.forEach((s, j) => show(s, m === 0 ? j < 2 : true));

  const modes = ['① 柱面', '② 锥面'];
  const btns = modes.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.m = i;
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    layout(i); B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  layout(0);
  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转，柱面的母线始终平行于 z 轴');
  B.render();
  return B;
}
