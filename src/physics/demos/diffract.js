/* 光5 光的衍射与偏振。
   两档：
   ① 单缝衍射 —— 缝宽 a、波长 λ，屏上强度 I = I₀(sinα/α)²，α = πa sinθ/λ，
      第一极小在 a sinθ = λ，中央亮纹宽度约为两侧亮纹的两倍。
      缝前的平面波前向右移动，缝口当作次级波源，一圈圈波峰向两侧铺开；
      方位上的强弱按 (sinα/α)² 给，所以正前方最亮、越偏越暗。
   ② 偏振 —— 自然光过第一块偏振片后成为线偏振光、强度减半，
      再过与它成 θ 的第二块偏振片，强度为 I₀/2·cos²θ（马吕斯定律）。
      各处的振动箭头随时间伸缩，一串箭头看起来就沿着光路向右行进。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

/** 波长 → 画面上用的颜色（近似可见光谱） */
function wlColor(wl) {
  let r = 0, g = 0, b = 0;
  if (wl < 440) { r = (440 - wl) / 60; b = 1; }
  else if (wl < 490) { g = (wl - 440) / 50; b = 1; }
  else if (wl < 510) { g = 1; b = (510 - wl) / 20; }
  else if (wl < 580) { r = (wl - 510) / 70; g = 1; }
  else if (wl < 645) { r = 1; g = (645 - wl) / 65; }
  else { r = 1; }
  const q = v => Math.round(255 * clamp(v, 0, 1));
  return [q(r), q(g), q(b)];
}

