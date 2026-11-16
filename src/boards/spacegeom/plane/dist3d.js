/* 图 面4 · 空间距离机
   三档共用同一枚动点 P：① 点到平面——法向量与常数项给平面，P 到平面的距离即 P 沿法向落下的垂线段；
   ② 点到直线——垂足是 P 在直线上的投影，距离由叉积的模除以方向向量的模给出；
   ③ 异面直线——两方向向量的叉积给出公垂线方向，公垂线段长即距离。 */
import { Board } from '../../../lib/board.js';
import { v3, add3, sub3, mul3, len3, dot3, cross3, unit3, makeCam, Scene, arrow3, rightMark3, orbit, planePoly } from '../../../lib/solid3d.js';

const L = 3.2;

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 410, cy: 248, s: 64 });
  const st = { m: 0, be: 38, ps: 46, cc: 0.9, px: 1.2, py: -0.6, pz: 1.5, th: 58, ph: 36, a1: 30, a2: 136, z2: 1.4 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cF = B.chipM('公式'), cD = B.chipM('距离'), cQ = B.chipM('垂足 / 公垂线段'), cJ = B.chipM('判读');

  const axis = (cs, to, col, lab) => {
    cs.line(mul3(to, -0.34), to, { stroke: col, w: 1.1, op: 0.8 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.9 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, l = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / l * 18, dy: dy / l * 18 + 4, size: 13, fill: col });
  };
  const deg = v => v * Math.PI / 180;
  const dirOf = (th, ph) => v3(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th));
  const closest = (P1, s1, P2, s2) => {
    const w0 = sub3(P1, P2);
    const a = dot3(s1, s1), b = dot3(s1, s2), c = dot3(s2, s2);
    const d = dot3(s1, w0), e = dot3(s2, w0);
    const den = a * c - b * b;
    const sc = Math.abs(den) < 1e-9 ? 0 : (b * e - c * d) / den;
    const tc = Math.abs(den) < 1e-9 ? e / c : (a * e - b * d) / den;
    const Q1 = add3(P1, mul3(s1, sc)), Q2 = add3(P2, mul3(s2, tc));
    return { Q1, Q2, dist: len3(sub3(Q2, Q1)) };
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0;
    axis(cs, v3(L, 0, 0), '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), '#ffd166', 'z');
    cs.label(v3(0, 0, 0), 'O', { dx: -13, dy: 14, size: 13, fill: '#8fa3bd' });
    const P = v3(st.px, st.py, st.pz);

    if (st.m === 0) {
      const n = dirOf(deg(st.be), deg(st.ps));
      const c = st.cc;
      const poly = planePoly(n.x, n.y, n.z, -c, L);
      if (poly.length >= 3) cs.poly(poly, { fill: '#5cadff', op: 0.15, stroke: '#5cadff', w: 1.6, lineOp: 0.85 });
      const sd = dot3(n, P) - c;
      const foot = sub3(P, mul3(n, sd));
      cs.dot(P, 5.2, { fill: '#ff9e4a' });
      cs.label(P, 'P', { dx: 14, dy: -8, size: 13, fill: '#ff9e4a' });
      cs.path([P, foot], { stroke: '#c084fc', w: 2.0, op: 0.95 });
      cs.dot(foot, 4.6, { fill: '#4ade80' });
      cs.label(foot, 'Q', { dx: 14, dy: -8, size: 13, fill: '#4ade80' });
      const e1 = poly.length >= 3 ? unit3(sub3(poly[0], poly[1])) : v3(1, 0, 0);
      rightMark3(cs, foot, P, add3(foot, e1), 0.16, { stroke: '#ffd166' });
      cF('$d=\\frac{|\\vec n\\cdot\\overrightarrow{AQ}|}{|\\vec n|}$');
      cD(`$${fz(Math.abs(sd))}$`);
      cQ(`$(${fz(foot.x)},\\ ${fz(foot.y)},\\ ${fz(foot.z)})$`);
      cJ(Math.abs(sd) < 0.04 ? 'P 落在平面上，距离为零'
        : (sd > 0 ? 'P 在法向量所指一侧，垂足是 P 沿 n 落下的点' : 'P 在法向量的反侧，垂足同样落在 Q'));
    } else if (st.m === 1) {
      const s = dirOf(deg(st.th), deg(st.ph));
      const P0 = v3(-0.7, -0.5, 0.2);
      cs.line(add3(P0, mul3(s, -3.4)), add3(P0, mul3(s, 3.4)), { stroke: '#ffd166', w: 2.0, op: 0.95 });
      cs.dot(P0, 4.2, { fill: '#67e8f9' });
      cs.label(P0, 'P₀', { dx: -24, dy: -10, size: 13, fill: '#67e8f9' });
      const w = sub3(P, P0);
      const proj = dot3(w, s);
      const Q = add3(P0, mul3(s, proj));
      const dist = len3(cross3(w, s));
      cs.dot(P, 5.2, { fill: '#ff9e4a' });
      cs.label(P, 'P', { dx: 14, dy: -8, size: 13, fill: '#ff9e4a' });
      cs.path([P, Q], { stroke: '#c084fc', w: 2.0, op: 0.95 });
      cs.dot(Q, 4.6, { fill: '#4ade80' });
      cs.label(Q, 'Q', { dx: 14, dy: -8, size: 13, fill: '#4ade80' });
      rightMark3(cs, Q, P, add3(Q, s), 0.16, { stroke: '#ffd166' });
      cF('$d=\\frac{|\\overrightarrow{P_0P}\\times\\vec s|}{|\\vec s|}$');
      cD(`$${fz(dist)}$`);
      cQ(`$(${fz(Q.x)},\\ ${fz(Q.y)},\\ ${fz(Q.z)})$`);
      cJ(dist < 0.04 ? 'P 在直线上，距离为零' : `投影长度 $\\mathrm{proj}_{\\vec s}\\overrightarrow{P_0P}=${fz(proj)}$`);
    } else {
      const P1 = v3(-1.2, -1.0, 0.7);
      const s1 = unit3(v3(Math.cos(deg(st.a1)), Math.sin(deg(st.a1)), 0.55));
      const P2 = v3(1.1, 0.9, st.z2);
      const s2 = unit3(v3(Math.cos(deg(st.a2)), Math.sin(deg(st.a2)), 0.55));
      cs.line(add3(P1, mul3(s1, -3.1)), add3(P1, mul3(s1, 3.1)), { stroke: '#ffd166', w: 2.0, op: 0.95 });
      cs.line(add3(P2, mul3(s2, -3.1)), add3(P2, mul3(s2, 3.1)), { stroke: '#5cadff', w: 2.0, op: 0.95 });
      const cl = closest(P1, s1, P2, s2);
      cs.path([cl.Q1, cl.Q2], { stroke: '#c084fc', w: 2.2, op: 0.98 });
      cs.dot(cl.Q1, 4.4, { fill: '#c084fc' });
      cs.dot(cl.Q2, 4.4, { fill: '#c084fc' });
      rightMark3(cs, cl.Q1, add3(cl.Q1, s1), cl.Q2, 0.16, { stroke: '#4ade80' });
      const cr = cross3(s1, s2);
      cF('$d=\\frac{|\\overrightarrow{P_1P_2}\\cdot(\\vec s_1\\times\\vec s_2)|}{|\\vec s_1\\times\\vec s_2|}$');
      cD(`$${fz(cl.dist)}$`);
      cQ(`$|\\vec s_1\\times\\vec s_2|=${fz(len3(cr))}$`);
      cJ(len3(cr) < 0.03 ? '两方向平行，公垂线段即两平行线间的距离' : '紫色段的两个端点由最近点对给出，方向为 s₁×s₂');
    }
    cs.flush();
  };

  const show = (el, on) => { const q = el && (el.parentNode || el.parent); if (q) q.style.display = on ? '' : 'none'; };
  const upd = () => B.render();
  const sBe = B.slider('法向倾角 β°', 5, 80, 1, st.be, v => { st.be = v; upd(); }, 'be');
  const sPs = B.slider('法向方位 ψ°', 0, 330, 5, st.ps, v => { st.ps = v; upd(); }, 'ps');
  const sCc = B.slider('平面常数 c', 0.2, 1.8, 0.05, st.cc, v => { st.cc = v; upd(); }, 'cc');
  const sPx = B.slider('P 的 x', -2, 2, 0.05, st.px, v => { st.px = v; upd(); }, 'px');
  const sPy = B.slider('P 的 y', -2, 2, 0.05, st.py, v => { st.py = v; upd(); }, 'py');
  const sPz = B.slider('P 的 z', -2, 2, 0.05, st.pz, v => { st.pz = v; upd(); }, 'pz');
  const sTh = B.slider('方向角 θ°', 15, 160, 1, st.th, v => { st.th = v; upd(); }, 'th');
  const sPh = B.slider('方位角 φ°', 0, 330, 5, st.ph, v => { st.ph = v; upd(); }, 'ph');
  const sA1 = B.slider('直线一的角 α₁°', 0, 350, 5, st.a1, v => { st.a1 = v; upd(); }, 'a1');
  const sA2 = B.slider('直线二的角 α₂°', 0, 350, 5, st.a2, v => { st.a2 = v; upd(); }, 'a2');
  const sZ2 = B.slider('P₂ 的高度 z', 0, 2.2, 0.05, st.z2, v => { st.z2 = v; upd(); }, 'z2');
  const sliders = [sBe, sPs, sCc, sPx, sPy, sPz, sTh, sPh, sA1, sA2, sZ2];
  const layout = m => sliders.forEach((s, j) => show(s, (m === 0 && j < 6) || (m === 1 && (j === 3 || j === 4 || j === 5 || j === 6 || j === 7)) || (m === 2 && j >= 8)));

  const modes = ['① 点到平面', '② 点到直线', '③ 异面直线'];
  const btns = modes.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.m = i;
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    layout(i); B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  layout(0);
  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转，紫色段始终垂直于对应的平面或直线');
  B.render();
  return B;
}
