/* 图 M1 弦长两式机：单位圆上 P(α)、Q(β)，橙弦 PQ 的长有两种表达式 ——
   ①两点距离公式（坐标展开）②余弦定理（夹角 α−β）；两种表达式记同一根弦 ⇒
   cos(α−β)=cosαcosβ+sinαsinβ —— 和差公式全体（sin/tan 展开）都从这根弦出发。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { a: Math.PI / 3, b: Math.PI / 6 };
  const O = V(235, 272), R = 170;
  const sA = B.slider('角 α', 0, TAU, Math.PI / 12, st.a, v => { st.a = v; B.render(); });
  const sB = B.slider('角 β', 0, TAU, Math.PI / 12, st.b, v => { st.b = v; B.render(); });
  B.btnM('α ↔ β', () => { const t = st.a; st.a = st.b; st.b = t; sA.sync(st.a); sB.sync(st.b); B.render(); });
  const cD1 = B.chipM('d 坐标式'), cD2 = B.chipM('d 余弦定理式'), cC = B.chipM('cos(α−β)'), cV = B.chipM('展开核验');
  const pt = t => V(O.x + R * Math.cos(t), O.y - R * Math.sin(t));

  B.renderFn = () => {
    const { a, b } = st;
    const P = pt(a), Q = pt(b);
    // 坐标轴 + 单位圆
    B.seg(V(O.x - R - 26, O.y), V(O.x + R + 26, O.y), { stroke: '#2b3b53', 'stroke-width': 1.1 });
    B.seg(V(O.x, O.y + R + 26), V(O.x, O.y - R - 26), { stroke: '#2b3b53', 'stroke-width': 1.1 });
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.6 }, B.dyn);
    B.dot(O, 3, { fill: '#93a1b5' });
    // 半径 OP、OQ 与端点（标签侧别避让）
    B.seg(O, P, { stroke: '#ffd166', 'stroke-width': 2.2 });
    B.seg(O, Q, { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.dot(P, 4.5, { fill: '#ffd166' });
    B.dot(Q, 4.5, { fill: '#5cadff' });
    B.textM(V(P.x + (P.x > O.x ? 10 : -10), P.y - 12), '$P(\\cos\\alpha,\\ \\sin\\alpha)$', { 'font-size': 11, fill: '#ffd166', 'text-anchor': P.x > O.x ? 'start' : 'end' });
    B.textM(V(Q.x + (Q.x > O.x ? 10 : -10), Q.y + 18), '$Q(\\cos\\beta,\\ \\sin\\beta)$', { 'font-size': 11, fill: '#5cadff', 'text-anchor': Q.x > O.x ? 'start' : 'end' });
    // 夹角小弧：从 Q 方向走有向小角到 P（wrap 到 (−π, π]）
    const d2 = ((a - b + Math.PI) % TAU + TAU) % TAU - Math.PI;
    if (Math.abs(d2) > 0.02) {
      const steps = 36, arc = [];
      for (let i = 0; i <= steps; i++) { const t = b + d2 * i / steps; arc.push(`${(O.x + 46 * Math.cos(t)).toFixed(1)},${(O.y - 46 * Math.sin(t)).toFixed(1)}`); }
      mk('polyline', { points: arc.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 1.8 }, B.dyn);
      const mid = b + d2 / 2;
      B.textM(V(O.x + 68 * Math.cos(mid), O.y - 68 * Math.sin(mid)), `$\\alpha-\\beta=${fmt(d2, 2)}`, { 'font-size': 12, fill: '#67e8f9' });
    }
    // 橙弦 PQ
    B.seg(P, Q, { stroke: '#ff9e4a', 'stroke-width': 2.6 });
    B.text(V((P.x + Q.x) / 2, (P.y + Q.y) / 2 - 12), 'd', { 'font-size': 13, fill: '#ff9e4a' });
    // 右栏：两种表达式 + 结论。竖栏起在 500：Q 的坐标标签贴着圆外往右伸，
    // 按 468 起栏时它会探进「② 余弦定理」那一行的字里去
    const X = 500;
    B.tex(V(X, 92), '① 两点距离公式（U1 坐标展开）', { size: 14, color: '#5cadff', anchor: 'start', w: 380 });
    B.tex(V(X, 124), '$d^2=(\\cos\\alpha-\\cos\\beta)^2+(\\sin\\alpha-\\sin\\beta)^2$', { size: 14, anchor: 'start', w: 380 });
    B.tex(V(X, 150), '$\\;\\;=2-2(\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta)$', { size: 14, anchor: 'start', w: 380 });
    B.tex(V(X, 192), '② 余弦定理（夹角 α−β）', { size: 14, color: '#ff9e4a', anchor: 'start', w: 380 });
    B.tex(V(X, 224), '$d^2=1^2+1^2-2\\cos(\\alpha-\\beta)=2-2\\cos(\\alpha-\\beta)$', { size: 14, anchor: 'start', w: 380 });
    B.tex(V(X, 258), '同一根弦，两种表达式必须相等 ⇒', { size: 14, color: '#93a1b5', anchor: 'start', w: 380 });
    B.tex(V(X, 296), '$\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$', { size: 17, color: '#ffd166', anchor: 'start', w: 400 });
    // chips：两种表达式的弦长现场核验
    const sv = Math.cos(a) * Math.cos(b) + Math.sin(a) * Math.sin(b);
    const cv = Math.cos(a - b);
    cD1(`$d=\\sqrt{2-2(\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta)}=${fmt(Math.sqrt(Math.max(0, 2 - 2 * sv)), 3)}$`);
    cD2(`$d=\\sqrt{2-2\\cos(\\alpha-\\beta)}=${fmt(Math.sqrt(Math.max(0, 2 - 2 * cv)), 3)}$`);
    cC(`$\\cos(\\alpha-\\beta)=${fmt(cv, 3)}$`);
    cV(`$\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta=${fmt(sv, 3)}$`, Math.abs(sv - cv) < 1e-9 ? 'ok' : 'warn');
  };
  B.render();
  B.hint('拖 α、β：橙弦 PQ 只认两半径的夹角 —— 坐标展开与余弦定理殊途同归，cos(α−β) 的展开式随即得到');
  return B;
}
