/* lathe3d.js —— 把 anatomy 样张（样例2）那种「车削仪表」的造型与质感搬进物理画板的一层小帮手。
   它只管屏幕空间的油漆活：金属圆杆（胶囊剪影 + 柱面光泽渐变）、水平厚板（日月双椭圆假出侧壁）、
   以及色调小工具。世界坐标的投影（orb.proj() + 屏幕映射 P）由调用方演示模块负责，
   这里收的全是屏幕坐标与像素尺度，因此与主题纸面（--pb-*）天然相容，换纸换主题颜色跟着走。

   世界坐标系与 demos/orbit.js 的 makeOrbit 同一套：x 向右、y 向上、z 朝读者。 */

const TAU = Math.PI * 2;

/** 把 css 颜色解析成 [r, g, b]；认 #rgb / #rrggbb / rgb()，其余按灰兜底 */
function hex(c) {
  if (typeof c !== 'string') return [148, 158, 178];
  if (c[0] === '#') {
    const h = c.slice(1);
    if (h.length === 3) return [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)];
    if (h.length === 6) return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  const m = /rgba?\(([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/.exec(c);
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])];
  return [148, 158, 178];
}
const chip = v => Math.max(0, Math.min(255, Math.round(v)));

/** 乘亮度：k < 1 压暗、k > 1 提亮（用于金属的暗部与边沿） */
export const shade = (c, k) => {
  const [r, g, b] = hex(c);
  return `rgb(${chip(r * k)},${chip(g * k)},${chip(b * k)})`;
};

/** 向白混合：k ∈ [0, 1]，高光带用 */
export const tint = (c, k) => {
  const [r, g, b] = hex(c);
  return `rgb(${chip(r + (255 - r) * k)},${chip(g + (255 - g) * k)},${chip(b + (255 - b) * k)})`;
};

/** 一条圆头胶囊的闭合路径：矩形 + 两端半圆（圆柱正交投影的剪影恰好长这样） */
export function capPath(ctx, ax, ay, bx, by, rad) {
  ctx.beginPath();
  const dx = bx - ax;
  const dy = by - ay;
  const d = Math.hypot(dx, dy);
  if (d < 1e-6) {
    ctx.arc(ax, ay, rad, 0, TAU);
    ctx.closePath();
    return;
  }
  const ux = dx / d;
  const uy = dy / d;
  const px = -uy;
  const py = ux;
  ctx.moveTo(ax + px * rad, ay + py * rad);
  ctx.lineTo(bx + px * rad, by + py * rad);
  ctx.arc(bx, by, rad, Math.atan2(py, px), Math.atan2(py, px) + Math.PI);
  ctx.lineTo(ax - px * rad, ay - py * rad);
  ctx.arc(ax, ay, rad, Math.atan2(-py, -px), Math.atan2(-py, -px) + Math.PI);
  ctx.closePath();
}

/** 一段金属圆杆：填充柱面光泽渐变（边沿暗、朝向屏幕上方一点的高光带）。
    光的朝向按屏幕空间处理 —— 高光带偏向画面的上侧，任何朝向的杆都统一好看。 */
export function capsule(ctx, ax, ay, bx, by, rad, base, o) {
  const t = o && o.tint != null ? o.tint : 0.22;   // 高光提亮系数
  const dk = o && o.dark != null ? o.dark : 0.56;  // 边沿压暗系数
  const uni = o && o.uni != null ? o.uni : 0.84;   // 中间档
  const dx = bx - ax;
  const dy = by - ay;
  const d = Math.hypot(dx, dy);
  if (d < 1e-6) {
    ctx.beginPath();
    ctx.arc(ax, ay, rad, 0, TAU);
    const gr = ctx.createRadialGradient(ax - rad, ay - rad, 0, ax, ay, rad);
    gr.addColorStop(0, tint(base, t));
    gr.addColorStop(0.6, base);
    gr.addColorStop(1, shade(base, dk));
    ctx.fillStyle = gr;
    ctx.fill();
    return;
  }
  const px = -dy / d;
  const py = dx / d;
  /* 高光朝向画面「偏上」的那一侧：选 p 的符号使 +p 有向上的分量 */
  const or = py > 0 ? -1 : 1;
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const gr = ctx.createLinearGradient(
    mx - px * rad * or, my - py * rad * or,
    mx + px * rad * or, my + py * rad * or,
  );
  gr.addColorStop(0, shade(base, dk));
  gr.addColorStop(0.34, shade(base, uni));
  gr.addColorStop(0.5, tint(base, t));
  gr.addColorStop(0.66, shade(base, uni));
  gr.addColorStop(1, shade(base, dk));
  capPath(ctx, ax, ay, bx, by, rad);
  ctx.fillStyle = gr;
  ctx.fill();
  if (rad >= 5) {
    ctx.strokeStyle = shade(base, 0.74);
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

/** 一条采样出来的椭圆/圆环路径（供下面的 disc / ring 用） */
function sweep(ctx, cx, cy, r1, r0, n) {
  ctx.beginPath();
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * TAU;
    const x = cx + Math.cos(a) * r1;
    const y = cy + Math.sin(a) * r1;
    if (i) ctx.lineTo(x, y);
    else ctx.moveTo(x, y);
  }
  ctx.closePath();
}

/** 一枚水平圆环/圆（在屏幕上的正圆形式，demo 传递已投影好的圆心与像素半径） */
export function ring(ctx, cx, cy, rad, color, o) {
  const w = (o && o.width) || 1;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = (o && o.alpha != null ? o.alpha : 1);
  ctx.lineWidth = w;
  if (o && o.dash) ctx.setLineDash(o.dash);
  sweep(ctx, cx, cy, rad, 0, 96);
  ctx.stroke();
  ctx.restore();
}

/** 一枚实心圆点（太阳、金针顶之类） */
export function dot(ctx, cx, cy, rad, fill, o) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.globalAlpha = (o && o.alpha != null ? o.alpha : 1);
  ctx.beginPath();
  ctx.arc(cx, cy, rad, 0, TAU);
  ctx.fill();
  if (o && o.edge) {
    ctx.strokeStyle = o.edge;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  ctx.restore();
}