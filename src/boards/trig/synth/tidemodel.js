/* 图 K2 建模与最值机，双模式：
   模式一 潮汐建模 —— 港口水深散点（真值 5+3sin(2π(x−3)/12)+微噪）由金曲线去拟合，
     四旋钮 A/T/x₀/k 就是 F1 三旋钮 + 中线；残差 RMS 与「建模四步」公式实时核验。
   模式二 最值竞技 —— f(x)=a sinx+b cosx+c 辅助角直译 R sin(x+φ)+c（Q2 全回收）：
     右栏直角三角形读 R 与 φ，max=c+R、min=c−R 与数值实测完全重合。
   坐标：模式一 x∈[0,24]h、y∈[0,9.5]m；模式二 x∈[0,2π]、y 自适应 ±(|c|+R+1)。 */
import { Board, mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new Board(root, 860, 520);
  const st = { mode: 0, A: 3, T: 12, t0: 3, k: 5, a: 1, b: 1, c: 0 };
  const PL = [16, 12, 500, 486], PR = [532, 12, 312, 486];
  const cP = B.chipM('参数核验'), cQ = B.chipM('峰值核验'), cR = B.chipM('谷值核验'), cS = B.chipM('方法判读');
  const ASl = B.slider('振幅 A', 0.5, 6, 0.05, st.A, v => { st.A = v; B.render(); }, 'A');
  const TSl = B.slider('周期 T', 6, 24, 0.5, st.T, v => { st.T = v; B.render(); }, 'Tp');
  const zSl = B.slider('升零点 x₀', 0, 12, 0.25, st.t0, v => { st.t0 = v; B.render(); }, 't0');
  const kSl = B.slider('中线 k', 0, 8, 0.1, st.k, v => { st.k = v; B.render(); }, 'km');
  const aSl = B.slider('系数 a', 0, 3, 0.1, st.a, v => { st.a = v; B.render(); }, 'a');
  const bSl = B.slider('系数 b', 0, 3, 0.1, st.b, v => { st.b = v; B.render(); }, 'b');
  const cSl = B.slider('中线 c', -3, 3, 0.1, st.c, v => { st.c = v; B.render(); }, 'c');
  const rowOf = s => s.parent || s.parentElement;
  const mBtns = [
    B.btnM('潮汐建模', () => setMode(0), { on: true }),
    B.btnM('$a\\sin x+b\\cos x+c$ 最值竞技', () => setMode(1)),
  ];
  const pre = fn => () => { fn(); B.render(); };
  B.btn('① 真值贴合', pre(() => { setMode(0); st.A = 3; st.T = 12; st.t0 = 3; st.k = 5; ASl.sync(3); TSl.sync(12); zSl.sync(3); kSl.sync(5); }));
  B.btn('② 半周期错配', pre(() => { setMode(0); st.A = 3; st.T = 12; st.t0 = 9; st.k = 5; ASl.sync(3); TSl.sync(12); zSl.sync(9); kSl.sync(5); }));
  B.btnM('③ 两波叠一列 $\\sqrt{2}$', pre(() => { setMode(1); st.a = 1; st.b = 1; st.c = 0; aSl.sync(1); bSl.sync(1); cSl.sync(0); }));
  B.btn('④ 3-4-5 波', pre(() => { setMode(1); st.a = 3; st.b = 4; st.c = 2; aSl.sync(3); bSl.sync(4); cSl.sync(2); }));
  function setMode(m) {
    st.mode = m;
    mBtns.forEach((b2, i) => b2.classList.toggle('on', i === m));
    for (const s2 of m === 0 ? [aSl, bSl, cSl] : [ASl, TSl, zSl, kSl]) rowOf(s2).style.display = 'none';
    for (const s2 of m === 0 ? [ASl, TSl, zSl, kSl] : [aSl, bSl, cSl]) rowOf(s2).style.display = '';
    B.render();
  }
  for (const s2 of [aSl, bSl, cSl]) rowOf(s2).style.display = 'none';   // 初始模式一（renderFn 未就位，只藏行）
  // 潮汐数据（真值 5+3sin(2π(x−3)/12) + 固定微噪 17 点）
  const NZ = [0.08, -0.12, 0.05, 0.1, -0.06, 0.12, -0.09, 0.07, 0.13, -0.08, 0.06, -0.11, 0.09, 0.12, -0.05, 0.1, -0.07];
  const dpts = Array.from({ length: 17 }, (_, i) => V(i * 1.5, 5 + 3 * Math.sin(TAU * (i * 1.5 - 3) / 12) + NZ[i]));
  const fit = x => st.k + st.A * Math.sin(TAU * (x - st.t0) / st.T);
  const angArc = (p, r, a0, a1, at) => {
    const n = 22, pts = [];
    for (let i = 0; i <= n; i++) { const t = a0 + (a1 - a0) * i / n; pts.push(`${(p.x + r * Math.cos(t)).toFixed(1)},${(p.y - r * Math.sin(t)).toFixed(1)}`); }
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };

  B.renderFn = () => {
    if (st.mode === 0) {
      const m = { px: v => PL[0] + 26 + v * (PL[2] - 52) / 24, py: v => PL[1] + 442 - v * 396 / 9.6, X0: 0, X1: 24, Y0: 0, Y1: 9.6 };
      B.grid({ ...m, sx: 4, sy: 1, grid: true, labs: true, axLab: 't', ayLab: 'd' });
      B.tex(V(m.px(12), m.py(9.6) - 6), '港口水深 d（m）随时刻 t（h）', { size: 12, color: '#93a1b5', anchor: 'mid', w: 300 });
      // 数据散点（按残差染色：近绿远红）
      dpts.forEach(p => {
        const e2 = Math.abs(fit(p.x) - p.y);
        B.dot(V(m.px(p.x), m.py(p.y)), 4, { fill: e2 < 0.35 ? '#67e8f9' : '#ff6b6b' });
      });
      // 拟合金曲线 + 峰/谷/升零点
      const xs = Array.from({ length: 121 }, (_, i) => 24 * i / 120).concat([0, 24]).sort((p, q) => p - q);
      mk('polyline', { points: xs.map(x => `${m.px(x).toFixed(1)},${m.py(fit(x)).toFixed(1)}`).join(' '), fill: 'none', stroke: '#ffd166', 'stroke-width': 2.2 }, B.dyn);
      const z1 = st.t0, pk = st.t0 + st.T / 4, gy = st.t0 + 3 * st.T / 4;
      [[z1, '升零'], [pk, '峰'], [gy, '谷']].forEach(([x, nm]) => {
        if (x < 0 || x > 24) return;
        B.dot(V(m.px(x), m.py(fit(x))), 3.5, { fill: nm === '谷' ? '#ff9e4a' : '#ffd166' });
        B.tex(V(m.px(x), m.py(fit(x)) + (nm === '峰' ? -14 : 16)), nm, { size: 11, color: nm === '谷' ? '#ff9e4a' : '#ffd166', anchor: 'mid', w: 50 });
      });
      // 右栏：实测对照表 + 建模四步
      const M = Math.max(...dpts.map(p => p.y)), mn = Math.min(...dpts.map(p => p.y));
      B.tex(V(PR[0] + PR[2] / 2, 34), '情境对照表（潮汐）', { size: 13, color: '#93a1b5', anchor: 'mid', w: 260 });
      B.tex(V(PR[0] + 26, 64), `实测峰 M=${fmt(M, 2)} · 谷 m=${fmt(mn, 2)}`, { size: 14, color: '#e8eef7', anchor: 'start', w: 280 });
      B.tex(V(PR[0] + PR[2] / 2, 104), '建模四步（从数据读真值）', { size: 13, color: '#93a1b5', anchor: 'mid', w: 280 });
      B.tex(V(PR[0] + 26, 134), `$T=$ 两峰距 ${fmt(12, 1)}$`, { size: 14, color: '#ffd166', anchor: 'start', w: 260 });
      B.tex(V(PR[0] + 26, 166), `$A=(M-m)/2=${fmt((M - mn) / 2, 2)}$`, { size: 14, color: '#ffd166', anchor: 'start', w: 260 });
      B.tex(V(PR[0] + 26, 198), `$k=(M+m)/2=${fmt((M + mn) / 2, 2)}$`, { size: 14, color: '#ffd166', anchor: 'start', w: 260 });
      B.tex(V(PR[0] + 26, 230), `$x_0=$ 升段零点 $=3$`, { size: 14, color: '#ffd166', anchor: 'start', w: 260 });
      B.tex(V(PR[0] + 26, 268), `你拧的：A=${fmt(st.A, 2)} T=${fmt(st.T, 1)} x₀=${fmt(st.t0, 2)} k=${fmt(st.k, 2)}`, { size: 13, color: '#67e8f9', anchor: 'start', w: 280 });
      B.tex(V(PR[0] + 26, 300), `残差最大的点已标红 —— 调四旋钮相等全蓝`, { size: 12, color: '#93a1b5', anchor: 'start', w: 280 });
      // chips
      const rms = Math.sqrt(dpts.reduce((p, q) => p + (fit(q.x) - q.y) ** 2, 0) / dpts.length);
      const okP = rms < 0.35;
      cP(`残差 RMS=${fmt(rms, 2)}${okP ? ' 完全重合' : ' —— 数据不吻合，需继续调整'}`, okP ? 'ok' : 'warn');
      const okQ = Math.abs(st.k + st.A - M) < 0.5;
      cQ(`峰：拟合 k+A=${fmt(st.k + st.A, 2)} vs 实测 ${fmt(M, 2)}`, okQ ? 'ok' : 'warn');
      const okR = Math.abs(st.k - st.A - mn) < 0.5;
      cR(`谷：拟合 k−A=${fmt(st.k - st.A, 2)} vs 实测 ${fmt(mn, 2)}`, okR ? 'ok' : 'warn');
      cS('四步：T 看两峰距、A 看峰谷差、k 看中线、x₀ 看升零点', '');
    } else {
      const R = Math.hypot(st.a, st.b), phi = Math.atan2(st.b, st.a);
      const yM = Math.max(4, Math.abs(st.c) + R + 1.2);
      const m = { px: v => PL[0] + 24 + v * (PL[2] - 48) / TAU, py: v => PL[1] + 244 - v * 224 / yM, X0: 0, X1: TAU, Y0: -yM, Y1: yM };
      B.grid({ ...m, sx: Math.PI / 2, sy: yM > 6 ? 2 : 1, grid: true, labs: true, axLab: 'x', ayLab: 'y', xt: [] });
      for (let i = 0; i <= 4; i++)
        B.text(V(m.px(i * Math.PI / 2), PL[1] + 466), ['0', 'π/2', 'π', '3π/2', '2π'][i], { 'font-size': 11, fill: '#93a1b5', 'text-anchor': 'middle' });
      const f2 = x => st.c + st.a * Math.sin(x) + st.b * Math.cos(x);
      const xs = Array.from({ length: 121 }, (_, i) => TAU * i / 120).concat([0, Math.PI / 2 - phi, 3 * Math.PI / 2 - phi, TAU]).sort((p, q) => p - q);
      mk('polyline', { points: xs.map(x => `${m.px(x).toFixed(1)},${m.py(f2(x)).toFixed(1)}`).join(' '), fill: 'none', stroke: '#5cadff', 'stroke-width': 2.2 }, B.dyn);
      B.seg(V(m.px(0), m.py(st.c)), V(m.px(TAU), m.py(st.c)), { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '5 4' });
      const pk = ((Math.PI / 2 - phi) % TAU + TAU) % TAU, gy = (pk + Math.PI) % TAU;
      B.dot(V(m.px(pk), m.py(st.c + R)), 4.5, { fill: '#ffd166' });
      B.tex(V(m.px(pk) + 10, m.py(st.c + R) - 10), `max=${fmt(st.c + R, 2)}`, { size: 12, color: '#ffd166', anchor: 'start', w: 110 });
      B.dot(V(m.px(gy), m.py(st.c - R)), 4.5, { fill: '#ff9e4a' });
      B.tex(V(m.px(gy) + 10, m.py(st.c - R) + 18), `min=${fmt(st.c - R, 2)}`, { size: 12, color: '#ff9e4a', anchor: 'start', w: 110 });
      // 右栏：辅助角直角三角形（auxilab 先例）
      B.tex(V(PR[0] + PR[2] / 2, 34), '辅助角直读', { size: 13, color: '#93a1b5', anchor: 'mid', w: 260 });
      const sc = 34, C0 = V(PR[0] + 78, PR[1] + 210), P2 = V(C0.x + sc * st.a, C0.y), P3 = V(P2.x, C0.y - sc * st.b);
      B.seg(C0, P2, { stroke: '#5cadff', 'stroke-width': 3 });
      B.seg(P2, P3, { stroke: '#67e8f9', 'stroke-width': 3 });
      B.seg(C0, P3, { stroke: '#ffd166', 'stroke-width': 3 });
      angArc(C0, 20, 0, phi, { stroke: '#93a1b5', 'stroke-width': 1.2 });
      B.tex(V(C0.x + 6, C0.y + 16), 'φ', { size: 13, color: '#93a1b5', anchor: 'start', w: 30 });
      B.tex(V((C0.x + P2.x) / 2, C0.y + 16), `a=${fmt(st.a, 1)}`, { size: 12, color: '#5cadff', anchor: 'mid', w: 70 });
      B.tex(V(P2.x + 34, (P2.y + P3.y) / 2), `b=${fmt(st.b, 1)}`, { size: 12, color: '#67e8f9', anchor: 'mid', w: 70 });
      B.tex(V((C0.x + P3.x) / 2 - 26, (C0.y + P3.y) / 2 - 8), `R=${fmt(R, 2)}`, { size: 12, color: '#ffd166', anchor: 'mid', w: 80 });
      B.tex(V(PR[0] + PR[2] / 2, 306), `$f=R\\sin(x+\\varphi)+c$`, { size: 15, color: '#ffd166', anchor: 'mid', w: 240 });
      B.tex(V(PR[0] + PR[2] / 2, 338), `$\\varphi=\\arctan\\tfrac{b}{a}=${fmt(phi, 2)}$`, { size: 13, color: '#67e8f9', anchor: 'mid', w: 240 });
      B.tex(V(PR[0] + PR[2] / 2, 372), `max=c+R=${fmt(st.c + R, 2)} 在 x=π/2−φ 取得`, { size: 13, color: '#e8eef7', anchor: 'mid', w: 290 });
      B.tex(V(PR[0] + PR[2] / 2, 400), `min=c−R=${fmt(st.c - R, 2)} 再隔半周期`, { size: 13, color: '#e8eef7', anchor: 'mid', w: 290 });
      // chips：与数值实测核验
      let fMax = -1e9, fMin = 1e9;
      for (let i = 0; i <= 480; i++) { const v = f2(TAU * i / 480); fMax = Math.max(fMax, v); fMin = Math.min(fMin, v); }
      cP(`R=√(a²+b²)=${fmt(R, 2)} —— 斜边管峰高`, Math.abs(fMax - (st.c + R)) < 0.02 ? 'ok' : 'warn');
      cQ(`max：理论 c+R=${fmt(st.c + R, 2)} vs 实测 ${fmt(fMax, 2)}`, Math.abs(fMax - (st.c + R)) < 0.02 ? 'ok' : 'warn');
      cR(`min：理论 c−R=${fmt(st.c - R, 2)} vs 实测 ${fmt(fMin, 2)}`, Math.abs(fMin - (st.c - R)) < 0.02 ? 'ok' : 'warn');
      cS('辅助角：两波叠一列，R 管峰高、c 管中线（Q2 全回收）', '');
    }
  };
  B.render();
  B.hint('模式一：调 A/T/x₀/k 四旋钮把金线压上蓝点；模式二：辅助角把两波叠成一列，max/min 直接读');
  return B;
}
