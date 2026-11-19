/* 实3 验证机械能守恒：重物自由下落、纸带记录。
   取重物为研究对象，忽略阻力，下落 h 后 v² = 2gh，即 ½v² = gh。
   右栏把实测的 ½v² 点与理论直线 gh 画在一起，两者重合就说明机械能守恒。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

const G = 9.8;
const HMAX = 1.2;

export function create(st) {
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const hh = clamp(fn(q.h, 0.6), 0.1, HMAX);

    const key = String(hh);
    if (key !== last) last = key;

    ctx.clearRect(0, 0, w, h);

    const yTop = h * 0.12, yBot = h * 0.86;
    const yOf = z => yBot - (z / HMAX) * (yBot - yTop);

    // 标尺
    const rx = w * 0.10;
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(rx, yTop);
    ctx.lineTo(rx, yBot);
    ctx.stroke();
    ctx.restore();
    for (let z = 0; z <= HMAX + 1e-9; z += 0.2) {
      const y = yOf(z);
      ctx.save();
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rx - 6, y);
      ctx.lineTo(rx, y);
      ctx.stroke();
      ctx.restore();
      label(ctx, fmt(z, 1), rx - 10, y + 4, pal.mut, 'right', 11);
    }
    label(ctx, 'h/m', rx - 6, yTop - 12, pal.mut, 'right', 12);

    // 纸带
    const tx = w * 0.26;
    ctx.save();
    ctx.fillStyle = pal.bg2;
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(tx - 12, yTop - 16, 24, yBot - yTop + 24);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    // 每隔 0.05 m 一个点
    for (let z = 0; z <= hh + 1e-9; z += 0.05) {
      const y = yOf(z);
      ctx.save();
      ctx.fillStyle = pal.mut;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(tx, y, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 重物
    const oy = yOf(hh);
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.roundRect(tx + 18, oy - 16, 42, 32, 5);
    ctx.fill();
    ctx.restore();
    label(ctx, '重物', tx + 39, oy + 4, '#fff', 'center', 12);

    // 落点虚线
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(tx - 14, oy);
    ctx.lineTo(w * 0.53, oy);
    ctx.stroke();
    ctx.restore();
    label(ctx, `h = ${fmt(hh, 2)} m`, w * 0.535, oy + 4, pal.orange, 'left', 12);

    // 右栏 ½v²–h
    const rect = { x: w * 0.61, y: h * 0.16, w: w * 0.35, h: h * 0.66 };
    const g = panel(ctx, rect, [0, HMAX], [0, 14], pal, { xlab: 'h/m', ylab: '½v² 与 gh / (J·kg⁻¹)', nx: 3, ny: 7 });

    // 理论直线 gh
    poly(ctx, g.X, g.Y, [[0, 0], [HMAX, G * HMAX]], pal.green, 1.8, [6, 4]);

    // 实测点：带一点读数涨落
    const pts = [];
    for (let z = 0.05; z <= hh + 1e-9; z += 0.05) {
      const jit = 1 + 0.006 * Math.sin(z * 37);
      pts.push([z, 0.5 * (G * z) * jit]);
    }
    for (const p of pts) {
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.beginPath();
      ctx.arc(g.X(p[0]), g.Y(p[1]), 2.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    label(ctx, '橙点：½v² 实测', rect.x + 10, rect.y + 38, pal.orange, 'left', 12);
    label(ctx, '绿虚线：gh', rect.x + 10, rect.y + 56, pal.green, 'left', 12);

    const v = Math.sqrt(2 * G * hh);
    const half = 0.5 * v * v;
    const gh = G * hh;
    const t = Math.sqrt((2 * hh) / G);

    st.readout([
      ['下落高度 h', fmt(hh, 2) + ' m'],
      ['下落时间 t = √(2h/g)', fmt(t, 3) + ' s'],
      ['速度 v = gt', fmt(v, 2) + ' m/s'],
      ['½v²', fmt(half, 2) + ' J/kg'],
      ['gh', fmt(gh, 2) + ' J/kg'],
      ['两者之差', fmt(half - gh, 2) + ' J/kg'],
      ['判读', '两条线重合，机械能守恒'],
    ]);
  }

  return { frame };
}
