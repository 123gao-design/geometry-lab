/* 演示：水平面上的摩擦力。
   拉力从零往上加，静摩擦始终与拉力等大反向；拉过最大静摩擦 μN 之后木块起步，
   摩擦改由 f = μN 决定，木块开始加速。
   四支力一律从木块中心画出（共点力）：F 向右、f 向左、N 向上、mg 向下，
   长度在同一把尺子上量。木块滑动时整块右移，到行程尽头从头重放。
   右图画 f 随 F 的变化：静摩擦段沿 45° 直线，滑动摩擦段是水平线。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const G0 = 9.8;
const PMAX = 2.2;          // 一趟滑多远（米），到头从头重放

export function create(st) {
  let t = 0;
  let pos = 0;
  let vel = 0;
  let last = '';

  const reset = () => {
    t = 0;
    pos = 0;
    vel = 0;
  };
  reset();

  function frame(dt) {
    const p = st.params;
    const F = clamp(Number(p.F) || 0, 0, 20);
    const mu = Number.isFinite(Number(p.mu)) ? clamp(Number(p.mu), 0.05, 0.6) : 0.3;
    const m = clamp(Number(p.m) || 2, 1, 5);
    const key = [F, mu, m].join('|');
    if (key !== last) { last = key; reset(); }

    const N = m * G0;
    const fmax = mu * N;
    const moving = F > fmax + 1e-9;
    const f = moving ? fmax : F;
    const a = moving ? (F - fmax) / m : 0;

    if (dt > 0) {
      t += dt;
      if (moving) {
        vel += a * dt;
        pos += vel * dt;
      }
      if (pos > PMAX) { pos = 0; vel = 0; }
      if (t > 1e6) t = 0;
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    /* ── 左：木块与四支力 ── */
    const lw = Math.min(w * 0.46, 400);
    const x0 = 26;
    const spanPx = lw - 96;
    const sPx = spanPx / 5.2;                // 5.2 m 走完整个行程
    const yG = Math.round(h * 0.76) + 0.5;   // 地面

    // 地面
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x0, yG);
    ctx.lineTo(x0 + lw, yG);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.strokeStyle = pal.faint;
    for (let i = 0; i < lw; i += 14) {
      ctx.beginPath();
      ctx.moveTo(x0 + i, yG);
      ctx.lineTo(x0 + i - 8, yG + 9);
      ctx.stroke();
    }
    ctx.restore();

    const bw = 58;
    const bh = 34;
    const bx = x0 + 30 + pos * sPx;
    const by = yG - bh;

    // 起点刻度：木块离开后标出出发位置
    if (pos > 0.06) {
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x0 + 30, by - 6);
      ctx.lineTo(x0 + 30, yG);
      ctx.stroke();
      ctx.restore();
    }

    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.fillStyle = pal.orange;
    ctx.fillRect(bx, by, bw, bh);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.restore();

    /* 共点：四支力都从这个点出发 */
    const pcx = bx + bw / 2;
    const pcy = by + bh / 2;

    const fRef = Math.max(F, fmax, 6);
    const Lmax = Math.min(h * 0.12, lw * 0.17);
    const fs = Lmax / fRef;                     // 每牛多少像素
    const Lv = Math.min(N * fs, h * 0.16);      // 竖直两支收一收，别戳出画框

    // 拉力 F（向右）
    const LF = F * fs;
    if (F > 0.05) {
      arrow(ctx, pcx, pcy, pcx + LF, pcy, pal.blue, 2.4);
      label(ctx, 'F = ' + fmt(F, 1) + ' N', pcx + LF + 6, pcy - 9, pal.blue, 'left', 13);
    }
    // 摩擦力 f（向左）
    const Lf = f * fs;
    if (f > 0.05) {
      arrow(ctx, pcx, pcy, pcx - Lf, pcy, pal.green, 2.4);
      label(ctx, 'f = ' + fmt(f, 1) + ' N', pcx - Lf - 6, pcy - 9, pal.green, 'right', 13);
    }
    // 支持力 N（向上）、重力 mg（向下），同一把尺子所以两支等长
    arrow(ctx, pcx, pcy, pcx, pcy - Lv, pal.cyan, 2.0);
    label(ctx, 'N = ' + fmt(N, 1) + ' N', pcx + 5, pcy - Lv + 12, pal.cyan, 'left', 12);
    arrow(ctx, pcx, pcy, pcx, pcy + Lv, pal.pink, 2.0);
    label(ctx, 'mg = ' + fmt(N, 1) + ' N', pcx + 5, pcy + Lv - 4, pal.pink, 'left', 12);

    // 共点标记
    ctx.save();
    ctx.fillStyle = pal.ink;
    ctx.beginPath();
    ctx.arc(pcx, pcy, 2.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 状态
    label(
      ctx,
      moving
        ? '已起步：f = μN = ' + fmt(fmax, 1) + ' N，木块匀加速（a = ' + fmt(a, 2) + ' m/s²）'
        : '仍静止：f 与 F 等大反向，木块不动',
      x0 + 4,
      h - 16,
      moving ? pal.orange : pal.mut,
      'left',
      13,
    );

    /* ── 右：f-F 图 ── */
    const gx = Math.max(x0 + lw + 44, w * 0.54);
    const gr = { x: gx, y: 30, w: w - gx - 26, h: h - 96 };
    const yMax = Math.max(10, fmax * 1.5);
    const g = panel(ctx, gr, [0, 20], [0, yMax], pal, { xlab: 'F / N', ylab: 'f / N', nx: 5, ny: 4 });

    const xKink = Math.min(20, fmax);
    const yK = Math.min(fmax, yMax);
    poly(ctx, g.X, g.Y, [[0, 0], [xKink, Math.min(xKink, yMax)]], pal.green, 2.2);
    if (xKink < 20) poly(ctx, g.X, g.Y, [[xKink, yK], [20, yK]], pal.green, 2.2);

    // F = μN 竖虚线（拐点落在图内时才画）
    if (fmax < 20 && fmax <= yMax) {
      poly(ctx, g.X, g.Y, [[xKink, 0], [xKink, fmax]], pal.faint, 1.2, [4, 4]);
      label(ctx, 'μN', g.X(xKink) - 6, g.Y(fmax) - 10, pal.mut, 'right', 12);
    }

    label(ctx, '静摩擦 f = F', g.X(xKink * 0.42), g.Y(fmax * 0.30) + 26, pal.green, 'center', 12);
    if (xKink < 18) {
      label(ctx, '滑动摩擦 f = μN', g.X(20) - 8, g.Y(yK) - 14, pal.green, 'right', 12);
    }

    spot(ctx, g.X(F), g.Y(Math.min(f, yMax)), 5, pal.orange, pal.bg2);

    st.readout([
      ['正压力 N = mg', fmt(N, 1) + ' N'],
      ['最大静摩擦 μN', fmt(fmax, 2) + ' N'],
      ['当前摩擦力 f', fmt(f, 2) + ' N'],
      ['加速度 a', fmt(a, 2) + ' m/s²'],
      ['已滑行 s', fmt(pos, 2) + ' m'],
      ['状态', moving ? '滑动' : '静止'],
    ]);
  }

  return { frame, reset };
}
