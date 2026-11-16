import { Board, V, mk } from '../../../lib/board.js';

/* 海岸线测量：同一条科赫海岸，用不同尺长 ε 去量，得到的长度不一样。
   左图画海岸与当前尺长的折线量法，右图画 ln L 对 ln(1/ε) 的散点与拟合直线，
   直线斜率加 1 就是海岸线的维数 —— 尺子越短，量出的海岸线越长。 */
function coast(n) {
  let pts = [V(0, 0), V(1, 0)];
  const c = Math.cos(Math.PI / 3), s = Math.sin(Math.PI / 3);
  for (let l = 0; l < n; l++) {
    const out = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const dx = (b.x - a.x) / 3, dy = (b.y - a.y) / 3;
      const p1 = V(a.x + dx, a.y + dy), p3 = V(a.x + 2 * dx, a.y + 2 * dy);
      out.push(p1, V(p1.x + dx * c - dy * s, p1.y + dx * s + dy * c), p3, b);
    }
    pts = out;
  }
  return pts;
}

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { k: 3 };
  const cE = B.chipM('尺长 $\\varepsilon$');
  const cL = B.chipM('测得长度 $L$');
  const cD = B.chipM('斜率读数');
  const pts = coast(6);
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  const T = cum[cum.length - 1];
  function at(s) {
    let lo = 0, hi = cum.length - 1;
    while (lo < hi - 1) { const mid = (lo + hi) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid; }
    const u = (s - cum[lo]) / ((cum[hi] - cum[lo]) || 1);
    return V(pts[lo].x + (pts[hi].x - pts[lo].x) * u, pts[lo].y + (pts[hi].y - pts[lo].y) * u);
  }
  function measure(e) {
    let s = 0, prev = at(0), L = 0, cnt = 0;
    const path = [prev];
    while (s < T - 1e-9) {
      s = Math.min(T, s + e);
      const p = at(s);
      L += Math.hypot(p.x - prev.x, p.y - prev.y);
      path.push(p); prev = p; cnt++;
    }
    return { L, cnt, path };
  }

  B.renderFn = () => {
    const k = st.k, e = Math.pow(2, -k);
    const cur = measure(e);
    // 左：海岸线与量尺折线
    const x0 = 40, y0 = 64, GW = 470, GH = 300;
    const S = Math.min((GW - 40) / 1, (GH - 30) / .58);
    const px = x => x0 + (GW - S) / 2 + x * S, py = y => y0 + GH - 20 - y * S;
    let d = '';
    pts.forEach((p, i) => { d += (i ? 'L' : 'M') + px(p.x).toFixed(1) + ' ' + py(p.y).toFixed(1) + ' '; });
    mk('path', { d, fill: 'none', stroke: '#5cadff', 'stroke-width': 1.3 }, B.dyn);
    for (let i = 0; i < cur.path.length - 1; i++) {
      const a = cur.path[i], b = cur.path[i + 1];
      B.seg(V(px(a.x), py(a.y)), V(px(b.x), py(b.y)), { stroke: 'rgba(255,158,74,.55)', 'stroke-width': 2.4 });
    }
    for (const p of cur.path) B.dot(V(px(p.x), py(p.y)), 1.9, { fill: '#ffd166' });
    B.text(V(x0 + GW / 2, y0 + GH + 8), `尺长 ε=${e.toFixed(4)}，量了 ${cur.cnt} 段，得 L=${cur.L.toFixed(3)}`, { 'font-size': 12, fill: '#8fa3bd' });

    // 右：ln L 对 ln(1/ε) 与拟合直线
    const X0 = 550, Y0 = 80, PW = 230, PH = 250;
    const data = [];
    for (let j = 0; j <= 6; j++) { const ee = Math.pow(2, -j); const m = measure(ee); data.push({ x: Math.log(1 / ee), y: Math.log(m.L), j }); }
    const xm = 0, xM = Math.log(128), yv = data.map(q => q.y), ym = Math.min(...yv) - .1, yM = Math.max(...yv) + .1;
    const gx = x => X0 + (x - xm) / (xM - xm) * PW, gy = y => Y0 + PH - (y - ym) / (yM - ym) * PH;
    B.seg(V(X0, Y0 + PH), V(X0 + PW, Y0 + PH), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    B.seg(V(X0, Y0), V(X0, Y0 + PH), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    B.text(V(X0 + PW, Y0 + PH + 18), 'ln(1/ε)', { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'end' });
    B.text(V(X0 - 10, Y0 + 6), 'ln L', { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'middle' });
    // 最小二乘（用前 6 个点，最后一点已进入平台）
    let sx = 0, sy = 0, sxx = 0, sxy = 0, N = 6;
    for (let i = 0; i < N; i++) { const q = data[i]; sx += q.x; sy += q.y; sxx += q.x * q.x; sxy += q.x * q.y; }
    const slope = (N * sxy - sx * sy) / (N * sxx - sx * sx);
    const itc = (sy - slope * sx) / N;
    B.seg(V(gx(xm), gy(itc)), V(gx(xM), gy(itc + slope * xM)), { stroke: '#c084fc', 'stroke-width': 1.5, 'stroke-dasharray': '7 5' });
    data.forEach(q => {
      const on = q.j === k;
      B.dot(V(gx(q.x), gy(q.y)), on ? 5 : 3.2, { fill: on ? '#ff7b8a' : '#67e8f9', stroke: '#0a0d14', 'stroke-width': 1 });
    });
    B.text(V(X0 + PW / 2, Y0 - 14), '双对数图', { 'font-size': 12, fill: '#5c6a80' });
    B.text(V(X0 + PW / 2, Y0 + PH + 34), `拟合斜率 ${slope.toFixed(3)}，维数约 ${(1 + slope).toFixed(3)}`, { 'font-size': 11, fill: '#8fa3bd' });
    cE(`$${e.toFixed(4)}$`);
    cL(`$${cur.L.toFixed(3)}$`);
    cD(`$${(1 + slope).toFixed(3)}$`);
  };

  B.slider('尺长指数 k（ε=2^-k）', 0, 6, 1, st.k, v => { st.k = v; B.render(); });
  B.hintM('尺子越短，绕过的弯越多，量出的海岸线越长 —— $L(\\varepsilon)\\propto\\varepsilon^{1-D}$');
  B.render();
  return B;
}
