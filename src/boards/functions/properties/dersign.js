/* 图 S2 · 导数判据阅读机：上栏 f（按 f′ 符号分色：绿=f′>0 单增段、红=f′<0 单减段），下栏 f′ —— 上下双栏同 x 对照。
   两栏共用同一 px（x 严格对齐）：一根扫描线竖向贯穿两栏，对应同一 x：f 的切线斜率 = f′(x)。
   每栏的 y 各按自身取景框配比（量程宽于横跨时等单位会裁掉曲线主体，故选偏 x 对齐：上栏切线方向按像素比例折算，不宣称 45°=f′=1）。
   坐标约定：SVG 原生方向 u∈[0,860] 向右、v∈[0,520] 向下。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);

  // f/fp：解析式与导数；xa..xb 公共 x 视野；fy 上栏（f）取景框、dy 下栏（f′）取景框；crits 临界点 [x, f(x)]；lv 单调区间列表
  const PRESETS = [
    { name: '① $f=x^2-2x+3$', f: x => x * x - 2 * x + 3, fp: x => 2 * x - 2,
      xa: -1.5, xb: 3.5, fy: [1.2, 6.8], dy: [-5.2, 5.2], crits: [[1, 2]], asy: [],
      lv: '减 (−∞,1) · 增 (1,+∞)' },
    { name: '② $f=x^3-3x$', f: x => x * x * x - 3 * x, fp: x => 3 * x * x - 3,
      xa: -2.5, xb: 2.5, fy: [-3.6, 3.6], dy: [-3.4, 9.8], crits: [[-1, 2], [1, -2]], asy: [],
      lv: '增 (−∞,−1) · 减 (−1,1) · 增 (1,+∞)' },
    { name: '③ $f=\\dfrac{1}{x}$', f: x => 1 / x, fp: x => -1 / (x * x),
      xa: -3.4, xb: 3.4, fy: [-4.4, 4.4], dy: [-4.6, 0.6], crits: [],
      asy: [{ v: 0, h: 0 }],   // h:0 同时画进两栏（上栏 y=0、下栏 y′=0）
      lv: '两支全红：各自递减 —— 与 S1 的「跨缺口陷阱」对上了' },
  ];
  // 上下双栏版式：两栏各占整幅宽度、共享同一 px（x 严格对齐 → 扫描线竖贯两栏）；每栏 y 各自按取景框配比。
  const pad = 16, gap = 44, inPad = 10;
  const H2 = (H - 2 * pad - gap) / 2, VH2 = H2 - 2 * inPad;
  const cTop = pad + H2 / 2, cBot = pad + H2 + gap + H2 / 2;
  const scaleX = P => (W - 2 * pad) / (P.xb - P.xa);                    // 公共横向像素/单位（两栏同值）
  const MAPS = PRESETS.map(P => {
    const sx = scaleX(P), cx = (P.xa + P.xb) / 2;
    const px = x => pad + (W - 2 * pad) / 2 + (x - cx) * sx;
    const fit = (yr, c0) => {
      const cy = (yr[0] + yr[1]) / 2, rng = yr[1] - yr[0];
      const sy = VH2 / rng, ly = rng > 8 ? 2 : 1;                       // 纵向网格/刻度步长：量程超 8 单位时取 2 防标签过密
      return { px, py: y => c0 - (y - cy) * sy, X0: P.xa, X1: P.xb,
        Y0: cy - (H2 / 2) / sy, Y1: cy + (H2 / 2) / sy, sx, sy, ly };
    };
    return { T: fit(P.fy, cTop), Bm: fit(P.dy, cBot) };
  });
  const st = { p: 0, x: 0.5, grid: true, labs: true, asym: true };
  const cF = B.chipM('$f(x)$'), cD = B.chipM("$f'(x)$"), cV = B.chipM('判定'), cLv = B.chip('单调区间');

  /** 按符号分段画 f（上栏）：sg=+1 绿（增）−1 红（减）；临界点为必采锚点 —— 两段在临界点精确接榫 */
  function plotSign(P, sg, at, T) {
    const xs = [];
    for (let x = T.X0; x <= T.X1 + 0.001; x += 0.04) xs.push(x);
    for (const [c0] of P.crits) if (c0 > T.X0 && c0 < T.X1) xs.push(c0);
    xs.sort((p, q) => p - q);
    let d = '', pen = false;
    for (const x of xs) {
      const s = Math.sign(P.fp(x));
      const y = P.f(x);
      if (s === sg && y > T.Y0 && y < T.Y1) { d += (pen ? 'L' : 'M') + T.px(x).toFixed(1) + ' ' + T.py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', ...at }, B.dyn);
  }
  /** 画下栏 f′（临界点锚点：f′ 的零点与上栏金点同 x，要踩准） */
  function plotDer(P, at, Bm) {
    const xs = [];
    for (let x = Bm.X0; x <= Bm.X1 + 0.001; x += 0.04) xs.push(x);
    for (const [c0] of P.crits) if (c0 > Bm.X0 && c0 < Bm.X1) xs.push(c0);
    xs.sort((p, q) => p - q);
    let d = '', pen = false;
    for (const x of xs) {
      const y = P.fp(x);
      if (y > Bm.Y0 && y < Bm.Y1) { d += (pen ? 'L' : 'M') + Bm.px(x).toFixed(1) + ' ' + Bm.py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', ...at }, B.dyn);
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], T = MAPS[st.p].T, Bm = MAPS[st.p].Bm;
    // 上栏：f 的网格与图象（按 f′ 分段）
    B.grid({ ...T, grid: st.grid, labs: st.labs });
    if (st.asym && P.asy.length) {
      const av = P.asy.filter(a => a.v != null);                 // 竖直渐近线两栏都画
      if (av.length) { B.asym(T, av); B.asym(Bm, av); }
      const ah = P.asy.filter(a => a.h != null);
      if (ah.length) { B.asym(T, ah); B.asym(Bm, ah.map(a => ({ h: 0, t: 'y′=0' }))); }
    }
    plotSign(P, 1, { stroke: '#4ade80', 'stroke-width': 2.2 }, T);
    plotSign(P, -1, { stroke: '#ff7b8a', 'stroke-width': 2.2 }, T);
    for (const [cx, cy] of P.crits) B.dot(V(T.px(cx), T.py(cy)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.note('上栏 f 的图象（绿=单增段、红=单减段）', '#93a1b5');
    // 下栏：f′ 的网格与图象（f′=0 的位置与上栏临界点同 x —— 扫描线一起读）
    B.grid({ ...Bm, ayLab: 'y′', grid: st.grid, labs: st.labs });
    plotDer(P, { stroke: '#c084fc', 'stroke-width': 2.2 }, Bm);
    for (const [cx] of P.crits) B.dot(V(Bm.px(cx), Bm.py(0)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.note("下栏 $f'$ 的图象（在 x 轴上方 $\\iff$ f 增）", '#93a1b5');
    // 一根扫描线贯穿两栏 + 切线 + 两点读数（同一 x）
    const x0 = st.x, y = P.f(x0), dv = P.fp(x0);
    B.seg(V(T.px(x0), 0), V(T.px(x0), H), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .8 });
    if (isFinite(y) && y > T.Y0 && y < T.Y1) {
      B.dot(V(T.px(x0), T.py(y)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
      // 切线：沿 (sx, −syA·f′) 像素方向 ±130px（上栏 x/y 刻度无可比性，方向按折算）
      const Lg = Math.hypot(T.sx, T.sy * dv) || 1;
      const dx = T.sx / Lg * 130, dy = -T.sy * dv / Lg * 130;
      B.seg(V(T.px(x0) - dx, T.py(y) - dy), V(T.px(x0) + dx, T.py(y) + dy), { stroke: '#ffd166', 'stroke-width': 2 });
    }
    if (isFinite(dv) && dv > Bm.Y0 && dv < Bm.Y1) {
      B.dot(V(Bm.px(x0), Bm.py(dv)), 5.5, { fill: '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.5 });
    }
    // 徽章
    const defined = Number.isFinite(dv);
    cF(Number.isFinite(y) ? `$f(${fmt(st.x, 2)})=${fmt(y, 2)}$` : '此处无定义');
    cD(defined ? `$f'(${fmt(st.x, 2)})=${fmt(dv, 2)}$` : '此处无定义');
    cV(!defined ? '定义域在此断开'
      : dv > 1e-9 ? "$f'>0$ · 递增段"
      : dv < -1e-9 ? "$f'<0$ · 递减段"
      : "$f'=0$ · 检查两侧的导数符号");
    cLv(P.lv, '');
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    st.x = Math.max(p.xa + 0.15, Math.min(p.xb - 0.15, st.x));   // 切点夹回新视野
    sl.setAttribute('min', p.xa + 0.15); sl.setAttribute('max', p.xb - 0.15); sl.sync(st.x);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const sl = B.slider('切点 x', -1.35, 3.35, 0.05, 0.5, v => { st.x = v; B.render(); });
  B.graphToggles(st);
  B.hint("拖动扫描线，对照同一个 x 处的函数切线和导数。");
  B.render();
  return B;
}
