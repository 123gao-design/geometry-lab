/* 图 V8 · 上图为被积函数与有向矩形，下图为同一横坐标下的累积积分。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);

  const PRESETS = [
    { name: '① $f=x^2$', f: x => x * x, F: x => x * x * x / 3, a: 0, b: 2.2, top: [-0.7, 5.4], bot: [-0.7, 4.4] },
    { name: '② $f=\\sin x$', f: Math.sin, F: x => 1 - Math.cos(x), a: 0, b: Math.PI, top: [-0.45, 1.5], bot: [-0.45, 2.5] },
    { name: '③ $f=\\sqrt{x}$', f: x => Math.sqrt(x), F: x => (2 / 3) * Math.pow(x, 1.5), a: 0, b: 2.4, top: [-0.7, 2.0], bot: [-0.7, 2.8] },
    { name: '④ 有向面积 $f=x-1$', f: x => x - 1, F: x => x * x / 2 - x, a: 0, b: 2, top: [-1.25, 1.25], bot: [-.65, .4], zero: 1 },
  ];
  const TRECT = [35, 42, 790, 227], BRECT = [35, 324, 790, 174];
  const TMAPS = PRESETS.map(P => B.mapFit(P.a - 0.25, P.b + 0.25, ...P.top, TRECT, 15));
  const BMAPS = PRESETS.map(P => B.mapFit(P.a - 0.25, P.b + 0.25, ...P.bot, BRECT, 15));
  const st = { p: 0, n: 4, xp: 1.2, left: false, grid: true, labs: true };

  const cR = B.chipM('黎曼和'), cX = B.chipM('精确值'), cE = B.chipM('误差判读'), cT = B.chipM('基本定理');

  B.renderFn = () => {
    const P = PRESETS[st.p], T = TMAPS[st.p], Bm = BMAPS[st.p];
    // 分隔线
    B.seg(V(35, 289), V(825, 289), { stroke: '#2e3d57', 'stroke-width': 1 });
    B.text(V(35, 30), '被积函数 f 与矩形和', { fill: '#5cadff', 'text-anchor': 'start' });
    B.text(V(35, 313), '累积积分 F', { fill: '#4ade80', 'text-anchor': 'start' });
    // ── 上栏：f、精确面积（绿，[a..xp]）、黎曼矩形（蓝）──
    B.grid({ ...T, grid: st.grid, labs: st.labs });
    const ends = P.zero > P.a && P.zero < st.xp ? [P.a, P.zero, st.xp] : [P.a, st.xp];
    for (let j = 1; j < ends.length; j++) {
      const left = ends[j - 1], right = ends[j];
      let area = `M${T.px(left)} ${T.py(0)}`;
      for (let i = 0; i <= 50; i++) {
        const x = left + (right - left) * i / 50;
        area += ` L${T.px(x).toFixed(2)} ${T.py(P.f(x)).toFixed(2)}`;
      }
      area += ` L${T.px(right)} ${T.py(0)} Z`;
      const color = P.f((left + right) / 2) < 0 ? '#ff9e4a' : '#4ade80';
      mk('path', { d: area, fill: color, 'fill-opacity': .24, stroke: 'none' }, B.dyn);
    }
    const dx = (P.b - P.a) / st.n;
    let sum = 0;
    for (let i = 0; i < st.n; i++) {
      const xe = st.left ? P.a + i * dx : P.a + (i + 1) * dx;
      const h = P.f(xe);
      sum += h * dx;
      const rx = T.px(P.a + i * dx), rw = T.px(P.a + (i + 1) * dx) - rx - 0.8;
      if (Math.abs(h) < 1e-12) continue;
      const color = h < 0 ? '#ff9e4a' : '#5cadff';
      mk('rect', { x: rx, y: Math.min(T.py(0), T.py(h)), width: Math.max(rw, 1),
        height: Math.abs(T.py(0) - T.py(h)), fill: color, 'fill-opacity': .17,
        stroke: color, 'stroke-width': 1, 'stroke-dasharray': h < 0 ? '4 3' : 'none' }, B.dyn);
    }
    // 上栏曲线 + 探针点
    let d = '', pen = false;
    for (let x = T.X0; x <= T.X1 + 0.001; x += 0.03) {
      const y = P.f(x);
      if (isFinite(y) && y > T.Y0 && y < T.Y1) { d += (pen ? 'L' : 'M') + T.px(x).toFixed(1) + ' ' + T.py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    B.seg(V(T.px(st.xp), TRECT[1]), V(T.px(st.xp), 498), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .85 });
    const fp0 = P.f(st.xp);
    if (fp0 > T.Y0 && fp0 < T.Y1) B.dot(V(T.px(st.xp), T.py(fp0)), 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    B.note('蓝色实线矩形 · 正贡献', '#5cadff');
    if (P.zero) B.note('橙色虚线矩形 · 负贡献', '#ff9e4a');
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
      const span = 130 / Lg;
      B.plot(x => F0 + (x - st.xp) * fp0, Bm, {
        x0: Math.max(Bm.X0, st.xp - span), x1: Math.min(Bm.X1, st.xp + span),
        n: 70, stroke: '#ffd166', 'stroke-width': 2,
      });
      B.dot(V(Bm.px(st.xp), Bm.py(F0)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
    }
    B.note("绿色曲线 · $F(x)=\\int_0^x f(t)\\,\\mathrm{d}t$", '#4ade80');

    // 徽章
    const exact = P.F(P.b) - P.F(P.a);
    cR(`$\\sum f(x_i)\\Delta x=${fmt(sum, 3)}$（$n=${st.n}$，$\\Delta x=${fmt(dx, 3)}$，${st.left ? '左' : '右'}端点）`, '');
    cX(`$\\int_a^b f\\,\\mathrm{d}x=F(b)-F(a)=${fmt(exact, 3)}$ —— 解析原函数一分不差`, 'ok');
    const error = sum - exact;
    const relative = exact !== 0 ? `（相对误差 ${fmt(Math.abs(error / exact) * 100, 1)}%）` : '';
    const near = Math.abs(error) < .0005;
    cE(near ? '当前精度内相等' : `${error > 0 ? '偏高' : '偏低'} ${fmt(Math.abs(error), 3)}${relative}`, near ? 'ok' : '');
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
  B.hint("移动探针，比较同一横坐标处的函数值与累积积分的切线斜率。");
  B.render();
  return B;
}
