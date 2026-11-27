/* 图 V2 · 用一个矩形和三块面积增量展示乘积法则。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { parameterRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 760, H = 420;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');
  const u = 2, v = 1;
  const st = { du: 0.5, dv: 0.3, labs: true };
  // 用初始外矩形定中心，拖动时固定左下角，便于比较增长的方向。
  const S = 150, X0 = (W - (u + st.du) * S) / 2, Y0 = (H + (v + st.dv) * S) / 2;
  const px = x => X0 + x * S, py = y => Y0 - y * S;

  const cS = B.readout('面积核验'), cL = B.readout('线性主部', 'mint'), cQ = B.readout('二阶小量', 'gold'), cV = B.chipM('判读');

  B.renderFn = () => {
    syncPreset();
    const { du, dv } = st;
    const regions = [
      { x: 0, y: v, w: u, h: v, color: '#5cadff', opacity: .2, label: '$uv$ 原面积', base: true },
      { x: 0, y: v + dv, w: u, h: dv, color: '#ffd166', opacity: .3, label: '$u\\,\\Delta v$ 上条', above: true },
      { x: u, y: v, w: du, h: v, color: '#ff9e4a', opacity: .32, label: '$v\\,\\Delta u$ 右条' },
      { x: u, y: v + dv, w: du, h: dv, color: '#ff7b8a', opacity: .58, label: '$\\Delta u\\,\\Delta v$ 交叉项' },
    ];
    const size = Math.max(17, B.labelFontSize());
    for (const { x, y, w, h, color, opacity, label, base, above } of regions) {
      if (w > 0 && h > 0) mk('rect', {
        x: px(x), y: py(y), width: w * S, height: h * S, fill: color,
        'fill-opacity': opacity, stroke: color, 'stroke-width': 1.6,
      }, B.dyn);
      if (!st.labs) continue;
      B.note(label, color);
      // 滑块各有两位小数，角块最小时的面积为 0.0001。
      const area = Number((w * h).toFixed(4));
      const value = base ? `uv=${area}` : area === 0 ? '0' : `+${area}`;
      const emWidth = value.length * .7 + 1;
      const insideSize = Math.min(size, w * S / emWidth);
      const center = V(px(x + w / 2), py(y - h / 2));
      if (insideSize >= .8 * size && h * S >= insideSize * 1.7) {
        B.tex(center, `$${value}$`, { size: insideSize, w: emWidth * insideSize, anchor: 'mid', color: B.diagramColors.ink });
      } else {
        const rightSpace = W - px(x + w) - 40;
        const useTop = above || (y > v && rightSpace < emWidth * size && py(y) > 35 + size * 1.5);
        const edge = useTop ? V(center.x, py(y)) : V(px(x + w), center.y);
        const end = useTop ? V(edge.x, edge.y - 13) : V(edge.x + 15, edge.y);
        B.seg(edge, end, { stroke: color, 'stroke-width': 1.4 });
        const at = useTop ? V(end.x, end.y - size * .75) : V(end.x + 5, end.y);
        const outerSize = useTop ? size : Math.min(size, rightSpace / emWidth);
        B.tex(at, `$${value}$`, { size: outerSize, w: emWidth * outerSize, anchor: useTop ? 'mid' : 'start', color: B.diagramColors.ink });
      }
    }
    if (st.labs) {
      B.text(V(px(u / 2), Y0 + 25), 'u = 2', { fill: '#5cadff' });
      B.text(V(X0 - 35, py(v / 2)), 'v = 1', { fill: '#5cadff' });
    }
    // 徽章
    const total = u * dv + v * du + du * dv, lin = u * dv + v * du;
    const share = total > 1e-12 ? (du * dv) / total : 0;
    cS(`$\\Delta(uv)=${fmt(total, 4)}$`);
    cL(`$u\\Delta v+v\\Delta u=${fmt(lin, 2)}$`);
    cQ(`$\\Delta u\\,\\Delta v=${fmt(du * dv, 4)}$`);
    cV(total === 0 ? '两个增量均为零。' : `交叉项占总增量的 $${fmt(share * 100, 1)}\\%$。`);
    B.glowPoints([[V(px(u + du), py(v + dv)), B.diagramColors.red]]);
  };

  let autoOn = false, autoBtn = null;
  const tick = () => {
    if (!autoOn) return;
    const shrink = v => Math.max(0, Math.min(Math.round(v * 100) - 1, Math.round(v * 90))) / 100;
    st.du = shrink(st.du); st.dv = shrink(st.dv);
    if (st.du === 0 && st.dv === 0) autoBtn.set(false);
    slU.sync(st.du); slV.sync(st.dv); B.render();
    if (autoOn) B.raf(tick);
  };
  autoBtn = B.toggleBtn('⏩ Δ 双双归零', false, on => { autoOn = on; if (on) B.raf(tick); else B.cancelRaf(); });
  const slU = B.slider('增量 du', 0, 0.9, 0.01, 0.5, v2 => { st.du = v2; B.render(); }, undefined, v => `$\\Delta u=${v}$`);
  const slV = B.slider('增量 dv', 0, 0.9, 0.01, 0.3, v2 => { st.dv = v2; B.render(); }, undefined, v => `$\\Delta v=${v}$`);
  B.graphToggles(st, ['labs']);
  const syncPreset = parameterRow(B, '选择两边增量', [
    { name: '不同增量', formula: '$(0.50,0.30)$', values: { du: .5, dv: .3 } },
    { name: '小增量', formula: '$(0.20,0.20)$', values: { du: .2, dv: .2 } },
    { name: '大增量', formula: '$(0.90,0.90)$', values: { du: .9, dv: .9 } },
  ], st, { du: slU, dv: slV });
  B.render();
  return B;
}
