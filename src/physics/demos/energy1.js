/* 演示：功与功率。
   水平地面上一个物块，拉力 F 与位移方向成 θ 角。
   功只看「沿位移方向的那个分力」：把 F 分解成水平的 F cosθ 与竖直的 F sinθ，
   竖直那一支不做功，W = F·s·cosθ。
   θ 从 0 拖到 180：锐角做正功、直角不做功、钝角做负功，右栏那条余弦曲线的正负正好对上。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const DEG = Math.PI / 180;

export function create(st) {
  let last = '';

  function frame(dt) {
    const p = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const F = clamp(nn(p.F, 8), 2, 20);
    const th = clamp(nn(p.th, 30), 0, 180);
    const s = clamp(nn(p.s, 3), 1, 6);
    const v = clamp(nn(p.v, 2), 0.5, 4);
    const key = [F, th, s, v].join('|');
    if (key !== last) last = key;

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const dual = w >= 640;
    const sw = dual ? w * 0.56 : w - 16;
    const cy = h * 0.52;
    const a = th * DEG;
    const W = F * s * Math.cos(a);
    const P = F * v * Math.cos(a);

    /* 位移的像素长度：6 m 占画宽的六成 */
    const U = (sw * 0.60) / 6;
    const Ls = s * U;

    const gy = cy + 30;                 // 地面线
    const bx = sw * 0.30;               // 物块中心
    const half = 32;                    // 物块半边
    const bh = 48;                      // 物块高

    /* 地面 */
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(sw * 0.05, gy);
    ctx.lineTo(sw * 0.92, gy);
    ctx.stroke();
    ctx.restore();

    /* 位移：从物块中心沿地面向右，长 Ls */
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(bx, gy + 20);
    ctx.lineTo(bx + Ls, gy + 20);
    ctx.stroke();
    ctx.restore();
    arrow(ctx, bx, gy + 20, bx + Ls, gy + 20, pal.cyan, 2);
    /* 端点竖线，标出 s 的量到哪 */
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.moveTo(bx + Ls, gy + 20);
    ctx.lineTo(bx + Ls, gy - 6);
    ctx.stroke();
    ctx.restore();
    label(ctx, 's = ' + fmt(s, 1) + ' m', bx + Ls * 0.5, gy + 38, pal.cyan, 'center', 13);

    /* 物块：质量标在块内右下角，把块上方的位置让给拉力与分力 */
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.22;
    ctx.fillRect(bx - half, gy - bh, half * 2, bh);
    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(bx - half, gy - bh, half * 2, bh);
    ctx.restore();
    label(ctx, 'm', bx + half - 7, gy - 9, pal.blue, 'right', 13);

    /* 拉力：从物块中心（重心）出发，与水平成 θ 角 */
    const ox = bx;
    const oy = gy - bh * 0.5;
    const Lf = 80 + 62 * (F / 20);
    const ex = ox + Lf * Math.cos(a);
    const ey = oy - Lf * Math.sin(a);
    arrow(ctx, ox, oy, ex, ey, pal.orange, 2.6);
    label(ctx, 'F', ex + 14 * Math.cos(a), ey - 14 * Math.sin(a) - 2, pal.orange, 'center', 14);

    /* θ 角弧：从位移方向（+x，画布上是 θ=0）向上扫到绳的方向 */
    if (th > 2) {
      ctx.save();
      ctx.strokeStyle = pal.orange;
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(ox, oy, 34, 0, -a, true);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'θ = ' + fmt(th, 0) + '°', ox + 50 * Math.cos(a / 2), oy - 50 * Math.sin(a / 2),
        pal.orange, 'center', 13);
    }

    /* 分解：水平分力 F cosθ（实画）、竖直分力 F sinθ（虚线围成的平行四边形） */
    const fx = ex;
    const fy = ey;
    const horiz = Math.abs(F * Math.cos(a));
    const midY = (oy + fy) / 2;

    /* 平行四边形：左竖边就是竖直分力，右竖边与顶边把矩形补全 */
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = pal.purple;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox, fy);
    ctx.moveTo(fx, oy);
    ctx.lineTo(fx, fy);
    if (Math.abs(fx - ox) > 4) {
      ctx.moveTo(ox, fy);
      ctx.lineTo(fx, fy);
    }
    ctx.stroke();
    ctx.restore();

    /* 竖直分力的标注：放在右竖边外侧，挤不进块旁就拉到块右边再引一条细虚线 */
    if (Math.abs(Math.sin(a)) > 0.05) {
      const lx = Math.max(fx + 8, bx + half + 12);
      if (lx - fx > 14) {
        ctx.save();
        ctx.setLineDash([3, 3]);
        ctx.strokeStyle = pal.purple;
        ctx.globalAlpha = 0.55;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(fx, midY);
        ctx.lineTo(lx - 4, midY);
        ctx.stroke();
        ctx.restore();
      }
      label(ctx, 'F sinθ', lx, midY, pal.purple, 'left', 13);
    }

    if (horiz > 0.05) {
      arrow(ctx, ox, oy, fx, oy, pal.green, 2.2);
      const dir = fx >= ox ? 1 : -1;
      const edge = bx + dir * (half + 12);
      const lx = dir > 0 ? Math.max(fx + 10, edge) : Math.min(fx - 10, edge);
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = pal.green;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(fx + dir * 6, oy);
      ctx.lineTo(lx - dir * 4, oy);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'F cosθ', lx, oy, pal.green, dir > 0 ? 'left' : 'right', 13);
    }

    /* 不做功的提示：压到位移箭头下面，不与 s 的量线打架 */
    if (th === 90) {
      label(ctx, '竖直拉力不做功', ox, gy + 62, pal.pink, 'center', 13);
    } else if (th > 90) {
      label(ctx, '推力与位移反向，做负功', ox, gy + 62, pal.pink, 'center', 13);
    }

    /* ── 右：W 随 θ 变化 ── */
    if (dual) {
      const px0 = sw + 20;
      const pw = w - px0 - 20;
      const ph = Math.min(260, Math.max(120, h - 170));
      const rect = {
        x: px0 + 30,
        y: Math.max(52, (h - ph) / 2),
        w: Math.max(130, pw - 46),
        h: ph,
      };
      const Wmax = F * s;
      const g = panel(ctx, rect, [0, 180], [-Wmax * 1.2, Wmax * 1.2], pal,
        { xlab: 'θ / °', ylab: 'W / J', nx: 4, ny: 4 });

      const pts = [];
      for (let i = 0; i <= 120; i++) {
        const t = (180 * i) / 120;
        pts.push([t, F * s * Math.cos(t * DEG)]);
      }
      poly(ctx, g.X, g.Y, pts, pal.orange, 2.2);

      /* 正负功分界 */
      const y0 = g.Y(0);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(g.X(90), g.ay);
      ctx.lineTo(g.X(90), rect.y);
      ctx.stroke();
      ctx.restore();
      label(ctx, '90°', g.X(90), g.ay + 13, pal.faint, 'center', 12);
      label(ctx, '正功', g.X(40), y0 - 10, pal.green, 'center', 13);
      label(ctx, '不做功', g.X(90), y0 - 10, pal.mut, 'center', 13);
      label(ctx, '负功', g.X(140), y0 - 10, pal.pink, 'center', 13);

      spot(ctx, g.X(th), g.Y(W), 5, pal.orange, pal.bg2);
    }

    st.readout([
      ['拉力 F', fmt(F, 1) + ' N'],
      ['与位移的夹角 θ', fmt(th, 0) + '°'],
      ['位移 s', fmt(s, 1) + ' m'],
      ['沿位移的分力 F cosθ', fmt(F * Math.cos(a), 2) + ' N'],
      ['做的功 W', fmt(W, 1) + ' J'],
      ['功率 P = Fv cosθ', fmt(P, 1) + ' W'],
    ]);
  }

  return { frame };
}
