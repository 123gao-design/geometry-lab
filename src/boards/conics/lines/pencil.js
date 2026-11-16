/* 图 L4 · 曲线系机：f + λg 编制法 —— 共渐近线族 / 共焦点族 / 过交点族
   局部坐标（中心为原点，v 向下为正）。
   ① asym：x²/a²−y²/b² = λ —— 渐近线只由二次部分决定，λ 管开口方向与大小；
   ② conf：x²/(c²+t) + y²/t = 1 —— 椭圆（t>0）与双曲线（−c²<t<0）共享焦点 ±c；
   ③ pencil：椭圆 f=0 与直线 ℓ=0 的交点被全族 f+λℓ=0 固定；λ* = −f(P₀)/ℓ(P₀) 再送一个点。 */
import { Board, mk, V, fmt, lineConic, marchSegs, segsToPath } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const C = V(430, 245);
  const st = { mode: 'asym', lam: 1, t: 130, lam2: 0.8, k: 0.45, m: -30, P0: V(600, 118) };
  const CC = 110;                      // 共焦点族的半焦距（固定）

  const cA = B.chip('族说明'), cM = B.chip('实测验证'), cG = B.chip('原理');

  const btns = {};
  const setMode = mo => {
    st.mode = mo;
    for (const kk in btns) btns[kk].classList.toggle('on', kk === mo);
    const vis = { asym: [sLamA], conf: [sT], pencil: [sLamP, sK] };
    for (const s of [sLamA, sT, sLamP, sK]) s.parentNode.style.display = vis[mo].includes(s) ? '' : 'none';
    hP0.style.display = mo === 'pencil' ? '' : 'none';
    B.render();
  };
  btns.asym = B.btn('共渐近线族', () => setMode('asym'));
  btns.conf = B.btn('共焦点族', () => setMode('conf'));
  btns.pencil = B.btn('过交点族', () => setMode('pencil'));

  const sLamA = B.slider('λ（共渐近线）', -2.2, 2.2, 0.05, 1, v => { st.lam = v; B.render(); });
  const sT = B.slider('t（共焦点）', -95, 300, 5, 130, v => { st.t = v; B.render(); });
  const sLamP = B.slider('λ（过交点族）', -3, 3, 0.1, 0.8, v => { st.lam2 = v; B.render(); });
  const sK = B.slider('直线斜率 k', -1.2, 1.2, 0.05, 0.45, v => { st.k = v; B.render(); });

  // 常用绘制：双曲线（横向 / 纵向开口）与椭圆
  const drawHyper = (aa, bb, horiz, at) => {
    for (const s of [1, -1]) {
      const pts = [];
      if (horiz) for (let w = -1.32; w <= 1.32; w += 0.03) pts.push(`${(C.x + s * aa / Math.cos(w)).toFixed(1)},${(C.y + bb * Math.tan(w)).toFixed(1)}`);
      else for (let w = -1.32; w <= 1.32; w += 0.03) pts.push(`${(C.x + aa * Math.tan(w)).toFixed(1)},${(C.y + s * bb / Math.cos(w)).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
    }
  };
  const drawEllipse = (aa, bb, at) => {
    const pts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.04) pts.push(`${(C.x + aa * Math.cos(t)).toFixed(1)},${(C.y + bb * Math.sin(t)).toFixed(1)}`);
    mk('polyline', { points: pts.join(' '), fill: 'none', ...at }, B.dyn);
  };
  const axes = () => {
    B.seg(V(20, C.y), V(W - 20, C.y), { stroke: '#22314a', 'stroke-width': 1.1 });
    B.seg(V(C.x, 16), V(C.x, H - 16), { stroke: '#22314a', 'stroke-width': 1.1 });
  };

  B.renderFn = () => {
    axes();
    if (st.mode === 'asym') {
      const a = 160, b = 100;
      for (const s of [1, -1]) B.inf(C, V(C.x + s * a, C.y + b), { stroke: '#3a4a63', 'stroke-width': 1.2, 'stroke-dasharray': '6 6' });
      B.textM(V(C.x + a + 14, C.y - b - 6), '渐近线 $y=\\pm(b/a)x$ —— λ 全程缺席', { fill: '#93a1b5', 'font-size': 11, 'text-anchor': 'start' });
      for (const g of [0.35, -0.35, 1.4, -1.4])
        drawHyper(a * Math.sqrt(Math.abs(g)), b * Math.sqrt(Math.abs(g)), g > 0, { stroke: '#3a4a63', 'stroke-width': 1.1, opacity: 0.55 });
      const lam = st.lam;
      if (Math.abs(lam) < 0.05) {
        cA(`λ=${fmt(lam, 2)}：族收拢到渐近线十字本身（两条直线，退化成员）`, 'warn');
      } else {
        drawHyper(a * Math.sqrt(Math.abs(lam)), b * Math.sqrt(Math.abs(lam)), lam > 0, { stroke: '#67e8f9', 'stroke-width': 2.6 });
        cA(`x²/a²−y²/b² = λ = ${fmt(lam, 2)}：λ>0 横向开口 · λ<0 纵向开口`, '');
      }
      cM(`顶点 (±a√|λ|, 0) = (±${fmt(a * Math.sqrt(Math.abs(st.lam)), 0)}, 0) 随 λ 缩放，但渐近线斜率 ±b/a 全程不动`, '');
      cG('公共点原理：渐近线由二次部分 x²/a²−y²/b² 单方面决定，常数只管把曲线挂上去', '');
      B.hintM('滑 λ：全族共享同两条渐近线（虚影就是别的家族成员）。λ 过 0 时横竖开口对调 —— 判别式失效的第四态（L1）正是 $\\lambda\\to 0$ 的极限位置');
    } else if (st.mode === 'conf') {
      B.dot(V(C.x - CC, C.y), 4.5, { fill: '#ff7b8a' });
      B.dot(V(C.x + CC, C.y), 4.5, { fill: '#ff7b8a' });
      B.text(V(C.x - CC, C.y - 14), 'F₁', { fill: '#ff7b8a', 'font-size': 12, 'font-weight': 700 });
      B.text(V(C.x + CC, C.y - 14), 'F₂', { fill: '#ff7b8a', 'font-size': 12, 'font-weight': 700 });
      const ghost = t => {
        if (t <= -CC * CC || Math.abs(t) < 8) return;
        if (t > 0) drawEllipse(Math.sqrt(CC * CC + t), Math.sqrt(t), { stroke: '#3a4a63', 'stroke-width': 1.1, opacity: 0.5 });
        else drawHyper(Math.sqrt(CC * CC + t), Math.sqrt(-t), true, { stroke: '#3a4a63', 'stroke-width': 1.1, opacity: 0.5 });
      };
      [40, 230, -55].forEach(ghost);
      const t = st.t;
      if (t <= -CC * CC || Math.abs(t) < 8) {
        cA(`t=${t}：退化（t=0 或 t=−c² 处族坍缩）`, 'warn'); cM('—', ''); cG('—', '');
      } else if (t > 0) {
        const a = Math.sqrt(CC * CC + t), b = Math.sqrt(t);
        drawEllipse(a, b, { stroke: '#67e8f9', 'stroke-width': 2.6 });
        cA(`t=${t}>0：椭圆 x²/(c²+t)+y²/t=1，a=${fmt(a, 0)} b=${fmt(b, 0)}`, '');
        cM(`a²−b² = ${fmt(a * a - b * b, 0)} = c² = ${CC * CC} → 焦点固定在 ±c`, 'ok');
        cG('t>0 时 a²=c²+t、b²=t，差恒为 c² —— t 只改尺寸，不改名称', '');
      } else {
        const a = Math.sqrt(CC * CC + t), b = Math.sqrt(-t);
        drawHyper(a, b, true, { stroke: '#67e8f9', 'stroke-width': 2.6 });
        cA(`t=${t}<0：双曲线 x²/(c²+t)−y²/(−t)=1，a=${fmt(a, 0)} b=${fmt(b, 0)}`, '');
        cM(`a²+b² = ${fmt(a * a + b * b, 0)} = c² = ${CC * CC} → 同一对焦点`, 'ok');
        cG('−c²<t<0 时族翻成双曲线，与椭圆族共享焦点（两族在交点处互相垂直）', '');
      }
      B.hint('滑 t 穿过 0：椭圆收窄成线段、再炸成双曲线，焦点 F₁F₂ 纹丝不动');
    } else {
      const a = 175, b = 108, E = { cx: C.x, cy: C.y, a, b };
      drawEllipse(a, b, { stroke: '#67e8f9', 'stroke-width': 2.2 });
      const lf = (x, y) => (y - C.y) - st.k * (x - C.x) - st.m;   // ℓ 的左端
      const p1 = V(C.x - 300, C.y + (-300 * st.k + st.m)), p2 = V(C.x + 300, C.y + (300 * st.k + st.m));
      B.inf(p1, p2, { stroke: '#ff9e4a', 'stroke-width': 1.8 });
      const hits = lineConic(E, p1, p2);
      const fam = lam => (x, y) => {
        const u = x - C.x, v = y - C.y;
        return u * u / (a * a) + v * v / (b * b) - 1 + lam * lf(x, y);
      };
      mk('path', { d: segsToPath(marchSegs(fam(st.lam2), 20, 18, W - 20, H - 18, 96, 52)), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.4 }, B.dyn);
      for (const g of [-1.6, -0.7, 0.7, 1.8])
        mk('path', { d: segsToPath(marchSegs(fam(g), 20, 18, W - 20, H - 18, 96, 52)), fill: 'none', stroke: '#3a4a63', 'stroke-width': 1, opacity: 0.45 }, B.dyn);
      if (hits) hits.forEach((p, i) => {
        B.dot(p, 5, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 1.5 });
        B.text(V(p.x, p.y - 12), i ? 'Q' : 'R', { fill: '#67e8f9', 'font-size': 12, 'font-weight': 700 });
      });
      // λ*：再送一个点，把 λ 定死
      const u0 = st.P0.x - C.x, v0 = st.P0.y - C.y;
      const fP0 = u0 * u0 / (a * a) + v0 * v0 / (b * b) - 1, lP0 = v0 - st.k * u0 - st.m;
      if (Math.abs(lP0) > 1e-6) {
        const ls = -fP0 / lP0;
        mk('path', { d: segsToPath(marchSegs(fam(ls), 20, 18, W - 20, H - 18, 96, 52)), fill: 'none', stroke: '#ffd166', 'stroke-width': 2.2 }, B.dyn);
        B.dot(st.P0, 5, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 1.5 });
        B.text(V(st.P0.x + 10, st.P0.y - 10), 'P₀', { fill: '#ffd166', 'font-size': 12, 'font-weight': 700, 'text-anchor': 'start' });
        cM(`λ* = −f(P₀)/ℓ(P₀) = ${fmt(ls, 3)} —— 金色成员恰过 P₀`, Math.abs(fam(ls)(st.P0.x, st.P0.y)) < 1e-6 ? 'ok' : 'warn');
      } else {
        cM(`P₀ 落在 ℓ 上（ℓ(P₀)≈0）：${Math.abs(fP0) < 0.02 ? '整族都过 P₀' : '谁也过不了 P₀'}`, 'warn');
      }
      cA(`F_λ = f + λℓ，当前 λ = ${fmt(st.lam2, 1)}（虚影是别的成员）`, '');
      cG('交点 R、Q 处 f=0 且 ℓ=0 → F_λ = 0 + λ·0 = 0：全族被固定在公共点上', 'ok');
      B.hintM('全族曲线都被固定在两个公共点上 —— 滑 $\\lambda$ 看形变；拖 $P_0$，金色成员由 $\\lambda^*$ 一步定出');
    }
  };

  const hP0 = B.handle({ get: () => st.P0, set: q => { st.P0 = V(q.x, q.y); }, color: '#ffd166', r: 7 });
  setMode('asym');

  return B;
}
