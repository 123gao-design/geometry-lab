/* 演示：简谐运动。按 mode 分成四块单画面的板，各挂到用到它的那一节：
   spring —— 弹簧振子与平衡位置：物块在 O 两侧往复，橙色虚线标 ±A，下方量出位移 x；
   force  —— 回复力与简谐运动：真实箭头的速度 / 回复力，右栏 F–x 直线（斜率 −k）；
   xt     —— 位移—时间曲线：振幅、周期、初相都从图上量；
   circ   —— 参考圆与周期：参考圆与 x–t 曲线并排，投影正落在曲线上。
   模型 x = A cos(ωt + φ)、ω = √(k/m)、T = 2π√(m/k)。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const D2R = Math.PI / 180;
const AMAX = 0.8;               // 振幅滑块上限，也是画面里「每米占多少像素」的定标
const TMAX = 6;                 // x–t 图的时间窗（秒）

export function create(st) {
  let last = '';
  let t = 0;
  let hold = 0;
  const reset = () => { t = 0; hold = 0; };

  /* ── 弹簧振子 ──
     r 是这块面板占的矩形，o = { trackY, arrows, disp }：
     arrows 画速度 / 回复力两支箭头，disp 在轨道下方量出位移 x。 */
  function springPanel(ctx, pal, r, A, x, v, F, o) {
    const blockW = clamp(r.w * 0.10, 22, 52);
    const blockH = blockW * 0.58;
    const L0 = r.w * 0.30;             // 弹簧原长（像素）
    const kx = (r.w * 0.34) / (2 * AMAX); // 每米位移占多少像素
    const eqX = r.x + L0 + blockW / 2;
    const bx = eqX + x * kx;
    const trackY = o.trackY;
    const yc = trackY - blockH / 2;

    // 轨道与墙
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(r.x, trackY);
    ctx.lineTo(r.x + r.w, trackY);
    ctx.stroke();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(r.x, trackY - blockH * 1.4);
    ctx.lineTo(r.x, trackY + 8);
    ctx.stroke();
    ctx.restore();

    // 平衡位置
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(eqX, trackY - blockH - 18);
    ctx.lineTo(eqX, trackY + 8);
    ctx.stroke();
    ctx.restore();

    // 弹簧：从墙到物块左壁，随伸缩自然疏密
    const x1 = r.x;
    const x2 = bx - blockW / 2;
    const span = Math.max(0, x2 - x1);
    const amp = clamp(blockH * 0.48, 5, 10);
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.8;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x1, yc);
    if (span > 24) {
      const n = 16;
      for (let i = 0; i < n; i++) {
        const px = x1 + (span * (i + 0.5)) / n;
        ctx.lineTo(px, yc + (i % 2 ? amp : -amp));
      }
    }
    ctx.lineTo(x2, yc);
    ctx.stroke();
    ctx.restore();

    // 物块
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.2;
    ctx.beginPath();
    ctx.roundRect(bx - blockW / 2, trackY - blockH, blockW, blockH, 5);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bx - blockW / 2, trackY - blockH, blockW, blockH, 5);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'm', bx, trackY - blockH / 2, pal.blue, 'center', 14);

    // 振幅刻度
    for (const s of [-1, 1]) {
      const px = eqX + s * A * kx;
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = pal.orange;
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(px, trackY - blockH - 2);
      ctx.lineTo(px, trackY + 4);
      ctx.stroke();
      ctx.restore();
      if (A * kx > 26) {
        label(ctx, s < 0 ? '−A' : '+A', px, trackY + 18, pal.orange, 'center', 13);
      }
    }
    label(ctx, 'O', eqX, trackY + 18, pal.mut, 'center', 13);

    // 速度与回复力
    if (o.arrows) {
      const ay1 = trackY - blockH - 28;
      const ay2 = ay1 - 26;
      const Lmax = r.w * 0.16;
      if (Math.abs(v) > 0.04) {
        const dir = v > 0 ? 1 : -1;
        const L = clamp(Math.abs(v) * 24, 10, Lmax);
        arrow(ctx, bx, ay1, bx + dir * L, ay1, pal.green, 2.4);
        label(ctx, 'v', clamp(bx + dir * (L + 9), r.x + 10, r.x + r.w - 10), ay1, pal.green, dir > 0 ? 'left' : 'right', 14);
      }
      if (Math.abs(F) > 0.2) {
        const dir = F > 0 ? 1 : -1;
        const L = clamp(Math.abs(F) * 3.2, 10, Lmax);
        arrow(ctx, bx, ay2, bx + dir * L, ay2, pal.orange, 2.4);
        label(ctx, 'F', clamp(bx + dir * (L + 9), r.x + 10, r.x + r.w - 10), ay2, pal.orange, dir > 0 ? 'left' : 'right', 14);
      }
    }

    // 位移 x：从平衡位置量到物块
    if (o.disp) {
      const yy = trackY + 34;
      ctx.save();
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(eqX, yy - 7);
      ctx.lineTo(eqX, yy + 7);
      ctx.moveTo(bx, yy - 7);
      ctx.lineTo(bx, yy + 7);
      ctx.stroke();
      ctx.restore();
      if (Math.abs(bx - eqX) > 14) {
        const dir = bx > eqX ? 1 : -1;
        arrow(ctx, eqX + dir * 2, yy, bx - dir * 2, yy, pal.orange, 1.8);
        label(ctx, 'x', (eqX + bx) / 2, yy - 12, pal.orange, 'center', 14);
      } else {
        label(ctx, 'x = 0', eqX, yy - 12, pal.orange, 'center', 14);
      }
    }
  }

  /* ── 位移—时间曲线 ── */
  function xtPanel(ctx, pal, r, A, om, phi, tt) {
    const P = panel(ctx, r, [0, TMAX], [-1.05, 1.05], pal, { xlab: 't/s', ylab: 'x/m', nx: 6, ny: 4 });

    const N = 260;
    const all = [];
    for (let i = 0; i <= N; i++) {
      const s = (TMAX * i) / N;
      all.push([s, A * Math.cos(om * s + phi)]);
    }
    poly(ctx, P.X, P.Y, all, pal.faint, 1.3);

    poly(ctx, P.X, P.Y, [[0, A], [TMAX, A]], pal.orange, 1.2, [4, 4]);
    poly(ctx, P.X, P.Y, [[0, -A], [TMAX, -A]], pal.orange, 1.2, [4, 4]);
    label(ctx, 'A', P.X(TMAX) - 6, P.Y(A) - 10, pal.orange, 'right', 13);
    label(ctx, '−A', P.X(TMAX) - 6, P.Y(-A) + 10, pal.orange, 'right', 13);

    // 已走过的部分画实色
    const tr = [];
    const M = 180;
    for (let i = 0; i <= M; i++) {
      const s = (tt * i) / M;
      tr.push([s, A * Math.cos(om * s + phi)]);
    }
    if (tt > 0.004) poly(ctx, P.X, P.Y, tr, pal.blue, 2.2);

    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(P.X(tt), r.y);
    ctx.lineTo(P.X(tt), r.y + r.h);
    ctx.stroke();
    ctx.restore();
    spot(ctx, P.X(tt), P.Y(A * Math.cos(om * tt + phi)), 4.5, pal.blue, pal.bg2);
  }

  /* ── 参考圆 ── */
  function circlePanel(ctx, pal, r, A, th) {
    const Rmax = Math.min(r.w * 0.32, r.h * 0.30);
    const R = Math.max(Rmax * (A / AMAX), 16);
    const ccx = r.x + r.w / 2;
    const ccy = r.y + r.h * 0.54;

    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(ccx, ccy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(ccx - R, ccy);
    ctx.lineTo(ccx + R, ccy);
    ctx.moveTo(ccx, ccy - R);
    ctx.lineTo(ccx, ccy + R);
    ctx.stroke();
    ctx.restore();

    const pxp = ccx + R * Math.cos(th);
    const pyp = ccy - R * Math.sin(th);

    // 转过的那一段圆心角
    const thm = ((th % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
    if (thm > 0.02) {
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.globalAlpha = 0.8;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(ccx, ccy, R * 0.34, 0, -thm, true);
      ctx.stroke();
      ctx.restore();
    }

    // 半径
    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ccx, ccy);
    ctx.lineTo(pxp, pyp);
    ctx.stroke();
    ctx.restore();
    spot(ctx, ccx, ccy, 3.5, pal.mut, pal.bg2);
    spot(ctx, pxp, pyp, 4.5, pal.purple, pal.bg2);

    // 投影：竖直落到水平直径上
    ctx.save();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(pxp, pyp);
    ctx.lineTo(pxp, ccy);
    ctx.stroke();
    ctx.restore();
    spot(ctx, pxp, ccy, 4, pal.orange, pal.bg2);
    label(ctx, 'x', pxp, ccy + 16, pal.orange, 'center', 14);
    label(ctx, 'A', (ccx + pxp) / 2 + 8, (ccy + pyp) / 2 - 8, pal.purple, 'left', 13);
    label(ctx, 'O', ccx - 9, ccy + 15, pal.mut, 'center', 13);
    label(ctx, '参考圆', ccx, ccy - R - 14, pal.mut, 'center', 14);
  }

  function frame(dt) {
    if (!st.w || !st.h) return;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const A = clamp(nn(q.A, 0.4), 0.1, AMAX);
    const k = clamp(nn(q.k, 20), 5, 30);
    const m = clamp(nn(q.m, 1), 0.4, 2);
    const phi = clamp(nn(q.phi, 0), 0, 360) * D2R;
    const om = Math.sqrt(k / m);
    const T = (2 * Math.PI) / om;

    const key = [A, k, m, phi].join('|');
    if (key !== last) { last = key; reset(); }

    if (dt > 0) {
      if (t < TMAX) t = Math.min(TMAX, t + dt);
      else { hold += dt; if (hold > 0.9) reset(); }
    }

    const th = om * t + phi;
    const x = A * Math.cos(th);
    const v = -A * om * Math.sin(th);
    const a = -om * om * x;
    const F = m * a;                 // 恰好等于 −kx

    const raw = q.mode;
    const mode = raw === 'force' || raw === 'xt' || raw === 'circ' ? raw : 'spring';

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    ctx.clearRect(0, 0, w, h);

    if (mode === 'force') {
      /* ── 左：弹簧振子 + 速度 / 回复力箭头；右：F–x 直线 ── */
      const r1 = { x: w * 0.04, y: h * 0.10, w: w * 0.54, h: h * 0.80 };
      springPanel(ctx, pal, r1, A, x, v, F, { trackY: r1.y + r1.h * 0.60, arrows: true, disp: false });

      const rc = { x: w * 0.62, y: h * 0.16, w: w * 0.33, h: h * 0.66 };
      const g = panel(ctx, rc, [-0.9, 0.9], [-25, 25], pal, { xlab: 'x/m', ylab: 'F/N', nx: 4, ny: 4 });
      // F = −kx 的直线，只取落在纵轴范围内的那一段（poly 不裁剪）
      const xm = Math.min(0.9, 25 / k);
      poly(ctx, g.X, g.Y, [[-xm, k * xm], [xm, -k * xm]], pal.orange, 2.2);

      // 橙点到两轴的虚线投影
      ctx.save();
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(g.X(x), g.Y(F));
      ctx.lineTo(g.X(x), g.Y(0));
      ctx.moveTo(g.X(x), g.Y(F));
      ctx.lineTo(g.X(0), g.Y(F));
      ctx.stroke();
      ctx.restore();
      spot(ctx, g.X(x), g.Y(F), 5, pal.blue, pal.bg2);

      label(ctx, 'F = −kx', rc.x + rc.w - 8, rc.y + 16, pal.orange, 'right', 14);
      label(ctx, '斜率 −k', rc.x + rc.w - 8, rc.y + 36, pal.faint, 'right', 13);

      st.readout([
        ['时间 t', fmt(t, 2) + ' s'],
        ['位移 x', fmt(x, 3) + ' m'],
        ['速度 v', fmt(v, 2) + ' m/s'],
        ['回复力 F', fmt(F, 2) + ' N'],
        ['−kx', fmt(-k * x, 2) + ' N'],
        ['加速度 a', fmt(a, 2) + ' m/s²'],
      ]);
      return;
    }

    if (mode === 'xt') {
      const r = { x: w * 0.10, y: h * 0.10, w: w * 0.82, h: h * 0.80 };
      xtPanel(ctx, pal, r, A, om, phi, t);
      st.readout([
        ['时间 t', fmt(t, 2) + ' s'],
        ['位移 x', fmt(x, 3) + ' m'],
        ['振幅 A', fmt(A, 2) + ' m'],
        ['相位 ωt+φ', fmt((th / D2R) % 360, 0) + '°'],
        ['周期 T', fmt(T, 3) + ' s'],
        ['频率 f', fmt(1 / T, 3) + ' Hz'],
      ]);
      return;
    }

    if (mode === 'circ') {
      const r1 = { x: w * 0.03, y: h * 0.08, w: w * 0.44, h: h * 0.84 };
      circlePanel(ctx, pal, r1, A, th);
      const r2 = { x: w * 0.53, y: h * 0.12, w: w * 0.44, h: h * 0.76 };
      xtPanel(ctx, pal, r2, A, om, phi, t);
      st.readout([
        ['时间 t', fmt(t, 2) + ' s'],
        ['相位 ωt+φ', fmt((th / D2R) % 360, 0) + '°'],
        ['位移 x', fmt(x, 3) + ' m'],
        ['振幅 A', fmt(A, 2) + ' m'],
        ['周期 T', fmt(T, 3) + ' s'],
      ]);
      return;
    }

    /* ── spring：弹簧振子与平衡位置 ── */
    const r = { x: w * 0.06, y: h * 0.10, w: w * 0.88, h: h * 0.80 };
    springPanel(ctx, pal, r, A, x, v, F, { trackY: r.y + r.h * 0.52, arrows: false, disp: true });
    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['位移 x', fmt(x, 3) + ' m'],
      ['振幅 A', fmt(A, 2) + ' m'],
      ['速度 v', fmt(v, 2) + ' m/s'],
      ['周期 T', fmt(T, 3) + ' s'],
    ]);
  }

  return { frame, reset };
}
