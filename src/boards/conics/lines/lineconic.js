/* 图 L1 · 线弦机：直线与三种圆锥曲线的位置关系一览
   局部坐标（中心/顶点为原点，v 向下为正）：椭圆 u²/a²+v²/b²=1；双曲线 u²/a²−v²/b²=1；抛物线 v²=2pu。
   直线过把手 P0、方向角 α，沿线单位参数化 P(t) = P0 + t·d，代入曲线得 A t² + B t + C = 0：
   Δ>0 交两点 / Δ=0 相切 / Δ<0 相离。
   第四态（判别式失效）：A≈0 时退化一次方程，恰交一点 ——
   双曲线：方向平行渐近线（k=±b/a）；抛物线：方向平行对称轴（水平）。 */
import { Board, mk, V, add, mul, dist, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const st = { mode: 'e', cx: 430, cy: 245, a: 180, b: 112, p: 140, vx: 240, alpha: 35 * Math.PI / 180, P0: V(318, 122) };

  const isE = () => st.mode === 'e', isH = () => st.mode === 'h', isP = () => st.mode === 'p';
  const dir = () => V(Math.cos(st.alpha), Math.sin(st.alpha));
  const O = () => V(isP() ? st.vx : st.cx, st.cy);

  const cN = B.chip('位置状态'), cD = B.chip('判别式 Δ'), cK = B.chip('斜率对照');

  const btns = {};
  const setMode = m => { st.mode = m; for (const k in btns) btns[k].classList.toggle('on', k === m); B.render(); };
  for (const [k, lab] of [['e', '椭圆'], ['h', '双曲线'], ['p', '抛物线']])
    btns[k] = B.btn(lab, () => setMode(k));
  btns.e.classList.add('on');
  B.slider('直线倾角°', 0, 180, 1, 35, v => { st.alpha = v * Math.PI / 180; B.render(); });

  B.renderFn = () => {
    const o = O(), d = dir(), aa = st.a * st.a, bb = st.b * st.b;
    // 轴
    B.seg(V(20, st.cy), V(W - 20, st.cy), { stroke: '#22314a', 'stroke-width': 1.3 });
    B.seg(V(isP() ? st.vx : st.cx, 16), V(isP() ? st.vx : st.cx, H - 16), { stroke: '#22314a', 'stroke-width': 1.3 });
    // 曲线
    if (isE()) {
      const pts = [];
      for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03)
        pts.push(`${(st.cx + st.a * Math.cos(t)).toFixed(1)},${(st.cy + st.b * Math.sin(t)).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.4 }, B.dyn);
      B.textM(V(st.cx - st.a + 30, st.cy - st.b + 14), '$u^2/a^2+v^2/b^2=1$', { fill: '#67e8f9', 'font-size': 11.5 });
    } else if (isH()) {
      for (const s of [1, -1]) B.inf(V(st.cx, st.cy), V(st.cx + s * st.a, st.cy + st.b), { stroke: '#3a4a63', 'stroke-width': 1.2, 'stroke-dasharray': '6 6' });
      B.textM(V(st.cx + st.a + 20, st.cy - st.b - 8), '渐近线 $y=\\pm(b/a)x$', { fill: '#93a1b5', 'font-size': 11 });
      for (const s of [1, -1]) {
        const pts = [];
        for (let w = -1.35; w <= 1.35 + 1e-9; w += 0.03)
          pts.push(`${(st.cx + s * st.a / Math.cos(w)).toFixed(1)},${(st.cy + st.b * Math.tan(w)).toFixed(1)}`);
        mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.4 }, B.dyn);
      }
    } else {
      const pts = [];
      for (let v = -220; v <= 220; v += 3)
        pts.push(`${(st.vx + v * v / (2 * st.p)).toFixed(1)},${(st.cy + v).toFixed(1)}`);
      mk('polyline', { points: pts.join(' '), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.4 }, B.dyn);
      B.textM(V(st.vx + 130, st.cy - 30), '$v^2=2pu$', { fill: '#67e8f9', 'font-size': 11.5 });
    }
    // 直线与联立方程（沿线参数化，d 为单位向量）
    const pl = V(st.P0.x - o.x, st.P0.y - o.y);
    let A2, Bq, Cq;
    if (isE()) { A2 = d.x * d.x / aa + d.y * d.y / bb; Bq = 2 * (pl.x * d.x / aa + pl.y * d.y / bb); Cq = pl.x * pl.x / aa + pl.y * pl.y / bb - 1; }
    else if (isH()) { A2 = d.x * d.x / aa - d.y * d.y / bb; Bq = 2 * (pl.x * d.x / aa - pl.y * d.y / bb); Cq = pl.x * pl.x / aa - pl.y * pl.y / bb - 1; }
    else { A2 = d.y * d.y; Bq = 2 * (pl.y * d.y - st.p * d.x); Cq = pl.y * pl.y - 2 * st.p * pl.x; }
    B.inf(st.P0, add(st.P0, d), { stroke: '#ff9e4a', 'stroke-width': 2 });
    // 求根与交点（DEG 阈值：整度滑块到不了精确平行，近退化时第二交点确已逃出画布）
    const hits = [];
    if (Math.abs(A2) < 1e-5) {
      if (Math.abs(Bq) < 1e-9) {
        cN(isH() ? '直线恰是渐近线本身：零交点（曲线永远追不上它）' : '系数全零：整条重合（退化）', 'warn');
      } else {
        const why = isH() ? '方向相交于渐近线' : '方向平行对称轴';
        hits.push(add(st.P0, mul(d, -Cq / Bq)));
        cN(`A≈0（${why}）→ 退化一次方程，画布内恰交一点`, 'warn');
      }
      cD('二次项 A 归零：判别式失效（第四态）', 'warn');
    } else {
      const D = Bq * Bq - 4 * A2 * Cq;
      if (D > 1e-9) {
        const s = Math.sqrt(D);
        hits.push(add(st.P0, mul(d, (-Bq - s) / (2 * A2))), add(st.P0, mul(d, (-Bq + s) / (2 * A2))));
        cN('Δ > 0：相交（交于两点）', 'ok');
      } else if (D > -1e-9) {
        hits.push(add(st.P0, mul(d, -Bq / (2 * A2))));
        cN('Δ = 0：相切（二重根，只碰一下）', 'ok');
      } else cN('Δ < 0：相离（实平面零交点）', '');
      cD(`Δ = ${fmt(D, 1)}，二次项 A = ${fmt(A2, 4)}`, D > -1e-9 ? '' : 'warn');
    }
    hits.forEach((p, i) => {
      B.dot(p, 5.5, { fill: '#67e8f9', stroke: '#fff', 'stroke-width': 1.8 });
      B.text(V(p.x + 8 * (i ? 1 : -1), p.y - 10), i ? 'Q' : 'P', { fill: '#67e8f9', 'font-size': 12.5, 'font-weight': 700, 'text-anchor': i ? 'start' : 'end' });
    });
    // 斜率对照
    const kv = d.x !== 0 ? d.y / d.x : Infinity;
    if (isH()) {
      const r = st.b / st.a, near = Math.abs(kv - r) < 0.04 || Math.abs(kv + r) < 0.04;
      cK(`k = ${fmt(kv, 2)}｜渐近线 k = ±${fmt(r, 2)}${near ? ' ← 相交于了！' : ''}`, near ? 'warn' : '');
    } else if (isP()) {
      const near = Math.abs(kv) < 0.04;
      cK(`k = ${fmt(kv, 2)}｜对称轴 k = 0${near ? ' ← 平行对称轴！' : ''}`, near ? 'warn' : '');
    } else {
      cK(`k = ${fmt(kv, 2)}｜椭圆无第四态（A = b²+a²k² > 0 恒二次）`, '');
    }
    B.hint('Δ 的符号直接读出相交 / 相切 / 相离；双曲线接近渐近线、抛物线倾角调到 0° —— 判别式失效（第四态）');
  };

  B.handle({
    get: () => st.P0,
    set: q => { st.P0 = V(q.x, q.y); },
    color: '#ff9e4a', r: 9, label: '拖我', lo: [12, -14],
  });

  B.render();
  return B;
}
