/* 图 位2 · 异面直线与角机
   单位正方体上三档：① 异面直线所成角（平移法）② 直线与平面所成的角（投影法）③ 点到平面的距离（垂足法）。
   平移出来的平行线用绿色虚线，角一律画圆弧并读出度数，垂足处画直角标记。 */
import { Board } from '../../../lib/board.js';
import { v3, add3, sub3, mul3, dot3, cross3, len3, makeCam, Scene, arc3, rightMark3, orbit } from '../../../lib/solid3d.js';

const V = {
  A: v3(0, 0, 0), B: v3(1, 0, 0), C: v3(1, 1, 0), D: v3(0, 1, 0),
  A1: v3(0, 0, 1), B1: v3(1, 0, 1), C1: v3(1, 1, 1), D1: v3(0, 1, 1),
};
const CENT = v3(0.5, 0.5, 0.5);
const EDGES = [
  ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
  ['A1', 'B1'], ['B1', 'C1'], ['C1', 'D1'], ['D1', 'A1'],
  ['A', 'A1'], ['B', 'B1'], ['C', 'C1'], ['D', 'D1'],
];
const NAME = { A: 'A', B: 'B', C: 'C', D: 'D', A1: 'A₁', B1: 'B₁', C1: 'C₁', D1: 'D₁' };

export function createBoard(root) {
  const W = 800, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 206, s: 160, cz: 0.5 });
  const st = { mode: 0 };
  const cA = B.chipM('所成角 θ'), cB = B.chipM('距离 d'), cC = B.chipM('做法'), cD = B.chipM('判读');

  // A₁ 到平面 BDC₁ 的垂足：把 A₁ 投影到平面上，垂足恰为 △BDC₁ 的重心
  const n = cross3(sub3(V.D, V.B), sub3(V.C1, V.B));
  const t = dot3(sub3(V.A1, V.B), n) / dot3(n, n);
  const foot = sub3(V.A1, mul3(n, t));
  const dist = Math.abs(t) * len3(n);
  const deg = r => (Math.round(r * 180 / Math.PI * 10) / 10).toFixed(1);

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0.5;

    for (const [a, b] of EDGES) cs.line(V[a], V[b], { stroke: '#8fa3bd', w: 1.1, op: 0.5 });

    if (st.mode === 0) {
      cs.poly([V.A, V.B, V.B1, V.A1], { fill: '#5cadff', op: 0.08, stroke: 'none' });
      cs.poly([V.B, V.C, V.C1, V.B1], { fill: '#c084fc', op: 0.08, stroke: 'none' });
      cs.line(V.A1, V.B, { stroke: '#ffd166', w: 2.4, op: 0.95 });
      cs.line(V.B1, V.C, { stroke: '#c084fc', w: 2.4, op: 0.95 });
      cs.line(V.A1, V.D, { stroke: '#4ade80', w: 1.8, op: 0.95, dash: '7 6' });
      arc3(cs, V.A1, V.B, V.D, 0.32, { stroke: '#ffd166' });
      cs.label(v3(0.204, 0.204, 0.592), '60°', { dx: 0, dy: -8, size: 13, fill: '#ffd166' });
      cA('$60^\\circ$'); cB('—');
      cC('把 $B_1C$ 平移到 $A_1D$');
      cD('$A_1D\\parallel B_1C$，$\\angle BA_1D$ 即所求角');
    } else if (st.mode === 1) {
      cs.poly([V.A, V.B, V.C, V.D], { fill: '#5cadff', op: 0.2, stroke: '#5cadff', w: 1.4, lineOp: 0.7 });
      cs.line(V.A1, V.B, { stroke: '#ffd166', w: 2.4, op: 0.95 });
      cs.line(V.A1, V.A, { stroke: '#8fa3bd', w: 1.4, op: 0.9, dash: '5 5' });
      cs.line(V.A, V.B, { stroke: '#4ade80', w: 1.8, op: 0.95, dash: '7 6' });
      rightMark3(cs, V.A, V.A1, V.B, 0.14, { stroke: '#8fa3bd' });
      arc3(cs, V.B, V.A, V.A1, 0.3, { stroke: '#ffd166' });
      cs.label(v3(0.584, 0, 0.172), '45°', { dx: 12, dy: -4, size: 13, fill: '#ffd166' });
      cA('$45^\\circ$'); cB('—');
      cC('$A_1$ 向平面作垂线，垂足为 $B$');
      cD('$AB$ 是 $A_1B$ 的投影，$\\angle A_1BA$ 即所求角');
    } else {
      cs.poly([V.B, V.D, V.C1], { fill: '#5cadff', op: 0.22, stroke: '#5cadff', w: 1.4, lineOp: 0.75 });
      cs.dot(V.A1, 4.6, { fill: '#ffd166' });
      cs.line(V.A1, foot, { stroke: '#ffd166', w: 2.2, op: 0.95, dash: '7 6' });
      cs.dot(foot, 4.2, { fill: '#fff' });
      rightMark3(cs, foot, V.A1, V.B, 0.1, { stroke: '#8fa3bd' });
      cs.label(add3(V.A1, mul3(sub3(foot, V.A1), 0.45)), 'd', { dx: 14, dy: 0, size: 13, fill: '#ffd166' });
      cA('—'); cB(`$${dist.toFixed(2)}$`);
      cC('过 $A_1$ 作平面的垂线，垂足为 $H$');
      cD('$A_1H$ 就是所求距离，$H$ 为 $\\triangle BDC_1$ 的重心');
    }

    const qc = cs.P(CENT);
    for (const k in V) {
      const q = cs.P(V[k]);
      const dx = q.x - qc.x, dy = q.y - qc.y, L = Math.hypot(dx, dy) || 1;
      cs.label(V[k], NAME[k], { dx: dx / L * 14, dy: dy / L * 14 + 4, size: 13 });
    }
    cs.flush();
  };

  const names = ['① 异面直线所成角', '② 直线与平面所成角', '③ 点到平面的距离'];
  const btns = names.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.mode = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转，绿色虚线是平移或投影出来的辅助线');
  setMode(0);
  return B;
}
