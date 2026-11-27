/* 图 C4 · 阶梯台：分段函数的三种形式 —— 跳变（邮资）、折线衔接（个税）、解析式分段（|x−1|+2）
   看点：分段点的实心/空心点由区间开闭决定；跳变还是连惯，拖探针到分段点直接验明。
   图象规范：①② 横纵是克/元两种量纲，各用各的比例尺（如实标注刻度）；③ 纯数学函数用 B.isoFit 等单位取景。
   网格 / 轴标注 两开关可隐藏。 */
import { V } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

import { glowDot } from '../../../lib/conic-diagram.js';
import { functionPicker } from './function-picker.js';

export function createBoard(root) {
  const W = 650, H = 410;
  const B = new FunctionBoard(root, W, H, 'piecewise');
  root.classList.add('piecewise');
  const st = { p: 0, x: 120, grid: true, labs: true };

  // lo/hi：该段左/右端点是否闭（决定实心/空心点）；k：斜率标签（衔接分析用）
  const PRESETS = [
    { name: '邮资台阶', xLab: 'x (g)', yLab: 'y (元)',
      xa: -40, xb: 560, ya: -3, yb: 30, gx: 50, gy: 4, smin: 0, smax: 500, sstep: 1, init: 120,
      xt: [0, 100, 200, 300, 400, 500], yt: [0, 8, 16, 24],
      pieces: [
        { a: 0, b: 100, lo: 0, hi: 1, f: () => 8, k: '0' },
        { a: 100, b: 200, lo: 0, hi: 1, f: () => 12, k: '0' },
        { a: 200, b: 300, lo: 0, hi: 1, f: () => 16, k: '0' },
        { a: 300, b: 400, lo: 0, hi: 1, f: () => 20, k: '0' },
        { a: 400, b: 500, lo: 0, hi: 1, f: () => 24, k: '0' },
      ], breaks: [100, 200, 300, 400],
      seg: pc => `(${pc.a}, ${pc.b}] g` },
    { name: '累计税额', xLab: 'x (元)', yLab: 'y (元)',
      xa: -1000, xb: 26000, ya: -200, yb: 3800, gx: 2500, gy: 1000, smin: 0, smax: 25000, sstep: 10, init: 5000,
      xt: [0, 5000, 10000, 15000, 20000, 25000], yt: [0, 1000, 2000, 3000],
      pieces: [
        { a: 0, b: 3000, lo: 1, hi: 1, f: x => 0.03 * x, k: '3%' },
        { a: 3000, b: 12000, lo: 0, hi: 1, f: x => 90 + 0.10 * (x - 3000), k: '10%' },
        { a: 12000, b: 25000, lo: 0, hi: 1, f: x => 990 + 0.20 * (x - 12000), k: '20%' },
      ], breaks: [3000, 12000],
      seg: pc => `${pc.lo ? '[' : '('}${pc.a}, ${pc.b}] · ${pc.k}` },
    { name: '$|x-1|+2$', xLab: 'x', yLab: 'y', iso: 1,
      xa: -3.4, xb: 5.4, ya: -1, yb: 7, gx: 1, gy: 1, smin: -3, smax: 5, sstep: 0.05, init: -0.5,
      xt: [-3, -2, -1, 1, 2, 3, 4, 5], yt: [0, 2, 4, 6],
      pieces: [
        { a: -Infinity, b: 1, lo: 1, hi: 0, f: x => 3 - x, tag: 'y = 3−x', k: '−1' },
        { a: 1, b: Infinity, lo: 1, hi: 1, f: x => x + 1, tag: 'y = x+1', k: '+1' },
      ], breaks: [1],
      seg: pc => `x${pc.hi ? ' ≥ 1' : ' < 1'}：${pc.tag}` },
  ];
  // 各预设的取景：①② 双比例尺吃满画框（量纲不同的数据图）；③ 等单位（V 形两臂严格 45°）
  const MAPS = PRESETS.map(P => P.iso ? B.isoFit(P.xa, P.xb, P.ya, P.yb)
    : (() => {
      const px = x => 70 + (x - P.xa) / (P.xb - P.xa) * (W - 140);
      const py = y => H - 52 - (y - P.ya) / (P.yb - P.ya) * (H - 92);
      return { px, py, X0: P.xa, X1: P.xb, Y0: P.ya, Y1: P.yb };
    })());
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);

  const cSeg = B.chip('当前段'), cY = B.readout('函数值'), cBp = B.readout('最近分界点', 'gold');
  const pieceAt = (P, x) => P.pieces.find(pc => (pc.lo ? x >= pc.a : x > pc.a) && (pc.hi ? x <= pc.b : x < pc.b));

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { gold, mint, blue, orange, paper, rule } = B.diagramColors;
    B.grid({ ...M, sx: P.gx, sy: P.gy, xt: P.xt, yt: P.yt,
      axLab: P.xLab, ayLab: P.yLab, grid: st.grid, labs: st.labs });
    const act = pieceAt(P, st.x);
    for (const pc of P.pieces) {
      // 两条绝对值射线延伸至图窗上沿；图窗边缘不画函数端点。
      const a = Number.isFinite(pc.a) ? pc.a : Math.max(M.X0, 3 - P.yb);
      const b = Number.isFinite(pc.b) ? pc.b : Math.min(M.X1, P.yb - 1);
      B.seg(V(px(a), py(pc.f(a))), V(px(b), py(pc.f(b))), {
        stroke: pc === act ? gold : blue, 'stroke-width': pc === act ? 3 : 2,
      });
    }
    if (act) {
      const point = V(px(st.x), py(act.f(st.x)));
      const guide = { stroke: rule, 'stroke-dasharray': '3 5' };
      B.seg(V(point.x, py(0)), point, guide);
      B.seg(V(px(0), point.y), point, guide);
    }

    function endpoint(x, y, closed) {
      if (!closed) B.dot(V(px(x), py(y)), 4.2, { fill: paper, stroke: orange, 'stroke-width': 1.8 });
      else if (x !== st.x) B.dot(V(px(x), py(y)), 3.6, { fill: gold });
    }
    const first = P.pieces[0], last = P.pieces.at(-1);
    if (Number.isFinite(first.a)) endpoint(first.a, first.f(first.a), first.lo);
    if (Number.isFinite(last.b)) endpoint(last.b, last.f(last.b), last.hi);
    P.breaks.forEach((bp, i) => {
      const left = P.pieces[i], right = P.pieces[i + 1];
      endpoint(bp, left.f(bp), left.hi || left.f(bp) === right.f(bp));
      if (left.f(bp) !== right.f(bp)) endpoint(bp, right.f(bp), right.lo);
    });
    if (act) {
      glowDot(B, V(px(st.x), py(act.f(st.x))), mint, 9, 4);
      cSeg(P.seg(act));
      cY(`$f(${st.x})=${Number(act.f(st.x).toFixed(2))}$${P.iso ? '' : ' 元'}`, 'ok');
    } else {
      cSeg('0 g 不属于首档', 'warn');
      cY('无定义', 'warn');
    }

    const bp = P.breaks.reduce((best, x) => Math.abs(x - st.x) < Math.abs(best - st.x) ? x : best);
    const i = P.breaks.indexOf(bp), left = P.pieces[i], right = P.pieces[i + 1];
    const yL = left.f(bp), yR = right.f(bp);
    if (yL === yR) cBp(`x = ${bp} 处两段接于 (${bp}, ${yL})，斜率由 ${left.k} 变为 ${right.k}。`);
    else cBp(`${bp} g 取 ${yL} 元，刚超过 ${bp} g 则取 ${yR} 元。`);
  };

  const sl = B.slider('探针 x', 0, 500, 1, st.x, v => { st.x = v; B.render(); });
  B.btn('下一分界点', () => {
    const { breaks } = PRESETS[st.p];
    st.x = breaks.find(x => x > st.x) ?? breaks[0];
    sl.sync(st.x);
    B.render();
  });
  B.graphToggles(st, ['grid', 'labs']);
  functionPicker(root, PRESETS.map(p => p.name), i => {
    const P = PRESETS[i];
    st.p = i;
    st.x = P.init;
    sl.min = P.smin; sl.max = P.smax; sl.step = P.sstep;
    sl.sync(st.x);
    B.render();
  });
  B.render();
  return B;
}
