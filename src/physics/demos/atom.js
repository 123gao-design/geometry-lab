/* 原3 原子结构与能级。
   氢原子能级 E_n = −13.6/n² eV，电子从高能级 n₂ 跃到低能级 n₁ 时发一份
   能量为 ΔE = E_n₂ − E_n₁ 的光子，波长 λ = 1240/ΔE nm。左栏是能级阶梯与
   跃迁箭头（能级位置按示意铺开，读数栏给真实能量），右栏是氢原子光谱的
   波长条（对数坐标）：跃迁档标出一条谱线，谱线档把同一末态的一组跃迁都标出。 */
import { label, arrow, clamp, fmt } from '../gfx.js';

const NMAX = 6;
const E1 = -13.6;              // eV
const HC = 1240;               // eV·nm
const H_EV = 4.136e-15;        // eV·s
const SERIES = { 1: '莱曼系', 2: '巴尔末系', 3: '帕申系', 4: '布拉开系' };

/* 波长 → 可见光颜色；紫外与红外各给一个固定色 */
function wlColor(nm) {
  const t = clamp(nm, 380, 780);
  let r = 0, g = 0, b = 0;
  if (t < 440) { r = (440 - t) / 60; b = 1; }
  else if (t < 490) { g = (t - 440) / 50; b = 1; }
  else if (t < 510) { g = 1; b = (510 - t) / 20; }
  else if (t < 580) { r = (t - 510) / 70; g = 1; }
  else if (t < 645) { r = 1; g = (645 - t) / 65; }
  else { r = 1; }
  return `rgb(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)})`;
}

