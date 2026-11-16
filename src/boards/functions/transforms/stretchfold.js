/* 图 G2 · 伸缩翻折机：y=b·f(ax) —— 横向管输入端（除以 a）、纵向管输出端（乘 b）。
   原图固定 √x（不对称才看得清变形）。a 滑块从正拖到负：曲线先塌缩、再从另一侧展开 ——
   f(−x) 关于 y 轴翻折、−f(x) 关于 x 轴翻折由 a、b 的符号一并决定（连续变形，无开关跳变）。
   坐标记录：原图上的点 (x,y) 变到 (x/a, b·y) —— 横坐标除、纵坐标乘，方向相反的两种算术。
   回收：S3 的 f(−x) 镜像、E8 的 |f|（y 轴翻折的对应形式）、G1 的「横内竖外」在乘除版复发。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 520;
  const B = new Board(root, W, H);

  const f = x => Math.sqrt(x);                      // 原图：√x，起笔 (0,0)、过 (1,1)、(4,2)
  const st = { a: 1, b: 1, x: 1, grid: true, labs: true };
  const M = B.isoFit(-5.6, 5.6, -4.2, 4.2);
  const px = x => M.px(x), py = y => M.py(y);

  const cA = B.chipM('横向判读'), cB = B.chipM('纵向判读'), cP = B.chipM('坐标核验'), cS = B.chipM('一句记法');

  B.renderFn = () => {
    const { a, b } = st;
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    const g = x => b * f(a * x);                    // ax<0 → NaN 断笔（定义域自动换边）
    // 原图（蓝淡）+ 像（金粗）：特征点对 (1,1)→(1/a,b)、(4,2)→(4/a,2b) 为必采锚点
    const drawC = (fn, extra, at) => {
      const xs = [];
      for (let u = X0; u <= X1 + 0.001; u += 0.03) xs.push(u);
      for (const ax of extra) if (isFinite(ax) && ax > X0 && ax < X1) xs.push(ax);
      xs.sort((m, n) => m - n);
      let d = '', pen = false;
      for (const u of xs) {
        const y = fn(u);
        if (isFinite(y) && y > Y0 && y < Y1) { d += (pen ? 'L' : 'M') + px(u).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
        pen = false;
      }
      mk('path', { d, fill: 'none', ...at }, B.dyn);
    };
    drawC(f, [1, 4], { stroke: '#5cadff', 'stroke-width': 1.8, 'stroke-opacity': .55 });
    drawC(g, [1 / a, 4 / a], { stroke: '#ffd166', 'stroke-width': 2.4 });
    // 特征点：原图灰小、像金小（a≈0 时像点出框自然跳过）
    for (const [cx, cy] of [[1, 1], [4, 2]]) {
      B.dot(V(px(cx), py(cy)), 3.5, { fill: '#93a1b5', stroke: '#0a0d14', 'stroke-width': 1.1 });
      const dx = cx / a, dy = b * cy;
      if (Math.abs(a) > 1e-9 && dx > X0 && dx < X1 && dy > Y0 && dy < Y1) {
        B.dot(V(px(dx), py(dy)), 4, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
        B.tex(V(px(dx), py(dy) - 12), `$(${fmt(dx, 2)},\\ ${fmt(dy, 2)})$`, { size: 10.5, color: '#ffd166', anchor: 'mid', w: 90 });
      }
    }
    // 探针 P（原图）→ P′（像）：横坐标除 a、纵坐标乘 b
    const x0 = Math.max(st.x, 0.02), y0 = f(x0), x1 = x0 / a, y1 = b * y0;
    B.dot(V(px(x0), py(y0)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.5 });
    if (Math.abs(a) > 1e-9 && x1 > X0 && x1 < X1 && y1 > Y0 && y1 < Y1) {
      B.seg(V(px(x0), py(y0)), V(px(x1), py(y1)), { stroke: '#ff7b8a', 'stroke-width': 1.2, 'stroke-dasharray': '3 5', 'stroke-opacity': .7 });
      B.dot(V(px(x1), py(y1)), 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.5 });
    }
    B.tex(V(14, 18), `$y=${b === 1 ? '' : b === -1 ? '-' : fmt(b, 2)}${a === 1 ? '\\sqrt{x}' : a === -1 ? '\\sqrt{-x}' : `\\sqrt{${fmt(a, 2)}x}`}$ —— 横 $\\times${fmt(a, 2)}$、纵 $\\times${fmt(b, 2)}$（${a < 0 || b < 0 ? '带翻折' : '纯伸缩'}）`, { size: 13, color: '#93a1b5', anchor: 'start', w: 430 });
    // 徽章
    const ah = Math.abs(a);
    if (Math.abs(a) < 1e-9) cA('a=0：f(0·x)=f(0) 退化为常数函数 —— 伸缩变换排除（a 要求非零）', 'warn');
    else if (a > 0) cA(`$a=${fmt(a, 2)}$：横向${a > 1 ? `压缩到 $\\dfrac{1}{a}=${fmt(1 / a, 2)}$ —— 变瘦` : a < 1 ? `拉伸到 $\\dfrac{1}{a}=${fmt(1 / a, 2)}$ —— 变胖` : '原宽（a=1）'}`, a > 1 || a < 1 ? 'ok' : '');
    else cA(`$a=${fmt(a, 2)}$：先按 $|a|=${fmt(ah, 2)}$ 横向${ah > 1 ? '压缩' : '拉伸'}，再沿 y 轴翻折（S3 的镜像）`, 'warn');
    if (b === 0) cB('b=0：值域塌成 y=0 一条线 —— 纵向排除', 'warn');
    else if (b > 0) cB(`$b=${fmt(b, 2)}$：纵向${b > 1 ? `拉高到 $b$ 倍` : b < 1 ? `压低到 $b$ 倍` : '原高（b=1）'}`, b !== 1 ? 'ok' : '');
    else cB(`$b=${fmt(b, 2)}$：先按 $|b|=${fmt(Math.abs(b), 2)}$ 缩放，再沿 x 轴翻折（−f(x)）`, 'warn');
    cP(Math.abs(a) > 1e-9 ? `P $(${fmt(x0, 2)},\\ ${fmt(y0, 2)}) \\to$ P′ $(${fmt(x1, 2)},\\ ${fmt(y1, 2)})$ —— 横坐标除 a、纵坐标乘 b` : 'a≈0：横向除数趋近 0，像点超出视野 —— 横向除数不能取 0', Math.abs(a) > 1e-9 ? '' : 'warn');
    cS('平移用加减（G1）、伸缩翻折用乘除：横移加括号里、竖移加括号外；横缩乘括号里、竖缩乘括号外', '');
  };

  const set = (a, b) => { st.a = a; st.b = b; slA.sync(a); slB.sync(b); B.render(); };
  B.btnM('① $a=2$ 压半', () => set(2, 1), { pri: true, on: true });
  B.btnM('② $a=\\dfrac{1}{2}$ 拉宽', () => set(0.5, 1));
  B.btnM('③ $a=-1$ 左翻', () => set(-1, 1));
  B.btnM('④ $b=-1$ 下翻', () => set(1, -1));
  const slA = B.slider('横向 a', -3, 3, 0.1, 1, v => { st.a = v; B.render(); });
  const slB = B.slider('纵向 b', -3, 3, 0.1, 1, v => { st.b = v; B.render(); });
  B.slider('探针 x', 0.05, 5.2, 0.05, 1, v => { st.x = v; B.render(); });
  const hp = B.handle({
    get: () => V(px(st.x), py(f(st.x))),
    set: p => { st.x = Math.max(0.05, Math.min(5.2, M.X0 + (p.x / W) * (M.X1 - M.X0))); },
    color: '#ff9e4a', r: 6, label: 'P', lo: [-14, -14],
  });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('横向除、纵向乘：a 拖过 0 曲线直接翻边 —— 符号管镜像、绝对值管幅度');
  B.render();
  return B;
}
