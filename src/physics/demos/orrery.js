/* 力19b 黄铜行星仪：把开普勒第一、二、三定律做成一架能转的黄铜仪器。
   太阳钉在主轴顶端的焦点上，行星沿绕焦点一周的金属环滚动，轨道平面可相对
   盘面倾转 i。正交投影 + 屏幕空间金属漆（lathe3d.js）给出黄铜质感，
   按住画面拖动可以转视角、Ctrl+滚轮缩放。

   世界坐标与 orbit.js 同一套：x 向右、y 向上、z 朝读者。
   轨道取半长轴 a、离心率 e，以焦点为原点、长轴沿 x 轴。椭圆上的点在轨道
   平面 (u, v) 内：u = a(cos E − e)，v = b sin E；世界点 (u, v sin i, v cos i)。
   E 为偏近点角，由开普勒方程 E − e sin E = M 解出。b = a√(1−e²)，周期 T = a^1.5，
   取 GM = 4π²（天文单位·年单位下），周期定律 T² = a³ 在每个参数档都成立。 */

import { label, arrow, clamp, fmt } from '../gfx.js';
import { shade, tint, capsule, ring, dot } from './lathe3d.js';
import { makeOrbit } from './orbit.js';

const TAU = Math.PI * 2;
const D2R = Math.PI / 180;
const BRASS = '#c9a253';

