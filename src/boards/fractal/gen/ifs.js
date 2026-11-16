import { Board, V, mk } from '../../../lib/board.js';

/* 迭代函数系统：混沌游戏。随便取一个起点，每步按固定概率随机挑一个压缩映射，把点挪过去。
   康托尘用两条压缩映射，谢尔宾斯基三角用三条（朝三个顶点对折），巴恩斯利蕨用四条。
   随机序列用固定种子，重绘结果一致。 */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { kind: 1, n: 3000 };
  const cK = B.chipM('映射数 $k$');
  const cP = B.chipM('点数');
  const cD = B.chipM('相似维数');
  const NAME = ['康托尘', '谢尔宾斯基三角', '巴恩斯利蕨'];

  function cloud() {
    const R = rng(20261113);
    const P = [];
    let x = 0, y = 0;
    const warm = 30;
    if (st.kind === 0) {
      for (let i = 0; i < st.n + warm; i++) {
        x = x / 3 + (R() < .5 ? 0 : 2 / 3);
        if (i >= warm) P.push(V(x, .5));
      }
    } else if (st.kind === 1) {
      const VX = [V(0, 0), V(1, 0), V(.5, Math.sqrt(3) / 2)];
      for (let i = 0; i < st.n + warm; i++) {
        const v = VX[Math.floor(R() * 3)];
        x = (x + v.x) / 2; y = (y + v.y) / 2;
        if (i >= warm) P.push(V(x, y));
      }
    } else {
      for (let i = 0; i < st.n + warm; i++) {
        const r = R();
        if (r < .01) { x = 0; y = .16 * y; }
        else if (r < .86) { const nx = .85 * x + .04 * y, ny = -.04 * x + .85 * y + 1.6; x = nx; y = ny; }
        else if (r < .93) { const nx = .2 * x - .26 * y, ny = .23 * x + .22 * y + 1.6; x = nx; y = ny; }
        else { const nx = -.15 * x + .28 * y, ny = .26 * x + .24 * y + .44; x = nx; y = ny; }
        if (i >= warm) P.push(V(x, y));
      }
    }
    return P;
  }

  B.renderFn = () => {
    const P = cloud();
    let xm = Infinity, xM = -Infinity, ym = Infinity, yM = -Infinity;
    for (const p of P) { xm = Math.min(xm, p.x); xM = Math.max(xM, p.x); ym = Math.min(ym, p.y); yM = Math.max(yM, p.y); }
    if (st.kind === 0) { ym = .3; yM = .7; }
    if (xM - xm < 1e-6) { xm -= .5; xM += .5; }
    if (yM - ym < 1e-6) { ym -= .5; yM += .5; }
    const m = B.isoFit(xm, xM, ym, yM, [170, 58, 480, 330], 14);
    B.tex(V(410, 30), NAME[st.kind], { size: 17, anchor: 'mid', w: 300 });
    for (const p of P) {
      B.dot(V(m.px(p.x), m.py(p.y)), st.n > 4000 ? .55 : .8,
        { fill: st.kind === 2 ? '#4ade80' : '#5cadff', 'fill-opacity': .72 });
    }
    B.text(V(410, 414), '每步随机挑一个映射，点集最终落进同一个吸引子', { 'font-size': 12, fill: '#8fa3bd' });
    cK(`${st.kind === 2 ? 4 : st.kind === 1 ? 3 : 2}`);
    cP(`${st.n}`);
    cD(st.kind === 0 ? '$0.631$' : st.kind === 1 ? '$1.585$' : '—');
  };

  B.btn('康托尘', () => { st.kind = 0; st.n = 3000; nS.sync(3000); B.render(); });
  B.btn('谢尔宾斯基三角', () => { st.kind = 1; st.n = 3000; nS.sync(3000); B.render(); });
  B.btn('巴恩斯利蕨', () => { st.kind = 2; st.n = 3000; nS.sync(3000); B.render(); });
  const nS = B.slider('点数', 500, 8000, 500, st.n, v => { st.n = v; B.render(); });
  B.hintM('吸引子与起点无关 —— 随机走也能走出一模一样的分形');
  B.render();
  return B;
}
