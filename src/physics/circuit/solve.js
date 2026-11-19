// 电路的求解核心：复数运算、节点电压法、各类元件的诺顿等效。
// 这一层只认传入的普通对象（cells / state / idx）与几何函数 endsOf，
// 不碰 Vue 的响应式，所以可以单独读、单独试算。

import { num } from './util.js';

/* ── 复数与节点电压法 ───────────────────────────────── */
export const CX = (r, i = 0) => ({ r, i });
export const cadd = (a, b) => ({ r: a.r + b.r, i: a.i + b.i });
export const csub = (a, b) => ({ r: a.r - b.r, i: a.i - b.i });
export const cmul = (a, b) => ({ r: a.r * b.r - a.i * b.i, i: a.r * b.i + a.i * b.r });
export const cdiv = (a, b) => {
  const d = b.r * b.r + b.i * b.i || 1e-30;
  return { r: (a.r * b.r + a.i * b.i) / d, i: (a.i * b.r - a.r * b.i) / d };
};
export const cabs = a => Math.hypot(a.r, a.i);
export const cinv = a => cdiv(CX(1), a);
export const SQ2 = Math.SQRT1_2;

export const WIRE_R = 0.001;    // 导线当 1 mΩ 的支路，这样每根线上都能算出电流

export function linsolveC(A, b) {
  const n = b.length;
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (cabs(A[r][c]) > cabs(A[piv][c])) piv = r;
    if (cabs(A[piv][c]) < 1e-14) continue;
    if (piv !== c) {
      const t = A[piv]; A[piv] = A[c]; A[c] = t;
      const tb = b[piv]; b[piv] = b[c]; b[c] = tb;
    }
    const d = A[c][c];
    for (let r = c + 1; r < n; r++) {
      const f = cdiv(A[r][c], d);
      if (cabs(f) < 1e-20) continue;
      for (let cc = c; cc < n; cc++) A[r][cc] = csub(A[r][cc], cmul(f, A[c][cc]));
      b[r] = csub(b[r], cmul(f, b[c]));
    }
  }
  const x = [];
  for (let r = 0; r < n; r++) x.push(CX(0));
  for (let r = n - 1; r >= 0; r--) {
    let s = b[r];
    for (let cc = r + 1; cc < n; cc++) s = csub(s, cmul(A[r][cc], x[cc]));
    x[r] = cabs(A[r][r]) > 1e-14 ? cdiv(s, A[r][r]) : CX(0);
  }
  return x;
}

/* 二极管与灯丝的近似：二极管导通后串 0.5 Ω，截止时 1e8 Ω；
   灯丝电阻随电压按幂次从冷态爬到热态（热态即额定电压、额定功率给出的 Ur²/Pr）。 */
const RON = 0.5;
const ROFF = 1e8;
const AM_R = 1e6;      // 理想电压表内阻
const L_COIL = 0.1;    // 变压器原边自感 (H)

/* 灯丝电阻曲线：R / R_hot = t^(1 − α)，t = |U| / Ur 夹到 2.4 以内。
   α 只改曲线的弯法、不动额定点：α = 0.5 是真实灯丝的凹曲线，
   α = 1 退成过原点的直线（相当于定值电阻），α > 1 是凸（电阻随电压下降、电流涨得越来越快）。
   两端再夹一道（0.14 冷态下限、40 倍上限），原点附近与过压端都不会把矩阵推成奇异。 */
export function bulbRAt(p, Ueff) {
  if (p.mode !== 'curve') return Math.max(0.5, num(p.R, 10));
  const Ur = Math.max(0.5, num(p.Ur, 6));
  const Pr = Math.max(0.1, num(p.Pr, 3));
  const hot = Ur * Ur / Pr;
  const a = Math.min(2.5, Math.max(0, num(p.alpha, 0.5)));
  const t = Math.min(2.4, Math.abs(Ueff) / Ur);
  const rr = Math.pow(Math.max(t, 1e-4), 1 - a);
  return hot * Math.min(40, Math.max(0.14, rr));
}

/* 交流类电源的峰值电动势与频率：交流电源取滑块，发电机按 ε = NBSω 现算 */
export const genPeak = p => Math.max(1, num(p.N, 100)) * Math.max(0, num(p.B, 0.2))
  * Math.max(0, num(p.S, 0.02)) * 2 * Math.PI * Math.max(0, num(p.n, 5));
