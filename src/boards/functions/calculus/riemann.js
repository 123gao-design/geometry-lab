/* 图 V6 · 黎曼累加机：上栏 f + 黎曼矩形，下栏 F(x)=∫₀ˣf —— 上下双栏 x 各自取景（S2 f/f′ 先例），
   探针扫描线贯通两栏：下栏切线斜率 = 上栏当前高度，微积分基本定理当图看。
   黎曼和随 n 加密滑向精确值；左/右端点采样各在单调段系统性偏低/偏高 ——「以直代曲」的加法版。
   坐标约定：上栏 rect [0,0,860,298]、下栏 [0,302,860,218]；两栏 x 视野同为 [a−0.25, b+0.25]。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new Board(root, W, H);

  const PRESETS = [
    { name: '① $f=x^2$', f: x => x * x, F: x => x * x * x / 3, a: 0, b: 2.2, top: [-0.7, 5.4], bot: [-0.7, 4.4] },
    { name: '② $f=\\sin x$', f: Math.sin, F: x => 1 - Math.cos(x), a: 0, b: Math.PI, top: [-0.45, 1.5], bot: [-0.45, 2.5] },
    { name: '③ $f=\\sqrt{x}$', f: x => Math.sqrt(x), F: x => (2 / 3) * Math.pow(x, 1.5), a: 0, b: 2.4, top: [-0.7, 2.0], bot: [-0.7, 2.8] },
  ];
  const TRECT = [0, 0, 860, 298], BRECT = [0, 302, 860, 218];
  const TMAPS = PRESETS.map(P => B.isoFit(P.a - 0.25, P.b + 0.25, P.top[0], P.top[1], TRECT, 18));
  const BMAPS = PRESETS.map(P => B.isoFit(P.a - 0.25, P.b + 0.25, P.bot[0], P.bot[1], BRECT, 18));
  const st = { p: 0, n: 4, xp: 1.2, left: false, grid: true, labs: true };

  const cR = B.chipM('黎曼和'), cX = B.chipM('精确值'), cE = B.chipM('误差判读'), cT = B.chipM('基本定理');

  B.renderFn = () => {
    const P = PRESETS[st.p], T = TMAPS[st.p], Bm = BMAPS[st.p];
    // 分隔线
    B.seg(V(0, 300), V(W, 300), { stroke: '#2e3d57', 'stroke-width': 1 });
    // ── 上栏：f、精确面积（绿，[a..xp]）、黎曼矩形（蓝）──
    B.grid({ ...T, grid: st.grid, labs: st.labs });
    let da = `M ${T.px(P.a).toFixed(1)} ${T.py(0).toFixed(1)} `;
    for (let i = 0; i <= 60; i++) { const x = P.a + (st.xp - P.a) * i / 60; da += `L ${T.px(x).toFixed(1)} ${T.py(P.f(x)).toFixed(1)} `; }
    da += `L ${T.px(st.xp).toFixed(1)} ${T.py(0).toFixed(1)} Z`;
    mk('path', { d: da, fill: '#4ade80', 'fill-opacity': .16, stroke: 'none' }, B.dyn);
    const dx = (P.b - P.a) / st.n;
    let sum = 0;
    for (let i = 0; i < st.n; i++) {
      const xe = st.left ? P.a + i * dx : P.a + (i + 1) * dx;
      const h = P.f(xe);
      sum += h * dx;
      const rx = T.px(P.a + i * dx), rw = T.px(P.a + (i + 1) * dx) - rx - 0.8;
      mk('rect', { x: rx.toFixed(1), y: T.py(h).toFixed(1), width: Math.max(rw, 1).toFixed(1), height: (T.py(0) - T.py(h)).toFixed(1), fill: '#5cadff', 'fill-opacity': .28, stroke: '#5cadff', 'stroke-width': 1 }, B.dyn);
    }
    // 上栏曲线 + 探针点
    let d = '', pen = false;
    for (let x = T.X0; x <= T.X1 + 0.001; x += 0.03) {
      const y = P.f(x);
      if (isFinite(y) && y > T.Y0 && y < T.Y1) { d += (pen ? 'L' : 'M') + T.px(x).toFixed(1) + ' ' + T.py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    B.seg(V(T.px(st.xp), 0), V(T.px(st.xp), 298), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .85 });
    const fp0 = P.f(st.xp);
    if (fp0 > T.Y0 && fp0 < T.Y1) B.dot(V(T.px(st.xp), T.py(fp0)), 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.text(V(14, 18), 'f 与黎曼矩形（蓝）· 精确面积（绿，到探针）', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'start' });
    // ── 下栏：F(x)=∫₀ˣf、探针切线 ──
    B.grid({ ...Bm, ayLab: 'F', grid: st.grid, labs: st.labs });
    d = ''; pen = false;
    for (let x = Bm.X0; x <= Bm.X1 + 0.001; x += 0.03) {
      const y = P.F(x);
      if (isFinite(y) && y > Bm.Y0 && y < Bm.Y1) { d += (pen ? 'L' : 'M') + Bm.px(x).toFixed(1) + ' ' + Bm.py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#4ade80', 'stroke-width': 2.2 }, B.dyn);
    const F0 = P.F(st.xp);
    if (F0 > Bm.Y0 && F0 < Bm.Y1) {
      // 切线：斜率 = f(xp)（F′=f），按两栏各自比例尺换像素
      const ux = Bm.px(1) - Bm.px(0), uy = Bm.py(0) - Bm.py(1);
      const Lg = Math.hypot(ux, uy * fp0) || 1;
      B.seg(V(Bm.px(st.xp) - ux / Lg * 130, Bm.py(F0) + uy * fp0 / Lg * 130), V(Bm.px(st.xp) + ux / Lg * 130, Bm.py(F0) - uy * fp0 / Lg * 130), { stroke: '#ffd166', 'stroke-width': 2 });
      B.dot(V(Bm.px(st.xp), Bm.py(F0)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
    }
    B.seg(V(Bm.px(st.xp), 302), V(Bm.px(st.xp), H), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .85 });
    B.tex(V(14, 320), '下栏 $F(x)=\\int_0^x f$ —— 切线斜率就是上栏当前高度（$F\'=f$）', { size: 12.5, color: '#93a1b5', anchor: 'start', w: 520 });

    // 徽章
    const exact = P.F(P.b) - P.F(P.a);
    cR(`$\\sum f(x_i)\\Delta x=${fmt(sum, 3)}$（$n=${st.n}$，$\\Delta x=${fmt(dx, 3)}$，${st.left ? '左' : '右'}端点）`, '');
    cX(`$\\int_a^b f\\,\\mathrm{d}x=F(b)-F(a)=${fmt(exact, 3)}$ —— 解析原函数一分不差`, 'ok');
    const err = sum - exact, rel = Math.abs(err) / Math.abs(exact);
    let eTxt, eCls;
    if (rel < 0.05) { eTxt = `误差仅 ${fmt(Math.abs(err), 3)}（${fmt(rel * 100, 1)}%）—— 矩形无限加密，和趋于面积：定积分就是这个极限`; eCls = 'ok'; }
    else { eTxt = `${err > 0 ? '偏高' : '偏低'} ${fmt(Math.abs(err), 3)}（${fmt(rel * 100, 1)}%）—— ${st.left ? '左' : '右'}端点以直代曲的系统性偏差；n 加倍、误差约减半`; eCls = ''; }
    cE(eTxt, eCls);
    cT(`下栏 $F'(${fmt(st.xp, 2)})=f(${fmt(st.xp, 2)})=${fmt(fp0, 3)}$ —— 面积 F 的增速恰是上栏的高度：求导与求积互逆`, 'ok');
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    st.xp = Math.max(p.a + 0.05, Math.min(p.b - 0.05, st.xp));
    slX.setAttribute('min', p.a + 0.05); slX.setAttribute('max', p.b - 0.05); slX.sync(st.xp);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.slider('份数 n', 1, 48, 1, 4, v2 => { st.n = Math.round(v2); B.render(); });
  const slX = B.slider('探针 x', 0.05, 2.15, 0.05, 1.2, v2 => { st.xp = v2; B.render(); });
  B.toggleBtn('左端点采样', false, on => { st.left = on; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('n 加密：矩形和趋于精确面积；下栏探针的切线斜率 = 上栏高度 —— 定积分与导数互为逆运算');
  B.render();
  return B;
}
