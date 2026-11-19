/* 实14 螺旋测微器：螺距 0.5 mm，微分筒一周 50 格，每格 0.5/50 = 0.01 mm。
   读数 = 固定刻度露出的一半毫米数 + 微分筒与基准线对齐的格数 × 0.01 mm，
   末位再估读一位，所以写到小数点后三位。 */
import { label, arrow, clamp, fmt } from '../gfx.js';

export function create(st) {
  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);

    const L0 = clamp(fn(q.L, 2.473), 0, 5);

    let a = Math.floor(L0 / 0.5 + 1e-9) * 0.5;
    let t = Math.round((L0 - a) / 0.01);
    if (t >= 50) { t = 0; a += 0.5; }
    const R = a + t * 0.01;

    ctx.clearRect(0, 0, w, h);

    // ———— 左栏：固定刻度与微分筒 ————
    const x0 = w * 0.06, x1 = w * 0.52;
    const sx = (x1 - x0) / 5;
    const X = mm => x0 + mm * sx;
    const yS = h * 0.54;
    const yH = h * 0.085;
    const yA = Math.max(h * 0.20, yH + 64);

    label(ctx, '读数：固定刻度读到半毫米，再看微分筒对齐的那一格', x0, yH, pal.mut, 'left', 13);
    label(ctx, '微分筒每格 0.01 mm，末位再估读一位，结果写到千分位', x0, yH + 22, pal.faint, 'left', 12);

    // 测砧与测微螺杆
    ctx.save();
    ctx.fillStyle = pal.mut;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.roundRect(x0 - 16, yA - 26, 16, 52, 3);
    ctx.fill();
    ctx.beginPath();
    ctx.roundRect(X(R), yA - 26, 12, 52, 3);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(X(R) + 6, yA + 26);
    ctx.lineTo(X(R) + 6, yS);
    ctx.stroke();
    ctx.restore();

    if (X(R) - x0 > 18) {
      ctx.save();
      ctx.fillStyle = pal.blue;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.roundRect(x0, yA - 12, X(R) - x0, 24, 5);
      ctx.fill();
      ctx.restore();
    }
    // 两个零件的名字放在各自下方：上方那一带让给读数说明，右侧避开基准虚线与微分筒
    label(ctx, '测砧', x0 - 10, yA + 42, pal.mut, 'center', 12);
    label(ctx, '测微螺杆', X(R) + 18, yA + 42, pal.mut, 'left', 12);

    // 固定刻度：毫米刻线在上、半毫米刻线在下
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(x0 - 16, Math.round(yS) + 0.5);
    ctx.lineTo(X(R) + 2, Math.round(yS) + 0.5);
    ctx.stroke();
    for (let M = 0; M <= Math.floor(R + 1e-9); M++) {
      const px = Math.round(X(M)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, yS);
      ctx.lineTo(px, yS - 18);
      ctx.stroke();
    }
    for (let M = 0; M + 0.5 < R - 1e-9; M++) {
      const px = Math.round(X(M + 0.5)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, yS);
      ctx.lineTo(px, yS + 12);
      ctx.stroke();
    }
    ctx.restore();
    for (let M = 0; M <= Math.floor(R + 1e-9); M++) {
      label(ctx, String(M), X(M), yS - 30, pal.mut, 'center', 12);
    }

    // 微分筒：半高随画框收放，矮屏上不许顶到零件的名字
    const dx = X(R) + 4, dw = Math.min(40, w * 0.05);
    const drumHalf = Math.min(104, Math.max(36, yS - yA - 64));
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(dx, yS - drumHalf, dw, drumHalf * 2, 5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    const dy = 3.9;
    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.2;
    for (let j = t - 26; j <= t + 26; j++) {
      const idx = ((j % 50) + 50) % 50;
      const y = yS + (j - t) * dy;
      if (y < yS - drumHalf + 4 || y > yS + drumHalf - 4) continue;
      const len = idx % 5 === 0 ? 14 : 9;
      ctx.beginPath();
      ctx.moveTo(dx + dw, Math.round(y) + 0.5);
      ctx.lineTo(dx + dw - len, Math.round(y) + 0.5);
      ctx.stroke();
    }
    ctx.restore();
    for (let j = t - 26; j <= t + 26; j++) {
      const idx = ((j % 50) + 50) % 50;
      const y = yS + (j - t) * dy;
      if (y < yS - drumHalf + 12 || y > yS + drumHalf - 12) continue;
      if (idx % 5 !== 0) continue;
      label(ctx, String(idx), dx + 6, y, pal.blue, 'center', 11);
    }

    // 基准线：固定刻度上的那条横线延伸到微分筒上
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(dx + 2, Math.round(yS) + 0.5);
    ctx.lineTo(dx + dw + 6, Math.round(yS) + 0.5);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(Math.round(X(R) + 6) + 0.5, yA + 30);
    ctx.lineTo(Math.round(X(R) + 6) + 0.5, yS + 20);
    ctx.stroke();
    ctx.restore();

    label(ctx, '基准线', dx + dw + 12, yS - 12, pal.orange, 'left', 12);
    label(ctx, `固定刻度 ${a.toFixed(1)} mm`, x0, h * 0.78, pal.ink, 'left', 14);
    label(ctx, `微分筒 ${t} 格 × 0.01 mm`, x0, h * 0.78 + 24, pal.blue, 'left', 14);
    label(ctx, `读数 ${R.toFixed(3)} mm：末位是估读，结果写成三位小数`, x0, h * 0.78 + 48, pal.orange, 'left', 14);

    // ———— 右栏：螺距与微分筒的分格 ————
    const cx = w * 0.78, cy = h * 0.42, rx = 38, ry = 12, Hh = 68;
    label(ctx, '原理：转一圈前进 0.5 mm，一周 50 格', w * 0.64, yH, pal.mut, 'left', 13);

    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.ellipse(cx, cy - Hh, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(cx, cy + Hh, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - rx, cy - Hh);
    ctx.lineTo(cx - rx, cy + Hh);
    ctx.moveTo(cx + rx, cy - Hh);
    ctx.lineTo(cx + rx, cy + Hh);
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const u = i / 120;
      const th = u * Math.PI * 4;
      const px = cx + rx * Math.sin(th);
      const py = cy - Hh + 2 * Hh * u;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();

    // 前进量：0.5 mm
    const ax = cx + rx + 26;
    arrow(ctx, ax, cy - Hh, ax, cy - Hh + 24, pal.orange, 2);
    arrow(ctx, ax, cy + Hh, ax, cy + Hh - 24, pal.orange, 2);
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(ax - 6, cy - Hh + 4);
    ctx.lineTo(ax + 6, cy - Hh + 4);
    ctx.moveTo(ax - 6, cy + Hh - 4);
    ctx.lineTo(ax + 6, cy + Hh - 4);
    ctx.stroke();
    ctx.restore();
    label(ctx, '一圈 0.5 mm', ax + 10, cy - 8, pal.orange, 'left', 12);

    label(ctx, '测微螺杆转一圈，轴向前进 0.5 mm', w * 0.64, h * 0.76, pal.faint, 'left', 12);
    label(ctx, '微分筒分 50 格，每格 0.5 ÷ 50 = 0.01 mm', w * 0.64, h * 0.76 + 22, pal.faint, 'left', 12);
    label(ctx, '半个毫米刻线露出时应读到 xx.5 mm 之上', w * 0.64, h * 0.76 + 44, pal.faint, 'left', 12);

    st.readout([
      ['固定刻度（含 0.5 mm 刻线）', a.toFixed(1) + ' mm'],
      ['微分筒对齐格数 t', t + ' / 50'],
      ['读数 = a + t × 0.01', R.toFixed(2) + ' mm'],
      ['结果写到千分位', R.toFixed(3) + ' mm（末位估读）'],
      ['被测长度（设定值）', L0.toFixed(3) + ' mm'],
      ['读数与设定值之差', fmt(R - L0, 3) + ' mm'],
      ['读法', '先看固定刻度露出几个半毫米，再看微分筒上与基准线对齐的格数，末位估读一位'],
    ]);
  }

  return { frame };
}
