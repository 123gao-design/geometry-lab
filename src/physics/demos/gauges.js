/* 实15 刻度尺、天平与电表：三种常见的「指针式」量具。
   刻度尺分度 1 mm，估读到 0.1 mm；天平的游码每小格 0.2 g；
   电流表 0.6 A 档分度 0.02 A，估读到 0.01 A。三档共一条规矩：
   先认清分度值，再读到分度值的下一位。 */
import { label, clamp, fmt } from '../gfx.js';

const WEIGHTS = [100, 50, 20, 20, 10, 5];

export function create(st) {
  const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);

  /* ———— 刻度尺 ———— */
  function ruler() {
    const { ctx, w, h, pal } = st;
    const x = clamp(fn(st.params.x, 4.87), 0.2, 9.6);
    const x0 = w * 0.20, x1 = w * 0.80;
    const sx = (x1 - x0) / 10;
    const X = cm => x0 + cm * sx;
    const yR = h * 0.52;

    label(ctx, '刻度尺：分度 1 mm，读数估读到 0.1 mm', x0, h * 0.16, pal.mut, 'left', 13);
    label(ctx, '两条刻线之间的空隙靠眼睛分成十份，末位因此是估计出来的', x0, h * 0.16 + 22, pal.faint, 'left', 12);

    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(x0 - 8, yR, x1 - x0 + 16, 52, 5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.2;
    for (let mm = 0; mm <= 100; mm++) {
      const px = Math.round(X(mm / 10)) + 0.5;
      const len = mm % 10 === 0 ? 26 : mm % 5 === 0 ? 19 : 13;
      ctx.beginPath();
      ctx.moveTo(px, yR + 6);
      ctx.lineTo(px, yR + 6 + len);
      ctx.stroke();
    }
    ctx.restore();
    for (let cm = 0; cm <= 10; cm++) {
      label(ctx, String(cm), X(cm), yR + 44, pal.mut, 'center', 12);
    }
    label(ctx, 'cm', X(10) + 16, yR + 44, pal.mut, 'left', 12);

    // 被测物的一端落在这里
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.roundRect(X(0.4), yR - 30, X(x) - X(0.4), 18, 4);
    ctx.fill();
    ctx.restore();
    if (X(x) - X(0.4) > 80) {
      label(ctx, '被测物', (X(0.4) + X(x)) / 2, yR - 21, pal.bg2, 'center', 12);
    }

    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(Math.round(X(x)) + 0.5, yR - 34);
    ctx.lineTo(Math.round(X(x)) + 0.5, yR + 60);
    ctx.stroke();
    ctx.restore();
    label(ctx, `读数 ${x.toFixed(2)} cm`, X(x), yR - 48, pal.purple, 'center', 14);

    label(ctx, '分度值 1 mm　→　估读一位到 0.1 mm　→　以 cm 记作两位小数', x0, h * 0.82, pal.faint, 'left', 13);

    st.readout([
      ['分度值', '1 mm'],
      ['估读到', '0.1 mm（即 0.01 cm）'],
      ['读数', x.toFixed(2) + ' cm'],
      ['换成毫米', (x * 10).toFixed(1) + ' mm'],
      ['读法', '先读整毫米，再把一格分成十份估读，末位是估出来的'],
    ]);
  }

  /* ———— 托盘天平 ———— */
  function balance() {
    const { ctx, w, h, pal } = st;
    const m = clamp(fn(st.params.m, 63.4), 0, 200);

    let rem = m, W = 0;
    const used = [];
    for (const wt of WEIGHTS) {
      if (wt <= rem + 1e-9) { used.push(wt); W += wt; rem -= wt; }
    }
    const rider = clamp(Math.round(rem / 0.2) * 0.2, 0, 5);
    const total = W + rider;

    const bx = w * 0.5, by = h * 0.34;
    const arm = Math.min(w * 0.26, 200);

    label(ctx, '托盘天平：砝码由大到小试放，余下的由游码补足', w * 0.20, h * 0.14, pal.mut, 'left', 13);
    label(ctx, '游码每小格 0.2 g，读数不再估读', w * 0.20, h * 0.14 + 22, pal.faint, 'left', 12);

    // 横梁与立柱
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(bx - arm, by);
    ctx.lineTo(bx + arm, by);
    ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx, by);
    ctx.lineTo(bx, by + 96);
    ctx.stroke();
    ctx.fillStyle = pal.mut;
    ctx.beginPath();
    ctx.moveTo(bx - 26, by + 104);
    ctx.lineTo(bx + 26, by + 104);
    ctx.lineTo(bx + 18, by + 96);
    ctx.lineTo(bx - 18, by + 96);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 两个托盘
    const panY = by + 58;
    for (const side of [-1, 1]) {
      const px = bx + side * arm;
      ctx.save();
      ctx.strokeStyle = pal.line;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(px, by);
      ctx.lineTo(px - 34, panY);
      ctx.moveTo(px, by);
      ctx.lineTo(px + 34, panY);
      ctx.stroke();
      ctx.fillStyle = pal.card;
      ctx.strokeStyle = pal.line;
      ctx.beginPath();
      ctx.ellipse(px, panY, 40, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // 左盘放被测物
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.roundRect(bx - arm - 26, panY - 26, 52, 20, 4);
    ctx.fill();
    ctx.restore();
    label(ctx, '被测物', bx - arm, panY - 44, pal.blue, 'center', 12);

    // 右盘放砝码：一行小方块
    ctx.save();
    for (let i = 0; i < used.length; i++) {
      const wx = bx + arm - (used.length - 1) * 11 + i * 22;
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.roundRect(wx - 9, panY - 26, 18, 20, 3);
      ctx.fill();
    }
    ctx.restore();
    label(ctx, used.length ? used.map(v => v + ' g').join(' + ') : '无砝码', bx + arm, panY - 44, pal.orange, 'center', 12);

    // 游码标尺（画在横梁下方，便于读数）
    const rx0 = bx - arm, rx1 = bx + arm;
    const yR = by + 150;
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(rx0, Math.round(yR) + 0.5);
    ctx.lineTo(rx1, Math.round(yR) + 0.5);
    ctx.stroke();
    for (let i = 0; i <= 25; i++) {
      const px = Math.round(rx0 + (rx1 - rx0) * i / 25) + 0.5;
      const len = i % 5 === 0 ? 12 : 7;
      ctx.beginPath();
      ctx.moveTo(px, yR);
      ctx.lineTo(px, yR + len);
      ctx.stroke();
    }
    ctx.restore();
    for (let i = 0; i <= 5; i++) {
      label(ctx, String(i), rx0 + (rx1 - rx0) * i / 5, yR + 26, pal.mut, 'center', 12);
    }
    label(ctx, 'g', rx1 + 12, yR + 26, pal.mut, 'left', 12);

    const rxp = rx0 + (rx1 - rx0) * rider / 5;
    ctx.save();
    ctx.fillStyle = pal.purple;
    ctx.beginPath();
    ctx.moveTo(rxp, yR - 2);
    ctx.lineTo(rxp - 6, yR - 16);
    ctx.lineTo(rxp + 6, yR - 16);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    label(ctx, `游码 ${rider.toFixed(1)} g`, rxp, yR - 30, pal.purple, 'center', 12);

    label(ctx, `砝码 ${W} g ＋ 游码 ${rider.toFixed(1)} g ＝ ${total.toFixed(1)} g`, w * 0.20, h * 0.88, pal.orange, 'left', 14);

    st.readout([
      ['砝码总质量', W + ' g'],
      ['游码读数', rider.toFixed(1) + ' g'],
      ['读数 = 砝码 + 游码', total.toFixed(1) + ' g'],
      ['被测质量（设定值）', m.toFixed(1) + ' g'],
      ['读法', '砝码由大到小试放到平衡，余下的由游码补足；游码每小格 0.2 g'],
    ]);
  }

  /* ———— 电流表 ———— */
  function meter() {
    const { ctx, w, h, pal } = st;
    const I = clamp(fn(st.params.I, 0.372), 0, 0.6);
    const Ir = Math.round(I / 0.01) * 0.01;

    const cx = w * 0.5, cy = h * 0.60;
    const R = Math.min(w * 0.22, h * 0.34);
    const a0 = Math.PI * 200 / 180, a1 = Math.PI * 340 / 180;
    const ang = v => a0 + (a1 - a0) * (v / 0.6);

    label(ctx, '电流表（0 – 0.6 A 量程）：先把分度值认下来', w * 0.20, h * 0.14, pal.mut, 'left', 13);
    label(ctx, '30 个小格对应 0.6 A，每格 0.02 A；读数估读到 0.01 A', w * 0.20, h * 0.14 + 22, pal.faint, 'left', 12);

    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, a0, a1);
    ctx.stroke();
    ctx.lineWidth = 1.2;
    for (let k = 0; k <= 30; k++) {
      const th = ang(k * 0.02);
      const len = k % 5 === 0 ? 16 : 9;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(th) * R, cy + Math.sin(th) * R);
      ctx.lineTo(cx + Math.cos(th) * (R - len), cy + Math.sin(th) * (R - len));
      ctx.stroke();
    }
    ctx.restore();

    for (let k = 0; k <= 30; k += 5) {
      const th = ang(k * 0.02);
      label(ctx, (k * 0.02).toFixed(1), cx + Math.cos(th) * (R + 18), cy + Math.sin(th) * (R + 18), pal.mut, 'center', 12);
    }

    const th = ang(Ir);
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(th) * (R - 22), cy + Math.sin(th) * (R - 22));
    ctx.stroke();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    label(ctx, `读数 ${Ir.toFixed(2)} A`, cx, cy - R * 0.34, pal.orange, 'center', 15);
    label(ctx, '分度 0.02 A　·　估读 0.01 A', cx, cy - R * 0.34 + 24, pal.faint, 'center', 12);

    st.readout([
      ['量程', '0 – 0.6 A'],
      ['分度值', '0.02 A'],
      ['读数', Ir.toFixed(2) + ' A'],
      ['指针位置（设定值）', I.toFixed(3) + ' A'],
      ['读法', '每一小格 0.02 A，估读到 0.01 A，末位是估出来的'],
    ]);
  }

  function frame(dt) {
    if (!st.w || !st.h) return;
    const q = st.params;
    const mode = q.mode === 'balance' || q.mode === 'meter' ? q.mode : 'ruler';
    st.ctx.clearRect(0, 0, st.w, st.h);
    if (mode === 'balance') balance();
    else if (mode === 'meter') meter();
    else ruler();
  }

  return { frame };
}
