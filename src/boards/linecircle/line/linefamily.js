/* 图 直4a · 直线束机
   三档：① 过定点的直线束（拖动束心 P，k 滑块转动当前直线，竖直的 x=x₀ 另用虚线画出）
        ② 平行直线系（斜率固定，截距成串）
        ③ 过两直线交点的直线系 l₁+λl₂=0（λ 滑块转动，λ=1 得 x=2、λ=−1 得 y=1）
   读数：束心或交点 / 参数 / 当前直线 / 判读。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { mode: 0, k: 0.8, b: 0.9, lam: 1, px: 1.3, py: 1.2, grid: true, labs: true };
  const m = B.isoFit(-4.6, 4.8, -3.2, 3.3, [44, 30, 760, 392], 10);
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const add = v => (v >= 0 ? '+' : '') + fz(v);
  const cA = B.chipM('束心或交点'), cB = B.chipM('参数'), cC = B.chipM('当前直线'), cD = B.chipM('判读');

  const lineAt = (A, Bq, C, at) => { // Ax+By+C=0 在视野内的一段
    if (Math.abs(Bq) < 1e-9) {
      const x = -C / A;
      B.seg(V(m.px(x), m.py(m.Y0)), V(m.px(x), m.py(m.Y1)), at);
      return;
    }
    B.seg(V(m.px(m.X0), m.py(-(A * m.X0 + C) / Bq)),
      V(m.px(m.X1), m.py(-(A * m.X1 + C) / Bq)), at);
  };

  const hp = B.handle({
    color: '#ff9e4a', r: 7, label: 'P', lo: [10, -9],
    get: () => V(m.px(st.px), m.py(st.py)),
    set: p => { st.px = (p.x - m.px(0)) / m.s; st.py = (m.py(0) - p.y) / m.s; },
    clamp: p => ({ x: Math.min(m.px(4.2), Math.max(m.px(-3.6), p.x)),
      y: Math.min(m.py(-2.6), Math.max(m.py(2.6), p.y)) }),
  });
  const qh = B.handles[B.handles.length - 1];

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });

    if (st.mode === 0) {
      // 束内其他直线作底色
      for (const kk of [-2.2, -1.1, -0.55, 0, 0.55, 1.1, 2.2])
        lineAt(kk, -1, st.py - kk * st.px, { stroke: '#3f5f8f', 'stroke-width': 1.1, 'stroke-opacity': .55 });
      // 竖直的那条不在 k 参数里
      B.seg(V(m.px(st.px), m.py(m.Y0)), V(m.px(st.px), m.py(m.Y1)),
        { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-dasharray': '6 5', 'stroke-opacity': .8 });
      B.textM(V(m.px(st.px) + 8, m.py(m.Y1) + 15), `$x=${fz(st.px)}$`, { 'font-size': 11, fill: '#8fa3bd', 'text-anchor': 'start' });
      // 当前直线
      lineAt(st.k, -1, st.py - st.k * st.px, { stroke: '#ffd166', 'stroke-width': 2.4 });
      cA(`$P(${fz(st.px)},\\ ${fz(st.py)})$`);
      cB(`$k=${fz(st.k)}$`);
      cC(`$y${add(-st.py)}=${fz(st.k)}(x${add(-st.px)})$`);
      cD('同一束心、不同斜率的直线归成一族；竖直直线不在 k 参数内，须单独补上');
    } else if (st.mode === 1) {
      for (const bb of [-2, -1, 0, 1, 2])
        lineAt(st.k, -1, bb, { stroke: '#3f5f8f', 'stroke-width': 1.1, 'stroke-opacity': .55 });
      lineAt(st.k, -1, st.b, { stroke: '#ffd166', 'stroke-width': 2.4 });
      cA('平行线族没有公共点');
      cB(`$k=${fz(st.k)}$`);
      cC(`$y=${fz(st.k)}x${add(st.b)}$`);
      cD('斜率固定、截距逐个取值 —— 一族互相平行的直线');
    } else {
      // l₁: x+y−3=0，l₂: x−y−1=0，交点 P(2,1)
      lineAt(1, 1, -3, { stroke: '#5cadff', 'stroke-width': 2.1, 'stroke-opacity': .95 });
      lineAt(1, -1, -1, { stroke: '#4ade80', 'stroke-width': 2.1, 'stroke-opacity': .95 });
      B.text(V(m.px(4.3), m.py(4.3 - 3) - 9), 'l₁', { 'font-size': 12, 'font-weight': 700, fill: '#5cadff' });
      B.text(V(m.px(4.3), m.py(4.3 - 1) - 9), 'l₂', { 'font-size': 12, 'font-weight': 700, fill: '#4ade80' });
      const A = 1 + st.lam, Bq = 1 - st.lam, C = -3 - st.lam;
      lineAt(A, Bq, C, { stroke: '#ffd166', 'stroke-width': 2.4 });
      B.dot(V(m.px(2), m.py(1)), 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.3 });
      B.text(V(m.px(2) + 9, m.py(1) - 10), 'P', { 'font-size': 12.5, 'font-weight': 700, fill: '#ff9e4a' });
      const co = v => (Math.abs(v - Math.round(v)) < 5e-3 ? String(Math.round(v)) : fz(v));
      const term = (v, s, first) => {
        if (Math.abs(v) < 5e-3) return '';
        const sign = v < 0 ? '-' : (first ? '' : '+');
        const av = Math.abs(v);
        return `${sign}${Math.abs(av - 1) < 5e-3 ? '' : co(av)}${s}`;
      };
      const eq = ([term(A, 'x', true), term(Bq, 'y', false), term(C, '', false)].join('') || '0').replace(/^\+/, '');
      cA('$P(2,\\ 1)$');
      cB(`$\\lambda=${fz(st.lam)}$`);
      cC(`$${eq}=0$`);
      cD('λ 无论怎么取，直线都过 P；λ=1 得 x=2，λ=−1 得 y=1，而 l₂ 本身取不到');
    }
  };

  let sK, sB, sL;
  const btns = [
    B.btn('① 过定点', () => setMode(0), { on: true }),
    B.btn('② 平行系', () => setMode(1)),
    B.btn('③ 过交点', () => setMode(2)),
  ];
  const setMode = i => { st.mode = i; syncMode(); };
  const par = e => e && (e.parentNode || e.parent);
  const syncMode = () => {
    btns.forEach((b, i) => b.classList.toggle('on', i === st.mode));
    if (par(sK)) par(sK).style.display = st.mode === 0 || st.mode === 1 ? '' : 'none';
    if (par(sB)) par(sB).style.display = st.mode === 1 ? '' : 'none';
    if (par(sL)) par(sL).style.display = st.mode === 2 ? '' : 'none';
    if (qh) { qh.c.style.display = st.mode === 0 ? '' : 'none'; if (qh.lbl) qh.lbl.style.display = st.mode === 0 ? '' : 'none'; }
    B.render();
  };
  sK = B.slider('k', -3, 3, 0.1, st.k, v => { st.k = v; B.render(); }, 'k');
  sB = B.slider('b', -3, 3, 0.1, st.b, v => { st.b = v; B.render(); }, 'b');
  sL = B.slider('λ', -4, 4, 0.5, st.lam, v => { st.lam = v; B.render(); }, 'la');

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('换三档看三种直线系：过定点、平行、过两直线交点');
  syncMode();
  return B;
}
