/* 图 4 · 以实割线的调和共轭点采样极线 */
import { V, add, sub, mul, len, fmt } from '../../../lib/board.js';
import { EPS, projectiveCrossRatio, unitPolar } from '../../../lib/projective/homogeneous.js';
import { blue, gold, guide, ink, lineStyle, createDiagram, drawEllipse, drawLine, mark, toCanvas, toLocal, visible } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = createDiagram(root, 720, 420, '拖动极点和割线方向，或单击开始扫描');
  const frame = { cx: 300, cy: 206, a: 132, b: 132 };
  const origin = V(frame.cx, frame.cy);
  let P = toCanvas(frame, [.7, .15, 1]), angle = .18, show = false;
  let trail = [];
  function stop() { B.cancelRaf(); }
  const direction = () => V(Math.cos(angle), -Math.sin(angle));
  B.handle({ get: () => P, set: p => { stop(); trail = []; P = p; }, color: ink, label: 'P', lo: [12, 20] });
  B.handle({ get: () => add(P, mul(direction(), 56)), set: p => {
    stop();
    const d = sub(p, P);
    if (len(d) > 10) angle = Math.atan2(-d.y, d.x);
  }, color: guide, thin: true });
  B.btn('开始扫描', () => {
    stop();
    trail = [];
    const from = angle;
    let start;
    let nextSample = 0;
    function tick(now) {
      start ??= now;
      const motion = Math.min(1, (now - start) / 3200);
      angle = from + Math.PI * motion;
      if (motion >= nextSample) {
        const g = geometry();
        const point = g && toCanvas(frame, g.harmonic);
        if (visible(B, point, 6)) trail.push(point);
        nextSample = motion + .028;
      }
      B.render();
      if (motion < 1) B.raf(tick);
      else stop();
    }
    B.raf(tick);
  }, { pri: true });
  B.btn('清除轨迹', () => { stop(); trail = []; B.render(); });
  B.btn('圆外点', () => { stop(); trail = []; angle = .18; P = toCanvas(frame, [1.55, .32, 1]); B.render(); });
  B.btn('圆心', () => { stop(); trail = []; P = origin; B.render(); });
  B.btn('复位', () => { stop(); trail = []; angle = .18; P = toCanvas(frame, [.7, .15, 1]); B.render(); });
  B.toggleBtn('显示理论极线', show, v => { show = v; B.render(); });
  const read = B.chipM("$(U,V;P,P')$"), scale = B.chipM("$d d'/r^2$"), state = B.chip('当前构造');

  function geometry() {
    const [x, y] = toLocal(frame, P), u = Math.cos(angle), v = Math.sin(angle);
    const projection = x * u + y * v, level = x * x + y * y - 1;
    const discriminant = projection * projection - level;
    if (discriminant <= EPS || Math.abs(level) <= EPS) return null;
    const t = -projection - Math.sqrt(discriminant), s = -projection + Math.sqrt(discriminant);
    // 以 P 为割线参数原点，调和共轭的参数是 2ts/(t+s)，允许分母为 0。
    const w = t + s, k = 2 * t * s;
    return { t, s, harmonic: [x * w + k * u, y * w + k * v, w], parameter: [k, w] };
  }

  B.renderFn = () => {
    const point = toLocal(frame, P), [x, y] = point;
    const d = Math.hypot(x, y), p = unitPolar(point);
    drawEllipse(B, frame);
    mark(B, origin, 'O', guide, -13, 17);
    const handle = add(P, mul(direction(), 56));
    B.inf(P, handle, lineStyle(guide, 1.2, '6 7'));
    B.seg(P, handle, lineStyle(guide, 2));
    if (show) {
      drawLine(B, frame, p, lineStyle(blue, 2.4, '8 5'), 'p');
      if (d > EPS) {
        const foot = toCanvas(frame, [x / (d * d), y / (d * d), 1]);
        B.seg(origin, foot, { ...lineStyle(blue, 1.3, '3 6'), opacity: .65 });
        mark(B, foot, 'P*', blue, 13, 20);
        scale(fmt(len(sub(P, origin)) * len(sub(foot, origin)) / (frame.a * frame.a), 3), 'ok');
      } else scale('圆心的极线在无穷远');
    } else scale('显示理论极线后读数');
    trail.forEach(p => B.dot(p, 2.4, { fill: gold, opacity: .66 }));
    const geometryOnLine = geometry();
    if (!geometryOnLine) {
      state(Math.abs(d - 1) < EPS ? 'P 在圆上 · 极线是切线' : '本方向没有两个不同的实交点');
      read('—');
      return;
    }
    const { t, s, harmonic, parameter } = geometryOnLine;
    mark(B, add(P, mul(direction(), t * frame.a)), 'U', guide, -14, -12);
    mark(B, add(P, mul(direction(), s * frame.a)), 'V', guide);
    const conjugate = toCanvas(frame, harmonic);
    mark(B, conjugate, 'P′', gold, 12, -14);
    state(!conjugate ? 'P′ 在无穷远' : visible(B, conjugate, 6) ? 'P′ 在视窗内' : 'P′ 在视窗外');
    const cr = projectiveCrossRatio([t, 1], [s, 1], [0, 1], parameter);
    read(cr == null ? '—' : fmt(cr, 3), cr == null ? '' : 'ok');
  };
  B.render();
  return B;
}
