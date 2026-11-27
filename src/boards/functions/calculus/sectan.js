/* 图 V1 · 割线逼近机：平均变化率 → 瞬时变化率，导数的诞生。
   P 锁在曲线上（切点 x0），Q 由 Δx 驱动：橙割线 vs 金切线（斜率 f′(x0)）。
   Δx 可正可负（两侧逼近都可走）；Δx=0 割线排除 —— 极限管「趋近」不管「抵达」。
   「⏩ Q 滑向 P」动画：|Δx| 每帧 ×0.92 收缩到 0.02 停，读数滑向 f′。整框 isoFit 等单位。 */
import { V, fmt } from '../../../lib/board.js';
import { presetRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');

  const PRESETS = [
    { name: '平方', formula: '$f=x^2$', f: x => x * x, fp: x => 2 * x, xa: -1.7, xb: 3.4, ya: -1.3, yb: 11.9, lo: -1.4, hi: 3.1 },
    { name: '三次', formula: '$f=\\tfrac{x^3}{3}$', f: x => x * x * x / 3, fp: x => x * x, xa: -2.9, xb: 2.9, ya: -3.7, yb: 3.7, lo: -2.6, hi: 2.6 },
    { name: '对数', formula: '$f=\\ln x$', f: x => Math.log(x), fp: x => 1 / x, xa: -1, xb: 6.6, ya: -3, yb: 3, lo: 0.35, hi: 6.3, dom: 0 },
  ];
  const st = { p: 0, x0: 1, dx: 1.5, grid: true, labs: true };

  const cP = B.readout('坐标核验'), cK = B.readout('割线斜率', 'gold'), cT = B.readout('切线斜率', 'mint'), cV = B.chipM('极限判读');

  B.renderFn = () => {
    const marks = [];
    const P = PRESETS[st.p];
    const x0 = st.x0, y0 = P.f(x0), d0 = P.fp(x0);
    const xq = x0 + st.dx;
    const inDom = P.dom == null || xq > P.dom;
    const yq = inDom ? P.f(xq) : NaN;
    const bad = Math.abs(st.dx) < 1e-9 || !inDom || !isFinite(yq);

    const ys = [P.ya, P.yb, y0, ...(Number.isFinite(yq) ? [yq] : [])];
    const M = B.isoFit(Math.min(P.xa, xq), Math.max(P.xb, xq), Math.min(...ys), Math.max(...ys));
    const step = Math.max(1, Math.ceil((M.Y1 - M.Y0) / 16));
    B.grid({ ...M, sx: step, sy: step, grid: st.grid, labs: st.labs });
    B.plot(P.f, M, { anchors: [x0, xq], stroke: '#5cadff', 'stroke-width': 2.2 });

    // Δx/Δy 虚线三角 + Q 点 + 割线（Q 在视野内才画）
    if (!bad && xq > M.X0 && xq < M.X1 && yq > M.Y0 && yq < M.Y1) {
      B.seg(V(M.px(x0), M.py(y0)), V(M.px(xq), M.py(y0)), { stroke: '#3f5f8f', 'stroke-dasharray': '4 4', 'stroke-width': 1.2 });
      B.seg(V(M.px(xq), M.py(y0)), V(M.px(xq), M.py(yq)), { stroke: '#3f5f8f', 'stroke-dasharray': '4 4', 'stroke-width': 1.2 });
      B.note(`$\\Delta x=${fmt(st.dx, 2)}$`, '#93a1b5');
      B.note(`$\\Delta y=${fmt(yq - y0, 2)}$`, '#93a1b5');
      // 割线：沿 QP 方向长画
      const slope = (yq - y0) / st.dx;
      B.plot(x => y0 + slope * (x - x0), M, { anchors: [x0, xq], stroke: '#ff9e4a', 'stroke-width': 2 });
      marks.push([V(M.px(xq), M.py(yq)), B.diagramColors.orange]);
      B.note('割线 · 橙色', '#ff9e4a');
      B.text(V(M.px(xq) + 12, M.py(yq) - 11), 'Q', { fill: '#ff9e4a' });
    }
    // P 点 + 切线（金）：isoFit 等单位 → 像素方向即数学方向
    if (y0 > M.Y0 && y0 < M.Y1) {
      const ux = M.px(1) - M.px(0), uy = M.py(1) - M.py(0);
      const Lg = Math.hypot(ux, uy * d0) || 1;
      B.seg(V(M.px(x0) - ux / Lg * 155, M.py(y0) - uy * d0 / Lg * 155), V(M.px(x0) + ux / Lg * 155, M.py(y0) + uy * d0 / Lg * 155), { stroke: '#ffd166', 'stroke-width': 2 });
      B.note('切线 · 金色', '#ffd166');
      marks.push([V(M.px(x0), M.py(y0)), B.diagramColors.gold]);
      B.text(V(M.px(x0) - 13, M.py(y0) - 11), 'P', { fill: '#ffd166' });
    }

    // 徽章
    let pTxt = `$P(${fmt(x0, 2)},\\ ${fmt(y0, 2)})$`;
    if (!inDom) pTxt += ` —— $Q$ 越界（$x_Q=${fmt(xq, 2)}\\le 0$）`;
    else if (!bad) pTxt += `，$Q(${fmt(xq, 2)},\\ ${fmt(yq, 2)})$`;
    else pTxt += `，$Q$ 折回 $P$`;
    cP(pTxt, !inDom ? 'warn' : '');
    cT(`$f'(${fmt(x0, 2)})=${fmt(d0, 3)}$`, 'ok');
    if (bad) {
      cK(!inDom ? `点 Q 越界，$x_Q\\le 0$` : `$\\Delta x=0$，割线斜率无定义`, 'warn');
      cV('从两侧让 Q 靠近 P', '');
    } else {
      const k = (yq - y0) / st.dx;
      const gap = Math.abs(k - d0);
      cK(`$\\Delta y/\\Delta x\\approx${fmt(k, 3)}$`);
      cV(`两条直线的斜率相差 $${fmt(gap, 3)}$。`, gap < .06 ? 'ok' : '');
    }
    B.glowPoints(marks);
  };

  let autoOn = false, autoBtn = null;
  const tick = () => {
    if (!autoOn) return;
    const cents = Math.round(Math.abs(st.dx) * 100);
    st.dx = Math.sign(st.dx) * Math.max(0, Math.min(cents - 1, Math.round(cents * .92))) / 100;
    if (Math.abs(st.dx) <= .02) autoBtn.set(false);
    slDx.sync(st.dx); B.render();
    if (autoOn) B.raf(tick);
  };
  autoBtn = B.toggleBtn('⏩ Q 滑向 P', false, on => { autoOn = on; if (on) B.raf(tick); else B.cancelRaf(); });
  const sl = B.slider('切点 x0', -1.4, 3.1, 0.05, 1, v => { st.x0 = v; B.render(); }, undefined, v => `$x_0=${v}$`);
  const slDx = B.slider('增量 dx', -2.5, 2.5, 0.01, 1.5, v => { st.dx = v; B.render(); }, undefined, v => `$\\Delta x=${v}$`);
  B.graphToggles(st, ['grid', 'labs']);
  presetRow(B.ctrl, '选择例题', PRESETS, i => {
    const p = PRESETS[i];
    st.p = i;
    st.x0 = Math.max(p.lo, Math.min(p.hi, st.x0));
    sl.setAttribute('min', p.lo); sl.setAttribute('max', p.hi); sl.sync(st.x0);
    B.render();
  });
  B.render();
  return B;
}
