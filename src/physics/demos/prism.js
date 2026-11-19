/* 光2 棱镜与色散。
   等边（顶角 A 可调）三棱镜，一束白光从左侧面射入，在两面各折射一次后射出。
   折射率随波长变化（柯西式 n(λ) = n + k(1/λ² − 1/589²)），紫光折射率最大、
   偏折最多，红光最小，白光因此在出射侧散成一条色带。
   右栏画偏向角 δ 随入射角 i₁ 变化的曲线（紫 / 黄绿 / 红三条），橙点标当前取值，
   曲线在第二个面发生全反射的入射角处中断。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const NL = 589;        // 钠黄光，折射率按它标定
const KD = 14255;      // 色散系数：紫与红（400 / 700 nm）的折射率相差约 0.06

/** 波长（nm）→ 折射率 */
const nOf = (wl, nD) => Math.max(1.01, nD + KD * (1 / (wl * wl) - 1 / (NL * NL)));

/** 波长 → 画面上用的颜色（近似可见光谱） */
function wlColor(wl) {
  let r = 0, g = 0, b = 0;
  if (wl < 440) { r = (440 - wl) / 60; b = 1; }
  else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
  else if (wl < 510) { g = 1; b = (510 - wl) / 20; }
  else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
  else if (wl < 645) { r = 1; g = (645 - wl) / 65; }
  else { r = 1; }
  const q = v => Math.round(255 * clamp(v, 0, 1) * 0.95);
  return `rgb(${q(r)},${q(g)},${q(b)})`;
}

const rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
const dot = (u, v) => u[0] * v[0] + u[1] * v[1];

/** 光线在界面上的折射：d 沿传播方向，n 为界面法线（朝向任意），eta = n₁/n₂；
    发生全反射时返回 null。 */
function refract(d, n, eta) {
  let nx = n[0], ny = n[1];
  let ci = -(d[0] * nx + d[1] * ny);
  if (ci < 0) { nx = -nx; ny = -ny; ci = -ci; }
  const k = 1 - eta * eta * (1 - ci * ci);
  if (k < 0) return null;
  const ct = Math.sqrt(k);
  const tx = eta * d[0] + (eta * ci - ct) * nx;
  const ty = eta * d[1] + (eta * ci - ct) * ny;
  const L = Math.hypot(tx, ty) || 1;
  return [tx / L, ty / L];
}

/** 射线 o + t·d 与线段 p→q 的交点参数（只取正向、落在段内的） */
function hitSeg(o, d, p, q) {
  const ex = q[0] - p[0], ey = q[1] - p[1];
  const den = d[0] * ey - d[1] * ex;
  if (Math.abs(den) < 1e-9) return null;
  const px = p[0] - o[0], py = p[1] - o[1];
  const t = (px * ey - py * ex) / den;
  const u = (px * d[1] - py * d[0]) / den;
  if (u < -1e-6 || u > 1 + 1e-6) return null;
  return t > 1e-4 ? t : null;
}

