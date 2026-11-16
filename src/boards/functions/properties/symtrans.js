/* 图 S5 · 对称翻译机：抽象式才是对称性的本质 —— f(a+x)=f(b−x) ⇔ 对称轴 x=(a+b)/2；f(a+x)+f(b−x)=0 ⇔ 中心 ((a+b)/2, 0)
   四个预设：①② 「检验函数」验证（对称性与图象形状无关，式子唯一决定轴/中心）、③ 由一半写另一半（代入 f(4−x) 翻译出解析式）、
   ④ 参数关（f(x)=x²+mx+1 要满足 ① 的式子，拖 m 验收：只有 m=−4 谈得拢 —— 自有轴 x=−m/2 必须与式子的轴重合）。
   探针 u：两翼端点 (u, f(u)) 与 (4−u, f(4−u)) 关于 x=2 等距 —— 等高读「轴对称」，等值反向读「中心对称」。
   图象规范：B.isoFit 等单位取景；公式一律 B.tex（KaTeX）渲染；网格 / 轴标注 两开关；marks 与接榫点为必采锚点。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);

  // f 检验函数；box 取景框；marks 必采锚点（也是屏幕灰点）；mode：axis 轴 / ctr 中心 / half 半张翻译 / param 参数关
  const PRESETS = [
    { name: '① 轴对称显影：$f(1+x)=f(3-x)$',
      eq: '式子：对一切 x，$f(1+x)=f(3-x)$',
      f: x => { const t = x - 2; return t * t * t * t - t * t; },   // 检验函数：W 形 —— 形状不像抛物线，式子照样决定其对称
      box: [-0.6, 4.6, -0.5, 2.2], mode: 'axis', axis: 2, marks: [[1, 0], [2, 0], [3, 0]],
      ver: '轴 $x=\\dfrac{1+3}{2}=2$ —— 与 f 的长相无关，式子唯一确定对称轴', cls: 'ok' },
    { name: '② 中心显影：$f(1+x)+f(3-x)=0$',
      eq: '式子：对一切 x，$f(1+x)+f(3-x)=0$',
      f: x => { const t = x - 2; return t * t * t - t; },           // 检验函数：S 形 —— 绕 (2,0) 转 180° 自身重合
      box: [-0.6, 4.6, -3.2, 3.2], mode: 'ctr', center: [2, 0], marks: [[2, 0]],
      ver: '中心 $\\left(\\dfrac{1+3}{2},\\ 0\\right)=(2,\\ 0)$ —— 两翼端点等距、等值反向', cls: 'ok' },
    { name: '③ 由一半写另一半',
      eq: '已知 $x\\ge 2$ 时 $f(x)=(x-3)^2$，且对一切 x 有 $f(x)=f(4-x)$',
      f: x => x >= 2 ? (x - 3) * (x - 3) : (x - 1) * (x - 1),      // 右半是给定的一半，左半 = f(4−x) 对称像
      box: [-1.5, 4.5, -0.6, 2.6], mode: 'half', axis: 2, halfAt: 2, marks: [[1, 0], [3, 0], [2, 1]],
      ver: '$x<2$ 时：$f(x)=f(4-x)=(4-x-3)^2=(1-x)^2$ —— 另一半不用猜，代入翻译', cls: 'ok' },
    { name: '④ 参数关：$f(x)=x^2+mx+1$',
      eq: '$f(x)=x^2+mx+1$ 要满足 ① 的式子（对一切 x）—— m 该是多少？',
      f: (x, m) => x * x + m * x + 1,
      box: [-2.2, 4.2, -3.4, 5], mode: 'param', axis: 2, marks: [] },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, u: 1.2, m: -1, grid: true, labs: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cP = B.chipM('两翼读数'), cV = B.chipM('翻译判定');

  /** 必采锚点：marks 与 halfAt 的 x（③ 的接榫点 (2,1) 两侧都要踩准）；域外由 B.plot 自行丢弃 */
  const anc = () => { const P = PRESETS[st.p], a = P.marks.map(([mx]) => mx);
    if (P.halfAt != null) a.push(P.halfAt); return a; };

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.tex(V(16, 24), P.eq, { size: 14, color: '#93a1b5', anchor: 'start' });
    // 式子翻译出的「隐形成分」：金色对称轴 / 对称中心
    if (P.axis != null) B.seg(V(px(P.axis), py(Y0)), V(px(P.axis), py(Y1)), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 6', 'stroke-opacity': .75 });
    if (P.center) B.dot(V(px(P.center[0]), py(P.center[1])), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    // 曲线：③ 拆两半（给定半支蓝实线 / 对称像金虚线），其余整条蓝实线；④ 随 m 变
    const F = P.mode === 'param' ? x => P.f(x, st.m) : P.f;
    if (P.mode === 'half') {
      B.plot(F, M, { dom: x => x >= P.halfAt, anchors: anc(), step: .04, stroke: '#5cadff', 'stroke-width': 2.4 });
      B.plot(F, M, { dom: x => x < P.halfAt, anchors: anc(), step: .04, stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-dasharray': '7 5' });
      B.tex(V(px(X0) + 12, py(-0.35)), '金虚线：翻译件 $f(4-x)$', { size: 12, color: '#ffd166', anchor: 'start' });
      B.tex(V(px(2.55), py(-0.35)), '蓝实线：给定半支 $x\\ge 2$', { size: 12, color: '#5cadff', anchor: 'start' });
    } else B.plot(F, M, { anchors: anc(), step: .04, stroke: '#5cadff', 'stroke-width': 2.4 });
    for (const [mx, my] of P.marks) B.dot(V(px(mx), py(my)), 3.5, { fill: '#93a1b5' });
    if (P.mode === 'param') {   // 抛物线的自有轴 x=−m/2：拖 m 看它向式子要的轴（x=2）靠拢
      const vx = -st.m / 2;
      B.seg(V(px(vx), py(Math.max(Y0, P.f(vx, st.m)))), V(px(vx), py(Y1)), { stroke: '#5cadff', 'stroke-width': 1, 'stroke-dasharray': '2 5', 'stroke-opacity': .7 });
      B.tex(V(px(vx) + 8, py(Y1) + 44), `自有轴 $x=${fmt(vx, 2)}$`, { size: 11.5, color: '#5cadff', anchor: 'start' });
      if (P.f(vx, st.m) > Y0 && P.f(vx, st.m) < Y1) B.dot(V(px(vx), py(P.f(vx, st.m))), 3.5, { fill: '#93a1b5' });
    }
    // 探针两翼：(u, f(u)) 与 (4−u, f(4−u)) 关于 x=2 等距 —— 连线读「等高（轴）/ 反向（中心）」
    const u = P.mode === 'param' ? 1 : st.u;
    const y1 = F(u), y2 = F(4 - u);
    if (y1 > Y0 && y1 < Y1 && y2 > Y0 && y2 < Y1) {
      B.seg(V(px(u), py(y1)), V(px(4 - u), py(y2)), { stroke: '#ff9e4a', 'stroke-width': 1.6, 'stroke-dasharray': '4 4', 'stroke-opacity': .9 });
      B.dot(V(px(u), py(y1)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.dot(V(px(4 - u), py(y2)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.seg(V(px(u), py(y1)), V(px(u), py(0)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .6 });
      B.seg(V(px(4 - u), py(y2)), V(px(4 - u), py(0)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .6 });
      B.text(V(px(u), py(0) - 8), `u=${fmt(u, 2)}`, { 'font-size': 11, fill: '#ff9e4a' });
      B.text(V(px(4 - u), py(0) - 8), `4−u=${fmt(4 - u, 2)}`, { 'font-size': 11, fill: '#ff9e4a', 'text-anchor': 'end' });
    }
    // 徽章：两翼读数 + 翻译判定
    const ctr = P.mode === 'ctr';
    const ok = ctr ? Math.abs(y1 + y2) < 1e-6 : Math.abs(y1 - y2) < 1e-6;
    cP(`$f(${fmt(u, 2)})=${fmt(y1, 2)}$，$f(${fmt(4 - u, 2)})=${fmt(y2, 2)}$` + (ctr ? `：和 ${fmt(y1 + y2, 2)}` : `：差 ${fmt(Math.abs(y1 - y2), 2)}`), ok ? 'ok' : 'warn');
    if (P.mode === 'param') {
      const hit = Math.abs(st.m + 4) < 1e-3;
      cV(hit
        ? '$m=-4$：两翼处处等高 —— 式子恒成立；自有轴 $x=-\\dfrac{m}{2}=2$ 与式子的轴重合'
        : `$m=${fmt(st.m, 2)}$：$f(1)=${fmt(y1, 2)}\\ne f(3)=${fmt(y2, 2)}$ —— 式子不成立（自有轴 $x=${fmt(-st.m / 2, 2)}$ 偏了，拖到 m=−4 试试）`,
        hit ? 'ok' : 'warn');
    } else cV(P.ver + (ok ? ' —— 两翼现场对上' : ' —— 两翼对不上？！'), P.cls);
  };

  const slU = B.slider('探针 u', 0.6, 1.4, 0.05, 1.2, v => { st.u = v; B.render(); });
  const slM = B.slider('参数 m', -6, 0, 0.05, -1, v => { st.m = v; B.render(); });
  const wrapOf = s => s.parentElement || s.parent;   // 真浏览器 parentElement / 无头测试 parent
  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    wrapOf(slU).style.display = i === 3 ? 'none' : '';   // ④ 不用探针（两翼固定 1 与 3），其余不用 m
    wrapOf(slM).style.display = i === 3 ? '' : 'none';
    if (i === 2) { slU.setAttribute('min', 0.1); slU.setAttribute('max', 1.6); slU.sync(0.5); st.u = 0.5; }
    else if (st.u < 0.6 || st.u > 1.4) { slU.setAttribute('min', 0.6); slU.setAttribute('max', 1.4); slU.sync(1.2); st.u = 1.2; }
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  wrapOf(slM).style.display = 'none';
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('式子里的 1 和 3 不是轴 —— 轴在 (1+3)/2=2：两翼 (u, f(u)) 与 (4−u, f(4−u)) 等距；等高=轴对称，等值反向=中心对称');
  B.render();
  return B;
}
