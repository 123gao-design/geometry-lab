/* 图 积2 · 三维球截面与通过球心和截面圆心的轴截面。 */
import { Board, V, mk } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, circle3 } from '../../../lib/solid3d.js';

const N = 48;
const X = v3(1, 0, 0), Y = v3(0, 1, 0);

export function createBoard(root) {
  const W = 800, H = 470;
  const B = new Board(root, W, H, { preciseSliders: true });
  const cam = makeCam({ cx: 270, cy: 235, s: 72, cz: 0 });
  const st = { R: 1.4, h: 0.6, dash: false, showSection: true };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cA = B.chipM('球半径 $R$'), cB = B.chipM('距离 $d=|h|$'), cC = B.chipM('截面半径 $r$');
  const cState = B.chipM('位置关系'), cD = B.chipM('球表面积'), cE = B.chipM('球体积');

  function drawSection(R, h, r, intersects, tangent) {
    const x = 658, y = 238, s = 43, py = y - h * s;
    const top = B.dyn;
    const plane = { stroke: '#c084fc', 'stroke-width': 1.7, 'stroke-dasharray': '5 4' };
    const radius = { stroke: '#5cadff', 'stroke-width': 2 };
    const cut = { stroke: '#ffd166', 'stroke-width': 3 };
    mk('rect', { x: 535, y: 107, width: 246, height: 251, rx: 16, fill: '#22314a', 'fill-opacity': .2,
      stroke: '#22314a' }, top);
    B.text(V(x, 133), '轴截面正视图', { fill: '#aebdd2', 'font-weight': 700 });
    mk('circle', { cx: x, cy: y, r: R * s, fill: '#5cadff', 'fill-opacity': .05, ...radius }, top);
    B.seg(V(x - 103, py), V(x + 103, py), plane);
    B.dot(V(x, y), 3.5, { fill: '#5cadff' });
    B.text(V(x - 12, y + 15), 'O', { fill: '#5cadff' });
    if (tangent) B.dot(V(x, py), 5, { fill: '#ffd166' });
    if (!intersects) return;
    const a = V(x + r * s, py);
    B.seg(V(x - r * s, py), a, cut);
    B.seg(V(x, y), a, radius);
    B.text(V((x + a.x) / 2 + 4, (y + py) / 2 + (h < 0 ? -11 : 15)), 'R', { fill: '#5cadff' });
    B.text(V((x + a.x) / 2, py + (h < 0 ? 17 : -9)), 'r', { fill: '#ffd166' });
    if (Math.abs(h) < .01) return;
    const mark = Math.min(8, Math.abs(h) * s, r * s);
    const innerY = py + Math.sign(h) * mark;
    B.seg(V(x, y), V(x, py), { stroke: '#93a1b5', 'stroke-dasharray': '4 3' });
    B.seg(V(x, innerY), V(x + mark, innerY), cut);
    B.seg(V(x + mark, innerY), V(x + mark, py), cut);
    B.text(V(x - 13, (y + py) / 2 + 4), 'd', { fill: '#93a1b5' });
  }

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const { R, h } = st;
    const d = Math.abs(h);
    const tangent = Math.abs(d - R) < 1e-7;
    const intersects = !tangent && d < R;
    const rs = Math.sqrt(Math.max(0, R * R - d * d));
    cam.cx = st.showSection ? 270 : W / 2;

    // 球
    cs.dot(v3(0, 0, 0), R * cam.s, { fill: '#5cadff', op: 0.07, stroke: '#5cadff', w: 1.4 });
    const dsh = st.dash ? '5 4' : undefined;
    for (const t of [-60, -30, 0, 30, 60]) {
      const z = R * Math.sin(t * Math.PI / 180), rr = R * Math.cos(t * Math.PI / 180);
      cs.path(circle3(v3(0, 0, z), X, Y, rr, N), { stroke: '#5cadff', w: 1, op: 0.26, dash: dsh });
    }
    for (let k = 0; k < 4; k++) {
      const a = k / 4 * Math.PI;
      cs.path(circle3(v3(0, 0, 0), v3(Math.cos(a), Math.sin(a), 0), v3(0, 0, 1), R, N), { stroke: '#5cadff', w: 1, op: 0.22, dash: dsh });
    }

    // 截面平面
    const L = R * 1.22;
    cs.poly([v3(-L, -L, h), v3(L, -L, h), v3(L, L, h), v3(-L, L, h)],
      { fill: '#c084fc', op: 0.12, stroke: '#c084fc', w: 1.1, lineOp: 0.55 });

    // 截面圆
    if (intersects) {
      const O = v3(0, 0, 0), P = v3(0, 0, h), A = v3(rs, 0, h);
      cs.poly(circle3(P, X, Y, rs, N), { fill: '#ffd166', op: 0.2, stroke: '#ffd166', w: 3, lineOp: 0.95 });
      cs.line(P, A, { stroke: '#ffd166', w: 2.2 });
      cs.label(v3(rs * 0.5, 0, h), 'r', { dx: 3, dy: -7, fill: '#ffd166' });
      cs.dot(O, 4, { fill: '#5cadff' });
      cs.label(O, 'O', { dx: -13, dy: -8, fill: '#5cadff' });
      if (d > 0) {
        cs.line(O, A, { stroke: '#5cadff', w: 2 });
        cs.line(O, P, { stroke: '#8fa3bd', w: 1.5, dash: '6 4' });
        const k = Math.min(0.16, rs * 0.4, d * 0.5);
        const z = h - Math.sign(h) * k;
        cs.path([v3(k, 0, h), v3(k, 0, z), v3(0, 0, z)], { stroke: '#ffd166', w: 1.3 });
        cs.dot(P, 3.5, { fill: '#ffd166' });
        cs.label(P, 'P₀', { dx: -16, dy: 6, fill: '#ffd166' });
      }
    } else if (tangent) {
      cs.dot(v3(0, 0, h), 6, { fill: '#ffd166', stroke: '#fff', w: 1.3 });
      cs.label(v3(0, 0, h), '切点', { dx: 16, dy: -10, fill: '#ffd166' });
    }
    cC(intersects ? `$${fz(rs)}$` : tangent ? '0（切点）' : '—');
    cState(intersects ? d === 0 ? '相交 · 大圆' : '相交 · 圆' : tangent ? '相切 · 一个公共点' : '相离 · 无公共点',
      intersects || tangent ? 'ok' : '');
    cA(`$${fz(R)}$`);
    cB(`$${fz(d)}$`);
    cD(`$${fz(4 * Math.PI * R * R)}$`);
    cE(`$${fz(4 * Math.PI * R * R * R / 3)}$`);
    cs.flush();
    B.text(V(st.showSection ? 270 : 400, 46), '球与平面', { fill: '#aebdd2', 'font-weight': 700 });
    if (st.showSection) drawSection(R, h, rs, intersects, tangent);
  };

  B.slider('球半径 R', 0.9, 2.0, 0.05, st.R, v => { st.R = v; B.render(); }, 'R');
  const height = B.slider('平面高度 h', -2, 2, 0.05, st.h, v => { st.h = v; B.render(); }, 'd');
  const setHeight = h => { height.value = h; height.dispatchEvent(new Event('input')); };
  B.btn('过球心', () => setHeight(0));
  B.btn('上侧相切', () => setHeight(st.R));
  B.toggleBtn('轴截面', true, on => { st.showSection = on; B.render(); });
  const bDash = B.btn('经纬线：实线', () => {
    st.dash = !st.dash;
    bDash.textContent = st.dash ? '经纬线：虚线' : '经纬线：实线';
    bDash.classList.toggle('on', st.dash);
    B.render();
  });
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('球心到平面的距离 d 越大，截面圆半径 r 越小');
  B.render();
  return B;
}
