/* 演示：伽利略斜面理想实验。
   小球从左斜面某一高度由静止释放，滚下、经过一小段无摩擦水平面，再沿右斜面上升，
   总能升回同一高度；右斜面越平缓，小球沿斜面走得越远，把它放平就以恒定速率一直走。
   轨道上每 0.12 s 落一枚小点，点距就是那一段的快慢：斜面上下坡时点距在变，
   水平面上不再变——这是「维持运动不需要力」的图上证据。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { spot } from './axes.js';

const ALPHA = Math.PI / 6;   // 左斜面固定 30°
const G = 9.8;
const B0 = 1.2;              // 两斜面之间那一段水平面
const DDOT = 0.12;           // 打点间隔（秒）
const HOLD = 0.85;           // 升到同一高度后停一下再重放
const THETA = { steep: Math.PI / 4, gentle: Math.PI / 5, flat: 0 };

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  function frame(dt) {
    const p = st.params;
    const mode = THETA[p.mode] !== undefined ? p.mode : 'steep';
    const th = THETA[mode];
    const flat = th < 1e-4;
    /* 释放高度可以拖到低处，0 不是合法值（坡就没有了），下限取 0.6 */
    const Hn = Number(p.H);
    const H = clamp(Number.isFinite(Hn) ? Hn : 1.5, 0.6, 3);
    const key = mode + '|' + H;
    if (key !== last) { last = key; reset(); }

    /* ── 轨道上的运动：左斜面 → 水平面 → 右斜面 ── */
    const aL = G * Math.sin(ALPHA);          // 沿左斜面下滑的加速度
    const v1 = Math.sqrt(2 * G * H);         // 到水平面时的速率
    const t1 = v1 / aL;                      // 滑完左斜面用时
    const t12 = t1 + B0 / v1;                // 走完水平面用时
    const aR = G * Math.sin(th);             // 沿右斜面上滑的减速度
    const t3 = flat ? 0 : v1 / aR;           // 沿右斜面升到同一高度用时
    const P0 = { x: -H / Math.tan(ALPHA), y: H };                  // 左斜面顶端
    const P2 = { x: B0 + (flat ? 0 : H / Math.tan(th)), y: H };    // 右斜面顶端

    /* 取景：两条斜面整条都要在框里；放平之后多留一段跑道，让它一直走出去 */
    const xmin = P0.x - 0.35;
    const xmax = B0 + (flat ? 2.2 : H / Math.tan(th)) + 0.45;
    const ymin = -0.16 * H - 0.08;
    const ymax = H * 1.2 + 0.12;
    const tEnd = flat ? t12 + (xmax - B0) / v1 + 0.35 : t12 + t3 + HOLD;

    if (dt > 0) {
      t += dt;
      if (t > tEnd) t = 0;
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    /* ── 世界坐标 → 屏幕：等比、居中 ── */
    const padL = 42, padR = 26, padT = 26, padB = 42;
    const k = Math.min((w - padL - padR) / (xmax - xmin), (h - padT - padB) / (ymax - ymin));
    const rl = padL + ((w - padL - padR) - (xmax - xmin) * k) / 2;
    const rt = padT + ((h - padT - padB) - (ymax - ymin) * k) / 2;
    const ox = rl - xmin * k;
    const oy = rt + ymax * k;
    const X = x => ox + x * k;
    const Y = y => oy - y * k;

    /* 时刻 τ 小球的位置、速率、沿轨道的加速度与两个方向 */
    const at = tau => {
      if (tau <= t1) {
        const u = 0.5 * aL * tau * tau;
        return {
          x: P0.x + u * Math.cos(ALPHA), y: P0.y - u * Math.sin(ALPHA),
          v: aL * tau, a: aL,
          nx: Math.sin(ALPHA), ny: Math.cos(ALPHA),
          tx: Math.cos(ALPHA), ty: -Math.sin(ALPHA),
        };
      }
      if (tau <= t12) {
        return { x: v1 * (tau - t1), y: 0, v: v1, a: 0, nx: 0, ny: 1, tx: 1, ty: 0 };
      }
      const tau3 = tau - t12;
      if (flat) {
        return { x: B0 + v1 * tau3, y: 0, v: v1, a: 0, nx: 0, ny: 1, tx: 1, ty: 0 };
      }
      const u3 = Math.min(tau3, t3);
      const u = v1 * u3 - 0.5 * aR * u3 * u3;
      return {
        x: B0 + u * Math.cos(th), y: u * Math.sin(th),
        v: Math.max(0, v1 - aR * tau3), a: -aR,
        nx: -Math.sin(th), ny: Math.cos(th),
        tx: Math.cos(th), ty: Math.sin(th),
      };
    };

    /* ── 同一高度：一条横贯画面的虚线 ── */
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.globalAlpha = 0.8;
    ctx.setLineDash([6, 5]);
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(Math.round(rl + 6) + 0.5, Math.round(Y(H)) + 0.5);
    ctx.lineTo(Math.round(rl + (xmax - xmin) * k - 6) + 0.5, Math.round(Y(H)) + 0.5);
    ctx.stroke();
    ctx.restore();

    /* ── 轨道：填一块坡体，再描出上沿 ── */
    const top = flat
      ? [P0, { x: 0, y: 0 }, { x: B0, y: 0 }, { x: xmax, y: 0 }]
      : [P0, { x: 0, y: 0 }, { x: B0, y: 0 }, P2];
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(X(top[0].x), Y(top[0].y));
    for (const q of top.slice(1)) ctx.lineTo(X(q.x), Y(q.y));
    const lastQ = top[top.length - 1];
    ctx.lineTo(X(lastQ.x), Y(ymin));
    ctx.lineTo(X(P0.x), Y(ymin));
    ctx.closePath();
    ctx.fillStyle = pal.line;
    ctx.globalAlpha = 0.3;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.lineWidth = 2.4;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(X(top[0].x), Y(top[0].y));
    for (const q of top.slice(1)) ctx.lineTo(X(q.x), Y(q.y));
    ctx.stroke();
    ctx.restore();

    /* 右斜面倾角：在折点处画一段弧，参考边是向右的短虚线（放平后它就是地面） */
    if (!flat) {
      const bx = X(B0);
      const by = Y(0);
      const R = 26;
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(bx + 4, by + 0.5);
      ctx.lineTo(bx + R + 34, by + 0.5);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = pal.orange;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(bx, by, R, 0, -th, true);
      ctx.stroke();
      ctx.restore();
      label(
        ctx,
        'θ = ' + fmt(th * 180 / Math.PI, 0) + '°',
        bx + (R + 12) * Math.cos(-th / 2),
        by + (R + 12) * Math.sin(-th / 2),
        pal.orange,
        'left',
        13,
      );
    }

    /* ── 打点：每 0.12 秒一枚，点距就是那一段的快慢 ── */
    const tNow = Math.min(t, tEnd);
    for (let td = DDOT; td <= tNow + 1e-9; td += DDOT) {
      const q = at(td);
      spot(ctx, X(q.x), Y(q.y), 2.6, pal.faint);
    }

    /* ── 小球与速率箭头 ── */
    const s = at(t);
    const br = 8;
    const bx = X(s.x) + s.nx * br;
    const by = Y(s.y) - s.ny * br;
    spot(ctx, bx, by, br, pal.blue, pal.bg2);
    const len = clamp(s.v / v1, 0, 1) * 52;
    if (len > 5) arrow(ctx, bx, by, bx + s.tx * len, by - s.ty * len, pal.green, 2.2);

    /* ── 文字 ── */
    label(ctx, '同一高度', rl + (xmax - xmin) * k / 2, Y(H) - 11, pal.orange, 'center', 13);
    label(ctx, '释放高度 H', X(P0.x) + 10, Y(H) - 14, pal.ink, 'left', 13);
    if (flat) {
      arrow(ctx, X(B0 + 1.3), Y(0) - 3, X(xmax) - 12, Y(0) - 3, pal.orange, 1.6);
      label(ctx, '速率不变，一直运动下去', X(xmax) - 10, Y(0) + 20, pal.orange, 'right', 13);
    } else {
      label(ctx, '无摩擦水平面', X(B0 / 2), Y(0) + 18, pal.mut, 'center', 12);
    }

    st.readout([
      ['时间 t', fmt(t, 2) + ' s'],
      ['高度 y', fmt(s.y, 2) + ' m'],
      ['速率 v', fmt(s.v, 2) + ' m/s'],
      ['加速度 a', fmt(s.a, 2) + ' m/s²'],
      ['右斜面倾角', flat ? '0°（放平）' : fmt(th * 180 / Math.PI, 0) + '°'],
      ['释放高度 H', fmt(H, 2) + ' m'],
    ]);
  }

  return { frame, reset };
}
