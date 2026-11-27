/* 图 线1 · 半平面与可行域机：Ax+By+C 的符号把平面分成两半
   模式一「单个半平面」：一条直线把平面分成两侧，代入点 P 读 f=Ax+By+C 的符号。
     同侧的点符号一致（f 是线性函数，沿任一垂直于直线的方向单调），因此代一个点即可
     判定整个半平面；拖动 P 跨过直线时符号翻转、区域归属随之改变。
   模式二「不等式组」：每条约束各取一个半平面，交集是凸多边形可行域。逐条开关约束，
     看区域如何被切小、顶点数与面积如何变化；探针 P 走进区域读满足条数。
   局部坐标约定：isoFit 视野 x∈[-0.8,4.8]、y∈[-0.8,4.4]（rect=[0,50,860,380]，pad 20），
   等单位（45° 即斜率 1）。约束统一写成 A x + B y + C ≥ 0 的形式。 */
import { InequalityBoard, visibleLine } from '../inequality-board.js';
import { mk, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 540, H = 460;
  const B = new InequalityBoard(root, W, H);
  B.chipRow.classList.add('paired-notes');
  const f1 = v => fmt(v, 2).replace(/\.?0+$/, '');
  const st = { mode: 0, A: 1, B: 2, C: -6, side: 1, qx: 3, qy: 3, k: 7,
    t1: true, t2: true, t3: true, t4: true, grid: true, labs: true };
  const m = B.isoFit(-0.8, 4.8, -0.8, 4.4, [60, 50, 409.23, 380], 0);
  const RECT = [V(m.X0, m.Y0), V(m.X1, m.Y0), V(m.X1, m.Y1), V(m.X0, m.Y1)];
  const cF = B.readout('读数'), cG = B.readout('符号', 'gold'), cR = B.chipM('区域'), cJ = B.chipM('判读');

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

  B.handle({
    get: () => V(m.px(st.qx), m.py(st.qy)),
    set: p => {
      st.qx = Math.max(m.X0 + .1, Math.min(m.X1 - .1, (p.x - m.px(0)) / m.s));
      st.qy = Math.max(m.Y0 + .1, Math.min(m.Y1 - .1, (m.py(0) - p.y) / m.s));
    },
    color: '#67e8f9', r: 7, label: 'P',
  });

  B.renderFn = () => {
    const single = st.mode === 0;
    for (const el of [sA, sB, sC]) el.closest('.slider').style.display = single ? '' : 'none';
    sK.closest('.slider').style.display = single ? 'none' : '';
    flip.style.display = single ? '' : 'none';
    for (const { button } of constraints) button.style.display = single ? 'none' : '';
    B.grid({ ...m, grid: st.grid, labs: st.labs });
    if (st.mode === 0) {
      /* ---------- 模式一 单个半平面 ---------- */
      const { A, B: Bc, C, side } = st;
      const degenerate = Math.abs(A) + Math.abs(Bc) < 1e-9;
      const ends = degenerate ? null : visibleLine(m, A, Bc, C);
      fillPoly(clip(RECT, A, Bc, C, side), '#5cadff', .14);
      if (ends) {
        B.seg(ends[0], ends[1], { stroke: '#ffd166', 'stroke-width': 2.2 });
        if (st.labs) {
          const t = V(ends[0].x * .35 + ends[1].x * .65, ends[0].y * .35 + ends[1].y * .65);
          B.tex(V(t.x + 8, t.y - 12), `$${expr(A, Bc, C)}=0$`, { size: 12.5, anchor: 'start', color: '#ffd166' });
        }
      }
      const fv = A * st.qx + Bc * st.qy + C;
      const inside = side * fv >= -1e-9;
      B.handles[0].st.color = inside ? '#4ade80' : '#ff7b8a';
      B.tex(V(W / 2, 25), `$${expr(A, Bc, C)}${side > 0 ? '\\ge' : '\\le'}0$`, { size: 15, anchor: 'mid' });
      cF(`$f(${f1(st.qx)},${f1(st.qy)})=${f1(fv)}$`);
      cG(Math.abs(fv) < 1e-9 ? '$f=0$' : (fv > 0 ? `$f>0$（${side > 0 ? '区域内' : '区域外'}）` : `$f<0$（${side > 0 ? '区域外' : '区域内'}）`));
      const orig = side * C;
      cR(`原点处 $f=${f1(C)}$：${Math.abs(C) < 1e-9 ? '过原点' : (orig > 0 ? '原点在区域内' : '原点在区域外')}`);
      if (degenerate) cJ(inside ? '常量不等式成立，解集为整个平面' : '常量不等式不成立，解集为空集', 'warn');
      else if (Math.abs(fv) < 1e-9) cJ('P 在边界上：等号成立，属于区域（严格不等号时属于边界但不属于区域）', 'ok');
      else if (inside) cJ('$P$ 满足不等式，落在区域内', 'ok');
      else cJ('$P$ 落在区域外');
    } else {
      /* ---------- 模式二 不等式组 ---------- */
      let region = RECT.slice();
      const active = CONS.filter(c => st[c.key]);
      const alive = active.length;
      active.forEach(c => {
        region = clip(region, c.A, c.B, Cof(c), 1);
        const ends = visibleLine(m, c.A, c.B, Cof(c));
        if (ends) B.seg(ends[0], ends[1], { stroke: c.col, 'stroke-width': 1.9, 'stroke-dasharray': c.key === 't4' ? '7 4' : '' });
      });
      const outline = sortPts(uniq(region));
      const verts = outline.filter(p => active.filter(c => Math.abs(c.A * p.x + c.B * p.y + Cof(c)) < 1e-7).length >= 2);
      fillPoly(region, '#4ade80', .15);
      if (st.labs) verts.forEach(p => {
        B.mark(V(m.px(p.x), m.py(p.y)), '#ffd166');
        B.tex(V(m.px(p.x) + 9, m.py(p.y) - 9), `$(${f1(p.x)},${f1(p.y)})$`, { size: 11.5, anchor: 'start', color: '#ffd166' });
      });
      const bad = active.filter(c => c.A * st.qx + c.B * st.qy + Cof(c) < -1e-9);
      const okAll = bad.length === 0;
      B.handles[0].st.color = okAll ? '#4ade80' : '#ff7b8a';
      for (const c of active) B.note(c.lab.replace('k', f1(st.k)), c.col);
      cF(`$P(${f1(st.qx)},${f1(st.qy)})$`);
      cG(`满足 ${alive - bad.length}/${alive} 条约束`);
      cR(alive ? `图内顶点 ${verts.length} 个，${outline.length === verts.length ? '面积' : '图内面积'} $${f1(shoelace(outline))}$` : '无约束：整个平面');
      if (!alive) cJ('约束全部关闭，区域退化为整个平面', 'warn');
      else if (okAll) cJ('P 满足全部约束，落在可行域内', 'ok');
      else cJ(`P 违反 ${bad.length} 条：${bad.map(c => c.lab.replace('k', f1(st.k))).join('、')}`);
    }
  };

  B.choiceRow('选择模式', ['单个半平面', '不等式组'].map(name => ({ name })), () => st.mode, i => {
    st.mode = i; B.render();
  });
  const PRE = [
    { name: '截距', formula: '$x+y\\ge4$', values: { mode: 0, A: 1, B: 1, C: -4, side: 1, qx: 1, qy: 1 } },
    { name: '过点', formula: '$2x-y+1\\ge0$', values: { mode: 0, A: 2, B: -1, C: 1, side: 1, qx: 3, qy: 1 } },
    { name: '斜边界', formula: '$-x+3y-6\\ge0$', values: { mode: 0, A: -1, B: 3, C: -6, side: 1, qx: 3, qy: 1 } },
  ];
  B.examples('选择例题', PRE, st, P => {
    st.mode = 0; st.A = P.A; st.B = P.B; st.C = P.C; st.side = P.side; st.qx = P.qx; st.qy = P.qy;
    sA.sync(P.A); sB.sync(P.B); sC.sync(P.C);
    B.render();
  });
  const flip = B.btnM('换边', () => { st.side = -st.side; B.render(); }, { on: false });
  const constraints = CONS.map(c => B.toggleBtnM(c.lab, st[c.key], on => { st[c.key] = on; B.render(); }));
  B.graphToggles(st, ['grid', 'labs']);

  const sA = B.slider('A =', -2, 2, .5, 1, v => { st.A = v; B.render(); }, undefined, n => `$A=${n}$`);
  const sB = B.slider('B =', -3, 3, .5, 2, v => { st.B = v; B.render(); }, undefined, n => `$B=${n}$`);
  const sC = B.slider('C =', -6, 6, .5, -6, v => { st.C = v; B.render(); }, undefined, n => `$C=${n}$`);
  const sK = B.slider('k =', 3, 8, .5, 7, v => { st.k = v; B.render(); }, undefined, n => `$k=${n}$`);

  B.render();
  return B;
}
