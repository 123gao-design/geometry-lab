/* 图 C1 · 箭头实验台：四种对应方式的合法性判定
   映射三要求 = 每个输入都有像（完整性）+ 像唯一（单值性）+ B 允许有剩余（不要求满）。
   局部坐标约定：u∈[0,860] 向右、v∈[0,430] 向下（SVG 原生方向）。
   注意：解构时不得出现名为 B 的字段 —— B 是画板实例（TDZ 坑，先例见 fixedpt.js）。 */
import { Board, mk, V } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 430;
  const B = new Board(root, W, H);
  const XA = 150, XB = 712;                 // 两列元素的横坐标
  const A = [1, 2, 3, 4], BV = [10, 20, 30, 40];
  const ys = i => 100 + i * 70;             // 4 个元素纵坐标：100 / 170 / 240 / 310

  // E: [输入下标, 输出下标]；map/inj/surj 为该对应方式的判定结论（0/1）
  const PRESETS = [
    { name: '① 一对一', E: [[0, 0], [1, 1], [2, 2], [3, 3]], map: 1, inj: 1, surj: 1 },
    { name: '② 多对一', E: [[0, 0], [1, 0], [2, 1], [3, 1]], map: 1, inj: 0, surj: 0 },
    { name: '③ 一对多', E: [[0, 0], [0, 1], [1, 2], [2, 3], [3, 3]], map: 0, inj: 0, surj: 0 },
    { name: '④ 有输入没输出', E: [[0, 0], [1, 1], [3, 3]], map: 0, inj: 0, surj: 0 },
  ];
  const st = { p: 0, sel: 0 };

  const cMap = B.chip('映射'), cFn = B.chip('函数'), cInj = B.chip('单射'), cSur = B.chip('满射'), cVal = B.chip('f(x)');

  /** 一条带箭头的弧线：二次贝塞尔，箭头三角按终点方向自动摆正 */
  function edge(p1, p2, at) {
    const cx = (p1.x + p2.x) / 2, cy = (p1.y + p2.y) / 2 - 34;
    mk('path', { d: `M${p1.x} ${p1.y} Q${cx} ${cy} ${p2.x} ${p2.y}`, fill: 'none', ...at }, B.dyn);
    const dx = p2.x - cx, dy = p2.y - cy, L = Math.hypot(dx, dy) || 1;
    const ux = dx / L, uy = dy / L, s = 7;
    const bx = p2.x - ux * 12, by = p2.y - uy * 12; // 三角后退一点，避免盖住输出点
    mk('polygon', {
      points: `${bx + ux * s},${by + uy * s} ${bx - uy * s * .62},${by + ux * s * .62} ${bx + uy * s * .62},${by - ux * s * .62}`,
      fill: at.stroke, ...at, fill: at.stroke,
    }, B.dyn);
  }

  B.renderFn = () => {
    const P = PRESETS[st.p];
    const nImg = i => P.E.filter(e => e[0] === i).length;   // 输入 i 的像个数
    const hit = j => P.E.some(e => e[1] === j);             // 输出 j 是否被命中
    const bad = i => nImg(i) > 1;                           // 一对多违例
    const miss = i => nImg(i) === 0;                        // 缺像违例

    B.text(V(XA, 52), '集合 A（输入）', { 'font-size': 13, fill: '#93a1b5' });
    B.text(V(XB, 52), '集合 B（输出）', { 'font-size': 13, fill: '#93a1b5' });

    for (let i = 0; i < 4; i++) {
      const sel = i === st.sel;
      B.dot(V(XA, ys(i)), sel ? 9 : 7, { fill: miss(i) ? '#ff9e4a' : sel ? '#ffd166' : '#5cadff' });
      if (sel) B.dot(V(XA, ys(i)), 13, { fill: 'none', stroke: '#ffd166', 'stroke-width': 1.5 });
      B.text(V(XA - 28, ys(i) + 4), String(A[i]), { 'text-anchor': 'end', 'font-size': 13 });
      if (miss(i)) B.text(V(XA, ys(i) - 18), '没有像！', { 'font-size': 12, fill: '#ff9e4a' });
    }
    for (let j = 0; j < 4; j++) {
      const h = hit(j);
      B.dot(V(XB, ys(j)), 7, { fill: h ? '#4ade80' : '#3f5f8f', ...(h ? {} : { 'fill-opacity': .45 }) });
      B.text(V(XB + 28, ys(j) + 4), String(BV[j]), { 'font-size': 13, ...(h ? {} : { fill: '#5c6a80' }) });
      if (!h) B.text(V(XB, ys(j) + 22), '未命中', { 'font-size': 11, fill: '#5c6a80' });
    }
    for (const [ai, bi] of P.E) {
      const on = ai === st.sel;
      edge(V(XA + 14, ys(ai)), V(XB - 14, ys(bi)), {
        stroke: bad(ai) ? '#ff7b8a' : on ? '#ffd166' : '#5cadff',
        'stroke-width': on || bad(ai) ? 3 : 1.6,
        ...(on || bad(ai) ? {} : { 'stroke-opacity': .75 }),
      });
    }

    // 判定徽章
    cMap(P.map ? '是映射' : '不是映射', P.map ? 'ok' : 'warn');
    cFn(P.map ? '是函数（A、B 都是数集）' : '不是映射，更不可能是函数', P.map ? 'ok' : 'warn');
    cInj(P.inj ? '单射：一对一' : '非单射', P.inj ? 'ok' : '');
    cSur(P.surj ? '满射：B 全命中' : '非满射（但仍是映射）', P.surj ? 'ok' : '');

    const imgs = P.E.filter(e => e[0] === st.sel).map(e => BV[e[1]]);
    if (imgs.length === 0) cVal(`x=${A[st.sel]}：没有像 → 不满足完整性`, 'warn');
    else if (imgs.length > 1) cVal(`x=${A[st.sel]}：两个像 ${imgs.join(' 和 ')} → 不满足单值性`, 'warn');
    else cVal(`f(${A[st.sel]}) = ${imgs[0]}`, 'ok');
  };

  const btns = PRESETS.map((p, i) => B.btn(p.name, () => {
    st.p = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.slider('输入 x', 1, 4, 1, 1, v => { st.sel = v - 1; B.render(); });
  B.hint('③④ 不满足、② 合法：一个输入只许一个像，且每个输入必须有像；B 中个别元素无原像并不违规');
  B.render();
  return B;
}
