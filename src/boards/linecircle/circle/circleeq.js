/* 图 圆1 · 圆的标准方程与一般方程
   圆心 C(a,b)、半径 r 的圆：标准方程 (x−a)²+(y−b)²=r²；
   展开并整理成 x²+y²+Dx+Ey+F=0，其中 D=−2a、E=−2b、F=a²+b²−r²。
   拖动圆心、调半径，两个方程同步改写；一般方程的配方过程写在徽章里。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { a: 1, b: 1, r: 2, grid: true, labs: true };
  const m = B.isoFit(-3.8, 3.8, -3, 3, [44, 30, 760, 390], 10);
  const cS = B.chipM('标准方程'), cG = B.chipM('一般方程'), cC = B.chipM('圆心与半径'), cJ = B.chipM('配方');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const term = (v, name, first) => {
    if (Math.abs(v) < 5e-3) return '';
    const av = Math.abs(v);
    const body = (Math.abs(av - 1) < 1e-9 && name ? '' : fz(av)) + name;
    return first ? (v < 0 ? '-' : '') + body : (v < 0 ? '-' : '+') + body;
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const C = V(m.px(st.a), m.py(st.b));
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(V(m.px(st.a + st.r * Math.cos(a1)), m.py(st.b + st.r * Math.sin(a1))),
        V(m.px(st.a + st.r * Math.cos(a2)), m.py(st.b + st.r * Math.sin(a2))),
        { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    }
    B.seg(C, V(m.px(st.a + st.r), m.py(st.b)), { stroke: '#5cadff', 'stroke-width': 1.8, 'stroke-opacity': .9 });
    B.dot(C, 4.5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(C.x + 9, C.y - 10), 'C', { 'font-size': 13, 'font-weight': 700, fill: '#5cadff' });
    B.text(V(m.px(st.a + st.r / 2), m.py(st.b) - 9), 'r', { 'font-size': 12, 'font-weight': 700, fill: '#5cadff' });

    const D = -2 * st.a, E = -2 * st.b, F = st.a * st.a + st.b * st.b - st.r * st.r;
    const sq = (v, name) => Math.abs(v) < 5e-3 ? `${name}^2` : `(${name}${term(-v, '', false)})^2`;
    cS(`$${sq(st.a, 'x')}+${sq(st.b, 'y')}=${fz(st.r * st.r)}$`);
    cG(`$x^2+y^2${term(D, 'x', false)}${term(E, 'y', false)}${term(F, '', false)}=0$`);
    cC(`$C(${fz(st.a)},\\ ${fz(st.b)})$，$r=${fz(st.r)}$`);
    cJ(`$D^2+E^2-4F=${fz(D * D + E * E - 4 * F)}=4r^2>0$，配方得 $\\left(x+\\dfrac{D}{2}\\right)^2+\\left(y+\\dfrac{E}{2}\\right)^2=\\dfrac{D^2+E^2-4F}{4}$`);
  };

  const PRE = [
    { nm: '① 圆心在原点', v: [0, 0, 2] },
    { nm: '② 一般位置', v: [1, 1, 2] },
    { nm: '③ 小半径', v: [-1.5, 0.5, 1] },
  ];
  let sR;
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.a, st.b, st.r] = o.v;
    sR.sync(st.r);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 1 }));
  sR = B.slider('半径 r', 0.5, 3, 0.1, st.r, v => { st.r = v; B.render(); }, 'cr');

  B.handle({
    color: '#5cadff', r: 7, label: 'C', lo: [9, -9],
    get: () => V(m.px(st.a), m.py(st.b)),
    set: p => {
      st.a = Math.round((p.x - m.px(0)) / m.s * 2) / 2;
      st.b = Math.round((m.py(0) - p.y) / m.s * 2) / 2;
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动圆心 C 或半径滑块：标准方程与一般方程同步改写，配方徽章的判别式恒为 4r²');
  // 出口：圆心与半径带进自由画板，标准式与一般式各写一条
  const sg = v => `${v < 0 ? '-' : '+'} ${fmt(Math.abs(v), 2)}`;
  B.ggbOutlet(() => [
    `a=${fmt(st.a, 2)}`, `b=${fmt(st.b, 2)}`, `r=${fmt(st.r, 2)}`,
    'C=(a,b)', 'Circle(C,r)',
    `eq:x^2+y^2 ${sg(-2 * st.a)} x ${sg(-2 * st.b)} y ${sg(st.a * st.a + st.b * st.b - st.r * st.r)}=0`,
  ]);
  B.render();
  return B;
}
