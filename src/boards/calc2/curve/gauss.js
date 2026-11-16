/* 图 线6a · 高斯公式机
   闭合曲面 S 围成空间区域 Ω，外法向。高斯公式：∬_S F·n dS = ∭_Ω div F dV。
   场取 F=(x,y,z)，散度处处等于 3，于是通量与区域体积成正比：
   通量 4πR³，三重积分 ∭3 dV=3·(4/3)πR³ 也等于 4πR³。
   球面上画出外法向与场的投影，二者同向时 f·n 最大。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit } from '../../../lib/solid3d.js';

const CAM0 = { yaw: 0.76, pitch: 0.36, s: 112, cx: 400, cy: 240, cz: 0 };
const Ff = (x, y, z) => [x, y, z];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { R: 1.3 };
  const cam = makeCam({ ...CAM0 });
  const cD = B.chipM('散度 $\\nabla\\cdot F$'), cFl = B.chipM('通量 $\\iint_S$'), cV = B.chipM('三重积分 $\\iiint_\\Omega$'), cJ = B.chipM('判读');
  B.btn('重置视角', () => { Object.assign(cam, CAM0); B.render(); });

  const pt = (R, ph, th) => v3(R * Math.sin(ph) * Math.cos(th), R * Math.sin(ph) * Math.sin(th), R * Math.cos(ph));

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const R = st.R;
    const NA = 7, NB = 18;
    for (let i = 0; i < NA; i++) {
      for (let j = 0; j < NB; j++) {
        const q = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(([a, b]) =>
          pt(R, Math.PI * a / NA, 2 * Math.PI * b / NB));
        cs.poly(q, { fill: '#5cadff', op: .05, stroke: '#5cadff', w: .7, lineOp: .2 });
      }
    }

    // 外法向与场
    for (let i = 1; i <= 4; i++) {
      for (let j = 0; j < 8; j++) {
        const ph = Math.PI * i / 5, th = 2 * Math.PI * j / 8 + i * 0.3;
        const P0 = pt(R, ph, th), N = v3(Math.sin(ph) * Math.cos(th), Math.sin(ph) * Math.sin(th), Math.cos(ph));
        cs.line(P0, v3(P0.x + 0.34 * N.x, P0.y + 0.34 * N.y, P0.z + 0.34 * N.z), { stroke: '#c084fc', w: 1.5, op: .75 });
        const f = Ff(P0.x, P0.y, P0.z), l = Math.hypot(f[0], f[1], f[2]) || 1;
        cs.line(P0, v3(P0.x + 0.5 * f[0] / l, P0.y + 0.5 * f[1] / l, P0.z + 0.5 * f[2] / l), { stroke: '#ff9e4a', w: 1.8, op: .9 });
      }
    }

    // 坐标轴
    cs.line(v3(-1.6, 0, 0), v3(1.6, 0, 0), { stroke: '#8fa3bd', w: 1, op: .5 });
    cs.line(v3(0, -1.6, 0), v3(0, 1.6, 0), { stroke: '#8fa3bd', w: 1, op: .5 });
    cs.line(v3(0, 0, -1.6), v3(0, 0, 1.7), { stroke: '#8fa3bd', w: 1, op: .5 });
    cs.label(v3(1.66, 0, 0), 'x', { size: 11, fill: '#8fa3bd' });
    cs.label(v3(0, 1.66, 0), 'y', { size: 11, fill: '#8fa3bd' });
    cs.label(v3(0, 0, 1.82), 'z', { size: 11, fill: '#8fa3bd' });
    cs.flush();

    const flux = 4 * Math.PI * R ** 3;
    cD('$3$');
    cFl(`$${fmt(flux, 3)}$`);
    cV(`$${fmt(flux, 3)}$`, 'ok');
    cJ('场从原点向外辐射，外法向处处与它同向，闭合面上的通量只由体积与散度决定', 'ok');
  };

  B.slider('球半径 R', 1, 1.6, 0.02, st.R, v => { st.R = v; B.render(); }, 'R');
  orbit(B, cam, () => B.render());
  B.hintM('紫箭是外法向、橙箭是场：闭合曲面上每个点都朝外，通量就是「冒出多少」');
  B.render();
  return B;
}