export function acOf(el) {
  if (el.kind === 'gen') return { A: genPeak(el.p), f: Math.max(0, num(el.p.n, 5)) };
  return { A: Math.max(0.1, num(el.p.A, 6)), f: Math.max(0, num(el.p.f, 50)) };
}

/* 一条支路在角频率 w 下的导纳与等效电动势（诺顿形式 I = y(U − e)） */
export function modelOf(el, key, w, state) {
  const p = el.p;
  switch (el.kind) {
    case 'wire':
    case 'amm':
      return { y: CX(1 / WIRE_R), e: CX(0), loss: WIRE_R };
    case 'sw':
      return p.on ? { y: CX(1 / WIRE_R), e: CX(0), loss: WIRE_R } : null;
    case 'volt':
      return { y: CX(1 / AM_R), e: CX(0), loss: AM_R };
    case 'res': {
      const R = Math.max(0.2, num(p.R, 5));
      return { y: CX(1 / R), e: CX(0), loss: R };
    }
    case 'bulb': {
      const R = Math.max(0.3, state.bulb[key] || bulbRAt(p, 0));
      return { y: CX(1 / R), e: CX(0), loss: R };
    }
    case 'bat': {
      const r = Math.max(0.05, num(p.r, 0.5));
      return { y: CX(1 / r), e: CX(w === 0 ? num(p.emf, 6) : 0), loss: r };
    }
    case 'ac':
    case 'gen': {
      const r = Math.max(0.05, num(p.r, 0.5));
      return { y: CX(1 / r), e: CX(w === 0 ? 0 : acOf(el).A), loss: r };
    }
    case 'cap': {
      const C = Math.max(1e-12, num(p.C, 100) * 1e-6);
      return { y: CX(0, w * C), e: CX(0), loss: 0 };
    }
    case 'ind': {
      const L = Math.max(1e-9, num(p.L, 100) * 1e-3);
      const r = Math.max(0.05, num(p.r, 0.5));
      return { y: cinv(CX(r, w * L)), e: CX(0), loss: r };
    }
    case 'diode': {
      const on = w === 0 ? state.dOn[key] : state.dAc[key];
      if (on) return { y: CX(1 / RON), e: CX(w === 0 ? num(p.Vf, 0.7) : 0), loss: RON };
      return { y: CX(1 / ROFF), e: CX(0), loss: ROFF };
    }
    case 'galv': {
      const Rg = Math.max(1, num(p.Rg, 100));
      return { y: CX(1 / Rg), e: CX(0), loss: Rg };
    }
    case 'motor': {
      const R = Math.max(0.1, num(p.R, 2));
      // 反电动势只出现在直流：堵转时它记作 0，电流退回 U/R，功率全部落在热上
      const E = w === 0 && !p.stall ? Math.max(0, num(p.E, 3)) : 0;
      return { y: CX(1 / R), e: CX(E), loss: R };
    }
    default:
      return null;
  }
}

