/* 演示：圆周运动的描述与向心力。
   左栏是一只绕圆心 O 匀角速转动的质点：沿圆弧走过的部分画成绿色弧线，
   身上的绿箭头是线速度（沿切线）、橙箭头是指向圆心的向心加速度，青色虚线是半径。
   弧长 s = rθ、速度方向每时每刻都在变，两者合起来就是「速率不变、速度在变」。
   右栏把两个时刻的速度箭头平移到同一起点，绿色弦就是速度增量 Δv：
   它沿半径指向圆心，大小约等于 vΔθ，除以 Δt 即得 a = v²/r = ω²r。 */

import { label, arrow, clamp, fmt } from '../gfx.js';

const TAU = Math.PI * 2;

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const r = clamp(num(p.r, 1.2), 0.4, 2.2);
    const om = clamp(num(p.om, 1.5), 0.3, 5);
    const mm = clamp(num(p.m, 0.5), 0.1, 3);
    const key = r + '|' + om + '|' + mm;
    if (key !== last) { last = key; reset(); }

    const T = TAU / om;
    if (dt > 0) {
      t += dt;
      if (t > T) t -= T;
    }
    const th = om * t;                 // 已转过的角
    const vv = om * r;                 // 线速度
    const ac = om * om * r;            // 向心加速度
    const Ff = mm * ac;                // 向心力

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const dual = w >= 640;
    const sw = dual ? w * 0.56 : w - 16;
    const cx = sw / 2;
    const cy = h / 2 + 6;
    const R = Math.min(sw * 0.30, h * 0.33);

    /* ── 圆轨道 ── */
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, TAU);
    ctx.stroke();
    ctx.restore();

    /* 已走过的弧：弧长 s = rθ */
    if (th > 0.01) {
      ctx.save();
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, -th, true);
      ctx.stroke();
      ctx.restore();
    }

    /* 半径（青色虚线）与圆心 */
    const px = cx + R * Math.cos(th);
    const py = cy - R * Math.sin(th);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.cyan;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(px, py);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = pal.ink;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, TAU);
    ctx.fill();
    ctx.restore();
    label(ctx, 'O', cx - 14, cy - 13, pal.mut, 'left', 13);
    label(ctx, 'r', cx + (px - cx) * 0.52 - 12, cy + (py - cy) * 0.52 - 12, pal.cyan, 'right', 13);

    /* 圆心角 θ：从 +x 方向扫到半径方向（画布 y 朝下，故取负角） */
    const arcR = R * 0.30;
    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(cx, cy, arcR, 0, -th, true);
    ctx.stroke();
    ctx.restore();
    if (th > 0.22) {
      label(ctx, 'θ', cx + (arcR + 15) * Math.cos(th / 2), cy - (arcR + 15) * Math.sin(th / 2),
        pal.purple, 'center', 13);
    }

    /* 线速度：沿切线（θ 增大方向的单位切向量） */
    const tx = -Math.sin(th);
    const ty = -Math.cos(th);
    const vLen = clamp(R * vv / 6, R * 0.22, R * 0.62);
    arrow(ctx, px, py, px + tx * vLen, py + ty * vLen, pal.green, 2.2);
    label(ctx, 'v', px + tx * (vLen + 12), py + ty * (vLen + 12), pal.green, 'center', 13);

    /* 向心加速度：沿半径指向圆心 */
    const ax = -Math.cos(th);
    const ay = Math.sin(th);
    const aLen = clamp(R * ac / 16, R * 0.10, R * 0.55);
    arrow(ctx, px, py, px + ax * aLen, py + ay * aLen, pal.orange, 2.2);
    label(ctx, 'a', px + ax * (aLen + 11) + 9, py + ay * (aLen + 11) - 2, pal.orange, 'left', 13);

    /* 质点 */
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, TAU);
    ctx.fill();
    ctx.restore();

    /* ── 右：两个时刻的速度与它们的差 ── */
    if (dual) {
      const px0 = sw + 22;
      const pw = Math.max(150, w - px0 - 16);
      const ox = px0 + pw * 0.46;
      const oy = h * 0.55;
      const Lv = Math.min(pw * 0.30, (h - 160) * 0.30, 92);
      const dTh = 0.44;
      const a1 = th;
      const a2 = th + dTh;
      const t1 = [-Math.sin(a1), -Math.cos(a1)];
      const t2 = [-Math.sin(a2), -Math.cos(a2)];
      const p1 = [ox + t1[0] * Lv, oy + t1[1] * Lv];
      const p2 = [ox + t2[0] * Lv, oy + t2[1] * Lv];

      label(ctx, '两个时刻的速度', px0 + 4, 24, pal.mut, 'left', 13);

      /* 指向圆心的虚线：Δv 与它平行。只画到弦以里，把弦外那圈让给标签 */
      const am = th + dTh / 2;
      const um = [-Math.cos(am), Math.sin(am)];
      ctx.save();
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(ox + um[0] * (Lv * 0.8), oy + um[1] * (Lv * 0.8));
      ctx.stroke();
      ctx.restore();

      arrow(ctx, ox, oy, p1[0], p1[1], pal.green, 2);
      arrow(ctx, ox, oy, p2[0], p2[1], pal.green, 2);

      /* v₁、v₂ 贴在各自箭头里侧（朝分角线外侧让开），弦外那一圈留给 Δv */
      const nrm = (v) => {
        const L = Math.hypot(v[0], v[1]) || 1;
        return [v[0] / L, v[1] / L];
      };
      const n1 = nrm([t1[0] - um[0], t1[1] - um[1]]);
      const n2 = nrm([t2[0] - um[0], t2[1] - um[1]]);
      const k1 = Lv * 0.5;
      label(
        ctx, 'v₁',
        ox + t1[0] * k1 + n1[0] * 15,
        oy + t1[1] * k1 + n1[1] * 15,
        pal.green, 'center', 13,
      );
      label(
        ctx, 'v₂',
        ox + t2[0] * k1 + n2[0] * 15,
        oy + t2[1] * k1 + n2[1] * 15,
        pal.green, 'center', 13,
      );

      /* Δv = v₂ − v₁：从 v₁ 末端指向 v₂ 末端 */
      arrow(ctx, p1[0], p1[1], p2[0], p2[1], pal.purple, 2.2);
      const mx = (p1[0] + p2[0]) / 2 + um[0] * 24;
      const my = (p1[1] + p2[1]) / 2 + um[1] * 24;
      label(ctx, 'Δv', mx, my, pal.purple, 'center', 13);

      label(ctx, 'Δv 指向圆心', ox - Lv * 0.55, h - 58, pal.mut, 'left', 13);
      label(ctx, 'Δv ≈ v·Δθ', ox - Lv * 0.55, h - 34, pal.mut, 'left', 13);
    }

    st.readout([
      ['周期 T', fmt(T, 2) + ' s'],
      ['频率 f', fmt(1 / T, 2) + ' Hz'],
      ['线速度 v = ωr', fmt(vv, 2) + ' m/s'],
      ['向心加速度 a = ω²r', fmt(ac, 2) + ' m/s²'],
      ['向心力 F = mω²r', fmt(Ff, 2) + ' N'],
      ['转过角度 θ', fmt((th * 180) / Math.PI, 0) + '°'],
    ]);
  }

  return { frame, reset };
}
