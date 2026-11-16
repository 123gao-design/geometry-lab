/* 图 微8 · 渐近线与作图机：先除一次，再看余项
   ① 斜渐近线：(x²+a)/(x−c) = x + c + (c²+a)/(x−c)；
   ② 水平渐近线：(a x+b)/(x−c) = a + (ac+b)/(x−c)。
   两种情形共一条竖直渐近线 x=c，另一条渐近线由除法商给出；余项在 x→±∞ 时趋于零。
   版面：坐标系 46..600 × 58..382，右栏 620 起；a、b、c 三枚滑块按档显隐。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 0, a: 1, b: 1, c: 1 };
  const cV = B.chipM('竖直渐近线'), cH = B.chipM('另一条'), cR = B.chipM('余项'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const { a, b, c } = st;
    const f = st.k === 0
      ? x => (x * x + a) / (x - c)
      : x => (a * x + b) / (x - c);
    // 商与余项：模式① 商 x+c、余 c²+a；模式② 商 a、余 ac+b
    const quo = x => st.k === 0 ? x + c : a;
    const rem = st.k === 0 ? c * c + a : a * c + b;
    const obl = 'x' + (c >= 0 ? '+' : '-') + fmt(Math.abs(c), 2);   // 斜渐近线的右端写法

    const m = B.mapFit(-4.6, 4.6, -8.4, 8.4, [46, 58, 554, 300], 10);
    B.grid({ ...m, sx: 1, sy: 2, lx: 1, ly: 4, xt: [-4, -2, 2, 4], yt: [-8, -4, 4, 8] });

    // 两支曲线
    const c1 = Math.min(Math.max(c, m.X0 + 0.05), m.X1 - 0.05);
    B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.2, x0: m.X0, x1: c1 - 0.07, pad: 0.6 });
    B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.2, x0: c1 + 0.07, x1: m.X1, pad: 0.6 });

    // 竖直渐近线
    B.seg(V(m.px(c1), m.py(m.Y0)), V(m.px(c1), m.py(m.Y1)), { stroke: '#c084fc', 'stroke-width': 1.5, 'stroke-dasharray': '7 5' });
    B.tex(V(m.px(c1) + 8, m.py(m.Y1) + 20), `$x=${fmt(c, 2)}$`, { size: 11.5, anchor: 'start', color: '#c084fc' });

    // 另一条渐近线
    const yAt = x => quo(x);
    const y0 = yAt(m.X0), y1 = yAt(m.X1);
    B.seg(V(m.px(m.X0), m.py(Math.max(Math.min(y0, m.Y1), m.Y0))), V(m.px(m.X1), m.py(Math.max(Math.min(y1, m.Y1), m.Y0))),
      { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '8 5' });
    B.tex(V(m.px(m.X1) - 10, m.py(Math.max(Math.min(y1, m.Y1), m.Y0)) - 12),
      st.k === 0 ? `$y=${obl}$` : `$y=${fmt(a, 1)}$`, { size: 11.5, anchor: 'end', color: '#ffd166' });

    // 右栏：除法恒等式 + 两个读数
    const den = c >= 0 ? `x-${fmt(c, 1)}` : `x+${fmt(-c, 1)}`;
    B.textM(V(624, 86), '把假分式拆成整式加真分式', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(624, 124), st.k === 0
      ? `$\\dfrac{x^2+${fmt(a, 1)}}{${den}}=x+${fmt(c, 1)}+\\dfrac{${fmt(rem, 2)}}{${den}}$`
      : `$\\dfrac{${fmt(a, 1)}x+${fmt(b, 1)}}{${den}}=${fmt(a, 1)}+\\dfrac{${fmt(rem, 2)}}{${den}}$`,
      { size: 12, color: '#aebdd2', anchor: 'start', w: 240 });

    const rows = [
      ['竖直渐近线', `x=${fmt(c, 2)}`, '#c084fc'],
      ['另一条渐近线', st.k === 0 ? `y=${obl}` : `y=${fmt(a, 2)}`, '#ffd166'],
      ['余项系数', fmt(rem, 3), '#4ade80'],
      ['$x\\to\\infty$ 时的差', fmt(f(12) - quo(12), 4), '#93a1b5'],
    ];
    rows.forEach((r, i) => {
      B.tex(V(624, 196 + i * 32), r[0], { size: 11.5, color: r[2], anchor: 'start' });
      B.textM(V(858, 196 + i * 32), r[1], { 'font-size': 12, fill: '#aebdd2', 'text-anchor': 'end' });
    });
    B.tex(V(624, 344), '余项随 $x\\to\\pm\\infty$ 趋于 $0$', { size: 11.5, color: '#8fa3bd', anchor: 'start' });

    cV(`$x=${fmt(c, 2)}$`);
    cH(st.k === 0 ? `$y=${obl}$` : `$y=${fmt(a, 2)}$`);
    cR(`$=${fmt(rem, 3)}$`);
    if (Math.abs(rem) < 0.05) cJ('余项为零：分式本身是一次式，曲线退化成那条渐近线', 'ok');
    else cJ('把两端往外看：蓝线贴着金虚线走，离开竖线越远，余项越小');
  };

  const show = (e, on) => { const p = e && (e.parentNode || e.parent); if (p) p.style.display = on ? '' : 'none'; };
  const bts = ['① 斜渐近线', '② 水平渐近线'].map((t, i) => B.btn(t, () => {
    st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i));
    show(slA, true); show(slB, i === 1); show(slC, true); B.render();
  }, { on: i === 0 }));

  const slA = B.slider('a =', -2, 2, 0.1, st.a, v => { st.a = v; B.render(); }, 'a');
  const slB = B.slider('b =', -2, 2, 0.1, st.b, v => { st.b = v; B.render(); }, 'b');
  const slC = B.slider('c =', -1.5, 1.8, 0.1, st.c, v => { st.c = v; B.render(); }, 'c');
  show(slB, false);
  B.hintM('先做一次除法：商画出渐近线，余项说明曲线为什么贴着它走');
  B.render();
  return B;
}
