/* 图 空3 · 秩与线性方程组解的结构
   三个平面是三条方程。把它们画在同一块空间里，公共部分只有三种可能：
   交于一点（秩 3，唯一解）、交于一条直线（秩 2，无穷多解）、没有公共点（秩不等，无解）。
   拖 d₃ 移动第三个平面，看公共部分在点、线、空三态之间切换。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, add3, mul3, dot3, unit3, len3, cross3, lerp3 } from '../../../lib/solid3d.js';

const R = 2.5;

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 320, cy: 250, s: 84, cz: .2, yaw: .86, pitch: .40 });
  const st = { pre: 0, d3: 1 };
  const PRE = [
    { nm: '① 交于一点', n3: [1, 2, -1], d3: 1 },
    { nm: '② 交于直线', n3: [2, 2, 2], d3: 3 },
    { nm: '③ 无公共点', n3: [2, 2, 2], d3: 4 },
  ];

  const cR = B.chipM('秩 (A)'), cQ = B.chipM('秩 (A|b)'), cS = B.chipM('解的个数'), cJ = B.chipM('判读');

  // 立方体棱（用于裁出平面多边形）
  const CV = [];
  for (let i = 0; i < 8; i++) CV.push(v3(i & 1 ? R : -R, (i >> 1) & 1 ? R : -R, (i >> 2) & 1 ? R : -R));
  const CE = [];
  for (let i = 0; i < 8; i++) for (const b of [1, 2, 4]) if (!(i & b)) CE.push([CV[i], CV[i | b]]);

  const planePoly = (n0, d0) => {
    // 先把法向量单位化：后面 Gram-Schmidt 与叉积都假定 |n| = 1
    const nn = len3(n0) || 1;
    const n = mul3(n0, 1 / nn), d = d0 / nn;
    const pts = [];
    CE.forEach(([p, q]) => {
      const fp = dot3(n, p) - d, fq = dot3(n, q) - d;
      if (Math.abs(fp) < 1e-9) pts.push(p);
      if (fp * fq < 0) pts.push(lerp3(p, q, fp / (fp - fq)));
    });
    if (pts.length < 3) return [];
    const c = mul3(pts.reduce((a, p) => add3(a, p), v3(0, 0, 0)), 1 / pts.length);
    let e1 = unit3(v3(1, 0, 0));
    if (Math.abs(dot3(e1, n)) > .9) e1 = unit3(v3(0, 1, 0));
    e1 = unit3(add3(e1, mul3(n, -dot3(e1, n))));
    const e2 = cross3(n, e1);
    return pts.map(p => ({ p, a: Math.atan2(dot3(add3(p, mul3(c, -1)), e2), dot3(add3(p, mul3(c, -1)), e1)) }))
      .sort((u, v) => u.a - v.a).map(o => o.p);
  };

  const rref = rows => {
    const M = rows.map(r => r.slice());
    let r = 0; const piv = [];
    for (let c = 0; c < 3 && r < 3; c++) {
      let p = -1, best = 1e-9;
      for (let i = r; i < 3; i++) if (Math.abs(M[i][c]) > best) { best = Math.abs(M[i][c]); p = i; }
      if (p < 0) continue;
      [M[r], M[p]] = [M[p], M[r]];
      const pv = M[r][c];
      for (let j = 0; j < 4; j++) M[r][j] /= pv;
      for (let i = 0; i < 3; i++) if (i !== r) {
        const k = M[i][c];
        if (Math.abs(k) < 1e-12) continue;
        for (let j = 0; j < 4; j++) M[i][j] -= k * M[r][j];
      }
      piv.push(c); r++;
    }
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) if (Math.abs(M[i][j]) < 1e-10) M[i][j] = 0;
    let bad = -1;
    for (let i = 0; i < 3; i++) {
      if (Math.abs(M[i][0]) < 1e-9 && Math.abs(M[i][1]) < 1e-9 && Math.abs(M[i][2]) < 1e-9 && Math.abs(M[i][3]) > 1e-9) bad = i;
    }
    return { M, piv, bad };
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const pr = PRE[st.pre];
    const rows = [
      [1, 1, 1, 1.5],
      [1, -1, 0, .4],
      [pr.n3[0], pr.n3[1], pr.n3[2], st.d3],
    ];
    const { M, piv, bad } = rref(rows);
    const rankA = piv.length, rankB = bad >= 0 ? piv.length + 1 : piv.length;

    // 三个平面
    const COL = ['#5cadff', '#ff9e4a', '#4ade80'];
    rows.forEach((r, i) => {
      const n = v3(r[0], r[1], r[2]);
      const poly = planePoly(n, r[3]);
      if (poly.length >= 3) cs.poly(poly, { fill: COL[i], op: .085, stroke: COL[i], w: 1.3, lineOp: .55 });
    });

    // 解集：一点、一条直线，或空
    let info = '';
    if (bad < 0) {
      const free = [0, 1, 2].filter(c => !piv.includes(c));
      const x0 = [0, 0, 0];
      piv.forEach((c, i) => { x0[c] = M[i][3]; });
      if (!free.length) {
        const p = v3(x0[0], x0[1], x0[2]);
        cs.dot(p, 7, { fill: '#ffd166', stroke: '#0a0d14', w: 1.6 });
        info = `交于一点 (${fmt(x0[0], 2)}, ${fmt(x0[1], 2)}, ${fmt(x0[2], 2)})`;
        cs.label(p, 'P', { dx: 14, dy: -8, size: 13, fill: '#ffd166' });
      } else {
        const f = free[0], dv = [0, 0, 0];
        dv[f] = 1;
        piv.forEach((c, i) => { dv[c] = -M[i][f]; });
        const d = v3(dv[0], dv[1], dv[2]);
        // 直线与立方体的交点参数区间
        let s0 = -1e9, s1 = 1e9;
        [[x0[0], d.x], [x0[1], d.y], [x0[2], d.z]].forEach(([p0, dd]) => {
          if (Math.abs(dd) < 1e-9) return;
          const a = (-R - p0) / dd, b = (R - p0) / dd;
          s0 = Math.max(s0, Math.min(a, b)); s1 = Math.min(s1, Math.max(a, b));
        });
        if (s0 < s1) {
          const A1 = v3(x0[0] + s0 * d.x, x0[1] + s0 * d.y, x0[2] + s0 * d.z);
          const A2 = v3(x0[0] + s1 * d.x, x0[1] + s1 * d.y, x0[2] + s1 * d.z);
          cs.line(A1, A2, { stroke: '#ffd166', w: 3.2, op: .95 });
          cs.label(add3(A1, mul3(add3(A2, mul3(A1, -1)), .5)), 'L', { dx: 12, dy: -8, size: 13, fill: '#ffd166' });
        }
        info = `交于一条直线，方向 (${fmt(dv[0], 2)}, ${fmt(dv[1], 2)}, ${fmt(dv[2], 2)})`;
      }
    } else {
      info = '三块平面没有公共点';
    }

    const X = 590;
    B.textM({ x: X, y: 78 }, '$\\begin{cases}x+y+z=1.5\\\\x-y=0.4\\\\' + `${fmt(pr.n3[0], 0)}x+${fmt(pr.n3[1], 0)}y+${fmt(pr.n3[2], 0)}z=${fmt(st.d3, 1)}` + '\\end{cases}$', { 'font-size': 12.5, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM({ x: X, y: 162 }, `$r(A)=${rankA},\\quad r(A|b)=${rankB}$`, { 'font-size': 14, fill: '#c084fc', 'text-anchor': 'start' });
    B.textM({ x: X, y: 198 }, rankB > rankA ? '$r(A)<r(A|b)$：无解' : rankA === 3 ? '$r(A)=r(A|b)=3$：唯一解' : `$r(A)=r(A|b)=${rankA}<3$：无穷多解`, { 'font-size': 12.5, fill: rankB > rankA ? '#ff7b8a' : rankA === 3 ? '#4ade80' : '#ffd166', 'text-anchor': 'start' });
    B.textM({ x: X, y: 236 }, info, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM({ x: X, y: 274 }, '秩 = 线性无关的方程个数', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM({ x: X, y: 296 }, '= 有效约束的条数', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM({ x: X, y: 332 }, rankB > rankA ? '第三个平面与前两个平行且错开：永远碰不到那条交线' : rankA === 2 ? '两个平面相交于一条直线，第三个平面恰好包含它' : '三个平面两两相交，公共部分收缩成一点', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });

    cR(`$${rankA}$`);
    cQ(`$${rankB}$`);
    cS(rankB > rankA ? '无解' : rankA === 3 ? '唯一解' : '无穷多解', rankB > rankA ? 'warn' : rankA === 3 ? 'ok' : '');
    cJ(rankB > rankA ? '矛盾来自秩不等：某个方程要求 0 等于非零数'
      : rankA === 3 ? '秩等于未知量个数：三个平面在唯一点相遇'
        : '秩比未知量少 1：公共部分是一条直线，自由度 1');
    cs.flush();
  };

  const pre = PRE.map((p, i) => B.btn(p.nm, () => {
    st.pre = i; st.d3 = p.d3;
    pre.forEach((b, j) => b.classList.toggle('on', j === i));
    dsl.sync(p.d3);
    B.render();
  }));
  pre[0].classList.add('on');

  const dsl = B.slider('第三个平面常数', -1, 4, .1, st.d3, v => { st.d3 = v; B.render(); }, 'd3');

  B.btn('重置视角', () => { cam.yaw = .86; cam.pitch = .40; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('拖动旋转：三块平面的公共部分只可能是点、直线或空');
  B.render();
  return B;
}
