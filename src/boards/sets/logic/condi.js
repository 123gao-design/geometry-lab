/* 图 O4 · 充要判定机：充分条件与必要条件 —— 真值集的包含关系
   蓝带 A={x|p(x)} 是 p 的真值集、橙带 B={x|q(x)} 是 q 的：p⇒q ⟺ A⊆B（小范围推出大范围），
   q⇒p ⟺ B⊆A。两向都成立即充要（A=B），都不成立即既不充分也不必要。
   探针落在 A∖B 或 B∖A 的位置，当场读出对应方向的「反例元素」。
   局部坐标约定：u∈[0,860] 向右、v∈[0,330] 向下；px(v)=70+60(v+6)，数轴 v=196、A 带 182..194、B 带 198..210。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 330;
  const B = new Board(root, W, H);
  const px = v => 70 + 60 * (v + 6), inv = x => (x - 70) / 60 - 6;
  const snap = v => Math.round(v * 20) / 20;
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');

  const PRE = [
    { pt: 'x>2', qt: 'x>1', pn: 'x>2', qn: 'x>1', pf: x => x > 2, qf: x => x > 1, sub: 'AB', label: '充分不必要',
      eA: [{ v: 2, open: true }], eB: [{ v: 1, open: true }] },
    { pt: 'x>1', qt: 'x>2', pn: 'x>1', qn: 'x>2', pf: x => x > 1, qf: x => x > 2, sub: 'BA', label: '必要不充分',
      eA: [{ v: 1, open: true }], eB: [{ v: 2, open: true }] },
    { pt: '|x|>1', qt: 'x^2>1', pn: '|x|>1', qn: 'x^2>1', pf: x => Math.abs(x) > 1, qf: x => x * x > 1, sub: 'both', label: '充要',
      eA: [{ v: -1, open: true }, { v: 1, open: true }], eB: [{ v: -1, open: true }, { v: 1, open: true }] },
    { pt: 'x>0', qt: '|x|>1', pn: 'x>0', qn: '|x|>1', pf: x => x > 0, qf: x => Math.abs(x) > 1, sub: 'none', label: '既不充分也不必要',
      eA: [{ v: 0, open: true }], eB: [{ v: -1, open: true }, { v: 1, open: true }] },
  ];
  const st = { i: 0, v: 2.5 };

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
  const dots = (list, y, col) => {
    for (const e of list) B.dot(V(px(e.v), y), 6.5, e.open ? { fill: '#0a0d14', stroke: col, 'stroke-width': 2 } : { fill: col });
  };

  const cA = B.chipM('p⇒q'), cB = B.chipM('q⇒p'), cV = B.chipM('判定'), cPr = B.chipM('探针');

  B.renderFn = () => {
    const P = PRE[st.i];
    B.tex(V(430, 46), `$p:\\ ${P.pt}\\qquad q:\\ ${P.qt}$`, { size: 16, anchor: 'mid' });
    B.text(V(430, 76), '集合观点：A={x | p(x)}、B={x | q(x)} —— A⊆B ⟺ p⇒q，谁含住谁，谁就推出谁',
      { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'middle' });
    // 两条真值集带
    B.tex(V(62, 188), '$A$', { size: 15, anchor: 'end', color: '#5cadff' });
    B.tex(V(62, 204), '$B$', { size: 15, anchor: 'end', color: '#ff9e4a' });
    for (const [l, r] of runsOf(P.pf))
      mk('rect', { x: px(l) - .8, y: 182, width: px(r) - px(l) + 1.6, height: 12, fill: '#5cadff', 'fill-opacity': .4 }, B.dyn);
    for (const [l, r] of runsOf(P.qf))
      mk('rect', { x: px(l) - .8, y: 198, width: px(r) - px(l) + 1.6, height: 12, fill: '#ff9e4a', 'fill-opacity': .4 }, B.dyn);
    dots(P.eA, 188, '#5cadff');
    dots(P.eB, 204, '#ff9e4a');
    // 数轴
    B.seg(V(px(-6.4), 196), V(px(6.4) + 12, 196), { stroke: '#8fa3bd', 'stroke-width': 1.6 });
    mk('polygon', { points: `${px(6.4) + 20},196 ${px(6.4) + 10},191.5 ${px(6.4) + 10},200.5`, fill: '#8fa3bd' }, B.dyn);
    for (let t = -6; t <= 6; t++) {
      B.seg(V(px(t), 196), V(px(t), 189), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
      B.text(V(px(t), 216), String(t), { 'font-size': 11, fill: '#5c6a80' });
    }
    // 探针
    B.seg(V(px(st.v), 158), V(px(st.v), 238), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
    B.tex(V(px(st.v), 240), '$x=' + fmt(st.v, 2) + '$', { size: 13, anchor: 'mid', color: '#ffd166' });
    // 逐点读数
    const inA = P.pf(st.v), inB = P.qf(st.v);
    B.tex(V(430, 288),
      inA && !inB ? `$x=${f1(st.v)}$：p 成立、q 不成立 —— 在 A∖B 内，p⇒q 的反例元素`
      : !inA && inB ? `$x=${f1(st.v)}$：p 不成立、q 成立 —— 在 B∖A 内，q⇒p 的反例元素`
      : inA && inB ? `$x=${f1(st.v)}$：p、q 同时成立 —— 在 A∩B 内`
                   : `$x=${f1(st.v)}$：p、q 都不成立 —— 在两条带之外`,
      { size: 15, anchor: 'mid' });
    // 徽章
    const hasAB = P.sub === 'AB' || P.sub === 'both', hasBA = P.sub === 'BA' || P.sub === 'both';
    cA(hasAB ? 'A⊆B：成立 —— p 是 q 的充分条件' : 'A⊄B：不成立 —— A∖B 非空，p 推不出 q', hasAB ? 'ok' : 'warn');
    cB(hasBA ? 'B⊆A：成立 —— q 是 p 的充分条件（p 是 q 的必要条件）' : 'B⊄A：不成立 —— B∖A 非空，q 推不出 p', hasBA ? 'ok' : 'warn');
    cV(`${P.pn} 是 ${P.qn} 的${P.label}条件`, P.sub === 'none' ? 'warn' : 'ok');
    cPr(`$x=${f1(st.v)}$：p ${inA ? '✓' : '✗'}、q ${inB ? '✓' : '✗'}${inA !== inB ? ' —— 反例元素在此' : ''}`, inA !== inB ? 'warn' : '');
  };

  const preBtns = PRE.map((P, i) => B.btnM('①②③④'[i] + ` $p:\\ ${P.pt},\\ q:\\ ${P.qt}$`, () => {
    st.i = i;
    preBtns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  B.handle({
    get: () => V(px(st.v), 196), color: '#ffd166', label: 'x',
    set: p => { st.v = snap(Math.max(-6, Math.min(6, inv(p.x)))); },
    clamp: p => V(Math.max(px(-6), Math.min(px(6), p.x)), 196),
  });

  B.hint('蓝带 A={x|p}、橙带 B={x|q}：谁含住谁，谁就推出谁；探针落在带外处，当场读出反例');
  B.render();
  return B;
}
