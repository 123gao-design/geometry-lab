/* 电2 电场强度与电场线。
   三档：① 点电荷——电荷 Q 在左，试探点 P 在距离 r 处，E = kQ/r² 沿连线，
        正电荷向外、负电荷向内；右栏画 E 随 r 的曲线，读数栏 E·r² 拖距离时不变。
        场线上有光点沿电场方向流动：正电荷向外、负电荷向内，越靠近电荷走得越快
        （dr/dt ∝ 1/r²，等价于 r ∝ t^{1/3}），把「场线疏密即场强」画成流动的快慢。
        ② 等量异种电荷——两电荷之间的场线按电场方向数值积分，从正电荷出发、
        负电荷收尾；每条线上同样有光点从正电荷流向负电荷，途径场强越大走得越快；
        中点场强 E = 2kQ/(d/2)²，右栏画它随 d 的变化。
        ③ 匀强电场——两块平行极板之间一族等间距的平行场线，光点处处同速前进；
        E = U/d，右栏在 U 固定时画 E 随 d 的反比曲线，读数栏的 E·d 一行始终等于
        板间电压 U——场强与电势差的关系就落在这格上。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const K = 9e9;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = n => String(n).split('').map(c => (c === '-' ? '⁻' : SUP[+c])).join('');

/** 场强写成 6.8×10⁵ 的形状 */
function sci(v) {
  if (!Number.isFinite(v) || v === 0) return '0';
  const [mb, ex] = v.toExponential(1).split('e');
  return mb + '×10' + sup(Number(ex));
}

