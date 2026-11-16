/* 图 重5 · 柱面坐标与球面坐标机
   同一个点 P 有两种三维坐标写法：
   ① 柱面坐标 (r,θ,z) —— 底面上的极坐标再加高度，体积元 dV=r dr dθ dz；
   ② 球面坐标 (ρ,φ,θ) —— ρ 是到原点的距离、φ 是与 z 轴的夹角、θ 是方位角，体积元 dV=ρ²sinφ dρ dφ dθ。
   橙色小格是 P 附近的一块，边长由两个坐标面的间距给出。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, circle3, arc3 } from '../../../lib/solid3d.js';

const CAM0 = { yaw: 0.78, pitch: 0.32, s: 84, cx: 400, cy: 240, cz: 0.9 };
const ex = v3(1, 0, 0), ey = v3(0, 1, 0), ez = v3(0, 0, 1);

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { m: 0, r: 1.1, th: 40, z: 1.2, rho: 1.5, ph: 50 };
  const cam = makeCam({ ...CAM0 });
  const cC = B.chipM('坐标'), cXY = B.chipM('直角坐标'), cV = B.chipM('体积元'), cJ = B.chipM('判读');
  B.btn('重置视角', () => { Object.assign(cam, CAM0); B.render(); });

  const box = (cs, c, a, b, d) => {   // 以 c 为一个顶点的小长方体，三条边沿 a/b/d 方向
    const p = (i, j, k) => v3(c.x + (i ? a.x : 0) + (j ? b.x : 0) + (k ? d.x : 0),
      c.y + (i ? a.y : 0) + (j ? b.y : 0) + (k ? d.y : 0),
      c.z + (i ? a.z : 0) + (j ? b.z : 0) + (k ? d.z : 0));
    const f = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0]].map(([i, j]) => p(i, j, 0));
    const g = [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map(([i, j]) => p(i, j, 1));
    cs.poly(f, { fill: '#ff9e4a', op: .22, stroke: '#ff9e4a', w: 1, lineOp: .8 });
    cs.poly(g, { fill: '#ff9e4a', op: .3, stroke: '#ff9e4a', w: 1, lineOp: .8 });
    cs.line(p(0, 0, 0), p(0, 0, 1), { stroke: '#ff9e4a', w: 1.1, op: .85 });
    cs.line(p(1, 0, 0), p(1, 0, 1), { stroke: '#ff9e4a', w: 1.1, op: .85 });
    cs.line(p(0, 1, 0), p(0, 1, 1), { stroke: '#ff9e4a', w: 1.1, op: .85 });
    cs.line(p(1, 1, 0), p(1, 1, 1), { stroke: '#ff9e4a', w: 1.1, op: .85 });
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cs.line(v3(-1.9, 0, 0), v3(2.0, 0, 0), { stroke: '#8fa3bd', w: 1.2, op: .65 });
    cs.line(v3(0, -1.9, 0), v3(0, 2.0, 0), { stroke: '#8fa3bd', w: 1.2, op: .65 });
    cs.line(v3(0, 0, -0.4), v3(0, 0, 2.4), { stroke: '#8fa3bd', w: 1.2, op: .65 });
    cs.label(v3(2.05, 0, 0), 'x', { size: 12, fill: '#8fa3bd' });
    cs.label(v3(0, 2.05, 0), 'y', { size: 12, fill: '#8fa3bd' });
    cs.label(v3(0, 0, 2.55), 'z', { size: 12, fill: '#8fa3bd' });

    const th = st.th * Math.PI / 180;
    if (st.m === 0) {
      const r = st.r, z = st.z;
      const p = v3(r * Math.cos(th), r * Math.sin(th), z);
      const foot = v3(r * Math.cos(th), r * Math.sin(th), 0);
      // 坐标面：柱面 r=常数、水平圆、竖直线
      cs.path(circle3(v3(0, 0, 0), ex, ey, r), { stroke: '#5cadff', w: 1.2, op: .45 });
      cs.path(circle3(v3(0, 0, z), ex, ey, r), { stroke: '#5cadff', w: 1.4, op: .6 });
      cs.line(v3(0, 0, z), foot, { stroke: '#5cadff', w: 1.4, op: .7 });
      cs.line(v3(0, 0, 0), foot, { stroke: '#ffd166', w: 1.6, op: .95 });
      cs.line(foot, p, { stroke: '#ffd166', w: 2.4, op: .95 });
      arc3(cs, v3(0, 0, 0), v3(1, 0, 0), foot, 0.55, { stroke: '#ffd166', w: 1.6 });
      box(cs, p, mul(v3(Math.cos(th), Math.sin(th), 0), 0.24), mul(v3(-Math.sin(th), Math.cos(th), 0), 0.24 * r), v3(0, 0, 0.26));
      cs.dot(p, 5.5, { fill: '#ffd166' });
      cs.label(p, 'P', { size: 12, fill: '#ffd166', dx: 10, dy: -6 });
      const dV = r * 0.24 * 0.24 * 0.26;
      cC(`$r=${fmt(r, 2)}$，$\\theta=${fmt(st.th, 0)}^\\circ$，$z=${fmt(z, 2)}$`);
      cXY(`$(${fmt(p.x, 2)},\\ ${fmt(p.y, 2)},\\ ${fmt(p.z, 2)})$`);
      cV(`$dV=r\\,dr\\,d\\theta\\,dz\\approx${fmt(dV, 4)}$`);
      cJ('柱面坐标适合绕 z 轴对称的区域：同一高度上截面是圆，r 与 θ 管底面、z 管高度', 'ok');
    } else {
      const rho = st.rho, ph = st.ph * Math.PI / 180;
      const p = v3(rho * Math.sin(ph) * Math.cos(th), rho * Math.sin(ph) * Math.sin(th), rho * Math.cos(ph));
      // 球面 ρ=常数 的三条大圆
      cs.path(circle3(v3(0, 0, 0), ex, ey, rho), { stroke: '#5cadff', w: 1.2, op: .4 });
      cs.path(circle3(v3(0, 0, 0), ex, ez, rho), { stroke: '#5cadff', w: 1.2, op: .4 });
      cs.path(circle3(v3(0, 0, 0), ey, ez, rho), { stroke: '#5cadff', w: 1.2, op: .4 });
      cs.line(v3(0, 0, 0), p, { stroke: '#ffd166', w: 2.4, op: .95 });
      cs.line(v3(0, 0, 0), v3(p.x, p.y, 0), { stroke: '#67e8f9', w: 1.3, op: .8, dash: '5 4' });
      cs.line(p, v3(p.x, p.y, 0), { stroke: '#67e8f9', w: 1.3, op: .8, dash: '5 4' });
      arc3(cs, v3(0, 0, 0), v3(0, 0, 1), p, 0.5, { stroke: '#ff9e4a', w: 1.6 });
      arc3(cs, v3(0, 0, 0), v3(1, 0, 0), v3(p.x, p.y, 0), 0.72, { stroke: '#c084fc', w: 1.6 });
      cs.dot(p, 5.5, { fill: '#ffd166' });
      cs.label(p, 'P', { size: 12, fill: '#ffd166', dx: 10, dy: -6 });
      const dV = rho * rho * Math.sin(ph) * 0.3 * 0.24 * 0.24;
      cC(`$\\rho=${fmt(rho, 2)}$，$\\varphi=${fmt(st.ph, 0)}^\\circ$，$\\theta=${fmt(st.th, 0)}^\\circ$`);
      cXY(`$(${fmt(p.x, 2)},\\ ${fmt(p.y, 2)},\\ ${fmt(p.z, 2)})$`);
      cV(`$dV=\\rho^2\\sin\\varphi\\,d\\rho\\,d\\varphi\\,d\\theta\\approx${fmt(dV, 4)}$`);
      cJ('球面坐标适合球对称区域；φ 从 z 轴量到 OP，赤道附近 sinφ 最大，体积元也最大', 'ok');
    }
    cs.flush();
  };

  const bts = ['① 柱面坐标', '② 球面坐标'].map((lab, i) => B.btnM(lab, () => {
    st.m = i; bts.forEach((b, j) => b.classList.toggle('on', j === i));
    [sR, sZ, sP, sF].forEach((s, j) => { if (s) wrap(s).style.display = (i === 0 ? j < 2 : j >= 2) ? '' : 'none'; });
    B.render();
  }, { on: i === 0 }));

  const wrap = e => e.parentNode || e.parent;
  const sR = B.slider('柱半径 r', 0.3, 1.6, 0.02, st.r, v => { st.r = v; B.render(); }, 'r');
  const sZ = B.slider('高度 z', 0.1, 2.0, 0.02, st.z, v => { st.z = v; B.render(); }, 'z');
  const sP = B.slider('球半径 ρ', 0.6, 2.0, 0.02, st.rho, v => { st.rho = v; B.render(); }, 'rho');
  const sF = B.slider('极角 φ', 10, 165, 1, st.ph, v => { st.ph = v; B.render(); }, 'phi');
  const sT = B.slider('方位角 θ', 0, 360, 5, st.th, v => { st.th = v; B.render(); }, 'th');
  wrap(sP).style.display = 'none';
  wrap(sF).style.display = 'none';
  orbit(B, cam, () => B.render());
  B.hintM('两套坐标都是「三个面交于一点」：柱面坐标的两张柱面、一张水平面；球面坐标的两张锥面、一张球面');
  B.render();
  return B;
}

const mul = (a, k) => v3(a.x * k, a.y * k, a.z * k);
