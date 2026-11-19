/* 演示：小船渡河——运动的合成与分解。
   河水向右流，船头与河岸成 θ 角。船对水的速度 v船（橙）与水的流速 v水（蓝）
   按三角形定则合成，实际沿绿色 v合 方向靠向对岸。
   蓝色虚线是不计水流时的航线：它与橙线在同一时刻到达同一条横线，
   说明渡河时间只由垂直于河岸的分速度决定，与水速无关——这就是分运动的独立性。
   宽屏右栏画出速度的平行四边形，三条边与左栏同色。 */

import { label, arrow, clamp, fmt } from '../gfx.js';

const D = 20;   // 河宽，m

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const vb = clamp(num(p.vb, 3), 1, 4);        // 船在静水中的速度
    const vw = clamp(num(p.vw, 1.5), 0, 3);      // 水流速度
    const thd = clamp(num(p.th, 60), 30, 90);    // 船头与河岸的夹角
    const th = (thd * Math.PI) / 180;
    const key = vb + '|' + vw + '|' + thd;
    if (key !== last) { last = key; reset(); }

    const sinT = Math.sin(th);
    const cosT = Math.cos(th);
    const T = D / (vb * sinT);                   // 渡河时间
    const vx = vw + vb * cosT;                   // 沿河岸的合速度
    const vy = vb * sinT;                        // 垂直河岸的合速度
    const speed = Math.hypot(vx, vy);
    const drift = vx * T;                        // 顺流漂移
    const drift0 = vb * cosT * T;                // 不计水流时的漂移
    const cyc = T + 0.8;

    if (dt > 0) {
      t += dt;
      if (t > cyc) t -= cyc;
    }
    const tc = Math.min(t, T);
    const x = vx * tc;
    const y = vy * tc;

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const dual = w >= 640;                       // 宽屏才容得下右边的平行四边形
    const sw = dual ? w * 0.55 : w - 16;
    const sx0 = 16;
    const sx1 = sw - 10;
    const topY = 44;
    const botY = h - 26;

    /* ── 河面取景：横向按漂移、纵向按河宽，两边等比 ── */
    const boxW = Math.max(60, sx1 - sx0 - 18);
    const boxH = Math.max(70, botY - topY - 16);
    const spanX = Math.max(drift, drift0, D * 0.7) * 1.06;
    const pxM = Math.min(boxW / spanX, boxH / D);
    const X0 = sx0 + 10;
    const yB = botY;
    const yT = yB - D * pxM;

    /* 河面与两岸 */
    ctx.save();
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = pal.blue;
    ctx.fillRect(sx0, yT, sx1 - sx0, yB - yT);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sx0, Math.round(yT) + 0.5);
    ctx.lineTo(sx1, Math.round(yT) + 0.5);
    ctx.moveTo(sx0, Math.round(yB) + 0.5);
    ctx.lineTo(sx1, Math.round(yB) + 0.5);
    ctx.stroke();
    ctx.restore();

    /* 水面上的流动记号 */
    ctx.save();
    ctx.globalAlpha = 0.34;
    for (const fy of [0.28, 0.72]) {
      const yy = yT + (yB - yT) * fy;
      for (const cxr of [0.3, 0.64, 0.96]) {
        const ax = sx0 + (sx1 - sx0) * cxr - 30;
        arrow(ctx, ax, yy, ax + 26, yy, pal.blue, 1.3);
      }
    }
    ctx.restore();

    /* 顶部一行：水流方向；窄屏再加一条颜色图例 */
    label(ctx, '水流方向 →', sx1, topY - 24, pal.mut, 'right', 12);
    if (!dual) {
      label(ctx, '水速', sx0 + 8, topY - 24, pal.blue, 'left', 12);
      label(ctx, '船速', sx0 + 48, topY - 24, pal.orange, 'left', 12);
      label(ctx, '合速度', sx0 + 90, topY - 24, pal.green, 'left', 12);
    }

    /* 起点 */
    ctx.save();
    ctx.fillStyle = pal.mut;
    ctx.beginPath();
    ctx.arc(X0, yB, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const realX = X0 + x * pxM;
    const realY = yB - y * pxM;
    const phX = X0 + vb * cosT * tc * pxM;
    const pxEnd = X0 + drift0 * pxM;
    const rxEnd = X0 + drift * pxM;

    /* 不计水流的航线（蓝虚线）与实际航线（橙虚线整条、橙实线已走） */
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = pal.blue;
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.moveTo(X0, yB);
    ctx.lineTo(pxEnd, yT);
    ctx.stroke();
    ctx.strokeStyle = pal.orange;
    ctx.globalAlpha = 0.42;
    ctx.beginPath();
    ctx.moveTo(X0, yB);
    ctx.lineTo(rxEnd, yT);
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(X0, yB);
    ctx.lineTo(realX, realY);
    ctx.stroke();
    ctx.restore();

    /* 同一时刻的横线：两只船头总在同一高度 */
    if (Math.abs(realX - phX) > 9) {
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(phX, realY);
      ctx.lineTo(realX, realY);
      ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.fillStyle = pal.bg2;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(phX, realY, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    /* 船上的速度三角形：水速 → 船速 → 合速度，箭头长度随余地收放，不越画框 */
    const bx = realX;
    const by = realY;
    const roomY = Math.max(10, by - topY - 6);
    const roomX = Math.max(10, sx1 - bx - 6);
    const baseKv = (dual ? 60 : 40) / Math.max(vb + vw, 1);
    const kv = Math.min(baseKv, roomX / Math.max(vx, 0.3), roomY / Math.max(vy, 0.3));
    const wx1 = bx + vw * kv;
    const hx1 = wx1 + vb * kv * cosT;
    const hy1 = by - vb * kv * sinT;
    if (vw > 0.05) arrow(ctx, bx, by, wx1, by, pal.blue, 2);
    arrow(ctx, wx1, by, hx1, hy1, pal.orange, 2);
    arrow(ctx, bx, by, hx1, hy1, pal.green, 2.2);

    /* 船头：小三角，指向船头方向 */
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate(-th);
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(9, 0);
    ctx.lineTo(-6, 5);
    ctx.lineTo(-6, -5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    /* ── 右栏：速度的平行四边形 ── */
    if (dual) {
      const rx0 = sw + 14;
      const rx1 = w - 14;
      const pw = rx1 - rx0;
      label(ctx, '速度的合成', rx0, 26, pal.ink, 'left', 15);
      const rows = [
        ['v水 = ' + fmt(vw, 1) + ' m/s', pal.blue],
        ['v船 = ' + fmt(vb, 1) + ' m/s', pal.orange],
        ['v合 = ' + fmt(speed, 2) + ' m/s', pal.green],
      ];
      for (let i = 0; i < rows.length; i++) {
        label(ctx, rows[i][0], rx0, 50 + i * 19, rows[i][1], 'left', 13);
      }

      const ox = rx0 + 22;
      const oy = Math.min(h - 58, h * 0.8);
      const kq = Math.max(12, Math.min(
        (pw - 90) / Math.max(vw + vb, 2),
        (oy - 126) / Math.max(vb, 1),
      ));
      const wx = ox + vw * kq;
      const hx = ox + vb * kq * cosT;
      const hy = oy - vb * kq * sinT;
      const tx = ox + vx * kq;
      const ty = oy - vy * kq;

      /* 河岸方向的参考线 */
      ctx.save();
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(rx1 - 4, oy);
      ctx.stroke();
      ctx.restore();
      label(ctx, '河岸方向', rx1 - 4, oy + 14, pal.faint, 'right', 12);

      /* 平行四边形的两条虚线边 */
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(wx, oy);
      ctx.lineTo(tx, ty);
      ctx.moveTo(hx, hy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.restore();

      if (vw > 0.05) arrow(ctx, ox, oy, wx, oy, pal.blue, 2.2);
      arrow(ctx, ox, oy, hx, hy, pal.orange, 2.2);
      arrow(ctx, ox, oy, tx, ty, pal.green, 2.4);

      /* θ 弧：从船头方向扫到河岸方向（画布 y 朝下，角度增大的方向在屏幕上是顺时针） */
      ctx.save();
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(ox, oy, 24, -th, 0, false);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'θ', ox + 38 * Math.cos(-th / 2), oy + 38 * Math.sin(-th / 2), pal.mut, 'center', 13);

      ctx.save();
      ctx.fillStyle = pal.ink;
      ctx.beginPath();
      ctx.arc(ox, oy, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    st.readout([
      ['渡河时间 t', fmt(T, 2) + ' s'],
      ['船速 v船', fmt(vb, 1) + ' m/s'],
      ['水速 v水', fmt(vw, 1) + ' m/s'],
      ['船头偏角 θ', fmt(thd, 0) + '°'],
      ['合速度 v合', fmt(speed, 2) + ' m/s'],
      ['顺流漂移 x', fmt(drift, 1) + ' m'],
    ]);
  }

  return { frame, reset };
}
