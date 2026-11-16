import { Board, V, mk } from '../../../lib/board.js';

/* 爱尔兰根纲领：群越大，能说的越少。
   欧氏变换保长度，相似变换保角度，仿射变换只保平行，射影变换只保交比。
   同一个正方形在四级变换下依次变成旋转正方形、放大正方形、平行四边形、一般四边形。 */
const SQ = [[-.45, -.45], [.45, -.45], [.45, .45], [-.45, .45]];
const INFO = [
  { n: '欧氏变换', inv: '长度 ✓ · 角度 ✓ · 平行 ✓ · 交比 ✓' },
  { n: '相似变换', inv: '长度 ✗ · 角度 ✓ · 平行 ✓ · 交比 ✓' },
  { n: '仿射变换', inv: '长度 ✗ · 角度 ✗ · 平行 ✓ · 交比 ✓' },
  { n: '射影变换', inv: '长度 ✗ · 角度 ✗ · 平行 ✗ · 交比 ✓' },
];

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { lv: 0 };
  const cG = B.chipM('变换群');
  const cI = B.chipM('不变量');

  const image = p => {
    let x = p[0], y = p[1];
    if (st.lv === 0) {
      const t = 25 * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
      const X = x * c - y * s + .35, Y = x * s + y * c + .12;
      return V(X, Y);
    }
    if (st.lv === 1) {
      const t = 15 * Math.PI / 180, c = Math.cos(t), s = Math.sin(t);
      return V(1.25 * (x * c - y * s) + .12, 1.25 * (x * s + y * c));
    }
    if (st.lv === 2) return V(x + .72 * y, y);
    const d = 1 + .6 * x;
    return V(1.35 * (x / d), 1.35 * (y / d));
  };

  B.renderFn = () => {
    const m = B.isoFit(-1.5, 1.6, -1.3, 1.3, [150, 46, 500, 350], 0);
    B.grid({ ...m, sx: 1, sy: 1, lx: 1, ly: 1, labs: false });
    mk('polygon', { points: SQ.map(p => `${m.px(p[0])},${m.py(p[1])}`).join(' '), fill: 'rgba(143,163,189,.10)', stroke: 'rgba(143,163,189,.45)', 'stroke-width': 1.2 }, B.dyn);
    const Q = SQ.map(image);
    mk('polygon', { points: Q.map(p => `${m.px(p.x)},${m.py(p.y)}`).join(' '), fill: 'rgba(92,173,255,.24)', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    B.tex(V(410, 28), '群越大，保留的不变量越少', { size: 16, anchor: 'mid', w: 460 });
    B.textM(V(410, 424), '每一级都在上一级的基础上加限制，可用的性质随之减少', { 'font-size': 12, fill: '#8fa3bd' });
    cG(INFO[st.lv].n);
    cI(INFO[st.lv].inv);
  };

  INFO.forEach((info, i) => B.btn(info.n, () => { st.lv = i; B.render(); }));
  B.hintM('射影 ⊃ 仿射 ⊃ 相似 ⊃ 欧氏：从射影出发，逐层加上平行、角度、长度');
  B.render();
  return B;
}
