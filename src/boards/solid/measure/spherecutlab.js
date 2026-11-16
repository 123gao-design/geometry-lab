/* 图 积2 · 球的体积表面积与截面机
   R 滑块改球半径，d 滑块把截面平面沿 z 轴抬起。紫色平面切过蓝球，金色截面圆随 d 变大而变小，
   圆心 O、截面圆心 P₀ 与截面圆周上一点 A 组成直角三角形，P₀ 处画直角标记。
   经纬线可切成虚线，截面与球内的关系看得更清楚。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, circle3 } from '../../../lib/solid3d.js';

const N = 48;
const X = v3(1, 0, 0), Y = v3(0, 1, 0);

export function createBoard(root) {
  const W = 800, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 232, s: 95, cz: 0 });
  const st = { R: 1.4, d: 0.6, dash: false };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cA = B.chipM('球半径'), cB = B.chipM('截面到球心'), cC = B.chipM('截面圆半径'), cD = B.chipM('球表面积'), cE = B.chipM('球体积');

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const { R, d } = st;
    const rs = Math.sqrt(Math.max(0, R * R - d * d));
    const ok = R * R - d * d > 1e-6;

    // 球
    cs.dot(v3(0, 0, 0), R * cam.s, { fill: '#5cadff', op: 0.07, stroke: '#5cadff', w: 1.4 });
    const dsh = st.dash ? '5 4' : undefined;
    for (const t of [-60, -30, 0, 30, 60]) {
      const z = R * Math.sin(t * Math.PI / 180), rr = R * Math.cos(t * Math.PI / 180);
      cs.path(circle3(v3(0, 0, z), X, Y, rr, N), { stroke: '#5cadff', w: 1, op: 0.45, dash: dsh });
    }
    for (let k = 0; k < 4; k++) {
      const a = k / 4 * Math.PI;
      cs.path(circle3(v3(0, 0, 0), v3(Math.cos(a), Math.sin(a), 0), v3(0, 0, 1), R, N), { stroke: '#5cadff', w: 1, op: 0.35, dash: dsh });
    }

    // 截面平面
    const L = R * 1.55;
    cs.poly([v3(-L, -L, d), v3(L, -L, d), v3(L, L, d), v3(-L, L, d)],
      { fill: '#c084fc', op: 0.12, stroke: '#c084fc', w: 1.1, lineOp: 0.55 });

    // 截面圆
    if (ok) {
      const circ = circle3(v3(0, 0, d), X, Y, rs, N);
      cs.poly(circ, { fill: '#ffd166', op: 0.22, stroke: '#ffd166', w: 2, lineOp: 0.95 });
      // 直角三角形 O–P₀–A
      const A = v3(rs, 0, d);
      cs.line(v3(0, 0, 0), v3(0, 0, d), { stroke: '#8fa3bd', w: 1.5, op: 0.95, dash: '6 4' });
      cs.line(v3(0, 0, d), A, { stroke: '#ff9e4a', w: 2, op: 1 });
      cs.line(v3(0, 0, 0), A, { stroke: '#4ade80', w: 2, op: 1 });
      // 直角标记（P₀ 处，在 x–z 平面内）
      const k = Math.min(0.16, rs * 0.4);
      cs.path([v3(k, 0, d), v3(k, 0, d + k), v3(0, 0, d + k)], { stroke: '#ff9e4a', w: 1.3, op: 0.9 });
      cs.dot(v3(0, 0, 0), 4, { fill: '#4ade80' });
      cs.label(v3(0, 0, 0), 'O', { dx: -13, dy: -8, size: 12.5, fill: '#4ade80' });
      cs.dot(v3(0, 0, d), 3.8, { fill: '#ff9e4a' });
      cs.label(v3(0, 0, d), 'P₀', { dx: -16, dy: 4, size: 12.5, fill: '#ff9e4a' });
      cs.label(v3(0, 0, d * 0.5), 'd', { dx: 12, dy: 0, size: 12.5, fill: '#8fa3bd' });
      cs.label(v3(rs * 0.5, 0, (d + 0) / 2), 'r', { dx: 2, dy: -6, size: 12.5, fill: '#ff9e4a' });
      cC(`$${fz(rs)}$`);
    } else {
      cC('—');
    }
    cA(`$${fz(R)}$`);
    cB(`$${fz(d)}$`);
    cD(`$${fz(4 * Math.PI * R * R)}$`);
    cE(`$${fz(4 * Math.PI * R * R * R / 3)}$`);
    cs.flush();
  };

  B.slider('球半径 R', 0.9, 2.0, 0.05, st.R, v => { st.R = v; B.render(); }, 'R');
  B.slider('截面高度 d', -1.8, 1.8, 0.05, st.d, v => { st.d = v; B.render(); }, 'd');
  const bDash = B.btn('经纬线：实线', () => {
    st.dash = !st.dash;
    bDash.textContent = st.dash ? '经纬线：虚线' : '经纬线：实线';
    bDash.classList.toggle('on', st.dash);
    B.render();
  });
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('d 越大截面圆越小，d=R 时缩成一点');
  B.render();
  return B;
}
