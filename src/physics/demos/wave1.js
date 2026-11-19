/* 波1 波的形成与描述：绳的一端被波源上下驱动，波形沿绳向右传。
   每个质点在原地上下振动，不随波迁移；波长取相邻两个波峰的距离，
   波前的位置 x = vt 直接标出来。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';

const LM = 6; // 画面里那根绳代表 6 m

export function create(st) {
  let last = '';
  let t = 0;
  let hold = 0;
  const reset = () => {
    t = 0;
    hold = 0;
  };

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const A = clamp(nn(q.A, 0.08), 0.04, 0.14);
    const f = clamp(nn(q.f, 0.8), 0.6, 2);
    const vw = clamp(nn(q.v, 1.6), 0.8, 2.5);
    const T = 1 / f;
    const lam = vw / f;
    const om = 2 * Math.PI * f;
    const kk = 2 * Math.PI / lam;

    const key = [A, f, vw].join('|');
    if (key !== last) {
      last = key;
      reset();
    }
    const tEnd = LM / vw + 1.6;
    if (dt > 0) {
      if (t < tEnd) t = Math.min(tEnd, t + dt);
      else {
        hold += dt;
        if (hold > 0.9) reset();
      }
    }

    ctx.clearRect(0, 0, w, h);

    const xA = w * 0.06;
    const xB = w * 0.95;
    const y0 = h * 0.58;
    const ampS = h * 1.3; // 每米横向位移占多少像素
    const X = xm => xA + ((xB - xA) * xm) / LM;
    const wave = xm => (xm <= vw * t ? A * Math.sin(om * t - kk * xm) : 0);
    const ampPix = A * ampS;

    // 平衡位置与振幅线
    ctx.save();
    ctx.setLineDash([5, 6]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(xA, y0);
    ctx.lineTo(xB, y0);
    ctx.stroke();
    ctx.strokeStyle = pal.orange;
    ctx.setLineDash([3, 5]);
    for (const sg of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(xA, y0 - sg * ampPix);
      ctx.lineTo(xB, y0 - sg * ampPix);
      ctx.stroke();
    }
    ctx.restore();
    label(ctx, 'A', xA - 4, y0 - ampPix + 5, pal.orange, 'right', 13);
    label(ctx, '−A', xA - 4, y0 + ampPix - 4, pal.orange, 'right', 13);

    // 绳
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    const N = 260;
    for (let i = 0; i <= N; i++) {
      const xm = (LM * i) / N;
      const yy = y0 - wave(xm) * ampS;
      if (i === 0) ctx.moveTo(X(xm), yy);
      else ctx.lineTo(X(xm), yy);
    }
    ctx.stroke();

    // 绳上的质点
    for (let xm = 0; xm <= LM + 1e-9; xm += 0.5) {
      spot(ctx, X(xm), y0 - wave(xm) * ampS, 3, pal.blue, pal.card);
    }

    // 波源
    const ys = Math.sin(om * t) * A;
    spot(ctx, X(0), y0 - ys * ampS, 6, pal.orange, pal.ink);
    label(ctx, '波源', X(0), y0 + ampPix + 22, pal.orange, 'center', 13);

    // 高亮的质点：只在原地上下
    const xh = 3.2;
    const yh = y0 - wave(xh) * ampS;
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(X(xh), y0 - ampPix - 8);
    ctx.lineTo(X(xh), y0 + ampPix + 8);
    ctx.stroke();
    ctx.restore();
    spot(ctx, X(xh), yh, 5.5, pal.green, pal.ink);
    // 这一点的速度方向
    const vNow = xh <= vw * t ? -A * om * Math.cos(om * t - kk * xh) : 0;
    if (Math.abs(vNow) > 0.02) {
      const dir = vNow > 0 ? -1 : 1;
      const Lv = clamp(Math.abs(vNow) * ampS * 0.10, 8, h * 0.1);
      arrow(ctx, X(xh) + 14, yh, X(xh) + 14, yh + dir * Lv, pal.green, 2);
      label(ctx, 'v', X(xh) + 24, yh + dir * Lv + 4, pal.green, 'left', 13);
    }
    label(ctx, '这个点只在原地上下', X(xh), y0 + ampPix + 22, pal.green, 'center', 13);

    // 波长：相邻两个波峰
    const crests = [];
    for (let n = -3; n < 30; n++) {
      const xc = lam * (t / T - 0.25 - n);
      if (xc >= 0 && xc <= Math.min(LM, vw * t)) crests.push(xc);
    }
    crests.sort((a, b) => a - b);
    if (crests.length >= 2) {
      const x1 = crests[crests.length - 2];
      const x2 = crests[crests.length - 1];
      if (X(x2) - X(x1) > 34) {
        const yl = y0 - ampPix - 30;
        ctx.save();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = pal.faint;
        ctx.lineWidth = 1;
        for (const xc of [x1, x2]) {
          ctx.beginPath();
          ctx.moveTo(X(xc), y0 - ampPix - 6);
          ctx.lineTo(X(xc), yl - 6);
          ctx.stroke();
        }
        ctx.restore();
        arrow(ctx, X(x1), yl, X(x2), yl, pal.purple, 1.8);
        arrow(ctx, X(x2), yl, X(x1), yl, pal.purple, 1.8);
        label(ctx, 'λ', (X(x1) + X(x2)) / 2, yl - 8, pal.purple, 'center', 14);
      }
    }

    // 波前与传播方向
    const xf = vw * t;
    if (xf < LM) {
      const px = X(xf);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(px, y0 - ampPix - 6);
      ctx.lineTo(px, y0 + ampPix + 6);
      ctx.stroke();
      ctx.restore();
      label(ctx, '波前', px + 6, y0 - ampPix - 10, pal.orange, 'left', 13);
    }
    arrow(ctx, w * 0.36, h * 0.16, w * 0.56, h * 0.16, pal.faint, 1.8);
    label(ctx, '波的传播方向', w * 0.565, h * 0.165, pal.faint, 'left', 13);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['波长 λ', fmt(lam, 2) + ' m'],
      ['周期 T', fmt(T, 3) + ' s'],
      ['频率 f', fmt(f, 2) + ' Hz'],
      ['波速 v', fmt(vw, 2) + ' m/s'],
      ['已传播', fmt(Math.min(xf, LM), 2) + ' m'],
    ]);
  }

  return { frame, reset };
}
