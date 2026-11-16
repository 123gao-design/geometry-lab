/* 图 线5 · 第二类曲面积分机（通量）
   曲面 S 是上半球面 x²+y²+z²=R²（z≥0），法向朝外。
   第二类曲面积分 ∬_S F·n dS 读成「穿过曲面的通量」：把 F 在法向上的投影乘面元再累加。
   三个场：① F=(0,0,1) 竖直常场，通量等于赤道圆盘的面积 πR²；
   ② F=(0,0,z) 竖直场随高度增长，通量 2πR³/3；
   ③ F=(x,y,z) 从原点向外辐射，通量 2πR³（等于 R 乘曲面面积）。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, circle3 } from '../../../lib/solid3d.js';

const CAM0 = { yaw: 0.76, pitch: 0.34, s: 118, cx: 400, cy: 240, cz: 0.7 };
const FIELDS = [
  { n: '① $F=(0,0,1)$', F: () => [0, 0, 1], flux: R => Math.PI * R * R, why: '常数场只数穿过赤道圆盘的条数，通量等于盘的面积' },
  { n: '② $F=(0,0,z)$', F: (x, y, z) => [0, 0, z], flux: R => 2 * Math.PI * R ** 3 / 3, why: '越靠顶部场越强，通量比常数场多出因子 $2R/3$' },
  { n: '③ $F=(x,y,z)$', F: (x, y, z) => [x, y, z], flux: R => 2 * Math.PI * R ** 3, why: '辐射场处处沿法向，通量等于 $R$ 乘曲面面积 $2\\pi R^2$' },
];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { k: 0, R: 1.3, ph: 46, th: 40 };
  const cam = makeCam({ ...CAM0 });
  const cN = B.chipM('法向'), cFN = B.chipM('$F\\cdot n$'), cFl = B.chipM('通量 $\\Phi$'), cJ = B.chipM('判读');
  B.btn('重置视角', () => { Object.assign(cam, CAM0); B.render(); });

  const ex = v3(1, 0, 0), ey = v3(0, 1, 0), ez = v3(0, 0, 1);
  const pt = (R, ph, th) => v3(R * Math.sin(ph) * Math.cos(th), R * Math.sin(ph) * Math.sin(th), R * Math.cos(ph));
  const nr = (ph, th) => v3(Math.sin(ph) * Math.cos(th), Math.sin(ph) * Math.sin(th), Math.cos(ph));

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const R = st.R;

    // 上半球面
    const NA = 6, NB = 16;
    for (let i = 0; i < NA; i++) {
      for (let j = 0; j < NB; j++) {
        const q = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(([a, b]) =>
          pt(R, Math.PI / 2 * a / NA, 2 * Math.PI * b / NB));
        cs.poly(q, { fill: '#5cadff', op: .06, stroke: '#5cadff', w: .7, lineOp: .22 });
      }
    }
    cs.path(circle3(v3(0, 0, 0), ex, ey, R), { stroke: '#5cadff', w: 1.8, op: .9 });

    // 坐标轴
    cs.line(v3(-1.6, 0, 0), v3(1.6, 0, 0), { stroke: '#8fa3bd', w: 1, op: .55 });
    cs.line(v3(0, -1.6, 0), v3(0, 1.6, 0), { stroke: '#8fa3bd', w: 1, op: .55 });
    cs.line(v3(0, 0, -0.2), v3(0, 0, 1.75), { stroke: '#8fa3bd', w: 1, op: .55 });
    cs.label(v3(1.66, 0, 0), 'x', { size: 11, fill: '#8fa3bd' });
    cs.label(v3(0, 1.66, 0), 'y', { size: 11, fill: '#8fa3bd' });
    cs.label(v3(0, 0, 1.88), 'z', { size: 11, fill: '#8fa3bd' });

    // 面上的若干法向与场箭头
    const Ff = FIELDS[st.k].F;
    for (let i = 1; i <= 3; i++) {
      for (let j = 0; j < 8; j++) {
        const ph = Math.PI / 2 * i / 4, th = 2 * Math.PI * j / 8 + i * 0.2;
        const P0 = pt(R, ph, th), N = nr(ph, th);
        cs.line(P0, v3(P0.x + 0.28 * N.x, P0.y + 0.28 * N.y, P0.z + 0.28 * N.z), { stroke: '#c084fc', w: 1.6, op: .8 });
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 6; j++) {
        const ph = Math.PI / 2 * (i + 0.5) / 3, th = 2 * Math.PI * (j + 0.3) / 6;
        const P0 = pt(R * 1.02, ph, th), f = Ff(P0.x, P0.y, P0.z), l = Math.hypot(f[0], f[1], f[2]) || 1;
        cs.line(P0, v3(P0.x + 0.42 * f[0] / l, P0.y + 0.42 * f[1] / l, P0.z + 0.42 * f[2] / l), { stroke: '#ff9e4a', w: 1.8, op: .9 });
      }
    }

    // P 处的小片与法向
    const ph = st.ph * Math.PI / 180, th = st.th * Math.PI / 180;
    const dp = 0.1, dt = 0.12;
    const quad = [[ph - dp, th - dt], [ph + dp, th - dt], [ph + dp, th + dt], [ph - dp, th + dt]].map(([a, b]) => pt(R, a, b));
    cs.poly(quad, { fill: '#ffd166', op: .55, stroke: '#ffd166', w: 1.5, lineOp: .95 });
    const P0 = pt(R, ph, th), N = nr(ph, th);
    cs.line(P0, v3(P0.x + 0.62 * N.x, P0.y + 0.62 * N.y, P0.z + 0.62 * N.z), { stroke: '#c084fc', w: 2.6, op: .98 });
    cs.dot(P0, 4.5, { fill: '#ffd166' });
    cs.flush();

    const f = Ff(P0.x, P0.y, P0.z);
    const fn = f[0] * N.x + f[1] * N.y + f[2] * N.z;
    cN(`$(${fmt(N.x, 2)},\\ ${fmt(N.y, 2)},\\ ${fmt(N.z, 2)})$`);
    cFN(`$${fmt(fn, 3)}$`, fn >= 0 ? 'ok' : 'warn');
    cFl(`$${fmt(FIELDS[st.k].flux(R), 3)}$`, 'ok');
    cJ(FIELDS[st.k].why);
  };

  const bts = FIELDS.map((S, i) => B.btnM(S.n, () => { st.k = i; bts.forEach((b, j) => b.classList.toggle('on', j === i)); B.render(); }, { on: i === 0 }));
  B.slider('球半径 R', 1, 1.6, 0.02, st.R, v => { st.R = v; B.render(); }, 'R');
  B.slider('小片的极角 φ', 8, 84, 1, st.ph, v => { st.ph = v; B.render(); }, 'phi');
  B.slider('小片的方位角 θ', 0, 355, 5, st.th, v => { st.th = v; B.render(); }, 'th');
  orbit(B, cam, () => B.render());
  B.hintM('紫箭是曲面的外法向，橙箭是场：两者的夹角决定了这一小片「穿过」多少');
  B.render();
  return B;
}
