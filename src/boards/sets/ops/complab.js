/* 图 Y2 · 补集演示台：全集右墙推过去，元素从「不存在」变成补集成员
   ∁U A 依赖 U：拖「右墙 u」滑块（或 ⏩ 全集扩张），圈外的 6、7、8、9 逐个被划进全集、
   立刻参与补集运算 —— 全集变了，同一个 A 的补集跟着变。
   mask 内容写原始色 '#ffffff'/'#000000'（'#fff' 是主题语义键，亮色下会破坏亮度合成）；
   右墙移动时 mask 里装着 U 的矩形要跟着重建（removeChild 循环，浏览器与无头环境都走得通）。
   局部坐标约定：u∈[0,860] 向右、v∈[0,470] 向下（SVG 原生方向）。 */
import { mk, V } from '../../../lib/board.js';
import { createDiagram, plotInk, glowDot } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  root.classList.add('atlas-board', 'complab-board');
  const B = createDiagram(root, W, H, '补集演示台：推动全集右墙，看补集随全集改变');
  const UY = 60, UH = 355;                                   // 全集框：y 60..415，右墙 x = st.ux
  const EA = { cx: 300, cy: 240, rx: 118, ry: 85 }, EBv = { cx: 492, cy: 240, rx: 108, ry: 80 };
  const inE = (e, p) => ((p.x - e.cx) / e.rx) ** 2 + ((p.y - e.cy) / e.ry) ** 2 <= 1;

  // 1、2 在 A；3、4 在 B∖A；5 在两边；6..9 是圈外元素 —— 右墙推过 x 才纳入全集
  const st = {
    pts: [[255, 215], [330, 282], [495, 205], [530, 295], [400, 240], [700, 150], [725, 265], [695, 360], [772, 205]],
    ux: 640, m: 0, anim: false, dir: 1,
  };
  const P = i => V(st.pts[i][0], st.pts[i][1]);
  const inA = i => inE(EA, P(i)), inB = i => inE(EBv, P(i));
  const inU = i => st.pts[i][0] > 66 && st.pts[i][0] < st.ux - 4 && st.pts[i][1] > UY + 4 && st.pts[i][1] < UY + UH - 4;

  const MODES = [
    { t: '$\\complement_U A$', def: '$\\complement_UA=\\{x\\in U\\mid x\\notin A\\}$', say: '先在 U 内、再不在 A —— 双重身份缺一不可' },
    { t: '$A\\setminus B$', def: '$A\\setminus B=A\\cap\\complement_UB$', say: '先圈定 A 的范围，再把 B 减去' },
    { t: '$\\complement_U(\\complement_U A)$', def: '$\\complement_U(\\complement_UA)=A$', say: '双重否定即肯定：挖去再挖去，回到 A 本身' },
  ];

  // ---- mask：随右墙重建（defs 会被清空，柔光渐变也在重建里一并补回）----
  const defs = mk('defs', {}, B.svg);
  const ID = B.uid;
  function buildMasks() {
    while (defs.children.length) defs.removeChild(defs.children[0]);
    const mCA = mk('mask', { id: ID + 'mCA', maskUnits: 'userSpaceOnUse' }, defs);   // ∁U A = U 白 − A 黑
    mk('rect', { x: 60, y: UY, width: st.ux - 60, height: UH, fill: '#ffffff' }, mCA);
    mk('ellipse', { cx: EA.cx, cy: EA.cy, rx: EA.rx, ry: EA.ry, fill: '#000000' }, mCA);
    const mAB = mk('mask', { id: ID + 'mAB', maskUnits: 'userSpaceOnUse' }, defs);   // A∖B = A 白 − B 黑
    mk('ellipse', { cx: EA.cx, cy: EA.cy, rx: EA.rx, ry: EA.ry, fill: '#ffffff' }, mAB);
    mk('ellipse', { cx: EBv.cx, cy: EBv.cy, rx: EBv.rx, ry: EBv.ry, fill: '#000000' }, mAB);
  }

  B.setAppearanceBackground(['光晕', '细网格'], grid => { root.dataset.texture = grid ? 'grid' : 'halo'; });

  const cR = B.readout('结果'), cId = B.readout('恒等式', 'mint'), cV = B.chipM('判读');

  B.renderFn = () => {
    const M = MODES[st.m];
    const joined = [5, 6, 7, 8].filter(i => inU(i));          // 已被右墙划进全集的圈外元素
    // 全集框（右墙 = 框右边）+ 活动墙高亮
    mk('rect', { x: 60, y: UY, width: st.ux - 60, height: UH, fill: plotInk.soft, stroke: plotInk.rule, 'stroke-width': 1.4, 'stroke-dasharray': '5 5' }, B.dyn);
    B.seg(V(st.ux, UY), V(st.ux, UY + UH), { stroke: plotInk.copper, 'stroke-width': 2.2 });
    B.tex(V(st.ux - 14, UY + 20), '$U$', { size: 15, anchor: 'end', color: plotInk.guide });
    // 两圈
    mk('ellipse', { cx: EA.cx, cy: EA.cy, rx: EA.rx, ry: EA.ry, fill: plotInk.blue, 'fill-opacity': .07, stroke: plotInk.blue, 'stroke-width': 2.2 }, B.dyn);
    mk('ellipse', { cx: EBv.cx, cy: EBv.cy, rx: EBv.rx, ry: EBv.ry, fill: plotInk.copper, 'fill-opacity': .07, stroke: plotInk.copper, 'stroke-width': 2.2 }, B.dyn);
    B.tex(V(EA.cx, EA.cy - EA.ry - 16), '$A$', { size: 16, anchor: 'mid', color: plotInk.blue });
    B.tex(V(EBv.cx, EBv.cy - EBv.ry - 16), '$B$', { size: 16, anchor: 'mid', color: plotInk.copper });
    // 结果区域着色
    if (st.m === 0) mk('rect', { x: 60, y: UY, width: st.ux - 60, height: UH, fill: plotInk.green, 'fill-opacity': .16, mask: `url(#${ID}mCA)` }, B.dyn);
    else if (st.m === 1) mk('rect', { x: 60, y: UY, width: st.ux - 60, height: UH, fill: plotInk.green, 'fill-opacity': .16, mask: `url(#${ID}mAB)` }, B.dyn);
    else mk('ellipse', { cx: EA.cx, cy: EA.cy, rx: EA.rx, ry: EA.ry, fill: plotInk.green, 'fill-opacity': .16 }, B.dyn);
    // 元素点：纳入的实色（成员绿/非成员暗），未纳入的虚影等待
    const members = [];
    for (let i = 0; i < 9; i++) {
      if (!inU(i)) {
        mk('circle', { cx: P(i).x, cy: P(i).y, r: 8, fill: 'none', stroke: plotInk.axis, 'stroke-width': 1.2, 'stroke-dasharray': '3 3', 'stroke-opacity': .6 }, B.dyn);
        B.text(V(P(i).x, P(i).y - 13), String(i + 1), { 'font-size': 11, fill: plotInk.guide, 'fill-opacity': .6, style: 'fill:' + plotInk.guide });
        continue;
      }
      const mem = st.m === 0 ? !inA(i) : st.m === 1 ? inA(i) && !inB(i) : inA(i);
      if (mem) members.push(i + 1);
      if (mem) glowDot(B, P(i), plotInk.green, 18, 6);
      else B.dot(P(i), 8, { fill: plotInk.guide, 'fill-opacity': .4 });
      B.text(V(P(i).x, P(i).y - 13), String(i + 1), { 'font-size': 11, fill: mem ? plotInk.green : plotInk.guide, style: 'fill:' + (mem ? plotInk.green : plotInk.guide) });
    }
    // 徽章
    const list = members.length ? '\\{' + members.join(',') + '\\}' : '\\varnothing';
    cR(M.t.slice(0, -1) + '=' + list + '$', members.length ? 'ok' : '');
    cId(M.def, '');
    if (st.m === 0) cV('补集依赖全集：右墙已纳入圈外元素 ' + joined.length + ' 个 —— 右墙再推，补集跟着变', joined.length ? 'ok' : '');
    else if (st.m === 1) cV('差集恒等式：在 A 的范围内，用「不在 B」作筛选条件 —— 与 $\\complement_U B$ 合作完成', 'ok');
    else cV('挖去再挖去：$x\\notin A$ 的否定是否定 —— 回到 $x\\in A$ 本身', 'ok');
  };

  const btns = MODES.map((M, i) => B.btnM(M.t, () => {
    st.m = i; btns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const uSl = B.slider('U 右墙 u', 640, 800, 1, 640, v => { st.ux = v; buildMasks(); B.render(); }, 'u');

  // ⏩ 全集扩张：640 ↔ 800 来回推墙（滑块 UI 用 s.sync 刷新，不走 DOM 读回）
  const animBtn = B.btn('⏩ 全集扩张', () => {
    st.anim = !st.anim; animBtn.classList.toggle('on', st.anim);
    if (st.anim) {
      const step = () => {
        if (!st.anim) return;
        st.ux += st.dir * 1;
        if (st.ux >= 800) { st.ux = 800; st.dir = -1; }
        if (st.ux <= 640) { st.ux = 640; st.dir = 1; }
        uSl.sync(st.ux);
        buildMasks(); B.render();
        B.raf(step);
      };
      B.raf(step);
    }
  });

  // 1..5 可拖（限制在当前全集内）；6..9 是圈外元素，只等右墙
  for (let i = 0; i < 5; i++) {
    const lo = p => [Math.max(74, Math.min(st.ux - 12, p.x)), Math.max(UY + 14, Math.min(UY + UH - 14, p.y))];
    B.handle({ get: () => P(i), thin: true, color: 'transparent', set: p => { st.pts[i] = lo(p); }, clamp: p => V(lo(p)[0], lo(p)[1]) });
  }

  buildMasks();
  B.render();
  return B;
}
