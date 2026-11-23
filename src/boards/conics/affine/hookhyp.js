/* 图 A5 · 对勾函数机：y = ax + b/x 是一条真的双曲线（单位坐标，v 向上为正，S px/单位）
   对勾函数 = A4 母本 y = b/x 经剪切 T(u,v)=(u, v+au) 的像：两条坐标轴渐近线被剪成 x=0 与 y=ax。
   全套数据（a>0, b>0，s=√(1+a²)）：
   · 渐近线锐夹角 ψ = 90° − arctan a；实轴平分 ψ，方向角 β = (90°+arctan a)/2（斜率 a+s）；
   · 半轴 A = √(2b(s+a))、B = √(2b(s−a))、半焦距 c = 2√(b·s)；
   · 离心率 e = c/A = sec(ψ/2) —— 只依赖 a（勾的倾角），b 只管缩放；a=0 退化为母本（e=√2），a→∞ 时 e→1。
   注意：双曲线顶点（实轴上、离中心最近）≠ 函数最小值点「勾底」(√(b/a), 2√(ab))（切线水平处）。 */
import { mk, V, dist, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = createConicLab(root, W, H);
  const C = V(400, 245), S = 42;
  const st = { a: 1, b: 1, x: 2.2, run: false, dir: 1 };

  const s = () => Math.sqrt(1 + st.a * st.a);
  const psi = () => Math.PI / 2 - Math.atan(st.a);
  const beta = () => (Math.PI / 2 + Math.atan(st.a)) / 2;
  const bigA = () => Math.sqrt(2 * st.b * (s() + st.a));
  const bigB = () => Math.sqrt(2 * st.b * (s() - st.a));
  const cf = () => 2 * Math.sqrt(st.b * s());
  const axis = () => V(Math.cos(beta()), -Math.sin(beta()));   // 实轴方向（屏幕）
  const Fp = () => V(C.x + S * cf() * axis().x, C.y + S * cf() * axis().y);
  const Fn = () => V(C.x - S * cf() * axis().x, C.y - S * cf() * axis().y);
  const V0 = () => V(C.x + S * bigA() * axis().x, C.y + S * bigA() * axis().y);
  const P = () => V(C.x + S * st.x, C.y - S * (st.a * st.x + st.b / st.x));

  const cDef = B.chip('双曲线第一定义'), cE = B.chip('离心率 e'), cAB = B.chip('半轴与半焦距'), cVx = B.chip('顶点 vs 勾底');
  B.btn('换支', () => { st.x = -st.x; B.render(); });
  B.toggleBtnM('▶ 演化 a：$\\sqrt{2}\\to 1$', false, on => { st.run = on; });
  const sA = B.slider('a（勾的倾角）', 0, 2.5, 0.02, st.a, v => { st.a = v; B.render(); });
  B.slider('b（缩放）', 0.2, 3, 0.05, st.b, v => { st.b = v; B.render(); });

  B.renderFn = () => {
    const p = P(), fp = Fp(), fn = Fn(), v0 = V0();
    // 轴
    B.seg(V(16, C.y), V(W - 16, C.y), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    B.seg(V(C.x, 16), V(C.x, H - 16), { stroke: plotInk.axis, 'stroke-width': 1.3 });
    // 曲线 y = ax + b/x（按列采样，越界断笔）
    const segs = []; let cur = [];
    for (let px = 8; px <= W - 8; px += 3) {
      const u = (px - C.x) / S;
      if (Math.abs(u) < 0.045) { if (cur.length > 1) segs.push(cur); cur = []; continue; }
      const sy = C.y - S * (st.a * u + st.b / u);
      if (sy < -80 || sy > H + 80) { if (cur.length > 1) segs.push(cur); cur = []; continue; }
      cur.push(`${px.toFixed(1)},${sy.toFixed(1)}`);
    }
    if (cur.length > 1) segs.push(cur);
    for (const sg of segs) mk('polyline', { points: sg.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.4 }, B.dyn);
    B.text(V(26, 34), 'y = ax + b/x', { fill: plotInk.teal, 'font-size': 12.5, 'font-weight': 700, 'text-anchor': 'start' });
    // 渐近线 x=0 与 y=ax
    B.seg(V(C.x, 16), V(C.x, H - 16), { stroke: plotInk.guide, 'stroke-width': 1.2, 'stroke-dasharray': '7 5' });
    B.inf(C, V(C.x + 120, C.y - 120 * st.a), { stroke: plotInk.guide, 'stroke-width': 1.2, 'stroke-dasharray': '7 5' });
    B.text(V(C.x - 10, 30), 'x=0', { fill: plotInk.guide, 'font-size': 11.5, 'text-anchor': 'end' });
    B.text(V(C.x + 250, C.y - 250 * st.a - 8), 'y=ax', { fill: plotInk.guide, 'font-size': 11.5 });
    // ψ 夹角弧
    const ps = psi();
    if (ps > 0.02) {
      const arc = [];
      for (let w = -Math.PI / 2; w <= -Math.PI / 2 + ps + 1e-9; w += ps / 24)
        arc.push(`${(C.x + 72 * Math.cos(w)).toFixed(1)},${(C.y + 72 * Math.sin(w)).toFixed(1)}`);
      mk('polyline', { points: arc.join(' '), fill: 'none', stroke: plotInk.green, 'stroke-width': 1.6 }, B.dyn);
      const am = -Math.PI / 2 + ps / 2;
      B.text(V(C.x + 92 * Math.cos(am), C.y + 92 * Math.sin(am)), `ψ=${fmt(ps * 180 / Math.PI, 0)}°`, { fill: plotInk.green, 'font-size': 11.5, 'font-weight': 700 });
    }
    // 实轴（角平分线）与两焦点、顶点
    B.inf(C, V(C.x + 420 * axis().x, C.y + 420 * axis().y), { stroke: plotInk.amber, 'stroke-width': 1.3, 'stroke-dasharray': '9 5' });
    B.text(V(C.x + 205 * axis().x + 8, C.y + 205 * axis().y), '实轴（平分 ψ）', { fill: plotInk.amber, 'font-size': 11, 'text-anchor': 'start' });
    for (const [f, nm] of [[fn, 'F₁'], [fp, 'F₂']]) {
      B.dot(f, 5.5, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.8 });
      B.text(V(f.x - 8 * axis().x, f.y - 8 * axis().y + 14), nm, { fill: plotInk.amber, 'font-size': 12, 'font-weight': 700 });
    }
    B.dot(v0, 5, { fill: plotInk.amber, stroke: plotInk.ink, 'stroke-width': 1.6 });
    B.text(V(v0.x + 12 * axis().x, v0.y - 10), '顶点', { fill: plotInk.amber, 'font-size': 11.5, 'font-weight': 700 });
    // 勾底（函数最小值点，切线水平）——与顶点不是同一点！
    if (st.a >= 0.02) {
      const xm = Math.sqrt(st.b / st.a), ym = 2 * Math.sqrt(st.a * st.b);
      const g = V(C.x + S * xm, C.y - S * ym);
      B.seg(V(g.x - 34, g.y), V(g.x + 34, g.y), { stroke: plotInk.green, 'stroke-width': 1.6 });
      B.dot(g, 5, { fill: plotInk.green, stroke: plotInk.ink, 'stroke-width': 1.6 });
      B.text(V(g.x + 12, g.y + 18), '勾底（最小值）', { fill: plotInk.green, 'font-size': 11.5, 'font-weight': 700 });
      const vlx = bigA() * Math.cos(beta()), vly = bigA() * Math.sin(beta());
      cVx(`顶点 (${fmt(vlx, 2)}, ${fmt(vly, 2)}) ≠ 勾底 (${fmt(xm, 2)}, ${fmt(ym, 2)})`, '');
    } else {
      cVx('a=0：退化为 y=b/x（A4 母本，e=√2），无勾底', 'ok');
    }
    // P 与焦半径
    B.seg(fn, p, { stroke: plotInk.rose, 'stroke-width': 2 });
    B.seg(fp, p, { stroke: plotInk.rose, 'stroke-width': 2 });
    B.dot(p, 6.5, { fill: plotInk.teal, stroke: plotInk.ink, 'stroke-width': 2 });
    // 读数（数学单位）
    const r1 = dist(p, fn) / S, r2 = dist(p, fp) / S, A2 = 2 * bigA();
    cDef(`| ‑PF₁‑ − ‑PF₂‑ | = ${fmt(Math.abs(r1 - r2), 2)} vs 2A = ${fmt(A2, 2)}`, Math.abs(Math.abs(r1 - r2) - A2) < 0.02 ? 'ok' : 'warn');
    const e1 = cf() / bigA(), e2 = 1 / Math.cos(ps / 2);
    cE(`e = c/A = ${fmt(e1, 3)} = sec(ψ/2)（ψ=${fmt(ps * 180 / Math.PI, 1)}°）`, Math.abs(e1 - e2) < 0.004 ? 'ok' : 'warn');
    cAB(`A=${fmt(bigA(), 2)}, B=${fmt(bigB(), 2)}, c=${fmt(cf(), 2)} —— A²=2b(s+a)、B²=2b(s−a)、c²=4bs：b 只缩放`, '');
    B.hint('对勾函数是 y=b/x 的剪切像：两条渐近线被剪成 x=0 与 y=ax；勾底不是顶点 —— 顶点在角平分线上');
  };

  const step = () => {
    if (st.run) {
      st.a += 0.013 * st.dir;
      if (st.a > 2.5) { st.a = 2.5; st.dir = -1; }
      if (st.a < 0) { st.a = 0; st.dir = 1; }
      sA.sync(st.a); B.render();
    }
    B.raf(step);
  };
  B.handle({
    get: P,
    set: q => { const u = (q.x - C.x) / S; st.x = (u >= 0 ? 1 : -1) * Math.max(0.08, Math.abs(u)); },
    color: plotInk.teal, r: 8, label: 'P', lo: [12, -12],
  });

  B.render();
  B.raf(step);
  return B;
}
