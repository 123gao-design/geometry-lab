/* 电1 电荷与库仑定律。
   两个点电荷并排摆在一条水平线上，同号相斥、异号相吸。
   滑块给的是释放时的间距 r₀：松手后两电荷沿连线受库仑力运动，同号相互远离、
   异号相互靠近，距离一变，力与加速度跟着变，右栏橙点沿 F–r 曲线滑动。
   演示里两个电荷各取 MASS = 20 kg，质量取得大，运动才放慢到看得清；加速度在力发散时截一截。
   单位：电荷取 μC、距离取 m，k 取 9×10⁹，读数栏的 F·r² 无论滑到哪都不变。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const K = 9e9; // 静电力常量
const QMIN = -5; // 电荷量范围（μC）
const QMAX = 5;
const RMIN = 0.05; // 距离范围（m）
const RMAX = 0.5;
const MASS = 20; // 每个电荷的质量（kg）：取得大一些，运动放慢到看得清
const ACC_MAX = 6; // 单个电荷的加速度上限（m/s²），只在参数取到极端时起作用
const HOLD = 0.9; // 到达边界后停顿再重放（s）

/** 纵轴上限取 1 / 2 / 5 × 10ⁿ 里刚好盖住数据的那个 */
function topOf(v) {
  if (!(v > 0) || !Number.isFinite(v)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return p * (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10);
}

export function create(st) {
  let T = 0; // 释放后经过的时间
  let r = 0; // 当前间距
  let vr = 0; // 间距的变化率
  let hold = 0; // 到边界后的停顿
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const q1 = clamp(fn(q.q1, 3), QMIN, QMAX);
    const q2 = clamp(fn(q.q2, -2), QMIN, QMAX);
    const r0 = clamp(fn(q.r, 0.2), RMIN, RMAX);

    // 参数一动就从释放位置重新开始
    const key = [q1, q2, r0].join('|');
    if (key !== last) {
      last = key;
      T = 0;
      r = r0;
      vr = 0;
      hold = 0;
    }

    if (dt > 0) {
      if (hold > 0) {
        hold -= dt;
        if (hold <= 0) {
          r = r0;
          vr = 0;
          T = 0;
        }
      } else {
        T += dt;
        const N = 8;
        const hh = dt / N;
        for (let i = 0; i < N; i++) {
          const F = (K * Math.abs(q1 * q2) * 1e-12) / (r * r);
          const sgn = q1 * q2 > 0 ? 1 : -1; // 相斥时间距增大
          const aEach = Math.min(ACC_MAX, F / MASS); // 每个电荷各自的加速度
          const acc = sgn * 2 * aEach; // 两者同时动，间距的变化率是它的两倍
          vr += acc * hh;
          r += vr * hh;
          if (r >= RMAX) {
            r = RMAX;
            vr = 0;
            hold = HOLD;
            break;
          }
          if (r <= RMIN) {
            r = RMIN;
            vr = 0;
            hold = HOLD;
            break;
          }
        }
      }
    }

    const C = K * Math.abs(q1 * q2) * 1e-12; // 力 F = C/r²
    const F = C / (r * r);
    const rep = q1 * q2 > 0; // 同号相斥
    const moving = Math.abs(vr) > 0.004;

    ctx.clearRect(0, 0, w, h);

    /* ── 左栏：两个点电荷与沿连线的力 ───────────────────── */
    const cx = w * 0.25;
    const cy = h * 0.45;
    const R = Math.min(w * 0.035, h * 0.07);
    const half = w * 0.045 + ((r - RMIN) / (RMAX - RMIN)) * w * 0.16;
    const x1 = cx - half;
    const x2 = cx + half;

    // 两支力箭头：同号朝外、异号朝里，长度按力的大小取
    if (F > 1e-9) {
      const L = clamp(16 + 54 * Math.sqrt(F / 90), 16, 72);
      const gap = Math.max(10, x2 - x1 - 2 * R);
      if (rep) {
        const Ll = Math.min(L, x1 - R - 8);
        const Lr = Math.min(L, w * 0.52 - (x2 + R));
        if (Ll > 6) arrow(ctx, x1 - R - 2, cy, x1 - R - 2 - Ll, cy, pal.purple, 2.6);
        if (Lr > 6) arrow(ctx, x2 + R + 2, cy, x2 + R + 2 + Lr, cy, pal.purple, 2.6);
        label(ctx, 'F', x1 - R - 12, cy - 16, pal.purple, 'right', 15);
        label(ctx, 'F', x2 + R + 12, cy - 16, pal.purple, 'left', 15);
      } else {
        const La = Math.min(L, gap * 0.45);
        arrow(ctx, x1 + R + 2, cy, x1 + R + 2 + La, cy, pal.purple, 2.6);
        arrow(ctx, x2 - R - 2, cy, x2 - R - 2 - La, cy, pal.purple, 2.6);
        label(ctx, 'F', (x1 + x2) / 2, cy - 16, pal.purple, 'center', 15);
      }
    }

    // 速度箭头：绿，朝各自的运动方向，长度随速率变
    if (moving) {
      const Lv = clamp(Math.abs(vr) * 90, 8, 46);
      const outward = vr > 0;
      if (outward) {
        arrow(ctx, x1 - R - 4, cy + 20, x1 - R - 4 - Lv, cy + 20, pal.green, 2.2);
        arrow(ctx, x2 + R + 4, cy + 20, x2 + R + 4 + Lv, cy + 20, pal.green, 2.2);
      } else {
        arrow(ctx, x1 + R + 4, cy + 20, x1 + R + 4 + Lv, cy + 20, pal.green, 2.2);
        arrow(ctx, x2 - R - 4, cy + 20, x2 - R - 4 - Lv, cy + 20, pal.green, 2.2);
      }
      label(ctx, 'v', (x1 + x2) / 2, cy + 46, pal.green, 'center', 14);
    }

    // 两个电荷
    const charge = (x, v) => {
      ctx.beginPath();
      ctx.arc(x, cy, R, 0, Math.PI * 2);
      ctx.fillStyle = v >= 0 ? pal.orange : pal.blue;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = v >= 0 ? pal.orange : pal.blue;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, cy, R, 0, Math.PI * 2);
      ctx.stroke();
      label(ctx, v >= 0 ? '+' : '−', x, cy, pal.ink, 'center', 24);
      label(ctx, `${fmt(v, 1)} μC`, x, cy - R - 18, pal.ink, 'center', 15);
    };
    charge(x1, q1);
    charge(x2, q2);

    // 间距：从连线中点往两头各画一支箭头
    const my = cy + R + 26;
    arrow(ctx, (x1 + x2) / 2, my, x1 + R, my, pal.mut, 1.6);
    arrow(ctx, (x1 + x2) / 2, my, x2 - R, my, pal.mut, 1.6);
    label(ctx, `r = ${fmt(r * 100, 1)} cm`, (x1 + x2) / 2, my + 18, pal.mut, 'center', 14);

    label(
      ctx,
      rep ? '同号相斥：力沿连线向外' : q1 * q2 === 0 ? '有一个电荷不带电，没有库仑力' : '异号相吸：力沿连线向内',
      w * 0.05,
      h * 0.14,
      pal.mut,
      'left',
      14,
    );
    label(
      ctx,
      q1 * q2 === 0
        ? '松手后两个电荷都不动'
        : rep
          ? '从静止释放：两电荷相互推开，越远力越小'
          : '从静止释放：两电荷相互靠近，越近力越大',
      w * 0.05,
      h * 0.14 + 22,
      pal.faint,
      'left',
      13,
    );

    /* ── 右栏：F 随 r 的平方反比曲线 ──────────────────── */
    const rc = { x: w * 0.56, y: h * 0.16, w: w * 0.4, h: h * 0.64 };
    const yTop = topOf(C / (RMIN * RMIN));
    const g = panel(ctx, rc, [0, RMAX], [0, yTop], pal, { xlab: 'r/m', ylab: 'F/N', nx: 5, ny: 4 });

    const pts = [];
    const r0c = Math.max(RMIN, Math.sqrt(C / yTop));
    for (let rr = r0c; rr <= RMAX + 1e-9; rr += 0.002) pts.push([rr, C / (rr * rr)]);
    poly(ctx, g.X, g.Y, pts, pal.purple, 2.2);
    if (F > 1e-9) spot(ctx, g.X(r), g.Y(F), 5, pal.orange, pal.bg2);
    label(ctx, 'F = k|q₁q₂|/r²', rc.x + 8, rc.y + 15, pal.purple, 'left', 14);
    label(ctx, '橙点随两电荷的实际间距滑动', rc.x + 8, rc.y + 36, pal.faint, 'left', 13);

    st.readout([
      ['电荷量 q₁', fmt(q1, 1) + ' μC'],
      ['电荷量 q₂', fmt(q2, 1) + ' μC'],
      ['当前间距 r', fmt(r * 100, 1) + ' cm'],
      ['库仑力 F', fmt(F, 2) + ' N'],
      ['方向', q1 * q2 === 0 ? '无' : rep ? '同号相斥' : '异号相吸'],
      ['间距变化率 v', fmt(vr, 2) + ' m/s'],
      ['加速度 a = F/m', fmt(Math.min(ACC_MAX, F / MASS), 2) + ' m/s²'],
      ['F·r²', fmt(F * r * r, 3) + ' N·m²'],
      ['k', '9.0×10⁹ N·m²/C²'],
    ]);
  }

  return { frame };
}
