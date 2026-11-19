/* 演示：动量守恒与碰撞。
   两块小车在光滑水平轨道上迎面（或一静一动）相碰，碰后按恢复系数 e 分开。
   下方是一条动量轴，分「碰前」「碰后」两行：蓝色是 A 的动量、橙色是 B 的动量，
   两个点各走各的，绿色的总动量却钉在原地不动；最下面两根条对比碰前与碰后的动能。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';

export function create(st) {
  let last = '';
  let t = 0;
  let hold = 0;
  const reset = () => { t = 0; hold = 0; };

  const ring = (ctx, x, y, r, color, pal) => {
    ctx.save();
    ctx.fillStyle = pal.bg2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  };

  function frame(dt) {
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode || 'elastic';
    const m1 = clamp(nn(q.m1, 1), 0.5, 3);
    const m2 = clamp(nn(q.m2, 2), 0.5, 3);
    const v1 = clamp(nn(q.v1, 4), 2, 6);
    const v2 = clamp(nn(q.v2, 0), -1, 1);
    const e = mode === 'elastic' ? 1 : mode === 'inelastic' ? 0 : clamp(nn(q.e, 0.5), 0, 1);

    const M = m1 + m2;
    const P = m1 * v1 + m2 * v2;
    const u = v1 - v2;
    const v1a = (P - e * m2 * u) / M;
    const v2a = (P + e * m1 * u) / M;
    const Ek0 = 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2;
    const Ek1 = 0.5 * m1 * v1a * v1a + 0.5 * m2 * v2a * v2a;

    const key = [m1, m2, v1, v2, mode, e].join('|');
    if (key !== last) { last = key; reset(); }

    const w = st.w || 1;
    const h = st.h || 1;

    /* 长度都按画布现算：轨道占上一条，动量轴占下一条 */
    const sw = w;
    const wC = clamp(w * 0.062, 24, 46);
    const hC = wC * 0.62;

    /* 相碰点钉在画面正中：B 的起点由 A 的行程反推，撞完两边都还有地方走。
       尺子 k（每米多少像素）先按「撞击点居中」定一版，再压到「撞后不跑出画框」以内。 */
    const m0 = Math.max(16, w * 0.05);
    const xAm = w * 0.5 - wC / 2;            // 相碰那一瞬 A 的圆心
    const xBm = w * 0.5 + wC / 2;
    const xA0 = m0 + wC / 2;
    const gap0 = xAm - xA0;                  // A 从起点走到相碰点
    const xB0 = xA0 + wC + gap0 * (u / v1);  // 同同一时刻相碰 ⇔ 这个起点
    const roomL = xAm - (m0 + wC / 2);
    const roomR = (w - m0 - wC / 2) - xBm;
    const mv = Math.max(Math.abs(v1a), Math.abs(v2a), 0.4);
    const kRoom = Math.min(roomL, roomR) / (mv * 0.6);
    const k = Math.max(1e-3, Math.min(w * 0.20, (xB0 - xA0 - wC) / (u * 0.9), kRoom));
    const tc = (xB0 - xA0 - wC) / (u * k);

    /* 撞后走多久：任一辆逼近画框留边就收工 */
    let tAfter = 1.1;
    for (const va of [v1a, v2a]) {
      if (Math.abs(va) < 0.05) continue;
      const room = va > 0 ? roomR : roomL;
      tAfter = Math.min(tAfter, room / (Math.abs(va) * k));
    }
    tAfter = Math.max(0.3, tAfter);

    /* 让小车走出画面就收工重放 */
    const xAt = (x0, v, vv, tt) => (tt <= tc ? x0 + v * k * tt : x0 + v * k * tc + vv * k * (tt - tc));
    const tEnd = tc + tAfter;

    if (dt > 0) {
      if (t < tEnd) t = Math.min(tEnd, t + dt);
      else {
        hold += dt;
        if (hold > 0.85) reset();
      }
    }

    const collided = t >= tc;
    const xA = xAt(xA0, v1, v1a, t);
    const xB = xAt(xB0, v2, v2a, t);
    const vAa = collided ? v1a : v1;
    const vBa = collided ? v2a : v2;
    const p1 = m1 * v1, p2 = m2 * v2;
    const p1a = m1 * v1a, p2a = m2 * v2a;

    const ctx = st.ctx;
    const pal = st.pal;
    if (!st.w || !st.h) return;
    ctx.clearRect(0, 0, w, h);

    /* ── 轨道与两辆小车 ── */
    const gy = h * 0.31;
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(w * 0.03, gy);
    ctx.lineTo(w * 0.97, gy);
    ctx.stroke();
    ctx.restore();

    const cart = (x, m, v, color, name) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.20;
      ctx.beginPath();
      ctx.roundRect(x - wC / 2, gy - hC, wC, hC, 6);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x - wC / 2, gy - hC, wC, hC, 6);
      ctx.stroke();
      ctx.restore();
      label(ctx, name, x, gy - hC / 2, color, 'center', 13);
      label(ctx, fmt(m, 1) + ' kg', x, gy + 14, color, 'center', 13);
      const L = Math.min(sw * 0.13, 16 + Math.abs(v) * 9);
      if (Math.abs(v) > 0.05) {
        const dir = v > 0 ? 1 : -1;
        arrow(ctx, x, gy - hC - 16, x + dir * L, gy - hC - 16, color, 2.4);
        label(ctx, fmt(v, 2) + ' m/s', clamp(x + dir * L / 2, 46, sw - 46), gy - hC - 32, color, 'center', 13);
      } else {
        label(ctx, '0 m/s', x, gy - hC - 22, color, 'center', 13);
      }
    };
    cart(xA, m1, vAa, pal.blue, 'A');
    cart(xB, m2, vBa, pal.orange, 'B');

    if (collided && Math.abs(v1a - v2a) < 1e-6) {
      label(ctx, '碰后两者同速，一起运动', w / 2, gy + 34, pal.purple, 'center', 13);
    } else if (!collided) {
      label(ctx, '碰前', w * 0.5, h * 0.07, pal.mut, 'center', 13);
    } else {
      label(ctx, '碰后', w * 0.5, h * 0.07, pal.mut, 'center', 13);
    }

    /* ── 动量轴：碰前一行、碰后一行 ── */
    const px0 = w * 0.14;
    const pw = w * 0.76;
    const py = h * 0.44;
    const ph = h * 0.46;
    const yB = py + ph * 0.24;
    const yA = py + ph * 0.56;

    const vals = [p1, p2, p1a, p2a, P];
    const lo = Math.min(0, ...vals);
    const hi = Math.max(0, ...vals);
    const span = Math.max(0.6, hi - lo);
    const l0 = lo - span * 0.18;
    const l1 = hi + span * 0.18;
    const X = v => px0 + ((v - l0) / (l1 - l0)) * pw;

    label(ctx, '动量 p / (kg·m/s)', px0 + pw, py + 4, pal.mut, 'right', 13);

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(X(0), py + ph * 0.08);
    ctx.lineTo(X(0), py + ph * 0.74);
    ctx.stroke();
    ctx.restore();
    label(ctx, '0', X(0), py + ph * 0.74 + 12, pal.faint, 'center', 12);

    /* 两行各自的参考横线 */
    for (const y of [yB, yA]) {
      ctx.save();
      ctx.strokeStyle = pal.line;
      ctx.globalAlpha = 0.7;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px0, y);
      ctx.lineTo(px0 + pw, y);
      ctx.stroke();
      ctx.restore();
    }
    label(ctx, '碰前', px0 - 8, yB, pal.mut, 'right', 13);
    label(ctx, '碰后', px0 - 8, yA, pal.mut, 'right', 13);

    spot(ctx, X(p1), yB, 5, pal.blue, pal.bg2);
    spot(ctx, X(p2), yB, 5, pal.orange, pal.bg2);
    label(ctx, 'p₁', X(p1), yB - 14, pal.blue, 'center', 13);
    label(ctx, 'p₂', X(p2), yB - 14, pal.orange, 'center', 13);

    if (collided) {
      arrow(ctx, X(p1), yB + 8, X(p1a), yA - 10, pal.blue, 1.6);
      arrow(ctx, X(p2), yB + 8, X(p2a), yA - 10, pal.orange, 1.6);
      ring(ctx, X(p1a), yA, 5, pal.blue, pal);
      ring(ctx, X(p2a), yA, 5, pal.orange, pal);
      label(ctx, 'p₁′', X(p1a), yA + 15, pal.blue, 'center', 13);
      label(ctx, 'p₂′', X(p2a), yA + 15, pal.orange, 'center', 13);
    } else {
      label(ctx, '碰撞后各自改变，总动量不变', px0 + pw * 0.5, yA, pal.faint, 'center', 13);
    }

    /* 总动量：两行都钉在同一条竖线上 */
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(X(P), py + ph * 0.10);
    ctx.lineTo(X(P), py + ph * 0.70);
    ctx.stroke();
    ctx.restore();
    const tri = (x, y, down) => {
      ctx.save();
      ctx.fillStyle = pal.green;
      ctx.beginPath();
      ctx.moveTo(x, y + (down ? 6 : -6));
      ctx.lineTo(x - 5, y + (down ? -4 : 4));
      ctx.lineTo(x + 5, y + (down ? -4 : 4));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    tri(X(P), py + ph * 0.10, true);
    tri(X(P), py + ph * 0.70, false);
    const pRight = X(P) > px0 + pw * 0.62;
    label(ctx, 'P = ' + fmt(P, 2) + ' 不变', X(P) + (pRight ? -12 : 12), py + ph * 0.17,
      pal.green, pRight ? 'right' : 'left', 13);

    /* ── 碰前与碰后的动能 ── */
    const yE1 = py + ph * 0.84;
    const yE2 = py + ph * 0.95;
    const bw = pw * (Ek0 > 1e-6 ? clamp(Ek1 / Ek0, 0, 1) : 1);
    label(ctx, '碰前动能 ' + fmt(Ek0, 2) + ' J', px0 - 8, yE1, pal.mut, 'right', 13);
    label(ctx, '碰后动能 ' + fmt(Ek1, 2) + ' J', px0 - 8, yE2, pal.mut, 'right', 13);
    const bar = (y, len, color) => {
      ctx.save();
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.35;
      ctx.beginPath();
      ctx.roundRect(px0, y - 7, Math.max(2, len), 14, 4);
      ctx.fill();
      ctx.restore();
    };
    bar(yE1, pw, pal.blue);
    bar(yE2, bw, pal.green);
    if (Ek0 - Ek1 > 1e-6) {
      label(ctx, '损失 ' + fmt(Ek0 - Ek1, 2) + ' J', px0 + bw + 8, yE2, pal.pink, 'left', 13);
    }

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['A 的速度', fmt(vAa, 2) + ' m/s'],
      ['B 的速度', fmt(vBa, 2) + ' m/s'],
      ['总动量 P', fmt(P, 2) + ' kg·m/s'],
      ['动能 E', fmt(collided ? Ek1 : Ek0, 2) + ' J'],
      ['动能损失', fmt(collided ? Ek0 - Ek1 : 0, 2) + ' J'],
    ]);
  }

  return { frame, reset };
}
