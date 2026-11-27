/* 图 线2 · 线性规划机：可行域上目标函数的最大值
   可行域由四条约束围成：x≥0、y≥0、x+y≤4、x+2y≤7，顶点 (0,0)、(4,0)、(1,3)、(0,3.5)。
   目标函数 z = a x + b y 的等值线是一族平行直线 a x + b y = z，斜率 −a/b。把等值线沿
   法向 (a,b) 平移：可行域是凸多边形，z 的最大值必在顶点取得（或与某条边平行时整条边取到）。
   整数模式：枚举可行域内的整点并比较目标值 —— 顶点不是整点时，最优整数解可能落在内部。
   局部坐标约定：isoFit 视野 x∈[-0.9,4.9]、y∈[-0.9,4.3]（rect=[0,55,610,380]，pad 20），
   等单位；右侧 630..860 为读数栏。约束统一写成 A x + B y + C ≥ 0。 */
import { InequalityBoard, visibleLine } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 540, H = 460;
  const B = new InequalityBoard(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, a: 1, b: 1, z: 0, grid: true, labs: true };
  const m = B.isoFit(-0.9, 4.9, -0.9, 4.3, [58, 55, 423.85, 380], 0);
  const cVerts = B.readout('顶点目标值');
  const cZ = B.readout('等值线', 'violet'), cM = B.readout('最优值', 'gold'), cP = B.readout('最优位置', 'mint'), cJ = B.chipM('判读');

  const CONS = [
    { A: 1, B: 0, C: 0, col: '#8fa3bd', lab: '$x\\ge0$' },
    { A: 0, B: 1, C: 0, col: '#8fa3bd', lab: '$y\\ge0$' },
    { A: -1, B: -1, C: 4, col: '#ff9e4a', lab: '$x+y\\le4$' },
    { A: -1, B: -2, C: 7, col: '#c084fc', lab: '$x+2y\\le7$' },
  ];
  const ok = p => CONS.every(c => c.A * p.x + c.B * p.y + c.C >= -1e-9);
  const inter = (p, q) => {
    const det = p.A * q.B - q.A * p.B;
    if (Math.abs(det) < 1e-9) return null;
    return V((q.C * p.B - p.C * q.B) / det, (p.C * q.A - q.C * p.A) / det);
  };
  const uniq = pts => pts.filter((p, i) => pts.findIndex(q => Math.hypot(p.x - q.x, p.y - q.y) < 1e-7) === i);
  const sortPts = pts => {
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    return [...pts].sort((p, q) => Math.atan2(p.y - cy, p.x - cx) - Math.atan2(q.y - cy, q.x - cx));
  };
  const raw = [];
  for (let i = 0; i < CONS.length; i++) for (let j = i + 1; j < CONS.length; j++) {
    const p = inter(CONS[i], CONS[j]);
    if (p && ok(p)) raw.push(p);
  }
  const VERTS = sortPts(uniq(raw));
  const VN = ['A', 'B', 'C', 'D', 'E', 'F'];
  const zOf = p => st.a * p.x + st.b * p.y;
  const coef = v => Math.abs(v) < 1e-9 ? null : (Math.abs(v) === 1 ? '' : f1(Math.abs(v)));
  const zExpr = () => {
    const parts = [];
    if (coef(st.a) !== null) parts.push(`${st.a < 0 ? '-' : ''}${coef(st.a)}x`);
    if (coef(st.b) !== null) parts.push(`${st.b < 0 ? (parts.length ? '-' : '-') : (parts.length ? '+' : '')}${coef(st.b)}y`);
    return parts.length ? parts.join(' ') : '0';
  };
  // 直线 a x + b y + C = 0 与视野的两交点
  // 整数网格点
  const IPTS = [];
  for (let ix = 0; ix <= 6; ix++) for (let iy = 0; iy <= 5; iy++) {
    const p = V(ix, iy);
    if (ok(p)) IPTS.push(p);
  }
  const zrange = () => {
    const zs = VERTS.map(zOf);
    return [Math.floor(Math.min(...zs)), Math.ceil(Math.max(...zs))];
  };
  const level = (z, at) => {
    if (Math.abs(st.a) + Math.abs(st.b) < 1e-9) return;
    const e = visibleLine(m, st.a, st.b, -z);
    if (e) B.seg(e[0], e[1], at);
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs });
    // 可行域填充 + 四条约束直线
    mk('polygon', { points: VERTS.map(p => `${m.px(p.x).toFixed(1)},${m.py(p.y).toFixed(1)}`).join(' '), fill: '#5cadff', 'fill-opacity': .13, stroke: 'none' }, B.dyn);
    CONS.forEach(c => { const e = visibleLine(m, c.A, c.B, c.C); if (e) B.seg(e[0], e[1], { stroke: c.col, 'stroke-width': 1.6 }); });
    // 顶点与坐标
    VERTS.forEach((p, i) => {
      B.dot(V(m.px(p.x), m.py(p.y)), 2.5, { fill: '#ffd166', stroke: 'none' });
      if (st.labs) B.tex(V(m.px(p.x) + 8, m.py(p.y) - 10), `$${VN[i]}(${f1(p.x)},${f1(p.y)})$`, { size: 11.5, anchor: 'start', color: '#ffd166' });
    });
    const zs = VERTS.map(zOf), zmax = Math.max(...zs);
    const optV = VERTS.filter(p => Math.abs(zOf(p) - zmax) < 1e-9);
    const degenerate = Math.abs(st.a) + Math.abs(st.b) < 1e-9;
    // 连续最优等值线（绿）与当前等值线（金虚线）
    if (!degenerate && st.mode === 0) level(zmax, { stroke: '#4ade80', 'stroke-width': 2.1 });
    if (!degenerate) level(st.z, { stroke: '#ffd166', 'stroke-width': 1.8, 'stroke-dasharray': '7 5' });
    if (degenerate) {
      B.tex(V(W / 2, 26), '$z=0$', { size: 14, anchor: 'mid' });
    } else {
      B.tex(V(W / 2, 24), `$z=${zExpr()}$`, { size: 14.5, anchor: 'mid' });
    }
    // 最优顶点高亮
    if (!degenerate && st.mode === 0) optV.forEach(p => B.mark(V(m.px(p.x), m.py(p.y)), '#4ade80'));
    // 整数模式：可行整点与最优整点
    let zI = -Infinity, optI = [];
    if (st.mode === 1) {
      zI = Math.max(...IPTS.map(zOf));
      optI = IPTS.filter(p => Math.abs(zOf(p) - zI) < 1e-9);
      IPTS.forEach(p => B.dot(V(m.px(p.x), m.py(p.y)), 3, { fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.2 }));
      if (!degenerate) level(zI, { stroke: '#4ade80', 'stroke-width': 2.1, 'stroke-dasharray': '4 4' });
      optI.forEach(p => B.mark(V(m.px(p.x), m.py(p.y)), '#ffd166'));
      B.tex(V(W / 2, 44), '灰圈 = 可行域内的整点；金点 = 目标值最大的整点', { size: 12, anchor: 'mid', color: '#93a1b5' });
    }
    // ---- 徽章 ----
    cVerts(VERTS.map((p, i) => `$${VN[i]}: ${f1(zOf(p))}$`).join('，'));
    cZ(`$z=${f1(st.z)}$`);
    cM(degenerate ? '任一点目标值相同'
      : st.mode === 0 ? `$z_{\\max}=${f1(zmax)}$` : `整数最优 $z=${f1(zI)}$`);
    cP(degenerate ? '任一点（目标值恒定）'
      : st.mode === 1 ? optI.map(p => `$(${f1(p.x)},${f1(p.y)})$`).join('、')
      : optV.length > 1 ? `整条边 ${optV.map(p => `${VN[VERTS.indexOf(p)]}`).join('—')}`
        : `顶点 $${VN[VERTS.indexOf(optV[0])]}(${f1(optV[0].x)},${f1(optV[0].y)})$`);
    if (degenerate) cJ('目标函数退化：$a=b=0$', 'warn');
    else if (st.mode === 0 && optV.length > 1)
      cJ('等值线与可行域的一边平行：整条边上的点都取到最大值，最优解不唯一', 'ok');
    else if (st.mode === 0)
      cJ('等值线沿 $(a,b)$ 方向平移，最后触到顶点即最大值；再平移就离开可行域');
    else if (optI.length && optI.every(p => VERTS.some(q => Math.hypot(p.x - q.x, p.y - q.y) < 1e-9))) {
      const same = optI.some(p => optV.some(q => Math.hypot(p.x - q.x, p.y - q.y) < 1e-9));
      if (same) cJ(`最优整数解恰为连续最优顶点，$z=${f1(zI)}$`, 'ok');
      else {
        const vi = VERTS.findIndex(q => Math.hypot(optI[0].x - q.x, optI[0].y - q.y) < 1e-9);
        cJ(`连续最优点不是整点；最优整数解落在顶点 $${VN[vi]}(${f1(optI[0].x)},${f1(optI[0].y)})$，$z=${f1(zI)}$`);
      }
    }
    else
      cJ('顶点不是整点时，最优整数解在区域内另行比较得到（几何上未必贴顶点）');
  };

  B.choiceRow('选择模式', ['连续最值', '整数解'].map(name => ({ name })), () => st.mode, i => {
    st.mode = i; B.render();
  });
  const OBJ = [
    { name: '等权', formula: '$z=x+y$', values: { a: 1, b: 1 } },
    { name: '偏重横坐标', formula: '$z=2x+y$', values: { a: 2, b: 1 } },
    { name: '偏重纵坐标', formula: '$z=x+3y$', values: { a: 1, b: 3 } },
    { name: '二比三', formula: '$z=2x+3y$', values: { a: 2, b: 3 } },
  ];
  B.examples('选择例题', OBJ, st, P => {
    st.a = P.a; st.b = P.b;
    const [lo, hi] = zrange();
    st.z = Math.max(lo, Math.min(0, hi));
    sZ.setAttribute('min', lo); sZ.setAttribute('max', hi); sZ.sync(st.z);
    sA.sync(P.a); sB.sync(P.b);
    B.render();
  });
  B.graphToggles(st, ['grid', 'labs']);

  const sA = B.slider('a =', -3, 3, .5, 1, v => {
    st.a = v; const [lo, hi] = zrange(); st.z = Math.max(lo, Math.min(st.z, hi));
    sZ.setAttribute('min', lo); sZ.setAttribute('max', hi); sZ.sync(st.z); B.render();
  }, undefined, n => `$a=${n}$`);
  const sB = B.slider('b =', -3, 3, .5, 1, v => {
    st.b = v; const [lo, hi] = zrange(); st.z = Math.max(lo, Math.min(st.z, hi));
    sZ.setAttribute('min', lo); sZ.setAttribute('max', hi); sZ.sync(st.z); B.render();
  }, undefined, n => `$b=${n}$`);
  const sZ = B.slider('z =', 0, 4, .1, 0, v => { st.z = v; B.render(); }, undefined, n => `$z=${n}$`);

  B.render();
  return B;
}
