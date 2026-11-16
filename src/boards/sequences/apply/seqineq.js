/* 图 用2 · 数列最值机
   a_n=n²/cⁿ（c>1）。作比 a_{n+1}/a_n=((n+1)/n)²/c：比大于 1 就增，小于 1 就减。
   上栏画各项，下栏把比值画成点、以 y=1 为界，越过 1 的地方就是最大项的位置。
   局部坐标：上栏 rect=[70,56,560,232]，下栏 rect=[70,330,560,80]。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { c: 2 };
  const PRE = [{ nm: '① c=2', c: 2 }, { nm: '② c=3', c: 3 }, { nm: '③ c=4', c: 4 }];
  const a = n => n * n / st.c ** n;
  const ratio = n => (n + 1) ** 2 / (st.c * n * n);
  const cR = B.chipM('比值'), cM = B.chipM('最大项'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const vals = Array.from({ length: 10 }, (_, i) => a(i + 1));
    const top = Math.max(...vals);
    const peak = vals.indexOf(top) + 1;
    // 上栏：各项
    const m = B.mapFit(0, 11, 0, top * 1.12, [70, 56, 560, 232], 0);
    B.grid({ ...m, sx: 1, sy: top / 4, lx: 1, ly: top / 4, xt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      axLab: 'n', ayLab: 'a', grid: true, labs: true });
    for (let k = 1; k <= 10; k++) {
      const x = m.px(k), h = m.py(0) - m.py(vals[k - 1]);
      mk('rect', { x: x - 7, y: m.py(vals[k - 1]), width: 14, height: h,
        fill: k === peak ? '#ffd166' : '#5cadff', 'fill-opacity': k === peak ? .55 : .3,
        stroke: k === peak ? '#ffd166' : '#5cadff', 'stroke-width': k === peak ? 2 : 1 }, B.dyn);
    }
    B.tex(V(m.px(peak), m.py(top) - 16), `$a_{${peak}}=${fmt(top, 3)}$`, { size: 12, anchor: 'mid', color: '#ffd166', w: 120 });
    // 下栏：相邻项的比
    B.tex(V(70, 316), '相邻项之比 $a_{k+1}/a_k$：高于 1 的段在增，低于 1 的段在减', { size: 12.5, anchor: 'start', color: '#93a1b5', w: 620 });
    const m2 = B.mapFit(0.5, 10.5, 0, 2.1, [70, 330, 560, 80], 0);
    B.grid({ ...m2, sx: 1, sy: .5, lx: 1, ly: .5, xt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      axLab: 'k', ayLab: '', grid: true, labs: true });
    B.seg(V(m2.px(.5), m2.py(1)), V(m2.px(10.5), m2.py(1)), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' });
    for (let k = 1; k <= 9; k++) {
      const r = ratio(k);
      B.dot(V(m2.px(k), m2.py(r)), 4, { fill: r > 1 ? '#4ade80' : '#ff7b8a', stroke: '#0a0d14', 'stroke-width': 1 });
    }
    // 右栏
    const XR = 664;
    B.seg(V(XR - 18, 76), V(XR - 18, 380), { stroke: '#2b4260', 'stroke-width': 1 });
    B.tex(V(XR, 96), `$a_n=\\dfrac{n^2}{${fmt(st.c, 1)}^{\\,n}}$`, { size: 13, anchor: 'start', w: 180 });
    B.tex(V(XR, 150), '$\\dfrac{a_{n+1}}{a_n}=\\dfrac{(n+1)^2}{c\\,n^2}$', { size: 12.5, anchor: 'start', w: 180 });
    B.text(V(XR, 196), '比大于 1 等价于', { 'font-size': 11.5, fill: '#93a1b5' });
    B.tex(V(XR, 228), `$n<\\dfrac{1}{\\sqrt{${fmt(st.c, 1)}}-1}$`, { size: 12.5, anchor: 'start', color: '#4ade80', w: 180 });
    B.text(V(XR, 270), `即 n ≤ ${Math.floor(1 / (Math.sqrt(st.c) - 1))} 时递增`, { 'font-size': 11.5, fill: '#93a1b5' });
    B.text(V(XR, 306), '之后递减，最大项出现在', { 'font-size': 11.5, fill: '#93a1b5' });
    B.tex(V(XR, 338), `$a_{${peak}}=${fmt(top, 3)}$`, { size: 14, anchor: 'start', color: '#ffd166', w: 180 });
    // 标题
    B.tex(V(60, 30), '作比与 1 比较：先增后减的数列，最大值就在比值的穿越处', { size: 14, anchor: 'start', w: 760 });
    // 徽章
    cR(`$\\dfrac{a_{${peak}}}{a_{${peak - 1 || 1}}}=${fmt(peak > 1 ? ratio(peak - 1) : 1, 2)}$`);
    cM(`$a_{${peak}}=${fmt(top, 3)}$`);
    cJ('比值先大于 1 后小于 1，故有最大项');
  };

  const slC = B.slider('底数 c', 2, 4, 0.5, 2, v => { st.c = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.c = p.c;
    slC.sync(st.c);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.hint('比值点穿过 y=1 的地方，就是数列由增转减、取得最大项的位置');
  B.render();
  return B;
}
