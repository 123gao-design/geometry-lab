/* 图 F1 三旋钮变波机：y = A sin(ωx+φ) —— A 管值域 [-A,A]（金色值域带随 A 变宽）、
   ω 管周期 T=2π/ω（金色周期段随 ω 伸缩）、φ 管起点 x₀=−φ/ω（五点整体横移）；
   母波 sin x 灰虚参照。三旋钮各管一件事、互不干扰（G1 平移 / G2 伸缩的三角版）。 */
import { TrigLegendBoard, angleTex, piTick } from '../trig-board.js';
import { mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 860, 520);
  const st = { A: 1, w: 1, f: 0, ghost: true, five: true, per: true, grid: true, labs: true };
  const sA = B.slider('振幅 A', 0.2, 3, 0.1, 1, v => { st.A = v; B.render(); }, undefined, (_, v) => `$A=${fmt(v, 2)}$`);
  const sw = B.slider('角频率 ω', 0.5, 3, 0.1, 1, v => { st.w = v; B.render(); }, undefined, (_, v) => `$\\omega=${fmt(v, 2)}$`);
  const sf = B.slider('相位 φ', -Math.PI, Math.PI, Math.PI / 12, 0, v => { st.f = v; B.render(); }, undefined, (_, v) => `$\\varphi=${angleTex(v)}$`);
  B.toggleBtn('母波', true, v => { st.ghost = v; B.render(); });
  B.toggleBtn('五点', true, v => { st.five = v; B.render(); });
  B.toggleBtn('周期 T', true, v => { st.per = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  const examples = [
    { name: '$\\sin x$', A: 1, w: 1, f: 0 },
    { name: '$2\\sin 2x$', A: 2, w: 2, f: 0 },
    { name: '$\\sin(x+\\pi/2)$', A: 1, w: 1, f: Math.PI / 2 },
  ];
  B.choiceRow('选择示例', examples, () => examples.findIndex(p =>
    ['A', 'w', 'f'].every(key => Math.abs(p[key] - st[key]) < 1e-7)), i => {
    const { A, w, f } = examples[i];
    Object.assign(st, { A, w, f });
    sA.sync(A); sw.sync(w); sf.sync(f); B.render();
  });
  const cT = B.readout('周期', 'gold'), cR = B.readout('值域', 'blue'), cS = B.readout('起点', 'mint'), cJ = B.chipM('判读');

  const texF = f => Math.abs(f) < 1e-8 ? '' : (f < 0 ? '-' : '+') + angleTex(Math.abs(f));
  /** 当前解析式：y=A\sin(\omega x+\varphi)（系数为 1 时省略、相位约分成 π 分数） */
  const texY = (A, w, f) => `$y=${Math.abs(A - 1) < 1e-9 ? '' : +fmt(A, 1)}\\sin(${Math.abs(w - 1) < 1e-9 ? '' : +fmt(w, 1)}x${texF(f)})$`;

  B.renderFn = () => {
    const { A, w, f } = st;
    const T = TAU / w, x0 = -f / w;
    const m = B.mapFit(Math.min(-.6, x0 - .5), Math.max(TAU + .6, x0 + T + .5), -3.6, 3.4, B.plotRect);
    const anchors = [0, 1, 2, 3, 4].map(k => x0 + k * T / 4);
    const tick = m.X1 - m.X0 > 15 ? Math.PI : Math.PI / 2;
    const F = x => A * Math.sin(w * x + f);
    B.grid({ ...m, sx: Math.PI / 2, sy: 1, lx: Math.PI / 2, ly: 1, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = Math.ceil(m.X0 / tick); k <= Math.floor(m.X1 / tick); k++) {
      const v = k * tick;
      if (v > m.X0 + 0.01 && v < m.X1 - 0.01) B.text(V(m.px(v), m.py(0) + 16), piTick(v), { 'font-size': 11, fill: '#5c6a80' });
    }
    // 值域带压 y 轴（规范⑤）：[-A, A] 随 A 变宽
    mk('rect', { x: m.px(0) - 7, y: m.py(A), width: 7, height: m.py(-A) - m.py(A), fill: '#ffd166', opacity: .16 }, B.dyn);
    // 周期段：x₀ → x₀+T 的金虚线 + T 读数
    if (st.per) {
      const y = m.py(-3.25), left = m.px(x0), right = m.px(x0 + T);
      B.seg(V(left, y), V(right, y), { stroke: '#ffd166', 'stroke-dasharray': '5 4' });
      for (const x of [left, right]) B.seg(V(x, y - 5), V(x, y + 5), { stroke: '#ffd166' });
      if (st.labs) B.text(V((left + right) / 2, y - 9), 'T', { fill: '#ffd166' });
    }
    if (st.ghost) {
      B.plot(Math.sin, m, { stroke: '#93a1b5', 'stroke-dasharray': '5 5' });
      B.note('母波 $\\sin x$', '#93a1b5', 'dashed');
    }
    B.plot(F, m, { n: 560, anchors, stroke: '#5cadff', 'stroke-width': 2.4 });
    // 五点骨架：起点/峰/中/谷/终点（W1 五点被三旋钮整体加工）
    if (st.five) {
      for (let k = 0; k <= 4; k++) {
        const u = x0 + k * T / 4, yv = [0, A, 0, -A, 0][k];
        if (u > m.X0 + 0.01 && u < m.X1 - 0.01) {
          if (k === 1 || k === 3) B.seg(V(m.px(u), m.py(0)), V(m.px(u), m.py(yv)), { stroke: '#ffd166', 'stroke-width': 1, 'stroke-dasharray': '3 4', 'stroke-opacity': .8 });
          B.mark(V(m.px(u), m.py(yv)), '#ffd166');
        }
      }
      if (st.labs && x0 > m.X0 + 0.01 && x0 < m.X1 - 0.01) B.tex(V(m.px(x0), m.py(0) + 24), '$x_0$', { size: 11, color: '#ffd166', anchor: 'mid', w: 36 });
    }
    B.note(texY(A, w, f), '#5cadff');
    // chips：三读数对三实物（周期段 / 值域带 / 起点金点）
    cT(`$T=\\frac{2\\pi}{\\omega}\\approx${fmt(T, 3)}$`);
    cR(`$y\\in[-${fmt(A, 2)},\\ ${fmt(A, 2)}]$`);
    cS(`$x_0=-\\frac{\\varphi}{\\omega}\\approx${fmt(x0, 3)}$`);
    const j1 = `$A=${fmt(A, 1)}$${A > 1.04 ? ' 拉高' : A < 0.96 ? ' 压扁' : ''}`;
    const j2 = `$T\\approx${fmt(T, 2)}$${T < 6.2 ? ' 压密' : T > 6.45 ? ' 拉疏' : ''}`;
    const j3 = `$x_0\\approx${fmt(x0, 2)}$${x0 < -0.02 ? ' 左移' : x0 > 0.02 ? ' 右移' : ''}`;
    cJ([j1, j2, j3].join(' · '));
  };
  B.render();
  // 出口：三个旋钮的当前值带进自由画板
  B.ggbOutlet(() => [
    `A=${fmt(st.A, 2)}`, `w=${fmt(st.w, 2)}`, `p=${fmt(st.f, 2)}`,
    'f(x)=A sin(w x+p)', 'g(x)=sin(x)',
  ]);
  return B;
}
