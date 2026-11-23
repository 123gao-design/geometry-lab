/* 图 3c · 阿波罗尼奥斯圆与垂直平分线 */
import { V, add, sub, mul, norm, dist, lerp, dot, fmt, mk } from '../../../lib/board.js';
import { projectiveCrossRatio } from '../../../lib/projective/homogeneous.js';
import { blue, gold, guide, ink, mint, pink, lineStyle, createDiagram, mark, visible } from '../../../lib/projective/diagram.js';

export function createBoard(root) {
  const B = createDiagram(root, 720, 410, '改变距离比 k 或沿轨迹拖动 P');
  const initial = [V(265, 214), V(445, 214)];
  let [a, b] = initial;
  let k = 1.8, travel = 92;
  for (const [label, get, set] of [['B', () => a, p => { a = p; }], ['C', () => b, p => { b = p; }]]) {
    B.handle({ get, set, label, color: ink });
  }
  const curve = () => {
    const delta = sub(b, a), axis = norm(delta), normal = V(-axis.y, axis.x);
    const d = k / (1 + k), D = lerp(a, b, d);
    if (k === 1) return { d, D, normal, P: add(D, mul(normal, travel)) };
    const e = k / (k - 1), E = lerp(a, b, e), O = lerp(D, E, .5), r = dist(O, D);
    const phi = travel / (r || 1), radial = sub(D, O);
    const P = add(O, add(mul(radial, Math.cos(phi)), mul(normal, r * Math.sin(phi))));
    return { d, e, D, E, P, O, normal, r, radial };
  };
  const hp = B.handle({ get: () => curve().P, set: p => {
    const c = curve();
    if (k === 1) travel = dot(sub(p, c.D), c.normal);
    else {
      const radius = sub(p, c.O);
      travel = Math.atan2(dot(radius, c.normal), dot(radius, norm(c.radial))) * c.r;
    }
  }, color: mint, label: 'P', lo: [12, 18] });
  const slider = B.slider('比值 k', .35, 5, .05, k, value => { k = value; B.render(); });
  function choose(value) { k = value; slider.sync(k); B.render(); }
  B.btn('等距 k = 1', () => choose(1), { pri: true });
  B.btn('随机换 k', () => choose(Math.round((.5 + Math.random() * 2.5) * 20) / 20));
  B.btn('复位', () => { [a, b] = initial; travel = 92; choose(1.8); });
  const ratio = B.chip('|PB| / |PC|'), check = B.chip('(B,C;D,E)'), state = B.chip('轨迹');
  B.renderFn = () => {
    const c = curve();
    const distinct = dist(a, b) > 1e-6;
    const showP = distinct && visible(B, c.P, 6);
    hp.style.display = B.handles[2].lbl.style.display = showP ? '' : 'none';
    if (!distinct) {
      ratio('—'); check('—'); state('先分开 B 和 C', 'warn'); return;
    }
    B.inf(a, b, lineStyle(guide, 1.45, '5 6'));
    B.seg(a, b, lineStyle(guide, 1.8));
    if (k === 1) B.inf(c.D, add(c.D, c.normal), lineStyle(mint, 2.4));
    else {
      mk('circle', { cx: c.O.x, cy: c.O.y, r: c.r, fill: mint, 'fill-opacity': .045, ...lineStyle(mint, 2.3) }, B.dyn);
      B.seg(c.D, c.E, lineStyle(gold, 1.5, '5 5'));
    }
    if (showP) {
      B.seg(a, c.P, lineStyle(blue, 1.5));
      B.seg(b, c.P, lineStyle(pink, 1.5));
    }
    mark(B, c.D, 'D', gold, -10, 20);
    mark(B, c.E, 'E', gold, 11, 20);
    ratio(fmt(dist(c.P, a) / dist(c.P, b), 3), 'ok');
    const cr = projectiveCrossRatio([0, 1], [1, 1], [c.d, 1], k === 1 ? [1, 0] : [c.e, 1]);
    check(cr == null ? '—' : fmt(cr, 3), cr == null ? '' : 'ok');
    state(k === 1 ? '垂直平分线 · E 在无穷远'
      : `比值圆${visible(B, c.E, 6) ? '' : ' · E 在视窗外'}${showP ? '' : ' · P 在视窗外'}`);
  };
  B.render();
  return B;
}