/* 一次求解：给定角频率与非线性状态，返回各支路的复电压与复电流 */
export function solvePass(cells, endsOf, w, state, idx) {
  const n = idx.n;
  const G = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < n; j++) row.push(CX(0));
    G.push(row);
  }
  const J = [];
  for (let i = 0; i < n; i++) J.push(CX(0));

  const stamp = (ia, ib, y, e) => {
    G[ia][ia] = cadd(G[ia][ia], y);
    G[ib][ib] = cadd(G[ib][ib], y);
    G[ia][ib] = csub(G[ia][ib], y);
    G[ib][ia] = csub(G[ib][ia], y);
    const s = cmul(y, e);
    J[ia] = cadd(J[ia], s);
    J[ib] = csub(J[ib], s);
  };

  // 跨端口的导纳块：行号 ra/rb 上的电流，按列号 ca/cb 的电压取
  const stampX = (ra, rb, ca, cb, y) => {
    G[ra][ca] = cadd(G[ra][ca], y);
    G[ra][cb] = csub(G[ra][cb], y);
    G[rb][ca] = csub(G[rb][ca], y);
    G[rb][cb] = cadd(G[rb][cb], y);
  };

  const brs = [];
  const xfs = [];
  const qs = [];
  for (const k of Object.keys(cells)) {
    const el = cells[k];
    const [ia, ib] = idx.ends[k];
    if (el.kind === 'xfmr') {
      const k2 = el.p.k2;
      if (!k2 || !idx.ends[k2]) continue;
      const [ia2, ib2] = idx.ends[k2];
      const n1 = Math.max(10, num(el.p.n1, 200));
      const n2 = Math.max(10, num(el.p.n2, 200));
      const turn = n2 / n1;
      const L1 = L_COIL;
      const L2 = L1 * turn * turn;
      const M = turn * L1;
      // 耦合两端口的阻抗矩阵 Z = [[R1+jωL1, jωM], [jωM, R2+jωL2]]，取逆得导纳
      const R1 = 0.5;
      const R2 = 0.5;
      const z11 = CX(R1, w * L1);
      const z22 = CX(R2, w * L2);
      const z12 = CX(0, w * M);
      const det = csub(cmul(z11, z22), cmul(z12, z12));
      const Y = [
        [cdiv(z22, det), cdiv(CX(-z12.r, -z12.i), det)],
        [cdiv(CX(-z12.r, -z12.i), det), cdiv(z11, det)],
      ];
      // 二端口按「不定导纳块」进矩阵：端口 1 的电流 I1 = Y11·U1 + Y12·U2 也挂在
      // 端口 2 的两个节点上，所以列号取 ia2 / ib2，行号仍按 I1 从 ia 流向 ib
      stampX(ia, ib, ia2, ib2, Y[0][1]);
      stampX(ia2, ib2, ia, ib, Y[1][0]);
      stampX(ia, ib, ia, ib, Y[0][0]);
      stampX(ia2, ib2, ia2, ib2, Y[1][1]);
      xfs.push({ key: k, ia, ib, ia2, ib2, Y, R1, R2 });
      continue;
    }
    if (el.kind === 'amp') {
      // 电压放大器：输入端一只 Ri，输出端是「A 倍输入电压 + 内阻 Ro」的戴维南源。
      // 戴维南化成诺顿进矩阵：Ro 并上去，另从输出负极向正极注 gm·U入 的电流（gm = A/Ro）
      const k2 = el.p.k2;
      if (!k2 || !idx.ends[k2]) continue;
      const [ca, cb] = idx.ends[k2];
      const Ri = Math.max(1, num(el.p.Ri, 10000));
      const Ro = Math.max(0.05, num(el.p.Ro, 100));
      const A = num(el.p.A, 10);
      const gm = A / Ro;
      stamp(ia, ib, CX(1 / Ri), CX(0));
      stamp(ca, cb, CX(1 / Ro), CX(0));
      if (Math.abs(gm) > 1e-12) stampX(ca, cb, ia, ib, CX(-gm));
      brs.push({ key: k, ia, ib, y: CX(1 / Ri), e: CX(0), loss: Ri });
      brs.push({ key: k + '\u0000o', ia: ca, ib: cb, y: CX(1 / Ro), e: CX(0), loss: Ro });
      continue;
    }
    if (el.kind === 'qnp') {
      // NPN 三极管：BE 结 0.65 V 起导（导通后按 Rbe，截止时当断路），
      // 集电极电流 Ic = β·Ib 用一支受控电流源打进去，C–E 再并一只 rce
      const k2 = el.p.k2;
      if (!k2 || !idx.ends[k2]) continue;
      const e1 = endsOf(k), e2 = endsOf(k2);
      const same = (a, b) => a[0] === b[0] && a[1] === b[1];
      const [a1, b1] = idx.ends[k];
      const [a2, b2] = idx.ends[k2];
      let cI, eI, bI;
      if (same(e1[0], e2[0])) { eI = a1; cI = b1; bI = b2; }
      else if (same(e1[0], e2[1])) { eI = a1; cI = b1; bI = a2; }
      else if (same(e1[1], e2[0])) { eI = b1; cI = a1; bI = b2; }
      else { eI = b1; cI = a1; bI = a2; }
      const beta = Math.max(1, num(el.p.beta, 100));
      const Rbe = Math.max(10, num(el.p.Rbe, 1000));
      const rce = Math.max(50, num(el.p.rce, 50000));
      const on = !!state.qOn[k];
      const Vbe0 = 0.65;
      const yb = on ? 1 / Rbe : 1 / ROFF;
      const eB = w === 0 && on ? Vbe0 : 0;
      const gm = on ? beta / Rbe : 0;
      stamp(bI, eI, CX(yb), CX(eB));
      stamp(cI, eI, CX(1 / rce), CX(0));
      if (gm > 0) {
        stampX(cI, eI, bI, eI, CX(gm));
        // 受控源带的那一项常数 −gm·Vbe0：直流那一趟折进右端矢量，交流只看增量
        if (w === 0) {
          J[cI] = cadd(J[cI], CX(gm * Vbe0));
          J[eI] = csub(J[eI], CX(gm * Vbe0));
        }
      }
      qs.push({
        key: k, cI, eI, bI, a2, b2, yb, eB, gm, Rbe, rce,
        cIsA: cI === a1, bIsA: bI === a2,
      });
      continue;
    }
    const m = modelOf(el, k, w, state);
    if (!m) continue;
    stamp(ia, ib, m.y, m.e);
    brs.push({ key: k, ia, ib, y: m.y, e: m.e, loss: m.loss });
  }

  // 浮空子网兜底：每个节点对地漏一点点电导，矩阵不会奇异
  for (let i = 0; i < n; i++) G[i][i] = cadd(G[i][i], CX(1e-9));
  // 以第 0 号节点为参考地
  if (n) {
    for (let c = 0; c < n; c++) G[0][c] = CX(0);
    G[0][0] = CX(1);
    J[0] = CX(0);
  }

  const V = n ? linsolveC(G, J) : [];
  const br = {};
  for (const b of brs) {
    const U = csub(V[b.ia], V[b.ib]);
    br[b.key] = { U, I: cmul(b.y, csub(U, b.e)), loss: b.loss };
  }
  for (const x of xfs) {
    const U1 = csub(V[x.ia], V[x.ib]);
    const U2 = csub(V[x.ia2], V[x.ib2]);
    const I1 = cadd(cmul(x.Y[0][0], U1), cmul(x.Y[0][1], U2));
    const I2 = cadd(cmul(x.Y[1][0], U1), cmul(x.Y[1][1], U2));
    br[x.key] = { U: U1, I: I1, loss: x.R1 };
    br[x.key + '\u0000s'] = { U: U2, I: I2, loss: x.R2 };
  }
  for (const q of qs) {
    // 解出来再把 C/E/B 三路的量摊开：主边（集电极—发射极）沿 ia→ib 定向，
    // 基极那条沿自己的 a2→b2 定向，小点方向才对得上
    const Ube = csub(V[q.bI], V[q.eI]);
    const Uce = csub(V[q.cI], V[q.eI]);
    const UbeX = csub(Ube, q.eB);
    const Ib = cmul(CX(q.yb), UbeX);
    const Ic = cadd(cmul(CX(1 / q.rce), Uce), q.gm > 0 ? cmul(CX(q.gm), UbeX) : CX(0));
    const neg = c => CX(-c.r, -c.i);
    br[q.key] = { U: Uce, I: q.cIsA ? Ic : neg(Ic), loss: q.rce };
    br[q.key + '\u0000b'] = { U: Ube, I: q.bIsA ? Ib : neg(Ib), loss: q.Rbe };
    // 供右栏读数用：I 一律取各自的正方向（流入集电极 / 流入基极），与边上小点的方向无关
    br[q.key + '\u0000q'] = { U: Uce, I: Ic, loss: q.rce };
    br[q.key + '\u0000i'] = { U: Ube, I: Ib, loss: q.Rbe };
  }
  return br;
}

