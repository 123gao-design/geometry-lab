/* 图 基1c · 凹凸性证明机：y=ln x 上凸（凹）、y=e^x 下凸，中点处曲线与弦的高低差
   证明一（凹）：ln 是凹函数 —— 弦 PQ 整段落在曲线下方，故在横坐标中点
     ln((a+b)/2) ≥ (ln a + ln b)/2 = ln√(ab)，指数函数单调，得 (a+b)/2 ≥ √(ab)。
   证明二（凸）：e^x 是凸函数 —— 弦 PQ 整段落在曲线上方，取 x=ln a、y=ln b，中点
     (e^x+e^y)/2 ≥ e^{(x+y)/2}，左边就是 (a+b)/2、右边就是 √(ab)，同一条不等式。
   两图互为关于 y=x 的镜像：ln 曲线上的点 (u, ln u) 翻过来就是 eˣ 上的点 (ln u, u)。
   版面（2026-11-12）：标题两行占 v≤70，绘图区 [70,78,700,340]；ln 用等单位取景（看得出凹），
   eˣ 竖向量级大，用各向比例尺 —— 只比同一横坐标处的高低，纵轴缩放不改判断。
   局部坐标约定：u∈[0,820] 向右、v∈[0,470] 向下；绘图区左下 (70,418)、右上 (770,78)。
 */
