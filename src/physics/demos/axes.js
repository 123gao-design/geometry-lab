/* 章页演示共用的小图版：一块矩形里铺网格、画坐标轴、标刻度。
   与实验板的 camera2d 不同，这里的每个面板只负责自己那一块矩形，
   宽高由调用方按画布现算，所以两个面板并排、上下叠都不互相牵制。 */

import { label, INK, gridMark } from '../gfx.js';

/** 取一个「好看」的刻度间隔：1 / 2 / 5 × 10^n */
export function niceStep(range, n = 5) {
  const raw = Math.abs(range) / Math.max(1, n);
  if (!Number.isFinite(raw) || raw <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(raw)));
  const m = raw / p;
  return p * (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10);
}

/** 刻度数字：去掉多余的零，避免出现 −0 */
export function num(v) {
  const r = Math.abs(v) < 1e-9 ? 0 : Math.round(v * 1000) / 1000;
  return String(+r.toFixed(2));
}

/**
 * 在矩形 r = {x,y,w,h} 里铺一张坐标图。
 * xr / yr 是数学坐标范围，o = { nx, ny, sx, sy, xlab, ylab }。
 * 返回 { X, Y, sx, sy }，X/Y 把数学坐标换成屏幕像素。
 */
export function panel(ctx, r, xr, yr, pal, o = {}) {
  /* 这块面板自带一张坐标网格：告诉外壳这一帧别再把纸面方格铺上来，
    两种网格叠在一起会互相咬（「自动」档据此收起背景网格） */
  gridMark();
  const X = v => r.x + ((v - xr[0]) / (xr[1] - xr[0])) * r.w;
  const Y = v => r.y + r.h - ((v - yr[0]) / (yr[1] - yr[0])) * r.h;
  const sx = o.sx || niceStep(xr[1] - xr[0], o.nx || 5);
  const sy = o.sy || niceStep(yr[1] - yr[0], o.ny || 4);

  ctx.save();
  ctx.beginPath();
  ctx.rect(r.x, r.y, r.w, r.h);
  ctx.clip();

  ctx.strokeStyle = pal.line;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = Math.ceil(xr[0] / sx) * sx; x <= xr[1] + 1e-9; x += sx) {
    const px = Math.round(X(x)) + 0.5;
    ctx.moveTo(px, r.y);
    ctx.lineTo(px, r.y + r.h);
  }
  for (let y = Math.ceil(yr[0] / sy) * sy; y <= yr[1] + 1e-9; y += sy) {
    const py = Math.round(Y(y)) + 0.5;
    ctx.moveTo(r.x, py);
    ctx.lineTo(r.x + r.w, py);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.restore();

  const hasZeroY = yr[0] <= 0 && yr[1] >= 0;
  const hasZeroX = xr[0] <= 0 && xr[1] >= 0;
  const ay = hasZeroY ? Y(0) : r.y + r.h;
  const ax = hasZeroX ? X(0) : r.x;
  /* 轴用石墨色、描粗一档，箭头也放大一号——整幅图里最先认出的是这两条线；
     老模块自带的 pal 没有 graphite 时退回 mut，不至于画不出来 */
  const AX = pal.graphite || pal.mut;
  const TX = pal.mut || pal.faint;

  const hAy = Math.round(ay) + 0.5;
  const hAx = Math.round(ax) + 0.5;
  ctx.save();
  ctx.strokeStyle = AX;
  ctx.fillStyle = AX;
  /* 轴宽是「绝对」的：外壳的 ctx 会把每处 lineWidth 乘 INK.lw，这里先除回去，
     再乘 INK.axis，于是设置页的「坐标轴」与「线条」两根滑块各管各的、不叠乘 */
  ctx.lineWidth = 1.4 * (ctx.__ink ? INK.axis / INK.lw : INK.axis);
  ctx.lineCap = 'round';
  // 轴画到框边，右端 / 上端各补一枚实心箭头（坐标轴的方向靠它交代）
  ctx.beginPath();
  ctx.moveTo(r.x, hAy);
  ctx.lineTo(r.x + r.w - 8, hAy);
  ctx.stroke();
  arrowHead(ctx, r.x + r.w - 1, ay, 0, 7);
  ctx.beginPath();
  ctx.moveTo(hAx, r.y + 8);
  ctx.lineTo(hAx, r.y + r.h);
  ctx.stroke();
  arrowHead(ctx, ax, r.y + 1, -Math.PI / 2, 7);
  ctx.restore();

  // 刻度：短线朝画框外侧探出，数字用次一级的墨色，读数不必跟轴线抢
  ctx.save();
  ctx.strokeStyle = TX;
  ctx.lineWidth = 1;
  for (let x = Math.ceil(xr[0] / sx) * sx; x <= xr[1] + 1e-9; x += sx) {
    if (Math.abs(x) < 1e-9) continue;
    const px = X(x);
    if (px < r.x + 10 || px > r.x + r.w - 10) continue;
    ctx.beginPath();
    ctx.moveTo(px, hAy);
    ctx.lineTo(px, ay + 5);
    ctx.stroke();
    label(ctx, num(x), px, ay + 14, TX, 'center', 12);
  }
  for (let y = Math.ceil(yr[0] / sy) * sy; y <= yr[1] + 1e-9; y += sy) {
    if (Math.abs(y) < 1e-9) continue;
    const py = Y(y);
    if (py < r.y + 10 || py > r.y + r.h - 10) continue;
    ctx.beginPath();
    ctx.moveTo(ax - 5, py);
    ctx.lineTo(ax, py);
    ctx.stroke();
    label(ctx, num(y), ax - 7, py, TX, 'right', 12);
  }
  ctx.restore();

  // 两轴在框内相交时，交点补一枚原点记号（落在左下那一角，躲开刻度数字）。
  // 字号跟刻度数字同级，不进可拖动标签的表——免得给老演示的文字位置存档错位。
  if (hasZeroX && hasZeroY) label(ctx, 'O', ax - 7, ay + 13, AX, 'right', 12.5);

  if (o.xlab) label(ctx, o.xlab, r.x + r.w - 13, ay - 11, AX, 'right', 13.5);
  if (o.ylab) label(ctx, o.ylab, ax + 10, r.y + 15, AX, 'left', 13.5);

  return { X, Y, sx, sy, ax, ay };
}

/** 轴端箭头：尖端在 (x,y)，ang 是轴正向的弧度（0 向右、−π/2 向上） */
function arrowHead(ctx, x, y, ang, s = 6) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x - s * Math.cos(ang - 0.42), y - s * Math.sin(ang - 0.42));
  ctx.lineTo(x - s * Math.cos(ang + 0.42), y - s * Math.sin(ang + 0.42));
  ctx.closePath();
  ctx.fill();
}

/** 按数学坐标数组画折线 */
export function poly(ctx, X, Y, pts, color, width = 2, dash) {
  if (!pts.length) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash);
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1]))));
  ctx.stroke();
  ctx.restore();
}

/** 实心小圆点（带一圈底色，压在线条上也看得清） */
export function spot(ctx, x, y, r, fill, ring) {
  if (ring) {
    ctx.beginPath();
    ctx.arc(x, y, r + 3, 0, Math.PI * 2);
    ctx.fillStyle = ring;
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}
