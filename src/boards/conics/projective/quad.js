/* 图 3 · 完全四点形与调和点列 */
import { V, add, dist, fmt, mul, sub } from '../../../lib/board.js';
import { cross3, dot3, projectiveCrossRatio } from '../../../lib/projective/homogeneous.js';
import { blue, gold, guide, ink, mint, pink, lineStyle, createDiagram, drawLine, mark, pointStatus, toCanvas, toLocal } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = createDiagram(root, 720, 460, '选择完全四点形的一条边，观察调和点列');
  const world = { cx: 360, cy: 230, a: 235, b: 235 };
  const view = { x: world.cx, y: world.cy, scale: 1 };
  let frame = world, fitting = false;
  function applyView() {
    frame = {
      cx: world.cx + (world.cx - view.x) * view.scale,
      cy: world.cy + (world.cy - view.y) * view.scale,
      a: world.a * view.scale,
      b: world.b * view.scale,
    };
  }

  function fitView(extra) {
    const center = mul(vertices.reduce((sum, p) => add(sum, p), V(0, 0)), .25);
    const radius = Math.max(80, ...vertices.map(p => dist(p, center))) * 2.3;
    const finite = extra.filter(Boolean).map(p => {
      const length = dist(p, center);
      return length > radius ? add(center, mul(sub(p, center), radius / length)) : p;
    });
    const xs = [...vertices, ...finite].map(p => p.x);
    const ys = [...vertices, ...finite].map(p => p.y);
    const dx = Math.max(...xs) - Math.min(...xs), dy = Math.max(...ys) - Math.min(...ys);
    const next = {
      x: (Math.max(...xs) + Math.min(...xs)) / 2,
      y: (Math.max(...ys) + Math.min(...ys)) / 2,
      scale: Math.min(1, (B.w - 84) / Math.max(1, dx), (B.h - 74) / Math.max(1, dy)),
    };
    if (fitting || Math.max(Math.abs(next.x - view.x), Math.abs(next.y - view.y),
      250 * Math.abs(next.scale - view.scale)) < .45) return;
    fitting = true;
    B.raf(() => {
      fitting = false;
      for (const key of Object.keys(view)) view[key] += (next[key] - view[key]) * .28;
      applyView();
      B.render();
    });
  }
  const initial = [V(517, 254), V(310, 316), V(296, 149), V(227, 216)];
  let vertices = [...initial], selected = 0;
  const pairs = [
    [[0, 1], [2, 3]],
    [[0, 2], [1, 3]],
    [[0, 3], [1, 2]],
  ];
  const edgeNames = ['AB', 'AC', 'AD'], subs = '₁₂₃';
  vertices.forEach((_, i) => B.handle({
    get: () => toCanvas(frame, toLocal(world, vertices[i])),
    set: p => {
      const q = toCanvas(world, toLocal(frame, p));
      vertices[i] = V(Math.max(-720, Math.min(1440, q.x)), Math.max(-460, Math.min(920, q.y)));
    },
    color: ink, label: 'ABCD'[i],
  }));
  const buttons = edgeNames.map((name, i) => B.btn('高亮 ' + name, () => { selected = i; B.render(); }));
  B.btn('AB 与 CD 平行', () => { selected = 0; vertices = [V(118, 118), V(404, 118), V(556, 308), V(341, 308)]; B.render(); });
  B.btn('复位', () => { selected = 0; vertices = [...initial]; B.render(); });
  const ratio = B.chip('所选边的交叉比'), status = B.chip('所选边的调和点');

  B.renderFn = () => {
    buttons.forEach((button, i) => {
      button.classList.toggle('on', selected === i);
      button.setAttribute('aria-pressed', String(selected === i));
    });
    const points = vertices.map(p => toLocal(world, p));
    const rendered = points.map(p => toCanvas(frame, p));
    const sides = pairs.map(pair => pair.map(([i, j]) => cross3(points[i], points[j])));
    sides.flat().forEach(l => drawLine(B, frame, l, { ...lineStyle(guide, 1.4, '4 6'), opacity: .60 }));
    pairs.flat().forEach(([i, j]) => B.seg(rendered[i], rendered[j], lineStyle(guide, 1.7)));
    const valid = sides.flat().every(Boolean)
      && [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]].every(([i, j, k]) =>
        Math.abs(dot3(cross3(points[i], points[j]), points[k])) > 1e-8);
    if (!valid) {
      fitView([]);
      ratio('—'); status('需要四个不同的点，且无三点共线', 'warn');
      return;
    }
    const opposites = sides.map(pair => cross3(...pair));
    const opposite = opposites[selected], otherTwo = opposites.filter((_, i) => i !== selected);
    const diagonal = cross3(...otherTwo), edge = sides[selected][0];
    const S = cross3(edge, diagonal);
    fitView([...opposites, S].map(p => toCanvas(world, p)));
    if (!S || !opposite) {
      ratio('—'); status('构型接近退化', 'warn');
      return;
    }
    drawLine(B, frame, edge, lineStyle(blue, 2.4));
    drawLine(B, frame, diagonal, lineStyle(mint, 2, '6 5'));
    for (const [i, p] of opposites.entries()) mark(B, toCanvas(frame, p), 'P' + subs[i], pink, 12, 20);
    mark(B, toCanvas(frame, S), 'S' + subs[selected], gold, 13, 20);
    const [A, C] = pairs[selected][0].map(i => points[i]);
    const idx = Math.abs(A[0] - C[0]) >= Math.abs(A[1] - C[1]) ? 0 : 1;
    const cr = projectiveCrossRatio(...[A, C, opposite, S].map(p => [p[idx], p[2]]));
    ratio(cr == null ? '—' : `${edgeNames[selected]} 上为 ${fmt(cr, 3)}`, cr != null && Math.abs(cr + 1) < 1e-8 ? 'ok' : '');
    const sub = subs[selected];
    status(`P${sub} ${pointStatus(B, frame, opposite)} · S${sub} ${pointStatus(B, frame, S)}`);
  };
  B.render();
  return B;
}
