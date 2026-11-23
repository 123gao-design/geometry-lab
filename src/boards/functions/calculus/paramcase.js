/* 图 V5 · 参数诊疗机：f=x³−3tx —— 一个参数 t 管极值深度、联动零点个数。
   t>0：两驻点，极大 2t^{3/2}、极小 −2t^{3/2}（奇函数互为镜像）→ 三个零点 x=0, ±√(3t)；
   t=0：驻点不变号、三重零点；t<0：全程单增、唯一零点 —— 参数大题「先分类再画表」工作流的典型例子。
   曲线按 f′ 符号染色（S2 复用）。整框 isoFit 等单位。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);

  const st = { t: 1, grid: true, labs: true };
  const f = x => x * x * x - 3 * st.t * x;
  const fp = x => 3 * x * x - 3 * st.t;
  const M = B.isoFit(-3.2, 3.2, -6.4, 6.4);

  const cD = B.chipM('导数判读'), cE = B.chipM('极值核验'), cZ = B.chipM('零点核验'), cF = B.chipM('工作流');

  /** 按符号分段染色画 f；驻点为锚点 */
  function plotSign(sg, at) {
    const t = st.t;
    const crits = t > 1e-9 ? [-Math.sqrt(t), Math.sqrt(t)] : (Math.abs(t) < 1e-9 ? [0] : []);
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.03) xs.push(x);
    for (const c of crits) xs.push(c);
    xs.sort((m, n) => m - n);
    let d = '', pen = false;
    for (const x of xs) {
      if (Math.sign(fp(x)) === sg) {
        const y = f(x);
        if (y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + M.px(x).toFixed(1) + ' ' + M.py(y).toFixed(1) + ' '; pen = true; continue; }
      }
      pen = false;
    }
    mk('path', { d, fill: 'none', ...at }, B.dyn);
  }

  B.renderFn = () => {
    const t = st.t;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    plotSign(1, { stroke: '#4ade80', 'stroke-width': 2.2 });
    plotSign(-1, { stroke: '#ff7b8a', 'stroke-width': 2.2 });

    const pos = t > 1e-9;
    const zero = Math.abs(t) < 1e-9;
    const s = Math.sqrt(Math.max(t, 0));
    // 驻点：t>0 两金点（极值）、t=0 红空圈（不变号）、t<0 无
    if (pos) {
      for (const [x, y] of [[-s, 2 * Math.pow(t, 1.5)], [s, -2 * Math.pow(t, 1.5)]])
        if (y > M.Y0 && y < M.Y1) B.dot(V(M.px(x), M.py(y)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
    } else if (zero) {
      B.dot(V(M.px(0), M.py(0)), 5.5, { fill: '#0a0d14', stroke: '#ff7b8a', 'stroke-width': 2 });
    }
    // 零点：x=0 恒在；t>0 另有 ±√(3t)
    const zs = [0];
    if (pos) zs.push(Math.sqrt(3 * t), -Math.sqrt(3 * t));
    for (const z of zs) if (z > M.X0 && z < M.X1) B.dot(V(M.px(z), M.py(0)), 4.5, { fill: '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1.3 });

    // 徽章
    cD(pos ? `$f'=3(x^2-${fmt(t, 2)})$ → 驻点 $x=\\pm${fmt(s, 2)}$ —— 符号「+−+」：增减增`
      : zero ? `$f'=3x^2\\ge 0$ —— 单调不减：驻点 $x=0$ 挡不住增势`
        : `$f'=3(x^2+${fmt(-t, 2)})>0$ 恒成立 —— 全程单增`, pos ? '' : 'warn');
    if (pos) cE(`极大 $f(-\\sqrt{t})=${fmt(2 * Math.pow(t, 1.5), 3)}$，极小 $f(\\sqrt{t})=${fmt(-2 * Math.pow(t, 1.5), 3)}$ —— 互为相反数（f 是奇函数）`, 'ok');
    else if (zero) cE(`驻点 $x=0$ 两侧 $f'$ 同号：不是极值 —— 判据是变号，不是清零`, 'warn');
    else cE(`无驻点、无极值 —— 极值是「增减换挡」的事件，全程不换挡就没有`, 'warn');
    if (pos) cZ(`$x(x^2-3t)=0$ → $x=0,\\ \\pm${fmt(Math.sqrt(3 * t), 2)}$，极大 $${fmt(2 * Math.pow(t, 1.5), 2)}>0$、极小为负 —— 两端必再穿轴，共三个零点（R2 定理逐区间保证）`, 'ok');
    else if (zero) cZ('$x^3=0$ 三重零点：驻点恰好骑在轴上 —— 触轴不穿轴的极限态', 'warn');
    else cZ('极值不存在、曲线一路升 —— 只穿轴一次', 'warn');
    cF('参数大题四步：$f\'$ 找零点 → 按零点个数分类（$t<0$ / $t=0$ / $t>0$）→ 每类画单调表 → 回验端点 —— 与 E2 动轴、根分布同一条流程', '');
  };

  const setT = v2 => { st.t = v2; sl.sync(v2); B.render(); };
  const btns = [
    ['$t=1$', 1], ['$t=0$：临界', 0], ['$t=-0.5$', -0.5], ['$t=2$：加深', 2],
  ].map(([n, val], i) => B.btnM(n, () => {
    setT(val);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { pri: i === 0, on: i === 0 }));
  const sl = B.slider('参数 t', -0.5, 2, 0.05, 1, v2 => { st.t = v2; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint("让 t 经过 0，对照驻点和零点的数目。");
  B.render();
  return B;
}
