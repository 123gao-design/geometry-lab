/* 图 O1 · 量词判定机：全称量词与存在量词 —— 真假的判定
   数轴上方一条「满足情况带」：M 内满足 p 的位置染绿、不满足染红、M 外留空（量词只管前置集合）。
   全称命题为假当且仅当带内出现红 —— 红处即反例；为真则须证明（逐点检验数不完）。
   存在命题为真当且仅当带内出现绿 —— 绿处即见证；为假则须论证 M 内无解。
   探针逐点读数，x∉M 时提示前置集合之外命题不作断言；「换量词」对照 ∀ 与 ∃ 的真假变化。
   局部坐标约定：u∈[0,860] 向右、v∈[0,210] 向下；px(v)=70+60(v+6)，数轴 v=128、满足带 100..112，
   刻度数字 v=152、探针读数 v=174，外框 20..196 为圆角虚线。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { createDiagram, plotInk, glowDot } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 212;
  root.classList.add('atlas-board', 'quants-board');
  const B = createDiagram(root, W, H, '量词判定机：全称与存在命题的真假');
  const px = v => 70 + 60 * (v + 6), inv = x => (x - 70) / 60 - 6;
  const snap = v => Math.round(v * 20) / 20;
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');

  const MDEF = {
    R: { tex: '\\mathbb{R}', in: () => true, dens: true, name: '实数集 ℝ' },
    Z: { tex: '\\mathbb{Z}', in: v => Math.abs(v - Math.round(v)) < 1e-9, dens: false, name: '整数集 ℤ' },
    N: { tex: '\\mathbb{N}', in: v => Math.abs(v - Math.round(v)) < 1e-9 && Math.round(v) >= 0, dens: false, name: '自然数集 ℕ' },
  };
  const PRE = [
    { q: 0, M: 'R', t: 'x^2\\ge 0', p: x => x * x >= -1e-9 },
    { q: 0, M: 'R', t: 'x^2>x', p: x => x * x > x },
    { q: 0, M: 'N', t: 'x^2\\ge x', p: x => x * x >= x },
    { q: 1, M: 'Z', t: 'x^2=2', p: x => Math.abs(x * x - 2) < 1e-9 },
    { q: 1, M: 'R', t: 'x^2=x', p: x => Math.abs(x * x - x) < 1e-9 },
  ];
  const st = { i: 0, v: 2.5, flipped: false, prev: null, auto: false, dir: 1 };

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
  const evaluate = q => {
    const P = PRE[st.i], M = MDEF[P.M], ms = SAMP.filter(M.in);
    const allT = ms.every(P.p), anyT = ms.some(P.p);
    return { truth: q === 0 ? allT : anyT, firstFail: ms.find(x => !P.p(x)), firstPass: ms.find(P.p) };
  };

  B.setAppearanceBackground(['光晕', '细网格'], grid => { root.dataset.texture = grid ? 'grid' : 'halo'; });

  const cSay = B.readout('断言'), cPr = B.readout('探针', 'gold');
  const cV = B.chipM('判定');

  B.renderFn = () => {
    const P = PRE[st.i], M = MDEF[P.M];
    const qEff = P.q ^ (st.flipped ? 1 : 0);
    const qt = qEff === 0 ? '\\forall' : '\\exists';
    const { truth, firstFail, firstPass } = evaluate(qEff);
    // 圆角虚线框：把数轴、满足带与探针收在同一个图区里
    mk('rect', { x: 20, y: 12, width: 820, height: 184, rx: 16, fill: 'none', stroke: plotInk.accent, 'stroke-opacity': .75, 'stroke-width': 1.4, 'stroke-dasharray': '7 6' }, B.dyn);
    // 命题与断言
    B.tex(V(430, 40), `$${qt} x\\in ${M.tex},\\ ${P.t}$`, { size: 17, anchor: 'mid' });
    cSay(qEff === 0 ? '全称：' + M.name + ' 内每一个 $x$ 都使 $p(x)$ 成立' : '存在：' + M.name + ' 内至少有一个 $x$ 使 $p(x)$ 成立');
    // 满足情况带（M 外留空 = 命题不作断言）
    B.tex(V(62, 106), '$p(x)$', { size: 13, anchor: 'end', color: plotInk.green });
    if (M.dens) {
      for (const [l, r] of runsOf(t => M.in(t) && P.p(t)))
        mk('rect', { x: px(l) - .8, y: 100, width: px(r) - px(l) + 1.6, height: 12, fill: plotInk.green, 'fill-opacity': .5 }, B.dyn);
      for (const [l, r] of runsOf(t => M.in(t) && !P.p(t)))
        mk('rect', { x: px(l) - .8, y: 100, width: px(r) - px(l) + 1.6, height: 12, fill: plotInk.rose, 'fill-opacity': .45 }, B.dyn);
    } else {
      for (let t = -6; t <= 6; t++) {
        if (!M.in(t)) continue;
        mk('rect', { x: px(t) - 4, y: 102, width: 8, height: 8, fill: P.p(t) ? plotInk.green : plotInk.rose, 'fill-opacity': .75 }, B.dyn);
      }
    }
    // 数轴
    B.seg(V(px(-6.4), 128), V(px(6.4) + 12, 128), { stroke: plotInk.axis, 'stroke-width': 1.6 });
    mk('polygon', { points: `${px(6.4) + 20},128 ${px(6.4) + 10},123.5 ${px(6.4) + 10},132.5`, fill: plotInk.axis }, B.dyn);
    for (let t = -6; t <= 6; t++) {
      B.seg(V(px(t), 128), V(px(t), 121), { stroke: plotInk.guide, 'stroke-width': 1.2 });
      B.text(V(px(t), 152), String(t), { 'font-size': 11, fill: plotInk.guide, style: 'fill:' + plotInk.guide });
    }
    // 探针：竖直参考线 + 多层柔光 + 实心芯，读数放在刻度数字下面
    B.seg(V(px(st.v), 70), V(px(st.v), 128), { stroke: plotInk.gold, 'stroke-width': 1.2, 'stroke-dasharray': '4 4' });
    glowDot(B, V(px(st.v), 128), plotInk.gold, 18, 6);
    B.tex(V(px(st.v), 174), '$x=' + fmt(st.v, 2) + '$', { size: 13, anchor: 'mid', color: plotInk.gold });
    // 逐点读数
    const inM = M.in(st.v), sat = P.p(st.v);
    // 徽章
    cPr(inM ? (sat ? `$x=${f1(st.v)}$：$p(x)$ 满足 ✓` : `$x=${f1(st.v)}$：$p(x)$ 不满足 ✗`)
            : `$x=${f1(st.v)}$：$x\\notin M$，量词只管 $M$ 内的元素`, inM ? (sat ? 'ok' : 'warn') : '');
    let vt, vcls;
    if (qEff === 0) {
      if (truth) { vt = `真：带内全绿 —— 这须要证明（对一切 x 论证），逐点检验数不完`; vcls = 'ok'; }
      else { vt = `假：红处即反例 —— x=${f1(firstFail)} 就推翻，一个反例即够`; vcls = 'warn'; }
    } else {
      if (truth) { vt = `真：绿处即见证 —— x=${f1(firstPass)} 就成立，一个见证即够`; vcls = 'ok'; }
      else { vt = `假：带内全红，找不到见证 —— 这须要论证「M 内无解」`; vcls = 'warn'; }
    }
    if (st.flipped) vt += `（换量词前：${st.prev ? '真' : '假'} —— 换量词即换命题）`;
    cV(vt, vcls);
  };

  const preBtns = PRE.map((P, i) => B.btnM('①②③④⑤'[i] + ` $${['\\forall', '\\exists'][P.q]} x\\in ${MDEF[P.M].tex},\\ ${P.t}$`, () => {
    st.i = i; st.flipped = false;
    preBtns.forEach((b, j) => b.classList.toggle('on', j === i));
    flipBtn.classList.remove('on');
    B.render();
  }, { on: i === 0 }));
  const flipBtn = B.btnM('换量词 ∀↔∃', () => {
    st.prev = evaluate(PRE[st.i].q ^ (st.flipped ? 1 : 0)).truth;
    st.flipped = !st.flipped;
    flipBtn.classList.toggle('on', st.flipped);
    B.render();
  });
  const scanBtn = B.btn('⏩ 探针扫轴', () => {
    st.auto = !st.auto; scanBtn.classList.toggle('on', st.auto);
    if (st.auto) {
      const step = () => {
        if (!st.auto) return;
        let nv = st.v + st.dir * .05;
        if (nv >= 6) { nv = 6; st.dir = -1; }
        if (nv <= -6) { nv = -6; st.dir = 1; }
        st.v = snap(nv); B.render();
        B.raf(step);
      };
      B.raf(step);
    }
  });

  B.handle({
    get: () => V(px(st.v), 128), color: plotInk.gold, label: 'x',
    set: p => { st.v = snap(Math.max(-6, Math.min(6, inv(p.x)))); },
    clamp: p => V(Math.max(px(-6), Math.min(px(6), p.x)), 128),
  });

  B.render();
  return B;
}
