/* 演示：功能关系与能量守恒。
   物块以初速 v₀ 在粗糙水平面上滑行，唯一的水平力是滑动摩擦力 f = μmg。
   摩擦力做负功：W_f = −f·s，机械能随之减少，减少多少，内能就增加多少。
   右栏是一根堆叠条：绿色是动能（水平面上机械能就是动能），粉色是摩擦生成的内能，
   两者之和被青色横线卡住——机械能减少的部分，一分不少地变成了内能。 */

import { label, arrow, clamp, fmt } from '../gfx.js';

const G = 9.8;

export function create(st) {
  let last = '';
  let t = 0;
  let hold = 0;
  let sEnd = 1;
  let tEnd = 1;
  const reset = () => { t = 0; hold = 0; };

  function frame(dt) {
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const m = clamp(nn(q.m, 2), 0.5, 3);
    const v0 = clamp(nn(q.v0, 8), 2, 10);
    const mu = clamp(nn(q.mu, 0.3), 0.05, 0.6);

    const f = mu * m * G;
    const a = mu * G;
    const E0 = 0.5 * m * v0 * v0;

    const key = [m, v0, mu].join('|');
    if (key !== last) {
      last = key;
      sEnd = v0 * v0 / (2 * a);
      tEnd = v0 / a;
      reset();
    }

    /* 步进：走完全程后停 0.9 s 再从头出发 */
    if (dt > 0) {
      if (t < tEnd) {
        t = Math.min(tEnd, t + dt);
      } else {
        hold += dt;
        if (hold > 0.9) reset();
      }
    }

    const s = clamp(v0 * t - 0.5 * a * t * t, 0, sEnd);
    const v = Math.max(0, v0 - a * t);
    const Ek = 0.5 * m * v * v;
    const Q = Math.max(0, E0 - Ek);

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const dual = w >= 640;
    const sw = dual ? w * 0.56 : w - 16;

    const gy = h * 0.63;
    const x0 = sw * 0.12;
    const scale = (sw * 0.72) / Math.max(1e-6, sEnd);
    const bh = 34;
    const half = 20;
    const bx = x0 + s * scale;

    /* 地面 */
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(sw * 0.06, gy);
    ctx.lineTo(sw * 0.96, gy);
    ctx.stroke();
    ctx.restore();
    label(ctx, '粗糙水平面', sw * 0.96, gy + 20, pal.mut, 'right', 13);

    /* 起点竖虚线 */
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.cyan;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(x0, gy - bh - 26);
    ctx.lineTo(x0, gy + 6);
    ctx.stroke();
    ctx.restore();
    label(ctx, '起点', x0, gy + 20, pal.cyan, 'center', 13);

    /* 摩擦留下的痕迹 */
    if (s > 0.02) {
      ctx.save();
      ctx.strokeStyle = pal.pink;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 3;
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(x0, gy + 3);
      ctx.lineTo(bx, gy + 3);
      ctx.stroke();
      ctx.restore();
    }

    /* 位移标注：从起点量到此刻 */
    const my = gy + 42;
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x0, my);
    ctx.lineTo(bx, my);
    ctx.moveTo(x0, my - 4);
    ctx.lineTo(x0, my + 4);
    ctx.moveTo(bx, my - 4);
    ctx.lineTo(bx, my + 4);
    ctx.stroke();
    ctx.restore();
    label(ctx, 's = ' + fmt(s, 2) + ' m', (x0 + bx) * 0.5, my + 17, pal.cyan, 'center', 13);

    /* 物块 */
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.28;
    ctx.fillRect(bx - half, gy - bh, half * 2, bh);
    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.8;
    ctx.strokeRect(bx - half, gy - bh, half * 2, bh);
    ctx.restore();
    label(ctx, 'm', bx, gy - bh * 0.5 + 5, pal.blue, 'center', 13);

    /* 速度箭头 */
    if (v > 0.05) {
      const Lv = 22 + 44 * (v / Math.max(1e-6, v0));
      arrow(ctx, bx, gy - bh - 16, bx + Lv, gy - bh - 16, pal.green, 2.4);
      label(ctx, 'v = ' + fmt(v, 2) + ' m/s', bx + Lv + 8, gy - bh - 12, pal.green, 'left', 13);
    } else {
      label(ctx, '已停止', bx + half + 10, gy - bh * 0.5 + 5, pal.mut, 'left', 13);
    }

    /* 摩擦力箭头：与运动方向相反 */
    arrow(ctx, bx - half - 4, gy - bh * 0.5, bx - half - 46, gy - bh * 0.5, pal.purple, 2.4);
    label(ctx, 'f = μmg = ' + fmt(f, 1) + ' N', bx - half - 52, gy - bh * 0.5 + 5,
      pal.purple, 'right', 13);

    /* ── 右：堆叠能量条 ── */
    if (dual) {
      const px0 = sw + 20;
      const pw = w - px0 - 20;
      const baseY = h * 0.76;
      const topY = h * 0.14;
      const sc = (baseY - topY) / (Math.max(E0, 1e-6) * 1.10);
      const bw = Math.min(58, pw * 0.24);
      const cx = px0 + pw * 0.34;

      ctx.save();
      ctx.strokeStyle = pal.line;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px0 + pw * 0.05, baseY);
      ctx.lineTo(px0 + pw * 0.93, baseY);
      ctx.stroke();
      ctx.restore();

      /* 动能段（下）与内能段（上） */
      const hE = Math.max(Ek > 1e-6 ? 1.5 : 0, Ek * sc);
      const hQ = Math.max(Q > 1e-6 ? 1.5 : 0, Q * sc);
      if (hE > 0) {
        ctx.save();
        ctx.fillStyle = pal.green;
        ctx.globalAlpha = 0.30;
        ctx.fillRect(cx - bw / 2, baseY - hE, bw, hE);
        ctx.globalAlpha = 0.95;
        ctx.strokeStyle = pal.green;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(cx - bw / 2, baseY - hE, bw, hE);
        ctx.restore();
        if (hE > 26) {
          label(ctx, 'Ek = ' + fmt(Ek, 1) + ' J', cx + bw / 2 + 12, baseY - hE * 0.5 + 5,
            pal.green, 'left', 13);
        }
      }
      if (hQ > 0) {
        ctx.save();
        ctx.fillStyle = pal.pink;
        ctx.globalAlpha = 0.30;
        ctx.fillRect(cx - bw / 2, baseY - hE - hQ, bw, hQ);
        ctx.globalAlpha = 0.95;
        ctx.strokeStyle = pal.pink;
        ctx.lineWidth = 1.6;
        ctx.strokeRect(cx - bw / 2, baseY - hE - hQ, bw, hQ);
        ctx.restore();
        if (hQ > 26) {
          label(ctx, 'Q = ' + fmt(Q, 1) + ' J', cx + bw / 2 + 12, baseY - hE - hQ * 0.5 + 5,
            pal.pink, 'left', 13);
        }
      }
      label(ctx, '动能', cx, baseY + 18, pal.mut, 'center', 13);
      label(ctx, '内能', cx, baseY + 34, pal.mut, 'center', 13);

      /* 总能量：一条不动的横线 */
      const ey = baseY - E0 * sc;
      ctx.save();
      ctx.setLineDash([6, 4]);
      ctx.strokeStyle = pal.cyan;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(px0 + pw * 0.04, ey);
      ctx.lineTo(px0 + pw * 0.94, ey);
      ctx.stroke();
      ctx.restore();
      label(ctx, '总能量 ' + fmt(E0, 1) + ' J', px0 + pw * 0.94, ey - 9, pal.cyan, 'right', 13);
    }

    st.readout([
      ['速度 v', fmt(v, 2) + ' m/s'],
      ['位移 s', fmt(s, 2) + ' m'],
      ['摩擦力 f', fmt(f, 1) + ' N'],
      ['动能 Ek', fmt(Ek, 1) + ' J'],
      ['内能 Q', fmt(Q, 1) + ' J'],
      ['总能量', fmt(E0, 1) + ' J'],
    ]);
  }

  return { frame, reset };
}
