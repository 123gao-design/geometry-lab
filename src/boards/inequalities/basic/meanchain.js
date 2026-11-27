/* 图 基3 · 均值链机：调和 H ≤ 几何 G ≤ 算术 A ≤ 平方 Q
   同一对正数 a、b 的四条均值同排一轴：
   H=2ab/(a+b)（调和）、G=√(ab)（几何）、A=(a+b)/2（算术）、Q=√((a²+b²)/2)（平方）。
   a≠b 时四量依次排开，G²=AH 恒等（G 是 A、H 的几何中项）、Q²−A²=(a−b)²/4；
   a=b 时四量收缩到同一点。主数轴固定 [0,10] 保持真实量感，「放大」聚焦四量所在窗口，
   横坐标几像素内也能看清四个点的先后次序。「趋向相等」把 a、b 同拉到中点，观察四量逐一聚拢。
   局部坐标约定：u∈[0,860] 向右、v∈[0,480] 向下；主数轴 v=320、px(v)=90+70v；
   放大轴 v=185、pxz(v)=150+(v−wlo)/(whi−wlo)·620，窗口 wlo/whi 逐帧按四量重算。 */
import { InequalityBoard } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new InequalityBoard(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { a: 1, b: 9, zoom: true, labs: true };
  const cH = B.readout('调和 $H=\\tfrac{2ab}{a+b}$', 'mint');
  const cG = B.readout('几何 $G=\\sqrt{ab}$', 'green');
  const cA = B.readout('算术 $A=\\tfrac{a+b}{2}$', 'gold');
  const cQ = B.readout('平方 $Q=\\sqrt{\\tfrac{a^2+b^2}{2}}$', 'violet');
  const cJ = B.chipM('判读');
  const C = { H: '#67e8f9', G: '#4ade80', A: '#ffd166', Q: '#c084fc' };

  B.renderFn = () => {
    const { a, b } = st;
    const H = 2 * a * b / (a + b), G = Math.sqrt(a * b), A = (a + b) / 2, Q = Math.sqrt((a * a + b * b) / 2);
    const ms = [['H', H], ['G', G], ['A', A], ['Q', Q]];
    const lo = Math.min(...ms.map(m => m[1])), hi = Math.max(...ms.map(m => m[1]));
    const stacked = Math.abs(a - b) < 1e-9;
    // 标题与说明
    B.tex(V(430, 32), `$\\dfrac{2ab}{a+b}\\le\\sqrt{ab}\\le\\dfrac{a+b}{2}\\le\\sqrt{\\dfrac{a^2+b^2}{2}}$`, { size: 15.5, anchor: 'mid', w: 780 });

    // 主数轴 [0,10]
    const mpx = v => 90 + 70 * v;
    B.seg(V(80, 320), V(790, 320), { stroke: '#8fa3bd', 'stroke-width': 2 });
    for (let v = 0; v <= 10; v++) {
      B.seg(V(mpx(v), 320 - 4), V(mpx(v), 320 + 4), { stroke: '#93a1b5', 'stroke-width': 1.3 });
      // 刻度数字放在轴下方：点标签在轴上方，两行各占一处，不叠字
      B.text(V(mpx(v) + (v === 0 ? 4 : 0), 338), String(v), { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': v === 10 ? 'end' : 'middle' });
    }
    B.textM(V(806, 320), '$a$', { 'font-size': 13, fill: '#8fa3bd', 'text-anchor': 'start' });
    if (st.zoom) {
      // 主轴上标出放大窗口
      const pad = Math.max((hi - lo) * .12, .02);
      let wlo = lo - pad, whi = hi + pad;
      if (whi - wlo < .05) { wlo = A - .3; whi = A + .3; }
      mk('rect', { x: mpx(Math.max(0, wlo)), y: 320 - 10, width: mpx(Math.min(10, whi)) - mpx(Math.max(0, wlo)), height: 10, fill: '#ffd166', 'fill-opacity': .16 }, B.dyn);
      B.seg(V(mpx(Math.max(0, wlo)), 320 - 10), V(mpx(Math.max(0, wlo)), 320 + 12), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
      B.seg(V(mpx(Math.min(10, whi)), 320 - 10), V(mpx(Math.min(10, whi)), 320 + 12), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '3 3' });
      // 放大面板
      mk('rect', { x: 70, y: 92, width: 720, height: 150, rx: 12, fill: '#5c6a80', 'fill-opacity': .08, stroke: '#5c6a80', 'stroke-opacity': .4, 'stroke-width': 1 }, B.dyn);
      B.text(V(88, 114), '放大（焦点区域）', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'start' });
      const zpx = v => 150 + (v - wlo) / (whi - wlo) * 620;
      B.seg(V(140, 185), V(790, 185), { stroke: '#8fa3bd', 'stroke-width': 1.8 });
      const t0 = Math.ceil(wlo), t1 = Math.floor(whi);
      for (let v = t0; v <= t1; v++) {
        B.seg(V(zpx(v), 185 - 3), V(zpx(v), 185 + 3), { stroke: '#93a1b5', 'stroke-width': 1.1 });
        B.text(V(zpx(v), 205), String(v), { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'middle' });
      }
      if (st.labs) {
        const xs = ms.map(([, v]) => zpx(v));
        ms.forEach(([n, v]) => {
          B.mark(V(zpx(v), 185 - 8), C[n]);
          B.seg(V(zpx(v), 185), V(zpx(v), 185 - 8), { stroke: C[n], 'stroke-width': 1.4 });
        });
        // 四点重合时不叠四条标签（会压到面板边框），只写一句
        if (stacked) B.tex(V(zpx(A), 142), `$H=G=A=Q=${f1(A)}$`, { size: 12.5, anchor: 'mid', color: '#ffd166' });
        else if (xs.some((x, i) => i && x - xs[i - 1] < 58)) {
          // 靠得太近：标签排到四个固定槽位，各引一条细线连回自己的点（避免文字叠文字）
          [180, 360, 540, 720].forEach((sx, i) => {
            B.seg(V(xs[i], 176), V(sx, 160), { stroke: C[ms[i][0]], 'stroke-width': .9, 'stroke-opacity': .55 });
            B.tex(V(sx, 142), `$${ms[i][0]}=${f1(ms[i][1])}$`, { size: 12.5, anchor: 'mid', color: C[ms[i][0]] });
          });
        } else ms.forEach(([n, v]) => B.tex(V(zpx(v), 142), `$${n}=${f1(v)}$`, { size: 12.5, anchor: 'mid', color: C[n] }));
      } else {
        ms.forEach(([n, v]) => B.mark(V(zpx(v), 185 - 8), C[n]));
      }
    }
    // 主轴上四点
    if (st.labs) {
      ms.forEach(([n, v]) => {
        B.mark(V(mpx(v), 320 - 9), C[n]);
        B.seg(V(mpx(v), 320), V(mpx(v), 320 - 9), { stroke: C[n], 'stroke-width': 1.6 });
      });
      const mx = ms.map(([, v]) => mpx(v));
      if (stacked) B.tex(V(mpx(A), 284), `$H=G=A=Q=${f1(A)}$`, { size: 12.5, anchor: 'mid', color: '#ffd166' });
      else if (mx[3] - mx[0] < 100) B.textM(V(mpx(A), 286), '$H<G<A<Q$', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'middle' });
      else ms.forEach(([n, v]) => B.tex(V(mpx(v), 286), `$${n}\\;=${f1(v)}$`, { size: 12.5, anchor: 'mid', color: C[n] }));
    } else {
      ms.forEach(([n, v]) => B.mark(V(mpx(v), 320 - 9), C[n]));
    }
    // 徽章
    cH(`$${f1(H)}$`);
    cG(`$${f1(G)}$`);
    cA(`$${f1(A)}$`);
    cQ(`$${f1(Q)}$`);
    if (stacked) cJ(`四量收缩到同一点：$H=G=A=Q=${f1(A)}$ —— 取等`, 'ok');
    else if (hi - lo < .05) cJ(`四量靠得很近，依次 $H{<}G{<}A{<}Q$；$G^2=AH=${f1(G * G)}$ 恒等`);
    else cJ(`四量依次 $H{<}G{<}A{<}Q$；$G^2=AH=${f1(G * G)}$ 恒等、$Q^2-A^2=${f1(Q * Q - A * A)}$＝$\\tfrac{(a-b)^2}{4}$`);
  };

  B.btnM('⏩ $a,b\\to\\tfrac{a+b}{2}$', () => {
    const a0 = st.a, b0 = st.b, mid = (a0 + b0) / 2;
    let fr = 0;
    const step = () => {
      fr++;
      const u = Math.min(1, fr / 24);
      st.a = a0 + (mid - a0) * u; st.b = b0 + (mid - b0) * u;
      sA.sync(st.a); sB.sync(st.b); B.render();
      if (u < 1) B.raf(step);
    };
    B.raf(step);
  }, { pri: true });
  const PRE = [
    { name: '悬殊', formula: '$a=1,\\ b=9$', values: { a: 1, b: 9 } },
    { name: '二与八', formula: '$a=2,\\ b=8$', values: { a: 2, b: 8 } },
    { name: '接近', formula: '$a=4,\\ b=5$', values: { a: 4, b: 5 } },
    { name: '取等', formula: '$a=3,\\ b=3$', values: { a: 3, b: 3 } },
  ];
  B.examples('选择例题', PRE, st, P => {
    st.a = P.a; st.b = P.b; sA.sync(P.a); sB.sync(P.b); B.render();
  });
  B.toggleBtn('放大', true, on => { st.zoom = on; B.render(); });
  B.graphToggles(st, ['labs']);

  const sA = B.slider('a =', 0.5, 9, .1, 1, v => { st.a = v; B.render(); }, undefined, n => `$a=${n}$`);
  const sB = B.slider('b =', 0.5, 9, .1, 9, v => { st.b = v; B.render(); }, undefined, n => `$b=${n}$`);

  B.render();
  return B;
}