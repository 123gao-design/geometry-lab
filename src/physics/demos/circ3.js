/* 演示：离心现象。
   俯视一只绕竖直轴转动的圆盘，物块靠静摩擦跟着转。
   物块在圆周上要的向心力是 mω²r，最多只能拿到 μmg：
   两者相等时圆盘转速到达临界值 ωc = √(μg/r)，再快一点静摩擦就跟不上，
   物块沿一条向外弯的路线滑出圆盘——这就是离心运动。
   右栏画「需要的向心力随角速度的增长」与「最大静摩擦这把尺子」，两条线的交点即 ωc。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const G = 9.8;
const RD = 1.2;        // 圆盘半径（米）
const TAU = Math.PI * 2;

export function create(st) {
  let th = 0;
  let rr = 0.6;
  let slide = false;
  let vr = 0;
  let outT = 0;
  let last = '';

  const reset = () => {
    th = 0; rr = 0.6; slide = false; vr = 0; outT = 0;
  };
  reset();

  function frame(dt) {
    const p = st.params;
    const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const r0 = clamp(num(p.r, 0.6), 0.2, 1.2);
    const om = clamp(num(p.om, 2.0), 0.5, 10);
    const mu = clamp(num(p.mu, 0.3), 0.05, 0.9);
    const mm = clamp(num(p.m, 0.5), 0.1, 3);
    const key = r0 + '|' + om + '|' + mu + '|' + mm;
    if (key !== last) {
      last = key;
      reset();
      rr = r0;
    }

    const wc = Math.sqrt((mu * G) / r0);
    const Fmax = mu * mm * G;

    if (dt > 0) {
      th += om * dt;
      if (th > TAU) th -= TAU;
      if (outT > 0) {
        outT -= dt;
        if (outT <= 0) { reset(); rr = r0; }
      } else if (!slide) {
        if (om * om * r0 > mu * G + 1e-9) { slide = true; rr = r0; vr = 0; }
      } else {
        /* 盘中径向：向外加速 mω²r，静/滑动摩擦向内 μmg */
        vr += (om * om * rr - mu * G) * dt;
        rr += vr * dt;
        if (rr > RD + 0.12) { slide = false; vr = 0; outT = 0.7; }
      }
    } else if (!slide) {
      rr = r0;
    }

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
    const Rp = Math.min(sw * 0.30, h * 0.36);
    const k = Rp / RD;

    /* ── 圆盘 ── */
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.arc(cx, cy, Rp, 0, TAU);
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(cx, cy, Rp, 0, TAU);
    ctx.stroke();
    ctx.restore();

    /* 盘面上随盘转动的辐条：转速看得见 */
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.8;
    for (let i = 0; i < 6; i++) {
      const a = th + (i * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Rp * Math.cos(a), cy - Rp * Math.sin(a));
      ctx.stroke();
    }
    ctx.restore();
    ctx.save();
    ctx.fillStyle = pal.mut;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, TAU);
    ctx.fill();
    ctx.restore();

    /* 物块的轨道圆（半径为 r0） */
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(cx, cy, r0 * k, 0, TAU);
    ctx.stroke();
    ctx.restore();

    /* 物块 */
    const bx = cx + rr * k * Math.cos(th);
    const by = cy - rr * k * Math.sin(th);
    const bs = clamp(Rp * 0.055, 5, 9);
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(th);
    ctx.fillStyle = slide ? pal.pink : pal.orange;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(-bs, -bs, bs * 2, bs * 2, 2)
      : ctx.rect(-bs, -bs, bs * 2, bs * 2);
    ctx.fill();
    ctx.restore();

    /* 速度：切向 */
    const vv = om * rr;
    const tx = -Math.sin(th);
    const ty = -Math.cos(th);
    const vLen = clamp(Rp * 0.45 * (vv / 12), Rp * 0.12, Rp * 0.45);
    arrow(ctx, bx, by, bx + tx * vLen, by + ty * vLen, pal.green, 2);
    label(ctx, 'v', bx + tx * (vLen + 12), by + ty * (vLen + 12), pal.green, 'center', 13);

    /* 摩擦力（提供向心力）：沿半径指向圆心 */
    const ux = -Math.cos(th);
    const uy = Math.sin(th);
    const kF = (Rp * 0.40) / (Fmax || 1);
    const fNow = slide ? Fmax : Math.min(mm * om * om * r0, Fmax);
    const fLen = clamp(fNow * kF, 6, Rp * 0.42);
    arrow(ctx, bx, by, bx + ux * fLen, by + uy * fLen, pal.orange, 2.4);
    label(ctx, 'f', bx + ux * (fLen + 12) + uy * 10, by + uy * (fLen + 12) - ux * 10,
      pal.orange, 'center', 13);

    /* 供不应求的部分：用红虚线从摩擦箭头末端接出去 */
    if (!slide && om * om * r0 > mu * G + 1e-9) {
      const need = mm * om * om * r0 * kF;
      const extra = Math.min(need - fLen, Rp * 0.5);
      if (extra > 5) {
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = pal.pink;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bx + ux * fLen, by + uy * fLen);
        ctx.lineTo(bx + ux * (fLen + extra), by + uy * (fLen + extra));
        ctx.stroke();
        ctx.restore();
        label(ctx, '差这么多', bx + ux * (fLen + extra) + uy * 12, by + uy * (fLen + extra) - ux * 12,
          pal.pink, 'center', 12);
      }
    }

    /* ── 右：需要的向心力与摩擦上限 ── */
    if (dual) {
      const px0 = sw + 22;
      const pw = Math.max(150, w - px0 - 16);
      const rct = { x: px0, y: 44, w: pw, h: Math.max(90, h - 44 - 54) };
      const omMax = Math.max(10, om * 1.2);
      const fTop = Math.max(mm * omMax * omMax * r0, Fmax) * 1.1;
      const g = panel(ctx, rct, [0, omMax], [0, fTop], pal, {
        xlab: 'ω/(rad/s)', ylab: 'F/N', nx: 4, ny: 4,
      });

      const pts = [];
      for (let i = 0; i <= 60; i++) {
        const o = (omMax * i) / 60;
        pts.push([o, mm * o * o * r0]);
      }
      poly(ctx, g.X, g.Y, pts, pal.blue, 2.2);

      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(g.X(0), g.Y(Fmax));
      ctx.lineTo(g.X(omMax), g.Y(Fmax));
      ctx.stroke();
      ctx.restore();
      label(ctx, '最大静摩擦 μmg', rct.x + 10, g.Y(Fmax) - 13, pal.orange, 'left', 12);

      spot(ctx, g.X(wc), g.Y(Fmax), 3.6, pal.pink, pal.card);
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.X(wc), g.Y(0));
      ctx.lineTo(g.X(wc), g.Y(Fmax));
      ctx.stroke();
      ctx.restore();
      label(ctx, 'ωc', g.X(wc) + 9, g.Y(0) - 8, pal.pink, 'left', 12);

      spot(ctx, g.X(om), g.Y(mm * om * om * r0), 4, pal.blue, pal.card);
      label(ctx, '需要的向心力 mω²r', rct.x + rct.w - 12, rct.y + 15, pal.mut, 'right', 12);
    }

    st.readout([
      ['需要向心力 mω²r', fmt(mm * om * om * r0, 2) + ' N'],
      ['最大静摩擦 μmg', fmt(Fmax, 2) + ' N'],
      ['临界角速度 ωc', fmt(wc, 2) + ' rad/s'],
      ['临界线速度 vc', fmt(wc * r0, 2) + ' m/s'],
      ['当前半径', fmt(rr, 2) + ' m'],
      ['状态', slide ? '静摩擦不够，离心滑出' : (om * om * r0 > mu * G ? '即将滑出' : '随盘转动')],
    ]);
  }

  return { frame, reset };
}
