import { Board, V, mk } from '../../../lib/board.js';

/* 盒维数机：用边长 ε 的方格网盖住分形，数出与集合相交的格子数 N(ε)，
   再由 ln N / ln(1/ε) 读出盒维数。三种集合各有天然取法：康托与科赫用 3^-k，谢尔宾斯基用 2^-k。 */
function cantorIntervals(n) {
  let a = [[0, 1]];
  for (let l = 0; l < n; l++) {
    const b = [];
    for (const [x, y] of a) { const d = (y - x) / 3; b.push([x, x + d], [y - d, y]); }
    a = b;
  }
  return a;
}
function kochLine(n) {
  let pts = [V(0, 0), V(1, 0)];
  const c = Math.cos(Math.PI / 3), s = Math.sin(Math.PI / 3);
  for (let l = 0; l < n; l++) {
    const out = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const a = pts[i], b = pts[i + 1];
      const dx = (b.x - a.x) / 3, dy = (b.y - a.y) / 3;
      const p1 = V(a.x + dx, a.y + dy), p3 = V(a.x + 2 * dx, a.y + 2 * dy);
      const p2 = V(p1.x + dx * c - dy * s, p1.y + dx * s + dy * c);
      out.push(p1, p2, p3, b);
    }
    pts = out;
  }
  return pts;
}
function sierTriangles(n) {
  let t = [[V(0, 0), V(1, 0), V(.5, Math.sqrt(3) / 2)]];
  for (let l = 0; l < n; l++) {
    const o = [];
    for (const [a, b, c] of t) {
      const ab = V((a.x + b.x) / 2, (a.y + b.y) / 2);
      const bc = V((b.x + c.x) / 2, (b.y + c.y) / 2);
      const ca = V((c.x + a.x) / 2, (c.y + a.y) / 2);
      o.push([a, ab, ca], [ab, b, bc], [ca, bc, c]);
    }
    t = o;
  }
  return t;
}

export function createBoard(root) {
  const W = 820, H = 450;
  const B = new Board(root, W, H);
  const st = { shape: 0, k: 2 };
  const cE = B.chipM('格边长 $\\varepsilon$');
  const cN = B.chipM('格数 $N(\\varepsilon)$');
  const cD = B.chipM('盒维数');
  const NAME = ['三分康托集', '科赫曲线', '谢尔宾斯基三角形'];
  const BASE = [3, 3, 2];

  function clouds() {
    const P = [];
    if (st.shape === 0) {
      for (const [a, b] of cantorIntervals(6)) {
        for (let t = 0; t <= 10; t++) { const x = a + (b - a) * t / 10; P.push(V(x, .5), V(x, .48), V(x, .52)); }
      }
    } else if (st.shape === 1) {
      const pts = kochLine(5);
      for (let i = 0; i < pts.length - 1; i++) {
        for (let t = 0; t < 8; t++) {
          const u = t / 8;
          P.push(V(pts[i].x + (pts[i + 1].x - pts[i].x) * u, pts[i].y + (pts[i + 1].y - pts[i].y) * u));
        }
      }
    } else {
      for (const [a, b, c] of sierTriangles(4)) {
        P.push(a, b, c, V((a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3));
        P.push(V((a.x + b.x) / 2, (a.y + b.y) / 2), V((b.x + c.x) / 2, (b.y + c.y) / 2), V((c.x + a.x) / 2, (c.y + a.y) / 2));
      }
    }
    return P;
  }

  B.renderFn = () => {
    const k = st.k, base = BASE[st.shape], eps = Math.pow(base, -k);
    const S = 340, x0 = 240, y0 = 58;
    const px = x => x0 + x * S, py = y => y0 + (1 - y) * S;
    const P = clouds();
    const n = Math.round(1 / eps);
    const hit = new Set();
    for (const p of P) {
      const i = Math.min(n - 1, Math.floor(p.x / eps)), j = Math.min(n - 1, Math.floor((1 - p.y) / eps));
      hit.add(i + ',' + j);
    }
    const N = hit.size, D = Math.log(N) / Math.log(1 / eps);

    B.tex(V(410, 28), `${NAME[st.shape]}：$\\varepsilon=1/${Math.round(1 / eps)}$ 的方格网`, { size: 16, anchor: 'mid', w: 560 });
    // 相交格：先铺淡色块，再压网格线与集合本身
    for (const key of hit) {
      const [i, j] = key.split(',').map(Number);
      mk('rect', { x: px(i * eps), y: py((j + 1) * eps), width: eps * S, height: eps * S,
        fill: 'rgba(92,173,255,.22)', stroke: 'none' }, B.dyn);
    }
    for (let i = 0; i <= n; i++) {
      B.seg(V(px(i * eps), y0), V(px(i * eps), y0 + S), { stroke: '#2b3b53', 'stroke-width': .6, 'stroke-opacity': .75 });
      B.seg(V(x0, py(i * eps)), V(x0 + S, py(i * eps)), { stroke: '#2b3b53', 'stroke-width': .6, 'stroke-opacity': .75 });
    }
    mk('rect', { x: x0, y: y0, width: S, height: S, fill: 'none', stroke: '#ffd166', 'stroke-width': 1.5 }, B.dyn);
    if (st.shape === 0) {
      for (const [a, b] of cantorIntervals(6)) B.seg(V(px(a), py(.5)), V(px(b), py(.5)), { stroke: '#ff9e4a', 'stroke-width': 4 });
    } else if (st.shape === 1) {
      const pts = kochLine(5);
      for (let i = 0; i < pts.length - 1; i++) B.seg(V(px(pts[i].x), py(pts[i].y)), V(px(pts[i + 1].x), py(pts[i + 1].y)), { stroke: '#ff9e4a', 'stroke-width': 1.8 });
    } else {
      for (const [a, b, c] of sierTriangles(3)) {
        mk('polygon', { points: `${px(a.x)},${py(a.y)} ${px(b.x)},${py(b.y)} ${px(c.x)},${py(c.y)}`,
          fill: 'rgba(255,158,74,.16)', stroke: '#ff9e4a', 'stroke-width': 1.4 }, B.dyn);
      }
    }
    B.text(V(410, 424), `相交格数 ${N}，取对数之比得盒维数 ${D.toFixed(3)}`, { 'font-size': 12, fill: '#8fa3bd' });
    cE(`$1/${Math.round(1 / eps)}$`);
    cN(`${N}`);
    cD(`$${D.toFixed(3)}$`);
  };

  B.btn('三分康托集', () => { st.shape = 0; st.k = 2; kS.sync(2); B.render(); });
  B.btn('科赫曲线', () => { st.shape = 1; st.k = 2; kS.sync(2); B.render(); });
  B.btn('谢尔宾斯基三角', () => { st.shape = 2; st.k = 2; kS.sync(2); B.render(); });
  const kS = B.slider('细分层数 k', 1, 4, 1, st.k, v => { st.k = v; B.render(); });
  B.hintM('盒维数 $=\\lim_{\\varepsilon\\to0}\\dfrac{\\ln N(\\varepsilon)}{\\ln(1/\\varepsilon)}$：数格子也能定维数');
  B.render();
  return B;
}
