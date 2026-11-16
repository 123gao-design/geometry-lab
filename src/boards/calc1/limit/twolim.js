/* 图 极5 · 两个重要极限机
   ① 单位圆里的面积夹逼：O 为圆心、A=(1,0)、P=(cos x, sin x)、T=(1, tan x)。
      三块图形从小到大依次是 △OAP（½sin x）、扇形 OAP（½x）、△OAT（½tan x），
      于是 sin x < x < tan x，同除 sin x 得 1 < x/sin x < 1/cos x，两侧都趋于 1。
   ② 数列 aₙ=(1+1/n)ⁿ 沿 n 增大单调上升，上界取 3， 极限记为 e；
      图上画出 e 的水平虚线与每个 aₙ 的点，右栏读当前值与差额。
   两档各用各的滑块，切档时另一枚隐藏。版面：左图 50..470 × 60..360，右栏 500 起。 */
import { Board, V, add, fmt, mk, arcPts, texMix } from '../../../lib/board.js';

const E = Math.E;
const NM = 40;

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { m: 0, x: 0.7, n: 8 };
  const c1 = B.chipM('sin x / x'), c2 = B.chipM('tan x / x'), c3 = B.chipM('1/cos x'), cJ = B.chipM('判读');
  // 两档的读数含义不同，徽章标签跟着切
  const CE = [0, 1, 2].map(i => B.chipRow.children[i]);
  const setLab = (i, s) => { const b = CE[i].children[0]; b.textContent = s + ' '; b.innerHTML = texMix(s) + ' '; };

  B.renderFn = () => {
    const a = st.x;

    if (st.m === 0) {
      setLab(0, 'sin x / x'); setLab(1, 'tan x / x'); setLab(2, '1/cos x');

      /* ---------- ① 单位圆里的面积夹逼 ---------- */
      const m = B.isoFit(-0.22, 1.26, -0.12, 1.72, [54, 60, 430, 300], 12);
      const O = V(0, 0), A = V(1, 0), Pa = V(Math.cos(a), Math.sin(a)), T = V(1, Math.tan(a));
      const sp = p => V(m.px(p.x), m.py(p.y));

      // 坐标参考线
      B.seg(sp(V(-0.18, 0)), sp(V(1.24, 0)), { stroke: '#5b6a80', 'stroke-width': 1 });
      B.seg(sp(V(0, -0.10)), sp(V(0, 1.70)), { stroke: '#5b6a80', 'stroke-width': 1 });
      B.tex(add(sp(V(1.22, 0)), V(0, -12)), '$x$', { size: 12, anchor: 'end', color: '#93a1b5' });
      B.tex(add(sp(V(0, 1.69)), V(10, 0)), '$y$', { size: 12, anchor: 'start', color: '#93a1b5' });

      // 单位圆（第一象限这半圈）—— 屏幕坐标 y 向下，角度取负才是向上扫
      const circ = arcPts(sp(O), 0, -Math.PI / 2, 1 * m.s, 40);
      mk('path', { d: circ, fill: 'none', stroke: '#5cadff', 'stroke-width': 1.6, 'stroke-opacity': .55 }, B.dyn);

      // 三块面积由小到大嵌在一起：△OAP ⊂ 扇形 ⊂ △OAT，
      // 用 evenodd 把外圈割成三个互不重叠的色块，色块大小就是三个数值之差
      const O2 = sp(O), A2 = sp(A), P2 = sp(Pa), T2 = sp(T);
      const pt = q => `${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
      const arc = arcPts(O2, 0, -a, 1 * m.s, 24);
      const secD = `M${pt(O2)}` + arc.replace(/^M/, 'L') + ' Z';
      const triD = `M${pt(O2)} L${pt(A2)} L${pt(P2)} Z`;
      const outD = `M${pt(O2)} L${pt(A2)} L${pt(T2)} Z`;
      mk('path', { d: outD + ' ' + secD, fill: '#4ade80', 'fill-opacity': .3, 'fill-rule': 'evenodd' }, B.dyn);
      mk('path', { d: secD + ' ' + triD, fill: '#5cadff', 'fill-opacity': .32, 'fill-rule': 'evenodd' }, B.dyn);
      mk('path', { d: triD, fill: '#ffd166', 'fill-opacity': .4 }, B.dyn);
      B.seg(sp(O), sp(A), { stroke: '#5cadff', 'stroke-width': 1.8 });
      B.seg(sp(O), sp(Pa), { stroke: '#5cadff', 'stroke-width': 1.8 });

      // 切线：AT 与它的延长线
      B.seg(sp(V(1, 0)), sp(V(1, 1.70)), { stroke: '#4ade80', 'stroke-width': 1.6, 'stroke-dasharray': '6 4', 'stroke-opacity': .8 });
      B.seg(sp(A), sp(T), { stroke: '#4ade80', 'stroke-width': 2.2 });
      // A 处直角
      B.seg(sp(V(0.92, 0)), sp(V(0.92, 0.08)), { stroke: '#4ade80', 'stroke-width': 1.2 });
      B.seg(sp(V(0.92, 0.08)), sp(V(1, 0.08)), { stroke: '#4ade80', 'stroke-width': 1.2 });

      // 角 x 的弧
      const ar = arcPts(sp(O), 0, -a, 0.2 * m.s, 16);
      mk('path', { d: ar, fill: 'none', stroke: '#ffd166', 'stroke-width': 1.5 }, B.dyn);
      B.tex(sp(V(0.26 * Math.cos(a / 2), 0.26 * Math.sin(a / 2))), '$x$', { size: 12.5, anchor: 'mid', color: '#ffd166' });

      // 四点的名字
      B.dot(sp(O), 3.4, { fill: '#93a1b5' });
      B.tex(add(sp(O), V(-10, 12)), '$O$', { size: 12, anchor: 'end', color: '#93a1b5' });
      B.tex(add(sp(A), V(0, 20)), '$A$', { size: 12, anchor: 'mid', color: '#5cadff' });
      B.tex(add(sp(Pa), V(12, 8)), '$P$', { size: 12, anchor: 'start', color: '#ffd166' });
      B.tex(add(sp(T), V(10, 0)), '$T$', { size: 12, anchor: 'start', color: '#4ade80' });

      // 右栏：三块面积与两个比值
      B.textM(V(500, 92), '三块面积从小到大', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      const rows = [
        ['$S_{\\triangle OAP}=\\dfrac12\\sin x$', fmt(Math.sin(a) / 2, 4), '#ffd166'],
        ['$S_{\\text{扇形}}=\\dfrac12 x$', fmt(a / 2, 4), '#5cadff'],
        ['$S_{\\triangle OAT}=\\dfrac12\\tan x$', fmt(Math.tan(a) / 2, 4), '#4ade80'],
      ];
      rows.forEach((r, i) => {
        B.tex(V(502, 126 + i * 40), r[0], { size: 12.5, color: r[2], anchor: 'start', w: 180 });
        B.textM(V(852, 126 + i * 40), r[1], { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'end' });
      });
      B.tex(V(502, 268), '$\\sin x<x<\\tan x$', { size: 13, color: '#aebdd2', anchor: 'start' });
      B.tex(V(502, 306), '$1<\\dfrac{x}{\\sin x}<\\dfrac{1}{\\cos x}$', { size: 13, color: '#aebdd2', anchor: 'start' });

      c1(`$=\\dfrac{${fmt(Math.sin(a), 3)}}{${fmt(a, 3)}}=${fmt(Math.sin(a) / a, 4)}$`);
      c2(`$=\\dfrac{${fmt(Math.tan(a), 3)}}{${fmt(a, 3)}}=${fmt(Math.tan(a) / a, 4)}$`);
      c3(`$=${fmt(1 / Math.cos(a), 4)}$`);
      if (a < 0.25) cJ('上下界都贴到 $1$：$\\dfrac{x}{\\sin x}$ 被夹住，极限只能是 $1$', 'ok');
      else cJ('把 x 拖小：$\\dfrac{x}{\\sin x}$ 与 $\\dfrac{1}{\\cos x}$ 同时收向 $1$，中间的比值也随之被夹到 $1$');
    } else {
      /* ---------- ② (1+1/n)ⁿ 与 e ---------- */
      setLab(0, '通项'); setLab(1, '差额'); setLab(2, '单调性');
      const m = B.mapFit(0.4, NM + 1.4, 1.35, 3.05, [46, 58, 600, 300], 18);
      B.grid({ ...m, sx: 5, sy: 0.5, lx: 5, ly: 0.5, xt: [5, 10, 20, 30, 40], yt: [1.5, 2, 2.5, 3] });
      B.seg(V(m.px(m.X0), m.py(E)), V(m.px(m.X1), m.py(E)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '6 4' });
      B.tex(V(m.px(m.X1) - 6, m.py(E) - 12), '$y=e$', { size: 12, anchor: 'end', color: '#ffd166' });

      const an = n => Math.pow(1 + 1 / n, n);
      let d = '';
      for (let n = 1; n <= NM; n++) d += (n === 1 ? 'M' : 'L') + m.px(n).toFixed(1) + ' ' + m.py(an(n)).toFixed(1) + ' ';
      mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2 }, B.dyn);
      for (let n = 1; n <= NM; n++) {
        B.dot(V(m.px(n), m.py(an(n))), n === st.n ? 5.6 : 3.6,
          n === st.n ? { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.2 }
            : { fill: '#5cadff', 'fill-opacity': .8, stroke: 'none' });
      }
      // 当前 n 的竖线与差额
      const cur = an(st.n);
      B.seg(V(m.px(st.n), m.py(1.35)), V(m.px(st.n), m.py(cur)), { stroke: '#ff9e4a', 'stroke-width': 1.1, 'stroke-dasharray': '4 3' });
      B.seg(V(m.px(m.X0), m.py(cur)), V(m.px(st.n), m.py(cur)), { stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-dasharray': '2 4', 'stroke-opacity': .7 });
      B.tex(V(m.px(st.n) + 8, m.py(1.42)), `$n=${st.n}$`, { size: 12, anchor: 'start', color: '#ff9e4a' });

      // 右栏
      B.textM(V(668, 92), '数列沿 n 单调上升、上界 3', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      const rows = [
        ['$a_n$', fmt(cur, 5), '#5cadff'],
        ['$e$', fmt(E, 5), '#ffd166'],
        ['$e-a_n$', fmt(E - cur, 5), '#ff9e4a'],
      ];
      rows.forEach((r, i) => {
        B.textM(V(672, 132 + i * 30), r[0], { 'font-size': 12.5, fill: r[2], 'text-anchor': 'start' });
        B.textM(V(852, 132 + i * 30), r[1], { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'end' });
      });
      B.tex(V(672, 246), '$\\left(1+\\dfrac1n\\right)^n$', { size: 13, color: '#aebdd2', anchor: 'start' });
      B.tex(V(672, 286), '$\\to e=2.71828\\ldots$', { size: 13, color: '#ffd166', anchor: 'start' });

      c1(`$a_{${st.n}}=${fmt(cur, 5)}$`);
      c2(`$e-a_{${st.n}}=${fmt(E - cur, 5)}$`);
      c3(`上升，上界 $3$`);
      if (E - cur < 0.05) cJ('$n$ 再大也只能更贴近 $e$ —— 数列以 $e$ 为极限，并不取到 $e$', 'ok');
      else cJ(`把 $n$ 拖大：点沿曲线挤向金色虚线，差额 ${fmt(E - cur, 3)} 一路缩小`);
    }
  };

  const btns = ['① $\\dfrac{\\sin x}{x}\\to 1$', '② $\\left(1+\\dfrac1n\\right)^n\\to e$'];
  const bts = btns.map((t, i) => B.btnM(t, () => {
    st.m = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));

  const sX = B.slider('x =', 0.08, 1.0, 0.01, st.x, v => { st.x = v; B.render(); }, 'x');
  const sN = B.slider('n =', 1, NM, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  const par = e => e && (e.parentNode || e.parent);
  const show = () => {
    const pX = par(sX), pN = par(sN);
    if (pX) pX.style.display = st.m === 0 ? '' : 'none';
    if (pN) pN.style.display = st.m === 1 ? '' : 'none';
  };
  const wrapRender = B.renderFn;
  B.renderFn = () => { show(); wrapRender(); };

  B.hintM('① 看三块面积谁大谁小；② 看每个点都在前一个点上方，且始终低于 $e$ 的水平虚线');
  B.render();
  return B;
}
