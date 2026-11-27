/* 图 J2 · 表示互译机：描述法 ⇄ 列举法 ⇄ 数轴
   四个预设集合各自上轴：探针拖到哪，就按该集合的「前置集合 + 条件」直接判 ∈/∉；
   探针吸附 0.05 网格 —— 端点 x=3、x=−1 能精确踩上，边界开闭直接核验。
   视觉：走 conic-diagram 的纸面色板（跟随主题 / 预设纸面各一套语义色），
   整板三层偏心柔光或细网格、细内框、探针光晕；配色方案由板根的 --pj-* 提供。
   局部坐标约定：u∈[0,860] 向右、v∈[0,290] 向下（SVG 原生方向）；轴在 v=212。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { createDiagram, plotInk, glowDot } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 290;
  root.classList.add('replab-board');
  const B = createDiagram(root, W, H, '集合的表示：列举法、描述法与数轴');
  const AXY = 212, px = v => 440 + v * 68, inv = x => (x - 440) / 68;   // 数轴：v∈[−5.6, 5.6]
  const snap = v => Math.round(v * 20) / 20;                            // 0.05 网格：端点踩得准

  // 探针光晕由 glowDot 现画（多层同心圆），颜色与芯点同一条 fill 通路，不会发黑

  // 「外观」里的背景：整板光晕 / 细网格（CSS 在 views/sets/lang/j2.vue，按板类名限定）
  B.setAppearanceBackground(['光晕', '细网格'], grid => { root.dataset.texture = grid ? 'grid' : 'halo'; });

  // 预设：desc = 描述法原文；gate = 「代表元 · 前置集合」拆解；list = 列举法读数（或无限集判定）
  const PRESETS = [
    {
      btn: '① $A=\\{x\\in\\mathbb{Z}\\mid -2\\le x<3\\}$',
      desc: '$A=\\{x\\in\\mathbb{Z}\\mid -2\\le x<3\\}$',
      gate: '代表元 $x$ · 前置集合 $x\\in\\mathbb{Z}$ · 条件 $-2\\le x<3$',
      list: '$\\{-2,-1,0,1,2\\}$ 共 5 个', cnt: '$5$ 个（有限）',
      draw: () => {
        for (const t of [-2, -1, 0, 1, 2]) {
          B.dot(V(px(t), AXY), 6, { fill: plotInk.blue });
        }
      },
      test: v => {
        const isZ = Math.abs(v - Math.round(v)) < 1e-9;
        if (!isZ) return ['$x=' + fmt(v, 2) + '$ 不是整数：先被前置 $x\\in\\mathbb{Z}$ 排除 —— 先检验前置集合', 'warn'];
        if (v >= 3) return ['整数但 $x\\ge 3$：右端 $x<3$ 开着 —— 端点 3 不在集合里', 'warn'];
        if (v < -2) return ['整数但在区间左外：$-2\\le x$ 不成立', 'warn'];
        return ['$x=' + fmt(v, 2) + '\\in A$ ✓：整数 + 区间内', 'ok'];
      },
    },
    {
      btn: '② $B=\\{x\\mid -1<x\\le 2\\}$',
      desc: '$B=\\{x\\mid -1<x\\le 2\\}$',
      gate: '代表元 $x$ · 不写前置默认 $x\\in\\mathbb{R}$ · 条件 $-1<x\\le 2$',
      list: '无限集：列举法无法穷举 —— 只能交给描述法与数轴', cnt: '无限',
      draw: () => {
        mk('rect', {
          x: px(-1), y: AXY - 6, width: px(2) - px(-1), height: 12, rx: 6,
          fill: plotInk.soft, stroke: plotInk.blue, 'stroke-width': 1.4,
        }, B.dyn);
        B.dot(V(px(-1), AXY), 6, { fill: plotInk.paper, stroke: plotInk.blue, 'stroke-width': 2 });
        B.dot(V(px(2), AXY), 6, { fill: plotInk.blue });
      },
      test: v => {
        if (Math.abs(v + 1) < 1e-9) return ['相交于左端 $x=-1$：左端开着 —— 端点不在线上', 'warn'];
        if (v <= -1) return ['区间左外：$-1<x$ 不成立', 'warn'];
        if (v > 2) return ['区间右外：$x\\le 2$ 不成立', 'warn'];
        return ['$x=' + fmt(v, 2) + '\\in B$ ✓', 'ok'];
      },
    },
    {
      btn: '③ $C=\\{x\\mid x=2k,\\ k\\in\\mathbb{Z}\\}$',
      desc: '$C=\\{x\\mid x=2k,\\ k\\in\\mathbb{Z}\\}$',
      gate: '代表元 $x$ · 条件 $x=2k$ 且 $k\\in\\mathbb{Z}$（偶数集）',
      list: '$\\{\\ldots,-4,-2,0,2,4,\\ldots\\}$ 省略号合法（无限集）', cnt: '无限',
      draw: () => {
        for (const t of [-4, -2, 0, 2, 4]) B.dot(V(px(t), AXY), 6, { fill: plotInk.blue });
        B.text(V(px(-5), AXY), '⋯', { 'font-size': 15, fill: plotInk.blue, class: 'rep-set' });
        B.text(V(px(5), AXY), '⋯', { 'font-size': 15, fill: plotInk.blue, class: 'rep-set' });
      },
      test: v => {
        const isZ = Math.abs(v - Math.round(v)) < 1e-9;
        if (!isZ) return ['$x=' + fmt(v, 2) + '$ 不是整数，不可能是偶数', 'warn'];
        if (Math.round(v) % 2 !== 0) return ['是整数但不是 2 的倍数：不属于 $x=2k$', 'warn'];
        return ['$x=' + fmt(v, 2) + '\\in C$ ✓：偶数', 'ok'];
      },
    },
    {
      btn: '④ $D=\\{x\\in\\mathbb{R}\\mid x^2=3\\}$',
      desc: '$D=\\{x\\in\\mathbb{R}\\mid x^2=3\\}$',
      gate: '代表元 $x$ · 前置集合 $x\\in\\mathbb{R}$ · 条件 $x^2=3$',
      list: '$\\{-\\sqrt{3},\\sqrt{3}\\}$ 共 2 个', cnt: '$2$ 个（有限）',
      draw: () => {
        for (const t of [-Math.sqrt(3), Math.sqrt(3)]) B.dot(V(px(t), AXY), 6, { fill: plotInk.blue });
      },
      test: v => {
        if (Math.abs(Math.abs(v) - Math.sqrt(3)) <= .04) return ['$x=' + fmt(v, 2) + '$ 相交于 $\\pm\\sqrt{3}\\approx 1.73$ 的座位 ✓（吸附范围内）', 'ok'];
        return ['$x^2=' + fmt(v * v, 2) + '\\ne 3$：条件 $x^2=3$ 不满足', 'warn'];
      },
    },
  ];

  const st = { p: 0, v: 0, auto: false, dir: 1 };

  const cList = B.readout('列举法'), cCnt = B.readout('元素个数', 'gold');
  const cGate = B.chipM('描述法解剖'), cPr = B.chipM('探针判读');

  B.renderFn = () => {
    const P = PRESETS[st.p];
    // 细内框：图区自己收边（底色与光晕在板根上）
    mk('rect', { x: 12, y: 14, width: W - 24, height: H - 28, rx: 12, fill: 'none', stroke: plotInk.axis }, B.dyn);
    // 数轴区一条浅色带，把「轴」与上方的描述法分开
    mk('rect', { x: 46, y: AXY - 46, width: W - 92, height: 92, rx: 16, fill: plotInk.soft, stroke: 'none' }, B.dyn);

    // 顶部：描述法原文（大字）
    B.tex(V(W / 2, 56), P.desc, { size: 22, anchor: 'mid', color: plotInk.ink });

    // 数轴：轴线 + 整数刻度
    B.seg(V(px(-5.6), AXY), V(px(5.6) + 14, AXY), { stroke: plotInk.axis, 'stroke-width': 1.8, __lw: 'abs' });
    mk('polygon', {
      points: `${px(5.6) + 23},${AXY} ${px(5.6) + 13},${AXY - 4.5} ${px(5.6) + 13},${AXY + 4.5}`,
      fill: plotInk.axis,
    }, B.dyn);
    B.text(V(px(5.6) + 18, AXY - 14), 'x', { 'font-size': 13, fill: plotInk.guide, class: 'rep-tick' });
    for (let t = -5; t <= 5; t++) {
      B.seg(V(px(t), AXY), V(px(t), AXY - 8), { stroke: plotInk.guide, 'stroke-width': 1.2 });
      B.text(V(px(t), AXY + 21), String(t), { 'font-size': 11, fill: plotInk.guide, class: 'rep-tick' });
    }
    P.draw();
    // 探针：竖直参考线 + 光晕 + 芯（吸附后的精确值，与判读一致）
    B.seg(V(px(st.v), 126), V(px(st.v), AXY - 12), { stroke: plotInk.amber, 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .7 }, B.dyn);
    glowDot(B, V(px(st.v), AXY), plotInk.amber, 18, 6);
    B.tex(V(px(st.v), 104), '$x=' + fmt(st.v, 2) + '$', { size: 15, anchor: 'mid', color: plotInk.amber });
    // 徽章
    cGate(P.gate, '');
    cList(P.list, P.list.includes('无法穷举') ? 'warn' : 'ok');
    cCnt(P.cnt, '');
    const [say, cls] = P.test(st.v);
    cPr(say, cls);
  };

  const btns = PRESETS.map((P, i) => B.btnM(P.btn, () => {
    st.p = i; st.auto = false; scanBtn.classList.remove('on');
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const scanBtn = B.btn('⏩ 探针扫轴', () => {
    st.auto = !st.auto; scanBtn.classList.toggle('on', st.auto);
    wake();
  });

  // 点预设 / 扫轴时在按钮外围打一圈逐渐散开的辉光（.btn-pulse 的 ::after，样式在 j2.vue）；
  // 常亮的外发光由 .btn.on 的 box-shadow 负责，这里只管「按下那一刻」的一下
  const pulse = el => {
    el.classList.remove('btn-pulse');
    void el.offsetWidth;                    // 强制回流，同一枚按钮连点也能重播
    el.classList.add('btn-pulse');
    el.addEventListener('animationend', () => el.classList.remove('btn-pulse'), { once: true });
  };
  btns.forEach(b => b.addEventListener('click', () => pulse(b)));
  scanBtn.addEventListener('click', () => pulse(scanBtn));

  // 探针把手：吸附在数轴上（0.05 网格），端点能精确踩上
  B.handle({
    get: () => V(px(st.v), AXY), color: plotInk.amber, label: 'x',
    set: p => { st.v = snap(Math.max(-5.5, Math.min(5.5, inv(p.x)))); B.render(); },
    clamp: p => V(Math.max(px(-5.5), Math.min(px(5.5), p.x)), AXY),
  });

  let playing = false;
  function wake() {
    if (playing) return; playing = true;
    const step = () => {
      if (st.auto) {
        let nv = st.v + st.dir * .05;
        if (nv >= 5.5) { nv = 5.5; st.dir = -1; }
        if (nv <= -5.5) { nv = -5.5; st.dir = 1; }
        st.v = snap(nv); B.render();
      }
      if (st.auto) B.raf(step); else playing = false;
    };
    B.raf(step);
  }

  // 操作提示不放进图里：图注（图 J2 的说明文字）里已经写清怎样拖探针
  B.render();
  return B;
}
