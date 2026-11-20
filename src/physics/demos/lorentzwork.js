/* 电10b 洛伦兹力不做功，安培力却做功。
   导体棒横放在两根竖直导轨之间，电流由左向右，磁场垂直纸面向里，
   安培力 F = BIL 沿导轨向上，棒以速率 v杆 匀速上移。
   棒里的载流子（取正电荷）一边沿棒向右漂移、一边被棒带着向上走，
   真实速度是对角线方向的 v = v漂 + v杆。
   洛伦兹力 F洛 = qv×B 始终与 v 垂直：沿导线的分量逆着电流（qv杆B），
   垂直导线的分量顺着运动方向（qv漂B）。前者的功率 −qv杆B·v漂 由电源补上，
   后者的功率 +qv漂B·v杆 正是安培力做的功，两者逐项相等、符号相反，
   总功恒为零——机械能与电能经由这两支互相转移，洛伦兹力本身不改变总能量。 */
import { label, clamp, fmt, arrow } from '../gfx.js';

const TAU = Math.PI * 2;

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const p = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const B = clamp(fn(p.B, 0.5), 0.1, 1.5);
    const I = clamp(fn(p.I, 2), 0.5, 6);
    const L = clamp(fn(p.L, 0.5), 0.2, 1.0);
    const vw = clamp(fn(p.v, 0.6), 0.1, 1.5);

    const key = [B, I, L, vw].join('|');
    if (key !== last) {
      last = key;
      T = 0;
    }
    if (dt > 0) T += dt;

    const F = B * I * L; // 安培力 F = BIL
    const emf = B * L * vw; // 感应电动势 ε = BLv杆

    ctx.clearRect(0, 0, w, h);

    /* ── 左：导轨与导体棒 ───────────────────────────── */
    const xa = w * 0.12;
    const xb = w * 0.42;
    const yT = h * 0.15;
    const yB = h * 0.85;
    const cxr = (xa + xb) / 2;
    const yLow = yB - h * 0.05;
    const yHigh = yT + h * 0.14;
    const span = Math.max(yLow - yHigh, 8);

    // 磁场：叉号，垂直纸面向里
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.3;
    ctx.globalAlpha = 0.42;
    for (let yy = yT + 12; yy < yB - 6; yy += 30) {
      for (let xx = xa + 16; xx < xb - 6; xx += 30) {
        ctx.beginPath();
        ctx.moveTo(xx - 3, yy - 3);
        ctx.lineTo(xx + 3, yy + 3);
        ctx.moveTo(xx + 3, yy - 3);
        ctx.lineTo(xx - 3, yy + 3);
        ctx.stroke();
      }
    }
    ctx.restore();
    label(ctx, `B = ${fmt(B, 2)} T，垂直纸面向里`, xa - 8, yT - 12, pal.mut, 'left', 13);

    // 导轨
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(xa, yT);
    ctx.lineTo(xa, yB);
    ctx.moveTo(xb, yT);
    ctx.lineTo(xb, yB);
    ctx.stroke();
    ctx.restore();

    // 棒：向上匀速移动，走到顶再从底下重新出来
    const SPDy = clamp(26 + 52 * vw, 30, 105);
    const yRod = yLow - ((T * SPDy) % span);
    const Wspan = xb - xa;

    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(xa - 8, yRod);
    ctx.lineTo(xb + 8, yRod);
    ctx.stroke();
    ctx.restore();

    // 棒里的载流子：沿棒向右漂，速率随 I 变
    const SPDd = clamp(24 + 7.5 * I, 26, 70);
    const xc = xa + ((T * SPDd) % Wspan);
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.globalAlpha = 0.9;
    for (let k = -6; k <= 6; k++) {
      const xx = xc + k * 34;
      if (xx < xa + 2 || xx > xb - 2) continue;
      ctx.beginPath();
      ctx.arc(xx, yRod, 2.8, 0, TAU);
      ctx.fill();
    }
    ctx.restore();

    // 电流方向：棒上两枚小箭头
    for (const f of [0.3, 0.7]) {
      const xx = xa + Wspan * f;
      arrow(ctx, xx - 9, yRod - 16, xx + 9, yRod - 16, pal.orange, 2.2);
    }
    label(ctx, 'I', xa - 16, yRod - 16, pal.orange, 'right', 14);

    // 安培力（青，向上）与棒的速率（蓝，向上）
    const LF = clamp(18 + 20 * F, 18, h * 0.12);
    const LV = clamp(h * 0.055 + 10, 16, h * 0.11);
    arrow(ctx, cxr - 34, yRod - 6, cxr - 34, yRod - 6 - LF, pal.cyan, 2.8);
    label(ctx, 'F安', cxr - 44, yRod - 6 - LF * 0.55, pal.cyan, 'right', 14);
    arrow(ctx, cxr + 34, yRod - 6, cxr + 34, yRod - 6 - LV, pal.blue, 2.6);
    label(ctx, 'v杆', cxr + 44, yRod - 6 - LV * 0.55, pal.blue, 'left', 14);

    label(ctx, '橙点沿棒向右漂，棒整体同时上移', xa - 8, yB + 22, pal.ink, 'left', 13);
    label(ctx, '两者的合成速度见右栏', xa - 8, yB + 42, pal.faint, 'left', 13);

    /* ── 右：速度的合成、洛伦兹力的分解 ─────────────── */
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w * 0.52, h * 0.1);
    ctx.lineTo(w * 0.52, h * 0.92);
    ctx.stroke();
    ctx.restore();

    const rx = w * 0.56;
    const rw = w * 0.42;
    const top = h * 0.095;
    const bot = h * 0.95;
    const blk = (bot - top) / 2;
    const A = Math.min(rw * 0.155, h * 0.112);
    const ox = rx + rw * 0.2;
    const oy1 = top + h * 0.02 + A + h * 0.045;
    const oy2 = top + blk + h * 0.02 + A + h * 0.045;

    // 第一块：v = v漂 + v杆
    label(ctx, '载流子的速度', rx, top + h * 0.02, pal.ink, 'left', 15);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(ox + A, oy1);
    ctx.lineTo(ox + A, oy1 - A);
    ctx.moveTo(ox, oy1 - A);
    ctx.lineTo(ox + A, oy1 - A);
    ctx.stroke();
    ctx.restore();
    arrow(ctx, ox, oy1, ox + A, oy1, pal.orange, 2.2);
    arrow(ctx, ox, oy1, ox, oy1 - A, pal.blue, 2.2);
    arrow(ctx, ox, oy1, ox + A, oy1 - A, pal.green, 2.8);
    label(ctx, 'v漂', ox + A * 0.5, oy1 + 17, pal.orange, 'center', 13);
    label(ctx, 'v杆', ox - 12, oy1 - A * 0.5, pal.blue, 'right', 13);
    label(ctx, 'v', ox + A + 10, oy1 - A - 2, pal.green, 'left', 14);
    label(ctx, 'v = v漂 + v杆，方向朝右上', rx, oy1 + A + h * 0.035, pal.faint, 'left', 13);

    // 第二块：F洛 的两个分量
    label(ctx, '洛伦兹力的两个分量', rx, top + blk + h * 0.02, pal.ink, 'left', 15);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(ox, oy2 - A);
    ctx.lineTo(ox - A, oy2 - A);
    ctx.moveTo(ox - A, oy2);
    ctx.lineTo(ox - A, oy2 - A);
    ctx.stroke();
    ctx.restore();
    arrow(ctx, ox, oy2, ox, oy2 - A, pal.cyan, 2.6);
    arrow(ctx, ox, oy2, ox - A, oy2, pal.pink, 2.6);
    arrow(ctx, ox, oy2, ox - A, oy2 - A, pal.purple, 2.8);
    label(ctx, 'F⊥', ox + 12, oy2 - A * 0.55, pal.cyan, 'left', 13);
    label(ctx, 'F∥', ox - A * 0.55, oy2 + 17, pal.pink, 'center', 13);
    label(ctx, 'F洛', ox - A * 0.52 + 14, oy2 - A * 0.52 - 8, pal.purple, 'left', 13);
    label(ctx, '横向分量就是安培力，做正功', rx, oy2 + A + h * 0.03, pal.faint, 'left', 13);
    label(ctx, '纵向分量逆着电流，做负功', rx, oy2 + A + h * 0.03 + 20, pal.faint, 'left', 13);
    if (h > 430) {
      label(ctx, '两项功率相等、符号相反，合计为零', rx, oy2 + A + h * 0.03 + 40, pal.purple, 'left', 13);
    }

    st.readout([
      ['磁感应强度 B', fmt(B, 2) + ' T'],
      ['电流 I', fmt(I, 1) + ' A'],
      ['棒长 L', fmt(L, 2) + ' m'],
      ['棒的速率 v杆', fmt(vw, 2) + ' m/s'],
      ['安培力 F = BIL', fmt(F, 2) + ' N'],
      ['安培力做功的功率 F·v杆', fmt(F * vw, 2) + ' W'],
      ['感应电动势 ε = BLv杆', fmt(emf, 2) + ' V'],
      ['电源多供的功率 εI', fmt(emf * I, 2) + ' W'],
      ['洛伦兹力做的功', '恒为零'],
    ]);
  }

  return { frame };
}
