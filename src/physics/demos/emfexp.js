/* 实8 测电源电动势与内阻：改变外电阻取若干组路端电压与电流，
   图线 U = ε − Ir 是一条直线——纵截距给电动势，斜率给内阻的负值。
   左栏画电路（电压表跨在电源两端，读的就是路端电压），右栏画 U–I 图。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

export function create(st) {
  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const emf = clamp(fn(q.emf, 3), 1.5, 12);
    const r = clamp(fn(q.r, 1.5), 0.5, 5);
    const R = clamp(fn(q.R, 4), 1, 20);

    ctx.clearRect(0, 0, w, h);

    const I = emf / (R + r);
    const U = emf - I * r;

    // ———— 左栏：电路 ————
    const xL = w * 0.22, xR = w * 0.46;
    const yT = h * 0.20, yB = h * 0.60;
    const yBat = (yT + yB) / 2;
    const rA = clamp(w * 0.016, 11, 15);

    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(xL, yBat - 22);
    ctx.lineTo(xL, yT);
    ctx.lineTo(xR, yT);
    ctx.lineTo(xR, yB);
    ctx.lineTo(xL, yB);
    ctx.lineTo(xL, yBat + 22);
    ctx.stroke();
    ctx.restore();

    // 电源与内阻
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(xL - 13, yBat - 6);
    ctx.lineTo(xL + 13, yBat - 6);
    ctx.stroke();
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(xL - 7, yBat + 6);
    ctx.lineTo(xL + 7, yBat + 6);
    ctx.stroke();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.roundRect(xL - 24, yBat - 18, 48, 36, 6);
    ctx.stroke();
    ctx.restore();
    label(ctx, '＋', xL + 19, yBat - 6, pal.mut, 'left', 11);
    label(ctx, `ε = ${fmt(emf, 2)} V`, xL, yBat + 40, pal.ink, 'center', 12);
    label(ctx, `r = ${fmt(r, 2)} Ω`, xL - 30, yBat + 40, pal.purple, 'right', 12);

    // 电流表（顶导线）
    const xA = xL + 0.45 * (xR - xL);
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xA, yT, rA, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, 'A', xA, yT + 5, pal.ink, 'center', 13);

    // 滑动变阻器（右竖线上）
    const yRh = (yT + yB) / 2;
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(xR - 11, yRh - 24, 22, 48, 4);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    arrow(ctx, xR - 24, yRh + 30, xR + 24, yRh - 30, pal.mut, 1.8);
    label(ctx, `R = ${fmt(R, 1)} Ω`, xR + 18, yRh + 4, pal.mut, 'left', 12);

    // 电压表跨在电源两端（画在回路外侧）
    const xVm = w * 0.09;
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(xL, yBat - 22);
    ctx.lineTo(xVm, yBat - 22);
    ctx.lineTo(xVm, yBat - rA);
    ctx.moveTo(xVm, yBat + rA);
    ctx.lineTo(xVm, yBat + 22);
    ctx.lineTo(xL, yBat + 22);
    ctx.stroke();
    ctx.restore();
    for (const py of [yBat - 22, yBat + 22]) {
      ctx.save();
      ctx.fillStyle = pal.cyan;
      ctx.beginPath();
      ctx.arc(xL, py, 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xVm, yBat, rA, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, 'V', xVm, yBat + 5, pal.cyan, 'center', 13);
    label(ctx, '路端电压 U', xVm, yBat + 44, pal.cyan, 'center', 12);

    // 电流方向
    arrow(ctx, xL + 34, yB, xL + 76, yB, pal.orange, 2);
    label(ctx, `I = ${fmt(I, 2)} A`, xL + 55, yB + 22, pal.orange, 'center', 12);

    // ———— 右栏：U–I 图 ————
    const rect = { x: w * 0.60, y: h * 0.18, w: w * 0.36, h: h * 0.62 };
    const iMax = (emf / r) * 1.12;
    const g = panel(ctx, rect, [0, iMax], [0, emf * 1.12], pal, { xlab: 'I / A', ylab: 'U / V', nx: 4, ny: 4 });

    poly(ctx, g.X, g.Y, [[0, emf], [emf / r, 0]], pal.green, 1.8, [6, 4]);

    // 若干测点（外电阻取不同值）
    const Rs = [1.5, 2.5, 3.5, 5, 7, 10, 15];
    Rs.forEach((Rv, i) => {
      const Ii = emf / (Rv + r);
      const Ui = emf - Ii * r;
      const j = 1 + 0.012 * Math.sin(i * 3.1 + 1);
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(g.X(Ii), g.Y(Ui * j), 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // 当前工作点
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(g.X(I), g.Y(U), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 截距与斜率
    ctx.save();
    ctx.fillStyle = pal.green;
    ctx.beginPath();
    ctx.arc(g.X(0), g.Y(emf), 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(g.X(emf / r), g.Y(0), 3.6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    label(ctx, `纵截距 = ε = ${fmt(emf, 2)} V`, g.X(0) + 10, g.Y(emf) + 20, pal.green, 'left', 12);
    label(ctx, `斜率 = −r = −${fmt(r, 2)} Ω`, rect.x + 8, rect.y + rect.h - 16, pal.purple, 'left', 12);
    label(ctx, 'ε/r', g.X(emf / r) - 7, g.Y(0) - 9, pal.green, 'right', 12);

    st.readout([
      ['电动势 ε', fmt(emf, 2) + ' V'],
      ['内阻 r', fmt(r, 2) + ' Ω'],
      ['外电阻 R', fmt(R, 1) + ' Ω'],
      ['电流 I = ε/(R+r)', fmt(I, 3) + ' A'],
      ['路端电压 U = ε − Ir', fmt(U, 2) + ' V'],
      ['U/I', fmt(U / I, 2) + ' Ω'],
      ['(ε−U)/I', fmt((emf - U) / I, 2) + ' Ω'],
      ['判读', '图线过 (0, ε)，斜率给 −r'],
    ]);
  }

  return { frame };
}
