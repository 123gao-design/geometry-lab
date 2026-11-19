/* 原4 放射性衰变。
   两档：半衰期档用一大片原子核做随机衰变，蓝点未衰变、橙点已衰变，
   右栏同时画实测剩余比例与理论曲线 N/N₀ = 2^(−t/T)；三种射线档把 α、β、γ
   并排画出，看谁能被纸、铝板、铅板挡住。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel, poly } from './axes.js';

const COLS = 24, ROWS = 12;

export function create(st) {
  let T = 0;                 // 演示时间
  let last = '';
  let atoms = [];
  let hist = [];
  let histT = 0;

  function seed() {
    atoms = [];
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        atoms.push({
          u: (i + 0.5) / COLS,
          v: (j + 0.5) / ROWS,
          d: 0,          // 0 未衰变、1 已衰变
          at: 0,         // 衰变时刻（演示时间）
        });
      }
    }
    hist = [];
    histT = 0;
    T = 0;
  }

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const rays = (q.mode || 'decay') === 'rays';
    const Th = clamp(fn(q.Th, 6), 2, 20);

    const key = [rays ? 'r' : 'd', Th].join(',');
    if (key !== last) { last = key; seed(); }
    if (dt > 0 && !rays) T += dt;
    if (!rays && T > 6 * Th) seed();

    const tmax = 6 * Th;

    ctx.clearRect(0, 0, w, h);

    if (rays) {
      /* ══ 三种射线 ═══════════════════════════════════════ */
      const sy = h * 0.52;
      const sx = w * 0.09;

      // 放射源
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.beginPath();
      ctx.arc(sx, sy, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      label(ctx, '放射源', sx, sy + 30, pal.orange, 'center', 14);

      const beams = [
        { y: sy - h * 0.16, col: pal.orange, name: 'α 射线', stop: w * 0.30, tip: '纸片就能挡住' },
        { y: sy, col: pal.green, name: 'β 射线', stop: w * 0.52, tip: '几毫米铝板挡住' },
        { y: sy + h * 0.16, col: pal.purple, name: 'γ 射线', stop: w * 0.955, tip: '铅板只能减弱' },
      ];

      // 屏障
      const walls = [
        { x: w * 0.30, t: '纸', h2: 0.30 },
        { x: w * 0.52, t: '铝板', h2: 0.34 },
        { x: w * 0.80, t: '铅板', h2: 0.38 },
      ];
      for (const wl of walls) {
        ctx.save();
        ctx.strokeStyle = pal.faint;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(wl.x, sy - h * wl.h2);
        ctx.lineTo(wl.x, sy + h * wl.h2);
        ctx.stroke();
        ctx.restore();
        label(ctx, wl.t, wl.x, sy - h * wl.h2 - 12, pal.mut, 'center', 13);
      }

      for (const b of beams) {
        const x0 = sx + 12, x1 = b.stop;
        ctx.save();
        ctx.strokeStyle = b.col;
        ctx.lineWidth = 2.2;
        ctx.setLineDash(b.name.startsWith('γ') ? [7, 5] : []);
        ctx.beginPath();
        ctx.moveTo(x0, b.y);
        ctx.lineTo(x1, b.y);
        ctx.stroke();
        ctx.restore();
        // 终点的小叉：被挡住的记号
        if (b.stop < w * 0.9) {
          ctx.save();
          ctx.strokeStyle = b.col;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x1 - 5, b.y - 5);
          ctx.lineTo(x1 + 5, b.y + 5);
          ctx.moveTo(x1 + 5, b.y - 5);
          ctx.lineTo(x1 - 5, b.y + 5);
          ctx.stroke();
          ctx.restore();
        }
        label(ctx, b.name, x0 + 12, b.y - 12, b.col, 'left', 14);
        const gamma = b.name.startsWith('γ');
        label(ctx, b.tip, gamma ? w * 0.945 : x1 + 10, b.y + 18, pal.mut, gamma ? 'right' : 'left', 12);
      }

      st.readout([
        ['α 射线', '氦核 ⁴₂He，+2e'],
        ['β 射线', '高速电子，−e'],
        ['γ 射线', '光子，不带电'],
        ['电离本领', 'α > β > γ'],
        ['穿透本领', 'γ > β > α'],
        ['在磁场中', 'α、β 偏转，γ 不偏'],
      ]);
      return;
    }

    /* ══ 半衰期档：随机衰变 ═════════════════════════════ */
    const rect = { x: w * 0.05, y: h * 0.15, w: w * 0.40, h: h * 0.70 };

    if (dt > 0) {
      const p = 1 - Math.pow(0.5, dt / Th);
      for (const a of atoms) {
        if (!a.d && Math.random() < p) { a.d = 1; a.at = T; }
      }
      if (T - histT > 0.04) {
        let left = 0;
        for (const a of atoms) if (!a.d) left++;
        hist.push([T, left / atoms.length]);
        histT = T;
      }
    }

    let left = 0;
    for (const a of atoms) if (!a.d) left++;
    const frac = left / atoms.length;
    const theory = Math.pow(0.5, T / Th);

    // 原子点阵
    for (const a of atoms) {
      const x = rect.x + a.u * rect.w;
      const y = rect.y + a.v * rect.h;
      ctx.save();
      if (a.d) {
        const age = T - a.at;
        ctx.fillStyle = pal.orange;
        ctx.globalAlpha = age < 0.5 ? 1 : 0.55;
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fill();
        if (age < 0.5) {
          ctx.globalAlpha = (1 - age / 0.5) * 0.8;
          ctx.strokeStyle = pal.orange;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(x, y, 3.2 + age * 22, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        ctx.fillStyle = pal.blue;
        ctx.beginPath();
        ctx.arc(x, y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    label(ctx, `未衰变（蓝）${left} 个 / 共 ${atoms.length} 个`, rect.x, rect.y - 14, pal.mut, 'left', 13);

    // 右栏：剩余比例随时间的曲线
    const rc = { x: w * 0.55, y: h * 0.14, w: w * 0.39, h: h * 0.70 };
    const g = panel(ctx, rc, [0, tmax], [0, 1], pal, { xlab: 't/s', ylab: 'N/N₀', nx: 3, ny: 4 });

    const th = [];
    for (let i = 0; i <= 240; i++) {
      const u = (tmax * i) / 240;
      th.push([u, Math.pow(0.5, u / Th)]);
    }
    poly(ctx, g.X, g.Y, th, pal.purple, 1.8, [6, 5]);

    if (hist.length > 1) {
      poly(ctx, g.X, g.Y, hist, pal.green, 2.2);
    }
    // 半衰期标记
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(g.X(0), g.Y(0.5));
    ctx.lineTo(g.X(tmax), g.Y(0.5));
    ctx.moveTo(g.X(Th), g.Y(0));
    ctx.lineTo(g.X(Th), g.Y(1));
    ctx.stroke();
    ctx.restore();
    label(ctx, `t = T`, g.X(Th), g.Y(0) + 16, pal.mut, 'center', 12);
    label(ctx, '剩余一半', g.X(0) + 6, g.Y(0.5) - 8, pal.mut, 'left', 12);

    // 当前时刻的动点
    ctx.save();
    ctx.fillStyle = pal.green;
    ctx.beginPath();
    ctx.arc(g.X(T), g.Y(frac), 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    label(ctx, '绿：实测    紫：理论', rc.x + 2, rc.y - 14, pal.mut, 'left', 13);

    st.readout([
      ['已过时间 t', fmt(T, 1) + ' s'],
      ['半衰期 T', fmt(Th, 1) + ' s'],
      ['t / T（过了几个半衰期）', fmt(T / Th, 2)],
      ['尚未衰变的核', left + ' 个'],
      ['剩余比例（实测）', fmt(frac * 100, 1) + ' %'],
      ['理论 2^(−t/T)', fmt(theory * 100, 1) + ' %'],
      ['规律', 'N = N₀(1/2)^(t/T)'],
    ]);
  }

  return { frame };
}
