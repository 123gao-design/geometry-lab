/* 实10 测玻璃的折射率：插针法。
   P₁、P₂ 定入射光线，P₃、P₄ 定出射光线，进出玻璃砖的两点连起来就是玻璃里的光路。
   玻璃砖两面平行，出射光线与入射光线平行、只错开一段距离。
   入射角与折射角的正弦之比恒为 n：多次测量后画 sin i–sin r 图，各点落在一条过原点的
   直线上，斜率就是玻璃的折射率。左栏画整个插针光路，右栏画 sin i–sin r 直线。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

/** 大头针：一枚小圆点加一道垂直于光线的短杠 */
function pin(ctx, x, y, ux, uy, name, pal) {
  const px = uy, py = -ux;            // 垂直于光线、朝上的一侧
  ctx.save();
  ctx.strokeStyle = pal.mut;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x - px * 7, y - py * 7);
  ctx.lineTo(x + px * 7, y + py * 7);
  ctx.stroke();
  ctx.fillStyle = pal.ink;
  ctx.beginPath();
  ctx.arc(x, y, 3.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  label(ctx, name, x + px * 16 + ux * 3, y + py * 16 + uy * 3 + 3, pal.mut, 'center', 11);
}

export function create(st) {
  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const iDeg = clamp(fn(q.i, 45), 5, 80);
    const n = clamp(fn(q.n, 1.5), 1.2, 1.9);

    ctx.clearRect(0, 0, w, h);

    const iRad = (iDeg * Math.PI) / 180;
    const rRad = Math.asin(Math.sin(iRad) / n);
    const sI = Math.sin(iRad);
    const sR = Math.sin(rRad);
    const ux = Math.sin(iRad), uy = Math.cos(iRad);   // 光线的走向（向右下）

    // ———— 左栏：插针法的光路 ————
    const bx0 = w * 0.10, bx1 = w * 0.58;
    const by0 = h * 0.34, by1 = h * 0.72;
    const T = by1 - by0;
    const ox = w * 0.25, oy = by0;
    const qx = ox + T * Math.tan(rRad), qy = by1;

    // 玻璃砖
    ctx.save();
    ctx.fillStyle = pal.cyan;
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.roundRect(bx0, by0, bx1 - bx0, T, 8);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(bx0, by0, bx1 - bx0, T, 8);
    ctx.stroke();
    ctx.restore();
    label(ctx, '玻璃砖', bx1 - 14, by1 - 14, pal.cyan, 'right', 12);
    label(ctx, '空气', bx1 - 8, by0 - 12, pal.mut, 'right', 12);

    // 两条法线
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.1;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(ox, by0 - h * 0.14);
    ctx.lineTo(ox, by0 + T * 0.42);
    ctx.moveTo(qx, by1 - T * 0.42);
    ctx.lineTo(qx, by1 + h * 0.11);
    ctx.stroke();
    ctx.restore();
    label(ctx, '法线', ox - 7, by0 - h * 0.14 + 4, pal.mut, 'right', 11);

    // 入射光线的起点：上面留一截，左边不贴画框
    let tIn = (h * 0.13) / Math.max(0.22, Math.cos(iRad));
    tIn = Math.min(tIn, (ox - w * 0.06) / Math.max(0.1, Math.sin(iRad)));
    const ix = ox - tIn * ux, iy = oy - tIn * uy;
    arrow(ctx, ix, iy, ox, oy, pal.orange, 2);

    // 入射光线若直线前进会走的路（玻璃里的虚线延长）
    let sDash = T / Math.max(0.22, Math.cos(iRad));
    sDash = Math.min(sDash, (bx1 - 12 - ox) / Math.max(0.1, Math.sin(iRad)));
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + sDash * ux, oy + sDash * uy);
    ctx.stroke();
    ctx.restore();

    // 玻璃里的折射光线
    arrow(ctx, ox, oy, qx, qy, pal.orange, 2.2);

    // 出射光线（与入射光线平行）
    const tOutX = (w - 14 - qx) / Math.max(0.1, Math.sin(iRad));
    const tOut = Math.max(16, Math.min((h - 16 - qy) / Math.max(0.22, Math.cos(iRad)), tOutX));
    const ex = qx + tOut * ux, ey = qy + tOut * uy;
    arrow(ctx, qx, qy, ex, ey, pal.orange, 2);

    // 出射光线的反向延长
    let uBack = T / Math.max(0.22, Math.cos(iRad));
    uBack = Math.max(0, Math.min(uBack, (qx - bx0 - 6) / Math.max(0.1, Math.sin(iRad))));
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(qx, qy);
    ctx.lineTo(qx - uBack * ux, qy - uBack * uy);
    ctx.stroke();
    ctx.restore();

    // 侧移 δ：从出射点向入射光线的延长线作垂线
    const footP = T * Math.tan(rRad) * Math.sin(iRad) + T * Math.cos(iRad);
    const fx = ox + footP * ux, fy = oy + footP * uy;
    const dLen = Math.hypot(qx - fx, qy - fy);
    if (dLen > 10 && fx > bx0 + 4 && fx < bx1 - 4 && fy < by1 - 4) {
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(qx, qy);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'δ', (fx + qx) / 2 + 9, (fy + qy) / 2 - 4, pal.purple, 'left', 12);
    }

    // 四个大头针
    pin(ctx, ix + (ox - ix) * 0.28, iy + (oy - iy) * 0.28, ux, uy, 'P₁', pal);
    pin(ctx, ix + (ox - ix) * 0.78, iy + (oy - iy) * 0.78, ux, uy, 'P₂', pal);
    pin(ctx, qx + (ex - qx) * 0.32, qy + (ey - qy) * 0.32, ux, uy, 'P₃', pal);
    pin(ctx, qx + (ex - qx) * 0.74, qy + (ey - qy) * 0.74, ux, uy, 'P₄', pal);

    // 折射点与出射点
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(ox, oy, 3.4, 0, Math.PI * 2);
    ctx.arc(qx, qy, 3.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, 'O', ox + 9, oy - 7, pal.orange, 'left', 12);
    label(ctx, 'Q', qx + 9, qy + 16, pal.orange, 'left', 12);

    // 入射角与折射角
    const ar = Math.min(w * 0.05, h * 0.11);
    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(ox, oy, ar, -Math.PI / 2, -Math.PI / 2 - iRad, true);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ox, oy, ar, Math.PI / 2, Math.PI / 2 - rRad, true);
    ctx.stroke();
    ctx.restore();
    const li = -Math.PI / 2 - iRad / 2;
    label(ctx, 'i', ox + Math.cos(li) * (ar + 13), oy + Math.sin(li) * (ar + 13) + 4, pal.purple, 'center', 13);
    const lr = Math.PI / 2 - rRad / 2;
    label(ctx, 'r', ox + Math.cos(lr) * (ar + 13), oy + Math.sin(lr) * (ar + 13) + 4, pal.purple, 'center', 13);

    // ———— 右栏：sin i–sin r 图 ————
    const rect = { x: w * 0.62, y: h * 0.14, w: w * 0.34, h: h * 0.68 };
    const g = panel(ctx, rect, [0, 1], [0, 1], pal, { xlab: 'sin r', ylab: 'sin i', nx: 5, ny: 5 });

    // 图线 sin i = n sin r
    const xTop = Math.min(1, 1 / n);
    poly(ctx, g.X, g.Y, [[0, 0], [xTop, n * xTop]], pal.green, 1.9);

    // 若干次测量（每次取不同的入射角）
    for (const a of [15, 25, 35, 45, 55, 65, 75]) {
      const ai = (a * Math.PI) / 180;
      const ar2 = Math.asin(Math.sin(ai) / n);
      const j = 1 + 0.012 * Math.sin(a * 0.9 + 2);
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.arc(g.X(Math.sin(ar2)), g.Y(Math.min(1, Math.sin(ai) * j)), 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 当前这一组读数
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(g.X(sR), g.Y(sI));
    ctx.lineTo(g.X(sR), g.Y(0));
    ctx.moveTo(g.X(sR), g.Y(sI));
    ctx.lineTo(g.X(0), g.Y(sI));
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(g.X(sR), g.Y(sI), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, `斜率 = n = ${fmt(n, 2)}`, rect.x + 10, rect.y + 40, pal.green, 'left', 12);

    st.readout([
      ['入射角 i', fmt(iDeg, 1) + '°'],
      ['折射角 r', fmt((rRad * 180) / Math.PI, 1) + '°'],
      ['sin i', fmt(sI, 3)],
      ['sin r', fmt(sR, 3)],
      ['sin i ÷ sin r', fmt(sI / sR, 3)],
      ['玻璃的折射率 n', fmt(n, 2)],
      ['光在玻璃中的速度', fmt(3 / n, 2) + '×10⁸ m/s'],
      ['判读', 'sin i–sin r 图线过原点，斜率即 n'],
    ]);
  }

  return { frame };
}
