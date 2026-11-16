/* 图 参1 · 参数方程与消参
   参数方程把点的横纵坐标分别写成同一个参数 t 的函数：t 每取一个值，给出一枚点，走遍定义域连成曲线。
   三种常见曲线：直线 x=1+t、y=2t−1；圆 x=2cos t、y=2sin t；抛物线 x=t²、y=2t。
   拖动 P 沿曲线走，金色实线是已经走过的轨迹，浅色是整条曲线；徽章给出参数方程、普通方程与当前点。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { mode: 'line', t: 1, grid: true, labs: true };
  const m = B.isoFit(-4.4, 4.4, -3.3, 3.3, [44, 30, 780, 390], 10);
  const cE = B.chipM('参数方程'), cN = B.chipM('普通方程'), cP = B.chipM('点 M'), cJ = B.chipM('判读');
  const fz = v => fmt(Math.abs(v) < 5e-3 ? 0 : v, 2);
  const RANGE = { line: [-4, 4], circle: [0, 2 * Math.PI], para: [-3, 3] };
  const START = { line: -4, circle: 0, para: -3 };

  const pt = t => st.mode === 'line' ? V(1 + t, 2 * t - 1)
    : st.mode === 'circle' ? V(2 * Math.cos(t), 2 * Math.sin(t))
      : V(t * t, 2 * t);

  const path = (a, b, at) => {
    const N = 80;
    for (let i = 0; i < N; i++) {
      const t1 = a + (b - a) * i / N, t2 = a + (b - a) * (i + 1) / N;
      const p1 = pt(t1), p2 = pt(t2);
      B.seg(V(m.px(p1.x), m.py(p1.y)), V(m.px(p2.x), m.py(p2.y)), at);
    }
  };

  B.renderFn = () => {
    B.grid({ ...m, grid: st.grid, labs: st.labs, sx: 1, sy: 1 });
    const [a, b] = RANGE[st.mode];
    path(a, b, { stroke: '#ffd166', 'stroke-width': 1.5, 'stroke-opacity': .28 });
    path(START[st.mode], st.t, { stroke: '#ffd166', 'stroke-width': 2.6, 'stroke-opacity': .95 });

    const P = pt(st.t);
    const Pp = V(m.px(P.x), m.py(P.y));
    B.dot(Pp, 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.2 });
    B.text(V(Pp.x + 10, Pp.y - 12), 'M', { 'font-size': 13, 'font-weight': 700, fill: '#ffd166' });
    B.tex(V(Pp.x + 10, Pp.y + 18),
      st.mode === 'circle' ? `$t=${Math.round(st.t * 180 / Math.PI)}^\\circ$` : `$t=${fz(st.t)}$`,
      { size: 12, anchor: 'start', color: '#ff9e4a', w: 100 });

    const tc = st.mode === 'circle' ? `t=${Math.round(st.t * 180 / Math.PI)}^\\circ` : `t=${fz(st.t)}`;
    cE(st.mode === 'line' ? `$x=1+t,\\quad y=2t-1\\quad(t\\in\\mathbb{R})$`
      : st.mode === 'circle' ? `$x=2\\cos t,\\quad y=2\\sin t\\quad(t\\in[0,2\\pi))$`
        : `$x=t^2,\\quad y=2t\\quad(t\\in\\mathbb{R})$`);
    cN(st.mode === 'line' ? '$y=2x-3$'
      : st.mode === 'circle' ? '$x^2+y^2=4$' : '$y^2=4x$');
    cP(`$${tc},\\quad M(${fz(P.x)},\\ ${fz(P.y)})$`);
    if (st.mode === 'line') {
      cJ('由 $x=1+t$ 解出 $t=x-1$，代入 $y=2t-1$ 得 $y=2x-3$；$t$ 每取一值给出直线上一点，$t$ 增大时点沿方向 $(1,2)$ 前进');
    } else if (st.mode === 'circle') {
      cJ('两式平方相加消去 $t$，得 $x^2+y^2=4$；$t$ 是圆周上的圆心角，转满 $2\\pi$ 回到原处');
    } else {
      cJ('由 $y=2t$ 得 $t=y/2$，代入 $x=t^2$ 得 $y^2=4x$；$x=t^2\\ge0$，整条曲线只落在右半平面');
    }
  };

  const MODES = [
    { key: 'line', nm: '① 直线' }, { key: 'circle', nm: '② 圆' }, { key: 'para', nm: '③ 抛物线' },
  ];
  const btns = MODES.map((o, i) => B.btn(o.nm, () => {
    st.mode = o.key;
    st.t = o.key === 'line' ? 1 : o.key === 'circle' ? Math.PI / 4 : 1;
    btns.forEach((b2, j) => b2.classList.toggle('on', j === i));
    syncSliders();
    B.render();
  }, { on: i === 0 }));

  const sT = B.slider('t', -4, 4, 0.1, st.t, v => { st.t = v; B.render(); }, 'pt');
  const sA = B.slider('θ (°)', 0, 360, 5, 45, v => { st.t = v * Math.PI / 180; B.render(); }, 'pth');
  const syncSliders = () => {
    const circ = st.mode === 'circle';
    if (sT.parentNode) sT.parentNode.style.display = circ ? 'none' : '';
    if (sA.parentNode) sA.parentNode.style.display = circ ? '' : 'none';
    if (circ) sA.sync(Math.round(st.t * 180 / Math.PI));
    else sT.sync(st.t);
  };
  syncSliders();

  B.handle({
    color: '#ffd166', r: 7,
    get: () => { const p = pt(st.t); return V(m.px(p.x), m.py(p.y)); },
    set: p => {
      const dx = (p.x - m.px(0)) / m.s, dy = (m.py(0) - p.y) / m.s;
      if (st.mode === 'line') {
        st.t = Math.max(-4, Math.min(4, dx - 1));
        sT.sync(st.t);
      } else if (st.mode === 'circle') {
        let d = Math.atan2(dy, dx) * 180 / Math.PI;
        if (d < 0) d += 360;
        st.t = d * Math.PI / 180;
        sA.sync(Math.round(d));
      } else {
        st.t = Math.max(-3, Math.min(3, dy / 2));
        sT.sync(st.t);
      }
    },
  });

  B.graphToggles(st, ['grid', 'labs']);
  B.hint('拖动 M：参数 t 每取一个值就得到曲线上的一个点，t 走遍定义域，点连成整条曲线');
  B.render();
  return B;
}
