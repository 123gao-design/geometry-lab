/* 图 基3 · 定比分点机
   点 P 在直线 AB 上，且 AP = λ·PB（有向量意义）。由 A、B 的坐标解出 P = (A + λB)/(1 + λ)。
   λ>0 时 P 在 A、B 之间（内分），λ<0 时落在延长线上（外分），λ=−1 时方程无解。
   拖动 A、B 两个端点，滑块单独调 λ；金色点就是分点 P。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: -1, ay: -1, bx: 1, by: 1, lam: -2, grid: true, labs: true };
  const PRE = [
    { nm: '① 中点', a: [-2, 0], b: [2, 1.5], lam: 1 },
    { nm: '② 内分 2:1', a: [-2, 0], b: [2, 1.5], lam: 2 },
    { nm: '③ 外分', a: [-1, -1], b: [1, 1], lam: -2 },
    { nm: '④ λ=−1', a: [-2, 0], b: [2, 1.5], lam: -1 },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cP = B.chipM('分点'), cR = B.chipM('比值'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const A = V(m.px(st.ax), m.py(st.ay));
    const Bp = V(m.px(st.bx), m.py(st.by));
    const ok = Math.abs(st.lam + 1) > 1e-9;
    const px = ok ? (st.ax + st.lam * st.bx) / (1 + st.lam) : 0;
    const py = ok ? (st.ay + st.lam * st.by) / (1 + st.lam) : 0;
    const P = V(m.px(px), m.py(py));

    // 所在直线：向两端各延长一段
    const dx = st.bx - st.ax, dy = st.by - st.ay;
    B.seg(V(m.px(st.ax - 0.35 * dx), m.py(st.ay - 0.35 * dy)),
      V(m.px(st.bx + 0.35 * dx), m.py(st.by + 0.35 * dy)),
      { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-dasharray': '5 5', 'stroke-opacity': .55 });

    // P 与两段 AP、PB
    if (ok) {
      B.seg(A, P, { stroke: '#ffd166', 'stroke-width': 2, 'stroke-opacity': .8 });
      B.seg(P, Bp, { stroke: '#67e8f9', 'stroke-width': 2, 'stroke-opacity': .8 });
      B.dot(P, 6, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.text(V(P.x + 9, P.y - 11), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });
    }
    B.dot(A, 5, { fill: '#4ade80' });
    B.dot(Bp, 5, { fill: '#ff9e4a' });
    B.text(V(A.x - 13, A.y - 9), 'A', { 'font-size': 12.5, 'font-weight': 700, fill: '#4ade80' });
    B.text(V(Bp.x + 8, Bp.y - 10), 'B', { 'font-size': 12.5, 'font-weight': 700, fill: '#ff9e4a' });
    B.dot(O, 3.4, { fill: '#e8eefc' });

    // 徽章
    if (ok) {
      cP(`$P=(${fmt(px, 2)},\\ ${fmt(py, 2)})$`);
      cR(`$AP:PB=${fmt(st.lam, 1)}:1$`);
    } else {
      cP('$1+\\lambda=0$');
      cR('$AP=-PB$ 不可能');
    }
    cJ(!ok ? 'λ=−1：方程无解，分点 P 不存在'
      : st.lam === 0 ? 'λ=0：AP 长度为零，P 与 A 重合'
        : st.lam === 1 ? 'λ=1：P 是 AB 的中点'
          : st.lam > 0 ? 'λ>0：P 落在 A、B 之间，是内分点'
            : 'λ<0：P 落在 AB 的延长线上，是外分点');
  };

  const cl = v => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
  B.handle({
    color: '#4ade80', r: 7,
    get: () => V(m.px(st.ax), m.py(st.ay)),
    set: p => { st.ax = cl((p.x - m.px(0)) / m.s); st.ay = cl((m.py(0) - p.y) / m.s); },
  });
  B.handle({
    color: '#ff9e4a', r: 7,
    get: () => V(m.px(st.bx), m.py(st.by)),
    set: p => { st.bx = cl((p.x - m.px(0)) / m.s); st.by = cl((m.py(0) - p.y) / m.s); },
  });

  const sl = B.slider('λ', -2, 3, 0.5, st.lam, v => {
    st.lam = v; sl.sync(v); B.render();
  }, 'lam');

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    [st.ax, st.ay] = p.a; [st.bx, st.by] = p.b; st.lam = p.lam;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    sl.sync(p.lam);
    B.render();
  }, { on: i === 2 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动 A、B 改端点，滑块调 λ：金色点就是分点 P，λ=−1 时分点不存在');
  B.render();
  return B;
}
