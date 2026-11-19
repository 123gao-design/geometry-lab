/* 演示：动能定理。
   物块在水平面上被恒力 F 拉着前进，同时受反向的摩擦力 f。
   左栏物块从起点加速滑到终点，右边画「各项功随位移的累积」三条直线：
   拉力做正功（斜率 F）、摩擦力做负功（斜率 −f）、两者之和是总功（斜率 F − f）。
   末了在 x = s 处用一枚青色圈标出动能变化 ½mv²，它正落在总功那条线上——W合 = ΔEk。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

export function create(st) {
  let last = '';
  let p = 0;          // 走完的比例 0..1
  let hold = 0;       // 到终点后停一下再重来
  const reset = () => { p = 0; hold = 0; };

  function frame(dt) {
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const F = clamp(nn(q.F, 10), 2, 20);
    const f = clamp(nn(q.f, 3), 0, 8);
    const m = clamp(nn(q.m, 2), 0.5, 5);
    const s = clamp(nn(q.s, 4), 1, 6);
    const key = [F, f, m, s].join('|');
    if (key !== last) { last = key; reset(); }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const a = (F - f) / m;
    const run = a > 1e-6;
    const vEnd = run ? Math.sqrt(2 * a * s) : 0;
    const tEnd = run ? Math.sqrt((2 * s) / a) : 0;
    const D = run ? clamp(1.15 * Math.sqrt(tEnd), 0.9, 2.4) : 0;

    if (dt > 0 && run) {
      if (hold > 0) {
        hold -= dt;
        if (hold <= 0) { p = 0; hold = 0; }
      } else {
        p = Math.min(1, p + dt / D);
        if (p >= 1) hold = 0.9;
      }
    }

    const moved = s * p * p;      // 匀加速：位移正比于时间的平方
    const vNow = vEnd * p;

    const dual = w >= 640;
    const sw = dual ? w * 0.56 : w - 16;
    const cy = h * 0.52;

    const U = (sw * 0.62) / 6;    // 6 m 占画宽的六成
    const Ls = s * U;
    const gy = cy + 40;           // 地面线
    const bx0 = sw * 0.12;        // 起点
    const bh = 38;                // 物块高
    const half = 20;              // 物块半边

    /* 地面 */
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(sw * 0.04, gy);
    ctx.lineTo(sw * 0.96, gy);
    ctx.stroke();
    ctx.restore();

    /* 位移：从起点到终点 */
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 2;
    ctx.globalAlpha = 0.85;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(bx0, gy + 20);
    ctx.lineTo(bx0 + Ls, gy + 20);
    ctx.stroke();
    ctx.restore();
    arrow(ctx, bx0, gy + 20, bx0 + Ls, gy + 20, pal.cyan, 2);
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(bx0, gy + 20);
    ctx.lineTo(bx0, gy - 4);
    ctx.moveTo(bx0 + Ls, gy + 20);
    ctx.lineTo(bx0 + Ls, gy - 4);
    ctx.stroke();
    ctx.restore();
    label(ctx, 's = ' + fmt(s, 1) + ' m', bx0 + Ls * 0.5, gy + 36, pal.cyan, 'center', 13);

    /* 物块 */
    const bx = bx0 + moved * U;
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.22;
    ctx.fillRect(bx - half, gy - bh, half * 2, bh);
    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(bx - half, gy - bh, half * 2, bh);
    ctx.restore();
    label(ctx, 'm', bx, gy - bh - 9, pal.blue, 'center', 13);

    /* 两根力：拉力向右、摩擦力向左，上下错开各一条 */
    const oy = gy - bh * 0.5;
    const Lf = 24 + 42 * (F / 20);
    arrow(ctx, bx, oy - 10, bx + Lf, oy - 10, pal.orange, 2.4);
    label(ctx, 'F', bx + Lf + 9, oy - 14, pal.orange, 'center', 14);
    if (f > 0.05) {
      const Lr = 20 + 40 * (f / 8);
      arrow(ctx, bx, oy + 10, bx - Lr, oy + 10, pal.purple, 2.4);
      label(ctx, 'f', bx - Lr - 9, oy + 14, pal.purple, 'center', 14);
    }

    /* 速度：物块上方一支绿箭头 */
    if (vNow > 1e-6 && vEnd > 0) {
      const Lv = 14 + 42 * (vNow / vEnd);
      const vy = gy - bh - 34;
      arrow(ctx, bx, vy, bx + Lv, vy, pal.green, 2.4);
      label(ctx, 'v = ' + fmt(vNow, 2) + ' m/s', bx + Lv + 10, vy + 4, pal.green, 'left', 13);
    }

    if (!run) {
      label(ctx, '推力不超过摩擦力，物体不起步，总功为零', sw * 0.5, gy - bh - 34,
        pal.pink, 'center', 13);
    }

    /* ── 右：各项功随位移的累积 ── */
    if (dual) {
      const px0 = sw + 20;
      const pw = w - px0 - 20;
      const ph = Math.min(240, Math.max(110, h - 180));
      const rect = {
        x: px0 + 36,
        y: Math.max(50, (h - ph) / 2),
        w: Math.max(120, pw - 58),
        h: ph,
      };
      const SM = 6;
      const hi = Math.max(F, Math.abs(F - f), 0.01) * SM * 1.15;
      const lo = -Math.max(f, 0.06 * F) * SM * 1.25;
      const g = panel(ctx, rect, [0, SM], [lo, hi], pal,
        { xlab: 's / m', ylab: 'W / J', nx: 4, ny: 4 });

      poly(ctx, g.X, g.Y, [[0, 0], [SM, F * SM]], pal.orange, 2.2);
      if (f > 0.05) poly(ctx, g.X, g.Y, [[0, 0], [SM, -f * SM]], pal.purple, 2.2, '6 4');
      poly(ctx, g.X, g.Y, [[0, 0], [SM, (F - f) * SM]], pal.green, 2.4);

      const xs = run ? s : 0;
      const Wnet = (F - f) * s;
      const Ek = 0.5 * m * vEnd * vEnd;

      /* 当前位移处四条读数：三项功与动能变化 */
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(g.X(xs), g.ay);
      ctx.lineTo(g.X(xs), rect.y);
      ctx.stroke();
      ctx.restore();

      spot(ctx, g.X(xs), g.Y(F * s), 4.5, pal.orange, pal.bg2);
      if (f > 0.05) spot(ctx, g.X(xs), g.Y(-f * s), 4.5, pal.purple, pal.bg2);
      spot(ctx, g.X(xs), g.Y(Wnet), 5, pal.green, pal.bg2);

      /* 动能变化用一圈青环标在同一处 */
      ctx.save();
      ctx.strokeStyle = pal.cyan;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(g.X(xs), g.Y(Ek), 10, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'ΔEk', g.X(xs) - 15, g.Y(Ek) - 12, pal.cyan, 'right', 13);

      label(ctx, '正功线 W = Fs', g.X(SM) - 6, g.Y(F * SM) - 10, pal.orange, 'right', 13);
      label(ctx, '总功线 W = (F − f)s', g.X(SM) - 6, g.Y((F - f) * SM) + 16, pal.green, 'right', 13);
    }

    st.readout([
      ['拉力 F', fmt(F, 1) + ' N'],
      ['摩擦力 f', fmt(f, 1) + ' N'],
      ['位移 s', fmt(s, 1) + ' m'],
      ['总功 W合', fmt(run ? (F - f) * s : 0, 1) + ' J'],
      ['末速度 v', fmt(vNow, 2) + ' m/s'],
      ['动能变化 ΔEk', fmt(run ? 0.5 * m * vNow * vNow : 0, 1) + ' J'],
    ]);
  }

  return { frame, reset };
}
