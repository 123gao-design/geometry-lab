/* 电11 楞次定律：条形磁铁沿线圈轴线往复，磁通量先增后减。
   线圈绕行箭头给出感应电流的方向——靠近时逆时针、远离时顺时针
   （都从磁铁这一侧看过去），磁铁旁的紫箭头是线圈对它的作用力：
   靠近时排斥、远离时吸引，永远与相对运动反向。
   右栏是 Φ–t 曲线，切线的斜率为正为负，正是感应电动势的符号来源。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const R_COIL = 0.05;   // 线圈半径 m
const CF = 4e-3;       // Φ = CF/(d²+R²)^{3/2}，单位 mWb·m³
const DM = 0.08;       // 最近距离 m
const FAR = 0.24;      // 最远距离 m
const PERIOD = 6;      // 往复周期 s
const RLOAD = 5;       // 回路总电阻 Ω

export function create(st) {
  let T = 0;
  let last = '';

  const dist = tt => DM + ((FAR - DM) * (1 - Math.cos((2 * Math.PI * tt) / PERIOD))) / 2;
  const fluxOf = (d, sg) => (-sg * CF) / Math.pow(d * d + R_COIL * R_COIL, 1.5);
  const rateOf = (tt, sg) => {
    const om = (2 * Math.PI) / PERIOD;
    const d = dist(tt);
    const dDot = ((FAR - DM) * om * Math.sin(om * tt)) / 2;
    const dPhiDd = (3 * sg * CF * d) / Math.pow(d * d + R_COIL * R_COIL, 2.5);
    return dPhiDd * dDot;
  };

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const sg = q.mode === 'S' ? -1 : 1;
    const N = Math.round(clamp(fn(q.N, 10), 1, 40));
    const key = [sg, N].join('|');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) {
      T += dt;
      if (T > 2 * PERIOD) T -= 2 * PERIOD;
    }

    const d = dist(T);
    const phi = fluxOf(d, sg);                 // mWb，正方向取「指向磁铁」
    const rate = rateOf(T, sg);                // mWb/s
    const om = (2 * Math.PI) / PERIOD;
    const near = Math.sin(om * T) < 0;         // d 正在变小：磁铁靠近
    const E = N * Math.abs(rate);              // mV（N·dΦ/dt，mWb/s → mV）
    const I = E / RLOAD;                       // mA
    const dirI = rate < -2e-3 ? 1 : rate > 2e-3 ? -1 : 0;

    ctx.clearRect(0, 0, w, h);

    /* ── 左栏：磁铁与线圈 ───────────────────────────── */
    const cx = w * 0.40;
    const cy = h * 0.50;
    const R = Math.min(w * 0.085, h * 0.26);
    const u = (d - DM) / (FAR - DM);            // 0 近、1 远
    const ml = R * 0.78;                        // 磁铁半长
    const mh = R * 0.20;                        // 磁铁半高
    const mx = cx - R * 1.30 - u * w * 0.20;

    // 轴线
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(mx, cy);
    ctx.lineTo(cx - R * 0.4, cy);
    ctx.stroke();
    ctx.restore();

    // 磁铁的磁场方向：从 N 极出发穿过线圈
    const fx0 = sg > 0 ? mx + ml + 8 : cx - R * 0.4;
    const fx1 = sg > 0 ? cx - R * 0.4 : mx + ml + 8;
    for (let i = 1; i <= 3; i++) {
      const x = fx0 + ((fx1 - fx0) * i) / 4;
      const a = sg > 0 ? 0 : Math.PI;
      arrow(ctx, x - Math.cos(a) * 9, cy, x + Math.cos(a) * 9, cy, pal.orange, 1.8);
    }
    label(ctx, '原磁场', (fx0 + fx1) / 2, cy - 12, pal.orange, 'mid', 13);

    // 磁铁：右半靠线圈，N 极朝向线圈时右半为 N
    const rightN = sg > 0;
    ctx.save();
    ctx.fillStyle = rightN ? pal.orange : pal.blue;
    ctx.globalAlpha = 0.42;
    ctx.fillRect(mx, cy - mh, ml, 2 * mh);
    ctx.fillStyle = rightN ? pal.blue : pal.orange;
    ctx.fillRect(mx - ml, cy - mh, ml, 2 * mh);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(mx - ml, cy - mh, 2 * ml, 2 * mh);
    ctx.restore();
    label(ctx, rightN ? 'S' : 'N', mx - ml / 2, cy, rightN ? pal.blue : pal.orange, 'mid', 16);
    label(ctx, rightN ? 'N' : 'S', mx + ml / 2, cy, rightN ? pal.orange : pal.blue, 'mid', 16);
    label(ctx, '条形磁铁', mx, cy + mh + 18, pal.ink, 'mid', 14);

    // 线圈对磁铁的作用力：靠近时排斥、远离时吸引
    const fLen = clamp(30 + 60 * Math.abs(rate) / 8, 26, 74);
    const fx = near ? -1 : 1;
    arrow(ctx, mx + fx * 4, cy - mh - 20, mx + fx * (4 + fLen), cy - mh - 20, pal.purple, 2.2);
    label(ctx, 'F', mx + fx * (fLen + 12), cy - mh - 20, pal.purple, fx > 0 ? 'left' : 'end', 14);

    // 线圈：三匝窄椭圆
    for (let i = -1; i <= 1; i++) {
      ctx.save();
      ctx.strokeStyle = pal.blue;
      ctx.lineWidth = i === 0 ? 2.6 : 2;
      ctx.beginPath();
      ctx.ellipse(cx + i * 7, cy, R * 0.32, R, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    label(ctx, '线圈', cx + R * 0.42, cy - R - 6, pal.blue, 'left', 14);

    // 感应电流：四个绕行箭头
    const rx = R * 0.32;
    for (let i = 0; i < 4 && dirI !== 0; i++) {
      const ph = (i * Math.PI) / 2 + Math.PI / 4;
      const px = cx + rx * Math.cos(ph);
      const py = cy + R * Math.sin(ph);
      let tx = rx * Math.sin(ph);
      let ty = -R * Math.cos(ph);
      const L = Math.hypot(tx, ty) || 1;
      tx = (tx / L) * dirI;
      ty = (ty / L) * dirI;
      arrow(ctx, px - tx * 9, py - ty * 9, px + tx * 9, py + ty * 9, pal.green, 2);
    }
    const dirTxt = dirI === 0 ? '感应电流为零' : `感应电流：${dirI > 0 ? '逆' : '顺'}时针（从磁铁一侧看）`;
    label(ctx, dirTxt, cx, h * 0.90, dirI === 0 ? pal.faint : pal.green, 'mid', 14);
    label(ctx, near ? '磁铁靠近：磁通量增加' : '磁铁远离：磁通量减少', cx, h * 0.90 + 20,
      near ? pal.orange : pal.cyan, 'mid', 14);

    /* ── 右栏：Φ–t 曲线 ─────────────────────────────── */
    const rc = { x: w * 0.63, y: h * 0.17, w: w * 0.32, h: h * 0.60 };
    const hi = (CF / Math.pow(DM * DM + R_COIL * R_COIL, 1.5)) * 1.06;
    const g = panel(ctx, rc, [0, 2 * PERIOD], [-hi, hi], pal, { xlab: 't/s', ylab: 'Φ/mWb', nx: 6, ny: 4 });
    const pts = [];
    for (let tt = 0; tt <= 2 * PERIOD + 1e-6; tt += 0.08) pts.push([tt, fluxOf(dist(tt), sg)]);
    poly(ctx, g.X, g.Y, pts, pal.cyan, 2.2);
    // 切线：斜率就是此刻的 ΔΦ/Δt（换算成像素斜率时要带上纵向翻转的负号）
    const gx = g.X(T);
    const gy = g.Y(phi);
    const tl = 34;
    const kPix = -((rate * rc.h) / (2 * hi)) * ((2 * PERIOD) / rc.w);
    const kn = Math.hypot(1, kPix) || 1;
    ctx.save();
    ctx.beginPath();
    ctx.rect(rc.x, rc.y, rc.w, rc.h);
    ctx.clip();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(gx - (tl / kn), gy - (tl * kPix) / kn);
    ctx.lineTo(gx + (tl / kn), gy + (tl * kPix) / kn);
    ctx.stroke();
    ctx.restore();
    spot(ctx, gx, gy, 5.5, pal.orange, pal.bg2);
    label(ctx, '切线斜率 = ΔΦ/Δt', rc.x + 6, rc.y + 34, pal.purple, 'left', 13);

    st.readout([
      ['磁铁的极性', sg > 0 ? 'N 极朝向线圈' : 'S 极朝向线圈'],
      ['磁通量 Φ', fmt(phi, 2) + ' mWb'],
      ['变化率 ΔΦ/Δt', fmt(rate, 2) + ' mWb/s'],
      ['感应电动势 E = NΔΦ/Δt', fmt(E, 1) + ' mV'],
      ['感应电流 I = E/R（R = 5 Ω）', fmt(I, 2) + ' mA'],
      ['感应电流方向', dirI === 0 ? '—' : dirI > 0 ? '逆时针' : '顺时针'],
      ['楞次规律', near ? '阻碍靠近：线圈排斥磁铁' : '阻碍远离：线圈吸引磁铁'],
    ]);
  }

  return { frame };
}
