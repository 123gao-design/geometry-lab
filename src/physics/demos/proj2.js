/* 演示：平抛运动。
   左边是抛出台和地面：小球以水平初速 v₀ 抛出，轨迹是一条抛物线，
   轨迹上的小点是等时间间隔的位置——水平方向间隔相等、竖直方向越往下越密，
   正好是「匀速 + 自由落体」两件事各管一边。
   小球身上画三根箭头：蓝的是水平分速度（长度始终不变），橙的是竖直分速度（由零开始变大），
   绿的是合速度，末端与轨迹相切。
   右边是 v-t 图：蓝线水平、橙线过原点且斜率等于 g、绿线是两者的合成。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const G = 9.8;
const NSEG = 8;   // 轨迹上等时间间隔的段数

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const v0 = clamp(num(p.v0, 8), 1, 20);
    const hh = clamp(num(p.h, 20), 1, 60);
    const key = v0 + '|' + hh;
    if (key !== last) { last = key; reset(); }

    const T = Math.sqrt((2 * hh) / G);       // 飞行时间只由高度决定
    const X = v0 * T;                        // 水平射程
    const cyc = T + 0.7;
    if (dt > 0) {
      t += dt;
      if (t > cyc) t -= cyc;
    }
    const tc = Math.min(t, T);
    const x = v0 * tc;
    const y = 0.5 * G * tc * tc;
    const vx = v0;
    const vy = G * tc;
    const vv = Math.hypot(vx, vy);

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const dual = w >= 620;
    const sw = dual ? w * 0.56 : w - 16;
    const sx0 = 24;
    const sx1 = sw - 8;
    const topY = 46;
    const botY = h - 28;

    /* ── 取景：横向按射程、纵向按抛出高度，两边等比 ── */
    const boxW = Math.max(60, sx1 - sx0 - 26);
    const boxH = Math.max(50, botY - topY - 12);
    const pxM = Math.min(boxW / Math.max(X, 0.8), boxH / hh) * 0.95;
    const lx = sx0 + 14;
    const yG = botY;
    const ly = yG - hh * pxM;
    const PX = u => lx + u * pxM;
    const PY = v => yG - v * pxM;

    /* 抛出台与地面 */
    ctx.save();
    ctx.fillStyle = pal.line;
    ctx.globalAlpha = 0.45;
    ctx.beginPath();
    ctx.moveTo(lx - 26, yG);
    ctx.lineTo(lx, yG);
    ctx.lineTo(lx, ly + 2);
    ctx.lineTo(lx - 26, ly + 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(sx0 - 6, yG + 0.5);
    ctx.lineTo(sx1 + 4, yG + 0.5);
    ctx.stroke();
    ctx.restore();

    /* 整条轨迹（虚线）与已走过的部分（实线）
       抛出点在左上方，下落高度从 hh 一路减到 0 —— y 轴朝下，别把落差写成抬升 */
    const tx = u => PX(v0 * u);
    const ty = u => PY(hh - 0.5 * G * u * u);
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.blue;
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
    ctx.strokeStyle = pal.blue;
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

    /* 等时间间隔的位置点 */
    ctx.save();
    ctx.fillStyle = pal.faint;
    for (let k = 1; k <= NSEG; k++) {
      const u = (T * k) / NSEG;
      ctx.beginPath();
      ctx.arc(tx(u), ty(u), 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    /* 初速度：固定在抛出点画一次，说明「初速水平」 */
    const k0 = Math.min(7, 34 / Math.max(v0, 1));
    arrow(ctx, lx + 5, ly, lx + 5 + v0 * k0, ly, pal.blue, 1.8);

    /* 小球与三根速度箭头：长度随余地收放，不出画框、不入地面 */
    const bx = PX(x);
    const by = PY(hh - y);
    const kv = Math.min(7, 46 / Math.max(v0, G * T, 1));
    const axLen = Math.min(vx * kv, sx1 - bx - 8);
    const ayLen = Math.min(vy * kv, Math.max(0, yG - by - 5));
    if (axLen > 6) arrow(ctx, bx, by, bx + axLen, by, pal.blue, 2);
    if (ayLen > 6) arrow(ctx, bx, by, bx, by + ayLen, pal.orange, 2);
    if (axLen > 6 || ayLen > 6) arrow(ctx, bx, by, bx + axLen, by + ayLen, pal.green, 2.2);

    if (axLen > 20) label(ctx, 'v水平', bx + axLen / 2, by - 12, pal.blue, 'center', 12);
    if (ayLen > 20) label(ctx, 'v竖直', bx - 8, by + ayLen / 2, pal.orange, 'right', 12);

    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(bx, by, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    /* ── 右：v-t 图 ── */
    if (dual) {
      const px0 = sw + 24;
      const pw = Math.max(140, w - px0 - 20);
      const r = { x: px0, y: 26, w: pw, h: Math.max(90, h - 26 - 48) };
      const vTop = Math.max(v0, G * T, 1) * 1.16;
      const g = panel(ctx, r, [0, T * 1.06], [0, vTop], pal, {
        xlab: 't / s',
        ylab: 'v / (m/s)',
        nx: 4,
        ny: 4,
      });

      poly(ctx, g.X, g.Y, [[0, v0], [T, v0]], pal.blue, 2.2);
      poly(ctx, g.X, g.Y, [[0, 0], [T, G * T]], pal.orange, 2.2);
      const pts = [];
      for (let i = 0; i <= 40; i++) {
        const u = (T * i) / 40;
        pts.push([u, Math.hypot(v0, G * u)]);
      }
      poly(ctx, g.X, g.Y, pts, pal.green, 2.2);

      if (tc > 0.01) {
        ctx.save();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = pal.faint;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(g.X(tc), g.Y(0));
        ctx.lineTo(g.X(tc), g.Y(vTop));
        ctx.stroke();
        ctx.restore();
      }
      spot(ctx, g.X(tc), g.Y(vx), 3.4, pal.blue, pal.bg2);
      spot(ctx, g.X(tc), g.Y(vy), 3.4, pal.orange, pal.bg2);
      spot(ctx, g.X(tc), g.Y(vv), 3.4, pal.green, pal.bg2);

      label(ctx, 'v竖直', g.X(T * 0.34), g.Y(G * T * 0.34) + 14, pal.orange, 'center', 12);
      label(ctx, 'v水平', g.X(T * 0.5), g.Y(v0) - 12, pal.blue, 'center', 12);
      label(ctx, 'v合', g.X(T * 0.82), g.Y(Math.hypot(v0, G * T * 0.82)) - 12, pal.green, 'center', 12);
      label(ctx, '竖直图线的斜率等于 g', r.x + r.w - 12, r.y + 15, pal.mut, 'right', 12);
    }

    st.readout([
      ['时间 t', fmt(tc, 2) + ' s'],
      ['水平位移 x', fmt(x, 2) + ' m'],
      ['下落高度 y', fmt(y, 2) + ' m'],
      ['水平速度 vx', fmt(vx, 2) + ' m/s'],
      ['竖直速度 vy', fmt(vy, 2) + ' m/s'],
      ['合速度 v', fmt(vv, 2) + ' m/s'],
      ['速度偏角 tanθ', fmt(vy / vx, 2)],
    ]);
  }

  return { frame, reset };
}
