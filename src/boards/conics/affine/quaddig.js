/* 图 A6 · 二次曲线考古机：把一般二次方程挖回标准形
   局部坐标（中心为原点，v 向下为正，比例 55px/单位）：f(u,v) = A u² + B uv + C v² + D u + E v + F = 0。
   步骤：① B²−4AC 定类型；② 有心时解一阶偏导零点 = 中心（移轴）；③ tan2θ = B/(A−C) 转轴消交叉项，
   新系数即特征值 λ± = ((A+C) ± √((A−C)²+B²))/2；④ λ₁u'²+λ₂v'² = K（K=−f(中心)）判实虚、给 e 与焦点。
   预设：对勾（e≈1.082，与 A5 的 sec(ψ/2) 互验）、等轴、斜椭圆、抛物型。 */
import { Board, mk, V, add, mul, fmt, marchSegs, segsToPath } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const C0 = V(430, 245), S = 55;
  const st = { A: 0.5, B: 0.8, C: 1.2, D: 0, E: 0, F: -1 };

  const cT = B.chip('类型'), cC = B.chip('中心（移轴）'), cE = B.chip('特征值（转轴）'), cS = B.chip('标准形');

  const sl = {};
  const mkSlider = (lab, key, mx) => { sl[key] = B.slider(lab, -mx, mx, 0.1, st[key], v => { st[key] = v; B.render(); }); };
  mkSlider('A（x² 项）', 'A', 3); mkSlider('B（交叉项）', 'B', 3); mkSlider('C（y² 项）', 'C', 3);
  mkSlider('D（x 项）', 'D', 4); mkSlider('E（y 项）', 'E', 4); mkSlider('F（常数）', 'F', 6);
  const preset = (name, vals) => B.btn(name, () => {
    Object.assign(st, vals);
    for (const k in vals) { sl[k].value = st[k]; sl[k].dispatchEvent(new Event('input')); }
    B.render();
  });
  preset('对勾', { A: -1, B: 1, C: 0, D: 0, E: 0, F: -1 });
  preset('等轴', { A: 0, B: 1, C: 0, D: 0, E: 0, F: -1 });
  preset('斜椭圆', { A: 0.5, B: 0.8, C: 1.2, D: 0, E: 0, F: -1 });
  preset('抛物型', { A: 0, B: 0, C: 1, D: -2, E: 0, F: 0 });

  B.renderFn = () => {
    const { A, Bc, C: Cc, D, E, F } = { ...st, Bc: st.B };
    const f = (u, v) => A * u * u + Bc * u * v + Cc * v * v + D * u + E * v + F;
    const toScr = p => V(C0.x + p.x * S, C0.y + p.y * S);
    // 坐标轴
    B.seg(V(20, C0.y), V(W - 20, C0.y), { stroke: '#22314a', 'stroke-width': 1.1 });
    B.seg(V(C0.x, 16), V(C0.x, H - 16), { stroke: '#22314a', 'stroke-width': 1.1 });
    B.text(V(C0.x - 8, 28), 'u', { fill: '#93a1b5', 'font-size': 12, 'text-anchor': 'end' });
    B.text(V(W - 26, C0.y - 8), 'v', { fill: '#93a1b5', 'font-size': 12 });
    // 隐函数曲线（marching squares，数学坐标 → 屏幕坐标）
    const segs = marchSegs(f, (20 - C0.x) / S, (18 - C0.y) / S, (W - 20 - C0.x) / S, (H - 18 - C0.y) / S, 110, 60)
      .map(([p, q]) => [toScr(p), toScr(q)]);
    if (segs.length) mk('path', { d: segsToPath(segs), fill: 'none', stroke: '#67e8f9', 'stroke-width': 2.3 }, B.dyn);
    // ① 类型
    const Tq = Bc * Bc - 4 * A * Cc;
    if (Math.abs(A) < 1e-9 && Math.abs(Bc) < 1e-9 && Math.abs(Cc) < 1e-9) {
      cT('二次项全零：退化为直线 / 无轨迹', 'warn'); cC('—', ''); cE('—', ''); cS('—', '');
      B.hint('把六个系数滑到 0 附近可以造出退化货：点、两直线、空集 —— 高考叫「退化」，线性代数叫「秩亏」');
      return;
    }
    cT(`B²−4AC = ${fmt(Tq, 2)} → ${Tq < -1e-6 ? '椭圆型' : Tq > 1e-6 ? '双曲型' : '抛物型'}`, '');
    // 特征值与转轴角（对三种类型都先算好）
    const R = Math.hypot(A - Cc, Bc);
    const l1 = (A + Cc + R) / 2, l2 = (A + Cc - R) / 2;
    const th = Math.abs(Bc) < 1e-9 ? 0 : Math.atan2(Bc, A - Cc) / 2;   // B=0 时无交叉项，不必转轴
    const dir1 = V(Math.cos(th), Math.sin(th)), dir2 = V(-Math.sin(th), Math.cos(th));
    const det = 4 * A * Cc - Bc * Bc;
    if (Math.abs(det) > 1e-6) {   // ② 有心：移轴
      const u0 = (-2 * Cc * D + Bc * E) / det, v0 = (-2 * A * E + Bc * D) / det;
      const K = -f(u0, v0), cen = V(u0, v0), cs = toScr(cen);
      B.dot(cs, 5, { fill: '#ffd166', stroke: '#fff', 'stroke-width': 1.5 });
      B.text(V(cs.x, cs.y - 12), '中心', { fill: '#ffd166', 'font-size': 11.5, 'font-weight': 700 });
      cC(`解 2Au+Bv=−D、Bu+2Cv=−E → 中心 (u₀,v₀) = (${fmt(u0, 2)}, ${fmt(v0, 2)})，K = −f(中心) = ${fmt(K, 2)}`, '');
      cE(`λ± = ${fmt(l1, 3)} / ${fmt(l2, 3)}，转轴角 θ = ½atan(B/(A−C)) = ${fmt(th * 180 / Math.PI, 1)}°`, '');
      // 主轴（转轴后的坐标架）
      for (const [dir, col, lab] of [[dir1, '#ffd166', 'λ₁'], [dir2, '#67e8f9', 'λ₂']]) {
        B.inf(cs, add(cs, mul(dir, 4)), { stroke: col, 'stroke-width': 1.1, 'stroke-dasharray': '5 5', opacity: 0.75 });
      }
      const s1 = K / l1, s2 = K / l2;
      if (Math.abs(K) < 1e-4) {
        cS('K=0：过中心的一对相交直线（退化双曲线）', 'warn');
      } else if (s1 * s2 > 1e-9) {          // 椭圆
        const [aU2, bU2, dirm, lm] = Math.abs(s1) >= Math.abs(s2) ? [s1, s2, dir1, l1] : [s2, s1, dir2, l2];
        const aU = Math.sqrt(aU2), bU = Math.sqrt(bU2), ee = Math.sqrt(Math.max(0, 1 - bU2 / aU2));
        const cf = Math.hypot(aU2 - bU2);
        [1, -1].forEach(s2n => {
          const fo = add(cs, mul(dirm, s2n * cf));
          B.dot(fo, 3.5, { fill: '#ff7b8a' });
        });
        cS(`椭圆 a=${fmt(aU, 2)} b=${fmt(bU, 2)} e=${fmt(ee, 3)}（焦点在 |λ| 小的那根金/青轴上）`, 'ok');
      } else if (s1 * s2 < -1e-9) {        // 双曲线
        const [aU2, bU2, dirm, lm, lo] = s1 > 0 ? [s1, -s2, dir1, l1, l2] : [s2, -s1, dir2, l2, l1];
        const aU = Math.sqrt(aU2), bU = Math.sqrt(bU2), ee = Math.sqrt(1 - lm / lo);
        const cf = Math.hypot(aU2 + bU2);
        [1, -1].forEach(s2n => {
          const fo = add(cs, mul(dirm, s2n * cf));
          B.dot(fo, 3.5, { fill: '#ff7b8a' });
        });
        cS(`双曲线 a=${fmt(aU, 2)} b=${fmt(bU, 2)} e=${fmt(ee, 3)}（实轴沿 ${lm === l1 ? 'λ₁' : 'λ₂'} 轴）`, 'ok');
      } else {
        cS('虚椭圆：K 与 λ 异号，实平面无轨迹', 'warn');
      }
    } else {                    // ③ 抛物型：无中心
      const cs = toScr(V(0, 0));
      B.inf(cs, add(cs, mul(dir1, 4)), { stroke: '#ffd166', 'stroke-width': 1.1, 'stroke-dasharray': '5 5', opacity: 0.75 });
      cC('抛物型：4AC−B²=0 → 无中心，移轴失效', 'warn');
      cE(`转轴角 θ = ½atan(B/(A−C)) = ${fmt(th * 180 / Math.PI, 1)}°，λ± = ${fmt(l1, 3)} / ${fmt(l2, 3)}（一个为零）`, '');
      cS(`转轴后剩 ${(A + Cc).toFixed(2)}u'² + 线性项 = 0 → 沿轴配方得抛物线（顶点与焦参数配方见章内推导）`, '');
    }
    B.hint('滑六个系数看曲线形态改变，预设一键回到典型曲线 —— 考古三步：类型 → 中心 → 特征值');
  };

  B.render();
  return B;
}
