/* 图 微7 · 单调与极值机：f′ 的符号决定形状
   f(x)=x³/3−a x，f′(x)=x²−a，f″(x)=2x。两栏共用横轴：上栏 f（蓝），下栏 f′（紫）。
   f′ 在横轴上的符号用绿（正）、红（负）色带标出：正处 f 上升，负处下降，
   零点处 f 取极大或极小。a=0 时 f′=x² 非负，没有驻点，整段单调递增。
   版面：两栏 54..602 宽、各 96 高（56 与 172 起），右栏 626 起；a 一枚滑块。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { a: 1.5 };
  const cC = B.chipM('驻点'), cX = B.chipM('极值'), cM = B.chipM('单调'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const a = st.a;
    const f = x => x * x * x / 3 - a * x;
    const df = x => x * x - a;
    const mT = B.mapFit(-3.2, 3.2, -6.4, 6.4, [54, 52, 548, 106], 8);
    const mB = B.mapFit(-3.2, 3.2, -3.4, 9.4, [54, 176, 548, 106], 8);

    const axis = m => B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, xt: [], yt: [], grid: false, labs: false });
    axis(mT); axis(mB);
    B.tex(V(24, mT.py(0)), '$f$', { size: 13, color: '#5cadff' });
    B.tex(V(24, mB.py(0)), '$f\'$', { size: 13, color: '#c084fc' });
    B.textM(V(54, 40), '上栏：原函数', { 'font-size': 10.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(54, 164), '下栏：导函数，横轴上的色带是它的符号', { 'font-size': 10.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    B.plot(f, mT, { stroke: '#5cadff', 'stroke-width': 2.2, x0: -3.2, x1: 3.2 });
    B.plot(df, mB, { stroke: '#c084fc', 'stroke-width': 2.2, x0: -3.2, x1: 3.2 });

    // f′ 的符号带：正绿负红，压在横轴上
    const lv = Math.sqrt(Math.max(a, 0));
    const bands = a > 1e-6
      ? [[-3.2, -lv, '#4ade80'], [-lv, lv, '#ff7b8a'], [lv, 3.2, '#4ade80']]
      : [[-3.2, 3.2, '#4ade80']];
    bands.forEach(([p, q, col]) => {
      B.seg(V(mB.px(p), mB.py(0)), V(mB.px(q), mB.py(0)), { stroke: col, 'stroke-width': 7, 'stroke-opacity': .38, 'stroke-linecap': 'round' });
    });

    if (a > 1e-6) {
      [-lv, lv].forEach((x, i) => {
        const isMax = i === 0;
        const col = isMax ? '#ffd166' : '#ff9e4a';
        B.seg(V(mT.px(x), mT.py(-6.4)), V(mT.px(x), mT.py(6.4)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .6 });
        const P = V(mT.px(x), mT.py(f(x)));
        B.dot(P, 5, { fill: col, stroke: '#0a0d14', 'stroke-width': 1.3 });
        B.tex(V(P.x + 6, P.y + (isMax ? -12 : 16)), isMax ? '极大' : '极小', { size: 10.5, anchor: 'start', color: col });
        B.dot(V(mB.px(x), mB.py(0)), 4.6, { fill: col, stroke: '#0a0d14', 'stroke-width': 1.2 });
        B.tex(V(mB.px(x), mB.py(0) + 20), `$${isMax ? '-' : ''}\\sqrt{${fmt(a, 2)}}$`, { size: 10.5, anchor: 'mid', color: col });
      });
    }
    // 拐点：f″=2x 变号
    const O = V(mT.px(0), mT.py(0));
    B.dot(O, 4.4, { fill: '#c084fc', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(O.x + 8, O.y + 15), '拐点', { size: 10.5, anchor: 'start', color: '#c084fc' });

    // 右栏
    const rows = [
      ['$a$', fmt(a, 2), '#93a1b5'],
      ['$x_1$（极大点）', a > 1e-6 ? `−${fmt(lv, 3)}` : '—', '#ffd166'],
      ['$x_2$（极小点）', a > 1e-6 ? fmt(lv, 3) : '—', '#ff9e4a'],
      ['极大值', a > 1e-6 ? fmt(f(-lv), 3) : '—', '#ffd166'],
      ['极小值', a > 1e-6 ? fmt(f(lv), 3) : '—', '#ff9e4a'],
    ];
    rows.forEach((r, i) => {
      B.tex(V(628, 96 + i * 30), r[0], { size: 11.5, color: r[2], anchor: 'start' });
      B.textM(V(858, 96 + i * 30), r[1], { 'font-size': 12, fill: '#aebdd2', 'text-anchor': 'end' });
    });
    B.tex(V(628, 272), '$f\'=x^2-a$，符号', { size: 12, color: '#c084fc', anchor: 'start' });
    B.tex(V(628, 300), '$f\'\'=2x$，$O$ 为拐点', { size: 12, color: '#c084fc', anchor: 'start' });
    B.tex(V(628, 348), '单调区间由 $f\'$ 的零点切开', { size: 11, color: '#8fa3bd', anchor: 'start' });

    cC(a > 1e-6 ? `$=\\pm${fmt(lv, 3)}$` : '$a=0$ 时无驻点');
    cX(a > 1e-6 ? `$=${fmt(f(-lv), 2)}\\ /\\ ${fmt(f(lv), 2)}$` : '—');
    cM(a > 1e-6 ? '$\\nearrow\\ \\searrow\\ \\nearrow$' : '$\\nearrow$（整段）');
    if (a < 0.05) cJ('$a=0$：$f\'=x^2\\ge0$，$f$ 整段递增，导数只在 $0$ 处为零而不变号', 'ok');
    else cJ('$f\'$ 先正、后负、再正：$f$ 先升后降再升，两个零点各对应一个极值', 'ok');
  };

  B.slider('a =', 0, 3, 0.05, st.a, v => { st.a = v; B.render(); }, 'a');
  B.hintM('看下栏的色带：绿处 $f$ 上升、红处下降；色带断开的位置就是极值点');
  B.render();
  return B;
}
