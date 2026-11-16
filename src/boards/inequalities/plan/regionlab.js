/* 图 线1 · 半平面与可行域机：Ax+By+C 的符号把平面分成两半
   模式一「单个半平面」：一条直线把平面分成两侧，代入点 P 读 f=Ax+By+C 的符号。
     同侧的点符号一致（f 是线性函数，沿任一垂直于直线的方向单调），因此代一个点即可
     判定整个半平面；拖动 P 跨过直线时符号翻转、区域归属随之改变。
   模式二「不等式组」：每条约束各取一个半平面，交集是凸多边形可行域。逐条开关约束，
     看区域如何被切小、顶点数与面积如何变化；探针 P 走进区域读满足条数。
   局部坐标约定：isoFit 视野 x∈[-0.8,4.8]、y∈[-0.8,4.4]（rect=[0,50,860,380]，pad 20），
   等单位（45° 即斜率 1）。约束统一写成 A x + B y + C ≥ 0 的形式。 */
import { Board, mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, A: 1, B: 2, C: -6, side: 1, qx: 3, qy: 3, k: 7,
    t1: true, t2: true, t3: true, t4: true, grid: true, labs: true };
  const m = B.isoFit(-0.8, 4.8, -0.8, 4.4, [60, 50, 409.23, 380], 0);
  const RECT = [V(m.X0, m.Y0), V(m.X1, m.Y0), V(m.X1, m.Y1), V(m.X0, m.Y1)];
  const cF = B.chipM('读数'), cG = B.chipM('符号'), cR = B.chipM('区域'), cJ = B.chipM('判读');

  // 半平面裁剪（Sutherland–Hodgman，单条直线）：保留 side·(Ax+By+C) ≥ 0 的一侧
  const clip = (poly, A, Bc, C, side) => {
    const out = [], f = p => side * (A * p.x + Bc * p.y + C);
    for (let i = 0; i < poly.length; i++) {
      const P = poly[i], Q = poly[(i + 1) % poly.length], fp = f(P), fq = f(Q);
      if (fp >= -1e-9) out.push(P);
      if ((fp > 1e-9 && fq < -1e-9) || (fp < -1e-9 && fq > 1e-9)) {
        const t = fp / (fp - fq);
        out.push(V(P.x + (Q.x - P.x) * t, P.y + (Q.y - P.y) * t));
      }
    }
    return out;
  };
  const fillPoly = (pts, col, op) => {
    if (pts.length < 3) return;
    mk('polygon', { points: pts.map(p => `${m.px(p.x).toFixed(1)},${m.py(p.y).toFixed(1)}`).join(' '), fill: col, 'fill-opacity': op, stroke: 'none' }, B.dyn);
  };
  // 直线 A x + B y + C = 0 与视野的两交点（像素坐标）
  const lineEnds = (A, Bc, C) => {
    if (Math.abs(Bc) > 1e-9) {
      return [V(m.px(m.X0), m.py((-C - A * m.X0) / Bc)), V(m.px(m.X1), m.py((-C - A * m.X1) / Bc))];
    }
    if (Math.abs(A) < 1e-9) return null;
    return [V(m.px(-C / A), m.py(m.Y0)), V(m.px(-C / A), m.py(m.Y1))];
  };
  const uniq = pts => pts.filter((p, i) => pts.findIndex(q => Math.hypot(p.x - q.x, p.y - q.y) < 1e-7) === i);
  const sortPts = pts => {
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
    return [...pts].sort((p, q) => Math.atan2(p.y - cy, p.x - cx) - Math.atan2(q.y - cy, q.x - cx));
  };
  const shoelace = pts => {
    let s = 0;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i], q = pts[(i + 1) % pts.length];
      s += p.x * q.y - q.x * p.y;
    }
    return Math.abs(s) / 2;
  };
  // 约束统一写成 A x + B y + C ≥ 0
  const CONS = [
    { key: 't1', A: 1, B: 0, C: () => 0, lab: '$x\\ge0$', col: '#8fa3bd' },
    { key: 't2', A: 0, B: 1, C: () => 0, lab: '$y\\ge0$', col: '#8fa3bd' },
    { key: 't3', A: -1, B: -1, C: () => 4, lab: '$x+y\\le4$', col: '#ff9e4a' },
    { key: 't4', A: -1, B: -2, C: () => st.k, lab: '$x+2y\\le k$', col: '#c084fc' },
  ];
  const Cof = c => c.C();
  // 直线方程的显示式（系数为 1、-1、0 时省略）
  const coef = v => Math.abs(v) < 1e-9 ? null : (Math.abs(v) === 1 ? '' : f1(Math.abs(v)));
  const expr = (A, Bc, C) => {
    const parts = [];
    const push = (v, name) => {
      const c = coef(v);
      if (c === null) return;
      parts.push(`${v < 0 ? '-' : parts.length ? '+' : ''}${c}${name}`);
    };
    push(A, 'x'); push(Bc, 'y');
    if (Math.abs(C) > 1e-9) parts.push(`${C < 0 ? '-' : '+'}${f1(Math.abs(C))}`);
    return parts.length ? parts.join(' ') : '0';
  };

  const hnd = B.handle({
    get: () => V(m.px(st.qx), m.py(st.qy)),
    set: p => {
      st.qx = Math.max(m.X0 + .1, Math.min(m.X1 - .1, (p.x - m.px(0)) / m.s));
      st.qy = Math.max(m.Y0 + .1, Math.min(m.Y1 - .1, (m.py(0) - p.y) / m.s));
    },
    color: '#67e8f9', r: 7, label: 'P',
  });

  B.renderFn = () => {
    B.grid(m);
    if (st.mode === 0) {
      /* ---------- 模式一 单个半平面 ---------- */
      const { A, B: Bc, C, side } = st;
      const degenerate = Math.abs(A) + Math.abs(Bc) < 1e-9;
      const ends = degenerate ? null : lineEnds(A, Bc, C);
      if (ends) fillPoly(clip(RECT, A, Bc, C, side), '#5cadff', .14);
      if (ends) {
        B.seg(ends[0], ends[1], { stroke: '#ffd166', 'stroke-width': 2.2 });
        if (st.labs) {
          const t = V(ends[0].x * .35 + ends[1].x * .65, ends[0].y * .35 + ends[1].y * .65);
          B.tex(V(t.x + 8, t.y - 12), `$${expr(A, Bc, C)}=0$`, { size: 12.5, anchor: 'start', color: '#ffd166' });
        }
      }
      const fv = side * (A * st.qx + Bc * st.qy + C);
      const dot = V(m.px(st.qx), m.py(st.qy));
      B.dot(dot, 6, { fill: fv >= -1e-9 ? '#4ade80' : '#ff7b8a', stroke: '#0a0d14', 'stroke-width': 1.5 });
      B.tex(V(430, 26), degenerate ? '$A=B=0$：$f$ 为常数，不表示半平面（拖滑块使 $A,B$ 不同时为 $0$）'
        : `$f(x,y)=${expr(A, Bc, C)}$　　区域取 $f${side > 0 ? '\\ge' : '\\le'}0$ 的一侧`, { size: 14.5, anchor: 'mid' });
      B.text(V(430, 48), '拖 P 点：同侧的点代入同号，跨过直线时符号翻转 —— 这就是「代点定号」', { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'middle' });
      cF(`$f(${f1(st.qx)},${f1(st.qy)})=${f1(fv)}$`);
      cG(Math.abs(fv) < .005 ? '$f=0$' : (fv > 0 ? `$f>0$（${side > 0 ? '区域内' : '区域外'}）` : `$f<0$（${side > 0 ? '区域外' : '区域内'}）`));
      const orig = side * C;
      cR(`原点处 $f=${f1(C)}$：${Math.abs(C) < 1e-9 ? '过原点' : (orig > 0 ? '原点在区域内' : '原点在区域外')}`);
      if (degenerate) cJ('退化：$A=B=0$ 时不画边界', 'warn');
      else if (Math.abs(fv) < .005) cJ('P 在边界上：等号成立，属于区域（严格不等号时属于边界但不属于区域）', 'ok');
      else if (fv > 0) cJ('P 与判定式同号，落在区域内', 'ok');
      else cJ('P 与判定式异号，落在区域外');
    } else {
      /* ---------- 模式二 不等式组 ---------- */
      let region = RECT.slice();
      let alive = 0;
      CONS.forEach(c => {
        if (!st[c.key]) return;
        alive++;
        region = clip(region, c.A, c.B, Cof(c), 1);
        const ends = lineEnds(c.A, c.B, Cof(c));
        if (ends) B.seg(ends[0], ends[1], { stroke: c.col, 'stroke-width': 1.9, 'stroke-dasharray': c.key === 't4' ? '7 4' : '' });
      });
      const verts = sortPts(uniq(region));
      fillPoly(region, '#4ade80', .15);
      if (st.labs) verts.forEach(p => {
        B.dot(V(m.px(p.x), m.py(p.y)), 4, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1 });
        B.tex(V(m.px(p.x) + 9, m.py(p.y) - 9), `$(${f1(p.x)},${f1(p.y)})$`, { size: 11.5, anchor: 'start', color: '#ffd166' });
      });
      const sat = CONS.filter(c => st[c.key]).length;
      const okAll = CONS.every(c => !st[c.key] || c.A * st.qx + c.B * st.qy + Cof(c) >= -1e-9);
      const bad = CONS.filter(c => st[c.key] && c.A * st.qx + c.B * st.qy + Cof(c) < -1e-9);
      B.dot(V(m.px(st.qx), m.py(st.qy)), 6, { fill: okAll ? '#4ade80' : '#ff7b8a', stroke: '#0a0d14', 'stroke-width': 1.5 });
      B.tex(V(430, 26), `可行域 = ${alive} 个半平面的交集　　探针 $P(${f1(st.qx)},${f1(st.qy)})$`, { size: 14.5, anchor: 'mid' });
      B.text(V(430, 48), '逐条开关约束：每加一条，区域被该直线切去一半；交集一定是凸多边形', { 'font-size': 12, fill: '#93a1b5', 'text-anchor': 'middle' });
      if (st.labs) {
        B.tex(V(500, 72), '四条约束对应四个半平面', { size: 12.5, anchor: 'start', color: '#93a1b5' });
        CONS.forEach((c, i) => {
          if (!st[c.key]) return;
          B.tex(V(500, 96 + i * 26), `${c.lab}${st[c.key] ? '' : '（关）'}`, { size: 13, anchor: 'start', color: c.col });
        });
        B.tex(V(500, 96 + CONS.length * 26 + 18), '灰线为坐标轴约束', { size: 11.5, anchor: 'start', color: '#93a1b5' });
      }
      cF(`$P(${f1(st.qx)},${f1(st.qy)})$`);
      cG(`满足 ${sat - bad.length}/${alive} 条约束`);
      cR(alive ? `顶点 ${verts.length} 个　面积 ${f1(shoelace(verts))}` : '无约束：整个视野');
      if (!alive) cJ('约束全部关闭，区域退化为整个视野', 'warn');
      else if (okAll) cJ('P 满足全部约束，落在可行域内', 'ok');
      else cJ(`P 违反 ${bad.length} 条：${bad.map(c => c.lab.replace(/\$/g, '')).join('、')}`);
    }
  };

  const modeBtns = ['单个半平面', '不等式组'].map((n, i) => B.btnM(n, () => {
    st.mode = i; modeBtns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render();
  }, { on: i === 0 }));
  const PRE = [
    { A: 1, B: 1, C: -4, side: 1, qx: 1, qy: 1, n: '① $x+y\\ge4$' },
    { A: 2, B: -1, C: 1, side: 1, qx: 3, qy: 1, n: '② $2x-y+1\\ge0$' },
    { A: -1, B: 3, C: -6, side: 1, qx: 3, qy: 1, n: '③ $-x+3y-6\\ge0$' },
  ];
  PRE.forEach(P => B.btnM(P.n, () => {
    st.mode = 0; st.A = P.A; st.B = P.B; st.C = P.C; st.side = P.side; st.qx = P.qx; st.qy = P.qy;
    sA.sync(P.A); sB.sync(P.B); sC.sync(P.C);
    modeBtns.forEach((b, j) => b.classList.toggle('on', j === 0));
    B.render();
  }, { on: false }));
  B.btnM('换边', () => { st.side = -st.side; B.render(); }, { on: false });
  CONS.forEach(c => B.toggleBtnM(c.lab, st[c.key], on => { st[c.key] = on; B.render(); }));
  B.graphToggles(st, ['grid', 'labs']);

  const sA = B.slider('A =', -2, 2, .5, 1, v => { st.A = v; B.render(); });
  const sB = B.slider('B =', -2, 2, .5, 2, v => { st.B = v; B.render(); });
  const sC = B.slider('C =', -6, 6, .5, -6, v => { st.C = v; B.render(); });
  const sK = B.slider('k =', 3, 8, .5, 7, v => { st.k = v; B.render(); });

  B.hint('拖 P 跨过直线看符号翻转；不等式组的区域是各半平面的交集 —— 逐条开关看它被切小');
  B.render();
  return B;
}