export const packOf = (dcR, acR) => {
  const dI = dcR ? dcR.I.r : 0;
  const dU = dcR ? dcR.U.r : 0;
  const aAbs = acR ? cabs(acR.I) : 0;
  const aU = acR ? cabs(acR.U) : 0;
  const aIr = acR ? acR.I.r : 0;
  const aUr = acR ? acR.U.r : 0;
  const loss = (dcR ? dcR.loss : 0) || 0;
  // 代表值：直流为主的取直流值，纯交流的取峰值带符号，用来定小点方向与表的读数
  const rep1 = Math.abs(dI) > 1e-9 ? dI : (aAbs > 1e-9 ? (aIr >= 0 ? aAbs : -aAbs) : 0);
  const rep2 = Math.abs(dU) > 1e-9 ? dU : (aU > 1e-9 ? (aUr >= 0 ? aU : -aU) : 0);
  return {
    I: rep1, U: rep2,
    Idc: dI, Udc: dU, Iac: aAbs, Uac: aU, IacRe: aIr, UacRe: aUr,
    Irms: Math.hypot(dI, aAbs * SQ2),
    Urms: Math.hypot(dU, aU * SQ2),
    Imax: Math.abs(dI) + aAbs,
    P: (dI * dI + aAbs * aAbs / 2) * loss,
  };
};

/* 整张电路解一趟：直流 + 交流（有交流源时），非线性件迭代到状态不再变
   ctx = { cells, cols, endsOf }：格子宽度只用来给节点编号 */
