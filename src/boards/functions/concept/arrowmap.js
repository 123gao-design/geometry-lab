/* 图 C1 · 箭头实验台：四种对应方式的合法性判定
   映射三要求 = 每个输入都有像（完整性）+ 像唯一（单值性）+ B 允许有剩余（不要求满）。
   局部坐标约定：u∈[0,860] 向右、v∈[0,430] 向下（SVG 原生方向）。
   注意：解构时不得出现名为 B 的字段 —— B 是画板实例（TDZ 坑，先例见 fixedpt.js）。 */
import { mk, V } from '../../../lib/board.js';
import { glowDot } from '../../../lib/conic-diagram.js';
import { presetRow } from '../properties/preset-row.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 800, H = 360;
  const B = new FunctionBoard(root, W, H);
  root.classList.add('fn-study-board', 'fn-wrap-legend');
  const XA = 148, XB = 652;
  const A = [1, 2, 3, 4], BV = [10, 20, 30, 40];
  const ys = i => 102 + i * 66;

  // E: [输入下标, 输出下标]；map/inj/surj 为该对应方式的判定结论（0/1）
  const PRESETS = [
    { name: '一对一', E: [[0, 0], [1, 1], [2, 2], [3, 3]], map: 1, inj: 1, surj: 1 },
    { name: '多对一', E: [[0, 0], [1, 0], [2, 1], [3, 1]], map: 1, inj: 0, surj: 0 },
    { name: '一对多', E: [[0, 0], [0, 1], [1, 2], [2, 3], [3, 3]], map: 0, inj: 0, surj: 0 },
    { name: '缺少像', E: [[0, 0], [1, 1], [3, 3]], map: 0, inj: 0, surj: 0 },
  ];
  const st = { p: 0, sel: 0 };

  const cMap = B.chip('映射'), cFn = B.chip('函数'), cInj = B.chip('单射'), cSur = B.chip('满射'), cVal = B.readout('当前输入');

  /** 一条带箭头的弧线：二次贝塞尔，箭头三角按终点方向自动摆正 */
  function edge(p1, p2, at) {
    const cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2 - 34;
    mk('path', { d: `M${p1.x} ${p1.y} Q${cx} ${cy} ${p2.x} ${p2.y}`, fill: 'none', ...at }, B.dyn);
    const dx = p2.x - cx, dy = p2.y - cy, L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L, s = 7;
    const bx = p2.x - ux * 12, by = p2.y - uy * 12; // 三角后退一点，避免盖住输出点
    mk('polygon', {
      points: `${bx + ux * s},${by + uy * s} ${bx - uy * s * .62},${by + ux * s * .62} ${bx + uy * s * .62},${by - ux * s * .62}`,
      ...at, fill: at.stroke,
    }, B.dyn);
  }

  B.renderFn = () => {
    const P = PRESETS[st.p];
    const nImg = i => P.E.filter(e => e[0] === i).length;   // 输入 i 的像个数
    const hit = j => P.E.some(e => e[1] === j);             // 输出 j 是否被命中
    const bad = i => nImg(i) > 1;                           // 一对多违例
    const miss = i => nImg(i) === 0;                        // 缺像违例

    B.text(V(XA, 48), '输入集合 A', { fill: '#5cadff', 'font-weight': 700 });
    B.text(V(XB, 48), '输出集合 B', { fill: '#4ade80', 'font-weight': 700 });
    B.seg(V(XA, 61), V(XA, 323), { stroke: '#3a4a63', 'stroke-dasharray': '2 7' });
    B.seg(V(XB, 61), V(XB, 323), { stroke: '#3a4a63', 'stroke-dasharray': '2 7' });

    for (let i = 0; i < 4; i++) {
      const sel = i === st.sel;
      const color = miss(i) ? '#ff9e4a' : sel ? '#ffd166' : '#5cadff';
      if (sel) glowDot(B, V(XA, ys(i)), B.drawingColors[color], 8, 3.5);
      else B.dot(V(XA, ys(i)), 5, { fill: color });
      B.text(V(XA - 28, ys(i) + 4), String(A[i]), { 'text-anchor': 'end', 'font-size': 13 });
      if (miss(i)) B.note('输入 $' + A[i] + '$ 无像', '#ff9e4a');
    }
    for (let j = 0; j < 4; j++) {
      const h = hit(j);
      if (P.E.some(([a, b]) => a === st.sel && b === j)) glowDot(B, V(XB, ys(j)), B.diagramColors.green, 8, 3.5);
      else B.dot(V(XB, ys(j)), 3.5, { fill: h ? '#4ade80' : '#3f5f8f', ...(h ? {} : { 'fill-opacity': .45 }) });
      B.text(V(XB + 28, ys(j) + 4), String(BV[j]), { 'font-size': 13, ...(h ? {} : { fill: '#5c6a80' }) });
      if (!h) B.note('输出 $' + BV[j] + '$ 无原像', '#93a1b5');
    }
    for (const [ai, bi] of P.E) {
      const on = ai === st.sel;
      edge(V(XA + 16, ys(ai)), V(XB - 12, ys(bi)), {
        stroke: bad(ai) ? '#ff7b8a' : on ? '#ffd166' : '#5cadff',
        'stroke-width': on || bad(ai) ? 3.2 : 1.8,
        ...(on || bad(ai) ? {} : { 'stroke-opacity': .75 }),
      });
    }

    // 判定徽章
    cMap(P.map ? '是映射' : '不是映射', P.map ? 'ok' : 'warn');
    cFn(P.map ? '是，数集间的映射' : '否，对应不满足映射条件', P.map ? 'ok' : 'warn');
    cInj(P.map ? P.inj ? '是' : '否' : '不适用', P.inj ? 'ok' : '');
    cSur(P.map ? P.surj ? '所有输出都有原像' : '部分输出无原像' : '不适用', P.surj ? 'ok' : '');

    const imgs = P.E.filter(e => e[0] === st.sel).map(e => BV[e[1]]);
    if (imgs.length === 0) cVal(`$x=${A[st.sel]}$ 没有像`, 'warn');
    else if (imgs.length > 1) cVal(`$x=${A[st.sel]}$ 有两个像 $${imgs.join(',\\,')}$`, 'warn');
    else cVal(`输入 $${A[st.sel]}$ 对应输出 $${imgs[0]}$`, 'ok');
  };

  B.slider('输入 x', 1, 4, 1, 1, v => { st.sel = v - 1; B.render(); }, undefined, v => `$x=${Number(v)}$`);
  presetRow(B.ctrl, '选择例题', PRESETS, i => {
    st.p = i;
    B.render();
  });
  B.render();
  return B;
}
