/* 图 参3 · 圆锥曲线的参数方程
   椭圆：x=a cosθ，y=b sinθ（θ 是离心角，不是极角）。
   双曲线：x=a secθ，y=b tanθ（θ≠90°、270°，两支由 θ 的象限分开）。
   抛物线：x=2pt²，y=2pt（t 可取负，上下两支合成整条抛物线）。
   拖动 P 沿曲线走，三种曲线共用一套「参数每取一值给一点」的读法。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { mode: 'ellipse', a: 2, b: 1, p: 1, deg: 45, t: 1, grid: true, labs: true };
  const m = B.isoFit(-4.2, 4.2, -3.2, 3.2, [44, 30, 780, 390], 10);
  const cE = B.chipM('参数方程'), cN = B.chipM('普通方程'), cP = B.chipM('点 M'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const th = () => st.deg * Math.PI / 180;
  const hyperOK = () => Math.abs(Math.cos(th())) > 0.2;

  const P = () => {
    if (st.mode === 'ellipse') return V(st.a * Math.cos(th()), st.b * Math.sin(th()));
    if (st.mode === 'hyperbola') {
      if (!hyperOK()) return st.lastP || V(st.a, st.b);
      const p = V(st.a / Math.cos(th()), st.b * Math.tan(th()));
      st.lastP = p;
      return p;
    }
    return V(2 * st.p * st.t * st.t, 2 * st.p * st.t);
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    if (st.mode === 'ellipse') {
      const N = 96;
      for (let i = 0; i < N; i++) {
        const a1 = 2 * Math.PI * i / N, a2 = 2 * Math.PI * (i + 1) / N;
        B.seg(V(m.px(st.a * Math.cos(a1)), m.py(st.b * Math.sin(a1))),
          V(m.px(st.a * Math.cos(a2)), m.py(st.b * Math.sin(a2))),
          { stroke: '#ffd166', 'stroke-width': 2.4, 'stroke-opacity': .95 });
      }
    } else if (st.mode === 'hyperbola') {
      for (const sgn of [1, -1]) {
        const N = 60;
        for (let i = 0; i < N; i++) {
          const u1 = -1.38 + 2.76 * i / N, u2 = -1.38 + 2.76 * (i + 1) / N;
          const x1 = sgn * st.a / Math.cos(u1), y1 = st.b * Math.tan(u1);
          const x2 = sgn * st.a / Math.cos(u2), y2 = st.b * Math.tan(u2);
          B.seg(V(m.px(x1), m.py(y1)), V(m.px(x2), m.py(y2)),
            { stroke: '#ffd166', 'stroke-width': 2.2, 'stroke-opacity': .9 });
        }
      }
      for (const sgn of [1, -1]) {
        B.seg(V(m.px(-4), m.py(sgn * (-4) * st.b / st.a)), V(m.px(4), m.py(sgn * 4 * st.b / st.a)),
          { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-opacity': .45, 'stroke-dasharray': '6 5' });
      }
    } else {
      const N = 80;
      for (let i = 0; i < N; i++) {
        const t1 = -1.7 + 3.4 * i / N, t2 = -1.7 + 3.4 * (i + 1) / N;
        B.seg(V(m.px(2 * st.p * t1 * t1), m.py(2 * st.p * t1)),
          V(m.px(2 * st.p * t2 * t2), m.py(2 * st.p * t2)),
          { stroke: '#ffd166', 'stroke-width': 2.2, 'stroke-opacity': .9 });
      }
    }

    const Pw = P(), Pp = V(m.px(Pw.x), m.py(Pw.y));
    const showP = st.mode !== 'hyperbola' || hyperOK();
    if (showP) {
      B.arrow(V(m.px(0), m.py(0)), Pp, { stroke: '#5cadff', 'stroke-width': 1.4, 'stroke-opacity': .55, 'stroke-dasharray': '5 5' });
      B.dot(Pp, 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
      B.text(V(Pp.x + 10, Pp.y - 12), 'M', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });
    }

    const par = st.mode === 'para';
    cE(st.mode === 'ellipse' ? `$x=${fz(st.a)}\\cos\\theta,\\quad y=${fz(st.b)}\\sin\\theta$`
      : st.mode === 'hyperbola' ? `$x=${fz(st.a)}\\sec\\theta,\\quad y=${fz(st.b)}\\tan\\theta$`
        : `$x=${fz(2 * st.p)}t^2,\\quad y=${fz(2 * st.p)}t$`);
    cN(st.mode === 'ellipse' ? `$\\dfrac{x^2}{${fz(st.a * st.a)}}+\\dfrac{y^2}{${fz(st.b * st.b)}}=1$`
      : st.mode === 'hyperbola' ? `$\\dfrac{x^2}{${fz(st.a * st.a)}}-\\dfrac{y^2}{${fz(st.b * st.b)}}=1$`
        : `$y^2=${fz(2 * st.p)}x$`);
    cP(st.mode === 'hyperbola' && !hyperOK() ? `$\\theta=${st.deg}^\\circ$：点不存在`
      : par ? `$t=${fz(st.t)},\\quad M(${fz(Pw.x)},\\ ${fz(Pw.y)})$`
        : `$\\theta=${st.deg}^\\circ,\\quad M(${fz(Pw.x)},\\ ${fz(Pw.y)})$`);
    if (st.mode === 'ellipse') {
      cJ('θ 是离心角：x 的系数 a 与 y 的系数 b 分别管横向、纵向的伸缩；θ 从 0 到 360° 走一圈，椭圆闭合');
    } else if (st.mode === 'hyperbola') {
      cJ(hyperOK()
        ? `$\\theta$ 在 $(-90^\\circ,90^\\circ)$ 时 P 在右支，在 $(90^\\circ,270^\\circ)$ 时在左支；越接近 $90^\\circ$，P 越沿渐近线远去`
        : `$\\theta=${st.deg}^\\circ$ 时 $\\cos\\theta=0$，$\\sec\\theta$ 与 $\\tan\\theta$ 都无定义，曲线上没有这一点`);
    } else {
      cJ('$t$ 可取负：$t>0$ 在上支，$t<0$ 在下支，$t=0$ 即顶点；$x=2pt^2\\ge0$，曲线开口向右');
    }
  };

  const sA = B.slider('a', 0.8, 2.5, 0.1, st.a, v => { st.a = v; B.render(); }, 'pca');
  const sB = B.slider('b', 0.4, 2, 0.1, st.b, v => { st.b = v; B.render(); }, 'pcb');
  const sP = B.slider('p', 0.4, 2, 0.1, st.p, v => { st.p = v; B.render(); }, 'pcp');
  const sTh = B.slider('θ (°)', 0, 355, 5, st.deg, v => { st.deg = v; B.render(); }, 'pcth');
  const sT = B.slider('t', -1.8, 1.8, 0.1, st.t, v => { st.t = v; B.render(); }, 'pctt');

  const vis = () => {
    const par = st.mode === 'para';
    const set = (s, on) => { if (s.parentNode) s.parentNode.style.display = on ? '' : 'none'; };
    set(sA, !par); set(sB, !par); set(sP, par); set(sTh, !par); set(sT, par);
  };

  const MODES = [
    { key: 'ellipse', nm: '① 椭圆' }, { key: 'hyperbola', nm: '② 双曲线' }, { key: 'para', nm: '③ 抛物线' },
  ];
  const btns = MODES.map((o, i) => B.btn(o.nm, () => {
    st.mode = o.key;
    if (o.key === 'hyperbola' && !hyperOK()) st.deg = 45;
    if (o.key === 'para') st.t = 1;
    st.lastP = null;
    vis(); sTh.sync(st.deg); sT.sync(st.t);
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 0 }));
  vis();

  B.handle({
    color: '#ffd166', r: 7,
    get: () => { const p = P(); return V(m.px(p.x), m.py(p.y)); },
    set: p => {
      const dx = (p.x - m.px(0)) / m.s, dy = (m.py(0) - p.y) / m.s;
      if (st.mode === 'ellipse') {
        let d = Math.atan2(dy / st.b, dx / st.a) * 180 / Math.PI;
        if (d < 0) d += 360;
        st.deg = Math.round(d) % 360;
        sTh.sync(st.deg);
      } else if (st.mode === 'hyperbola') {
        let d = Math.atan2(dy / st.b, dx / st.a) * 180 / Math.PI;
        if (d < 0) d += 360;
        if (Math.abs(Math.cos(d * Math.PI / 180)) > 0.3) {
          st.deg = Math.round(d) % 360;
          sTh.sync(st.deg);
        }
      } else {
        st.t = Math.max(-1.8, Math.min(1.8, dy / (2 * st.p)));
        sT.sync(st.t);
      }
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动 M：椭圆用离心角、双曲线用 sec 与 tan、抛物线用 t，三种参数各走各的，都是「一个参数定一点」');
  B.render();
  return B;
}
