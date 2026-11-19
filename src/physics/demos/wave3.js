/* 波3 干涉、衍射与多普勒效应，三档切换。
   干涉：两个同相点波源发出圆波，实线圈是波峰，绿色曲线是路程差为 nλ
   的加强线，竖直绿线是零级。衍射：左侧平面波穿过一条缝，缝后是
   从缝发出的圆波，缝越窄张角越大。多普勒：声源边发声边向右移动，
   前方的波面被压密、后方的被拉疏。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';

const D2R = Math.PI / 180;
const V = 1; // 干涉与衍射档的波速（m/s）

export function create(st) {
  let last = '';
  let t = 0;
  let hold = 0;
  let emitted = 0;
  let crests = [];
  const reset = () => {
    t = 0;
    hold = 0;
    emitted = 0;
    crests = [];
  };

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'diff' ? 'diff' : q.mode === 'doppler' ? 'doppler' : 'interf';
    const lam = clamp(nn(q.lam, 0.5), 0.3, 0.9);
    const d = clamp(nn(q.d, 1.4), 0.8, 2.4);
    const aw = clamp(nn(q.aw, 0.4), 0.1, 0.9);
    const vs = clamp(nn(q.vs, 0.6), 0, 1.2);

    const key = [mode, lam, d, aw, vs].join('|');
    if (key !== last) {
      last = key;
      reset();
    }

    ctx.clearRect(0, 0, w, h);

    /* ── 干涉 ─────────────────────────────── */
    if (mode === 'interf') {
      if (dt > 0) t += dt;
      const T = lam / V;
      const ph = (t / T) % 1;
      const s = Math.min((w * 0.92) / 5.4, (h * 0.86) / 3.4);
      const cx = w * 0.5;
      const cy = h * 0.52;
      const P = (x, y) => ({ x: cx + x * s, y: cy - y * s });

      // 两个源发出的圆波（波峰）
      ctx.save();
      ctx.lineWidth = 1.1;
      ctx.globalAlpha = 0.5;
      for (const [sx, col] of [
        [-d / 2, pal.blue],
        [d / 2, pal.orange],
      ]) {
        ctx.strokeStyle = col;
        for (let n = 0; n * lam < 3.6; n++) {
          const r = (n + ph) * lam * s;
          if (r < 4) continue;
          ctx.beginPath();
          ctx.arc(cx + sx * s, cy, r, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 加强线：路程差 Δr = nλ 的双曲线，零级是竖直平分线
      ctx.save();
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.6;
      ctx.globalAlpha = 0.9;
      const YM = 1.62;
      ctx.beginPath();
      const p0 = P(0, -YM);
      ctx.moveTo(p0.x, p0.y);
      const p1 = P(0, YM);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();
      for (let n = 1; n * lam < d - 1e-6; n++) {
        const a = (n * lam) / 2;
        const b2 = (d / 2) ** 2 - a * a;
        if (b2 <= 0) continue;
        const b = Math.sqrt(b2);
        let top = null;
        for (const sg of [1, -1]) {
          ctx.beginPath();
          for (let i = 0; i <= 80; i++) {
            const y = -YM + (2 * YM * i) / 80;
            const x = sg * a * Math.sqrt(1 + (y * y) / (b * b));
            const p = P(x, y);
            if (i === 0) ctx.moveTo(p.x, p.y);
            else ctx.lineTo(p.x, p.y);
          }
          ctx.stroke();
          if (sg > 0) top = P(a * Math.sqrt(1 + 1.35 ** 2 / (b * b)), 1.35);
        }
        if (top) label(ctx, 'n=' + n, top.x + 6, top.y, pal.green, 'left', 13);
      }
      ctx.restore();

      // 两个波源
      for (const [sx, name, col] of [
        [-d / 2, 'S₁', pal.blue],
        [d / 2, 'S₂', pal.orange],
      ]) {
        spot(ctx, cx + sx * s, cy, 6, col, pal.ink);
        label(ctx, name, cx + sx * s, cy + 22, col, 'center', 14);
      }
      label(ctx, 'n=0', cx + 6, cy - 1.55 * s, pal.green, 'left', 13);

      const ang = lam < d ? Math.asin(lam / d) / D2R : NaN;
      st.readout([
        ['波长 λ', fmt(lam, 2) + ' m'],
        ['波源间距 d', fmt(d, 2) + ' m'],
        ['λ / d', fmt(lam / d, 2)],
        ['第一级加强线偏角', Number.isFinite(ang) ? fmt(ang, 1) + ' °' : '无'],
      ]);
      return;
    }

    /* ── 衍射 ─────────────────────────────── */
    if (mode === 'diff') {
      if (dt > 0) t += dt;
      const T = lam / V;
      const ph = (t / T) % 1;
      const s = Math.min((w * 0.5) / 3.0, (h * 0.84) / 3.4);
      const bxp = w * 0.4;
      const cy = h * 0.5;
      const yTop = h * 0.07;
      const yBot = h * 0.93;
      const half = (aw / 2) * s;

      // 入射平面波（竖线）
      ctx.save();
      ctx.strokeStyle = pal.blue;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = 0.5;
      for (let n = 0; n < 30; n++) {
        const xx = bxp - (n + 1 - ph) * lam * s;
        if (xx < w * 0.03) break;
        ctx.beginPath();
        ctx.moveTo(xx, yTop);
        ctx.lineTo(xx, yBot);
        ctx.stroke();
      }
      ctx.restore();

      // 缝后的圆波：张角由缝宽决定
      const th = Math.asin(clamp(lam / aw, 0, 1));
      ctx.save();
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.3;
      ctx.globalAlpha = 0.6;
      for (let n = 0; n * lam < 3.4; n++) {
        const r = (n + ph) * lam * s;
        if (r < 6) continue;
        ctx.beginPath();
        ctx.arc(bxp, cy, r, -th, th);
        ctx.stroke();
      }
      ctx.restore();

      // 挡板
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(bxp, yTop);
      ctx.lineTo(bxp, cy - half);
      ctx.moveTo(bxp, cy + half);
      ctx.lineTo(bxp, yBot);
      ctx.stroke();

      // 缝宽标注
      const ax = bxp - 16;
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ax, cy - half);
      ctx.lineTo(ax, cy + half);
      ctx.stroke();
      label(ctx, 'a', ax - 6, cy + 5, pal.ink, 'right', 14);

      arrow(ctx, w * 0.08, h * 0.14, w * 0.2, h * 0.14, pal.blue, 1.8);
      label(ctx, '入射波', w * 0.205, h * 0.145, pal.blue, 'left', 13);
      label(ctx, '衍射波', bxp + 26, cy - 1.1 * s, pal.orange, 'left', 13);

      const th1 = lam / aw;
      st.readout([
        ['波长 λ', fmt(lam, 2) + ' m'],
        ['缝宽 a', fmt(aw, 2) + ' m'],
        ['λ / a', fmt(th1, 2)],
        ['第一极小角', th1 >= 1 ? '不存在' : fmt(Math.asin(th1) / D2R, 1) + ' °'],
      ]);
      return;
    }

    /* ── 多普勒效应 ────────────────────────── */
    const VW = 2; // 波速（m/s）
    const L = 10;
    const x0 = 1.6;
    const T = lam / VW;
    const f = 1 / T;
    const s = Math.min((w * 0.92) / L, (h * 0.9) / 6.4);
    const cy = h * 0.5;
    const tTravel = clamp((L - 1.4 - x0) / Math.max(vs, 0.08), 2.6, 5.5);
    const tEnd = tTravel + 1;
    if (dt > 0) {
      if (t < tEnd) t = Math.min(tEnd, t + dt);
      else {
        hold += dt;
        if (hold > 0.9) reset();
      }
    }
    const xs = x0 + vs * t;
    const kNow = Math.floor(t / T + 1e-9);
    while (emitted <= kNow) {
      const te = emitted * T;
      if (te <= t + 1e-9) crests.push({ x: x0 + vs * te, t0: te });
      emitted++;
    }
    crests = crests.filter(c => t - c.t0 <= 5.2);

    // 基准线
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(w * 0.03, cy);
    ctx.lineTo(w * 0.96, cy);
    ctx.stroke();

    // 波面
    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.2;
    ctx.globalAlpha = 0.6;
    for (const c of crests) {
      const r = (t - c.t0) * VW * s;
      if (r < 4) continue;
      ctx.beginPath();
      ctx.arc(w * 0.03 + c.x * s, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // 波源
    const sx = w * 0.03 + xs * s;
    spot(ctx, sx, cy, 7, pal.orange, pal.ink);
    label(ctx, '波源', sx, cy - 16, pal.orange, 'center', 13);
    if (vs > 0.02) arrow(ctx, sx + 10, cy + 16, sx + 10 + vs * 34, cy + 16, pal.orange, 2);
    else label(ctx, 'v = 0', sx + 12, cy + 22, pal.orange, 'left', 13);

    // 前后观察者
    for (const [xm, name] of [
      [0.5, '后方'],
      [9.5, '前方'],
    ]) {
      const px = w * 0.03 + xm * s;
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, cy - 12);
      ctx.lineTo(px, cy + 12);
      ctx.stroke();
      label(ctx, name, px, cy + 30, pal.ink, 'center', 13);
    }

    const fF = f * VW / Math.max(VW - vs, 0.2);
    const fB = f * VW / (VW + vs);
    st.readout([
      ['波长 λ', fmt(lam, 2) + ' m'],
      ['波速 v', fmt(VW, 1) + ' m/s'],
      ['声源速度', fmt(vs, 1) + ' m/s'],
      ['前方频率', fmt(fF, 2) + ' Hz'],
      ['后方频率', fmt(fB, 2) + ' Hz'],
      ['前方波长', fmt((VW - vs) / f, 2) + ' m'],
    ]);
  }

  return { frame, reset };
}
