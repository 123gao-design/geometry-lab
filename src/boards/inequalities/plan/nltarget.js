/* 图 线4 · 非线性目标函数机：目标不是线性式时，最优点还落在顶点吗
   可行域沿用线2 的四边形：x≥0、y≥0、x+y≤4、x+2y≤7，顶点 A(0,0)、B(4,0)、C(1,3)、D(0,3.5)。
   模式一 斜率型 z=(y−b)/(x−a)：几何意义是过定点 P(a,b) 的直线斜率。可行域是凸多边形且 P 在域外时，
     斜率的最值出现在过 P 的两条「切线」位置，接触点必是可行域的顶点；有竖直方向穿过区域时斜率无界。
   模式二 距离平方型 z=(x−a)²+(y−b)²：几何意义是 P 到点 (x,y) 的距离平方。最大值在离 P 最远的顶点；
     最小值可能落在某条边的内部（垂足），这是与线性目标最关键的区别。
   约束统一写成 A x + B y + C ≥ 0 的形式。 */
import { InequalityBoard, visibleLine } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 540, H = 460;
  const B = new InequalityBoard(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, px: 4.6, py: 1, qx: 2, qy: 2, grid: true, labs: true };
  const m = B.isoFit(-0.9, 4.9, -0.9, 4.3, [58, 55, 423.85, 380], 0);
  const cP = B.readout('定点'), cQ = B.readout('当前点', 'violet'), cM = B.readout('最小值', 'mint'), cN = B.readout('最大值', 'gold'), cJ = B.chipM('判读');

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

  // 过 P 且斜率为 k 的直线；k=null 表示竖直线
  const lineThrough = (P, k, at) => {
    if (k === null || !isFinite(k)) {
      B.seg(V(m.px(P.x), m.py(m.Y0)), V(m.px(P.x), m.py(m.Y1)), at);
      return;
    }
    const e = visibleLine(m, k, -1, P.y - k * P.x);
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

  // 在线段上，分母同号时斜率单调。有限极值只需比较顶点；
  // 竖直截线上的非零分子则由可接近的左右方向决定无穷大的符号。
  const slopeRange = P => {
    let min = Infinity, max = -Infinity, lowPoint, highPoint;
    let left = false, right = false, above = false, below = false;
    const recordY = y => {
      if (y > P.y + 1e-9) above = true;
      if (y < P.y - 1e-9) below = true;
    };
    VERTS.forEach((v, i) => {
      const dx = v.x - P.x;
      if (Math.abs(dx) < 1e-9) { recordY(v.y); return; }
      if (dx < 0) left = true; else right = true;
      const slope = (v.y - P.y) / dx;
      if (slope < min) { min = slope; lowPoint = v; }
      if (slope > max) { max = slope; highPoint = v; }
      const next = VERTS[(i + 1) % VERTS.length];
      if (dx * (next.x - P.x) < 0) recordY(v.y + (next.y - v.y) * (-dx) / (next.x - v.x));
    });
    if ((left && above) || (right && below)) min = -Infinity;
    if ((right && above) || (left && below)) max = Infinity;
    return { min, max, lowPoint, highPoint };
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
    B.grid({ ...m, grid: st.grid, labs: st.labs });
    mk('polygon', { points: VERTS.map(p => `${m.px(p.x).toFixed(1)},${m.py(p.y).toFixed(1)}`).join(' '),
      fill: '#5cadff', 'fill-opacity': .13, stroke: 'none' }, B.dyn);
    CONS.forEach(c => { const e = visibleLine(m, c.A, c.B, c.C); if (e) B.seg(e[0], e[1], { stroke: c.col, 'stroke-width': 1.6 }); });
    VERTS.forEach((p, i) => {
      B.dot(V(m.px(p.x), m.py(p.y)), 2.5, { fill: '#ffd166', stroke: 'none' });
      if (st.labs) B.tex(V(m.px(p.x) + 8, m.py(p.y) - 10), `$${VN[i]}(${f1(p.x)},${f1(p.y)})$`,
        { size: 11.5, anchor: 'start', color: '#ffd166' });
    });
    const P = V(st.px, st.py);
    const qIn = ok(V(st.qx, st.qy));

    if (st.mode === 0) {
      /* ---------- 模式一 斜率型 ---------- */
      const { min, max, lowPoint, highPoint } = slopeRange(P);
      B.tex(V(W / 2, 24), '$z=\\dfrac{y-b}{x-a}$', { size: 15, anchor: 'mid' });
      for (const [slope, point, color] of [[min, lowPoint, '#67e8f9'], [max, highPoint, '#4ade80']]) {
        if (!Number.isFinite(slope)) continue;
        lineThrough(P, slope, { stroke: color, 'stroke-width': 2 });
        B.mark(V(m.px(point.x), m.py(point.y)), color);
      }
      if (!Number.isFinite(min) || !Number.isFinite(max)) lineThrough(P, null, { stroke: '#93a1b5', 'stroke-dasharray': '3 4' });
      const dx = st.qx - P.x, dy = st.qy - P.y;
      if (Math.abs(dx) + Math.abs(dy) > 1e-9) {
        lineThrough(P, Math.abs(dx) < 1e-9 ? null : dy / dx, { stroke: '#ffd166', 'stroke-width': 1.5, 'stroke-dasharray': '7 5' });
      }
      cM(Number.isFinite(min) ? `$z_{\\min}=${f1(min)}$` : '无下界');
      cN(Number.isFinite(max) ? `$z_{\\max}=${f1(max)}$` : '无上界');
      if (Number.isFinite(min) && Number.isFinite(max)) cJ('两条切线经过可行域顶点，给出斜率的两个端值。', 'ok');
      else cJ('看竖直虚线两侧：可行点逼近这条线时，斜率的绝对值可以任意大。', 'warn');
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
      B.mark(V(m.px(d.near.x), m.py(d.near.y)), '#4ade80');
      B.mark(V(m.px(d.far.x), m.py(d.far.y)), '#67e8f9');
    }
    // ---- 徽章 ----
    cP(`$P(${f1(st.px)},${f1(st.py)})$`);
    const dx = st.qx - st.px, dy = st.qy - st.py;
    const reading = st.mode === 1 ? dx * dx + dy * dy : Math.abs(dx) < 1e-9 ? null : dy / dx;
    cQ(`$Q(${f1(st.qx)},${f1(st.qy)})$${qIn ? '' : '（域外）'}，${reading === null ? '斜率无定义' : `$z=${f1(reading)}$`}`);
    if (st.mode === 1) {
      const d = distInfo();
      cM(`$z_{\\min}=${f1(d.zMin)}$，$(${f1(d.near.x)},${f1(d.near.y)})$`);
      cN(`$z_{\\max}=${f1(d.zMax)}$，$(${f1(d.far.x)},${f1(d.far.y)})$`);
      if (d.inside) cJ('$P$ 在可行域内：最小距离为 $0$', 'ok');
      else if (d.onVertex) cJ('最近点与最远点都落在顶点上', 'ok');
      else cJ('最近点落在某条边的内部（垂足），不在顶点上 —— 与线性目标的关键区别', 'ok');
    }
  };

  B.choiceRow('选择模式', ['斜率型', '距离平方型'].map(name => ({ name })), () => st.mode, i => {
    st.mode = i; B.render();
  });
  B.graphToggles(st, ['grid', 'labs']);

  B.render();
  return B;
}
