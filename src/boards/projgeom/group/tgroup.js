import { Board, V, mk } from '../../../lib/board.js';

/* 变换群机：正方形的对称群 D4 有 8 个元素 —— 4 个旋转、4 个反射。
   拿一个不对称的字母 F 做被试，逐个施加群元素，看它落到哪、转了多少、逆元是谁。 */
const F0 = [[0, 0], [.16, 0], [.16, .42], [.5, .42], [.5, .58], [.16, .58], [.16, .84], [.62, .84], [.62, 1], [0, 1]]
  .map(([x, y]) => V(.9 * (x - .31), .9 * (y - .5)));
const NAMES = ['e', 'r', 'r²', 'r³', 's', 'sr', 'sr²', 'sr³'];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { a: 0, k: 0 };
  const cE = B.chipM('元素');
  const cO = B.chipM('阶');
  const cI = B.chipM('逆元');

  const apply = p => {
    let x = p.x, y = p.y;
    for (let i = 0; i < st.k; i++) { const t = x; x = -y; y = t; }
    if (st.a) y = -y;
    return V(x, y);
  };

  B.renderFn = () => {
    const m = B.isoFit(-1.25, 1.25, -1.25, 1.25, [200, 46, 420, 350], 0);
    mk('rect', { x: m.px(-1), y: m.py(1), width: 2 * m.s, height: 2 * m.s, fill: 'none', stroke: 'rgba(143,163,189,.45)', 'stroke-width': 1.4, 'stroke-dasharray': '6 5' }, B.dyn);
    mk('polygon', { points: F0.map(p => `${m.px(p.x)},${m.py(p.y)}`).join(' '), fill: 'rgba(143,163,189,.12)', stroke: 'rgba(143,163,189,.45)', 'stroke-width': 1.2 }, B.dyn);
    const Q = F0.map(apply);
    mk('polygon', { points: Q.map(p => `${m.px(p.x)},${m.py(p.y)}`).join(' '), fill: 'rgba(92,173,255,.28)', stroke: '#5cadff', 'stroke-width': 2 }, B.dyn);
    B.tex(V(410, 28), '正方形的 8 个对称变换作用在字母 F 上', { size: 16, anchor: 'mid', w: 520 });
    B.textM(V(410, 424), '旋转 $r$：转 $90^\\circ$；反射 $s$：关于水平轴翻转', { 'font-size': 12, fill: '#8fa3bd' });
    const name = NAMES[st.a * 4 + st.k];
    const order = st.a ? 2 : (st.k === 0 ? 1 : st.k === 2 ? 2 : 4);
    const inv = st.a ? NAMES[(st.k === 0 ? 4 : 4 + (4 - st.k))] : NAMES[(4 - st.k) % 4];
    cE(`$${name}$`);
    cO(`$${order}$`);
    cI(`$${inv}$`);
  };

  NAMES.forEach((n, i) => B.btn(n, () => { st.a = i >= 4 ? 1 : 0; st.k = i % 4; B.render(); }));
  B.hintM('八个变换对复合封闭、有幺元与逆元 —— 这就是一个群');
  B.render();
  return B;
}
