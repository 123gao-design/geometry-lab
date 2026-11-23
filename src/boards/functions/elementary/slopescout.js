/* 图 E1 · 斜率巡逻机：一次函数 y=kx+b —— 单栏全景（用户拍板：基本初等函数不画导函数图，斜率走切形+徽章）。
   探针 x 拖到哪儿，斜率三角形（横 1 竖 k）都是同一个坡 —— f′≡k 只在徽章里说，不再占一栏。
   k 的符号判单调、b 是 y 截距、零点 −b/k；k=0 时常数函数排除（一次函数的边界）。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);

  const st = { k: 1.5, b: -1, x: 1, grid: true, labs: true };
  const M = B.isoFit(-4.6, 4.6, -2.6, 2.6);
  const px = x => M.px(x), py = y => M.py(y);

  const cK = B.chipM('斜率'), cB = B.chipM('截距与零点'), cM = B.chipM('单调'), cD = B.chipM('f′ 判读');

  B.renderFn = () => {
    const { k, b, x } = st;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    let d = '', pen = false;
    for (let u = M.X0 - 0.5; u <= M.X1 + 0.5; u += 0.08) {
      const y = k * u + b;
      if (y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + px(u).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    B.dot(V(px(0), py(b)), 4.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    if (Math.abs(k) > 1e-9 && -b / k > M.X0 && -b / k < M.X1)
      B.dot(V(px(-b / k), py(0)), 4.5, { fill: '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.note('f：y = kx + b（金点 = y 截距 b，灰点 = 零点）', '#93a1b5');
    // 斜率三角形：从探针横走 1、竖走 k —— 上下拖动探针，坡度不变
    const y0 = k * x + b;
    B.seg(V(px(x), py(y0)), V(px(x + 1), py(y0)), { stroke: '#ffd166', 'stroke-width': 1.8 });
    B.seg(V(px(x + 1), py(y0)), V(px(x + 1), py(y0 + k)), { stroke: '#ffd166', 'stroke-width': 1.8 });
    B.note(`$\\Delta x=1$`, '#ffd166');
    // k≈0 时竖直腿缩为零高度，Δy 标签会叠在水平线/截距点上 —— 上移一行让开（水平线方向 k=0 无歧义，放线上方）
    B.note(`$\\Delta y=k=${fmt(k, 2)}$`, '#ffd166');
    B.dot(V(px(x), py(y0)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    // 徽章
    cK(`斜率 $k=\\dfrac{\\Delta y}{\\Delta x}=${fmt(k, 2)}$ —— 探针拖到哪儿都一样`, '');
    if (Math.abs(k) > 1e-9) {
      cB(`$b=${fmt(b, 2)}$（y 截距），零点 $x=-\\dfrac{b}{k}=${fmt(-b / k, 2)}$`, '');
      cM(k > 0 ? '$k>0$：R 上递增 —— 斜率为正' : '$k<0$：R 上递减 —— 斜率为负', k > 0 ? 'ok' : 'warn');
    } else {
      cB(b === 0 ? '$k=0$ 且 $b=0$：y=0，零点全体实数' : '$k=0$：水平线 y=b，与 x 轴平行不相交，无零点', b === 0 ? 'ok' : 'warn');
      cM('$k=0$：常数函数 —— 「一次」排除（一次函数要求 k≠0）', 'warn');
    }
    cD(`f′(x)=k 恒成立：处处同坡，无需另画导函数 —— 一次函数是导数世界最平凡的成员（S2 的判据在这里最省事）`, '');
  };

  const set = (k, b) => { st.k = k; st.b = b; slK.sync(k); B.render(); };
  B.btnM('陡增 $k=1.5$', () => set(1.5, -1), { pri: true, on: true });
  B.btnM('缓增 $k=0.5$', () => set(0.5, 1));
  B.btnM('水平 $k=0$', () => set(0, 1));
  B.btnM('递减 $k=-1.2$', () => set(-1.2, 0.5));
  const slK = B.slider('k', -2, 2, 0.1, 1.5, v => { st.k = v; B.render(); });
  B.slider('b', -2, 2, 0.1, -1, v => { st.b = v; B.render(); });
  B.slider('探针 x', -3.5, 3.5, 0.05, 1, v => { st.x = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint("移动斜率三角形，比较不同位置的横增量与纵增量。");
  B.render();
  return B;
}
