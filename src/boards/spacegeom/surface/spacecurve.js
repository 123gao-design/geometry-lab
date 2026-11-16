/* 图 曲4 · 空间曲线机
   ① 螺旋线：P(t)=(r cos t, r sin t, c t)，两个投影分别是 xOy 平面上的圆与 yOz 平面上的正弦曲线，
      从 P 向两张投影面各作一条虚线，三个点同屏；② 球面与柱面：x²+y²+z²=R² 与 x²+y²=r² 相交，
      截得的圆周高度 z=±√(R²−r²)，两曲面用细线网铺出，交线用金色加粗。 */
import { Board } from '../../../lib/board.js';
import { v3, mul3, makeCam, Scene, arrow3, orbit } from '../../../lib/solid3d.js';

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 410, cy: 250, s: 66 });
  const st = { m: 0, hr: 1.35, hc: 0.3, t0: 4.2, R: 2.0, r2: 1.1 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cEq = B.chipM('方程'), cP = B.chipM('参数与读数'), cPt = B.chipM('点'), cJ = B.chipM('判读');
  const X = v3(1, 0, 0), Y = v3(0, 1, 0);

  const axis = (cs, to, col, lab) => {
    cs.line(v3(0, 0, -to.z * 0.28), to, { stroke: col, w: 1.0, op: 0.65 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.6 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, l = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / l * 15, dy: dy / l * 15 + 4, size: 12, fill: col });
  };
  const ring = (z, r, n = 56) => {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const t = i / n * Math.PI * 2;
      pts.push(v3(r * Math.cos(t), r * Math.sin(t), z));
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

    if (st.m === 0) {
      const r = st.hr, k = st.hc;
      const pt = t => v3(r * Math.cos(t), r * Math.sin(t), k * t);
      const helix = [];
      for (let i = 0; i <= 160; i++) helix.push(pt(i / 160 * Math.PI * 4));
      cs.path(helix, { stroke: '#ffd166', w: 2.0, op: 0.95 });
      cs.path(ring(0, r, 64), { stroke: '#5cadff', w: 1.1, op: 0.55 });
      const wave = [];
      for (let i = 0; i <= 120; i++) { const t = i / 120 * Math.PI * 4; wave.push(v3(0, r * Math.sin(t), k * t)); }
      cs.path(wave, { stroke: '#4ade80', w: 1.1, op: 0.6 });
      const tP = st.t0, P = pt(tP);
      const P1 = v3(P.x, P.y, 0), P2 = v3(0, P.y, P.z);
      cs.path([P, P1], { stroke: '#c084fc', w: 1.1, op: 0.7 });
      cs.path([P, P2], { stroke: '#c084fc', w: 1.1, op: 0.7 });
      cs.dot(P, 5, { fill: '#ff9e4a' });
      cs.dot(P1, 4, { fill: '#5cadff' });
      cs.dot(P2, 4, { fill: '#4ade80' });
      cs.label(P, 'P', { dx: 14, dy: -8, size: 13, fill: '#ff9e4a' });
      cs.label(P1, 'xOy 投影', { dx: 8, dy: 16, size: 11, fill: '#5cadff' });
      cs.label(P2, 'yOz 投影', { dx: -16, dy: -8, size: 11, fill: '#4ade80' });
      cEq(`$\\begin{cases}x=${fz(r)}\\cos t,\\\\ y=${fz(r)}\\sin t,\\\\ z=${fz(k)}t\\end{cases}$`);
      cP(`$r=${fz(r)}$，螺距 $2\\pi c=${fz(2 * Math.PI * k)}$，$t_0=${fz(tP)}$`);
      cPt(`$(${fz(P.x)},\\ ${fz(P.y)},\\ ${fz(P.z)})$`);
      cJ('两个投影合起来恢复整条曲线：圆定横纵、正弦定高度');
    } else {
      const R = st.R, r = st.r2;
      const zH = Math.sqrt(Math.max(0, R * R - r * r));
      // 球面线网
      for (let i = 1; i <= 5; i++) {
        const z = R * (i / 6 * 2 - 1);
        cs.path(ring(z, Math.sqrt(Math.max(0, R * R - z * z)), 48), { stroke: '#ffffff', w: 0.8, op: 0.2 });
      }
      for (let i = 0; i < 8; i++) {
        const ph = i / 8 * Math.PI * 2;
        const mer = [];
        for (let j = 0; j <= 32; j++) {
          const th = j / 32 * Math.PI;
          mer.push(v3(R * Math.sin(th) * Math.cos(ph), R * Math.sin(th) * Math.sin(ph), R * Math.cos(th)));
        }
        cs.path(mer, { stroke: '#ffffff', w: 0.8, op: 0.16 });
      }
      // 柱面线网
      for (let i = 0; i < 20; i++) {
        const t = i / 20 * Math.PI * 2;
        const px = r * Math.cos(t), py = r * Math.sin(t);
        cs.line(v3(px, py, -2.2), v3(px, py, 2.2), { stroke: '#5cadff', w: 0.7, op: 0.2 });
      }
      for (const z of [-2.2, 0, 2.2]) cs.path(ring(z, r, 48), { stroke: '#5cadff', w: 0.8, op: 0.24 });
      if (zH > 0.02) {
        for (const sg of [1, -1]) {
          cs.path(ring(sg * zH, r, 72), { stroke: '#ffd166', w: 2.2, op: 0.98 });
          cs.dot(v3(r, 0, sg * zH), 4.2, { fill: '#ff9e4a' });
        }
        cs.label(v3(r, 0, zH), '交线', { dx: 10, dy: -8, size: 12, fill: '#ffd166' });
        cP(`$z=\\pm\\sqrt{R^2-r^2}=\\pm${fz(zH)}$`);
        cPt(`$(${fz(r)},\\ 0,\\ ${fz(zH)})$`);
        cJ('两张曲面的交线是两个圆，半径都等于柱面半径');
      } else {
        cP('$r\\ge R$，柱面在球面之外');
        cPt('—');
        cJ('柱面半径不小于球半径时，两曲面没有公共点');
      }
      cEq(`$x^2+y^2+z^2=${fz(R * R)}$ 与 $x^2+y^2=${fz(r * r)}$`);
    }
    cs.flush();
  };

  const show = (el, on) => { const q = el && (el.parentNode || el.parent); if (q) q.style.display = on ? '' : 'none'; };
  const upd = () => B.render();
  const sR = B.slider('螺旋半径 r', 0.8, 1.9, 0.05, st.hr, v => { st.hr = v; upd(); }, 'hr');
  const sC = B.slider('螺距系数 c', 0.12, 0.5, 0.01, st.hc, v => { st.hc = v; upd(); }, 'hc');
  const sT = B.slider('参数 t₀', 0, 12.56, 0.05, st.t0, v => { st.t0 = v; upd(); }, 'ht');
  const sSR = B.slider('球半径 R', 1.5, 2.4, 0.05, st.R, v => { st.R = v; upd(); }, 'sr');
  const sCR = B.slider('柱半径 r', 0.5, 1.9, 0.05, st.r2, v => { st.r2 = v; upd(); }, 'cr');
  const sliders = [sR, sC, sT, sSR, sCR];
  const layout = m => sliders.forEach((s, j) => show(s, (m === 0 && j < 3) || (m === 1 && j >= 3)));

  const modes = ['① 螺旋线', '② 球面与柱面'];
  const btns = modes.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.m = i;
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    layout(i); B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  layout(0);
  orbit(B, cam, () => B.render());
  B.hint('螺旋线的两个投影分别是圆与正弦曲线');
  B.render();
  return B;
}
