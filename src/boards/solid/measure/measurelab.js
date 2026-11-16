/* 图 积1 · 柱锥台体积与表面积机
   三档：① 正棱柱 ② 正棱锥 ③ 正棱台。n 滑块改边数，a 改底面边长，h 改高，a₂ 改上底边长。
   底面金色、上底绿色、侧面按面分色，全部半透明；徽章读底面积、侧面积、表面积与体积。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, FACE_COLORS } from '../../../lib/solid3d.js';

const TAU = Math.PI * 2;

export function createBoard(root) {
  const W = 800, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 215, s: 105, cz: 1.0 });
  const st = { mode: 0, n: 6, a: 1.4, h: 2.0, a2: 0.8 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cA = B.chipM('底面积'), cB = B.chipM('侧面积'), cC = B.chipM('表面积'), cD = B.chipM('体积');

  /* 正 n 边形顶点：外接半径 R，边心距 ρ */
  const polys = (n, R, z, off) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      const t = off + i * TAU / n;
      out.push(v3(R * Math.cos(t), R * Math.sin(t), z));
    }
    return out;
  };
  const Rof = a => a / (2 * Math.sin(Math.PI / st.n));
  const rhoOf = a => a / (2 * Math.tan(Math.PI / st.n));

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const { n, a, h } = st;
    const mode = st.mode;
    const a2 = Math.min(st.a2, a - 0.05);
    const R1 = Rof(a), rho1 = rhoOf(a);
    const S1 = n * a * a / (4 * Math.tan(Math.PI / n));          // 底面积
    const P1 = n * a;                                            // 底面周长
    const off = Math.PI / n;                                     // 让一条边朝前
    const lo = polys(n, R1, 0, off);
    cam.cz = h / 2;

    let S2 = 0, P2 = 0, rho2 = 0;
    if (mode === 2) { S2 = n * a2 * a2 / (4 * Math.tan(Math.PI / n)); P2 = n * a2; rho2 = rhoOf(a2); }

    // 侧面
    if (mode === 1) {
      const ap = v3(0, 0, h);
      for (let i = 0; i < n; i++) {
        const col = FACE_COLORS[i % FACE_COLORS.length];
        cs.poly([lo[i], lo[(i + 1) % n], ap], { fill: col, op: 0.17, stroke: col, w: 1.1, lineOp: 0.4 });
      }
      cs.dot(ap, 4.2, { fill: '#ffd166' });
      cs.label(ap, 'S', { dx: 0, dy: -13, size: 13, fill: '#ffd166' });
      // 斜高与底边心距
      const m0 = v3(0, 0, 0);
      cs.line(m0, ap, { stroke: '#8fa3bd', w: 1.2, op: 0.8, dash: '6 5' });
      cs.label(v3(0, 0, h * 0.55), 'h', { dx: -13, dy: 0, size: 12.5, fill: '#8fa3bd' });
    } else {
      const R2 = Rof(a2), zt = h;
      const hi = mode === 2 ? polys(n, R2, zt, off) : polys(n, R1, zt, off);
      for (let i = 0; i < n; i++) {
        const col = FACE_COLORS[i % FACE_COLORS.length];
        const j = (i + 1) % n;
        cs.poly([lo[i], lo[j], hi[j], hi[i]], { fill: col, op: 0.17, stroke: col, w: 1.1, lineOp: 0.4 });
      }
      cs.poly(hi, { fill: '#4ade80', op: 0.17, stroke: '#4ade80', w: 1.2, lineOp: 0.5 });
      cs.line(v3(0, 0, 0), v3(0, 0, h), { stroke: '#8fa3bd', w: 1.2, op: 0.8, dash: '6 5' });
      cs.label(v3(0, 0, h * 0.58), 'h', { dx: -13, dy: 0, size: 12.5, fill: '#8fa3bd' });
    }
    // 底面
    cs.poly(lo, { fill: '#ffd166', op: 0.17, stroke: '#ffd166', w: 1.5, lineOp: 0.85 });

    let Slat, Stot, V;
    if (mode === 0) {
      Slat = P1 * h; Stot = 2 * S1 + Slat; V = S1 * h;
    } else if (mode === 1) {
      const m = Math.hypot(h, rho1);
      Slat = P1 * m / 2; Stot = S1 + Slat; V = S1 * h / 3;
    } else {
      const m = Math.hypot(h, Math.abs(rho1 - rho2));
      Slat = (P1 + P2) * m / 2; Stot = S1 + S2 + Slat; V = h * (S1 + S2 + Math.sqrt(S1 * S2)) / 3;
    }
    cA(`$${fz(S1)}$`);
    cB(`$${fz(Slat)}$`);
    cC(`$${fz(Stot)}$`);
    cD(`$${fz(V)}$`);
    cs.flush();
  };

  const btns = ['① 正棱柱', '② 正棱锥', '③ 正棱台'].map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  let sN, sA, sH, sA2;
  const par = e => e && (e.parentNode || e.parent);
  const setMode = i => {
    st.mode = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    if (par(sA2)) par(sA2).style.display = i === 2 ? '' : 'none';
    B.render();
  };
  sN = B.slider('底面边数 n', 3, 8, 1, st.n, v => { st.n = Math.round(v); B.render(); }, 'n');
  sA = B.slider('底面边长 a', 0.6, 2.4, 0.05, st.a, v => { st.a = v; B.render(); }, 'a');
  sH = B.slider('高 h', 0.8, 2.6, 0.05, st.h, v => { st.h = v; B.render(); }, 'h');
  sA2 = B.slider('上底边长 a₂', 0.3, 2.0, 0.05, st.a2, v => { st.a2 = v; B.render(); }, 'a2');
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  orbit(B, cam, () => B.render());
  B.hint('边数越推越多，侧面越来越接近一圈曲面');
  setMode(0);
  return B;
}
