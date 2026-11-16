/* 图 线6b · 斯托克斯公式机
   曲面 S 是上半球面，边界是赤道圆 C，法向朝上、C 的方向与法向成右手关系（从上往下看逆时针）。
   斯托克斯公式：∮_C F·dr = ∬_S (∇×F)·n dS。
   场取 F=(−y,x,0)，旋度处处是 (0,0,2)；赤道圆上的环量为 2πR²，
   旋度穿过曲面（等于穿过赤道圆盘）的通量 2·πR² 也等于 2πR²。 */
import { Board, fmt } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, circle3 } from '../../../lib/solid3d.js';

const CAM0 = { yaw: 0.78, pitch: 0.36, s: 118, cx: 400, cy: 244, cz: 0.5 };
const Ff = (x, y) => [-y, x];

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { R: 1.3 };
  const cam = makeCam({ ...CAM0 });
  const cC = B.chipM('旋度 $\\nabla\\times F$'), cL = B.chipM('环量 $\\oint_C$'), cS = B.chipM('旋度通量 $\\iint_S$'), cJ = B.chipM('判读');
  B.btn('重置视角', () => { Object.assign(cam, CAM0); B.render(); });

  const ex = v3(1, 0, 0), ey = v3(0, 1, 0);

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const R = st.R;

    // 上半球面
    const NA = 6, NB = 16;
    for (let i = 0; i < NA; i++) {
      for (let j = 0; j < NB; j++) {
        const q = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]].map(([a, b]) => {
          const ph = Math.PI / 2 * a / NA, th = 2 * Math.PI * b / NB;
          return v3(R * Math.sin(ph) * Math.cos(th), R * Math.sin(ph) * Math.sin(th), R * Math.cos(ph));
        });
        cs.poly(q, { fill: '#5cadff', op: .06, stroke: '#5cadff', w: .7, lineOp: .22 });
      }
    }

    // 旋度箭头（竖直向上）
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 7; j++) {
        const ph = Math.PI / 2 * (i + 0.5) / 3, th = 2 * Math.PI * (j + 0.25) / 7;
        const P0 = v3(R * Math.sin(ph) * Math.cos(th), R * Math.sin(ph) * Math.sin(th), R * Math.cos(ph));
        cs.line(P0, v3(P0.x, P0.y, P0.z + 0.34), { stroke: '#c084fc', w: 1.6, op: .8 });
      }
    }

    // 边界的环流方向箭头
    for (let j = 0; j < 8; j++) {
      const t0 = 2 * Math.PI * j / 8, t1 = t0 + 0.13;
      cs.line(v3(R * Math.cos(t0), R * Math.sin(t0), 0), v3(R * Math.cos(t1), R * Math.sin(t1), 0), { stroke: '#4ade80', w: 2.4, op: .95 });
    }
    cs.path(circle3(v3(0, 0, 0), ex, ey, R), { stroke: '#4ade80', w: 2.4, op: .95 });
    // 面上几个场箭头（水平切向）
    for (let j = 0; j < 6; j++) {
      const th = 2 * Math.PI * j / 6;
      const P0 = v3(R * 0.62 * Math.cos(th), R * 0.62 * Math.sin(th), 0.9);
      const f = Ff(P0.x, P0.y), l = Math.hypot(f[0], f[1]) || 1;
      cs.line(P0, v3(P0.x + 0.3 * f[0] / l, P0.y + 0.3 * f[1] / l, P0.z), { stroke: '#ff9e4a', w: 1.8, op: .9 });
    }

    cs.line(v3(-1.6, 0, 0), v3(1.6, 0, 0), { stroke: '#8fa3bd', w: 1, op: .5 });
    cs.line(v3(0, -1.6, 0), v3(0, 1.6, 0), { stroke: '#8fa3bd', w: 1, op: .5 });
    cs.line(v3(0, 0, -0.2), v3(0, 0, 1.7), { stroke: '#8fa3bd', w: 1, op: .5 });
    cs.label(v3(1.66, 0, 0), 'x', { size: 11, fill: '#8fa3bd' });
    cs.label(v3(0, 1.66, 0), 'y', { size: 11, fill: '#8fa3bd' });
    cs.label(v3(0, 0, 1.82), 'z', { size: 11, fill: '#8fa3bd' });
    cs.flush();

    const val = 2 * Math.PI * R * R;
    cC('$(0,\\ 0,\\ 2)$');
    cL(`$${fmt(val, 3)}$`);
    cS(`$${fmt(val, 3)}$`, 'ok');
    cJ('旋度处处竖直向上，穿过曲面的通量只取决于曲面张在赤道圆上这一件事，与曲面的隆起形状无关', 'ok');
  };

  B.slider('球半径 R', 1, 1.6, 0.02, st.R, v => { st.R = v; B.render(); }, 'R');
  orbit(B, cam, () => B.render());
  B.hintM('绿环是边界的方向，紫箭是旋度：旋度穿过曲面的总量等于沿边界的环量');
  B.render();
  return B;
}
