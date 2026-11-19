/* 原2 德布罗意波。
   电子经电压 U 加速，动能为 eU，动量 p = √(2meU)，德布罗意波长 λ = h/p。
   以伏特计、以纳米计，λ ≈ 1.226/√U nm。左栏把电子画成沿轨迹波动的一列物质波，
   波长按真实比例放大到屏幕上；右栏是 λ 随加速电压变化的曲线。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const H = 6.626e-34;      // J·s
const ME = 9.11e-31;      // kg
const QE = 1.6e-19;       // C

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const U = clamp(fn(q.U, 1000), 50, 5000);

    const key = String(U);
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const v = Math.sqrt((2 * QE * U) / ME);      // m/s
    const p = ME * v;                            // kg·m/s
    const lamM = H / p;                          // m
    const lamNm = lamM * 1e9;
    const lamPm = lamM * 1e12;

    ctx.clearRect(0, 0, w, h);

    /* ══ 左栏：加速管与电子的物质波 ═══════════════════════════ */
    const cy = h * 0.42;
    const x0 = w * 0.11, x1 = w * 0.235;

    // 阴极与阳极
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x0, cy - h * 0.20);
    ctx.lineTo(x0, cy + h * 0.20);
    ctx.stroke();
    ctx.strokeStyle = pal.blue;
    ctx.beginPath();
    ctx.moveTo(x1, cy - h * 0.20);
    ctx.lineTo(x1, cy - h * 0.035);
    ctx.moveTo(x1, cy + h * 0.035);
    ctx.lineTo(x1, cy + h * 0.20);
    ctx.stroke();
    ctx.restore();
    label(ctx, '阴极', x0, cy - h * 0.20 - 12, pal.orange, 'center', 13);
    label(ctx, '阳极（带小孔）', x1, cy - h * 0.20 - 12, pal.blue, 'center', 13);

    // 加速电场
    for (let k = 0; k < 3; k++) {
      const yy = cy - h * 0.11 + k * h * 0.11;
      arrow(ctx, x0 + 10, yy, x1 - 8, yy, pal.faint, 1.6);
    }
    label(ctx, `U = ${fmt(U, 0)} V`, (x0 + x1) / 2, cy + h * 0.20 + 18, pal.mut, 'center', 13);

    // 电子与其物质波：一段正弦波纹沿轨迹前进
    const lamPx = clamp(lamNm * 900, 12, 155);
    const xa = x1 + 12, xb = w * 0.515;
    const amp = 17;
    const phase = -T * 90;    // 波纹向右行进
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = xa; x <= xb; x += 1.5) {
      const yy = cy + amp * Math.sin(((x - xa) / lamPx) * Math.PI * 2 + phase);
      if (x === xa) ctx.moveTo(x, yy);
      else ctx.lineTo(x, yy);
    }
    ctx.stroke();
    // 平衡线
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(xa, cy);
    ctx.lineTo(xb, cy);
    ctx.stroke();
    ctx.restore();

    // 电子本体
    ctx.save();
    ctx.fillStyle = pal.cyan;
    ctx.beginPath();
    ctx.arc(xa, cy, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 波长标注：取相邻两个波峰
    if (lamPx > 30) {
      const top = cy - amp - 12;
      const c0 = xa + ((Math.PI / 2 - phase) / (Math.PI * 2) + 1) * lamPx;
      const c1 = c0 + lamPx;
      if (c1 < xb - 2) {
        ctx.save();
        ctx.strokeStyle = pal.purple;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(c0, top);
        ctx.lineTo(c0, cy - amp - 2);
        ctx.moveTo(c1, top);
        ctx.lineTo(c1, cy - amp - 2);
        ctx.stroke();
        arrow(ctx, c0, top, c1, top, pal.purple, 1.4);
        arrow(ctx, c1, top, c0, top, pal.purple, 1.4);
        ctx.restore();
        label(ctx, `λ = ${fmt(lamPm, 1)} pm`, (c0 + c1) / 2, top - 10, pal.purple, 'center', 12);
      }
    }
    label(ctx, '电子的物质波', xa, cy + amp + 26, pal.green, 'left', 13);

    /* ══ 右栏：波长随加速电压 ═════════════════════════════════ */
    const rc = { x: w * 0.60, y: h * 0.14, w: w * 0.36, h: h * 0.66 };
    const g = panel(ctx, rc, [0, 5000], [0, 145], pal, { xlab: 'U/V', ylab: 'λ/pm', nx: 5, ny: 4 });
    const pts = [];
    for (let i = 1; i <= 320; i++) {
      const u = (5000 * i) / 320;
      if (u < 30) continue;
      pts.push([u, 1226 / Math.sqrt(u)]);
    }
    poly(ctx, g.X, g.Y, pts, pal.orange, 2);
    spot(ctx, g.X(U), g.Y(lamPm), 4.8, pal.orange, pal.bg2);
    label(ctx, `λ = ${fmt(lamPm, 1)} pm`, g.X(U) + 8, g.Y(lamPm) - 12, pal.mut, 'left', 12);
    label(ctx, '加速电压越高，波长越短', rc.x + 2, rc.y - 14, pal.mut, 'left', 13);

    st.readout([
      ['加速电压 U', fmt(U, 0) + ' V'],
      ['电子动能 eU', fmt(U, 0) + ' eV'],
      ['电子速度 v', fmt(v / 1e7, 2) + ' ×10⁷ m/s'],
      ['动量 p', fmt(p / 1e-24, 2) + ' ×10⁻²⁴ kg·m/s'],
      ['德布罗意波长 λ = h/p', fmt(lamPm, 1) + ' pm = ' + fmt(lamNm, 4) + ' nm'],
      ['λ = 1.226/√U（nm）', fmt(1.226 / Math.sqrt(U), 4) + ' nm'],
      ['与绿光 550 nm 之比', '1 : ' + fmt(550 / lamNm, 0)],
      ['与原子直径 0.1 nm 之比', fmt(lamNm / 0.1, 2)],
      ['v/c', fmt(v / 2.998e8, 3)],
    ]);
  }

  return { frame };
}
