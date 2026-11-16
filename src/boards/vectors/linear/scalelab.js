/* 图 向3 · 数乘与共线机
   实数的数乘 λa：λ>0 同向、λ<0 反向，|λ| 决定伸长或缩短；λ=0 得零向量。
   共线向量定理：a≠0 时，b 与 a 共线 ⟺ 存在唯一实数 λ 使 b=λa。
   拖动 a、b 两个终点，用横排判定 x₁y₂−x₂y₁ 是否为 0 读共线；左侧滑块单独调 λ。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { ax: 2, ay: 1, bx: 3, by: 1.5, lam: 1.5, grid: true, labs: true };
  const PRE = [
    { nm: '① 反向等长', ax: 2, ay: 1, bx: -2, by: -1, lam: -1 },
    { nm: '② 同向伸长', ax: 2, ay: 1, bx: 3, by: 1.5, lam: 1.5 },
    { nm: '③ 不共线', ax: 2, ay: 1, bx: 3, by: 1, lam: 1.5 },
    { nm: '④ 零向量', ax: 2, ay: 1, bx: 3, by: 1, lam: 0 },
  ];
  const m = B.isoFit(-4.6, 4.6, -3.4, 3.4, [40, 36, 780, 374], 10);
  const cS = B.chipM('数乘'), cC = B.chipM('共线'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const A = V(m.px(st.ax), m.py(st.ay));
    const Bp = V(m.px(st.bx), m.py(st.by));
    const lx = st.lam * st.ax, ly = st.lam * st.ay;
    const L = V(m.px(lx), m.py(ly));
    const la = Math.hypot(st.ax, st.ay);
    const cross = st.ax * st.by - st.ay * st.bx;

    // λa：金色实线；λ=0 时退成一个点
    if (Math.hypot(lx, ly) > 0.01) {
      B.arrow(O, L, { stroke: '#ffd166', 'stroke-width': 2.4, head: 13, wide: 6 });
      B.tex(V((O.x + L.x) / 2, (O.y + L.y) / 2 - 15), `$\\lambda\\vec a$`, { size: 14, anchor: 'mid', color: '#ffd166', w: 60 });
    } else {
      B.dot(O, 5.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.4 });
      B.tex(V(O.x + 26, O.y + 18), '$\\lambda=0$', { size: 12.5, anchor: 'start', color: '#ffd166', w: 60 });
    }
    // a 与 b
    B.arrow(O, A, { stroke: '#5cadff', 'stroke-width': 2.2, head: 12, wide: 5.5 });
    B.tex(V((O.x + A.x) / 2 + 6, (O.y + A.y) / 2 - 13), '$\\vec a$', { size: 14, anchor: 'start', color: '#5cadff', w: 40 });
    B.arrow(O, Bp, { stroke: '#4ade80', 'stroke-width': 2.2, head: 12, wide: 5.5, 'stroke-dasharray': '1 0' });
    B.tex(V((O.x + Bp.x) / 2, (O.y + Bp.y) / 2 + 16), '$\\vec b$', { size: 14, anchor: 'mid', color: '#4ade80', w: 40 });
    B.dot(O, 3.4, { fill: '#e8eefc' });

    // 徽章
    cS(`$\\lambda\\vec a=(${fmt(lx, 1)},\\ ${fmt(ly, 1)})$`);
    if (la > 1e-9 && Math.abs(cross) < 1e-9) {
      const k = (st.ax * st.bx + st.ay * st.by) / (st.ax * st.ax + st.ay * st.ay);
      cC(`$x_1y_2-x_2y_1=0$，$\\vec b=${fmt(k, 2)}\\vec a$`);
    } else {
      cC(`$x_1y_2-x_2y_1=${fmt(cross, 2)}$，两向量不共线`);
    }
    cJ(st.lam === 0 ? 'λ=0：数乘结果退成零向量，方向不再有意义'
      : st.lam === 1 ? 'λ=1：数乘结果与 a 完全重合'
        : st.lam === -1 ? 'λ=−1：与 a 反向且等长，是 a 的相反向量'
          : st.lam > 0
            ? (st.lam > 1 ? 'λ>1：与 a 同向，长度伸到 |λ| 倍' : '0<λ<1：与 a 同向，长度缩到 λ 倍')
            : (st.lam < -1 ? 'λ<−1：与 a 反向，长度伸到 |λ| 倍' : '−1<λ<0：与 a 反向，长度缩到 |λ| 倍'));
  };

  const cl = v => Math.max(-4, Math.min(4, Math.round(v * 2) / 2));
  B.handle({
    color: '#5cadff', r: 7,
    get: () => V(m.px(st.ax), m.py(st.ay)),
    set: p => { st.ax = cl((p.x - m.px(0)) / m.s); st.ay = cl((m.py(0) - p.y) / m.s); },
  });
  B.handle({
    color: '#4ade80', r: 7,
    get: () => V(m.px(st.bx), m.py(st.by)),
    set: p => { st.bx = cl((p.x - m.px(0)) / m.s); st.by = cl((m.py(0) - p.y) / m.s); },
  });

  const sl = B.slider('λ', -2, 3, 0.5, st.lam, v => {
    st.lam = v; sl.sync(v); B.render();
  }, 'lam');

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.ax = p.ax; st.ay = p.ay; st.bx = p.bx; st.by = p.by; st.lam = p.lam;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    sl.sync(p.lam);
    B.render();
  }, { on: i === 1 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动 a、b 的终点看共线判定；滑块单独调 λ，金色一支就是 λa');
  B.render();
  return B;
}
