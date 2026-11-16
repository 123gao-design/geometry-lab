/* 图 积3 · 分部积分机：矩形面积拆成两块
   ① 几何：曲线由参数 t 给出 (x,y)=(t²,t)。竖着切出来的区域是 ∫v du，横着切出来的区域是 ∫u dv，
      两块拼起来正好是大矩形与小矩形之差 u(b)v(b)−u(a)v(a)。
   ② 例子：∫xe^x dx = xe^x − ∫e^x dx = (x−1)e^x + C —— 蓝线 xe^x 是橙线的导数。
   版面：图区 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, a: 0.7, b: 2.0, x0: 1.0 };
  const cA = B.chipM('∫u dv'), cB = B.chipM('∫v du'), cS = B.chipM('两块之和'), cJ = B.chipM('判读');

  B.renderFn = () => {
    if (st.k === 0) {
      const a = Math.min(st.a, st.b - 0.15), b = Math.max(st.b, st.a + 0.15);
      const m = B.mapFit(-0.4, 5.4, -0.5, 2.7, [46, 58, 564, 300], 14);
      B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: [1, 2, 3, 4, 5], yt: [1, 2] });
      // 曲线 (x,y)=(t²,t)，t∈[a,b]
      const pts = [];
      for (let i = 0; i <= 110; i++) {
        const t = a + (b - a) * i / 110;
        pts.push([m.px(t * t).toFixed(1), m.py(t).toFixed(1)]);
      }
      const dd = pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1] + ' ').join('');
      // 区域一：曲线与 x 轴之间（横切，∫u dv）
      mk('path', { d: `M${m.px(a * a)} ${m.py(0)} L${m.px(a * a)} ${m.py(a)} ` + pts.slice(1).map(p => `L${p[0]} ${p[1]} `).join('') + `L${m.px(b * b)} ${m.py(0)} Z`,
        fill: '#5cadff', 'fill-opacity': .2, stroke: 'none' }, B.dyn);
      // 区域二：曲线与 y 轴之间（竖切，∫v du）
      mk('path', { d: dd + `L${m.px(0)} ${m.py(b)} L${m.px(0)} ${m.py(a)} Z`,
        fill: '#ff9e4a', 'fill-opacity': .2, stroke: 'none' }, B.dyn);
      B.seg(V(m.px(a * a), m.py(a)), V(m.px(b * b), m.py(b)), { stroke: '#c084fc', 'stroke-width': 2.2 });
      // 两个矩形角
      [[a, '#93a1b5'], [b, '#ffd166']].forEach(([t, col]) => {
        B.dot(V(m.px(t * t), m.py(t)), 4.6, { fill: col, stroke: '#0a0d14', 'stroke-width': 1.2 });
        B.tex(V(m.px(t * t) + 6, m.py(t) - 10), `$(${fmt(t * t, 2)},\\,${fmt(t, 2)})$`, { size: 10.5, anchor: 'start', color: col });
      });
      const uv = b * b - a * a;                       // u(b)v(b) − u(a)v(a) = b³ − a³
      const A = 2 / 3 * (Math.pow(b, 3) - Math.pow(a, 3));  // ∫u dv
      const Bv = 1 / 3 * (Math.pow(b, 3) - Math.pow(a, 3)); // ∫v du
      B.textM(V(636, 84), '大矩形减小矩形', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.tex(V(636, 122), `$u(b)v(b)-u(a)v(a)=${fmt(uv, 4)}$`, { size: 12, color: '#ffd166', anchor: 'start' });
      B.tex(V(636, 168), `$\\int_a^b u\\,\\mathrm{d}v=${fmt(A, 4)}$`, { size: 12, color: '#5cadff', anchor: 'start' });
      B.tex(V(636, 208), `$\\int_a^b v\\,\\mathrm{d}u=${fmt(Bv, 4)}$`, { size: 12, color: '#ff9e4a', anchor: 'start' });
      B.tex(V(636, 258), `$\\int u\\,\\mathrm{d}v=uv-\\int v\\,\\mathrm{d}u$`, { size: 13, color: '#aebdd2', anchor: 'start' });
      B.textM(V(636, 300), '蓝块横着切，橙块竖着切', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
      cA(`$=${fmt(A, 4)}$`); cB(`$=${fmt(Bv, 4)}$`); cS(`$=${fmt(A + Bv, 4)}$`);
      cJ('蓝橙两块拼起来正好填满「大矩形减小矩形」，于是 $\\int u\\,\\mathrm{d}v=uv-\\int v\\,\\mathrm{d}u$');
    } else {
      const x0 = st.x0;
      const m = B.mapFit(-2.3, 1.6, -2.6, 4.6, [46, 58, 564, 300], 14);
      B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: [-2, -1, 1], yt: [-2, 2, 4] });
      const f = x => x * Math.exp(x), Fn = x => (x - 1) * Math.exp(x);
      B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.2, anchors: [x0] });
      B.plot(Fn, m, { stroke: '#ff9e4a', 'stroke-width': 2.2, anchors: [x0] });
      const y = Fn(x0), k = f(x0);
      B.dot(V(m.px(x0), m.py(y)), 5.2, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
      B.seg(V(m.px(x0 - 0.5), m.py(y - k * 0.5)), V(m.px(x0 + 0.5), m.py(y + k * 0.5)),
        { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '6 4' });
      B.tex(V(m.px(x0) + 8, m.py(y) - 12), `$F=(x-1)\\mathrm{e}^x$`, { size: 11.5, anchor: 'start', color: '#ff9e4a' });
      B.tex(V(m.px(x0) + 8, m.py(k) + 14), `$f=x\\mathrm{e}^x$`, { size: 11.5, anchor: 'start', color: '#5cadff' });
      B.textM(V(636, 84), '取 u=x，dv=eˣdx', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.tex(V(636, 122), `$\\int x\\mathrm{e}^x\\mathrm{d}x=x\\mathrm{e}^x-\\int\\mathrm{e}^x\\mathrm{d}x$`, { size: 11.5, color: '#aebdd2', anchor: 'start' });
      B.tex(V(636, 168), `$=(x-1)\\mathrm{e}^x+C$`, { size: 13, color: '#ff9e4a', anchor: 'start' });
      B.tex(V(636, 216), `$uv=${fmt(x0 * Math.exp(x0), 4)}$`, { size: 12, color: '#ffd166', anchor: 'start' });
      B.tex(V(636, 252), `$\\int v\\,\\mathrm{d}u=\\mathrm{e}^{${fmt(x0, 2)}}-1=${fmt(Math.exp(x0) - 1, 4)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
      B.tex(V(636, 300), `$uv-\\int v\\,\\mathrm{d}u=${fmt(Fn(x0), 4)}$`, { size: 12, color: '#aebdd2', anchor: 'start' });
      B.textM(V(46 + 282, 388), '橙线的切线斜率处处等于蓝线的高度', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'mid' });
      cA(`$=${fmt(x0 * Math.exp(x0), 4)}$`);
      cB(`$=${fmt(Math.exp(x0) - 1, 4)}$`);
      cS(`$=${fmt(Fn(x0), 4)}$`);
      cJ('$u$ 选多项式、$\\mathrm{d}v$ 选指数：求一次导 $u$ 就降一次，积分能一直做下去');
    }
  };

  const show = (el, on) => { const p = el && (el.parentNode || el.parent); if (p) p.style.display = on ? '' : 'none'; };
  const bts = ['① 几何拆块', '② 例 $\\int x\\mathrm{e}^x\\mathrm{d}x$'].map((t, i) => B.btnM(t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i));
    show(sa, i === 0); show(sb, i === 0); show(sx, i !== 0);
    B.render();
  }, { on: i === 0 }));
  const sa = B.slider('a =', 0.2, 1.6, 0.02, st.a, v => { st.a = v; B.render(); }, 'a');
  const sb = B.slider('b =', 0.6, 2.4, 0.02, st.b, v => { st.b = v; B.render(); }, 'b');
  const sx = B.slider('x₀ =', -1.9, 1.4, 0.01, st.x0, v => { st.x0 = v; B.render(); }, 'x0');
  show(sx, false);
  B.hintM('拖 $a$、$b$：两块区域一边横切一边竖切，拼起来正好是矩形的差');
  B.render();
  return B;
}
