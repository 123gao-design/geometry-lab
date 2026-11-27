/* 图 线3 · 曲线可行域机：边界是二次曲线时，线性目标的最优点在哪里
   可行域三种（都是闭且有界的区域）：
     圆域   x² + y² ≤ 4
     椭圆域 x²/4 + y² ≤ 1
     抛物带 x² ≤ y ≤ 4（下边界是抛物线，上边界是水平线）
   目标函数 z = a x + b y 的等值线是一族平行直线，法向 (a,b)。可行域边界是光滑曲线时，
   最优等值线与边界相切于切点，切点处的法向就是 (a,b)；抛物带的角点也可能成为最优点。
   圆：切点 = r(a,b)/|(a,b)|；椭圆：切点 = (p²a, q²b)/|(p a, q b)|；
   抛物带：候选点 = 两个角点 (±2,4) 与下边界 y=x² 的顶点 x = −a/(2b)。
   约束统一写成 A x + B y + C ≥ 0 的形式。 */
import { InequalityBoard, visibleLine } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 540, H = 460;
  const B = new InequalityBoard(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, a: 1, b: 1, z: 0, grid: true, labs: true };
  const CR = 2, EA = 2, EB = 1;
  let m = B.isoFit(-2.9, 2.9, -2.9, 2.9, [75, 45, 390, 390], 0);
  const cZ = B.readout('等值线'), cM = B.readout('最大值', 'gold'), cN = B.readout('最小值', 'mint'), cJ = B.chipM('判读');
  const REGN = ['圆域', '椭圆域', '抛物带'];
  const REGL = ['$x^2+y^2\\le4$', '$\\frac{x^2}{4}+y^2\\le1$', '$x^2\\le y\\le4$'];

  const fit = mode => mode === 0
    ? B.isoFit(-2.9, 2.9, -2.9, 2.9, [75, 45, 390, 390], 0)
    : mode === 1
      ? B.isoFit(-2.9, 2.9, -1.8, 1.8, [75, 115, 390, 242], 0)
      : B.isoFit(-2.9, 2.9, -0.8, 4.6, [75, 55, 390, 363], 0);

  // 可行域的边界采样点（多边形填充用）
  const regionPts = () => {
    const pts = [];
    if (st.mode === 2) {
      for (let i = 0; i <= 120; i++) { const x = -2 + 4 * i / 120; pts.push(V(x, x * x)); }
      pts.push(V(2, 4), V(-2, 4));
      return pts;
    }
    const ra = st.mode === 0 ? CR : EA, rb = st.mode === 0 ? CR : EB;
    for (let i = 0; i < 160; i++) {
      const t = i / 160 * Math.PI * 2;
      pts.push(V(ra * Math.cos(t), rb * Math.sin(t)));
    }
    return pts;
  };

  // 最优值与最优点：圆、椭圆有解析式；抛物带取候选点比较
  const opt = () => {
    const a = st.a, b = st.b;
    if (Math.abs(a) + Math.abs(b) < 1e-9) return null;
    if (st.mode === 0) {
      const rho = Math.hypot(a, b);
      return { zMax: CR * rho, zMin: -CR * rho,
        pMax: V(CR * a / rho, CR * b / rho), pMin: V(-CR * a / rho, -CR * b / rho),
        curvedMax: true, curvedMin: true, tieMax: false, tieMin: false };
    }
    if (st.mode === 1) {
      const rho = Math.hypot(EA * a, EB * b);
      return { zMax: rho, zMin: -rho,
        pMax: V(EA * EA * a / rho, EB * EB * b / rho), pMin: V(-EA * EA * a / rho, -EB * EB * b / rho),
        curvedMax: true, curvedMin: true, tieMax: false, tieMin: false };
    }
    const cand = [V(-2, 4), V(2, 4)];
    if (Math.abs(b) > 1e-9) {
      const x = -a / (2 * b);
      if (x > -2 + 1e-9 && x < 2 - 1e-9) cand.push(V(x, x * x));
    }
    const vals = cand.map(p => a * p.x + b * p.y);
    const zMax = Math.max(...vals), zMin = Math.min(...vals);
    const nMax = vals.filter(v => Math.abs(v - zMax) < 1e-9).length;
    const nMin = vals.filter(v => Math.abs(v - zMin) < 1e-9).length;
    const pMax = cand[vals.indexOf(zMax)], pMin = cand[vals.indexOf(zMin)];
    const onCurve = p => Math.abs(p.x) < 2 - 1e-6 && Math.abs(p.y - p.x * p.x) < 1e-6;
    return { zMax, zMin, pMax, pMin, curvedMax: onCurve(pMax), curvedMin: onCurve(pMin),
      tieMax: nMax >= 2, tieMin: nMin >= 2 };
  };

  const coefStr = v => Math.abs(v) === 1 ? '' : f1(Math.abs(v));
  const zExpr = () => {
    const parts = [];
    if (Math.abs(st.a) > 1e-9) parts.push(`${st.a < 0 ? '-' : ''}${coefStr(st.a)}x`);
    if (Math.abs(st.b) > 1e-9) {
      const t = `${coefStr(st.b)}y`;
      parts.push(parts.length ? `${st.b < 0 ? '-' : '+'}${t}` : `${st.b < 0 ? '-' : ''}${t}`);
    }
    return parts.length ? parts.join(' ') : '0';
  };
  // 直线 A x + B y + C = 0 与当前视野的两交点（像素坐标）

  const judge = o => {
    if (!o) return ['目标函数退化：$a=b=0$ 时不画等值线', 'warn'];
    if (st.mode === 0) return ['等值线与圆周相切：圆心到等值线的距离等于半径 $2$', 'ok'];
    if (st.mode === 1) return ['等值线与椭圆相切：切点处切线与等值线平行', 'ok'];
    if (o.tieMax || o.tieMin) return ['等值线与上边界 $y=4$ 平行：整条边同取最值，最优解不唯一', 'ok'];
    if (o.curvedMax && o.curvedMin) return ['最大值与最小值都在曲边 $y=x^2$ 的切点取得', 'ok'];
    if (o.curvedMax) return ['最大值在曲边 $y=x^2$ 的切点，最小值在端点', 'ok'];
    if (o.curvedMin) return ['最小值在曲边 $y=x^2$ 的切点，最大值在端点', 'ok'];
    return ['两个最优点都落在抛物带的端点', 'ok'];
  };

  B.renderFn = () => {
    m = fit(st.mode);
    B.grid({ ...m, grid: st.grid, labs: st.labs });
    const o = opt();
    const px = regionPts().map(p => V(m.px(p.x), m.py(p.y)));
    mk('polygon', { points: px.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '),
      fill: '#5cadff', 'fill-opacity': .13, stroke: '#5cadff', 'stroke-width': 1.8 }, B.dyn);
    const lv = (z, at) => { const e = visibleLine(m, st.a, st.b, -z); if (e) B.seg(e[0], e[1], at); };
    if (o) {
      lv(o.zMax, { stroke: '#4ade80', 'stroke-width': 2.1 });
      lv(o.zMin, { stroke: '#67e8f9', 'stroke-width': 1.8, 'stroke-dasharray': '6 4' });
      lv(st.z, { stroke: '#ffd166', 'stroke-width': 1.6, 'stroke-dasharray': '7 5' });
      const dotAt = (p, col) => B.mark(V(m.px(p.x), m.py(p.y)), col);
      dotAt(o.pMax, '#4ade80'); dotAt(o.pMin, '#67e8f9');
      if (st.labs) {
        B.tex(V(m.px(o.pMax.x) + 8, m.py(o.pMax.y) - 10), `$(${f1(o.pMax.x)},${f1(o.pMax.y)})$`,
          { size: 11, anchor: 'start', color: '#4ade80' });
        B.tex(V(m.px(o.pMin.x) + 8, m.py(o.pMin.y) + 16), `$(${f1(o.pMin.x)},${f1(o.pMin.y)})$`,
          { size: 11, anchor: 'start', color: '#67e8f9' });
      }
    }
    B.tex(V(W / 2, 24), `$z=${zExpr()}$`, { size: 15, anchor: 'mid' });
    // ---- 徽章 ----
    B.note(REGL[st.mode], '#5cadff');
    cZ(o ? `$z=${f1(st.z)}$` : '$z$ 恒定');
    cM(o ? `$z_{\\max}=${f1(o.zMax)}$，${o.tieMax ? '整条上边' : `$(${f1(o.pMax.x)},${f1(o.pMax.y)})$`} ` : '$0$');
    cN(o ? `$z_{\\min}=${f1(o.zMin)}$，${o.tieMin ? '整条上边' : `$(${f1(o.pMin.x)},${f1(o.pMin.y)})$`} ` : '$0$');
    const [jt, jc] = judge(o);
    cJ(jt, jc);
  };

  // z 滑块的范围随区域与系数变化：越界值夹回
  const applyRange = () => {
    const o = opt();
    if (!o) return;
    const lo = Math.floor(o.zMin) - 1, hi = Math.ceil(o.zMax) + 1;
    sZ.setAttribute('min', lo); sZ.setAttribute('max', hi);
    st.z = Math.max(lo, Math.min(st.z, hi));
    sZ.sync(st.z);
  };

  B.choiceRow('选择模式', REGN.map(name => ({ name })), () => st.mode, i => {
    st.mode = i; applyRange(); B.render();
  });
  B.graphToggles(st, ['grid', 'labs']);

  const sA = B.slider('a =', -3, 3, .5, 1, v => { st.a = v; applyRange(); B.render(); }, undefined, n => `$a=${n}$`);
  const sB = B.slider('b =', -3, 3, .5, 1, v => { st.b = v; applyRange(); B.render(); }, undefined, n => `$b=${n}$`);
  const sZ = B.slider('z =', -4, 4, .1, 0, v => { st.z = v; B.render(); }, undefined, n => `$z=${n}$`);
  applyRange();

  B.render();
  return B;
}
