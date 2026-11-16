/* 图 C4 · 阶梯台：分段函数的三种形式 —— 跳变（邮资）、折线衔接（个税）、解析式分段（|x−1|+2）
   看点：分段点的实心/空心点由区间开闭决定；跳变还是连惯，拖探针到分段点直接验明。
   图象规范：①② 横纵是克/元两种量纲，各用各的比例尺（如实标注刻度）；③ 纯数学函数用 B.isoFit 等单位取景。
   网格 / 轴标注 两开关可隐藏。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);
  const st = { p: 0, x: 120, grid: true, labs: true };

  // lo/hi：该段左/右端点是否闭（决定实心/空心点）；k：斜率标签（衔接分析用）
  const PRESETS = [
    { name: '① 邮资（跳变）', xLab: '重量 x (g)', yLab: '邮资 y (元)',
      xa: -40, xb: 560, ya: -3, yb: 30, gx: 50, gy: 4, smin: 0, smax: 500, sstep: 1, init: 120, prec: 0, fy: 0,
      xt: [0, 100, 200, 300, 400, 500], yt: [0, 8, 16, 24],
      pieces: [
        { a: 0, b: 100, lo: 0, hi: 1, f: () => 8, tag: '8 元', k: 'k=0' },
        { a: 100, b: 200, lo: 0, hi: 1, f: () => 12, tag: '12 元', k: 'k=0' },
        { a: 200, b: 300, lo: 0, hi: 1, f: () => 16, tag: '16 元', k: 'k=0' },
        { a: 300, b: 400, lo: 0, hi: 1, f: () => 20, tag: '20 元', k: 'k=0' },
        { a: 400, b: 500, lo: 0, hi: 1, f: () => 24, tag: '24 元', k: 'k=0' },
      ], breaks: [100, 200, 300, 400],
      seg: pc => `x∈(${pc.a}, ${pc.b}]：${pc.tag}（不足 100g 按 100g 计）` },
    { name: '② 个税（折线衔接）', xLab: '应税收入 x (元)', yLab: '税额 y (元)',
      xa: -1000, xb: 26000, ya: -200, yb: 3800, gx: 2500, gy: 1000, smin: 0, smax: 25000, sstep: 10, init: 5000, prec: 0, fy: 0,
      xt: [0, 5000, 10000, 15000, 20000, 25000], yt: [0, 1000, 2000, 3000],
      pieces: [
        { a: 0, b: 3000, lo: 1, hi: 1, f: x => 0.03 * x, tag: '斜率 3%', k: '3%' },
        { a: 3000, b: 12000, lo: 0, hi: 1, f: x => 90 + 0.10 * (x - 3000), tag: '斜率 10%', k: '10%' },
        { a: 12000, b: 25000, lo: 0, hi: 1, f: x => 990 + 0.20 * (x - 12000), tag: '斜率 20%', k: '20%' },
      ], breaks: [3000, 12000],
      seg: pc => `x∈${pc.lo ? '[' : '('}${pc.a}, ${pc.b}]：斜率 ${pc.k}` },
    { name: '③ $|x-1|+2$', xLab: 'x', yLab: 'y', iso: 1,
      xa: -3.4, xb: 5.4, ya: -1, yb: 7, gx: 1, gy: 1, smin: -3, smax: 5, sstep: 0.05, init: -0.5, prec: 1, fy: 2,
      xt: [-3, -2, -1, 1, 2, 3, 4, 5], yt: [0, 2, 4, 6],
      pieces: [
        { a: -3.4, b: 1, lo: 1, hi: 0, f: x => 3 - x, tag: 'y = 3−x', k: '−1' },
        { a: 1, b: 5.4, lo: 1, hi: 1, f: x => x + 1, tag: 'y = x+1', k: '+1' },
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

  const cSeg = B.chip('当前段'), cY = B.chip('y 值'), cBp = B.chip('分段点');
  const EPS = 1e-9;
  const pieceAt = (P, x) => P.pieces.find(pc => (pc.lo ? x >= pc.a : x > pc.a) && (pc.hi ? x <= pc.b : x < pc.b));

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    // 网格 + 坐标轴 + 刻度（gx/gy 为网格步长，xt/yt 为显式刻度）
    B.grid({ ...M, sx: P.gx, sy: P.gy, xt: P.xt, yt: P.yt, grid: st.grid, labs: st.labs });
    B.text(V(px(P.xb) - 4, py(0) + 32), P.xLab, { 'font-size': 11.5, fill: '#93a1b5', 'text-anchor': 'end' });
    B.text(V(px(0) + 10, py(P.yb) + 20), P.yLab, { 'font-size': 11.5, fill: '#93a1b5', 'text-anchor': 'start' });
    // 分段折线：当前段高亮金色，其余蓝
    const act = pieceAt(P, st.x);
    for (const pc of P.pieces) {
      B.seg(V(px(pc.a), py(pc.f(pc.a))), V(px(pc.b), py(pc.f(pc.b))), {
        stroke: pc === act ? '#ffd166' : '#5cadff', 'stroke-width': pc === act ? 2.8 : 2.2,
      });
      B.text(V(px((pc.a + pc.b) / 2), py(pc.f((pc.a + pc.b) / 2)) - 14), pc.tag, { 'font-size': 11.5, fill: pc === act ? '#ffd166' : '#93a1b5' });
    }
    // 分段点端点：两侧值不同 → 按开闭画实心/空心（跳变）；值相同 → 单个实心点（连惯）
    for (let i = 0; i < P.breaks.length; i++) {
      const bp = P.breaks[i], L = P.pieces[i], R = P.pieces[i + 1];
      const yL = L.f(bp), yR = R.f(bp);
      if (Math.abs(yL - yR) < EPS) {
        B.dot(V(px(bp), py(yL)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
      } else {
        if (L.hi) B.dot(V(px(bp), py(yL)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
        if (!L.hi) B.dot(V(px(bp), py(yL)), 4.5, { fill: 'none', stroke: '#ff9e4a', 'stroke-width': 2.2 });
        if (R.lo) B.dot(V(px(bp), py(yR)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
        if (!R.lo) B.dot(V(px(bp), py(yR)), 4.5, { fill: 'none', stroke: '#ff9e4a', 'stroke-width': 2.2 });
      }
    }
    // 探针：虚线引到两轴 + 曲线上的落点
    if (act) B.probe(V(st.x, act.f(st.x)), M, { color: '#3f5f8f', dotColor: '#4ade80', 'stroke-width': 1, 'stroke-opacity': .75 });
    // 徽章
    if (act) {
      cSeg(P.seg(act), '');
      cY(`y = ${fmt(act.f(st.x), P.fy)}`, 'ok');
    } else {
      cSeg(`x = ${fmt(st.x, P.prec)} 不在任何一段 —— 开闭区间漏了它`, 'warn');
      cY('无定义', 'warn');
    }
    // 离哪个分段点近（≤14px）就说哪句
    let ni = -1, nd = 15;
    P.breaks.forEach((bp, i) => { const d = Math.abs(px(st.x) - px(bp)); if (d < nd) { nd = d; ni = i; } });
    if (ni >= 0) {
      const bp = P.breaks[ni], L = P.pieces[ni], R = P.pieces[ni + 1];
      const yL = L.f(bp), yR = R.f(bp);
      if (Math.abs(yL - yR) < EPS) cBp(`x=${fmt(bp, P.prec)}：左 ${fmt(yL, P.fy)} = 右 ${fmt(yR, P.fy)}，衔接连惯（斜率 ${L.k} → ${R.k} 突变）`, 'ok');
      else cBp(`x=${fmt(bp, P.prec)}：左 ${fmt(yL, P.fy)}（${L.hi ? '实心' : '空心'}）→ 右 ${fmt(yR, P.fy)}（${R.lo ? '实心' : '空心'}），跳 ${yR > yL ? '+' : ''}${fmt(yR - yL, P.fy)}`, 'warn');
    } else cBp('把 x 拖到分段点附近：跳变 or 连贯，直接验明', '');
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i; st.x = p.init;
    sl.setAttribute('min', p.smin); sl.setAttribute('max', p.smax); sl.setAttribute('step', p.sstep);
    sl.sync(p.init);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const sl = B.slider('自变量 x', 0, 500, 1, 120, v => { st.x = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('邮资的分段点跳 4 元：左段实心、右段空心；个税与 |x−1| 的分段点完全重合 —— 连贯，但斜率突变');
  B.render();
  return B;
}
