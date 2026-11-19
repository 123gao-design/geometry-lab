/* 演示：斜抛运动。
   左边是抛射角 θ、初速 v₀ 的一发斜抛：轨迹是对称的抛物线，最高点与落点各画一条引线，
   地面上量出射程 R。小球身上画三根箭头——蓝的水平分速始终不变，橙的竖直分速由正变负，
   绿的合速度大小始终等于 v₀（真空里能量守恒）。
   右边是射程随抛射角的曲线 R = v₀²sin2θ/g：橙点是当前角，紫圈是互补角 90°−θ，
   两点等高说明两个互补的抛射角射程相同，曲线的最高处落在 45°。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const G = 9.8;

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const v0 = clamp(num(p.v0, 15), 3, 30);
    const thd = clamp(num(p.th, 45), 5, 85);
    const th = (thd * Math.PI) / 180;
    const key = v0 + '|' + thd;
    if (key !== last) { last = key; reset(); }

    const cosT = Math.cos(th);
    const sinT = Math.sin(th);
    const vx = v0 * cosT;
    const vy0 = v0 * sinT;
    const T = (2 * vy0) / G;                     // 飞行时间
    const R = (v0 * v0 * Math.sin(2 * th)) / G;  // 射程
    const Hm = (vy0 * vy0) / (2 * G);            // 射高
    const cyc = T + 0.8;

    if (dt > 0) {
      t += dt;
      if (t > cyc) t -= cyc;
    }
    const tc = Math.min(t, T);
    const x = vx * tc;
    const y = vy0 * tc - 0.5 * G * tc * tc;
    const vy = vy0 - G * tc;

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const dual = w >= 640;
    const sw = dual ? w * 0.56 : w - 16;
    const sx0 = 22;
    const sx1 = sw - 10;
    const topY = 48;
    const botY = h - 46;

    /* ── 取景：横向按射程、纵向按射高，两边等比 ── */
    const boxW = Math.max(60, sx1 - sx0 - 26);
    const boxH = Math.max(50, botY - topY - 14);
    const pxM = Math.min(boxW / Math.max(R, 1), boxH / Math.max(Hm, 1)) * 0.94;
    const lx = sx0 + 16;
    const yG = botY;
    const PX = u => lx + u * pxM;
    const PY = v => yG - v * pxM;

    /* 地面 */
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(sx0 - 4, yG + 0.5);
    ctx.lineTo(sx1 + 4, yG + 0.5);
    ctx.stroke();
    ctx.restore();

    /* 整条轨迹（虚线）与已走过的部分（实线） */
    const tx = u => PX(vx * u);
    const ty = u => PY(vy0 * u - 0.5 * G * u * u);
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.orange;
    ctx.globalAlpha = 0.45;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const u = (T * i) / 64;
      if (i) ctx.lineTo(tx(u), ty(u));
      else ctx.moveTo(tx(u), ty(u));
    }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    const ns = 48;
    for (let i = 0; i <= ns; i++) {
      const u = (tc * i) / ns;
      if (i) ctx.lineTo(tx(u), ty(u));
      else ctx.moveTo(tx(u), ty(u));
    }
    ctx.stroke();
    ctx.restore();

    /* 对称轴：过最高点的竖虚线；射程在地面下方量出 */
    const axX = PX(R / 2);
    const axY = PY(Hm);
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(axX, axY + 6);
    ctx.lineTo(axX, yG);
    ctx.stroke();
    ctx.restore();
    label(ctx, '射高 H', axX, axY - 16, pal.mut, 'center', 12);

    const rx2 = PX(R);
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(lx, yG + 14);
    ctx.lineTo(rx2, yG + 14);
    ctx.moveTo(lx, yG + 10);
    ctx.lineTo(lx, yG + 18);
    ctx.moveTo(rx2, yG + 10);
    ctx.lineTo(rx2, yG + 18);
    ctx.stroke();
    ctx.restore();
    label(ctx, '射程 R = ' + fmt(R, 1) + ' m', (lx + rx2) / 2, yG + 28, pal.mut, 'center', 12);

    /* 抛射角：弧画在抛出点，从地面方向扫到初速方向 */
    const thRad = th;
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(lx, yG, 26, -thRad, 0, false);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'θ = ' + fmt(thd, 0) + '°',
      lx + 44 * Math.cos(-thRad / 2), yG + 44 * Math.sin(-thRad / 2), pal.cyan, 'left', 12);

    /* 小球与三根速度箭头 */
    const bx = PX(x);
    const by = PY(y);
    const kv = Math.min(6, 46 / Math.max(v0, 1));
    const axLen = Math.min(vx * kv, Math.max(0, sx1 - bx - 8));
    const vyPix = vy * kv;
    const ayLen = vyPix > 0
      ? Math.min(vyPix, Math.max(0, by - topY - 8))
      : Math.min(-vyPix, Math.max(0, yG - by - 6));
    const ayS = vyPix > 0 ? -ayLen : ayLen;

    if (axLen > 7) arrow(ctx, bx, by, bx + axLen, by, pal.blue, 2);
    if (ayLen > 7) arrow(ctx, bx, by, bx, by + ayS, pal.orange, 2);
    if (axLen > 7 || ayLen > 7) arrow(ctx, bx, by, bx + axLen, by + ayS, pal.green, 2.2);

    if (axLen > 22) label(ctx, 'v水平', bx + axLen / 2, by - 12, pal.blue, 'center', 12);
    if (ayLen > 22) label(ctx, 'v竖直', bx - 8, by + ayS / 2, pal.orange, 'right', 12);

    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(bx, by, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* ── 右：射程随抛射角变化 ── */
    if (dual) {
      const px0 = sw + 24;
      const pw = Math.max(140, w - px0 - 20);
      const r = { x: px0, y: 46, w: pw, h: Math.max(90, h - 46 - 56) };
      const rMax = (v0 * v0) / G;
      const g = panel(ctx, r, [0, 90], [0, rMax * 1.12], pal, {
        xlab: 'θ / °',
        ylab: 'R / m',
        nx: 4,
        ny: 4,
      });

      const pts = [];
      for (let a = 0; a <= 90; a += 1) {
        pts.push([a, (v0 * v0 * Math.sin((2 * a * Math.PI) / 180)) / G]);
      }
      poly(ctx, g.X, g.Y, pts, pal.green, 2.2);

      /* 45° 处最远 */
      ctx.save();
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = pal.ink;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(g.X(45), g.Y(0));
      ctx.lineTo(g.X(45), g.Y(rMax));
      ctx.stroke();
      ctx.restore();
      label(ctx, '45°', g.X(45), g.Y(0) - 12, pal.mut, 'center', 12);

      /* 当前角与互补角：两点等高 */
      const th2 = 90 - thd;
      const yCur = (v0 * v0 * Math.sin((2 * thd * Math.PI) / 180)) / G;
      const yCmp = (v0 * v0 * Math.sin((2 * th2 * Math.PI) / 180)) / G;
      if (Math.abs(th2 - thd) > 3) {
        ctx.save();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = pal.purple;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(g.X(thd), g.Y(yCur));
        ctx.lineTo(g.X(th2), g.Y(yCmp));
        ctx.stroke();
        ctx.restore();
        label(ctx, '同射程', (g.X(thd) + g.X(th2)) / 2, g.Y(yCur) - 12, pal.purple, 'center', 12);
        spot(ctx, g.X(th2), g.Y(yCmp), 3.4, pal.card, pal.purple);
      }
      spot(ctx, g.X(thd), g.Y(yCur), 3.8, pal.orange, pal.card);
      label(ctx, 'R 最大 = ' + fmt(rMax, 1) + ' m', r.x + r.w - 12, r.y + 15, pal.mut, 'right', 12);
    }

    st.readout([
      ['飞行时间 T', fmt(T, 2) + ' s'],
      ['射程 R', fmt(R, 2) + ' m'],
      ['射高 H', fmt(Hm, 2) + ' m'],
      ['当前高度 y', fmt(Math.max(0, y), 2) + ' m'],
      ['水平速度 vx', fmt(vx, 2) + ' m/s'],
      ['竖直速度 vy', fmt(vy, 2) + ' m/s'],
    ]);
  }

  return { frame, reset };
}
