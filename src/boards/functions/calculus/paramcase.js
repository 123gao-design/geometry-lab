/* 图 V5 · 参数诊疗机：f=x³−3tx —— 一个参数 t 管极值深度、联动零点个数。
   t>0：两驻点，极大 2t^{3/2}、极小 −2t^{3/2}（奇函数互为镜像）→ 三个零点 x=0, ±√(3t)；
   t=0：驻点不变号、三重零点；t<0：全程单增、唯一零点 —— 参数大题「先分类再画表」判定顺序的典型例子。
   曲线按 f′ 符号染色（S2 复用）。整框 isoFit 等单位。 */
import { V, fmt } from '../../../lib/board.js';
import { parameterRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');

  const st = { t: 1, grid: true, labs: true };
  const f = x => x * x * x - 3 * st.t * x;
  const M = B.isoFit(-3.2, 3.2, -6.4, 6.4);

  const cD = B.chipM('导数判读'), cE = B.readout('极值核验'), cZ = B.readout('零点', 'gold'), cF = B.chipM('判定顺序');

  B.renderFn = () => {
    const marks = [];
    syncPreset();
    const t = st.t;
    B.grid({ ...M, grid: st.grid, labs: st.labs });

    const pos = t > 1e-9;
    const zero = Math.abs(t) < 1e-9;
    const s = Math.sqrt(Math.max(t, 0));
    const cuts = pos ? [M.X0, -s, s, M.X1] : [M.X0, M.X1];
    for (let i = 1; i < cuts.length; i++) {
      B.plot(f, M, { x0: cuts[i - 1], x1: cuts[i], anchors: [0], stroke: i === 2 ? '#ff7b8a' : '#4ade80', 'stroke-width': 2.2 });
    }
    // 驻点：t>0 两金点（极值）、t=0 红点（不变号）、t<0 无
    if (pos) {
      for (const [x, y] of [[-s, 2 * Math.pow(t, 1.5)], [s, -2 * Math.pow(t, 1.5)]])
        if (y > M.Y0 && y < M.Y1) marks.push([V(M.px(x), M.py(y)), B.diagramColors.gold]);
    } else if (zero) {
      marks.push([V(M.px(0), M.py(0)), B.diagramColors.red]);
    }
    // 零点：x=0 恒在；t>0 另有 ±√(3t)
    const zs = [0];
    if (pos) zs.push(Math.sqrt(3 * t), -Math.sqrt(3 * t));
    for (const z of zs) if (z > M.X0 && z < M.X1) marks.push([V(M.px(z), M.py(0)), B.diagramColors.guide]);

    // 徽章
    cD(pos ? `驻点 $x=\\pm${fmt(s, 2)}$，增、减、增`
      : zero ? "$f'=3x^2$，全实域递增" : "$f'>0$，全实域递增", '');
    const peak = 2 * Math.pow(Math.max(0, t), 1.5);
    cE(pos ? `极大值 $${fmt(peak, 3)}$，极小值 $${fmt(-peak, 3)}$`
      : zero ? '原点两侧导数同号，无极值' : '无驻点，无极值', pos ? 'ok' : '');
    cZ(pos ? `三个：$0,\\ \\pm${fmt(Math.sqrt(3 * t), 2)}$` : zero ? '原点是三重根，曲线穿过横轴' : '唯一零点为原点', '');
    cF('先求驻点，再由增减与极值判断交点', '');
    B.glowPoints(marks);
  };

  const sl = B.slider('参数 t', -0.5, 2, 0.05, 1, v2 => { st.t = v2; B.render(); }, undefined, v => `$t=${v}$`);
  B.graphToggles(st, ['grid', 'labs']);
  const syncPreset = parameterRow(B, '选择参数', [
    { name: '三零点', formula: '$t=1$', values: { t: 1 } },
    { name: '临界', formula: '$t=0$', values: { t: 0 } },
    { name: '单零点', formula: '$t=-0.5$', values: { t: -.5 } },
    { name: '极值加深', formula: '$t=2$', values: { t: 2 } },
  ], st, { t: sl });
  B.render();
  return B;
}
