/* 电3 电势与电势能。
   两档：① 点电荷——围绕电荷画等势面（同心圆），试探点 P 上的电势 V = kQ/r，
        放一个试探电荷 q₀ 上去，电势能 Ep = q₀V；右栏画 V 随 r 的曲线，V·r 不变。
        松手后 q₀ 沿连线运动：同号被推开、异号被吸过去，速度由 Ep 转成 Ek，
        读数栏里 Ep + Ek 一行无论滑到哪儿都不变——这就是「只有电场力做功时机械能守恒」。
        ② 匀强电场——两块平行板之间场强 E 处处相同，从 A 到 B 沿场线走 d，
        电势差 U = Ed，电场力做功 W = q₀U。电荷从静止释放后沿场线加速，
        走出的距离 s 处 U(s) = Es、Ek = W，橙点沿 U = Ed 直线从 0 滑到 d。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const K = 9e9;
const GAP = 0.2; // 两板之间的实际距离（m）
const RMIN = 0.1; // 试探电荷沿连线运动的可视范围（m）
const RMAX = 0.62;
const VMAX = 1.1; // 速度箭头标尺上限（m/s）
const HOLD = 0.9; // 到边界或走到 B 点后停顿再重放（s）
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = n => String(n).split('').map(c => (c === '-' ? '⁻' : SUP[+c])).join('');

function sci(v) {
  if (!Number.isFinite(v) || v === 0) return '0';
  const [mb, ex] = v.toExponential(1).split('e');
  return mb + '×10' + sup(Number(ex));
}

function topOf(v) {
  if (!(v > 0) || !Number.isFinite(v)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return p * (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10);
}

export function create(st) {
  let T = 0;
  let cur = 0; // 电荷当前距离（点电荷档）或已走距离（匀强电场档）
  let v = 0; // 试探电荷沿连线的径向速度（只用于定步长，质量取 1）
  let hold = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'uniform' ? 'uniform' : 'point';
    const Q = clamp(fn(q.Q, 3), -5, 5);
    const r = clamp(fn(q.r, 0.2), 0.1, 0.6);
    const q0 = clamp(fn(q.q0, 2), -5, 5);
    const E0 = clamp(fn(q.E, 2000), 500, 5000);
    const d = clamp(fn(q.d, 0.1), 0.02, GAP);

    const key = [mode, Q, r, q0, E0, d].join('|');
    if (key !== last) {
      last = key;
      T = 0;
      cur = mode === 'point' ? r : 0;
      v = 0;
      hold = 0;
    }

    ctx.clearRect(0, 0, w, h);

    if (mode === 'point') {
      const qx = w * 0.24;
      const qy = h * 0.5;
      const CR = Math.min(w * 0.03, h * 0.06);
      const SW = Math.min(w * 0.2, h * 0.3); // 0.5 m 对应的像素
      const S0 = SW * 0.28; // r = 0.1 m 处离电荷中心的像素
      const posOf = rr => qx + S0 + ((rr - 0.1) / 0.5) * SW;
      const C = K * Q * q0 * 1e-12; // Ep·r = C
      const EpOf = rr => C / rr;
      const Ep0 = EpOf(r);
      const dirSign = C > 0 ? 1 : C < 0 ? -1 : 0;
      const V = (K * Q * 1e-6) / cur;
      const Ep = EpOf(cur);
      const Ek = Ep0 - Ep;

      // 走动：a = F/m = C/r²（单位质量），四步积分，到边界停一拍再从头放开
      if (dt > 0) {
        if (hold > 0) {
          hold -= dt;
          if (hold <= 0) {
            cur = r;
            v = 0;
            hold = 0;
            T = 0;
          }
        } else if (dirSign !== 0) {
          T += dt;
          const hh = dt / 4;
          for (let i = 0; i < 4; i++) {
            v += (C / (cur * cur)) * hh;
            cur += v * hh;
            if (cur >= RMAX || cur <= RMIN) {
              cur = clamp(cur, RMIN, RMAX);
              v = 0;
              hold = HOLD;
              break;
            }
          }
        } else {
          T += dt;
        }
      }
      const vNow = Math.min(Math.abs(v), VMAX);

      // 场线（细射线）与等势面（同心虚线圆）
      const NL = 10;
      const rOut = posOf(0.46) - qx + 16; // 场线与最外一圈等势面等长
      for (let i = 0; i < NL; i++) {
        const a = (i / NL) * Math.PI * 2 + 0.31;
        ctx.save();
        ctx.strokeStyle = pal.mut;
        ctx.globalAlpha = 0.3;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(qx + Math.cos(a) * CR, qy + Math.sin(a) * CR);
        ctx.lineTo(qx + Math.cos(a) * rOut, qy + Math.sin(a) * rOut);
        ctx.stroke();
        ctx.restore();
      }
      ctx.save();
      ctx.strokeStyle = pal.cyan;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      for (const rr of [0.1, 0.16, 0.24, 0.34, 0.46]) {
        const rad = posOf(rr) - qx;
        ctx.beginPath();
        ctx.arc(qx, qy, rad, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      // 电荷
      ctx.beginPath();
      ctx.arc(qx, qy, CR, 0, Math.PI * 2);
      ctx.fillStyle = Q >= 0 ? pal.orange : pal.blue;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      label(ctx, Q >= 0 ? '+' : '−', qx, qy, pal.ink, 'center', Math.round(CR * 1.1));
      label(ctx, `Q = ${fmt(Q, 1)} μC`, qx, qy - CR - 16, pal.ink, 'center', 15);
      label(ctx, '虚线圆：等势面', w * 0.05, h * 0.13, pal.cyan, 'left', 14);

      // 试探点 P 钉在释放距离上，试探电荷沿连线运动
      const px = posOf(r);
      const cxNow = posOf(cur);
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.arc(px, qy, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'P', px, qy - 15, pal.purple, 'center', 14);
      label(ctx, `r = ${fmt(r * 100, 0)} cm`, (qx + px) / 2, qy + 18, pal.mut, 'center', 14);

      // 运动方向的速度箭头
      if (Math.abs(q0) > 1e-9 && vNow > 0.01) {
        const Lv = clamp(vNow * 46, 10, 52);
        const s = dirSign;
        arrow(ctx, cxNow + s * 11, qy, cxNow + s * (11 + Lv), qy, pal.green, 2.2);
        label(ctx, 'v', cxNow + s * (16 + Lv), qy - 12, pal.green, s > 0 ? 'left' : 'right', 14);
      }
      // 电荷本体：q₀ = 0 时画成灰圈，停在原处不受力
      const cInk = q0 > 1e-9 ? pal.orange : q0 < -1e-9 ? pal.blue : pal.mut;
      ctx.beginPath();
      ctx.arc(cxNow, qy, 9, 0, Math.PI * 2);
      ctx.fillStyle = cInk;
      ctx.globalAlpha = 0.75;
      ctx.fill();
      ctx.globalAlpha = 1;
      label(ctx, q0 > 1e-9 ? '+' : q0 < -1e-9 ? '−' : '0', cxNow, qy, pal.ink, 'center', 13);
      label(
        ctx,
        C === 0
          ? '试探电荷不受力，停在原处'
          : C > 0
            ? '同号相斥：电势能转成动能，越走越快'
            : '异号相吸：电势能转成动能，越走越快',
        w * 0.05,
        h * 0.13 + 22,
        pal.faint,
        'left',
        13,
      );

      /* ── 右栏：V 随 r 的曲线 ───────────────────────── */
      const rc = { x: w * 0.56, y: h * 0.16, w: w * 0.4, h: h * 0.64 };
      const vmax = (K * Q * 1e-6) / 0.1;
      const hi = vmax > 0 ? topOf(vmax) : 0;
      const lo = vmax > 0 ? 0 : -topOf(-vmax);
      const g = panel(ctx, rc, [0.1, 0.6], [lo, hi], pal, { xlab: 'r/m', ylab: 'V', nx: 5, ny: 4 });
      const CV = K * Q * 1e-6;
      const pts = [];
      const rr0 = Math.max(0.1, CV !== 0 ? Math.abs(CV / (vmax > 0 ? hi : lo)) : 0.1);
      for (let rr = rr0; rr <= 0.6001; rr += 0.002) pts.push([rr, CV / rr]);
      poly(ctx, g.X, g.Y, pts, pal.cyan, 2.2);
      if (Q !== 0 && cur >= 0.1 && cur <= 0.6) {
        spot(ctx, g.X(cur), g.Y((K * Q * 1e-6) / cur), 5, pal.orange, pal.bg2);
      }
      label(ctx, 'V = kQ/r', rc.x + 8, rc.y + 15, pal.cyan, 'left', 14);
      poly(ctx, g.X, g.Y, [[0.1, 0], [0.6, 0]], pal.faint, 1, [4, 4]);

      st.readout([
        ['场源电荷 Q', fmt(Q, 1) + ' μC'],
        ['释放距离 r₀', fmt(r * 100, 1) + ' cm'],
        ['当前距离 r', fmt(cur * 100, 1) + ' cm'],
        ['电势 V = kQ/r', sci(V) + ' V'],
        ['试探电荷 q₀', fmt(q0, 1) + ' μC'],
        ['电势能 Ep', sci(Ep) + ' J'],
        ['动能 Ek', sci(Ek) + ' J'],
        ['Ep + Ek', sci(Ep + Ek) + ' J'],
        ['V·r', sci(V * cur) + ' V·m'],
      ]);
      return;
    }

    /* ── 匀强电场：两块平行板之间的电势差 ─────────────── */
    const xL = w * 0.1;
    const xR = w * 0.46;
    const yT = h * 0.18;
    const yB = h * 0.8;
    const U = E0 * d;
    const bx = xL + (d / GAP) * (xR - xL);
    const cy = (yT + yB) / 2;
    const span = bx - xL; // A 到 B 的像素距离
    const pxPerM = span / d; // 每米多少像素
    const startX = q0 >= 0 ? xL : bx;
    const dirSign = q0 > 0 ? 1 : q0 < 0 ? -1 : 0;
    if (dt > 0) T += dt; // 电荷从静止加速走完 A→B，循环重放
    const PER = 3.0; // 一个循环的时长
    const RUN = 2.2; // 加速走完 A→B 的时长
    const tc = T % PER;
    const u = Math.min(1, tc / RUN);
    const s = d * u * u; // 从静止加速：s = ½at²
    const sx = startX + dirSign * s * pxPerM;
    const Us = E0 * s;
    const Wk = q0 * 1e-6 * Us;

    // 极板
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(xL - 5, yT, 5, yB - yT);
    ctx.fillStyle = pal.blue;
    ctx.fillRect(xR, yT, 5, yB - yT);
    ctx.globalAlpha = 1;
    ctx.restore();
    label(ctx, '+', xL - 14, yT - 12, pal.orange, 'center', 20);
    label(ctx, '−', xR + 8, yT - 12, pal.blue, 'center', 20);

    // 场线：等间距的水平箭头
    for (let i = 0; i < 7; i++) {
      const yy = yT + 14 + ((yB - yT - 28) * i) / 6;
      arrow(ctx, xL + 2, yy, xR - 2, yy, pal.mut, 1.3);
    }
    label(ctx, `E = ${fmt(E0, 0)} V/m`, (xL + xR) / 2, yT - 16, pal.mut, 'center', 14);

    // A、B 两点与在两点之间加速的试探电荷
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(xL, cy);
    ctx.lineTo(bx, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
    label(ctx, 'A', xL + 12, cy + 18, pal.ink, 'center', 15);
    label(ctx, 'B', bx, cy + 18, pal.ink, 'center', 15);
    if (dirSign !== 0) {
      const cInk = q0 > 0 ? pal.orange : pal.blue;
      ctx.beginPath();
      ctx.arc(sx, cy, 9, 0, Math.PI * 2);
      ctx.fillStyle = cInk;
      ctx.globalAlpha = 0.75;
      ctx.fill();
      ctx.globalAlpha = 1;
      label(ctx, q0 > 0 ? '+' : '−', sx, cy, pal.ink, 'center', 13);
    } else {
      ctx.save();
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(xL, cy, 9, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    label(ctx, `q₀ = ${fmt(q0, 1)} μC`, dirSign !== 0 ? sx : xL, cy - 22, pal.ink, 'center', 14);
    label(ctx, `d = ${fmt(d * 100, 0)} cm`, (xL + bx) / 2, cy + 40, pal.mut, 'center', 14);
    if (dirSign !== 0 && u > 0.02) {
      const Lv = clamp(u * 40, 8, 40);
      arrow(ctx, sx + dirSign * 12, cy + 22, sx + dirSign * (12 + Lv), cy + 22, pal.green, 2.2);
      label(ctx, 'v', sx + dirSign * (18 + Lv), cy + 34, pal.green, dirSign > 0 ? 'left' : 'right', 14);
    }

    /* ── 右栏：U 随 d 的直线 ─────────────────────────── */
    const rc = { x: w * 0.56, y: h * 0.16, w: w * 0.4, h: h * 0.64 };
    const g = panel(ctx, rc, [0, GAP], [0, topOf(E0 * GAP)], pal, { xlab: 'd/m', ylab: 'U', nx: 5, ny: 4 });
    poly(ctx, g.X, g.Y, [[0, 0], [GAP, E0 * GAP]], pal.cyan, 2.2);
    spot(ctx, g.X(d), g.Y(U), 5, pal.orange, pal.bg2);
    if (dirSign !== 0 && s > 1e-6) spot(ctx, g.X(s), g.Y(Us), 3.6, pal.green, pal.bg2);
    label(ctx, 'U = Ed', rc.x + 8, rc.y + 15, pal.cyan, 'left', 14);
    label(ctx, '橙点走到 B，绿点随电荷滑动', rc.x + 8, rc.y + 36, pal.faint, 'left', 13);

    st.readout([
      ['场强 E', fmt(E0, 0) + ' V/m'],
      ['沿场线距离 d', fmt(d * 100, 1) + ' cm'],
      ['电荷已走 s', fmt(s * 100, 1) + ' cm'],
      ['电势差 U = Ed', fmt(U, 0) + ' V'],
      ['当前电势差 U(s)', fmt(Us, 0) + ' V'],
      ['试探电荷 q₀', fmt(q0, 1) + ' μC'],
      ['做功 W = q₀U(s)', sci(Wk) + ' J'],
      ['U/d', fmt(U / d, 0) + ' V/m'],
    ]);
  }

  return { frame };
}
