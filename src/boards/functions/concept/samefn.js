/* 图 C2 · 同一函数判定机：定义域与对应法则双核对（同一函数 ⇔ 定义域同 + 化简后法则同）
   图象规范：B.isoFit 等单位取景（x/y 同比例、吃满画框）+ B.grid 淡实线网格；曲线粗细与轴线同量级（≈2.2）；
   网格 / 轴标注（字母+刻度）/ 渐近线 三开关可隐藏。 */
import { Board, V } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 440;
  const B = new Board(root, W, H);
  const M = B.isoFit(-3.4, 3.4, -2.6, 4.8);   // 等单位：五组曲线都活动在这个窗口附近
  const { px, py, X0, X1, Y0, Y1 } = M;
  const st = { p: 0, x: 1, grid: true, labs: true, asym: true };

  // f/g：lab 解析式（$…$ 交 KaTeX）、dt 定义域文本、y 表达式、d 定义域判定；holes 为「挖去的开点」[x,y]；asy 渐近线；anc 采样锚点
  const PAIRS = [
    { name: '① $x^2$ 与 $t^2$', same: 1, why: '法则相同 —— 记变量的字母无关', anc: [0],
      f: { lab: '$f(x)=x^2$', dt: '定义域 R', y: x => x * x, d: () => true },
      g: { lab: '$g(t)=t^2$', dt: '定义域 R', y: x => x * x, d: () => true } },
    { name: '② $\\dfrac{x^2}{x}$ 与 $x$', same: 0, why: '定义域不同：x≠0 与 x∈R', anc: [4e-4, -4e-4],
      f: { lab: '$f(x)=\\dfrac{x^2}{x}$', dt: '定义域 x≠0', y: x => x, d: x => Math.abs(x) > 1e-9, holes: [[0, 0]] },
      g: { lab: '$g(x)=x$', dt: '定义域 R', y: x => x, d: () => true } },
    { name: '③ $\\sqrt{x^2}$ 与 $|x|$', same: 1, why: '化简后同为 |x|，定义域同为 R', anc: [0],
      f: { lab: '$f(x)=\\sqrt{x^2}$', dt: '定义域 R', y: x => Math.abs(x), d: () => true },
      g: { lab: '$g(x)=|x|$', dt: '定义域 R', y: x => Math.abs(x), d: () => true } },
    { name: '④ $(\\sqrt{x})^2$ 与 $x$', same: 0, why: '定义域不同：x≥0 与 x∈R', anc: [0],
      f: { lab: '$f(x)=(\\sqrt{x})^2$', dt: '定义域 x≥0', y: x => x, d: x => x >= -1e-9 },
      g: { lab: '$g(x)=x$', dt: '定义域 R', y: x => x, d: () => true } },
    { name: '⑤ $\\lg x^2$ 与 $2\\lg x$', same: 0, why: '定义域不同：x≠0 与 x>0', anc: [],
      f: { lab: '$f(x)=\\lg x^2$', dt: '定义域 x≠0', y: x => 2 * Math.log10(Math.abs(x)), d: x => Math.abs(x) > 1e-9 },
      g: { lab: '$g(x)=2\\lg x$', dt: '定义域 x>0', y: x => 2 * Math.log10(x), d: x => x > 1e-9 },
      asy: [{ v: 0 }] },
    { name: '⑥ $(x+1)^2$ 与 $t^2+2t+1$', same: 1, why: '化简后同为 (x+1)²', anc: [-1],
      f: { lab: '$f(x)=(x+1)^2$', dt: '定义域 R', y: x => (x + 1) ** 2, d: () => true },
      g: { lab: '$g(t)=t^2+2t+1$', dt: '定义域 R', y: x => (x + 1) ** 2, d: () => true } },
  ];
  const cF = B.chip('f(x)'), cG = B.chip('g(x)'), cV = B.chip('判定');

  B.renderFn = () => {
    const { f, g } = PAIRS[st.p];
    B.grid({ px, py, X0, X1, Y0, Y1, grid: st.grid, labs: st.labs });
    if (st.asym && PAIRS[st.p].asy) B.asym(M, PAIRS[st.p].asy);   // ⑤：x→0 时 lg x² 一头扎向 −∞
    // 两条曲线：实线 f、虚线 g —— 完全重合 ⇔ 逐点相同；anchors 必采（挖点两侧边缘要踩到 (0,0) 才贴住空心点）
    B.plot(f.y, M, { dom: f.d, anchors: PAIRS[st.p].anc, step: .06, stroke: '#5cadff', 'stroke-width': 2.2 });
    B.plot(g.y, M, { dom: g.d, anchors: PAIRS[st.p].anc, step: .06, stroke: '#ff9e4a', 'stroke-width': 2.2, 'stroke-dasharray': '7 5' });
    for (const [hx, hy] of f.holes || [])
      B.dot(V(px(hx), py(hy)), 4.5, { fill: 'none', stroke: '#5cadff', 'stroke-width': 2 }); // 空心点：被挖去的点
    // 解析式与定义域标注（公式交 KaTeX：根号带上横线、上标真上标）
    B.tex(V(70, 36), f.lab, { size: 14, color: '#5cadff', anchor: 'start' });
    B.text(V(70, 58), f.dt, { 'font-size': 11.5, fill: '#93a1b5', 'text-anchor': 'start' });
    B.tex(V(790, 36), g.lab, { size: 14, color: '#ff9e4a', anchor: 'mid' });
    B.text(V(790, 58), g.dt, { 'font-size': 11.5, fill: '#93a1b5' });
    // 探针：竖直虚线 + 两条曲线上的落点
    B.seg(V(px(st.x), py(Y1)), V(px(st.x), py(Y0)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5' });
    const fx = f.d(st.x), gx = g.d(st.x);
    if (fx) B.dot(V(px(st.x), py(f.y(st.x))), 5, { fill: '#5cadff' });
    if (gx) B.dot(V(px(st.x), py(g.y(st.x))), 5, { fill: '#ff9e4a' });
    cF(fx ? `f(${st.x.toFixed(2)}) = ${f.y(st.x).toFixed(2)}` : `x=${st.x.toFixed(2)} 处 f 未定义`, fx ? '' : 'warn');
    cG(gx ? `g(${st.x.toFixed(2)}) = ${g.y(st.x).toFixed(2)}` : `x=${st.x.toFixed(2)} 处 g 未定义`, gx ? '' : 'warn');
    cV(PAIRS[st.p].same ? `同一函数 —— ${PAIRS[st.p].why}` : `不是同一函数 —— ${PAIRS[st.p].why}`, PAIRS[st.p].same ? 'ok' : 'warn');
  };

  const btns = PAIRS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.slider('探针 x', -3, 3, 0.05, 1, v => { st.x = v; B.render(); });
  B.graphToggles(st);
  B.hint('虚线 g 与实线 f 完全重合 ⇔ 逐点相同；② 的空心点一进探针就翻红 —— 这是定义域的限制');
  B.render();
  return B;
}
