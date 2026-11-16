/* 图 重1 · 二重积分的定义机
   把矩形区域 [0,1.6]² 等分成 n×n 个小块，每块用中心处的函数值乘面积近似，
   求和 Sₙ；右侧把 Sₙ 随 n 的变化画出来，与精确值那条绿线对照。
   区域上取 f=1+x²y²（非负，便于把积分读成曲顶柱体的体积；且中心点取值的误差按 h² 缩小，
   每加细一倍误差约为上次的四分之一，见右栏各点）。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

const F = (x, y) => 1 + x * x * y * y;
const L = 1.6, EXACT = L * L + (L ** 3 / 3) ** 2;

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { n: 8 };
  const cN = B.chipM('分割'), cS = B.chipM('$S_n$'), cE = B.chipM('精确值'), cD = B.chipM('误差');
  const mL = B.isoFit(-0.12, L + 0.12, -0.12, L + 0.12, [30, 26, 420, 342], 22);
  const mR = B.mapFit(0, 21, 3.35, 4.5, [512, 62, 280, 290], 22);

  B.renderFn = () => {
    const n = st.n, h = L / n;
    B.grid({ ...mL, sx: 0.4, sy: 0.4, lx: 0.4, ly: 0.4, axLab: 'x', ayLab: 'y' });

    // 区域与分块
    let S = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const xa = i * h, ya = j * h, xc = xa + h / 2, yc = ya + h / 2;
      const v = F(xc, yc);
      S += v * h * h;
      const op = Math.min(.36, .05 + .30 * (v - 1) / 6.5);
      const { px, py } = mL;
      const pts = `${px(xa).toFixed(1)},${py(ya).toFixed(1)} ${px(xa + h).toFixed(1)},${py(ya).toFixed(1)} ${px(xa + h).toFixed(1)},${py(ya + h).toFixed(1)} ${px(xa).toFixed(1)},${py(ya + h).toFixed(1)}`;
      mk('polygon', { points: pts, fill: '#ff9e4a', 'fill-opacity': op.toFixed(3), stroke: '#93a1b5', 'stroke-opacity': .45, 'stroke-width': .7 }, B.dyn);
    }
    B.tex(V(mL.px(L / 2), mL.py(L) + 22), '$D$：$0\\le x\\le1.6$，$0\\le y\\le1.6$', { size: 12, color: '#ff9e4a', w: 260, anchor: 'mid' });

    // 右侧：Sₙ 随 n 收敛到精确值
    B.grid({ ...mR, sx: 2, sy: 0.2, lx: 2, ly: 0.2, axLab: 'n', ayLab: 'S' });
    B.seg(V(mR.px(0), mR.py(EXACT)), V(mR.px(20), mR.py(EXACT)), { stroke: '#4ade80', 'stroke-width': 1.8, 'stroke-dasharray': '6 4', 'stroke-opacity': .9 });
    B.tex(V(mR.px(20) - 6, mR.py(EXACT) - 8), '精确值', { size: 11.5, color: '#4ade80', w: 70, anchor: 'end' });
    for (let k = 1; k <= 20; k++) {
      const hk = L / k; let s = 0;
      for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) s += F(i * hk + hk / 2, j * hk + hk / 2) * hk * hk;
      B.dot(V(mR.px(k), mR.py(s)), 2.6, { fill: '#5cadff', stroke: 'none' });
    }
    B.dot(V(mR.px(n), mR.py(S)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });

    cN(`$${n}\\times${n}$`);
    cS(`$${fmt(S, 4)}$`);
    cE(`$${fmt(EXACT, 4)}$`);
    cD(`$${fmt(Math.abs(EXACT - S), 4)}$`);
  };

  B.slider('每边等分数 n', 1, 16, 1, st.n, v => { st.n = v; B.render(); }, 'n');
  B.hintM('拖 n：小块越分越细，$S_n$ 向精确值靠拢；积分的定义就是 $n\\to\\infty$ 时这个和的极限');
  B.render();
  return B;
}
