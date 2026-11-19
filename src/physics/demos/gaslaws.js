/* 热2 气体实验定律：一只带活塞的气缸 + 右栏的图。
   三档各固定一个量——等温看 p–V 双曲线，等压看 V–T 过原点直线，等容看 p–T 过原点直线。
   演示按 1 mol 理想气体算，取 R = 0.0821 L·atm/(mol·K)：
   p 以 atm、V 以 L、T 以 K 计，于是任何状态下 pV/T 都等于同一个数 R，
   读数栏最后一行就是它——三个定律都是这一条式子在某种固定条件下的样子。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const RGAS = 0.0821;
const NMOL = 1;
const PERIOD = 10; // 一遍来回的秒数

export function create(st) {
  let last = '';
  let t = 0;
  let mols = [];

  // 分子位置用「缸内相对坐标」存，缸一变形、一改窗口都不用重新安放
  const seed = () => {
    mols = [];
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2;
      const f = 0.75 + Math.random() * 0.5;
      mols.push({
        rx: 0.05 + Math.random() * 0.9,
        ry: 0.05 + Math.random() * 0.9,
        vx: Math.cos(a) * f,
        vy: Math.sin(a) * f,
      });
    }
    t = 0;
  };

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'isobar' ? 'isobar' : q.mode === 'isochor' ? 'isochor' : 'boyle';
    const Tset = clamp(nn(q.T, 300), 200, 450);
    const pSet = clamp(nn(q.p, 1.2), 1, 2);
    const Vset = clamp(nn(q.V, 20), 14, 42);

    const key = [mode, Tset, pSet, Vset].join('|');
    if (key !== last) {
      last = key;
      seed();
    }

    if (dt > 0) t += dt;
    const u = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / PERIOD);

    // 当前状态：活塞来回走一遍，另一个量跟着定律现算
    let V, p, T;
    if (mode === 'boyle') {
      V = 14 + u * 28;
      T = Tset;
      p = (NMOL * RGAS * T) / V;
    } else if (mode === 'isobar') {
      T = 220 + u * 380;
      p = pSet;
      V = (NMOL * RGAS * T) / p;
    } else {
      T = 220 + u * 380;
      V = Vset;
      p = (NMOL * RGAS * T) / V;
    }

    ctx.clearRect(0, 0, w, h);

    // ── 左栏：气缸与活塞 ────────────────────────────────
    const L = w * 0.09;
    const Rt = w * 0.36;
    const top = h * 0.12;
    const bot = h * 0.86;
    const H = bot - top;
    const Vd = clamp(V, 10, 50);
    const chH = H * (0.24 + 0.7 * ((Vd - 10) / 40)); // 体积越大，缸内越高
    const pY = bot - chH;

    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.09;
    ctx.fillRect(L, pY, Rt - L, chH);
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(L, top);
    ctx.lineTo(L, bot);
    ctx.moveTo(Rt, top);
    ctx.lineTo(Rt, bot);
    ctx.moveTo(L - 10, bot);
    ctx.lineTo(Rt + 10, bot);
    ctx.stroke();
    ctx.restore();

    // 活塞与连杆
    ctx.save();
    ctx.fillStyle = pal.line;
    ctx.fillRect(L, pY - 9, Rt - L, 9);
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(L, pY - 9, Rt - L, 9);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo((L + Rt) / 2, pY - 9);
    ctx.lineTo((L + Rt) / 2, top);
    ctx.stroke();
    ctx.restore();

    // 缸里的分子：温度越高跑得越快，快的那几枚画成橙色
    const sp = Math.sqrt(T / 300);
    if (dt > 0) {
      for (const m of mols) {
        m.rx += m.vx * sp * 0.22 * dt;
        m.ry += m.vy * sp * 0.22 * dt;
        if (m.rx < 0.04) {
          m.rx = 0.04;
          m.vx = Math.abs(m.vx);
        } else if (m.rx > 0.96) {
          m.rx = 0.96;
          m.vx = -Math.abs(m.vx);
        }
        if (m.ry < 0.05) {
          m.ry = 0.05;
          m.vy = Math.abs(m.vy);
        } else if (m.ry > 0.95) {
          m.ry = 0.95;
          m.vy = -Math.abs(m.vy);
        }
      }
    }
    for (const m of mols) {
      const x = L + 7 + m.rx * (Rt - L - 14);
      const y = pY + 7 + m.ry * (chH - 14);
      const fast = Math.hypot(m.vx, m.vy) > 1.02;
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = fast ? pal.orange : pal.blue;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // 向上的橙箭头：缸内气体对活塞的压强，越长压强越大
    const ax = (L + Rt) / 2 + 52;
    const aLen = clamp(p * 30, 16, 84);
    arrow(ctx, ax, pY - 16, ax, pY - 16 - aLen, pal.orange, 2.5);
    label(ctx, '压强 p', ax + 8, pY - 24 - aLen / 2, pal.orange, 'left', 15);

    label(ctx, '气缸与活塞', L, top - 18, pal.mut, 'left', 14);
    label(ctx, `V = ${fmt(V, 1)} L`, L, bot + 22, pal.ink, 'left', 15);
    label(ctx, `T = ${fmt(T, 0)} K`, Rt, bot + 22, pal.ink, 'right', 15);

    // ── 右栏：随定律变化的图 ────────────────────────────
    const r = { x: w * 0.48, y: h * 0.16, w: w * 0.47, h: h * 0.66 };
    const cfg =
      mode === 'boyle'
        ? { xr: [0, 50], yr: [0, 4], xlab: 'V/L', ylab: 'p/atm', nx: 5, ny: 4 }
        : mode === 'isobar'
          ? { xr: [0, 650], yr: [0, 55], xlab: 'T/K', ylab: 'V/L', nx: 6, ny: 5 }
          : { xr: [0, 650], yr: [0, 4], xlab: 'T/K', ylab: 'p/atm', nx: 6, ny: 4 };
    const g = panel(ctx, r, cfg.xr, cfg.yr, pal, {
      xlab: cfg.xlab,
      ylab: cfg.ylab,
      nx: cfg.nx,
      ny: cfg.ny,
    });

    const pts = [];
    if (mode === 'boyle') {
      const C = NMOL * RGAS * T; // pV = C
      for (let v = Math.max(0.5, C / cfg.yr[1]); v <= cfg.xr[1] + 1e-9; v += 0.5) pts.push([v, C / v]);
    } else {
      const k = mode === 'isobar' ? (NMOL * RGAS) / p : (NMOL * RGAS) / V;
      const tm = Math.min(cfg.xr[1], cfg.yr[1] / k);
      const step = tm / 240;
      if (step > 0) for (let s = 0; s <= tm + 1e-9; s += step) pts.push([s, k * s]);
    }
    poly(ctx, g.X, g.Y, pts, pal.blue, 2.2);

    const xv = mode === 'boyle' ? V : T;
    const yv = mode === 'boyle' ? p : mode === 'isobar' ? V : p;
    poly(ctx, g.X, g.Y, [[xv, 0], [xv, yv]], pal.faint, 1.2, [4, 4]);
    poly(ctx, g.X, g.Y, [[0, yv], [xv, yv]], pal.faint, 1.2, [4, 4]);
    spot(ctx, g.X(xv), g.Y(yv), 5, pal.orange, pal.bg2);

    label(
      ctx,
      mode === 'boyle'
        ? '等温：pV = 常量，p 与 V 成反比'
        : mode === 'isobar'
          ? '等压：V 与 T 成正比，直线过原点'
          : '等容：p 与 T 成正比，直线过原点',
      r.x,
      r.y - 18,
      pal.ink,
      'left',
      15,
    );

    st.readout([
      ['体积 V', fmt(V, 1) + ' L'],
      ['压强 p', fmt(p, 2) + ' atm'],
      ['温度 T', fmt(T, 0) + ' K'],
      ['pV/T', fmt((p * V) / T, 4)],
    ]);
  }

  return { frame };
}
