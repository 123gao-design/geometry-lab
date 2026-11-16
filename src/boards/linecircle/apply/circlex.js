/* 图 综1b · 与圆有关的最值
   圆心 C 固定，半径 r 可调，P 在圆上滑动。两种模式：
   ① 定点 Q 可拖动，|PQ| 的最小值是 ||QC|−r|、最大值是 |QC|+r，最近点与最远点都在射线 CQ 上；
   ② 直线 l 可上下移动，P 到 l 的距离最小是 |d−r|（l 与圆相交时为 0）、最大是 d+r，其中 d 是圆心到 l 的距离。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const CX = 1, CY = 0;
  const st = { r: 1.5, qx: 4.4, qy: 1.6, h: -1.9, pa: 140, mode: 0, grid: true, labs: true };
  const m = B.isoFit(-3, 5.6, -3.1, 3.1, [44, 28, 760, 392], 10);
  const cA = B.chipM('定点与半径'), cB = B.chipM('当前距离'), cC = B.chipM('最值范围'), cD = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const P2 = (x, y) => V(m.px(x), m.py(y));
  const rad = () => st.pa * Math.PI / 180;
  const pt = () => V(CX + st.r * Math.cos(rad()), CY + st.r * Math.sin(rad()));
  const circle = (cx, cy, r, color) => {
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(P2(cx + r * Math.cos(a1), cy + r * Math.sin(a1)), P2(cx + r * Math.cos(a2), cy + r * Math.sin(a2)),
        { stroke: color, 'stroke-width': 2.3, 'stroke-opacity': .95 });
    }
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    circle(CX, CY, st.r, '#ffd166');
    const C = P2(CX, CY), P = P2(pt().x, pt().y);
    B.dot(C, 4.5, { fill: '#5cadff', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(C.x - 11, C.y - 9), 'C', { 'font-size': 12.5, 'font-weight': 700, fill: '#5cadff' });
    B.dot(P, 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(P.x + 11, P.y - 9), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ff9e4a' });

    if (st.mode === 0) {
      const Q = P2(st.qx, st.qy);
      const L = Math.hypot(st.qx - CX, st.qy - CY) || 1e-6;
      const ux = (st.qx - CX) / L, uy = (st.qy - CY) / L;
      const Np = P2(CX + st.r * ux, CY + st.r * uy);
      const Fp = P2(CX - st.r * ux, CY - st.r * uy);
      B.seg(C, Q, { stroke: '#8fa3bd', 'stroke-width': 1.3, 'stroke-dasharray': '5 4', 'stroke-opacity': .85 });
      B.seg(P, Q, { stroke: '#7ee787', 'stroke-width': 2.2, 'stroke-opacity': .95 });
      B.dot(Np, 4.5, { fill: 'none', stroke: '#5cadff', 'stroke-width': 2 });
      B.dot(Fp, 4.5, { fill: 'none', stroke: '#c084fc', 'stroke-width': 2 });
      B.dot(Q, 6, { fill: '#7ee787', stroke: '#0a0d14', 'stroke-width': 1 });
      B.text(V(Q.x + 11, Q.y - 9), 'Q', { 'font-size': 13, 'font-weight': 700, fill: '#7ee787' });

      const lq = Math.hypot(P.x - Q.x, P.y - Q.y) / m.s;
      const near = Math.abs(lq - Math.abs(L - st.r)), far = Math.abs(lq - (L + st.r));
      cA(`$|QC|=${fz(L)}$，$r=${fz(st.r)}$`);
      cB(`$|PQ|=${fz(lq)}$`);
      cC(`最小值 $${fz(Math.abs(L - st.r))}$，最大值 $${fz(L + st.r)}$`);
      if (near < .05) cD('P 正在最近点（蓝圈），|PQ| 取到最小值', 'ok');
      else if (far < .05) cD('P 正在最远点（紫圈），|PQ| 取到最大值', 'ok');
      else cD('P 在圆上游走，|PQ| 界于最近与最远两值之间');
    } else {
      const lY = P2(0, st.h), y0 = P2(-3, st.h), y1 = P2(5.6, st.h);
      B.seg(y0, y1, { stroke: '#5cadff', 'stroke-width': 2.2, 'stroke-opacity': .95 });
      const foot = P2(pt().x, st.h);
      B.seg(P, foot, { stroke: '#c084fc', 'stroke-width': 1.8, 'stroke-dasharray': '5 4', 'stroke-opacity': .95 });
      const s = 9, ux = P.x > foot.x ? 1 : -1;
      const vy = P.y > foot.y ? 1 : -1;
      B.seg(foot, V(foot.x + s * ux, foot.y), { stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-opacity': .9 });
      B.seg(foot, V(foot.x, foot.y + s * vy), { stroke: '#c084fc', 'stroke-width': 1.4, 'stroke-opacity': .9 });
      B.text(V(5.45 * m.s + m.px(0) - 12, lY.y - 8), 'l', { 'font-size': 12.5, 'font-weight': 700, fill: '#5cadff', 'font-style': 'italic' });

      const d = Math.abs(CY - st.h);
      const dist = Math.abs(pt().y - st.h);
      const lo = d >= st.r ? d - st.r : 0;
      cA(`$d(C,l)=${fz(d)}$，$r=${fz(st.r)}$`);
      cB(`$d(P,l)=${fz(dist)}$`);
      cC(`最小值 $${fz(lo)}$，最大值 $${fz(d + st.r)}$`);
      if (Math.abs(dist - lo) < .05) cD('P 落在离 l 最近的那一侧，距离取到最小值', 'ok');
      else if (Math.abs(dist - (d + st.r)) < .05) cD('P 落在离 l 最远的那一侧，距离取到最大值', 'ok');
      else cD('P 在圆上游走，到 l 的距离界于两值之间');
    }
  };

  const btns = [
    B.btn('① 到定点', () => setMode(0), { on: true }),
    B.btn('② 到定直线', () => setMode(1)),
  ];
  const PRE = [
    { nm: '① Q 在外', v: [1.5, 4.4, 1.6, -1.9, 140, 0] },
    { nm: '② Q 在内', v: [1.5, 2.1, 0.7, -1.9, 40, 0] },
    { nm: '③ 直线相交', v: [1.5, 4.4, 1.6, 0.8, 140, 1] },
  ];
  const pbtns = PRE.map((o, i) => B.btn(o.nm, () => {
    [st.r, st.qx, st.qy, st.h, st.pa, st.mode] = o.v;
    syncMode();
    pbtns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));

  let sR, sH, qh;
  const setMode = m => { st.mode = m; syncMode(); B.render(); };
  const syncMode = () => {
    btns.forEach((b, i) => b.classList.toggle('on', i === st.mode));
    const par = sH && (sH.parentNode || sH.parent);
    if (par) par.style.display = st.mode === 1 ? '' : 'none';
    if (qh) { qh.c.style.display = st.mode === 0 ? '' : 'none'; if (qh.lbl) qh.lbl.style.display = st.mode === 0 ? '' : 'none'; }
    PRECls();
  };
  const PRECls = () => pbtns.forEach((b2, j) => b2.classList.toggle('on', PRE[j].v.join() === [st.r, st.qx, st.qy, st.h, st.pa, st.mode].join()));

  B.handle({
    color: '#7ee787', r: 7, label: 'Q', lo: [10, -8],
    get: () => P2(st.qx, st.qy),
    set: p => {
      st.qx = Math.max(m.X0 + .2, Math.min(m.X1 - .2, (p.x - m.px(0)) / m.s));
      st.qy = Math.max(m.Y0 + .2, Math.min(m.Y1 - .2, (m.py(0) - p.y) / m.s));
    },
  });
  qh = B.handles[B.handles.length - 1];
  if (qh.lbl) qh.lbl.textContent = 'Q';
  B.handle({
    color: '#ff9e4a', r: 7, label: 'P', lo: [10, -8],
    get: () => { const q = pt(); return P2(q.x, q.y); },
    set: p => {
      st.pa = Math.atan2((m.py(0) - p.y) / m.s - CY, (p.x - m.px(0)) / m.s - CX) * 180 / Math.PI;
    },
  });

  sR = B.slider('半径 r', 0.9, 2, 0.1, st.r, v => { st.r = v; B.render(); }, 'r');
  sH = B.slider('直线高度 h', -2.8, 2.8, 0.1, st.h, v => { st.h = v; B.render(); }, 'h');

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖 P 沿圆走、拖 Q 换定点；① 到定点 ② 换到定直线');
  syncMode();
  B.render();
  return B;
}
