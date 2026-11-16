/* 图 曲2 · 旋转曲面机
   母线画在 xOz 平面里（金色曲线），绕 z 轴转一圈得到曲面：曲面上每一点都是母线绕轴扫出的纬圆上的点。
   三档母线：① 抛物线 z = k r²（旋转抛物面）；② 直线 z = m r（圆锥面）；③ 竖直线 r = R（圆柱面）。
   纬圆滑块让一枚金色纬圆上下移动，它的半径由母线在该高度处的横坐标读出。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, circle3, arrow3, orbit } from '../../../lib/solid3d.js';

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 410, cy: 252, s: 66 });
  const st = { m: 0, k: 0.55, m2: 0.72, R: 1.3, z0: 1.4 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cM = B.chipM('母线'), cAx = B.chipM('旋转轴'), cE = B.chipM('曲面方程'), cJ = B.chipM('判读');
  const X = v3(1, 0, 0), Y = v3(0, 1, 0);

  const axis = (cs, to, col, lab) => {
    cs.line(v3(0, 0, -to.z * 0.3), to, { stroke: col, w: 1.0, op: 0.7 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.7 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, l = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / l * 16, dy: dy / l * 16 + 4, size: 12, fill: col });
  };
  // 母线：返回 { r, z } 的参数点列（r 为到 z 轴的距离）
  const meridian = () => {
    const pts = [];
    if (st.m === 0) {
      for (let i = 0; i <= 40; i++) { const r = i / 40 * 2.1; pts.push({ r, z: st.k * r * r }); }
    } else if (st.m === 1) {
      pts.push({ r: 0, z: 0 });
      for (let i = 1; i <= 30; i++) { const r = i / 30 * 2.1; pts.push({ r, z: st.m2 * r }); }
    } else {
      for (let i = 0; i <= 30; i++) { const z = i / 30 * 2.8 - 0.6; pts.push({ r: st.R, z }); }
    }
    return pts;
  };
  const radiusAt = z => {
    if (st.m === 0) return Math.sqrt(Math.max(z, 0) / Math.max(st.k, 1e-3));
    if (st.m === 1) return Math.max(z, 0) / Math.max(st.m2, 1e-3);
    return st.R;
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0;
    const L = 3.0;
    axis(cs, v3(L, 0, 0), '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), '#ffd166', 'z');
    cs.label(v3(0, 0, 0), 'O', { dx: -13, dy: 14, size: 12, fill: '#8fa3bd' });

    const mp = meridian();
    const zTop = mp[mp.length - 1].z;
    // 一团纬圆铺出曲面
    const nz = 9;
    for (let i = 1; i <= nz; i++) {
      const z = zTop * i / nz;
      const r = radiusAt(z);
      if (!isFinite(r) || r < 0.02) continue;
      cs.path(circle3(v3(0, 0, z), X, Y, r, 48), { stroke: '#5cadff', w: 0.8, op: 0.22 });
    }
    // 母线（xOz 平面内）与它的镜像
    const curve = mp.map(p => v3(p.r, 0, p.z));
    const curve2 = mp.map(p => v3(-p.r, 0, p.z));
    cs.path(curve, { stroke: '#ffd166', w: 2.0, op: 0.95 });
    cs.path(curve2, { stroke: '#ffd166', w: 1.2, op: 0.5 });
    cs.label(curve[curve.length - 1], '母线', { dx: 10, dy: -6, size: 12, fill: '#ffd166' });
    cs.label(v3(0, 0, 3.0), '旋转轴', { dx: 12, dy: 10, size: 12, fill: '#c084fc' });

    // 高亮的纬圆
    let zS = st.z0;
    if (st.m === 0) zS = Math.min(Math.max(zS, 0.1), zTop);
    if (st.m === 1) zS = Math.min(Math.max(zS, 0.1), zTop);
    if (st.m === 2) zS = Math.min(Math.max(zS, -0.5), 2.2);
    const rS = radiusAt(zS);
    const ringPts = circle3(v3(0, 0, zS), X, Y, rS, 64);
    cs.path(ringPts, { stroke: '#4ade80', w: 1.9, op: 0.95 });
    cs.line(v3(0, 0, zS), v3(rS, 0, zS), { stroke: '#4ade80', w: 1.2, op: 0.8 });
    cs.dot(v3(rS, 0, zS), 4.2, { fill: '#4ade80' });

    if (st.m === 0) {
      cM(`$z=${fz(st.k)}\\,r^2$`);
      cAx('$z$ 轴');
      cE(`$z=${fz(st.k)}\\left(x^2+y^2\\right)$`);
      cJ(`高度 $z=${fz(zS)}$ 处的纬圆半径 $r=\\sqrt{z/k}=${fz(rS)}$`);
    } else if (st.m === 1) {
      cM(`$z=${fz(st.m2)}\\,r$`);
      cAx('$z$ 轴');
      cE(`$z=${fz(st.m2)}\\sqrt{x^2+y^2}$`);
      cJ(`母线与轴的夹角固定，纬圆半径随高度线性增大：$r=${fz(rS)}$`);
    } else {
      cM(`$r=${fz(st.R)}$`);
      cAx('$z$ 轴');
      cE(`$x^2+y^2=${fz(st.R * st.R)}$`);
      cJ(`母线平行于轴，各高度处纬圆半径都是 $${fz(rS)}$`);
    }
    cs.flush();
  };

  const show = (el, on) => { const q = el && (el.parentNode || el.parent); if (q) q.style.display = on ? '' : 'none'; };
  const upd = () => B.render();
  const sK = B.slider('抛物系数 k', 0.25, 1.0, 0.01, st.k, v => { st.k = v; upd(); }, 'sk');
  const sM = B.slider('锥面斜率 m', 0.3, 1.4, 0.01, st.m2, v => { st.m2 = v; upd(); }, 'sm');
  const sRR = B.slider('圆柱半径 R', 0.5, 2.0, 0.05, st.R, v => { st.R = v; upd(); }, 'sr');
  const sZ = B.slider('纬圆高度 z', -0.5, 2.4, 0.05, st.z0, v => { st.z0 = v; upd(); }, 'sz');
  const sliders = [sK, sM, sRR, sZ];
  const layout = m => sliders.forEach((s, j) => show(s, (m === 0 && (j === 0 || j === 3)) || (m === 1 && (j === 1 || j === 3)) || (m === 2 && (j === 2 || j === 3))));

  const modes = ['① 抛物面', '② 圆锥面', '③ 圆柱面'];
  const btns = modes.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.m = i;
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    layout(i); B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  layout(0);
  orbit(B, cam, () => B.render());
  B.hint('母线绕 z 轴转一圈，绿色纬圆扫过的就是曲面');
  B.render();
  return B;
}
