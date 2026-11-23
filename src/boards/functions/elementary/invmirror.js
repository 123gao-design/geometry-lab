/* 图 E6 · 指对反演镜：y=a^x 与 y=log_a x —— 同底互为反函数，图象关于 y=x 对折重合。
   把手 P 锁在指数曲线上，镜像点 P′=(a^t, t) 落在对数曲线上：横纵坐标整体对调（金虚线 = 折缝 y=x）。
   反演回代：log_a(a^t)=t —— 指数是正运算、对数是逆运算（C1 机器观的回收）。
   两曲线单调同号（同增同减）、定义域值域互换：exp 的值域 (0,+∞) 恰是 log 的定义域。
   镜面是 y=x：必须等单位取景（isoFit），否则 45° 的折缝不能保证。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);

  const PRESETS = [
    { a: 2, name: '① $a=2$：$2^x$ vs $\\log_2 x$' },
    { a: 0.5, name: '② $a=\\dfrac{1}{2}$：同减也互反' },
    { a: Math.SQRT2, name: '③ $a=\\sqrt{2}$：与折缝有交点' },
  ];
  const st = { p: 0, t: 1, grid: true, labs: true, asym: true };
  const M = B.isoFit(-2.2, 5.2, -2.2, 5.2);
  const px = x => M.px(x), py = y => M.py(y);
  const cB = B.chipM('底数'), cP = B.chipM('P（指数上）'), cQ = B.chipM('P′（对数上）'), cV = B.chipM('反演判定');

  const A = () => PRESETS[st.p].a;
  const f = x => Math.pow(A(), x);          // 指数
  const g = x => Math.log(x) / Math.log(A()); // 对数

  // 把手 P：锁在指数曲线上
  B.handle({
    get: () => V(px(st.t), py(f(st.t))),
    set: p => {
      let t = M.X0 + (p.x / W) * (M.X1 - M.X0);
      t = Math.max(-1.9, Math.min(3.6, t));
      let guard = 0;
      while ((f(t) > M.Y1 || f(t) < M.Y0) && guard++ < 80) t = t > 0 ? t * 0.97 : t * 1.03;
      st.t = t;
    },
    color: '#ffd166', r: 6.5, label: 'P', lo: [9, -9],
  });

  B.renderFn = () => {
    const a = A();
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym) B.asym(M, [{ v: 0, t: 'x=0（log 渐近线）' }]);
    // 折缝 y=x（金虚线）：反演镜面
    B.seg(V(px(M.X0), py(M.X0)), V(px(M.X1), py(M.X1)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '7 6', 'stroke-opacity': .6 });
    B.note('$y=x$', '#ffd166');
    // 指数（蓝）
    let d = '', pen = false;
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.025) {
      const y = f(x);
      if (y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    // 对数（橙）：x>0
    let d2 = '', pen2 = false;
    const xs0 = [];
    for (let x = Math.max(M.X0, 0.02); x <= M.X1 + 0.001; x += 0.02) xs0.push(x);
    xs0.push(1);
    xs0.sort((m, n) => m - n);
    for (const x of xs0) {
      const y = g(x);
      if (isFinite(y) && y > M.Y0 && y < M.Y1) { d2 += (pen2 ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen2 = true; continue; }
      pen2 = false;
    }
    mk('path', { d: d2, fill: 'none', stroke: '#ff9e4a', 'stroke-width': 2.2 }, B.dyn);
    // 定点 + 互反点：exp 过 (0,1)、log 过 (1,0) —— 恰好互为镜像
    B.dot(V(px(0), py(1)), 4.5, { fill: '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.dot(V(px(1), py(0)), 4.5, { fill: '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1.2 });
    // P 与镜像 P′：连线垂直于折缝、被折缝平分
    const t = st.t, ft = f(t);
    const mx = ft, my = t;   // P′=(a^t, t)
    B.seg(V(px(t), py(ft)), V(px(mx), py(my)), { stroke: '#ff7b8a', 'stroke-dasharray': '4 4', 'stroke-opacity': .85 });
    if (mx > M.X0 && mx < M.X1 && my > M.Y0 && my < M.Y1)
      B.dot(V(px(mx), py(my)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    const ab = a === 0.5 ? '\\dfrac{1}{2}' : a === Math.SQRT2 ? '\\sqrt{2}' : String(a);
    B.note(`$y=${ab}^{x}$（蓝）与 $y=\\log_{${ab}} x$（橙）`, '#93a1b5');
    // 徽章
    const back = g(ft);
    cB(`$a=${ab}$ —— 同底成对，单调同号（${a > 1 ? '同增' : '同减'}）`, a > 1 ? 'ok' : '');
    cP(`P=$(${fmt(t, 2)},\\ ${fmt(ft, 2)})$：输入 $x=${fmt(t, 2)}$ 输出 $y=${fmt(ft, 2)}$`, '');
    cQ(`P′=$(${fmt(ft, 2)},\\ ${fmt(t, 2)})$：坐标对调 —— 输入输出易位`, '');
    cV(`回代验收：$\\log_a(a^{${fmt(t, 2)}})=${fmt(back, 3)}\\approx ${fmt(t, 2)}$ —— 逆运算后再正运算，完全重合`,
      Math.abs(back - t) < 1e-6 ? 'ok' : 'warn');
  };

  const btns = PRESETS.map((P, i) => B.btnM(P.name, () => {
    st.p = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st);
  B.hint("拖动指数曲线上的点，对照镜像点的两项坐标。");
  B.render();
  return B;
}