/** 偏近点角：牛顿法解 E − e sinE = M */
const eccAnom = (M, e) => {
  let E = M;
  for (let i = 0; i < 6; i++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  return E;
};

export function create(st) {
  let t = 0;
  let last = '';

  const reset = () => {
    t = 0;
  };
  reset();

  /* 从右前上方略带俯角看，轨道扁圆一眼分得清 */
  const orb = makeOrbit({ yaw: -0.55, pitch: 0.4, ylim: 1.2, pmin: 0.14, pmax: 1.02 });

  function frame(dt) {
    if (!st.w || !st.h) return;
    const { ctx, w, h, pal } = st;
    const q = st.params;
    const nn = (v, d) => (Number.isFinite(Number(v)) ? Number(v) : d);
    const a = clamp(nn(q.a, 1), 0.6, 1.4);
    const e = clamp(nn(q.e, 0.35), 0, 0.6);
    const inc = clamp(nn(q.inc, 18), 0, 40) * D2R;

    const key = [a, e, inc].join('|');
    if (key !== last) {
      last = key;
      reset();
    }
    if (dt > 0) t += dt;

    const si = Math.sin(inc);
    const ci = Math.cos(inc);
    const b = a * Math.sqrt(1 - e * e);
    const c = a * e;
    const T = a * Math.sqrt(a);
    const tdisp = clamp(5 * T, 4, 14); /* 画面上转一圈的墙钟秒数，星绕得不慌不忙 */
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

    /* 盘面高度恒在轨道最低点之下，盘面半径大于轨道最远点 a(1+e) */
    const PLY = b * si * 0.9 + 0.14 * a;
    const Rbase = a * (1.2 + e);

    const pt = (E2) => {
      const c2 = Math.cos(E2);
      const s2 = Math.sin(E2);
      return [a * (c2 - e), b * s2 * si, b * s2 * ci];
    };

    /* ── 取景：轨道、行星附近切线余量、盘面、太阳、倾角弧、各标牌杆顶端 ── */
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
    for (const de of [-0.45, 0.45]) {
      const p = pt(E + de);
      take(p[0], p[1], p[2]);
    }
    for (let i = 0; i < 48; i++) {
      const th0 = (i * TAU) / 48;
      take(Rbase * Math.cos(th0), -PLY, Rbase * Math.sin(th0));
    }
    take(0, -PLY, 0);
    take(0, 0, 0);
    if (inc > 0.035) {
      const nodeX = a * (1 - e);
      const Rarc = 0.18 * a;
      for (let k = 0; k <= 8; k++) {
        const kk = (k / 8) * inc;
        take(nodeX, Rarc * Math.sin(kk), Rarc * Math.cos(kk));
      }
    }
    if (e > 1e-4) {
      take(-c, 0, 0);
      take(-2 * c, 0, 0);
      take(a * (1 - e), 0, 0);
      take(-a * (1 + e), 0, 0);
    }

    const S = Math.min((w * 0.88) / Math.max(0.3, hi - lo), (h * 0.8) / Math.max(0.3, top - bot));
    const OX = w / 2 - (S * (lo + hi)) / 2;
    const OY = h / 2 + 0.01 * h + (S * (top + bot)) / 2;
    const P = (x, y, z) => {
      const [X, U] = orb.proj(x, y, z);
      return [OX + S * X, OY - S * U];
    };

    ctx.clearRect(0, 0, w, h);

    const bandW = clamp(S * 0.03, 1.8, 5);
    const plR = clamp(S * 0.03, 3.5, 8);
    const sunR = clamp(S * 0.06, 6, 14);

    /* ── 盘面：48 段采样的盘沿多边形，径向铜色渐变 ── */
    const plateC = P(0, -PLY, 0);
    const rim = [];
    for (let i = 0; i < 48; i++) {
      const th0 = (i * TAU) / 48;
      rim.push(P(Rbase * Math.cos(th0), -PLY, Rbase * Math.sin(th0)));
    }
    let gmax = 0;
    for (const p of rim) gmax = Math.max(gmax, Math.hypot(p[0] - plateC[0], p[1] - plateC[1]));
    const plateGr = ctx.createRadialGradient(plateC[0], plateC[1], 0, plateC[0], plateC[1], Math.max(1, gmax));
    plateGr.addColorStop(0, tint(BRASS, 0.42));
    plateGr.addColorStop(0.55, BRASS);
    plateGr.addColorStop(1, shade(BRASS, 0.55));
    ctx.beginPath();
    rim.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    ctx.fillStyle = plateGr;
    ctx.fill();
    ctx.strokeStyle = shade(BRASS, 0.38);
    ctx.lineWidth = 1.6;
    ctx.stroke();

    /* 盘面刻线：内圈装饰环 */
    ctx.save();
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = shade(BRASS, 0.5);
    ctx.globalAlpha = 0.85;
    ctx.lineWidth = 1;
    const gR = 0.74 * Rbase;
    ctx.beginPath();
    for (let i = 0; i <= 80; i++) {
      const th0 = (i * TAU) / 80;
      const p = P(gR * Math.cos(th0), -PLY, gR * Math.sin(th0));
      if (i) ctx.lineTo(p[0], p[1]);
      else ctx.moveTo(p[0], p[1]);
    }
    ctx.stroke();
    ctx.restore();

    /* ── 轨道环在盘面上的投影，淡虚线 ── */
    ctx.save();
    ctx.setLineDash([3, 6]);
    ctx.strokeStyle = shade(BRASS, 0.35);
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    for (let i = 0; i <= 96; i++) {
      const p = pt((i * TAU) / 96);
      const s = P(p[0], -PLY, p[2]);
      if (i) ctx.lineTo(s[0], s[1]);
      else ctx.moveTo(s[0], s[1]);
    }
    ctx.stroke();
    ctx.restore();

    /* ── 主轴：盘心到太阳 ── */
    const sun = P(0, 0, 0);
    capsule(ctx, plateC[0], plateC[1], sun[0], sun[1], clamp(S * 0.01, 1, 1.6), BRASS);

    /* ── 轨道环：背面一半压暗、正面一半粗暗底 + 细亮线叠出金属高光 ── */
    const seg = 72;
    const band = (E0, segF, stroke, width, alpha) => {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.strokeStyle = stroke;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = width;
      ctx.beginPath();
      for (let i = 0; i <= seg; i++) {
        const E2 = E0 + (segF * i) / seg;
        const p = pt(E2);
        const s = P(p[0], p[1], p[2]);
        if (i) ctx.lineTo(s[0], s[1]);
        else ctx.moveTo(s[0], s[1]);
      }
      ctx.stroke();
      ctx.restore();
    };
    if (e > 1e-4) {
      /* 椭圆要按 E 的指向分出前后两半 */
      band(Math.PI, Math.PI, shade(BRASS, 0.5), bandW * 0.92, 0.5);
      band(0, Math.PI, shade(BRASS, 0.42), bandW, 0.95);
      band(0, Math.PI, tint(BRASS, 0.22), bandW * 0.4, 1);
    } else {
      /* 圆：背面压暗，正面亮 */
      band(Math.PI, Math.PI, shade(BRASS, 0.5), bandW * 0.92, 0.5);
      band(0, Math.PI, shade(BRASS, 0.42), bandW, 0.95);
      band(0, Math.PI, tint(BRASS, 0.22), bandW * 0.4, 1);
    }

    /* ── e > 0：空焦点、中心、近日点、远日点的标牌杆与标点 ── */
    if (e > 1e-4) {
      const post = (wx, wz, topC) => {
        const btm = P(wx, -PLY, wz);
        capsule(ctx, btm[0], btm[1], topC[0], topC[1], 1.3, BRASS);
      };
      const PC = P(-c, 0, 0);
      const PFp = P(-2 * c, 0, 0);
      const Pperi = P(a * (1 - e), 0, 0);
      const Paphel = P(-a * (1 + e), 0, 0);
      post(-c, 0, PC);
      post(-2 * c, 0, PFp);
      post(a * (1 - e), 0, Pperi);
      post(-a * (1 + e), 0, Paphel);
      ring(ctx, PFp[0], PFp[1], 4.5, pal.mut, { width: 1.6, alpha: 0.95 });
      dot(ctx, PC[0], PC[1], 2.8, pal.mut);
      dot(ctx, Pperi[0], Pperi[1], 2.6, pal.mut);
      dot(ctx, Paphel[0], Paphel[1], 2.6, pal.mut);
    }

    /* ── 太阳到行星的游标杆 ── */
    const planet = P(px, py, pz);
    capsule(ctx, sun[0], sun[1], planet[0], planet[1], 2.1, BRASS);

    /* ── 行星与太阳球 ── */
    const plGr = ctx.createRadialGradient(planet[0] - plR * 0.35, planet[1] - plR * 0.35, 0, planet[0], planet[1], plR);
    plGr.addColorStop(0, tint(pal.blue, 0.75));
    plGr.addColorStop(0.55, pal.blue);
    plGr.addColorStop(1, shade(pal.blue, 0.55));
    ctx.beginPath();
    ctx.arc(planet[0], planet[1], plR, 0, TAU);
    ctx.fillStyle = plGr;
    ctx.fill();

    const sunGr = ctx.createRadialGradient(sun[0] - sunR * 0.3, sun[1] - sunR * 0.3, 0, sun[0], sun[1], sunR);
    sunGr.addColorStop(0, '#fff3c0');
    sunGr.addColorStop(0.35, tint(BRASS, 0.5));
    sunGr.addColorStop(0.75, BRASS);
    sunGr.addColorStop(1, shade(BRASS, 0.32));
    ctx.beginPath();
    ctx.arc(sun[0], sun[1], sunR, 0, TAU);
    ctx.fillStyle = sunGr;
    ctx.fill();

    /* ── 绿色线速度箭头：沿轨道环的切向，长度按即时速率 ── */
    const s0 = P.apply(null, pt(E + 0.035));
    const s1 = P.apply(null, pt(E - 0.035));
    const dx = s0[0] - s1[0];
    const dy = s0[1] - s1[1];
    const dl = Math.hypot(dx, dy) || 1;
    const vLen = clamp(spd * 5, 20, 64);
    const vEnd = [planet[0] + (dx / dl) * vLen, planet[1] + (dy / dl) * vLen];
    arrow(ctx, planet[0] + (dx / dl) * (plR + 2), planet[1] + (dy / dl) * (plR + 2), vEnd[0], vEnd[1], pal.green, 2.6);

    /* ── 轨道倾角 i：两条淡虚线基准 + 绿弧 ── */
    if (inc > 0.035) {
      const nodeX = a * (1 - e);
      const Rarc = 0.18 * a;
      ctx.save();
      ctx.setLineDash([3, 5]);
      ctx.strokeStyle = pal.faint;
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
      ctx.strokeStyle = pal.green;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 1.4;
      const steps = Math.max(8, Math.ceil((inc / TAU) * 72));
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const kk = (inc * i) / steps;
        const p = P(nodeX, Rarc * Math.sin(kk), Rarc * Math.cos(kk));
        if (i) ctx.lineTo(p[0], p[1]);
        else ctx.moveTo(p[0], p[1]);
      }
      ctx.stroke();
      ctx.restore();
    }

    /* ── 标签：固定项在前、条件项在后，顺序稳定 ── */
    label(ctx, '太阳', sun[0] + sunR + 8, sun[1] + 3, pal.orange, 'left', 13);

    const armDx = planet[0] - sun[0];
    const armDy = planet[1] - sun[1];
    const armL = Math.hypot(armDx, armDy) || 1;
    let nx0 = -armDy / armL;
    let ny0 = armDx / armL;
    if (ny0 > 0) {
      nx0 = -nx0;
      ny0 = -ny0;
    }
    label(ctx, 'r', (sun[0] + planet[0]) / 2 + nx0 * 12, (sun[1] + planet[1]) / 2 + ny0 * 12, pal.cyan, 'left', 13);

    label(ctx, 'v', vEnd[0] + 8, vEnd[1] - 6, pal.green, 'left', 13);

    /* ── 条件标签排在固定项之后，各自相对顺序不变 ── */
    if (e > 1e-4) {
      const PFp2 = P(-2 * c, 0, 0);
      const PC2 = P(-c, 0, 0);
      const Pperi2 = P(a * (1 - e), 0, 0);
      const Paphel2 = P(-a * (1 + e), 0, 0);
      label(ctx, 'F′', PFp2[0] + 12, PFp2[1] - 4, pal.mut, 'left', 13);
      label(ctx, 'C', PC2[0] + 4, PC2[1] - 8, pal.mut, 'left', 13);
      label(ctx, '近日点', Pperi2[0] + 14, Pperi2[1] - 8, pal.mut, 'left', 13);
      label(ctx, '远日点', Paphel2[0] - 10, Paphel2[1] - 8, pal.mut, 'left', 13);
    }
    if (inc > 0.035) {
      const nX = a * (1 - e);
      const rA = 0.18 * a;
      const lp2 = P(nX, rA * Math.sin(inc / 2), rA * Math.cos(inc / 2));
      label(ctx, 'i', lp2[0] + 7, lp2[1] - 6, pal.green, 'left', 13);
    }

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