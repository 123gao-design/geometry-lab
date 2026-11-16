/* 图 线1 · 第一类曲线积分机（对弧长）
   曲线 C 是四分之一圆弧 x²+y²=R²（x≥0, y≥0），线密度 ρ(x,y)=1+y：越靠上越重。
   第一类曲线积分把曲线切成小弧段、用密度乘弧长再累加，所以
   M=∫_C ρ ds，它与曲线的走向无关（左右两向读同一个数）。
   左图：弧上一点 P 附近的橙色小弧段就是 ds；右图：把 ρ 沿弧长 s 画成曲线，阴影面积即总量。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { R: 1.5, t: 35, dir: 1 };
  const cP = B.chipM('点 $P$'), cS = B.chipM('弧长元 $\\Delta s$'), cRho = B.chipM('$\\rho(P)$'), cM = B.chipM('总量 $\\int_C\\rho\\,ds$');
  const mL = B.isoFit(-0.4, 2.1, -0.4, 2.1, [30, 22, 440, 392], 20);
  const mR = B.mapFit(0, 3.1, 0, 3.0, [520, 64, 272, 296], 22);

  const arcPt = (R, t) => V(mL.px(R * Math.cos(t)), mL.py(R * Math.sin(t)));

  B.renderFn = () => {
    const R = st.R, t = st.t * Math.PI / 180, dt = 8 * Math.PI / 180;
    B.grid({ ...mL, sx: 0.5, sy: 0.5, lx: 0.5, ly: 0.5 });

    // 整条弧
    const pts = [];
    for (let i = 0; i <= 120; i++) pts.push(arcPt(R, Math.PI / 2 * i / 120));
    for (let i = 1; i < pts.length; i++) B.seg(pts[i - 1], pts[i], { stroke: '#5cadff', 'stroke-width': 2.8 });

    // 密度沿弧的取样点：越重越亮
    for (let i = 0; i <= 18; i++) {
      const tt = Math.PI / 2 * i / 18, rho = 1 + R * Math.sin(tt);
      B.dot(arcPt(R, tt), 3.4, { fill: '#ff9e4a', 'fill-opacity': (0.25 + 0.6 * (rho - 1) / (R)).toFixed(2), stroke: 'none' });
    }

    // P 附近的弧段 ds
    const pa = arcPt(R, t), pb = arcPt(R, Math.min(t + dt, Math.PI / 2));
    B.seg(pa, pb, { stroke: '#ffd166', 'stroke-width': 5.5, 'stroke-opacity': .95 });
    B.seg(V(mL.px(0), mL.py(0)), pa, { stroke: '#93a1b5', 'stroke-width': 1.1, 'stroke-dasharray': '5 4', 'stroke-opacity': .8 });
    B.dot(pa, 5.5, { fill: '#ff9e4a', stroke: '#0a0d14', 'stroke-width': 1.4 });
    B.tex(V(pa.x + 8, pa.y - 14), '$P$', { size: 13, color: '#ff9e4a', w: 22 });
    B.tex(V(pa.x + 10, pa.y + 6), '$\\rho=1+y$', { size: 11.5, color: '#ff9e4a', w: 92 });

    // 走向箭头（第一类积分与走向无关，只标出方向作对照）
    const am = arcPt(R, Math.PI / 4);
    const an = arcPt(R, Math.PI / 4 + 0.06);
    if (st.dir > 0) B.arrow(am, an, { stroke: '#4ade80', 'stroke-width': 1.6, head: 10, wide: 5 });
    else B.arrow(an, am, { stroke: '#4ade80', 'stroke-width': 1.6, head: 10, wide: 5 });
    B.tex(V(mL.px(R * 0.86), mL.py(R * 0.86) - 18), st.dir > 0 ? '反向走' : '正向走', { size: 11, color: '#4ade80', w: 62 });

    const rho = 1 + R * Math.sin(t);
    const ds = R * dt;
    const total = Math.PI * R / 2 + R * R;

    // 右栏：ρ 随弧长 s 变化，阴影面积即总量
    B.grid({ ...mR, sx: 0.5, sy: 0.5, lx: 0.5, ly: 0.5, axLab: 's', ayLab: 'ρ' });
    const area = [];
    const N = 90;
    for (let i = 0; i <= N; i++) {
      const s = Math.PI * R / 2 * i / N;
      area.push(V(mR.px(s), mR.py(1 + R * Math.sin(s / R))));
    }
    const poly = [...area, V(mR.px(Math.PI * R / 2), mR.py(0)), V(mR.px(0), mR.py(0))];
    mk('polygon', { points: poly.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '), fill: '#ff9e4a', 'fill-opacity': .2, stroke: 'none' }, B.dyn);
    for (let i = 1; i < area.length; i++) B.seg(area[i - 1], area[i], { stroke: '#ff9e4a', 'stroke-width': 2.2 });
    B.seg(V(mR.px(0), mR.py(0)), V(mR.px(Math.PI * R / 2), mR.py(0)), { stroke: '#8fa3bd', 'stroke-width': 1.2 });
    B.dot(V(mR.px(R * t), mR.py(rho)), 5, { fill: '#ffd166', stroke: '#0a0d14', 'stroke-width': 1.3 });
    B.tex(V(mR.px(R * t) + 8, mR.py(rho) - 12), '$\\rho(P)$', { size: 11.5, color: '#ffd166', w: 60 });

    cP(`$(${fmt(R * Math.cos(t), 2)},\\ ${fmt(R * Math.sin(t), 2)})$`);
    cS(`$${fmt(ds, 3)}$`);
    cRho(`$${fmt(rho, 3)}$`);
    cM(`$\\int_C(1+y)\\,ds=${fmt(total, 3)}$`, 'ok');
  };

  B.slider('圆弧半径 R', 1, 1.8, 0.02, st.R, v => { st.R = v; B.render(); }, 'R');
  B.slider('点 P 的位置角', 0, 82, 1, st.t, v => { st.t = v; B.render(); }, 'th');
  B.btn('换走向（读数不变）', () => { st.dir = -st.dir; B.render(); });
  B.hintM('拖 P：橙色小弧段就是 $ds$，右栏阴影面积累加到 $P$ 处正好是这一段的质量');
  B.render();
  return B;
}
