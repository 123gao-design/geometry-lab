/* 图 位1 · 平行与垂直机
   单位正方体 A B C D - A₁B₁C₁D₁ 当骨架，四档依次高亮：
   ① 线面平行 ② 线面垂直 ③ 面面平行 ④ 面面垂直。
   高亮的线用金色实线、面用半透明色块，垂直处画直角标记，面面垂直处再画二面角的平面角。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, arc3, rightMark3, orbit } from '../../../lib/solid3d.js';

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
const FACES = [
  ['A', 'B', 'C', 'D'], ['A1', 'B1', 'C1', 'D1'],
  ['A', 'B', 'B1', 'A1'], ['C', 'D', 'D1', 'C1'],
  ['B', 'C', 'C1', 'B1'], ['D', 'A', 'A1', 'D1'],
];
const NAME = { A: 'A', B: 'B', C: 'C', D: 'D', A1: 'A₁', B1: 'B₁', C1: 'C₁', D1: 'D₁' };

export function createBoard(root) {
  const W = 800, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 208, s: 160, cz: 0.5 });
  const st = { mode: 0 };
  const cA = B.chipM('对象'), cB = B.chipM('平面'), cC = B.chipM('关系'), cD = B.chipM('判据');

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    cam.cz = 0.5;

    // 骨架：浅色面 + 全部棱
    for (const f of FACES) cs.poly(f.map(k => V[k]), { fill: '#5c6a80', op: 0.06, stroke: 'none' });
    for (const [a, b] of EDGES) cs.line(V[a], V[b], { stroke: '#8fa3bd', w: 1.1, op: 0.55 });

    const hlFace = (keys, col, op = 0.22) => cs.poly(keys.map(k => V[k]), { fill: col, op, stroke: col, w: 1.4, lineOp: 0.75 });
    const hlLine = (a, b, col, w = 2.4, dash) => cs.line(V[a], V[b], { stroke: col, w, op: 0.95, dash });

    if (st.mode === 0) {
      hlFace(['D', 'C', 'C1', 'D1'], '#5cadff');
      hlLine('A1', 'B', '#ffd166');
      hlLine('D1', 'C', '#4ade80', 1.8, '7 6');
      cA('$A_1B$'); cB('平面 $DCC_1D_1$'); cC('平行');
      cD('$A_1B\\parallel D_1C$，$D_1C\\subset$ 平面');
    } else if (st.mode === 1) {
      hlFace(['A', 'B', 'C', 'D'], '#5cadff', 0.2);
      hlLine('A', 'A1', '#ffd166');
      rightMark3(cs, V.A, V.A1, V.B);
      rightMark3(cs, V.A, V.A1, V.D);
      cA('$AA_1$'); cB('平面 $ABCD$'); cC('垂直');
      cD('$AA_1\\perp AB$，$AA_1\\perp AD$，$AB\\cap AD=A$');
    } else if (st.mode === 2) {
      hlFace(['A', 'B', 'C', 'D'], '#5cadff', 0.18);
      hlFace(['A1', 'B1', 'C1', 'D1'], '#4ade80', 0.18);
      cA('平面 $ABCD$'); cB('平面 $A_1B_1C_1D_1$'); cC('平行');
      cD('两平面没有公共点，$AB\\parallel A_1B_1$');
    } else {
      hlFace(['A', 'B', 'C', 'D'], '#5cadff', 0.18);
      hlFace(['A', 'D', 'D1', 'A1'], '#c084fc', 0.26);
      hlLine('A', 'D', '#ffd166', 2.4);
      arc3(cs, V.A, V.A1, V.B, 0.36, { stroke: '#ffd166' });
      cs.label(v3(0.31, 0, 0.31), '90°', { dx: 12, dy: -6, size: 12.5, fill: '#ffd166' });
      cA('平面 $ADD_1A_1$'); cB('平面 $ABCD$'); cC('垂直');
      cD('二面角 $A_1-AD-B$ 的平面角为 $90^\\circ$');
    }

    // 顶点标注，向远离形心的一侧偏
    const qc = cs.P(CENT);
    for (const k in V) {
      const q = cs.P(V[k]);
      const dx = q.x - qc.x, dy = q.y - qc.y, L = Math.hypot(dx, dy) || 1;
      cs.label(V[k], NAME[k], { dx: dx / L * 14, dy: dy / L * 14 + 4, size: 13 });
    }
    cs.flush();
  };

  const names = ['① 线面平行', '② 线面垂直', '③ 面面平行', '④ 面面垂直'];
  const btns = names.map((nm, i) => B.btn(nm, () => setMode(i), { on: i === 0 }));
  const setMode = i => {
    st.mode = i;
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  };
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转，高亮的线与面保持各自的位置关系');
  setMode(0);
  return B;
}
