/* 图 W2 余弦平移等价机：cos 的五点 (0,1)·(π/2,0)·(π,−1)·(3π/2,0)·(2π,1)（五点法模式）；
   平移等价模式：cos x = sin(x+π/2) —— 蓝色 sin 与橙色 cos 逐点等高核验，sin 左移 π/2 即得 cos
   （I2 互配组 sin(π/2+x)=cos x 的图象版）。 */
import { TrigLegendBoard, angleTex, piTick } from '../trig-board.js';
import { V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 860, 390);
  const st = { m: 0, x0: Math.PI / 3, grid: true, labs: true };
  B.choiceRow('显示方式', [{ name: '五点法' }, { name: '平移等价' }], () => st.m,
    i => { st.m = i; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.slider('x₀', -0.5, TAU + 0.5, 0.01, st.x0, v => { st.x0 = v; B.render(); }, undefined, (_, v) => `$x_0=${fmt(v, 2)}$`);
  const cX = B.readout('$x_0$', 'blue'), cC = B.readout('$\\cos x_0$', 'orange'), cE = B.readout('平移核验', 'gold'), cV = B.chipM('判读');

  B.renderFn = () => {
    const x0 = st.x0, cv = Math.cos(x0);
    // 取景：x∈[−π/2−0.3, 5π/2+0.3] —— sin 曲线右伸到 5π/2 才够「左移 π/2」全程核验
    const m = B.mapFit(-Math.PI / 2 - 0.3, 5 * Math.PI / 2 + 0.3, -1.6, 1.6, B.plotRect);
    B.grid({ ...m, sx: Math.PI / 2, sy: 0.5, ly: 0.5, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = -1; k <= 5; k++)
      B.text(V(m.px(k * Math.PI / 2), m.py(0) + 15), piTick(k * Math.PI / 2), { 'font-size': 11, fill: '#5c6a80' });
    const anchors = Array.from({ length: 7 }, (_, i) => (i - 1) * Math.PI / 2);
    if (st.m === 1) {
      B.plot(Math.sin, m, { anchors, stroke: '#5cadff', 'stroke-width': 1.8 });
      B.note('$y=\\sin x$', '#5cadff');
    }
    B.plot(Math.cos, m, { anchors, stroke: '#ff9e4a', 'stroke-width': 2.4 });
    B.note('$y=\\cos x$', '#ff9e4a');
    B.mark(V(m.px(x0), m.py(cv)), '#ff9e4a');
    if (st.m === 0) {                                                            // cos 五点骨架
      for (let k = 0; k <= 4; k++) {
        const fx = k * Math.PI / 2, fy = Math.cos(fx);
        B.seg(V(m.px(fx), m.py(0)), V(m.px(fx), m.py(fy)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4' });
        B.mark(V(m.px(fx), m.py(fy)), '#ffd166');
        if (st.labs && Math.abs(fy) > 0.5) B.text(V(m.px(fx), m.py(fy) + (fy > 0 ? -12 : 18)),
          `(${piTick(fx)}, ${fy > 0 ? '1' : '-1'})`, { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' });
      }
    } else {                                                                     // 平移等价：x₀ 处两点恒等高
      const pB = V(m.px(x0 + Math.PI / 2), m.py(Math.sin(x0 + Math.PI / 2))), pC = V(m.px(x0), m.py(cv));
      B.arrow(pB, pC, { head: 9, wide: 4, stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '6 5' });
      B.mark(pB, '#5cadff');
      if (st.labs) B.text(V((pB.x + pC.x) / 2, pC.y - 10), '左移 π/2', { 'font-size': 12, fill: '#ffd166', 'text-anchor': 'middle' });
    }
    // 探针
    B.seg(V(m.px(x0), m.py(m.Y0)), V(m.px(x0), m.py(m.Y1)), { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });
    // chips
    const sv = Math.sin(x0 + Math.PI / 2);
    cX(`$${angleTex(x0)}\\,\\mathrm{rad}$，$${fmt(x0*180/Math.PI,1)}^\\circ$`);
    cC(`$${fmt(cv, 3)}$`);
    cE(`$\\sin(x_0+\\tfrac{\\pi}{2})\\approx${fmt(sv, 3)}$`, Math.abs(sv - cv) < 1e-9 ? 'ok' : 'warn');
    cV(st.m === 0
      ? '从波峰出发，每隔 $\\pi/2$ 依次经过零点、波谷、零点，再回到波峰。'
      : '正弦曲线上的点向左移四分之一周期，高度不变，恰好落在余弦曲线上。');
  };
  B.render();
  return B;
}