import { InequalityBoard } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 470;
  const B = new InequalityBoard(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 'ln', a: 1, b: 4, grid: true, labs: true };
  const cA = B.readout('算术', 'gold'), cG = B.readout('几何', 'green'), cGap = B.readout('差距', 'mint'), cJ = B.chipM('判读');

  const ML = B.isoFit(0.1, 8.2, -1.8, 2.3, [70, 86, 700, 332], 26);
  const ME = B.mapFit(-1.5, 2.3, -0.8, 8.0, [70, 86, 700, 332], 26);

  B.renderFn = () => {
    const { a, b } = st;
    const A = (a + b) / 2, G = Math.sqrt(a * b);
    const ln = Math.log;
    const deg = Math.abs(a - b) < 1e-9;

    if (st.mode === 'ln') {
      const M = ML;
      B.grid({ ...M, grid: st.grid, labs: st.labs });
      B.plot(Math.log, M, { x0: Math.max(M.X0, .12), step: .02, anchors: [1, a, b, A], stroke: '#5cadff', 'stroke-width': 2.2 });

      const P = V(M.px(a), M.py(ln(a))), Q = V(M.px(b), M.py(ln(b)));
      const Md = V(M.px(A), M.py((ln(a) + ln(b)) / 2)), Nd = V(M.px(A), M.py(ln(A)));
      // 从 P、Q、中点向 x 轴作浅色投影，读三个横坐标
      B.seg(V(P.x, M.py(0)), P, { stroke: '#5cadff', 'stroke-width': 1, 'stroke-opacity': .45, 'stroke-dasharray': '4 4' });
      B.seg(V(Q.x, M.py(0)), Q, { stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-opacity': .45, 'stroke-dasharray': '4 4' });
      B.seg(V(Md.x, M.py(0)), Nd, { stroke: '#4ade80', 'stroke-width': 1, 'stroke-opacity': .5, 'stroke-dasharray': '4 4' });
      if (!deg) B.seg(P, Q, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
      B.seg(Md, Nd, { stroke: '#4ade80', 'stroke-width': 3.2 });
      B.mark(P, '#5cadff');
      B.mark(Q, '#ff9e4a');
      B.mark(Md, '#ffd166');
      B.mark(Nd, '#4ade80');
      if (!deg) B.tex(V(P.x - 8, P.y - 9), '$P$', { size: 12.5, anchor: 'end', color: '#5cadff' });
      if (!deg) B.tex(V(Q.x + 8, Q.y - 9), '$Q$', { size: 12.5, anchor: 'start', color: '#ff9e4a' });
      if (!deg) B.tex(V(Md.x - 9, Md.y + 16), '$M$', { size: 12.5, anchor: 'end', color: '#ffd166' });
      B.tex(V(Nd.x + 9, Nd.y + 5), deg ? '$P=Q=M=N$' : '$N$', { size: 12.5, anchor: 'start', color: '#4ade80' });
      if (!deg) B.tex(V(Md.x + 24, (Md.y + Nd.y) / 2 + 4), `$+${f1(ln(A) - (ln(a) + ln(b)) / 2)}$`, { size: 12, anchor: 'start', color: '#4ade80' });

      cA(`$A=\\dfrac{a+b}{2}=${f1(A)}$`);
      cG(`$\\sqrt{ab}=${f1(G)}$`);
      cGap(`$\\ln A-\\dfrac{\\ln a+\\ln b}{2}=${f1(ln(A) - (ln(a) + ln(b)) / 2)}\\ge0$：$N$ 高出 $M$ 这么多`);
      cJ(deg ? `$a=b=${f1(a)}$：$P,Q$ 重合，弦缩成一点，$N$ 与 $M$ 重合 —— 取等`
        : `取指数：$\\dfrac{a+b}{2}\\ge\\sqrt{ab}$ —— 凹函数的弦在曲线下方，这个高差恒非负`);
    } else {
      const M = ME;
      B.grid({ ...M, grid: st.grid, labs: st.labs });
      B.plot(Math.exp, M, { step: .02, anchors: [ln(a), ln(b), ln(G)], stroke: '#5cadff', 'stroke-width': 2.2 });

      const P = V(M.px(ln(a)), M.py(a)), Q = V(M.px(ln(b)), M.py(b));
      const Mx = ln(G);
      const Md = V(M.px(Mx), M.py(A)), Nd = V(M.px(Mx), M.py(G));
      B.seg(V(P.x, M.py(0)), P, { stroke: '#5cadff', 'stroke-width': 1, 'stroke-opacity': .45, 'stroke-dasharray': '4 4' });
      B.seg(V(Q.x, M.py(0)), Q, { stroke: '#ff9e4a', 'stroke-width': 1, 'stroke-opacity': .45, 'stroke-dasharray': '4 4' });
      B.seg(V(Md.x, M.py(0)), Md, { stroke: '#4ade80', 'stroke-width': 1, 'stroke-opacity': .5, 'stroke-dasharray': '4 4' });
      if (!deg) B.seg(P, Q, { stroke: '#ff9e4a', 'stroke-width': 2.4 });
      B.seg(Md, Nd, { stroke: '#4ade80', 'stroke-width': 3.2 });
      B.mark(P, '#5cadff');
      B.mark(Q, '#ff9e4a');
      B.mark(Md, '#ffd166');
      B.mark(Nd, '#4ade80');
      if (!deg) B.tex(V(P.x - 8, P.y + 4), '$P$', { size: 12.5, anchor: 'end', color: '#5cadff' });
      if (!deg) B.tex(V(Q.x + 8, Q.y + 12), '$Q$', { size: 12.5, anchor: 'start', color: '#ff9e4a' });
      if (!deg) B.tex(V(Md.x + 10, Md.y - 2), '$M$', { size: 12.5, anchor: 'start', color: '#ffd166' });
      B.tex(V(Nd.x + 10, Nd.y + 12), deg ? '$P=Q=M=N$' : '$N$', { size: 12.5, anchor: 'start', color: '#4ade80' });
      if (!deg) B.tex(V(Md.x + 24, (Md.y + Nd.y) / 2 + 4), `$+${f1(A - G)}$`, { size: 12, anchor: 'start', color: '#4ade80' });

      cA(`$\\dfrac{a+b}{2}=${f1(A)}$（弦中点）`);
      cG(`$\\sqrt{ab}=${f1(G)}$（曲线上）`);
      cGap(`$\\dfrac{a+b}{2}-\\sqrt{ab}=${f1(A - G)}\\ge0$：$N$ 低于 $M$ 这么多`);
      cJ(deg ? `$a=b=${f1(a)}$：$P,Q$ 重合，弦缩成一点，$N$ 与 $M$ 重合 —— 取等`
        : `凸函数的弦在曲线上方：$\\dfrac{a+b}{2}\\ge\\sqrt{ab}$ —— 与 ln 那张图是同一条式子翻过来的`);
    }
  };

  B.choiceRow('选择曲线', [{ name: '对数', formula: '$y=\\ln x$' }, { name: '指数', formula: '$y=e^x$' }],
    () => st.mode === 'ln' ? 0 : 1, i => { st.mode = i === 0 ? 'ln' : 'ex'; B.render(); });

  const PRE = [
    { name: '一与四', formula: '$a=1,\\ b=4$', values: { a: 1, b: 4 } },
    { name: '二与六', formula: '$a=2,\\ b=6$', values: { a: 2, b: 6 } },
    { name: '取等', formula: '$a=b=3$', values: { a: 3, b: 3 } },
  ];
  B.examples('选择例题', PRE, st, P => {
    st.a = P.a; st.b = P.b; sA.sync(P.a); sB.sync(P.b); B.render();
  });

  const sA = B.slider('a =', 0.5, 6, .1, 1, v => { st.a = v; B.render(); }, undefined, n => `$a=${n}$`);
  const sB = B.slider('b =', 0.5, 6, .1, 4, v => { st.b = v; B.render(); }, undefined, n => `$b=${n}$`);

  B.graphToggles(st);
  B.render();
  return B;
}
