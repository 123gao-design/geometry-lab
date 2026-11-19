/* 电5 欧姆定律与串并联。
   三档：① 欧姆定律——一只电阻接在电源上，电流 I = U/R，右栏是 I–U 直线（斜率 1/R），
        读数栏的 U/I 拖电压时不变；② 串联——两只电阻首尾相接，电流处处相同，
        R = R₁ + R₂，电压按电阻正比分配；③ 并联——两只电阻并排接在同一对节点上，
        电压相同，1/R = 1/R₁ + 1/R₂，总电阻比任一条支路都小，电流按电阻反比分配。
   导线上的小圆点按电流大小成比例地流动：串联时整条回路一个速率，
   并联时两条支路的快慢不同——这正是「电流处处相等」与「分流」的实物对照。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

function topOf(v) {
  if (!(v > 0) || !Number.isFinite(v)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return p * (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10);
}

/** 折线导线 */
function wire(ctx, pts, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
  ctx.stroke();
  ctx.restore();
}

/** 电源：长板（正）在上、短板（负）在下，两极各标一个符号 */
function battery(ctx, x, yc, pal) {
  ctx.save();
  ctx.strokeStyle = pal.orange;
  ctx.lineWidth = 3.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 17, yc - 15);
  ctx.lineTo(x + 17, yc - 15);
  ctx.stroke();
  ctx.strokeStyle = pal.blue;
  ctx.beginPath();
  ctx.moveTo(x - 9, yc + 15);
  ctx.lineTo(x + 9, yc + 15);
  ctx.stroke();
  ctx.restore();
  label(ctx, '+', x - 26, yc - 15, pal.orange, 'right', 16);
  label(ctx, '−', x - 20, yc + 15, pal.blue, 'right', 16);
}

/** 电阻：水平或竖直的小方框 */
function resBox(ctx, x, y, pal, vertical) {
  const bw = vertical ? 18 : 46;
  const bh = vertical ? 46 : 18;
  ctx.save();
  ctx.fillStyle = pal.bg2;
  ctx.strokeStyle = pal.ink;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.rect(x - bw / 2, y - bh / 2, bw, bh);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/** 沿一条折线均匀落流动的小点；spd 是像素速率 */
export function flowPath(ctx, pts, color, spd, T, sp = 36, r = 2.6) {
  let total = 0;
  const segs = [];
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    segs.push({ a: pts[i - 1], b: pts[i], l, s0: total });
    total += l;
  }
  if (total < 2) return;
  const ph = ((T * spd) % sp + sp) % sp;
  ctx.save();
  ctx.fillStyle = color;
  for (let s = ph; s < total; s += sp) {
    for (const g of segs) {
      if (s >= g.s0 && s <= g.s0 + g.l) {
        const t = (s - g.s0) / (g.l || 1);
        ctx.beginPath();
        ctx.arc(g.a[0] + (g.b[0] - g.a[0]) * t, g.a[1] + (g.b[1] - g.a[1]) * t, r, 0, Math.PI * 2);
        ctx.fill();
        break;
      }
    }
  }
  ctx.restore();
}

