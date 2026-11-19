/* 波1 的横波与纵波对照：上排是绳上的横波，质点在原地上下振动；
   下排把同一列波画成一列竖直短线，短线代表介质中的小段，
   沿传播方向前后振动，挤在一起处是密部、拉开处是疏部。
   两排共用同一个波长、频率、波速与波前。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';

const LM = 6; // 画面里那段介质代表 6 m
const DS = 0.12; // 下排短线的平衡间距（米）

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
    const lam = vw / f;
    const om = 2 * Math.PI * f;
    const kk = (2 * Math.PI) / lam;

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

    const xA = w * 0.07;
    const xB = w * 0.94;
    const X = xm => xA + ((xB - xA) * xm) / LM;
    const pxm = (xB - xA) / LM; // 每米占多少像素
    const front = vw * t;

    const yT = h * 0.31;
    const yL = h * 0.72;
    const ampS = h * 0.95; // 上排每米位移占多少像素
    const ampPix = A * ampS;
    // 下排的前后位移只作示意：既不超过短线间距的 45%，也不让相邻短线交叉
    const dpx = Math.min(0.45 * DS * pxm, 0.0875 * lam * pxm);

    const ys = xm => (xm <= front ? A * Math.sin(om * t - kk * xm) : 0);
    const dsp = xm => (xm <= front ? dpx * Math.sin(om * t - kk * xm) : 0);

    // 传播方向
    arrow(ctx, w * 0.52, h * 0.055, w * 0.70, h * 0.055, pal.faint, 1.8);
    label(ctx, '波的传播方向', w * 0.705, h * 0.06, pal.faint, 'left', 13);

    // 两排的说明
    label(ctx, '横波：质点上下振动，振动方向与传播方向垂直', xA, h * 0.105, pal.blue, 'left', 14);
    label(ctx, '纵波：质点沿传播方向前后振动，形成密部与疏部', xA, h * 0.505, pal.blue, 'left', 14);

    /* ── 上排：横波 ── */
    ctx.save();
    ctx.setLineDash([5, 6]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(xA, yT);
    ctx.lineTo(xB, yT);
    ctx.stroke();
    ctx.restore();

    // 平衡位置的上下振幅线
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = pal.orange;
    for (const sg of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(xA, yT - sg * ampPix);
      ctx.lineTo(xB, yT - sg * ampPix);
      ctx.stroke();
    }
    ctx.restore();
    label(ctx, 'A', xA - 4, yT - ampPix + 5, pal.orange, 'right', 13);
    label(ctx, '−A', xA - 4, yT + ampPix - 4, pal.orange, 'right', 13);

    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    const N = 260;
    for (let i = 0; i <= N; i++) {
      const xm = (LM * i) / N;
      const yy = yT - ys(xm) * ampS;
      if (i === 0) ctx.moveTo(X(xm), yy);
      else ctx.lineTo(X(xm), yy);
    }
    ctx.stroke();

    for (let xm = 0; xm <= LM + 1e-9; xm += 0.5) {
      spot(ctx, X(xm), yT - ys(xm) * ampS, 3, pal.blue, pal.card);
    }
    spot(ctx, X(0), yT - Math.sin(om * t) * ampPix, 6, pal.orange, pal.ink);
    label(ctx, '波源', X(0), yT + ampPix + 18, pal.orange, 'center', 13);

    // 绿色质点：只在竖直虚线上往复
    const xh = 3.2;
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(X(xh), yT - ampPix - 8);
    ctx.lineTo(X(xh), yT + ampPix + 8);
    ctx.stroke();
    ctx.restore();
    spot(ctx, X(xh), yT - ys(xh) * ampS, 5.5, pal.green, pal.ink);

    /* ── 下排：纵波 ── */
    ctx.save();
    ctx.setLineDash([5, 6]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(xA, yL);
    ctx.lineTo(xB, yL);
    ctx.stroke();
    ctx.restore();

    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    const nTick = Math.round(LM / DS);
    for (let i = 0; i <= nTick; i++) {
      const xm = i * DS;
      const px = X(xm) + dsp(xm);
      ctx.moveTo(px, yL - 9);
      ctx.lineTo(px, yL + 9);
    }
    ctx.stroke();

    // 绿色那一小段：在平衡位置左右移动
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(X(xh), yL - 16);
    ctx.lineTo(X(xh), yL + 16);
    ctx.stroke();
    ctx.restore();
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 3.6;
    ctx.beginPath();
    ctx.moveTo(X(xh) + dsp(xh), yL - 12);
    ctx.lineTo(X(xh) + dsp(xh), yL + 12);
    ctx.stroke();

    // 密部与疏部：dξ/dx > 0 处被压缩，取位移导数最大的那一点标注
    const cands = [];
    for (let n = -8; n < 30; n++) {
      const xc = (om * t - 2 * Math.PI * n) / kk;
      if (xc > 0.3 && xc < Math.min(LM, front) - 0.2) cands.push(xc);
    }
    const pickMid = arr => {
      if (!arr.length) return null;
      let best = arr[0];
      for (const x of arr) if (Math.abs(x - 3) < Math.abs(best - 3)) best = x;
      return best;
    };
    const xSparse = pickMid(cands); // cos = +1，相邻短线拉开
    const xDense = pickMid(cands.map(x => x + lam / 2)); // 半个波长外侧被压缩
    if (xDense !== null) label(ctx, '密部', X(xDense), yL + 26, pal.orange, 'center', 13);
    if (xSparse !== null) label(ctx, '疏部', X(xSparse), yL + 26, pal.blue, 'center', 13);

    // 波前：一排虚线同时贯穿两排
    if (front < LM) {
      const px = X(front);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px, yT - ampPix - 10);
      ctx.lineTo(px, yL + 14);
      ctx.stroke();
      ctx.restore();
      label(ctx, '波前', px + 5, yL + 44, pal.orange, 'left', 13);
    }

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['波长 λ', fmt(lam, 2) + ' m'],
      ['频率 f', fmt(f, 2) + ' Hz'],
      ['波速 v', fmt(vw, 2) + ' m/s'],
      ['横波质点', '上下振动'],
      ['纵波质点', '前后振动'],
    ]);
  }

  return { frame, reset };
}
