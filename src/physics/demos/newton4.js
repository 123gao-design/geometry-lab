/* 演示：超重与失重。
   电梯里的物块站在体重计上，取竖直向上为正：N − mg = ma，所以 N = m(g + a)。
   a 向上（加速上升或减速下降）时 N > mg，超重；a 向下时 N < mg，失重；
   a = −g 时 N = 0，完全失重。右边的两根条把实重与视重并排放着，长度之比一目了然。
   电梯本身不做轨迹动画，滑块一动，秤的读数与两根条缓动到新值。 */

import { label, arrow, clamp, fmt } from '../gfx.js';

const G = 9.8;

export function create(st) {
  let shown = -1;   // 视重条当前显示的值（缓动用，避免拖滑块时数字跳）

  function frame(dt) {
    const p = st.params;
    const m = clamp(Number(p.m) || 2, 0.5, 5);
    const a = clamp(Number(p.a) || 0, -G, 4);
    const mg = m * G;
    const N = Math.max(0, m * (G + a));

    if (shown < 0) shown = N;
    if (dt > 0) {
      shown += (N - shown) * Math.min(1, dt * 8);
      if (Math.abs(shown - N) < 0.02) shown = N;
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const narrow = w < 640;
    const sw = narrow ? w * 0.56 : w * 0.54;
    const x0 = 26;
    const x1 = sw - 16;
    const y0 = 24;
    const y1 = h - 28;

    /* ── 电梯轿厢 ── */
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.fillStyle = pal.card;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.rect(x0, y0, x1 - x0, y1 - y0);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();
    label(ctx, '电梯轿厢', x0 + 12, y0 + 16, pal.mut, 'left', 12);

    /* 上下两根导轨，示意轿厢在井道里 */
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([3, 7]);
    ctx.lineWidth = 1;
    for (const gx of [x0, x1]) {
      ctx.beginPath();
      ctx.moveTo(gx, y0 - 12);
      ctx.lineTo(gx, y1 + 12);
      ctx.stroke();
    }
    ctx.restore();

    const cx = (x0 + x1) / 2;
    const py = y1 - 58;          // 秤台台面
    const cyP = py - 52;         // 人体中心，力的作用点

    /* 体重计：台面与读数 */
    ctx.save();
    ctx.fillStyle = pal.line;
    ctx.beginPath();
    ctx.rect(cx - 64, py, 128, 9);
    ctx.fill();
    ctx.restore();
    label(ctx, '视重 N = ' + fmt(N, 1) + ' N', cx, py + 24, pal.ink, 'center', 13);

    /* 人：头与身子 */
    ctx.save();
    ctx.fillStyle = pal.mut;
    ctx.beginPath();
    ctx.arc(cx, py - 84, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - 20, py);
    ctx.lineTo(cx - 16, py - 54);
    ctx.quadraticCurveTo(cx, py - 70, cx + 16, py - 54);
    ctx.lineTo(cx + 20, py);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    /* 两个力：支持力向上、重力向下，长度按同一把尺子量 */
    const sc = 70 / Math.max(mg, 1);
    arrow(ctx, cx + 44, cyP, cx + 44, cyP - N * sc, pal.green, 2.4);
    label(ctx, 'N = ' + fmt(N, 1) + ' N', cx + 50, clamp(cyP - N * sc, y0 + 16, y1 - 16), pal.green, 'left', 12);
    arrow(ctx, cx - 44, cyP, cx - 44, cyP + mg * sc, pal.orange, 2.4);
    label(ctx, 'mg = ' + fmt(mg, 1) + ' N', cx - 50, clamp(cyP + mg * sc, y0 + 16, y1 - 16), pal.orange, 'right', 12);

    /* 加速度：轿厢左侧一根竖直箭头，向上为正 */
    const ax = x0 + 26;
    const aLen = clamp(Math.abs(a) * 12, 0, 92);
    if (aLen > 3) {
      const up = a > 0;
      arrow(ctx, ax, cyP, ax, cyP - (up ? aLen : -aLen), pal.purple, 2.2);
      label(ctx, 'a = ' + fmt(Math.abs(a), 1) + ' m/s²', ax, cyP + (up ? -aLen - 12 : aLen + 12), pal.purple, 'center', 12);
    } else {
      label(ctx, 'a = 0', ax, cyP, pal.purple, 'center', 12);
    }

    /* ── 右：实重与视重两根条 ── */
    const bx0 = sw + 22;
    const bw = Math.max(110, w - bx0 - 26);
    const top = Math.max(56, h * 0.13);
    const vmax = Math.max(mg, N, 1) * 1.25;
    const L = v => (v / vmax) * bw;

    label(ctx, '实重与视重', bx0, top - 30, pal.ink, 'left', 13);

    const barH = 20;
    const yA = top;
    const yB = top + 76;

    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = pal.blue;
    ctx.beginPath();
    ctx.rect(bx0, yA, L(mg), barH);
    ctx.fill();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.rect(bx0, yB, L(shown), barH);
    ctx.fill();
    ctx.restore();

    label(ctx, '实重 mg', bx0, yA - 12, pal.blue, 'left', 13);
    label(ctx, fmt(mg, 1) + ' N', bx0 + L(mg) + 8, yA + barH / 2, pal.blue, 'left', 12);
    label(ctx, '视重 N', bx0, yB - 12, pal.orange, 'left', 13);
    label(ctx, fmt(shown, 1) + ' N', bx0 + L(shown) + 8, yB + barH / 2, pal.orange, 'left', 12);

    /* 实重那条的延长虚线：视重比它长还是短，一眼可比 */
    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.globalAlpha = 0.6;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(bx0 + L(mg)) + 0.5, yA - 4);
    ctx.lineTo(Math.round(bx0 + L(mg)) + 0.5, yB + barH + 6);
    ctx.stroke();
    ctx.restore();

    /* 状态 */
    const diff = N - mg;
    const state = N < 1e-6 ? '完全失重' : diff > 0.05 ? '超重' : diff < -0.05 ? '失重' : '视重 = 实重';
    const col = N < 1e-6 ? pal.purple : diff > 0.05 ? pal.orange : diff < -0.05 ? pal.green : pal.mut;
    label(ctx, state, bx0, yB + 52, col, 'left', 15);

    st.readout([
      ['质量 m', fmt(m, 1) + ' kg'],
      ['加速度 a', fmt(a, 2) + ' m/s²'],
      ['实重 mg', fmt(mg, 1) + ' N'],
      ['视重 N = m(g+a)', fmt(N, 1) + ' N'],
      ['视重 − 实重', fmt(diff, 1) + ' N'],
      ['状态', state],
    ]);
  }

  return { frame };
}
