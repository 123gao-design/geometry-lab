/* 实2 验证牛顿第二定律：小车在轨道上被砂桶拉着加速。
   拉力取砂桶的重力（前提是砂桶质量远小于小车），纸带测出加速度 a；
   右栏画 a 随 F 的直线，斜率就是 1/m，拖 m 斜率跟着变。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

export function create(st) {
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const F = clamp(fn(q.F, 0.4), 0.1, 1);
    const m = clamp(fn(q.m, 0.5), 0.2, 1);
    const a = F / m;
    const g0 = 9.8;

    const key = F + ',' + m;
    if (key !== last) last = key;

    ctx.clearRect(0, 0, w, h);

    // 轨道
    const railY = h * 0.46;
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.06, railY);
    ctx.lineTo(w * 0.56, railY);
    ctx.stroke();
    ctx.restore();
    label(ctx, '光滑轨道', w * 0.10, railY + 20, pal.mut, 'left', 12);

    // 小车
    const cw = w * 0.10, ch = Math.max(26, h * 0.075);
    const cx = w * 0.22;
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(cx - cw / 2, railY - ch, cw, ch, 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    label(ctx, 'm', cx, railY - ch / 2 + 5, pal.blue, 'center', 14);

    // 滑轮
    const px = w * 0.56, py = railY;
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(px, py, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 绳
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx + cw / 2, railY - ch / 2);
    ctx.lineTo(px, py);
    ctx.lineTo(px, h * 0.70);
    ctx.stroke();
    ctx.restore();

    // 砂桶
    const by = h * 0.72;
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.globalAlpha = 0.75;
    ctx.beginPath();
    ctx.roundRect(px - 18, by, 36, 26, 4);
    ctx.fill();
    ctx.restore();
    label(ctx, '砂桶', px, by + 44, pal.orange, 'center', 12);
    arrow(ctx, px, by + 30, px, by + 62, pal.orange, 2);
    label(ctx, 'F = mg', px + 8, by + 56, pal.orange, 'left', 12);

    // 车上的拉力与加速度
    arrow(ctx, cx + cw / 2 + 6, railY - ch / 2, cx + cw / 2 + 58, railY - ch / 2, pal.orange, 2.2);
    label(ctx, 'F', cx + cw / 2 + 34, railY - ch / 2 - 10, pal.orange, 'center', 13);
    arrow(ctx, cx - cw / 2, railY + 10, cx - cw / 2 + Math.min(90, 30 + a * 18), railY + 10, pal.green, 2);
    label(ctx, 'a', cx - cw / 2 + Math.min(90, 30 + a * 18) + 6, railY + 14, pal.green, 'left', 13);

    // 右栏 a–F 图
    const rect = { x: w * 0.62, y: h * 0.16, w: w * 0.34, h: h * 0.66 };
    const g = panel(ctx, rect, [0, 1.2], [0, 5.5], pal, { xlab: 'F/N', ylab: 'a/(m·s⁻²)', nx: 3, ny: 5 });

    const line = [[0, 0], [1.2, 1.2 / m]];
    poly(ctx, g.X, g.Y, line, pal.purple, 2, [6, 4]);
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(g.X(F), g.Y(a), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, `斜率 = 1/m = ${fmt(1 / m, 2)}`, rect.x + 6, rect.y - 12, pal.mut, 'left', 12);

    st.readout([
      ['拉力 F（取砂桶重力）', fmt(F, 2) + ' N'],
      ['砂桶质量 F/g', fmt(F / g0, 3) + ' kg'],
      ['小车质量 m', fmt(m, 2) + ' kg'],
      ['加速度 a', fmt(a, 2) + ' m/s²'],
      ['1/m', fmt(1 / m, 2) + ' kg⁻¹'],
      ['F/m', fmt(F / m, 2) + ' m/s²'],
      ['图线斜率', fmt(1 / m, 2)],
      ['判读', 'a 与 F 成正比、与 m 成反比'],
    ]);
  }

  return { frame };
}
