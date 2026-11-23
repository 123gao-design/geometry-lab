/* 图 V2 · 用一个矩形和三块面积增量展示乘积法则。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 760, H = 390;
  const B = new FunctionBoard(root, W, H);
  const u = 2, v = 1;
  const st = { du: 0.5, dv: 0.3, labs: true };
  const S = 160, X0 = 148, Y0 = 346;
  const px = x => X0 + x * S, py = y => Y0 - y * S;

  const cS = B.chipM('面积核验'), cL = B.chipM('线性主部'), cQ = B.chipM('二阶小量'), cV = B.chipM('判读');

  B.renderFn = () => {
    const { du, dv } = st;
    const regions = [
      { x: 0, y: v, w: u, h: v, color: '#5cadff', opacity: .2, label: '$uv$ 原面积' },
      { x: 0, y: v + dv, w: u, h: dv, color: '#ffd166', opacity: .3, label: '$u\\,\\Delta v$ 上条' },
      { x: u, y: v, w: du, h: v, color: '#ff9e4a', opacity: .32, label: '$v\\,\\Delta u$ 右条' },
      { x: u, y: v + dv, w: du, h: dv, color: '#ff7b8a', opacity: .58, label: '$\\Delta u\\,\\Delta v$ 交叉项' },
    ];
    for (const { x, y, w, h, color, opacity, label } of regions) {
      if (w > 0 && h > 0) mk('rect', {
        x: px(x), y: py(y), width: w * S, height: h * S, fill: color,
        'fill-opacity': opacity, stroke: color, 'stroke-width': 1.6,
      }, B.dyn);
      if (st.labs) B.note(label + ' · ' + fmt(w * h, 3), color);
    }
    if (st.labs) {
      B.text(V(px(u / 2), Y0 + 25), 'u = 2', { fill: '#5cadff' });
      B.text(V(X0 - 35, py(v / 2)), 'v = 1', { fill: '#5cadff' });
    }
    // 徽章
    const total = u * dv + v * du + du * dv, lin = u * dv + v * du;
    const share = total > 1e-12 ? (du * dv) / total : 0;
    cS(`$\\Delta(uv)=${fmt(u * dv, 2)}+${fmt(v * du, 2)}+${fmt(du * dv, 3)}=${fmt(total, 3)}$`, '');
    cL(`$u\\Delta v+v\\Delta u=${fmt(lin, 3)}$ —— 除以 $\\Delta x$ 后两项分别取各自的导数`, '');
    cQ(`$\\Delta u\\,\\Delta v=${fmt(du * dv, 3)}$，占增量 ${fmt(share * 100, 1)}%`, '');
    cV(share < 0.03
      ? `红角只占 ${fmt(share * 100, 1)}%：一次项主导 —— 除以 $\\Delta x$ 后末项归零，得 $(uv)'=u'v+uv'$`
      : `红角占 ${fmt(share * 100, 1)}%：$\\Delta$ 还不够小，二阶项仍然可见 —— 拖小看它消失`, share < 0.03 ? 'ok' : '');
  };

  const setD = (a, b) => { st.du = a; st.dv = b; slU.sync(a); slV.sync(b); B.render(); };
  B.btnM('① $\\Delta u=0.50,\\ \\Delta v=0.30$', () => setD(0.5, 0.3), { pri: true, on: true });
  B.btnM('② $\\Delta u=\\Delta v=0.20$', () => setD(0.2, 0.2));
  B.btnM('③ $\\Delta u=\\Delta v=0.90$', () => setD(0.9, 0.9));
  let autoOn = false, autoBtn = null;
  const tick = () => {
    if (!autoOn) return;
    st.du *= 0.9; st.dv *= 0.9;
    if (st.du < 0.03) { st.du = st.dv = 0.02; autoOn = false; autoBtn.set(false); }
    slU.sync(st.du); slV.sync(st.dv); B.render(); B.raf(tick);
  };
  autoBtn = B.toggleBtn('⏩ Δ 双双归零', false, on => { autoOn = on; if (on) B.raf(tick); });
  const slU = B.slider('增量 du', 0, 0.9, 0.01, 0.5, v2 => { st.du = v2; B.render(); });
  const slV = B.slider('增量 dv', 0, 0.9, 0.01, 0.3, v2 => { st.dv = v2; B.render(); });
  B.graphToggles(st, ['labs']);
  B.hint("缩小两边的增量，观察交叉项所占比例。");
  B.render();
  return B;
}
