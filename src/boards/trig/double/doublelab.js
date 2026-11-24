/* 图 N1 倍角面积机：单位圆的内接矩形（宽 2cosα、高 sinα）面积 = 2sinαcosα = sin2α ——
   倍角公式是和差公式 β=α 的特例；cos2α 三形态与 tan2α 分母为零情形同时实时核验。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { a: Math.PI / 6, rect: true, arc: true };
  const O = V(300, 282), R = 190;
  const sA = B.slider('角 α', 0, TAU, Math.PI / 12, st.a, v => { st.a = v; B.render(); });
  B.toggleBtn('矩形', true, v => { st.rect = v; B.render(); });
  B.toggleBtnM('$2\\alpha$ 弧', true, v => { st.arc = v; B.render(); });
  const pre = v => () => { st.a = v; sA.sync(v); B.render(); };
  B.btnM('$\\alpha=\\tfrac{\\pi}{6}$', pre(Math.PI / 6));
  B.btnM('$\\alpha=\\tfrac{\\pi}{4}$', pre(Math.PI / 4));
  B.btnM('$\\alpha=\\tfrac{\\pi}{3}$', pre(Math.PI / 3));
  const cS = B.chipM('sin2α 核验'), cC = B.chipM('cos2α 三形态'), cT = B.chipM('tan2α 核验'), cR = B.chipM('面积');
  const arcPts = (t0, t1, r) => {
    const pts = [], n = 44;
    for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; pts.push(`${(O.x + r * Math.cos(t)).toFixed(1)},${(O.y - r * Math.sin(t)).toFixed(1)}`); }
    return pts.join(' ');
  };

  B.renderFn = () => {
    const a = st.a, ca = Math.cos(a), sa = Math.sin(a);
    // 坐标轴 + 单位圆
    B.seg(V(O.x - R - 22, O.y), V(O.x + R + 22, O.y), { stroke: '#2b3b53', 'stroke-width': 1.1 });
    B.seg(V(O.x, O.y + R + 22), V(O.x, O.y - R - 22), { stroke: '#2b3b53', 'stroke-width': 1.1 });
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.6 }, B.dyn);
    B.dot(O, 3, { fill: '#93a1b5' });
    // 终边 OP 与 P、P′
    const P = V(O.x + R * ca, O.y - R * sa), P2 = V(O.x - R * ca, O.y - R * sa);
    B.seg(O, P, { stroke: '#ffd166', 'stroke-width': 2.2 });
    B.dot(P, 4.5, { fill: '#ffd166' });
    B.textM(V(P.x + (P.x > O.x ? 10 : -10), P.y - 12), '$P(\\cos\\alpha,\\ \\sin\\alpha)$', { 'font-size': 11, fill: '#ffd166', 'text-anchor': P.x > O.x ? 'start' : 'end' });
    // α 弧（青）—— 弧 r40、字 r54，与金的 2α 弧之间留出空档
    if (a > 0.02) {
      mk('polyline', { points: arcPts(0, a, 40), fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.8 }, B.dyn);
      B.text(V(O.x + 54 * Math.cos(a / 2), O.y - 54 * Math.sin(a / 2)), 'α', { 'font-size': 12, fill: '#67e8f9' });
    }
    // 内接矩形：宽 2cosα、高 sinα —— 只在第一象限存在（0 < α < π/2）
    const onRect = st.rect && ca > 0.02 && sa > 0.02;
    if (onRect) {
      mk('rect', { x: O.x - R * ca, y: O.y - R * sa, width: 2 * R * ca, height: R * sa, fill: 'rgba(92,173,255,.07)', stroke: '#5cadff', 'stroke-width': 1.2, 'stroke-dasharray': '5 4' }, B.dyn);
      B.dot(P2, 4, { fill: '#5cadff' });
      B.textM(V(P2.x - 10, P2.y - 10), "$P'(-\\cos\\alpha,\\ \\sin\\alpha)$", { 'font-size': 11, fill: '#5cadff', 'text-anchor': 'end' });
      B.textM(V(O.x, O.y + 16), '宽 $2\\cos\\alpha$', { 'font-size': 11, fill: '#5cadff' });
      B.textM(V(O.x + R * ca + 8, O.y - R * sa / 2), '高 $\\sin\\alpha$', { 'font-size': 11, fill: '#5cadff', 'text-anchor': 'start' });
    }
    // 2α 弧（金）—— 每满一圈外推一环（半径 84+16j），余弧落在最外圈，2α 超过 2π 也不消失
    if (st.arc && 2 * a > 0.04) {
      const sweep = 2 * a, rings = Math.floor((sweep - 1e-9) / TAU), rest = sweep - rings * TAU;
      for (let j = 0; j < rings; j++)
        mk('polyline', { points: arcPts(0, TAU, 84 + 16 * j), fill: 'none', stroke: '#ffd166', 'stroke-width': 1.8 }, B.dyn);
      if (rest > 0.04)
        mk('polyline', { points: arcPts(0, rest, 84 + 16 * rings), fill: 'none', stroke: '#ffd166', 'stroke-width': 1.8 }, B.dyn);
      const mid = rest > 0.04 ? rest / 2 : Math.PI / 2, lr = 84 + 16 * rings + 13;
      B.text(V(O.x + lr * Math.cos(mid), O.y - lr * Math.sin(mid)), '2α', { 'font-size': 12, fill: '#ffd166' });
    }
    // 右栏：β=α 代入 M1 的三行推导
    const X = 552;
    B.tex(V(X, 96), 'β = α 代入和差公式（M1）：', { size: 14, color: '#93a1b5', anchor: 'start', w: 300 });
    B.tex(V(X, 130), '$\\sin2\\alpha=\\sin(\\alpha+\\alpha)=2\\sin\\alpha\\cos\\alpha$', { size: 15, color: '#ffd166', anchor: 'start', w: 300 });
    B.tex(V(X, 164), '$\\cos2\\alpha=\\cos^2\\alpha-\\sin^2\\alpha$', { size: 15, anchor: 'start', w: 300 });
    B.tex(V(X, 194), '$\\hphantom{\\cos2\\alpha}=2\\cos^2\\alpha-1=1-2\\sin^2\\alpha$', { size: 15, anchor: 'start', w: 300 });
    B.tex(V(X, 228), '$\\tan2\\alpha=\\dfrac{\\tan\\alpha+\\tan\\alpha}{1-\\tan\\alpha\\tan\\alpha}=\\dfrac{2\\tan\\alpha}{1-\\tan^2\\alpha}$', { size: 15, anchor: 'start', w: 320 });
    B.tex(V(X, 266), '矩形面积：$S=2\\cos\\alpha\\cdot\\sin\\alpha=\\sin2\\alpha$', { size: 14, color: '#5cadff', anchor: 'start', w: 300 });
    // chips
    const s2 = 2 * sa * ca, s2v = Math.sin(2 * a);
    cS(`$2\\sin\\alpha\\cos\\alpha=${fmt(s2, 3)}=\\sin2\\alpha=${fmt(s2v, 3)}$`, Math.abs(s2 - s2v) < 1e-9 ? 'ok' : 'warn');
    const c2 = Math.cos(2 * a);
    const f3 = [ca * ca - sa * sa, 2 * ca * ca - 1, 1 - 2 * sa * sa];
    const ok3 = f3.every(v => Math.abs(v - c2) < 1e-9);
    cC(`$\\cos^2\\alpha-\\sin^2\\alpha=${fmt(f3[0], 3)}=2\\cos^2\\alpha-1=${fmt(f3[1], 3)}=1-2\\sin^2\\alpha=${fmt(f3[2], 3)}$`, ok3 ? 'ok' : 'warn');
    const tanA = Math.abs(ca) < 1e-9 ? NaN : sa / ca;
    if (!isFinite(tanA)) cT('tan α 排除（cos α = 0），tan2α 无定义', 'warn');
    else if (Math.abs(1 - tanA * tanA) < 1e-9) cT('$1-\\tan^2\\alpha=0$：tan2α 无定义（α 距 π/4 + kπ/2）', 'warn');
    else {
      const t2 = 2 * tanA / (1 - tanA * tanA), t2v = Math.tan(2 * a);
      cT(`$\\frac{2\\tan\\alpha}{1-\\tan^2\\alpha}=${fmt(t2, 3)}=\\tan2\\alpha=${fmt(t2v, 3)}$`, Math.abs(t2 - t2v) < 1e-6 * (1 + Math.abs(t2v)) ? 'ok' : 'warn');
    }
    if (onRect) cR(`$S=2\\cos\\alpha\\cdot\\sin\\alpha=${fmt(s2, 3)}=\\sin2\\alpha$`, 'ok');
    else cR('矩形只在第一象限存在（0 < α < π/2）', '');
  };
  B.render();
  B.hintM('拖 $\\alpha$：内接矩形面积 $2\\cos\\alpha\\cdot\\sin\\alpha$ 与 $2\\alpha$ 弧上的正弦恒等 —— 倍角是和差公式 $\\beta=\\alpha$ 的特例');
  return B;
}
