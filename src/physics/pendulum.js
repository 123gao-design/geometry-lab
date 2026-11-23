/* 摆钟（单摆）：浅色等轴测的演示架。两根立柱夹一道横梁，摆线从悬点垂下，
   摆球圆弧摆动，身后一圈角度刻度标出摆幅。周期 T = 2π√(L/g) 随摆长变化。
   视角由「视角」滑块缓慢转动。 */

import { label, fmt, clamp } from './gfx.js';
import { makeCam, fitCam, box, cyl, sphere, rod, poly3, ring3, halo, SKIN, tones } from './isofig.js';

const BASE = { w: 34, d: 22, y0: -4, y1: 0 };
const POSTX = 9.5;
const POSTR = 1.3;
const POSTTOP = 25;
const PIV = 26;
const G = 9.8;

export async function create(st) {
  let t = 0;
  let lastKey = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h } = st;
    const p = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const Lm = clamp(nn(p.L, 0.8), 0.3, 1.2);
    const th0 = (clamp(nn(p.th0, 20), 5, 30) * Math.PI) / 180;
    const az = clamp(nn(p.az, 40), 10, 70);

    const key = Lm + '|' + th0;
    if (key !== lastKey) { lastKey = key; reset(); }
    if (dt > 0) t += dt;

    const Lw = Lm * 18;
    const om = Math.sqrt(G / Lm);
    const T = (2 * Math.PI) / om;
    const th = th0 * Math.cos(om * t);

    const cam = makeCam(az, 26);
    const pts = [];
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        pts.push([(sx * BASE.w) / 2, BASE.y0, (sz * BASE.d) / 2]);
        pts.push([(sx * BASE.w) / 2, BASE.y1, (sz * BASE.d) / 2]);
      }
    }
    pts.push([-POSTX, POSTTOP + 2, 0]);
    pts.push([POSTX, POSTTOP + 2, 0]);
    const mx = th0 + 0.12;
    for (const a of [-mx, 0, mx]) pts.push([Lw * Math.sin(a), PIV - Lw * Math.cos(a), 0]);
    const { P } = fitCam(cam, w, h, pts, 0.86, 0.82);

    ctx.clearRect(0, 0, w, h);

    halo(ctx, cam, P, 0, 0, BASE.w * 0.62, BASE.y0, 0.16);
    box(ctx, cam, P, 0, 0, BASE.w, BASE.d, BASE.y0, BASE.y1, SKIN.base);
    ring3(ctx, P, 0, 0, 13, BASE.y1 + 0.05, tones(SKIN.base).edge, { alpha: 0.5, width: 1 });

    // 角度刻度弧画在立柱之后（z=-3），让立柱挡在前面
    const rr = Lw;
    const span = th0 + 0.14;
    const arc = [];
    for (let i = 0; i <= 48; i++) {
      const a = -span + (2 * span * i) / 48;
      arc.push([rr * Math.sin(a), PIV - rr * Math.cos(a), -3]);
    }
    poly3(ctx, P, arc, '#9aa6b8', { width: 1, alpha: 0.8 });
    for (let k = -3; k <= 3; k++) {
      const a = k * 0.1;
      const q1 = [(rr - 0.8) * Math.sin(a), PIV - (rr - 0.8) * Math.cos(a), -3];
      const q2 = [(rr + 0.6) * Math.sin(a), PIV - (rr + 0.6) * Math.cos(a), -3];
      poly3(ctx, P, [q1, q2], '#8b97a9', { width: 1, alpha: 0.7 });
    }

    for (const sx of [-POSTX, POSTX]) {
      cyl(ctx, cam, P, sx, 0, POSTR, BASE.y1, POSTTOP, SKIN.steel);
      cyl(ctx, cam, P, sx, 0, 2.6, BASE.y1, BASE.y1 + 1.2, SKIN.steel);
    }
    box(ctx, cam, P, 0, 0, 2 * POSTX + 2, 3.2, POSTTOP - 1.4, POSTTOP + 1.2, SKIN.frame);
    cyl(ctx, cam, P, 0, 0, 1.6, PIV - 0.8, PIV + 0.8, SKIN.steel);

    const bob = [Lw * Math.sin(th), PIV - Lw * Math.cos(th), 0];
    rod(ctx, P, [0, PIV, 0], bob, 0.26, SKIN.iron);
    sphere(ctx, P, bob[0], bob[1], bob[2], 1.7, SKIN.gold);

    const sb = P(bob[0], bob[1], 0);
    const sp = P(0, PIV, 0);
    label(ctx, '摆球', sb[0] + 16, sb[1] + 6, '#3f4a5c', 'left', 13);
    label(ctx, '悬点', sp[0] + 8, sp[1] - 8, '#3f4a5c', 'left', 13);

    st.readout([
      ['摆长 L', fmt(Lm, 2) + ' m'],
      ['初始摆角 θ₀', fmt((th0 * 180) / Math.PI, 0) + '°'],
      ['周期 T', fmt(T, 2) + ' s'],
      ['当前摆角 θ', fmt((th * 180) / Math.PI, 1) + '°'],
      ['角频率 ω', fmt(om, 2) + ' rad/s'],
    ]);
  }

  return { frame, reset };
}