function topOf(v) {
  if (!(v > 0) || !Number.isFinite(v)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return p * (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10);
}

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'dipole' ? 'dipole' : q.mode === 'uniform' ? 'uniform' : 'single';
    const Q = clamp(fn(q.Q, 3), -5, 5);
    const r = clamp(fn(q.r, 0.2), 0.1, 0.6);
    const d = clamp(fn(q.d, 0.3), 0.2, 0.6);
    const Uu = clamp(fn(q.Uu, 200), 20, 400);
    const du = clamp(fn(q.du, 0.1), 0.02, 0.2);

    const key = [mode, Q, r, d, Uu, du].join('|');
    if (key !== last) {
      last = key;
      T = 0;
    }
    if (dt > 0) T += dt;

    ctx.clearRect(0, 0, w, h);

    /* ── 匀强电场：两块平行极板之间 ───────────────────── */
    if (mode === 'uniform') {
      const xL = w * 0.09;
      const xR = w * 0.45;
      const yT = h * 0.24;
      const yB = h * 0.82;
      const cy = (yT + yB) / 2;
      const E = Uu / du;

      // 两块极板：左正右负
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = 0.9;
      ctx.fillRect(xL - 5, yT, 5, yB - yT);
      ctx.fillStyle = pal.blue;
      ctx.fillRect(xR, yT, 5, yB - yT);
      ctx.globalAlpha = 1;
      ctx.restore();
      label(ctx, '+', xL - 16, yT + 4, pal.orange, 'center', 20);
      label(ctx, '−', xR + 10, yT + 4, pal.blue, 'center', 20);
      label(ctx, `U = ${fmt(Uu, 0)} V`, (xL + xR) / 2, yT - 16, pal.ink, 'center', 15);
      label(ctx, `d = ${fmt(du * 100, 0)} cm`, (xL + xR) / 2, yB + 20, pal.mut, 'center', 14);

      // 等间距的平行场线；线上光点同速前进，这就是「匀强」的读法
      const NL = 7;
      for (let i = 0; i < NL; i++) {
        const yy = yT + 16 + ((yB - yT - 32) * i) / (NL - 1);
        arrow(ctx, xL + 2, yy, xR - 2, yy, pal.mut, 1.3);
        const u = (T * 0.3 + i * 0.13) % 1;
        ctx.save();
        ctx.globalAlpha = 0.25 + 0.62 * Math.sin(Math.PI * u);
        ctx.fillStyle = pal.cyan;
        ctx.beginPath();
        ctx.arc(xL + 6 + u * (xR - xL - 12), yy, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // P 点与场强箭头：换到板间任何一处，箭头都同长同向
      const px = (xL + xR) / 2;
      const py = cy;
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'P', px - 14, py - 12, pal.purple, 'center', 14);
      arrow(ctx, px + 6, py, px + 52, py, pal.purple, 2.6);
      label(ctx, 'E', px + 58, py - 14, pal.purple, 'left', 15);

      label(ctx, '匀强电场：场线等间距、方向一致，光点同速前进', w * 0.05, h * 0.13, pal.mut, 'left', 14);

      /* ── 右栏：U 固定时 E 随 d 的曲线 ──────────────── */
      const rc = { x: w * 0.56, y: h * 0.16, w: w * 0.4, h: h * 0.64 };
      const yTop = topOf(Uu / 0.02);
      const g = panel(ctx, rc, [0.02, 0.2], [0, yTop], pal, { xlab: 'd/m', ylab: 'E', nx: 5, ny: 4 });
      const pts = [];
      const d0 = Math.max(0.02, Uu / yTop);
      for (let dd = d0; dd <= 0.2001; dd += 0.002) pts.push([dd, Uu / dd]);
      poly(ctx, g.X, g.Y, pts, pal.purple, 2.2);
      spot(ctx, g.X(du), g.Y(E), 5, pal.orange, pal.bg2);
      label(ctx, 'E = U/d（U 固定）', rc.x + 8, rc.y + 15, pal.purple, 'left', 14);
      label(ctx, '板距加倍，场强减半', rc.x + 8, rc.y + 36, pal.faint, 'left', 13);

      st.readout([
        ['两板电压 U', fmt(Uu, 0) + ' V'],
        ['板间距 d', fmt(du * 100, 1) + ' cm'],
        ['场强 E = U/d', sci(E) + ' V/m'],
        ['方向', '由正极板指向负极板'],
        ['E·d（即板间电压）', sci(E * du) + ' V'],
        ['光点行进速率', '处处相同'],
        ['板间场强', '大小与方向处处一致'],
      ]);
      return;
    }

    if (mode === 'single') {
      const qx = w * 0.14;
      const qy = h * 0.46;
      const CR = Math.min(w * 0.03, h * 0.06);
      const px = qx + w * 0.08 + ((r - 0.1) / 0.5) * w * 0.22;
      const E = (K * Math.abs(Q) * 1e-6) / (r * r);

      // 场线：从电荷表面向四面发散的短射线，正电荷朝外、负电荷朝里
      const NL = 12;
      const rad0 = CR + 3;
      const rad1 = CR + w * 0.1;
      const c0 = rad0 * rad0 * rad0;
      const c1 = rad1 * rad1 * rad1;
      for (let i = 0; i < NL; i++) {
        const a = (i / NL) * Math.PI * 2 + 0.26;
        const ax = qx + Math.cos(a) * rad0;
        const ay = qy + Math.sin(a) * rad0;
        const bx = qx + Math.cos(a) * rad1;
        const by = qy + Math.sin(a) * rad1;
        ctx.save();
        ctx.strokeStyle = pal.mut;
        ctx.globalAlpha = 0.45;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(qx + Math.cos(a) * CR, qy + Math.sin(a) * CR);
        ctx.lineTo(bx, by);
        ctx.stroke();
        ctx.restore();
        if (Q > 0) arrow(ctx, ax, ay, bx, by, pal.mut, 1.2);
        else arrow(ctx, bx, by, ax, ay, pal.mut, 1.2);
      }

      // 流动的光点：r³ 随时间线性增大，于是 dr/dt ∝ 1/r²
      if (Q !== 0) {
        for (let i = 0; i < NL; i++) {
          const a = (i / NL) * Math.PI * 2 + 0.26;
          for (let k = 0; k < 2; k++) {
            let u = (T * 0.42 + i * 0.083 + k * 0.5) % 1;
            if (Q < 0) u = 1 - u; // 负电荷收场：光点朝里走
            const rr = Math.cbrt(c0 + u * (c1 - c0));
            const dx = qx + Math.cos(a) * rr;
            const dy = qy + Math.sin(a) * rr;
            ctx.save();
            ctx.globalAlpha = 0.2 + 0.62 * Math.sin(Math.PI * u);
            ctx.fillStyle = pal.cyan;
            ctx.beginPath();
            ctx.arc(dx, dy, 2.6, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
        }
      }

      // 电荷
      ctx.beginPath();
      ctx.arc(qx, qy, CR, 0, Math.PI * 2);
      ctx.fillStyle = Q >= 0 ? pal.orange : pal.blue;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      label(ctx, Q >= 0 ? '+' : '−', qx, qy, pal.ink, 'center', Math.round(CR * 1.1));
      label(ctx, `Q = ${fmt(Q, 1)} μC`, qx, qy - CR - 16, pal.ink, 'center', 15);

      // 电荷到试探点的连线
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.moveTo(qx + CR, qy);
      ctx.lineTo(px, qy);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      label(ctx, `r = ${fmt(r * 100, 0)} cm`, (qx + px) / 2, qy + 18, pal.mut, 'center', 14);

      // 试探点与场强箭头
      const EL = clamp(18 + 46 * Math.sqrt(E / (K * 5e-6 / 0.01)), 18, 72);
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, qy, 5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
      label(ctx, 'P', px, qy - 14, pal.purple, 'center', 14);
      if (Q > 0) arrow(ctx, px + 6, qy, px + 6 + EL, qy, pal.purple, 2.6);
      else if (Q < 0) arrow(ctx, px - 6, qy, px - 6 - EL, qy, pal.purple, 2.6);
      if (Q !== 0) label(ctx, 'E', px + (Q > 0 ? 10 + EL : -10 - EL), qy - 16, pal.purple, Q > 0 ? 'left' : 'right', 15);

      label(ctx, '光点沿场线流动，越靠近电荷走得越快', w * 0.05, h * 0.13, pal.mut, 'left', 14);

      /* ── 右栏：E 随 r 的曲线 ────────────────────────── */
      const rc = { x: w * 0.56, y: h * 0.16, w: w * 0.4, h: h * 0.64 };
      const yTop = topOf((K * Math.abs(Q) * 1e-6) / 0.01);
      const g = panel(ctx, rc, [0.1, 0.6], [0, yTop], pal, { xlab: 'r/m', ylab: 'E', nx: 5, ny: 4 });
      const C = K * Math.abs(Q) * 1e-6;
      const pts = [];
      const r0 = Math.max(0.1, Math.sqrt(C / yTop));
      for (let rr = r0; rr <= 0.6001; rr += 0.002) pts.push([rr, C / (rr * rr)]);
      poly(ctx, g.X, g.Y, pts, pal.purple, 2.2);
      if (Q !== 0) spot(ctx, g.X(r), g.Y(E), 5, pal.orange, pal.bg2);
      label(ctx, 'E = kQ/r²', rc.x + 8, rc.y + 15, pal.purple, 'left', 14);
      label(ctx, '距离加倍，场强减到四分之一', rc.x + 8, rc.y + 36, pal.faint, 'left', 13);

      st.readout([
        ['电荷量 Q', fmt(Q, 1) + ' μC'],
        ['距离 r', fmt(r * 100, 1) + ' cm'],
        ['场强 E', sci(E) + ' N/C'],
        ['方向', Q > 0 ? '背离正电荷' : Q < 0 ? '指向负电荷' : '无'],
        ['E·r²', sci(E * r * r) + ' N·m²/C'],
        ['k', '9.0×10⁹ N·m²/C²'],
      ]);
      return;
    }

    /* ── 等量异种电荷的场线 ───────────────────────────── */
    const half = w * 0.07 + ((d - 0.2) / 0.4) * w * 0.08;
    const cx = w * 0.27;
    const cy = h * 0.46;
    const CR = Math.min(w * 0.028, h * 0.055);
    const charges = [
      { x: cx - half, y: cy, q: Q === 0 ? 1 : Math.sign(Q), r: CR },
      { x: cx + half, y: cy, q: Q === 0 ? -1 : -Math.sign(Q), r: CR },
    ];
    const Emid = (8 * K * Math.abs(Q) * 1e-6) / (d * d);

    const dirAt = (x, y) => {
      let ex = 0;
      let ey = 0;
      for (const c of charges) {
        const dx = x - c.x;
        const dy = y - c.y;
        const d2 = Math.max(9, dx * dx + dy * dy);
        const kk = c.q / (d2 * Math.sqrt(d2));
        ex += kk * dx;
        ey += kk * dy;
      }
      const L = Math.hypot(ex, ey) || 1;
      return [ex / L, ey / L, L];
    };

    const pos = charges.find(c => c.q > 0);
    const neg = charges.find(c => c.q < 0);
    const seeds = 14;
    for (let i = 0; i < seeds; i++) {
      const a = (i / seeds) * Math.PI * 2 + 0.16;
      let x = pos.x + Math.cos(a) * (CR + 2);
      let y = pos.y + Math.sin(a) * (CR + 2);
      const pts = [[x, y]];
      const cum = [0]; // 逐点累计「行进时间」∝ Σ 步长/|E|
      let mid = null;
      for (let n = 0; n < 900; n++) {
        const [ux, uy, mag] = dirAt(x, y);
        x += ux * 2.2;
        y += uy * 2.2;
        pts.push([x, y]);
        cum.push(cum[cum.length - 1] + 2.2 / mag);
        if (!mid && n === 70) mid = [x, y, ux, uy];
        if (x < 3 || x > w * 0.5 || y < 3 || y > h - 3) break;
        if (Math.hypot(x - neg.x, y - neg.y) < CR + 3) break;
      }
      ctx.save();
      ctx.strokeStyle = pal.mut;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      pts.forEach((p, j) => (j ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.stroke();
      ctx.restore();
      if (mid && mid[0] < w * 0.5) arrow(ctx, mid[0], mid[1], mid[0] + mid[2] * 9, mid[1] + mid[3] * 9, pal.mut, 1.2);

      // 光点：按累计时间取位置，场强越大走得越快
      if (Q !== 0 && pts.length > 6) {
        const total = cum[cum.length - 1];
        for (let k = 0; k < 2; k++) {
          const frac = (T * 0.16 + i * 0.071 + k * 0.5) % 1;
          const target = frac * total;
          let j = 1;
          while (j < cum.length - 1 && cum[j] < target) j++;
          const seg = cum[j] - cum[j - 1] || 1;
          const t = (target - cum[j - 1]) / seg;
          const dx = pts[j - 1][0] + (pts[j][0] - pts[j - 1][0]) * t;
          const dy = pts[j - 1][1] + (pts[j][1] - pts[j - 1][1]) * t;
          ctx.save();
          ctx.globalAlpha = 0.2 + 0.62 * Math.sin(Math.PI * frac);
          ctx.fillStyle = pal.cyan;
          ctx.beginPath();
          ctx.arc(dx, dy, 2.6, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }
    }

    for (const c of charges) {
      ctx.beginPath();
      ctx.arc(c.x, c.y, CR, 0, Math.PI * 2);
      ctx.fillStyle = c.q > 0 ? pal.orange : pal.blue;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
      label(ctx, c.q > 0 ? '+' : '−', c.x, c.y, pal.ink, 'center', Math.round(CR * 1.1));
    }
    label(ctx, '等量异种电荷：场线从正电荷出发，终止于负电荷', w * 0.05, h * 0.13, pal.mut, 'left', 14);

    // 中点场强
    const mL = clamp(14 + 40 * Math.sqrt(Emid / ((8 * K * 5e-6) / 0.04)), 14, 60);
    arrow(ctx, cx + 3, cy, cx + 3 + mL, cy, pal.purple, 2.6);
    label(ctx, 'E', cx + 6 + mL, cy - 16, pal.purple, 'left', 15);
    label(ctx, `d = ${fmt(d * 100, 0)} cm`, cx, cy - CR - 18, pal.mut, 'center', 14);

    /* ── 右栏：中点场强随间距的变化 ──────────────────── */
    const rc = { x: w * 0.56, y: h * 0.16, w: w * 0.4, h: h * 0.64 };
    const yTop = topOf((8 * K * Math.abs(Q) * 1e-6) / 0.04);
    const g = panel(ctx, rc, [0.2, 0.6], [0, yTop], pal, { xlab: 'd/m', ylab: 'E', nx: 5, ny: 4 });
    const pts = [];
    const d0 = Math.max(0.2, Math.sqrt((8 * K * Math.abs(Q) * 1e-6) / yTop));
    for (let dd = d0; dd <= 0.6001; dd += 0.002) pts.push([dd, (8 * K * Math.abs(Q) * 1e-6) / (dd * dd)]);
    poly(ctx, g.X, g.Y, pts, pal.purple, 2.2);
    if (Q !== 0) spot(ctx, g.X(d), g.Y(Emid), 5, pal.orange, pal.bg2);
    label(ctx, 'E中 = 8kQ/d²', rc.x + 8, rc.y + 15, pal.purple, 'left', 14);
    label(ctx, '两电荷越远，中点越弱', rc.x + 8, rc.y + 36, pal.faint, 'left', 13);

    st.readout([
      ['电荷量 Q', fmt(Math.abs(Q), 1) + ' μC'],
      ['两电荷间距 d', fmt(d * 100, 1) + ' cm'],
      ['中点场强 E', sci(Emid) + ' N/C'],
      ['方向', '由正电荷指向负电荷'],
      ['E·d²', sci(Emid * d * d) + ' N·m²/C'],
      ['k', '9.0×10⁹ N·m²/C²'],
    ]);
  }

  return { frame };
}
