/* 实12 误差与有效数字：
   左栏一把最小分度为 1 mm 的刻度尺，铅笔的左右两端各有一个读数，
   读数要估读到分度值的下一位（0.1 mm），末位因此是估出来的。
   右栏把同一根铅笔反复量若干次，各次读数围着真值散开：
   平均值逐次趋于稳定，平均值的标准不确定度按 σ/√n 收窄。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel } from './axes.js';

const STEP = 0.22;   // 相邻两次读数出现的间隔，秒
const EPS = 0.05;    // 单次读数的估读分散，cm

export function create(st) {
  let t = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const len = clamp(fn(q.len, 2.55), 1.5, 3);
    const n = clamp(Math.round(fn(q.n, 20)), 5, 40);
    const pos = clamp(fn(q.pos, 0.87), 0.15, 3.9 - len);

    const key = [len, pos, n].join(',');
    if (key !== last) { last = key; t = 0; }
    if (dt > 0) {
      t += dt;
      if (t > n * STEP + 2.8) t = 0;
    }
    const shown = clamp(Math.floor(t / STEP) + 1, 1, n);

    ctx.clearRect(0, 0, w, h);

    // ———— 左栏：刻度尺读数 ————
    const rx0 = w * 0.06;
    const rx1 = w * 0.60;
    const span = 4;                     // 尺面展示 0–4 cm
    const pxCm = (rx1 - rx0) / span;
    const ry = h * 0.56;
    const a = pos, b = pos + len;

    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.roundRect(rx0, ry, rx1 - rx0, 36, 4);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // 刻度：每毫米一道，逢半厘米加长，逢厘米最长并标数
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.1;
    for (let k = 0; k <= span * 10; k++) {
      const x = rx0 + k * pxCm * 0.1;
      const long = k % 10 === 0 ? 18 : k % 5 === 0 ? 12 : 7;
      ctx.beginPath();
      ctx.moveTo(x, ry);
      ctx.lineTo(x, ry + long);
      ctx.stroke();
    }
    ctx.restore();
    for (let k = 0; k <= span; k++) {
      label(ctx, String(k), rx0 + k * pxCm, ry + 28, pal.mut, 'center', 12);
    }

    label(ctx, '刻度尺读数：末位是估读出来的', rx0, h * 0.20, pal.mut, 'left', 13);
    label(ctx, '最小分度 1 mm，读数估读到 0.1 mm，所以读到小数点后两位（单位 cm）', rx0, h * 0.20 + 22, pal.faint, 'left', 12);

    // 铅笔
    const aPx = rx0 + a * pxCm;
    const bPx = rx0 + b * pxCm;
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.roundRect(aPx, ry - 36, bPx - aPx, 20, 4);
    ctx.fill();
    ctx.restore();
    label(ctx, '铅笔', (aPx + bPx) / 2, ry - 26, pal.bg2, 'center', 12);

    // 两端向尺面的投影
    for (const x of [aPx, bPx]) {
      ctx.save();
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 1.4;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x, ry - 16);
      ctx.lineTo(x, ry + 40);
      ctx.stroke();
      ctx.restore();
    }

    label(ctx, `a = ${fmt(a, 2)} cm`, aPx, ry + 62, pal.purple, 'center', 13);
    label(ctx, `b = ${fmt(b, 2)} cm`, bPx, ry + 62, pal.purple, 'center', 13);
    label(ctx, `L = b − a = ${fmt(len, 2)} cm`, (rx0 + rx1) / 2, ry + 88, pal.cyan, 'center', 14);

    // ———— 右栏：反复测量的散布 ————
    const readOf = i => {
      const r = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
      const u = r - Math.floor(r);
      return Math.round((len + (u - 0.5) * 2 * EPS) * 100) / 100;
    };

    let sum = 0;
    for (let i = 1; i <= shown; i++) sum += readOf(i);
    const mean = sum / shown;
    let ss = 0;
    for (let i = 1; i <= shown; i++) ss += (readOf(i) - mean) ** 2;
    const sd = shown > 1 ? Math.sqrt(ss / (shown - 1)) : 0;
    const uu = sd / Math.sqrt(Math.max(1, shown));

    const rect = { x: w * 0.64, y: h * 0.14, w: w * 0.32, h: h * 0.68 };
    const g = panel(ctx, rect, [0.5, n + 0.5], [len - 0.15, len + 0.15], pal, {
      xlab: '第几次', ylab: 'L / cm', nx: 4, ny: 6,
    });

    // 平均值的标准不确定度带
    if (shown >= 2 && uu > 0) {
      const y1 = g.Y(mean + uu), y2 = g.Y(mean - uu);
      ctx.save();
      ctx.fillStyle = pal.orange;
      ctx.globalAlpha = 0.16;
      ctx.fillRect(rect.x + 2, Math.min(y1, y2), rect.w - 4, Math.max(1.5, Math.abs(y2 - y1)));
      ctx.restore();
    }

    // 真值（绿虚线）与当前平均值（蓝实线）
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 5]);
    ctx.beginPath();
    ctx.moveTo(g.X(0.5), g.Y(len));
    ctx.lineTo(g.X(n + 0.5), g.Y(len));
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(g.X(0.5), g.Y(mean));
    ctx.lineTo(g.X(shown + 0.5), g.Y(mean));
    ctx.stroke();
    ctx.restore();

    // 各次读数
    ctx.save();
    ctx.fillStyle = pal.orange;
    for (let i = 1; i <= shown; i++) {
      ctx.beginPath();
      ctx.arc(g.X(i), g.Y(readOf(i)), 2.8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
    label(ctx, '绿 真值 · 蓝 平均 · 橙带 ±u', rect.x + 10, rect.y + 42, pal.mut, 'left', 12);

    // 结果按不确定度定位数：u 取一位有效数字，平均值与它末位对齐
    const sigRound = (v, k) => {
      if (!(v > 0)) return 0;
      const p = Math.pow(10, Math.floor(Math.log10(v)) - (k - 1));
      return Math.round(v / p + 1e-9) * p;
    };
    const uR = sigRound(uu, 1);
    const dp = uR > 0 ? Math.max(0, -Math.floor(Math.log10(uR) + 1e-9)) : 2;
    // 四舍五入到指定位（toFixed 在二进制里会把 2.5555 舍成 2.555，这里补一个 epsilon）
    const fix = (v, k) => {
      const m = Math.pow(10, k);
      return (Math.round(v * m + 1e-9) / m).toFixed(k);
    };
    const res = uR > 0 ? `(${fix(mean, dp)} ± ${fix(uR, dp)}) cm` : '—';

    st.readout([
      ['左端读数 a', fmt(a, 2) + ' cm'],
      ['右端读数 b', fmt(b, 2) + ' cm'],
      ['长度 L = b − a', fmt(len, 2) + ' cm'],
      ['已测次数', shown + ' / ' + n],
      ['平均值', fix(mean, 3) + ' cm'],
      ['标准差 σ', fmt(sd, 3) + ' cm'],
      ['平均值的标准不确定度 σ/√n', uR > 0 ? fix(uR, dp) + ' cm' : '—'],
      ['相对不确定度', mean > 0 && uR > 0 ? fmt((uR / mean) * 100, 2) + ' %' : '—'],
      ['结果（按不确定度定位数）', res],
      ['判读', '读数末位是估读位，多测几次末位还能再细一位'],
    ]);
  }

  return { frame };
}
