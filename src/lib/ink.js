/* 画板批注（手绘墨迹）的存档与几何工具。
   存在 localStorage 'gl-ink'，结构 { 页面路径: { 板号: [ stroke ] } }，
   stroke = { c: 颜色, w: 粗细, p: [x0,y0,x1,y1,…] } —— 坐标是板坐标（跟着缩放/平移走），落盘前量化到 0.1。
   一条手写线动辄上千点，原样 JSON 很快就能把 5 MB 配额撑满：落盘前先 Douglas–Peucker 抽稀（eps≈0.6 板单位），
   点数通常压掉八成以上，粗细与拐点不受影响。 */

const KEY = 'gl-ink';
const EPS = 0.6;   // 抽稀容差（板单位）
const Q = 10;      // 坐标量化步长：0.1
const CAP = 3.2e6; // 单次写入的字数上限（localStorage 一般 5 MB，留出别的键的空间）

function readAll() {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '{}'); return v && typeof v === 'object' ? v : {}; } catch (_) { return {}; }
}
function writeAll(all) {
  try { localStorage.setItem(KEY, JSON.stringify(all)); return true; } catch (_) { return false; }
}

/* 点到线段 ab 的距离平方（抽稀与橡皮命中都用它） */
function d2(p, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, L = dx * dx + dy * dy;
  let t = L ? ((p.x - a.x) * dx + (p.y - a.y) * dy) / L : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  const ex = a.x + t * dx - p.x, ey = a.y + t * dy - p.y;
  return ex * ex + ey * ey;
}

/** Douglas–Peucker 抽稀。写成迭代版：几千点的折线递归会爆栈。 */
export function simplify(pts, eps = EPS) {
  const n = pts.length;
  if (n <= 2) return pts.slice();
  const keep = new Uint8Array(n);
  keep[0] = keep[n - 1] = 1;
  const stack = [[0, n - 1]], e2 = eps * eps;
  while (stack.length) {
    const [a, b] = stack.pop();
    if (b - a < 2) continue;
    let md = -1, mi = -1;
    for (let i = a + 1; i < b; i++) {
      const d = d2(pts[i], pts[a], pts[b]);
      if (d > md) { md = d; mi = i; }
    }
    if (md > e2) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
  }
  const out = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(pts[i]);
  return out;
}

const q = v => Math.round(v * Q) / Q;

/** 一条墨迹的紧凑形式：抽稀 + 量化 + 去重。k 笔种 / d 线型 / s 吸附形状 / ct 中心点；
 *  t 元素种类（path 之外：img 图片 / txt 文字 / svg 从画板搬来的矢量块 / poly 多边形 / vec 向量）、
 *  f 填充色 / cl 闭合 / tx 文字内容 / fs 字号 / im 图片 dataURL / mk 矢量块的标记 / ob 矢量块原包围盒 */
export function packStroke(s) {
  // 图片、文字、矢量块、多边形、向量都不能抽稀：两点就是包围盒的两个角，多边形少一个顶点就不是那个形
  const keepAll = !!(s.cl || (s.t && s.t !== 'path'));
  const src = s.pts || s.p || [];
  const pts = keepAll ? src : simplify(src, EPS);
  const p = [];
  let lx = null, ly = null;
  for (const pt of pts) {
    const x = q(pt.x), y = q(pt.y);
    if (x === lx && y === ly) continue;
    p.push(x, y); lx = x; ly = y;
  }
  const o = { c: s.c, w: +s.w || 3, p };
  if (s.kind && s.kind !== 'pen') o.k = s.kind;
  if (s.dash && s.dash !== 'solid') o.d = s.dash;
  if (s.snap) o.s = s.snap;
  if (s.ctr) o.ct = [q(s.ctr.x), q(s.ctr.y)];
  if (s.t && s.t !== 'path') o.t = s.t;
  if (s.fill) o.f = s.fill;
  if (s.cl) o.cl = 1;
  if (s.tx != null) o.tx = s.tx;
  if (s.fs) o.fs = s.fs;
  if (s.src) o.im = s.src;
  if (s.mk) o.mk = s.mk;
  if (s.ob) o.ob = [q(s.ob.x), q(s.ob.y), q(s.ob.w), q(s.ob.h)];
  if (s.fx) o.fx = 1;      // 图片 / 矢量块左右翻转
  if (s.fy) o.fy = 1;      // 上下翻转
  if (s.rot) o.rot = q(s.rot);  // 旋转角度（直角钮给 90 的倍数，自由旋转是任意度）
  if (s.cw) o.cw = q(s.cw);     // 图片 / 矢量块没转之前的内容尺寸：转过以后 pts 只是紧包围盒，靠它才画得正
  if (s.ch) o.ch = q(s.ch);
  if (s.ang) o.an = 1;     // 直边图形：折线画法（不磨圆尖角）
  return o;
}

