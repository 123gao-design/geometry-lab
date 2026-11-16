/* 图 线4 · 非线性目标函数机：目标不是线性式时，最优点还落在顶点吗
   可行域沿用线2 的四边形：x≥0、y≥0、x+y≤4、x+2y≤7，顶点 A(0,0)、B(4,0)、C(1,3)、D(0,3.5)。
   模式一 斜率型 z=(y−b)/(x−a)：几何意义是过定点 P(a,b) 的直线斜率。可行域是凸多边形且 P 在域外时，
     斜率的最值出现在过 P 的两条「切线」位置，接触点必是可行域的顶点；有竖直方向穿过区域时斜率无界。
   模式二 距离平方型 z=(x−a)²+(y−b)²：几何意义是 P 到点 (x,y) 的距离平方。最大值在离 P 最远的顶点；
     最小值可能落在某条边的内部（垂足），这是与线性目标最关键的区别。
   局部坐标约定：isoFit 视野 x∈[-0.9,4.9]、y∈[-0.9,4.3]，等单位；右侧 520..850 为读数栏。
   约束统一写成 A x + B y + C ≥ 0 的形式。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, px: 4.6, py: 1, qx: 2, qy: 2, grid: true, labs: true };
  const m = B.isoFit(-0.9, 4.9, -0.9, 4.3, [40, 55, 423.85, 380], 0);
  const cP = B.chipM('定点'), cQ = B.chipM('当前点'), cM = B.chipM('最小值'), cN = B.chipM('最大值'), cJ = B.chipM('判读');

  const CONS = [
    { A: 1, B: 0, C: 0, col: '#8fa3bd' },
    { A: 0, B: 1, C: 0, col: '#8fa3bd' },
    { A: -1, B: -1, C: 4, col: '#ff9e4a' },
    { A: -1, B: -2, C: 7, col: '#c084fc' },
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

  const lineEnds = (A, Bc, C) => {
    if (Math.abs(Bc) > 1e-9) {
      return [V(m.px(m.X0), m.py((-C - A * m.X0) / Bc)), V(m.px(m.X1), m.py((-C - A * m.X1) / Bc))];
    }
    if (Math.abs(A) < 1e-9) return null;
    return [V(m.px(-C / A), m.py(m.Y0)), V(m.px(-C / A), m.py(m.Y1))];
  };
  // 过 P 且斜率为 k 的直线；k=null 表示竖直线
  const lineThrough = (P, k, at) => {
    if (k === null || !isFinite(k)) {
      B.seg(V(m.px(P.x), m.py(m.Y0)), V(m.px(P.x), m.py(m.Y1)), at);
      return;
    }
    const e = lineEnds(k, -1, P.y - k * P.x);
    if (e) B.seg(e[0], e[1], at);
  };

  const toMath = p => V((p.x - m.px(0)) / m.s, (m.py(0) - p.y) / m.s);
  const clampM = q => V(Math.max(m.X0 + .08, Math.min(m.X1 - .08, q.x)),
    Math.max(m.Y0 + .08, Math.min(m.Y1 - .08, q.y)));
  B.handle({
    get: () => V(m.px(st.px), m.py(st.py)),
    set: p => { const q = clampM(toMath(p)); st.px = q.x; st.py = q.y; },
    color: '#ff9e4a', r: 7, label: 'P',
  });
  B.handle({
    get: () => V(m.px(st.qx), m.py(st.qy)),
    set: p => { const q = clampM(toMath(p)); st.qx = q.x; st.qy = q.y; },
    color: '#67e8f9', r: 6.5, label: 'Q',
  });

  const wrap = d => ((d + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
  // 斜率型：可行域在 P 处的视角范围决定斜率的上下界；视角含竖直方向时斜率无界
  const slopeInfo = () => {
    const P = V(st.px, st.py);
    if (ok(P)) return { inside: true, unb: false, zMax: null, zMin: null, iMax: -1, iMin: -1 };
    const ang = q => Math.atan2(q.y - st.py, q.x - st.px);
    const base = ang(VERTS[0]);
    const rel = VERTS.map(q => wrap(ang(q) - base));
    let iMax = 0, iMin = 0;
    rel.forEach((d, i) => { if (d > rel[iMax]) iMax = i; if (d < rel[iMin]) iMin = i; });
    const c1 = Math.cos(base + rel[iMax]), c2 = Math.cos(base + rel[iMin]);
    const slope = q => Math.abs(q.x - st.px) < 1e-9 ? null : (q.y - st.py) / (q.x - st.px);
    return { inside: false, unb: c1 * c2 <= 1e-12,
      zMax: slope(VERTS[iMax]), zMin: slope(VERTS[iMin]), iMax, iMin };
  };
  // 距离平方型：最近点可能在边的内部（垂足），最远点必在顶点
  const distInfo = () => {
    const P = V(st.px, st.py);
    const inside = ok(P);
    let near = P, zMin = 0;
    if (!inside) {
      zMin = Infinity;
      VERTS.forEach((s, i) => {
        const e = VERTS[(i + 1) % VERTS.length];
        const ex = e.x - s.x, ey = e.y - s.y, L2 = ex * ex + ey * ey;
        let t = ((P.x - s.x) * ex + (P.y - s.y) * ey) / L2;
        t = Math.max(0, Math.min(1, t));
        const f = V(s.x + ex * t, s.y + ey * t);
        const d = (P.x - f.x) * (P.x - f.x) + (P.y - f.y) * (P.y - f.y);
        if (d < zMin) { zMin = d; near = f; }
      });
    }
    let far = VERTS[0], zMax = -1;
    VERTS.forEach(q => {
      const d = (P.x - q.x) * (P.x - q.x) + (P.y - q.y) * (P.y - q.y);
      if (d > zMax) { zMax = d; far = q; }
    });
    const onVertex = VERTS.some(q => Math.hypot(near.x - q.x, near.y - q.y) < 1e-6);
    return { inside, near, zMin, far, zMax, onVertex };
  };

  B.renderFn = () => {
    B.grid(m);
    mk('polygon', { points: VERTS.map(p => `${m.px(p.x).toFixed(1)},${m.py(p.y).toFixed(1)}`).join(' '),
      fill: '#5cadff', 'fill-opacity': .13, stroke: 'none' }, B.dyn);
    CONS.forEach(c => { const e = lineEnds(c.A, c.B, c.C); if (e) B.seg(e[0], e[1], { stroke: c.col, 'stroke-width': 1.6 }); });
    VERTS.forEach((p, i) => {
      B.dot(V(m.px(p.x), m.py(p.y)), 4.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1 });
      if (st.labs) B.tex(V(m.px(p.x) + 8, m.py(p.y) - 10), `$${VN[i]}(${f1(p.x)},${f1(p.y)})$`,
        { size: 11.5, anchor: 'start', color: '#ffd166' });
    });
    const P = V(st.px, st.py);
    const qIn = ok(V(st.qx, st.qy));

    if (st.mode === 0) {
      /* ---------- 模式一 斜率型 ---------- */
      const s = slopeInfo();
      B.tex(V(250, 24), '$z=\\dfrac{y-b}{x-a}$　过定点 $P$ 的直线斜率', { size: 14.5, anchor: 'mid' });
      if (!s.inside) {
        lineThrough(P, s.zMax, { stroke: '#4ade80', 'stroke-width': 2 });
        lineThrough(P, s.zMin, { stroke: '#67e8f9', 'stroke-width': 1.9, 'stroke-dasharray': '6 4' });
        const cur = Math.abs(st.qx - st.px) < 1e-9 ? null : (st.qy - st.py) / (st.qx - st.px);
        lineThrough(P, cur, { stroke: '#ffd166', 'stroke-width': 1.5, 'stroke-dasharray': '7 5' });
        [[s.iMax, '#4ade80'], [s.iMin, '#67e8f9']].forEach(([i, col]) => {
          if (i >= 0) B.dot(V(m.px(VERTS[i].x), m.py(VERTS[i].y)), 6, { fill: 'none', stroke: col, 'stroke-width': 2 });
        });
      } else {
        B.tex(V(250, 46), '$P$ 在可行域内：任意斜率的直线都与区域相交', { size: 12, anchor: 'mid', color: '#ff7b8a' });
      }
      // ---- 右侧读数栏 ----
      B.tex(V(520, 34), '$z=\\dfrac{y-b}{x-a}$', { size: 16, anchor: 'start', w: 300 });
      B.tex(V(520, 64), `定点 $P(${f1(st.px)},${f1(st.py)})$　可行域顶点见左图`, { size: 12.5, anchor: 'start', color: '#93a1b5', w: 300 });
      if (!s.inside) {
        B.tex(V(520, 100), s.unb || s.zMax === null ? '$z_{\\max}$ 无上界' : `$z_{\\max}=${f1(s.zMax)}$`,
          { size: 14, anchor: 'start', color: '#4ade80', w: 300 });
        B.tex(V(520, 124), s.unb || s.zMin === null ? '$z_{\\min}$ 无下界' : `$z_{\\min}=${f1(s.zMin)}$`,
          { size: 14, anchor: 'start', color: '#67e8f9', w: 300 });
        B.tex(V(520, 158), `当前 $z=\\dfrac{${f1(st.qy)}-${f1(st.py)}}{${f1(st.qx)}-${f1(st.px)}}$`, { size: 12.5, anchor: 'start', color: '#ffd166', w: 300 });
      }
    } else {
      /* ---------- 模式二 距离平方型 ---------- */
      const d = distInfo();
      B.tex(V(250, 24), '$z=(x-a)^2+(y-b)^2$　到定点 $P$ 的距离平方', { size: 14.5, anchor: 'mid' });
      const circ = (r, at) => {
        if (r > 1e-6) mk('circle', { cx: m.px(st.px), cy: m.py(st.py), r: r * m.s, fill: 'none', ...at }, B.dyn);
      };
      circ(Math.sqrt(d.zMin), { stroke: '#4ade80', 'stroke-width': 1.8, 'stroke-dasharray': '6 4' });
      circ(Math.sqrt(d.zMax), { stroke: '#67e8f9', 'stroke-width': 1.8, 'stroke-dasharray': '6 4' });
      B.seg(V(m.px(st.px), m.py(st.py)), V(m.px(d.near.x), m.py(d.near.y)), { stroke: '#4ade80', 'stroke-width': 2 });
      B.seg(V(m.px(st.px), m.py(st.py)), V(m.px(d.far.x), m.py(d.far.y)), { stroke: '#67e8f9', 'stroke-width': 2 });
      B.dot(V(m.px(d.near.x), m.py(d.near.y)), 5.5, { fill: '#4ade80', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.dot(V(m.px(d.far.x), m.py(d.far.y)), 5.5, { fill: '#67e8f9', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.tex(V(520, 34), '$z=(x-a)^2+(y-b)^2$', { size: 15, anchor: 'start', w: 300 });
      B.tex(V(520, 64), `定点 $P(${f1(st.px)},${f1(st.py)})$　可见圆扫过区域`, { size: 12.5, anchor: 'start', color: '#93a1b5', w: 300 });
      B.tex(V(520, 100), `$z_{\\min}=${f1(d.zMin)}$`, { size: 14, anchor: 'start', color: '#4ade80', w: 300 });
      B.tex(V(520, 124), `最近点 $(${f1(d.near.x)},${f1(d.near.y)})$`, { size: 12.5, anchor: 'start', color: '#93a1b5', w: 300 });
      B.tex(V(520, 160), `$z_{\\max}=${f1(d.zMax)}$`, { size: 14, anchor: 'start', color: '#67e8f9', w: 300 });
      B.tex(V(520, 184), `最远点 $${VN[VERTS.indexOf(d.far)]}(${f1(d.far.x)},${f1(d.far.y)})$`, { size: 12.5, anchor: 'start', color: '#93a1b5', w: 300 });
    }
    // ---- 徽章 ----
    cP(`$P(${f1(st.px)},${f1(st.py)})$`);
    cQ(`$Q(${f1(st.qx)},${f1(st.qy)})$${qIn ? '' : '（域外）'}`);
    if (st.mode === 0) {
      const s = slopeInfo();
      if (s.inside) { cM('无下界'); cN('无上界'); }
      else if (s.unb) { cM('$\\to-\\infty$'); cN('$\\to+\\infty$'); }
      else {
        cM(s.zMin === null ? '无下界' : `$z_{\\min}=${f1(s.zMin)}$`);
        cN(s.zMax === null ? '无上界' : `$z_{\\max}=${f1(s.zMax)}$`);
      }
      if (s.inside) cJ('$P$ 在可行域内：任意斜率都能取到，目标没有最值', 'warn');
      else if (s.unb) cJ('过 $P$ 的直线可取到竖直方向：斜率趋于 $\\pm\\infty$', 'warn');
      else cJ('斜率的最值出现在过 $P$ 的切线位置，接触点必是可行域的顶点', 'ok');
    } else {
      const d = distInfo();
      cM(`$z_{\\min}=${f1(d.zMin)}$`);
      cN(`$z_{\\max}=${f1(d.zMax)}$`);
      if (d.inside) cJ('$P$ 在可行域内：最小距离为 $0$', 'ok');
      else if (d.onVertex) cJ('最近点与最远点都落在顶点上', 'ok');
      else cJ('最近点落在某条边的内部（垂足），不在顶点上 —— 与线性目标的关键区别', 'ok');
    }
  };

  const modeBtns = ['斜率型', '距离平方型'].map((n, i) => B.btnM(n, () => {
    st.mode = i; modeBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖 P、Q：斜率型看过 P 的切线斜率范围；距离型看圆扫过区域的最近与最远点');
  B.render();
  return B;
}
