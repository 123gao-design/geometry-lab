/* 图 U2b 倒数三函数图像机：sec=1/cos、csc=1/sin、cot=1/tan 三条曲线，母函数以参考虚线同屏。
   断口 = 母函数的零点（倒数趋于无穷）；|cos|≤1 ⇒ |sec|≥1 的禁区带；cot 是 tan 关于 x=π/4 的互余镜像（I2 的 π/2−α 图象版）。 */
import { TrigLegendBoard, piTick } from '../trig-board.js';
import { angleReadings, numberTex } from './angle-readings.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 860, 520);
  const st = { m: 0, x0: Math.PI / 3, grid: true, labs: true, asy: true };
  const MODES = [
    { btn: '$y=\\sec x$', f: Math.cos, nm: '\\sec', pn: '\\cos', ghost: '$y=\\cos x$', color: '#ff9e4a',
      ver: '余弦为零处有竖直渐近线。正割的绝对值至少为 $1$，在余弦取 $\\pm1$ 处达到边界。' },
    { btn: '$y=\\csc x$', f: Math.sin, nm: '\\csc', pn: '\\sin', ghost: '$y=\\sin x$', color: '#4ade80',
      ver: '正弦为零处有竖直渐近线。余割的绝对值至少为 $1$，在正弦取 $\\pm1$ 处达到边界。' },
    { btn: '$y=\\cot x$', f: Math.tan, nm: '\\cot', pn: '\\tan', ghost: '$y=\\tan x$', color: '#ff7b8a',
      ver: '当 $x=\\pi/2+k\\pi$ 时，余切为零。正切与余切的最小正周期同为 $\\pi$。' },
  ];
  root.classList.add('reciprocal-board');
  const panel = angleReadings(B, '探针 $x_0$', '探针角度、函数值与乘积');
  const cF = panel.field('参考虚线', 'guide'), cR = panel.field('所选实线', 'orange');
  const cG = panel.field('两函数的乘积', 'gold'), cV = B.chipM('判读');
  B.choiceRow('选择函数', MODES.map(m => ({ name: m.btn })), () => st.m,
    i => { st.m = i; B.render(); });
  B.graphToggles(st, ['grid', 'labs', 'asy']);
  const xSl = B.slider('x₀', -6.28, 6.28, 0.01, st.x0, v => { st.x0 = v; B.render(); }, undefined, (_, v) => `$x_0=${fmt(v, 2)}$`);
  B.angleRow([0, 30, 45, 60, 90], () => st.x0, v => { st.x0 = v; xSl.sync(v); B.render(); });

  /** 曲线采样：线性 + 锚点（π/2 整数倍 —— 渐近线、峰谷、零点全踩准），无定义或出框处断笔成支 */
  function plotFam(m, f, color, w, dash = '') {
    const anc = [];                                                       // kπ/2 渐近线旁必采
    for (let k = -6; k <= 6; k++) { const a = k * Math.PI / 2; if (a > m.X0 && a < m.X1) anc.push(a); }
    B.plot(f, m, { n: 560, 'stroke-dasharray': dash, anchors: anc, stroke: color, 'stroke-width': w });
  }

  B.renderFn = () => {
    const M = MODES[st.m];
    const m = B.isoFit(-2 * Math.PI, 2 * Math.PI, -4, 4, B.plotRect);
    B.grid({ ...m, sx: Math.PI / 2, sy: 1, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = -4; k <= 4; k++) { // grid 的数字刻度印不了 π，自绘 π/2 刻度
      if (k !== 0) B.text(V(m.px(k * Math.PI / 2), m.py(0) + 15), piTick(k * Math.PI / 2), { 'font-size': 11, fill: '#5c6a80' });
    }
    if (M.nm !== '\\cot') { // sec/csc：|y|<1 禁区带 + ±1 界线（母函数有界 ⇒ 倒数 ≥1）
      mk('rect', { x: m.px(m.X0), y: m.py(1), width: m.px(m.X1) - m.px(m.X0), height: m.py(-1) - m.py(1),
        fill: '#93a1b5', 'fill-opacity': .08, 'data-fn-grid': '' }, B.dyn);
      B.seg(V(m.px(m.X0), m.py(1)), V(m.px(m.X1), m.py(1)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '5 5', 'stroke-opacity': .7 });
      B.seg(V(m.px(m.X0), m.py(-1)), V(m.px(m.X1), m.py(-1)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '5 5', 'stroke-opacity': .7 });
      if (st.labs) B.text(V(m.px(m.X1) - 10, m.py(0.55)), '禁区 |y|<1', { 'font-size': 11, fill: '#93a1b5', 'text-anchor': 'end' });
    } else { // cot：互余镜像线 x=π/4（cot x = tan(π/2−x)）
      B.seg(V(m.px(Math.PI / 4), m.py(m.Y0)), V(m.px(Math.PI / 4), m.py(m.Y1)), { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '7 6' });
      if (st.labs) B.text(V(m.px(Math.PI / 4) + 8, m.py(m.Y1) + 32), '互余镜像 x=π/4', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'start' });
    }
    if (st.asy) { // 渐近线：sec 断在 π/2 的奇数倍，csc/cot 断在 kπ；x=0 是 y 轴本身，不重复画
      const asy = [];
      for (let k = -3; k <= 3; k++) {
        const v = M.nm === '\\sec' ? (2 * k + 1) * Math.PI / 2 : k * Math.PI;
        if (v !== 0 && v > m.X0 && v < m.X1 && !asy.includes(v)) asy.push(v);
      }
      B.asym(m, asy.map(v => ({ v, t: st.labs ? 'x=' + piTick(v) : '' })));
    }
    const cot = st.m === 2;
    const parent = x => cot && Math.abs(Math.cos(x)) < 1e-10 ? NaN : M.f(x);
    const reciprocal = x => {
      const divisor = st.m === 0 ? Math.cos(x) : Math.sin(x);
      return Math.abs(divisor) < 1e-10 ? NaN : (cot ? Math.cos(x) : 1) / divisor;
    };
    plotFam(m, parent, '#93a1b5', 1.6, '5 5');
    plotFam(m, reciprocal, M.color, 2.4);
    B.note(M.ghost, '#93a1b5', 'dashed');
    B.note(M.btn, M.color);
    const x0 = st.x0, fv = parent(x0), rv = reciprocal(x0);
    if (Math.abs(rv) <= m.Y1) B.mark(V(m.px(x0), m.py(rv)), M.color);
    if (Math.abs(fv) <= m.Y1) B.mark(V(m.px(x0), m.py(fv)), '#93a1b5');
    for (let k = -2; k <= 2; k++) { // 特殊点：sec 峰谷（kπ）、csc 峰谷（π/2+kπ）、cot 零点（π/2+kπ）
      const sx = M.nm === '\\sec' ? k * Math.PI : Math.PI / 2 + k * Math.PI;
      const sy = M.nm === '\\cot' ? 0 : Math.pow(-1, k);
      if (sx >= m.X0 && sx <= m.X1) B.mark(V(m.px(sx), m.py(sy)), '#ffd166');
    }
    // 探针：竖直扫描线 + 母函数点（空心）+ 倒数点（实心）
    B.seg(V(m.px(x0), m.py(m.Y0)), V(m.px(x0), m.py(m.Y1)), { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });
    panel.angle(x0);
    cR.el.style.setProperty('--reading-color', B.drawingColors[M.color]);
    cF(Number.isFinite(fv) ? `$${M.pn} x_0\\approx${numberTex(fv)}$` : `$${M.pn} x_0$ 无定义`, Number.isFinite(fv) ? '' : 'warn');
    cR(Number.isFinite(rv) ? `$${M.nm} x_0\\approx${numberTex(rv)}$` : `$${M.nm} x_0$ 无定义`, Number.isFinite(rv) ? '' : 'warn');
    const bothDefined = Number.isFinite(fv) && Number.isFinite(rv);
    cG(bothDefined ? `$${M.pn} x_0\\cdot${M.nm} x_0=1$` : '无定义', bothDefined ? '' : 'warn');
    cV(M.ver);
  };
  B.render();
  return B;
}
