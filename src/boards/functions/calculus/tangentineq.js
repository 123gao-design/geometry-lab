/* 图 V4 · 切线不等式机：凹凸性与切线放缩 —— 下凸曲线位于切线上方（f≥l 恒成立），
   上凸曲线位于切线下方（f≤l 恒成立），x³ 的切线出凹凸区间即穿越（不等式只在区间内成立）。
   竖向「间隙着色」把差函数画出来：绿=曲线高于切线、红=切线更高；f″(x₀) 徽章读二阶判据；
   恒成立的临界条件=相切。三原图量级 x/y 不同，按 E4/E7 先例各用比例尺（mapFit）；切线按像素方向画。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);

  const PRESETS = [
    { name: '① $f=e^x$：下凸', f: x => Math.exp(x), fp: x => Math.exp(x), fpp: x => Math.exp(x), xa: -2.3, xb: 2.7, ya: -1.6, yb: 10, lo: -1.6, hi: 2.2, conv: 1 },
    { name: '② $f=\\ln x$：上凸', f: x => Math.log(x), fp: x => 1 / x, fpp: x => -1 / (x * x), xa: -1, xb: 6.6, ya: -3.1, yb: 3.1, lo: 0.35, hi: 6.2, conv: -1, dom: 0 },
    { name: '③ $f=x^3$：穿越', f: x => x * x * x, fp: x => 3 * x * x, fpp: x => 6 * x, xa: -2, xb: 2, ya: -7.6, yb: 7.6, lo: -1.35, hi: 1.35, conv: 0 },
  ];
  /** 各向比例尺取景（E4/E7 先例）：rect 内完整看到 [xa,xb]×[ya,yb] */
  const MAPS = PRESETS.map(P => B.mapFit(P.xa, P.xb, P.ya, P.yb));
  const st = { p: 0, x0: 0, gap: true, grid: true, labs: true };

  const cL = B.chipM('切线方程'), cS = B.chipM('二阶判读'), cI = B.chipM('不等式判读'), cD = B.chipM('差函数'), cH = B.chipM('恒成立判定');

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    const x0 = st.x0, y0 = P.f(x0), d0 = P.fp(x0);
    const l = x => y0 + d0 * (x - x0);
    // 间隙着色：曲线与切线之间的竖向短线（绿=曲线高，红=切线高）
    if (st.gap) {
      for (let x = M.X0 + 0.1; x < M.X1; x += 0.07) {
        if (P.dom != null && x <= P.dom) continue;
        const fy = P.f(x), ly = l(x);
        if (!isFinite(fy) || !isFinite(ly) || fy <= M.Y0 || fy >= M.Y1 || ly <= M.Y0 || ly >= M.Y1) continue;
        if (Math.abs(fy - ly) < 0.01) continue;
        B.seg(V(M.px(x), M.py(fy)), V(M.px(x), M.py(ly)), { stroke: fy > ly ? '#4ade80' : '#ff7b8a', 'stroke-opacity': .55, 'stroke-width': 1.6 });
      }
    }
    // 曲线（锚点踩准切点）
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.03) xs.push(x);
    xs.push(x0); xs.sort((m, n) => m - n);
    let d = '', pen = false;
    for (const x of xs) {
      const y = P.f(x);
      if (isFinite(y) && y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + M.px(x).toFixed(1) + ' ' + M.py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    // 切线（金）：像素方向 (1, f′) 按比例尺换算
    const ux = M.s, uy = M.py(0) - M.py(1);
    const Lg = Math.hypot(ux, uy * d0) || 1;
    B.seg(V(M.px(x0) - ux / Lg * 175, M.py(y0) + uy * d0 / Lg * 175), V(M.px(x0) + ux / Lg * 175, M.py(y0) - uy * d0 / Lg * 175), { stroke: '#ffd166', 'stroke-width': 2 });
    if (y0 > M.Y0 && y0 < M.Y1) B.dot(V(M.px(x0), M.py(y0)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });

    // 徽章
    const eq = Math.abs(x0) < 0.005
      ? `$y=${fmt(d0, 2)}x${y0 >= 0 ? '+' : '-'}${fmt(Math.abs(y0), 2)}$`
      : `$y=${fmt(d0, 2)}(x${x0 >= 0 ? '-' : '+'}${fmt(Math.abs(x0), 2)})${y0 >= 0 ? '+' : '-'}${fmt(Math.abs(y0), 2)}$`;
    cL(eq, '');
    const d2 = P.fpp(x0);
    let sTxt, sCls;
    if (d2 > 0.005) { sTxt = `$f''(x_0)=${fmt(d2, 3)}>0$ —— 下凸：$f'$ 在此递增，切线在曲线下方`; sCls = 'ok'; }
    else if (d2 < -0.005) { sTxt = `$f''(x_0)=${fmt(d2, 3)}<0$ —— 上凸：$f'$ 在此递减，切线在曲线上方`; sCls = 'ok'; }
    else { sTxt = `$f''(x_0)=0$ —— 拐点候选：两侧凹凸在此切换，切线两侧各占一半`; sCls = 'warn'; }
    cS(sTxt, sCls);
    let iTxt, iCls;
    if (P.conv > 0) { iTxt = `下凸：曲线位于切线上方 —— $f\\ge l$ 全程成立（$x_0=0$ 给出经典 $e^x\\ge x+1$）`; iCls = 'ok'; }
    else if (P.conv < 0) { iTxt = `上凸：曲线位于切线下方 —— $f\\le l$ 全程成立（$x_0=1$ 给出经典 $\\ln x\\le x-1$）`; iCls = 'ok'; }
    else if (Math.abs(x0) < 0.005) { iTxt = '拐点切线：$x_0=0$ 恰居中 —— 两侧各穿越一次，一半 $f\\ge l$ 一半 $f\\le l$（不等式失效）'; iCls = 'warn'; }
    else if (x0 > 0) { iTxt = `$x_0>0$：凹区间 $(0,+\\infty)$ 内 $f\\ge l$ 成立（右半绿色带），进入左半轴变红 —— 切线放缩只在凹凸区间内有效`; iCls = 'warn'; }
    else { iTxt = `$x_0<0$：凸区间 $(-\\infty,0)$ 内 $f\\le l$ 成立（左半红色带），进入右半轴变绿 —— 区间外失效`; iCls = 'warn'; }
    cI(iTxt, iCls);
    cD(`差函数 $g=f-l$：$g(x_0)=0$、$g'(x_0)=0$ —— 恒成立 $\\Leftrightarrow$ $g$ 的最小值 $\\ge 0$（下凸）或最大值 $\\le 0$（上凸）`, '');
    cH(`恒成立求参：临界条件 = 相切 —— 联立 $f(x_0)=a x_0+b$ 与 $f'(x_0)=a$ 解出临界，再判断哪一侧成立`, '');
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    st.x0 = Math.max(p.lo, Math.min(p.hi, st.x0));
    sl.setAttribute('min', p.lo); sl.setAttribute('max', p.hi); sl.sync(st.x0);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const sl = B.slider('切点 x0', -1.6, 2.2, 0.05, 0, v2 => { st.x0 = v2; B.render(); });
  B.toggleBtn('间隙着色', true, on => { st.gap = on; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('绿=曲线在切线上方、红=下方：凸性定方向，穿越处变红 —— 恒成立的边界是切线');
  B.render();
  return B;
}
