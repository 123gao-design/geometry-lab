/* 图 基1b · 拼方图：(a+b)² = 4ab + (a−b)² 的五块拆分
   边长 a+b 的正方形（取 m=min(a,b)、M=max(a,b)）按「四块 ab 围一圈 + 中间一块 (a−b)²」拼成：
   下、右、上、左四块都是 m×M 的矩形（蓝橙相间），中间剩一块 (M−m)×(M−m) 的正方形。
   四块面积 4ab 至多铺满整块正方形（中间那块不小于零），于是 4ab ≤ (a+b)²，开方即 √(ab) ≤ (a+b)/2；
   中间一块缩成零（a=b）时四块恰好拼满，正是取等。
   单位→像素比例 u = S/(m+M)。 */
import { InequalityBoard } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 470;
  const B = new InequalityBoard(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { a: 3, b: 1 };
  const cSq = B.readout('整块'), cAB = B.readout('四块', 'mint'), cD = B.readout('缺口', 'gold'), cJ = B.chipM('判读');

  const S = 320, X0 = (W - S) / 2, YB = (H + S) / 2 - 12;

  B.renderFn = () => {
    const { a, b } = st;
    const m = Math.min(a, b), M = Math.max(a, b);
    const u = S / (M + m);               // 单位 → 像素
    const yt = YB - S;
    const cw = (M - m) * u;              // 中间那块（缺口）的边长（像素）

    // 四块矩形 + 中间空块（蓝橙相间，面积都是 ab）
    const rects = [
      { x: X0, y: YB - m * u, w: M * u, h: m * u, c: '#5cadff' },           // 下
      { x: X0 + M * u, y: YB - M * u, w: m * u, h: M * u, c: '#ff9e4a' },   // 右
      { x: X0 + m * u, y: yt, w: M * u, h: m * u, c: '#5cadff' },           // 上
      { x: X0, y: yt, w: m * u, h: M * u, c: '#ff9e4a' },                   // 左
    ];
    rects.forEach(r => {
      mk('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: r.c, 'fill-opacity': .2, stroke: r.c, 'stroke-width': 1.2 }, B.dyn);
      if (r.w >= 34 && r.h >= 20) B.tex(V(r.x + r.w / 2, r.y + r.h / 2), '$ab$', { size: 13, anchor: 'mid', color: r.c, w: r.w });
    });
    if (cw > 0) {
      mk('rect', { x: X0 + m * u, y: YB - M * u, width: cw, height: cw, fill: '#4ade80', 'fill-opacity': .26, stroke: '#4ade80', 'stroke-width': 1.2 }, B.dyn);
      if (cw >= 68) B.tex(V(X0 + m * u + cw / 2, YB - M * u + cw / 2), '$(a-b)^2$', { size: 12.5, anchor: 'mid', color: '#4ade80', w: cw });
    }
    if (cw === 0) B.mark(V(X0 + S / 2, YB - S / 2), '#4ade80');
    // 正方形外框与边长标注
    mk('rect', { x: X0, y: yt, width: S, height: S, fill: 'none', stroke: '#8fa3bd', 'stroke-width': 2 }, B.dyn);
    B.tex(V(X0 + S / 2, YB + 30), '$a+b$', { size: 13, anchor: 'mid', color: '#8fa3bd' });

    B.note('$(a+b)^2=4ab+(a-b)^2$');
    // 徽章
    cSq(`$(a+b)^2=${f1((a + b) * (a + b))}$`);
    cAB(`$4ab=${f1(4 * a * b)}$`);
    cD(`$(a-b)^2=${f1((a - b) * (a - b))}$`);
    if (Math.abs(a - b) < 1e-9) cJ('四块矩形恰好拼满，取等。', 'ok');
    else cJ('中央正方形面积为正。');
  };

  const PRE = [
    { name: '三与一', formula: '$a=3,\\ b=1$', values: { a: 3, b: 1 } },
    { name: '取等', formula: '$a=b=2$', values: { a: 2, b: 2 } },
    { name: '比例三', formula: '$a=4.5,\\ b=1.5$', values: { a: 4.5, b: 1.5 } },
  ];
  B.examples('选择例题', PRE, st, P => {
    st.a = P.a; st.b = P.b; sA.sync(P.a); sB.sync(P.b); B.render();
  });

  const sA = B.slider('a =', 0.5, 6, .1, 3, v => { st.a = v; B.render(); }, undefined, n => `$a=${n}$`);
  const sB = B.slider('b =', 0.5, 6, .1, 1, v => { st.b = v; B.render(); }, undefined, n => `$b=${n}$`);

  B.render();
  return B;
}
