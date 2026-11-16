/* 图 Z1 SSA 铰链机：正弦定理 a/sinα = b/sinβ = c/sinγ = 2R，与「解的个数」同时呈现。
   已知 c=AB（底边）、角 α（在 A）、对边 a=BC —— 以 B 为圆心、a 为半径画圆，
   与角 A 的另一边（射线）交出几个点，三角形就有几解：a 与垂距 h=c·sinα 比大小定无解/一解/两解。
   右栏把 a/sinα、b/sinβ、c/sinγ、2R 画成等高条 —— 正弦定理即「四条一样高」。
   坐标：A=(0,0)、B=(c,0)，α 自 +x 轴逆时针；s=26 px/单位。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { c: 6, deg: 40, a: 4.2, circ: true, labs: true };
  const S = 26, A0 = V(60, 268);
  const PL = [16, 12, 500, 486], PR = [532, 12, 312, 486];
  const X = x => A0.x + S * x, Y = y => A0.y - S * y;
  const cN = B.chipM('解的个数'), cH = B.chipM('垂距'), cR = B.chipM('a/sinα'), cAcc = B.chipM('比例核验'), cDuo = B.chipM('两解互补');
  const cSl = B.slider('底边 c', 3, 8, 0.05, st.c, v => { st.c = v; B.render(); }, 'c');
  const aSl = B.slider('角 α°', 15, 165, 5, st.deg, v => { st.deg = v; B.render(); }, 'ag');
  const dSl = B.slider('对边 a', 0.5, 8.5, 0.05, st.a, v => { st.a = v; B.render(); }, 'a');
  const pre = (c, d, a) => () => { st.c = c; st.deg = d; st.a = a; cSl.sync(c); aSl.sync(d); dSl.sync(a); B.render(); };
  B.btn('① 切线直角', pre(6, 40, 6 * Math.sin(40 * Math.PI / 180) + 0)); // 设 a=h 需避开 0.05 步长 → 板内直接算
  B.btn('② 两解陷阱', pre(6, 40, 4.5));
  B.btnM('③ $a\\ge c$ 一解', pre(6, 40, 6.3));
  B.btn('④ 钝角一解', pre(6, 110, 6.3));   // 钝角 SSA：须 a>c 才有解（5.9<c 时交点全在反向延长线 → 无解）
  B.toggleBtn('外接圆', true, v => { st.circ = v; B.render(); });
  B.graphToggles(st, ['labs']);

  // 圆裁剪成可见折线段（防溢出左栏跑进右栏对照表）
  const clipCircle = (cx, cy, r, rect, at) => {
    const n = 220, runs = [];
    let cur = [];
    for (let i = 0; i <= n; i++) {
      const th = TAU * i / n, p = V(cx + r * Math.cos(th), cy + r * Math.sin(th));
      const ok = p.x >= rect[0] - 2 && p.x <= rect[0] + rect[2] + 2 && p.y >= rect[1] - 2 && p.y <= rect[1] + rect[3] + 2;
      if (ok) cur.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
      if ((!ok || i === n) && cur.length > 1) { runs.push(cur); cur = []; } else if (!ok) cur = [];
    }
    if (cur.length > 1) runs.push(cur);
    for (const pts of runs) mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };
  const angArc = (p, r, a0, a1, at) => {  // 角弧：a0→a1 弧度（数学方向，y 向上）
    const n = 26, pts = [];
    for (let i = 0; i <= n; i++) {
      const t = a0 + (a1 - a0) * i / n;
      pts.push(`${(p.x + r * Math.cos(t)).toFixed(1)},${(p.y - r * Math.sin(t)).toFixed(1)}`);
    }
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };
  const tri = (P, Q, R, fill) => mk('polygon', { points: `${P.x},${P.y} ${Q.x},${Q.y} ${R.x},${R.y}`, fill, stroke: 'none' }, B.dyn);
  const angOf = (P, V1, V2) => Math.acos(Math.max(-1, Math.min(1, ((V1.x - P.x) * (V2.x - P.x) + (V1.y - P.y) * (V2.y - P.y)) / (Math.hypot(V1.x - P.x, V1.y - P.y) * Math.hypot(V2.x - P.x, V2.y - P.y))))) * 180 / Math.PI;
  const lab = (p, s, col) => { if (st.labs) B.text(V(p.x, p.y), s, { 'font-size': 13, fill: col || '#e8eef7', 'text-anchor': 'middle' }); };

  B.renderFn = () => {
    const al = st.deg * Math.PI / 180, c = st.c, a = st.a;
    const h = c * Math.sin(al);                       // B 到射线的垂距
    const dir = V(Math.cos(al), Math.sin(al));
    const Ap = V(X(0), Y(0)), Bp = V(X(c), Y(0));
    const rayEnd = V(X(dir.x * 14), Y(dir.y * 14));
    // 底边 AB + 延长虚线
    B.seg(Ap, Bp, { stroke: '#5cadff', 'stroke-width': 2.4 });
    B.seg(V(X(0), Y(0)), V(X(-0.4), Y(0)), { stroke: '#3f5f8f', 'stroke-width': 1.2, 'stroke-dasharray': '3 4' });
    // 射线（角的另一边）
    B.seg(V(X(0), Y(0)), rayEnd, { stroke: '#67e8f9', 'stroke-width': 1.8, 'stroke-dasharray': '2 0' });
    angArc(Ap, 30, 0, al, { stroke: '#67e8f9', 'stroke-width': 1.4 });
    lab(V(X(30 * Math.cos(al / 2) / S), Y(30 * Math.sin(al / 2) / S)), `α=${st.deg}°`, '#67e8f9');
    // 以 B 为圆心 a 为半径的圆
    clipCircle(Bp.x, Bp.y, a * S, PL, { stroke: '#c084fc', 'stroke-width': 1.5, 'stroke-opacity': .55 });
    // 垂线 BD（h = c·sinα）+ 垂足 D
    const D = V(h * dir.x, h * dir.y), Dp = V(X(D.x), Y(D.y));
    B.seg(Bp, Dp, { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
    B.dot(Dp, 3, { fill: '#ffd166' });
    lab(V(X(D.x) + 8, Y(D.y) + 14), `h=${fmt(h, 2)}`, '#ffd166');
    // 解：t = c·cosα ± √(a²−h²)
    const disc = a * a - h * h;
    const sols = [];
    if (disc >= -1e-9) {
      const sq = Math.sqrt(Math.max(0, disc)), tP = c * Math.cos(al) + sq, tM = c * Math.cos(al) - sq;
      if (tM > 1e-6) sols.push({ t: tM, near: true });
      if (tP > 1e-6 && (tM <= 1e-6 || tP - tM > 1e-6)) sols.push({ t: tP, near: false });
    }
    // 外接圆（穿过 A、B 与远解 C₂）
    if (st.circ && sols.length) {
      const far = sols[sols.length - 1], C = V(far.t * dir.x, far.t * dir.y);
      const oy = (far.t * far.t - c * C.x) / (2 * C.y), O = V(X(c / 2), Y(oy));
      const Rpx = Math.hypot(O.x - Ap.x, O.y - Ap.y);
      clipCircle(O.x, O.y, Rpx, PL, { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-dasharray': '4 5', 'stroke-opacity': .5 });
      lab(V(O.x, O.y + (oy > 0 ? -12 : 12)), `R=${fmt(Rpx / S, 2)}`, '#ff9e4a');
    }
    // 逐解画三角形：近解金、远解橙
    sols.forEach((s2, i) => {
      const C = V(s2.t * dir.x, s2.t * dir.y), Cp = V(X(C.x), Y(C.y));
      const col = i === 0 && sols.length === 2 ? '#ffd166' : '#ff9e4a';
      tri(Ap, Bp, Cp, s2.near ? 'rgba(255,209,102,.05)' : 'rgba(255,158,74,.05)');
      B.seg(Bp, Cp, { stroke: col, 'stroke-width': 2.2 });
      B.seg(Ap, Cp, { stroke: col, 'stroke-width': 1.6 });
      B.dot(Cp, 4.5, { fill: col });
      const g = angOf(Cp, Ap, Bp);
      angArc(Cp, 22, Math.atan2(-(Ap.y - Cp.y), Ap.x - Cp.x), Math.atan2(-(Bp.y - Cp.y), Bp.x - Cp.x), { stroke: col, 'stroke-width': 1.3 });
      lab(V(Cp.x + 6, Cp.y - 8), `C${i + 1} γ=${fmt(g, 0)}°`, col);
    });
    lab(V(Ap.x - 12, Ap.y + 16), 'A'); lab(V(Bp.x + 10, Bp.y + 16), 'B');
    if (st.labs) B.text(V(Ap.x + 34, Ap.y + 16), `c=${fmt(c, 2)}`, { 'font-size': 12, fill: '#5cadff' });
    // 右栏：比例对照表 —— a/sinα、b/sinβ、c/sinγ、c/sinγ₂、2R 画成等高条
    const alR = al, sinAl = Math.sin(alR);
    const bars = sols.length ? [{ tex: '$a/\\sin\\alpha$', v: a / sinAl }] : [];
    for (let i = 0; i < sols.length; i++) {
      const s2 = sols[i], C = V(s2.t * dir.x, s2.t * dir.y);
      const bLen = s2.t;
      const gA = angOf(V(X(C.x), Y(C.y)), Ap, Bp) * Math.PI / 180;
      bars.push({ tex: sols.length > 1 ? `$b_${i + 1}/\\sin\\beta_${i + 1}$` : '$b/\\sin\\beta$', v: bLen / Math.sin(Math.PI - alR - gA) });
      bars.push({ tex: sols.length > 1 ? `$c/\\sin\\gamma_${i + 1}$` : '$c/\\sin\\gamma$', v: c / Math.sin(gA) });
    }
    if (st.circ && sols.length) {
      const far = sols[sols.length - 1], C = V(far.t * dir.x, far.t * dir.y);
      const oy = (far.t * far.t - c * C.x) / (2 * C.y), R = Math.hypot(X(c / 2) - Ap.x, Y(oy) - Ap.y) / S;
      bars.push({ tex: '$2R$', v: 2 * R });
    }
    B.tex(V(PR[0] + PR[2] / 2, 36), '正弦定理对照表', { size: 14, color: '#93a1b5', anchor: 'mid', w: 240 });
    const mx = Math.max(...bars.map(b2 => b2.v)) * 1.28, bw = 38, gap = 12, x0 = PR[0] + 26, yBot = PR[1] + 400;
    bars.forEach((b2, i) => {
      const hh = b2.v / mx * 350, x = x0 + i * (bw + gap);
      mk('rect', { x, y: yBot - hh, width: bw, height: hh, fill: i === 0 ? '#5cadff' : '#67e8f9', 'fill-opacity': .8, stroke: 'none' }, B.dyn);
      B.tex(V(x + bw / 2, yBot + 18), b2.tex, { size: 12, anchor: 'mid', w: 60 });
      B.tex(V(x + bw / 2, yBot - hh - 12), fmt(b2.v, 2), { size: 11, color: '#93a1b5', anchor: 'mid', w: 60 });
    });
    // chips
    if (!sols.length) cN(a < h - 1e-9 ? `无解：$a=${fmt(a, 2)} < h=${fmt(h, 2)}$ —— 圆与射线不相交` : `无解（α 为钝角）：交点全落在反向延长线（t<0 排除）—— 钝角须 a>c 才有解`, 'warn');
    else if (sols.length === 1 && Math.abs(a - h) < 0.04) cN(`恰一解（切线）：a=h=${fmt(h, 2)} —— 直角三角形`, 'ok');
    else if (sols.length === 2) cN(`两解！${fmt(a, 2)} 介于 h=${fmt(h, 2)} 与 c=${fmt(c, 2)} 之间 —— 近解 C₁、远解 C₂ 都列出`, '');
    else cN(`恰一解（${st.deg > 90 ? 'α 为钝角' : '$a\\ge c$'}）：圆只交射线一次`, '');
    cH(`$h=c\\sin\\alpha=${fmt(c, 2)}\\times${fmt(Math.sin(al), 3)}=${fmt(h, 2)}$ 对边 $a=${fmt(a, 2)}$ ${a < h - 1e-9 ? '< h 无解' : a > h + 1e-9 ? '> h 有解' : '= h 相切'}`, a < h - 1e-9 ? 'warn' : '');
    cR(`$\\frac{a}{\\sin\\alpha}=${fmt(a / Math.sin(al), 2)}$`, 'ok');
    const vs = bars.map(b2 => b2.v), mean = vs.reduce((p, q) => p + q, 0) / vs.length;
    cAcc(vs.length ? `${vs.length} 条${vs.every(v2 => Math.abs(v2 - mean) < 0.02) ? '一样高 —— a/sinα=b/sinβ=c/sinγ=2R（ok）' : '高度不齐？'}` : '无三角形可构成', vs.length && vs.every(v2 => Math.abs(v2 - mean) < 0.02) ? 'ok' : 'warn');
    if (sols.length === 2) {
      const g1 = angOf(V(X(sols[0].t * dir.x), Y(sols[0].t * dir.y)), Ap, Bp), g2 = angOf(V(X(sols[1].t * dir.x), Y(sols[1].t * dir.y)), Ap, Bp);
      cDuo(`$\\gamma_1+\\gamma_2=${fmt(g1 + g2, 0)}°$ —— 同高改判（H2 折叠机）`, Math.abs(g1 + g2 - 180) < 0.5 ? 'ok' : 'warn');
    } else cDuo(sols.length === 1 && Math.abs(a - h) < 0.04 ? '切线态：γ=90°，b/sinβ 即 a/sinα 本身' : '两解时启用：两个 γ 互补', '');
  };
  B.render();
  B.hint('拖 a 与 α：以 B 为圆心的紫圆与射线交几点，三角形就有几解；右栏各比值相等 —— 这就是正弦定理');
  return B;
}
