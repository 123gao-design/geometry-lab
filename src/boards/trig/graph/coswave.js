/* 图 W2 余弦平移等价机：cos 的五点 (0,1)·(π/2,0)·(π,−1)·(3π/2,0)·(2π,1)（五点法模式）；
   平移等价模式：cos x = sin(x+π/2) —— 蓝色 sin 与橙色 cos 逐点等高核验，sin 左移 π/2 即得 cos
   （I2 互配组 sin(π/2+x)=cos x 的图象版）。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { m: 0, x0: Math.PI / 3, grid: true, labs: true };
  const mBtns = [
    B.btnM('五点法', () => { st.m = 0; syncM(); B.render(); }, { on: true }),
    B.btnM('平移等价', () => { st.m = 1; syncM(); B.render(); }),
  ];
  function syncM() { mBtns.forEach((b, i) => b.classList.toggle('on', i === st.m)); }
  B.graphToggles(st, ['grid', 'labs']);
  const xSl = B.slider('x₀', -0.5, TAU + 0.5, 0.01, st.x0, v => { st.x0 = v; B.render(); });
  const cX = B.chip('x₀'), cC = B.chipM('cos x₀'), cE = B.chipM('平移核验'), cV = B.chip('判读');

  /** π/2 整数倍 → '-π/2 / 0 / π/2 / π / 3π/2 / 2π / 5π/2…' */
  function piLab(v) {
    const k = Math.round(v / (Math.PI / 2));
    if (k === 0) return '0';
    const n = Math.abs(k), s = k % 2 ? (n === 1 ? 'π/2' : n + 'π/2') : (n === 2 ? 'π' : (n / 2) + 'π');
    return (k < 0 ? '-' : '') + s;
  }
  /** 曲线采样（含 π/2 倍数锚点）→ 屏幕折线点串（m 为本次渲染的 isoFit 取景） */
  function sam(m, f, x0, x1, n) {
    const xs = [];
    for (let i = 0; i <= n; i++) xs.push(x0 + (x1 - x0) * i / n);
    for (let k = -1; k <= 5; k++) { const v = k * Math.PI / 2; if (v > x0 && v < x1) xs.push(v); }
    xs.sort((a, b) => a - b);
    return xs.map(x => `${m.px(x).toFixed(1)},${m.py(f(x)).toFixed(1)}`);
  }
  function poly(pts, color, w, op) {
    if (pts.length < 2) return;
    const at = { points: pts.join(' '), fill: 'none', stroke: color, 'stroke-width': w };
    if (op) at['stroke-opacity'] = op;
    mk('polyline', at, B.dyn);
  }

  B.renderFn = () => {
    const x0 = st.x0, cv = Math.cos(x0);
    // 取景：x∈[−π/2−0.3, 5π/2+0.3] —— sin 曲线右伸到 5π/2 才够「左移 π/2」全程核验
    const m = B.isoFit(-Math.PI / 2 - 0.3, 5 * Math.PI / 2 + 0.3, -1.6, 1.6);
    B.grid({ ...m, sx: Math.PI / 2, sy: 0.5, ly: 0.5, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = -1; k <= 5; k++)
      B.text(V(m.px(k * Math.PI / 2), m.py(0) + 15), piLab(k * Math.PI / 2), { 'font-size': 11, fill: '#5c6a80' });
    if (st.m === 1) poly(sam(m, Math.sin, m.X0, m.X1, 420), '#5cadff', 1.8, .8);   // sin（母本）
    poly(sam(m, Math.cos, m.X0, m.X1, 420), '#ff9e4a', 2.2);                       // cos
    if (st.m === 0) {                                                            // cos 五点骨架
      for (let k = 0; k <= 4; k++) {
        const fx = k * Math.PI / 2, fy = Math.cos(fx);
        B.seg(V(m.px(fx), m.py(0)), V(m.px(fx), m.py(fy)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4' });
        B.dot(V(m.px(fx), m.py(fy)), 3.4, { fill: '#ffd166' });
        if (st.labs) B.text(V(m.px(fx), m.py(fy) + (fy > 0.5 ? -12 : fy < -0.5 ? 18 : 16)),
          `(${piLab(fx)}, ${fy > 0.5 ? '1' : fy < -0.5 ? '-1' : '0'})`, { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' });
      }
      B.tex(V(m.px(m.X0) + 12, m.py(1.5)), '$y=\\cos x$', { size: 14, color: '#ff9e4a', anchor: 'start', w: 140 });
    } else {                                                                     // 平移等价：x₀ 处两点恒等高
      B.tex(V(m.px(m.X0) + 12, m.py(1.5)), '$y=\\sin x$', { size: 14, color: '#5cadff', anchor: 'start', w: 140 });
      B.tex(V(m.px(m.X0) + 12, m.py(1.16)), '$y=\\cos x$', { size: 14, color: '#ff9e4a', anchor: 'start', w: 140 });
      const pB = V(m.px(x0 + Math.PI / 2), m.py(Math.sin(x0 + Math.PI / 2))), pC = V(m.px(x0), m.py(cv));
      B.seg(pB, pC, { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '6 5' });
      B.dot(pB, 4.5, { fill: '#5cadff' });
      B.dot(pC, 5, { fill: '#ff9e4a' });
      B.text(V((pB.x + pC.x) / 2, pC.y - 10), '左移 π/2', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'middle' });
    }
    // 探针
    B.seg(V(m.px(x0), m.py(m.Y0)), V(m.px(x0), m.py(m.Y1)), { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });
    if (st.m === 0 && Math.abs(cv) <= 1.6) B.dot(V(m.px(x0), m.py(cv)), 5, { fill: '#ff9e4a' });
    // chips
    const sv = Math.sin(x0 + Math.PI / 2);
    cX(`${fmt(x0, 3)} rad ≈ ${fmt(x0 * 180 / Math.PI, 1)}°`);
    cC(`$\\cos x_0=${fmt(cv, 3)}$`);
    cE(`$\\sin(x_0+\\tfrac{\\pi}{2})=${fmt(sv, 3)}$`, Math.abs(sv - cv) < 1e-9 ? 'ok' : 'warn');
    cV(st.m === 0
      ? 'cos 五点：峰 (0,1)·降·谷 (π,−1)·升·峰 (2π,1) —— 与 sin 五点恰错半周期；偶函数：关于 y 轴对称（cos(−x)=cos x）'
      : 'cos x₀ 与 sin(x₀+π/2) 恒等高：sin 整体左移 π/2 即得 cos —— 诱导公式 π/2+α 的图象版（G1：x+h 在输入端，h=π/2 曲线反而左移）');
  };
  B.render();
  B.hintM('切「平移等价」拖 $x_0$：橙点 $(x_0,\\ \\cos x_0)$ 与蓝点 $(x_0+\\pi/2,\\ \\sin(x_0+\\pi/2))$ 恒等高 —— sin 左移 $\\pi/2$ 得 cos');
  return B;
}
