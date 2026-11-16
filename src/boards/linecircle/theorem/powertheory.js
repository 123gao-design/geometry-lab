/* 图 弦3 · 切线长定理与圆幂定理
   圆 O 半径 R=3。三档共用圆幂：
   ① 相交弦：P 在圆内，两条过 P 的弦 AB、CD，PA·PB=PC·PD=R²−OP²；
   ② 切割线：P 在圆外，割线交圆于 A、B，切线切于 T，PA·PB=PT²=OP²−R²；
   ③ 两切线：P 在圆外，两条切线长 PT₁=PT₂，且 OP 平分夹角，同时 PA·PB=PT₁²。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const R = 3;
  const st = { mode: 0, px: 0.8, py: 0.5, phi: 1.1, grid: true, labs: true };
  const m = B.isoFit(-4.6, 4.6, -3.2, 3.2, [44, 30, 760, 390], 10);
  const cF = B.chipM('圆幂式'), cR = B.chipM('读数'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const pt = p => V(m.px(p.x), m.py(p.y));
  const inter = (Q, u) => {
    const b = Q.x * u.x + Q.y * u.y, c = Q.x * Q.x + Q.y * Q.y - R * R;
    const disc = b * b - c;
    if (disc < 1e-9) return null;
    const s = Math.sqrt(disc);
    const at = t => V(Q.x + t * u.x, Q.y + t * u.y);
    return [at(-b - s), at(-b + s)];
  };
  const tanPts = Q => {
    const L2 = Q.x * Q.x + Q.y * Q.y;
    if (L2 <= R * R + 1e-9) return null;
    const k = R * R / L2, off = R * Math.sqrt(L2 - R * R) / L2;
    return [V(k * Q.x - off * Q.y, k * Q.y + off * Q.x), V(k * Q.x + off * Q.y, k * Q.y - off * Q.x)];
  };
  const unit = (a, b) => {
    const L = Math.hypot(b.x - a.x, b.y - a.y) || 1e-6;
    return V((b.x - a.x) / L, (b.y - a.y) / L);
  };
  const clampP = () => {
    const L = Math.hypot(st.px, st.py) || 1e-6;
    const ux = st.px / L, uy = st.py / L;
    if (st.mode === 0) {
      const lim = 2.2;
      if (L > lim) { st.px = ux * lim; st.py = uy * lim; }
    } else {
      const lo = 3.5, hi = 4.3;
      const nl = Math.min(hi, Math.max(lo, L));
      st.px = ux * nl; st.py = uy * nl;
    }
  };
  const lab = (p, s, color, dx = 9, dy = -8) => {
    B.dot(pt(p), 4.2, { fill: color, stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(pt(p).x + dx, pt(p).y + dy), s, { 'font-size': 12.5, 'font-weight': 700, fill: color });
  };

  B.renderFn = () => {
    clampP();
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(pt(V(R * Math.cos(a1), R * Math.sin(a1))), pt(V(R * Math.cos(a2), R * Math.sin(a2))),
        { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    }
    B.dot(pt(V(0, 0)), 4.5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(pt(V(0, 0)).x + 8, pt(V(0, 0)).y + 15), 'O', { 'font-size': 13, 'font-weight': 700, fill: '#5cadff' });

    const P = V(st.px, st.py);
    const u1 = V(Math.cos(st.phi), Math.sin(st.phi));
    const u2 = V(-Math.sin(st.phi), Math.cos(st.phi));

    if (st.mode === 0) {
      const c1 = inter(P, u2), c2 = inter(P, u1);
      if (c1 && c2) {
        B.seg(pt(c1[0]), pt(c1[1]), { stroke: '#ff9e4a', 'stroke-width': 2.6, 'stroke-opacity': .95 });
        B.seg(pt(c2[0]), pt(c2[1]), { stroke: '#7ee787', 'stroke-width': 2.6, 'stroke-opacity': .95 });
        lab(c1[0], 'A', '#ff9e4a'); lab(c1[1], 'B', '#ff9e4a', 9, 16);
        lab(c2[0], 'C', '#7ee787'); lab(c2[1], 'D', '#7ee787', 9, 16);
        const PA = Math.hypot(c1[0].x - P.x, c1[0].y - P.y), PB = Math.hypot(c1[1].x - P.x, c1[1].y - P.y);
        const PC = Math.hypot(c2[0].x - P.x, c2[0].y - P.y), PD = Math.hypot(c2[1].x - P.x, c2[1].y - P.y);
        cF(`$PA\\cdot PB=PC\\cdot PD=R^2-OP^2$，$R^2-OP^2=${fz(R * R - P.x * P.x - P.y * P.y)}$`);
        cR(`$PA\\cdot PB=${fz(PA * PB)}$，$PC\\cdot PD=${fz(PC * PD)}$`);
        cJ('两条弦在圆内相交，交点两侧的线段乘积相等');
      }
    } else if (st.mode === 1) {
      const sec = inter(P, u1);
      const tps = tanPts(P);
      if (sec && tps) {
        const [An, Bf] = sec;
        B.seg(pt(An), pt(Bf), { stroke: '#5cadff', 'stroke-width': 2.4, 'stroke-opacity': .95 });
        lab(An, 'A', '#5cadff', -14, -8); lab(Bf, 'B', '#5cadff', 9, -8);
        B.seg(pt(P), pt(tps[0]), { stroke: '#c084fc', 'stroke-width': 2.2 });
        B.seg(pt(P), pt(tps[1]), { stroke: '#c084fc', 'stroke-width': 2.2 });
        lab(tps[0], 'T₁', '#c084fc', 9, -8); lab(tps[1], 'T₂', '#c084fc', 9, 16);
        const PA = Math.hypot(An.x - P.x, An.y - P.y), PB = Math.hypot(Bf.x - P.x, Bf.y - P.y);
        const PT = Math.hypot(tps[0].x - P.x, tps[0].y - P.y);
        cF(`$PA\\cdot PB=PT^2=OP^2-R^2$，$OP^2-R^2=${fz(P.x * P.x + P.y * P.y - R * R)}$`);
        cR(`$PA\\cdot PB=${fz(PA * PB)}$，$PT^2=${fz(PT * PT)}$，$PT_1=PT_2=${fz(PT)}$`);
        cJ('割线两段之积等于切线长的平方');
      } else {
        cF(`$PA\\cdot PB=PT^2=OP^2-R^2$，$OP^2-R^2=${fz(P.x * P.x + P.y * P.y - R * R)}$`);
        cR('这个方向上直线与圆没有公共点');
        cJ('转 φ 让割线穿过圆，乘积才会出现', 'warn');
      }
    } else {
      const tps = tanPts(P);
      if (tps) {
        for (const T of tps) {
          B.seg(pt(V(0, 0)), pt(T), { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .8 });
          B.seg(pt(P), pt(T), { stroke: '#c084fc', 'stroke-width': 2.4, 'stroke-opacity': .95 });
          // 切点处的直角标记：半径与切线垂直
          const d1 = unit(V(0, 0), T), d2 = unit(T, P), e = 0.2;
          const q1 = V(T.x + d1.x * e, T.y + d1.y * e), q2 = V(T.x + d2.x * e, T.y + d2.y * e);
          const q3 = V(q1.x + d2.x * e, q1.y + d2.y * e);
          B.seg(pt(q1), pt(q3), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
          B.seg(pt(q2), pt(q3), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
          // 等长刻度：两条切线各一道
          const mid = V((P.x + T.x) / 2, (P.y + T.y) / 2);
          const nrm = V(-d2.y, d2.x);
          B.seg(pt(V(mid.x - nrm.x * 0.14, mid.y - nrm.y * 0.14)), pt(V(mid.x + nrm.x * 0.14, mid.y + nrm.y * 0.14)),
            { stroke: '#c084fc', 'stroke-width': 1.6 });
        }
        lab(tps[0], 'T₁', '#c084fc', 9, -8); lab(tps[1], 'T₂', '#c084fc', 9, -8);
        const L = Math.hypot(P.x, P.y), PT = Math.sqrt(Math.max(0, L * L - R * R));
        const half = Math.asin(Math.min(1, R / L)) * 180 / Math.PI;
        cF(`$PT_1=PT_2=\\sqrt{OP^2-R^2}$，$OP^2-R^2=${fz(L * L - R * R)}$`);
        cR(`$PT_1=PT_2=${fz(PT)}$，$OP=${fz(L)}$`);
        cJ(`两条切线长相等，$OP$ 平分 $\\angle T_1PT_2=${fz(2 * half)}^\\circ$`);
      }
    }
    lab(P, 'P', '#ff7b8a', 9, -8);

    // OP 连线（模式 2、3 用作角平分线的提示）
    if (st.mode !== 0) {
      B.seg(pt(V(0, 0)), pt(P), { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .8 });
    }
  };

  const MODE = [
    { nm: '① 相交弦', v: [0, 0.8, 0.5, 1.1] },
    { nm: '② 切割线', v: [1, 4, 1.2, 3.5] },
    { nm: '③ 两切线', v: [2, 3.8, -1, 2] },
  ];
  let sF;
  const btns = MODE.map((o, i) => B.btn(o.nm, () => {
    [st.mode, st.px, st.py, st.phi] = o.v;
    sF.sync(st.phi * 180 / Math.PI);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.handle({
    color: '#ff7b8a', r: 7, label: 'P', lo: [10, -10],
    get: () => pt(V(st.px, st.py)),
    set: p => {
      st.px = (p.x - m.px(0)) / m.s;
      st.py = (m.py(0) - p.y) / m.s;
    },
  });

  sF = B.slider('方向 φ°', 0, 350, 5, st.phi * 180 / Math.PI, v => { st.phi = v * Math.PI / 180; B.render(); }, 'pphi');

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖 P 或转 φ：相交弦两侧乘积相等，圆外则两段之积等于切线长平方，两条切线长恒等');
  B.render();
  return B;
}