export function unpackStroke(o) {
  const p = (o && o.p) || [], pts = [];
  for (let i = 0; i + 1 < p.length; i += 2) pts.push({ x: p[i], y: p[i + 1] });
  const s = { c: o.c || '#ff5a6e', w: +o.w || 3, pts, kind: o.k || 'pen', dash: o.d || 'solid' };
  if (o.s) s.snap = o.s;
  if (o.ct && o.ct.length === 2) s.ctr = { x: o.ct[0], y: o.ct[1] };
  if (o.t) s.t = o.t;
  if (o.f) s.fill = o.f;
  if (o.cl) s.cl = 1;
  if (o.tx != null) s.tx = o.tx;
  if (o.fs) s.fs = o.fs;
  if (o.im) s.src = o.im;
  if (o.mk) s.mk = o.mk;
  if (o.ob && o.ob.length === 4) s.ob = { x: o.ob[0], y: o.ob[1], w: o.ob[2], h: o.ob[3] };
  if (o.fx) s.fx = 1;
  if (o.fy) s.fy = 1;
  if (o.rot) s.rot = +o.rot || 0;
  if (o.cw) s.cw = +o.cw || 0;
  if (o.ch) s.ch = +o.ch || 0;
  if (o.an) s.ang = 1;
  // 老存档里的矩形 / 三角形 / 五角星 / 多边形没记 ang：闭合且顶点很少的按直边画，别再把尖角磨圆
  else if (s.cl && pts.length <= 11) s.ang = 1;
  return s;
}

/** 读一块板的墨迹（数组，元素是 { c, w, pts }） */
export function loadInk(page, qid) {
  const arr = ((readAll()[page] || {})[qid]) || [];
  return Array.isArray(arr) ? arr.map(unpackStroke) : [];
}

/** 写一块板的墨迹：空数组就删掉这一项（不留空壳）。返回是否写成功。 */
export function saveInk(page, qid, strokes) {
  const all = readAll();
  const pageObj = all[page] || {};
  if (!strokes || !strokes.length) delete pageObj[qid];
  else pageObj[qid] = strokes.map(packStroke);
  if (Object.keys(pageObj).length) all[page] = pageObj; else delete all[page];
  let text = '';
  try { text = JSON.stringify(all); } catch (_) { return false; }
  if (text.length > CAP) return false; // 撑不下去就整笔不落盘，屏幕上的墨迹照旧留着
  return writeAll(all);
}

/** 清掉一块板（或整页）的墨迹存档 */
export function clearInk(page, qid) {
  const all = readAll();
  if (!all[page]) return true;
  if (qid) delete all[page][qid]; else delete all[page];
  if (!Object.keys(all[page]).length) delete all[page];
  return writeAll(all);
}

