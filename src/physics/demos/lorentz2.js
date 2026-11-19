/* 电10 洛伦兹力与带电粒子的圆周运动。
   匀强磁场垂直纸面向里，质子以速度 v 垂直射入，洛伦兹力始终指向圆心，
   所以轨迹是一个圆。半径 r = mv/(qB)、周期 T = 2πm/(qB)、频率 f = 1/T。
   正电荷档逆着看、负电荷档反过来：电荷变号，受力与转向都反过来，半径与周期不变。
   右栏画 r 随 B 的双曲线，读数栏的 r·B 拖 B 时不变（它等于 mv/q）。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const QE = 1.6e-19;
const MP = 1.67e-27;
const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const sup = n => String(n).split('').map(c => (c === '-' ? '⁻' : SUP[+c])).join('');

function sci(v, dig = 2) {
  if (!Number.isFinite(v) || v === 0) return '0';
  const [mb, ex] = v.toExponential(dig - 1).split('e');
  return mb + '×10' + sup(Number(ex));
}

function topOf(v) {
  if (!(v > 0) || !Number.isFinite(v)) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return p * (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10);
}

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const mode = q.mode === 'neg' ? 'neg' : 'pos';
    const v5 = clamp(fn(q.v, 3), 1, 10);
    const B = clamp(fn(q.B, 0.5), 0.1, 2);
    const v = v5 * 1e5;
    const sgn = mode === 'neg' ? -1 : 1;

    const key = [mode, v5, B].join('|');
    if (key !== last) {
      last = key;
      T = 0;
    }
    if (dt > 0) T += dt;

    const r = (MP * v) / (QE * B);
    const TT = (2 * Math.PI * MP) / (QE * B);
    const f = 1 / TT;

    ctx.clearRect(0, 0, w, h);

    const x0 = w * 0.07;
    const x1 = w * 0.55;
    const y0 = h * 0.16;
    const y1 = h * 0.86;

    // 匀强磁场：垂直纸面向里
    ctx.save();
    ctx.strokeStyle = pal.mut;
    ctx.lineWidth = 1.3;
    ctx.globalAlpha = 0.55;
    for (let gx = x0 + 12; gx < x1 - 8; gx += 32) {
      for (let gy = y0 + 12; gy < y1 - 8; gy += 32) {
        ctx.beginPath();
        ctx.moveTo(gx - 4, gy - 4);
        ctx.lineTo(gx + 4, gy + 4);
        ctx.moveTo(gx + 4, gy - 4);
        ctx.lineTo(gx - 4, gy + 4);
        ctx.stroke();
      }
    }
    ctx.restore();
    label(ctx, `B = ${fmt(B, 2)} T（垂直纸面向里）`, x0, y0 - 6, pal.mut, 'left', 14);

    // 圆轨道：以 v = 3、B = 0.5 时的半径画作 60 px 为基准按 r 线性映射，过大或过小时夹住
    // （旧系数 1.2e3 在默认档只给出 7.5 px，被压在下限上，拖 v 几乎看不到变化）
    const cx = (x0 + x1) / 2;
    const cy = (y0 + y1) / 2;
    const R = clamp(r * 9.6e3, 18, Math.min((x1 - x0) * 0.42, (y1 - y0) * 0.42));
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // 粒子在轨道上匀速转：正电荷按 ω < 0 走，负电荷反向
    // （画布 y 朝下，极角递增在屏幕上是顺时针；磁场向里时正电荷应当逆时针，所以取负号）
    const om = -1.6 * sgn;
    const ph = om * T;
    const px = cx + Math.cos(ph) * R;
    const py = cy + Math.sin(ph) * R;
    const tx = -Math.sin(ph) * Math.sign(om);
    const ty = Math.cos(ph) * Math.sign(om);

    // 速度（切线，绿）与洛伦兹力（指向圆心，紫）：箭头长度随轨道半径收放，小圆里不会戳过圆心
    const aV = Math.min(50, Math.max(18, R * 0.8));
    const aF = Math.min(44, Math.max(14, R * 0.75));
    arrow(ctx, px, py, px + tx * aV, py + ty * aV, pal.green, 2.4);
    label(ctx, 'v', px + tx * (aV + 8), py + ty * (aV + 8), pal.green, 'center', 15);
    arrow(ctx, px, py, px - Math.cos(ph) * aF, py - Math.sin(ph) * aF, pal.purple, 2.4);
    label(ctx, 'F', px - Math.cos(ph) * (aF + 8), py - Math.sin(ph) * (aF + 8), pal.purple, 'center', 15);

    // 粒子
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, 7, 0, Math.PI * 2);
    ctx.fillStyle = sgn > 0 ? pal.orange : pal.blue;
    ctx.fill();
    ctx.strokeStyle = pal.card;
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.restore();
    label(ctx, sgn > 0 ? '+' : '−', px, py, '#fff', 'center', 12);

    label(ctx, sgn > 0 ? '正电荷：沿逆时针方向转' : '负电荷：转向相反', x0, y1 + 14, pal.ink, 'left', 14);
    label(ctx, '洛伦兹力始终指向圆心，只改变速度方向、不做功', x0, y1 + 34, pal.faint, 'left', 13);

    /* 右栏：r 随 B 的双曲线（纵轴单位取 mm，上限按当前 v 现算——r 在 B = 0.1 T 处最大） */
    const rc = { x: w * 0.62, y: h * 0.18, w: w * 0.33, h: h * 0.56 };
    const rMax = ((MP * v) / (QE * 0.1)) * 1000; // mm
    // 留足余量：曲线左端（B = 0.1）别贴着上框，否则看着像出了坐标轴
    const hi = topOf(rMax * 1.35);
    const g = panel(ctx, rc, [0.1, 2], [0, hi], pal, { xlab: 'B/T', ylab: 'r/mm', nx: 5, ny: 4 });
    const pts = [];
    const bStart = Math.max(0.1, (MP * v * 1000) / (QE * hi));
    for (let bb = bStart; bb <= 2.0001; bb += 0.01) pts.push([bb, ((MP * v) / (QE * bb)) * 1000]);
    poly(ctx, g.X, g.Y, pts, pal.cyan, 2.2);
    spot(ctx, g.X(B), g.Y(r * 1000), 5, pal.orange, pal.bg2);
    // 纵轴名 'r/mm' 占着框内左上角，图例从它下面一行起
    label(ctx, 'r = mv/(qB)', rc.x + 8, rc.y + 34, pal.cyan, 'left', 14);
    label(ctx, 'B 越大，轨道越紧', rc.x + 8, rc.y + 54, pal.faint, 'left', 13);

    st.readout([
      ['速度 v', fmt(v5, 1) + '×10⁵ m/s'],
      ['磁感应强度 B', fmt(B, 2) + ' T'],
      ['轨道半径 r = mv/(qB)', fmt(r * 1000, 2) + ' mm'],
      ['周期 T = 2πm/(qB)', sci(TT * 1e9) + ' ns'],
      ['频率 f = 1/T', sci(f / 1e6) + ' MHz'],
      ['r·B', sci(r * B) + ' T·m'],
      ['mv/q（与 B 无关）', sci((MP * v) / QE) + ' T·m'],
    ]);
  }

  return { frame };
}
