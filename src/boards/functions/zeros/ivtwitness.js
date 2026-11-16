/* 图 R2 · 端点验号机：零点存在性定理 —— [a,b] 上连续 + f(a)·f(b)<0 ⟹ (a,b) 内必有零点
   ① 连续异号 → 存在（但本例 3 个 —— 定理不保证唯一）；② 同号照样有零点（条件充分不必要）；
   ③ 跳跃间断反例：端点异号却无零点（连续性被 0.5 处的跳变偷走）；
   ④ 严格单调 + 异号 → 存在且唯一（单调是唯一性的来源）。
   两把手 a、b 锁曲线拖（只改横坐标）：绿带是区间、灰点是零点实况 —— 定理只说「有」，个数位置另算。
   图象规范：B.isoFit 等单位取景；公式一律 B.tex/btnM/chipM；网格 / 轴标注 两开关；零点与跳变点为必采锚点。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);

  // cont 连续；mono 严格单调；zeros 静态零点（画灰点 + 采样锚点）；a/b 开场档位；jump 跳变点（③）
  const PRESETS = [
    { name: '① 连续异号', eq: '$f(x)=x^3-3x+1$（连续）—— 拖把手 a、b，端点符号即判定',
      f: x => x * x * x - 3 * x + 1, d: () => true, cont: true, mono: false,
      box: [-2.5, 2.5, -3.6, 3.6], a: -2, b: 2, zeros: [-1.88, 0.35, 1.53], jump: null },
    { name: '② 同号也有零点', eq: '$f(x)=x^2$ —— $f(a)f(b)>0$，定理管不着，零点照样有',
      f: x => x * x, d: () => true, cont: true, mono: false,
      box: [-3, 3, -1, 4.6], a: -2, b: 2, zeros: [0], jump: null },
    { name: '③ 跳跃反例', eq: '分段：$x+1$（$x<0.5$）、$x-2$（$x\\ge 0.5$）—— 0.5 处跳变',
      f: x => (x < 0.5 ? x + 1 : x - 2), d: () => true, cont: false, mono: false,
      box: [-1.6, 2.6, -3, 2.4], a: 0, b: 1.5, zeros: [-1, 2], jump: 0.5 },
    { name: '④ 单调唯一', eq: "$f(x)=x^3+x-1$：$f'(x)=3x^2+1>0$ —— 异号 ⟹ 存在且唯一",
      f: x => x * x * x + x - 1, d: () => true, cont: true, mono: true,
      box: [-1.8, 1.8, -7, 7], a: -1.5, b: 1.5, zeros: [0.68], jump: null },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, a: -2, b: 2, grid: true, labs: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cA = B.chipM('f(a)'), cB = B.chipM('f(b)'), cS = B.chipM('乘积'), cZ = B.chipM('区间实况'), cV = B.chipM('判定');

  /** 把手：锁在曲线上（只改横坐标） */
  const mkHandle = (key, label, dx) => B.handle({
    get: () => { const P = PRESETS[st.p]; return V(px(st[key]), py(P.f(st[key]))); },
    set: p => {
      const M = MAPS[st.p];
      let x = M.X0 + (p.x / W) * (M.X1 - M.X0);
      st[key] = Math.max(M.X0 + 0.15, Math.min(M.X1 - 0.15, x));
    },
    color: key === 'a' ? '#ffd166' : '#ff9e4a', r: 6.5, label, lo: [dx, 26],
  });
  mkHandle('a', 'a', -14);
  mkHandle('b', 'b', 10);

  /** 区间 [lo,hi] 内零点实况：变号计数（|Δf|>0.5 视为间断不数）+ 触轴不穿轴的谷底贴 0 检测（x² 型） */
  function scanZeros(P, lo, hi) {
    const n = 500, dx = (hi - lo) / n;
    const f = i => P.f(lo + i * dx);
    const out = [];
    let pv = f(0);
    if (Math.abs(pv) < 1e-9) out.push(lo);
    for (let i = 1; i <= n; i++) {
      const v = f(i);
      if (Math.abs(v) < 1e-9) { out.push(lo + i * dx); pv = v; continue; }
      if (pv * v < 0 && Math.abs(v - pv) < 0.5) out.push(lo + (i - 0.5) * dx);
      if (i < n && pv > 0 && v > 0) {
        const nv = f(i + 1);
        if (v < pv && v < nv && v < 0.002) out.push(lo + i * dx);
      }
      pv = v;
    }
    out.sort((p, q) => p - q);
    return out.filter((z, i) => i === 0 || Math.abs(z - out[i - 1]) > 1e-3);
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.tex(V(16, 24), P.eq, { size: 14, color: '#93a1b5', anchor: 'start' });
    // 曲线（③ 分两支画 + 跳变点：左极限空心、右取值实心）；零点与跳变点为必采锚点
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.04) xs.push(x);
    for (const z of P.zeros) if (z > M.X0 && z < M.X1) xs.push(z);
    if (P.jump != null) xs.push(P.jump);
    xs.sort((p, q) => p - q);
    const drawCurve = dom => {
      let d = '', pen = false;
      for (const x of xs) {
        if (dom(x) && P.d(x)) {
          const y = P.f(x);
          if (y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
        }
        pen = false;
      }
      mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    };
    if (P.jump == null) drawCurve(() => true);
    else {
      drawCurve(x => x < P.jump);
      drawCurve(x => x >= P.jump);
      B.dot(V(px(P.jump), py(P.f(P.jump - 1e-9))), 5.5, { fill: 'none', stroke: '#5cadff', 'stroke-width': 2 });
      B.dot(V(px(P.jump), py(P.f(P.jump))), 5.5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.4 });
    }
    // 零点实况（灰点）+ 区间绿带
    for (const z of P.zeros) if (z > M.X0 && z < M.X1) B.dot(V(px(z), py(0)), 3.5, { fill: '#93a1b5' });
    const lo = Math.min(st.a, st.b), hi = Math.max(st.a, st.b);
    mk('rect', { x: px(lo), y: py(Y1), width: px(hi) - px(lo), height: py(Y0) - py(Y1), fill: '#4ade80', 'fill-opacity': .06 }, B.dyn);
    B.seg(V(px(lo), py(0)), V(px(hi), py(0)), { stroke: '#4ade80', 'stroke-width': 5, 'stroke-opacity': .55, 'stroke-linecap': 'butt' });
    // 端点参考线与读数
    const fa = P.f(st.a), fb = P.f(st.b);
    for (const [k, v, c] of [[st.a, fa, '#ffd166'], [st.b, fb, '#ff9e4a']])
      B.seg(V(px(k), py(v)), V(px(k), py(0)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .7 });
    B.text(V(px(st.a), py(0) - 12), `a=${fmt(st.a, 2)}`, { 'font-size': 11, fill: '#ffd166', 'text-anchor': st.a > st.b ? 'end' : 'start' });
    B.text(V(px(st.b), py(0) - 12), `b=${fmt(st.b, 2)}`, { 'font-size': 11, fill: '#ff9e4a', 'text-anchor': st.b < st.a ? 'end' : 'start' });
    // 徽章
    cA(`$f(a)=${fmt(fa, 2)}$`, '');
    cB(`$f(b)=${fmt(fb, 2)}$`, '');
    const zs = scanZeros(P, lo, hi);
    const zList = zs.map(z => fmt(z, 2)).join('、');
    cZ(`区间内实况：${zs.length} 个零点${zs.length ? ' ≈ ' + zList : ''} —— 定理不数数，数数要自己动手`, '');
    if (Math.abs(hi - lo) < 1e-9) {
      cS('—', 'warn');
      cV('两点重合 —— 区间退化为一点，端点不存在', 'warn');
    } else if (Math.abs(fa) < 1e-7 || Math.abs(fb) < 1e-7) {
      cS('端点为零', 'ok');
      cV('端点自己就是零点：f(a)=0 或 f(b)=0 —— 严格不等号用不上，零点直接找到了', 'ok');
    } else {
      const neg = fa * fb < 0;
      cS(neg ? '$f(a)\\cdot f(b)<0$ 异号' : '$f(a)\\cdot f(b)>0$ 同号', neg ? 'ok' : 'warn');
      if (neg && !P.cont) cV('反例现场：端点异号却没有零点 —— 0.5 处的跳变把「连续」偷走了，定理失效', 'warn');
      else if (neg && P.mono) cV(`异号 + 连续 + 严格单调 ⟹ 存在且唯一 ✓ —— 实况 ${zs.length} 个，恰好对上`, zs.length === 1 ? 'ok' : 'warn');
      else if (neg) cV(`异号 + 连续 ⟹ 存在 ✓ —— 实况 ${zs.length} 个：个数定理不管（要唯一，加单调）`, zs.length === 1 ? 'ok' : 'warn');
      else cV(`同号：定理管不着 —— 实况 ${zs.length} 个零点${zs.length ? '，同号照样有零点（条件是充分不必要）' : '，同号还真能一个都没有'}`, zs.length ? 'warn' : '');
    }
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i; st.a = p.a; st.b = p.b;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('存在性定理只给「有」，不给「几个」也不给「在哪」—— ①里数一数，③里看跳变，④里要唯一加单调');
  B.render();
  return B;
}
