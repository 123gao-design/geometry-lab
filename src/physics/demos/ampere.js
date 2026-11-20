/* 电9 安培力。四档并排看：
   ① 磁场在纸面内——匀强磁场水平向右，导线绕中点转过 θ（0°–360°），
      安培力 F = I L × B 垂直于纸面：0° < θ < 180° 时指向纸面里（⊗），
      180° < θ < 360° 时指向纸面外（⊙），大小 BIL|sinθ|，θ = 90°/270° 取最大；
   ②③ 磁场垂直纸面——导线在纸面内转过 φ，安培力落在纸面内、垂直于导线，
      大小恒为 BIL，与 φ 无关；⊗ 与 ⊙ 两档的力方向相差 180°；
   ④ 三维视角——B、I、F 三支向量画进同一幅正交投影，按住画面拖动可转视角
      （双击复原），看清 F 垂直于 B 与 I 张成的那个平面。没被拖动时视角轻轻摆一点，
      提示这一档是三维的。
   力一律由叉乘 F = I L × B 算方向，它与左手定则给出同一个结果，
   画面不再靠「约定画成某朝向」的箭头交代方向。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';
import { makeOrbit } from './orbit.js';

/** 三维叉乘：x 向右、y 向上、z 指向纸面外 */
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

/** ⊗ / ⊙ 记号：into 为真画叉（指向纸面里），否则画点（指向纸面外） */
function sym(ctx, x, y, r, into, color, bg) {
  if (bg) {
    ctx.save();
    ctx.fillStyle = bg;
    ctx.beginPath();
    ctx.arc(x, y, r + 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.stroke();
  if (into) {
    const d = r * 0.62;
    ctx.beginPath();
    ctx.moveTo(x - d, y - d);
    ctx.lineTo(x + d, y + d);
    ctx.moveTo(x + d, y - d);
    ctx.lineTo(x - d, y + d);
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(x, y, Math.max(1.5, r * 0.28), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function create(st) {
  let T = 0;

  /* 三维档的相机：默认从正前方略俯视，与原来的斜投影观感一致 */
  const orb = makeOrbit({ yaw: 0, pitch: 0.46, ylim: 1.35, pmin: 0.1, pmax: 1.2 });
  /* 只有「三维视角」这一档要转视角，其余三档是纸面内的图，按住拖动仍是平移 */
  orb.active = () => st.params.mode === 'space';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = ['in', 'out', 'space'].includes(q.mode) ? q.mode : 'plane';
    const B = clamp(fn(q.B, 0.5), 0.1, 1.5);
    const I = clamp(fn(q.I, 4), 1, 10);
    const L = clamp(fn(q.L, 0.6), 0.2, 1.2);
    const th = clamp(fn(q.th, 90), 0, 360);
    const ph = clamp(fn(q.ph, 0), 0, 180);
    const rad = (th * Math.PI) / 180;
    const prad = (ph * Math.PI) / 180;

    if (dt > 0) T += dt;
    ctx.clearRect(0, 0, w, h);

    const BLI = B * I * L;
    const sTh = Math.sin(rad);

    const ox = w * 0.30;
    const oy = h * 0.50;
    const x0 = w * 0.07;
    const x1 = w * 0.53;

    /** 导线里的自由电荷：沿电流方向匀速流动，速率随 I 变 */
    const flow = (ax, ay, bx, by, skipR) => {
      const GAPD = 26;
      const SPD = clamp(18 + I * 15, 22, 170);
      const segL = Math.hypot(bx - ax, by - ay) || 1;
      const off = (T * SPD) % GAPD;
      ctx.save();
      ctx.fillStyle = pal.sienna;
      ctx.globalAlpha = 0.85;
      for (let dd = off; dd < segL; dd += GAPD) {
        const px = ax + ((bx - ax) * dd) / segL;
        const py = ay + ((by - ay) * dd) / segL;
        if (skipR && Math.hypot(px - ox, py - oy) < skipR) continue;
        ctx.beginPath();
        ctx.arc(px, py, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    /* ── ① 磁场在纸面内：安培力垂直于纸面 ───────────── */
    if (mode === 'plane') {
      for (let k = 0; k < 4; k++) {
        const yy = h * (0.22 + 0.2 * k);
        ctx.save();
        ctx.strokeStyle = pal.mut;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.moveTo(x0, yy);
        ctx.lineTo(x1 - 10, yy);
        ctx.stroke();
        ctx.restore();
        arrow(ctx, x1 - 12, yy, x1, yy, pal.mut, 1.6);
      }
      label(ctx, `B = ${fmt(B, 2)} T（沿纸面向右）`, x0, h * 0.15, pal.mut, 'left', 14);

      // 导线：绕中点 O 转过 θ（屏幕坐标里正角朝上，所以取 −sin）
      const Lw = Math.min(w * 0.15, h * 0.20) * (0.45 + 0.55 * ((L - 0.2) / 1.0));
      const ux = Math.cos(rad);
      const uy = -Math.sin(rad);
      const ax = ox - ux * Lw;
      const ay = oy - uy * Lw;
      const bx = ox + ux * Lw;
      const by = oy + uy * Lw;

      const Fmag = BLI * Math.abs(sTh);
      const into = sTh > 0;
      const rr = clamp(7 + Fmag * 1.5, 9, 21);

      ctx.save();
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 3.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.restore();

      for (const f of [0.22, 0.78]) {
        const cx2 = ax + (bx - ax) * f;
        const cy2 = ay + (by - ay) * f;
        arrow(ctx, cx2 - ux * 8, cy2 - uy * 8, cx2 + ux * 8, cy2 + uy * 8, pal.sienna, 2.2);
      }
      label(ctx, `I = ${fmt(I, 1)} A`, bx + ux * 14, by + uy * 14, pal.sienna,
        ux >= 0 ? 'left' : 'right', 14);

      flow(ax, ay, bx, by, rr + 8);

      // 夹角 θ：从 B 的方向（+x）扫到导线，画布角度递减，anticlockwise 取 true
      const ar = Math.max(34, Lw * 0.55);
      if (th > 1 && th < 359) {
        ctx.save();
        ctx.strokeStyle = pal.purple;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(ox, oy, ar, 0, -rad, true);
        ctx.stroke();
        ctx.restore();
        const ma = -rad / 2;
        label(ctx, `θ = ${fmt(th, 0)}°`, ox + Math.cos(ma) * (ar + 26), oy + Math.sin(ma) * (ar + 22),
          pal.purple, 'center', 14);
      }

      // 安培力：垂直于纸面，用 ⊗ / ⊙ 交代方向，圆的大小交代大小
      if (Math.abs(sTh) > 0.02) {
        sym(ctx, ox, oy, rr, into, pal.indigo, pal.paper);
      } else {
        spot(ctx, ox, oy, 3, pal.alert, pal.paper);
      }

      label(ctx, '安培力垂直于纸面：⊗ 指向纸面里，⊙ 指向纸面外', x0, h * 0.84, pal.faint, 'left', 13);
      const stTxt =
        Math.abs(sTh) < 0.02
          ? '导线与磁场平行，安培力为零'
          : `此刻 F = ${fmt(Fmag, 2)} N，${into ? '⊗ 指向纸面里' : '⊙ 指向纸面外'}`;
      label(ctx, stTxt, x0, h * 0.90, pal.indigo, 'left', 14);

      /* 右栏：F 随 θ 的正弦曲线，带符号 —— 负的一半就是方向反过来 */
      const rc = { x: w * 0.60, y: h * 0.18, w: w * 0.35, h: h * 0.58 };
      const g = panel(ctx, rc, [0, 360], [-BLI * 1.1, BLI * 1.1], pal,
        { xlab: 'θ/°', ylab: 'F/N', nx: 6, ny: 4 });
      const pts = [];
      for (let a = 0; a <= 360.001; a += 1.5) pts.push([a, BLI * Math.sin((a * Math.PI) / 180)]);
      poly(ctx, g.X, g.Y, pts, pal.indigo, 2.2);
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rc.x, g.Y(0));
      ctx.lineTo(rc.x + rc.w, g.Y(0));
      ctx.stroke();
      ctx.restore();
      spot(ctx, g.X(th), g.Y(BLI * sTh), 5, pal.sienna, pal.paper);
      // 图例放在图框下面：曲线在 45°–135° 那一段贴着框顶，写在框里会被压住
      label(ctx, 'F = BIL sinθ（带符号）', rc.x + 8, rc.y + rc.h + 18, pal.indigo, 'left', 14);
      label(ctx, '上半 ⊗ 向里，下半 ⊙ 向外', rc.x + 8, rc.y + rc.h + 38, pal.faint, 'left', 13);

      st.readout([
        ['磁感应强度 B', fmt(B, 2) + ' T'],
        ['电流 I', fmt(I, 1) + ' A'],
        ['导线长度 L', fmt(L, 2) + ' m'],
        ['与磁场的夹角 θ', fmt(th, 0) + '°'],
        ['安培力大小 F = BIL|sinθ|', fmt(Fmag, 2) + ' N'],
        ['方向', Math.abs(sTh) < 0.02 ? '与磁场平行，为零' : into ? '垂直纸面向里 ⊗' : '垂直纸面向外 ⊙'],
        ['F/(BIL)', fmt(Math.abs(sTh), 3)],
        ['|sinθ|', fmt(Math.abs(sTh), 3)],
      ]);
      return;
    }

    /* ── ②③ 磁场垂直纸面：安培力落在纸面内 ─────────── */
    if (mode === 'in' || mode === 'out') {
      const into = mode === 'in';
      const bz = into ? -1 : 1;

      ctx.save();
      ctx.globalAlpha = 0.5;
      for (let gx = x0 + 18; gx < x1 - 8; gx += 36) {
        for (let gy = h * 0.16; gy < h * 0.82; gy += 36) {
          sym(ctx, gx, gy, 5, into, pal.mut);
        }
      }
      ctx.restore();
      label(ctx, `磁场 ${into ? '⊗' : '⊙'} 垂直纸面${into ? '向里' : '向外'}，B = ${fmt(B, 2)} T`,
        x0, h * 0.10, pal.mut, 'left', 14);

      const Lw = Math.min(w * 0.16, h * 0.23) * (0.5 + 0.5 * ((L - 0.2) / 1.0));
      const ux = Math.cos(prad);
      const uy = -Math.sin(prad);
      const ax = ox - ux * Lw;
      const ay = oy - uy * Lw;
      const bx = ox + ux * Lw;
      const by = oy + uy * Lw;

      // F = I L × B：屏幕坐标的 y 朝下，先换回数学坐标再换回来
      const fv = cross([ux, -uy, 0], [0, 0, bz]);
      const nl = Math.hypot(fv[0], fv[1]) || 1;
      const Fx = fv[0] / nl;
      const Fy = -fv[1] / nl;
      const F = BLI;

      ctx.save();
      ctx.strokeStyle = pal.ink;
      ctx.lineWidth = 3.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.lineTo(bx, by);
      ctx.stroke();
      ctx.restore();

      for (const f of [0.20, 0.80]) {
        const cx2 = ax + (bx - ax) * f;
        const cy2 = ay + (by - ay) * f;
        arrow(ctx, cx2 - ux * 8, cy2 - uy * 8, cx2 + ux * 8, cy2 + uy * 8, pal.sienna, 2.2);
      }
      label(ctx, `I = ${fmt(I, 1)} A`, bx + ux * 14, by + uy * 14, pal.sienna,
        ux >= 0 ? 'left' : 'right', 14);

      flow(ax, ay, bx, by, 0);

      // 安培力：大小恒为 BIL，方向垂直于导线落在纸面内
      const Fl = clamp(24 + F * 16, 26, Math.min(w * 0.16, h * 0.30));
      const fx = ox + Fx * Fl;
      const fy = oy + Fy * Fl;
      arrow(ctx, ox, oy, fx, fy, pal.indigo, 3);
      label(ctx, `F = ${fmt(F, 2)} N`, fx + Fx * 12, fy + Fy * 12, pal.indigo,
        Fx >= 0 ? 'left' : 'right', 14);

      // 力与导线的直角记号，画在 O 点的另一侧，免得压在力的箭头上
      const h2 = 11;
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ox + ux * h2, oy + uy * h2);
      ctx.lineTo(ox + ux * h2 + Fx * h2, oy + uy * h2 + Fy * h2);
      ctx.lineTo(ox + Fx * h2, oy + Fy * h2);
      ctx.stroke();
      ctx.restore();

      label(ctx, '磁场垂直纸面时，安培力落在纸面内、垂直于导线', x0, h * 0.86, pal.faint, 'left', 13);
      label(ctx, `导线转到哪个方向，力都等于 BIL = ${fmt(F, 2)} N`, x0, h * 0.92, pal.indigo, 'left', 14);

      /* 右栏：F 不随 φ 变，一条水平的直线 */
      const rc = { x: w * 0.60, y: h * 0.18, w: w * 0.35, h: h * 0.58 };
      const g = panel(ctx, rc, [0, 180], [0, BLI * 1.08], pal,
        { xlab: 'φ/°', ylab: 'F/N', nx: 6, ny: 4 });
      poly(ctx, g.X, g.Y, [[0, BLI], [180, BLI]], pal.indigo, 2.2);
      spot(ctx, g.X(ph), g.Y(BLI), 5, pal.sienna, pal.paper);
      label(ctx, 'F = BIL（三个因子都不变）', rc.x + 8, rc.y + rc.h + 18, pal.indigo, 'left', 14);
      label(ctx, '这正是 θ = 90° 时的那条最大线', rc.x + 8, rc.y + rc.h + 38, pal.faint, 'left', 13);

      st.readout([
        ['磁感应强度 B', fmt(B, 2) + ' T'],
        ['电流 I', fmt(I, 1) + ' A'],
        ['导线长度 L', fmt(L, 2) + ' m'],
        ['导线方向角 φ', fmt(ph, 0) + '°'],
        ['导线与磁场夹角', '90°（垂直）'],
        ['安培力 F = BIL', fmt(F, 2) + ' N'],
        ['F/(BIL)', '1.000'],
        ['方向', into ? '在纸面内，由 ⊗ 场定' : '在纸面内，由 ⊙ 场定'],
      ]);
      return;
    }

    /* ── ④ 三维视角：B、I、F 三支向量同框 ──────────── */
    const u3 = [Math.cos(rad), Math.sin(rad), 0];

    /* 没人拖动时轻轻摆一点视角，提示这里是三维的；一旦拖动就交还用户 */
    if (dt > 0 && !orb.touched()) {
      orb.set(0.30 * Math.sin(0.5 * T), 0.46 + 0.07 * Math.sin(0.37 * T));
    }

    const lb = 0.95;
    const li = 0.42 + 0.30 * L;
    const sProj = Math.abs(sTh);
    const lf = 0.16 + 1.00 * sProj;
    const zs = Math.sign(sTh) || 1;
    const Fw = sProj > 0.02 ? [0, 0, -zs * lf] : null;

    /* 取景：把原点、B 的端点、导线的两端、平行四边形的对角顶点（以及 F 的端点）
       投影进来取包围盒，转过任何角度都留在左栏里 */
    let lo = Infinity, hi = -Infinity, bot = Infinity, top = -Infinity;
    const take = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      if (X < lo) lo = X;
      if (X > hi) hi = X;
      if (U < bot) bot = U;
      if (U > top) top = U;
    };
    take(0, 0, 0);
    take(lb, 0, 0);
    take(u3[0] * li, u3[1] * li, 0);
    take(-u3[0] * li, -u3[1] * li, 0);
    take(lb + u3[0] * li, u3[1] * li, 0);
    if (Fw) take(Fw[0], Fw[1], Fw[2]);

    const cx3 = w * 0.27;
    const cy3 = h * 0.52;
    const s3 = Math.min(
      (w * 0.44) / Math.max(0.5, hi - lo),
      (h * 0.54) / Math.max(0.5, top - bot),
    );
    const mx = (lo + hi) / 2;
    const mz = (top + bot) / 2;
    const P3 = p => {
      const [X, U] = orb.proj(p[0], p[1], p[2]);
      return [cx3 + s3 * (X - mx), cy3 - s3 * (U - mz)];
    };

    const O = P3([0, 0, 0]);
    const PB = P3([lb, 0, 0]);
    const PI = P3([u3[0] * li, u3[1] * li, 0]);
    const PN = P3([-u3[0] * li, -u3[1] * li, 0]);
    const PC = P3([lb + u3[0] * li, u3[1] * li, 0]);
    const PF = Fw ? P3(Fw) : null;

    // 平行四边形：B 与 I 张成的那个平面
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(PB[0], PB[1]);
    ctx.lineTo(PC[0], PC[1]);
    ctx.lineTo(PI[0], PI[1]);
    ctx.stroke();
    ctx.restore();

    // 磁场
    arrow(ctx, O[0], O[1], PB[0], PB[1], pal.mut, 2.8);
    label(ctx, 'B', PB[0] + 10, PB[1] - 6, pal.mut, 'left', 15);
    // 导线与电流：整条线穿过原点，电流沿 +u
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(PN[0], PN[1]);
    ctx.lineTo(PI[0], PI[1]);
    ctx.stroke();
    ctx.restore();
    {
      const q1 = P3([u3[0] * li * 0.35, u3[1] * li * 0.35, 0]);
      const q2 = P3([u3[0] * li * 0.85, u3[1] * li * 0.85, 0]);
      arrow(ctx, q1[0], q1[1], q2[0], q2[1], pal.sienna, 2.6);
      label(ctx, 'I', PI[0] + (PI[0] - O[0]) * 0.18, PI[1] + (PI[1] - O[1]) * 0.18, pal.sienna, 'left', 15);
    }
    // 安培力
    if (PF) {
      arrow(ctx, O[0], O[1], PF[0], PF[1], pal.indigo, 3);
      label(ctx, 'F', PF[0] + 10, PF[1] - 6, pal.indigo, 'left', 15);
    }
    spot(ctx, O[0], O[1], 3.6, pal.ink, pal.paper);

    // 直角记号：F 同时垂直于 B 与 I
    const mark = (tip) => {
      const d1 = Math.hypot(tip[0] - O[0], tip[1] - O[1]) || 1;
      const u1 = [(tip[0] - O[0]) / d1, (tip[1] - O[1]) / d1];
      const d2 = Math.hypot(PF[0] - O[0], PF[1] - O[1]) || 1;
      const u2 = [(PF[0] - O[0]) / d2, (PF[1] - O[1]) / d2];
      if (Math.abs(u1[0] * u2[0] + u1[1] * u2[1]) > 0.9) return; // 投影后几乎平行，记号没法看
      const s = 10;
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(O[0] + u1[0] * s, O[1] + u1[1] * s);
      ctx.lineTo(O[0] + (u1[0] + u2[0]) * s, O[1] + (u1[1] + u2[1]) * s);
      ctx.lineTo(O[0] + u2[0] * s, O[1] + u2[1] * s);
      ctx.stroke();
      ctx.restore();
    };
    if (PF) {
      mark(PB);
      mark(PI);
    }

    label(ctx, 'F 垂直于 B 与 I 张成的平面，方向由左手定则给出', x0, h * 0.86, pal.faint, 'left', 13);
    const spTxt =
      sProj < 0.02
        ? '导线与磁场平行，安培力为零'
        : `F = ${fmt(BLI * sProj, 2)} N，${sTh > 0 ? '指进纸面（⊗）' : '指出纸面（⊙）'}`;
    label(ctx, spTxt, x0, h * 0.92, pal.indigo, 'left', 14);

    /* 右栏：|F| 随 θ 变化，90° 与 270° 两处各有一个峰 */
    const rc = { x: w * 0.60, y: h * 0.18, w: w * 0.35, h: h * 0.58 };
    const g = panel(ctx, rc, [0, 360], [0, BLI * 1.08], pal,
      { xlab: 'θ/°', ylab: 'F/N', nx: 6, ny: 4 });
    const pts = [];
    for (let a = 0; a <= 360.001; a += 1.5) pts.push([a, BLI * Math.abs(Math.sin((a * Math.PI) / 180))]);
    poly(ctx, g.X, g.Y, pts, pal.indigo, 2.2);
    spot(ctx, g.X(th), g.Y(BLI * sProj), 5, pal.sienna, pal.paper);
    label(ctx, 'F = BIL|sinθ|', rc.x + 8, rc.y + rc.h + 18, pal.indigo, 'left', 14);
    label(ctx, 'θ = 90° 与 270° 两处取最大', rc.x + 8, rc.y + rc.h + 38, pal.faint, 'left', 13);

    st.readout([
      ['磁感应强度 B', fmt(B, 2) + ' T'],
      ['电流 I', fmt(I, 1) + ' A'],
      ['导线长度 L', fmt(L, 2) + ' m'],
      ['导线与磁场夹角 θ', fmt(th, 0) + '°'],
      ['安培力 F = BIL|sinθ|', fmt(BLI * sProj, 2) + ' N'],
      ['方向', sProj < 0.02 ? '与磁场平行，为零' : sTh > 0 ? '垂直纸面向里 ⊗' : '垂直纸面向外 ⊙'],
      ['F/(BIL)', fmt(sProj, 3)],
    ]);
  }

  return { frame, orbit: orb };
}
