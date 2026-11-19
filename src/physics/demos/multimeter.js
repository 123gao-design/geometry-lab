/* 实9 多用电表与传感器：
   ① 欧姆挡——指针偏转由 I/I_max = R中/(R中+Rₓ) 决定，刻度左密右疏、0 在右端；
      读数 = 指针示数 × 倍率，指针落在中值附近时读数最可靠。
   ② 热敏电阻——NTC 的阻值随温度指数下降，串在电路里，温度一升电流就上来。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

const RMID = 15;          // ×1 挡的中值电阻（Ω）
const R0 = 10e3;          // 热敏电阻在 25 ℃ 时的阻值
const T25 = 298.15;
const EBAT = 6;           // 传感器电路的电源电动势（V）
const RSER = 200;         // 串联的定值电阻（Ω）
const TICKS = [0.5, 1, 2, 3, 5, 7, 10, 15, 20, 30, 50, 70, 100, 200, 500, 1000];

export function create(st) {
  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'sensor' ? 'sensor' : 'ohm';

    ctx.clearRect(0, 0, w, h);
    if (mode === 'ohm') drawOhm(ctx, w, h, pal, q, fn);
    else drawSensor(ctx, w, h, pal, q, fn);
  }

  // ———— 欧姆挡 ————
  function drawOhm(ctx, w, h, pal, q, fn) {
    const Rx = clamp(fn(q.Rx, 1500), 1, 5000);
    const n = Math.round(clamp(fn(q.mul, 2), 0, 3));
    const mul = Math.pow(10, n);
    const rmid = RMID * mul;
    const dial = Rx / mul;
    const f = RMID / (RMID + dial);

    const cx = w * 0.30, cy = h * 0.70;
    const R = Math.min(w * 0.23, h * 0.54);
    const th = d => Math.PI * (1 - RMID / (RMID + d));

    // 可靠的读数区：中值的三分之一到五倍
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(cx, cy, R - 3, th(3), th(75));
    ctx.stroke();
    ctx.restore();

    // 刻度弧
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, Math.PI, 0);
    ctx.stroke();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.3;
    for (const d of TICKS) {
      const a = th(d);
      const c = Math.cos(a), s = Math.sin(a);
      ctx.beginPath();
      ctx.moveTo(cx + c * R * 0.88, cy - s * R * 0.88);
      ctx.lineTo(cx + c * R, cy - s * R);
      ctx.stroke();
    }
    ctx.restore();
    for (const d of TICKS) {
      if (d < 1 || d === 200) continue;
      const a = th(d);
      const tx = cx + Math.cos(a) * R * 0.80;
      const ty = cy - Math.sin(a) * R * 0.80 + 4;
      label(ctx, d >= 1000 ? '1k' : String(d), tx, ty, pal.mut, 'center', 10);
    }
    label(ctx, '0', cx + R - 8, cy - 12, pal.mut, 'center', 11);
    label(ctx, '∞', cx - R + 8, cy - 12, pal.mut, 'center', 11);

    // 中值标记
    label(ctx, `${fmt(rmid, 0)} Ω`, cx + Math.cos(th(15)) * (R + 16), cy - Math.sin(th(15)) * (R + 16) + 4, pal.green, 'center', 11);

    // 指针
    const a = th(dial);
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * R * 0.10, cy - Math.sin(a) * R * 0.10);
    ctx.lineTo(cx + Math.cos(a) * R * 0.94, cy - Math.sin(a) * R * 0.94);
    ctx.stroke();
    ctx.fillStyle = pal.ink;
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 右侧说明
    const x2 = w * 0.58;
    const y0 = h * 0.24;
    label(ctx, '欧姆挡', x2, y0, pal.ink, 'left', 15);
    label(ctx, `挡位倍率 ×${mul}`, x2, y0 + 34, pal.mut, 'left', 13);
    label(ctx, `中值电阻 ${fmt(rmid, 0)} Ω`, x2, y0 + 58, pal.green, 'left', 13);
    label(ctx, `指针示数 ${fmt(dial, 1)} Ω`, x2, y0 + 82, pal.mut, 'left', 13);
    label(ctx, `读数 = ${fmt(dial, 1)} × ${mul} = ${fmt(dial, mul >= 100 ? 0 : 1)} Ω`, x2, y0 + 110, pal.orange, 'left', 13);
    label(ctx, '刻度左密右疏，0 在右端', x2, y0 + 150, pal.mut, 'left', 12);
    label(ctx, '指针落在绿弧内读数可靠', x2, y0 + 172, pal.mut, 'left', 12);

    let judge = '指针在中值附近，读数可靠';
    if (dial < RMID / 5) judge = '指针偏右，换小一挡倍率';
    else if (dial > RMID * 5) judge = '指针偏左，换大一挡倍率';

    st.readout([
      ['挡位', `×${mul}`],
      ['中值电阻', fmt(rmid, 0) + ' Ω'],
      ['待测电阻 Rₓ', fmt(Rx, 0) + ' Ω'],
      ['指针示数', fmt(dial, 1) + ' Ω'],
      ['读数 = 示数 × 倍率', fmt(dial * mul, 0) + ' Ω'],
      ['偏转比例 I/I_max', fmt(100 * f, 1) + ' %'],
      ['判读', judge],
    ]);
  }

  // ———— 热敏电阻 ————
  function drawSensor(ctx, w, h, pal, q, fn) {
    const T = clamp(fn(q.T, 25), 0, 100);
    const B = clamp(fn(q.B, 3500), 1500, 5000);
    const Tk = T + 273.15;
    const Rth = R0 * Math.exp(B * (1 / Tk - 1 / T25));
    const I = EBAT / (Rth + RSER);

    // 温度计
    const tx = w * 0.09;
    const tTop = h * 0.20, tBot = h * 0.66;
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(tx - 7, tTop, 14, tBot - tTop, 7);
    ctx.stroke();
    ctx.fillStyle = pal.mut;
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(tx, tBot + 10, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.roundRect(tx - 4, tBot - (tBot - tTop) * (T / 100), 8, (tBot - tTop) * (T / 100) + 4, 4);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(tx, tBot + 10, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, `${fmt(T, 0)} ℃`, tx, tTop - 12, pal.orange, 'center', 13);

    // 电路：电池、电流表、热敏电阻串联
    const xL = w * 0.27, xR = w * 0.48;
    const yT = h * 0.26, yB = h * 0.68;
    const rA = clamp(w * 0.016, 11, 15);
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(xL, yT);
    ctx.lineTo(xR, yT);
    ctx.lineTo(xR, yB);
    ctx.lineTo(xL, yB);
    ctx.lineTo(xL, yT);
    ctx.stroke();
    ctx.restore();

    // 电池（左竖线中部留口）
    const yBat = (yT + yB) / 2;
    ctx.save();
    ctx.fillStyle = pal.bg2;
    ctx.fillRect(xL - 12, yBat - 16, 24, 32);
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(xL - 13, yBat - 5);
    ctx.lineTo(xL + 13, yBat - 5);
    ctx.stroke();
    ctx.lineWidth = 3.4;
    ctx.beginPath();
    ctx.moveTo(xL - 7, yBat + 5);
    ctx.lineTo(xL + 7, yBat + 5);
    ctx.stroke();
    ctx.restore();
    label(ctx, `${fmt(EBAT, 0)} V`, xL - 18, yBat + 4, pal.mut, 'right', 12);

    // 电流表（顶线）
    const xA = xL + 0.34 * (xR - xL);
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

    // 热敏电阻（右竖线）
    const yTh = (yT + yB) / 2;
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(xR - 16, yTh - 26, 32, 52, 5);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, 'Rθ', xR, yTh + 5, pal.purple, 'center', 12);
    label(ctx, `${fmt(Rth / 1000, 1)} kΩ`, xR + 22, yTh + 4, pal.purple, 'left', 12);

    // 受热箭头
    for (let i = 0; i < 3; i++) {
      const ay = yTh - 24 + i * 22;
      arrow(ctx, xL + 24, ay, xR - 26, ay, pal.orange, 1.6);
    }
    label(ctx, '受热', (xL + xR) / 2, yTh - 42, pal.orange, 'center', 12);
    label(ctx, `I = ${fmt(I * 1000, 2)} mA`, xL + 0.5 * (xR - xL), yB + 24, pal.orange, 'center', 12);
    arrow(ctx, xR - 40, yB, xR - 78, yB, pal.orange, 2);

    // 右栏 R–T 曲线
    const r0c = R0 * Math.exp(B * (1 / 273.15 - 1 / T25)) / 1000;
    const yTop = Math.max(8, r0c * 1.08);
    const rect = { x: w * 0.60, y: h * 0.18, w: w * 0.36, h: h * 0.62 };
    const g = panel(ctx, rect, [0, 100], [0, yTop], pal, { xlab: 't / ℃', ylab: 'R / kΩ', nx: 5, ny: 4 });

    const pts = [];
    for (let i = 0; i <= 50; i++) {
      const tt = (100 * i) / 50;
      pts.push([tt, (R0 * Math.exp(B * (1 / (tt + 273.15) - 1 / T25))) / 1000]);
    }
    poly(ctx, g.X, g.Y, pts, pal.purple, 2);

    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(g.X(T), g.Y(Rth / 1000));
    ctx.lineTo(g.X(T), g.Y(0));
    ctx.moveTo(g.X(T), g.Y(Rth / 1000));
    ctx.lineTo(g.X(0), g.Y(Rth / 1000));
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(g.X(T), g.Y(Rth / 1000), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, '温度升高，阻值下降（NTC）', rect.x + 10, rect.y + 38, pal.mut, 'left', 12);

    st.readout([
      ['温度 t', fmt(T, 0) + ' ℃'],
      ['热敏电阻 Rθ', fmt(Rth / 1000, 2) + ' kΩ'],
      ['25 ℃ 时的阻值 R₀', '10.00 kΩ'],
      ['Rθ / R₀', fmt(Rth / R0, 2)],
      ['电路电流 I', fmt(I * 1000, 2) + ' mA'],
      ['判读', 'NTC：阻值随温度上升而减小'],
    ]);
  }

  return { frame };
}