const ang = (u, v) => (Math.acos(clamp(Math.abs(dot(u, v)), -1, 1)) * 180) / Math.PI;

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const Ad = clamp(fn(q.A, 60), 30, 80);
    const nD = clamp(fn(q.n, 1.62), 1.35, 1.85);
    const i1d = clamp(fn(q.i1, 45), 15, 75);
    const key = [Ad, nD, i1d].join('|');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const A = (Ad * Math.PI) / 180;
    const a1 = (i1d * Math.PI) / 180;

    ctx.clearRect(0, 0, w, h);

    /* ── 三棱镜 ─────────────────────────────────── */
    const cx = w * 0.24, cy = h * 0.50;
    const b = Math.min(w * 0.135, h * 0.21);
    const ht = b / Math.tan(A / 2);
    const Ap = [cx, cy - ht / 2];
    const Bp = [cx - b, cy + ht / 2];
    const Cp = [cx + b, cy + ht / 2];
    const ctr = [(Ap[0] + Bp[0] + Cp[0]) / 3, (Ap[1] + Bp[1] + Cp[1]) / 3];
    const edgeN = (p, r) => {
      let nx = r[1] - p[1], ny = -(r[0] - p[0]);
      const L = Math.hypot(nx, ny) || 1; nx /= L; ny /= L;
      const mx = (p[0] + r[0]) / 2 - ctr[0], my = (p[1] + r[1]) / 2 - ctr[1];
      if (mx * nx + my * ny < 0) { nx = -nx; ny = -ny; }
      return [nx, ny];
    };
    const edges = [[Ap, Bp], [Bp, Cp], [Cp, Ap]];
    const nLeft = edgeN(Ap, Bp);
    const mIn = [-nLeft[0], -nLeft[1]];          // 左侧面的内法线

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(Ap[0], Ap[1]);
    ctx.lineTo(Bp[0], Bp[1]);
    ctx.lineTo(Cp[0], Cp[1]);
    ctx.closePath();
    ctx.fillStyle = pal.cyan;
    ctx.globalAlpha = 0.10;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
    label(ctx, `棱镜　顶角 A = ${fmt(Ad, 0)}°`, Ap[0], Ap[1] - 20, pal.cyan, 'center', 14);

    /* ── 入射的白光 ─────────────────────────────── */
    const P1 = [(Ap[0] + Bp[0]) / 2, (Ap[1] + Bp[1]) / 2];
    const d1 = rot(mIn, -a1);
    let Lmax = 1e9;
    if (d1[0] < -1e-6) Lmax = Math.min(Lmax, (P1[0] - 10) / -d1[0]);
    if (d1[1] < -1e-6) Lmax = Math.min(Lmax, (P1[1] - 12) / -d1[1]);
    if (d1[1] > 1e-6) Lmax = Math.min(Lmax, (h * 0.93 - P1[1]) / d1[1]);
    const Lin = Math.min(Lmax, w * 0.26);
    const S0 = [P1[0] - d1[0] * Lin, P1[1] - d1[1] * Lin];
    arrow(ctx, S0[0], S0[1], P1[0], P1[1], pal.ink, 2.6);
    label(ctx, '白光', S0[0] - 6, S0[1] - 14, pal.ink, 'left', 14);

    // 入射点的法线
    ctx.save();
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(P1[0] - nLeft[0] * 62, P1[1] - nLeft[1] * 62);
    ctx.lineTo(P1[0] + nLeft[0] * 46, P1[1] + nLeft[1] * 46);
    ctx.stroke();
    ctx.restore();

    /* ── 逐色折射 ───────────────────────────────── */
    const WLS = [400, 435, 470, 510, 550, 589, 645, 700];
    let lastExit = null, firstExit = null;
    let tir2 = false;

    for (const wl of WLS) {
      const nn = nOf(wl, nD);
      const col = wlColor(wl);
      const d2 = refract(d1, nLeft, 1 / nn);
      if (!d2) continue;
      let best = null;
      for (const [p, r] of edges) {
        const t = hitSeg(P1, d2, p, r);
        if (t != null && (!best || t < best.t)) best = { t, p, r };
      }
      if (!best) continue;
      const P2 = [P1[0] + d2[0] * best.t, P1[1] + d2[1] * best.t];
      const n2 = edgeN(best.p, best.r);
      const d3 = refract(d2, n2, nn);

      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(P1[0], P1[1]);
      ctx.lineTo(P2[0], P2[1]);
      ctx.stroke();
      ctx.restore();

      if (!d3) {
        // 第二个面上发生全反射：反射回镜内
        tir2 = true;
        const dd = dot(d2, n2);
        const dr = [d2[0] - 2 * dd * n2[0], d2[1] - 2 * dd * n2[1]];
        let b2 = null;
        for (const [p, r] of edges) {
          const t = hitSeg(P2, dr, p, r);
          if (t != null && (!b2 || t < b2)) b2 = t;
        }
        const t2 = Math.min(b2 || w * 0.1, w * 0.16);
        ctx.save();
        ctx.strokeStyle = col;
        ctx.lineWidth = 1.8;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(P2[0], P2[1]);
        ctx.lineTo(P2[0] + dr[0] * t2, P2[1] + dr[1] * t2);
        ctx.stroke();
        ctx.restore();
        continue;
      }

      let Le = w * 0.24;
      if (d3[0] > 1e-6) Le = Math.min(Le, (w * 0.52 - P2[0]) / d3[0]);
      if (d3[1] < -1e-6) Le = Math.min(Le, (P2[1] - 10) / -d3[1]);
      if (d3[1] > 1e-6) Le = Math.min(Le, (h * 0.94 - P2[1]) / d3[1]);
      Le = Math.max(Le, 20);
      const E = [P2[0] + d3[0] * Le, P2[1] + d3[1] * Le];

      ctx.save();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(P2[0], P2[1]);
      ctx.lineTo(E[0], E[1]);
      ctx.stroke();
      ctx.restore();

      if (!firstExit) firstExit = { wl, E, d3, P2, n2 };
      lastExit = { wl, E, d3, P2, n2 };
    }

    if (firstExit) {
      // 出射点法线
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(firstExit.P2[0] - firstExit.n2[0] * 30, firstExit.P2[1] - firstExit.n2[1] * 30);
      ctx.lineTo(firstExit.P2[0] + firstExit.n2[0] * 66, firstExit.P2[1] + firstExit.n2[1] * 66);
      ctx.stroke();
      ctx.restore();
    }
    if (firstExit) label(ctx, '紫', firstExit.E[0] + 8, firstExit.E[1] + 8, wlColor(400), 'left', 14);
    if (lastExit) label(ctx, '红', lastExit.E[0] + 8, lastExit.E[1] - 10, wlColor(700), 'left', 14);
    if (tir2) label(ctx, '第二个面上发生全反射', cx - b * 0.2, Cp[1] + 26, pal.pink, 'center', 13);

    /* ── 右栏：偏向角随入射角变化 ────────────────── */
    const rc = { x: w * 0.55, y: h * 0.13, w: w * 0.41, h: h * 0.70 };
    const del = (nn, i1r) => {
      const s1 = Math.sin(i1r) / nn;
      if (s1 > 1) return null;
      const r1 = Math.asin(s1);
      const s2 = nn * Math.sin(A - r1);
      if (s2 > 1) return null;
      return ((i1r + Math.asin(s2) - A) * 180) / Math.PI;
    };
    const CURVES = [
      { wl: 400, c: wlColor(400) },
      { wl: 589, c: wlColor(589) },
      { wl: 700, c: wlColor(700) },
    ];
    let ymax = 1;
    const sets = CURVES.map(kv => {
      const nn = nOf(kv.wl, nD);
      const pts = [];
      for (let i = 1; i <= 89; i++) {
        const v = del(nn, (i * Math.PI) / 180);
        if (v == null) break;
        pts.push([i, v]);
        if (v > ymax) ymax = v;
      }
      return { ...kv, pts };
    });
    ymax = Math.ceil(ymax * 1.12 / 5) * 5;

    const g = panel(ctx, rc, [0, 90], [0, ymax], pal, { xlab: 'i₁/°', ylab: 'δ/°', nx: 6, ny: 5 });
    for (const s of sets) if (s.pts.length > 1) poly(ctx, g.X, g.Y, s.pts, s.c, 1.9);
    const cur = del(nOf(589, nD), a1);
    for (const s of sets) {
      const v = del(nOf(s.wl, nD), a1);
      if (v != null) spot(ctx, g.X(i1d), g.Y(v), 4.2, s.c, pal.bg2);
    }
    if (cur != null) label(ctx, `δ = ${fmt(cur, 1)}°`, g.X(i1d) + 8, g.Y(cur) - 12, pal.mut, 'left', 12);
    label(ctx, '偏向角 δ 随入射角 i₁ 变化', rc.x + 4, rc.y - 14, pal.mut, 'left', 13);

    /* ── 读数 ───────────────────────────────────── */
    const nv = nOf(400, nD), nr = nOf(700, nD), ng = nOf(NL, nD);
    const dg = refract(d1, nLeft, 1 / ng);
    let r1out = null, i2out = null, r2out = null;
    if (dg) {
      let best = null;
      for (const [p, r] of edges) {
        const t = hitSeg(P1, dg, p, r);
        if (t != null && (!best || t < best.t)) best = { t, p, r };
      }
      if (best) {
        const n2 = edgeN(best.p, best.r);
        r1out = ang(dg, mIn);
        i2out = ang(dg, n2);
        const d3 = refract(dg, n2, ng);
        if (d3) r2out = ang(d3, n2);
      }
    }
    /* 偏向角由整条光路两端的夹角给出，紫光取 400 nm、红光取 700 nm */
    const devOf = wl => {
      const nn = nOf(wl, nD);
      const dd = refract(d1, nLeft, 1 / nn);
      if (!dd) return null;
      let best = null;
      for (const [p, r] of edges) {
        const t = hitSeg(P1, dd, p, r);
        if (t != null && (!best || t < best.t)) best = { t, p, r };
      }
      if (!best) return null;
      const n2 = edgeN(best.p, best.r);
      const d3r = refract(dd, n2, nn);
      return d3r ? ang(d1, d3r) : null;
    };
    const dV = devOf(400), dR = devOf(700), dG = devOf(NL);

    st.readout([
      ['顶角 A', fmt(Ad, 0) + '°'],
      ['黄绿光折射率 n（589 nm）', fmt(ng, 3)],
      ['紫光折射率（400 nm）', fmt(nv, 3)],
      ['红光折射率（700 nm）', fmt(nr, 3)],
      ['入射角 i₁', fmt(i1d, 1) + '°'],
      ['第一面折射角 r₁', r1out == null ? '—' : fmt(r1out, 2) + '°'],
      ['第二面入射角 i₂', i2out == null ? '—' : fmt(i2out, 2) + '°'],
      ['出射角 r₂', r2out == null ? '—（全反射）' : fmt(r2out, 2) + '°'],
      ['偏向角 δ（黄绿）', dG == null ? '—' : fmt(dG, 2) + '°'],
      ['紫 / 红偏向角', dV == null || dR == null ? '—' : fmt(dV, 2) + '° / ' + fmt(dR, 2) + '°'],
      ['色散角 Δδ', dV == null || dR == null ? '—' : fmt(dV - dR, 2) + '°'],
      ['临界角 arcsin(1/n)', fmt((Math.asin(clamp(1 / ng, 0, 1)) * 180) / Math.PI, 2) + '°'],
    ]);
  }

  return { frame };
}