/** 橡皮命中：点到折线的最近距离是否落在 lim 之内 */
export function nearPolyline(p, pts, lim) {
  const n = pts.length;
  if (!n) return false;
  const l2 = lim * lim;
  if (n === 1) { const dx = p.x - pts[0].x, dy = p.y - pts[0].y; return dx * dx + dy * dy <= l2; }
  for (let i = 1; i < n; i++) if (d2(p, pts[i - 1], pts[i]) <= l2) return true;
  return false;
}

/** 点到线段的距离 */
export function segDist(p, a, b) {
  return Math.sqrt(d2(p, a, b));
}

/** 一组点的包围盒 */
export function bboxOf(pts) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of pts) {
    if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x;
    if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y;
  }
  return { x0, y0, x1, y1 };
}

/** 点是否在多边形内（射线法；套索选取用） */
export function pointInPolygon(p, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / ((b.y - a.y) || 1e-9) + a.x) inside = !inside;
  }
  return inside;
}

/** 椭圆上取一圈点；th 是主轴与 x 轴的夹角 */
function sampleEllipse(cx, cy, ra, rb, th, m = 72) {
  const ca = Math.cos(th), sa = Math.sin(th), out = [];
  for (let i = 0; i <= m; i++) {
    const t = (i / m) * Math.PI * 2, u = ra * Math.cos(t), v = rb * Math.sin(t);
    out.push({ x: cx + u * ca - v * sa, y: cy + u * sa + v * ca });
  }
  return out;
}

/* ---------- 开口曲线：抛物线 / 双曲线 ----------
   手写抛物线、双曲线多半只画一段开口曲线，闭环那套判据用不上，这里另走两条拟合：
   · 抛物线：在主轴系里按 v = A u² + B u + C 最小二乘；
   · 双曲线：先拟一般二次曲线 a u² + b uv + c v² + d u + e v = 1，判别式够大才当双曲线，
     再化成标准形 (X/a)² − (Y/b)² = 1 沿一支取样。
   两条都要求残差够小、曲率沿笔迹有明显变化——圆弧曲率几乎不变，不该被拉成抛物线。 */

/** 解 n 元线性方程组（列主元高斯消元）；奇异返回 null */
function gauss(n, A, b) {
  for (let i = 0; i < n; i++) {
    let p = i;
    for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[p][i])) p = r;
    if (!(Math.abs(A[p][i]) > 1e-12)) return null;
    if (p !== i) { const t = A[p]; A[p] = A[i]; A[i] = t; const s = b[p]; b[p] = b[i]; b[i] = s; }
    const piv = A[i][i];
    for (let r = i + 1; r < n; r++) {
      const f = A[r][i] / piv;
      if (!f) continue;
      for (let c = i; c < n; c++) A[r][c] -= f * A[i][c];
      b[r] -= f * b[i];
    }
  }
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    let s = b[i];
    for (let c = i + 1; c < n; c++) s -= A[i][c] * x[c];
    x[i] = s / A[i][i];
  }
  return x;
}

