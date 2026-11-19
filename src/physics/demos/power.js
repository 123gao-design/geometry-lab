/* 电7 电功、电功率与焦耳定律。
   两档：① 纯电阻——电阻丝通电发热，电能全部变成内能，W = Q = UIt = I²Rt，
        P电 = P热 = UI = I²R，读数栏里两者相减恒为零；
        ② 电动机——电能分成机械能与内能两部分，P电 = UI，P热 = I²R，
        P机 = UI − I²R，效率 η = P机/P电，提升速度 v = P机/(mg)。
   右栏一根功率条按 P机 : P热 分段，拖三根滑块看两段此消彼长。
   拖动 U、I 时功率条的相对长度不变（比例只由 U、I、R 三者之比决定），
   拖 R 才让粉段伸缩——这是「同样耗电，电阻越大发热越多」的可视对照。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { flowPath } from './circuit.js';

function wire(ctx, pts, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.stroke();
  ctx.restore();
}

/** 电阻丝上方的热气流（三条波动的细线，波形随时间往上走） */
function heatLines(ctx, x, y, pal, T) {
  ctx.save();
  ctx.strokeStyle = pal.orange;
  ctx.lineWidth = 1.6;
  for (let k = 0; k < 3; k++) {
    ctx.globalAlpha = 0.42;
    ctx.beginPath();
    for (let t = 0; t <= 1.001; t += 0.08) {
      const px = x + (k - 1) * 15 + Math.sin(t * 7 - T * 4 + k) * 4;
      const py = y - 12 - t * 34;
      if (t === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  }
  ctx.restore();
}

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'motor' ? 'motor' : 'pure';
    const U = clamp(fn(q.U, 12), 6, 24);
    const Rn = clamp(fn(q.R, 2), 0.5, 10);
    const m = clamp(fn(q.m, 2), 0.5, 5);
    const Ip = mode === 'pure' ? U / Rn : clamp(fn(q.I, 2), 0.5, 3);

    const key = [mode, U, Rn, m, Ip].join('|');
    if (key !== last) {
      last = key;
      T = 0;
    }
    if (dt > 0) T += dt;

    ctx.clearRect(0, 0, w, h);

    const Pt = U * Ip;
    const Ph = Ip * Ip * Rn;
    const Pm = mode === 'pure' ? 0 : Math.max(0, Pt - Ph);
    const eta = Pt > 0 ? Pm / Pt : 0;
    const v = mode === 'motor' && Pm > 0 ? Pm / (m * 9.8) : 0;

    /* ── 左栏：回路与用电器 ─────────────────────────── */
    const x0 = w * 0.10;
    const x1 = w * 0.40;
    const yT = h * 0.30;
    const yB = h * 0.74;
    const cyB = (yT + yB) / 2;
    const spd = clamp(28 + Ip * 26, 22, 140);

    const pts = [[x0, cyB - 15], [x0, yT], [x1, yT], [x1, yB], [x0, yB], [x0, cyB + 15]];
    wire(ctx, pts, pal.ink);
    flowPath(ctx, pts, pal.cyan, spd, T);

    // 电源
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 3.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x0 - 17, cyB - 15);
    ctx.lineTo(x0 + 17, cyB - 15);
    ctx.stroke();
    ctx.strokeStyle = pal.blue;
    ctx.beginPath();
    ctx.moveTo(x0 - 9, cyB + 15);
    ctx.lineTo(x0 + 9, cyB + 15);
    ctx.stroke();
    ctx.restore();
    label(ctx, '+', x0 - 26, cyB - 15, pal.orange, 'right', 16);
    label(ctx, '−', x0 - 20, cyB + 15, pal.blue, 'right', 16);
    label(ctx, `U = ${fmt(U, 1)} V`, x0 + 24, cyB, pal.mut, 'left', 14);
    arrow(ctx, x0 + 34, yT, x0 + 92, yT, pal.orange, 2.4);
    label(ctx, `I = ${fmt(Ip, 2)} A`, x0 + 63, yT - 17, pal.orange, 'center', 14);

    if (mode === 'pure') {
      // 电阻丝：发光的小方框 + 往上飘的热气流
      const rw = 22;
      const rh = 52;
      ctx.save();
      const glow = 0.22 + 0.10 * Math.sin(T * 4);
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = glow;
      ctx.beginPath();
      ctx.arc(x1, cyB, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = pal.bg2;
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.rect(x1 - rw / 2, cyB - rh / 2, rw, rh);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      heatLines(ctx, x1, cyB - rh / 2, pal, T);
      label(ctx, '电阻丝', x1 + 26, cyB - 16, pal.ink, 'left', 15);
      label(ctx, `R = ${fmt(Rn, 1)} Ω`, x1 + 26, cyB + 8, pal.mut, 'left', 14);
      label(ctx, '电能全部变成内能', x1 + 26, cyB + 32, pal.pink, 'left', 13);
    } else {
      // 电动机：转动的转子 + 向上的提升箭头
      const Rm = Math.min(30, Math.min(w * 0.05, h * 0.08));
      ctx.save();
      ctx.fillStyle = pal.bg2;
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x1, cyB, Rm, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      // 转子：三条辐条按提升速度转
      const wv = Pm > 0 ? clamp(0.7 + v * 2.2, 0.9, 6) : 0;
      ctx.strokeStyle = Pm > 0 ? pal.green : pal.faint;
      ctx.lineWidth = 2;
      for (let k = 0; k < 3; k++) {
        const a = T * wv + (k * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.moveTo(x1, cyB);
        ctx.lineTo(x1 + Math.cos(a) * Rm * 0.72, cyB + Math.sin(a) * Rm * 0.72);
        ctx.stroke();
      }
      ctx.restore();
      label(ctx, 'M', x1, cyB - Rm - 12, pal.ink, 'center', 15);
      label(ctx, '电动机', x1 + Rm + 12, cyB - 16, pal.ink, 'left', 15);
      label(ctx, `R = ${fmt(Rn, 1)} Ω`, x1 + Rm + 12, cyB + 8, pal.mut, 'left', 14);
      if (Pm > 0) {
        arrow(ctx, x1 + Rm + 18, cyB + 46, x1 + Rm + 18, cyB + 12, pal.green, 2.2);
        label(ctx, `v = ${fmt(v, 2)} m/s`, x1 + Rm + 26, cyB + 30, pal.green, 'left', 13);
      } else {
        label(ctx, '电流过大，电机卡住不转', x1 + Rm + 12, cyB + 30, pal.pink, 'left', 13);
      }
    }

    /* ── 右栏：功率条 ─────────────────────────────── */
    const rc = { x: w * 0.62, y: h * 0.22, w: w * 0.32 };
    const bw = rc.w;
    const bh = 28;
    const y1 = rc.y + 56;
    const frac = Pt > 0 ? clamp(Pm / Pt, 0, 1) : 0;

    label(ctx, '功率怎样分配', rc.x, rc.y, pal.ink, 'left', 15);
    ctx.save();
    if (frac > 0) {
      ctx.fillStyle = pal.green;
      ctx.globalAlpha = 0.5;
      ctx.fillRect(rc.x, y1, bw * frac, bh);
    }
    ctx.fillStyle = pal.pink;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(rc.x + bw * frac, y1, bw * (1 - frac), bh);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1;
    ctx.strokeRect(rc.x, y1, bw, bh);
    ctx.restore();
    label(ctx, `P电 = ${fmt(Pt, 2)} W`, rc.x, y1 - 12, pal.ink, 'left', 14);
    if (frac > 0) {
      if (bw * frac >= 96) label(ctx, `P机 ${fmt(Pm, 1)} W`, rc.x + bw * frac / 2, y1 + bh / 2, pal.green, 'center', 14);
      else label(ctx, `P机 ${fmt(Pm, 1)} W`, rc.x + bw * frac + 8, y1 - 12, pal.green, 'left', 13);
    }
    if (bw * (1 - frac) >= 96) {
      label(ctx, `P热 ${fmt(Ph, 1)} W`, rc.x + bw * frac + bw * (1 - frac) / 2, y1 + bh / 2, pal.pink, 'center', 14);
    } else {
      label(ctx, `P热 ${fmt(Ph, 1)} W`, rc.x + bw, y1 + bh + 16, pal.pink, 'right', 13);
    }

    const y2 = y1 + bh + 52;
    if (mode === 'pure') {
      label(ctx, '纯电阻：P电 = P热 = UI = I²R', rc.x, y2, pal.cyan, 'left', 14);
      label(ctx, '电功与电热相等，都按同一个式子算', rc.x, y2 + 26, pal.faint, 'left', 13);
      label(ctx, `10 s 内电热 Q = ${fmt(Ph * 10, 0)} J`, rc.x, y2 + 52, pal.pink, 'left', 14);
    } else {
      label(ctx, `η = P机/P电 = ${fmt(eta * 100, 1)}%`, rc.x, y2, pal.green, 'left', 14);
      label(ctx, `P电 = P机 + P热 = ${fmt(Pt, 2)} W`, rc.x, y2 + 26, pal.faint, 'left', 13);
      label(ctx, `提升速度 v = P机/(mg)`, rc.x, y2 + 52, pal.green, 'left', 13);
      label(ctx, `${fmt(v, 2)} m/s（m = ${fmt(m, 1)} kg）`, rc.x, y2 + 74, pal.ink, 'left', 14);
      label(ctx, `反电动势 U − IR = ${fmt(U - Ip * Rn, 2)} V`, rc.x, y2 + 100, pal.mut, 'left', 13);
    }

    if (mode === 'pure') {
      st.readout([
        ['电压 U', fmt(U, 1) + ' V'],
        ['电流 I = U/R', fmt(Ip, 2) + ' A'],
        ['电阻 R', fmt(Rn, 1) + ' Ω'],
        ['电功率 P = UI', fmt(Pt, 2) + ' W'],
        ['热功率 P热 = I²R', fmt(Ph, 2) + ' W'],
        ['P − I²R', fmt(Pt - Ph, 2) + ' W'],
        ['10 s 内电功 W', fmt(Pt * 10, 0) + ' J'],
        ['10 s 内电热 Q', fmt(Ph * 10, 0) + ' J'],
      ]);
      return;
    }

    st.readout([
      ['电压 U', fmt(U, 1) + ' V'],
      ['电流 I', fmt(Ip, 2) + ' A'],
      ['线圈电阻 R', fmt(Rn, 1) + ' Ω'],
      ['电功率 P电 = UI', fmt(Pt, 2) + ' W'],
      ['热功率 P热 = I²R', fmt(Ph, 2) + ' W'],
      ['机械功率 P机 = P电 − P热', fmt(Pm, 2) + ' W'],
      ['效率 η = P机/P电', fmt(eta * 100, 1) + ' %'],
      ['反电动势 U − IR', fmt(U - Ip * Rn, 2) + ' V'],
      ['提升速度 v = P机/(mg)', fmt(v, 2) + ' m/s'],
    ]);
  }

  return { frame };
}
