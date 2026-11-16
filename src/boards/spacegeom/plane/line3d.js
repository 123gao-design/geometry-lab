/* 图 面2 · 空间直线的方程机
   三档同台：① 点向式（对称式）——过定点 P₀、方向向量由方向角 θ、φ 给出；② 参数式——动点 P = P₀ + t·s，
   t 滑块让 P 沿直线滑动，t 的绝对值即有向距离；③ 两平面交线——两张半透明平面相交，交线方向为 n₁×n₂。 */
import { Board } from '../../../lib/board.js';
import { v3, add3, mul3, len3, cross3, unit3, makeCam, Scene, arrow3, orbit, planePoly } from '../../../lib/solid3d.js';

const L = 3.2;

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 410, cy: 246, s: 66 });
  const st = { m: 0, th: 58, ph: 42, x0: 1.0, t: 0.9, a1: 28, a2: 132 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cEq = B.chipM('方程'), cDir = B.chipM('方向向量 s'), cPt = B.chipM('点'), cJ = B.chipM('判读');

  const axis = (cs, to, col, lab) => {
    cs.line(mul3(to, -0.34), to, { stroke: col, w: 1.1, op: 0.8 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.9 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, l = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / l * 18, dy: dy / l * 18 + 4, size: 13, fill: col });
  };
  const dirOf = (th, ph) => v3(Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th));

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0;
    axis(cs, v3(L, 0, 0), '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), '#ffd166', 'z');
    cs.label(v3(0, 0, 0), 'O', { dx: -13, dy: 14, size: 13, fill: '#8fa3bd' });

    if (st.m < 2) {
      const s = dirOf(st.th * Math.PI / 180, st.ph * Math.PI / 180);
      const P0 = v3(st.x0, 0.8, 0.6);
      const a = add3(P0, mul3(s, -3.4)), b = add3(P0, mul3(s, 3.4));
      cs.line(a, b, { stroke: '#ffd166', w: 2.0, op: 0.95 });
      const dir = arrow3(cs, P0, add3(P0, mul3(s, 1.0)), { stroke: '#c084fc', w: 2.2 });
      cs.label(add3(P0, mul3(s, 1.0)), 's', { dx: dir.ux * 18, dy: dir.uy * 18 + 5, size: 14, fill: '#c084fc' });
      cs.dot(P0, 4.6, { fill: '#ff9e4a' });
      cs.label(P0, 'P₀', { dx: -24, dy: -10, size: 13, fill: '#ff9e4a' });
      const dd = v => Math.abs(v) < 5e-3 ? '' : (v > 0 ? `-${fz(v)}` : `+${fz(Math.abs(v))}`);
      cEq(`$\\frac{x${dd(P0.x)}}{${fz(s.x)}}=\\frac{y${dd(P0.y)}}{${fz(s.y)}}=\\frac{z${dd(P0.z)}}{${fz(s.z)}}$`);
      cDir(`$(${fz(s.x)},\\ ${fz(s.y)},\\ ${fz(s.z)})$`);
      if (st.m === 0) {
        cPt(`$(${fz(P0.x)},\\ ${fz(P0.y)},\\ ${fz(P0.z)})$`);
        cJ('过定点 P₀ 且方向为 s，直线唯一；t 取遍实数扫出整条直线');
      } else {
        const P = add3(P0, mul3(s, st.t));
        cs.dot(P, 5, { fill: '#4ade80' });
        cs.label(P, 'P', { dx: 14, dy: -8, size: 13, fill: '#4ade80' });
        cs.path([P0, P], { stroke: '#4ade80', w: 1.3, op: 0.6 });
        cEq(`$x=${fz(P0.x)}+${fz(s.x)}t,\\ y=${fz(P0.y)}+${fz(s.y)}t,\\ z=${fz(P0.z)}+${fz(s.z)}t$`);
        cPt(`$t=${fz(st.t)}$`);
        cJ(`$(${fz(P.x)},\\ ${fz(P.y)},\\ ${fz(P.z)})$，$|t|$ 即 P 到 P₀ 的距离`);
      }
    } else {
      const n1 = v3(Math.cos(st.a1 * Math.PI / 180), Math.sin(st.a1 * Math.PI / 180), 0.55);
      const n2 = v3(Math.cos(st.a2 * Math.PI / 180), Math.sin(st.a2 * Math.PI / 180), -0.6);
      const c1 = 1.1, c2 = 0.7;
      const d = cross3(n1, n2);
      const dl = len3(d);
      const p1 = planePoly(n1.x, n1.y, n1.z, -c1, L);
      const p2 = planePoly(n2.x, n2.y, n2.z, -c2, L);
      if (p1.length >= 3) cs.poly(p1, { fill: '#5cadff', op: 0.13, stroke: '#5cadff', w: 1.5, lineOp: 0.8 });
      if (p2.length >= 3) cs.poly(p2, { fill: '#4ade80', op: 0.13, stroke: '#4ade80', w: 1.5, lineOp: 0.8 });
      if (dl < 1e-6) {
        cs.label(v3(0, 0, 0), '两法向量共线', { dx: 0, dy: -150, size: 14, fill: '#ff7b8a' });
        cEq('两平面平行或重合'); cDir('—'); cPt('—');
        cJ('n₁∥n₂ 时没有交线，改写方程前先核实法向量');
      } else {
        const p = mul3(add3(mul3(cross3(n2, d), c1), mul3(cross3(d, n1), c2)), 1 / (dl * dl));
        const us = unit3(d);
        cs.line(add3(p, mul3(us, -3.6)), add3(p, mul3(us, 3.6)), { stroke: '#ffd166', w: 2.1, op: 0.98 });
        cs.dot(p, 4.6, { fill: '#ff9e4a' });
        cs.label(p, 'P', { dx: 15, dy: -8, size: 13, fill: '#ff9e4a' });
        const dir = arrow3(cs, p, add3(p, mul3(us, 1.0)), { stroke: '#c084fc', w: 2.2 });
        cs.label(add3(p, mul3(us, 1.0)), 's', { dx: dir.ux * 18, dy: dir.uy * 18 + 5, size: 14, fill: '#c084fc' });
        cEq('$\\begin{cases}A_1x+B_1y+C_1z+D_1=0\\\\ A_2x+B_2y+C_2z+D_2=0\\end{cases}$');
        cDir(`$(${fz(us.x)},\\ ${fz(us.y)},\\ ${fz(us.z)})$`);
        cPt(`$(${fz(p.x)},\\ ${fz(p.y)},\\ ${fz(p.z)})$`);
        cJ('交线方向 s = n₁×n₂，再在交线上取一点即得点向式');
      }
    }
    cs.flush();
  };

  const show = (el, on) => { const q = el && (el.parentNode || el.parent); if (q) q.style.display = on ? '' : 'none'; };
  const upd = () => B.render();
  const sTh = B.slider('方向角 θ°', 20, 150, 1, st.th, v => { st.th = v; upd(); }, 'th');
  const sPh = B.slider('方位角 φ°', 0, 330, 5, st.ph, v => { st.ph = v; upd(); }, 'ph');
  const sX0 = B.slider('定点 x₀', -1.6, 1.6, 0.05, st.x0, v => { st.x0 = v; upd(); }, 'x0');
  const sT = B.slider('参数 t', -2, 2, 0.05, st.t, v => { st.t = v; upd(); }, 'tt');
  const sA1 = B.slider('平面一 法向角°', 0, 350, 5, st.a1, v => { st.a1 = v; upd(); }, 'a1');
  const sA2 = B.slider('平面二 法向角°', 0, 350, 5, st.a2, v => { st.a2 = v; upd(); }, 'a2');
  const sliders = [sTh, sPh, sX0, sT, sA1, sA2];
  const layout = m => sliders.forEach((s, j) => show(s, (m === 0 && j < 3) || (m === 1 && (j < 3 || j === 3)) || (m === 2 && j >= 4)));

  const modes = ['① 点向式', '② 参数式', '③ 两平面交线'];
  const btns = modes.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.m = i;
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    layout(i); B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  layout(0);
  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转：直线与方向向量始终同向');
  B.render();
  return B;
}
