/* 图 T3 · 抛物线把同一入射波前等光程反射到焦点 */
import { mk, V, add, sub, norm, mul, dist, lerp, angDiff, acuteAng, arcPts, fmt } from '../../../lib/board.js';
import { createConicLab, plotInk } from '../../../lib/conic-diagram.js';

export function createBoard(root) {
  const W = 800, H = 500;
  const B = createConicLab(root, W, H);
  const vx = 211, cy = 250, screen = 717;
  const st = { p: 170, u: 61, front: true, normal: true, pulse: true };
  const points = [-195, -121, 117, 197];
  let phase = .42;
  const ptOf = u => V(vx + u * u / (2 * st.p), cy + u);
  const focus = () => V(vx + st.p / 2, cy);
  const angle = B.chip('相对切线的角'), path = B.chip('入射段 + 反射段'), wave = B.chip('同一波前的光程差');

  B.slider('焦参数 p', 120, 200, 1, st.p, p => { st.p = p; B.render(); });
  B.toggleBtn('显示光脉冲', true, value => { st.pulse = value; B.render(); });
  B.toggleBtn('显示法线', true, value => { st.normal = value; B.render(); });
  B.toggleBtn('显示发射面', true, value => { st.front = value; B.render(); });
  B.btn('发送同一波前', () => {
    B.cancelRaf();
    let start;
    const tick = now => {
      start ??= now;
      phase = Math.min(1, (now - start) / 3600);
      B.render();
      if (phase < 1) B.raf(tick);
      else B.cancelRaf();
    };
    B.raf(tick);
  }, { pri: true });
  B.handle({
    get: () => ptOf(st.u), set: q => { st.u = Math.max(-214, Math.min(214, q.y - cy)); },
    color: plotInk.teal, label: 'P', lo: [13, -13],
  });

  function ray(from, to, color, emphasis) {
    B.seg(from, to, { stroke: color, 'stroke-width': emphasis ? 2.6 : 1.25 });
    if (!emphasis || dist(from, to) < 34) return;
    const p = lerp(from, to, .54), q = add(p, mul(norm(sub(to, from)), 14));
    B.arrow(p, q, { stroke: color, head: 9, wide: 3.2, line: false });
  }

  B.renderFn = () => {
    const f = focus(), contact = ptOf(st.u), lx = vx - st.p / 2;
    const lightPath = P => screen - P.x + dist(P, f);
    B.seg(V(20, cy), V(W - 27, cy), { stroke: plotInk.axis, 'stroke-width': 1.2 });
    for (const [x, label] of [[lx, '准线 ℓ'], [screen, '发射面']]) {
      if (x === screen && !st.front) continue;
      B.inf(V(x, 0), V(x, 1), { stroke: plotInk.guide, 'stroke-width': 1.25, 'stroke-dasharray': '5 7' });
      B.text(V(x + 12, 23), label);
    }
    const samples = Array.from({ length: 153 }, (_, i) => ptOf((i - 76) * 3));
    const trace = samples.map(q => q.x.toFixed(2) + ',' + q.y).join(' ');
    mk('polyline', { points: trace, fill: 'none', stroke: plotInk.teal, 'stroke-width': 3 }, B.dyn);

    const total = lightPath(contact);
    for (const [i, P] of [...points.map(ptOf), contact].entries()) {
      const selected = i === points.length;
      const source = V(screen, P.y);
      ray(source, P, selected ? plotInk.copper : plotInk.rule, selected);
      ray(P, f, selected ? plotInk.green : plotInk.rule, selected);
      if (!st.pulse) continue;
      const incident = screen - P.x, traveled = phase * total;
      const pulse = traveled < incident
        ? lerp(source, P, traveled / incident)
        : lerp(P, f, Math.min(1, (traveled - incident) / dist(P, f)));
      mk('circle', { cx: pulse.x, cy: pulse.y, r: selected ? 8 : 6, fill: plotInk.pulse }, B.dyn);
      B.dot(pulse, selected ? 3.8 : 2.6, { fill: plotInk.amber });
    }
    const v = contact.y - cy, tangent = V(v, st.p), normal = norm(V(st.p, -v));
    B.inf(contact, add(contact, tangent), { stroke: plotInk.ink, 'stroke-width': 1.65 });
    if (st.normal) {
      B.seg(add(contact, mul(normal, -55)), add(contact, mul(normal, 110)), {
        stroke: plotInk.violet, 'stroke-width': 1.45, 'stroke-dasharray': '5 5',
      });
      const n = add(contact, mul(normal, 82));
      B.text(V(n.x + 17, n.y + 14), '法线');
    }
    const t = Math.atan2(tangent.y, tangent.x), rf = Math.atan2(f.y - contact.y, f.x - contact.x);
    const nearestTangent = a => a + (Math.abs(angDiff(t, a)) > Math.PI / 2 ? angDiff(t + Math.PI, a) : angDiff(t, a));
    for (const [heading, radius, color] of [[0, 25, plotInk.copper], [rf, 33, plotInk.green]]) {
      mk('path', { d: arcPts(contact, heading, nearestTangent(heading), radius),
        fill: 'none', stroke: color, 'stroke-width': 1.9 }, B.dyn);
    }
    B.dot(f, 5.5, { fill: plotInk.amber, stroke: plotInk.ink });
    B.text(V(f.x + 12, f.y - 13), 'F · 焦点');
    const inAngle = acuteAng(0, t), outAngle = acuteAng(rf, t);
    angle(fmt(inAngle * 180 / Math.PI, 1) + '° = ' + fmt(outAngle * 180 / Math.PI, 1) + '°', 'ok');
    path(fmt(screen - contact.x, 1) + ' + ' + fmt(dist(contact, f), 1) + ' = ' + fmt(total, 1), 'ok');
    const error = Math.max(...points.map(u => Math.abs(lightPath(ptOf(u)) - total)));
    wave(fmt(error, 4) + ' · 同时到达 F', 'ok');
  };
  B.render();
  return B;
}
