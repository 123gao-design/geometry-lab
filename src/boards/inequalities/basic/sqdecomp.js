/* 图 基1b · 拼方图：(a+b)² = 4ab + (a−b)² 的五块拆分
   边长 a+b 的正方形（取 m=min(a,b)、M=max(a,b)）按「四块 ab 围一圈 + 中间一块 (a−b)²」拼成：
   下、右、上、左四块都是 m×M 的矩形（蓝橙相间），中间剩一块 (M−m)×(M−m) 的正方形。
   四块面积 4ab 至多铺满整块正方形（中间那块不小于零），于是 4ab ≤ (a+b)²，开方即 √(ab) ≤ (a+b)/2；
   中间一块缩成零（a=b）时四块恰好拼满，正是取等。
   版面（2026-11-12）：正方形钉在左边 (70,380) 起、边长 300 像素，右栏放等式与实时数目，互不相压。
   局部坐标约定：u∈[0,820] 向右、v∈[0,470] 向下；正方形左下角 (70,380)、边长 S=300 像素，
   单位→像素比例 u = S/(m+M)。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 470;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { a: 3, b: 1 };
  const cSq = B.chipM('整块'), cAB = B.chipM('四块'), cD = B.chipM('缺口'), cJ = B.chipM('判读');

  const X0 = 70, S = 300, YB = 380;     // 正方形：左下角 (70,380)、边长 300 像素
  const RX = 430;                        // 右栏左缘

  B.renderFn = () => {
    const { a, b } = st;
    const m = Math.min(a, b), M = Math.max(a, b);
    const A = (a + b) / 2, G = Math.sqrt(a * b);
    const u = S / (M + m);               // 单位 → 像素
    const yt = YB - S;
    const cw = (M - m) * u;              // 中间那块（缺口）的边长（像素）

    B.textM(V(410, 28), '边长 $a+b$ 的正方形，用四块 $ab$ 的矩形围出一块 $\\,(a-b)^2$ 的空缺', { 'font-size': 13, fill: '#93a1b5', 'text-anchor': 'middle' });

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
    if (cw >= 10) {
      mk('rect', { x: X0 + m * u, y: YB - M * u, width: cw, height: cw, fill: '#4ade80', 'fill-opacity': .26, stroke: '#4ade80', 'stroke-width': 1.2 }, B.dyn);
      if (cw >= 52) B.tex(V(X0 + m * u + cw / 2, YB - M * u + cw / 2), '$(a-b)^2$', { size: 12.5, anchor: 'mid', color: '#4ade80', w: cw });
    }
    // 正方形外框与边长标注
    mk('rect', { x: X0, y: yt, width: S, height: S, fill: 'none', stroke: '#8fa3bd', 'stroke-width': 2 }, B.dyn);
    B.tex(V(X0 + S / 2, YB + 30), '$a+b$', { size: 13, anchor: 'mid', color: '#8fa3bd' });

    // 右栏：等式、结论、实时账目
    B.tex(V(RX, 118), '$(a+b)^2=4ab+(a-b)^2$', { size: 15, anchor: 'start' });
    B.tex(V(RX, 154), '$(a-b)^2\\ \\ge\\ 0\\ \\Longrightarrow\\ 4ab\\ \\le\\ (a+b)^2$', { size: 14.5, anchor: 'start', color: '#ffd166' });
    B.tex(V(RX, 202), '$\\sqrt{ab}\\ \\le\\ \\dfrac{a+b}{2}$', { size: 17, anchor: 'start', color: '#ffd166' });
    B.seg(V(RX, 232), V(790, 232), { stroke: '#5c6a80', 'stroke-width': 1, 'stroke-opacity': .5 });

    B.tex(V(RX, 266), `$(a+b)^2=${f1((a + b) * (a + b))}$`, { size: 13.5, anchor: 'start', color: '#8fa3bd' });
    B.tex(V(RX, 300), `$4ab=${f1(4 * a * b)}$`, { size: 13.5, anchor: 'start', color: '#5cadff' });
    B.tex(V(RX, 334), `$(a-b)^2=${f1((a - b) * (a - b))}$`, { size: 13.5, anchor: 'start', color: '#4ade80' });

    B.textM(V(RX, 380), '蓝橙四块都是 $ab$，中间绿块是 $(a-b)^2$：五块拼起来恰好是整个正方形。', { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'start', w: 360 });
    B.textM(V(RX, 424), Math.abs(a - b) < 1e-9
      ? '中间一块缩成零：四块 $ab$ 恰好拼满 —— 这就是取等。'
      : '中间空出 $(a-b)^2$：四块 $ab$ 铺不满整块正方形，$4ab<(a+b)^2$。',
      { 'font-size': 12, fill: Math.abs(a - b) < 1e-9 ? '#4ade80' : '#ffd166', 'text-anchor': 'start', w: 360 });

    // 徽章
    cSq(`$(a+b)^2=${f1((a + b) * (a + b))}$`);
    cAB(`$4ab=${f1(4 * a * b)}$`);
    cD(`$(a-b)^2=${f1((a - b) * (a - b))}$`);
    if (Math.abs(a - b) < 1e-9) cJ(`$a=b=${f1(a)}$：中间一块缩成零面积，四块 $ab$ 拼满正方形，$(a+b)^2=4ab$ —— 取等`, 'ok');
    else cJ(`$a\\ne b$：中间空出 $(a-b)^2=${f1((a - b) * (a - b))}$，$(a+b)^2=4ab+${f1((a - b) * (a - b))}>4ab$ —— 严格小于`);
  };

  const PRE = [
    { a: 3, b: 1, n: '① $a=3,\\ b=1$（悬殊）' },
    { a: 2, b: 2, n: '② $a=b=2$（取等）' },
    { a: 4.5, b: 1.5, n: '③ $a=4.5,\\ b=1.5$' },
  ];
  PRE.forEach(P => B.btnM(P.n, () => { st.a = P.a; st.b = P.b; sA.sync(P.a); sB.sync(P.b); B.render(); }, { pri: P.n.startsWith('①') }));

  const sA = B.slider('a =', 0.5, 6, .1, 3, v => { st.a = v; B.render(); });
  const sB = B.slider('b =', 0.5, 6, .1, 1, v => { st.b = v; B.render(); });

  B.hintM('拖 a、b：中间那块 $(a-b)^2$ 缩到零时，四块 $ab$ 恰好拼满正方形 —— 取等');
  B.render();
  return B;
}
