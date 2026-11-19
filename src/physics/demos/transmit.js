/* 电17 远距离输电。
   发电厂送出的功率 P 一定，输电线有电阻 R，线上的电流 I = P/U。
   两笔损失都来自这个电流：
       电压损失  ΔU = IR，
       功率损失  ΔP = I²R = P²R/U²。
   把输送电压 U 升高 k 倍，电流降到 1/k，功率损失降到 1/k² —— 高压输电的道理全在
   这个平方上。左上是「发电机 → 升压变压器 → 输电线 → 降压变压器 → 用户」的示意图，
   绿色小点沿线路流动表示电能的输送方向；左下按比例画输入功率与线上损失；
   右栏画损耗比例随输送电压变化的曲线，橙点是当前的取值。 */
import { label, clamp, fmt } from '../gfx.js';
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
    const Pk = clamp(fn(q.P, 200), 20, 600);        // 输送功率 kW
    const Uk = clamp(fn(q.U, 110), 10, 500);        // 输送电压 kV
    const R = clamp(fn(q.R, 20), 2, 80);            // 线路总电阻 Ω
    const key = [Pk, Uk, R].join('|');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const P = Pk * 1000;                            // W
    const U = Uk * 1000;                            // V
    const I = P / U;                                // A
    const dU = I * R;                               // V
    const dP = I * I * R;                           // W
    const loss = dP / P;                            // 比例
    const Uend = U - dU;
    const spd = clamp(22 + I * 4, 20, 120);

    ctx.clearRect(0, 0, w, h);

    /* ── 左上：输电链示意 ─────────────────────────── */
    const yc = h * 0.24;
    const y1 = yc - 13, y2 = yc + 13;

    // 发电机
    const gx = w * 0.075;
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(gx, yc, 20, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    for (let i = 0; i <= 22; i++) {
      const xx = gx - 10 + (20 * i) / 22;
      const yy = yc + 7 * Math.sin((i / 22) * Math.PI * 2);
      if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
    }
    ctx.stroke();
    ctx.restore();
    label(ctx, '发电机', gx, yc + 36, pal.orange, 'mid', 14);

    // 变压器小图标：铁芯 + 两组线圈
    const tf = (x, up) => {
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(x - 9, yc - 20, 18, 40);
      ctx.strokeStyle = pal.blue;
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(x - 9, yc - 12 + i * 12, 5, Math.PI / 2, Math.PI * 1.5, false);
        ctx.stroke();
      }
      ctx.strokeStyle = pal.green;
      for (let i = 0; i < (up ? 2 : 4); i++) {
        ctx.beginPath();
        ctx.arc(x + 9, yc - 22 + i * 12, 5, -Math.PI / 2, Math.PI / 2, false);
        ctx.stroke();
      }
      ctx.restore();
      label(ctx, up ? '升压' : '降压', x, yc + 40, pal.faint, 'mid', 13);
    };
    const tx1 = w * 0.20, tx2 = w * 0.72;
    tf(tx1, true);
    tf(tx2, false);

    // 输电线：两条平行线 + 中间的电阻折线
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(gx + 20, yc); ctx.lineTo(tx1 - 9, yc);
    ctx.moveTo(tx1 + 9, y1); ctx.lineTo(w * 0.44, y1);
    ctx.moveTo(tx1 + 9, y2); ctx.lineTo(w * 0.44, y2);
    ctx.stroke();
    // 负载端的电阻符号画在下线中段
    ctx.strokeStyle = pal.purple;
    ctx.beginPath();
    const zx = w * 0.50, z0 = w * 0.46;
    ctx.moveTo(z0, y2);
    for (let i = 0; i < 6; i++) {
      ctx.lineTo(z0 + 4 + i * 4.6, y2 + (i % 2 ? -7 : 7));
    }
    ctx.lineTo(zx + 6, y2);
    ctx.lineTo(tx2 - 9, y2);
    ctx.stroke();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.44, y1);
    ctx.lineTo(tx2 - 9, y1);
    ctx.stroke();
    ctx.restore();
    label(ctx, '输电线', (w * 0.46 + w * 0.72) / 2, y1 - 14, pal.faint, 'mid', 14);
    label(ctx, `R = ${fmt(R, 0)} Ω`, zx, y2 + 26, pal.purple, 'mid', 14);

    // 电能流动的小点：整条链路
    flowPath(ctx, [[gx + 20, yc], [tx1 - 9, yc], [tx1 + 9, y1], [w * 0.44, y1], [w * 0.46, y2], [tx2 - 9, y2], [tx2 + 9, yc], [w * 0.92, yc]], pal.green, spd, T, 34, 2.6);

    // 用户
    const ux = w * 0.92;
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 2.2;
    ctx.strokeRect(ux - 16, yc - 16, 32, 32);
    ctx.beginPath();
    ctx.moveTo(ux - 14, yc - 16);
    ctx.lineTo(ux, yc - 30);
    ctx.lineTo(ux + 14, yc - 16);
    ctx.stroke();
    ctx.restore();
    label(ctx, '用户', ux, yc + 36, pal.cyan, 'mid', 14);

    label(ctx, `输送电压 ${fmt(Uk, 0)} kV`, w * 0.30, y1 - 16, pal.blue, 'mid', 14);
    label(ctx, `电流 I = ${fmt(I, 2)} A`, w * 0.30, y2 + 26, pal.green, 'mid', 14);

    /* ── 左下：功率条（输入 / 损失）──────────────── */
    const bx = w * 0.07, bw = w * 0.30;
    const by = h * 0.62;
    label(ctx, '输送功率与线上损失', bx, by - 16, pal.faint, 'left', 14);
    ctx.save();
    ctx.fillStyle = pal.green;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(bx, by, bw, 20);
    ctx.globalAlpha = 1;
    ctx.fillStyle = pal.pink;
    ctx.fillRect(bx, by + 26, Math.max(1, bw * loss), 20);
    ctx.restore();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(bx, by, bw, 20);
    ctx.strokeRect(bx, by + 26, bw, 20);
    label(ctx, `P = ${fmt(Pk, 0)} kW`, bx + 8, by + 10, pal.green, 'left', 13);
    label(ctx, `ΔP = ${fmt(dP, 1)} W（${fmt(loss * 100, 2)}%）`, bx + 8, by + 36, pal.pink, 'left', 13);
    label(ctx, `到达电压 ${fmt(Uend / 1000, 1)} kV`, bx, by + 66, pal.purple, 'left', 13);

    /* ── 右栏：损耗比例随输送电压变化 ─────────────── */
    const rc = { x: w * 0.46, y: h * 0.52, w: w * 0.48, h: h * 0.38 };
    const uMax = 520;
    const lossAt = uu => (P * R) / (uu * uu) * 100;          // 百分数
    const top = lossAt(10) * 1.1;
    const g = panel(ctx, rc, [0, uMax], [0, top], pal, {
      xlab: 'U/kV', ylab: 'ΔP/P  %', nx: 5, ny: 4,
    });
    const cur = [];
    for (let i = 0; i <= 200; i++) {
      const uu = 10 + ((uMax - 10) * i) / 200;
      cur.push([uu, Math.min(top, lossAt(uu))]);
    }
    poly(ctx, g.X, g.Y, cur, pal.orange, 2.2);
    spot(ctx, g.X(Uk), g.Y(Math.min(top, loss * 100)), 5.5, pal.orange, pal.bg2);
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(g.X(Uk), rc.y);
    ctx.lineTo(g.X(Uk), rc.y + rc.h);
    ctx.stroke();
    ctx.restore();
    label(ctx, '电压翻倍，损耗降到四分之一', rc.x + 8, rc.y + 16, pal.faint, 'left', 13);

    st.readout([
      ['输送功率 P', fmt(Pk, 0) + ' kW'],
      ['输送电压 U', fmt(Uk, 0) + ' kV'],
      ['线路电阻 R', fmt(R, 0) + ' Ω'],
      ['线路电流 I = P/U', fmt(I, 2) + ' A'],
      ['电压损失 ΔU = IR', fmt(dU, 1) + ' V'],
      ['功率损失 ΔP = I²R', fmt(dP, 1) + ' W'],
      ['损耗比例 ΔP/P', fmt(loss * 100, 2) + ' %'],
      ['到达用户的电压', fmt(Uend / 1000, 2) + ' kV'],
      ['到达用户的功率', fmt((P - dP) / 1000, 2) + ' kW'],
      ['输电效率', fmt((1 - loss) * 100, 3) + ' %'],
      ['P²R/U²（=ΔP）', fmt((P * P * R) / (U * U), 1) + ' W'],
    ]);
  }

  return { frame };
}
