/* 图 G2 · 伸缩翻折机：y=b·f(ax) —— 横向管输入端（除以 a）、纵向管输出端（乘 b）。
   原图固定 √x（不对称才看得清变形）。a 滑块从正拖到负：曲线先塌缩、再从另一侧展开 ——
   f(−x) 关于 y 轴翻折、−f(x) 关于 x 轴翻折由 a、b 的符号一并决定（连续变形，无开关跳变）。
   坐标记录：原图上的点 (x,y) 变到 (x/a, b·y) —— 横坐标除、纵坐标乘，方向相反的两种算术。
   回收：S3 的 f(−x) 镜像、E8 的 |f|（y 轴翻折的对应形式）、G1 的「横内竖外」在乘除版复发。 */
import { V, fmt } from '../../../lib/board.js';
import { parameterRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');

  const f = x => Math.sqrt(x);                      // 原图：√x，起笔 (0,0)、过 (1,1)、(4,2)
  const st = { a: 1, b: 1, x: 1, grid: true, labs: true };
  let M = B.isoFit(-5.6, 5.6, -4.2, 4.2);
  const px = x => M.px(x), py = y => M.py(y);

  const cA = B.chipM('横向判读'), cB = B.chipM('纵向判读'), cP = B.readout('坐标核验'), cS = B.readout('像的定义域', 'gold');

  B.renderFn = () => {
    const marks = [];
    syncPreset();
    const { a, b } = st;
    const imageX = a === 0 ? 0 : st.x / a, imageY = b * f(st.x);
    M = B.mapFit(Math.min(-5.6, imageX), Math.max(5.6, imageX), Math.min(-4.2, imageY), Math.max(4.2, imageY));
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, sx: Math.max(1, Math.ceil((X1 - X0) / 18)), grid: st.grid, labs: st.labs });
    const g = x => b * f(a * x);                    // ax<0 → NaN 断笔（定义域自动换边）
    // 原图（蓝淡）+ 像（金粗）：特征点对 (1,1)→(1/a,b)、(4,2)→(4/a,2b) 为必采锚点
    B.plot(f, M, { anchors: [0, 1, 4, st.x], stroke: '#5cadff', 'stroke-width': 1.8, 'stroke-opacity': .55 });
    B.plot(g, M, { anchors: a === 0 ? [] : [0, 1 / a, 4 / a, imageX], stroke: '#ffd166', 'stroke-width': 2.4 });
    // 特征点：原图灰小、像金小（a≈0 时像点出框自然跳过）
    for (const [cx, cy] of [[1, 1], [4, 2]]) {
      B.dot(V(px(cx), py(cy)), 2.5, { fill: B.diagramColors.guide });
      const dx = cx / a, dy = b * cy;
      if (Math.abs(a) > 1e-9 && dx > X0 && dx < X1 && dy > Y0 && dy < Y1) {
        marks.push([V(px(dx), py(dy)), B.diagramColors.gold]);
        B.note(`$(${fmt(dx, 2)},\\ ${fmt(dy, 2)})$`, '#ffd166');
      }
    }
    // 探针 P（原图）→ P′（像）：横坐标除 a、纵坐标乘 b
    const x0 = Math.max(st.x, 0.02), y0 = f(x0), x1 = x0 / a, y1 = b * y0;
    // P 由可拖动把手绘制。
    if (Math.abs(a) > 1e-9 && x1 > X0 && x1 < X1 && y1 > Y0 && y1 < Y1) {
      B.seg(V(px(x0), py(y0)), V(px(x1), py(y1)), { stroke: '#ff7b8a', 'stroke-width': 1.2, 'stroke-dasharray': '3 5', 'stroke-opacity': .7 });
      marks.push([V(px(x1), py(y1)), B.diagramColors.gold]);
    }
    B.note(`$y=${b === 1 ? '' : b === -1 ? '-' : fmt(b, 2)}${a === 1 ? '\\sqrt{x}' : a === -1 ? '\\sqrt{-x}' : `\\sqrt{${fmt(a, 2)}x}`}$`, '#ffd166');
    B.note(a === 0 ? '横向变换退化为常值' : `横向比例 $1/|a|=${fmt(1 / Math.abs(a), 2)}$`);
    B.note(`纵向比例 $|b|=${fmt(Math.abs(b), 2)}$`);
    // 徽章
    cA(a === 0 ? '$a=0$，像为常值函数' : `比例 $1/|a|\\approx${fmt(1 / Math.abs(a), 2)}$${a < 0 ? '，左右翻折' : ''}`);
    cB(b === 0 ? '$b=0$，函数值恒为零' : `比例 $|b|=${Math.abs(b)}$${b < 0 ? '，上下翻折' : ''}`);
    cP(a === 0 ? '横向的点对应关系退化' : `$P(${fmt(x0, 2)},${fmt(y0, 2)})$，$P'(${fmt(x1, 2)},${fmt(y1, 2)})$`);
    cS(a === 0 ? '$D=\\mathbb R$' : a > 0 ? '$D=[0,+\\infty)$' : '$D=(-\\infty,0]$');
    B.glowPoints(marks);
  };

  const slA = B.slider('横向 a', -3, 3, 0.1, 1, v => { st.a = v; B.render(); }, undefined, v => `$a=${v}$`);
  const slB = B.slider('纵向 b', -3, 3, 0.1, 1, v => { st.b = v; B.render(); }, undefined, v => `$b=${v}$`);
  const probe = B.slider('探针 x', 0.05, 5.2, 0.05, 1, v => { st.x = v; B.render(); }, undefined, v => `$x=${v}$`);
  B.handle({
    get: () => V(px(st.x), py(f(st.x))),
    set: p => { st.x = Math.round(Math.max(.05, Math.min(5.2, M.X0 + p.x / M.s)) * 20) / 20; probe.sync(st.x); },
    color: '#ff9e4a', r: 6, label: 'P', lo: [-14, -14],
  });
  B.graphToggles(st, ['grid', 'labs']);
  const syncPreset = parameterRow(B, '选择伸缩翻折', [
    { name: '横向压缩', short: '横缩', formula: '$a=2$', values: { a: 2, b: 1 } },
    { name: '横向拉伸', short: '横伸', formula: '$a=1/2$', values: { a: .5, b: 1 } },
    { name: '左右翻折', short: '左翻', formula: '$a=-1$', values: { a: -1, b: 1 } },
    { name: '上下翻折', short: '下翻', formula: '$b=-1$', values: { a: 1, b: -1 } },
  ], st, { a: slA, b: slB });
  B.render();
  return B;
}
