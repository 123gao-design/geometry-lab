/* 力的分解：斜面上的物块，重力按效果拆成沿斜面向下的 mg sinθ 与压向斜面的 mg cosθ。
   两支分力互相垂直，虚线围成矩形，重力正是它的对角线。
   右图画两个分力随倾角的变化：一个按 sinθ 升，一个按 cosθ 降。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

export function create(st) {
  function frame() {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const p = st.params;
    const m = clamp(Number(p.m) || 2, 0.5, 5);
    const th = clamp(Number(p.th) || 30, 10, 80);
    const rad = (th * Math.PI) / 180;
    const G = m * 9.8;

    ctx.clearRect(0, 0, w, h);

    /* ── 左：斜面与物块 ── */
    const yG = Math.round(h * 0.84) + 0.5;
    const B0 = { x: w * 0.07, y: yG };
    let L = (w * 0.30) / Math.cos(rad);
    L = Math.min(L, (h * 0.30) / Math.max(Math.sin(rad), 0.12));
    const T0 = { x: B0.x + L * Math.cos(rad), y: B0.y - L * Math.sin(rad) };

    ctx.beginPath();
    ctx.moveTo(B0.x, B0.y);
    ctx.lineTo(T0.x, T0.y);
    ctx.lineTo(T0.x, B0.y);
    ctx.closePath();
    ctx.fillStyle = pal.bg2;
    ctx.fill();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    arrow(ctx, w * 0.03, yG, w * 0.47, yG, pal.faint, 1.2);

    /* 倾角弧 */
    const ar = Math.min(L * 0.30, 46);
    ctx.beginPath();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.3;
    ctx.arc(B0.x, B0.y, ar, -rad, 0, false);
    ctx.stroke();
    label(ctx, 'θ = ' + fmt(th, 0) + '°', B0.x + ar + 10, B0.y - ar * 0.34, pal.mut, 'left', 13);

    /* 物块 */
    const ux = Math.cos(rad);
    const uy = -Math.sin(rad);
    const P = {
      x: B0.x + 0.55 * L * ux - Math.sin(rad) * 13,
      y: B0.y + 0.55 * L * uy - Math.cos(rad) * 13,
    };
    ctx.save();
    ctx.translate(P.x, P.y);
    ctx.rotate(-rad);
    ctx.fillStyle = pal.bg2;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.rect(-17, -13, 34, 26);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    /* 重力与两支分力 */
    const Lg = Math.min(h * 0.26, 96);
    const ax = P.x + Math.sin(rad) * Lg * Math.cos(rad); // 垂直分量终点（压向斜面）
    const ay = P.y + Math.cos(rad) * Lg * Math.cos(rad);
    const bx = P.x - Math.cos(rad) * Lg * Math.sin(rad); // 沿斜面分量终点
    const by = P.y + Math.sin(rad) * Lg * Math.sin(rad);
    const gx = P.x;
    const gy = P.y + Lg;

    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(ax, ay);
    ctx.moveTo(gx, gy);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();

    arrow(ctx, P.x, P.y, gx, gy, pal.orange, 2.4);
    label(ctx, 'mg', gx + 8, gy - 4, pal.orange, 'left', 14);
    arrow(ctx, P.x, P.y, bx, by, pal.green, 2.2);
    label(ctx, 'mg sinθ', bx - 4, by + 16, pal.green, 'center', 13);
    arrow(ctx, P.x, P.y, ax, ay, pal.blue, 2.2);
    label(ctx, 'mg cosθ', ax + 2, ay + 16, pal.blue, 'center', 13);

    label(ctx, '重力按效果分解：沿斜面下滑 + 压紧斜面', w * 0.05, h * 0.10, pal.blue, 'left', 15);

    /* ── 右：两个分力随倾角的变化 ── */
    const rect = { x: w * 0.55, y: h * 0.16, w: w * 0.40, h: h * 0.66 };
    const g = panel(ctx, rect, [0, 90], [0, G * 1.06], pal, {
      xlab: 'θ / °',
      ylab: 'F / N',
      nx: 6,
      ny: 4,
    });

    const pts1 = [];
    const pts2 = [];
    for (let i = 0; i <= 90; i++) {
      pts1.push([i, G * Math.sin((i * Math.PI) / 180)]);
      pts2.push([i, G * Math.cos((i * Math.PI) / 180)]);
    }
    poly(ctx, g.X, g.Y, pts1, pal.green, 2.2);
    poly(ctx, g.X, g.Y, pts2, pal.blue, 2.2);
    label(ctx, 'mg sinθ', g.X(74), g.Y(G * Math.sin((74 * Math.PI) / 180)) - 12, pal.green, 'center', 13);
    label(ctx, 'mg cosθ', g.X(24), g.Y(G * Math.cos((24 * Math.PI) / 180)) + 16, pal.blue, 'center', 13);

    spot(ctx, g.X(th), g.Y(G * Math.sin(rad)), 5.5, pal.green, pal.bg2);
    spot(ctx, g.X(th), g.Y(G * Math.cos(rad)), 5.5, pal.blue, pal.bg2);

    st.readout([
      ['倾角 θ', fmt(th, 0) + '°'],
      ['重力 mg', fmt(G, 1) + ' N'],
      ['沿斜面 mg sinθ', fmt(G * Math.sin(rad), 1) + ' N'],
      ['压斜面 mg cosθ', fmt(G * Math.cos(rad), 1) + ' N'],
      ['两分力平方和', fmt(G * G * (Math.sin(rad) ** 2 + Math.cos(rad) ** 2), 1)],
      ['(mg)²', fmt(G * G, 1)],
    ]);
  }

  return { frame };
}
