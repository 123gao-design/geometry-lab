/* 图 8b · 在同一仿射窗口中比较三种配极 */
import { fmt, mk, V } from '../../../lib/board.js';
import { atInfinity, dot3, infinityLine, normalize } from '../../../lib/projective/homogeneous.js';
import { blue, conicStyle, createDiagram, drawEllipse, drawLine, gold, guide, lineStyle, toCanvas, toLocal, mark } from '../../../lib/projective/diagram.js';

const CONICS = {
  ellipse: {
    name: '椭圆', equation: 'x²/4 + y² = 1', example: [3, 1, 1],
    on: [2, 0, 1], direction: [2, 1, 0], poleOfInfinity: [0, 0, 1],
    matrix: [[.25, 0, 0], [0, 1, 0], [0, 0, -1]],
  },
  hyperbola: {
    name: '双曲线', equation: 'x²/4 − y² = 1', example: [3, 1, 1],
    on: [2, 0, 1], direction: [2, 1, 0], poleOfInfinity: [0, 0, 1],
    matrix: [[.25, 0, 0], [0, -1, 0], [0, 0, -1]],
  },
  parabola: {
    name: '抛物线', equation: 'y² = 2x', example: [1, 2, 1],
    on: [0, 0, 1], direction: [1, 0, 0], poleOfInfinity: [1, 0, 0],
    matrix: [[0, 0, -1], [0, 1, 0], [-1, 0, 0]],
  },
};

export function createBoard(root) {
  const B = createDiagram(root, 720, 420, '切换圆锥曲线与极点，比较齐次坐标下的极线');
  const frame = { cx: 344, cy: 214, a: 72, b: 72 };
  let kind = 'ellipse', P = CONICS[kind].example;
  const handle = B.handle({ get: () => toCanvas(frame, P) || V(frame.cx, frame.cy),
    set: p => { P = toLocal(frame, p); }, color: gold });
  function setPoint(point) { P = point; B.render(); }
  const buttons = Object.entries(CONICS).map(([key, c]) => [key, B.btn(c.name, () => {
    kind = key;
    setPoint(c.example);
  })]);
  B.btn('曲线上', () => setPoint(CONICS[kind].on));
  B.btn('无穷远点', () => setPoint(CONICS[kind].direction));
  B.btn('取无穷远直线的极点', () => setPoint(CONICS[kind].poleOfInfinity));
  const curve = B.chip('曲线'), pt = B.chip('P'), line = B.chip('p 的系数 (a,b,c)'), meaning = B.chip('几何含义');

  function path(points) {
    const d = points.map((p, i) => {
      const { x, y } = toCanvas(frame, p);
      return `${i ? 'L' : 'M'}${fmt(x, 2)},${fmt(y, 2)}`;
    }).join(' ');
    mk('path', { d, ...conicStyle, fill: 'none' }, B.dyn);
  }

  B.renderFn = () => {
    for (const [key, button] of buttons) {
      button.classList.toggle('on', kind === key);
      button.setAttribute('aria-pressed', String(kind === key));
    }
    const axis = { ...lineStyle(guide, 1), opacity: .5 };
    drawLine(B, frame, [1, 0, 0], axis);
    drawLine(B, frame, [0, 1, 0], axis);
    B.text(V(frame.cx + 16, 25), 'y', { fill: guide });
    B.text(V(B.w - 21, frame.cy - 13), 'x', { fill: guide });
    for (const x of [-4, -3, -2, -1, 1, 2, 3, 4]) {
      const X = frame.cx + x * frame.a;
      B.seg(V(X, frame.cy - 4), V(X, frame.cy + 4), axis);
    }
    for (const y of [-2, -1, 1, 2]) {
      const Y = frame.cy - y * frame.b;
      B.seg(V(frame.cx - 4, Y), V(frame.cx + 4, Y), axis);
    }
    mark(B, V(frame.cx, frame.cy), 'O', guide, -14, 16);
    if (kind === 'ellipse') {
      drawEllipse(B, { ...frame, a: 2 * frame.a });
    } else if (kind === 'hyperbola') {
      for (const s of [-1, 1]) {
        drawLine(B, frame, [.5, s, 0], { ...lineStyle(guide, 1.2, '6 7'), opacity: .6 });
        path(Array.from({ length: 101 }, (_, i) => {
          const t = (i - 50) * .041;
          return [s * 2 * Math.cosh(t), Math.sinh(t), 1];
        }));
      }
    } else {
      path(Array.from({ length: 101 }, (_, i) => {
        const t = (i - 50) * .075;
        return [t * t / 2, t, 1];
      }));
    }
    const c = CONICS[kind], p = c.matrix.map(row => dot3(row, P));
    const infinitePoint = atInfinity(P);
    handle.style.display = infinitePoint ? 'none' : '';
    if (infinitePoint) {
      const [x, y] = P;
      drawLine(B, frame, [y, -x, 0], lineStyle(gold, 1.7, '3 7'));
    } else mark(B, toCanvas(frame, P), 'P', gold, 14, -12);
    const drawn = drawLine(B, frame, p, lineStyle(blue, 2.6), 'p');
    const coords = values => values.map(v => fmt(v, Number.isInteger(v) ? 0 : 2)).join(', ');
    curve(c.equation);
    pt(`[${coords(P)}]${infinitePoint ? ' · 无穷远点' : ''}`);
    line(`(${coords(p)})`);
    const on = Math.abs(dot3(P, normalize(p))) < 1e-9;
    let text = 'p 为 P 的极线';
    if (infinityLine(p)) text = on ? 'w = 0 · 无穷远直线在 P 处与抛物线相切' : 'p 为 w = 0（无穷远直线）';
    else if (on) text = infinitePoint ? 'p 是无穷远切线，即渐近线' : 'p 是 P 处的切线';
    else if (!drawn) text = 'p 在视窗外';
    meaning(text, 'ok');
  };
  B.render();
  return B;
}
