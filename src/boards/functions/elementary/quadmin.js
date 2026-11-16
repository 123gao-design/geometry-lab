/* 图 E2 · 区间最值机：二次函数在闭区间 [p,q] 上的最值 —— 「定轴动区间」与「动轴定区间」双动态。
   ① 动区间：f=x²，把手 p、q 拖区间；② 动轴：f=¼(x−t)²，滑块 t 拖顶点、区间 [1,4] 固定；③ 开口向下 f=1−(x−1)²。
   判定口诀：轴在区间内 → 开口向上 min 在顶点（向下 max 在顶点）；轴在外 → 近端点取最值；另一头必在端点（距轴较远者）。
   图象规范：B.isoFit 等单位；顶点/端点为必采锚点；区间色带压在图象下。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);

  // dyn：t 参数驱动（②）；drag：把手拖区间（①③）；vx 顶点横坐标（② 用 t 表达）
  const PRESETS = [
    { name: '① 定轴动区间 $f=x^2$', dyn: null, drag: true, vx0: 0, p: -1, q: 2,
      f: x => x * x, a: 1, box: [-3.2, 3.4, -0.8, 8.2] },
    { name: '② 动轴定区间 $\\dfrac{1}{4}(x-t)^2$', dyn: { lab: '顶点 t', min: 0, max: 5.2, v0: 1.8 }, drag: false, vx0: null, p: 1, q: 4,
      f: x => 0, a: 0.25, box: [-0.6, 4.8, -0.6, 5.2],   // f 由 t 现算（见 renderFn）
      fx: (x, t) => 0.25 * (x - t) * (x - t), vx: t => t },
    { name: '③ 开口向下 $1-(x-1)^2$', dyn: null, drag: true, vx0: 1, p: 0.5, q: 2.5,
      f: x => 1 - (x - 1) * (x - 1), a: -1, box: [-1.2, 3.2, -2.4, 1.6] },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, t: 1.8, a: -1, b: 2, grid: true, labs: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cI = B.chipM('区间'), cV = B.chipM('顶点'), cN = B.chipM('最小值'), cX = B.chipM('最大值'), cJ = B.chipM('判定');

  const F = (P, x) => (P.vx ? P.fx(x, st.t) : P.f(x));
  const VX = P => (P.vx ? P.vx(st.t) : P.vx0);
  /** 区间 [p,q] 上的最值判定：返回 {n:[x,y], x:[x,y]}（min/max 位点）与判定文案素材 */
  function judge(P, p, q) {
    const vx = VX(P), up = P.a > 0;
    const inV = vx >= p - 1e-9 && vx <= q + 1e-9;
    const far = Math.abs(p - vx) >= Math.abs(q - vx) ? p : q;   // 距轴远端点
    const near = far === p ? q : p;
    let n, xM, vn, vxm;
    if (up) {
      n = inV ? [vx, F(P, vx)] : [near, F(P, near)];
      xM = [far, F(P, far)];
      vn = inV ? `轴 $x*=${fmt(vx, 2)}$ 在区间内：min 在顶点` : `轴在区间${vx < p ? '左外' : '右外'}：min 由近端点 ${vx < p ? 'p' : 'q'} 取`;
      vxm = `max 必在端点：${Math.abs(p - vx) === Math.abs(q - vx) ? '两端等高，任取其一' : '由距轴较远者取'}`;
    } else {
      xM = inV ? [vx, F(P, vx)] : [near, F(P, near)];
      n = [far, F(P, far)];
      vn = inV ? `开口向下、轴在区间内：max 在顶点` : `开口向下、轴在区间外：max 由近端点取`;
      vxm = `min 必在端点：距轴较远者压得更低`;
    }
    return { n, xM, vn, vxm, inV, vx };
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { X0, X1, Y0, Y1 } = M;
    const p = P.drag ? Math.min(st.a, st.b) : P.p, q = P.drag ? Math.max(st.a, st.b) : P.q;
    const vx = VX(P), fv = F(P, vx);
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    // 区间色带 + 边界虚线 + 端点/顶点
    mk('rect', { x: px(p), y: py(Y1), width: px(q) - px(p), height: py(Y0) - py(Y1),
      fill: 'rgba(92,173,255,.05)', stroke: 'none' }, B.dyn);
    B.seg(V(px(p), py(Y0)), V(px(p), py(Y1)), { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-dasharray': '4 5' });
    B.seg(V(px(q), py(Y0)), V(px(q), py(Y1)), { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-dasharray': '4 5' });
    if (vx > X0 && vx < X1) B.seg(V(px(vx), py(Y0)), V(px(vx), py(Y1)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 6', 'stroke-opacity': .55 });
    // 曲线：顶点与 p、q 为必采锚点
    const xs = [];
    for (let u = M.X0; u <= M.X1 + 0.001; u += 0.04) xs.push(u);
    for (const a of [vx, p, q]) if (a > X0 && a < X1) xs.push(a);
    xs.sort((m, n) => m - n);
    let d = '', pen = false;
    for (const u of xs) {
      const y = F(P, u);
      if (y > Y0 && y < Y1) { d += (pen ? 'L' : 'M') + px(u).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    B.dot(V(px(vx), py(fv)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    for (const ex of [p, q]) {
      const ey = F(P, ex);
      if (ey > Y0 && ey < Y1) B.dot(V(px(ex), py(ey)), 4.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });
    }
    // 最值位点（min 绿、max 红）+ 数值标签
    const J = judge(P, p, q);
    for (const [pt, cc, lab] of [[J.n, '#4ade80', 'min'], [J.xM, '#ff7b8a', 'max']])
      if (pt[0] > X0 && pt[0] < X1 && pt[1] > Y0 && pt[1] < Y1) {
        B.dot(V(px(pt[0]), py(pt[1])), 5.5, { fill: cc, stroke: '#0a0d14', 'stroke-width': 1.5 });
        B.tex(V(px(pt[0]), py(pt[1]) + (cc === '#4ade80' ? 20 : -20)), `$(${fmt(pt[0], 2)},\\ ${fmt(pt[1], 2)})$`, { size: 11, color: cc, anchor: 'mid', w: 110 });
      }
    B.tex(V(14, 18), P.vx ? `$f(x)=\\dfrac{1}{4}(x-${fmt(st.t, 2)})^2$，区间 $[1,4]$ 固定 —— 拖顶点` : (P.a > 0 ? `$f(x)=x^2$，轴 $x=0$ 固定 —— 拖把手 p、q` : `$f(x)=1-(x-1)^2$ —— 开口向下，判定完全对调`), { size: 13, color: '#93a1b5', anchor: 'start', w: 420 });
    // 徽章
    cI(`$[${fmt(p, 2)},\\ ${fmt(q, 2)}]$`, '');
    cV(`$x*=${fmt(vx, 2)}$，$f(x*)=${fmt(fv, 2)}$${J.inV ? '（轴在区间内）' : '（轴在区间外）'}`, J.inV ? 'ok' : '');
    cN(`min $=f(${fmt(J.n[0], 2)})=${fmt(J.n[1], 2)}$ —— ${J.n[0] === vx ? '顶点' : '端点'}`, '');
    cX(`max $=f(${fmt(J.xM[0], 2)})=${fmt(J.xM[1], 2)}$ —— ${J.xM[0] === vx ? '顶点' : '端点'}`, '');
    cJ(`${J.vn}；${J.vxm}`, J.inV ? 'ok' : '');
  };

  // 区间把手（①③）：锁在 x 轴上拖，p 在左 q 在右、不许越过对方（间隔 0.4 保序）
  const hp = B.handle({
    get: () => V(px(st.a), py(0)), set: p => {
      const bx = PRESETS[st.p].box;
      let x = MAPS[st.p].X0 + (p.x / W) * (MAPS[st.p].X1 - MAPS[st.p].X0);
      st.a = Math.max(bx[0] + 0.2, Math.min(st.b - 0.4, x));
    },
    color: '#ff9e4a', r: 6.5, label: 'p', lo: [8, 16],
  });
  const hq = B.handle({
    get: () => V(px(st.b), py(0)), set: p => {
      const bx = PRESETS[st.p].box;
      let x = MAPS[st.p].X0 + (p.x / W) * (MAPS[st.p].X1 - MAPS[st.p].X0);
      st.b = Math.max(st.a + 0.4, Math.min(bx[1] - 0.2, x));
    },
    color: '#ff9e4a', r: 6.5, label: 'q', lo: [-16, 16],
  });
  const setDragVisible = v => {
    for (const h of [B.handles[0], B.handles[1]]) {
      h.c.style.display = v ? '' : 'none';
      if (h.lbl) h.lbl.style.display = v ? '' : 'none';
    }
  };

  const btns = PRESETS.map((P, i) => B.btnM(P.name, () => {
    st.p = i;
    if (P.drag) { st.a = P.p; st.b = P.q; }
    if (P.dyn) { st.t = P.dyn.v0; slT.sync(P.dyn.v0); }
    setDragVisible(P.drag);
    slT.style.display = P.dyn ? '' : 'none';
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  let slT = null;
  for (const P of PRESETS) if (P.dyn)
    slT = B.slider(P.dyn.lab, P.dyn.min, P.dyn.max, 0.05, P.dyn.v0, v => { st.t = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('口诀：轴在区间内顶点定最值，轴在外近端点取最值；另一头必在端点 —— 由距轴较远者取最值（③ 开口向下时全部对调）');
  B.render();
  return B;
}
