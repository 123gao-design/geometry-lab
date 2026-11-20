/* 电8 磁场与磁感应强度。
   两档：① 磁感线——条形磁铁两端的磁场按两个磁极叠加（B = Σ q·r/|r|³）数值积分，
        画出从 N 极出发、回到 S 极的一族曲线；小磁针放在滑块指定的位置，针身沿该点的
        磁场方向，红色一端指 N。磁场线越密的地方，小磁针受的力矩越大。
        ② 磁感应强度——一台测量装置而不是再讲一遍安培力：通电导线垂直放进匀强
        磁场，下栏摆三行试验（I 与 L 各取参照值与当前值），F 随导线变，
        而 F/(IL) 一栏三行都是同一个 B，这就是磁感应强度的定义式。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

function fieldAt(x, y, poles) {
  let bx = 0;
  let by = 0;
  for (const p of poles) {
    const dx = x - p.x;
    const dy = y - p.y;
    const d2 = dx * dx + dy * dy;
    const d = Math.sqrt(d2) || 1;
    const k = p.q / (d2 * d);
    bx += k * dx;
    by += k * dy;
  }
  return [bx, by];
}

/** 沿磁场方向积分出一条磁感线（中点法），返回点列 */
function trace(ctx, poles, sx, sy, dir, stop) {
  const pts = [[sx, sy]];
  let x = sx;
  let y = sy;
  const st = 3;
  for (let i = 0; i < 900; i++) {
    const f1 = fieldAt(x, y, poles);
    const n1 = Math.hypot(f1[0], f1[1]) || 1;
    const mxp = x + (f1[0] / n1) * st * 0.5 * dir;
    const myp = y + (f1[1] / n1) * st * 0.5 * dir;
    const f2 = fieldAt(mxp, myp, poles);
    const n2 = Math.hypot(f2[0], f2[1]) || 1;
    x += (f2[0] / n2) * st * dir;
    y += (f2[1] / n2) * st * dir;
    pts.push([x, y]);
    if (stop(x, y)) break;
  }
  return pts;
}

