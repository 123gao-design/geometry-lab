/* 演示：竖直平面内的圆周运动。
   小球在竖直圆轨道上从最低点以 v₀ 出发，速率由能量决定：越往上越慢，到最高点最慢。
   左栏画三条矢量——绿的速度（切向）、橙的重力（竖直向下）、蓝的沿半径方向的拉力，
   小球到达的每一处都能拿径向方程 T = mv²/r + mg·cosφ 核对（φ 从最低点量起）。
   轻绳只能拉不能推，T 一旦要变成负数，小球就脱离圆轨道、按抛体运动飞出去；
   轻杆可以推，T 取负也照样把小球留在圆上。
   右栏画张力随角度的曲线 T(φ)：曲线穿过零的那一段就是两种模型的分界。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const G = 9.8;
const TAU = Math.PI * 2;

export function create(st) {
  let ph = 0;         // 从最低点量起的角
  let dir = 1;        // 转动方向（上不去时掉头）
  let state = 'circle';
  let fx = 0, fy = 0, fvx = 0, fvy = 0, ft = 0;
  let last = '';

  const reset = () => {
    ph = 0; dir = 1; state = 'circle'; ft = 0;
  };
  reset();

  function frame(dt) {
    const p = st.params;
    const num = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const r = clamp(num(p.r, 0.8), 0.3, 1.8);
    const v0 = clamp(num(p.v0, 8), 1, 14);
    const mm = clamp(num(p.m, 0.5), 0.1, 3);
    const rope = (p.mode || 'rope') !== 'rod';
    const key = r + '|' + v0 + '|' + mm + '|' + (rope ? 'rope' : 'rod');
    if (key !== last) { last = key; reset(); }

    const v2at = a => v0 * v0 - 2 * G * r * (1 - Math.cos(a));
    const detachCos = (2 * G * r - v0 * v0) / (3 * G * r);   // 绳失效的临界角

    if (dt > 0) {
      if (state === 'circle') {
        const n = 8;
        const hstep = dt / n;
        for (let i = 0; i < n && state === 'circle'; i++) {
          const v2c = v2at(ph);
          if (v2c <= 0.02) {
            /* 上不到更高处：停在转折角上掉头 */
            const c = clamp(1 - (v0 * v0) / (2 * G * r), -1, 1);
            ph = dir > 0 ? Math.acos(c) : TAU - Math.acos(c);
            dir = -dir;
            continue;
          }
          if (rope && detachCos > -1 && Math.cos(ph) < detachCos) {
            /* 绳张力要变成负数：脱离圆轨道 */
            const vd = Math.sqrt(Math.max(v2c, 0));
            fx = r * Math.sin(ph);
            fy = -r * Math.cos(ph);
            fvx = vd * Math.cos(ph);
            fvy = vd * Math.sin(ph);
            state = 'fly';
            ft = 0;
            break;
          }
          ph += (dir * Math.sqrt(v2c) * hstep) / r;
          if (ph > TAU) ph -= TAU;
          if (ph < 0) ph += TAU;
        }
      } else {
        ft += dt;
        fvy -= G * dt;
        fx += fvx * dt;
        fy += fvy * dt;
        if (ft > 2 || fy < -r * 3 || Math.abs(fx) > r * 3) reset();
      }
    }

    const w = st.w;
    const h = st.h;
    const ctx = st.ctx;
    const pal = st.pal;
    if (!w || !h) return;
    ctx.clearRect(0, 0, w, h);

    const dual = w >= 640;
    const sw = dual ? w * 0.56 : w - 16;
    const cx = sw / 2;
    const cy = h / 2 + 8;
    const Rp = Math.min(sw * 0.30, h * 0.34);
    const X = x => cx + x * Rp / r;
    const Y = y => cy - y * Rp / r;

    /* ── 圆轨道 ── */
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(cx, cy, Rp, 0, TAU);
    ctx.stroke();
    ctx.restore();

    /* 过圆心的水平线：绳失效只发生在它上方 */
    ctx.save();
    ctx.setLineDash([3, 6]);
    ctx.strokeStyle = pal.faint;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - Rp - 10, cy);
    ctx.lineTo(cx + Rp + 10, cy);
    ctx.stroke();
    ctx.restore();

    /* 最高点与最低点的小刻度 */
    label(ctx, '最高点', cx, cy - Rp - 18, pal.faint, 'center', 12);
    label(ctx, '最低点', cx, cy + Rp + 18, pal.faint, 'center', 12);

    /* 圆心支座 */
    ctx.save();
    ctx.fillStyle = pal.mut;
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, TAU);
    ctx.fill();
    ctx.restore();

    /* 已走过的弧（从最低点算起；画布 y 朝下，φ 增大对应画布极角减小） */
    ctx.save();
    ctx.strokeStyle = pal.green;
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(cx, cy, Rp, Math.PI / 2, Math.PI / 2 - ph, true);
    ctx.stroke();
    ctx.restore();

    /* 当下的小球与三条矢量 */
    const bx = state === 'circle' ? X(r * Math.sin(ph)) : X(fx);
    const by = state === 'circle' ? Y(-r * Math.cos(ph)) : Y(fy);
    const v2 = state === 'circle' ? v2at(ph) : fvx * fvx + fvy * fvy;
    const vv = Math.sqrt(Math.max(v2, 0));

    /* 杆 / 绳：从圆心到球 */
    ctx.save();
    ctx.strokeStyle = pal.ink;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = rope ? 1.4 : 3;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(bx, by);
    ctx.stroke();
    ctx.restore();

    /* 速度：切向 */
    let tx, ty;
    if (state === 'circle') {
      tx = Math.cos(ph); ty = -Math.sin(ph);
    } else {
      const sp = Math.max(vv, 1e-6);
      tx = fvx / sp; ty = -fvy / sp;
    }
    const kv = Math.min(Rp * 0.85, 14 + Rp * 0.55 * (vv / Math.max(v0, 1)));
    if (vv > 0.2) {
      arrow(ctx, bx, by, bx + tx * kv, by + ty * kv, pal.green, 2.2);
      label(ctx, 'v', bx + tx * (kv + 12), by + ty * (kv + 12), pal.green, 'center', 13);
    }

    /* 重力：竖直向下，长度按 mg 定一把尺子 */
    const kF = (Rp * 0.20) / (mm * G);
    const gLen = mm * G * kF;
    arrow(ctx, bx, by, bx, by + gLen, pal.orange, 2);
    label(ctx, 'mg', bx + 12, by + gLen * 0.55, pal.orange, 'left', 13);

    /* 张力 / 支持力：沿半径指向圆心 */
    let Tn = 0;
    if (state === 'circle') {
      Tn = mm * (Math.max(v2, 0) / r + G * Math.cos(ph));
      const tLen = clamp(Math.abs(Tn) * kF, 0, Rp * 0.85);
      if (tLen > 5) {
        const dx = cx - bx, dy = cy - by;              // 球指向圆心
        const dl = Math.hypot(dx, dy) || 1;
        const ex = (dx / dl) * Math.sign(Tn);
        const ey = (dy / dl) * Math.sign(Tn);
        arrow(ctx, bx, by, bx + ex * tLen, by + ey * tLen, pal.blue, 2);
        label(ctx, Tn >= 0 ? 'T' : 'N', bx + ex * (tLen + 12), by + ey * (tLen + 12),
          pal.blue, 'center', 13);
      }
    }

    ctx.save();
    ctx.fillStyle = state === 'circle' ? pal.orange : pal.pink;
    ctx.beginPath();
    ctx.arc(bx, by, clamp(Rp * 0.075, 4.5, 8), 0, TAU);
    ctx.fill();
    ctx.restore();

    if (state === 'fly') {
      label(ctx, '绳松弛，脱离圆轨道', cx, h - 18, pal.pink, 'center', 13);
    }

    /* ── 右：张力随角度变化 ── */
    if (dual) {
      const px0 = sw + 22;
      const pw = Math.max(150, w - px0 - 16);
      const rct = { x: px0, y: 44, w: pw, h: Math.max(90, h - 44 - 54) };
      const Tat = a => mm * (v0 * v0 / r - 2 * G * (1 - Math.cos(a))) + mm * G * Math.cos(a);
      let lo = 0, hi = 0;
      for (let i = 0; i <= 48; i++) {
        const val = Tat((TAU * i) / 48);
        lo = Math.min(lo, val);
        hi = Math.max(hi, val);
      }
      const padY = Math.max((hi - lo) * 0.12, 0.4);
      const gp = panel(ctx, rct, [0, 2], [lo - padY, hi + padY], pal, {
        xlab: 'φ/π', ylab: 'T/N', nx: 4, ny: 4,
      });

      /* 整条曲线按公式画成浅色；小球到得了的那一段（v² ≥ 0）画成实色 */
      const all = [];
      const segs = [];
      let cur = [];
      for (let i = 0; i <= 96; i++) {
        const a = (TAU * i) / 96;
        const pt = [a / Math.PI, Tat(a)];
        all.push(pt);
        if (v2at(a) >= 0) cur.push(pt);
        else if (cur.length) { if (cur.length > 1) segs.push(cur); cur = []; }
      }
      if (cur.length > 1) segs.push(cur);
      poly(ctx, gp.X, gp.Y, all, pal.faint, 1.6);
      for (const sg of segs) poly(ctx, gp.X, gp.Y, sg, pal.blue, 2.2);

      /* 最高点 */
      ctx.save();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gp.X(1), gp.Y(lo - padY));
      ctx.lineTo(gp.X(1), gp.Y(hi + padY));
      ctx.stroke();
      ctx.restore();
      label(ctx, '最高点', gp.X(1), gp.Y(hi + padY) + 12, pal.faint, 'center', 12);

      /* 绳失效的角度 */
      if (rope && detachCos > -1 && detachCos < 1) {
        const aD = Math.acos(detachCos);
        spot(ctx, gp.X(aD / Math.PI), gp.Y(0), 3.4, pal.pink, pal.card);
        label(ctx, 'T = 0', gp.X(aD / Math.PI) + 10, gp.Y(0) - 12, pal.pink, 'left', 12);
      }

      /* 当前时刻 */
      if (state === 'circle') {
        ctx.save();
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = pal.faint;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gp.X(ph / Math.PI), gp.Y(lo - padY));
        ctx.lineTo(gp.X(ph / Math.PI), gp.Y(hi + padY));
        ctx.stroke();
        ctx.restore();
        spot(ctx, gp.X(ph / Math.PI), gp.Y(Tn), 3.6, pal.orange, pal.card);
      }
      label(ctx, rope ? '轻绳：T 不能为负' : '轻杆：T 可为负', rct.x + rct.w - 12, rct.y + 15,
        pal.mut, 'right', 12);
    }

    const vTop2 = v0 * v0 - 4 * G * r;
    const vTop = vTop2 >= 0 ? Math.sqrt(vTop2) : NaN;
    const TTop = Number.isFinite(vTop) ? mm * (vTop * vTop / r) - mm * G : NaN;
    st.readout([
      ['最高点速度 v顶', Number.isFinite(vTop) ? fmt(vTop, 2) + ' m/s' : '上不去'],
      ['最高点张力', Number.isFinite(TTop) ? fmt(TTop, 2) + ' N' : '—'],
      ['恰好过顶所需 v₀', fmt(Math.sqrt(rope ? 5 * G * r : 4 * G * r), 2) + ' m/s'],
      ['当前速度 v', fmt(vv, 2) + ' m/s'],
      ['当前张力 T', state === 'circle' ? fmt(Tn, 2) + ' N' : '0（已脱离）'],
      ['当前高度 h', fmt(state === 'circle' ? r * (1 - Math.cos(ph)) : fy + r, 2) + ' m'],
    ]);
  }

  return { frame, reset };
}
