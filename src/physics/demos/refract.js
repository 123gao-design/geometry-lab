/* 光1 折射定律与全反射。
   两介质以一条水平界面分开，上方折射率 n₁、下方 n₂，竖直虚线是法线。
   光线从上方射到界面上的 O 点：入射角 θ₁、折射角 θ₂ 都从法线量起，
   满足 n₁sinθ₁ = n₂sinθ₂。θ₁ 增大时 θ₂ 也增大但更慢（光线进入光密介质时向法线偏折）。
   当 n₁ > n₂ 且 θ₁ 超过临界角 θc = arcsin(n₂/n₁) 时，折射光消失，
   入射光全部反射回上方——这就是全反射。
   右栏画 θ₂ 随 θ₁ 变化的曲线，橙点是当前取值，紫色虚线标临界角。 */
import { label, clamp, fmt, arrow } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const n1 = clamp(fn(q.n1, 1), 1, 2.5);
    const n2 = clamp(fn(q.n2, 1.5), 1, 2.5);
    const th1 = clamp(fn(q.th1, 40), 0, 89);          // 度
    const key = [n1, n2, th1].join('|');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const a1 = (th1 * Math.PI) / 180;
    const s2 = (n1 / n2) * Math.sin(a1);
    const tir = s2 > 1;
    const th2 = tir ? 0 : (Math.asin(s2) * 180) / Math.PI;
    const a2 = (th2 * Math.PI) / 180;
    const crit = n1 > n2 ? (Math.asin(clamp(n2 / n1, 0, 1)) * 180) / Math.PI : null;

    ctx.clearRect(0, 0, w, h);

    /* ── 界面与介质 ─────────────────────────────── */
    const iy = h * 0.50;
    const ox = w * 0.38;
    ctx.save();
    ctx.fillStyle = pal.blue;
    ctx.globalAlpha = 0.05;
    ctx.fillRect(0, 0, w * 0.86, iy);
    ctx.fillStyle = pal.cyan;
    ctx.globalAlpha = 0.07;
    ctx.fillRect(0, iy, w * 0.86, h - iy);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w * 0.04, iy);
    ctx.lineTo(w * 0.86, iy);
    ctx.stroke();
    ctx.restore();
    label(ctx, `介质 1　n₁ = ${fmt(n1, 2)}`, w * 0.06, h * 0.10, pal.blue, 'left', 15);
    label(ctx, `介质 2　n₂ = ${fmt(n2, 2)}`, w * 0.06, h * 0.92, pal.cyan, 'left', 15);

    // 法线
    ctx.save();
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(ox, iy - h * 0.36);
    ctx.lineTo(ox, iy + h * 0.36);
    ctx.stroke();
    ctx.restore();
    label(ctx, '法线', ox + 8, iy - h * 0.34, pal.faint, 'left', 13);

    const L = Math.min(w * 0.30, h * 0.34);

    // 入射光线：从左上射向 O
    const inx = ox - L * Math.sin(a1), iny = iy - L * Math.cos(a1);
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(inx, iny);
    ctx.lineTo(ox, iy);
    ctx.stroke();
    ctx.restore();
    arrow(ctx, inx + Math.sin(a1) * 26, iny + Math.cos(a1) * 26, ox - Math.sin(a1) * 8, iy - Math.cos(a1) * 8, pal.orange, 2.4);
    label(ctx, '入射光线', inx - 4, iny - 10, pal.orange, 'right', 14);

    // 反射光线：从 O 射向右上
    const rfx = ox + L * 0.85 * Math.sin(a1), rfy = iy - L * 0.85 * Math.cos(a1);
    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 2.2;
    ctx.setLineDash(tir ? [] : [6, 4]);
    ctx.beginPath();
    ctx.moveTo(ox, iy);
    ctx.lineTo(rfx, rfy);
    ctx.stroke();
    ctx.restore();
    arrow(ctx, ox + Math.sin(a1) * 20, iy - Math.cos(a1) * 20, ox + Math.sin(a1) * 40, iy - Math.cos(a1) * 40, pal.purple, 2.2);
    label(ctx, '反射光线', rfx + 6, rfy - 6, pal.purple, 'left', 14);

    // 折射光线：从 O 射向右下
    if (!tir) {
      const qx = ox + L * Math.sin(a2), qy = iy + L * Math.cos(a2);
      ctx.save();
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(ox, iy);
      ctx.lineTo(qx, qy);
      ctx.stroke();
      ctx.restore();
      arrow(ctx, ox + Math.sin(a2) * 20, iy + Math.cos(a2) * 20, ox + Math.sin(a2) * 42, iy + Math.cos(a2) * 42, pal.green, 2.4);
      label(ctx, '折射光线', qx + 8, qy + 4, pal.green, 'left', 14);
    }

    // 角弧（画布坐标：向下为正，逆时针参数取 false）
    const arcR = Math.min(58, h * 0.14);
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(ox, iy, arcR, -Math.PI / 2 - a1, -Math.PI / 2, false);
    ctx.stroke();
    ctx.restore();
    label(ctx, `θ₁ = ${fmt(th1, 0)}°`, ox - arcR * 0.55 - 8, iy - arcR * 0.62, pal.orange, 'right', 13);

    if (!tir) {
      ctx.save();
      ctx.strokeStyle = pal.green;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(ox, iy, arcR, Math.PI / 2, Math.PI / 2 - a2, true);
      ctx.stroke();
      ctx.restore();
      label(ctx, `θ₂ = ${fmt(th2, 1)}°`, ox + arcR * 0.70 * Math.sin(a2 / 2) + 6, iy + arcR * 0.92, pal.green, 'left', 13);
    }

    // 全反射提示
    if (tir) {
      label(ctx, `θ₁ 超过临界角 ${fmt(crit, 1)}°，发生全反射`, ox + 12, iy + 40, pal.pink, 'left', 15);
    }

    /* ── 右栏：θ₂ 随 θ₁ 变化 ──────────────────────── */
    const rc = { x: w * 0.55, y: h * 0.14, w: w * 0.39, h: h * 0.68 };
    const g = panel(ctx, rc, [0, 90], [0, 90], pal, { xlab: 'θ₁/°', ylab: 'θ₂/°', nx: 6, ny: 6 });
    const cur = [];
    for (let i = 0; i <= 300; i++) {
      const t1 = (90 * i) / 300;
      const ss = (n1 / n2) * Math.sin((t1 * Math.PI) / 180);
      if (ss > 1) break;
      cur.push([t1, (Math.asin(ss) * 180) / Math.PI]);
    }
    if (cur.length > 1) poly(ctx, g.X, g.Y, cur, pal.green, 2.2);
    // 45° 参考线
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(g.X(0), g.Y(0));
    ctx.lineTo(g.X(90), g.Y(90));
    ctx.stroke();
    ctx.restore();
    if (crit != null) {
      ctx.save();
      ctx.setLineDash([5, 4]);
      ctx.strokeStyle = pal.purple;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(g.X(crit), rc.y);
      ctx.lineTo(g.X(crit), rc.y + rc.h);
      ctx.stroke();
      ctx.restore();
      label(ctx, `临界角 ${fmt(crit, 1)}°`, g.X(crit) + 4, rc.y + 16, pal.purple, 'left', 12);
    }
    if (!tir) spot(ctx, g.X(th1), g.Y(th2), 5.5, pal.orange, pal.bg2);

    st.readout([
      ['介质 1 折射率 n₁', fmt(n1, 2)],
      ['介质 2 折射率 n₂', fmt(n2, 2)],
      ['入射角 θ₁', fmt(th1, 1) + '°'],
      ['折射角 θ₂', tir ? '—（全反射）' : fmt(th2, 2) + '°'],
      ['sinθ₁', fmt(Math.sin(a1), 4)],
      ['sinθ₂', tir ? '—' : fmt(Math.sin(a2), 4)],
      ['n₁sinθ₁', fmt(n1 * Math.sin(a1), 4)],
      ['n₂sinθ₂', tir ? '—' : fmt(n2 * Math.sin(a2), 4)],
      ['临界角 arcsin(n₂/n₁)', crit == null ? '不存在（n₁ ≤ n₂）' : fmt(crit, 2) + '°'],
      ['光在介质 1 中的速率', fmt(2.998e8 / n1 / 1e8, 3) + '×10⁸ m/s'],
      ['光在介质 2 中的速率', fmt(2.998e8 / n2 / 1e8, 3) + '×10⁸ m/s'],
    ]);
  }

  return { frame };
}
