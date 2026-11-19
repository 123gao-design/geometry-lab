/* 波4 的方向档：同一根绳、同一个振幅与频率，三种写法各画一遍。
   括号里 ωt 与 kx 异号的（ωt − kx、kx − ωt）沿 +x 传播，同号的（ωt + kx）沿 −x 传播；
   kx − ωt 与标准形只差一个整体负号，曲线上下对翻而传播方向不变。
   绿色小点跟住一个波峰，读数栏给出它此刻的位置与移动方向。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';

const LM = 6; // 绳长（米）

export function create(st) {
  let last = '';
  let t = 0;

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const A = clamp(nn(q.A, 0.08), 0.04, 0.14);
    const f = clamp(nn(q.f, 0.8), 0.6, 1.6);
    const vw = clamp(nn(q.v, 1.6), 0.8, 2.4);
    const mode = q.mode === 'plus' || q.mode === 'neg' ? q.mode : 'minus';
    const T = 1 / f;
    const lam = vw / f;
    const om = 2 * Math.PI * f;
    const kk = (2 * Math.PI) / lam;

    const key = [A, f, vw, mode].join('|');
    if (key !== last) {
      last = key;
      t = 0;
    }
    if (dt > 0) t = (t + dt) % (4 * T);

    ctx.clearRect(0, 0, w, h);

    const xA = w * 0.07;
    const xB = w * 0.94;
    const X = xm => xA + ((xB - xA) * xm) / LM;
    const y0 = h * 0.58;
    const ampS = h * 1.9;
    const ampPix = A * ampS;

    // 相位：minus 与 neg 的 x 系数为正负相反，plus 与 minus 的 x 系数符号相反
    const s = mode === 'neg' ? -1 : 1; // 时间项前的符号
    const s2 = mode === 'plus' ? 1 : -1; // 位置项前的符号
    const ph = xm => s * om * t + s2 * kk * xm;
    const ys = xm => A * Math.sin(ph(xm));
    const dir = s * s2 > 0 ? -1 : 1; // 传播方向：+1 沿 +x，−1 沿 −x

    const eqTxt =
      mode === 'plus' ? 'y = A sin(ωt + kx)' : mode === 'neg' ? 'y = A sin(kx − ωt)' : 'y = A sin(ωt − kx)';
    label(ctx, eqTxt, xA, h * 0.11, pal.blue, 'left', 15);

    // 传播方向
    const ax0 = w * 0.58;
    arrow(ctx, ax0, h * 0.115, ax0 + dir * w * 0.11, h * 0.115, pal.orange, 2);
    label(ctx, dir > 0 ? '沿 +x 传播' : '沿 −x 传播', ax0 + dir * w * 0.11 + (dir > 0 ? 8 : -8), h * 0.12, pal.orange, dir > 0 ? 'left' : 'right', 14);

    // 平衡位置与 ±A
    ctx.save();
    ctx.setLineDash([5, 6]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    for (const ym of [0, 1, -1]) {
      ctx.beginPath();
      ctx.moveTo(xA, y0 - ym * ampPix);
      ctx.lineTo(xB, y0 - ym * ampPix);
      ctx.stroke();
    }
    ctx.restore();
    label(ctx, 'A', xA - 4, y0 - ampPix + 5, pal.orange, 'right', 13);
    label(ctx, '−A', xA - 4, y0 + ampPix - 4, pal.orange, 'right', 13);

    // 第三档：背后叠一条标准形曲线，看出只差一个负号
    const N = 300;
    if (mode === 'neg') {
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const xm = (LM * i) / N;
        const yy = y0 - A * Math.sin(om * t - kk * xm) * ampS;
        if (i === 0) ctx.moveTo(X(xm), yy);
        else ctx.lineTo(X(xm), yy);
      }
      ctx.stroke();
      ctx.restore();
      label(ctx, '淡色虚线：标准形 ωt − kx', xB, h * 0.11, pal.faint, 'right', 13);
    }

    // 波形
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      const xm = (LM * i) / N;
      const yy = y0 - ys(xm) * ampS;
      if (i === 0) ctx.moveTo(X(xm), yy);
      else ctx.lineTo(X(xm), yy);
    }
    ctx.stroke();

    // 质点
    for (let xm = 0; xm <= LM + 1e-9; xm += 0.5) {
      spot(ctx, X(xm), y0 - ys(xm) * ampS, 2.4, pal.ink, pal.bg2);
    }

    // 绿色波峰：相位取 π/2 + 2πn，取离绳中点最近的那一个
    const stepX = (2 * Math.PI) / (s2 * kk);
    const xc0 = (Math.PI / 2 - s * om * t) / (s2 * kk);
    const nC = Math.round((3 - xc0) / stepX);
    const xc = clamp(xc0 + nC * stepX, 0.1, LM - 0.1);
    const yc = y0 - ys(xc) * ampS;
    spot(ctx, X(xc), yc, 6, pal.green, pal.card);
    label(ctx, '波峰', X(xc), yc - 13, pal.green, 'center', 13);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['波长 λ', fmt(lam, 2) + ' m'],
      ['周期 T', fmt(T, 3) + ' s'],
      ['波速 v', fmt(vw, 2) + ' m/s'],
      ['波峰位置 x', fmt(xc, 2) + ' m'],
      ['波峰移动', dir > 0 ? '向右（+x）' : '向左（−x）'],
      ['与标准形', mode === 'neg' ? '上下对翻（差一个负号）' : mode === 'plus' ? 'x 的系数改号' : '本身'],
    ]);
  }

  return { frame };
}