/** 一段直线上的流动小点（并联的分支各走各的） */
function flowSeg(ctx, x1, y1, x2, y2, color, spd, T, sp = 36, r = 2.6) {
  const l = Math.hypot(x2 - x1, y2 - y1);
  if (l < 2) return;
  const ph = ((T * spd) % sp + sp) % sp;
  const ux = (x2 - x1) / l;
  const uy = (y2 - y1) / l;
  ctx.save();
  ctx.fillStyle = color;
  for (let s = ph; s < l; s += sp) {
    ctx.beginPath();
    ctx.arc(x1 + ux * s, y1 + uy * s, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

/** 按比例分段的横条：两段颜色、两段标签 */
function splitBar(ctx, x, y, wd, ht, frac, pal, cA, cB, tA, tB, vA, vB) {
  const f = clamp(frac, 0, 1);
  const w1 = wd * f;
  const w2 = wd - w1;
  ctx.save();
  ctx.fillStyle = cA;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(x, y, Math.max(1, w1), ht);
  ctx.fillStyle = cB;
  ctx.fillRect(x + w1, y, Math.max(1, w2), ht);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = pal.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, wd, ht);
  ctx.restore();
  const c1 = x + w1 / 2;
  const c2 = x + w1 + w2 / 2;
  label(ctx, `${tA} ${vA}`, w1 >= 84 ? c1 : x, y - 11, cA, w1 >= 84 ? 'center' : 'left', 14);
  label(ctx, `${tB} ${vB}`, w2 >= 84 ? c2 : x + wd, y - 11, cB, w2 >= 84 ? 'center' : 'right', 14);
}

/** 一根按长度表示大小的横条：左边名字、右边数值 */
function hbar(ctx, x, y, ht, len, color, pal, name, val) {
  const L = Math.max(2, len);
  ctx.save();
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(x, y, L, ht);
  ctx.globalAlpha = 1;
  ctx.strokeStyle = pal.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, L, ht);
  ctx.restore();
  label(ctx, name, x - 8, y + ht / 2, pal.mut, 'right', 14);
  label(ctx, val, x + L + 8, y + ht / 2, color, 'left', 14);
}

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'series' ? 'series' : q.mode === 'par' ? 'par' : 'ohm';
    const U = clamp(fn(q.U, 6), 1, 12);
    const R = clamp(fn(q.R, 3), 1, 10);
    const R1 = clamp(fn(q.R1, 2), 1, 10);
    const R2 = clamp(fn(q.R2, 4), 1, 10);

    const key = [mode, U, R, R1, R2].join('|');
    if (key !== last) {
      last = key;
      T = 0;
    }
    if (dt > 0) T += dt;

    ctx.clearRect(0, 0, w, h);

    /* ── ① 欧姆定律：一只电阻的 U–I 关系 ─────────────── */
    if (mode === 'ohm') {
      const x0 = w * 0.16;
      const x1 = w * 0.54;
      const yT = h * 0.26;
      const yB = h * 0.72;
      const cyB = (yT + yB) / 2;
      const I = U / R;
      const P = U * I;
      const spd = clamp(30 + I * 22, 24, 130);

      const pts = [
        [x0, cyB - 15], [x0, yT], [x1, yT], [x1, yB], [x0, yB], [x0, cyB + 15],
      ];
      wire(ctx, pts, pal.ink);
      flowPath(ctx, pts, pal.cyan, spd, T);

      battery(ctx, x0, cyB, pal);
      label(ctx, `U = ${fmt(U, 1)} V`, x0 + 24, cyB, pal.mut, 'left', 14);

      const rx = (x0 + x1) / 2;
      resBox(ctx, rx, yT, pal, false);
      label(ctx, 'R', rx, yT - 24, pal.ink, 'center', 15);
      label(ctx, `${fmt(R, 1)} Ω`, rx, yT + 26, pal.ink, 'center', 14);

      arrow(ctx, x0 + 26, yT, x0 + 82, yT, pal.orange, 2.4);
      label(ctx, `I = ${fmt(I, 2)} A`, x0 + 54, yT - 17, pal.orange, 'center', 14);
      label(ctx, '电流方向：从电源正极出发', x0 + 8, yB + 22, pal.faint, 'left', 13);

      /* 右栏：I 随 U 的直线，斜率就是 1/R */
      const rc = { x: w * 0.62, y: h * 0.18, w: w * 0.33, h: h * 0.58 };
      const g = panel(ctx, rc, [0, 12], [0, topOf(12 / R)], pal, { xlab: 'U/V', ylab: 'I/A', nx: 6, ny: 4 });
      poly(ctx, g.X, g.Y, [[0, 0], [12, 12 / R]], pal.cyan, 2.2);
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(g.X(U), g.Y(I));
      ctx.lineTo(g.X(U), g.Y(0));
      ctx.moveTo(g.X(U), g.Y(I));
      ctx.lineTo(g.X(0), g.Y(I));
      ctx.stroke();
      ctx.restore();
      spot(ctx, g.X(U), g.Y(I), 5, pal.orange, pal.bg2);
      // 图例写在纵轴名下面一格起，别压在 'I/A' 上（panel 把纵轴名放在框内左上角）
      label(ctx, 'I = U/R', rc.x + 8, rc.y + 34, pal.cyan, 'left', 14);
      label(ctx, '同一条直线上 U/I 都是 R', rc.x + 8, rc.y + 54, pal.faint, 'left', 13);

      st.readout([
        ['电阻两端电压 U', fmt(U, 1) + ' V'],
        ['电阻 R', fmt(R, 1) + ' Ω'],
        ['电流 I = U/R', fmt(I, 2) + ' A'],
        ['U/I', fmt(U / I, 2) + ' Ω'],
        ['电功率 P = UI', fmt(P, 2) + ' W'],
        ['P 也等于 I²R', fmt(I * I * R, 2) + ' W'],
      ]);
      return;
    }

    /* ── ② 串联：电流处处相同，电压按电阻分配 ─────────── */
    if (mode === 'series') {
      const x0 = w * 0.14;
      const x1 = w * 0.54;
      const yT = h * 0.28;
      const yB = h * 0.72;
      const cyB = (yT + yB) / 2;
      const Rt = R1 + R2;
      const I = U / Rt;
      const U1 = I * R1;
      const U2 = I * R2;
      const spd = clamp(30 + I * 22, 24, 130);
      const r1x = x0 + (x1 - x0) * 0.34;
      const r2x = x0 + (x1 - x0) * 0.76;

      const pts = [
        [x0, cyB - 15], [x0, yT], [x1, yT], [x1, yB], [x0, yB], [x0, cyB + 15],
      ];
      wire(ctx, pts, pal.ink);
      flowPath(ctx, pts, pal.cyan, spd, T);

      battery(ctx, x0, cyB, pal);
      label(ctx, `U = ${fmt(U, 1)} V`, x0 + 24, cyB, pal.mut, 'left', 14);

      resBox(ctx, r1x, yT, pal, false);
      resBox(ctx, r2x, yT, pal, false);
      label(ctx, 'R₁', r1x, yT - 24, pal.ink, 'center', 15);
      label(ctx, 'R₂', r2x, yT - 24, pal.ink, 'center', 15);
      label(ctx, `U₁ = ${fmt(U1, 2)} V`, r1x, yT + 26, pal.orange, 'center', 14);
      label(ctx, `U₂ = ${fmt(U2, 2)} V`, r2x, yT + 26, pal.blue, 'center', 14);

      const ax1 = r1x + 34;
      const ax2 = r2x - 34;
      arrow(ctx, ax1, yT, ax2, yT, pal.orange, 2.4);
      label(ctx, `I = ${fmt(I, 2)} A`, (ax1 + ax2) / 2, yT - 17, pal.orange, 'center', 14);
      label(ctx, '同一时刻导线里各处电流相同', x0 + 8, yB + 22, pal.faint, 'left', 13);

      /* 右栏：电压条与电阻条的分界线上下对齐 */
      const rc = { x: w * 0.62, y: h * 0.20, w: w * 0.32, h: h * 0.56 };
      const bw = rc.w;
      const bh = 24;
      const y1 = rc.y + rc.h * 0.16;
      const y2 = rc.y + rc.h * 0.52;
      const f = R1 / Rt;
      label(ctx, '串联：电压按电阻正比分配', rc.x, rc.y + 6, pal.ink, 'left', 15);
      splitBar(ctx, rc.x, y1, bw, bh, f, pal, pal.orange, pal.blue, 'U₁', 'U₂',
        fmt(U1, 2) + ' V', fmt(U2, 2) + ' V');
      label(ctx, `U = ${fmt(U, 1)} V`, rc.x + bw, y1 + bh + 16, pal.mut, 'right', 13);
      splitBar(ctx, rc.x, y2, bw, bh, f, pal, pal.orange, pal.blue, 'R₁', 'R₂',
        fmt(R1, 1) + ' Ω', fmt(R2, 1) + ' Ω');
      label(ctx, `R = ${fmt(Rt, 2)} Ω`, rc.x + bw, y2 + bh + 16, pal.mut, 'right', 13);

      const sx = rc.x + bw * f;
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(sx, y1 - 4);
      ctx.lineTo(sx, y2 + bh + 4);
      ctx.stroke();
      ctx.restore();
      label(ctx, '两条分界线对齐：U₁ : U₂ = R₁ : R₂', rc.x, y2 + bh + 38, pal.faint, 'left', 13);

      st.readout([
        ['R₁', fmt(R1, 1) + ' Ω'],
        ['R₂', fmt(R2, 1) + ' Ω'],
        ['R = R₁ + R₂', fmt(Rt, 2) + ' Ω'],
        ['I = U/R', fmt(I, 2) + ' A'],
        ['U₁ = IR₁', fmt(U1, 2) + ' V'],
        ['U₂ = IR₂', fmt(U2, 2) + ' V'],
        ['U₁ + U₂', fmt(U1 + U2, 2) + ' V'],
      ]);
      return;
    }

    /* ── ③ 并联：电压相同，电流按电阻反比分配 ─────────── */
    const x0 = w * 0.14;
    const xa = w * 0.32;
    const xb = w * 0.52;
    const yT = h * 0.28;
    const yB = h * 0.72;
    const cyB = (yT + yB) / 2;
    const Rp = (R1 * R2) / (R1 + R2);
    const I = U / Rp;
    const I1 = U / R1;
    const I2 = U / R2;
    const spd = clamp(30 + I * 16, 24, 120);

    wire(ctx, [[x0, cyB - 15], [x0, yT], [xb, yT]], pal.ink);
    wire(ctx, [[x0, cyB + 15], [x0, yB], [xb, yB]], pal.ink);
    wire(ctx, [[xa, yT], [xa, yB]], pal.ink);
    wire(ctx, [[xb, yT], [xb, yB]], pal.ink);

    // 主路（电池 → 第一个节点）与两条支路各按自己的电流定速率；
    // 上轨向右、下轨向左，两条支路向下，方向都要跟电流的实际方向对上
    flowSeg(ctx, x0, cyB - 15, x0, yT, pal.cyan, spd, T);
    flowSeg(ctx, x0, yT, xa, yT, pal.cyan, spd, T);
    flowSeg(ctx, xa, yT, xb, yT, pal.cyan, spd, T);
    flowSeg(ctx, xa, yT, xa, yB, pal.cyan, clamp(30 + I1 * 22, 20, 130), T);
    flowSeg(ctx, xb, yT, xb, yB, pal.cyan, clamp(30 + I2 * 22, 20, 130), T);
    flowSeg(ctx, xb, yB, xa, yB, pal.cyan, spd, T);
    flowSeg(ctx, xa, yB, x0, yB, pal.cyan, spd, T);
    flowSeg(ctx, x0, yB, x0, cyB + 15, pal.cyan, spd, T);

    battery(ctx, x0, cyB, pal);
    label(ctx, `U = ${fmt(U, 1)} V`, x0 + 24, cyB, pal.mut, 'left', 14);

    resBox(ctx, xa, cyB, pal, true);
    resBox(ctx, xb, cyB, pal, true);
    label(ctx, 'R₁', xa + 15, cyB - 12, pal.ink, 'left', 15);
    label(ctx, fmt(R1, 1) + ' Ω', xa + 15, cyB + 12, pal.mut, 'left', 13);
    label(ctx, 'R₂', xb + 15, cyB - 12, pal.ink, 'left', 15);
    label(ctx, fmt(R2, 1) + ' Ω', xb + 15, cyB + 12, pal.mut, 'left', 13);

    const l1 = clamp(14 + I1 * 8, 18, 58);
    const l2 = clamp(14 + I2 * 8, 18, 58);
    arrow(ctx, x0 + 24, yT, x0 + 24 + clamp(18 + I * 8, 22, 70), yT, pal.orange, 2.4);
    label(ctx, `I = ${fmt(I, 2)} A`, x0 + 24, yT - 17, pal.orange, 'left', 14);
    arrow(ctx, xa, cyB - 30 - l1, xa, cyB - 30, pal.orange, 2.2);
    label(ctx, `I₁ = ${fmt(I1, 2)} A`, xa - 10, cyB - 30 - l1 / 2, pal.orange, 'right', 13);
    arrow(ctx, xb, cyB - 30 - l2, xb, cyB - 30, pal.orange, 2.2);
    label(ctx, `I₂ = ${fmt(I2, 2)} A`, xb - 10, cyB - 30 - l2 / 2, pal.orange, 'right', 13);
    label(ctx, '两条支路电压相同，电阻小的那条电流大', x0 + 8, yB + 24, pal.faint, 'left', 13);

    /* 右栏：电流条按 1/R 分配，三根电阻条对照总电阻最小 */
    const rc = { x: w * 0.62, y: h * 0.20, w: w * 0.30, h: h * 0.56 };
    const bw = rc.w;
    const bh = 22;
    const y1 = rc.y + rc.h * 0.16;
    label(ctx, '并联：电流按电阻反比分配', rc.x, rc.y + 6, pal.ink, 'left', 15);
    splitBar(ctx, rc.x, y1, bw, bh, R2 / (R1 + R2), pal, pal.orange, pal.blue, 'I₁', 'I₂',
      fmt(I1, 2) + ' A', fmt(I2, 2) + ' A');
    label(ctx, `I = ${fmt(I, 2)} A`, rc.x + bw, y1 + bh + 16, pal.mut, 'right', 13);

    const y2 = rc.y + rc.h * 0.44;
    const kmax = Math.max(R1, R2);
    hbar(ctx, rc.x, y2, 18, (bw * R1) / kmax, pal.orange, pal, 'R₁', fmt(R1, 1) + ' Ω');
    hbar(ctx, rc.x, y2 + 30, 18, (bw * R2) / kmax, pal.blue, pal, 'R₂', fmt(R2, 1) + ' Ω');
    hbar(ctx, rc.x, y2 + 60, 18, (bw * Rp) / kmax, pal.purple, pal, 'R', fmt(Rp, 2) + ' Ω');
    label(ctx, 'R = R₁R₂/(R₁+R₂) 比两条支路都小', rc.x, y2 + 108, pal.faint, 'left', 13);

    st.readout([
      ['R₁', fmt(R1, 1) + ' Ω'],
      ['R₂', fmt(R2, 1) + ' Ω'],
      ['R = R₁R₂/(R₁+R₂)', fmt(Rp, 2) + ' Ω'],
      ['I = U/R', fmt(I, 2) + ' A'],
      ['I₁ = U/R₁', fmt(I1, 2) + ' A'],
      ['I₂ = U/R₂', fmt(I2, 2) + ' A'],
      ['I₁ + I₂', fmt(I1 + I2, 2) + ' A'],
    ]);
  }

  return { frame };
}
