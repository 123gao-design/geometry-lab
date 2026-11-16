/* 图 极3 · 无穷小阶的比较机
   x→0 时三条曲线都落到原点：y=x（金）、y=sin x（蓝）、y=1−cos x（绿），外加 y=x²/2 细虚线。
   拖动 x 读三个比值：sin x/x→1（同阶、等价），(1−cos x)/x²→1/2（同阶于 x²），(1−cos x)/x→0（比 x 高一阶）。
   图上把竖线放在 x 处，三条曲线各落一点，右栏列当前数值与目标极限，靠近原点时比值稳定下来。
   版面 46..646 × 58..358。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 440;
  const B = new Board(root, W, H);
  const st = { x: 0.8 };
  const c1 = B.chipM('sin x / x'), c2 = B.chipM('(1−cos x) / x²'), c3 = B.chipM('(1−cos x) / x'), cJ = B.chipM('判读');
  const m = B.mapFit(0, 1.5, -0.06, 1.42, [46, 58, 600, 300], 18);

  B.renderFn = () => {
    const x = st.x;
    B.grid({ ...m, sx: 0.5, sy: 0.5, lx: 0.5, ly: 0.5, xt: [0.5, 1, 1.5], yt: [0.5, 1] });

    B.plot(x => x, m, { stroke: '#ffd166', 'stroke-width': 2 });
    B.plot(x => Math.sin(x), m, { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.plot(x => 1 - Math.cos(x), m, { stroke: '#4ade80', 'stroke-width': 2 });
    B.plot(x => x * x / 2, m, { stroke: '#4ade80', 'stroke-width': 1.2, 'stroke-dasharray': '5 4', 'stroke-opacity': .8 });

    // 三条曲线在 x 处的落点
    const ys = { x, s: Math.sin(x), c: 1 - Math.cos(x) };
    B.seg(V(m.px(x), m.py(0)), V(m.px(x), m.py(1.04)), { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-dasharray': '4 4' });
    B.dot(V(m.px(x), m.py(ys.x)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.dot(V(m.px(x), m.py(ys.s)), 5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.dot(V(m.px(x), m.py(ys.c)), 5, { fill: '#4ade80', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(m.px(x) + 8, m.py(0) + 22), `$x=${fmt(x, 2)}$`, { size: 12, anchor: 'start', color: '#93a1b5' });

    // 图例：左上角空处纵向排开，四条曲线各配一小段同色线样
    const LEG = [
      ['$y=x$', '#ffd166', ''],
      ['$y=\\sin x$', '#5cadff', ''],
      ['$y=1-\\cos x$', '#4ade80', ''],
      ['$y=x^2/2$', '#4ade80', '5 4'],
    ];
    LEG.forEach((r, i) => {
      const yy = m.py(1.36) + i * 18;
      B.seg(V(m.px(0.06), yy), V(m.px(0.2), yy), { stroke: r[1], 'stroke-width': 2, 'stroke-dasharray': r[2] || '' });
      B.tex(V(m.px(0.25), yy), r[0], { size: 12, anchor: 'start', color: r[1] });
    });

    // 右栏：当前值与两个目标极限
    B.textM(V(672, 84), '同一张 x 上的读数', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    const rows = [
      ['$x$', fmt(x, 4), '#ffd166'],
      ['$\\sin x$', fmt(ys.s, 4), '#5cadff'],
      ['$1-\\cos x$', fmt(ys.c, 4), '#4ade80'],
    ];
    rows.forEach((r, i) => {
      B.textM(V(676, 122 + i * 30), r[0], { 'font-size': 12, fill: r[2], 'text-anchor': 'start' });
      B.textM(V(800, 122 + i * 30), r[1], { 'font-size': 12, fill: '#aebdd2', 'text-anchor': 'end' });
    });
    B.textM(V(676, 236), '$\\dfrac{\\sin x}{x}\\to 1$', { 'font-size': 12.5, fill: '#5cadff', 'text-anchor': 'start' });
    B.textM(V(676, 276), '$\\dfrac{1-\\cos x}{x^2}\\to\\dfrac12$', { 'font-size': 12.5, fill: '#4ade80', 'text-anchor': 'start' });
    B.textM(V(676, 316), '$\\dfrac{1-\\cos x}{x}\\to 0$', { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    c1(`$=${fmt(Math.sin(x) / x, 4)}$`);
    c2(`$=${fmt((1 - Math.cos(x)) / (x * x), 4)}$`);
    c3(`$=${fmt((1 - Math.cos(x)) / x, 4)}$`);
    if (x <= 0.3) cJ('x 已很近：$\\sin x$ 与 $x$ 几乎重合，$1-\\cos x$ 贴着 $x^2/2$ —— 两条等价关系都成立', 'ok');
    else cJ('把 x 拖向 0：三个比值一起稳定到 $1$、$\\dfrac12$、$0$');
  };

  B.slider('x =', 0.05, 1.2, 0.01, st.x, v => { st.x = v; B.render(); }, 'x');
  B.hintM('三者都是无穷小；$\\sin x$ 与 $x$ 同阶，$1-\\cos x$ 与 $x^2$ 同阶 —— 接近原点的快慢不同，阶就不同');
  B.render();
  return B;
}
