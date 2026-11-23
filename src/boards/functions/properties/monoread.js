/* 图 S1 · 单调性阅读机：任取 x₁<x₂，比 f(x₁) 与 f(x₂) —— 增减定义的双点抽查台
   三个预设：① x²（对称回折）② x³−3x（增减交替）③ 1/x（跨定义域缺口的经典陷阱）。
   图象规范：各预设 B.isoFit 等单位取景（弦的倾角就是弦斜率的真方向）；把手只沿曲线拖（锁定定义域内）；
   顶点/临界点灰点标注；③ 的渐近线由开关隐藏；网格 / 轴标注 可隐藏。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new FunctionBoard(root, W, H);

  // box 取景框；marks 特殊点 [x,y]（顶点/临界点）；asy 渐近线；snap：把手吸离缺口
  const PRESETS = [
    { name: '① $f(x)=x^2$', f: x => x * x, d: () => true, box: [-2.8, 2.8, -1.2, 5.2], d1: -2, d2: 2,
      marks: [[0, 0]], asy: [],
      lv: '减 (−∞, 0] · 增 [0, +∞)' },
    { name: '② $f(x)=x^3-3x$', f: x => x * x * x - 3 * x, d: () => true, box: [-2.9, 2.9, -2.9, 2.9], d1: -2, d2: 1,
      marks: [[-1, 2], [1, -2]], asy: [],
      lv: '增 (−∞,−1] · 减 [−1,1] · 增 [1,+∞)' },
    { name: '③ $f(x)=\\dfrac{1}{x}$', f: x => 1 / x, d: x => Math.abs(x) > 1e-6, box: [-2.4, 2.4, -2.4, 2.4], d1: -1, d2: 1,
      marks: [], asy: [{ v: 0 }, { h: 0 }],
      snap: x => Math.abs(x) < 0.25 ? (x < 0 ? -0.25 : 0.25) : x,   // 把手吸离缺口，防止掉进 x=0
      lv: '在 (−∞,0) 与 (0,+∞) 上各减 —— 缺口不许打包' },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, x1: -2, x2: 2, grid: true, labs: true, asym: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cA = B.chipM('$f(x_1)$'), cB = B.chipM('$f(x_2)$'), cS = B.chip('弦斜率'), cV = B.chip('判定'), cLv = B.chip('区间列表');

  /** 把手：锁定在曲线上（只改横坐标），lo 微调标签位置 */
  const mkHandle = (key, label, dx) => B.handle({
    get: () => { const P = PRESETS[st.p]; return V(px(st[key]), py(P.f(st[key]))); },
    set: p => {
      const P = PRESETS[st.p], M = MAPS[st.p];
      let x = M.X0 + (p.x / W) * (M.X1 - M.X0);          // 像素 → 数学（横坐标单值反解）
      x = Math.max(M.X0 + 0.15, Math.min(M.X1 - 0.15, x));
      st[key] = P.snap ? P.snap(x) : x;
    },
    color: key === 'x1' ? '#ffd166' : '#ff9e4a', r: 6.5, label, lo: [dx, 26],
  });
  mkHandle('x1', 'x₁', -16);
  mkHandle('x2', 'x₂', 8);

  /** 两点间是否有定义域缺口（③ 跨 x=0 时用来抓「打包比较」陷阱） */
  function gapBetween(P, a, b) {
    for (let u = a; u <= b; u += (b - a) / 60) if (!P.d(u)) return true;
    return !P.d(a) || !P.d(b);
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym && P.asy.length) B.asym(M, P.asy);
    // 曲线（与轴线同量级粗细）；特殊点 x 为必采锚点（顶点/临界点要精确踩到灰点，不许被网格插肩错过）
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.05) xs.push(x);
    for (const [mx] of P.marks) if (mx > M.X0 && mx < M.X1) xs.push(mx);
    xs.sort((p, q) => p - q);
    let d = '', pen = false;
    for (const x of xs) {
      if (P.d(x)) {
        const y = P.f(x);
        if (y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
      }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    // 特殊点（顶点/临界点）：增减换挡的位置
    for (const [mx, my] of P.marks) B.dot(V(px(mx), py(my)), 3.5, { fill: '#93a1b5' });
    // 两点、连线（弦）、竖直参考
    const a = Math.min(st.x1, st.x2), b = Math.max(st.x1, st.x2);
    const fa = P.f(st.x1), fb = P.f(st.x2);
    if (P.d(st.x1)) B.seg(V(px(st.x1), py(fa)), V(px(st.x1), py(0)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .7 });
    if (P.d(st.x2)) B.seg(V(px(st.x2), py(fb)), V(px(st.x2), py(0)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .7 });
    if (P.d(st.x1) && P.d(st.x2)) B.seg(V(px(st.x1), py(fa)), V(px(st.x2), py(fb)), { stroke: '#ffd166', 'stroke-width': 2, 'stroke-dasharray': '6 4' });
    if (P.d(st.x1)) B.note(`$x_1=${fmt(st.x1, 2)}$`, '#ffd166');
    if (P.d(st.x2)) B.note(`$x_2=${fmt(st.x2, 2)}$`, '#ff9e4a');
    // 徽章
    const ok1 = P.d(st.x1), ok2 = P.d(st.x2);
    cA(ok1 ? `f(${fmt(st.x1, 2)}) = ${fmt(fa, 2)}` : 'x₁ 不在定义域内', ok1 ? '' : 'warn');
    cB(ok2 ? `f(${fmt(st.x2, 2)}) = ${fmt(fb, 2)}` : 'x₂ 不在定义域内', ok2 ? '' : 'warn');
    if (!ok1 || !ok2) { cS('—', 'warn'); cV('把两个把手都拖回定义域内', 'warn'); }
    else if (Math.abs(st.x2 - st.x1) < 1e-9) { cS('—', 'warn'); cV('两点重合 —— 定义要求先任取 x₁ < x₂', 'warn'); }
    else if (gapBetween(P, a, b)) { cS('—', 'warn'); cV('两点跨过定义域缺口！单调性只对「区间」说话，缺口两侧不许打包比较', 'warn'); }
    else {
      const slope = (fb - fa) / (st.x2 - st.x1);
      cS(fmt(slope, 3) + (slope > 0 ? '（弦向上）' : slope < 0 ? '（弦向下）' : '（弦水平）'), slope > 0 ? 'ok' : slope < 0 ? 'warn' : '');
      if (fa < fb) cV('x₁<x₂ 且 f(x₁)<f(x₂)：这对样本支持「增」—— 但抽查不是证明，定义的关键在「任取」', 'ok');
      else if (fa > fb) cV('x₁<x₂ 且 f(x₁)>f(x₂)：这对样本支持「减」—— 但抽查不是证明，定义的关键在「任取」', 'ok');
      else cV('f(x₁) = f(x₂)：等高 —— 对称回折或常数段，无法判定增减', 'warn');
    }
    cLv(P.lv, '');
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    st.x1 = p.d1; st.x2 = p.d2;   // 各预设的「初始状态」：① 对称回折等高、② 巧合等高、③ 缺口陷阱
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st);
  B.hint("拖动两个点。单调性要求区间内任意两点都满足同一关系。");
  B.render();
  return B;
}
