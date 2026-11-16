/* 图 弦2 · 切线的判定与弦切角
   圆 O 半径 3。T 为切点，切线过 T 且垂直于 OT；TC 是一条弦；D 是弦 TC 另一侧弧上的点。
   弦切角（切线与弦 TC 的夹角）恒等于圆周角 ∠TDC。
   切线射线 u 取在「不含 D 的那段弧」一侧：从 T 逆时针走到 C 若经过 D，则取顺时针方向。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const R = 3;
  const st = { t: 1.9, c: 0.5, d: 5.4, grid: true, labs: true };
  const m = B.isoFit(-4.1, 4.1, -3.2, 3.2, [44, 30, 760, 390], 10);
  const cTan = B.chipM('切线与半径'), cC = B.chipM('弦切角'), cI = B.chipM('圆周角'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const deg = rad => rad * 180 / Math.PI;
  const pt = a => V(m.px(R * Math.cos(a)), m.py(R * Math.sin(a)));
  const P = a => V(R * Math.cos(a), R * Math.sin(a));
  const norm = a => { while (a < 0) a += 2 * Math.PI; while (a >= 2 * Math.PI) a -= 2 * Math.PI; return a; };
  const ccwCovers = (a1, a2, x) => {
    const d1 = norm(a2 - a1), dx = norm(x - a1);
    return dx > 0 && dx < d1;
  };
  const arcPath = (cx, cy, rad, a1, a2, N = 32) => {
    const out = [];
    const d = norm(a2 - a1);
    for (let i = 0; i <= N; i++) {
      const t2 = a1 + (d - (d > Math.PI ? 2 * Math.PI : 0)) * i / N;
      const p = V(m.px(cx + rad * Math.cos(t2)), m.py(cy + rad * Math.sin(t2)));
      out.push((i ? 'L' : 'M') + p.x.toFixed(2) + ' ' + p.y.toFixed(2));
    }
    return out.join(' ');
  };
  const sep = (a, b) => Math.abs(norm(a - b) > Math.PI ? 2 * Math.PI - norm(a - b) : norm(a - b));

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(pt(a1), pt(a2), { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    }
    const T = P(st.t), C = P(st.c), D = P(st.d), O = V(0, 0);
    // 切线：方向垂直于 OT
    const ux = -Math.sin(st.t), uy = Math.cos(st.t);
    const tanP = (sgn) => V(T.x + sgn * ux * 4.4, T.y + sgn * uy * 4.4);
    B.seg(V(m.px(tanP(-1).x), m.py(tanP(-1).y)), V(m.px(tanP(1).x), m.py(tanP(1).y)),
      { stroke: '#ff9e4a', 'stroke-width': 2.2, 'stroke-opacity': .95 });
    // 半径 OT
    B.seg(V(m.px(0), m.py(0)), V(m.px(T.x), m.py(T.y)), { stroke: '#5cadff', 'stroke-width': 1.6 });
    // 弦 TC 与 D 的两条线
    B.seg(V(m.px(T.x), m.py(T.y)), V(m.px(C.x), m.py(C.y)), { stroke: '#7ee787', 'stroke-width': 2.4 });
    B.seg(V(m.px(D.x), m.py(D.y)), V(m.px(T.x), m.py(T.y)), { stroke: '#c084fc', 'stroke-width': 1.6 });
    B.seg(V(m.px(D.x), m.py(D.y)), V(m.px(C.x), m.py(C.y)), { stroke: '#c084fc', 'stroke-width': 1.6 });

    // T 处直角标记（OT 与切线）
    const r0 = 0.26;
    const p1 = V(T.x + r0 * (O.x - T.x) / R, T.y + r0 * (O.y - T.y) / R);
    const p2 = V(p1.x + r0 * ux, p1.y + r0 * uy);
    const p3 = V(T.x + r0 * ux, T.y + r0 * uy);
    mk('polyline', {
      points: [p1, p2, p3].map(p => m.px(p.x).toFixed(2) + ',' + m.py(p.y).toFixed(2)).join(' '),
      fill: 'none', stroke: '#8fa3bd', 'stroke-width': 1.2,
    }, B.dyn);

    // 弦切角：选不含 D 的那段弧一侧的切线射线
    const u = ccwCovers(st.t, st.c, st.d) ? V(Math.sin(st.t), -Math.cos(st.t)) : V(-Math.sin(st.t), Math.cos(st.t));
    let a1 = Math.atan2(u.y, u.x), a2 = Math.atan2(C.y - T.y, C.x - T.x);
    let dl = norm(a2 - a1);
    mk('path', { d: arcPath(T.x, T.y, 0.65, a1, a1 + (dl > Math.PI ? dl - 2 * Math.PI : dl)),
      fill: 'none', stroke: '#ff9e4a', 'stroke-width': 2.2 }, B.dyn);

    // 圆周角 ∠TDC
    let b1 = Math.atan2(T.y - D.y, T.x - D.x), b2 = Math.atan2(C.y - D.y, C.x - D.x);
    let dl2 = norm(b2 - b1);
    mk('path', { d: arcPath(D.x, D.y, 0.62, b1, b1 + (dl2 > Math.PI ? dl2 - 2 * Math.PI : dl2)),
      fill: 'none', stroke: '#c084fc', 'stroke-width': 2.2 }, B.dyn);

    // 点与字母
    const dot = (p, color, lab, dx, dy) => {
      B.dot(V(m.px(p.x), m.py(p.y)), 4.5, { fill: color, stroke: '#0a0d14', 'stroke-width': 1 });
      B.text(V(m.px(p.x) + dx, m.py(p.y) + dy), lab, { 'font-size': 13, 'font-weight': 700, fill: color });
    };
    B.dot(V(m.px(0), m.py(0)), 4.5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(m.px(0) + 8, m.py(0) + 15), 'O', { 'font-size': 13, 'font-weight': 700, fill: '#5cadff' });
    dot(T, '#ff9e4a', 'T', 9, -8);
    dot(C, '#7ee787', 'C', 9, -8);
    dot(D, '#c084fc', 'D', 9, 16);

    // 读数
    const w = V(C.x - T.x, C.y - T.y);
    const wl = Math.hypot(w.x, w.y);
    const vt = V(T.x - D.x, T.y - D.y), vc = V(C.x - D.x, C.y - D.y);
    const ok = wl > 0.08 && Math.hypot(vt.x, vt.y) > 0.08 && Math.hypot(vc.x, vc.y) > 0.08;
    const angTan = ok ? Math.acos(Math.max(-1, Math.min(1, (u.x * w.x + u.y * w.y) / wl))) : NaN;
    const angIn = ok ? Math.acos(Math.max(-1, Math.min(1, (vt.x * vc.x + vt.y * vc.y) / (Math.hypot(vt.x, vt.y) * Math.hypot(vc.x, vc.y))))) : NaN;
    cTan(`切线过 $T$ 且 $OT\\perp$ 切线，$OT=${fz(R)}$`);
    cC(ok ? `$${fmt(deg(angTan), 1)}^\\circ$` : '端点重合，角无定义');
    cI(ok ? `$${fmt(deg(angIn), 1)}^\\circ$` : '端点重合，角无定义');
    cJ('弦切角等于它所夹弧对的圆周角，两角读数逐位一致');
    if (sep(st.d, st.t) < 0.22 || sep(st.d, st.c) < 0.22) cJ('D 太靠近弦端点，请把 D 移回另一段弧上');
  };

  const PRE = [
    { nm: '① 一般位置', v: [1.9, 0.5, 5.4] },
    { nm: '② 弦为直径', v: [1.9, 1.9 + Math.PI, 4.6] },
    { nm: '③ 小弦切角', v: [2.2, 1.6, 4.9] },
  ];
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.t, st.c, st.d] = o.v;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  const mkHandle = (key, color, label, lo) => B.handle({
    color, r: 7, label, lo,
    get: () => V(m.px(R * Math.cos(st[key])), m.py(R * Math.sin(st[key]))),
    set: p => {
      let a = Math.atan2((m.py(0) - p.y) / m.s, (p.x - m.px(0)) / m.s);
      st[key] = norm(a);
    },
  });
  mkHandle('t', '#ff9e4a', 'T', [10, -10]);
  mkHandle('c', '#7ee787', 'C', [10, -10]);
  mkHandle('d', '#c084fc', 'D', [10, -10]);

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖 T 改切点、拖 C 改弦、拖 D 沿另一段弧走：橙色弦切角与紫色圆周角读数始终相同');
  B.render();
  return B;
}
