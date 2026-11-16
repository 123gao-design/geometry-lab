/* 图 标2 · 平面方程与法向量机
   平面用三轴上的截距 a、b、c 给出：x/a + y/b + z/c = 1，法向量 n=(bc, ac, ab)。
   三个滑块改截距，平面与三轴围成的三角形随之变形；法向量从重心画出，徽章读方程、法向量与原点到平面的距离。 */
import { Board } from '../../../lib/board.js';
import { v3, add3, mul3, lerp3, len3, makeCam, Scene, arrow3, orbit } from '../../../lib/solid3d.js';

const L = 3.4;

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 410, cy: 246, s: 68 });
  const st = { a: 2.0, b: 1.6, c: 1.2 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cA = B.chipM('截距式'), cB = B.chipM('法向量 n'), cC = B.chipM('原点到平面'), cD = B.chipM('判读');

  const axis = (cs, to, col, lab) => {
    cs.line(mul3(to, -0.35), to, { stroke: col, w: 1.2, op: 0.85 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 2 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, len = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / len * 18, dy: dy / len * 18 + 4, size: 14, fill: col });
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const { a, b, c } = st;
    cam.cz = 0;

    axis(cs, v3(L, 0, 0), '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), '#ffd166', 'z');
    cs.label(v3(0, 0, 0), 'O', { dx: -12, dy: 13, size: 13, fill: '#8fa3bd' });

    const A = v3(a, 0, 0), Bp = v3(0, b, 0), C = v3(0, 0, c);
    cs.poly([A, Bp, C], { fill: '#5cadff', op: 0.17, stroke: '#5cadff', w: 1.6, lineOp: 0.8 });
    for (const t of [0.25, 0.5, 0.75]) {
      cs.line(lerp3(A, C, t), lerp3(Bp, C, t), { stroke: '#5cadff', w: 0.9, op: 0.22 });
      cs.line(lerp3(A, Bp, t), lerp3(A, C, t), { stroke: '#5cadff', w: 0.9, op: 0.22 });
      cs.line(lerp3(Bp, A, t), lerp3(Bp, C, t), { stroke: '#5cadff', w: 0.9, op: 0.22 });
    }
    cs.dot(A, 4.2, { fill: '#ff7b8a' });
    cs.dot(Bp, 4.2, { fill: '#67e8f9' });
    cs.dot(C, 4.2, { fill: '#ffd166' });
    cs.label(A, 'A', { dx: 0, dy: 18, size: 13, fill: '#ff7b8a' });
    cs.label(Bp, 'B', { dx: 16, dy: 6, size: 13, fill: '#67e8f9' });
    cs.label(C, 'C', { dx: -14, dy: -6, size: 13, fill: '#ffd166' });

    // 法向量：从三角形重心画出
    const n = v3(b * c, a * c, a * b);
    const un = mul3(n, 1 / (len3(n) || 1));
    const G = v3(a / 3, b / 3, c / 3);
    const tip = add3(G, mul3(un, 1.25));
    const dir = arrow3(cs, G, tip, { stroke: '#c084fc', w: 2.2 });
    cs.label(tip, 'n', { dx: dir.ux * 18, dy: dir.uy * 18 + 5, size: 14, fill: '#c084fc' });
    cs.dot(G, 3.6, { fill: '#c084fc' });

    const d = a * b * c / len3(n);
    cA(`$\\frac{x}{${fz(a)}}+\\frac{y}{${fz(b)}}+\\frac{z}{${fz(c)}}=1$`);
    cB(`$(${fz(n.x)},\\ ${fz(n.y)},\\ ${fz(n.z)})$`);
    cC(`$${fz(d)}$`);
    const eq = Math.abs(a - b) < 0.06 && Math.abs(b - c) < 0.06;
    cD(eq ? '三截距相等，截面是正三角形' : '截距都取正，平面只经过第Ⅰ卦限');
    cs.flush();
  };

  const presets = [
    { a: 2.0, b: 2.0, c: 2.0, nm: '① 等截距' },
    { a: 2.4, b: 1.8, c: 1.2, nm: '② 一般截面' },
    { a: 3.0, b: 3.0, c: 1.0, nm: '③ 陡斜面' },
  ];
  const btns = presets.map((p, i) => B.btn(p.nm, () => apply(p, i), { on: i === 0 }));
  const apply = (p, i) => {
    st.a = p.a; st.b = p.b; st.c = p.c;
    if (sA) sA.sync(p.a);
    if (sB) sB.sync(p.b);
    if (sC) sC.sync(p.c);
    btns.forEach((x, j) => x.classList.toggle('on', j === i));
    B.render();
  };
  let sA = B.slider('截距 a', 1.2, 3.2, 0.05, st.a, v => { st.a = v; B.render(); }, 'pa');
  let sB = B.slider('截距 b', 1.2, 3.2, 0.05, st.b, v => { st.b = v; B.render(); }, 'pb');
  let sC = B.slider('截距 c', 0.8, 3.2, 0.05, st.c, v => { st.c = v; B.render(); }, 'pc');
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转，紫色法向量始终垂直于平面');
  apply(presets[0], 0);
  return B;
}
