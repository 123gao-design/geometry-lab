/* isofig.js —— 实验页用的「浅色等轴测仪表」小帮手（纯 canvas）。
   照 anatomy 样张的观感来：正交投影 + 分色浅调（各组一件器物一种淡色），
   底座、立柱、横梁、圆盘、球都用「顶面亮、侧面暗」两三档色拼出体积，
   再叠一圈落地阴影。视角由 azimuth 参数平滑转动（不是预渲染帧，逐帧重算）。

   世界坐标：x 向右、y 向上、z 朝读者。方位角 az 绕竖轴、仰角 el 抬高视线。 */

import { shade, tint, capsule } from './demos/lathe3d.js';
import { VIEW } from './gfx.js';

const TAU = Math.PI * 2;

/** 一件器物的淡色调：给一个基色，顶面更亮、侧面更暗 */
export const tones = (base) => ({
  top: tint(base, 0.55),
  face: tint(base, 0.24),
  side: base,
  edge: shade(base, 0.72),
  dark: shade(base, 0.55),
});

/** 浅色多色调（都偏浅，压在浅纸上不糊） */
export const SKIN = {
  base: '#d8d1c1',
  steel: '#c9d4e4',
  frame: '#d4d4cc',
  pan: '#e8cfa3',
  weightL: '#e8b98f',
  weightR: '#a9cfb8',
  gold: '#dfae6a',
  accent: '#cf8a63',
  iron: '#b9c2cf',
};

export function makeCam(azDeg, elDeg) {
  const az = (azDeg * Math.PI) / 180;
  const el = (elDeg * Math.PI) / 180;
  const sa = Math.sin(az);
  const ca = Math.cos(az);
  const se = Math.sin(el);
  const ce = Math.cos(el);
  return {
    az, el, sa, ca, se, ce,
    proj(x, y, z) {
      return [x * ca - z * sa, x * sa * se + y * ce + z * ca * se];
    },
  };
}

/** 按一组世界点定缩放与原点；返回屏幕映射 P（并带 P.S） */
export function fitCam(cam, w, h, pts, kx = 0.84, ky = 0.80) {
  let lo = Infinity, hi = -Infinity, bot = Infinity, top = -Infinity;
  for (const p of pts) {
    const [X, U] = cam.proj(p[0], p[1], p[2]);
    if (X < lo) lo = X;
    if (X > hi) hi = X;
    if (U < bot) bot = U;
    if (U > top) top = U;
  }
  const S = Math.min((w * kx) / Math.max(1, hi - lo), (h * ky) / Math.max(1, top - bot));
  const OX = w / 2 - (S * (lo + hi)) / 2;
  const OY = h / 2 + (S * (top + bot)) / 2;
  // 外壳的缩放 / 平移走 VIEW（camera2d 那一套）；这里自己投影，也要叠上去，
  // 否则实验页的滚轮缩放与拖动平移对这块板不起作用。
  const z = Number.isFinite(VIEW.z) ? VIEW.z : 1;
  const vx = Number.isFinite(VIEW.x) ? VIEW.x : 0;
  const vy = Number.isFinite(VIEW.y) ? VIEW.y : 0;
  const P = (x, y, z3) => {
    const [X, U] = cam.proj(x, y, z3);
    let sx = OX + S * X;
    let sy = OY - S * U;
    sx = w / 2 + vx + (sx - w / 2) * z;
    sy = h / 2 + vy + (sy - h / 2) * z;
    return [sx, sy];
  };
  P.S = S * z;
  return { S: S * z, P };
}

/* 屏幕空间的正投影椭圆（水平圆盘 / 圆柱端面）；逐点取样，不依赖 ctx.ellipse */
function ellipsePath(ctx, cx, cy, rx, ry, n = 40) {
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * TAU;
    const x = cx + Math.cos(t) * rx;
    const y = cy + Math.sin(t) * ry;
    if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y);
  }
  ctx.closePath();
}

