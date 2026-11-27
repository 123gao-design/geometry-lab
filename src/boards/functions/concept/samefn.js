/* 图 C2 · 同一函数判定机：定义域与对应法则双核对（同一函数 ⇔ 定义域同 + 化简后法则同）
   图象规范：B.isoFit 等单位取景（x/y 同比例、吃满画框）+ B.grid 淡实线网格；曲线粗细与轴线同量级（≈2.2）；
   网格 / 轴标注（字母+刻度）/ 渐近线 三开关可隐藏。 */
import { V, hEl, texMix } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 580, H = 450;
  const B = new FunctionBoard(root, W, H, 'pairs');
  root.classList.add('fn-picker-board');
  const M = B.isoFit(-3.4, 3.4, -2.6, 4.8);   // 等单位：六组曲线都活动在这个窗口附近
  const { px, py, X0, X1, Y0, Y1 } = M;
  const st = { p: 0, x: 1, grid: true, labs: true, asym: true };

  // f/g：lab 解析式（$…$ 交 KaTeX）、dt 定义域文本、y 表达式、d 定义域判定；holes 为「挖去的开点」[x,y]；asy 渐近线；anc 采样锚点
  const PAIRS = [
    { same: 1, why: '法则相同 —— 记变量的字母无关', anc: [0],
      f: { lab: '$f(x)=x^2$', dt: '\\mathbb R', y: x => x * x, d: () => true },
      g: { lab: '$g(t)=t^2$', dt: '\\mathbb R', y: x => x * x, d: () => true } },
    { same: 0, why: '定义域不同：x≠0 与 x∈R', anc: [4e-4, -4e-4],
      f: { lab: '$f(x)=\\frac{x^2}{x}$', dt: '\\mathbb R\\setminus\\{0\\}', y: x => x, d: x => Math.abs(x) > 1e-9, holes: [[0, 0]] },
      g: { lab: '$g(x)=x$', dt: '\\mathbb R', y: x => x, d: () => true } },
    { same: 1, why: '化简后同为 |x|，定义域同为 R', anc: [0],
      f: { lab: '$f(x)=\\sqrt{x^2}$', dt: '\\mathbb R', y: x => Math.abs(x), d: () => true },
      g: { lab: '$g(x)=|x|$', dt: '\\mathbb R', y: x => Math.abs(x), d: () => true } },
    { same: 0, why: '定义域不同：x≥0 与 x∈R', anc: [0],
      f: { lab: '$f(x)=(\\sqrt{x})^2$', dt: '[0,+\\infty)', y: x => x, d: x => x >= -1e-9 },
      g: { lab: '$g(x)=x$', dt: '\\mathbb R', y: x => x, d: () => true } },
    { same: 0, why: '定义域不同：x≠0 与 x>0', anc: [],
      f: { lab: '$f(x)=\\lg x^2$', dt: '\\mathbb R\\setminus\\{0\\}', y: x => 2 * Math.log10(Math.abs(x)), d: x => Math.abs(x) > 1e-9 },
      g: { lab: '$g(x)=2\\lg x$', dt: '(0,+\\infty)', y: x => 2 * Math.log10(x), d: x => x > 1e-9 },
      asy: [{ v: 0 }] },
    { same: 1, why: '化简后同为 (x+1)²', anc: [-1],
      f: { lab: '$f(x)=(x+1)^2$', dt: '\\mathbb R', y: x => (x + 1) ** 2, d: () => true },
      g: { lab: '$g(t)=t^2+2t+1$', dt: '\\mathbb R', y: x => (x + 1) ** 2, d: () => true } },
  ];
  const cF = B.readout('$f(x)$'), cG = B.readout('$g(x)$', 'orange'), cV = B.chip('判定');

  B.renderFn = () => {
    const { f, g } = PAIRS[st.p];
    B.grid({ px, py, X0, X1, Y0, Y1, grid: st.grid, labs: st.labs });
    if (st.asym && PAIRS[st.p].asy) B.asym(M, PAIRS[st.p].asy);   // ⑤：x→0 时 lg x² 一头扎向 −∞
    // 蓝实线画 f，橙虚线画 g；在缺口两侧额外采样以保留空心端点。
    B.plot(f.y, M, { dom: f.d, anchors: PAIRS[st.p].anc, step: .06, stroke: '#5cadff', 'stroke-width': 2.2 });
    B.plot(g.y, M, { dom: g.d, anchors: PAIRS[st.p].anc, step: .06, stroke: '#ff9e4a', 'stroke-width': 2.2, 'stroke-dasharray': '7 5' });
    for (const [hx, hy] of f.holes || [])
      B.dot(V(px(hx), py(hy)), 7, { fill: 'none', stroke: '#5cadff', 'stroke-width': 2 }); // 空心点：被挖去的点
    // 探针：竖直虚线 + 两条曲线上的落点
    B.seg(V(px(st.x), py(Y1)), V(px(st.x), py(Y0)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5' });
    const fx = f.d(st.x), gx = g.d(st.x);
    const marks = [];
    if (fx) marks.push([V(px(st.x), py(f.y(st.x))), B.diagramColors.blue]);
    if (gx) marks.push([V(px(st.x), py(g.y(st.x))), B.diagramColors.orange]);
    B.glowPoints(marks);
    cF(fx ? `$f(${st.x.toFixed(2)})=${f.y(st.x).toFixed(2)}$` : `$x=${st.x.toFixed(2)}$ 处 $f$ 未定义`, fx ? '' : 'warn');
    cG(gx ? `$g(${st.x.toFixed(2)})=${g.y(st.x).toFixed(2)}$` : `$x=${st.x.toFixed(2)}$ 处 $g$ 未定义`, gx ? '' : 'warn');
    cV(PAIRS[st.p].same ? `同一函数 —— ${PAIRS[st.p].why}` : `不是同一函数 —— ${PAIRS[st.p].why}`, PAIRS[st.p].same ? 'ok' : 'warn');
  };

  B.slider('探针 x', -3, 3, 0.05, 1, v => { st.x = v; B.render(); });
  B.graphToggles(st);

  const choices = hEl('div', { class: 'pair-picker', role: 'group', 'aria-label': '选择一组函数' }, root);
  const headings = hEl('div', { class: 'pair-head', 'aria-hidden': 'true' }, choices);
  hEl('span', {}, headings).textContent = '函数组';
  hEl('span', {}, headings).textContent = '定义域';
  const list = hEl('div', { class: 'pair-list' }, choices);
  const buttons = PAIRS.map(({ f, g }, i) => {
    const button = hEl('button', { type: 'button', class: 'pair-choice', 'aria-pressed': String(i === st.p) }, list);
    hEl('span', { class: 'pair-number' }, button).textContent = '①②③④⑤⑥'[i];
    for (const [key, fn] of [['f', f], ['g', g]]) {
      const formula = hEl('span', { class: 'pair-formula pair-' + key }, button);
      formula.innerHTML = texMix(fn.lab);
      const domain = hEl('span', { class: 'pair-domain' }, button);
      domain.innerHTML = texMix(`$${fn.dt}$`);
    }
    button.addEventListener('click', () => {
      buttons[st.p].setAttribute('aria-pressed', 'false');
      st.p = i;
      button.setAttribute('aria-pressed', 'true');
      B.render();
    });
    return button;
  });
  B.render();
  return B;
}
