/* 图 空2 · 矩阵与三维线性变换
   单位立方体被 3×3 矩阵映成平行六面体：三条棱的新位置就是矩阵的三列。
   体积从 1 变成 |det A|——行列式在三维里仍然是「体积放大倍数」，
   符号记录是否翻手（左手系变右手系）。拖动视角可绕原点旋转。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, arrow3, add3, mul3, dot3, len3, cross3 } from '../../../lib/solid3d.js';

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 320, cy: 252, s: 92, cz: .8, yaw: .88, pitch: .38 });
  const st = { s1: 1.3, s2: 1, s3: 1.2, k: .7 };
  const PRE = [
    { nm: '① 单位阵', m: [1, 0, 1, 1] },
    { nm: '② 纯拉伸', m: [1.6, 0, 1.2, 1] },
    { nm: '③ 剪切', m: [1, 1.3, 1, 1] },
    { nm: '④ 压扁', m: [1.5, .4, .3, .15] },
  ];

  const M = () => [[st.s1, st.k, 0], [0, st.s2, 0], [0, 0, st.s3]];
  const ap = (m, p) => v3(m[0][0] * p.x + m[0][1] * p.y + m[0][2] * p.z,
    m[1][0] * p.x + m[1][1] * p.y + m[1][2] * p.z,
    m[2][0] * p.x + m[2][1] * p.y + m[2][2] * p.z);

  const cD = B.chipM('行列式'), cV = B.chipM('体积'), cC = B.chipM('三列的像'), cJ = B.chipM('判读');

  const CUBE = [];
  for (let i = 0; i < 8; i++) CUBE.push(v3(i & 1, (i >> 1) & 1, (i >> 2) & 1));
  const FACES = [[0, 1, 3, 2], [4, 5, 7, 6], [0, 1, 5, 4], [2, 3, 7, 6], [0, 2, 6, 4], [1, 3, 7, 5]];
  const EDGES = [];
  for (let i = 0; i < 8; i++) for (const b of [1, 2, 4]) if (!(i & b)) EDGES.push([i, i | b]);

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const A = M();
    const P = CUBE.map(p => ap(A, p));
    const O = v3(0, 0, 0);

    // 原来的单位立方体：灰色细棱
    EDGES.forEach(([i, j]) => cs.line(CUBE[i], CUBE[j], { stroke: '#5c6a80', w: 1, op: .5, dash: '4 4' }));

    // 像：平行六面体，面按色分
    const FC = ['#5cadff', '#4ade80', '#ffd166', '#c084fc', '#ff9e4a', '#67e8f9'];
    FACES.forEach((f, i) => cs.poly(f.map(k => P[k]), { fill: FC[i], op: .12, stroke: FC[i], w: 1.2, lineOp: .55 }));

    // 三列（三条棱的像）
    arrow3(cs, O, P[1], { stroke: '#5cadff', w: 2.4 });
    arrow3(cs, O, P[2], { stroke: '#ff9e4a', w: 2.4 });
    arrow3(cs, O, P[4], { stroke: '#4ade80', w: 2.4 });
    cs.label(P[1], `(${fmt(A[0][0], 2)}, ${fmt(A[1][0], 2)}, ${fmt(A[2][0], 2)})`, { dx: 0, dy: 20, size: 11, fill: '#5cadff' });
    cs.label(P[2], `(${fmt(A[0][1], 2)}, ${fmt(A[1][1], 2)}, ${fmt(A[2][1], 2)})`, { dx: 26, dy: -4, size: 11, fill: '#ff9e4a' });
    cs.label(P[4], `(${fmt(A[0][2], 2)}, ${fmt(A[1][2], 2)}, ${fmt(A[2][2], 2)})`, { dx: -24, dy: -2, size: 11, fill: '#4ade80' });
    cs.label(O, 'O', { dx: -13, dy: 14, size: 12, fill: '#8fa3bd' });

    const det = A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1])
      - A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0])
      + A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);
    const vol = Math.abs(det);
    // 用混合积独立复核一次体积
    const vol2 = Math.abs(dot3(P[1], cross3(P[2], P[4])));

    const X = 596;
    B.textM({ x: X, y: 70 }, '$A=\\begin{bmatrix}a&b&0\\\\0&e&0\\\\0&0&i\\end{bmatrix}$', { 'font-size': 14, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM({ x: X, y: 142 }, `$=\\begin{bmatrix}${fmt(st.s1, 1)}&${fmt(st.k, 1)}&0\\\\0&${fmt(st.s2, 1)}&0\\\\0&0&${fmt(st.s3, 1)}\\end{bmatrix}$`, { 'font-size': 12.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM({ x: X, y: 204 }, `$\\det A=${fmt(det, 3)}$`, { 'font-size': 16, fill: det > 0 ? '#5cadff' : det < 0 ? '#ff9e4a' : '#ff7b8a', 'text-anchor': 'start' });
    B.textM({ x: X, y: 234 }, `体积 $|\\det A|=${fmt(vol, 3)}$`, { 'font-size': 13, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM({ x: X, y: 256 }, `混合积复核 $=${fmt(vol2, 3)}$`, { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM({ x: X, y: 286 }, '单位立方体体积为 1', { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM({ x: X, y: 308 }, `$\\to$ 体积放大 ${fmt(vol, 3)} 倍`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM({ x: X, y: 338 }, vol < 1e-3 ? '三列共面：立体压成一块平面' : det < 0 ? '定向翻转：左手系变右手系' : '定向保持：仍是右手系', { 'font-size': 12, fill: '#c084fc', 'text-anchor': 'start' });
    B.textM({ x: X, y: 366 }, '左键拖动可旋转视角', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    cD(`$${fmt(det, 3)}$`);
    cV(`$${fmt(vol, 3)}$`);
    cC(`$${fmt(len3(P[1]), 2)},\\ ${fmt(len3(P[2]), 2)},\\ ${fmt(len3(P[4]), 2)}$`);
    cJ(vol < 1e-3 ? '三列线性相关：立方体被压成平面薄片，行列式为零'
      : Math.abs(st.k) > .05 ? '剪切把立方体推斜：底面积不变，体积也不变'
        : '只有对角元时沿三轴拉伸，体积倍数就是对角的乘积');
    cs.flush();
  };

  const pre = PRE.map((p, i) => B.btnM(p.nm, () => {
    [st.s1, st.k, st.s2, st.s3] = p.m;
    pre.forEach((b, j) => b.classList.toggle('on', j === i));
    sliders.forEach((s, j) => s.sync(p.m[j]));
    B.render();
  }));

  const sliders = [
    B.slider('x 轴倍数', .3, 2, .1, st.s1, v => { st.s1 = v; B.render(); }, 's1'),
    B.slider('剪切量', 0, 1.5, .1, st.k, v => { st.k = v; B.render(); }, 'k'),
    B.slider('y 轴倍数', .3, 2, .1, st.s2, v => { st.s2 = v; B.render(); }, 's2'),
    B.slider('z 轴倍数', .1, 2, .1, st.s3, v => { st.s3 = v; B.render(); }, 's3'),
  ];

  B.btn('重置视角', () => { cam.yaw = .88; cam.pitch = .38; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('拖动旋转：立方体被映成平行六面体，体积倍数 = |det A|');
  B.render();
  return B;
}
