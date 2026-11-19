/* 波4 波的方程。
   左栏是一根绳的稳态波形 y = A sin(ωt − kx)：橙色为波源（x = 0），
   绿色为查看点 P（x = x₀），P 处另画一支振动速度箭头。
   右上把波源与 P 的 y–t 曲线叠在一起：两条曲线形状相同，横向错开 Δt = x₀/v。
   右下是相位差随距离的直线 Δφ = 2πx/λ，绿点是同相点（nλ）、紫点是反相点（n+½λ）。
   读数栏把方程里的每个量、相位差与滞后时间列出，并给出三组恒等：
   kx₀ 与 2πx₀/λ、y_P 与波源 t−Δt 时刻的位移、v_y 与 −v·(∂y/∂x)。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const LM = 6; // 绳长（米）

export function create(st) {
  let t = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const A = clamp(nn(q.A, 0.08), 0.04, 0.14);
    const f = clamp(nn(q.f, 0.8), 0.6, 1.6);
    const vw = clamp(nn(q.v, 1.6), 0.8, 2.4);
    const xp = clamp(nn(q.x0, 1.5), 0.4, 3);
    const T = 1 / f;
    const lam = vw / f;
    const om = 2 * Math.PI * f;
    const kk = (2 * Math.PI) / lam;
    const dphi = kk * xp;
    const dtau = xp / vw;

    const key = [A, f, vw, xp].join('|');
    if (key !== last) {
      last = key;
      t = 0;
    }
    if (dt > 0) t += dt;

    ctx.clearRect(0, 0, w, h);

    const ph = om * t - kk * xp;
    const yp = A * Math.sin(ph);
    const vy = A * om * Math.cos(ph);
    const slope = -A * kk * Math.cos(ph);

    /* ---------- 左栏：稳态波形 y = A sin(ωt − kx) ---------- */
    const xA = w * 0.05;
    const xB = w * 0.5;
    const y0 = h * 0.5;
    const ampS = h * 1.15;
    const X = xm => xA + ((xB - xA) * xm) / LM;
    const Y = ym => y0 - ym * ampS;
    const wave = xm => A * Math.sin(om * t - kk * xm);

    // 平衡位置与 ±A
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    for (const ym of [0, A, -A]) {
      ctx.beginPath();
      ctx.moveTo(xA, Math.round(Y(ym)) + 0.5);
      ctx.lineTo(xB, Math.round(Y(ym)) + 0.5);
      ctx.stroke();
    }
    ctx.restore();
    label(ctx, '±A', xB - 2, Y(A) - 9, pal.faint, 'right', 12);

    // 绳上的质点
    for (let xm = 0; xm <= LM + 1e-9; xm += 0.5) {
      spot(ctx, X(xm), Y(wave(xm)), 2, pal.blue, pal.bg2);
    }

    // 波形
    const pts = [];
    for (let i = 0; i <= 260; i++) {
      const xm = (LM * i) / 260;
      pts.push([xm, wave(xm)]);
    }
    poly(ctx, X, Y, pts, pal.blue, 2.4);

    // 波长：相邻两个波峰
    const crests = [];
    for (let n = -3; n < 30; n++) {
      const xc = lam * (t / T - 0.25 - n);
      if (xc >= 0 && xc <= LM) crests.push(xc);
    }
    crests.sort((a, b) => a - b);
    if (crests.length >= 2) {
      const x1 = crests[crests.length - 2];
      const x2 = crests[crests.length - 1];
      if (X(x2) - X(x1) > 34) {
        const yl = Y(-A) + 26;
        ctx.save();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = pal.faint;
        ctx.lineWidth = 1;
        for (const xc of [x1, x2]) {
          ctx.beginPath();
          ctx.moveTo(X(xc), Y(-A) + 4);
          ctx.lineTo(X(xc), yl);
          ctx.stroke();
        }
        ctx.restore();
        dblArrow(ctx, X(x1), yl, X(x2), yl, pal.purple);
        label(ctx, 'λ', (X(x1) + X(x2)) / 2, yl - 6, pal.purple, 'center', 13);
      }
    }

    // 传播方向
    arrow(ctx, xA + 6, h * 0.1, xA + 66, h * 0.1, pal.mut, 1.8);
    label(ctx, '传播方向', xA + 72, h * 0.1, pal.mut, 'left', 13);

    // 波源
    spot(ctx, X(0), Y(wave(0)), 5.5, pal.orange, pal.card);
    label(ctx, '波源', X(0) + 8, Y(wave(0)) - 10, pal.orange, 'left', 13);

    // 查看点 P：竖直虚线 + 位移点 + 振动速度箭头
    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(X(xp), Y(A * 1.3));
    ctx.lineTo(X(xp), Y(-A * 1.3));
    ctx.stroke();
    ctx.restore();
    const px = X(xp);
    const py = Y(yp);
    const vlen = (vy * ampS) / om; // 与振幅同一把尺子
    if (Math.abs(vlen) > 6) arrow(ctx, px, py, px, py - vlen, pal.green, 2);
    spot(ctx, px, py, 5, pal.green, pal.card);
    label(ctx, 'P', px + 7, py - 8, pal.green, 'left', 14);

    label(ctx, '同一时刻的波形 y–x', xA, h * 0.93, pal.faint, 'left', 13);
    label(ctx, '绿箭头：P 的振动速度', xA, h * 0.93 + 20, pal.faint, 'left', 12);

    /* ---------- 右上：波源与 P 的振动曲线 ---------- */
    const g1 = { x: w * 0.55, y: h * 0.08, w: w * 0.42, h: h * 0.33 };
    const yA = A * 1.35;
    const TW = 2 * T;
    const P1 = panel(ctx, g1, [0, TW], [-yA, yA], pal, { xlab: 't / s', ylab: 'y / m', nx: 4, ny: 4 });

    const tS = t - TW;
    const cs = [];
    const cp = [];
    for (let i = 0; i <= 240; i++) {
      const u = (TW * i) / 240;
      const tau = tS + u;
      cs.push([u, A * Math.sin(om * tau)]);
      cp.push([u, A * Math.sin(om * tau - kk * xp)]);
    }
    ctx.save();
    ctx.setLineDash([5, 5]);
    poly(ctx, P1.X, P1.Y, cs, pal.orange, 1.8);
    ctx.restore();
    poly(ctx, P1.X, P1.Y, cp, pal.green, 2.4);
    spot(ctx, P1.X(TW), P1.Y(A * Math.sin(om * t)), 3.5, pal.orange, pal.card);
    spot(ctx, P1.X(TW), P1.Y(yp), 4.5, pal.green, pal.card);

    // 滞后 Δt：在两族曲线上各取一个对应的波峰，横向量出距离
    let uo = -1;
    for (let n = -2; n < 40; n++) {
      const u = T * (0.25 + n) - tS;
      if (u >= 2 && u + dtau <= TW - 2) uo = u;
    }
    if (uo >= 0 && P1.X(uo + dtau) - P1.X(uo) > 22) {
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      for (const u of [uo, uo + dtau]) {
        ctx.beginPath();
        ctx.moveTo(P1.X(u), g1.y);
        ctx.lineTo(P1.X(u), g1.y + g1.h);
        ctx.stroke();
      }
      ctx.restore();
      const ay = g1.y + g1.h - 9;
      dblArrow(ctx, P1.X(uo), ay, P1.X(uo + dtau), ay, pal.purple);
      label(ctx, 'Δt = x₀/v', (P1.X(uo) + P1.X(uo + dtau)) / 2, ay - 8, pal.purple, 'center', 13);
    }
    label(ctx, '波源', g1.x + 8, g1.y + 14, pal.orange, 'left', 13);
    label(ctx, 'P', g1.x + 56, g1.y + 14, pal.green, 'left', 13);

    /* ---------- 右下：相位差随距离 Δφ = 2πx/λ ---------- */
    const g2 = { x: w * 0.55, y: h * 0.54, w: w * 0.42, h: h * 0.34 };
    const XM = Math.min(6, Math.max(xp * 1.35 + 0.1, 2.2 * lam));
    const P2 = panel(ctx, g2, [0, XM], [0, kk * XM], pal, { xlab: 'x / m', ylab: 'Δφ / rad', nx: 4, ny: 4 });
    poly(ctx, P2.X, P2.Y, [[0, 0], [XM, kk * XM]], pal.cyan, 2.2);

    // 同相点 nλ 与反相点 (n+½)λ
    const gapPx = (lam / XM) * g2.w;
    for (let n = 1; n * lam <= XM + 1e-9; n++) {
      if (gapPx > 20) spot(ctx, P2.X(n * lam), P2.Y(kk * n * lam), 3, pal.green, pal.card);
      if (gapPx > 20) {
        const xh = (n - 0.5) * lam;
        if (xh <= XM) spot(ctx, P2.X(xh), P2.Y(kk * xh), 3, pal.purple, pal.card);
      }
    }
    /* 图例放到框外下沿：框内左上角已经被纵轴名与曲线占着，写进去会叠字 */
    label(ctx, '绿点同相 nλ，紫点反相 (n + ½)λ', g2.x, g2.y + g2.h + 28, pal.mut, 'left', 12);

    // 当前点
    spot(ctx, P2.X(xp), P2.Y(dphi), 5, pal.orange, pal.card);
    label(ctx, 'x₀', P2.X(xp) + 7, P2.Y(dphi) - 8, pal.orange, 'left', 13);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['波长 λ = v/f', fmt(lam, 2) + ' m'],
      ['周期 T = 1/f', fmt(T, 3) + ' s'],
      ['波数 k = 2π/λ', fmt(kk, 2) + ' rad/m'],
      ['角频率 ω = 2πf', fmt(om, 2) + ' rad/s'],
      ['点 P 位置 x₀', fmt(xp, 2) + ' m'],
      ['P 的相位 ωt − kx₀', fmt(ph, 2) + ' rad'],
      ['相位差 kx₀', fmt(dphi, 2) + ' rad'],
      ['2πx₀/λ', fmt((2 * Math.PI * xp) / lam, 2) + ' rad'],
      ['滞后 Δt = x₀/v', fmt(dtau, 3) + ' s'],
      ['P 的位移 y', fmt(yp, 3) + ' m'],
      ['波源在 t − Δt 的位移', fmt(A * Math.sin(om * (t - dtau)), 3) + ' m'],
      ['P 的振动速度 v_y', fmt(vy, 3) + ' m/s'],
      ['波形斜率 ∂y/∂x', fmt(slope, 3)],
      ['−v·(∂y/∂x)', fmt(-vw * slope, 3) + ' m/s'],
    ]);
  }

  return { frame };
}

/* 双箭头：两端各带一枚箭头 */
function dblArrow(ctx, x1, y, x2, y2, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  for (const [xa, ya, dir] of [
    [x1, y, 1],
    [x2, y2, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(xa, ya);
    ctx.lineTo(xa + dir * 7, ya - 4);
    ctx.lineTo(xa + dir * 7, ya + 4);
    ctx.closePath();
    ctx.fill();
  }
}
