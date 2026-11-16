/* 图 标3 · 距离与夹角的坐标算法机
   单位正方体上三档，坐标轴从顶点 A 出发：
   ① 点到平面的距离（两向量叉乘得法向量）② 两条直线所成角（方向向量点积）
   ③ 直线与平面所成角（方向向量与法向量，取正弦）。结果一律由向量公式算出后读在徽章上。 */
import { Board } from '../../../lib/board.js';
import { v3, sub3, mul3, dot3, cross3, len3, makeCam, Scene, arrow3, arc3, rightMark3, orbit } from '../../../lib/solid3d.js';

const V = {
  A: v3(0, 0, 0), B: v3(1, 0, 0), C: v3(1, 1, 0), D: v3(0, 1, 0),
  A1: v3(0, 0, 1), B1: v3(1, 0, 1), C1: v3(1, 1, 1), D1: v3(0, 1, 1),
};
const NAME = { A: 'A', B: 'B', C: 'C', D: 'D', A1: 'A₁', B1: 'B₁', C1: 'C₁', D1: 'D₁' };
const EDGES = [
  ['A', 'B'], ['B', 'C'], ['C', 'D'], ['D', 'A'],
  ['A1', 'B1'], ['B1', 'C1'], ['C1', 'D1'], ['D1', 'A1'],
  ['A', 'A1'], ['B', 'B1'], ['C', 'C1'], ['D', 'D1'],
];

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 408, cy: 214, s: 148, cz: 0.5 });
  const st = { mode: 0 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const vec = p => `$(${fz(p.x)},\\ ${fz(p.y)},\\ ${fz(p.z)})$`;
  const cA = B.chipM('向量一'), cB = B.chipM('向量二'), cC = B.chipM('结果'), cD = B.chipM('判读');

  // 三档共用的数据
  const uAB = sub3(V.B, V.A1);                 // A₁B
  const vBC = sub3(V.C, V.B1);                 // B₁C
  const uN = sub3(V.D, V.B);                   // BD
  const vN = sub3(V.C1, V.B);                  // BC₁
  const n = cross3(uN, vN);                    // 平面 BDC₁ 的法向量
  const t = dot3(sub3(V.A1, V.B), n) / dot3(n, n);
  const foot = sub3(V.A1, mul3(n, t));
  const dist = Math.abs(t) * len3(n);
  const cosSkew = Math.abs(dot3(uAB, vBC)) / (len3(uAB) * len3(vBC));
  const nz = v3(0, 0, 1);
  const sinLine = Math.abs(dot3(uAB, nz)) / (len3(uAB) * len3(nz));

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0.5;

    for (const [a, b] of EDGES) cs.line(V[a], V[b], { stroke: '#8fa3bd', w: 1.1, op: 0.5 });
    // 坐标轴钉在 A 上，短一截，只给方向
    arrow3(cs, V.A, v3(1.45, 0, 0), { stroke: '#ff7b8a', w: 1.4, op: 0.6 });
    arrow3(cs, V.A, v3(0, 1.45, 0), { stroke: '#67e8f9', w: 1.4, op: 0.6 });
    arrow3(cs, V.A, v3(0, 0, 1.45), { stroke: '#ffd166', w: 1.4, op: 0.6 });
    cs.label(v3(1.55, 0, 0), 'x', { dx: 8, dy: 4, size: 12.5, fill: '#ff7b8a' });
    cs.label(v3(0, 1.55, 0), 'y', { dx: 8, dy: 4, size: 12.5, fill: '#67e8f9' });
    cs.label(v3(0, 0, 1.55), 'z', { dx: -8, dy: -4, size: 12.5, fill: '#ffd166' });

    if (st.mode === 0) {
      cs.poly([V.B, V.D, V.C1], { fill: '#5cadff', op: 0.22, stroke: '#5cadff', w: 1.4, lineOp: 0.75 });
      cs.dot(V.A1, 4.6, { fill: '#ffd166' });
      cs.line(V.A1, foot, { stroke: '#ffd166', w: 2.2, op: 0.95, dash: '7 6' });
      cs.dot(foot, 4.2, { fill: '#fff' });
      cs.label(foot, 'H', { dx: 12, dy: 14, size: 12.5, fill: '#fff' });
      rightMark3(cs, foot, V.A1, V.B, 0.1, { stroke: '#8fa3bd' });
      cA(vec(uN)); cB(vec(vN));
      cC(`$d=${fz(dist)}$`);
      cD(`$\\vec n=${vec(n).slice(1, -1)}$`);
    } else if (st.mode === 1) {
      cs.poly([V.A, V.B, V.B1, V.A1], { fill: '#5cadff', op: 0.08, stroke: 'none' });
      cs.poly([V.B, V.C, V.C1, V.B1], { fill: '#c084fc', op: 0.08, stroke: 'none' });
      cs.line(V.A1, V.B, { stroke: '#ffd166', w: 2.4, op: 0.95 });
      cs.line(V.B1, V.C, { stroke: '#c084fc', w: 2.4, op: 0.95 });
      cs.line(V.A1, V.D, { stroke: '#4ade80', w: 1.7, op: 0.9, dash: '7 6' });
      arc3(cs, V.A1, V.B, V.D, 0.32, { stroke: '#ffd166' });
      cs.label(v3(0.204, 0.204, 0.592), '60°', { dx: 0, dy: -8, size: 12.5, fill: '#ffd166' });
      cA(vec(uAB)); cB(vec(vBC));
      cC('$60^\\circ$');
      cD(`$\\cos\\theta=${fz(cosSkew)}$`);
    } else {
      cs.poly([V.A, V.B, V.C, V.D], { fill: '#5cadff', op: 0.2, stroke: '#5cadff', w: 1.4, lineOp: 0.7 });
      cs.line(V.A1, V.B, { stroke: '#ffd166', w: 2.4, op: 0.95 });
      cs.line(V.A1, V.A, { stroke: '#8fa3bd', w: 1.4, op: 0.9, dash: '5 5' });
      cs.line(V.A, V.B, { stroke: '#4ade80', w: 1.7, op: 0.9, dash: '7 6' });
      rightMark3(cs, V.A, V.A1, V.B, 0.14, { stroke: '#8fa3bd' });
      arc3(cs, V.B, V.A, V.A1, 0.3, { stroke: '#ffd166' });
      cs.label(v3(0.584, 0, 0.172), '45°', { dx: 12, dy: -4, size: 12.5, fill: '#ffd166' });
      cA(vec(uAB)); cB(vec(nz));
      cC('$45^\\circ$');
      cD(`$\\sin\\theta=${fz(sinLine)}$`);
    }

    for (const k in V) {
      const q = cs.P(V[k]);
      cs.label(V[k], NAME[k], { dx: q.x > 408 ? 13 : -13, dy: -4, size: 12.5 });
    }
    cs.flush();
  };

  const names = ['① 点到平面距离', '② 两直线所成角', '③ 线面角'];
  const btns = names.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.mode = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转，三根短箭头就是坐标轴的方向');
  setMode(0);
  return B;
}
