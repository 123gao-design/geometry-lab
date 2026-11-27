/* 图 G1 · 平移读写机：y=f(x−h)+k —— 横移加在内层（输入端）、竖移加在外层（输出端）。
   「左加右减」不是口诀是补偿：要在 x=h 处才读到原来 x=0 的输出 —— 输入端反向记录。
   探针 P 锁在原图上，P′=(x₀+h, y₀+k) 跟着走：先横后竖的分解路径把 (h,k) 画成看得见的向量。
   原图三选：√x（起笔 (0,0)）、x²（顶点 (0,0)）、e^x（不对称 + 渐近线 y=0 随手平移）。
   回收：C5 机器观（f(x)+k 竖走 vs f(x+h) 横走）在这里全量核验；E8 的折缝是 k=0 的特例。 */
import { V, fmt } from '../../../lib/board.js';
import { presetRow, parameterRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');

  const BASES = [
    { name: '平方根', formula: '$\\sqrt{x}$', f: x => Math.sqrt(x), tex: (s, kk) => `\\sqrt{${s}}${kk}`, box: [-2.6, 6.4, -2.2, 5.2], anch: [[0, 0], [1, 1], [4, 2]], asym: [] },
    { name: '平方', formula: '$x^2$', f: x => x * x, tex: (s, kk) => `(${s})^2${kk}`, box: [-3.6, 5.4, -2.4, 6.4], anch: [[0, 0], [1, 1], [-1, 1]], asym: [] },
    { name: '指数', formula: '$e^x$', f: x => Math.exp(x), tex: (s, kk) => `e^{${s}}${kk}`, box: [-3.2, 5.8, -1.6, 7.2], anch: [[0, 1], [1, Math.E]], asym: [[0, 0]] },
  ];
  let M = B.isoFit(...BASES[0].box);
  const st = { p: 0, h: 0, k: 0, x: 1, grid: true, labs: true, asym: true };
  const px = x => M.px(x), py = y => M.py(y);

  const cE = B.chipM('解析式'), cP = B.readout('坐标核验'), cD = B.chipM('方向判读'), cS = B.chipM('坐标变换');

  B.renderFn = () => {
    const marks = [];
    syncPreset();
    const P = BASES[st.p], [xa, xb, ya, yb] = P.box;
    M = B.isoFit(xa + Math.min(0, st.h), xb + Math.max(0, st.h), ya + Math.min(0, st.k), yb + Math.max(0, st.k));
    const { X0, X1, Y0, Y1 } = M;
    const f = P.f, { h, k } = st;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym) for (const [, y] of P.asym) { B.asym(M, [{ h: y }]); B.asym(M, [{ h: y + k }]); }   // 原图渐近线 y=0 与像渐近线 y=k
    // 原图（蓝淡）+ 像（金粗）：锚点并进采样（原图特征点 + 像特征点都要踩准）
    const anchors = [st.x, ...P.anch.map(([x]) => x)];
    B.plot(f, M, { anchors, stroke: '#5cadff', 'stroke-width': 1.8, 'stroke-opacity': .55 });
    B.plot(x => f(x - h) + k, M, { anchors: anchors.map(x => x + h), stroke: '#ffd166', 'stroke-width': 2.4 });
    // 特征点：原图灰小、像金小
    for (const [ax, ay] of P.anch) {
      if (ax > X0 && ax < X1 && ay > Y0 && ay < Y1) B.dot(V(px(ax), py(ay)), 2.5, { fill: B.diagramColors.guide });
      const bx = ax + h, by = ay + k;
      if (bx > X0 && bx < X1 && by > Y0 && by < Y1) marks.push([V(px(bx), py(by)), B.diagramColors.gold]);
    }
    // 探针 P（原图）→ P′（像）：先横后竖分解
    const x0 = st.x, y0 = f(x0), x1 = x0 + h, y1 = y0 + k;
    if (isFinite(y0) && y0 > Y0 && y0 < Y1) {
      // P 由可拖动把手绘制。
      if (x1 > X0 && x1 < X1 && y1 > Y0 && y1 < Y1) {
        B.seg(V(px(x0), py(y0)), V(px(x1), py(y0)), { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-dasharray': '4 4', 'stroke-opacity': .75 });
        B.seg(V(px(x1), py(y0)), V(px(x1), py(y1)), { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-dasharray': '4 4', 'stroke-opacity': .75 });
        B.seg(V(px(x0), py(y0)), V(px(x1), py(y1)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-opacity': .5 });
        if (Math.abs(h) > 0.4) B.note(`$h=${fmt(h, 2)}$`, '#ff9e4a');
        if (Math.abs(k) > 0.4) B.note(`$k=${fmt(k, 2)}$`, '#ff9e4a');
        marks.push([V(px(x1), py(y1)), B.diagramColors.gold]);
      }
    }
    B.note('原图 ' + P.formula, '#5cadff'); B.note('$f(x-h)+k$', '#ffd166');
    const argument = h === 0 ? 'x' : `x${h < 0 ? '+' : '-'}${Math.abs(h)}`;
    cE(`$y=${P.tex(argument, k === 0 ? '' : (k > 0 ? '+' : '') + k)}$`);
    cP(`$P(${fmt(x0, 2)},${fmt(y0, 2)})$，$P'(${fmt(x1, 2)},${fmt(y1, 2)})$`);
    cD(`水平位移 $h=${h}$，竖直位移 $k=${k}$`);
    cS('$(x,y)\\mapsto(x+h,y+k)$');
    B.glowPoints(marks);
  };

  const slH = B.slider('横移 h', -3, 3, 0.1, 0, v => { st.h = v; B.render(); }, undefined, v => `$h=${v}$`);
  const slK = B.slider('竖移 k', -3, 3, 0.1, 0, v => { st.k = v; B.render(); }, undefined, v => `$k=${v}$`);
  B.handle({
    get: () => V(px(st.x), py(BASES[st.p].f(st.x))),
    set: p => {
      const [xa, xb, , yb] = BASES[st.p].box;
      const x = M.X0 + p.x / M.s;
      const lo = [0, -Math.sqrt(yb), xa][st.p];
      const hi = [xb, Math.sqrt(yb), Math.log(yb)][st.p];
      st.x = Math.max(lo, Math.min(hi, x));
    },
    color: '#ff9e4a', r: 6, label: 'P', lo: [-14, -14],
  });
  B.graphToggles(st);
  presetRow(B.ctrl, '选择原函数', BASES, i => {
    st.p = i; st.x = i === 2 ? 0 : 1; B.render();
  });
  const syncPreset = parameterRow(B, '选择位移', [
    { name: '右二上一', formula: '$(2,1)$', values: { h: 2, k: 1 } },
    { name: '左三', formula: '$(-3,0)$', values: { h: -3, k: 0 } },
    { name: '下二', formula: '$(0,-2)$', values: { h: 0, k: -2 } },
    { name: '复位', formula: '$(0,0)$', values: { h: 0, k: 0 } },
  ], st, { h: slH, k: slK });
  B.render();
  return B;
}
