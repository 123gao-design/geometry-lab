/* 实13 游标卡尺：主尺读到游标零线左边最近的一条毫米线，
   游标上第 k 格与主尺某条刻线重合，读数 = m + k × 精度（1/n mm）。
   卡尺不估读：最后一位就是精度这一位。 */
import { label, clamp, fmt } from '../gfx.js';

const N_OF = { d10: 10, d20: 20, d50: 50 };

export function create(st) {
  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);

    const n = N_OF[q.mode] || 20;
    const prec = 1 / n;
    const L0 = clamp(fn(q.L, 12.46), 1, 45);

    // 游标对齐格数：真实值落在哪一格上，读数就取到那个格点
    let m = Math.floor(L0 + 1e-9);
    let k = Math.round((L0 - m) * n);
    if (k >= n) { k = 0; m += 1; }
    const Lr = m + k * prec;
    const dec = n <= 10 ? 1 : 2;
    const pTxt = n <= 10 ? '0.1' : prec.toFixed(2);

    ctx.clearRect(0, 0, w, h);

    // ———— 左栏：整把卡尺 ————
    const x0 = w * 0.06, x1 = w * 0.60;
    const MAXMM = 50;
    const sx = (x1 - x0) / MAXMM;
    const X = mm => x0 + mm * sx;
    const yM = h * 0.42;
    const yV = yM + 30;
    const yTop = yM - 64;

    label(ctx, '游标卡尺：主尺读到整毫米，游标上找与主尺重合的那一格', x0, h * 0.10, pal.mut, 'left', 13);
    label(ctx, `${n} 分度 · 每格 ${pTxt} mm · 最后一位就是精度，不再估读`, x0, h * 0.10 + 22, pal.faint, 'left', 12);

    // 主尺
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(x0, Math.round(yM) + 0.5);
    ctx.lineTo(x1, Math.round(yM) + 0.5);
    ctx.stroke();
    for (let mm = 0; mm <= MAXMM; mm++) {
      const len = mm % 10 === 0 ? 16 : mm % 5 === 0 ? 12 : 8;
      const px = Math.round(X(mm)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, yM);
      ctx.lineTo(px, yM + len);
      ctx.stroke();
    }
    ctx.restore();
    for (let mm = 0; mm <= MAXMM; mm += 10) {
      label(ctx, String(mm), X(mm), yM - 12, pal.mut, 'center', 12);
    }

    // 游标（随活动量爪滑动）
    const vx0 = X(Lr), vx1 = X(Lr + (n - 1));
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.roundRect(vx0 - 10, yV, vx1 - vx0 + 20, 28, 4);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.2;
    for (let j = 0; j <= n; j++) {
      const xj = Math.round(X(Lr + j * (n - 1) / n)) + 0.5;
      const len = j === 0 || j === n ? 15 : 10;
      ctx.beginPath();
      ctx.moveTo(xj, yV + 1);
      ctx.lineTo(xj, yV - len);
      ctx.stroke();
    }
    ctx.restore();

    const stepLbl = n >= 50 ? 10 : 5;
    label(ctx, '0', vx0, yV + 17, pal.blue, 'center', 12);
    for (let j = stepLbl; j <= n; j += stepLbl) {
      label(ctx, String(j), X(Lr + j * (n - 1) / n), yV + 17, pal.blue, 'center', 12);
    }

    // 量爪与量爪之间的被测物
    const bar = (xa, xb, yb) => {
      ctx.save();
      ctx.fillStyle = pal.mut;
      ctx.globalAlpha = 0.85;
      ctx.beginPath();
      ctx.roundRect(xa, yTop, xb - xa, yb - yTop, 3);
      ctx.fill();
      ctx.restore();
    };
    bar(X(0) - 9, X(0), yM - 2);
    bar(X(Lr), X(Lr) + 9, yV + 28);

    if (X(Lr) - X(0) > 30) {
      ctx.save();
      ctx.fillStyle = pal.blue;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.roundRect(X(0), yTop + 16, X(Lr) - X(0), 24, 5);
      ctx.fill();
      ctx.restore();
      if (X(Lr) - X(0) > 90) {
        label(ctx, '被测物', (X(0) + X(Lr)) / 2, yTop + 28, pal.bg2, 'center', 12);
      }
    }
    label(ctx, '固定量爪', X(0) - 4, yTop - 12, pal.mut, 'center', 12);
    label(ctx, '活动量爪', X(Lr) + 4, yTop - 12, pal.mut, 'center', 12);

    // 游标零线：读数就取它左边最近的一条毫米线
    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.4;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(Math.round(X(Lr)) + 0.5, yTop + 52);
    ctx.lineTo(Math.round(X(Lr)) + 0.5, yV + 32);
    ctx.stroke();
    ctx.restore();

    // 重合的那一格
    const xa = X(Lr + k * (n - 1) / n);
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.arc(xa, yM + 16, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // ———— 右栏：重合处的放大 ————
    const zx0 = w * 0.65, zx1 = w * 0.97;
    const zc = (zx0 + zx1) / 2;
    const za = Lr + k * (n - 1) / n;
    const zm = (zx1 - zx0) / 2.8;
    const Z = mm => zc + (mm - za) * zm;
    const yzM = h * 0.40, yzV = yzM + 26;

    label(ctx, '放大：游标第 k 格与主尺刻线重合', w * 0.65, h * 0.10, pal.mut, 'left', 13);

    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(zx0, Math.round(yzM) + 0.5);
    ctx.lineTo(zx1, Math.round(yzM) + 0.5);
    ctx.stroke();
    ctx.restore();

    const Ma = m + k;
    for (let M = Ma - 1; M <= Ma + 1; M++) {
      if (M < 0) continue;
      const px = Math.round(Z(M)) + 0.5;
      ctx.save();
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(px, yzM);
      ctx.lineTo(px, yzM + 18);
      ctx.stroke();
      ctx.restore();
      label(ctx, String(M), Z(M), yzM - 14, pal.mut, 'center', 13);
    }

    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.4;
    for (let j = Math.max(0, k - 1); j <= Math.min(n, k + 1); j++) {
      const px = Math.round(Z(Lr + j * (n - 1) / n)) + 0.5;
      ctx.beginPath();
      ctx.moveTo(px, yzV + 1);
      ctx.lineTo(px, yzV - 18);
      ctx.stroke();
    }
    ctx.restore();
    for (let j = Math.max(0, k - 1); j <= Math.min(n, k + 1); j++) {
      label(ctx, String(j), Z(Lr + j * (n - 1) / n), yzV + 16, pal.blue, 'center', 13);
    }

    // 重合处：一条金线穿过两把尺
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(Math.round(Z(za)) + 0.5, yzM - 2);
    ctx.lineTo(Math.round(Z(za)) + 0.5, yzV + 4);
    ctx.stroke();
    ctx.restore();

    label(ctx, `主尺 ${m} mm`, zx0, h * 0.62, pal.ink, 'left', 14);
    label(ctx, `游标第 ${k} 格对齐（共 ${n} 格）`, zx0, h * 0.62 + 24, pal.blue, 'left', 14);
    label(ctx, `读数 = ${m} + ${k} × ${pTxt} = ${Lr.toFixed(dec)} mm`, zx0, h * 0.62 + 48, pal.orange, 'left', 14);

    label(ctx, '读数规则：主尺整毫米 + 游标对齐格数 × 精度', x0, h * 0.88, pal.faint, 'left', 13);

    st.readout([
      ['分度与精度', `${n} 分度 · 每格 ${pTxt} mm`],
      ['主尺读数（整毫米）', m + ' mm'],
      ['游标对齐格数 k', k + ' / ' + n],
      ['读数 = m + k × 精度', Lr.toFixed(dec) + ' mm'],
      ['被测长度（设定值）', L0.toFixed(dec) + ' mm'],
      ['读数与设定值之差', fmt(Lr - L0, dec) + ' mm'],
      ['读法', '游标零线左边最近的一条毫米线即主尺读数，再看游标第几格与主尺重合'],
    ]);
  }

  return { frame };
}
