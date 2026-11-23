/* 图 V1 · 割线逼近机：平均变化率 → 瞬时变化率，导数的诞生。
   P 锁在曲线上（切点 x0），Q 由 Δx 驱动：橙割线 vs 金切线（斜率 f′(x0)）。
   Δx 可正可负（两侧逼近都可走）；Δx=0 割线排除 —— 极限管「趋近」不管「抵达」。
   「⏩ Q 滑向 P」动画：|Δx| 每帧 ×0.92 收缩到 0.02 停，读数滑向 f′。整框 isoFit 等单位。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);

  const PRESETS = [
    { name: '① $f=x^2$', f: x => x * x, fp: x => 2 * x, xa: -1.7, xb: 3.4, ya: -1.3, yb: 11.9, lo: -1.4, hi: 3.1 },
    { name: '② $f=\\dfrac{x^3}{3}$', f: x => x * x * x / 3, fp: x => x * x, xa: -2.9, xb: 2.9, ya: -3.7, yb: 3.7, lo: -2.6, hi: 2.6 },
    { name: '③ $f=\\ln x$', f: x => Math.log(x), fp: x => 1 / x, xa: -1, xb: 6.6, ya: -3, yb: 3, lo: 0.35, hi: 6.3, dom: 0 },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(P.xa, P.xb, P.ya, P.yb));
  const st = { p: 0, x0: 1, dx: 1.5, grid: true, labs: true };

  const cP = B.chipM('坐标核验'), cK = B.chipM('割线斜率'), cT = B.chipM('切线斜率'), cV = B.chipM('极限判读');

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    const x0 = st.x0, y0 = P.f(x0), d0 = P.fp(x0);
    const xq = x0 + st.dx;
    const inDom = P.dom == null || xq > P.dom;
    const yq = inDom ? P.f(xq) : NaN;
    const bad = Math.abs(st.dx) < 1e-9 || !inDom || !isFinite(yq);

    // 曲线（锚点踩准 P、Q）
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.03) xs.push(x);
    xs.push(x0); if (!bad) xs.push(xq);
    xs.sort((m, n) => m - n);
    let d = '', pen = false;
    for (const x of xs) {
      const y = P.f(x);
      if (isFinite(y) && y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + M.px(x).toFixed(1) + ' ' + M.py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);

    // Δx/Δy 虚线三角 + Q 点 + 割线（Q 在视野内才画）
    if (!bad && xq > M.X0 && xq < M.X1 && yq > M.Y0 && yq < M.Y1) {
      B.seg(V(M.px(x0), M.py(y0)), V(M.px(xq), M.py(y0)), { stroke: '#3f5f8f', 'stroke-dasharray': '4 4', 'stroke-width': 1.2 });
      B.seg(V(M.px(xq), M.py(y0)), V(M.px(xq), M.py(yq)), { stroke: '#3f5f8f', 'stroke-dasharray': '4 4', 'stroke-width': 1.2 });
      B.note(`$\\Delta x=${fmt(st.dx, 2)}$`, '#93a1b5');
      B.note(`$\\Delta y=${fmt(yq - y0, 2)}$`, '#93a1b5');
      // 割线：沿 QP 方向长画
      const ux = M.px(xq) - M.px(x0), uy = M.py(yq) - M.py(y0);
      const Lg = Math.hypot(ux, uy) || 1;
      B.seg(V(M.px(xq) - ux / Lg * 210, M.py(yq) - uy / Lg * 210), V(M.px(xq) + ux / Lg * 60, M.py(yq) + uy / Lg * 60), { stroke: '#ff9e4a', 'stroke-width': 2 });
      B.dot(V(M.px(xq), M.py(yq)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
      B.note('割线 · 橙色', '#ff9e4a');
      B.text(V(M.px(xq) + 12, M.py(yq) - 11), 'Q', { fill: '#ff9e4a' });
    }
    // P 点 + 切线（金）：isoFit 等单位 → 像素方向即数学方向
    if (y0 > M.Y0 && y0 < M.Y1) {
      const ux = M.px(1) - M.px(0), uy = M.py(1) - M.py(0);
      const Lg = Math.hypot(ux, uy * d0) || 1;
      B.seg(V(M.px(x0) - ux / Lg * 155, M.py(y0) - uy * d0 / Lg * 155), V(M.px(x0) + ux / Lg * 155, M.py(y0) + uy * d0 / Lg * 155), { stroke: '#ffd166', 'stroke-width': 2 });
      B.note('切线 · 金色', '#ffd166');
      B.dot(V(M.px(x0), M.py(y0)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
      B.text(V(M.px(x0) - 13, M.py(y0) - 11), 'P', { fill: '#ffd166' });
    }

    // 徽章
    let pTxt = `$P(${fmt(x0, 2)},\\ ${fmt(y0, 2)})$`;
    if (!inDom) pTxt += ` —— $Q$ 越界（$x_Q=${fmt(xq, 2)}\\le 0$）`;
    else if (!bad) pTxt += `，$Q(${fmt(xq, 2)},\\ ${fmt(yq, 2)})$`;
    else pTxt += `，$Q$ 折回 $P$`;
    cP(pTxt, !inDom ? 'warn' : '');
    cT(`$f'(${fmt(x0, 2)})=${fmt(d0, 3)}$ —— 瞬时变化率（切线斜率）`, 'ok');
    if (bad) {
      cK(!inDom ? `Q 越过定义域（$x_Q\\le 0$，ln x 不接非正数）—— Δx 拖负要盯着定义域` : `Δx=0：Q 折回 P，割线退化成一点 —— 0/0 没有定义`, 'warn');
      cV('极限管「趋近」不管「抵达」—— 把 Δx 从正负两侧拖小看读数', '');
    } else {
      const k = (yq - y0) / st.dx;
      const gap = Math.abs(k - d0);
      cK(`$\\dfrac{\\Delta y}{\\Delta x}=\\dfrac{${fmt(yq - y0, 3)}}{${fmt(st.dx, 2)}}=${fmt(k, 3)}$ —— 平均变化率`, '');
      cV(gap < 0.06
        ? `Δx=${fmt(st.dx, 2)}：割线斜率滑到 ${fmt(k, 3)}，与 f′ 只差 ${fmt(gap, 3)} —— 平均变化率的极限就是导数`
        : `Δx=${fmt(st.dx, 2)}：橙割线还未贴合到金切线，差 ${fmt(gap, 3)} —— 缩小 |Δx| 看差怎么归零`, gap < 0.06 ? 'ok' : '');
    }
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    st.x0 = Math.max(p.lo, Math.min(p.hi, st.x0));
    sl.setAttribute('min', p.lo); sl.setAttribute('max', p.hi); sl.sync(st.x0);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  let autoOn = false, autoBtn = null;
  const tick = () => {
    if (!autoOn) return;
    st.dx *= 0.92;
    if (Math.abs(st.dx) < 0.03) { st.dx = st.dx < 0 ? -0.02 : 0.02; autoOn = false; autoBtn.set(false); }
    slDx.sync(st.dx); B.render(); B.raf(tick);
  };
  autoBtn = B.toggleBtn('⏩ Q 滑向 P', false, on => { autoOn = on; if (on) B.raf(tick); });
  const sl = B.slider('切点 x0', -1.4, 3.1, 0.05, 1, v => { st.x0 = v; B.render(); });
  const slDx = B.slider('增量 dx', -2.5, 2.5, 0.05, 1.5, v => { st.dx = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint("把 Δx 从正、负两侧拖向 0，比较割线和切线的斜率。");
  B.render();
  return B;
}
