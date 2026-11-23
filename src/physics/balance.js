/* 托盘天平：浅色等轴测的机械仪表。底座、立柱、横梁、两只吊盘与一杆指针，
   两侧砝码按质量大小画成方块。横梁按左右质量差平滑倾斜，指针在平衡标尺上指出偏转。
   视角由「视角」滑块缓慢转动（逐帧重算等轴测投影）。 */

import { label, fmt, clamp } from './gfx.js';
import { makeCam, fitCam, box, cyl, sphere, disc, ring3, rod, halo, poly3, SKIN, tones } from './isofig.js';

const BL = 13;        // 横梁半长
const PIV = 17;       // 支点高度
const HANG = 9;       // 吊杆长
const PAN_R = 5.2;
const BASE = { w: 40, d: 26, y0: -4, y1: 0 };
const MAXT = 0.26;

export async function create(st) {
  let th = 0;
  const reset = () => { th = 0; };
  reset();

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h } = st;
    const p = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const m1 = clamp(nn(p.m1, 100), 0, 200);
    const m2 = clamp(nn(p.m2, 100), 0, 200);
    const az = clamp(nn(p.az, 38), 10, 70);
    const cam = makeCam(az, 26);

    // 右重则右下（负角），左重则左下（正角）
    const target = -clamp((m2 - m1) * 0.0026, -MAXT, MAXT);
    if (dt > 0) th += (target - th) * Math.min(1, dt * 5);

    // 取景点固定，缩放不随摆幅呼吸
    const pts = [];
    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        pts.push([(sx * BASE.w) / 2, BASE.y0, (sz * BASE.d) / 2]);
        pts.push([(sx * BASE.w) / 2, BASE.y1, (sz * BASE.d) / 2]);
      }
    }
    for (const t of [-MAXT, 0, MAXT]) {
      const c = Math.cos(t);
      const s = Math.sin(t);
      pts.push([BL * c, PIV + BL * s, 0]);
      pts.push([-BL * c, PIV - BL * s, 0]);
      pts.push([BL * c, PIV + BL * s - HANG, 0]);
      pts.push([-BL * c, PIV - BL * s - HANG, 0]);
    }
    pts.push([0, PIV + 2, 0]);
    const { P } = fitCam(cam, w, h, pts, 0.86, 0.82);

    ctx.clearRect(0, 0, w, h);

    halo(ctx, cam, P, 0, 0, BASE.w * 0.62, BASE.y0, 0.16);
    box(ctx, cam, P, 0, 0, BASE.w, BASE.d, BASE.y0, BASE.y1, SKIN.base);
    ring3(ctx, P, 0, 0, 15, BASE.y1 + 0.05, tones(SKIN.base).edge, { alpha: 0.5, width: 1 });
    ring3(ctx, P, 0, 0, 11, BASE.y1 + 0.05, tones(SKIN.base).edge, { alpha: 0.32, width: 1 });

    cyl(ctx, cam, P, 0, 0, 3.2, BASE.y1, BASE.y1 + 1.4, SKIN.steel);
    cyl(ctx, cam, P, 0, 0, 1.9, BASE.y1 + 1.2, PIV - 1.2, SKIN.steel);

    const c = Math.cos(th);
    const s = Math.sin(th);
    const R = [BL * c, PIV + BL * s, 0];
    const Lp = [-BL * c, PIV - BL * s, 0];
    const panR = [R[0], R[1] - HANG, 0];
    const panL = [Lp[0], Lp[1] - HANG, 0];

    rod(ctx, P, R, panR, 0.35, SKIN.steel);
    rod(ctx, P, Lp, panL, 0.35, SKIN.steel);

    for (const [pan, base, m] of [[panR, SKIN.weightR, m2], [panL, SKIN.weightL, m1]]) {
      disc(ctx, cam, P, pan[0], pan[2], PAN_R, pan[1], SKIN.pan);
      ring3(ctx, P, pan[0], pan[2], PAN_R, pan[1] + 0.05, tones(SKIN.pan).edge, { alpha: 0.8, width: 1 });
      if (m > 0) {
        const sz = 1.4 + (m / 200) * 4.2;
        box(ctx, cam, P, pan[0], pan[2], sz, sz, pan[1], pan[1] + sz, base);
      }
    }

    rod(ctx, P, Lp, R, 1.15, SKIN.steel);
    cyl(ctx, cam, P, 0, 0, 2.4, PIV - 0.8, PIV + 0.9, SKIN.steel);

    const plen = 7.5;
    const tip = [plen * s, PIV - plen * c, 0];
    rod(ctx, P, [0, PIV, 0], tip, 0.5, SKIN.accent);
    sphere(ctx, P, tip[0], tip[1], tip[2], 0.7, SKIN.accent);

    // 平衡标尺：一段圆弧 + 刻度
    const sr = plen + 1.6;
    const arc = [];
    for (let i = 0; i <= 24; i++) {
      const a = -0.32 + (0.64 * i) / 24;
      arc.push([sr * Math.sin(a), PIV - sr * Math.cos(a), 0]);
    }
    poly3(ctx, P, arc, '#9aa6b8', { width: 1, alpha: 0.9 });
    for (let k = -4; k <= 4; k++) {
      const a = k * 0.08;
      const q1 = [(sr - 0.9) * Math.sin(a), PIV - (sr - 0.9) * Math.cos(a), 0];
      const q2 = [(sr + 0.2) * Math.sin(a), PIV - (sr + 0.2) * Math.cos(a), 0];
      poly3(ctx, P, [q1, q2], '#8b97a9', { width: 1, alpha: 0.8 });
    }

    const sL = P(panL[0], panL[1], 0);
    const sR = P(panR[0], panR[1], 0);
    label(ctx, '左盘', sL[0], sL[1] + PAN_R * P.S + 14, '#3f4a5c', 'center', 13);
    label(ctx, '右盘', sR[0], sR[1] + PAN_R * P.S + 14, '#3f4a5c', 'center', 13);
    const sc = P(0, PIV - sr - 0.5, 0);
    label(ctx, '平衡标尺', sc[0], sc[1] - 12, '#6b7688', 'center', 12.5);

    const diff = Math.abs(m1 - m2);
    const state = diff < 0.5 ? '平衡' : m1 > m2 ? '左盘重' : '右盘重';
    st.readout([
      ['左盘质量', fmt(m1, 0) + ' g'],
      ['右盘质量', fmt(m2, 0) + ' g'],
      ['质量差 |Δm|', fmt(diff, 0) + ' g'],
      ['状态', state],
      ['横梁倾角', fmt((th * 180) / Math.PI, 1) + '°'],
    ]);
  }

  return { frame, reset };
}
