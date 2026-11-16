/* 图 S6 · 周期延拓机：f(x+T)=f(x) 对一切 x ⇔ T 是周期 —— 三个来路一次验收
   ① 平移重合（周期的定义现场：s=2 谷对峰不重合，s=4 完全重合 —— 周期不是对半折）；
   ② 双轴推周期：两条对称轴相距 d → T=2d（检验函数故意不对称，排除「其实是 T=2」的错觉）；
   ③ 轴+中心推周期：对称轴与对称中心相距 d → T=4d（轴心交替排列）；
   ④ 周期延拓：只给基本段 [0,2)，f(x)=f(x−2k) 把全轴延拓出来 —— 探针直接演示化归链。
   图象规范：B.isoFit 等单位取景；公式一律 B.tex（KaTeX）；网格 / 轴标注 两开关；marks 与单元边沿为必采锚点。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);

  // f 检验函数（mod 折叠到基本段）；T 基本周期；marks 必采锚点；seps 单元边沿；axes/centers 金色对称轴/中心（②③）
  const PRESETS = [
    { name: '① 平移重合验收', T: 4,
      eq: '候选周期验收：拖 s，问 $f(x+s)=f(x)$ 对一切 x 成立吗',
      f: x => { const r = ((x % 4) + 4) % 4; return r < 2 ? 1 - (r - 1) * (r - 1) : (r - 3) * (r - 3) - 1; },
      box: [-1.5, 10.5, -1.6, 1.6], marks: [[1, 1], [3, -1]], seps: [0, 4, 8], axes: [], centers: [] },
    { name: '② 双轴推周期', T: 4,
      eq: '定理：两条对称轴相距 $d$ → 周期 $T=2d$（本例 $d=2$）',
      f: x => {   // 基本段 h 故意不对称（h(1.5)≠h(2.5)），堵死「其实周期是 2」的巧合
        const h = t => 0.5 * (t - 1) * (t - 3) + 0.3 * (t - 2);
        const r = ((x + 1) % 4 + 4) % 4 - 1;
        return r <= 1 ? h(2 - r) : h(r);
      },
      box: [-1, 7, -0.9, 0.7], marks: [[1, -0.3], [3, 0.3]], seps: [], axes: [1, 3, 5, 7], centers: [] },
    { name: '③ 轴+中心推周期', T: 4,
      eq: '定理：对称轴与对称中心相距 $d$ → 周期 $T=4d$（本例 $d=1$）',
      f: x => 1 - Math.abs(((x + 2) % 4 + 4) % 4 - 2),   // 三角波：偶数处轴、奇数处中心，轴心交替
      box: [-1, 7, -1.4, 1.4], marks: [[0, 1], [1, 0], [2, -1]], seps: [], axes: [0, 2, 4, 6], centers: [1, 3, 5] },
    { name: '④ 周期延拓：由一段延拓全轴', T: 2,
      eq: '延拓规则：$f(x)=f(x-2k)$，$k$ 取到 $x-2k\\in[0,2)$ 为止',
      f: x => { const r = ((x % 2) + 2) % 2; return r < 1 ? r : (2 - r) * (2 - r); },
      box: [-1, 9, -0.9, 1.6], marks: [[0, 0], [1, 1], [2, 0]], seps: [0, 2, 4, 6, 8], axes: [], centers: [] },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, s: 2, u: 1.5, grid: true, labs: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cP = B.chipM('读数'), cV = B.chipM('周期对照');

  /** 必采锚点：marks 与单元边沿（T 的整数倍）（④ 的基本段描边要踩准边沿）；域外由 B.plot 自行丢弃 */
  const anc = () => { const M = MAPS[st.p], P = PRESETS[st.p], a = P.marks.map(([mx]) => mx);
    for (let e = Math.ceil(M.X0 / P.T) * P.T; e <= M.X1 + 1e-9; e += P.T) a.push(e); return a; };

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.tex(V(16, 24), P.eq, { size: 14, color: '#93a1b5', anchor: 'start' });
    // 周期的判定依据（金）：单元边沿（①④）/ 对称轴与对称中心（②③）
    for (const a of P.seps) B.seg(V(px(a), py(Y0)), V(px(a), py(Y1)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '5 6', 'stroke-opacity': .45 });
    for (const a of P.axes) B.seg(V(px(a), py(Y0)), V(px(a), py(Y1)), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 6', 'stroke-opacity': .75 });
    if (P.axes.length) B.text(V(px(P.axes[0]) + 6, py(Y1) + 16), `x=${fmt(P.axes[0], 0)}`, { 'font-size': 11.5, fill: '#ffd166' });
    for (const c of P.centers) B.dot(V(px(c), py(0)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
    if (P.centers.length) B.text(V(px(P.centers[0]) + 8, py(0) - 10), `(${fmt(P.centers[0], 0)}, 0)`, { 'font-size': 11.5, fill: '#ffd166' });
    // 曲线（蓝）；④ 基本段金描边压上（基本段与延拓像）
    B.plot(P.f, M, { anchors: anc(), step: .04, stroke: '#5cadff', 'stroke-width': 2.2 });
    if (st.p === 3) B.plot(P.f, M, { dom: x => x >= 0 && x < 2, anchors: anc(), step: .04, stroke: '#ffd166', 'stroke-width': 3 });
    for (const [mx, my] of P.marks) B.dot(V(px(mx), py(my)), 3.5, { fill: '#93a1b5' });
    if (st.p === 0) {
      // ① 平移验收：平移像 f(x−s) 橙虚线叠上，逐点算最大偏差
      const g = x => P.f(x - st.s);
      B.plot(g, M, { anchors: anc(), step: .04, stroke: '#ff9e4a', 'stroke-width': 2.2, 'stroke-dasharray': '7 5' });
      let err = 0;
      for (let x = X0; x <= X1; x += 0.05) err = Math.max(err, Math.abs(g(x) - P.f(x)));
      const fit = err < 0.02;
      cP(`平移 s=${fmt(st.s, 2)}：最大偏差 ${fmt(err, 2)}`, fit ? 'ok' : 'warn');
      cV(st.s < 0.05 ? '拖「平移 s」：从 2 拖到 4 —— 看平移像什么时候完全重合'
        : fit ? `s=${fmt(st.s, 2)}：完全重合 —— $f(x+${fmt(st.s, 2)})=f(x)$ 对一切 x，$T=4$ 是周期（$4$ 的整数倍都是）`
        : Math.abs(st.s - 2) < 0.25 ? 's=2：谷对峰、完全错位 —— $2$ 不是周期；周期说的是「重合」，不是「对半折」'
        : `s=${fmt(st.s, 2)}：错位（最大偏差 ${fmt(err, 2)}）—— 只有 $4$ 的整数倍完全重合`,
        st.s < 0.05 ? '' : fit ? 'ok' : 'warn');
    } else {
      // ②③④ 探针：周期把两点拴在等高线上；④ 的探针走化归链 x₀ → x₀−2k → 基本段
      const u = st.u, v = u + P.T, y1 = P.f(u), y2 = P.f(v);
      for (const [xx, yy, cc] of [[u, y1, '#ff9e4a'], [st.p === 3 ? u - Math.floor(u / P.T) * P.T : v, y2, '#ffd166']]) {
        if (yy > Y0 && yy < Y1) {
          B.seg(V(px(xx), py(yy)), V(px(xx), py(0)), { stroke: '#3f5f8f', 'stroke-dasharray': '3 5', 'stroke-opacity': .6 });
          B.dot(V(px(xx), py(yy)), 5.5, { fill: cc, stroke: '#0a0d14', 'stroke-width': 1.4 });
        }
      }
      if (y1 > Y0 && y1 < Y1 && y2 > Y0 && y2 < Y1)
        B.seg(V(px(u), py(y1)), V(px(st.p === 3 ? u - Math.floor(u / P.T) * P.T : v), py(y2)), { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-dasharray': '4 4', 'stroke-opacity': .85 });
      if (st.p === 3) {
        const k = Math.floor(u / P.T), r = u - k * P.T;
        cP(`$x_0=${fmt(u, 2)}$ → $x_0-${k}\\times 2=${fmt(r, 2)}$ → $f(${fmt(r, 2)})=${fmt(y1, 2)}$`, 'ok');
        cV('$f(x)=f(x-2k)$：全轴都是基本段 $[0,2)$ 的延拓 —— 这就是「周期延拓」的含义', 'ok');
      } else {
        cP(`$f(${fmt(u, 2)})=${fmt(y1, 2)}$，$f(${fmt(v, 2)})=${fmt(y2, 2)}$：差 ${fmt(Math.abs(y2 - y1), 2)}`, Math.abs(y2 - y1) < 1e-6 ? 'ok' : 'warn');
        cV(st.p === 1
          ? '两条对称轴 $x=1$、$x=3$ 相距 $d=2$ → 周期 $T=2d=4$；两次翻折 = 平移 $2d$ —— 探针验证 $f(u+4)=f(u)$'
          : '轴 $x=0$ 与中心 $(1,0)$ 相距 $d=1$ → 周期 $T=4d=4$：轴翻 + 心转 = 平移 $4d$；轴心交替排列',
          'ok');
      }
    }
  };

  const slS = B.slider('平移 s', 0, 4, 0.02, 2, v => { st.s = v; B.render(); });
  const slU = B.slider('探针 u', -1, 3, 0.05, 1.5, v => { st.u = v; B.render(); });
  const wrapOf = s => s.parentElement || s.parent;   // 真浏览器 parentElement / 无头测试 parent
  const UR = [[-1, 3, 1.5], [-1, 2, 1], [2.5, 7.5, 5.3]];   // ②③④ 各自的探针档位
  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    wrapOf(slS).style.display = i === 0 ? '' : 'none';   // ① 用平移验收，②③④ 用探针
    wrapOf(slU).style.display = i === 0 ? 'none' : '';
    if (i > 0) { slU.setAttribute('min', UR[i - 1][0]); slU.setAttribute('max', UR[i - 1][1]); slU.sync(UR[i - 1][2]); st.u = UR[i - 1][2]; }
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  wrapOf(slU).style.display = 'none';
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('周期说的是「平移后完全重合」：② 轴间距 d → T=2d、③ 轴心距 d → T=4d —— 对称信息换算出周期');
  B.render();
  return B;
}
