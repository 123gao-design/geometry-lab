/* 图 W1 正弦滚动展开机：左单位圆、右坐标纸，两幅共用同一比例尺（圆半径 = 纸的比例尺）——
   拖 P 或 ⏵ 滚动，纵坐标 MP 沿水平金虚线被逐点「摊」到右纸上，(α, sin α) 连成正弦波。
   五点法骨架：五点一档「升、峰、降、谷、升」；网格/标注/五点三开关。 */
import { TrigLegendBoard, angleTex, piTick } from '../trig-board.js';
import { mk, V, fmt, TAU } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 860, 390);
  // 右幅先取景：x∈[0,2π]、y∈[−1.7,1.7]；左圆半径 R=比例尺、圆心与纸的零线等高 → P 与曲线上点恒等高
  const m = B.isoFit(0, TAU, -1.7, 1.7, [320, 36, 500, 318]);
  const R = m.s, O = V(150, m.py(0));
  const st = { a: Math.PI / 6, anim: false, five: true, grid: true, labs: true };

  const cA = B.readout('转角', 'gold'), cS = B.readout('$\\sin\\alpha$', 'blue'), cF = B.chipM('五点判读');
  const play = B.btn('⏵ 滚动', () => { st.anim = !st.anim; if (st.anim) tick(); else B.render(); });
  function tick() {
    if (!st.anim) return;
    st.a += 0.013;
    if (st.a > TAU) st.a -= TAU;
    B.render();
    B.raf(tick);
  }
  B.toggleBtn('五点', true, v => { st.five = v; B.render(); });
  B.graphToggles(st, ['grid', 'labs']);
  B.angleRow([0, 30, 60, 90, 180, 270, 360], () => st.a, v => { st.a = v; st.anim = false; B.render(); });

  B.handle({
    get: () => V(O.x + R * Math.cos(st.a), O.y - R * Math.sin(st.a)),
    set: p => {
      const ang = Math.atan2(-(p.y - O.y), p.x - O.x);
      st.a = ((ang % TAU) + TAU) % TAU;   // 展开只讲 [0,2π] 一圈
      st.anim = false;
    },
    color: '#5cadff', r: 8, label: 'P', lo: [10, -10],
  });

  B.renderFn = () => {
    play.classList.toggle('on', st.anim);
    const a = st.a, sy = Math.sin(a);
    // ── 左：单位圆 + 半径 OP + 纵坐标 MP + 角 α 标记弧
    B.seg(V(30, O.y), V(305, O.y), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    B.seg(V(O.x, O.y - R - 26), V(O.x, O.y + R + 26), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.8 }, B.dyn);
    const P = V(O.x + R * Math.cos(a), O.y - R * sy), Mp = V(P.x, O.y);
    if (a === TAU) mk('circle', { cx: O.x, cy: O.y, r: 26, fill: 'none', stroke: '#5c6a80' }, B.dyn);
    else mk('path', { d: `M${O.x + 26},${O.y} A26,26 0 ${a > Math.PI ? 1 : 0} 0 ${(O.x + 26 * Math.cos(a)).toFixed(1)},${(O.y - 26 * sy).toFixed(1)}`,
      fill: 'none', stroke: '#5c6a80', 'stroke-width': 1.4 }, B.dyn);
    B.text(V(O.x + 42 * Math.cos(a / 2), O.y - 42 * Math.sin(a / 2)), 'α', { 'font-size': 13, fill: '#93a1b5' });
    B.seg(O, P, { stroke: '#ffd166', 'stroke-width': 2.4 });
    B.seg(Mp, P, { stroke: '#5cadff', 'stroke-width': 3 });
    B.note('纵坐标 $y_P=\\sin\\alpha$', '#5cadff');
    // ── 右：网格 + π 刻度（grid 印不了 π，自绘）+ 曲线
    B.grid({ ...m, sx: Math.PI / 2, sy: 0.5, ly: 0.5, xt: [], grid: st.grid, labs: st.labs });
    if (st.labs) for (let k = 0; k <= 4; k++)
      B.text(V(m.px(k * Math.PI / 2), m.py(0) + 15), piTick(k * Math.PI / 2), { 'font-size': 11, fill: '#5c6a80' });
    const anchors = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2, TAU];
    B.plot(Math.sin, m, { x0: 0, x1: TAU, anchors, stroke: '#93a1b5', 'stroke-dasharray': '5 4' });
    B.plot(Math.sin, m, { x0: 0, x1: a, anchors, stroke: '#ffd166', 'stroke-width': 2.6, step: TAU / 320 });
    if (st.five) for (let k = 0; k <= 4; k++) {                          // 五点骨架
      const fx = k * Math.PI / 2, fy = Math.sin(fx);
      B.seg(V(m.px(fx), m.py(0)), V(m.px(fx), m.py(fy)), { stroke: '#93a1b5', 'stroke-width': 1, 'stroke-dasharray': '3 4' });
      B.mark(V(m.px(fx), m.py(fy)), '#ffd166');
      if (st.labs && Math.abs(fy) > .5) B.text(V(m.px(fx), m.py(fy) + (fy > 0.5 ? -12 : fy < -0.5 ? 18 : 16)),
        `(${piTick(fx)}, ${fy > 0.5 ? '1' : fy < -0.5 ? '-1' : '0'})`, { 'font-size': 11, fill: '#5c6a80', 'text-anchor': 'middle' });
    }
    B.note('$y=\\sin x$', '#ffd166');
    // 摊平连线：P 与曲线上点 (α, sin α) 恒等高（左右幅共用比例尺）
    const Q = V(m.px(a), m.py(sy));
    B.seg(P, Q, { stroke: '#ffd166', 'stroke-width': 1.2, 'stroke-dasharray': '4 4', 'stroke-opacity': .85 });
    B.mark(Q, '#ffd166');
    // chips
    cA(`$${angleTex(a)}\\,\\mathrm{rad}$，$${fmt(a * 180 / Math.PI, 1)}^\\circ$`);
    cS(`$\\sin\\alpha=${fmt(sy, 3)}$`);
    cF(a <= Math.PI / 2 ? '从原点上升，到 $x=\\pi/2$ 时达到波峰 $(\\pi/2,1)$。'
      : a <= Math.PI ? '从波峰下降，到 $x=\\pi$ 时经过零点 $(\\pi,0)$。'
      : a <= 3 * Math.PI / 2 ? '从零点继续下降，到 $x=3\\pi/2$ 时达到波谷 $(3\\pi/2,-1)$。'
      : '从波谷上升，到 $x=2\\pi$ 时回到零点 $(2\\pi,0)$。');
  };
  B.render();
  return B;
}
