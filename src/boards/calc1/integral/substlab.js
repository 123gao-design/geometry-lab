/* 图 积2 · 换元机：把 x 的积分搬到 u 的那一边
   ① 凑微分：左边画 2x·cos(x²) 在 [a,b] 上的面积，右边画 cos u 在 [a²,b²] 上的面积。
      du=2x dx 把两段面积一对一搬过去，两边数值相等。
   ② 三角代换：半径 a 的圆上取角 θ，两条直角边正是 x=a sinθ 与 √(a²−x²)=a cosθ。
   版面：左图 40..430，右图 452..860（模式二改为单幅大图）。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, a: 0.4, b: 1.3, th: 0.9, r: 2 };
  const cL = B.chipM('左面积'), cR = B.chipM('右面积'), cX = B.chipM('x 值'), cRoot = B.chipM('根式'), cJ = B.chipM('判读');

  const g = x => 2 * x * Math.cos(x * x);

  const area = (fn, lo, hi, m, col) => {
    if (hi - lo < 1e-4) return 0;
    const N = 90, h = (hi - lo) / N;
    let d = `M${m.px(lo)} ${m.py(0)} `, S = fn(lo) + fn(hi);
    for (let i = 1; i <= N; i++) {
      const x = lo + i * h, y = fn(x);
      if (i < N) S += y * (i % 2 ? 4 : 2);           // 辛普森权重
      d += `L${m.px(x).toFixed(1)} ${m.py(y).toFixed(1)} `;
    }
    d += `L${m.px(hi)} ${m.py(0)} Z`;
    mk('path', { d, fill: col, 'fill-opacity': .18, stroke: 'none' }, B.dyn);
    return S * h / 3;
  };

  B.renderFn = () => {
    const sw = st.k;
    if (sw === 0) {
      const a = Math.min(st.a, st.b - 0.08), b = Math.max(st.b, st.a + 0.08);
      const mA = B.mapFit(-1.9, 1.9, -2.7, 2.7, [40, 58, 390, 300], 14);
      const mB = B.mapFit(-0.5, 3.9, -1.4, 1.5, [452, 58, 400, 300], 14);
      B.grid({ ...mA, sx: 1, sy: 1, lx: 1, ly: 1 });
      B.grid({ ...mB, sx: 1, sy: 1, lx: 1, ly: 1, xt: [1, 2, 3], yt: [-1, 1] });
      B.plot(g, mA, { stroke: '#5cadff', 'stroke-width': 2, anchors: [a, b] });
      B.plot(Math.cos, mB, { stroke: '#c084fc', 'stroke-width': 2, anchors: [a * a, b * b] });
      const s1 = area(g, a, b, mA, '#4ade80'), s2 = area(Math.cos, a * a, b * b, mB, '#4ade80');
      [a, b].forEach(t => {
        B.seg(V(mA.px(t), mA.py(-2.7)), V(mA.px(t), mA.py(g(t))), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '4 4' });
        B.seg(V(mB.px(t * t), mB.py(-1.4)), V(mB.px(t * t), mB.py(Math.cos(t * t))), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '4 4' });
      });
      B.tex(V(40 + 195, 372), `$\\int_a^b 2x\\cos x^2\\,\\mathrm{d}x$`, { size: 12, anchor: 'mid', color: '#5cadff' });
      B.tex(V(452 + 200, 372), `$\\int_{a^2}^{b^2}\\cos u\\,\\mathrm{d}u$`, { size: 12, anchor: 'mid', color: '#c084fc' });
      B.textM(V(40 + 195, 46), 'x 轴：被积式里带着 2x', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'mid' });
      B.textM(V(452 + 200, 46), 'u 轴：令 u=x²，2x dx 变成 du', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'mid' });
      B.tex(V(452 + 200, 404), `$[${fmt(a * a, 2)},\\ ${fmt(b * b, 2)}]$`, { size: 11.5, anchor: 'mid', color: '#ffd166' });
      cL(`$=${fmt(s1, 4)}$`); cR(`$=${fmt(s2, 4)}$`);
      cX(`$[${fmt(a, 2)},${fmt(b, 2)}]$`); cRoot('—');
      cJ('两段绿面积相等：$2x\\,\\mathrm{d}x$ 正是 $\\mathrm{d}u$，区间端点也随之平方');
      B.hintM('把 $a$、$b$ 拖开：左边一段面积，右边对应 $[a^2,b^2]$ 上同样大的一块');
    } else {
      const r = st.r, th = st.th;
      const m = B.isoFit(-r - 0.5, r + 0.5, -r - 0.5, r + 0.9, [40, 50, 470, 340], 10);
      B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1 });
      const cx = m.px(0), cy = m.py(0), R = r * m.s;
      mk('circle', { cx, cy, r: R, fill: 'none', stroke: '#5cadff', 'stroke-width': 2 }, B.dyn);
      const x = r * Math.sin(th), yq = r * Math.cos(th);
      const P = V(m.px(x), m.py(yq));
      B.seg(V(cx, cy), P, { stroke: '#ffd166', 'stroke-width': 2.2 });
      B.seg(V(cx, cy), V(P.x, cy), { stroke: '#4ade80', 'stroke-width': 2 });
      B.seg(V(P.x, cy), V(P.x, P.y), { stroke: '#ff9e4a', 'stroke-width': 2 });
      // 角弧：小半径上从极轴扫到 OP
      const ra = Math.min(R * 0.3, 46);
      mk('path', { d: `M${cx + ra} ${cy} A${ra} ${ra} 0 0 1 ${cx + ra * Math.sin(th)} ${cy - ra * Math.cos(th)}`, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.4 }, B.dyn);
      B.dot(P, 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
      B.tex(V(m.px(x / 2), cy + 18), `$x=a\\sin\\theta$`, { size: 11.5, anchor: 'mid', color: '#4ade80' });
      B.tex(V(P.x + 8, m.py(yq / 2)), `$\\sqrt{a^2-x^2}$`, { size: 11.5, anchor: 'start', color: '#ff9e4a' });
      B.tex(V(cx + R * Math.sin(th / 2) * 0.55 + 6, cy - R * Math.cos(th / 2) * 0.55 - 12), `$\\theta$`, { size: 12, anchor: 'start', color: '#93a1b5' });
      B.tex(V(548, 120), `$x=a\\sin\\theta,\\quad a=${fmt(r, 1)}$`, { size: 12.5, color: '#4ade80', anchor: 'start' });
      B.tex(V(548, 168), `$\\mathrm{d}x=a\\cos\\theta\\,\\mathrm{d}\\theta$`, { size: 12.5, color: '#aebdd2', anchor: 'start' });
      B.tex(V(548, 216), `$\\sqrt{a^2-x^2}=a\\cos\\theta$`, { size: 12.5, color: '#ff9e4a', anchor: 'start' });
      B.tex(V(548, 268), `$x=${fmt(x, 3)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
      B.tex(V(548, 306), `$\\sqrt{a^2-x^2}=${fmt(Math.sqrt(Math.max(r * r - x * x, 0)), 3)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
      cL('—'); cR(`$=${fmt(Math.sqrt(Math.max(r * r - x * x, 0)), 3)}$`);
      cX(`$=${fmt(x, 3)}$`); cRoot(`$=${fmt(Math.sqrt(Math.max(r * r - x * x, 0)), 3)}$`);
      cJ('根式被 $a\\cos\\theta$ 换掉：直角三角形里两条直角边就是 $x$ 与根号那一段');
      B.hintM('拖动 $\\theta$：绿色直角边是 $x=a\\sin\\theta$，橙色是 $\\sqrt{a^2-x^2}=a\\cos\\theta$');
    }
  };

  const bts = ['① 凑微分 $u=x^2$', '② 三角代换 $x=a\\sin\\theta$'].map((t, i) => B.btnM(t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i));
    sliders.forEach((s, j) => { const p = s && (s.parentNode || s.parent); if (p) p.style.display = (i === 0 ? j < 2 : j >= 2) ? '' : 'none'; });
    B.render();
  }, { on: i === 0 }));
  const s1 = B.slider('a =', -1.6, 0.4, 0.01, st.a, v => { st.a = v; B.render(); }, 'a');
  const s2 = B.slider('b =', -0.4, 1.7, 0.01, st.b, v => { st.b = v; B.render(); }, 'b');
  const s3 = B.slider('θ =', 0.08, 1.48, 0.01, st.th, v => { st.th = v; B.render(); }, 'th');
  const s4 = B.slider('a =', 1, 3, 0.05, st.r, v => { st.r = v; B.render(); }, 'r');
  const sliders = [s1, s2, s3, s4];
  sliders.forEach((s, j) => { const p = s && (s.parentNode || s.parent); if (p) p.style.display = j < 2 ? '' : 'none'; });
  B.hintM('把 $a$、$b$ 拖开：左边一段面积，右边对应 $[a^2,b^2]$ 上同样大的一块');
  B.render();
  return B;
}
