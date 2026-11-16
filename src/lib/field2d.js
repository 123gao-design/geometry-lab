/* 二维标量场的两种画法（多元函数几块板共用）：
   ① heat —— 把画框切成小格，按 f 的正负取暖橙 / 冷蓝，颜色深浅随 |f|（远看是一张等高线地形图的底色）；
   ② isocurves —— 等值线：marching squares 在网格边上找交点，逐格连成短线段（域外 NaN 自动跳过）。
   两函数都直接画在 B.dyn 层，先 heat 后 isocurves 即得「底色 + 细线」的观感。 */
import { mk, V } from './board.js';

export function heat(B, f, m, o = {}) {
  const nx = o.nx || 30, ny = o.ny || 22, sc = o.scale || 1;
  const dx = (m.X1 - m.X0) / nx, dy = (m.Y1 - m.Y0) / ny;
  for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
    const x = m.X0 + dx * (i + .5), y = m.Y0 + dy * (j + .5);
    const v = f(x, y);
    if (!isFinite(v)) continue;
    const op = .05 + .30 * Math.min(1, Math.abs(v) / sc);
    const xa = m.px(m.X0 + dx * i), xb = m.px(m.X0 + dx * (i + 1));
    const ya = m.py(m.Y0 + dy * j), yb = m.py(m.Y0 + dy * (j + 1));
    mk('polygon', {
      points: `${xa.toFixed(1)},${ya.toFixed(1)} ${xb.toFixed(1)},${ya.toFixed(1)} ${xb.toFixed(1)},${yb.toFixed(1)} ${xa.toFixed(1)},${yb.toFixed(1)}`,
      fill: v >= 0 ? '#ff9e4a' : '#5cadff', 'fill-opacity': op.toFixed(3), stroke: 'none',
    }, B.dyn);
  }
}

export function contourSegs(f, m, level, n = 44) {
  const out = [], g = (i, j) => f(m.X0 + (m.X1 - m.X0) * i / n, m.Y0 + (m.Y1 - m.Y0) * j / n) - level;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
    const ax = m.X0 + (m.X1 - m.X0) * i / n, bx = m.X0 + (m.X1 - m.X0) * (i + 1) / n;
    const ay = m.Y0 + (m.Y1 - m.Y0) * j / n, by = m.Y0 + (m.Y1 - m.Y0) * (j + 1) / n;
    const va = g(i, j), vb = g(i + 1, j), vc = g(i + 1, j + 1), vd = g(i, j + 1);
    if (![va, vb, vc, vd].every(isFinite)) continue;
    const ps = [];
    const cut = (u, v, p, q) => { if ((u <= 0) !== (v <= 0) && Math.abs(u - v) > 1e-12) { const t = u / (u - v); ps.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]); } };
    cut(va, vb, [ax, ay], [bx, ay]);
    cut(vb, vc, [bx, ay], [bx, by]);
    cut(vc, vd, [bx, by], [ax, by]);
    cut(vd, va, [ax, by], [ax, ay]);
    if (ps.length === 2) out.push(ps);
    else if (ps.length === 4) { out.push([ps[0], ps[1]]); out.push([ps[2], ps[3]]); }
  }
  return out;
}

export function isocurves(B, f, m, levels, o = {}) {
  for (const lv of levels) for (const [[ax, ay], [bx, by]] of contourSegs(f, m, lv, o.n || 44))
    B.seg(V(m.px(ax), m.py(ay)), V(m.px(bx), m.py(by)), {
      stroke: o.stroke || '#93a1b5', 'stroke-width': o.w || 1.15, 'stroke-opacity': o.op ?? .55, ...(o.at || {}),
    });
}
