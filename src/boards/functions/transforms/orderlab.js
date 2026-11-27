/* 图 G3 · 比较变换顺序，并从根式图象的起点和缩放系数反推一组参数。 */
import { V, fmt } from '../../../lib/board.js';
import { parameterRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');

  const f = x => Math.sqrt(x);
  const st = { mode: 0, a: 2, h: 1, b: 1, k: 0, qi: 0, solved: false, grid: true, labs: true };
  const M = B.isoFit(-2.5, 6.5, -2.5, 5.5);
  const px = x => M.px(x), py = y => M.py(y);
  // 题库（四参数都在滑块量程内）：出题按钮按序轮换
  const QUIZ = [
    { a: 2, h: 1, b: 1, k: 1 }, { a: 0.5, h: 2, b: 2, k: 0 },
    { a: 1.5, h: -1, b: 0.5, k: 1 }, { a: 1, h: 3, b: 1, k: -1 },
  ];

  const cE = B.readout('目标 / 金线', 'gold'), cM = B.readout('对照起点', 'orange');
  const cD = B.readout('比较'), cS = B.chipM('判读');

  /** 参数化变形曲线 y=bb·f(aa(x−hh))+kk；锚点：起笔与特征像 */
  function drawC(aa, hh, bb, kk, at, anchors) {
    const g = x => bb * f(aa * (x - hh)) + kk;
    B.plot(g, M, { step: .03, anchors, ...at });
  }

  B.renderFn = () => {
    const marks = [];
    syncPreset();
    const { a, h, b, k } = st;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    drawC(1, 0, 1, 0, { stroke: '#5cadff', 'stroke-width': 1.8, 'stroke-opacity': .5 }, [0, 1, 4]);   // 原图蓝淡
    const anchors = [h, h + 1 / a, st.mode === 0 ? h / a : QUIZ[st.qi].h];
    if (st.mode === 0) {
      drawC(a, h, b, k, { stroke: '#ffd166', 'stroke-width': 2.4 }, anchors);   // 正确读法（金）
      drawC(a, h / a, b, k, { stroke: '#ff7b8a', 'stroke-width': 1.6, 'stroke-dasharray': '6 5', 'stroke-opacity': .85 }, [h / a]);   // 误读（红虚）
      // 起笔点核验：正确 (h,k) 金实、误读 (h/a,k) 红
      if (h > M.X0 && h < M.X1 && k > M.Y0 && k < M.Y1) marks.push([V(px(h), py(k)), B.diagramColors.gold]);
      const hx = h / a;
      if (hx > M.X0 && hx < M.X1 && k > M.Y0 && k < M.Y1) marks.push([V(px(hx), py(k)), B.diagramColors.red]);
      B.note('$y=b f(a(x-h))+k$', '#ffd166');
      B.note('$y=b f(ax-h)+k$', '#ff7b8a');
      cE(`金线起点 $(${h},${k})$`);
      cM(`红线起点 $(${Number(hx.toFixed(3))},${k})$`);
      cD(h === 0 || a === 1 ? '两条曲线重合。' : '两条曲线的起点不同。');
      cS('$ax-h=a(x-h/a)$，红线的水平位移是 $h/a$。');
    } else {
      const q = QUIZ[st.qi];
      drawC(q.a, q.h, q.b, q.k, { stroke: '#ffd166', 'stroke-width': 2.4 }, [q.h, q.h + 1 / q.a]);   // 目标（金）
      drawC(a, h, b, k, { stroke: '#ff9e4a', 'stroke-width': 2.4 }, [h, h + 1 / a]);                    // 玩家（橙）
      if (q.h > M.X0 && q.h < M.X1 && q.k > M.Y0 && q.k < M.Y1) marks.push([V(px(q.h), py(q.k)), B.diagramColors.gold]);
      if (h > M.X0 && h < M.X1 && k > M.Y0 && k < M.Y1) marks.push([V(px(h), py(k)), B.diagramColors.orange]);
      const scale = b * Math.sqrt(a), target = q.b * Math.sqrt(q.a);
      st.solved = h === q.h && k === q.k && Math.abs(scale - target) < 1e-9;
      B.note('目标曲线', '#ffd166'); B.note('当前曲线', '#ff9e4a');
      cE(st.solved ? `一组解：$a=${q.a}$，$b=${q.b}$` : '观察金线的起点与弯曲程度。');
      cM(`当前起点 $(${h},${k})$`);
      cD(`当前 $b\\sqrt a\\approx${fmt(scale, 3)}$`);
      cS(st.solved ? '两图重合；同一曲线可对应多组缩放参数。' : '起点与缩放系数都相同，两图才重合。', st.solved ? 'ok' : '');
    }
    B.glowPoints(marks);
  };

  // 模式切换
  const mb = ['顺序对比', '由图反演'].map((t, i) => B.btnM(t, () => {
    st.mode = i;
    mb.forEach((button, j) => { button.classList.toggle('on', j === i); button.setAttribute('aria-pressed', String(j === i)); });
    row.style.display = i === 0 ? '' : 'none';    // 预设只在模式一
    qb.style.display = i === 1 ? '' : 'none';                            // 出题只在模式二
    B.render();
  }, { on: i === 0 }));
  // 模式一预设：三道经典提因子题
  mb.forEach((button, i) => button.setAttribute('aria-pressed', String(i === 0)));
  const qb = B.btnM('出题 $\\to$ 下一题', () => {
    st.qi = (st.qi + 1) % QUIZ.length;
    B.render();
  });
  qb.style.display = 'none';
  const slA = B.slider('横向缩放 a', 0.25, 3, 0.05, 2, v => { st.a = v; B.render(); }, undefined, v => `$a=${v}$`);
  const slH = B.slider('平移 h', -3, 3, 0.05, 1, v => { st.h = v; B.render(); }, undefined, v => `$h=${v}$`);
  const slB = B.slider('纵向缩放 b', 0.25, 3, 0.05, 1, v => { st.b = v; B.render(); }, undefined, v => `$b=${v}$`);
  const slK = B.slider('竖移 k', -2, 3, 0.05, 0, v => { st.k = v; B.render(); }, undefined, v => `$k=${v}$`);
  B.graphToggles(st, ['grid', 'labs']);
  const syncPreset = parameterRow(B, '选择变换参数', [
    { name: '压缩后右移', short: '压缩', formula: '$f(2(x-1))$', values: { a: 2, h: 1, b: 1, k: 0 } },
    { name: '拉伸后右移', short: '拉伸', formula: '$f((x-2)/2)$', values: { a: .5, h: 2, b: 1, k: 0 } },
    { name: '保持原宽', short: '原宽', formula: '$a=1$', values: { a: 1, h: 1, b: 1, k: 0 } },
  ], st, { a: slA, h: slH, b: slB, k: slK });
  const row = B.ctrl.querySelector('.fn-preset-row');
  B.render();
  return B;
}
