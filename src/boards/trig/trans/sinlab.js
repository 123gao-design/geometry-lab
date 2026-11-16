/* 图 F1 三旋钮变波机：y = A sin(ωx+φ) —— A 管值域 [-A,A]（金色值域带随 A 变宽）、
   ω 管周期 T=2π/ω（金色周期段随 ω 伸缩）、φ 管起点 x₀=−φ/ω（五点整体横移）；
   母波 sin x 灰虚参照。三旋钮各管一件事、互不干扰（G1 平移 / G2 伸缩的三角版）。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { A: 1, w: 1, f: 0, ghost: true, five: true, per: true, grid: true, labs: true };
  const sA = B.slider('振幅 A', 0.2, 3, 0.1, 1, v => { st.A = v; B.render(); });
  const sw = B.slider('角频率 ω', 0.5, 3, 0.1, 1, v => { st.w = v; B.render(); });
  const sf = B.slider('相位 φ', -Math.PI, Math.PI, Math.PI / 12, 0, v => { st.f = v; B.render(); });
  B.toggleBtn('母波', true, v => { st.ghost = v; B.render(); });
  B.toggleBtn('五点', true, v => { st.five = v; B.render(); });
  B.toggleBtn('周期 T', true, v => { st.per = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  const pre = (A, w, f) => () => { st.A = A; st.w = w; st.f = f; sA.sync(A); sw.sync(w); sf.sync(f); B.render(); };
  B.btnM('还原', pre(1, 1, 0));
  B.btnM('$y=2\\sin 2x$', pre(2, 2, 0));
  B.btnM('$y=\\sin\\bigl(x+\\tfrac{\\pi}{2}\\bigr)$', pre(1, 1, Math.PI / 2));
  const cT = B.chipM('周期 T'), cR = B.chipM('值域'), cS = B.chipM('起点'), cJ = B.chip('判读');

  const m = B.isoFit(-0.6, TAU + 0.6, -3.3, 3.3);
  /** π/2 整数倍 → '0 / π/2 / π / 3π/2 / 2π…' */
  function piLab(v) {
    const k = Math.round(v / (Math.PI / 2));
    if (k === 0) return '0';
    const n = Math.abs(k), s = k % 2 ? (n === 1 ? 'π/2' : n + 'π/2') : (n === 2 ? 'π' : (n / 2) + 'π');
    return (k < 0 ? '-' : '') + s;
  }
  /** 曲线采样：线性 + π/2 倍数锚点 + 五点锚点（规范⑨：特殊点并进采样数组） */
  function sam(f, x0, x1, n, extra) {
    const xs = [];
    for (let i = 0; i <= n; i++) xs.push(x0 + (x1 - x0) * i / n);
    for (let k = -2; k <= 6; k++) { const v = k * Math.PI / 2; if (v > x0 && v < x1) xs.push(v); }
    (extra || []).forEach(v => { if (isFinite(v) && v > x0 && v < x1) xs.push(v); });
    xs.sort((a, b) => a - b);
    return xs.map(x => `${m.px(x).toFixed(1)},${m.py(f(x)).toFixed(1)}`);
  }
  function poly(pts, color, w, op, dash) {
    if (pts.length < 2) return;
    const at = { points: pts.join(' '), fill: 'none', stroke: color, 'stroke-width': w };
    if (op) at['stroke-opacity'] = op;
    if (dash) at['stroke-dasharray'] = dash;
    mk('polyline', at, B.dyn);
  }
  /** 相位按 π/12 约分成 π 分数（滑块步长保证命中）：'+\frac{\pi}{2}'、'-\frac{\pi}{3}'… */
  function texF(f) {
    if (Math.abs(f) < 1e-9) return '';
    const k = Math.round(f * 12 / Math.PI);
    if (Math.abs(f - k * Math.PI / 12) > 1e-9) return (f > 0 ? '+' : '-') + fmt(Math.abs(f), 2);
    const g = (a, b) => b ? g(b, a % b) : a;
    const d = g(Math.abs(k), 12), n2 = Math.abs(k) / d, den = 12 / d;
    const s = den === 1 ? `${n2}\\pi` : `\\frac{${n2 === 1 ? '' : n2}\\pi}{${den}}`;
    return (k < 0 ? '-' : '+') + s;
  }
  /** 当前解析式：y=A\sin(\omega x+\varphi)（系数为 1 时省略、相位约分成 π 分数） */
  const texY = (A, w, f) => `$y=${Math.abs(A - 1) < 1e-9 ? '' : +fmt(A, 1)}\\sin(${Math.abs(w - 1) < 1e-9 ? '' : +fmt(w, 1)}x${texF(f)})$`;

  B.renderFn = () => {
    const { A, w, f } = st;
    const T = TAU / w, x0 = -f / w;
    const F = x => A * Math.sin(w * x + f);
    B.grid({ ...m, sx: Math.PI / 2, sy: 1, lx: Math.PI / 2, ly: 1, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = -2; k <= 6; k++) {
      const v = k * Math.PI / 2;
      if (v > m.X0 + 0.01 && v < m.X1 - 0.01) B.text(V(m.px(v), m.py(0) + 16), piLab(v), { 'font-size': 11, fill: '#5c6a80' });
    }
    // 值域带压 y 轴（规范⑤）：[-A, A] 随 A 变宽
    mk('rect', { x: m.px(0) - 7, y: m.py(A), width: 7, height: m.py(-A) - m.py(A), fill: '#ffd166', opacity: .16 }, B.dyn);
    // 周期段：x₀ → x₀+T 的金虚线 + T 读数
    if (st.per) {
      const a = V(m.px(x0), m.py(0)), b = V(m.px(x0 + T), m.py(0)), mid = (a.x + b.x) / 2;
      if (b.x > -20 && a.x < B.w + 20) {
        B.seg(a, b, { stroke: '#ffd166', 'stroke-width': 1.8, 'stroke-dasharray': '6 5' });
        if (mid > 12 && mid < B.w - 12) B.tex(V(mid, m.py(0) - 13), `$T=${fmt(T, 2)}$`, { size: 12, color: '#ffd166', anchor: 'mid', w: 90 });
      }
    }
    if (st.ghost) poly(sam(Math.sin, m.X0, m.X1, 420), '#93a1b5', 1.5, .45, '5 5');   // 母波
    poly(sam(F, m.X0, m.X1, 420, [x0, x0 + T / 4, x0 + T / 2, x0 + 3 * T / 4, x0 + T]), '#5cadff', 2.2);
    // 五点骨架：起点/峰/中/谷/终点（W1 五点被三旋钮整体加工）
    if (st.five) {
      for (let k = 0; k <= 4; k++) {
        const u = x0 + k * T / 4, yv = [0, A, 0, -A, 0][k];
        if (u > m.X0 + 0.01 && u < m.X1 - 0.01) {
          if (k === 1 || k === 3) B.seg(V(m.px(u), m.py(0)), V(m.px(u), m.py(yv)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .8 });
          B.dot(V(m.px(u), m.py(yv)), 3.4, { fill: '#ffd166' });
        }
      }
      if (x0 > m.X0 + 0.01 && x0 < m.X1 - 0.01) B.tex(V(m.px(x0), m.py(0) + 24), '$x_0$', { size: 11, color: '#ffd166', anchor: 'mid', w: 36 });
    }
    B.tex(V(m.px(m.X0) + 12, m.py(3.05)), texY(A, w, f), { size: 15, color: '#5cadff', anchor: 'start', w: 360 });
    // chips：三读数对三实物（周期段 / 值域带 / 起点金点）
    cT(`$T=\\frac{2\\pi}{\\omega}=${fmt(T, 3)}$`);
    cR(`$y\\in[-${fmt(A, 2)},\\ ${fmt(A, 2)}]$`);
    cS(`$x_0=-\\frac{\\varphi}{\\omega}=${fmt(x0, 3)}$`);
    const j1 = `A=${fmt(A, 1)}${A > 1.04 ? ' 拉高' : A < 0.96 ? ' 压扁' : ''}`;
    const j2 = `T=${fmt(T, 2)}${T < 6.2 ? ' 压密' : T > 6.45 ? ' 拉疏' : ''}`;
    const j3 = `x₀=${fmt(x0, 2)}${x0 < -0.02 ? ' 左移' : x0 > 0.02 ? ' 右移' : ''}`;
    cJ([j1, j2, j3].join(' · '));
  };
  B.render();
  B.hint('拖 A：值域带变宽；拖 ω：周期段变短、波变密；拖 φ：五点整体平移 —— 三旋钮各管一件事');
  // 出口：三个旋钮的当前值带进自由画板
  B.ggbOutlet(() => [
    `A=${fmt(st.A, 2)}`, `w=${fmt(st.w, 2)}`, `p=${fmt(st.f, 2)}`,
    'f(x)=A sin(w x+p)', 'g(x)=sin(x)',
  ]);
  return B;
}
