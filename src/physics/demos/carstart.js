/* 演示：机车起动。
   同一辆车、同一条水平路面，两种起动方式放在一起比。
   恒定功率档：P 固定，牵引力按 F = P/v 随速度反比下降，加速度一路减小，
   速度渐渐逼近 vmax = P/f；
   恒定加速度档：牵引力先保持 F₀ = f + m a₀，加速度不变，功率 P = F₀v 随速度线性上涨，
   涨到额定功率那一刻转入恒功率，牵引力开始下降。
   两种起动的末速度是同一个 P/f，右栏两条 v–t 曲线最后汇到同一条虚线上。
   左栏按当前档画车、牵引力、阻力与速度四样东西；读数栏的「功率 F·v」在恒功率档
   始终等于额定功率，这就是这一档的定义。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const HT = 0.01;   // 预计算用的时间步长（物理秒）
const RUN = 7;     // 一轮动画的屏幕时长（秒）

export function create(st) {
  let last = '';
  let t = 0;
  let hold = 0;
  let cur = [];
  let alt = [];
  let tMax = 1;
  let vMax = 1;
  let v0 = 1;
  let PW = 40000;
  let fr = 1000;
  let ms = 1500;
  let ac = 2;
  let mode = 'p';

  /* 按给定档位积分出一条 v–t 曲线（同一套参数，两档可比） */
  function sim(mo) {
    const out = [];
    const F0 = fr + ms * ac;
    let tt = 0;
    let vv = v0;
    for (let i = 0; i < 40000; i++) {
      out.push([tt, vv]);
      const Ff = mo === 'p' ? PW / vv : Math.min(F0, PW / vv);
      tt += HT;
      vv += ((Ff - fr) / ms) * HT;
      if (vv >= vMax * 0.999) {
        out.push([tt, Math.min(vv, vMax)]);
        break;
      }
    }
    return out;
  }

  /* 只保留到时刻 te 的一段（末端线性插值补一个点） */
  function crop(pts, te) {
    const out = [];
    for (const q of pts) {
      if (q[0] < te) out.push(q);
      else break;
    }
    out.push([te, vAt(pts, te)]);
    return out;
  }

  function reset() {
    const p = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    PW = clamp(nn(p.P, 40), 10, 80) * 1000;
    fr = clamp(nn(p.f, 1000), 300, 3000);
    ms = clamp(nn(p.m, 1500), 800, 2500);
    ac = clamp(nn(p.a0, 2), 0.5, 4);
    mode = p.mode === 'a' ? 'a' : 'p';
    vMax = PW / fr;
    v0 = Math.max(1, vMax * 0.08);
    cur = sim(mode);
    alt = sim(mode === 'p' ? 'a' : 'p');

    /* 时间轴取到「恒功率曲线走到九成末速度」那一刻：
       再往后是缓慢贴近渐近线的长尾，压进框里只会把前半段挤没 */
    const pc = mode === 'p' ? cur : alt;
    let te = pc[pc.length - 1][0];
    for (const q of pc) {
      if (q[1] >= vMax * 0.9) { te = q[0]; break; }
    }
    te = clamp(te, 6, 45);
    cur = crop(cur, te);
    alt = crop(alt, te);
    tMax = te;
    t = 0;
    hold = 0;
  }

  /* 在曲线上按时刻取速度（线性插值，末端夹住） */
  function vAt(pts, tt) {
    if (!pts.length) return v0;
    if (tt <= pts[0][0]) return pts[0][1];
    for (let i = 1; i < pts.length; i++) {
      if (tt <= pts[i][0]) {
        const t0 = pts[i - 1][0];
        const t1 = pts[i][0];
        const k = t1 > t0 ? (tt - t0) / (t1 - t0) : 0;
        return pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k;
      }
    }
    return pts[pts.length - 1][1];
  }

  function frame(dt) {
    const p = st.params;
    const key = [p.P, p.f, p.m, p.a0, p.mode].join('|');
    if (key !== last) { last = key; reset(); }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    if (dt > 0) {
      if (t < tMax) {
        t = Math.min(tMax, t + dt * (tMax / RUN));
      } else {
        hold += dt;
        if (hold > 1) { t = 0; hold = 0; }
      }
    }

    const F0 = fr + ms * ac;
    const v = vAt(cur, t);
    const vv = Math.max(v, 0.05);
    const F = mode === 'p' ? PW / vv : Math.min(F0, PW / vv);
    const acc = (F - fr) / ms;

    const dual = w >= 640;
    const sw = dual ? w * 0.52 : w - 16;
    const gy = h * 0.68;

    /* ── 左：车、牵引力、阻力、速度 ── */
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(sw * 0.04, gy);
    ctx.lineTo(sw * 0.96, gy);
    ctx.stroke();
    ctx.restore();

    const cx = sw * 0.44;
    const bw = 64;
    const bh = 26;
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.20;
    ctx.fillRect(cx - bw / 2, gy - bh - 12, bw, bh);
    ctx.globalAlpha = 0.95;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.6;
    ctx.strokeRect(cx - bw / 2, gy - bh - 12, bw, bh);
    ctx.fillStyle = pal.mut;
    ctx.beginPath();
    ctx.arc(cx - bw * 0.27, gy - 8, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + bw * 0.27, gy - 8, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    label(ctx, mode === 'p' ? '恒定功率起动' : '恒定加速度起动', sw * 0.05, h * 0.15, pal.mut, 'left', 14);
    label(ctx, 'm = ' + fmt(ms, 0) + ' kg', cx, gy - bh - 26, pal.blue, 'center', 13);

    /* 牵引力与阻力：以起步那一刻的牵引力为尺 */
    const fRef = Math.max(PW / v0, F0);
    const oy = gy - bh * 0.5 - 12;
    const Lf = 18 + 56 * clamp(F / fRef, 0, 1);
    arrow(ctx, cx + bw / 2 + 4, oy, cx + bw / 2 + 4 + Lf, oy, pal.orange, 2.6);
    label(ctx, 'F = ' + fmt(F, 0) + ' N', cx + bw / 2 + 8, oy - 12, pal.orange, 'left', 13);

    const Lr = 18 + 56 * clamp(fr / fRef, 0, 1);
    arrow(ctx, cx - bw / 2 - 4, oy, cx - bw / 2 - 4 - Lr, oy, pal.purple, 2.2);
    label(ctx, 'f = ' + fmt(fr, 0) + ' N', cx - bw / 2 - 8, oy - 12, pal.purple, 'right', 13);

    /* 速度：按最大速度定尺 */
    const Lv = 18 + 66 * clamp(v / vMax, 0, 1);
    arrow(ctx, cx - Lv / 2, gy + 26, cx + Lv / 2, gy + 26, pal.green, 2.4);
    label(ctx, 'v = ' + fmt(v, 1) + ' m/s', cx, gy + 44, pal.green, 'center', 13);

    /* ── 右：两档的 v–t 曲线 ── */
    if (dual) {
      const px0 = sw + 10;
      const rect = {
        x: px0 + 44,
        y: h * 0.17,
        w: Math.max(130, w - px0 - 66),
        h: h * 0.62,
      };
      const g = panel(ctx, rect, [0, tMax], [0, vMax * 1.14], pal,
        { xlab: 't / s', ylab: 'v / (m/s)', nx: 5, ny: 4 });

      poly(ctx, g.X, g.Y, alt, pal.faint, 1.8);

      ctx.save();
      ctx.setLineDash([6, 5]);
      ctx.strokeStyle = pal.cyan;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(rect.x, g.Y(vMax));
      ctx.lineTo(rect.x + rect.w, g.Y(vMax));
      ctx.stroke();
      ctx.restore();
      label(ctx, 'vmax = P/f = ' + fmt(vMax, 1) + ' m/s',
        rect.x + rect.w - 4, g.Y(vMax) - 11, pal.cyan, 'right', 13);

      poly(ctx, g.X, g.Y, cur, pal.orange, 2.4);
      spot(ctx, g.X(t), g.Y(v), 5, pal.orange, pal.bg2);
      label(ctx, '灰线：' + (mode === 'p' ? '恒定加速度' : '恒定功率') + '档',
        rect.x + 6, rect.y + 14, pal.mut, 'left', 12);
    }

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['速度 v', fmt(v, 1) + ' m/s'],
      ['牵引力 F', fmt(F, 0) + ' N'],
      ['加速度 a = (F − f)/m', fmt(acc, 2) + ' m/s²'],
      ['功率 F·v', fmt((F * v) / 1000, 1) + ' kW'],
      ['最大速度 P/f', fmt(vMax, 1) + ' m/s'],
    ]);
  }

  return { frame, reset };
}
