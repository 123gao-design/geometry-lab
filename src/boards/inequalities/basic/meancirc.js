/* 图 基1 · 圆图均值机：√(ab) ≤ (a+b)/2 的圆图证明
   直径 AB = a+b，C 分 AB 使 AC=a、CB=b，O 为圆心。过 C 作直径的垂线交半圆于 D：
   泰勒斯定理 ∠ADB=90°，由射影定理 DC² = AC·CB = ab，故竖直弦 CD = √(ab)（几何均值 G）；
   半径 OD = (a+b)/2（算术均值 A）。a≠b 时 D 低于半圆顶点，间距 A−G；
   a=b 时 D 到顶、竖弦长等于半径，两水平线重合。
   版面（2026-11-12 重排：文字不再压住弧顶，图内不再重复写公式）：只留一行安置说明（v=32），弧顶 v=140，直径 v=420；
   圆弧用 SVG 的 A 弧命令（不是折线），保证是正圆；两条直角边 AD、DB 一并画出，D 处的直角记号张在它们之间
   （不画弦时这个记号挨着绿竖弦与金半径，会被看成在标 ∠CDO）；a=b 时绿竖弦与金半径重合、角为 0，D 处记号省去。
   两条水平虚线左端标 A、G 的高度，差距花括号放在弧的右侧（x≈790）不再压线。
   局部坐标约定：u∈[0,880] 向右、v∈[0,490] 向下；圆心 (440,400)、像素半径 R0=260，
   单位→像素比例 s=R0/A；直径两端固定于 (180,400) 与 (700,400)。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 880, H = 490;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { a: 1, b: 9, labs: true, guide: true };
  const cAr = B.chipM('算术'), cGe = B.chipM('几何'), cGap = B.chipM('差距'), cJ = B.chipM('判读');
  const CX = 440, CY = 400, R0 = 260;         // 圆心、直径高度、像素半径
  const XL = CX - R0, XR = CX + R0;            // 直径两端
  const TOP = CY - R0;                         // 半圆顶点（= 半径水平线）

  B.renderFn = () => {
    const { a, b } = st;
    const A = (a + b) / 2, G = Math.sqrt(a * b), gap = A - G;
    const s = R0 / A;
    const px = u => CX + (u - A) * s;
    const Cx = px(a), ex = Cx - CX;
    const Dy = CY - Math.sqrt(Math.max(0, R0 * R0 - ex * ex));
    const gapPx = Dy - TOP;

    // 图内不再单写一遍公式（与下方算式重复、还会压字）：只留一句安置说明，单行放在弧顶之上
    B.textM(V(CX, 32), '直径 $AB=a+b$，C 把直径分成 $a$ 与 $b$ 两段；过 C 的垂线交半圆于 D，泰勒斯定理给 $\\angle ADB=90^\\circ$，射影定理给 $DC^2=ab$',
      { 'font-size': 12.5, fill: '#93a1b5', 'text-anchor': 'middle' });

    // 半圆：SVG 弧命令（半径两向相同，必是正圆），淡填充帮忙看出圆面
    mk('path', { d: `M${XL},${CY} A${R0},${R0} 0 0 1 ${XR},${CY}`, fill: '#5cadff', 'fill-opacity': .045, stroke: 'none' }, B.dyn);
    mk('path', { d: `M${XL},${CY} A${R0},${R0} 0 0 1 ${XR},${CY}`, fill: 'none', stroke: '#93a1b5', 'stroke-width': 2 }, B.dyn);

    // 直径两段（蓝 a、橙 b）、竖弦 CD（绿）、半径 OD（金）
    B.seg(V(XL, CY), V(Cx, CY), { stroke: '#5cadff', 'stroke-width': 3.2 });
    B.seg(V(Cx, CY), V(XR, CY), { stroke: '#ff9e4a', 'stroke-width': 3.2 });
    B.seg(V(Cx, CY), V(Cx, Dy), { stroke: '#4ade80', 'stroke-width': 3 });
    B.seg(V(CX, CY), V(Cx, Dy), { stroke: '#ffd166', 'stroke-width': 2.6 });

    // 端点、分点与字母
    if (st.labs) {
      B.dot(V(XL, CY), 5.5, { fill: '#5cadff' }); B.dot(V(XR, CY), 5.5, { fill: '#ff9e4a' });
      B.dot(V(Cx, CY), 5.5, { fill: '#fff', stroke: '#5cadff', 'stroke-width': 2 });
      B.dot(V(Cx, Dy), 5.5, { fill: '#4ade80' }); B.dot(V(CX, CY), 4.5, { fill: '#67e8f9' });
      B.tex(V(XL - 8, CY + 20), '$A$', { size: 13, anchor: 'end', color: '#5cadff' });
      B.tex(V(XR + 8, CY + 20), '$B$', { size: 13, anchor: 'start', color: '#ff9e4a' });
      B.tex(V(Cx, CY + 20), '$C$', { size: 13, anchor: 'mid', color: '#5cadff' });
      B.tex(V(CX + 12, CY - 8), '$O$', { size: 13, anchor: 'start', color: '#67e8f9' });
      B.tex(V((XL + Cx) / 2, CY + 38), '$a$', { size: 12.5, anchor: 'mid', color: '#5cadff' });
      B.tex(V((Cx + XR) / 2, CY + 38), '$b$', { size: 12.5, anchor: 'mid', color: '#ff9e4a' });
      B.tex(V(Cx + 9, (CY + Dy) / 2 + 4), '$G=\\sqrt{ab}$', { size: 12.5, anchor: 'start', color: '#4ade80' });
      // 两条直角边 AD、DB：泰勒斯定理的直角就张在它们之间。不画出来，D 处的直角记号会
      // 挨着绿竖弦与金半径，看着像在标 ∠CDO（那个角一般不是直角，a=b 时才为 0）
      B.seg(V(Cx, Dy), V(XL, CY), { stroke: '#5cadff', 'stroke-width': 2, 'stroke-opacity': .7 });
      B.seg(V(Cx, Dy), V(XR, CY), { stroke: '#ff9e4a', 'stroke-width': 2, 'stroke-opacity': .7 });
      // 直角记号：C 处 CD⊥AB —— 画成「⌐」三条边（两条竖边贴在 CD、AB 上会被粗线盖住，
      // 露出来的是顶边与右边，正好是两条直角边）；D 处 ∠ADB 用平行四边形记号。
      mk('polyline', { points: `${Cx},${CY} ${Cx},${CY - 13} ${Cx + 13},${CY - 13} ${Cx + 13},${CY}`,
        fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.5 }, B.dyn);
      const da = V(XL - Cx, CY - Dy), la = Math.hypot(da.x, da.y) || 1;
      const db = V(XR - Cx, CY - Dy), lb = Math.hypot(db.x, db.y) || 1;
      const da2 = V(Cx + da.x / la * 17, Dy + da.y / la * 17);
      const db2 = V(Cx + db.x / lb * 17, Dy + db.y / lb * 17);
      // a、b 相等时 D 升到弧顶、绿竖弦与金半径重合（夹角为 0），这一处的直角记号一并省去
      if (gapPx > 3) mk('polyline', { points: `${da2.x},${da2.y} ${da2.x + db2.x - Cx},${da2.y + db2.y - Dy} ${db2.x},${db2.y}`,
        fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.5 }, B.dyn);
    }

    // 两条高度线：G 的水平线（过 D）与 A 的切线（过弧顶），左端标字母；差距花括号在弧右侧
    if (st.guide) {
      B.seg(V(XL, Dy), V(790, Dy), { stroke: '#4ade80', 'stroke-width': 1.1, 'stroke-dasharray': '5 4' });
      B.seg(V(XL, TOP), V(790, TOP), { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '5 4' });
      if (gapPx < 26) {
        // 两线贴在一起：合并成一句，免得两条标签叠字
        B.tex(V(XL + 8, TOP - 26), `$A=G=\\dfrac{a+b}{2}=${f1(A)}$`, { size: 12.5, anchor: 'start', color: '#ffd166' });
      } else {
        B.tex(V(XL + 8, TOP - 26), '$A=\\dfrac{a+b}{2}$（半径）', { size: 12.5, anchor: 'start', color: '#ffd166' });
        B.tex(V(XL + 8, Dy - 26), '$G=\\sqrt{ab}$（竖弦）', { size: 12.5, anchor: 'start', color: '#4ade80' });
        // 花括号：x=800 的竖线，上下两条短横从虚线接到竖线，右上箭头指向 A、下箭头指向 G
        const bx = 800, x0 = 790;
        B.seg(V(x0, TOP), V(bx + 9, TOP), { stroke: '#ffd166', 'stroke-width': 1.5 });
        B.seg(V(x0, Dy), V(bx + 9, Dy), { stroke: '#ffd166', 'stroke-width': 1.5 });
        B.seg(V(bx, Dy), V(bx, TOP), { stroke: '#ffd166', 'stroke-width': 1.4 });
        mk('polygon', { points: `${bx - 4},${TOP + 9} ${bx + 4},${TOP + 9} ${bx},${TOP}`, fill: '#ffd166' }, B.dyn);
        mk('polygon', { points: `${bx - 4},${Dy - 9} ${bx + 4},${Dy - 9} ${bx},${Dy}`, fill: '#ffd166' }, B.dyn);
        B.tex(V(bx - 8, (Dy + TOP) / 2), `$A-G=${f1(gap)}$`, { size: 12.5, anchor: 'end', color: '#ffd166' });
      }
    }

    // 徽章
    cAr(`$A=\\dfrac{a+b}{2}=${f1(A)}$（半径 OD）`);
    cGe(`$G=\\sqrt{ab}=${f1(G)}$（竖弦 CD）`);
    cGap(Math.abs(gap) < 1e-9 ? '$A-G=0$：两条高度线重合' : `$A-G=${f1(gap)}$：D 低于弧顶，间距 ${f1(gap)}`);
    if (Math.abs(a - b) < 1e-9) cJ(`$a=b=${f1(a)}$：G 升到半圆顶点，$G=A$ —— 取等`, 'ok');
    else cJ(`$a\\ne b$：竖弦 $CD<OD$，$\\sqrt{ab}<\\dfrac{a+b}{2}$ —— 差 $A-G=\\tfrac{(\\sqrt a-\\sqrt b)^2}{2}\\ge0$`);
  };

  B.btnM('⏩ $b\\to a$', () => {
    const a0 = st.a, b0 = st.b, mid = (a0 + b0) / 2;
    let fr = 0;
    const step = () => {
      fr++;
      const u = Math.min(1, fr / 24);
      st.a = a0 + (mid - a0) * u; st.b = b0 + (mid - b0) * u;
      sA.sync(st.a); sB.sync(st.b); B.render();
      if (u < 1) B.raf(step);
    };
    B.raf(step);
  }, { pri: true });
  const PRE = [
    { a: 1, b: 9, n: '① a=1, b=9（悬殊）' },
    { a: 2, b: 8, n: '② a=2, b=8' },
    { a: 3, b: 3, n: '③ a=b=3（取等）' },
  ];
  PRE.forEach(P => B.btn(P.n, () => { st.a = P.a; st.b = P.b; sA.sync(P.a); sB.sync(P.b); B.render(); }));
  B.graphToggles(st, ['labs']);
  B.toggleBtn('辅助线', true, on => { st.guide = on; B.render(); });

  const sA = B.slider('a =', 0.5, 9, .1, 1, v => { st.a = v; B.render(); });
  const sB = B.slider('b =', 0.5, 9, .1, 9, v => { st.b = v; B.render(); });

  B.hintM('拖 a、b：绿竖线长 $\\sqrt{ab}$，金半径长 $(a+b)/2$ —— 两线差距即 $A-G$');
  B.render();
  return B;
}