/** 双箭头（偏振方向记号） */
function twin(ctx, x, y, ang, len, color, w = 2) {
  const dx = Math.cos(ang) * len, dy = Math.sin(ang) * len;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = w;
  ctx.beginPath();
  ctx.moveTo(x - dx, y - dy);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();
  for (const s of [-1, 1]) {
    const hx = x + s * dx, hy = y + s * dy;
    ctx.beginPath();
    ctx.moveTo(hx, hy);
    ctx.lineTo(hx - s * 6 * Math.cos(ang - 0.45), hy - s * 6 * Math.sin(ang - 0.45));
    ctx.lineTo(hx - s * 6 * Math.cos(ang + 0.45), hy - s * 6 * Math.sin(ang + 0.45));
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const pol = (q.mode || 'slit') === 'pol';
    const lamN = clamp(fn(q.lam, 550), 400, 700);
    const aum = clamp(fn(q.a, 60), 20, 200);        // 缝宽，μm
    const Lm = clamp(fn(q.L, 1), 0.5, 3);
    const thd = clamp(fn(q.th, 45), 0, 180);
    const key = [pol ? 'p' : 's', lamN, aum, Lm, thd].join('|');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const lam = lamN * 1e-9;
    const am = aum * 1e-6;
    const th = (thd * Math.PI) / 180.0;

    ctx.clearRect(0, 0, w, h);

    if (!pol) {
      /* ══ 单缝衍射 ══════════════════════════════ */
      const xb = w * 0.27, xs = w * 0.47, cy = h * 0.50;
      const ah = 5 + ((aum - 20) / 180) * 26;
      const [cr, cg, cb] = wlColor(lamN);             // 这一束光的颜色，波前与条纹共用
      const lamPix = 12 + ((lamN - 400) / 300) * 8;   // 画面上一个波长的示意长度
      const ph = ((T * 26) / lamPix) % 1;             // 相位（26 px/s 向右）

      // 入射平面波：一串竖直波前，随时间向右移动
      const ds = 9 + ((lamN - 400) / 300) * 9;
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.5;
      for (let x = w * 0.05 + ph * ds; x < xb - 8; x += ds) {
        ctx.beginPath();
        ctx.moveTo(x, h * 0.12);
        ctx.lineTo(x, h * 0.88);
        ctx.stroke();
      }
      ctx.restore();
      label(ctx, '平行单色光', w * 0.06, h * 0.12 - 10, pal.mut, 'left', 13);

      // 挡板与单缝
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(xb, h * 0.10);
      ctx.lineTo(xb, cy - ah);
      ctx.moveTo(xb, cy + ah);
      ctx.lineTo(xb, h * 0.90);
      ctx.stroke();
      ctx.restore();
      label(ctx, `单缝 a = ${fmt(aum, 0)} μm`, xb, h * 0.10 - 10, pal.mut, 'center', 13);

      // 缝后：把缝口当作次级波源，一圈圈波峰向各方向扩张。
      // 真实情形下 a/λ 在 10² 量级，按实际角度画会密到分辨不出，这里把角度压缩，
      // 只保留「缝越窄、中央亮纹越宽」这条趋势——方位上的强弱仍按 (sinα/α)² 给。
      const span = Math.atan((h * 0.38) / (xs - xb));
      const rMax = Math.hypot(xs - xb + 2, h * 0.40);
      const th1v = clamp((span * 1.15 * 60) / aum, 0.18, 1.45);  // 第一极小的示意方向
      const Ienv = t => {
        const al = (Math.PI * Math.sin(t)) / Math.sin(th1v);
        if (Math.abs(al) < 1e-9) return 1;
        const s2 = Math.sin(al) / al;
        return s2 * s2;
      };
      ctx.save();
      ctx.beginPath();
      ctx.rect(xb, h * 0.04, xs - xb, h * 0.92);
      ctx.clip();
      ctx.strokeStyle = `rgb(${cr},${cg},${cb})`;
      ctx.lineWidth = 1.15;
      const NSEG = 36;
      for (let k = 0; (k + ph) * lamPix < rMax; k++) {
        const rr = (k + ph) * lamPix;
        if (rr < 1.5) continue;
        const fade = clamp(1 - (0.7 * rr) / rMax, 0.18, 1);
        // 同一条波峰按方位分成四档亮度，档内合成一条路径一次描完
        const buck = [[], [], [], []];
        for (let j = 0; j < NSEG; j++) {
          const t0 = -span + (2 * span * j) / NSEG;
          const t1 = -span + (2 * span * (j + 1)) / NSEG;
          buck[Math.min(3, Math.floor(Ienv((t0 + t1) / 2) * 4))].push([t0, t1]);
        }
        for (let b = 0; b < 4; b++) {
          if (!buck[b].length) continue;
          ctx.globalAlpha = (0.06 + 0.46 * (b / 3)) * fade;
          ctx.beginPath();
          for (const [t0, t1] of buck[b]) {
            ctx.moveTo(xb + rr * Math.cos(t0), cy + rr * Math.sin(t0));
            ctx.arc(xb, cy, rr, t0, t1);
          }
          ctx.stroke();
        }
      }
      ctx.restore();

      // 各个传播方向上的细光线，交代光向前走
      ctx.save();
      ctx.strokeStyle = pal.blue;
      ctx.lineWidth = 1.1;
      ctx.globalAlpha = 0.42;
      for (let k = -6; k <= 6; k++) {
        const aa = (k / 6) * span;
        ctx.beginPath();
        ctx.moveTo(xb, cy);
        ctx.lineTo(xs, cy + Math.tan(aa) * (xs - xb));
        ctx.stroke();
      }
      ctx.restore();

      // 屏
      ctx.save();
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(xs, h * 0.06);
      ctx.lineTo(xs, h * 0.94);
      ctx.stroke();
      ctx.restore();
      label(ctx, '屏', xs + 6, h * 0.06 + 4, pal.mut, 'left', 13);
      label(ctx, `L = ${fmt(Lm, 2)} m`, (xb + xs) / 2, h * 0.90 + 16, pal.mut, 'center', 12);

      /* 右栏：衍射图样 */
      const y1mm = ((Lm * lam) / am) * 1000;
      const Ymax = Math.max(0.15, y1mm * 3.2);
      const Iof = y => {
        const al = (Math.PI * am * y) / (Lm * lam);
        if (Math.abs(al) < 1e-9) return 1;
        const r = Math.sin(al) / al;
        return r * r;
      };
      const rc = { x: w * 0.545, y: h * 0.10, w: w * 0.42, h: h * 0.48 };
      const g = panel(ctx, rc, [-Ymax, Ymax], [0, 1.08], pal, { xlab: 'y/mm', ylab: 'I/I₀', nx: 4, ny: 3 });
      const pts = [];
      for (let i = 0; i <= 480; i++) {
        const yy = -Ymax + (2 * Ymax * i) / 480;
        pts.push([yy, Iof(yy * 1e-3)]);
      }
      poly(ctx, g.X, g.Y, pts, pal.orange, 2);

      // 中央亮纹的两条边界（第一极小）
      for (const s of [-1, 1]) {
        const yb = s * y1mm;
        if (Math.abs(yb) > Ymax) continue;
        ctx.save();
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = pal.faint;
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        ctx.moveTo(g.X(yb), rc.y);
        ctx.lineTo(g.X(yb), rc.y + rc.h);
        ctx.stroke();
        ctx.restore();
      }
      label(ctx, '屏上光强分布（中央亮纹最宽最亮）', rc.x + 2, rc.y - 14, pal.mut, 'left', 13);

      // 条纹本身
      const srec = { x: rc.x, y: rc.y + rc.h + 30, w: rc.w, h: 24 };
      for (let px = 0; px < srec.w; px += 2) {
        const yy = -Ymax + (2 * Ymax * px) / srec.w;
        const I = Iof(yy * 1e-3);
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${(0.06 + 0.94 * I).toFixed(3)})`;
        ctx.fillRect(srec.x + px, srec.y, 2, srec.h);
      }
      ctx.save();
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1;
      ctx.strokeRect(srec.x + 0.5, srec.y + 0.5, srec.w, srec.h);
      ctx.restore();
      label(ctx, '屏上的衍射条纹', srec.x + 2, srec.y + srec.h + 16, pal.mut, 'left', 12);

      st.readout([
        ['波长 λ', fmt(lamN, 0) + ' nm'],
        ['缝宽 a', fmt(aum, 0) + ' μm'],
        ['屏距 L', fmt(Lm, 2) + ' m'],
        ['缝宽与波长之比 a/λ', fmt(aum / lamN, 2)],
        ['第一极小 sinθ = λ/a', fmt(lam / am, 4)],
        ['第一极小位置 y₁ = Lλ/a', fmt(y1mm, 3) + ' mm'],
        ['中央亮纹宽度 2y₁', fmt(2 * y1mm, 3) + ' mm'],
        ['两侧亮纹宽度（近似）', fmt(y1mm, 3) + ' mm'],
        ['衍射现象', aum / lamN > 200 ? '很弱，光近似沿直线传播' : aum / lamN > 50 ? '可观察，条纹已经展开' : '明显，条纹张得很开'],
      ]);
      return;
    }

    /* ══ 偏振 ══════════════════════════════════════ */
    const cy = h * 0.50;
    const p1 = w * 0.30, p2 = w * 0.56;
    const x0 = w * 0.05, x1 = w * 0.48;

    // 光波是交变的电场：每支箭头按行波的相位伸缩，一串箭头看起来就向右行进
    const osc = (x, off = 0) => 0.45 + 0.55 * Math.abs(Math.sin(5.2 * T - x * 0.075 + off));

    // 自然光：各方向都有振动
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1;
    for (let x = x0; x < p1 - 24; x += 20) {
      for (let k = 0; k < 6; k++) {
        const aa = (k / 6) * Math.PI;
        twin(ctx, x, cy, aa, 9 * osc(x, k * 1.9), pal.faint, 1.2);
      }
    }
    ctx.restore();
    label(ctx, '自然光（各方向的振动都有）', x0, cy - 46, pal.mut, 'left', 13);

    // 第一块偏振片：透振方向竖直
    ctx.save();
    ctx.strokeStyle = pal.cyan;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(p1 - 7, cy - h * 0.22, 14, h * 0.44);
    ctx.stroke();
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = pal.cyan;
    ctx.fill();
    ctx.globalAlpha = 1;
    // 透振方向的细栅线
    for (let yy = -h * 0.20; yy <= h * 0.20; yy += 10) {
      ctx.beginPath();
      ctx.moveTo(p1 - 4, cy + yy);
      ctx.lineTo(p1 + 4, cy + yy);
      ctx.stroke();
    }
    ctx.restore();
    label(ctx, '偏振片 P₁（竖直）', p1, cy - h * 0.22 - 14, pal.cyan, 'center', 13);

    // P₁ 之后：竖直振动的线偏振光
    for (let x = p1 + 22; x < p2 - 26; x += 26) {
      twin(ctx, x, cy, Math.PI / 2, 13 * osc(x), pal.green, 2);
    }

    // 第二块偏振片（检偏器），绕光轴转过 θ
    ctx.save();
    ctx.translate(p2, cy);
    ctx.rotate(-th);
    ctx.strokeStyle = pal.purple;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(-7, -h * 0.22, 14, h * 0.44);
    ctx.stroke();
    ctx.globalAlpha = 0.16;
    ctx.fillStyle = pal.purple;
    ctx.fill();
    ctx.globalAlpha = 1;
    for (let yy = -h * 0.20; yy <= h * 0.20; yy += 10) {
      ctx.beginPath();
      ctx.moveTo(-4, yy);
      ctx.lineTo(4, yy);
      ctx.stroke();
    }
    ctx.restore();
    label(ctx, `检偏器 P₂（转过 θ = ${fmt(thd, 0)}°）`, p2, cy - h * 0.24 - 30, pal.purple, 'center', 13);

    // θ 角弧：在光轴所在的竖屏上，从竖直方向量到 P₂ 的透振方向
    ctx.save();
    ctx.strokeStyle = pal.purple;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(p2, cy - h * 0.20);
    ctx.lineTo(p2, cy + h * 0.20);
    ctx.stroke();
    ctx.restore();

    // 通过 P₂ 之后：沿 P₂ 透振方向的振动，振幅按 |cosθ| 缩短
    const amp = Math.abs(Math.cos(th));
    const Irel = 0.5 * amp * amp;
    const [pr, pg, pb] = wlColor(lamN);
    const col = `rgba(${pr},${pg},${pb},${(0.18 + 0.82 * amp).toFixed(3)})`;
    for (let x = p2 + 26; x < w * 0.52; x += 26) {
      twin(ctx, x, cy, Math.PI / 2 - th, (4 + 15 * amp) * osc(x), col, 2.2);
    }
    label(ctx, '箭头的长短在变：光波的电场在振荡', x0, cy + h * 0.27, pal.mut, 'left', 12);

    /* 右栏：马吕斯定律 */
    const rc = { x: w * 0.60, y: h * 0.14, w: w * 0.36, h: h * 0.62 };
    const g = panel(ctx, rc, [0, 180], [0, 0.56], pal, { xlab: 'θ/°', ylab: 'I/I₀', nx: 4, ny: 4 });
    const pts = [];
    for (let i = 0; i <= 180; i++) pts.push([i, 0.5 * Math.cos((i * Math.PI) / 180) ** 2]);
    poly(ctx, g.X, g.Y, pts, pal.orange, 2);
    spot(ctx, g.X(thd), g.Y(Irel), 4.6, pal.orange, pal.bg2);
    label(ctx, `I/I₀ = ${fmt(Irel, 3)}`, g.X(thd) + 8, g.Y(Irel) - 12, pal.mut, 'left', 12);
    label(ctx, '透过 P₂ 的光强随 θ 变化', rc.x + 2, rc.y - 14, pal.mut, 'left', 13);

    st.readout([
      ['波长 λ（取作颜色）', fmt(lamN, 0) + ' nm'],
      ['入射自然光强度 I₀', '1.000'],
      ['过 P₁ 后', '0.500（线偏振，强度减半）'],
      ['两偏振片的夹角 θ', fmt(thd, 0) + '°'],
      ['过 P₂ 后 I₂/I₀', fmt(Irel, 3)],
      ['马吕斯定律 (1/2)cos²θ', fmt(0.5 * Math.cos(th) ** 2, 3)],
      ['P₁、P₂ 透振方向', thd < 1 ? '平行，光全通过' : thd > 179 ? '平行（转过 180°）' : Math.abs(thd - 90) < 1 ? '垂直，光全被挡住' : '斜交'],
    ]);
  }

  return { frame };
}
