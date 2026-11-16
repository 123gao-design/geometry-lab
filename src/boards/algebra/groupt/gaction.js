/* 图 群7 · 群作用机
   左图是一个正方形，四个顶点各涂黑或白，组成一个着色；八个按钮是正方形的全部对称变换。
   按一个按钮，着色沿群作用被搬到新的排布上去——怎么搬都跳不出同一族。
   右图把 16 种着色排成 4×4，同一轨道里的着色用金框圈起，轨道大小与稳定子大小一并读出。
   两个读数相乘恒等于群的阶 8，这就是轨道-稳定子定理。 */
import { Board, V, mk } from '../../../lib/board.js';

const SQ = [V(-1, 1), V(1, 1), V(1, -1), V(-1, -1)]; // 左上、右上、右下、左下
const ELS = [
  { n: 'e', m: [0, 1, 2, 3] }, { n: 'r', m: [1, 2, 3, 0] }, { n: 'r²', m: [2, 3, 0, 1] }, { n: 'r³', m: [3, 0, 1, 2] },
  { n: 's', m: [1, 0, 3, 2] }, { n: 'sr', m: [0, 3, 2, 1] }, { n: 'sr²', m: [3, 2, 1, 0] }, { n: 'sr³', m: [2, 1, 0, 3] },
];
const bitsOf = k => [3, 2, 1, 0].map(i => (k >> i) & 1);
const IDX = c => c.reduce((a, b) => a * 2 + b, 0);
const apply = (c, m) => { const d = [0, 0, 0, 0]; for (let i = 0; i < 4; i++) d[m[i]] = c[i]; return d; };

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { c: bitsOf(10) };
  const mL = B.isoFit(-3, 3, -3, 3, [24, 20, 380, 392], 26);
  const mR = B.isoFit(-0.15, 4.15, -0.15, 4.15, [420, 20, 376, 392], 18);
  const cOrb = B.chipM('轨道大小'), cSta = B.chipM('稳定子大小'), cIdx = B.chipM('着色编号'), cMul = B.chipM('轨道 × 稳定子');

  const orbitOf = c => {
    const seen = new Map(), q = [c];
    seen.set(IDX(c), c);
    while (q.length) {
      const x = q.shift();
      for (const e of ELS) { const y = apply(x, e.m), k = IDX(y); if (!seen.has(k)) { seen.set(k, y); q.push(y); } }
    }
    return seen;
  };

  B.renderFn = () => {
    const c = st.c;
    // 左：正方形与四顶点
    B.dyn.appendChild(mk('path', { d: `M${mL.px(-1)} ${mL.py(1)} L${mL.px(1)} ${mL.py(1)} L${mL.px(1)} ${mL.py(-1)} L${mL.px(-1)} ${mL.py(-1)} Z`,
      fill: 'none', stroke: '#8fa3bd', 'stroke-width': 2.4 }, B.dyn));
    SQ.forEach((p, i) => {
      const Q = V(mL.px(p.x), mL.py(p.y));
      B.dot(Q, 15, { fill: c[i] ? '#4ade80' : '#f2f5fa', stroke: '#0a0d14', 'stroke-width': 2 });
      B.text(V(Q.x, Q.y + 4.5), String(i), { 'font-size': 11, fill: c[i] ? '#0a0d14' : '#0a0d14' });
    });
    B.tex(V(mL.px(mL.X0) + 6, mL.py(mL.Y1) + 14), '八种对称变换轮流作用在这张着色上', { size: 12, color: '#93a1b5', w: 300 });

    // 右：16 种着色的 4×4 排布
    const orb = orbitOf(c);
    for (let k = 0; k < 16; k++) {
      const cx = k % 4, cy = Math.floor(k / 4), x0 = mR.px(cx), y0 = mR.py(cy + 1), w = mR.s, h = mR.s;
      const inOrb = orb.has(k);
      B.dyn.appendChild(mk('rect', { x: x0 + 6, y: y0 + 6, width: w - 12, height: h - 12, rx: 8,
        fill: inOrb ? '#ffd166' : '#12161f', 'fill-opacity': inOrb ? .13 : .5,
        stroke: inOrb ? '#ffd166' : '#2b3b53', 'stroke-width': inOrb ? 2 : 1 }, B.dyn));
      const cb = bitsOf(k), cxp = x0 + w / 2, cyp = y0 + h / 2, d = w * .18;
      SQ.forEach((p, i) => {
        const Q = V(cxp + p.x * d, cyp - p.y * d);
        B.dot(Q, 5, { fill: cb[i] ? '#4ade80' : '#93a1b5' });
      });
    }
    B.tex(V(mR.px(mR.X0) + 6, mR.py(mR.Y1) + 14), '金框是同一轨道：群怎么作用都出不去', { size: 12, color: '#93a1b5', w: 300 });

    const sta = ELS.filter(e => IDX(apply(c, e.m)) === IDX(c)).length;
    cOrb(`$${orb.size}$`, '');
    cSta(`$${sta}$`, '');
    cIdx(`$${IDX(c)}$`, '');
    cMul(`$${orb.size}\\times${sta}=${orb.size * sta}$`, orb.size * sta === 8 ? 'good' : 'bad');
    B.hintM(sta === 8 ? '四顶点同色：这张着色被所有变换固定，轨道只有它自己，稳定子是整个群'
      : sta === 1 ? '四顶点两黑两白且无对称：轨道占满 8 张，稳定子只剩幺元'
        : '按任意一个群元素搬一次：着色变了，金框里的成员一个也没多出来');
  };

  let SL;
  ELS.forEach(e => B.btnM(e.n, () => {
    st.c = apply(st.c, e.m);
    if (SL) SL.sync(IDX(st.c));
    B.render();
  }));
  SL = B.slider('着色编号', 0, 15, 1, IDX(st.c), v => { st.c = bitsOf(Math.round(v)); B.render(); }, 'c');

  B.render();
  return B;
}
