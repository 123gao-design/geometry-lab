/* 图 O2 · 量词对偶机：量词命题的否定 —— 真假互补
   数轴上下两条满足带：上带 p(x)（绿=满足、红=不满足、M 外留空），下带 ¬p(x) 颜色逐点互补 ——
   与 Y2 的 A 和 ∁U A 同一结构。否定式 = 量词翻转 + 结论取反：¬(∀x,p)=∃x,¬p、¬(∃x,p)=∀x,¬p，
   它与原命题永远一真一假；只否结论而量词不动的误写，在 p 部分成立的场合与原命题同真同假，起不到否定作用。
   局部坐标约定：u∈[0,860] 向右、v∈[0,330] 向下；px(v)=70+60(v+6)，数轴 v=140、上带 108..120、下带 170..182。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 330;
  const B = new Board(root, W, H);
  const px = v => 70 + 60 * (v + 6), inv = x => (x - 70) / 60 - 6;
  const snap = v => Math.round(v * 20) / 20;
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');

  const MDEF = {
    R: { tex: '\\mathbb{R}', in: () => true, dens: true },
    Z: { tex: '\\mathbb{Z}', in: v => Math.abs(v - Math.round(v)) < 1e-9, dens: false },
    N: { tex: '\\mathbb{N}', in: v => Math.abs(v - Math.round(v)) < 1e-9 && Math.round(v) >= 0, dens: false },
  };
  const PRE = [
    { q: 0, M: 'Z', pt: 'x^2\\le 4', pf: x => x * x <= 4 + 1e-9, nt: 'x^2>4' },
    { q: 0, M: 'R', pt: 'x\\ge 0', pf: x => x >= -1e-9, nt: 'x<0' },
    { q: 1, M: 'R', pt: 'x^2>4', pf: x => x * x > 4, nt: 'x^2\\le 4' },
    { q: 1, M: 'N', pt: 'x^2=x', pf: x => Math.abs(x * x - x) < 1e-9, nt: 'x^2\\ne x' },
  ];
  const st = { i: 0, v: 3 };

  const SAMP = [];
  for (let t = -6; t <= 6.0001; t += 0.02) SAMP.push(Math.round(t * 50) / 50);

  const runsOf = f => {
    const out = []; let s = null;
    for (let i = 0; i < SAMP.length; i++) {
      const on = f(SAMP[i]);
      if (on && s === null) s = i;
      if (!on && s !== null) { out.push([SAMP[s], SAMP[i - 1]]); s = null; }
    }
    if (s !== null) out.push([SAMP[s], SAMP[SAMP.length - 1]]);
    return out;
  };

  const cS = B.chipM('原命题'), cN = B.chipM('否定'), cW = B.chipM('误写'), cJ = B.chipM('判读'), cPr = B.chipM('探针');

  B.renderFn = () => {
    const P = PRE[st.i], M = MDEF[P.M];
    const ms = SAMP.filter(M.in);
    const allp = ms.every(P.pf), anyp = ms.some(P.pf);
    const allN = ms.every(x => !P.pf(x)), anyN = ms.some(x => !P.pf(x));
    const S = P.q === 0 ? allp : anyp;                       // 原命题真假
    const correct = P.q === 0 ? anyN : allN;                // 否定式（量词翻转）—— 恒与 S 相反
    const wrong = P.q === 0 ? allN : anyN;                  // 误写（量词没换）
    const wit = P.q === 0 ? ms.find(x => !P.pf(x)) : ms.find(P.pf);   // 反例 / 见证
    const qt = ['\\forall', '\\exists'][P.q], nq = ['\\exists', '\\forall'][P.q];
    // 命题行
    B.tex(V(430, 50), `$${qt} x\\in ${M.tex},\\ ${P.pt}$`, { size: 17, anchor: 'mid' });
    B.text(V(430, 80), '上带 p(x)、下带 ¬p(x)：两带逐点颜色互补 —— 否定式 = 量词翻转 + 结论取反',
      { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 上下两条满足带（M 外留空）
    B.tex(V(62, 114), '$p(x)$', { size: 13, anchor: 'end', color: '#4ade80' });
    B.tex(V(62, 176), '$\\neg p(x)$', { size: 13, anchor: 'end', color: '#ff9e4a' });
    if (M.dens) {
      for (const [l, r] of runsOf(t => M.in(t) && P.pf(t)))
        mk('rect', { x: px(l) - .8, y: 108, width: px(r) - px(l) + 1.6, height: 12, fill: '#4ade80', 'fill-opacity': .5 }, B.dyn);
      for (const [l, r] of runsOf(t => M.in(t) && !P.pf(t)))
        mk('rect', { x: px(l) - .8, y: 108, width: px(r) - px(l) + 1.6, height: 12, fill: '#ff7b8a', 'fill-opacity': .45 }, B.dyn);
      for (const [l, r] of runsOf(t => M.in(t) && !P.pf(t)))
        mk('rect', { x: px(l) - .8, y: 170, width: px(r) - px(l) + 1.6, height: 12, fill: '#4ade80', 'fill-opacity': .5 }, B.dyn);
      for (const [l, r] of runsOf(t => M.in(t) && P.pf(t)))
        mk('rect', { x: px(l) - .8, y: 170, width: px(r) - px(l) + 1.6, height: 12, fill: '#ff7b8a', 'fill-opacity': .45 }, B.dyn);
    } else {
      for (let t = -6; t <= 6; t++) {
        if (!M.in(t)) continue;
        mk('rect', { x: px(t) - 4, y: 110, width: 8, height: 8, fill: P.pf(t) ? '#4ade80' : '#ff7b8a', 'fill-opacity': .75 }, B.dyn);
        mk('rect', { x: px(t) - 4, y: 172, width: 8, height: 8, fill: P.pf(t) ? '#ff7b8a' : '#4ade80', 'fill-opacity': .75 }, B.dyn);
      }
    }
    // 数轴
    B.seg(V(px(-6.4), 140), V(px(6.4) + 12, 140), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `${px(6.4) + 20},140 ${px(6.4) + 10},135.5 ${px(6.4) + 10},144.5`, fill: '#8fa3bd' }, B.dyn);
    for (let t = -6; t <= 6; t++) {
      B.seg(V(px(t), 140), V(px(t), 133), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
      B.text(V(px(t), 160), String(t), { 'font-size': 11, fill: '#5c6a80' });
    }
    // 探针
    B.seg(V(px(st.v), 96), V(px(st.v), 196), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
    B.tex(V(px(st.v), 216), '$x=' + fmt(st.v, 2) + '$', { size: 13, anchor: 'mid', color: '#ffd166' });
    const inM = M.in(st.v), sat = P.pf(st.v);
    B.tex(V(430, 256), !inM ? `$x=${f1(st.v)}$：x\\notin M —— 量词只管 M 内的元素`
      : sat ? `$x=${f1(st.v)}$：p 真、¬p 假 —— 此处上带绿、下带红`
            : `$x=${f1(st.v)}$：p 假、¬p 真 —— 此处上带红、下带绿`,
      { size: 15, anchor: 'mid' });
    // 徽章
    cS(`$${qt} x\\in ${M.tex},\\ ${P.pt}$ —— ${S ? '真' : '假：x=' + f1(wit) + ' 即反例'}`, S ? 'ok' : 'warn');
    cN(`$${nq} x\\in ${M.tex},\\ ${P.nt}$ —— ${correct ? '真' : '假'}：与原命题一真一假 ✓`, correct ? 'ok' : 'warn');
    if (wrong === S) cW(`$${qt} x\\in ${M.tex},\\ ${P.nt}$ —— ${wrong ? '真' : '假'}：与原命题同真同假，量词没换，起不到否定的作用 ✗`, 'warn');
    else cW(`$${qt} x\\in ${M.tex},\\ ${P.nt}$ —— ${wrong ? '真' : '假'}：恰与原命题相反 —— 但这只是 p 处处同真或处处同假时的巧合，量词仍须换`, '');
    cJ('否定 = 量词翻转 + 结论取反；两带逐点互补 —— 与 A 和 ∁U A 同一结构', 'ok');
    cPr(inM ? `$x=${f1(st.v)}$：p ${sat ? '真' : '假'}、¬p ${sat ? '假' : '真'}` : `$x=${f1(st.v)}$：x∉M，两带留空`, inM ? '' : '');
  };

  const preBtns = PRE.map((P, i) => B.btnM('①②③④'[i] + ` $${['\\forall', '\\exists'][P.q]} x\\in ${MDEF[P.M].tex},\\ ${P.pt}$`, () => {
    st.i = i;
    preBtns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.handle({
    get: () => V(px(st.v), 140), color: '#ffd166', label: 'x',
    set: p => { st.v = snap(Math.max(-6, Math.min(6, inv(p.x)))); },
    clamp: p => V(Math.max(px(-6), Math.min(px(6), p.x)), 140),
  });

  B.hint('上带 p、下带 ¬p 逐点互补，同 A 与 ∁U A：否定 = 换量词 + 否结论，量词不换就失去一真一假');
  B.render();
  return B;
}
