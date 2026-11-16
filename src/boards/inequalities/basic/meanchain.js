/* 图 基3 · 均值链机：调和 H ≤ 几何 G ≤ 算术 A ≤ 平方 Q
   同一对正数 a、b 的四条均值同排一轴：
   H=2ab/(a+b)（调和）、G=√(ab)（几何）、A=(a+b)/2（算术）、Q=√((a²+b²)/2)（平方）。
   a≠b 时四量依次排开，G²=AH 恒等（G 是 A、H 的几何中项）、Q²−A²=(a−b)²/4；
   a=b 时四量收缩到同一点。主数轴固定 [0,10] 保持真实量感，「放大」聚焦四量所在窗口，
   横坐标几像素内也能看清四个点的先后次序。「趋向相等」把 a、b 同拉到中点，观察四量逐一聚拢。
   局部坐标约定：u∈[0,860] 向右、v∈[0,480] 向下；主数轴 v=320、px(v)=90+70v；
   放大轴 v=185、pxz(v)=150+(v−wlo)/(whi−wlo)·620，窗口 wlo/whi 逐帧按四量重算。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { a: 1, b: 9, zoom: true, labs: true };
  const cH = B.chipM('调和'), cG = B.chipM('几何'), cA = B.chipM('算术'), cQ = B.chipM('平方'), cJ = B.chipM('判读');
  const C = { H: '#67e8f9', G: '#4ade80', A: '#ffd166', Q: '#c084fc' };

  B.renderFn = () => {
    const { a, b } = st;
    const H = 2 * a * b / (a + b), G = Math.sqrt(a * b), A = (a + b) / 2, Q = Math.sqrt((a * a + b * b) / 2);
    const ms = [['H', H], ['G', G], ['A', A], ['Q', Q]];
    const lo = Math.min(...ms.map(m => m[1])), hi = Math.max(...ms.map(m => m[1]));
    const stacked = hi - lo < .05;
    // 标题与说明
    B.tex(V(430, 32), `$\\dfrac{2ab}{a+b}\\le\\sqrt{ab}\\le\\dfrac{a+b}{2}\\le\\sqrt{\\dfrac{a^2+b^2}{2}}$`, { size: 15.5, anchor: 'mid', w: 780 });
    B.textM(V(430, 76), '同一对正数的四条均值：调和 $\\le$ 几何 $\\le$ 算术 $\\le$ 平方，$a=b$ 时全部取等', { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 四条均值的辅助等式（右下）
    B.tex(V(592, 384), `$\\tfrac{1}{H}=\\tfrac12\\left(\\tfrac{1}{a}+\\tfrac{1}{b}\\right)$`, { size: 12.5, anchor: 'start', color: '#67e8f9' });
    B.tex(V(592, 410), `$Q^2=\\tfrac{a^2+b^2}{2}=A^2+\\tfrac{(a-b)^2}{4}$`, { size: 12.5, anchor: 'start', color: '#c084fc' });

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
          B.dot(V(zpx(v), 185 - 8), 4.5, { fill: C[n] });
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
        ms.forEach(([n, v]) => B.dot(V(zpx(v), 185 - 8), 4.5, { fill: C[n] }));
      }
    }
    // 主轴上四点
    if (st.labs) {
      ms.forEach(([n, v]) => {
        B.dot(V(mpx(v), 320 - 9), 6, { fill: C[n] });
        B.seg(V(mpx(v), 320), V(mpx(v), 320 - 9), { stroke: C[n], 'stroke-width': 1.6 });
      });
      const mx = ms.map(([, v]) => mpx(v));
      if (stacked) B.tex(V(mpx(A), 284), `$H=G=A=Q=${f1(A)}$`, { size: 12.5, anchor: 'mid', color: '#ffd166' });
      else if (mx[3] - mx[0] < 100) B.textM(V(mpx(A), 286), '$H<G<A<Q$：四点挤在一起，看上面的放大图', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'middle' });
      else ms.forEach(([n, v]) => B.tex(V(mpx(v), 286), `$${n}\\;=${f1(v)}$`, { size: 12.5, anchor: 'mid', color: C[n] }));
    } else {
      ms.forEach(([n, v]) => B.dot(V(mpx(v), 320 - 9), 6, { fill: C[n] }));
    }
    // 徽章
    cH(`$H=\\tfrac{2ab}{a+b}=${f1(H)}$`);
    cG(`$G=\\sqrt{ab}=${f1(G)}$`);
    cA(`$A=\\tfrac{a+b}{2}=${f1(A)}$`);
    cQ(`$Q=\\sqrt{\\tfrac{a^2+b^2}{2}}=${f1(Q)}$`);
    if (hi - lo < 1e-9) cJ(`四量收缩到同一点：$H=G=A=Q=${f1(A)}$ —— 取等`, 'ok');
    else if (stacked) cJ(`四量靠得很近，依次 $H{<}G{<}A{<}Q$；$G^2=AH=${f1(G * G)}$ 恒等`);
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
    { a: 1, b: 9, n: '① a=1, b=9（悬殊）' },
    { a: 2, b: 8, n: '② a=2, b=8' },
    { a: 4, b: 5, n: '③ a=4, b=5（接近）' },
    { a: 3, b: 3, n: '④ a=b=3（取等）' },
  ];
  PRE.forEach(P => B.btn(P.n, () => { st.a = P.a; st.b = P.b; sA.sync(P.a); sB.sync(P.b); B.render(); }));
  B.toggleBtn('放大', true, on => { st.zoom = on; B.render(); });
  B.graphToggles(st, ['labs']);

  const sA = B.slider('a =', 0.5, 9, .1, 1, v => { st.a = v; B.render(); });
  const sB = B.slider('b =', 0.5, 9, .1, 9, v => { st.b = v; B.render(); });

  B.hint('拖 a、b：四个色点在主轴上排开 H<G<A<Q，缩小差距四量逐渐聚拢 —— 差距来自不相等');
  B.render();
  return B;
}