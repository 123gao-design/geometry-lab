/* 图 3 · 完全四边形、调和点列与配极 */
import { V, fmt, mk, marchSegs, segsToPath } from '../../../lib/board.js';
import { plotInk } from '../../../lib/conic-diagram.js';
import { cross3, dot3, infinityLine, projectiveCrossRatio } from '../../../lib/projective/homogeneous.js';
import { blue, gold, guide, ink, mint, pink, lineStyle, createDiagram, drawLine, mark, pointStatus, toCanvas, toLocal } from '../../../lib/projective/diagram.js';

function drawCircumconic(B, frame, [[ab, cd], [ac, bd]], thirdOpposite) {
  // 两组对边的乘积生成过 A、B、C、D 的二次曲线束。
  // 在 P₃ 处让两项同号且相等，避开三组对边给出的退化成员。
  const e = dot3(ac, thirdOpposite) * dot3(bd, thirdOpposite);
  const f = dot3(ab, thirdOpposite) * dot3(cd, thirdOpposite);
  const conic = (x, y) => {
    const p = [(x - frame.cx) / frame.a, (frame.cy - y) / frame.b, 1];
    return e * dot3(ab, p) * dot3(cd, p) + f * dot3(ac, p) * dot3(bd, p);
  };
  const segments = marchSegs(conic, 6, 6, B.w - 6, B.h - 6, 84, 54);
  mk('path', { d: segsToPath(segments), fill: 'none', ...lineStyle(plotInk.violet, 2.3) }, B.dyn);
}

export function createBoard(root) {
  const B = createDiagram(root, 840, 540, '完全四边形的调和点列与极点极线');
  // 对边接近平行时，交点可移到无穷远。固定取景使指针与顶点在拖动中保持同一套坐标。
  const frame = { cx: 420, cy: 270, a: 235, b: 235 };
  const initial = [V(577, 294), V(370, 356), V(356, 189), V(287, 256)];
  let vertices = [...initial], selected = 0, showPolar = false;
  const pairs = [
    [[0, 1], [2, 3]],
    [[0, 2], [1, 3]],
    [[0, 3], [1, 2]],
  ];
  const edgeNames = ['AB', 'AC', 'AD'], subs = '₁₂₃';
  vertices.forEach((_, i) => B.handle({
    get: () => vertices[i],
    set: p => { vertices[i] = p; },
    color: ink, label: 'ABCD'[i],
  }));
  const buttons = edgeNames.map((name, i) => B.btn('高亮 ' + name, () => { selected = i; B.render(); }));
  B.toggleBtn('显示极点与极线', showPolar, on => { showPolar = on; B.render(); });
  B.btn('AB 与 CD 平行', () => { selected = 0; vertices = [V(178, 158), V(464, 158), V(616, 348), V(401, 348)]; B.render(); });
  B.btn('复位', () => { selected = 0; vertices = [...initial]; B.render(); });
  const ratio = B.chip('所选边的交叉比'), status = B.chip('所选边的调和点');

  B.renderFn = () => {
    buttons.forEach((button, i) => {
      button.classList.toggle('on', selected === i);
      button.setAttribute('aria-pressed', String(selected === i));
    });
    const points = vertices.map(p => toLocal(frame, p));
    const sides = pairs.map(pair => pair.map(([i, j]) => cross3(points[i], points[j])));
    sides.flat().forEach(l => drawLine(B, frame, l, { ...lineStyle(guide, 1.4, '4 6'), opacity: .60 }));
    pairs.flat().forEach(([i, j]) => B.seg(vertices[i], vertices[j], lineStyle(guide, 1.7)));
    const valid = sides.flat().every(Boolean)
      && [[0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]].every(([i, j, k]) =>
        Math.abs(dot3(cross3(points[i], points[j]), points[k])) > 1e-8);
    if (!valid) {
      ratio('—'); status('需要四个不同的点，且无三点共线', 'warn');
      return;
    }
    const opposites = sides.map(pair => cross3(...pair));
    const opposite = opposites[selected], otherIndices = [0, 1, 2].filter(i => i !== selected);
    const polar = cross3(...otherIndices.map(i => opposites[i])), edge = sides[selected][0];
    const S = cross3(edge, polar);
    if (!S || !opposite) {
      ratio('—'); status('构型接近退化', 'warn');
      return;
    }
    let polarStatus = '';
    if (showPolar) {
      drawCircumconic(B, frame, sides, opposites[2]);
      const inView = drawLine(B, frame, polar, lineStyle(mint, 2.6, '8 5'));
      const name = otherIndices.map(i => 'P' + subs[i]).join('');
      const location = inView ? '' : (infinityLine(polar) ? '（无穷远直线）' : '（视窗外）');
      polarStatus = ` · 极线 ${name}${location}`;
    }
    drawLine(B, frame, edge, lineStyle(blue, 2.4));
    for (const [i, p] of opposites.entries()) {
      mark(B, toCanvas(frame, p), 'P' + subs[i], showPolar && i === selected ? mint : pink, 12, 20);
    }
    mark(B, toCanvas(frame, S), 'S' + subs[selected], gold, 13, 20);
    const [A, C] = pairs[selected][0].map(i => points[i]);
    const idx = Math.abs(A[0] - C[0]) >= Math.abs(A[1] - C[1]) ? 0 : 1;
    const cr = projectiveCrossRatio(...[A, C, opposite, S].map(p => [p[idx], p[2]]));
    ratio(cr == null ? '—' : `${edgeNames[selected]} 上为 ${fmt(cr, 3)}`, cr != null && Math.abs(cr + 1) < 1e-8 ? 'ok' : '');
    const sub = subs[selected];
    status(`${showPolar ? '极点 ' : ''}P${sub} ${pointStatus(B, frame, opposite)}${polarStatus} · S${sub} ${pointStatus(B, frame, S)}`);
  };
  B.render();
  return B;
}
