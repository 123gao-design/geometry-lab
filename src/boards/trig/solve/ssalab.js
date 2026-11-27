import { hEl, mk, texMix, V, fmt, TAU } from '../../../lib/board.js';

import { LegendProofBoard } from '../proof-board.js';
import '../unit/angle-readings.css';
import './ssalab.css';
import panelCSS from './ssalab.css?inline';
import infoCSS from '../../info-readings.css?inline';

export function createBoard(root) {
  const B = new LegendProofBoard(root, 512, 343, 46);
  root.classList.add('trig-side-board', 'sine-law-board');
  B.proof = hEl('section', { class: 'unit-readings ssa-readings', 'aria-label': '正弦定理实时读数' });
  root.insertBefore(B.proof, B.chipRow);
  B.proofCSS = panelCSS + infoCSS;
  B.exportCheckHeight = 80;
  B.exportSize = { width: 854, height: 469 };
  const st = { c: 6, deg: 40, a: 4.2, circ: true, labs: true };
  const PL = [12, 10, 488, 328];
  const cN = B.chipM('解的个数');

  // 每组量名在上、当前值在下；近解与远解沿用左图的颜色。
  function readingGroup(title, tone, entries) {
    const fields = entries.map(([label, value]) =>
      '<div><dt>' + texMix(label) + '</dt><dd>' + texMix(value) + '</dd></div>').join('');
    return '<section style="--reading-color:var(--pj-' + tone + ')"><h4>' +
      texMix(title) + '</h4><dl>' + fields + '</dl></section>';
  }
  let lastReadings;
  const cSl = B.slider('底边 c', 3, 8, 0.05, st.c, v => { st.c = v; B.render(); }, 'c', n => `底边 $c=${n}$`);
  const aSl = B.slider('角 α°', 15, 165, 5, st.deg, v => { st.deg = v; B.render(); }, 'ag', n => `角 $\\alpha=${n}^\\circ$`);
  const dSl = B.slider('对边 a', 0.5, 8.5, 0.05, st.a, v => { st.a = v; B.render(); }, 'a', n => `对边 $a=${n}$`);
  const examples = [
    { name: '切线直角', values: { c: 6, deg: 40, a: 6 * Math.sin(40 * Math.PI / 180) } },
    { name: '两解', values: { c: 6, deg: 40, a: 4.5 } },
    { name: '$a\\ge c$ 一解', values: { c: 6, deg: 40, a: 6.3 } },
    { name: '钝角一解', values: { c: 6, deg: 110, a: 6.3 } },
  ];
  B.examples('选择例题', examples, st, values => {
    Object.assign(st, values); cSl.sync(st.c); aSl.sync(st.deg); dSl.sync(st.a); B.render();
  });
  B.toggleBtn('外接圆', true, v => { st.circ = v; B.render(); });
  B.graphToggles(st, ['labs']);

  // 外接圆只绘制框内可见的弧。
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
  // 板内字号由设置页的全局倍率统一钉住（global.css 的 svg text 读 --bd-fs），单条标签再写 font-size 不生效。
  // 所以分层换一种做法：顶点字母走 B.tex 显式排 14px，量与注释仍用 B.text 跟全局 12px；
  // B.tex 的 p 是垂直中心，按「基线 − 0.4×字号」换回原来的基线坐标，版面不动。
  const lab = (p, s, col, big) => {
    if (!st.labs) return;
    if (big) B.tex(V(p.x, p.y - 14 * 0.4), `$${s}$`, { size: 14, color: col || B.diagramColors.ink, anchor: 'mid', w: 48 });
    else B.text(V(p.x, p.y), s, { fill: col || B.diagramColors.ink, 'text-anchor': 'middle' });
  };

  B.renderFn = () => {
    const al = st.deg * Math.PI / 180, c = st.c, a = st.a;
    const h = c * Math.sin(al);                       // B 到射线的垂距
    const dir = V(Math.cos(al), Math.sin(al));
    // 解：t = c·cosα ± √(a²−h²)（先算出来，h 的标注与右栏都要用）
    const disc = a * a - h * h;
    const sols = [];
    if (disc >= -1e-9) {
      const sq = Math.sqrt(Math.max(0, disc)), tP = c * Math.cos(al) + sq, tM = c * Math.cos(al) - sq;
      if (tM > 1e-6) sols.push({ t: tM, near: true });
      if (tP > 1e-6 && (tM <= 1e-6 || tP - tM > 1e-6)) sols.push({ t: tP, near: false });
    }
    const tD = c * dir.x;
    const rayT = Math.max(2, tD, ...sols.map(sol => sol.t)) + 1.3;
    const { px: X, py: Y, s: S } = B.isoFit(
      Math.min(0, c - a, rayT * dir.x), Math.max(c + a, rayT * dir.x),
      Math.min(-a, tD * dir.y), Math.max(a, rayT * dir.y), PL, 23);
    const Ap = V(X(0), Y(0)), Bp = V(X(c), Y(0));
    const rayEnd = V(X(dir.x * rayT), Y(dir.y * rayT));
    // 底边 AB + 延长虚线；A、B 各落一枚蓝点（与 C、D 同一套「点 = 图上的关键位置」）
    B.seg(Ap, Bp, { stroke: '#5cadff', 'stroke-width': 2.4 });
    B.mark(Ap, '#5cadff');
    B.mark(Bp, '#5cadff');
    B.seg(V(X(0), Y(0)), V(X(-0.4), Y(0)), { stroke: '#3f5f8f', 'stroke-width': 1.2, 'stroke-dasharray': '3 4' });
    // 射线（角的另一边）：只是角的载体，压细一档、略透明，不与三角形的两条边抢粗细
    B.seg(V(X(0), Y(0)), rayEnd, { stroke: '#67e8f9', 'stroke-width': 1.5, 'stroke-opacity': .85 });
    angArc(Ap, 30, 0, al, { stroke: '#67e8f9', 'stroke-width': 1.4 });
    // 角标贴着弧写，字小一档才不至于被弧线穿成两截
    lab(V(X(30 * Math.cos(al / 2) / S), Y(30 * Math.sin(al / 2) / S)), `α=${st.deg}°`, '#67e8f9');
    // 以 B 为圆心 a 为半径的圆
    clipCircle(Bp.x, Bp.y, a * S, PL, { stroke: '#c084fc', 'stroke-width': 1.5, 'stroke-opacity': .55 });
    // 垂线 BD + 垂足 D：垂足在射线上的参数是 t_D = c·cosα（B 在射线上的投影），
    // h = c·sinα 是垂线段的长度，不是垂足的位置 —— 以前按 t=h 取点，画出来的是斜边，自然不垂直。
    // α 为钝角时 t_D<0，垂足落到射线的反向延长线上，补一段细虚线把这根线接上
    const D = V(tD * dir.x, tD * dir.y), Dp = V(X(D.x), Y(D.y));
    if (tD < -0.05) B.seg(V(X(0), Y(0)), Dp, { stroke: '#67e8f9', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .4 });
    B.seg(Bp, Dp, { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
    if (Math.abs(disc) > 1e-9 && Math.abs(tD) > 1e-8) B.mark(Dp, '#ffd166');
    // 垂足直角记号：一条小折线夹住「射线」与「BD」，声明这一笔是垂直而不是随手一条斜线
    {
      const dl = Math.hypot(Bp.x - Dp.x, Bp.y - Dp.y) || 1;
      const vx = (Bp.x - Dp.x) / dl, vy = (Bp.y - Dp.y) / dl;   // D → B
      const ux = dir.x, uy = -dir.y;                            // 射线方向（画布 y 向下）
      const mm = 8, x1 = Dp.x + ux * mm, y1 = Dp.y + uy * mm;
      mk('polyline', {
        points: `${x1.toFixed(1)},${y1.toFixed(1)} ${(x1 + vx * mm).toFixed(1)},${(y1 + vy * mm).toFixed(1)} ${(Dp.x + vx * mm).toFixed(1)},${(Dp.y + vy * mm).toFixed(1)}`,
        fill: 'none', stroke: '#ffd166', 'stroke-width': 1, 'stroke-opacity': .65,
      }, B.dyn);
    }
    // 垂距只写字母 h（数值交给第一个徽章）：取 BD 中点、朝远离三角形的一侧推 15px——
    // 原来把 h=… 钉在垂足右下，两解时近解 C₁ 就在垂足旁，两行字直接叠在一起
    {
      const mB = V((Bp.x + Dp.x) / 2, (Bp.y + Dp.y) / 2);
      let nx = -(Dp.y - Bp.y), ny = Dp.x - Bp.x;
      const nl = Math.hypot(nx, ny) || 1;
      nx /= nl; ny /= nl;
      const farC = sols.length ? sols[sols.length - 1] : null;
      const gx = farC ? (Ap.x + Bp.x + X(farC.t * dir.x)) / 3 : (Ap.x + Bp.x) / 2;
      const gy = farC ? (Ap.y + Bp.y + Y(farC.t * dir.y)) / 3 : Ap.y;
      if (nx * (gx - mB.x) + ny * (gy - mB.y) > 0) { nx = -nx; ny = -ny; }
      lab(V(mB.x + nx * 15, mB.y + ny * 15), 'h', '#ffd166');
    }
    // 外接圆（穿过 A、B 与远解 C₂）
    if (st.circ && sols.length) {
      const far = sols[sols.length - 1], C = V(far.t * dir.x, far.t * dir.y);
      const oy = (far.t * far.t - c * C.x) / (2 * C.y), O = V(X(c / 2), Y(oy));
      const Rpx = Math.hypot(O.x - Ap.x, O.y - Ap.y);
      clipCircle(O.x, O.y, Rpx, PL, { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-dasharray': '4 5', 'stroke-opacity': .5 });
      // 半径数值已经由右栏的 2R 竖线交代；板上只标出这是外接圆。
      // 原来把 R=… 写在圆心旁，正好压在近解 C₁ 的标签与射线上；把标签放在圆心下方 0.55R 处，
      // 整块落在外接圆内部、又避开紫圆下沿（紫圆在圆心正下方还有一段），初始态两条圆轨都不穿字
      lab(V(O.x, Math.min(PL[1] + PL[3] - 16, O.y + Rpx * 0.55)), '外接圆', '#ff9e4a');
    }
    // 逐解画三角形：近解金、远解橙
    sols.forEach((s2, i) => {
      const C = V(s2.t * dir.x, s2.t * dir.y), Cp = V(X(C.x), Y(C.y));
      const col = i === 0 && sols.length === 2 ? '#ffd166' : '#ff9e4a';
      tri(Ap, Bp, Cp, s2.near ? 'rgba(255,209,102,.05)' : 'rgba(255,158,74,.05)');
      B.seg(Bp, Cp, { stroke: col, 'stroke-width': 2.2 });
      B.seg(Ap, Cp, { stroke: col, 'stroke-width': 1.6 });
      B.mark(Cp, col);
      angArc(Cp, 22, Math.atan2(-(Ap.y - Cp.y), Ap.x - Cp.x), Math.atan2(-(Bp.y - Cp.y), Bp.x - Cp.x), { stroke: col, 'stroke-width': 1.3 });
      // 标签沿「B → C」方向推到紫圆外：C 本身落在以 B 为圆心的紫圆上，紧贴着写会压在圆轨与
      // h 的虚线上。只写 C₁ / C₂（γ 的数值交给徽章与右栏）—— 远解那一点的左右夹着射线与外接圆，
      // 两者只张开十几度，宽标签根本塞不进这条缝；短标签才放得下。两解按远近编号，一解写 C。
      const rd = Math.hypot(Cp.x - Bp.x, Cp.y - Bp.y) || 1;
      const lx = Math.max(PL[0] + 38, Math.min(PL[0] + PL[2] - 42, Cp.x + (Cp.x - Bp.x) / rd * 26));
      const ly = Math.max(22, Math.min(PL[1] + PL[3] - 10, Cp.y + (Cp.y - Bp.y) / rd * 26 + 4));
      lab(V(lx, ly), sols.length > 1 ? `C_{${i + 1}}` : 'C', col, true);
    });
    lab(V(Ap.x - 12, Ap.y + 16), 'A', B.diagramColors.ink, true); lab(V(Bp.x + 10, Bp.y + 16), 'B', B.diagramColors.ink, true);
    if (st.labs) B.text(V(Ap.x + 34, Ap.y + 16), `c=${fmt(c, 2)}`, { fill: '#5cadff' });
    const value = n => '$' + fmt(n, 2) + '$';
    let readings = readingGroup('垂距与外接圆直径', 'blue', [
      ['$h=c\\sin\\alpha$', value(h)],
      ['$2R=a/\\sin\\alpha$', sols.length ? value(a / Math.sin(al)) : '无外接圆'],
    ]);
    sols.forEach(({ t }, i) => {
      const Cp = V(X(t * dir.x), Y(t * dir.y));
      const gamma = angOf(Cp, Ap, Bp);
      const beta = Math.PI - al - gamma * Math.PI / 180;
      const near = sols.length === 2 && i === 0;
      const title = sols.length === 1 ? '解 $C$' : (near ? '近解 $C_1$' : '远解 $C_2$');
      readings += readingGroup(title, near ? 'gold' : 'orange', [
        ['$\\gamma$', '$' + fmt(gamma, 1) + '^\\circ$'],
        ['$b/\\sin\\beta$', value(t / Math.sin(beta))],
        ['$c/\\sin\\gamma$', value(c / Math.sin(gamma * Math.PI / 180))],
      ]);
      B.note(title, near ? '#ffd166' : '#ff9e4a');
    });
    if (readings !== lastReadings) {
      B.proof.innerHTML = readings;
      lastReadings = readings;
    }
    B.note('底边 $c$', '#5cadff');
    B.note('垂距 $h$', '#ffd166', 'dashed');
    // chips
    if (!sols.length) cN(a < h - 1e-9 ? `无解：$a=${fmt(a, 2)} < h=${fmt(h, 2)}$ —— 圆与射线不相交` : `无解。交点在反向延长线或射线端点，不能构成三角形。`, 'warn');
    else if (sols.length === 1 && Math.abs(disc) < 1e-9) cN(`恰一解。$a=h\\approx${fmt(h, 2)}$，圆与射线相切，得到直角三角形。`, 'ok');
    else if (sols.length === 2) cN(`两解。$h<a<c$，射线上有近交点 $C_1$ 和远交点 $C_2$。`, '');
    else cN(`恰一解（${st.deg > 90 ? '$\\alpha$ 为钝角' : '$a\\ge c$'}）：圆只交射线一次`, '');
  };
  B.render();
  B.hint('拖动滑块，观察圆与射线的交点，再比较各解的对角与边长比值。');
  return B;
}
