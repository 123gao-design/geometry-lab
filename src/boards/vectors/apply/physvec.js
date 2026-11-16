/* 图 应2 · 力的正交分解
   一个力 F 与 x 轴正方向成 θ 角，沿两个互相垂直的方向拆开：
   Fₓ=|F|cosθ，F_y=|F|sinθ，两支分力的箭头首尾相接仍回到 F 的终点。
   两个滑块分别调合力的大小与方向，蓝色、绿色分力与虚线矩形随之变形。 */
import { Board, V, fmt } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = new Board(root, W, H);
  const st = { mag: 5, deg: 30, grid: true, labs: true };
  const PRE = [
    { nm: '① 30°', mag: 5, deg: 30 },
    { nm: '② 45°', mag: 5, deg: 45 },
    { nm: '③ 60°', mag: 5, deg: 60 },
    { nm: '④ 90°', mag: 5, deg: 90 },
  ];
  const m = B.isoFit(-6.8, 6.8, -1.9, 6.7, [40, 30, 640, 380], 10);
  const cX = B.chipM('水平分力'), cY = B.chipM('竖直分力'), cF = B.chipM('合力'), cJ = B.chipM('判读');

  B.renderFn = () => {
    B.grid({ ...m, sx: 1, sy: 1, axLab: 'x', ayLab: 'y', grid: st.grid, labs: st.labs });
    const O = V(m.px(0), m.py(0));
    const th = st.deg * Math.PI / 180;
    const fx = st.mag * Math.cos(th), fy = st.mag * Math.sin(th);
    const T = V(m.px(fx), m.py(fy));
    const X = V(m.px(fx), m.py(0));
    const Y = V(m.px(0), m.py(fy));

    // 虚线矩形：两个分力把合力围成矩形
    B.seg(T, X, { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .75 });
    B.seg(T, Y, { stroke: '#8fa3bd', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .75 });
    // 分力
    if (Math.abs(fx) > 0.02) {
      B.arrow(O, X, { stroke: '#5cadff', 'stroke-width': 2.4, head: 12, wide: 5.5 });
      B.tex(V(X.x, X.y + 20), `$F_x$`, { size: 14, anchor: 'mid', color: '#5cadff', w: 40 });
    }
    if (Math.abs(fy) > 0.02) {
      B.arrow(O, Y, { stroke: '#4ade80', 'stroke-width': 2.4, head: 12, wide: 5.5 });
      B.tex(V(Y.x - 16, Y.y), `$F_y$`, { size: 14, anchor: 'end', color: '#4ade80', w: 40 });
    }
    // 合力
    B.arrow(O, T, { stroke: '#ffd166', 'stroke-width': 2.8, head: 14, wide: 6.5 });
    B.tex(V(T.x + 8, T.y - 12), '$\\vec F$', { size: 14, anchor: 'start', color: '#ffd166', w: 40 });
    // 夹角弧：从 x 轴正向扫到 F 的方向
    if (st.deg > 3) {
      const rr = Math.min(66, st.mag * m.s * 0.38);
      const N = 24;
      for (let i = 0; i < N; i++) {
        const a1 = th * i / N, a2 = th * (i + 1) / N;
        B.seg(V(O.x + rr * Math.cos(a1), O.y - rr * Math.sin(a1)),
          V(O.x + rr * Math.cos(a2), O.y - rr * Math.sin(a2)),
          { stroke: '#ff9e4a', 'stroke-width': 1.4, 'stroke-opacity': .85 });
      }
      const am = th / 2;
      B.tex(V(O.x + (rr + 18) * Math.cos(am), O.y - (rr + 18) * Math.sin(am)),
        `$\\theta=${st.deg}^\\circ$`, { size: 12, anchor: 'mid', color: '#ff9e4a', w: 80 });
    }
    B.dot(O, 3.4, { fill: '#e8eefc' });
    B.dot(T, 4, { fill: '#ffd166' });

    // 徽章
    cX(`$F_x=|\\vec F|\\cos\\theta=${fmt(st.mag, 1)}\\times${fmt(Math.cos(th), 2)}=${fmt(fx, 2)}$`);
    cY(`$F_y=|\\vec F|\\sin\\theta=${fmt(st.mag, 1)}\\times${fmt(Math.sin(th), 2)}=${fmt(fy, 2)}$`);
    const back = Math.hypot(fx, fy);
    cF(`$|\\vec F|=\\sqrt{F_x^2+F_y^2}=\\sqrt{${fmt(fx * fx, 2)}+${fmt(fy * fy, 2)}}=${fmt(back, 2)}$`);
    cJ(st.deg === 0 ? 'θ=0：合力全落在 x 轴正方向，竖直分力为零'
      : st.deg === 90 ? 'θ=90：合力全落在 y 轴正方向，水平分力为零'
        : st.deg === 180 ? 'θ=180：合力沿 x 轴负方向，水平分力取负'
          : st.deg < 90 ? 'θ 为锐角：两个分力都取正，各自沿坐标轴正方向'
            : 'θ 为钝角：水平分力反向取负，竖直分力仍取正');
  };

  const slM = B.slider('|F|', 1, 6, 0.5, st.mag, v => { st.mag = v; slM.sync(v); B.render(); }, 'mag');
  const slD = B.slider('θ (°)', 0, 180, 5, st.deg, v => { st.deg = v; slD.sync(v); B.render(); }, 'deg');

  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.mag = p.mag; st.deg = p.deg;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    slM.sync(p.mag); slD.sync(p.deg);
    B.render();
  }, { on: i === 0 }));
  B.graphToggles(st, ['grid', 'labs']);

  B.hint('拖动两个滑块：合力的大小与方向一变，两支分力与虚线矩形同时跟着变');
  B.render();
  return B;
}
