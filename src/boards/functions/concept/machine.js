/* 图 C5 · 双机器改装台：f(x)+h（输出端改装，上下平移）vs f(x+h)（输入端改装，左右平移）
   同一个滑块 h 同时驱动两条变形曲线：金色竖着走、蓝色横着走 —— 「左加右减」的代数真相。
   图象规范：各预设 B.isoFit 等单位取景（真实比例，抛物线/双曲线不变形）；③ 的渐近线按角色配色（灰基准/蓝输入/金输出），
   由「渐近线」开关统一隐藏；网格 / 轴标注 可隐藏。 */
import { V, fmt } from '../../../lib/board.js';
import { presetRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');

  const PRESETS = [
    { name: '平方', formula: '$f(x)=x^2$', d: () => true, f: x => x * x, box: [-3.2, 3.2, -1, 8.6], edge: 0, base: '基准 $f(x)=x^2$',
      out: h => `$f(x)+h = x^2 ${sgn(h)} ${abs(h)}$`, inn: h => `$f(x+h) = (x${sgn(h)} ${abs(h)})^2$`,
      dom: () => '两者都是 $\\mathbb R$', marks: 1 },
    { name: '平方根', formula: '$f(x)=\\sqrt{x}$', d: x => x >= 0, f: x => Math.sqrt(x), box: [-2.4, 4, -1, 3.4], edge: 0, base: '基准 $f(x)=\\sqrt{x}$',
      out: h => `$f(x)+h = \\sqrt{x} ${sgn(h)} ${abs(h)}$`, inn: h => `$f(x+h) = \\sqrt{x${sgn(h)} ${abs(h)}}$`,
      dom: h => `竖移 $x\\ge0$，横移 $x\\ge${fmt(-h, 2)}$`, marks: 1 },
    { name: '倒数', formula: '$f(x)=\\tfrac{1}{x}$', d: x => Math.abs(x) > 1e-9, f: x => 1 / x, box: [-3.4, 3.4, -3.6, 3.6], edge: null, base: '基准 $f(x)=\\dfrac{1}{x}$',
      out: h => `$f(x)+h = \\dfrac{1}{x} ${sgn(h)} ${abs(h)}$`, inn: h => `$f(x+h) = \\dfrac{1}{x${sgn(h)} ${abs(h)}}$`,
      dom: h => `竖移 $x\\ne0$，横移 $x\\ne${fmt(-h, 2)}$`, marks: 0 },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, h: 0.5, grid: true, labs: true, asym: true };
  const cOut = B.readout('输出端', 'gold'), cIn = B.readout('输入端'), cDom = B.readout('定义域', 'mint');
  const sgn = v => v < 0 ? '-' : '+';
  const abs = v => Math.abs(v).toFixed(2);

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { px, py, X0, X1, Y0, Y1 } = M;
    const h = st.h;
    // 网格 + 坐标轴 + 刻度
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    // 三条曲线：基准虚线灰、输出端金、输入端蓝（粗细与轴线同量级）；锚点 = 域端点（② 的 (0,0)、输入端的 (−h,0) 要精确踩到）
    const anc = P.edge != null ? [P.edge] : [], ancIn = P.edge != null ? [P.edge - h] : [];
    B.plot(P.f, M, { dom: P.d, anchors: anc, pad: .4, step: .05, stroke: '#5c6a80', 'stroke-width': 2, 'stroke-dasharray': '5 5', 'stroke-opacity': .8 });
    B.plot(x => P.f(x) + h, M, { dom: P.d, anchors: anc, pad: .4, step: .05, stroke: '#ffd166', 'stroke-width': 2.2 });
    B.plot(x => P.f(x + h), M, { dom: x => P.d(x + h), anchors: ancIn, pad: .4, step: .05, stroke: '#5cadff', 'stroke-width': 2.2 });
    // 关键点标记（顶点/端点）：基准、输出端、输入端各一枚
    if (P.marks) {
      B.glowPoints([[V(px(0), py(h)), B.diagramColors.gold], [V(px(-h), py(0)), B.diagramColors.blue],
        [V(px(0), py(0)), B.diagramColors.guide]]);
    } else if (st.asym) {
      // ③：渐近线 —— 输入端平移挪竖直渐近线，输出端平移挪水平渐近线（颜色与曲线角色一一对应）
      B.inf(V(px(0), py(Y0)), V(px(0), py(Y1)), { stroke: '#5c6a80', 'stroke-dasharray': '4 5', 'stroke-opacity': .6 });
      B.inf(V(px(-h), py(Y0)), V(px(-h), py(Y1)), { stroke: '#5cadff', 'stroke-dasharray': '4 5', 'stroke-opacity': .7 });
      B.inf(V(px(X0), py(h)), V(px(X1), py(h)), { stroke: '#ffd166', 'stroke-dasharray': '4 5', 'stroke-opacity': .7 });
      B.note(`$x=${fmt(-h, 2)}$`, '#5cadff');
    }
    // 图例 + 位移矢量箭头（金竖、蓝横，方向随 h 正负翻转）
    B.note(P.base, '#93a1b5');
    B.note('$f(x)+h$', '#ffd166'); B.note('$f(x+h)$', '#5cadff');
    // 徽章
    cOut(P.out(h), '');
    cIn(P.inn(h), '');
    cDom(P.dom(h), Math.abs(h) < 1e-9 ? 'ok' : '');
  };

  B.slider('位移 h', -2, 2, 0.05, 0.5, v => { st.h = v; B.render(); }, undefined, v => `$h=${v}$`);
  B.graphToggles(st);
  presetRow(B.ctrl, '选择例题', PRESETS, i => {
    st.p = i;
    B.render();
  });
  B.render();
  return B;
}
