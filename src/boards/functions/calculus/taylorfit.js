/* 图 V6 · 泰勒拟合机：麦克劳林展开的「长成」过程 —— 在 0 处逐阶对齐导数。
   蓝曲线=目标函数，金曲线=部分和 P_n（拖「阶数」一项项长上来），灰虚=各项单独曲线（虚线逐项）；
   检验点 x_q 竖线量误差：e^x/sin 收敛飞快，ln(1+x) 越过收敛半径 1 直接发散。
   各原图量级不同，按 E4/E7 先例各用比例尺（mapFit）；网格步长 gx/gy 按原图传给 B.grid。 */
import { V, fmt } from '../../../lib/board.js';
import { presetRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');

  const fact = k => { let r = 1; for (let i = 2; i <= k; i++) r *= i; return r; };
  const PRESETS = [
    {
      name: '指数', formula: '$f=e^x$', f: x => Math.exp(x), nMax: 6, ghostFrom: 0,
      xa: -2.3, xb: 2.3, ya: -1.5, yb: 9.5, qlo: -2.2, qhi: 2.2,
      gx: 0.5, gy: 1, lx: 1, ly: 2,
      terms: k => x => Math.pow(x, k) / fact(k),
    },
    {
      name: '正弦', formula: '$f=\\sin x$', f: x => Math.sin(x), nMax: 13, ghostFrom: 0,
      xa: -3.6, xb: 3.6, ya: -2.4, yb: 2.4, qlo: -3.5, qhi: 3.5,
      gx: 0.5, gy: 0.5, lx: 1, ly: 1,
      terms: k => x => k % 2 === 0 ? 0 : (-1) ** ((k - 1) / 2) * x ** k / fact(k),
    },
    {
      name: '对数', formula: '$f=\\ln(1+x)$', f: x => Math.log(1 + x), nMax: 6, ghostFrom: 1, dom: -1,
      xa: -0.92, xb: 1.75, ya: -2.6, yb: 1.6, qlo: -0.9, qhi: 1.6,
      gx: 0.25, gy: 0.5, lx: 0.5, ly: 1,
      terms: k => (k === 0 ? () => 0 : x => (k % 2 === 1 ? 1 : -1) * Math.pow(x, k) / k),
    },
  ];
  /** 各向比例尺取景（E4/E7 先例）：不回传 sx/sy（B.grid 把它们读作步长） */
  const MAPS = PRESETS.map(P => B.mapFit(P.xa, P.xb, P.ya, P.yb));
  const st = { p: 0, n: 3, xq: 1, ghost: false, grid: true, labs: true };

  const cX = B.chipM('展开式'), cE = B.readout('检验点误差'), cC = B.chipM('收敛判读');

  const sumAt = (P, n, x) => { let s = 0; for (let k = 0; k <= n; k++) s += P.terms(k)(x); return s; };
  function termText(i, n) {
    const parts = [];
    for (let k = 0; k <= n; k++) {
      if ((i === 1 && k % 2 === 0) || (i === 2 && k === 0)) continue;
      const sign = (i === 1 && k % 4 === 3) || (i === 2 && k % 2 === 0) ? '-' : parts.length ? '+' : '';
      const term = k === 0 ? '1' : k === 1 ? 'x' : `\\tfrac{x^{${k}}}{${k}${i === 2 ? '' : '!'}}`;
      parts.push(`$${sign}${term}$`);
    }
    return `$P_{${n}}(x)=$ ` + (parts.join(' ') || '$0$');
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const y0 = P.f(0), center = V(M.px(0), M.py(y0));
    const marks = [[center, B.diagramColors.violet]];
    B.grid({ ...M, grid: st.grid, labs: st.labs, sx: P.gx, sy: P.gy, lx: P.lx, ly: P.ly });
    B.note(P.formula, '#5cadff');
    const kind = st.n === 0 ? '常值近似' : st.n === 1 ? '切线' : '多项式';
    B.note(`${kind} $P_{${st.n}}(x)$`, '#ffd166');
    B.note(`${st.n === 1 ? '切点' : '展开点'} $A=(0,${y0})$`, '#c084fc');

    const inDom = P.dom == null || st.xq > P.dom;
    const drawFn = (fn, at) => B.plot(fn, M, { anchors: [0, st.xq], ...at });
    drawFn(P.f, { stroke: '#5cadff', 'stroke-width': 2.2 });
    // 虚线逐项：各项单独曲线（灰虚）—— 看每一项自己的图象（ln 的第 0 项恒为 0，跳过）
    if (st.ghost) for (let k = P.ghostFrom; k <= st.n; k++)
      if (!(st.p === 1 && k % 2 === 0)) drawFn(P.terms(k), { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-opacity': .5, 'stroke-dasharray': '5 4' });
    // 部分和 P_n（金，粗）：多项式一项项长上来
    drawFn(x => sumAt(P, st.n, x), { stroke: '#ffd166', 'stroke-width': 2.2 });
    // 检验点：竖线 + 两点连线（橙=误差棒、金=多项式读数、绿=真值）
    if (st.xq > M.X0 && st.xq < M.X1) {
      const yP = sumAt(P, st.n, st.xq), yF = P.f(st.xq);
      if (st.xq !== 0) B.seg(V(M.px(st.xq), 40), V(M.px(st.xq), H - 40), { stroke: '#3f5f8f', 'stroke-dasharray': '4 5', 'stroke-width': 1.1 });
      if (inDom && isFinite(yF) && yF > M.Y0 && yF < M.Y1) {
        if (isFinite(yP) && yP > M.Y0 && yP < M.Y1) {
          B.seg(V(M.px(st.xq), M.py(yP)), V(M.px(st.xq), M.py(yF)), { stroke: '#ff9e4a', 'stroke-width': 2 });
          marks.push([V(M.px(st.xq), M.py(yP)), B.diagramColors.gold]);
        }
        marks.push([V(M.px(st.xq), M.py(yF)), B.diagramColors.green]);
      }
    }

    // 徽章
    cX(termText(st.p, st.n));
    const err = Math.abs(sumAt(P, st.n, st.xq) - P.f(st.xq));
    cE(inDom ? `$x_q=${fmt(st.xq, 2)}$，绝对误差约 $${fmt(err, 4)}$` : '检验点在定义域外');
    if (st.p !== 2) cC('级数对每个实数输入收敛。');
    else if (st.xq > 1) cC('$x_q>1$，级数发散。', 'warn');
    else if (st.xq === 1) cC('$x_q=1$，交错级数收敛到 $\\ln 2$。');
    else cC('$|x_q|<1$，级数收敛到 $\\ln(1+x_q)$。');
    if (st.labs) B.text(V(center.x + 17, center.y - 18), 'A', { fill: '#c084fc' });
    B.glowPoints(marks);
  };

  let autoOn = false, autoBtn = null, fr = 0;
  const tick = () => {
    if (!autoOn) return;
    fr++;
    if (fr % 12 === 0) {
      st.n = Math.min(st.n + 1, PRESETS[st.p].nMax);
      sl.sync(st.n); B.render();
      if (st.n >= PRESETS[st.p].nMax) { autoOn = false; autoBtn.set(false); }
    }
    if (autoOn) B.raf(tick);
  };
  autoBtn = B.toggleBtn('⏩ 阶数加一', false, on => { autoOn = on; fr = 0; if (on) B.raf(tick); else B.cancelRaf(); });
  const sl = B.slider('阶数 n', 0, 6, 1, 3, v => { st.n = Math.round(v); B.render(); }, undefined, v => `$n=${Number(v)}$`);
  const slQ = B.slider('检验点 x', -2.2, 2.2, 0.05, 1, v => { st.xq = v; B.render(); }, undefined, v => `$x_q=${v}$`);
  B.toggleBtn('虚线逐项', false, on => { st.ghost = on; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  presetRow(B.ctrl, '选择例题', PRESETS, i => {
    const p = PRESETS[i];
    st.p = i;
    st.xq = Math.max(p.qlo, Math.min(p.qhi, st.xq));
    slQ.setAttribute('min', p.qlo); slQ.setAttribute('max', p.qhi); slQ.sync(st.xq);
    sl.max = p.nMax; st.n = Math.min(st.n, p.nMax); sl.sync(st.n);
    B.render();
  });
  B.render();
  return B;
}
