/* 演示：两个共点力的合成与平衡。
   以两个力为邻边作平行四边形，对角线就是合力；要让物体保持平衡，
   还需要一个与合力等大反向的第三个力。改变夹角，合力从 |F1−F2| 连续变到 F1+F2。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const F1 = clamp(Number(p.F1) || 6, 1, 10);
    const F2 = clamp(Number(p.F2) || 4, 1, 10);
    const th = (Number.isFinite(Number(p.th)) ? clamp(Number(p.th), 0, 180) : 60) * (Math.PI / 180);
    const key = [F1, F2, th].join('|');
    if (key !== last) { last = key; reset(); }

    if (dt > 0) t += dt;

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    // 每牛顿多少像素：按两个分力之和取景，四个方向（含 O 下方留给三行结论的位置）
    // 里最窄的一侧能放下最长的合力，滑块拖到极值也不会画出画外
    const O = { x: w * 0.40, y: h * 0.44 };
    const room = Math.min(O.x - 20, w - O.x - 20, O.y - 26, h - O.y - 84);
    const s = Math.max(2.4, Math.min(w * 0.026, h * 0.030, room / (F1 + F2)));

    const ax = O.x + F1 * s;
    const ay = O.y;
    const bx = O.x + F2 * s * Math.cos(th);
    const by = O.y - F2 * s * Math.sin(th);

    const F = Math.sqrt(F1 * F1 + F2 * F2 + 2 * F1 * F2 * Math.cos(th));
    const rg = Math.atan2(F2 * Math.sin(th), F1 + F2 * Math.cos(th)); // 合力与 F1 的夹角
    const rx = O.x + F * s * Math.cos(rg);
    const ry = O.y - F * s * Math.sin(rg);

    /* 平行四边形底色 */
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(O.x, O.y);
    ctx.lineTo(ax, ay);
    ctx.lineTo(rx, ry);
    ctx.lineTo(bx, by);
    ctx.closePath();
    ctx.globalAlpha = 0.10;
    ctx.fillStyle = pal.blue;
    ctx.fill();
    ctx.globalAlpha = 0.55;
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.restore();

    /* 两个分力 */
    arrow(ctx, O.x, O.y, ax, ay, pal.blue, 2.6);
    label(ctx, 'F₁', ax + 8, ay - 10, pal.blue, 'left', 14);

    arrow(ctx, O.x, O.y, bx, by, pal.orange, 2.6);
    label(ctx, 'F₂', bx + 8, by - 8, pal.orange, 'left', 14);

    /* 合力 */
    arrow(ctx, O.x, O.y, rx, ry, pal.green, 3);
    label(ctx, 'F = ' + fmt(F, 2) + ' N', rx + 10, ry - 8, pal.green, 'left', 14);

    /* 平衡力：与合力等大反向 */
    const qx = O.x - (rx - O.x);
    const qy = O.y - (ry - O.y);
    if (qx > 6 && qx < w - 6 && qy > 6 && qy < h - 6) {
      arrow(ctx, O.x, O.y, qx, qy, pal.purple, 2.2);
      label(ctx, '平衡力 F₃', qx - 8, qy + 14, pal.purple, 'right', 13);
    }

    /* 夹角弧：ang 是数学角（逆时针为正），画布 y 朝下，屏幕角取 −ang */
    const arc = (ang, r, col, txt, off) => {
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(O.x, O.y, r, -ang, 0, false);
      ctx.stroke();
      ctx.restore();
      const m = -ang / 2;
      label(ctx, txt, O.x + (r + off) * Math.cos(m), O.y + (r + off) * Math.sin(m), col, 'center', 12);
    };
    if (th > 0.02) arc(th, 52, pal.orange, 'θ = ' + fmt(th * 180 / Math.PI, 0) + '°', 12);
    if (rg > 0.02) arc(rg, 84, pal.green, 'α = ' + fmt(rg * 180 / Math.PI, 0) + '°', 10);

    spot(ctx, O.x, O.y, 4, pal.ink, pal.bg2);
    label(ctx, 'O', O.x - 10, O.y + 16, pal.ink, 'right', 13);

    /* 三条结论 */
    const lo = Math.abs(F1 - F2);
    const hi = F1 + F2;
    label(ctx, '合力介于 |F₁ − F₂| 与 F₁ + F₂ 之间', w * 0.06, h - 46, pal.mut, 'left', 12);
    label(ctx, fmt(lo, 2) + ' N ≤ F ≤ ' + fmt(hi, 2) + ' N', w * 0.06, h - 26, pal.mut, 'left', 12);

    label(
      ctx,
      th < 1e-6 ? '两力同向：F 最大' : Math.abs(th - Math.PI) < 0.02 ? '两力反向：F 最小' : '夹角越大，合力越小',
      w * 0.06,
      h - 66,
      pal.mut,
      'left',
      12,
    );

    st.readout([
      ['F₁', fmt(F1, 1) + ' N'],
      ['F₂', fmt(F2, 1) + ' N'],
      ['夹角 θ', fmt(th * 180 / Math.PI, 0) + '°'],
      ['合力 F', fmt(F, 2) + ' N'],
      ['F 与 F₁ 的夹角 α', fmt(rg * 180 / Math.PI, 1) + '°'],
      ['平衡所需第三力', fmt(F, 2) + ' N，与 F 反向'],
    ]);
  }

  return { frame, reset };
}
