/* 图 S4 · 界墙机：有界性 = 存在一堵墙拦得住整个图象；最值 = 图象还能「取到」墙
   拖墙高 M（金线）：徽章实时判定它是不是上界/下界、被哪个点穿透；「确界线」开关揭晓上确界/下确界
   —— ① 闭区间全取到（最大值=上确界）、② 开区间有界却取不到（界存在、最值不存在）、③ 无上界（渐近线冲上天）。
   图象规范：B.isoFit 等单位取景；网格 / 轴标注 / 渐近线 / 确界线 四开关；端点按开闭画实心/空心。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);

  // box 取景框；de 定义域数值边沿；dom 定义域文本；sup/inf 上/下确界文本（含「取到与否」）；supV/infV 数值（Infinity = 无上界）
  // wall 墙滑块范围；ends 端点 [x,y,闭?]；asy 渐近线；maxmin 最值说明文本
  const PRESETS = [
    { name: '① $x^2$ on $[-2,2]$', f: x => x * x, d: x => x >= -2 - 1e-9 && x <= 2 + 1e-9,
      box: [-2.8, 2.8, -1.2, 5.2], de: [-2, 2], dom: '[−2, 2]', supV: 4, infV: 0, wall: [-1.5, 5.5], wInit: 2.5, anc: [-2, 2, 0],
      sup: '$4$ —— 在 $x=\\pm 2$ 取到：上确界就是最大值', inf: '$0$ —— 在 $x=0$ 取到：下确界就是最小值',
      ends: [[-2, 4, 1], [2, 4, 1], [0, 0, 1]], asy: [],
      maxmin: '最大值 $4$（$x=\\pm 2$），最小值 $0$（$x=0$）—— 闭区间连续，两个都跑不掉', mmCls: 'ok' },
    { name: '② $x$ on $(0,1)$', f: x => x, d: x => x > 1e-9 && x < 1 - 1e-9,
      box: [-0.6, 1.6, -0.6, 1.6], de: [0, 1], dom: '(0, 1)', supV: 1, infV: 0, wall: [-0.5, 1.5], wInit: 0.5, anc: [0.004, 0.996],
      sup: '$1$ —— 够得着当上界，却永远取不到：无最大值', inf: '$0$ —— 同样取不到：无最小值',
      ends: [[0, 0, 0], [1, 1, 0]], asy: [],
      maxmin: '有界但无最大值、无最小值 —— 端点是开的，界取不到', mmCls: 'warn' },
    { name: '③ $\\dfrac{1}{x^2}$ on $(0,2]$', f: x => 1 / (x * x), d: x => x > 1e-6 && x <= 2 + 1e-9,
      box: [-0.7, 2.7, -0.8, 5], de: [0, 2], dom: '(0, 2]', supV: Infinity, infV: 0.25, wall: [-1, 5.4], wInit: 2, anc: [2, 0.004],
      sup: '不存在 —— $x\\to 0^+$ 时 $f\\to+\\infty$，多高的墙都拦不住', inf: '$\\dfrac{1}{4}$ —— 在 $x=2$ 取到（区间这端是闭的）',
      ends: [[2, 0.25, 1]], asy: [{ v: 0 }],
      maxmin: '无最大值；最小值 $\\dfrac{1}{4}$（$x=2$）—— 上界不存在，下界取到', mmCls: 'warn' },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, M: PRESETS[0].wInit, up: true, grid: true, labs: true, asym: true, sup: false };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cW = B.chip('墙判定'), cS = B.chipM('上确界'), cI = B.chipM('下确界'), cM = B.chipM('最值');

  /** 在定义域∩视野上找最顶/最底样本：均匀扫 + 定义域两端加密 + 渐近线旁几何加密（取不到的端点与渐近旁大值点都在视野边沿） */
  function extreme(P, up) {
    const M = MAPS[st.p];
    const lo = Math.max(M.X0, P.de[0]), hi = Math.min(Math.min(M.X1, 4), P.de[1]);
    let bx = null, bv = up ? -Infinity : Infinity;
    const feed = x => {
      if (!P.d(x)) return;
      const y = P.f(x);
      if (!isFinite(y)) return;
      if (up ? y > bv : y < bv) { bv = y; bx = x; }
    };
    for (let i = 0; i <= 300; i++) feed(lo + (hi - lo) * i / 300);
    for (let i = 0; i <= 200; i++) {
      const t = Math.pow(i / 200, 2);
      feed(lo + (hi - lo) * t); feed(hi - (hi - lo) * t);   // 两端加密：② 的 (0,1) 两端都「差一点取不到」
    }
    for (const a of P.asy) if (a.v != null)                 // 渐近线旁几何加密：③ 在 x→0⁺ 趋于无穷
      for (let i = 0; i <= 30; i++) { const e = Math.pow(10, -6 + i * 0.15); feed(a.v - e); feed(a.v + e); }
    return [bx, bv];
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym && P.asy.length) B.asym(M, P.asy);
    // 定义域绿带压 x 轴（沿用 C3 的记法）；端点 x 为必采锚点（绿带边沿与曲线起点对齐）
    const ax = [];
    for (let x = X0; x <= X1 + 0.001; x += 0.04) ax.push(x);
    for (const a of P.anc) if (a > X0 && a < X1) ax.push(a);
    ax.sort((p, q) => p - q);
    const segs = []; let run = null, prev = null;
    for (const x of ax) {
      const ok = x <= X1 && P.d(x);
      if (ok && run == null) run = x;
      else if (!ok && run != null) { segs.push([run, prev]); run = null; }
      prev = x;
    }
    if (run != null) segs.push([run, X1]);
    for (const [a, b] of segs) B.seg(V(px(a), py(0)), V(px(b), py(0)), { stroke: '#4ade80', 'stroke-width': 8, 'stroke-opacity': .8 });
    // 曲线 + 端点（开闭 → 空心/实心）：端点就是「最值能否取到」的现场证据
    let d = '', pen = false;
    for (const x of ax) {
      if (P.d(x)) {
        const y = P.f(x);
        if (y > Y0 && y < Y1) { d += (pen ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
      }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    for (const [ex, ey, closed] of P.ends) {
      if (closed) B.dot(V(px(ex), py(ey)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
      else B.dot(V(px(ex), py(ey)), 4.5, { fill: 'none', stroke: '#ff9e4a', 'stroke-width': 2.2 });
    }
    // 确界线（开关揭晓答案）：青虚线；取到的确界画金点，取不到的画空点
    if (st.sup) {
      const mkLine = (v, lab, att) => {
        if (!isFinite(v) || v <= Y0 || v >= Y1) return;
        B.seg(V(px(X0), py(v)), V(px(X1), py(v)), { stroke: '#67e8f9', 'stroke-width': 1.6, 'stroke-dasharray': '7 6', 'stroke-opacity': .85 });
        B.note(lab, '#67e8f9');
      };
      if (isFinite(P.supV)) mkLine(P.supV, `上确界 ${fmt(P.supV, 2)}（${P.sup.includes('取到') ? '取到' : '取不到'}）`, 1);
      else B.note('无上界 —— 渐近线方向图象冲出画框', '#67e8f9');
      mkLine(P.infV, `下确界 ${fmt(P.infV, 2)}`, 0);
      B.note(`定义域 ${P.dom}`, '#4ade80');
    }
    // 墙：金色横线 + 标签；判定它拦不拦得住
    const [bx, bv] = extreme(P, st.up);
    if (st.M > Y0 && st.M < Y1) {
      B.seg(V(px(X0), py(st.M)), V(px(X1), py(st.M)), { stroke: '#ffd166', 'stroke-width': 2.4 });
      B.note(`墙 $M=${fmt(st.M, 2)}$（${st.up ? '上界墙：问 $f(x)\\le M$ 成立吗' : '下界墙：问 $f(x)\\ge M$ 成立吗'}）`, '#ffd166');
    }
    if (bx != null) {
      const bound = st.up ? bv <= st.M + 1e-9 : bv >= st.M - 1e-9;
      const blow = st.up && bv > 1e5;
      if (!bound && bv > Y0 && bv < Y1) {   // 被穿透：红点标在穿透处（出框的穿透画在框边）
        const yy = Math.min(Math.max(bv, Y0 + 0.05), Y1 - 0.05);
        B.dot(V(px(bx), py(yy)), 5, { fill: '#ff7b8a', stroke: '#0a0d14', 'stroke-width': 1.4 });
        B.seg(V(px(bx), py(st.M)), V(px(bx), py(yy)), { stroke: '#ff7b8a', 'stroke-width': 1.6, 'stroke-dasharray': '4 4' });
      }
      cW(bound
        ? `M=${fmt(st.M, 2)} 是${st.up ? '上' : '下'}界：D 内所有 x 都有 f(x) ${st.up ? '≤' : '≥'} M`
        : blow
          ? `M=${fmt(st.M, 2)} 不是上界：x→${fmt(Math.abs(bx), 4)}⁺ 处 f 冲破天际，图象根本不达到最大`
          : `M=${fmt(st.M, 2)} 不是${st.up ? '上' : '下'}界：x≈${fmt(bx, 2)} 处 f=${fmt(bv, 2)} 把墙${st.up ? '顶穿' : '踩穿'}`,
        bound ? 'ok' : 'warn');
    } else cW('拖「墙高 M」试试', '');
    cS(P.sup, isFinite(P.supV) ? '' : 'warn');
    cI(P.inf, 'ok');
    cM(P.maxmin, P.mmCls);
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i; st.M = p.wInit;
    sl.setAttribute('min', p.wall[0]); sl.setAttribute('max', p.wall[1]); sl.sync(p.wInit);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  let modeBtn = null;
  modeBtn = B.btn('⇄ 换查下界', () => {
    st.up = !st.up;
    modeBtn.textContent = st.up ? '⇄ 换查下界' : '⇄ 换查上界';
    B.render();
  });
  const sl = B.slider('墙高 M', PRESETS[0].wall[0], PRESETS[0].wall[1], 0.05, PRESETS[0].wInit, v => { st.M = v; B.render(); }, 'M');
  B.graphToggles(st);
  B.toggleBtn('确界线', false, on => { st.sup = on; B.render(); });
  B.hint("改变水平界线，检查它是否限制住所有函数值。");
  B.render();
  return B;
}
