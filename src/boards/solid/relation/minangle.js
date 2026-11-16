/* 图 位2b · 最小角定理机
   PO⊥α 于 O，PA 是斜线，AO 是 PA 在平面内的射影，AB 是平面内过斜足 A 的任一条直线。
   记线面角 ∠PAO=θ₁、射影与 AB 的夹角 ∠OAB=θ₂、斜线与 AB 的夹角 ∠PAB=θ，
   则 cosθ = cosθ₁cosθ₂ ≤ cosθ₁，即 θ ≥ θ₁；AB 与射影重合时取等。
   拖动「方向 φ」滑块转动 AB：θ 随 φ 单调增大，φ=0 处落到最小值 θ₁。 */
import { Board } from '../../../lib/board.js';
import { v3, makeCam, Scene, orbit, rightMark3, arc3, add3, mul3, unit3 } from '../../../lib/solid3d.js';

const OA = 2.0, L = 1.4;

export function createBoard(root) {
  const W = 800, H = 460;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 470, cy: 210, s: 105, cz: 0.75, yaw: 0.9, pitch: 0.36 });
  const st = { phi: 45, h: 1.5 };
  const fz = v => (Math.round(v * 10) / 10).toFixed(1);
  const cA = B.chipM('线面角'), cB = B.chipM('两夹角'), cC = B.chipM('余弦关系'), cD = B.chipM('判读');

  const O = v3(0, 0, 0);
  const A = v3(OA, 0, 0);
  const P = () => v3(0, 0, st.h);
  const Bp = () => {
    const f = st.phi * Math.PI / 180;
    return add3(A, add3(mul3(v3(-1, 0, 0), L * Math.cos(f)), mul3(v3(0, 1, 0), L * Math.sin(f))));
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    const p = P(), b = Bp();
    const ap = v3(-OA, 0, st.h), ao = v3(-OA, 0, 0), ab = v3(b.x - A.x, b.y, 0);
    const ang = (u, w) => Math.acos(Math.max(-1, Math.min(1,
      (u.x * w.x + u.y * w.y + u.z * w.z) / (Math.hypot(u.x, u.y, u.z) * Math.hypot(w.x, w.y, w.z))))) * 180 / Math.PI;
    const t1 = ang(ap, ao), t2 = st.phi, th = ang(ap, ab);
    const cosT = Math.cos(t1 * Math.PI / 180) * Math.cos(t2 * Math.PI / 180);

    // 平面 α
    cs.poly([v3(-0.9, -1.6, 0), v3(3.3, -1.6, 0), v3(3.3, 1.9, 0), v3(-0.9, 1.9, 0)],
      { fill: '#5cadff', op: 0.12, stroke: '#5cadff', w: 1.3, lineOp: 0.55 });

    // 垂线 PO、射影 AO、斜线 PA、平面内的 AB、连线 PB
    cs.line(O, p, { stroke: '#8fa3bd', w: 1.6, op: 0.85, dash: '6 5' });
    cs.line(A, O, { stroke: '#5cadff', w: 2.4, op: 1 });
    cs.line(A, p, { stroke: '#ffd166', w: 2.6, op: 1 });
    cs.line(A, b, { stroke: '#4ade80', w: 2.4, op: 1 });
    cs.line(p, b, { stroke: '#c084fc', w: 1.5, op: 0.6, dash: '5 4' });
    rightMark3(cs, O, p, A, 0.17, { stroke: '#8fa3bd', w: 1.4, op: .9 });

    // 三个角：θ₁ 金、θ₂ 青、θ 紫，半径逐个放大避免叠在一起
    arc3(cs, A, p, O, 0.44, { stroke: '#ffd166', w: 1.6, op: .95 });
    arc3(cs, A, O, b, 0.62, { stroke: '#67e8f9', w: 1.6, op: .95 });
    arc3(cs, A, p, b, 0.82, { stroke: '#c084fc', w: 1.6, op: .95 });

    // 角标注：沿两条射线的角平分方向外移
    const lm = (p1, p2, rad) => mul3(unit3(add3(unit3(v3(p1.x - A.x, p1.y - A.y, p1.z - A.z)),
      unit3(v3(p2.x - A.x, p2.y - A.y, p2.z - A.z)))), rad);
    const l1 = lm(p, O, 0.56), l2 = lm(O, b, 0.76), l3 = lm(p, b, 0.98);
    cs.label(add3(A, l1), 'θ₁', { size: 13, fill: '#ffd166' });
    cs.label(add3(A, l2), 'θ₂', { size: 13, fill: '#67e8f9' });
    cs.label(add3(A, l3), 'θ', { size: 13, fill: '#c084fc' });

    cs.dot(O, 3.6, { fill: '#8fa3bd' });
    cs.dot(A, 3.6, { fill: '#5cadff' });
    cs.dot(p, 4, { fill: '#ffd166' });
    cs.dot(b, 4, { fill: '#4ade80' });
    cs.label(p, 'P', { dx: -12, dy: -6, size: 14, fill: '#ffd166' });
    cs.label(O, 'O', { dx: -14, dy: 12, size: 13, fill: '#8fa3bd' });
    cs.label(A, 'A', { dx: 4, dy: 18, size: 14, fill: '#5cadff' });
    cs.label(b, 'B', { dx: 10, dy: -8, size: 14, fill: '#4ade80' });
    cs.label(v3(-0.7, 1.7, 0), 'α', { dx: 8, dy: 0, size: 14, fill: '#5cadff' });

    cA(`$\\theta_1=${fz(t1)}^\\circ$`);
    cB(`$\\theta_2=${fz(t2)}^\\circ,\\quad \\theta=${fz(th)}^\\circ$`);
    cC(`$\\cos\\theta=\\cos\\theta_1\\cos\\theta_2=${fz(cosT)}$`);
    cD(t2 < 0.5 ? 'AB 与射影 AO 重合：θ 取最小值 θ₁，等号成立'
      : t2 > 89.5 ? 'AB 与射影垂直：θ=90°，这是平面内与斜线成角最大的一条'
        : 'θ > θ₁：平面内其它直线与斜线的夹角都比线面角大');
    cs.flush();
  };

  let sPhi, sH;
  const PRE = [
    { nm: '① AB∥AO', v: 0 },
    { nm: '② 一般位置', v: 45 },
    { nm: '③ AB⊥AO', v: 90 },
  ];
  const btns = PRE.map((p, i) => B.btn(p.nm, () => {
    st.phi = p.v;
    if (sPhi && sPhi.sync) sPhi.sync(p.v);
    btns.forEach((b, j) => b.classList.toggle('on', j === i));
    B.render();
  }, { on: i === 1 }));
  sPhi = B.slider('方向 φ°', 0, 90, 1, st.phi, v => { st.phi = v; B.render(); }, 'phi');
  sH = B.slider('高度 PO', 0.8, 2.2, 0.05, st.h, v => { st.h = v; B.render(); }, 'h');
  B.btn('重置视角', () => { cam.yaw = 0.9; cam.pitch = 0.36; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('转动 AB 的方向：φ=0 时 θ 最小，等于线面角 θ₁');
  B.render();
  return B;
}
