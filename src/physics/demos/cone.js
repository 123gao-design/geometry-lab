/* 力16b 圆锥摆：长 L 的轻绳悬在 O 点，小球在水平面内绕竖直轴匀速转动，
   绳与竖直方向成 θ 角。悬点高度 H = L cosθ，圆半径 r = L sinθ，
   角速度 ω = √(g/H)，绳张力 T = mg/cosθ，合力 mω²r 水平指向圆心。

   三维观感由 orbit.js 的正交投影给出（与 振2c 的纸带同一套相机）：
   世界坐标 x 向右、y 竖直向上、z 朝读者。取景每帧按投影后的包围盒现算，
   转到哪个角度画面都留在画框里。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';
import { makeOrbit } from './orbit.js';

const TAU = Math.PI * 2;
const D2R = Math.PI / 180;
const G = 9.8;

export function create(st) {
  let t = 0;
  let last = '';

  const reset = () => {
    t = 0;
  };
  reset();

  /* 视角：从右前上方看，锥面与圆一眼分得清 */
  const orb = makeOrbit({ yaw: -0.62, pitch: 0.40, ylim: 1.25, pmin: 0.14, pmax: 1.05 });

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const L = clamp(nn(q.L, 1), 0.4, 2);
    const th = clamp(nn(q.th, 36), 10, 75) * D2R;
    const m = clamp(nn(q.m, 0.5), 0.1, 3);

    const key = [L, th, m].join('|');
    if (key !== last) {
      last = key;
      reset();
    }
    if (dt > 0) t += dt;

    const r = L * Math.sin(th);
    const H = L * Math.cos(th);
    const om = Math.sqrt(G / H);
    const Tp = TAU / om;
    const Fc = m * om * om * r;
    const Tn = (m * G) / Math.cos(th);
    const mg = m * G;
    const phi = om * t;
    const cif = Math.cos(phi);
    const sif = Math.sin(phi);

    /* ── 取景：运动圆、悬点、圆心 ── */
    let lo = Infinity, hi = -Infinity, bot = Infinity, top = -Infinity;
    const take = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      if (X < lo) lo = X;
      if (X > hi) hi = X;
      if (U < bot) bot = U;
      if (U > top) top = U;
    };
    for (let i = 0; i < 24; i++) {
      const a = (i * TAU) / 24;
      take(r * Math.cos(a), 0, r * Math.sin(a));
    }
    take(0, H + 0.08 * L, 0);
    take(0, -0.06 * L, 0);
    /* 摆球下方的 mg 箭头与上方的 T 箭头是按像素定的，换算成世界单位约 0.22L，
       这里先在竖直包围盒上把这一段留出来，长摆小角度时才不会戳出画框 */
    bot -= 0.28 * L;
    top += 0.10 * L;

    /* 竖直方向留出力气箭头的余地，底面收得比横向紧一些 */
    const S = Math.min((w * 0.86) / Math.max(0.3, hi - lo), (h * 0.72) / Math.max(0.3, top - bot));
    const OX = w / 2 - (S * (lo + hi)) / 2;
    const OY = h / 2 + 0.02 * h + (S * (top + bot)) / 2;
    const P = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      return [OX + S * X, OY - S * U];
    };

    ctx.clearRect(0, 0, w, h);

    const piv = P(0, H, 0);
    const O = P(0, 0, 0);
    const bobS = P(r * cif, 0, r * sif);

    /* ── 运动圆：三维取样后投影的闭合虚线 ── */
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.blue;
    ctx.globalAlpha = 0.78;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i <= 72; i++) {
      const a = (i * TAU) / 72;
      const p = P(r * Math.cos(a), 0, r * Math.sin(a));
      if (i) ctx.lineTo(p[0], p[1]);
      else ctx.moveTo(p[0], p[1]);
    }
    ctx.stroke();
    ctx.restore();

    /* ── 锥面：悬点向圆周上十二点的母线，淡虚线 ── */
    ctx.save();
    ctx.setLineDash([3, 6]);
    ctx.strokeStyle = pal.faint;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i < 12; i++) {
      const a = (i * TAU) / 12;
      const p = P(r * Math.cos(a), 0, r * Math.sin(a));
      ctx.moveTo(piv[0], piv[1]);
      ctx.lineTo(p[0], p[1]);
    }
    ctx.stroke();
    ctx.restore();

    /* ── 转轴：悬点到圆心 ── */
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = pal.rule;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(piv[0], piv[1]);
    ctx.lineTo(O[0], O[1]);
    ctx.stroke();
    ctx.restore();
    spot(ctx, O[0], O[1], 3, pal.mut, pal.bg2);

    /* ── 半径：圆心到摆球在圆面上的投影 ── */
    const foot = P(r * cif, 0, r * sif);
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(O[0], O[1]);
    ctx.lineTo(foot[0], foot[1]);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'r', (O[0] + foot[0]) / 2 + 8, (O[1] + foot[1]) / 2 - 7, pal.cyan, 'left', 13);

    /* ── 摆角 θ：由竖直轴量到摆线，在摆动平面里取样再投影 ── */
    const arw = clamp(S * L * 0.34, 22, 90) / S;
    if (th > 0.02) {
      ctx.save();
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const steps = Math.max(8, Math.ceil((th / TAU) * 60));
      for (let i = 0; i <= steps; i++) {
        const a = (th * i) / steps;
        const p = P(arw * Math.sin(a) * cif, H - arw * Math.cos(a), arw * Math.sin(a) * sif);
        if (i) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
      ctx.restore();
      const am = th / 2;
      const lp = P((arw + 13 / S) * Math.sin(am) * cif, H - (arw + 13 / S) * Math.cos(am), (arw + 13 / S) * Math.sin(am) * sif);
      label(ctx, 'θ', lp[0], lp[1], pal.green, 'center', 14);
    }

    /* ── 悬绳与摆球 ── */
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(piv[0], piv[1]);
    ctx.lineTo(bobS[0], bobS[1]);
    ctx.stroke();
    const bobR = clamp(S * 0.045, 6, 13);
    spot(ctx, bobS[0], bobS[1], bobR, pal.blue, pal.ink);

    /* ── 摆球上的三支力：T 沿绳、mg 竖直向下、合力 mω²r 水平指向圆心。
          T 竖直向上的分量 T cosθ 用虚线补出，与 mg 等长反向；
          T 水平向内的分量 T sinθ 正是合并后的向心力 ── */
    const basePx = clamp(S * L * 0.22, 44, 88);
    const lT = basePx;
    const lmg = basePx * Math.cos(th);
    const lF = basePx * Math.sin(th);
    const dT = (() => {
      const dx = piv[0] - bobS[0];
      const dy = piv[1] - bobS[1];
      const d = Math.hypot(dx, dy) || 1;
      return [dx / d, dy / d];
    })();
    const dF = (() => {
      const dx = O[0] - foot[0];
      const dy = O[1] - foot[1];
      const d = Math.hypot(dx, dy) || 1;
      return [dx / d, dy / d];
    })();

    const tEnd = [bobS[0] + dT[0] * lT, bobS[1] + dT[1] * lT];
    const fEnd = [bobS[0] + dF[0] * lF, bobS[1] + dF[1] * lF];
    const gEnd = [bobS[0], bobS[1] + lmg];
    const uEnd = [bobS[0], bobS[1] - lmg];

    /* 平行四边形的两条补线 */
    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fEnd[0], fEnd[1]);
    ctx.lineTo(tEnd[0], tEnd[1]);
    ctx.moveTo(uEnd[0], uEnd[1]);
    ctx.lineTo(tEnd[0], tEnd[1]);
    ctx.stroke();
    ctx.restore();

    arrow(ctx, bobS[0], bobS[1], gEnd[0], gEnd[1], pal.orange, 2);
    arrow(ctx, bobS[0], bobS[1], fEnd[0], fEnd[1], pal.green, 2);
    arrow(ctx, bobS[0], bobS[1], tEnd[0], tEnd[1], pal.blue, 2.2);

    /* 竖直分量：与 mg 等长反向的虚线 */
    if (lmg > 12) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(bobS[0], bobS[1]);
      ctx.lineTo(uEnd[0], uEnd[1]);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'T cosθ', uEnd[0] + 8, uEnd[1] - 3, pal.orange, 'left', 13);
    }

    label(ctx, 'mg', gEnd[0] + 9, gEnd[1] + 3, pal.orange, 'left', 13);
    if (lF > 12) label(ctx, 'mω²r', fEnd[0], fEnd[1] - 10, pal.green, 'center', 13);
    label(ctx, 'T', tEnd[0] + dT[0] * 9, tEnd[1] + dT[1] * 9, pal.blue, 'center', 13);

    st.readout([
      ['摆长 L', fmt(L, 2) + ' m'],
      ['偏角 θ', fmt(th / D2R, 1) + ' °'],
      ['圆半径 r', fmt(r, 2) + ' m'],
      ['角速度 ω', fmt(om, 2) + ' rad/s'],
      ['周期 T', fmt(Tp, 2) + ' s'],
      ['绳张力 T', fmt(Tn, 2) + ' N'],
      ['T cosθ / mg', fmt(Tn * Math.cos(th), 2) + ' / ' + fmt(mg, 2) + ' N'],
      ['T sinθ / mω²r', fmt(Tn * Math.sin(th), 2) + ' / ' + fmt(Fc, 2) + ' N'],
    ]);
  }

  return { frame, reset, orbit: orb };
}
