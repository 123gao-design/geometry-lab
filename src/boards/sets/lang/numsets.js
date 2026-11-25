/* 图 J1 · 数系嵌套和逐层检验 */
import { mk, V } from '../../../lib/board.js';
import { createDiagram, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 576, H = 420, CX = W / 2, CY = 208, probeY = 228;
  const B = createDiagram(root, W, H, '自然数、整数、有理数和实数的嵌套关系');
  root.classList.add('numsets-board');
  const glowId = B.uid + '-numsets-probe-glow';
  const glow = mk('radialGradient', { id: glowId }, B.svg.querySelector('defs'));
  for (const [offset, opacity] of [[0, .58], [.3, .38], [.64, .11], [1, 0]]) {
    mk('stop', { offset, 'stop-color': plotInk.amber, 'stop-opacity': opacity }, glow);
  }
  const stars = Array.from({ length: 42 }, (_, i) => {
    const x = 2 + 96 * (((i + 1) * .618034) % 1);
    const y = 2 + 96 * (((i + 1) * .754878) % 1);
    const bright = i % 7 === 0;
    const tint = bright ? '--numsets-glint' : '--numsets-spark';
    return `radial-gradient(circle at ${x.toFixed(2)}% ${y.toFixed(2)}%, var(${tint}), transparent ${bright ? 1.5 : 1.05}px)`;
  });
  root.style.setProperty('--numsets-stars', stars.join(','));
  B.setAppearanceBackground(['光晕', '细网格'], grid => { root.dataset.texture = grid ? 'grid' : 'halo'; });

  // 四圈同心椭圆：由内到外 ℕ ℤ ℚ ℝ（home 判定只看 m 向量，不看几何）
  const RINGS = [
    { sym: '$\\mathbb{N}$', lab: '自然数', rx: 90, ry: 49 },
    { sym: '$\\mathbb{Z}$', lab: '整数', rx: 147, ry: 83 },
    { sym: '$\\mathbb{Q}$', lab: '有理数', rx: 204, ry: 117 },
    { sym: '$\\mathbb{R}$', lab: '实数', rx: 261, ry: 151 },
  ];
  const probeX = h => CX - RINGS[h].rx + 32;
  // m = [∈ℕ, ∈ℤ, ∈ℚ, ∈ℝ]；homeOf = 最内一圈的归属
  const CANDS = [
    { btn: '3', tex: '$x=3$', m: [1, 1, 1, 1], say: '3 是自然数，也属于外侧的三层数集。' },
    { btn: '0', tex: '$x=0$', m: [1, 1, 1, 1], say: '本章采用含 0 的自然数定义，因此四层都成立。' },
    { btn: '−7', tex: '$x=-7$', m: [0, 1, 1, 1], say: '$-7$ 是负整数，从整数层起都成立。' },
    { btn: '½', tex: '$x=\\frac{1}{2}$', m: [0, 0, 1, 1], say: '$\\frac{1}{2}$ 是两个整数的比，从有理数层起成立。' },
    { btn: '−2.5', tex: '$x=-2.5$', m: [0, 0, 1, 1], say: '$-2.5=-\\frac{5}{2}$，可写成整数之比。' },
    { btn: '√2', tex: '$x=\\sqrt{2}$', m: [0, 0, 0, 1], say: '$\\sqrt{2}$ 无法写成整数之比，是实数中的无理数。' },
    { btn: 'π', tex: '$x=\\pi$', m: [0, 0, 0, 1], say: '$\\pi$ 是无理数，3.14 是它的近似值。' },
    { btn: '22/7', tex: '$x=\\frac{22}{7}$', m: [0, 0, 1, 1], say: '$\\frac{22}{7}$ 是有理数，可用来近似 $\\pi$。' },
  ];
  const homeOf = c => c.m.findIndex(v => v === 1);

  const st = { p: 0, px: probeX(0), tx: probeX(0), auto: false, tick: 0, reveal: RINGS.length };

  B.chipRow.setAttribute('role', 'group');
  B.chipRow.setAttribute('aria-label', '数集判读');
  const answer = B.chipM('所属最小数集');
  answer.el.dataset.readout = 'answer';
  const checks = RINGS.map(({ sym, lab }) => B.chipM(sym + ' ' + lab));
  const reason = B.chipM('依据');
  reason.el.dataset.readout = 'reason';

  function updateReadout() {
    const c = CANDS[st.p];
    answer(RINGS[homeOf(c)].sym);
    checks.forEach((chip, i) => {
      if (i >= st.reveal) chip('待检验');
      else chip(c.m[i] ? '✓ 属于' : '× 不属于', c.m[i] ? 'ok' : 'warn');
    });
    reason(c.say);
  }

  B.renderFn = () => {
    const c = CANDS[st.p], selected = homeOf(c);
    mk('rect', { x: 12, y: 14, width: W - 24, height: H - 28, rx: 12, fill: 'none', stroke: plotInk.axis }, B.dyn);
    B.seg(V(22, probeY), V(554, probeY), { stroke: plotInk.axis, 'stroke-width': 1, 'stroke-dasharray': '4 6' });
    for (let i = RINGS.length - 1; i >= 0; i--) {
      const { rx, ry } = RINGS[i];
      const active = i === selected;
      mk('ellipse', {
        cx: CX, cy: CY, rx, ry,
        fill: active ? plotInk.amber : plotInk.blue, 'fill-opacity': active ? .10 : .034,
        stroke: active ? plotInk.amber : plotInk.blue, 'stroke-width': active ? 2.8 : 1.7,
        'stroke-opacity': active ? 1 : .8,
      }, B.dyn);
    }
    // 圈名固定在各自顶部留白，候选数固定放在图形下方。
    RINGS.forEach(({ sym, ry }, i) => B.tex(V(CX, CY - ry + 17), sym, {
      size: 20, anchor: 'mid', color: i === selected ? plotInk.amber : plotInk.ink, w: 52,
    }));
    const probe = V(st.px, probeY);
    B.dot(probe, 18, { fill: 'url(#' + glowId + ')', 'pointer-events': 'none' });
    B.dot(probe, 5.5, { fill: plotInk.amber });
    B.tex(V(CX, 382), c.tex, { size: 20, anchor: 'mid', color: plotInk.amber, w: 120 });
  };

  const btns = CANDS.map((c, i) => B.btn(c.btn, () => {
    setAuto(false);
    select(i);
    wake();
  }, { on: i === 0 }));
  const autoBtn = B.btn('逐个检验', () => { setAuto(!st.auto); wake(); });
  autoBtn.classList.add('numsets-auto');
  function setAuto(active) {
    st.auto = active;
    st.tick = 0;
    autoBtn.textContent = active ? '暂停检验' : '逐个检验';
    autoBtn.classList.toggle('on', active);
    autoBtn.setAttribute('aria-pressed', String(active));
  }

  let revealTimers = [];
  function select(i) {
    st.p = i;
    st.tx = probeX(homeOf(CANDS[i]));
    btns.forEach((button, j) => {
      button.classList.toggle('on', j === i);
      button.setAttribute('aria-pressed', String(j === i));
    });
    revealTimers.forEach(clearTimeout);
    st.reveal = 0;
    revealTimers = RINGS.map((_, j) => setTimeout(() => {
      if (!root.isConnected) return;
      st.reveal = j + 1;
      updateReadout();
    }, (j + 1) * 150));
    updateReadout();
    B.render();
  }
  let playing = false;
  function wake() {
    if (playing) return; playing = true;
    const moving = () => Math.abs(st.tx - st.px) > .5;
    const step = () => {
      if (moving()) {
        st.px += (st.tx - st.px) * .18;
        if (!moving()) st.px = st.tx;
        B.render();
      } else if (st.auto && ++st.tick >= 105) {
        st.tick = 0;
        select((st.p + 1) % CANDS.length);
      }
      if (st.auto || moving()) B.raf(step); else playing = false;
    };
    B.raf(step);
  }

  btns.forEach((button, i) => button.setAttribute('aria-pressed', String(i === 0)));
  setAuto(false);
  updateReadout();
  B.render();
  return B;
}
