/* 图 Y1 · 交并演示台：∩ / ∪ / 差集 的韦恩图实时运算
   九个元素点随手拖：区域着色与成员清单实时重算 —— ∩ 取「同时满足」、∪ 取「至少一边」、差集在 A 不在 B。
   区域着色用 SVG mask 合成：白=纳入、黑=挖除（并集双白、差集先白后黑），交集用 clipPath 嵌套裁剪；
   mask 内容必须写原始色 '#ffffff'/'#000000' —— '#fff' 是主题语义键，亮色下会翻成墨色、破坏亮度合成。
   局部坐标约定：u∈[0,860] 向右、v∈[0,500] 向下（SVG 原生方向）。 */
import { mk, V } from '../../../lib/board.js';
import { createDiagram, plotInk, glowDot } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 500;
  root.classList.add('atlas-board', 'vennops-board');
  const B = createDiagram(root, W, H, '交并演示台：拖动元素点，四种集合运算实时重算');
  const U = { x: 55, y: 55, w: 750, h: 390 };
  const EA = { cx: 350, cy: 250, rx: 165, ry: 115 }, EBv = { cx: 560, cy: 250, rx: 165, ry: 115 };
  const inE = (e, p) => ((p.x - e.cx) / e.rx) ** 2 + ((p.y - e.cy) / e.ry) ** 2 <= 1;

  const st = {
    pts: [[258, 225], [330, 300], [648, 222], [655, 315], [448, 222], [462, 292], [140, 115], [715, 390], [125, 375]],
    m: 0, tour: false, ti: 0, tf: 0,
  };
  const P = i => V(st.pts[i][0], st.pts[i][1]);
  const inA = i => inE(EA, P(i)), inB = i => inE(EBv, P(i));

  const MODES = [
    { t: '$A\\cap B$', pred: (a, b) => a && b, def: '$A\\cap B=\\{x\\mid x\\in A\\wedge x\\in B\\}$', shade: 'cap' },
    { t: '$A\\cup B$', pred: (a, b) => a || b, def: '$A\\cup B=\\{x\\mid x\\in A\\vee x\\in B\\}$', shade: 'uni' },
    { t: '$A\\setminus B$', pred: (a, b) => a && !b, def: '$A\\setminus B=\\{x\\mid x\\in A\\wedge x\\notin B\\}$', shade: 'dAB' },
    { t: '$B\\setminus A$', pred: (a, b) => b && !a, def: '$B\\setminus A=\\{x\\mid x\\in B\\wedge x\\notin A\\}$', shade: 'dBA' },
  ];

  // ---- 静态几何的 mask / clipPath：建一次，renderFn 只引用（两圈不动，无需重建）----
  const defs = mk('defs', {}, B.svg);
  const ID = B.uid;                                     // 每块板唯一的 id 前缀
  mk('clipPath', { id: ID + 'cA' }, defs)
    .appendChild(mk('ellipse', { cx: EA.cx, cy: EA.cy, rx: EA.rx, ry: EA.ry }));
  const mkMask = (id, ops) => {                          // ops：[[椭圆, 白/黑], …] 依次作画
    const m = mk('mask', { id, maskUnits: 'userSpaceOnUse' }, defs);
    for (const [e, col] of ops)
      m.appendChild(mk('ellipse', { cx: e.cx, cy: e.cy, rx: e.rx, ry: e.ry, fill: col }));
    return m;
  };
  mkMask(ID + 'mU', [[EA, '#ffffff'], [EBv, '#ffffff']]);   // 并：双白 OR
  mkMask(ID + 'mAB', [[EA, '#ffffff'], [EBv, '#000000']]); // A∖B：先白后黑
  mkMask(ID + 'mBA', [[EBv, '#ffffff'], [EA, '#000000']]);  // B∖A：先白后黑

  B.setAppearanceBackground(['光晕', '细网格'], grid => { root.dataset.texture = grid ? 'grid' : 'halo'; });

  const cR = B.readout('结果'), cCh = B.readout('包含链', 'mint');
  const cDef = B.chipM('符号式'), cV = B.chipM('判读');

  B.renderFn = () => {
    const M = MODES[st.m];
    mk('rect', { x: U.x, y: U.y, width: U.w, height: U.h, fill: plotInk.soft, stroke: plotInk.rule, 'stroke-width': 1.4, 'stroke-dasharray': '5 5' }, B.dyn);
    B.tex(V(U.x + U.w - 14, U.y + 20), '$U$', { size: 15, anchor: 'end', color: plotInk.guide });
    mk('ellipse', { cx: EA.cx, cy: EA.cy, rx: EA.rx, ry: EA.ry, fill: plotInk.blue, 'fill-opacity': .06, stroke: plotInk.blue, 'stroke-width': 2.2 }, B.dyn);
    mk('ellipse', { cx: EBv.cx, cy: EBv.cy, rx: EBv.rx, ry: EBv.ry, fill: plotInk.copper, 'fill-opacity': .06, stroke: plotInk.copper, 'stroke-width': 2.2 }, B.dyn);
    B.tex(V(EA.cx - 95, 165), '$A$', { size: 17, anchor: 'mid', color: plotInk.blue });
    B.tex(V(EBv.cx + 95, 165), '$B$', { size: 17, anchor: 'mid', color: plotInk.copper });
    // 结果区域着色（绿色 .16）
    if (M.shade === 'cap') {
      const g = mk('g', { 'clip-path': `url(#${ID}cA)` }, B.dyn);
      mk('ellipse', { cx: EBv.cx, cy: EBv.cy, rx: EBv.rx, ry: EBv.ry, fill: plotInk.green, 'fill-opacity': .16 }, g);
    } else {
      const mid = M.shade === 'uni' ? ID + 'mU' : M.shade === 'dAB' ? ID + 'mAB' : ID + 'mBA';
      mk('rect', { x: U.x, y: U.y, width: U.w, height: U.h, fill: plotInk.green, 'fill-opacity': .16, mask: `url(#${mid})` }, B.dyn);
    }
    // 元素点：成员绿、非成员灰暗
    const members = [];
    for (let i = 0; i < 9; i++) {
      const mem = M.pred(inA(i), inB(i));
      if (mem) members.push(i + 1);
      if (mem) glowDot(B, P(i), plotInk.green, 18, 6);
      else B.dot(P(i), 8, { fill: plotInk.guide, 'fill-opacity': .4 });
      B.text(V(P(i).x, P(i).y - 13), String(i + 1), { 'font-size': 11, fill: mem ? plotInk.green : plotInk.guide, style: 'fill:' + (mem ? plotInk.green : plotInk.guide) });
    }
    // 徽章
    const list = members.length ? '\\{' + members.join(',') + '\\}' : '\\varnothing';
    cR(M.t.slice(0, -1) + '=' + list + '$', members.length ? 'ok' : '');
    cDef(M.def, '');
    const nAB = st.pts.filter((_, i) => inA(i) && inB(i)).length;
    const nA = st.pts.filter((_, i) => inA(i)).length, nB = st.pts.filter((_, i) => inB(i)).length;
    cCh('$A\\cap B\\subseteq A\\subseteq A\\cup B$：$' + nAB + '\\le ' + nA + '\\le ' + (nA + nB - nAB) + '$', '');
    if (st.m === 0) cV(members.length ? '∩ 取「同时满足」：' + members.join('、') + ' 同属两边' : '两圈无公共元素 → ∅：交集可以为空', members.length ? 'ok' : 'warn');
    else if (st.m === 1) cV('∪ 取「至少一边」：' + (members.length ? members.join('、') + ' 全部在并集中' : '两圈皆空 → ∅'), 'ok');
    else if (st.m === 2) cV('差集：先圈定 A 的范围再减去 B —— 结果 ' + (members.length ? members.join('、') : '∅') + '；7、8、9 在圈外两边都不算', members.length ? 'ok' : '');
    else cV('差集不交换：被挖的圈换成 A —— 与 $A\\setminus B$ 核验，顺序换结果换', 'ok');
  };

  const btns = MODES.map((M, i) => B.btnM(M.t, () => {
    st.m = i; btns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));

  // ⏩ 元素巡游：5 号元素绕四个区域跑一圈（A only → 两边 → B only → 圈外）
  const TOUR = [[258, 225], [448, 222], [648, 222], [140, 300]];
  const tourBtn = B.btn('⏩ 元素巡游', () => {
    st.tour = !st.tour; tourBtn.classList.toggle('on', st.tour);
    if (st.tour) {
      const step = () => {
        if (!st.tour) return;
        st.tf += .006;
        if (st.tf >= 1) { st.tf = 0; st.ti = (st.ti + 1) % TOUR.length; }
        const a = TOUR[st.ti], b = TOUR[(st.ti + 1) % TOUR.length];
        st.pts[4] = [a[0] + (b[0] - a[0]) * st.tf, a[1] + (b[1] - a[1]) * st.tf];
        B.render();
        B.raf(step);
      };
      B.raf(step);
    }
  });

  // 九个元素点全部可拖（限制在全集框内）；把手本身不画 —— 拖动靠 13px 的透明命中环，圆点由 dyn 层按成员状态画
  st.pts.forEach((_, i) => {
    const lo = p => [Math.max(U.x + 12, Math.min(U.x + U.w - 12, p.x)), Math.max(U.y + 12, Math.min(U.y + U.h - 12, p.y))];
    B.handle({
      get: () => P(i), thin: true, color: 'transparent',
      set: p => { st.pts[i] = lo(p); },
      clamp: p => V(lo(p)[0], lo(p)[1]),
    });
  });

  B.render();
  return B;
}
