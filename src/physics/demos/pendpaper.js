/* 振2c 单摆与匀速纸带。摆球下端接一支笔，笔尖贴着纸面；纸带沿 +z 匀速平移，
   笔尖在纸面上留下 x = L sin(θ₀ cos ωτ) 对 z = v(t − τ) 的曲线，波长 λ = vT。
   三维感由一支手写的正交投影给出（物理演示不接 three.js）：

     X = x·cos yaw − z·sin yaw
     U = x·sin yaw·sin pitch + y·cos pitch + z·cos yaw·sin pitch

   x 沿摆的摆动方向、y 竖直向上、z 是纸带走的方向。相机由 orbit.js 的 makeOrbit 管，
   按住画面拖动转视角、双击复原（外壳见了 orbit 就把平移手势让给转视角）。
   取景每帧按投影后的包围盒现算，转到哪个角度图都留在画框里。
   纸面取 y = 0，x ∈ [−XW, XW]，z ∈ [0, ZL]；悬点在 (0, L + HB, 0)，
   摆球在 (L sinθ, HB + L(1 − cosθ), 0)，笔杆从球心竖直落到纸面 (L sinθ, 0, 0)。
   时刻 τ 落下的墨迹在 t 时刻位于 z = v(t − τ)，所以纸自己的坐标系里墨迹是正弦线，
   屏幕上它随纸带一道往远处退。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';
import { makeOrbit } from './orbit.js';

const D2R = Math.PI / 180;
const HB = 0.2; // 摆球最低点离纸面的高度，米（就是笔杆的长度）
const ZL = 1.8; // 纸带沿 z 的长度，米

export function create(st) {
  let t = 0;
  let hold = 0;
  let last = '';

  const reset = () => {
    t = 0;
    hold = 0;
  };
  reset();

  /* 视角：默认从右前上方看，纸带往右后方退；转到 ±70° 左右仍然认得出单摆 */
  const orb = makeOrbit({ yaw: -0.55, pitch: 0.42, ylim: 1.2, pmin: 0.16, pmax: 1.05 });

  /** 双头箭头：量两个同向波峰之间纸带走过的距离 λ */
  function doubleArrow(ctx, x1, y1, x2, y2, color, lw = 1.6) {
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
    const L = clamp(nn(q.L, 1), 0.3, 2);
    const th0 = clamp(nn(q.th0, 12), 4, 30) * D2R;
    const g = clamp(nn(q.g, 9.8), 4, 15);
    const vp = clamp(nn(q.vp, 0.4), 0.15, 0.9);
    const om = Math.sqrt(g / L);
    const T = (2 * Math.PI) / om;
    const lam = vp * T;

    const key = [L, th0, g, vp].join('|');
    if (key !== last) {
      last = key;
      reset();
    }

    /* 走满一趟纸、再多给一个周期就停下重放；纸慢的时候封顶 9 s，免得空等太久。
       越过远边的墨迹要裁掉——它跟着纸带出了画面 */
    const tmax = Math.min(ZL / vp + T, 9);
    if (dt > 0) {
      if (t < tmax) t = Math.min(tmax, t + dt);
      else {
        hold += dt;
        if (hold > 0.9) reset();
      }
    }

    const th = th0 * Math.cos(om * t);
    const amp = L * Math.sin(th0);
    const topY = L + HB;

    /* ── 取景：纸面四角、悬点与摆球扫过的弧顶，投影后取包围盒 ── */
    const XW = Math.max(0.18, amp * 1.32); // 纸带半宽，留出摆幅外的余量
    const arcTop = HB + L * (1 - Math.cos(th0));
    let lo = Infinity, hi = -Infinity, bot = Infinity, top = -Infinity;
    const take = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      if (X < lo) lo = X;
      if (X > hi) hi = X;
      if (U < bot) bot = U;
      if (U > top) top = U;
    };
    take(-XW, 0, 0); take(XW, 0, 0); take(-XW, 0, ZL); take(XW, 0, ZL);
    take(0, topY + 0.02, 0);
    take(-amp, arcTop, 0); take(amp, arcTop, 0);

    const S = Math.min(
      (w * 0.88) / Math.max(0.3, hi - lo),
      (h * 0.80) / Math.max(0.3, top - bot),
    );
    const OX = w / 2 - (S * (lo + hi)) / 2;
    const OY = h / 2 + (S * (top + bot)) / 2;
    /** 世界点 → 屏幕点（画布 y 朝下，U 朝上所以取负） */
    const P = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      return [OX + S * X, OY - S * U];
    };

    ctx.clearRect(0, 0, w, h);

    /* ── 纸面：投影后的平行四边形，近边在下、远边往右后方退 ── */
    const nA = P(-XW, 0, 0);
    const nB = P(XW, 0, 0);
    const fB = P(XW, 0, ZL);
    const fA = P(-XW, 0, ZL);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(nA[0], nA[1]);
    ctx.lineTo(nB[0], nB[1]);
    ctx.lineTo(fB[0], fB[1]);
    ctx.lineTo(fA[0], fA[1]);
    ctx.closePath();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = pal.card;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.rule;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.restore();

    /* 纸上的格线：横向那一族跟着纸带平移，看得出纸在走
       （纸走 +z，t 时刻 k 号格线落在 z = k·dg − v·t 的余数那里） */
    const dg = 0.4;
    const ph = (((vp * t) % dg) + dg) % dg;
    ctx.save();
    ctx.strokeStyle = pal.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let z = dg - ph; z <= ZL - 1e-9; z += dg) {
      const a = P(-XW, 0, z);
      const b = P(XW, 0, z);
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
    }
    for (let x = -XW + dg; x < XW - 1e-9; x += dg) {
      const a = P(x, 0, 0);
      const b = P(x, 0, ZL);
      ctx.moveTo(a[0], a[1]);
      ctx.lineTo(b[0], b[1]);
    }
    ctx.stroke();
    ctx.restore();

    /* 近边加粗一档：纸带的这一侧朝着读者 */
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(nA[0], nA[1]);
    ctx.lineTo(nB[0], nB[1]);
    ctx.stroke();
    ctx.restore();

    /* ── 墨迹：x = L sin(θ₀ cos ωτ)，z = v(t − τ)，逐点按解析式落纸。
           τ 越小 z 越大，最早的一段越过远边以后从截断处起笔 ── */
    if (t > 0.01 && vp * t > 0.001) {
      const N = 260;
      const i0 = vp * t > ZL ? Math.min(N, Math.ceil(N * (1 - ZL / (vp * t)))) : 0;
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 2.4;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = i0; i <= N; i++) {
        const tau = (t * i) / N;
        const x = L * Math.sin(th0 * Math.cos(om * tau));
        const z = vp * (t - tau);
        const p = P(x, 0, z);
        if (i > i0) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
      ctx.restore();
    }

    /* ── 空间周期 λ：相邻两个同向波峰在纸上隔开 vT ── */
    const nPer = Math.floor(t / T + 1e-9);
    if (nPer >= 1) {
      const xp = amp; // 波峰处的水平位移就是 L sinθ₀
      const z1 = vp * (t - nPer * T);
      const z0 = z1 + vp * T;
      const a0 = P(xp, 0, z0);
      const a1 = P(xp, 0, z1);
      const len = Math.hypot(a1[0] - a0[0], a1[1] - a0[1]);
      /* 两个波峰都得落在纸上，量出来的 λ 才看得见 */
      if (len > 44 && z0 <= ZL) {
        /* 波峰连线沿纸带走的方向，法向朝纸面一侧，避开波形 */
        const nx = (a1[1] - a0[1]) / len;
        const ny = -(a1[0] - a0[0]) / len;
        const off = 13;
        const o0x = a0[0] + nx * off;
        const o0y = a0[1] + ny * off;
        const o1x = a1[0] + nx * off;
        const o1y = a1[1] + ny * off;
        doubleArrow(ctx, o0x, o0y, o1x, o1y, pal.orange, 1.6);
        label(ctx, 'λ', (o0x + o1x) / 2 + nx * 14, (o0y + o1y) / 2 + ny * 14, pal.orange, 'center', 13);
        spot(ctx, a0[0], a0[1], 3.4, pal.purple, pal.bg2);
        spot(ctx, a1[0], a1[1], 3.4, pal.purple, pal.bg2);
      }
    }

    /* ── 纸带走的方向：一支箭头立在纸面右侧的空处 ── */
    const vA = P(XW + 0.1, 0, ZL * 0.3);
    const vB = P(XW + 0.1, 0, ZL * 0.52);
    arrow(ctx, vA[0], vA[1], vB[0], vB[1], pal.green, 1.8);
    label(ctx, '纸带 v', vB[0] + 10, vB[1] - 4, pal.green, 'left', 13);

    /* ── 单摆：支架、竖直参考线、摆角弧、摆线、摆球 ── */
    const piv = P(0, topY, 0);
    const foot = P(0, 0, 0);
    const bobX = L * Math.sin(th);
    const bobY = HB + L * (1 - Math.cos(th));
    const bobS = P(bobX, bobY, 0);
    const bobR = clamp(S * 0.05, 8, 18);

    /* 支架横杆沿 x 轴，跟着视角一起转 */
    const barA = P(-0.13, topY, 0);
    const barB = P(0.13, topY, 0);
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(barA[0], barA[1]);
    ctx.lineTo(barB[0], barB[1]);
    ctx.stroke();

    /* 竖直参考线一直落到纸面，标出 x = 0 那条线 */
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(piv[0], piv[1]);
    ctx.lineTo(foot[0], foot[1]);
    ctx.stroke();
    ctx.restore();

    /* 摆角弧：由竖直参考线量到摆线。弧在摆的摆动平面里取点再投影，
       转视角时不会退成一枚贴在平面上的圆 */
    const arw = clamp(S * L * 0.38, 24, 92) / S;
    if (Math.abs(th) > 0.03) {
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const steps = Math.max(6, Math.ceil((Math.abs(th) / Math.PI) * 36));
      for (let i = 0; i <= steps; i++) {
        const a = (th * i) / steps;
        const p = P(arw * Math.sin(a), topY - arw * Math.cos(a), 0);
        if (i) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
      const mid = th / 2;
      const lp = P((arw + 14 / S) * Math.sin(mid), topY - (arw + 14 / S) * Math.cos(mid), 0);
      label(ctx, 'θ', lp[0], lp[1], pal.green, 'center', 14);
    }

    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(piv[0], piv[1]);
    ctx.lineTo(bobS[0], bobS[1]);
    ctx.stroke();
    spot(ctx, bobS[0], bobS[1], bobR, pal.blue, pal.ink);

    /* 笔杆：球心竖直落到纸面，笔尖正是墨迹的末端 */
    const tip = P(bobX, 0, 0);
    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(bobS[0], bobS[1] + bobR * 0.4);
    ctx.lineTo(tip[0], tip[1]);
    ctx.stroke();
    ctx.restore();
    spot(ctx, tip[0], tip[1], 4, pal.purple, pal.bg2);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['摆角 θ', fmt(th / D2R, 1) + ' °'],
      ['周期 T', fmt(T, 2) + ' s'],
      ['纸带速度 v', fmt(vp, 2) + ' m/s'],
      ['纸带走过的距离', fmt(vp * t, 2) + ' m'],
      ['空间周期 λ', fmt(lam, 2) + ' m'],
      ['轨迹振幅', fmt(amp, 2) + ' m'],
    ]);
  }

  return { frame, reset, orbit: orb };
}
