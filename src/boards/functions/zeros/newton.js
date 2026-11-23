/* 图 R4 · 切线下山机：牛顿法 x_{n+1}=x_n − f(x_n)/f'(x_n)（取切线与 x 轴的交点为下一个迭代点）
   与弦截法（两点连线代替切线，免导数）双轨对照 —— 导数在这里第二次入场当主力（第一次在 S2）。
   ① x²−2 从 x₀=2 三步贴近 √2（二分同精度要十几步）；② 无理根 1.53… 贴上去；
   ③ x³−2x+2 从 x₀=0 循环（0→1→0→1）—— 初值选取不当，牛顿法不收敛，弦截法同样失效。
   金线 = 牛顿切线台阶，橙线 = 弦截连线台阶；护栏：先用 R3 二分缩小区间，再用牛顿法加速。
   图象规范：B.isoFit 等单位取景；公式一律 B.tex/btnM/chipM；网格 / 轴标注 两开关；零点为必采锚点。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);

  // fp 解析导数；nt0 牛顿起点；sc 弦截起点对；zero 真零点；w0 对比用二分初始区间宽
  const PRESETS = [
    { name: '① $x^2-2$ 逼近 $\\sqrt{2}$',
      eq: "$f(x)=x^2-2$，$f'(x)=2x$ —— 从 $x_0=2$ 出发做牛顿迭代",
      f: x => x * x - 2, fp: x => 2 * x, nt0: 2, sc: [1, 2], zero: Math.SQRT2, w0: 1,
      box: [-0.3, 2.6, -1.5, 2.6] },
    { name: '② $x^3-3x+1$ 贴无理根',
      eq: "$f(x)=x^3-3x+1$，$f'=3x^2-3$ —— 从 $x_0=1.6$ 贴向 1.53…",
      f: x => x * x * x - 3 * x + 1, fp: x => 3 * x * x - 3, nt0: 1.6, sc: [1.3, 1.6], zero: 1.53208889, w0: 0.5,
      box: [0.2, 2.2, -1.2, 1.8] },
    { name: '③ 循环反例 $x^3-2x+2$',
      eq: "$f(x)=x^3-2x+2$，$f'=3x^2-2$ —— 从 $x_0=0$ 出发：看它循环往复",
      f: x => x * x * x - 2 * x + 2, fp: x => 3 * x * x - 2, nt0: 0, sc: [1, 2], zero: -1.76929235, w0: 0.5,
      box: [-2.4, 2.4, -3, 5.2] },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, nt: [2], sc: [1, 2], badN: null, badS: null, grid: true, labs: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cX = B.chipM('当前点'), cF = B.chipM('函数值'), cN = B.chipM('牛顿法'), cS = B.chipM('弦截法'), cV = B.chipM('判定');

  function reset() { const P = PRESETS[st.p]; st.nt = [P.nt0]; st.sc = [...P.sc]; st.badN = null; st.badS = null; }

  /** 牛顿一步：切线截距；驻点 / 出界 / 循环三类防护 */
  function ntStep() {
    const P = PRESETS[st.p];
    if (st.badN && st.nt.length >= 40) return;
    const xn = st.nt[st.nt.length - 1], fx = P.f(xn), dv = P.fp(xn);
    if (Math.abs(dv) < 1e-9) { st.badN = 'f′≈0：切线近水平，牛顿步无法进行（驻点陷阱）'; return; }
    const x1 = xn - fx / dv;
    if (!isFinite(x1) || Math.abs(x1) > 60) { st.badN = '下一步越出区间 —— 牛顿法不保证点列留在区间内'; st.nt.push(x1); return; }
    if (st.nt.slice(0, -1).some(u => Math.abs(u - x1) < 1e-9)) st.badN = '出现循环：新点回到旧位置 —— 初值选取不当，牛顿法不收敛';
    st.nt.push(x1);
  }
  /** 弦截一步：两点连线的截距 */
  function scStep() {
    const P = PRESETS[st.p];
    if (st.badS && st.sc.length >= 40) return;
    const x0 = st.sc[st.sc.length - 2], x1 = st.sc[st.sc.length - 1];
    const f0 = P.f(x0), f1 = P.f(x1);
    if (Math.abs(f1 - f0) < 1e-12) { st.badS = '两点等高，弦近水平 —— 弦截步无法进行'; return; }
    const x2 = x1 - f1 * (x1 - x0) / (f1 - f0);
    if (!isFinite(x2) || Math.abs(x2) > 60) { st.badS = '下一步越出区间 —— 弦截法也不保证点列留在区间内'; st.sc.push(x2); return; }
    if (st.sc.slice(0, -1).some(u => Math.abs(u - x2) < 1e-9)) st.badS = '出现循环：弦截也在原地往复';
    st.sc.push(x2);
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.note(P.eq, '#93a1b5');
    // 曲线（蓝）+ 真零点（灰）
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.04) xs.push(x);
    if (P.zero > M.X0 && P.zero < M.X1) xs.push(P.zero);
    xs.sort((p, q) => p - q);
    let d = '', pen = false;
    for (const x of xs) {
      const y = P.f(x);
      if (y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    if (P.zero > M.X0 && P.zero < M.X1) B.dot(V(px(P.zero), py(0)), 4, { fill: '#93a1b5' });
    // 牛顿台阶（金）：切线以直代曲
    for (let i = 1; i < st.nt.length; i++) {
      const a = st.nt[i - 1], b = st.nt[i];
      if (b < M.X0 - 0.2 || b > M.X1 + 0.2) continue;
      const cur = i === st.nt.length - 1;
      const ya = P.f(a);
      const p0 = V(px(a), py(ya)), p1 = V(px(b), py(0));
      if ((p0.x > -3000 && p0.x < 5000) && (p1.x > -3000 && p1.x < 5000)) {
        B.seg(p0, p1, cur ? { stroke: '#ffd166', 'stroke-width': 2.8 }
                         : { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-opacity': .45 });
        B.dot(p1, cur ? 3.6 : 2.2, { fill: '#ffd166' });
      }
      if (cur) {
        if (p0.x > -3000 && p0.x < 5000) {
          B.dot(p0, 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
        }
        const nb = P.f(b);   // 交点再竖线弹回曲线，凑成「作切线→落轴→回曲线」完整一步
        if (nb > Y0 && nb < Y1) B.seg(V(px(b), py(0)), V(px(b), py(nb)), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '4 4' });
      }
    }
    // 弦截台阶（橙）：两点连线落轴；历史淡色，当前步常规亮色
    for (let i = 2; i < st.sc.length; i++) {
      const a = st.sc[i - 2], b = st.sc[i];
      const cur = i === st.sc.length - 1;
      const pt0 = V(px(a), py(P.f(a))), pt1 = V(px(b), py(0));
      if ((pt0.x > -3000 && pt0.x < 5000) && (pt1.x > -3000 && pt1.x < 5000))
        B.seg(pt0, pt1, cur ? { stroke: '#ff9e4a', 'stroke-width': 2, 'stroke-dasharray': '7 4' }
                            : { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-dasharray': '7 4', 'stroke-opacity': .4 });
    }
    for (const [arr, cc] of [[st.nt, '#ffd166'], [st.sc, '#ff9e4a']])
      for (let i = 0; i < arr.length; i++) {
        const x = arr[i], y = P.f(x);
        if (y > Y0 && y < Y1 && px(x) > -3000 && px(x) < 5000) {
          B.dot(V(px(x), py(y)), 4.5, { fill: cc, stroke: '#0a0d14', 'stroke-width': 1.3 });
          if (i === arr.length - 1) B.text(V(px(x) + 12, py(y) - 10), 'x_' + i, { fill: cc, 'text-anchor': 'start' });
        }
      }
    // 当前牛顿点：竖直参考
    const xn = st.nt[st.nt.length - 1], fx = P.f(xn);
    B.note('牛顿法 · 金色切线', '#ffd166');
    B.note('弦截法 · 橙色虚线', '#ff9e4a');
    if (px(xn) > -3000 && px(xn) < 5000)
      B.seg(V(px(xn), py(Y0)), V(px(xn), py(Y1)), { stroke: '#3f5f8f', 'stroke-dasharray': '4 6', 'stroke-opacity': .5 });
    // 徽章
    const convN = isFinite(fx) && Math.abs(fx) < 1e-6;
    const xs_ = st.sc[st.sc.length - 1], fs_ = P.f(xs_);
    const convS = isFinite(fs_) && Math.abs(fs_) < 1e-6;
    cX(`$x_{${st.nt.length - 1}}=${fmt(xn, 5)}$`, '');
    cF(`$f(x)=${fmt(fx, 6)}$${convN ? ' —— 已收敛' : ''}`, convN ? 'ok' : '');
    const err = Math.abs(xn - P.zero);
    const need = Math.max(1, Math.ceil(Math.log2(P.w0 / Math.max(err, 1e-9))));
    if (st.badN) cN(`牛顿 ${st.nt.length - 1} 步：${st.badN}`, 'warn');
    else cN(`牛顿 ${st.nt.length - 1} 步：误差 $\\approx${fmt(err, 6)}$ —— 二分同误差要 ~${need} 步`, convN ? 'ok' : '');
    if (st.badS) cS(`弦截 ${st.sc.length - 2} 步：${st.badS}`, 'warn');
    else if (st.sc.length <= 2) cS('弦截法：两点连线代替切线，免导数 —— 按「弦截一步」看橙线', '');
    else {
      const es = Math.abs(xs_ - P.zero);
      const needS = Math.max(1, Math.ceil(Math.log2(P.w0 / Math.max(es, 1e-9))));
      cS(`弦截 ${st.sc.length - 2} 步：误差 $\\approx${fmt(es, 6)}$ —— 二分同误差要 ~${needS} 步`, convS ? 'ok' : '');
    }
    if (st.badN && st.badS) cV('两条路径都未收敛 —— 实用做法：先用二分缩小区间（R3），再换初值用牛顿/弦截', 'warn');
    else if (st.badN) cV(`${st.badN} —— 护栏：先用二分缩小区间，或换初值`, 'warn');
    else if (st.badS) cV(`${st.badS} —— 弦截虽免导数，同样不保区间`, 'warn');
    else if (convN && convS) cV('两条路都收敛：牛顿最快（切线以直代曲），弦截免用导数 —— 二分最稳，各有适用场景', 'ok');
    else if (convN) cV('牛顿收敛：误差平方级缩水（下一步误差 ≈ 上一步的平方 × 系数）—— V 系列的导数思想在此首次应用', 'ok');
    else cV('按「切线一步」看金线（切线与 x 轴的交点）逐步逼近零点；同框走「弦截一步」对比橙线', '');
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i; reset();
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.btnM('切线一步', () => { ntStep(); B.render(); }, { pri: true });
  B.btnM('弦截一步', () => { scStep(); B.render(); });
  B.btnM('⟲ 重来', () => { reset(); B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint("点「切线一步」或「弦截一步」，观察下一次近似如何得到。");
  B.render();
  return B;
}
