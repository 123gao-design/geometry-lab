/* 演示：超重与失重。
   电梯在井道里跑一趟：静止 → 匀加速 → 匀速 → 匀减速 → 到站停，然后重放。
   分「上行」「下行」两档：上行时先加速上升（加速度向上）、超重，后减速上升（加速度向下）、失重；
   下行时先加速下降（加速度向下）、失重，后减速下降（加速度向上）、超重。
   一句话：超重失重看加速度朝哪边，与速度朝哪边无关。
   轿厢里物块站在体重计上，取竖直向上为正：N − mg = ma，所以 N = m(g + a)。
   右边两根条把实重与视重并排放着，长度的差就是超重或失重的部分。 */

import { label, arrow, clamp, fmt } from '../gfx.js';

const G = 9.8;
const T0 = 0.7;      // 起点的静止
const T1 = 1.1;      // 加速段
const T2 = 1.1;      // 匀速段
const T4 = 0.7;      // 到站停一下
const V_CRUISE = 1.5; // 加速度取 0 时的巡航速度

const PHASE_UP = ['静止', '加速上升', '匀速上升', '减速上升', '到站停留'];
const PHASE_DN = ['静止', '加速下降', '匀速下降', '减速下降', '到站停留'];

export function create(st) {
  let t = 0;
  let shown = -1;      // 视重条当前显示的值（缓动用，免得逐帧跳）
  let last = '';

  const reset = () => { t = 0; shown = -1; };
  reset();

  function frame(dt) {
    const p = st.params;
    const mode = p.mode === 'down' ? 'down' : 'up';
    const dir = mode === 'down' ? -1 : 1;
    const m = clamp(Number(p.m) || 2, 0.5, 5);
    const an = Number(p.a);
    const a = clamp(Number.isFinite(an) ? an : 2, 0, G);
    const key = mode + '|' + m + '|' + a;
    if (key !== last) { last = key; reset(); }

    /* ── 一趟的时间表 ── */
    const moving = a > 0.25;                 // 加速度近似为 0 时改跑匀速档
    const v1 = moving ? a * T1 : V_CRUISE;
    const d1 = moving ? 0.5 * a * T1 * T1 : 0;
    const d2 = v1 * T2;
    const L = 2 * d1 + d2;                   // 全程距离（按同一比例映射到井道里的像素）
    const cycle = T0 + (moving ? 3 * T1 : 0) + T2 + T4;

    if (dt > 0) {
      t += dt;
      if (t > cycle) t %= cycle;
    }

    /* 当前时刻处在哪一段：acc 是竖直加速度（向上为正），v 是速率，s 是已行驶距离 */
    let ph = 0, acc = 0, v = 0, s = 0;
    {
      let u = t;
      if (u < T0) {
        ph = 0;
      } else {
        u -= T0;
        if (!moving) {
          if (u < T2) { ph = 2; v = v1; s = v1 * u; }
          else { ph = 4; s = L; }
        } else if (u < T1) {
          ph = 1; acc = dir * a; v = a * u; s = 0.5 * a * u * u;
        } else if ((u -= T1) < T2) {
          ph = 2; v = v1; s = d1 + v1 * u;
        } else if ((u -= T2) < T1) {
          ph = 3; acc = -dir * a; v = v1 - a * u; s = d1 + d2 + v1 * u - 0.5 * a * u * u;
        } else {
          ph = 4; s = L;
        }
      }
    }

    const mg = m * G;
    const N = Math.max(0, m * (G + acc));

    if (shown < 0) shown = N;
    if (dt > 0) {
      shown += (N - shown) * Math.min(1, dt * 8);
      if (Math.abs(shown - N) < 0.02) shown = N;
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const narrow = w < 640;
    const tiny = w < 480;                    // 手机上一整幅只有三百来像素宽
    const sw = tiny ? w * 0.62 : narrow ? w * 0.57 : w * 0.55;
    const x0 = 22;
    const x1 = sw - 14;
    const bannerY = 28;
    const y0 = 48;
    const y1 = h - 20;
    const lane = tiny ? 58 : narrow ? 82 : 108; // 井道右侧一段让给加速度箭头

    /* ── 顶部一行：阶段与状态 ── */
    label(ctx, '阶段 ' + (mode === 'up' ? PHASE_UP[ph] : PHASE_DN[ph]), x0, bannerY, pal.mut, 'left', 13);
    const empty = N < 0.05;
    const state = empty ? '完全失重' : acc > 0.05 ? '超重' : acc < -0.05 ? '失重' : '视重 = 实重';
    const stateCol = empty ? pal.purple : acc > 0.05 ? pal.orange : acc < -0.05 ? pal.green : pal.mut;
    label(ctx, state, x1, bannerY, stateCol, 'right', 15);

    /* ── 井道：两道边墙 + 静止不动的楼层线，轿厢从中间穿过 ── */
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(x0 + 0.5, y0);
    ctx.lineTo(x0 + 0.5, y1);
    ctx.moveTo(x1 - 0.5, y0);
    ctx.lineTo(x1 - 0.5, y1);
    ctx.stroke();
    ctx.strokeStyle = pal.faint;
    ctx.globalAlpha = 0.75;
    ctx.setLineDash([5, 6]);
    ctx.lineWidth = 1;
    for (let k = 1; k <= 4; k++) {
      const fy = y0 + ((y1 - y0) * k) / 5;
      ctx.beginPath();
      ctx.moveTo(x0 + 2, Math.round(fy) + 0.5);
      ctx.lineTo(x1 - 2, Math.round(fy) + 0.5);
      ctx.stroke();
    }
    ctx.restore();

    /* ── 轿厢位置 ── */
    const cabinW = (x1 - x0) - lane - 10;
    const cx = x0 + 5 + cabinW / 2;
    const cabinL = cx - cabinW / 2;
    const cabinR = cx + cabinW / 2;
    const Hc = clamp(Math.min(200, (y1 - y0) * 0.52), 150, 220);
    const topStop = y0 + 4;
    const botStop = y1 - Hc - 4;
    const pr = L > 0 ? clamp(s / L, 0, 1) : 0;
    const cabinTop = mode === 'up'
      ? botStop + (topStop - botStop) * pr
      : topStop + (botStop - topStop) * pr;

    /* 轿厢本体 */
    ctx.save();
    ctx.fillStyle = pal.card;
    ctx.globalAlpha = 0.72;
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.rect(cabinL, cabinTop, cabinW, Hc);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.stroke();
    /* 轿底 */
    ctx.beginPath();
    ctx.moveTo(cabinL, Math.round(cabinTop + Hc) - 0.5);
    ctx.lineTo(cabinR, Math.round(cabinTop + Hc) - 0.5);
    ctx.stroke();
    ctx.restore();

    /* ── 轿厢里的人、体重计与两个力 ── */
    const floorY = cabinTop + Hc - 7;
    const scaleTop = floorY - 7;
    const feet = scaleTop;
    const kp = tiny ? 0.72 : 1;                // 窄屏上人缩小一些，两侧留给力的标签
    const platW = Math.min(88, cabinW - 20);

    ctx.save();
    /* 体重计台面 */
    ctx.fillStyle = pal.line;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.rect(cx - platW / 2, scaleTop, platW, 7);
    ctx.fill();
    ctx.globalAlpha = 1;
    /* 人：头与身子 */
    ctx.fillStyle = pal.mut;
    ctx.beginPath();
    ctx.arc(cx, feet - 55 * kp, 10 * kp, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx - 16 * kp, feet);
    ctx.lineTo(cx - 13 * kp, feet - 40 * kp);
    ctx.quadraticCurveTo(cx, feet - 46 * kp, cx + 13 * kp, feet - 40 * kp);
    ctx.lineTo(cx + 16 * kp, feet);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    const cyP = feet - 34 * kp;                // 力的作用点：身体中部
    const fx = tiny ? 19 : narrow ? 28 : 44;
    const fs = tiny ? 12 : 13;
    /* 两个力共用一把尺子：向上留出一行标签，向下到脚底为止（不穿过体重计） */
    const sc = Math.min(46 / Math.max(mg, 1), (cyP - cabinTop - 20) / Math.max(N, 1),
      Math.max(6, feet - cyP - 4) / Math.max(mg, 1));

    const nLen = N * sc;
    if (nLen > 2) {
      arrow(ctx, cx + fx, cyP, cx + fx, cyP - nLen, pal.green, 2.4);
    }
    const mLen = mg * sc;
    if (mLen > 2) {
      arrow(ctx, cx - fx, cyP, cx - fx, cyP + mLen, pal.orange, 2.4);
    }

    /* 两个力的量值：宽屏上贴着箭头末端（水平、竖直都夹进轿厢里），
       窄屏上箭头与身体挨得近，改成轿厢左上角的两行图例，免得字压在人和箭头上 */
    const nTxt = 'N = ' + fmt(N, 1) + ' N';
    const mTxt = 'mg = ' + fmt(mg, 1) + ' N';
    if (tiny) {
      label(ctx, nTxt, cabinL + 7, cabinTop + 20, pal.green, 'left', fs);
      label(ctx, mTxt, cabinL + 7, cabinTop + 38, pal.orange, 'left', fs);
    } else {
      const loY = cabinTop + 16;
      const hiY = cabinTop + Hc - 12;
      const nY = clamp(cyP - nLen, loY, hiY);
      label(ctx, nTxt, cx + fx + 7, nY, pal.green, 'left', fs);
      const mY = clamp(cyP + mLen, loY, hiY);
      label(ctx, mTxt, cx - fx - 7, mY, pal.orange, 'right', fs);
    }

    /* ── 右 lane：加速度箭头在上、速率在下，都不进轿厢 ── */
    const ax = x1 - lane / 2;
    const aY = cabinTop + Hc * 0.42;
    const aMax = Math.max(18, Hc * 0.42 - 34);
    const aLen = clamp(Math.abs(acc) * 9, 0, aMax);
    if (aLen > 3) {
      const up = acc > 0;
      arrow(ctx, ax, aY, ax, aY - (up ? aLen : -aLen), pal.purple, 2.2);
      const ly = clamp(aY + (up ? -aLen - 12 : aLen + 12), cabinTop + 14, cabinTop + Hc - 34);
      label(ctx, 'a ' + fmt(Math.abs(acc), 1), ax, ly, pal.purple, 'center', fs);
    } else {
      label(ctx, 'a 0', ax, aY, pal.purple, 'center', fs);
    }

    /* 速率：方向由箭头给出，与加速度分开放，好对照「速度向上、加速度向下」这类情形 */
    const vTxt = v > 0.03
      ? (lane >= 100 ? 'v = ' + fmt(v, 1) + ' m/s ' + (dir > 0 ? '↑' : '↓')
        : 'v ' + fmt(v, 1) + (dir > 0 ? '↑' : '↓'))
      : 'v 0';
    label(ctx, vTxt, ax, cabinTop + Hc - 12, pal.cyan, 'center', fs);

    /* ── 右：实重与视重两根条 ── */
    const bx0 = sw + 16;
    const bw = Math.max(96, w - bx0 - 30);
    const top = Math.max(70, h * 0.14);
    const vmax = Math.max(mg, m * (G + a), 1) * 1.1;
    const Lb = val => (val / vmax) * bw;
    const barH = 22;

    label(ctx, '实重与视重', bx0, top - 28, pal.ink, 'left', 14);

    const yA = top;
    const yB = top + 86;

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = pal.blue;
    ctx.beginPath();
    ctx.rect(bx0, yA, Lb(mg), barH);
    ctx.fill();
    ctx.fillStyle = pal.orange;
    ctx.beginPath();
    ctx.rect(bx0, yB, Lb(shown), barH);
    ctx.fill();
    ctx.restore();

    label(ctx, '实重 mg', bx0, yA - 10, pal.blue, 'left', 13);
    label(ctx, '视重 N', bx0, yB - 10, pal.orange, 'left', 13);

    /* 量值：条足够长就写在条里（右端齐内），否则接在条后，不会顶出画框 */
    const valIn = (text, yMid, len, col) => {
      if (len > bw - 62) label(ctx, text, bx0 + len - 7, yMid, pal.card, 'right', 12);
      else label(ctx, text, bx0 + len + 7, yMid, col, 'left', 12);
    };
    valIn(fmt(mg, 1) + ' N', yA + barH / 2, Lb(mg), pal.blue);
    valIn(fmt(shown, 1) + ' N', yB + barH / 2, Lb(shown), pal.orange);

    /* 实重的延长虚线：视重比它长还是短，一眼可比 */
    ctx.save();
    ctx.strokeStyle = pal.blue;
    ctx.globalAlpha = 0.6;
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(bx0 + Lb(mg)) + 0.5, yA - 2);
    ctx.lineTo(Math.round(bx0 + Lb(mg)) + 0.5, yB + barH + 8);
    ctx.stroke();
    ctx.restore();

    /* 视重与实重之差 */
    const diff = N - mg;
    const dTxt = Math.abs(diff) < 0.05
      ? '视重与实重相等'
      : (diff > 0 ? '比实重多 ' : '比实重少 ') + fmt(Math.abs(diff), 1) + ' N';
    label(ctx, dTxt, bx0, yB + barH + 30, diff > 0.05 ? pal.orange : diff < -0.05 ? pal.green : pal.mut, 'left', 13);

    st.readout([
      ['阶段', mode === 'up' ? PHASE_UP[ph] : PHASE_DN[ph]],
      ['速率 v', fmt(v, 1) + ' m/s'],
      ['加速度 a', (acc > 0 ? '+' : '') + fmt(acc, 1) + ' m/s²'],
      ['实重 mg', fmt(mg, 1) + ' N'],
      ['视重 N = m(g+a)', fmt(N, 1) + ' N'],
      ['状态', state],
    ]);
  }

  return { frame, reset };
}
