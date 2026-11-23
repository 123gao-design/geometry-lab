/* 图 E5 · 对数函数：y=log_a x —— 单栏全景（用户拍板：基本初等函数不画导函数图，斜率走徽章；2026-11-06 改画投影垂线）。
   对数的特征性质：斜率恒正（a>1）但随 x 增大而减小 —— 增长无上界、但增速递减（f′ 递减只在徽章里说）；
   与 E4 的增速递增互为反面。恒过 (1,0)，竖直渐近线 x=0，定义域 (0,+∞) 是首要限制。 */
import { V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);

  const st = { a: 2, x: 1, grid: true, labs: true, asym: true };
  const M = B.isoFit(0.2, 8, -2.6, 2.6);
  const f = x => Math.log(x) / Math.log(st.a), fp = x => 1 / (x * Math.log(st.a));

  const cA = B.chipM('底数'), cF = B.chipM('函数值'), cD = B.chipM('斜率 f′'), cV = B.chipM('判定');

  B.renderFn = () => {
    const a = st.a, x0 = st.x, y0 = f(x0), d0 = fp(x0);
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym) B.asym(M, [{ v: 0 }]);
    // 对数曲线：x>0 才有定义（左端截到 0.02），(1,0) 定点必采；贴近渐近线自然出框断笔
    B.plot(f, M, { x0: Math.max(M.X0, .02), step: .025, anchors: [1], stroke: '#5cadff', 'stroke-width': 2.2 });
    if (a !== 1) B.dot(V(M.px(1), M.py(0)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.note(`$y=\\log_{${a === Math.E ? 'e' : fmt(a, 2)}} x$`, '#93a1b5');
    // 探针：向 x 轴、y 轴各作一条投影垂线（虚线直读坐标）；a=1 时 f/f′ 无意义 —— 护栏拦住 NaN
    if (isFinite(y0) && isFinite(d0)) B.probe(V(x0, y0), M);
    // 徽章
    cA(`$a=${a === Math.E ? 'e' : fmt(a, 2)}$${a > 1 ? '：底大于 1 —— 上升' : a < 1 ? '：底小于 1 —— 下降' : '：a=1 无对数（底数要求 a>0 且 a≠1）'}`,
      a === 1 ? 'warn' : a > 1 ? 'ok' : 'warn');
    cF(isFinite(y0) ? `$f(${fmt(x0, 2)})=${fmt(y0, 3)}$` : 'a=1：对数无意义 —— 函数值不存在', isFinite(y0) ? '' : 'warn');
    cD(isFinite(d0) ? `$f'(${fmt(x0, 2)})=${fmt(d0, 3)}$` : '未定义', isFinite(d0) ? '' : 'warn');
    if (Math.abs(a - 1) < 1e-9) cV('a=1：以 1 为底的对数无意义 —— 不属对数函数（要求 a>0 且 a≠1）', 'warn');
    else if (a > 1) cV('上升但增速递减：探针右移，f′ 读数走低 —— 无上界而增速递减', 'ok');
    else cV('导数从负侧趋近 0，函数值趋于负无穷。', '');
  };

  const setA = v => { st.a = v; slA.sync(v); B.render(); };
  B.btnM('① $a=2$', () => setA(2), { pri: true, on: true });
  B.btnM('② $a=\\dfrac{1}{2}$', () => setA(0.5));
  B.btnM('③ $a=e$ 自然对数', () => setA(Math.E));
  B.btnM('④ $a=1$ 排除反例', () => setA(1));
  const slA = B.slider('底数 a', 0.3, 3, 0.05, 2, v => { st.a = v; B.render(); });
  B.slider('探针 x', 0.05, 7.8, 0.05, 1, v => { st.x = v; B.render(); });
  B.graphToggles(st);
  B.hint("拖动探针，比较两类底数下的切线斜率。");
  B.render();
  return B;
}
