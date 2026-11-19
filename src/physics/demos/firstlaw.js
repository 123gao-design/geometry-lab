/* 热4 内能与热力学第一定律：ΔU = Q + W。
   两档：① 等压加热——气缸底部加热，气体吸热 Q，活塞缓慢升起、对外做功，
        横线下面的矩形面积就是 pΔV；② 绝热压缩——缸壁带保温层、Q = 0，
        外界把活塞压下去做功，p–V 图上曲线下面的面积全部变成内能，温度升高。
   按 n = 0.1 mol 的单原子理想气体算：ΔU = (3/2)nRΔT，p 用 kPa、V 用 L，
   于是 p·V 的数值就是焦耳（1 kPa·L = 1 J），读数栏的 Q、W、ΔU 可以逐项相加核对。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const N = 0.1; // 物质的量（mol）
const RGAS = 8.31;
const T0 = 300; // 初温（K）
const V0 = 20; // 初体积（L）
const P0 = (N * RGAS * T0) / V0; // ≈ 12.47 kPa
const GAMMA = 5 / 3; // 单原子理想气体的比热比
const RUN = 9; // 一次过程走几秒
const HOLD = 1.5; // 走到头停几秒再重放

export function create(st) {
  let last = '';
  let t = 0;
  let mols = [];

  // 分子位置存「缸内相对坐标」，活塞一动、窗口一改都不用重新安放
  const seed = () => {
    mols = [];
    for (let i = 0; i < 30; i++) {
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

  function molecules(x0, y0, x1, y1, T, dt) {
    const { ctx, pal } = st;
    const sp = Math.sqrt(T / T0);
    for (let i = 0; i < mols.length; i++) {
      const m = mols[i];
      if (dt > 0) {
        m.rx += m.vx * sp * 0.26 * dt;
        m.ry += m.vy * sp * 0.26 * dt;
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
      const x = x0 + m.rx * (x1 - x0);
      const y = y0 + m.ry * (y1 - y0);
      const fast = Math.hypot(m.vx, m.vy) > 1.02;
      ctx.beginPath();
      ctx.arc(x, y, 2.6, 0, Math.PI * 2);
      ctx.fillStyle = fast ? pal.orange : pal.blue;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  // 曲线下、到横轴之间的一块面积（做功的大小就画在这里）
  function fillArea(ctx, X, Y, pts, color) {
    if (pts.length < 2) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(X(pts[0][0]), Y(0));
    pts.forEach(p => ctx.lineTo(X(p[0]), Y(p[1])));
    ctx.lineTo(X(pts[pts.length - 1][0]), Y(0));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.16;
    ctx.fill();
    ctx.restore();
  }

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'adi' ? 'adi' : 'iso';
    const Qmax = clamp(fn(q.Q, 300), 100, 400);
    const kmax = clamp(fn(q.k, 2), 1.3, 2.5);

    const key = [mode, Qmax, kmax].join('|');
    if (key !== last) {
      last = key;
      seed();
    }

    if (dt > 0) t += dt;
    ctx.clearRect(0, 0, w, h);

    // 过程进度：前 RUN 秒按余弦推进，后 HOLD 秒停在末态，然后从头再来
    const tt = t % (RUN + HOLD);
    const u = tt >= RUN ? 1 : 0.5 - 0.5 * Math.cos((Math.PI * tt) / RUN);

    let V;
    let T;
    let p;
    let Q;
    let Won; // 外界对气体做的功（气体膨胀时为负）
    if (mode === 'iso') {
      Q = Qmax * u;
      const dT = Q / (2.5 * N * RGAS);
      T = T0 + dT;
      V = (V0 * T) / T0;
      p = P0;
      Won = -N * RGAS * dT; // 气体对外做功 pΔV = nRΔT
    } else {
      const k = 1 + (kmax - 1) * u;
      V = V0 / k;
      T = T0 * Math.pow(k, GAMMA - 1);
      p = (N * RGAS * T) / V;
      Q = 0; // 绝热
      Won = 1.5 * N * RGAS * (T - T0);
    }
    const dU = Q + Won;

    /* ── 左栏：气缸、活塞与热源 ───────────────────────── */
    const L = w * 0.1;
    const Rt = w * 0.34;
    const top = h * 0.15;
    const bot = h * 0.86;
    const VLo = mode === 'iso' ? V0 : V0 / kmax;
    const VHi = mode === 'iso' ? (V0 * (T0 + Qmax / (2.5 * N * RGAS))) / T0 : V0;
    const fy = clamp((V - VLo) / Math.max(1e-6, VHi - VLo), 0, 1);
    const pY = bot - (bot - top) * (0.2 + 0.7 * fy);

    // 缸内气体
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.09;
    ctx.fillRect(L, pY, Rt - L, bot - pY);
    ctx.restore();

    // 缸壁：等压档是普通金属壁，绝热档加一层保温虚线
    ctx.save();
    ctx.strokeStyle = mode === 'adi' ? pal.orange : pal.mut;
    ctx.lineWidth = mode === 'adi' ? 6 : 4;
    ctx.beginPath();
    ctx.moveTo(L, top);
    ctx.lineTo(L, bot);
    ctx.moveTo(Rt, top);
    ctx.lineTo(Rt, bot);
    ctx.moveTo(L - 10, bot);
    ctx.lineTo(Rt + 10, bot);
    ctx.stroke();
    if (mode === 'adi') {
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let y = top + 8; y < bot - 6; y += 12) {
        ctx.moveTo(L - 7, y);
        ctx.lineTo(L, y);
        ctx.moveTo(Rt, y);
        ctx.lineTo(Rt + 7, y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();

    // 活塞与连杆
    ctx.save();
    ctx.fillStyle = pal.line;
    ctx.fillRect(L, pY - 9, Rt - L, 9);
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(L, pY - 9, Rt - L, 9);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo((L + Rt) / 2, pY - 9);
    ctx.lineTo((L + Rt) / 2, top + 4);
    ctx.stroke();
    ctx.restore();

    molecules(L + 7, pY + 7, Rt - 7, bot - 8, T, dt);

    const cx = (L + Rt) / 2;
    if (mode === 'iso') {
      // 底部的热源：一块加热板 + 三簇火苗
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = 0.75;
      ctx.fillRect(L - 4, bot + 6, Rt - L + 8, 8);
      ctx.globalAlpha = 0.55;
      for (let i = 0; i < 3; i++) {
        const fx = L + 18 + ((Rt - L - 36) * i) / 2;
        const fh = 12 + 4 * Math.sin(t * 4 + i);
        ctx.beginPath();
        ctx.moveTo(fx - 7, bot + 6);
        ctx.quadraticCurveTo(fx - 4, bot + 6 - fh, fx, bot + 2 - fh);
        ctx.quadraticCurveTo(fx + 4, bot + 6 - fh, fx + 7, bot + 6);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
      arrow(ctx, L - 22, bot + 30, L - 22, bot - 6, pal.orange, 2.5);
      label(ctx, 'Q', L - 34, bot - 4, pal.orange, 'left', 15);
      label(ctx, '加热', cx, bot + 34, pal.mut, 'center', 14);
    } else {
      // 绝热档：活塞杆旁一支向下的箭头，表示外界把它压下去
      arrow(ctx, Rt + 26, pY - 34, Rt + 26, pY - 6, pal.green, 2.5);
      label(ctx, 'W', Rt + 34, pY - 20, pal.green, 'left', 15);
      label(ctx, '绝热层：Q = 0', cx, bot + 26, pal.mut, 'center', 14);
    }

    label(ctx, `V = ${fmt(V, 1)} L`, L, top - 20, pal.ink, 'left', 15);
    label(ctx, `T = ${fmt(T, 0)} K`, Rt, top - 20, pal.ink, 'right', 15);
    label(ctx, `p = ${fmt(p, 1)} kPa`, cx, bot + (mode === 'iso' ? 52 : 44), pal.ink, 'center', 15);

    /* ── 右栏：p–V 图，线下面积就是做功 ─────────────────── */
    const r = { x: w * 0.48, y: h * 0.17, w: w * 0.47, h: h * 0.64 };
    const xr = mode === 'iso' ? [0, 36] : [0, 24];
    const yr = mode === 'iso' ? [0, 18] : [0, 64];
    const g = panel(ctx, r, xr, yr, pal, {
      xlab: 'V/L',
      ylab: 'p/kPa',
      nx: 6,
      ny: 4,
    });

    const pts = [];
    if (mode === 'iso') {
      pts.push([V0, P0], [V, P0]);
      fillArea(ctx, g.X, g.Y, pts, pal.blue);
      poly(ctx, g.X, g.Y, pts, pal.blue, 2.4);
      poly(ctx, g.X, g.Y, [[V, 0], [V, P0]], pal.faint, 1.2, [4, 4]);
      poly(ctx, g.X, g.Y, [[V0, 0], [V0, P0]], pal.faint, 1.2, [4, 4]);
      label(ctx, '横线下的矩形面积 = pΔV', r.x + 8, r.y + r.h - 12, pal.mut, 'left', 14);
    } else {
      for (let v = V; v <= V0 + 1e-9; v += 0.25) {
        const vv = Math.min(v, V0);
        pts.push([vv, P0 * Math.pow(V0 / vv, GAMMA)]);
      }
      fillArea(ctx, g.X, g.Y, pts, pal.orange);
      poly(ctx, g.X, g.Y, pts, pal.orange, 2.4);
      poly(ctx, g.X, g.Y, [[V, 0], [V, p]], pal.faint, 1.2, [4, 4]);
      label(ctx, '曲线下的面积 = 外界做的功', r.x + 8, r.y + r.h - 12, pal.mut, 'left', 14);
    }
    spot(ctx, g.X(V), g.Y(p), 5, pal.orange, pal.bg2);

    st.readout([
      ['体积 V', fmt(V, 1) + ' L'],
      ['温度 T', fmt(T, 0) + ' K'],
      ['吸收热量 Q', fmt(Q, 0) + ' J'],
      ['外界做功 W', fmt(Won, 0) + ' J'],
      ['内能变化 ΔU', fmt(dU, 0) + ' J'],
      ['ΔU − (Q + W)', fmt(dU - (Q + Won), 2)],
    ]);
  }

  return { frame };
}
