/* 图 级5 · 傅里叶级数机：方波由一串奇次正弦叠出来
   S_K(x)=(4/π)·Σ_{k 奇} sin(kx)/k。蓝虚线是方波本身，金色实线是截到第 K 次谐波的部分和。
   拖动项数看波峰处的超调：它并不随项数缩小，始终停在高出方波约 9% 的位置。
   版面：坐标系 46..610 × 58..382，右栏 636 起。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 450;
  const B = new Board(root, W, H);
  const st = { K: 5 };
  const cK = B.chipM('项数'), cP = B.chipM('峰值'), cJ = B.chipM('判读');

  const S = (x, K) => {
    let s = 0;
    for (let k = 1; k <= K; k += 2) s += Math.sin(k * x) / k;
    return 4 * s / Math.PI;
  };

  B.renderFn = () => {
    const m = B.mapFit(-3.7, 3.7, -1.75, 1.75, [46, 58, 564, 300], 12);
    B.grid({ ...m, sx: Math.PI / 2, sy: 0.5, lx: Math.PI / 2, ly: 0.5, xt: [-3, -1.57, 0, 1.57, 3], yt: [-1, -0.5, 0.5, 1] });
    // 方波：左右两段水平线 + 两处竖直跳变
    B.seg(V(m.px(-3.7), m.py(-1)), V(m.px(0), m.py(-1)), { stroke: '#5cadff', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
    B.seg(V(m.px(0), m.py(1)), V(m.px(3.7), m.py(1)), { stroke: '#5cadff', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
    B.seg(V(m.px(0), m.py(-1)), V(m.px(0), m.py(1)), { stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-dasharray': '3 4', 'stroke-opacity': .6 });
    B.plot(x => S(x, st.K), m, { stroke: '#ffd166', 'stroke-width': 2, pad: 3 });
    // 峰值与超调
    let peak = 0, peakX = 0;
    for (let i = 0; i <= 1200; i++) {
      const x = -3.7 + 7.4 * i / 1200, y = S(x, st.K);
      if (y > peak) { peak = y; peakX = x; }
    }
    B.dot(V(m.px(peakX), m.py(peak)), 5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.seg(V(m.px(peakX), m.py(1)), V(m.px(peakX), m.py(peak)), { stroke: '#ff9e4a', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });
    B.tex(V(m.px(peakX) + 8, m.py(peak) - 12), `$${fmt(peak, 3)}$`, { size: 11.5, anchor: 'start', color: '#ff9e4a' });

    B.textM(V(636, 84), '奇次谐波叠加', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.tex(V(636, 124), '$\\dfrac{4}{\\pi}\\sum_{k=1,3,5,\\dots}\\dfrac{\\sin kx}{k}$', { size: 12.5, color: '#ffd166', anchor: 'start' });
    B.tex(V(636, 176), `$K=${st.K}$`, { size: 12.5, color: '#c084fc', anchor: 'start' });
    B.tex(V(636, 216), `$\\text{峰值}=${fmt(peak, 3)}$`, { size: 12, color: '#ff9e4a', anchor: 'start' });
    B.textM(V(636, 258), '虚线：方波　实线：部分和', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM(V(636, 300), '超调约为方波高度的 9%，加多少项都不消', { 'font-size': 11.5, fill: '#6b7c93', 'text-anchor': 'start', w: 210 });

    cK(`$=${st.K}$`);
    cP(`$=${fmt(peak, 3)}$`);
    if (st.K === 1) cJ('只取基波：一条光滑正弦，与方波只在大方向上相像');
    else if (st.K <= 9) cJ('谐波逐次补上，矩形轮廓慢慢成形，跳变处始终有一道斜边');
    else cJ('项数越多越贴近方波，但跳变附近的超调不随项数缩小');
  };

  B.slider('最高谐波 K =', 1, 31, 2, st.K, v => { st.K = v; B.render(); }, 'K');
  B.hintM('拖 $K$：奇次谐波越加越多，方波越描越像，跳变处始终留一道斜边');
  B.render();
  return B;
}
