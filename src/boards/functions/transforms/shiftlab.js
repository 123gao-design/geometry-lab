/* 图 G1 · 平移读写机：y=f(x−h)+k —— 横移加在内层（输入端）、竖移加在外层（输出端）。
   「左加右减」不是口诀是补偿：要在 x=h 处才读到原来 x=0 的输出 —— 输入端反向记录。
   探针 P 锁在原图上，P′=(x₀+h, y₀+k) 跟着走：先横后竖的分解路径把 (h,k) 画成看得见的向量。
   原图三选：√x（起笔 (0,0)）、x²（顶点 (0,0)）、e^x（不对称 + 渐近线 y=0 随手平移）。
   回收：C5 机器观（f(x)+k 竖走 vs f(x+h) 横走）在这里全量核验；E8 的折缝是 k=0 的特例。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new Board(root, W, H);

  const BASES = [
    { name: '$\\sqrt{x}$', f: x => Math.sqrt(x), tex: (s, kk) => `\\sqrt{${s}}${kk}`, box: [-2.6, 6.4, -2.2, 5.2], anch: [[0, 0], [1, 1], [4, 2]], asym: [] },
    { name: '$x^2$', f: x => x * x, tex: (s, kk) => `(${s})^2${kk}`, box: [-3.6, 5.4, -2.4, 6.4], anch: [[0, 0], [1, 1], [-1, 1]], asym: [] },
    { name: '$e^x$', f: x => Math.exp(x), tex: (s, kk) => `e^{${s}}${kk}`, box: [-3.2, 5.8, -1.6, 7.2], anch: [[0, 1], [1, Math.E]], asym: [[0, 0]] },
  ];
  const MAPS = BASES.map(P => B.isoFit(...P.box));
  const st = { p: 0, h: 0, k: 0, x: 1, grid: true, labs: true, asym: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);

  const cE = B.chipM('解析式'), cP = B.chipM('坐标核验'), cD = B.chipM('方向判读'), cS = B.chipM('一句记法');

  B.renderFn = () => {
    const P = BASES[st.p], M = MAPS[st.p];
    const { X0, X1, Y0, Y1 } = M;
    const f = P.f, { h, k } = st;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym) for (const [, y] of P.asym) { B.asym(M, [{ h: y }]); B.asym(M, [{ h: y + k }]); }   // 原图渐近线 y=0 与像渐近线 y=k
    // 原图（蓝淡）+ 像（金粗）：锚点并进采样（原图特征点 + 像特征点都要踩准）
    const drawC = (g, anchors, at) => {
      const xs = [];
      for (let u = M.X0; u <= M.X1 + 0.001; u += 0.04) xs.push(u);
      for (const [ax] of anchors) xs.push(ax, ax + h);
      xs.sort((m, n) => m - n);
      let d = '', pen = false;
      for (const u of xs) {
        const y = g(u);
        if (isFinite(y) && y > Y0 && y < Y1) { d += (pen ? 'L' : 'M') + px(u).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
        pen = false;
      }
      mk('path', { d, fill: 'none', ...at }, B.dyn);
    };
    drawC(f, P.anch, { stroke: '#5cadff', 'stroke-width': 1.8, 'stroke-opacity': .55 });
    drawC(x => f(x - h) + k, P.anch, { stroke: '#ffd166', 'stroke-width': 2.4 });
    // 特征点：原图灰小、像金小
    for (const [ax, ay] of P.anch) {
      if (ax > X0 && ax < X1 && ay > Y0 && ay < Y1) B.dot(V(px(ax), py(ay)), 3.5, { fill: '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1.1 });
      const bx = ax + h, by = ay + k;
      if (bx > X0 && bx < X1 && by > Y0 && by < Y1) B.dot(V(px(bx), py(by)), 4, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    }
    // 探针 P（原图）→ P′（像）：先横后竖分解
    const x0 = st.x, y0 = f(x0), x1 = x0 + h, y1 = y0 + k;
    if (isFinite(y0) && y0 > Y0 && y0 < Y1) {
      B.dot(V(px(x0), py(y0)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
      if (x1 > X0 && x1 < X1 && y1 > Y0 && y1 < Y1) {
        B.seg(V(px(x0), py(y0)), V(px(x1), py(y0)), { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-dasharray': '4 4', 'stroke-opacity': .75 });
        B.seg(V(px(x1), py(y0)), V(px(x1), py(y1)), { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-dasharray': '4 4', 'stroke-opacity': .75 });
        B.seg(V(px(x0), py(y0)), V(px(x1), py(y1)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-opacity': .5 });
        if (Math.abs(h) > 0.4) B.tex(V(px((x0 + x1) / 2), py(y0) + 13), `$h=${fmt(h, 2)}$`, { size: 11, color: '#ff9e4a', anchor: 'mid', w: 70 });
        if (Math.abs(k) > 0.4) B.tex(V(px(x1) + 8, py((y0 + y1) / 2)), `$k=${fmt(k, 2)}$`, { size: 11, color: '#ff9e4a', anchor: 'start', w: 70 });
        B.dot(V(px(x1), py(y1)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
      }
    }
    B.tex(V(14, 18), `$y=${P.tex(`x ${h >= 0 ? '-' : '+'} ${fmt(Math.abs(h), 2)}`, (k >= 0 ? '+' : '-') + fmt(Math.abs(k), 2))}$ —— 原图 ${P.name}（蓝淡）与平移后的像（金）`, { size: 13, color: '#93a1b5', anchor: 'start', w: 520 });
    // 徽章
    cE(`$y=${P.tex(`x ${h >= 0 ? '-' : '+'} ${fmt(Math.abs(h), 2)}`, (k >= 0 ? '+' : '-') + fmt(Math.abs(k), 2))}$：横移 $h$ 写进括号里、竖移 $k$ 写在函数外`, '');
    cP(isFinite(y0) ? `P $(${fmt(x0, 2)},\\ ${fmt(y0, 2)}) \\to$ P′ $(${fmt(x1, 2)},\\ ${fmt(y1, 2)})$ —— 横坐标加 $h$、纵坐标加 $k$，全体点一起平移` : '探针落在定义域外 —— 拖回有效区', isFinite(y0) ? '' : 'warn');
    const hs = h === 0 ? 'h=0 不横移' : `$x ${h >= 0 ? '-' : '+'} ${fmt(Math.abs(h), 2)}$：向${h > 0 ? '右' : '左'}平移 ${fmt(Math.abs(h), 2)}`;
    const ks = k === 0 ? 'k=0 不竖移' : `${k >= 0 ? '上' : '下'}移 ${fmt(Math.abs(k), 2)}（外层直接加）`;
    cD(`${hs}；${ks}${h === 0 ? '' : ' —— 输入端补偿：在 x=' + fmt(h, 2) + ' 处才读到原来 x=0 的输出'}`, h * k >= 0 && (h !== 0 || k !== 0) ? 'ok' : '');
    cS('竖移加在 f 外面（输出端升降机）、横移加在 f 里面（输入端传送带）—— 「左加右减」是补偿方向，不是玄学', '');
  };

  const setP = (h, k) => { st.h = h; st.k = k; slH.sync(h); slK.sync(k); B.render(); };
  B.btnM('① 右 2 上 1', () => setP(2, 1), { pri: true, on: true });
  B.btnM('② 左 3', () => setP(-3, 0));
  B.btnM('③ 下 2', () => setP(0, -2));
  B.btnM('④ 复位', () => setP(0, 0));
  const bb = BASES.map((P, i) => B.btnM(P.name, () => {
    st.p = i; st.x = i === 0 ? 1 : i === 1 ? 1 : 0;
    bb.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const slH = B.slider('横移 h', -3, 3, 0.1, 0, v => { st.h = v; B.render(); });
  const slK = B.slider('竖移 k', -3, 3, 0.1, 0, v => { st.k = v; B.render(); });
  const hp = B.handle({
    get: () => V(px(st.x), py(BASES[st.p].f(st.x))),
    set: p => {
      const M = MAPS[st.p];
      let x = M.X0 + (p.x / W) * (M.X1 - M.X0);
      const lo = st.p === 0 ? Math.max(M.X0, 0) : M.X0;
      st.x = Math.max(lo + 0.05, Math.min(M.X1 - 0.05, x));
    },
    color: '#ff9e4a', r: 6, label: 'P', lo: [-14, -14],
  });
  B.graphToggles(st);
  B.hint('探针 P 锁在原图上、金点 P′ 是它的像：橙色分解路径先横 h 后竖 k —— 全体点平移同一个向量');
  B.render();
  return B;
}
