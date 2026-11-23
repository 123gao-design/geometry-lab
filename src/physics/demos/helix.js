/* 电10c 洛伦兹力的螺旋线：速度与磁场成 α 角射入匀强磁场。
   把速度拆成平行与垂直的两个分量：v∥ 沿磁场方向、不受力，保持匀速；
   v⊥ 在垂直磁场的平面里受洛伦兹力，做匀速圆周运动。两者合成一条螺旋线。

   世界坐标 x 沿磁场方向、y 竖直向上、z 朝读者。粒子从 (0, r, 0) 出发，
   一整圈的参数是

     x = v∥·t,   y = r cos φ,   z = r sin φ,   φ = ω t,  ω = v⊥/r.

   半径 r = m v⊥/(qB)、周期 T = 2πm/(qB)、螺距 p = v∥·T（一圈沿轴前进的距离）。
   画面上只画一圈：螺距与半径的比 p/r = 2π·cot α 只由夹角决定，改 B 与 v 只改读数、
   不改形状。三维观感由 orbit.js 的正交投影给出。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';
import { makeOrbit } from './orbit.js';

const TAU = Math.PI * 2;
const D2R = Math.PI / 180;
const MP = 1.67e-27;
const QE = 1.6e-19;
const TL = 2.4; // 画面上一圈走完的秒数（真实周期是纳秒量级，这里只作示意）

export function create(st) {
  let t = 0;
  let last = '';

  const reset = () => {
    t = 0;
  };
  reset();

  const orb = makeOrbit({ yaw: -0.52, pitch: 0.38, ylim: 1.2, pmin: 0.14, pmax: 1.02 });

  /** 双头箭头：量螺距 */
  function doubleArrow(ctx, x1, y1, x2, y2, color, lw = 1.5) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len < 2) return;
    const ux = dx / len;
    const uy = dy / len;
    const hs = 7;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = lw;
    ctx.beginPath();
    ctx.moveTo(x1 + ux * hs * 0.7, y1 + uy * hs * 0.7);
    ctx.lineTo(x2 - ux * hs * 0.7, y2 - uy * hs * 0.7);
    ctx.stroke();
    for (const [px, py, sx, sy] of [[x1, y1, ux, uy], [x2, y2, -ux, -uy]]) {
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - sx * hs - sy * hs * 0.42, py - sy * hs + sx * hs * 0.42);
      ctx.lineTo(px - sx * hs + sy * hs * 0.42, py - sy * hs - sx * hs * 0.42);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
  }

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const B = clamp(nn(q.B, 1), 0.1, 2.5);
    const v5 = clamp(nn(q.v, 6), 1, 12);
    const al = clamp(nn(q.al, 55), 25, 82) * D2R;

    const key = [B, v5, al].join('|');
    if (key !== last) {
      last = key;
      reset();
    }
    if (dt > 0) t += dt;

    const vv = v5 * 1e5;
    const vpar = vv * Math.cos(al);
    const vper = vv * Math.sin(al);
    const rr = (MP * vper) / (QE * B);
    const T0 = (TAU * MP) / (QE * B);
    const pp = vpar * T0;

    /* 画面尺度：半径归一成 1，轴长按 p/r 现算 */
    const R = 1;
    const ax = pp / rr;
    const u = ((t % TL) + TL) % TL / TL;
    const phi = TAU * u;
    const px = ax * u;
    const cy = R * Math.cos(phi);
    const cz = R * Math.sin(phi);

    /* ── 取景：整条螺旋、螺距量线、磁场箭头 ── */
    let lo = Infinity, hi = -Infinity, bot = Infinity, top = -Infinity;
    const take = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      if (X < lo) lo = X;
      if (X > hi) hi = X;
      if (U < bot) bot = U;
      if (U > top) top = U;
    };
    for (let i = 0; i <= 96; i++) {
      const a = (i / 96) * TAU;
      const x = (i * ax) / 96;
      take(x, R * Math.cos(a), R * Math.sin(a));
    }
    take(0, -1.85 * R, 0);
    take(ax, -1.85 * R, 0);
    take(ax + 0.16 * ax * 0.6, 0, 0);
    take(-0.12 * ax, 0, 0);

    /* 两侧各留一成：粒子走到两端时那三支速度箭头还伸得出去 */
    const S = Math.min((w * 0.78) / Math.max(0.3, hi - lo), (h * 0.72) / Math.max(0.3, top - bot));
    const OX = w / 2 - (S * (lo + hi)) / 2;
    const OY = h / 2 + (S * (top + bot)) / 2;
    const P = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      return [OX + S * X, OY - S * U];
    };

    ctx.clearRect(0, 0, w, h);

    /* ── 起点处的圆截面：半径 r 的虚线圆 ── */
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = pal.blue;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const a = (i * TAU) / 64;
      const p = P(0, R * Math.cos(a), R * Math.sin(a));
      if (i) ctx.lineTo(p[0], p[1]);
      else ctx.moveTo(p[0], p[1]);
    }
    ctx.stroke();
    ctx.restore();

    /* ── 螺旋线本体：整条淡画，粒子身后一段亮画 ── */
    const helixPath = (u0, u1, color, lw, alpha) => {
      const N = Math.max(8, Math.round((u1 - u0) * 120));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = lw;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= N; i++) {
        const uu = u0 + ((u1 - u0) * i) / N;
        const p = P(ax * uu, R * Math.cos(TAU * uu), R * Math.sin(TAU * uu));
        if (i) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
      ctx.restore();
    };
    helixPath(0, 1, pal.blue, 1.6, 0.42);
    if (u - 0.32 > 0) helixPath(u - 0.32, u, pal.blue, 2.4, 1);

    /* ── 磁场：沿轴三支箭头 ── */
    const bl = ax * 0.16;
    for (const bx of [0.06 * ax, 0.36 * ax, 0.66 * ax]) {
      const a1 = P(bx, 0, 0);
      const a2 = P(bx + bl, 0, 0);
      arrow(ctx, a1[0], a1[1], a2[0], a2[1], pal.mut, 1.5);
    }
    const bEnd = P(0.66 * ax + bl, 0, 0);
    label(ctx, 'B', bEnd[0] + 8, bEnd[1] - 8, pal.mut, 'left', 14);

    /* ── 螺距 p：起点圆上同一点到下一圈同一点沿轴的距离 ── */
    const yb = -1.62 * R;
    const pa = P(0, yb, 0);
    const pb = P(ax, yb, 0);
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(P(0, -1.38 * R, 0)[0], P(0, -1.38 * R, 0)[1]);
    ctx.lineTo(pa[0], pa[1]);
    ctx.moveTo(P(ax, -1.38 * R, 0)[0], P(ax, -1.38 * R, 0)[1]);
    ctx.lineTo(pb[0], pb[1]);
    ctx.stroke();
    ctx.restore();
    doubleArrow(ctx, pa[0], pa[1], pb[0], pb[1], pal.orange, 1.4);
    label(ctx, '螺距 p', (pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2 + 15, pal.orange, 'center', 13);

    /* ── 半径：轴上的垂足到粒子 ── */
    const foot = P(px, 0, 0);
    const pos = P(px, cy, cz);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(foot[0], foot[1]);
    ctx.lineTo(pos[0], pos[1]);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'r', (foot[0] + pos[0]) / 2 + 8, (foot[1] + pos[1]) / 2 - 8, pal.cyan, 'left', 13);

    /* ── 速度分解：v∥ 沿轴、v⊥ 沿切向、合速度 v 与螺旋线相切 ── */
    const basePx = clamp(S * R * 1.15, 40, 84);
    const lPar = basePx * Math.cos(al);
    const lPer = basePx * Math.sin(al);
    const dPar = (() => {
      const a1 = P(px, 0, 0);
      const a2 = P(px + 1, 0, 0);
      const dx = a2[0] - a1[0];
      const dy = a2[1] - a1[1];
      const d = Math.hypot(dx, dy) || 1;
      return [dx / d, dy / d];
    })();
    /* 切向在 (y,z) 平面里是 (−sinφ, cosφ)，投影到屏幕 */
    const tp = P(px, -R * Math.sin(phi), R * Math.cos(phi));
    const dPer = (() => {
      const dx = tp[0] - foot[0];
      const dy = tp[1] - foot[1];
      const d = Math.hypot(dx, dy) || 1;
      return [dx / d, dy / d];
    })();

    const endPar = [pos[0] + dPar[0] * lPar, pos[1] + dPar[1] * lPar];
    const endPer = [pos[0] + dPer[0] * lPer, pos[1] + dPer[1] * lPer];
    const endV = [pos[0] + dPar[0] * lPar + dPer[0] * lPer, pos[1] + dPar[1] * lPar + dPer[1] * lPer];

    ctx.save();
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(endPar[0], endPar[1]);
    ctx.lineTo(endV[0], endV[1]);
    ctx.moveTo(endPer[0], endPer[1]);
    ctx.lineTo(endV[0], endV[1]);
    ctx.stroke();
    ctx.restore();

    arrow(ctx, pos[0], pos[1], endPar[0], endPar[1], pal.orange, 1.8);
    arrow(ctx, pos[0], pos[1], endPer[0], endPer[1], pal.cyan, 1.8);
    arrow(ctx, pos[0], pos[1], endV[0], endV[1], pal.green, 2.2);

    label(ctx, 'v∥', endPar[0] + 8, endPar[1] - 4, pal.orange, 'left', 13);
    label(ctx, 'v⊥', endPer[0] + 8, endPer[1] + 6, pal.cyan, 'left', 13);
    label(ctx, 'v', endV[0] + 8, endV[1] - 4, pal.green, 'left', 13);

    spot(ctx, pos[0], pos[1], clamp(S * 0.03, 5, 9), pal.purple, pal.ink);

    st.readout([
      ['磁感应强度 B', fmt(B, 2) + ' T'],
      ['速度 v', fmt(v5, 2) + ' ×10⁵ m/s'],
      ['与 B 的夹角 α', fmt(al / D2R, 0) + ' °'],
      ['v cos α（平行）', fmt(v5 * Math.cos(al), 2) + ' ×10⁵ m/s'],
      ['v sin α（垂直）', fmt(v5 * Math.sin(al), 2) + ' ×10⁵ m/s'],
      ['圆半径 r', fmt(rr * 1e3, 1) + ' mm'],
      ['周期 T', fmt(T0 * 1e9, 1) + ' ns'],
      ['螺距 p', fmt(pp * 100, 2) + ' cm'],
      ['r·B / mv⊥/q', fmt(rr * B * 1e3, 2) + ' / ' + fmt((MP * vper) / QE * 1e3, 2) + ' ×10⁻³ T·m'],
    ]);
  }

  return { frame, reset, orbit: orb };
}
