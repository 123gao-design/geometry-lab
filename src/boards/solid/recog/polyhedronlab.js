/* 图 体1 · 多面体机
   五档：① 三棱柱 ② 长方体 ③ 三棱锥 ④ 四棱锥 ⑤ 四棱台。
   拖动画面任意处旋转视角；每个面一种颜色、带透明，前后都能看见。徽章读顶点数、棱数、面数与欧拉公式。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, edgesOf, FACE_COLORS } from '../../../lib/solid3d.js';

/* 三棱柱底面：正三角形外接半径 1.9，高 2.4 */
const TRI = [[-1.645, -0.95], [1.645, -0.95], [0, 1.9]];

const PRESETS = [
  {
    name: '三棱柱',
    vs: [
      ['A', ...TRI[0], 0], ['B', ...TRI[1], 0], ['C', ...TRI[2], 0],
      ['A₁', ...TRI[0], 2.4], ['B₁', ...TRI[1], 2.4], ['C₁', ...TRI[2], 2.4],
    ],
    fs: [[0, 1, 2], [3, 4, 5], [0, 1, 4, 3], [1, 2, 5, 4], [2, 0, 3, 5]],
  },
  {
    name: '长方体',
    vs: [
      ['A', -1.3, -1.0, 0], ['B', 1.3, -1.0, 0], ['C', 1.3, 1.0, 0], ['D', -1.3, 1.0, 0],
      ['A₁', -1.3, -1.0, 2.0], ['B₁', 1.3, -1.0, 2.0], ['C₁', 1.3, 1.0, 2.0], ['D₁', -1.3, 1.0, 2.0],
    ],
    fs: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]],
  },
  {
    name: '三棱锥',
    vs: [['A', ...TRI[0], 0], ['B', ...TRI[1], 0], ['C', ...TRI[2], 0], ['S', 0, 0, 2.4]],
    fs: [[0, 1, 2], [0, 1, 3], [1, 2, 3], [2, 0, 3]],
  },
  {
    name: '四棱锥',
    vs: [
      ['A', -1.5, -1.5, 0], ['B', 1.5, -1.5, 0], ['C', 1.5, 1.5, 0], ['D', -1.5, 1.5, 0],
      ['S', 0, 0, 2.4],
    ],
    fs: [[0, 1, 2, 3], [0, 1, 4], [1, 2, 4], [2, 3, 4], [3, 0, 4]],
  },
  {
    name: '四棱台',
    vs: [
      ['A', -1.9, -1.9, 0], ['B', 1.9, -1.9, 0], ['C', 1.9, 1.9, 0], ['D', -1.9, 1.9, 0],
      ['A₁', -0.95, -0.95, 2.0], ['B₁', 0.95, -0.95, 2.0], ['C₁', 0.95, 0.95, 2.0], ['D₁', -0.95, 0.95, 2.0],
    ],
    fs: [[0, 1, 2, 3], [4, 5, 6, 7], [0, 1, 5, 4], [1, 2, 6, 5], [2, 3, 7, 6], [3, 0, 4, 7]],
  },
];

export function createBoard(root) {
  const W = 800, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 205, s: 92, cz: 1.1 });
  const st = { i: 0 };
  const cA = B.chipM('当前立体'), cB = B.chipM('顶点数'), cC = B.chipM('棱数'), cD = B.chipM('面数'), cE = B.chipM('欧拉公式');

  B.renderFn = () => {
    const S = PRESETS[st.i];
    const pts = S.vs.map(v => v3(v[1], v[2], v[3]));
    const ctr = pts.reduce((a, p) => v3(a.x + p.x / pts.length, a.y + p.y / pts.length, a.z + p.z / pts.length), v3());
    const cs = new Scene(B, cam);

    // 面：一色一面，半透明，前后都能看见
    S.fs.forEach((f, i) => {
      const col = FACE_COLORS[i % FACE_COLORS.length];
      cs.poly(f.map(ix => pts[ix]), { fill: col, op: 0.16, stroke: col, w: 1.1, lineOp: 0.35 });
    });
    // 棱
    const es = edgesOf(S.fs);
    es.forEach(([a, b]) => cs.line(pts[a], pts[b], { stroke: '#aebdd2', w: 1.7, op: 0.95 }));
    // 顶点：标签朝远离中心的方向摆开
    const q0 = cs.P(ctr);
    pts.forEach((p, i) => {
      const q = cs.P(p);
      const dx = q.x - q0.x, dy = q.y - q0.y, L = Math.hypot(dx, dy) || 1;
      cs.dot(p, 4.4, { fill: '#ffd166' });
      cs.label(p, S.vs[i][0], { dx: dx / L * 15, dy: dy / L * 15 - 4, size: 13, fill: '#ffd166' });
    });
    cs.flush();

    const V = S.vs.length, E = es.length, F = S.fs.length;
    cA(S.name);
    cB(String(V));
    cC(String(E));
    cD(String(F));
    cE(`$${V}-${E}+${F}=${V - E + F}$`, V - E + F === 2 ? 'ok' : 'warn');
  };

  const btns = PRESETS.map((p, i) =>
    B.btn(`${'①②③④⑤'[i]} ${p.name}`, () => { st.i = i; btns.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  orbit(B, cam, () => B.render());
  B.hint('拖动画面任意处旋转视角，各面颜色不同、半透明');
  B.render();
  return B;
}
