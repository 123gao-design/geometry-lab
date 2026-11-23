// 点 [x,y,w] 和直线 [a,b,c] 都只在非零比例意义下确定。
export const EPS = 1e-10;
export const dot3 = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];

export function normalize(v) {
  const n = Math.hypot(...v);
  return n > EPS ? v.map(x => x / n) : null;
}

// 叉积同时用于点的连线和线的交点。零向量表示两对象重合。
export function cross3(u, v) {
  if (!u || !v) return null;
  return normalize([
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ]);
}

export const atInfinity = v => v && Math.abs(v[2]) <= EPS;
export const infinityLine = l => l && Math.hypot(l[0], l[1]) <= EPS;
export const unitPolar = ([x, y, w]) => [x, y, -w];

export const contact = t => [Math.cos(t), Math.sin(t), 1];

// 展开 cos(a−b) 后得到的弦方程。两点共位时自然给出切线。
export function unitChord(t, u) {
  const mid = (t + u) / 2;
  return [Math.cos(mid), Math.sin(mid), -Math.cos((t - u) / 2)];
}

export function projectiveCrossRatio(a, b, c, d) {
  const det = ([u, w], [v, z]) => u * z - v * w;
  if ([a, b, c, d].some((p, i, points) => points.slice(0, i).some(q => Math.abs(det(p, q)) <= EPS))) return null;
  return det(c, a) * det(d, b) / (det(c, b) * det(d, a));
}
