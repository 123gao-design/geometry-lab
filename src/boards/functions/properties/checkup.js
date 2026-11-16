/* 图 S7 · 性质检验机：一条曲线全套复检 —— 单调（分段）、奇偶（镜像验收）、周期（平移验收）、界与最值（界线）
   三个检验函数：① x³−3x（奇、无界、无周期）② 1/(x²+1)（偶、有界、一半最值）③ S6② 双轴检验函数（非奇非偶、周期 4、最值取到）。
   镜像开关同时画两个假设：金虚线 = 偶假设 f(−x)、橙虚线 = 奇假设 −f(−x)，逐点验证谁重合；
   平移开关画紫虚线 f(x−T)，拖候选 T 看谁完全重合。四块徽章 = 四项检验。
   图象规范：B.isoFit 等单位取景；公式一律 B.tex（KaTeX）；网格 / 轴标注 两开关；marks 与对称轴为必采锚点。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 480;
  const B = new Board(root, W, H);

  // f 待检函数；marks 必采锚点；ax 对称轴（③ 常驻金虚线）；supV/infV 界线（null = 无界）；supHit/infHit 界是否取到
  // o/m/b/p：奇偶 / 单调 / 界与最值 / 周期 四项检验（开对应开关时追加逐点验证）
  const PRESETS = [
    { name: '① $f(x)=x^3-3x$', eq: '待检：$f(x)=x^3-3x$', f: x => x * x * x - 3 * x,
      box: [-2.6, 2.6, -3.6, 3.6], marks: [[-1, 2], [1, -2]], ax: [], supV: null, infV: null, supHit: 0, infHit: 0,
      o: '奇函数：$f(-x)=-f(x)$ —— 绕原点转 180° 重合', oCls: 'ok',
      m: '增 (−∞,−1] · 减 [−1,1] · 增 [1,+∞)',
      b: '无上界、无下界 —— 界线画不出来（三次方两头放飞）', bCls: '',
      p: '无周期' },
    { name: '② $f(x)=\\dfrac{1}{x^2+1}$', eq: '待检：$f(x)=\\dfrac{1}{x^2+1}$', f: x => 1 / (x * x + 1),
      box: [-3.4, 3.4, -0.4, 1.4], marks: [[0, 1]], ax: [], supV: 1, infV: 0, supHit: 1, infHit: 0,
      o: '偶函数：$f(-x)=f(x)$ —— 沿 y 轴翻折重合', oCls: 'ok',
      m: '增 (−∞,0] · 减 [0,+∞)',
      b: '最大值 $1$（$x=0$ 取到）；下确界 $0$ 取不到 —— 有界但只有一半最值', bCls: '',
      p: '无周期' },
    { name: '③ S6② 双轴检验函数', eq: '待检：S6② 的双轴检验函数（周期 $4$）', f: x => {   // 与 S6② 同一检验函数：故意不对称的基本段，排除「周期其实是 2」的错觉
      const h = t => 0.5 * (t - 1) * (t - 3) + 0.3 * (t - 2);
      const r = ((x + 1) % 4 + 4) % 4 - 1;
      return r <= 1 ? h(2 - r) : h(r);
    },
      box: [-1, 7, -0.9, 0.7], marks: [[1, -0.3], [3, 0.3]], ax: [1, 3, 5, 7], supV: 0.3, infV: -0.545, supHit: 1, infHit: 1,
      o: '非奇非偶：y 轴折不拢、原点转不拢 —— 对称轴在别处', oCls: '',
      m: '一个周期内增减交替 —— 读透 $[0,4)$ 一段就是全轴',
      b: '最大值 $0.30$、最小值 $-0.55$ 都取到 —— 连续周期函数在基本段上必有最值', bCls: 'ok',
      p: '周期 $T=4$（双轴推周期）' },
  ];
  const MAPS = PRESETS.map(P => B.isoFit(...P.box));
  const st = { p: 0, T: 4, mono: true, mirror: false, shift: false, bound: false, grid: true, labs: true };
  const px = x => MAPS[st.p].px(x), py = y => MAPS[st.p].py(y);
  const cO = B.chipM('奇偶'), cP = B.chipM('周期'), cB = B.chipM('界与最值'), cM = B.chipM('单调');

  /** 必采锚点集：网格 + marks + 对称轴（③ 的周期边沿要踩准） */
  /** 必采锚点：marks 与对称轴的 x（顶点踩准轴）；单调段过滤走 B.plot 的 dom 语义（只画数值导数同号段） */
  const anc = () => { const P = PRESETS[st.p]; return [...P.marks.map(([mx]) => mx), ...P.ax]; };
  const mono = (f, sg) => sg == null ? undefined : x => Math.sign((f(x + 1e-4) - f(x - 1e-4)) / 2e-4) === sg;

  B.renderFn = () => {
    const P = PRESETS[st.p], M = MAPS[st.p];
    const { X0, X1, Y0, Y1 } = M;
    B.grid({ ...M, grid: st.grid, labs: st.labs });
    B.tex(V(16, 24), P.eq, { size: 14, color: '#93a1b5', anchor: 'start' });
    // ③ 的对称轴常驻（金虚线）—— 周期的判定依据先显示
    for (const a of P.ax) B.seg(V(px(a), py(Y0)), V(px(a), py(Y1)), { stroke: '#ffd166', 'stroke-width': 1.4, 'stroke-dasharray': '6 6', 'stroke-opacity': .75 });
    // 曲线：分段模式按 f′ 符号拆段；其余整条蓝
    if (st.mono) { B.plot(P.f, M, { dom: mono(P.f, 1), anchors: anc(), step: .04, stroke: '#4ade80', 'stroke-width': 2.2 }); B.plot(P.f, M, { dom: mono(P.f, -1), anchors: anc(), step: .04, stroke: '#ff7b8a', 'stroke-width': 2.2 }); }
    else B.plot(P.f, M, { anchors: anc(), step: .04, stroke: '#5cadff', 'stroke-width': 2.2 });
    for (const [mx, my] of P.marks) B.dot(V(px(mx), py(my)), 3.5, { fill: '#93a1b5' });
    // 镜像验收：金虚线 = 偶假设 f(−x)、橙虚线 = 奇假设 −f(−x)
    let oTxt = P.o, oCls = P.oCls;
    if (st.mirror) {
      B.plot(x => P.f(-x), M, { anchors: anc(), step: .04, stroke: '#ffd166', 'stroke-width': 2, 'stroke-dasharray': '7 5' });
      B.plot(x => -P.f(-x), M, { anchors: anc(), step: .04, stroke: '#ff9e4a', 'stroke-width': 2, 'stroke-dasharray': '7 5' });
      B.tex(V(16, 46), '金虚线：偶假设 $f(-x)$　橙虚线：奇假设 $-f(-x)$', { size: 12, color: '#93a1b5', anchor: 'start' });
      let eE = 0, eO = 0;
      for (let x = X0; x <= X1; x += 0.05) { eE = Math.max(eE, Math.abs(P.f(-x) - P.f(x))); eO = Math.max(eO, Math.abs(-P.f(-x) - P.f(x))); }
      oTxt += ` —— 逐点验收：偶差 ${fmt(eE, 2)}、奇差 ${fmt(eO, 2)}，${eE < 0.02 ? '偶假设重合' : eO < 0.02 ? '奇假设重合' : '两个假设都错位'}`;
      oCls = eE < 0.02 || eO < 0.02 ? 'ok' : 'warn';
    }
    cO(oTxt, oCls);
    // 平移验收：紫虚线 f(x−T)，拖候选 T
    let pTxt = P.p, pCls = '';
    if (st.shift) {
      B.plot(x => P.f(x - st.T), M, { anchors: anc(), step: .04, stroke: '#c084fc', 'stroke-width': 2, 'stroke-dasharray': '7 5' });
      B.tex(V(16, 46), `紫虚线：平移假设 $f(x-${fmt(st.T, 1)})$`, { size: 12, color: '#93a1b5', anchor: 'start' });
      let e2 = 0;
      for (let x = X0; x <= X1; x += 0.05) e2 = Math.max(e2, Math.abs(P.f(x - st.T) - P.f(x)));
      const fit = e2 < 0.02;
      pTxt = `${P.p} —— 平移验收 T=${fmt(st.T, 1)}：最大偏差 ${fmt(e2, 2)}${fit ? '，完全重合' : '，错位'}`;
      pCls = fit ? 'ok' : 'warn';
    }
    cP(pTxt, pCls);
    // 界线：青虚线；取到的界 = 最值线
    if (st.bound) {
      const line = (v, lab) => {
        if (v <= Y0 || v >= Y1) return;
        B.seg(V(px(X0), py(v)), V(px(X1), py(v)), { stroke: '#67e8f9', 'stroke-width': 1.6, 'stroke-dasharray': '7 6', 'stroke-opacity': .85 });
        B.text(V(px(X1) - 10, py(v) - 8), lab, { 'font-size': 11.5, fill: '#67e8f9', 'text-anchor': 'end' });
      };
      if (P.supV != null) { line(P.supV, `上确界 ${fmt(P.supV, 2)}${P.supHit ? '（取到=最大值）' : '（取不到）'}`); line(P.infV, `下确界 ${fmt(P.infV, 2)}${P.infHit ? '（取到=最小值）' : '（取不到）'}`); }
      else B.text(V(px(X0) + 12, py(Y1) + 18), '无上界无下界 —— 界线画不出来', { 'font-size': 11.5, fill: '#67e8f9', 'text-anchor': 'start' });
    }
    cB(P.b, P.bCls);
    cM(P.m, '');
  };

  const btns = PRESETS.map((p, i) => B.btnM(p.name, () => {
    st.p = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  B.toggleBtn('单调分段', true, on => { st.mono = on; B.render(); });
  B.toggleBtn('奇偶镜像', false, on => { st.mirror = on; B.render(); });
  B.toggleBtn('周期平移', false, on => { st.shift = on; B.render(); });
  B.toggleBtn('确界线', false, on => { st.bound = on; B.render(); });
  B.slider('候选 T', 0.5, 5, 0.1, 4, v => { st.T = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.hint('四项检验各配开关：分段=单调、镜像=奇偶、平移=周期、界线=最值 —— 一条曲线，全套性质直接复检');
  B.render();
  return B;
}