/** 落地软阴影：投影一个水平圆并淡填 */
export function halo(ctx, cam, P, x, z, r, y, alpha = 0.16) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = '#4d5666';
  ctx.beginPath();
  for (let i = 0; i <= 48; i++) {
    const t = (i / 48) * TAU;
    const p = P(x + r * Math.cos(t), y, z + r * Math.sin(t));
    if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** 竖直长方体：中心 (x,z)、满宽 w、满深 d、y0..y1；画出顶面与朝向读者的两个侧面 */
export function box(ctx, cam, P, x, z, w, d, y0, y1, base, o = {}) {
  const X0 = x - w / 2, X1 = x + w / 2, Z0 = z - d / 2, Z1 = z + d / 2;
  const T = tones(base);
  const quad = (pts, fill) => {
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = T.edge;
    ctx.lineWidth = 0.8;
    ctx.stroke();
  };
  // 朝向读者的两个侧面
  if (cam.sa > 0) quad([P(X0, y0, Z0), P(X0, y1, Z0), P(X0, y1, Z1), P(X0, y0, Z1)], T.side);
  else quad([P(X1, y0, Z0), P(X1, y1, Z0), P(X1, y1, Z1), P(X1, y0, Z1)], T.side);
  if (cam.ca > 0) quad([P(X0, y0, Z0), P(X1, y0, Z0), P(X1, y1, Z0), P(X0, y1, Z0)], T.face);
  else quad([P(X0, y0, Z1), P(X1, y0, Z1), P(X1, y1, Z1), P(X0, y1, Z1)], T.face);
  // 顶面
  const top = [P(X0, y1, Z0), P(X1, y1, Z0), P(X1, y1, Z1), P(X0, y1, Z1)];
  let l = Infinity, r = -Infinity, b = Infinity, t = -Infinity;
  for (const p of top) { l = Math.min(l, p[0]); r = Math.max(r, p[0]); b = Math.min(b, p[1]); t = Math.max(t, p[1]); }
  const g = ctx.createLinearGradient(l, t, r, b);
  g.addColorStop(0, T.top);
  g.addColorStop(1, T.face);
  ctx.beginPath();
  top.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.closePath();
  ctx.fillStyle = o.fill || g;
  ctx.fill();
  ctx.strokeStyle = T.edge;
  ctx.lineWidth = 0.9;
  ctx.stroke();
}

/** 竖直圆柱：中心 (x,z)、半径 r、y0..y1 */
export function cyl(ctx, cam, P, x, z, r, y0, y1, base) {
  const T = tones(base);
  const S = P.S;
  const ct = P(x, y1, z);
  const cb = P(x, y0, z);
  const cx = ct[0];
  const rx = Math.max(0.6, r * S);
  const ry = Math.max(0.6, r * cam.se * S);
  // 底端牌子
  ellipsePath(ctx, cx, cb[1], rx, ry);
  ctx.fillStyle = T.dark;
  ctx.fill();
  // 柱身
  const g = ctx.createLinearGradient(cx - rx, 0, cx + rx, 0);
  g.addColorStop(0, T.dark);
  g.addColorStop(0.32, T.face);
  g.addColorStop(0.5, T.top);
  g.addColorStop(0.68, T.face);
  g.addColorStop(1, T.dark);
  ctx.beginPath();
  ctx.rect(cx - rx, ct[1], 2 * rx, Math.max(1, cb[1] - ct[1]));
  ctx.fillStyle = g;
  ctx.fill();
  // 顶端面
  ellipsePath(ctx, cx, ct[1], rx, ry);
  ctx.fillStyle = T.top;
  ctx.fill();
  ctx.strokeStyle = T.edge;
  ctx.lineWidth = 0.9;
  ctx.stroke();
}

/** 球 */
export function sphere(ctx, P, x, y, z, r, base) {
  const c = P(x, y, z);
  const rad = Math.max(1, r * P.S);
  const g = ctx.createRadialGradient(c[0] - rad * 0.35, c[1] - rad * 0.35, rad * 0.1, c[0], c[1], rad);
  g.addColorStop(0, tint(base, 0.7));
  g.addColorStop(0.6, base);
  g.addColorStop(1, shade(base, 0.6));
  ctx.beginPath();
  ctx.arc(c[0], c[1], rad, 0, TAU);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = shade(base, 0.72);
  ctx.lineWidth = 0.9;
  ctx.stroke();
}

/** 水平圆盘（薄）：顶面淡色 + 一圈边 */
export function disc(ctx, cam, P, x, z, r, y, base, o = {}) {
  const T = tones(base);
  ctx.beginPath();
  for (let i = 0; i <= 48; i++) {
    const t = (i / 48) * TAU;
    const p = P(x + r * Math.cos(t), y, z + r * Math.sin(t));
    if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
  }
  ctx.closePath();
  ctx.fillStyle = o.fill || T.top;
  ctx.fill();
  if (o.stroke !== false) {
    ctx.strokeStyle = T.edge;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

/** 水平圆环（细线） */
export function ring3(ctx, P, x, z, r, y, color, o = {}) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = o.alpha != null ? o.alpha : 0.85;
  ctx.lineWidth = o.width || 1;
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath();
  const n = o.n || 48;
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * TAU;
    const p = P(x + r * Math.cos(t), y, z + r * Math.sin(t));
    if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
  }
  ctx.stroke();
  ctx.restore();
}

/** 两点之间的圆杆（胶囊） */
export function rod(ctx, P, a, b, rWorld, base, o = {}) {
  const A = P(a[0], a[1], a[2]);
  const B = P(b[0], b[1], b[2]);
  const rad = Math.max(0.8, rWorld * P.S);
  capsule(ctx, A[0], A[1], B[0], B[1], rad, base, { tint: 0.24, dark: 0.72, ...o });
}

/** 采样一段三维折线（角度弧、绳子等） */
export function poly3(ctx, P, pts, color, o = {}) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = o.alpha != null ? o.alpha : 1;
  ctx.lineWidth = o.width || 1;
  ctx.lineCap = 'round';
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.beginPath();
  pts.forEach((q, i) => {
    const p = P(q[0], q[1], q[2]);
    if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
  });
  ctx.stroke();
  ctx.restore();
}
