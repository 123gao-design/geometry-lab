/* 波2 波的图像与叠加。
   图像档：上栏是某一时刻的 y–x 波形图，下栏是点 P 的 y–t 振动图，
   两张图共用同一个振幅尺度，纵轴的同一个高度就是同一个位移。
   叠加档：两列高斯脉冲相向而行，淡色是各自的波形，绿色是合位移；
   相遇时位移相加，穿过之后各自保持原样。
   驻波档：两列等幅反向的波叠加，合位移在有些位置恒为零（波节），
   在另一些位置合振幅达到 2A（波腹），波形原地上下振动而不前行。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const LM = 6; // 图像档的绳长（米）

export function create(st) {
  let last = '';
  let t = 0;
  let hold = 0;
  let hist = [];
  const reset = () => {
    t = 0;
    hold = 0;
    hist = [];
  };

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'add' ? 'add' : q.mode === 'stand' ? 'stand' : 'graph';
    const A = clamp(nn(q.A, 0.08), 0.04, 0.12);
    const f = clamp(nn(q.f, 0.8), 0.6, 1.6);
    const vw = clamp(nn(q.v, 1.4), 0.8, 2.4);
    const xp = clamp(nn(q.xp, 3), 0.5, 5.5);
    const T = 1 / f;
    const lam = vw / f;
    const om = 2 * Math.PI * f;
    const kk = (2 * Math.PI) / lam;

    const key = [mode, A, f, vw, xp].join('|');
    if (key !== last) {
      last = key;
      reset();
    }

    ctx.clearRect(0, 0, w, h);

    if (mode === 'graph') {
      if (dt > 0) t += dt;
      const yp = A * Math.sin(om * t - kk * xp);
      hist.push([t, yp]);
      const TW = 2 * T;
      const off = Math.max(0, t - TW);
      while (hist.length > 2 && hist[0][0] < t - TW - 2) hist.shift();

      const yA = A * 1.3;

      /* 上栏：波形图 y–x */
      const g1 = { x: w * 0.08, y: h * 0.09, w: w * 0.84, h: h * 0.32 };
      const P1 = panel(ctx, g1, [0, LM], [-yA, yA], pal, { xlab: 'x / m', ylab: 'y / m' });
      const pts = [];
      for (let i = 0; i <= 240; i++) {
        const xm = (LM * i) / 240;
        pts.push([xm, A * Math.sin(om * t - kk * xm)]);
      }
      poly(ctx, P1.X, P1.Y, pts, pal.blue, 2.2);

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
        if (P1.X(x2) - P1.X(x1) > 34) {
          const yl = P1.Y(yA) + 16;
          ctx.save();
          ctx.setLineDash([3, 4]);
          ctx.strokeStyle = pal.faint;
          ctx.lineWidth = 1;
          for (const xc of [x1, x2]) {
            ctx.beginPath();
            ctx.moveTo(P1.X(xc), P1.Y(0) - 34);
            ctx.lineTo(P1.X(xc), yl);
            ctx.stroke();
          }
          ctx.restore();
          arrowLine(ctx, P1.X(x1), P1.X(x2), yl, pal.purple);
          label(ctx, 'λ', (P1.X(x1) + P1.X(x2)) / 2, yl - 6, pal.purple, 'center', 13);
        }
      }

      // 查看点 P
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(P1.X(xp), P1.Y(-yA));
      ctx.lineTo(P1.X(xp), P1.Y(yA));
      ctx.stroke();
      ctx.restore();
      spot(ctx, P1.X(xp), P1.Y(yp), 4.5, pal.green, pal.card);
      label(ctx, 'P', P1.X(xp) + 7, P1.Y(yp) - 7, pal.green, 'left', 14);

      /* 下栏：点 P 的振动图 y–t */
      const g2 = { x: w * 0.08, y: h * 0.5, w: w * 0.84, h: h * 0.32 };
      const P2 = panel(ctx, g2, [0, TW], [-yA, yA], pal, { xlab: 't / s', ylab: 'y / m' });
      const tp = [];
      for (const p of hist) {
        if (p[0] >= t - TW) tp.push([p[0] - off, clamp(p[1], -yA, yA)]);
      }
      if (tp.length > 1) poly(ctx, P2.X, P2.Y, tp, pal.blue, 2.2);
      spot(ctx, P2.X(t - off), P2.Y(yp), 4.5, pal.green, pal.card);

      st.readout([
        ['时间 t', fmt(t, 2) + ' s'],
        ['点 P 的位置', fmt(xp, 2) + ' m'],
        ['点 P 的位移', fmt(yp, 3) + ' m'],
        ['振幅 A', fmt(A, 3) + ' m'],
        ['波长 λ', fmt(lam, 2) + ' m'],
        ['周期 T', fmt(T, 3) + ' s'],
        ['波速 v', fmt(vw, 2) + ' m/s'],
      ]);
      return;
    }

    if (mode === 'stand') {
      /* ── 驻波档：两列等幅反向的波叠加 ── */
      const LS = 4.8; // 画出的那段绳长（米）
      const kS = (2 * Math.PI) / lam;
      if (dt > 0) t = (t + dt) % T;

      const yS = 2 * A * 1.3;
      const gs = { x: w * 0.08, y: h * 0.13, w: w * 0.84, h: h * 0.72 };
      const PS = panel(ctx, gs, [0, LS], [-yS, yS], pal, { xlab: 'x / m', ylab: 'y / m' });

      const d1 = [];
      const d2 = [];
      const sums = [];
      for (let i = 0; i <= 280; i++) {
        const xm = (LS * i) / 280;
        const u1 = A * Math.sin(om * t - kS * xm);
        const u2 = -A * Math.sin(om * t + kS * xm);
        d1.push([xm, u1]);
        d2.push([xm, u2]);
        sums.push([xm, u1 + u2]);
      }
      ctx.save();
      ctx.setLineDash([5, 5]);
      poly(ctx, PS.X, PS.Y, d1, pal.blue, 1.5);
      poly(ctx, PS.X, PS.Y, d2, pal.orange, 1.5);
      ctx.restore();
      poly(ctx, PS.X, PS.Y, sums, pal.green, 2.8);

      // 波节：sin(kx) = 0 处，两列波在那里位移恒等大反向，合位移始终为零
      const nodes = [];
      for (let n = 0; n * 0.5 * lam <= LS + 1e-9; n++) nodes.push(n * 0.5 * lam);
      for (const xn of nodes) spot(ctx, PS.X(xn), PS.Y(0), 3.5, pal.green, pal.bg2);
      if (nodes.length >= 2 && PS.X(nodes[1]) - PS.X(nodes[0]) > 30) {
        const yl = PS.Y(0) + 24;
        ctx.save();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = pal.faint;
        ctx.lineWidth = 1;
        for (const xn of [nodes[0], nodes[1]]) {
          ctx.beginPath();
          ctx.moveTo(PS.X(xn), PS.Y(0) + 6);
          ctx.lineTo(PS.X(xn), yl);
          ctx.stroke();
        }
        ctx.restore();
        arrowLine(ctx, PS.X(nodes[0]), PS.X(nodes[1]), yl, pal.purple);
        label(ctx, 'λ/2', (PS.X(nodes[0]) + PS.X(nodes[1])) / 2, yl + 16, pal.purple, 'center', 13);
      }
      if (nodes.length >= 1) label(ctx, '波节', PS.X(nodes[0]) + 7, PS.Y(0) + 17, pal.green, 'left', 13);

      // 波腹：相邻波节的中点，两列波同相到达，合振幅为 2A
      const xa = 0.25 * lam;
      if (xa < LS) {
        spot(ctx, PS.X(xa), PS.Y(-2 * A * Math.cos(om * t)), 4, pal.orange, pal.bg2);
        label(ctx, '波腹', PS.X(xa) + 7, PS.Y(2 * A) - 6, pal.orange, 'left', 13);
      }

      st.readout([
        ['时间 t', fmt(t, 2) + ' s'],
        ['振幅 A', fmt(A, 3) + ' m'],
        ['频率 f', fmt(f, 2) + ' Hz'],
        ['波长 λ', fmt(lam, 2) + ' m'],
        ['波节间距 λ/2', fmt(lam / 2, 2) + ' m'],
        ['波腹合振幅 2A', fmt(2 * A, 3) + ' m'],
      ]);
      return;
    }

    /* 叠加档 */
    const L = 8;
    const sd = 0.32;
    const A1 = A;
    const A2 = A * 0.7;
    const tEnd = (L + 1.6 - 1.2) / vw;
    if (dt > 0) {
      if (t < tEnd) t += dt;
      else {
        hold += dt;
        if (hold > 0.9) reset();
      }
    }
    const y1 = xm => A1 * Math.exp(-(((xm - (1.2 + vw * t)) / sd) ** 2));
    const y2 = xm => -A2 * Math.exp(-(((xm - (7.2 - vw * t)) / sd) ** 2));

    const yA = A * 1.3;
    const g = { x: w * 0.08, y: h * 0.12, w: w * 0.84, h: h * 0.74 };
    const P = panel(ctx, g, [0, L], [-yA, yA], pal, { xlab: 'x / m', ylab: 'y / m' });

    const c1 = [];
    const c2 = [];
    const cs = [];
    for (let i = 0; i <= 260; i++) {
      const xm = (L * i) / 260;
      c1.push([xm, y1(xm)]);
      c2.push([xm, y2(xm)]);
      cs.push([xm, y1(xm) + y2(xm)]);
    }
    ctx.save();
    ctx.setLineDash([5, 5]);
    poly(ctx, P.X, P.Y, c1, pal.blue, 1.6);
    poly(ctx, P.X, P.Y, c2, pal.orange, 1.6);
    ctx.restore();
    poly(ctx, P.X, P.Y, cs, pal.green, 2.8);

    // 两列波的标注与行进方向
    const px1 = P.X(1.2 + vw * t);
    const px2 = P.X(7.2 - vw * t);
    label(ctx, '波1', clamp(px1, g.x + 16, g.x + g.w - 16), P.Y(yA) + 15, pal.blue, 'center', 13);
    label(ctx, '波2', clamp(px2, g.x + 16, g.x + g.w - 16), P.Y(-yA) - 6, pal.orange, 'center', 13);

    // 探测点：合位移等于两个分位移之和
    const xq = 4;
    const a1 = y1(xq);
    const a2 = y2(xq);
    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(P.X(xq), P.Y(-yA));
    ctx.lineTo(P.X(xq), P.Y(yA));
    ctx.stroke();
    ctx.restore();
    spot(ctx, P.X(xq), P.Y(a1), 3.5, pal.blue, pal.card);
    spot(ctx, P.X(xq), P.Y(a2), 3.5, pal.orange, pal.card);
    spot(ctx, P.X(xq), P.Y(a1 + a2), 5, pal.green, pal.card);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['波1 的位移', fmt(a1, 3) + ' m'],
      ['波2 的位移', fmt(a2, 3) + ' m'],
      ['合位移', fmt(a1 + a2, 3) + ' m'],
    ]);
  }

  return { frame, reset };
}

/* 双箭头：两端各带一枚箭头 */
function arrowLine(ctx, x1, x2, y, color) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(x1, y);
  ctx.lineTo(x2, y);
  ctx.stroke();
  for (const [xa, dir] of [
    [x1, 1],
    [x2, -1],
  ]) {
    ctx.beginPath();
    ctx.moveTo(xa, y);
    ctx.lineTo(xa + dir * 7, y - 4);
    ctx.lineTo(xa + dir * 7, y + 4);
    ctx.closePath();
    ctx.fill();
  }
}
