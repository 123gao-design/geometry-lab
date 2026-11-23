/* 图 E2b · 根位置判据：二次方程 ax²+bx+c=0 的实根相对参照区间 (1,3) 的位置 —— 三项判据逐项书写
   ① 顶点滑动 (x−t)²−1/4：两根间距 1，拖 t 扫过「左外→一内一外→都在内→右外」全程；
   ② x²−2x+c：顶点固定在参照区间左端点 x=1 上 —— 无实根 / 压线（双根落在端点）/ 一内一外 三态；
   ③ −(x−t)²+1：开口向下（a=−1）—— 同样的五态，但判据 a·f(k) 的符号跟着 a 对调。
   三项判据：Δ（根存在）→ 对称轴位置 → 端点符号 a·f(k)；经典「一根<k一根>k ⟺ a·f(k)<0」直接验证。
   从 R5 位置迁入 E2（与 E2 共享工具）：二次方程根的分布是二次函数专属内容，随「零点三语言」旁证收编。
   图象规范：B.isoFit 等单位取景；公式一律 B.tex/btnM/chipM；网格 / 轴标注 两开关；两根/顶点/端点为必采锚点。 */
import { mk, V, fmt } from '../../../lib/board.js';
import { FunctionBoard } from '../function-board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new FunctionBoard(root, W, H);

  // abc(v)：系数（随参数变）；pn 参数名；ur/v0 滑块档位；box 取景
  const PRESETS = [
    { name: '① 顶点滑动', eq: '$f(x)=(x-t)^2-\\dfrac{1}{4}$，参照区间 $(1,3)$ —— 拖参数，看两根的位置随之变化',
      abc: v => [1, -2 * v, v * v - 0.25], pn: 't', ur: [-1.5, 4.5], v0: -0.8,
      f: (x, v) => (x - v) * (x - v) - 0.25, box: [-2, 5.2, -1.1, 5] },
    { name: '② 顶点压端点', eq: '$f(x)=x^2-2x+c$，参照区间 $(1,3)$ —— 顶点固定在 $x=1$（左端点上）',
      abc: v => [1, -2, v], pn: 'c', ur: [-1.5, 4], v0: 3.2,
      f: (x, v) => x * x - 2 * x + v, box: [-1.8, 4.5, -2.8, 4.2] },
    { name: '③ 开口向下', eq: '$f(x)=-(x-t)^2+1$，参照区间 $(1,3)$ —— $a=-1$：判据符号跟着对调',
      abc: v => [-1, 2 * v, 1 - v * v], pn: 't', ur: [-1.5, 4.5], v0: 0.2,
      f: (x, v) => -(x - v) * (x - v) + 1, box: [-2, 5.2, -3.2, 1.8] },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, v: -0.8, grid: true, labs: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cP = B.chipM('参数'), cT = B.chipM('三判据'), cV = B.chipM('判定'), cK = B.chipM('k 检验');

  const EZ = 1e-9;
  /** 分类两根相对开区间 (1,3) 的位置 */
  function classify(r1, r2, real) {
    if (!real) return ['无实根（Δ<0）：整条抛物线悬空 —— 区间内外都没有根', 'warn'];
    if (Math.abs(r1 - 1) < EZ || Math.abs(r1 - 3) < EZ || Math.abs(r2 - 1) < EZ || Math.abs(r2 - 3) < EZ)
      return ['根压在端点上 —— 开闭区间的口径要单独审（等号进不进，依题意而定）', 'warn'];
    if (r2 < 1) return ['两根都在左外（都 < 1）—— 对 k=1、k=3 都有 a·f(k)>0 同号', ''];
    if (r1 > 3) return ['两根都在右外（都 > 3）—— 同样 a·f(1)、a·f(3) 双同号', ''];
    if (r1 < 1 && r2 > 3) return ['两根夹住区间：1、3 都在两根之间 —— f(1)、f(3) 同号（这一态端点符号查不出来）', ''];
    if (r1 < 1) return [`一内一外（左外右内）：$r_1=${fmt(r1, 2)}$ 在外、$r_2=${fmt(r2, 2)}$ 在内 —— $a\\cdot f(1)<0$ ✓`, 'ok'];
    if (r2 > 3) return [`一内一外（右外左内）：$r_1=${fmt(r1, 2)}$ 在内、$r_2=${fmt(r2, 2)}$ 在外 —— $a\\cdot f(3)<0$ ✓`, 'ok'];
    return ['两根都在参照区间 (1,3) 内 —— 三查全过：Δ≥0、轴在区内、两端同号且与 a 同号', 'ok'];
  }

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const [a, b, c] = P.abc(st.v);
    const D = b * b - 4 * a * c;
    const real = D >= -1e-12;
    const vx = -b / (2 * a), vy = P.f(vx, st.v);
    const f1 = P.f(1, st.v), f3 = P.f(3, st.v);
    let r1 = null, r2 = null;
    if (real) {
      const s = Math.sqrt(Math.max(D, 0));
      r1 = Math.min((-b - s) / (2 * a), (-b + s) / (2 * a));
      r2 = Math.max((-b - s) / (2 * a), (-b + s) / (2 * a));
    }
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.note(P.eq, '#93a1b5');
    // 参照区间 (1,3)：绿带 + 两端虚线
    mk('rect', { x: px(1), y: py(M.Y1), width: px(3) - px(1), height: py(M.Y0) - py(M.Y1), fill: '#4ade80', 'fill-opacity': .06 }, B.dyn);
    B.seg(V(px(1), py(0)), V(px(3), py(0)), { stroke: '#4ade80', 'stroke-width': 5, 'stroke-opacity': .55, 'stroke-linecap': 'butt' });
    for (const k of [1, 3]) B.seg(V(px(k), py(M.Y0)), V(px(k), py(M.Y1)), { stroke: '#4ade80', 'stroke-width': 1.2, 'stroke-dasharray': '5 6', 'stroke-opacity': .5 });
    // 抛物线（蓝）：两根 / 顶点 / 参照区间端点为必采锚点
    const xs = [];
    for (let x = M.X0; x <= M.X1 + 0.001; x += 0.04) xs.push(x);
    for (const u of [r1, r2, vx, 1, 3]) if (u != null && u > M.X0 && u < M.X1) xs.push(u);
    xs.sort((p, q) => p - q);
    let d = '', pen = false;
    for (const x of xs) {
      const y = P.f(x, st.v);
      if (y > M.Y0 && y < M.Y1) { d += (pen ? 'L' : 'M') + px(x).toFixed(1) + ' ' + py(y).toFixed(1) + ' '; pen = true; continue; }
      pen = false;
    }
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
    // 顶点（灰）与两根（金）
    if (vy > M.Y0 && vy < M.Y1) B.dot(V(px(vx), py(vy)), 3.5, { fill: '#93a1b5' });
    if (real) for (const [r, lab] of [[r1, 'r_1'], [r2, 'r_2']]) {
      B.dot(V(px(r), py(0)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.note(`$${lab}$`, '#ffd166');
    }
    // 徽章
    const [txt, cls] = classify(real ? r1 : 0, real ? r2 : 0, real);
    const af1 = a * f1, af3 = a * f3;
    cP(`$${P.pn}=${fmt(st.v, 2)}$`, '');
    cT(`$\\Delta=${fmt(D, 2)}$，轴 $x=${fmt(vx, 2)}$，$f(1)=${fmt(f1, 2)}$，$f(3)=${fmt(f3, 2)}$`, '');
    cV(txt, cls);
    const tag = (s, k) => s < 0 ? `$a f(${k})=${fmt(s, 2)}<0$ → ${k} 在两根之间` : s > 0 ? `$a f(${k})=${fmt(s, 2)}>0$ → ${k} 在两根之外` : `$a f(${k})=0$ → ${k} 恰是零点`;
    cK(real ? `一根<1一根>1 ⟺ $af(1)<0$；一根<3一根>3 ⟺ $af(3)<0$ —— ${tag(af1, 1)}；${tag(af3, 3)}` : '无实根时端点符号全同号 —— 但 a·f(k)<0 绝不出现（一内一外无根可谈）', real ? '' : 'warn');
  };

  const slV = B.slider('参数', -1.5, 4.5, 0.05, -0.8, v => { st.v = v; B.render(); });
  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    slV.setAttribute('min', p.ur[0]); slV.setAttribute('max', p.ur[1]);
    slV.sync(p.v0); st.v = p.v0;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);
  B.hint("移动抛物线，观察实根通过参照区间端点的情形。");
  B.render();
  return B;
}