export function solveAll({ cells, cols, endsOf }) {
  const keys = Object.keys(cells);

  // 节点编号：所有元件两端的节点，占两条边的元件（变压器 / 放大器 / 三极管）第二条也算进来
  const ids = new Map();
  const order = [];
  const gi = (i, j) => {
    const id = j * cols + i;
    if (!ids.has(id)) { ids.set(id, order.length); order.push(id); }
    return ids.get(id);
  };
  const ends = {};
  for (const k of keys) {
    const [A, B] = endsOf(k);
    ends[k] = [gi(A[0], A[1]), gi(B[0], B[1])];
    const el = cells[k];
    if (el.p && el.p.k2) {
      const [C, D] = endsOf(el.p.k2);
      ends[el.p.k2] = [gi(C[0], C[1]), gi(D[0], D[1])];
    }
  }
  const idx = { ends, n: order.length };

  // 频率取电路里第一台交流电源（或发电机）的；没有就不做第二趟
  let freq = 0;
  for (const k of keys) {
    if (cells[k].kind === 'ac' || cells[k].kind === 'gen') { freq = acOf(cells[k]).f; break; }
  }
  const w = freq > 0 ? 2 * Math.PI * freq : 0;

  const state = { bulb: {}, dOn: {}, dAc: {}, qOn: {} };
  for (const k of keys) {
    if (cells[k].kind === 'bulb') state.bulb[k] = bulbRAt(cells[k].p, 0);
    if (cells[k].kind === 'diode') { state.dOn[k] = false; state.dAc[k] = false; }
    if (cells[k].kind === 'qnp') state.qOn[k] = false;
  }

  let dc = {};
  let ac = {};
  for (let it = 0; it < 24; it++) {
    dc = solvePass(cells, endsOf, 0, state, idx);
    ac = w > 0 ? solvePass(cells, endsOf, w, state, idx) : {};
    let ch = false;
    for (const k of keys) {
      const el = cells[k];
      const d0 = dc[k];
      if (el.kind === 'bulb' && d0) {
        const eff = Math.hypot(d0.U.r, ac[k] ? cabs(ac[k].U) * SQ2 : 0);
        const R0 = state.bulb[k] || 1;
        // 凸特性（α > 1）下电阻随电压掉得很陡，一步直接换成新值会在两端来回跳，
        // 每步最多挪 6 倍，迭代次数够走完全程，曲线再陡也收敛得住
        const Rn = Math.min(R0 * 6, Math.max(R0 / 6, bulbRAt(el.p, eff)));
        if (Math.abs(Rn - R0) / Math.max(1e-6, R0) > 2e-3) ch = true;
        state.bulb[k] = Rn;
      }
      if (el.kind === 'diode') {
        const Vf = num(el.p.Vf, 0.7);
        const on = d0 ? d0.U.r > Vf - 1e-6 : false;
        const acOn = on || (ac[k] ? cabs(ac[k].U) > Vf : false);
        if (on !== state.dOn[k]) { state.dOn[k] = on; ch = true; }
        if (acOn !== state.dAc[k]) { state.dAc[k] = acOn; ch = true; }
      }
      if (el.kind === 'qnp') {
        // 发射结看 Ube（基极那条边的电压），0.65 V 起导
        const bR = dc[k + '\u0000b'];
        const on = bR ? bR.U.r > 0.65 - 1e-6 : false;
        if (on !== state.qOn[k]) { state.qOn[k] = on; ch = true; }
      }
    }
    if (!ch) break;
  }

  const out = {};
  for (const k of keys) {
    out[k] = packOf(dc[k], ac[k]);
    const el = cells[k];
    if (el.kind === 'xfmr') out[k + '\u0000s'] = packOf(dc[k + '\u0000s'], ac[k + '\u0000s']);
    if (el.kind === 'amp' && el.p.k2) out[k + '\u0000o'] = packOf(dc[k + '\u0000o'], ac[k + '\u0000o']);
    if (el.kind === 'qnp' && el.p.k2) {
      out[k + '\u0000b'] = packOf(dc[k + '\u0000b'], ac[k + '\u0000b']);
      out[k].q = packOf(dc[k + '\u0000q'], ac[k + '\u0000q']);
      out[k].qB = packOf(dc[k + '\u0000i'], ac[k + '\u0000i']);
      out[k].qOn = !!state.qOn[k];
    }
    if (el.kind === 'bulb') out[k].R = state.bulb[k];
  }
  out.__w = w;
  out.__f = freq;
  out.__dn = state.dOn;
  return out;
}
