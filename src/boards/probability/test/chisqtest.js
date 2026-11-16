/* 图 检2 · 独立性检验
   2×2 列联表的四个格子可以逐个改数，χ² 的观测值随之改变：
   χ² = n(ad−bc)² / [(a+b)(c+d)(a+c)(b+d)]。
   右侧画自由度 1 的 χ² 密度曲线，橙色竖线是观测值，紫色虚线是 3.841 与 6.635 两个临界值。 */
import { Board, V, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 430;
  const B = new Board(root, W, H);
  const st = { a: 30, b: 20, c: 15, d: 35 };
  const cX = B.chipM('χ² 的观测值'), cC = B.chipM('与临界值比较'), cJ = B.chipM('判读');

  const D1 = x => (x <= 0 ? 0 : Math.exp(-x / 2) / Math.sqrt(2 * Math.PI * x));

  const X0 = 470, X1 = 790, YB = 320, YT = 100, xMax = 12;
  const px = x => X0 + x / xMax * (X1 - X0);
  const py = v => YB - v / .55 * (YB - YT);

  B.renderFn = () => {
    const { a, b, c, d } = st;
    const n = a + b + c + d;
    const chi = n * (a * d - b * c) ** 2 / ((a + b) * (c + d) * (a + c) * (b + d));

    // 列联表
    const CX = [176, 252, 328], RW = [156, 196, 236];
    B.text(V(96, 138), '', {});
    [['', '患病', '未患病', '合计'], ['吸烟', a, b, a + b], ['不吸烟', c, d, c + d], ['合计', a + c, b + d, n]]
      .forEach((row, r) => {
        row.forEach((val, q) => {
          const x = q === 0 ? 96 : CX[q - 1];
          const w = q === 0 ? 80 : 76;
          const y = 120 + r * 40;
          B.dyn.appendChild(mk('rect', {
            x, y, width: w, height: 40,
            fill: r === 0 || q === 0 ? 'rgba(139,163,189,.10)' : (r === 3 || q === 3 ? 'rgba(139,163,189,.06)' : '#0a0d14'),
            'fill-opacity': r === 0 || q === 0 || r === 3 || q === 3 ? 1 : .35,
            stroke: '#3f5f8f', 'stroke-width': 1,
          }, B.dyn));
          if (typeof val === 'number') {
            B.textM(V(x + w / 2, y + 25), `$${val}$`, { 'font-size': 13, fill: (r === 3 || q === 3) ? '#8fa3bd' : '#ffd166' });
          } else if (val) {
            B.text(V(x + w / 2, y + 25), val, { fill: '#aebdd2', 'font-size': 12.5 });
          }
        });
      });
    B.textM(V(96, 300), `$n=${n}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    // χ² 密度
    B.dyn.appendChild(mk('line', { x1: X0 - 4, y1: YB, x2: X1 + 8, y2: YB, stroke: '#aebdd2', 'stroke-width': 1.3 }, B.dyn));
    const pts = [];
    for (let x = .34; x <= xMax; x += .04) pts.push(`${px(x)},${py(D1(x))}`);
    B.dyn.appendChild(mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn));
    for (let t = 0; t <= 12; t += 2) B.textM(V(px(t), YB + 17), `$${t}$`, { 'font-size': 10, fill: '#8fa3bd' });

    // 临界值
    [[3.841, '#c084fc'], [6.635, '#8fa3bd']].forEach(([cv, col]) => {
      B.dyn.appendChild(mk('line', { x1: px(cv), y1: YT - 6, x2: px(cv), y2: YB, stroke: col, 'stroke-width': 1.3, 'stroke-dasharray': '5 4' }, B.dyn));
      B.textM(V(px(cv), YT - 14), `$${cv}$`, { 'font-size': 10.5, fill: col });
    });

    // 观测值
    const cc = Math.min(chi, xMax);
    B.dyn.appendChild(mk('line', { x1: px(cc), y1: 86, x2: px(cc), y2: YB, stroke: '#ff9e4a', 'stroke-width': 1.8 }, B.dyn));
    B.dot(V(px(cc), py(D1(cc))), 4.5, { fill: '#ff9e4a' });

    cX(`$${chi.toFixed(2)}$`);
    cC(chi >= 6.635 ? '大于 6.635，有 99% 的把握认为两者有关'
      : chi >= 3.841 ? '大于 3.841，有 95% 的把握认为两者有关'
        : '小于 3.841，没有充分证据认为两者有关');
    cJ(chi >= 3.841 ? '观测值落在紫线右侧，随机波动造成这么大偏差的可能性不足 5%'
      : '观测值落在紫线左侧，这样的偏差用随机波动就能解释，不能否定独立');
  };

  B.slider('吸烟且患病 a', 5, 50, 5, st.a, v => { st.a = v; B.render(); }, 'a');
  B.slider('吸烟未患病 b', 5, 50, 5, st.b, v => { st.b = v; B.render(); }, 'b');
  B.slider('不吸烟患病 c', 5, 50, 5, st.c, v => { st.c = v; B.render(); }, 'c');
  B.slider('不吸烟未患病 d', 5, 50, 5, st.d, v => { st.d = v; B.render(); }, 'd');

  B.hint('让 a、d 同时变大：ad−bc 拉开，χ² 越过临界值，判为有关');
  B.render();
  return B;
}
