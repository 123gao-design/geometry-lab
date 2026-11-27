/* 图 X1 · 子集演示台：拖金圈 A，看「元素视角」的 ⊆ / ⊊ / = / ⊈
   判定 ⊆ 只看元素：A 的元素全被 B 罩住才是 A⊆B —— 圈画出界不要紧，元素跟出去才是反例。
   灰底 U 为全集框；B 蓝圈带 7 个元素，圈外还有 8、9、10 三个不属于 A 的元素。
   局部坐标约定：u∈[0,860] 向右、v∈[0,470] 向下（SVG 原生方向）。 */
import { mk, V } from '../../../lib/board.js';
import { createDiagram, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 470;
  root.classList.add('atlas-board', 'subslab-board');
  const B = createDiagram(root, W, H, '子集演示台：拖金圈 A 判定 A 与 B 的包含关系');
  const U = { x: 55, y: 58, w: 745, h: 360 };                 // 全集框
  const EB = { cx: 565, cy: 238, rx: 185, ry: 122 };          // 蓝圈 B
  const DOTS = [
    { n: 1, x: 492, y: 213 }, { n: 2, x: 548, y: 172 }, { n: 3, x: 612, y: 205 },
    { n: 4, x: 518, y: 292 }, { n: 5, x: 585, y: 287 }, { n: 6, x: 655, y: 258 },
    { n: 7, x: 692, y: 225 }, { n: 8, x: 148, y: 128 }, { n: 9, x: 172, y: 332 }, { n: 10, x: 392, y: 88 },
  ];
  const st = { cx: 565, cy: 232, rx: 95 };                    // 金圈 A（ry 固定为 rx 的 0.66）
  const inE = (e, p) => ((p.x - e.cx) / e.rx) ** 2 + ((p.y - e.cy) / e.ry) ** 2 <= 1;
  const inB = p => inE(EB, p);
  const inA = p => inE({ cx: st.cx, cy: st.cy, rx: st.rx, ry: st.rx * .66 }, p);

  B.setAppearanceBackground(['光晕', '细网格'], grid => { root.dataset.texture = grid ? 'grid' : 'halo'; });

  const cEl = B.readout('A 的元素'), cV = B.chipM('判读'), cDiff = B.chipM('核验');

  B.renderFn = () => {
    const A = { cx: st.cx, cy: st.cy, rx: st.rx, ry: st.rx * .66 };
    const members = DOTS.filter(d => inA(d));                // A 的元素 = 几何上落在金圈内的点
    const witnesses = members.filter(d => !inB(d));          // 反例元素：在 A 却不在 B
    const leftover = DOTS.filter(d => inB(d) && !inA(d));    // B∖A：B 里未被 A 罩住的
    // 全集框 + B 圈
    mk('rect', { x: U.x, y: U.y, width: U.w, height: U.h, fill: plotInk.soft, stroke: plotInk.rule, 'stroke-width': 1.4, 'stroke-dasharray': '5 5' }, B.dyn);
    B.tex(V(U.x + U.w - 14, U.y + 20), '$U$', { size: 15, anchor: 'end', color: plotInk.guide });
    mk('ellipse', { cx: EB.cx, cy: EB.cy, rx: EB.rx, ry: EB.ry, fill: plotInk.blue, 'fill-opacity': .08, stroke: plotInk.blue, 'stroke-width': 2.2 }, B.dyn);
    B.tex(V(EB.cx, EB.cy - EB.ry - 16), '$B$', { size: 16, anchor: 'mid', color: plotInk.blue });
    // 金圈 A（半透明 + 虚线描边，表示「正在查验的圈」）
    mk('ellipse', { cx: A.cx, cy: A.cy, rx: A.rx, ry: A.ry, fill: plotInk.gold, 'fill-opacity': .1, stroke: plotInk.gold, 'stroke-width': 2.4, 'stroke-dasharray': '8 5' }, B.dyn);
    const labA = { x: A.cx, y: A.cy - A.ry - 16 };
    const labB = { x: EB.cx, y: EB.cy - EB.ry - 16 };
    // A=B 时两标签顶对顶 —— 把 A 挪到圈内左下角，避免叠字
    const collide = Math.abs(labA.x - labB.x) < 34 && Math.abs(labA.y - labB.y) < 24;
    B.tex(collide ? V(A.cx - A.rx * .62, A.cy + A.ry * .72) : V(labA.x, labA.y), '$A$', { size: 16, anchor: 'mid', color: plotInk.gold });
    // 元素点：在 A 且在 B 绿（达标）；在 A 不在 B 红（反例）；仅在 B 蓝；两边都不在灰
    for (const d of DOTS) {
      const a = inA(d), b = inB(d);
      const col = a && b ? plotInk.green : a && !b ? plotInk.rose : b ? plotInk.blue : plotInk.guide;
      B.dot(V(d.x, d.y), 8, { fill: col, ...(a || b ? {} : { 'fill-opacity': .5 }) });
      B.text(V(d.x, d.y - 13), String(d.n), { 'font-size': 11, fill: col, style: 'fill:' + col });
    }
    // 徽章
    cEl(members.length ? '$A=\\{' + members.map(d => d.n).join(',') + '\\}$' : '$A=\\varnothing$', '');
    if (!members.length) {
      cV('$\\varnothing\\subseteq B$ 恒成立 —— 反例元素根本找不到', 'ok');
      cDiff('$B\\setminus A=B$：空集什么也不扣', '');
    } else if (witnesses.length) {
      cV('$A\\nsubseteq B$：反例元素 $' + witnesses[0].n + '\\in A$ 但 $' + witnesses[0].n + '\\notin B$', 'warn');
      cDiff('反例列出 —— 判定 ⊆ 只看元素，圈的画法不算数', 'warn');
    } else if (leftover.length) {
      cV('$A\\subsetneq B$：所有元素都被 B 罩住，且 B 里还有剩余', 'ok');
      cDiff('$B\\setminus A=\\{' + leftover.map(d => d.n).join(',') + '\\}$：真子集的「剩余」', '');
    } else {
      cV('$A=B$：互相包含 —— 两集合元素完全相同（外延性）', 'ok');
      cDiff('$B\\setminus A=\\varnothing$：谁也不多、谁也不少', 'ok');
    }
  };

  // 四个模式预设
  const PRESETS = [
    { t: '① $A=\\{1,2,3,5\\}$ 真子集', cx: 565, cy: 232, rx: 95 },
    { t: '② $A=B$ 外延性', cx: 565, cy: 238, rx: 185 },
    { t: '③ 反例：$8\\in A$ 但 $8\\notin B$', cx: 205, cy: 145, rx: 95 },
    { t: '④ $A=\\varnothing$ 空集', cx: 130, cy: 382, rx: 55 },
  ];
  const btns = PRESETS.map((P, i) => B.btnM(P.t, () => {
    st.cx = P.cx; st.cy = P.cy; st.rx = P.rx; st.auto = false;
    autoBtn.classList.remove('on');
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  // ⏩ 巡航：从 ① 滑向 ③，途经 A=∅ 的空集态
  let playing = false;
  const autoBtn = B.btn('⏩ 巡航 ①→③', () => {
    st.auto = !st.auto; autoBtn.classList.toggle('on', st.auto);
    if (st.auto) {
      const from = { cx: st.cx, cy: st.cy }, to = { cx: 205, cy: 145 }, T = 110;
      let t = 0;
      const step = () => {
        t++;
        const u = t / T;
        st.cx = from.cx + (to.cx - from.cx) * u;
        st.cy = from.cy + (to.cy - from.cy) * u;
        B.render();
        if (t < T && st.auto) B.raf(step); else { playing = false; st.auto = false; autoBtn.classList.remove('on'); }
      };
      if (!playing) { playing = true; B.raf(step); }
    } else playing = false;
  });

  // 把手：圆心（拖动）+ 右缘（缩放，ry 按比例联动）
  B.handle({
    get: () => V(st.cx, st.cy), color: plotInk.gold, label: 'A',
    set: p => {
      st.cx = Math.max(U.x + 30, Math.min(U.x + U.w - 30, p.x));
      st.cy = Math.max(U.y + 30, Math.min(U.y + U.h - 30, p.y));
    },
    clamp: p => V(Math.max(U.x + 30, Math.min(U.x + U.w - 30, p.x)), Math.max(U.y + 30, Math.min(U.y + U.h - 30, p.y))),
  });
  B.handle({
    get: () => V(st.cx + st.rx, st.cy), color: plotInk.gold, thin: true,
    set: p => { st.rx = Math.max(28, Math.min(260, p.x - st.cx)); },
    clamp: p => V(Math.max(st.cx + 28, Math.min(st.cx + 260, p.x)), st.cy),
  });

  B.render();
  return B;
}
