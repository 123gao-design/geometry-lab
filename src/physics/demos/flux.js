/* 电8 磁通量：Φ = BS cosθ。
   俯视图：匀强磁场沿纸面由左向右，一只正方形线圈绕竖直轴转过 θ，正对时它是一段
   竖直线，转过之后就斜过去——从磁场方向看过去「有效面积」缩成 S cosθ，穿过去的
   磁感线条数按同一比例减少。右栏画 Φ 随 θ 的余弦曲线，θ 过 90° 后 Φ 变负。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

export function create(st) {
  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const B = clamp(fn(q.B, 0.5), 0.1, 1.5);
    const S = clamp(fn(q.S, 0.02), 0.01, 0.05);
    const deg = clamp(fn(q.th, 60), 0, 180);
    const th = (deg * Math.PI) / 180;
    const cos = Math.cos(th);
    const phi = B * S * cos;

    ctx.clearRect(0, 0, w, h);

    /* ── 左栏：俯视图，线圈绕竖直轴转过 θ ───────────── */
    const fx0 = w * 0.06;
    const fx1 = w * 0.56;
    const fy0 = h * 0.16;
    const fy1 = h * 0.86;
    const cx = (fx0 + fx1) / 2;
    const cy = (fy0 + fy1) / 2;
    const Lw = Math.min(h * 0.52, (fy1 - fy0) * 0.72);

    // 磁场：一排水平箭头由左向右
    const rows = 7;
    const halfSpan = (Lw / 2) * Math.abs(cos);
    ctx.save();
    for (let i = 0; i < rows; i++) {
      const y = fy0 + (fy1 - fy0) * (0.1 + (0.8 * i) / (rows - 1));
      const hit = Math.abs(y - cy) <= halfSpan + 3;
      ctx.globalAlpha = hit ? 0.95 : 0.45;
      arrow(ctx, fx0 + 4, y, fx1 - 4, y, hit ? pal.green : pal.cyan, hit ? 1.8 : 1.3);
    }
    ctx.restore();
    label(ctx, '匀强磁场 B', fx0 + 4, fy0 - 6, pal.cyan, 'left', 14);
    label(ctx, '绿色：穿过线圈的磁感线', fx0 + 4, fy1 + 22, pal.green, 'left', 13);

    // 正对时的位置（虚线），与当前竖直线段对照
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, cy - Lw / 2);
    ctx.lineTo(cx, cy + Lw / 2);
    ctx.stroke();
    ctx.restore();

    // 线圈本体：俯视看是一条斜过去的窄条，竖直线时正对磁场
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(th);
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.16;
    ctx.fillRect(-6, -Lw / 2, 12, Lw);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 3;
    ctx.strokeRect(-6, -Lw / 2, 12, Lw);
    ctx.restore();
    label(ctx, '线圈（俯视）', cx + 12, cy + Lw / 2 + 18, pal.ink, 'left', 14);

    // 有效跨度：线圈在垂直于磁场方向上的投影长度 L cosθ
    const bx = cx + (Lw / 2) * 0.9 + 26;
    if (halfSpan > 7) {
      arrow(ctx, bx, cy, bx, cy - halfSpan, pal.purple, 1.4);
      arrow(ctx, bx, cy, bx, cy + halfSpan, pal.purple, 1.4);
      label(ctx, 'L cosθ', bx + 6, cy, pal.purple, 'left', 13);
    } else {
      label(ctx, 'L cosθ → 0', bx + 6, cy, pal.purple, 'left', 13);
    }

    // 法线与磁场成 θ：法线垂直于线圈，屏幕上取 (cosθ, sinθ) 方向
    const nr = Lw * 0.4;
    const nx = cx + Math.cos(th) * nr;
    const ny = cy + Math.sin(th) * nr;
    arrow(ctx, cx, cy, nx, ny, pal.purple, 2.2);
    label(ctx, '法线 n', nx + (Math.cos(th) >= 0 ? 6 : -6), ny - 8, pal.purple, Math.cos(th) >= 0 ? 'left' : 'end', 13);
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, Lw * 0.2, 0, th, false);
    ctx.stroke();
    ctx.restore();
    label(ctx, `θ = ${fmt(deg, 0)}°`, cx + Lw * 0.2 + 2, cy + Lw * 0.1, pal.orange, 'left', 14);

    /* ── 右栏：Φ 随 θ 的余弦曲线 ─────────────────────── */
    const rc = { x: w * 0.63, y: h * 0.2, w: w * 0.31, h: h * 0.56 };
    const top = B * S * 1000;
    const g = panel(ctx, rc, [0, 180], [-top, top], pal, { xlab: 'θ/°', ylab: 'Φ/mWb', nx: 6, ny: 4 });
    const pts = [];
    for (let i = 0; i <= 180; i += 2) pts.push([i, B * S * 1000 * Math.cos((i * Math.PI) / 180)]);
    poly(ctx, g.X, g.Y, pts, pal.cyan, 2.2);
    spot(ctx, g.X(deg), g.Y(phi * 1000), 5.5, pal.orange, pal.bg2);
    label(ctx, 'Φ = BS cosθ', rc.x + 8, rc.y + 15, pal.cyan, 'left', 14);
    label(ctx, 'θ = 90° 时为零', rc.x + 8, rc.y + 35, pal.faint, 'left', 13);

    st.readout([
      ['磁感应强度 B', fmt(B, 2) + ' T'],
      ['线圈面积 S', fmt(S * 1e4, 0) + ' cm²'],
      ['法线与磁场夹角 θ', fmt(deg, 0) + '°'],
      ['有效面积 S cosθ', fmt(S * 1e4 * cos, 0) + ' cm²'],
      ['磁通量 Φ = BS cosθ', fmt(phi * 1000, 2) + ' mWb'],
      ['Φ / (BS)', fmt(cos, 2)],
    ]);
  }

  return { frame };
}
