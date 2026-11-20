/* 演示：自由落体与竖直上抛。
   三档查看——自由落体、竖直上抛、一起看。左栏一根竖直标尺上放球（对照档两只球同时出发）；
   右栏上下两张图，高度—时间在上、速度—时间在下，两张图共用同一条时间轴，
   同一时刻落在同一条竖虚线上，上下的读数直接对得起来。
   取竖直向上为正，a = −g。 */

import { label, textWidth, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

export function create(st) {
  let t = 0;
  let last = '';

  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const mode = p.mode === 'free' || p.mode === 'up' ? p.mode : 'both';
    /* 高度可以取到 0：贴地释放，或从地面直接向上抛出。0 是合法值，
       不能用 `|| 默认值` 那种写法把它吞掉。 */
    const Hn = Number(p.H);
    const H = clamp(Number.isFinite(Hn) ? Hn : 5, 0, 30);
    const v0 = mode === 'free' ? 0 : clamp(Number(p.v0) || 0, 0, 20);
    const g = clamp(Number(p.g) || 9.8, 1, 20);
    const key = mode + '|' + H + '|' + v0 + '|' + g;
    if (key !== last) { last = key; reset(); }

    const freeOn = mode !== 'up';                 // 有自由落体这一支
    const throwOn = mode !== 'free';              // 有竖直上抛这一支
    const apexOn = throwOn && v0 > 0.05;          // 有最高点可比
    const dual = mode === 'both';

    const tff = Math.sqrt((2 * H) / g);           // 自由落体落地时刻
    const disc = v0 * v0 + 2 * g * H;
    const tl = (v0 + Math.sqrt(disc)) / g;        // 上抛落地时刻
    const up = v0 / g;                            // 上升时间
    const tr = 2 * up;                            // 落回抛出高度的时刻
    const yp = H + (v0 * v0) / (2 * g);           // 最高点高度
    /* 时间轴留一个下限：H = 0 且 v0 = 0 时 tff 与 tl 都退化成 0，
       不给下限，panel 的横轴会取成 [0, 0] 而除零 */
    const tend = Math.max(tff, tl, 0.6);
    const big = apexOn && up > 0.12;

    if (dt > 0) {
      t += dt;
      if (t > tend + 0.9) t = 0;
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    /* 各自落到地面就停在那一刻：球趴在地上、读数停在落地值，
       一起看时两球各停各的，时间轴照旧往前走 */
    const tF = Math.min(t, tff);
    const tU = Math.min(t, tl);
    const y1 = Math.max(0, H - 0.5 * g * tF * tF);              // 自由落体
    const y2 = Math.max(0, H + v0 * tU - 0.5 * g * tU * tU);     // 竖直上抛
    const v1 = -g * tF;
    const v2 = v0 - g * tU;

    /* ── 左：竖直标尺与球 ── */
    const narrow = w < 620;
    const gy = h - 44;
    const ty = 20;
    const ymax = Math.max((apexOn ? yp : H) * 1.16, 1);
    const PY = u => gy - (u / ymax) * (gy - ty);
    const rx = narrow ? 20 : 26;
    const cx1 = narrow ? 44 : 56;
    const cx2 = narrow ? 96 : 126;
    /* 只放一只球时把它摆到两车之间的正中，画面不至偏在一边 */
    const cS = Math.round((cx1 + cx2) / 2);
    const cF = throwOn ? cx1 : cS;
    const cU = freeOn ? cx2 : cS;
    const gEnd = cx2 + (narrow ? 22 : 26);
    const vmax = Math.sqrt(disc) || 1;

    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(rx, gy);
    ctx.lineTo(rx, ty - 12);
    ctx.stroke();
    arrow(ctx, rx, ty - 12, rx, ty - 20, pal.mut, 1.2);
    label(ctx, 'y / m', rx + 7, ty - 8, pal.mut, 'left', 12);

    /* 地面 */
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rx - 16, gy + 0.5);
    ctx.lineTo(gEnd, gy + 0.5);
    ctx.stroke();

    /* 刻度 */
    const step = Math.max(1, Math.round(ymax / 6));
    for (let u = step; u <= ymax; u += step) {
      const py = PY(u);
      if (py < ty - 2) continue;
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(rx - 4, py);
      ctx.lineTo(rx + 4, py);
      ctx.stroke();
      label(ctx, String(u), rx - 8, py, pal.faint, 'right', 12);
    }

    /* 抛出（释放）高度：一切从这里开始 */
    dashH(ctx, rx - 12, gEnd, PY(H), pal.line);

    /* 最高点：有上抛这一支才有的一条横线 */
    if (apexOn) {
      dashH(ctx, rx - 12, gEnd, PY(yp), pal.orange);
      label(
        ctx,
        dual ? '最高点 ' + fmt(yp, 1) + ' m' : '最高点',
        (dual ? cx2 : cS) - (dual ? 12 : 16),
        PY(yp) - 8,
        pal.orange,
        'right',
        12,
      );
    }

    /* 球与速度箭头 */
    if (freeOn) {
      ball(ctx, pal, cF, PY(y1), pal.blue, 8);
      velArrow(ctx, pal, cF + 12, PY(y1), v1, vmax);
    }
    if (throwOn) {
      ball(ctx, pal, cU, PY(y2), pal.orange, 8);
      velArrow(ctx, pal, cU + 12, PY(y2), v2, vmax);
      /* v0 = 0 时两球完全重合：给橙球套一圈蓝环，说明这里叠着两只 */
      if (dual && !apexOn) {
        ctx.strokeStyle = pal.blue;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(cU, PY(y2), 12, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    if (freeOn) label(ctx, '自由落体', cF, gy + 16, pal.blue, 'center', 12);
    if (throwOn) label(ctx, '竖直上抛', cU, gy + 16, pal.orange, 'center', 12);

    /* ── 右：上下两张图，共用一条时间轴 ── */
    const px0 = narrow ? 146 : 178;
    const pw = Math.max(150, w - px0 - 16);
    const gap = 30;
    const ph = Math.max(64, (h - 18 - 30 - gap) / 2);
    const rA = { x: px0, y: 18, w: pw, h: ph };
    const rB = { x: px0, y: 18 + ph + gap, w: pw, h: ph };
    const tx = [0, tend * 1.05];
    const lx = rA.x + rA.w - 10;

    /* ── 上图：高度—时间 ── */
    const gA = panel(ctx, rA, tx, [0, ymax], pal, {
      xlab: 't / s',
      ylab: 'y / m',
      nx: 6,
      ny: 4,
    });

    if (freeOn) {
      const pts = [];
      for (let i = 0; i <= 160; i++) {
        const tt = (i / 160) * tff;
        pts.push([tt, H - 0.5 * g * tt * tt]);
      }
      poly(ctx, gA.X, gA.Y, pts, pal.blue, 2.2);
      spot(ctx, gA.X(tff), gA.Y(0), 3.2, pal.blue, pal.bg2);
    }
    if (throwOn) {
      const pts = [];
      for (let i = 0; i <= 200; i++) {
        const tt = (i / 200) * tl;
        pts.push([tt, H + v0 * tt - 0.5 * g * tt * tt]);
      }
      poly(ctx, gA.X, gA.Y, pts, pal.orange, 2.2);
      spot(ctx, gA.X(tl), gA.Y(0), 3.2, pal.orange, pal.bg2);
    }

    /* 公式贴在自己那条线旁边：曲线一路下行，字落在曲线的右上方空白里 */
    if (freeOn && tff > 0.12) {
      const ta = tff * 0.64;
      formulaLabel(ctx, 'y = H − gt²/2', gA.X(ta) + 9, gA.Y(H - 0.5 * g * ta * ta) - 13, pal.blue, rA.x + rA.w);
    }
    if (throwOn && tl > 0.12) {
      const ta = tl * 0.7;
      formulaLabel(ctx, 'y = H + v₀t − gt²/2', gA.X(ta) + 9, gA.Y(H + v0 * ta - 0.5 * g * ta * ta) - 13, pal.orange, rA.x + rA.w);
    }

    if (apexOn) {
      /* 顶点：上升与下落的分界，t = t上 时 v = 0 */
      dashV(ctx, gA.X(up), gA.Y(yp), gA.ay, pal.orange);
      spot(ctx, gA.X(up), gA.Y(yp), 4.2, pal.orange, pal.bg2);
      if (big) label(ctx, 't_{上}', gA.X(up) - 5, gA.ay - 8, pal.orange, 'right', 12);
      /* 回到抛出高度的时刻 2t上：与顶点那段关于 t = t上 对称 */
      if (tr < tl && Math.abs(gA.X(tr) - gA.X(up)) > 70) {
        dashV(ctx, gA.X(tr), gA.Y(H), gA.ay, pal.faint);
        spot(ctx, gA.X(tr), gA.Y(H), 3.2, pal.faint, pal.bg2);
        label(ctx, '2t_{上}', gA.X(tr) + 5, gA.ay - 8, pal.orange, 'left', 12);
      }
    }

    /* ── 下图：速度—时间 ── */
    const vLandF = -g * tff;
    const vLandU = v0 - g * tl;
    let vLo = 0;
    let vHi = 0;
    if (freeOn) vLo = Math.min(vLo, vLandF);
    if (throwOn) {
      vLo = Math.min(vLo, vLandU);
      vHi = Math.max(vHi, v0);
    }
    if (vHi <= 0) vHi = Math.max(0.1, Math.abs(vLo) * 0.16);
    const gB = panel(ctx, rB, tx, [vLo * 1.12 - 0.4, vHi * 1.12 + 0.3], pal, {
      xlab: 't / s',
      ylab: 'v / (m/s)',
      nx: 6,
      ny: 4,
    });

    /* 上下两块面积：上升段与落回抛出高度的下落段，等大反向 */
    if (big) {
      const asc = [];
      for (let i = 0; i <= 60; i++) {
        const tt = (i / 60) * up;
        asc.push([tt, v0 - g * tt]);
      }
      fillArea(ctx, gB, asc, 0, pal.blue, 0.16);
      const des = [];
      for (let i = 0; i <= 60; i++) {
        const tt = up + (i / 60) * up;
        des.push([tt, v0 - g * tt]);
      }
      fillArea(ctx, gB, des, 0, pal.orange, 0.16);
    }

    if (freeOn) poly(ctx, gB.X, gB.Y, [[0, 0], [tff, vLandF]], pal.blue, 2.2);
    if (throwOn) poly(ctx, gB.X, gB.Y, [[0, v0], [tl, vLandU]], pal.orange, 2.2);

    /* 两条线的斜率都是 −g，公式各自挂在自己那条线上 */
    if (freeOn && tff > 0.12) {
      const ta = tff * 0.74;
      formulaLabel(ctx, 'v = −gt', gB.X(ta) + 9, gB.Y(-g * ta) + 15, pal.blue, rB.x + rB.w);
    }
    if (throwOn && tl > 0.12) {
      const ta = tl * 0.3;
      formulaLabel(ctx, 'v = v₀ − gt', gB.X(ta) + 9, gB.Y(v0 - g * ta) - 12, pal.orange, rB.x + rB.w);
    }

    if (apexOn) {
      dashV(ctx, gB.X(up), gB.Y(vHi * 1.12 + 0.3), gB.Y(0), pal.faint);
      if (big) label(ctx, 't_{上}', gB.X(up), gB.ay - 7, pal.faint, 'center', 12);
      /* 落回抛出高度时速率与抛出时相等、方向相反 */
      if (tr < tl && Math.abs(gB.X(tr) - gB.X(up)) > 60) {
        spot(ctx, gB.X(tr), gB.Y(-v0), 3.2, pal.faint, pal.bg2);
        label(ctx, '−v₀', gB.X(tr) + 7, gB.Y(-v0) + 12, pal.faint, 'left', 12);
      }
    }

    /* ── 同一条竖虚线贯穿两张图：上下两个读数来自同一时刻 ── */
    const cxT = gA.X(Math.min(t, tend));
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.setLineDash([2, 6]);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(Math.round(cxT) + 0.5, rA.y);
    ctx.lineTo(Math.round(cxT) + 0.5, rB.y + rB.h);
    ctx.stroke();
    ctx.restore();

    if (freeOn) {
      spot(ctx, gA.X(tF), gA.Y(y1), 5, pal.blue, pal.bg2);
      spot(ctx, gB.X(tF), gB.Y(v1), 5, pal.blue, pal.bg2);
    }
    if (throwOn) {
      spot(ctx, gA.X(tU), gA.Y(y2), 5, pal.orange, pal.bg2);
      spot(ctx, gB.X(tU), gB.Y(v2), 5, pal.orange, pal.bg2);
    }

    /* 图例：照统计图的写法，一小段色线加名称，不用「橙」「蓝」这类字辨色 */
    if (dual) {
      legend(ctx, lx, rA.y + 14, pal.orange, '竖直上抛', pal);
      legend(ctx, lx, rA.y + 30, pal.blue, '自由落体', pal);
      label(ctx, '两条线斜率都是 −g', rB.x + rB.w - 10, rB.y + 14, pal.green, 'right', 12);
    } else {
      legend(ctx, lx, rA.y + 14, throwOn ? pal.orange : pal.blue, throwOn ? '竖直上抛' : '自由落体', pal);
    }

    /* ── 读数条 ── */
    if (mode === 'free') {
      st.readout([
        ['时间 t', fmt(t, 2) + ' s'],
        ['高度 y', fmt(y1, 2) + ' m'],
        ['速度 v', fmt(v1, 2) + ' m/s'],
        ['已下落', fmt(H - y1, 2) + ' m'],
        ['落地时刻', fmt(tff, 2) + ' s'],
        ['落地速度', fmt(-g * tff, 2) + ' m/s'],
      ]);
    } else if (mode === 'up') {
      st.readout([
        ['时间 t', fmt(t, 2) + ' s'],
        ['高度 y', fmt(y2, 2) + ' m'],
        ['速度 v', fmt(v2, 2) + ' m/s'],
        ['上升时间 t上', apexOn ? fmt(up, 2) + ' s' : '—'],
        ['最高点', fmt(yp, 2) + ' m'],
        ['落回抛出高度', apexOn ? fmt(tr, 2) + ' s' : '—'],
        ['落地时刻', fmt(tl, 2) + ' s'],
      ]);
    } else {
      st.readout([
        ['时间 t', fmt(t, 2) + ' s'],
        ['自由落体 y', fmt(y1, 2) + ' m'],
        ['竖直上抛 y', fmt(y2, 2) + ' m'],
        ['自由落体落地', fmt(tff, 2) + ' s'],
        ['上抛落地', fmt(tl, 2) + ' s'],
        ['晚落地', fmt(tl - tff, 2) + ' s'],
      ]);
    }
  }

  function ball(ctx, pal, x, y, col, r) {
    ctx.beginPath();
    ctx.arc(x, y, r + 3, 0, Math.PI * 2);
    ctx.fillStyle = pal.bg2;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = col;
    ctx.fill();
  }

  function velArrow(ctx, pal, x, y, v, vmax) {
    const len = clamp(Math.abs(v) / vmax, 0, 1) * 46;
    if (len < 3) return;
    arrow(ctx, x, y, x, y + (v >= 0 ? -len : len), pal.green, 2);
  }

  /** 面积填充：折线与基线之间 */
  function fillArea(ctx, g, pts, base, color, alpha) {
    if (!pts.length) return;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.moveTo(g.X(pts[0][0]), g.Y(base));
    for (const q of pts) ctx.lineTo(g.X(q[0]), g.Y(q[1]));
    ctx.lineTo(g.X(pts[pts.length - 1][0]), g.Y(base));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
    ctx.restore();
  }

  /** 公式标签：贴在曲线某点的右上方；右边放不下就翻到点的左侧、改右对齐收口 */
  function formulaLabel(ctx, text, x, y, color, right) {
    const tw = textWidth(ctx, text, 12);
    if (x + tw <= right - 4) { label(ctx, text, x, y, color, 'left', 12); return; }
    const xr = x - 26;
    label(ctx, text, xr - tw >= 24 ? xr : right - 4, y, color, 'right', 12);
  }

  /** 统计图式的图例：右对齐一段色线 + 名称，名称用中性墨色，色只落在样线上 */
  function legend(ctx, x, y, color, text, pal) {
    const tw = textWidth(ctx, text, 12);
    label(ctx, text, x, y, pal.mut, 'right', 12);
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(x - tw - 19, y);
    ctx.lineTo(x - tw - 6, y);
    ctx.stroke();
    ctx.restore();
  }

  function dashH(ctx, x1, x2, y, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, Math.round(y) + 0.5);
    ctx.lineTo(x2, Math.round(y) + 0.5);
    ctx.stroke();
    ctx.restore();
  }

  function dashV(ctx, x, y1, y2, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.setLineDash([5, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, y1);
    ctx.lineTo(Math.round(x) + 0.5, y2);
    ctx.stroke();
    ctx.restore();
  }

  return { frame, reset };
}
