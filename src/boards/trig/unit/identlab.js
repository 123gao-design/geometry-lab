/* 图 U2 同角恒等验证机：平方关系 sin²α+cos²α=1 与商数关系 tan α=sin α/cos α；切线三角形 OAT 直译 1+tan²α=sec²α。
   左：单位圆直角三角形（斜边恒 1）+ 切线 x=1 上的三角形 OAT（OA=1、AT=tan、OT=sec）；右：高度恒满的堆叠条。 */
import { Board, mk, V, fmt, angDiff } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const O = V(300, 272), R = 150, MAXT = 6 * Math.PI;
  const st = { a: Math.PI / 6, say: '', tline: true };
  let prev = angDiff(st.a, 0);

  const cSin = B.chipM('$\\sin\\alpha$'), cCos = B.chipM('$\\cos\\alpha$'), cTan = B.chipM('$\\tan\\alpha$'),
    cSec = B.chipM('sec α'), cDiv = B.chip('商数'), cSum = B.chip('sin²+cos²'),
    cTS = B.chipM('tan²+1'), cSay = B.chip('判读');

  B.btn('① π/6 验证', () => set(Math.PI / 6,
    '(1/2)² + (√3/2)² = 1/4 + 3/4 = 1 —— 勾股定理在单位圆上的直译'));
  B.btn('② sin=3/5 · 第 II 象限', () => set(Math.PI - Math.asin(0.6),
    '平方给绝对值：|cos| = √(1−0.36) = 0.8；第 II 象限 cos<0 → cos α = −0.8 —— 符号由象限判定'));
  B.btn('③ sin=3/5 · 第 I 象限', () => set(Math.asin(0.6),
    '同样是 sin α=3/5：第 I 象限取正 → cos α = +0.8 —— 开方的 ± 是两解，由象限选定'));
  B.btn('④ tan=2 · 第 I 象限', () => set(Math.atan(2),
    '齐次式路径：tan=2 → sin=2k、cos=k、k=1/√5（第 I 象限取正）→ sin α≈0.894、cos α≈0.447'));
  B.toggleBtn('切线三角形', true, v => { st.tline = v; B.render(); });

  function set(a, say) { st.a = a; st.say = say; prev = angDiff(a, 0); B.render(); }

  B.handle({
    get: () => V(O.x + R * Math.cos(st.a), O.y - R * Math.sin(st.a)),
    set: p => {
      const ang = Math.atan2(-(p.y - O.y), p.x - O.x);
      st.a = Math.max(-MAXT, Math.min(MAXT, st.a + angDiff(ang, prev)));
      prev = ang; st.say = '';
    },
    color: '#5cadff', r: 8, label: 'P', lo: [10, -10],
  });

  B.renderFn = () => {
    const a = st.a, x = Math.cos(a), y = Math.sin(a);
    const t = Math.abs(x) > 1e-6 ? y / x : NaN; // tan α（cos α=0 时无意义）
    const P = V(O.x + R * x, O.y - R * y), M = V(P.x, O.y);
    // 坐标轴 + 单位圆
    B.seg(V(90, O.y), V(500, O.y), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    B.seg(V(O.x, 96), V(O.x, 448), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#22314a', 'stroke-width': 1.8 }, B.dyn);
    // 直角三角形 OMP：斜边 1、直角边 sin 与 cos
    mk('path', { d: `M${O.x},${O.y}L${M.x},${M.y}L${P.x},${P.y}Z`, fill: 'rgba(92,173,255,.07)' }, B.dyn);
    B.seg(O, M, { stroke: '#ff9e4a', 'stroke-width': 3 });
    B.seg(M, P, { stroke: '#5cadff', 'stroke-width': 3 });
    B.seg(O, P, { stroke: '#ffd166', 'stroke-width': 2.4 });
    B.seg(V(M.x, M.y), V(M.x, M.y - 8), { stroke: '#fff', 'stroke-width': 1 }); // 直角标记
    B.textM(V((O.x + M.x) / 2, O.y + (x >= 0 ? 16 : -11)), `$\\cos\\alpha=${fmt(x, 3)}`, { 'font-size': 12, fill: '#ff9e4a' });
    B.textM(V(M.x + (x >= 0 ? 7 : -7), (P.y + M.y) / 2 + 4), `$\\sin\\alpha=${fmt(y, 3)}`, { 'font-size': 12, fill: '#5cadff' });
    B.text(V((O.x + P.x) / 2 + (y >= 0 ? 14 : -14), (O.y + P.y) / 2 + (x >= 0 ? -10 : 12)), '斜边 = 1', { 'font-size': 12, fill: '#ffd166' });
    B.dot(P, 5.5, { fill: '#5cadff' });
    // 切线三角形 OAT：切线 x=1 与终边延长线交出 T —— OA=1、AT=tan、OT=sec，勾股直译 1+tan²=sec²
    if (st.tline && Math.abs(x) > 0.04) {
      const A = V(O.x + R, O.y), T = V(O.x + R, O.y - R * t);
      const vis = Math.abs(t) < 6; // 标签只在可视区贴
      mk('path', { d: `M${O.x},${O.y}L${A.x},${A.y}L${T.x},${T.y}Z`, fill: 'rgba(103,232,249,.06)' }, B.dyn);
      B.seg(V(A.x, Math.min(A.y - 70, T.y - 6)), V(A.x, Math.max(A.y + 70, T.y + 6)),
        { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4' }); // 切线 x=1
      B.seg(P, T, { stroke: '#ffd166', 'stroke-width': 1.3, 'stroke-dasharray': '4 4', 'stroke-opacity': .75 }); // 终边延长线
      B.seg(A, T, { stroke: '#67e8f9', 'stroke-width': 3 });
      B.seg(O, T, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
      const s = t > 0 ? -1 : 1;
      B.seg(V(A.x - 9, A.y), V(A.x - 9, A.y + s * 9), { stroke: '#fff', 'stroke-width': 1 });
      B.seg(V(A.x - 9, A.y + s * 9), V(A.x, A.y + s * 9), { stroke: '#fff', 'stroke-width': 1 }); // 直角标记
      B.dot(T, 4.5, { fill: '#67e8f9' });
      B.dot(A, 3, { fill: '#93a1b5' });
      if (vis) {
        B.textM(V(A.x + 9, (A.y + T.y) / 2 + 4), `$AT=\\tan\\alpha=${fmt(t, 3)}`, { 'font-size': 12, fill: '#67e8f9', 'text-anchor': 'start' });
        B.textM(V((O.x + T.x) / 2 + 10, (O.y + T.y) / 2 + (t > 0 ? -4 : 14)), `$OT=\\sec\\alpha=${fmt(1 / x, 3)}`,
          { 'font-size': 12, fill: '#ff9e4a', 'text-anchor': 'start' });
        B.text(V(A.x, Math.min(A.y - 70, T.y - 6) - 8), '切线 x=1', { 'font-size': 11, fill: '#5c6a80' });
      }
    }
    // 右：堆叠条（总高恒 200px = 1）：下段 cos²、上段 sin²
    const X0 = 690, Wb = 58, Yb = 430, Hb = 200;
    const hCos = Hb * x * x, hSin = Hb * y * y;
    mk('rect', { x: X0, y: Yb - hCos, width: Wb, height: hCos, fill: '#ff9e4a', 'fill-opacity': .75 }, B.dyn);
    mk('rect', { x: X0, y: Yb - hCos - hSin, width: Wb, height: hSin, fill: '#5cadff', 'fill-opacity': .75 }, B.dyn);
    mk('rect', { x: X0, y: Yb - Hb, width: Wb, height: Hb, fill: 'none', stroke: '#22314a', 'stroke-width': 1.4 }, B.dyn);
    B.textM(V(X0 + Wb + 8, Math.min(425, Math.max(250, Yb - hCos / 2))), `$\\cos^2\\alpha=${fmt(x * x, 3)}`, { 'font-size': 12, fill: '#ff9e4a', 'text-anchor': 'start' });
    B.textM(V(X0 + Wb + 8, Math.min(425, Math.max(250, Yb - hCos - hSin / 2))), `$\\sin^2\\alpha=${fmt(y * y, 3)}`, { 'font-size': 12, fill: '#5cadff', 'text-anchor': 'start' });
    B.tex(V(X0 + Wb / 2, Yb - Hb - 16), `$\\sin^2\\alpha+\\cos^2\\alpha=1$`, { anchor: 'mid', w: 300, size: 14 });
    B.text(V(X0 + Wb / 2, Yb + 18), '总高恒满（= 1）', { 'font-size': 11, fill: '#5c6a80' });
    // chips
    cSin(fmt(y, 3)); cCos(fmt(x, 3));
    if (Math.abs(x) > 1e-6) {
      cTan(Math.abs(t) > 999 ? '溢出（→∞）' : fmt(t, 3));
      cDiv(`${fmt(y, 3)} ÷ ${fmt(x, 3)} = ${fmt(t, 3)}（斜率 = tan）`);
      cSec(`$\\sec\\alpha=\\frac{1}{\\cos\\alpha}=${fmt(1 / x, 3)}$`);
      cTS(`$1+\\tan^2\\alpha=\\sec^2\\alpha=${fmt(1 + t * t, 3)}$`, 'ok');
    } else {
      cTan('无定义（cos α = 0）', 'warn'); cDiv('除数为 0 —— 商数关系在此排除', 'warn');
      cSec('无定义（cos α = 0）', 'warn'); cTS('tan、sec 同时排除', 'warn');
    }
    cSum(`${fmt(y * y, 3)} + ${fmt(x * x, 3)} = ${fmt(x * x + y * y, 3)}`, 'ok');
    cSay(st.say || '拖动 P：右侧堆叠条怎么动都满格 —— 平方关系恒成立');
  };
  B.render();
  B.hintM('拖 P：堆叠条怎么动都满格（$\\sin^2+\\cos^2=1$）；切线三角形 OAT 直译 $1+\\tan^2=\\sec^2$；预设看开方 ± 象限联判');
  return B;
}
