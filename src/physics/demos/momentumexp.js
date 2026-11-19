/* 实5 验证动量守恒：气垫导轨上两滑块碰撞，光电门测速。
   碰前 p = m₁v₁，碰后按弹性或完全非弹性两种情形各得一组速度，
   右栏用同一把尺子画四根动量条，前后总动量在两条虚线之间对齐。 */
import { label, arrow, clamp, fmt } from '../gfx.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const m1 = clamp(fn(q.m1, 0.2), 0.1, 0.6);
    const m2 = clamp(fn(q.m2, 0.3), 0.1, 0.6);
    const v1 = clamp(fn(q.v1, 0.6), 0.2, 1.2);
    const mode = q.mode === 'inelastic' ? 'inelastic' : 'elastic';

    const key = [m1, m2, v1, mode].join(',');
    if (key !== last) { last = key; T = 0; }
    T = dt > 0 ? T + dt : T;

    ctx.clearRect(0, 0, w, h);

    // 碰后速度
    let u1, u2;
    if (mode === 'elastic') {
      u1 = ((m1 - m2) / (m1 + m2)) * v1;
      u2 = ((2 * m1) / (m1 + m2)) * v1;
    } else {
      u1 = u2 = (m1 * v1) / (m1 + m2);
    }

    const xA0 = 0.16, xC = 1.2, XL = 1.78;
    const tc = (xC - xA0) / v1;
    const cycle = tc + 1.35 + 0.85;
    const tt = T % cycle;

    let xa, xb;
    if (tt <= tc) {
      xa = xA0 + v1 * tt;
      xb = xC;
    } else {
      const s = tt - tc;
      xa = xC + u1 * s;
      xb = xC + u2 * s;
    }
    const touched = tt >= tc;

    // 轨道
    const x0 = w * 0.06, x1 = w * 0.54;
    const sx = (x1 - x0) / 1.9;
    const X = m => x0 + m * sx;
    const trackY = h * 0.46;

    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x0 - 8, trackY);
    ctx.lineTo(x1 + 10, trackY);
    ctx.stroke();
    ctx.restore();
    label(ctx, '气垫导轨', x0, trackY + 30, pal.mut, 'left', 12);

    // 光电门
    for (const gx of [0.55, 1.55]) {
      const gpx = X(gx);
      ctx.save();
      ctx.strokeStyle = pal.cyan;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(gpx, trackY - 52);
      ctx.lineTo(gpx, trackY - 2);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.fillStyle = pal.cyan;
      ctx.globalAlpha = 0.85;
      rr(ctx, gpx - 9, trackY - 66, 18, 12, 3);
      ctx.fill();
      ctx.restore();
    }
    label(ctx, '光电门', X(0.55), trackY - 76, pal.cyan, 'center', 12);

    // 滑块
    const gliderAt = (xm, m, col, tag, vv) => {
      const bw = 26 + m * 46, bh = 24;
      const px = X(clamp(xm, 0.02, 1.86));
      ctx.save();
      ctx.fillStyle = col;
      ctx.globalAlpha = 0.85;
      rr(ctx, px - bw / 2, trackY - bh, bw, bh, 5);
      ctx.fill();
      ctx.restore();
      label(ctx, tag, px, trackY - bh / 2 + 4, '#fff', 'center', 12);
      return px;
    };
    const pa = gliderAt(xa, m1, pal.blue, 'A', v1);
    const pb = gliderAt(xb, m2, pal.pink, 'B', v1);

    // 速度箭头
    const arrowLen = vv => clamp(Math.abs(vv) * 70, 14, 76);
    const vA = touched ? u1 : v1;
    if (Math.abs(vA) > 0.02) {
      arrow(ctx, pa, trackY - 42, pa + arrowLen(vA) * Math.sign(vA), trackY - 42, pal.green, 2.2);
      label(ctx, touched ? "v₁′" : 'v₁', pa, trackY - 52, pal.green, 'center', 12);
    }
    if (touched && Math.abs(u2) > 0.02) {
      arrow(ctx, pb, trackY - 42, pb + arrowLen(u2), trackY - 42, pal.green, 2.2);
      label(ctx, 'v₂′', pb + 16, trackY - 52, pal.green, 'center', 12);
    }

    // 右栏动量条
    const bx = w * 0.635, bw0 = w * 0.22;
    const pMax = Math.max(m1 * v1, m2 * u2, m1 * Math.abs(u1), 0.02) * 1.05;
    const pBef = m1 * v1;
    const pAft = m1 * u1 + m2 * u2;

    label(ctx, '动量 p = mv / (kg·m/s)', bx, h * 0.14, pal.mut, 'left', 13);

    const rows = [
      ['碰前 A', m1 * v1, pal.blue],
      ['碰前 B', 0, pal.pink],
      ['碰后 A', m1 * u1, pal.blue],
      ['碰后 B', m2 * u2, pal.pink],
    ];
    rows.forEach((r, i) => {
      const y = h * 0.22 + i * h * 0.13;
      label(ctx, r[0], bx - 6, y + 5, pal.mut, 'right', 12);
      const len = (Math.abs(r[1]) / pMax) * bw0;
      ctx.save();
      ctx.fillStyle = r[2];
      ctx.globalAlpha = i < 2 ? 0.45 : 0.85;
      rr(ctx, bx, y - 9, Math.max(2, len), 18, 4);
      ctx.fill();
      ctx.restore();
      label(ctx, fmt(r[1], 3), bx + Math.max(2, len) + 6, y + 5, pal.ink, 'left', 12);
    });

    // 总动量两条虚线
    const yTot = h * 0.82;
    label(ctx, '总动量', bx - 6, yTot + 5, pal.mut, 'right', 12);
    for (const [v, col, dash] of [[pBef, pal.green, []], [pAft, pal.orange, [5, 4]]]) {
      const len = (v / pMax) * bw0;
      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.6;
      ctx.setLineDash(dash);
      ctx.beginPath();
      ctx.moveTo(bx, yTot + (v === pBef ? -11 : 11));
      ctx.lineTo(bx + len, yTot + (v === pBef ? -11 : 11));
      ctx.stroke();
      ctx.restore();
    }
    label(ctx, `碰前 ${fmt(pBef, 3)}`, bx, yTot - 20, pal.green, 'left', 12);
    label(ctx, `碰后 ${fmt(pAft, 3)}`, bx, yTot + 32, pal.orange, 'left', 12);
    label(ctx, mode === 'elastic' ? '弹性碰撞' : '完全非弹性', w - 14, h * 0.10, pal.purple, 'right', 12);

    const dEk = 0.5 * m1 * v1 * v1 - (0.5 * m1 * u1 * u1 + 0.5 * m2 * u2 * u2);

    st.readout([
      ['A 的质量 m₁', fmt(m1, 2) + ' kg'],
      ['B 的质量 m₂', fmt(m2, 2) + ' kg'],
      ['碰前 A 的速度', fmt(v1, 2) + ' m/s'],
      ['碰后 A、B 速度', fmt(u1, 2) + ' 、 ' + fmt(u2, 2) + ' m/s'],
      ['碰前总动量', fmt(pBef, 3) + ' kg·m/s'],
      ['碰后总动量', fmt(pAft, 3) + ' kg·m/s'],
      ['两者之差', fmt(pAft - pBef, 3) + ' kg·m/s'],
      ['动能损失', fmt(Math.max(0, dEk), 3) + ' J'],
      ['判定', mode === 'elastic' ? '动量守恒，动能也守恒' : '动量守恒，动能减少'],
    ]);
  }

  return { frame };
}
