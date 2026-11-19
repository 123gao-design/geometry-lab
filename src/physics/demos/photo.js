/* 原1 光电效应。
   光子能量 E = hc/λ（以 eV 计，E = 1240/λ(nm)），电子吸收一个光子后克服逸出功 W
   逸出，最大初动能 Ek = E − W；外加反向电压到 U = −Uc 时电流归零，Uc 在数值上就等于 Ek。
   左栏是光电管里阴极发射、极板间被电场加减速的电子；右栏上图是光电流随电压的曲线，
   下图把光子能量拆成逸出功与最大初动能两段。 */
import { label, clamp, fmt } from '../gfx.js';
import { panel, poly, spot } from './axes.js';

const HC = 1240;          // eV·nm
const H_EV = 4.136e-15;   // eV·s

export function create(st) {
  let T = 0;
  let last = '';
  let els = [];      // 电子 { x, y, vx, vy }
  let spawnAcc = 0;
  let hitCount = 0;

  function reset() {
    T = 0;
    els = [];
    spawnAcc = 0;
    hitCount = 0;
  }

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const fn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const lam = clamp(fn(q.lam, 400), 200, 700);
    const W = clamp(fn(q.W, 2.2), 1.5, 5);
    const inten = clamp(fn(q.I0, 1), 0.2, 2);
    const U = clamp(fn(q.U, 0), -3, 3);

    const key = [lam, W, inten, U].join('|');
    if (key !== last) { last = key; reset(); }
    if (dt > 0) T += dt;

    const E = HC / lam;                 // 光子能量，eV
    const emit = E > W + 1e-9;          // 能否发生光电效应
    const Ek = emit ? E - W : 0;        // 最大初动能，eV
    const Uc = Ek;                      // 遏止电压，V
    const nu = 2.998e8 / (lam * 1e-9);  // 频率，Hz
    const nu0 = W / H_EV;               // 截止频率，Hz
    const lamC = HC / W;                // 截止波长，nm

    // 光电流（按饱和电流归一）：U ≥ 0 饱和，反向时按能量不足的电子比例下降
    const Irel = !emit ? 0
      : U >= 0 ? 1
        : Uc < 1e-6 ? 0
          : Math.max(0, 1 - Math.pow(Math.abs(U) / Uc, 1.5));

    ctx.clearRect(0, 0, w, h);

    /* ══ 左栏：光电管 ═════════════════════════════════════════ */
    const cy = h * 0.46;
    const xC = w * 0.15, xA = w * 0.41;
    const pT = cy - h * 0.27, pB = cy + h * 0.27;

    // 管壳
    ctx.save();
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.roundRect ? ctx.roundRect(w * 0.07, h * 0.10, w * 0.40, h * 0.74, 14) : ctx.rect(w * 0.07, h * 0.10, w * 0.40, h * 0.74);
    ctx.stroke();
    ctx.restore();
    label(ctx, '光电管（真空）', w * 0.075, h * 0.10 - 12, pal.mut, 'left', 13);

    // 入射光
    const rayCol = emit ? pal.orange : pal.faint;
    ctx.save();
    ctx.strokeStyle = rayCol;
    ctx.fillStyle = rayCol;
    ctx.lineWidth = 2;
    for (let k = 0; k < 3; k++) {
      const yy = cy - h * 0.10 + k * h * 0.10;
      ctx.beginPath();
      ctx.moveTo(w * 0.005, yy - 10);
      ctx.lineTo(xC - 8, yy + 10);
      ctx.stroke();
      // 箭头尖
      ctx.beginPath();
      ctx.moveTo(xC - 8, yy + 10);
      ctx.lineTo(xC - 20, yy + 4);
      ctx.lineTo(xC - 14, yy + 18);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    label(ctx, emit ? `λ = ${fmt(lam, 0)} nm` : '光子能量不足', w * 0.008, cy - h * 0.10 - 14, rayCol, 'left', 13);

    // 阴极 K、阳极 A
    ctx.save();
    ctx.strokeStyle = pal.orange;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(xC, pT);
    ctx.lineTo(xC, pB);
    ctx.stroke();
    ctx.strokeStyle = pal.blue;
    ctx.beginPath();
    ctx.moveTo(xA, pT);
    ctx.lineTo(xA, pB);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'K 阴极', xC, pT - 12, pal.orange, 'center', 13);
    label(ctx, 'A 阳极', xA, pT - 12, pal.blue, 'center', 13);

    // 电场方向提示
    if (Math.abs(U) > 0.02) {
      label(ctx, U > 0 ? '电场加速电子' : '电场阻碍电子', (xC + xA) / 2, pB + 16, pal.mut, 'center', 12);
    }

    /* 电子运动 */
    const held = U;
    const ax = 55 * held;
    if (dt > 0) {
      if (emit) {
        spawnAcc += dt * (2.5 + 5.5 * inten) * (U >= 0 ? 1 : 0.55 + 0.45 * Irel);
        while (spawnAcc >= 1 && els.length < 90) {
          spawnAcc -= 1;
          els.push({
            x: xC + 5,
            y: cy + (Math.random() - 0.5) * h * 0.40,
            vx: 42 + 26 * Math.sqrt(Ek),
            vy: (Math.random() - 0.5) * 34,
          });
        }
      } else {
        spawnAcc = 0;
      }
      for (const e of els) {
        e.vx += ax * dt;
        e.x += e.vx * dt;
        e.y += e.vy * dt;
      }
      for (let i = els.length - 1; i >= 0; i--) {
        const e = els[i];
        if (e.x >= xA) { hitCount += 1; els.splice(i, 1); continue; }
        if (e.x <= xC - 2) { els.splice(i, 1); continue; }
        if (e.y < pT + 4 || e.y > pB - 4) { els.splice(i, 1); }
      }
      if (els.length > 90) els.splice(0, els.length - 90);
    }

    ctx.save();
    for (const e of els) {
      ctx.fillStyle = pal.cyan;
      ctx.beginPath();
      ctx.arc(e.x, e.y, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 电路：阴极 → 下导线 → 电源 → 阳极，串一只电流表
    const yWire = pB + h * 0.14;
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(xC, pB);
    ctx.lineTo(xC, yWire);
    ctx.lineTo(w * 0.24, yWire);
    ctx.moveTo(w * 0.30, yWire);
    ctx.lineTo(xA, yWire);
    ctx.lineTo(xA, pB);
    ctx.stroke();
    // 电源
    ctx.strokeStyle = pal.mut;
    ctx.beginPath();
    ctx.moveTo(w * 0.245, yWire - 10);
    ctx.lineTo(w * 0.245, yWire + 10);
    ctx.moveTo(w * 0.255, yWire - 6);
    ctx.lineTo(w * 0.255, yWire + 6);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(w * 0.265, yWire - 10);
    ctx.lineTo(w * 0.265, yWire + 10);
    ctx.moveTo(w * 0.275, yWire - 6);
    ctx.lineTo(w * 0.275, yWire + 6);
    ctx.stroke();
    // 电流表
    ctx.strokeStyle = pal.line;
    ctx.beginPath();
    ctx.arc(w * 0.345, yWire, 11, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    label(ctx, 'A', w * 0.345, yWire + 4, pal.mut, 'center', 12);
    label(ctx, `U = ${fmt(U, 2)} V`, (w * 0.245 + w * 0.275) / 2, yWire + 30, pal.mut, 'center', 13);

    /* ══ 右上：光电流随电压 ════════════════════════════════════ */
    const rc1 = { x: w * 0.545, y: h * 0.09, w: w * 0.42, h: h * 0.36 };
    const xL = -Math.max(1.0, Uc * 1.35, Math.abs(U) * 1.05) - 0.25;
    const xR = 2.4;
    const g1 = panel(ctx, rc1, [xL, xR], [0, 1.14], pal, { xlab: 'U/V', ylab: 'I/I_s', nx: 4, ny: 3 });
    const fOf = u => {
      if (!emit) return 0;
      if (u >= 0) return 1;
      if (Uc < 1e-6) return 0;
      return Math.max(0, 1 - Math.pow(Math.abs(u) / Uc, 1.5));
    };
    const pts = [];
    for (let i = 0; i <= 240; i++) {
      const u = xL + ((xR - xL) * i) / 240;
      pts.push([u, fOf(u)]);
    }
    poly(ctx, g1.X, g1.Y, pts, pal.orange, 2.2);

    // 遏止电压与饱和电流两条参照线
    if (emit && Uc > 1e-6 && Math.abs(-Uc) >= xL) {
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = pal.faint;
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(g1.X(-Uc), g1.Y(0));
      ctx.lineTo(g1.X(-Uc), g1.Y(1.14));
      ctx.stroke();
      ctx.restore();
      label(ctx, '−U_c', g1.X(-Uc), g1.Y(0) + 16, pal.mut, 'center', 12);
    }
    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = pal.faint;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(g1.X(xL), g1.Y(1));
    ctx.lineTo(g1.X(xR), g1.Y(1));
    ctx.stroke();
    ctx.restore();
    spot(ctx, g1.X(U), g1.Y(Irel), 4.6, pal.pink, pal.bg2);
    label(ctx, '光电流随电压的变化', rc1.x + 2, rc1.y - 12, pal.mut, 'left', 13);

    /* ══ 右下：光子能量的分配 ═════════════════════════════════ */
    const rc2 = { x: w * 0.545, y: h * 0.60, w: w * 0.42, h: h * 0.20 };
    const Emax = Math.max(E * 1.12, 4);
    const bw = rc2.w, bh = 24, by = rc2.y + 22;
    label(ctx, '光子的能量分配  E = W + E_k', rc2.x + 2, rc2.y - 2, pal.mut, 'left', 13);
    const wpx = (W / Emax) * bw;
    const epx = emit ? (Ek / Emax) * bw : 0;
    ctx.save();
    ctx.fillStyle = pal.orange;
    ctx.globalAlpha = 0.75;
    ctx.fillRect(rc2.x, by, Math.min(wpx, bw), bh);
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = pal.green;
    ctx.fillRect(rc2.x + Math.min(wpx, bw), by, epx, bh);
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 1.2;
    ctx.strokeRect(rc2.x + 0.5, by + 0.5, Math.min(wpx + epx, bw) - 1, bh - 1);
    ctx.restore();
    label(ctx, `W = ${fmt(W, 2)} eV`, rc2.x + Math.min(wpx, bw) / 2, by + bh / 2 + 4, pal.ink, 'center', 12);
    if (epx > 52) {
      label(ctx, `E_k = ${fmt(Ek, 2)} eV`, rc2.x + Math.min(wpx, bw) + epx / 2, by + bh / 2 + 4, pal.ink, 'center', 12);
    }
    label(ctx, `光子 E = ${fmt(E, 2)} eV`, rc2.x, by + bh + 18, emit ? pal.mut : pal.pink, 'left', 13);
    if (!emit) {
      label(ctx, '光子能量小于逸出功，无法逸出', rc2.x + epx + wpx + 8, by + bh / 2 + 4, pal.pink, 'left', 12);
    }

    st.readout([
      ['波长 λ', fmt(lam, 0) + ' nm'],
      ['频率 ν', fmt(nu / 1e14, 2) + ' ×10¹⁴ Hz'],
      ['光子能量 E = hν', fmt(E, 2) + ' eV'],
      ['逸出功 W', fmt(W, 2) + ' eV'],
      ['最大初动能 E_k', emit ? fmt(Ek, 2) + ' eV' : '— （不发生光电效应）'],
      ['遏止电压 U_c', emit ? fmt(Uc, 2) + ' V' : '—'],
      ['外加电压 U', fmt(U, 2) + ' V'],
      ['光电流 I/I_s', fmt(Irel, 3)],
      ['饱和电流 ∝ 光强', fmt(inten, 2) + ' 倍'],
      ['截止频率 ν₀ = W/h', fmt(nu0 / 1e14, 2) + ' ×10¹⁴ Hz'],
      ['截止波长 λ_c = hc/W', fmt(lamC, 0) + ' nm'],
    ]);
  }

  return { frame, reset };
}
