/* 图 A3 · 割椭圆术：圆内接正 n 边形面积 S_n = ½·n·a²·sin(2π/n)，
   压缩 T_k 后像的面积严格乘 k —— 令 n→∞，πa² → πab（刘徽割圆术的仿射续集） */
import { mk, V, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 440;
  const B = createConicLab(root, W, H);
  const R = 140, O1 = V(215, 225), O2 = V(645, 225);
  const st = { n: 6, k: 0.7 };

  const bOf = () => R * st.k;
  const cSn = B.chip('圆内接 n 边形'), cSk = B.chip('像（椭圆内接）'), cLim = B.chip('n → ∞ 极限');
  B.slider('边数 n', 3, 96, 1, st.n, v => { st.n = Math.round(v); B.render(); });
  B.slider('压缩比 k', 0.3, 1.4, 0.01, st.k, v => { st.k = v; B.render(); });

  B.renderFn = () => {
    const k = st.k, b = bOf(), n = st.n;
    for (const O of [O1, O2]) {
      B.seg(V(O.x - 165, O.y), V(O.x + 165, O.y), { stroke: plotInk.axis, 'stroke-width': 1.2 });
      B.seg(V(O.x, O.y - 165), V(O.x, O.y + 165), { stroke: plotInk.axis, 'stroke-width': 1.2 });
    }
    B.text(V(O1.x, 40), `圆 · 内接 ${n} 边形`, { fill: plotInk.blue, 'font-size': 13, 'font-weight': 700 });
    B.text(V(O2.x, 40), `像 · 椭圆内接 ${n} 边形`, { fill: plotInk.teal, 'font-size': 13, 'font-weight': 700 });
    // 曲线（虚）
    const cpts = [], epts = [];
    for (let t = -Math.PI; t <= Math.PI + 1e-9; t += 0.03) {
      cpts.push(`${(O1.x + R * Math.cos(t)).toFixed(1)},${(O1.y + R * Math.sin(t)).toFixed(1)}`);
      epts.push(`${(O2.x + R * Math.cos(t)).toFixed(1)},${(O2.y + b * Math.sin(t)).toFixed(1)}`);
    }
    mk('polyline', { points: cpts.join(' '), fill: 'none', stroke: plotInk.blue, 'stroke-width': 1.6, 'stroke-dasharray': '6 5', opacity: 0.6 }, B.dyn);
    mk('polyline', { points: epts.join(' '), fill: 'none', stroke: plotInk.teal, 'stroke-width': 1.6, 'stroke-dasharray': '6 5', opacity: 0.6 }, B.dyn);
    // 内接多边形
    const poly = (O, ry, fill, stroke) => {
      const pts = [];
      for (let i = 0; i < n; i++) {
        const t = -Math.PI / 2 + i * 2 * Math.PI / n;
        pts.push(`${(O.x + R * Math.cos(t)).toFixed(1)},${(O.y + ry * Math.sin(t)).toFixed(1)}`);
      }
      mk('polygon', { points: pts.join(' '), fill, stroke, 'stroke-width': 2 }, B.dyn);
    };
    poly(O1, R, plotInk.soft, plotInk.blue);
    poly(O2, b, plotInk.tealWash, plotInk.teal);
    // 读数
    const Sn = 0.5 * n * R * R * Math.sin(2 * Math.PI / n);
    const S1 = Math.PI * R * R;
    cSn(`S_n = ½·n·a²·sin(2π/n) = ${fmt(Sn, 1)}`);
    cSk(`像面积 = k·S_n = ${fmt(k * Sn, 1)}（每个水平条都被压成 k 倍厚）`, 'ok');
    cLim(`πa² = ${fmt(S1, 1)} → πab = ${fmt(Math.PI * R * b, 1)}`, Math.abs(k * S1 - Math.PI * R * b) < 0.5 ? 'ok' : 'warn');
    B.hint('拖大 n：两个数各自逼近自己的极限，而"像 ÷ 原"始终等于 k —— 面积比在压缩下不变量，这就是 πab 的由来');
  };

  B.render();
  return B;
}
