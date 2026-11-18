/* 演示：水平面上的摩擦力。
   拉力从零往上加，静摩擦始终与拉力等大反向；拉过最大静摩擦 μN 之后木块起步，
   摩擦改由 f = μN 决定，木块开始加速。右图画 f 随 F 的变化：
   静摩擦段沿 45° 直线，滑动摩擦段是水平线。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const G0 = 9.8;

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
    const F = clamp(Number(p.F) || 4, 0, 20);
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
      if (pos > 5.2) { pos = 0; vel = 0; }
      if (t > 1e6) t = 0;
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    /* ── 左：木块与力 ── */
    const lw = Math.min(w * 0.46, 400);
    const x0 = 26;
    const spanPx = lw - 96;
    const sPx = spanPx / 5.2;                // 5.2 m 走完整个行程
    const yG = Math.round(h * 0.70) + 0.5;   // 地面

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

    ctx.save();
    ctx.globalAlpha = 0.24;
    ctx.fillStyle = pal.orange;
    ctx.fillRect(bx, by, bw, bh);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.restore();

    const pcx = bx + bw / 2;
    const pcy = by + bh / 2;
    const fpx = (h * 0.15) / 22;

    // 拉力
    if (F > 0.05) {
      arrow(ctx, pcx, pcy, pcx + F * fpx, pcy, pal.blue, 2.4);
      label(ctx, 'F = ' + fmt(F, 1) + ' N', pcx + F * fpx + 6, pcy - 10, pal.blue, 'left', 13);
    }
    // 摩擦力
    if (f > 0.05) {
      arrow(ctx, pcx, pcy + 14, pcx - f * fpx, pcy + 14, pal.green, 2.4);
      label(ctx, 'f = ' + fmt(f, 1) + ' N', pcx - f * fpx - 6, pcy + 6, pal.green, 'right', 13);
    }
    // 重力与支持力
    arrow(ctx, pcx, by + 4, pcx, by + 4 + Math.min(N * fpx, yG - by + 22), pal.pink, 1.6);
    label(ctx, 'mg', pcx - 8, yG + 18, pal.pink, 'right', 12);
    arrow(ctx, pcx - 16, yG - 4, pcx - 16, yG - 4 - Math.min(N * fpx, bh + 16), pal.cyan, 1.6);
    label(ctx, 'N', pcx - 22, by - 8, pal.cyan, 'right', 12);

    // 状态
    label(
      ctx,
      moving ? '已起步：f = μN，做匀加速' : '仍静止：f 与 F 等大反向',
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
    poly(ctx, g.X, g.Y, [[0, 0], [xKink, Math.min(fmax, yMax)]], pal.green, 2.2);
    poly(ctx, g.X, g.Y, [[xKink, fmax], [20, Math.min(fmax, yMax)]], pal.green, 2.2);

    // F = μN 竖虚线
    if (fmax <= yMax) {
      poly(ctx, g.X, g.Y, [[xKink, 0], [xKink, fmax]], pal.faint, 1.2, [4, 4]);
      label(ctx, 'μN', g.X(xKink) - 6, g.Y(fmax) - 10, pal.mut, 'right', 12);
    }

    label(ctx, '静摩擦 f = F', g.X(xKink * 0.42), g.Y(fmax * 0.30) + 26, pal.green, 'center', 12);
    label(ctx, '滑动摩擦 f = μN', g.X(20) - 8, g.Y(fmax) - 14, pal.green, 'right', 12);

    spot(ctx, g.X(F), g.Y(Math.min(f, yMax)), 5, pal.orange, pal.bg2);

    st.readout([
      ['正压力 N = mg', fmt(N, 1) + ' N'],
      ['最大静摩擦 μN', fmt(fmax, 2) + ' N'],
      ['当前摩擦力 f', fmt(f, 2) + ' N'],
      ['加速度 a', fmt(a, 2) + ' m/s²'],
      ['状态', moving ? '滑动' : '静止'],
    ]);
  }

  return { frame, reset };
}
