/* 图 重4 · 三重积分机（先一后二与先二后一）
   区域 Ω 是圆柱 x²+y²≤1、0≤z≤2，被积函数 f=1+z。
   ① 先一后二：在底面圆盘上取一点，沿竖直方向穿一根线，内层对 z 积完得到一个数；
   ② 先二后一：在高度 z₀ 处横切一片圆盘，先对这片圆盘积，再把结果对 z 积一遍。
   两种顺序把同一个三重积分拆成三层一元积分，结果都等于 4π。 */
import { Board, V, fmt, mk } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, circle3 } from '../../../lib/solid3d.js';

const R = 1, ZH = 2;   // 圆柱半径与高（勿用 H，createBoard 里的画板高度 H 会遮蔽它）
const F = (x, y, z) => 1 + z;
const TOTAL = 4 * Math.PI;

const CAM0 = { yaw: 0.72, pitch: 0.34, s: 92, cx: 400, cy: 250, cz: 1 };

export function createBoard(root) {
  const W = 820, H = 440;
  const B = new Board(root, W, H);
  const st = { m: 0, r: 0.55, th: 40, z: 1.1 };
  const cam = makeCam({ ...CAM0 });
  const c1 = B.chipM('内层积分'), c2 = B.chipM('外层积分'), c3 = B.chipM('合计');
  B.btn('重置视角', () => { Object.assign(cam, CAM0); B.render(); });

  const ex = v3(1, 0, 0), ey = v3(0, 1, 0), ez = v3(0, 0, 1);
  const disk = z => {
    const out = [];
    for (let i = 0; i < 60; i++) { const t = i / 60 * Math.PI * 2; out.push(v3(Math.cos(t), Math.sin(t), z)); }
    return out;
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);

    // 圆柱的上下底与侧棱
    cs.poly(disk(0), { fill: '#5cadff', op: .16 });
    cs.poly(disk(ZH), { fill: '#5cadff', op: .12 });
    for (let k = 0; k < 12; k++) {
      const t = k / 12 * Math.PI * 2;
      cs.line(v3(Math.cos(t), Math.sin(t), 0), v3(Math.cos(t), Math.sin(t), ZH), { stroke: '#3f5f8f', w: 1.1, op: .75 });
    }
    cs.path(circle3(v3(0, 0, 0), ex, ey, R), { stroke: '#5cadff', w: 1.8, op: .9 });
    cs.path(circle3(v3(0, 0, ZH), ex, ey, R), { stroke: '#5cadff', w: 1.8, op: .9 });

    // 坐标轴
    cs.line(v3(-1.5, 0, 0), v3(1.6, 0, 0), { stroke: '#8fa3bd', w: 1.2, op: .7 });
    cs.line(v3(0, -1.5, 0), v3(0, 1.6, 0), { stroke: '#8fa3bd', w: 1.2, op: .7 });
    cs.line(v3(0, 0, -0.4), v3(0, 0, 2.7), { stroke: '#8fa3bd', w: 1.2, op: .7 });
    cs.label(v3(1.65, 0, 0), 'x', { size: 12, fill: '#8fa3bd' });
    cs.label(v3(0, 1.65, 0), 'y', { size: 12, fill: '#8fa3bd' });
    cs.label(v3(0, 0, 2.85), 'z', { size: 12, fill: '#8fa3bd' });

    if (st.m === 0) {
      const th = st.th * Math.PI / 180, x = st.r * Math.cos(th), y = st.r * Math.sin(th);
      cs.line(v3(x, y, 0), v3(x, y, ZH), { stroke: '#ffd166', w: 2.6, op: .95 });
      cs.dot(v3(x, y, 0), 4.5, { fill: '#ff9e4a' });
      cs.dot(v3(x, y, ZH), 4.5, { fill: '#ff9e4a' });
      cs.dot(v3(x, y, 0.6), 4, { fill: '#ffd166' });
      cs.label(v3(x, y, 0), '穿线', { size: 11, fill: '#ff9e4a', dx: 0, dy: 16 });
      const inner = 2 + ZH * ZH / 2;                        // ∫₀²(1+z)dz
      c1(`$\\int_0^{2}(1+z)\\,dz=${fmt(inner, 1)}$`);
      c2(`$\\iint_D ${fmt(inner, 1)}\\,d\\sigma=${fmt(inner * Math.PI, 2)}$`);
      c3(`$\\iiint_\\Omega(1+z)\\,dV=${fmt(TOTAL, 2)}$`);
    } else {
      const z = st.z;
      cs.poly(disk(z), { fill: '#67e8f9', op: .26, stroke: '#67e8f9', w: 1.6, lineOp: .9 });
      cs.label(v3(1.02, 0, z), '切片', { size: 11, fill: '#67e8f9', dx: 10 });
      cs.line(v3(0, 0, z), v3(1.35, 0, z), { stroke: '#67e8f9', w: 1.4, op: .9, dash: '5 4' });
      c1(`$\\iint_{D_z}(1+z)\\,d\\sigma=\\pi(${fmt(1 + z, 2)})$`);
      c2(`$\\int_0^{2}\\pi(1+z)\\,dz=${fmt(TOTAL, 2)}$`);
      c3(`$\\iiint_\\Omega(1+z)\\,dV=${fmt(TOTAL, 2)}$`);
    }
    cs.flush();
  };

  const wrap = e => e.parentNode || e.parent;   // 无头 mock 只有 parent
  const bts = ['① 先一后二（穿线）', '② 先二后一（切片）'].map((lab, i) => B.btnM(lab, () => {
    st.m = i; bts.forEach((b, j) => b.classList.toggle('on', j === i));
    if (sR) wrap(sR).style.display = i === 0 ? '' : 'none';
    if (sT) wrap(sT).style.display = i === 0 ? '' : 'none';
    if (sZ) wrap(sZ).style.display = i === 1 ? '' : 'none';
    B.render();
  }, { on: i === 0 }));

  const sR = B.slider('底面点到圆心的距离', 0, 0.9, 0.02, st.r, v => { st.r = v; B.render(); }, 'r');
  const sT = B.slider('底面点的极角', 0, 360, 5, st.th, v => { st.th = v; B.render(); }, 'th');
  const sZ = B.slider('切片高度 z', 0.1, 1.9, 0.02, st.z, v => { st.z = v; B.render(); }, 'z');
  wrap(sZ).style.display = 'none';
  orbit(B, cam, () => B.render());
  B.hintM('两种顺序都是「先算内层、结果再积」；穿线时内层对 $z$ 积，切片时内层对 $x,y$ 积');
  B.render();
  return B;
}
