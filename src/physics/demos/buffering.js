/* 演示：缓冲与平均作用力。
   小球以速率 v 垂直撞墙、原速弹回，动量变化是 Δp = 2mv，这个数只由质量与速率决定，
   与撞墙的软硬无关。撞在硬墙上接触时间极短，撞在软垫上接触时间拉长——
   两者的动量变化一样，作用力却按时间成比例地降下来。
   左栏画墙、软垫（厚度随接触时间变）与撞上又被弹回的小球；
   右栏画 F–t 曲线：半个正弦，曲线下的面积就是冲量，
   橙色面积随过程一点点填满，青色虚线是等高线的平均作用力 F̄ = Δp/Δt。
   读数栏的「动量变化 Δp」拖接触时间时纹丝不动，「平均作用力」随之反比变化。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const APP = 0.55;   // 接近：屏幕秒
const HIT = 0.80;   // 接触：屏幕秒（接触时间的长短由滑块定，这里只把它拉伸到看得见）
const BACK = 0.55;  // 弹回：屏幕秒
const REST = 0.70;  // 停顿：屏幕秒

export function create(st) {
  let last = '';
  let t = 0;
  let m = 0.2;
  let v = 10;
  let tc = 0.02;

  function reset() {
    const p = st.params;
    const nn = (x, d) => (Number.isFinite(Number(x)) ? Number(x) : d);
    m = clamp(nn(p.m, 0.2), 0.1, 2);
    v = clamp(nn(p.v, 10), 2, 15);
    tc = clamp(nn(p.tc, 0.02), 0.01, 0.2);
    t = 0;
  }

  function frame(dt) {
    const p = st.params;
    const key = [p.m, p.v, p.tc].join('|');
    if (key !== last) { last = key; reset(); }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const T1 = APP;
    const T2 = T1 + HIT;
    const T3 = T2 + BACK;
    const T4 = T3 + REST;

    if (dt > 0) {
      t += dt;
      if (t >= T4) t = 0;
    }

    /* ── 这一刻的三样数 ── */
    const dp = 2 * m * v;
    const fav = dp / tc;
    const fp = (Math.PI * m * v) / tc;

    let u = 0;          // 接触进程 0..1
    let k = 0;          // 往返进度 0..1
    let dir = 0;        // 速度方向：+1 朝墙，−1 离墙，0 停着
    let phase = 0;      // 0 接近 / 1 接触 / 2 弹回 / 3 停顿
    if (t < T1) {
      phase = 0; k = t / T1; dir = 1;
    } else if (t < T2) {
      phase = 1; u = (t - T1) / HIT; dir = 0;
    } else if (t < T3) {
      phase = 2; k = 1 - (t - T2) / BACK; dir = -1;
    } else {
      phase = 3; dir = 0;
    }

    const tau = u * tc;                       // 接触内的物理时刻
    const F = phase === 1 ? fp * Math.sin(Math.PI * u) : 0;
    const Iacc = (dp / 2) * (1 - Math.cos(Math.PI * u));  // 到此刻累积的冲量

    const dual = w >= 640;
    const sw = dual ? w * 0.50 : w - 16;
    const gy = h * 0.72;
    const R = 15;

    /* ── 左：墙、软垫、球 ── */
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(sw * 0.04, gy);
    ctx.lineTo(sw * 0.96, gy);
    ctx.stroke();
    ctx.restore();

    const wallX = sw * 0.86;
    const padT = 3 + 26 * clamp((tc - 0.01) / 0.19, 0, 1);

    /* 墙 */
    ctx.save();
    ctx.fillStyle = pal.faint;
    ctx.globalAlpha = 0.35;
    ctx.fillRect(wallX, gy - h * 0.30, 9, h * 0.30);
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(wallX, gy - h * 0.30, 9, h * 0.30);
    ctx.restore();

    /* 软垫：越软越厚 */
    ctx.save();
    ctx.fillStyle = pal.cyan;
    ctx.globalAlpha = 0.26;
    ctx.fillRect(wallX - padT, gy - h * 0.30, padT, h * 0.30);
    ctx.globalAlpha = 0.75;
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(wallX - padT, gy - h * 0.30, padT, h * 0.30);
    ctx.restore();
    label(ctx, '软垫', wallX - padT / 2, gy - h * 0.30 - 12, pal.cyan, 'center', 13);

    /* 球的位置 */
    const x0 = sw * 0.13;
    const cx = wallX - padT - R;   // 球面贴垫时的圆心
    let bx = x0;
    if (phase === 0) bx = x0 + (cx - x0) * k;
    else if (phase === 1) bx = cx;
    else if (phase === 2) bx = x0 + (cx - x0) * k;

    const sq = phase === 1 ? Math.sin(Math.PI * u) : 0;
    const rx = R * (1 - 0.34 * sq);
    const ry = R * (1 + 0.12 * sq);
    const by = gy - ry;
    const dx = bx + (R - rx);   // 压扁时圆心右移，球的右侧始终贴在垫面上

    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.ellipse(dx, by, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();
    label(ctx, 'm = ' + fmt(m, 1) + ' kg', bx, gy + 22, pal.blue, 'center', 13);

    /* 速度箭头 */
    if (dir !== 0) {
      const L = 20 + 46 * clamp(v / 15, 0, 1);
      if (dir > 0) {
        arrow(ctx, bx + rx + 3, by, bx + rx + 3 + L, by, pal.purple, 2.4);
        label(ctx, 'v = ' + fmt(v, 1) + ' m/s', bx + rx + 8, by - 13, pal.purple, 'left', 13);
      } else {
        arrow(ctx, bx - rx - 3, by, bx - rx - 3 - L, by, pal.green, 2.4);
        label(ctx, 'v = ' + fmt(v, 1) + ' m/s', bx - rx - 8, by - 13, pal.green, 'right', 13);
      }
    }

    /* 接触期间的作用力箭头 */
    if (phase === 1 && F > 1) {
      const L = 18 + 64 * clamp(F / fp, 0, 1);
      arrow(ctx, wallX - padT - 2, by, wallX - padT - 2 - L, by, pal.orange, 2.8);
      label(ctx, 'F = ' + fmt(F, 0) + ' N', wallX - padT - 6, by + 30, pal.orange, 'right', 13);
    }

    /* ── 右：F–t 曲线与冲量面积 ── */
    if (dual) {
      const px0 = sw + 8;
      const rect = {
        x: px0 + 50,
        y: h * 0.16,
        w: Math.max(120, w - px0 - 70),
        h: h * 0.64,
      };
      const g = panel(ctx, rect, [0, tc], [0, fp * 1.16], pal,
        { xlab: 't / s', ylab: 'F / N', nx: 4, ny: 4 });

      /* 整条曲线（浅色） */
      const pts = [];
      for (let i = 0; i <= 96; i++) {
        const xx = (i / 96) * tc;
        pts.push([xx, fp * Math.sin((Math.PI * i) / 96)]);
      }
      poly(ctx, g.X, g.Y, pts, pal.faint, 1.6);

      /* 已累积的冲量：曲线下的面积 */
      const cut = Math.max(1, Math.round(u * 96));
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(g.X(0), g.Y(0));
      for (let i = 0; i <= cut; i++) {
        const xx = (i / 96) * tc;
        ctx.lineTo(g.X(xx), g.Y(fp * Math.sin((Math.PI * i) / 96)));
      }
      ctx.lineTo(g.X((cut / 96) * tc), g.Y(0));
      ctx.closePath();
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = 0.22;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.restore();

      /* 平均作用力虚线 */
      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = pal.cyan;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(rect.x, g.Y(fav));
      ctx.lineTo(rect.x + rect.w, g.Y(fav));
      ctx.stroke();
      ctx.restore();
      label(ctx, 'F̄ = Δp/Δt = ' + fmt(fav, 0) + ' N',
        rect.x + rect.w - 4, g.Y(fav) - 10, pal.cyan, 'right', 13);

      if (phase === 1) {
        poly(ctx, g.X, g.Y, pts.slice(0, cut + 1), pal.orange, 2.4);
        spot(ctx, g.X(tau), g.Y(F), 5, pal.orange, pal.bg2);
        label(ctx, 'I(τ) = ' + fmt(Iacc, 2) + ' N·s',
          rect.x + 8, rect.y + 15, pal.mut, 'left', 13);
      } else {
        label(ctx, phase === 0 ? '还没接触，F = 0' : '已经离开，F = 0',
          rect.x + 8, rect.y + 15, pal.mut, 'left', 13);
      }
    }

    st.readout([
      ['质量 m', fmt(m, 2) + ' kg'],
      ['碰前速率 v', fmt(v, 1) + ' m/s'],
      ['动量变化 Δp = 2mv', fmt(dp, 1) + ' kg·m/s'],
      ['接触时间 Δt', fmt(tc * 1000, 0) + ' ms'],
      ['平均作用力 F̄ = Δp/Δt', fmt(fav, 0) + ' N'],
      ['峰值力 Fp = πF̄/2', fmt(fp, 0) + ' N'],
      ['此刻冲量 I(τ)', fmt(Iacc, 2) + ' N·s'],
    ]);
  }

  return { frame, reset };
}
