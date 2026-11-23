/* 图 力19b：三维开普勒行星仪（浅色渐变的仪器，不再是金属铜色）。
   把开普勒三定律合成一台能转的仪器：一块浅色渐变圆盘托着一圈倾斜的轨道环，
   太阳亮球立在盘心的竖直杆顶（也是椭圆的一个焦点），蓝色行星沿线速度方向滚动。
   轨道平面相对盘面倾角 i，可按住画面拖动转视角；盘上还投影出轨道环的影子。
   轨道环上铺十二块从太阳扫出的等时间扇形——形状各异而面积相等，当前那块着色更重；
   另一个焦点 F′、长轴中点 C、近日点与远日点各有一根小标牌杆。绿色箭头是此刻速率，
   读数栏逐行给出 a、e、i、T、近远日点距离、r、v 与 T²/a³。

   世界坐标与 orbit.js 同一套：x 向右、y 向上、z 朝读者。焦点（太阳）取原点，
   长轴沿 x 轴；轨道平面上 u = a(cos E − e)、v = b sin E，世界点 (u, v sin i, v cos i)，
   b = a√(1−e²)。平近点角 M 随时间匀速（等时间＝等面积），由 E − e sin E = M 解 E。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { shade, tint, capsule, ring, dot } from './lathe3d.js';
import { makeOrbit } from './orbit.js';

const TAU = Math.PI * 2;
const D2R = Math.PI / 180;

/* 浅色多色调：盘面走冷白→浅蓝灰，环取青，扇形交替桃 / 薄荷 / 淡紫，太阳暖黄、行星蓝、
   速率绿、倾角弧赭。全部是浅到中浅的色，压在浅色盘上看得清，又不会太深。 */
const C = {
  plate0: '#f6f9fe',
  plate1: '#e2eaf6',
  plate2: '#c8d5e8',
  rim: '#aab7cb',
  decal: '#b8c4d6',
  ringBack: '#a7cbd6',
  ring: '#5aa0b6',
  ringHi: '#8fd0e0',
  wedgeA: '#ffd2b4',
  wedgeB: '#c6e6d8',
  wedgeC: '#d8d0f0',
  wedgeNow: '#ffbd8f',
  sun0: '#fff8da',
  sun1: '#ffda91',
  sun2: '#f0aa5c',
  planet0: '#d6ecff',
  planet1: '#7fb6e6',
  planet2: '#4f86bb',
  arm: '#8fc3c9',
  ink: '#56637b',
  inkStrong: '#3f4c61',
  faint: '#9aa8bf',
  vel: '#4fae7e',
  incArc: '#d0916a',
};

