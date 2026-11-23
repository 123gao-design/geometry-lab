/* 图 A6 · 一般二次式的主轴与实点分类 */
import { mk, V, add, mul, dot, fmt, marchSegs, segsToPath } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 860, H = 455;
  const B = createConicLab(root, W, H);
  const O = V(430, 221), scale = 60;
  const st = { A: .5, B: .8, C: 1.2, D: 0, E: 0, F: -1 };
  const type = B.chip('二次部分'), shift = B.chip('移轴'), axes = B.chip('主轴方向'), result = B.chip('实轨迹');

  const sliders = {};
  for (const [key, label, max] of [
    ['A', 'A（x²）', 3], ['B', 'B（xy）', 3], ['C', 'C（y²）', 3],
    ['D', 'D（x）', 4], ['E', 'E（y）', 4], ['F', 'F（常数）', 6],
  ]) sliders[key] = B.slider(label, -max, max, .1, st[key], v => { st[key] = v; B.render(); });
  const preset = (name, coefficients) => B.btn(name, () => {
    Object.keys(st).forEach((key, i) => { st[key] = coefficients[i]; sliders[key].sync(st[key]); });
    B.render();
  });
  preset('对勾', [-1, 1, 0, 0, 0, -1]);
  preset('等轴', [0, 1, 0, 0, 0, -1]);
  preset('斜椭圆', [.5, .8, 1.2, 0, 0, -1]);
  preset('抛物型', [0, 0, 1, -2, 0, 0]);
  preset('一点', [1, 0, 2, 0, 0, 0]);
  preset('空集', [1, 0, 2, 0, 0, 1]);
  preset('相交直线', [1, 0, -1, 0, 0, 0]);
  preset('平行直线', [0, 0, 1, 0, 0, -1]);

  const chart = (x, y) => V(O.x + x * scale, O.y + y * scale);
  const eps = 1e-9;
  const main = { stroke: plotInk.teal, 'stroke-width': 2.6 };
  const helper = { stroke: plotInk.amber, 'stroke-width': 1.25, 'stroke-dasharray': '6 6' };
  const planeAxis = { stroke: plotInk.axis, 'stroke-width': 1.3 };

  function focusMark(p, label = '') {
    if (p.x < 13 || p.x > W - 13 || p.y < 13 || p.y > H - 13) return;
    B.dot(p, 4.2, { fill: plotInk.rose, stroke: plotInk.ink });
    if (label) B.text(V(p.x + 8, p.y + 16), label);
  }

  B.renderFn = () => {
    const { A: a, B: b, C: c, D: d, E: e, F: f } = st;
    const field = (x, y) => a * x * x + b * x * y + c * y * y + d * x + e * y + f;
    function contour() {
      const segments = marchSegs(field, (16 - O.x) / scale, (16 - O.y) / scale,
        (W - 16 - O.x) / scale, (H - 16 - O.y) / scale, 113, 65)
        .map(([p, q]) => [chart(p.x, p.y), chart(q.x, q.y)]);
      if (segments.length) mk('path', { d: segsToPath(segments), fill: 'none', ...main }, B.dyn);
    }
    B.seg(V(16, O.y), V(W - 16, O.y), planeAxis);
    B.seg(V(O.x, 16), V(O.x, H - 16), planeAxis);
    B.text(V(W - 23, O.y - 12), 'u');
    B.text(V(O.x + 13, H - 23), 'v');
    for (let i = -6; i <= 6; i++) {
      const x = O.x + scale * i;
      B.seg(V(x, O.y - 4), V(x, O.y + 4), planeAxis);
    }
    if (a === 0 && b === 0 && c === 0) {
      contour();
      type('没有二次项'); shift('—'); axes('—');
      result(d || e ? '一次等式 · 一条直线' : f ? '非零常数 · 空集' : '恒等式 · 整个平面');
      return;
    }
    const determinant = 4 * a * c - b * b, spread = Math.hypot(a - c, b);
    const l1 = (a + c + spread) / 2, l2 = (a + c - spread) / 2;
    const theta = Math.atan2(b, a - c) / 2;
    const dir1 = V(Math.cos(theta), Math.sin(theta)), dir2 = V(-dir1.y, dir1.x);
    type('B²−4AC = ' + fmt(-determinant, 2) + ' · ' +
      (determinant > eps ? '椭圆型' : determinant < -eps ? '双曲型' : '抛物型'));
    axes('转角 ' + fmt(theta * 180 / Math.PI, 1) + '° · λ₊ = ' + fmt(l1, 3) + ' · λ₋ = ' + fmt(l2, 3));
    if (Math.abs(determinant) > eps) {
      const u0 = (b * e - 2 * c * d) / determinant, v0 = (b * d - 2 * a * e) / determinant;
      const K = -field(u0, v0), center = chart(u0, v0);
      shift('中心 (' + fmt(u0, 2) + ', ' + fmt(v0, 2) + ') · K = ' + fmt(K, 2));
      for (const dir of [dir1, dir2]) B.inf(center, add(center, dir), helper);
      B.dot(center, 4.5, { fill: plotInk.amber, stroke: plotInk.ink });
      B.text(V(center.x + 13, center.y - 13), '中心');
      if (Math.abs(K) <= eps) {
        if (determinant < 0) {
          const ratio = Math.sqrt(-l1 / l2);
          for (const side of [-1, 1]) B.inf(center, add(center, add(dir1, mul(dir2, side * ratio))), main);
          result('K = 0 · 一对相交直线', 'warn');
        } else {
          B.dot(center, 5, { fill: plotInk.teal });
          result('K = 0 · 实轨迹只有中心这一点', 'warn');
        }
        return;
      }
      const s1 = K / l1, s2 = K / l2;
      if (s1 < 0 && s2 < 0) {
        result('虚椭圆 · 实平面无轨迹', 'warn');
        return;
      }
      contour();
      const ellipse = determinant > 0;
      const useFirst = ellipse ? s1 >= s2 : s1 > 0;
      const [aa, bb, direction] = useFirst ? [s1, Math.abs(s2), dir1] : [s2, Math.abs(s1), dir2];
      const focus = Math.sqrt(aa + (ellipse ? -bb : bb));
      for (const side of [-1, 1]) focusMark(add(center, mul(direction, side * scale * focus)));
      result((ellipse ? '椭圆' : '双曲线') + ' · a=' + fmt(Math.sqrt(aa), 2)
        + ' · b=' + fmt(Math.sqrt(bb), 2) + ' · e=' + fmt(focus / Math.sqrt(aa), 3), 'ok');
      return;
    }

    const [lambda, across, along] = Math.abs(l1) >= Math.abs(l2) ? [l1, dir1, dir2] : [l2, dir2, dir1];
    const q = dot(V(d, e), across), r = dot(V(d, e), along);
    const u0 = -q / (2 * lambda), constant = f - q * q / (4 * lambda);
    const at = (u, v) => { const a = add(mul(across, u), mul(along, v)); return chart(a.x, a.y); };
    if (Math.abs(r) > eps) {
      const v0 = -constant / r, focus = -r / (4 * lambda), vertex = at(u0, v0);
      B.inf(vertex, add(vertex, along), helper);
      const foot = at(u0, v0 - focus);
      B.inf(foot, add(foot, across), { stroke: plotInk.rule, 'stroke-width': 1.2, 'stroke-dasharray': '5 6' });
      contour();
      B.dot(vertex, 4.5, { fill: plotInk.amber, stroke: plotInk.ink });
      B.text(V(vertex.x - 9, vertex.y - 13), '顶点');
      focusMark(at(u0, v0 + focus), '焦点');
      shift('零特征值方向仍有一次项 · 无对称中心');
      result('抛物线 · 焦参数 = ' + fmt(2 * Math.abs(focus), 2), 'ok');
    } else {
      const square = -constant / lambda;
      shift('零特征值方向的一次项也为 0');
      if (square < -eps) result('实平面无轨迹', 'warn');
      else if (square <= eps) {
        const point = at(u0, 0);
        B.inf(point, add(point, along), main);
        result('一条重合直线', 'warn');
      } else {
        for (const side of [-1, 1]) {
          const point = at(u0 + side * Math.sqrt(square), 0);
          B.inf(point, add(point, along), main);
        }
        result('一对平行直线', 'warn');
      }
    }
  };
  B.render();
  return B;
}
