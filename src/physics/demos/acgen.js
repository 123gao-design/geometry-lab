/* 电15 交流电的产生与有效值。
   矩形线圈在匀强磁场中绕垂直于磁场的轴匀速转动（俯视看是一根线段在转）。
   设线圈平面与磁场方向的夹角为 θ = ωt，穿过线圈的磁通量 Φ = BS cos θ，
   于是 e = −N dΦ/dt = NBSω sin θ：电动势按正弦规律变化。
   峰值 E₀ = NBSω 由匝数、磁场、面积与角速度共同决定；
   有效值 E = E₀/√2，是同样时间里发热相同的直流电压。
   右栏画两个周期的 e–t 曲线，橙点是此刻的电动势，
   紫色虚线标峰值 ±E₀，青色虚线标有效值 ±E₀/√2。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const N = Math.round(clamp(fn(q.N, 100), 10, 200));
    const B = clamp(fn(q.B, 1), 0.2, 2);
    const S = clamp(fn(q.S, 0.05), 0.01, 0.2);
    const fq = clamp(fn(q.f, 2), 0.5, 5);          // 转速 转/秒
    const Rl = clamp(fn(q.R, 10), 2, 50);
    const key = [N, B, S, fq, Rl].join('|');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const om = 2 * Math.PI * fq;
    const per = 1 / fq;
    const E0 = N * B * S * om;
    const Er = E0 / Math.SQRT2;
    const th = ((om * T) % (2 * Math.PI));
    const e = E0 * Math.sin(th);
    const I = Math.abs(e) / Rl;
    const P = (e * e) / Rl;

    ctx.clearRect(0, 0, w, h);

    /* ── 左栏：磁场中的线圈（俯视） ───────────────── */
    const cx = w * 0.27;
    const cy = h * 0.46;
    const Rr = Math.min(w * 0.16, h * 0.30);

    // 磁场：水平向右的箭头
    for (let yy = cy - Rr - 18; yy <= cy + Rr + 18; yy += 34) {
      ctx.save();
      ctx.strokeStyle = pal.cyan;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(cx - Rr - 34, yy);
      ctx.lineTo(cx + Rr + 26, yy);
      ctx.stroke();
      ctx.restore();
      arrow(ctx, cx + Rr + 12, yy, cx + Rr + 26, yy, pal.cyan, 1.6);
    }
    label(ctx, '匀强磁场 B', cx, cy - Rr - 34, pal.cyan, 'mid', 14);

    // 转轴
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(cx, cy - Rr - 10);
    ctx.lineTo(cx, cy + Rr + 10);
    ctx.stroke();
    ctx.restore();
    label(ctx, '转轴', cx, cy + Rr + 28, pal.faint, 'mid', 13);

    // 线圈：一条线段绕中心转动
    const ux = Math.cos(th);
    const uy = Math.sin(th);
    const ax = cx - Rr * ux, ay = cy - Rr * uy;
    const bx = cx + Rr * ux, by = cy + Rr * uy;
    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(ax, ay);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();

    // 电流方向：两枚小箭头沿线圈
    const sgn = Math.cos(th) >= 0 ? 1 : -1;
    for (const t of [0.28, 0.72]) {
      const px0 = ax + (bx - ax) * t;
      const py0 = ay + (by - ay) * t;
      arrow(ctx, px0 - ux * 10 * sgn, py0 - uy * 10 * sgn, px0 + ux * 10 * sgn, py0 + uy * 10 * sgn, pal.green, 2.2);
    }
    label(ctx, `N = ${N} 匝`, cx + Rr + 34, cy - 4, pal.blue, 'left', 14);
    label(ctx, `θ = ${fmt(th, 2)} rad`, cx + Rr + 34, cy + 18, pal.faint, 'left', 14);

    label(ctx, e >= 0 ? '此刻 e > 0：电流沿绿色箭头方向' : '此刻 e < 0：电流与绿色箭头反向',
      w * 0.09, h * 0.88, pal.faint, 'left', 14);

    /* ── 右栏：e–t 曲线 ──────────────────────────── */
    const rc = { x: w * 0.60, y: h * 0.16, w: w * 0.34, h: h * 0.62 };
    const g = panel(ctx, rc, [0, 2 * per], [-E0 * 1.15, E0 * 1.15], pal, {
      xlab: 't/s', ylab: 'e/V', nx: 4, ny: 4,
    });
    const cur = [];
    for (let i = 0; i <= 160; i++) {
      const tt = (2 * per * i) / 160;
      cur.push([tt, E0 * Math.sin(om * tt)]);
    }
    poly(ctx, g.X, g.Y, cur, pal.blue, 2.4);
    // 峰值与有效值
    for (const [val, col] of [[E0, pal.purple], [Er, pal.cyan], [-E0, pal.purple], [-Er, pal.cyan]]) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = col;
      ctx.globalAlpha = 0.75;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(rc.x, g.Y(val));
      ctx.lineTo(rc.x + rc.w, g.Y(val));
      ctx.stroke();
      ctx.restore();
    }
    label(ctx, '±E₀', rc.x + rc.w + 4, g.Y(E0) - 2, pal.purple, 'left', 12);
    label(ctx, '±E₀/√2', rc.x + rc.w + 4, g.Y(Er) - 2, pal.cyan, 'left', 12);
    spot(ctx, g.X(T % (2 * per)), g.Y(e), 5.5, pal.orange, pal.bg2);
    label(ctx, 'T = ' + fmt(per, 2) + ' s', rc.x + rc.w - 6, rc.y + 16, pal.faint, 'right', 13);

    st.readout([
      ['匝数 N', String(N)],
      ['磁感应强度 B', fmt(B, 2) + ' T'],
      ['线圈面积 S', fmt(S, 3) + ' m²'],
      ['转速 f', fmt(fq, 2) + ' Hz'],
      ['周期 T = 1/f', fmt(per, 2) + ' s'],
      ['角速度 ω = 2πf', fmt(om, 2) + ' rad/s'],
      ['峰值 E₀ = NBSω', fmt(E0, 2) + ' V'],
      ['有效值 E₀/√2', fmt(Er, 2) + ' V'],
      ['此刻电动势 e', fmt(e, 2) + ' V'],
      ['负载电阻 R', fmt(Rl, 1) + ' Ω'],
      ['此刻电流 i = e/R', fmt(I, 2) + ' A'],
      ['平均功率 e²/R', fmt(P, 2) + ' W'],
      ['稳态平均功率 E₀²/(2R)', fmt((E0 * E0) / (2 * Rl), 2) + ' W'],
    ]);
  }

  return { frame };
}
