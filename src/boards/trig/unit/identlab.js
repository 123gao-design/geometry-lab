/* 图 U2 同角恒等验证机：平方关系 sin²α+cos²α=1 与商数关系 tan α=sin α/cos α；切线三角形 OAT 直译 1+tan²α=sec²α。
   左：单位圆直角三角形（斜边恒 1）+ 切线 x=1 上的三角形 OAT（OA=1、AT=tan、OT=sec）；右：高度恒满的堆叠条。 */
import { TrigLegendBoard, unitCoordinates } from '../trig-board.js';
import { angleReadings, numberTex } from './angle-readings.js';
import { mk, V, angDiff } from '../../../lib/board.js';

export function createBoard(root) {
  const B = new TrigLegendBoard(root, 860, 520, 90);
  root.classList.add('identity-board');
  const O = V(300, 258), R = 114, MAXT = 6 * Math.PI;
  const st = { a: Math.PI / 6, say: '', tline: true };
  let prev = angDiff(st.a, 0);

  const panel = angleReadings(B, '当前角 $\\alpha$', '角度与同角函数值');
  const cSin = panel.number('$\\sin\\alpha$', 'blue'), cCos = panel.number('$\\cos\\alpha$', 'orange');
  const cSin2 = panel.number('$\\sin^2\\alpha$', 'blue'), cCos2 = panel.number('$\\cos^2\\alpha$', 'orange');
  const cTan = panel.number('$\\tan\\alpha$', 'mint'), cSec = panel.number('$\\sec\\alpha$', 'orange');
  const cSum = B.readout('平方关系', 'blue'), cTS = B.readout('切线三角形', 'mint'), cSay = B.chipM('判读');

  const examples = [
    { name: '特殊角', formula: '$\\alpha=\\pi/6$', a: Math.PI / 6, say: '$1/4+3/4=1$。' },
    { name: '第二象限', formula: '$\\sin\\alpha=3/5$', a: Math.PI - Math.asin(.6), say: '第二象限，$\\cos\\alpha=-4/5$。' },
    { name: '第一象限', formula: '$\\sin\\alpha=3/5$', a: Math.asin(.6), say: '第一象限，$\\cos\\alpha=4/5$。' },
    { name: '由斜率求角', formula: '$\\tan\\alpha=2$', a: Math.atan(2), say: '直角边比 $2:1$，斜边长 $1$。' },
  ];
  B.choiceRow('选择例题', examples, () => examples.findIndex(p => Math.abs(p.a - st.a) < 1e-8),
    i => set(examples[i].a, examples[i].say));
  B.toggleBtn('切线三角形', true, v => { st.tline = v; B.render(); });

  function set(a, say) { st.a = a; st.say = say; prev = angDiff(a, 0); B.render(); }

  B.handle({
    get: () => V(O.x + R * Math.cos(st.a), O.y - R * Math.sin(st.a)),
    set: p => {
      const ang = Math.atan2(-(p.y - O.y), p.x - O.x);
      st.a = Math.max(-MAXT, Math.min(MAXT, st.a + angDiff(ang, prev)));
      prev = ang; st.say = '';
    },
    color: '#5cadff', r: 8, label: 'P', lo: [10, -10],
  });

  B.renderFn = () => {
    const a = st.a, { x, y } = unitCoordinates(a);
    const t = x !== 0 ? y / x : NaN; // tan α（cos α=0 时无意义）
    const P = V(O.x + R * x, O.y - R * y), M = V(P.x, O.y);
    // 坐标轴 + 单位圆
    B.seg(V(90, O.y), V(500, O.y), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    B.seg(V(O.x, 96), V(O.x, 448), { stroke: '#8fa3bd', 'stroke-width': 1.4 });
    mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.8 }, B.dyn);
    // 直角三角形 OMP：斜边 1、直角边 sin 与 cos
    mk('path', { d: `M${O.x},${O.y}L${M.x},${M.y}L${P.x},${P.y}Z`, fill: '#5cadff', 'fill-opacity': .07 }, B.dyn);
    B.seg(O, M, { stroke: '#ff9e4a', 'stroke-width': 3 });
    B.seg(M, P, { stroke: '#5cadff', 'stroke-width': 3 });
    B.seg(O, P, { stroke: '#ffd166', 'stroke-width': 2.4 });
    B.mark(M, '#ff9e4a');
    B.text(V(O.x - 14, O.y + 18), 'O');
    if (Math.abs(M.x - O.x) > 14) B.text(V(M.x, M.y + 18), 'M');
    B.note('横坐标 $x_P=\\cos\\alpha$', '#ff9e4a');
    B.note('纵坐标 $y_P=\\sin\\alpha$', '#5cadff');
    const A = V(O.x + R, O.y);
    if (st.tline) {
      B.text(V(A.x + 12, A.y + 18), 'A');
      B.seg(V(A.x, 25), V(A.x, 495), { stroke: '#93a1b5', 'stroke-dasharray': '4 4' });
    }
    if (st.tline && Number.isFinite(t)) {
      const T = V(A.x, O.y - R * t);
      if (T.y >= 22 && T.y <= 498) {
        mk('polygon', { points: [O,A,T].map(p => p.x + ',' + p.y).join(' '), fill: '#67e8f9', 'fill-opacity': .075 }, B.dyn);
        B.seg(O, T, { stroke: '#ff9e4a', 'stroke-width': 2 });
        B.seg(A, T, { stroke: '#67e8f9', 'stroke-width': 2.5 });
        B.mark(T, '#67e8f9');
        B.text(V(T.x + 10, T.y - 10), 'T');
      } else {
        const edge = T.y < 22 ? 22 : 498;
        B.arrow(O, V(O.x + (O.y - edge) / t, edge), { stroke: '#ff9e4a' });
        B.arrow(A, V(A.x, edge), { stroke: '#67e8f9' });
      }
      B.note('$AT=|\\tan\\alpha|$', '#67e8f9');
      B.note('$OT=|\\sec\\alpha|$', '#ff9e4a');
    }
    // 圆旁色条始终与圆心等高居中，下段 cos²、上段 sin²。
    const X0 = 594, Wb = 58, Hb = 224, Yb = O.y + Hb / 2;
    const labelSize = Math.max(15, Math.min(B.labelFontSize(), 23));
    const hCos = Hb * x * x, hSin = Hb * y * y;
    mk('rect', { x: X0, y: Yb - hCos, width: Wb, height: hCos, fill: '#ff9e4a', 'fill-opacity': .75 }, B.dyn);
    mk('rect', { x: X0, y: Yb - hCos - hSin, width: Wb, height: hSin, fill: '#5cadff', 'fill-opacity': .75 }, B.dyn);
    mk('rect', { x: X0, y: Yb - Hb, width: Wb, height: Hb, fill: 'none', stroke: '#93a1b5', 'stroke-width': 1.4 }, B.dyn);
    B.tex(V(X0 + Wb / 2, Yb - Hb - 23), '$1$', { anchor: 'mid', w: 36, size: labelSize });
    if (hSin > 18) B.tex(V(X0 + Wb + 12, Yb - hCos - hSin / 2), '$\\sin^2\\alpha$', { anchor: 'start', color: '#5cadff', w: 95, size: labelSize });
    if (hCos > 18) B.tex(V(X0 + Wb + 12, Yb - hCos / 2), '$\\cos^2\\alpha$', { anchor: 'start', color: '#ff9e4a', w: 95, size: labelSize });
    panel.angle(a);
    cSin(y); cCos(x); cSin2(y * y); cCos2(x * x);
    cTan(t); cSec(x === 0 ? NaN : 1 / x);
    cSum('$\\sin^2\\alpha+\\cos^2\\alpha=1$', 'ok');
    if (x !== 0) {
      cTS(`$1+\\tan^2\\alpha=\\sec^2\\alpha\\approx${numberTex(1 + t * t)}$`, 'ok');
    } else {
      cTS('终边所在直线平行于切线，交点 $T$ 不存在。', 'warn');
    }
    cSay(st.say || '两段色条的总高恒为 $1$。');
  };
  B.render();
  return B;
}
