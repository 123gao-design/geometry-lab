/* 图 A1 · 以同一比例尺显示圆、椭圆和对应切线 */
import { mk, V, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk, plotWindow } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 460;
  const B = createConicLab(root, W, H);
  const R = 124, before = V(220, 245), after = V(641, 245);
  const left = plotWindow(B, { x: 17, y: 47, width: 402, height: 396 }, 'before');
  const right = plotWindow(B, { x: 441, y: 47, width: 402, height: 396 }, 'after');
  let k = .7, theta = .66;
  const point = (O, ry) => V(O.x + R * Math.cos(theta), O.y - ry * Math.sin(theta));
  const spacing = B.chip('纵向倍率'), relation = B.chip('圆切线 → 像切线'), area = B.chip('面积比');

  const scale = B.slider('k = b/a', .25, 1.5, .01, k, v => { k = v; B.render(); });
  for (const [label, value] of [['压缩 ½', .5], ['原尺寸', 1], ['拉伸 1.5 倍', 1.5]]) {
    B.btn(label, () => { k = value; scale.sync(k); B.render(); });
  }
  const scan = B.toggleBtn('同步扫描', false, enabled => {
    B.cancelRaf();
    if (!enabled) return;
    let previous;
    function tick(now) {
      if (previous != null) theta = (theta + Math.min(now - previous, 45) * .00115) % (2 * Math.PI);
      previous = now;
      B.render();
      B.raf(tick);
    }
    B.raf(tick);
  });
  B.handle({
    get: () => point(before, R), set: q => {
      scan.set(false);
      theta = Math.atan2(before.y - q.y, q.x - before.x);
    },
    color: plotInk.blue, label: 'Q',
  });

  function specimen(O, r, color, original) {
    const axis = { stroke: plotInk.axis, 'stroke-width': 1.2 };
    B.seg(V(O.x - 205, O.y), V(O.x + 205, O.y), axis);
    B.seg(V(O.x, 47), V(O.x, 443), axis);
    for (const step of [-1, -.5, .5, 1]) {
      const x = O.x + step * R, y = O.y + step * R;
      B.seg(V(x, O.y - 4), V(x, O.y + 4), axis);
      B.seg(V(O.x - 4, y), V(O.x + 4, y), axis);
    }
    if (!original) {
      mk('circle', { cx: O.x, cy: O.y, r: R, fill: 'none', stroke: plotInk.rule,
        'stroke-width': 1.1, 'stroke-dasharray': '5 7' }, B.dyn);
    }
    mk('ellipse', { cx: O.x, cy: O.y, rx: R, ry: r, fill: original ? plotInk.soft : plotInk.tealWash,
      stroke: color, 'stroke-width': 2.5 }, B.dyn);
    const q = point(O, r);
    const gauge = { stroke: plotInk.guide, 'stroke-width': 1, 'stroke-dasharray': '4 4' };
    B.seg(q, V(q.x, O.y), gauge);
    B.seg(q, V(O.x, q.y), gauge);
    if (!original && Math.abs(point(O, R).y - q.y) > 3) {
      B.seg(point(O, R), q, { stroke: plotInk.copper, 'stroke-width': 2.25, 'stroke-dasharray': '4 4' });
      B.dot(point(O, R), 3.2, { fill: plotInk.copper });
    }
    B.inf(q, V(q.x - R * Math.sin(theta), q.y - r * Math.cos(theta)), { stroke: plotInk.ink, 'stroke-width': 1.7 });
    if (!original) {
      B.dot(q, 4.8, { fill: color, stroke: plotInk.ink });
      B.text(V(q.x + 12, q.y - 12), 'Q′');
    }
  }

  B.renderFn = () => {
    B.text(V(before.x, 29), '变换前 · 圆', { 'font-size': 15, 'font-weight': 700 });
    B.text(V(after.x, 29), '变换后 · 椭圆', { 'font-size': 15, 'font-weight': 700 });
    left(() => specimen(before, R, plotInk.blue, true));
    right(() => specimen(after, k * R, plotInk.teal, false));
    spacing('x 不变 · y × ' + fmt(k, 2));
    relation('纵坐标项的系数 ÷ ' + fmt(k, 2) + ' · 仍与曲线相切');
    area('像面积 / 原面积 = ' + fmt(k, 2), 'ok');
  };
  B.render();
  return B;
}
