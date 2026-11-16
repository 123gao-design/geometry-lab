/* 图 轨1 · 参数方程求最值
   椭圆 x=2cosθ、y=sinθ 上的点 P 到定点 Q(3,0) 的距离，平方后化成 cosθ 的二次函数：
   |PQ|²=(2cosθ−3)²+sin²θ=3cos²θ−12cosθ+10。
   右栏画 f(u)=3u²−12u+10（u=cosθ∈[−1,1]）的图象，当前 u 随 P 移动。
   拖动 P 走一圈，f 在 u=1 取最小、u=−1 取最大，最值点落在椭圆长轴的两个端点。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { deg: 60, grid: true, labs: true };
  const m = B.isoFit(-3.4, 3.4, -2.4, 2.4, [44, 30, 540, 390], 10);
  const cE = B.chipM('参数方程'), cF = B.chipM('目标函数'), cD = B.chipM('当前距离'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const th = () => st.deg * Math.PI / 180;
  const P = () => V(2 * Math.cos(th()), Math.sin(th()));
  const Q = V(3, 0);
  const fOf = u => 3 * u * u - 12 * u + 10;
  const ix = u => 600 + (u + 1.1) / 2.2 * 220;
  const iy = f => 330 - f / 27 * 250;

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const N = 96;
    for (let i = 0; i < N; i++) {
      const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
      B.seg(V(m.px(2 * Math.cos(a1)), m.py(Math.sin(a1))),
        V(m.px(2 * Math.cos(a2)), m.py(Math.sin(a2))),
        { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
    }
    const Pw = P(), Pp = V(m.px(Pw.x), m.py(Pw.y));
    const Qp = V(m.px(Q.x), m.py(Q.y));
    B.seg(Qp, Pp, { stroke: '#7ee787', 'stroke-width': 2.2, 'stroke-opacity': .9 });
    B.dot(Qp, 4.5, { fill: '#5cadff' });
    B.text(V(Qp.x + 9, Qp.y + 18), 'Q', { 'font-size': 13, 'font-weight': 700, fill: '#5cadff' });
    B.dot(Pp, 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(Pp.x + 10, Pp.y - 12), 'P', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });

    // 右栏：f(u) 图象
    const u = Math.cos(th()), f = fOf(u);
    B.seg(V(ix(-1.1), iy(0)), V(ix(1.1), iy(0)), { stroke: '#8fa3bd', 'stroke-width': 1.3, 'stroke-opacity': .7 });
    B.seg(V(ix(0), iy(0)), V(ix(0), iy(27)), { stroke: '#8fa3bd', 'stroke-width': 1.3, 'stroke-opacity': .7 });
    B.text(V(ix(1.1) + 4, iy(0) + 15), 'u', { 'font-size': 12, fill: '#8fa3bd' });
    B.text(V(ix(0) - 7, iy(27) - 4), 'f', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'end' });
    for (let i = 0; i < 60; i++) {
      const u1 = -1 + 2 * i / 60, u2 = -1 + 2 * (i + 1) / 60;
      B.seg(V(ix(u1), iy(fOf(u1))), V(ix(u2), iy(fOf(u2))), { stroke: '#5cadff', 'stroke-width': 1.9, 'stroke-opacity': .9 });
    }
    B.seg(V(ix(u), iy(f)), V(ix(u), iy(0)), { stroke: '#ff9e4a', 'stroke-width': 1.2, 'stroke-opacity': .7, 'stroke-dasharray': '4 4' });
    B.dot(V(ix(u), iy(f)), 4.5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1 });
    B.text(V(ix(u) + 8, iy(f) - 9), 'f(θ)', { 'font-size': 11.5, fill: '#ffd166' });

    const dist = Math.hypot(Pw.x - Q.x, Pw.y - Q.y);
    cE('$x=2\\cos\\theta,\\quad y=\\sin\\theta$');
    cF('$|PQ|^2=(2\\cos\\theta-3)^2+\\sin^2\\theta=3\\cos^2\\theta-12\\cos\\theta+10$');
    cD(`$|PQ|=${fz(dist)}$，$|PQ|^2=${fz(f)}$，$\\cos\\theta=${fz(u)}$`);
    cJ(Math.abs(st.deg) < 1e-6 ? 'θ=0：cosθ=1，f 取最小值 1，P 落在 (2,0)，|PQ|=1'
      : st.deg === 180 ? 'θ=180°：cosθ=−1，f 取最大值 25，P 落在 (−2,0)，|PQ|=5'
        : '令 u=cosθ∈[−1,1]，f=3u²−12u+10 的对称轴 u=2 在区间外；f 随 u 增大而减小，u=1 给最小值、u=−1 给最大值');
  };

  const PRE = [{ nm: '① θ=0', deg: 0 }, { nm: '② θ=90°', deg: 90 }, { nm: '③ θ=180°', deg: 180 }];
  const btns = PRE.map((o, i) => B.btn(o.nm, () => {
    st.deg = o.deg;
    sA.sync(st.deg);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  const sA = B.slider('θ (°)', 0, 360, 5, st.deg, v => { st.deg = v; B.render(); }, 'goa');

  B.handle({
    color: '#ffd166', r: 7,
    get: () => { const p = P(); return V(m.px(p.x), m.py(p.y)); },
    set: p => {
      const dx = (p.x - m.px(0)) / m.s, dy = (m.py(0) - p.y) / m.s;
      let d = Math.atan2(dy, dx / 2) * 180 / Math.PI;
      if (d < 0) d += 360;
      st.deg = Math.round(d) % 360;
      sA.sync(st.deg);
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动 P：椭圆上的点用 θ 定位，|PQ|² 化成 cosθ 的二次函数，右栏图象上当前 u 随 P 移动');
  B.render();
  return B;
}
