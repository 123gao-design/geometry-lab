/* 加速度的方向：左栏一支绿箭头是速度、一支橙箭头是加速度，右栏是 v-t 图。
   同号（两支箭头指向同一边）速率增大，异号速率减小，a = 0 速率不变；
   v-t 图线的斜率只由 a 的符号决定，与 v 的正负各管一件事。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot, niceStep, num } from './axes.js';

const TMAX = 6; // 一段观察 6 s，到时从 t = 0 重放

export function create(st) {
  let last = '';
  let t = 0;

  const reset = () => { t = 0; };

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const p = st.params;
    const v0 = clamp(Number(p.v0) || 0, -4, 8);
    const a = clamp(Number(p.a) || 0, -4, 4);

    const key = v0 + '|' + a;
    if (key !== last) { last = key; reset(); }
    if (dt > 0) { t += dt; if (t > TMAX) t = 0; }

    const V = tt => v0 + a * tt;
    const X = tt => v0 * tt + 0.5 * a * tt * tt;
    const v = V(t);
    const x = X(t);

    ctx.clearRect(0, 0, w, h);

    /* ── 左：轨道与两支箭头 ── */
    const xL = w * 0.045;
    const xR = w * 0.44;

    const cand = [X(0), X(TMAX)];
    if (a !== 0) {
      const tv = -v0 / a;
      if (tv > 0 && tv < TMAX) cand.push(X(tv));
    }
    let xlo = Math.min(...cand);
    let xhi = Math.max(...cand);
    const xpad = Math.max((xhi - xlo) * 0.12, 1.2);
    xlo -= xpad;
    xhi += xpad;
    const TX = u => xL + ((u - xlo) / (xhi - xlo)) * (xR - xL);

    const yT = Math.round(h * 0.70) + 0.5;

    arrow(ctx, xL, yT, xR, yT, pal.mut, 1.4);
    const stp = niceStep(xhi - xlo, 5);
    for (let u = Math.ceil(xlo / stp) * stp; u <= xhi + 1e-9; u += stp) {
      const px = TX(u);
      if (px < xL + 4 || px > xR - 6) continue;
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, yT - 4);
      ctx.lineTo(px, yT + 4);
      ctx.stroke();
      label(ctx, num(u), px, yT + 17, pal.faint, 'center', 12);
    }
    label(ctx, 'x / m', xR, yT - 15, pal.mut, 'right', 13);

    /* 出发点 */
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(TX(0), yT - 34);
    ctx.lineTo(TX(0), yT + 6);
    ctx.stroke();
    ctx.restore();
    label(ctx, '起点', TX(0), yT - 42, pal.faint, 'center', 12);

    const px = TX(x);

    /* 物块 */
    const bw = 30;
    const bh = 19;
    ctx.fillStyle = pal.bg2;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.rect(px - bw / 2, yT - bh, bw, bh);
    ctx.fill();
    ctx.stroke();

    /* 速度箭头（绿）与加速度箭头（橙） */
    const vLen = clamp(Math.abs(v) * 13, 0, (xR - xL) * 0.30);
    const aLen = clamp(Math.abs(a) * 22, 0, (xR - xL) * 0.30);
    const yV = yT - bh - 26;
    const yA = yT - bh - 58;

    if (vLen > 3) {
      const s = Math.sign(v);
      arrow(ctx, px, yV, px + s * vLen, yV, pal.green, 2.2);
      label(ctx, 'v', px + s * vLen + s * 8, yV + 4, pal.green, s > 0 ? 'left' : 'right', 14);
    } else {
      label(ctx, 'v = 0', px, yV + 4, pal.green, 'center', 13);
    }

    if (aLen > 3) {
      const s = Math.sign(a);
      arrow(ctx, px, yA, px + s * aLen, yA, pal.orange, 2.2);
      label(ctx, 'a', px + s * aLen + s * 8, yA + 4, pal.orange, s > 0 ? 'left' : 'right', 14);
    } else {
      label(ctx, 'a = 0', px, yA + 4, pal.orange, 'center', 13);
    }

    const rel = a === 0 ? 'a = 0，匀速' : Math.sign(a) === Math.sign(v) ? '同号，速率增大' : '异号，速率减小';
    label(ctx, rel, (xL + xR) / 2, h * 0.10, pal.blue, 'center', 15);

    /* ── 右：v-t 图 ── */
    const ys = [0, v0, V(TMAX)];
    let ylo = Math.min(...ys);
    let yhi = Math.max(...ys);
    const ypad = Math.max((yhi - ylo) * 0.18, 1);
    ylo -= ypad;
    yhi += ypad;

    const rect = { x: w * 0.53, y: h * 0.14, w: w * 0.43, h: h * 0.70 };
    const g = panel(ctx, rect, [0, TMAX], [ylo, yhi], pal, {
      xlab: 't / s',
      ylab: 'v / (m/s)',
      nx: 6,
      ny: 4,
    });

    /* 已走过的那一段围出的有向面积 */
    if (t > 0.02) {
      ctx.save();
      ctx.globalAlpha = 0.16;
      ctx.fillStyle = pal.blue;
      ctx.beginPath();
      ctx.moveTo(g.X(0), g.Y(0));
      ctx.lineTo(g.X(0), g.Y(v0));
      const N = 60;
      for (let i = 1; i <= N; i++) {
        const tt = (t * i) / N;
        ctx.lineTo(g.X(tt), g.Y(V(tt)));
      }
      ctx.lineTo(g.X(t), g.Y(0));
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    poly(ctx, g.X, g.Y, [[0, v0], [TMAX, V(TMAX)]], pal.blue, 2.2);

    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(g.X(t), g.Y(0));
    ctx.lineTo(g.X(t), g.Y(v));
    ctx.stroke();
    ctx.restore();

    spot(ctx, g.X(t), g.Y(v), 5.5, pal.orange, pal.bg2);

    const slopeTxt = a > 0 ? '斜率 > 0，a > 0' : a < 0 ? '斜率 < 0，a < 0' : '图线水平，a = 0';
    label(ctx, slopeTxt, rect.x + rect.w / 2, rect.y - 12, pal.orange, 'center', 13);

    const speed = Math.abs(v);
    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['速度 v', fmt(v, 2) + ' m/s'],
      ['加速度 a', fmt(a, 2) + ' m/s²'],
      ['v 与 a', a === 0 ? 'a = 0' : Math.sign(a) === Math.sign(v) ? '同号' : '异号'],
      ['速率 |v|', fmt(speed, 2) + ' m/s'],
      ['速率变化', a === 0 ? '不变' : Math.sign(a) === Math.sign(v) ? '增大' : '减小'],
      ['位移 x', fmt(x, 2) + ' m'],
    ]);
  }

  return { frame, reset };
}