/** 偏近点角：牛顿法解 E − e sinE = M */
const eccAnom = (M, e) => {
  let E = M;
  for (let i = 0; i < 8; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return E;
};

export function create(st) {
  let t = 0;
  let last = '';
  const reset = () => { t = 0; };
  reset();

  /* 略带俯角看：盘面与倾斜的轨道平面都能读出来 */
  const orb = makeOrbit({ yaw: -0.6, pitch: 0.6, ylim: 1.25, pmin: 0.16, pmax: 1.22 });

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const a = clamp(nn(q.a, 1), 0.6, 1.5);
    const e = clamp(nn(q.e, 0.35), 0, 0.6);
    const inc = clamp(nn(q.inc, 18), 0, 40) * D2R;

    const key = [a, e, inc].join('|');
    if (key !== last) { last = key; reset(); }
    if (dt > 0) t += dt;

    const si = Math.sin(inc);
    const ci = Math.cos(inc);
    const b = a * Math.sqrt(Math.max(0, 1 - e * e));
    const c = a * e;
    const T = a * Math.sqrt(a);
    const tdisp = clamp(5 * T, 4, 14); // 画面上转一圈的墙钟秒数，a 大就更慢
    const M = TAU * ((t % tdisp) / tdisp);
    const E = e > 2e-3 ? eccAnom(M, e) : M;
    const cE = Math.cos(E);
    const sE = Math.sin(E);
    const uu = a * (cE - e);
    const vv = b * sE;
    const px = uu;
    const py = vv * si;
    const pz = vv * ci;
    const r = a * (1 - e * cE);
    const spd = TAU * Math.sqrt(Math.max(0, 2 / r - 1 / a));
    const nowIdx = Math.floor(((M / D2R) % 360) / 30) % 12;

    /* 盘面在轨道最低点之下，半径大于轨道最外点 */
    const PLY = b * si + 0.16 * a;
    const Rbase = a * (1.2 + e);

    const pt = (E2) => {
      const c2 = Math.cos(E2);
      const s2 = Math.sin(E2);
      return [a * (c2 - e), b * s2 * si, b * s2 * ci];
    };
    /* 平近点角 Mdeg → 轨道点 */
    const ptM = (Mdeg) => pt(e > 2e-3 ? eccAnom(Mdeg * D2R, e) : Mdeg * D2R);

    /* ── 取景：轨道、盘沿、各标牌杆顶、倾角弧 ── */
    let lo = Infinity, hi = -Infinity, bot = Infinity, top = -Infinity;
    const take = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      if (X < lo) lo = X;
      if (X > hi) hi = X;
      if (U < bot) bot = U;
      if (U > top) top = U;
    };
    for (let i = 0; i <= 72; i++) {
      const p = pt((i * TAU) / 72);
      take(p[0], p[1], p[2]);
    }
    for (let i = 0; i < 48; i++) {
      const th = (i * TAU) / 48;
      take(Rbase * Math.cos(th), -PLY, Rbase * Math.sin(th));
    }
    take(0, -PLY, 0);
    take(0, 0, 0);
    if (e > 1e-4) {
      for (const x of [-2 * c, -c, a * (1 - e), -a * (1 + e)]) take(x, 0, 0);
    }
    if (inc > 0.035) {
      const nodeX = a * (1 - e);
      const Rarc = 0.2 * a;
      for (let k = 0; k <= 8; k++) {
        const kk = (k / 8) * inc;
        take(nodeX, Rarc * Math.sin(kk), Rarc * Math.cos(kk));
      }
    }

    const S = Math.min((w * 0.84) / Math.max(0.4, hi - lo), (h * 0.80) / Math.max(0.4, top - bot));
    const OX = w / 2 - (S * (lo + hi)) / 2;
    const OY = h / 2 + (S * (top + bot)) / 2;
    const P = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      return [OX + S * X, OY - S * U];
    };

    ctx.clearRect(0, 0, w, h);

    const plR = clamp(S * 0.028, 3.5, 7);
    const sunR = clamp(S * 0.05, 6, 13);
    const bandW = clamp(S * 0.028, 1.8, 5);

    /* ── 盘面：径向浅色渐变 ── */
    const plateC = P(0, -PLY, 0);
    const rim = [];
    for (let i = 0; i < 48; i++) {
      const th = (i * TAU) / 48;
      rim.push(P(Rbase * Math.cos(th), -PLY, Rbase * Math.sin(th)));
    }
    let gmax = 0;
    for (const p of rim) gmax = Math.max(gmax, Math.hypot(p[0] - plateC[0], p[1] - plateC[1]));
    const gr = ctx.createRadialGradient(plateC[0], plateC[1], 0, plateC[0], plateC[1], Math.max(1, gmax));
    gr.addColorStop(0, C.plate0);
    gr.addColorStop(0.55, C.plate1);
    gr.addColorStop(1, C.plate2);
    ctx.beginPath();
    rim.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    ctx.fillStyle = gr;
    ctx.fill();
    ctx.strokeStyle = C.rim;
    ctx.lineWidth = 1.6;
    ctx.stroke();

    /* 盘面装饰：两圈淡虚线 */
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = C.decal;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = 1;
    for (const rr of [0.72, 0.5]) {
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const th = (i * TAU) / 80;
        const p = P(Rbase * rr * Math.cos(th), -PLY, Rbase * rr * Math.sin(th));
        if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
    }
    ctx.restore();

    /* 轨道环投在盘面上的影子 */
    ctx.save();
    ctx.setLineDash([3, 6]);
    ctx.strokeStyle = C.faint;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    for (let i = 0; i <= 96; i++) {
      const p = pt((i * TAU) / 96);
      const s = P(p[0], -PLY, p[2]);
      if (i) ctx.lineTo(s[0], s[1]); else ctx.moveTo(s[0], s[1]);
    }
    ctx.stroke();
    ctx.restore();

    /* ── 十二块等时间扇形（画在倾斜的轨道平面上） ── */
    const sunPt = P(0, 0, 0);
    const wedgeCols = [C.wedgeA, C.wedgeB, C.wedgeC];
    for (let i = 0; i < 12; i++) {
      const M0 = i * 30;
      ctx.beginPath();
      ctx.moveTo(sunPt[0], sunPt[1]);
      const steps = 6;
      for (let j = 0; j <= steps; j++) {
        const fp = ptM(M0 + (30 * j) / steps);
        const p = P(fp[0], fp[1], fp[2]);
        ctx.lineTo(p[0], p[1]);
      }
      ctx.closePath();
      if (i === nowIdx) { ctx.fillStyle = C.wedgeNow; ctx.globalAlpha = 0.62; }
      else { ctx.fillStyle = wedgeCols[i % 3]; ctx.globalAlpha = 0.4; }
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    /* 扇形分界的十二条半径（淡淡的） */
    ctx.save();
    ctx.strokeStyle = C.faint;
    ctx.globalAlpha = 0.5;
    ctx.lineWidth = 1;
    for (let i = 0; i < 12; i++) {
      const fp = ptM(i * 30);
      const p = P(fp[0], fp[1], fp[2]);
      ctx.beginPath();
      ctx.moveTo(sunPt[0], sunPt[1]);
      ctx.lineTo(p[0], p[1]);
      ctx.stroke();
    }
    ctx.restore();

    /* ── 轨道环：背面淡、正面重 + 细高光 ── */
    const band = (E0, span, stroke, width, alpha) => {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = stroke;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width;
      ctx.beginPath();
      const seg = 64;
      for (let i = 0; i <= seg; i++) {
        const p = pt(E0 + (span * i) / seg);
        const s = P(p[0], p[1], p[2]);
        if (i) ctx.lineTo(s[0], s[1]); else ctx.moveTo(s[0], s[1]);
      }
      ctx.stroke();
      ctx.restore();
    };
    band(Math.PI, Math.PI, C.ringBack, bandW * 0.9, 0.5);
    band(0, Math.PI, C.ring, bandW, 0.95);
    band(0, Math.PI, C.ringHi, bandW * 0.38, 1);

    /* ── 焦点 / 中心 / 近远日点的标牌杆 ── */
    if (e > 1e-4) {
      const mark = (wx, kind) => {
        const btm = P(wx, -PLY, 0);
        const topP = P(wx, 0, 0);
        capsule(ctx, btm[0], btm[1], topP[0], topP[1], 1.3, C.rim, { tint: 0.2, dark: 0.7 });
        if (kind === 'ring') ring(ctx, topP[0], topP[1], 4.2, C.ink, { width: 1.5, alpha: 0.9 });
        else dot(ctx, topP[0], topP[1], 2.6, kind === 'c' ? C.decal : C.ink, { edge: C.plate0 });
      };
      mark(-2 * c, 'ring');   // F′
      mark(-c, 'c');          // C
      mark(a * (1 - e), 'dot');   // 近日点
      mark(-a * (1 + e), 'dot');  // 远日点
    }

    /* ── 太阳：盘心立杆 + 暖色亮球 ── */
    capsule(ctx, plateC[0], plateC[1], sunPt[0], sunPt[1], clamp(S * 0.01, 1, 1.6), C.rim, { tint: 0.3, dark: 0.75 });
    const sg = ctx.createRadialGradient(sunPt[0] - sunR * 0.3, sunPt[1] - sunR * 0.3, 0, sunPt[0], sunPt[1], sunR);
    sg.addColorStop(0, C.sun0);
    sg.addColorStop(0.4, C.sun1);
    sg.addColorStop(1, C.sun2);
    ctx.beginPath();
    ctx.arc(sunPt[0], sunPt[1], sunR, 0, TAU);
    ctx.fillStyle = sg;
    ctx.fill();

    /* ── 太阳到行星的游标杆 ── */
    const planet = P(px, py, pz);
    capsule(ctx, sunPt[0], sunPt[1], planet[0], planet[1], 2, C.arm, { tint: 0.35, dark: 0.7 });

    /* ── 行星 ── */
    const pg = ctx.createRadialGradient(planet[0] - plR * 0.35, planet[1] - plR * 0.35, 0, planet[0], planet[1], plR);
    pg.addColorStop(0, C.planet0);
    pg.addColorStop(0.55, C.planet1);
    pg.addColorStop(1, C.planet2);
    ctx.beginPath();
    ctx.arc(planet[0], planet[1], plR, 0, TAU);
    ctx.fillStyle = pg;
    ctx.fill();

    /* ── 速率箭头：沿轨道切向 ── */
    const s0 = P.apply(null, pt(E + 0.035));
    const s1 = P.apply(null, pt(E - 0.035));
    const dx = s0[0] - s1[0];
    const dy = s0[1] - s1[1];
    const dl = Math.hypot(dx, dy) || 1;
    const vLen = clamp(spd * 5, 20, 64);
    const vEnd = [planet[0] + (dx / dl) * vLen, planet[1] + (dy / dl) * vLen];
    arrow(ctx, planet[0] + (dx / dl) * (plR + 2), planet[1] + (dy / dl) * (plR + 2), vEnd[0], vEnd[1], C.vel, 2.6);

    /* ── 轨道倾角 i ── */
    if (inc > 0.035) {
      const nodeX = a * (1 - e);
      const Rarc = 0.2 * a;
      ctx.save();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = C.faint;
      ctx.globalAlpha = 0.65;
      ctx.lineWidth = 1;
      const nA = P(nodeX, 0, 0);
      const nB = P(nodeX, 0, Rarc);
      const nC = P(nodeX, Rarc * si, Rarc * ci);
      ctx.beginPath();
      ctx.moveTo(nA[0], nA[1]);
      ctx.lineTo(nB[0], nB[1]);
      ctx.moveTo(nA[0], nA[1]);
      ctx.lineTo(nC[0], nC[1]);
      ctx.stroke();
      ctx.restore();
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = C.incArc;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.4;
      const steps = Math.max(8, Math.ceil((inc / TAU) * 72));
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const kk = (inc * i) / steps;
        const p = P(nodeX, Rarc * Math.sin(kk), Rarc * Math.cos(kk));
        if (i) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
      ctx.restore();
      const lp = P(nodeX, Rarc * Math.sin(inc / 2), Rarc * Math.cos(inc / 2));
      label(ctx, 'i', lp[0] + 7, lp[1] - 6, C.incArc, 'left', 13);
    }

    /* ── 标签：固定项在前、条件项在后 ── */
    label(ctx, '太阳', sunPt[0] + sunR + 8, sunPt[1] + 3, C.inkStrong, 'left', 13);

    const armDx = planet[0] - sunPt[0];
    const armDy = planet[1] - sunPt[1];
    const armL = Math.hypot(armDx, armDy) || 1;
    let nx0 = -armDy / armL;
    let ny0 = armDx / armL;
    if (ny0 > 0) { nx0 = -nx0; ny0 = -ny0; }
    label(ctx, 'r', (sunPt[0] + planet[0]) / 2 + nx0 * 12, (sunPt[1] + planet[1]) / 2 + ny0 * 12, C.ring, 'left', 13);
    label(ctx, 'v', vEnd[0] + 8, vEnd[1] - 6, C.vel, 'left', 13);

    if (e > 1e-4) {
      const pFp = P(-2 * c, 0, 0);
      const pC = P(-c, 0, 0);
      const pPe = P(a * (1 - e), 0, 0);
      const pAp = P(-a * (1 + e), 0, 0);
      label(ctx, 'F′', pFp[0] + 12, pFp[1] - 4, C.ink, 'left', 13);
      label(ctx, 'C', pC[0] + 4, pC[1] - 8, C.ink, 'left', 13);
      label(ctx, '近日点', pPe[0] + 14, pPe[1] - 8, C.ink, 'left', 13);
      label(ctx, '远日点', pAp[0] - 10, pAp[1] - 8, C.ink, 'left', 13);
    }

    /* ── 读数 ── */
    st.readout([
      ['半长轴 a', fmt(a, 2) + ' AU'],
      ['离心率 e', fmt(e, 3)],
      ['轨道倾角 i', fmt(inc / D2R, 1) + ' °'],
      ['周期 T', fmt(T, 2) + ' 年'],
      ['近日点', fmt(a * (1 - e), 2) + ' AU'],
      ['远日点', fmt(a * (1 + e), 2) + ' AU'],
      ['此刻 r', fmt(r, 2) + ' AU'],
      ['此刻 v', fmt(spd, 2) + ' AU/年'],
      ['T²/a³', fmt((T * T) / (a * a * a), 3)],
    ]);
  }

  return { frame, reset, orbit: orb };
}
