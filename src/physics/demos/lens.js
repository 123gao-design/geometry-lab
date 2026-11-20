/* 光3 透镜成像。
   薄透镜公式 1/u + 1/v = 1/f（实像 v > 0、虚像 v < 0），放大率 m = −v/u。
   凸透镜 f > 0、凹透镜 f < 0；物是一支竖箭头，像由三条特殊光线定出。
   左栏是光具座：物、透镜、像与三条光线，凸透镜另有 2F、2F′ 两个分界点；
   右栏画像距 v 随物距 u 的变化曲线，凸透镜在 u = f 处断开（物在焦点上，
   出射光平行、像在无穷远），u = 2f 处 v 也等于 2f——像与物等大，是放大与缩小的分界。 */
import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const conc = (q.mode || 'convex') === 'concave';
    const f0 = clamp(fn(q.f, 15), 5, 30);
    const u0 = clamp(fn(q.u, 30), 4, 90);
    const hh = clamp(fn(q.h, 3), 1, 6);
    const key = [conc ? 'c' : 'v', f0, u0, hh].join('|');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const f = conc ? -f0 : f0;
    const inf = !conc && Math.abs(u0 - f) < 0.8;      // 物落在焦点上
    const v = inf ? Infinity : (u0 * f) / (u0 - f);
    const hp = Number.isFinite(v) ? -(v / u0) * hh : 0;
    const mag = Number.isFinite(v) ? Math.abs(v / u0) : Infinity;

    // 物距落在哪一档：凸透镜的成像规律以 2f 与 f 为分界
    let rel;
    if (conc) rel = '凹透镜：恒为正立、缩小的虚像';
    else if (inf) rel = '物在焦点上，不成像';
    else if (u0 > 2 * f0 + 0.05) rel = 'u > 2f：倒立、缩小的实像';
    else if (u0 > 2 * f0 - 0.05) rel = 'u = 2f：倒立、等大的实像，像在 2F′';
    else if (u0 > f0) rel = 'f < u < 2f：倒立、放大的实像';
    else rel = 'u < f：正立、放大的虚像';

    ctx.clearRect(0, 0, w, h);

    /* ── 取景：左栏光具座，右栏小图 ─────────────── */
    const benchW = w * 0.56;
    const XL = u0 + 4;
    const XR = Math.max(
      v > 0 ? Math.min(v, 70) : 0,
      f0 * 1.5,
      8,
    ) + 4;
    const hMax = Math.max(hh, Math.min(Math.abs(hp), 3 * hh));
    const s = Math.min((benchW - 16) / (XL + XR), (h * 0.56) / (2.2 * hMax));
    const total = (XL + XR) * s;
    const px0 = (benchW - total) / 2 + XL * s;          // 透镜所在竖直线的 x
    const cy = h * 0.52;
    const PX = x => px0 + x * s;
    const PY = y => cy - y * s;

    /* ── 光轴 ───────────────────────────────────── */
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(8, cy + 0.5);
    ctx.lineTo(benchW - 6, cy + 0.5);
    ctx.stroke();
    ctx.restore();
    label(ctx, '光轴', 12, cy - 9, pal.faint, 'left', 13);

    /* ── 透镜 ───────────────────────────────────── */
    const R = clamp(Math.min(h * 0.21, (hMax + hh) * s * 0.95), 34, h * 0.33);
    const bulge = clamp(R * 0.26, 7, 24);
    ctx.save();
    ctx.beginPath();
    if (!conc) {
      ctx.moveTo(px0, cy - R);
      ctx.quadraticCurveTo(px0 + bulge, cy, px0, cy + R);
      ctx.quadraticCurveTo(px0 - bulge, cy, px0, cy - R);
    } else {
      ctx.moveTo(px0, cy - R);
      ctx.quadraticCurveTo(px0 - bulge * 1.6, cy, px0, cy + R);
      ctx.quadraticCurveTo(px0 + bulge * 1.6, cy, px0, cy - R);
    }
    ctx.closePath();
    ctx.fillStyle = pal.cyan;
    ctx.globalAlpha = 0.12;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 1.8;
    ctx.stroke();
    ctx.restore();
    label(ctx, conc ? '凹透镜' : '凸透镜', px0, cy - R - 14, pal.cyan, 'center', 14);
    spot(ctx, px0, cy, 3.2, pal.cyan, pal.bg2);
    label(ctx, 'O', px0 + 6, cy + 17, pal.faint, 'left', 13);

    /* ── 焦点 ───────────────────────────────────── */
    for (const [xf, txt] of [[-f0, 'F'], [f0, 'F′']]) {
      const xp = PX(xf);
      if (xp < 6 || xp > benchW - 6) continue;
      ctx.save();
      ctx.fillStyle = pal.mut;
      ctx.beginPath();
      ctx.arc(xp, cy, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      label(ctx, txt, xp, cy + 18, pal.mut, 'center', 13);
    }

    /* ── 二倍焦距 2F、2F′：放大与缩小的分界（仅凸透镜）──── */
    if (!conc) {
      for (const [xf, txt, above] of [[-2 * f0, '2F', false], [2 * f0, '2F′', true]]) {
        const xp = PX(xf);
        if (xp < 6 || xp > benchW - 6) continue;
        ctx.save();
        ctx.strokeStyle = pal.mut;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(xp, cy, 3.4, 0, Math.PI * 2);
        ctx.stroke();                       // 空心圈，与实心的 F、F′ 区分
        ctx.restore();
        // 左侧 2F 处物箭头朝上、实像朝下，标签放在轴下方避开两者；
        // 右侧 2F′ 处实像朝下、虚像朝上，标签放在轴上方同理
        label(ctx, txt, xp, above ? cy - 14 : cy + 18, pal.mut, 'center', 13);
      }
    }

    /* ── 三条特殊光线 ───────────────────────────── */
    const tips = [];
    const drawRay = (yLw, color, dashedBack) => {
      const Lx = px0, Ly = PY(yLw);
      const Ox = PX(-u0), Oy = PY(hh);
      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(Ox, Oy);
      ctx.lineTo(Lx, Ly);
      ctx.stroke();

      let dx = 1, dy = 0;
      if (!inf) {
        const Ix = PX(v), Iy = PY(hp);
        if (v > 0) { dx = Ix - Lx; dy = Iy - Ly; }
        else { dx = Lx - Ix; dy = Ly - Iy; }
        if (dashedBack && v < 0) {
          ctx.save();
          ctx.setLineDash([6, 5]);
          ctx.globalAlpha = 0.75;
          ctx.beginPath();
          ctx.moveTo(Lx, Ly);
          ctx.lineTo(Ix, Iy);
          ctx.stroke();
          ctx.restore();
        }
      }
      const L = Math.hypot(dx, dy) || 1;
      const t = (benchW - 8 - Lx) / (dx / L);
      const ex = Lx + (dx / L) * t;
      const ey = Ly + (dy / L) * t;
      ctx.beginPath();
      ctx.moveTo(Lx, Ly);
      ctx.lineTo(ex, ey);
      ctx.stroke();
      ctx.restore();
      tips.push([ex, ey]);
    };

    drawRay(hh, pal.blue, true);            // 平行于光轴 → 过另一侧焦点
    drawRay(0, pal.green, false);           // 过光心不改向
    if (!conc && u0 > f0 + 0.05) {
      drawRay(-hh * f0 / (u0 - f0), pal.purple, true);   // 过焦点 → 出射平行
    } else if (conc) {
      drawRay(hh * f0 / (u0 + f0), pal.purple, true);    // 指向另一侧焦点 → 出射平行
    }
    // 出射光线末端的小箭头，交代光走的方向
    for (const [ex, ey] of tips) {
      if (ex > benchW - 26) {
        ctx.save();
        ctx.fillStyle = pal.mut;
        ctx.beginPath();
        ctx.moveTo(ex - 7, ey - 4);
        ctx.lineTo(ex - 1, ey);
        ctx.lineTo(ex - 7, ey + 4);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
    }

    /* ── 物 ─────────────────────────────────────── */
    const Ox = PX(-u0), Oy = PY(hh);
    arrow(ctx, Ox, cy, Ox, Oy, pal.orange, 2.6);
    label(ctx, '物', Ox - 8, Oy - 10, pal.orange, 'right', 14);

    /* ── 像 ─────────────────────────────────────── */
    if (!inf && Number.isFinite(v)) {
      const Ix = PX(v), Iy = PY(hp);
      if (v > 0) {
        arrow(ctx, Ix, cy, Ix, Iy, pal.pink, 2.6);
        label(ctx, '实像', Ix + 8, Iy + (hp < 0 ? 16 : -10), pal.pink, 'left', 14);
      } else {
        ctx.save();
        ctx.setLineDash([6, 5]);
        ctx.strokeStyle = pal.pink;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(Ix, cy);
        ctx.lineTo(Ix, Iy);
        ctx.stroke();
        ctx.setLineDash([]);
        const dir = Iy < cy ? -1 : 1;
        ctx.fillStyle = pal.pink;
        ctx.beginPath();
        ctx.moveTo(Ix, Iy);
        ctx.lineTo(Ix - 5, Iy - dir * 10);
        ctx.lineTo(Ix + 5, Iy - dir * 10);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        label(ctx, '虚像', Ix - 8, Iy - 10, pal.pink, 'right', 14);
      }
    }
    if (inf) {
      label(ctx, '物在焦点上：出射光平行，像在无穷远', benchW * 0.5, 22, pal.mut, 'center', 13);
    } else {
      label(ctx, rel, 12, 22, pal.orange, 'left', 13);
    }

    /* ── 右栏：像距随物距的变化 ─────────────────── */
    const rc = { x: w * 0.60, y: h * 0.13, w: w * 0.36, h: h * 0.68 };
    const YV = 3 * f0;
    const g = panel(ctx, rc, [0, 100], [-YV, YV], pal, { xlab: 'u/cm', ylab: 'v/cm', nx: 5, ny: 4 });

    let seg = [];
    const segs = [];
    for (let uu = 2; uu <= 100.001; uu += 0.5) {
      const vv = (uu * f) / (uu - f);
      if (Math.abs(uu - f) < 0.06 || !Number.isFinite(vv) || Math.abs(vv) > YV * 0.99) {
        if (seg.length > 1) segs.push(seg);
        seg = [];
        continue;
      }
      seg.push([uu, vv]);
    }
    if (seg.length > 1) segs.push(seg);
    for (const sg of segs) poly(ctx, g.X, g.Y, sg, pal.blue, 1.9);

    // 渐近线：凸透镜的 u = f，凹透镜的 v = f
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    if (!conc) {
      const xa = g.X(f0);
      ctx.moveTo(xa, rc.y);
      ctx.lineTo(xa, rc.y + rc.h);
    } else {
      const ya = g.Y(f);
      ctx.moveTo(rc.x, ya);
      ctx.lineTo(rc.x + rc.w, ya);
    }
    ctx.stroke();
    ctx.restore();

    // u = 2f 与 v = 2f 两条虚线，交点 (2f, 2f) 上套一枚空心圈：像与物等大
    if (!conc) {
      const x2 = g.X(2 * f0);
      const y2 = g.Y(2 * f0);
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.purple;
      ctx.globalAlpha = 0.55;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x2, rc.y);
      ctx.lineTo(x2, rc.y + rc.h);
      ctx.moveTo(rc.x, y2);
      ctx.lineTo(rc.x + rc.w, y2);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(x2, y2, 8.5, 0, Math.PI * 2);   // 圈住橙点时不挡它（spot 的底色环半径 7.4）
      ctx.stroke();
      ctx.restore();
    }

    // 当前取值
    if (Number.isFinite(v) && Math.abs(v) <= YV) {
      spot(ctx, g.X(u0), g.Y(v), 4.4, pal.orange, pal.bg2);
      label(ctx, `u = ${fmt(u0, 0)}, v = ${fmt(v, 1)}`, g.X(u0) + 8, g.Y(v) - 12, pal.mut, 'left', 12);
    }
    label(ctx, '像距 v 随物距 u 变化', rc.x + 2, rc.y - 14, pal.mut, 'left', 13);
    if (conc) {
      label(ctx, 'v 恒为负：像总在同一侧、总是虚像', rc.x + 2, rc.y + rc.h + 18, pal.mut, 'left', 12);
    } else {
      label(ctx, '紫虚线交点 u = v = 2f：像与物等大', rc.x + 2, rc.y + rc.h + 18, pal.mut, 'left', 12);
      label(ctx, 'u < f 一侧是虚像，曲线在 u = f 处断开', rc.x + 2, rc.y + rc.h + 34, pal.mut, 'left', 12);
    }

    /* ── 读数 ───────────────────────────────────── */
    const size = mag > 1.02 ? '放大' : mag < 0.98 ? '缩小' : '等大';
    const kind = inf
      ? '物在焦点上，不成像'
      : (v > 0 ? '倒立实像' : '正立虚像') + '，' + size;
    st.readout([
      ['透镜', conc ? '凹透镜（f < 0）' : '凸透镜（f > 0）'],
      ['焦距 |f|', fmt(f0, 1) + ' cm'],
      ['物距 u', fmt(u0, 1) + ' cm'],
      ['物高 h', fmt(hh, 2) + ' cm'],
      ['像距 v', inf ? '—（∞）' : fmt(v, 2) + ' cm' + (v > 0 ? '（实）' : '（虚）')],
      ['像高 h′', inf ? '—' : fmt(hp, 2) + ' cm'],
      ['放大率 |m| = |v/u|', inf ? '—' : fmt(mag, 3)],
      ['像的性质', kind],
      ['物距所处的档', rel],
      ['2F 分界（凸透镜）', conc ? '不适用' : `u = v = 2f = ${fmt(2 * f0, 1)} cm`],
      ['1/u + 1/v', inf ? '—' : fmt(1 / u0 + 1 / v, 5)],
      ['1/f', fmt(1 / f, 5)],
      ['二倍焦距 2|f|', fmt(2 * f0, 1) + ' cm'],
    ]);
  }

  return { frame };
}
