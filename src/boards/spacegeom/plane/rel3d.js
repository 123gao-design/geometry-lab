/* 图 面3 · 空间位置关系机
   三档：① 两平面（法向角可调，读平行/重合/相交与二面角）；② 直线与平面（读直线在面内、平行、垂直、斜交与线面角）；
   ③ 两直线（平行、相交、异面三种关系，异面时画出公垂线段）。判定一律走数量积与向量积，读数与图形同屏。 */
import { Board } from '../../../lib/board.js';
import { v3, add3, sub3, mul3, len3, dot3, cross3, unit3, makeCam, Scene, arrow3, arc3, rightMark3, orbit, planePoly } from '../../../lib/solid3d.js';

const L = 3.2;

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 410, cy: 248, s: 64 });
  const st = { m: 0, a1: 24, a2: 118, c2: 0.6, th: 62, ph: 40, be: 34, ps: 55, b1: 34, b2: 142, z2: 1.3 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cRel = B.chipM('位置关系'), cN = B.chipM('方向 / 法向量'), cV = B.chipM('夹角或距离'), cJ = B.chipM('判读');

  const axis = (cs, to, col, lab) => {
    cs.line(mul3(to, -0.34), to, { stroke: col, w: 1.1, op: 0.8 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.9 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, l = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / l * 18, dy: dy / l * 18 + 4, size: 13, fill: col });
  };
  const deg = v => v * Math.PI / 180;
  const dirOf = (th, ph) => v3(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th));
  // 两条直线（P1 沿 s1、P2 沿 s2）的最近点与距离
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

    if (st.m === 0) {
      const n1 = v3(Math.cos(deg(st.a1)), Math.sin(deg(st.a1)), 0.35);
      const n2 = v3(Math.cos(deg(st.a2)), Math.sin(deg(st.a2)), 0.35);
      const c1 = 1.0, c2 = st.c2;
      const p1 = planePoly(n1.x, n1.y, n1.z, -c1, L);
      const p2 = planePoly(n2.x, n2.y, n2.z, -c2, L);
      if (p1.length >= 3) cs.poly(p1, { fill: '#5cadff', op: 0.14, stroke: '#5cadff', w: 1.5, lineOp: 0.8 });
      if (p2.length >= 3) cs.poly(p2, { fill: '#4ade80', op: 0.14, stroke: '#4ade80', w: 1.5, lineOp: 0.8 });
      const l1 = len3(n1), l2 = len3(n2), dl = len3(cross3(n1, n2));
      const sinA = dl / (l1 * l2);
      cN(`$(${fz(n1.x)},\\ ${fz(n1.y)},\\ ${fz(n1.z)})$ 与 $(${fz(n2.x)},\\ ${fz(n2.y)},\\ ${fz(n2.z)})$`);
      if (sinA < 0.03) {
        const lam = dot3(n1, n2) / (l1 * l1);
        const c2n = c2 / lam;
        const same = Math.abs(c2n - c1) < 0.08;
        cRel(same ? '两平面重合' : '两平面平行');
        cV(same ? '—' : `$d=\\frac{|c_1-c_2'|}{|n_1|}=${fz(Math.abs(c1 - c2n) / l1)}$`);
        cJ(same ? '法向量成比例，常数项也一样，两张平面是同一张' : '法向量成比例但常数项不同，两平面平行且无公共点');
      } else {
        const ang = Math.acos(Math.abs(dot3(n1, n2)) / (l1 * l2)) * 180 / Math.PI;
        const d = cross3(n1, n2);
        const p = mul3(add3(mul3(cross3(n2, d), c1), mul3(cross3(d, n1), c2)), 1 / (dl * dl));
        const us = unit3(d);
        cs.line(add3(p, mul3(us, -3.6)), add3(p, mul3(us, 3.6)), { stroke: '#ffd166', w: 2.0, op: 0.95 });
        cs.dot(p, 4.0, { fill: '#ff9e4a' });
        cRel('两平面相交');
        cV(`$\\arccos\\frac{|n_1\\cdot n_2|}{|n_1||n_2|}=${fz(ang)}^\\circ$`);
        cJ('交线方向为 n₁×n₂；二面角取法向量夹角的锐角');
      }
    } else if (st.m === 1) {
      const n = dirOf(deg(st.be), deg(st.ps));
      const nn = unit3(n);
      const s = dirOf(deg(st.th), deg(st.ph));
      const P0 = v3(-0.4, -0.3, 0.2);
      const dpl = 0.9;
      const poly = planePoly(nn.x, nn.y, nn.z, -dpl, L);
      if (poly.length >= 3) cs.poly(poly, { fill: '#5cadff', op: 0.15, stroke: '#5cadff', w: 1.6, lineOp: 0.85 });
      const A = add3(P0, mul3(s, -3.3)), Bp = add3(P0, mul3(s, 3.3));
      cs.line(A, Bp, { stroke: '#ffd166', w: 2.0, op: 0.95 });
      cs.dot(P0, 4.2, { fill: '#ff9e4a' });
      cs.label(P0, 'P₀', { dx: -24, dy: -10, size: 13, fill: '#ff9e4a' });
      const dn = dot3(s, nn);
      const off = dpl - dot3(nn, P0);
      cN(`$\\vec s=(${fz(s.x)},\\ ${fz(s.y)},\\ ${fz(s.z)})$`);
      if (Math.abs(dn) < 0.03) {
        const inPlane = Math.abs(off) < 0.05;
        cRel(inPlane ? '直线在平面内' : '直线与平面平行');
        cV(`$\\vec s\\cdot\\vec n=${fz(dn)}$`);
        cJ(inPlane ? 's⊥n 且 P₀ 在平面上，整条直线落在平面内' : 's⊥n 而 P₀ 不在平面上，直线与平面无公共点');
      } else {
        const t = off / dn;
        const Q = add3(P0, mul3(s, t));
        cs.dot(Q, 5, { fill: '#4ade80' });
        cs.label(Q, 'Q', { dx: 14, dy: -8, size: 13, fill: '#4ade80' });
        const ang = Math.asin(Math.min(1, Math.abs(dn))) * 180 / Math.PI;
        if (Math.abs(dn) > 0.997) {
          cRel('直线与平面垂直');
          const e1 = unit3(sub3(poly[0], poly[1]));
          rightMark3(cs, Q, add3(Q, s), add3(Q, e1), 0.18, { stroke: '#c084fc' });
          cV(`$\\vec s\\cdot\\vec n=${fz(dn)}$`);
          cJ('s∥n，直线垂直于平面内每一条直线');
        } else {
          cRel('直线与平面斜交');
          const sp = unit3(sub3(s, mul3(nn, dn)));
          cs.path([Q, add3(Q, mul3(sp, 1.5))], { stroke: '#c084fc', w: 1.3, op: 0.85 });
          arc3(cs, Q, add3(Q, mul3(s, 1.5)), add3(Q, mul3(sp, 1.5)), 0.75, { stroke: '#ffd166', op: 0.95 });
          cV(`$\\arcsin|\\vec s\\cdot\\vec n|=${fz(ang)}^\\circ$`);
          cJ('紫色虚线是 s 在平面内的投影，紫金两线夹角即线面角');
        }
      }
    } else {
      const P1 = v3(-1.2, -1.0, 0.7);
      const s1 = unit3(v3(Math.cos(deg(st.b1)), Math.sin(deg(st.b1)), 0.55));
      const P2 = v3(1.1, 0.9, st.z2);
      const s2 = unit3(v3(Math.cos(deg(st.b2)), Math.sin(deg(st.b2)), 0.55));
      cs.line(add3(P1, mul3(s1, -3.2)), add3(P1, mul3(s1, 3.2)), { stroke: '#ffd166', w: 2.0, op: 0.95 });
      cs.line(add3(P2, mul3(s2, -3.2)), add3(P2, mul3(s2, 3.2)), { stroke: '#5cadff', w: 2.0, op: 0.95 });
      cs.dot(P1, 4.2, { fill: '#ff9e4a' });
      cs.dot(P2, 4.2, { fill: '#67e8f9' });
      cs.label(P1, 'P₁', { dx: -26, dy: -8, size: 13, fill: '#ff9e4a' });
      cs.label(P2, 'P₂', { dx: 16, dy: -8, size: 13, fill: '#67e8f9' });
      const cl = closest(P1, s1, P2, s2);
      const sinA = len3(cross3(s1, s2));
      cN(`$\\vec s_1=(${fz(s1.x)},\\ ${fz(s1.y)},\\ ${fz(s1.z)})$`);
      if (sinA < 0.03) {
        cRel('两直线平行（或重合）');
        cV(`$|\\vec s_1\\times\\vec s_2|=${fz(sinA)}$`);
        cJ('方向向量共线；再观察是否有公共点，有则重合');
      } else if (cl.dist < 0.06) {
        cRel('两直线相交');
        cs.dot(cl.Q1, 5, { fill: '#4ade80' });
        cs.label(cl.Q1, 'Q', { dx: 14, dy: -8, size: 13, fill: '#4ade80' });
        const ang = Math.acos(Math.min(1, Math.abs(dot3(s1, s2)))) * 180 / Math.PI;
        cV(`$\\arccos|\\vec s_1\\cdot\\vec s_2|=${fz(ang)}^\\circ$`);
        cJ('两方向的夹角给出相交直线所成的角，取锐角');
      } else {
        cRel('两直线异面');
        cs.path([cl.Q1, cl.Q2], { stroke: '#c084fc', w: 1.8, op: 0.95 });
        cs.dot(cl.Q1, 4.4, { fill: '#c084fc' });
        cs.dot(cl.Q2, 4.4, { fill: '#c084fc' });
        rightMark3(cs, cl.Q1, add3(cl.Q1, s1), cl.Q2, 0.16, { stroke: '#fff' });
        const ang = Math.acos(Math.min(1, Math.abs(dot3(s1, s2)))) * 180 / Math.PI;
        cV(`$d=${fz(cl.dist)}$，夹角 $${fz(ang)}^\\circ$`);
        cJ('紫色段是公垂线段，它的长度即两异面直线的距离');
      }
    }
    cs.flush();
  };

  const show = (el, on) => { const q = el && (el.parentNode || el.parent); if (q) q.style.display = on ? '' : 'none'; };
  const upd = () => B.render();
  const sA1 = B.slider('法向角 α₁°', 0, 350, 5, st.a1, v => { st.a1 = v; upd(); }, 'a1');
  const sA2 = B.slider('法向角 α₂°', 0, 350, 5, st.a2, v => { st.a2 = v; upd(); }, 'a2');
  const sC2 = B.slider('平面二的偏移 c₂', 0.2, 1.8, 0.05, st.c2, v => { st.c2 = v; upd(); }, 'c2');
  const sTh = B.slider('方向角 θ°', 15, 160, 1, st.th, v => { st.th = v; upd(); }, 'th');
  const sPh = B.slider('方位角 φ°', 0, 330, 5, st.ph, v => { st.ph = v; upd(); }, 'ph');
  const sBe = B.slider('法向倾角 β°', 5, 80, 1, st.be, v => { st.be = v; upd(); }, 'be');
  const sPs = B.slider('法向方位 ψ°', 0, 330, 5, st.ps, v => { st.ps = v; upd(); }, 'ps');
  const sB1 = B.slider('直线一的角 β₁°', 0, 350, 5, st.b1, v => { st.b1 = v; upd(); }, 'b1');
  const sB2 = B.slider('直线二的角 β₂°', 0, 350, 5, st.b2, v => { st.b2 = v; upd(); }, 'b2');
  const sZ2 = B.slider('P₂ 的高度 z', 0, 2.2, 0.05, st.z2, v => { st.z2 = v; upd(); }, 'z2');
  const sliders = [sA1, sA2, sC2, sTh, sPh, sBe, sPs, sB1, sB2, sZ2];
  const layout = m => sliders.forEach((s, j) => show(s, (m === 0 && j < 3) || (m === 1 && j >= 3 && j < 7) || (m === 2 && j >= 7)));

  const modes = ['① 两平面', '② 直线与平面', '③ 两直线'];
  const btns = modes.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.m = i;
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    layout(i); B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  layout(0);
  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转，从不同方向看平面与直线的相对位置');
  B.render();
  return B;
}
