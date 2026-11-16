import { Board, V } from '../../../lib/board.js';

/* 多项式环与余数定理：p(x) = x³ − 3x + 2 除以 (x − a)，余式就是 p(a)。
   a 扫过曲线与 x 轴的交点，余式变号、整除成立，因式 (x − a) 出现。 */
const f = x => x * x * x - 3 * x + 2;
const df = x => 3 * x * x - 3;

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { a: 0.4 };
  const cR = B.chipM('余式 p(a)');
  const cQ = B.chipM('商');
  const cF = B.chipM('整除');

  B.renderFn = () => {
    const a = st.a;
    const m = B.isoFit(-2.9, 2.9, -3.2, 4.4, [90, 60, 640, 320], 0);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1 });
    B.plot(f, m, { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.seg(V(m.px(a), m.py(0)), V(m.px(a), m.py(f(a))), { stroke: 'rgba(255,209,102,.7)', 'stroke-width': 1.4, 'stroke-dasharray': '5 4' });
    B.dot(V(m.px(a), m.py(0)), 4, { fill: '#8fa3bd' });
    B.dot(V(m.px(a), m.py(f(a))), 6.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.text(V(m.px(a) + 10, m.py(f(a)) - 10), `(${a.toFixed(1)}, ${f(a).toFixed(2)})`, { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'start' });
    for (const r of [-2, 1]) {
      B.dot(V(m.px(r), m.py(0)), 4.5, { fill: 'none', stroke: '#c084fc', 'stroke-width': 1.6 });
      B.text(V(m.px(r), m.py(0) + 20), `x=${r}`, { 'font-size': 11, fill: '#c084fc', 'text-anchor': 'middle' });
    }
    B.text(V(m.px(1.9), m.py(-2.3)), '紫色空圈：p(x)=0 的根', { 'font-size': 12, fill: '#c084fc', 'text-anchor': 'start' });

    const rem = f(a), q1 = a, q0 = a * a - 3, exact = Math.abs(rem) < 0.02;
    B.textM(V(410, 404), '除法写成 p(x) = (x − a)·商 + 余式', { 'font-size': 13, fill: '#8fa3bd' });
    B.tex(V(410, 428), exact ? `p(x) = (x − ${a.toFixed(1)})(x² + ${a.toFixed(1)}x + ${q0.toFixed(2)})` : `商 x² + ${a.toFixed(1)}x + ${q0.toFixed(2)}，余 ${rem.toFixed(2)}`, { size: 13, color: exact ? '#4ade80' : '#8fa3bd', anchor: 'mid', w: 640 });

    cR(`${rem.toFixed(2)}`);
    cQ(`$x^2+${a.toFixed(1)}x+${q0.toFixed(2)}$`);
    cF(exact ? '是' : '否');
  };

  B.slider('除数 (x − a) 的 a', -2.6, 2.4, 0.1, st.a, v => { st.a = v; B.render(); });
  B.btn('落到根上', () => { st.a = 1; B.render(); });
  B.hint('滑块停在 −2 或 1 上，余式归零、紫色根点亮起');
  B.render();
  return B;
}
