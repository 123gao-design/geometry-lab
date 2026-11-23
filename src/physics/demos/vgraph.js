/* 演示：匀变速直线运动的 x-t 与 v-t 图像。
   两张图上下摞着、共用同一条时间轴（摆法与力4 的 freefall 相同）：
   x-t 图线上切线的斜率是瞬时速度，v-t 图线的斜率是加速度，
   图线与时间轴围出的有向面积是位移。一条竖虚线上下贯穿，
   同一时刻的两个动点对得起来，读数栏里的数也就是那两个点的坐标。 */

import { label, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const TEND = 5;    // 走完一遍演示用的时间（秒）
const XMAX = 5.4;  // 时间轴画到这里，右端给箭头留一点余量
const HS = 0.45;   // 斜率三角形的 Δt，只要一小段

export function create(st) {
  let t = 0;
  let last = '';
  let pendingTime;

  const reset = () => { t = 0; pendingTime = undefined; };
  const seek = time => { pendingTime = clamp(time, 0, TEND); };

  function frame(dt) {
    const p = st.params;
    const v0 = clamp(Number(p.v0) || 0, -8, 8);
    const a = clamp(Number(p.a) || 0, -6, 6);
    const key = v0 + '|' + a;
    if (key !== last) { last = key; t = 0; }

    if (pendingTime !== undefined) {
      t = pendingTime;
      pendingTime = undefined;
    } else if (dt > 0) {
      t += dt;
      if (t > TEND) t = 0;
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const velocity = u => v0 + a * u;
    const position = u => (v0 + 0.5 * a * u) * u;
    const v = velocity(t), x = position(t);
    const turn = a === 0 ? 0 : -v0 / a;
    const returns = 2 * turn;
    const turnInView = turn > 0 && turn <= XMAX;
    const split = turn > 0 && turn < t ? turn : t;
    const distance = Math.abs(position(split)) + Math.abs(x - position(split));

    /* ── 两块面板：上 x-t、下 v-t，横轴共用同一段 [0, XMAX] ── */
    const padL = 62;
    const padR = 34;
    const gap = 30;
    const pw = Math.max(160, w - padL - padR);
    const top = turnInView ? 47 : 18;
    const ph = Math.max(65, (h - top - 22 - gap) / 2);
    const rA = { x: padL, y: top, w: pw, h: ph };
    const rB = { x: padL, y: top + ph + gap, w: pw, h: ph };
    const xr = [0, XMAX];

    /* 取景：抛物线的两端与顶点都留在框里，a 变号也不会画到框外 */
    const xCand = [0, position(XMAX)];
    if (turnInView) xCand.push(position(turn));
    let xlo = Math.min(...xCand);
    let xhi = Math.max(...xCand);
    const xpad = Math.max((xhi - xlo) * 0.14, 0.4);
    xlo -= xpad;
    xhi += xpad;

    const vEnd = velocity(XMAX);
    let vlo = Math.min(0, v0, vEnd);
    let vhi = Math.max(0, v0, vEnd);
    const vpad = Math.max((vhi - vlo) * 0.16, 0.4);
    vlo -= vpad;
    vhi += vpad;

    const gA = panel(ctx, rA, xr, [xlo, xhi], pal, { xlab: 't / s', ylab: 'x / m', nx: 6, ny: 4 });
    const gB = panel(ctx, rB, xr, [vlo, vhi], pal, { xlab: 't / s', ylab: 'v / (m/s)', nx: 6, ny: 4 });
    const primary = pal.indigo || pal.blue;
    const negative = pal.sienna || pal.orange;
    const labelEvent = (u, caption, color, y) => {
      const px = gA.X(u);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.58;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(px, y + 4);
      ctx.lineTo(px, rB.y + rB.h);
      ctx.stroke();
      ctx.restore();
      label(ctx, caption + ' ' + fmt(u, 2) + ' s', clamp(px, rA.x + 32, rA.x + rA.w - 45), y, color, 'center', 12);
    };
    if (turnInView) labelEvent(turn, '转向', pal.green, 16);
    if (turnInView && returns <= XMAX) labelEvent(returns, '回到起点', negative, 34);

    /* ── 上图：x-t 曲线，切线斜率 = 瞬时速度 ── */
    const curve = [];
    for (let i = 0; i <= 120; i++) {
      const u = (i / 120) * XMAX;
      curve.push([u, position(u)]);
    }
    poly(ctx, gA.X, gA.Y, curve, primary, 3);

    /* 切线：两端按视野上下沿收住，速度大时不会冲出面板 */
    const vAbs = Math.abs(v);
    const room = vAbs > 1e-6 ? Math.min((xhi - x) / vAbs, (x - xlo) / vAbs) : 0.62;
    const du = clamp(Math.min(0.62, room), 0.06, 0.62);
    const u0 = clamp(t - du, 0, XMAX);
    const u1 = clamp(t + du, 0, XMAX);
    if (u1 - u0 > 0.12) {
      poly(ctx, gA.X, gA.Y, [[u0, x + v * (u0 - t)], [u1, x + v * (u1 - t)]], pal.green, 1.6, [5, 4]);
    }

    /* ── 下图：v-t 图线，0..t 的有向面积 = 位移 ── */
    fillArea(ctx, gB, 0, split, v0, velocity(split), primary, negative);
    fillArea(ctx, gB, split, t, velocity(split), v, primary, negative);

    /* 整条 v-t 直线：右端用 v = v0 + at 的准确值，
       与阴影的上沿同一条线，不会再各走各的 */
    poly(ctx, gB.X, gB.Y, [[0, 0], [XMAX, 0]], pal.graphite || pal.mut, 1.6);
    poly(ctx, gB.X, gB.Y, [[0, v0], [XMAX, vEnd]], primary, 3);

    /* 斜率三角形：取紧挨着当前时刻的一小段，整块落在蓝色区域里 */
    let slope = a;
    if (t > 0.12) {
      const hs = Math.min(HS, t);
      const t1 = t - hs;
      const v1 = velocity(t1);
      slope = (v - v1) / hs;
      ctx.save();
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.6;
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(gB.X(t1), gB.Y(v1));
      ctx.lineTo(gB.X(t), gB.Y(v1));
      ctx.lineTo(gB.X(t), gB.Y(v));
      ctx.stroke();
      ctx.restore();
      label(
        ctx,
        'Δt',
        (gB.X(t1) + gB.X(t)) / 2,
        clamp(gB.Y(v1) + (v1 >= 0 ? 13 : -13), rB.y + 12, rB.y + rB.h - 8),
        pal.orange,
        'center',
        12,
      );
      label(
        ctx,
        'Δv',
        gB.X(t) - 7,
        clamp((gB.Y(v1) + gB.Y(v)) / 2, rB.y + 10, rB.y + rB.h - 8),
        pal.orange,
        'right',
        12,
      );
    }

    /* ── 一条竖虚线贯穿两张图：上下的读数来自同一时刻 ── */
    const cxT = Math.round(gA.X(Math.min(t, XMAX))) + 0.5;
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([2, 6]);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cxT, rA.y);
    ctx.lineTo(cxT, rB.y + rB.h);
    ctx.stroke();
    ctx.restore();

    if (turnInView) {
      spot(ctx, gA.X(turn), gA.Y(position(turn)), 3.5, pal.green, pal.bg2);
      spot(ctx, gB.X(turn), gB.Y(0), 3.5, pal.green, pal.bg2);
      if (returns <= XMAX) spot(ctx, gA.X(returns), gA.Y(0), 3.5, negative, pal.bg2);
    }
    spot(ctx, gA.X(t), gA.Y(x), 5, primary, pal.bg2);
    spot(ctx, gB.X(t), gB.Y(v), 5, pal.orange, pal.bg2);

    /* 两块面板各留一行小注，说明这条线在看什么 */
    label(ctx, '切线斜率 = 瞬时速度 v', rA.x + rA.w - 12, rA.y + 15, pal.green, 'right', 12);
    label(ctx, '斜率 = 加速度 a', rB.x + rB.w - 12, rB.y + 15, pal.orange, 'right', 12);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['位移 x', fmt(x, 2) + ' m'],
      ['路程 s', fmt(distance, 2) + ' m'],
      ['速度 v', fmt(v, 2) + ' m/s'],
      ['平均速度 x/t', t > 1e-6 ? fmt(x / t, 2) + ' m/s' : '—'],
      ['加速度 a', fmt(a, 2) + ' m/s²'],
      ['Δv/Δt', t > 0.12 ? fmt(slope, 2) : '—'],
    ]);
  }

  function fillArea(ctx, g, start, end, vStart, vEnd, positive, negative) {
    const meanVelocity = (vStart + vEnd) / 2;
    if (end - start < 0.004 || Math.abs(meanVelocity) < 1e-9) return;
    const color = meanVelocity < 0 ? negative : positive;
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(g.X(start), g.Y(0));
    ctx.lineTo(g.X(start), g.Y(vStart));
    ctx.lineTo(g.X(end), g.Y(vEnd));
    ctx.lineTo(g.X(end), g.Y(0));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    if (g.X(end) - g.X(start) > 32 && Math.abs(g.Y(meanVelocity) - g.Y(0)) > 19) {
      label(ctx, meanVelocity < 0 ? '−' : '+', g.X((start + end) / 2),
        g.Y(meanVelocity / 2) + 4, color, 'center', 15);
    }
  }

  return { frame, reset, seek };
}
