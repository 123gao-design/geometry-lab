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

  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const v0 = clamp(Number(p.v0) || 0, -8, 8);
    const a = clamp(Number(p.a) || 0, -6, 6);
    const key = v0 + '|' + a;
    if (key !== last) { last = key; reset(); }

    if (dt > 0) {
      t += dt;
      if (t > TEND) t = 0;
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const v = v0 + a * t;
    const x = v0 * t + 0.5 * a * t * t;

    /* ── 两块面板：上 x-t、下 v-t，横轴共用同一段 [0, XMAX] ── */
    const padL = 62;
    const padR = 34;
    const gap = 30;
    const pw = Math.max(160, w - padL - padR);
    const ph = Math.max(78, (h - 16 - 22 - gap) / 2);
    const rA = { x: padL, y: 16, w: pw, h: ph };
    const rB = { x: padL, y: 16 + ph + gap, w: pw, h: ph };
    const xr = [0, XMAX];

    /* 取景：抛物线的两端与顶点都留在框里，a 变号也不会画到框外 */
    const xEnd = v0 * XMAX + 0.5 * a * XMAX * XMAX;
    const xCand = [0, xEnd];
    const tv = a < 0 ? -v0 / a : -1;
    if (tv > 0 && tv < XMAX) xCand.push(v0 * tv + 0.5 * a * tv * tv);
    let xlo = Math.min(...xCand);
    let xhi = Math.max(...xCand);
    const xpad = Math.max((xhi - xlo) * 0.14, 0.4);
    xlo -= xpad;
    xhi += xpad;

    const vEnd = v0 + a * XMAX;
    let vlo = Math.min(0, v0, vEnd);
    let vhi = Math.max(0, v0, vEnd);
    const vpad = Math.max((vhi - vlo) * 0.16, 0.4);
    vlo -= vpad;
    vhi += vpad;

    const gA = panel(ctx, rA, xr, [xlo, xhi], pal, { xlab: 't / s', ylab: 'x / m', nx: 6, ny: 4 });
    const gB = panel(ctx, rB, xr, [vlo, vhi], pal, { xlab: 't / s', ylab: 'v / (m/s)', nx: 6, ny: 4 });

    /* ── 上图：x-t 曲线，切线斜率 = 瞬时速度 ── */
    const curve = [];
    for (let i = 0; i <= 120; i++) {
      const u = (i / 120) * XMAX;
      curve.push([u, v0 * u + 0.5 * a * u * u]);
    }
    poly(ctx, gA.X, gA.Y, curve, pal.blue, 2.4);

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
    if (t > 0.004) {
      fillSigned(ctx, gB, u => v0 + a * u, t, pal.blue, 0.18);
      /* 面积够宽才标字，起跑那头太窄，文字会溢到框外 */
      if (gB.X(t) - gB.X(0) > 96) {
        label(
          ctx,
          '面积 = 位移',
          (gB.X(0) + gB.X(t)) / 2,
          clamp(gB.Y((v0 + v) / 2) + 2, rB.y + 12, rB.y + rB.h - 10),
          pal.blue,
          'center',
          13,
        );
      }
    }

    /* 整条 v-t 直线：右端用 v = v0 + at 的准确值，
       与阴影的上沿同一条线，不会再各走各的 */
    poly(ctx, gB.X, gB.Y, [[0, v0], [XMAX, vEnd]], pal.blue, 2.4);

    /* 斜率三角形：取紧挨着当前时刻的一小段，整块落在蓝色区域里 */
    let slope = a;
    if (t > 0.12) {
      const hs = Math.min(HS, t);
      const t1 = t - hs;
      const v1 = v0 + a * t1;
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

    spot(ctx, gA.X(t), gA.Y(x), 5, pal.blue, pal.bg2);
    spot(ctx, gB.X(t), gB.Y(v), 5, pal.orange, pal.bg2);

    /* 两块面板各留一行小注，说明这条线在看什么 */
    label(ctx, '切线斜率 = 瞬时速度 v', rA.x + rA.w - 12, rA.y + 15, pal.green, 'right', 12);
    label(ctx, '斜率 = 加速度 a', rB.x + rB.w - 12, rB.y + 15, pal.orange, 'right', 12);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['位移 x', fmt(x, 2) + ' m'],
      ['速度 v', fmt(v, 2) + ' m/s'],
      ['平均速度 x/t', t > 1e-6 ? fmt(x / t, 2) + ' m/s' : '—'],
      ['加速度 a', fmt(a, 2) + ' m/s²'],
      ['Δv/Δt', t > 0.12 ? fmt(slope, 2) : '—'],
    ]);
  }

  /** 把图线与时间轴之间的有向面积分块填出来：跨过时间轴时分上下两块各自闭合，
      负面积不会把正面积抵掉（一块多边形自己绕回去会画成蝴蝶结） */
  function fillSigned(ctx, g, f, tEnd, color, alpha) {
    const N = 48;
    let run = [[0, f(0)]];
    let prev = run[0];
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = color;
    const flush = () => {
      if (run.length > 1) {
        ctx.beginPath();
        ctx.moveTo(g.X(run[0][0]), g.Y(0));
        for (const q of run) ctx.lineTo(g.X(q[0]), g.Y(q[1]));
        ctx.lineTo(g.X(run[run.length - 1][0]), g.Y(0));
        ctx.closePath();
        ctx.fill();
      }
      run = [];
    };
    for (let i = 1; i <= N; i++) {
      const u = (i / N) * tEnd;
      const y = f(u);
      if (prev[1] * y < 0) {
        const tc = prev[0] + ((u - prev[0]) * (0 - prev[1])) / (y - prev[1]);
        run.push([tc, 0]);
        flush();
        run = [[tc, 0], [u, y]];
      } else {
        run.push([u, y]);
      }
      prev = [u, y];
    }
    flush();
    ctx.restore();
  }

  return { frame, reset };
}
