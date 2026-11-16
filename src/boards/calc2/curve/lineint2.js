/* 图 线2 · 第二类曲线积分机（对坐标）
   向量场 F=(0,x)：方向竖直向上、大小随横坐标变大。质点沿曲线从 A 走到 B，
   做功 W=∫_C P dx+Q dy=∫_C x dy。三条路径对照：
   ① 上半圆 A→B　② 沿 x 轴的直线段　③ 整圆回到 A。
   同一个场、同一对端点，功不同（①与②），闭合一圈也不为零（③）——这与第一类的弧长积分正相反。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const P = (x, y) => 0, Q = (x, y) => x;              // F=(0,x)
const PATHS = [
  { n: '① 上半圆 $A\\to B$', pt: (u, R) => [R * Math.cos(Math.PI * u), R * Math.sin(Math.PI * u)], dxdu: (u, R) => -R * Math.PI * Math.sin(Math.PI * u), dydu: (u, R) => R * Math.PI * Math.cos(Math.PI * u), lab: ['A', 'B'] },
  { n: '② 沿 $x$ 轴的直线段', pt: (u, R) => [R - 2 * R * u, 0], dxdu: (u, R) => -2 * R, dydu: () => 0, lab: ['A', 'B'] },
  { n: '③ 整圆，回到 $A$', pt: (u, R) => [R * Math.cos(2 * Math.PI * u), R * Math.sin(2 * Math.PI * u)], dxdu: (u, R) => -2 * R * Math.PI * Math.sin(2 * Math.PI * u), dydu: (u, R) => 2 * R * Math.PI * Math.cos(2 * Math.PI * u), lab: ['A', 'A'] },
];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, R: 1.4, u: 0.42, dir: 1 };
  const cP = B.chipM('当前点'), cI = B.chipM('被积式'), cW = B.chipM('累计功'), cT = B.chipM('全程功'), cJ = B.chipM('判读');
  const mL = B.isoFit(-2.25, 2.25, -2.25, 2.25, [26, 18, 452, 410], 16);
  const mR = B.mapFit(0, 1.02, -14.5, 14.5, [528, 60, 264, 300], 20);

  const integrand = (k, u, R) => {
    const S = PATHS[k], [x, y] = S.pt(u, R);
    return P(x, y) * S.dxdu(u, R) + Q(x, y) * S.dydu(u, R);
  };
  const cumul = (k, u, R) => {
    const N = 200; let s = 0;
    for (let i = 0; i < N; i++) s += integrand(k, (i + 0.5) / N * u, R) * u / N;
    return s;
  };

  B.renderFn = () => {
    const R = st.R, S = PATHS[st.k], u = st.u;
    const uu = st.dir > 0 ? u : 1 - u;                 // 反向走时参数从另一端数
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 0.5, ly: 0.5 });

    // 场的箭头（稀疏网格）
    for (let gx = -1.6; gx <= 1.61; gx += 0.8) {
      for (let gy = -1.6; gy <= 1.61; gy += 0.8) {
        if (Math.abs(gx) < 0.15) continue;
        const a = V(mL.px(gx), mL.py(gy)), b = V(mL.px(gx), mL.py(gy + 0.26 * gx));
        B.arrow(a, b, { stroke: '#3f5f8f', 'stroke-width': 1.1, 'stroke-opacity': .85, head: 7, wide: 3.4 });
      }
    }

    // 路径
    const pts = [];
    for (let i = 0; i <= 160; i++) { const [x, y] = S.pt(i / 160, R); pts.push(V(mL.px(x), mL.py(y))); }
    for (let i = 1; i < pts.length; i++) B.seg(pts[i - 1], pts[i], { stroke: '#5cadff', 'stroke-width': 2.8, 'stroke-opacity': .55 });
    const done = [];
    const a0 = st.dir > 0 ? 0 : 1 - u, a1 = st.dir > 0 ? u : 1;
    for (let i = 0; i <= 160; i++) { const [x, y] = S.pt(a0 + (a1 - a0) * i / 160, R); done.push(V(mL.px(x), mL.py(y))); }
    for (let i = 1; i < done.length; i++) B.seg(done[i - 1], done[i], { stroke: '#5cadff', 'stroke-width': 4.2 });
    const pA = S.pt(0, R), pB = S.pt(1, R);
    B.dot(V(mL.px(pA[0]), mL.py(pA[1])), 5, { fill: '#4ade80', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.dot(V(mL.px(pB[0]), mL.py(pB[1])), 5, { fill: '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.tex(V(mL.px(pA[0]) + 8, mL.py(pA[1]) + 14), S.lab[0], { size: 12.5, color: '#4ade80', w: 20 });
    if (st.k !== 2) B.tex(V(mL.px(pB[0]) - 20, mL.py(pB[1]) + 14), S.lab[1], { size: 12.5, color: '#c084fc', w: 20 });

    // 当前点：切向与场的投影
    const [x, y] = S.pt(uu, R);
    const dx = S.dxdu(uu, R) * st.dir, dy = S.dydu(uu, R) * st.dir, ln = Math.hypot(dx, dy) || 1;
    const tx = dx / ln, ty = dy / ln;
    const p = V(mL.px(x), mL.py(y));
    const fEnd = V(mL.px(x), mL.py(y + 0.55 * x));
    B.arrow(p, fEnd, { stroke: '#ff9e4a', 'stroke-width': 2, head: 10, wide: 4.5 });
    const tEnd2 = V(mL.px(x + 0.42 * tx), mL.py(y + 0.42 * ty));
    B.arrow(p, tEnd2, { stroke: '#4ade80', 'stroke-width': 1.8, head: 9, wide: 4 });
    B.dot(p, 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(p.x + 8, p.y - 14), '$P$', { size: 12.5, color: '#ffd166', w: 20 });

    // 右栏：累计功随行进进度 u 的曲线
    B.grid({ ...mR, sx: 0.25, sy: 4, lx: 0.5, ly: 4, axLab: 'u', ayLab: 'W' });
    const Wof = pp => st.dir > 0 ? cumul(st.k, pp, R) : cumul(st.k, 1 - pp, R) - cumul(st.k, 1, R);
    const cw = [];
    for (let i = 0; i <= 100; i++) { const pp = i / 100; cw.push(V(mR.px(pp), mR.py(Wof(pp)))); }
    for (let i = 1; i < cw.length; i++) B.seg(cw[i - 1], cw[i], { stroke: '#c084fc', 'stroke-width': 2.4 });
    B.seg(V(mR.px(0), mR.py(0)), V(mR.px(1), mR.py(0)), { stroke: '#8fa3bd', 'stroke-width': 1.1, 'stroke-opacity': .7 });
    B.dot(V(mR.px(u), mR.py(Wof(u))), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });

    const tot = Wof(1);
    cP(`$(${fmt(x, 2)},\\ ${fmt(y, 2)})$`);
    cI(`$x\\,dy=${fmt(Q(x, y) * S.dydu(uu, R) * st.dir, 3)}\\,du$`);
    cW(`$${fmt(Wof(u), 3)}$`);
    cT(`$${fmt(tot, 3)}$`, Math.abs(tot) < 1e-9 ? 'ok' : '');
    if (st.k === 1) cJ('沿 $x$ 轴走时 $dy=0$，全程做功为 0：这个场只在竖直方向施力', 'ok');
    else if (st.k === 2) cJ('绕一整圈回到起点，功仍不为零，所以这个场不是保守场', 'warn');
    else cJ('同一个场，半圆走的功与直线不同：第二类积分与路径有关', 'warn');
  };

  const bts = PATHS.map((S, i) => B.btnM(S.n, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('半径 R', 1.0, 1.6, 0.02, st.R, v => { st.R = v; B.render(); }, 'R');
  B.slider('点 P 的位置 u', 0, 1, 0.01, st.u, v => { st.u = v; B.render(); }, 'u');
  B.btn('反向走（功变号）', () => { st.dir = -st.dir; B.render(); });
  B.hintM('金色箭是质点位置，橙箭是场力，绿箭是切向：橙箭在绿箭上的分量才做功');
  B.render();
  return B;
}
