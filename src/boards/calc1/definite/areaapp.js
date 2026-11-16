/* 图 定5 · 定积分的应用机：面积与旋转体
   ① 面积：两条曲线之间的那一块，蓝橙两条各自围出的面积相减即得；
   ② 旋转体：y=√x 绕 x 轴转，每个 x 处切出一片圆盘，半径就是 f(x)，体积元 πf²Δx。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, b: 0.8 };
  const cS = B.chipM('面积'), cP = B.chipM('体积'), cJ = B.chipM('判读');

  B.renderFn = () => {
    if (st.k === 0) {
      const b = st.b;
      const f = x => x * x, g = x => 2 - x;
      const m = B.mapFit(-0.1, 1.15, -0.1, 2.2, [46, 58, 564, 300], 14);
      B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: [0.5, 1], yt: [1, 2] });
      // 两块之间的区域
      let d = '';
      const N = 60;
      for (let i = 0; i <= N; i++) {
        const x = b * i / N;
        d += (i ? 'L' : 'M') + m.px(x).toFixed(1) + ' ' + m.py(g(x)).toFixed(1) + ' ';
      }
      for (let i = N; i >= 0; i--) {
        const x = b * i / N;
        d += `L${m.px(x).toFixed(1)} ${m.py(f(x)).toFixed(1)} `;
      }
      mk('path', { d: d + 'Z', fill: '#4ade80', 'fill-opacity': .2, stroke: 'none' }, B.dyn);
      B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.2, x0: -0.1, x1: 1.1 });
      B.plot(g, m, { stroke: '#ff9e4a', 'stroke-width': 2.2, x0: -0.1, x1: 1.1 });
      B.tex(V(m.px(0.16), m.py(1.35)), '$y=2-x$', { size: 11.5, anchor: 'start', color: '#ff9e4a' });
      B.tex(V(m.px(0.82), m.py(0.94)), '$y=x^2$', { size: 11.5, anchor: 'start', color: '#5cadff' });
      B.seg(V(m.px(b), m.py(0)), V(m.px(b), m.py(2 - b)), { stroke: '#ffd166', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' });
      B.tex(V(m.px(b) + 6, m.py(0) - 8), `$b=${fmt(b, 2)}$`, { size: 11.5, anchor: 'start', color: '#ffd166' });
      const S = 2 * b - b * b / 2 - Math.pow(b, 3) / 3;
      B.textM(V(636, 84), '曲线之间的面积', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.tex(V(636, 122), `$S=\\int_0^b(2-x-x^2)\\,\\mathrm{d}x$`, { size: 11.5, color: '#aebdd2', anchor: 'start' });
      B.tex(V(636, 164), `$=${fmt(S, 4)}$`, { size: 13, color: '#4ade80', anchor: 'start' });
      B.textM(V(636, 208), '上减下，从左界积到右界', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.tex(V(636, 250), '$b=1$ 时两线交于 $(1,1)$', { size: 11.5, color: '#6b7c93', anchor: 'start' });
      cS(`$=${fmt(S, 4)}$`); cP('—');
      cJ('两块绿色的高度都是「上面的曲线减下面的曲线」，积分把它们累成面积');
      B.hintM('拖 $b$：绿色区域随右界伸缩，读数就是两线之间那块面积');
    } else {
      const b = st.b;
      const f = x => Math.sqrt(x);
      const m = B.mapFit(-0.2, 4.3, -1.9, 2.2, [46, 58, 564, 300], 14);
      B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: [1, 2, 3, 4], yt: [-1, 1, 2] });
      // 若干圆盘：横截面是椭圆
      const nD = 9;
      for (let i = 1; i <= nD; i++) {
        const x = b * i / nD, r = f(x);
        if (r < 0.02) continue;
        const rx = r * m.s * 0.55, ry = r * m.s * 0.22;
        mk('ellipse', { cx: m.px(x), cy: m.py(0), rx, ry, fill: '#ff9e4a', 'fill-opacity': .16, stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-opacity': .55 }, B.dyn);
      }
      B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.2, x0: 0, x1: 4 });
      B.plot(x => -f(x), m, { stroke: '#5cadff', 'stroke-width': 1.4, 'stroke-dasharray': '6 5', x0: 0, x1: 4 });
      B.seg(V(m.px(0), m.py(0)), V(m.px(4.2), m.py(0)), { stroke: '#93a1b5', 'stroke-width': 1.4 });
      const xr = b * 0.7, r = f(xr);
      B.seg(V(m.px(xr), m.py(-r)), V(m.px(xr), m.py(r)), { stroke: '#ffd166', 'stroke-width': 1.6 });
      B.tex(V(m.px(xr) + 8, m.py(r * 0.55)), `$r=\\sqrt{x}$`, { size: 11.5, anchor: 'start', color: '#ffd166' });
      const Vol = Math.PI * b * b / 2;
      B.textM(V(636, 84), '绕 x 轴转出的体积', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.tex(V(636, 122), `$V=\\pi\\int_0^b f^2\\,\\mathrm{d}x$`, { size: 12, color: '#aebdd2', anchor: 'start' });
      B.tex(V(636, 166), `$=\\pi\\int_0^b x\\,\\mathrm{d}x$`, { size: 11.5, color: '#aebdd2', anchor: 'start' });
      B.tex(V(636, 208), `$=${fmt(Vol, 4)}$`, { size: 13, color: '#4ade80', anchor: 'start' });
      B.textM(V(636, 252), '每片圆盘体积 πr²Δx', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
      B.tex(V(636, 292), `$b=${fmt(b, 2)}$`, { size: 12, color: '#93a1b5', anchor: 'start' });
      cS('—'); cP(`$=${fmt(Vol, 4)}$`);
      cJ('把 $b$ 拖大：圆盘一层层叠出去，厚度 $\\mathrm{d}x$ 一乘就是体积微元');
      B.hintM('拖 $b$：橙色圆盘逐片叠高，读数 $\\pi\\int_0^b x\\,\\mathrm{d}x$ 随右界增长');
    }
  };

  const show = (el, on) => { const q = el && (el.parentNode || el.parent); if (q) q.style.display = on ? '' : 'none'; };
  const bts = ['① 面积', '② 旋转体'].map((t, i) => B.btnM(t, () => {
    st.k = i; st.b = i === 0 ? 0.8 : 2.4; sB.sync(st.b);
    bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const sB = B.slider('b =', 0.2, 4, 0.02, st.b, v => {
    st.b = st.k === 0 ? Math.min(v, 1) : v; B.render();
  }, 'b');
  B.hintM('拖 $b$：绿色区域与橙色圆盘都跟着右界伸缩，读数即时跟上');
  B.render();
  return B;
}
