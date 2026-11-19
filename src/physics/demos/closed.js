/* 电6 闭合电路欧姆定律。
   电源不只有电动势 ε，还有内阻 r。把外电阻 R 接上，电流 I = ε/(R+r)，
   路端电压 U = IR = ε − Ir，比电动势小一截。
   两档：① 路端电压——右栏画 U–I 直线，纵截距就是 ε、斜率是 −r，
        拖外电阻 R，工作点在直线上滑动；② 功率与效率——右栏上方一根总功率条
        按输出与内耗分段，下面的曲线是效率 η = R/(R+r) 随外电阻的变化。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';
import { flowPath } from './circuit.js';

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

/** 回路：电源（含内阻）在左、外电阻在右，导线上的点按电流快慢流动 */
function drawCircuit(ctx, w, h, pal, I, U, R, T) {
  const x0 = w * 0.12;
  const x1 = w * 0.46;
  const yT = h * 0.28;
  const yB = h * 0.72;
  const cyB = (yT + yB) / 2;
  const spd = clamp(28 + I * 20, 20, 130);

  const pts = [[x0, cyB - 15], [x0, yT], [x1, yT], [x1, yB], [x0, yB], [x0, cyB + 15]];
  wire(ctx, pts, pal.ink);
  flowPath(ctx, pts, pal.cyan, spd, T);

  // 电源极板：长板（正）在上、短板（负）在下
  ctx.save();
  ctx.strokeStyle = pal.orange;
  ctx.lineWidth = 3.4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x0 - 17, cyB - 15);
  ctx.lineTo(x0 + 17, cyB - 15);
  ctx.stroke();
  ctx.strokeStyle = pal.blue;
  ctx.beginPath();
  ctx.moveTo(x0 - 9, cyB + 15);
  ctx.lineTo(x0 + 9, cyB + 15);
  ctx.stroke();
  ctx.restore();
  label(ctx, '+', x0 - 26, cyB - 15, pal.orange, 'right', 16);
  label(ctx, '−', x0 - 20, cyB + 15, pal.blue, 'right', 16);

  // 内阻用虚线框圈在电源上
  ctx.save();
  ctx.strokeStyle = pal.mut;
  ctx.lineWidth = 1.2;
  ctx.setLineDash([5, 4]);
  ctx.beginPath();
  ctx.rect(x0 - 27, cyB - 30, 54, 60);
  ctx.stroke();
  ctx.restore();
  label(ctx, '内阻 r', x0, cyB + 46, pal.mut, 'center', 13);

  // 外电阻
  ctx.save();
  ctx.fillStyle = pal.bg2;
  ctx.strokeStyle = pal.ink;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.rect(x1 - 9, cyB - 23, 18, 46);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
  label(ctx, 'R', x1 + 16, cyB - 14, pal.ink, 'left', 15);
  label(ctx, fmt(R, 1) + ' Ω', x1 + 16, cyB + 12, pal.mut, 'left', 13);
  label(ctx, `U = ${fmt(U, 2)} V`, x1 - 16, cyB, pal.green, 'right', 14);
  label(ctx, '路端电压', x1 - 16, cyB + 18, pal.faint, 'right', 12);

  arrow(ctx, x0 + 34, yT, x0 + 96, yT, pal.orange, 2.4);
  label(ctx, `I = ${fmt(I, 2)} A`, x0 + 65, yT - 17, pal.orange, 'center', 14);
}

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'eff' ? 'eff' : 'vi';
    const E = clamp(fn(q.E, 6), 1.5, 12);
    const r = clamp(fn(q.r, 1), 0.5, 5);
    const R = clamp(fn(q.R, 5), 1, 20);

    const key = [mode, E, r, R].join('|');
    if (key !== last) {
      last = key;
      T = 0;
    }
    if (dt > 0) T += dt;

    ctx.clearRect(0, 0, w, h);

    const I = E / (R + r);
    const U = I * R;
    const Pt = E * I;
    const Po = U * I;
    const Pi = I * I * r;

    drawCircuit(ctx, w, h, pal, I, U, R, T);

    if (mode === 'vi') {
      /* 右栏：U = ε − Ir，纵截距 ε、斜率 −r */
      const rc = { x: w * 0.60, y: h * 0.16, w: w * 0.36, h: h * 0.62 };
      const iMax = E / r;
      const g = panel(ctx, rc, [0, iMax * 1.06], [0, E * 1.1], pal,
        { xlab: 'I/A', ylab: 'U/V', nx: 5, ny: 4 });
      poly(ctx, g.X, g.Y, [[0, E], [iMax, 0]], pal.cyan, 2.2);
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(g.X(I), g.Y(U));
      ctx.lineTo(g.X(I), g.Y(0));
      ctx.moveTo(g.X(I), g.Y(U));
      ctx.lineTo(g.X(0), g.Y(U));
      ctx.stroke();
      ctx.restore();
      spot(ctx, g.X(I), g.Y(U), 5, pal.orange, pal.bg2);
      // 纵截距处只点一枚小点；框内左上角是纵轴名 U/V，说明文字一律挪到横轴下方两行
      spot(ctx, g.X(0), g.Y(E), 4.5, pal.orange, pal.bg2);
      label(ctx, 'ε', g.X(0) + 12, g.Y(E) + 20, pal.orange, 'left', 13);
      label(ctx, 'U = ε − Ir', rc.x + 8, g.ay + 30, pal.cyan, 'left', 14);
      label(ctx, '纵截距 ε，斜率 −r', rc.x + 8, g.ay + 50, pal.faint, 'left', 13);
      label(ctx, '横截距：短路电流 ε/r', rc.x + rc.w, g.ay + 30, pal.faint, 'right', 12);

      st.readout([
        ['电动势 ε', fmt(E, 2) + ' V'],
        ['内阻 r', fmt(r, 1) + ' Ω'],
        ['外电阻 R', fmt(R, 1) + ' Ω'],
        ['电流 I = ε/(R+r)', fmt(I, 2) + ' A'],
        ['路端电压 U = IR', fmt(U, 2) + ' V'],
        ['U = ε − Ir', fmt(E - I * r, 2) + ' V'],
        ['I(R + r)', fmt(I * (R + r), 2) + ' V'],
      ]);
      return;
    }

    /* 右栏：总功率条按输出与内耗分段，下面是效率随外电阻的曲线 */
    const rc = { x: w * 0.60, y: h * 0.14, w: w * 0.36 };
    const bw = rc.w;
    const bh = 26;
    const y1 = rc.y + 52;
    const tower = Po / Pt;
    label(ctx, '电源的功率分配', rc.x, rc.y, pal.ink, 'left', 15);
    ctx.save();
    ctx.fillStyle = pal.green;
    ctx.globalAlpha = 0.5;
    ctx.fillRect(rc.x, y1, bw * tower, bh);
    ctx.fillStyle = pal.pink;
    ctx.fillRect(rc.x + bw * tower, y1, bw * (1 - tower), bh);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1;
    ctx.strokeRect(rc.x, y1, bw, bh);
    ctx.restore();
    label(ctx, `输出 ${fmt(Po, 2)} W`, rc.x, y1 - 12, pal.green, 'left', 14);
    label(ctx, `内耗 ${fmt(Pi, 2)} W`, rc.x + bw, y1 - 12, pal.pink, 'right', 14);
    label(ctx, `总功率 εI = ${fmt(Pt, 2)} W`, rc.x + bw, y1 + bh + 16, pal.mut, 'right', 13);

    const pr = { x: rc.x + 14, y: y1 + bh + 46, w: rc.w - 24, h: h * 0.34 };
    const g = panel(ctx, pr, [0, 20], [0, 1], pal, { xlab: 'R/Ω', ylab: 'η', nx: 5, ny: 4 });
    const pts = [];
    for (let rr = 0; rr <= 20.001; rr += 0.2) pts.push([rr, rr / (rr + r)]);
    poly(ctx, g.X, g.Y, pts, pal.cyan, 2.2);
    poly(ctx, g.X, g.Y, [[0, 0.5], [20, 0.5]], pal.faint, 1, [4, 4]);
    spot(ctx, g.X(R), g.Y(U / E), 5, pal.orange, pal.bg2);
    // 纵轴名 'η' 占着框内左上角，图例让到下面一行
    label(ctx, 'η = R/(R+r)', pr.x + 8, pr.y + 34, pal.cyan, 'left', 13);
    label(ctx, `η = ${fmt((U / E) * 100, 1)}%`, g.X(R), g.Y(U / E) - 14, pal.orange,
      R < 10 ? 'left' : 'right', 13);

    st.readout([
      ['电动势 ε', fmt(E, 2) + ' V'],
      ['内阻 r', fmt(r, 1) + ' Ω'],
      ['外电阻 R', fmt(R, 1) + ' Ω'],
      ['电流 I = ε/(R+r)', fmt(I, 2) + ' A'],
      ['总功率 P总 = εI', fmt(Pt, 2) + ' W'],
      ['输出功率 P出 = UI', fmt(Po, 2) + ' W'],
      ['内耗功率 P内 = I²r', fmt(Pi, 2) + ' W'],
      ['效率 η = P出/P总', fmt((Po / Pt) * 100, 1) + ' %'],
    ]);
  }

  return { frame };
}
