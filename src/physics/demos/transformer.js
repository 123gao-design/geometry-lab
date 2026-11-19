/* 电16 变压器。
   原、副线圈绕在同一个闭合铁芯上，原线圈接交流电源，铁芯里交变的磁通量同样
   穿过副线圈，副线圈两端因此得到同频率的感应电动势。
   理想变压器不计漏磁与损耗，每匝线圈分担的电压相同：
       U1/U2 = n1/n2，   I1/I2 = n2/n1，   P1 = P2。
   左栏画铁芯、两个线圈、电源与负载，橙色小点沿铁芯环流动表示磁通量；
   右栏上下两张图共用一条时间轴，分别画 u1(t) 与 u2(t)，
   两条曲线同频同相、峰值之比等于匝数比。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';
import { flowPath } from './circuit.js';

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const n1 = Math.round(clamp(fn(q.n1, 800), 200, 2000) / 100) * 100;
    const n2 = Math.round(clamp(fn(q.n2, 200), 200, 2000) / 100) * 100;
    const U1 = clamp(fn(q.U1, 220), 12, 220);
    const Rl = clamp(fn(q.R, 100), 10, 500);
    const key = [n1, n2, U1, Rl].join('|');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const f = 50;
    const om = 2 * Math.PI * f;
    const per = 1 / f;
    const U2 = (U1 * n2) / n1;          // 有效值
    const U1p = U1 * Math.SQRT2;        // 峰值
    const U2p = U2 * Math.SQRT2;
    const I2 = U2 / Rl;
    const I1 = (I2 * n2) / n1;
    const P = U1 * I1;
    const u1 = U1p * Math.sin(om * T);
    const u2 = U2p * Math.sin(om * T);
    const upT = U1 / n1;                // 每匝电压

    ctx.clearRect(0, 0, w, h);

    /* ── 左栏：铁芯与两个线圈 ─────────────────────── */
    const bx0 = w * 0.135, bx1 = w * 0.475;
    const by0 = h * 0.18, by1 = h * 0.78;
    const band = Math.min(18, (bx1 - bx0) * 0.16);   // 铁芯带宽
    const ix0 = bx0 + band, ix1 = bx1 - band;
    const iy0 = by0 + band, iy1 = by1 - band;

    // 铁芯：外框与内窗之间的一圈灰色带
    ctx.save();
    ctx.fillStyle = pal.faint;
    ctx.globalAlpha = 0.16;
    ctx.beginPath();
    ctx.rect(bx0, by0, bx1 - bx0, by1 - by0);
    ctx.rect(ix0, iy0, ix1 - ix0, iy1 - iy0);
    ctx.fill('evenodd');
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
    ctx.strokeRect(ix0, iy0, ix1 - ix0, iy1 - iy0);
    ctx.restore();
    label(ctx, '铁芯', (bx0 + bx1) / 2, by1 + 20, pal.faint, 'mid', 14);

    // 磁通量：沿铁芯中线的橙色小点
    const my0 = (by0 + iy0) / 2;
    const my1 = (by1 + iy1) / 2;
    const mx0 = (bx0 + ix0) / 2;
    const mx1 = (bx1 + ix1) / 2;
    const core = [[mx0, my0], [mx1, my0], [mx1, my1], [mx0, my1], [mx0, my0]];
    flowPath(ctx, core, pal.orange, 46, T, 30, 2.4);
    arrow(ctx, (mx0 + mx1) / 2 - 16, my0, (mx0 + mx1) / 2 + 2, my0, pal.orange, 1.8);
    label(ctx, 'Φ', mx1 + 14, (my0 + my1) / 2, pal.orange, 'left', 14);

    // 线圈：沿股画小半圆，圈数按匝数取到 4..12 段
    const winding = (x, y0, y1, n, side, col) => {
      const k = clamp(Math.round(n / 160), 4, 12);
      const dy = (y1 - y0) / k;
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.2;
      for (let i = 0; i < k; i++) {
        const yy = y0 + dy * (i + 0.5);
        ctx.beginPath();
        if (side > 0) ctx.arc(x, yy, dy * 0.46, -Math.PI / 2, Math.PI / 2, false);
        else ctx.arc(x, yy, dy * 0.46, Math.PI / 2, Math.PI * 1.5, false);
        ctx.stroke();
      }
      ctx.restore();
    };
    const wy0 = iy0 + (iy1 - iy0) * 0.24;
    const wy1 = iy1 - (iy1 - iy0) * 0.24;
    winding(bx0, wy0, wy1, n1, -1, pal.blue);
    winding(bx1, wy0, wy1, n2, 1, pal.green);
    label(ctx, `原线圈 n₁ = ${n1}`, bx0 - 8, wy0 - 16, pal.blue, 'right', 14);
    label(ctx, `副线圈 n₂ = ${n2}`, bx1 + 8, wy0 - 16, pal.green, 'left', 14);

    // 电源：左外侧，一个带正弦符号的圆
    const srcX = w * 0.06;
    const srcY = (wy0 + wy1) / 2;
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(srcX, srcY, 15, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 24; i++) {
      const xx = srcX - 8 + (16 * i) / 24;
      const yy = srcY + 5 * Math.sin((i / 24) * Math.PI * 2);
      if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
    }
    ctx.stroke();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(srcX + 15, srcY);
    ctx.lineTo(bx0 - 14, srcY);
    ctx.lineTo(bx0 - 14, wy1);
    ctx.lineTo(bx0, wy1);
    ctx.moveTo(srcX - 15, srcY);
    ctx.lineTo(srcX - 15, wy1 + 34);
    ctx.lineTo(bx0, wy1 + 34);
    ctx.stroke();
    ctx.restore();
    label(ctx, `u₁ = ${fmt(U1, 0)} V`, srcX, srcY + 34, pal.orange, 'mid', 14);

    // 负载：右外侧一只电阻方框
    const ldX = w * 0.545;
    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 2;
    ctx.strokeRect(ldX, (wy0 + wy1) / 2 - 22, 18, 44);
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(bx1, wy0);
    ctx.lineTo(ldX + 9, wy0);
    ctx.lineTo(ldX + 9, (wy0 + wy1) / 2 - 22);
    ctx.moveTo(bx1, wy1);
    ctx.lineTo(ldX + 9, wy1);
    ctx.lineTo(ldX + 9, (wy0 + wy1) / 2 + 22);
    ctx.stroke();
    ctx.restore();
    label(ctx, `u₂ = ${fmt(U2, 1)} V`, ldX + 9, (wy0 + wy1) / 2 + 40, pal.purple, 'mid', 14);

    label(ctx, `n₁ : n₂ = ${fmt(n1 / n2, 2)} : 1`, (bx0 + bx1) / 2, by0 - 16, pal.blue, 'mid', 14);

    /* ── 右栏：上下两张 u–t 图，共用时间轴 ─────────── */
    const rx = w * 0.63, rw = w * 0.31;
    const py1 = { x: rx, y: h * 0.14, w: rw, h: h * 0.30 };
    const py2 = { x: rx, y: h * 0.52, w: rw, h: h * 0.30 };
    const g1 = panel(ctx, py1, [0, 2 * per], [-U1p * 1.18, U1p * 1.18], pal, {
      xlab: '', ylab: 'u₁/V', nx: 4, ny: 2,
    });
    const g2 = panel(ctx, py2, [0, 2 * per], [-U2p * 1.18, U2p * 1.18], pal, {
      xlab: 't/s', ylab: 'u₂/V', nx: 4, ny: 2,
    });
    const c1 = [], c2 = [];
    for (let i = 0; i <= 160; i++) {
      const tt = (2 * per * i) / 160;
      c1.push([tt, U1p * Math.sin(om * tt)]);
      c2.push([tt, U2p * Math.sin(om * tt)]);
    }
    poly(ctx, g1.X, g1.Y, c1, pal.orange, 2.2);
    poly(ctx, g2.X, g2.Y, c2, pal.green, 2.2);

    // 贯穿两图的时刻竖虚线
    const tt = T % (2 * per);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(g1.X(tt), py1.y);
    ctx.lineTo(g1.X(tt), py1.y + py1.h);
    ctx.moveTo(g2.X(tt), py2.y);
    ctx.lineTo(g2.X(tt), py2.y + py2.h);
    ctx.stroke();
    ctx.restore();
    spot(ctx, g1.X(tt), g1.Y(u1), 4.5, pal.orange, pal.bg2);
    spot(ctx, g2.X(tt), g2.Y(u2), 4.5, pal.green, pal.bg2);
    label(ctx, `峰值 ${fmt(U1p, 0)} V`, rx + 6, py1.y + 14, pal.orange, 'left', 12);
    label(ctx, `峰值 ${fmt(U2p, 0)} V`, rx + 6, py2.y + 14, pal.green, 'left', 12);

    st.readout([
      ['原线圈匝数 n₁', String(n1)],
      ['副线圈匝数 n₂', String(n2)],
      ['匝数比 n₁ : n₂', fmt(n1 / n2, 2) + ' : 1'],
      ['输入电压 U₁（有效值）', fmt(U1, 1) + ' V'],
      ['输出电压 U₂ = U₁n₂/n₁', fmt(U2, 2) + ' V'],
      ['每匝电压 U₁/n₁', fmt(upT * 1000, 2) + ' mV/匝'],
      ['每匝电压 U₂/n₂', fmt((U2 / n2) * 1000, 2) + ' mV/匝'],
      ['负载电阻 R', fmt(Rl, 0) + ' Ω'],
      ['副线圈电流 I₂ = U₂/R', fmt(I2, 3) + ' A'],
      ['原线圈电流 I₁ = I₂n₂/n₁', fmt(I1, 3) + ' A'],
      ['输入功率 P₁ = U₁I₁', fmt(P, 2) + ' W'],
      ['输出功率 P₂ = U₂I₂', fmt(U2 * I2, 2) + ' W'],
    ]);
  }

  return { frame };
}
