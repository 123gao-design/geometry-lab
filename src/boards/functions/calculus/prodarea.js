/* 图 V2 · 乘法法则面积板：(uv)′=u′v+uv′ 的几何来源。
   蓝底矩形 u×v，橙条 v·Δu，金条 u·Δv，红角 Δu·Δv ——
   Δ(uv)=uΔv+vΔu+ΔuΔv；Δ→0 时红角（二阶小量）占比趋零，除以 Δx 只剩一次项。
   固定基边 u=2、v=1（法则不挑基值）；「⏩ Δ 双双归零」动画看红角消失。
   坐标约定：面积图像素原点 (364,420)、每单位 150px；左侧 0..340 为四则法则
   —— B.tex 是 nowrap+overflow:visible，表达式行必须实测宽度 ≤300px，否则溢出盖到图上（本版已重排）。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new Board(root, W, H);
  const u = 2, v = 1;
  const st = { du: 0.5, dv: 0.3, labs: true };
  const S = 150, X0 = 364, Y0 = 420;
  const px = x => X0 + x * S, py = y => Y0 - y * S;

  const cS = B.chipM('面积核验'), cL = B.chipM('线性主部'), cQ = B.chipM('二阶小量'), cV = B.chipM('判读');

  B.renderFn = () => {
    const { du, dv } = st;
    // 面积图：蓝底、橙右条、金上条、红角、灰虚线外框
    mk('rect', { x: px(0), y: py(v), width: u * S, height: v * S, fill: '#5cadff', 'fill-opacity': .28, stroke: '#5cadff', 'stroke-width': 1.6 }, B.dyn);
    mk('rect', { x: px(u), y: py(v), width: du * S, height: v * S, fill: '#ff9e4a', 'fill-opacity': .4, stroke: '#ff9e4a', 'stroke-width': 1.4 }, B.dyn);
    mk('rect', { x: px(0), y: py(v + dv), width: u * S, height: dv * S, fill: '#ffd166', 'fill-opacity': .4, stroke: '#ffd166', 'stroke-width': 1.4 }, B.dyn);
    mk('rect', { x: px(u), y: py(v + dv), width: Math.max(du * S, 2), height: Math.max(dv * S, 2), fill: '#ff7b8a', 'fill-opacity': .7, stroke: '#ff7b8a', 'stroke-width': 1.4 }, B.dyn);
    mk('rect', { x: px(0), y: py(v + dv), width: (u + du) * S, height: (v + dv) * S, fill: 'none', stroke: '#93a1b5', 'stroke-dasharray': '6 5', 'stroke-width': 1.4 }, B.dyn);
    if (st.labs) {
      B.tex(V(px(0.85), py(0.32)), `$uv=${fmt(u * v, 0)}$`, { size: 15, color: '#5cadff', anchor: 'mid', w: 120 });
      B.tex(V(px(0.28), py(0.55)), `$v=${v}$`, { size: 13, color: '#93a1b5', anchor: 'start', w: 60 });
      B.tex(V(px(0) + 6, py(v + dv / 2)), `$u\\,\\Delta v=${fmt(u * dv, 2)}$`, { size: 12.5, color: '#ffd166', anchor: 'start', w: 150 });
      B.tex(V(px(u) + 6, py(v / 2)), `$v\\,\\Delta u=${fmt(v * du, 2)}$`, { size: 12.5, color: '#ff9e4a', anchor: 'start', w: 150 });
      if (du > 0.18 && dv > 0.18) B.tex(V(px(u) + du * S / 2, py(v + dv) + dv * S / 2), `$\\Delta u\\Delta v$`, { size: 11, color: '#ff7b8a', anchor: 'mid', w: 90 });
      B.tex(V(px(u / 2), py(0) + 16), `$u=${u}$`, { size: 13, color: '#93a1b5', anchor: 'mid', w: 60 });
      B.tex(V(px(u + du / 2), py(0) + 16), `$\\Delta u=${fmt(du, 2)}$`, { size: 13, color: '#93a1b5', anchor: 'mid', w: 90 });
    }
    // 左侧：四则法则（每行实测 ≤300px：nowrap 溢出会压图）
    B.tex(V(20, 52), '四则法则', { size: 15, color: '#93a1b5', anchor: 'start', w: 300 });
    B.tex(V(20, 92), `$(u\\pm v)'=u'\\pm v'$`, { size: 15, color: '#5cadff', anchor: 'start', w: 300 });
    B.tex(V(20, 128), `$(cu)'=c\\,u'$`, { size: 15, color: '#5cadff', anchor: 'start', w: 300 });
    B.tex(V(20, 174), `$(uv)'=u'v+uv'$`, { size: 18, color: '#ffd166', anchor: 'start', w: 300 });
    B.tex(V(20, 224), `$\\Bigl(\\dfrac{u}{v}\\Bigr)'=\\dfrac{u'v-uv'}{v^2}$（$v\\neq 0$）`, { size: 15, color: '#c084fc', anchor: 'start', w: 320 });
    B.tex(V(20, 274), `$\\Delta(uv)=u\\,\\Delta v+v\\,\\Delta u+\\Delta u\\,\\Delta v$`, { size: 14, color: '#93a1b5', anchor: 'start', w: 310 });
    B.tex(V(20, 318), `$\\dfrac{\\Delta(uv)}{\\Delta x}=u\\dfrac{\\Delta v}{\\Delta x}+v\\dfrac{\\Delta u}{\\Delta x}$`, { size: 13.5, color: '#93a1b5', anchor: 'start', w: 310 });
    B.tex(V(20, 356), `$+\\ \\dfrac{\\Delta u\\,\\Delta v}{\\Delta x}$（末项：除后归零）`, { size: 13, color: '#93a1b5', anchor: 'start', w: 300 });
    B.tex(V(20, 392), `取 $\\Delta u=u'\\Delta x$：末项为高阶小量`, { size: 13, color: '#93a1b5', anchor: 'start', w: 300 });
    B.tex(V(20, 426), `一次项分别取各自的导数 —— 面积的增量分解`, { size: 13, color: '#93a1b5', anchor: 'start', w: 300 });
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
  B.hintM("Δu、Δv 一起拖小：红角份额趋零，一次项成为主导 —— $(uv)'=u'v+uv'$ 由面积分解直接得到");
  B.render();
  return B;
}