/** 在折线的 frac 处画一枚小箭头，交代磁感线的走向 */
function headAt(ctx, pts, frac, color) {
  const i = Math.max(1, Math.min(pts.length - 1, Math.round((pts.length - 1) * frac)));
  const a = pts[i - 1];
  const b = pts[i];
  const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
  const s = 5.5;
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(b[0], b[1]);
  ctx.lineTo(b[0] - s * Math.cos(ang - 0.45), b[1] - s * Math.sin(ang - 0.45));
  ctx.lineTo(b[0] - s * Math.cos(ang + 0.45), b[1] - s * Math.sin(ang + 0.45));
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function create(st) {
  let T = 0;

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'define' ? 'define' : 'lines';
    const B = clamp(fn(q.B, 0.5), 0.1, 1.5);
    const I = clamp(fn(q.I, 4), 1, 10);
    const L = clamp(fn(q.L, 0.6), 0.2, 1.2);
    const px = clamp(fn(q.px, 0.5), -1, 1);

    if (dt > 0) T += dt;
    ctx.clearRect(0, 0, w, h);

    /* ── ① 条形磁铁周围的磁感线 ─────────────────────── */
    if (mode === 'lines') {
      const mx = w * 0.34;
      const my = h * 0.54;
      const hl = Math.min(w * 0.11, h * 0.22);
      const ht = Math.min(h * 0.045, 26);
      const poles = [
        { x: mx + hl * 0.72, y: my, q: 1 },
        { x: mx - hl * 0.72, y: my, q: -1 },
      ];
      const inside = (x, y) => x > mx - hl - 4 && x < mx + hl + 4 && y > my - ht - 4 && y < my + ht + 4;
      const stop = (x, y) => inside(x, y) || x < 10 || x > w - 10 || y < 10 || y > h - 10;

      ctx.save();
      ctx.strokeStyle = pal.graphite;
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.75;
      const NL = 9;
      for (let i = 0; i <= NL; i++) {
        // 从 N 极出发：极角在 ±78° 内
        const a = -1.36 + (2.72 * i) / NL;
        const sx = poles[0].x + Math.cos(a) * ht * 1.5;
        const sy = poles[0].y + Math.sin(a) * ht * 1.5;
        const p1 = trace(ctx, poles, sx, sy, 1, stop);
        if (p1.length > 4) {
          ctx.beginPath();
          p1.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
          ctx.stroke();
          headAt(ctx, p1, 0.3, pal.graphite);
        }
        // 从 S 极倒着走：补上左半边的线
        const b = Math.PI - 1.36 + (2.72 * i) / NL;
        const s2x = poles[1].x + Math.cos(b) * ht * 1.5;
        const s2y = poles[1].y + Math.sin(b) * ht * 1.5;
        const p2 = trace(ctx, poles, s2x, s2y, -1, stop);
        if (p2.length > 4) {
          ctx.beginPath();
          p2.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
          ctx.stroke();
          headAt(ctx, p2, 0.72, pal.graphite);
        }
      }
      ctx.restore();

      // 磁铁本体：左半 S、右半 N
      ctx.save();
      ctx.fillStyle = pal.indigo;
      ctx.globalAlpha = 0.8;
      ctx.fillRect(mx - hl, my - ht, hl, ht * 2);
      ctx.fillStyle = pal.sienna;
      ctx.fillRect(mx, my - ht, hl, ht * 2);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(mx - hl, my - ht, hl * 2, ht * 2);
      ctx.restore();
      label(ctx, 'S', mx - hl / 2, my, '#fff', 'center', 18);
      label(ctx, 'N', mx + hl / 2, my, '#fff', 'center', 18);

      // 小磁针：位置由滑块定，针身沿该点磁场方向
      const nx = mx + px * hl * 1.55;
      const ny = my - ht - h * 0.2;
      const [bx, by] = fieldAt(nx, ny, poles);
      const ang = Math.atan2(by, bx);
      const mag = Math.hypot(bx, by);
      const ref = Math.hypot(...fieldAt(mx, my - ht - h * 0.2, poles));
      ctx.save();
      ctx.translate(nx, ny);
      ctx.rotate(ang);
      const nl = 26;
      ctx.fillStyle = pal.sienna;
      ctx.beginPath();
      ctx.moveTo(nl, 0);
      ctx.lineTo(0, -7);
      ctx.lineTo(0, 7);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = pal.indigo;
      ctx.beginPath();
      ctx.moveTo(-nl, 0);
      ctx.lineTo(0, -7);
      ctx.lineTo(0, 7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(nx, ny, 30, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      label(ctx, '小磁针', nx, ny - 42, pal.mut, 'center', 14);
      label(ctx, '磁感线越密，磁场越强', w * 0.62, h * 0.12, pal.indigo, 'left', 14);
      label(ctx, '磁铁外部：N 极出发，回到 S 极', w * 0.62, h * 0.12 + 22, pal.mut, 'left', 14);
      label(ctx, '磁铁内部：从 S 极回到 N 极', w * 0.62, h * 0.12 + 44, pal.mut, 'left', 14);
      label(ctx, '任意一点的切线方向就是该点磁场方向', w * 0.62, h * 0.12 + 66, pal.faint, 'left', 13);

      st.readout([
        ['小磁针位置（相对磁铁中心）', fmt(px * 1.55, 2) + ' 倍半长'],
        ['该点磁场方向与水平夹角', fmt((ang * 180) / Math.PI, 1) + '°'],
        ['相对强弱 |B|/B₀', fmt(mag / ref, 2)],
        ['磁感线疏密', mag / ref > 1.4 ? '密（磁场强）' : mag / ref > 0.6 ? '中' : '疏（磁场弱）'],
      ]);
      return;
    }

    /* ── ② 磁感应强度：把 F/(IL) 量出来 ─────────────────
       这一档是「测量」而不是再讲一遍安培力：下栏摆三行试验，I 与 L 各取
       一组参照值与当前值，F 随导线变，F/(IL) 一栏三行都是 B。 */
    const fx0 = w * 0.055;
    const FW = w * 0.47;
    const fx1 = fx0 + FW;
    const fy0 = h * 0.10;
    const fy1 = h * 0.58;
    const wy = h * 0.34;
    const wx0 = fx0 + FW * 0.16;
    const wx1 = wx0 + FW * 0.66 * (0.35 + 0.65 * ((L - 0.2) / 1));
    const F = B * I * L;
    const mx = (wx0 + wx1) / 2;

    // 匀强磁场：一排小叉表示垂直纸面向里
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.65;
    for (let gx = fx0 + 14; gx < fx1 - 10; gx += 30) {
      for (let gy = fy0 + 14; gy < fy1 - 10; gy += 30) {
        ctx.beginPath();
        ctx.moveTo(gx - 4, gy - 4);
        ctx.lineTo(gx + 4, gy + 4);
        ctx.moveTo(gx + 4, gy - 4);
        ctx.lineTo(gx - 4, gy + 4);
        ctx.stroke();
      }
    }
    ctx.restore();
    label(ctx, '× 表示磁场垂直纸面向里', fx0 + 2, fy0 - 8, pal.mut, 'left', 13);

    // 通电导线与电流方向
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(wx0, wy);
    ctx.lineTo(wx1, wy);
    ctx.stroke();
    ctx.restore();
    const al = Math.max(16, Math.min(40, (wx1 - wx0) * 0.45));
    arrow(ctx, wx0 + 3, wy, wx0 + 3 + al, wy, pal.sienna, 2.4);
    label(ctx, `I = ${fmt(I, 1)} A`, wx0, wy + 18, pal.sienna, 'left', 14);

    // L 的量线（挂在导线下侧，避开向上的力箭头）
    const dy = wy + 40;
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(wx0, dy);
    ctx.lineTo(wx1, dy);
    ctx.stroke();
    ctx.restore();
    arrow(ctx, mx, dy, wx0, dy, pal.mut, 1.4);
    arrow(ctx, mx, dy, wx1, dy, pal.mut, 1.4);
    label(ctx, `L = ${fmt(L, 2)} m`, mx, dy + 16, pal.mut, 'center', 14);

    // 安培力：B 垂直纸面、I 沿纸面，所以 F 落在纸面内且垂直导线，竖直向上
    const Fl = clamp(18 + F * 20, 22, Math.max(26, wy - fy0 - 30));
    arrow(ctx, mx, wy, mx, wy - Fl, pal.indigo, 3);
    label(ctx, `F = ${fmt(F, 2)} N`, mx + 9, wy - Fl - 8, pal.indigo, 'left', 14);
    label(ctx, `B = ${fmt(B, 2)} T（垂直纸面向里）`, fx0 + 2, fy1 + 16, pal.ink, 'left', 14);

    // 三行试验：I 与 L 各不相同，F 也各不相同，最后一栏三行相同
    const rowY = [h * 0.70, h * 0.76, h * 0.82, h * 0.88];
    const colX = [0, 0.16, 0.32, 0.50, 0.72].map(f => fx0 + FW * f);
    ['试验', 'I / A', 'L / m', 'F / N', 'F /(IL)'].forEach((s, i) =>
      label(ctx, s, colX[i], rowY[0], pal.mut, 'left', 13));
    [
      ['参照一', 2, 0.4, B * 2 * 0.4, pal.faint],
      ['当前', I, L, F, pal.ink],
      ['参照二', 8, 1.2, B * 8 * 1.2, pal.faint],
    ].forEach((t, k) => {
      const y = rowY[k + 1];
      label(ctx, t[0], colX[0], y, t[4], 'left', 13);
      label(ctx, fmt(t[1], 1), colX[1], y, t[4], 'left', 13);
      label(ctx, fmt(t[2], 2), colX[2], y, t[4], 'left', 13);
      label(ctx, fmt(t[3], 2), colX[3], y, t[4], 'left', 13);
      label(ctx, fmt(t[3] / (t[1] * t[2]), 2), colX[4], y, t[4], 'left', 13);
    });
    label(ctx, '最后一栏三行相同：F/(IL) 只由磁场本身决定', fx0 + 2, h * 0.945, pal.mut, 'left', 13);

    /* 右栏：F 随 I 的直线，斜率 BL */
    const rc = { x: w * 0.60, y: h * 0.16, w: w * 0.36, h: h * 0.60 };
    const iMax = 10;
    const fMax = B * iMax * L;
    const g = panel(ctx, rc, [0, iMax], [0, fMax * 1.08], pal, { xlab: 'I/A', ylab: 'F/N', nx: 5, ny: 4 });
    poly(ctx, g.X, g.Y, [[0, 0], [iMax, fMax]], pal.indigo, 2.2);
    spot(ctx, g.X(I), g.Y(F), 5, pal.sienna, pal.paper);
    // 纵轴名「F/N」占着框内左上角，图例从它下面一行起
    label(ctx, 'F = BIL', rc.x + 8, rc.y + 34, pal.indigo, 'left', 14);
    label(ctx, `斜率 = BL = ${fmt(B * L, 2)} N/A`, rc.x + 8, rc.y + 56, pal.faint, 'left', 13);

    st.readout([
      ['磁感应强度 B', fmt(B, 2) + ' T'],
      ['电流 I', fmt(I, 1) + ' A'],
      ['导线长度 L', fmt(L, 2) + ' m'],
      ['安培力 F = BIL', fmt(F, 2) + ' N'],
      ['F/(IL)', fmt(F / (I * L), 2) + ' T'],
    ]);
  }

  return { frame };
}
