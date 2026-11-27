/* 图 X2 · 子集家族机：n 个元素的 2ⁿ 个子集全部展示
   整张图套在一只圆角虚线框里：左侧是方形母集 A 与「留/去」按钮，右侧按元素个数 k 分行陈列全部子集。
   点按钮切留/去、点卡片选定子集；选中的按钮与卡片带一圈柔光。四口径计数实时核验。
   局部坐标约定：u∈[0,860] 向右、v∈[0,380] 向下（SVG 原生方向）。 */
import { mk, V } from '../../../lib/board.js';
import { createDiagram } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 350;
  root.classList.add('atlas-board', 'subfamily-board');
  const B = createDiagram(root, W, H, '子集家族机：逐个元素留或去，列出全部子集');
  const OUT = { x: 24, y: 10, w: 812, h: 326 };                    // 整图外围虚线框
  const SET = { x: 64, w: 160, h: 160 };                           // 方形母集 A（纵向位置在重绘时按框居中）
  const POS = [[40, 45], [120, 45], [40, 115], [120, 115]];        // 元素 a b c d 相对母集左上角的位置
  const TOG = { s: 34, gap: 8, gapY: 18 };                         // 「留/去」按钮：在母集正下方居中
  const GRID = { cx: 630, rh: 56, cw: 54, ch: 34, gap: 6 };        // 右侧卡片网格（行组在框内纵向居中）
  const st = { n: 3, mask: 0b101, auto: false, tick: 0 };

  B.setAppearanceBackground(['光晕', '细网格'], grid => { root.dataset.texture = grid ? 'grid' : 'halo'; });

  // 柔光滤镜：选中按钮 / 卡片背后垫一块模糊的金色块
  const glowId = B.uid + '-x2-glow';
  const glowFilter = mk('filter', { id: glowId, x: '-80%', y: '-80%', width: '260%', height: '260%' }, B.svg.querySelector('defs'));
  mk('feGaussianBlur', { stdDeviation: 5 }, glowFilter);

  const cS = B.chipM('当前子集');
  const total = B.readout('全部子集'), proper = B.readout('真子集', 'gold');
  const nonempty = B.readout('非空子集', 'mint'), both = B.readout('非空真子集', 'violet');
  const cV = B.chipM('判读');

  // 全部子集：按 |S| 分组、组内按数值序
  const subsets = n => {
    const out = [];
    for (let m = 0; m < (1 << n); m++) out.push(m);
    return out.sort((p, q) => {
      const bp = p.toString(2).replace(/0/g, '').length, bq = q.toString(2).replace(/0/g, '').length;
      return bp - bq || p - q;
    });
  };
  const bits = (m, n) => [...Array(n).keys()].filter(i => m >> i & 1);
  const cardLab = (m, n) => { const b = bits(m, n); return b.length ? b.map(i => 'abcd'[i]).join('') : '∅'; };
  // 深色纸面下把填充率提上来，浅色纸面下收回去 —— 同一组语义色在两种底上都要看得清
  const paperIsDark = () => {
    const m = /^#([0-9a-f]{6})$/i.exec(B._bgCol || '');
    if (m) {
      const v = parseInt(m[1], 16);
      const f = x => { x /= 255; return x <= .03928 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4; };
      return .2126 * f((v >> 16) & 255) + .7152 * f((v >> 8) & 255) + .0722 * f(v & 255) < .42;
    }
    return !document.documentElement.classList.contains('light');
  };

  B.renderFn = () => {
    const n = st.n, S = subsets(n), cur = st.mask & ((1 << n) - 1);
    const curBits = new Set(bits(cur, n));
    const dark = paperIsDark();
    // 把当前方案的语义色读成实色：深底用亮家族、浅底用暗家族，读不到变量也能退到这两套
    const fb = dark
      ? { ink: '#e8eef5', blue: '#95b9e5', gold: '#d5a77f', guide: '#a0aec2', accent: '#95b9e5', paper: '#0a0d14' }
      : { ink: '#202d3a', blue: '#2b598c', gold: '#8a5529', guide: '#56677a', accent: '#2b598c', paper: '#f7fbff' };
    let cs = null;
    try { cs = getComputedStyle(B.root); } catch (_) { /* 无头环境 */ }
    const C = {};
    for (const k of Object.keys(fb)) {
      let v = '';
      try { v = cs ? cs.getPropertyValue('--pj-' + k).trim() : ''; } catch (_) { /* ignore */ }
      C[k] = v || fb[k];
    }
    // 纵向居中：左侧「母集 + 按钮」与右侧行组都以虚线框的中线为基准
    const cy = OUT.y + OUT.h / 2;
    const setY = cy - (SET.h + TOG.gapY + TOG.s) / 2;
    // 整图外围：圆角虚线框（集合与 k 行都在里面），颜色取当前方案的强调色
    mk('rect', {
      x: OUT.x, y: OUT.y, width: OUT.w, height: OUT.h, rx: 16, fill: 'none',
      stroke: C.accent, 'stroke-opacity': dark ? .9 : .7, 'stroke-width': 1.4, 'stroke-dasharray': '7 6',
    }, B.dyn);
    // 方形母集 A
    mk('rect', { x: SET.x, y: setY, width: SET.w, height: SET.h, rx: 12, fill: C.blue, 'fill-opacity': dark ? .18 : .09, stroke: C.blue, 'stroke-width': 2.2 }, B.dyn);
    B.tex(V(SET.x + 14, setY + 20), '$A$', { size: 14, anchor: 'start', color: C.blue });
    for (let i = 0; i < n; i++) {
      const on = curBits.has(i);
      const ex = SET.x + POS[i][0], ey = setY + POS[i][1];
      B.dot(V(ex, ey), 8, on
        ? { fill: C.gold }
        : { fill: C.guide, 'fill-opacity': dark ? .5 : .24, stroke: C.guide, 'stroke-width': 1.6 });
      B.text(V(ex, ey - 14), 'abcd'[i], {
        'font-size': 14, 'pointer-events': 'none',
        fill: on ? C.gold : C.ink, style: 'fill:' + (on ? C.gold : C.ink),
      });
    }
    // 「留/去」按钮：在母集正下方居中，n 个按钮的整体宽度随 n 变
    const tw = n * TOG.s + (n - 1) * TOG.gap;
    const tx0 = SET.x + SET.w / 2 - tw / 2;
    const ty = setY + SET.h + TOG.gapY;
    for (let i = 0; i < n; i++) {
      const on = curBits.has(i);
      const x = tx0 + i * (TOG.s + TOG.gap);
      if (on) mk('rect', { x: x - 4, y: ty - 4, width: TOG.s + 8, height: TOG.s + 8, rx: 11, fill: C.gold, 'fill-opacity': .55, filter: `url(#${glowId})` }, B.dyn);
      const bx = mk('rect', {
        x, y: ty, width: TOG.s, height: TOG.s, rx: 7, 'data-bit': i,
        fill: on ? C.gold : C.guide, 'fill-opacity': on ? 1 : (dark ? .5 : .26),
        stroke: on ? C.gold : C.guide, 'stroke-width': on ? 2 : 1.6,
        'stroke-opacity': on ? 1 : dark ? .9 : .75,
      }, B.dyn);
      bx.addEventListener('click', () => { st.mask ^= 1 << i; st.auto = false; autoBtn.classList.remove('on'); B.render(); });
      B.text(V(x + TOG.s / 2, ty + 23), 'abcd'[i], {
        'font-size': 14, 'font-weight': 700, 'pointer-events': 'none',
        fill: on ? C.paper : C.ink, style: 'fill:' + (on ? C.paper : C.ink) + ';stroke:none',
      });
    }
    // 右侧家族网格：行 k = 元素个数，卡片 = 每个子集；行组在虚线框内纵向居中
    const rows = n + 1, gh = (rows - 1) * GRID.rh + GRID.ch;
    const gy0 = cy - gh / 2;
    for (let k = 0; k <= n; k++) {
      const row = S.filter(m => bits(m, n).length === k), y = gy0 + k * GRID.rh;
      B.tex(V(410, y + 21), '$k=' + k + '$：$' + row.length + '$ 个', { size: 12, anchor: 'end', color: C.guide });
      const wTot = row.length * (GRID.cw + GRID.gap) - GRID.gap, x0 = GRID.cx - wTot / 2;
      row.forEach((m, j) => {
        const hit = m === cur, x = x0 + j * (GRID.cw + GRID.gap);
        if (hit) mk('rect', { x: x - 4, y: y - 4, width: GRID.cw + 8, height: GRID.ch + 8, rx: 11, fill: C.gold, 'fill-opacity': .5, filter: `url(#${glowId})` }, B.dyn);
        const rc = mk('rect', {
          x, y, width: GRID.cw, height: GRID.ch, rx: 7, 'data-card': m,
          fill: hit ? C.gold : C.guide,
          'fill-opacity': hit ? .5 : (dark ? .34 : .16),
          stroke: hit ? C.gold : C.guide, 'stroke-width': hit ? 2 : 1,
          'stroke-opacity': hit ? 1 : dark ? .8 : .6,
        }, B.dyn);
        rc.addEventListener('click', () => { st.mask = m; st.auto = false; autoBtn.classList.remove('on'); B.render(); });
        B.text(V(x + GRID.cw / 2, y + GRID.ch / 2 + 4), cardLab(m, n), {
          'font-size': 12, 'pointer-events': 'none',
          fill: C.ink, style: 'fill:' + C.ink + ';stroke:none',
        });
        if (hit) mk('rect', { x: x - 3, y: y - 3, width: GRID.cw + 6, height: GRID.ch + 6, rx: 9, fill: 'none', stroke: C.gold, 'stroke-width': 1.2, 'stroke-dasharray': '3 3' }, B.dyn);
      });
    }
    // 徽章
    cS(bits(cur, n).length ? '$S=\\{' + bits(cur, n).map(i => 'abcd'[i]).join(',') + '\\}$' : '$S=\\varnothing$', '');
    const tot = 1 << n;
    total(`$2^${n}=${tot}$`);
    proper(`$2^${n}-1=${tot - 1}$`);
    nonempty(`$2^${n}-1=${tot - 1}$`);
    both(`$2^${n}-2=${tot - 2}$`);
    if (cur === (1 << n) - 1 && n > 0) cV('这是 $A$ 本身：从 $2^' + n + '$ 里减去它才是真子集口径（' + (tot - 1) + ' 个）', 'warn');
    else if (cur === 0) cV('空集 $\\varnothing$：讨论「非空」口径时要减去它 —— 但 $\\varnothing\\subseteq A$ 恒成立', 'warn');
    else cV('每个元素独立「留/去」2 种：$2\\times2\\times\\cdots\\times2=' + tot + '$ —— 乘法原理', 'ok');
  };

  const nSl = B.slider('元素个数 n', 1, 4, 1, 3, v => { st.n = v; st.mask &= (1 << v) - 1; B.render(); });

  const autoBtn = B.btn('⏩ 家族巡游', () => {
    st.auto = !st.auto; st.tick = 0; autoBtn.classList.toggle('on', st.auto);
    if (st.auto) {
      const step = () => {
        st.tick++;
        if (st.tick >= 30) { st.tick = 0; st.mask = (st.mask + 1) & ((1 << st.n) - 1); B.render(); }
        if (st.auto) B.raf(step);
      };
      B.raf(step);
    }
  });
  B.btn('🎲 随机选卡', () => {
    st.auto = false; autoBtn.classList.remove('on');
    st.mask = Math.floor(Math.random() * (1 << st.n));
    B.render();
  });

  B.render();
  return B;
}
