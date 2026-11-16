/* 图 逼3 · 数值积分：梯形与辛普森
   把 [0,1] 切成 n 段，用容易算面积的图形盖在曲线上：矩形、梯形，或每两段配一条抛物线。
   ∫₀¹ dx/(1+x²)=π/4 是已知真值，所以每一步的误差都能直接读出来。
   梯形误差按 n⁻² 缩小，辛普森按 n⁻⁴ 缩小——段数翻倍，误差分别降到 1/4 与 1/16。 */
import { Board, V, mk } from '../../../lib/board.js';

const f = x => 1 / (1 + x * x);
const TRUE = Math.PI / 4;
const MODES = ['矩形（左端）', '矩形（中点）', '梯形', '辛普森'];

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { mode: 2, n: 4 };
  const cN = B.chipM('分段数'), cI = B.chipM('近似值'), cE = B.chipM('误差'), cJ = B.chipM('判读');

  const m = B.mapFit(-0.05, 1.05, -0.05, 1.1, [56, 52, 600, 292], 18);

  const est = (mode, n) => {
    const nu = mode === 3 ? Math.max(2, n - (n % 2)) : n;
    const h = 1 / nu;
    if (mode === 0) { let s = 0; for (let i = 0; i < nu; i++) s += f(i * h); return s * h; }
    if (mode === 1) { let s = 0; for (let i = 0; i < nu; i++) s += f((i + .5) * h); return s * h; }
    if (mode === 2) { let s = (f(0) + f(1)) / 2; for (let i = 1; i < nu; i++) s += f(i * h); return s * h; }
    let s = f(0) + f(1);
    for (let i = 1; i < nu; i++) s += (i % 2 ? 4 : 2) * f(i * h);
    return s * h / 3;
  };

  B.renderFn = () => {
    const nu = st.mode === 3 ? Math.max(2, st.n - (st.n % 2)) : st.n;
    const h = 1 / nu, I = est(st.mode, st.n), err = Math.abs(I - TRUE);
    B.grid({ ...m, sx: .25, sy: .25, lx: .25, ly: .25 });

    // 近似图形的填色
    const barFill = { fill: '#ffd166', 'fill-opacity': .2, stroke: '#ffd166', 'stroke-width': 1.2 };
    for (let i = 0; i < nu; i++) {
      const a = i * h, b = a + h;
      if (st.mode === 0 || st.mode === 1) {
        const xv = st.mode === 0 ? a : a + h / 2, yv = f(xv);
        const xe = b;
        B.dyn.appendChild(mk('rect', { x: m.px(a), y: m.py(yv), width: m.px(xe) - m.px(a), height: m.py(0) - m.py(yv), ...barFill }, B.dyn));
      } else if (st.mode === 2) {
        const pts = `${m.px(a)},${m.py(0)} ${m.px(a)},${m.py(f(a))} ${m.px(b)},${m.py(f(b))} ${m.px(b)},${m.py(0)}`;
        B.dyn.appendChild(mk('polygon', { points: pts, ...barFill, 'fill-opacity': .18 }, B.dyn));
      }
    }

    // 曲线本身
    B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.4 });

    // 辛普森：每两段配一条抛物线，画出它与坐标轴围成的区域
    if (st.mode === 3) {
      for (let i = 0; i < nu; i += 2) {
        const x0 = i * h, x1 = x0 + h, x2 = x0 + 2 * h;
        const y0 = f(x0), y1 = f(x1), y2 = f(x2);
        const q = x => y0 * (x - x1) * (x - x2) / ((x0 - x1) * (x0 - x2))
          + y1 * (x - x0) * (x - x2) / ((x1 - x0) * (x1 - x2))
          + y2 * (x - x0) * (x - x1) / ((x2 - x0) * (x2 - x1));
        let d = `M ${m.px(x0).toFixed(1)} ${m.py(0).toFixed(1)} `;
        for (let k = 0; k <= 16; k++) {
          const x = x0 + (x2 - x0) * k / 16;
          d += `L ${m.px(x).toFixed(1)} ${m.py(q(x)).toFixed(1)} `;
        }
        d += `L ${m.px(x2).toFixed(1)} ${m.py(0).toFixed(1)} Z`;
        B.dyn.appendChild(mk('path', { d, fill: '#4ade80', 'fill-opacity': .16, stroke: '#4ade80', 'stroke-width': 1.2, 'stroke-opacity': .8 }, B.dyn));
      }
    }

    // 分段竖线
    for (let i = 0; i <= nu; i++) {
      const x = i * h;
      B.dyn.appendChild(mk('line', { x1: m.px(x), y1: m.py(0), x2: m.px(x), y2: m.py(f(x)), stroke: '#8fa3bd', 'stroke-width': .9, 'stroke-opacity': .55 }, B.dyn));
    }

    // 右栏
    B.textM(V(690, 84), `$\\displaystyle\\int_0^1\\frac{dx}{1+x^2}=\\frac{\\pi}{4}$`, { 'font-size': 15, fill: '#5cadff', 'text-anchor': 'start' });
    B.textM(V(690, 118), `$=${TRUE.toFixed(6)}$`, { 'font-size': 13, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(690, 164), `$I=${I.toFixed(6)}$`, { 'font-size': 15, fill: '#ffd166', 'text-anchor': 'start' });
    // 误差写成 a×10^{-k}，指数形式在右栏会被画布右缘截掉
    const ex = v => v === 0 ? '0' : `${(v / Math.pow(10, Math.floor(Math.log10(Math.abs(v))))).toFixed(2)}\\times10^{${Math.floor(Math.log10(Math.abs(v)))}}`;
    B.textM(V(672, 198), `$|I-\\dfrac{\\pi}{4}|=${ex(err)}$`, { 'font-size': 11, fill: '#ff7b8a', 'text-anchor': 'start' });
    const half = Math.max(1, Math.floor(st.n / 2));
    const e2 = Math.abs(est(st.mode, half) - TRUE), e1 = Math.abs(est(st.mode, st.n) - TRUE);
    const ord = e1 > 1e-15 && e2 > 1e-15 ? Math.log2(e2 / e1) : NaN;
    B.textM(V(690, 240), '段数翻倍', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(690, 264), isFinite(ord) ? `误差降到 $1/${Math.pow(2, Math.round(ord))}$` : '误差已到机器精度', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(690, 302), st.mode === 2 ? '阶数约为 $2$' : st.mode === 3 ? '阶数约为 $4$' : '阶数约为 $1$', { 'font-size': 12, fill: '#c084fc', 'text-anchor': 'start' });

    cN(`$${nu}$`);
    cI(`$${I.toFixed(6)}$`);
    cE(`$${err.toExponential(2)}$`);
    cJ(err < 1e-6 ? '已经贴到小数点后六位，再分段只剩机器舍入的起伏'
      : st.mode === 0 ? '矩形每段都取左端高，曲线下降，所以总是高估'
        : st.mode === 1 ? '中点高恰好穿过曲线，误差正负相消，比左端点好得多'
          : st.mode === 2 ? '每个小梯形把曲线夹在斜边两侧，误差成对抵消'
            : '每两段配一条抛物线，曲线更平的地方几乎完全重合');
  };

  const pre = [];
  const mark = () => pre.forEach((b, i) => b.classList.toggle('on', st.mode === i));
  MODES.forEach((t, i) => pre.push(B.btn(t, () => { st.mode = i; mark(); B.render(); })));
  mark();

  B.slider('分段数 n', 1, 12, 1, st.n, v => { st.n = v; B.render(); }, 'n');

  B.hint('段数加倍，梯形误差落到四分之一，辛普森落到十六分之一');
  B.render();
  return B;
}
