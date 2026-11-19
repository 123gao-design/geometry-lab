/* 热5 热力学第二定律与能量守恒。
   两档：① 热机——高温热源 T₁ 供热 Q₁，热机对外做功 W，余下的 Q₂ 排向低温热源 T₂；
        实际热机的效率只有卡诺效率 1 − T₂/T₁ 的八五折，η 永远越不过这条上限。
        ② 扩散——抽走隔板后分子自发铺满两半，读数给「全部回到左半」的概率 2^-N。
   热量取 J，Q₁ 固定 400 J，读数栏可以逐项相减核对。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const Q1 = 400; // 每循环从高温热源吸的热（J）
const NET = 0.85; // 实际效率与卡诺效率之比
const OPEN = 1.2; // 抽走隔板的时刻（s）
const WIN = 25; // 右栏的时间窗口（s）

const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = n => String(n).split('').map(d => SUP[+d]).join('');

/** 概率写成 6.0×10⁻⁸ 的形状（读数栏用） */
function probTxt(p) {
  const [mb, ex] = p.toExponential(1).split('e');
  return mb + '×10⁻' + sup(Math.abs(Number(ex)));
}

export function create(st) {
  let last = '';
  let t = 0;
  let wheel = 0;
  let mols = [];
  let hist = []; // 左半分子数的时间序列
  let acc = 0;

  function seed(nN) {
    t = 0;
    wheel = 0;
    acc = 0;
    hist = [];
    mols = [];
    for (let i = 0; i < nN; i++) {
      const a = Math.random() * Math.PI * 2;
      const v = 0.55 + Math.random() * 0.35;
      mols.push({
        x: 0.02 + Math.random() * 0.46,
        y: 0.02 + Math.random() * 0.96,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
      });
    }
  }

  // 两隔间：抽板之前分子卡在左半，抽板之后两半之间自由来回
  function gas(x0, y0, x1, y1, open, dt) {
    const { ctx, pal } = st;
    let nl = 0;
    for (let i = 0; i < mols.length; i++) {
      const m = mols[i];
      if (dt > 0) {
        m.x += m.vx * 0.26 * dt;
        m.y += m.vy * 0.26 * dt;
        if (m.x < 0.01) {
          m.x = 0.01;
          m.vx = Math.abs(m.vx);
        } else if (m.x > 0.99) {
          m.x = 0.99;
          m.vx = -Math.abs(m.vx);
        }
        if (m.y < 0.01) {
          m.y = 0.01;
          m.vy = Math.abs(m.vy);
        } else if (m.y > 0.99) {
          m.y = 0.99;
          m.vy = -Math.abs(m.vy);
        }
        if (!open && m.x > 0.48) {
          m.x = 0.48;
          m.vx = -Math.abs(m.vx);
        }
      }
      if (m.x < 0.5) nl++;
      ctx.beginPath();
      ctx.arc(x0 + m.x * (x1 - x0), y0 + m.y * (y1 - y0), 3.4, 0, Math.PI * 2);
      ctx.fillStyle = m.x < 0.5 ? pal.blue : pal.orange;
      ctx.globalAlpha = 0.85;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    return nl;
  }

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'mix' ? 'mix' : 'eng';
    const T1 = clamp(fn(q.T1, 600), 500, 900);
    const T2 = clamp(fn(q.T2, 300), 250, 420);
    const nN = Math.round(clamp(fn(q.N, 24), 12, 48));

    const key = [mode, T1, T2, nN].join('|');
    if (key !== last) {
      last = key;
      seed(nN);
    }

    if (dt > 0) t += dt;
    ctx.clearRect(0, 0, w, h);

    if (mode === 'eng') {
      wheel += dt * 2.4;
      const etaC = 1 - T2 / T1; // 卡诺上限（T₁ 恒大于 T₂）
      const eta = NET * etaC; // 实际效率
      const W = Q1 * eta;
      const Q2 = Q1 - W;

      /* ── 左栏：两个热源与中间的热机 ───────────────────── */
      const bx = w * 0.07;
      const bw = w * 0.34;
      const cx = bx + bw / 2;
      const hotY = h * 0.1;
      const hotH = h * 0.1;
      const coldY = h * 0.8;
      const coldH = h * 0.1;
      const ey = h * 0.4;
      const eh = h * 0.18;
      const ew = bw * 0.52;
      const ex = cx - ew / 2;

      // 高温热源与低温热源
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = 0.16;
      ctx.fillRect(bx, hotY, bw, hotH);
      ctx.fillStyle = pal.blue;
      ctx.fillRect(bx, coldY, bw, coldH);
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = pal.orange;
      ctx.strokeRect(bx, hotY, bw, hotH);
      ctx.strokeStyle = pal.blue;
      ctx.strokeRect(bx, coldY, bw, coldH);
      ctx.restore();
      label(ctx, '高温热源', bx + 10, hotY + hotH / 2, pal.orange, 'left', 14);
      label(ctx, `T₁ = ${fmt(T1, 0)} K`, bx + bw - 10, hotY + hotH / 2, pal.ink, 'right', 14);
      label(ctx, '低温热源', bx + 10, coldY + coldH / 2, pal.blue, 'left', 14);
      label(ctx, `T₂ = ${fmt(T2, 0)} K`, bx + bw - 10, coldY + coldH / 2, pal.ink, 'right', 14);

      // 热机
      ctx.save();
      ctx.fillStyle = pal.purple;
      ctx.globalAlpha = 0.12;
      ctx.fillRect(ex, ey, ew, eh);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 1.6;
      ctx.strokeRect(ex, ey, ew, eh);
      ctx.restore();
      label(ctx, '热机', cx, ey + eh / 2, pal.ink, 'center', 16);

      // 三支能量箭头：Q₁ 进、W 出、Q₂ 排
      arrow(ctx, cx, hotY + hotH, cx, ey - 4, pal.orange, 2.6);
      label(ctx, `Q₁ = ${fmt(Q1, 0)} J`, cx + 10, (hotY + hotH + ey) / 2, pal.orange, 'left', 15);
      arrow(ctx, cx, ey + eh + 4, cx, coldY, pal.blue, 2.6);
      label(ctx, `Q₂ = ${fmt(Q2, 0)} J`, cx + 10, (ey + eh + coldY) / 2, pal.blue, 'left', 15);
      arrow(ctx, ex + ew, ey + eh / 2, ex + ew + w * 0.05, ey + eh / 2, pal.green, 2.6);
      // W 的读数放在轮子上方一行：写在箭头延长线上的话，正压在轮子圆圈上
      label(ctx, `W = ${fmt(W, 0)} J`, ex + ew + 4, ey + eh / 2 - Math.min(w * 0.035, h * 0.06) - 12, pal.green, 'left', 15);

      // 输出端的轮子：W 去了哪里
      const wr = Math.min(w * 0.035, h * 0.06);
      const wxc = ex + ew + w * 0.05 + wr + 4;
      const wyc = ey + eh / 2;
      ctx.save();
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(wxc, wyc, wr, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1.4;
      for (let i = 0; i < 4; i++) {
        const a = wheel + (i * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(wxc - Math.cos(a) * wr, wyc - Math.sin(a) * wr);
        ctx.lineTo(wxc + Math.cos(a) * wr, wyc + Math.sin(a) * wr);
        ctx.stroke();
      }
      ctx.restore();

      /* ── 右栏：效率随低温热源温度的变化 ───────────────── */
      const r = { x: w * 0.57, y: h * 0.16, w: w * 0.39, h: h * 0.62 };
      const g = panel(ctx, r, [250, 420], [0, 1], pal, { xlab: 'T₂/K', nx: 4, ny: 5 });

      const carnot = [];
      for (let x = 250; x <= 420.001; x += 2) carnot.push([x, 1 - x / T1]);
      poly(ctx, g.X, g.Y, carnot, pal.orange, 2.2);
      poly(ctx, g.X, g.Y, [[250, eta], [420, eta]], pal.green, 1.6, [5, 4]);
      spot(ctx, g.X(T2), g.Y(etaC), 5, pal.orange, pal.bg2);
      spot(ctx, g.X(T2), g.Y(eta), 5, pal.green, pal.bg2);
      label(ctx, '卡诺上限 η = 1 − T₂/T₁', r.x + 10, r.y + 15, pal.orange, 'left', 14);
      label(ctx, '实际效率 η', r.x + 10, r.y + 36, pal.green, 'left', 14);

      st.readout([
        ['高温热源 T₁', fmt(T1, 0) + ' K'],
        ['低温热源 T₂', fmt(T2, 0) + ' K'],
        ['吸热 Q₁', fmt(Q1, 0) + ' J'],
        ['对外做功 W', fmt(W, 0) + ' J'],
        ['放热 Q₂', fmt(Q2, 0) + ' J'],
        ['实际效率 η', fmt(eta, 3)],
        ['卡诺上限 η_c', fmt(etaC, 3)],
        ['η_c − η', fmt(etaC - eta, 3)],
      ]);
      return;
    }

    /* ── 扩散档：隔板抽走后的自发铺开 ───────────────────── */
    const open = t >= OPEN;
    const bx = w * 0.08;
    const bw = w * 0.4;
    const by = h * 0.18;
    const bh = h * 0.62;

    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 3;
    ctx.strokeRect(bx, by, bw, bh);
    ctx.lineWidth = open ? 2 : 3;
    ctx.strokeStyle = open ? pal.faint : pal.ink;
    if (open) ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(bx + bw / 2, by);
    ctx.lineTo(bx + bw / 2, by + bh);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    const nl = gas(bx + 4, by + 4, bx + bw - 4, by + bh - 4, open, dt);

    label(ctx, open ? '隔板已抽走' : '隔板挡在中间', bx, by - 14, pal.mut, 'left', 14);
    label(ctx, open ? '分子自发铺满两半' : '分子全在左半', bx + bw, by - 14, pal.ink, 'right', 14);

    if (dt > 0 && open) {
      acc += dt;
      if (acc >= 0.1) {
        acc = 0;
        hist.push([t, nl]);
      }
    }

    const r = { x: w * 0.56, y: h * 0.16, w: w * 0.4, h: h * 0.6 };
    const g = panel(ctx, r, [0, WIN], [0, nN], pal, { xlab: 't/s', ylab: 'n左', nx: 5, ny: 4 });
    const off = Math.max(0, t - WIN);
    const pts = hist.filter(p => p[0] >= off - 1e-9).map(p => [p[0] - off, p[1]]);
    poly(ctx, g.X, g.Y, pts, pal.blue, 2);
    poly(ctx, g.X, g.Y, [[0, nN / 2], [WIN, nN / 2]], pal.faint, 1.4, [5, 4]);
    label(ctx, '平衡：两半各占一半', r.x + r.w - 8, r.y + 15, pal.faint, 'right', 13);
    if (pts.length) spot(ctx, g.X(pts[pts.length - 1][0]), g.Y(nl), 5, pal.blue, pal.bg2);

    st.readout([
      ['左半分子数', String(nl)],
      ['右半分子数', String(mols.length - nl)],
      ['分子总数 N', String(mols.length)],
      ['全部回到左半的概率', '2⁻' + sup(mols.length) + ' ≈ ' + probTxt(Math.pow(2, -mols.length))],
      ['观测时间 t', fmt(t, 1) + ' s'],
    ]);
  }

  return { frame };
}
