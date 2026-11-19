/* 振3 阻尼振动与受迫振动。按 mode 分成四块单画面的板，各挂到用到它的那一节：
   damp  —— 阻尼振动：左端固定，物块从 0.5 m 放开，下方 x–t 曲线配橙色指数包络；
   kinds —— 三种阻尼：欠阻尼 / 临界阻尼 / 过阻尼三条解析曲线同图对照；
   drive —— 受迫振动：驱动端按 A cos(2πft) 拉动，曲线纵轴取 x/A，紫线是驱动端；
   reson —— 共振曲线：稳态振幅比 X/A 随驱动频率 f 变化，峰在固有频率 f₀ 附近。
   模型 m x″ + b x′ + k(x − x_s) = 0，x_s = A cos(2π f t)，m 固定 1 kg。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const TWIN = 8; // 阻尼档与受迫档的时间窗（秒）
const X0 = 0.5; // 阻尼档的初始位移（m）
const MASS = 1; // 物块质量固定 1 kg
const YMAX = 7; // 共振曲线纵轴上限

export function create(st) {
  let last = '';
  let t = 0;
  let hold = 0;
  let x = X0;
  let v = 0;
  let hist = [];

  /* 振子的装置：地面、平衡位置、左端挡板（受迫档是驱动端）、弹簧、物块、速度箭头。
     o = { x 物块位移, xs 驱动端位移, kx 每米多少像素, driver 是否画成驱动端, v 速度 } */
  function springRig(ctx, pal, r, o) {
    const blockW = clamp(r.w * 0.052, 22, 44);
    const blockH = blockW * 0.62;
    const gy = r.y + r.h * 0.76;
    const trackY = gy - blockH / 2;
    const eqX = r.x + r.w * 0.42;
    const L0 = r.w * 0.3;
    const lim = (r.w * 0.3) / o.kx;
    const xd = clamp(o.x, -lim, lim);
    const bx = eqX + xd * o.kx;
    const pxs = eqX - L0 + (o.xs || 0) * o.kx;

    // 地面
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(r.x + r.w * 0.01, gy);
    ctx.lineTo(r.x + r.w * 0.99, gy);
    ctx.stroke();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    const nh = 12;
    for (let i = 0; i < nh; i++) {
      const xx = r.x + r.w * 0.02 + (i * r.w * 0.96) / (nh - 1);
      ctx.beginPath();
      ctx.moveTo(xx, gy + 2);
      ctx.lineTo(xx - 7, gy + 11);
      ctx.stroke();
    }

    // 平衡位置虚线
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(eqX, gy + 4);
    ctx.lineTo(eqX, gy - blockH - 50);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'O', eqX + 5, gy + 18, pal.faint, 'left', 13);

    // 左端挡板 / 驱动端
    const plateTop = gy - blockH * 1.55;
    ctx.fillStyle = o.driver ? pal.purple : pal.ink;
    ctx.fillRect(pxs - 3, plateTop, 6, gy - plateTop);
    if (o.driver) label(ctx, '驱动端', pxs, gy + 18, pal.purple, 'center', 13);

    // 弹簧：竖折线，跨距太小时退成一根直线
    const ax = pxs + 3;
    const bxl = bx - blockW / 2;
    const span = bxl - ax;
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(ax, trackY);
    if (span > 26) {
      const n = 16;
      const stp = span / n;
      const amp = Math.min(9, span * 0.12);
      for (let i = 1; i <= n; i++) {
        ctx.lineTo(ax + stp * i, i === n ? trackY : trackY + (i % 2 ? -amp : amp));
      }
    } else {
      ctx.lineTo(bxl, trackY);
    }
    ctx.stroke();

    // 物块
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bxl, gy - blockH, blockW, blockH, 4);
    ctx.fill();
    ctx.stroke();
    label(ctx, 'm', bx, gy - blockH / 2 + 5, pal.blue, 'center', 14);

    // 速度箭头
    const Lv = clamp(Math.abs(o.v) * o.kx * 0.16, 0, r.w * 0.1);
    if (Lv > 5) {
      const dir = o.v > 0 ? 1 : -1;
      const ay = gy - blockH - 22;
      arrow(ctx, bx, ay, bx + dir * Lv, ay, pal.green, 2.4);
      label(ctx, 'v', bx + dir * (Lv + 13), ay + 5, pal.green, 'center', 14);
    }
  }

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (val, d) => (Number.isFinite(Number(val)) ? Number(val) : d);
    const raw = q.mode;
    const mode = raw === 'kinds' || raw === 'drive' || raw === 'reson' ? raw : 'damp';
    const k = clamp(nn(q.k, 20), 5, 100);
    const b = clamp(nn(q.b, 1.6), 0.8, 8);
    const Ad = clamp(nn(q.Ad, 0.05), 0.02, 0.12);
    const fd = clamp(nn(q.fd, 0.5), 0.1, 2.5);

    const om0 = Math.sqrt(k / MASS);
    const beta = b / (2 * MASS);
    const f0 = om0 / (2 * Math.PI);
    const om = 2 * Math.PI * fd;
    const R = f => {
      const wv = 2 * Math.PI * f;
      return (om0 * om0) / Math.sqrt((om0 * om0 - wv * wv) ** 2 + (2 * beta * wv) ** 2);
    };
    const Rpk = om0 / (2 * beta); // 峰高
    const TM = clamp(20 / om0, 1.6, 8); // 三种阻尼档的时间窗，随 k 缩放
    const TEND = mode === 'kinds' ? TM : TWIN;

    const key = [mode, k, b, Ad, fd].join('|');
    if (key !== last) {
      last = key;
      t = 0;
      hold = 0;
      x = mode === 'drive' ? 0 : X0;
      v = 0;
      hist = mode === 'damp' || mode === 'drive' ? [[0, x]] : [];
    }

    /* ── 步进 ── */
    if (mode === 'drive') {
      if (dt > 0) {
        const n = 6;
        const hh = dt / n;
        for (let i = 0; i < n; i++) {
          const tt = t + hh;
          const xsr = Ad * Math.cos(om * tt);
          const acc = (-k * (x - xsr) - b * v) / MASS;
          v += acc * hh;
          x += v * hh;
          t = tt;
          hist.push([t, x]);
        }
        while (hist.length > 2 && hist[0][0] < t - TWIN - 2) hist.shift();
      }
    } else if (mode === 'damp' || mode === 'kinds') {
      if (dt > 0) {
        if (t < TEND) {
          const tNext = Math.min(TEND, t + dt);
          if (mode === 'damp') {
            const n = 6;
            const hh = (tNext - t) / n;
            for (let i = 0; i < n; i++) {
              const acc = (-k * x - b * v) / MASS;
              v += acc * hh;
              x += v * hh;
              t += hh;
              hist.push([t, x]);
            }
          } else {
            t = tNext;
          }
        } else {
          hold += dt;
          if (hold > 0.9) {
            t = 0;
            hold = 0;
            x = X0;
            v = 0;
            hist = mode === 'damp' ? [[0, x]] : [];
          }
        }
      }
    }

    ctx.clearRect(0, 0, w, h);

    if (mode === 'damp') {
      /* ── 阻尼振动：振子 + 指数包络 ── */
      springRig(ctx, pal, { x: w * 0.05, y: h * 0.03, w: w * 0.9, h: h * 0.38 }, { x, v, xs: 0, kx: w * 0.28, driver: false });

      const under = beta < om0 * 0.999;
      const wd = Math.sqrt(Math.max(om0 * om0 - beta * beta, 1e-9));
      const envA = tau => (under ? X0 * Math.sqrt(1 + (beta / wd) ** 2) : X0) * Math.exp(-beta * tau);

      const g1 = { x: w * 0.07, y: h * 0.47, w: w * 0.88, h: h * 0.47 };
      const P1 = panel(ctx, g1, [0, TWIN], [-0.6, 0.6], pal, { xlab: 't / s', ylab: 'x / m' });

      // 指数包络（阻尼超过临界时不再往复，不画包络）
      if (under && t > 0.02) {
        const env = [];
        for (let i = 0; i <= 160; i++) {
          const tau = (t * i) / 160;
          env.push([tau, envA(tau)]);
        }
        ctx.save();
        ctx.setLineDash([5, 5]);
        ctx.strokeStyle = pal.orange;
        ctx.lineWidth = 1.2;
        for (const sg of [1, -1]) {
          ctx.beginPath();
          ctx.moveTo(P1.X(env[0][0]), P1.Y(sg * env[0][1]));
          for (const e of env) ctx.lineTo(P1.X(e[0]), P1.Y(sg * e[1]));
          ctx.stroke();
        }
        ctx.restore();
      }

      // 已经走过的位移曲线
      const pts = [];
      for (const p of hist) pts.push([p[0], clamp(p[1], -0.6, 0.6)]);
      if (pts.length > 1) poly(ctx, P1.X, P1.Y, pts, pal.blue, 2.2);
      spot(ctx, P1.X(t), P1.Y(clamp(x, -0.6, 0.6)), 4.5, pal.orange, pal.bg2);

      st.readout([
        ['时间 t', fmt(t, 2) + ' s'],
        ['位移 x', fmt(x, 3) + ' m'],
        ['速度 v', fmt(v, 2) + ' m/s'],
        ['包络 A(t)', under ? fmt(envA(t), 3) + ' m' : '—（不往复）'],
        ['阻尼比 ζ', fmt(beta / om0, 3)],
        ['振动周期 T', under ? fmt((2 * Math.PI) / wd, 2) + ' s' : '—（不往复）'],
        ['固有频率 f₀', fmt(f0, 3) + ' Hz'],
      ]);
      return;
    }

    if (mode === 'kinds') {
      /* ── 三种阻尼：同一个初始位移，三条解析曲线 ── */
      const bc = 2 * Math.sqrt(k * MASS);
      const kinds = [
        { key: 'u', bb: 0.2 * bc, c: pal.blue, name: '欠阻尼' },
        { key: 'c', bb: bc, c: pal.orange, name: '临界阻尼' },
        { key: 'o', bb: 2.5 * bc, c: pal.purple, name: '过阻尼' },
      ];
      const sol = (kind, bb, tau) => {
        const bt = bb / (2 * MASS);
        if (kind === 'u') {
          const wd = Math.sqrt(Math.max(om0 * om0 - bt * bt, 1e-9));
          return Math.exp(-bt * tau) * (X0 * Math.cos(wd * tau) + ((bt * X0) / wd) * Math.sin(wd * tau));
        }
        if (kind === 'c') return Math.exp(-om0 * tau) * (X0 + om0 * X0 * tau);
        const gm = Math.sqrt(Math.max(bt * bt - om0 * om0, 1e-9));
        return Math.exp(-bt * tau) * (X0 * Math.cosh(gm * tau) + ((bt * X0) / gm) * Math.sinh(gm * tau));
      };

      const g = { x: w * 0.08, y: h * 0.1, w: w * 0.84, h: h * 0.78 };
      const P = panel(ctx, g, [0, TM], [-0.6, 0.6], pal, { xlab: 't / s', ylab: 'x / m' });

      const N = 240;
      for (const kk of kinds) {
        const pts = [];
        for (let i = 0; i <= N; i++) {
          const tau = (TM * i) / N;
          pts.push([tau, clamp(sol(kk.key, kk.bb, tau), -0.6, 0.6)]);
        }
        poly(ctx, P.X, P.Y, pts, kk.c, kk.key === 'c' ? 2.6 : 2.2);
      }

      // 当前时刻的竖虚线与三条曲线上各一枚点
      ctx.save();
      ctx.setLineDash([3, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(P.X(t), P.Y(-0.6));
      ctx.lineTo(P.X(t), P.Y(0.6));
      ctx.stroke();
      ctx.restore();
      for (const kk of kinds) {
        spot(ctx, P.X(t), P.Y(clamp(sol(kk.key, kk.bb, t), -0.6, 0.6)), 4, kk.c, pal.bg2);
      }

      // 图例：右上角，曲线在那里早已贴近零
      const lx = g.x + g.w - 12;
      kinds.forEach((kk, i) => {
        label(ctx, kk.name, lx, g.y + 20 + i * 21, kk.c, 'right', 14);
      });

      st.readout([
        ['劲度系数 k', fmt(k, 0) + ' N/m'],
        ['固有角频率 ω₀', fmt(om0, 2) + ' rad/s'],
        ['临界阻尼 b_c', fmt(bc, 2) + ' N·s/m'],
        ['欠阻尼 b', fmt(0.2 * bc, 2) + ' N·s/m'],
        ['过阻尼 b', fmt(2.5 * bc, 2) + ' N·s/m'],
        ['时间窗', fmt(TM, 2) + ' s'],
      ]);
      return;
    }

    if (mode === 'drive') {
      /* ── 受迫振动：驱动端 + 过渡过程 ── */
      const kx = w * 0.9;
      springRig(ctx, pal, { x: w * 0.05, y: h * 0.03, w: w * 0.9, h: h * 0.38 }, { x, v, xs: Ad * Math.cos(om * t), kx, driver: true });

      const g2 = { x: w * 0.07, y: h * 0.47, w: w * 0.88, h: h * 0.47 };
      const P2 = panel(ctx, g2, [0, TWIN], [-3, 3], pal, { xlab: 't / s', ylab: 'x / A' });
      const off = Math.max(0, t - TWIN);
      const Rf = R(fd);

      // 驱动端的位移 x_s / A = cos(2πft)
      const drv = [];
      for (let i = 0; i <= 200; i++) {
        const tau = off + ((t - off) * i) / 200;
        if (tau < 0) continue;
        drv.push([tau - off, Math.cos(om * tau)]);
      }
      if (drv.length > 1) poly(ctx, P2.X, P2.Y, drv, pal.purple, 1.6, [5, 5]);

      // 稳态振幅的包络
      ctx.save();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.2;
      for (const sg of [1, -1]) {
        ctx.beginPath();
        ctx.moveTo(P2.X(0), P2.Y(sg * Math.min(Rf, 3)));
        ctx.lineTo(P2.X(TWIN), P2.Y(sg * Math.min(Rf, 3)));
        ctx.stroke();
      }
      ctx.restore();

      // 物块的位移曲线
      const pts = [];
      for (const p of hist) {
        if (p[0] >= t - TWIN) pts.push([p[0] - off, clamp(p[1] / Ad, -3, 3)]);
      }
      if (pts.length > 1) poly(ctx, P2.X, P2.Y, pts, pal.blue, 2.2);
      spot(ctx, P2.X(t - off), P2.Y(clamp(x / Ad, -3, 3)), 4.5, pal.orange, pal.bg2);

      st.readout([
        ['时间 t', fmt(t, 2) + ' s'],
        ['位移 x', fmt(x, 3) + ' m'],
        ['驱动端 x_s', fmt(Ad * Math.cos(om * t), 3) + ' m'],
        ['固有频率 f₀', fmt(f0, 3) + ' Hz'],
        ['驱动力频率 f', fmt(fd, 2) + ' Hz'],
        ['稳态 X / A', fmt(Rf, 2)],
      ]);
      return;
    }

    /* ── 共振曲线 ── */
    const g3 = { x: w * 0.1, y: h * 0.12, w: w * 0.8, h: h * 0.76 };
    const P3 = panel(ctx, g3, [0, 2.5], [0, YMAX], pal, { xlab: 'f / Hz', ylab: 'X / A' });

    // 曲线（超过纵轴上限的那一段不取样，分两段画）
    const runs = [];
    let run = [];
    for (let i = 0; i <= 260; i++) {
      const f = (2.5 * i) / 260;
      const val = R(f);
      if (val <= YMAX - 0.02) run.push([f, val]);
      else if (run.length) {
        runs.push(run);
        run = [];
      }
    }
    if (run.length) runs.push(run);
    for (const rr of runs) poly(ctx, P3.X, P3.Y, rr, pal.blue, 2.4);

    // 固有频率一条绿虚线
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(P3.X(f0), P3.Y(0));
    ctx.lineTo(P3.X(f0), P3.Y(YMAX));
    ctx.stroke();
    ctx.restore();
    label(ctx, 'f₀', P3.X(f0) + 7, P3.Y(0) - 9, pal.green, 'left', 13);

    // 峰顶
    if (Rpk <= YMAX - 0.02) {
      spot(ctx, P3.X(f0), P3.Y(Rpk), 4.5, pal.purple, pal.bg2);
      label(ctx, '共振', P3.X(f0) + 9, P3.Y(Rpk) + 4, pal.purple, 'left', 13);
    }

    // 当前驱动频率：竖虚线 + 到纵轴的淡虚线
    const rc = Math.min(R(fd), YMAX - 0.02);
    ctx.save();
    ctx.setLineDash([3, 4]);
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(P3.X(fd), P3.Y(0));
    ctx.lineTo(P3.X(fd), P3.Y(rc));
    ctx.stroke();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(P3.X(0), P3.Y(rc));
    ctx.lineTo(P3.X(fd), P3.Y(rc));
    ctx.stroke();
    ctx.restore();
    spot(ctx, P3.X(fd), P3.Y(rc), 5, pal.orange, pal.bg2);

    st.readout([
      ['固有频率 f₀', fmt(f0, 3) + ' Hz'],
      ['固有角频率 ω₀', fmt(om0, 2) + ' rad/s'],
      ['驱动力频率 f', fmt(fd, 2) + ' Hz'],
      ['阻尼比 ζ', fmt(beta / om0, 3)],
      ['X / A', fmt(R(fd), 2)],
      ['峰高 X / A', fmt(Rpk, 2)],
    ]);
  }

  return { frame, reset: () => { t = 0; hold = 0; x = X0; v = 0; hist = []; } };
}
