/* 电9 安培力。
   匀强磁场沿纸面水平向右，通电直导线绕中点转动，与磁场的夹角 θ 用滑块调。
   安培力 F = BIL sinθ 垂直于纸面，画成一支向右上方的斜箭头（约定俗成的
   「出纸面」画法），长度随 F 变；右栏画 F 随 θ 的正弦曲线。
   读数栏的 F/(BIL) 拖任何滑块都等于 sinθ，把这条定义式的三个因子拆开看。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

export function create(st) {
  function frame() {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const B = clamp(fn(q.B, 0.5), 0.1, 1.5);
    const I = clamp(fn(q.I, 4), 1, 10);
    const L = clamp(fn(q.L, 0.6), 0.2, 1.2);
    const th = clamp(fn(q.th, 90), 0, 180);
    const rad = (th * Math.PI) / 180;

    ctx.clearRect(0, 0, w, h);

    const BLI = B * I * L;
    const F = BLI * Math.sin(rad);

    const ox = w * 0.30;
    const oy = h * 0.52;
    const x0 = w * 0.07;
    const x1 = w * 0.53;

    // 匀强磁场：四行水平箭头
    for (let k = 0; k < 4; k++) {
      const yy = h * (0.22 + 0.2 * k);
      ctx.save();
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 1.6;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.moveTo(x0, yy);
      ctx.lineTo(x1 - 10, yy);
      ctx.stroke();
      ctx.restore();
      arrow(ctx, x1 - 12, yy, x1, yy, pal.mut, 1.6);
    }
    label(ctx, `B = ${fmt(B, 2)} T`, x0, h * 0.15, pal.mut, 'left', 14);

    // 导线：绕中点 O 转过 θ（屏幕坐标里正角朝上，所以取 −sin）
    const Lw = Math.min(w * 0.15, h * 0.20) * (0.45 + 0.55 * ((L - 0.2) / 1.0));
    const ux = Math.cos(rad);
    const uy = -Math.sin(rad);
    const ax = ox - ux * Lw;
    const ay = oy - uy * Lw;
    const bx = ox + ux * Lw;
    const by = oy + uy * Lw;

    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 3.4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();

    // 电流方向的两枚小箭头
    for (const f of [0.22, 0.78]) {
      const cx2 = ax + (bx - ax) * f;
      const cy2 = ay + (by - ay) * f;
      arrow(ctx, cx2 - ux * 8, cy2 - uy * 8, cx2 + ux * 8, cy2 + uy * 8, pal.orange, 2.2);
    }
    label(ctx, `I = ${fmt(I, 1)} A`, bx + ux * 14, by + uy * 14, pal.orange,
      ux >= 0 ? 'left' : 'right', 14);

    // 夹角 θ：从 B 的方向（+x）扫到导线，画布坐标里角度递减，anticlockwise 取 true
    const ar = Math.max(34, Lw * 0.55);
    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    if (th > 1 && th < 179) ctx.arc(ox, oy, ar, 0, -rad, true);
    ctx.stroke();
    ctx.restore();
    if (th > 1 && th < 179) {
      const ma = -rad / 2;
      label(ctx, `θ = ${fmt(th, 0)}°`, ox + Math.cos(ma) * (ar + 26), oy + Math.sin(ma) * (ar + 22),
        pal.purple, 'center', 14);
    }

    // 安培力：垂直于纸面朝外，按约定画成右上方的斜箭头
    const fs = Math.sin(rad);
    if (fs > 0.02) {
      const Fl = 20 + 78 * fs;
      const fx = ox + 0.68 * Fl;
      const fy = oy - 0.72 * Fl;
      arrow(ctx, ox, oy, fx, fy, pal.green, 3);
      label(ctx, `F = ${fmt(F, 2)} N`, fx + 10, fy - 6, pal.green, 'left', 14);
    }
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(ox, oy, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(ox, oy, 1.6, 0, Math.PI * 2);
    ctx.fillStyle = pal.green;
    ctx.fill();
    ctx.restore();

    label(ctx, '安培力垂直于纸面朝外（⊙）', x0, h * 0.86, pal.green, 'left', 13);
    if (th < 3 || th > 177) {
      label(ctx, '导线与磁场平行，安培力为零', ox + Lw * 0.4, oy + 34, pal.pink, 'center', 13);
    }

    /* 右栏：F 随 θ 的正弦曲线 */
    const rc = { x: w * 0.60, y: h * 0.18, w: w * 0.35, h: h * 0.58 };
    const g = panel(ctx, rc, [0, 180], [0, BLI * 1.08], pal, { xlab: 'θ/°', ylab: 'F/N', nx: 6, ny: 4 });
    const pts = [];
    for (let a = 0; a <= 180.001; a += 1.5) pts.push([a, BLI * Math.sin((a * Math.PI) / 180)]);
    poly(ctx, g.X, g.Y, pts, pal.cyan, 2.2);
    spot(ctx, g.X(th), g.Y(F), 5, pal.orange, pal.bg2);
    // 纵轴名 'F/N' 占着框内左上角，图例从它下面一行起
    label(ctx, 'F = BIL sinθ', rc.x + 8, rc.y + 34, pal.cyan, 'left', 14);
    label(ctx, 'θ = 90° 时最大，0° 与 180° 时为零', rc.x + 8, rc.y + 54, pal.faint, 'left', 13);

    st.readout([
      ['磁感应强度 B', fmt(B, 2) + ' T'],
      ['电流 I', fmt(I, 1) + ' A'],
      ['导线长度 L', fmt(L, 2) + ' m'],
      ['与磁场的夹角 θ', fmt(th, 0) + '°'],
      ['安培力 F = BIL sinθ', fmt(F, 2) + ' N'],
      ['F/(BIL)', fmt(F / BLI, 3)],
      ['sinθ', fmt(Math.sin(rad), 3)],
    ]);
  }

  return { frame };
}
