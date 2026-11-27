/* 图 Y3 · 德摩根验证机：左右两式各搭各的区域，8 个元素逐个验恒等
   左右双面板各画各的：左式按「定义直译」搭区域、右式按「恒等式右端」搭区域，
   mask 合成语法：白=纳入（OR）、黑=挖除、g[clip-path]=裁剪；补集用 evenodd 路径 clip（U 矩形 − 椭圆）。
   四组恒等式：德摩根两式 + 分配律两式（交对并、并对交）。点左面板元素随手拖，右面板镜像同步。
   局部坐标约定：u∈[0,860] 向右、v∈[0,550] 向下（SVG 原生方向）；右面板 = 左面板 + 410px 平移。 */
import { mk, V } from '../../../lib/board.js';
import { createDiagram, plotInk, glowDot } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 550;
  root.classList.add('atlas-board', 'demorgan-board');
  const B = createDiagram(root, W, H, '德摩根验证机：左右两式各搭区域，逐个元素核验恒等');
  const OX = [35, 445];                                     // 左右面板原点
  const geos = k => {
    const ox = OX[k];
    return st.p < 2
      ? { r: { x: ox + 12, y: 62, w: 354, h: 408 },
          A: { cx: ox + 125, cy: 265, rx: 100, ry: 72 }, B: { cx: ox + 255, cy: 265, rx: 100, ry: 72 }, C: null }
      : { r: { x: ox + 12, y: 62, w: 354, h: 408 },
          A: { cx: ox + 189, cy: 230, rx: 90, ry: 60 }, B: { cx: ox + 125, cy: 320, rx: 90, ry: 60 }, C: { cx: ox + 253, cy: 320, rx: 90, ry: 60 } };
  };
  const inE = (e, p) => ((p.x - e.cx) / e.rx) ** 2 + ((p.y - e.cy) / e.ry) ** 2 <= 1;

  // 布阵：2-set 用「1、5 在 A；2 在两圈；3、4 在 B；6、7、8 在圈外」；3-set 用三叶草阵
  const LAYOUTS = [
    [[105, 235], [225, 265], [315, 235], [290, 330], [140, 330], [80, 150], [370, 150], [60, 380]],
    [[105, 235], [225, 265], [315, 235], [290, 330], [140, 330], [80, 150], [370, 150], [60, 380]],
    [[160, 265], [258, 268], [189, 330], [250, 210], [140, 360], [330, 370], [80, 120], [330, 120]],
    [[160, 265], [258, 268], [189, 330], [250, 210], [140, 360], [330, 370], [80, 120], [330, 120]],
  ];
  const st = { p: 0, pts: LAYOUTS[0].map(a => a.slice()) };

  const PRESETS = [
    { t: '$\\complement_U(A\\cap B)=\\complement_UA\\cup\\complement_UB$', L: '$\\complement_U(A\\cap B)$', R: '$\\complement_UA\\cup\\complement_UB$' },
    { t: '$\\complement_U(A\\cup B)=\\complement_UA\\cap\\complement_UB$', L: '$\\complement_U(A\\cup B)$', R: '$\\complement_UA\\cap\\complement_UB$' },
    { t: '$A\\cap(B\\cup C)=(A\\cap B)\\cup(A\\cap C)$', L: '$A\\cap(B\\cup C)$', R: '$(A\\cap B)\\cup(A\\cap C)$' },
    { t: '$A\\cup(B\\cap C)=(A\\cup B)\\cap(A\\cup C)$', L: '$A\\cup(B\\cap C)$', R: '$(A\\cup B)\\cap(A\\cup C)$' },
  ];
  const PREDS = [
    { L: (u, a, b) => u && !(a && b), R: (u, a, b) => u && (!a || !b) },
    { L: (u, a, b) => u && !a && !b, R: (u, a, b) => u && !a && !b },
    { L: (u, a, b, c) => a && (b || c), R: (u, a, b, c) => (a && b) || (a && c) },
    { L: (u, a, b, c) => a || (b && c), R: (u, a, b, c) => (a || b) && (a || c) },
  ];

  // ---- mask / clipPath：换预设时整套重建（defs 清空，柔光渐变也一并补回）----
  const defs = mk('defs', {}, B.svg);
  const ID = B.uid;
  const dRect = r => `M${r.x} ${r.y}H${r.x + r.w}V${r.y + r.h}H${r.x}Z`;
  const dEll = e => `M${e.cx - e.rx} ${e.cy}A${e.rx} ${e.ry} 0 1 1 ${e.cx + e.rx} ${e.cy}A${e.rx} ${e.ry} 0 1 1 ${e.cx - e.rx} ${e.cy}Z`;

  function buildMasks() {
    while (defs.children.length) defs.removeChild(defs.children[0]);
    for (let k = 0; k < 2; k++) {
      const g = geos(k), S = k ? 'R' : 'L', r = g.r;
      const ell = e => mk('ellipse', { cx: e.cx, cy: e.cy, rx: e.rx, ry: e.ry });
      mk('clipPath', { id: ID + 'cA' + S }, defs).appendChild(ell(g.A));
      mk('clipPath', { id: ID + 'cB' + S }, defs).appendChild(ell(g.B));
      const notClip = id => mk('clipPath', { id }, defs)
        .appendChild(mk('path', { d: dRect(r) + dEll(id === ID + 'nA' + S ? g.A : g.B), 'clip-rule': 'evenodd' }));
      const gc = (cid, par) => mk('g', { 'clip-path': `url(#${cid})` }, par);
      const we = (e, par) => par ? mk('ellipse', { cx: e.cx, cy: e.cy, rx: e.rx, ry: e.ry, fill: '#ffffff' }, par) : null;
      const be = (e, par) => mk('ellipse', { cx: e.cx, cy: e.cy, rx: e.rx, ry: e.ry, fill: '#000000' }, par);
      const wr = par => mk('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#ffffff' }, par);
      const br = par => mk('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#000000' }, par);
      const m = mk('mask', { id: ID + (k ? 'mR' : 'mL'), maskUnits: 'userSpaceOnUse' }, defs);
      if (st.p === 0) {
        if (!k) { wr(m); be(g.B, gc(ID + 'cA' + S, m)); }                       // U − (A∩B)
        else {
          notClip(ID + 'nA' + S); notClip(ID + 'nB' + S);
          br(m); wr(gc(ID + 'nA' + S, m)); wr(gc(ID + 'nB' + S));               // ∁A ∪ ∁B
        }
      } else if (st.p === 1) {
        if (!k) { wr(m); be(g.A, m); be(g.B, m); }                              // U − A − B
        else {
          notClip(ID + 'nA' + S); notClip(ID + 'nB' + S);
          br(m); wr(gc(ID + 'nA' + S, m)); br(gc(ID + 'nB' + S));               // ∁A ∩ ∁B
        }
      } else if (st.p === 2) {
        br(m);
        if (!k) { const gg = gc(ID + 'cA' + S, m); we(g.B, gg); we(g.C, gg); }   // A ∩ (B∪C)
        else { we(g.B, gc(ID + 'cA' + S, m)); we(g.C, gc(ID + 'cA' + S, m)); }   // (A∩B) ∪ (A∩C)
      } else {
        if (!k) { br(m); we(g.A, m); we(g.C, gc(ID + 'cB' + S, m)); }            // A ∪ (B∩C)
        else {
          const uAB = mk('clipPath', { id: ID + 'uAB' + S }, defs);
          uAB.appendChild(ell(g.A)); uAB.appendChild(ell(g.B));
          const uAC = mk('clipPath', { id: ID + 'uAC' + S }, defs);
          uAC.appendChild(ell(g.A)); uAC.appendChild(ell(g.C));
          br(m); wr(gc(ID + 'uAB' + S, m)); br(gc(ID + 'uAC' + S, m));          // (A∪B) ∩ (A∪C)
        }
      }
    }
  }

  B.setAppearanceBackground(['光晕', '细网格'], grid => { root.dataset.texture = grid ? 'grid' : 'halo'; });

  const cL = B.readout('左式'), cR2 = B.readout('右式', 'gold'), cEq = B.chipM('恒等判读');

  B.renderFn = () => {
    const P = PRESETS[st.p], PR = PREDS[st.p];
    for (let k = 0; k < 2; k++) {
      const g = geos(k), r = g.r;
      // 面板标题 + 全集框
      mk('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: plotInk.soft, stroke: plotInk.rule, 'stroke-width': 1.4, 'stroke-dasharray': '5 5' }, B.dyn);
      B.tex(V(r.x + r.w - 12, r.y + 18), '$U$', { size: 14, anchor: 'end', color: plotInk.guide });
      // 三圈轮廓 + 名牌
      const sets = [[g.A, plotInk.blue, '$A$'], [g.B, plotInk.copper, '$B$'], [g.C, plotInk.teal, '$C$']];
      for (const [e, col, lab] of sets) {
        if (!e) continue;
        mk('ellipse', { cx: e.cx, cy: e.cy, rx: e.rx, ry: e.ry, fill: col, 'fill-opacity': .05, stroke: col, 'stroke-width': 2 }, B.dyn);
        B.tex(V(e.cx, e.cy - e.ry - 13), lab, { size: 13, anchor: 'mid', color: col });
      }
      // 该式的区域着色
      mk('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: plotInk.green, 'fill-opacity': .16, mask: `url(#${ID + (k ? 'mR' : 'mL')})` }, B.dyn);
    }
    // 元素点：左面板按左式谓词染色，右面板（+410 镜像）按右式谓词染色
    const mLs = [], mRs = [];
    for (let i = 0; i < 8; i++) {
      const p = V(st.pts[i][0], st.pts[i][1]), g = geos(0);
      const u = p.x > g.r.x + 4 && p.x < g.r.x + g.r.w - 4 && p.y > g.r.y + 4 && p.y < g.r.y + g.r.h - 4;
      const a = inE(g.A, p), b = inE(g.B, p), c = g.C ? inE(g.C, p) : false;
      const lv = PR.L(u, a, b, c), rv = PR.R(u, a, b, c);
      if (lv) mLs.push(i + 1);
      if (rv) mRs.push(i + 1);
      if (lv) glowDot(B, p, plotInk.green, 18, 6);
      else B.dot(p, 8, { fill: plotInk.guide, 'fill-opacity': .4 });
      B.text(V(p.x, p.y - 13), String(i + 1), { 'font-size': 11, fill: lv ? plotInk.green : plotInk.guide, style: 'fill:' + (lv ? plotInk.green : plotInk.guide) });
      const q = V(p.x + 410, p.y);
      if (rv) glowDot(B, q, plotInk.green, 18, 6);
      else B.dot(q, 8, { fill: plotInk.guide, 'fill-opacity': .4 });
      B.text(V(q.x, q.y - 13), String(i + 1), { 'font-size': 11, fill: rv ? plotInk.green : plotInk.guide, style: 'fill:' + (rv ? plotInk.green : plotInk.guide) });
    }
    // 徽章
    const li = mLs.length ? '\\{' + mLs.join(',') + '\\}' : '\\varnothing';
    const ri = mRs.length ? '\\{' + mRs.join(',') + '\\}' : '\\varnothing';
    cL(P.L.slice(0, -1) + '=' + li + '$', mLs.length ? 'ok' : '');
    cR2(P.R.slice(0, -1) + '=' + ri + '$', mRs.length ? 'ok' : '');
    if (JSON.stringify(mLs) === JSON.stringify(mRs))
      cEq('8 个元素逐个核验：两式同时命中 ' + mLs.length + ' 个、同时落空 ' + (8 - mLs.length) + ' 个 ✓', 'ok');
    else cEq('对不上？！左 ' + mLs.length + ' 个 vs 右 ' + mRs.length + ' 个 —— 恒等式出 bug 了', 'warn');
  };

  const btns = PRESETS.map((P, i) => B.btnM(P.t, () => {
    st.p = i; st.pts = LAYOUTS[i].map(a => a.slice());
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    buildMasks(); B.render();
  }, { on: i === 0 }));
  B.btn('🎲 随机撒点', () => {
    const r = geos(0).r;
    st.pts = [...Array(8)].map(() => [r.x + 16 + Math.random() * (r.w - 32), r.y + 16 + Math.random() * (r.h - 32)]);
    B.render();
  });

  // 左面板 8 个元素点可拖（右面板是镜像，不设把手）
  for (let i = 0; i < 8; i++) {
    const lo = p => {
      const r = geos(0).r;
      return [Math.max(r.x + 10, Math.min(r.x + r.w - 10, p.x)), Math.max(r.y + 10, Math.min(r.y + r.h - 10, p.y))];
    };
    B.handle({ get: () => V(st.pts[i][0], st.pts[i][1]), thin: true, color: 'transparent', set: p => { st.pts[i] = lo(p); }, clamp: p => V(lo(p)[0], lo(p)[1]) });
  }

  buildMasks();
  B.render();
  return B;
}
