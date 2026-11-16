/* 图 等2 · 下标和机
   等差数列的项落在一条直线上，直线上的中点与指数的中点对齐：
   若 m+n=p+q，则 a_m+a_n=a_p+a_q（两对项在同一高度上对称）。
   本板取以 c 为中心的两对：(c−1, c+1) 蓝、(c−2, c+2) 橙，下标和同为 2c，项和同为 2a_c。
   局部坐标：图区 rect=[92,62,640,300]，x 视野 [−0.4, 11.4]，右侧留 90px 放读数标签。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 440;
  const B = new Board(root, W, H);
  const st = { a1: 2, d: 2, c: 5, grid: true, labs: true };
  const val = k => st.a1 + (k - 1) * st.d;
  const nice = v => { const p = 10 ** Math.floor(Math.log10(v)); const r = v / p; return (r <= 1 ? 1 : r <= 2 ? 2 : r <= 5 ? 5 : 10) * p; };
  const cSub = B.chipM('下标和'), cSum = B.chipM('项和'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const c = st.c, ac = val(c);
    const all = Array.from({ length: 10 }, (_, i) => val(i + 1));
    const lo = Math.min(0, Math.min(...all) - 1), hi = Math.max(0, Math.max(...all) + 1);
    const m = B.mapFit(-0.4, 11.4, lo, hi, [92, 62, 640, 300], 0);
    const step = nice((hi - lo) / 5);
    B.grid({ ...m, sx: 1, sy: step, lx: 1, ly: step, xt: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      axLab: 'n', ayLab: 'a', grid: st.grid, labs: st.labs });
    // 对称轴：x = c
    B.seg(V(m.px(c), m.py(lo)), V(m.px(c), m.py(hi)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 5', 'stroke-opacity': .8 });
    // 全部项
    for (let k = 1; k <= 10; k++) B.dot(V(m.px(k), m.py(val(k))), 3.4, { fill: '#5cadff', 'fill-opacity': .55 });
    // 两对项与中心项
    const pair = (k, col) => {
      B.dot(V(m.px(k), m.py(val(k))), 5.2, { fill: col, stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.seg(V(m.px(k), m.py(val(k))), V(m.px(11.4), m.py(val(k))), { stroke: col, 'stroke-width': 1, 'stroke-dasharray': '5 5', 'stroke-opacity': .6 });
    };
    pair(c - 1, '#5cadff'); pair(c + 1, '#5cadff');
    pair(c - 2, '#ff9e4a'); pair(c + 2, '#ff9e4a');
    B.dot(V(m.px(c), m.py(ac)), 5.8, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    // 右侧读数（d=0 时五条线重合，只标一处）
    if (Math.abs(st.d) < 1e-9) {
      B.tex(V(744, m.py(ac)), '各项相等', { size: 12, color: '#93a1b5', anchor: 'start', w: 100 });
    } else {
      for (const k of [c - 2, c - 1, c + 1, c + 2])
        B.tex(V(744, m.py(val(k))), `$a_{${k}}=${fmt(val(k), 1)}$`,
          { size: 11.5, color: Math.abs(k - c) === 1 ? '#5cadff' : '#ff9e4a', anchor: 'start', w: 100 });
      B.tex(V(744, m.py(ac)), `$a_{${c}}=${fmt(ac, 1)}$`, { size: 11.5, color: '#ffd166', anchor: 'start', w: 100 });
    }
    // 标题
    B.tex(V(92, 32), '下标和相等，项和也相等', { size: 15, anchor: 'start', w: 420, bold: true });
    B.tex(V(828, 32), '两对项关于 $a_c$ 对称', { size: 12.5, anchor: 'end', color: '#93a1b5', w: 260 });
    // 徽章
    cSub(`$${c - 2}+${c + 2}=${c - 1}+${c + 1}=${2 * c}$`);
    cSum(`$a_{${c - 2}}+a_{${c + 2}}=a_{${c - 1}}+a_{${c + 1}}=${fmt(2 * ac, 1)}$`);
    cJ(`$2a_{${c}}=${fmt(2 * ac, 1)}$：相邻三项也满足 $2a_{n+1}=a_n+a_{n+2}$`);
  };

  const slA = B.slider('首项 a₁', -4, 10, 1, 2, v => { st.a1 = v; B.render(); });
  const slD = B.slider('公差 d', -3, 3, 0.5, 2, v => { st.d = v; B.render(); });
  B.slider('中心 c', 3, 8, 1, 5, v => { st.c = v; B.render(); });
  const PRE = [{ nm: '① 递增', a1: 2, d: 2 }, { nm: '② 递减', a1: 12, d: -2 }];
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.a1 = p.a1; st.d = p.d;
    slA.sync(st.a1); slD.sync(st.d);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('换 c 与 d：下标对称的两项，在竖直方向上也一样对称');
  B.render();
  return B;
}
