/* 图 J1 · 数集检验台：八个候选数逐一检验 ℕ⊂ℤ⊂ℚ⊂ℝ
   元素与集合的关系 ∈/∉ 现场化：探针金点滑向所属数集圈的左侧隔层，
   圈内亮起金色虚线边框 —— 最里圈进得去，才算那个圈的数。
   局部坐标约定：u∈[0,860] 向右、v∈[0,470] 向下（SVG 原生方向）。 */
import { Board, mk, V } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const CX = 560, CY = 245;
  // 四圈同心椭圆：由内到外 ℕ ℤ ℚ ℝ（home 判定只看 m 向量，不看几何）
  const RINGS = [
    { sym: '$\\mathbb{N}$', lab: '自然数', rx: 88, ry: 55, col: '#ffd166' },
    { sym: '$\\mathbb{Z}$', lab: '整数', rx: 152, ry: 95, col: '#4ade80' },
    { sym: '$\\mathbb{Q}$', lab: '有理数', rx: 218, ry: 142, col: '#67e8f9' },
    { sym: '$\\mathbb{R}$', lab: '实数', rx: 284, ry: 188, col: '#5cadff' },
  ];
  const colX = h => CX - RINGS[h].rx + 46;   // 圈名与探针停靠：圈内左侧（名称不触椭圆边框）
  // m = [∈ℕ, ∈ℤ, ∈ℚ, ∈ℝ]；homeOf = 最内一圈的归属
  const CANDS = [
    { btn: '3', tex: '$x=3$', m: [1, 1, 1, 1], say: '3 是自然数：四关全过，名称落在最里圈 $\\mathbb{N}$。' },
    { btn: '0', tex: '$x=0$', m: [1, 1, 1, 1], say: '0 是自然数（现行教材 $\\mathbb{N}$ 含 0）：别把 0 挡在 $\\mathbb{N}$ 门外。' },
    { btn: '−7', tex: '$x=-7$', m: [0, 1, 1, 1], say: '−7 是负整数：$\\mathbb{N}$ 不含，自 $\\mathbb{Z}$ 成立（其后各层数集皆含）。' },
    { btn: '½', tex: '$x=\\frac{1}{2}$', m: [0, 0, 1, 1], say: '两整数之比是有理数：½ 顺利过 $\\mathbb{Q}$ 关。' },
    { btn: '−2.5', tex: '$x=-2.5$', m: [0, 0, 1, 1], say: '有限小数 $-2.5=-\\frac{5}{2}$：分数的另一种写法，$\\in\\mathbb{Q}$。' },
    { btn: '√2', tex: '$x=\\sqrt{2}$', m: [0, 0, 0, 1], say: '$\\sqrt{2}$ 是无理数：$\\mathbb{Q}$ 中无解，只能属于 $\\mathbb{R}$。' },
    { btn: 'π', tex: '$x=\\pi$', m: [0, 0, 0, 1], say: '$\\pi$ 是无理数（还是超越数）：3.14 只是它的近似。' },
    { btn: '22/7', tex: '$x=\\frac{22}{7}$', m: [0, 0, 1, 1], say: '22/7 是分数 $\\in\\mathbb{Q}$，常被误当 $\\pi$ —— 它只是 $\\pi$ 的近似值。' },
  ];
  const homeOf = c => c.m.findIndex(v => v === 1);

  const st = { p: 0, px: colX(0), py: 280, tx: colX(0), ty: 280, auto: false, tick: 0 };

  const cX = B.chipM('x'), cN = B.chip('∈ ℕ'), cZ = B.chip('∈ ℤ'), cQ = B.chip('∈ ℚ'),
    cR = B.chip('∈ ℝ'), cSay = B.chipM('判读');

  B.renderFn = () => {
    const c = CANDS[st.p], h = homeOf(c);
    // 左栏：嵌套链 + 大字读数 + 归属结论
    B.text(V(140, 56), '数系嵌套 · 逐层检验', { 'font-size': 13, fill: '#93a1b5' });
    B.tex(V(140, 102), '$\\mathbb{N}\\subset\\mathbb{Z}\\subset\\mathbb{Q}\\subset\\mathbb{R}$', { size: 16, anchor: 'mid' });
    B.tex(V(140, 178), c.tex, { size: 30, anchor: 'mid', color: '#ffd166' });
    B.tex(V(42, 244), '$x\\in\\mathbb{' + 'NZQR'[h] + '}$：属于数系嵌套中自内向外的第 ' + (h + 1) + ' 层', { size: 12, anchor: 'start' });
    // 四圈同心椭圆：由外向内叠放，越里越浓
    for (let i = RINGS.length - 1; i >= 0; i--)
      mk('ellipse', { cx: CX, cy: CY, rx: RINGS[i].rx, ry: RINGS[i].ry, fill: RINGS[i].col, 'fill-opacity': .07, stroke: RINGS[i].col, 'stroke-width': 2.2 }, B.dyn);
    // 所属圈高亮：金色虚线外套
    mk('ellipse', { cx: CX, cy: CY, rx: RINGS[h].rx + 7, ry: RINGS[h].ry + 7, fill: 'none', stroke: '#ffd166', 'stroke-width': 2.2, 'stroke-dasharray': '7 6' }, B.dyn);
    // 圈名：各圈左侧隔层安放（互不遮挡）
    for (let i = 0; i < 4; i++) {
      B.tex(V(colX(i), CY - 34), RINGS[i].sym, { size: 15, anchor: 'mid', color: RINGS[i].col });
      B.text(V(colX(i), CY - 14), RINGS[i].lab, { 'font-size': 11, fill: '#93a1b5' });
    }
    // 探针：滑行中的金点 + 头顶名牌
    B.dot(V(st.px, st.py), 9, { fill: '#ffd166' });
    B.tex(V(st.px, st.py - 30), c.tex, { size: 13, anchor: 'mid', color: '#ffd166' });
    // 徽章核验
    cX(c.tex, '');
    const mem = (i, chip) => chip(c.m[i] ? '✓ 在' : '✗ 不在', c.m[i] ? 'ok' : 'warn');
    mem(0, cN); mem(1, cZ); mem(2, cQ); mem(3, cR);
    cSay(c.say, 'ok');
  };

  const btns = CANDS.map((c, i) => B.btnM(c.btn, () => pick(i), { on: i === 0 }));
  const autoBtn = B.btn('⏩ 逐个检验', () => {
    st.auto = !st.auto; st.tick = 0;
    autoBtn.classList.toggle('on', st.auto);
    wake();
  });

  function pick(i) {
    st.p = i; st.auto = false; st.tick = 0;
    autoBtn.classList.remove('on');
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    const c = CANDS[i];
    st.tx = colX(homeOf(c)); st.ty = 280;
    B.render(); wake();
  }

  let playing = false;
  function wake() {
    if (playing) return; playing = true;
    const moving = () => Math.abs(st.tx - st.px) + Math.abs(st.ty - st.py) > .5;
    const step = () => {
      if (moving()) { st.px += (st.tx - st.px) * .18; st.py += (st.ty - st.py) * .18; B.render(); }
      else if (st.auto) {
        st.tick++;
        if (st.tick >= 105) {
          st.tick = 0;
          const i = (st.p + 1) % CANDS.length;
          st.p = i;
          btns.forEach((b, j) => b.classList.toggle('on', j === i));
          const c = CANDS[i];
          st.tx = colX(homeOf(c)); st.ty = 280;
          B.render();
        }
      }
      if (st.auto || moving()) B.raf(step); else playing = false;
    };
    B.raf(step);
  }

  B.hint('点下面的数逐一检验：ℕ⊂ℤ⊂ℚ⊂ℝ 逐层验证 —— 最里层能进入，才属于相应数集');
  B.render();
  return B;
}
