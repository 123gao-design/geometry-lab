/* 图 递3 · 蛛网图机
   递推 a_{n+1}=(a_n+c)/a_n 只由当前项决定下一项，把映射 f(x)=1+c/x 画出来，
   从 (a_1,0) 出发「竖直到曲线、水平到 y=x」反复走，折线就是数列的轨迹。
   折线收敛到曲线与 y=x 的交点 —— 不动点，解 x=(x+c)/x 即 x²−x−c=0。
   局部坐标：图区 rect=[64,62,356,346]，右栏 x∈[470,844]。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { c: 1, a1: 1, grid: true, labs: true };
  const PRE = [
    { nm: '① c=1', c: 1, a1: 1 },
    { nm: '② c=2', c: 2, a1: 1 },
    { nm: '③ 从上方', c: 1, a1: 3 },
  ];
  const f = v => (v + st.c) / v;
  const fix = () => (1 + Math.sqrt(1 + 4 * st.c)) / 2;
  const cRec = B.chipM('递推式'), cFix = B.chipM('不动点'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const xf = fix(), a1 = st.a1, fa = f(a1);
    const xm = Math.max(xf, a1, fa) + 0.9, ym = Math.max(xf, a1, fa) + 0.9;
    const m = B.isoFit(0.05, xm, 0, ym, [64, 62, 356, 346], 0);
    B.grid({ ...m, sx: .5, sy: .5, lx: .5, ly: .5, xt: [0.5, 1, 1.5, 2, 2.5, 3],
      axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    // 水平渐近线 y=1 与 y=x
    B.seg(V(m.px(0.05), m.py(1)), V(m.px(xm), m.py(1)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 5', 'stroke-opacity': .7 });
    B.seg(V(m.px(0.05), m.py(0.05)), V(m.px(xm), m.py(xm)), { stroke: '#ffd166', 'stroke-width': 1.3, 'stroke-dasharray': '6 5' });
    B.tex(V(m.px(xm) - 4, m.py(xm) - 12), '$y=x$', { size: 11.5, anchor: 'end', color: '#ffd166', w: 60 });
    // 曲线 y=1+c/x
    B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 1.8, dom: v => v > 0.08, x0: 0.08, x1: xm, n: 320 });
    // 蛛网折线
    let px = a1, py = 0;
    for (let s = 0; s < 10; s++) {
      const qy = f(px);
      B.seg(V(m.px(px), m.py(py)), V(m.px(px), m.py(qy)), { stroke: '#c084fc', 'stroke-width': 1.5, 'stroke-opacity': .9 });
      B.seg(V(m.px(px), m.py(qy)), V(m.px(qy), m.py(qy)), { stroke: '#c084fc', 'stroke-width': 1.5, 'stroke-opacity': .9 });
      py = qy; px = qy;
      if (!(px > 0.06) || px > xm) break;
    }
    // 起点与不动点
    B.dot(V(m.px(a1), m.py(0)), 4.4, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1 });
    B.dot(V(m.px(xf), m.py(xf)), 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.tex(V(m.px(xf) + 10, m.py(xf) - 12), `$x\\approx${fmt(xf, 2)}$`, { size: 11.5, anchor: 'start', color: '#ff9e4a', w: 90 });
    // 标题
    B.tex(V(64, 30), '折线反复「竖到曲线、横到 $y=x$」，尽头是不动点', { size: 14, anchor: 'start', w: 780 });
    // 右栏
    const L = (y, s, o = {}) => B.tex(V(470, y), s, { size: o.size || 12.5, anchor: 'start', w: 370, color: o.color });
    L(78, '递推式 $a_{n+1}=\\dfrac{a_n+c}{a_n}$');
    L(112, '把它看成映射 $f(x)=\\dfrac{x+c}{x}$');
    L(160, '若数列停在某个值 $x$ 上，', { size: 11.5 });
    L(186, '这个值要满足 $x=f(x)$：', { size: 11.5 });
    L(220, '$x=\\dfrac{x+c}{x}$，即 $x^2-x-c=0$', { color: '#ffd166' });
    L(256, `$x=\\dfrac{1+\\sqrt{1+4c}}{2}=${fmt(xf, 3)}$`, { size: 12 });
    L(300, '这样的点叫不动点。', { size: 11.5 });
    L(326, '折线每一步都朝它靠近，', { size: 11.5 });
    L(352, '所以数列收敛到不动点。', { size: 11.5 });
    // 徽章
    cRec(`$a_{n+1}=\\dfrac{a_n+${fmt(st.c, 1)}}{a_n}$`);
    cFix(`$x^2-x-${fmt(st.c, 1)}=0,\\ x=${fmt(xf, 3)}$`);
    cJ(a1 < xf ? '从下方出发，逐项增大，逼近不动点' : a1 > xf ? '从上方出发，逐项减小，逼近不动点' : '起点即不动点，数列各项不变');
  };

  const slC = B.slider('c =', 0.5, 4, 0.5, 1, v => { st.c = v; B.render(); });
  const slA = B.slider('首项 a₁', 0.5, 3, 0.5, 1, v => { st.a1 = v; B.render(); });
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.c = p.c; st.a1 = p.a1;
    slC.sync(st.c); slA.sync(st.a1);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖 a₁ 换起点：折线或从下往上绕，或从上往下绕，都卷向同一个交点');
  B.render();
  return B;
}
