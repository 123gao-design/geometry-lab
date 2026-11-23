/* 图 E7 · 对勾双证台：f(x)=ax+b/x（a,b>0）—— 单栏全景（用户拍板：基本初等函数不画导函数图）。
   双证一致：导数证 f′=0 ⟺ x=√(b/a)（正根），均值证 ax+b/x≥2√(ab) 等号 ⟺ ax=b/x ⟺ x=√(b/a) ——
   两种证法落到同一个点（都在徽章里对读，不占图面）。橙线 y=c 拖动判根（Δ=c²−4ab）回收 R 系列。
   奇函数（S3 回收）：左支 = 右支绕原点转半圈；渐近线 x=0 与斜渐近线 y=ax。
   对勾 y 方向量纲不同（E4 先例）：mapFit 各用比例尺。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new FunctionBoard(root, W, H);

  const M = B.mapFit(-4, 4, -7.5, 7.5, [0, 0, W, H]);
  const st = { a: 1, b: 1, c: 3, grid: true, labs: true, asym: true };
  const f = x => st.a * x + st.b / x, fp = x => st.a - st.b / (x * x);
  const R = () => Math.sqrt(st.b / st.a);            // 顶点横坐标 √(b/a)
  const MN = () => 2 * Math.sqrt(st.a * st.b);       // 极小值 2√(ab)

  const cN = B.chipM('导数证'), cA = B.chipM('均值证'), cM = B.chipM('单调区间'), cR = B.chipM('判根（y=c）');

  /** 两支描曲线（x=0 挖去，两支各画各的）：右支 x∈[0.03, max(X1,−X0)]、左支镜像，各走一遍 B.plot；anchors 必采（±√(b/a)） */
  const plot2 = (g, at, anchors = []) => {
    const hi = Math.max(M.X1, -M.X0), anc = anchors.map(Math.abs);
    B.plot(x => g(x), M, { x0: .03, x1: hi, step: .03, anchors: anc, ...at });
    B.plot(x => g(-x), M, { x0: .03, x1: hi, step: .03, anchors: anc, ...at });
  };

  B.renderFn = () => {
    const { a, b, c } = st, r = R(), mn = MN();
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    if (st.asym) {
      B.asym(M, [{ v: 0 }]);
      B.seg(V(M.px(M.X0), M.py(a * M.X0)), V(M.px(M.X1), M.py(a * M.X1)), { stroke: '#c084fc', 'stroke-width': 1.3, 'stroke-dasharray': '7 6', 'stroke-opacity': .8 });
      B.note(`y=${fmt(a, 2)}x`, '#c084fc');
    }
    plot2(f, { stroke: '#5cadff', 'stroke-width': 2.2 }, [r]);
    // 顶点（金）：(√(b/a), 2√(ab))；左支对称点（奇函数）
    for (const s of [1, -1]) {
      const vx = s * r, vy = s * mn;
      if (vx > M.X0 && vx < M.X1 && vy > M.Y0 && vy < M.Y1) {
        B.dot(V(M.px(vx), M.py(vy)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
        B.note(`$(${fmt(vx, 2)},\\ ${fmt(vy, 2)})$`, '#ffd166');
      }
    }
    B.note(`$f(x)=${fmt(a, 2)}x+\\dfrac{${fmt(b, 2)}}{x}$ —— 对勾：奇函数，左支=右支转半圈`, '#93a1b5');
    // 水平线 y=c（橙虚线）：判根探针
    B.seg(V(M.px(M.X0), M.py(c)), V(M.px(M.X1), M.py(c)), { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-dasharray': '6 5', 'stroke-opacity': .9 });
    const D = c * c - 4 * a * b;
    if (D > 1e-9) for (const s of [1, -1]) {   // 右支判根：两根画橙点
      const rx = (c + s * Math.sqrt(D)) / (2 * a);
      if (c > mn && rx > 0 && rx > M.X0 && rx < M.X1 && c > M.Y0 && c < M.Y1)
        B.dot(V(M.px(rx), M.py(c)), 4.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
    }
    // 徽章
    cN(`$f'=0 \\Leftrightarrow x=\\sqrt{\\dfrac{b}{a}}=${fmt(r, 2)}$（正根），$f''=\\dfrac{2b}{x^3}>0$：极小 $f(r)=2\\sqrt{ab}=${fmt(mn, 2)}$`, 'ok');
    cA(`均值证：$ax+\\dfrac{b}{x}\\ge 2\\sqrt{ax\\cdot\\dfrac{b}{x}}=2\\sqrt{ab}=${fmt(mn, 2)}$，等号 $\\Leftrightarrow ax=\\dfrac{b}{x} \\Leftrightarrow x=\\sqrt{\\dfrac{b}{a}}$`, 'ok');
    cM(`右支：减 $(0,\\ ${fmt(r, 2)})$、增 $(${fmt(r, 2)},\\ +\\infty)$；左支由奇函数镜像（S3）`, '');
    if (D > 1e-9) cR(`$ax+\\dfrac{b}{x}=${fmt(c, 2)} \\Leftrightarrow ${fmt(a, 2)}x^2 ${c >= 0 ? '-' : '+'} ${fmt(Math.abs(c), 2)}x+${fmt(b, 2)}=0$，$\\Delta=c^2-4ab=${fmt(D, 2)}>0$：${c > 0 ? '右支两根（橙点）' : '左支两根'}`, '');
    else if (D > -1e-9) cR(`$\\Delta=0$：切于金点 —— $c=2\\sqrt{ab}=${fmt(mn, 2)}$ 恰是极小值`, 'warn');
    else cR(`$\\Delta=c^2-4ab=${fmt(D, 2)}<0$：水平线与对勾不相交 —— 无实根`, 'warn');
  };

  B.btnM('① $x+\\dfrac{1}{x}$', () => { st.a = 1; st.b = 1; st.c = 3; slA.sync(1); slB.sync(1); B.render(); }, { pri: true, on: true });
  B.btnM('② $x+\\dfrac{4}{x}$', () => { st.a = 1; st.b = 4; st.c = 5; slA.sync(1); slB.sync(4); B.render(); });
  B.btnM('③ $3x+\\dfrac{1}{x}$', () => { st.a = 3; st.b = 1; st.c = 4.5; slA.sync(3); slB.sync(1); B.render(); });
  const slA = B.slider('a', 0.5, 3, 0.1, 1, v => { st.a = v; B.render(); });
  const slB = B.slider('b', 0.5, 3, 0.1, 1, v => { st.b = v; B.render(); });
  B.slider('判根线 c', -6, 8, 0.1, 3, v => { st.c = v; B.render(); });
  B.graphToggles(st);
  B.hint("拖动水平线，观察它与正支的交点个数。");
  B.render();
  return B;
}
