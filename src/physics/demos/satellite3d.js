/* 力21b 三维卫星轨道：卫星并不都在赤道上空飞，绝大多数轨道平面与赤道面成
   某个倾角 i。轨道平面过地心，与赤道面的交线叫节线；卫星在轨道上转一圈，
   星下点在北纬 i 与南纬 i 之间来回一趟。

   世界坐标：y 轴指向北极（竖直向上），x-z 面是赤道面，x 向右、z 朝读者。
   轨道取 e1 = (1,0,0)、e2 = (0, sin i, cos i)，于是

     位置 = r (cos θ, sin θ · sin i, sin θ · cos i)，

   θ = 0 落在节线上（赤道面内），θ = 90° 到达轨道最北点。地球半径取 1，
   卫星轨道半径以地球半径为单位。

   正交投影下球体的轮廓恰是一个屏幕圆，所以地球直接画成半径 R·S 的圆盘，
   赤道单独按三维取样画椭圆。三维观感由 orbit.js 的正交投影给出。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';
import { makeOrbit } from './orbit.js';

const TAU = Math.PI * 2;
const D2R = Math.PI / 180;
const GM = 3.986e14;
const RE = 6.37e6;

export function create(st) {
  let t = 0;
  let last = '';

  const reset = () => {
    t = 0;
  };
  reset();

  const orb = makeOrbit({ yaw: -0.58, pitch: 0.36, ylim: 1.2, pmin: 0.1, pmax: 1.05 });

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const rR = clamp(nn(q.r, 2.5), 1.15, 8);
    const inc = clamp(nn(q.inc, 45), 0, 90) * D2R;

    const key = [rR, inc].join('|');
    if (key !== last) {
      last = key;
      reset();
    }
    if (dt > 0) t += dt;

    const rkm = rR * RE;
    const v = Math.sqrt(GM / rkm);
    const T = TAU * Math.sqrt((rkm * rkm * rkm) / GM);
    const Tdisp = clamp(2.6 * Math.pow(rR, 1.5), 1.6, 13);

    const si = Math.sin(inc);
    const ci = Math.cos(inc);
    const th = TAU * ((t % Tdisp) / Tdisp);

    /* 轨道平面内的竖直方向：e2 = (0, sin i, cos i) */
    const pos = (a) => [rR * Math.cos(a), rR * Math.sin(a) * si, rR * Math.sin(a) * ci];

    /* ── 取景：地球、整条轨道、赤道、极轴 ── */
    let lo = Infinity, hi = -Infinity, bot = Infinity, top = -Infinity;
    const take = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      if (X < lo) lo = X;
      if (X > hi) hi = X;
      if (U < bot) bot = U;
      if (U > top) top = U;
    };
    for (let i = 0; i < 48; i++) {
      const a = (i * TAU) / 48;
      take(Math.cos(a), 0, Math.sin(a));
      const p = pos(a);
      take(p[0], p[1], p[2]);
    }
    take(0, 1.22, 0);
    take(0, -1.22, 0);

    const S = Math.min((w * 0.82) / Math.max(0.5, hi - lo), (h * 0.82) / Math.max(0.5, top - bot));
    const OX = w / 2 - (S * (lo + hi)) / 2;
    const OY = h / 2 + (S * (top + bot)) / 2;
    const P = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      return [OX + S * X, OY - S * U];
    };

    ctx.clearRect(0, 0, w, h);

    const O = P(0, 0, 0);

    /* ── 地球：正交投影下就是一枚屏幕圆盘 ── */
    ctx.save();
    ctx.beginPath();
    ctx.arc(O[0], O[1], S, 0, TAU);
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.15;
    ctx.fill();
    ctx.globalAlpha = 0.8;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();

    /* ── 极轴与北极 ── */
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    const an = P(0, 1.18, 0);
    const as = P(0, -1.18, 0);
    ctx.beginPath();
    ctx.moveTo(an[0], an[1]);
    ctx.lineTo(as[0], as[1]);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'N', an[0] + 3, an[1] - 10, pal.mut, 'center', 13);

    /* ── 赤道：球面上半径 1 的圆，按三维取样 ── */
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.globalAlpha = 0.75;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const a = (i * TAU) / 80;
      const p = P(Math.cos(a), 0, Math.sin(a));
      if (i) ctx.lineTo(p[0], p[1]);
      else ctx.moveTo(p[0], p[1]);
    }
    ctx.stroke();
    ctx.restore();

    /* ── 节线：轨道平面与赤道面的交线 ── */
    ctx.save();
    ctx.setLineDash([2, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    const n1 = P(-1.18 * rR, 0, 0);
    const n2 = P(1.18 * rR, 0, 0);
    ctx.beginPath();
    ctx.moveTo(n1[0], n1[1]);
    ctx.lineTo(n2[0], n2[1]);
    ctx.stroke();
    ctx.restore();

    /* ── 轨道在赤道面上的投影：星下点走的路线 ── */
    if (inc > 0.02) {
      ctx.save();
      ctx.setLineDash([3, 6]);
      ctx.strokeStyle = pal.cyan;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      for (let i = 0; i <= 96; i++) {
        const a = (i * TAU) / 96;
        const p = P(rR * Math.cos(a), 0, rR * Math.sin(a) * ci);
        if (i) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
      ctx.restore();
    }

    /* ── 轨道：整圈淡虚线，卫星身后一段实线 ── */
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.blue;
    ctx.globalAlpha = 0.7;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const p = pos((i * TAU) / 120);
      const s = P(p[0], p[1], p[2]);
      if (i) ctx.lineTo(s[0], s[1]);
      else ctx.moveTo(s[0], s[1]);
    }
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2.2;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const p = pos(th - 0.5 + (0.5 * i) / 24);
      const s = P(p[0], p[1], p[2]);
      if (i) ctx.lineTo(s[0], s[1]);
      else ctx.moveTo(s[0], s[1]);
    }
    ctx.stroke();
    ctx.restore();

    /* ── 轨道倾角 i：节线处由赤道方向量到轨道方向 ── */
    const rho = Math.max(1.1, 0.42 * rR);
    if (inc > 0.06) {
      ctx.save();
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      const steps = Math.max(6, Math.ceil((inc / TAU) * 72));
      for (let i = 0; i <= steps; i++) {
        const a = (inc * i) / steps;
        const p = P(0, rho * Math.sin(a), rho * Math.cos(a));
        if (i) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
      ctx.restore();
      const am = inc / 2;
      const lp = P(0, (rho + 15 / S) * Math.sin(am), (rho + 15 / S) * Math.cos(am));
      label(ctx, 'i', lp[0], lp[1], pal.green, 'center', 14);
    }

    /* ── 半径：地心到卫星 ── */
    const ps = pos(th);
    const sat = P(ps[0], ps[1], ps[2]);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(O[0], O[1]);
    ctx.lineTo(sat[0], sat[1]);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'r', (O[0] + sat[0]) / 2 + 8, (O[1] + sat[1]) / 2 - 8, pal.cyan, 'left', 13);

    /* ── 速度：沿轨道切向，长度按 v/v₁ 缩尺 ── */
    const tan3 = [-Math.sin(th), Math.cos(th) * si, Math.cos(th) * ci];
    const a0 = P(ps[0], ps[1], ps[2]);
    const a1 = P(ps[0] + tan3[0], ps[1] + tan3[1], ps[2] + tan3[2]);
    const dx = a1[0] - a0[0];
    const dy = a1[1] - a0[1];
    const dl = Math.hypot(dx, dy) || 1;
    const vLen = clamp(52 * (v / 7900), 24, 62);
    const vEnd = [sat[0] + (dx / dl) * vLen, sat[1] + (dy / dl) * vLen];
    arrow(ctx, sat[0], sat[1], vEnd[0], vEnd[1], pal.green, 2);
    label(ctx, 'v', vEnd[0] + 9, vEnd[1] - 5, pal.green, 'left', 13);

    spot(ctx, sat[0], sat[1], clamp(S * 0.022, 4.5, 8), pal.orange, pal.ink);

    st.readout([
      ['轨道半径 r', fmt(rR, 2) + ' R'],
      ['离地高度 h', fmt(((rR - 1) * RE) / 1000, 0) + ' km'],
      ['线速度 v', fmt(v / 1000, 2) + ' km/s'],
      ['周期 T', fmt(T / 3600, 2) + ' h'],
      ['轨道倾角 i', fmt(inc / D2R, 0) + ' °'],
      ['星下点纬度', fmt(-inc / D2R, 0) + ' ° ~ ' + fmt(inc / D2R, 0) + ' °'],
      ['v²r / GM', fmt((v * v * rkm) / GM, 3)],
      ['vT / 2πr', fmt((v * T) / (TAU * rkm), 3)],
    ]);
  }

  return { frame, reset, orbit: orb };
}
