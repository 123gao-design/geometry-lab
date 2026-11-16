/* 图 向1 · 空间直角坐标与向量机
   三条坐标轴 + 一个由三个滑块给坐标的点 P。OP 是向量，长方体的棱把三个坐标拆到轴上：
   x、y、z 各读一段长度，模由勾股定理两步算出，方向余弦是三个分量除以模。
   版面：三维图区整幅 880×500，cam 中心偏左，右端 700 起留给式子的位置由板内 tex 占据。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, add3, mul3, len3, makeCam, Scene, arrow3, orbit } from '../../../lib/solid3d.js';

const L = 3.0;

export function createBoard(root) {
  const W = 880, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 400, cy: 250, s: 76 });
  const st = { x: 2.0, y: 1.5, z: 1.2 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cC = B.chipM('坐标'), cN = B.chipM('模'), cD = B.chipM('方向余弦'), cJ = B.chipM('判读');

  const axis = (cs, to, col, lab) => {
    cs.line(mul3(to, -0.28), to, { stroke: col, w: 1.1, op: 0.8 });
    arrow3(cs, v3(0, 0, 0), to, { stroke: col, w: 1.8 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, len = Math.hypot(dx, dy) || 1;
    cs.label(to, lab, { dx: dx / len * 16, dy: dy / len * 16 + 4, size: 14, fill: col });
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const { x, y, z } = st;
    axis(cs, v3(L, 0, 0), '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), '#ffd166', 'z');
    cs.label(v3(0, 0, 0), 'O', { dx: -13, dy: 14, size: 13, fill: '#8fa3bd' });

    const P = v3(x, y, z), P0 = v3(x, y, 0), Px = v3(x, 0, 0), Py = v3(0, y, 0);
    // 长方体：三条从轴上竖起的棱 + 底面两条边
    const dash = { stroke: '#8fa3bd', w: 1.1, op: 0.75, dash: '4 4' };
    cs.line(P, P0, dash);
    cs.line(P0, Px, dash);
    cs.line(P0, Py, dash);
    cs.line(Px, v3(x, 0, z), { stroke: '#8fa3bd', w: 1, op: 0.5, dash: '3 4' });
    cs.line(v3(x, 0, z), P, { stroke: '#8fa3bd', w: 1, op: 0.5, dash: '3 4' });
    cs.line(Py, v3(0, y, z), { stroke: '#8fa3bd', w: 1, op: 0.5, dash: '3 4' });
    cs.line(v3(0, y, z), P, { stroke: '#8fa3bd', w: 1, op: 0.5, dash: '3 4' });

    // 三段坐标读数：x 红、y 青、z 黄，直接压在各轴上
    cs.line(v3(0, 0, 0), Px, { stroke: '#ff7b8a', w: 3.2, op: 0.9 });
    cs.line(v3(0, 0, 0), Py, { stroke: '#67e8f9', w: 3.2, op: 0.9 });
    cs.line(v3(0, 0, 0), v3(0, 0, z), { stroke: '#ffd166', w: 3.2, op: 0.9 });

    const dir = arrow3(cs, v3(0, 0, 0), P, { stroke: '#c084fc', w: 2.3 });
    cs.dot(P, 5, { fill: '#c084fc' });
    cs.label(P, 'P', { dx: dir.ux * 20, dy: dir.uy * 20 - 4, size: 14, fill: '#c084fc' });
    cs.dot(P0, 3.2, { fill: '#8fa3bd' });
    cs.dot(Px, 3.2, { fill: '#ff7b8a' });
    cs.dot(Py, 3.2, { fill: '#67e8f9' });

    const r = Math.hypot(x, y, z);
    const ux = x / (r || 1), uy = y / (r || 1), uz = z / (r || 1);
    cC(`$(${fz(x)},\\ ${fz(y)},\\ ${fz(z)})$`);
    cN(`$|\\overrightarrow{OP}|=${fz(r)}$`);
    cD(`$(${fz(ux)},\\ ${fz(uy)},\\ ${fz(uz)})$`);
    const flat = Math.abs(z) < 0.06, onz = Math.hypot(x, y) < 0.06;
    if (onz && flat) cJ('P 落在原点：零向量的方向不确定，方向余弦无意义', 'warn');
    else if (onz) cJ('P 在 z 轴上：两个方向余弦为零，向量只沿竖直方向', 'warn');
    else if (flat) cJ('P 在 xOy 平面上：竖直分量为零，模退化成平面内的勾股', 'ok');
    else cJ('三个分量各自独立：把滑块一个个推远，模按勾股定理两步相加', 'ok');
    cs.flush();
  };

  const presets = [
    { x: 2.0, y: 1.5, z: 1.2, nm: '① 一般点' },
    { x: 2.2, y: 1.8, z: 0, nm: '② xOy 面上' },
    { x: 0, y: 0, z: 2.4, nm: '③ z 轴上' },
  ];
  let sX, sY, sZ;
  const btns = presets.map((p, i) => B.btn(p.nm, () => apply(p, i), { on: i === 0 }));
  const apply = (p, i) => {
    st.x = p.x; st.y = p.y; st.z = p.z;
    if (sX) sX.sync(p.x);
    if (sY) sY.sync(p.y);
    if (sZ) sZ.sync(p.z);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  };
  sX = B.slider('坐标 x', -2.6, 2.6, 0.05, st.x, v => { st.x = v; B.render(); }, 'px');
  sY = B.slider('坐标 y', -2.6, 2.6, 0.05, st.y, v => { st.y = v; B.render(); }, 'py');
  sZ = B.slider('坐标 z', -2.6, 2.6, 0.05, st.z, v => { st.z = v; B.render(); }, 'pz');
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });

  orbit(B, cam, () => B.render());
  B.hint('拖动画面旋转：三条棱始终各自贴着一条坐标轴');
  apply(presets[0], 0);
  return B;
}
