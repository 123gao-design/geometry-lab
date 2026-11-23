/* 图 S3 · 奇偶折叠机：把 x>0 的半张图「折」过去 —— 偶函数沿 y 轴翻折、奇函数绕原点旋转 180°
   折叠滑块 t 从 0 到 1：右半曲线连续翻转（金），折毕与左半（蓝）完全重合 ⇔ f(−x)=f(x)（偶）或 f(−x)=−f(x)（奇）。
   五个预设：① x²（偶）② x³（奇）③ 1/x（奇·带渐近线）④ √x（定义域不对称，前提不满足）⑤ x²+x（对称却非奇非偶）。
   图象规范：B.isoFit 等单位取景；网格 / 轴标注 / 渐近线 三开关可隐藏；特殊点灰点标注。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);

  // box 取景框；mode 'ref' 沿 y 轴翻折（偶）/ 'rot' 绕原点旋转（奇）；marks 特殊点；asy 渐近线；ver 判定文案
  const PRESETS = [
    { name: '① $f(x)=x^2$', f: x => x * x, d: () => true, box: [-3.2, 3.2, -0.8, 9.2], mode: 'ref',
      marks: [[0, 0]], asy: [], ver: '偶函数：$f(-x)=f(x)$，图象关于 y 轴对称（y 轴是对称轴）', cls: 'ok' },
    { name: '② $f(x)=x^3$', f: x => x * x * x, d: () => true, box: [-1.8, 1.8, -4.4, 4.4], mode: 'rot',
      marks: [[0, 0]], asy: [], ver: '奇函数：$f(-x)=-f(x)$，图象关于原点中心对称', cls: 'ok' },
    { name: '③ $f(x)=\\dfrac{1}{x}$', f: x => 1 / x, d: x => Math.abs(x) > 1e-6, box: [-3.2, 3.2, -3.4, 3.4], mode: 'rot',
      marks: [], asy: [{ v: 0 }, { h: 0 }], ver: '奇函数：两支各自折过去都完全重合；渐近线 $x=0$、$y=0$ 也关于原点对称', cls: 'ok' },
    { name: '④ $f(x)=\\sqrt{x}$', f: x => Math.sqrt(x), d: x => x >= -1e-9, box: [-1.6, 4.2, -1, 2.4], mode: 'ref',
      marks: [[0, 0]], asy: [], ver: '定义域 $[0,+\\infty)$ 不关于原点对称 —— $f(-1)$ 根本不存在，奇偶性前提就不满足', cls: 'warn' },
    { name: '⑤ $f(x)=x^2+x$', f: x => x * x + x, d: () => true, box: [-2.8, 2.8, -0.8, 6.4], mode: 'ref',
      marks: [[-0.5, -0.25]], asy: [], ver: '定义域对称，但 $f(-x)=x^2-x$ 既不等于 $f(x)$ 也不等于 $-f(x)$：非奇非偶', cls: 'warn' },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, t: 0, x0: 1.2, grid: true, labs: true, asym: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cF = B.chip('f(x₀)'), cM = B.chip('f(−x₀)'), cV = B.chipM('折叠判定');
  /** 采样网格 + 锚点：u=0 精确起步（④ 的 (0,0) 不许被步长跳过）、特殊点 |x| 落网（⑤ 的顶点 (−0.5,−0.25)） */
  const samples = P => {
    const lim = Math.min(MAPS[st.p].X1, 4.5), xs = [];
    for (let u = 0; u <= lim + 0.001; u += 0.04) xs.push(u);
    for (const [mx] of P.marks) { const a = Math.abs(mx); if (a > 0 && a <= lim) xs.push(a); }
    return xs.sort((p, q) => p - q);
  };

  /** 把手：锁在右半曲线上（x₀>0），折叠时跟着一起翻；不许拖出画框、不许掉进渐近线 */
  B.handle({
    get: () => V(px(st.x0), py(PRESETS[st.p].f(st.x0))),
    set: p => {
      const P = PRESETS[st.p], M = MAPS[st.p];
      let x = M.X0 + (p.x / W) * (M.X1 - M.X0);
      x = Math.max(0.15, Math.min(Math.min(M.X1, 4), x));
      const ok = () => P.d(x) && P.f(x) > M.Y0 && P.f(x) < M.Y1;
      let g = 0;
      while (!ok() && g++ < 60 && x > 0.05) x *= 0.97;   // 出框就往回收，贴边为止
      st.x0 = ok() ? x : 1.2;
    },
    color: '#ffd166', r: 6.5, label: 'x₀', lo: [9, -9],
  });

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym && P.asy.length) B.asym(M, P.asy);
    // 左半曲线（蓝）：x<0 的真实图象 —— 折叠的「对照组」
    // 右半曲线（蓝）：x>0 的真实图象 —— 被折的「原稿」
    const xs = samples(P);
    for (const sgn of [-1, 1]) {
      let d = '', pen = false;
      for (const u of xs) {
        const x = sgn * u;
        if (P.d(x)) {
          const y = P.f(x);
          if (y > Y0 && y < Y1) { d += (pen ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
        }
        pen = false;
      }
      mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2, 'stroke-opacity': .85 }, B.dyn);
    }
    // 折叠曲线（金）：k=1−2t，ref 只把 x 压过去（贴着 y 轴翻折）；rot 连 y 一起翻（绕原点转）
    const k = 1 - 2 * st.t;
    let d = '', pen = false;
    for (const u of xs) {
      if (P.d(u)) {
        const y = P.f(u);
        const fy = P.mode === 'ref' ? y : k * y;
        if (fy > Y0 && fy < Y1) { d += (pen ? 'L' : 'M') + px(k * u).toFixed(1) + ' ' + py(fy).toFixed(1) + ' '; pen = true; continue; }
      }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 }, B.dyn);
    // 折痕标记：偶 = y 轴加金虚线（折缝），奇 = 原点金圈（转轴）
    if (P.mode === 'ref') B.seg(V(px(0), py(Y0)), V(px(0), py(Y1)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '5 6', 'stroke-opacity': .5 });
    else B.dot(V(px(0), py(0)), 5, { fill: 'none', stroke: '#ffd166', 'stroke-width': 2 });
    // 特殊点（顶点/零点/最低点）：折叠的锚点
    for (const [mx, my] of P.marks) B.dot(V(px(mx), py(my)), 3.5, { fill: '#93a1b5' });
    // 把手 x₀ 及其折叠像：连线显示「这一个点折到哪」
    const y0 = P.f(st.x0);
    const imX = k * st.x0, imY = P.mode === 'ref' ? y0 : k * y0;
    B.seg(V(px(st.x0), py(y0)), V(px(imX), py(imY)), { stroke: '#ff9e4a', 'stroke-dasharray': '4 4', 'stroke-opacity': .8 });
    B.dot(V(px(imX), py(imY)), 5, { fill: '#ff9e4a' });
    if (st.t > 0.01) B.note(`像 (${fmt(imX, 2)}, ${fmt(imY, 2)})`, '#ff9e4a');
    // 徽章
    const ok0 = P.d(st.x0), okm = P.d(-st.x0);
    cF(ok0 ? `f(${fmt(st.x0, 2)}) = ${fmt(y0, 2)}` : 'x₀ 不在定义域内', ok0 ? '' : 'warn');
    cM(okm ? `f(−${fmt(st.x0, 2)}) = ${fmt(P.f(-st.x0), 2)}` : `f(−${fmt(st.x0, 2)}) 不存在 —— 左半是空的`, okm ? '' : 'warn');
    // 折叠判定：t=1 时逐点验收（折叠终点 vs 左半真值），t<1 提示先折完再判定
    if (st.t < 0.99) cV(`t=${fmt(st.t, 2)}：拖到 1 看折毕对比 —— ${P.mode === 'ref' ? '沿 y 轴翻折（验偶）' : '绕原点旋转（验奇）'}`, '');
    else if (!okm) cV(P.ver + ' —— 金半张折过去，对面空无一物', 'warn');
    else {
      let err = 0, miss = false;
      for (let u = 0.06; u <= Math.min(X1, 4); u += 0.05) {
        if (!P.d(u) || !P.d(-u)) { miss = true; continue; }
        const fy = P.mode === 'ref' ? P.f(u) : -P.f(u);
        err = Math.max(err, Math.abs(fy - P.f(-u)));
      }
      if (miss) cV(P.ver + '；折叠验收：部分点落空 —— 两侧定义域没对齐', P.cls);
      else if (err < 0.02) cV(P.ver + `；折叠验收：完全重合（最大偏差 ${fmt(err, 3)}）`, 'ok');
      else cV(`折毕对不上（最大偏差 ${fmt(err, 2)}）—— ${P.ver}`, 'warn');
    }
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i; st.t = 0; sl.sync(0);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const sl = B.slider('折叠 t', 0, 1, 0.01, 0, v => { st.t = v; B.render(); });
  B.graphToggles(st);
  B.hint("将变换进度拖到末端，检查两部分是否重合。");
  B.render();
  return B;
}