function fitParabola(pts, bb, D) {
  const n = pts.length;
  let cx = 0, cy = 0;
  for (const p of pts) { cx += p.x; cy += p.y; }
  cx /= n; cy /= n;
  let sxx = 0, syy = 0, sxy = 0;
  for (const p of pts) { const dx = p.x - cx, dy = p.y - cy; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; }
  const th0 = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  let best = null;
  // 两个候选主轴各试一次：只有「开口方向当自变量」时抛物线才写得成单值函数
  for (const th of [th0, th0 + Math.PI / 2]) {
    const ca = Math.cos(th), sa = Math.sin(th);
    let u0 = Infinity, u1 = -Infinity;
    const uv = [];
    for (const p of pts) {
      const dx = p.x - cx, dy = p.y - cy;
      const u = dx * ca + dy * sa, v = -dx * sa + dy * ca;
      uv.push({ u, v });
      if (u < u0) u0 = u; if (u > u1) u1 = u;
    }
    const span = u1 - u0;
    if (span < 36) continue;
    const um = (u0 + u1) / 2;   // 自变量居中：法方程的 u² 列不至于把条件数拉爆
    const M = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], rhs = [0, 0, 0];
    for (const q of uv) {
      const w = q.u - um;
      const row = [w * w, w, 1];
      for (let i = 0; i < 3; i++) { rhs[i] += row[i] * q.v; for (let j = 0; j < 3; j++) M[i][j] += row[i] * row[j]; }
    }
    const co = gauss(3, M, rhs);
    if (!co) continue;
    const A = co[0], B = co[1], C = co[2];
    let rms = 0;
    for (const q of uv) { const w = q.u - um; const e = q.v - (A * w * w + B * w + C); rms += e * e; }
    rms = Math.sqrt(rms / n);
    const bulge = Math.abs(A) * span * span / 8;
    if (bulge <= 0.09 * D || rms > 0.04 * D) continue;
    if (!best || rms < best.rms) best = { A, B, C, u0, u1, um, span, rms, ca, sa };
  }
  if (!best) return null;
  const A = best.A, B = best.B, C = best.C, u0 = best.u0, u1 = best.u1, um = best.um, span = best.span;
  const ca = best.ca, sa = best.sa;
  // 曲率变化：k(u) ∝ |v''| / (1 + v'²)^1.5
  const kAt = w => { const m = 2 * A * w + B; return Math.abs(2 * A) / Math.pow(1 + m * m, 1.5); };
  const w0 = u0 - um, w1 = u1 - um;
  const wv = Math.max(w0, Math.min(w1, -B / (2 * A)));
  const ks = [kAt(w0), kAt(w1), kAt(wv), kAt((w0 + w1) / 2)];
  const kmax = Math.max.apply(null, ks), kmin = Math.min.apply(null, ks);
  if (!(kmin > 0) || kmax / kmin < 1.5) return null;
  const m = 64, out = [];
  for (let i = 0; i <= m; i++) {
    const w = w0 + (w1 - w0) * i / m, u = um + w, v = A * w * w + B * w + C;
    out.push({ x: cx + u * ca - v * sa, y: cy + u * sa + v * ca });
  }
  const res = { shape: 'parabola', pts: out };
  const wv0 = -B / (2 * A);
  const vu = um + wv0, vv = A * wv0 * wv0 + B * wv0 + C;
  const vx = cx + vu * ca - vv * sa, vy = cy + vu * sa + vv * ca;
  const W = bb.x1 - bb.x0, H = bb.y1 - bb.y0;
  if (vx > bb.x0 - W * 0.3 && vx < bb.x1 + W * 0.3 && vy > bb.y0 - H * 0.3 && vy < bb.y1 + H * 0.3) {
    res.ctr = { x: vx, y: vy };   // 顶点落在笔迹附近才标出来
  }
  return res;
}

