/* 振2 单摆。按 mode 分成两块单画面的板，各挂到用到它的那一节：
   force —— 单摆的受力：橙 mg、蓝 F拉、紫 F（重力沿切线的分力），
            两侧虚线把重力分解成沿绳的 mg cosθ 与沿切线的 mg sinθ；
   curve —— θ–t 曲线：左边小摆跟着走，右边余弦线，±θ₀ 虚线与 t = T 竖线。
   模型 θ = θ₀ cos(ωt)、ω = √(g/L)、T = 2π√(L/g)，与摆球质量无关。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const D2R = Math.PI / 180;
const TMAX = 6; // θ–t 图的时间窗（秒）

export function create(st) {
  let last = '';
  let t = 0;
  let hold = 0;
  const reset = () => {
    t = 0;
    hold = 0;
  };

  /* 摆的几何：悬点在面板上方正中，摆线随摆长 L 画长画短（不是等比定标） */
  function pendGeom(r, th, L) {
    const px = r.x + r.w * 0.5;
    const py = r.y + r.h * 0.07;
    const R = clamp(r.h * (0.26 + (0.44 * (L - 0.3)) / 1.7), r.h * 0.18, r.h * 0.66);
    const bobR = clamp(r.h * 0.030, 9, 20);
    const bx = px + R * Math.sin(th);
    const by = py + R * Math.cos(th);
    return { px, py, R, bobR, bx, by };
  }

  /* 支架、竖直参考线、摆角弧、摆线、摆球 */
  function pendBody(ctx, pal, g, th) {
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(g.px - 46, g.py);
    ctx.lineTo(g.px + 46, g.py);
    ctx.stroke();

    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(g.px, g.py);
    ctx.lineTo(g.px, g.py + g.R + g.bobR * 2);
    ctx.stroke();
    ctx.restore();

    const ar = Math.max(g.R * 0.38, g.bobR + 24);
    if (Math.abs(th) > 0.03) {
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(g.px, g.py, ar, Math.PI / 2, Math.PI / 2 - th, th > 0);
      ctx.stroke();
      const mid = Math.PI / 2 - th / 2;
      label(ctx, 'θ', g.px + (ar + 14) * Math.cos(mid), g.py + (ar + 14) * Math.sin(mid), pal.green, 'center', 14);
    }

    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(g.px, g.py);
    ctx.lineTo(g.bx, g.by);
    ctx.stroke();
    spot(ctx, g.bx, g.by, g.bobR, pal.blue, pal.ink);
  }

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const L = clamp(nn(q.L, 1), 0.3, 2);
    const m = clamp(nn(q.m, 0.2), 0.1, 1);
    const th0 = clamp(nn(q.th0, 12), 4, 30) * D2R;
    const g = clamp(nn(q.g, 9.8), 4, 15);
    const om = Math.sqrt(g / L);
    const T = (2 * Math.PI) / om;

    const key = [q.mode, L, m, th0, g].join('|');
    if (key !== last) {
      last = key;
      reset();
    }
    if (dt > 0) {
      if (t < TMAX) t = Math.min(TMAX, t + dt);
      else {
        hold += dt;
        if (hold > 0.9) reset();
      }
    }

    const th = th0 * Math.cos(om * t);
    const v = -th0 * om * Math.sin(om * t) * L; // 线速度，正为 θ 增大方向
    const F = -m * g * Math.sin(th); // 回复力（重力沿切线的分力）
    const Tn = m * (g * Math.cos(th) + (v * v) / L); // 绳的拉力

    const mode = q.mode === 'curve' ? 'curve' : 'force';
    ctx.clearRect(0, 0, w, h);

    if (mode === 'force') {
      /* ── 单摆的受力 ── */
      const r = { x: w * 0.04, y: h * 0.05, w: w * 0.92, h: h * 0.88 };
      const G = pendGeom(r, th, L);
      const sx = Math.sin(th);
      const cy = Math.cos(th);
      const ux = sx;                 // 沿绳背离悬点
      const uy = cy;
      const tx = cy;                 // 沿切线、θ 增大方向
      const ty = -sx;
      const Wlen = clamp(Math.min(r.h * 0.20, G.R * 0.9), 40, 120);
      const A = { x: G.bx + ux * Wlen * cy, y: G.by + uy * Wlen * cy };
      const W = { x: G.bx, y: G.by + Wlen };
      const C = { x: G.bx - tx * Wlen * sx, y: G.by - ty * Wlen * sx };

      pendBody(ctx, pal, G, th);

      // 重力的分解：沿绳与沿切线两侧补虚线，与 mg 构成一个矩形
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(A.x, A.y);
      ctx.lineTo(W.x, W.y);
      ctx.lineTo(C.x, C.y);
      ctx.stroke();
      ctx.restore();

      // 绳的拉力（蓝）：从摆球沿绳指向悬点
      const tl = clamp((Tn / (m * g)) * Wlen, 10, G.R * 0.85);
      arrow(ctx, G.bx, G.by, G.bx - ux * tl, G.by - uy * tl, pal.blue, 2.4);
      label(ctx, 'F拉', G.bx - ux * tl * 0.55 + uy * 13, G.by - uy * tl * 0.55 - ux * 13, pal.blue, 'center', 14);

      // 重力（橙）：竖直向下
      arrow(ctx, G.bx, G.by, W.x, W.y, pal.orange, 2.4);
      label(ctx, 'mg', W.x, W.y + 16, pal.orange, 'center', 14);

      // 回复力（紫）：重力沿切线的分力，总指向平衡位置
      if (Math.abs(Wlen * sx) > 5) {
        arrow(ctx, G.bx, G.by, C.x, C.y, pal.purple, 2.4);
        const fs = sx > 0 ? -1 : 1;
        label(ctx, 'F', C.x + tx * fs * 14, C.y + ty * fs * 14, pal.purple, 'center', 14);
      }

      // 速度（绿）：切向，起点略离开球面，免得与力箭头叠在一起
      const Lv = clamp(Math.abs(v) * r.h * 0.14, 0, r.h * 0.24);
      if (Lv > 6) {
        const sgn = v > 0 ? 1 : -1;
        const ox = G.bx + ux * (G.bobR + 8);
        const oy = G.by + uy * (G.bobR + 8);
        const ex = ox + tx * Lv * sgn;
        const ey = oy + ty * Lv * sgn;
        arrow(ctx, ox, oy, ex, ey, pal.green, 2.2);
        label(ctx, 'v', ex + tx * 13 * sgn, ey + ty * 13 * sgn, pal.green, 'center', 14);
      }

      st.readout([
        ['摆角 θ', fmt(th / D2R, 1) + ' °'],
        ['线速度 v', fmt(v, 2) + ' m/s'],
        ['回复力 F', fmt(F, 3) + ' N'],
        ['mg sinθ', fmt(-m * g * Math.sin(th), 3) + ' N'],
        ['绳拉力 F拉', fmt(Tn, 2) + ' N'],
        ['F拉 − mg cosθ', fmt(Tn - m * g * Math.cos(th), 2) + ' N'],
        ['向心项 mv²/L', fmt((m * v * v) / L, 2) + ' N'],
        ['周期 T', fmt(T, 3) + ' s'],
      ]);
      return;
    }

    /* ── θ–t 曲线 ── */
    const r1 = { x: w * 0.02, y: h * 0.07, w: w * 0.42, h: h * 0.86 };
    pendBody(ctx, pal, pendGeom(r1, th, L), th);

    const gr = { x: w * 0.50, y: h * 0.13, w: w * 0.465, h: h * 0.74 };
    const P = panel(ctx, gr, [0, TMAX], [-32, 32], pal, { xlab: 't/s', ylab: 'θ/°' });

    // 整条余弦与已经走过的部分
    const N = 220;
    const full = [];
    for (let i = 0; i <= N; i++) {
      const tt = (TMAX * i) / N;
      full.push([tt, (th0 * Math.cos(om * tt)) / D2R]);
    }
    poly(ctx, P.X, P.Y, full, pal.faint, 1.4);

    const M = 160;
    const cur = [];
    for (let i = 0; i <= M; i++) {
      const tt = (t * i) / M;
      cur.push([tt, (th0 * Math.cos(om * tt)) / D2R]);
    }
    if (t > 0.004) poly(ctx, P.X, P.Y, cur, pal.blue, 2.4);

    // ±θ₀ 两条橙色虚线
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.2;
    for (const sg of [1, -1]) {
      ctx.beginPath();
      ctx.moveTo(P.X(0), P.Y((sg * th0) / D2R));
      ctx.lineTo(P.X(TMAX), P.Y((sg * th0) / D2R));
      ctx.stroke();
    }
    ctx.restore();
    label(ctx, 'θ₀', P.X(TMAX) - 6, P.Y(th0 / D2R) - 9, pal.orange, 'right', 13);
    label(ctx, '−θ₀', P.X(TMAX) - 6, P.Y(-th0 / D2R) + 16, pal.orange, 'right', 13);

    // t = T 处一条竖虚线：曲线从此刻起重复自己
    if (T <= TMAX) {
      ctx.save();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(P.X(T), P.Y(-32));
      ctx.lineTo(P.X(T), P.Y(32));
      ctx.stroke();
      ctx.restore();
      label(ctx, 'T', P.X(T) + 7, P.Y(-32) - 7, pal.faint, 'left', 13);
    }

    // 当前时刻
    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(P.X(t), P.Y(-32));
    ctx.lineTo(P.X(t), P.Y(32));
    ctx.stroke();
    ctx.restore();
    spot(ctx, P.X(t), P.Y(th / D2R), 4.5, pal.orange, pal.bg2);

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['摆角 θ', fmt(th / D2R, 1) + ' °'],
      ['振幅 θ₀', fmt(th0 / D2R, 0) + ' °'],
      ['周期 T', fmt(T, 3) + ' s'],
      ['频率 f', fmt(1 / T, 3) + ' Hz'],
      ['sinθ₀ / θ₀', fmt(Math.sin(th0) / th0, 3)],
    ]);
  }

  return { frame, reset };
}
