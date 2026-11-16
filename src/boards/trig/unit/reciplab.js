/* 图 U2b 倒数三函数图像机：sec=1/cos、csc=1/sin、cot=1/tan 三条曲线，母函数以参考虚线同屏。
   断口 = 母函数的零点（倒数趋于无穷）；|cos|≤1 ⇒ |sec|≥1 的禁区带；cot 是 tan 关于 x=π/4 的互余镜像（I2 的 π/2−α 图象版）。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { m: 0, x0: Math.PI / 3, grid: true, labs: true, asy: true };
  const MODES = [
    { btn: '$y=\\sec x$', f: Math.cos, nm: '\\sec', pn: '\\cos', ghost: '$y=\\cos x$', color: '#ff9e4a',
      ver: 'sec=1/cos：断口在 cos 的零点（±π/2 的奇数倍）—— 倒数趋于无穷；|sec|≥1（母函数 |cos|≤1，禁区带内绝不现身）· 偶函数 · T=2π，波峰波谷恰在 cos=±1 处' },
    { btn: '$y=\\csc x$', f: Math.sin, nm: '\\csc', pn: '\\sin', ghost: '$y=\\sin x$', color: '#4ade80',
      ver: 'csc=1/sin：断口在 sin 的零点 x=kπ（x=0 也是）—— 倒数趋于无穷；|csc|≥1（禁区带）· 奇函数 · T=2π，波峰波谷恰在 sin=±1 处' },
    { btn: '$y=\\cot x$', f: Math.tan, nm: '\\cot', pn: '\\tan', ghost: '$y=\\tan x$', color: '#ff7b8a',
      ver: 'cot=1/tan=cos/sin：断口在 kπ、零点在 π/2+kπ（与 tan 恰好错位）· 奇函数 · 周期 π（tan 的一半）· cot x=tan(π/2−x)：整条曲线是 tan 关于 x=π/4 的互余镜像' },
  ];
  const cX = B.chip('x₀'), cF = B.chipM('母函数'), cR = B.chipM('倒数核验'), cG = B.chipM('乘积核验'), cV = B.chip('判读');
  const mBtns = MODES.map((md, i) => B.btnM(md.btn, () => { st.m = i; syncM(); B.render(); }, { on: i === 0 }));
  function syncM() { mBtns.forEach((b, i) => b.classList.toggle('on', i === st.m)); }
  B.graphToggles(st, ['grid', 'labs', 'asy']);
  const xSl = B.slider('x₀', -6.28, 6.28, 0.01, st.x0, v => { st.x0 = v; B.render(); });
  [['π/6', Math.PI / 6], ['π/4', Math.PI / 4], ['π/3', Math.PI / 3]]
    .forEach(([lab, v]) => B.btn(lab, () => { st.x0 = v; xSl.sync(v); B.render(); }));

  /** π/2 整数倍 → '−2π / −3π/2 / −π/2 / π / 3π/2…'（π 刻度与渐近线标签用） */
  function piLab(v) {
    const k = Math.round(v / (Math.PI / 2));
    if (k === 0) return '0';
    const n = Math.abs(k), s = k % 2 ? (n === 1 ? 'π/2' : n + 'π/2') : (n === 2 ? 'π' : (n / 2) + 'π');
    return (k < 0 ? '-' : '') + s;
  }
  /** 曲线采样：线性 + 锚点（π/2 整数倍 —— 渐近线、峰谷、零点全踩准），无定义或出框处断笔成支 */
  function plotFam(m, f, color, w) {
    const anc = [];                                                       // kπ/2 渐近线旁必采
    for (let k = -6; k <= 6; k++) { const a = k * Math.PI / 2; if (a > m.X0 && a < m.X1) anc.push(a); }
    B.plot(f, m, { n: 560, pad: 1.2, anchors: anc, stroke: color, 'stroke-width': w });
  }

  B.renderFn = () => {
    const M = MODES[st.m];
    const m = B.isoFit(-2 * Math.PI, 2 * Math.PI, -4, 4);
    B.grid({ ...m, sx: Math.PI / 2, sy: 1, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = -4; k <= 4; k++) { // grid 的数字刻度印不了 π，自绘 π/2 刻度
      if (k !== 0) B.text(V(m.px(k * Math.PI / 2), m.py(0) + 15), piLab(k * Math.PI / 2), { 'font-size': 11, fill: '#5c6a80' });
    }
    if (M.nm !== '\\cot') { // sec/csc：|y|<1 禁区带 + ±1 界线（母函数有界 ⇒ 倒数 ≥1）
      mk('rect', { x: m.px(m.X0), y: m.py(1), width: m.px(m.X1) - m.px(m.X0), height: m.py(-1) - m.py(1), fill: 'rgba(139,163,189,.05)' }, B.dyn);
      B.seg(V(m.px(m.X0), m.py(1)), V(m.px(m.X1), m.py(1)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '5 5', 'stroke-opacity': .7 });
      B.seg(V(m.px(m.X0), m.py(-1)), V(m.px(m.X1), m.py(-1)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '5 5', 'stroke-opacity': .7 });
      B.text(V(m.px(m.X1) - 10, m.py(0.55)), '禁区 |y|<1', { 'font-size': 11, fill: '#93a1b5', 'text-anchor': 'end' });
    } else { // cot：互余镜像线 x=π/4（cot x = tan(π/2−x)）
      B.seg(V(m.px(Math.PI / 4), m.py(m.Y0)), V(m.px(Math.PI / 4), m.py(m.Y1)), { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '7 6' });
      B.text(V(m.px(Math.PI / 4) + 8, m.py(m.Y1) + 32), '互余镜像 x=π/4', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'start' });
    }
    if (st.asy) { // 渐近线：sec 断在 π/2 的奇数倍，csc/cot 断在 kπ；x=0 是 y 轴本身，不重复画
      const asy = [];
      for (let k = -3; k <= 3; k++) {
        const v = M.nm === '\\sec' ? (2 * k + 1) * Math.PI / 2 : k * Math.PI;
        if (v !== 0 && v > m.X0 && v < m.X1 && !asy.includes(v)) asy.push(v);
      }
      B.asym(m, asy.map(v => ({ v, t: 'x=' + piLab(v) })));
    }
    plotFam(m, M.f, '#93a1b5', 1.6);                       // 母函数虚线像
    plotFam(m, x => 1 / M.f(x), M.color, 2.2);            // 倒数曲线
    for (let k = -2; k <= 2; k++) { // 特殊点：sec 峰谷（kπ）、csc 峰谷（π/2+kπ）、cot 零点（π/2+kπ）
      const sx = M.nm === '\\sec' ? k * Math.PI : Math.PI / 2 + k * Math.PI;
      const sy = M.nm === '\\cot' ? 0 : Math.pow(-1, k);
      B.dot(V(m.px(sx), m.py(sy)), 3.4, { fill: '#ffd166' });
    }
    B.tex(V(m.px(m.X0) + 14, m.py(3.8)), M.ghost, { size: 13, color: '#93a1b5', anchor: 'start', w: 160 });
    B.tex(V(m.px(m.X0) + 14, m.py(3.2)), M.btn, { size: 13, color: M.color, anchor: 'start', w: 160 });
    // 探针：竖直扫描线 + 母函数点（空心）+ 倒数点（实心）
    const x0 = st.x0, fv = M.f(x0), rv = 1 / fv;
    B.seg(V(m.px(x0), m.py(m.Y0)), V(m.px(x0), m.py(m.Y1)), { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });
    if (Math.abs(fv) <= m.Y1) mk('circle', { cx: m.px(x0), cy: m.py(fv), r: 4.5, fill: 'none', stroke: '#93a1b5', 'stroke-width': 2 }, B.dyn);
    if (Math.abs(fv) > 1e-9 && Math.abs(rv) <= m.Y1) B.dot(V(m.px(x0), m.py(rv)), 5, { fill: M.color });
    // chips
    cX(`${fmt(x0, 3)} rad ≈ ${fmt(x0 * 180 / Math.PI, 1)}°`);
    cF(`$${M.pn} x_0=${fmt(fv, 3)}$`);
    if (Math.abs(fv) < 1e-9) { cR('排除（母函数 = 0）', 'warn'); cG('乘积无定义 —— 断口', 'warn'); }
    else if (Math.abs(rv) > 999) { cR('溢出（→∞）—— 逼近断口', 'warn'); cG('乘积仍恒 = 1', 'ok'); }
    else {
      cR(`$${M.nm} x_0=\\frac{1}{${M.pn} x_0}=${fmt(rv, 3)}$`, 'ok');
      cG(`$${M.pn} x_0\\cdot${M.nm} x_0=${fmt(fv * rv, 3)}$`, 'ok');
    }
    cV(M.ver);
  };
  B.render();
  B.hintM('切 sec/csc/cot、拖 $x_0$ 核验：曲线只在母函数零点处断开 —— 倒数趋于无穷；$|\\cos|\\le 1 \\Rightarrow |\\sec|\\ge 1$');
  return B;
}
