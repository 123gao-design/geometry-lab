/* 图 V4 · 切线不等式机：凹凸性与切线放缩 —— 下凸曲线位于切线上方（f≥l 恒成立），
   上凸曲线位于切线下方（f≤l 恒成立），x³ 的切线出凹凸区间即穿越（不等式只在区间内成立）。
   竖向「间隙着色」把差函数画出来：绿=曲线高于切线、红=切线更高；f″(x₀) 徽章读二阶判据；
   恒成立的临界条件=相切。三原图量级 x/y 不同，按 E4/E7 先例各用比例尺（mapFit）；切线按像素方向画。 */
import { V, fmt } from '../../../lib/board.js';
import { presetRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');

  const PRESETS = [
    { name: '指数', formula: '$f=e^x$', f: x => Math.exp(x), fp: x => Math.exp(x), fpp: x => Math.exp(x), xa: -2.3, xb: 2.7, ya: -1.6, yb: 10, lo: -1.6, hi: 2.2, conv: 1 },
    { name: '对数', formula: '$f=\\ln x$', f: x => Math.log(x), fp: x => 1 / x, fpp: x => -1 / (x * x), xa: -1, xb: 6.6, ya: -3.1, yb: 3.1, lo: 0.35, hi: 6.2, conv: -1, dom: 0 },
    { name: '三次', formula: '$f=x^3$', f: x => x * x * x, fp: x => 3 * x * x, fpp: x => 6 * x, xa: -2, xb: 2, ya: -7.6, yb: 7.6, lo: -1.35, hi: 1.35, conv: 0 },
  ];
  /** 各向比例尺取景（E4/E7 先例）：rect 内完整看到 [xa,xb]×[ya,yb] */
  const MAPS = PRESETS.map(P => B.mapFit(P.xa, P.xb, P.ya, P.yb));
  const st = { p: 0, x0: 0, gap: true, grid: true, labs: true };

  const cL = B.readout('切线方程'), cS = B.chipM('二阶判读'), cI = B.chipM('不等式判读'), cD = B.readout('差函数', 'gold'), cH = B.chipM('恒成立判定');

  B.renderFn = () => {
    const marks = [];
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
    B.plot(P.f, M, { anchors: [x0], stroke: '#5cadff', 'stroke-width': 2.2 });
    B.plot(l, M, { anchors: [x0], stroke: '#ffd166', 'stroke-width': 2 });
    if (y0 > M.Y0 && y0 < M.Y1) marks.push([V(M.px(x0), M.py(y0)), B.diagramColors.gold]);

    // 徽章
    const anchor = x0 === 0 ? 'x' : `(x${x0 < 0 ? '+' : '-'}${Math.abs(x0)})`;
    cL(d0 === 0 ? `$y=${fmt(y0, 2)}$` : `$y\\approx${fmt(d0, 2)}${anchor}$ $${y0 < 0 ? '-' : '+'}${fmt(Math.abs(y0), 2)}$`);
    const d2 = P.fpp(x0);
    cS(d2 === 0 ? "$f''(x_0)=0$，两侧凹凸性改变。" : `$f''(x_0)\\approx${fmt(d2, 3)}$，切线在附近曲线${d2 > 0 ? '下' : '上'}方。`);
    let iTxt, iCls;
    if (P.conv > 0) { iTxt = '整个定义域上 $f(x)\\ge l(x)$。'; iCls = 'ok'; }
    else if (P.conv < 0) { iTxt = '整个定义域上 $f(x)\\le l(x)$。'; iCls = 'ok'; }
    else {
      const cross = -2 * x0;
      iTxt = `穿越横坐标 $x=${fmt(cross, 2)}$。其左侧 $f\\le l$，右侧 $f\\ge l$。`;
      iCls = '';
      if (cross > M.X0 && cross < M.X1 && l(cross) > M.Y0 && l(cross) < M.Y1) {
        marks.push([V(M.px(cross), M.py(l(cross))), B.diagramColors.orange]);
      }
    }
    cI(iTxt, iCls);
    cD("$g=f-l$，$g(x_0)=g'(x_0)=0$。");
    cH(P.conv > 0 ? '差函数在切点取最小值 $0$。' : P.conv < 0 ? '差函数在切点取最大值 $0$。'
      : '$g(x)=(x-x_0)^2$ $\\cdot(x+2x_0)$，由最后一个因子判断正负。');
    B.glowPoints(marks);
  };

  const sl = B.slider('切点 x0', -1.6, 2.2, 0.05, 0, v2 => { st.x0 = v2; B.render(); }, undefined, v => `$x_0=${v}$`);
  B.toggleBtn('间隙着色', true, on => { st.gap = on; B.render(); });
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
