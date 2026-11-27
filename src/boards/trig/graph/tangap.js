/* 图 W3 正切断口机：tan=sin/cos（U2 商数关系）—— cos=0 处排除成断口（竖直渐近线 B.asym）、断笔成支永不连线；
   每支 −∞→+∞ 单调升；相邻两支平移 π 完全重合 —— 周期只有 π（I1 的 π+α 组：tan(π+α)=tan α）。 */
import { TrigLegendBoard, angleTex, piTick } from '../trig-board.js';
import { V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 860, 520);
  const st = { x0: Math.PI / 6, per: true, asy: true, grid: true, labs: true };
  B.toggleBtn('周期 π', true, v => { st.per = v; B.render(); });
  B.graphToggles(st, ['asy', 'grid', 'labs']);
  const xSl = B.slider('x₀', -4.8, 4.8, 0.01, st.x0, v => { st.x0 = v; B.render(); }, undefined, (_, v) => `$x_0=${fmt(v, 2)}$`);
  B.angleRow([0, 45, 90, 135], () => st.x0, v => { st.x0 = v; xSl.sync(v); B.render(); });
  const cX = B.readout('$x_0$', 'blue'), cT = B.readout('$\\tan x_0$', 'mint'), cP = B.readout('周期核验', 'gold'), cV = B.chipM('判读');

  B.renderFn = () => {
    const x0 = st.x0, c = Math.cos(x0), defined = Math.abs(c) > 1e-10, t = defined ? Math.tan(x0) : NaN;
    const m = B.isoFit(-3 * Math.PI / 2, 5 * Math.PI / 2, -4, 4, B.plotRect);
    B.grid({ ...m, sx: Math.PI / 2, sy: 1, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = -3; k <= 5; k++)
      B.text(V(m.px(k * Math.PI / 2), m.py(0) + 15), piTick(k * Math.PI / 2), { 'font-size': 11, fill: '#5c6a80' });
    if (st.asy) { // 断口 = 竖直渐近线：x = π/2 + kπ（cos=0 排除处）
      const asy = [];
      for (let k = -2; k <= 2; k++) { const v = Math.PI / 2 + k * Math.PI; if (v > m.X0 + 1e-9 && v < m.X1 - 1e-9) asy.push({ v, t: st.labs ? 'x=' + piTick(v) : '' }); }
      B.asym(m, asy);
    }
    B.plot(Math.tan, m, { n: 640, dom: x => Math.abs(Math.cos(x)) > 1e-10, stroke: '#67e8f9', 'stroke-width': 2.4 });
    B.note('$y=\\tan x$', '#67e8f9');
    if (st.asy) B.note('竖直渐近线', '#c084fc', 'dashed');
    const visible = defined && t >= m.Y0 && t <= m.Y1;
    if (visible) {
      const p = V(m.px(x0), m.py(t));
      B.mark(p, '#67e8f9');
      if (st.per && x0 + Math.PI <= m.X1) {
        const q = V(m.px(x0 + Math.PI), p.y);
        B.arrow(p, q, { head: 9, wide: 4, stroke: '#ffd166', 'stroke-dasharray': '6 5' });
        B.mark(q, '#ffd166');
        if (st.labs) B.text(V((p.x + q.x) / 2, p.y - 12), '+π', { fill: '#ffd166', 'font-size': 13 });
      }
    }
    for (let k = Math.ceil(m.X0 / Math.PI); k <= Math.floor(m.X1 / Math.PI); k++)
      B.mark(V(m.px(k * Math.PI), m.py(0)), '#ffd166');
    // 探针
    B.seg(V(m.px(x0), m.py(m.Y0)), V(m.px(x0), m.py(m.Y1)), { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-dasharray': '3 4' });
    // chips
    cX(`$${angleTex(x0)}\\,\\mathrm{rad}$，$${fmt(x0*180/Math.PI,1)}^\\circ$`);
    if (!defined) { cT('$\\cos x_0=0$，正切无定义', 'warn'); cP('平移后也在渐近线上', 'warn'); }
    else {
      cT(`$${fmt(t, 3)}$`);
      cP(`$\\tan(x_0+\\pi)\\approx${fmt(Math.tan(x0 + Math.PI), 3)}$`, Math.abs(Math.tan(x0 + Math.PI) - t) < 1e-6 ? 'ok' : 'warn');
    }
    cV(!defined || !visible
      ? '从左侧靠近这条渐近线，函数值趋于 $+\\infty$；从右侧靠近，趋于 $-\\infty$。'
      : '每一支都单调递增。向右平移 $\\pi$，探针在下一支找到同样的高度。');
  };
  B.render();
  return B;
}
