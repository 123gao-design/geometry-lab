/* 电4 电容器与带电粒子的偏转。
   ① 电容器——两块平行金属板加上电压 U。正对面积 S、板间距 d、相对介电常数 εr，
      电容 C = εr·ε0·S/d，电荷量 Q = CU，板间场强 E = U/d。
      合上电源后极板逐颗积累电荷，q(t) = CU(1 − e^{−t/τ})，板上的正负号与板间场线随之一颗颗亮起，
      充满后停一拍再放电归零，循环往复。
      右栏画 C 随 d 的反比曲线，读数栏最后一行 C·d 拖间距时不变。
   ② 带电粒子的偏转——电子以 v0 水平射入两板之间，偏转电压 U、板长 L、
      板间距 d（固定 2 cm），a = qU/(md)，t = L/v0，y = ½at² = qUL²/(2mdv0²)，
      出射偏转角 tanθ = at/v0。读数栏每一步各占一行，可以从 a、t 一路核对到 y。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const EPS0 = 8.854e-12; // 真空介电常数 F/m
const QE = 1.6e-19;     // 电子电荷量 C
const ME = 9.11e-31;    // 电子质量 kg
const DD = 0.02;        // 偏转档的板间距，固定 2 cm

const TAU = 0.8;        // 充电时间常数（可视用，s）
const PH_CH = 3.2;      // 充电段时长
const PH_HOLD = 1.0;    // 充满后停留
const PH_DIS = 1.6;     // 放电段时长
const CYCLE = PH_CH + PH_HOLD + PH_DIS;

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = n => String(n).split('').map(c => (c === '-' ? '⁻' : SUP[+c])).join('');

function sci(v, dig = 2) {
  if (!Number.isFinite(v) || v === 0) return '0';
  const [mb, ex] = v.toExponential(dig - 1).split('e');
  return mb + '×10' + sup(Number(ex));
}

/* 纵轴上限取 1 / 2 / 5 × 10^n */
function topOf(v) {
  if (!(v > 0) || !Number.isFinite(v)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return p * (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10);
}

const idX = v => v;
const idY = v => v;

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params || {};
    const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);

    const mode = q.mode === 'deflect' ? 'deflect' : 'cap';
    const Uc = clamp(num(q.Uc, 200), 20, 400);
    const dmm = clamp(num(q.d, 5), 1, 10);
    const er = clamp(num(q.er, 2), 1, 5);
    const S = clamp(num(q.S, 200), 100, 400);
    const Ud = clamp(num(q.Ud, 200), 50, 400);
    const Lcm = clamp(num(q.L, 5), 2, 8);
    const v0u = clamp(num(q.v0, 3), 1, 5);

    const key = [mode, Uc, dmm, er, S, Ud, Lcm, v0u].join('|');
    if (key !== last) {
      last = key;
      T = 0;
    }
    if (dt > 0) T += dt;

    ctx.clearRect(0, 0, w, h);

    /* ── 电容器：平行板，电压、间距、面积、介质都能拖 ─────── */
    if (mode === 'cap') {
      const S2 = S * 1e-4;          // m²
      const dm = dmm * 1e-3;        // m
      const C = (EPS0 * er * S2) / dm;
      const Q = C * Uc;
      const Emag = Uc / dm;
      const Cpf = C * 1e12;

      // 充电、满、放电三段循环
      const tc = T % CYCLE;
      let frac;
      if (tc < PH_CH) frac = 1 - Math.exp(-tc / TAU);
      else if (tc < PH_CH + PH_HOLD) frac = 1;
      else frac = Math.exp(-(tc - PH_CH - PH_HOLD) / 0.5);
      const qt = Q * frac;

      const xL = w * 0.14;
      const gap = w * 0.1 + ((dmm - 1) / 9) * w * 0.14;
      const xR = xL + gap;
      const yT = h * 0.2;
      const ph = h * 0.52;

      // 两块极板
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.fillStyle = pal.orange;
      ctx.fillRect(xL - 7, yT, 7, ph);
      ctx.fillStyle = pal.blue;
      ctx.fillRect(xR, yT, 7, ph);
      ctx.globalAlpha = 1;
      ctx.restore();

      // 板上的电荷与板间的场线：随充电进度逐颗亮起
      const NL = 7;
      const lit = Math.max(0, Math.min(NL, Math.round(frac * NL)));
      for (let i = 0; i < NL; i++) {
        const yy = yT + 14 + ((ph - 28) * i) / (NL - 1);
        const on = i < lit;
        ctx.save();
        ctx.globalAlpha = on ? 0.55 + 0.45 * frac : 0.16;
        label(ctx, '+', xL - 16, yy, pal.orange, 'center', 15);
        label(ctx, '−', xR + 16, yy, pal.blue, 'center', 15);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = 0.12 + 0.72 * frac;
        arrow(ctx, xL + 3, yy, xR - 3, yy, pal.mut, 1.2);
        ctx.restore();
      }
      label(ctx, 'U = ' + fmt(Uc, 0) + ' V', (xL + xR) / 2, yT - 20, pal.ink, 'center', 15);

      // 充电进度条
      const ybar = yT - 44;
      ctx.save();
      ctx.fillStyle = pal.faint;
      ctx.globalAlpha = 0.3;
      ctx.fillRect(xL, ybar, gap, 5);
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = pal.orange;
      ctx.fillRect(xL, ybar, gap * frac, 5);
      ctx.globalAlpha = 1;
      ctx.restore();
      label(ctx, `q / Q = ${fmt(frac * 100, 0)}%`, xL - 12, ybar + 3, pal.mut, 'right', 13);

      // 间距 d
      const yd = yT + ph + 22;
      ctx.save();
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(xL, yd);
      ctx.lineTo(xR, yd);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      arrow(ctx, (xL + xR) / 2, yd, xL, yd, pal.mut, 1.2);
      arrow(ctx, (xL + xR) / 2, yd, xR, yd, pal.mut, 1.2);
      label(ctx, 'd = ' + fmt(dmm, 1) + ' mm', (xL + xR) / 2, yd + 17, pal.mut, 'center', 14);
      label(ctx, '板上正负号随充电一颗颗亮起', (xL + xR) / 2, yd + 39, pal.faint, 'center', 13);

      /* ── 右栏：C 随 d 的反比曲线 ─────────────────────── */
      const rc = { x: w * 0.56, y: h * 0.16, w: w * 0.4, h: h * 0.62 };
      const cOf = dd => (0.8854 * er * S) / dd; // pF
      const cTop = topOf(cOf(1));
      const g = panel(ctx, rc, [1, 10], [0, cTop], pal, { xlab: 'd/mm', ylab: 'C/pF', nx: 5, ny: 4 });

      const pts = [];
      for (let dd = 1; dd <= 10.0001; dd += 0.05) pts.push([dd, cOf(dd)]);
      poly(ctx, g.X, g.Y, pts, pal.cyan, 2.2);
      spot(ctx, g.X(dmm), g.Y(Cpf), 5, pal.orange, pal.bg2);
      label(ctx, 'C = εr ε0 S / d', rc.x + 8, rc.y + 15, pal.cyan, 'left', 14);

      st.readout([
        ['电压 U', fmt(Uc, 0) + ' V'],
        ['板间距 d', fmt(dmm, 1) + ' mm'],
        ['相对介电常数 εr', fmt(er, 1)],
        ['正对面积 S', fmt(S, 0) + ' cm²'],
        ['电容 C = εr ε0 S / d', fmt(Cpf, 1) + ' pF'],
        ['充满后 Q = CU', fmt(Q * 1e9, 1) + ' nC'],
        ['当前电荷 q(t)', fmt(qt * 1e9, 1) + ' nC'],
        ['q / Q', fmt(frac * 100, 0) + ' %'],
        ['场强 E = U / d', sci(Emag) + ' V/m'],
        ['C·d', fmt(Cpf * dmm, 1) + ' pF·mm'],
      ]);
      return;
    }

    /* ── 带电粒子的偏转：类平抛 ─────────────────────── */
    const Lm = Lcm / 100;
    const v0 = v0u * 1e7;
    const acc = (QE * Ud) / (ME * DD);
    const tin = Lm / v0;
    const ye = 0.5 * acc * tin * tin;                  // m
    const tanOut = (acc * tin) / v0;
    const inv = (ye * DD * v0 * v0) / (Ud * Lm * Lm);  // = q / (2m)
    const hit = ye > DD / 2;
    const xhit = hit ? v0 * Math.sqrt(DD / acc) : Lm;
    const yhit = 0.5 * acc * xhit * xhit;

    const xL = w * 0.1;
    const Lpx = w * 0.22 + ((Lcm - 2) / 6) * w * 0.18;
    const xR = xL + Lpx;
    const dpx = h * 0.16;
    const yU = h * 0.3;
    const yL = yU + dpx;
    const mid = (yU + yL) / 2;
    const pyPerM = dpx / DD;
    const yOfX = xw => (0.5 * acc * xw * xw) / (v0 * v0);

    // 两块极板
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = pal.orange;
    ctx.fillRect(xL, yU - 6, Lpx, 6);
    ctx.fillStyle = pal.blue;
    ctx.fillRect(xL, yL, Lpx, 6);
    ctx.globalAlpha = 1;
    ctx.restore();
    label(ctx, '+', xL - 16, yU - 12, pal.orange, 'center', 17);
    label(ctx, '−', xL - 16, yL + 14, pal.blue, 'center', 17);

    // 板间场线：竖直向下
    for (let i = 0; i < 7; i++) {
      const xx = xL + 12 + ((Lpx - 24) * i) / 6;
      arrow(ctx, xx, yU + 4, xx, yL - 4, pal.mut, 1.1);
    }

    // 入射方向
    arrow(ctx, xL - w * 0.085, mid, xL - 4, mid, pal.green, 1.6);
    label(ctx, 'v0', xL - w * 0.085, mid - 15, pal.green, 'left', 14);

    // 轨迹
    const pts = [];
    for (let i = 0; i <= 60; i++) {
      const xw = (xhit * i) / 60;
      pts.push([xL + (xw / Lm) * Lpx, mid - yOfX(xw) * pyPerM]);
    }
    poly(ctx, idX, idY, pts, pal.cyan, 2.2);
    if (!hit) {
      const x1 = xhit;
      const x2 = Lm + 0.032;
      poly(ctx, idX, idY, [
        [xL + (x1 / Lm) * Lpx, mid - yOfX(x1) * pyPerM],
        [xL + (x2 / Lm) * Lpx, mid - (ye + tanOut * (x2 - Lm)) * pyPerM],
      ], pal.cyan, 2.2, [5, 4]);
    }

    // 粒子：把一次穿越按时长压成 1.4 s，穿出后沿直线再走 0.9 s
    const TT = T % 3;
    let pxW;
    let pyW;
    if (TT < 1.4 || hit) {
      const s = Math.min(TT / 1.4, 1);
      pxW = (hit ? xhit : Lm) * s;
      pyW = yOfX(pxW);
    } else {
      const u = Math.min((TT - 1.4) / 0.9, 1);
      pxW = Lm + u * 0.035;
      pyW = ye + tanOut * (pxW - Lm);
    }
    const pxs = xL + (pxW / Lm) * Lpx;
    const pys = mid - pyW * pyPerM;
    ctx.beginPath();
    ctx.arc(pxs, pys, 7, 0, Math.PI * 2);
    ctx.fillStyle = pal.purple;
    ctx.fill();

    if (hit) {
      label(ctx, '电子打到板上', pxs + 12, pys - 14, pal.pink, 'left', 14);
    } else {
      label(ctx, 'y = ' + fmt(ye * 1000, 2) + ' mm', xL + Lpx + 10, mid - yOfX(Lm) * pyPerM, pal.cyan, 'left', 14);
    }
    label(ctx, 'L = ' + fmt(Lcm, 1) + ' cm', (xL + xR) / 2, yL + 40, pal.mut, 'center', 14);

    /* ── 右栏：偏转量随板长的平方关系 ─────────────────── */
    const rc = { x: w * 0.56, y: h * 0.16, w: w * 0.4, h: h * 0.62 };
    const yOfL = LL => ((QE * Ud * Math.pow(LL / 100, 2)) / (2 * ME * DD * v0 * v0)) * 1000; // mm
    const yTop = topOf(yOfL(8));
    const g = panel(ctx, rc, [2, 8], [0, yTop], pal, { xlab: 'L/cm', ylab: 'y/mm', nx: 5, ny: 4 });
    const curve = [];
    for (let LL = 2; LL <= 8.0001; LL += 0.05) curve.push([LL, yOfL(LL)]);
    poly(ctx, g.X, g.Y, curve, pal.cyan, 2.2);
    spot(ctx, g.X(Lcm), g.Y(yOfL(Lcm)), 5, pal.orange, pal.bg2);
    label(ctx, 'y ∝ L²', rc.x + 8, rc.y + 15, pal.cyan, 'left', 14);

    st.readout([
      ['偏转电压 U', fmt(Ud, 0) + ' V'],
      ['板长 L', fmt(Lcm, 1) + ' cm'],
      ['板间距 d', '2.0 cm'],
      ['入射速度 v0', fmt(v0u, 1) + '×10⁷ m/s'],
      ['加速度 a = qU/(md)', sci(acc) + ' m/s²'],
      ['板内时间 t = L/v0', sci(tin) + ' s'],
      ['偏转量 y = ½at²', fmt(ye * 1000, 2) + ' mm'],
      ['出射偏转角 tanθ', fmt(tanOut, 3)],
      ['y d v0² / (U L²)', sci(inv) + ' C/kg'],
    ]);
  }

  return { frame };
}
