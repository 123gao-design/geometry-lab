/* 热3 理想气体状态方程：pV = nRT。
   两档：① 一定质量——活塞来回走一遍，物质的量 n 与温度 T 由滑块给定，
        压强按 p = nRT/V 现算，右栏 p–V 图上的点沿同一条双曲线走；改 n 或 T 就换一条曲线。
        ② 打气——固定体积的储气罐，打气筒每压一下多打进 0.1 mol 气体，
        物质的量一次次增加，压强沿一条直线上升。
   单位取 L 与 atm，R = 0.0821 L·atm/(mol·K)；两档读数栏最后一行 pV/(nT) 都不变。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const RGAS = 0.0821;
const PERIOD = 10; // 一定质量档：活塞一遍来回的秒数
const STROKE = 1.5; // 打气档：每打一次的秒数
const NSTROKE = 12; // 打气档：一共打几下
const N0 = 0.5; // 储气罐原有气体（mol）
const N1 = 0.1; // 每打一次打进的气体（mol）
const VTANK = 20; // 储气罐体积（L）

export function create(st) {
  let last = '';
  let t = 0;
  let mols = [];

  // 分子位置用「容器内相对坐标」存，缸一变形、窗口一改都不用重新安放
  const seed = () => {
    mols = [];
    for (let i = 0; i < 80; i++) {
      const a = Math.random() * Math.PI * 2;
      const f = 0.75 + Math.random() * 0.5;
      mols.push({
        rx: 0.04 + Math.random() * 0.92,
        ry: 0.05 + Math.random() * 0.9,
        vx: Math.cos(a) * f,
        vy: Math.sin(a) * f,
      });
    }
    t = 0;
  };

  // 画 cnt 枚分子（前 cnt 枚），温度越高跑得越快，快的那几枚画成橙色
  function molecules(x0, y0, x1, y1, cnt, T, dt) {
    const { ctx, pal } = st;
    const sp = Math.sqrt(T / 300);
    if (dt > 0) {
      for (let i = 0; i < cnt; i++) {
        const m = mols[i];
        m.rx += m.vx * sp * 0.24 * dt;
        m.ry += m.vy * sp * 0.24 * dt;
        if (m.rx < 0.03) {
          m.rx = 0.03;
          m.vx = Math.abs(m.vx);
        } else if (m.rx > 0.97) {
          m.rx = 0.97;
          m.vx = -Math.abs(m.vx);
        }
        if (m.ry < 0.04) {
          m.ry = 0.04;
          m.vy = Math.abs(m.vy);
        } else if (m.ry > 0.96) {
          m.ry = 0.96;
          m.vy = -Math.abs(m.vy);
        }
      }
    }
    for (let i = 0; i < cnt; i++) {
      const m = mols[i];
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

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'pump' ? 'pump' : 'state';
    const Tset = clamp(fn(q.T, 300), 200, 450);
    const nSet = clamp(fn(q.n, 1), 0.5, 3);

    const key = [mode, Tset, nSet].join('|');
    if (key !== last) {
      last = key;
      seed();
    }

    if (dt > 0) t += dt;
    ctx.clearRect(0, 0, w, h);

    /* ── 一定质量档：气缸 + 活塞 + p–V 双曲线 ───────────── */
    if (mode === 'state') {
      const u = 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / PERIOD);
      const n = nSet;
      const T = Tset;
      const V = 14 + 28 * u;
      const p = (n * RGAS * T) / V;

      const L = w * 0.09;
      const Rt = w * 0.36;
      const top = h * 0.14;
      const bot = h * 0.86;
      const H = bot - top;
      const chH = H * (0.24 + 0.7 * ((V - 14) / 28));
      const pY = bot - chH;

      ctx.save();
      ctx.fillStyle = pal.blue;
      ctx.globalAlpha = 0.09;
      ctx.fillRect(L, pY, Rt - L, chH);
      ctx.restore();

      // 缸壁与缸底
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

      const cnt = clamp(Math.round(n * 16), 8, 64);
      molecules(L + 7, pY + 7, Rt - 7, bot - 8, cnt, T, dt);

      // 活塞顶上那支橙色箭头：越长压强越大（活塞越高，可用的竖直空间越小）
      const ax = (L + Rt) / 2 + 52;
      const room = Math.max(12, pY - top - 26);
      const aLen = clamp(14 + p * 9, 16, Math.min(78, room));
      arrow(ctx, ax, pY - 16, ax, pY - 16 - aLen, pal.orange, 2.5);
      label(ctx, '压强 p', ax + 8, pY - 22 - aLen / 2, pal.orange, 'left', 15);

      label(ctx, '气缸与活塞', L, top - 18, pal.mut, 'left', 14);
      label(ctx, `V = ${fmt(V, 1)} L`, L, bot + 22, pal.ink, 'left', 15);
      label(ctx, `n = ${fmt(n, 1)} mol`, (L + Rt) / 2, bot + 22, pal.ink, 'center', 15);
      label(ctx, `T = ${fmt(T, 0)} K`, Rt, bot + 22, pal.ink, 'right', 15);

      // 右栏：p–V 图，同一条曲线上 n、T 都不变
      const r = { x: w * 0.48, y: h * 0.16, w: w * 0.47, h: h * 0.66 };
      const cfg = { xr: [0, 50], yr: [0, 9] };
      const g = panel(ctx, r, cfg.xr, cfg.yr, pal, {
        xlab: 'V/L',
        ylab: 'p/atm',
        nx: 5,
        ny: 4,
      });

      const C = n * RGAS * T; // pV = C
      const pts = [];
      for (let v = Math.max(0.6, C / cfg.yr[1]); v <= cfg.xr[1] + 1e-9; v += 0.25) pts.push([v, C / v]);
      poly(ctx, g.X, g.Y, pts, pal.blue, 2.2);
      poly(ctx, g.X, g.Y, [[V, 0], [V, p]], pal.faint, 1.2, [4, 4]);
      poly(ctx, g.X, g.Y, [[0, p], [V, p]], pal.faint, 1.2, [4, 4]);
      spot(ctx, g.X(V), g.Y(p), 5, pal.orange, pal.bg2);

      label(ctx, 'p = nRT/V：n 与 T 不变，点沿同一条曲线走', r.x, r.y - 18, pal.ink, 'left', 15);

      st.readout([
        ['体积 V', fmt(V, 1) + ' L'],
        ['温度 T', fmt(T, 0) + ' K'],
        ['物质的量 n', fmt(n, 1) + ' mol'],
        ['压强 p', fmt(p, 2) + ' atm'],
        ['pV/(nT)', fmt((p * V) / (n * T), 4)],
      ]);
      return;
    }

    /* ── 打气档：储气罐 + 打气筒，n 逐次增加 ─────────────── */
    const cyc = NSTROKE * STROKE + 2.4;
    const tt = t % cyc;
    const kk = Math.min(NSTROKE, Math.floor(tt / STROKE));
    const ph = clamp((tt - kk * STROKE) / STROKE, 0, 1);
    const kShow = Math.min(NSTROKE, kk + (ph >= 0.45 ? 1 : 0));
    const n = N0 + kShow * N1;
    const T = Tset;
    const p = (n * RGAS * T) / VTANK;

    const tx0 = w * 0.1;
    const tx1 = w * 0.44;
    const ty0 = h * 0.4;
    const ty1 = h * 0.88;
    const px0 = w * 0.16;
    const px1 = w * 0.32;
    const pyTop = h * 0.1;
    const pyBot = h * 0.3;
    const cx = (px0 + px1) / 2;

    // 罐内气体
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.09;
    ctx.fillRect(tx0 + 3, ty0 + 3, tx1 - tx0 - 6, ty1 - ty0 - 3);
    ctx.restore();

    // 罐壁：顶边给接管留一道缺口
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(tx0, ty0);
    ctx.lineTo(cx - 7, ty0);
    ctx.moveTo(cx + 7, ty0);
    ctx.lineTo(tx1, ty0);
    ctx.moveTo(tx0, ty0);
    ctx.lineTo(tx0, ty1);
    ctx.moveTo(tx1, ty0);
    ctx.lineTo(tx1, ty1);
    ctx.moveTo(tx0 - 10, ty1);
    ctx.lineTo(tx1 + 10, ty1);
    ctx.stroke();
    ctx.restore();

    // 打气筒与活塞：一次行程里先压下去、再提起来
    const e = ph < 0.45 ? ph / 0.45 : ph < 0.8 ? 1 - (ph - 0.45) / 0.35 : 0;
    const plateY = pyTop + 12 + e * (pyBot - pyTop - 26);

    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(px0, pyTop);
    ctx.lineTo(px0, pyBot);
    ctx.moveTo(px1, pyTop);
    ctx.lineTo(px1, pyBot);
    ctx.stroke();

    // 接管
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(cx, pyBot);
    ctx.lineTo(cx, ty0);
    ctx.stroke();

    // 活塞与连杆
    ctx.fillStyle = pal.line;
    ctx.fillRect(px0, plateY, px1 - px0, 8);
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(px0, plateY, px1 - px0, 8);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx, plateY);
    ctx.lineTo(cx, pyTop - 12);
    ctx.stroke();
    ctx.restore();

    const cnt = clamp(Math.round(n * 16), 8, 40);
    molecules(tx0 + 8, ty0 + 8, tx1 - 8, ty1 - 8, cnt, T, dt);

    label(ctx, '打气筒', px0, pyTop - 20, pal.mut, 'left', 14);
    label(ctx, '储气罐', tx0, ty0 - 12, pal.mut, 'left', 14);
    label(ctx, `V = ${VTANK} L`, tx0, ty1 + 22, pal.ink, 'left', 15);
    label(ctx, `已打 ${kShow} 次`, tx1, ty1 + 22, pal.ink, 'right', 15);
    label(ctx, `n = ${fmt(n, 2)} mol`, (tx0 + tx1) / 2, ty0 + 26, pal.ink, 'center', 15);

    // 右栏：p 随打气次数线性上升
    const r = { x: w * 0.5, y: h * 0.16, w: w * 0.45, h: h * 0.66 };
    const pMax = ((N0 + NSTROKE * N1) * RGAS * T) / VTANK;
    const yTop = Math.max(1, Math.ceil(pMax * 1.18 * 4) / 4);
    const g = panel(ctx, r, [0, NSTROKE], [0, yTop], pal, {
      xlab: '打气次数',
      ylab: 'p/atm',
      nx: 6,
      ny: 4,
    });

    const pts = [];
    for (let k = 0; k <= NSTROKE; k++) pts.push([k, ((N0 + k * N1) * RGAS * T) / VTANK]);
    poly(ctx, g.X, g.Y, pts, pal.blue, 2.2);
    poly(ctx, g.X, g.Y, [[kShow, 0], [kShow, p]], pal.faint, 1.2, [4, 4]);
    poly(ctx, g.X, g.Y, [[0, p], [kShow, p]], pal.faint, 1.2, [4, 4]);
    spot(ctx, g.X(kShow), g.Y(p), 5, pal.orange, pal.bg2);

    label(ctx, '每打一次 n 增加 0.1 mol，p 随之直线上升', r.x, r.y - 18, pal.ink, 'left', 15);

    st.readout([
      ['打气次数', kShow + ' 次'],
      ['物质的量 n', fmt(n, 2) + ' mol'],
      ['温度 T', fmt(T, 0) + ' K'],
      ['压强 p', fmt(p, 2) + ' atm'],
      ['pV/(nT)', fmt((p * VTANK) / (n * T), 4)],
    ]);
  }

  return { frame };
}
