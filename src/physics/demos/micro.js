/* 电5a 电流的微观表达式。
   导体里的小圆点是自由电荷，以平均速率 v 定向移动，橙色一条竖带是横截面 S。
   t 时间内能穿过 S 的电荷，此刻全在紧邻 S 的那一层里：层长 v·t、层内电荷量
   nqSv·t，于是 I = q/t = nqSv。右栏画 I 随 v 的直线，斜率就是 nqS。
   层长按 v 定性放大（真实一层只有微米量级），读数栏给真值。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const QE = 1.6e-19;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = n => String(n).split('').map(c => (c === '-' ? '⁻' : SUP[+c])).join('');

function sci(v, dig = 2) {
  if (!Number.isFinite(v) || v === 0) return '0';
  const [mb, ex] = v.toExponential(dig - 1).split('e');
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
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const n = clamp(fn(q.n, 8.5), 4, 12); // 以 10²⁸ m⁻³ 计
    const S = clamp(fn(q.S, 1), 0.2, 2); // mm²
    const v = clamp(fn(q.v, 0.1), 0.01, 1); // mm/s

    const key = [n, S, v].join('|');
    if (key !== last) {
      last = key;
      T = 0;
    }
    if (dt > 0) T += dt;

    ctx.clearRect(0, 0, w, h);

    // 电流按 n（10²⁸ m⁻³）、S（mm²）、v（mm/s）这套单位算：系数 1e28·1e-6·1e-3·1.6e-19 = 1.6
    const I = 1.6 * n * S * v; // A
    const NPS = n * S * v * 1e19; // 每秒穿过 S 的载流子数
    const T0 = 0.01; // 读数栏的观察时长（s）
    const cnt = NPS * T0;

    const x0 = w * 0.07;
    const x1 = w * 0.53;
    const hw = clamp(24 + 22 * Math.sqrt(S / 2), 24, 58); // 导体带的厚度随横截面变
    const cy = h * 0.50;

    // 导体
    ctx.save();
    ctx.fillStyle = pal.bg2;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.rect(x0, cy - hw / 2, x1 - x0, hw);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 横截面 S：一条橙色竖带
    const xS = x0 + (x1 - x0) * 0.64;
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.globalAlpha = 0.22;
    ctx.fillRect(xS - 5, cy - hw / 2, 10, hw);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(xS - 5, cy - hw / 2, 10, hw);
    ctx.restore();
    label(ctx, `S = ${fmt(S, 2)} mm²`, xS + 8, cy + hw / 2 + 14, pal.orange, 'left', 14);

    // t 时间内要穿过 S 的电荷全在紧邻 S 的这一层里；层长按 v 定性放大
    const L = (x1 - x0) * (0.10 + 0.45 * Math.sqrt(v));
    ctx.save();
    ctx.fillStyle = pal.green;
    ctx.globalAlpha = 0.13;
    ctx.fillRect(xS - L, cy - hw / 2, L, hw);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(xS - L, cy - hw / 2, L, hw);
    ctx.restore();

    // 载流子：小圆点，间距随 n 变、平移快慢随 v 变
    const gap = clamp(52 * (8.5 / n), 26, 108);
    const spd = 16 + v * 34;
    const off = (((T * spd) % gap) + gap) % gap;
    ctx.save();
    ctx.fillStyle = pal.cyan;
    for (let r = 0; r < 3; r++) {
      const yy = cy + (r - 1) * (hw * 0.28);
      for (let xx = x0 + 6 + off - gap; xx < x1 - 4; xx += gap) {
        if (xx > x0 + 5) {
          ctx.beginPath();
          ctx.arc(xx, yy, 3.4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
    ctx.restore();

    // 层长的量度：从层左沿量到 S
    const ym = cy + hw / 2 + 8;
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(xS - L, ym);
    ctx.lineTo(xS - 2, ym);
    ctx.stroke();
    ctx.restore();
    arrow(ctx, xS - L, ym, xS - 2, ym, pal.green, 1.4);
    label(ctx, '层长 v·t', xS - L / 2, ym + 16, pal.green, 'center', 13);

    // 定向速率与电流方向（按正电荷的约定方向画，两者同向）
    arrow(ctx, x0 + 16, cy - hw / 2 - 16, x0 + 90, cy - hw / 2 - 16, pal.purple, 2.2);
    label(ctx, `v = ${fmt(v, 2)} mm/s`, x0 + 16, cy - hw / 2 - 30, pal.purple, 'left', 14);
    arrow(ctx, x1 - 86, cy - hw / 2 - 16, x1 - 16, cy - hw / 2 - 16, pal.ink, 2.2);
    label(ctx, `I = ${fmt(I, 2)} A`, x1 - 86, cy - hw / 2 - 30, pal.ink, 'left', 14);

    label(ctx, '层内电荷 q = nqSv·t，全部穿过 S 用时 t', x0, h * 0.84, pal.ink, 'left', 13);
    label(ctx, '所以 I = q/t = nqSv', x0, h * 0.89, pal.faint, 'left', 13);
    label(ctx, '金属中自由电子带负电，实际移动方向与电流相反', x0, h * 0.94, pal.faint, 'left', 12);

    /* 右栏：I 随 v 的直线，斜率即 nqS */
    const rc = { x: w * 0.60, y: h * 0.16, w: w * 0.35, h: h * 0.60 };
    const k = 1.6 * n * S; // A 每 (mm/s)
    const g = panel(ctx, rc, [0, 1], [0, topOf(k)], pal, { xlab: 'v/(mm/s)', ylab: 'I/A', nx: 5, ny: 4 });
    poly(ctx, g.X, g.Y, [[0, 0], [1, k]], pal.cyan, 2.2);
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(g.X(v), g.Y(I));
    ctx.lineTo(g.X(v), g.Y(0));
    ctx.moveTo(g.X(v), g.Y(I));
    ctx.lineTo(g.X(0), g.Y(I));
    ctx.stroke();
    ctx.restore();
    spot(ctx, g.X(v), g.Y(I), 5, pal.orange, pal.bg2);
    // 纵轴名 'I/A' 占着框内左上角，图例从它下面一行起
    label(ctx, 'I = nqSv，斜率 nqS', rc.x + 8, rc.y + 34, pal.cyan, 'left', 14);
    label(ctx, 'n 或 S 变大，直线变陡', rc.x + 8, rc.y + 54, pal.faint, 'left', 13);

    const dch = Math.abs(I * T0 - cnt * QE);
    st.readout([
      ['载流子数密度 n', fmt(n, 1) + '×10²⁸ m⁻³'],
      ['每个载流子的电荷量 q', '1.60×10⁻¹⁹ C'],
      ['横截面积 S', fmt(S, 2) + ' mm²'],
      ['定向移动速率 v', fmt(v, 2) + ' mm/s'],
      ['每秒通过 S 的载流子数 nSv', sci(NPS) + ' /s'],
      ['10 ms 内的载流子数 nSvt', sci(cnt) + ' 个'],
      ['10 ms 内通过 S 的电荷量 I·t', sci(I * T0) + ' C'],
      ['与 nqSv·t 之差', dch < 1e-15 ? '0' : sci(dch) + ' C'],
      ['电流 I = nqSv', fmt(I, 3) + ' A'],
    ]);
  }

  return { frame };
}
