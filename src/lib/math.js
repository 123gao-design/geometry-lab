/* ================= 矢量 / 射影几何数学工具 ================= */

export const V = (x, y) => ({ x, y });
export const add = (a, b) => V(a.x + b.x, a.y + b.y);
export const sub = (a, b) => V(a.x - b.x, a.y - b.y);
export const mul = (a, k) => V(a.x * k, a.y * k);
export const dot = (a, b) => a.x * b.x + a.y * b.y;
export const cross = (a, b) => a.x * b.y - b.x * a.y;
export const len = a => Math.hypot(a.x, a.y);
export const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
export const norm = a => { const l = len(a) || 1; return V(a.x / l, a.y / l); };
export const lerp = (a, b, t) => V(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
export const TAU = Math.PI * 2;

/** 两直线交点（各由两点确定），平行返回 null（交点在无穷远） */
export function interLL(p1, p2, q1, q2) {
  const d1 = sub(p2, p1), d2 = sub(q2, q1), den = cross(d1, d2);
  if (Math.abs(den) < 1e-9) return null;
  const t = cross(sub(q1, p1), d2) / den;
  return add(p1, mul(d1, t));
}

/** 共线四点交叉比 (A,B;C,D)（以 AB 为参数轴） */
export function crOn(a, b, c, d) {
  const v = sub(b, a), L2 = dot(v, v) || 1;
  const tc = dot(sub(c, a), v) / L2, td = dot(sub(d, a), v) / L2;
  return (tc * (td - 1)) / (td * (tc - 1));
}

/** 已知 A,B,C，求 D 使 (A,B;C,D) = −1；C 为中点时返回 null（D 在无穷远） */
export function harmFourth(a, b, c) {
  const v = sub(b, a), L2 = dot(v, v) || 1, t = dot(sub(c, a), v) / L2;
  const den = 2 * t - 1;
  if (Math.abs(den) < 1e-6) return null;
  return add(a, mul(v, t / den));
}

/* ================= 椭圆（含圆 a=b）：{cx,cy,a,b} ================= */

export function conicPt(C, t) { return V(C.cx + C.a * Math.cos(t), C.cy + C.b * Math.sin(t)); }

export function onConic(C, p) {
  const x = (p.x - C.cx) / C.a, y = (p.y - C.cy) / C.b;
  return Math.abs(x * x + y * y - 1) < 0.01;
}

/** 直线（两点式）与椭圆交点 → [U,V] / null（虚交） */
export function lineConic(C, p1, p2) {
  const d = sub(p2, p1), aa = C.a * C.a, bb = C.b * C.b;
  const A = d.x * d.x / aa + d.y * d.y / bb,
        B = 2 * ((p1.x - C.cx) * d.x / aa + (p1.y - C.cy) * d.y / bb),
        Cc = ((p1.x - C.cx) ** 2) / aa + ((p1.y - C.cy) ** 2) / bb - 1;
  if (Math.abs(A) < 1e-12) return null;
  const disc = B * B - 4 * A * Cc;
  if (disc < 0) return null;
  const s = Math.sqrt(disc);
  return [add(p1, mul(d, (-B - s) / (2 * A))), add(p1, mul(d, (-B + s) / (2 * A)))];
}

/** 点 P 的极线：A x + B y = D */
export function polarLine(C, P) {
  const A = (P.x - C.cx) / (C.a * C.a), B = (P.y - C.cy) / (C.b * C.b);
  return { A, B, D: 1 + A * C.cx + B * C.cy };
}

/** 点到极线（一般式）的带号距离 */
export function plEval(L, p) { return (L.A * p.x + L.B * p.y - L.D) / Math.hypot(L.A, L.B); }

/** 直线（一般式）的极点 */
export function polarPoint(C, L) {
  const aa = C.a * C.a, bb = C.b * C.b;
  return V(C.cx + aa * L.A / (L.D - L.A * C.cx - L.B * C.cy),
           C.cy + bb * L.B / (L.D - L.A * C.cx - L.B * C.cy));
}

/** 一般式直线 → 其上两点（用于画线/求交） */
export function lineFromEq(A, B, D) {
  if (Math.abs(A) > Math.abs(B)) return [V(D / A, 0), V((D - B) / A, 1)];
  return [V(0, D / B), V(1, (D - A) / B)];
}

/** 两点直线的视觉延长（配合画板级 clipPath 裁剪） */
export function extSeg(p1, p2) {
  const d = norm(sub(p2, p1));
  return [sub(p1, mul(d, 4000)), add(p2, mul(d, 4000))];
}

export const fmt = (x, n = 3) => {
  const s = x.toFixed(n);
  return s === '-0.' + '0'.repeat(n) ? (0).toFixed(n) : s;
};

/* ================= 角度工具（光学反射实验用） ================= */

/** 方向角差归一到 (−π, π] */
export function angDiff(a, b) {
  let d = (a - b) % TAU;
  if (d > Math.PI) d -= TAU;
  if (d < -Math.PI) d += TAU;
  return d;
}

/** 两方向线夹角的锐角值（直线无方向性） */
export function acuteAng(a, b) {
  const d = Math.abs(angDiff(a, b));
  return Math.min(d, Math.PI - d);
}

/** 在点 P 处画从角 a1 转到 a2 的短弧（返回给 chip 用的角度不做，纯绘制） */
export function arcPts(P, a1, a2, r, steps = 14) {
  let d = angDiff(a2, a1);
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const a = a1 + d * i / steps;
    pts.push(`${(P.x + r * Math.cos(a)).toFixed(1)},${(P.y + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join('L')}`;
}

/** 隐函数零等值线（marching squares）：f(x,y) 在矩形 [x0,y0]-[x1,y1] 上取 nx×ny 网格，
    返回线段数组 [[p1,p2],…]（V 对象，同一坐标系）；鞍点歧义按单元中心值配对。
    配套 segsToPath 把线段拼成 path 的 d 属性，直接喂 mk('path')。 */
export function marchSegs(f, x0, y0, x1, y1, nx, ny) {
  const segs = [];
  const dx = (x1 - x0) / nx, dy = (y1 - y0) / ny, cols = nx + 1;
  const g = new Float64Array(cols * (ny + 1));
  for (let j = 0; j <= ny; j++)
    for (let i = 0; i <= nx; i++)
      g[j * cols + i] = f(x0 + i * dx, y0 + j * dy);
  const s = v => v < 0;
  const cross = (i, j, di, dj, a, b) => { const t = a / (a - b); return V(x0 + (i + t * di) * dx, y0 + (j + t * dj) * dy); };
  for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
    const v00 = g[j * cols + i], v10 = g[j * cols + i + 1], v01 = g[(j + 1) * cols + i], v11 = g[(j + 1) * cols + i + 1];
    const e = [];
    if (s(v00) !== s(v10)) e.push(cross(i, j, 1, 0, v00, v10));       // 下边
    if (s(v10) !== s(v11)) e.push(cross(i + 1, j, 0, 1, v10, v11));  // 右边
    if (s(v01) !== s(v11)) e.push(cross(i, j + 1, 1, 0, v01, v11));  // 上边
    if (s(v00) !== s(v01)) e.push(cross(i, j, 0, 1, v00, v01));      // 左边
    if (e.length === 2) segs.push([e[0], e[1]]);
    else if (e.length === 4) {
      const vc = f(x0 + (i + .5) * dx, y0 + (j + .5) * dy);
      if (s(vc) === s(v00)) segs.push([e[0], e[1]], [e[2], e[3]]);
      else segs.push([e[0], e[3]], [e[1], e[2]]);
    }
  }
  return segs;
}
export const segsToPath = segs =>
  segs.map(([a, b]) => `M${a.x.toFixed(1)},${a.y.toFixed(1)}L${b.x.toFixed(1)},${b.y.toFixed(1)}`).join('');
