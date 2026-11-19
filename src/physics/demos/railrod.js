/* 电14 导体棒与导轨模型。
   一根导体棒横放在两条平行导轨上，磁场垂直穿过导轨平面，右端接一只电阻。
   两档：
   ① 给初速度——棒以 v₀ 起跑，安培力始终与运动方向相反，v 按指数衰减到零，
      走过的总位移 v₀τ 有限，电流与安培力一起衰减；τ = mR/(B²L²)。
   ② 恒力拉动——外力 F 恒定，棒从静止起步，安培力随速度增大而增大，
      加速度逐渐减小，最后安培力与外力求平，速度达到收尾速度 v_t = FR/(B²L²)。
   两档的右栏都画 v–t 曲线，读数栏里 F_A、I、P 逐项列出，
   把「电磁感应 → 电流 → 安培力 → 运动」这条链子串成一眼看得见的样子。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';
import { flowPath } from './circuit.js';

const XW = 4;          // 导轨可见长度 m

export function create(st) {
  let T = 0;
  let last = '';
  let x = 0;
  let v = 0;
  let hold = 0;

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (vv, d) => (Number.isFinite(Number(vv)) ? Number(vv) : d);
    const mode = q.mode === 'force' ? 'force' : 'given';
    const B = clamp(fn(q.B, 1), 0.2, 2);
    const L = clamp(fn(q.L, 1), 0.5, 2);
    const mm = clamp(fn(q.m, 0.2), 0.1, 1);
    const R = clamp(fn(q.R, 2), 0.5, 10);
    const v0 = clamp(fn(q.v0, 3), 0.5, 5);
    const F = clamp(fn(q.F, 1.5), 0.2, 5);
    const key = [mode, B, L, mm, R, v0, F].join('|');
    if (key !== last) {
      last = key;
      T = 0;
      x = 0;
      v = mode === 'given' ? v0 : 0;
      hold = 0;
    }

    const kA = (B * B * L * L) / R;        // 安培力 / 速度
    const tau = mm / kA;                   // 时间常数
    const vt = F / kA;                     // 收尾速度（恒力档）

    if (dt > 0) {
      const step = clamp(dt, 1 / 240, 1 / 30);
      if (hold > 0) {
        hold -= step;
        if (hold <= 0) {
          T = 0;
          x = 0;
          v = mode === 'given' ? v0 : 0;
        }
      } else {
        T += step;
        const sub = 6;
        const hs = step / sub;
        for (let i = 0; i < sub; i++) {
          const a = mode === 'given' ? -kA * v / mm : (F - kA * v) / mm;
          v += a * hs;
          x += v * hs;
          if (mode === 'given' && v < 0) v = 0;
        }
        if (mode === 'given' && v < v0 * 0.02) hold = 0.9;
        if (mode === 'force' && x >= XW) hold = 0.9;
      }
    }

    ctx.clearRect(0, 0, w, h);

    /* ── 左栏：导轨、导体棒与电阻 ─────────────────── */
    const xL = w * 0.09;
    const xR = w * 0.54;
    const yT = h * 0.34;
    const yB = h * 0.66;
    const px = xL + clamp(x / XW, 0, 1) * (xR - xL);

    // 垂直纸面向里的磁场
    for (let xx = xL + 14; xx < xR; xx += 38) {
      for (let yy = yT - 44; yy <= yB + 44; yy += 38) {
        if (yy > yT - 8 && yy < yB + 8 && xx > xL + 6) continue;
        ctx.save();
        ctx.strokeStyle = pal.cyan;
        ctx.globalAlpha = 0.30;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(xx - 4, yy - 4);
        ctx.lineTo(xx + 4, yy + 4);
        ctx.moveTo(xx + 4, yy - 4);
        ctx.lineTo(xx - 4, yy + 4);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 导轨
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(xL, yT);
    ctx.lineTo(xR, yT);
    ctx.moveTo(xL, yB);
    ctx.lineTo(xR, yB);
    ctx.stroke();
    ctx.restore();

    // 左端电阻
    ctx.save();
    ctx.fillStyle = pal.bg2;
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.rect(xL - 10, (yT + yB) / 2 - 22, 20, 44);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, 'R', xL - 26, (yT + yB) / 2 - 2, pal.orange, 'right', 15);

    // 导体棒
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(px - 4, yT - 12, 8, yB - yT + 24);
    ctx.restore();
    label(ctx, 'L', px + 10, yT - 18, pal.blue, 'left', 15);

    // 电流：棒 → 上轨 → 电阻 → 下轨 → 棒
    const I = Math.abs((B * L * v) / R);
    if (I > 1e-3) {
      const spd = clamp(24 + I * 40, 20, 150);
      flowPath(ctx, [[px, yT], [xL, yT], [xL, yB], [px, yB]], pal.green, spd, T, 32, 2.5);
    }

    // 速度与安培力
    const vlen = clamp(v * 26, 0, 96);
    if (vlen > 6) arrow(ctx, px, yT + 22, px + vlen, yT + 22, pal.green, 2.6);
    const FA = kA * v;
    const flen = clamp(FA * 40, 0, 96);
    if (flen > 6) arrow(ctx, px + 3, yB - 22, px + 3 - flen, yB - 22, pal.orange, 2.6);

    label(ctx, mode === 'given' ? '初速度 v₀：安培力阻碍运动，速度逐渐衰减'
      : '恒力 F：安培力随速度增大，最后与外力求平', w * 0.09, h * 0.86,
      pal.faint, 'left', 14);

    /* ── 右栏：v–t 曲线 ──────────────────────────── */
    const rc = { x: w * 0.64, y: h * 0.16, w: w * 0.31, h: h * 0.60 };
    const TM = Math.max(4 * tau, 0.6);
    const vmax = mode === 'given' ? v0 : vt;
    const g = panel(ctx, rc, [0, TM], [0, vmax * 1.12], pal, { xlab: 't/s', ylab: 'v/(m·s⁻¹)', nx: 4, ny: 4 });
    const cur = [];
    for (let i = 0; i <= 80; i++) {
      const tt = (TM * i) / 80;
      cur.push([tt, mode === 'given' ? v0 * Math.exp(-tt / tau) : vt * (1 - Math.exp(-tt / tau))]);
    }
    poly(ctx, g.X, g.Y, cur, pal.blue, 2.4);
    if (mode === 'force') {
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(g.X(0), g.Y(vt));
      ctx.lineTo(g.X(TM), g.Y(vt));
      ctx.stroke();
      ctx.restore();
      label(ctx, '收尾速度', rc.x + rc.w - 8, g.Y(vt) - 8, pal.purple, 'right', 13);
    }
    spot(ctx, g.X(Math.min(T, TM)), g.Y(v), 5.5, pal.green, pal.bg2);

    const pEl = I * I * R;
    st.readout([
      ['磁感应强度 B', fmt(B, 2) + ' T'],
      ['导轨间距 L', fmt(L, 2) + ' m'],
      ['棒的质量 m', fmt(mm, 2) + ' kg'],
      ['回路电阻 R', fmt(R, 1) + ' Ω'],
      ['时间常数 τ = mR/(B²L²)', fmt(tau, 2) + ' s'],
      ['时刻 t', fmt(T, 2) + ' s'],
      ['速度 v', fmt(v, 2) + ' m/s'],
      ['位移 x', fmt(x, 2) + ' m'],
      ['感应电动势 E = BLv', fmt(B * L * v, 2) + ' V'],
      ['感应电流 I = E/R', fmt(I, 2) + ' A'],
      ['安培力 F_A = BIL', fmt(FA, 2) + ' N'],
      ['电功率 P = I²R', fmt(pEl, 2) + ' W'],
      ['加速度 a', fmt(mode === 'given' ? -FA / mm : (F - FA) / mm, 2) + ' m/s²'],
      [mode === 'given' ? '总位移 v₀τ' : '收尾速度 FR/(B²L²)',
        mode === 'given' ? fmt(v0 * tau, 2) + ' m' : fmt(vt, 2) + ' m/s'],
    ]);
  }

  return { frame };
}
