/* 图 Q1 加减消元机：四个「积」都能由和差公式的两行同加减读出 —— 积化和差不是新公式，
   是 M1 的加减消元；右侧单位圆挂 α、β 两针，出处在圆上现看。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { k: 0, a: Math.PI / 3, b: Math.PI / 6 };
  const sA = B.slider('角 α', 0, TAU, Math.PI / 12, st.a, v => { st.a = v; B.render(); });
  const sB = B.slider('角 β', 0, TAU, Math.PI / 12, st.b, v => { st.b = v; B.render(); });
  const ROW_S = ['$\\sin(\\alpha+\\beta)=\\sin\\alpha\\cos\\beta+\\cos\\alpha\\sin\\beta$', '$\\sin(\\alpha-\\beta)=\\sin\\alpha\\cos\\beta-\\cos\\alpha\\sin\\beta$'];
  const ROW_C = ['$\\cos(\\alpha+\\beta)=\\cos\\alpha\\cos\\beta-\\sin\\alpha\\sin\\beta$', '$\\cos(\\alpha-\\beta)=\\cos\\alpha\\cos\\beta+\\sin\\alpha\\sin\\beta$'];
  const MODES = [
    { lab: '$\\sin\\alpha\\cos\\beta$', rows: ROW_S, opTxt: '① ＋ ②：异名交叉项对消',
      mid: '$2\\sin\\alpha\\cos\\beta=\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)$',
      res: '$\\sin\\alpha\\cos\\beta=\\tfrac{1}{2}\\bigl[\\sin(\\alpha+\\beta)+\\sin(\\alpha-\\beta)\\bigr]$',
      lhs: (a, b) => Math.sin(a) * Math.cos(b), rhs: (a, b) => 0.5 * (Math.sin(a + b) + Math.sin(a - b)) },
    { lab: '$\\cos\\alpha\\sin\\beta$', rows: ROW_S, opTxt: '② − ①：保留 cosαsinβ',
      mid: '$2\\cos\\alpha\\sin\\beta=\\sin(\\alpha+\\beta)-\\sin(\\alpha-\\beta)$',
      res: '$\\cos\\alpha\\sin\\beta=\\tfrac{1}{2}\\bigl[\\sin(\\alpha+\\beta)-\\sin(\\alpha-\\beta)\\bigr]$',
      lhs: (a, b) => Math.cos(a) * Math.sin(b), rhs: (a, b) => 0.5 * (Math.sin(a + b) - Math.sin(a - b)) },
    { lab: '$\\cos\\alpha\\cos\\beta$', rows: ROW_C, opTxt: '① ＋ ②：sin·sin 对消',
      mid: '$2\\cos\\alpha\\cos\\beta=\\cos(\\alpha+\\beta)+\\cos(\\alpha-\\beta)$',
      res: '$\\cos\\alpha\\cos\\beta=\\tfrac{1}{2}\\bigl[\\cos(\\alpha+\\beta)+\\cos(\\alpha-\\beta)\\bigr]$',
      lhs: (a, b) => Math.cos(a) * Math.cos(b), rhs: (a, b) => 0.5 * (Math.cos(a + b) + Math.cos(a - b)) },
    { lab: '$\\sin\\alpha\\sin\\beta$', rows: ROW_C, opTxt: '② − ①：保留 sinαsinβ',
      mid: '$2\\sin\\alpha\\sin\\beta=\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta)$',
      res: '$\\sin\\alpha\\sin\\beta=\\tfrac{1}{2}\\bigl[\\cos(\\alpha-\\beta)-\\cos(\\alpha+\\beta)\\bigr]$',
      lhs: (a, b) => Math.sin(a) * Math.sin(b), rhs: (a, b) => 0.5 * (Math.cos(a - b) - Math.cos(a + b)) },
  ];
  const mBtns = MODES.map((md, i) => B.btnM(md.lab, () => { st.k = i; syncM(); B.render(); }, { on: i === 0 }));
  function syncM() { mBtns.forEach((b, i) => b.classList.toggle('on', i === st.k)); }
  const cL = B.chipM('左边'), cR = B.chipM('右边'), cV = B.chipM('核验');
  const O = V(688, 258), RC = 108;
  const arcPts = (t0, t1, r) => {
    const pts = [], n = 40;
    for (let i = 0; i <= n; i++) { const t = t0 + (t1 - t0) * i / n; pts.push(`${(O.x + r * Math.cos(t)).toFixed(1)},${(O.y - r * Math.sin(t)).toFixed(1)}`); }
    return pts.join(' ');
  };

  B.renderFn = () => {
    const md = MODES[st.k], { a, b } = st;
    // 左栏：两行和差 → 加减 → 结果
    const X = 24;
    B.tex(V(X, 66), '两行和差公式（M1 出品）：', { size: 14, color: '#93a1b5', anchor: 'start', w: 320 });
    B.tex(V(X, 100), `① ${md.rows[0]}`, { size: 15, anchor: 'start', w: 330 });
    B.tex(V(X, 132), `② ${md.rows[1]}`, { size: 15, anchor: 'start', w: 330 });
    B.tex(V(X, 166), md.opTxt, { size: 14, color: '#67e8f9', anchor: 'start', w: 330 });
    B.tex(V(X, 208), md.mid, { size: 15, anchor: 'start', w: 360 });
    B.tex(V(X, 254), md.res, { size: 17, color: '#ffd166', anchor: 'start', w: 380 });
    B.tex(V(X, 296), '数值核验见下方徽章：左边 = 右边，随拖恒成立。', { size: 13, color: '#93a1b5', anchor: 'start', w: 360 });
    // 右侧单位圆：α、β 两针
    B.seg(V(O.x - RC - 14, O.y), V(O.x + RC + 14, O.y), { stroke: '#2b3b53', 'stroke-width': 1.1 });
    B.seg(V(O.x, O.y + RC + 14), V(O.x, O.y - RC - 14), { stroke: '#2b3b53', 'stroke-width': 1.1 });
    mk('circle', { cx: O.x, cy: O.y, r: RC, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.5 }, B.dyn);
    const P = V(O.x + RC * Math.cos(a), O.y - RC * Math.sin(a)), Q = V(O.x + RC * Math.cos(b), O.y - RC * Math.sin(b));
    B.seg(O, P, { stroke: '#ffd166', 'stroke-width': 2.2 });
    B.seg(O, Q, { stroke: '#5cadff', 'stroke-width': 2.2 });
    B.dot(P, 4, { fill: '#ffd166' });
    B.dot(Q, 4, { fill: '#5cadff' });
    if (a > 0.02) { mk('polyline', { points: arcPts(0, a, 40), fill: 'none', stroke: '#ffd166', 'stroke-width': 1.6 }, B.dyn); B.text(V(O.x + 56 * Math.cos(a / 2), O.y - 56 * Math.sin(a / 2)), 'α', { 'font-size': 12, fill: '#ffd166' }); }
    if (b > 0.02) { mk('polyline', { points: arcPts(0, b, 24), fill: 'none', stroke: '#5cadff', 'stroke-width': 1.6 }, B.dyn); B.text(V(O.x + 38 * Math.cos(b / 2), O.y - 38 * Math.sin(b / 2)), 'β', { 'font-size': 12, fill: '#5cadff' }); }
    // chips
    const L = md.lhs(a, b), Rv = md.rhs(a, b);
    cL(`$\\text{LHS}=${fmt(L, 3)}$`);
    cR(`$\\text{RHS}=${fmt(Rv, 3)}$`);
    cV(Math.abs(L - Rv) < 1e-9 ? '恒等：积 = 和差的半份，加减消元全程无新料' : '偏差！', Math.abs(L - Rv) < 1e-9 ? 'ok' : 'warn');
  };
  B.render();
  B.hint('按左边四个积轮着看：每个积都能从和差两行的加减里读出 —— 积化和差是 M1 的消元术，不是新公式');
  return B;
}
