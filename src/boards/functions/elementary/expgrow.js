/* 图 E4 · 指数函数：y=a^x —— 单栏全景（用户拍板：基本初等函数不画导函数图，斜率走徽章；2026-11-06 改画投影垂线）。
   指数的特征性质：斜率与函数值成正比（f′/f=ln a 恒定）—— 探针在两轴上的竖直/水平投影直读坐标，f′ 读数与函数值同步。
   增速方向由底数定：a>1 递增且增速递增，0<a<1 递减且 |f′| 趋于 0，a=1 是常数 y=1 —— 指数函数排除（底数要求 a>0 且 a≠1）。
   指数 y 方向与 x 量纲不同（x 走 7 个单位 y 要走 10 个）：按 C4 邮资/个税先例各用比例尺（mapFit）。
   恒过 (0,1)，渐近线 y=0。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);

  const st = { a: 2, x: 0, grid: true, labs: true, asym: true };
  /** 各向比例尺取景（量纲不同的先例 C4）：rect 内完整看到 [xa,xb]×[ya,yb]，x/y 各用各的单位长 */
  const M = B.mapFit(-2.6, 3.9, -1.2, 9.6, [0, 0, W, H]);
  const f = x => Math.pow(st.a, x), fp = x => Math.log(st.a) * Math.pow(st.a, x);

  const cA = B.chipM('底数'), cF = B.chipM('函数值'), cD = B.chipM('斜率 f′'), cV = B.chipM('判定');

  B.renderFn = () => {
    const a = st.a, x0 = st.x, y0 = f(x0), d0 = fp(x0);
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym) B.asym(M, [{ h: 0 }]);
    let d = '', pen = false;
    for (let x = M.X0 - 0.2; x <= M.X1 + 0.2; x += 0.03) {
      const y = f(x);
      if (y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + M.px(x).toFixed(1) + ' ' + M.py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    B.dot(V(M.px(0), M.py(1)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });   // 恒过 (0,1)
    B.note(`$y=${a === 0.5 ? '\\dfrac{1}{2}' : a}^{x}$（$a=${fmt(a, 2)}$）`, '#93a1b5');
    // 探针：向 x 轴、y 轴各作一条投影垂线（虚线直读坐标）—— 不画斜切线（2026-11-06 用户指定）
    B.probe(V(x0, y0), M);
    // 徽章
    cA(`$a=${fmt(a, 2)}$ · ${a > 1 ? '递增' : a < 1 ? '递减' : '常值情形'}`, a === 1 ? 'warn' : '');
    cF(`$f(${fmt(x0, 2)})=${fmt(y0, 3)}$`, '');
    cD(`$f'(${fmt(x0, 2)})=${fmt(d0, 3)}$ —— $f'/f=\\ln a=${fmt(Math.log(a), 3)}$：斜率与函数值成正比`, '');
    if (a === 1) cV('a=1：退化为常数 y=1 —— 不属指数函数（要求 a>0 且 a≠1）', 'warn');
    else if (a > 1) cV('导数为正，随 x 增大而增大。', 'ok');
    else cV('导数为负，随 x 增大而趋于 0。函数值也趋于 0。');
  };

  const setA = v => { st.a = v; slA.sync(v); B.render(); };
  B.btnM('① $a=2$ 翻倍', () => setA(2), { pri: true, on: true });
  B.btnM('② $a=\\dfrac{1}{2}$ 减半', () => setA(0.5));
  B.btnM('③ $a=3$ 更陡', () => setA(3));
  B.btnM('④ $a=1$ 排除反例', () => setA(1));
  const slA = B.slider('底数 a', 0.3, 3, 0.05, 2, v => { st.a = v; B.render(); });
  B.slider('探针 x', -2.3, 3.8, 0.05, 0, v => { st.x = v; B.render(); });
  B.graphToggles(st);
  B.hint("比较底数小于 1 和大于 1 时的导数符号。");
  B.render();
  return B;
}
