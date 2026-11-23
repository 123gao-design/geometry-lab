/* 图 L1 · 区分有限交点和无穷远交点 */
import { mk, V, add, mul, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';
import { lineRoots } from '../../../lib/conic-intersection.js';

const statusText = {
  secant: ['相交 · 两个有限交点', 'ok'],
  tangent: ['相切 · 一个二重的有限交点', 'ok'],
  empty: ['相离 · 无实交点', ''],
  linear: ['降为一次 · 一个有限交点，一个无穷远交点', 'warn'],
  constant: ['渐近线本身 · 无有限交点，在无穷远相切', 'warn'],
};

export function createBoard(root) {
  const W = 860, H = 430, scale = 100;
  const B = createConicLab(root, W, H);
  const center = V(424, 218), vertex = V(232, 218), a = 1.8, b = 1.12, p = 1.4;
  const asym = Math.atan2(b, a);
  const st = { mode: 'e', angle: 35 * Math.PI / 180, anchor: V(375, 199) };
  const origin = () => st.mode === 'p' ? vertex : center;
  const status = B.chip('位置关系'), visibleCount = B.chip('显示范围');
  const coefficients = B.chip('A、B、C'), discriminant = B.chip('Δ');

  const modes = {};
  for (const [key, label] of [['e', '椭圆'], ['h', '双曲线'], ['p', '抛物线']]) {
    modes[key] = B.btn(label, () => { st.mode = key; B.render(); });
  }
  const angleSlider = B.slider('倾角 α°', 0, 180, .1, 35, v => {
    st.angle = v * Math.PI / 180; B.render();
  }, 'p1');
  function preset(label, mode, angle, anchor) {
    B.btn(label, () => {
      Object.assign(st, { mode, angle, anchor });
      angleSlider.sync(angle * 180 / Math.PI);
      B.render();
    });
  }
  preset('椭圆相切', 'e', 0, V(center.x, center.y - b * scale));
  preset('接近渐近方向', 'h', asym + .55 * Math.PI / 180, V(center.x, center.y - 74));
  preset('平行于渐近线', 'h', asym, V(center.x, center.y - 74));
  preset('沿渐近线', 'h', asym, center);
  preset('平行于抛物线轴', 'p', 0, V(vertex.x + 96, vertex.y - 96));

  B.handle({
    get: () => st.anchor, set: q => { st.anchor = q; }, color: plotInk.copper,
    label: 'P₀', lo: [12, -16],
  });

  B.renderFn = () => {
    for (const [key, button] of Object.entries(modes)) {
      button.classList.toggle('on', key === st.mode);
      button.setAttribute('aria-pressed', String(key === st.mode));
    }
    const o = origin(), d = V(Math.cos(st.angle), Math.sin(st.angle));
    const x = (st.anchor.x - o.x) / scale, y = (st.anchor.y - o.y) / scale;
    const axis = { stroke: plotInk.axis, 'stroke-width': 1.3 };
    B.seg(V(16, o.y), V(W - 18, o.y), axis);
    B.seg(V(o.x, 16), V(o.x, H - 16), axis);
    B.text(V(W - 29, o.y - 13), 'u');
    B.text(V(o.x + 13, H - 24), 'v');
    for (let i = -5; i <= 5; i++) {
      const u = o.x + i * scale;
      if (u > 25 && u < W - 30) B.seg(V(u, o.y - 4), V(u, o.y + 4), axis);
    }
    const curve = { fill: 'none', stroke: plotInk.teal, 'stroke-width': 2.6 };
    const path = points => mk('polyline', { points: points.map(q => q.join(',')).join(' '), ...curve }, B.dyn);
    let A, Bq, C;
    if (st.mode === 'p') {
      path(Array.from({ length: 181 }, (_, i) => {
        const v = (i - 90) * .026;
        return [o.x + scale * v * v / (2 * p), o.y + scale * v];
      }));
      A = d.y ** 2;
      Bq = 2 * (y * d.y - p * d.x);
      C = y ** 2 - 2 * p * x;
    } else {
      const sign = st.mode === 'h' ? -1 : 1;
      if (sign === 1) {
        mk('ellipse', { cx: o.x, cy: o.y, rx: a * scale, ry: b * scale, ...curve, fill: plotInk.tealWash }, B.dyn);
      } else {
        for (const side of [-1, 1]) {
          B.inf(o, add(o, V(a, side * b)), { stroke: plotInk.guide, 'stroke-width': 1.35, 'stroke-dasharray': '6 7' });
          path(Array.from({ length: 181 }, (_, i) => {
            const t = (i - 90) * .023;
            return [o.x + side * a * scale * Math.cosh(t), o.y + b * scale * Math.sinh(t)];
          }));
        }
      }
      A = d.x ** 2 / a ** 2 + sign * d.y ** 2 / b ** 2;
      Bq = 2 * (x * d.x / a ** 2 + sign * y * d.y / b ** 2);
      C = x ** 2 / a ** 2 + sign * y ** 2 / b ** 2 - 1;
    }
    B.inf(st.anchor, add(st.anchor, d), { stroke: plotInk.copper, 'stroke-width': 2.3 });
    const { kind, delta, roots } = lineRoots(A, Bq, C);
    let shown = 0;
    roots.forEach((t, i) => {
      const point = add(st.anchor, mul(d, t * scale));
      if (point.x < 13 || point.x > W - 13 || point.y < 13 || point.y > H - 13) return;
      shown++;
      B.dot(point, 5, { fill: plotInk.amber, stroke: plotInk.ink });
      B.text(V(point.x + 9, point.y - 12), roots.length === 1 ? 'P' : 'P' + ['₁', '₂'][i], { 'text-anchor': 'start' });
    });
    const number = v => Math.abs(v) <= 32 * Number.EPSILON ? '0' : Math.abs(v) < .001 ? v.toExponential(2) : fmt(v, 3);
    status(...statusText[kind]);
    visibleCount(shown + ' 点在视窗内' + (roots.length > shown ? ' · ' + (roots.length - shown) + ' 个有限点在视窗外' : ''));
    coefficients([A, Bq, C].map(number).join(' · '));
    discriminant(delta == null ? 'A = 0，改看一次项' : number(delta));
  };

  B.render();
  return B;
}
