/* 实7 伏安法测电阻：待测电阻与两个电表的内阻都定下来，两种接法各有系统误差的去处。
   内接时电压表跨在电流表与 Rₓ 上，测得的 R = Rₓ + R_A（偏大）；
   外接时电压表只跨在 Rₓ 上，电流表多读了一路表分流，R = RₓR_V/(Rₓ + R_V)（偏小）。
   右栏把两条相对误差曲线画在一起，交点就是临界电阻 √(R_A·R_V)。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

const RMAX = 500;
const EMAX = 0.3;

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const Rx = clamp(fn(q.Rx, 50), 5, RMAX);
    const RA = clamp(fn(q.RA, 1), 0.2, 5);
    const RV = clamp(fn(q.RV, 5), 1, 20) * 1000;
    const mode = q.mode === 'outer' ? 'outer' : 'inner';

    const key = [Rx, RA, RV, mode].join(',');
    if (key !== last) { last = key; T = 0; }
    T = dt > 0 ? T + dt : T;

    ctx.clearRect(0, 0, w, h);

    const rMeas = mode === 'inner' ? Rx + RA : (Rx * RV) / (RV + Rx);
    const eps = (rMeas - Rx) / Rx;
    const Rxc = Math.sqrt(RA * RV);

    // ———— 左栏：电路 ————
    const xL = w * 0.13, xR = w * 0.40;
    const yT = h * 0.20, yB = h * 0.60, yM = h * 0.40;
    const yBat = yM;
    const rA = clamp(w * 0.016, 11, 15);

    // 回路导线
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(xL, yBat - 10);
    ctx.lineTo(xL, yT);
    ctx.lineTo(xR, yT);
    ctx.lineTo(xR, yB);
    ctx.lineTo(xL, yB);
    ctx.lineTo(xL, yBat + 10);
    ctx.stroke();
    ctx.restore();

    // 电源（左竖线上，长板为正、在上）
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
    ctx.restore();
    label(ctx, '＋', xL - 19, yBat - 6, pal.mut, 'right', 11);
    label(ctx, '电源', xL - 6, yBat + 30, pal.mut, 'right', 12);

    // 电流表（顶导线）
    const xA = xL + 0.42 * (xR - xL);
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

    // 待测电阻（右竖线上，yT 与 yM 之间）
    const yRx = (yT + yM) / 2;
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(xR - 11, yRx - 16, 22, 32, 4);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, 'Rₓ', xR + 17, yRx - 2, pal.ink, 'left', 13);
    label(ctx, `${fmt(Rx, 0)} Ω`, xR + 17, yRx + 16, pal.mut, 'left', 12);

    // 电压表的两个接点：内接取在 A 左侧，外接取在 A 右侧
    const xTap = mode === 'inner' ? xL + 0.20 * (xR - xL) : xL + 0.62 * (xR - xL);
    const xVm = (xTap + xR) / 2;

    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(xTap, yT);
    ctx.lineTo(xTap, yM);
    ctx.lineTo(xVm - rA, yM);
    ctx.moveTo(xVm + rA, yM);
    ctx.lineTo(xR, yM);
    ctx.stroke();
    ctx.restore();
    for (const p of [[xTap, yT], [xR, yM]]) {
      ctx.save();
      ctx.fillStyle = pal.cyan;
      ctx.beginPath();
      ctx.arc(p[0], p[1], 3.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(xVm, yM, rA, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, 'V', xVm, yM + 5, pal.cyan, 'center', 13);

    // 电流方向（底导线上）
    arrow(ctx, xR - 34, yB, xR - 76, yB, pal.orange, 2);
    label(ctx, 'I', xR - 55, yB - 12, pal.orange, 'center', 12);

    // 接法说明
    label(ctx, mode === 'inner' ? '电压表跨在 A 与 Rₓ 上' : '电压表只跨在 Rₓ 上', xL, yB + 36, pal.mut, 'left', 12);
    label(ctx, mode === 'inner' ? 'U 含电流表的分压，I 是真的' : 'U 是真的，I 含电压表的分流', xL, yB + 56, pal.mut, 'left', 12);

    // ———— 右栏：两条相对误差曲线 ————
    const rect = { x: w * 0.60, y: h * 0.18, w: w * 0.36, h: h * 0.62 };
    const g = panel(ctx, rect, [0, RMAX], [0, EMAX], pal, { xlab: 'Rₓ / Ω', ylab: '相对误差', nx: 5, ny: 6 });

    const x0 = Math.max(2, RA / EMAX);
    const pin = [], pout = [];
    const N = 140;
    for (let i = 0; i <= N; i++) {
      const x = x0 + ((RMAX - x0) * i) / N;
      if (x > RMAX) break;
      pin.push([x, RA / x]);
    }
    for (let i = 0; i <= N; i++) {
      const x = (RMAX * i) / N;
      pout.push([x, x / (RV + x)]);
    }
    poly(ctx, g.X, g.Y, pin, pal.orange, 1.8);
    poly(ctx, g.X, g.Y, pout, pal.blue, 1.8, [6, 4]);

    label(ctx, '橙：内接 R_A/Rₓ', rect.x + rect.w - 10, rect.y + 38, pal.orange, 'right', 12);
    label(ctx, '蓝：外接 Rₓ/R_V', rect.x + rect.w - 10, rect.y + 56, pal.blue, 'right', 12);

    // 临界电阻
    if (Rxc > 6 && Rxc < RMAX - 6) {
      const cx = g.X(Rxc);
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, g.Y(0));
      ctx.lineTo(cx, g.Y(Math.min(RA / Rxc, EMAX)));
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.fillStyle = pal.purple;
      ctx.beginPath();
      ctx.arc(cx, g.Y(RA / Rxc), 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      label(ctx, `√(R_A R_V) = ${fmt(Rxc, 0)} Ω`, cx + 8, rect.y + rect.h - 18, pal.purple, 'left', 12);
    }

    // 当前 Rₓ
    const mx = g.X(Rx);
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(mx, g.Y(0));
    ctx.lineTo(mx, g.Y(EMAX));
    ctx.stroke();
    ctx.restore();
    const yIn = RA / Rx;
    if (yIn <= EMAX) {
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.beginPath();
      ctx.arc(mx, g.Y(yIn), 3.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.beginPath();
    ctx.arc(mx, g.Y(Rx / (RV + Rx)), 3.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    let judge;
    if (Math.abs(eps) < 0.01) judge = '偏差不到 1%，两种接法都可用';
    else if (mode === 'inner') judge = '测量值偏大，Rₓ 大于临界值，宜用内接';
    else judge = '测量值偏小，Rₓ 小于临界值，宜用外接';

    st.readout([
      ['待测电阻 Rₓ', fmt(Rx, 0) + ' Ω'],
      ['电流表内阻 R_A', fmt(RA, 1) + ' Ω'],
      ['电压表内阻 R_V', fmt(RV / 1000, 1) + ' kΩ'],
      ['当前接法', mode === 'inner' ? '电流表内接' : '电流表外接'],
      ['测量值 R = U/I', fmt(rMeas, 2) + ' Ω'],
      ['相对误差', (eps >= 0 ? '+' : '') + fmt(eps * 100, 2) + ' %'],
      ['临界电阻 √(R_A R_V)', fmt(Rxc, 0) + ' Ω'],
      ['判读', judge],
    ]);
  }

  return { frame };
}
