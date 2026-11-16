/* 图 行2 · 三阶行列式与体积
   三支向量 a、b、c 张成平行六面体，|D| 就是这个立体的体积：底面积 |a×b| 乘上 c 沿法向的高度。
   D 的符号记录 a、b、c 的右手关系——c 转到 z 轴下方时体积没变，符号先变。
   拖动视角绕原点旋转；三个滑块改 b 的方位角、c 的仰角、c 的方位角。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, view, arrow3, dot3, unit3, mul3, add3, len3 } from '../../../lib/solid3d.js';
import { fmt } from '../../../lib/board.js';

const D2R = Math.PI / 180;

export function createBoard(root) {
  const W = 860, H = 470;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 340, cy: 245, s: 96, cz: .62, yaw: .86, pitch: .40 });
  const st = { beta: 90, alpha: 58, gamma: 90 };
  const L = 1.65;

  const av = () => v3(L, 0, 0);
  const bv = () => v3(L * Math.cos(st.beta * D2R), L * Math.sin(st.beta * D2R), 0);
  const cv = () => {
    const ca = Math.cos(st.alpha * D2R), sa = Math.sin(st.alpha * D2R);
    return v3(L * ca * Math.cos(st.gamma * D2R), L * ca * Math.sin(st.gamma * D2R), L * sa);
  };

  const cD = B.chipM('行列式 $D$'), cV = B.chipM('体积'), cB = B.chipM('底面积 $\\times$ 高'), cJ = B.chipM('判读');

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const a = av(), b = bv(), c = cv();
    const O = v3(0, 0, 0);
    const ab = add3(a, b), ac = add3(a, c), bc = add3(b, c), abc = add3(ab, c);

    // 三阶行列式＝三支向量的混合积 a·(b×c)
    const D = a.x * (b.y * c.z - b.z * c.y) - a.y * (b.x * c.z - b.z * c.x) + a.z * (b.x * c.y - b.y * c.x);
    const vol = Math.abs(D);

    // 平行六面体的六个面
    const FC = ['#5cadff', '#4ade80', '#ffd166', '#c084fc', '#ff9e4a', '#67e8f9'];
    const faces = [
      [O, a, ab, b], [c, ac, abc, bc],
      [O, a, ac, c], [b, ab, abc, bc],
      [O, b, bc, c], [a, ab, abc, ac],
    ];
    faces.forEach((f, i) => cs.poly(f, { fill: FC[i], op: .12, stroke: FC[i], w: 1.2, lineOp: .55 }));

    // 三支棱向量
    arrow3(cs, O, a, { stroke: '#5cadff', w: 2.4 });
    arrow3(cs, O, b, { stroke: '#ff9e4a', w: 2.4 });
    arrow3(cs, O, c, { stroke: '#4ade80', w: 2.4 });
    cs.label(a, 'a', { dx: 4, dy: 16, size: 14, fill: '#5cadff' });
    cs.label(b, 'b', { dx: 12, dy: 4, size: 14, fill: '#ff9e4a' });
    cs.label(c, 'c', { dx: -14, dy: -2, size: 14, fill: '#4ade80' });
    cs.label(O, 'O', { dx: -12, dy: 14, size: 12.5, fill: '#8fa3bd' });

    // 底面积与高：底面平行四边形面积 = |a×b|，高 = c 在法向上的投影
    const n = v3(0, 0, 1);
    const base = len3(v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x));
    const hgt = dot3(c, unit3(base > 1e-9 ? v3(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x) : n));

    // 右栏读数
    const X = 578;
    B.textM({ x: X, y: 72 }, '$D=\\begin{vmatrix}a_x&b_x&c_x\\\\a_y&b_y&c_y\\\\a_z&b_z&c_z\\end{vmatrix}$', { 'font-size': 15, fill: '#aebdd2', 'text-anchor': 'start' });
    B.textM({ x: X, y: 112 }, `$a=(${fmt(a.x, 2)},\\,0,\\,0)$`, { 'font-size': 12, fill: '#5cadff', 'text-anchor': 'start' });
    B.textM({ x: X, y: 136 }, `$b=(${fmt(b.x, 2)},\\,${fmt(b.y, 2)},\\,0)$`, { 'font-size': 12, fill: '#ff9e4a', 'text-anchor': 'start' });
    B.textM({ x: X, y: 160 }, `$c=(${fmt(c.x, 2)},\\,${fmt(c.y, 2)},\\,${fmt(c.z, 2)})$`, { 'font-size': 12, fill: '#4ade80', 'text-anchor': 'start' });
    B.textM({ x: X, y: 202 }, `$D=${fmt(D, 3)}$`, { 'font-size': 18, fill: D > 0 ? '#5cadff' : D < 0 ? '#ff9e4a' : '#ff7b8a', 'text-anchor': 'start' });
    B.textM({ x: X, y: 240 }, `$V=|D|=${fmt(vol, 3)}$`, { 'font-size': 15, fill: '#ffd166', 'text-anchor': 'start' });
    B.textM({ x: X, y: 274 }, `$|a\\times b|\\cdot h=${fmt(base, 2)}\\times${fmt(Math.abs(hgt), 2)}$`, { 'font-size': 12, fill: '#8fa3bd', 'text-anchor': 'start' });
    B.textM({ x: X, y: 304 }, Math.abs(hgt) < 0.02 ? '$c$ 落在底面内：高为零' : hgt > 0 ? '$c$ 在底面上方：$D>0$' : '$c$ 在底面下方：$D<0$', { 'font-size': 12, fill: '#c084fc', 'text-anchor': 'start' });
    B.textM({ x: X, y: 348 }, '左键拖动可旋转视角', { 'font-size': 11.5, fill: '#8fa3bd', 'text-anchor': 'start' });

    cD(`$${fmt(D, 3)}$`);
    cV(`$${fmt(vol, 3)}$`);
    cB(`$${fmt(base, 2)}\\times${fmt(Math.abs(hgt), 2)}=${fmt(base * Math.abs(hgt), 3)}$`);
    cJ(Math.abs(hgt) < 0.02 ? '三支向量共面：平行六面体压成一块平面薄片，行列式为零'
      : Math.abs(st.beta - 90) < .5 ? 'a 与 b 垂直，底面是矩形；转动 c 只改高，体积跟着变'
        : D > 0 ? 'a、b、c 构成右手系：体积带正号'
          : 'a、b、c 构成左手系：体积带负号，绝对值才是体积');
    cs.flush();
  };

  B.slider('b 的方位角', 30, 150, 1, st.beta, v => { st.beta = v; B.render(); }, 'be');
  B.slider('c 的仰角', -50, 90, 1, st.alpha, v => { st.alpha = v; B.render(); }, 'al');
  B.slider('c 的方位角', 0, 350, 1, st.gamma, v => { st.gamma = v; B.render(); }, 'ga');

  B.btn('重置视角', () => { cam.yaw = 0.86; cam.pitch = 0.40; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('拖动旋转：体积 = 底面积 × 高，c 绕 z 轴转时体积不变');
  B.render();
  return B;
}
