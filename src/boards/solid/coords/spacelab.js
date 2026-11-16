/* 图 标1 · 空间直角坐标系与坐标平面机
   三条坐标轴带箭头，三个坐标平面各一种颜色、半透明，铺上淡网格。
   拖动橙色手柄 P 在水平面内移动，z 滑块改高度；虚线拆出三个坐标读数，徽章读坐标、模长与所在卦限。 */
import { Board, mk } from '../../../lib/board.js';
import { v3, makeCam, Scene, view, orbit } from '../../../lib/solid3d.js';

const L = 3.0;                       // 轴长
const GRID = [-3, -2, -1, 0, 1, 2, 3];

export function createBoard(root) {
  const W = 820, H = 500;
  const B = new Board(root, W, H);
  const cam = makeCam({ cx: 410, cy: 252, s: 70, cz: 0 });
  const st = { x: 1.6, y: 1.2, z: 1.5 };
  const fz = v => (Math.round(v * 100) / 100).toFixed(2);
  const cA = B.chipM('点 P'), cB = B.chipM('到原点'), cC = B.chipM('所在位置'), cD = B.chipM('判读');

  const P = () => v3(st.x, st.y, st.z);
  const hp = B.handle({
    color: '#ff9e4a', r: 7, label: 'P', lo: [10, -9],
    get: () => { const q = view(P(), cam); return { x: q.x, y: q.y }; },
    set: p => {
      const q = view(P(), cam);
      const sa = Math.sin(cam.yaw), ca = Math.cos(cam.yaw), sb = Math.sin(cam.pitch);
      const ex = { x: -cam.s * sa, y: cam.s * ca * sb };
      const ey = { x: cam.s * ca, y: cam.s * sa * sb };
      const det = ex.x * ey.y - ey.x * ex.y;
      if (Math.abs(det) < 1e-6) return;
      const du = p.x - q.x, dv = p.y - q.y;
      st.x += (du * ey.y - dv * ey.x) / det;
      st.y += (ex.x * dv - ex.y * du) / det;
    },
    clamp: p => ({ x: Math.min(W - 12, Math.max(12, p.x)), y: Math.min(H - 40, Math.max(12, p.y)) }),
  });
  const qh = B.handles[B.handles.length - 1];

  /* 轴带箭头：箭身用三维线段，箭头在屏幕空间补三角 */
  const axis = (cs, to, name, col, lab) => {
    cs.line(v3(-to.x, -to.y, -to.z), to, { stroke: col, w: 2, op: 0.95 });
    const q0 = cs.P(v3(0, 0, 0)), q1 = cs.P(to);
    const dx = q1.x - q0.x, dy = q1.y - q0.y, len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
    const at = (t, s) => `${(q1.x - ux * 14 * t + nx * 6 * s).toFixed(1)},${(q1.y - uy * 14 * t + ny * 6 * s).toFixed(1)}`;
    cs.push(q1.d + 0.6, () => mk('polygon',
      { points: `${q1.x.toFixed(1)},${q1.y.toFixed(1)} ${at(1, 1)} ${at(1, -1)}`, fill: col, stroke: 'none' }, B.dyn));
    cs.label(to, lab, { dx: ux * 18, dy: uy * 18 + 4, size: 14, fill: col });
    return name;
  };

  B.renderFn = () => {
    const cs = new Scene(B, cam);
    // 三个坐标平面：先铺面与网格
    const plane = (e1, e2, col) => {
      const c = [v3(-3, -3, 0), v3(3, -3, 0), v3(3, 3, 0), v3(-3, 3, 0)];
      const pt = (u, w) => v3(e1.x * u + e2.x * w, e1.y * u + e2.y * w, e1.z * u + e2.z * w);
      cs.poly(c.map(q => pt(q.x, q.y)), { fill: col, op: 0.07 });
      for (const t of GRID) {
        cs.line(pt(t, -3), pt(t, 3), { stroke: col, w: 1, op: 0.16 });
        cs.line(pt(-3, t), pt(3, t), { stroke: col, w: 1, op: 0.16 });
      }
    };
    plane(v3(1, 0, 0), v3(0, 1, 0), '#5cadff');   // xOy
    plane(v3(0, 1, 0), v3(0, 0, 1), '#4ade80');   // yOz
    plane(v3(1, 0, 0), v3(0, 0, 1), '#c084fc');   // zOx

    axis(cs, v3(L, 0, 0), 'x', '#ff7b8a', 'x');
    axis(cs, v3(0, L, 0), 'y', '#67e8f9', 'y');
    axis(cs, v3(0, 0, L), 'z', '#ffd166', 'z');
    cs.label(v3(0, 0, 0), 'O', { dx: -12, dy: 12, size: 13, fill: '#8fa3bd' });

    // 点 P 与三条投影虚线
    const p = P(), pxy = v3(p.x, p.y, 0);
    cs.line(p, pxy, { stroke: '#ff9e4a', w: 1.5, op: 0.85, dash: '5 4' });
    cs.line(pxy, v3(p.x, 0, 0), { stroke: '#ff7b8a', w: 1.5, op: 0.85, dash: '5 4' });
    cs.line(pxy, v3(0, p.y, 0), { stroke: '#67e8f9', w: 1.5, op: 0.85, dash: '5 4' });
    cs.line(p, v3(0, 0, p.z), { stroke: '#ffd166', w: 1.2, op: 0.4, dash: '4 5' });
    cs.dot(pxy, 3.6, { fill: '#8fa3bd' });
    cs.label(pxy, 'P′', { dx: 12, dy: 12, size: 12, fill: '#8fa3bd' });
    cs.dot(v3(0, 0, p.z), 3.6, { fill: '#ffd166' });

    // 坐标读数
    const zx = (n) => (Math.abs(n - Math.round(n)) < 1e-6 ? String(Math.round(n)) : fz(n));
    cA(`$P(${zx(p.x)},\\ ${zx(p.y)},\\ ${zx(p.z)})$`);
    cB(`$${fz(Math.hypot(p.x, p.y, p.z))}$`);
    const sg = v => (v > 1e-6 ? 1 : v < -1e-6 ? -1 : 0);
    const s3 = [sg(p.x), sg(p.y), sg(p.z)];
    const OCTV = [[1, 1, 1], [-1, 1, 1], [-1, -1, 1], [1, -1, 1], [1, 1, -1], [-1, 1, -1], [-1, -1, -1], [1, -1, -1]];
    const on = ['yOz 平面', 'zOx 平面', 'xOy 平面'];   // x=0 落后者的面，y=0 落左后面的面，z=0 落底下的面
    if (s3.includes(0)) {
      const zeros = s3.map((v, i) => (v === 0 ? on[i] : null)).filter(Boolean);
      cC(zeros.join('、'));
      cD(zeros.length > 1 ? '两条坐标轴的交点，就是原点 O' : '有一个坐标为零，点落在一张坐标平面上');
    } else {
      const k = OCTV.findIndex(o => o[0] === s3[0] && o[1] === s3[1] && o[2] === s3[2]);
      cC(`第${'ⅠⅡⅢⅣⅤⅥⅦⅧ'[k]}卦限`);
      cD('三个坐标都非零，点落在某一个卦限的内部');
    }
    cs.flush();
  };

  B.slider('高 z', -3, 3, 0.1, st.z, v => { st.z = v; B.render(); }, 'z');
  B.btn('重置视角', () => { cam.yaw = Math.PI / 4; cam.pitch = 0.36; B.render(); });
  orbit(B, cam, () => B.render());
  B.hint('拖动 P 在水平面内走，z 滑块抬高它');
  B.render();
  return B;
}