function fitHyperbola(pts, bb, D) {
  const n = pts.length;
  const cx = (bb.x0 + bb.x1) / 2, cy = (bb.y0 + bb.y1) / 2, R = Math.max(D / 2, 1e-6);
  const M = [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
  const rhs = [0, 0, 0, 0, 0];
  for (const p of pts) {
    const x = (p.x - cx) / R, y = (p.y - cy) / R;
    const row = [x * x, x * y, y * y, x, y];
    for (let i = 0; i < 5; i++) { rhs[i] += row[i]; for (let j = 0; j < 5; j++) M[i][j] += row[i] * row[j]; }
  }
  const co = gauss(5, M, rhs);
  if (!co) return null;
  const a = co[0], b = co[1], c = co[2], d = co[3], e = co[4];
  const sc = Math.abs(a) + Math.abs(b) + Math.abs(c) + 1e-9;
  if (!(b * b - 4 * a * c > 0.05 * sc * sc)) return null;   // 不是双曲（椭圆/抛物线走别的分支）
  const det = 4 * a * c - b * b;
  if (!(Math.abs(det) > 1e-9)) return null;
  const u0 = (-2 * c * d + b * e) / det, v0 = (b * d - 2 * a * e) / det;
  const F = a * u0 * u0 + b * u0 * v0 + c * v0 * v0 + d * u0 + e * v0 - 1;
  const K = -F;
  if (!(Math.abs(K) > 1e-9)) return null;
  const mean = (a + c) / 2, dif = (a - c) / 2, rr = Math.hypot(dif, b / 2);
  const l1 = mean + rr, l2 = mean - rr;
  if (!(l1 * l2 < 0)) return null;
  let th = 0.5 * Math.atan2(b, a - c);   // λ1 的主轴方向
  let ca = Math.cos(th), sa = Math.sin(th);
  const g1 = l1 / K, g2 = l2 / K;
  let aX, bY;
  if (g1 > 0) { aX = Math.sqrt(1 / g1); bY = Math.sqrt(-1 / g2); }
  else {                                  // 主次对调：x' 换成 λ2 那个特征方向
    th += Math.PI / 2; ca = Math.cos(th); sa = Math.sin(th);
    aX = Math.sqrt(1 / g2); bY = Math.sqrt(-1 / g1);
  }
  if (!isFinite(aX) || !isFinite(bY) || !(aX > 1e-4) || !(bY > 1e-4)) return null;
  let sumX = 0, tMin = Infinity, tMax = -Infinity;
  for (const p of pts) {
    const x = (p.x - cx) / R - u0, y = (p.y - cy) / R - v0;
    const X = x * ca + y * sa, Y = -x * sa + y * ca;
    sumX += X;
    const t = Math.asinh(Y / bY);
    if (t < tMin) tMin = t;
    if (t > tMax) tMax = t;
  }
  if (!(tMax - tMin > 0.7)) return null;   // 太短：判不出是不是双曲
  tMin = Math.max(-3, tMin); tMax = Math.min(3, tMax);
  const branch = sumX >= 0 ? 1 : -1;
  const m = 56, out = [];
  for (let i = 0; i <= m; i++) {
    const t = tMin + (tMax - tMin) * i / m;
    const X = branch * aX * Math.cosh(t), Y = bY * Math.sinh(t);
    out.push({ x: cx + (u0 + X * ca - Y * sa) * R, y: cy + (v0 + X * sa + Y * ca) * R });
  }
  // 笔迹到这支曲线的贴合度
  let rms = 0;
  for (const p of pts) {
    let dist = Infinity;
    for (let i = 1; i < out.length; i++) { const dd = segDist(p, out[i - 1], out[i]); if (dd < dist) dist = dd; }
    rms += dist * dist;
  }
  rms = Math.sqrt(rms / n);
  if (rms > 0.045 * D) return null;
  return { shape: 'hyperbola', pts: out, ctr: { x: cx + (u0 + branch * aX * ca) * R, y: cy + (v0 + branch * aX * sa) * R } };
}

/**
 * 轨迹识别：足够规整就吸附成直线 / 圆 / 椭圆 / 抛物线 / 双曲线，认不出返回 null（宁可不认，也不把手写的字强行拉成圆）。
 * 判据：直线看「离首尾弦的最大偏离」；圆与椭圆看闭环（首尾相接 + 绕中心转够一圈）与归一化半径的 RMS 误差；
 * 没闭合的开口曲线再试抛物线、双曲线（见上面的拟合）。
 * 返回 { shape, pts, ctr? }：pts 是吸附后的规整折线，圆/椭圆给中心，抛物线给顶点，双曲线给顶点。
 */
export function recognizeShape(pts) {
  const n = pts.length;
  if (n < 8) return null;
  const a = pts[0], b = pts[n - 1];
  let len = 0;
  for (let i = 1; i < n; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  const bb = bboxOf(pts), W = bb.x1 - bb.x0, H = bb.y1 - bb.y0, D = Math.hypot(W, H);
  if (D < 36) return null;                       // 太小：多半是点或小勾，不认
  /* 直线 */
  const chord = Math.hypot(b.x - a.x, b.y - a.y);
  if (chord > 36 && len < chord * 1.3) {
    let dev = 0;
    for (const p of pts) dev = Math.max(dev, segDist(p, a, b));
    if (dev < Math.max(3.5, chord * 0.045)) return { shape: 'line', pts: [a, b] };
  }
  /* 没闭合：先试开口曲线（抛物线 / 双曲线），认不出原样留着；闭合的才往下判圆/椭圆 */
  if (Math.hypot(b.x - a.x, b.y - a.y) > Math.max(20, D * 0.28)) {
    if (n >= 14 && len > 130 && D > 80) {   // 门槛比直线/圆高一些：小字、小勾不往曲线上拉
      const st = Math.max(1, Math.ceil(n / 240));          // 拟合前抽稀：手写一笔常有上千个点
      const sp = st > 1 ? pts.filter((_, i) => i % st === 0) : pts;
      if (sp[sp.length - 1] !== pts[n - 1]) sp.push(pts[n - 1]);
      const hy = fitHyperbola(sp, bb, D);
      if (hy) return hy;
      const pa = fitParabola(sp, bb, D);
      if (pa) return pa;
    }
    return null;
  }
  let cx = 0, cy = 0;
  for (const p of pts) { cx += p.x; cy += p.y; }
  cx /= n; cy /= n;
  let turn = 0;
  for (let i = 1; i < n; i++) {
    const a1 = Math.atan2(pts[i - 1].y - cy, pts[i - 1].x - cx);
    const a2 = Math.atan2(pts[i].y - cy, pts[i].x - cx);
    let d = a2 - a1;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    turn += d;
  }
  if (Math.abs(turn) < Math.PI * 1.4) return null;   // 没转够一圈：是弧不是整圆
  /* PCA 定主轴与半轴 */
  let sxx = 0, syy = 0, sxy = 0;
  for (const p of pts) { const dx = p.x - cx, dy = p.y - cy; sxx += dx * dx; syy += dy * dy; sxy += dx * dy; }
  sxx /= n; syy /= n; sxy /= n;
  const th = 0.5 * Math.atan2(2 * sxy, sxx - syy);
  const ca = Math.cos(th), sa = Math.sin(th);
  let uMin = Infinity, uMax = -Infinity, vMin = Infinity, vMax = -Infinity;
  for (const p of pts) {
    const dx = p.x - cx, dy = p.y - cy;
    const u = dx * ca + dy * sa, v = -dx * sa + dy * ca;
    if (u < uMin) uMin = u; if (u > uMax) uMax = u;
    if (v < vMin) vMin = v; if (v > vMax) vMax = v;
  }
  const ra = (uMax - uMin) / 2, rb = (vMax - vMin) / 2, uc = (uMax + uMin) / 2, vc = (vMax + vMin) / 2;
  if (ra < 12 || rb < 12) return null;
  let rms = 0;
  for (const p of pts) {
    const dx = p.x - cx, dy = p.y - cy;
    const u = (dx * ca + dy * sa - uc) / ra, v = (-dx * sa + dy * ca - vc) / rb;
    const r = Math.hypot(u, v);
    rms += (r - 1) * (r - 1);
  }
  rms = Math.sqrt(rms / n);
  if (rms > 0.1) return null;
  const ex = cx + uc * ca - vc * sa, ey = cy + uc * sa + vc * ca;   // 中心换回板坐标
  if (Math.abs(ra - rb) / Math.max(ra, rb) < 0.14) {                 // 长短轴相近：按正圆收
    const r = (ra + rb) / 2;
    return { shape: 'circle', pts: sampleEllipse(ex, ey, r, r, th), ctr: { x: ex, y: ey } };
  }
  return { shape: 'ellipse', pts: sampleEllipse(ex, ey, ra, rb, th), ctr: { x: ex, y: ey } };
}