export function create(st) {
  let T = 0;
  let last = '';

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const series = (q.mode || 'jump') === 'series';
    const n1 = clamp(Math.round(fn(q.n1, 2)), 1, 4);
    const n2 = clamp(Math.round(fn(q.n2, 3)), n1 + 1, NMAX);

    const key = [series ? 1 : 0, n1, n2].join(',');
    if (key !== last) { last = key; T = 0; }
    if (dt > 0) T += dt;

    const En = n => E1 / (n * n);
    const dEof = (lo, hi) => 13.6 * (1 / (lo * lo) - 1 / (hi * hi));   // hi → lo 放出的能量
    const lamOf = dEl => HC / dEl;

    const dE = dEof(n1, n2);
    const lam = lamOf(dE);
    const nu = dE / H_EV;
    const vis = lam >= 380 && lam <= 760;

    ctx.clearRect(0, 0, w, h);

    /* ══ 左栏：能级阶梯 ═════════════════════════════════════ */
    const yBot = h * 0.84, yTop = h * 0.12;
    const fOf = n => 1 - Math.pow(n, -1.2);        // 示意铺开：低能级间距大
    const yOf = n => yBot - fOf(n) * (yBot - yTop);
    const xL = w * 0.115, xR = w * 0.40;

    label(ctx, '氢原子能级（位置示意）', xL, yTop - 22, pal.mut, 'left', 13);

    for (let n = 1; n <= NMAX; n++) {
      const y = yOf(n);
      const hot = n === n1 || n === n2;
      ctx.save();
      ctx.strokeStyle = n === n2 ? pal.orange : n === n1 ? pal.blue : hot ? pal.cyan : pal.line;
      ctx.lineWidth = hot ? 2.4 : 1.4;
      ctx.beginPath();
      ctx.moveTo(xL, y);
      ctx.lineTo(xR, y);
      ctx.stroke();
      ctx.restore();
      label(ctx, `n=${n}`, xL - 9, y, hot ? pal.ink : pal.mut, 'right', 12);
      if (n <= 4 || hot) label(ctx, `${fmt(En(n), 2)} eV`, xR + 9, y, pal.mut, 'left', 12);
    }

    // 跃迁箭头
    const y1 = yOf(n1), y2 = yOf(n2);
    const ycq = y => clamp(y, yTop + 8, yBot - 4);
    if (!series) {
      const xa = w * 0.255;
      arrow(ctx, xa, ycq(y2), xa, ycq(y1), pal.orange, 2.2);
      label(ctx, `${n2} → ${n1}`, xa, yTop + 16, pal.orange, 'center', 13);
    } else {
      for (let n = n1 + 1; n <= NMAX; n++) {
        const xa = w * 0.175 + (n - n1 - 1) * w * 0.034;
        arrow(ctx, xa, ycq(yOf(n)), xa, ycq(y1), pal.orange, 1.6);
      }
      label(ctx, '各激发态 → 同一末态', w * 0.28, yTop + 16, pal.orange, 'center', 13);
    }

    // 电子：在高能级停留、下落、停在低能级，循环
    if (!series) {
      const cyc = 2.4;
      const ph = T % cyc;
      let eY = y2;
      if (ph >= 0.9 && ph < 1.5) eY = y2 + (y1 - y2) * ((ph - 0.9) / 0.6);
      else if (ph >= 1.5) eY = y1;
      ctx.save();
      ctx.fillStyle = pal.cyan;
      ctx.beginPath();
      ctx.arc(w * 0.255 + 12, eY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    /* ══ 中点：发射的光子 ═══════════════════════════════════ */
    if (!series) {
      const ph = T % 2.4;
      const alpha = clamp((ph - 1.5) / 0.3, 0, 1);
      if (alpha > 0.01) {
        const ymid = clamp((y1 + y2) / 2, yTop + 26, yBot - 22);
        const xa = w * 0.445, xb = w * 0.545, dw = xb - xa;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = pal.cyan;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        for (let x = xa; x <= xb; x += 1.2) {
          const yy = ymid + 7 * Math.sin(((x - xa) / dw) * Math.PI * 8);
          if (x === xa) ctx.moveTo(x, yy);
          else ctx.lineTo(x, yy);
        }
        ctx.stroke();
        ctx.restore();
        label(ctx, 'hν', (xa + xb) / 2, ymid - 20, pal.cyan, 'center', 13);
      }
    }

    /* ══ 右栏：光谱条（波长对数轴） ═════════════════════════ */
    const sx0 = w * 0.565, sx1 = w * 0.965;
    const syT = h * 0.40, syB = h * 0.53;
    const L0 = Math.log(80), L1 = Math.log(1000);
    const xs = lamN => sx0 + ((Math.log(clamp(lamN, 80, 1000)) - L0) / (L1 - L0)) * (sx1 - sx0);

    label(ctx, '氢原子光谱（波长取对数轴）', sx0, h * 0.27, pal.mut, 'left', 13);

    // 光谱底色
    const SEG = 200;
    for (let i = 0; i < SEG; i++) {
      const t0 = i / SEG, t1 = (i + 1) / SEG;
      const l0 = Math.exp(L0 + (L1 - L0) * t0);
      const l1 = Math.exp(L0 + (L1 - L0) * t1);
      let col;
      if (l1 < 380) col = `rgba(148,120,196,${0.20 + 0.34 * (l1 - 80) / 300})`;
      else if (l0 > 780) col = 'rgba(150,52,40,0.62)';
      else col = wlColor((l0 + l1) / 2);
      ctx.fillStyle = col;
      ctx.fillRect(xs(l0), syT, xs(l1) - xs(l0) + 0.8, syB - syT);
    }

    // 可见光边界
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    for (const b of [380, 780]) {
      ctx.beginPath();
      ctx.moveTo(xs(b), syT - 4);
      ctx.lineTo(xs(b), syB + 4);
      ctx.stroke();
    }
    ctx.restore();
    label(ctx, '紫外', (sx0 + xs(380)) / 2, syB + 17, pal.mut, 'center', 12);
    label(ctx, '可见光', (xs(380) + xs(780)) / 2, syB + 17, pal.mut, 'center', 12);
    label(ctx, '红外', (xs(780) + sx1) / 2, syB + 17, pal.mut, 'center', 12);

    // 波长刻度
    for (const t of [100, 200, 400, 700, 1000]) {
      const x = xs(t);
      ctx.save();
      ctx.strokeStyle = pal.mut;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, syB);
      ctx.lineTo(x, syB + 5);
      ctx.stroke();
      ctx.restore();
      label(ctx, String(t), x, syB + 34, pal.mut, 'center', 12);
    }
    label(ctx, 'λ / nm', sx1, syB + 34, pal.mut, 'right', 12);

    // 谱线
    const lines = series
      ? Array.from({ length: NMAX - n1 }, (_, i) => lamOf(dEof(n1, n1 + 1 + i)))
      : [lam];
    lines.forEach((lm, i) => {
      const x = xs(lm);
      const pulse = series ? 1 : 0.55 + 0.45 * Math.sin(T * 4);
      const col = lm < 380 ? 'rgba(176,150,236,1)' : lm > 780 ? 'rgb(214,110,84)' : wlColor(lm);
      ctx.save();
      ctx.globalAlpha = clamp(pulse, 0.4, 1);
      ctx.strokeStyle = col;
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.moveTo(x, syT - 14);
      ctx.lineTo(x, syT + (syB - syT) * 0.55);
      ctx.stroke();
      ctx.restore();
      if (!series) {
        label(ctx, `λ = ${fmt(lm, 1)} nm`, x, syT - 22, pal.ink, 'center', 13);
      } else if (i === 0 || i === lines.length - 1) {
        label(ctx, fmt(lm, 1), x, syT - 22, pal.mut, 'center', 11);
      }
    });

    /* ══ 读数 ══════════════════════════════════════════════ */
    if (!series) {
      st.readout([
        ['低能级 n₁', String(n1)],
        ['低能级能量 E_n₁', fmt(En(n1), 2) + ' eV'],
        ['高能级 n₂', String(n2)],
        ['高能级能量 E_n₂', fmt(En(n2), 2) + ' eV'],
        ['能量差 ΔE = hν', fmt(dE, 2) + ' eV'],
        ['光子频率 ν', fmt(nu / 1e14, 2) + ' ×10¹⁴ Hz'],
        ['光子波长 λ', fmt(lam, 1) + ' nm'],
        ['谱线归属', SERIES[n1] + (vis ? ' · 可见光' : lam < 380 ? ' · 紫外' : ' · 红外')],
        ['电离能（由 n=1）', '13.60 eV'],
      ]);
    } else {
      const lo = lamOf(dEof(n1, n1 + 1));
      const hi = lamOf(13.6 / (n1 * n1));
      const visCount = lines.filter(v => v >= 380 && v <= 760).length;
      st.readout([
        ['末态能级 n₁', String(n1)],
        ['末态能量', fmt(En(n1), 2) + ' eV'],
        ['谱线系列', SERIES[n1]],
        ['最长波长（n₁+1 → n₁）', fmt(lo, 1) + ' nm'],
        ['最短波长（n→∞）', fmt(hi, 1) + ' nm'],
        ['可见光条数（到 n=6）', String(visCount)],
        ['里德伯常量 R', '1.097×10⁷ m⁻¹'],
        ['定态半径比', `r_n₁ : r_1 = ${n1 * n1} : 1`],
      ]);
    }
  }

  return { frame };
}
